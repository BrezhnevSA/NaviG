desc 'Set to all object_items status field off'

namespace :set_to_all_object_items_status_field_off do
  task run: :environment do
    error_counter = 0
    object_items = ObjectItem.joins("
        LEFT JOIN meta_values ON object_items.id = meta_values.metable_id
                           AND meta_values.metable_type = 'ObjectItems'
                           AND meta_values.meta_field_id = #{Rails.configuration.object_state_id}
      ").where("
        NOT EXISTS (
          SELECT  -- SELECT list mostly irrelevant; can just be empty in Postgres
          FROM   meta_values
          WHERE  id = object_items.id
        )
      ")
    object_items.each do |oi|
      meta = MetaValue.create!(
        value:         'off',
        meta_field_id: Rails.configuration.object_state_id,
        metable_type:  'ObjectItem',
        metable_id:    oi[:id],
        )
      if meta.save
        puts "row in meta_value table for object_item with id=#{oi[:id]} created"
      else
        puts "ERROR: row in meta_value table for object_item with id=#{oi[:id]} not created"
        error_counter+= 1
      end
    end
    puts "finished. Errors: #{error_counter}"
  end
end