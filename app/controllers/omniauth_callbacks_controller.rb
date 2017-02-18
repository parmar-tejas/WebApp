class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  before_filter :prepare_auth

  def facebook
    connect(:facebook)
  end

  private
    def prepare_auth
      @auth = request.env["omniauth.auth"]
    end

    def connect(provider)
      social_provider = Omniaccount.find_for_oauth(
                          @auth,
                          provider
                        )
      @user = social_provider.user ||
              User.find_by_email(@auth[:info][:email]) ||
              User.new
      @user.update_from_oauth(@auth, provider)
      social_provider.update_user_id (@user.id) if @user
      social_provider.save
      # You need to implement the method below in your model (e.g. app/models/user.rb)
      if @user.persisted?
        sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
        set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
      else
        session["devise.facebook_data"] = request.env["omniauth.auth"]
        redirect_to new_user_registration_url
      end
    end
end