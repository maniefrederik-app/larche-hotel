const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

router.get('/', async (req, res) => {
  try {
    const services = await firestore.getAll('services');
    services.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.get('services', req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Service request not found' });
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
    data.status = data.status || 'pending';
    const result = await firestore.add('services', data);
    res.json({ id: result.id, message: 'Service request created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date().toISOString();
    await firestore.update('services', req.params.id, data);
    res.json({ message: 'Service request updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await firestore.delete('services', req.params.id);
    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
