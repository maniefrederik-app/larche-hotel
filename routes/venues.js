const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

// Get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await firestore.getAll('venues');
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('venues', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Venue not found' });
    } else {
      res.json(doc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create venue
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date().toISOString();
    const result = await firestore.add('venues', data);
    res.json({ id: result.id, message: 'Venue created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update venue
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('venues', req.params.id, data);
    res.json({ message: 'Venue updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete venue
router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('venues', req.params.id);
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
