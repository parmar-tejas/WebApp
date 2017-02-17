#
# Admin User
#
unless AdminUser.any?
  AdminUser.create!(
    email: 'admin@fretx.rocks',
    password: 'password',
    password_confirmation: 'password'
  )
end

[
  "Rock",
  "Pop",
  "Jazz",
  "Blues"
].each do |data|
  Genere.create(name: data)
end

[
  "Beginners",
  "Intermediate",
  "Fluent",
  "Master"
].each do |data|
  Difficulty.create(name: data)
end

