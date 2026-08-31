import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId, postAuthorId, onCommentCountChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post(`/posts/${postId}/comments`, { content: newComment });
      const created = res.data.comment;
      const updated = [created, ...comments];
      setComments(updated);
      setNewComment('');
      if (onCommentCountChange) onCommentCountChange(updated.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      const updated = comments.filter((c) => c.id !== commentId);
      setComments(updated);
      if (onCommentCountChange) onCommentCountChange(updated.length);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200" id="comments">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>Discussion ({comments.length})</span>
        </h3>
      </div>

      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-8">
          {error && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover bg-slate-200 ring-2 ring-slate-100 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts on this article? Add your perspective..."
                rows={3}
                className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm transition-all resize-y"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center">
          <p className="text-slate-700 text-sm font-medium mb-3">
            Join the discussion to share your thoughts, ask questions, or provide feedback.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow hover:bg-indigo-700 transition-all"
            >
              Sign In to Comment
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-full hover:bg-slate-50 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-4 bg-slate-100 rounded-2xl">
              <div className="w-9 h-9 bg-slate-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-300 rounded w-1/4"></div>
                <div className="h-3 bg-slate-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isCommentAuthor = user?.id === comment.authorId;
            const isPostAuthor = user?.id === postAuthorId;
            const canDelete = isCommentAuthor || isPostAuthor || user?.role === 'ADMIN';

            const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={comment.id}
                className="group p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username}`}
                      alt={comment.author?.name}
                      className="w-8 h-8 rounded-full object-cover bg-slate-200 ring-1 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {comment.author?.name}
                        </span>
                        {comment.authorId === postAuthorId && (
                          <span className="px-2 py-0.2 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                            Author
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{dateStr}</span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed pl-10 whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
