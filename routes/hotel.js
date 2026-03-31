const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

// Get hotel profile
router.get('/', async (req, res) => {
  try {
    const doc = await firestore.get('hotel', 'profile');
    if (!doc) {
      res.json({ name: "L'Arche Hotel & Venue Estate", description: "Welcome to L'Arche" });
    } else {
      res.json(doc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update hotel profile
router.put('/', async (req, res) => {
  try {
    const data = req.body;
    await firestore.set('hotel', 'profile', data);
    res.json({ message: 'Hotel profile updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hotel amenities
router.get('/amenities', async (req, res) => {
  try {
    const amenities = await firestore.getAll('amenities');
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add amenity
router.post('/amenities', async (req, res) => {
  try {
    const data = req.body;
    const result = await firestore.add('amenities', data);
    res.json({ id: result.id, message: 'Amenity added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
