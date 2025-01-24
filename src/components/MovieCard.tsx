import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../lib/tmdb';
import { getImageUrl } from '../lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
    >
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {new Date(movie.release_date).getFullYear()}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}