class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    @user = user || User.new # for guest
    @user.roles.each { |role| send(role) }

    if @user.roles.size == 0
      #can :read, :all #for guest without roles
    end
    #
    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities

  end

  def new_user
  end

  def gossiper
    can :read, Circle   
    can :create, Circle

    can :read, Comment
    can :create, Comment

    can :read, Gossip
    can :create, Gossip
  end

  def moderator
    #gossiper
    can :manage, Circle
    can :manage, Comment
    can :manage, Gossip
  end

  def admin
    can :manage, :all
  end
end
