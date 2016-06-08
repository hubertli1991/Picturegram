# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.destroy_all
Post.destroy_all

user_1 = User.create!({ username: 'hubert1', password: 1234567 })
user_2 = User.create!({ username: 'hubert5', password: 1234567 })
user_3 = User.create!({ username: 'guest', password: 1234567 })

post = Post.create!([
  # first user's post
    { user_id: user_1.id, caption: "hello world!", image: File.open('app/assets/images/31.jpg') },
    { user_id: user_2.id, caption: "this is my second post!", image: File.open('app/assets/images/shar_pei.jpg') },
  # second user's posts
    { user_id: user_3.id, caption: "I am a dog!", image: File.open('app/assets/images/second_dog_image.jpg') }
  ])
