var app = app || {};

app.BlockView = Backbone.View.extend({

	initialize: function(){
		var self = this;
		this.render();
		this.model.on('change', _.bind(this.render, this));
	},

	render: function(){
		this.clearCanvas();
		var self = this;
		var shape = this.model.get('shape');
		var x_pos = this.model.get('x') * app.blockSize;
		var y_pos = this.model.get('y') * app.blockSize;
		for (var y = 0; y < shape.length; y++) {
			var row = shape[y];
			for (var x = 0; x < row.length; x++) {
				if (row[x] == 1) {
					self.stamp(x_pos + (x * app.blockSize), y_pos + (y * app.blockSize));
				}
			}
		}
		app.events.trigger('blockRendered');
		return this;
	},

	clearCanvas: function() {
		app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);

	},

	stamp: function(x, y) {
		app.context.beginPath();
		app.context.rect(x, y, app.blockSize, app.blockSize);
		app.context.lineWidth = 1;
		app.context.strokeStyle = 'white';
		app.context.stroke();
	}

});
