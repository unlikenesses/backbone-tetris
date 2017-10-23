var app = app || {};

app.GridView = Backbone.View.extend({
  /* Add a landed block to the underlying grid */
  updateGrid: function(model) {
    var shape = model.get("shape");
    var x = model.get("x");
    var y = model.get("y");
    for (var shape_y = 0; shape_y < shape.length; shape_y++) {
      var row = shape[shape_y];
      for (var shape_x = 0; shape_x < row.length; shape_x++) {
        if (row[shape_x] == 1) {
          app.grid[y + shape_y][x + shape_x] = 1;
        }
      }
    }
  },

  /* Draw any blocks (landed) from the underlying grid */
  drawGrid: function() {
    for (var y = 0; y < app.grid.length; y++) {
      var row = app.grid[y];
      for (var x = 0; x < row.length; x++) {
        if (row[x] == 1) {
          var x_pos = x * app.blockSize;
          var y_pos = y * app.blockSize;
          app.context.fillStyle = "#FFFFFF";
          app.context.fillRect(x_pos, y_pos, app.blockSize, app.blockSize);
        }
      }
    }
  },

  /* Reset the underlying grid to 0 */
  clearGrid: function() {
    app.grid = [];
    for (var y = 0; y < app.height; y++) {
      var row = [];
      for (var x = 0; x < app.width; x++) {
        row.push(0);
      }
      app.grid.push(row);
    }
  },

  /* Print out the underlying grid */
  logGrid: function() {
    if (app.logging) {
      var html = "";
      for (var y = 0; y < app.grid.length; y++) {
        var row = app.grid[y];
        var str = "y: " + String("00" + y).slice(-2) + " | ";
        for (var x = 0; x < row.length; x++) {
          str += '<span class="grid';
          if (row[x] == 0) {
            str += "Off";
          } else {
            str += "On";
          }
          str += '">';
          str += row[x] + " ";
          str += "</span>";
        }
        str += "<br>";
        html += str;
      }
      $(".grid").html(html);
    }
  }
});
