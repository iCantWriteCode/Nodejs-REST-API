const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.post('/signup', (req, res, next) => {

    // Checks if email exists already in DB
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: 'Email Already Exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(response => {
                                console.log(response)
                                res.status(201).json({
                                    message: 'User Created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(501).json({
                                    error: err
                                })
                            })
                    }

                });
            }
        })
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {

            // If user doesnt exists
            if (user.length < 1) return res.status(401).json({ message: "Auth Failed" })

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                if (err) return res.status(401).json({ message: "Auth Failed" })
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        // process.env.JWT_KEY,
                        'secret',
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({ message: 'Auth Successfull', token: token })
                }
                res.status(401).json({ message: "Auth Failed" })

            })
        })

        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {

    User.remove({ _id: req.params.userId })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'User Deleted'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;