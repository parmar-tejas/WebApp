class FretxController < ApplicationController

  def player
  end

  def list
  end

  def editor
    redirect_to root_path unless current_user
  end
end