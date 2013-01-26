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

	# add "enabled" and "disabled" classes for True/Fake button
	def add_vote_class (vote, button)
		if ! vote.nil?
			if button == vote.value  
				"enabled"
			else
				"disabled"
			end
		end
	end

	def timeago(time, options = {})
	  options[:class] ||= "timeago"
	  content_tag(:abbr, time.to_s, options.merge(:title => time.getutc.iso8601)) if time
	end

end
