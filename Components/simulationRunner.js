import React from '../node_modules/react';
import tickParser from '../util/tickParser.js';

class SimulationContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		//buttons
		//graph
		var simButtons, simTitleText, dataButtons;
		if (this.props.simContainerWidth > 250 && this.props.simContainerHeight > 110) {
			simButtons = 
				<g>
					<path onClick = {this.props.runSimulation}
						onMouseOver = {this.props.playStopButtonMouseOver.bind(null,'playButtonColor')}
						onMouseOut = {this.props.playStopButtonMouseOut.bind(null,'playButtonColor')}
						d = 'M50 20 V0 L 70 10 Z'
						fill = {this.props.playButtonColor}/>
					<path onClick = {this.props.stopSimulation}
						onMouseOver = {this.props.playStopButtonMouseOver.bind(null,'stopButtonColor')}
						onMouseOut = {this.props.playStopButtonMouseOut.bind(null,'stopButtonColor')}
						d = 'M150 20 V0 H130 V20 Z'
						fill = {this.props.stopButtonColor}/>
				</g>;
		} else {
			simButtons = [];
		}
		if (this.props.simContainerWidth > 200 && this.props.simContainerHeight > 30) {
			simTitleText = <text
					x = {this.props.textPosition} 
					y = {25}
					textAnchor = 'middle'
					fontSize = {17}
					fontFamily = "'Karla',sans-serif"
					stroke = 'black'>
				Simulation Runner
				</text>;
		} else {
			simTitleText = [];
		}

		if (this.props.simContainerWidth > 480 && this.props.simContainerHeight > 110) {
			dataButtons = <g>
				<g style = {{'cursor':'pointer'}}
					onClick = {this.props.simParmsScreen}>
					<rect x = {0} 
						y = {this.props.simContainerHeight-80}
						height = {30} width = {150} fill = 'rgb(200,200,200)'/>
					<text x = {150/2} 
						y = {this.props.simContainerHeight-80+19}
						fontSize = {15} textAnchor = 'middle'>
						Simulation Parameters
					</text>
				</g>
				<g style = {{'cursor':'pointer'}}
					onClick = {this.props.saveGraph}>
					<rect x = {160} 
						y = {this.props.simContainerHeight-80}
						height = {30} width = {150} fill = 'rgb(200,200,200)'/>
					<text x = {160+150/2}
						y = {this.props.simContainerHeight-80+19}
						fontSize = {15} textAnchor = 'middle'>
						Get Graph
					</text>
				</g>
				<g style = {{'cursor':'pointer'}}
					onClick = {this.props.getData}>
					<rect x = {320}
						y = {this.props.simContainerHeight-80}
						height = {30} width = {150} fill = 'rgb(200,200,200)'/>
					<text x = {320+150/2}
						y = {this.props.simContainerHeight-80+19}
						fontSize = {15} textAnchor = 'middle'>
						Get Data
					</text>
				</g>
			</g>;
		} else {
			dataButtons = [];
		}
		return(
			<svg style = {this.props.style}>
				{simTitleText}
				<g transform = {'translate('+(this.props.simContainerWidth/2-100)+',50)'}>
					{simButtons}
				</g>
				<g transform = {'translate('+(this.props.simContainerWidth/2-470/2)+',45)'}>
					{dataButtons}
				</g>
				<SVGGraph 
					xLimit = {this.props.xLimit}
					yLimit = {this.props.yLimit}
					xAxisOffset = {this.props.xAxisOffset}
					yAxisOffset = {this.props.yAxisOffset}
					xAxisLength = {this.props.xAxisLength}
					yAxisLength = {this.props.yAxisLength}
					bottomY = {this.props.bottomY}
					noTicksX = {this.props.noTicksX}
					noTicksY = {this.props.noTicksY}
					tickLength = {this.props.tickLength}
					xTransform = {this.props.xTransform}
					yTransform = {this.props.yTransform}
					xTickSegment = {this.props.xTickSegment}
					yTickSegment = {this.props.yTickSegment}
					paths = {this.props.paths}/>
			</svg>
		);
	}
}

