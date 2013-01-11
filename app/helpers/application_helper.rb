module ApplicationHelper

	def circle_list
		t = ""
		if user_signed_in? 
			current_user.circles.each do |c|
				t << "<li data-id=\"#{c.id}\"><a href=\"#\">#{c.name}</a></li>"
			end
		end
		return t.html_safe
	end

	def timeago(time, options = {})
	  options[:class] ||= "timeago"
	  content_tag(:abbr, time.to_s, options.merge(:title => time.getutc.iso8601)) if time
	end

end
