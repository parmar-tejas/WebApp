class Omniaccount < ApplicationRecord

  #
  # Associations
  #
  belongs_to :user

  def self.find_for_oauth(auth, provider)
    unless social_provider =  self.find_by(
                                provider:    provider,
                                provider_id: auth[:uid]
                              )
      user =  User.find_by_email(
                auth[:info][:email]
              )
      social_provider = Omniaccount.where(
                          user_id: user.id,
                          provider: provider
                        ).first if user.present?
      social_provider ||= Omniaccount.new
    end
    social_provider.update_from_oauth(auth, provider)
    social_provider
  end

  def update_user_id(user_id)
    self.user_id = user_id
  end

  def update_from_oauth(auth, provider)
    self.provider = auth[:provider]
    self.provider_id= auth[:uid]
    self.photo_url= auth[:info][:image]
  end
end
