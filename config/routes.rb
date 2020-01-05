Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :users do
    resources :tasks
    resources :tags
  end

  get "loggedin", to: "sessions#loggedin"
  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy"
  get "welcome", to: "sessions#welcome"

  get "*path", to: "sessions#welcome"

  root "sessions#welcome"
end
