class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :nickname, :circles_names
  # attr_accessible :title, :body

  has_many :followers
  has_many :gossips
  has_many :likes
  has_many :gossip_votes
  has_many :votes, :through => :gossip_votes, :source => :gossip
  has_many :comments
  has_many :circle_users
  has_many :circles, :through => :circle_users

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
  validates_uniqueness_of :nickname


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


def facebook
  @facebook ||= Koala::Facebook::API.new(oauth_token)
end

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
