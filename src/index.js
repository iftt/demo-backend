// @flow
import express from 'express'
import bodyParser from 'body-parser'
import setRoutes from './routes'
import apiValidation from './middleware/apiValidation'

require('dotenv').config()

const app = express()

/** MiddleWare **/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(apiValidation)

/** Routes **/
setRoutes(app)

/** RUN **/
app.listen(process.env.PORT, () => {
  console.log(`Listening at Port ${(process.env.PORT) ? process.env.PORT : 'unknown'}`)
})
