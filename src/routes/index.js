// @flow
import express, { Router } from 'express';
import Models from '../models';

/** ROUTES **/
import device  from './device';
import weather from './weather';
import login   from './login';
import service from './service';

const models = new Models();
const { rocksDB, weatherGraph } = models;
const router = Router();

router.get('/', (req, res) => {
  res.json({message : 'Hello World'});
});

export default function setRoutes(app: express) {
  app.use('/', router);
  app.use('/', login());
  app.use('/device', device(rocksDB));
  app.use('/service', service(rocksDB));
  app.use('/weather', weather(weatherGraph));
}
