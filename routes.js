const express = require('express');

const router = express.Router();
module.exports = router;
router.get('/api/users', (req, res) => {
    console.log('Inside get user api');
    return res.json({
        status: true,
        response: 'Inside get user api'
    });
});