﻿/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2015 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.3.4
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.Promise=t()}}(function(){var t,e,n;return function r(t,e,n){function i(s,a){if(!e[s]){if(!t[s]){var c="function"==typeof _dereq_&&_dereq_;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=e[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return i(n?n:e)},u,u.exports,r,t,e,n)}return e[s].exports}for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,n){"use strict";e.exports=function(t){function e(t){var e=new n(t),r=e.promise();return e.setHowMany(1),e.setUnwrap(),e.init(),r}var n=t._SomePromiseArray;t.any=function(t){return e(t)},t.prototype.any=function(){return e(this)}}},{}],2:[function(t,e,n){"use strict";function r(){this._isTickUsed=!1,this._lateQueue=new u(16),this._normalQueue=new u(16),this._haveDrainedQueues=!1,this._trampolineEnabled=!0;var t=this;this.drainQueues=function(){t._drainQueues()},this._schedule=l}function i(t,e,n){this._lateQueue.push(t,e,n),this._queueTick()}function o(t,e,n){this._normalQueue.push(t,e,n),this._queueTick()}function s(t){this._normalQueue._pushOne(t),this._queueTick()}var a;try{throw new Error}catch(c){a=c}var l=t("./schedule"),u=t("./queue"),p=t("./util");r.prototype.enableTrampoline=function(){this._trampolineEnabled=!0},r.prototype.disableTrampolineIfNecessary=function(){p.hasDevTools&&(this._trampolineEnabled=!1)},r.prototype.haveItemsQueued=function(){return this._isTickUsed||this._haveDrainedQueues},r.prototype.fatalError=function(t,e){e?(process.stderr.write("Fatal "+(t instanceof Error?t.stack:t)+"\n"),process.exit(2)):this.throwLater(t)},r.prototype.throwLater=function(t,e){if(1===arguments.length&&(e=t,t=function(){throw e}),"undefined"!=typeof setTimeout)setTimeout(function(){t(e)},0);else try{this._schedule(function(){t(e)})}catch(n){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}},p.hasDevTools?(r.prototype.invokeLater=function(t,e,n){this._trampolineEnabled?i.call(this,t,e,n):this._schedule(function(){setTimeout(function(){t.call(e,n)},100)})},r.prototype.invoke=function(t,e,n){this._trampolineEnabled?o.call(this,t,e,n):this._schedule(function(){t.call(e,n)})},r.prototype.settlePromises=function(t){this._trampolineEnabled?s.call(this,t):this._schedule(function(){t._settlePromises()})}):(r.prototype.invokeLater=i,r.prototype.invoke=o,r.prototype.settlePromises=s),r.prototype.invokeFirst=function(t,e,n){this._normalQueue.unshift(t,e,n),this._queueTick()},r.prototype._drainQueue=function(t){for(;t.length()>0;){var e=t.shift();if("function"==typeof e){var n=t.shift(),r=t.shift();e.call(n,r)}else e._settlePromises()}},r.prototype._drainQueues=function(){this._drainQueue(this._normalQueue),this._reset(),this._haveDrainedQueues=!0,this._drainQueue(this._lateQueue)},r.prototype._queueTick=function(){this._isTickUsed||(this._isTickUsed=!0,this._schedule(this.drainQueues))},r.prototype._reset=function(){this._isTickUsed=!1},e.exports=r,e.exports.firstLineError=a},{"./queue":26,"./schedule":29,"./util":36}],3:[function(t,e,n){"use strict";e.exports=function(t,e,n,r){var i=!1,o=function(t,e){this._reject(e)},s=function(t,e){e.promiseRejectionQueued=!0,e.bindingPromise._then(o,o,null,this,t)},a=function(t,e){0===(50397184&this._bitField)&&this._resolveCallback(e.target)},c=function(t,e){e.promiseRejectionQueued||this._reject(t)};t.prototype.bind=function(o){i||(i=!0,t.prototype._propagateFrom=r.propagateFromFunction(),t.prototype._boundValue=r.boundValueFunction());var l=n(o),u=new t(e);u._propagateFrom(this,1);var p=this._target();if(u._setBoundTo(l),l instanceof t){var h={promiseRejectionQueued:!1,promise:u,target:p,bindingPromise:l};p._then(e,s,void 0,u,h),l._then(a,c,void 0,u,h),u._setOnCancel(l)}else u._resolveCallback(p);return u},t.prototype._setBoundTo=function(t){void 0!==t?(this._bitField=2097152|this._bitField,this._boundTo=t):this._bitField=-2097153&this._bitField},t.prototype._isBound=function(){return 2097152===(2097152&this._bitField)},t.bind=function(e,n){return t.resolve(n).bind(e)}}},{}],4:[function(t,e,n){"use strict";function r(){try{Promise===o&&(Promise=i)}catch(t){}return o}var i;"undefined"!=typeof Promise&&(i=Promise);var o=t("./promise")();o.noConflict=r,e.exports=o},{"./promise":22}],5:[function(t,e,n){"use strict";var r=Object.create;if(r){var i=r(null),o=r(null);i[" size"]=o[" size"]=0}e.exports=function(e){function n(t,n){var r;if(null!=t&&(r=t[n]),"function"!=typeof r){var i="Object "+a.classString(t)+" has no method '"+a.toString(n)+"'";throw new e.TypeError(i)}return r}function r(t){var e=this.pop(),r=n(t,e);return r.apply(t,this)}function i(t){return t[this]}function o(t){var e=+this;return 0>e&&(e=Math.max(0,e+t.length)),t[e]}var s,a=t("./util"),c=a.canEvaluate;a.isIdentifier;e.prototype.call=function(t){var e=[].slice.call(arguments,1);return e.push(t),this._then(r,void 0,void 0,e,void 0)},e.prototype.get=function(t){var e,n="number"==typeof t;if(n)e=o;else if(c){var r=s(t);e=null!==r?r:i}else e=i;return this._then(e,void 0,void 0,t,void 0)}}},{"./util":36}],6:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){var o=t("./util"),s=o.tryCatch,a=o.errorObj,c=e._async;e.prototype["break"]=e.prototype.cancel=function(){if(!i.cancellation())return this._warn("cancellation is disabled");for(var t=this,e=t;t.isCancellable();){if(!t._cancelBy(e)){e._isFollowing()?e._followee().cancel():e._cancelBranched();break}var n=t._cancellationParent;if(null==n||!n.isCancellable()){t._isFollowing()?t._followee().cancel():t._cancelBranched();break}t._isFollowing()&&t._followee().cancel(),e=t,t=n}},e.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--},e.prototype._enoughBranchesHaveCancelled=function(){return void 0===this._branchesRemainingToCancel||this._branchesRemainingToCancel<=0},e.prototype._cancelBy=function(t){return t===this?(this._branchesRemainingToCancel=0,this._invokeOnCancel(),!0):(this._branchHasCancelled(),this._enoughBranchesHaveCancelled()?(this._invokeOnCancel(),!0):!1)},e.prototype._cancelBranched=function(){this._enoughBranchesHaveCancelled()&&this._cancel()},e.prototype._cancel=function(){this.isCancellable()&&(this._setCancelled(),c.invoke(this._cancelPromises,this,void 0))},e.prototype._cancelPromises=function(){this._length()>0&&this._settlePromises()},e.prototype._unsetOnCancel=function(){this._onCancelField=void 0},e.prototype.isCancellable=function(){return this.isPending()&&!this.isCancelled()},e.prototype._doInvokeOnCancel=function(t,e){if(o.isArray(t))for(var n=0;n<t.length;++n)this._doInvokeOnCancel(t[n],e);else if(void 0!==t)if("function"==typeof t){if(!e){var r=s(t).call(this._boundValue());r===a&&(this._attachExtraTrace(r.e),c.throwLater(r.e))}}else t._resultCancelled(this)},e.prototype._invokeOnCancel=function(){var t=this._onCancel();this._unsetOnCancel(),c.invoke(this._doInvokeOnCancel,this,t)},e.prototype._invokeInternalOnCancel=function(){this.isCancellable()&&(this._doInvokeOnCancel(this._onCancel(),!0),this._unsetOnCancel())},e.prototype._resultCancelled=function(){this.cancel()}}},{"./util":36}],7:[function(t,e,n){"use strict";e.exports=function(e){function n(t,n,a){return function(c){var l=a._boundValue();t:for(var u=0;u<t.length;++u){var p=t[u];if(p===Error||null!=p&&p.prototype instanceof Error){if(c instanceof p)return o(n).call(l,c)}else if("function"==typeof p){var h=o(p).call(l,c);if(h===s)return h;if(h)return o(n).call(l,c)}else if(r.isObject(c)){for(var f=i(p),_=0;_<f.length;++_){var d=f[_];if(p[d]!=c[d])continue t}return o(n).call(l,c)}}return e}}var r=t("./util"),i=t("./es5").keys,o=r.tryCatch,s=r.errorObj;return n}},{"./es5":13,"./util":36}],8:[function(t,e,n){"use strict";e.exports=function(t){function e(){this._trace=new e.CapturedTrace(r())}function n(){return i?new e:void 0}function r(){var t=o.length-1;return t>=0?o[t]:void 0}var i=!1,o=[];return t.prototype._promiseCreated=function(){},t.prototype._pushContext=function(){},t.prototype._popContext=function(){return null},t._peekContext=t.prototype._peekContext=function(){},e.prototype._pushContext=function(){void 0!==this._trace&&(this._trace._promiseCreated=null,o.push(this._trace))},e.prototype._popContext=function(){if(void 0!==this._trace){var t=o.pop(),e=t._promiseCreated;return t._promiseCreated=null,e}return null},e.CapturedTrace=null,e.create=n,e.deactivateLongStackTraces=function(){},e.activateLongStackTraces=function(){var n=t.prototype._pushContext,o=t.prototype._popContext,s=t._peekContext,a=t.prototype._peekContext,c=t.prototype._promiseCreated;e.deactivateLongStackTraces=function(){t.prototype._pushContext=n,t.prototype._popContext=o,t._peekContext=s,t.prototype._peekContext=a,t.prototype._promiseCreated=c,i=!1},i=!0,t.prototype._pushContext=e.prototype._pushContext,t.prototype._popContext=e.prototype._popContext,t._peekContext=t.prototype._peekContext=r,t.prototype._promiseCreated=function(){var t=this._peekContext();t&&null==t._promiseCreated&&(t._promiseCreated=this)}},e}},{}],9:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,e){return{promise:e}}function i(){return!1}function o(t,e,n){var r=this;try{t(e,n,function(t){if("function"!=typeof t)throw new TypeError("onCancel must be a function, got: "+H.toString(t));r._attachCancellationCallback(t)})}catch(i){return i}}function s(t){if(!this.isCancellable())return this;var e=this._onCancel();void 0!==e?H.isArray(e)?e.push(t):this._setOnCancel([e,t]):this._setOnCancel(t)}function a(){return this._onCancelField}function c(t){this._onCancelField=t}function l(){this._cancellationParent=void 0,this._onCancelField=void 0}function u(t,e){if(0!==(1&e)){this._cancellationParent=t;var n=t._branchesRemainingToCancel;void 0===n&&(n=0),t._branchesRemainingToCancel=n+1}0!==(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}function p(t,e){0!==(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}function h(){var t=this._boundTo;return void 0!==t&&t instanceof e?t.isFulfilled()?t.value():void 0:t}function f(){this._trace=new O(this._peekContext())}function _(t,e){if(N(t)){var n=this._trace;if(void 0!==n&&e&&(n=n._parent),void 0!==n)n.attachExtraTrace(t);else if(!t.__stackCleaned__){var r=j(t);H.notEnumerableProp(t,"stack",r.message+"\n"+r.stack.join("\n")),H.notEnumerableProp(t,"__stackCleaned__",!0)}}}function d(t,e,n,r,i){if(void 0===t&&null!==e&&z){if(void 0!==i&&i._returnedNonUndefined())return;var o=r._bitField;if(0===(65535&o))return;n&&(n+=" ");var s="a promise was created in a "+n+"handler but was not returned from it";r._warn(s,!0,e)}}function v(t,e){var n=t+" is deprecated and will be removed in a future version.";return e&&(n+=" Use "+e+" instead."),y(n)}function y(t,n,r){if(rt.warnings){var i,o=new L(t);if(n)r._attachExtraTrace(o);else if(rt.longStackTraces&&(i=e._peekContext()))i.attachExtraTrace(o);else{var s=j(o);o.stack=s.message+"\n"+s.stack.join("\n")}Y("warning",o)||k(o,"",!0)}}function g(t,e){for(var n=0;n<e.length-1;++n)e[n].push("From previous event:"),e[n]=e[n].join("\n");return n<e.length&&(e[n]=e[n].join("\n")),t+"\n"+e.join("\n")}function m(t){for(var e=0;e<t.length;++e)(0===t[e].length||e+1<t.length&&t[e][0]===t[e+1][0])&&(t.splice(e,1),e--)}function b(t){for(var e=t[0],n=1;n<t.length;++n){for(var r=t[n],i=e.length-1,o=e[i],s=-1,a=r.length-1;a>=0;--a)if(r[a]===o){s=a;break}for(var a=s;a>=0;--a){var c=r[a];if(e[i]!==c)break;e.pop(),i--}e=r}}function w(t){for(var e=[],n=0;n<t.length;++n){var r=t[n],i="    (No stack trace)"===r||B.test(r),o=i&&tt(r);i&&!o&&(q&&" "!==r.charAt(0)&&(r="    "+r),e.push(r))}return e}function C(t){for(var e=t.stack.replace(/\s+$/g,"").split("\n"),n=0;n<e.length;++n){var r=e[n];if("    (No stack trace)"===r||B.test(r))break}return n>0&&(e=e.slice(n)),e}function j(t){var e=t.stack,n=t.toString();return e="string"==typeof e&&e.length>0?C(t):["    (No stack trace)"],{message:n,stack:w(e)}}function k(t,e,n){if("undefined"!=typeof console){var r;if(H.isObject(t)){var i=t.stack;r=e+M(i,t)}else r=e+String(t);"function"==typeof D?D(r,n):("function"==typeof console.log||"object"==typeof console.log)&&console.log(r)}}function E(t,e,n,r){var i=!1;try{"function"==typeof e&&(i=!0,"rejectionHandled"===t?e(r):e(n,r))}catch(o){I.throwLater(o)}"unhandledRejection"===t?Y(t,n,r)||i||k(n,"Unhandled rejection "):Y(t,r)}function F(t){var e;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else{e=t&&"function"==typeof t.toString?t.toString():H.toString(t);var n=/\[object [a-zA-Z0-9$_]+\]/;if(n.test(e))try{var r=JSON.stringify(t);e=r}catch(i){}0===e.length&&(e="(empty array)")}return"(<"+x(e)+">, no stack trace)"}function x(t){var e=41;return t.length<e?t:t.substr(0,e-3)+"..."}function T(){return"function"==typeof nt}function R(t){var e=t.match(et);return e?{fileName:e[1],line:parseInt(e[2],10)}:void 0}function P(t,e){if(T()){for(var n,r,i=t.stack.split("\n"),o=e.stack.split("\n"),s=-1,a=-1,c=0;c<i.length;++c){var l=R(i[c]);if(l){n=l.fileName,s=l.line;break}}for(var c=0;c<o.length;++c){var l=R(o[c]);if(l){r=l.fileName,a=l.line;break}}0>s||0>a||!n||!r||n!==r||s>=a||(tt=function(t){if(U.test(t))return!0;var e=R(t);return e&&e.fileName===n&&s<=e.line&&e.line<=a?!0:!1})}}function O(t){this._parent=t,this._promisesCreated=0;var e=this._length=1+(void 0===t?0:t._length);nt(this,O),e>32&&this.uncycle()}var S,A,D,V=e._getDomain,I=e._async,L=t("./errors").Warning,H=t("./util"),N=H.canAttachTrace,U=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,B=null,M=null,q=!1,Q=!(0==H.env("BLUEBIRD_DEBUG")||!H.env("BLUEBIRD_DEBUG")&&"development"!==H.env("NODE_ENV")),$=!(0==H.env("BLUEBIRD_WARNINGS")||!Q&&!H.env("BLUEBIRD_WARNINGS")),G=!(0==H.env("BLUEBIRD_LONG_STACK_TRACES")||!Q&&!H.env("BLUEBIRD_LONG_STACK_TRACES")),z=0!=H.env("BLUEBIRD_W_FORGOTTEN_RETURN")&&($||!!H.env("BLUEBIRD_W_FORGOTTEN_RETURN"));e.prototype.suppressUnhandledRejections=function(){var t=this._target();t._bitField=-1048577&t._bitField|524288},e.prototype._ensurePossibleRejectionHandled=function(){0===(524288&this._bitField)&&(this._setRejectionIsUnhandled(),I.invokeLater(this._notifyUnhandledRejection,this,void 0))},e.prototype._notifyUnhandledRejectionIsHandled=function(){E("rejectionHandled",S,void 0,this)},e.prototype._setReturnedNonUndefined=function(){this._bitField=268435456|this._bitField},e.prototype._returnedNonUndefined=function(){return 0!==(268435456&this._bitField)},e.prototype._notifyUnhandledRejection=function(){if(this._isRejectionUnhandled()){var t=this._settledValue();this._setUnhandledRejectionIsNotified(),E("unhandledRejection",A,t,this)}},e.prototype._setUnhandledRejectionIsNotified=function(){this._bitField=262144|this._bitField},e.prototype._unsetUnhandledRejectionIsNotified=function(){this._bitField=-262145&this._bitField},e.prototype._isUnhandledRejectionNotified=function(){return(262144&this._bitField)>0},e.prototype._setRejectionIsUnhandled=function(){this._bitField=1048576|this._bitField},e.prototype._unsetRejectionIsUnhandled=function(){this._bitField=-1048577&this._bitField,this._isUnhandledRejectionNotified()&&(this._unsetUnhandledRejectionIsNotified(),this._notifyUnhandledRejectionIsHandled())},e.prototype._isRejectionUnhandled=function(){return(1048576&this._bitField)>0},e.prototype._warn=function(t,e,n){return y(t,e,n||this)},e.onPossiblyUnhandledRejection=function(t){var e=V();A="function"==typeof t?null===e?t:e.bind(t):void 0},e.onUnhandledRejectionHandled=function(t){var e=V();S="function"==typeof t?null===e?t:e.bind(t):void 0};var X=function(){};e.longStackTraces=function(){if(I.haveItemsQueued()&&!rt.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");if(!rt.longStackTraces&&T()){var t=e.prototype._captureStackTrace,r=e.prototype._attachExtraTrace;rt.longStackTraces=!0,X=function(){if(I.haveItemsQueued()&&!rt.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");e.prototype._captureStackTrace=t,e.prototype._attachExtraTrace=r,n.deactivateLongStackTraces(),I.enableTrampoline(),rt.longStackTraces=!1},e.prototype._captureStackTrace=f,e.prototype._attachExtraTrace=_,n.activateLongStackTraces(),I.disableTrampolineIfNecessary()}},e.hasLongStackTraces=function(){return rt.longStackTraces&&T()};var W=function(){try{var t=document.createEvent("CustomEvent");return t.initCustomEvent("testingtheevent",!1,!0,{}),H.global.dispatchEvent(t),function(t,e){var n=document.createEvent("CustomEvent");return n.initCustomEvent(t.toLowerCase(),!1,!0,e),!H.global.dispatchEvent(n)}}catch(e){}return function(){return!1}}(),K=function(){return H.isNode?function(){return process.emit.apply(process,arguments)}:H.global?function(t){var e="on"+t.toLowerCase(),n=H.global[e];return n?(n.apply(H.global,[].slice.call(arguments,1)),!0):!1}:function(){return!1}}(),J={promiseCreated:r,promiseFulfilled:r,promiseRejected:r,promiseResolved:r,promiseCancelled:r,promiseChained:function(t,e,n){return{promise:e,child:n}},warning:function(t,e){return{warning:e}},unhandledRejection:function(t,e,n){return{reason:e,promise:n}},rejectionHandled:r},Y=function(t){var e=!1;try{e=K.apply(null,arguments)}catch(n){I.throwLater(n),e=!0}var r=!1;try{r=W(t,J[t].apply(null,arguments))}catch(n){I.throwLater(n),r=!0}return r||e};e.config=function(t){if(t=Object(t),"longStackTraces"in t&&(t.longStackTraces?e.longStackTraces():!t.longStackTraces&&e.hasLongStackTraces()&&X()),"warnings"in t){var n=t.warnings;rt.warnings=!!n,z=rt.warnings,H.isObject(n)&&"wForgottenReturn"in n&&(z=!!n.wForgottenReturn)}if("cancellation"in t&&t.cancellation&&!rt.cancellation){if(I.haveItemsQueued())throw new Error("cannot enable cancellation after promises are in use");e.prototype._clearCancellationData=l,e.prototype._propagateFrom=u,e.prototype._onCancel=a,e.prototype._setOnCancel=c,e.prototype._attachCancellationCallback=s,e.prototype._execute=o,Z=u,rt.cancellation=!0}"monitoring"in t&&(t.monitoring&&!rt.monitoring?(rt.monitoring=!0,e.prototype._fireEvent=Y):!t.monitoring&&rt.monitoring&&(rt.monitoring=!1,e.prototype._fireEvent=i))},e.prototype._fireEvent=i,e.prototype._execute=function(t,e,n){try{t(e,n)}catch(r){return r}},e.prototype._onCancel=function(){},e.prototype._setOnCancel=function(t){},e.prototype._attachCancellationCallback=function(t){},e.prototype._captureStackTrace=function(){},e.prototype._attachExtraTrace=function(){},e.prototype._clearCancellationData=function(){},e.prototype._propagateFrom=function(t,e){};var Z=p,tt=function(){return!1},et=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;H.inherits(O,Error),n.CapturedTrace=O,O.prototype.uncycle=function(){var t=this._length;if(!(2>t)){for(var e=[],n={},r=0,i=this;void 0!==i;++r)e.push(i),i=i._parent;t=this._length=r;for(var r=t-1;r>=0;--r){var o=e[r].stack;void 0===n[o]&&(n[o]=r)}for(var r=0;t>r;++r){var s=e[r].stack,a=n[s];if(void 0!==a&&a!==r){a>0&&(e[a-1]._parent=void 0,e[a-1]._length=1),e[r]._parent=void 0,e[r]._length=1;var c=r>0?e[r-1]:this;t-1>a?(c._parent=e[a+1],c._parent.uncycle(),c._length=c._parent._length+1):(c._parent=void 0,c._length=1);for(var l=c._length+1,u=r-2;u>=0;--u)e[u]._length=l,l++;return}}}},O.prototype.attachExtraTrace=function(t){if(!t.__stackCleaned__){this.uncycle();for(var e=j(t),n=e.message,r=[e.stack],i=this;void 0!==i;)r.push(w(i.stack.split("\n"))),i=i._parent;b(r),m(r),H.notEnumerableProp(t,"stack",g(n,r)),H.notEnumerableProp(t,"__stackCleaned__",!0)}};var nt=function(){var t=/^\s*at\s*/,e=function(t,e){return"string"==typeof t?t:void 0!==e.name&&void 0!==e.message?e.toString():F(e)};if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){Error.stackTraceLimit+=6,B=t,M=e;var n=Error.captureStackTrace;return tt=function(t){return U.test(t)},function(t,e){Error.stackTraceLimit+=6,n(t,e),Error.stackTraceLimit-=6}}var r=new Error;if("string"==typeof r.stack&&r.stack.split("\n")[0].indexOf("stackDetection@")>=0)return B=/@/,M=e,q=!0,function(t){t.stack=(new Error).stack};var i;try{throw new Error}catch(o){i="stack"in o}return"stack"in r||!i||"number"!=typeof Error.stackTraceLimit?(M=function(t,e){return"string"==typeof t?t:"object"!=typeof e&&"function"!=typeof e||void 0===e.name||void 0===e.message?F(e):e.toString()},null):(B=t,M=e,function(t){Error.stackTraceLimit+=6;try{throw new Error}catch(e){t.stack=e.stack}Error.stackTraceLimit-=6})}([]);"undefined"!=typeof console&&"undefined"!=typeof console.warn&&(D=function(t){console.warn(t)},H.isNode&&process.stderr.isTTY?D=function(t,e){var n=e?"[33m":"[31m";console.warn(n+t+"[0m\n")}:H.isNode||"string"!=typeof(new Error).stack||(D=function(t,e){console.warn("%c"+t,e?"color: darkorange":"color: red")}));var rt={warnings:$,longStackTraces:!1,cancellation:!1,monitoring:!1};return G&&e.longStackTraces(),{longStackTraces:function(){return rt.longStackTraces},warnings:function(){return rt.warnings},cancellation:function(){return rt.cancellation},monitoring:function(){return rt.monitoring},propagateFromFunction:function(){return Z},boundValueFunction:function(){return h},checkForgottenReturns:d,setBounds:P,warn:y,deprecated:v,CapturedTrace:O,fireDomEvent:W,fireGlobalEvent:K}}},{"./errors":12,"./util":36}],10:[function(t,e,n){"use strict";e.exports=function(t){function e(){return this.value}function n(){throw this.reason}t.prototype["return"]=t.prototype.thenReturn=function(n){return n instanceof t&&n.suppressUnhandledRejections(),this._then(e,void 0,void 0,{value:n},void 0)},t.prototype["throw"]=t.prototype.thenThrow=function(t){return this._then(n,void 0,void 0,{reason:t},void 0)},t.prototype.catchThrow=function(t){if(arguments.length<=1)return this._then(void 0,n,void 0,{reason:t},void 0);var e=arguments[1],r=function(){throw e};return this.caught(t,r)},t.prototype.catchReturn=function(n){if(arguments.length<=1)return n instanceof t&&n.suppressUnhandledRejections(),this._then(void 0,e,void 0,{value:n},void 0);var r=arguments[1];r instanceof t&&r.suppressUnhandledRejections();var i=function(){return r};return this.caught(n,i)}}},{}],11:[function(t,e,n){"use strict";e.exports=function(t,e){function n(){return o(this)}function r(t,n){return i(t,n,e,e)}var i=t.reduce,o=t.all;t.prototype.each=function(t){return this.mapSeries(t)._then(n,void 0,void 0,this,void 0)},t.prototype.mapSeries=function(t){return i(this,t,e,e)},t.each=function(t,e){return r(t,e)._then(n,void 0,void 0,t,void 0)},t.mapSeries=r}},{}],12:[function(t,e,n){"use strict";function r(t,e){function n(r){return this instanceof n?(p(this,"message","string"==typeof r?r:e),p(this,"name",t),void(Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):Error.call(this))):new n(r)}return u(n,Error),n}function i(t){return this instanceof i?(p(this,"name","OperationalError"),p(this,"message",t),this.cause=t,this.isOperational=!0,void(t instanceof Error?(p(this,"message",t.message),p(this,"stack",t.stack)):Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor))):new i(t)}var o,s,a=t("./es5"),c=a.freeze,l=t("./util"),u=l.inherits,p=l.notEnumerableProp,h=r("Warning","warning"),f=r("CancellationError","cancellation error"),_=r("TimeoutError","timeout error"),d=r("AggregateError","aggregate error");try{o=TypeError,s=RangeError}catch(v){o=r("TypeError","type error"),s=r("RangeError","range error")}for(var y="join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "),g=0;g<y.length;++g)"function"==typeof Array.prototype[y[g]]&&(d.prototype[y[g]]=Array.prototype[y[g]]);a.defineProperty(d.prototype,"length",{value:0,configurable:!1,writable:!0,enumerable:!0}),d.prototype.isOperational=!0;var m=0;d.prototype.toString=function(){var t=Array(4*m+1).join(" "),e="\n"+t+"AggregateError of:\n";m++,t=Array(4*m+1).join(" ");for(var n=0;n<this.length;++n){for(var r=this[n]===this?"[Circular AggregateError]":this[n]+"",i=r.split("\n"),o=0;o<i.length;++o)i[o]=t+i[o];r=i.join("\n"),e+=r+"\n"}return m--,e},u(i,Error);var b=Error.__BluebirdErrorTypes__;b||(b=c({CancellationError:f,TimeoutError:_,OperationalError:i,RejectionError:i,AggregateError:d}),a.defineProperty(Error,"__BluebirdErrorTypes__",{value:b,writable:!1,enumerable:!1,configurable:!1})),e.exports={Error:Error,TypeError:o,RangeError:s,CancellationError:b.CancellationError,OperationalError:b.OperationalError,TimeoutError:b.TimeoutError,AggregateError:b.AggregateError,Warning:h}},{"./es5":13,"./util":36}],13:[function(t,e,n){var r=function(){"use strict";return void 0===this}();if(r)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:r,propertyIsWritable:function(t,e){var n=Object.getOwnPropertyDescriptor(t,e);return!(n&&!n.writable&&!n.set)}};else{var i={}.hasOwnProperty,o={}.toString,s={}.constructor.prototype,a=function(t){var e=[];for(var n in t)i.call(t,n)&&e.push(n);return e},c=function(t,e){return{value:t[e]}},l=function(t,e,n){return t[e]=n.value,t},u=function(t){return t},p=function(t){try{return Object(t).constructor.prototype}catch(e){return s}},h=function(t){try{return"[object Array]"===o.call(t)}catch(e){return!1}};e.exports={isArray:h,keys:a,names:a,defineProperty:l,getDescriptor:c,freeze:u,getPrototypeOf:p,isES5:r,propertyIsWritable:function(){return!0}}}},{}],14:[function(t,e,n){"use strict";e.exports=function(t,e){var n=t.map;t.prototype.filter=function(t,r){return n(this,t,r,e)},t.filter=function(t,r,i){return n(t,r,i,e)}}},{}],15:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,e,n){this.promise=t,this.type=e,this.handler=n,this.called=!1,this.cancelPromise=null}function i(t){this.finallyHandler=t}function o(t,e){return null!=t.cancelPromise?(arguments.length>1?t.cancelPromise._reject(e):t.cancelPromise._cancel(),t.cancelPromise=null,!0):!1}function s(){return c.call(this,this.promise._target()._settledValue())}function a(t){return o(this,t)?void 0:(p.e=t,p)}function c(t){var r=this.promise,c=this.handler;if(!this.called){this.called=!0;var l=this.isFinallyHandler()?c.call(r._boundValue()):c.call(r._boundValue(),t);if(void 0!==l){r._setReturnedNonUndefined();var h=n(l,r);if(h instanceof e){if(null!=this.cancelPromise){if(h.isCancelled()){var f=new u("late cancellation observer");return r._attachExtraTrace(f),p.e=f,p}h.isPending()&&h._attachCancellationCallback(new i(this))}return h._then(s,a,void 0,this,void 0)}}}return r.isRejected()?(o(this),p.e=t,p):(o(this),t)}var l=t("./util"),u=e.CancellationError,p=l.errorObj;return r.prototype.isFinallyHandler=function(){return 0===this.type},i.prototype._resultCancelled=function(){o(this.finallyHandler)},e.prototype._passThrough=function(t,e,n,i){return"function"!=typeof t?this.then():this._then(n,i,void 0,new r(this,e,t),void 0)},e.prototype.lastly=e.prototype["finally"]=function(t){return this._passThrough(t,0,c,c)},e.prototype.tap=function(t){return this._passThrough(t,1,c)},r}},{"./util":36}],16:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,n,r){for(var o=0;o<n.length;++o){r._pushContext();var s=f(n[o])(t);if(r._popContext(),s===h){r._pushContext();var a=e.reject(h.e);return r._popContext(),a}var c=i(s,r);if(c instanceof e)return c}return null}function c(t,n,i,o){var s=this._promise=new e(r);s._captureStackTrace(),s._setOnCancel(this),this._stack=o,this._generatorFunction=t,this._receiver=n,this._generator=void 0,this._yieldHandlers="function"==typeof i?[i].concat(_):_,this._yieldedPromise=null}var l=t("./errors"),u=l.TypeError,p=t("./util"),h=p.errorObj,f=p.tryCatch,_=[];p.inherits(c,o),c.prototype._isResolved=function(){return null===this._promise},c.prototype._cleanup=function(){this._promise=this._generator=null},c.prototype._promiseCancelled=function(){if(!this._isResolved()){var t,n="undefined"!=typeof this._generator["return"];if(n)this._promise._pushContext(),t=f(this._generator["return"]).call(this._generator,void 0),this._promise._popContext();else{var r=new e.CancellationError("generator .return() sentinel");e.coroutine.returnSentinel=r,this._promise._attachExtraTrace(r),this._promise._pushContext(),t=f(this._generator["throw"]).call(this._generator,r),this._promise._popContext(),t===h&&t.e===r&&(t=null)}var i=this._promise;this._cleanup(),t===h?i._rejectCallback(t.e,!1):i.cancel()}},c.prototype._promiseFulfilled=function(t){this._yieldedPromise=null,this._promise._pushContext();var e=f(this._generator.next).call(this._generator,t);this._promise._popContext(),this._continue(e)},c.prototype._promiseRejected=function(t){this._yieldedPromise=null,this._promise._attachExtraTrace(t),this._promise._pushContext();var e=f(this._generator["throw"]).call(this._generator,t);this._promise._popContext(),this._continue(e)},c.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof e){var t=this._yieldedPromise;this._yieldedPromise=null,this._promiseCancelled(),t.cancel()}},c.prototype.promise=function(){return this._promise},c.prototype._run=function(){this._generator=this._generatorFunction.call(this._receiver),this._receiver=this._generatorFunction=void 0,this._promiseFulfilled(void 0)},c.prototype._continue=function(t){var n=this._promise;if(t===h)return this._cleanup(),n._rejectCallback(t.e,!1);var r=t.value;if(t.done===!0)return this._cleanup(),n._resolveCallback(r);var o=i(r,this._promise);if(!(o instanceof e)&&(o=a(o,this._yieldHandlers,this._promise),null===o))return void this._promiseRejected(new u("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",r)+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")));o=o._target();var s=o._bitField;0===(50397184&s)?(this._yieldedPromise=o,o._proxy(this,null)):0!==(33554432&s)?this._promiseFulfilled(o._value()):0!==(16777216&s)?this._promiseRejected(o._reason()):this._promiseCancelled()},e.coroutine=function(t,e){if("function"!=typeof t)throw new u("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var n=Object(e).yieldHandler,r=c,i=(new Error).stack;return function(){var e=t.apply(this,arguments),o=new r(void 0,void 0,n,i),s=o.promise();return o._generator=e,o._promiseFulfilled(void 0),s}},e.coroutine.addYieldHandler=function(t){if("function"!=typeof t)throw new u("expecting a function but got "+p.classString(t));_.push(t)},e.spawn=function(t){if(s.deprecated("Promise.spawn()","Promise.coroutine()"),"function"!=typeof t)return n("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var r=new c(t,this),i=r.promise();return r._run(e.spawn),i}}},{"./errors":12,"./util":36}],17:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){var o=t("./util");o.canEvaluate,o.tryCatch,o.errorObj;e.join=function(){var t,e=arguments.length-1;if(e>0&&"function"==typeof arguments[e]){t=arguments[e];var r}var i=[].slice.call(arguments);t&&i.pop();var r=new n(i).promise();return void 0!==t?r.spread(t):r}}},{"./util":36}],18:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,e,n,r){this.constructor$(t),this._promise._captureStackTrace();var i=l();this._callback=null===i?e:i.bind(e),this._preservedValues=r===o?new Array(this.length()):null,this._limit=n,this._inFlight=0,this._queue=n>=1?[]:f,this._init$(void 0,-2)}function c(t,e,n,i){if("function"!=typeof e)return r("expecting a function but got "+u.classString(e));var o="object"==typeof n&&null!==n?n.concurrency:0;return o="number"==typeof o&&isFinite(o)&&o>=1?o:0,new a(t,e,o,i).promise()}var l=e._getDomain,u=t("./util"),p=u.tryCatch,h=u.errorObj,f=[];u.inherits(a,n),a.prototype._init=function(){},a.prototype._promiseFulfilled=function(t,n){
var r=this._values,o=this.length(),a=this._preservedValues,c=this._limit;if(0>n){if(n=-1*n-1,r[n]=t,c>=1&&(this._inFlight--,this._drainQueue(),this._isResolved()))return!0}else{if(c>=1&&this._inFlight>=c)return r[n]=t,this._queue.push(n),!1;null!==a&&(a[n]=t);var l=this._promise,u=this._callback,f=l._boundValue();l._pushContext();var _=p(u).call(f,t,n,o),d=l._popContext();if(s.checkForgottenReturns(_,d,null!==a?"Promise.filter":"Promise.map",l),_===h)return this._reject(_.e),!0;var v=i(_,this._promise);if(v instanceof e){v=v._target();var y=v._bitField;if(0===(50397184&y))return c>=1&&this._inFlight++,r[n]=v,v._proxy(this,-1*(n+1)),!1;if(0===(33554432&y))return 0!==(16777216&y)?(this._reject(v._reason()),!0):(this._cancel(),!0);_=v._value()}r[n]=_}var g=++this._totalResolved;return g>=o?(null!==a?this._filter(r,a):this._resolve(r),!0):!1},a.prototype._drainQueue=function(){for(var t=this._queue,e=this._limit,n=this._values;t.length>0&&this._inFlight<e;){if(this._isResolved())return;var r=t.pop();this._promiseFulfilled(n[r],r)}},a.prototype._filter=function(t,e){for(var n=e.length,r=new Array(n),i=0,o=0;n>o;++o)t[o]&&(r[i++]=e[o]);r.length=i,this._resolve(r)},a.prototype.preservedValues=function(){return this._preservedValues},e.prototype.map=function(t,e){return c(this,t,e,null)},e.map=function(t,e,n,r){return c(t,e,n,r)}}},{"./util":36}],19:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){var s=t("./util"),a=s.tryCatch;e.method=function(t){if("function"!=typeof t)throw new e.TypeError("expecting a function but got "+s.classString(t));return function(){var r=new e(n);r._captureStackTrace(),r._pushContext();var i=a(t).apply(this,arguments),s=r._popContext();return o.checkForgottenReturns(i,s,"Promise.method",r),r._resolveFromSyncValue(i),r}},e.attempt=e["try"]=function(t){if("function"!=typeof t)return i("expecting a function but got "+s.classString(t));var r=new e(n);r._captureStackTrace(),r._pushContext();var c;if(arguments.length>1){o.deprecated("calling Promise.try with more than 1 argument");var l=arguments[1],u=arguments[2];c=s.isArray(l)?a(t).apply(u,l):a(t).call(u,l)}else c=a(t)();var p=r._popContext();return o.checkForgottenReturns(c,p,"Promise.try",r),r._resolveFromSyncValue(c),r},e.prototype._resolveFromSyncValue=function(t){t===s.errorObj?this._rejectCallback(t.e,!1):this._resolveCallback(t,!0)}}},{"./util":36}],20:[function(t,e,n){"use strict";function r(t){return t instanceof Error&&u.getPrototypeOf(t)===Error.prototype}function i(t){var e;if(r(t)){e=new l(t),e.name=t.name,e.message=t.message,e.stack=t.stack;for(var n=u.keys(t),i=0;i<n.length;++i){var o=n[i];p.test(o)||(e[o]=t[o])}return e}return s.markAsOriginatingFromRejection(t),t}function o(t,e){return function(n,r){if(null!==t){if(n){var o=i(a(n));t._attachExtraTrace(o),t._reject(o)}else if(e){var s=[].slice.call(arguments,1);t._fulfill(s)}else t._fulfill(r);t=null}}}var s=t("./util"),a=s.maybeWrapAsError,c=t("./errors"),l=c.OperationalError,u=t("./es5"),p=/^(?:name|message|stack|cause)$/;e.exports=o},{"./errors":12,"./es5":13,"./util":36}],21:[function(t,e,n){"use strict";e.exports=function(e){function n(t,e){var n=this;if(!o.isArray(t))return r.call(n,t,e);var i=a(e).apply(n._boundValue(),[null].concat(t));i===c&&s.throwLater(i.e)}function r(t,e){var n=this,r=n._boundValue(),i=void 0===t?a(e).call(r,null):a(e).call(r,null,t);i===c&&s.throwLater(i.e)}function i(t,e){var n=this;if(!t){var r=new Error(t+"");r.cause=t,t=r}var i=a(e).call(n._boundValue(),t);i===c&&s.throwLater(i.e)}var o=t("./util"),s=e._async,a=o.tryCatch,c=o.errorObj;e.prototype.asCallback=e.prototype.nodeify=function(t,e){if("function"==typeof t){var o=r;void 0!==e&&Object(e).spread&&(o=n),this._then(o,i,void 0,this,t)}return this}}},{"./util":36}],22:[function(t,e,n){"use strict";e.exports=function(){function e(){}function n(t,e){if("function"!=typeof e)throw new y("expecting a function but got "+h.classString(e));if(t.constructor!==r)throw new y("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n")}function r(t){this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,this._promise0=void 0,this._receiver0=void 0,t!==m&&(n(this,t),this._resolveFromExecutor(t)),this._promiseCreated(),this._fireEvent("promiseCreated",this)}function i(t){this.promise._resolveCallback(t)}function o(t){this.promise._rejectCallback(t,!1)}function s(t){var e=new r(m);e._fulfillmentHandler0=t,e._rejectionHandler0=t,e._promise0=t,e._receiver0=t}var a,c=function(){return new y("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")},l=function(){return new r.PromiseInspection(this._target())},u=function(t){return r.reject(new y(t))},p={},h=t("./util");a=h.isNode?function(){var t=process.domain;return void 0===t&&(t=null),t}:function(){return null},h.notEnumerableProp(r,"_getDomain",a);var f=t("./es5"),_=t("./async"),d=new _;f.defineProperty(r,"_async",{value:d});var v=t("./errors"),y=r.TypeError=v.TypeError;r.RangeError=v.RangeError;var g=r.CancellationError=v.CancellationError;r.TimeoutError=v.TimeoutError,r.OperationalError=v.OperationalError,r.RejectionError=v.OperationalError,r.AggregateError=v.AggregateError;var m=function(){},b={},w={},C=t("./thenables")(r,m),j=t("./promise_array")(r,m,C,u,e),k=t("./context")(r),E=k.create,F=t("./debuggability")(r,k),x=(F.CapturedTrace,t("./finally")(r,C)),T=t("./catch_filter")(w),R=t("./nodeback"),P=h.errorObj,O=h.tryCatch;return r.prototype.toString=function(){return"[object Promise]"},r.prototype.caught=r.prototype["catch"]=function(t){var e=arguments.length;if(e>1){var n,r=new Array(e-1),i=0;for(n=0;e-1>n;++n){var o=arguments[n];if(!h.isObject(o))return u("expecting an object but got "+h.classString(o));r[i++]=o}return r.length=i,t=arguments[n],this.then(void 0,T(r,t,this))}return this.then(void 0,t)},r.prototype.reflect=function(){return this._then(l,l,void 0,this,void 0)},r.prototype.then=function(t,e){if(F.warnings()&&arguments.length>0&&"function"!=typeof t&&"function"!=typeof e){var n=".then() only accepts functions but was passed: "+h.classString(t);arguments.length>1&&(n+=", "+h.classString(e)),this._warn(n)}return this._then(t,e,void 0,void 0,void 0)},r.prototype.done=function(t,e){var n=this._then(t,e,void 0,void 0,void 0);n._setIsFinal()},r.prototype.spread=function(t){return"function"!=typeof t?u("expecting a function but got "+h.classString(t)):this.all()._then(t,void 0,void 0,b,void 0)},r.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,fulfillmentValue:void 0,rejectionReason:void 0};return this.isFulfilled()?(t.fulfillmentValue=this.value(),t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this.reason(),t.isRejected=!0),t},r.prototype.all=function(){return arguments.length>0&&this._warn(".all() was passed arguments but it does not take any"),new j(this).promise()},r.prototype.error=function(t){return this.caught(h.originatesFromRejection,t)},r.is=function(t){return t instanceof r},r.fromNode=r.fromCallback=function(t){var e=new r(m);e._captureStackTrace();var n=arguments.length>1?!!Object(arguments[1]).multiArgs:!1,i=O(t)(R(e,n));return i===P&&e._rejectCallback(i.e,!0),e._isFateSealed()||e._setAsyncGuaranteed(),e},r.all=function(t){return new j(t).promise()},r.cast=function(t){var e=C(t);return e instanceof r||(e=new r(m),e._captureStackTrace(),e._setFulfilled(),e._rejectionHandler0=t),e},r.resolve=r.fulfilled=r.cast,r.reject=r.rejected=function(t){var e=new r(m);return e._captureStackTrace(),e._rejectCallback(t,!0),e},r.setScheduler=function(t){if("function"!=typeof t)throw new y("expecting a function but got "+h.classString(t));var e=d._schedule;return d._schedule=t,e},r.prototype._then=function(t,e,n,i,o){var s=void 0!==o,c=s?o:new r(m),l=this._target(),u=l._bitField;s||(c._propagateFrom(this,3),c._captureStackTrace(),void 0===i&&0!==(2097152&this._bitField)&&(i=0!==(50397184&u)?this._boundValue():l===this?void 0:this._boundTo),this._fireEvent("promiseChained",this,c));var p=a();if(0!==(50397184&u)){var h,f,_=l._settlePromiseCtx;0!==(33554432&u)?(f=l._rejectionHandler0,h=t):0!==(16777216&u)?(f=l._fulfillmentHandler0,h=e,l._unsetRejectionIsUnhandled()):(_=l._settlePromiseLateCancellationObserver,f=new g("late cancellation observer"),l._attachExtraTrace(f),h=e),d.invoke(_,l,{handler:null===p?h:"function"==typeof h&&p.bind(h),promise:c,receiver:i,value:f})}else l._addCallbacks(t,e,c,i,p);return c},r.prototype._length=function(){return 65535&this._bitField},r.prototype._isFateSealed=function(){return 0!==(117506048&this._bitField)},r.prototype._isFollowing=function(){return 67108864===(67108864&this._bitField)},r.prototype._setLength=function(t){this._bitField=-65536&this._bitField|65535&t},r.prototype._setFulfilled=function(){this._bitField=33554432|this._bitField,this._fireEvent("promiseFulfilled",this)},r.prototype._setRejected=function(){this._bitField=16777216|this._bitField,this._fireEvent("promiseRejected",this)},r.prototype._setFollowing=function(){this._bitField=67108864|this._bitField,this._fireEvent("promiseResolved",this)},r.prototype._setIsFinal=function(){this._bitField=4194304|this._bitField},r.prototype._isFinal=function(){return(4194304&this._bitField)>0},r.prototype._unsetCancelled=function(){this._bitField=-65537&this._bitField},r.prototype._setCancelled=function(){this._bitField=65536|this._bitField,this._fireEvent("promiseCancelled",this)},r.prototype._setAsyncGuaranteed=function(){this._bitField=134217728|this._bitField},r.prototype._receiverAt=function(t){var e=0===t?this._receiver0:this[4*t-4+3];return e===p?void 0:void 0===e&&this._isBound()?this._boundValue():e},r.prototype._promiseAt=function(t){return this[4*t-4+2]},r.prototype._fulfillmentHandlerAt=function(t){return this[4*t-4+0]},r.prototype._rejectionHandlerAt=function(t){return this[4*t-4+1]},r.prototype._boundValue=function(){},r.prototype._migrateCallback0=function(t){var e=(t._bitField,t._fulfillmentHandler0),n=t._rejectionHandler0,r=t._promise0,i=t._receiverAt(0);void 0===i&&(i=p),this._addCallbacks(e,n,r,i,null)},r.prototype._migrateCallbackAt=function(t,e){var n=t._fulfillmentHandlerAt(e),r=t._rejectionHandlerAt(e),i=t._promiseAt(e),o=t._receiverAt(e);void 0===o&&(o=p),this._addCallbacks(n,r,i,o,null)},r.prototype._addCallbacks=function(t,e,n,r,i){var o=this._length();if(o>=65531&&(o=0,this._setLength(0)),0===o)this._promise0=n,this._receiver0=r,"function"==typeof t&&(this._fulfillmentHandler0=null===i?t:i.bind(t)),"function"==typeof e&&(this._rejectionHandler0=null===i?e:i.bind(e));else{var s=4*o-4;this[s+2]=n,this[s+3]=r,"function"==typeof t&&(this[s+0]=null===i?t:i.bind(t)),"function"==typeof e&&(this[s+1]=null===i?e:i.bind(e))}return this._setLength(o+1),o},r.prototype._proxy=function(t,e){this._addCallbacks(void 0,void 0,e,t,null)},r.prototype._resolveCallback=function(t,e){if(0===(117506048&this._bitField)){if(t===this)return this._rejectCallback(c(),!1);var n=C(t,this);if(!(n instanceof r))return this._fulfill(t);e&&this._propagateFrom(n,2);var i=n._target();if(i===this)return void this._reject(c());var o=i._bitField;if(0===(50397184&o)){var s=this._length();s>0&&i._migrateCallback0(this);for(var a=1;s>a;++a)i._migrateCallbackAt(this,a);this._setFollowing(),this._setLength(0),this._setFollowee(i)}else if(0!==(33554432&o))this._fulfill(i._value());else if(0!==(16777216&o))this._reject(i._reason());else{var l=new g("late cancellation observer");i._attachExtraTrace(l),this._reject(l)}}},r.prototype._rejectCallback=function(t,e,n){var r=h.ensureErrorObject(t),i=r===t;if(!i&&!n&&F.warnings()){var o="a promise was rejected with a non-error: "+h.classString(t);this._warn(o,!0)}this._attachExtraTrace(r,e?i:!1),this._reject(t)},r.prototype._resolveFromExecutor=function(t){var e=this;this._captureStackTrace(),this._pushContext();var n=!0,r=this._execute(t,function(t){e._resolveCallback(t)},function(t){e._rejectCallback(t,n)});n=!1,this._popContext(),void 0!==r&&e._rejectCallback(r,!0)},r.prototype._settlePromiseFromHandler=function(t,e,n,r){var i=r._bitField;if(0===(65536&i)){r._pushContext();var o;e===b?n&&"number"==typeof n.length?o=O(t).apply(this._boundValue(),n):(o=P,o.e=new y("cannot .spread() a non-array: "+h.classString(n))):o=O(t).call(e,n);var s=r._popContext();i=r._bitField,0===(65536&i)&&(o===w?r._reject(n):o===P?r._rejectCallback(o.e,!1):(F.checkForgottenReturns(o,s,"",r,this),r._resolveCallback(o)))}},r.prototype._target=function(){for(var t=this;t._isFollowing();)t=t._followee();return t},r.prototype._followee=function(){return this._rejectionHandler0},r.prototype._setFollowee=function(t){this._rejectionHandler0=t},r.prototype._settlePromise=function(t,n,i,o){var s=t instanceof r,a=this._bitField,c=0!==(134217728&a);0!==(65536&a)?(s&&t._invokeInternalOnCancel(),i instanceof x&&i.isFinallyHandler()?(i.cancelPromise=t,O(n).call(i,o)===P&&t._reject(P.e)):n===l?t._fulfill(l.call(i)):i instanceof e?i._promiseCancelled(t):s||t instanceof j?t._cancel():i.cancel()):"function"==typeof n?s?(c&&t._setAsyncGuaranteed(),this._settlePromiseFromHandler(n,i,o,t)):n.call(i,o,t):i instanceof e?i._isResolved()||(0!==(33554432&a)?i._promiseFulfilled(o,t):i._promiseRejected(o,t)):s&&(c&&t._setAsyncGuaranteed(),0!==(33554432&a)?t._fulfill(o):t._reject(o))},r.prototype._settlePromiseLateCancellationObserver=function(t){var e=t.handler,n=t.promise,i=t.receiver,o=t.value;"function"==typeof e?n instanceof r?this._settlePromiseFromHandler(e,i,o,n):e.call(i,o,n):n instanceof r&&n._reject(o)},r.prototype._settlePromiseCtx=function(t){this._settlePromise(t.promise,t.handler,t.receiver,t.value)},r.prototype._settlePromise0=function(t,e,n){var r=this._promise0,i=this._receiverAt(0);this._promise0=void 0,this._receiver0=void 0,this._settlePromise(r,t,i,e)},r.prototype._clearCallbackDataAtIndex=function(t){var e=4*t-4;this[e+2]=this[e+3]=this[e+0]=this[e+1]=void 0},r.prototype._fulfill=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(t===this){var n=c();return this._attachExtraTrace(n),this._reject(n)}this._setFulfilled(),this._rejectionHandler0=t,(65535&e)>0&&(0!==(134217728&e)?this._settlePromises():d.settlePromises(this))}},r.prototype._reject=function(t){var e=this._bitField;if(!((117506048&e)>>>16))return this._setRejected(),this._fulfillmentHandler0=t,this._isFinal()?d.fatalError(t,h.isNode):void((65535&e)>0?d.settlePromises(this):this._ensurePossibleRejectionHandled())},r.prototype._fulfillPromises=function(t,e){for(var n=1;t>n;n++){var r=this._fulfillmentHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n);this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}},r.prototype._rejectPromises=function(t,e){for(var n=1;t>n;n++){var r=this._rejectionHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n);this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}},r.prototype._settlePromises=function(){var t=this._bitField,e=65535&t;if(e>0){if(0!==(16842752&t)){var n=this._fulfillmentHandler0;this._settlePromise0(this._rejectionHandler0,n,t),this._rejectPromises(e,n)}else{var r=this._rejectionHandler0;this._settlePromise0(this._fulfillmentHandler0,r,t),this._fulfillPromises(e,r)}this._setLength(0)}this._clearCancellationData()},r.prototype._settledValue=function(){var t=this._bitField;return 0!==(33554432&t)?this._rejectionHandler0:0!==(16777216&t)?this._fulfillmentHandler0:void 0},r.defer=r.pending=function(){F.deprecated("Promise.defer","new Promise");var t=new r(m);return{promise:t,resolve:i,reject:o}},h.notEnumerableProp(r,"_makeSelfResolutionError",c),t("./method")(r,m,C,u,F),t("./bind")(r,m,C,F),t("./cancel")(r,j,u,F),t("./direct_resolve")(r),t("./synchronous_inspection")(r),t("./join")(r,j,C,m,F),r.Promise=r,t("./map.js")(r,j,u,C,m,F),t("./using.js")(r,u,C,E,m,F),t("./timers.js")(r,m,F),t("./generators.js")(r,u,m,C,e,F),t("./nodeify.js")(r),t("./call_get.js")(r),t("./props.js")(r,j,C,u),t("./race.js")(r,m,C,u),t("./reduce.js")(r,j,u,C,m,F),t("./settle.js")(r,j,F),t("./some.js")(r,j,u),t("./promisify.js")(r,m),t("./any.js")(r),t("./each.js")(r,m),t("./filter.js")(r,m),h.toFastProperties(r),h.toFastProperties(r.prototype),s({a:1}),s({b:2}),s({c:3}),s(1),s(function(){}),s(void 0),s(!1),s(new r(m)),F.setBounds(_.firstLineError,h.lastLineError),r}},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){function s(t){switch(t){case-2:return[];case-3:return{}}}function a(t){var r=this._promise=new e(n);t instanceof e&&r._propagateFrom(t,3),r._setOnCancel(this),this._values=t,this._length=0,this._totalResolved=0,this._init(void 0,-2)}var c=t("./util");c.isArray;return c.inherits(a,o),a.prototype.length=function(){return this._length},a.prototype.promise=function(){return this._promise},a.prototype._init=function l(t,n){var o=r(this._values,this._promise);if(o instanceof e){o=o._target();var a=o._bitField;if(this._values=o,0===(50397184&a))return this._promise._setAsyncGuaranteed(),o._then(l,this._reject,void 0,this,n);if(0===(33554432&a))return 0!==(16777216&a)?this._reject(o._reason()):this._cancel();o=o._value()}if(o=c.asArray(o),null===o){var u=i("expecting an array or an iterable object but got "+c.classString(o)).reason();return void this._promise._rejectCallback(u,!1)}return 0===o.length?void(-5===n?this._resolveEmptyArray():this._resolve(s(n))):void this._iterate(o)},a.prototype._iterate=function(t){var n=this.getActualLength(t.length);this._length=n,this._values=this.shouldCopyValues()?new Array(n):this._values;for(var i=this._promise,o=!1,s=null,a=0;n>a;++a){var c=r(t[a],i);c instanceof e?(c=c._target(),s=c._bitField):s=null,o?null!==s&&c.suppressUnhandledRejections():null!==s?0===(50397184&s)?(c._proxy(this,a),this._values[a]=c):o=0!==(33554432&s)?this._promiseFulfilled(c._value(),a):0!==(16777216&s)?this._promiseRejected(c._reason(),a):this._promiseCancelled(a):o=this._promiseFulfilled(c,a)}o||i._setAsyncGuaranteed()},a.prototype._isResolved=function(){return null===this._values},a.prototype._resolve=function(t){this._values=null,this._promise._fulfill(t)},a.prototype._cancel=function(){!this._isResolved()&&this._promise.isCancellable()&&(this._values=null,this._promise._cancel())},a.prototype._reject=function(t){this._values=null,this._promise._rejectCallback(t,!1)},a.prototype._promiseFulfilled=function(t,e){this._values[e]=t;var n=++this._totalResolved;return n>=this._length?(this._resolve(this._values),!0):!1},a.prototype._promiseCancelled=function(){return this._cancel(),!0},a.prototype._promiseRejected=function(t){return this._totalResolved++,this._reject(t),!0},a.prototype._resultCancelled=function(){if(!this._isResolved()){var t=this._values;if(this._cancel(),t instanceof e)t.cancel();else for(var n=0;n<t.length;++n)t[n]instanceof e&&t[n].cancel()}},a.prototype.shouldCopyValues=function(){return!0},a.prototype.getActualLength=function(t){return t},a}},{"./util":36}],24:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t){return!C.test(t)}function i(t){try{return t.__isPromisified__===!0}catch(e){return!1}}function o(t,e,n){var r=f.getDataPropertyOrDefault(t,e+n,b);return r?i(r):!1}function s(t,e,n){for(var r=0;r<t.length;r+=2){var i=t[r];if(n.test(i))for(var o=i.replace(n,""),s=0;s<t.length;s+=2)if(t[s]===o)throw new g("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",e))}}function a(t,e,n,r){for(var a=f.inheritedDataKeys(t),c=[],l=0;l<a.length;++l){var u=a[l],p=t[u],h=r===j?!0:j(u,p,t);"function"!=typeof p||i(p)||o(t,u,e)||!r(u,p,t,h)||c.push(u,p)}return s(c,e,n),c}function c(t,r,i,o,s,a){function c(){var i=r;r===h&&(i=this);var o=new e(n);o._captureStackTrace();var s="string"==typeof u&&this!==l?this[u]:t,c=_(o,a);try{s.apply(i,d(arguments,c))}catch(p){o._rejectCallback(v(p),!0,!0)}return o._isFateSealed()||o._setAsyncGuaranteed(),o}var l=function(){return this}(),u=t;return"string"==typeof u&&(t=o),f.notEnumerableProp(c,"__isPromisified__",!0),c}function l(t,e,n,r,i){for(var o=new RegExp(k(e)+"$"),s=a(t,e,o,n),c=0,l=s.length;l>c;c+=2){var u=s[c],p=s[c+1],_=u+e;if(r===E)t[_]=E(u,h,u,p,e,i);else{var d=r(p,function(){return E(u,h,u,p,e,i)});f.notEnumerableProp(d,"__isPromisified__",!0),t[_]=d}}return f.toFastProperties(t),t}function u(t,e,n){return E(t,e,void 0,t,null,n)}var p,h={},f=t("./util"),_=t("./nodeback"),d=f.withAppended,v=f.maybeWrapAsError,y=f.canEvaluate,g=t("./errors").TypeError,m="Async",b={__isPromisified__:!0},w=["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"],C=new RegExp("^(?:"+w.join("|")+")$"),j=function(t){return f.isIdentifier(t)&&"_"!==t.charAt(0)&&"constructor"!==t},k=function(t){return t.replace(/([$])/,"\\$")},E=y?p:c;e.promisify=function(t,e){if("function"!=typeof t)throw new g("expecting a function but got "+f.classString(t));if(i(t))return t;e=Object(e);var n=void 0===e.context?h:e.context,o=!!e.multiArgs,s=u(t,n,o);return f.copyDescriptors(t,s,r),s},e.promisifyAll=function(t,e){if("function"!=typeof t&&"object"!=typeof t)throw new g("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");e=Object(e);var n=!!e.multiArgs,r=e.suffix;"string"!=typeof r&&(r=m);var i=e.filter;"function"!=typeof i&&(i=j);var o=e.promisifier;if("function"!=typeof o&&(o=E),!f.isIdentifier(r))throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");for(var s=f.inheritedDataKeys(t),a=0;a<s.length;++a){var c=t[s[a]];"constructor"!==s[a]&&f.isClass(c)&&(l(c.prototype,r,i,o,n),l(c,r,i,o,n))}return l(t,r,i,o,n)}}},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){function o(t){var e,n=!1;if(void 0!==a&&t instanceof a)e=p(t),n=!0;else{var r=u.keys(t),i=r.length;e=new Array(2*i);for(var o=0;i>o;++o){var s=r[o];e[o]=t[s],e[o+i]=s}}this.constructor$(e),this._isMap=n,this._init$(void 0,-3)}function s(t){var n,s=r(t);return l(s)?(n=s instanceof e?s._then(e.props,void 0,void 0,void 0,void 0):new o(s).promise(),s instanceof e&&n._propagateFrom(s,2),n):i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")}var a,c=t("./util"),l=c.isObject,u=t("./es5");"function"==typeof Map&&(a=Map);var p=function(){function t(t,r){this[e]=t,this[e+n]=r,e++}var e=0,n=0;return function(r){n=r.size,e=0;var i=new Array(2*r.size);return r.forEach(t,i),i}}(),h=function(t){for(var e=new a,n=t.length/2|0,r=0;n>r;++r){var i=t[n+r],o=t[r];e.set(i,o)}return e};c.inherits(o,n),o.prototype._init=function(){},o.prototype._promiseFulfilled=function(t,e){this._values[e]=t;var n=++this._totalResolved;if(n>=this._length){var r;if(this._isMap)r=h(this._values);else{r={};for(var i=this.length(),o=0,s=this.length();s>o;++o)r[this._values[o+i]]=this._values[o]}return this._resolve(r),!0}return!1},o.prototype.shouldCopyValues=function(){return!1},o.prototype.getActualLength=function(t){return t>>1},e.prototype.props=function(){return s(this)},e.props=function(t){return s(t)}}},{"./es5":13,"./util":36}],26:[function(t,e,n){"use strict";function r(t,e,n,r,i){for(var o=0;i>o;++o)n[o+r]=t[o+e],t[o+e]=void 0}function i(t){this._capacity=t,this._length=0,this._front=0}i.prototype._willBeOverCapacity=function(t){return this._capacity<t},i.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1);var n=this._front+e&this._capacity-1;this[n]=t,this._length=e+1},i.prototype._unshiftOne=function(t){var e=this._capacity;this._checkCapacity(this.length()+1);var n=this._front,r=(n-1&e-1^e)-e;this[r]=t,this._front=r,this._length=this.length()+1},i.prototype.unshift=function(t,e,n){this._unshiftOne(n),this._unshiftOne(e),this._unshiftOne(t)},i.prototype.push=function(t,e,n){var r=this.length()+3;if(this._willBeOverCapacity(r))return this._pushOne(t),this._pushOne(e),void this._pushOne(n);var i=this._front+r-3;this._checkCapacity(r);var o=this._capacity-1;this[i+0&o]=t,this[i+1&o]=e,this[i+2&o]=n,this._length=r},i.prototype.shift=function(){var t=this._front,e=this[t];return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e},i.prototype.length=function(){return this._length},i.prototype._checkCapacity=function(t){this._capacity<t&&this._resizeTo(this._capacity<<1)},i.prototype._resizeTo=function(t){var e=this._capacity;this._capacity=t;var n=this._front,i=this._length,o=n+i&e-1;r(this,0,this,e,o)},e.exports=i},{}],27:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){function o(t,o){var c=r(t);if(c instanceof e)return a(c);if(t=s.asArray(t),null===t)return i("expecting an array or an iterable object but got "+s.classString(t));var l=new e(n);void 0!==o&&l._propagateFrom(o,3);for(var u=l._fulfill,p=l._reject,h=0,f=t.length;f>h;++h){var _=t[h];(void 0!==_||h in t)&&e.cast(_)._then(u,p,void 0,l,null)}return l}var s=t("./util"),a=function(t){return t.then(function(e){return o(e,t)})};e.race=function(t){return o(t,void 0)},e.prototype.race=function(){return o(this,void 0)}}},{"./util":36}],28:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,n,r,i){this.constructor$(t);var s=h();this._fn=null===s?n:s.bind(n),void 0!==r&&(r=e.resolve(r),r._attachCancellationCallback(this)),this._initialValue=r,this._currentCancellable=null,this._eachValues=i===o?[]:void 0,this._promise._captureStackTrace(),this._init$(void 0,-5)}function c(t,e){this.isFulfilled()?e._resolve(t):e._reject(t)}function l(t,e,n,i){if("function"!=typeof e)return r("expecting a function but got "+f.classString(e));var o=new a(t,e,n,i);return o.promise()}function u(t){this.accum=t,this.array._gotAccum(t);var n=i(this.value,this.array._promise);return n instanceof e?(this.array._currentCancellable=n,n._then(p,void 0,void 0,this,void 0)):p.call(this,n)}function p(t){var n=this.array,r=n._promise,i=_(n._fn);r._pushContext();var o;o=void 0!==n._eachValues?i.call(r._boundValue(),t,this.index,this.length):i.call(r._boundValue(),this.accum,t,this.index,this.length),o instanceof e&&(n._currentCancellable=o);var a=r._popContext();return s.checkForgottenReturns(o,a,void 0!==n._eachValues?"Promise.each":"Promise.reduce",r),o}var h=e._getDomain,f=t("./util"),_=f.tryCatch;f.inherits(a,n),a.prototype._gotAccum=function(t){void 0!==this._eachValues&&t!==o&&this._eachValues.push(t)},a.prototype._eachComplete=function(t){return this._eachValues.push(t),this._eachValues},a.prototype._init=function(){},a.prototype._resolveEmptyArray=function(){this._resolve(void 0!==this._eachValues?this._eachValues:this._initialValue)},a.prototype.shouldCopyValues=function(){return!1},a.prototype._resolve=function(t){this._promise._resolveCallback(t),this._values=null},a.prototype._resultCancelled=function(t){return t===this._initialValue?this._cancel():void(this._isResolved()||(this._resultCancelled$(),this._currentCancellable instanceof e&&this._currentCancellable.cancel(),this._initialValue instanceof e&&this._initialValue.cancel()))},a.prototype._iterate=function(t){this._values=t;var n,r,i=t.length;if(void 0!==this._initialValue?(n=this._initialValue,r=0):(n=e.resolve(t[0]),r=1),this._currentCancellable=n,!n.isRejected())for(;i>r;++r){var o={accum:null,value:t[r],index:r,length:i,array:this};n=n._then(u,void 0,void 0,o,void 0)}void 0!==this._eachValues&&(n=n._then(this._eachComplete,void 0,void 0,this,void 0)),n._then(c,c,void 0,n,this)},e.prototype.reduce=function(t,e){return l(this,t,e,null)},e.reduce=function(t,e,n,r){return l(t,e,n,r)}}},{"./util":36}],29:[function(t,e,n){"use strict";var r,i=t("./util"),o=function(){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")};if(i.isNode&&"undefined"==typeof MutationObserver){var s=global.setImmediate,a=process.nextTick;r=i.isRecentNode?function(t){s.call(global,t)}:function(t){a.call(process,t)}}else r="undefined"==typeof MutationObserver||"undefined"!=typeof window&&window.navigator&&window.navigator.standalone?"undefined"!=typeof setImmediate?function(t){setImmediate(t)}:"undefined"!=typeof setTimeout?function(t){setTimeout(t,0)}:o:function(){var t=document.createElement("div"),e={attributes:!0},n=!1,r=document.createElement("div"),i=new MutationObserver(function(){t.classList.toggle("foo"),n=!1});i.observe(r,e);var o=function(){n||(n=!0,r.classList.toggle("foo"))};return function(n){var r=new MutationObserver(function(){r.disconnect(),n()});r.observe(t,e),o()}}();e.exports=r},{"./util":36}],30:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.constructor$(t)}var o=e.PromiseInspection,s=t("./util");s.inherits(i,n),i.prototype._promiseResolved=function(t,e){this._values[t]=e;var n=++this._totalResolved;return n>=this._length?(this._resolve(this._values),!0):!1},i.prototype._promiseFulfilled=function(t,e){var n=new o;return n._bitField=33554432,n._settledValueField=t,this._promiseResolved(e,n)},i.prototype._promiseRejected=function(t,e){var n=new o;return n._bitField=16777216,n._settledValueField=t,this._promiseResolved(e,n)},e.settle=function(t){return r.deprecated(".settle()",".reflect()"),new i(t).promise()},e.prototype.settle=function(){return e.settle(this)}}},{"./util":36}],31:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.constructor$(t),this._howMany=0,this._unwrap=!1,this._initialized=!1}function o(t,e){if((0|e)!==e||0>e)return r("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");var n=new i(t),o=n.promise();return n.setHowMany(e),n.init(),o}var s=t("./util"),a=t("./errors").RangeError,c=t("./errors").AggregateError,l=s.isArray,u={};s.inherits(i,n),i.prototype._init=function(){if(this._initialized){if(0===this._howMany)return void this._resolve([]);this._init$(void 0,-5);var t=l(this._values);!this._isResolved()&&t&&this._howMany>this._canPossiblyFulfill()&&this._reject(this._getRangeError(this.length()))}},i.prototype.init=function(){this._initialized=!0,this._init()},i.prototype.setUnwrap=function(){this._unwrap=!0},i.prototype.howMany=function(){return this._howMany},i.prototype.setHowMany=function(t){this._howMany=t},i.prototype._promiseFulfilled=function(t){return this._addFulfilled(t),this._fulfilled()===this.howMany()?(this._values.length=this.howMany(),1===this.howMany()&&this._unwrap?this._resolve(this._values[0]):this._resolve(this._values),!0):!1},i.prototype._promiseRejected=function(t){return this._addRejected(t),this._checkOutcome()},i.prototype._promiseCancelled=function(){return this._values instanceof e||null==this._values?this._cancel():(this._addRejected(u),this._checkOutcome())},i.prototype._checkOutcome=function(){if(this.howMany()>this._canPossiblyFulfill()){for(var t=new c,e=this.length();e<this._values.length;++e)this._values[e]!==u&&t.push(this._values[e]);return t.length>0?this._reject(t):this._cancel(),!0}return!1},i.prototype._fulfilled=function(){return this._totalResolved},i.prototype._rejected=function(){return this._values.length-this.length()},i.prototype._addRejected=function(t){this._values.push(t)},i.prototype._addFulfilled=function(t){this._values[this._totalResolved++]=t},i.prototype._canPossiblyFulfill=function(){return this.length()-this._rejected()},i.prototype._getRangeError=function(t){var e="Input array must contain at least "+this._howMany+" items but contains only "+t+" items";return new a(e)},i.prototype._resolveEmptyArray=function(){this._reject(this._getRangeError(0))},e.some=function(t,e){return o(t,e)},e.prototype.some=function(t){return o(this,t)},e._SomePromiseArray=i}},{"./errors":12,"./util":36}],32:[function(t,e,n){"use strict";e.exports=function(t){function e(t){void 0!==t?(t=t._target(),
this._bitField=t._bitField,this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,this._settledValueField=void 0)}e.prototype._settledValue=function(){return this._settledValueField};var n=e.prototype.value=function(){if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},r=e.prototype.error=e.prototype.reason=function(){if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},i=e.prototype.isFulfilled=function(){return 0!==(33554432&this._bitField)},o=e.prototype.isRejected=function(){return 0!==(16777216&this._bitField)},s=e.prototype.isPending=function(){return 0===(50397184&this._bitField)},a=e.prototype.isResolved=function(){return 0!==(50331648&this._bitField)};e.prototype.isCancelled=t.prototype._isCancelled=function(){return 65536===(65536&this._bitField)},t.prototype.isCancelled=function(){return this._target()._isCancelled()},t.prototype.isPending=function(){return s.call(this._target())},t.prototype.isRejected=function(){return o.call(this._target())},t.prototype.isFulfilled=function(){return i.call(this._target())},t.prototype.isResolved=function(){return a.call(this._target())},t.prototype.value=function(){return n.call(this._target())},t.prototype.reason=function(){var t=this._target();return t._unsetRejectionIsUnhandled(),r.call(t)},t.prototype._value=function(){return this._settledValue()},t.prototype._reason=function(){return this._unsetRejectionIsUnhandled(),this._settledValue()},t.PromiseInspection=e}},{}],33:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,r){if(u(t)){if(t instanceof e)return t;var i=o(t);if(i===l){r&&r._pushContext();var c=e.reject(i.e);return r&&r._popContext(),c}if("function"==typeof i){if(s(t)){var c=new e(n);return t._then(c._fulfill,c._reject,void 0,c,null),c}return a(t,i,r)}}return t}function i(t){return t.then}function o(t){try{return i(t)}catch(e){return l.e=e,l}}function s(t){return p.call(t,"_promise0")}function a(t,r,i){function o(t){a&&(a._resolveCallback(t),a=null)}function s(t){a&&(a._rejectCallback(t,p,!0),a=null)}var a=new e(n),u=a;i&&i._pushContext(),a._captureStackTrace(),i&&i._popContext();var p=!0,h=c.tryCatch(r).call(t,o,s);return p=!1,a&&h===l&&(a._rejectCallback(h.e,!0,!0),a=null),u}var c=t("./util"),l=c.errorObj,u=c.isObject,p={}.hasOwnProperty;return r}},{"./util":36}],34:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.handle=t}function o(t){return clearTimeout(this.handle),t}function s(t){throw clearTimeout(this.handle),t}var a=t("./util"),c=e.TimeoutError;i.prototype._resultCancelled=function(){clearTimeout(this.handle)};var l=function(t){return u(+this).thenReturn(t)},u=e.delay=function(t,o){var s,a;return void 0!==o?(s=e.resolve(o)._then(l,null,null,t,void 0),r.cancellation()&&o instanceof e&&s._setOnCancel(o)):(s=new e(n),a=setTimeout(function(){s._fulfill()},+t),r.cancellation()&&s._setOnCancel(new i(a))),s._setAsyncGuaranteed(),s};e.prototype.delay=function(t){return u(t,this)};var p=function(t,e,n){var r;r="string"!=typeof e?e instanceof Error?e:new c("operation timed out"):new c(e),a.markAsOriginatingFromRejection(r),t._attachExtraTrace(r),t._reject(r),null!=n&&n.cancel()};e.prototype.timeout=function(t,e){t=+t;var n,a,c=new i(setTimeout(function(){n.isPending()&&p(n,e,a)},t));return r.cancellation()?(a=this.then(),n=a._then(o,s,void 0,c,void 0),n._setOnCancel(c)):n=this._then(o,s,void 0,c,void 0),n}}},{"./util":36}],35:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t){setTimeout(function(){throw t},0)}function c(t){var e=r(t);return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),e}function l(t,n){function i(){if(s>=l)return u._fulfill();var o=c(t[s++]);if(o instanceof e&&o._isDisposable()){try{o=r(o._getDisposer().tryDispose(n),t.promise)}catch(p){return a(p)}if(o instanceof e)return o._then(i,a,null,null,null)}i()}var s=0,l=t.length,u=new e(o);return i(),u}function u(t,e,n){this._data=t,this._promise=e,this._context=n}function p(t,e,n){this.constructor$(t,e,n)}function h(t){return u.isDisposer(t)?(this.resources[this.index]._setDisposable(t),t.promise()):t}function f(t){this.length=t,this.promise=null,this[t-1]=null}var _=t("./util"),d=t("./errors").TypeError,v=t("./util").inherits,y=_.errorObj,g=_.tryCatch;u.prototype.data=function(){return this._data},u.prototype.promise=function(){return this._promise},u.prototype.resource=function(){return this.promise().isFulfilled()?this.promise().value():null},u.prototype.tryDispose=function(t){var e=this.resource(),n=this._context;void 0!==n&&n._pushContext();var r=null!==e?this.doDispose(e,t):null;return void 0!==n&&n._popContext(),this._promise._unsetDisposable(),this._data=null,r},u.isDisposer=function(t){return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},v(p,u),p.prototype.doDispose=function(t,e){var n=this.data();return n.call(t,t,e)},f.prototype._resultCancelled=function(){for(var t=this.length,n=0;t>n;++n){var r=this[n];r instanceof e&&r.cancel()}},e.using=function(){var t=arguments.length;if(2>t)return n("you must pass at least 2 arguments to Promise.using");var i=arguments[t-1];if("function"!=typeof i)return n("expecting a function but got "+_.classString(i));var o,a=!0;2===t&&Array.isArray(arguments[0])?(o=arguments[0],t=o.length,a=!1):(o=arguments,t--);for(var c=new f(t),p=0;t>p;++p){var d=o[p];if(u.isDisposer(d)){var v=d;d=d.promise(),d._setDisposable(v)}else{var m=r(d);m instanceof e&&(d=m._then(h,null,null,{resources:c,index:p},void 0))}c[p]=d}for(var b=new Array(c.length),p=0;p<b.length;++p)b[p]=e.resolve(c[p]).reflect();var w=e.all(b).then(function(t){for(var e=0;e<t.length;++e){var n=t[e];if(n.isRejected())return y.e=n.error(),y;if(!n.isFulfilled())return void w.cancel();t[e]=n.value()}C._pushContext(),i=g(i);var r=a?i.apply(void 0,t):i(t),o=C._popContext();return s.checkForgottenReturns(r,o,"Promise.using",C),r}),C=w.lastly(function(){var t=new e.PromiseInspection(w);return l(c,t)});return c.promise=C,C._setOnCancel(c),C},e.prototype._setDisposable=function(t){this._bitField=131072|this._bitField,this._disposer=t},e.prototype._isDisposable=function(){return(131072&this._bitField)>0},e.prototype._getDisposer=function(){return this._disposer},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,this._disposer=void 0},e.prototype.disposer=function(t){if("function"==typeof t)return new p(t,this,i());throw new d}}},{"./errors":12,"./util":36}],36:[function(t,e,n){"use strict";function r(){try{var t=x;return x=null,t.apply(this,arguments)}catch(e){return F.e=e,F}}function i(t){return x=t,r}function o(t){return null==t||t===!0||t===!1||"string"==typeof t||"number"==typeof t}function s(t){return"function"==typeof t||"object"==typeof t&&null!==t}function a(t){return o(t)?new Error(v(t)):t}function c(t,e){var n,r=t.length,i=new Array(r+1);for(n=0;r>n;++n)i[n]=t[n];return i[n]=e,i}function l(t,e,n){if(!k.isES5)return{}.hasOwnProperty.call(t,e)?t[e]:void 0;var r=Object.getOwnPropertyDescriptor(t,e);return null!=r?null==r.get&&null==r.set?r.value:n:void 0}function u(t,e,n){if(o(t))return t;var r={value:n,configurable:!0,enumerable:!1,writable:!0};return k.defineProperty(t,e,r),t}function p(t){throw t}function h(t){try{if("function"==typeof t){var e=k.names(t.prototype),n=k.isES5&&e.length>1,r=e.length>0&&!(1===e.length&&"constructor"===e[0]),i=O.test(t+"")&&k.names(t).length>0;if(n||r||i)return!0}return!1}catch(o){return!1}}function f(t){function e(){}e.prototype=t;for(var n=8;n--;)new e;return t}function _(t){return S.test(t)}function d(t,e,n){for(var r=new Array(t),i=0;t>i;++i)r[i]=e+i+n;return r}function v(t){try{return t+""}catch(e){return"[no string representation]"}}function y(t){return null!==t&&"object"==typeof t&&"string"==typeof t.message&&"string"==typeof t.name}function g(t){try{u(t,"isOperational",!0)}catch(e){}}function m(t){return null==t?!1:t instanceof Error.__BluebirdErrorTypes__.OperationalError||t.isOperational===!0}function b(t){return y(t)&&k.propertyIsWritable(t,"stack")}function w(t){return{}.toString.call(t)}function C(t,e,n){for(var r=k.names(t),i=0;i<r.length;++i){var o=r[i];if(n(o))try{k.defineProperty(e,o,k.getDescriptor(t,o))}catch(s){}}}function j(t,e){return I?process.env[t]:e}var k=t("./es5"),E="undefined"==typeof navigator,F={e:{}},x,T="undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0!==this?this:null,R=function(t,e){function n(){this.constructor=t,this.constructor$=e;for(var n in e.prototype)r.call(e.prototype,n)&&"$"!==n.charAt(n.length-1)&&(this[n+"$"]=e.prototype[n])}var r={}.hasOwnProperty;return n.prototype=e.prototype,t.prototype=new n,t.prototype},P=function(){var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){for(var n=0;n<t.length;++n)if(t[n]===e)return!0;return!1};if(k.isES5){var n=Object.getOwnPropertyNames;return function(t){for(var r=[],i=Object.create(null);null!=t&&!e(t);){var o;try{o=n(t)}catch(s){return r}for(var a=0;a<o.length;++a){var c=o[a];if(!i[c]){i[c]=!0;var l=Object.getOwnPropertyDescriptor(t,c);null!=l&&null==l.get&&null==l.set&&r.push(c)}}t=k.getPrototypeOf(t)}return r}}var r={}.hasOwnProperty;return function(n){if(e(n))return[];var i=[];t:for(var o in n)if(r.call(n,o))i.push(o);else{for(var s=0;s<t.length;++s)if(r.call(t[s],o))continue t;i.push(o)}return i}}(),O=/this\s*\.\s*\S+\s*=/,S=/^[a-z$_][a-z$_0-9]*$/i,A=function(){return"stack"in new Error?function(t){return b(t)?t:new Error(v(t))}:function(t){if(b(t))return t;try{throw new Error(v(t))}catch(e){return e}}}(),D=function(t){return k.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){var V="function"==typeof Array.from?function(t){return Array.from(t)}:function(t){for(var e,n=[],r=t[Symbol.iterator]();!(e=r.next()).done;)n.push(e.value);return n};D=function(t){return k.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?V(t):null}}var I="undefined"!=typeof process&&"[object process]"===w(process).toLowerCase(),L={isClass:h,isIdentifier:_,inheritedDataKeys:P,getDataPropertyOrDefault:l,thrower:p,isArray:k.isArray,asArray:D,notEnumerableProp:u,isPrimitive:o,isObject:s,isError:y,canEvaluate:E,errorObj:F,tryCatch:i,inherits:R,withAppended:c,maybeWrapAsError:a,toFastProperties:f,filledRange:d,toString:v,canAttachTrace:b,ensureErrorObject:A,originatesFromRejection:m,markAsOriginatingFromRejection:g,classString:w,copyDescriptors:C,hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,isNode:I,env:j,global:T};L.isRecentNode=L.isNode&&function(){var t=process.versions.node.split(".").map(Number);return 0===t[0]&&t[1]>10||t[0]>0}(),L.isNode&&L.toFastProperties(process);try{throw new Error}catch(H){L.lastLineError=H}e.exports=L},{"./es5":13}]},{},[4])(4)}),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise);
/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/*!
 * VERSION: 1.18.0
 * DATE: 2015-09-05
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : undefined || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";
        _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (t, e, i) {
                var s = function s(t) {
                        var e,
                            i = [],
                            s = t.length;
                        for (e = 0; e !== s; i.push(t[e++])) {}
                        return i;
                    },
                    r = function r(t, e, i) {
                        var s,
                            r,
                            n = t.cycle;
                        for (s in n) {
                            r = n[s], t[s] = "function" == typeof r ? r.call(e[i], i) : r[i % r.length];
                        }
                        delete t.cycle;
                    },
                    n = function n(t, e, s) {
                        i.call(this, t, e, s), this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._dirty = !0, this.render = n.prototype.render;
                    },
                    a = 1e-10,
                    o = i._internals,
                    l = o.isSelector,
                    h = o.isArray,
                    _ = n.prototype = i.to({}, .1, {}),
                    u = [];
                n.version = "1.18.0", _.constructor = n, _.kill()._gc = !1, n.killTweensOf = n.killDelayedCallsTo = i.killTweensOf, n.getTweensOf = i.getTweensOf, n.lagSmoothing = i.lagSmoothing, n.ticker = i.ticker, n.render = i.render, _.invalidate = function () {
                    return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), i.prototype.invalidate.call(this);
                }, _.updateTo = function (t, e) {
                    var s,
                        r = this.ratio,
                        n = this.vars.immediateRender || t.immediateRender;
                    e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
                    for (s in t) {
                        this.vars[s] = t[s];
                    }
                    if (this._initted || n)
                        if (e) this._initted = !1, n && this.render(0, !0, !0);
                        else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
                        var a = this._time;
                        this.render(0, !0, !1), this._initted = !1, this.render(a, !0, !1);
                    } else if (this._time > 0 || n) {
                        this._initted = !1, this._init();
                        for (var o, l = 1 / (1 - r), h = this._firstPT; h;) {
                            o = h.s + h.c, h.c *= l, h.s = o - h.c, h = h._next;
                        }
                    }
                    return this;
                }, _.render = function (t, e, i) {
                    this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
                    var s,
                        r,
                        n,
                        l,
                        h,
                        _,
                        u,
                        c,
                        f = this._dirty ? this.totalDuration() : this._totalDuration,
                        p = this._time,
                        m = this._totalTime,
                        d = this._cycle,
                        g = this._duration,
                        v = this._rawPrevTime;
                    if (t >= f ? (this._totalTime = f, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = g, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === g && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > v || v === a) && v !== t && (i = !0, v > a && (r = "onReverseComplete")), this._rawPrevTime = c = !e || t || v === t ? t : a)) : 1e-7 > t ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== m || 0 === g && v > 0) && (r = "onReverseComplete", s = this._reversed), 0 > t && (this._active = !1, 0 === g && (this._initted || !this.vars.lazy || i) && (v >= 0 && (i = !0), this._rawPrevTime = c = !e || t || v === t ? t : a)), this._initted || (i = !0)) : (this._totalTime = this._time = t, 0 !== this._repeat && (l = g + this._repeatDelay, this._cycle = this._totalTime / l >> 0, 0 !== this._cycle && this._cycle === this._totalTime / l && this._cycle--, this._time = this._totalTime - this._cycle * l, this._yoyo && 0 !== (1 & this._cycle) && (this._time = g - this._time), this._time > g ? this._time = g : 0 > this._time && (this._time = 0)), this._easeType ? (h = this._time / g, _ = this._easeType, u = this._easePower, (1 === _ || 3 === _ && h >= .5) && (h = 1 - h), 3 === _ && (h *= 2), 1 === u ? h *= h : 2 === u ? h *= h * h : 3 === u ? h *= h * h * h : 4 === u && (h *= h * h * h * h), this.ratio = 1 === _ ? 1 - h : 2 === _ ? h : .5 > this._time / g ? h / 2 : 1 - h / 2) : this.ratio = this._ease.getRatio(this._time / g)), p === this._time && !i && d === this._cycle) return m !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")), void 0;
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = p, this._totalTime = m, this._rawPrevTime = v, this._cycle = d, o.lazyTweens.push(this), this._lazy = [t, e], void 0;
                        this._time && !s ? this.ratio = this._ease.getRatio(this._time / g) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== p && t >= 0 && (this._active = !0), 0 === m && (2 === this._initted && t > 0 && this._init(), this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === g) && (e || this._callback("onStart"))), n = this._firstPT; n;) {
                        n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
                    }
                    this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._totalTime !== m || s) && this._callback("onUpdate")), this._cycle !== d && (e || this._gc || this.vars.onRepeat && this._callback("onRepeat")), r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === g && this._rawPrevTime === a && c !== a && (this._rawPrevTime = 0));
                }, n.to = function (t, e, i) {
                    return new n(t, e, i);
                }, n.from = function (t, e, i) {
                    return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new n(t, e, i);
                }, n.fromTo = function (t, e, i, s) {
                    return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new n(t, e, s);
                }, n.staggerTo = n.allTo = function (t, e, a, o, _, c, f) {
                    o = o || 0;
                    var p,
                        m,
                        d,
                        g,
                        v = a.delay || 0,
                        y = [],
                        T = function T() {
                            a.onComplete && a.onComplete.apply(a.onCompleteScope || this, arguments), _.apply(f || a.callbackScope || this, c || u);
                        },
                        x = a.cycle,
                        w = a.startAt && a.startAt.cycle;
                    for (h(t) || ("string" == typeof t && (t = i.selector(t) || t), l(t) && (t = s(t))), t = t || [], 0 > o && (t = s(t), t.reverse(), o *= -1), p = t.length - 1, d = 0; p >= d; d++) {
                        m = {};
                        for (g in a) {
                            m[g] = a[g];
                        }
                        if (x && r(m, t, d), w) {
                            w = m.startAt = {};
                            for (g in a.startAt) {
                                w[g] = a.startAt[g];
                            }
                            r(m.startAt, t, d);
                        }
                        m.delay = v, d === p && _ && (m.onComplete = T), y[d] = new n(t[d], e, m), v += o;
                    }
                    return y;
                }, n.staggerFrom = n.allFrom = function (t, e, i, s, r, a, o) {
                    return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, n.staggerTo(t, e, i, s, r, a, o);
                }, n.staggerFromTo = n.allFromTo = function (t, e, i, s, r, a, o, l) {
                    return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, n.staggerTo(t, e, s, r, a, o, l);
                }, n.delayedCall = function (t, e, i, s, r) {
                    return new n(e, 0, {
                        delay: t,
                        onComplete: e,
                        onCompleteParams: i,
                        callbackScope: s,
                        onReverseComplete: e,
                        onReverseCompleteParams: i,
                        immediateRender: !1,
                        useFrames: r,
                        overwrite: 0
                    });
                }, n.set = function (t, e) {
                    return new n(t, 0, e);
                }, n.isTweening = function (t) {
                    return i.getTweensOf(t, !0).length > 0;
                };
                var c = function c(t, e) {
                        for (var s = [], r = 0, n = t._first; n;) {
                            n instanceof i ? s[r++] = n : (e && (s[r++] = n), s = s.concat(c(n, e)), r = s.length), n = n._next;
                        }
                        return s;
                    },
                    f = n.getAllTweens = function (e) {
                        return c(t._rootTimeline, e).concat(c(t._rootFramesTimeline, e));
                    };
                n.killAll = function (t, i, s, r) {
                    null == i && (i = !0), null == s && (s = !0);
                    var n,
                        a,
                        o,
                        l = f(0 != r),
                        h = l.length,
                        _ = i && s && r;
                    for (o = 0; h > o; o++) {
                        a = l[o], (_ || a instanceof e || (n = a.target === a.vars.onComplete) && s || i && !n) && (t ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1));
                    }
                }, n.killChildTweensOf = function (t, e) {
                    if (null != t) {
                        var r,
                            a,
                            _,
                            u,
                            c,
                            f = o.tweenLookup;
                        if ("string" == typeof t && (t = i.selector(t) || t), l(t) && (t = s(t)), h(t))
                            for (u = t.length; --u > -1;) {
                                n.killChildTweensOf(t[u], e);
                            } else {
                                r = [];
                                for (_ in f) {
                                    for (a = f[_].target.parentNode; a;) {
                                        a === t && (r = r.concat(f[_].tweens)), a = a.parentNode;
                                    }
                                }
                                for (c = r.length, u = 0; c > u; u++) {
                                    e && r[u].totalTime(r[u].totalDuration()), r[u]._enabled(!1, !1);
                                }
                            }
                    }
                };
                var p = function p(t, i, s, r) {
                    i = i !== !1, s = s !== !1, r = r !== !1;
                    for (var n, a, o = f(r), l = i && s && r, h = o.length; --h > -1;) {
                        a = o[h], (l || a instanceof e || (n = a.target === a.vars.onComplete) && s || i && !n) && a.paused(t);
                    }
                };
                return n.pauseAll = function (t, e, i) {
                    p(!0, t, e, i);
                }, n.resumeAll = function (t, e, i) {
                    p(!1, t, e, i);
                }, n.globalTimeScale = function (e) {
                    var s = t._rootTimeline,
                        r = i.ticker.time;
                    return arguments.length ? (e = e || a, s._startTime = r - (r - s._startTime) * s._timeScale / e, s = t._rootFramesTimeline, r = i.ticker.frame, s._startTime = r - (r - s._startTime) * s._timeScale / e, s._timeScale = t._rootTimeline._timeScale = e, e) : s._timeScale;
                }, _.progress = function (t) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration();
                }, _.totalProgress = function (t) {
                    return arguments.length ? this.totalTime(this.totalDuration() * t, !1) : this._totalTime / this.totalDuration();
                }, _.time = function (t, e) {
                    return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time;
                }, _.duration = function (e) {
                    return arguments.length ? t.prototype.duration.call(this, e) : this._duration;
                }, _.totalDuration = function (t) {
                    return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration);
                }, _.repeat = function (t) {
                    return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat;
                }, _.repeatDelay = function (t) {
                    return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay;
                }, _.yoyo = function (t) {
                    return arguments.length ? (this._yoyo = t, this) : this._yoyo;
                }, n;
            }, !0), _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (t, e, i) {
                var s = function s(t) {
                        e.call(this, t), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
                        var i,
                            s,
                            r = this.vars;
                        for (s in r) {
                            i = r[s], l(i) && -1 !== i.join("").indexOf("{self}") && (r[s] = this._swapSelfInParams(i));
                        }
                        l(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger);
                    },
                    r = 1e-10,
                    n = i._internals,
                    a = s._internals = {},
                    o = n.isSelector,
                    l = n.isArray,
                    h = n.lazyTweens,
                    _ = n.lazyRender,
                    u = _gsScope._gsDefine.globals,
                    c = function c(t) {
                        var e,
                            i = {};
                        for (e in t) {
                            i[e] = t[e];
                        }
                        return i;
                    },
                    f = function f(t, e, i) {
                        var s,
                            r,
                            n = t.cycle;
                        for (s in n) {
                            r = n[s], t[s] = "function" == typeof r ? r.call(e[i], i) : r[i % r.length];
                        }
                        delete t.cycle;
                    },
                    p = a.pauseCallback = function () {},
                    m = function m(t) {
                        var e,
                            i = [],
                            s = t.length;
                        for (e = 0; e !== s; i.push(t[e++])) {}
                        return i;
                    },
                    d = s.prototype = new e();
                return s.version = "1.18.0", d.constructor = s, d.kill()._gc = d._forcingPlayhead = d._hasPause = !1, d.to = function (t, e, s, r) {
                    var n = s.repeat && u.TweenMax || i;
                    return e ? this.add(new n(t, e, s), r) : this.set(t, s, r);
                }, d.from = function (t, e, s, r) {
                    return this.add((s.repeat && u.TweenMax || i).from(t, e, s), r);
                }, d.fromTo = function (t, e, s, r, n) {
                    var a = r.repeat && u.TweenMax || i;
                    return e ? this.add(a.fromTo(t, e, s, r), n) : this.set(t, r, n);
                }, d.staggerTo = function (t, e, r, n, a, l, h, _) {
                    var u,
                        p,
                        d = new s({
                            onComplete: l,
                            onCompleteParams: h,
                            callbackScope: _,
                            smoothChildTiming: this.smoothChildTiming
                        }),
                        g = r.cycle;
                    for ("string" == typeof t && (t = i.selector(t) || t), t = t || [], o(t) && (t = m(t)), n = n || 0, 0 > n && (t = m(t), t.reverse(), n *= -1), p = 0; t.length > p; p++) {
                        u = c(r), u.startAt && (u.startAt = c(u.startAt), u.startAt.cycle && f(u.startAt, t, p)), g && f(u, t, p), d.to(t[p], e, u, p * n);
                    }
                    return this.add(d, a);
                }, d.staggerFrom = function (t, e, i, s, r, n, a, o) {
                    return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o);
                }, d.staggerFromTo = function (t, e, i, s, r, n, a, o, l) {
                    return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, this.staggerTo(t, e, s, r, n, a, o, l);
                }, d.call = function (t, e, s, r) {
                    return this.add(i.delayedCall(0, t, e, s), r);
                }, d.set = function (t, e, s) {
                    return s = this._parseTimeOrLabel(s, 0, !0), null == e.immediateRender && (e.immediateRender = s === this._time && !this._paused), this.add(new i(t, 0, e), s);
                }, s.exportRoot = function (t, e) {
                    t = t || {}, null == t.smoothChildTiming && (t.smoothChildTiming = !0);
                    var r,
                        n,
                        a = new s(t),
                        o = a._timeline;
                    for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;) {
                        n = r._next, e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay), r = n;
                    }
                    return o.add(a, 0), a;
                }, d.add = function (r, n, a, o) {
                    var h, _, u, c, f, p;
                    if ("number" != typeof n && (n = this._parseTimeOrLabel(n, 0, !0, r)), !(r instanceof t)) {
                        if (r instanceof Array || r && r.push && l(r)) {
                            for (a = a || "normal", o = o || 0, h = n, _ = r.length, u = 0; _ > u; u++) {
                                l(c = r[u]) && (c = new s({
                                    tweens: c
                                })), this.add(c, h), "string" != typeof c && "function" != typeof c && ("sequence" === a ? h = c._startTime + c.totalDuration() / c._timeScale : "start" === a && (c._startTime -= c.delay())), h += o;
                            }
                            return this._uncache(!0);
                        }
                        if ("string" == typeof r) return this.addLabel(r, n);
                        if ("function" != typeof r) throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
                        r = i.delayedCall(0, r);
                    }
                    if (e.prototype.add.call(this, r, n), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                        for (f = this, p = f.rawTime() > r._startTime; f._timeline;) {
                            p && f._timeline.smoothChildTiming ? f.totalTime(f._totalTime, !0) : f._gc && f._enabled(!0, !1), f = f._timeline;
                        }
                    return this;
                }, d.remove = function (e) {
                    if (e instanceof t) {
                        this._remove(e, !1);
                        var i = e._timeline = e.vars.useFrames ? t._rootFramesTimeline : t._rootTimeline;
                        return e._startTime = (e._paused ? e._pauseTime : i._time) - (e._reversed ? e.totalDuration() - e._totalTime : e._totalTime) / e._timeScale, this;
                    }
                    if (e instanceof Array || e && e.push && l(e)) {
                        for (var s = e.length; --s > -1;) {
                            this.remove(e[s]);
                        }
                        return this;
                    }
                    return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e);
                }, d._remove = function (t, i) {
                    e.prototype._remove.call(this, t, i);
                    var s = this._last;
                    return s ? this._time > s._startTime + s._totalDuration / s._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this;
                }, d.append = function (t, e) {
                    return this.add(t, this._parseTimeOrLabel(null, e, !0, t));
                }, d.insert = d.insertMultiple = function (t, e, i, s) {
                    return this.add(t, e || 0, i, s);
                }, d.appendMultiple = function (t, e, i, s) {
                    return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s);
                }, d.addLabel = function (t, e) {
                    return this._labels[t] = this._parseTimeOrLabel(e), this;
                }, d.addPause = function (t, e, s, r) {
                    var n = i.delayedCall(0, p, s, r || this);
                    return n.vars.onComplete = n.vars.onReverseComplete = e, n.data = "isPause", this._hasPause = !0, this.add(n, t);
                }, d.removeLabel = function (t) {
                    return delete this._labels[t], this;
                }, d.getLabelTime = function (t) {
                    return null != this._labels[t] ? this._labels[t] : -1;
                }, d._parseTimeOrLabel = function (e, i, s, r) {
                    var n;
                    if (r instanceof t && r.timeline === this) this.remove(r);
                    else if (r && (r instanceof Array || r.push && l(r)))
                        for (n = r.length; --n > -1;) {
                            r[n] instanceof t && r[n].timeline === this && this.remove(r[n]);
                        }
                    if ("string" == typeof i) return this._parseTimeOrLabel(i, s && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, s);
                    if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e]) null == e && (e = this.duration());
                    else {
                        if (n = e.indexOf("="), -1 === n) return null == this._labels[e] ? s ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
                        i = parseInt(e.charAt(n - 1) + "1", 10) * Number(e.substr(n + 1)), e = n > 1 ? this._parseTimeOrLabel(e.substr(0, n - 1), 0, s) : this.duration();
                    }
                    return Number(e) + i;
                }, d.seek = function (t, e) {
                    return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1);
                }, d.stop = function () {
                    return this.paused(!0);
                }, d.gotoAndPlay = function (t, e) {
                    return this.play(t, e);
                }, d.gotoAndStop = function (t, e) {
                    return this.pause(t, e);
                }, d.render = function (t, e, i) {
                    this._gc && this._enabled(!0, !1);
                    var s,
                        n,
                        a,
                        o,
                        l,
                        u,
                        c = this._dirty ? this.totalDuration() : this._totalDuration,
                        f = this._time,
                        p = this._startTime,
                        m = this._timeScale,
                        d = this._paused;
                    if (t >= c) this._totalTime = this._time = c, this._reversed || this._hasPausedChild() || (n = !0, o = "onComplete", l = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === t || 0 > this._rawPrevTime || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (l = !0, this._rawPrevTime > r && (o = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, t = c + 1e-4;
                    else if (1e-7 > t) {
                        if (this._totalTime = this._time = 0, (0 !== f || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (o = "onReverseComplete", n = this._reversed), 0 > t) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (l = n = !0, o = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (l = !0), this._rawPrevTime = t;
                        else {
                            if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, 0 === t && n)
                                for (s = this._first; s && 0 === s._startTime;) {
                                    s._duration || (n = !1), s = s._next;
                                }
                            t = 0, this._initted || (l = !0);
                        }
                    } else {
                        if (this._hasPause && !this._forcingPlayhead && !e) {
                            if (t >= f)
                                for (s = this._first; s && t >= s._startTime && !u;) {
                                    s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === this._rawPrevTime || (u = s), s = s._next;
                                } else
                                    for (s = this._last; s && s._startTime >= t && !u;) {
                                        s._duration || "isPause" === s.data && s._rawPrevTime > 0 && (u = s), s = s._prev;
                                    }
                            u && (this._time = t = u._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay));
                        }
                        this._totalTime = this._time = this._rawPrevTime = t;
                    }
                    if (this._time !== f && this._first || i || l || u) {
                        if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== f && t > 0 && (this._active = !0), 0 === f && this.vars.onStart && 0 !== this._time && (e || this._callback("onStart")), this._time >= f)
                            for (s = this._first; s && (a = s._next, !this._paused || d);) {
                                (s._active || s._startTime <= this._time && !s._paused && !s._gc) && (u === s && this.pause(), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
                            } else
                                for (s = this._last; s && (a = s._prev, !this._paused || d);) {
                                    if (s._active || f >= s._startTime && !s._paused && !s._gc) {
                                        if (u === s) {
                                            for (u = s._prev; u && u.endTime() > this._time;) {
                                                u.render(u._reversed ? u.totalDuration() - (t - u._startTime) * u._timeScale : (t - u._startTime) * u._timeScale, e, i), u = u._prev;
                                            }
                                            u = null, this.pause();
                                        }
                                        s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i);
                                    }
                                    s = a;
                                }
                        this._onUpdate && (e || (h.length && _(), this._callback("onUpdate"))), o && (this._gc || (p === this._startTime || m !== this._timeScale) && (0 === this._time || c >= this.totalDuration()) && (n && (h.length && _(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[o] && this._callback(o)));
                    }
                }, d._hasPausedChild = function () {
                    for (var t = this._first; t;) {
                        if (t._paused || t instanceof s && t._hasPausedChild()) return !0;
                        t = t._next;
                    }
                    return !1;
                }, d.getChildren = function (t, e, s, r) {
                    r = r || -9999999999;
                    for (var n = [], a = this._first, o = 0; a;) {
                        r > a._startTime || (a instanceof i ? e !== !1 && (n[o++] = a) : (s !== !1 && (n[o++] = a), t !== !1 && (n = n.concat(a.getChildren(!0, e, s)), o = n.length))), a = a._next;
                    }
                    return n;
                }, d.getTweensOf = function (t, e) {
                    var s,
                        r,
                        n = this._gc,
                        a = [],
                        o = 0;
                    for (n && this._enabled(!0, !0), s = i.getTweensOf(t), r = s.length; --r > -1;) {
                        (s[r].timeline === this || e && this._contains(s[r])) && (a[o++] = s[r]);
                    }
                    return n && this._enabled(!1, !0), a;
                }, d.recent = function () {
                    return this._recent;
                }, d._contains = function (t) {
                    for (var e = t.timeline; e;) {
                        if (e === this) return !0;
                        e = e.timeline;
                    }
                    return !1;
                }, d.shiftChildren = function (t, e, i) {
                    i = i || 0;
                    for (var s, r = this._first, n = this._labels; r;) {
                        r._startTime >= i && (r._startTime += t), r = r._next;
                    }
                    if (e)
                        for (s in n) {
                            n[s] >= i && (n[s] += t);
                        }
                    return this._uncache(!0);
                }, d._kill = function (t, e) {
                    if (!t && !e) return this._enabled(!1, !1);
                    for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; --s > -1;) {
                        i[s]._kill(t, e) && (r = !0);
                    }
                    return r;
                }, d.clear = function (t) {
                    var e = this.getChildren(!1, !0, !0),
                        i = e.length;
                    for (this._time = this._totalTime = 0; --i > -1;) {
                        e[i]._enabled(!1, !1);
                    }
                    return t !== !1 && (this._labels = {}), this._uncache(!0);
                }, d.invalidate = function () {
                    for (var e = this._first; e;) {
                        e.invalidate(), e = e._next;
                    }
                    return t.prototype.invalidate.call(this);
                }, d._enabled = function (t, i) {
                    if (t === this._gc)
                        for (var s = this._first; s;) {
                            s._enabled(t, !0), s = s._next;
                        }
                    return e.prototype._enabled.call(this, t, i);
                }, d.totalTime = function () {
                    this._forcingPlayhead = !0;
                    var e = t.prototype.totalTime.apply(this, arguments);
                    return this._forcingPlayhead = !1, e;
                }, d.duration = function (t) {
                    return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration);
                }, d.totalDuration = function (t) {
                    if (!arguments.length) {
                        if (this._dirty) {
                            for (var e, i, s = 0, r = this._last, n = 999999999999; r;) {
                                e = r._prev, r._dirty && r.totalDuration(), r._startTime > n && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : n = r._startTime, 0 > r._startTime && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), i = r._startTime + r._totalDuration / r._timeScale, i > s && (s = i), r = e;
                            }
                            this._duration = this._totalDuration = s, this._dirty = !1;
                        }
                        return this._totalDuration;
                    }
                    return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t), this;
                }, d.paused = function (e) {
                    if (!e)
                        for (var i = this._first, s = this._time; i;) {
                            i._startTime === s && "isPause" === i.data && (i._rawPrevTime = 0), i = i._next;
                        }
                    return t.prototype.paused.apply(this, arguments);
                }, d.usesFrames = function () {
                    for (var e = this._timeline; e._timeline;) {
                        e = e._timeline;
                    }
                    return e === t._rootFramesTimeline;
                }, d.rawTime = function () {
                    return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
                }, s;
            }, !0), _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (t, e, i) {
                var s = function s(e) {
                        t.call(this, e), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._dirty = !0;
                    },
                    r = 1e-10,
                    n = e._internals,
                    a = n.lazyTweens,
                    o = n.lazyRender,
                    l = new i(null, null, 1, 0),
                    h = s.prototype = new t();
                return h.constructor = s, h.kill()._gc = !1, s.version = "1.18.0", h.invalidate = function () {
                    return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), t.prototype.invalidate.call(this);
                }, h.addCallback = function (t, i, s, r) {
                    return this.add(e.delayedCall(0, t, s, r), i);
                }, h.removeCallback = function (t, e) {
                    if (t)
                        if (null == e) this._kill(null, t);
                        else
                            for (var i = this.getTweensOf(t, !1), s = i.length, r = this._parseTimeOrLabel(e); --s > -1;) {
                                i[s]._startTime === r && i[s]._enabled(!1, !1);
                            }
                    return this;
                }, h.removePause = function (e) {
                    return this.removeCallback(t._internals.pauseCallback, e);
                }, h.tweenTo = function (t, i) {
                    i = i || {};
                    var s,
                        r,
                        n,
                        a = {
                            ease: l,
                            useFrames: this.usesFrames(),
                            immediateRender: !1
                        };
                    for (r in i) {
                        a[r] = i[r];
                    }
                    return a.time = this._parseTimeOrLabel(t), s = Math.abs(Number(a.time) - this._time) / this._timeScale || .001, n = new e(this, s, a), a.onStart = function () {
                        n.target.paused(!0), n.vars.time !== n.target.time() && s === n.duration() && n.duration(Math.abs(n.vars.time - n.target.time()) / n.target._timeScale), i.onStart && n._callback("onStart");
                    }, n;
                }, h.tweenFromTo = function (t, e, i) {
                    i = i || {}, t = this._parseTimeOrLabel(t), i.startAt = {
                        onComplete: this.seek,
                        onCompleteParams: [t],
                        callbackScope: this
                    }, i.immediateRender = i.immediateRender !== !1;
                    var s = this.tweenTo(e, i);
                    return s.duration(Math.abs(s.vars.time - t) / this._timeScale || .001);
                }, h.render = function (t, e, i) {
                    this._gc && this._enabled(!0, !1);
                    var s,
                        n,
                        l,
                        h,
                        _,
                        u,
                        c,
                        f = this._dirty ? this.totalDuration() : this._totalDuration,
                        p = this._duration,
                        m = this._time,
                        d = this._totalTime,
                        g = this._startTime,
                        v = this._timeScale,
                        y = this._rawPrevTime,
                        T = this._paused,
                        x = this._cycle;
                    if (t >= f) this._locked || (this._totalTime = f, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (n = !0, h = "onComplete", _ = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === t || 0 > y || y === r) && y !== t && this._first && (_ = !0, y > r && (h = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, this._yoyo && 0 !== (1 & this._cycle) ? this._time = t = 0 : (this._time = p, t = p + 1e-4);
                    else if (1e-7 > t) {
                        if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== m || 0 === p && y !== r && (y > 0 || 0 > t && y >= 0) && !this._locked) && (h = "onReverseComplete", n = this._reversed), 0 > t) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (_ = n = !0, h = "onReverseComplete") : y >= 0 && this._first && (_ = !0), this._rawPrevTime = t;
                        else {
                            if (this._rawPrevTime = p || !e || t || this._rawPrevTime === t ? t : r, 0 === t && n)
                                for (s = this._first; s && 0 === s._startTime;) {
                                    s._duration || (n = !1), s = s._next;
                                }
                            t = 0, this._initted || (_ = !0);
                        }
                    } else if (0 === p && 0 > y && (_ = !0), this._time = this._rawPrevTime = t, this._locked || (this._totalTime = t, 0 !== this._repeat && (u = p + this._repeatDelay, this._cycle = this._totalTime / u >> 0, 0 !== this._cycle && this._cycle === this._totalTime / u && this._cycle--, this._time = this._totalTime - this._cycle * u, this._yoyo && 0 !== (1 & this._cycle) && (this._time = p - this._time), this._time > p ? (this._time = p, t = p + 1e-4) : 0 > this._time ? this._time = t = 0 : t = this._time)), this._hasPause && !this._forcingPlayhead && !e) {
                        if (t = this._time, t >= m)
                            for (s = this._first; s && t >= s._startTime && !c;) {
                                s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === this._rawPrevTime || (c = s), s = s._next;
                            } else
                                for (s = this._last; s && s._startTime >= t && !c;) {
                                    s._duration || "isPause" === s.data && s._rawPrevTime > 0 && (c = s), s = s._prev;
                                }
                        c && (this._time = t = c._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay));
                    }
                    if (this._cycle !== x && !this._locked) {
                        var w = this._yoyo && 0 !== (1 & x),
                            b = w === (this._yoyo && 0 !== (1 & this._cycle)),
                            P = this._totalTime,
                            k = this._cycle,
                            S = this._rawPrevTime,
                            R = this._time;
                        if (this._totalTime = x * p, x > this._cycle ? w = !w : this._totalTime += p, this._time = m, this._rawPrevTime = 0 === p ? y - 1e-4 : y, this._cycle = x, this._locked = !0, m = w ? 0 : p, this.render(m, e, 0 === p), e || this._gc || this.vars.onRepeat && this._callback("onRepeat"), b && (m = w ? p + 1e-4 : -1e-4, this.render(m, !0, !1)), this._locked = !1, this._paused && !T) return;
                        this._time = R, this._totalTime = P, this._cycle = k, this._rawPrevTime = S;
                    }
                    if (!(this._time !== m && this._first || i || _ || c)) return d !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")), void 0;
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== d && t > 0 && (this._active = !0), 0 === d && this.vars.onStart && 0 !== this._totalTime && (e || this._callback("onStart")), this._time >= m)
                        for (s = this._first; s && (l = s._next, !this._paused || T);) {
                            (s._active || s._startTime <= this._time && !s._paused && !s._gc) && (c === s && this.pause(), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = l;
                        } else
                            for (s = this._last; s && (l = s._prev, !this._paused || T);) {
                                if (s._active || m >= s._startTime && !s._paused && !s._gc) {
                                    if (c === s) {
                                        for (c = s._prev; c && c.endTime() > this._time;) {
                                            c.render(c._reversed ? c.totalDuration() - (t - c._startTime) * c._timeScale : (t - c._startTime) * c._timeScale, e, i), c = c._prev;
                                        }
                                        c = null, this.pause();
                                    }
                                    s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i);
                                }
                                s = l;
                            }
                    this._onUpdate && (e || (a.length && o(), this._callback("onUpdate"))), h && (this._locked || this._gc || (g === this._startTime || v !== this._timeScale) && (0 === this._time || f >= this.totalDuration()) && (n && (a.length && o(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[h] && this._callback(h)));
                }, h.getActive = function (t, e, i) {
                    null == t && (t = !0), null == e && (e = !0), null == i && (i = !1);
                    var s,
                        r,
                        n = [],
                        a = this.getChildren(t, e, i),
                        o = 0,
                        l = a.length;
                    for (s = 0; l > s; s++) {
                        r = a[s], r.isActive() && (n[o++] = r);
                    }
                    return n;
                }, h.getLabelAfter = function (t) {
                    t || 0 !== t && (t = this._time);
                    var e,
                        i = this.getLabelsArray(),
                        s = i.length;
                    for (e = 0; s > e; e++) {
                        if (i[e].time > t) return i[e].name;
                    }
                    return null;
                }, h.getLabelBefore = function (t) {
                    null == t && (t = this._time);
                    for (var e = this.getLabelsArray(), i = e.length; --i > -1;) {
                        if (t > e[i].time) return e[i].name;
                    }
                    return null;
                }, h.getLabelsArray = function () {
                    var t,
                        e = [],
                        i = 0;
                    for (t in this._labels) {
                        e[i++] = {
                            time: this._labels[t],
                            name: t
                        };
                    }
                    return e.sort(function (t, e) {
                        return t.time - e.time;
                    }), e;
                }, h.progress = function (t, e) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration();
                }, h.totalProgress = function (t, e) {
                    return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration();
                }, h.totalDuration = function (e) {
                    return arguments.length ? -1 === this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (t.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration);
                }, h.time = function (t, e) {
                    return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time;
                }, h.repeat = function (t) {
                    return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat;
                }, h.repeatDelay = function (t) {
                    return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay;
                }, h.yoyo = function (t) {
                    return arguments.length ? (this._yoyo = t, this) : this._yoyo;
                }, h.currentLabel = function (t) {
                    return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8);
                }, s;
            }, !0),
            function () {
                var t = 180 / Math.PI,
                    e = [],
                    i = [],
                    s = [],
                    r = {},
                    n = _gsScope._gsDefine.globals,
                    a = function a(t, e, i, s) {
                        this.a = t, this.b = e, this.c = i, this.d = s, this.da = s - t, this.ca = i - t, this.ba = e - t;
                    },
                    o = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
                    l = function l(t, e, i, s) {
                        var r = {
                                a: t
                            },
                            n = {},
                            a = {},
                            o = {
                                c: s
                            },
                            l = (t + e) / 2,
                            h = (e + i) / 2,
                            _ = (i + s) / 2,
                            u = (l + h) / 2,
                            c = (h + _) / 2,
                            f = (c - u) / 8;
                        return r.b = l + (t - l) / 4, n.b = u + f, r.c = n.a = (r.b + n.b) / 2, n.c = a.a = (u + c) / 2, a.b = c - f, o.b = _ + (s - _) / 4, a.c = o.a = (a.b + o.b) / 2, [r, n, a, o];
                    },
                    h = function h(t, r, n, a, o) {
                        var h,
                            _,
                            u,
                            c,
                            f,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y,
                            T,
                            x,
                            w = t.length - 1,
                            b = 0,
                            P = t[0].a;
                        for (h = 0; w > h; h++) {
                            f = t[b], _ = f.a, u = f.d, c = t[b + 1].d, o ? (y = e[h], T = i[h], x = .25 * (T + y) * r / (a ? .5 : s[h] || .5), p = u - (u - _) * (a ? .5 * r : 0 !== y ? x / y : 0), m = u + (c - u) * (a ? .5 * r : 0 !== T ? x / T : 0), d = u - (p + ((m - p) * (3 * y / (y + T) + .5) / 4 || 0))) : (p = u - .5 * (u - _) * r, m = u + .5 * (c - u) * r, d = u - (p + m) / 2), p += d, m += d, f.c = g = p, f.b = 0 !== h ? P : P = f.a + .6 * (f.c - f.a), f.da = u - _, f.ca = g - _, f.ba = P - _, n ? (v = l(_, P, g, u), t.splice(b, 1, v[0], v[1], v[2], v[3]), b += 4) : b++, P = m;
                        }
                        f = t[b], f.b = P, f.c = P + .4 * (f.d - P), f.da = f.d - f.a, f.ca = f.c - f.a, f.ba = P - f.a, n && (v = l(f.a, P, f.c, f.d), t.splice(b, 1, v[0], v[1], v[2], v[3]));
                    },
                    _ = function _(t, s, r, n) {
                        var o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f = [];
                        if (n)
                            for (t = [n].concat(t), l = t.length; --l > -1;) {
                                "string" == typeof (c = t[l][s]) && "=" === c.charAt(1) && (t[l][s] = n[s] + Number(c.charAt(0) + c.substr(2)));
                            }
                        if (o = t.length - 2, 0 > o) return f[0] = new a(t[0][s], 0, 0, t[-1 > o ? 0 : 1][s]), f;
                        for (l = 0; o > l; l++) {
                            h = t[l][s], _ = t[l + 1][s], f[l] = new a(h, 0, 0, _), r && (u = t[l + 2][s], e[l] = (e[l] || 0) + (_ - h) * (_ - h), i[l] = (i[l] || 0) + (u - _) * (u - _));
                        }
                        return f[l] = new a(t[l][s], 0, 0, t[l + 1][s]), f;
                    },
                    u = function u(t, n, a, l, _u, c) {
                        var f,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y,
                            T,
                            x = {},
                            w = [],
                            b = c || t[0];
                        _u = "string" == typeof _u ? "," + _u + "," : o, null == n && (n = 1);
                        for (p in t[0]) {
                            w.push(p);
                        }
                        if (t.length > 1) {
                            for (T = t[t.length - 1], y = !0, f = w.length; --f > -1;) {
                                if (p = w[f], Math.abs(b[p] - T[p]) > .05) {
                                    y = !1;
                                    break;
                                }
                            }
                            y && (t = t.concat(), c && t.unshift(c), t.push(t[1]), c = t[t.length - 3]);
                        }
                        for (e.length = i.length = s.length = 0, f = w.length; --f > -1;) {
                            p = w[f], r[p] = -1 !== _u.indexOf("," + p + ","), x[p] = _(t, p, r[p], c);
                        }
                        for (f = e.length; --f > -1;) {
                            e[f] = Math.sqrt(e[f]), i[f] = Math.sqrt(i[f]);
                        }
                        if (!l) {
                            for (f = w.length; --f > -1;) {
                                if (r[p])
                                    for (m = x[w[f]], v = m.length - 1, d = 0; v > d; d++) {
                                        g = m[d + 1].da / i[d] + m[d].da / e[d], s[d] = (s[d] || 0) + g * g;
                                    }
                            }
                            for (f = s.length; --f > -1;) {
                                s[f] = Math.sqrt(s[f]);
                            }
                        }
                        for (f = w.length, d = a ? 4 : 1; --f > -1;) {
                            p = w[f], m = x[p], h(m, n, a, l, r[p]), y && (m.splice(0, d), m.splice(m.length - d, d));
                        }
                        return x;
                    },
                    c = function c(t, e, i) {
                        e = e || "soft";
                        var s,
                            r,
                            n,
                            o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f,
                            p,
                            m = {},
                            d = "cubic" === e ? 3 : 2,
                            g = "soft" === e,
                            v = [];
                        if (g && i && (t = [i].concat(t)), null == t || d + 1 > t.length) throw "invalid Bezier data";
                        for (c in t[0]) {
                            v.push(c);
                        }
                        for (h = v.length; --h > -1;) {
                            for (c = v[h], m[c] = l = [], f = 0, u = t.length, _ = 0; u > _; _++) {
                                s = null == i ? t[_][c] : "string" == typeof (p = t[_][c]) && "=" === p.charAt(1) ? i[c] + Number(p.charAt(0) + p.substr(2)) : Number(p), g && _ > 1 && u - 1 > _ && (l[f++] = (s + l[f - 2]) / 2), l[f++] = s;
                            }
                            for (u = f - d + 1, f = 0, _ = 0; u > _; _ += d) {
                                s = l[_], r = l[_ + 1], n = l[_ + 2], o = 2 === d ? 0 : l[_ + 3], l[f++] = p = 3 === d ? new a(s, r, n, o) : new a(s, (2 * r + s) / 3, (2 * r + n) / 3, n);
                            }
                            l.length = f;
                        }
                        return m;
                    },
                    f = function f(t, e, i) {
                        for (var s, r, n, a, o, l, h, _, u, c, f, p = 1 / i, m = t.length; --m > -1;) {
                            for (c = t[m], n = c.a, a = c.d - n, o = c.c - n, l = c.b - n, s = r = 0, _ = 1; i >= _; _++) {
                                h = p * _, u = 1 - h, s = r - (r = (h * h * a + 3 * u * (h * o + u * l)) * h), f = m * i + _ - 1, e[f] = (e[f] || 0) + s * s;
                            }
                        }
                    },
                    p = function p(t, e) {
                        e = e >> 0 || 6;
                        var i,
                            s,
                            r,
                            n,
                            a = [],
                            o = [],
                            l = 0,
                            h = 0,
                            _ = e - 1,
                            u = [],
                            c = [];
                        for (i in t) {
                            f(t[i], a, e);
                        }
                        for (r = a.length, s = 0; r > s; s++) {
                            l += Math.sqrt(a[s]), n = s % e, c[n] = l, n === _ && (h += l, n = s / e >> 0, u[n] = c, o[n] = h, l = 0, c = []);
                        }
                        return {
                            length: h,
                            lengths: o,
                            segments: u
                        };
                    },
                    m = _gsScope._gsDefine.plugin({
                        propName: "bezier",
                        priority: -1,
                        version: "1.3.4",
                        API: 2,
                        global: !0,
                        init: function init(t, e, i) {
                            this._target = t, e instanceof Array && (e = {
                                values: e
                            }), this._func = {}, this._round = {}, this._props = [], this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
                            var s,
                                r,
                                n,
                                a,
                                o,
                                l = e.values || [],
                                h = {},
                                _ = l[0],
                                f = e.autoRotate || i.vars.orientToBezier;
                            this._autoRotate = f ? f instanceof Array ? f : [
                                ["x", "y", "rotation", f === !0 ? 0 : Number(f) || 0]
                            ] : null;
                            for (s in _) {
                                this._props.push(s);
                            }
                            for (n = this._props.length; --n > -1;) {
                                s = this._props[n], this._overwriteProps.push(s), r = this._func[s] = "function" == typeof t[s], h[s] = r ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : parseFloat(t[s]), o || h[s] !== l[0][s] && (o = h);
                            }
                            if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? u(l, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : c(l, e.type, h), this._segCount = this._beziers[s].length, this._timeRes) {
                                var m = p(this._beziers, this._timeRes);
                                this._length = m.length, this._lengths = m.lengths, this._segments = m.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length;
                            }
                            if (f = this._autoRotate)
                                for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), n = f.length; --n > -1;) {
                                    for (a = 0; 3 > a; a++) {
                                        s = f[n][a], this._func[s] = "function" == typeof t[s] ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)] : !1;
                                    }
                                    s = f[n][2], this._initialRotations[n] = this._func[s] ? this._func[s].call(this._target) : this._target[s];
                                }
                            return this._startRatio = i.vars.runBackwards ? 1 : 0, !0;
                        },
                        set: function set(e) {
                            var i,
                                s,
                                r,
                                n,
                                a,
                                o,
                                l,
                                h,
                                _,
                                u,
                                c = this._segCount,
                                f = this._func,
                                p = this._target,
                                m = e !== this._startRatio;
                            if (this._timeRes) {
                                if (_ = this._lengths, u = this._curSeg, e *= this._length, r = this._li, e > this._l2 && c - 1 > r) {
                                    for (h = c - 1; h > r && e >= (this._l2 = _[++r]);) {}
                                    this._l1 = _[r - 1], this._li = r, this._curSeg = u = this._segments[r], this._s2 = u[this._s1 = this._si = 0];
                                } else if (this._l1 > e && r > 0) {
                                    for (; r > 0 && (this._l1 = _[--r]) >= e;) {}
                                    0 === r && this._l1 > e ? this._l1 = 0 : r++, this._l2 = _[r], this._li = r, this._curSeg = u = this._segments[r], this._s1 = u[(this._si = u.length - 1) - 1] || 0, this._s2 = u[this._si];
                                }
                                if (i = r, e -= this._l1, r = this._si, e > this._s2 && u.length - 1 > r) {
                                    for (h = u.length - 1; h > r && e >= (this._s2 = u[++r]);) {}
                                    this._s1 = u[r - 1], this._si = r;
                                } else if (this._s1 > e && r > 0) {
                                    for (; r > 0 && (this._s1 = u[--r]) >= e;) {}
                                    0 === r && this._s1 > e ? this._s1 = 0 : r++, this._s2 = u[r], this._si = r;
                                }
                                o = (r + (e - this._s1) / (this._s2 - this._s1)) * this._prec;
                            } else i = 0 > e ? 0 : e >= 1 ? c - 1 : c * e >> 0, o = (e - i * (1 / c)) * c;
                            for (s = 1 - o, r = this._props.length; --r > -1;) {
                                n = this._props[r], a = this._beziers[n][i], l = (o * o * a.da + 3 * s * (o * a.ca + s * a.ba)) * o + a.a, this._round[n] && (l = Math.round(l)), f[n] ? p[n](l) : p[n] = l;
                            }
                            if (this._autoRotate) {
                                var d,
                                    g,
                                    v,
                                    y,
                                    T,
                                    x,
                                    w,
                                    b = this._autoRotate;
                                for (r = b.length; --r > -1;) {
                                    n = b[r][2], x = b[r][3] || 0, w = b[r][4] === !0 ? 1 : t, a = this._beziers[b[r][0]], d = this._beziers[b[r][1]], a && d && (a = a[i], d = d[i], g = a.a + (a.b - a.a) * o, y = a.b + (a.c - a.b) * o, g += (y - g) * o, y += (a.c + (a.d - a.c) * o - y) * o, v = d.a + (d.b - d.a) * o, T = d.b + (d.c - d.b) * o, v += (T - v) * o, T += (d.c + (d.d - d.c) * o - T) * o, l = m ? Math.atan2(T - v, y - g) * w + x : this._initialRotations[r], f[n] ? p[n](l) : p[n] = l);
                                }
                            }
                        }
                    }),
                    d = m.prototype;
                m.bezierThrough = u, m.cubicToQuadratic = l, m._autoCSS = !0, m.quadraticToCubic = function (t, e, i) {
                    return new a(t, (2 * e + t) / 3, (2 * e + i) / 3, i);
                }, m._cssRegister = function () {
                    var t = n.CSSPlugin;
                    if (t) {
                        var e = t._internals,
                            i = e._parseToProxy,
                            s = e._setPluginRatio,
                            r = e.CSSPropTween;
                        e._registerComplexSpecialProp("bezier", {
                            parser: function parser(t, e, n, a, o, l) {
                                e instanceof Array && (e = {
                                    values: e
                                }), l = new m();
                                var h,
                                    _,
                                    u,
                                    c = e.values,
                                    f = c.length - 1,
                                    p = [],
                                    d = {};
                                if (0 > f) return o;
                                for (h = 0; f >= h; h++) {
                                    u = i(t, c[h], a, o, l, f !== h), p[h] = u.end;
                                }
                                for (_ in e) {
                                    d[_] = e[_];
                                }
                                return d.values = p, o = new r(t, "bezier", 0, 0, u.pt, 2), o.data = u, o.plugin = l, o.setRatio = s, 0 === d.autoRotate && (d.autoRotate = !0), !d.autoRotate || d.autoRotate instanceof Array || (h = d.autoRotate === !0 ? 0 : Number(d.autoRotate), d.autoRotate = null != u.end.left ? [
                                    ["left", "top", "rotation", h, !1]
                                ] : null != u.end.x ? [
                                    ["x", "y", "rotation", h, !1]
                                ] : !1), d.autoRotate && (a._transform || a._enableTransforms(!1), u.autoRotate = a._target._gsTransform), l._onInitTween(u.proxy, d, a._tween), o;
                            }
                        });
                    }
                }, d._roundProps = function (t, e) {
                    for (var i = this._overwriteProps, s = i.length; --s > -1;) {
                        (t[i[s]] || t.bezier || t.bezierThrough) && (this._round[i[s]] = e);
                    }
                }, d._kill = function (t) {
                    var e,
                        i,
                        s = this._props;
                    for (e in this._beziers) {
                        if (e in t)
                            for (delete this._beziers[e], delete this._func[e], i = s.length; --i > -1;) {
                                s[i] === e && s.splice(i, 1);
                            }
                    }
                    return this._super._kill.call(this, t);
                };
            }(), _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (t, e) {
                var i,
                    s,
                    r,
                    n,
                    a = function a() {
                        t.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = a.prototype.setRatio;
                    },
                    o = _gsScope._gsDefine.globals,
                    l = {},
                    h = a.prototype = new t("css");
                h.constructor = a, a.version = "1.18.0", a.API = 2, a.defaultTransformPerspective = 0, a.defaultSkewType = "compensated", a.defaultSmoothOrigin = !0, h = "px", a.suffixMap = {
                    top: h,
                    right: h,
                    bottom: h,
                    left: h,
                    width: h,
                    height: h,
                    fontSize: h,
                    padding: h,
                    margin: h,
                    perspective: h,
                    lineHeight: ""
                };
                var _,
                    u,
                    c,
                    f,
                    p,
                    m,
                    d = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
                    g = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                    v = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                    y = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                    T = /(?:\d|\-|\+|=|#|\.)*/g,
                    x = /opacity *= *([^)]*)/i,
                    w = /opacity:([^;]*)/i,
                    b = /alpha\(opacity *=.+?\)/i,
                    P = /^(rgb|hsl)/,
                    k = /([A-Z])/g,
                    S = /-([a-z])/gi,
                    R = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                    O = function O(t, e) {
                        return e.toUpperCase();
                    },
                    A = /(?:Left|Right|Width)/i,
                    C = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                    D = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                    M = /,(?=[^\)]*(?:\(|$))/gi,
                    z = Math.PI / 180,
                    F = 180 / Math.PI,
                    I = {},
                    E = document,
                    N = function N(t) {
                        return E.createElementNS ? E.createElementNS("http://www.w3.org/1999/xhtml", t) : E.createElement(t);
                    },
                    L = N("div"),
                    X = N("img"),
                    B = a._internals = {
                        _specialProps: l
                    },
                    j = navigator.userAgent,
                    Y = function () {
                        var t = j.indexOf("Android"),
                            e = N("a");
                        return c = -1 !== j.indexOf("Safari") && -1 === j.indexOf("Chrome") && (-1 === t || Number(j.substr(t + 8, 1)) > 3), p = c && 6 > Number(j.substr(j.indexOf("Version/") + 8, 1)), f = -1 !== j.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(j) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(j)) && (m = parseFloat(RegExp.$1)), e ? (e.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(e.style.opacity)) : !1;
                    }(),
                    U = function U(t) {
                        return x.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1;
                    },
                    q = function q(t) {
                        window.console && console.log(t);
                    },
                    V = "",
                    G = "",
                    W = function W(t, e) {
                        e = e || L;
                        var i,
                            s,
                            r = e.style;
                        if (void 0 !== r[t]) return t;
                        for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], s = 5; --s > -1 && void 0 === r[i[s] + t];) {}
                        return s >= 0 ? (G = 3 === s ? "ms" : i[s], V = "-" + G.toLowerCase() + "-", G + t) : null;
                    },
                    Z = E.defaultView ? E.defaultView.getComputedStyle : function () {},
                    Q = a.getStyle = function (t, e, i, s, r) {
                        var n;
                        return Y || "opacity" !== e ? (!s && t.style[e] ? n = t.style[e] : (i = i || Z(t)) ? n = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(k, "-$1").toLowerCase()) : t.currentStyle && (n = t.currentStyle[e]), null == r || n && "none" !== n && "auto" !== n && "auto auto" !== n ? n : r) : U(t);
                    },
                    $ = B.convertToPixels = function (t, i, s, r, n) {
                        if ("px" === r || !r) return s;
                        if ("auto" === r || !s) return 0;
                        var o,
                            l,
                            h,
                            _ = A.test(i),
                            u = t,
                            c = L.style,
                            f = 0 > s;
                        if (f && (s = -s), "%" === r && -1 !== i.indexOf("border")) o = s / 100 * (_ ? t.clientWidth : t.clientHeight);
                        else {
                            if (c.cssText = "border:0 solid red;position:" + Q(t, "position") + ";line-height:0;", "%" !== r && u.appendChild && "v" !== r.charAt(0) && "rem" !== r) c[_ ? "borderLeftWidth" : "borderTopWidth"] = s + r;
                            else {
                                if (u = t.parentNode || E.body, l = u._gsCache, h = e.ticker.frame, l && _ && l.time === h) return l.width * s / 100;
                                c[_ ? "width" : "height"] = s + r;
                            }
                            u.appendChild(L), o = parseFloat(L[_ ? "offsetWidth" : "offsetHeight"]), u.removeChild(L), _ && "%" === r && a.cacheWidths !== !1 && (l = u._gsCache = u._gsCache || {}, l.time = h, l.width = 100 * (o / s)), 0 !== o || n || (o = $(t, i, s, r, !0));
                        }
                        return f ? -o : o;
                    },
                    H = B.calculateOffset = function (t, e, i) {
                        if ("absolute" !== Q(t, "position", i)) return 0;
                        var s = "left" === e ? "Left" : "Top",
                            r = Q(t, "margin" + s, i);
                        return t["offset" + s] - ($(t, e, parseFloat(r), r.replace(T, "")) || 0);
                    },
                    K = function K(t, e) {
                        var i,
                            s,
                            r,
                            n = {};
                        if (e = e || Z(t, null)) {
                            if (i = e.length)
                                for (; --i > -1;) {
                                    r = e[i], (-1 === r.indexOf("-transform") || ke === r) && (n[r.replace(S, O)] = e.getPropertyValue(r));
                                } else
                                    for (i in e) {
                                        (-1 === i.indexOf("Transform") || Pe === i) && (n[i] = e[i]);
                                    }
                        } else if (e = t.currentStyle || t.style)
                            for (i in e) {
                                "string" == typeof i && void 0 === n[i] && (n[i.replace(S, O)] = e[i]);
                            }
                        return Y || (n.opacity = U(t)), s = Ne(t, e, !1), n.rotation = s.rotation, n.skewX = s.skewX, n.scaleX = s.scaleX, n.scaleY = s.scaleY, n.x = s.x, n.y = s.y, Re && (n.z = s.z, n.rotationX = s.rotationX, n.rotationY = s.rotationY, n.scaleZ = s.scaleZ), n.filters && delete n.filters, n;
                    },
                    J = function J(t, e, i, s, r) {
                        var n,
                            a,
                            o,
                            l = {},
                            h = t.style;
                        for (a in i) {
                            "cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (n = i[a]) || r && r[a]) && -1 === a.indexOf("Origin") && ("number" == typeof n || "string" == typeof n) && (l[a] = "auto" !== n || "left" !== a && "top" !== a ? "" !== n && "auto" !== n && "none" !== n || "string" != typeof e[a] || "" === e[a].replace(y, "") ? n : 0 : H(t, a), void 0 !== h[a] && (o = new pe(h, a, h[a], o)));
                        }
                        if (s)
                            for (a in s) {
                                "className" !== a && (l[a] = s[a]);
                            }
                        return {
                            difs: l,
                            firstMPT: o
                        };
                    },
                    te = {
                        width: ["Left", "Right"],
                        height: ["Top", "Bottom"]
                    },
                    ee = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                    ie = function ie(t, e, i) {
                        var s = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
                            r = te[e],
                            n = r.length;
                        for (i = i || Z(t, null); --n > -1;) {
                            s -= parseFloat(Q(t, "padding" + r[n], i, !0)) || 0, s -= parseFloat(Q(t, "border" + r[n] + "Width", i, !0)) || 0;
                        }
                        return s;
                    },
                    se = function se(t, e) {
                        if ("contain" === t || "auto" === t || "auto auto" === t) return t + " ";
                        (null == t || "" === t) && (t = "0 0");
                        var i = t.split(" "),
                            s = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : i[0],
                            r = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : i[1];
                        return null == r ? r = "center" === s ? "50%" : "0" : "center" === r && (r = "50%"), ("center" === s || isNaN(parseFloat(s)) && -1 === (s + "").indexOf("=")) && (s = "50%"), t = s + " " + r + (i.length > 2 ? " " + i[2] : ""), e && (e.oxp = -1 !== s.indexOf("%"), e.oyp = -1 !== r.indexOf("%"), e.oxr = "=" === s.charAt(1), e.oyr = "=" === r.charAt(1), e.ox = parseFloat(s.replace(y, "")), e.oy = parseFloat(r.replace(y, "")), e.v = t), e || t;
                    },
                    re = function re(t, e) {
                        return "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e);
                    },
                    ne = function ne(t, e) {
                        return null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t);
                    },
                    ae = function ae(t, e, i, s) {
                        var r,
                            n,
                            a,
                            o,
                            l,
                            h = 1e-6;
                        return null == t ? o = e : "number" == typeof t ? o = t : (r = 360, n = t.split("_"), l = "=" === t.charAt(1), a = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(n[0].substr(2)) : parseFloat(n[0])) * (-1 === t.indexOf("rad") ? 1 : F) - (l ? 0 : e), n.length && (s && (s[i] = e + a), -1 !== t.indexOf("short") && (a %= r, a !== a % (r / 2) && (a = 0 > a ? a + r : a - r)), -1 !== t.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * r) % r - (0 | a / r) * r : -1 !== t.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * r) % r - (0 | a / r) * r)), o = e + a), h > o && o > -h && (o = 0), o;
                    },
                    oe = {
                        aqua: [0, 255, 255],
                        lime: [0, 255, 0],
                        silver: [192, 192, 192],
                        black: [0, 0, 0],
                        maroon: [128, 0, 0],
                        teal: [0, 128, 128],
                        blue: [0, 0, 255],
                        navy: [0, 0, 128],
                        white: [255, 255, 255],
                        fuchsia: [255, 0, 255],
                        olive: [128, 128, 0],
                        yellow: [255, 255, 0],
                        orange: [255, 165, 0],
                        gray: [128, 128, 128],
                        purple: [128, 0, 128],
                        green: [0, 128, 0],
                        red: [255, 0, 0],
                        pink: [255, 192, 203],
                        cyan: [0, 255, 255],
                        transparent: [255, 255, 255, 0]
                    },
                    le = function le(t, e, i) {
                        return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t, 0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5;
                    },
                    he = a.parseColor = function (t, e) {
                        var i, s, r, n, a, o, l, h, _, u, c;
                        if (t) {
                            if ("number" == typeof t) i = [t >> 16, 255 & t >> 8, 255 & t];
                            else {
                                if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), oe[t]) i = oe[t];
                                else if ("#" === t.charAt(0)) 4 === t.length && (s = t.charAt(1), r = t.charAt(2), n = t.charAt(3), t = "#" + s + s + r + r + n + n), t = parseInt(t.substr(1), 16), i = [t >> 16, 255 & t >> 8, 255 & t];
                                else if ("hsl" === t.substr(0, 3)) {
                                    if (i = c = t.match(d), e) {
                                        if (-1 !== t.indexOf("=")) return t.match(g);
                                    } else a = Number(i[0]) % 360 / 360, o = Number(i[1]) / 100, l = Number(i[2]) / 100, r = .5 >= l ? l * (o + 1) : l + o - l * o, s = 2 * l - r, i.length > 3 && (i[3] = Number(t[3])), i[0] = le(a + 1 / 3, s, r), i[1] = le(a, s, r), i[2] = le(a - 1 / 3, s, r);
                                } else i = t.match(d) || oe.transparent;
                                i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), i.length > 3 && (i[3] = Number(i[3]));
                            }
                        } else i = oe.black;
                        return e && !c && (s = i[0] / 255, r = i[1] / 255, n = i[2] / 255, h = Math.max(s, r, n), _ = Math.min(s, r, n), l = (h + _) / 2, h === _ ? a = o = 0 : (u = h - _, o = l > .5 ? u / (2 - h - _) : u / (h + _), a = h === s ? (r - n) / u + (n > r ? 6 : 0) : h === r ? (n - s) / u + 2 : (s - r) / u + 4, a *= 60), i[0] = 0 | a + .5, i[1] = 0 | 100 * o + .5, i[2] = 0 | 100 * l + .5), i;
                    },
                    _e = function _e(t, e) {
                        var i,
                            s,
                            r,
                            n = t.match(ue) || [],
                            a = 0,
                            o = n.length ? "" : t;
                        for (i = 0; n.length > i; i++) {
                            s = n[i], r = t.substr(a, t.indexOf(s, a) - a), a += r.length + s.length, s = he(s, e), 3 === s.length && s.push(1), o += r + (e ? "hsla(" + s[0] + "," + s[1] + "%," + s[2] + "%," + s[3] : "rgba(" + s.join(",")) + ")";
                        }
                        return o;
                    },
                    ue = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
                for (h in oe) {
                    ue += "|" + h + "\\b";
                }
                ue = RegExp(ue + ")", "gi"), a.colorStringFilter = function (t) {
                    var e,
                        i = t[0] + t[1];
                    ue.lastIndex = 0, ue.test(i) && (e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), t[0] = _e(t[0], e), t[1] = _e(t[1], e));
                }, e.defaultStringFilter || (e.defaultStringFilter = a.colorStringFilter);
                var ce = function ce(t, e, i, s) {
                        if (null == t) return function (t) {
                            return t;
                        };
                        var r,
                            n = e ? (t.match(ue) || [""])[0] : "",
                            a = t.split(n).join("").match(v) || [],
                            o = t.substr(0, t.indexOf(a[0])),
                            l = ")" === t.charAt(t.length - 1) ? ")" : "",
                            h = -1 !== t.indexOf(" ") ? " " : ",",
                            _ = a.length,
                            u = _ > 0 ? a[0].replace(d, "") : "";
                        return _ ? r = e ? function (t) {
                            var e, c, f, p;
                            if ("number" == typeof t) t += u;
                            else if (s && M.test(t)) {
                                for (p = t.replace(M, "|").split("|"), f = 0; p.length > f; f++) {
                                    p[f] = r(p[f]);
                                }
                                return p.join(",");
                            }
                            if (e = (t.match(ue) || [n])[0], c = t.split(e).join("").match(v) || [], f = c.length, _ > f--)
                                for (; _ > ++f;) {
                                    c[f] = i ? c[0 | (f - 1) / 2] : a[f];
                                }
                            return o + c.join(h) + h + e + l + (-1 !== t.indexOf("inset") ? " inset" : "");
                        } : function (t) {
                            var e, n, c;
                            if ("number" == typeof t) t += u;
                            else if (s && M.test(t)) {
                                for (n = t.replace(M, "|").split("|"), c = 0; n.length > c; c++) {
                                    n[c] = r(n[c]);
                                }
                                return n.join(",");
                            }
                            if (e = t.match(v) || [], c = e.length, _ > c--)
                                for (; _ > ++c;) {
                                    e[c] = i ? e[0 | (c - 1) / 2] : a[c];
                                }
                            return o + e.join(h) + l;
                        } : function (t) {
                            return t;
                        };
                    },
                    fe = function fe(t) {
                        return t = t.split(","),
                            function (e, i, s, r, n, a, o) {
                                var l,
                                    h = (i + "").split(" ");
                                for (o = {}, l = 0; 4 > l; l++) {
                                    o[t[l]] = h[l] = h[l] || h[(l - 1) / 2 >> 0];
                                }
                                return r.parse(e, o, n, a);
                            };
                    },
                    pe = (B._setPluginRatio = function (t) {
                        this.plugin.setRatio(t);
                        for (var e, i, s, r, n = this.data, a = n.proxy, o = n.firstMPT, l = 1e-6; o;) {
                            e = a[o.v], o.r ? e = Math.round(e) : l > e && e > -l && (e = 0), o.t[o.p] = e, o = o._next;
                        }
                        if (n.autoRotate && (n.autoRotate.rotation = a.rotation), 1 === t)
                            for (o = n.firstMPT; o;) {
                                if (i = o.t, i.type) {
                                    if (1 === i.type) {
                                        for (r = i.xs0 + i.s + i.xs1, s = 1; i.l > s; s++) {
                                            r += i["xn" + s] + i["xs" + (s + 1)];
                                        }
                                        i.e = r;
                                    }
                                } else i.e = i.s + i.xs0;
                                o = o._next;
                            }
                    }, function (t, e, i, s, r) {
                        this.t = t, this.p = e, this.v = i, this.r = r, s && (s._prev = this, this._next = s);
                    }),
                    me = (B._parseToProxy = function (t, e, i, s, r, n) {
                        var a,
                            o,
                            l,
                            h,
                            _,
                            u = s,
                            c = {},
                            f = {},
                            p = i._transform,
                            m = I;
                        for (i._transform = null, I = e, s = _ = i.parse(t, e, s, r), I = m, n && (i._transform = p, u && (u._prev = null, u._prev && (u._prev._next = null))); s && s !== u;) {
                            if (1 >= s.type && (o = s.p, f[o] = s.s + s.c, c[o] = s.s, n || (h = new pe(s, "s", o, h, s.r), s.c = 0), 1 === s.type))
                                for (a = s.l; --a > 0;) {
                                    l = "xn" + a, o = s.p + "_" + l, f[o] = s.data[l], c[o] = s[l], n || (h = new pe(s, l, o, h, s.rxp[l]));
                                }
                            s = s._next;
                        }
                        return {
                            proxy: c,
                            end: f,
                            firstMPT: h,
                            pt: _
                        };
                    }, B.CSSPropTween = function (t, e, s, r, a, o, l, h, _, u, c) {
                        this.t = t, this.p = e, this.s = s, this.c = r, this.n = l || e, t instanceof me || n.push(this.n), this.r = h, this.type = o || 0, _ && (this.pr = _, i = !0), this.b = void 0 === u ? s : u, this.e = void 0 === c ? s + r : c, a && (this._next = a, a._prev = this);
                    }),
                    de = function de(t, e, i, s, r, n) {
                        var a = new me(t, e, i, s - i, r, -1, n);
                        return a.b = i, a.e = a.xs0 = s, a;
                    },
                    ge = a.parseComplex = function (t, e, i, s, r, n, a, o, l, h) {
                        i = i || n || "", a = new me(t, e, 0, 0, a, h ? 2 : 1, null, !1, o, i, s), s += "";
                        var u,
                            c,
                            f,
                            p,
                            m,
                            v,
                            y,
                            T,
                            x,
                            w,
                            b,
                            P,
                            k,
                            S = i.split(", ").join(",").split(" "),
                            R = s.split(", ").join(",").split(" "),
                            O = S.length,
                            A = _ !== !1;
                        for ((-1 !== s.indexOf(",") || -1 !== i.indexOf(",")) && (S = S.join(" ").replace(M, ", ").split(" "), R = R.join(" ").replace(M, ", ").split(" "), O = S.length), O !== R.length && (S = (n || "").split(" "), O = S.length), a.plugin = l, a.setRatio = h, ue.lastIndex = 0, u = 0; O > u; u++) {
                            if (p = S[u], m = R[u], T = parseFloat(p), T || 0 === T) a.appendXtra("", T, re(m, T), m.replace(g, ""), A && -1 !== m.indexOf("px"), !0);
                            else if (r && ue.test(p)) P = "," === m.charAt(m.length - 1) ? ")," : ")", k = -1 !== m.indexOf("hsl") && Y, p = he(p, k), m = he(m, k), x = p.length + m.length > 6, x && !Y && 0 === m[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(R[u]).join("transparent")) : (Y || (x = !1), k ? a.appendXtra(x ? "hsla(" : "hsl(", p[0], re(m[0], p[0]), ",", !1, !0).appendXtra("", p[1], re(m[1], p[1]), "%,", !1).appendXtra("", p[2], re(m[2], p[2]), x ? "%," : "%" + P, !1) : a.appendXtra(x ? "rgba(" : "rgb(", p[0], m[0] - p[0], ",", !0, !0).appendXtra("", p[1], m[1] - p[1], ",", !0).appendXtra("", p[2], m[2] - p[2], x ? "," : P, !0), x && (p = 4 > p.length ? 1 : p[3], a.appendXtra("", p, (4 > m.length ? 1 : m[3]) - p, P, !1))), ue.lastIndex = 0;
                            else if (v = p.match(d)) {
                                if (y = m.match(g), !y || y.length !== v.length) return a;
                                for (f = 0, c = 0; v.length > c; c++) {
                                    b = v[c], w = p.indexOf(b, f), a.appendXtra(p.substr(f, w - f), Number(b), re(y[c], b), "", A && "px" === p.substr(w + b.length, 2), 0 === c), f = w + b.length;
                                }
                                a["xs" + a.l] += p.substr(f);
                            } else a["xs" + a.l] += a.l ? " " + p : p;
                        }
                        if (-1 !== s.indexOf("=") && a.data) {
                            for (P = a.xs0 + a.data.s, u = 1; a.l > u; u++) {
                                P += a["xs" + u] + a.data["xn" + u];
                            }
                            a.e = P + a["xs" + u];
                        }
                        return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a;
                    },
                    ve = 9;
                for (h = me.prototype, h.l = h.pr = 0; --ve > 0;) {
                    h["xn" + ve] = 0, h["xs" + ve] = "";
                }
                h.xs0 = "", h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null, h.appendXtra = function (t, e, i, s, r, n) {
                    var a = this,
                        o = a.l;
                    return a["xs" + o] += n && o ? " " + t : t || "", i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = s || "", o > 0 ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = r, a["xn" + o] = e, a.plugin || (a.xfirst = new me(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, r, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {
                        s: e + i
                    }, a.rxp = {}, a.s = e, a.c = i, a.r = r, a)) : (a["xs" + o] += e + (s || ""), a);
                };
                var ye = function ye(t, e) {
                        e = e || {}, this.p = e.prefix ? W(t) || t : t, l[t] = l[this.p] = this, this.format = e.formatter || ce(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.pr = e.priority || 0;
                    },
                    Te = B._registerComplexSpecialProp = function (t, e, i) {
                        "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && (e = {
                            parser: i
                        });
                        var s,
                            r,
                            n = t.split(","),
                            a = e.defaultValue;
                        for (i = i || [a], s = 0; n.length > s; s++) {
                            e.prefix = 0 === s && e.prefix, e.defaultValue = i[s] || a, r = new ye(n[s], e);
                        }
                    },
                    xe = function xe(t) {
                        if (!l[t]) {
                            var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                            Te(t, {
                                parser: function parser(t, i, s, r, n, a, h) {
                                    var _ = o.com.greensock.plugins[e];
                                    return _ ? (_._cssRegister(), l[s].parse(t, i, s, r, n, a, h)) : (q("Error: " + e + " js file not loaded."), n);
                                }
                            });
                        }
                    };
                h = ye.prototype, h.parseComplex = function (t, e, i, s, r, n) {
                    var a,
                        o,
                        l,
                        h,
                        _,
                        u,
                        c = this.keyword;
                    if (this.multi && (M.test(i) || M.test(e) ? (o = e.replace(M, "|").split("|"), l = i.replace(M, "|").split("|")) : c && (o = [e], l = [i])), l) {
                        for (h = l.length > o.length ? l.length : o.length, a = 0; h > a; a++) {
                            e = o[a] = o[a] || this.dflt, i = l[a] = l[a] || this.dflt, c && (_ = e.indexOf(c), u = i.indexOf(c), _ !== u && (-1 === u ? o[a] = o[a].split(c).join("") : -1 === _ && (o[a] += " " + c)));
                        }
                        e = o.join(", "), i = l.join(", ");
                    }
                    return ge(t, this.p, e, i, this.clrs, this.dflt, s, this.pr, r, n);
                }, h.parse = function (t, e, i, s, n, a) {
                    return this.parseComplex(t.style, this.format(Q(t, this.p, r, !1, this.dflt)), this.format(e), n, a);
                }, a.registerSpecialProp = function (t, e, i) {
                    Te(t, {
                        parser: function parser(t, s, r, n, a, o) {
                            var l = new me(t, r, 0, 0, a, 2, r, !1, i);
                            return l.plugin = o, l.setRatio = e(t, s, n._tween, r), l;
                        },
                        priority: i
                    });
                }, a.useSVGTransformAttr = c || f;
                var we,
                    be = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                    Pe = W("transform"),
                    ke = V + "transform",
                    Se = W("transformOrigin"),
                    Re = null !== W("perspective"),
                    Oe = B.Transform = function () {
                        this.perspective = parseFloat(a.defaultTransformPerspective) || 0, this.force3D = a.defaultForce3D !== !1 && Re ? a.defaultForce3D || "auto" : !1;
                    },
                    Ae = window.SVGElement,
                    Ce = function Ce(t, e, i) {
                        var s,
                            r = E.createElementNS("http://www.w3.org/2000/svg", t),
                            n = /([a-z])([A-Z])/g;
                        for (s in i) {
                            r.setAttributeNS(null, s.replace(n, "$1-$2").toLowerCase(), i[s]);
                        }
                        return e.appendChild(r), r;
                    },
                    De = E.documentElement,
                    Me = function () {
                        var t,
                            e,
                            i,
                            s = m || /Android/i.test(j) && !window.chrome;
                        return E.createElementNS && !s && (t = Ce("svg", De), e = Ce("rect", t, {
                            width: 100,
                            height: 50,
                            x: 100
                        }), i = e.getBoundingClientRect().width, e.style[Se] = "50% 50%", e.style[Pe] = "scaleX(0.5)", s = i === e.getBoundingClientRect().width && !(f && Re), De.removeChild(t)), s;
                    }(),
                    ze = function ze(t, e, i, s, r) {
                        var n,
                            o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y,
                            T = t._gsTransform,
                            x = Ee(t, !0);
                        T && (v = T.xOrigin, y = T.yOrigin), (!s || 2 > (n = s.split(" ")).length) && (c = t.getBBox(), e = se(e).split(" "), n = [(-1 !== e[0].indexOf("%") ? parseFloat(e[0]) / 100 * c.width : parseFloat(e[0])) + c.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * c.height : parseFloat(e[1])) + c.y]), i.xOrigin = h = parseFloat(n[0]), i.yOrigin = _ = parseFloat(n[1]), s && x !== Ie && (u = x[0], c = x[1], f = x[2], p = x[3], m = x[4], d = x[5], g = u * p - c * f, o = h * (p / g) + _ * (-f / g) + (f * d - p * m) / g, l = h * (-c / g) + _ * (u / g) - (u * d - c * m) / g, h = i.xOrigin = n[0] = o, _ = i.yOrigin = n[1] = l), T && (r || r !== !1 && a.defaultSmoothOrigin !== !1 ? (o = h - v, l = _ - y, T.xOffset += o * x[0] + l * x[2] - o, T.yOffset += o * x[1] + l * x[3] - l) : T.xOffset = T.yOffset = 0), t.setAttribute("data-svg-origin", n.join(" "));
                    },
                    Fe = function Fe(t) {
                        return !!(Ae && "function" == typeof t.getBBox && t.getCTM && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM));
                    },
                    Ie = [1, 0, 0, 1, 0, 0],
                    Ee = function Ee(t, e) {
                        var i,
                            s,
                            r,
                            n,
                            a,
                            o = t._gsTransform || new Oe(),
                            l = 1e5;
                        if (Pe ? s = Q(t, ke, null, !0) : t.currentStyle && (s = t.currentStyle.filter.match(C), s = s && 4 === s.length ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), o.x || 0, o.y || 0].join(",") : ""), i = !s || "none" === s || "matrix(1, 0, 0, 1, 0, 0)" === s, (o.svg || t.getBBox && Fe(t)) && (i && -1 !== (t.style[Pe] + "").indexOf("matrix") && (s = t.style[Pe], i = 0), r = t.getAttribute("transform"), i && r && (-1 !== r.indexOf("matrix") ? (s = r, i = 0) : -1 !== r.indexOf("translate") && (s = "matrix(1,0,0,1," + r.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", i = 0))), i) return Ie;
                        for (r = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], ve = r.length; --ve > -1;) {
                            n = Number(r[ve]), r[ve] = (a = n - (n |= 0)) ? (0 | a * l + (0 > a ? -.5 : .5)) / l + n : n;
                        }
                        return e && r.length > 6 ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r;
                    },
                    Ne = B.getTransform = function (t, i, s, n) {
                        if (t._gsTransform && s && !n) return t._gsTransform;
                        var o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f = s ? t._gsTransform || new Oe() : new Oe(),
                            p = 0 > f.scaleX,
                            m = 2e-5,
                            d = 1e5,
                            g = Re ? parseFloat(Q(t, Se, i, !1, "0 0 0").split(" ")[2]) || f.zOrigin || 0 : 0,
                            v = parseFloat(a.defaultTransformPerspective) || 0;
                        if (f.svg = !(!t.getBBox || !Fe(t)), f.svg && (ze(t, Q(t, Se, r, !1, "50% 50%") + "", f, t.getAttribute("data-svg-origin")), we = a.useSVGTransformAttr || Me), o = Ee(t), o !== Ie) {
                            if (16 === o.length) {
                                var y,
                                    T,
                                    x,
                                    w,
                                    b,
                                    P = o[0],
                                    k = o[1],
                                    S = o[2],
                                    R = o[3],
                                    O = o[4],
                                    A = o[5],
                                    C = o[6],
                                    D = o[7],
                                    M = o[8],
                                    z = o[9],
                                    I = o[10],
                                    E = o[12],
                                    N = o[13],
                                    L = o[14],
                                    X = o[11],
                                    B = Math.atan2(C, I);
                                f.zOrigin && (L = -f.zOrigin, E = M * L - o[12], N = z * L - o[13], L = I * L + f.zOrigin - o[14]), f.rotationX = B * F, B && (w = Math.cos(-B), b = Math.sin(-B), y = O * w + M * b, T = A * w + z * b, x = C * w + I * b, M = O * -b + M * w, z = A * -b + z * w, I = C * -b + I * w, X = D * -b + X * w, O = y, A = T, C = x), B = Math.atan2(M, I), f.rotationY = B * F, B && (w = Math.cos(-B), b = Math.sin(-B), y = P * w - M * b, T = k * w - z * b, x = S * w - I * b, z = k * b + z * w, I = S * b + I * w, X = R * b + X * w, P = y, k = T, S = x), B = Math.atan2(k, P), f.rotation = B * F, B && (w = Math.cos(-B), b = Math.sin(-B), P = P * w + O * b, T = k * w + A * b, A = k * -b + A * w, C = S * -b + C * w, k = T), f.rotationX && Math.abs(f.rotationX) + Math.abs(f.rotation) > 359.9 && (f.rotationX = f.rotation = 0, f.rotationY += 180), f.scaleX = (0 | Math.sqrt(P * P + k * k) * d + .5) / d, f.scaleY = (0 | Math.sqrt(A * A + z * z) * d + .5) / d, f.scaleZ = (0 | Math.sqrt(C * C + I * I) * d + .5) / d, f.skewX = 0, f.perspective = X ? 1 / (0 > X ? -X : X) : 0, f.x = E, f.y = N, f.z = L, f.svg && (f.x -= f.xOrigin - (f.xOrigin * P - f.yOrigin * O), f.y -= f.yOrigin - (f.yOrigin * k - f.xOrigin * A));
                            } else if (!(Re && !n && o.length && f.x === o[4] && f.y === o[5] && (f.rotationX || f.rotationY) || void 0 !== f.x && "none" === Q(t, "display", i))) {
                                var j = o.length >= 6,
                                    Y = j ? o[0] : 1,
                                    U = o[1] || 0,
                                    q = o[2] || 0,
                                    V = j ? o[3] : 1;
                                f.x = o[4] || 0, f.y = o[5] || 0, h = Math.sqrt(Y * Y + U * U), _ = Math.sqrt(V * V + q * q), u = Y || U ? Math.atan2(U, Y) * F : f.rotation || 0, c = q || V ? Math.atan2(q, V) * F + u : f.skewX || 0, Math.abs(c) > 90 && 270 > Math.abs(c) && (p ? (h *= -1, c += 0 >= u ? 180 : -180, u += 0 >= u ? 180 : -180) : (_ *= -1, c += 0 >= c ? 180 : -180)), f.scaleX = h, f.scaleY = _, f.rotation = u, f.skewX = c, Re && (f.rotationX = f.rotationY = f.z = 0, f.perspective = v, f.scaleZ = 1), f.svg && (f.x -= f.xOrigin - (f.xOrigin * Y + f.yOrigin * q), f.y -= f.yOrigin - (f.xOrigin * U + f.yOrigin * V));
                            }
                            f.zOrigin = g;
                            for (l in f) {
                                m > f[l] && f[l] > -m && (f[l] = 0);
                            }
                        }
                        return s && (t._gsTransform = f, f.svg && (we && t.style[Pe] ? e.delayedCall(.001, function () {
                            je(t.style, Pe);
                        }) : !we && t.getAttribute("transform") && e.delayedCall(.001, function () {
                            t.removeAttribute("transform");
                        }))), f;
                    },
                    Le = function Le(t) {
                        var e,
                            i,
                            s = this.data,
                            r = -s.rotation * z,
                            n = r + s.skewX * z,
                            a = 1e5,
                            o = (0 | Math.cos(r) * s.scaleX * a) / a,
                            l = (0 | Math.sin(r) * s.scaleX * a) / a,
                            h = (0 | Math.sin(n) * -s.scaleY * a) / a,
                            _ = (0 | Math.cos(n) * s.scaleY * a) / a,
                            u = this.t.style,
                            c = this.t.currentStyle;
                        if (c) {
                            i = l, l = -h, h = -i, e = c.filter, u.filter = "";
                            var f,
                                p,
                                d = this.t.offsetWidth,
                                g = this.t.offsetHeight,
                                v = "absolute" !== c.position,
                                y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + l + ", M21=" + h + ", M22=" + _,
                                w = s.x + d * s.xPercent / 100,
                                b = s.y + g * s.yPercent / 100;
                            if (null != s.ox && (f = (s.oxp ? .01 * d * s.ox : s.ox) - d / 2, p = (s.oyp ? .01 * g * s.oy : s.oy) - g / 2, w += f - (f * o + p * l), b += p - (f * h + p * _)), v ? (f = d / 2, p = g / 2, y += ", Dx=" + (f - (f * o + p * l) + w) + ", Dy=" + (p - (f * h + p * _) + b) + ")") : y += ", sizingMethod='auto expand')", u.filter = -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.replace(D, y) : y + " " + e, (0 === t || 1 === t) && 1 === o && 0 === l && 0 === h && 1 === _ && (v && -1 === y.indexOf("Dx=0, Dy=0") || x.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf("gradient(" && e.indexOf("Alpha")) && u.removeAttribute("filter")), !v) {
                                var P,
                                    k,
                                    S,
                                    R = 8 > m ? 1 : -1;
                                for (f = s.ieOffsetX || 0, p = s.ieOffsetY || 0, s.ieOffsetX = Math.round((d - ((0 > o ? -o : o) * d + (0 > l ? -l : l) * g)) / 2 + w), s.ieOffsetY = Math.round((g - ((0 > _ ? -_ : _) * g + (0 > h ? -h : h) * d)) / 2 + b), ve = 0; 4 > ve; ve++) {
                                    k = ee[ve], P = c[k], i = -1 !== P.indexOf("px") ? parseFloat(P) : $(this.t, k, parseFloat(P), P.replace(T, "")) || 0, S = i !== s[k] ? 2 > ve ? -s.ieOffsetX : -s.ieOffsetY : 2 > ve ? f - s.ieOffsetX : p - s.ieOffsetY, u[k] = (s[k] = Math.round(i - S * (0 === ve || 2 === ve ? 1 : R))) + "px";
                                }
                            }
                        }
                    },
                    Xe = B.set3DTransformRatio = B.setTransformRatio = function (t) {
                        var e,
                            i,
                            s,
                            r,
                            n,
                            a,
                            o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y,
                            T,
                            x,
                            w,
                            b,
                            P,
                            k = this.data,
                            S = this.t.style,
                            R = k.rotation,
                            O = k.rotationX,
                            A = k.rotationY,
                            C = k.scaleX,
                            D = k.scaleY,
                            M = k.scaleZ,
                            F = k.x,
                            I = k.y,
                            E = k.z,
                            N = k.svg,
                            L = k.perspective,
                            X = k.force3D;
                        if (!(((1 !== t && 0 !== t || "auto" !== X || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && X || E || L || A || O) && (!we || !N) && Re)) return R || k.skewX || N ? (R *= z, b = k.skewX * z, P = 1e5, e = Math.cos(R) * C, r = Math.sin(R) * C, i = Math.sin(R - b) * -D, n = Math.cos(R - b) * D, b && "simple" === k.skewType && (v = Math.tan(b), v = Math.sqrt(1 + v * v), i *= v, n *= v, k.skewY && (e *= v, r *= v)), N && (F += k.xOrigin - (k.xOrigin * e + k.yOrigin * i) + k.xOffset, I += k.yOrigin - (k.xOrigin * r + k.yOrigin * n) + k.yOffset, we && (k.xPercent || k.yPercent) && (m = this.t.getBBox(), F += .01 * k.xPercent * m.width, I += .01 * k.yPercent * m.height), m = 1e-6, m > F && F > -m && (F = 0), m > I && I > -m && (I = 0)), T = (0 | e * P) / P + "," + (0 | r * P) / P + "," + (0 | i * P) / P + "," + (0 | n * P) / P + "," + F + "," + I + ")", N && we ? this.t.setAttribute("transform", "matrix(" + T) : S[Pe] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix(" : "matrix(") + T) : S[Pe] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix(" : "matrix(") + C + ",0,0," + D + "," + F + "," + I + ")", void 0;
                        if (f && (m = 1e-4, m > C && C > -m && (C = M = 2e-5), m > D && D > -m && (D = M = 2e-5), !L || k.z || k.rotationX || k.rotationY || (L = 0)), R || k.skewX) R *= z, d = e = Math.cos(R), g = r = Math.sin(R), k.skewX && (R -= k.skewX * z, d = Math.cos(R), g = Math.sin(R), "simple" === k.skewType && (v = Math.tan(k.skewX * z), v = Math.sqrt(1 + v * v), d *= v, g *= v, k.skewY && (e *= v, r *= v))), i = -g, n = d;
                        else {
                            if (!(A || O || 1 !== M || L || N)) return S[Pe] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) translate3d(" : "translate3d(") + F + "px," + I + "px," + E + "px)" + (1 !== C || 1 !== D ? " scale(" + C + "," + D + ")" : ""), void 0;
                            e = n = 1, i = r = 0;
                        }
                        h = 1, s = a = o = l = _ = u = 0, c = L ? -1 / L : 0, p = k.zOrigin, m = 1e-6, x = ",", w = "0", R = A * z, R && (d = Math.cos(R), g = Math.sin(R), o = -g, _ = c * -g, s = e * g, a = r * g, h = d, c *= d, e *= d, r *= d), R = O * z, R && (d = Math.cos(R), g = Math.sin(R), v = i * d + s * g, y = n * d + a * g, l = h * g, u = c * g, s = i * -g + s * d, a = n * -g + a * d, h *= d, c *= d, i = v, n = y), 1 !== M && (s *= M, a *= M, h *= M, c *= M), 1 !== D && (i *= D, n *= D, l *= D, u *= D), 1 !== C && (e *= C, r *= C, o *= C, _ *= C), (p || N) && (p && (F += s * -p, I += a * -p, E += h * -p + p), N && (F += k.xOrigin - (k.xOrigin * e + k.yOrigin * i) + k.xOffset, I += k.yOrigin - (k.xOrigin * r + k.yOrigin * n) + k.yOffset), m > F && F > -m && (F = w), m > I && I > -m && (I = w), m > E && E > -m && (E = 0)), T = k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix3d(" : "matrix3d(", T += (m > e && e > -m ? w : e) + x + (m > r && r > -m ? w : r) + x + (m > o && o > -m ? w : o), T += x + (m > _ && _ > -m ? w : _) + x + (m > i && i > -m ? w : i) + x + (m > n && n > -m ? w : n), O || A ? (T += x + (m > l && l > -m ? w : l) + x + (m > u && u > -m ? w : u) + x + (m > s && s > -m ? w : s), T += x + (m > a && a > -m ? w : a) + x + (m > h && h > -m ? w : h) + x + (m > c && c > -m ? w : c) + x) : T += ",0,0,0,0,1,0,", T += F + x + I + x + E + x + (L ? 1 + -E / L : 1) + ")", S[Pe] = T;
                    };
                h = Oe.prototype, h.x = h.y = h.z = h.skewX = h.skewY = h.rotation = h.rotationX = h.rotationY = h.zOrigin = h.xPercent = h.yPercent = h.xOffset = h.yOffset = 0, h.scaleX = h.scaleY = h.scaleZ = 1, Te("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                    parser: function parser(t, e, i, s, n, o, l) {
                        if (s._lastParsedTransform === l) return n;
                        s._lastParsedTransform = l;
                        var h,
                            _,
                            u,
                            c,
                            f,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y = t._gsTransform,
                            T = t.style,
                            x = 1e-6,
                            w = be.length,
                            b = l,
                            P = {},
                            k = "transformOrigin";
                        if (l.display ? (c = Q(t, "display"), T.display = "block", h = Ne(t, r, !0, l.parseTransform), T.display = c) : h = Ne(t, r, !0, l.parseTransform), s._transform = h, "string" == typeof b.transform && Pe) c = L.style, c[Pe] = b.transform, c.display = "block", c.position = "absolute", E.body.appendChild(L), _ = Ne(L, null, !1), E.body.removeChild(L), _.perspective || (_.perspective = h.perspective), null != b.xPercent && (_.xPercent = ne(b.xPercent, h.xPercent)), null != b.yPercent && (_.yPercent = ne(b.yPercent, h.yPercent));
                        else if ("object" == (typeof b === "undefined" ? "undefined" : _typeof(b))) {
                            if (_ = {
                                    scaleX: ne(null != b.scaleX ? b.scaleX : b.scale, h.scaleX),
                                    scaleY: ne(null != b.scaleY ? b.scaleY : b.scale, h.scaleY),
                                    scaleZ: ne(b.scaleZ, h.scaleZ),
                                    x: ne(b.x, h.x),
                                    y: ne(b.y, h.y),
                                    z: ne(b.z, h.z),
                                    xPercent: ne(b.xPercent, h.xPercent),
                                    yPercent: ne(b.yPercent, h.yPercent),
                                    perspective: ne(b.transformPerspective, h.perspective)
                                }, d = b.directionalRotation, null != d)
                                if ("object" == (typeof d === "undefined" ? "undefined" : _typeof(d)))
                                    for (c in d) {
                                        b[c] = d[c];
                                    } else b.rotation = d;
                            "string" == typeof b.x && -1 !== b.x.indexOf("%") && (_.x = 0, _.xPercent = ne(b.x, h.xPercent)), "string" == typeof b.y && -1 !== b.y.indexOf("%") && (_.y = 0, _.yPercent = ne(b.y, h.yPercent)), _.rotation = ae("rotation" in b ? b.rotation : "shortRotation" in b ? b.shortRotation + "_short" : "rotationZ" in b ? b.rotationZ : h.rotation, h.rotation, "rotation", P), Re && (_.rotationX = ae("rotationX" in b ? b.rotationX : "shortRotationX" in b ? b.shortRotationX + "_short" : h.rotationX || 0, h.rotationX, "rotationX", P), _.rotationY = ae("rotationY" in b ? b.rotationY : "shortRotationY" in b ? b.shortRotationY + "_short" : h.rotationY || 0, h.rotationY, "rotationY", P)), _.skewX = null == b.skewX ? h.skewX : ae(b.skewX, h.skewX), _.skewY = null == b.skewY ? h.skewY : ae(b.skewY, h.skewY), (u = _.skewY - h.skewY) && (_.skewX += u, _.rotation += u);
                        }
                        for (Re && null != b.force3D && (h.force3D = b.force3D, m = !0), h.skewType = b.skewType || h.skewType || a.defaultSkewType, p = h.force3D || h.z || h.rotationX || h.rotationY || _.z || _.rotationX || _.rotationY || _.perspective, p || null == b.scale || (_.scaleZ = 1); --w > -1;) {
                            i = be[w], f = _[i] - h[i], (f > x || -x > f || null != b[i] || null != I[i]) && (m = !0, n = new me(h, i, h[i], f, n), i in P && (n.e = P[i]), n.xs0 = 0, n.plugin = o, s._overwriteProps.push(n.n));
                        }
                        return f = b.transformOrigin, h.svg && (f || b.svgOrigin) && (g = h.xOffset, v = h.yOffset, ze(t, se(f), _, b.svgOrigin, b.smoothOrigin), n = de(h, "xOrigin", (y ? h : _).xOrigin, _.xOrigin, n, k), n = de(h, "yOrigin", (y ? h : _).yOrigin, _.yOrigin, n, k), (g !== h.xOffset || v !== h.yOffset) && (n = de(h, "xOffset", y ? g : h.xOffset, h.xOffset, n, k), n = de(h, "yOffset", y ? v : h.yOffset, h.yOffset, n, k)), f = we ? null : "0px 0px"), (f || Re && p && h.zOrigin) && (Pe ? (m = !0, i = Se, f = (f || Q(t, i, r, !1, "50% 50%")) + "", n = new me(T, i, 0, 0, n, -1, k), n.b = T[i], n.plugin = o, Re ? (c = h.zOrigin, f = f.split(" "), h.zOrigin = (f.length > 2 && (0 === c || "0px" !== f[2]) ? parseFloat(f[2]) : c) || 0, n.xs0 = n.e = f[0] + " " + (f[1] || "50%") + " 0px", n = new me(h, "zOrigin", 0, 0, n, -1, n.n), n.b = c, n.xs0 = n.e = h.zOrigin) : n.xs0 = n.e = f) : se(f + "", h)), m && (s._transformType = h.svg && we || !p && 3 !== this._transformType ? 2 : 3), n;
                    },
                    prefix: !0
                }), Te("boxShadow", {
                    defaultValue: "0px 0px 0px 0px #999",
                    prefix: !0,
                    color: !0,
                    multi: !0,
                    keyword: "inset"
                }), Te("borderRadius", {
                    defaultValue: "0px",
                    parser: function parser(t, e, i, n, a) {
                        e = this.format(e);
                        var o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f,
                            p,
                            m,
                            d,
                            g,
                            v,
                            y,
                            T,
                            x,
                            w,
                            b = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                            P = t.style;
                        for (m = parseFloat(t.offsetWidth), d = parseFloat(t.offsetHeight), o = e.split(" "), l = 0; b.length > l; l++) {
                            this.p.indexOf("border") && (b[l] = W(b[l])), u = _ = Q(t, b[l], r, !1, "0px"), -1 !== u.indexOf(" ") && (_ = u.split(" "), u = _[0], _ = _[1]), c = h = o[l], f = parseFloat(u), v = u.substr((f + "").length), y = "=" === c.charAt(1), y ? (p = parseInt(c.charAt(0) + "1", 10), c = c.substr(2), p *= parseFloat(c), g = c.substr((p + "").length - (0 > p ? 1 : 0)) || "") : (p = parseFloat(c), g = c.substr((p + "").length)), "" === g && (g = s[i] || v), g !== v && (T = $(t, "borderLeft", f, v), x = $(t, "borderTop", f, v), "%" === g ? (u = 100 * (T / m) + "%", _ = 100 * (x / d) + "%") : "em" === g ? (w = $(t, "borderLeft", 1, "em"), u = T / w + "em", _ = x / w + "em") : (u = T + "px", _ = x + "px"), y && (c = parseFloat(u) + p + g, h = parseFloat(_) + p + g)), a = ge(P, b[l], u + " " + _, c + " " + h, !1, "0px", a);
                        }
                        return a;
                    },
                    prefix: !0,
                    formatter: ce("0px 0px 0px 0px", !1, !0)
                }), Te("backgroundPosition", {
                    defaultValue: "0 0",
                    parser: function parser(t, e, i, s, n, a) {
                        var o,
                            l,
                            h,
                            _,
                            u,
                            c,
                            f = "background-position",
                            p = r || Z(t, null),
                            d = this.format((p ? m ? p.getPropertyValue(f + "-x") + " " + p.getPropertyValue(f + "-y") : p.getPropertyValue(f) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                            g = this.format(e);
                        if (-1 !== d.indexOf("%") != (-1 !== g.indexOf("%")) && (c = Q(t, "backgroundImage").replace(R, ""), c && "none" !== c)) {
                            for (o = d.split(" "), l = g.split(" "), X.setAttribute("src", c), h = 2; --h > -1;) {
                                d = o[h], _ = -1 !== d.indexOf("%"), _ !== (-1 !== l[h].indexOf("%")) && (u = 0 === h ? t.offsetWidth - X.width : t.offsetHeight - X.height, o[h] = _ ? parseFloat(d) / 100 * u + "px" : 100 * (parseFloat(d) / u) + "%");
                            }
                            d = o.join(" ");
                        }
                        return this.parseComplex(t.style, d, g, n, a);
                    },
                    formatter: se
                }), Te("backgroundSize", {
                    defaultValue: "0 0",
                    formatter: se
                }), Te("perspective", {
                    defaultValue: "0px",
                    prefix: !0
                }), Te("perspectiveOrigin", {
                    defaultValue: "50% 50%",
                    prefix: !0
                }), Te("transformStyle", {
                    prefix: !0
                }), Te("backfaceVisibility", {
                    prefix: !0
                }), Te("userSelect", {
                    prefix: !0
                }), Te("margin", {
                    parser: fe("marginTop,marginRight,marginBottom,marginLeft")
                }), Te("padding", {
                    parser: fe("paddingTop,paddingRight,paddingBottom,paddingLeft")
                }), Te("clip", {
                    defaultValue: "rect(0px,0px,0px,0px)",
                    parser: function parser(t, e, i, s, n, a) {
                        var o, l, h;
                        return 9 > m ? (l = t.currentStyle, h = 8 > m ? " " : ",", o = "rect(" + l.clipTop + h + l.clipRight + h + l.clipBottom + h + l.clipLeft + ")", e = this.format(e).split(",").join(h)) : (o = this.format(Q(t, this.p, r, !1, this.dflt)), e = this.format(e)), this.parseComplex(t.style, o, e, n, a);
                    }
                }), Te("textShadow", {
                    defaultValue: "0px 0px 0px #999",
                    color: !0,
                    multi: !0
                }), Te("autoRound,strictUnits", {
                    parser: function parser(t, e, i, s, r) {
                        return r;
                    }
                }), Te("border", {
                    defaultValue: "0px solid #000",
                    parser: function parser(t, e, i, s, n, a) {
                        return this.parseComplex(t.style, this.format(Q(t, "borderTopWidth", r, !1, "0px") + " " + Q(t, "borderTopStyle", r, !1, "solid") + " " + Q(t, "borderTopColor", r, !1, "#000")), this.format(e), n, a);
                    },
                    color: !0,
                    formatter: function formatter(t) {
                        var e = t.split(" ");
                        return e[0] + " " + (e[1] || "solid") + " " + (t.match(ue) || ["#000"])[0];
                    }
                }), Te("borderWidth", {
                    parser: fe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
                }), Te("float,cssFloat,styleFloat", {
                    parser: function parser(t, e, i, s, r) {
                        var n = t.style,
                            a = "cssFloat" in n ? "cssFloat" : "styleFloat";
                        return new me(n, a, 0, 0, r, -1, i, !1, 0, n[a], e);
                    }
                });
                var Be = function Be(t) {
                    var e,
                        i = this.t,
                        s = i.filter || Q(this.data, "filter") || "",
                        r = 0 | this.s + this.c * t;
                    100 === r && (-1 === s.indexOf("atrix(") && -1 === s.indexOf("radient(") && -1 === s.indexOf("oader(") ? (i.removeAttribute("filter"), e = !Q(this.data, "filter")) : (i.filter = s.replace(b, ""), e = !0)), e || (this.xn1 && (i.filter = s = s || "alpha(opacity=" + r + ")"), -1 === s.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = s + " alpha(opacity=" + r + ")") : i.filter = s.replace(x, "opacity=" + r));
                };
                Te("opacity,alpha,autoAlpha", {
                    defaultValue: "1",
                    parser: function parser(t, e, i, s, n, a) {
                        var o = parseFloat(Q(t, "opacity", r, !1, "1")),
                            l = t.style,
                            h = "autoAlpha" === i;
                        return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o), h && 1 === o && "hidden" === Q(t, "visibility", r) && 0 !== e && (o = 0), Y ? n = new me(l, "opacity", o, e - o, n) : (n = new me(l, "opacity", 100 * o, 100 * (e - o), n), n.xn1 = h ? 1 : 0, l.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = t, n.plugin = a, n.setRatio = Be), h && (n = new me(l, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== o ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit"), n.xs0 = "inherit", s._overwriteProps.push(n.n), s._overwriteProps.push(i)), n;
                    }
                });
                var je = function je(t, e) {
                        e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e), t.removeProperty(e.replace(k, "-$1").toLowerCase())) : t.removeAttribute(e));
                    },
                    Ye = function Ye(t) {
                        if (this.t._gsClassPT = this, 1 === t || 0 === t) {
                            this.t.setAttribute("class", 0 === t ? this.b : this.e);
                            for (var e = this.data, i = this.t.style; e;) {
                                e.v ? i[e.p] = e.v : je(i, e.p), e = e._next;
                            }
                            1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null);
                        } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e);
                    };
                Te("className", {
                    parser: function parser(t, e, s, n, a, o, l) {
                        var h,
                            _,
                            u,
                            c,
                            f,
                            p = t.getAttribute("class") || "",
                            m = t.style.cssText;
                        if (a = n._classNamePT = new me(t, s, 0, 0, a, 2), a.setRatio = Ye, a.pr = -11, i = !0, a.b = p, _ = K(t, r), u = t._gsClassPT) {
                            for (c = {}, f = u.data; f;) {
                                c[f.p] = 1, f = f._next;
                            }
                            u.setRatio(1);
                        }
                        return t._gsClassPT = a, a.e = "=" !== e.charAt(1) ? e : p.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", a.e), h = J(t, _, K(t), l, c), t.setAttribute("class", p), a.data = h.firstMPT, t.style.cssText = m, a = a.xfirst = n.parse(t, h.difs, a, o);
                    }
                });
                var Ue = function Ue(t) {
                    if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                        var e,
                            i,
                            s,
                            r,
                            n,
                            a = this.t.style,
                            o = l.transform.parse;
                        if ("all" === this.e) a.cssText = "", r = !0;
                        else
                            for (e = this.e.split(" ").join("").split(","), s = e.length; --s > -1;) {
                                i = e[s], l[i] && (l[i].parse === o ? r = !0 : i = "transformOrigin" === i ? Se : l[i].p), je(a, i);
                            }
                        r && (je(a, Pe), n = this.t._gsTransform, n && (n.svg && this.t.removeAttribute("data-svg-origin"), delete this.t._gsTransform));
                    }
                };
                for (Te("clearProps", {
                        parser: function parser(t, e, s, r, n) {
                            return n = new me(t, s, 0, 0, n, 2), n.setRatio = Ue, n.e = e, n.pr = -10, n.data = r._tween, i = !0, n;
                        }
                    }), h = "bezier,throwProps,physicsProps,physics2D".split(","), ve = h.length; ve--;) {
                    xe(h[ve]);
                }
                h = a.prototype, h._firstPT = h._lastParsedTransform = h._transform = null, h._onInitTween = function (t, e, o) {
                    if (!t.nodeType) return !1;
                    this._target = t, this._tween = o, this._vars = e, _ = e.autoRound, i = !1, s = e.suffixMap || a.suffixMap, r = Z(t, ""), n = this._overwriteProps;
                    var h,
                        f,
                        m,
                        d,
                        g,
                        v,
                        y,
                        T,
                        x,
                        b = t.style;
                    if (u && "" === b.zIndex && (h = Q(t, "zIndex", r), ("auto" === h || "" === h) && this._addLazySet(b, "zIndex", 0)), "string" == typeof e && (d = b.cssText, h = K(t, r), b.cssText = d + ";" + e, h = J(t, h, K(t)).difs, !Y && w.test(e) && (h.opacity = parseFloat(RegExp.$1)), e = h, b.cssText = d), this._firstPT = f = e.className ? l.className.parse(t, e.className, "className", this, null, null, e) : this.parse(t, e, null), this._transformType) {
                        for (x = 3 === this._transformType, Pe ? c && (u = !0, "" === b.zIndex && (y = Q(t, "zIndex", r), ("auto" === y || "" === y) && this._addLazySet(b, "zIndex", 0)), p && this._addLazySet(b, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (x ? "visible" : "hidden"))) : b.zoom = 1, m = f; m && m._next;) {
                            m = m._next;
                        }
                        T = new me(t, "transform", 0, 0, null, 2), this._linkCSSP(T, null, m), T.setRatio = Pe ? Xe : Le, T.data = this._transform || Ne(t, r, !0), T.tween = o, T.pr = -1, n.pop();
                    }
                    if (i) {
                        for (; f;) {
                            for (v = f._next, m = d; m && m.pr > f.pr;) {
                                m = m._next;
                            }(f._prev = m ? m._prev : g) ? f._prev._next = f: d = f, (f._next = m) ? m._prev = f : g = f, f = v;
                        }
                        this._firstPT = d;
                    }
                    return !0;
                }, h.parse = function (t, e, i, n) {
                    var a,
                        o,
                        h,
                        u,
                        c,
                        f,
                        p,
                        m,
                        d,
                        g,
                        v = t.style;
                    for (a in e) {
                        f = e[a], o = l[a], o ? i = o.parse(t, f, a, this, i, n, e) : (c = Q(t, a, r) + "", d = "string" == typeof f, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || d && P.test(f) ? (d || (f = he(f), f = (f.length > 3 ? "rgba(" : "rgb(") + f.join(",") + ")"), i = ge(v, a, c, f, !0, "transparent", i, 0, n)) : !d || -1 === f.indexOf(" ") && -1 === f.indexOf(",") ? (h = parseFloat(c), p = h || 0 === h ? c.substr((h + "").length) : "", ("" === c || "auto" === c) && ("width" === a || "height" === a ? (h = ie(t, a, r), p = "px") : "left" === a || "top" === a ? (h = H(t, a, r), p = "px") : (h = "opacity" !== a ? 0 : 1, p = "")), g = d && "=" === f.charAt(1), g ? (u = parseInt(f.charAt(0) + "1", 10), f = f.substr(2), u *= parseFloat(f), m = f.replace(T, "")) : (u = parseFloat(f), m = d ? f.replace(T, "") : ""), "" === m && (m = a in s ? s[a] : p), f = u || 0 === u ? (g ? u + h : u) + m : e[a], p !== m && "" !== m && (u || 0 === u) && h && (h = $(t, a, h, p), "%" === m ? (h /= $(t, a, 100, "%") / 100, e.strictUnits !== !0 && (c = h + "%")) : "em" === m || "rem" === m ? h /= $(t, a, 1, m) : "px" !== m && (u = $(t, a, u, m), m = "px"), g && (u || 0 === u) && (f = u + h + m)), g && (u += h), !h && 0 !== h || !u && 0 !== u ? void 0 !== v[a] && (f || "NaN" != f + "" && null != f) ? (i = new me(v, a, u || h || 0, 0, i, -1, a, !1, 0, c, f), i.xs0 = "none" !== f || "display" !== a && -1 === a.indexOf("Style") ? f : c) : q("invalid " + a + " tween value: " + e[a]) : (i = new me(v, a, h, u - h, i, 0, a, _ !== !1 && ("px" === m || "zIndex" === a), 0, c, f), i.xs0 = m)) : i = ge(v, a, c, f, !0, null, i, 0, n)), n && i && !i.plugin && (i.plugin = n);
                    }
                    return i;
                }, h.setRatio = function (t) {
                    var e,
                        i,
                        s,
                        r = this._firstPT,
                        n = 1e-6;
                    if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time) {
                        if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                            for (; r;) {
                                if (e = r.c * t + r.s, r.r ? e = Math.round(e) : n > e && e > -n && (e = 0), r.type) {
                                    if (1 === r.type) {
                                        if (s = r.l, 2 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
                                        else if (3 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
                                        else if (4 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
                                        else if (5 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
                                        else {
                                            for (i = r.xs0 + e + r.xs1, s = 1; r.l > s; s++) {
                                                i += r["xn" + s] + r["xs" + (s + 1)];
                                            }
                                            r.t[r.p] = i;
                                        }
                                    } else -1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t);
                                } else r.t[r.p] = e + r.xs0;
                                r = r._next;
                            } else
                                for (; r;) {
                                    2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t), r = r._next;
                                }
                    } else
                        for (; r;) {
                            if (2 !== r.type) {
                                if (r.r && -1 !== r.type) {
                                    if (e = Math.round(r.s + r.c), r.type) {
                                        if (1 === r.type) {
                                            for (s = r.l, i = r.xs0 + e + r.xs1, s = 1; r.l > s; s++) {
                                                i += r["xn" + s] + r["xs" + (s + 1)];
                                            }
                                            r.t[r.p] = i;
                                        }
                                    } else r.t[r.p] = e + r.xs0;
                                } else r.t[r.p] = r.e;
                            } else r.setRatio(t);
                            r = r._next;
                        }
                }, h._enableTransforms = function (t) {
                    this._transform = this._transform || Ne(this._target, r, !0), this._transformType = this._transform.svg && we || !t && 3 !== this._transformType ? 2 : 3;
                };
                var qe = function qe() {
                    this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0);
                };
                h._addLazySet = function (t, e, i) {
                    var s = this._firstPT = new me(t, e, 0, 0, this._firstPT, 2);
                    s.e = i, s.setRatio = qe, s.data = this;
                }, h._linkCSSP = function (t, e, i, s) {
                    return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, s = !0), i ? i._next = t : s || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t;
                }, h._kill = function (e) {
                    var i,
                        s,
                        r,
                        n = e;
                    if (e.autoAlpha || e.alpha) {
                        n = {};
                        for (s in e) {
                            n[s] = e[s];
                        }
                        n.opacity = 1, n.autoAlpha && (n.visibility = 1);
                    }
                    return e.className && (i = this._classNamePT) && (r = i.xfirst, r && r._prev ? this._linkCSSP(r._prev, i._next, r._prev._prev) : r === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, r._prev), this._classNamePT = null), t.prototype._kill.call(this, n);
                };
                var Ve = function Ve(t, e, i) {
                    var s, r, n, a;
                    if (t.slice)
                        for (r = t.length; --r > -1;) {
                            Ve(t[r], e, i);
                        } else
                            for (s = t.childNodes, r = s.length; --r > -1;) {
                                n = s[r], a = n.type, n.style && (e.push(K(n)), i && i.push(n)), 1 !== a && 9 !== a && 11 !== a || !n.childNodes.length || Ve(n, e, i);
                            }
                };
                return a.cascadeTo = function (t, i, s) {
                    var r,
                        n,
                        a,
                        o,
                        l = e.to(t, i, s),
                        h = [l],
                        _ = [],
                        u = [],
                        c = [],
                        f = e._internals.reservedProps;
                    for (t = l._targets || l.target, Ve(t, _, c), l.render(i, !0, !0), Ve(t, u), l.render(0, !0, !0), l._enabled(!0), r = c.length; --r > -1;) {
                        if (n = J(c[r], _[r], u[r]), n.firstMPT) {
                            n = n.difs;
                            for (a in s) {
                                f[a] && (n[a] = s[a]);
                            }
                            o = {};
                            for (a in n) {
                                o[a] = _[r][a];
                            }
                            h.push(e.fromTo(c[r], i, o, n));
                        }
                    }
                    return h;
                }, t.activate([a]), a;
            }, !0),
            function () {
                var t = _gsScope._gsDefine.plugin({
                        propName: "roundProps",
                        version: "1.5",
                        priority: -1,
                        API: 2,
                        init: function init(t, e, i) {
                            return this._tween = i, !0;
                        }
                    }),
                    e = function e(t) {
                        for (; t;) {
                            t.f || t.blob || (t.r = 1), t = t._next;
                        }
                    },
                    i = t.prototype;
                i._onInitAllProps = function () {
                    for (var t, i, s, r = this._tween, n = r.vars.roundProps.join ? r.vars.roundProps : r.vars.roundProps.split(","), a = n.length, o = {}, l = r._propLookup.roundProps; --a > -1;) {
                        o[n[a]] = 1;
                    }
                    for (a = n.length; --a > -1;) {
                        for (t = n[a], i = r._firstPT; i;) {
                            s = i._next, i.pg ? i.t._roundProps(o, !0) : i.n === t && (2 === i.f && i.t ? e(i.t._firstPT) : (this._add(i.t, t, i.s, i.c), s && (s._prev = i._prev), i._prev ? i._prev._next = s : r._firstPT === i && (r._firstPT = s), i._next = i._prev = null, r._propLookup[t] = l)), i = s;
                        }
                    }
                    return !1;
                }, i._add = function (t, e, i, s) {
                    this._addTween(t, e, i, i + s, e, !0), this._overwriteProps.push(e);
                };
            }(),
            function () {
                _gsScope._gsDefine.plugin({
                    propName: "attr",
                    API: 2,
                    version: "0.5.0",
                    init: function init(t, e) {
                        var i;
                        if ("function" != typeof t.setAttribute) return !1;
                        for (i in e) {
                            this._addTween(t, "setAttribute", t.getAttribute(i) + "", e[i] + "", i, !1, i), this._overwriteProps.push(i);
                        }
                        return !0;
                    }
                });
            }(), _gsScope._gsDefine.plugin({
                propName: "directionalRotation",
                version: "0.2.1",
                API: 2,
                init: function init(t, e) {
                    "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && (e = {
                        rotation: e
                    }), this.finals = {};
                    var i,
                        s,
                        r,
                        n,
                        a,
                        o,
                        l = e.useRadians === !0 ? 2 * Math.PI : 360,
                        h = 1e-6;
                    for (i in e) {
                        "useRadians" !== i && (o = (e[i] + "").split("_"), s = o[0], r = parseFloat("function" != typeof t[i] ? t[i] : t[i.indexOf("set") || "function" != typeof t["get" + i.substr(3)] ? i : "get" + i.substr(3)]()), n = this.finals[i] = "string" == typeof s && "=" === s.charAt(1) ? r + parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2)) : Number(s) || 0, a = n - r, o.length && (s = o.join("_"), -1 !== s.indexOf("short") && (a %= l, a !== a % (l / 2) && (a = 0 > a ? a + l : a - l)), -1 !== s.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * l) % l - (0 | a / l) * l : -1 !== s.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * l) % l - (0 | a / l) * l)), (a > h || -h > a) && (this._addTween(t, i, r, r + a, i), this._overwriteProps.push(i)));
                    }
                    return !0;
                },
                set: function set(t) {
                    var e;
                    if (1 !== t) this._super.setRatio.call(this, t);
                    else
                        for (e = this._firstPT; e;) {
                            e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p], e = e._next;
                        }
                }
            })._autoCSS = !0, _gsScope._gsDefine("easing.Back", ["easing.Ease"], function (t) {
                var e,
                    i,
                    s,
                    r = _gsScope.GreenSockGlobals || _gsScope,
                    n = r.com.greensock,
                    a = 2 * Math.PI,
                    o = Math.PI / 2,
                    l = n._class,
                    h = function h(e, i) {
                        var s = l("easing." + e, function () {}, !0),
                            r = s.prototype = new t();
                        return r.constructor = s, r.getRatio = i, s;
                    },
                    _ = t.register || function () {},
                    u = function u(t, e, i, s) {
                        var r = l("easing." + t, {
                            easeOut: new e(),
                            easeIn: new i(),
                            easeInOut: new s()
                        }, !0);
                        return _(r, t), r;
                    },
                    c = function c(t, e, i) {
                        this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t);
                    },
                    f = function f(e, i) {
                        var s = l("easing." + e, function (t) {
                                this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1;
                            }, !0),
                            r = s.prototype = new t();
                        return r.constructor = s, r.getRatio = i, r.config = function (t) {
                            return new s(t);
                        }, s;
                    },
                    p = u("Back", f("BackOut", function (t) {
                        return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1;
                    }), f("BackIn", function (t) {
                        return t * t * ((this._p1 + 1) * t - this._p1);
                    }), f("BackInOut", function (t) {
                        return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2);
                    })),
                    m = l("easing.SlowMo", function (t, e, i) {
                        e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0;
                    }, !0),
                    d = m.prototype = new t();
                return d.constructor = m, d.getRatio = function (t) {
                    var e = t + (.5 - t) * this._p;
                    return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e;
                }, m.ease = new m(.7, .7), d.config = m.config = function (t, e, i) {
                    return new m(t, e, i);
                }, e = l("easing.SteppedEase", function (t) {
                    t = t || 1, this._p1 = 1 / t, this._p2 = t + 1;
                }, !0), d = e.prototype = new t(), d.constructor = e, d.getRatio = function (t) {
                    return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1;
                }, d.config = e.config = function (t) {
                    return new e(t);
                }, i = l("easing.RoughEase", function (e) {
                    e = e || {};
                    for (var i, s, r, n, a, o, l = e.taper || "none", h = [], _ = 0, u = 0 | (e.points || 20), f = u, p = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --f > -1;) {
                        i = p ? Math.random() : 1 / u * f, s = d ? d.getRatio(i) : i, "none" === l ? r = g : "out" === l ? (n = 1 - i, r = n * n * g) : "in" === l ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), p ? s += Math.random() * r - .5 * r : f % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), h[_++] = {
                            x: i,
                            y: s
                        };
                    }
                    for (h.sort(function (t, e) {
                            return t.x - e.x;
                        }), o = new c(1, 1, null), f = u; --f > -1;) {
                        a = h[f], o = new c(a.x, a.y, o);
                    }
                    this._prev = new c(0, 0, 0 !== o.t ? o : o.next);
                }, !0), d = i.prototype = new t(), d.constructor = i, d.getRatio = function (t) {
                    var e = this._prev;
                    if (t > e.t) {
                        for (; e.next && t >= e.t;) {
                            e = e.next;
                        }
                        e = e.prev;
                    } else
                        for (; e.prev && e.t >= t;) {
                            e = e.prev;
                        }
                    return this._prev = e, e.v + (t - e.t) / e.gap * e.c;
                }, d.config = function (t) {
                    return new i(t);
                }, i.ease = new i(), u("Bounce", h("BounceOut", function (t) {
                    return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
                }), h("BounceIn", function (t) {
                    return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375);
                }), h("BounceInOut", function (t) {
                    var e = .5 > t;
                    return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5;
                })), u("Circ", h("CircOut", function (t) {
                    return Math.sqrt(1 - (t -= 1) * t);
                }), h("CircIn", function (t) {
                    return -(Math.sqrt(1 - t * t) - 1);
                }), h("CircInOut", function (t) {
                    return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
                })), s = function s(e, i, _s) {
                    var r = l("easing." + e, function (t, e) {
                            this._p1 = t >= 1 ? t : 1, this._p2 = (e || _s) / (1 > t ? t : 1), this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0), this._p2 = a / this._p2;
                        }, !0),
                        n = r.prototype = new t();
                    return n.constructor = r, n.getRatio = i, n.config = function (t, e) {
                        return new r(t, e);
                    }, r;
                }, u("Elastic", s("ElasticOut", function (t) {
                    return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1;
                }, .3), s("ElasticIn", function (t) {
                    return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2));
                }, .3), s("ElasticInOut", function (t) {
                    return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) + 1;
                }, .45)), u("Expo", h("ExpoOut", function (t) {
                    return 1 - Math.pow(2, -10 * t);
                }), h("ExpoIn", function (t) {
                    return Math.pow(2, 10 * (t - 1)) - .001;
                }), h("ExpoInOut", function (t) {
                    return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)));
                })), u("Sine", h("SineOut", function (t) {
                    return Math.sin(t * o);
                }), h("SineIn", function (t) {
                    return -Math.cos(t * o) + 1;
                }), h("SineInOut", function (t) {
                    return -.5 * (Math.cos(Math.PI * t) - 1);
                })), l("easing.EaseLookup", {
                    find: function find(e) {
                        return t.map[e];
                    }
                }, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), p;
            }, !0);
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function (t, e) {
        "use strict";
        var i = t.GreenSockGlobals = t.GreenSockGlobals || t;
        if (!i.TweenLite) {
            var s,
                r,
                n,
                a,
                o,
                l = function l(t) {
                    var e,
                        s = t.split("."),
                        r = i;
                    for (e = 0; s.length > e; e++) {
                        r[s[e]] = r = r[s[e]] || {};
                    }
                    return r;
                },
                h = l("com.greensock"),
                _ = 1e-10,
                u = function u(t) {
                    var e,
                        i = [],
                        s = t.length;
                    for (e = 0; e !== s; i.push(t[e++])) {}
                    return i;
                },
                c = function c() {},
                f = function () {
                    var t = Object.prototype.toString,
                        e = t.call([]);
                    return function (i) {
                        return null != i && (i instanceof Array || "object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) && !!i.push && t.call(i) === e);
                    };
                }(),
                p = {},
                m = function m(s, r, n, a) {
                    this.sc = p[s] ? p[s].sc : [], p[s] = this, this.gsClass = null, this.func = n;
                    var o = [];
                    this.check = function (h) {
                        for (var _, u, c, f, d, g = r.length, v = g; --g > -1;) {
                            (_ = p[r[g]] || new m(r[g], [])).gsClass ? (o[g] = _.gsClass, v--) : h && _.sc.push(this);
                        }
                        if (0 === v && n)
                            for (u = ("com.greensock." + s).split("."), c = u.pop(), f = l(u.join("."))[c] = this.gsClass = n.apply(n, o), a && (i[c] = f, d = "undefined" != typeof module && module.exports, !d && "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + s.split(".").pop(), [], function () {
                                    return f;
                                }) : s === e && d && (module.exports = f)), g = 0; this.sc.length > g; g++) {
                                this.sc[g].check();
                            }
                    }, this.check(!0);
                },
                d = t._gsDefine = function (t, e, i, s) {
                    return new m(t, e, i, s);
                },
                g = h._class = function (t, e, i) {
                    return e = e || function () {}, d(t, [], function () {
                        return e;
                    }, i), e;
                };
            d.globals = i;
            var v = [0, 0, 1, 1],
                y = [],
                T = g("easing.Ease", function (t, e, i, s) {
                    this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? v.concat(e) : v;
                }, !0),
                x = T.map = {},
                w = T.register = function (t, e, i, s) {
                    for (var r, n, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;) {
                        for (n = l[_], r = s ? g("easing." + n, null, !0) : h.easing[n] || {}, a = u.length; --a > -1;) {
                            o = u[a], x[n + "." + o] = x[o + n] = r[o] = t.getRatio ? t : t[o] || new t();
                        }
                    }
                };
            for (n = T.prototype, n._calcEnd = !1, n.getRatio = function (t) {
                    if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
                    var e = this._type,
                        i = this._power,
                        s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
                    return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2;
                }, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], r = s.length; --r > -1;) {
                n = s[r] + ",Power" + r, w(new T(null, null, 1, r), n, "easeOut", !0), w(new T(null, null, 2, r), n, "easeIn" + (0 === r ? ",easeNone" : "")), w(new T(null, null, 3, r), n, "easeInOut");
            }
            x.linear = h.easing.Linear.easeIn, x.swing = h.easing.Quad.easeInOut;
            var b = g("events.EventDispatcher", function (t) {
                this._listeners = {}, this._eventTarget = t || this;
            });
            n = b.prototype, n.addEventListener = function (t, e, i, s, r) {
                r = r || 0;
                var n,
                    l,
                    h = this._listeners[t],
                    _ = 0;
                for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;) {
                    n = h[l], n.c === e && n.s === i ? h.splice(l, 1) : 0 === _ && r > n.pr && (_ = l + 1);
                }
                h.splice(_, 0, {
                    c: e,
                    s: i,
                    up: s,
                    pr: r
                }), this !== a || o || a.wake();
            }, n.removeEventListener = function (t, e) {
                var i,
                    s = this._listeners[t];
                if (s)
                    for (i = s.length; --i > -1;) {
                        if (s[i].c === e) return s.splice(i, 1), void 0;
                    }
            }, n.dispatchEvent = function (t) {
                var e,
                    i,
                    s,
                    r = this._listeners[t];
                if (r)
                    for (e = r.length, i = this._eventTarget; --e > -1;) {
                        s = r[e], s && (s.up ? s.c.call(s.s || i, {
                            type: t,
                            target: i
                        }) : s.c.call(s.s || i));
                    }
            };
            var P = t.requestAnimationFrame,
                k = t.cancelAnimationFrame,
                S = Date.now || function () {
                    return new Date().getTime();
                },
                R = S();
            for (s = ["ms", "moz", "webkit", "o"], r = s.length; --r > -1 && !P;) {
                P = t[s[r] + "RequestAnimationFrame"], k = t[s[r] + "CancelAnimationFrame"] || t[s[r] + "CancelRequestAnimationFrame"];
            }
            g("Ticker", function (t, e) {
                var i,
                    s,
                    r,
                    n,
                    l,
                    h = this,
                    u = S(),
                    f = e !== !1 && P,
                    p = 500,
                    m = 33,
                    d = "tick",
                    g = function g(t) {
                        var e,
                            a,
                            o = S() - R;
                        o > p && (u += o - m), R += o, h.time = (R - u) / 1e3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++, l += e + (e >= n ? .004 : n - e), a = !0), t !== !0 && (r = s(g)), a && h.dispatchEvent(d);
                    };
                b.call(h), h.time = h.frame = 0, h.tick = function () {
                    g(!0);
                }, h.lagSmoothing = function (t, e) {
                    p = t || 1 / _, m = Math.min(e, p, 0);
                }, h.sleep = function () {
                    null != r && (f && k ? k(r) : clearTimeout(r), s = c, r = null, h === a && (o = !1));
                }, h.wake = function () {
                    null !== r ? h.sleep() : h.frame > 10 && (R = S() - p + 5), s = 0 === i ? c : f && P ? P : function (t) {
                        return setTimeout(t, 0 | 1e3 * (l - h.time) + 1);
                    }, h === a && (o = !0), g(2);
                }, h.fps = function (t) {
                    return arguments.length ? (i = t, n = 1 / (i || 60), l = this.time + n, h.wake(), void 0) : i;
                }, h.useRAF = function (t) {
                    return arguments.length ? (h.sleep(), f = t, h.fps(i), void 0) : f;
                }, h.fps(t), setTimeout(function () {
                    f && 5 > h.frame && h.useRAF(!1);
                }, 1500);
            }), n = h.Ticker.prototype = new h.events.EventDispatcher(), n.constructor = h.Ticker;
            var O = g("core.Animation", function (t, e) {
                if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, W) {
                    o || a.wake();
                    var i = this.vars.useFrames ? G : W;
                    i.add(this, i._time), this.vars.paused && this.paused(!0);
                }
            });
            a = O.ticker = new h.Ticker(), n = O.prototype, n._dirty = n._gc = n._initted = n._paused = !1, n._totalTime = n._time = 0, n._rawPrevTime = -1, n._next = n._last = n._onUpdate = n._timeline = n.timeline = null, n._paused = !1;
            var A = function A() {
                o && S() - R > 2e3 && a.wake(), setTimeout(A, 2e3);
            };
            A(), n.play = function (t, e) {
                return null != t && this.seek(t, e), this.reversed(!1).paused(!1);
            }, n.pause = function (t, e) {
                return null != t && this.seek(t, e), this.paused(!0);
            }, n.resume = function (t, e) {
                return null != t && this.seek(t, e), this.paused(!1);
            }, n.seek = function (t, e) {
                return this.totalTime(Number(t), e !== !1);
            }, n.restart = function (t, e) {
                return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0);
            }, n.reverse = function (t, e) {
                return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1);
            }, n.render = function () {}, n.invalidate = function () {
                return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this;
            }, n.isActive = function () {
                var t,
                    e = this._timeline,
                    i = this._startTime;
                return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t;
            }, n._enabled = function (t, e) {
                return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1;
            }, n._kill = function () {
                return this._enabled(!1, !1);
            }, n.kill = function (t, e) {
                return this._kill(t, e), this;
            }, n._uncache = function (t) {
                for (var e = t ? this : this.timeline; e;) {
                    e._dirty = !0, e = e.timeline;
                }
                return this;
            }, n._swapSelfInParams = function (t) {
                for (var e = t.length, i = t.concat(); --e > -1;) {
                    "{self}" === t[e] && (i[e] = this);
                }
                return i;
            }, n._callback = function (t) {
                var e = this.vars;
                e[t].apply(e[t + "Scope"] || e.callbackScope || this, e[t + "Params"] || y);
            }, n.eventCallback = function (t, e, i, s) {
                if ("on" === (t || "").substr(0, 2)) {
                    var r = this.vars;
                    if (1 === arguments.length) return r[t];
                    null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e);
                }
                return this;
            }, n.delay = function (t) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay;
            }, n.duration = function (t) {
                return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration);
            }, n.totalDuration = function (t) {
                return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration;
            }, n.time = function (t, e) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time;
            }, n.totalTime = function (t, e, i) {
                if (o || a.wake(), !arguments.length) return this._totalTime;
                if (this._timeline) {
                    if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                        this._dirty && this.totalDuration();
                        var s = this._totalDuration,
                            r = this._timeline;
                        if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)
                            for (; r._timeline;) {
                                r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline;
                            }
                    }
                    this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (F.length && Q(), this.render(t, e, !1), F.length && Q());
                }
                return this;
            }, n.progress = n.totalProgress = function (t, e) {
                var i = this.duration();
                return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i : this.ratio;
            }, n.startTime = function (t) {
                return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime;
            }, n.endTime = function (t) {
                return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale;
            }, n.timeScale = function (t) {
                if (!arguments.length) return this._timeScale;
                if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
                    var e = this._pauseTime,
                        i = e || 0 === e ? e : this._timeline.totalTime();
                    this._startTime = i - (i - this._startTime) * this._timeScale / t;
                }
                return this._timeScale = t, this._uncache(!1);
            }, n.reversed = function (t) {
                return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed;
            }, n.paused = function (t) {
                if (!arguments.length) return this._paused;
                var e,
                    i,
                    s = this._timeline;
                return t != this._paused && s && (o || t || a.wake(), e = s.rawTime(), i = e - this._pauseTime, !t && s.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && (e = s.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, this.render(e, e === this._totalTime, !0))), this._gc && !t && this._enabled(!0, !1), this;
            };
            var C = g("core.SimpleTimeline", function (t) {
                O.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0;
            });
            n = C.prototype = new O(), n.constructor = C, n.kill()._gc = !1, n._first = n._last = n._recent = null, n._sortChildren = !1, n.add = n.insert = function (t, e) {
                var i, s;
                if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren)
                    for (s = t._startTime; i && i._startTime > s;) {
                        i = i._prev;
                    }
                return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._recent = t, this._timeline && this._uncache(!0), this;
            }, n._remove = function (t, e) {
                return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this;
            }, n.render = function (t, e, i) {
                var s,
                    r = this._first;
                for (this._totalTime = this._time = this._rawPrevTime = t; r;) {
                    s = r._next, (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s;
                }
            }, n.rawTime = function () {
                return o || a.wake(), this._totalTime;
            };
            var D = g("TweenLite", function (e, i, s) {
                    if (O.call(this, i, s), this.render = D.prototype.render, null == e) throw "Cannot tween a null target.";
                    this.target = e = "string" != typeof e ? e : D.selector(e) || e;
                    var r,
                        n,
                        a,
                        o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
                        l = this.vars.overwrite;
                    if (this._overwrite = l = null == l ? V[D.defaultOverwrite] : "number" == typeof l ? l >> 0 : V[l], (o || e instanceof Array || e.push && f(e)) && "number" != typeof e[0])
                        for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], r = 0; a.length > r; r++) {
                            n = a[r], n ? "string" != typeof n ? n.length && n !== t && n[0] && (n[0] === t || n[0].nodeType && n[0].style && !n.nodeType) ? (a.splice(r--, 1), this._targets = a = a.concat(u(n))) : (this._siblings[r] = $(n, this, !1), 1 === l && this._siblings[r].length > 1 && K(n, this, null, 1, this._siblings[r])) : (n = a[r--] = D.selector(n), "string" == typeof n && a.splice(r + 1, 1)) : a.splice(r--, 1);
                        } else this._propLookup = {}, this._siblings = $(e, this, !1), 1 === l && this._siblings.length > 1 && K(e, this, null, 1, this._siblings);
                    (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay));
                }, !0),
                M = function M(e) {
                    return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType);
                },
                z = function z(t, e) {
                    var i,
                        s = {};
                    for (i in t) {
                        q[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!j[i] || j[i] && j[i]._autoCSS) || (s[i] = t[i], delete t[i]);
                    }
                    t.css = s;
                };
            n = D.prototype = new O(), n.constructor = D, n.kill()._gc = !1, n.ratio = 0, n._firstPT = n._targets = n._overwrittenProps = n._startAt = null, n._notifyPluginsOfEnabled = n._lazy = !1, D.version = "1.18.0", D.defaultEase = n._ease = new T(null, null, 1, 1), D.defaultOverwrite = "auto", D.ticker = a, D.autoSleep = 120, D.lagSmoothing = function (t, e) {
                a.lagSmoothing(t, e);
            }, D.selector = t.$ || t.jQuery || function (e) {
                var i = t.$ || t.jQuery;
                return i ? (D.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e);
            };
            var F = [],
                I = {},
                E = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
                N = function N(t) {
                    for (var e, i = this._firstPT, s = 1e-6; i;) {
                        e = i.blob ? t ? this.join("") : this.start : i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e, i = i._next;
                    }
                },
                L = function L(t, e, i, s) {
                    var r,
                        n,
                        a,
                        o,
                        l,
                        h,
                        _,
                        u = [t, e],
                        c = 0,
                        f = "",
                        p = 0;
                    for (u.start = t, i && (i(u), t = u[0], e = u[1]), u.length = 0, r = t.match(E) || [], n = e.match(E) || [], s && (s._next = null, s.blob = 1, u._firstPT = s), l = n.length, o = 0; l > o; o++) {
                        _ = n[o], h = e.substr(c, e.indexOf(_, c) - c), f += h || !o ? h : ",", c += h.length, p ? p = (p + 1) % 5 : "rgba(" === h.substr(-5) && (p = 1), _ === r[o] || o >= r.length ? f += _ : (f && (u.push(f), f = ""), a = parseFloat(r[o]), u.push(a), u._firstPT = {
                            _next: u._firstPT,
                            t: u,
                            p: u.length - 1,
                            s: a,
                            c: ("=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * parseFloat(_.substr(2)) : parseFloat(_) - a) || 0,
                            f: 0,
                            r: p && 4 > p
                        }), c += _.length;
                    }
                    return f += e.substr(c), f && u.push(f), u.setRatio = N, u;
                },
                X = function X(t, e, i, s, r, n, a, o) {
                    var l,
                        h,
                        _ = "get" === i ? t[e] : i,
                        u = _typeof(t[e]),
                        c = "string" == typeof s && "=" === s.charAt(1),
                        f = {
                            t: t,
                            p: e,
                            s: _,
                            f: "function" === u,
                            pg: 0,
                            n: r || e,
                            r: n,
                            pr: 0,
                            c: c ? parseInt(s.charAt(0) + "1", 10) * parseFloat(s.substr(2)) : parseFloat(s) - _ || 0
                        };
                    return "number" !== u && ("function" === u && "get" === i && (h = e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e : "get" + e.substr(3), f.s = _ = a ? t[h](a) : t[h]()), "string" == typeof _ && (a || isNaN(_)) ? (f.fp = a, l = L(_, s, o || D.defaultStringFilter, f), f = {
                        t: l,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 2,
                        pg: 0,
                        n: r || e,
                        pr: 0
                    }) : c || (f.c = parseFloat(s) - parseFloat(_) || 0)), f.c ? ((f._next = this._firstPT) && (f._next._prev = f), this._firstPT = f, f) : void 0;
                },
                B = D._internals = {
                    isArray: f,
                    isSelector: M,
                    lazyTweens: F,
                    blobDif: L
                },
                j = D._plugins = {},
                Y = B.tweenLookup = {},
                U = 0,
                q = B.reservedProps = {
                    ease: 1,
                    delay: 1,
                    overwrite: 1,
                    onComplete: 1,
                    onCompleteParams: 1,
                    onCompleteScope: 1,
                    useFrames: 1,
                    runBackwards: 1,
                    startAt: 1,
                    onUpdate: 1,
                    onUpdateParams: 1,
                    onUpdateScope: 1,
                    onStart: 1,
                    onStartParams: 1,
                    onStartScope: 1,
                    onReverseComplete: 1,
                    onReverseCompleteParams: 1,
                    onReverseCompleteScope: 1,
                    onRepeat: 1,
                    onRepeatParams: 1,
                    onRepeatScope: 1,
                    easeParams: 1,
                    yoyo: 1,
                    immediateRender: 1,
                    repeat: 1,
                    repeatDelay: 1,
                    data: 1,
                    paused: 1,
                    reversed: 1,
                    autoCSS: 1,
                    lazy: 1,
                    onOverwrite: 1,
                    callbackScope: 1,
                    stringFilter: 1
                },
                V = {
                    none: 0,
                    all: 1,
                    auto: 2,
                    concurrent: 3,
                    allOnStart: 4,
                    preexisting: 5,
                    "true": 1,
                    "false": 0
                },
                G = O._rootFramesTimeline = new C(),
                W = O._rootTimeline = new C(),
                Z = 30,
                Q = B.lazyRender = function () {
                    var t,
                        e = F.length;
                    for (I = {}; --e > -1;) {
                        t = F[e], t && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0), t._lazy = !1);
                    }
                    F.length = 0;
                };
            W._startTime = a.time, G._startTime = a.frame, W._active = G._active = !0, setTimeout(Q, 1), O._updateRoot = D.render = function () {
                var t, e, i;
                if (F.length && Q(), W.render((a.time - W._startTime) * W._timeScale, !1, !1), G.render((a.frame - G._startTime) * G._timeScale, !1, !1), F.length && Q(), a.frame >= Z) {
                    Z = a.frame + (parseInt(D.autoSleep, 10) || 120);
                    for (i in Y) {
                        for (e = Y[i].tweens, t = e.length; --t > -1;) {
                            e[t]._gc && e.splice(t, 1);
                        }
                        0 === e.length && delete Y[i];
                    }
                    if (i = W._first, (!i || i._paused) && D.autoSleep && !G._first && 1 === a._listeners.tick.length) {
                        for (; i && i._paused;) {
                            i = i._next;
                        }
                        i || a.sleep();
                    }
                }
            }, a.addEventListener("tick", O._updateRoot);
            var $ = function $(t, e, i) {
                    var s,
                        r,
                        n = t._gsTweenID;
                    if (Y[n || (t._gsTweenID = n = "t" + U++)] || (Y[n] = {
                            target: t,
                            tweens: []
                        }), e && (s = Y[n].tweens, s[r = s.length] = e, i))
                        for (; --r > -1;) {
                            s[r] === e && s.splice(r, 1);
                        }
                    return Y[n].tweens;
                },
                H = function H(t, e, i, s) {
                    var r,
                        n,
                        a = t.vars.onOverwrite;
                    return a && (r = a(t, e, i, s)), a = D.onOverwrite, a && (n = a(t, e, i, s)), r !== !1 && n !== !1;
                },
                K = function K(t, e, i, s, r) {
                    var n, a, o, l;
                    if (1 === s || s >= 4) {
                        for (l = r.length, n = 0; l > n; n++) {
                            if ((o = r[n]) !== e) o._gc || o._kill(null, t, e) && (a = !0);
                            else if (5 === s) break;
                        }
                        return a;
                    }
                    var h,
                        u = e._startTime + _,
                        c = [],
                        f = 0,
                        p = 0 === e._duration;
                    for (n = r.length; --n > -1;) {
                        (o = r[n]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || J(e, 0, p), 0 === J(o, h, p) && (c[f++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((p || !o._initted) && 2e-10 >= u - o._startTime || (c[f++] = o)));
                    }
                    for (n = f; --n > -1;) {
                        if (o = c[n], 2 === s && o._kill(i, t, e) && (a = !0), 2 !== s || !o._firstPT && o._initted) {
                            if (2 !== s && !H(o, e)) continue;
                            o._enabled(!1, !1) && (a = !0);
                        }
                    }
                    return a;
                },
                J = function J(t, e, i) {
                    for (var s = t._timeline, r = s._timeScale, n = t._startTime; s._timeline;) {
                        if (n += s._startTime, r *= s._timeScale, s._paused) return -100;
                        s = s._timeline;
                    }
                    return n /= r, n > e ? n - e : i && n === e || !t._initted && 2 * _ > n - e ? _ : (n += t.totalDuration() / t._timeScale / r) > e + _ ? 0 : n - e - _;
                };
            n._init = function () {
                var t,
                    e,
                    i,
                    s,
                    r,
                    n = this.vars,
                    a = this._overwrittenProps,
                    o = this._duration,
                    l = !!n.immediateRender,
                    h = n.ease;
                if (n.startAt) {
                    this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), r = {};
                    for (s in n.startAt) {
                        r[s] = n.startAt[s];
                    }
                    if (r.overwrite = !1, r.immediateRender = !0, r.lazy = l && n.lazy !== !1, r.startAt = r.delay = null, this._startAt = D.to(this.target, 0, r), l)
                        if (this._time > 0) this._startAt = null;
                        else if (0 !== o) return;
                } else if (n.runBackwards && 0 !== o)
                    if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                    else {
                        0 !== this._time && (l = !1), i = {};
                        for (s in n) {
                            q[s] && "autoCSS" !== s || (i[s] = n[s]);
                        }
                        if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && n.lazy !== !1, i.immediateRender = l, this._startAt = D.to(this.target, 0, i), l) {
                            if (0 === this._time) return;
                        } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null);
                    }
                if (this._ease = h = h ? h instanceof T ? h : "function" == typeof h ? new T(h, n.easeParams) : x[h] || D.defaultEase : D.defaultEase, n.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, n.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                    for (t = this._targets.length; --t > -1;) {
                        this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0);
                    } else e = this._initProps(this.target, this._propLookup, this._siblings, a);
                if (e && D._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), n.runBackwards)
                    for (i = this._firstPT; i;) {
                        i.s += i.c, i.c = -i.c, i = i._next;
                    }
                this._onUpdate = n.onUpdate, this._initted = !0;
            }, n._initProps = function (e, i, s, r) {
                var n, a, o, l, h, _;
                if (null == e) return !1;
                I[e._gsTweenID] && Q(), this.vars.css || e.style && e !== t && e.nodeType && j.css && this.vars.autoCSS !== !1 && z(this.vars, e);
                for (n in this.vars) {
                    if (_ = this.vars[n], q[n]) _ && (_ instanceof Array || _.push && f(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[n] = _ = this._swapSelfInParams(_, this));
                    else if (j[n] && (l = new j[n]())._onInitTween(e, this.vars[n], this)) {
                        for (this._firstPT = h = {
                                _next: this._firstPT,
                                t: l,
                                p: "setRatio",
                                s: 0,
                                c: 1,
                                f: 1,
                                n: n,
                                pg: 1,
                                pr: l._priority
                            }, a = l._overwriteProps.length; --a > -1;) {
                            i[l._overwriteProps[a]] = this._firstPT;
                        }(l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0), h._next && (h._next._prev = h);
                    } else i[n] = X.call(this, e, n, "get", _, n, 0, null, this.vars.stringFilter);
                }
                return r && this._kill(r, e) ? this._initProps(e, i, s, r) : this._overwrite > 1 && this._firstPT && s.length > 1 && K(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, r)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (I[e._gsTweenID] = !0), o);
            }, n.render = function (t, e, i) {
                var s,
                    r,
                    n,
                    a,
                    o = this._time,
                    l = this._duration,
                    h = this._rawPrevTime;
                if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _ && "isPause" !== this.data) && h !== t && (i = !0, h > _ && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || h === t ? t : _);
                else if (1e-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0) && (r = "onReverseComplete", s = this._reversed), 0 > t && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (h !== _ || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)), this._initted || (i = !0);
                else if (this._totalTime = this._time = t, this._easeType) {
                    var u = t / l,
                        c = this._easeType,
                        f = this._easePower;
                    (1 === c || 3 === c && u >= .5) && (u = 1 - u), 3 === c && (u *= 2), 1 === f ? u *= u : 2 === f ? u *= u * u : 3 === f ? u *= u * u * u : 4 === f && (u *= u * u * u * u), this.ratio = 1 === c ? 1 - u : 2 === c ? u : .5 > t / l ? u / 2 : 1 - u / 2;
                } else this.ratio = this._ease.getRatio(t / l);
                if (this._time !== o || i) {
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, F.push(this), this._lazy = [t, e], void 0;
                        this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this._callback("onStart"))), n = this._firstPT; n;) {
                        n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
                    }
                    this._onUpdate && (0 > t && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._callback("onUpdate")), r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0));
                }
            }, n._kill = function (t, e, i) {
                if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
                e = "string" != typeof e ? e || this._targets || this.target : D.selector(e) || e;
                var s,
                    r,
                    n,
                    a,
                    o,
                    l,
                    h,
                    _,
                    u,
                    c = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline;
                if ((f(e) || M(e)) && "number" != typeof e[0])
                    for (s = e.length; --s > -1;) {
                        this._kill(t, e[s], i) && (l = !0);
                    } else {
                        if (this._targets) {
                            for (s = this._targets.length; --s > -1;) {
                                if (e === this._targets[s]) {
                                    o = this._propLookup[s] || {}, this._overwrittenProps = this._overwrittenProps || [], r = this._overwrittenProps[s] = t ? this._overwrittenProps[s] || {} : "all";
                                    break;
                                }
                            }
                        } else {
                            if (e !== this.target) return !1;
                            o = this._propLookup, r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all";
                        }
                        if (o) {
                            if (h = t || o, _ = t !== r && "all" !== r && t !== o && ("object" != (typeof t === "undefined" ? "undefined" : _typeof(t)) || !t._tempKill), i && (D.onOverwrite || this.vars.onOverwrite)) {
                                for (n in h) {
                                    o[n] && (u || (u = []), u.push(n));
                                }
                                if ((u || !t) && !H(this, i, e, u)) return !1;
                            }
                            for (n in h) {
                                (a = o[n]) && (c && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s, l = !0), a.pg && a.t._kill(h) && (l = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete o[n]), _ && (r[n] = 1);
                            }!this._firstPT && this._initted && this._enabled(!1, !1);
                        }
                    }
                return l;
            }, n.invalidate = function () {
                return this._notifyPluginsOfEnabled && D._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], O.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_, this.render(-this._delay)), this;
            }, n._enabled = function (t, e) {
                if (o || a.wake(), t && this._gc) {
                    var i,
                        s = this._targets;
                    if (s)
                        for (i = s.length; --i > -1;) {
                            this._siblings[i] = $(s[i], this, !0);
                        } else this._siblings = $(this.target, this, !0);
                }
                return O.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? D._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1;
            }, D.to = function (t, e, i) {
                return new D(t, e, i);
            }, D.from = function (t, e, i) {
                return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new D(t, e, i);
            }, D.fromTo = function (t, e, i, s) {
                return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new D(t, e, s);
            }, D.delayedCall = function (t, e, i, s, r) {
                return new D(e, 0, {
                    delay: t,
                    onComplete: e,
                    onCompleteParams: i,
                    callbackScope: s,
                    onReverseComplete: e,
                    onReverseCompleteParams: i,
                    immediateRender: !1,
                    lazy: !1,
                    useFrames: r,
                    overwrite: 0
                });
            }, D.set = function (t, e) {
                return new D(t, 0, e);
            }, D.getTweensOf = function (t, e) {
                if (null == t) return [];
                t = "string" != typeof t ? t : D.selector(t) || t;
                var i, s, r, n;
                if ((f(t) || M(t)) && "number" != typeof t[0]) {
                    for (i = t.length, s = []; --i > -1;) {
                        s = s.concat(D.getTweensOf(t[i], e));
                    }
                    for (i = s.length; --i > -1;) {
                        for (n = s[i], r = i; --r > -1;) {
                            n === s[r] && s.splice(i, 1);
                        }
                    }
                } else
                    for (s = $(t).concat(), i = s.length; --i > -1;) {
                        (s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
                    }
                return s;
            }, D.killTweensOf = D.killDelayedCallsTo = function (t, e, i) {
                "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && (i = e, e = !1);
                for (var s = D.getTweensOf(t, e), r = s.length; --r > -1;) {
                    s[r]._kill(i, t);
                }
            };
            var te = g("plugins.TweenPlugin", function (t, e) {
                this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = te.prototype;
            }, !0);
            if (n = te.prototype, te.version = "1.18.0", te.API = 2, n._firstPT = null, n._addTween = X, n.setRatio = N, n._kill = function (t) {
                    var e,
                        i = this._overwriteProps,
                        s = this._firstPT;
                    if (null != t[this._propName]) this._overwriteProps = [];
                    else
                        for (e = i.length; --e > -1;) {
                            null != t[i[e]] && i.splice(e, 1);
                        }
                    for (; s;) {
                        null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
                    }
                    return !1;
                }, n._roundProps = function (t, e) {
                    for (var i = this._firstPT; i;) {
                        (t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next;
                    }
                }, D._onPluginEvent = function (t, e) {
                    var i,
                        s,
                        r,
                        n,
                        a,
                        o = e._firstPT;
                    if ("_onInitAllProps" === t) {
                        for (; o;) {
                            for (a = o._next, s = r; s && s.pr > o.pr;) {
                                s = s._next;
                            }(o._prev = s ? s._prev : n) ? o._prev._next = o: r = o, (o._next = s) ? s._prev = o : n = o, o = a;
                        }
                        o = e._firstPT = r;
                    }
                    for (; o;) {
                        o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
                    }
                    return i;
                }, te.activate = function (t) {
                    for (var e = t.length; --e > -1;) {
                        t[e].API === te.API && (j[new t[e]()._propName] = t[e]);
                    }
                    return !0;
                }, d.plugin = function (t) {
                    if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
                    var e,
                        i = t.propName,
                        s = t.priority || 0,
                        r = t.overwriteProps,
                        n = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_roundProps",
                            initAll: "_onInitAllProps"
                        },
                        a = g("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () {
                            te.call(this, i, s), this._overwriteProps = r || [];
                        }, t.global === !0),
                        o = a.prototype = new te(i);
                    o.constructor = a, a.API = t.API;
                    for (e in n) {
                        "function" == typeof t[e] && (o[n[e]] = t[e]);
                    }
                    return a.version = t.version, te.activate([a]), a;
                }, s = t._gsQueue) {
                for (r = 0; s.length > r; r++) {
                    s[r]();
                }
                for (n in p) {
                    p[n].func || t.console.log("GSAP encountered missing dependency: com.greensock." + n);
                }
            }
            o = !1;
        }
    }("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : undefined || window, "TweenMax");
/*!
 * Vue.js v2.1.10
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1 (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind$1 (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b)
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) { cb.call(ctx); }
      if (_resolve) { _resolve(ctx); }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

var warn = noop;
var formatComponentName;

{
  var hasConsole = typeof console !== 'undefined';

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name;
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set$1 (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.length = Math.max(obj.length, key);
    obj.splice(key, 1, val);
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return
  }
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return
  }
  if (!ob) {
    obj[key] = val;
    return
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set$1(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$3) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    "development" !== 'production' && warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm[key] !== undefined) {
    return vm[key]
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}



var util = Object.freeze({
	defineReactive: defineReactive$$1,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove$1,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind$1,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	identity: identity,
	genStaticKeys: genStaticKeys,
	looseEqual: looseEqual,
	looseIndexOf: looseIndexOf,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	isServerRendering: isServerRendering,
	devtools: devtools,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    props: props,
    data: data,
    parent: context,
    children: children,
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (
  vnode,
  hydrating,
  parentElm,
  refElm
) {
  if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
    var child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance,
      parentElm,
      refElm
    );
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  } else if (vnode.data.keepAlive) {
    // kept-alive components, treat as a patch
    var mountedNode = vnode; // work around flow
    prepatch(mountedNode, mountedNode);
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions;
  var child = vnode.componentInstance = oldVnode.componentInstance;
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  );
}

function insert (vnode) {
  if (!vnode.componentInstance._isMounted) {
    vnode.componentInstance._isMounted = true;
    callHook(vnode.componentInstance, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.componentInstance._inactive = false;
    callHook(vnode.componentInstance, 'activated');
  }
}

function destroy$1 (vnode) {
  if (!vnode.componentInstance._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.componentInstance.$destroy();
    } else {
      vnode.componentInstance._inactive = true;
      callHook(vnode.componentInstance, 'deactivated');
    }
  }
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = baseCtor.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var once = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once,
    capture: capture
  }
});

function createEventHandle (fn) {
  var handle = {
    fn: fn,
    invoker: function () {
      var arguments$1 = arguments;

      var fn = handle.fn;
      if (Array.isArray(fn)) {
        for (var i = 0; i < fn.length; i++) {
          fn[i].apply(null, arguments$1);
        }
      } else {
        fn.apply(null, arguments);
      }
    }
  };
  return handle
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (!cur) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      if (!cur.invoker) {
        cur = on[name] = createEventHandle(cur);
      }
      add(event.name, cur.invoker, event.once, event.capture);
    } else if (cur !== old) {
      old.fn = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name].invoker, event.capture);
    }
  }
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// nomralization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constrcuts that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (c == null || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (last && last.text) {
        last.text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (c.text && last && last.text) {
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (c.tag && c.key == null && nestedIndex != null) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (alwaysNormalize) { normalizationType = ALWAYS_NORMALIZE; }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (data && data.__ob__) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
      typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (vnode) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (vnode.children) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (child.tag && !child.ns) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$options._parentVnode;
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = {};
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (_parentVnode && _parentVnode.data.scopedSlots) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots;
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        {
          warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
        }
        throw e
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // toString for mustaches
  Vue.prototype._s = _toString;
  // convert text to vnode
  Vue.prototype._v = createTextVNode;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = createEmptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, ("__static__" + index), false);
    return tree
  };

  // mark node as static (v-once)
  Vue.prototype._o = function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  };

  function markStatic (tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  // filter resolution helper
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  };

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret
  };

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        extend(props, bindObject);
      }
      return scopedSlotFn(props) || fallback
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && "development" !== 'production') {
        slotNodes._rendered && warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
        slotNodes._rendered = true;
      }
      return slotNodes || fallback
    }
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    data,
    tag,
    value,
    asProp
  ) {
    if (value) {
      if (!isObject(value)) {
        "development" !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var type = data.attrs && data.attrs.type;
            var hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data
  };

  // check v-on keyCodes
  Vue.prototype._k = function checkKeyCodes (
    eventKeyCode,
    key,
    builtInAlias
  ) {
    var keyCodes = config.keyCodes[key] || builtInAlias;
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  };
}

function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot;
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add$1 (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$2 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add$1, remove$2, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true;
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function updateComponent () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render
    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      {
        observerState.isSettingProps = false;
      }
      vm.$options.propsData = propsData;
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has$1 = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id, vm;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // call updated hooks
  index = queue.length;
  while (index--) {
    watcher = queue[index];
    vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            "development" !== 'production' && warn(
              ("Error in watcher \"" + (this.expression) + "\""),
              this.vm
            );
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch) { initWatch(vm, opts.watch); }
}

var isReservedProp = { key: 1, ref: 1, slot: 1 };

function initProps (vm, props) {
  var propsData = vm.$options.propsData || {};
  var keys = vm.$options._propKeys = Object.keys(props);
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( i ) {
    var key = keys[i];
    /* istanbul ignore else */
    {
      if (isReservedProp[key]) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
  };

  for (var i = 0; i < keys.length; i++) loop( i );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed (vm, computed) {
  for (var key in computed) {
    /* istanbul ignore if */
    if ("development" !== 'production' && key in vm) {
      warn(
        "existing instance property \"" + key + "\" will be " +
        "overwritten by a computed property with the same name.",
        vm
      );
    }
    var userDef = computed[key];
    if (typeof userDef === 'function') {
      computedSharedDefinition.get = makeComputedGetter(userDef, vm);
      computedSharedDefinition.set = noop;
    } else {
      computedSharedDefinition.get = userDef.get
        ? userDef.cache !== false
          ? makeComputedGetter(userDef.get, vm)
          : bind$1(userDef.get, vm)
        : noop;
      computedSharedDefinition.set = userDef.set
        ? bind$1(userDef.set, vm)
        : noop;
    }
    Object.defineProperty(vm, key, computedSharedDefinition);
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value
  }
}

function initMethods (vm, methods) {
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
    if ("development" !== 'production' && methods[key] == null) {
      warn(
        "method \"" + key + "\" has an undefined value in the component definition. " +
        "Did you reference the function correctly?",
        vm
      );
    }
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data
  };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set$1;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = Ctor.super.options;
    var cachedSuperOptions = Ctor.superOptions;
    var extendOptions = Ctor.extendOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed
      Ctor.superOptions = superOptions;
      extendOptions.render = options.render;
      extendOptions.staticRenderFns = options.staticRenderFns;
      extendOptions._scopeId = options._scopeId;
      options = Ctor.options = mergeOptions(superOptions, extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else {
    return pattern.test(name)
  }
}

function pruneCache (cache, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cachedNode);
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    if (!vnode.componentInstance._inactive) {
      callHook(vnode.componentInstance, 'deactivated');
    }
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set$1;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Vue$3.version = '2.1.10';

/*  */

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.componentInstance) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + selector
      );
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (parent) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isReactivated) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref) {
    if (parent) {
      if (ref) {
        nodeOps.insertBefore(parent, elm, ref);
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) { i.create(emptyNode, vnode); }
      if (i.insert) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        (vnode.isCloned || vnode.isOnce)) {
      vnode.elm = oldVnode.elm;
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (!vnode) {
      if (oldVnode) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (vnode.parent) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parentElm$1 !== null) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var target$1;

function add$2 (
  event,
  handler,
  once,
  capture
) {
  if (once) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      remove$3(event, handler, capture, _target);
      arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
    };
  }
  target$1.addEventListener(event, handler, capture);
}

