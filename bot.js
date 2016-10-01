// Twitter Bot for tweeting dog gifs
// Created by matt chupp

// the things i need
var fs = require('fs');
var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

console.log('Puppy Gifs are ready to fire');

// folder name for images
var img = 'img/';

var gifs_array = [
  img + 'mirror.gif',
  img + 'stevie.gif',
  img + 'puppy_eyes.gif',
  img + 'dog_bear.gif',
  img + 'hostess.gif',
  img + 'air_swim.gif',
  img + 'vent.gif',
  img + 'running.gif',
  img + 'head_turn.gif',
  img + 'surfing_on_dog.gif',
  img + 'headshake.gif',
  img + 'paw_down.gif',
  img + 'paw_down_walk.gif',
  img + 'swimming.gif',
  img + 'excited.gif',
  img + 'out_of_the_box.gif',
  img + 'rolling_around.gif',
  img + 'look_away.gif',
  img + 'adorbs.gif',
  img + 'in_circles.gif',
  img + 'spazz.gif',
  img + 'yawn.gif',
  img + 'run_in_place_on_bed.gif',
  img + 'dog_lick.gif',
  img + 'running_in_place.gif',
  img + 'wrap_up.gif'
];

var i = 0;

// when i > length of array (all the way through array)
// then start over! :)
function increment() {
  i++;
  if (i === gifs_array.length - 1) {
    i = 0;
  }
  return i;
}

// set interval to tweet every 6 hours
setInterval(function() {
  tweetGif(gifs_array[i]);
}, 1000*60*60*7);


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

        console.log(gifs_array[i]);
        // move up in the array
        increment();

      } else {
        console.log('Houston we have a problem.');
      }
    })
  })
}
