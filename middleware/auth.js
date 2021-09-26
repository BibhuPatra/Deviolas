const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
	//Get token from header
	const token = req.header('x-auth-token');

	//check if not tokem
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorisation denied!' });
	}

	//verify token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token is not valid' });
	}
};
