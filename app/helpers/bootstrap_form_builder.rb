 
class BootstrapFormBuilder < ActionView::Helpers::FormBuilder
 
  def text_field(method, options={})
    t = @template
    t.content_tag(:div, :class => "control-group clearfix#{' error' unless @object.errors[method].blank?}") {
      t.concat(t.content_tag(:div, :class => "input#{' error' unless @object.errors[method].blank?}") {
        t.concat(super method)
        if @object.errors[method].present?
           t.concat("<span class=\"help-inline\">#{@object.errors[method].is_a?(Array) ? @object.errors[method].first : @object.errors[method]}</span>".html_safe)
        end
      })
    }
  end
 
end
