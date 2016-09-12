# Picturegram

[Picturegram](https://picture-gram.herokuapp.com/)

Picturegram is a full-stack web application inspired by Instagram. It's back-end was built on Ruby on Rails and uses React.js with a Flux architectural framework for its front-end.

## Features and Implementation

### Authentication

Picturegram is a single page app where all data is delivered on one static page.

On the front end, the root page listens to the `SessionStore` by invoking the object's `currentUserHasBeenFetched` method. The only way to render the app's components (other than the login and sign up form) is if the user is recognized as the `current_user` by the `ApplicationController`. If you are not recognized, the only components that will render are the login and sign up forms.

### Omni Auth

I allow my app to authenticate users through Facebook. If you look in my `routes.rb` file, I made a custom route to `Sessions#create_with_facebook`. This method will authenticate the user or create an account for him or her if he or she doesn't have an existing account. The `create_with_facebook` method calls on the User model's `find_or_create_with_auth_hash` method and will either query for the user using the `facebook_uid` provided by facebook and log him or her in or create an account for the new user with the user's facebook username and facebook_uid.

### Posts

To implement the post picture functionality, I used the Paperclip gem. Instagram displays two versions of every photo you upload. A small version for your user page and a large version for when someone click on the image. I saved two copies of every image that is uploaded through the `PostForm`, one 300x300 and another 600x600.
```` Ruby
has_attached_file :image, styles: { :small => "300x300#", :large => "600x600#" }
````
I did this to reduce the load on the front end. Similarly, for profile pictures, I saved two copies every time a user uploads a profile picture. One for the user home page and another for the thumbnail posted on every user post.

### Hashtags

### Comments    

For comments, I created a database that connected each comment with a post_id. I didn't create a store for comments. Instead I packaged comments with posts and placed them all into the `PostStore`. I did this because pictures and comments are almost always rendered at the same time and even if they are not, the user is likely going to render both sets of data. I wanted the reduce the number of ajax requests to the backend.

### Search Bar

### Arrow Key Navigation

### followers


## Future Direction for the Project

### Photo Tagging

In addition to the features already implemented, I plan to continue working on this project. The next step is to create a follow feature. This will allow users to send follow requests to other users and to decide which users to accept follow requests from. Users will have the option to prevent other users from rendering their posts based on the other user's follow status.