SimulationContainer.propTypes = {
	simContainerHeight: React.PropTypes.number.isRequired,
	simContainerWidth: React.PropTypes.number.isRequired,
	textPosition: React.PropTypes.number.isRequired,
	playButtonColor: React.PropTypes.string.isRequired,
	stopButtonColor: React.PropTypes.string.isRequired,
	runSimulation: React.PropTypes.func.isRequired,
	saveGraph: React.PropTypes.func.isRequired,
	getData: React.PropTypes.func.isRequired,
	playStopButtonMouseOut: React.PropTypes.func.isRequired,
	playStopButtonMouseOver: React.PropTypes.func.isRequired,
	stopSimulation: React.PropTypes.func.isRequired,
	style: React.PropTypes.object.isRequired,
	simParmsScreen: React.PropTypes.func.isRequired,
	xLimit: React.PropTypes.array.isRequired,
	yLimit: React.PropTypes.array.isRequired,
	xAxisOffset: React.PropTypes.number.isRequired,
	yAxisOffset: React.PropTypes.number.isRequired,
	xAxisLength: React.PropTypes.number.isRequired,
	yAxisLength: React.PropTypes.number.isRequired,
	bottomY: React.PropTypes.number.isRequired,
	noTicksX: React.PropTypes.number.isRequired,
	noTicksY: React.PropTypes.number.isRequired,
	tickLength: React.PropTypes.number.isRequired,
	xTransform: React.PropTypes.number.isRequired,
	yTransform: React.PropTypes.number.isRequired,
	xTickSegment: React.PropTypes.number.isRequired,
	yTickSegment: React.PropTypes.number.isRequired,
	paths: React.PropTypes.array.isRequired
};

