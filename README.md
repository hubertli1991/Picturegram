# Picturegram

[Picturegram](https://picture-gram.herokuapp.com/)

Picturegram is a full-stack web application inspired by Instagram. It's back-end is built on Ruby on Rails and its front-end is uses React.js with a Flux architectural.

## Features and Implementation

### Authentication

Picturegram is a single page app where all data is delivered on one static page.

On the front end, the root page listens to the `SessionStore` by invoking the object's `currentUserHasBeenFetched` method. The only way to render the app's components (other than the login and sign up form) is if the user is recognized as the `current_user` by the `ApplicationController`. If you are not recognized, the only components that will render are the login and sign up forms.

### Omni Auth

I allow my app to authenticate users through Facebook. If you look in my `routes.rb` file, I made a custom route to `Sessions#create_with_facebook`. This method will authenticate the user or create an account for him or her if he or she doesn't have an existing account. The `create_with_facebook` method calls on the User model's `find_or_create_with_auth_hash` method and will either query for the user using the `facebook_uid` provided by facebook and log him or her in or create an account for the new user with the user's facebook username and facebook_uid.

### Posts

In the backend, the `posts` table contains a `user_id`, `caption`, `image_url_large` and `image_url_small`. For every image a user uploads, I use `ImageMagick` and the `Paperclip` gem to resize and upload onto AWS a large version (600x600) and a small version (300x300). The small version is used when the user PostIndex page is rendered and the large version is rendered when the user clicks on the small version.

### Hashtags

Hashtags are located in the post's caption and are created when the user writes or edits a caption. When a user clicks on a hashtag, he/she should be able to see all posts that have that hashtag in its caption.

#### Back-End

A post can have many hashtags and a hashtag can have many posts referencing it. The `hashtags` table contains a `hashtag` string and a `count`. The `count` is an integer that starts at 1 and increments by 1 when a creates or edits a post that includes that hashtag. This variable tracks the number of posts that has this hashtag. I did this because the `SearchBar` component allows users to look up hashtags and its also suppose to show the number of posts that hashtag has. It would be a strain on my server if it ran a query for every potential hashtag a user searches for. So, to reduce the number of queries my backend is making, I will do the calculation when a user saves or updates a post and pass the `count` value down to the post store when fetched.

As mentioned above, `Post` and `Hashtag` have a many to many relationship. I created a `post_hashtag_relationships` table that has both `post_id` and `hashtag_id` columns and it `belongs_to` both `Post` and `Hashtag`. With this table and its associations in place, I associated `Post` with `Hashtag`.

````Ruby
class Post < ActiveRecord::Base
  has_many(
    :hashtags,
    through: :post_hashtag_relationships,
    source: :hashtag
  )
end

class Hashtag < ActiveRecord::Base
  has_many(
    :posts,
    through: :post_hashtag_relationships,
    source: :post
  )
end
````
Now `Post` can call `hashtags` and query for its hashtags and `Hashtag` can call `posts` and query its posts.

#### Front-End

On the front-end, when a user submits a post, the caption must be parsed for hashtags and those hashtags have to be saved into the database only after the post has been successfully saved. To parse the caption, I wrote a helper method `Helper.parseHashtags`.

The first step was to define legal characters after a `#`. After that, the overall idea is we iterate through the caption and whenever we see a "#", we create a `candidate`. It's called candidate because cases like "#" should not count and "##foo" should only be "#foo". we keep iterating until we get to a character that is not legal or we get to the end. When that happens, if the candidate is not just "#", we push it inside `hashtagsArray`.

````javascript
var Helper = {

  parseHashtags: function(caption, hashtagsList) {
    //...
    //
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var numbers = "0123456789";
    var legalLetters = alphabet + alphabet.toUpperCase() + "_-'" + numbers;
    var legalObject = {};
    for (var i = 0; i < legalLetters.length; i++) {
      legalObject[legalLetters[i]] = true;
    }

    var hashtagsArray = [];
    var length = 0; // you can treat this as true/false
    var start = 0;
    for (var j = 0; j < caption.length; j++) {

      var candidate = caption.slice( start, j+1 );

      if( caption[j] === "#" ) {
        // to parse #hashtag1#hashtag2 => #hashtag1 #hashtag2
        if ( length > 1 ) {
          candidate = candidate.slice( 0, candidate.length - 1 );
          hashtagsArray.push( [candidate, start, hashtagsObject[candidate.toLowerCase()]] );
          length = 0;
        }
        start = j;
        length += 1;
      } else if ( length && legalObject[caption[j]] ) {
        length += 1;
        // in case caption ENDS on a hashtag ex. caption: "I love #food"
        if ( j === caption.length - 1 ) {
          hashtagsArray.push( [candidate, start, hashtagsObject[candidate.toLowerCase()]] );
          length = 0;
        }
      } else if ( length && legalObject[caption[j]] === undefined ) {
        // detect the end of a hashtag
        candidate = candidate.slice( 0, candidate.length - 1 );
        hashtagsArray.push( [candidate, start, hashtagsObject[candidate.toLowerCase()]] );
        length = 0;
      }

    }
    //
    // ...
  },
};
````
When the caption is done parsing, we package the hashtags in a way where we can send them to the back-end.

### Comments    

For comments, I created a database that connected each comment with a post_id. I didn't create a store for comments. Instead I packaged comments with posts and placed them all into the `PostStore`. I did this because pictures and comments are almost always rendered at the same time and even if they are not, the user is likely going to render both sets of data. I wanted the reduce the number of ajax requests to the backend.

### Search Bar

### Arrow Key Navigation

### followers


## Future Direction for the Project

### Photo Tagging

In addition to the features already implemented, I plan to continue working on this project. The next step is to create a follow feature. This will allow users to send follow requests to other users and to decide which users to accept follow requests from. Users will have the option to prevent other users from rendering their posts based on the other user's follow status.
