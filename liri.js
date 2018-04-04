//reads and sets any environment variables with dotenv pkg.
require('dotenv').config();

// grabs api keys
const keys = require("./api-keys.js");

const spotifyKey = new Spotify(keys.spotify);
const twitterKey = new Twitter(keys.twitter);

// REQUIRED npms
const twitter = require('twitter');
const spotify = require('spotify');

const request = require("request");

//fs for reading/writing files
const fs = require("fs");

//grabs arguments from command line
const arg = process.argv[2];


//COMMANDS

//'my-tweets'
//will show last 20 tweets and when they were created in the terminal.

//'spotify-this-song'
//will show artist/song name/preview link/album 
//Default "The Sign" by Ace of Base.

//'movie-this'
// will output title of movie/year/imdb rating/rotten tomatoes rating/country of origin/language/plot/cast
//Default "Mr.Nobody"
//my omdb api key:  http://www.omdbapi.com/?i=tt3896198&apikey=e9de9dfe

//'do-what-it-says'
//using fs - text from inside random.txt and use it to call one of LIRI's commands
//should run 'spotify-this-song' for "I want it that way"

//BONUS: in addition to logging data, output data to a log.txt file as an append.




