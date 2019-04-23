// @flow
import NedDB from './nedDB'
import WeatherGraph from './ambientWeather'

export class Models {
  nedDB: NedDB
  weatherGraph: WeatherGraph
  constructor () {
    this.nedDB = new NedDB(this)
    this.weatherGraph = new WeatherGraph(this)
  }
}

export default Models
export { default as NedDB } from './nedDB'
export { default as WeatherGraph } from './ambientWeather'
