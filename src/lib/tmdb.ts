const TMDB_API_KEY = '3dd626913ece7d2bf1bdfb98c0daf2ce';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  budget: number;
  revenue: number;
  status: string;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
  );
  return await response.json();
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}