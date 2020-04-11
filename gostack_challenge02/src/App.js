/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';

import './styles.css';
import api from './services/api';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState([]);
  const [url, setUrl] = useState([]);
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    api.get('repositories', {}).then((res) => {
      setRepositories(res.data);
    });
  }, []);

  async function handleAddRepository(e) {
    e.preventDefault();

    // setTechs(techs.replace(', ', ','));
    // const techsArray = techs.split(',');

    const data = {
      title,
      url,
      // techs: techsArray,
      techs,
    };

    try {
      const { data: newRepo } = await api.post('repositories', data);

      setRepositories([...repositories, newRepo]);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);

      setRepositories(repositories.filter((repo) => repo.id !== id));
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }

  return (
    <div>
      <ul data-testid='repository-list'>
        {repositories.map((repo) => (
          <li key={repo.id}>
            <a target='_blank' rel='noopener noreferrer' href={repo.url}>
              {repo.title}
            </a>
            <br />
            <ol>
              &nbsp;Techs:&nbsp;
              {repo.techs.map((tech) => (
                <strong key={tech}>{tech}&nbsp;</strong>
              ))}
            </ol>

            <button
              type='button'
              onClick={() => handleRemoveRepository(repo.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
      <strong>Add Repository</strong>
      <br />
      &nbsp;Title&nbsp;
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      &nbsp;Url&nbsp;
      <input type='text' value={url} onChange={(e) => setUrl(e.target.value)} />
      &nbsp;Techs&nbsp;
      <input
        type='text'
        value={techs}
        onChange={(e) => setTechs(e.target.value)}
      />
      <button type='button' onClick={(e) => handleAddRepository(e)}>
        Adicionar
      </button>
    </div>
  );
}

export default App;
