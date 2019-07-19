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
  "location": "Yerevan"
}, 
{
  "email": "lilit@gmail.com",
  "firstName": "Lilit",
  "lastName": "Hovhannisyan",
  "password": "password",
  "learningTargets": [
    "Game Development",
    "Programming"
  ],
  "location": "Paris"
},
{
  "email": "azat@gmail.com",
  "firstName": "Azat",
  "lastName": "Harutyunyan",
  "password": "password",
  "learningTargets": [
    "Game Development",
    "Web Development",
    "Programming"
  ],
  "location": "Yerevan"
}
])

db.students.createIndex({ lastName: "text", firstName: "text", location: "text" })
db.students.createIndex({ learningTargets: 1})
