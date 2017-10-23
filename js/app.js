var app = app || {};

app.boot = function() {
  app.canvas = document.querySelector("canvas");

  app.context = app.canvas.getContext("2d");

  app.context.shadowColor = "white";

  app.context.shadowBlur = 15;

  app.blockSize = 20;

  app.logging = true;

  app.width = app.canvas.width / app.blockSize;

  app.height = app.canvas.height / app.blockSize;

  app.events = _.extend({}, Backbone.Events);

  // Sounds produced with http://www.superflashbros.net/as3sfxr/
  // and played in JS with https://github.com/mneubrand/jsfxr
  // Thanks to this post for info: http://codepen.io/jackrugile/post/arcade-audio-for-js13k-games
  app.sounds = {
    bluhp: [
      2,
      0.01,
      0.13,
      0.49,
      0.33,
      0.31,
      0.06,
      0.02,
      -0.9,
      0.05,
      0.51,
      0.08,
      0.08,
      0.1062,
      0.491,
      0.12,
      -0.64,
      -0.5566,
      0.68,
      -0.5,
      0.24,
      0.29,
      0.12,
      0.3
    ],
    newGame: [
      2,
      ,
      0.19,
      0.67,
      0.6034,
      0.35,
      ,
      -0.02,
      ,
      0.49,
      0.62,
      0.0382,
      ,
      0.6885,
      -0.0552,
      0.03,
      -0.74,
      0.0058,
      0.23,
      0.1399,
      0.01,
      0.09,
      0.06,
      0.25
    ],
    land: [
      2,
      ,
      0.103,
      ,
      0.3933,
      0.4497,
      0.0299,
      0.0561,
      -0.0534,
      0.4388,
      0.0143,
      -0.3671,
      0.2831,
      0.8169,
      -0.133,
      0.7848,
      -0.0841,
      -0.5874,
      0.9552,
      -0.129,
      0.4723,
      0.1745,
      -0.0226,
      0.2
    ],
    completeRow: [
      0,
      0.0007,
      0.3015,
      0.5485,
      0.39,
      0.5029,
      ,
      0.7037,
      0.3194,
      ,
      ,
      0.665,
      0.228,
      0.3467,
      0.05,
      0.5698,
      -0.1913,
      -0.0563,
      0.3286,
      -0.0055,
      ,
      0.4958,
      0.0814,
      0.5
    ],
    gameOver: [
      2,
      0.0009,
      0.41,
      0.0873,
      0.6029,
      0.36,
      ,
      -0.0999,
      -0.0799,
      ,
      -0.4843,
      -0.0152,
      ,
      -0.617,
      -0.0004,
      -0.6454,
      -0.12,
      0.4399,
      0.59,
      0.1799,
      0.21,
      0.15,
      -0.24,
      0.5
    ]
  };

  app.pointsPerLine = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200
  };

  app.shapes = [
    {
      shape: [[0, 1, 0], [1, 1, 1]]
    },
    {
      shape: [[0, 1, 1], [1, 1, 0]]
    },
    {
      shape: [[1, 1, 0], [0, 1, 1]]
    },
    {
      shape: [[1], [1], [1], [1]]
    },
    {
      shape: [[1, 1], [1, 1]]
    },
    {
      shape: [[1, 1], [1, 0], [1, 0]]
    },
    {
      shape: [[1, 1], [0, 1], [0, 1]]
    }
  ];

  var shapePos = _.random(app.shapes.length - 1);
  app.blocks = [app.shapes[shapePos]];

  app.boardView = new app.BoardView();

  // Controls:
  new app.ControlsView();
};
