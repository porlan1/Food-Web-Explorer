import React from '../node_modules/react';

class FoodWebContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		//svg buttons
		//food web diagram
		var buttons, foodWebTitleText;
		if (this.props.webHeight > 100 && this.props.webWidth > 200) {
			buttons = 
			<g>
				<PlusMinusButtons buttonPositionX = {this.props.textPosition}
				buttonPositionY = {this.props.buttonPositionY}
				createPopulation = {this.props.createPopulation}
				destroyPopulation = {this.props.destroyPopulation}/>
				<WebNavigator webWidth = {this.props.webWidth}
				webHeight = {this.props.webHeight}
				offsetWeb = {this.props.offsetWeb}/>
			</g>;
		} else {
			buttons = [];
		}
		if (this.props.webHeight > 30 && this.props.webWidth > 150) {
			foodWebTitleText = <text
				x = {this.props.textPosition} 
				y = {25}
				textAnchor = 'middle'
				fontSize = {17}
				fontFamily = "'Karla',sans-serif"
				stroke = 'black'>
				Food Web Editor
				</text>;
		} else {
			foodWebTitleText = [];
		}
		return(
			<svg style = {this.props.style}
					onMouseMove = {this.props.onMouseMove}
					onMouseLeave = {this.props.onMouseLeave}
					onMouseUp = {this.props.onMouseUp}>
				<g transform = {'translate('+this.props.webOffsetX+','+this.props.webOffsetY+')'}>
					{this.props.foodWebLinks}
					{this.props.popMarkers}
				</g>
				{buttons}
				{foodWebTitleText}
			</svg>
		);
	}
}

FoodWebContainer.propTypes = {
	webHeight: React.PropTypes.number.isRequired,
	webWidth: React.PropTypes.number.isRequired,
	textPosition: React.PropTypes.number.isRequired,
	buttonPositionY: React.PropTypes.number.isRequired,
	webOffsetY: React.PropTypes.number.isRequired,
	webOffsetX: React.PropTypes.number.isRequired,
	style: React.PropTypes.object.isRequired,
	createPopulation: React.PropTypes.func.isRequired,
	destroyPopulation: React.PropTypes.func.isRequired,
	offsetWeb: React.PropTypes.func.isRequired,
	onMouseMove: React.PropTypes.func.isRequired,
	onMouseLeave: React.PropTypes.func.isRequired,
	onMouseUp: React.PropTypes.func.isRequired,
	foodWebLinks:  React.PropTypes.array.isRequired,
	popMarkers:  React.PropTypes.array.isRequired
};

class WebNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.state = {'upColor':'black',
			'downColor':'black',
			'leftColor':'black',
			'rightColor':'black'};
	}
	render() {
		return(
			<g transform = {'translate('+(this.props.webWidth-70)+','+(this.props.webHeight-70)+')'}>
				<path onClick = {this.props.offsetWeb.bind(null,'left')}
				onMouseOver = {this.onMouseOver.bind(null,'leftColor')}
				onMouseOut = {this.onMouseOut.bind(null,'leftColor')}
				d = 'M20 20 L0 30 L20 40 Z'
				stroke = {this.state.leftColor}
				fill = {this.state.leftColor}/>
				<path onClick = {this.props.offsetWeb.bind(null,'down')}
				onMouseOver = {this.onMouseOver.bind(null,'downColor')}
				onMouseOut = {this.onMouseOut.bind(null,'downColor')}
				d = 'M20 20 L30 0 L40 20 Z'
				stroke = {this.state.downColor}
				fill = {this.state.downColor}/>
				<path onClick = {this.props.offsetWeb.bind(null,'up')}
				onMouseOver = {this.onMouseOver.bind(null,'upColor')}
				onMouseOut = {this.onMouseOut.bind(null,'upColor')}
				d = 'M20 40 L30 60 L40 40 Z'
				stroke = {this.state.upColor}
				fill = {this.state.upColor}/>
				<path onClick = {this.props.offsetWeb.bind(null,'right')}
				onMouseOver = {this.onMouseOver.bind(null,'rightColor')}
				onMouseOut = {this.onMouseOut.bind(null,'rightColor')}
				d = 'M40 40 L60 30 L40 20 Z'
				stroke = {this.state.rightColor}
				fill = {this.state.rightColor}/>
			</g>
		);
	}
	onMouseOver(name) {
		var state = {};
		state[name] = 'red';
		this.setState(state);
	}
	onMouseOut(name) {
		var state = {};
		state[name] = 'black';
		this.setState(state);
	}
}

WebNavigator.propTypes = {
	webHeight: React.PropTypes.number.isRequired,
	webWidth: React.PropTypes.number.isRequired,
	offsetWeb: React.PropTypes.func.isRequired
};

