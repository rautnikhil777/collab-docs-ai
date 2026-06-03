import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DocumentToolbar from '../components/DocumentToolbar.jsx';
import ShareModal from '../components/ShareModal.jsx';
import { useUserEmail } from '../state/userEmail.js';

export default function EditorPage() {
  const { id } = useParams();
  const userEmail = useUserEmail();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('<p><br/></p>');

  const [renameBusy, setRenameBusy] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);

  const otherEmail = useMemo(() => {
    if (userEmail === 'owner@example.com') return 'reviewer@example.com';
    return 'owner@example.com';
  }, [userEmail]);

  async function loadDoc() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents/${id}`, {
        headers: { 'x-user-email': userEmail }
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Failed to load document');
      setDoc(json.document);
      setTitle(json.document.title);
      setContentHtml(json.document.contentHtml);
    } catch (e) {
      toast.error(e.message || 'Failed');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwner = doc?.ownerEmail === userEmail;
  const canEdit = isOwner || (doc?.sharedWithEmails || []).includes(userEmail);

  async function saveContent() {
    if (!canEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents/${id}/content`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({ contentHtml })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Save failed');

      setDoc(json.document);
      toast.success('Saved');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function rename() {
    if (!isOwner) return;
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast.error('Title cannot be empty');
      return;
    }

    setRenameBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents/${id}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({ title: nextTitle })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Rename failed');

      setDoc(json.document);
      toast.success('Renamed');
    } catch (e) {
      toast.error(e.message || 'Rename failed');
    } finally {
      setRenameBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Document not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
        <div>
          <button
            className="text-sm text-slate-300 hover:text-white"
            onClick={() => navigate('/documents')}
          >
            ← Back
          </button>
          <div className="text-xs text-slate-400 mt-1">Owner: {doc.ownerEmail}</div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner ? (
            <button
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
              onClick={() => setShareOpen(true)}
            >
              Share
            </button>
          ) : null}
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
            onClick={saveContent}
            disabled={!canEdit || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <input
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 p-3 text-slate-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isOwner || renameBusy}
            />
            {isOwner ? (
              <button
                className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800 disabled:opacity-50"
                onClick={rename}
                disabled={renameBusy}
              >
                {renameBusy ? 'Renaming...' : 'Rename'}
              </button>
            ) : null}
          </div>

          <div id="editor" className="rounded-xl border border-slate-800 bg-slate-900">
            <div className="p-3 border-b border-slate-800 text-xs text-slate-400">
              {canEdit ? 'Edit mode' : 'Read-only mode'}
            </div>
            <DocumentToolbar
              value={contentHtml}
              onChange={setContentHtml}
              readOnly={!canEdit}
            />
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        suggestedEmail={otherEmail}
        onShare={(email) => {
          // share action uses backend, but reuse share modal from DocumentsPage isn't wired here
          // minimal MVP: sharing will be done via the Documents page list.
          // to keep MVP small, close and direct back.
          setShareOpen(false);
          navigate('/documents');
          toast.info('Use Share from the documents list for MVP');
        }}
      />
    </div>
  );
}

