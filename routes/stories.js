const express = require('express');
const Story = require('../models/Story')
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');


//@des show all stories
//@route GET/stories/

router.route('/').get(ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean();
        return res.render('stories/index', { stories });
    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
})



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

//@des show edit story
//@route PUT/stories/edit/id

router.route('/edit/:id').get(ensureAuth, async (req, res) => {

    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();
        if (!story) {
            return res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', { story });
        }


    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
})

//@des update story
//@route PUT/stories/:id

router.route('/:id').put(ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean();
        if (!story) {
            return res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
            res.redirect('/dashboard');
        }


    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
})

//@des delete story
//@route DELETE/stories/:id

router.route('/:id').delete(ensureAuth, async (req, res) => {

    try {
        await Story.remove({ _id: req.params.id });
        res.redirect('/dashboard');

    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
})

//@des get single story
//@route GET/stories/:id

router.route('/:id').get(ensureAuth, async (req, res) => {

    try {
        const story = await Story.findById(req.params.id).populate('user').lean();
        res.render('stories/showStory', { story });
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
})

//@des get user stories
//@route GET/stories/user/:userId

router.route('/user/:userId').get(ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.params.userId, status: 'public' }).populate('user').lean();
        res.render('stories/index', { stories });
    } catch (error) {
        console.log(err);
        res.render('error/404')
    }
})



module.exports = router