import Ember from 'ember';

const { Component, computed, inject } = Ember;

export default Component.extend({
  project: inject.service(),

  path: computed('project.type', function() {
    if (this.get('project.type') === 'addon') {
      return 'index.js';
    } else {
      return 'ember-cli-build.js';
    }
  }),

  actions: {
    updateContent(content) {
      this.set('content', content.split('\n').map(line => `      ${line}`).join('\n'));
    }
  }
});
