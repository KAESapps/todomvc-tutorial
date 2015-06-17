(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Align.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Align = require('./layout/Align');

/**
Aligne un composant horizontalement et verticalement
@param content(component)
@param horizontal (left|middle|right)
@param vertical (top|middle|bottom)
*/

var horizontalAlign = {
	left: 'head',
	middle: 'middle',
	right: 'tail',
};
var verticalAlign = {
	top: 'head',
	middle: 'middle',
	bottom: 'tail',
};

module.exports = compose(function(content, horizontal, vertical) {
	this._content = content;
	this._horizontalLayouter = new Align('horizontal', content, horizontalAlign[horizontal]);
	this._verticalLayouter = new Align('vertical', content, verticalAlign[vertical]);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
});
},{"./layout/Align":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Align.js","./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Background.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');
var capitalize = require('lodash/string/capitalize');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this._bg = new Elmt();
	this._content = new ZPile().content([
		this._bg,
		content
	]);
}, {
	color: function(color) {
		this._bg.styleProp('backgroundColor', color);
		return this;
	},
	border: function(border) {
		if (typeof border === 'string') {
			this._bg.styleProp('border', border);
		} else {
			for (var p in border) {
				this._bg.styleProp('border' + capitalize(p), border[p]);
			}
		}
		return this;
	},
});

},{"./Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","./ZPile":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/ZPile.js","./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js","lodash/string/capitalize":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/lodash/string/capitalize.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Container.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');


module.exports = compose(function(content) {
	this._content = content;
	this._visible = true;
}, {
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			this._content.forEach(function(cmp) {
				cmp.parentNode(node);
			});
			return this;
		} else {
			return this._parentNode;
		}
	},
	containerVisible: function(containerVisible) {
		this._containerVisible = containerVisible;
		this._applyVisible();
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			this._applyVisible();
			return this;
		} else {
			return this._visible;
		}
	},
	_applyVisible: function() {
		if (this._containerVisible === undefined) { return; }
		var visible = this._containerVisible && this._visible;
		this._content.forEach(function(cmp) {
			cmp.containerVisible(visible);
		});
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var JSS = require('ksf/dom/style/JSS');

var baseStyle = new JSS({
	position: 'absolute',
	boxSizing: 'border-box',
	// est-ce nécessaire de le forcer au démarrage ?
	display: 'block',
	// nécessaire pour les cas où cet élément est ajouté dans un dom-node avec pointer-events: none (transparent)
	pointerEvents: 'auto',
	font: 'inherit'
});

module.exports = compose(function(tag, namespace) {
	var node;
	if (namespace) {
		node = this.domNode = document.createElementNS(namespace, tag);
	} else {
		node = this.domNode = document.createElement(tag || 'div');
	}	
	this._visible = true;
	baseStyle.apply(this.domNode);
}, {
	left: function(left) {
		if (arguments.length) {
			this._left = left;
			this.domNode.style.left = left+'px';
			return this;
		} else {
			return this._left;
		}
	},
	top: function(top) {
		if (arguments.length) {
			this._top = top;
			this.domNode.style.top = top+'px';
			return this;
		} else {
			return this._top;
		}
	},
	zIndex: function(zIndex) {
		if (arguments.length) {
			this._zIndex = zIndex;
			this.domNode.style.zIndex = zIndex;
			return this;
		} else {
			return this._zIndex;
		}
	},
	width: function(width) {
		if (arguments.length) {
			this._width = width;
			this.domNode.style.width = width+'px';
			return this;
		} else {
			return this._width;
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._height = height;
			this.domNode.style.height = height+'px';
			return this;
		} else {
			return this._height;
		}
	},
	depth: function() {
		return 1;
	},
	parentNode: function(parentNode) {
		if (arguments.length) {
			if (parentNode) {
				parentNode.appendChild(this.domNode);
			} else {
				this._parentNode && this._parentNode.removeChild(this.domNode);
			}
			this._parentNode = parentNode;
			return this;
		} else {
			return this._parentNode;
		}
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			this._applyVisible();
			return this;
		} else {
			return this._visible;
		}
	},
	containerVisible: function(visible) {
		this._containerVisible = visible;
		this._applyVisible();
		return this;
	},
	_applyVisible: function() {
		if (this._containerVisible === undefined) { return; }
		this.domNode.style.display = (this._containerVisible && this._visible) ? '' : 'none';
	},
	attr: function(attr, value) {
		this.domNode.setAttribute(attr, value);
		return this;
	},
	attrs: function(attrs) {
		Object.keys(attrs).forEach(function(attr) {
			this.attr(attr, attrs[attr]);
		}, this);
		return this;
	},
	prop: function(prop, value) {
		if (arguments.length === 2) {
			this.domNode[prop] = value;
			return this;
		} else {
			return this.domNode[prop];
		}
	},
	props: function(props) {
		Object.keys(props).forEach(function(prop) {
			this.prop(prop, props[prop]);
		}, this);
		return this;
	},
	styleProp: function(prop, value) {
		this.domNode.style[prop] = value;
		return this;
	},
	style: function(style) {
		Object.keys(style).forEach(function(prop) {
			this.styleProp(prop, style[prop]);
		}, this);
		return this;
	},
	on: function(type, cb) {
		this.domNode.addEventListener(type, cb);
		return this;
	},
	off: function(type, cb) {
		this.domNode.removeEventListener(type, cb);
		return this;
	},
});

},{"ksf/dom/style/JSS":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/JSS.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/FocusableElement.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var Element = require('./Element');
var _Evented = require('ksf/base/_Evented');

module.exports = compose(Element, _Evented, function() {
	this.prop('tabIndex', -1).style({ outline: 'none' });
	var self = this;
	this.on('focus', function() {
		self._focus = true;
		self._emit('focus', true);
	});
	this.on('blur', function() {
		if (document.activeElement !== self.domNode) {
			self._focus = false;
			self._emit('focus', false);
		}
	});
	this._focus = false;
}, {
	onFocus: function(cb) {
		return this._on('focus', cb);
	},
	offFocus: function(cb) {
		// TODO
	},
	focus: function(focus) {
		if (arguments.length) {
			this._focus = focus;
			this.domNode[focus ? 'focus' : 'blur']();
		} else {
			return this._focus;
		}
	}
});
},{"./Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","ksf/base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/HFlex.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Flex = require('./layout/Flex');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var Container = require('./Container');

function getCmp (arg) {
	return Array.isArray(arg) ? arg[0] : arg;
}

/**
Impose la hauteur à tous les enfants
Demande la largeur aux enfants fixes
Impose la largeur aux enfants flex
*/
module.exports = compose(function(content) {
	this._container = new Container(content.map(getCmp));
	this._horizontalLayouter = new Flex('horizontal', content.map(function(arg) {
		if (Array.isArray(arg)) {
			if (typeof arg[1] === 'number') {
				return {
					cmp: arg[0],
					type: 'flex',
					weight: arg[1]
				};
			} else {
				return {
					cmp: arg[0],
					type: 'fixed',
				};
			}
		} else {
			return {
				cmp: arg,
				type: 'flex',
				weight: 1,
			};
		}
	}));
	var cmpsAsDict = content.reduce(function(acc, arg, index) {
		acc[index] = getCmp(arg);
		return acc;
	}, {});
	this._verticalLayouter = new Full('vertical').content(cmpsAsDict);
	this._zLayouter = new ZFlat().content(cmpsAsDict);
}, {
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
});

},{"./Container":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Container.js","./layout/Flex":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Flex.js","./layout/Full":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Full.js","./layout/ZFlat":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/ZFlat.js","./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/IncrementalContainer.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');


module.exports = compose(function() {
	this._children = {};
	this._visible = true;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._applyChildVisible(cmp);
		cmp.parentNode(this._parentNode);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(null);
		delete this._children[key];
		return cmp;
	},
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			var children = this._children;
			Object.keys(children).forEach(function(key) {
				children[key].parentNode(node);
			});
			return this;
		} else {
			return this._parentNode;
		}
	},
	_applyChildVisible: function(child) {
		if (this._containerVisible === undefined) { return; }
		child.containerVisible(this._containerVisible && this._visible);
	},
	containerVisible: function(visible) {
		this._containerVisible = visible;
		Object.keys(this._children).forEach(function(key) {
			this._applyChildVisible(this._children[key]);
		}, this);
		return this;
	},
	visible: function(visible) {
		this._visible = visible;
		Object.keys(this._children).forEach(function(key) {
			this._applyChildVisible(this._children[key]);
		}, this);
		return this;
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Label.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_ContentDelegate, function() {
	this._content = new Elmt().style({
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	});
	this._vAlign = 'middle';
}, {
	value: function(value) {
		this._content.prop('textContent', (typeof value === 'string' ? value : ''));
		return this;
	},
	hAlign: function(hAlign) {
		this._content.styleProp('textAlign', hAlign);
		return this;
	},
	vAlign: function(vAlign) {
		this._vAlign = vAlign;
		this._applyVAlign();
		return this;
	},
	_applyVAlign: function() {
		this._content.styleProp('lineHeight', null);
		this._content.styleProp('padding-top', null);
		if (this._vAlign === 'bottom') {
			// no clean way to bottom-align a single-line text without using an extra container node
			// best compromise I could find is the following, adding padding-top with a line-height of 1.1 (so that characters "legs", like q, p, etc. are not cut for most fonts)
			this._content.styleProp('padding-top', 'calc(' + this._content.height() + 'px - 1.1em)');
			this._content.styleProp('lineHeight', '1.1');
		} else if (this._vAlign === 'middle') {
			this._content.styleProp('lineHeight', this._content.height() + 'px');
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._content.height(height);
			this._applyVAlign();
			return this;
		} else {
			return this._content.height();
		}
	},
	color: function(color) {
		this._content.styleProp('color', color);
		return this;
	},
	font: function(font) {
		if (typeof font === 'string') {
			this._content.styleProp('font', font);
		} else {
			font.family && this._content.styleProp('fontFamily', font.family);
			this._content.style({
				fontWeight: font.weight,
				fontSize: font.size,
				fontStyle: font.style,
			});
		}
		return this;
	},
	textDecoration: function(value) {
		this._content.styleProp('textDecoration', value);
		return this;
	}
});

},{"./Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/LabelInput.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var FocusableElement = require('./FocusableElement');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = new FocusableElement('input');
	this._content.prop('type', 'text');
	this._asYouType = args && args.asYouType;
}, {
	value: function(value) {
		if (arguments.length) {
			this._content.prop('value', (typeof value === 'string' ? value : ''));
			return this;
		} else {
			return this._content.prop('value');
		}
	},
	onInput: function(cb, key) {
		var self = this;
		this._content.on(this._asYouType ? 'input' : 'change', function() {
			cb(self.value());
		});
		this._own(cb, key);
		return this;
	},
	offInput: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._content.off(this._asYouType ? 'input' : 'change', cb);
		return this;
	},
	placeholder: function(placeholder) {
		this._content.prop('placeholder', placeholder);
		return this;
	},
	style: function(style) {
		this._content.style(style);
		return this;
	},
	focus: function(focus) {
		if (arguments.length) {
			this._content.focus(focus);
			return this;
		} else {
			return this._content.focus();
		}
	},
	onFocus: function(cb) {
		this._content.onFocus(cb);
		return this;
	},
	offFocus: function(cb) {
		this._content.offFocus(cb);
		return this;
	},
	onKeyDown: function(cb) {
		this._content.on('keydown', cb);
		return this;
	}
});

},{"./FocusableElement":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/FocusableElement.js","./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Margin.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Margin = require('./layout/Margin');



module.exports = compose(function(content, margin) {
	this._content = content;
	this._horizontalLayouter = new Margin('horizontal', content,
		typeof margin === 'number' ? margin :
			('horizontal' in margin ? margin.horizontal : margin.left),
		typeof margin === 'number' ? margin :
			('horizontal' in margin ? margin.horizontal : margin.right)
	);
	this._verticalLayouter = new Margin('vertical', content,
		typeof margin === 'number' ? margin :
			('vertical' in margin ? margin.vertical : margin.top),
		typeof margin === 'number' ? margin :
			('vertical' in margin ? margin.vertical : margin.bottom)
	);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
});
},{"./layout/Margin":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Margin.js","./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Mousable.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this._clickArea = new Elmt();
	this._content = new ZPile().content([
		content,
		this._clickArea
	]);
}, {
	cursor: function(cursorType) {
		this._clickArea.styleProp('cursor', cursorType);
		return this;
	},
	on: function(domEventName, cb, key) {
		this._clickArea.on(domEventName, cb);
		this._own({
			eventName: domEventName,
			cb: cb
		}, key);
		return this;
	},
	off: function(key) {
		var ev = this._owned[key];
		this._unown(key);
		this._clickArea.off(ev.eventName, ev.cb);
		return this;
	},
});

},{"./Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","./ZPile":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/ZPile.js","./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Reactive.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');

var bindValue = require('ksf/observable/bindValue');

// permet de créer facilement un composant réactif à partir d'un composant non réactif de type 'value'
module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;
	// binding
	this._own(bindValue(args.value, args.content[args.prop || 'value'].bind(args.content)));
}, {
	content: function() {
		return this._content;
	},
});
},{"./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/observable/bindValue":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/bindValue.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/SvgIcon.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_ContentDelegate, function(pathInfo) {
	this._content = new Elmt('svg', "http://www.w3.org/2000/svg").attrs({
		preserveAspectRatio: 'xMinYMid meet',
		viewBox: "0 0 " + pathInfo.width + " " + pathInfo.height
	});
	this._pathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
	this._pathNode.setAttribute('d', pathInfo.data);
	this._content.domNode.appendChild(this._pathNode);
}, {
	color: function(color) {
		this._pathNode.style.fill = color;
		return this;
	},
});

},{"./Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","./_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Switch.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

function contentGetSet (prop) {
	return function(value) {
		if (arguments.length) {
			this._props[prop] = value;
			this._content && this._content[prop](value);
			return this;
		} else {
			return this._props[prop];
		}
	};
}

module.exports = compose(function() {
	this._props = {};
}, {
	content: function(content) {
		if (this._content && this._props.parentNode) {
			this._content.parentNode(null);
		}
		this._content = content;
		if (content) {
			for (var prop in this._props) {
				this._content[prop](this._props[prop]);
			}
		}
		return this;
	},
	width: contentGetSet('width'),
	height: contentGetSet('height'),
	depth: contentGetSet('depth'),
	left: contentGetSet('left'),
	top: contentGetSet('top'),
	zIndex: contentGetSet('zIndex'),
	parentNode: contentGetSet('parentNode'),
	visible: contentGetSet('visible'),
	containerVisible: contentGetSet('containerVisible'),
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/VPile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Pile = require('./layout/Pile');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants en 'top' mais leur impose le 'width'
// incrémental
module.exports = compose(function() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Pile('vertical');
	this._horizontalLayouter = new Full('horizontal');
	this._zLayouter = new ZFlat();
}, {
	// content est soit une liste ordonnées de couples [cmp, key], soit une liste de composants directement (dans ce cas la clé est la position dans la liste), ou 
	content: function(content) {
		this._verticalLayouter.content(content.map(function(arg, index) {
			if (Array.isArray(arg)) {
				return {
					cmp: arg[0],
					key: arg[1],
				};
			} else {
				return {
					cmp: arg,
					key: index+'',
				};
			}
		}));
		var cmpsAsDict = content.reduce(function(acc, arg, index) {
			if (Array.isArray(arg)) {
				acc[arg[1]] = arg[0];
			} else {
				acc[index] = arg;
			}
			return acc;
		}, {});
		this._horizontalLayouter.content(cmpsAsDict);
		this._zLayouter.content(cmpsAsDict);
		this._container.content(cmpsAsDict);
		return this;
	},
	add: function(key, cmp, beforeKey) {
		this._verticalLayouter.add(key, cmp, beforeKey);
		this._horizontalLayouter.add(key, cmp);
		this._zLayouter.add(key, cmp);
		this._container.add(key, cmp);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._container.remove(key);
		this._verticalLayouter.remove(key);
		this._horizontalLayouter.remove(key);
		this._zLayouter.remove(key);
		return cmp;
	},
	move: function(key, beforeKey) {
		this._verticalLayouter.move(key, beforeKey);
	},
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	onHeight: function(cb) {
		return this._verticalLayouter.onSize(cb);
	},
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
	visible: delegateGetSet('_container', 'visible'),
});

},{"./IncrementalContainer":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/IncrementalContainer.js","./layout/Full":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Full.js","./layout/Pile":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Pile.js","./layout/ZFlat":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/ZFlat.js","./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/ZPile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Full = require('./layout/Full');
var ZPileLayout = require('./layout/ZPile');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants en 'top' mais leur impose le 'width'
// incrémental
module.exports = compose(function ZPile() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Full('vertical');
	this._horizontalLayouter = new Full('horizontal');
	this._zLayouter = new ZPileLayout();
}, {
	content: function(content) {
		this._verticalLayouter.content(content);
		this._horizontalLayouter.content(content);
		this._zLayouter.content(Object.keys(content).map(function(key) {
			return {
				key: key,
				cmp: content[key],
			};
		}));
		this._container.content(content);
		return this;
	},
	add: function(key, cmp, beforeKey) {
		this._verticalLayouter.add(key, cmp);
		this._horizontalLayouter.add(key, cmp);
		this._zLayouter.add(key, cmp, beforeKey);
		this._container.add(key, cmp);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._container.remove(key);
		this._verticalLayouter.remove(key);
		this._horizontalLayouter.remove(key);
		this._zLayouter.remove(key);
		return cmp;
	},
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
	visible: delegateGetSet('_container', 'visible'),
});

},{"./IncrementalContainer":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/IncrementalContainer.js","./layout/Full":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Full.js","./layout/ZPile":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/ZPile.js","./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js":[function(require,module,exports){
var delegateGetSet = require('./utils/delegateGetSet');

// délègue tous les get/set des propriétés de layout à '_content'
// réutilisable pour tous les cas où l'on veut simplement déléguer à un composant principal, en surchargeant uniquement certaines méthodes
module.exports = {
	width: delegateGetSet('_content', 'width'),
	height: delegateGetSet('_content', 'height'),
	depth: delegateGetSet('_content', 'depth'),
	left: delegateGetSet('_content', 'left'),
	top: delegateGetSet('_content', 'top'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
};
},{"./utils/delegateGetSet":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/deep/OrderedBranch.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('../_ContentDelegate');

var bindOrdered = require('ksf/observable/deep/bindOrderedBranch');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;

	this._own(bindOrdered(args.value, {
		add: function(keyAdded, beforeKey) {
			return args.onKeyAdded(args.content, keyAdded, beforeKey);
		},
		move: function(key, beforeKey) {
			args.onKeyMoved(args.content, key, beforeKey);
		},
		remove: function(keyRemoved, storedReturn) {
			args.onKeyRemoved(args.content, keyRemoved, storedReturn);
		},
	}));
});
},{"../_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/observable/deep/bindOrderedBranch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/deep/bindOrderedBranch.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Align.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

/**
Layouter qui positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, align) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._align = align;
	this._contentSize = this._content[this._sizeProp]();
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._calculateContentOffset();
			this._positionContent();
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._positionContent();
		} else {
			return this._position;
		}
	},
	_positionContent: function() {
		if (this._position !== null && this._contentOffset !== null) {
			this._content[this._positionProp](this._position + this._contentOffset);
		}
	},
	_calculateContentOffset: function() {
		if (this._align === 'head') {
			this._contentOffset = 0;
		}
		if (this._align === 'middle') {
			this._contentOffset = Math.round((this._size / 2) - (this._contentSize / 2));
		}
		if (this._align === 'tail') {
			this._contentOffset = this._size - this._contentSize;
		}
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Flex.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

/**
Layouter qui dimensionne et positionne des enfants de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, children) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._children = children;
	this._initLayout();
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._applySize();
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._applyPosition();
			return this;
		} else {
			return this._position;
		}
	},
	_initLayout: function() {
		var sizeProp = this._sizeProp;
		var children = this._children;
		this._totalFixedSize = 0;
		this._totalFlexWeight = 0;
		this._flexChildren = [];
		var child;
		for (var i = children.length - 1; i >= 0; i--) {
			child = children[i];
			if (child.type === 'flex') {
				this._flexChildren.push(child);
				this._totalFlexWeight += child.weight;
			} else {
				child.size = child.cmp[sizeProp]();
				this._totalFixedSize += child.size;
			}
		}
		this._applySize();
	},
	_applySize: function() {
		// only change size of flex children
		if (this._size !== null) {
			var child;
			var sizeProp = this._sizeProp;
			var flexChildren = this._flexChildren;
			var totalFlexSize = this._size - this._totalFixedSize;
			var remainingRounding = totalFlexSize % this._totalFlexWeight;
			var roundingPerFlexUnit = remainingRounding / this._totalFlexWeight;
			var sizePerFlexUnit = (totalFlexSize - remainingRounding) / this._totalFlexWeight;
			for (var i = flexChildren.length - 1; i >= 0; i--) {
				child = flexChildren[i];
				child.size = child.weight * sizePerFlexUnit;
				// on essaie de répartir l'arrondi en proportion de chaque enfant jusqu'à ce qu'il n'y en ai plus
				if (remainingRounding > 0) {
					var childRounding = Math.ceil(roundingPerFlexUnit * child.weight);
					if (childRounding > remainingRounding) {
						childRounding = remainingRounding;
					}
					child.size += childRounding;
					remainingRounding -= childRounding;
				}
				child.cmp[sizeProp](child.size);
			}
			this._applyPosition();
		}
	},
	_applyPosition: function() {
		if (this._position !== null) {
			var children = this._children;
			var positionProp = this._positionProp;
			var child;
			var position = this._position;
			for (var i = 0; i < children.length; i++) {
				child = children[i];
				child.cmp[positionProp](position);
				position += child.size;
			}
		}
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Full.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
/**
Layouter qui positionne et dimensionne tous les enfants à la même position et dimension que lui-même
*/
module.exports = compose(function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._applySize(key);
		this._applyPosition(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_applySize: function(key) {
		if (this._size !== undefined) {
			this._children[key][this._sizeProp](this._size);
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key][this._positionProp](this._position);
		}
	},
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			Object.keys(this._children).forEach(this._applySize, this);
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Margin.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

/**
Layouter qui dimensionne et positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, headMarge, tailMarge) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._headMarge = headMarge || 0;
	this._tailMarge = tailMarge || 0;
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._sizeContent();
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._positionContent();
			return this;
		} else {
			return this._position;
		}
	},
	_sizeContent: function() {
		this._content[this._sizeProp](this._size - (this._headMarge + this._tailMarge));
	},
	_positionContent: function() {
		this._content[this._positionProp](this._position + this._headMarge);
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/Pile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _Evented = require('ksf/base/_Evented');
var _Destroyable = require('ksf/base/_Destroyable');
var capitalize = require('lodash/string/capitalize');

/**
Container qui positionne des enfants de taille fixe dans un ordre donné.
Peut-être utilisé de façon incrémental
*/
module.exports = compose(_Evented, _Destroyable, function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._onSizeMethod = 'on' + capitalize(this._sizeProp);
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
	this._firstChildKey = null;
	this._lastChildKey = null;
	this._size = 0;
}, {
	content: function(config) {
		var sizeProp = this._sizeProp;
		var children = this._children = {};
		var offset = 0;
		var previous = null;
		config.forEach(function(child) {
			previous && (children[previous].next = child.key);
			
			var cmpSize = child.cmp[sizeProp]();
			children[child.key] = {
				previous: previous,
				next: null,
				key: child.key,
				cmp: child.cmp,
				size: cmpSize,
				offset: offset,
			};
			child.cmp[this._onSizeMethod] && this._own(child.cmp[this._onSizeMethod](function(size) {
				this._updateChildSize(child.key, size);
			}.bind(this)), 'onsize' + child.key);
			
			offset += cmpSize;
			previous = child.key;
		}, this);
		this._size = offset;

		this._firstChildKey = config[0] && config[0].key;
		this._lastChildKey = config[config.length-1] && config[config.length-1].key;
		this._layoutFrom(this._firstChildKey);

		this._emit('size', this._size);

		return this;
	},
	_updateChildSize: function(key, size) {
		this._size += size - this._children[key].size;
		this._children[key].size = size;

		this._emit('size', this._size);
	},
	_add: function(key, cmp, beforeKey) {
		beforeKey = beforeKey || null;
		var sizeProp = this._sizeProp;

		var previousKey = beforeKey ? this._children[beforeKey].previous : this._lastChildKey;
		var previousChild = previousKey ? this._children[previousKey] : null;
		var offset = previousChild ? previousChild.offset + previousChild.size : 0;
		var cmpSize = cmp[sizeProp]();
		
		this._children[key] = {
			previous: previousKey,
			next: beforeKey,
			key: key,
			cmp: cmp,
			size: cmpSize,
			offset: offset,
		};
		
		cmp[this._onSizeMethod] && this._own(cmp[this._onSizeMethod](function(size) {
			this._updateChildSize(key, size);
		}.bind(this)), 'onsize' + key);
		
		previousKey && (this._children[previousKey].next = key);
		beforeKey && (this._children[beforeKey].previous = key);

		this._layoutFrom(key);
		if (beforeKey === this._firstChildKey) {
			this._firstChildKey = key;
		}
		if (beforeKey === null) {
			this._lastChildKey = key;
		}

		this._size = this._size + cmpSize;
	},
	add: function(key, cmp, beforeKey) {
		this._add(key, cmp, beforeKey);
		this._emit('size', this._size);
	},
	_remove: function(key) {
		var child = this._children[key];

		var previousKey = child.previous;
		var previousChild = previousKey ? this._children[previousKey] : null;

		var nextKey = child.next;
		var nextChild = nextKey ? this._children[nextKey] : null;

		previousChild && (previousChild.next = nextKey);
		nextChild && (nextChild.previous = previousKey);

		this._layoutFrom(nextKey);
		if (previousKey === null) {
			this._firstChildKey = nextKey;
		}
		if (nextKey === null) {
			this._lastChildKey = previousKey;
		}

		this._destroy('onsize' + key);
		delete this._children[key];

		this._size = this._size - child.size;
	},

	remove: function(key) {
		this._remove(key);
		this._emit('size', this._size);
	},
	move: function(key, beforeKey) {
		// TODO: optimize
		var cmp = this._children[key].cmp;
		this._remove(key);
		this._add(key, cmp, beforeKey);
	},
	_layoutFrom: function(key) {
		var positionProp = this._positionProp;
		var children = this._children;
		while(key) {
			var child = children[key];
			var previousChild = children[child.previous];
			var offset = child.offset = previousChild ? previousChild.offset + previousChild.size : 0;
			child.cmp[positionProp](this._position + offset); // apply offset
			key = child.next;
		}
	},
	children: function() {
		return this._children;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._layoutFrom(this._firstChildKey);
			return this;
		} else {
			return this._position;
		}
	},
	size: function() {
		return this._size;
	},
	onSize: function(cb) {
		return this._on('size', cb);
	},
});

},{"ksf/base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js","ksf/base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js","lodash/string/capitalize":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/lodash/string/capitalize.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/ZFlat.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
/**
Layouter qui positionne tous les enfants à la même position et a comme dimension celle du plus grand enfant (mais ne diminue jamais de taille car en z ça ne sert à rien)
TODO: le rendre réactif
*/
module.exports = compose(function() {
	this._children = {};
	this._size = 0;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._applyPosition(key);
		this._updateSize(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_updateSize: function(key) {
		var cmpSize = this._children[key].depth();
		if (cmpSize > this._size) {
			this._size = cmpSize;
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key].zIndex(this._position);
		}
	},
	size: function() {
		return this._size;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/layout/ZPile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
/**
Layouter qui positionne tous les enfants à la même position et a comme dimension celle du plus grand enfant (mais ne diminue jamais de taille car en z ça ne sert à rien)
TODO: le rendre réactif
*/
module.exports = compose(function() {
	this._children = {};
	this._childrenOrder = [];
	this._size = 0;
	this._position = 0;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		cmps.forEach(function(cmpInfo) {
			this.add(cmpInfo.key, cmpInfo.cmp);
		}, this);
		return this;
	},
	add: function(key, cmp, beforeKey) {
		this._children[key] = cmp;
		var before = this._children[beforeKey];
		if (before) {
			var beforeIndex = this._childrenOrder.indexOf(before);
			cmp.zIndex(before.zIndex());
			var nextZIndex = before.zIndex() + cmp.depth();
			this._childrenOrder.slice(beforeIndex).forEach(function(nextCmp) {
				nextCmp.zIndex(nextZIndex);
				nextZIndex += nextCmp.depth();
			}, this);
			this._childrenOrder.splice(beforeIndex, 0, cmp);
		} else {
			cmp.zIndex(this._position + this._size);
			this._childrenOrder.push(cmp);
		}
		this._size += cmp.depth();
	},
	remove: function(key) {
		var cmp = this._children[key];
		this._childrenOrder.splice(this._childrenOrder.indexOf(cmp), 1);
		delete this._children[key];
	},
	size: function() {
		return this._size;
	},
	position: function(position) {
		if (arguments.length) {
			var delta = position - this._position;
			this._position = position;
			this._childrenOrder.forEach(function(cmp) {
				cmp.zIndex(cmp.zIndex() + delta);
			});
			return this;
		} else {
			return this._position;
		}
	},
});
},{"ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/absurd/Absurd.js":[function(require,module,exports){
// UMD wrapper
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {


/* version: 0.3.31, born: 2-8-2014 0:4 */
var Absurd = (function(w) {
var lib = {
    api: {},
    helpers: {},
    plugins: {},
    processors: {
        css: { plugins: {}},
        html: {
            plugins: {},
            helpers: {}
        },
        component: { plugins: {}}
    }
};
var absurdRequire = function(v) {
    // css preprocessor
    if(v.indexOf('css/CSS.js') > 0 || v == '/../CSS.js') {
        return lib.processors.css.CSS;
    } else if(v.indexOf('html/HTML.js') > 0) {
        return lib.processors.html.HTML;
    } else if(v.indexOf('component/Component.js') > 0) {
        return lib.processors.component.Component;
    } else if(v == 'js-beautify') {
        return {
            html: function(html) {
                return html;
            }
        }
    } else if(v == './helpers/PropAnalyzer') {
        return lib.processors.html.helpers.PropAnalyzer;
    } else if(v == '../../helpers/TransformUppercase') {
        return lib.helpers.TransformUppercase;
    } else if(v == './helpers/TemplateEngine' || v == '../html/helpers/TemplateEngine') {
        return lib.processors.html.helpers.TemplateEngine;
    } else if(v == '../helpers/Extend') {
        return lib.helpers.Extend;
    } else if(v == '../helpers/Clone') {
        return lib.helpers.Clone;
    } else if(v == '../helpers/Prefixes' || v == '/../../../helpers/Prefixes') {
        return lib.helpers.Prefixes;
    } else if(v == __dirname + '/../../../../') {
        return Absurd;
    } else if(v == '../helpers/CSSParse') {
        return lib.helpers.CSSParse;
    } else {
        return function() {}
    }
};
var __dirname = "";
var queue  = function(funcs, scope) {
	(function next() {
		if(funcs.length > 0) {
			funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
		}
	})();
}
var str2DOMElement = function(html) {
   var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        body: [0, "", ""],
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if(tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for(var i=0; i<attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default, element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0]+1;
            while(j--) {
                element = element.lastChild;
            }
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
}
var addEventListener = function(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
        obj.addEventListener(evt, fnc, false);
        return true;
    } else if (obj.attachEvent) { // Microsoft model
        return obj.attachEvent('on' + evt, fnc);
    }
}
var removeEmptyTextNodes = function(elem) {
    var children = elem.childNodes;
    var child;
    var len = children.length;
    var i = 0;
    var whitespace = /^\s*$/;
    for(; i < len; i++){
        child = children[i];
        if(child.nodeType == 3){
            if(whitespace.test(child.nodeValue)){
                elem.removeChild(child);
                i--;
                len--;
            }
        }
    }
    return elem;
}
var createNode = function(type, attrs, content) {
	var node = document.createElement(type);
	for(var i=0; i<attrs.length, a=attrs[i]; i++) {
		node.setAttribute(a.name, a.value);
	}
	node.innerHTML = content;
	return node;
}
var qs = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelector(selector);
};
var qsa = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelectorAll(selector);
};
var getStyle = function(styleProp, el) {
    el = el || this.el;
    if(el && el.currentStyle) {
        return el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    }
    return null;
};
var addClass = function(className, el) {
    el = el || this.el;
    if(el.classList) {
        el.classList.add(className);
    } else {
        var current = el.className;
        if(current.indexOf(className) < 0) {
            if(current == '') el.className = className;
            else el.className += ' ' + className;
        }
    }
    return this;
};
var removeClass = function(className, el) {
    el = el || this.el;
    if (el.classList) {
        el.classList.remove(className);
    } else {
        var current = el.className.split(' ');
        var newClasses = [];
        for(var i=0; i<current.length; i++) {
            if(current[i] != className) newClasses.push(current[i]);
        }
        el.className = newClasses.join(' ');
    }
    return this;
}
var replaceClass = function(classNameA, classNameB, el) {
    el = el || this.el;
    var current = el.className.split(' '), found = false;
    for(var i=0; i<current.length; i++) {
        if(current[i] == classNameA) {
            found = true;
            current[i] = classNameB;
        }
    }
    if(!found) {
        return addClass(classNameB, el);
    }
    el.className = current.join(' ');
    return this;
}
var toggleClass = function(className, el) {
    el = el || this.el;
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = -1;
        for (var i = classes.length; i--;) {
            if (classes[i] === className)
                existingIndex = i;
        }

        if(existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
    return this;
}
var bind = function(func, scope, args) {
    if(scope instanceof Array) { args = scope; scope = this; }
    if(!scope) scope = this;
    return function() {
        func.apply(scope, (args || []).concat(Array.prototype.slice.call(arguments, 0)));
    }
}
var Component = function(componentName, absurd, eventBus, cls) {
	var api = lib.helpers.Extend({
		__name: componentName
	}, cls);
	var extend = lib.helpers.Extend;
var l = [];
api.listeners = l;
api.on = function(eventName, callback, scope) {
	if(!l[eventName]) {
		l[eventName] = [];
	}
	l[eventName].push({callback: callback, scope: scope});
	return this;
};
api.off = function(eventName, handler) {
	if(!l[eventName]) return this;
	if(!handler) l[eventName] = []; return this;
	var newArr = [];
	for(var i=0; i<l[eventName].length; i++) {
		if(l[eventName][i].callback !== handler) {
			newArr.push(l[eventName][i]);
		}
	}
	l[eventName] = newArr;
	return this;
};
api.dispatch = function(eventName, data, scope) {
	if(data && typeof data === 'object' && !(data instanceof Array)) {
		data.target = this;
	}
	if(l[eventName]) {
		for(var i=0; i<l[eventName].length; i++) {
			var callback = l[eventName][i].callback;
			callback.apply(scope || l[eventName][i].scope || {}, [data]);
		}
	}
	if(this[eventName] && typeof this[eventName] === 'function') {
		this[eventName](data);
	}
	if(eventBus) eventBus.dispatch(eventName, data);
	return this;
};
var storage = {};
api.set = function(key, value) {
	storage[key] = value;
	return this;
};
api.get = function(key) {
	return storage[key];
};
var CSS = false;
api.__handleCSS = function(next) {
	if(this.css) {
		absurd.flush().morph('dynamic-css').add(this.css).compile(function(err, css) {
			if(!CSS) {
				var style = createNode(
					'style', [
						{ name: "id", value: componentName + '-css' },
						{ name: "type", value: "text/css"}
					],
					 css
				);
				(qs("head") || qs("body")).appendChild(style);
				CSS = { raw: css, element: style };
			} else if(CSS.raw !== css) {
				CSS.raw = css;
				CSS.element.innerHTML = css;
			}
			next();
		}, this);
	} else {
		next();
	}
	return this;
};
api.applyCSS = function(data, preventComposition, skipAutoPopulation) {
	if(this.html && typeof this.html === 'string' && !preventComposition) {
		var res = {};
		res[this.html] = data;
		data = res;
	}
	this.css = data;
	if(!skipAutoPopulation) {
		this.populate();
	}
	return this;
};
var HTMLSource = false;

api.__mergeDOMElements = function(e1, e2) {
	removeEmptyTextNodes(e1);
	removeEmptyTextNodes(e2);
	if(typeof e1 === 'undefined' || typeof e2 === 'undefined' || e1.isEqualNode(e2)) return;
	// replace the whole node
	if(e1.nodeName !== e2.nodeName) {
		if(e1.parentNode) {
			e1.parentNode.replaceChild(e2, e1);
		}
		return;
	}
	// nodeValue
	if(e1.nodeValue !== e2.nodeValue) {
		e1.nodeValue = e2.nodeValue;
	}
	// attributes
	if(e1.attributes) {
		var attr1 = e1.attributes, attr2 = e2.attributes, a1, a2, found = {};
		for(var i=0; i<attr1.length, a1=attr1[i]; i++) {
			for(var j=0; j<attr2.length, a2=attr2[j]; j++) {
				if(a1.name === a2.name) {
					e1.setAttribute(a1.name, a2.value);
					found[a1.name] = true;
					if(a1.name === 'value') {
						e1.value = a2.value;
					}
				}
			}
			if(!found[a1.name]) {
				e1.removeAttribute(a1.name);
			}
		}
		for(var i=0; i<attr2.length, a2=attr2[i]; i++) {
			if(!found[a2.name]) {
				e1.setAttribute(a2.name, a2.value);
				if(a2.name === 'value') {
					e1.value = a2.value;
				}
			}
		}
	}
	// childs
	var newNodesToMerge = [];
	if(e1.childNodes.length >= e2.childNodes.length) {
		for(var i=0; i<e1.childNodes.length; i++) {
			if(!e2.childNodes[i]) { e2.appendChild(document.createTextNode("")); }
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	} else {
		for(var i=0; i<e2.childNodes.length; i++) {
			e1.appendChild(document.createTextNode(""));
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	}
	for(var i=0; i<newNodesToMerge.length; i++) {
		api.__mergeDOMElements(newNodesToMerge[i][0], newNodesToMerge[i][1]);
	}
};
api.__handleHTML = function(next) {
	var self = this;
	var compile = function() {
		absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
			if(!self.el) {
				self.el = str2DOMElement(html);
			} else {
				api.__mergeDOMElements(self.el, str2DOMElement(html));
			}
			next();
		}, self);
	}
	if(this.html) {
		if(typeof this.html === 'string') {
			if(!this.el) {
				var element = qs(this.html);
				if(element) {
					this.el = element;
					HTMLSource = {'': this.el.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
				}
			}
			compile();
		} else if(typeof this.html === 'object') {
			HTMLSource = extend({}, this.html);
			compile();
		} else {
			next();
		}
	} else {
		next();
	}
	return this;
};
api.applyHTML = function(data, skipAutoPopulation) {
	this.html = data;
	if(!skipAutoPopulation) {
		this.populate();
	}
	return this;
};
var	appended = false
api.__append = function(next) {
	if(!appended && this.el && this.get("parent")) {
		appended = true;
		this.get("parent").appendChild(this.el);
	}
	next();
	return this;
}
var cache = { events: {} };
api.__handleEvents = function(next) {
	if(this.el) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			var processAttributes = function(attrValue) {
				attrValue = attrValue.split(":");
				if(attrValue.length >= 2) {
					var eventType = attrValue[0];
					var methodName = attrValue[1];
					attrValue.splice(0, 2);
					var args = attrValue;
					if(!cache.events[eventType] || cache.events[eventType].indexOf(el) < 0) {
						if(!cache.events[eventType]) cache.events[eventType] = [];
						cache.events[eventType].push(el);
						addEventListener(el, eventType, function(e) {
							if(typeof self[methodName] === 'function') {
								var f = self[methodName];
								f.apply(self, [e].concat(args));
							}
						});
					}
				}
			}
			attrValue = attrValue.split(/, ?/g);
			for(var i=0; i<attrValue.length; i++) processAttributes(attrValue[i]);
		}
		if(this.el.hasAttribute && this.el.hasAttribute('data-absurd-event')) {
			registerEvent(this.el);
		}
		var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-event]') : [];
		for(var i=0; i<els.length; i++) {
			registerEvent(els[i]);
		}
	}
	next();
	return this;
}
api.__getAnimAndTransEndEventName = function(el) {
	if(!el) return;
    var a;
    var animations = {
      'animation': ['animationend', 'transitionend'],
      'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
      'MozAnimation': ['animationend', 'transitionend'],
      'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
    }
    for(a in animations){
        if( el.style[a] !== undefined ){
            return animations[a];
        }
    }
}
api.onAnimationEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[0], function(e) {
		func.apply(self, [e]);
	});
}
api.onTransitionEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[1], function(e) {
		func.apply(self, [e]);
	});
}
var	async = { funcs: {}, index: 0 };
api.__handleAsyncFunctions = function(next) {
	if(this.el) {
		var funcs = [];
		if(this.el.hasAttribute && this.el.hasAttribute("data-absurd-async")) {
			funcs.push(this.el);
		} else {
			var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-async]') : [];
			for(var i=0; i<els.length; i++) {
				funcs.push(els[i]);
			}
		}
		if(funcs.length === 0) {
			next();
		} else {
			var self = this;
			(function callFuncs() {
				if(funcs.length === 0) {
					next();
				} else {
					var el = funcs.shift(),
						value = el.getAttribute("data-absurd-async"),
						replaceNodes = function(childElement) {
							if(typeof childElement === 'string') {
								el.parentNode.replaceChild(str2DOMElement(childElement), el);
							} else {
								el.parentNode.replaceChild(childElement, el);
							}
							callFuncs();
						};
					if(typeof self[async.funcs[value].name] === 'function') {
						self[async.funcs[value].name].apply(self, [replaceNodes].concat(async.funcs[value].args));
					} else if(typeof async.funcs[value].func === 'function') {
						async.funcs[value].func.apply(self, [replaceNodes].concat(async.funcs[value].args));
					}
				}
			})();
		}
	} else {
		next();
	}
	return this;
}
api.async = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		func = args.shift(),
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, name: func};
	return '<script data-absurd-async="' + index + '"></script>';
};
api.child = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		children = this.get("children"),
		component = children && children[args.shift()],
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, func: function(callback) {
		component.populate({callback: function(data) {
			callback(data.html.element);
		}});
	}};
	return '<script data-absurd-async="' + index + '"></script>';
};
api.wire = function(event) {
	absurd.components.events.on(event, this[event] || function() {}, this);
	return this;
};
var isPopulateInProgress = false;
api.populate = function(options) {
	if(isPopulateInProgress) return;
	isPopulateInProgress = true;
	queue([
		api.__handleCSS,
		api.__handleHTML,
		api.__append,
		api.__handleEvents,
		api.__handleAsyncFunctions,
		function() {
			isPopulateInProgress = false;
			async = { funcs: {}, index: 0 }
			var data = {
				css: CSS,
				html: {
					element: this.el
				}
			};
			this.dispatch("populated", data);
			if(options && typeof options.callback === 'function') { options.callback(data); }
		}
	], this);
	return this;
};
api.str2DOMElement = str2DOMElement;
api.addEventListener = addEventListener;
api.queue = queue;
api.qs = qs;
api.qsa = qsa;
api.getStyle = getStyle;
api.addClass = addClass;
api.removeClass = removeClass;
api.replaceClass = replaceClass;
api.bind = bind;
api.toggleClass = toggleClass;
api.compileHTML = function(HTML, callback, data) {
	absurd.flush().morph("html").add(HTML).compile(callback, data);
};
api.compileCSS = function(CSS, callback, options) {
	absurd.flush().add(CSS).compile(callback, options);
};
api.delay = function(time, fn, args) {
	var self = this;
	setTimeout(function() {
		fn.apply(self, args);
	}, time);
}
	return api;
};
var injecting = function(absurd) {
absurd.di.register('is', {
	appended: function(selector) {
		if(typeof selector == 'undefined') selector = this.host.html;
		return qs(selector) ? true : false;
	},
	hidden: function(el) {
		el = el || this.host.el;
		return el.offsetParent === null;
	}
});
absurd.di.register('router', {
	routes: [],
	mode: null,
	root: '/',
	getFragment: function() {
		var fragment = '';
		if(this.mode === 'history') {
			if(!location) return '';
			fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
			fragment = fragment.replace(/\?(.*)$/, '');
			fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
		} else {
			if(!window) return '';
			var match = window.location.href.match(/#(.*)$/);
			fragment = match ? match[1] : '';
		}
		return this.clearSlashes(fragment);
	},
    clearSlashes: function(path) {
    	return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
	add: function(re, handler) {
		if(typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({ re: re, handler: handler});
		return this;
	},
	remove: function(param) {
		for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
			if(r.handler === param || r.re === param) {
				this.routes.splice(i, 1);
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.mode = null;
		this.root = '/';
		return this;
	},
	config: function(options) {
		this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	listen: function(loopInterval) {
		var self = this;
		var current = self.getFragment();
		var fn = function() {
			if(current !== self.getFragment()) {
				current = self.getFragment();
				self.check(current);
			}
		}
		clearInterval(this.interval);
		this.interval = setInterval(fn, loopInterval || 50);
		return this;
	},
	check: function(f) {
		var fragment = f || this.getFragment();
		for(var i=0; i<this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if(match) {
				match.shift();
				this.routes[i].handler.apply(this.host || {}, match);
				return this;
			}
		}
		return this;
	},
	navigate: function(path) {
		path = path ? path : '';
		if(this.mode === 'history') {
			history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href.match(/#(.*)$/);
			window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
		}
		return this;
	}
});
absurd.di.register('ajax', {
	request: function(ops) {

		if(typeof ops == 'string') ops = { url: ops };
		ops.url = ops.url || '';
		ops.method = ops.method || 'get'
		ops.data = ops.data || {};

		var getParams = function(data, url) {
			var arr = [], str;
			for(var name in data) {
				arr.push(name + '=' + encodeURIComponent(data[name]));
			}
			str = arr.join('&');
			if(str != '') {
				return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
			}
			return '';
		}

		var api = {
			host: this.host || {},
			process: function(ops) {
				var self = this;
				this.xhr = null;
				if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
				else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
				if(this.xhr) {
					this.xhr.onreadystatechange = function() {
						if(self.xhr.readyState == 4 && self.xhr.status == 200) {
							var result = self.xhr.responseText;
							if(ops.json === true && typeof JSON != 'undefined') {
								result = JSON.parse(result);
							}
							self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
						} else if(self.xhr.readyState == 4) {
							self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
						}
						self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
					}

					if(ops.method == 'get') {
						this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
					} else {
						this.xhr.open(ops.method, ops.url, true);
						this.setHeaders({
							'X-Requested-With': 'XMLHttpRequest',
							'Content-type': 'application/x-www-form-urlencoded'
						});
					}
					if(ops.headers && typeof ops.headers == 'object') {
						this.setHeaders(ops.headers);
					}
					setTimeout(function() {
						ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data));
					}, 20);
				}
				return this;
			},
			done: function(callback) {
				this.doneCallback = callback;
				return this;
			},
			fail: function(callback) {
				this.failCallback = callback;
				return this;
			},
			always: function(callback) {
				this.alwaysCallback = callback;
				return this;
			},
			setHeaders: function(headers) {
				for(var name in headers) {
					this.xhr && this.xhr.setRequestHeader(name, headers[name]);
				}
			}
		}

		return api.process(ops);

	}
});
var dom = function(el, parent) {
	var host = dom.prototype.host;
	var api = { el: null };
	// defining the scope
	switch(typeof el) {
		case 'undefined':
			api.el = host.el;
		break;
		case 'string':
			parent = parent && typeof parent === 'string' ? qs.apply(host, [parent]) : parent;
			api.el = qs(el, parent || host.el || document);
		break;
		case 'object':
			if(typeof el.nodeName != 'undefined') {
	            api.el = el;
	        } else {
	        	var loop = function(value, obj) {
            		obj = obj || this;
            		for(var prop in obj) {
        				if(typeof obj[prop].el != 'undefined') {
        					obj[prop] = obj[prop].val(value);
        				} else if(typeof obj[prop] == 'object') {
        					obj[prop] = loop(value, obj[prop]);
        				}
            		}
            		delete obj.val;
            		return obj;
	        	}
	            var res = { val: loop };
	            for(var key in el) {
	                res[key] = dom.apply(this, [el[key]]);
	            }
	            return res;
	        }
		break;
	}
	// getting or setting a value
	api.val = function(value) {
		if(!this.el) return null;
		var set = !!value;
		var useValueProperty = function(value) {
			if(set) { this.el.value = value; return api; }
			else { return this.el.value; }
		}
        switch(this.el.nodeName.toLowerCase()) {
        	case 'input':
        		var type = this.el.getAttribute('type');
        		if(type == 'radio' || type == 'checkbox') {
	                var els = qsa('[name="' + this.el.getAttribute('name') + '"]', parent);
	                var values = [];
	                for(var i=0; i<els.length; i++) {
	                    if(set && els[i].checked && els[i].value !== value) {
	                        els[i].removeAttribute('checked');
	                    } else if(set && els[i].value === value) {
	                    	els[i].setAttribute('checked', 'checked');
	                    	els[i].checked = 'checked';
	                    } else if(els[i].checked) {
	                    	values.push(els[i].value);
	                    }
	                }
	                if(!set) { return type == 'radio' ? values[0] : values; }
	            } else {
	            	return useValueProperty.apply(this, [value]);
	            }
        	break;
        	case 'textarea': return useValueProperty.apply(this, [value]); break;
        	case 'select':
        		if(set) {
            		var options = qsa('option', this.el);
            		for(var i=0; i<options.length; i++) {
            			if(options[i].getAttribute('value') === value) {
            				this.el.selectedIndex = i;
            			} else {
            				options[i].removeAttribute('selected');
            			}
            		}
            	} else {
                	return this.el.value;
            	}
        	break;
        	default:
        		if(set) {
        			this.el.innerHTML = value;
        		} else {
	        		if(typeof this.el.textContent != 'undefined') {
		                return this.el.textContent;
		            } else if(typeof this.el.innerText != 'undefined') {
		                return typeof this.el.innerText;
		            } else {
		                return this.el.innerHTML;
		            }
	        	}
        	break;
        }
        return set ? api : null;
	}
	// chaining dom module
	api.dom = function(el, parent) {
		return dom(el, parent || api.el);
	}
	return api;
}
absurd.di.register('dom', dom);
var mq = function(query, callback, usePolyfill) {
	var host = mq.prototype.host;
	var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;
	if(isMatchMediaSupported) {
		var res = window.matchMedia(query);
		callback.apply(host, [res.matches, res.media]);
		res.addListener(function(changed) {
			callback.apply(host, [changed.matches, changed.media]);
		});
	} else {
		var id = ".match-media-" + absurd.components.numOfComponents;
		var css = {}, html = {};
		css[id] = { display: 'block' };
		css[id]['@media ' + query] = { display: 'none' };
		html['span' + id] = '';
		absurd.component(id + '-component', {
			css: css,
			html: html,
			intervaliTime: 30,
			status: '',
			loop: function(dom) {
				var self = this;
				if(this.el) {
					var d = this.getStyle('display');
					if(this.status != d) {
						this.status = d;
						callback.apply(host, [d === 'none'])
					}
				}
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			},
			constructor: ['dom', function(dom) {
				var self = this;
				this.set('parent', dom('body').el).populate();
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			}]
		})();
	}
};
absurd.di.register('mq', mq);
}
var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		};

		var _api = {
				defaultProcessor: lib.processors.css.CSS()
			},
			_rules = {},
			_storage = {},
			_plugins = {},
			_hooks = {};

		_api.getRules = function(stylesheet) {
			if(typeof stylesheet === 'undefined') {
				return _rules;
			} else {
				if(typeof _rules[stylesheet] === 'undefined') {
					_rules[stylesheet] = [];
				}
				return _rules[stylesheet];
			}
		}
		_api.getPlugins = function() {
			return _plugins;
		}
		_api.getStorage = function() {
			return _storage;
		}
		_api.flush = function() {
			_rules = {};
			_storage = [];
			_hooks = {};
			_api.defaultProcessor = lib.processors.css.CSS();
			return _api;
		}
		_api['import'] = function() {
			if(_api.callHooks("import", arguments)) return _api;
			return _api;
		}
		_api.handlecss = function(parsed, path) {
			var plugins = _api.getPlugins();
			if(parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
				var rules = parsed.stylesheet.rules;
				for(var i=0; rule=rules[i]; i++) {
					switch(rule.type) {
						case "rule": _api.handlecssrule(rule); break;
						case "import": _api.handlecssimport(rule, path); break;
						default:
							if(plugins[rule.type]) {
								plugins[rule.type](_api, rule);
							}
						break;
					}
				}
			}
			return _api;
		}
		_api.handlecssimport = function(rule, cssPath) {
			return _api;
		}
		_api.handlecssrule = function(rule, stylesheet) {
			var absurdObj = {}, absurdProps = {};
			if(rule.declarations && rule.declarations.length > 0) {
				for(var i=0; decl=rule.declarations[i]; i++) {
					if(decl.type === "declaration") {
						absurdProps[decl.property] = decl.value;
					}
				}
				// absurdObj[rule.selectors.join(", ")] = absurdProps;
				if(rule.selectors && rule.selectors.length > 0) {
					for(var i=0; selector=rule.selectors[i]; i++) {
						absurdObj[selector] = extend({}, absurdProps);
					}
				}
				_api.add(absurdObj, stylesheet);
			}
			return _api;
		}

		// hooks
		_api.addHook = function(method, callback) {
			if(!_hooks[method]) _hooks[method] = [];
			var isAlreadyAdded = false;
			for(var i=0; c=_hooks[method][i]; i++) {
				if(c === callback) {
					isAlreadyAdded = true;
				}
			}
			isAlreadyAdded === false ? _hooks[method].push(callback) : null;
		}
		_api.callHooks = function(method, args) {
			if(_hooks[method]) {
				for(var i=0; c=_hooks[method][i]; i++) {
					if(c.apply(_api, args) === true) return true;
				}
			}
			return false;
		}

		// internal variables
		_api.numOfAddedRules = 0;

		// absurd.components API
		_api.components = (function(api) {
			var extend = lib.helpers.Extend,
				clone = lib.helpers.Clone,
				comps = {},
				instances = [],
				events = extend({}, Component()),
				exports = {};

			(function(fn) {
				if(!window) return;
				if (window.addEventListener) {
					window.addEventListener('load', fn);
				} else if(window.attachEvent) {
					window.attachEvent('onload', fn);
				}
			})(function() {
				exports.broadcast("ready");
			})

			return exports = {
				numOfComponents: 0,
				events: events,
				register: function(name, cls) {
					this.numOfComponents += 1;
					return comps[name] = function() {
						var c = extend({}, Component(name, api, events, clone(cls)));
						api.di.resolveObject(c);
						instances.push(c);
						if(typeof c.constructor === 'function') {
							c.constructor.apply(c, Array.prototype.slice.call(arguments, 0));
						}
						return c;
					};
				},
				get: function(name) {
					if(comps[name]) { return comps[name]; }
					else { throw new Error("There is no component with name '" + name + "'."); }
				},
				remove: function(name) {
					if(comps[name]) { delete comps[name]; return true; }
					return false;
				},
				list: function() {
					var l = [];
					for(var name in comps) l.push(name);
					return l;
				},
				flush: function() {
					comps = {};
					instances = [];
					return this;
				},
				broadcast: function(event, data) {
					for(var i=0; i<instances.length, instance=instances[i]; i++) {
						if(typeof instance[event] === 'function') {
							instance[event](data);
						}
					}
					return this;
				}
			}
		})(_api);

		// absurd.component shortcut
		_api.component = (function(api) {
			return function(name, cls) {
				if(typeof cls == 'undefined') {
					return api.components.get(name);
				} else {
					return api.components.register(name, cls);
				}
			}
		})(_api);

		// dependency injector
		_api.di = lib.DI(_api);
		injecting(_api);

		/******************************************* Copied directly from /lib/API.js */

		// client side specific methods
		_api.compile = function(callback, options) {
			if(_api.callHooks("compile", arguments)) return _api;
			var defaultOptions = {
				combineSelectors: true,
				minify: false,
				processor: _api.defaultProcessor,
				keepCamelCase: false,
				api: _api
			};
			options = extend(defaultOptions, options || {});
			var res = options.processor(
				_api.getRules(),
				callback || function() {},
				options
			);
			_api.flush();
			return res;
		}

		// registering api methods
		for(var method in lib.api) {
			if(method !== "compile") {
				_api[method] = lib.api[method](_api);
				_api[method] = (function(method) {
					return function() {
						var f = lib.api[method](_api);
						if(_api.callHooks(method, arguments)) return _api;
						return f.apply(_api, arguments);
					}
				})(method);
			}
		}

		// registering plugins
		for(var pluginName in lib.processors.css.plugins) {
			_api.plugin(pluginName, lib.processors.css.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		// check for Organic
		if(typeof Organic != 'undefined') {
			Organic.init(_api);
		}

		// attaching utils functions
		_api.utils = {
			str2DOMElement: str2DOMElement
		}

		return _api;

	}
};lib.DI = function(api) {
	var injector = {
	    dependencies: {},
	    register: function(key, value) {
	        this.dependencies[key] = value;
	        return this;
	    },
	    resolve: function() {
	        var func, deps, scope, self = this, isForResolving = false;
	        if(typeof arguments[0] === 'string') {
	            func = arguments[1];
	            deps = arguments[0].replace(/ /g, '').split(',');
	            scope = arguments[2] || {};
	        } else {
	            func = arguments[0];
	            deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
	            scope = arguments[1] || {};
	        }
	        for(var i=0; i<deps.length; i++) {
	        	if(typeof this.dependencies[deps[i]] != 'undefined') isForResolving = true;
	        }
	        if(isForResolving) {
		        return function() {
		        	var args = [];
		            var a = Array.prototype.slice.call(arguments, 0);
		            for(var i=0; i<deps.length; i++) {
		                var d = deps[i];
		                if(typeof self.dependencies[d] != 'undefined') {
		                	var diModule = self.dependencies[d];
		                	if(typeof diModule == 'function') {
		                		diModule.prototype.host = scope;
		                	} else if(typeof diModule == 'object') {
		                		diModule.host = scope;
		                	}
							args.push(diModule);
		                } else {
		                	args.push(a.shift())
		                }
		            }
		            return func.apply(scope, args);
		        }
	    	}
	    	return func;
	    },
	    resolveObject: function(o) {
	    	if(typeof o == 'object') {
	    		for(var key in o) {
	    			if(typeof o[key] == 'function') {
	    				o[key] = this.resolve(o[key], o);
	    			} else if(o[key] instanceof Array && o[key].length == 2 && typeof o[key][0] == 'string' && typeof o[key][1] == 'function') {
	    				o[key] = this.resolve(o[key][0], o[key][1], o);
	    			}
	    		}
	    	}
	    	return this;
	    },
	    flush: function() {
	    	this.dependencies = {};
	    	return this;
	    }
	}
	return injector;
};
lib.api.add = function(API) {
	var extend = absurdRequire("../helpers/Extend"),
		prefixes = absurdRequire("../helpers/Prefixes"),
		toRegister = [],
		options = {
			combineSelectors: true,
			preventCombining: ['@font-face']
		};

	var checkAndExecutePlugin = function(selector, prop, value, stylesheet, parentSelector) {
		var prefix = prefixes.nonPrefixProp(prop);
		var plugin = API.getPlugins()[prefix.prop];
		// console.log("\nChecking for plugin: " + prefix.prop + " (" + prop + ")");
		if(typeof plugin !== 'undefined') {
			var pluginResponse = plugin(API, value, prefix.prefix);
			if(pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		// console.log("\n---------- addRule ---------", parentSelector + ' >>> ' + selector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		// catching null values
		if(props === null || typeof props === 'undefined' || props === false) return;
		if(!parentSelector && !selector) selector = '';

		// classify
		if(typeof props.classify != 'undefined' && props.classify === true) {
			props = typeof props.toJSON != 'undefined' ? props.toJSON() : props.toString();
		}

		// multiple selectors
		if(/, ?/g.test(selector) && options.combineSelectors) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);
			}
			return;
		}

		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;
		}

		// if array is passed
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=0; i<props.length, prop=props[i]; i++) {
				addRule(selector, prop, stylesheet, parentSelector);
			}
			return;
		}

		var _props = {},
			_selector = selector,
			_objects = {},
			_functions = {};

		// processing props
		for(var prop in props) {
			// classify
			if(props[prop] && typeof props[prop].classify != 'undefined' && props[prop].classify === true) {
				props[prop] = typeof props[prop].toJSON != 'undefined' ? props[prop].toJSON() : props[prop].toString();
			}
			var type = typeof props[prop];
			if(type !== 'object' && type !== 'function' && props[prop] !== false && props[prop] !== true) {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					// moving the selector to the top of the chain
					if(_selector.indexOf("^") === 0) {
						_selector = _selector.substr(1, _selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '');
					} else {
						_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					}
					_props[prop] = props[prop];
					prefixes.addPrefixes(prop, _props);
				}
			} else if(type === 'object') {
				_objects[prop] = props[prop];
			} else if(type === 'function') {
				_functions[prop] = props[prop];
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		for(var prop in _objects) {
			// check for pseudo classes
			if(prop.charAt(0) === ":") {
				addRule(selector + prop, _objects[prop], stylesheet, parentSelector);
		    // check for ampersand operator
			} else if(/&/g.test(prop)) {
				if(/, ?/g.test(prop) && options.combineSelectors) {
					var parts = prop.replace(/, /g, ',').split(',');
					for(var i=0; i<parts.length, p=parts[i]; i++) {
						if(p.indexOf('&') >= 0) {
							addRule(p.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
						} else {
							addRule(p, _objects[prop], stylesheet, typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector);
						}
					}
				} else {
					addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
				}
			// check for media query
			} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
			// check for media query
			} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
			// moving the selector to the top of the chain
			} else if(selector.indexOf("^") === 0) {
				// selector, props, stylesheet, parentSelector
				addRule(
					selector.substr(1, selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '') + " " + prop,
					_objects[prop],
					stylesheet
				);
			// check for plugins
			} else if(checkAndExecutePlugin(selector, prop, _objects[prop], stylesheet, parentSelector) === false) {
				addRule(prop, _objects[prop], stylesheet, (parentSelector ? parentSelector + " " : "") + selector);
			}
		}

		for(var prop in _functions) {
			var o = {};
			o[prop] = _functions[prop]();
			addRule(selector, o, stylesheet, parentSelector);
		}

	}

	var add = function(rules, stylesheet, opts) {

		if(API.jsonify) {
			extend(API.getRules(stylesheet || 'mainstream'), rules);
			return API;
		}

		try {

			toRegister = [];
			API.numOfAddedRules += 1;

			if(typeof stylesheet === 'object' && typeof opts === 'undefined') {
				options = {
					combineSelectors: typeof stylesheet.combineSelectors != 'undefined' ? stylesheet.combineSelectors : options.combineSelectors,
					preventCombining: options.preventCombining.concat(stylesheet.preventCombining || [])
				};
				stylesheet = null;
			}
			if(typeof opts != 'undefined') {
				options = {
					combineSelectors: opts.combineSelectors || options.combineSelectors,
					preventCombining: options.preventCombining.concat(opts.preventCombining || [])
				};
			}

			var typeOfPreprocessor = API.defaultProcessor.type, uid;

			for(var selector in rules) {
				addRule(selector, rules[selector], stylesheet || "mainstream");
			}

			// looping through the rules for registering
			for(var i=0; i<toRegister.length; i++) {
				var stylesheet = toRegister[i].stylesheet,
					selector = toRegister[i].selector,
					props = toRegister[i].props,
					allRules = API.getRules(stylesheet);
				var pc = options && options.preventCombining ? '|' + options.preventCombining.join('|') : '';
				var uid = pc.indexOf('|' + selector.replace(/^%.*?%/, '')) >= 0 ? '~~' + API.numOfAddedRules + '~~' : '';
				// overwrite already added value
				var current = allRules[uid + selector] || {};
				for(var propNew in props) {
					var value = props[propNew];
					propNew = uid + propNew;
					if(typeof value != 'object') {
						if(typeOfPreprocessor == "css") {
							// appending values
							if(value.toString().charAt(0) === "+") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + ", " + value.substr(1, value.length-1);
								} else {
									current[propNew] = value.substr(1, value.length-1);
								}
							} else if(value.toString().charAt(0) === ">") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + " " + value.substr(1, value.length-1);
								} else {
									current[propNew] = value.substr(1, value.length-1);
								}
							} else {
								current[propNew] = value;
							}
						} else {
							current[propNew] = value;
						}

					}
				}
				allRules[uid + selector] = current;
			}

		return API;

		} catch(err) {
			throw new Error("Error adding: " + JSON.stringify({rules: rules, error: err.toString()}));
		}
	}
	return add;
}
var extend = absurdRequire("../helpers/Extend");

