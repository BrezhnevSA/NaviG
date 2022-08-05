# Overview
T-Navi is an application for office navigation and handling offices maps.

# Tech
The application based on
  - Ruby (2.6.5) on Rails v.6
  - React v.16
  - PostgreSQL v.9.3 or up

## Installation
Create PostgreSQL database, place it's credentials into `config\database.yml`
Open and edit `\app\javascript\config\config.jsx`:
```javascript
module.exports = {
    baseUrl: 'http://localhost:3000/api/v1',
    baseUrlApp: 'http://localhost:3000'
}
```
Open `\app\javascript\components\App.jsx`:

paste
```javascript
import { createLogger } from "redux-logger";
```
instead of 
```javascript
//import { createLogger } from "redux-logger";
```
paste
```javascript
const loggerMiddleware = createLogger();
```
instead of 
```javascript
// const loggerMiddleware = createLogger();
```
paste
```javascript
          loggerMiddleware,
```
instead of 
```javascript
          // loggerMiddleware,
```
Open `\config\environments\development.rb` and `\config\environments\production.rb`:

paste
```ruby
  config.active_support.deprecation = :log
```
instead of
```ruby
  config.active_support.deprecation = false
```
delete this row
```ruby
  config.log_level = :fatal
```
Install ruby `2.6.5` (base installation), or `2.6.6` and set this version at `Gemfile` in the root of the project

For windows prefer to use wsl for installing ruby.

Install `yarn` and `npm` on your local enviroment

Then do
```sh
$ gem install bundler
$ bundle install
$ npm install
$ yarn install
$ rails db:migrate
$ rails server
```

If you have problem with mimemagic like this:
```sh
$ bundle install
Fetching gem metadata from https://rubygems.org/..........
Your bundle is locked to mimemagic (0.3.3), but that version could not be found
in any of the sources listed in your Gemfile. If you haven't changed sources,
that means the author of mimemagic (0.3.3) has removed it. You'll need to update
your bundle to a version other than mimemagic (0.3.3) that hasn't been removed
in order to install.
```
You should add to the last line of Gemfile this line:
```
gem 'mimemagic', github: 'mimemagicrb/mimemagic', ref: '01f92d86d15d85cfd0f20dabd025dcbd36a8a60f' 
```

If you have problems with installition of gems try this:
```sh
$ yum install postgresql-devel 
```

at the end visit `http://localhost:3000/`

To get the latest backup of DB you need to switch to the `beta` branch and use dump file `backup.dump`

If you have some problems with loading dump file see script at `test` branch named `load_data_from_beta.sh`. But basically, you need to do this:
```sh
$ rails db:drop
$ rails db:create
$ rails db:migrate
$ pg_restore -U postgres -d $DB_NAME $BACKUP_PATH
```

Frontend will be compiled on rails server running, but you have more options for:
```sh
$ ./bin/webpack - (compiling frontend one time) 
$ ./bin/webpack-dev-server - (run dev server with autocompiling) 
```

### Run backend tests
Fill auth data in `spec\auth_helper.rb` and run

```sh
$ bundle exec rspec
```

## Features
### Meta Fields system
This systems allows you to add field of any (if you described saving and browsing this data type in backend and frontend) type from web interface. It contains 3 basic entities:
  - `Meta Type` - ex. 'text', 'checkbox' - type of field, should have codebase for manipulation of each type
  - `Meta Field` - ex. 'Is colored', 'Responsible employee for equipment'
  - `Meta Map` - mapping field to entity type and subtype - ex. 'Is colored' mapped to ObjectItem with sybtype 'Printer'

### Permissions system
We have wide list of permissions, checked on both fronted and backend. Permission can be granted for group of users or for individual user

`Right` - basic entity, single 'permission', ex. 'see_reports'

`Group` - Group of users, ex. 'Managers'
  - has_many GroupsRights
  - has_many Roles

`GroupsRight` - record, storing single Right for some Group, ex. {group_id: 2, right_id: 1}
  - belongs_to Group
  - belongs_to Right

`Role` - setting user to Group by user id or by Position id
  - belongs_to Group
  - belongs_to :rolable - Position or Employee

### Map entities
There is 2 basic entities
 - `ObjectItem` - things like "desk", "printer" and other things, on frontend renders as div element
 - `Location` - outer walls and rooms, on frontend shows as polyline on map svg


# Project Structure
## Backend 
### Controllers
`auth_controller.rb` - handling authorization  
`bookings_controller.rb` - desks booking for desk sharing functionlity  
`buildings_controller.rb` - CRUD for buildings  
`cities_controller.rb` - CRUD for cities  
`employees_adds_controller.rb` - user additional information controll  
`employees_controller.rb` - basic user information handling  
`floors_configs_controller.rb` - floor additional information controll  
`floors_controller.rb` - floor data handling for view/edit maps  
`groups_controller.rb` - CRUD for user groulds  
`groups_rights_controller.rb` - CRUD rights for groups  
`heartbeats_controller.rb` - handling activity logs  
`location_types_controller.rb` - CRUD for location's types  
`locations_controller.rb` - CRUD for locations  
`meta_fields_controller.rb` - CRUD for meta fields  
`meta_maps_controller.rb` - CRUD for mapping meta fields to entities  
`meta_types_controller.rb` - CRUD for types of meta values  
`meta_values_controller.rb` - CRUD for meta values  
`object_items_controller.rb` - CRUD for object items  
`object_types_controller.rb` - CRUD for object types  
`offices_controller.rb` - CRUD for offices  
`positions_controller.rb` - CRUD for user positions  
`reports_controller.rb` - control of reports generation/browsing  
`rights_controller.rb` - CRUD for user rights  
`roles_controller.rb` - CRUD for user roles  
`sdmanagers_costcenters_controller.rb` - backend for sdmanagers functionality, to set costcenter to manager so he/she can control desk sharing for it's places  
`search_controller.rb` - backend for search functionality  

### Seeds
`db/seeds.rb` - seeds for entities with relatively small number of items  
`lib/tasks/employees_adds_import.rake.rb` - seed user's additional data  
`lib/tasks/employees_import.rb` - seed users  
`lib/tasks/floors_import.rb` - import real floors and it's data  

### API
WILL BE HERE

## Frontend
### Map components
Maps components palaced in `app/javascript/components/Pages/MapComponents/`
