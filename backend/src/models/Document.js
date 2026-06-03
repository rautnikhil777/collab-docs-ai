const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },

    // MVP: store HTML for reliable reopen/edit.
    contentHtml: { type: String, required: true },

    ownerEmail: { type: String, required: true, index: true },
    sharedWithEmails: { type: [String], default: [] },

    uploadedFileMeta: {
      originalName: { type: String },
      mimeType: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date }
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

DocumentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = { Document };

