import Ember from 'ember';
const { Component, inject } = Ember;

export default Component.extend({
  localClassNames: ['component'],

  project: inject.service(),

  jsEntityType: 'component'
});
