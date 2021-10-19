const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { post } = require('request');
const { off } = require('../../models/User');
const { profile_url } = require('gravatar');

//@route       GET/api/Profile/me
//@desc        get current user profile
//@access      private

router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for the user' });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route       POST/api/Profile/edit
//@desc        create and update profile for the user
//@access      private

router.post(
	'/edit',
	auth,
	[
		check('status', 'status is required').not().isEmpty(),
		check('skills', 'Skills is required').not().isEmpty(),
	],
	async (req, res) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}
		const {
			company,
			website,
			location,
			status,
			skills,
			bio,
			githubusername,
			youtube,
			linkedin,
			twiter,
			facebook,
		} = req.body;
		//Build profile object
		const profileFields = {};
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (location) profileFields.location = location;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((element) => element.trim());
		}

		//Build social object
		if (youtube) profileFields.youtube = youtube;
		if (facebook) profileFields.facebook = facebook;
		if (twiter) profileFields.youtube = youtube;
		if (linkedin) profileFields.youtube = youtube;

		try {
			profile = await profile.findOne({ user: req.user.id });

			if (profile) {
				//update the data to profile if profile exits
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{
						new: true,
					}
				);
				return res.json(profile);
			}

			//create the profile if profile is not there
			profile = new Profile(profileFields);
			await profile.save();
			return res.json(profile);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
