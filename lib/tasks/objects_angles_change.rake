# encoding: utf-8

require 'nokogiri'

task :objects_angles_change => :environment do

    puts 'changing angles format'

    old_angles = [0, 45, 90, 135, 180, 225, 270, 315]
    ObjectItem.all.each do |object_item|
        unless object_item.angle.nil?
            ObjectItem.update(object_item.id, {
                :angle => old_angles[object_item.angle]
            });
        end
    end
    
    puts 'seems done'

end