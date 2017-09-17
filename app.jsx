
var Cell = React.createClass({

	handleClick: function() {
		this.props.handleClick(this.props.index);
	},

	render: function() {
		return (
			<div className={"cell " + this.props.status} onClick={this.handleClick} ></div>
		);
	}
});

var ControlPanel = React.createClass({

	render: function() {
		return (
			<panel className="control">
				<label>Iteration</label>
				<label>{this.props.iteration}</label>
				<button disabled={this.props.running} onClick={this.props.handleStart}>Start</button>
				<button onClick={this.props.handlePause}>Pause</button>
				<button disabled={this.props.running} onClick={this.props.handleReset}>Reset Random</button>
				<button disabled={this.props.running} onClick={this.props.handleClear}>Clear</button>
			</panel>
		);
	}
});

var GameOfLife = React.createClass({

	getInitialState: function() {
		return {
			environment: this.getEnvironment(50, 70, true),
			running: false,
			iteration: 0
		}
	},

	handleStart: function() {
		this.setState({running: true});
		this.start();
	},

	handlePause: function() {
		this.setState({running: false});
	},

	handleReset: function() {
		this.setState(this.getInitialState);
	},

	handleClear: function() {
		this.setState({environment: this.getEnvironment(50, 70, false), iteration: 0});
	},

	handleCellClick(index) {
		this.setCellStatus(index, !this.getCellStatus(index));
		this.setState({environment: this.state.environment});
	},

	start: function() {
		var state = Object.assign({}, this.state);
		var env = state.environment;
		var nextStatus = [];
		var numberLiveNeighbours;
		setTimeout(function() {
			for (var i = 0; i < env.length; i++) {
				numberLiveNeighbours = 0;
				for (var j = 0; j < 8; j++) {
					numberLiveNeighbours += (this.getCellStatus(env[i][1][j]) ? 1 : 0);
				}
				if (env[i][2]) {
					nextStatus[i] = (numberLiveNeighbours >= 2 && numberLiveNeighbours <= 3);
				} else {
					nextStatus[i] = (numberLiveNeighbours == 3);
				}
			}
			for (var i = 0; i < env.length; i++) {
				env[i][2] = nextStatus[i];
			}
			this.setState({environment: env, iteration: ++state.iteration});
			if (this.state.running) {
				this.start();
			}
		}.bind(this), 200);
	},

	getCellStatus: function(index) {
		return this.state.environment[index][2];
	},

	setCellStatus: function(index, status) {
		this.state.environment[index][2] = status;
	},

	getRandom: function() {
	    return Boolean(Math.floor(Math.random() * 12));
	},

	getCellIndex: function(row, col) {
		return (row * 70) + col;
	},

	getEnvironment: function(rows, cols, useRandom) {
		var environment = [];
		for (var i = 0; i < rows; i++) {
			var nRow = (i == 0 ? rows - 1 : i - 1);
			var sRow = (i == rows - 1 ? 0 : i + 1);
			for(var j = 0; j < cols; j++) {
				var eCol = (j == cols - 1 ? 0 : j + 1);
				var wCol = (j == 0 ? cols - 1 : j - 1);
				environment.push([this.getCellIndex(i, j),
					this.getNeighbours(i, j, nRow, eCol, sRow, wCol), (useRandom ? !this.getRandom() : false)]);
			}
		}
		return environment;
	},

	getNeighbours: function(row, col, nRow, eCol, sRow, wCol) {
		var N = this.getCellIndex(nRow, col);
		var NE = this.getCellIndex(nRow, eCol);
		var E = this.getCellIndex(row, eCol);
		var SE = this.getCellIndex(sRow, eCol);
		var S = this.getCellIndex(sRow, col);
		var SW = this.getCellIndex(sRow, wCol);
		var W = this.getCellIndex(row, wCol);
		var NW = this.getCellIndex(nRow, wCol);
		return [N, NE, E, SE, S, SW, W, NW];
	},

	render: function() {
		var cells = this.state.environment.map(function(cell) {
			return <Cell status={cell[2] ? "alive" : "dead"}
				index={cell[0]}
				handleClick={this.handleCellClick} />;
		}.bind(this));
		var width = {width: 700};
		return (
			<div className="game-of-life">
				<panel className="board" style={width}>
					{cells}
				</panel>
				<ControlPanel iteration={this.state.iteration}
					handleStart={this.handleStart}
					handlePause={this.handlePause}
					handleReset={this.handleReset}
					handleClear={this.handleClear}
					running={this.state.running} />
			</div>
		);
	}
});

ReactDOM.render(<GameOfLife />, document.getElementById('app'));
