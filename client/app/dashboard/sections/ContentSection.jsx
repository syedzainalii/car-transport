'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/app/Components/admin/DataTable';
import { contentAPI } from '@/app/lib/api';

export default function ContentSection() {
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBlock, setEditingBlock] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', media_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContentBlocks();
  }, []);

  const loadContentBlocks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contentAPI.getAll();
      setContentBlocks(data.content_blocks || []);
    } catch (err) {
      setError(err.message || 'Failed to load content blocks');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block) => {
    setEditingBlock(block);
    setFormData({
      title: block.title || '',
      content: block.content || '',
      media_url: block.media_url || '',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingBlock) return;

    try {
      setSaving(true);
      await contentAPI.update(editingBlock.id, formData);
      setShowEditModal(false);
      setEditingBlock(null);
      await loadContentBlocks();
      alert('Content updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Key',
      accessor: 'key',
      render: (block) => (
        <span className="font-mono text-sm font-semibold text-gray-800 dark:text-white">
          {block.key}
        </span>
      ),
    },
    {
      header: 'Title',
      accessor: 'title',
      render: (block) => (
        <span className="text-gray-800 dark:text-white">{block.title || '-'}</span>
      ),
    },
    {
      header: 'Content Preview',
      accessor: 'content',
      render: (block) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {block.content ? (block.content.length > 100 ? block.content.substring(0, 100) + '...' : block.content) : '-'}
        </span>
      ),
    },
    {
      header: 'Media URL',
      accessor: 'media_url',
      render: (block) => (
        block.media_url ? (
          <a
            href={block.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      header: 'Last Updated',
      accessor: 'updated_at',
      render: (block) => (
        <div className="text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            {block.updated_at ? new Date(block.updated_at).toLocaleDateString() : '-'}
          </div>
          {block.updated_by_name && (
            <div className="text-gray-500 dark:text-gray-500 text-xs">
              by {block.updated_by_name}
            </div>
          )}
        </div>
      ),
    },
  ];

  const actions = (block) => (
    <button
      onClick={() => handleEdit(block)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      Edit
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Content Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit website content blocks
          </p>
        </div>
        <button
          onClick={loadContentBlocks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={contentBlocks}
        loading={loading}
        emptyMessage="No content blocks found"
        actions={actions}
      />

      {/* Edit Modal */}
      {showEditModal && editingBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Content: {editingBlock.key}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBlock(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content (HTML supported)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Media URL
                  </label>
                  <input
                    type="url"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBlock(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

