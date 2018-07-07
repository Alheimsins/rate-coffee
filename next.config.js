const withOffline = require('next-offline')

module.exports = {
  publicRuntimeConfig: {
    HOST_URL: process.env.DOMAIN || 'http://localhost:3000',
    GUNDB_URL: 'https://gundb.alheimsins.net/gun'
  },
  serverRuntimeConfig: {
    GOOGLE_API_TOKEN: process.env.GOOGLE_API_TOKEN || false
  },
  ...withOffline()
}
