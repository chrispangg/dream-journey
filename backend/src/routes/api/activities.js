import express from 'express';
import * as activitiesDao from '../../db/dao/activities-dao';

// const HTTP_OK = 200; // Not really needed; this is the default if you don't set something else.
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

// RESTful routes here

router.post('/', async (req, res) => {
  const response = await activitiesDao.createActivity(req.body);
  res.json(response);
});

router.get('/', async (req, res) => {
  res.json(await activitiesDao.retrieveAllActivities());
});

router.get('/:id', async (req, res) => {
  const { id: tripId } = req.params;
  console.log(tripId);

  try {
    const activities = await activitiesDao.retrieveActivities(tripId);
    if (activities) {
      res.json(activities);
    } else {
      res.sendStatus(HTTP_NOT_FOUND);
    }
  } catch (err) {
    res.json('Error Id is not valid');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const response = res.json(await activitiesDao.updateActivity(id, req.body));
  if (response) {
    res.sendStatus(HTTP_NO_CONTENT);
  } else {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const response = await activitiesDao.deleteActivity(id);
  res.json(response);
});

export default router;
