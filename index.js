
const express = require('express');
const config = require('config');
const Joi = require('@hapi/joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const authenticate = require('./authentication');

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`env: ${app.get('env')}`);

// Middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

printConfigValue('name');
printConfigValue('mail.host');
printConfigValue('mail.password');
//console.log(`App Name: ${config.get('name')}`);
//console.log(`Mail Server: ${config.get('mail.host')}`);

if ('development' === app.get('env')) {
    app.use(morgan('tiny'));
}

// Custom Middleware functions
app.use(logger);
app.use(authenticate);

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

app.get('/', (req, res) => {
    res.send('Hello World !!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = findCourseById(req.params.id);
    if (!course) res.status(404).send('Course not found');
    res.send(course);
});

app.get('/api/courses/:year/:month', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send(req.params);
});

app.post('/api/courses/', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send('Request not valid');

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the Course
    // If not exists, return 404 (Not Found)
    const course = findCourseById(req.params.id);
    if (!course) return res.status(404).send('Course not found');

    // Validate request body
    // If not valid, return 400 (Bad Request)
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send('Request not valid');

    // Update Course
    // Return the updated Course
    course['name'] = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = findCourseById(req.params.id);
    if (!course) return res.status(404).send('Course not found');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

function findCourseById(id) {
    return courses.find(c => c.id === parseInt(id));
}

function validateCourse(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    }) 
    return schema.validate(body);
}

function printConfigValue(key) {
    if (config.has(key)) {
        console.log(`Config ${key}: ${config.get(key)}`);
    }
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

