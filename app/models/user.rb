class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :nickname, :circles_names, :name, :invitation_token, :terms, :retry_count, :roles_mask
  # attr_accessible :title, :body

  attr_accessor :terms, :retry_count

  # has_many :followers
  # has_many :followers_users, :through => :followers, :source => :user
  has_many :gossips
  has_many :likes
  has_many :gossip_votes
  has_many :votes, :through => :gossip_votes, :source => :gossip
  has_many :comments
  has_many :circle_users
  has_many :circles, :through => :circle_users
  has_many :gossips_feed, :through => :circles, :source => :gossips
  has_one :invite

  has_many :relationships, foreign_key: "follower_id", dependent: :destroy
  has_many :followed_users, through: :relationships, source: :followed

  has_many :reverse_relationships, foreign_key: "followed_id",
                                   class_name:  "Relationship",
                                   dependent:   :destroy
  has_many :followers, through: :reverse_relationships, source: :follower


  after_create :send_welcome_mail

  # def self.from_omniauth(auth)
  #   where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
  #     user.provider = auth.provider
  #     user.uid = auth.uid
  #     user.name = auth.info.name
  #     user.email = auth.info.email
  #     user.oauth_token = auth.credentials.token
  #     user.oauth_expires_at = Time.at(auth.credentials.expires_at)
  #     user.save!
  #   end
  # end

  validates_presence_of :nickname
  validates_uniqueness_of :nickname, :message => "Sorry, that nickname is already taken"
  validates :nickname, :length => { :minimum => 4 }
  validates_presence_of :invitation_token, :message => "You need an invite to sign up", :on => :create, :if => lambda { INVITE_ONLY }
  validate :invitation_token_valid, :if => lambda { INVITE_ONLY } && :invitation_token, :on => :create  
  validates_acceptance_of :terms
  validate :increase_retry_count

  #named_scope :with_role, lambda { |role| {:conditions => "roles_mask & #{2**ROLES.index(role.to_s)} > 0 "} }

  ROLES = %w[admin moderator gossiper new_user banned]


  def self.from_omniauth(auth)
  Rails.logger.debug("My object: #{auth.to_yaml}")
    where(auth.slice(:provider, :uid)).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      #user.nickname = auth.info.nickname
      user.name = auth.info.name
      user.email = auth.info.email
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
    end
  end
  
  def self.new_with_session(params, session)
    if session["devise.user_attributes"]
      new(session["devise.user_attributes"], without_protection: true) do |user|
        user.attributes = params
        user.valid?
      end
    else
      super
    end
  end

  #TODO: Optimize this to accept a list of posts
  def already_likes?(post_id)
    self.likes.find(:all, conditions: ['gossip_id = ?', post_id ]).size>0
  end  

  def voted(post_id)
    self.gossip_votes.find(:first, conditions: ['gossip_id = ?', post_id])
  end
  
  def already_joined?(circle_id)
    self.circles.find(:all, conditions: ['circle_id = ?', circle_id ]).size>0
  end

  # def already_follows?(follower_id)
  #   self.followers.find(:all, conditions: ['follower_id = ?', follower_id ]).size>0
  # end

  def already_follows?(other_user_id)
    relationships.find_by_followed_id(other_user_id)
  end

  # def follow!(other_user)
  #   relationships.create!(followed_id: other_user.id)
  # end  

  def already_follows_fb?(follower_fbid)
    already_follows?(User.find_by_uid(follower_fbid.to_s))
  end  

  def password_required?
    super #&& provider.blank?
  end

  def update_with_password(params, *options)
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

  def roles=(roles)
    self.roles_mask = (roles & ROLES).map { |r| 2**ROLES.index(r) }.inject(0, :+)
  end

  def roles
    ROLES.reject do |r|
      ((roles_mask || 0) & 2**ROLES.index(r)).zero?
    end
  end

  def is?(role)
    roles.include?(role.to_s)
  end


  def increase_retry_count
    self.retry_count = self.retry_count.nil? ? 0 : self.retry_count + 1
  end

  #send confirmation email after creating the user
  def send_welcome_mail
    UserMailer.signup_confirmation(self).deliver
  end

  def facebook
    @facebook ||= Koala::Facebook::API.new(oauth_token)
  end

  # pizda masii de metoda!!
  # nu mai scrie nimic dupa asta, ca nu iti ia
  def self.get_fb_friends()
      if self.provider != "facebook"
        user = User.where("email = ? AND provider = ?", "sucalas_lab@yahoo.com", "facebook").first
      end
      return self.facebook.get_connection("me", "friends")
    rescue Koala::Facebook::APIError
      logger.info e.to_s
      e.to_s
    end

  end

  private 

  def invitation_token_valid
    return if invitation_token.blank?
    unless Invite.find_by_token(self.invitation_token)
      errors.add :invitation_token, 'Invitation code is not valid'
  end

end
