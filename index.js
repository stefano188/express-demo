
const Joi = require('@hapi/joi');
const express = require('express');

const app = express();

app.use(express.json());

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
    //res.send(req.params.id);
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

