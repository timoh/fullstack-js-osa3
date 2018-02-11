const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

const Persons = require('./persons');

app.get('/api/persons', (req, res) => {

  Persons.getAll().then(result => {
      res.json(result) 
  }).then(result => {
      mongoose.connection.close()
  })
})

app.post('/api/persons', (req, res) => {

  if (req.body === undefined) {
    return res.status(400).json({error: 'HTTP POST request body missing!'})
  }

  const person = new Persons.Person({
    name: req.body.name,
    number: req.body.number,
    id: Persons.genId()
  })

  person.save().then(resp => {
    console.log(`Saved person with ID ${newId}`)
    mongoose.connection.close()
  })

  // console.log("Persons array before:", persons)
  // console.log("Created person:", person)
  // persons[persons.length] = person
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

app.get('/info', (req, res) => {
  const personCount = `puhelinluettelossa on ${persons.length} henkilön tiedot`
  const reqTime = new Date();
  const respHTML = `<p>${personCount}</p> <p>${reqTime}</p>` 
  res.send(respHTML)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})