class SVGGraph extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var xAxisTicks = [];
		var yAxisTicks = [];
		xAxisTicks.push(
			<g key = {'xAxisTick'+0}>
				<line
					x1 = {this.props.xAxisOffset}
					y1 = {this.props.bottomY-this.props.yAxisOffset}
					x2 = {this.props.xAxisOffset}
					y2 = {this.props.bottomY-this.props.yAxisOffset+this.props.tickLength}
					stroke = 'black'/>
				<text
					x = {this.props.xAxisOffset}
					y = {this.props.bottomY-this.props.yAxisOffset+this.props.tickLength+15}
					fill = 'black'
					textAnchor = 'middle'>
				0
				</text>
			</g>
		);
		for (let i = 1; i < this.props.noTicksX; i++) {
			xAxisTicks.push(
				<g key = {'xAxisTick'+i}>
					<line
						x1 = {this.props.xAxisOffset+i*this.props.xTickSegment*this.props.xTransform}
						y1 = {this.props.bottomY-this.props.yAxisOffset}
						x2 = {this.props.xAxisOffset+i*this.props.xTickSegment*this.props.xTransform}
						y2 = {this.props.bottomY-this.props.yAxisOffset+this.props.tickLength}
						stroke = 'black'/>
					<text
						x = {this.props.xAxisOffset+i*this.props.xTickSegment*this.props.xTransform}
						y = {this.props.bottomY-this.props.yAxisOffset+this.props.tickLength+15}
						fill = 'black'
						textAnchor = 'middle'>
					{tickParser(i*this.props.xTickSegment)}
					</text>
				</g>
			);
		}
		yAxisTicks.push(
			<g key = {'yAxisTick'+0}>
				<line  
					x1 = {this.props.xAxisOffset}
					y1 = {this.props.bottomY-this.props.yAxisOffset}
					x2 = {this.props.xAxisOffset-this.props.tickLength}
					y2 = {this.props.bottomY-this.props.yAxisOffset}
					stroke = 'black'/>
				<text
					x = {this.props.xAxisOffset-this.props.tickLength-25}
					y = {this.props.bottomY-this.props.yAxisOffset+5}
					fill = 'black'
					textAnchor = 'middle'>
				0
				</text>
			</g>
		);
		for (let i = 1; i < this.props.noTicksY; i++) {
			yAxisTicks.push(
				<g key = {'yAxisTick'+i}>
					<line 
						x1 = {this.props.xAxisOffset}
						y1 = {this.props.bottomY-this.props.yAxisOffset-
							this.props.yTickSegment*i*this.props.yTransform}
						x2 = {this.props.xAxisOffset-this.props.tickLength}
						y2 = {this.props.bottomY-this.props.yAxisOffset
							-this.props.yTickSegment*i*this.props.yTransform}
						stroke = 'black'/>
					<text
						x = {this.props.xAxisOffset-this.props.tickLength-25}
						y = {this.props.bottomY-this.props.yAxisOffset
							-this.props.yTickSegment*i*this.props.yTransform+5}
						fill = 'black'
						textAnchor = 'middle'>
				{tickParser(i*this.props.yTickSegment)}
				</text>
				</g>
			);
		}
		
		var graph;
		if (this.props.xAxisLength < 0 || this.props.yAxisLength < 0) {
			graph = [];
		} else {
			graph = <g>
				{this.props.paths}
				<line
					x1 = {this.props.xAxisOffset}
					y1 = {this.props.bottomY-this.props.yAxisOffset}
					x2 = {this.props.xAxisOffset}
					y2 = {this.props.bottomY-this.props.yAxisOffset-this.props.yAxisLength}
					stroke = 'black'
					strokeWidth = {2}
					fill = 'none'/>
				<line
					x1 = {this.props.xAxisOffset}
					y1 = {this.props.bottomY-this.props.yAxisOffset}
					x2 = {this.props.xAxisOffset+this.props.xAxisLength}
					y2 = {this.props.bottomY-this.props.yAxisOffset}
					stroke = 'black'
					strokeWidth = {2}
					fill = 'none'/>
					{xAxisTicks}
					{yAxisTicks}
				<text
					x = {this.props.xAxisOffset+this.props.xAxisLength/2}
					y = {this.props.bottomY+20}
					fontFamily = '"Karla",sans-serif'
					stroke = 'black'
					fill = 'black'
					textAnchor = 'middle'>Time</text>
				<text
					x = {20}
					y = {this.props.bottomY-this.props.yAxisOffset-this.props.yAxisLength/2}
					fontFamily = '"Karla",sans-serif'
					stroke = 'black'
					fill = 'black'
					textAnchor = 'middle'
					transform = {'rotate(-90'+','+20+
					','+(this.props.bottomY-this.props.yAxisOffset-this.props.yAxisLength/2)+')'}>Population Size
				</text>
			</g>;
		}

		return(
			<g>
			{graph}
			</g>
		);
	}
}

SVGGraph.propTypes = {
	xLimit: React.PropTypes.array.isRequired,
	yLimit: React.PropTypes.array.isRequired,
	xAxisOffset: React.PropTypes.number.isRequired,
	yAxisOffset: React.PropTypes.number.isRequired,
	xAxisLength: React.PropTypes.number.isRequired,
	yAxisLength: React.PropTypes.number.isRequired,
	bottomY: React.PropTypes.number.isRequired,
	noTicksX: React.PropTypes.number.isRequired,
	noTicksY: React.PropTypes.number.isRequired,
	tickLength: React.PropTypes.number.isRequired,
	xTransform: React.PropTypes.number.isRequired,
	yTransform: React.PropTypes.number.isRequired,
	xTickSegment: React.PropTypes.number.isRequired,
	yTickSegment: React.PropTypes.number.isRequired,
	paths: React.PropTypes.array.isRequired,
	clipper: React.PropTypes.object
};

export {SimulationContainer, SVGGraph};