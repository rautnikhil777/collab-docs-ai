import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShareModal from '../components/ShareModal.jsx';
import UploadSection from '../components/UploadSection.jsx';
import { clearUserEmail, useUserEmail } from '../state/userEmail.js';

export default function DocumentsPage() {
  const userEmail = useUserEmail();
  const navigate = useNavigate();
  const [tab, setTab] = useState('my');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);
  const [shareBusy, setShareBusy] = useState(false);

  const suggestedShareEmail = useMemo(() => {
    const other = userEmail === 'owner@example.com' ? 'reviewer@example.com' : 'owner@example.com';
    return other;
  }, [userEmail]);

  async function fetchDocs(nextTab) {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents?tab=${encodeURIComponent(nextTab)}`,
        { headers: { 'x-user-email': userEmail } }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Failed to load documents');
      setDocs(json.documents || []);
    } catch (e) {
      toast.error(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocs(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function createDoc() {
    const title = window.prompt('Document title?', 'Untitled Document');
    if (!title) return;

    const payload = {
      title,
      contentHtml: '<p><br/></p>'
    };

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(json.error || 'Failed to create');
      return;
    }

    toast.success('Document created');
    navigate(`/documents/${json.document._id}`);
  }

  async function shareWith(email) {
    if (!shareDocId) return;
    setShareBusy(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/${shareDocId}/share`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({ shareWithEmail: email })
        }
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Share failed');
      toast.success('Shared');
      setShareOpen(false);
      setShareDocId(null);
      await fetchDocs(tab);
    } catch (e) {
      toast.error(e.message || 'Share failed');
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ToastContainer theme="dark" position="top-right" />

      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
        <div>
          <div className="text-lg font-semibold">My Docs</div>
          <div className="text-xs text-slate-400">Signed in as {userEmail}</div>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800"
            onClick={() => {
              clearUserEmail();
              window.location.href = '/documents';
            }}
          >
            Switch user
          </button>
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500"
            onClick={createDoc}
          >
            New Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 px-6 py-6">
        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-lg py-2 text-sm ${
                  tab === 'my' ? 'bg-indigo-600' : 'bg-slate-950 hover:bg-slate-800'
                }`}
                onClick={() => setTab('my')}
              >
                My Documents
              </button>
              <button
                className={`flex-1 rounded-lg py-2 text-sm ${
                  tab === 'shared' ? 'bg-indigo-600' : 'bg-slate-950 hover:bg-slate-800'
                }`}
                onClick={() => setTab('shared')}
              >
                Shared With Me
              </button>
            </div>
          </div>

          <UploadSection
            userEmail={userEmail}
            onUploaded={(doc) => {
              toast.success('Upload converted');
              fetchDocs(tab);
              navigate(`/documents/${doc._id}`);
            }}
          />
        </div>

        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="rounded-xl border border-slate-800 bg-slate-900">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold">Documents</h2>
              {loading ? <div className="text-sm text-slate-400">Loading...</div> : null}
            </div>

            {(!loading && docs.length === 0) || (loading && !docs.length) ? (
              <div className="p-6 text-center text-slate-400">
                {loading ? 'Loading...' : 'No documents yet.'}
              </div>
            ) : null}

            <div className="divide-y divide-slate-800">
              {docs.map((d) => (
                <div
                  key={d._id}
                  className="p-4 hover:bg-slate-950/40 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <button
                      className="text-left block truncate font-medium hover:text-indigo-300"
                      onClick={() => navigate(`/documents/${d._id}`)}
                    >
                      {d.title}
                    </button>
                    <div className="mt-1 text-xs text-slate-400">
                      Owner: {d.ownerEmail}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {d.ownerEmail === userEmail ? (
                      <button
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                        onClick={() => {
                          setShareDocId(d._id);
                          setShareOpen(true);
                        }}
                      >
                        Share
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => {
          if (shareBusy) return;
          setShareOpen(false);
        }}
        suggestedEmail={suggestedShareEmail}
        onShare={(email) => {
          if (shareBusy) return;
          shareWith(email);
        }}
      />
    </div>
  );
}

