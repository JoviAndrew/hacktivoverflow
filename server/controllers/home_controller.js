const posts = require('../models/post');
const jwt = require('jsonwebtoken');

module.exports = {
    getAllPosts(req, res){
        posts.find({})
        .then(function(postData){
            res.status(200).json({
                message: 'success get posts',
                data: postData
            })
        })
        .catch(function(err){
            message: err
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
                    posts.create({
                        user: result.id,
                        header: req.body.header,
                        post_text: req.body.postText,
                        username: req.body.username,
                        type: 'question'
                    })
                    .then(function(response){
                        res.status(200).json({
                            message: 'Success added new post!',
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
                posts.create({
                    user: result.id,
                    postId: id,
                    post_text: req.body.postText,
                    username: req.body.username,
                    type: 'answer'
                })
                .then(function(response){
                    res.status(200).json({
                        message: 'Success posted an answer!',
                        response: response
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
                posts.bulkWrite([{
                    updateOne: {
                        filter: {
                            '_id': id,
                            'user': result.id
                        },
                        update: {
                            header: req.body.header,
                            post_text: req.body.postText
                        }
                    }
                }])
                .then(function(response){
                    res.status(200).json({
                        message: 'Success update post',
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
        console.log(token)
        jwt.verify(token, process.env.SECRET, function(err, result){
            if(err){
                res.send({
                    err: err,
                    message: 'Something went wrong with jwt'
                })
            }else{
                posts.bulkWrite([{
                    deleteOne: {
                        filter: {
                            '_id': id,
                            'user': result.id
                        }
                    }
                }])
                .then(function(response){
                    res.status(200).json({
                        message: 'Successfully deleted a post!',
                        response: response
                    })
                })
                .catch(function(err){
                    res.status(500).json({
                        message: 'Error while deleting a post!',
                        err: err
                    })
                })
            }
        })
    },
    deleteAnswer(req, res){
        let id = req.params.id
        const token = req.headers.token
        console.log(token)
        jwt.verify(token, process.env.SECRET, function(err, result){
            if(err){
                res.send({
                    err: err,
                    message: 'Something went wrong with jwt'
                })
            }else{
                posts.bulkWrite([{
                    deleteOne: {
                        filter: {
                            '_id': id,
                            'user': result.id
                        }
                    }
                }])
                .then(function(response){
                    res.status(200).json({
                        message: 'Successfully deleted an answer!',
                        response: response
                    })
                })
                .catch(function(err){
                    res.status(500).json({
                        message: 'Error while deleting a post!',
                        err: err
                    })
                })
            }
        })
    }
}