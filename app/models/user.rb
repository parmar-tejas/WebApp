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
  has_one :omniaccount

  def update_from_oauth(auth, provider)
    self.email = auth[:info][:email] if self.email.blank?
    self.name =  auth[:info][:name]
    self.password = Devise.friendly_token[0,20]
    self.save
  end
end
