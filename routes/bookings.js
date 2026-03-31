const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await firestore.getAll('bookings');
    bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('bookings', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      res.json(doc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date().toISOString();
    data.status = data.status || 'pending';
    const result = await firestore.add('bookings', data);
    res.json({ id: result.id, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('bookings', req.params.id, data);
    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('bookings', req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by status
router.get('/status/:status', async (req, res) => {
  try {
    const bookings = await firestore.getAll('bookings');
    const filtered = bookings.filter(b => b.status === req.params.status);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
