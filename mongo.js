const commandLineArgs = require('command-line-args')
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
const optionDefinitions = [
    { name: 'name', type: String },
    { name: 'number', type: String }
  ]
const options = commandLineArgs(optionDefinitions)

const nameArg = options.name
const numberArg = options.number

// console.log(options)

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

    Person
    .find({})
    .then(result => {
        console.log("puhelinluettelo: ")

        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

const addNew = (personObj) => {
    mongoose.connect(url)

    return personObj.save().then(resp => {
        console.log(`lisätään henkilö ${personObj.name} numero ${personObj.number} luetteloon`)
        mongoose.connection.close()
      })
}


if (nameArg !== undefined && numberArg !== undefined) {

    const newPerson = new Person({
        name: nameArg,
        number: numberArg,
        id: genId()
    })

    // only if both arguments are defined, go ahead and store
    addNew(newPerson)
    
} else {
    getAll()
}