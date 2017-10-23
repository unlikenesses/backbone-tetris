var app = app || {};

app.ControlsView = Backbone.View.extend({
  el: $("#controls"),

  events: {
    "click #pause": "pause",
    "click #mute": "mute"
  },

  pause: function() {
    app.events.trigger("pause");
  },

  mute: function() {
    app.events.trigger("mute");
  }
});
