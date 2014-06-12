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

    
    configure do
      set :sessions, true
    end


    # OmniAuth builder
    # ----------------
    use OmniAuth::Builder do
      provider :facebook, 'x','x', :info_fields => 'first_name,last_name,email'
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


      #TODO:Need to branch here depending on who the provider is...

      @user = User.first_or_create({:facebookId => request.env['omniauth.auth'][:uid].to_s},
                                   {:facebookId => request.env['omniauth.auth'][:uid].to_s,
                                    :email      => request.env['omniauth.auth'][:info][:email].to_s,
                                    :firstname  => request.env['omniauth.auth'][:info][:first_name].to_s,
                                    :lastname   => request.env['omniauth.auth'][:info][:last_name].to_s,
                                    :joined_at  => Time.now })
      
      session[:user_id] = @user.id
      session[:oa_token] = request.env['omniauth.auth'][:credentials][:token].to_s


      # erb :map
      # erb :authorised
      
      redirect '/map'
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
    






    # Protected - User settings page
    # --------------
    get '/usersettings' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @user = User.first(:id => session[:user_id])

      erb :user_settings
    end

    post '/usersettings/update' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @user = User.first(:id => session[:user_id])

      @user.update(params)
      
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







    # Protected - Users friends list JSON
    # --------------
    get '/friends.json' do
      
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      @user = User.first(:id => session[:user_id])

      content_type :json

      @user.friends.to_json

    end







    # Delete all users...
    # --------------
    get '/destroyUsers' do

      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      User.all.destroy

      session[:authed] = false

      redirect '/'

    end






    # Users
    # ------------
    get '/users' do

      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]
      
      @users = User.all

      erb :users

    end





    # Log out
    # -------
    get '/logout' do

      session[:authed] = false

      redirect '/'

    end






    # Map page
    # -------
    get '/map' do
      
      throw(:halt, [401, "Not authorized\n"]) unless session[:authed]

      erb :map

    end








    # 404
    # -------
    not_found do

      erb :notfound

    end

end



OmniAuthApp.run! if __FILE__ == $0













