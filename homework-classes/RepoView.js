'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
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

      function convertTime(time) {
        const dateTime = new Date(time);
        return dateTime.toLocaleString();
      }

      this.container.textContent = '';
      const ul = createAndAppend('ul', this.container);
      const repoItem = createAndAppend('li', ul, {
        class: 'repo-liItem',
      });
      createRepoTable('Repository:', repo.name, repoItem);
      createRepoTable('Description:', repo.description, repoItem);
      createRepoTable('Forks:', repo.forks, repoItem);
      createRepoTable('Updated:', convertTime(repo.updated_at), repoItem);
      console.log('RepoView', repo);
    }
  }

  window.RepoView = RepoView;
}
