# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

users = User.create([ { username: 'hubert1', password: 1234567 }, { username: 'hubert5', password: 1234567 } ])

post = Post.create([
  # first user's post
    { user_id: 1, caption: "hello world!", image: File.open('app/assets/images/31.jpg') },
    { user_id: 1, caption: "this is my second post!", image: File.open('app/assets/images/shar_pei.jpg') },
  # second user's posts
    { user_id: 2, caption: "I am a dog!", image: File.open('app/assets/images/second_dog_image.jpg') }
  ])
