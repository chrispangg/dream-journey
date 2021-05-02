import express from 'express';
import * as activitiesDao from '../../db/dao/activities-dao';

// const HTTP_OK = 200; // Not really needed; this is the default if you don't set something else.
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

// RESTful routes here

router.post('/', async (req, res) => {
  const response = await activitiesDao.createActivity(req.body, req.user.sub);
  res.json(response);
});

router.get('/', async (req, res) => {
  res.json(await activitiesDao.retrieveAllActivities(req.user.sub));
});

router.get('/:id', async (req, res) => {
  const { id: tripId } = req.params;
  const activities = await activitiesDao.retrieveActivities(tripId);
  if (activities) {
    if (activities.userSub !== req.user.sub) {
      res.json('Error Id is not valid');
    }
    else {
      res.json(activities);
    }
  }
  else {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const activitiesToUpdate = await activitiesDao.retrieveActivities(id);
  if (activitiesToUpdate) {
    if (activitiesToUpdate.userSub !== req.user.sub) {
      res.sendStatus(400);
    }
    else {
      const response = res.json(await activitiesDao.updateActivity(id, req.body));
      res.sendStatus(response ? HTTP_NO_CONTENT : HTTP_NOT_FOUND);
    }
  }
  else {
    res.sendStatus(HTTP_NOT_FOUND)
  }}
);

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const activitiesDelete = await activitiesDao.retrieveActivities(id);
  if (activitiesDelete) {
    if (activitiesDelete.userSub !== req.user.sub) {
      res.sendStatus(400);
    }
    else {
      const response = await activitiesDao.deleteActivity(id);
      res.json(response);
    }
  } else {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

export default router;
