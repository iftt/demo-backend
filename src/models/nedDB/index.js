// @flow
import Models from '../'
import NedDBStore from 'nedb'
import uuidv4 from 'uuid.v4'
import ioClient from 'socket.io-client'

const debug = require('debug')('demo-backend:nedDB')

type Service = {
  serviceId: string,
  protocol: { string: { string: any } },
  getRoot: string
}

type Program = {
  condition: Object,
  action: { key: string, value: any }
}

export type Instructions = {
  serviceId: string,
  service: Service,
  program: Program
}

type Device = {
  deviceId: string,
  ip?: string
}

class NedDB { // NedDB
  models: Models
  nedDB: NedDBStore
  constructor (models: Models) {
    debug('creating NedDB')
    this.models = models
    this.nedDB = new NedDBStore({ filename: './iftt.db', autoload: true })
  }

  updateDeviceLocation (deviceId: string, ip: string, cb: Function): string | null {
    debug('updateDeviceLocation - %s', deviceId)
    return this.nedDB.findOne({ deviceId }, (err: Error, device: Device) => {
      if (err) {
        return cb(err, null)
      }
      if (!device) {
        device = { deviceId }
      }
      device.ip = ip
      this.nedDB.update({ deviceId }, device, { upsert: true, returnUpdatedDocs: true }, (err, numUpdated, newDoc) => {
        cb(err, newDoc)
      })
    })
  }

  createService (service: Service, cb: Function) {
    debug('createService')
    // first create a serviceID
    let serviceId = uuidv4()
    service.serviceId = serviceId
    return this.nedDB.insert(service, (err, newDoc) => { cb(err, newDoc) })
  }

  getService (serviceId: string, cb: Function) {
    debug('getService - %s', serviceId)
    return this.nedDB.findOne({ serviceId }, (err, doc) => { cb(err, doc) })
  }

  createDevice (deviceId: string, deviceProtocol: { string: Object }, cb: Function) {
    debug('createDevice - %s', deviceId)
    return this.nedDB.findOne({ deviceId }, (err, device) => {
      if (err) {
        device = { deviceId, deviceProtocol }
      } else {
        device.deviceProtocol = deviceProtocol
      }
      this.nedDB.update({ deviceId }, device, { upsert: true, returnUpdatedDocs: true }, (err, numUpdated, newDoc) => {
        cb(err, newDoc)
      })
    })
  }

  getDevice (deviceId: string, cb: Function) {
    debug('getDevice - %s', deviceId)
    return this.nedDB.findOne({ deviceId }, (err, doc) => { cb(err, doc) })
  }

  programDevice (deviceId: string, instructions: [Instructions], cb: Function): string | null {
    debug('programDevice - %s', deviceId)
    // update store for device to include current programming and then contact the device to ensure it gets the instruction set
    return this.nedDB.findOne({ deviceId }, (err, device) => {
      if (err) { return cb(err, null) }
      device.instructions = instructions
      try {
        const socketClient = ioClient.connect(`http://${device.ip}:8001`)
        socketClient.on('ready', client => {
          socketClient.emit('program', instructions)
          this.nedDB.update({ deviceId }, device, { upsert: true, returnUpdatedDocs: true }, (err, numUpdated, newDoc) => {
            cb(err, newDoc)
          })
          socketClient.close()
        })
      } catch (err) {
        cb(err)
      }
    })
  }
}

export default NedDB
