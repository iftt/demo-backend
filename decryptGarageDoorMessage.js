const garageProtocol = require('./test/garageProtocol.json')

const TryteBuffer = require('@iftt/tryte-buffer').default
const tryteBuffer = new TryteBuffer(garageProtocol)

const decodedTrytes = tryteBuffer.decode('D9HOPQW9')

console.log(decodedTrytes)
