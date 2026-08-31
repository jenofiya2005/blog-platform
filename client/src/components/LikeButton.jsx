import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);
    setLiked(nextLiked);
    setCount(nextCount);

    try {
      const response = await api.post(`/posts/${postId}/like`);
      setLiked(response.data.liked);
      setCount(response.data.likeCount);
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setCount(count);
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
        liked
          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm shadow-rose-100'
          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
      }`}
      title={liked ? 'Unlike this post' : 'Like this post'}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${
          liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-500'
        }`}
      />
      <span>{count}</span>
      <span className="hidden sm:inline text-xs font-normal opacity-80">
        {count === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
}
