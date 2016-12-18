import Ember from 'ember';
const { Component, computed, inject } = Ember;

export default Component.extend({
  project: inject.service(),

  entityName: null,
  entityType: null,
  forComponent: false,

  entity: computed('entityName', 'entityType', 'forComponent', function() {
    const name = this.get('entityName');
    const type = this.get('entityType');
    const forComponent = this.get('forComponent');
    if (!name) { return; }
    return this.get('project').entity({ name, type, forComponent });
  }),

  effectivePath: computed('path', 'project.{type,structure}', 'entity.fsPath', function() {
    const path = this.get('path');
    if (path) {
      return this.get('project.structureRules').fsPath(path)
    } else {
      return this.get('entity.fsPath');
    }
  })
});
