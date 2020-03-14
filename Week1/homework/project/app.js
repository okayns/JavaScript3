'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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

  function createRepoSection(header, content, item, link) {
    const repoBox = createAndAppend('div', item, {
      class: 'repo-item-box',
    });
    createAndAppend('h3', repoBox, { text: header });
    const contentElement = createAndAppend('p', repoBox);
    if (header === 'Repository:') {
      createAndAppend('a', contentElement, {
        href: link,
        text: content,
      });
    } else {
      contentElement.textContent = content;
    }
  }

  function renderRepoDetails(repo, ul) {
    const repoItem = createAndAppend('li', ul, {
      class: 'repo-item',
    });
    createRepoSection('Repository:', repo.name, repoItem, repo.html_url);
    createRepoSection('Description:', repo.description, repoItem);
    createRepoSection('Forks:', repo.forks, repoItem);
    createRepoSection('Updated:', convertTime(repo.updated_at), repoItem);
  }

  function convertTime(time) {
    const dateTime = new Date(time);
    return dateTime.toLocaleString();
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root, { id: 'main' });
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
