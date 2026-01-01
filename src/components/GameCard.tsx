import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Star, ExternalLink, Zap } from 'lucide-react';

interface GameCardProps {
  id: string;
  slug?: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  downloads: string;
  size: string;
  category: string;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  slug,
  title,
  description,
  image,
  rating,
  downloads,
  size,
  category
}) => {
  const detailLink = `/game/${slug || id}`;
  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-purple-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)] flex flex-col h-full animate-fade-up">
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md text-purple-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm border border-white/20">
            {category}
          </span>
          {rating >= 4.5 && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Editors' Pick
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-yellow-700">{rating}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Downloads</span>
            <span className="text-sm font-black text-slate-700">{downloads}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Size</span>
            <span className="text-sm font-black text-slate-700">{size}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            to={detailLink}
            className="flex-1 bg-slate-900 hover:bg-black text-white py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-slate-200"
          >
            <Download className="w-4 h-4" />
            <span>Get APK</span>
          </Link>
          <Link
            to={detailLink}
            className="w-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center transition-all duration-300 group/link"
          >
            <ExternalLink className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;