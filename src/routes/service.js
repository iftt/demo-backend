// @flow
import express, { Router } from 'express';
import { RocksDB } from '../models';

const router = Router();

export default function service(rocksDB: RocksDB) {
  router.post('/createService', (req, res) => {
    let { service } = req.body;

    rocksDB.createService(service, (err, value) => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not save the new service', errorMessage: err });
      else
        res.status(200).send(value);
    });
  });

  router.post('/getService', (req, res) => {
    let { serviceId } = req.body;

    rocksDB.getService(serviceId, (err, value) => {
      if (err)
        res.status(417).send({ error: true, message: 'Could not get the device id', errorMessage: err });
      else
        res.status(200).send(value);
    });
  });

  return router;
}