class PopulationMarker extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<g style = {{cursor:'move'}}
				onClick = {this.props.onClick.bind(null,this.props.name)}
				onMouseDown = {this.props.onMouseDown.bind(null,this.props.name)}
				transform = {this.props.transform}>
				<circle
					cx = {this.props.cx}
					cy = {this.props.cy}
					strokeWidth = {this.props.circleStrokeWidth}
					r = {this.props.r}
					fill = {this.props.circleFill}
					stroke = {this.props.stroke}
				/>
				<text 
					x = {this.props.textX} 
					y = {this.props.textY}
					fontSize = {this.props.label.length>10?3.0*this.props.r/this.props.label.length:15}
					textAnchor = {this.props.textAnchor}
					fontFamily = {this.props.fontFamily}
					stroke =  {this.props.stroke}
					fill =  {this.props.stroke}
				> 
				{this.props.label}
				</text>
			</g>
		);
	}
}

PopulationMarker.propTypes = {
	name: React.PropTypes.string.isRequired,
	label: React.PropTypes.string.isRequired,
	textAnchor: React.PropTypes.string.isRequired,
	fontFamily: React.PropTypes.string.isRequired,
	transform: React.PropTypes.string.isRequired,
	circleFill: React.PropTypes.string.isRequired,
	textX: React.PropTypes.number.isRequired,
	textY: React.PropTypes.number.isRequired,
	stroke: React.PropTypes.string.isRequired,
	circleStrokeWidth: React.PropTypes.number.isRequired,
	r: React.PropTypes.number.isRequired,
	cx: React.PropTypes.number.isRequired,
	cy: React.PropTypes.number.isRequired,
	onClick: React.PropTypes.func.isRequired,
	onMouseDown: React.PropTypes.func.isRequired
};

class FeedingLink extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<g onClick = {this.props.onClick.bind(null, this.props.name)}>
				<line
					stroke = {this.props.stroke}
					strokeWidth = {this.props.strokeWidth}
					x1 = {this.props.x1}
					y1 = {this.props.y1}
					x2 = {this.props.x2}
					y2 = {this.props.y2}/>
				<polygon
					points = {this.props.points}
					fill = {this.props.fill}/>
			</g>
		);
	}
}

FeedingLink.propTypes = {
	name: React.PropTypes.string.isRequired,
	stroke: React.PropTypes.string.isRequired,
	points: React.PropTypes.string.isRequired,
	fill: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func.isRequired,
	strokeWidth: React.PropTypes.number.isRequired,
	x1: React.PropTypes.number.isRequired,
	x2: React.PropTypes.number.isRequired,
	y1: React.PropTypes.number.isRequired,
	y2: React.PropTypes.number.isRequired
};

class PlusMinusButtons extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseOverMinus = this.onMouseOverMinus.bind(this);
		this.onMouseOutMinus = this.onMouseOutMinus.bind(this);
		this.onMouseOverPlus = this.onMouseOverPlus.bind(this);
		this.onMouseOutPlus = this.onMouseOutPlus.bind(this);
		this.state = {
			minusButtonColor: 'black',
			plusButtonColor: 'black'
		};
	}
	render() {
		return(
			<g transform = {'translate('+(this.props.buttonPositionX-63)+
				' '+(this.props.buttonPositionY-50)+')'}>
				<g onClick = {this.props.destroyPopulation}
					onMouseOver = {this.onMouseOverMinus}
					onMouseOut = {this.onMouseOutMinus}>
					<rect x = {2} y = {2} width = {40} height = {40}
						stroke = {this.state.minusButtonColor}
						strokeWidth = {2} fill ='white'/>
					<line x1 = {7} y1 = {22} x2 = {37} y2 = {22}
						stroke = {this.state.minusButtonColor} strokeWidth = {2}/>
				</g>
				<g onClick = {this.props.createPopulation}
					onMouseOver = {this.onMouseOverPlus}
					onMouseOut = {this.onMouseOutPlus}>
					<rect x = {46} y = {2} width = {40}
						height = {40} stroke = {this.state.plusButtonColor} strokeWidth = {2}
						fill = 'white'/>
					<line x1 = {51} y1 = {22} x2 = {81} y2 = {22}
						stroke = {this.state.plusButtonColor} strokeWidth = {2}/>
					<line x1 = {66} y1 = {7} x2 = {66}
						y2 = {37} stroke = {this.state.plusButtonColor}
						strokeWidth = {2}/>
				</g>
			</g>
		);
	}
	onMouseOverMinus(){
		this.setState({minusButtonColor: 'red'});
	}
	onMouseOutMinus(){
		this.setState({minusButtonColor: 'black'});
	}
	onMouseOverPlus(){
		this.setState({plusButtonColor: 'red'});
	}
	onMouseOutPlus(){
		this.setState({plusButtonColor: 'black'});
	}
}

PlusMinusButtons.propTypes = {
	buttonPositionX: React.PropTypes.number.isRequired,
	buttonPositionY: React.PropTypes.number.isRequired,
	createPopulation: React.PropTypes.func.isRequired,
	destroyPopulation: React.PropTypes.func.isRequired,
};

export {FoodWebContainer, WebNavigator, PopulationMarker, FeedingLink, PlusMinusButtons};