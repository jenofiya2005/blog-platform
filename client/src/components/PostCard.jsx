import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, MessageSquare, Tag } from 'lucide-react';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tagList = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      {/* Cover Image */}
      <Link to={`/post/${post.slug}`} className="relative h-48 overflow-hidden bg-slate-100 block">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {post.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-700 text-xs font-bold rounded-full shadow-sm">
            {post.category.name}
          </span>
        )}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/75 backdrop-blur-sm text-white text-[11px] font-medium rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readTime} min read
        </span>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tagList.slice(0, 2).map((t, idx) => (
                <span key={idx} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/post/${post.slug}`}>
            <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer info: Author & Stats */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username}`}
              alt={post.author?.name}
              className="w-7 h-7 rounded-full object-cover bg-slate-200 ring-1 ring-slate-200"
            />
            <div>
              <p className="font-semibold text-slate-800 leading-tight">{post.author?.name}</p>
              <p className="text-[10px] text-slate-400">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-rose-500 transition-colors" title="Likes">
              <Heart className="w-3.5 h-3.5 text-rose-500/80" />
              <span>{post._count?.likes || 0}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors" title="Comments">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{post._count?.comments || 0}</span>
            </span>
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.views || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
