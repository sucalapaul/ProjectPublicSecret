#config/initializers/linkify.rb
class String
 
	def linkify!
		self.gsub!(/\b((https?:\/\/|ftps?:\/\/|mailto:|www\.)([A-Za-z0-9\-_=%&@\?\.\/]+))\b/) {
			match = $1
			tail  = $3
			case match
				when /^www/     then  "<a href=\"http://#{match}\" target=\"_blank\" >#{match}</a>"
				when /^mailto/  then  "<a href=\"#{match}\" target=\"_blank\" >#{tail}</a>"
				else                  "<a href=\"#{match}\" target=\"_blank\" >#{match}</a>"
			end
		}
	end
	 
	def linkify
		self.dup.linkify!
	end
 
end