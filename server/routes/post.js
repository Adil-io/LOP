const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

router.post('/create-post', requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    if(!title || !body ||  !pic)
        return res.status(422).json({error: 'Please add all the Fields'})

    //console.log(req.user)
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result})
    })
    .catch(err => console.log(err))

})

router.get('/my-posts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name email')
    .populate('comments.commentedBy', '_id name')
    .then(myPost => {
        res.json({myPost})
    })
    .catch(err => console.log(err))
})

router.get('/all-posts', requireLogin, (req, res) => {
    Post.find()
    .populate('postedBy','_id name email')
    .populate('comments.commentedBy', '_id name')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => console.log(err))
})

router.get('/all-following-posts', requireLogin, (req, res) => {
    Post.find({
        postedBy: {
            $in: req.user.following
        }
    })
    .populate('postedBy','_id name email')
    .populate('comments.commentedBy', '_id name')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => console.log(err))
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {
        new: true
    })
    .populate('postedBy', '_id name email')
    .populate('comments.commentedBy', '_id name')
    .exec((err, result) => {
        if(err)
            return res.status(422).json({error: err})
        else
            res.json(result)
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    })
    .populate('postedBy', '_id name email')
    .populate('comments.commentedBy', '_id name')
    .exec((err, result) => {
        if(err)
            return res.status(422).json({error: err})
        else
            res.json(result)
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        commentedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {
        new: true
    })
    .populate('postedBy', '_id name email')
    .populate('comments.commentedBy', '_id name')
    .exec((err, result) => {
        if(err)
            return res.status(422).json({error: err})
        else
            res.json(result)
    })
})

router.delete('/deletePost/:postId', requireLogin, (req,res) => {
    Post.findOne({_id: req.params.postId})
    .populate('postedBy', '_id name email')
    .exec((err, post) => {
        if(err || !post) {
            res.status(422).json({error: err})
        }
        else if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => res.json(result))
            .catch(err => console.log(err))
        }
    })
})

router.delete('/deleteComment/:postId/:commentId', (req,res) => {
    Post.findByIdAndUpdate(
        {_id: req.params.postId},
        {
            $pull: {
                comments: {
                    _id: req.params.commentId
                }
            }
        },
        {new: true}
    )
    .populate('postedBy', '_id name email')
    .populate('comments.commentedBy', '_id name')
    .exec((err, post) => {
        if(err || !post) {
            res.status(422).json({error: err})
        }
        res.json(post)
    })
})

module.exports = router