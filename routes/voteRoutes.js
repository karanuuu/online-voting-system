const express = require('express');
const router = express.Router();

const { castVote, getResults, checkVoteStatus } = require('../controllers/voteController');

const fakeAuth = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

router.post('/cast', fakeAuth, castVote);
router.get('/results', fakeAuth, getResults);
router.get('/status', fakeAuth, checkVoteStatus);

module.exports = router;