ProjectPublicSecret::Application.routes.draw do

  #devise_for :users
  # match 'auth/:provider/callback', to: 'sessions#create'
  # match 'auth/failure', to: redirect('/')
  # match 'signout', to: 'sessions#destroy', as: 'signout'


  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                     controllers: {omniauth_callbacks: "omniauth_callbacks",  :registrations => "registrations"}

  resources :circles    
  resources :gossips     
  resources :likes     
  resources :comments     
  resources :gossip_votes  
  resources :circle_users
  resources :users  
  resources :invites     

  root :to => 'gossips#index'

  get 'tags/:tag', to: 'circles#index', as: :tag
  get 'invited/:invite_token', to: 'invites#signup', as: :invite_token
  get 'signup/', to: 'invites#signup'

  get "home/contact"
  get "home/terms"
  get "home/index"
  match '/terms' => 'home#terms'
  match '/welcome' => 'home#index'
  match '/contact' => 'home#contact'

  get "users/index"

  post "circles/join"
  post "users/follow"
  post "circles/search"
  post "circles/mycircles"
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.


  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
