const express = require('express')

const server = express()
server.use(express.json())

//Query params = ?teste=1
//Route params = /users/1
//Request body = { name: 'celso alexandre', idade: 25 }

var users = ['Diego', 'Teste', 'Victor']

function verifyUserExists(req, res, next){
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: 'User name not found on request body'})
  }
  return next()
}

function validateUserIndex(req, res, next){
  const { index } = req.params
  /*const usersLastPosition = users.length - 1
  if (index < 0 || index > usersLastPosition || !index){*/
  if (!users[index]){
    return res.status(400).json({ error: 'User identification does not exist'})
  }
  req.user = users[index]
  return next()
}

server.use((req, res, next) => {
  console.log(`Método: ${req.method}, URL: ${req.url}`)
  return next()
})

server.post('/users', verifyUserExists, (req, res) => {
  //console.log(req.body)
  const { name } = req.body
  users.push(name)
  return res.json(users)
})

server.put('/users/:index', validateUserIndex, verifyUserExists, (req, res) => {
  const { index } = req.params
  const { name } = req.body
  users[index] = name
  return res.json(users)
})

server.delete('/users/:index', validateUserIndex, (req, res) => {
  const { index } = req.params
  users.splice(index,1)
  return res.send()
})

server.get('/users', (req, res) => {  
  return res.json(users)
})

server.get('/users/:index', validateUserIndex, (req, res) => {
  return res.json(req.user)
})

server.listen(3000)