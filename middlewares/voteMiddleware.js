const db = require('../config/db');

const checkAlreadyVoted = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ message: 'election_id is required.' });
    }

    const [rows] = await db.query(
      'SELECT id FROM votes WHERE user_id = ? AND election_id = ?',
      [userId, election_id]
    );

    if (rows.length > 0) {
      return res.status(409).json({
        message: 'You have already voted in this election.',
      });
    }

    next();
  } catch (error) {
    console.error('Vote check error:', error);
    res.status(500).json({ message: 'Server error while checking vote status.' });
  }
};