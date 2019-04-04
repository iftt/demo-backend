const axios = require('axios');
const weatherService = require('./test/weatherService.json');

/** TEST **/
axios
  .post('http://192.168.0.46:3001/login')
  .then(function (response) {
    const token = response.data;
    axios
      .get('http://127.0.0.1:3001/', {
        headers: { 'x-access-token': token }
      })
      .then(function (response) {
        console.log(response.data);
        console.log(response.headers);
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  .catch(function (error) {
    console.log(error);
  });


/** UPDATE DEVICE LOCATION **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://127.0.0.1:3001/device/updateDeviceLocation', {
//         token,
//         deviceId: 'abcdefg'
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


/** GET DEVICE **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://127.0.0.1:3001/device/getDevice', {
//         token,
//         deviceId: 'abcdefg'
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

/** SUBSCRIBE WEATHER STATION **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://127.0.0.1:3001/weather/subscribe', {
//         token,
//         geo: { lon: -78.632560, lat: 35.523086 },
//         apiKey: 'e4577289bec84a09aa12094c4b3eac071c733dbc80834fc5a8d02fe84d641dcb'
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

/** UNSUBSCRIBE WEATHER STATION **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://127.0.0.1:3001/weather/unsubscribe', {
//         token,
//         apiKey: 'e4577289bec84a09aa12094c4b3eac071c733dbc80834fc5a8d02fe84d641dcb'
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

/** GET NEXT ROOT **/
// axios
//   .post('http://192.168.0.46:3001/weather/getNextRoot')
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

/** CREATE A NEW SERVICE **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://192.168.0.46:3001/service/createService', {
//         token,
//         service: weatherService
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


// Weather Service ID: 455d5ac0-702d-4e50-9280-2560e9a6e17c
/** GET WEATHER SERVICE **/
// axios
//   .post('http://192.168.0.46:3001/login')
//   .then(function (response) {
//     const token = response.data;
//     axios
//       .post('http://192.168.0.46:3001/service/getService', {
//         token,
//         serviceId: '455d5ac0-702d-4e50-9280-2560e9a6e17c'
//       })
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
