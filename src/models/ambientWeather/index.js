// @flow
import Models from '../'
import AmbientWeather from './ambientWeather'
import * as iotaAreaCodes from '@iota/area-codes'
import * as Mam from '@iftt/mam'
import TryteBuffer from '@iftt/tryte-buffer'
import weatherProtocol from './weatherProtocol.json'
import NedDB from 'nedb'

import type { AWOptions } from './ambientWeather'

const debug = require('debug')('weather-graph')

require('dotenv').config() // .env variables

class WeatherGraph extends AmbientWeather {
  models: Models
  tryteBuffer: TryteBuffer
  dbClient: NedDB
  minWeightMagnitude: number
  mamState: Object
  constructor (models: Models, ambientWeatherOptions?: AWOptions, tangleLocation?: string = 'https://nodes.devnet.thetangle.org:443') {
    super(ambientWeatherOptions)
    this.models = models
    debug('creating WeatherGraph')
    this.ambientWeatherApi.connect()
    this.tryteBuffer = new TryteBuffer(weatherProtocol)
    this.dbClient = new NedDB({ filename: './ambientWeather.db', autoload: true })
    if (tangleLocation === 'https://nodes.devnet.thetangle.org:443') {
      this.minWeightMagnitude = 9
    } else {
      this.minWeightMagnitude = 14
    }
    // setup MAM, and if there is a recorded latest state, let's grab it
    this.mamState = Mam.init(tangleLocation, process.env.WEATHER_TANGLE_SEED)
    this.dbClient.findOne({ key: 'mamstate' }, (err, doc) => {
      if (!err && doc) { this.mamState = doc.state }
    })
  }

  _onWeatherConnect () {
    debug('_onWeatherConnect')
    this._getAllSubscriptions()
  }

  _getAllSubscriptions () {
    debug('_getAllSubscriptions')
    const self = this
    self.dbClient.find({ subscription: true }, (err, docs) => {
      if (!err && docs.length) {
        let apis = docs.map(doc => { return doc.apiKey })
        self._subscribe(apis)
      }
    })
  }

  getDevice (device: Object): Promise<null | Object> {
    debug('getDevice')
    const self = this
    return new Promise((resolve, reject) => {
      self.dbClient.findOne({ macAddress: device.macAddress }, (err, doc) => {
        if (err) { resolve(null) }
        resolve(doc)
      })
    })
  }

  getMamState () {
    debug('getMamState')
    return this.mamState
  }

  subscribe (geo: {lon: number, lat: number}, api: string): Promise<Error | null> {
    debug('subscribe')
    const self = this
    return new Promise((resolve, reject) => {
      if (!geo || typeof geo !== 'object' || !api || typeof api !== 'string') {
        reject(new Error('Incorrect parameters'))
      } else {
        let noresponseTimer = setTimeout(() => {
          reject(new Error('no api response'))
        }, 7000)
        self.ambientWeatherApi.once('subscribed', subscriptions => {
          clearTimeout(noresponseTimer)
          if (subscriptions.invalidApiKeys && subscriptions.invalidApiKeys.includes(api)) {
            self._unsubscribe(api)
            reject(new Error('Bad api'))
          } else {
            // save to a short term dataset and the database
            subscriptions.devices.forEach(sub => {
              const iac = iotaAreaCodes.encode(geo.lat, geo.lon, iotaAreaCodes.CodePrecision.EXTRA)
              const codeArea = iotaAreaCodes.decode(iac)
              const olc = iotaAreaCodes.toOpenLocationCode(iac)
              const device = {
                geometry: { type: 'Point', coordinates: [geo.lon, geo.lat] },
                creationDate: new Date(),
                info: sub.info,
                macAddress: sub.macAddress,
                apiKey: api,
                deviceId: sub.lastData.deviceId,
                plusCode: olc,
                iotaAreaCode: iac,
                bounds: { maxLat: codeArea.latitudeHigh, minLat: codeArea.latitudeLow, maxLon: codeArea.longitudeHigh, minLon: codeArea.longitudeLow }
              }
              self.dbClient.update({ macAddress: device.macAddress }, device, { upsert: true })
              self.dbClient.update({ apiKey: api }, { apiKey: api, subscription: true }, { upsert: true })
            })
            resolve(null)
          }
        })
        self._subscribe(api)
      }
    })
  }

  unsubscribe (api: string): Promise<Error | null> {
    debug('unsubscribe')
    const self = this
    return new Promise((resolve, reject) => {
      let noresponseTimer = setTimeout(() => {
        reject(new Error('no api response'))
      }, 7000)
      self.ambientWeatherApi.once('subscribed', subscriptions => {
        clearTimeout(noresponseTimer)
        if (subscriptions.method === 'unsubscribe') {
          // find the device and unsubscribe
          self._delFromApi(api)
            .then(() => { resolve(null) })
            .catch(err => { reject(new Error(err)) })
        } else {
          resolve(null)
        }
      })
      self._unsubscribe(api)
    })
  }

  _delFromApi (api: string): Promise<Error | null> {
    debug('_delFromApi')
    const self = this
    return new Promise((resolve, reject) => {
      self.dbClient.remove({ apiKey: api }, { multi: true }, (err, numRemoved) => { // this will remove the device(s) and subscription
        if (err || !numRemoved) { reject(new Error(err)) }
        resolve(null)
      })
    })
  }

  _onWeatherUpdate (update: Object) {
    debug('_onWeatherUpdate')
    const self = this
    // check redisClient, if station exists we submit the update to mongo AND the tangle
    self.dbClient.findOne({ macAddress: update.macAddress }, (err, station) => {
      if (!err && station) {
        update.date = new Date(update.date)
        update.lastRain = new Date(update.lastRain)
        update.location = {
          lat: station.geometry.coordinates[1],
          lon: station.geometry.coordinates[0]
        }
        const trytes = self.tryteBuffer.encode(update)
        self._publish(trytes, station.iotaAreaCode)
      }
    })
  }

  async _publish (trytes: string, tag: string) {
    debug('_publish')
    const self = this
    try {
      const message = Mam.create(self.mamState, trytes)
      // update and store the state
      self.mamState = message.state
      await Mam.attach(message.payload, message.address, 3, self.minWeightMagnitude, tag)
      self.dbClient.update({ key: 'mamstate' }, { key: 'mamstate', state: self.mamState }, { upsert: true })
      console.log('Root:', message.root)
    } catch (err) {}
  }
}

export default WeatherGraph
