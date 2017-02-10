import React from '../node_modules/react';

export default class SimulationParameters extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		//var initialConditions = [];
		if (this.props.simulationParametersScreenActive) {
			/*
			for (let key in this.props.foodWeb.populations) {
				initialConditions.push(<tr key = {'IC'+key}>
					<td><i>{this.props.foodWeb.populations[key].label}</i><sub>0</sub></td>
					<td>{'Initial condition '+this.props.foodWeb.populations[key].label}</td>
					<td><input type = 'text'
					defaultValue = {this.props.foodWeb.populations[key].initialCondition}
					onChange = {this.props.setPopulationParameter.bind(null,
					'initialCondition', key, null, null, null, null,
					null)}/></td>
				</tr>);
			}*/

			var simParmDivStyle = {position: 'fixed',
				left:(window.innerWidth/2-200),
				width:400, height:400, top:50,
				fontFamily:'"Karla", sans-serif',
				backgroundColor:'rgba(220,220,220,0.9)',
				border:'2px solid black', textAlign:'center',
				boxShadow: '5px 5px 4px rgb(100,100,100)',
				overflow:'scroll'};
			var simulationParametersPopup = <div style = {simParmDivStyle}> 
				<svg style = {{position:'absolute',left:371, top:5}} width = {24} height = {24}>
					<g style = {{'cursor':'pointer'}}
						onClick = {this.props.unsetParameterScreenActive}>
						<rect x = {0} y = {0} width = {24} height = {24} fill = 'rgb(180,180,180)'/>
						<line x1 = {1} y1 = {1} x2 = {23} y2 = {23}
							stroke = 'red'
							strokeWidth = {3}/>
						<line x1 = {1} y1 = {23} x2 = {23} y2 = {1}
							stroke = 'red'
							strokeWidth = {3}/>
					</g>
				</svg>
				<h2>Simulation Parameters</h2>
				<label>
					Set final as initial
					<input type = 'checkbox' onChange = {this.props.setFinalAsInitial}
						checked = {this.props.finalTimeChecked}/>
					<br />
				</label>
				<table>
					<tbody>
						<tr>
							<th>Symbol</th>
							<th>Description</th>
							<th>Value</th>
						</tr>
						<tr>
							<td><i>t</i><sub>final</sub></td>
							<td>Final Time</td>
							<td><input defaultValue = {this.props.finalTime}
								onChange = {this.props.changeFinalTime}/></td>
						</tr>
						{this.props.initialConditions}
					</tbody>
				</table>
			</div>;
		}
		
		return (
			<div>
				{simulationParametersPopup}
			</div>
		);
	}
}

SimulationParameters.propTypes = {
	simulationParametersScreenActive: React.PropTypes.bool.isRequired,
	finalTime: React.PropTypes.number.isRequired,
	finalTimeChecked: React.PropTypes.bool.isRequired,
	initialConditions: React.PropTypes.array.isRequired,
	setFinalAsInitial: React.PropTypes.func.isRequired,
	changeFinalTime: React.PropTypes.func.isRequired,
	unsetParameterScreenActive: React.PropTypes.func.isRequired,
	setPopulationParameter: React.PropTypes.func.isRequired
};