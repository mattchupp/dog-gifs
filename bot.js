// Twitter Bot for tweeting dog gifs
// Created by matt chupp

// the things i need
var fs = require('fs');
var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

// set up user stream
// var stream = T.stream('user');

// anytime someone follows me follow them back
// stream.on('tweet', tweetEvent);
//
// function tweetEvent(event) {
//   var replyto = event.in_reply_to_screen_name;
//   var text = event.text;
//   var fr = event.user.screen_name;
//
//   if (replyto == 'helloitsme541') {
//     var newTweet = '@' + fr + ' thank you for tweeting at me!';
//     tweetIt(newTweet);
//   }
// }

// folder name for images
var img = 'img/';

var gifs_array = [
  img + 'pugs.gif',
  img + 'corgi_dive.gif',
  img + 'balancing.gif',
  img + 'that_look.gif',
  img + 'out_the_window.gif',
];

var status_array = [
  'pugs running',
  'corgi dive',
  'balancing',
  'that look',
  'out the window'
];

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// tweet
// tweetIt();
// setInterval(tweetIt, 1000*30);

// var gifToTweet = 'img/pugs.gif';
// var alt = 'Pugs running';
// var status = 'Running Pugs'
// img/corgi_dive.gif

var i = 0;

function increment() {
  if(i <= gifs_array.length) {
    i++;
  } else {
    i = 0;
  }
  return i;
}


setInterval(function() {
  tweetGif(gifs_array[i], status_array[i]);
}, 1000*10);

// tweetGif(gifs_array[1], status_array[1]);

// function to tweet the gifs
function tweetGif(gif, alternateText) {
  var b64content = fs.readFileSync(gif, { encoding: 'base64' })

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = alternateText
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: '', media_ids: [mediaIdStr] }

        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })

        console.log(i);
        increment(); 

      } else {
        console.log('Houston we have a problem.');
      }
    })
  })
}

// function for tweeting
function tweetIt(txt) {
  // tweet
  var tweet = {
    status: txt
  }

  T.post('statuses/update', tweet , tweeted);

  function tweeted(err, data, response) {
    console.log(data)
  }
}
