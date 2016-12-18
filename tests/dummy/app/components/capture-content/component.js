import Ember from 'ember';
const { Component, run } = Ember;

export default Component.extend({
  localClassNames: ['component'],

  yield: null,
  unindent: true,

  _capture() {
    let content = this.$().text();
    if (this.get('unindent')) {
      content = unindent(content);
    }
    this.get('update')(content);
  },

  didReceiveAttrs() {
    run.schedule('afterRender', this, '_capture');
  }
}).reopenClass({
  positionalParams: 'triggers'
});

function unindent(str) {
  const lines = str.split('\n');
  let min = Infinity;
  lines.forEach((line) => {
    if (!/^\s*$/.test(line)) {
      min = Math.min(min, /^\s*/.exec(line)[0].length);
    }
  });
  return lines.map(line => line.substring(min)).join('\n').trim();
}
