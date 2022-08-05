desc 'Set to all active object_items notactive null'

namespace :set_to_all_active_object_items_notactive_null do
  task run: :environment do
    error_counter = 0
    object_items = ObjectItem.where("
         object_items.object_type_id = 1
     AND object_items.id NOT IN (
                       SELECT oi2.id
                         FROM object_items oi2
                         LEFT OUTER JOIN meta_values m2 ON m2.metable_id = oi2.id
                                                       AND m2.meta_field_id = 17
                                                       AND m2.metable_type = 'ObjectItem'
                        WHERE oi2.object_type_id = 1
                          AND m2.value IS NOT NULL
                      )
      ")
    object_items.each do |oi|
      meta = MetaValue.create!(
        value:         nil,
        meta_field_id: Rails.configuration.notactive_desk_id,
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