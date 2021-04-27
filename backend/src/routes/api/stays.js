import express from 'express';
import * as staysDao from '../../db/dao/stays-dao';

// const HTTP_OK = 200; // Not really needed; this is the default if you don't set something else.
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

// RESTful routes here

router.post('/', async (req, res) => {
  const response = await staysDao.createStay(req.body);
  res.json(response);
});

router.get('/', async (req, res) => {
  res.json(await staysDao.retrieveAllStays());
});

router.get('/:id', async (req, res) => {
  const { id: tripId } = req.params;

  try {
    const stays = await staysDao.retrieveStays(tripId);

    if (stays) {
      res.json(stays);
    } else {
      res.sendStatus(HTTP_NOT_FOUND);
    }
  } catch (err) {
    res.json('Error Id is not valid');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const response = res.json(await staysDao.updateStay(id, req.body));
  if (response) {
    res.sendStatus(HTTP_NO_CONTENT);
  } else {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const response = await staysDao.deleteStay(id);
  res.json(response);
});

export default router;
