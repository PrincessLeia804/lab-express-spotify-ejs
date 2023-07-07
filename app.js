require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/:artistId', (req, res) => {
    console.log(req.query.name);

    spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items)
            // save data in variables before rendering

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", {artist: data})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.get('/artist-search', (req, res) => {
    res.render('artist-search-results')
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
