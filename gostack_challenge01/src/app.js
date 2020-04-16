const express = require('express');

const cors = require('cors');

const { uuid: generateUuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [
  {
    id: 'cf3f743a-b73b-4db7-b5f9-9736eb423d2f',
    title: 'Challenge #1 on RocketSeat GoStack Bootcamp',
    url: 'https://github.com/celso-alexandre/gostack_challanges/gostack_challange01',
    techs: ['Node.js'],
    likes: 0,
  },
  {
    id: '96ca6605-206b-4e62-9824-92ff1ee3458a',
    title: 'Challenge #2 on RocketSeat GoStack Bootcamp',
    url: 'https://github.com/celso-alexandre/gostack_challanges/gostack_challange02',
    techs: ['Node.js', 'ReactJS'],
    likes: 0,
  },
];

// MiddleWares
const validateNewRepository = (req, res, next) => {
  req.body.id ? true : (req.body.id = generateUuid());

  if (!isUuid(req.body.id)) {
    return res.status(400).json({ error: 'Uuid should be valid' });
  }

  req.body.likes ? true : (req.body.likes = 0);

  if (!(req.body.likes === 0)) {
    return res.status(400).json({ error: 'Likes should be initialized as 0' });
  }

  return next();
};

app.get('/repositories', (req, res) => {
  return res.json(repositories);
  console.log(respositories);
});

app.post('/repositories', validateNewRepository, (req, res) => {
  const { id, title, url, techs, likes } = req.body;

  const newRepo = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories.push(newRepo);

  return res.json(newRepo);
  console.log(repositories);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  let updatedRepo;

  repositories.map(function (repo) {
    if (repo.id === id) {
      // If not passed, it assumes the pre-existent value
      repo.title = title || repo.title;
      repo.url = url || repo.url;
      repo.techs = techs || repo.techs;

      updatedRepo = repo;
    }
  });

  if (!updatedRepo) {
    return res.status(400).json({ error: 'Repository not found' });
    console.warn('Repository not found');
  } else {
    return res.json(updatedRepo);
    console.log(repositories);
  }
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  let removedRepo;

  repositories.filter(function (repo, index) {
    if (repo.id === id) {
      removedRepo = repositories.splice(index, 1);
    }
  });

  if (!removedRepo) {
    return res.status(400).json({ error: 'Repository not found' });
    console.warn('Repository not found');
  } else {
    return res.json();
    console.log(repositories);
  }
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  let updatedRepo;

  repositories.map(function (repo) {
    if (repo.id === id) {
      repo.likes++;
      updatedRepo = repo;
    }
  });

  if (!updatedRepo) {
    return res.status(400).json({ error: 'Repository not found' });
    console.warn('Repository not found');
  } else {
    return res.json(updatedRepo);
    console.log(repositories);
  }
});

module.exports = app;
