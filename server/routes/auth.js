const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(422).json({error: 'Empty fields not allowed'})
    }
    
    User.findOne({ email: email })
    .then(savedUser => {
        if(savedUser)
            return res.status(422).json({error: 'User with this email aready exists'})
        
        bcrypt.hash(password, 12).then(hashedPwd => {
            const user = new User({
                name,
                email,
                password: hashedPwd
            })
    
            user.save()
            .then(user => {
                res.json({message: 'User sucessfully Signed-Up'})
            })
            .catch(err => {
                res.status(422).send({error: 'Error Signing up the User'})
            })
        })
        .catch(err => console.log('Error Hashing Password ',err))
        
    })
    .catch(err => console.log('Error Finding User ',err))
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password)
        return res.status(402).json({error: 'Email or Password can\'t be empty'})

    User.findOne({ email: email }).then(savedUser => {
        if(!savedUser)
            return res.status(402).json({error: 'Invalid email or passsword'})

        bcrypt.compare(password, savedUser.password).then(isMatched => {
            if(!isMatched)
                return res.status(402).json({error: 'Invalid email or passsword'})

            // res.json({message: 'User sucessfully Signed-In'})
            const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
            const { _id, name, email } = savedUser
            res.json({token, user: { _id, name, email }})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router