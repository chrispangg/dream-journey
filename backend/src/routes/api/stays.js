import express from 'express';
import * as staysDao from '../../db/dao/stays-dao';

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
  const stays = await staysDao.retrieveStays(tripId);
  if (stays) {
    if (stays.userSub !== req.user.sub)
    {
      res.json('Error Id is not valid');
    }
    else
    {
      res.json(stays);
    }
  }
  else
  {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const stayToUpdate = await staysDao.retrieveStays(id);
  if (stayToUpdate) {
    if (stayToUpdate.userSub !== req.user.sub)
    {
      res.sendStatus(400);
    }
    else
    {
      const response = res.json(await staysDao.updateStay(id, req.body));
      res.sendStatus(response ? HTTP_NO_CONTENT : HTTP_NOT_FOUND);
    }
  } else
  {
    res.sendStatus(HTTP_NOT_FOUND)
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const stayDelete = await staysDao.retrieveStays(id);
  if (stayDelete) {
    if (stayDelete.userSub !== req.user.sub)
    {
      res.sendStatus(400);
    } else {
      const response = await staysDao.deleteStay(id);
      res.json(response);
    }
  } else {
    res.sendStatus(HTTP_NOT_FOUND);
  }
});

export default router;
