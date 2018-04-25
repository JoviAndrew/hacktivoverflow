const router = require('express').Router();
const home = require('../controllers/home_controller');

router.get('/show-questions', home.getAllQuestions);

router.get('/show-questions/:id', home.getOneQuestion)

router.get('/show-answers/:id', home.getAllAnswers)

router.post('/post-question', home.addQuestion);

router.post('/post-answer/:id', home.addAnswer);

router.put('/update/:id', home.updateQuestion);

router.delete('/delete-question/:id', home.deleteQuestion);

router.delete('/delete-answer/:id', home.deleteAnswer);

//Voting Question
router.put('/voteup-question/:id', home.upVoteQuestion);

router.put('/votedown-question/:id', home.downVoteQuestion);

//Voting Answer
router.put('/voteup-answer/:id', home.upVoteAnswer);

router.put('/votedown-answer/:id', home.downVoteAnswer);

module.exports = router;