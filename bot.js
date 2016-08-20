// Twitter Bot for tweeting dog gifs
// Created by matt chupp

// the things i need
var fs = require('fs');
var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

// folder name for images
var img = 'img/';

var gifs_array = [
  img + 'pugs.gif',
  img + 'corgi_dive.gif',
  img + 'balancing.gif',
  img + 'that_look.gif',
  img + 'out_the_window.gif',
  img + 'sunglasses.gif',
  img + 'what.gif',
  img + 'doggy_door.gif',
  img + 'bathtub.gif',
  img + 'treadmill.gif',
  img + 'mirror.gif',
  img + 'stevie.gif',
  img + 'puppy_eyes.gif',
  img + 'dog_bear.gif',
  img + 'hostess.gif'
];

var i = 0;

function increment() {
  if(i === gifs_array.length) {
    i = 0;
  } else {
    i++;
  }
  return i;
}

// set interval to tweet every 6 hours
setInterval(function() {
  tweetGif(gifs_array[i]);
}, 1000*60*60*6);


// function to tweet the gifs
function tweetGif(gif) {
  var b64content = fs.readFileSync(gif, { encoding: 'base64' })

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = 'dog gif'
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: '', media_ids: [mediaIdStr] }

        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })

        // move up in the array
        increment();

      } else {
        console.log('Houston we have a problem.');
      }
    })
  })
}
