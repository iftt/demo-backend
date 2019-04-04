// @flow
import AmbientWeather, { AWOptions } from './ambientWeather';
import * as iotaAreaCodes            from '@iota/area-codes';
import * as Mam                      from '@iftt/mam';
import TryteBuffer                   from '@iftt/tryte-buffer';
import weatherProtocol               from './weatherProtocol.json';
import Redis                         from 'redis';

require('dotenv').config(); // .env variables

class WeatherGraph extends AmbientWeather {
  constructor(ambientWeatherOptions: AWOptions, tangleLocation: string = 'https://nodes.devnet.thetangle.org:443') {
    super(ambientWeatherOptions);
    this.ambientWeatherApi.connect();
    this.tryteBuffer = new TryteBuffer(weatherProtocol);
    this.redisClient = Redis.createClient();
    if (tangleLocation === 'https://nodes.devnet.thetangle.org:443')
      this.minWeightMagnitude = 9;
    else
      this.minWeightMagnitude = 14;
    // setup MAM, and if there is a recorded latest state, let's grab it
    this.mamState = Mam.init(tangleLocation, process.env.WEATHER_TANGLE_SEED);
    this.redisClient.get('mamstate', (err, state) => {
      if (!err) {
        state = JSON.parse(state);
        if (state)
          this.mamState = state;
      }
    });
  }

  _onWeatherConnect() {
    this._getAllSubscriptions();
  }

  _getAllSubscriptions() {
    const self = this;
    let apis = [];
    self.redisClient.keys('*', (err, keys) => {
      if (!err) {
        async function getDevices() {
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let device = await self.getDevice(key);
            if (device && device.apiKey)
              apis.push(device.apiKey);
          }
          if (apis.length)
            self._subscribe(apis);
        }
        getDevices();
      }
    });
  }

  getDevice(device) {
    const self = this;
    return new Promise(res => {
      self.redisClient.get(device, (err, state) => {
        if (err)
          res(null);
        res(JSON.parse(state));
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
            const sub = subscriptions.devices.filter(sub => sub.apiKey === api)[0];
            const iac = iotaAreaCodes.encode(geo.lat, geo.lon, iotaAreaCodes.CodePrecision.EXTRA);
            const codeArea = iotaAreaCodes.decode(iac);
            const olc = iotaAreaCodes.toOpenLocationCode(iac);
            let device = {
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
            device = JSON.stringify(device);
            self.redisClient.set(sub.macAddress, device);
            // TODO: add to mongoDB weatherStation store (not part of demo)
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
        // TODO: if successful return null, otherwise error
        if (subscriptions.method === 'unsubscribe') {
          // find the device and unsubscribe
          self._delDeviceIfApi(api)
            .then(() => {
              res(null);
            })
            .catch(err => {
              rej('unable to find device', err);
            });
        } else {
          res(null);
        }
      });
      self._unsubscribe(api);
    });
  }

  _delDeviceIfApi(api: string) {
    const self = this;
    return new Promise((res, rej) => {
      self.redisClient.keys('*', (err, keys) => {
        if (!err) {
          async function findDevicesAndDel() {
            for (let i = 0; i < keys.length; i++) {
              let key = keys[i];
              let device = await self.getDevice(key);
              if (device && device.apiKey && device.apiKey === api)
                self.redisClient.del(device.macAddress);
            }
            res(null);
          }
          findDevicesAndDel();
        } else {
          rej(err);
        }
      });
    });
  }

  _onWeatherUpdate(update) {
    const self = this;
    // check redisClient, if station exists we submit the update to mongo AND the tangle
    self.redisClient.get(update.macAddress, (err, station) => {
      if (!err && station) {
        station = JSON.parse(station);
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
      self.redisClient.set('mamstate', JSON.stringify(self.mamState));
      await Mam.attach(message.payload, message.address, 3, self.minWeightMagnitude, tag);
      // console.log('uploaded!', trytes);
      console.log('Root:', message.root);
    } catch(err) {}
  }

  // TODO (not for demo): instead of insta-publishing, store in an array.
  // If there is more than 100 OR 5 minutes have passed, publish
}

export default WeatherGraph;
