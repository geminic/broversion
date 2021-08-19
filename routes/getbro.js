/**
 * Endpoint to get browsers versions
 */
const express = require('express');
const router = express.Router();
const browserslist = require('browserslist');
const path = require('path');
const fs = require('fs');


router.get('/', (req, res) => {
    const date = new Date();
    const yyyy = date.getFullYear() - 1;
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    /**
     * Get all current versions and since 1 year ago
     */
    // browserslist.clearCaches();
    const arr = browserslist(`last 1 version, since ${yyyy}-${mm}-${dd}`);
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
    }

    res.send(JSON.stringify(formatted));
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
