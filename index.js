const express = require('express')
const app = express()

const persons = [
  {
    name: "Arto Hellas",
    number: "040123123",
    id: 1
  }, 
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  }, 
  {
    name: "Arto Järvinen",
    number: "040123123",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040123123",
    id: 4
  }
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const personCount = `puhelinluettelossa on ${persons.length} henkilön tiedot`
const reqTime = new Date();
const respHTML = `<p>${personCount}</p> <p>${reqTime}</p>`

app.get('/info', (req, res) => {
  res.send(respHTML)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})