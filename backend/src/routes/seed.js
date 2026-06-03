const express = require('express');
const { seedDemoData } = require('../startup/seedDemoData');

const seedRouter = express.Router();

seedRouter.post('/demo', async (req, res, next) => {
  try {
    await seedDemoData({ force: true });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = { seedRouter };

