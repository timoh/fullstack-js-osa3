/*  

    This file handles the command line interface (CLI) of the 
    Person model with Mongoose.

    NOTE: refactored codebase to have the Person schema and 
    Mongoose stuff in its own file 

*/

const Persons = require('./persons');

const commandLineArgs = require('command-line-args')
require('dotenv').config()

const url = process.env.MONGODB_URI
const optionDefinitions = [
  { name: 'name', type: String },
  { name: 'number', type: String }
]
const options = commandLineArgs(optionDefinitions)

const nameArg = options.name
const numberArg = options.number

if (nameArg !== undefined && numberArg !== undefined) {
  // only if both arguments are defined, go ahead and store

  const newPerson = new Persons.Person({
    name: nameArg,
    number: numberArg,
    id: Persons.genId()
  })

  Persons.addNew(newPerson)
} else {
  Persons.getAll().then(result => {
    console.log("puhelinluettelo: ")

    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    }).then(result => {
      mongoose.connection.close()
    })
  })
}