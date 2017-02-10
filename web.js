import Population from './pop.js';
//food web object definition
export default function FoodWeb() {
	this.counter = 0; //number of populations, used internally for labeling populations
	this.populations = {}; //object of populations in the food web
	this.currentPopulation = undefined; //selected population
	this.currentLink = undefined;
	this.finalTime = 1000.0; //simulation final time
	this.nameIndices = {};
	this.y0 = [];
	this.dataX = [];
	this.dataY = [];
	this.YMax = 100;
	this.stop = false;

	this.selectObject = function(callerName) {
		//check whether caller is a population or a link
		var nameArray = callerName.split('_');
		if (nameArray.length === 1) {
			//population caller
			//check whether a link is selected
			if (this.currentLink!==undefined){
				this.populations[this.currentLink.split('_')[0]].unselectLinkDisplay(this.currentLink);
				this.currentLink = undefined;
			}
			this.selectPopulation(callerName);
		} else {
			//link caller
			//check whether any population is selected
			if (this.currentPopulation !== undefined) {
				this.populations[this.currentPopulation].unselectDisplay();
				this.currentPopulation = undefined;
			}
			this.selectLink(callerName);
		}
	};

	this.selectPopulation = function(callerName) { //select a population
		if (this.currentPopulation === callerName) {
			//unselect population
			this.currentPopulation = undefined;
			this.populations[callerName].unselectDisplay();
		} else {
			//unselect any selected population
			if (this.currentPopulation !== undefined) {
				this.populations[this.currentPopulation].unselectDisplay();
			}
			//select population
			this.currentPopulation = callerName;
			this.populations[callerName].selectDisplay();
		}
	};

	this.selectLink = function(callerName) {
		if (this.currentLink === callerName) {
			//unselect link
			this.currentLink = undefined;
			this.populations[callerName.split('_')[0]].unselectLinkDisplay(callerName);
		} else {
			//unselect any selected link
			if (this.currentLink !== undefined) {
				this.populations[this.currentLink.split('_')[0]].unselectLinkDisplay(this.currentLink);
			}
			//select link
			this.currentLink = callerName;
			this.populations[callerName.split('_')[0]].selectLinkDisplay(callerName);
		}
	};

	this.addPopulation = function(initialCx, initialCy) { //add a new population
		this.counter++;
		this.populations[('pop'+this.counter)] = new Population(this.counter, 
			initialCx, initialCy);
	};

	this.keyToArrayMapping = function() {
		var i = 0;
		for (var key in this.populations) {
			this.nameIndices[key] = i;
			i++;
		}
	};

	this.setY0 = function() {
		var totalPops = Object.keys(this.populations).length;
		this.y0 = new Array(totalPops);
		var index;
		for (var key in this.populations) {
			index = this.nameIndices[key];
			this.y0[index] = this.populations[key].initialCondition;
		}
	};

	this.constructFoodWebEquations = function() { //construct the system of Ordinary Differential Equations
		//from the food web
		this.keyToArrayMapping();
		this.setY0();
		var that = this;
		var foodWebEquations = function(t,y) {
			var key, i, j, index, parameters, dy, popNumber;
			//switch cases for constructing each population with different options
			popNumber = Object.keys(that.populations).length;
			dy = new Array(popNumber);
			for (i = 0; i < popNumber; i++) {
				dy[i] = 0;
			}
			i = 0;
			for (key in that.populations) {
				parameters = that.populations[key].parameters;
				switch(that.populations[key].birth) {
				case 'none': break;
				case 'exponential': dy[i] += y[i]*parameters['r']; break;
				case 'chemostat': dy[i] += parameters['D']*(parameters['S']-y[i]); break;
				case 'logistic': dy[i] += y[i]*parameters['r']*(1-y[i]/parameters['K']); break;
				default: break;
				}

				switch(that.populations[key].death) {
				case 'none': break;
				case 'constantPerCapita': dy[i] -= parameters['d']*y[i]; break;
				default: break;
				}

				for (j = 0; j < that.populations[key].consumes.length; j++) {
					index = that.nameIndices[that.populations[key].consumes[j].name];
					switch (that.populations[key].functionalResponse[j]) {
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
	};

	this.calculateYMax = function() {
		var popNumber = Object.keys(this.populations).length;
		this.YMax = -1;
		for (var i = 0; i < popNumber; i++) {
			for (var j = 0; j < this.dataX.length; j++) {
				this.YMax = this.dataY[j][i]>this.YMax?this.dataY[j][i]:this.YMax;
			}
		}
	};

	this.copyForEquations = function() {
		var webCopy = {};
		var pops = {};
		for (var key in this.populations) {
			pops[key] = this.populations[key].copyPopForEquations();
		}
		webCopy['nameIndices'] = this.nameIndices;
		webCopy['populations'] = pops;
		return webCopy;
	};

	this.changeFinalTime = function(e) {
		var num = Number(e.target.value);
		if (num >= 0) {
			this.finalTime = num;
		} else {
			alert('Entry must be a non-negative number');
		}
	};

	this.recreateFromJSON = function(webObject) {
		//set  all the fields
		var i, name;
		this.counter = webObject.counter; //number of populations, used internally for labeling populations
		this.currentPopulation = webObject.currentPopulation; //selected population
		this.currentLink = webObject.currentLink;
		this.finalTime = webObject.finalTime; //simulation final time
		this.nameIndices = webObject.nameIndices;
		this.y0 = webObject.y0;
		this.dataX = webObject.dataX;
		this.dataY = webObject.dataY;
		this.YMax = webObject.YMax;
		this.populations = {};
		var num = 0;
		for (var key in webObject.populations) {
			this.populations[key] = new Population(num, 
			0, 0);
			this.populations[key].recreatePopFromJSON(webObject.populations[key]);
			num++;
		}
		for (key in webObject.populations) {
			for (i = 0; i < this.populations[key].consumes.length; i++) {
				name = webObject.populations[key].consumes[i];
				this.populations[key].consumes[i] = this.populations[name];
			}
			for (i = 0; i < this.populations[key].eatenBy.length; i++) {
				name = webObject.populations[key].eatenBy[i];
				this.populations[key].eatenBy[i] = this.populations[name];
			}
		}
	};
}