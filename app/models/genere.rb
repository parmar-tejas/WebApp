class Genre < ApplicationRecord

  #
  # Association
  #
  has_many :songs
end
