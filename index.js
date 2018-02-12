const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

app.use(express.static('build'))
app.use(bodyParser.json())

// app.use(morgan('tiny'))
morgan.token('bodyjson', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :bodyjson :status :res[content-length] - :response-time ms'))

app.use(cors())

const Persons = require('./persons')

// const formatPerson = (person) => {
//   return {
//     name: person.name,
//     number: person.number,
//     id: person.id
//   }
// }

app.get('/api/persons', (req, res) => {

  Persons.getAll().then(result => {
    res.json(result.map(Persons.Person.format))
  }).then(result => {
    mongoose.connection.close()
  })
})

app.post('/api/persons', (req, res) => {

  if (req.body === undefined) {
    return res.status(400).json({ error: 'Bad request: HTTP POST request body missing!' })
  }

  const newName = req.body.name
  const newNumber = req.body.number

  if (newName === undefined || newNumber === undefined) {

    res.status(400).json({ error: 'Bad request: missing name or number!' })

  } else {

    const existingPerson = Persons.find({name : newName}).then(results => {

      if (results.length > 0) {
        res.status(409).json({ error: 'Conflict: name must be unique' })
      } else {
        const newId = Persons.genId()

        const person = new Persons.Person({
          name: newName,
          number: newNumber,
          id: newId
        })
    
        person.save().then(resp => {
          console.log(`Saved person with ID ${newId}`)
        })
    
        // console.log("Persons array before:", persons)
        // console.log("Created person:", person)
        // persons[persons.length] = person
        // console.log("Persons array after:", persons)
    
        res.json(Persons.Person.format(person))
      }

      mongoose.connection.close()
    })
  }

})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  Persons.findOne(id).then(result => {
    console.log(id)
    console.log(result)

    if (result[0] && result[0].id === id) {
      res.json(Persons.Person.format(result[0]))
    } else {
      res.status(404).send('Person not found!')
    }

  }).then(result => {
    mongoose.connection.close()
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  Persons.deletePerson(id).then(result => {
    res.status(204).end()
  })
    .catch(error => {
      res.status(400).send({ error: 'Bad ID' })
    })
})

app.get('/info', (req, res) => {

  Persons.getAll().then(result => {

    const personCount = `puhelinluettelossa on ${result.length} henkilön tiedot`
    const reqTime = new Date()
    const respHTML = `<p>${personCount}</p> <p>${reqTime}</p>`
    res.send(respHTML)

  }).then(result => {
    mongoose.connection.close()
  })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})