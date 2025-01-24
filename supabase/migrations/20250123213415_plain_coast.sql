/*
  # Quiz Results Schema

  1. New Tables
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text)
      - `score` (integer)
      - `total_questions` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quiz_results` table
    - Add policies for users to:
      - Insert their own results
      - Read their own results
*/

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);