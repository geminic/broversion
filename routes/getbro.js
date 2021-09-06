/**
 * Endpoint to get browsers versions
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');


router.get('/', (req, res) => {
    /**
     * Get all current versions and since 1 year ago
     */
    exec(`npx browserslist`, (error, stdout) => {
        if (error) {
            res.send(error);
        } else if (stdout) {
            arr = stdout.split('\n');
            parseBrowsers(arr);
        } else {
            res.send('Error');
        }
    });


    /**
     * Format results
     */
    function parseBrowsers(arr) {
        const list = {};
        const grouped = {}

        /**
         * Group versions by browsers
         */
        arr.forEach(x => {
            const row = x.split(' ');
            const name = row[0];

            if (!grouped[name]) {
                grouped[name] = [];
            }

            grouped[name].push(row[1]);

            /**
             * Filter the last and 1-year-old versions
             */
            list[name] = [
                grouped[name][0],
                grouped[name][grouped[name].length - 1]
            ];
        });


        /**
         * Fix Chrome mobile 1 year version (there are no old versions)
         * Substitute the version of desktop Chrome
         */
        if (list['and_chr'] && list['and_chr'][0] === list['and_chr'][1] && list['chrome']) {
            list['and_chr'][1] = list['chrome'][1];
        }


        /**
         * Normalize names and separate mobile browsers from desktop
         */
        const log = getUpdateLog();
        const formatted = {
            'success': true,
            'lastUpdate': formatTime(log.lastUpdate),
            'dbVersion': log.dbVersion,
            'desktop': [
                ['Chrome', list.chrome],
                ['Safari', list.safari],
                ['Firefox', list.firefox],
                ['Opera', list.opera],
                ['Edge', list.edge]
            ],
            'mobile': [
                ['Chrome Mobile', list.and_chr],
                ['iOS Safari', list.ios_saf],
                ['Samsung Internet', list.samsung]
            ]
        };


        /**
         * Send
         */
        res.send(JSON.stringify(formatted));
    }
});


/**
 * Get information about the last update
 */
function getUpdateLog() {
    let log = {};

    try {
        log = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, '../bro_update_log.json'))
        );
    } catch (error) {
        console.log(error);
    }

    return log;
}


/**
 * Format time
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


module.exports = router;
