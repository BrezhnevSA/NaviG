desc 'Change all not safe places to desk'

namespace :change_all_not_safe_places_to_desk do
  task run: :environment do
    desk_type = 1
    notactive_status = 'NOT_ACTIVE'
    error_counter = 0
    object_items = ObjectItem.where("
        object_items.object_type_id = 42
      ")
    object_items.each do |object|
      ObjectItem.update(object['id'], {
        :name => object['name'],
        :angle => object['angle'],
        :scale => object['scale'],
        :floor_id => object['floor_id'],
        :object_type_id => desk_type,
        :left => object['left'],
        :top => object['top'],
        :width => object['width'],
        :height => object['height'],
        :comment => object['comment'],
        :employee_id => object['employee_id'],
        :location_id => object['location_id'],
        :status => notactive_status
      });
      puts "row in object_items table with id=#{object[:id]} updated, object_item_type_id changed from 42 to #{desk_type}"
      meta = MetaValue.create!(
        value:         0,
        meta_field_id: Rails.configuration.notactive_desk_id,
        metable_type:  'ObjectItem',
        metable_id:    object['id'],
        )
      if meta.save
        puts "row in meta_value table for object_item with id=#{object[:id]} created"
      else
        puts "ERROR: row in meta_value table for object_item with id=#{object[:id]} not created"
        error_counter+= 1
      end
    end
    puts "finished. Errors: #{error_counter}"
  end
end