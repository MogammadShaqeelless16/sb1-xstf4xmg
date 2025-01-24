import React, { useState, useEffect } from 'react';
import { Search, Film, Heart, X } from 'lucide-react';
import { Movie, MovieDetails, searchMovies, getPopularMovies, getMovieDetails, getImageUrl } from '../lib/tmdb';
import { MovieCard } from './MovieCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MovieCatalogProps {
  onClose: () => void;
}

export function MovieCatalog({ onClose }: MovieCatalogProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadPopularMovies();
    loadFavorites();
  }, []);

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
    } catch (error) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const { data } = await supabase
        .from('favorite_movies')
        .select('movie_id')
        .eq('user_id', user?.id);
      setFavorites(data?.map(f => f.movie_id) || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPopularMovies();
      return;
    }
    try {
      setLoading(true);
      const results = await searchMovies(searchQuery);
      setMovies(results);
    } catch (error) {
      toast.error('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (error) {
      toast.error('Failed to load movie details');
    }
  };

  const toggleFavorite = async (movieId: number) => {
    try {
      if (favorites.includes(movieId)) {
        await supabase
          .from('favorite_movies')
          .delete()
          .eq('user_id', user?.id)
          .eq('movie_id', movieId);
        setFavorites(favorites.filter(id => id !== movieId));
        toast.success('Removed from favorites');
      } else {
        await supabase
          .from('favorite_movies')
          .insert({ user_id: user?.id, movie_id: movieId });
        setFavorites([...favorites, movieId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Film className="h-8 w-8 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold">Movie Catalog</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </form>

      {selectedMovie ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={getImageUrl(selectedMovie.poster_path, 'original')}
                alt={selectedMovie.title}
                className="w-full h-96 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                <button
                  onClick={() => toggleFavorite(selectedMovie.id)}
                  className={`p-2 rounded-full ${
                    favorites.includes(selectedMovie.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="h-6 w-6" fill={favorites.includes(selectedMovie.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedMovie.overview}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Release Date:</span>{' '}
                  {new Date(selectedMovie.release_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Rating:</span>{' '}
                  {selectedMovie.vote_average.toFixed(1)}/10
                </div>
                <div>
                  <span className="font-semibold">Runtime:</span>{' '}
                  {selectedMovie.runtime} minutes
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  {selectedMovie.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}