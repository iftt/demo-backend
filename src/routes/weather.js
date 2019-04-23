// @flow
import { Router } from 'express'
import { WeatherGraph } from '../models'

const debug = require('debug')('demo-backend:weather')

const router = Router()

export default function device (weatherGraph: WeatherGraph) {
  router.post('/subscribe', (req, res) => {
    debug('[post] /subscribe')
    let { geo, apiKey } = req.body

    weatherGraph.subscribe(geo, apiKey)
      .then(() => {
        res.status(200).send({ success: true })
      })
      .catch(err => {
        res.status(417).send({ error: true, message: 'Could not subscribe your api', errorReport: err })
      })
  })

  router.post('/unsubscribe', (req, res) => {
    debug('[post] /unsubscribe')
    let { apiKey } = req.body

    weatherGraph.unsubscribe(apiKey)
      .then(() => {
        res.status(200).send({ success: true })
      })
      .catch((errorMessage, err) => {
        res.status(417).send({ error: true, message: errorMessage, errorReport: err })
      })
  })

  router.get('/getNextRoot', (req, res) => {
    debug('[get] /getNextRoot')
    let state = weatherGraph.getMamState()
    if (state && state.channel && state.channel.next_root) {
      res.status(200).send({ nextRoot: state.channel.next_root })
    } else {
      res.status(417).send({ error: true, message: 'unable to get mam state at this time.' })
    }
  })

  return router
}
