const express = require("express");
const mongoose = require("mongoose");  // Require mongoose library
//Adding better logging functionality
const morgan = require("morgan");
//In the production systems, we should not hardcode the sensitive data like API Keys, 
//Secret Tokens, etc directly within the codebase (based on the Twelve factor App method). 
// We will pass them as environment variables. This module helps us to load environment variables from a .env file into process.env
require("dotenv").config();   // Require the dotenv

const app = express();  //Create new instance


// import the student model schema from another file
let StudentModel = require('./models/student');

// grades model
let GradeModel = require('./models/grade');

// setting up mongoose DB connection
mongoose
  .connect(process.env.MONGO_URL)   // read environment varibale from .env
  .then(() => {
    console.log("Database connection Success!");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

const PORT = process.env.PORT || 3000; //Declare the port number

app.use(express.json()); //allows us to access request body as req.body
app.use(morgan("dev"));  //enable incoming request logging in dev mode
 
//create an endpoint to get all students from the API
app.get('/students', (req, res, next) => {
    //very plain way to get all the data from the collection through the mongoose schema
    StudentModel.find((error, data) => {
        if (error) {
          //here we are using a call to next() to send an error message back
          return next(error)
        } else {
          res.json(data)
        }
      })
});

//delete a student by id
app.delete('/student/:id', (req, res, next) => {
    // mongoose will use _id of document
    // StudentModel.findByIdAndRemove(req.params.id, (error, data) => {
    //     if (error) {
    //       return next(error);
    //     } else {
    //       res.status(200).json({
    //         msg: data
    //       })
    //     }
    //   });

    //mongoose will use studentID of document
    StudentModel.findOneAndRemove({ studentID: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
        //  res.send('Student is deleted');
        }
      });
});

// endpoint that will create a student document
app.post('/student', (req, res, next) => {

    StudentModel.create(req.body, (error, data) => {
        if (error) {
          return next(error)
        } else {
          // res.json(data)
          res.send('Student is added to the database');
        }
    });
});

// endpoint for retrieving student by studentID
app.get('/student/:id', (req, res, next) => {
    // StudentModel.findById(req.params.id, (error, data) => {
    //     if (error) {
    //       return next(error)
    //     } else {
    //       res.json(data)
    //     }
    // });

    StudentModel.findOne({ studentID: req.params.id}, (error, data) => {
        if (error) {
            return next(error)
        } else if (data === null) {
            // Sending 404 when not found something is a good practice
          res.status(404).send('Student not found');
        }
        else {
          res.json(data)
        }
    });
});

// Updating - editing a student - we want to use PUT
app.put('/student/:id', (req, res, next) => {
    StudentModel.findOneAndUpdate({ studentID: req.params.id }, {
        $set: req.body
      }, (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.send('Student is edited via PUT');
          console.log('Student successfully updated!', data)
        }
      })
});

// endpoint that will create a student document
app.post('/grade', (req, res, next) => {
    GradeModel.create(req.body, (error, data) => {
        if (error) {
          return next(error)
        } else {
          // res.json(data)
          res.send('Grade has been added to the database');
        }
    });
});

// endpoint that will retrieve grades by student ID
app.get('/student-grade/:id', (req, res, next) => {
    GradeModel.find({ studentID: req.params.id }, (error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data);
        }
    });
});


app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) 
        err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});