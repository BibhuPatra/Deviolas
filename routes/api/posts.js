const express = require('express');

const router = express.Router();

//@route       GET/api/Post
//@desc        test api
//@access      public

router.get('/', (req, res) => res.send('Post route'));

module.exports = router;
