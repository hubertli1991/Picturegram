# Picturegram

[Picturegram] (picture-gram.herokuapp.com)

Picturegram is a full-stack web application inspired by Instagram. It's back-end was built on Ruby on Rails and uses React.js with a Flux architectural framework for its front-end.

##Minimum Viable Product
Picturegram is a web application inspired by Instagram that will be build using Ruby on Rails and React.js. By the end of Week 9, this app will, at a minimum, satisfy the following criteria:

- [ ] New account creation and login
- [ ] Login through Facebook
- [ ] Smooth navigation
- [ ] Adequate seed data to showcase the app’s features
- [ ] Homepage
- [ ] User pages with pictures
- [ ] Comments on pictures
- [ ] Hosting on Heroku
- [ ] CSS styling that is satisfactorily visually appealing

##React Component
####Other User Page
- [ ] Picture index
  - [ ] Picture Index Items
    - [ ] Picture Details
      - [ ] Picture
      - [ ] Comments
      - [ ] Date

####Home Page (Very Similar to Other User Page, but the layouts are very different)
- [ ] Picture Index
  - [ ] Picture Index Items
    - [ ] Picture Details
      - [ ] Picture
      - [ ] Comments index
        - [ ] Comment index item
        - [ ] Post Comment form
      - [ ] Date

####Login Page
- [ ] Login Form

####Post Picture Page
- [ ] Post Picture form

##Flux Cycle
####Other User Page
- API Request
  - Fetch all pictures
  - Fetch single picture
    - Fetch all comments
    - Fetch all likes
  - Create picture
- API Response
  - Receive all pictures
  - Receive single picture
    - Receive all comments
  - Receive Created Picture
- Store Listeners
    - Picture Index listens for when pictures are created or destroyed
    - Picture Details listens for when comment store is altered

####Home Page (very similar to other user page Flux)
- API Request
  - Fetch all pictures
  - Fetch single picture
    - Fetch all comments
- API Response
  - Receive all pictures
  - Receive single picture
    - Receive all likes
- Store Listeners
  - Picture Index listens for when pictures are created or destroyed
  - Picture Details listens for when comment store is altered

##Schema

Users

| Column   | Data Type |Details   |
|---------|-----------|-----------|
| user_id| Integer| Null False|
| Username| String| Null False|
| Password Digest| String| Null False|
| Session Token| String| Null False|

Picture

| Column| Data Type| Details|
|-------|----------|--------|
| picture_id| Integer| Null False|
| user_id| Integer| Null False|
| picture| Integer| Null False|

Comments

| Column| Data Type| Details|
|-------|----------|--------|
| comment_id| Integer| Null False|
| picture_id| Integer| Null False|
| body| Integer| Null False|

##API End Points
####Backend
Users
  - GET /users/new
  - POST /users
  - PATCH /users

Session
  - GET /session/new
  - POST /session
  - DELETE /session

####Json

Other User Page

  - GET /api/
  - GET /api/pictures/:pictureid
  - POST /api/pictures
  - DELETE /api/pictures/:picturesid

##Timeline
- [ ] Backend Configuration and Authentication – 1.5 day
- [ ] Create Picture Index and Index Items components – 1.5 day
- [ ] CSS – 1 day
- [ ] Create Picture Details component – 1 day
- [ ] CSS – 0.5 day
- [ ] Create Comments component – 0.5 day
- [ ] Create Home Page component – 1 day
- [ ] CSS – 1 day
