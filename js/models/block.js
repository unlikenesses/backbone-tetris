var app = app || {};

app.Block = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0
  },

  initialize: function() {
    var shape = this.get("shape");
    this.set("width", shape[0].length);
    this.set("height", shape.length);
  }
});
