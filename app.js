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

// const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }))

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
            
app.get('/:artistId', async (req, res) => {

    try{
        let artists = await spotifyApi.searchArtists(req.query.artistSearch)
        // let artistId = artist.body.artists.items[0].id
        // let albums = await spotifyApi.getArtistAlbums(artistId)
        res.render("artist-search-results", {data : artists})

    } catch(e) {
        console.log(e);
    }
})

app.get('/:albumsId', async (req, res) => {

    try{
        let albums = await spotifyApi.getArtistAlbums(req.query.artistId)
        res.render("artist-search-results", {data : albums})

    } catch(e) {
        console.log(e);
    }
})


app.get('/artist-search', (req, res) => {
    res.render('artist-search-results')
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
