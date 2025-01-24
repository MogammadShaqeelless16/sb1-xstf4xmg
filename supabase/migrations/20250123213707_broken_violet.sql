/*
  # Movie Favorites Schema

  1. New Tables
    - `favorite_movies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `movie_id` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `favorite_movies` table
    - Add policies for users to:
      - Insert their own favorites
      - Read their own favorites
      - Delete their own favorites
*/

CREATE TABLE IF NOT EXISTS favorite_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  movie_id integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorite_movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorite movies"
  ON favorite_movies
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);