/**
* The REFINERYCMS form object for client side validating forms in REFINERYCMS.
* Based on REFINERYCMS.formForms https://github.com/REFINERYCMS.form/REFINERYCMS.form/raw/master/client-side/forms/REFINERYCMS.formForms.js
*
*
* @version    $Id$
* @package    refinerycms-js
* @copyright  Copyright (C) 2011
* @author     keraM marek@keram.name http//keram.name
* @class      form
* @license    MIT
*/

REFINERYCMS.namespace('REFINERYCMS.form');

/**
 * Simple form validation.
 *
 * Copyright (c) 2004, 2011 David Grudl (http://davidgrudl.com)
 */

REFINERYCMS.form.addEvent = function (element, on, callback) {
	var original = element['on' + on];
	element['on' + on] = function () {
		if (typeof original === 'function' && original.apply(element, arguments) === false) {
			return false;
		}
		return callback.apply(element, arguments);
	};
};


REFINERYCMS.form.getValue = function (elem) {
	var i, len;
	if (!elem) {
		return null;

	} else if (!elem.nodeName) { // radio
		for (i = 0, len = elem.length; i < len; i++) {
			if (elem[i].checked) {
				return elem[i].value;
			}
		}
		return null;

	} else if (elem.nodeName.toLowerCase() === 'select') {
		var index = elem.selectedIndex, options = elem.options;

		if (index < 0) {
			return null;

		} else if (elem.type === 'select-one') {
			return options[index].value;
		}

		for (i = 0, values = [], len = options.length; i < len; i++) {
			if (options[i].selected) {
				values.push(options[i].value);
			}
		}
		return values;

	} else if (elem.type === 'checkbox') {
		return elem.checked;

	} else if (elem.type === 'radio') {
		return REFINERYCMS.form.getValue(elem.form.elements[elem.name]);

	} else {
		return elem.value.replace(/^\s+|\s+$/g, '');
	}
};


REFINERYCMS.form.validateControl = function (elem, rules, onlyCheck) {
	rules = rules || eval('[' + (elem.getAttribute('data-refinerycms-rules') || '') + ']');
	
	for (var id = 0, len = rules.length; id < len; id++) {
		var rule = rules[id], op = rule.op.match(/(~)?([^?]+)/);
			rule.neg = op[1];
			rule.op = op[2];
			rule.condition = !!rule.rules,
			el = rule.control ? elem.form.elements[rule.control] : elem,
			success = REFINERYCMS.form.validateRule(el, rule.op, rule.arg);
			
		if (success === null) { continue; }
		if (rule.neg) { success = !success; }

		if (rule.condition && success) {
			if (!REFINERYCMS.form.validateControl(elem, rule.rules, onlyCheck)) {
				return false;
			}
		} else if (!rule.condition && !success) {
			if (el.disabled) { continue; }
			if (!onlyCheck) {
				REFINERYCMS.form.addError(el, rule.msg.replace('%value', REFINERYCMS.form.getValue(el)));
			}
			return false;
		}
	}
	return true;
};

REFINERYCMS.form.validateForm = function (sender) {
	var form = sender.form || sender;
	if (form['REFINERYCMS.form-submittedBy'] && form['REFINERYCMS.form-submittedBy'].getAttribute('formnovalidate') !== null) {
		return true;
	}
	for (var i = 0; i < form.elements.length; i++) {
		var elem = form.elements[i];
		if (!(elem.nodeName.toLowerCase() in {input:1, select:1, textarea:1}) || (elem.type in {hidden:1, submit:1, image:1, reset: 1}) || elem.disabled || elem.readonly) {
			continue;
		}
		if (!REFINERYCMS.form.validateControl(elem)) {
			return false;
		}
	}
	return true;
};


REFINERYCMS.form.addError = function (elem, message) {
	if (elem.focus) {
		elem.focus();
	}
	if (message) {
		alert(message);
	}
};


REFINERYCMS.form.validateRule = function (elem, op, arg) {
	var val = REFINERYCMS.form.getValue(elem);

	if (elem.getAttribute) {
		if (val === elem.getAttribute('data-refinerycms-empty-value')) { val = ''; }
	}

	if (op.charAt(0) === ':') {
		op = op.substr(1);
	}
	op = op.replace('::', '_');
	return REFINERYCMS.form.validators[op] ? REFINERYCMS.form.validators[op](elem, arg, val) : null;
};

