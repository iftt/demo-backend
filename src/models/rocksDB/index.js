// @flow
import Models from '../';
import Level  from 'level-rocksdb';
import uuidv4 from 'uuid.v4';

// type IPTable = {
//   ipv4: string,
//   ipv6: string
// }

type Service = {
  protocol: Object,
  getRoot: String
}

// Setup the deepstream server
class RocksDB { // RocksDB
  models: Models;
  levelDB: Level;
  constructor(models: Models) {
    this.models  = models;
    this.levelDB = Level('./rocksdb');
  }

  updateDeviceLocation(deviceId: string, ipAddress: string, cb: Function): string | null {
    return this.levelDB.get(deviceId, (err, value) => {
      if (err || !value)
        value = {};
      else
        value = JSON.parse(value);
      value.ip = ipAddress;
      this.levelDB.put(deviceId, JSON.stringify(value), err => {
        if (err)
          cb(err);
        cb(null);
      });
    });
  }

  createService(service: Service, cb: Function) {
    // first create a serviceID
    let serviceId = uuidv4();
    return this.updateService(serviceId, service, cb);
  }

  updateService(serviceId: string, service: Service, cb: Function) {
    return this.levelDB.put(serviceId, JSON.stringify(service), err => {
      if (err)
        cb(err, null);
      cb(null, serviceId);
    });
  }

  getService(serviceId: string, cb: Function) {
    return this.get(serviceId, cb);
  }

  getDevice(serviceId: string, cb: Function) {
    return this.get(serviceId, cb);
  }

  get(key: string, cb: Function) {
    return this.levelDB.get(key, (err, value) => {
      if (err)
        cb(err, null);
      cb(null, JSON.parse(value));
    });
  }

  programDevice(deviceId: string, instructionSet: object, cb: Function): string | null {
    // update store for device to include current programming and then contact the device to ensure it gets the instruction set
    return this.levelDB.get(deviceId, (err, value) => {
      if (err || !value)
        value = {};
      value.instructionSet = instructionSet;
      this.levelDB.put(deviceId, JSON.stringify(value), err => {
        if (err)
          cb(err);
        cb(null);
      });
    });
  }
}

export default RocksDB;
