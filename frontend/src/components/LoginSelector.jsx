import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUserEmail } from '../state/userEmail.js';

const users = [
  { email: 'owner@example.com', label: 'Owner (owner@example.com)' },
  { email: 'reviewer@example.com', label: 'Reviewer (reviewer@example.com)' }
];

export default function LoginSelector() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(users[0].email);
  const selected = useMemo(() => users.find((u) => u.email === email), [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-xl font-semibold">collab-docs-ai</h1>
        <p className="mt-1 text-sm text-slate-300">
          Seeded accounts only (no real authentication). Select a user.
        </p>

        <div className="mt-4">
          <label className="text-sm text-slate-300">User</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.email} value={u.email}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2 font-medium hover:bg-indigo-500"
          onClick={() => {
            setUserEmail(email);
            toast.success(`Signed in as ${selected?.email}`);
            navigate('/documents');
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

