module ApplicationHelper

	def circle_list
		t = ""
		current_user.circles.each do |c|
			t << "<li data-id=\"#{c.id}\"><a href=\"#\">#{c.name}</a></li>"
		end
		return t.html_safe
	end

end
