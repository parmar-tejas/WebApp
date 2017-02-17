#
# Admin User
#
AdminUser.create!(
  email: 'admin@fretx.rocks',
  password: 'password',
  password_confirmation: 'password'
)

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

