const express = require('express');
const Story = require('../models/Story')
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//@des Login/Landing page
//@route GET/

router.route('/').get(ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' })
})

//@des Login/Ddashboard
//@route GET/

router.route('/dashboard').get(ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            stories,
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }

})

module.exports = router