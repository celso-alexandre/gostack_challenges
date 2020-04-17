const express = require('express')

const app = express()
app.use(express.json())

let requisitionCount = 0
const projects = []

app.use((req, res, next) => {
  requisitionCount++
  console.log(`Requisição Nº ${requisitionCount}`)
  next()
})

function validateExistingProject(req, res, next) {
  const { id } = req.body
  if (projects[id]) {
    return res.status(400).json({ error: 'Project already exists'})
  }
  return next()
}

function validateNonExistingProject(req, res, next) {
  const { id } = req.params
  if (!projects[id]) {
    return res.status(400).json({ error: 'Project does not exists'})
  }
  return next()
}

app.post('/projects', validateExistingProject, (req, res, next) => {  
  const { id } = req.body
  projects[id] = req.body
  return res.json(projects)
})

app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.put('/projects/:id', validateNonExistingProject, (req, res) => {
  const { title } = req.body
  const { id } = req.params

  projects[id].title = title
  return res.json(projects[id])
})

app.delete('/projects/:id', validateNonExistingProject, (req, res, next) => {
  const { id } = req.params
  projects.splice(id, 1)

  return res.send()
})

app.post('/projects/:id/tasks', validateNonExistingProject, (req, res, next) => {  
  const { title } = req.body
  const { id } = req.params
  projects[id].tasks.push(title)
  return res.json(projects[id])
})

app.listen(3333)