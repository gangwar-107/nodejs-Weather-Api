const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

// console.log(__dirname)

const app = express()

// Define the path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials') //Going to reuse the code in other pages.

// convert by default views to viewPath location
// setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)
    //****** It is most important thing to use it with express and node js(using partials to reuse code in dfferent pages)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//*** Express by default sees views folder into root directory to rennder hbs pages
// we can change views to templates, if we are doing so, then we have to explicitly change it 
// Sending dynamic content to a page using hbs(handlebars)
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Surendra'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        name: 'Surendra',
        title: 'Help Page'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Provide a specific address."
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({
                    error
                })
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }
                res.send({
                    location: location,
                    forecast: forecastData
                })
            })
        })
    }
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Surendra'
    })
})

// Basic of query strings
// Http response are sent only once
// query strings come from browser url
// ?search= games&rating=5 return games with 5 ratings

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: "You must provide a search item."
        })
    } else {
        console.log(req.query.search)
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Surendra',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Surendra',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})