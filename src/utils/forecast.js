const request = require('request')


const forecast = (lt, lg, callback) => {
    const url = 'https://api.darksky.net/forecast/b49ce48314faa05f28fb98f7ac1ef4a8/' + lt + ',' + lg + '?units=si'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect weather services!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is ' + body.currently.precipProbability + '% chance of rain.')
        }
    })
}

module.exports = forecast