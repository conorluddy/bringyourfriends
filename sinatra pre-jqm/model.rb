

require 'data_mapper'
require 'dm-sqlite-adapter'
require 'bcrypt'

# SQLite
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/developmentv0.2.1.db")
DataMapper::Model.raise_on_save_failure = true

# 
# 
# user has trips once invite accepted
# trips have users and an owner
# 
# user has invitations
# invitations have users
# 
# trips have an invitation
# invitations have a trip
# 
# 

class User
	include DataMapper::Resource
	include BCrypt

	property :id, 		Serial, 	:key => true
	property :facebookId, 	String
	property :username, 	String
	property :firstname,	String
	property :lastname,	String
	property :email,		String
	property :latlon, 	String
	property :joined_at,	DateTime

	has n, :friendships, :child_key => [ :source_id ]
	has n, :friends, self, :through => :friendships, :via => :target

	has n, :invitations
	has n, :trips
end



class Friendship
	include DataMapper::Resource

	belongs_to :source, 'User', :key => true
	belongs_to :target, 'User', :key => true
end





class Trip
	include DataMapper::Resource

	property 	:id, 			Serial, 	:key => true

	property 	:created_at,	DateTime
	property 	:startTime, 	DateTime
	property 	:etaTime, 		DateTime	
	
	property 	:startLat, 		String
	property 	:startLon, 		String
	property 	:endLat, 		String
	property 	:endLon, 		String

	property 	:seats, 		Integer

	belongs_to 	:user

	has n, 	:invitations
	has n, 	:users, 		:through => :invitations
end





class Invitation
	include DataMapper::Resource

	property :id, 		Serial, 	:key => true

	property :accepted, 	Boolean,	:default  => false
	property :expired, 	Boolean,	:default  => false
	property :seen, 		Boolean,	:default  => false
	property :rsvp, 		Boolean,	:default  => false
	property :rsvpseen, 	Boolean,	:default  => false

	property :message, 	String
	property :reply,		String

	belongs_to :trip
	belongs_to :user
end




DataMapper.finalize
DataMapper.auto_upgrade!




# @newUser = User.create(:firstname => "Sara M. Hamdy Khalifa", :facebookId => "517303108", :latlon => "-9.134945286205038 53.26275593814607")
# @newUser.save;
# @newUser = User.create(:firstname => "James Daly", :facebookId => "518024595", :latlon => "-9.213909519603476 53.31119278047903")
# @newUser.save;
# @newUser = User.create(:firstname => "Cathal MacFadden", :facebookId => "516852664", :latlon => "-9.040874851634726 53.305038600930125")
# @newUser.save;
# @newUser = User.create(:firstname => "Nicholas Pym", :facebookId => "520217748", :latlon => "-9.026455295970663 53.283286727934325")
# @newUser.save;
# @newUser = User.create(:firstname => "Adrian Hanley", :facebookId => "520560403", :latlon => "-9.060787571361288 53.26234522177248")
# @newUser.save;
# @newUser = User.create(:firstname => "Darragh Jones", :facebookId => "522385578", :latlon => "-9.084820164134726 53.267684226962594")
# @newUser.save;
# @newUser = User.create(:firstname => "Emma Flaherty", :facebookId => "523996688", :latlon => "-8.755230320384726 53.29806279167147")
# @newUser.save;
# @newUser = User.create(:firstname => "Donna Bohan", :facebookId => "524381080", :latlon => "-8.950237644603476 53.23276327563723")
# @newUser.save;
# @newUser = User.create(:firstname => "Caitriona Glynn", :facebookId => "524393809", :latlon => "-9.021648777415976 53.29067539862712")
# @newUser.save;
# @newUser = User.create(:firstname => "Maureen Furlong", :facebookId => "525575738", :latlon => "-9.071087253978476 53.28533926462493")
# @newUser.save;
# @newUser = User.create(:firstname => "Niall Carroll", :facebookId => "525801826", :latlon => "-8.224453342845663 53.31734607296147")
# @newUser.save;
# @newUser = User.create(:firstname => "Wesley Keating", :facebookId => "530549127", :latlon => "-8.565029514720663 53.19740247663604")
# @newUser.save;
# @newUser = User.create(:firstname => "Andrea MacDonald", :facebookId => "535196033", :latlon => "-8.989376438548788 53.270148158376806")
# @newUser.save;
# @newUser = User.create(:firstname => "Graham Dolan", :facebookId => "533066619", :latlon => "-9.074520481517538 53.27220132608967")
# @newUser.save;
# @newUser = User.create(:firstname => "Regina Farrell", :facebookId => "533430137", :latlon => "-8.988689793040976 53.28657073931624")
# @newUser.save;
# @newUser = User.create(:firstname => "Duncan Keith", :facebookId => "534990235", :latlon => "-8.941311253001913 53.35055852628532")
# @newUser.save;
# @newUser = User.create(:firstname => "David Hayes", :facebookId => "5351103172", :latlon => "-9.096493137767538 53.29601086620156")
# @newUser.save;



