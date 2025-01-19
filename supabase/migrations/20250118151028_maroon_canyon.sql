/*
  # Add secret notes table

  1. New Tables
    - `secret_notes`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on secret_notes table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS secret_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE secret_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own secret notes"
  ON secret_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own secret notes"
  ON secret_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own secret notes"
  ON secret_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own secret notes"
  ON secret_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);