import express, { Request, Response, NextFunction } from 'express'

import cors from 'cors'

import { isUuid } from 'uuidv4'

const app = express()

app.use(express.json())
app.use(cors())

const repositories = [{
  // uuid: uuid(),
  uuid: 'cf3f743a-b73b-4db7-b5f9-9736eb423d2f',
  title: 'Challenge #1 on RocketSeat GoStack Bootcamp',
  url: 'https://github.com/celso-alexandre/gostack_desafio01',
  techs: ['Node.js'],
  likes: 0
}]

// console.log(uuid())

// MiddleWares
const validateNewRepository = (req: Request, res: Response, next: NextFunction): void => {
  const { uuid, likes } = req.body

  if (!isUuid(uuid)) {
    return res.status(400).json({ error: 'Uuid should be valid' })
  }

  if (!(likes === 0)) {
    return res.status(400).json({ error: 'Likes should be initialized as 0' })
  }

  return next()
}

app.get('/repositories', (req, res) => {
  return res.json(repositories)
})

app.post('/repositories', validateNewRepository, (req, res) => {
  const { uuid, title, url, techs, likes } = req.body

  repositories.push({
    uuid,
    title,
    url,
    techs,
    likes
  })

  return res.json(req.body)
})

app.put('/repositories/:uuid', (req, res) => {
  const { uuid } = req.params
  const { title, url, techs } = req.body

  let updatedRepo

  repositories.map(function (repo) {
    if (repo.uuid === uuid) {
      // If not passed, it assumes the pre-existent value
      repo.title = title || repo.title
      repo.url = url || repo.url
      repo.techs = techs || repo.techs

      updatedRepo = repo
    }
  })

  if (!updatedRepo) {
    return res.status(400).json({ error: 'Repository not found' })
  } else {
    return res.json(updatedRepo)
  }
})

app.delete('/repositories/:uuid', (req, res) => {
  const { uuid } = req.params

  let removedRepo

  repositories.filter(function (repo, index) {
    if (repo.uuid === uuid) {
      removedRepo = repositories.splice(index, 1)
    }
  })

  if (!removedRepo) {
    return res.status(400).json({ error: 'Repository not found' })
  } else {
    return res.json()
  }
})

app.post('/repositories/:uuid/like', (req, res) => {
  const { uuid } = req.params

  let updatedRepo

  repositories.map(function (repo) {
    if (repo.uuid === uuid) {
      repo.likes++
      updatedRepo = repo
    }
  })

  if (!updatedRepo) {
    return res.status(400).json({ error: 'Repository not found' })
  } else {
    return res.json(updatedRepo)
  }
})

export default app
