/**
 * Endpoint to get browsers versions
 */
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/', (req, res) => {
    /**
     * Get browsers versions from the current database
     */
    exec('npx browserslist', (error, stdout) => {
        if (stdout) {
            res.send(stdout);
        } else {
            res.send('Error');
        }
    });
});

module.exports = router;
