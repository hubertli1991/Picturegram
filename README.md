# Picturegram

[Picturegram](https://picture-gram.herokuapp.com/)

Picturegram is a full-stack single page web application inspired by Instagram. Its back-end is built on Ruby on Rails and its front-end is built using React.js with a Flux architecture.

![Alt text] (./app/assets/images/user_page.jpg)

## Features and Implementation

### Authentication

On the front end, the root page checks user authentication by using the `SessionStore`. It invokes the object's `currentUserHasBeenFetched` method. The only way to render the app's components is if the user is recognized as the `current_user` by the `ApplicationController`. If the user is not recognized, the only components that will render are the login and sign up forms.

### Omni Auth

Picturegram can authenticate users through Facebook. If you look in the `routes.rb` file, I made a custom route to `Sessions#create_with_facebook`. This method will authenticate the user or create an account for him/her if he/she doesn't have an existing account. The `create_with_facebook` method calls on the User model's `find_or_create_with_auth_hash` method and will either query for the user using the `facebook_uid` provided by Facebook and log him/her in or create an account for the new user with the user's Facebook username and facebook_uid.

### Posts

In the back-end, the `posts` table contains columns for `user_id`, `caption`, `image_url_large` and `image_url_small`. For every image file the current user uploads, `ImageMagick` and the `Paperclip` gem resizes and uploads, onto AWS, a large version (600x600) and a small version (300x300). The small version is rendered when a user's `PostIndex` page is rendered and the large version is rendered when a user clicks on the small version, opening a modal showing the details of the post.

On the Post, users can hashtag, comment, like/unlike, and follow.

### Hashtags

Hashtags are located in the post's caption and are created when the current user writes or edits a caption. When a user clicks on a hashtag, he/she should be able to see all posts that have that hashtag in its caption.

A post can have many hashtags and a hashtag can have many posts referencing it. The `hashtags` table contains a `hashtag` (string) and a `count`. The `count` is an integer that starts at 1 and increments by 1 when the current user creates or edits a post that includes that hashtag. This variable tracks the number of posts that has this hashtag. I designed the table this way because the `SearchBar` component is suppose to allow current users to look up hashtags and, at the same time, see the number of posts that hashtag has before going to the page. It would be a strain on my server if it ran a query for every potential hashtag a user searches for. So, to reduce the number of queries my back-end is making, I will do the calculation when a user saves or updates a post and just pass the `count` value down to the post store when fetched.

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

On the front-end, when the current user submits a post, the caption must be parsed for hashtags and those hashtags have to be saved into the database only after the post has been successfully saved. To parse the caption, I wrote a helper method `Helper.parseHashtags`.

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

When the current user clicks on a small image, the `PostIndexItem` modal renders along with the post's large image and caption. When the caption renders, all of the post's hashtags must render in place of the pure string.

To do this, we must pass down all of the post's hashtag objects from the back-end when we fetch a post. `PostsController#show` renders a post json object that has an attribute pair where the key is "hashtags" and the value is an array of hashtag objects. The JBuilder code is below.
```` Ruby
json.hashtags do
  json.partial! 'hashtags/hashtags', hashtags: post.hashtags
end
````
Here we are able to use the `Post#hashtags` method created when we set `Post` `has_many :hashtags, through: :post_hashtag_relationships`.
```` Ruby
json.array! hashtags do |hashtag|
  json.extract! hashtag, :hashtag, :id
end
````
So, the json object looks something like `{ id: some_num, caption: some_string,... , hashtags: [ { hashtag: #govikings, id: 28 }, { hashtag: #beatthepackers, id: 2 },... ] }`. from the jsonObject.hashtags we have all the data we need to render the caption with hashtags in place of string.

when we render the caption, we again invoke `Helper.parseHashtags` and this will return us the array of hashtags. From there, we match each hashtag with a hashtag object brought down from the back-end. The tricky part is slicing the caption up to render the substring that doesn't correspond with a hashtag unchanged and to render the other parts with a new component that has a different css (to make the color blue and the text to display inline) and an onClick property that routes the user to the hashtag page upon click.

```` javascript
renderCaption: function() {
  hashtagsArray = Helpers.parseHashtags(this.state.post.caption, this.state.post.hashtags);

  if ( hashtagsArray.length ) {
    var caption = this.state.post.caption;
    var idx = 0;
    var final = [];
    for (var i = 0; i < hashtagsArray.length; i++) {
      // slice of pure caption string
      final[idx] = caption.slice(idx, hashtagsArray[i][1]);
      // hashtags component with onClick listener
      final[hashtagsArray[i][1]] = <div className="hashtag" key={i} onClick={this.handleClick.bind(null, hashtagsArray[i][2], "hashtag")}>{hashtagsArray[i][0]}</div>;
      //
      idx = hashtagsArray[i][1] + hashtagsArray[i][0].length;
    }
    final[idx] = caption.slice(idx, caption.length);
    return <div className="caption-text">{final}</div>;
  } else {
    return <div className="caption-text">{this.state.post.caption}</div>;
  }
},
````
The `handleClick` just invokes `this.context.router.push( "/hashtags/" + id )` which renders the `HashtagIndex` component. This component just pulls down all the hashtag's posts using the `posts` method created when we set `Hashtag` `has_many :posts, through: :post_hashtag_relationships`. It then renders the images using the same way the `PostIndex` component does.

### Like / Unlike

The back-end for likes is straight forward. The `likes` data table has `post_id` and `user_id`. The corresponding model has a `belongs_to` relation with `Post`. When a post is rendered, it invokes a ClientAction that fetches a like object using that post's id. The `LikesController#show_with_post_id` method will call `Like.where(post_id: params[:id])` and if this query returns a non-empty array, the controller will pass down a json object with a parameter `permissionToLike: false` which will eventually get stored into the `LikeStore` under the `postId` key. Logistically, I didn't need to pass down this parameter. I could have just passed down an empty object, but I did so to increase readability.

the `permissionToLike` attribute is used for two things. the first, is it decides the css of the heart icon (pink if false and white if true). `permissionToLike` is false if and only if the like object with the user's id exists in `likes`. In other words, if the current user has already liked a post, he/she should not have permission to like the post again. So, this attribute will decide which likes resource route to use when the user clicks on the heart or picture. If permission is true, click would `create` a like, if false, click would unlike or `destroy` the like.

### Comments    

Implementing comments was very straight forward. On the back-end, the `comments` data table contains `comment`, `post_id` and `user_id`. `Comment` has a `belongs_to` association with `Post` and whenever a user sends a request to the `PostsController` for a post, the controller calls `Post#comments` and eventually renders a json object that contains an array of comments ordered by `created_at`. When a user writes a comment, it gets passed up to the `CommentsController` along with the `post_id`. Upon a successful save, the controller passes the updated comments array into the front-end which will send the data into the store and eventually onto the browser through the `PostIndexItem` component. The process of sending down the entire set of comments for a post will run an additional query, but it's necessary because what if multiple people are commenting on the same post at the same time? The controller should send down the most up to date information.

### followers

Followers are just users. The tricky part of this feature is a users has many followers and a user follows many other users. This is a many-to-many relation. I created a `followings` table which contains `user_id` (the current user's id) and `following_id` (the id of the user that was clicked on).

The associations for `followings` and `followers` are
```` Ruby
class User

  has_many(
    :followings,
    primary_key: :id,
    foreign_key: :user_id,
    class_name: "Following"
  )

  has_many(
    :followees,
    through: :followings,
    source: :followee
  )

  has_many(
    :followeds,
    primary_key: :id,
    foreign_key: :following_id,
    class_name: "Following"
  )

  has_many(
    :followers,
    through: :followeds,
    source: :user
  )

end
````
On the front-end, all follow data get stored in the `FollowStore` which keeps track of two objects `_allFollowers` and `_allFollowing`. Two components use the `FollowStore`, the `FollowButton` and `Following` which is the part in the user profile page that displays the number of followers and following a user has. The button is used to either create or destroy a follow object. It is green if the current user is following and blue if not. The `Following` component, upon click will render a ReactModal that displays either all of that user's followers or all the users he/she is following (next to each user, there should be a `FollowButton`).

Every time the `FollowButton` is rendered, it invokes a `ClientAction.fetchFollow(user_id)` where `user_id` is the id of the user page. This will send a get request which will call `UsersController#show`. This request will bring back a object that contains data on both the `current_user` and the `user`. In the `FollowStore`, `updateFollows` gets invoked.
```` javascript
var updateFollows = function(yourObject, otherUserObject, userId, currentUserId) {
  //...
  if ( yourObject ) {
    _allFollowers[userId][currentUserId] = yourObject;
    // ensure that the current_user is a follower of user
    _allFollowing[currentUserId][userId] = otherUserObject;
    // ensure that user is on the following list for current_user
  } else if ( yourObject === null ) {
    // MUST be null to delete
    delete _allFollowers[userId][currentUserId];
    delete _allFollowing[currentUserId][userId];
  }
};
````
When the store `__emitChange`, the follow button will invoke `FollowStore.fetchFollowStatus(userId, currentUserId)` which will return `_allFollowers[userId][currentUserId]`, and if the return value is anything other than undefined, then the button will know the current user is a follower of user and turn green.

Note how, in `updateFollows` BOTH `_allFollowing[userId]` and `_allFollowers[currentUserId]` are updated. It is important to do so because it makes the `FollowStore` an accurate representation of the relationship between the current user and user. the current user is a follower of the user and the user is one of the people current user is following. This ensures that both the follow count and followers count get updated accurately on user pages when current user choses to follow or unfollow someone in the `Following` modals, even when the current user is on his/her own page.

### Search Bar

The idea behind the search bar is every time a user types anything into the search bar, it should send up a get request to retrieve some usernames and hashtags which will eventually make it into a store and get rendered under the `SearchBar` as a `SearchBarIndexItem`. Whenever the current user types something into the search bar, `SearchBar` invokes `ClientActions.fetchUsersThatMatchSearch(searchValue)`. This will go into the back-end and pull down the first five users and first five hashtags where the username or hashtag has the `searchValue` inside. In total, this will bring down up to 10 objects (5 users and 5 hashtags) into the store. Once the store is updated, `SearchBar` will fetch the top seven matches.

The way I pick and order the top seven is

```` javascript
UserStore.topSeven = function() {
  // sort by length
  var matches = [];
  for (var i = 0; i < _users.length; i++) {
    var name = _users[i].username || _users[i].hashtag;
    var length = name.length;

    if ( _users[i].hashtag ) {
      // search bar should prioritize users over hashtags
      // move the hashtags further back in the line by scaling its length by 2
      length = length * 2;
    }
    if ( matches[length] ) {
      matches[length].push( _users[i] );
    } else {
      matches[length] = [ _users[i] ];
    }
  }
  // take top seven
  var topSeven = [];
  var counter = 0;
  for (var j = 0; j < matches.length; j++) {
    // The match object with the "shortest" username or hashtag goes first
    if ( matches[j] ) {
      for (var k = 0; k < matches[j].length; k++) {
        topSeven.push(matches[j][k]);
        counter++;
        if (counter >= 7) { return topSeven; }
      }
    }
  }

  return topSeven;
};
````
The idea is to rank all the matched objects based on length and then pick out and order the seven shortest objects. The shorter the object the greater the match percentage. I am also giving preference to users over hashtags. I do this by doubling the length of hashtags. This way, users will usually show up earlier in the search index.

### Arrow Key Navigation

There are two component where I added arrow key navigation: `SearchBar` and `PostIndexItem`.

#### Search Bar

The `SearchBar` input box has an onKeydown listener that invokes `searchUsingSearchBarIndex`. This function initiates a public variable `this.netUpDown = this.netUpDown || 0`. This is the index of the array `this.state.matchedUsers` (we get this by invoking `UserStore.topSeven` from above). If the current user presses the down arrow, `this.netUpDown++` and the css of the corresponding `SearchIndexItem` changes to make it darker. If the current user presses enter, the selected item invokes it's `searchForUser` function.

```` javascript
searchUsingSearchBarIndex: function(e) {
  // skip this function if there are no matched users
  if ( this.state.matchedUsers.length === 0 ) { return; }
  this.netUpDown = this.netUpDown || 0;
  var numberOfMatchedUsers = this.state.matchedUsers.length;
  if ( e.keyCode === 40 && this.netUpDown < numberOfMatchedUsers ) {
    // DOWN arrow
    this.netUpDown = this.netUpDown + 1;
    // change css
    this.currentTarget = this.state.matchedUsers[this.netUpDown - 1].username || this.state.matchedUsers[this.netUpDown - 1].hashtag;
    this.refs[this.currentTarget].addHoverEffect();

    if ( this.netUpDown >= 2 ) {
      this.previousTarget = this.state.matchedUsers[this.netUpDown - 2].username || this.state.matchedUsers[this.netUpDown - 2].hashtag;
      this.refs[this.previousTarget].removeHoverEffect();
    }
  }
  else if ( e.keyCode === 38 && this.netUpDown > 0 ) {
    // UP arrow
    this.netUpDown = this.netUpDown - 1;
    // do the opposite as above...
    // ...
  }
  else if ( e.keyCode === 13 && this.netUpDown !== 0) {
    // ENTER key
    this.refs[this.currentTarget].searchForUser();
  }
},
````

#### Post Index Item
When the `openModal` function is invoked, it calls `document.addEventListener("keydown", this.handleKeyDown)`.

```` javascript
handleKeyDown: function(e) {
  if ( e.keyCode === 39 && this.state.postNumber < this.state.postCount - 1 ) {
    this.switchPost( "right" );
  }
  if ( e.keyCode === 37 && this.state.postNumber > 0 ) {
    this.switchPost( "left" );
  }
},

switchPost: function( direction ) {
  if ( direction === "left" ) {
    this.state.postNumber--;
  }
  if ( direction === "right" ) {
    this.state.postNumber++;
  }

  var nextPost = PostStore.fetcherPostByArrayIndex(this.state.postNumber);
  this.setState( { post: nextPost } );
},
````
Like with the search bar, there is an index value for the array of posts in the store. When the current user presses a key, that index, `this.state.postNumber` will increment up or down by one and then placed into `PostStore.fetcherPostByArrayIndex(this.state.postNumber)` to return the next post on the page. When `setState` is called with the new post, the modal will render the next post's data.

## Future Direction for the Project

### Photo Tagging
My next step will be to add photo tagging. The current user will be able to click on his/her own image either in the modal or on the `HomeIndexPage` and type in a username. The relative position of the click as well as the username will be sent up to the back-end and stored inside a photo_tags table. If the username given has an account, then that user's id will be included as well. When a user clicks on the the image, the component will fire off `ClientAction.fetchPhotoTags` which will fetch the tags. The tags will be rendered based on the percentage coordinates and if the tags object includes a userId, then the tags will be links to that id's page. Some things to be careful about will be making sure the tags do not leak out of the image. On the front end, we need to set some conditions that restrict how far to the left or right a tag can be and shift the tag in the opposite direction if it violates the condition.
