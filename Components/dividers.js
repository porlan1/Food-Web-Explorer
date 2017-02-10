import React from '../node_modules/react';

class VerticalDivider extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var simTitleText, webTitleText, webTitleTextStyle, simTitleTextStyle;
		webTitleTextStyle = {fontFamily: '"Karla", sans-serif', fontSize: 17,
			transform:'rotate(-90deg)', width: 200, marginLeft: -90, marginTop: 65};
		simTitleTextStyle = {fontFamily: '"Karla", sans-serif', fontSize: 17,
			transform:'rotate(-90deg)',width: 200, marginLeft: -90, marginTop: 75};
		if (this.props.left < 150 && this.props.height > 150) {
			simTitleText = [];
			webTitleText = 
				<div style = {webTitleTextStyle}>
				Food Web Editor
				</div>;
		} else if (this.props.left > this.props.windowWidth-200 &&
			this.props.height > 165) {
			simTitleText = <div style = {simTitleTextStyle}>
			Simulation Runner
			</div>;
			webTitleText = [];
		} else {
			simTitleText = [];
			webTitleText = [];
		}
		var styling = {left:this.props.left+'px',height:this.props.height};
		return (<div className = 'vDivider' 
			style = {styling} 
			onMouseDown = {this.props.onMouseDown}
			onMouseOver = {this.props.onMouseOver}
			onMouseOut = {this.props.onMouseOut}>
			{simTitleText}
			{webTitleText} 
			</div>);
	}
}

VerticalDivider.propTypes = {
	left: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	windowWidth: React.PropTypes.number.isRequired,
	onMouseDown: React.PropTypes.func.isRequired,
	onMouseOver: React.PropTypes.func.isRequired,
	onMouseOut: React.PropTypes.func.isRequired
};


class HorizontalDivider extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var styles = {top:this.props.top+'px'};
		var parmTitleText,simTitleText,webTitleText,
			simTitleTextStyle,webTitleTextStyle;
		simTitleTextStyle = {position:'absolute',left:(this.props.left+25),
			fontFamily:'"Karla", sans-serif',fontSize:17};
		webTitleTextStyle = {position:'absolute',left:5,
			fontFamily:'"Karla", sans-serif',fontSize:17};
		if (this.props.top < 30 && this.props.left > 150) {
			parmTitleText = [];
			simTitleText = <div style = {simTitleTextStyle}>
			Simulation Runner
			</div>;
			webTitleText = <div style = {webTitleTextStyle}>
			Food Web Editor
			</div>;
		} else if (this.props.top < 30 && this.props.left < 150) {
			parmTitleText = [];
			simTitleText = <div style = {simTitleTextStyle}>
			Simulation Runner
			</div>;
			webTitleText = [];
		} else if (this.props.top > this.props.windowHeight-100){
			parmTitleText = <div style = {webTitleTextStyle}>
			ParameterSetter
			</div>;
			simTitleText = [];
			webTitleText = [];
		} else {
			parmTitleText = [];
			simTitleText = [];
			webTitleText = [];
		}
		return (<div className = 'hDivider'
			onMouseDown = {this.props.onMouseDown}
			onMouseOver = {this.props.onMouseOver}
			onMouseOut = {this.props.onMouseOut}
			style = {styles}>
			{parmTitleText}
			{simTitleText}
			{webTitleText}
			</div>);
	}
}

HorizontalDivider.propTypes = {
	left: React.PropTypes.number.isRequired,
	top: React.PropTypes.number.isRequired,
	windowHeight: React.PropTypes.number.isRequired,
	onMouseDown: React.PropTypes.func.isRequired,
	onMouseOver: React.PropTypes.func.isRequired,
	onMouseOut: React.PropTypes.func.isRequired
};

export {VerticalDivider, HorizontalDivider};