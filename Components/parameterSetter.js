import React from '../node_modules/react';

class ParametersContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var parmTitleText;
		if (this.props.height > 80) {
			parmTitleText = <text
				x = {this.props.textPosition} 
				y = {20}
				textAnchor = 'middle'
				fontSize = {17}
				fontFamily = "'Karla',sans-serif"
				stroke = 'black'>
				Parameters Setter
				</text>;
		} else {
			parmTitleText = [];
		}
		return(
			<div style = {this.props.style}>
				<svg width = '100%'
					height = {25}>
					{parmTitleText}
				</svg>
				<div style = {{height:(this.props.height-75),
					overflow:'scroll',
					width:'100%'}}>
					{this.props.parameterSetters}
				</div>
			</div>
		);
	}
}

ParametersContainer.propTypes = {
	height: React.PropTypes.number.isRequired,
	textPosition: React.PropTypes.number.isRequired,
	style: React.PropTypes.object.isRequired,
	parameterSetters: React.PropTypes.array.isRequired
};

class ParameterSetter extends React.Component {
	constructor(props){
		super(props);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onClick = this.onClick.bind(this);
		this.state = {cursor:'default',
			backgroundColor:'rgb(200,200,200)'};
	}
	render(){
		var svgPullDown = 
		<svg width = {'100%'} height = {40}>
			<g>
				<rect x = {0} y = {0} width = {'100%'}
					height = {40}
					fill = {this.state.backgroundColor}/>
				<polyline points = '0 10,20 30, 40 10' 
					stroke = 'black' 
					fill = 'none'
					strokeWidth = {5}
					transform = {'translate('+(this.props.windowWidth/2-20)+','+'0)'}/>
				<text x = {5} y = {15} 
					stroke = 'black'
					fontFamily = '"Karla",sans-serif'>
				{this.props.label}
				</text>
			</g>
		</svg>;
		var divStyles = {width:'100%',
			height:this.props.parameterViewActive?'':40,
			fontFamily: '"Karla", sans-serif',
			backgroundColor:this.state.backgroundColor,
			border:'3px solid',
			borderColor:this.props.color,
			cursor:this.state.cursor,
			marginBottom:'5px'}; 
		return(
			<div style = {divStyles}
				onClick = {this.onClick}
				onMouseOver = {this.onMouseOver}
				onMouseOut = {this.onMouseOut}>
				{this.props.parameterViewActive?
				this.props.parameterClickView:svgPullDown}
			</div>
		);
	}
	onMouseOver() {
		if (!this.props.parameterViewActive) {
			this.setState({cursor: 'pointer',
				backgroundColor: 'rgb(250,250,250)'});
		}
	}
	onMouseOut() {
		this.setState({cursor: 'default',
			backgroundColor: 'rgb(200,200,200)'});
	}
	onClick() {
		if (!this.props.parameterViewActive) {
			this.setState({cursor: 'default',
				backgroundColor: 'rgb(250,250,250)'});
			this.props.setParameterViewActive.bind(null,this.props.name)();
		}
	}
}

ParameterSetter.propTypes = {
	label: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	color: React.PropTypes.string.isRequired,
	windowWidth: React.PropTypes.number.isRequired,
	iValue: React.PropTypes.number.isRequired,
	parameterViewActive: React.PropTypes.bool.isRequired,
	setParameterViewActive: React.PropTypes.func.isRequired,
	setPopulationParameter: React.PropTypes.func.isRequired,
	pop: React.PropTypes.object.isRequired,
	parameterClickView: React.PropTypes.object
};

