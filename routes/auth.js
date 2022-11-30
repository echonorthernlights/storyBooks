const express = require('express');
const passport = require('passport');
const router = express.Router();

//@des Auth with google
//@route GET/ auth/google

router.route('/google').get(passport.authenticate('google', { scope: ['profile'] }))

//@des google Auth callback
//@route GET/

router.route('/google/callback').get(passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard')
    })


//@des google Auth logout
//@route GET/

router.route('/logout').get(
    (req, res) => {
        req.logout((error) => {
            if (error) { return next(error) }
            res.redirect('/')
        })
    })


module.exports = router