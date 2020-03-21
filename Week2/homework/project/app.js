'use strict';

{
  const root = document.getElementById('root');
  const mainContainer = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorsContainer = document.querySelector(
    '.contributors-container',
  );
  const selectElement = document.querySelector('select');
  const ulRepo = createAndAppend('ul', repoContainer);
  const ulContributor = createAndAppend('ul', contributorsContainer);

  function fetchJSON(url) {
    return fetch(url)
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  function main(url) {
    fetchJSON(url)
      .then(repos => {
        repos.sort((a, b) => a.name.localeCompare(b.name));
        createOptionTab(repos);
      })
      .catch(err => callError(err));
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function createOptionTab(repos) {
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => {
        createAndAppend('option', selectElement, {
          value: repos.indexOf(repo),
          text: repo.name,
        });
      });
    selectElement.addEventListener('change', () => {
      ulRepo.innerHTML = '';
      ulContributor.innerHTML = '';
      renderRepoDetails(repos[selectElement.value], ulRepo);
      renderContributorDetails(repos[selectElement.value], ulContributor);
    });
    renderRepoDetails(repos[selectElement.value], ulRepo);
    renderContributorDetails(repos[selectElement.value], ulContributor);
  }

  function createRepoTable(header, description, item, link) {
    const repoBox = createAndAppend('div', item, { class: 'repo-item' });
    createAndAppend('h4', repoBox, { text: header });
    const repoDescription = createAndAppend('p', repoBox);
    if (header === 'Repository') {
      createAndAppend('a', repoDescription, {
        href: link,
        text: description,
      });
    } else {
      repoDescription.textContent = description;
    }
  }

  function renderRepoDetails(repo, ul) {
    const repoItem = createAndAppend('li', ul, {
      class: 'repo-liItem',
    });
    createRepoTable('Repository:', repo.name, repoItem);
    createRepoTable('Description:', repo.description, repoItem);
    createRepoTable('Forks:', repo.forks, repoItem);
    createRepoTable('Updated:', convertTime(repo.updated_at), repoItem);
  }

  function createContributorsTable(header, item) {
    const contributorBox = createAndAppend('div', item, {
      class: 'contributor-item',
    });
    createAndAppend('img', contributorBox, { src: header.avatar_url });
    createAndAppend('a', contributorBox, {
      href: header.html_url,
      text: header.login,
    });
    createAndAppend('span', contributorBox, { text: header.contributions });
  }

  function renderContributorDetails(elem, ul) {
    fetchJSON(elem.contributors_url)
      .then(res => {
        const contributorItem = createAndAppend('li', ul, {
          class: 'contributor-liItem',
        });
        res.forEach(item => {
          createContributorsTable(item, contributorItem);
        });
      })
      .catch(err => console.log(err));
  }

  function convertTime(time) {
    const dateTime = new Date(time);
    return dateTime.toLocaleString();
  }

  function callError(err) {
    mainContainer.style.display = 'none';
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
    return;
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
