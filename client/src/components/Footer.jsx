import React from 'react';
import { BookOpen, Heart, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                BlogSphere
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              A modern blogging community designed for software engineers, designers, and creators to share ideas, tutorials, and insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/?category=web-development" className="hover:text-indigo-600 transition-colors">Web Development</Link></li>
              <li><Link to="/?category=artificial-intelligence" className="hover:text-indigo-600 transition-colors">Artificial Intelligence</Link></li>
              <li><Link to="/?category=ui-ux-design" className="hover:text-indigo-600 transition-colors">UI/UX Design</Link></li>
              <li><Link to="/?category=cloud-devops" className="hover:text-indigo-600 transition-colors">Cloud & DevOps</Link></li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/create" className="hover:text-indigo-600 transition-colors">Write an Article</Link></li>
              <li><Link to="/my-posts" className="hover:text-indigo-600 transition-colors">Author Dashboard</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BlogSphere Platform. Built with Express, Prisma, SQLite & React.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for developer productivity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
