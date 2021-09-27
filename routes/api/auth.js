const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcyrpt = require('bcryptjs');

//@route       GET/api/auth
//@desc        test api
//@access      public

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//@route       post/api/Auth
//@desc        post api for user authentication and token
//@access      public

router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'PLease provide a valid password ').exists(),
	],
	async (req, res) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ error: [{ msg: 'Invalid Credentials' }] });
			}
			const isMatch = await bcyrpt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ error: [{ msg: 'Invalid Credential' }] });
			}
			//Return JsonWebToken because once the user is registered it will be logged in
			const payload = {
				user: {
					id: user.id,
					name: user.name,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
