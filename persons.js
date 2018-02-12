/*

    This module handles interfacing with the MLab MongoDB database service
    with the help of the mongoose ORM/driver.

*/

const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

personSchema.statics.format = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person.id
  }
}

const Person = mongoose.model('Person', personSchema)

const genId = () => {
  // return persons.map(person => person.id).sort().reverse()[0] + 1
  return Math.ceil(Math.random() * 100000000000000000000)
}

// console.log(newPerson)

const getAll = () => {
  mongoose.connect(url)
  return Person.find({})
}

const findOne = (personId) => {
  mongoose.connect(url)
  return Person.find({ id: personId })
}

const find = (conditionsObj) => {
  mongoose.connect(url)
  return Person.find(conditionsObj)
}

const addNew = (personObj) => {
  mongoose.connect(url)

  return personObj.save().then(resp => {
    console.log(`lisätään henkilö ${personObj.name} numero ${personObj.number} luetteloon`)
    mongoose.connection.close()
  })
}

const deletePerson = (personId) => {
  mongoose.connect(url)
  return Person.findOneAndRemove({ id: personId })
}

module.exports = {
  getAll: getAll,
  findOne: findOne,
  find: find,
  deletePerson: deletePerson,
  addNew: addNew,
  genId: genId,
  Person: Person
}