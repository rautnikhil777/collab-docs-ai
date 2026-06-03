const express = require('express');
const { z } = require('zod');
const { Document } = require('../models/Document');
const { getRequestUserEmail } = require('../lib/userFromHeader');

const documentsRouter = express.Router();

const createDocSchema = z.object({
  title: z.string().min(1).max(140),
  contentHtml: z.string().min(1)
});

const renameSchema = z.object({
  title: z.string().min(1).max(140)
});

const updateContentSchema = z.object({
  contentHtml: z.string().min(1)
});

const shareSchema = z.object({
  shareWithEmail: z.string().email()
});

function requireUser(req, res, next) {
  const email = getRequestUserEmail(req);
  if (!email) {
    return res.status(401).json({ error: 'Missing or invalid x-user-email header' });
  }
  req.requestUserEmail = email;
  next();
}

documentsRouter.use(requireUser);

// Create new document
documentsRouter.post('/', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;
    const parsed = createDocSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request body' });

    const doc = await Document.create({
      title: parsed.data.title,
      contentHtml: parsed.data.contentHtml,
      ownerEmail: userEmail,
      sharedWithEmails: []
    });

    res.status(201).json({ document: doc });
  } catch (e) {
    next(e);
  }
});

// Rename document
documentsRouter.patch('/:id/rename', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;
    const parsed = renameSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid title' });

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    if (doc.ownerEmail !== userEmail) {
      return res.status(403).json({ error: 'Only owner can rename' });
    }

    doc.title = parsed.data.title;
    await doc.save();

    res.json({ document: doc });
  } catch (e) {
    next(e);
  }
});

// Update content
documentsRouter.patch('/:id/content', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;
    const parsed = updateContentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid contentHtml' });

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // MVP: allow owner or anyone in shared list to edit.
    const canEdit = doc.ownerEmail === userEmail || doc.sharedWithEmails.includes(userEmail);
    if (!canEdit) return res.status(403).json({ error: 'No access to edit this document' });

    doc.contentHtml = parsed.data.contentHtml;
    await doc.save();

    res.json({ document: doc });
  } catch (e) {
    next(e);
  }
});

// Get document
documentsRouter.get('/:id', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;

    const doc = await Document.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const canView = doc.ownerEmail === userEmail || (doc.sharedWithEmails || []).includes(userEmail);
    if (!canView) return res.status(403).json({ error: 'No access to view this document' });

    res.json({ document: doc });
  } catch (e) {
    next(e);
  }
});

// My documents
documentsRouter.get('/', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;
    const tab = String(req.query.tab || 'my');

    let query;
    if (tab === 'shared') {
      query = { sharedWithEmails: userEmail };
    } else {
      query = { ownerEmail: userEmail };
    }

    const docs = await Document.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ documents: docs });
  } catch (e) {
    next(e);
  }
});

// Share with email
documentsRouter.post('/:id/share', async (req, res, next) => {
  try {
    const userEmail = req.requestUserEmail;
    const parsed = shareSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid shareWithEmail' });

    const shareWithEmail = parsed.data.shareWithEmail.toLowerCase();

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (doc.ownerEmail !== userEmail) return res.status(403).json({ error: 'Only owner can share' });

    if (!doc.sharedWithEmails.includes(shareWithEmail)) {
      doc.sharedWithEmails.push(shareWithEmail);
    }

    await doc.save();
    res.json({ document: doc });
  } catch (e) {
    next(e);
  }
});

module.exports = { documentsRouter };

