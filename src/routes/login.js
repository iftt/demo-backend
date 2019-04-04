// @flow
import express, { Router } from 'express';
import { RocksDB } from '../models';
import jwt from 'jsonwebtoken';

const router = Router();

export default function login() {
  router.post('/login', (req, res) => {
    const token = jwt.sign({ user: 'User' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.status(200).send(token);
  });

  return router;
}
