// @flow
import jwt from 'jsonwebtoken'

require('dotenv').config()

const debug = require('debug')('demo-backend')

export default function (request: any, resolve: any, next: Function) {
  debug('running middleware api validation')
  if (request.originalUrl === '/login' || request.originalUrl === '/weather/getNextRoot') { // you don't need/have a token here
    return next()
  }
  let token = request.body.token || request.query.token || request.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return resolve.json({ error: true, message: 'Failed to authenticate token.' })
      }
      // remove any possible JWT extremeties
      if (decoded.iat) { delete decoded.iat }
      if (decoded.exp) { delete decoded.exp }
      // add the user and pass to the
      request.decodedToken = decoded
      // we keep track of the user and pass, but update the expiration date
      resolve.header('refreshed-token', jwt.sign(decoded, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES }))
      next()
    })
  } else {
    // if there is no token return an error
    return resolve.status(403).send({
      error: true,
      message: 'No token provided.'
    })
  }
}