class ParameterClickView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {fill:'rgb(200,200,200)',
			fillFirstArrow:'white',
			cursor:'default'};
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseOverFirstArrow = this.onMouseOverFirstArrow.bind(this);
		this.onMouseOutFirstArrow = this.onMouseOutFirstArrow.bind(this);
	}
	render() {
		var divStyles = {position:'relative',
			textAlign:'center',
			backgroundColor:'white'};
		var inputStyles = {textAlign:'center',
			position:'relative',
			fontFamily: '"Karla",sans-serif',
			fontSize:20,
			display:'block',
			width:200,
			left:(window.innerWidth/2-100)};
		var svgStyle = {width:'100%',
			height:40,
			cursor:this.state.cursor,
			marginTop:5};
		
		return(
			<div style = {divStyles}>
				<input type = 'text'
					style = {inputStyles}
					defaultValue = {this.props.label}
					onChange = {this.props.setPopulationParameter.bind(null, 
						'label', this.props.name, undefined, undefined,
						undefined, undefined, undefined)}/>
				<ColorPicker name = {this.props.name}
					iValue = {this.props.iValue}
					setPopulationParameter = {this.props.setPopulationParameter}/>
				{this.props.parameterTable}
				<svg style = {svgStyle}>
				<g onClick = {this.props.onArrowClick.bind(null,this.props.name)}
					onMouseOver = {this.onMouseOver}
					onMouseOut = {this.onMouseOut}>
				<rect x = {0} y = {0}
					width = {'100%'}
					height = {40}
					fill = {this.state.fill}
					stroke = 'black'
					strokeWidth = {2}/>
				<polyline points = '0 30,20 10, 40 30' 
					stroke = 'black' 
					fill = 'none'
					strokeWidth = {5}
					transform = {'translate('+(this.props.windowWidth/2-20)+','+'0)'}/>
				</g>
				</svg>
			</div>
		);
	}
	onMouseOver() {
		this.setState({fill:'white',cursor:'pointer'});
	}
	onMouseOut() {
		this.setState({fill:'rgb(200,200,200)',cursor:'default'});
	}
	onMouseOverFirstArrow() {
		this.setState({fillFirstArrow:'gray'});
	}
	onMouseOutFirstArrow() {
		this.setState({fillFirstArrow:'white'});
	}
}

ParameterClickView.propTypes = {
	label: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	iValue: React.PropTypes.number.isRequired,
	windowWidth: React.PropTypes.number.isRequired,
	setPopulationParameter: React.PropTypes.func.isRequired,
	onArrowClick: React.PropTypes.func.isRequired,
	parameterTable: React.PropTypes.object.isRequired
};

class ColorPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {iValue:this.props.iValue};
		this.moveArrows = this.moveArrows.bind(this);
	}
	render() {
		var height = 40;
		var lines = [];
		var red = 255;
		var green = 255;
		var blue = 255;
		var stroke = 'rgb('+red+','+green+','+blue+')';
		var width = window.innerWidth/2;
		var realizedWidth = width-20;
		var lineWidth = realizedWidth/700;
		for (let i = 0, j = 0; i < 700; i++, j++) {
			if (i < 100) {
				//decrease all
				red = Math.round(255 - (255/100)*j);
				green = Math.round(255 - (255/100)*j);
				blue = Math.round(255 - (255/100)*j);
			} else if (i < 200) {
				//full red start, increase green
				if (i === 100) {
					j = 0;
				}
				red = 255;
				green = Math.round((255/100)*j);
				blue = 0;
			} else if (i  < 300) {
				//decrease red
				if (i === 200) {
					j = 0;
				}
				red = Math.round(255 - (255/100)*j);
				green = 255;
				blue = 0;
			} else if (i  < 400) {
				//increase blue
				if (i === 300) {
					j = 0;
				}
				red = 0;
				green = 255;
				blue = Math.round((255/100)*j);
			} else if (i < 500) {
				//decrease green
				if (i === 400) {
					j = 0;
				}
				red = 0;
				green = Math.round(255 - (255/100)*j);
				blue = 255;
			} else if (i < 600) {
				//increase red
				if (i === 500) {
					j = 0;
				}
				red = Math.round((255/100)*j);
				blue = 255;
				green = 0;
			} else if (i < 700) {
				//decrease blue
				if (i === 600) {
					j = 0;
				}
				red = 255;
				blue = Math.round(255 - (255/100)*j);
				green = 0;
			}
			stroke = 'rgb('+red+','+green+','+blue+')';
			lines.push(<ColorLine x1 = {i*lineWidth}
				key = {'color'+i}
				y1 = {0} 
				x2 = {i*lineWidth}
				y2 = {20}
				stroke = {stroke}
				strokeWidth = {lineWidth}
				transform = 'translate(10,10)'
				iValue = {i}
				onClick = {this.moveArrows}
				/>
			);
		}
		return(
			<svg height = {height} width = {width}>
				<g>
					<rect x = {0} y = {0} 
						height = {height} width = {width}
						fill = 'white'/>
					{lines}
					<g transform = {'translate('+((((window.innerWidth/2-20)/700)*this.state.iValue)+5)+',0)'}>
						<polyline points = {'0 0, 5 10, 10 0'} fill = 'black'/>
						<polyline points = {'0 40, 5 30, 10 40'} fill = 'black'/>
					</g>
				</g>
			</svg>
		);
	}
	moveArrows(iValue, colorString) {
		this.props.setPopulationParameter('color', this.props.name, undefined, 
		undefined, undefined, colorString, iValue);
		this.setState({iValue:iValue});
	}
}

