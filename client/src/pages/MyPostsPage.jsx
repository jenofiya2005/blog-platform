import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts/user/me');
      setPosts(res.data.posts || []);
      setStats(res.data.stats || { totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be reversed.')) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-indigo-600" />
            <span>Author Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your published articles, monitor readership engagement, and write new stories.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-full shadow-md shadow-indigo-500/20 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Articles</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalPosts}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalViews}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Likes</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalLikes}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comments</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalComments}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg">Your Published Articles</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {posts.length} articles
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">You haven't written any posts yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Share your insights, coding tips, or design stories with the world today.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-full shadow hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Post</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                        {post.category.name}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <Link
                    to={`/post/${post.slug}`}
                    className="font-bold text-slate-900 text-lg hover:text-indigo-600 transition-colors block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> {post._count?.likes || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> {post._count?.comments || 0} comments
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    to={`/post/${post.slug}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="View post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/edit/${post.id}`}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                    title="Edit post"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
