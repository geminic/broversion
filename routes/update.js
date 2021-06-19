/**
 * Endpoint to update the database
 */
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/', (req, res) => {
    /**
     * Update the caniuse-lite database
     */
    exec('npx browserslist@latest --update-db', (error, stdout) => {
        if (error) {
            res.send(error);
        } else if (stdout) {
            res.send(stdout);
        } else {
            res.send('Error');
        }
    });
});

module.exports = router;
