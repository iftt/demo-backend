// @flow
import express, { Router } from 'express';
import { NedDB } from '../models';

const router = Router();

export default function service(nedDB: NedDB) {
  router.post('/createService', (req, res) => {
    let { service } = req.body;

    nedDB.createService(service, (err, value) => {
      if (err)
        return res.status(417).send({ error: true, message: 'Could not save the new service', errorMessage: err });
      res.status(200).send(value.serviceId);
    });
  });

  router.post('/getService', (req, res) => {
    let { serviceId } = req.body;

    nedDB.getService(serviceId, (err, value) => {
      if (err)
        return res.status(417).send({ error: true, message: 'Could not get the device id', errorMessage: err });
      res.status(200).send(value);
    });
  });

  return router;
}
