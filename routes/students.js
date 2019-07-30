var express = require('express');
var router = express.Router();
var passport = require('passport');

var db = require('../db');

/* Get a single student: req.user.username */
router.get('/students/:email', passport.authenticate('basic', { session: false }),
  function(req, res, next) {
    db.getClient().collection("students").findOne({email: req.params.email},
      function(err, results) {
        if (err) {
          res.status(500).send({ error: err.message});
        } else if (!results) {
          res.status(400).send({error: 'Student does not exists'});
        } else {
          res.send(results);
        }
      });
});

/* Create a student account */
router.post('/students', function(req, res, next) {
  const student = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    learningTargets: req.body.learningTargets,
    location: req.body.location
  };
  db.getClient().collection("students").findOne({email: student.email},
    function(err, results) {
      if (results) {
        res.status(400).send({error: 'Student ' + student.email + ' already exists!'});
      } else {
        db.getClient().collection("students").insertOne(student, function(err, r) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.send(student);
          }
        })
      }
    });
});

/* Update a student account */
router.put('/students/:email', passport.authenticate('basic', { session: false }),
  function(req, res, next) {
    db.getClient().collection("students").findOneAndUpdate({email: req.params.email}, {$set: req.body}, {returnOriginal: false},
      function(err, results) {
        if (err) {
          res.status(500).send(err);
        }
        else if(results.value == null) {
          res.status(400).send({error: "Student with email " + req.params.email  + " does not exist."})
        } else {
          res.send(results.value);
        }
      });
});

/* Search for a student  */
router.get('/students/', passport.authenticate('basic', { session: false }),
  function(req, res, next) {
    const query = {}
    if (req.query) {
      Object.keys(req.query).forEach(q => {
        if (q == "learningTargets") {
          query[q] = { $all: JSON.parse(req.query[q]) }
        } else {
          query[q] = req.query[q]
        }
      });
      console.log(query);
    }
    db.getClient().collection("students").find(query).toArray(function(err, results) {
        if (err) {
          res.status(500).send(err);        
        } else {
          res.send(results);
        }
      });
  });

module.exports = router;
