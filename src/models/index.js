// @flow
import RocksDB from './rocksDB';
import WeatherGraph from './ambientWeather';

export class Models {
  rocksDB: RocksDB;
  constructor() {
    this.rocksDB      = new RocksDB(this);
    this.weatherGraph = new WeatherGraph(this);
  }
}

export default Models;
export { default as RocksDB }      from './rocksDB';
export { default as WeatherGraph } from './ambientWeather';
