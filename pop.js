export default function Population(nameNumber, initialCx, initialCy) {
	this.birth = 'logistic'; //function describing birth (excluding consumption)
	this.death = 'none'; //function describing death rate
	this.functionalResponse = []; //array of functional responses
	this.consumes = []; //array of which populations this one consumes (names)
	this.eatenBy = []; //array of which population consumes this one (names)
	this.parameters = {
		r:1.0, //intrinsic growth rate
		K:100.0, //resource carrying capacity
		d:0.01, //per capita death rate
		D:0.1, //dilution rate for chemostat growth
		S:100.0, //resource supply point for chemostat growth
		a:[], //reosurce encounter rates
		b:[], //birth conversion efficiency
		h:[] // resource handling times
	};
	this.initialCondition = 1.0; //initial population size
	this.parametersScreenActive = false; //flag for display of parameter screen
	this.name = 'pop'+nameNumber; //population name for internal use
	this.label = this.name; //population name for external display
	this.initialCx = initialCx; //initial x position of population marker
	this.initialCy = initialCy; //initial y position of population marker
	this.popMarkerRadius = 50; //size of population marker
	this.popMarkerColor = 'black';
	this.iValue = 99; //for keeping track of position on colorPicker svg
	this.arrowHeadSize = 10; //arrow head size for food web arrows
	this.currentX = this.initialCx; //current x position of population marker
	this.currentY = this.initialCy; //current y position of population marker
	this.dx = 0; //x change in population marker location
	this.dy = 0; //y change in population marker location
	this.lastDx = 0; //previous x for population marker location
	this.lastDy = 0; //previous y for population marker location
	this.click = false; //flag for whether population marker is clicked
	this.currentLineX1 = this.initialCx; //x start of lines originating or ending at this population marker 
	this.currentLineY1 = this.initialCy; //y start of lines originating or ending at this population marker
	this.transform = '';
	this.fill = 'white';
	this.selectedLinkColor = 'rgb(200,200,200)';
	this.selectedLinkName = undefined;
	this.parameterViewActive = false;
	this.populationMarker;
	this.delete = function() {
		//delete the other populations links to this population
		for (var i = 0; i < this.eatenBy.length; i++) {
			this.eatenBy[i].removeResource(this);
		}
	};
	
	this.addResource = function(pop) {
		//first check whether or not the population already eats this population
		var alreadyEats = false;
		for (var i = 0; i < this.consumes.length; i++) {
			if (this.consumes[i] === pop){
				alreadyEats = true;
				break;
			}
		}
		if ((!alreadyEats)&&(this !== pop)) {
			if (this.consumes.length === 0) {
				this.birth = 'none';
				this.death = 'constantPerCapita';
			}
			this.consumes.push(pop);
			pop.eatenBy.push(this);
			//set default functional response parameters
			this.parameters['a'].push(0.1);
			this.parameters['b'].push(0.1);
			this.parameters['h'].push(1.0);
			this.functionalResponse.push('type1');
		}
	};

	this.removeResource = function(pop) {
		for (var i = 0; i < this.consumes.length; i++) {
			if (this.consumes[i] === pop){
				//remove resource and associated parameters
				this.consumes.splice(i,1);
				this.parameters['a'].splice(i,1);
				this.parameters['b'].splice(i,1);
				this.parameters['h'].splice(i,1);
				this.functionalResponse.splice(i,1);
				break;
			}
		}
	};

	this.removePredator = function(pop){
		for (var i = 0; i < this.eatenBy.length; i++) {
			if (this.eatenBy[i] === pop){
				this.eatenBy.splice(i,1);
				var index = pop.consumes.indexOf(this);
				pop.parameters['a'].splice(index,1);
				pop.parameters['b'].splice(index,1);
				pop.parameters['h'].splice(index,1);
				pop.functionalResponse.splice(index,1);
				//delete pop.foodWebLinks[(pop.name+'_'+this.name)];
				break;
			}
		}
	};

	this.selectDisplay = function() {
		this.selected = true;
		this.fill = 'rgb(200,200,200)';
	};

	this.selectLinkDisplay = function(callerName) {
		this.selectedLinkName = callerName;
	};

	this.unselectDisplay = function() {
		this.selected = false;
		this.fill = 'white';
	};

	this.unselectLinkDisplay = function() {
		this.selectedLinkName = undefined;
	};

	this.move = function(evt) { //function to drag a population marker
		this.dx = this.lastDx + evt.clientX - this.currentX;
		this.dy = this.lastDy + evt.clientY - this.currentY;
		this.currentLineX1 = this.initialCx+this.dx;
		this.currentLineY1 = this.initialCy+this.dy;
		this.transform = 'translate(' + this.dx +','+ this.dy +')';
	};
	
	this.createSVGArrowHeadPath = function(pop) { //calculates svg arrowhead drawings
		//based on locations of population markers
		var x1 = this.initialCx+this.dx;
		var y1 = this.initialCy+this.dy;
		var x2 = pop.initialCx+pop.dx;
		var y2 = pop.initialCy+pop.dy;
		//add 1 to compensate for the line width of pop marker
		var markerRadius = this.popMarkerRadius+1;
		var arrowHeadSize = this.arrowHeadSize;
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);
		var theta = Math.atan(dy/dx);
		var dxHeadPoint = markerRadius*Math.cos(theta);
		var dyHeadPoint = markerRadius*Math.sin(theta);
		var dxMidPointBase = (markerRadius+arrowHeadSize)*Math.cos(theta);
		var dyMidPointBase = (markerRadius+arrowHeadSize)*Math.sin(theta);
		var pointX1 = 0, pointY1 = 0, pointMidBaseX = 0, pointMidBaseY = 0;
		if (x1 > x2) {
			pointX1 = x1 - dxHeadPoint;
			pointMidBaseX = x1 - dxMidPointBase;
		} else {
			pointX1 = x1 + dxHeadPoint;
			pointMidBaseX = x1 + dxMidPointBase;
		}
		if (y1 > y2) {
			pointY1 = y1 - dyHeadPoint;
			pointMidBaseY = y1 - dyMidPointBase;
		} else {
			pointY1 = y1 + dyHeadPoint;
			pointMidBaseY = y1 + dyMidPointBase;
		}
		var tempTheta = Math.atan(Math.abs(pointY1-pointMidBaseY)/Math.abs(pointX1-pointMidBaseX));
		var dxSidePoint = arrowHeadSize*Math.sin(tempTheta);
		var dySidePoint = arrowHeadSize*Math.cos(tempTheta);
		var sidePointX1 = 0, sidePointY1 = 0, sidePointX2 = 0, sidePointY2 = 0;
		if (x1>x2 && y1>y2){
			sidePointX1 = pointMidBaseX + dxSidePoint;
			sidePointY1 = pointMidBaseY - dySidePoint;
			sidePointX2 = pointMidBaseX - dxSidePoint;
			sidePointY2 = pointMidBaseY + dySidePoint;
		} else if (x1<x2 && y1<y2) {
			sidePointX1 = pointMidBaseX + dxSidePoint;
			sidePointY1 = pointMidBaseY - dySidePoint;
			sidePointX2 = pointMidBaseX - dxSidePoint;
			sidePointY2 = pointMidBaseY + dySidePoint;
		} else if (x1>x2 && y1<y2) {
			sidePointX1 = pointMidBaseX + dxSidePoint;
			sidePointY1 = pointMidBaseY + dySidePoint;
			sidePointX2 = pointMidBaseX - dxSidePoint;
			sidePointY2 = pointMidBaseY - dySidePoint;
		} else {
			sidePointX1 = pointMidBaseX + dxSidePoint;
			sidePointY1 = pointMidBaseY + dySidePoint;
			sidePointX2 = pointMidBaseX - dxSidePoint;
			sidePointY2 = pointMidBaseY - dySidePoint;
		}
		return pointX1 + ' ' + pointY1 + ',' + sidePointX1 +
		' ' + sidePointY1 + ',' + sidePointX2 + ' ' + sidePointY2;
	};

	this.copyPopForEquations = function() {
		var popCopy = {};
		popCopy['parameters'] = this.parameters;
		popCopy['birth'] = this.birth;
		popCopy['death'] = this.death;
		popCopy['consumes'] = [];
		popCopy['eatenBy'] = [];
		popCopy['functionalResponse'] = [];
		for (var i = 0; i < this.consumes.length; i++) {
			popCopy.consumes.push(this.consumes[i].name);
			popCopy.functionalResponse.push(this.functionalResponse[i]);
		}
		for (i = 0; i < this.eatenBy.length; i++) {
			popCopy.eatenBy.push(this.eatenBy[i].name);
		}
		return popCopy;
	};

	this.recreatePopFromJSON = function(popObject) {
		//copy over fields
		this.name = popObject.name;
		this.label = popObject.label;
		this.popMarkerColor = popObject.popMarkerColor;
		this.birth = popObject.birth;
		this.death = popObject.death;
		this.parameters = popObject.parameters;
		this.functionalResponse = popObject.functionalResponse;
		this.initialCondition = popObject.initialCondition;
		this.initialCx = popObject.initialCx;
		this.initialCy = popObject.initialCy;
		this.iValue = popObject.iValue;
		this.currentX = popObject.currentX;
		this.currentY = popObject.currentY;
		this.dx = popObject.dx;
		this.dy = popObject.dy;
		this.lastDx = popObject.lastDx;
		this.lastDy = popObject.lastDy;
		this.click = popObject.click;
		this.currentLineX1 = popObject.currentLineX1;
		this.currentLineY1 = popObject.currentLineY1;
		this.transform = popObject.transform;
		this.fill = popObject.fill;
		// after all the populations are created,
		//the pop names in the links below are 
		//replaced with real populations in the food web
		this.consumes = popObject.consumes;
		this.eatenBy = popObject.eatenBy;
	};
}