const axios = require('axios')
// const weatherService = require('./test/weatherService.json')

const address = '192.168.0.46'
const port = 3001

/** TEST **/
axios
  .post(`http://${address}:${port}/login`)
  .then(function (response) {
    const token = response.data
    axios
      .get(`http://${address}:${port}/`, {
        headers: { 'x-access-token': token }
      })
      .then(function (response) {
        console.log(response.data)
        console.log(response.headers)
      })
      .catch(function (error) {
        console.log(error)
      })
  })
  .catch(function (error) {
    console.log(error)
  })

/** UPDATE DEVICE LOCATION **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/device/updateDeviceLocation`, {
//         token,
//         deviceId: 'abcdefg'
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

/** GET DEVICE **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/device/getDevice`, {
//         token,
//         deviceId: '477a5971-3e9d-4eae-98fe-22cb4c153dc1'
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

/** SUBSCRIBE WEATHER STATION **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/weather/subscribe`, {
//         token,
//         geo: { lon: -78.632560, lat: 35.523086 },
//         apiKey: 'e4577289bec84a09aa12094c4b312341c733dbc80834fc5a8d02fe84d641dcb'
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

/** UNSUBSCRIBE WEATHER STATION **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/weather/unsubscribe`, {
//         token,
//         apiKey: 'e4577289bec84a09aa12094c4b3eac071c733dbc80834fc5a8d02fe84d641dcb'
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

/** GET NEXT ROOT **/
// axios
//   .get(`http://${address}:${port}/weather/getNextRoot`)
//   .then(function (response) {
//     console.log(response.data)
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

/** CREATE A NEW SERVICE **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/service/createService`, {
//         token,
//         service: weatherService
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

// Weather Service ID: 86591f76-d3e7-47e4-9d85-e3731101c4ae
/** GET WEATHER SERVICE **/
// axios
//   .post(`http://${address}:${port}/login`)
//   .then(function (response) {
//     const token = response.data
//     axios
//       .post(`http://${address}:${port}/service/getService`, {
//         token,
//         serviceId: '86591f76-d3e7-47e4-9d85-e3731101c4ae'
//       })
//       .then(function (response) {
//         console.log(response.data)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   })
//   .catch(function (error) {
//     console.log(error)
//   })
