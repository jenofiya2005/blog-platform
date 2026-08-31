import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  PenSquare,
  Save,
  Image,
  Tag,
  FolderPlus,
  Sparkles,
  ChevronLeft,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Technology & Code', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Minimalist Workspace', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Creative Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Architecture', url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Team & Collaboration', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
];

export default function CreateEditPostPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: COVER_PRESETS[0].url,
    categoryId: '',
    tags: '',
    published: true
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [previewTab, setPreviewTab] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPostToEdit();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
      if (!isEditing && res.data.categories?.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: res.data.categories[0].id }));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchPostToEdit = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('/posts/' + id);
      const post = res.data.post;
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || COVER_PRESETS[0].url,
        categoryId: post.categoryId || '',
        tags: post.tags || '',
        published: post.published
      });
    } catch (err) {
      setError('Failed to fetch post for editing.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please provide both a title and article content.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEditing) {
        const res = await api.put('/posts/' + id, formData);
        navigate('/post/' + res.data.post.slug);
      } else {
        const res = await api.post('/posts', formData);
        navigate('/post/' + res.data.post.slug);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={isEditing ? '/post/' + id : '/'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <PenSquare className="w-7 h-7 text-indigo-600" />
            <span>{isEditing ? 'Edit Story' : 'Create New Story'}</span>
          </h1>
          <p className="text-slate-500 text-sm">
            {isEditing ? 'Refine your article and keep your readers updated.' : 'Share your knowledge, code walkthroughs, and ideas with the community.'}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPreviewTab(false)}
            className={'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ' +
              (!previewTab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')
            }
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab(true)}
            className={'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ' +
              (previewTab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')
            }
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {previewTab ? (
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {formData.coverImage && (
            <img
              src={formData.coverImage}
              alt="Preview Cover"
              className="w-full h-64 object-cover rounded-2xl"
            />
          )}
          <h1 className="text-3xl font-extrabold text-slate-900">{formData.title || 'Untitled Post'}</h1>
          {formData.excerpt && <p className="text-lg text-slate-600 font-medium">{formData.excerpt}</p>}
          <div className="prose max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
            {formData.content || 'Start typing in the editor tab to see your post preview here.'}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Master Full-Stack Architecture in 2026"
              className="w-full px-4 py-3 text-lg font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, webdev, javascript"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Short Excerpt / Summary
            </label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief summary that will appear on post cards and search feeds..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
            />
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Or choose a preset cover:</span>
              <div className="flex flex-wrap gap-2">
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: preset.url }))}
                    className={'text-xs px-2.5 py-1 rounded-lg border transition-all ' +
                      (formData.coverImage === preset.url
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100')
                    }
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Article Content *
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Supports formatting: ## Headings, ### Subheadings, ``` code blocks, &gt; quotes, - list items.
            </p>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={14}
              placeholder="Write your article content here..."
              className="w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all resize-y"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to={isEditing ? '/post/' + id : '/'}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-full shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
