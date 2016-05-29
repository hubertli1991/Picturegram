# Picturegram

##Minimum Viable Product
Picturegram is a web application inspired by Instagram that will be build using Ruby on Rails and React.js. By the end of Week 9, this app will, at a minimum, satisfy the following criteria:

- [ ] New account creation and log
- [ ] Smooth navigation
- [ ] Adequate seed data to showcase the app’s features
- [ ] Homepage
- [ ] User pages with pictures
- [ ] Following
- [ ] Comments on pictures
- [ ] Links for hashtags
- [ ] Links for @username
- [ ] Hosting on Heroku
- [ ] CSS styling that is satisfactorily visually appealing

##React Component
####Other User Page
- [ ] Search bar
- [ ] Picture index
  - [ ] Picture Index Items
    - [ ] Picture Details
      - [ ] Picture
      - [ ] Comments
      - [ ] Likes
      - [ ] Date
 
####Home Page (Very Similar to Other User Page, but the layouts are very different)
- [ ] Search bar
- [ ] Picture Index
  - [ ] Picture Index Items
    - [ ] Picture Details
      - [ ] Picture
      - [ ] Comments index
        - [ ] Comment index item
        - [ ] Post Comment form
      - [ ] Likes
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
  - Delete picture
    - Delete all comments
    - Delete all likes
- API Response
  - Receive all pictures
  - Receive single picture
    - Receive all comments
    - Receive all likes
  - Receive Created Picture
  - Receive Deleted Picture
    - Receive deleted comments
    - Receive deleted likes
- Store Listeners
    - Picture Index listens for when pictures are created or destroyed
    - Picture Details listens for when comment store or like store are altered

####Home Page (very similar to other user page Flux)
- API Request
  - Fetch all pictures
  - Fetch single picture
    - Fetch all comments
    - Fetch all likes
- API Response
  - Receive all pictures
  - Receive single picture
    - Receive all comments
    - Receive all likes
- Store Listeners
  - Picture Index listens for when pictures are created or destroyed
  - Picture Details listens for when comment store or like store are altered
