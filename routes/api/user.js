const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../../models/Users');
const gravatar = require('gravatar');
const router = express.Router();
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { json } = require('express');

//@route       post/api/User
//@desc        post api for user registration
//@access      public

router.post(
	'/',
	[
		check('name', 'name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is too weak!').matches(
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
		),
	],
	async (req, res) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ error: [{ msg: 'User already exits!' }] });
			}
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			user = new User({
				name,
				email,
				password,
				avatar,
			});

			//encryption of the password
			const salt = await bcyrpt.genSalt(10);
			user.password = await bcyrpt.hash(password, salt);
			await user.save();

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
