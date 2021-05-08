import express from 'express';
require("dotenv").config();

const router = express.Router();

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`
  }),
  audience: `${process.env.AUDIENCE}`,
  issuer: `https://${process.env.DOMAIN}/`,
  algorithms: ['RS256']
});

// import userRoute from "./user";
// router.use("/users", userRoute);
// import userRoute from './user';
// router.use('/users', userRoute);

router.use('/',jwtCheck)

import tripRoute from './trips';
router.use('/trips', tripRoute);

import activityRoute from './activities';
router.use('/activities', activityRoute);

import stayRoute from './stays';
router.use('/stays', stayRoute);

export default router;
