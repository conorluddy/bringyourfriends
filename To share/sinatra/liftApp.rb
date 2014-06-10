require 'rubygems'
require 'sinatra'
# require 'slim'
require 'json'
# Auth
require 'omniauth'
require 'omniauth-facebook'
require 'omniauth-twitter'

require 'koala'

require './model'

require 'logger'
logger = Logger.new(STDOUT)
logger.level = Logger::DEBUG
logger.debug("Created logger")





class OmniAuthApp < Sinatra::Base
    
    enable :method_override
    
    configure do
      set :sessions, true
    end





    # OmniAuth builder
    # ----------------
    use OmniAuth::Builder do
      provider :facebook, '216691091856984','817d26ed7ea75721b1803db961e113cb', :info_fields => 'first_name,last_name,email'
    end
    









    
    # Landing page
    # ------------
    get '/' do
      erb :landing
    end
    











    
    # Auth callback
    # -------------
    get '/auth/:provider/callback' do

      session[:authed] = true

      logger = Logger.new(STDOUT)
      logger.level = Logger::DEBUG
      logger.debug("Authorised")


      #TODO:Need to branch here depending on who the provider is...

      @user = User.first_or_create({:facebookId => request.env['omniauth.auth'][:uid].to_s},
                                   {:facebookId => request.env['omniauth.auth'][:uid].to_s,
                                    :email      => request.env['omniauth.auth'][:info][:email].to_s,
                                    :firstname  => request.env['omniauth.auth'][:info][:first_name].to_s,
                                    :lastname   => request.env['omniauth.auth'][:info][:last_name].to_s,
                                    :joined_at  => Time.now })
      
      session[:user_id] = @user.id
      session[:oa_token] = request.env['omniauth.auth'][:credentials][:token].to_s

      
      redirect '/home'
    end

  
    # Auth Fail
    # ---------
    get '/auth/failure' do
      erb :authfail
    end

  
    # Auth de-authorised
    # ------------------
    get '/auth/:provider/deauthorized' do
      erb :deauth
    end
    

    # Log out
    # -------
    get '/logout' do
      session[:authed] = false
      redirect '/'
    end


























    
    # Landing/home page when logged in
    # ------------
    get '/home' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      @user = User.first(:id => session[:user_id])
      
      erb :home
    end
    























    # Map page / new trip
    # -------
    get '/newtrip' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]  
      erb :new_trip
    end




    # Save the first part of the trip
    # -------
    post '/trip/save' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      logger = Logger.new(STDOUT)
      logger.level = Logger::DEBUG

      tripowner = User.first(:id => session[:user_id])

      # Create the trip 
      trip = Trip.create({
        :created_at => Time.now,
        :startTime => Time.now,
        :etaTime => Time.now,

        :startLat => params[:startLat].to_s,
        :startLon => params[:startLon].to_s,
        :endLat => params[:endLat].to_s,
        :endLon => params[:endLon].to_s,
        :polyline => params[:polyline].to_s,
        
        :user => tripowner
      })
      
      
      # Find the invitees and add them to this - id's separated by commas
      inviteeIDs = params[:invitees].split(',')
      # TODO - this all needs to be validated and escaped if no results etc
      invitees = User.all(:id => inviteeIDs)
      invitees.each do|invitee|
        trip.users << invitee
      end

      # Save trip and invitations
      trip.save

      session[:tripId] = trip.id

      redirect to('/trip/details')
    end



    # Map page / new trip details
    # -------
    get '/trip/details' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      erb :new_trip_details
    end

    # Update the trip with time/date/seats etc
    # ---------------------------------------------
    put '/trip/details/save' do


      logger = Logger.new(STDOUT)
      logger.level = Logger::DEBUG
      logger.debug(params)



      @trip = Trip.first( :id => session[:tripId] )

      @trip.seats = params[:seats].to_i

      @trip.save

      redirect to('/trip/' + session[:tripId].to_s )

    end































    # Protected - User settings page
    # --------------
    get '/usersettings' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @user = User.first(:id => session[:user_id])

      erb :user_settings
    end
    put '/usersettings/update' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @user = User.first(:id => session[:user_id])

      @user.update( params )
      
      redirect '/usersettings'
    end





























    # Protected - Users friends list
    # --------------
    get '/friendlist' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      # Get the user from the session and db
      @user = User.first(:id => session[:user_id])
  
      # Set up Koala for FB
      @graph = Koala::Facebook::API.new( session[:oa_token] )
  
      # Pull friends from FB Graph
      @friends = @graph.get_connections("me", "friends")

      @friendFBIDs = Array.new



      # Get an array of all of your mates FBIDs so we can see who has the app
      @friends.each do|friend|
        @friendFBIDs.push(friend["id"])
      end

      # This holds an array of FB friends that already exist in the DB
      @friendsWithApp = User.all(:facebookId => @friendFBIDs)

      # Automatically add these to your friends in the DB...  
      # TODO - Make this optional
      @friendsWithApp.each do|friend|
        @user.friends << friend
      end

      # Save updated user
      @user.save

      erb :friend_list
    end



    # Users
    # ------------
    get '/users' do

      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      @users = User.all

      erb :users

    end































    #   
    #   
    #   
    #   
    #   
    #   JSON
    #   
    #   
    #   
    #   
    #   
    #   
    # Protected - Users friends list JSON
    # --------------
    get '/friends.json' do
      
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      user = User.first(:id => session[:user_id])

      content_type :json

      user.friends.to_json

    end



    get '/invites.json' do
      
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      user = User.first(:id => session[:user_id])

      content_type :json

      user.invitations.to_json

    end



    get '/invitecount.json' do
      
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      user = User.first(:id => session[:user_id])

      content_type :json

      user.invitations.count.to_json

    end
















































    # Trip details page
    # -------
    get '/trip/:tripid' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      #TODO - reject unless user ID is in the invitees list
      @trip         = Trip.first(:id => params[:tripid])
      @invitations  = Invitation.all( :trip => @trip )

      # Map setup
      startLat   = @trip.startLat[0..10].to_f
      startLon   = @trip.startLon[0..10].to_f
      endLat     = @trip.endLat[0..10].to_f
      endLon     = @trip.endLon[0..10].to_f
      polyline   = @trip.polyline

      startmarker = '&markers=color:white%7Clabel:A%7C' + startLat.to_s + ',' + startLon.to_s
      endmarker = '&markers=color:red%7Clabel:B%7C'   + endLat.to_s   + ',' + endLon.to_s

      markers = startmarker + endmarker

      # Polyline has potential to be huge and break URL lengths.... TODO
      path = '&path=color:0xEE0000%7Cweight:5%7Cenc:' + polyline

      @mapsrc = 'http://maps.googleapis.com/maps/api/staticmap?&size=640x320' + markers + path + '&key=AIzaSyA94pcuOlREd4FULaI6eI5KlbBCUFDuCDg&sensor=true' 

      erb :trip

    end

















    # Protected - User settings page
    # ----------------------------
    get '/alltrips' do

      #Check Auth
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @trips = Trip.all

      erb :alltrips
    end




    # MyTrips - trips that I own
    # ----------------------------
    get '/mytrips' do

      #Check Auth
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      user = User.first(:id => session[:user_id])

      @trips = Trip.all(:user => user)

      erb :alltrips

    end
















    # Invitations - trips that I've been invited on
    # ---------------------------------------------
    get '/invitations' do

      #Check Auth
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      #Get user
      user = User.first(:id => session[:user_id])

      @invites = Invitation.all(:user => user)

      erb :invitations

    end












    # Invitations - trips that I've been invited on
    # ---------------------------------------------
    get '/invitation/:inviteId' do

      #Check Auth
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      #Get user
      user = User.first(:id => session[:user_id])

      invite = Invitation.first( :id => params[:inviteId] )


      @invite     = invite

      @invitee    = invite.user
      @inviter    = invite.trip.user

      @accepted   = invite.accepted
      @message    = invite.message
      @replymsg   = invite.reply

      @createdDT  = Time.parse( invite.trip.created_at.to_s )
      @startTime  = Time.parse( invite.trip.startTime.to_s )
      @etaTime    = Time.parse( invite.trip.etaTime.to_s )
      @polyline   = invite.trip.polyline

      @seats      = invite.trip.seats 

      @startLat   = invite.trip.startLat[0..10].to_f
      @startLon   = invite.trip.startLon[0..10].to_f
      @endLat     = invite.trip.endLat[0..10].to_f
      @endLon     = invite.trip.endLon[0..10].to_f
      
      startmarker = '&markers=color:white%7Clabel:A%7C' + @startLat.to_s + ',' + @startLon.to_s
      endmarker = '&markers=color:red%7Clabel:B%7C'   + @endLat.to_s   + ',' + @endLon.to_s
      
      markers = startmarker + endmarker
      
      # Polyline has potential to be huge and break URL lengths.... TODO
      path = '&path=color:0xEE0000%7Cweight:5%7Cenc:' + @polyline

      @mapsrc = 'http://maps.googleapis.com/maps/api/staticmap?&size=640x320' + markers + path + '&key=AIzaSyA94pcuOlREd4FULaI6eI5KlbBCUFDuCDg&sensor=true' 

      erb :invitation

    end








    # RSVP - post response to invitation
    # ---------------------------------------------
    put '/invite/rsvp/:inviteId' do

      @invitation = Invitation.first( :id => params[:inviteId] )

      @invitation.accepted = params['chk_accept'] == 'on' ? true : false

      @invitation.save

      erb :rsvp

    end















    # 404
    # -------
    not_found do
      erb :notfound
    end

end

OmniAuthApp.run! if __FILE__ == $0







