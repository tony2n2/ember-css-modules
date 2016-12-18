import Ember from 'ember';

const { Component, computed, inject } = Ember;
const { capitalize } = Ember.String;

export default Component.extend({
  project: inject.service(),
  entityName: null,
  entityType: null,
  content: '',

  imports: computed('project.{name,type,structure}', 'entityName', 'entityType', function() {
    const name = this.get('entityName');
    const imports = [`import Ember from 'ember';`];

    if (this.get('project.type') === 'addon') {
      const structure = this.get('project.structureRules');
      if (this.get('entityType') === 'component') {
        imports.push(`import layout from '${structure.componentImport('template', name)}';`);
      }
      imports.push(`import styles from '${structure.componentImport('styles', name)}';`)
    }

    return imports;
  }),

  className: computed('entityType', function() {
    return capitalize(this.get('entityType'));
  }),

  actions: {
    updateContent(content) {
      this.set('content', content.split('\n').map(line => `  ${line}`).join('\n'));
    }
  }
});
