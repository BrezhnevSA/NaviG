Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do

      match 'login', to: 'auth#login', via: [:post] #in api
      match 'get_user_by_token', to: 'auth#get_user_by_token', via: [:get] #in api
      
      # permissions management
      resources :rights #in api
      resources :groups_rights #in api
      resources :groups #in api
      resources :roles #in api
      delete 'roles/'                 => 'roles#delete_roles_by_rolable_id' #in api
      post 'groups_rights_multiple'   => 'groups_rights#add_groups_rights' #in api
      delete 'groups_rights_multiple' => 'groups_rights#delete_groups_rights' #in api
      # put    'roles/' => 'roles#update_roles' #? seems unneeded, if will be no need till november 2020 - remove
      # post   'roles/' => 'roles#add_roles' #? seems unneeded, if will be no need till november 2020 - remove

      resources :positions #in api

      # employees routes
      resources :employees #in api have some useless methods, may be delete it? need to check
      resources :employees_adds #in api

      # properties resources
      get 'meta/:type/:id'  => 'meta_values#show' #in api
      post 'meta/:type/:id' => 'meta_values#update' #in api
      post '/meta/add_contract_reference' => 'meta_values#add_contract_reference'  #TODO: delete this
      put '/meta/update_contract_reference' => 'meta_values#update_contract_reference'  #TODO: delete this
      delete '/meta/delete_contract_reference/:value' => 'meta_values#destroy_contract_reference'  #TODO: delete this
      put '/meta/update_one_metavalue' => 'meta_values#update_one_metavalue' #in api

      # basic entities CRUD
      post 'get_contracts' => 'contracts#index' #in api
      resources :contracts #in api

      resources :cities #in api
      resources :offices #in api
      resources :buildings #in api
      post 'get_heartbeats' => 'heartbeats#index' #in api
      resources :heartbeats #in api

      resources :object_types #in api
      resources :location_types #in api

      resources :meta_fields #in api
      resources :meta_maps #in api
      resources :meta_types #in api

      resources :available_dates_for_parking #in api

      # floors resources
      resources :floors #in api
      get 'floors/:id/plan' => 'floors#plan' #in api
      post 'floors/:id/lock' => 'floors#lock' #in api
      
      resources :floors_configs #in api
      
      post 'floor_details/:id' => 'floors#update_details' #in api
      # get 'tooltip/:desk_id' => 'floors#get_place_short_info'

      resources :object_items # depending of floors #in api
      post '/locations/not_in_contract' => "locations#locations_not_in_contract" #in api
      resources :locations # depending of floors #in api

      # city/office/building system
      get 'cob/offices/:city_id'      => 'offices#get_offices_for_city' #get offices in city #in api
      get 'cob/buildings/:office_id'  => 'buildings#get_buildings_for_office' #get buildings in office #in api
      get 'cob/floors/:building_id'   => 'floors#get_floors_for_building' #get floors in building #in api

      # search resources
      get 'search/employees_on_place'      => 'search#employees_on_place' #in api
      get 'search/employees_with_no_place' => 'search#employees_with_no_place' #in api
      get 'search/rooms_and_locations'     => 'search#rooms_and_locations' #in api
      get 'search/objects_and_desks'       => 'search#objects_and_desks' #in api
      get 'search/employees_for_group'     => 'search#employees_for_group' #in api

      # search
      get 'search/employees'               => 'search#employees' #in api
      get 'search/places'                  => 'search#all_ds_places' #in api
      get 'search/costcenters'             => 'search#costcenters' #in api
      get 'search/costcenters/all'         => 'search#all_costcenters' #in api
      get 'search/projects'                => 'search#projects' #in api
      get 'search/projects/all'            => 'search#all_projects' #in api
      get 'search/locations'               => 'search#locations' #in api
      get 'search/employees_in_costcenter' => 'search#employees_in_costcenter' #in api
      get 'search/employees_in_project'    => 'search#employees_in_project' #in api
      get 'search/stats'                   => 'search#stats' #in api
      get 'search/results/:target'         => 'search#results' #in api
      post '/search/employees/all'         => 'search#employees_all_info' #in api
      post '/search/inventory_all'         => 'search#inventory_all' #in api

      #searcg for contracts
      get '/search/locations_for_contract/' => 'search#locations_for_contract' #in api

      # search for chat-bot
      get 'search/places_info'    => 'search#places_info' #in api
      get '/search/employees_all' => 'search#employees_all' #in api

      # reports
      get 'reports/generate_relocation_report'    => 'reports#relocation_report' #in api
      get 'reports/generate_meterage'             => 'reports#generate_meterage' #in api
      get 'reports/generate_costcenter_places'    => 'reports#generate_costcenter_places' #in api
      get 'reports/generate_reservations'         => 'reports#generate_reservations' #in api
      get 'reports/generate_non_seated_employees' => 'reports#generate_non_seated_employees' #in api
      post 'reports/send_report'                  => 'reports#send_report' #in api

      #bookings for chatbot
      get 'bookings/search_bookings' => 'bookings#search_bookings' #in api

      # bookings
      post 'bookings/search_available_places' => 'bookings#search_available_places' #in api
      post 'get_bookings' => 'bookings#index' #in api
      resources :bookings #in api

      #sdmanagers_costcenters
      get    'sdmanagers_costcenters/objects/info' => 'sdmanagers_costcenters#getLocationsInfo'#in api
      get    'sdmanagers_costcenters/objects/:id'  => 'sdmanagers_costcenters#getLocationInfo' #in api
      post   'sdmanagers_costcenters/objects'      => 'sdmanagers_costcenters#addObjectToLocation' #in api
      delete 'sdmanagers_costcenters/objects/:id'  => 'sdmanagers_costcenters#removeObjectFromLocation' #in api
      resources :sdmanagers_costcenters #in api
    end
  end

  #send ll non-api requests here
  get '*page', to: 'static#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
  root 'static#index'

end
