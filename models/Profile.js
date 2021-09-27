const mongoose = require('mongoose');
const Profile = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	company: {
		type: String,
	},
	website: {
		type: String,
	},
	location: {
		type: String,
	},
	status: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
		required: true,
	},
	bio: {
		type: String,
	},
	githubusername: {
		type: String,
	},
	experiance: [
		{
			title: {
				type: String,
				required: true,
			},
			company: {
				type: String,
				required: true,
			},
			location: {
				type: String,
				from: {
					type: Date,
					required: true,
				},
				to: {
					true: Date,
				},
				current: {
					type: Boolean,
					default: false,
				},
				descreption: {
					type: String,
				},
			},
		},
	],
	education: [
		{
			school: {
				type: String,
				required: true,
			},
			degree: {
				type: String,
				required: true,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
				required: true,
			},
			current: {
				type: String,
				default: false,
			},
			descreption: {
				type: String,
			},
		},
	],
	social: {
		youtube: {
			type: String,
		},
		twiter: {
			type: String,
		},
		facebook: {
			type: String,
		},
		instgram: {
			type: String,
		},
		linkedin: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
});

module.exports = profile = mongoose.model('profile', Profile);
