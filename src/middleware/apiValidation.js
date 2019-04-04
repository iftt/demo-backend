// @flow
require('dotenv').config();
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  if (req.originalUrl === '/login' || req.originalUrl === '/weather/getNextRoot') // you don't need/have a token here
    return next();
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    	if (err)
    		return res.json({error: true, message: 'Failed to authenticate token.' });
      // remove any possible JWT extremeties
      if (decoded.iat)
        delete decoded.iat;
      if (decoded.exp)
        delete decoded.exp;
      // add the user and pass to the
      req.decodedToken = decoded;
      // we keep track of the user and pass, but update the expiration date
      req.refreshToken = jwt.sign(decoded, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
      next();
    });
  } else {
    // if there is no token return an error
    return res.status(403).send({
    	error: true,
    	message: 'No token provided.'
    });
  }
}
