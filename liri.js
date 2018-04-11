// Reads and sets any environment variables with dotenv pkg.
require('dotenv').config();

// NPMs
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

// fs for reading/writing files
const fs = require("fs");

// Grabs api keys
const keys = require("./api-keys.js");
const request = require("request");
const inquirer = require('inquirer');


const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// ===== INQUIER QUERY ===== //

function liriOptions() {
    inquirer.prompt([{
        type: "list",
        message: "Hello World! I'm LIRI. Choose an option to start.",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "option"
    }]).then(function (userChoice) {
        //response to user's choice
        switch (userChoice.option) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifySong();
                break;
            case "movie-this":
                movieThis();
                break;
            case "do-what-it-says":
                doIt();
                break;
        }
    })

};

//run LIRI Command Options
liriOptions();

// ===== ADDL FUNCTIONS ===== //

// ===== TWITTER / 'my-tweets' ===== //
//will show last 20 tweets and when they were created in the terminal.

function myTweets() {
    const screenName = {
        screen_name: 'jenncuenca'
    };

    //request for tweets
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            // for loop for handling tweets
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@jenncuenca: " + tweets[i].text + " Created: " + date.substring(0, 19));
                console.log("-----------------------");

                //
                fs.appendFile('log.txt', '\n ===== TWITTER QUERY ===== \n'
                                        + "@jenncuenca: " + tweets[i].text + " Created: " + date.substring(0, 19)
                                        + "-----------------------");
            }
        } else {
            console.log('Houston, we have a problem');
        }

    }); //end of get request

};//end of myTweets

// ===== SPOTIFY / 'spotify-this-song' ===== //
//will show artist/song name/preview link/album 
//Default "The Sign" by Ace of Base.

function spotifySong () {
    inquirer.prompt([{            
        type: 'input',
        message: 'What song would you like to search for?',
        name: 'song'        
    }]).then(function (userInput){
        songSearch(userInput.song) //callback
    })
};//end of then function & inquirer

//variable to handle song title search
const songSearch = function(songTitle){
    // if input is empty
    if (!songTitle){
        console.log('\n');
        console.log ("You didn't input a song! May I suggest 'The Sign'?: ")
        console.log('\n');
        songTitle = "The Sign"
    }
    //search spotify with user input
    spotify.search({ type: 'track', query: songTitle, limit: 5 })
    .then(function(response) {
            //for loop to handle query data
            for(var i = 0; i < response.tracks.items.length; i++){
                var songData = response.tracks.items[i];
    
    console.log("Artist: " + songData.artists[0].name);
    console.log("Song: " + songData.name);
    console.log("Preview URL: " + songData.preview_url);
    console.log("Album: " + songData.album.name);
    console.log("-----------------------");
    console.log('\n');

    // adds text to log.txt

    fs.appendFile('log.txt', '\n'
                            + '===== SPOTIFY QUERY ====='
                            + "Artist: " + songData.artists[0].name
                            + "Song: " + songData.name
                            + "Preview URL: " + songData.preview_url
                            + "Album: " + songData.album.name
                            + "-----------------------"
                            + '\n');

            }// end of for loop
        
        //console.log(response);
    })
    .catch(function(err) {
      console.log(err);
      console.log("SONG WAS NOT ENTERED")
    });
};//end of spotify search


// ===== OMBD/'movie-this'===== //
// will output title of movie/year/imdb rating/rotten tomatoes rating/country of origin/language/plot/cast
//Default: 'Mr. Nobody

function movieThis() {
    //Get Movie Title from Inquirer
    inquirer.prompt([{            
        type: 'input',
        message: 'What movie would you like to search for?',
        name: 'movie'        
    }]).then(function (userInput) {
        movieSearch(userInput.movie) //callback 

    }); //end of inquirer "then"

}; //end of movieThis function

// variable to handle movie title search
const movieSearch = function(movieTitle){

    if (!movieTitle){
        console.log('\n');
        console.log ("You didn't input a movie! May I suggest Mr. Nobody?: ")
        movieTitle = 'Mr. Nobody';
    }

    //for loop for handling user input
    // const titleList = movieTitle.split(' ');
    // let len = titleList.length;
    // for (var i = 0; i < len; i++) {
    //     if (i === 0) {
    //         movieTitle += titleList[i].toLowerCase();
    //     } else {
    //         movieTitle = movieTitle + '+' + titleList[i].toLowerCase();
    //     }
    //} //end of user input for loop

    //OMDB API query
    const queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=e9de9dfe";

    request(queryUrl, function (error, response, body) {
        const movieInfo = JSON.parse(body);

        console.log('movie title is:' + movieTitle);

        console.log('\n');
        console.log("+ Title: " + movieInfo.Title);
        console.log("+ Year Released: " + movieInfo.Year);
        console.log("+ IMDB Rating: " + movieInfo.Ratings[0].Value);
        console.log("+ Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
        console.log("+ Country of Origin: " + movieInfo.Country);
        console.log("+ Language: " + movieInfo.Language);
        console.log("\n+ Plot: " + movieInfo.Plot + "\n");
        console.log("+ Cast: " + movieInfo.Actors);
        console.log('\n');

        //adds text to log.txt
        fs.appendFile('log.txt', '\n ===== OMBD QUERY ===== \n'
                                    + '+ Title: ' + movieInfo.Title
                                    + '+ Year Released: ' + movieInfo.Year
                                    + '+ IMdB Rating: ' + movieInfo.imdbRating
                                    + '+ Rotten Tomatoes Rating: ' + movieInfo.tomatoRating
                                    + '+ Country of Origin: ' + movieInfo.Country
                                    + '+ Language: ' + movieInfo.Language
                                    + '\n + Plot: ' + movieInfo.Plot + '\n'
                                    + '+ Cast: ' + movieInfo.Actors
                                    +'\n');
    

    });//end of request
};


// ===== DO WHAT IT SAYS ===== //

//'do-what-it-says'
//using fs - text from inside random.txt and use it to call one of LIRI's commands
//should run 'spotify-this-song' for "I want it that way"

function doIt () {
    fs.readFile('random.txt', "utf8", function(error, data){
        var txt = data.split(',');
        var command = txt[0];
        
        // ALLOWS DO IT TO CHOOSE COMMAND
        switch (command) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                songSearch(txt[1]);
                break;
            case "movie-this":
                movieThis();
                break;

            default: 
            console.log("Something went horribly wrong!")
        }
    });//end of fs.readFile

};

//BONUS: in addition to logging data, output data to a log.txt file as an append.