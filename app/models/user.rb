class User < ApplicationRecord
  devise(
    :database_authenticatable,
    :registerable,
    :rememberable,
    :trackable,
    :validatable,
    :omniauthable
  )

  #
  # Associations
  #
  has_many :songs
  has_many :roles_users

  def self.from_omniauth(auth)
    where(
      provider: auth[:provider],
      uid: auth[:uid]
    ).first_or_create do |user|
       user.provider    = auth.provider
       user.email       = auth.info.email
       user.password    = Devise.friendly_token[0,20]
       user.uid         = auth.uid
       user.provider_id = auth.info.provider_id
       user.name        = auth.info.name
       user.photo_url   = auth.info.image
    end
  end
end
