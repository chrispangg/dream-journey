import express from 'express';

const router = express.Router();

// import userRoute from "./user";
// router.use("/users", userRoute);
// import userRoute from './user';
// router.use('/users', userRoute);

import tripRoute from './trips';
router.use('/trips', tripRoute);

import activityRoute from './activities';
router.use('/activities', activityRoute);

import stayRoute from './stays';
router.use('/stays', stayRoute);

export default router;
