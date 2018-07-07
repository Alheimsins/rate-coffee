const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  require('dotenv').config()
}
const routes = require('./routes')
const next = require('next')
const { createServer } = require('http')
const port = parseInt(process.env.PORT, 10) || 3000
const app = next({ dev })
const handle = routes.getRequestHandler(app)
const axios = require('axios')
const { serverRuntimeConfig: { GOOGLE_API_TOKEN } } = require('./next.config')
const { parse } = require('url')
const { join } = require('path')
const fs = require('fs').promises

const server = createServer(async (req, res) => {
  const { pathname, query } = parse(req.url, true)
  if (pathname.includes('/getNearbyCafes')) {
    try {
      const { lat, long } = query
      // type=cafe
      const { data } = await axios(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=100&key=${GOOGLE_API_TOKEN}`)
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify(data))
      res.end()
    } catch (error) {
      console.log(error)
      res.end(req)
    }
  }
  if (pathname.includes('/getById')) {
    try {
      const { id } = query
      const { data } = await axios(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=photos,place_id,formatted_address,name,rating,opening_hours&key=${GOOGLE_API_TOKEN}`)
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify(data))
      res.end()
    } catch (error) {
      console.log(error)
      res.end(query)
    }
  }
  if (pathname.includes('/search')) {
    try {
      const { inputText } = query
      const { data } = await axios(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${inputText}&inputtype=textquery&fields=place_id,formatted_address,name,opening_hours&key=${GOOGLE_API_TOKEN}`)
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify(data))
      res.end()
    } catch (error) {
      console.log(error)
      res.end(req)
    }
  }
  if (pathname.includes('/service-worker.js')) {
    try {
      const filePath = join(__dirname, '.next', 'service-worker.js')
      const file = await fs.readFile(filePath)
      res.writeHead(200, {'Content-Type': 'application/javascript'})
      res.write(file)
      res.end()
    } catch (error) {
      console.log(error)
      res.end(req)
    }
  } else {
    handle(req, res)
  }
})

app.prepare()
  .then(() => {
    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
