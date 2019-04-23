// @flow
import { Router } from 'express'
import jwt from 'jsonwebtoken'

const debug = require('debug')('demo-backend:login')

const router = Router()

export default function login () {
  router.post('/login', (req, res) => {
    debug('[post] /login')
    const token = jwt.sign({ user: 'User' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
    res.status(200).send(token)
  })

  return router
}
