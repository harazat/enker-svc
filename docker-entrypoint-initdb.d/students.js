db.students.remove({});
db.students.insertMany([{
  "email": "mesrobk@gmail.com",
  "firstName": "Mesrob",
  "lastName": "Kyurkchyan",
  "password": "password",
  "learningTargets": [
    "Animation",
    "Game Development",
    "Filmmaking"
  ],
  "location": "Stepanakert"
}, {
  "email": "marianna.zakiyan@tumo.org",
  "firstName": "Marianna",
  "lastName": "Zakiyan",
  "password": "password",
  "learningTargets": [
    "Game Development",
  ],
  "location": "Gyumri"
}, {
  "email": "astghik.hambardzumyan@tumo.org",
  "firstName": "Astghik",
  "lastName": "Hambardzumyan",
  "password": "password",
  "learningTargets": [
    "Filmmaking"
  ],
  "location": "Yerevan"
}
])

db.students.createIndex({ lastName: "text", firstName: "text", location: "text" })
db.students.createIndex({ learningTargets: 1})
