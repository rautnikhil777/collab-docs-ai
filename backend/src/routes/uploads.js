const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const { convertFileToHtml } = require('../lib/convertFileToHtml');
const { Document } = require('../models/Document');
const { getRequestUserEmail } = require('../lib/userFromHeader');

const uploadsRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.txt', '.md'];
    const lower = String(file.originalname || '').toLowerCase();
    const ok = allowed.some((ext) => lower.endsWith(ext));
    if (!ok) return cb(new Error('Only .txt and .md files are allowed'));
    cb(null, true);
  }
});

function requireUser(req, res, next) {
  const email = getRequestUserEmail(req);
  if (!email) {
    return res.status(401).json({ error: 'Missing or invalid x-user-email header' });
  }
  req.requestUserEmail = email;
  next();
}

uploadsRouter.use(requireUser);

uploadsRouter.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;

    const bodySchema = z.object({
      title: z.string().min(1).max(140).optional()
    });
    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) return res.status(400).json({ error: 'Invalid fields' });

    if (!req.file) return res.status(400).json({ error: 'file is required' });

    const originalName = req.file.originalname;
    const html = convertFileToHtml({
      originalName,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer
    });

    const title = parsedBody.data.title || originalName.replace(/\.(txt|md)$/i, '');

    const doc = await Document.create({
      title,
      contentHtml: html,
      ownerEmail: userEmail,
      sharedWithEmails: [],
      uploadedFileMeta: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      }
    });

    res.status(201).json({ document: doc });
  } catch (e) {
    // Multer errors and conversion errors
    next(e);
  }
});

module.exports = { uploadsRouter };

