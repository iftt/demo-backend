// @flow
import express, { Router } from 'express';
import Models from '../models';

/** ROUTES **/
import device  from './device';
import weather from './weather';
import login   from './login';
import service from './service';

const models = new Models();
const { nedDB, weatherGraph } = models;
const router = Router();

router.get('/', (req, res) => {
  res.json({message : 'Hello World'});
});

export default function setRoutes(app: express) {
  app.use('/', router);
  app.use('/', login());
  app.use('/device', device(nedDB));
  app.use('/service', service(nedDB));
  app.use('/weather', weather(weatherGraph));
}
