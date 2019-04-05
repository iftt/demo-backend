// @flow
import Models     from '../';
import NedDBStore from 'nedb';
import uuidv4     from 'uuid.v4';

// type IPTable = {
//   ipv4: string,
//   ipv6: string
// }

type Service = {
  protocol: Object,
  getRoot: String
}

// Setup the deepstream server
class NedDB { // NedDB
  models: Models;
  nedDB: NedDBStore;
  constructor(models: Models) {
    this.models  = models;
    this.nedDB = new NedDBStore({ filename: './iftt.db', autoload: true });
  }

  updateDeviceLocation(deviceId: string, ip: string, cb: Function): string | null {
    return this.nedDB.findOne({ deviceId }, (err, device) => {
      if (err)
        return cb(err, null);
      device.ip = ip;
      this.nedDB.update({ deviceId }, device, { upsert: true, returnUpdatedDocs: true }, (err, numUpdated, newDoc) => {
        cb(err, newDoc);
      });
    });
  }

  createService(service: Service, cb: Function) {
    // first create a serviceID
    let serviceId = uuidv4();
    service.serviceId = serviceId;
    return this.nedDB.insert(service, (err, newDoc) => { cb(err, newDoc) });
  }

  getService(serviceId: string, cb: Function) {
    return this.nedDB.findOne({ serviceId }, (err, doc) => { cb(err, doc) });
  }

  getDevice(deviceId: string, cb: Function) {
    return this.nedDB.findOne({ deviceId }, (err, doc) => { cb(err, doc) });
  }

  programDevice(deviceId: string, instructionSet: object, cb: Function): string | null {
    // update store for device to include current programming and then contact the device to ensure it gets the instruction set
    return this.nedDB.findOne({ deviceId }, (err, device) => {
      if (err)
        return cb(err, null);
      device.instructionSet = instructionSet;
      this.nedDB.update({ deviceId }, device, { upsert: true, returnUpdatedDocs: true }, (err, numUpdated, newDoc) => {
        cb(err, newDoc);
      });
    });
  }
}

export default NedDB;
