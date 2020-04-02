const express = require('express');
const Joi = require('@hapi/joi');

const router = express.Router();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const course = findCourseById(req.params.id);
    if (!course) res.status(404).send('Course not found');
    res.send(course);
});

router.get('/:year/:month', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send(req.params);
});

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send('Request not valid');

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
