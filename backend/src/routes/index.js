const express = require('express');
const { documentsRouter } = require('./documents');
const { uploadsRouter } = require('./uploads');
const { seedRouter } = require('./seed');

const routes = express.Router();

routes.use('/documents', documentsRouter);
routes.use('/uploads', uploadsRouter);
routes.use('/seed', seedRouter);

module.exports = { routes };

