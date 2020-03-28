'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      this.container.innerHTML = '';
      const ulContributor = createAndAppend('ul', this.container);
      createContributorsTable(contributors);
      function createContributorsTable(header) {
        console.log(header);
        header.forEach(elem => {
          const ulCont = createAndAppend('li', ulContributor, {
            class: 'contributor-item',
          });
          createAndAppend('img', ulCont, { src: elem.avatar_url });
          createAndAppend('a', ulCont, {
            href: elem.html_url,
            text: elem.login,
          });
          createAndAppend('span', ulCont, { text: elem.contributions });
        });
      }

      console.log('ContributorsView', contributors);
    }
  }

  window.ContributorsView = ContributorsView;
}
