-- Create sales_signups table for storing sales form data
CREATE TABLE IF NOT EXISTS sales_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    decision_maker VARCHAR(50) NOT NULL,
    pharmacy_name VARCHAR(255) NOT NULL,
    pharmacy_address TEXT,
    pharmacy_city VARCHAR(100),
    pharmacy_state VARCHAR(50),
    pharmacy_zip VARCHAR(20),
    pharmacy_size VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_sales_signups_email ON sales_signups(email);

-- Create an index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_sales_signups_created_at ON sales_signups(created_at DESC);

-- Create an index on pharmacy_name for searching
CREATE INDEX IF NOT EXISTS idx_sales_signups_pharmacy_name ON sales_signups(pharmacy_name);

-- Enable Row Level Security (RLS)
ALTER TABLE sales_signups ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for form signups)
CREATE POLICY "Allow public inserts on sales_signups"
ON sales_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create a policy that allows authenticated users to view all records
-- (you can modify this based on your admin access requirements)
CREATE POLICY "Allow authenticated users to view sales_signups"
ON sales_signups
FOR SELECT
TO authenticated
USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_signups_updated_at
    BEFORE UPDATE ON sales_signups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for easier querying with formatted data
CREATE OR REPLACE VIEW sales_signups_summary AS
SELECT
    id,
    first_name || ' ' || last_name AS full_name,
    email,
    phone,
    role,
    CASE
        WHEN decision_maker = 'yes' THEN 'Decision Maker'
        WHEN decision_maker = 'influence' THEN 'Has Influence'
        ELSE 'Will Refer'
    END AS decision_maker_status,
    pharmacy_name,
    CASE
        WHEN pharmacy_address IS NOT NULL AND pharmacy_city IS NOT NULL AND pharmacy_state IS NOT NULL
        THEN pharmacy_address || ', ' || pharmacy_city || ', ' || pharmacy_state || COALESCE(' ' || pharmacy_zip, '')
        ELSE NULL
    END AS full_address,
    CASE
        WHEN pharmacy_size = 'independent' THEN 'Independent Pharmacy'
        WHEN pharmacy_size = 'small-chain' THEN 'Small Chain (2-10 locations)'
        WHEN pharmacy_size = 'regional-chain' THEN 'Regional Chain (11-50 locations)'
        WHEN pharmacy_size = 'large-chain' THEN 'Large Chain (50+ locations)'
        ELSE pharmacy_size
    END AS pharmacy_size_formatted,
    notes,
    created_at,
    updated_at
FROM sales_signups
ORDER BY created_at DESC;
