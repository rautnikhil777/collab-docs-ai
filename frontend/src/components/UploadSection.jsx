import { useRef, useState } from 'react';

export default function UploadSection({ onUploaded, userEmail }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/uploads`, {
        method: 'POST',
        headers: {
          'x-user-email': userEmail
        },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const json = await res.json();
      onUploaded?.(json.document);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Upload .txt / .md</h3>
      <p className="mt-1 text-xs text-slate-400">Converted into an editable rich-text document.</p>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".txt,.md,text/plain,text/markdown"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <button
        className="mt-3 w-full rounded-lg border border-slate-700 py-2 text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Choose file'}
      </button>
    </div>
  );
}

