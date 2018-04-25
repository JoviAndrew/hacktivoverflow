const questions = require('../models/question');
const answers = require('../models/answer')
const users = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
	getAllQuestions(req, res){
		questions.find({})
		.then(function(questionData){
				res.status(200).json({
						message: 'success get posts',
						data: questionData
				})
		})
		.catch(function(err){
			res.status(500).json({
				message: 'error while getting posts',
				err: err
			})
		})
	},
	getOneQuestion(req, res){
		questions.findById({
			_id: req.params.id
		})
		.populate({
			path: 'answers',
			populate: {
				path: 'user',
			}
		})
		.populate('user')
		.then(function(questionData){
			res.status(200).json({
				message: 'Success get data',
				data: questionData
			})
		})
		.catch(function(err){
			res.status(500).json({
				message: 'error while getting the data',
				err: err
			})
		})
	},
	getAllAnswers(req, res){
		let questionId = req.params.id
		answers.find({
			questionId: questionId
		})
		.then(function(answerData){
			res.status(200).json({
				message: 'success get posts',
				data: answerData
			})
		}).catch(function(err){
			res.status(500).json({
				message: 'error while getting posts',
				err: err
			})
		})
	},
	addQuestion(req, res){
		const token = req.headers.token
		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
					res.send({
							err: err,
							message: 'Something went wrong with jwt'
					})
			}
			else{
				questions.create({
					up: [],
					down: [],
					user: result.id,
					header: req.body.header,
					post_text: req.body.postText,
					username: result.username,
					answers: []
				})
				.then(function(response){
					res.status(200).json({
							message: 'Success added new Question!',
							response: response
					})
				})
			}
		})
	},
	addAnswer(req, res){
		const token = req.headers.token
		let id = req.params.id
		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
					err: err,
					message: 'Something went wrong with jwt'
				})
			}
			else{
				answers.create({
					up: [],
					down: [],
					user: result.id,
					questionId: id,
					post_text: req.body.postText,
					username: result.username,
				})
				.then(function(response){
					questions.bulkWrite([{
						updateOne: {
							filter: {
								'_id': id
							},
							update: {
								$push:{answers: response._id}
							}
						}
					}])
					.then(function(response){
						res.status(200).json({
							message: 'Success posted an answer!',
							response: response
						})
					})
				})
			}
		})
	},    
	updateQuestion(req, res){
		let id = req.params.id
		const token = req.headers.token
		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
					err: err,
					message: 'Something went wrong with jwt'
				})
			}else{
				questions.bulkWrite([{
					updateOne: {
						filter: {
							_id: id,
							user: result.id
						},
						update: {
							header: req.body.header,
							post_text: req.body.postText
						}
					}
				}])
				.then(function(response){
					res.status(200).json({
						message: 'Success update question',
						response: response
					})
				})
				.catch(function(err){
					res.status(500).json({
							message:'Error',
							err: err
					})
				})
			}
		})
	},
	deleteQuestion(req, res){
		let id = req.params.id
		const token = req.headers.token
		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
						err: err,
						message: 'Something went wrong with jwt'
				})
			}else{
				questions.deleteOne({
					_id: id,
					user: result.id
				})
				.then(function(response){
					answers.deleteMany(
						{
							questionId: id
						})
						.then(function(responseDeleteMany){
							res.status(200).json({
									message: 'Successfully deleted a question!',
									response: responseDeleteMany
							})
						})
				})
				.catch(function(err){
					res.status(500).json({
							message: 'Error while deleting a question!',
							err: err
					})
				})
			}
		})
	},
	deleteAnswer(req, res){
		let answerId = req.params.id
		let questionId = req.headers.id
		const token = req.headers.token
		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
					err: err,
					message: 'Something went wrong with jwt'
				})
			}else{
				answers.bulkWrite([{
					deleteOne: {
						filter: {
							'_id': answerId,
							'user': result.id
						},
					}
				}])
				.then(function(response){
					//Update question
					questions.bulkWrite([{
						updateOne: {
							filter: {
								'_id': questionId
							},
							update: {
								$pull: {answers: answerId}
							}
						}
					}])
					.then(function(response){
						res.status(200).json({
								message: 'Successfully deleted an answer!',
								// response: response
						})
					})
				})
				.catch(function(err){
					res.status(500).json({
							message: 'Error while deleting a answer!',
							err: err
					})
				})
			}
		})
	},
	//Question Voting
	upVoteQuestion(req, res){
		const token = req.headers.token
		let questionId = req.params.id

		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
						err: err,
						message: 'Something went wrong with jwt'
				})
			}else{
				questions.bulkWrite([{
					updateOne: {
						filter: {
							'_id': questionId
						},
						update: {
							$addToSet: {up: result.id},
							$pull: {down: result.id}
						}
					}
				}])
				.then(function(response){
					res.status(200).json({
						message: 'Success up voting',
						response: response
					})
				})
				.catch(function(err){
					res.status(500).json({
						message: 'Error while voting',
						err: err
					})
				})
			}
		})
	},
	downVoteQuestion(req, res){
		const token = req.headers.token
		let questionId = req.params.id

		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
					err: err,
					message: 'Something went wrong with jwt'
				})
			}else{
				questions.bulkWrite([{
					updateOne: {
						filter: {
							'_id': questionId
						},
						update: {
							$addToSet: {down: result.id},
							$pull: {up: result.id}
						}
					}
				}])
				.then(function(response){
					res.status(200).json({
						message: 'Success down vote',
						response: response
					})
				})
				.catch(function(err){
					res.status(500).json({
						message: 'Error while down voting',
						err: err
					})
				})
			}
		})
	},
	//Answer Voting
	upVoteAnswer(req, res){
		const token = req.headers.token
		let answerId = req.params.id

		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
						err: err,
						message: 'Something went wrong with jwt'
				})
			}else{
				answers.bulkWrite([{
					updateOne: {
						filter: {
							'_id': answerId
						},
						update: {
							$addToSet: {up: result.id},
							$pull: {down: result.id}
						}
					}
				}])
				.then(function(response){
					res.status(200).json({
						message: 'Success up voting',
						response: response
					})
				})
				.catch(function(err){
					res.status(500).json({
						message: 'Error while voting',
						err: err
					})
				})
			}
		})
	},
	downVoteAnswer(req, res){
		const token = req.headers.token
		let answerId = req.params.id

		jwt.verify(token, process.env.SECRET, function(err, result){
			if(err){
				res.send({
					err: err,
					message: 'Something went wrong with jwt'
				})
			}else{
				answers.bulkWrite([{
					updateOne: {
						filter: {
							'_id': answerId
						},
						update: {
							$addToSet: {down: result.id},
							$pull: {up: result.id}
						}
					}
				}])
				.then(function(response){
					res.status(200).json({
						message: 'Success down vote',
						response: response
					})
				})
				.catch(function(err){
					res.status(500).json({
						message: 'Error while down voting',
						err: err
					})
				})
			}
		})
	}
}