function El (tag, props, children) {
  let $el = tag === El.fragment ? document.createDocumentFragment() : document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((key) => {
      const val = props[key];
      if (typeof $el[key] === 'object' && $el[key] !== null)
        return Object.assign($el.style, val);
      $el[key] = val;
    });
  }
  if (children)
    children.forEach($child => $child && $el.append($child));
  return $el;
}
El.fragment = Symbol();

Object.prototype.on = HTMLElement.prototype.addEventListener
ls = new Proxy({}, {
    get:(t,p)=>JSON.parse(localStorage.getItem(p)),
    set:(t,p,v)=>{localStorage.setItem(p, JSON.stringify(v));return true},
});

function debugFn (fn) {
  return function (...args) {
    l(fn.name, args);
    return fn(...args);
  }
}

FLT = Symbol('FLT');
function arr (filler = (i => i)) {
  const arr = [];
  for (let v, i = 0; (v = filler(i)) != null; i++)
    arr.push(v);
  return arr;
}
// console.log(arr(i => (i < 10 ? i : null)));

function* gen (filler, limit = 1000) {
  let v, i = 0;
  while (i < limit) {
    v = filler(v, i);
    if (v == null)
      return;
    yield v;
    i++;
  }
}

function parentTree (sel) {
  return gen(($el = $(sel)) => $el?.parentNode);
}

// console.log([...])

// let _g = gen((v = '', i) => v.padStart(i, 0), 10);
// const nested = { parent: { parent: { parent: { key: '!!!', parent: 'ASD' } } }};
// let _g = gen((v = nested) => (v.key ? null : v.parent));
// // console.log([..._g])
// for (let o of _g) {
//   if (o.key)
//     console.log(o.key)
// }

// function arrLen (len, filler = (i => i)) { return (new Array(len).fill(0).map((_, i) => filler(i)))}
function root ($el) { return $el || (this != window ? this : (document.body)); }
function p (name) { return (d) => d[name] }
function p_ (d) { return (name) => d[name] }
function f (name, ...args) { return (d) => d[name](...args) }
function f_ (d, ...args) { return (name) => d[name](...args) }
function flt (fn, o = Boolean) { return (d) => Boolean(fn ? fn(d) : d) ? d : FLT }
function instOf (clas) { return (d) => d instanceof clas }
function isFunc (d) { d instanceof Function ? d : null; }
function ifdo (_if, fn) { return (d) => _if(d) ? fn(d) : d }

function $ (sel) { return root().querySelector(sel) }
function $$ (sel) {
  let $els = [...root().querySelectorAll(sel)];
  // console.log('$$()', root(), $els);
  if (!$els.length) throw 'No $els';
  return $els }
function g (sel) { const $els = $$(sel); return use($els.length == 1 ? $els[0] : $els) }
function txt ($el) { return $el.textContent }
function cl ($el) { return $el.className; }
function clAdd (className) { return ($el) => $el.classList.add(className); }
function fnNames (fns) { return fns.map(fn => fn.name) }
function bg (bg) { return ($el) => $el.style.background = bg }
function bgRed ($el) { $el.style.background = 'red' }
function clAtt (str) {return (' ' + str).replace(/\]|\[|\%|\./g, r => `\\${r}`).split(' ').join('.')}
function join (arr, str="\n") { return arr.join(str) }
function split (str, dlmtr) { return str.split(dlmtr) }
function crSty (css, head = document.head || document.getElementsByTagName('head')[0]) {
  style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
}

function pipe (...fns) {
  return (...args) => {
    let res = args[0];
    for (let i = 0; i < fns.length; i++) {
      res = fns[i](res, ...args.slice(1));
      if (res === FLT)
        return FLT;
    }
    return res;
  }
}
pi = pipe;

function use (val) {
  if (Array.isArray(val))
    return (...fns) => map(...fns)(val);
  return (...fns) => pipe(...fns)(val);
}

function map (...fns) {
  return (arr) => {
    if (!('map' in arr))
      arr = [arr];
    if (!fns.length)
      return arr;

    const _pipe = pipe(...fns);
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      const _res = _pipe(arr[i]);
      if (_res != FLT)
        res.push(_res);
    }
    return res;
  };
}
function t (a, b) {
  const aIsFn = a instanceof Function;
  let time = 1e3;
  if (aIsFn)
    return retFn(a);
  else {
    time = a;
    if (b)
      return retFn(b);
    return retFn;
  }

  function retFn (fn) {
    return new Promise ((r, j) => {
      setTimeout(() => {
        r(fn());
      }, time);
    });
  }
}
function getTxts (sel) { return $$(sel).map(txt) }
function getTxtsClAtt (sel) { return getTxts(clAtt(sel)) }
function nlc (arr) { return copy(join(arr)) }

// let $$histLink = $$('[aria-label="Chat history"] a'+clAtt`flex items-center gap-2 p-2`);

function l (...args) { return console.log(...args) }
// let _P = Promise;
// _P.prototype = Object.create(Promise);
// _P.prototype._ = Promise.prototype.then;
// _P.prototype.l = function () { this.then(l); return this; };
// function P (fn) { return new _P(r => r(fn instanceof Function ? fn() : fn)); };
// function Ps (...fns) {
//   if (fns.length === 1 && Array.isArray(fns[0])) fns = [0];
//   if ('then' in fns[0])
//     return Promise.all(fns).then(dd => P(dd));
//   let promFns = fns.map( fn => P(arg => fn instanceof Promise ? fn : fn(arg)));
//   return arg => Promise.all(promFns)
//     .then(dd => P(dd));
// }
// Ps(P(v => 3), P(v => 2)).l()
// P(t(100, ()=> 2))._(Ps(v => v+3, v => v+4))._(arr => arr[0]+arr[1]).l()

Promise.prototype._ = Promise.prototype.then;
Promise.prototype.l = function () { this.then(l).catch(console.error); return this }
function P (fn) { return new Promise(r => r(fn instanceof Function ? fn() : fn)); };
function Ps (...fns) {
  if (Array.isArray(fns[0]))
    fns = fns[0];
  return Promise.all(fns.map(P));
};

function _rdc (fn) {
  return function (arr) { return arr.reduce(fn) }
}
// Ps(t(100, ()=> 2), P(v => 3), v => 2)._(red((a,b)=>a+b)).l()
// P(()=> 2).l()
// P(t(100, ()=> 2)).l()
