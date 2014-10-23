/*!
ARIA Combobox Module R1.0
Copyright 2010-2014 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(pL){

$A.Combobox = function(sel, combobox, child){

if (!sel || !combobox) return null;
var isInput = combobox.nodeName.toLowerCase() == 'input' ? true : false;
if (!isInput && !child) return null;

if ($A.getAttr(combobox, 'role') != 'combobox'){
alert('The combobox element is missing the role="combobox" attribute, which is required.');
return null;
}

var baseId = 'cb' + $A.genId(),
that = this,
start = false,
accClose = $A.getAttr(combobox, 'data-closetext') || 'Close Popup',
promptText = $A.createEl('div', {
id: baseId + 'pt'
}, {
display: 'none'
});
document.body.appendChild(promptText);
$A.setAttr(combobox, 'aria-describedby', promptText.id);

if (!combobox.id)
combobox.id = baseId + 'cb';

$A([
{
id: baseId + 's',
role: 'Popup',
returnFocus: false,
showHiddenBounds: true,
showHiddenClose: true,
accClose: accClose,
displayHiddenClose: false,
autoPosition: 3,
offsetLeft: 10,
offsetTop: 0,
className: 'toplevel-div',
middleClass: 'middle-div',
listboxClass: 'listbox',
optionClass: 'option',
activeClass: 'active',
toggleClass: 'pressed',
targetObj: combobox,
cb: {
sel: sel,
child: child,
baseId: baseId,
baseInc: 1,
options: {},
optionNodes: [],
size: 0,
readonly: false,
required: false,
parentTag: 'ul',
childTag: 'li',
names: [],
values: [],
matches: [],
value: '',
showAll: false,
substringMatch: false,
wordMatch: false,
autoComplete: false,
currentOption: null,
activeDescendant: false,
sIndex: -1,
clicked: false,
isInput: isInput,
setDefault: true,
bound: false,
fn: {
update: function(){
var dc = this.dc;
that.close();
dc.cb.activeDescendant = false;
dc.cb.options = {};
dc.cb.currentOption = null;
dc.cb.names = [];
dc.cb.values = [];
dc.cb.size = dc.cb.sel.size || 5;
dc.cb.readonly = dc.cb.isInput ?
($A.getAttr(dc.targetObj, 'readonly') ? true : false) : true;
dc.cb.required = dc.cb.isInput ?
($A.getAttr(dc.targetObj, 'required') ? true : false) :
($A.getAttr(dc.targetObj, 'aria-required') == 'true' ? true : false);
dc.cb.optionNodes = $A.query('option', dc.cb.sel);
if (dc.cb.readonly){
dc.cb.substringMatch = dc.cb.wordMatch = false;
}
promptText.innerHTML = $A.getAttr(dc.targetObj, 'data-prompttext') || (dc.cb.readonly ?
'Press the down arrow to open the dropdown' : 'First type then press the down arrow to open the dropdown');
for (var i = 0; i < dc.cb.optionNodes.length; i++){
dc.cb.baseInc++;
var o = $A.createEl(dc.cb.childTag, {
role: 'option',
tabindex: '-1',
id: dc.cb.baseId + dc.cb.baseInc
}, null, dc.optionClass);
dc.cb.options[dc.cb.optionNodes[i].value] = {
so: dc.cb.optionNodes[i],
no: trim($A.getText(dc.cb.optionNodes[i])).replace(/<|>/g, ''),
v: dc.cb.optionNodes[i].value,
i: i
};
o.innerHTML = '<a><span>' + dc.cb.options[dc.cb.optionNodes[i].value].no + '</span></a>';
dc.cb.options[dc.cb.optionNodes[i].value].o = o;
dc.cb.names.push(dc.cb.options[dc.cb.optionNodes[i].value].no);
dc.cb.values.push(dc.cb.optionNodes[i].value);
}
dc.cb.sel.selectedIndex = dc.cb.sel.selectedIndex >= 0 ?
dc.cb.sel.selectedIndex : 0;
dc.cb.fn.setValue(dc.cb.options[dc.cb.optionNodes[dc.cb.sel.selectedIndex].value], true);
if (dc.cb.required && dc.cb.isInput)
$A.setAttr(dc.targetObj, {
'aria-required': 'true'
});
},
render: function(pass, scroll){
var dc = this.dc;
if (dc.cb.readonly){
var pShowAll = dc.cb.showAll;
dc.cb.showAll = true;
}
if (!dc.cb.readonly && !dc.cb.showAll && !dc.cb.value){
dc.cb.showAll = pShowAll;
return true;
}
if (!scroll){
dc.cb.sIndex = dc.cb.sel.selectedIndex;
dc.cb.activeDescendant = false;
dc.cb.matches = [];
that.close();
}
if (scroll){
var v = dc.cb.value.toLowerCase(),
fd = false,
oI = dc.cb.sIndex;
dc.cb.sIndex++;
for (var i = dc.cb.sIndex; i < dc.cb.names.length; i++){
if ($A.inArray(v, dc.cb.names[i].toLowerCase()) === 0){
fd = true;
dc.cb.sIndex = i;
break;
}
}
if (!fd){
dc.cb.sIndex = 0;
for (var i = dc.cb.sIndex; i < oI; i++){
if ($A.inArray(v, dc.cb.names[i].toLowerCase()) === 0){
fd = true;
dc.cb.sIndex = i;
break;
}
}
}
if (!fd)
dc.cb.sIndex = oI;
else{
dc.cb.currentOption = dc.cb.options[dc.cb.values[dc.cb.sIndex]];
dc.cb.value = dc.cb.currentOption.no;
$A.setAttr(dc.targetObj, 'aria-activedescendant', dc.cb.currentOption.o.id);
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.currentOption.o, dc.activeClass);
dc.cb.currentOption.o.scrollIntoView();
}
} else {
if (pass || dc.cb.showAll || dc.cb.readonly){
dc.cb.matches = dc.cb.values;
} else {
for (var i = 0; i < dc.cb.names.length; i++){
if (dc.cb.wordMatch){
var vA = dc.cb.value.toLowerCase().split(' '),
nA = dc.cb.names[i].toLowerCase().split(' ');
for (var z = 0; z < vA.length; z++){
if (vA[z] && $A.inArray(vA[z], nA) !== -1){
dc.cb.matches.push(dc.cb.values[i]);
break;
}
}
}
else if ((!dc.cb.wordMatch && !dc.cb.substringMatch && $A.inArray(dc.cb.value.toLowerCase(), dc.cb.names[i].toLowerCase()) === 0) || (!dc.cb.wordMatch && dc.cb.substringMatch && $A.inArray(dc.cb.value.toLowerCase(), dc.cb.names[i].toLowerCase()) !== -1))
dc.cb.matches.push(dc.cb.values[i]);
}
}
if (!dc.cb.matches.length) return true;
if (dc.cb.readonly)
dc.cb.sIndex = dc.cb.sel.selectedIndex;
else
dc.cb.sIndex = 0;
if (dc.cb.readonly){
dc.cb.showAll = pShowAll;
dc.cb.activeDescendant = true;
dc.cb.currentObject = dc.cb.options[dc.cb.matches[dc.cb.sIndex]];
}
}
return false;
},
setAltTrigger: function(o){
if (o.nodeType !== 1) return;
var dc = this.dc;
$A.setAttr(o, {
'aria-hidden': 'true',
tabindex: '-1'
});
$A.bind(o, 'click', function(ev){
dc.targetObj.focus();
if (!dc.loaded){
that.open(true);
} else {
that.close();
}
ev.preventDefault();
});
dc.cb.altTrigger = o;
},
setValue: function(option, pass, manual){
var dc = this.dc;
dc.cb.value = option.no;
dc.cb.currentOption = option;
if (!pass)
option.so.selected = true;
if (dc.cb.isInput){
if (manual || dc.cb.setDefault)
dc.targetObj.value = dc.cb.value;
} else {
if (manual || dc.cb.setDefault)
dc.cb.child.innerHTML = dc.cb.value;
}
if (!pass && dc.cb.fn.onSelect && typeof dc.cb.fn.onSelect === 'function')
dc.cb.fn.onSelect.apply(dc.targetObj, [dc.cb.currentOption]);
},
checkValue: function(v){
var dc = this.dc;
for (var i = 0; i < dc.cb.names.length; i++){
if (trim(v) && v.toLowerCase() == dc.cb.names[i].toLowerCase()){
return i;
}
}
return -1;
},
unsetValue: function(pass){
var dc = this.dc;
if (!pass && dc.cb.sel.selectedIndex >= 0)
dc.cb.optionNodes[dc.cb.sel.selectedIndex].selected = false;
dc.cb.currentOption = null;
if (dc.cb.isInput){
dc.cb.value = dc.targetObj.value;
} else {
dc.cb.value = $A.getText(dc.cb.child);
}
},
bind: function(){
var dc = this.dc;
if (dc.cb.bound) return;
$A.bind(dc.targetObj, {
keypress: function(ev){
var e = this,
k = ev.which || ev.keyCode;
if (dc.cb.readonly && k !== 0){
dc.cb.value = String.fromCharCode(k);
dc.cb.fn.render(false, true);
}
},
keyup: function(ev){
var e = this,
k = ev.which || ev.keyCode;
if (((ev.altKey && k == 40) || k == 40) && !dc.cb.activeDescendant && !dc.loaded && dc.cb.readonly){
dc.cb.activeDescendant = true;
dc.cb.sIndex = ((dc.cb.readonly || dc.cb.showAll) && dc.cb.sel.selectedIndex >= 0) ?
dc.cb.sel.selectedIndex : 0;
that.open();
ev.preventDefault();
} else if (((ev.altKey && k == 40) || k == 40) && !dc.cb.activeDescendant && dc.loaded && !dc.cb.readonly){
dc.cb.activeDescendant = true;
dc.cb.sIndex = ((dc.cb.readonly || dc.cb.showAll) && dc.cb.sel.selectedIndex >= 0) ?
dc.cb.sel.selectedIndex : 0;
$A.setAttr(e, {
'aria-expanded': 'true',
'aria-activedescendant': dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.id
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o, dc.activeClass);
dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.scrollIntoView();
ev.preventDefault();
} else if (k == 40 && dc.cb.activeDescendant && dc.loaded){
if (dc.cb.sIndex < dc.cb.matches.length - 1){
dc.cb.sIndex++;
$A.setAttr(e, 'aria-activedescendant', dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.id);
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o, dc.activeClass);
dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.scrollIntoView();
}
ev.preventDefault();
} else if (((ev.altKey && k == 38) || k == 13) && dc.cb.activeDescendant && dc.loaded){
dc.cb.fn.setValue(dc.cb.options[dc.cb.matches[dc.cb.sIndex]], false, true);
that.close();
dc.cb.activeDescendant = false;
setTimeout(function(){
$A.announce(dc.cb.value, false, true);
}, 100);
ev.preventDefault();
} else if (k == 38 && dc.cb.activeDescendant && dc.loaded){
if (dc.cb.sIndex > 0){
dc.cb.sIndex--;
$A.setAttr(e, 'aria-activedescendant', dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.id);
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o, dc.activeClass);
dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.scrollIntoView();
}
ev.preventDefault();
} else if (k == 27 || k == 37 || k == 39){
dc.cb.activeDescendant = false;
$A.setAttr(e, {
'aria-expanded': 'false',
'aria-activedescendant': '',
'aria-controls': ''
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
if (k == 27)
that.close();
} else if (!dc.cb.readonly && k != 9 && !(k == 9 && ev.shiftKey)){
if (dc.cb.isInput)
dc.cb.value = e.value;
var x = dc.cb.fn.checkValue(dc.cb.value);
if (dc.cb.value && x !== -1){
var option = dc.cb.options[dc.cb.values[x]];
dc.cb.currentOption = option;
option.so.selected = true;
that.close();
dc.cb.activeDescendant = false;
} else{
if (dc.cb.value){
dc.cb.fn.render();
that.open(true);
}
else that.close();
}
}
},
focus: function(ev){
if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0){
if (dc.cb.readonly)
that.open();
}
},
blur: function(ev){
if (!('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)){
setTimeout(function(){
if (dc.loaded){
if (dc.cb.autoComplete && !dc.cb.clicked)
dc.cb.fn.setValue(dc.cb.options[dc.cb.matches[dc.cb.sIndex]], false, true);
}
that.close();
dc.cb.activeDescendant = false;
dc.cb.clicked = false;
}, 1);
}
}
});
dc.cb.bound = true;
},
set: function(){
var dc = this.dc;
$A.setAttr(dc.targetObj, {
'aria-expanded': 'false',
'aria-autocomplete': 'list',
'aria-activedescendant': '',
'aria-controls': ''
});
if (!dc.cb.isInput){
dc.cb.baseInc++;
if (!dc.cb.child.id)
$A.setAttr(dc.cb.child, {
tabindex: '-1',
'id': dc.cb.baseId + dc.cb.baseInc
});
addLabelledby(dc.targetObj, dc.cb.child.id);
}
},
onSelect: null,
onOpen: null,
onClose: null,
onTriggerChange: null,
setSize: function(){
var dc = this.dc,
s = dc.cb.size <= dc.cb.matches.length ?
dc.cb.size : dc.cb.matches.length,
o = dc.cb.options[dc.cb.matches[0]].o,
h = xHeight(o);
$A.css(dc.source, 'height', s * h);
}
}
},
click: function(ev, dc){
dc.cb.activeDescendant = false;
$A.setAttr(e, {
'aria-expanded': 'false',
'aria-activedescendant': '',
'aria-controls': ''
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
that.close();
ev.preventDefault();
},
runBefore: function(dc){
if (!dc.cb.matches.length)
return dc.cancel = true;
dc.cb.baseInc++;
dc.source = $A.createEl(dc.cb.parentTag, {
'aria-label': (function(){
var name = '',
aLabelledby = $A.getAttr(dc.targetObj, 'aria-labelledby'),
aLabel = $A.getAttr(dc.targetObj, 'aria-label'),
label = dc.targetObj.id,
title = $A.getAttr(dc.targetObj, 'title');
if (aLabelledby){
var a = aLabelledby.split(' ');
for (var i = 0; i < a.length; i++){
name += $A.getText($A.getEl(a[i]));
}
} else if (aLabel){
name = aLabel;
} else if (label){
var l = $A.getText($A.query('label[for="' + label + '"]')[0]);
if (l){
name = l;
return name;
}
}
if (!name && title){
name = title;
}
return name;
})(),
role: 'listbox',
id: dc.cb.baseId + dc.cb.baseInc
}, null, dc.listboxClass);
for (var i = 0; i < dc.cb.matches.length; i++){
dc.source.appendChild(dc.cb.options[dc.cb.matches[i]].o);
}
$A.setAttr(dc.targetObj, {
'aria-controls': dc.source.id
});
},
runDuring: function(dc){
$A.addClass(dc.containerDiv, dc.middleClass);
dc.fn.sraStart.innerHTML = dc.fn.sraEnd.innerHTML = '';
$A.setAttr(dc.fn.sraStart, 'aria-hidden', 'true');
$A.setAttr(dc.fn.sraEnd, 'aria-hidden', 'true');
},
runAfter: function(dc){
$A.query(dc.cb.matches, function(i, v){
$A.bind(dc.cb.options[v].o, 'click', function(ev){
dc.cb.fn.setValue(dc.cb.options[v], false, true);
dc.cb.clicked = true;
if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0){
that.close();
dc.cb.activeDescendant = false;
dc.cb.clicked = false;
}
ev.preventDefault();
});
});
if (dc.cb.readonly){
$A.setAttr(dc.targetObj, {
'aria-expanded': 'true',
'aria-activedescendant': dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.id
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o, dc.activeClass);
}

dc.cb.fn.setSize();

dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.scrollIntoView();
if (!dc.cb.readonly){
dc.cb.options[dc.cb.matches[dc.cb.sIndex]].no.announce(null, false, true);
}

if (dc.cb.altTrigger){
$A.addClass(dc.cb.altTrigger, dc.toggleClass);
if (dc.cb.fn.onTriggerChange && typeof dc.cb.fn.onTriggerChange === 'function')
dc.cb.fn.onTriggerChange.apply(dc.cb.altTrigger, [dc.cb.altTrigger, dc.loaded]);
}

if (dc.cb.fn.onOpen && typeof dc.cb.fn.onOpen === 'function')
dc.cb.fn.onOpen.apply(dc.targetObj, [dc.accDCObj]);
},
runAfterClose: function(dc){
if (dc.cb.altTrigger){
$A.remClass(dc.cb.altTrigger, dc.toggleClass);
if (dc.cb.fn.onTriggerChange && typeof dc.cb.fn.onTriggerChange === 'function')
dc.cb.fn.onTriggerChange.apply(dc.cb.altTrigger, [dc.cb.altTrigger, dc.loaded]);
}

if (dc.cb.fn.onClose && typeof dc.cb.fn.onClose === 'function')
dc.cb.fn.onClose.apply(dc.targetObj, [dc.accDCObj]);
}
}
], null, false, true);

var dc = $A.reg[baseId + 's'];
dc.cb.dc = dc.cb.fn.dc = dc;

that.setShowAll = function(v){
dc.cb.showAll = v ? true : false;
};

that.setSubstringMatch = function(v){
dc.cb.substringMatch = v ? true : false;
};

that.setWordMatch = function(v){
dc.cb.wordMatch = v ? true : false;
};

that.setTags = function(o){
if (o.parentTag)
dc.cb.parentTag = o.parentTag;
if (o.childTag)
dc.cb.childTag = o.childTag;
};

that.setOffset = function(o){
if (!isNaN(o.left))
dc.offsetLeft = o.offsetLeft;
if (!isNaN(o.top))
dc.offsetTop = o.offsetTop;
};

that.setAutoComplete = function(v){
dc.cb.autoComplete = v ? true : false;
};

that.close = function(){
$A.setAttr(dc.targetObj, {
'aria-expanded': 'false',
'aria-activedescendant': '',
'aria-controls': ''
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
dc.close();
};

that.open = function(passive){
if (dc.loaded) return;
if (start){
dc.cb.fn.render();
dc.open();
if (dc.loaded){
if (!passive){
$A.setAttr(dc.targetObj, {
'aria-expanded': 'true',
'aria-activedescendant': dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.id
});
$A.remClass($A.query('.' + dc.activeClass, dc.source), dc.activeClass);
$A.addClass(dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o, dc.activeClass);
}
dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o.scrollIntoView();
}
}
};

that.setAltTrigger = function(o){
dc.cb.fn.setAltTrigger(o);
};

that.setAutoPosition = function(n){
if (!isNaN(n) && n < 10)
dc.autoPosition = n;
};

that.setPosAnchor = function(o){
dc.posAnchor = o;
};

that.setClassNames = function(o){
if (o.toplevelClass)
dc.className = o.toplevelClass;
if (o.middleClass)
dc.middleClass = o.middleClass;
if (o.listboxClass)
dc.listboxClass = o.listboxClass;
if (o.optionClass)
dc.optionClass = o.optionClass;
if (o.activeClass)
dc.activeClass = o.activeClass;
if (o.toggleClass)
dc.toggleClass = o.toggleClass;
};

that.setDefault = function(v){
dc.cb.setDefault = v ? true : false;
};

that.update = function(){
dc.cb.fn.update();
};

that.start = function(){
start = true;
dc.cb.fn.bind();
dc.cb.fn.update();
if (document.activeElement == combobox && (dc.cb.readonly || dc.cb.value)){
that.open();
}
};

that.stop = function(){
start = false;
that.close();
};

that.onSelect = function(fn){
if (fn && typeof fn === 'function')
dc.cb.fn.onSelect = fn;
};

that.onOpen = function(fn){
if (fn && typeof fn === 'function')
dc.cb.fn.onOpen = fn;
};

that.onClose = function(fn){
if (fn && typeof fn === 'function')
dc.cb.fn.onClose = fn;
};

that.onTriggerChange = function(fn){
if (fn && typeof fn === 'function')
dc.cb.fn.onTriggerChange = fn;
};

$A.bind(window, 'resize', function(){
dc.setPosition();
dc.cb.fn.setSize();
});

if (!dc.cb.isInput && !$A.getAttr(dc.targetObj, 'tabindex'))
$A.setAttr(dc.targetObj, 'tabindex', '0');
dc.cb.fn.set();
};

var trim = function(str){
return str.replace(/^\s+|\s+$/g, '');
},

addLabelledby = function(obj, cn){
if (!obj) return null;
var o = $A.isArray(obj) ? obj : [obj],
names = cn.split(' ');
for (var i = 0; i < o.length; i++){
for (var n = 0; n < names.length; n++){
if (!hasLabelledby(o[i], names[n])){
var l = $A.getAttr(o[i], 'aria-labelledby');
if (!l) l = '';
$A.setAttr(o[i], 'aria-labelledby', trim(l + ' ' + names[n]));
}
}
}
return obj;
},

hasLabelledby = function(obj, cn){
var l = $A.getAttr(obj, 'aria-labelledby');
if (!obj || !l) return false;
var names = cn.split(' '),
i = 0;
for (var n = 0; n < names.length; n++){
if (l.indexOf(names[n]) !== -1) i += 1;
}
if (i === names.length) return true;
return false;
},

xHeight = function(e,h){
var css, pt=0, pb=0, bt=0, bb=0;
if (!e) return 0;
if (xNum(h)) {
if (h<0) h = 0;
else h=Math.round(h);
} else h=-1;
css=xDef(e.style);
if(css && xDef(e.offsetHeight) && xStr(e.style.height)) {
if(h>=0) {
if (document.compatMode=='CSS1Compat') {
pt=xGetComputedStyle(e,'padding-top',1);
if (pt !== null) {
pb=xGetComputedStyle(e,'padding-bottom',1);
bt=xGetComputedStyle(e,'border-top-width',1);
bb=xGetComputedStyle(e,'border-bottom-width',1);
}
else if(xDef(e.offsetHeight,e.style.height)){
e.style.height=h+'px';
pt=e.offsetHeight-h;
}
}
h-=(pt+pb+bt+bb);
if(isNaN(h)||h<0) return;
else e.style.height=h+'px';
}
h=e.offsetHeight;
} else if(css && xDef(e.style.pixelHeight)) {
if(h>=0) e.style.pixelHeight=h;
h=e.style.pixelHeight;
}
return h;
},

xNum = function(){
for(var i=0; i<arguments.length; i++){
if (isNaN(arguments[i]) || typeof arguments[i] !== 'number') return false;
}
return true;
},

xDef = function(){
for(var i=0; i<arguments.length; i++){
if (typeof arguments[i] === 'undefined') return false;
}
return true;
},

xStr = function(){
for(var i=0; i<arguments.length; i++){
if (typeof arguments[i] !== 'string') return false;
}
  return true;
},

xGetComputedStyle = function(e, p, i){
if (!e) return null;
var s,
v = 'undefined',
dv = document.defaultView;
if(dv && dv.getComputedStyle){
if (e == document) e = document.body;
s = dv.getComputedStyle(e,'');
if (s)
v = s.getPropertyValue(p);
} else if (e.currentStyle)
v = e.currentStyle[xCamelize(p)];
  else return null;
  return i ? (parseInt(v) || 0) : v;
},

xCamelize = function(cssPropStr){
  var i, c, a, s;
  a = cssPropStr.split('-');
  s = a[0];
  for (i=1; i<a.length; i++) {
    c = a[i].charAt(0);
    s += a[i].replace(c, c.toUpperCase());
  }
  return s;
};

})($A.internal);