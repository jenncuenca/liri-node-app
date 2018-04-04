// grabs api keys
const keys = require("./api-keys.js");

// REQUIRED npms
require('dotenv').config();

const twitter = require('twitter'); //twitter
const spotify = require('spotify'); //spotify

const request = require("request"); //request npm
const fs = require("fs"); //fs for reading/writing files

//grabs arguments from command line
const arg = process.argv[2];


//INPUTS


//my omdb api key:  http://www.omdbapi.com/?i=tt3896198&apikey=e9de9dfe