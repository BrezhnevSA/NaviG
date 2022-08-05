
desc 'Parse maps from old navi\'s map builder'

require 'nokogiri'

namespace :parser do
    task run: :environment do

        # for debugging - set as false
        SAVING_STUFF = true
        # TODO: create system with free angles
        OBJECT_ROTATION_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
        # disstance from map borders
        MAP_PADDING = 20

        # checking if dot is outstanding from others
        def is_outstanding(point, dots)
            left_count = dots.select {|father| father["x"] < point["x"] }
            right_count = dots.select {|father| father["x"] > point["x"] }
            top_count = dots.select {|father| father["y"] > point["y"] }
            bottom_count = dots.select {|father| father["y"] < point["y"] }

            ((left_count.length == 0) || (right_count.length == 0) || (top_count.length == 0) || (bottom_count.length == 0))
        end

        # calculate disstance between dots
        def disstance(dot1, dot2)
            Math.sqrt((dot1['x'] - dot2['x']) * (dot1['x'] - dot2['x']) + (dot1['y'] - dot2['y']) * (dot1['y'] - dot2['y'])) 
        end

        # find closest dot in array to current
        def closest_dot(dot, dots)
            disstances = []
            #loop on dots
            dots.each_with_index do |checking_dot, index|
                closest_dot = {}
                # miss current dot
                if (checking_dot != dot)
                    # save all disstances
                    disstances.push({
                        disstance: disstance(dot, checking_dot),
                        index: index,
                        same_axe: (checking_dot['x'] == dot['x']) || (checking_dot['y'] == dot['y'])
                    })
                end
            end

            # check if some dots on same axe
            same_axe = disstances.select {|item| item[:same_axe] == true }
            if same_axe.length > 0
                same_axe = same_axe.sort_by { |hsh| hsh[:disstance] }
                closest_dot = dots[same_axe[0][:index]]
            else
                disstances_sorted = disstances.sort_by { |hsh| hsh[:disstance] }
                closest_dot = dots[disstances_sorted[0][:index]]
            end

            closest_dot
        end

        # sort dots for good polyline
        def sort_by_disstance(dots)
            dots_sorted = []
            # array of dots to check
            dots_remaining = dots
            # current dot is the first in array - could be any
            first_dot = dots[0]
            current_dot = first_dot
            while dots_remaining.length > 1 do
                # save current dot
                dots_sorted.push(current_dot)
                # remove current from remaining
                dots_remaining.delete(current_dot)
                # find closest dot
                closest_dot = closest_dot(current_dot, dots_remaining)
                # set closest as next current
                current_dot = closest_dot
            end
            # save last remaining dot
            dots_sorted.push(current_dot)
            # save again first dot to close polyline
            dots_sorted.push(first_dot)
            dots_sorted
        end

        def remove_same_axe(dots)

            remaining_dots = []
            dots.each_with_index do |dot, index|

                same_x = dots.select {|d| (d['x'] == dot['x']) && (d['y'] != dot['y'])}
                same_y = dots.select {|d| (d['y'] == dot['y']) && (d['x'] != dot['x'])}
                
                if same_x.length > 1

                    same_x = same_x.sort_by { |d| d['y'].to_i }

                    if (dot['y'].to_i > same_x.last['y'].to_i) || (dot['y'].to_i < same_x.first['y'].to_i)

                        remaining_dots.push(dot)
                    end

                elsif same_y.length > 1
                    same_y = same_y.sort_by { |d| d['x'].to_i }

                    if (dot['x'].to_i > same_y.last['x'].to_i) || (dot['x'].to_i < same_y.first['x'].to_i)
                        remaining_dots.push(dot)
                    end

                else
                    remaining_dots.push(dot)
                end
            end

            remaining_dots.uniq

        end

        # pray
        puts 'ĭn nōmine Pătris ĕt Fīliī ĕt Spīritūs Sānctī...'

        Dir.foreach(Rails.root.join('maps', 'parse')) do |fname|
            # get only xml
            if fname.include? "svg"
                puts "Parsing " + fname
    
                if SAVING_STUFF
                    # create new floor
                    new_floor = Floor.create!(
                        {name: fname, ord: 0, active: true, building_id: 1}
                    )
                    FloorsConfig.create!(
                        {plan: "plan.png", preview: "preview.png", parameters: nil, floor_id: new_floor['id']}
                    )
                end
    
                full_filename = Rails.root.join('maps', 'parse', fname)
                # read the file
                data = File.read(full_filename)
                @doc = Nokogiri::XML(data)
                # search for polygons
                characters = @doc.search("polygon")

                walls = []
                # loop on locations
                characters.each do |field|
                    input_string = field.to_s
                    str1_markerstring = 'points="'
                    str2_markerstring = '"/>'
                    dots = []
                    points = input_string[/#{str1_markerstring}(.*?)#{str2_markerstring}/m, 1].split(' ')
                    flag = 0
                    dot = {}
                    # fill x and y
                    points.each do |point|
                        if point.length > 0
                            if flag == 0
                                dot['x'] = point.to_i + MAP_PADDING
                                flag = 1
                            else
                                flag = 0
                                dot['y'] = point.to_i + MAP_PADDING
                                dots.push(dot)
                                walls.push(dot)
                                dot = {}
                            end
                        end
                    end

                    if SAVING_STUFF
                        Location.create!(
                            {
                                name: "New location",
                                description: nil,
                                costcenter: nil,
                                dots: JSON.generate(dots),
                                floor_id: new_floor['id'],
                                location_type_id: 2 # save all as openspaces
                            })
                    end
                end

                # remove doubles
                walls = walls.uniq
                #need to find outer dots to form outer walls location
                outer_dots = []
                # save only outstanding //TODO: check on outer angles, can miss a lot
                walls.each do |dot|
                    if is_outstanding(dot, walls)
                        outer_dots.push(dot)
                    end
                end

                # remove same axe dots
                outer_dots = remove_same_axe(outer_dots)

                # sort remaining to draw polyline
                outer_dots = sort_by_disstance(outer_dots)

                if SAVING_STUFF
                    # create outer walls location
                    Location.create!(
                        {
                            name: "location ",
                            description: nil,
                            costcenter: nil,
                            dots: JSON.generate(outer_dots),
                            floor_id: new_floor['id'],
                            location_type_id: 1
                        })
                end

                # find objects
                characters = @doc.search("g image")
                
                characters.each do |field|
                    if field.attr('width').to_i > 45 && !!field.attr('transform') #save only desks
                        if SAVING_STUFF
                            
                            str1_markerstring = 'rotate('
                            str2_markerstring = ')'
                            angles = field.attr('transform').to_s
                            angles = angles.split(str1_markerstring).last.split(str2_markerstring).first.split(" ")
                            angles = angles.map {|n| n.to_i.abs}

                            if (OBJECT_ROTATION_ANGLES.index(angles[0]))
                                angle = OBJECT_ROTATION_ANGLES.index(angles[0])
                            end

                            new_obj = ObjectItem.create!({
                                name: "",
                                comment: "",
                                angle: angle,
                                top: field.attr('y').to_i + MAP_PADDING,
                                left: field.attr('x').to_i + MAP_PADDING,
                                width: 50,
                                height: 50,
                                status: nil,
                                costcenter_num: nil,
                                employee_id: nil,
                                floor_id: new_floor['id'],
                                object_type_id: 1,
                                location_id: nil
                            })
                            meta = MetaValue.create!(
                                value:         'off',
                                meta_field_id: Rails.configuration.object_state_id,
                                metable_type:  'ObjectItem',
                                metable_id:    new_obj['id'],
                                )
                            meta.save
                        end
                    end
                end
            end
        end
    end
end



