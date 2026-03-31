const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await firestore.getAll('rooms');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('rooms', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Room not found' });
    } else {
      res.json(doc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date().toISOString();
    data.status = data.status || 'available';
    const result = await firestore.add('rooms', data);
    res.json({ id: result.id, message: 'Room created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('rooms', req.params.id, data);
    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('rooms', req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rooms by status
router.get('/status/:status', async (req, res) => {
  try {
    const rooms = await firestore.getAll('rooms');
    const filtered = rooms.filter(r => r.status === req.params.status);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
