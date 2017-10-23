var app = app || {};

app.BoardView = Backbone.View.extend({
  el: $("canvas"),

  paused: false,

  muted: false,

  gameOver: false,

  /* Initialize board view */
  initialize: function() {
    gridView = new app.GridView();
    if (!app.logging) {
      var gridWidth = $("#gridContainer").width();
      var boardWidth = $("#board").width();
      $("#gridContainer").hide();
      $("#board").width(boardWidth - gridWidth - 60);
    }
    this.collection = new app.Board(app.blocks);
    gridView.clearGrid();
    gridView.logGrid();
    $(document).on("keydown", $.proxy(this.keyAction, this)); // http://stackoverflow.com/a/13379556/519497
    app.events.on("pause", this.pause, this);
    app.events.on("mute", this.mute, this);
    app.events.on("blockRendered", gridView.drawGrid, this);
    this.start();
  },

  /* Set up interval */
  start: function() {
    var self = this;
    clearInterval(app.interval);
    app.interval = setInterval(function() {
      self.descend();
      self.render();
    }, 800);
  },

  /* Render board */
  render: function() {
    this.collection.each(function(model) {
      var blockView = new app.BlockView({
        model: model
      });
    }, this);
  },

  /* Behaviour for when a block has landed */
  blockLanded: function(block) {
    this.updateGrid();
    this.checkGameOver(block);
    this.checkCompleteRows();
    this.clearCollection();
    this.spawnNewBlock();
  },

  /* Clear colletion of current block */
  clearCollection: function() {
    this.collection.reset();
  },

  /* Create a new block at random and add to collection */
  spawnNewBlock: function() {
    var shapePos = _.random(app.shapes.length - 1);
    this.collection.add([app.shapes[shapePos]]);
  },

  /* Dispatch key commands */
  keyAction: function(e) {
    var code = e.keyCode || e.which;
    if (!this.paused) {
      if (code == 37) {
        this.moveLeft();
      } else if (code == 39) {
        this.moveRight();
      } else if (code == 40) {
        this.moveDown();
      } else if (code == 38) {
        this.rotate();
      }
    }
    if (code == 80) {
      this.pause();
    }
    if (code == 78) {
      this.newGame();
    }
    if (code == 77) {
      this.mute();
    }
  },

  /* Pause or unpause game */
  pause: function() {
    this.paused = !this.paused;
    if (this.paused) {
      $("#pause").html("Unpause (p)");
      $("#message").html("Paused.");
      clearInterval(app.interval);
    } else {
      $("#pause").html("Pause (p)");
      $("#message").html("");
      this.start();
    }
  },

  /* Toggle mute */
  mute: function() {
    this.muted = !this.muted;
    if (this.muted) {
      $("#mute").html("Unmute (m)");
    } else {
      $("#mute").html("Mute (m)");
    }
  },

  /* Add a landed block to the underlying grid */
  updateGrid: function() {
    this.collection.each(function(model) {
      gridView.updateGrid(model);
      gridView.logGrid();
    }, this);
  },

  checkGameOver: function(block) {
    var blockY = block.get("y");
    if (blockY <= 0) {
      this.gameOver();
    }
  },

  gameOver: function() {
    gridView.drawGrid();
    this.playAudio("gameOver");
    clearInterval(app.interval);
    $("#message").html("GAME OVER!");
  },

  playAudio: function(key) {
    if (!this.muted) {
      var player = new Audio();
      player.src = jsfxr(app.sounds[key]);
      player.play();
    }
  },

  newGame: function() {
    this.start();
    this.playAudio("newGame");
    $("#message").html("");
    this.collection.reset();
    gridView.clearGrid();
    gridView.drawGrid();
    gridView.logGrid();
    this.spawnNewBlock();
  },

  /* Check to see if any rows are full */
  checkCompleteRows: function() {
    var completeRows = [];
    for (var y = 0; y < app.grid.length; y++) {
      var row = app.grid[y];
      var complete = true;
      for (var x = 0; x < row.length; x++) {
        if (row[x] != 1) {
          complete = false;
        }
      }
      if (complete) {
        completeRows.push(y);
      }
    }
    if (completeRows.length > 0) {
      this.clearCompleteRows(completeRows);
    } else {
      this.playAudio("land");
    }
  },

  /* Clear any complete rows from the grid and add a new clean row to the top */
  clearCompleteRows: function(completeRows) {
    this.playAudio("completeRow");
    for (var i = 0; i < completeRows.length; i++) {
      var rowIndex = completeRows[i];
      app.grid.splice(rowIndex, 1);
      var row = [];
      for (var x = 0; x < app.width; x++) {
        row.push(0);
      }
      app.grid.unshift(row);
    }
    gridView.logGrid();
  },

  /* Move a block left on keyboard input */
  moveLeft: function() {
    var self = this;
    this.collection.each(function(model) {
      var newX = model.get("x") - 1;
      if (
        model.get("x") > 0 &&
        self.shapeFits(model.get("shape"), newX, model.get("y"))
      ) {
        model.set("x", newX);
        self.playAudio("bluhp");
      }
    });
  },

  /* Move a block right on keyboard input */
  moveRight: function() {
    var self = this;
    this.collection.each(function(model) {
      var newX = model.get("x") + 1;
      if (
        model.get("x") + model.get("width") < app.width &&
        self.shapeFits(model.get("shape"), newX, model.get("y"))
      ) {
        model.set("x", newX);
        self.playAudio("bluhp");
      }
    });
  },

  /* Move a block down on keyboard input */
  moveDown: function() {
    var self = this;
    this.collection.each(function(model) {
      var newY = model.get("y") + 1;
      if (
        model.get("y") + model.get("height") < app.height &&
        self.shapeFits(model.get("shape"), model.get("x"), newY)
      ) {
        model.set("y", newY);
        self.playAudio("bluhp");
      }
    });
  },

  /* Automatically move a block down one step */
  descend: function() {
    var self = this;
    this.collection.each(function(model) {
      if (
        model.get("y") + model.get("height") < app.height &&
        self.shapeFits(model.get("shape"), model.get("x"), model.get("y") + 1)
      ) {
        model.set("y", model.get("y") + 1);
      } else {
        self.blockLanded(model);
      }
    });
  },

  /* Check if a given shape is within the bounds of the play area */
  shapeWithinBounds: function(shape, x, y) {
    if (x < 0) {
      return false;
    }
    if (x + shape[0].length > app.width) {
      return false;
    }
    return true;
  },

  /* Check if a shape fits in the play area and with the other blocks */
  rotatedShapeFits: function(shape, x, y) {
    return this.shapeFits(shape, x, y) && this.shapeWithinBounds(shape, x, y);
  },

  /* Rotate a block */
  rotate: function() {
    var self = this;
    this.collection.each(function(model) {
      // Method 1: (from http://stackoverflow.com/a/34164786)
      // Transpose the shape matrix (from http://stackoverflow.com/a/17428779):
      var transposed = _.zip.apply(_, model.get("shape"));
      var reversed = transposed.reverse();
      if (self.rotatedShapeFits(reversed, model.get("x"), model.get("y"))) {
        model.set("shape", reversed);
        var shape = model.get("shape");
        model.set("width", shape[0].length);
        model.set("height", shape.length);
        self.playAudio("bluhp");
      }
    });
  },

  /* Check if a block collides with landed blocks */
  shapeFits: function(shape, shapeX, shapeY) {
    for (var y = 0; y < shape.length; y++) {
      var row = shape[y];
      for (var x = 0; x < row.length; x++) {
        if (row[x] == 1) {
          var checkX = shapeX + x;
          var checkY = shapeY + y;
          if (app.grid[checkY][checkX] == 1) {
            return false;
          }
        }
      }
    }
    return true;
  }
});
