const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const genId = () => {
  // return persons.map(person => person.id).sort().reverse()[0] + 1
  return Math.ceil(Math.random()*100000000000000000000)
}

app.post('/api/persons', (req, res) => {

  if (req.body === undefined) {
    return res.status(400).json({error: 'HTTP POST request body missing!'})
  }

  const newId = genId()
  // console.log("New ID is: ", newId)

  mongoose.connect(url)

  const person = new Person{
    name: req.body.name,
    number: req.body.number,
    id: newId
  }

  person.save().then(resp => {
    console.log(`Saved person with ID ${newId}`)
    mongoose.connection.close()
  })



  // console.log("Persons array before:", persons)
  // console.log("Created person:", person)
  persons[persons.length] = person
  // console.log("Persons array after:", persons)
  
  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id )
  if (person && person.id === id) {
    res.json(person)
  } else {
    res.status(404).send('Person not found!')
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id )
  if (person && person.id === id) {
    persons = persons.filter(person => person.id !== id);
    res.status(204).send(`Person with id ${person.id} removed!`)
    console.log(persons)
  } else {
    res.status(404).send('Person not found!')
  }
})

const personCount = `puhelinluettelossa on ${persons.length} henkilön tiedot`
const reqTime = new Date();
const respHTML = `<p>${personCount}</p> <p>${reqTime}</p>`

app.get('/info', (req, res) => {
  res.send(respHTML)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})