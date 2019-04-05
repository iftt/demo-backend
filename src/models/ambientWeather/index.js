// @flow
import AmbientWeather, { AWOptions } from './ambientWeather';
import * as iotaAreaCodes            from '@iota/area-codes';
import * as Mam                      from '@iftt/mam';
import TryteBuffer                   from '@iftt/tryte-buffer';
import weatherProtocol               from './weatherProtocol.json';
import NedDB                         from 'nedb';

require('dotenv').config(); // .env variables

class WeatherGraph extends AmbientWeather {
  constructor(ambientWeatherOptions: AWOptions, tangleLocation: string = 'https://nodes.devnet.thetangle.org:443') {
    super(ambientWeatherOptions);
    this.ambientWeatherApi.connect();
    this.tryteBuffer = new TryteBuffer(weatherProtocol);
    this.dbClient = new NedDB({ filename: './ambientWeather.db', autoload: true });
    if (tangleLocation === 'https://nodes.devnet.thetangle.org:443')
      this.minWeightMagnitude = 9;
    else
      this.minWeightMagnitude = 14;
    // setup MAM, and if there is a recorded latest state, let's grab it
    this.mamState = Mam.init(tangleLocation, process.env.WEATHER_TANGLE_SEED);
    this.dbClient.findOne({ key: 'mamstate' }, (err, doc) => {
      if (!err && doc)
        this.mamState = doc.state;
    });
  }

  _onWeatherConnect() {
    this._getAllSubscriptions();
  }

  _getAllSubscriptions() {
    const self = this;
    let apis = [];
    self.dbClient.find({ subscription: true }, (err, docs) => {
      if (!err && docs.length) {
        let apis = docs.map(doc => { return doc.apiKey; });
        self._subscribe(apis);
      }
    });
  }

  getDevice(device) {
    const self = this;
    return new Promise(res => {
      self.dbClient.findOne({ macAddress: device.macAddress }, (err, doc) => {
        if (err)
          res(null);
        res(doc);
      });
    });
  }

  getMamState() {
    return this.mamState;
  }

  subscribe(geo: {lon: number, lat: number}, api: string) {
    const self = this;
    return new Promise((res, rej) => {
      if (!geo || typeof geo !== 'object' || !api || typeof api !== 'string') {
        rej('Incorrect parameters');
      } else {
        let noresponseTimer = setTimeout(() => {
          rej('no api response');
        }, 7000);
        self.ambientWeatherApi.once('subscribed', subscriptions => {
          clearTimeout(noresponseTimer);
          if (subscriptions.invalidApiKeys && subscriptions.invalidApiKeys.includes(api)) {
            self._unsubscribe(api);
            rej('Bad api');
          } else {
            // save to a short term dataset and the database
            subscriptions.devices.forEach(sub => {
              const iac = iotaAreaCodes.encode(geo.lat, geo.lon, iotaAreaCodes.CodePrecision.EXTRA);
              const codeArea = iotaAreaCodes.decode(iac);
              const olc = iotaAreaCodes.toOpenLocationCode(iac);
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
              };
              self.dbClient.update({ macAddress: device.macAddress }, device, { upsert: true });
              self.dbClient.update({ apiKey: api }, { apiKey: api, subscription: true }, { upsert: true });
            });
            res(null);
          }
        });
        self._subscribe(api);
      }
    });
  }

  unsubscribe(api: string) {
    const self = this;
    return new Promise((res, rej) => {
      let noresponseTimer = setTimeout(() => {
        rej('no api response');
      }, 7000);
      self.ambientWeatherApi.once('subscribed', subscriptions => {
        clearTimeout(noresponseTimer);
        if (subscriptions.method === 'unsubscribe') {
          // find the device and unsubscribe
          self._delFromApi(api)
            .then(() => { res(null); })
            .catch(err => { rej('unable to find any devices associated with api', err); });
        } else {
          res(null);
        }
      });
      self._unsubscribe(api);
    });
  }

  _delFromApi(api: string) {
    const self = this;
    return new Promise((res, rej) => {
      self.dbClient.remove({ apiKey: api }, { multi: true }, (err, numRemoved) => { // this will remove the device(s) and subscription
        if (err || !numRemoved)
          rej(err);
        res(null);
      });
    });
  }

  _onWeatherUpdate(update) {
    const self = this;
    // check redisClient, if station exists we submit the update to mongo AND the tangle
    self.dbClient.findOne({ macAddress: update.macAddress }, (err, station) => {
      if (!err && station) {
        update.date = new Date(update.date);
        update.lastRain = new Date(update.lastRain);
        update.location = {
          lat: station.geometry.coordinates[1],
          lon: station.geometry.coordinates[0]
        };
        const trytes = self.tryteBuffer.encode(update);
        self._publish(trytes, station.iotaAreaCode);
      }
    });
  }

  async _publish(trytes: string, tag: string) {
    const self = this;
    try {
      const message = Mam.create(self.mamState, trytes);
      // update and store the state
      self.mamState = message.state;
      await Mam.attach(message.payload, message.address, 3, self.minWeightMagnitude, tag);
      self.dbClient.update({ key: 'mamstate' }, { key: 'mamstate', state: self.mamState }, { upsert: true });
      console.log('Root:', message.root);
    } catch(err) {}
  }
}

export default WeatherGraph;
