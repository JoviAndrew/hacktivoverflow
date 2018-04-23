const router = require('express').Router();
const home = require('../controllers/home_controller');

router.get('/show', home.getAllPosts);

router.post('/postA', home.addQuestion);

router.post('/postQ', home.addAnswer);

router.put('/update/:id', home.updatePost);

router.delete('/deleteQ/:id', home.deleteQuestion);

router.delete('/deleteA/:id', home.deleteAnswer)

module.exports = router;