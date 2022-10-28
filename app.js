require('dotenv').config();

const express = require('express');
const ejs = require("ejs");
const app = express();
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body["access_token"]))
.catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/artist-search", (req, res) => {
console.log(req.query);
const { artist } = req.query; 
spotifyApi.searchArtists( artist )
    .then(data => {
      console.log('The received data from the API: ', data.body); 
      const albumArr = data.body.artists.items;
      res.render("artist-search", {albumArr});
    })
   .catch(err => console.log('The error while searching artists occurred: ', err));
}) 

app.get("/artist-search-results", (req, res) => {
    res.render("artist-search-results");
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
