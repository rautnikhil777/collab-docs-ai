import { useState } from 'react';

export default function ShareModal({ open, onClose, onShare, suggestedEmail }) {
  const [email, setEmail] = useState(suggestedEmail || 'reviewer@example.com');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share document</h2>
          <button
            className="text-slate-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <label className="mt-3 block text-sm text-slate-300">Share with</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />

        <div className="mt-5 flex gap-3">
          <button
            className="flex-1 rounded-lg border border-slate-700 py-2 text-slate-200 hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium hover:bg-indigo-500"
            onClick={() => onShare(email)}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

