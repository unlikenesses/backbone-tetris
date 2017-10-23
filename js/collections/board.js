var app = app || {};

app.Board = Backbone.Collection.extend({
  model: app.Block
});
