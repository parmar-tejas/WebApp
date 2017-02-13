class Role < ApplicationRecord

  #
  # Associations
  #
  has_many :roles_users
end
