/*
  # Create Google Meet History Table

  1. New Tables
    - `google_meet_history`
      - `id` (uuid, primary key) - Unique identifier for each meeting record
      - `meeting_id` (text, unique) - Google Meet meeting identifier
      - `title` (text) - Meeting title/name
      - `start_time` (timestamptz) - When the meeting started
      - `end_time` (timestamptz) - When the meeting ended
      - `duration` (integer) - Duration in minutes
      - `participants` (jsonb) - Array of participant information
      - `transcript` (text) - Full meeting transcript
      - `summary` (text) - AI-generated meeting summary
      - `action_items` (jsonb) - Array of action items identified
      - `key_topics` (jsonb) - Array of key topics discussed
      - `sentiment_analysis` (jsonb) - Sentiment analysis data
      - `recording_url` (text) - URL to meeting recording if available
      - `company_id` (uuid) - Foreign key to companies table
      - `created_by` (uuid) - User who created/imported the record
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `google_meet_history` table
    - Add policies for authenticated users to:
      - View meetings they created or are associated with their companies
      - Insert new meeting records
      - Update meetings they created
      - Delete meetings they created

  3. Indexes
    - Index on `meeting_id` for fast lookups
    - Index on `company_id` for company-based queries
    - Index on `start_time` for chronological sorting
    - Index on `created_by` for user-based queries
*/

-- Create the google_meet_history table
CREATE TABLE IF NOT EXISTS google_meet_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id text UNIQUE NOT NULL,
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer DEFAULT 0,
  participants jsonb DEFAULT '[]'::jsonb,
  transcript text,
  summary text,
  action_items jsonb DEFAULT '[]'::jsonb,
  key_topics jsonb DEFAULT '[]'::jsonb,
  sentiment_analysis jsonb DEFAULT '{}'::jsonb,
  recording_url text,
  company_id uuid,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_google_meet_meeting_id ON google_meet_history(meeting_id);
CREATE INDEX IF NOT EXISTS idx_google_meet_company_id ON google_meet_history(company_id);
CREATE INDEX IF NOT EXISTS idx_google_meet_start_time ON google_meet_history(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_google_meet_created_by ON google_meet_history(created_by);

-- Enable Row Level Security
ALTER TABLE google_meet_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view meetings they created
CREATE POLICY "Users can view own meetings"
  ON google_meet_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Policy: Users can view meetings associated with their companies
CREATE POLICY "Users can view company meetings"
  ON google_meet_history
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE created_by = auth.uid()
    )
  );

-- Policy: Users can insert new meeting records
CREATE POLICY "Users can insert meetings"
  ON google_meet_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update meetings they created
CREATE POLICY "Users can update own meetings"
  ON google_meet_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can delete meetings they created
CREATE POLICY "Users can delete own meetings"
  ON google_meet_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_google_meet_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_google_meet_history_updated_at
  BEFORE UPDATE ON google_meet_history
  FOR EACH ROW
  EXECUTE FUNCTION update_google_meet_history_updated_at();