import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import {
  Clock,
  Calendar,
  Eye,
  Share2,
  Check,
  Edit3,
  Trash2,
  ChevronLeft,
  Tag,
  BookOpen
} from 'lucide-react';

export default function PostDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/posts/' + slug);
      setPost(res.data.post);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Article not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete('/posts/' + post.id);
      navigate('/', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="h-12 bg-slate-200 rounded-lg w-full"></div>
        <div className="h-6 bg-slate-200 rounded-lg w-1/2"></div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Article Unavailable</h2>
        <p className="text-slate-500 text-sm">{error || 'Post not found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 shadow transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId || user?.role === 'ADMIN';
  const tagList = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const contentBlocks = (post.content || '').split('\n\n');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>

      <div className="space-y-4">
        {post.category && (
          <Link
            to={'/?category=' + post.category.slug}
            className="inline-block px-3.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full hover:bg-indigo-100 transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-b border-slate-200/80 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(post.author?.username || 'user'))}
              alt={post.author?.name}
              className="w-11 h-11 rounded-full object-cover bg-slate-200 ring-2 ring-slate-100"
            />
            <div>
              <p className="font-bold text-slate-900 leading-tight">{post.author?.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime} min read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views} views
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LikeButton
              postId={post.id}
              initialLiked={post.hasLiked}
              initialCount={post._count?.likes || 0}
            />

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Copy share link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            {isAuthor && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <Link
                  to={'/edit/' + post.id}
                  className="p-2 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                  title="Edit post"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="p-2 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="rounded-3xl overflow-hidden shadow-md max-h-[480px] bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="prose prose-slate lg:prose-lg max-w-none bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm leading-relaxed space-y-6">
        {contentBlocks.map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 mt-8 mb-4">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-indigo-600 pl-4 italic text-slate-700 bg-indigo-50/50 py-3 rounded-r-xl my-4">
                {trimmed.replace('> ', '')}
              </blockquote>
            );
          }
          if (trimmed.startsWith('```')) {
            const codeLines = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
            return (
              <div key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-2xl overflow-x-auto text-sm font-mono my-4 shadow-inner">
                <pre><code>{codeLines}</code></pre>
              </div>
            );
          }
          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n').map((li) => li.replace(/^- /, ''));
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 text-slate-700 my-3">
                {items.map((item, liIdx) => (
                  <li key={liIdx}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {trimmed}
            </p>
          );
        })}
      </article>

      {tagList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Tags:
          </span>
          {tagList.map((tag, idx) => (
            <Link
              key={idx}
              to={'/?search=' + encodeURIComponent(tag)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {post.author && (
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={post.author.avatar || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(post.author.username || 'user'))}
            alt={post.author.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/30 flex-shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Written by</p>
            <h4 className="text-xl font-extrabold">{post.author.name}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {post.author.bio || 'Passionate author and contributor on BlogSphere.'}
            </p>
          </div>
        </div>
      )}

      <CommentSection
        postId={post.id}
        postAuthorId={post.authorId}
        onCommentCountChange={(newCount) => {
          setPost((prev) => ({
            ...prev,
            _count: { ...prev._count, comments: newCount }
          }));
        }}
      />
    </div>
  );
}
