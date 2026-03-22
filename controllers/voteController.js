const db = require('../config/db');

// To get voter and  the person he/she is voting for

const castVote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { candidate_id } = req.body;

    if (!candidate_id) {
      return res.status(400).json({ message: 'candidate_id is required.' });
    }

// Check if candidate exits

    const [candidates] = await db.query(
      'SELECT id FROM candidates WHERE id = ?',
      [candidate_id]
    );

    if (candidates.length === 0) {
      return res.status(404).json({ message: 'Invalid candidate. Please select a valid candidate.' });
    } 

// Save vote

    await db.query(
      'INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)',
      [userId, candidate_id]
    );

// Mark the user to have already voted

    await db.query(
      'UPDATE users SET has_voted = TRUE WHERE id = ?',
      [userId]
    );

    res.status(201).json({ message: 'Vote casted successfully.' });

  } catch (error) {
    console.error('Cast vote error:', error);

    if (error.code === 'ER_DUP_ENTRY'){
      return res.status(409).json({message: 'You have already voted. Only one vote per user is allowed.'});
    }

    res.status(500).json({message: 'An unexpected error occurred. Please try again later.'});
  }
};

// Calculation of votes

const getResults = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
          c.id AS candidate_id,
          c.name AS candidate_name,
          c.position,
          COUNT(v.id) AS vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id
       GROUP BY c.id, c.name, c.position
       ORDER BY vote_count DESC`
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'No candidates found.' });
    }

    const totalVotes = results.reduce((sum, row) => sum + Number(row.vote_count), 0);

    const formattedResults = results.map((row) => ({
      candidate_id: row.candidate_id,
      candidate_name: row.candidate_name,
      position: row.position,
      vote_count: Number(row.vote_count),
      percentage: totalVotes > 0
        ? ((Number(row.vote_count) / totalVotes) * 100).toFixed(2) + '%'
        : '0%',
    }));

    res.status(200).json({
      total_votes: totalVotes,
      results: formattedResults,
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error while fetching results.' });
  }
};

// Checks if has_voted is true/false and returns to frontend

const checkVoteStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      'SELECT has_voted FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      has_voted: rows[0].has_voted === 1,
    });

  } catch (error) {
    console.error('Vote status error:', error);
    res.status(500).json({ message: 'Server error while checking vote status.' });
  }
};

module.exports = { castVote, getResults, checkVoteStatus };