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
    var length = 0;
    var start = 0;
    for (var j = 0; j < caption.length; j++) {
      if(caption[j] === "#") {
        // to parse #hashtag1#hashtag2 => #hashtag1 #hashtag2
        if ( length > 1 ) {
          hashtagsArray.push( [caption.slice(start, start+length), start, hashtagsObject[caption.slice(start, start+length)]] );
          length = 0;
        }
        start = j;
        length += 1;
      } else if ( length && legalObject[caption[j]] ) {
        length += 1;
        // in case caption ENDS on a hashtag ex. caption: "I love #food"
        if ( j === caption.length - 1 ) {
          hashtagsArray.push( [caption.slice(start, start+length), start, hashtagsObject[caption.slice(start, start+length)]] );
          length = 0;
        }
      } else if ( length && legalObject[caption[j]] === undefined ) {
        // detect the end of a hashtag
        hashtagsArray.push( [caption.slice(start, start+length), start, hashtagsObject[caption.slice(start, start+length)]] );
        length = 0;
      }
    }
    // creating hashtags --END
    return hashtagsArray;
  }

};

module.exports = Helper;
