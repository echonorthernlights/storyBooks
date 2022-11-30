const express = require('express');
const Story = require('../models/Story')
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

//@des show Add page
//@route GET/stories/add

router.route('/add').get(ensureAuth, (req, res) => {
    res.render('stories/add', { layout: 'main' })
})


//@des process story
//@route POST/stories/

router.route('/').post(ensureAuth, async (req, res) => {
    try {
        console.log(req.body)
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }

    //res.render('stories/add', { layout: 'main' })
})



module.exports = router