lib.api.compile = function(api) {
	return function() {
		var path = null, callback = function() {}, options = null;
		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": callback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object": options = arguments[i]; break;
			}
		}

		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			keepCamelCase: false,
			processor: api.defaultProcessor,
			api: api
		};
		options = extend(_defaultOptions, options || {});

		return options.processor(
			api.getRules(),
			function(err, result) {
				if(path != null) {
					try {
						var fileContent = result;
						if('object' === typeof fileContent) {
							fileContent = JSON.stringify(fileContent);
						}
						fs.writeFile(path, fileContent, function (err) {
							callback(err, result);
						});
					} catch(err) {
						callback.apply({}, arguments);
					}
				} else {
					callback.apply({}, arguments);
				}
				api.flush();
			},
			options
		);

	}
}

lib.api.compileFile = function(api) {
	return api.compile;
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.darken = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, -(percents/100));
	}
}
lib.api.define = function(api) {
	return function(prop, value) {
		if(!api.getStorage().__defined) api.getStorage().__defined = {};
		api.getStorage().__defined[prop] = value;
		return api;
	}
}
lib.api.hook = function(api) {
	return function(method, callback) {
		api.addHook(method, callback);
		return api;
	}
}
lib.api.importCSS = function(api) {
	var CSSParse = absurdRequire("../helpers/CSSParse");
	return function(cssData) {
		try {
			var parsed = CSSParse(cssData);
			api.handlecss(parsed, '');
		} catch(err) {
			console.log("Error in the CSS:  '" + cssData + "'", err, err.stack);
		}
		return api;
	}
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.lighten = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, percents/100);
	}
}
var metamorphosis = {
	html: function(api) {
		api.defaultProcessor = absurdRequire(__dirname + "/../processors/html/HTML.js")();
		api.hook("add", function(tags, template) {
			api.getRules(template || "mainstream").push(tags);
			return true;
		});
	},
	component: function(api) {
		api.defaultProcessor = absurdRequire(__dirname + "/../processors/component/Component.js")();
		api.hook("add", function(component) {
			if(!(component instanceof Array)) component = [component];
			for(var i=0; i<component.length, c = component[i]; i++) {
				api.getRules("mainstream").push(c);
			}
			return true;
		});
	},
	jsonify: function(api) {
		api.jsonify = true;
	},
	'dynamic-css': function(api) {
		api.dynamicCSS = true;
	}
}
lib.api.morph = function(api) {
	return function(type) {
		if(metamorphosis[type]) {
			api.flush();
			metamorphosis[type](api);
		}
		return api;
	}
}
lib.api.plugin = function(api) {
	var plugin = function(name, func) {
		api.getPlugins()[name] = func;
		return api;
	}
	return plugin;
}
lib.api.raw = function(api) {
	return function(raw) {
		var o = {}, v = {};
		var id = "____raw_" + api.numOfAddedRules;
		v[id] = raw;
		o[id] = v;
		api.add(o);
		return api;
	}
}
var fs = absurdRequire("fs"),
	path = absurdRequire("path");

