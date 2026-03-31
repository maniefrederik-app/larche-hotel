const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

router.get('/', async (req, res) => {
  try {
    const guests = await firestore.getAll('guests');
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('guests', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Guest not found' });
    } else {
      res.json(doc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date().toISOString();
    const result = await firestore.add('guests', data);
    res.json({ id: result.id, message: 'Guest profile created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('guests', req.params.id, data);
    res.json({ message: 'Guest profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('guests', req.params.id);
    res.json({ message: 'Guest profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
