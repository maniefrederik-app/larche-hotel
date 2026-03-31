const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

router.get('/', async (req, res) => {
  try {
    const specials = await firestore.getAll('specials');
    specials.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(specials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const specials = await firestore.getAll('specials');
    const now = new Date().toISOString();
    const active = specials.filter(s => s.active && s.validUntil >= now);
    res.json(active);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('specials', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Special not found' });
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
    data.active = data.active !== false;
    const result = await firestore.add('specials', data);
    res.json({ id: result.id, message: 'Special created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('specials', req.params.id, data);
    res.json({ message: 'Special updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('specials', req.params.id);
    res.json({ message: 'Special deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
