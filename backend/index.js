const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const port = 3001;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.use(cors());
app.use(express.json());

// Get all scouting notes
app.get('/api/scouting-notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scouting_notes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new scouting note
app.post('/api/scouting-notes', async (req, res) => {
  const {
    player,
    height,
    wingspan,
    age,
    college,
    position,
    intangibles,
    development_needs,
    notes
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO scouting_notes (
        player, height, wingspan, age, college, position,
        intangibles, development_needs, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [player, height, wingspan, age, college, position, intangibles, development_needs, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a scouting note
app.put('/api/scouting-notes/:id', async (req, res) => {
  const { id } = req.params;
  const {
    player,
    height,
    wingspan,
    age,
    college,
    position,
    intangibles,
    development_needs,
    notes
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE scouting_notes 
       SET player = $1, height = $2, wingspan = $3, age = $4,
           college = $5, position = $6, intangibles = $7,
           development_needs = $8, notes = $9,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $10 RETURNING *`,
      [player, height, wingspan, age, college, position, intangibles, development_needs, notes, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a scouting note
app.delete('/api/scouting-notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM scouting_notes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get team records with filters
app.get('/api/team-records', async (req, res) => {
  console.log('Received request for team records');
  try {
    // First, get the table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teamrecords'
    `);
    console.log('Table structure:', tableInfo.rows);

    const {
      sortBy,
      sortOrder = 'DESC',
      coach,
      minWins,
      maxWins,
      minORtg,
      maxORtg,
      minDRtg,
      maxDRtg,
      minPace,
      maxPace,
      season,
      playoffs,
      limit = 50,
      offset = 0
    } = req.query;

    console.log('Query parameters:', req.query);

    let query = 'SELECT * FROM teamrecords WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Add filters
    if (coach) {
      query += ` AND coaches ILIKE $${paramCount}`;
      params.push(`%${coach}%`);
      paramCount++;
    }

    if (minWins) {
      query += ` AND w >= $${paramCount}`;
      params.push(minWins);
      paramCount++;
    }

    if (maxWins) {
      query += ` AND w <= $${paramCount}`;
      params.push(maxWins);
      paramCount++;
    }

    if (minORtg) {
      query += ` AND ortg >= $${paramCount}`;
      params.push(minORtg);
      paramCount++;
    }

    if (maxORtg) {
      query += ` AND ortg <= $${paramCount}`;
      params.push(maxORtg);
      paramCount++;
    }

    if (minDRtg) {
      query += ` AND drtg >= $${paramCount}`;
      params.push(minDRtg);
      paramCount++;
    }

    if (maxDRtg) {
      query += ` AND drtg <= $${paramCount}`;
      params.push(maxDRtg);
      paramCount++;
    }

    if (minPace) {
      query += ` AND pace >= $${paramCount}`;
      params.push(minPace);
      paramCount++;
    }

    if (maxPace) {
      query += ` AND pace <= $${paramCount}`;
      params.push(maxPace);
      paramCount++;
    }

    if (season) {
      query += ` AND season = $${paramCount}`;
      params.push(season);
      paramCount++;
    }

    if (playoffs) {
      query += ` AND playoffs ILIKE $${paramCount}`;
      params.push(`%${playoffs}%`);
      paramCount++;
    }

    // Add sorting
    if (sortBy) {
      const validSortColumns = [
        'season', 'w', 'l', 'wl', 'srs', 'pace', 'rel_pace',
        'ortg', 'rel_ortg', 'drtg', 'rel_drtg', 'coaches'
      ];
      
      if (validSortColumns.includes(sortBy.toLowerCase())) {
        query += ` ORDER BY ${sortBy.toLowerCase()} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'}`;
      }
    }

    // Add pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    console.log('Executing query:', query);
    console.log('With params:', params);

    const result = await pool.query(query, params);
    console.log('Query returned rows:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in /api/team-records:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack 
    });
  }
});

// Get filter options for team records
app.get('/api/team-records/filters', async (req, res) => {
  console.log('Received request for filter options');
  try {
    // First, get the table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teamrecords'
    `);
    console.log('Table structure:', tableInfo.rows);

    console.log('Fetching filter options...');
    const [seasons, coaches, playoffs] = await Promise.all([
      pool.query('SELECT DISTINCT season FROM teamrecords ORDER BY season DESC'),
      pool.query('SELECT DISTINCT coaches FROM teamrecords ORDER BY coaches'),
      pool.query('SELECT DISTINCT playoffs FROM teamrecords WHERE playoffs IS NOT NULL ORDER BY playoffs')
    ]);

    console.log('Filter options fetched:', {
      seasonsCount: seasons.rows.length,
      coachesCount: coaches.rows.length,
      playoffsCount: playoffs.rows.length
    });

    res.json({
      seasons: seasons.rows.map(row => row.season),
      coaches: coaches.rows.map(row => row.coaches),
      playoffs: playoffs.rows.map(row => row.playoffs)
    });
  } catch (error) {
    console.error('Error in /api/team-records/filters:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack 
    });
  }
});

// Get team stats with filters
app.get('/api/team-stats', async (req, res) => {
  console.log('Received request for team stats');
  try {
    const {
      sortBy,
      sortOrder = 'DESC',
      season,
      minPts,
      maxPts,
      minFgPercent,
      maxFgPercent,
      min3pPercent,
      max3pPercent,
      limit = 50,
      offset = 0
    } = req.query;

    console.log('Query parameters:', req.query);

    let query = 'SELECT * FROM mavsteamstats WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Add filters
    if (season) {
      query += ` AND "Season" = $${paramCount}`;
      params.push(season);
      paramCount++;
    }

    if (minPts) {
      query += ` AND "PTS" >= $${paramCount}`;
      params.push(minPts);
      paramCount++;
    }

    if (maxPts) {
      query += ` AND "PTS" <= $${paramCount}`;
      params.push(maxPts);
      paramCount++;
    }

    if (minFgPercent) {
      query += ` AND "FG_percent" >= $${paramCount}`;
      params.push(minFgPercent / 100);
      paramCount++;
    }

    if (maxFgPercent) {
      query += ` AND "FG_percent" <= $${paramCount}`;
      params.push(maxFgPercent / 100);
      paramCount++;
    }

    if (min3pPercent) {
      query += ` AND "3P_percent" >= $${paramCount}`;
      params.push(min3pPercent / 100);
      paramCount++;
    }

    if (max3pPercent) {
      query += ` AND "3P_percent" <= $${paramCount}`;
      params.push(max3pPercent / 100);
      paramCount++;
    }

    // Add sorting
    if (sortBy) {
      // Map frontend column IDs to database column names
      const columnMapping = {
        'Season': '"Season"',
        'Age': '"Age"',
        'G': '"G"',
        'MP': '"MP"',
        'FG': '"FG"',
        'FGA': '"FGA"',
        'FG_percent': '"FG_percent"',
        '3P': '"3P"',
        '3PA': '"3PA"',
        '3P_percent': '"3P_percent"',
        '2P': '"2P"',
        '2PA': '"2PA"',
        '2P_percent': '"2P_percent"',
        'FT': '"FT"',
        'FTA': '"FTA"',
        'FT_percent': '"FT_percent"',
        'ORB': '"ORB"',
        'DRB': '"DRB"',
        'TRB': '"TRB"',
        'AST': '"AST"',
        'STL': '"STL"',
        'BLK': '"BLK"',
        'TOV': '"TOV"',
        'PF': '"PF"',
        'PTS': '"PTS"'
      };

      const sortColumn = columnMapping[sortBy];
      if (sortColumn) {
        query += ` ORDER BY ${sortColumn} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'}`;
      } else {
        // Default sorting if invalid column
        query += ` ORDER BY "Season" DESC`;
      }
    } else {
      // Default sorting if no sort specified
      query += ` ORDER BY "Season" DESC`;
    }

    // Add pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    console.log('Executing query:', query);
    console.log('With params:', params);

    const result = await pool.query(query, params);
    console.log('First row of data:', result.rows[0]);
    console.log('Query returned rows:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in /api/team-stats:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});