function remove$3 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  updateListeners(on, oldOn, add$2, remove$3, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(vnode, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (vnode, newVal) {
  var value = vnode.elm.value;
  var modifiers = vnode.elm._vModifiers; // injected by v-model runtime
  if ((modifiers && modifiers.number) || vnode.elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal)
  }
  if (modifiers && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    el.style[normalize(name)] = val;
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (!data.staticStyle && !data.style &&
      !oldData.staticStyle && !oldData.style) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldVnode.data.staticStyle;
  var oldStyleBinding = oldVnode.data.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  vnode.data.style = style.__ob__ ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (newStyle[name] == null) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var toClass = isAppear ? appearToClass : enterToClass;
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    leaveToClass: (name + "-leave-to"),
    appearToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
});

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

function _enter (_, vnode) {
  if (!vnode.data.show) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted (el, binding, vnode) {
    {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        );
      }
    }
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    var key = child.key = child.key == null
      ? id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.isUnknownElement = isUnknownElement;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch$1 : noop;

// wrap mount
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return this._mount(el, hydrating)
};

if ("development" !== 'production' &&
    inBrowser && typeof console !== 'undefined') {
  console[console.info ? 'info' : 'log'](
    "You are running Vue in development mode.\n" +
    "Make sure to turn on production mode when deploying for production.\n" +
    "See more tips at https://vuejs.org/guide/deployment.html"
  );
}

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (
      "development" !== 'production' &&
      inBrowser && !isEdge && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var decoder;

function decode (html) {
  decoder = decoder || document.createElement('div');
  decoder.innerHTML = html;
  return decoder.textContent
}

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isScriptOrStyle = makeMap('script,style', true);
var reCache = {};

var ltRE = /&lt;/g;
var gtRE = /&gt;/g;
var nlRE = /&#10;/g;
var ampRE = /&amp;/g;
var quoteRE = /&quot;/g;

function decodeAttr (value, shouldDecodeNewlines) {
  if (shouldDecodeNewlines) {
    value = value.replace(nlRE, '\n');
  }
  return value
    .replace(ltRE, '<')
    .replace(gtRE, '>')
    .replace(ampRE, '&')
    .replace(quoteRE, '"')
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a script or style element
    if (!lastTag || !isScriptOrStyle(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd > 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last && options.chars) {
      options.chars(html);
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
      unarySlash = '';
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !/[\w$]/.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue parser]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important
) {
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
var bindRE = /^:|^v-bind:/;
var onRE = /^@|^v-on:/;
var argRE = /:(.*)$/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$1;
var platformGetTagNamespace;
var platformMustUseProp;
var platformIsPreTag;
var preTransforms;
var transforms;
var postTransforms;
var delimiters;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$1 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;
  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;
  parseHTML(template, {
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$1(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        if ("development" !== 'production' && !warned) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warned = true;
            warn$1(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes:\n' + template
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warned = true;
            warn$1(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements:\n' + template
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if ("development" !== 'production' && !warned) {
          warned = true;
          warn$1(
            "Component template should contain exactly one root element:" +
            "\n\n" + template + "\n\n" +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || 'default';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
    },

    chars: function chars (text) {
      if (!currentParent) {
        if ("development" !== 'production' && !warned && text === template) {
          warned = true;
          warn$1(
            'Component template requires a root element, rather than just text:\n\n' + template
          );
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || children[children.length - 1].text !== ' ') {
          currentParent.children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$1("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$1(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$1(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$1(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once = getAndRemoveAttr(el, 'v-once');
  if (once != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$1(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, arg, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        if (argMatch && (arg = argMatch[1])) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$1(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
      warn$1('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      walkThroughConditionsBlocks(node.ifConditions, isInFor);
    }
  }
}

function walkThroughConditionsBlocks (conditionBlocks, isInFor) {
  for (var i = 1, len = conditionBlocks.length; i < len; i++) {
    markStaticRoots(conditionBlocks[i].block, isInFor);
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: 'if($event.target !== $event.currentTarget)return;',
  ctrl: 'if(!$event.ctrlKey)return;',
  shift: 'if(!$event.shiftKey)return;',
  alt: 'if(!$event.altKey)return;',
  meta: 'if(!$event.metaKey)return;'
};

function genHandlers (events, native) {
  var res = native ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  } else if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  } else if (!handler.modifiers) {
    return fnExpRE.test(handler.value) || simplePathRE.test(handler.value)
      ? handler.value
      : ("function($event){" + (handler.value) + "}")
  } else {
    var code = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        code += modifierCode[key];
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code = genKeyFilter(keys) + code;
    }
    var handlerCode = simplePathRE.test(handler.value)
      ? handler.value + '($event)'
      : handler.value;
    return 'function($event){' + code + handlerCode + '}'
  }
}

function genKeyFilter (keys) {
  return ("if(" + (keys.map(genFilterCode).join('&&')) + ")return;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function bind$2 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  bind: bind$2,
  cloak: noop
};

/*  */

// configurable state
var warn$2;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var isPlatformReservedTag$1;
var staticRenderFns;
var onceCount;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  var prevOnceCount = onceCount;
  onceCount = 0;
  currentOptions = options;
  warn$2 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  isPlatformReservedTag$1 = options.isReservedTag || no;
  var code = ast ? genElement(ast) : '_c("div")';
  staticRenderFns = prevStaticRenderFns;
  onceCount = prevOnceCount;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el)
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el);
    } else {
      var data = el.plain ? undefined : genData(el);

      var children = el.inlineTemplate ? null : genChildren(el, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el) {
  el.staticProcessed = true;
  staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
  return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && warn$2(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el)
    }
    return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el)
  }
}

function genIf (el) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}

function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return el.once ? genOnce(el) : genElement(el)
  }
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots)) + ",";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$2);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    warn$2('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, currentOptions);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (slots) {
  return ("scopedSlots:{" + (Object.keys(slots).map(function (key) { return genScopedSlot(key, slots[key]); }).join(',')) + "}")
}

function genScopedSlot (key, el) {
  return key + ":function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el) || 'void 0'
      : genElement(el)) + "}"
}

function genChildren (el, checkSkip) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot') {
      return genElement(el$1)
    }
    var normalizationType = getNormalizationType(children);
    return ("[" + (children.map(genNode).join(',')) + "]" + (checkSkip
        ? normalizationType ? ("," + normalizationType) : ''
        : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function maybeComponent (el) {
  return !isPlatformReservedTag$1(el.tag)
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (componentName, el) {
  var children = el.inlineTemplate ? null : genChildren(el, true);
  return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

/**
 * Compile a template.
 */
function compile$1 (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

/*  */

// operators like typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');
// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;
// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("- invalid " + type + " \"" + ident + "\" in expression: " + text));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "- avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + text
      );
    } else {
      errors.push(("- invalid expression: " + text));
    }
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

var warn$3;

function model$1 (
  el,
  dir,
  _warn
) {
  warn$3 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;
  {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$3(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
  }
  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else {
    genDefaultModel(el, value, modifiers);
  }
  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  if ("development" !== 'production' &&
    el.attrsMap.checked != null) {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
      "inline checked attributes will be ignored when using v-model. " +
      'Declare initial values in the component\'s data option instead.'
    );
  }
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'click',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + value + "=$$c}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  if ("development" !== 'production' &&
    el.attrsMap.checked != null) {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
      "inline checked attributes will be ignored when using v-model. " +
      'Declare initial values in the component\'s data option instead.'
    );
  }
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'click', genAssignmentCode(value, valueBinding), null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  {
    if (el.tag === 'input' && el.attrsMap.value) {
      warn$3(
        "<" + (el.tag) + " v-model=\"" + value + "\" value=\"" + (el.attrsMap.value) + "\">:\n" +
        'inline value attributes will be ignored when using v-model. ' +
        'Declare initial values in the component\'s data option instead.'
      );
    }
    if (el.tag === 'textarea' && el.children.length) {
      warn$3(
        "<textarea v-model=\"" + value + "\">:\n" +
        'inline content inside <textarea> will be ignored when using v-model. ' +
        'Declare initial values in the component\'s data option instead.'
      );
    }
  }

  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var event = lazy || (isIE && type === 'range') ? 'change' : 'input';
  var needCompositionGuard = !lazy && type !== 'range';
  var isNative = el.tag === 'input' || el.tag === 'textarea';

  var valueExpression = isNative
    ? ("$event.target.value" + (trim ? '.trim()' : ''))
    : trim ? "(typeof $event === 'string' ? $event.trim() : $event)" : "$event";
  valueExpression = number || type === 'number'
    ? ("_n(" + valueExpression + ")")
    : valueExpression;

  var code = genAssignmentCode(value, valueExpression);
  if (isNative && needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  // inputs with type="file" are read only and setting the input's
  // value will throw an error.
  if ("development" !== 'production' &&
      type === 'file') {
    warn$3(
      "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
      "File inputs are read only. Use a v-on:change listener instead."
    );
  }

  addProp(el, 'value', isNative ? ("_s(" + value + ")") : ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

function genSelect (
    el,
    value,
    modifiers
) {
  {
    el.children.some(checkOptionWarning);
  }

  var number = modifiers && modifiers.number;
  var assignment = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})" +
    (el.attrsMap.multiple == null ? '[0]' : '');

  var code = genAssignmentCode(value, assignment);
  addHandler(el, 'change', code, null, true);
}

function checkOptionWarning (option) {
  if (option.type === 1 &&
    option.tag === 'option' &&
    option.attrsMap.selected != null) {
    warn$3(
      "<select v-model=\"" + (option.parent.attrsMap['v-model']) + "\">:\n" +
      'inline selected attributes on <option> will be ignored when using v-model. ' +
      'Declare initial values in the component\'s data option instead.'
    );
    return true
  }
  return false
}

function genAssignmentCode (value, assignment) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model$1,
  text: text,
  html: html
};

/*  */

var cache = Object.create(null);

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  staticKeys: genStaticKeys(modules$1),
  directives: directives$1,
  isReservedTag: isReservedTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  getTagNamespace: getTagNamespace,
  isPreTag: isPreTag
};

function compile$$1 (
  template,
  options
) {
  options = options
    ? extend(extend({}, baseOptions), options)
    : baseOptions;
  return compile$1(template, options)
}

function compileToFunctions (
  template,
  options,
  vm
) {
  var _warn = (options && options.warn) || warn;
  // detect possible CSP restriction
  /* istanbul ignore if */
  {
    try {
      new Function('return 1');
    } catch (e) {
      if (e.toString().match(/unsafe-eval|CSP/)) {
        _warn(
          'It seems you are using the standalone build of Vue.js in an ' +
          'environment with Content Security Policy that prohibits unsafe-eval. ' +
          'The template compiler cannot work in this environment. Consider ' +
          'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
          'templates into render functions.'
        );
      }
    }
  }
  var key = options && options.delimiters
    ? String(options.delimiters) + template
    : template;
  if (cache[key]) {
    return cache[key]
  }
  var res = {};
  var compiled = compile$$1(template, options);
  res.render = makeFunction(compiled.render);
  var l = compiled.staticRenderFns.length;
  res.staticRenderFns = new Array(l);
  for (var i = 0; i < l; i++) {
    res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
  }
  {
    if (res.render === noop || res.staticRenderFns.some(function (fn) { return fn === noop; })) {
      _warn(
        "failed to compile template:\n\n" + template + "\n\n" +
        detectErrors(compiled.ast).join('\n') +
        '\n\n',
        vm
      );
    }
  }
  return (cache[key] = res)
}

function makeFunction (code) {
  try {
    return new Function(code)
  } catch (e) {
    return noop
  }
}

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      var ref = compileToFunctions(template, {
        warn: warn,
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));
