const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user/:id', requireLogin, (req,res) => {
    User.findOne({_id: req.params.id})
    .select('-password')
    .then(user => {
        Post.find({postedBy: req.params.id})
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({err})
            }
            res.json({user, posts})
        })
    })
    .catch(err => res.json({err}))
})

router.put('/follow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {
            followers: req.user._id
        }
    },{
        new: true
    }, (err, result) => {
        if(err) {
            res.status(422).json(err)
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: req.body.followId
            }
        }, {
            new: true
        })
        .select('-password')
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => res.status(422).json(err))
    })
})

router.put('/unfollow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {
            followers: req.user._id
        }
    },{
        new: true
    }, (err, result) => {
        if(err) {
            res.status(422).json(err)
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: req.body.unfollowId
            }
        }, {
            new: true
        })
        .select('-password')
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => res.status(422).json(err))
    })
})

router.put('/updatePic', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            picUrl: req.body.picUrl
        }
    }, {
        new: true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({err: "pic cannot be updated"})
        }
        res.json(result)
    })
})

module.exports = router