lib.api.rawImport = function(API) {

	var importFile = function(path) {
		var fileContent = fs.readFileSync(path, {encoding: "utf8"});
		API.raw(fileContent);
	}

	return function(path) {
		var p, _i, _len;
		if (typeof path === 'string') {
			importFile(path);
		} else {
			for (_i = 0, _len = path.length; _i < _len; _i++) {
				p = path[_i];
				importFile(p);
			}
		}
		return API;
    };
}

lib.api.register = function(api) {
	return function(method, func) {
		api[method] = func;
		return api;
	}
}
lib.api.storage = function(API) {
	var _s = API.getStorage();
	var storage = function(name, value) {
		if(typeof value !== "undefined") {
			_s[name] = value;
		} else if(typeof name === "object") {
			for(var _name in name) {
				if(Object.prototype.hasOwnProperty.call(name, _name)) {
					storage(_name, name[_name]);
				}
			}
    } else {
			if(_s[name]) {
				return _s[name];
			} else {
				throw new Error("There is no data in the storage associated with '" + name + "'");
			}
		}
		return API;
	}
	return storage;
}
// Module by visionmedia
// https://github.com/reworkcss/css-parse
//
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g

lib.helpers.CSSParse = function(css, options){
  options = options || {};
  options.position = options.position === false ? false : true;

  /**
   * Positional.
   */

  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   */

  function updatePosition(str) {
    var lines = str.match(/\n/g);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf('\n');
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   */

  function position() {
    var start = { line: lineno, column: column };
    if (!options.position) return positionNoop;

    return function(node){
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }

  /**
   * Store position information for a node
   */

  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column: column };
    this.source = options.source;
  }

  /**
   * Non-enumerable source string
   */

  Position.prototype.content = css;

  /**
   * Return `node`.
   */

  function positionNoop(node) {
    whitespace();
    return node;
  }

  /**
   * Error `msg`.
   */

  function error(msg) {
    var err = new Error(msg + ' near line ' + lineno + ':' + column);
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = css;
    throw err;
  }

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rules()
      }
    };
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments(rules);
    while (css.length && css.charAt(0) != '}' && (node = atrule() || rule())) {
      rules.push(node);
      comments(rules);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    css = css.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules) {
    var c;
    rules = rules || [];
    while (c = comment()) rules.push(c);
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    var pos = position();
    if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

    var i = 2;
    while ("" != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
    i += 2;

    if ("" === css.charAt(i-1)) {
      return error('End of comment missing');
    }

    var str = css.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    css = css.slice(i);
    column += 2;

    return pos({
      type: 'comment',
      comment: str
    });
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    /* @fix Remove all comments from selectors
     * http://ostermiller.org/findcomment.html */
    return trim(m[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '').split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    var pos = position();

    // prop
    var prop = match(/^(\*?[-#\/\*\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) return;
    prop = trim(prop[0]);

    // :
    if (!match(/^:\s*/)) return error("property missing ':'");

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
    if (!val) return error('property missing value');

    var ret = pos({
      type: 'declaration',
      property: prop.replace(commentre, ''),
      value: trim(val[0]).replace(commentre, '')
    });

    // ;
    match(/^[;\s]*/);

    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return error("missing '{'");
    comments(decls);

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments(decls);
    }

    if (!close()) return error("missing '}'");
    return decls;
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];
    var pos = position();

    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return pos({
      type: 'keyframe',
      values: vals,
      declarations: declarations()
    });
  }

  /**
   * Parse keyframes.
   */

  function atkeyframes() {
    var pos = position();
    var m = match(/^@([-\w]+)?keyframes */);

    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return error("@keyframes missing name");
    var name = m[1];

    if (!open()) return error("@keyframes missing '{'");

    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }

    if (!close()) return error("@keyframes missing '}'");

    return pos({
      type: 'keyframes',
      name: name,
      vendor: vendor,
      keyframes: frames
    });
  }

  /**
   * Parse supports.
   */

  function atsupports() {
    var pos = position();
    var m = match(/^@supports *([^{]+)/);

    if (!m) return;
    var supports = trim(m[1]);

    if (!open()) return error("@supports missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@supports missing '}'");

    return pos({
      type: 'supports',
      supports: supports,
      rules: style
    });
  }

  /**
   * Parse host.
   */

  function athost() {
    var pos = position();
    var m = match(/^@host */);

    if (!m) return;

    if (!open()) return error("@host missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@host missing '}'");

    return pos({
      type: 'host',
      rules: style
    });
  }

  /**
   * Parse media.
   */

  function atmedia() {
    var pos = position();
    var m = match(/^@media *([^{]+)/);

    if (!m) return;
    var media = trim(m[1]);

    if (!open()) return error("@media missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@media missing '}'");

    return pos({
      type: 'media',
      media: media,
      rules: style
    });
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var pos = position();
    var m = match(/^@page */);
    if (!m) return;

    var sel = selector() || [];

    if (!open()) return error("@page missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@page missing '}'");

    return pos({
      type: 'page',
      selectors: sel,
      declarations: decls
    });
  }

  /**
   * Parse document.
   */

  function atdocument() {
    var pos = position();
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return;

    var vendor = trim(m[1]);
    var doc = trim(m[2]);

    if (!open()) return error("@document missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@document missing '}'");

    return pos({
      type: 'document',
      document: doc,
      vendor: vendor,
      rules: style
    });
  }

  /**
   * Parse font-face.
   */

  function atfontface() {
    var pos = position();
    var m = match(/^@font-face */);
    if (!m) return;

    if (!open()) return error("@font-face missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@font-face missing '}'");

    return pos({
      type: 'font-face',
      declarations: decls
    });
  }

  /**
   * Parse import
   */

  var atimport = _compileAtrule('import');

  /**
   * Parse charset
   */

  var atcharset = _compileAtrule('charset');

  /**
   * Parse namespace
   */

  var atnamespace = _compileAtrule('namespace');

  /**
   * Parse non-block at-rules
   */


  function _compileAtrule(name) {
    var re = new RegExp('^@' + name + ' *([^;\\n]+);');
    return function() {
      var pos = position();
      var m = match(re);
      if (!m) return;
      var ret = { type: name };
      ret[name] = m[1].trim();
      return pos(ret);
    }
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    if (css[0] != '@') return;

    return atkeyframes()
      || atmedia()
      || atsupports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atdocument()
      || atpage()
      || athost()
      || atfontface();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var pos = position();
    var sel = selector();

    if (!sel) return error('selector missing');
    comments();

    return pos({
      type: 'rule',
      selectors: sel,
      declarations: declarations()
    });
  }

  return stylesheet();
};

/**
 * Trim `str`.
 */

function trim(str) {
  return str ? str.replace(/^\s+|\s+$/g, '') : '';
}
lib.helpers.Clone = function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    for(var i=0; i<types.length; i++) {
        var type = types[i];
        if(item instanceof type) {
            result = type( item );
        }
    }

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) {
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}
// credits: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
lib.helpers.ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
lib.helpers.Extend = function() {
	var process = function(destination, source) {
	    for(var key in source) {
			if(Object.prototype.hasOwnProperty.call(source, key)) {
			    destination[key] = source[key];
			}
	    }
	    return destination;
	};
	var result = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		result = process(result, arguments[i]);
	}
	return result;
}
// http://docs.emmet.io/css-abbreviations/vendor-prefixes/ (w: webkit, m: moz, s: ms, o: o)
var prefixExtract = function(prop) {
	var result, match;
	if((match = prop.match(/^\-(w|m|s|o)+\-/) || prop.charAt(0) === '-') && !prop.match(/^\-(webkit|moz|ms)+\-/)) {
		if(match !== null && match[0]) {
			result = { prefix: match[0].replace(/-/g, '') }
			result.prop = prop.replace(match[0], '');
		} else {
			result = { prefix: '' }
			result.prop = prop.substr(1, prop.length);
		}
	} else {
		result = {
			prefix: false,
			prop: prop
		}
	}
	return result;
}
lib.helpers.Prefixes = {
	addPrefixes: function(prop, obj) {
		var originalProp = prop, p = prefixExtract(prop), value = obj[prop];
		if(p.prefix !== false) {
			delete obj[originalProp];
			obj[p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('w') >= 0)
				obj['-webkit-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('m') >= 0)
				obj['-moz-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('s') >= 0)
				obj['-ms-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('o') >= 0)
				obj['-o-' + p.prop] = value;
		}
	},
	nonPrefixProp: function(prop) {
		var p = prefixExtract(prop);
		if(p.prefix !== false) {
			if(p.prefix == '') {
				p.prefix = '-';
			} else {
				p.prefix = '-' + p.prefix + '-';
			}
		}
		return p;
	}
}
lib.helpers.RequireUncached = function(module) {
	delete absurdRequire.cache[absurdRequire.resolve(module)]
    return absurdRequire(module);
}
lib.helpers.TransformUppercase = function(prop, options) {
	var transformed = "";
	for(var i=0; c=prop.charAt(i); i++) {
		if(c === c.toUpperCase() && c.toLowerCase() !== c.toUpperCase()) {
			transformed += "-" + c.toLowerCase();
		} else {
			transformed += c;
		}
	}
	return transformed;
}
var compileComponent = function(input, callback, options) {

	var css = "",
		html = "",
		all = [],
		api = options.api;
		cssPreprocessor = absurdRequire(__dirname + "/../css/CSS.js")(),
		htmlPreprocessor = absurdRequire(__dirname + "/../html/HTML.js")();

	var processCSS = function(clb) {
		for(var i=0; i<all.length, component=all[i]; i++) {
			if(typeof component === "function") { component = component(); }
			api.add(component.css ? component.css : {});
		}
		cssPreprocessor(api.getRules(), function(err, result) {
			css += result;
			clb(err);
		}, options);
	}
	var processHTML = function(clb) {
		var index = 0;
		var error = null;
		var processComponent = function() {
			if(index > input.length-1) {
				clb(error);
				return;
			}
			var c = input[index];
			if(typeof c === "function") { c = c(); }
			api.morph("html").add(c.html ? c.html : {});
			htmlPreprocessor(api.getRules(), function(err, result) {
				html += result;
				index += 1;
				error = err;
				processComponent();
			}, options);
		}
		processComponent();
	}
	var checkForNesting = function(o) {
		for(var key in o) {
			if(key === "_include") {
				if(o[key] instanceof Array) {
					for(var i=0; i<o[key].length, c=o[key][i]; i++) {
						if(typeof c === "function") { c = c(); }
						all.push(c);
						checkForNesting(c);
					}
				} else {
					if(typeof o[key] === "function") { o[key] = o[key](); }
					all.push(o[key]);
					checkForNesting(o[key]);
				}
			} else if(typeof o[key] === "object") {
				checkForNesting(o[key]);
			}
		}
	}

	// Checking for nesting. I.e. collecting the css and html.
	for(var i=0; i<input.length, c=input[i]; i++) {
		if(typeof c === "function") { c = c(); }
		all.push(c);
		checkForNesting(c);
	}

	api.flush();
	processCSS(function(errCSS) {
		api.morph("html");
		processHTML(function(errHTML) {
			callback(
				errCSS || errHTML ? {error: {css: errCSS, html: errHTML }} : null,
				css,
				html
			)
		});
	});

}
lib.processors.component.Component = function() {
	var processor = function(rules, callback, options) {
		compileComponent(rules.mainstream, callback, options);
	}
	processor.type = "component";
	return processor;
}
var newline = '\n',
	defaultOptions = {
		combineSelectors: true,
		minify: false,
		keepCamelCase: false
	},
	transformUppercase = absurdRequire("../../helpers/TransformUppercase"),
	extend = absurdRequire("../../helpers/Extend");

var toCSS = function(rules, options, indent) {
	var css = '';
	indent = indent || ['', '  '];
	for(var selector in rules) {
		// handling raw content
		if(selector.indexOf("____raw") === 0) {
			css += rules[selector][selector] + newline;
		// handling normal styles
		} else {
			var entityStyle = indent[0] + selector.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '') + ' {' + newline;
			var entity = '';
			for(var prop in rules[selector]) {
				var value = rules[selector][prop];
				if(value === "") {
					value = '""';
				}
				prop = prop.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '');
				if(options && options.keepCamelCase === true) {
					entity += indent[1] + prop + ': ' + value + ';' + newline;
				} else {
					entity += indent[1] + transformUppercase(prop) + ': ' + value + ';' + newline;
				}
			}
			if(entity != '') {
				entityStyle += entity;
				entityStyle += indent[0] + '}' + newline;
				css += entityStyle;
			}
		}
	}
	return css;
}

var toJSON = function(rules, options) {
	var result = {};
	for(var stylesheet in rules) {
		var styles = rules[stylesheet];
		if(stylesheet == 'mainstream') {
			for(var selector in styles) {
				result[selector] = {}
				for(var prop in styles[selector]) {
					result[selector][prop] = styles[selector][prop];
				}
			}
		} else if(stylesheet.indexOf('@media') >= 0) {
			result[stylesheet] = {};
			for(var selector in styles) {
				result[stylesheet][selector] = {}
				for(var prop in styles[selector]) {
					result[stylesheet][selector][prop] = styles[selector][prop];
				}
			}
		}
	}
	return result;
}

// combining selectors
var combineSelectors = function(rules, preventCombining) {

	var map = [], arr = {};
	var preventCombining = [].concat(preventCombining || []);
	preventCombining.splice(0, 0, '');
	preventCombining = preventCombining.join('|');

	// extracting every property
	for(var selector in rules) {
		var props = rules[selector];
		for(var prop in props) {
			map.push({
				selector: selector,
				prop: prop,
				value: props[prop],
				combine: preventCombining.indexOf('|' + prop) < 0 && selector.indexOf('@font-face') < 0
			});
		}
	}

	// combining
	for(var i=0; i<map.length; i++) {
		if(map[i].combine === true && map[i].selector !== false) {
			for(var j=i+1;j<map.length; j++) {
				if(map[i].prop === map[j].prop && map[i].value === map[j].value) {
					map[i].selector += ', ' + map[j].selector.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '');
					map[j].selector = false; // marking for removal
				}
			}
		}
	}

	// preparing the result
	for(var i=0; i<map.length; i++) {
		if(map[i].selector !== false) {
			if(!arr[map[i].selector]) arr[map[i].selector] = {}
			arr[map[i].selector][map[i].prop] = map[i].value;
		}
	}

	return arr;
}

var minimize = function(content) {
    content = content.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
    // now all comments, newlines and tabs have been removed
    content = content.replace( / {2,}/g, ' ' );
    // now there are no more than single adjacent spaces left
    // now unnecessary: content = content.replace( /(\s)+\./g, ' .' );
    content = content.replace( / ([{:}]) /g, '$1' );
    content = content.replace( /([;,]) /g, '$1' );
    content = content.replace( / !/g, '!' );
    return content;
}

var replaceDefined = function(css, options) {
	if(options && options.api && options.api.getStorage().__defined) {
		var storage = options.api.getStorage().__defined;
		for(var prop in storage) {
			var re = new RegExp('<%( )?' + prop + '( )?%>', 'g');
			if(typeof storage[prop] != 'function') {
				css = css.replace(re, storage[prop]);
			} else {
				css = css.replace(re, storage[prop]());
			}
		}
	}
	return css;
}

lib.processors.css.CSS = function() {
	var processor = function(rules, callback, options) {
		options = options || defaultOptions;
		if(options.api && options.api.jsonify) {
			var json = toJSON(rules, options);
			callback(null, json);
			return json;
		}
		var css = '';
		for(var stylesheet in rules) {
			var r = rules[stylesheet];
			r = options.combineSelectors ? combineSelectors(r, options.preventCombining) : r;
			if(stylesheet === "mainstream") {
				css += toCSS(r, options);
			} else {
				css += stylesheet + " {" + newline + toCSS(r, options, ['  ', '    ']) + "}" + newline;
			}
		}
		css = replaceDefined(css, options);
		// Dynamic CSS
		if(options && options.api && options.api.dynamicCSS) {
			css = absurdRequire("../html/helpers/TemplateEngine")(css, options);
		}
		// Minification
		if(options.minify) {
			css = minimize(css);
			if(callback) callback(null, css);
		} else {
			if(callback) callback(null, css);
		}
		return css;
	}
	processor.type = "css";
	return processor;
}

lib.processors.css.plugins.charset = function() {
	return function(api, charsetValue) {
		if(typeof charsetValue === "string") {
			api.raw("@charset: \"" + charsetValue + "\";");
		} else if(typeof charsetValue === "object") {
			charsetValue = charsetValue.charset.replace(/:/g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '');
			api.raw("@charset: \"" + charsetValue + "\";");
		}
	}
}
lib.processors.css.plugins.document = function() {
	return function(api, value) {
		if(typeof value === "object") {
			var stylesheet = '';
			stylesheet += '@' + value.vendor + 'document';
			stylesheet += ' ' + value.document;
			if(value.rules && value.rules.length) {
				for(var i=0; rule=value.rules[i]; i++) {
					api.handlecssrule(rule, stylesheet);
				}
			} else if(typeof value.styles != "undefined") {
				api.add(value.styles, stylesheet);
			}
		}
	}
}
lib.processors.css.plugins.keyframes = function() {
	return function(api, value) {
		var processor = absurdRequire(__dirname + "/../CSS.js")();
		var prefixes = absurdRequire(__dirname + "/../../../helpers/Prefixes");
		if(typeof value === "object") {
			// js or json
			var frames;
			if(typeof value.frames != "undefined") {
				frames = value.frames;
			// css
			} else if(typeof value.keyframes != "undefined") {
				frames = {};
				for(var i=0; rule=value.keyframes[i]; i++) {
					if(rule.type === "keyframe") {
						var f = frames[rule.values] = {};
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								f[declaration.property] = declaration.value;
							}
						}
					}
				}
			}
			if(api.jsonify) {
				var r = {};
				r.keyframes = {
					name: value.name,
					frames: frames
				}
				api.add(r);
			} else {
				var absurd = absurdRequire(__dirname + '/../../../../')();
				absurd.add(frames).compile(function(err, css) {
					var content = '@keyframes ' + value.name + " {\n";
					content += css;
					content += "}";
					content = content + "\n" + content.replace("@keyframes", "@-webkit-keyframes");
					api.raw(content);
				}, {combineSelectors: false});
			}
		}
	}
}
lib.processors.css.plugins.media = function() {
	return function(api, value) {
		var processor = absurdRequire(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {}, json = {};
			for(var i=0; rule=value.rules[i]; i++) {
				var
					r, rjson;
				if (rule.selectors) {
					r = rules[rule.selectors.toString()] = {};
					rjson = json[rule.selectors.toString()] = {};
					if(rule.type === "rule") {
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								r[declaration.property] = declaration.value;
								rjson[declaration.property] = declaration.value;
							}
						}
					}
				}

			}
			content += processor({mainstream: rules});
			content += "}";
			if(api.jsonify) {
				api.add(json, '@media ' + value.media);
			} else {
				api.raw(content);
			}
		}
	}
}
lib.processors.css.plugins.namespace = function() {
	return function(api, value) {
		if(typeof value === "string") {
			api.raw("@namespace: \"" + value + "\";");
		} else if(typeof value === "object") {
			value = value.namespace.replace(/: /g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '').replace(/:h/g, 'h');
			api.raw("@namespace: \"" + value + "\";");
		}
	}
}
lib.processors.css.plugins.page = function() {
	return function(api, value) {
		if(typeof value === "object") {
			var content = "";
			if(value.selectors.length > 0) {
				content += "@page " + value.selectors.join(", ") + " {\n";
			} else {
				content += "@page {\n";
			}
			for(var i=0; declaration=value.declarations[i]; i++) {
				if(declaration.type == "declaration") {
					content += "  " + declaration.property + ": " + declaration.value + ";\n";
				}
			}
			content += "}";
			api.raw(content);
		}
	}
}
lib.processors.css.plugins.supports = function() {
	return function(api, value) {
		var processor = absurdRequire(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@supports ' + value.supports + " {\n";
			var rules = {};
			for(var i=0; rule=value.rules[i]; i++) {
				var r = rules[rule.selectors.toString()] = {};
				if(rule.type === "rule") {
					for(var j=0; declaration=rule.declarations[j]; j++) {
						if(declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({mainstream: rules});
			content += "}";
			api.raw(content);
		}
	}
}
var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [],
	beautifyHTML = absurdRequire('js-beautify').html,
	tu = absurdRequire("../../helpers/TransformUppercase"),
	passedOptions = {};

var processTemplate = function(templateName) {
	var html = '';
	for(var template in data) {
		if(template == templateName) {
			var numOfRules = data[template].length;
			for(var i=0; i<numOfRules; i++) {
				html += process('', data[template][i]);
			}
		}
	}
	return html;
}
var prepareProperty = function(prop, options) {
	if(options && options.keepCamelCase === true) {
		return prop;
	} else {
		return tu(prop, options);
	}
}
var process = function(tagName, obj) {
	// console.log("------------------------\n", tagName, ">", obj);

	var html = '', attrs = '', childs = '';

	var tagAnalized = absurdRequire("./helpers/PropAnalyzer")(tagName);
	tagName = tagAnalized.tag;
	if(tagAnalized.attrs != "") {
		attrs += " " + tagAnalized.attrs;
	}

	if(typeof obj === "string" || obj === null) {
		return packTag(tagName, attrs, obj);
	}

	var addToChilds = function(value) {
		if(childs != '') { childs += newline; }
		childs += value;
	}

	// process directives
	for(var directiveName in obj) {
		var value = obj[directiveName];
		switch(directiveName) {
			case "_attrs":
				for(var attrName in value) {
					if(typeof value[attrName] === "function") {
						attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName]() + "\"";
					} else {
						attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName] + "\"";
					}
				}
			break;
			case "_":
				addToChilds(value);
			break;
			case "_tpl":
				if(typeof value == "string") {
					addToChilds(processTemplate(value));
				} else if(value instanceof Array) {
					var tmp = '';
					for(var i=0; tpl=value[i]; i++) {
						tmp += processTemplate(tpl)
						if(i < value.length-1) tmp += newline;
					}
					addToChilds(tmp);
				}
			break;
			case "_include":
				var tmp = '';
				var add = function(o) {
					if(typeof o === "function") { o = o(); }
					if(o.css && o.html) { o = o.html; } // catching a component
					tmp += process('', o);
				}
				if(value instanceof Array) {
					for(var i=0; i<value.length, o=value[i]; i++) {
						add(o);
					}
				} else if(typeof value === "object"){
					add(value);
				}
				addToChilds(tmp);
			break;
			default:
				switch(typeof value) {
					case "string": addToChilds(process(directiveName, value)); break;
					case "object":
						if(value && value.length && value.length > 0) {
							var tmp = '';
							for(var i=0; v=value[i]; i++) {
								tmp += process('', typeof v == "function" ? v() : v);
								if(i < value.length-1) tmp += newline;
							}
							addToChilds(process(directiveName, tmp));
						} else {
							addToChilds(process(directiveName, value));
						}
					break;
					case "function": addToChilds(process(directiveName, value())); break;
				}
			break;
		}
	}

	if(tagName != '') {
		html += packTag(tagName, attrs, childs);
	} else {
		html += childs;
	}

	return html;
}
var packTag = function(tagName, attrs, childs) {
	var html = '';
	if(tagName == '' && attrs == '' && childs != '') {
		return childs;
	}
	tagName = tagName == '' ? 'div' : tagName;
	if(childs !== null) {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '>' + newline + childs + newline + '</' + prepareProperty(tagName, passedOptions) + '>';
	} else {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '/>';
	}
	return html;
}
var prepareHTML = function(html) {
	html = absurdRequire("./helpers/TemplateEngine")(html.replace(/[\r\t\n]/g, ''), passedOptions);
	if(passedOptions.minify) {
		return html;
	} else {
		return beautifyHTML(html, {indent_size: passedOptions.indentSize || 4});
	}
}
lib.processors.html.HTML = function() {
	var processor = function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = passedOptions = options || defaultOptions;
		var html = prepareHTML(processTemplate("mainstream"));
		callback(null, html);
		return html;
	}
	processor.type = "html";
	return processor;
}
lib.processors.html.helpers.PropAnalyzer = function(prop) {
	var res = {
			tag: '',
			attrs: ''
		},
		numOfChars = prop.length,
		tagName = "",
		className = "", readingClass = false, classes = [],
		idName = "", readingId = false, ids = [],
		attributes = "", readingAttributes = false;

	if(/(#|\.|\[|\])/gi.test(prop) === false) {
		return {
			tag: prop,
			attrs: ''
		};
	}

	for(var i=0; i<prop.length, c=prop[i]; i++) {
		if(c === "[" && !readingAttributes) {
			readingAttributes = true;
		} else if(readingAttributes) {
			if(c != "]") {
				attributes += c;
			} else {
				readingAttributes = false;
				i -= 1;
			}
		} else if(c === "." && !readingClass) {
			readingClass = true;
		} else if(readingClass) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				className += c;
			} else {
				classes.push(className);
				readingClass = false;
				className = "";
				i -= 1;
			}
		} else if(c === "#" && !readingId) {
			readingId = true;
		} else if(readingId) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				idName += c;
			} else {
				readingId = false;
				i -= 1;
			}
		} else if(c != "." && c != "#" && c != "[" && c != "]") {
			res.tag += c;
		}
	}

	// if ends with a class
	if(className != "") classes.push(className);

	// collecting classes
	var clsStr = '';
	for(var i=0; cls=classes[i]; i++) {
		clsStr += clsStr === "" ? cls : " " + cls;
	}
	res.attrs += clsStr != "" ? 'class="' + clsStr + '"' : '';

	// if ends on id
	if(idName != "") {
		res.attrs += (res.attrs != "" ? " " : "") + 'id="' + idName + '"';
	}

	// if div tag name is skipped
	if(res.tag === "" && res.attrs != "") res.tag = "div";

	// collecting attributes
	if(attributes != "") {
		res.attrs += (res.attrs != "" ? " " : "") + attributes;
	}

	return res;
}
lib.processors.html.helpers.TemplateEngine = function(html, options) {
	var re = /<%(.+?)%>/g,
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
		code = 'with(obj) { var r=[];\n',
		cursor = 0,
		result;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
};
return client();
})(window);


    return Absurd;
}));
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js":[function(require,module,exports){
var destroy = require('../utils/destroy');
var _Destroyable = function () {
    this._owned = {};
    this._ownedAnonymous = [];
};
_Destroyable.prototype = {
    _own: function (o, key) {
        if (key) {
            this._destroy(key);
            this._owned[key] = o;
        } else {
            this._ownedAnonymous.push(o);
        }
        return o;
    },
    _unown: function (key) {
        delete this._owned[key];
    },
    _destroy: function (key) {
        var o = this._owned[key];
        this._unown(key);
        destroy(o);
    },
    destroy: function () {
        destroy(this._ownedAnonymous);
        for (var key in this._owned) {
            destroy(this._owned[key]);
        }
        this._destroyed = true;
    }
};
module.exports = _Destroyable;
},{"../utils/destroy":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/destroy.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js":[function(require,module,exports){
module.exports = {
    _on: function (type, cb) {
        this._listeners || (this._listeners = {});
        var listeners = this._listeners[type] || (this._listeners[type] = []);
        listeners.push(cb);
        return function () {
            listeners.splice(listeners.indexOf(cb), 1);
        };
    },
    _emit: function (type, event) {
        var listeners = this._listeners && this._listeners[type];
        if (listeners) {
            listeners = listeners.slice(0);
            var length = listeners.length;
            var i = 0;
            while (i < length) {
                listeners[i++](event);
            }
        }
    }
};
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/JSS.js":[function(require,module,exports){
var compose = require('../../utils/compose'), Style = require('./Style'), Absurd = require('../../absurd/Absurd');
module.exports = compose(Style.prototype, function (jss) {
    var css;
    Absurd().add({ '#this': jss }).compile(function (err, result) {
        css = result;
    });
    Style.call(this, css);
});
},{"../../absurd/Absurd":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/absurd/Absurd.js","../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js","./Style":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/Style.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/Style.js":[function(require,module,exports){
var compose = require('../../utils/compose');
if (window.kssId === undefined) {
    window.kssId = 0;
}
function createId() {
    return 'kss' + window.kssId++;
}
var styleElement = document.createElement('style');
var rulesArray = [], applied = 0;
function updateCss() {
    if (applied && styleElement.childNodes.length > 0) {
        if (!styleElement.parentNode) {
            document.head.appendChild(styleElement);
        }
    } else {
        if (styleElement.parentNode) {
            document.head.removeChild(styleElement);
        }
    }
}
var rules = {
        add: function (rule) {
            styleElement.appendChild(rule);
            updateCss();
        },
        remove: function (rule) {
            styleElement.removeChild(rule);
            updateCss();
        }
    };
module.exports = compose(function (css) {
    this.id = createId();
    this.rule = document.createTextNode(css.replace(/#this/g, '.' + this.id));
    rules.add(this.rule);
}, {
    apply: function (domNode) {
        domNode.classList.add(this.id);
        applied += 1;
        updateCss();
    },
    unapply: function (domNode) {
        domNode.classList.remove(this.id);
        applied -= 1;
        updateCss();
    },
    applyState: function (domNode, state) {
        domNode.classList.add(state);
    },
    unapplyState: function (domNode, state) {
        domNode.classList.remove(state);
    },
    destroy: function () {
        rules.remove(this.rule);
    }
});
},{"../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/bindValue.js":[function(require,module,exports){
module.exports = function (value, cb, scope) {
    scope = scope || null;
    cb.call(scope, value.value());
    return value.onChange(cb.bind(scope));
};
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/deep/bindOrderedBranch.js":[function(require,module,exports){
module.exports = function (orderedBranch, cbs) {
    var storage = {};
    var add = cbs.add && function (ev) {
            var ret = cbs.add(ev.key, ev.beforeKey);
            storage[ev.key] = ret;
        };
    var remove = cbs.remove && function (ev) {
            var key = ev.key;
            cbs.remove(key, storage[key]);
            delete storage[key];
        };
    var move = cbs.move && function (ev) {
            cbs.move(ev.key, ev.beforeKey);
        };
    if (cbs.init) {
        cbs.init(orderedBranch.keys());
    } else {
        add && orderedBranch.keys().map(function (key) {
            return {
                key: key,
                beforeKey: null
            };
        }).forEach(add);
    }
    var keyAddedHandler = add && orderedBranch.onKeyAdded(add);
    var keyRemovedHandler = remove && orderedBranch.onKeyRemoved(remove);
    var keyMovedHandler = move && orderedBranch.onKeyMoved(move);
    return function () {
        keyAddedHandler && keyAddedHandler();
        keyRemovedHandler && keyRemovedHandler();
        keyMovedHandler && keyMovedHandler();
    };
};
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js":[function(require,module,exports){
var compose = function (base) {
    var constructors = [];
    var prototypes = [];
    var trait;
    var i, props;
    for (i = 0; i < arguments.length; i++) {
        trait = arguments[i];
        if (typeof trait === 'function') {
            constructors.push(trait);
            prototypes.push(trait.prototype);
        } else {
            prototypes.push(trait);
        }
    }
    var constructorsLenght = constructors.length;
    var Ctr = function () {
        for (i = 0; i < constructorsLenght; i++) {
            constructors[i].apply(this, arguments);
        }
    };
    Ctr.prototype = Object.create(typeof base === 'function' ? base.prototype : base);
    for (i = 1; i < prototypes.length; i++) {
        props = prototypes[i];
        for (var key in props) {
            Ctr.prototype[key] = props[key];
        }
    }
    return Ctr;
};
compose.create = function (base) {
    var trait, instance, i, l, props;
    var constructors = [];
    if (typeof base === 'function') {
        instance = Object.create(base.prototype);
        constructors.push(base);
    } else {
        instance = Object.create(base);
    }
    for (i = 1, l = arguments.length; i < l; i++) {
        trait = arguments[i];
        if (typeof trait === 'function') {
            constructors.push(trait);
            props = trait.prototype;
        } else {
            props = trait;
        }
        for (var key in props) {
            instance[key] = props[key];
        }
    }
    for (i = 0, l = constructors.length; i < l; i++) {
        constructors[i].call(instance);
    }
    return instance;
};
module.exports = compose;
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/destroy.js":[function(require,module,exports){
var destroy = function (value) {
    if (!value) {
        return;
    }
    if (value.destroy) {
        value.destroy();
    } else if (typeof value === 'function') {
        value();
    } else if (value.forEach) {
        value.forEach(destroy);
    }
};
module.exports = destroy;
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/lodash/internal/baseToString.js":[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/lodash/string/capitalize.js":[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/**
 * Capitalizes the first character of `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('fred');
 * // => 'Fred'
 */
function capitalize(string) {
  string = baseToString(string);
  return string && (string.charAt(0).toUpperCase() + string.slice(1));
}

module.exports = capitalize;

},{"../internal/baseToString":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/lodash/internal/baseToString.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/utils/delegateGetSet.js":[function(require,module,exports){
module.exports = function delegateGetSet (component, method) {
	return function(value) {
		if (arguments.length) {
			this[component][method](value);
			return this;
		} else {
			return this[component][method]();
		}
	};
};

},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Destroyable.js":[function(require,module,exports){
module.exports=require("/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js")
},{"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Destroyable.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js":[function(require,module,exports){
module.exports=require("/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js")
},{"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/base/_Evented.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/dom/style/Style.js":[function(require,module,exports){
module.exports=require("/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/Style.js")
},{"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/Style.js":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/dom/style/Style.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/dom/style/loadFont.js":[function(require,module,exports){
/*jshint multistr: true */
var insertCss = require('insert-css');
module.exports = function(fontData, name, options) {
	options = options || {};
	var format = options.format || 'woff',
		weight = options.weight || 'normal',
		style = options.style || 'normal';

	insertCss('@font-face { \
	    font-family: "'+ name +'"; \
	    src: url(data:application/octet-stream;base64,' + fontData + ') format("' + format + '"); \
	    font-weight: ' + weight + '; \
	    font-style: ' + style + '; \
	}');
	return name;
};
},{"insert-css":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/node_modules/insert-css/index.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/node_modules/insert-css/index.js":[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/MappedValue.js":[function(require,module,exports){
var compose = require('../utils/compose'), _Destroyable = require('../base/_Destroyable'), Value = require('./Value'), bindValue = require('./bindValue');
module.exports = compose(_Destroyable, function (source, convert, revert) {
    this._source = source;
    this._value = new Value();
    this._own(bindValue(source, function (sourceValue) {
        this.value(convert(sourceValue));
    }, this._value));
    this._revert = revert;
}, {
    value: function (value) {
        if (arguments.length) {
            return this.change(value);
        } else {
            return this._value.value();
        }
    },
    change: function (value) {
        return this._revert && this._source.change(this._revert.call(null, value));
    },
    onChange: function (cb) {
        return this._value.onChange(cb);
    }
});
},{"../base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Destroyable.js","../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js","./Value":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/Value.js","./bindValue":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/bindValue.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/StatefulFactory.js":[function(require,module,exports){
var compose = require('../utils/compose'), _Stateful = require('./_Stateful');
var StatefulFactory = compose(function (model) {
        this.ctr = compose(_Stateful, model.accessorMixin, { _computer: model.computer }, function (initArg) {
            var computer = this._computer;
            this._value = arguments.length ? computer.initValue(initArg) : computer.initValue();
        });
    });
module.exports = StatefulFactory;
},{"../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js","./_Stateful":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/_Stateful.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/Value.js":[function(require,module,exports){
var StatefulFactory = require('./StatefulFactory'), ValueModel = require('./model/Value');
module.exports = new StatefulFactory(new ValueModel()).ctr;
},{"./StatefulFactory":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/StatefulFactory.js","./model/Value":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/model/Value.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/_Stateful.js":[function(require,module,exports){
var compose = require('../utils/compose'), _Evented = require('../base/_Evented');
var Stateful = compose(_Evented, {
        _getValue: function () {
            return this._value;
        },
        _change: function (changeArg) {
            this._value = this._computer.computeValue(changeArg, this._value);
            this._emit('change', changeArg);
        },
        _onChange: function (cb) {
            return this._on('change', cb);
        }
    });
module.exports = Stateful;
},{"../base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/accessorMixins/Value.js":[function(require,module,exports){
var compose = require('../../utils/compose');
var ValueAPI = {
        value: function (value) {
            if (arguments.length) {
                return this._change(value);
            } else {
                return this._getValue();
            }
        },
        onChange: function (cb) {
            return this._onChange(cb);
        }
    };
ValueAPI.change = ValueAPI.value;
var Value = compose(function () {
        this.ctr = compose(ValueAPI);
    });
module.exports = Value;
},{"../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/bindValue.js":[function(require,module,exports){
module.exports=require("/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/bindValue.js")
},{"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/bindValue.js":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/observable/bindValue.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/computers/Value.js":[function(require,module,exports){
var compose = require('../../utils/compose');
var Value = compose(function (defaultValue) {
        this._defaultValue = defaultValue;
    }, {
        initValue: function (initValue) {
            return arguments.length ? initValue : this._defaultValue;
        },
        computeValue: function (changeArg, initValue) {
            return changeArg;
        },
        computeChangeArg: function (changeArg, initValue) {
            return changeArg;
        }
    });
module.exports = Value;
},{"../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/Branch.js":[function(require,module,exports){
var compose = require('../../utils/compose'), _Evented = require('../../base/_Evented'), _Destroyable = require('../../base/_Destroyable');
function firstPathSegment(path) {
    var slashIndex = path.indexOf('/');
    return slashIndex < 0 ? path : path.substring(0, slashIndex);
}
module.exports = compose(_Evented, _Destroyable, function (source, key) {
    var self = this;
    this._source = source;
    this._key = key;
    var values = this._values = {};
    var keyLength = key.length;
    var sourceValue = source.value();
    Object.keys(sourceValue).forEach(function (sourceKey) {
        if (firstPathSegment(sourceKey) === key) {
            var relativeKey = sourceKey.substr(keyLength + 1);
            values[relativeKey] = sourceValue[sourceKey];
        }
    });
    this._own(source.onChange(function (change) {
        if (firstPathSegment(change.key) === key) {
            var relativeKey = change.key.substr(keyLength + 1);
            if (change.value === undefined) {
                delete values[relativeKey];
                if (!self.hasKey(firstPathSegment(relativeKey))) {
                    self._emit('keyRemoved', firstPathSegment(relativeKey));
                }
            } else {
                if (!self.hasKey(firstPathSegment(relativeKey))) {
                    values[relativeKey] = change.value;
                    self._emit('keyAdded', firstPathSegment(relativeKey));
                } else {
                    values[relativeKey] = change.value;
                }
            }
            self._emit('change', {
                key: relativeKey,
                value: change.value
            });
        }
    }));
}, {
    hasKey: function (key) {
        return Object.keys(this._values).some(function (valueKey) {
            return firstPathSegment(valueKey) === key;
        });
    },
    keys: function () {
        return Object.keys(this._values).reduce(function (acc, path) {
            var child = firstPathSegment(path);
            if (!(child in acc)) {
                acc[child] = true;
            }
            return acc;
        }, {});
    },
    change: function (key, value) {
        return this._source.change(this._key + '/' + key, value);
    },
    onChange: function (cb) {
        return this._on('change', cb);
    },
    onKeyAdded: function (cb) {
        return this._on('keyAdded', cb);
    },
    onKeyRemoved: function (cb) {
        return this._on('keyRemoved', cb);
    },
    value: function () {
        return this._values;
    },
    addKey: function (key) {
        key = key || (Math.random() * 10000000000000000).toFixed();
        this.change(key, true);
        return key;
    },
    removeKey: function (key) {
        var self = this;
        Object.keys(this._values).forEach(function (path) {
            if (firstPathSegment(path) === key) {
                self.change(path, undefined);
            }
        });
    }
});
},{"../../base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Destroyable.js","../../base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/OrderedBranch.js":[function(require,module,exports){
var compose = require('../../utils/compose'), _Evented = require('../../base/_Evented'), _Destroyable = require('../../base/_Destroyable'), sortedIndex = require('../../utils/sortedIndex');
function firstPathSegment(path) {
    var slashIndex = path.indexOf('/');
    return slashIndex < 0 ? path : path.substring(0, slashIndex);
}
module.exports = compose(_Evented, _Destroyable, function (source, key, orderingSubKey, compareFn) {
    var self = this;
    this._source = source;
    this._key = key;
    this._orderedChildrenKeys = [];
    this._orderedChildrenValues = [];
    var values = this._values = {};
    var keyLength = key.length;
    var sourceValue = source.value();
    Object.keys(sourceValue).forEach(function (sourceKey) {
        if (firstPathSegment(sourceKey) === key) {
            var relativeKey = sourceKey.substr(keyLength + 1);
            values[relativeKey] = sourceValue[sourceKey];
            var childKey = firstPathSegment(relativeKey);
            var childIndex = self._orderedChildrenKeys.indexOf(childKey);
            if (childIndex < 0) {
                var childOrderingKey = key + '/' + childKey + '/' + orderingSubKey;
                var childValue = sourceValue[childOrderingKey];
                var childInsertIndex = sortedIndex(self._orderedChildrenValues, childValue, compareFn);
                self._orderedChildrenKeys.splice(childInsertIndex, 0, childKey);
                self._orderedChildrenValues.splice(childInsertIndex, 0, childValue);
            }
        }
    });
    this._own(source.onChange(function (change) {
        if (firstPathSegment(change.key) === key) {
            var relativeKey = change.key.substr(keyLength + 1);
            var childKey = firstPathSegment(relativeKey);
            var childOrderingKey = key + '/' + childKey + '/' + orderingSubKey;
            var childIndex, childInsertIndex, childValue;
            var checkMove = false;
            if (change.value === undefined) {
                delete values[relativeKey];
                if (!self._hasKey(childKey)) {
                    childIndex = self._orderedChildrenKeys.indexOf(childKey);
                    self._orderedChildrenKeys.splice(childIndex, 1);
                    self._orderedChildrenValues.splice(childIndex, 1);
                    self._emit('keyRemoved', { key: childKey });
                } else {
                    checkMove = true;
                }
            } else {
                if (!self.hasKey(childKey)) {
                    values[relativeKey] = change.value;
                    childValue = source.value()[childOrderingKey];
                    childInsertIndex = sortedIndex(self._orderedChildrenValues, childValue, compareFn);
                    self._orderedChildrenKeys.splice(childInsertIndex, 0, childKey);
                    self._orderedChildrenValues.splice(childInsertIndex, 0, childValue);
                    var beforeKey = self._orderedChildrenKeys[childInsertIndex + 1];
                    self._emit('keyAdded', {
                        key: childKey,
                        beforeKey: beforeKey
                    });
                } else {
                    values[relativeKey] = change.value;
                    checkMove = true;
                }
            }
            if (checkMove && change.key === childOrderingKey) {
                childIndex = self._orderedChildrenKeys.indexOf(childKey);
                self._orderedChildrenKeys.splice(childIndex, 1);
                self._orderedChildrenValues.splice(childIndex, 1);
                childValue = source.value()[childOrderingKey];
                childInsertIndex = sortedIndex(self._orderedChildrenValues, childValue, compareFn);
                self._orderedChildrenKeys.splice(childInsertIndex, 0, childKey);
                self._orderedChildrenValues.splice(childInsertIndex, 0, childValue);
                if (childIndex !== childInsertIndex) {
                    self._emit('keyMoved', {
                        key: childKey,
                        beforeKey: self._orderedChildrenKeys[childInsertIndex + 1]
                    });
                }
            }
            self._emit('change', {
                key: relativeKey,
                value: change.value
            });
        }
    }));
}, {
    hasKey: function (key) {
        return this.keys().indexOf(key) >= 0;
    },
    _hasKey: function (key) {
        return Object.keys(this._values).some(function (valueKey) {
            return firstPathSegment(valueKey) === key;
        });
    },
    keys: function () {
        return this._orderedChildrenKeys;
    },
    change: function (key, value) {
        return this._source.change(this._key + '/' + key, value);
    },
    onChange: function (cb) {
        return this._on('change', cb);
    },
    onKeyAdded: function (cb) {
        return this._on('keyAdded', cb);
    },
    onKeyRemoved: function (cb) {
        return this._on('keyRemoved', cb);
    },
    onKeyMoved: function (cb) {
        return this._on('keyMoved', cb);
    },
    value: function () {
        return this._values;
    },
    addKey: function (key) {
        key = key || (Math.random() * 10000000000000000).toFixed();
        this.change(key, true);
        return key;
    },
    removeKey: function (key) {
        var self = this;
        Object.keys(this._values).forEach(function (path) {
            if (firstPathSegment(path) === key) {
                self.change(path, undefined);
            }
        });
    }
});
},{"../../base/_Destroyable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Destroyable.js","../../base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js","../../utils/sortedIndex":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/sortedIndex.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/Store.js":[function(require,module,exports){
var compose = require('../../utils/compose'), _Evented = require('../../base/_Evented');
module.exports = compose(_Evented, function (data) {
    this._values = data || {};
}, {
    change: function (key, value) {
        this._undoArgs = {
            key: key,
            value: this._values[key]
        };
        if (value === undefined) {
            delete this._values[key];
        } else {
            this._values[key] = value;
        }
        this._emit('change', {
            key: key,
            value: value
        });
    },
    onChange: function (cb) {
        return this._on('change', cb);
    },
    value: function () {
        return this._values;
    },
    undo: function () {
        if (this._undoArgs) {
            this.change(this._undoArgs.key, this._undoArgs.value);
            delete this._undoArgs;
            return true;
        }
        return false;
    }
});
},{"../../base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/model/Value.js":[function(require,module,exports){
var compose = require('../../utils/compose'), ValueComputer = require('../computers/Value'), ValueAccessorMixin = require('../accessorMixins/Value');
var Value = compose(function (defaultValue) {
        this.computer = new ValueComputer(defaultValue);
        this.accessorMixin = new ValueAccessorMixin().ctr;
    });
module.exports = Value;
},{"../../utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js","../accessorMixins/Value":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/accessorMixins/Value.js","../computers/Value":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/computers/Value.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js":[function(require,module,exports){
module.exports=require("/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js")
},{"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/nativeCompare.js":[function(require,module,exports){
module.exports = function (a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
};
},{}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/sortedIndex.js":[function(require,module,exports){
var nativeCompare = require('./nativeCompare');
module.exports = function sortedIndex(array, value, compare) {
    compare = compare || nativeCompare;
    var low = 0, high = array ? array.length : low;
    while (low < high) {
        var mid = low + high >>> 1;
        compare(value, array[mid]) > 0 ? low = mid + 1 : high = mid;
    }
    return low;
};
},{"./nativeCompare":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/nativeCompare.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/App.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _ContentDelegate = require('absolute/_ContentDelegate');
var VPile = require('absolute/VPile');
var HFlex = require('absolute/HFlex');
var Reactive = require('absolute/Reactive');
var Label = require('absolute/Label');
var InputHeader = require('./InputHeader');
var Todo = require('./Todo');
var DeepBranch = require('ksf/observable/deep/Branch');
var DeepOrderedBranch = require('ksf/observable/deep/OrderedBranch');
var MappedValue = require('ksf/observable/MappedValue');
var OrderedList = require('absolute/deep/OrderedBranch');
var nativeCompare = require('ksf/utils/nativeCompare');
var _Evented = require('ksf/base/_Evented');

var LeftTodosCounter = compose(_Evented, function(todoTree) {
	var treeValue = todoTree.value();
	this._value = Object.keys(todoTree.keys()).filter(function(key) {
		return !treeValue[key + '/done'];
	}).length;

	todoTree.onChange(function(change) {
		if (change.key.split('/')[1] === 'done') {
			this._value += change.value ? -1 : 1;
			this._emit('change', this._value);
		}
	}.bind(this));
}, {
	value: function() {
		return this._value;
	},
	onChange: function(cb) {
		this._on('change', cb);
	}
});

module.exports = compose(_ContentDelegate, function(todoStore) {
	var todos = new DeepBranch(todoStore, '');
	var sortedTodos = new DeepOrderedBranch(todoStore, '', 'created', nativeCompare);

	var leftTodosCounter = new LeftTodosCounter(todos);

	this._content = new VPile().content([
		this._input = new InputHeader(todos, leftTodosCounter).onInput(function(label) {
			var key = todoStore.addKey();
			todoStore.change(key + '/label', label);
			todoStore.change(key + '/created', Date.now());
			this._input.clear();
		}.bind(this)),
		new OrderedList({
			content: new VPile(),
			value: sortedTodos,
			onKeyAdded: function(pile, key, beforeKey) {
				pile.add(key, new Todo(new DeepBranch(sortedTodos, key)), beforeKey);
			},
			onKeyMoved: function(pile, key, beforeKey) {
				pile.move(key, beforeKey);
			},
			onKeyRemoved: function(pile, key) {
				pile.remove(key);
			}
		}),
		new HFlex([
			new Reactive({
				value: new MappedValue(leftTodosCounter, function(count) {
					if (count === 1) {
						return "1 item left";
					} else {
						return count + " items left";
					}
				}),
				content: new Label()
			})
		])
	]);
});
},{"./InputHeader":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/InputHeader.js","./Todo":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/Todo.js","absolute/HFlex":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/HFlex.js","absolute/Label":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Label.js","absolute/Reactive":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Reactive.js","absolute/VPile":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/VPile.js","absolute/_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","absolute/deep/OrderedBranch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/deep/OrderedBranch.js","ksf/base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","ksf/observable/MappedValue":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/MappedValue.js","ksf/observable/deep/Branch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/Branch.js","ksf/observable/deep/OrderedBranch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/OrderedBranch.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js","ksf/utils/nativeCompare":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/nativeCompare.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/Checkbox.js":[function(require,module,exports){
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
},{"absolute/Element":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Element.js","absolute/_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/InputHeader.js":[function(require,module,exports){
/*jshint multistr: true */
var compose = require('ksf/utils/compose');
var _Evented = require('ksf/base/_Evented');
var MappedValue = require('ksf/observable/MappedValue');
var _ContentDelegate = require('absolute/_ContentDelegate');
var Label = require('absolute/Label');
var Background = require('absolute/Background');
var HFlex = require('absolute/HFlex');
var Align = require('absolute/Align');
var Mousable = require('absolute/Mousable');
var Margin = require('absolute/Margin');
var LabelInput = require('absolute/LabelInput');
var Switch = require('absolute/Switch');
var SvgIcon = require('absolute/SvgIcon');
var uiVars = require('./uiVars');
var Style = require('ksf/dom/style/Style');

var toggleAllIcon = {
	width: 11,
	height: 6,
	data: 'M 0,0 0,2.4375 5.5,6 11,2.4375 11,0 5.5,3.625 0,0 z'
};

var placeholderStyle = 'font-style: italic; color: #e6e6e6;';
// we inject CSS rules in order to use pseudo-selectors
var placeholderStyleCss = new Style(
'	#this::-webkit-input-placeholder { ' + placeholderStyle + ' } \
	#this::-moz-placeholder { ' + placeholderStyle + ' } \
	#this::input-placeholder { ' + placeholderStyle + ' }'
);

module.exports = compose(_ContentDelegate, _Evented, function(todoTree, leftTodosCounter) {
	var allChecked = new MappedValue(leftTodosCounter, function(leftCount) {
		return !leftCount;
	});

	this._content = new Background(new HFlex([
		[new Align(new Mousable(this._toggleAllIcon = new SvgIcon(toggleAllIcon)).width(20).height(15).on('click', function() {
			var checkedState = !allChecked.value();
			// (un)check all
			Object.keys(todoTree.keys()).forEach(function(key) {
				if (todoTree.value()[key + '/done'] !== checkedState) {
					todoTree.change(key + '/done', checkedState);
				}
			});
		}.bind(this)), 'middle', 'middle').width(50), 'fixed'],
		this._input = new LabelInput().placeholder("What needs to be done?").style({ border: 'none', fontFamily: uiVars.font, fontSize: '24px', padding: '0 10px' })
			.onKeyDown(function(ev) {
				if (ev.keyCode === 13 /* ENTER */) {
					this._validate();
				}
			}.bind(this)),
	])).color('white').height(50);

	placeholderStyleCss.apply(this._input._content.domNode);

	this._setAllChecked(allChecked.value());

	allChecked.onChange(function(value) {
		this._setAllChecked(value);
	}.bind(this));
}, {
	_validate: function() {
		var inputValue = this._input.value();
		if (inputValue) {
			this._emit('input', inputValue);
		}
	},
	_setAllChecked: function(allChecked) {
		this._toggleAllIcon.color(allChecked ? '#737373' : '#e6e6e6');
	},
	onInput: function(cb) {
		this._on('input', cb);
		return this;
	},
	clear: function() {
		this._input.value("");
	}
});
},{"./uiVars":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/uiVars.js","absolute/Align":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Align.js","absolute/Background":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Background.js","absolute/HFlex":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/HFlex.js","absolute/Label":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Label.js","absolute/LabelInput":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/LabelInput.js","absolute/Margin":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Margin.js","absolute/Mousable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Mousable.js","absolute/SvgIcon":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/SvgIcon.js","absolute/Switch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Switch.js","absolute/_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/base/_Evented":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/base/_Evented.js","ksf/dom/style/Style":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/dom/style/Style.js","ksf/observable/MappedValue":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/MappedValue.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/Todo.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var _ContentDelegate = require('absolute/_ContentDelegate');
var Label = require('absolute/Label');
var Background = require('absolute/Background');
var HFlex = require('absolute/HFlex');
var Align = require('absolute/Align');
var Mousable = require('absolute/Mousable');
var Margin = require('absolute/Margin');
var LabelInput = require('absolute/LabelInput');
var Switch = require('absolute/Switch');
var Checkbox = require('./Checkbox');
var uiVars = require('./uiVars');

module.exports = compose(_ContentDelegate, function(todoNode) {
	this._dataNode = todoNode;

	this._content = new Background(new HFlex([
		[new Align(new Mousable(this._checkbox = new Checkbox()).width(40).height(40).on('click', function() {
			this._dataNode.change('done', !this._checkbox.checked());
		}.bind(this)), 'middle', 'middle').width(50), 'fixed'],
		this._labelArea = new Switch(),
	])).color('white').height(50);

	this._readOnlyLabel = new Mousable(new Margin(this._label = new Label().font({ family: uiVars.font, size: '24px' }), { left: 10 })).on('dblclick', function() {
		this._edit(true);
	}.bind(this));
	this._input = new LabelInput().style({ border: 'none', fontFamily: uiVars.font, fontSize: '24px', padding: '0 10px' })
		.onFocus(function(focused) {
			if (!focused) {
				this._commitLabel();
			}
		}.bind(this))
		.onKeyDown(function(ev) {
			if (ev.keyCode === 13 /* ENTER */) {
				this._commitLabel();
			} else if (ev.keyCode === 27 /* ESC */) {
				this._edit(false);
			}
		}.bind(this));

	this._label.value(todoNode.value().label);
	this._checked(todoNode.value().done);

	todoNode.onChange(function(change) {
		if (change.key === 'label') {
			this._label.value(change.value);
		}
		if (change.key === 'done') {
			this._checked(change.value);
		}
	}.bind(this));

	this._edit(false);
}, {
	_commitLabel: function() {
		this._dataNode.change('label', this._input.value());
		this._edit(false);
	},
	_edit: function(edit) {
		if (edit) {
			this._labelArea.content(this._input);
			this._input.value(this._dataNode.value().label);
			this._input.focus(true);
		} else {
			this._labelArea.content(this._readOnlyLabel);
		}
	},
	_checked: function(checked) {
		this._checkbox.checked(checked);
		this._label.color(checked ? '#d9d9d9' : 'black');
		this._label.textDecoration(checked ? 'line-through' : 'none');
		return this;
	}
});
},{"./Checkbox":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/Checkbox.js","./uiVars":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/uiVars.js","absolute/Align":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Align.js","absolute/Background":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Background.js","absolute/HFlex":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/HFlex.js","absolute/Label":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Label.js","absolute/LabelInput":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/LabelInput.js","absolute/Margin":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Margin.js","absolute/Mousable":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Mousable.js","absolute/Switch":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/Switch.js","absolute/_ContentDelegate":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/absolute/_ContentDelegate.js","ksf/utils/compose":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/utils/compose.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/tests/App.js":[function(require,module,exports){
var DeepStore = require('ksf/observable/deep/Store');
var App = require('../App');

var dataStore = new DeepStore({
	'/a/created': 12346,
	'/a/label': "Test 2",
	'/a/done': true,
	'/b/created': 12345,
	'/b/label': "Test 1",
	'/b/done': false
});

var app = new App(dataStore);

app.width(400).left(10).top(10).containerVisible(true).parentNode(document.body);
document.body.style.background= 'lightgray';
},{"../App":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/App.js","ksf/observable/deep/Store":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/observable/deep/Store.js"}],"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/uiVars.js":[function(require,module,exports){
/* global __dirname */
var loadFont = require('ksf/dom/style/loadFont');


var mainFontName = 'Lato';
loadFont("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", mainFontName);

module.exports = {
	font: mainFontName,
};
},{"ksf/dom/style/loadFont":"/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/node_modules/ksf/dom/style/loadFont.js"}]},{},["/media/Donnees/KaeS/KSF/todomvc-tutorial/absolute/src/tests/App.js"])