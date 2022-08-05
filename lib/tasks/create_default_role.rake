# encoding: utf-8

require 'nokogiri'

task :create_default_role => :environment do

    puts 'starting...'

    group = Group.create(name: 'Authorized')

    # Give rights
    GroupsRight.create!([
        {group_id: group.id, right_id: 1},
        {group_id: group.id, right_id: 2},
        {group_id: group.id, right_id: 6},
        {group_id: group.id, right_id: 7},
        {group_id: group.id, right_id: 9},
        {group_id: group.id, right_id: 41},
        {group_id: group.id, right_id: 42},
        {group_id: group.id, right_id: 45},
        {group_id: group.id, right_id: 46},
        {group_id: group.id, right_id: 50},
        {group_id: group.id, right_id: 51},
        {group_id: group.id, right_id: 55},
        {group_id: group.id, right_id: 56},
        {group_id: group.id, right_id: 90},
        {group_id: group.id, right_id: 93},
        {group_id: group.id, right_id: 94},
        {group_id: group.id, right_id: 91},
        {group_id: group.id, right_id: 36},
        {group_id: group.id, right_id: 37},
        {group_id: group.id, right_id: 60},
        {group_id: group.id, right_id: 61},
        {group_id: group.id, right_id: 65},
        {group_id: group.id, right_id: 66}
    ])
    
    puts 'ok I\'m out'

end