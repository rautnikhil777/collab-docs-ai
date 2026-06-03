const { User } = require('../models/User');
const { Document } = require('../models/Document');

const seedUsers = ['owner@example.com', 'reviewer@example.com'];

async function seedDemoData({ force = false } = {}) {
  // Create users
  for (const email of seedUsers) {
    await User.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  }

  // Seed sample docs only if empty (unless force)
  const existing = await Document.countDocuments({});
  if (!force && existing > 0) return;

  const ownerEmail = 'owner@example.com';
  const reviewerEmail = 'reviewer@example.com';

  const sample1 = {
    title: 'Engineering Assessment: System Design Notes',
    contentHtml:
      '<h1>System Design Notes</h1><p>This is seeded demo content.</p><ul><li>Focus on interfaces</li><li>Measure bottlenecks</li></ul>',
    ownerEmail,
    sharedWithEmails: [reviewerEmail]
  };

  const sample2 = {
    title: 'Research Summary (Private)',
    contentHtml:
      '<h2>Research Summary</h2><p>MVP scope excludes realtime collaboration.</p><p>Use the toolbar to format and save.</p>',
    ownerEmail,
    sharedWithEmails: []
  };

  if (force) {
    await Document.deleteMany({});
  }

  // Ensure these specific docs exist
  const existingTitles = new Set(
    (await Document.find({ ownerEmail }).select('title').lean()).map((d) => d.title)
  );

  if (!existingTitles.has(sample1.title)) await Document.create(sample1);
  if (!existingTitles.has(sample2.title)) await Document.create(sample2);
}


module.exports = { seedDemoData };

