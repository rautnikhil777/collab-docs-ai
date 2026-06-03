const allowedSeedEmails = new Set(['owner@example.com', 'reviewer@example.com']);

function getRequestUserEmail(req) {
  const email = req.header('x-user-email');
  if (!email) return null;
  const normalized = String(email).trim().toLowerCase();
  if (!normalized) return null;

  // In MVP, accept only seeded users.
  if (!allowedSeedEmails.has(normalized)) return null;
  return normalized;
}

module.exports = { getRequestUserEmail };

