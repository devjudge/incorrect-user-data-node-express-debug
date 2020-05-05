var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var db = require('./db_conn');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/student/subjects/all/', (req, res) => {
  var limit = req.query.limit;
  var offset = req.query.offset;

  resp = validate_existence(limit, 'Limit');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  resp = validate_existence(offset, 'Offset');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }
  
  get_student_subjects_paginated(limit, offset)
  .catch((err) => {
    res.status(500).json({
      'status': 'failure',
      'reason': 'Error occurred!'
    })  
  })
  .then((rows) => {
    if (rows && rows.length > 0) {
      var results = get_results(rows);

      return res.status(200).send(results);
    } else {
      return res.status(404).json({     
        'status': 'failure',   
        'message': 'No students found!'
      })
    }
  });
});


app.get('/api/student/subjects/filter', (req, res) => {
  var limit = req.query.limit;
  var offset = req.query.offset;
  var student_name_starts_with = req.query.student_name_starts_with

  resp = validate_existence(limit, 'Limit');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  resp = validate_existence(offset, 'Offset');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }

  resp = validate_existence(student_name_starts_with, 'Student name starts with');
  if (resp !== true) {
    return res.status(400).send({
      status: 'failure',
      reason: resp
    });
  }
  
  get_student_subjects_paginated(limit, offset, student_name_starts_with)
  .catch((err) => {
    res.status(500).json({
      'status': 'failure',
      'reason': 'Error occurred!'
    })  
  })
  .then((rows) => {
    if (rows && rows.length > 0) {
      var results = get_results(rows);

      return res.status(200).send(results);
    } else {
      return res.status(404).json({ 
        'status': 'failure',       
        'message': 'No students found!'
      })
    }
  });
});

var validate_existence = function(input, field_display_name) {  
  if (!input) {
    return field_display_name + ' is required';
  }
  return true;
};

var get_student_subjects_paginated = function(limit, offset, student_name_starts_with) {
  var where_clause = "";
  var params = [];
  if (student_name_starts_with) {
    where_clause = " WHERE st.name LIKE ? "; 
    params = [student_name_starts_with + '%', offset, limit];
  } else {
    params = [offset, limit];
  }
  const sql = `SELECT st.id as student_id, st.email, sub.id as subject_id, sub.name as subject_name from student st
  inner join student_subject_mapping ssm on st.id = ssm.student_id
  inner join subject sub on sub.id = ssm.subject_id`
  + where_clause + ` order by st.id LIMIT ?, ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, result) => {
      if (err) {
        console.log('Error running sql: ' + sql);
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
};

function get_results(rows) {
  var results = [];
  student_id_to_student_mapping = {};
  student_id_to_subject_mapping = {};

  for (let index = 0; index < rows.length; index++) {
    let row = rows[index];
    let student_id = row['student_id'];
    let email = row['email'];
    let subject_id = row['subject_id'];
    let subject_name = row['subject_name'];
    
    if (!student_id_to_student_mapping[student_id]) {
        student_id_to_student_mapping[student_id] = {
        id: student_id,
        email: email
      }
    }

    if (!student_id_to_subject_mapping[student_id]) {
      student_id_to_subject_mapping[student_id] = [{
        id: subject_id,
        name: subject_name
      }]
    } else {
      student_id_to_subject_mapping[student_id].push({
        id: subject_id,
        name: subject_name
      });
    }    
  }

  for (var student_id in student_id_to_student_mapping) {
    student = student_id_to_student_mapping[student_id];
    subjects = student_id_to_subject_mapping[student_id];
    var result = student;
    result['subjects'] = subjects;
    results.push(result);
  }
  return {
    results: results
  };
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
