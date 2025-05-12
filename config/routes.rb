Rails.application.routes.draw do
  devise_for :users
  
  resources :events do
    resources :registrations, only: [:index]
  end
  
  resources :registrations, only: [:create, :destroy]
  
  # Rută pentru pagina de dashboard
  get 'dashboard', to: 'dashboard#index'
  
  # Rute pentru WebRTC
  get 'events/:id/room', to: 'events#room', as: 'event_room'
  
  # Redirecționare la dashboard după login
  devise_scope :user do
    authenticated :user do
      root to: 'dashboard#index', as: :authenticated_root
    end
    
    unauthenticated do
      root to: 'events#index', as: :unauthenticated_root
    end
  end
end
