var compose = require('ksf/utils/compose');
var _ContentDelegate = require('absolute/_ContentDelegate');
var Elmt = require('absolute/Element');

module.exports = compose(_ContentDelegate, function() {
	this._content = this._svgElmt = new Elmt('svg', "http://www.w3.org/2000/svg").attrs({
		preserveAspectRatio: 'xMidYMid meet',
		viewBox: "-10 -10 120 120"
	});

	this._circleNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	this._circleNode.setAttribute('cx', 50);
	this._circleNode.setAttribute('cy', 50);
	this._circleNode.setAttribute('r', 50);
	this._circleNode.setAttribute('fill', 'none');
	this._circleNode.setAttribute('stroke-width', 3);
	this._svgElmt.domNode.appendChild(this._circleNode);
	this._checkNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
	this._checkNode.setAttribute('d', 'M72 25L42 71 27 56l-4 4 20 20 34-52z');
	this._checkNode.setAttribute('fill', '#5dc2af');
	this._svgElmt.domNode.appendChild(this._checkNode);
}, {
	checked: function(checked) {
		if (arguments.length) {
			this._checked = checked;
			this._circleNode.setAttribute('stroke', checked ? '#bddad5' : '#ededed');
			this._checkNode.style.display = checked ? null : 'none';
			return this;
		} else {
			return this._checked;
		}
	}
});