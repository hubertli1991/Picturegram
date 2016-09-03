var Helper = {

  parseHashtags: function(caption, hashtagsList) {
    var hashtagsObject = {};
    if (hashtagsList) {
      for (var k = 0; k < hashtagsList.length; k++) {
        hashtagsObject[hashtagsList[k].hashtag] = hashtagsList[k].id;
      }
    }

    //createing hashtags -BEGIN
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
    // creating hashtags --END

    if ( hashtagsList !== undefined ) {
      var filteredHashtagArray = [];
      for (var l = 0; l < hashtagsArray.length; l++) {
        if ( hashtagsArray[l][2] ) {
          filteredHashtagArray.push(hashtagsArray[l]);
        }
      }
      return filteredHashtagArray;
    } else {
      return hashtagsArray;
    }
  }

};

module.exports = Helper;
