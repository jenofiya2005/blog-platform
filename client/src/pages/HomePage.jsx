import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Eye,
  TrendingUp,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const searchKeyword = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, searchKeyword, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        limit: 12
      };
      if (activeCategory) params.category = activeCategory;
      if (searchKeyword) params.search = searchKeyword;

      const res = await api.get('/posts', { params });
      setPosts(res.data.posts || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeCategory === slug) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const featuredPost = posts.length > 0 && !searchKeyword && !activeCategory ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      {!searchKeyword && !activeCategory && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full-Stack Developer Community & Blog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Share Ideas, Discover Perspectives & Code Better.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Explore insightful writeups on web engineering, system design, artificial intelligence, and developer productivity.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/create"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Start Writing
              </Link>
              <a
                href="#feed"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-full border border-white/10 backdrop-blur-md transition-all"
              >
                Browse Articles
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Featured Highlight Card */}
      {featuredPost && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase">
            <TrendingUp className="w-4 h-4" />
            <span>Featured Article</span>
          </div>
          <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 h-64 lg:h-auto relative overflow-hidden bg-slate-100">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {featuredPost.category && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-700 text-xs font-bold rounded-full shadow">
                  {featuredPost.category.name}
                </span>
              )}
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime} min read
                  </span>
                  <span>•</span>
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <Link to={`/post/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredPost.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredPost.author?.username}`}
                    alt={featuredPost.author?.name}
                    className="w-8 h-8 rounded-full object-cover bg-slate-200"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{featuredPost.author?.name}</p>
                    <p className="text-xs text-slate-400">Author</p>
                  </div>
                </div>

                <Link
                  to={`/post/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Story</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Feed Section */}
      <section id="feed" className="space-y-6 pt-4">
        {/* Category Pills & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                !activeCategory
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.name} {cat._count?.posts > 0 && <span className="opacity-75">({cat._count.posts})</span>}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-end sm:self-auto flex-shrink-0">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'latest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'popular' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Top Liked</span>
            </button>
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'views' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Most Read</span>
            </button>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(activeCategory || searchKeyword) && (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-2xl text-sm text-indigo-900">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>
                Filtering by:{' '}
                {activeCategory && <strong className="font-bold">Category: {activeCategory}</strong>}
                {activeCategory && searchKeyword && ' and '}
                {searchKeyword && <strong className="font-bold">Query: "{searchKeyword}"</strong>}
              </span>
            </div>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : gridPosts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No articles found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              We couldn't find any articles matching your search query or category filter. Try clearing filters or create the first post!
            </p>
            <div className="pt-2">
              <Link
                to="/create"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow hover:bg-indigo-700 transition-all inline-block"
              >
                Write an Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
