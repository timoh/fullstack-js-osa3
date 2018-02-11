/*

    This module handles interfacing with the MLab MongoDB database service
    with the help of the mongoose ORM/driver.

*/

const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.MONGODB_URI

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
  })

const genId = () => {
// return persons.map(person => person.id).sort().reverse()[0] + 1
return Math.ceil(Math.random()*100000000000000000000)
}

// console.log(newPerson)

const getAll = () => {
    mongoose.connect(url)
    return Person.find({})
}

const addNew = (personObj) => {
    mongoose.connect(url)

    return personObj.save().then(resp => {
        console.log(`lisätään henkilö ${personObj.name} numero ${personObj.number} luetteloon`)
        mongoose.connection.close()
      })
}

module.exports = {
    getAll: getAll,
    addNew: addNew,
    genId: genId,
    Person: Person
 }