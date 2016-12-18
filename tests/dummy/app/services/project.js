import Ember from 'ember';
const { Service, computed, get } = Ember;
const { pluralize } = Ember.String;

export default Service.extend({
  // Either 'classic' or 'pods' (or, in the future, 'modules')
  structure: 'classic',

  // Either 'app' or 'addon'
  type: 'app',

  // The configured name of the app or addon
  name: computed('type', function() {
    return `my-${this.get('type')}`;
  }),

  entity({ name, type, forComponent }) {
    return ProjectEntity.create({ name, type, forComponent, project: this });
  },

  structureRules: computed('structure', function() {
    switch (this.get('structure')) {
      case 'pods': return PodStructure.create({ project: this });
      default: return ClassicStructure.create({ project: this });
    }
  })
});

const ProjectEntity = Ember.Object.extend({
  extension: computed('type', function() {
    switch (this.get('type')) {
      case 'template': return 'hbs';
      case 'styles': return 'css';
      default: return 'js';
    }
  }),

  fsPath: computed('name', 'type', 'project.{structure,type}', function() {
    const details = this.getProperties('name', 'type', 'extension', 'forComponent');
    return this.get('project.structureRules').fsEntityPath(details);
  }),

  modulePath: computed('name', 'type', 'project.structureRules', function() {
    const details = this.getProperties('name', 'type', 'extension', 'forComponent');
    return this.get('project.structureRules').moduleEntityPath(details);
  })
});

const PodStructure = Ember.Object.extend({
  fsPath(path) {
    return `${get(this, 'project.type')}/${path}`;
  },

  fsEntityPath(entity) {
    return this.fsPath(this._entityPath(entity));
  },

  modulePath(path) {
    return `${get(this, 'project.name')}/${path}`;
  },

  moduleEntityPath(entity) {
    return this.modulePath(this._entityPath(entity));
  },

  componentImport(type) {
    return `./${type}`;
  },

  _entityPath({ name, type, extension, forComponent }) {
    let base = name;
    if (forComponent) {
      base = `components/${base}`;
    }
    return `${base}/${type}.${extension}`;
  }
});

const ClassicStructure = Ember.Object.extend({
  fsPath(path) {
    return `${get(this, 'project.type')}/${path}`;
  },

  fsEntityPath(entity) {
    return this.fsPath(this._entityPath(entity));
  },

  modulePath(path) {
    return `${get(this, 'project.name')}/${path}`;
  },

  moduleEntityPath(entity) {
    return this.modulePath(this._entityPath(entity));
  },

  componentImport(type, name) {
    return this.modulePath(`${pluralize(type)}/${name}`);
  },

  _entityPath({ name, type, extension, forComponent }) {
    let base = pluralize(type);
    if (forComponent) {
      base = `${base}/components`;
    }
    return `${base}/${name}.${extension}`;
  }
});
