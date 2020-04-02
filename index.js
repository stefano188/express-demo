
const express = require('express');
const config = require('config');
const debugApp = require('debug')('app:startup');
const debugDb = require('debug')('app:db');
const courses = require('./routes/courses');
const roots = require('./routes/root');

const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authentication');

const app = express();

debugApp(`NODE_ENV: ${process.env.NODE_ENV}`);
debugApp(`env: ${app.get('env')}`);
debugDb('connecting to DB');

// pug
app.set('view engine', 'pug');
//app.set('views', './views'); // default
app.set('views', ['./views_pug/', './views']);

// Middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('tiny'));
if ('development' === app.get('env')) {
    app.use(helmet());
}
// Custom Middleware functions
app.use(logger);
app.use(authenticate);

app.use('/api/courses', courses);
app.use(roots);




printConfigValue('name');
printConfigValue('mail.host');
printConfigValue('mail.password');

function printConfigValue(key) {
    if (config.has(key)) {
        console.log(`Config ${key}: ${config.get(key)}`);
    }
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

