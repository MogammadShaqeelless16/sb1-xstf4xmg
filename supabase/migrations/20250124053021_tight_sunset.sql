/*
  # Audit Logs Schema

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `event_type` (text) - Type of event (error, warning, info)
      - `message` (text) - Error message or event description
      - `metadata` (jsonb) - Additional context about the event
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `audit_logs` table
    - Add policies for users to read their own logs
    - Add policies for admins to read all logs
*/

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  event_type text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for admins to read all logs
CREATE POLICY "Admins can read all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));