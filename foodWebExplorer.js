import React from './node_modules/react';
import ReactDOM from './node_modules/react-dom';
import {VerticalDivider, HorizontalDivider} from './Components/dividers.js';
import {FoodWebContainer, PopulationMarker,
	FeedingLink} from './Components/foodWebEditor.js';
import {SimulationContainer} from './Components/simulationRunner.js';
import {ParametersContainer, ParameterSetter,
	ParameterClickView, ParameterTable} from './Components/parameterSetter.js';
import SimulationParameters from './Components/simulationParameters.js';
import LinkReminder from './Components/LinkReminder.js';
import FoodWeb from './web.js';
import tickParser from './util/tickParser.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.hMouseDown = this.hMouseDown.bind(this);
		this.vMouseDown = this.vMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.hMouseOver = this.hMouseOver.bind(this);
		this.vMouseOver = this.vMouseOver.bind(this);
		this.hvMouseOut = this.hvMouseOut.bind(this);
		this.onResize = this.onResize.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.createPopulation = this.createPopulation.bind(this);
		this.destroyPopulation = this.destroyPopulation.bind(this);
		this.selectPopulation = this.selectPopulation.bind(this);
		this.setPopulationDraggable = this.setPopulationDraggable.bind(this);
		this.unsetPopulationDraggable = this.unsetPopulationDraggable.bind(this);
		this.dragPopMarker = this.dragPopMarker.bind(this);
		this.setShift = this.setShift.bind(this);
		this.unsetShift = this.unsetShift.bind(this);
		this.setParameterViewActive = this.setParameterViewActive.bind(this);
		this.setPopulationParameter = this.setPopulationParameter.bind(this);
		this.runSimulation = this.runSimulation.bind(this);
		this.stopSimulation = this.stopSimulation.bind(this);
		this.offsetWeb = this.offsetWeb.bind(this);
		this.setParameterScreenActive = this.setParameterScreenActive.bind(this);
		this.unsetParameterScreenActive = this.unsetParameterScreenActive.bind(this);
		this.getData = this.getData.bind(this);
		this.saveGraph = this.saveGraph.bind(this);
		this.runSimulationFull = this.runSimulationFull.bind(this);
		this.openFile = this.openFile.bind(this);
		this.saveFile = this.saveFile.bind(this);
		this.checkLoadedJSON = this.checkLoadedJSON.bind(this);
		this.playStopButtonMouseOver = this.playStopButtonMouseOver.bind(this);
		this.playStopButtonMouseOut = this.playStopButtonMouseOut.bind(this);
		this.setFinalAsInitial = this.setFinalAsInitial.bind(this);
		this.constructInfoScreen = this.constructInfoScreen.bind(this);
		this.destructInfoScreen = this.destructInfoScreen.bind(this);
		this.generateParameterClickViews = this.generateParameterClickViews.bind(this);
		this.generateSinglePCV = this.generateSinglePCV.bind(this);
		this.unsetLinkDisplay = this.unsetLinkDisplay.bind(this);
		this.parameterClickViews = {};
		this.infoScreen = [];
		this.populationMarkerSize = 50;
		this.foodWeb = new FoodWeb();
		this.counter = 0;
		this.draggable = undefined;
		this.shiftPressed = false;
		this.playState = 'stop';
		this.simulationParametersScreenActive = false;
		this.finalTimeChecked = false;
		this.newlyCreated = 0;
		this.linkDisplay = false;
		//web worker for running the simulations on a separate thread
		//web worker function defined in this file, necessary for 
		//chrome compatibility
		this.simWorker = new Worker(URL.createObjectURL(
			new Blob(['('+this.simWorkerFunction.toString()+')()'],
				{type: 'text/javascript'})));
		this.loadedWeb = {};
		this.popKeyCheck = {
			name: 'string', label: 'string', popMarkerColor: 'string',
			birth: 'string', death: 'string', parameters: 'object',
			functionalResponse: 'object', initialCondition: 'number',
			initialCx: 'number', initialCy: 'number', iValue: 'number',
			currentX: 'number', currentY: 'number', dx: 'number', dy: 'number',
			lastDx: 'number', lastDy: 'number', click: 'boolean',
			currentLineX1: 'number', currentLineY1: 'number', transform: 'string',
			fill: 'string', consumes:'object', eatenBy: 'object'
		};

		this.webKeyCheck = {counter: 'number', populations: 'object',
			currentPopulation:'string',
			currentLink: 'string', finalTime: 'number',
			nameIndices: 'object', y0: 'object',
			dataX:'object', dataY:'object',
			YMax:'number'};

		this.state = {
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			leftPosition: window.innerWidth/2,
			leftPositionPercent: 0.5,
			initialPositionLeft: window.innerWidth/2,
			topPosition: 400,
			initialPositionTop: 400,
			draggableVertical: false,
			draggableHorizontal: false,
			cursor: 'default',
			webOffsetX: 0,
			webOffsetY: 0,
			playButtonColor: 'black',
			stopButtonColor: 'black',
			infoButtonCursor: 'default'
		};
	}
	
	render() {
		//add containers for svg on left and right
		//and divs on the bottom
		var svgStylesLeft = {position: 'absolute',
			left:'0px', top:'0px', height: this.state.topPosition,
			width: this.state.leftPosition};
		var svgStylesRight = {position: 'absolute',
			left:this.state.leftPosition+20+'px',
			top:'0px',
			height: this.state.topPosition,
			width: this.state.windowWidth-this.state.leftPosition};
		var svgStylesBottom = {position: 'absolute',
			left:'0px',
			top:(this.state.topPosition+20)+'px',
			height:this.state.windowHeight-(this.state.topPosition+20),
			width: '100%'};
		var buttonStylesOpen = {position: 'absolute',
			cursor: 'pointer',
			verticalAlign: 'center',
			fontFamily: '"Karla",sans-serif',
			fontSize: 15,
			top: '10px',
			width: '80px',
			height: '28px',
			left: this.state.windowWidth-170,
			borderRadius: '4px',
			boxShadow:'2px 2px rgb(170,170,170)',
			backgroundColor:'rgb(230,230,230)'};
		var buttonStylesSave = {position: 'absolute',
			cursor:'pointer',
			fontFamily:'"Karla",sans-serif',
			fontSize:15,
			top:'10px',
			width:'80px',
			height: '28px',
			left:this.state.windowWidth-85,
			borderRadius: '4px',
			boxShadow:'2px 2px rgb(170,170,170)',
			backgroundColor:'rgb(230,230,230)'};
		var moreStyles = {position:'fixed',
			height:'100%',
			width:'100%',
			top:'50px',
			left:'0px',
			cursor:this.state.cursor};
		
		var foodWebLinks = [], parameterSetters = [], 
			popMarkers = [], initialConditions = [],
			currentPop, linkName, linkColor, eatenPop, 
			selectedLinkIndex = undefined, 
			selectedKeyIndex = undefined,
			linkDisplay = [];
		//put the current selected population at the top of the parameter list
		if (this.linkDisplay && this.state.windowWidth > 900) {
			linkDisplay = <LinkReminder 
				unsetLinkDisplay = {this.unsetLinkDisplay}
				windowWidth = {this.state.windowWidth}/>;
		}
		var i = 0;
		for (let key in this.foodWeb.populations) {
			currentPop = this.foodWeb.populations[key];
			parameterSetters.push(
				<ParameterSetter name = {currentPop.name}
					label = {currentPop.label}
					color = {currentPop.popMarkerColor}
					iValue = {currentPop.iValue}
					windowWidth = {window.innerWidth}
					pop = {currentPop}
					setLabel = {currentPop.setLabel}
					parameterViewActive = {currentPop.parameterViewActive}
					key = {currentPop.name}
					setParameterViewActive = {this.setParameterViewActive}
					setPopulationParameter = {this.setPopulationParameter}
					parameterClickView = {this.parameterClickViews[currentPop.name]}
				/>);
			popMarkers.push(
			<PopulationMarker key = {currentPop.name}
				onMouseDown = {this.setPopulationDraggable}
				onClick = {this.selectPopulation}
				cx = {currentPop.initialCx}
				cy = {currentPop.initialCy}
				circleStrokeWidth = {4}
				r = {currentPop.popMarkerRadius}
				circleFill = {currentPop.fill}
				textX =  {currentPop.initialCx} 
				textY = {currentPop.initialCy}
				textAnchor =  'middle'
				fontFamily =  "'Karla',sans-serif"
				stroke =  {currentPop.popMarkerColor}
				transform = {currentPop.transform}
				strokeDashArray = {currentPop.strokeDashArray}
				name = {currentPop.name}
				label = {currentPop.label}
			/>);
			if (this.simulationParametersScreenActive) {
				initialConditions.push(<tr key = {'IC'+key}>
					<td><i>{this.foodWeb.populations[key].label}</i><sub>0</sub></td>
					<td>{'Initial condition '+this.foodWeb.populations[key].label}</td>
					<td><input type = 'text'
					defaultValue = {this.foodWeb.populations[key].initialCondition}
					onChange = {this.setPopulationParameter.bind(null,
					'initialCondition', key, null, null, null, null,
					null)}/></td>
				</tr>);
			}
			if (key === this.foodWeb.currentPopulation){
				selectedKeyIndex = i;
			}
			i++;
			for (let j = 0; j < currentPop.consumes.length; j++) {
				linkName = currentPop.name + '_' + currentPop.consumes[j].name;
				if (linkName === this.foodWeb.currentLink){
					selectedLinkIndex = j;
				}
				linkColor = linkName === this.foodWeb.currentLink?'gray':'black';
				eatenPop = this.foodWeb.populations[currentPop.consumes[j].name];
				foodWebLinks.push(
				<FeedingLink
					key = {linkName}
					name = {linkName}
					onClick = {this.selectPopulation.bind(null, linkName)}
					stroke = {linkColor}
					strokeWidth = {4}
					x1 = {currentPop.currentLineX1}
					y1 = {currentPop.currentLineY1}
					x2 = {eatenPop.initialCx+eatenPop.dx}
					y2 = {eatenPop.initialCy+eatenPop.dy}
					fill = {linkColor}
					points = {currentPop.createSVGArrowHeadPath(eatenPop)}
				/>);
			}
		}
		
		if (selectedKeyIndex !== undefined && selectedKeyIndex !==0) {
			var tempParmSet = parameterSetters[0];
			parameterSetters[0] = parameterSetters[selectedKeyIndex];
			parameterSetters[selectedKeyIndex] = tempParmSet;
		}
		
		var noPopulations = Object.keys(this.foodWeb.populations).length;
		if (selectedKeyIndex !== undefined && selectedKeyIndex !== (noPopulations-1)) {
			var tempPopMarker = popMarkers[noPopulations-1];
			popMarkers[noPopulations-1] = popMarkers[selectedKeyIndex];
			popMarkers[selectedKeyIndex] = tempPopMarker;
		}
		
		if (selectedLinkIndex !== undefined && selectedLinkIndex !== foodWebLinks.length-1) {
			var tempLink = foodWebLinks[foodWebLinks.length-1];
			foodWebLinks[foodWebLinks.length-1] = foodWebLinks[selectedLinkIndex];
			foodWebLinks[selectedLinkIndex] = tempLink;
		}
		
		var openButton, saveButton, infoButton;
		if (this.state.windowWidth > 500) {
			saveButton = <div onClick = {this.saveFile}
			style = {buttonStylesSave}>
						<p style = {{position:'absolute',textAlign:'center',
							height:'28px',width:'80px',marginTop:'5px'}}>
						Save
						</p>
					</div>;
			openButton = <div style = {buttonStylesOpen}>
						<p style = {{position:'absolute',textAlign:'center',
							height:'28px',width:'80px',marginTop:'5px'}}>
						Open
						</p>
						<input type = 'file' onChange = {this.openFile}
						style = {{opacity:0,position:'absolute',
							height:'28px',width:'80px','cursor':'pointer'}}/>
					</div>;
		} else {
			saveButton = [];
			openButton = [];
		}
		if (this.state.windowWidth > 325) {
			infoButton = <svg style = {{position:'fixed',left:280,top:10}} height = {30} width = {30}>
				<g style = {{cursor:this.state.infoButtonCursor}}
					onClick = {this.constructInfoScreen}
					onMouseEnter = {function(){this.setState({infoButtonCursor:'pointer'});}.bind(this)}
					onMouseLeave = {function(){this.setState({infoButtonCursor:'default'});}.bind(this)}>
						<circle cx = {15} cy = {15} r = {14.5} fill = 'white'/>
						<text x = {15} y = {23} textAnchor = 'middle' stroke = 'black'
							fontSize = {30} fontStyle = 'italic'>
						i
						</text>
				</g>
			</svg>;
		} else {
			infoButton = [];
		}
		//graph lines
		var xLimit = [0, this.foodWeb.finalTime];
		var yLimit = [0, this.foodWeb.YMax];
		var xAxisOffset = 100;
		var yAxisOffset = 40;
		var xAxisLength = (this.state.windowWidth-this.state.leftPosition)
			- xAxisOffset - 100;
		var yAxisLength = this.state.topPosition - yAxisOffset - 160;
		var bottomY = this.state.topPosition - yAxisOffset - 30;
		var noTicksX = 10;
		var noTicksY = 10;
		var tickLength = 10;
		//graph units per value
		var xTransform = xAxisLength/(xLimit[1] - xLimit[0]);
		var yTransform = yAxisLength/(yLimit[1] - yLimit[0]);
		
		var xTickSegment = (xLimit[1] - xLimit[0])/(noTicksX-1);
		var yTickSegment = (yLimit[1] - yLimit[0])/(noTicksY-1);
		var paths = [];
		if (xAxisLength > 0 && yAxisLength > 0) {
			for (var key in this.foodWeb.populations) {
				let i = this.foodWeb.nameIndices[key];
				let points = '';
				if (i !== undefined) {
					for (let j = 0; j < this.foodWeb.dataX.length; j++) {
						if (j === 0) {
							points += (this.foodWeb.dataX[j]*xTransform+xAxisOffset) + 
								' ' + (bottomY-yAxisOffset-this.foodWeb.dataY[j][i]*yTransform);
						} else if (this.foodWeb.dataX[j]< this.foodWeb.finalTime) {
							points += ',' + (this.foodWeb.dataX[j]*xTransform+xAxisOffset) +
								' ' + (bottomY-yAxisOffset-this.foodWeb.dataY[j][i]*yTransform);
						} else {
							break;
						}
					}
					paths.push(<polyline points = {points}
						key = {'path'+this.foodWeb.populations[key].name}
						stroke = {this.foodWeb.populations[key].popMarkerColor}
						strokeWidth = {2}
						fill = 'none'/>
					);
				}
			}
		}

		return (
			<div>
				<div className = 'topPanel'>
					<h1 className = 'topPanelText'>Food Web Explorer</h1>
					{infoButton}
					{openButton}
					{saveButton}
				</div>
			<div style = {moreStyles} 
				onMouseMove = {this.onMouseMove}
				onMouseUp = {this.onMouseUp}
				onMouseLeave = {this.onMouseLeave}>
				<FoodWebContainer style = {svgStylesLeft}
					offsetWeb = {this.offsetWeb}
					webOffsetX = {this.state.webOffsetX}
					webOffsetY = {this.state.webOffsetY}
					webWidth = {this.state.leftPosition}
					webHeight = {this.state.topPosition}
					textPosition = {69}
					buttonPositionY = {this.state.topPosition}
					destroyPopulation = {this.destroyPopulation}
					createPopulation = {this.createPopulation}
					onMouseUp = {this.unsetPopulationDraggable}
					onMouseLeave = {this.unsetPopulationDraggable}
					onMouseMove = {this.dragPopMarker}
					popMarkers = {popMarkers}
					foodWebLinks = {foodWebLinks}
					/>
				<VerticalDivider height = {this.state.topPosition}
					windowWidth = {this.state.windowWidth}
					left = {this.state.leftPosition} 
					onMouseDown = {this.hMouseDown}
					onMouseOver = {this.hMouseOver}
					onMouseOut = {this.hvMouseOut}/>
				<SimulationContainer style = {svgStylesRight}
					playStopButtonMouseOver = {this.playStopButtonMouseOver}
					playStopButtonMouseOut = {this.playStopButtonMouseOut}
					playButtonColor = {this.state.playButtonColor}
					stopButtonColor = {this.state.stopButtonColor}
					simParmsScreen = {this.setParameterScreenActive}
					getData = {this.getData}
					saveGraph = {this.saveGraph}
					simContainerWidth = {this.state.windowWidth-this.state.leftPosition}
					simContainerHeight = {this.state.topPosition}
					textPosition = {81}
					runSimulation = {this.runSimulationFull}
					stopSimulation = {this.stopSimulation}
					xLimit = {xLimit}
					yLimit = {yLimit}
					xAxisOffset = {xAxisOffset}
					yAxisOffset = {yAxisOffset}
					xAxisLength = {xAxisLength}
					yAxisLength = {yAxisLength}
					bottomY = {bottomY}
					noTicksX = {noTicksX}
					noTicksY = {noTicksY}
					tickLength = {tickLength}
					xTransform = {xTransform}
					yTransform = {yTransform}
					xTickSegment = {xTickSegment}
					yTickSegment = {yTickSegment}
					paths = {paths}/>
				<HorizontalDivider top = {this.state.topPosition}
					left = {this.state.leftPosition}
					windowHeight = {this.state.windowHeight}
					onMouseDown = {this.vMouseDown}
					onMouseOver = {this.vMouseOver}
					onMouseOut = {this.hvMouseOut}/>
				<ParametersContainer
					parameterSetters = {parameterSetters}
					style = {svgStylesBottom}
					textPosition = {76}
					height = {this.state.windowHeight-(this.state.topPosition+20)}
					/>
				<SimulationParameters 
					initialConditions = {initialConditions}
					simulationParametersScreenActive = {this.simulationParametersScreenActive}
					finalTimeChecked = {this.finalTimeChecked}
					finalTime = {this.foodWeb.finalTime}
					setFinalAsInitial = {this.setFinalAsInitial}
					changeFinalTime = {this.foodWeb.changeFinalTime.bind(this.foodWeb)}
					unsetParameterScreenActive = {this.unsetParameterScreenActive}
					setPopulationParameter = {this.setPopulationParameter}
					/>
			</div>
				{this.infoScreen}
				{linkDisplay}
			</div>
		);
	}
	//functions for resizing the three main windows
	onMouseMove(e){
		e.preventDefault();
		var state = {};
		if (this.state.draggableVertical) {
			if (e.clientX >= this.state.windowWidth-20) {
				state.leftPosition = this.state.windowWidth-20;
			} else {
				state.leftPosition = this.state.initialPositionLeft+(e.clientX-this.state.initialPositionLeft);
			}
			state.leftPositionPercent = state.leftPosition/this.state.windowWidth;
			state.cursor = 'col-resize';
		}
		if (this.state.draggableHorizontal) {
			if (e.clientY >= this.state.windowHeight-20) {
				state.topPosition = this.state.windowHeight-70;
			} else {
				state.topPosition = this.state.initialPositionTop+(-50+e.clientY-this.state.initialPositionTop);
			}
			state.cursor = 'row-resize';
		}
		this.setState(state);
	}
	
	onMouseLeave() {
		this.setState({draggableVertical: false,
			draggableHorizontal: false,
			cursor: 'default'});
	}
	
	hMouseDown(e) {
		e.preventDefault();
		this.setState({draggableVertical:true,
			initialPositionLeft:e.clientX});
	}
	
	vMouseDown(e) {
		e.preventDefault();
		this.setState({draggableHorizontal: true, 
			initialPositionTop: e.clientY-50});
	}

	hMouseOver() {
		this.setState({cursor: 'col-resize'});
	}
	
	vMouseOver() {
		this.setState({cursor: 'row-resize'});
	}

	hvMouseOut() {
		this.setState({cursor: 'default'});
	}
	
	onMouseUp() {
		this.setState({draggableVertical: false,
			draggableHorizontal: false,
			cursor: 'default'});
	}

	updateDimensions(){
		this.setState((prevState)=>({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			leftPosition: prevState.leftPositionPercent*window.innerWidth
		}));
	}

	onResize() {
		if (this.rqf) {
			return undefined;
		}
		if(typeof window !== 'undefined') {
			this.rqf = window.requestAnimationFrame(() => {
				this.rqf = null;
				this.generateParameterClickViews();
				this.updateDimensions();
			});
		}
	}

	createPopulation(){
		this.newlyCreated++;
		if (this.newlyCreated == 2) {
			this.linkDisplay = true;
		}
		this.foodWeb.addPopulation(this.state.leftPosition/2+40*Math.random()-this.state.webOffsetX,
			this.state.topPosition/2+40*Math.random()-this.state.webOffsetY);
		this.generateSinglePCV('pop'+this.foodWeb.counter);
		this.setState({});
	}

	unsetLinkDisplay() {
		this.linkDisplay = false;
		this.setState({});
	}

	destroyPopulation() {
		//which population called this function?
		//delete all links this population has
		//delete the population from the population array
		var selectedPop = this.foodWeb.currentPopulation;
		var selectedLink = this.foodWeb.currentLink;
		if (selectedPop!== undefined){
			//clean up food web links first
			this.foodWeb.populations[selectedPop].delete();
			delete this.foodWeb.populations[selectedPop];
			this.foodWeb.currentPopulation = undefined;
		} else if(selectedLink !== undefined) {
			//remove selected link
			var popOrigin = this.foodWeb.populations[selectedLink.split('_')[0]];
			var popEaten = this.foodWeb.populations[selectedLink.split('_')[1]];
			popOrigin.removeResource(popEaten);
			popEaten.removePredator(popOrigin);
		}
		this.generateParameterClickViews();
		this.setState({});
	}

	selectPopulation(callerName) {
		if (this.shiftPressed && this.foodWeb.currentPopulation!==undefined) {
			//set a food web link
			this.foodWeb.populations[this.foodWeb.currentPopulation].addResource(this.foodWeb.populations[callerName]);
			this.generateSinglePCV(this.foodWeb.currentPopulation);
		} else {
			this.foodWeb.selectObject(callerName);
		}
		this.setState({});
	}

	setPopulationDraggable(callerName,e) {
		e.preventDefault();
		this.draggable = callerName;
		this.foodWeb.populations[callerName].currentX = e.clientX;
		this.foodWeb.populations[callerName].currentY = e.clientY;
		this.setState({});
	}

	unsetPopulationDraggable() {
		if(this.draggable!==undefined) {
			this.foodWeb.populations[this.draggable].lastDx = this.foodWeb.populations[this.draggable].dx;
			this.foodWeb.populations[this.draggable].lastDy = this.foodWeb.populations[this.draggable].dy;
		}
		this.draggable = undefined;
		this.setState({});
	}

	dragPopMarker(e) {
		if (this.draggable !== undefined) {
			this.foodWeb.populations[this.draggable].move(e);
		}
	}

	//shift key pressed used to set food web links
	setShift(e){
		if (this.foodWeb.currentPopulation!==undefined && e.shiftKey) {
			this.shiftPressed = true;
		}
	}

	unsetShift(e){
		if (!e.shiftKey){
			this.shiftPressed = false;
		}
	}

	offsetWeb(direction, e) {
		e.preventDefault();
		switch(direction) {
		case 'right':
			this.setState(prevState => ({webOffsetX:(prevState['webOffsetX']+7)}));
			break;
		case 'left':
			this.setState(prevState => ({webOffsetX:(prevState['webOffsetX']-7)}));
			break;
		case 'up':
			this.setState(prevState => ({webOffsetY:(prevState['webOffsetY']+7)}));
			break;
		case 'down':
			this.setState(prevState => ({webOffsetY:(prevState['webOffsetY']-7)}));
			break;
		default:
			break;
		}
	}

	setParameterViewActive(callerName) {
		if (this.foodWeb.populations[callerName].parameterViewActive) {
			this.foodWeb.populations[callerName].parameterViewActive = false;
		} else {
			this.foodWeb.populations[callerName].parameterViewActive = true;
		}
		this.setState({});
	}

	setParameterScreenActive() {
		this.simulationParametersScreenActive = true;
		this.setState({});
	}

	unsetParameterScreenActive() {
		this.simulationParametersScreenActive = false;
		this.setState({});
	}

	setPopulationParameter(type, callerName, parmName, 
		forPopulationIndex, functionName, colorString, iValue, e) {
		var num;
		switch(type) {
		case 'label': 
			this.foodWeb.populations[callerName].label = e.target.value;
			break;
		case 'function':
			if (functionName === 'birth') {
				this.foodWeb.populations[callerName].birth = e.target.value;
			} else if (functionName === 'death') {
				this.foodWeb.populations[callerName].death = e.target.value;
			} else {
				this.foodWeb.populations[callerName].functionalResponse[forPopulationIndex] = e.target.value;
			}
			break;
		case 'parameter':
			num = Number(e.target.value);
			if (num >= 0) {
				this.foodWeb.populations[callerName].parameters[parmName] = num;
			} else {
				alert('Entry must be a non-negative number');
			}
			break;
		case 'consumptionParameter':
			num = Number(e.target.value);
			if (num >= 0) {
				this.foodWeb.populations[callerName].parameters[parmName][forPopulationIndex] = num;
			} else {
				alert('Entry must be a non-negative number');
			}
			break;
		case 'color':
			this.foodWeb.populations[callerName].popMarkerColor = colorString;
			this.foodWeb.populations[callerName].iValue = iValue;
			break;
		case 'initialCondition':
			num = Number(e.target.value);
			if (num >= 0) {
				this.foodWeb.populations[callerName].initialCondition = num;
			} else {
				alert('Entry must be a non-negative number');
			}
			break;
		default: break;
		}
		this.generateSinglePCV(callerName);
		this.setState({});
	}

	generateParameterClickViews() {
		var currentPop;
		this.parameterClickViews = {};
		for (let key in this.foodWeb.populations) {
			currentPop = this.foodWeb.populations[key];
			this.parameterClickViews[key] = 
				<ParameterClickView name = {currentPop.name}
					label = {currentPop.label}
					color = {currentPop.color}
					iValue = {currentPop.iValue}
					setPopulationParameter = {this.setPopulationParameter}
					parameterTable = {<ParameterTable 
						setPopulationParameter = {this.setPopulationParameter}
						pop = {currentPop}
						/>}
					windowWidth = {window.innerWidth}
					onArrowClick = {this.setParameterViewActive}/>;
		} 
	}

	generateSinglePCV(name) {
		var currentPop = this.foodWeb.populations[name];
		this.parameterClickViews[name] = 
			<ParameterClickView name = {currentPop.name}
				label = {currentPop.label}
				color = {currentPop.color}
				iValue = {currentPop.iValue}
				setPopulationParameter = {this.setPopulationParameter}
				parameterTable = {<ParameterTable 
					setPopulationParameter = {this.setPopulationParameter}
					pop = {currentPop}/>}
				windowWidth = {window.innerWidth}
				onArrowClick = {this.setParameterViewActive}/>;
	}

	runSimulationFull() {
		//prepare foodweb for simulation:
		this.playState = 'play';
		this.setState({playButtonColor:'red'});
		this.foodWeb.keyToArrayMapping();
		this.foodWeb.setY0();
		var simData = {};
		//copy the web data for creating equations only
		//for locating web worker resource
		simData.url = document.location.href;
		simData.fullRun = true;
		simData.web = this.foodWeb.copyForEquations();
		simData.y0 = this.foodWeb.y0;
		simData.currentTime = 0.0;
		simData.finalTime = this.foodWeb.finalTime;
		this.foodWeb.dataX = [];
		this.foodWeb.dataY = [];

		this.foodWeb.dataY.push(this.foodWeb.y0);
		this.foodWeb.dataX.push(0.0);
		this.simWorker.postMessage(simData);
		this.simWorker.onmessage = function(e) {
			for (var i = 1; i < e.data.soln.x.length; i++) {
				this.foodWeb.dataX.push(e.data.soln.x[i]);
				this.foodWeb.dataY.push(e.data.soln.y[i]);
			}
			this.foodWeb.calculateYMax();
			this.playState = 'stop';
			this.finalTimeChecked = false;
			this.setState({playButtonColor:'black'});
		}.bind(this);
	}

	stopSimulation() {
		this.simWorker.terminate();
		this.simWorker = new Worker(URL.createObjectURL(
			new Blob(['('+this.simWorkerFunction.toString()+')()'],
				{type: 'text/javascript'})));
		this.playState = 'stop';
		this.setState({playButtonColor:'black'});
	}

	playStopButtonMouseOver(name) {
		var state = {};
		state[name] = 'red';
		this.setState(state);
	}

	playStopButtonMouseOut(name) {
		if (!(this.playState === 'play' && name === 'playButtonColor')) {
			var state = {};
			state[name] = 'black';
			this.setState(state);
		}
	}

	setFinalAsInitial() {
		this.finalTimeChecked = this.finalTimeChecked?false:true;
		var index;
		if (this.finalTimeChecked) {
			for (let key in this.foodWeb.populations) {
				index = this.foodWeb.nameIndices[key];
				if (this.foodWeb.dataY.length > 0 && index !== undefined) {
					this.foodWeb.populations[key].initialCondition = 
					this.foodWeb.dataY[this.foodWeb.dataY.length-1][index];
				}
			}
		} else {
			for (let key in this.foodWeb.populations) {
				this.foodWeb.populations[key].initialCondition = 
				1.0;
			}
		}
		this.setState({});
	}

	getData() {
		//open a new window with the population data
		var newWindow = window.open();
		var newDocument = newWindow.document;
		var table = newDocument.createElement('table');
		var tableRow = newDocument.createElement('tr');
		var td = newDocument.createElement('td');
		var index;
		td.innerHTML = 'time';
		tableRow.appendChild(td);
		for (var key in this.foodWeb.populations) {
			td = newDocument.createElement('td');
			td.innerHTML = this.foodWeb.populations[key].label;
			tableRow.appendChild(td);
		}
		table.appendChild(tableRow);
		if (this.foodWeb.dataX.length > 0) {
			for (var j = 0; j < this.foodWeb.dataX.length; j++) {
				tableRow = newDocument.createElement('tr');
				td = newDocument.createElement('td');
				td.innerHTML = this.foodWeb.dataX[j];
				tableRow.appendChild(td);
				for (key in this.foodWeb.populations) {
					index = this.foodWeb.nameIndices[key];
					td = newDocument.createElement('td');
					td.innerHTML = this.foodWeb.dataY[j][index];
					tableRow.appendChild(td);
				}
				table.appendChild(tableRow);
			}
		}
		newDocument.body.appendChild(table);
	}

	saveGraph() {
		//render the graph on HTML canvas, and display as png
		//in a new window
		var newWindow = window.open();
		var newDocument = newWindow.document;
		var canvas = newDocument.createElement('canvas');
		canvas.setAttribute('id', 'graphCanvas');
		var context = canvas.getContext('2d');
		
		var xLimit = [0, this.foodWeb.finalTime];
		var yLimit = [0, this.foodWeb.YMax];
		var xAxisOffset = 100;
		var yAxisOffset = 40;
		var xAxisLength = this.state.windowWidth-this.state.leftPosition - xAxisOffset - 100;
		var yAxisLength = this.state.topPosition - yAxisOffset - 160;
		var bottomY = this.state.topPosition - yAxisOffset - 30;
		var noTicksX = 10;
		var noTicksY = 10;
		var tickLength = 10;
		//graph units per value
		var xTransform = xAxisLength/(xLimit[1] - xLimit[0]);
		var yTransform = yAxisLength/(yLimit[1] - yLimit[0]);
		//var xAxisTicks = [];
		//var yAxisTicks = [];
		
		var xTickSegment = (xLimit[1] - xLimit[0])/(noTicksX-1);
		var yTickSegment = (yLimit[1] - yLimit[0])/(noTicksY-1);
		canvas.setAttribute('width',this.state.windowWidth-this.state.leftPosition);
		canvas.setAttribute('height',this.state.topPosition);
		
		//x axis 0 tick
		context.beginPath();
		context.moveTo(xAxisOffset, bottomY-yAxisOffset);
		context.lineTo(xAxisOffset, bottomY-yAxisOffset+tickLength);
		context.stroke();

		context.font = '15px "Karla", sans-serif';
		context.textAlign = 'center';
		context.fillText(0, xAxisOffset,
			bottomY-yAxisOffset+tickLength+15);
		
		for (let i = 1; i < noTicksX; i++) {
			context.beginPath();
			context.moveTo(xAxisOffset+i*xTickSegment*xTransform, bottomY-yAxisOffset);
			context.lineTo(xAxisOffset+i*xTickSegment*xTransform, bottomY-yAxisOffset+tickLength);
			context.stroke();
			
			context.font = '15px "Karla", sans-serif';
			context.textAlign = 'center';
			context.fillText(tickParser(i*xTickSegment),
				xAxisOffset+i*xTickSegment*xTransform,
				bottomY-yAxisOffset+tickLength+15);
		}
		context.beginPath();
		context.moveTo(xAxisOffset, bottomY-yAxisOffset);
		context.lineTo(xAxisOffset-tickLength, bottomY-yAxisOffset);
		context.stroke();
		
		context.font = '15px "Karla", sans-serif';
		context.textAlign = 'center';
		context.fillText(0, xAxisOffset-tickLength-25,
			bottomY-yAxisOffset+5);
		
		for (let i = 1; i < noTicksY; i++) {
			context.beginPath();
			context.moveTo(xAxisOffset, bottomY-yAxisOffset-yTickSegment*i*yTransform);
			context.lineTo(xAxisOffset-tickLength, bottomY-yAxisOffset-yTickSegment*i*yTransform);
			context.stroke();

			context.font = '15px "Karla", sans-serif';
			context.textAlign = 'center';
			context.fillText(tickParser(i*yTickSegment),xAxisOffset-tickLength-25,
				bottomY-yAxisOffset-yTickSegment*i*yTransform+5);
		}
		for (var key in this.foodWeb.populations) {
			let i = this.foodWeb.nameIndices[key];
			for (let j = 1; j < this.foodWeb.dataX.length; j++) {
				if (this.foodWeb.dataX[j] > this.foodWeb.finalTime) {
					break;
				}
				context.beginPath();
				context.moveTo(this.foodWeb.dataX[j-1]*xTransform+xAxisOffset,
					bottomY-yAxisOffset-this.foodWeb.dataY[j-1][i]*yTransform);
				context.lineTo(this.foodWeb.dataX[j]*xTransform+xAxisOffset,
					bottomY-yAxisOffset-this.foodWeb.dataY[j][i]*yTransform);
				context.lineWidth = 2;
				context.strokeStyle = this.foodWeb.populations[key].popMarkerColor; 
				context.stroke();
			}
		}
		//x axis label
		context.textAlign = 'center';
		context.font = '15px "Karla", sans-serif';
		context.fillText('Time', xAxisOffset+xAxisLength/2, bottomY+20);
		//y axis label
		context.save();
		context.translate(20, bottomY-yAxisOffset-yAxisLength/2);
		context.rotate(-Math.PI/2);
		context.textAlign = 'center';
		context.font = '15px "Karla", sans-serif';
		context.fillText('Population Size', 0, 0);
		context.restore();
		
		//y axis
		context.beginPath();
		context.moveTo(xAxisOffset, bottomY-yAxisOffset);
		context.lineTo(xAxisOffset, bottomY-yAxisOffset-yAxisLength);
		context.lineWidth = 2;
		context.strokeStyle = 'black';
		context.stroke();

		//x axis
		context.beginPath();
		context.moveTo(xAxisOffset, bottomY-yAxisOffset);
		context.lineTo(xAxisOffset+xAxisLength, bottomY-yAxisOffset);
		context.lineWidth = 2;
		context.strokeStyle = 'black';
		context.stroke();

		var canvasImage = canvas.toDataURL('image/png');
		var image = newDocument.createElement('img');
		image.setAttribute('src', canvasImage);
		newDocument.body.appendChild(image);
	}

	openFile(evt) {
		var file = evt.target.files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(e){
			try {
				this.loadedWeb = JSON.parse(e.target.result);
				//check for consistent data
				this.checkLoadedJSON();
				//erase the current food web
				for (var key in this.foodWeb.populations) {
					this.foodWeb.currentPopulation = key;
					this.destroyPopulation();
				}
				//create new food web based on the data
				this.foodWeb = new FoodWeb();
				this.foodWeb.recreateFromJSON(this.loadedWeb);
				this.generateParameterClickViews();
				this.finalTimeChecked = false;
				this.newlyCreated = 0;
				this.setState({});
			} catch (e) {
				alert(e.message);
			}
		}.bind(this);
		fileReader.readAsText(file);
	}

	checkLoadedJSON() {
		this.loadedWeb;
		//check list of keys and associated objects for food web 
		for (var key in this.loadedWeb) {
			if (this.webKeyCheck[key]) {
				if (this.webKeyCheck[key] !== typeof this.loadedWeb[key]) {
					throw new Error('JSON file corrupted!');
				}
			} else {
				throw new Error('JSON file corrupted!');
			}
		}
		//check list of keys and associated objects for each population
		for (var popKey in this.loadedWeb.populations) {
			for (key in this.loadedWeb.populations[popKey]) {
				if (this.popKeyCheck[key]) {
					if (this.popKeyCheck[key] !== typeof this.loadedWeb.populations[popKey][key]) {
						throw new Error('JSON file corrupted!');
					}
				} else {
					throw new Error('JSON file corrupted!');
				}
			}
		}
	}

	saveFile() {
		var webObj = {counter: this.foodWeb.counter, populations:{},
			currentPopulation: this.foodWeb.currentPopulation,
			currentLink: this.foodWeb.currentLink, finalTime:this.foodWeb.finalTime,
			nameIndices: this.foodWeb.nameIndices, y0:this.foodWeb.y0,
			dataX: this.foodWeb.dataX, dataY:this.foodWeb.dataY,
			YMax: this.foodWeb.YMax};
		var pop, populs = {}, consArray = [], eatenArray = [];
		for (var key in this.foodWeb.populations) {
			pop = this.foodWeb.populations[key];
			populs[key] = {};
			populs[key]['name'] = pop.name;
			populs[key]['label'] = pop.label;
			populs[key]['popMarkerColor'] = pop.popMarkerColor;
			populs[key]['birth'] = pop.birth;
			populs[key]['death'] = pop.death;
			populs[key]['parameters'] = pop.parameters;
			populs[key]['functionalResponse'] = pop.functionalResponse;
			populs[key]['initialCondition'] = pop.initialCondition;
			populs[key]['initialCx'] = pop.initialCx;
			populs[key]['initialCy'] = pop.initialCy;
			populs[key]['iValue'] = pop.iValue;
			populs[key]['currentX'] = pop.currentX;
			populs[key]['currentY'] = pop.currentY;
			populs[key]['dx'] = pop.dx;
			populs[key]['dy'] = pop.dy;
			populs[key]['lastDx'] = pop.lastDx;
			populs[key]['lastDy'] = pop.lastDy;
			populs[key]['click'] = pop.click;
			populs[key]['currentLineX1'] = pop.currentLineX1;
			populs[key]['currentLineY1'] = pop.currentLineY1;
			populs[key]['transform'] = pop.transform;
			populs[key]['fill'] = pop.fill;
			consArray = [];
			eatenArray = [];
			for(var i = 0; i < pop.consumes.length; i++) {
				consArray.push(pop.consumes[i].name);
			}
			for (i = 0; i < pop.eatenBy.length; i++) {
				eatenArray.push(pop.eatenBy[i].name);
			}
			populs[key]['consumes'] = consArray;
			populs[key]['eatenBy'] = eatenArray;
		}
		webObj.populations = populs;
		var jsonWeb = JSON.stringify(webObj);
		var url = 'data:text/json,' + encodeURIComponent(jsonWeb);
		window.open(url, '_blank');
	}

	constructInfoScreen() {
		var infoDivStyle = {position: 'fixed', left: (window.innerWidth/2-300),
			width: 600, height: 600, top: 50,
			fontFamily: '"Karla", sans-serif', backgroundColor:'rgba(220,220,220,0.9)',
			border: '2px solid black', textAlign:'center',
			boxShadow: '5px 5px 4px rgb(100,100,100)',
			overflow: 'scroll'};
		this.infoScreen = <div style = {infoDivStyle}>
			<svg style = {{position: 'absolute', left: 571, top: 5}} width = {24} height = {24}>
				<g style = {{'cursor': 'pointer'}}
					onClick = {this.destructInfoScreen}>
					<rect x = {0} y = {0} width = {24} height = {24} fill = 'rgb(180, 180, 180)'/>
					<line x1 = {1} y1 = {1} x2 = {23} y2 = {23}
						stroke = 'red'
						strokeWidth = {3}/>
					<line x1 = {1} y1 = {23} x2 = {23} y2 = {1}
						stroke = 'red'
						strokeWidth = {3}/>
				</g>
			</svg>
			<h1> <u>About Food Web Explorer</u></h1>
			<p style = {{position: 'relative', textAlign: 'left', 
				width: '580px', height:'100%', left: '10px'}}> 
			Explore the effects of food chains and webs on population dynamics and species coexistence.  
			Graphically design food webs in the "Food Web Editor".  
			Set functional forms and parameters for each population in the "Parameters Setter" section.  
			Then, run numerical simulations of your food web in the "Simulation Runner" section.  
			Food Web Explorer translates your graphical model to a system of differential equations.
			<br />
			<br />
			To get started, in the "Food Web Editor", click the 'plus' button to create a population.  
			You can create as many populations as you would like.  Click and drag to move population markers.  
			To create a feeding link between two populations - first, select a consumer/predator by clicking on a population, 
			hold shift, then click on any other population to make it a resource/prey of the originally selected population.  
			If you make a mistake, you can select populations or links, and delete them with the 'minus' button.
			<br />
			<br />
			Next, pull up the "Parameters Setter" section (resize any section by clicking and dragging the gray dividers).  
			Click on a population in the list to open an editable table of parameters.  
			Here, you can edit the population's name and color as well as functions and parameters.
			<br />
			<br />
			Once you have the food web set up how you want it, you can run numerical simulations in the "Simulation Runner" section.  
			To set initial conditions for each population, click on the "Set Simulation Parameters" button.  
			Once initial conditions are set, run the model by clicking on the 'play' button above the graph.  
			If the simulation is taking too long and slowing down your computer, you can cancel a simulation 
			by clicking the 'stop' button above the graph.  In the "Simulation Runner" section you can also generate the graph and data to save.  
			Clicking on the "Get graph" or "Get data" buttons will open a new window with a graph or the data.  
			With the new window open, to save the graph, right click it and select "Save Image As...".  
			To save the data, just copy and paste it into a text file.
			<br />
			<br />
			Food Web Explorer also gives you the option to save your food web project and come back to it later.  
			Click the "Save" button in the upper right corner.  
			As with the graphs, this will open a new window containing the data to save.  
			Click "File" from your web browser's menu and save the file as *.json.  
			To open a file that you have previously saved, click the "Open" button in the 
			upper right corner, and select your *.json file.
			</p>
		</div>;
		this.setState({});
	}

	destructInfoScreen() {
		this.infoScreen = [];
		this.setState({});
	}

	componentDidMount() {
		this.updateDimensions();
		if( typeof window !== 'undefined' ) {
			window.addEventListener('resize', this.onResize);
			window.addEventListener('keydown', this.setShift);
			window.addEventListener('keyup', this.unsetShift);
		}
	}

	componentWillUnmount() {
		if( typeof window !== 'undefined' ) {
			window.removeEventListener('resize', this.onResize);
			window.removeEventListener('keydown', this.setShift);
			window.removeEventListener('keyup', this.unsetShift);
		}
	}

	//web worker function defined in this file, necessary for 
	//chrome compatibility, this function will be exported as a blob
	//have to disable linting errors
	/*eslint-disable no-undef*/
	simWorkerFunction() {
		function createFoodWebEquations(foodWebObject) {
			var foodWebEquations = function(t,y) {
				var key, i, j, index, parameters, dy, popNumber;
				//switch cases for constructing each population with different options
				popNumber = Object.keys(foodWebObject.populations).length;
				dy = new Array(popNumber);
				for (i = 0; i < popNumber; i++) {
					dy[i] = 0;
				}
				i = 0;
				for (key in foodWebObject.populations) {
					parameters = foodWebObject.populations[key].parameters;
					switch(foodWebObject.populations[key].birth) {
					case 'none': break;
					case 'exponential': dy[i] += y[i]*parameters['r']; break;
					case 'chemostat': dy[i] += parameters['D']*(parameters['S']-y[i]); break;
					case 'logistic': dy[i] += y[i]*parameters['r']*(1-y[i]/parameters['K']); break;
					default: break;
					}

					switch(foodWebObject.populations[key].death) {
					case 'none': break;
					case 'constantPerCapita': dy[i] -= parameters['d']*y[i]; break;
					default: break;
					}

					for (j = 0; j < foodWebObject.populations[key].consumes.length; j++) {
						index = foodWebObject.nameIndices[foodWebObject.populations[key].consumes[j]];
						switch (foodWebObject.populations[key].functionalResponse[j]) {
						case 'type1': 
							dy[i] += parameters['b'][j]*parameters['a'][j]*y[index]*y[i];
							dy[index] -= parameters['a'][j]*y[index]*y[i];
							break;
						case 'type2': 
							dy[i] += y[i]*parameters['b'][j]*(parameters['a'][j]*y[index])/(1+parameters['a'][j]*parameters['h'][j]*y[index]);
							dy[index] -= y[i]*(parameters['a'][j]*y[index])/(1+parameters['a'][j]*parameters['h'][j]*y[index]);
							break;
						default: break;
						}
					}
					i++;
				}
				return dy;
			};
			return foodWebEquations;
		}
		var odes;

		onmessage = function(e) {
			importScripts(e.data.url + 'dependencies/numericjs/numeric-1.2.6.js');
			var soln, result = {};
			var time = 0.0, localSoln, currentY0 = e.data.y0;
			if (e.data.fullRun) {
				//construct the equations
				odes = createFoodWebEquations(e.data.web);
				soln = {};
				soln['x'] = [];
				soln['y'] = [];
				while(time < e.data.finalTime) {
					if (time > e.data.finalTime-1.0) {
						localSoln = numeric.dopri(time, e.data.finalTime, currentY0, odes);
						time = e.data.finalTime;
						currentY0 = localSoln.y[localSoln.y.length-1];
					} else {
						localSoln = numeric.dopri(time, time+1.0, currentY0, odes);
						time += 1.0;
						currentY0 = localSoln.y[localSoln.y.length-1];
					}
					for (var i = 1; i < localSoln.x.length; i++) {
						soln.x.push(localSoln.x[i]);
						soln.y.push(localSoln.y[i]);
					}
				}
			} else {
				if (e.data.first) {
					//construct the equations
					odes = createFoodWebEquations(e.data.web);
					if ((e.data.currentTime+1.0) <= e.data.finalTime) {
						soln = numeric.dopri(e.data.currentTime, e.data.currentTime+1.0, e.data.y0, odes);
						result.currentTime = e.data.currentTime+1.0;
					} else {
						soln = numeric.dopri(e.data.currentTime, e.data.finalTime, e.data.y0, odes);
						result.currentTime = e.data.finalTime;
					}
				} else {
					//just solve the equations
					if ((e.data.currentTime+1.0) <= e.data.finalTime) {
						soln = numeric.dopri(e.data.currentTime, e.data.currentTime+1.0, e.data.y0, odes);
						result.currentTime = e.data.currentTime+1.0;
					} else {
						soln = numeric.dopri(e.data.currentTime, e.data.finalTime, e.data.y0, odes);
						result.currentTime = e.data.finalTime;
					}
				}
			}
			result.soln = soln;
			postMessage(result);
		};
	}
	/*eslint-enable no-undef*/
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);