ColorPicker.propTypes = {
	name: React.PropTypes.string.isRequired,
	iValue: React.PropTypes.number.isRequired,
	setPopulationParameter: React.PropTypes.func.isRequired,
};

class ColorLine extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<line x1 = {this.props.x1}
				y1 = {this.props.y1} 
				x2 = {this.props.x2}
				y2 = {this.props.y2}
				stroke = {this.props.stroke}
				strokeWidth = {this.props.strokeWidth}
				transform = {this.props.transform}
				onClick = {this.props.onClick.bind(null,
					this.props.iValue, this.props.stroke)}
			/>
		);
	}
}

ColorLine.propTypes = {
	x1: React.PropTypes.number.isRequired,
	y1: React.PropTypes.number.isRequired,
	x2: React.PropTypes.number.isRequired,
	y2: React.PropTypes.number.isRequired,
	strokeWidth: React.PropTypes.number.isRequired,
	iValue: React.PropTypes.number.isRequired,
	transform: React.PropTypes.string.isRequired,
	stroke: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func.isRequired
};

class ParameterTable extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var consumptionTable = [], i, birthParms = [], deathParms = [],
			pop = this.props.pop;
		for (i = 0; i < pop.consumes.length; i++) {
			consumptionTable.push(
				<tr key = {pop.name+'fr'+i}>
					<td>Functional Response on {pop.consumes[i].label}</td>
					<td>Per capita predation rate</td>
					<td> 
						<label >Type I<input name = {'fr'+pop.consumes[i].name+pop.name}
							type = 'radio'
							value = 'type1'
							checked = {pop.functionalResponse[i]==='type1'?true:false}
							onChange = {this.props.setPopulationParameter.bind(null,
								'function', pop.name, 'type1', i, pop.consumes[i],
								undefined, undefined)}/> 
						</label>
						<label>Type II<input name = {'fr'+pop.consumes[i].name+pop.name}
							type = 'radio'
							value = 'type2'
							checked = {pop.functionalResponse[i]==='type2'?true:false}
							onChange = {this.props.setPopulationParameter.bind(null,
								'function', pop.name, 'type2', i, pop.consumes[i],
								undefined, undefined)}/>
						</label>
					</td>
				</tr>
							);
			if (pop.functionalResponse[i] === 'type1') {
				consumptionTable.push(
					<tr key = {pop.name+'fr'+i+'1'+'type1'}>
						<td><i>b</i> <sub>{pop.label+','+pop.consumes[i].label}</sub></td>
						<td>Conversion efficiency of {pop.label} on {pop.consumes[i].label}</td>
						<td> 
							<input defaultValue = {pop.parameters['b'][i]}
								onChange = {this.props.setPopulationParameter.bind(null,
									'consumptionParameter', pop.name, 'b', i, 
									undefined, undefined, undefined)}/>
						</td>
					</tr>
				);
				consumptionTable.push(
					<tr key = {pop.name+'fr'+i+'2'+'type1'}
						style = {{borderBottom:'2px solid black'}}>
						<td><i>a</i> <sub>{pop.label+','+pop.consumes[i].label}</sub></td>
						<td>Encounter rate of {pop.label} on {pop.consumes[i].label}</td>
						<td> 
							<input defaultValue = {pop.parameters['a'][i]}
								onChange = {this.props.setPopulationParameter.bind(null,
									'consumptionParameter', pop.name, 'a', i, 
									undefined, undefined, undefined)}/>
						</td>
					</tr>
				);
			} else {
				consumptionTable.push(
					<tr key = {pop.name+'fr'+i+'1'+'type2'}>
						<td><i>b</i> <sub>{pop.label+','+pop.consumes[i].label}</sub></td>
						<td>Conversion efficiency of {pop.label} on {pop.consumes[i].label}</td>
						<td> <input defaultValue = {pop.parameters['b'][i]}
												onChange = {this.props.setPopulationParameter.bind(null,
												'consumptionParameter', pop.name, 'b', i, 
												undefined, undefined, undefined)}/> </td>
					</tr>
				);
				consumptionTable.push(
					<tr key = {pop.name+'fr'+i+'2'+'type2'}>
						<td><i>a</i> <sub>{pop.label+','+pop.consumes[i].label}</sub></td>
						<td>Encounter rate of {pop.label} on {pop.consumes[i].label}</td>
						<td> <input defaultValue = {pop.parameters['a'][i]}
												onChange = {this.props.setPopulationParameter.bind(null,
												'consumptionParameter', pop.name, 'a', i, 
												undefined, undefined, undefined)}/> </td>
					</tr>
				);
				consumptionTable.push(
					<tr key = {pop.name+'fr'+i+'3'+'type2'}
						style = {{borderBottom:'2px solid black'}}>
						<td><i>h</i> <sub>{pop.label+','+pop.consumes[i].label}</sub></td>
						<td>Handling time of {pop.label} on {pop.consumes[i].label}</td>
						<td> <input defaultValue = {pop.parameters['h'][i]}
												onChange = {this.props.setPopulationParameter.bind(null,
												'consumptionParameter', pop.name, 'h', i, 
												undefined, undefined, undefined)}/> </td>
					</tr>
				);
			}
		}
		if (pop.birth === 'none') {
			birthParms.push(<tr key = {pop.name+'birth'}
				style = {{borderBottom:'2px solid black'}}></tr>);
		} else if (pop.birth === 'exponential') {
			birthParms.push(
				<tr key = {pop.name+'birth'+'r'}
					style = {{borderBottom:'2px solid black'}}>
					<td><i>r</i> <sub>{pop.label}</sub></td>
					<td>Intrinsic growth rate of {pop.label}</td>
					<td>
						<input defaultValue = {pop.parameters['r']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'r', undefined, 
								undefined, undefined, undefined)}/> </td>
				</tr>
			);
		} else if (pop.birth === 'chemostat') {
			birthParms.push(
				<tr key = {pop.name+'birth'+'D'}>
					<td><i>D</i> <sub>{pop.label}</sub></td>
					<td>Dilution rate of {pop.label}</td>
					<td>
						<input defaultValue = {pop.parameters['D']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'D', undefined,
								undefined, undefined, undefined)}/>
					</td>
				</tr>
			);
			birthParms.push(
				<tr key = {pop.name+'birth'+'S'}
					style = {{borderBottom:'2px solid black'}}>
					<td><i>S</i> <sub>{pop.label}</sub></td>
					<td>Supply rate of {pop.label}</td>
					<td>
						<input defaultValue = {pop.parameters['S']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'S', undefined,
								undefined, undefined, undefined)}/>
					</td>
				</tr>
			);
		} else if (pop.birth === 'logistic') {
			birthParms.push(
				<tr key = {pop.name+'birth'+'r'}>
					<td><i>r</i> <sub>{pop.label}</sub></td>
					<td>Intrinsic growth rate of {pop.label}</td>
					<td>
						<input defaultValue = {pop.parameters['r']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'r', undefined,
								undefined, undefined, undefined)}/>
					</td>
				</tr>
			);
			birthParms.push(
				<tr key = {pop.name+'birth'+'K'}
					style = {{borderBottom:'2px solid black'}}>
					<td><i>K</i> <sub>{pop.label}</sub></td>
					<td>Carrying capacity of {pop.label}</td>
					<td>
						<input defaultValue = {pop.parameters['K']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'K', undefined,
								undefined, undefined, undefined)}/>
					</td>
				</tr>
			);
		}
		if (pop.death === 'none') {
			deathParms.push(<tr key = {pop.name+'death'}
				style = {{borderBottom:'2px solid black'}}>
			</tr>);
		} else {
			deathParms.push(
				<tr key = {pop.name+'death'+'d'}
					style = {{borderBottom:'2px solid black'}}>
					<td><i>d</i> <sub>{pop.label}</sub></td>
					<td>Per capit death rate of {this.label}</td>
					<td>
						<input defaultValue = {pop.parameters['d']}
							onChange = {this.props.setPopulationParameter.bind(null,
								'parameter', pop.name, 'd', undefined,
								undefined, undefined, undefined)}/>
					</td>
				</tr>
			);
		}
		return (
			<table style = {{borderCollapse:'collapse'}}>
				<tbody>
					<tr style = {{borderBottom:'2px solid black'}}>
						<th>Symbol</th>
						<th>Description</th>
						<th>Value</th>
					</tr>
					<tr>
						<td>Birth function</td>
						<td>Birth rate excluding consumption</td>
						<td>  
							<label >None<input name = {'birth'+this.name}
								type = 'radio'
								value = 'none'
								checked = {pop.birth==='none'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
									'function', pop.name, 'none', undefined,
									'birth', undefined, undefined)}/> 
							</label>
							<label >Exponential<input name = {'birth'+pop.name}
								type = 'radio'
								value = 'exponential'
								checked = {pop.birth==='exponential'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
									'function', pop.name, 'none', undefined,
									'birth', undefined, undefined)}/> 
							</label>
							<label >Chemostat<input name = {'birth'+pop.name}
								type = 'radio'
								value = 'chemostat'
								checked = {pop.birth==='chemostat'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
								'function', pop.name, 'none', undefined,
								'birth', undefined, undefined)}/> 
							</label>
							<label >Logistic<input name = {'birth'+pop.name}
								type = 'radio'
								value = 'logistic'
								checked = {pop.birth==='logistic'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
								'function', pop.name, 'none', undefined,
								'birth', undefined, undefined)}/> 
							</label>
						</td>
					</tr>
					{birthParms}
					<tr>
						<td>Death function</td>
						<td>Death rate excluding predation</td>
						<td> 
							<label >None<input name = {'death'+pop.name}
								type = 'radio'
								value = 'none'
								checked = {pop.death==='none'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
									'function', pop.name, 'none', undefined,
									'death', undefined, undefined)}/> 
							</label> 
							<label >Constant per capita<input name = {'death'+pop.name}
								type = 'radio'
								value = 'constantPerCapita'
								checked = {pop.death==='constantPerCapita'?true:false}
								onChange = {this.props.setPopulationParameter.bind(null,
									'function', pop.name, 'none', undefined,
									'death', undefined, undefined)}/> 
							</label> 
						</td>
					</tr>
					{deathParms}
					{consumptionTable}
				</tbody>
			</table>
		);
	}
} 

ParameterTable.propTypes = {
	setPopulationParameter: React.PropTypes.func.isRequired,
	pop: React.PropTypes.object.isRequired
};

export {ParametersContainer, ParameterSetter, ParameterClickView,
	ColorPicker, ColorLine, ParameterTable};
