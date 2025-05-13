CREATE TABLE IF NOT EXISTS scouting_notes (
    id SERIAL PRIMARY KEY,
    player VARCHAR(255) NOT NULL,
    height VARCHAR(10),
    wingspan VARCHAR(10),
    age INTEGER,
    college VARCHAR(255),
    position VARCHAR(50),
    intangibles TEXT,
    development_needs TEXT,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 