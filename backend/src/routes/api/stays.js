import express from 'express';
import * as staysDao from '../../db/dao/stays-dao';
import * as tripsDao from "../../db/dao/trips-dao";

// const HTTP_OK = 200; // Not really needed; this is the default if you don't set something else.
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

// RESTful routes here

router.post('/', async (req, res) => {
  const response = await staysDao.createStay(req.body, req.user.sub);
  res.json(response);
});

router.get('/', async (req, res) => {
  res.json(await staysDao.retrieveAllStays(req.user.sub));
});

router.get('/:id', async (req, res) => {
  const { id: tripId } = req.params;
  const trip = await tripsDao.retrieveTrip(tripId);

  if (!trip) {
    res.sendStatus(HTTP_NOT_FOUND);
    return
  }

  if (trip.userSub !== req.user.sub) {
    res.sendStatus(401);
    return
  }

  const stays = await staysDao.retrieveStays(tripId);
  if (!stays) {
    res.sendStatus(HTTP_NOT_FOUND);
    return
  }

  res.json(stays);

});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const trip = await tripsDao.retrieveTrip(tripId);

  if (!trip) {
    res.sendStatus(HTTP_NOT_FOUND);
    return
  }

  if (trip.userSub !== req.user.sub) {
    res.sendStatus(401);
    return
  }

  const response = res.json(await staysDao.updateStay(id, req.body));
  res.sendStatus(response ? HTTP_NO_CONTENT : HTTP_NOT_FOUND);

});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const trip = await tripsDao.retrieveTrip(id);

  if (!trip) {
    res.sendStatus(HTTP_NOT_FOUND);
    return
  }

  if (trip.userSub !== req.user.sub) {
    res.sendStatus(401);
    return
  }

  const response = await staysDao.deleteStay(id);
  res.json(response);
});

export default router;
