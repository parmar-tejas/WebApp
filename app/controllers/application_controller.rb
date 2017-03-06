class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :prepare_for_mobile

  private

  def prepare_for_mobile
    if request.user_agent =~ /Mobile|webOS/ && request.path != '/mobile_app'
      redirect_to mobileapp_path
    end
  end
end
