// @flow
import express, { Router } from 'express';
import { NedDB } from '../models';

const router = Router();

export default function device(nedDB: NedDB) {
  router.post('/updateDeviceLocation', (req, res) => {
    let { deviceId, ip } = req.body;
    if (!ip)
      ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == '::ffff:')
      ip = ip.substr(7);

    nedDB.updateDeviceLocation(deviceId, ip, err => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not set your device', errorMessage: err });
      else
        res.status(200).send({ deviceId, ip });
    });
  });

  router.post('/createDevice', (req, res) => {
    let { deviceId, deviceProtocol } = req.body;

    nedDB.getDevice(deviceId, (err, value) => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not get your device', errorMessage: err });
      else
        res.status(200).send(value);
    });
  });

  router.post('/getDevice', (req, res) => {
    let { deviceId } = req.body;

    nedDB.getDevice(deviceId, (err, value) => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not get your device', errorMessage: err });
      else
        res.status(200).send(value);
    });
  });

  router.post('/programDevice', (req, res) => {
    let { deviceId, instructionSet } = req.body;

    nedDB.programDevice(deviceId, instructionSet, err => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not program your device', errorMessage: err });
      else
        res.status(200).send({ deviceId, instructionSet });
    });
  });

  return router;
}
