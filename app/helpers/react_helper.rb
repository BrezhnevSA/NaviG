module ReactHelper
    def react_component(name, props = {})
      content_tag(:div, '', data: { react_component: { name: name, props: props } })
    end
end