REFINERYCMS.form.validators = {
	filled: function(elem, arg, val) {
		return val !== '' && val !== false && val !== null;
	},

	valid: function(elem, arg, val) {
		return REFINERYCMS.form.validateControl(elem, null, true);
	},

	equal: function(elem, arg, val) {
		if (arg === undefined) {
			return null;
		}
		arg = REFINERYCMS.form.isArray(arg) ? arg : [arg];
		for (var i = 0, len = arg.length; i < len; i++) {
			if (val == (arg[i].control ? REFINERYCMS.form.getValue(elem.form.elements[arg[i].control]) : arg[i])) {
				return true;
			}
		}
		return false;
	},

	minLength: function(elem, arg, val) {
		return val.length >= arg;
	},

	maxLength: function(elem, arg, val) {
		return val.length <= arg;
	},

	length: function(elem, arg, val) {
		arg = REFINERYCMS.form.isArray(arg) ? arg : [arg, arg];
		return (arg[0] === null || val.length >= arg[0]) && (arg[1] === null || val.length <= arg[1]);
	},

	email: function(elem, arg, val) {
		return (/^[^@\s]+@[^@\s]+\.[a-z]{2,10}$/i).test(val);
	},

	url: function(elem, arg, val) {
		return (/^.+\.[a-z]{2,6}(\/.*)?$/i).test(val);
	},

	regexp: function(elem, arg, val) {
		var parts = typeof arg === 'string' ? arg.match(/^\/(.*)\/([imu]*)$/) : false;
		if (parts) { try {
			return (new RegExp(parts[1], parts[2].replace('u', ''))).test(val);
		} catch (e) {} }
	},

	pattern: function(elem, arg, val) {
		try {
			return typeof arg === 'string' ? (new RegExp('^(' + arg + ')$')).test(val) : null;
		} catch (e) {}
	},

	integer: function(elem, arg, val) {
		return (/^-?[0-9]+$/).test(val);
	},

	'float': function(elem, arg, val) {
		return (/^-?[0-9]*[.,]?[0-9]+$/).test(val);
	},

	range: function(elem, arg, val) {
		return REFINERYCMS.form.isArray(arg) ? ((arg[0] === null || parseFloat(val) >= arg[0]) && (arg[1] === null || parseFloat(val) <= arg[1])) : null;
	},

	submitted: function(elem, arg, val) {
		return elem.form['REFINERYCMS.form-submittedBy'] === elem;
	}
};


REFINERYCMS.form.toggleForm = function (form) {
	for (var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].nodeName.toLowerCase() in {input:1, select:1, textarea:1, button:1}) {
			REFINERYCMS.form.toggleControl(form.elements[i]);
		}
	}
};


REFINERYCMS.form.toggleControl = function (elem, rules, firsttime) {
	rules = rules || eval('[' + (elem.getAttribute('data-refinerycms-rules') || '') + ']');
	var has = false, __hasProp = Object.prototype.hasOwnProperty, handler = function () { REFINERYCMS.form.toggleForm(elem.form); };

	for (var id = 0, len = rules.length; id < len; id++) {
		var rule = rules[id], op = rule.op.match(/(~)?([^?]+)/);
		rule.neg = op[1];
		rule.op = op[2];
		rule.condition = !!rule.rules;
		if (!rule.condition) { continue; }

		var el = rule.control ? elem.form.elements[rule.control] : elem;
		var success = REFINERYCMS.form.validateRule(el, rule.op, rule.arg);
		if (success === null) { continue; }
		if (rule.neg) { success = !success; }

		if (REFINERYCMS.form.toggleControl(elem, rule.rules, firsttime) || rule.toggle) {
			has = true;
			if (firsttime) {
				if (!el.nodeName) { // radio
					for (var i = 0; i < el.length; i++) {
						REFINERYCMS.form.addEvent(el[i], 'click', handler);
					}
				} else if (el.nodeName.toLowerCase() === 'select') {
					REFINERYCMS.form.addEvent(el, 'change', handler);
				} else {
					REFINERYCMS.form.addEvent(el, 'click', handler);
				}
			}
			for (var id2 in rule.toggle || []) {
				if (__hasProp.call(rule.toggle, id2)) { REFINERYCMS.form.toggle(id2, success ? rule.toggle[id2] : !rule.toggle[id2]); }
			}
		}
	}
	return has;
};


REFINERYCMS.form.toggle = function (id, visible) {
	var elem = document.getElementById(id);
	if (elem) {
		elem.style.display = visible ? '' : 'none';
	}
};


REFINERYCMS.form.initForm = function (form) {
	form.noValidate = true;

	REFINERYCMS.form.addEvent(form, 'submit', function() {
		return REFINERYCMS.form.validateForm(form);
	});

	REFINERYCMS.form.addEvent(form, 'click', function(e) {
		e = e || event;
		var target = e.target || e.srcElement;
		form['REFINERYCMS.form-submittedBy'] = (target.type in {submit:1, image:1}) ? target : null;
	});

	for (var i = 0; i < form.elements.length; i++) {
		REFINERYCMS.form.toggleControl(form.elements[i], null, true);
	}

	if (/MSIE/.exec(navigator.userAgent)) {
		var labels = {},
			wheelHandler = function () { return false; },
			clickHandler = function () { document.getElementById(this.htmlFor).focus(); return false; };

		for (i = 0, elms = form.getElementsByTagName('label'); i < elms.length; i++) {
			labels[elms[i].htmlFor] = elms[i];
		}

		for (i = 0, elms = form.getElementsByTagName('select'); i < elms.length; i++) {
			REFINERYCMS.form.addEvent(elms[i], 'mousewheel', wheelHandler); // prevents accidental change in IE
			if (labels[elms[i].htmlId]) {
				REFINERYCMS.form.addEvent(labels[elms[i].htmlId], 'click', clickHandler); // prevents deselect in IE 5 - 6
			}
		}
	}
};


REFINERYCMS.form.isArray = function (arg) {
	return Object.prototype.toString.call(arg) === '[object Array]';
};


REFINERYCMS.form.addEvent(window, 'load', function () {
	for (var i = 0; i < document.forms.length; i++) {
		REFINERYCMS.form.initForm(document.forms[i]);
	}
});
