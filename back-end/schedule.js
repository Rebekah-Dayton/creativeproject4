const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Course Catalog
const catalogSchema = new mongoose.Schema({
  courseId: String,
  className: String,
  instructor: String,
  time: String,
});

catalogSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
catalogSchema.set('toJSON', {
  virtuals: true
});

const Catalog = mongoose.model('Catalog', catalogSchema);

// Schedule classes
const classSchema = new mongoose.Schema({
  student: String,
  program: mongoose.Schema.Types.Mixed,
  className: String,
  instructor: String,
  time: String
});

classSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
classSchema.set('toJSON', {
  virtuals: true
});

const Course = mongoose.model('Class', classSchema);

app.get('/api/class', async (req, res) => {
  try {
    let courses = await Course.find();
    res.send({courses: courses});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/class', async (req, res) => {
    console.log("attempting to add class");
    const course = new Course({
    student: req.body.student,
    program: req.body.program,
    className: Catalog.find({className : req.body.program}).className,
    instructor: req.body.instructor,
    time: req.body.time
  });
  
  console.log("adding Class", course);
  try {
    await course.save();
    res.send({course: course});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/class/:id', async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/catalog', async (req, res) => {
  try {
    let catalogs = await Catalog.find();
    console.log("catalog.find()", catalogs);
    res.send({catalogs: catalogs});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/catalog', async (req, res) => {
    console.log("attempting to add class");
    const catalog = new Catalog({
    courseId: req.body.courseId,
    className: req.body.className,
    instructor: req.body.instructor,
    time: req.body.time
  });
  
  console.log("adding Class", catalog);
  try {
    await catalog.save();
    res.send({catalog: catalog});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/catalog/:id', async (req, res) => {
  try {
    await Catalog.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));