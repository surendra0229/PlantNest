import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { knowledgeService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Brain,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  X,
  BookOpen,
  ChevronDown
} from 'lucide-react';

const CATEGORIES = [
  { value: 'shipping', label: '🚚 Shipping & Delivery' },
  { value: 'returns', label: '🛡️ Returns & Refunds' },
  { value: 'contact', label: '📞 Contact & Support' },
  { value: 'payment', label: '💳 Payment Methods' },
  { value: 'services', label: '🌿 Services' },
  { value: 'faq', label: '❓ FAQ' },
  { value: 'policy', label: '📋 Policy' },
  { value: 'care', label: '🌱 Plant Care' },
  { value: 'products', label: '🛒 Products' },
  { value: 'other', label: '📝 Other' }
];

const EMPTY_FORM = { title: '', content: '', category: 'other', isActive: true };

const AdminKnowledge = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await knowledgeService.getAll();
      if (res.success) setEntries(res.entries);
    } catch (err) {
      toast.error('Failed to load knowledge base entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setForm({ title: entry.title, content: entry.content, category: entry.category, isActive: entry.isActive });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await knowledgeService.update(editingId, form);
        toast.success('Knowledge entry updated.');
      } else {
        await knowledgeService.create(form);
        toast.success('Knowledge entry created.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchEntries();
    } catch (err) {
      toast.error(err.message || 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await knowledgeService.delete(id);
      toast.success('Knowledge entry deleted.');
      setDeleteConfirm(null);
      fetchEntries();
    } catch (err) {
      toast.error(err.message || 'Failed to delete entry.');
    }
  };

  const handleToggleActive = async (entry) => {
    try {
      await knowledgeService.update(entry._id, { ...entry, isActive: !entry.isActive });
      setEntries(prev => prev.map(e => e._id === entry._id ? { ...e, isActive: !e.isActive } : e));
      toast.success(`Entry ${!entry.isActive ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const getCategoryLabel = (val) => CATEGORIES.find(c => c.value === val)?.label || val;

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Chatbot Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage the knowledge base used by the PlantNest AI chatbot. Add, edit, or deactivate entries to control what the chatbot knows.
          </p>
        </div>
        <button
          id="add-knowledge-btn"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Entry
        </button>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex gap-3 items-start">
        <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-800 dark:text-emerald-300">
          <p className="font-bold mb-1">How the chatbot uses this knowledge base:</p>
          <ul className="space-y-0.5 text-emerald-700 dark:text-emerald-400">
            <li>• <strong>Active entries</strong> are fetched from MongoDB on every chatbot query.</li>
            <li>• Entries are matched by keyword relevance to the user's question.</li>
            <li>• Plant catalog data is always fetched live — no need to add plant info here.</li>
            <li>• <strong>Deactivating</strong> an entry removes it from the chatbot without deleting it.</li>
          </ul>
        </div>
      </div>

      {/* Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-black text-slate-900 dark:text-white text-lg">
                {editingId ? 'Edit Knowledge Entry' : 'Add New Knowledge Entry'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Shipping & Delivery Policy"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 pr-8 text-sm focus:outline-none focus:border-emerald-500 font-medium appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Content *</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Enter the knowledge content that the chatbot should use to answer questions about this topic..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 font-medium resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Tip: Use bullet points (•) for lists. The chatbot will use this exact text to answer related questions.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`w-10 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {form.isActive ? 'Active (chatbot will use this entry)' : 'Inactive (chatbot will ignore this entry)'}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Create Entry'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="font-black text-slate-900 dark:text-white text-base">Delete Entry?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading knowledge base...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <Brain className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No knowledge entries yet.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Add entries to teach the chatbot about your store policies, services, and more.</p>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer mt-2"
          >
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{entries.length} knowledge entr{entries.length === 1 ? 'y' : 'ies'} — {entries.filter(e => e.isActive).length} active</p>
          {entries.map((entry) => (
            <div
              key={entry._id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all ${
                entry.isActive
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-dashed border-slate-300 dark:border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {getCategoryLabel(entry.category)}
                    </span>
                    {entry.isActive ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">{entry.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 whitespace-pre-line">{entry.content}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleActive(entry)}
                    title={entry.isActive ? 'Deactivate' : 'Activate'}
                    className={`p-2 rounded-xl transition cursor-pointer text-xs font-bold ${
                      entry.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {entry.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(entry)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminKnowledge;
