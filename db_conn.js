var path = require('path');
const sqlite3 = require("sqlite3").verbose();
var fs = require('fs');

const db_name = path.resolve(__dirname, "data", "students.db");
var folder_name = __dirname + "/data";
if (!fs.existsSync(folder_name)) {
  fs.mkdirSync(folder_name);
}

const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'students.db'");
});


const sql_delete_student = `DROP TABLE IF EXISTS student`;

const sql_create_student = `CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(10) NOT NULL    
)`;

const sql_add_students = `INSERT INTO student(name, email, password) 
VALUES
('student_1', 'student_1@gmail.com', 'student_1@123'),
('student_2', 'student_2@gmail.com', 'student_2@123'),
('student_3', 'student_3@gmail.com', 'student_3@123'),
('student_4', 'student_4@gmail.com', 'student_4@123'),
('student_5', 'student_5@gmail.com', 'student_5@123'),
('student_6', 'student_6@gmail.com', 'student_6@123'),
('student_7', 'student_7@gmail.com', 'student_7@123'),
('student_8', 'student_8@gmail.com', 'student_8@123'),
('student_9', 'student_9@gmail.com', 'student_9@123'),
('student_10', 'student_10@gmail.com', 'student_10@123'),
('student_11', 'student_11@gmail.com', 'student_11@123'),
('student_12', 'student_12@gmail.com', 'student_12@123'),
('student_13', 'student_13@gmail.com', 'student_13@123'),
('student_14', 'student_14@gmail.com', 'student_14@123'),
('student_15', 'student_15@gmail.com', 'student_15@123'),
('student_16', 'student_16@gmail.com', 'student_16@123'),
('student_17', 'student_17@gmail.com', 'student_17@123'),
('student_18', 'student_18@gmail.com', 'student_18@123'),
('student_19', 'student_19@gmail.com', 'student_19@123'),
('student_20', 'student_20@gmail.com', 'student_20@123')`;

const sql_delete_subject = `DROP TABLE IF EXISTS subject`;

const sql_create_subject = `CREATE TABLE IF NOT EXISTS subject (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL  
);`;

const sql_add_subjects = `INSERT INTO subject(name) 
VALUES
('subject_1'),
('subject_2'),
('subject_3'),
('subject_4'),
('subject_5')`;

const sql_delete_student_subject_mapping = `DROP TABLE IF EXISTS student_subject_mapping`;

const sql_create_student_subject_mapping = `CREATE TABLE IF NOT EXISTS student_subject_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INT NOT NULL,
  subject_id INT NOT NULL  
);`;

const sql_add_student_subject_mappings = `INSERT INTO student_subject_mapping(student_id, subject_id) 
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 2),
(2, 4),
(2, 5),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(4, 1),
(4, 2),
(5, 1),
(5, 3),
(6, 4),
(6, 5),
(7, 1),
(7, 3),
(8, 2),
(8, 4),
(9, 3),
(9, 5),
(10, 2),
(10, 5),
(11, 1),
(12, 2),
(13, 1),
(14, 2),
(15, 3),
(16, 4),
(16, 5),
(17, 1),
(17, 3),
(18, 3),
(19, 4),
(20, 5)`;


db.run(sql_delete_student, err => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Successfully deleted student table');
  db.run(sql_create_student, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'student' table");
  
    db.run(sql_add_students, err => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Added records to the 'student' table");

      db.run(sql_delete_subject, err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Successfully deleted subject table');

        db.run(sql_create_subject, err => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Successful creation of the 'subject' table");
          db.run(sql_add_subjects, err => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Added records to the 'subject' table");  
            
            db.run(sql_delete_student_subject_mapping, err => {
              if (err) {
                return console.error(err.message);
              }
              console.log("Successfully deleted user_subject_mapping table");
              
              db.run(sql_create_student_subject_mapping, err => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Successful creation of the 'user_subject_mapping' table");
                db.run(sql_add_student_subject_mappings, err => {
                  if (err) {
                    return console.error(err.message);
                  }
                  console.log("Added records to the 'user_subject_mapping' table");
                });
              });
            });                        
          });
        });
      });
    });
  });
});

module.exports = db;