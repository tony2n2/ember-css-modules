import Ember from 'ember';

const { Component, computed } = Ember;
const { htmlSafe } = Ember.String;
const { Prism } = window;

export default Component.extend({
  source: '',
  filename: null,

  language: computed('filename', function() {
    const name = this.get('filename') || '';
    const extension = name.substring(name.lastIndexOf('.') + 1);
    switch (extension) {
      case 'hbs': return 'handlebars';
      case 'css': return 'css';
      default: return 'javascript';
    }
  }),

  highlighted: computed('source', 'language', function() {
    const source = this.get('source') || '';
    const grammar = Prism.languages[this.get('language')];
    const highlighted = Prism.highlight(source, grammar);
    return htmlSafe(highlighted);
  })
});
