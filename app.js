const express = require('express');
const app = express();
const PORT = process.env.PORT || 1010;
const routerIndex = require('./routes/index');
const routerGetbro = require('./routes/getbro');
const routerUpdate = require('./routes/update');


/**
 * Include static files
 */
app.use(express.static('public'));


/**
 * Routes
 */
app.use('/', routerIndex);
app.use('/getbro', routerGetbro);
app.use('/update', routerUpdate);


/**
 * Launch server
 */
app.listen(PORT, () => {
    console.log('Server has been started');
});
