/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.Vue = factory());
}(this, (function () {
  'use strict';

  /*  */

  var emptyObject = Object.freeze({});

  // these helpers produces better vm code in JS engines due to their
  // explicitness and function inlining
  function isUndef(v) {
    return v === undefined || v === null
  }

  function isDef(v) {
    return v !== undefined && v !== null
  }

  function isTrue(v) {
    return v === true
  }

  function isFalse(v) {
    return v === false
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value e.g. [object Object]
   */
  var _toString = Object.prototype.toString;

  function toRawType(value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString(val) {
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
  function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap(
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
   * Check if a attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array
   */
  function remove(arr, item) {
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
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
    var cache = Object.create(null);
    return (function cachedFn(str) {
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
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it... e.g.
   * PhantomJS 1.x. Technically we don't need this anymore since native bind is
   * now more performant in most browsers, but removing it would be breaking for
   * code that was able to run in PhantomJS 1.x, so this must be kept for
   * backwards compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind(fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
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
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
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
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
   */
  function noop(a, b, c) { }

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /**
   * Return same value
   */
  var identity = function (_) { return _; };

  /**
   * Generate a static keys string from compiler modules.
   */
  function genStaticKeys(modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, []).join(',')
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
  ];

  /*  */

  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

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
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  })

  /*  */

  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
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
  function parsePath(path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get() {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) { }
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
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
  function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = (function () {
      function Set() {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has(key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add(key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear() {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var generateComponentTrace = (noop); // work around flow check
  var formatComponentName = (noop);

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) {
      return str
        .replace(classifyRE, function (c) { return c.toUpperCase(); })
        .replace(/[-_]/g, '');
    };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace));
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && (!config.silent)) {
        console.warn("[Vue tip]: " + msg + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>'
      }
      var options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm || {};
      var name = options.name || options._componentTag;
      var file = options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
        (file && includeFile !== false ? (" at " + file) : '')
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) {
            return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm)));
          })
          .join('\n')
      } else {
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */


  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep() {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify() {
    // stabilize the subscriber list first
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

  function pushTarget(_target) {
    if (Dep.target) { targetStack.push(Dep.target); }
    Dep.target = _target;
  }

  function popTarget() {
    Dep.target = targetStack.pop();
  }

  /*  */

  var VNode = function VNode(
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
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
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties(VNode.prototype, prototypeAccessors);

  var createEmptyVNode = function (text) {
    if (text === void 0) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      var args = [], len = arguments.length;
      while (len--) args[len] = arguments[len];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
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
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving(value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer(value) {
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
  Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment(target, src, keys) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment(target, src, keys) {
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
  function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
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
  function defineReactive(
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    if (!getter && arguments.length === 2) {
      val = obj[key];
    }
    var setter = property && property.set;

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter(newVal) {
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
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set(target, key, val) {
    if ("development" !== 'production' &&
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      "development" !== 'production' && warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del(target, key) {
    if ("development" !== 'production' &&
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      "development" !== 'production' && warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray(value) {
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
  function mergeData(to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn(
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
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
      return function mergedDataFn() {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn() {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        "development" !== 'production' && warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook(
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

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      "development" !== 'production' && assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
    strats.methods =
    strats.inject =
    strats.computed = function (
      parentVal,
      childVal,
      vm,
      key
    ) {
      if (childVal && "development" !== 'production') {
        assertObjectType(key, childVal, vm);
      }
      if (!parentVal) { return childVal }
      var ret = Object.create(null);
      extend(ret, parentVal);
      if (childVal) { extend(ret, childVal); }
      return ret
    };
  strats.provide = mergeDataOrFn;

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
  function checkComponents(options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName(name) {
    if (!/^[a-zA-Z][\w-]*$/.test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'can only contain alphanumeric characters and the hyphen, ' +
        'and must start with a letter.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options, vm) {
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
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject(options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives(options) {
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

  function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
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
    function mergeField(key) {
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
  function resolveAsset(
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

  function validateProp(
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ("development" !== 'production' && isObject(def)) {
      warn(
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
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp(
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
        "Invalid prop: type check failed for prop \"" + name + "\"." +
        " Expected " + (expectedTypes.map(capitalize).join(', ')) +
        ", got " + (toRawType(value)) + ".",
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

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType(value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      var t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
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
  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType(a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex(type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  /*  */

  function handleError(err, vm, info) {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  }

  function globalHandleError(err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        logError(e, null, 'config.errorHandler');
      }
    }
    logError(err, vm, info);
  }

  function logError(err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */
  /* globals MessageChannel */

  var callbacks = [];
  var pending = false;

  function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using both microtasks and (macro) tasks.
  // In < 2.4 we used microtasks everywhere, but there are some scenarios where
  // microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690) or even between bubbling of the same
  // event (#6566). However, using (macro) tasks everywhere also has subtle problems
  // when state is changed right before repaint (e.g. #6813, out-in transitions).
  // Here we use microtask by default, but expose a way to force (macro) task when
  // needed (e.g. in event handlers attached by v-on).
  var microTimerFunc;
  var macroTimerFunc;
  var useMacroTask = false;

  // Determine (macro) task defer implementation.
  // Technically setImmediate should be the ideal choice, but it's only available
  // in IE. The only polyfill that consistently queues the callback after all DOM
  // events triggered in the same loop is by using MessageChannel.
  /* istanbul ignore if */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) {
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = flushCallbacks;
    macroTimerFunc = function () {
      port.postMessage(1);
    };
  } else {
    /* istanbul ignore next */
    macroTimerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  // Determine microtask defer implementation.
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    microTimerFunc = function () {
      p.then(flushCallbacks);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else {
    // fallback to macro
    microTimerFunc = macroTimerFunc;
  }

  /**
   * Wrap a function so that if any code inside triggers state change,
   * the changes are queued using a (macro) task instead of a microtask.
   */
  function withMacroTask(fn) {
    return fn._withTask || (fn._withTask = function () {
      useMacroTask = true;
      var res = fn.apply(null, arguments);
      useMacroTask = false;
      return res
    })
  }

  function nextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      if (useMacroTask) {
        macroTimerFunc();
      } else {
        microTimerFunc();
      }
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        perf.clearMeasures(name);
      };
    }
  }

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
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set(target, key, value) {
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
      has: function has(target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
        if (!has && !isAllowed) {
          warnNonPresent(target, key);
        }
        return has || !isAllowed
      }
    };

    var getHandler = {
      get: function get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warnNonPresent(target, key);
        }
        return target[key]
      }
    };

    initProxy = function initProxy(vm) {
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

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
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

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker(fns) {
    function invoker() {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          cloned[i].apply(null, arguments$1);
        }
      } else {
        // return handler return value for single handlers
        return fns.apply(null, arguments)
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners(
    on,
    oldOn,
    add,
    remove$$1,
    vm
  ) {
    var name, def, cur, old, event;
    for (name in on) {
      def = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      /* istanbul ignore if */
      if (isUndef(cur)) {
        "development" !== 'production' && warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur);
        }
        add(event.name, cur, event.once, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook(def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook() {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData(
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp(
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
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

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function ensureCtor(comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder(
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent(
    factory,
    baseCtor,
    context
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (isDef(factory.contexts)) {
      // already pending
      factory.contexts.push(context);
    } else {
      var contexts = factory.contexts = [context];
      var sync = true;

      var forceRender = function () {
        for (var i = 0, l = contexts.length; i < l; i++) {
          contexts[i].$forceUpdate();
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender();
        }
      });

      var reject = once(function (reason) {
        "development" !== 'production' && warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender();
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (typeof res.then === 'function') {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isDef(res.component) && typeof res.component.then === 'function') {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              setTimeout(function () {
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender();
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            setTimeout(function () {
              if (isUndef(factory.resolved)) {
                reject(
                  "timeout (" + (res.timeout) + "ms)"
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild(children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add(event, fn, once) {
    if (once) {
      target.$once(event, fn);
    } else {
      target.$on(event, fn);
    }
  }

  function remove$1(event, fn) {
    target.$off(event, fn);
  }

  function updateComponentListeners(
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
    target = undefined;
  }

  function eventsMixin(Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var this$1 = this;

      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on() {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var this$1 = this;

      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$off(event[i], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      if (fn) {
        // specific handler
        var cb;
        var i$1 = cbs.length;
        while (i$1--) {
          cb = cbs[i$1];
          if (cb === fn || cb.fn === fn) {
            cbs.splice(i$1, 1);
            break
          }
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          try {
            cbs[i].apply(vm, args);
          } catch (e) {
            handleError(e, vm, ("event handler for \"" + event + "\""));
          }
        }
      }
      return vm
    };
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(
    children,
    context
  ) {
    var slots = {};
    if (!children) {
      return slots
    }
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace(node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  function resolveScopedSlots(
    fns, // see flow/vnode
    res
  ) {
    res = res || {};
    for (var i = 0; i < fns.length; i++) {
      if (Array.isArray(fns[i])) {
        resolveScopedSlots(fns[i], res);
      } else {
        res[fns[i].key] = fns[i].fn;
      }
    }
    return res
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function initLifecycle(vm) {
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
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin(Vue) {
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
        // no need for the ref nodes after initial patch
        // this prevents keeping a detached DOM tree in memory (#5851)
        vm.$options._parentElm = vm.$options._refElm = null;
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
        remove(parent.$children, vm);
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
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent(
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
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

    var updateComponent;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent(
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren
    var hasChildren = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      parentVnode.data.scopedSlots || // has new scoped slots
      vm.$scopedSlots !== emptyObject // has old scoped slots
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook(vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm);
        } catch (e) {
          handleError(e, vm, (hook + " hook"));
        }
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */


  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
    flushing = true;
    var watcher, id;

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
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ("development" !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
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

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks(queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent(vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks(queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$1 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher(
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
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
    this.id = ++uid$1; // uid for batching
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
        this.getter = function () { };
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
  Watcher.prototype.get = function get() {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep(dep) {
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
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
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
  Watcher.prototype.update = function update() {
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
  Watcher.prototype.run = function run() {
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
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
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
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown() {
    var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState(vm) {
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
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function (key) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive(props, key, value, function () {
          if (vm.$parent && !isUpdatingChildComponent) {
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
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop(key);
    toggleObserving(true);
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
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
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
        "development" !== 'production' && warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed(vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if ("development" !== 'production' && getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed(
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : userDef;
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : userDef.get
        : noop;
      sharedPropertyDefinition.set = userDef.set
        ? userDef.set
        : noop;
    }
    if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (methods[key] == null) {
          warn(
            "Method \"" + key + "\" has an undefined value in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    }
  }

  function initWatch(vm, watch) {
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

  function createWatcher(
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function (newData) {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn() {
        watcher.teardown();
      }
    };
  }

  /*  */

  function initProvide(vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections(vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject(inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList(
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
    if (isDef(ret)) {
      (ret)._isVList = true;
    }
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot(
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if ("development" !== 'production' && !isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes) {
        if ("development" !== 'production' && slotNodes._rendered) {
          warn(
            "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
            "- this will likely cause render errors.",
            this
          );
        }
        slotNodes._rendered = true;
      }
      nodes = slotNodes || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch(expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes(
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(
    data,
    tag,
    value,
    asProp,
    isSync
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
        var hash;
        var loop = function (key) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          if (!(key in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop(key);
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic(
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce(
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic(
    tree,
    key,
    isOnce
  ) {
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

  function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners(data, value) {
    if (value) {
      if (!isPlainObject(value)) {
        "development" !== 'production' && warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function installRenderHelpers(target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
  }

  /*  */

  function FunctionalRenderContext(
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () { return resolveSlots(children, parent); };

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = data.scopedSlots || emptyObject;
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent(
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult(vnode, data, contextVm, options) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps(to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */




  // Register the component hook to weex native render engine.
  // The hook will be triggered by native, not javascript.


  // Updates the state of the component to weex native render engine.

  /*  */

  // https://github.com/Hanks10100/weex-native-directive/tree/master/component

  // listening on native callback

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init(
      vnode,
      hydrating,
      parentElm,
      refElm
    ) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance,
          parentElm,
          refElm
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch(oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert(vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy(vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent(
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    // Weex specific: invoke recycle-list optimized @render function for
    // extracting cell-slot template.
    // https://github.com/Hanks10100/weex-native-directive/tree/master/component
    /* istanbul ignore if */
    return vnode
  }

  function createComponentInstanceForVnode(
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent, // activeInstance in lifecycle state
    parentElm,
    refElm
  ) {
    var options = {
      _isComponent: true,
      parent: parent,
      _parentVnode: vnode,
      _parentElm: parentElm || null,
      _refElm: refElm || null
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks(data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      hooks[key] = componentVNodeHooks[key];
    }
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'; (data.props || (data.props = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    if (isDef(on[event])) {
      on[event] = [data.model.callback].concat(on[event]);
    } else {
      on[event] = data.model.callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement(
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
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement(
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      "development" !== 'production' && warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if ("development" !== 'production' &&
      isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
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
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
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
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS(vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings(data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  function renderMixin(Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      // reset _rendered flag on slots for duplicate slot check
      {
        for (var key in vm.$slots) {
          // $flow-disable-line
          vm.$slots[key]._rendered = false;
        }
      }

      if (_parentVnode) {
        vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          if (vm.$options.renderError) {
            try {
              vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
            } catch (e) {
              handleError(e, vm, "renderError");
              vnode = vm._vnode;
            }
          } else {
            vnode = vm._vnode;
          }
        }
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
  }

  /*  */

  var uid$3 = 0;

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

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
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent(vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    opts._parentElm = options._parentElm;
    opts._refElm = options._refElm;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions(Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions(Ctor) {
    var modified;
    var latest = Ctor.options;
    var extended = Ctor.extendOptions;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = dedupe(latest[key], extended[key], sealed[key]);
      }
    }
    return modified
  }

  function dedupe(latest, extended, sealed) {
    // compare latest and sealed to ensure lifecycle hooks won't be duplicated
    // between merges
    if (Array.isArray(latest)) {
      var res = [];
      sealed = Array.isArray(sealed) ? sealed : [sealed];
      extended = Array.isArray(extended) ? extended : [extended];
      for (var i = 0; i < latest.length; i++) {
        // push original options and not sealed options to exclude duplicated options
        if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
          res.push(latest[i]);
        }
      }
      return res
    } else {
      return latest
    }
  }

  function Vue(options) {
    if ("development" !== 'production' &&
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse(Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend(Vue) {
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
      if ("development" !== 'production' && name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent(options) {
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

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
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
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1(Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1(Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if ("development" !== 'production' && type === 'component') {
            validateComponentName(id);
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

  function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches(pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache(keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry(
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created() {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed() {
      var this$1 = this;

      for (var key in this$1.cache) {
        pruneCacheEntry(this$1.cache, key, this$1.keys);
      }
    },

    mounted: function mounted() {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render() {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  }

  var builtInComponents = {
    KeepAlive: KeepAlive
  }

  /*  */

  function initGlobalAPI(Vue) {
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

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
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

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get() {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.5.16';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
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

  function genClassForVnode(vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass(
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat(a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass(value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray(value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject(value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
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
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isPreTag = function (tag) { return tag === 'pre'; };

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace(tag) {
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
  function isUnknownElement(tag) {
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

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        "development" !== 'production' && warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1(tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode(text) {
    return document.createTextNode(text)
  }

  function createComment(text) {
    return document.createComment(text)
  }

  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(node, child) {
    node.removeChild(child);
  }

  function appendChild(node, child) {
    node.appendChild(child);
  }

  function parentNode(node) {
    return node.parentNode
  }

  function nextSibling(node) {
    return node.nextSibling
  }

  function tagName(node) {
    return node.tagName
  }

  function setTextContent(node, text) {
    node.textContent = text;
  }

  function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
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
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    }
  }

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
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
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode(a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType(a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction(backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb(childElm, listeners) {
      function remove() {
        if (--remove.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove.listeners = listeners;
      return remove
    }

    function removeNode(el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1(vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    var creatingElmInVPre = 0;

    function createElm(
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

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
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
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
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
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
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent(vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
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

    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
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

    function insert(parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (ref$$1.parentNode === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable(vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook(vnode) {
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

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
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

    function removeAndInvokeRemoveHook(vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
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

    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

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
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys(children) {
      var seenKeys = {};
      for (var i = 0; i < children.length; i++) {
        var vnode = children[i];
        var key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld(node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
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
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook(vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
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
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if ("development" !== 'production' &&
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if ("development" !== 'production' &&
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch(node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
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
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
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

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm$1,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm$1)) {
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
    destroy: function unbindDirectives(vnode) {
      updateDirectives(vnode, emptyNode);
    }
  }

  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update(oldVnode, vnode) {
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
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
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

  function normalizeDirectives$1(
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName(dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ]

  /*  */

  function updateAttrs(oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
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
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr(el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
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
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  }

  /*  */

  function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
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
  }

  /*  */

  var validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters(exp) {
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
          if (!p || !validDivisionCharRE.test(p)) {
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

    function pushFilter() {
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

  function wrapFilter(exp, filter) {
    var i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return ("_f(\"" + filter + "\")(" + exp + ")")
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
    }
  }

  /*  */

  function baseWarn(msg) {
    console.error(("[Vue compiler]: " + msg));
  }

  function pluckModuleFunction(
    modules,
    key
  ) {
    return modules
      ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
      : []
  }

  function addProp(el, name, value) {
    (el.props || (el.props = [])).push({ name: name, value: value });
    el.plain = false;
  }

  function addAttr(el, name, value) {
    (el.attrs || (el.attrs = [])).push({ name: name, value: value });
    el.plain = false;
  }

  // add a raw attr (use this in preTransforms)
  function addRawAttr(el, name, value) {
    el.attrsMap[name] = value;
    el.attrsList.push({ name: name, value: value });
  }

  function addDirective(
    el,
    name,
    rawName,
    value,
    arg,
    modifiers
  ) {
    (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
    el.plain = false;
  }

  function addHandler(
    el,
    name,
    value,
    modifiers,
    important,
    warn
  ) {
    modifiers = modifiers || emptyObject;
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      "development" !== 'production' && warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.'
      );
    }

    // check capture modifier
    if (modifiers.capture) {
      delete modifiers.capture;
      name = '!' + name; // mark the event as captured
    }
    if (modifiers.once) {
      delete modifiers.once;
      name = '~' + name; // mark the event as once
    }
    /* istanbul ignore if */
    if (modifiers.passive) {
      delete modifiers.passive;
      name = '&' + name; // mark the event as passive
    }

    // normalize click.right and click.middle since they don't actually fire
    // this is technically browser-specific, but at least for now browsers are
    // the only target envs that have right/middle clicks.
    if (name === 'click') {
      if (modifiers.right) {
        name = 'contextmenu';
        delete modifiers.right;
      } else if (modifiers.middle) {
        name = 'mouseup';
      }
    }

    var events;
    if (modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    var newHandler = {
      value: value.trim()
    };
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers;
    }

    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }

    el.plain = false;
  }

  function getBindingAttr(
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

  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr(
    el,
    name,
    removeFromMap
  ) {
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
    if (removeFromMap) {
      delete el.attrsMap[name];
    }
    return val
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(
    el,
    value,
    modifiers
  ) {
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression = '$$v';
    var valueExpression = baseValueExpression;
    if (trim) {
      valueExpression =
        "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }
    var assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: ("(" + value + ")"),
      expression: ("\"" + value + "\""),
      callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(
    value,
    assignment
  ) {
    var res = parseModel(value);
    if (res.key === null) {
      return (value + "=" + assignment)
    } else {
      return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
    }
  }

  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */

  var len;
  var str;
  var chr;
  var index$1;
  var expressionPos;
  var expressionEndPos;



  function parseModel(val) {
    // Fix https://github.com/vuejs/vue/pull/7730
    // allow v-model="obj.val " (trailing whitespace)
    val = val.trim();
    len = val.length;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index$1 = val.lastIndexOf('.');
      if (index$1 > -1) {
        return {
          exp: val.slice(0, index$1),
          key: '"' + val.slice(index$1 + 1) + '"'
        }
      } else {
        return {
          exp: val,
          key: null
        }
      }
    }

    str = val;
    index$1 = expressionPos = expressionEndPos = 0;

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
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos)
    }
  }

  function next() {
    return str.charCodeAt(++index$1)
  }

  function eof() {
    return index$1 >= len
  }

  function isStringStart(chr) {
    return chr === 0x22 || chr === 0x27
  }

  function parseBracket(chr) {
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

  function parseString(chr) {
    var stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break
      }
    }
  }

  /*  */

  var warn$1;

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  function model(
    el,
    dir,
    _warn
  ) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1(
          "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
          "File inputs are read only. Use a v-on:change listener instead."
        );
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "v-model is not supported on this element type. " +
        'If you are working with contenteditable, it\'s recommended to ' +
        'wrap a library dedicated for that purpose inside a custom component.'
      );
    }

    // ensure runtime directive metadata
    return true
  }

  function genCheckboxModel(
    el,
    value,
    modifiers
  ) {
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
    addHandler(el, 'change',
      "var $$a=" + value + "," +
      '$$el=$event.target,' +
      "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
      'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
      '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
      "}else{" + (genAssignmentCode(value, '$$c')) + "}",
      null, true
    );
  }

  function genRadioModel(
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
    addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect(
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var selectedVal = "Array.prototype.filter" +
      ".call($event.target.options,function(o){return o.selected})" +
      ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
      "return " + (number ? '_n(val)' : 'val') + "})";

    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    var code = "var $$selectedVal = " + selectedVal + ";";
    code = code + " " + (genAssignmentCode(value, assignment));
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel(
    el,
    value,
    modifiers
  ) {
    var type = el.attrsMap.type;

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
      var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
      var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (value$1 && !typeBinding) {
        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
        warn$1(
          binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
          'because the latter already expands to a value binding internally'
        );
      }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy
      ? 'change'
      : type === 'range'
        ? RANGE_TOKEN
        : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', ("(" + value + ")"));
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents(on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler(handler, event, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler() {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  function add$1(
    event,
    handler,
    once$$1,
    capture,
    passive
  ) {
    handler = withMacroTask(handler);
    if (once$$1) { handler = createOnceHandler(handler, event, capture); }
    target$1.addEventListener(
      event,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2(
    event,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      event,
      handler._withTask || handler,
      capture
    );
  }

  function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  }

  /*  */

  function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (isUndef(props[key])) {
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
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue(elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) { }
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers(elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.lazy) {
        // inputs with lazy should only be updated when not in focus
        return false
      }
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  }

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
  function normalizeStyleData(data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
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
  function getStyle(vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
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
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle(oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
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
  }

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
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
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition(def) {
    if (!def) {
      return
    }
    /* istanbul ignore else */
    if (typeof def === 'object') {
      var res = {};
      if (def.css !== false) {
        extend(res, autoCssTransition(def.name || 'v'));
      }
      extend(res, def);
      return res
    } else if (typeof def === 'string') {
      return autoCssTransition(def)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

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
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame(fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass(el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds(
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

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
    var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
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

  function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  function toMs(s) {
    return Number(s.slice(0, -1)) * 1000
  }

  /*  */

  function enter(vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
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
    var duration = data.duration;

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

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if ("development" !== 'production' && explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

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
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
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

  function leave(vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
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
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

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

    function performLeave() {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter(_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1(vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {}

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ]

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

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

  var directive = {
    inserted: function inserted(el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected(el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected(el, binding, vm) {
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

  function hasNoMatchingOption(value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue(option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update(el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
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

    unbind: function unbind(
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
  }

  var platformDirectives = {
    model: directive,
    show: show
  }

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
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData(comp) {
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
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder(h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render(h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
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
        mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
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
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
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

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  }

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final desired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render(h) {
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
              ; (c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
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

    beforeUpdate: function beforeUpdate() {
      // force removing pass
      this.__patch__(
        this._vnode,
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated() {
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
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
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
      hasMove: function hasMove(el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  }

  function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation(c) {
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
  }

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else if (
          "development" !== 'production' &&
          "development" !== 'test' &&
          isChrome
        ) {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if ("development" !== 'production' &&
        "development" !== 'test' &&
        config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  /*  */

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  });



  function parseText(
    text,
    delimiters
  ) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return
    }
    var tokens = [];
    var rawTokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, tokenValue;
    while ((match = tagRE.exec(text))) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      }
      // tag token
      var exp = parseFilters(match[1].trim());
      tokens.push(("_s(" + exp + ")"));
      rawTokens.push({ '@binding': exp });
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }
    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    }
  }

  /*  */

  function transformNode(el, options) {
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr(el, 'class');
    if ("development" !== 'production' && staticClass) {
      var res = parseText(staticClass, options.delimiters);
      if (res) {
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

  function genData(el) {
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
    genData: genData
  }

  /*  */

  function transformNode$1(el, options) {
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        var res = parseText(staticStyle, options.delimiters);
        if (res) {
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

  function genData$1(el) {
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
    genData: genData$1
  }

  /*  */

  var decoder;

  var he = {
    decode: function decode(html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent
    }
  }

  /*  */

  var isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track'
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
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
  // but for Vue templates we can enforce a simple charset
  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp(("^<" + qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
  var doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being pased as HTML comment when inlined in page
  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/;

  var IS_REGEX_CAPTURING_BROKEN = false;
  'x'.replace(/x(.)?/g, function (m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === '';
  });

  // Special Elements (can contain anything)
  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t'
  };
  var encodedAttr = /&(?:lt|gt|quot|amp);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

  // #5992
  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) { return decodingMap[match]; })
  }

  function parseHTML(html, options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    var index = 0;
    var last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd));
              }
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
            if (shouldIgnoreFirstNewline(lastTag, html)) {
              advance(1);
            }
            continue
          }
        }

        var text = (void 0), rest = (void 0), next = (void 0);
        if (textEnd >= 0) {
          rest = html.slice(textEnd);
          while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
          ) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) { break }
            textEnd += next;
            rest = html.slice(textEnd);
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
        var endTagLength = 0;
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
            text = text
              .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (shouldIgnoreFirstNewline(stackedTag, text)) {
            text = text.slice(1);
          }
          if (options.chars) {
            options.chars(text);
          }
          return ''
        });
        index += html.length - rest$1.length;
        html = rest$1;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if ("development" !== 'production' && !stack.length && options.warn) {
          options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
        }
        break
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
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

    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag$$1(tagName) || !!unarySlash;

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
        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag(tagName, start, end) {
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
          if ("development" !== 'production' &&
            (i > pos || !tagName) &&
            options.warn
          ) {
            options.warn(
              ("tag <" + (stack[i].tag) + "> has no matching end tag.")
            );
          }
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

  var onRE = /^@|^v-on:/;
  var dirRE = /^v-|^@|^:/;
  var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/;
  var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  var stripParensRE = /^\(|\)$/g;

  var argRE = /:(.*)$/;
  var bindRE = /^:|^v-bind:/;
  var modifierRE = /\.[^.]+/g;

  var decodeHTMLCached = cached(he.decode);

  // configurable state
  var warn$2;
  var delimiters;
  var transforms;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;



  function createASTElement(
    tag,
    attrs,
    parent
  ) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      parent: parent,
      children: []
    }
  }

  /**
   * Convert HTML string to AST.
   */
  function parse(
    template,
    options
  ) {
    warn$2 = options.warn || baseWarn;

    platformIsPreTag = options.isPreTag || no;
    platformMustUseProp = options.mustUseProp || no;
    platformGetTagNamespace = options.getTagNamespace || no;

    transforms = pluckModuleFunction(options.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace !== false;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function warnOnce(msg) {
      if (!warned) {
        warned = true;
        warn$2(msg);
      }
    }

    function closeElement(element) {
      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
      // apply post-transforms
      for (var i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options);
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
      shouldKeepComment: options.comments,
      start: function start(tag, attrs, unary) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        var element = createASTElement(tag, attrs, currentParent);
        if (ns) {
          element.ns = ns;
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          "development" !== 'production' && warn$2(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            "<" + tag + ">" + ', as they will not be parsed.'
          );
        }

        // apply pre-transforms
        for (var i = 0; i < preTransforms.length; i++) {
          element = preTransforms[i](element, options) || element;
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
        } else if (!element.processed) {
          // structural directives
          processFor(element);
          processIf(element);
          processOnce(element);
          // element-scope stuff
          processElement(element, options);
        }

        function checkRootConstraints(el) {
          {
            if (el.tag === 'slot' || el.tag === 'template') {
              warnOnce(
                "Cannot use <" + (el.tag) + "> as component root element because it may " +
                'contain multiple nodes.'
              );
            }
            if (el.attrsMap.hasOwnProperty('v-for')) {
              warnOnce(
                'Cannot use v-for on stateful component root element because ' +
                'it renders multiple elements.'
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
          } else {
            warnOnce(
              "Component template should contain exactly one root element. " +
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
            var name = element.slotTarget || '"default"'; (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          } else {
            currentParent.children.push(element);
            element.parent = currentParent;
          }
        }
        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },

      end: function end() {
        // remove trailing whitespace
        var element = stack[stack.length - 1];
        var lastNode = element.children[element.children.length - 1];
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
          element.children.pop();
        }
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        closeElement(element);
      },

      chars: function chars(text) {
        if (!currentParent) {
          {
            if (text === template) {
              warnOnce(
                'Component template requires a root element, rather than just text.'
              );
            } else if ((text = text.trim())) {
              warnOnce(
                ("text \"" + text + "\" outside root element will be ignored.")
              );
            }
          }
          return
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text
        ) {
          return
        }
        var children = currentParent.children;
        text = inPre || text.trim()
          ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
          // only preserve whitespace if its not right after a starting tag
          : preserveWhitespace && children.length ? ' ' : '';
        if (text) {
          var res;
          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
            children.push({
              type: 2,
              expression: res.expression,
              tokens: res.tokens,
              text: text
            });
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            children.push({
              type: 3,
              text: text
            });
          }
        }
      },
      comment: function comment(text) {
        currentParent.children.push({
          type: 3,
          text: text,
          isComment: true
        });
      }
    });
    return root
  }

  function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs(el) {
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

  function processElement(element, options) {
    processKey(element);

    // determine whether this is a plain element after
    // removing structural attributes
    element.plain = !element.key && !element.attrsList.length;

    processRef(element);
    processSlot(element);
    processComponent(element);
    for (var i = 0; i < transforms.length; i++) {
      element = transforms[i](element, options) || element;
    }
    processAttrs(element);
  }

  function processKey(el) {
    var exp = getBindingAttr(el, 'key');
    if (exp) {
      if ("development" !== 'production' && el.tag === 'template') {
        warn$2("<template> cannot be keyed. Place the key on real elements instead.");
      }
      el.key = exp;
    }
  }

  function processRef(el) {
    var ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor(el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp)
        );
      }
    }
  }



  function parseFor(exp) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) { return }
    var res = {};
    res.for = inMatch[2].trim();
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '');
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    return res
  }

  function processIf(el) {
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

  function processIfConditions(el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2(
        "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
        "used on element <" + (el.tag) + "> without corresponding v-if."
      );
    }
  }

  function findPrevElement(children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i]
      } else {
        if ("development" !== 'production' && children[i].text !== ' ') {
          warn$2(
            "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
            "will be ignored."
          );
        }
        children.pop();
      }
    }
  }

  function addIfCondition(el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce(el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  function processSlot(el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if ("development" !== 'production' && el.key) {
        warn$2(
          "`key` does not work on <slot> because slots are abstract outlets " +
          "and can possibly expand into multiple elements. " +
          "Use the key on a wrapping element instead."
        );
      }
    } else {
      var slotScope;
      if (el.tag === 'template') {
        slotScope = getAndRemoveAttr(el, 'scope');
        /* istanbul ignore if */
        if ("development" !== 'production' && slotScope) {
          warn$2(
            "the \"scope\" attribute for scoped slots have been deprecated and " +
            "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
            "can also be used on plain elements in addition to <template> to " +
            "denote scoped slots.",
            true
          );
        }
        el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
      } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
        /* istanbul ignore if */
        if ("development" !== 'production' && el.attrsMap['v-for']) {
          warn$2(
            "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
            "(v-for takes higher priority). Use a wrapper <template> for the " +
            "scoped slot to make it clearer.",
            true
          );
        }
        el.slotScope = slotScope;
      }
      var slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
        // preserve slot as an attribute for native shadow DOM compat
        // only for non-scoped slots.
        if (el.tag !== 'template' && !el.slotScope) {
          addAttr(el, 'slot', slotTarget);
        }
      }
    }
  }

  function processComponent(el) {
    var binding;
    if ((binding = getBindingAttr(el, 'is'))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs(el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, modifiers, isProp;
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
            if (modifiers.sync) {
              addHandler(
                el,
                ("update:" + (camelize(name))),
                genAssignmentCode(value, "$event")
              );
            }
          }
          if (isProp || (
            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
          )) {
            addProp(el, name, value);
          } else {
            addAttr(el, name, value);
          }
        } else if (onRE.test(name)) { // v-on
          name = name.replace(onRE, '');
          addHandler(el, name, value, modifiers, false, warn$2);
        } else { // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          var arg = argMatch && argMatch[1];
          if (arg) {
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
          var res = parseText(value, delimiters);
          if (res) {
            warn$2(
              name + "=\"" + value + "\": " +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div id="{{ val }}">, use <div :id="val">.'
            );
          }
        }
        addAttr(el, name, JSON.stringify(value));
        // #6887 firefox doesn't update muted state if set via attribute
        // even immediately after element creation
        if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, 'true');
        }
      }
    }
  }

  function checkInFor(el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true
      }
      parent = parent.parent;
    }
    return false
  }

  function parseModifiers(name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) { ret[m.slice(1)] = true; });
      return ret
    }
  }

  function makeAttrsMap(attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if (
        "development" !== 'production' &&
        map[attrs[i].name] && !isIE && !isEdge
      ) {
        warn$2('duplicate attribute: ' + attrs[i].name);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag(el) {
    return el.tag === 'script' || el.tag === 'style'
  }

  function isForbiddenTag(el) {
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
  function guardIESVGBug(attrs) {
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

  function checkForAliasModel(el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2(
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

  /**
   * Expand input[v-model] with dyanmic type bindings into v-if-else chains
   * Turn this:
   *   <input v-model="data[type]" :type="type">
   * into this:
   *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
   *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
   *   <input v-else :type="type" v-model="data[type]">
   */

  function preTransformNode(el, options) {
    if (el.tag === 'input') {
      var map = el.attrsMap;
      if (!map['v-model']) {
        return
      }

      var typeBinding;
      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }
      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = "(" + (map['v-bind']) + ").type";
      }

      if (typeBinding) {
        var ifCondition = getAndRemoveAttr(el, 'v-if', true);
        var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
        var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
        var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
        // 1. checkbox
        var branch0 = cloneASTElement(el);
        // process for on the main node
        processFor(branch0);
        addRawAttr(branch0, 'type', 'checkbox');
        processElement(branch0, options);
        branch0.processed = true; // prevent it from double-processed
        branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
        addIfCondition(branch0, {
          exp: branch0.if,
          block: branch0
        });
        // 2. add radio else-if condition
        var branch1 = cloneASTElement(el);
        getAndRemoveAttr(branch1, 'v-for', true);
        addRawAttr(branch1, 'type', 'radio');
        processElement(branch1, options);
        addIfCondition(branch0, {
          exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
          block: branch1
        });
        // 3. other
        var branch2 = cloneASTElement(el);
        getAndRemoveAttr(branch2, 'v-for', true);
        addRawAttr(branch2, ':type', typeBinding);
        processElement(branch2, options);
        addIfCondition(branch0, {
          exp: ifCondition,
          block: branch2
        });

        if (hasElse) {
          branch0.else = true;
        } else if (elseIfCondition) {
          branch0.elseif = elseIfCondition;
        }

        return branch0
      }
    }
  }

  function cloneASTElement(el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }

  var model$2 = {
    preTransformNode: preTransformNode
  }

  var modules$1 = [
    klass$1,
    style$1,
    model$2
  ]

  /*  */

  function text(el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
    }
  }

  /*  */

  function html(el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  }

  /*  */

  var baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

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
  function optimize(root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1(keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
      (keys ? ',' + keys : '')
    )
  }

  function markStatic$1(node) {
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
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots(node, isInFor) {
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
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          markStaticRoots(node.ifConditions[i$1].block, isInFor);
        }
      }
    }
  }

  function isStatic(node) {
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

  function isDirectChildOfTemplateFor(node) {
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

  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

  // KeyboardEvent.keyCode aliases
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

  // KeyboardEvent.key aliases
  var keyNames = {
    esc: 'Escape',
    tab: 'Tab',
    enter: 'Enter',
    space: ' ',
    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    'delete': ['Backspace', 'Delete']
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers(
    events,
    isNative,
    warn
  ) {
    var res = isNative ? 'nativeOn:{' : 'on:{';
    for (var name in events) {
      res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
    }
    return res.slice(0, -1) + '}'
  }

  function genHandler(
    name,
    handler
  ) {
    if (!handler) {
      return 'function(){}'
    }

    if (Array.isArray(handler)) {
      return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);

    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) {
        return handler.value
      }
      /* istanbul ignore if */
      return ("function($event){" + (handler.value) + "}") // inline statement
    } else {
      var code = '';
      var genModifierCode = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else if (key === 'exact') {
          var modifiers = (handler.modifiers);
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(function (keyModifier) { return !modifiers[keyModifier]; })
              .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
              .join('||')
          );
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      var handlerCode = isMethodPath
        ? ("return " + (handler.value) + "($event)")
        : isFunctionExpression
          ? ("return (" + (handler.value) + ")($event)")
          : handler.value;
      /* istanbul ignore if */
      return ("function($event){" + code + handlerCode + "}")
    }
  }

  function genKeyFilter(keys) {
    return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
  }

  function genFilterCode(key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return ("$event.keyCode!==" + keyVal)
    }
    var keyCode = keyCodes[key];
    var keyName = keyNames[key];
    return (
      "_k($event.keyCode," +
      (JSON.stringify(key)) + "," +
      (JSON.stringify(keyCode)) + "," +
      "$event.key," +
      "" + (JSON.stringify(keyName)) +
      ")"
    )
  }

  /*  */

  function on(el, dir) {
    if ("development" !== 'production' && dir.modifiers) {
      warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
  }

  /*  */

  function bind$1(el, dir) {
    el.wrapData = function (code) {
      return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
    };
  }

  /*  */

  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  }

  /*  */

  var CodegenState = function CodegenState(options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;
    this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
    this.onceId = 0;
    this.staticRenderFns = [];
  };



  function generate(
    ast,
    options
  ) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: ("with(this){return " + code + "}"),
      staticRenderFns: state.staticRenderFns
    }
  }

  function genElement(el, state) {
    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data = el.plain ? undefined : genData$2(el, state);

        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
      }
      // module transforms
      for (var i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code
    }
  }

  // hoist static sub-trees out
  function genStatic(el, state) {
    el.staticProcessed = true;
    state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
    return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
  }

  // v-once
  function genOnce(el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
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
        "development" !== 'production' && state.warn(
          "v-once can only be used inside v-for that is keyed. "
        );
        return genElement(el, state)
      }
      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
    } else {
      return genStatic(el, state)
    }
  }

  function genIf(
    el,
    state,
    altGen,
    altEmpty
  ) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }

  function genIfConditions(
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
    } else {
      return ("" + (genTernaryExp(condition.block)))
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }

  function genFor(
    el,
    state,
    altGen,
    altHelper
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

    if ("development" !== 'production' &&
      state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return (altHelper || '_l') + "((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
      '})'
  }

  function genData$2(el, state) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el, state);
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
    for (var i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
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
      data += (genHandlers(el.events, false, state.warn)) + ",";
    }
    if (el.nativeEvents) {
      data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
    }
    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
      data += "slot:" + (el.slotTarget) + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += (genScopedSlots(el.scopedSlots, state)) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data
  }

  function genDirectives(el, state) {
    var dirs = el.directives;
    if (!dirs) { return }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
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

  function genInlineTemplate(el, state) {
    var ast = el.children[0];
    if ("development" !== 'production' && (
      el.children.length !== 1 || ast.type !== 1
    )) {
      state.warn('Inline-template components must have exactly one child element.');
    }
    if (ast.type === 1) {
      var inlineRenderFns = generate(ast, state.options);
      return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
    }
  }

  function genScopedSlots(
    slots,
    state
  ) {
    return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
  }

  function genScopedSlot(
    key,
    el,
    state
  ) {
    if (el.for && !el.forProcessed) {
      return genForScopedSlot(key, el, state)
    }
    var fn = "function(" + (String(el.slotScope)) + "){" +
      "return " + (el.tag === 'template'
        ? el.if
          ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
          : genChildren(el, state) || 'undefined'
        : genElement(el, state)) + "}";
    return ("{key:" + key + ",fn:" + fn + "}")
  }

  function genForScopedSlot(
    key,
    el,
    state
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
    el.forProcessed = true; // avoid recursion
    return "_l((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
      '})'
  }

  function genChildren(
    el,
    state,
    checkSkip,
    altGenElement,
    altGenNode
  ) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot'
      ) {
        return (altGenElement || genElement)(el$1, state)
      }
      var normalizationType = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0;
      var gen = altGenNode || genNode;
      return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(
    children,
    maybeComponent
  ) {
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

  function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }

  function genNode(node, state) {
    if (node.type === 1) {
      return genElement(node, state)
    } if (node.type === 3 && node.isComment) {
      return genComment(node)
    } else {
      return genText(node)
    }
  }

  function genText(text) {
    return ("_v(" + (text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
  }

  function genComment(comment) {
    return ("_e(" + (JSON.stringify(comment.text)) + ")")
  }

  function genSlot(el, state) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el, state);
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
  function genComponent(
    componentName,
    el,
    state
  ) {
    var children = el.inlineTemplate ? null : genChildren(el, state, true);
    return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
  }

  function genProps(props) {
    var res = '';
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      /* istanbul ignore if */
      {
        res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
      }
    }
    return res.slice(0, -1)
  }

  // #3895, #4268
  function transformSpecialNewlines(text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }

  /*  */

  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + (
    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    'super,throw,while,yield,delete,export,import,return,switch,default,' +
    'extends,finally,continue,debugger,function,arguments'
  ).split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + (
    'delete,typeof,void'
  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors(ast) {
    var errors = [];
    if (ast) {
      checkNode(ast, errors);
    }
    return errors
  }

  function checkNode(node, errors) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            if (name === 'v-for') {
              checkFor(node, ("v-for=\"" + value + "\""), errors);
            } else if (onRE.test(name)) {
              checkEvent(value, (name + "=\"" + value + "\""), errors);
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

  function checkEvent(exp, text, errors) {
    var stipped = exp.replace(stripStringRE, '');
    var keywordMatch = stipped.match(unaryOperatorsRE);
    if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
      errors.push(
        "avoid using JavaScript unary operator as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    }
    checkExpression(exp, text, errors);
  }

  function checkFor(node, text, errors) {
    checkExpression(node.for || '', text, errors);
    checkIdentifier(node.alias, 'v-for alias', text, errors);
    checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
    checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
  }

  function checkIdentifier(
    ident,
    type,
    text,
    errors
  ) {
    if (typeof ident === 'string') {
      try {
        new Function(("var " + ident + "=_"));
      } catch (e) {
        errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
      }
    }
  }

  function checkExpression(exp, text, errors) {
    try {
      new Function(("return " + exp));
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        errors.push(
          "avoid using JavaScript keyword as property name: " +
          "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
        );
      } else {
        errors.push(
          "invalid expression: " + (e.message) + " in\n\n" +
          "    " + exp + "\n\n" +
          "  Raw expression: " + (text.trim()) + "\n"
        );
      }
    }
  }

  /*  */

  function createFunction(code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err: err, code: code });
      return noop
    }
  }

  function createCompileToFunctionFn(compile) {
    var cache = Object.create(null);

    return function compileToFunctions(
      template,
      options,
      vm
    ) {
      options = extend({}, options);
      var warn$$1 = options.warn || warn;
      delete options.warn;

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache
      var key = options.delimiters
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) {
        return cache[key]
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          warn$$1(
            "Error compiling template:\n\n" + template + "\n\n" +
            compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
            vm
          );
        }
        if (compiled.tips && compiled.tips.length) {
          compiled.tips.forEach(function (msg) { return tip(msg, vm); });
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn$$1(
            "Failed to generate render function:\n\n" +
            fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return ((err.toString()) + " in\n\n" + code + "\n");
            }).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res)
    }
  }

  /*  */

  function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions) {
      function compile(
        template,
        options
      ) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];
        finalOptions.warn = function (msg, tip) {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          // merge custom modules
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        var compiled = baseCompile(template, finalOptions);
        {
          errors.push.apply(errors, detectErrors(compiled.ast));
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled
      }

      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }

  /*  */

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  var createCompiler = createCompilerCreator(function baseCompile(
    template,
    options
  ) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });

  /*  */

  var ref$1 = createCompiler(baseOptions);
  var compileToFunctions = ref$1.compileToFunctions;

  /*  */

  // check whether current browser encodes a char inside attribute values
  var div;
  function getShouldDecode(href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
    return div.innerHTML.indexOf('&#10;') > 0
  }

  // #3663: IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML
  });

  var mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function (
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
        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          mark('compile');
        }

        var ref = compileToFunctions(template, {
          shouldDecodeNewlines: shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        }, this);
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          mark('compile end');
          measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating)
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML
    }
  }

  Vue.compile = compileToFunctions;

  return Vue;

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidmVuZG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIFZ1ZS5qcyB2Mi41LjE2XHJcbiAqIChjKSAyMDE0LTIwMTggRXZhbiBZb3VcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4gKi9cclxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcclxuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XHJcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG4gICAgICAoZ2xvYmFsLlZ1ZSA9IGZhY3RvcnkoKSk7XHJcbn0odGhpcywgKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgZW1wdHlPYmplY3QgPSBPYmplY3QuZnJlZXplKHt9KTtcclxuXHJcbiAgLy8gdGhlc2UgaGVscGVycyBwcm9kdWNlcyBiZXR0ZXIgdm0gY29kZSBpbiBKUyBlbmdpbmVzIGR1ZSB0byB0aGVpclxyXG4gIC8vIGV4cGxpY2l0bmVzcyBhbmQgZnVuY3Rpb24gaW5saW5pbmdcclxuICBmdW5jdGlvbiBpc1VuZGVmKHYpIHtcclxuICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNEZWYodikge1xyXG4gICAgcmV0dXJuIHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9PSBudWxsXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1RydWUodikge1xyXG4gICAgcmV0dXJuIHYgPT09IHRydWVcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzRmFsc2Uodikge1xyXG4gICAgcmV0dXJuIHYgPT09IGZhbHNlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiB2YWx1ZSBpcyBwcmltaXRpdmVcclxuICAgKi9cclxuICBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fFxyXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8XHJcbiAgICAgIC8vICRmbG93LWRpc2FibGUtbGluZVxyXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8XHJcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBRdWljayBvYmplY3QgY2hlY2sgLSB0aGlzIGlzIHByaW1hcmlseSB1c2VkIHRvIHRlbGxcclxuICAgKiBPYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcyB3aGVuIHdlIGtub3cgdGhlIHZhbHVlXHJcbiAgICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG4gICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSByYXcgdHlwZSBzdHJpbmcgb2YgYSB2YWx1ZSBlLmcuIFtvYmplY3QgT2JqZWN0XVxyXG4gICAqL1xyXG4gIHZhciBfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xyXG5cclxuICBmdW5jdGlvbiB0b1Jhd1R5cGUodmFsdWUpIHtcclxuICAgIHJldHVybiBfdG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdHJpY3Qgb2JqZWN0IHR5cGUgY2hlY2suIE9ubHkgcmV0dXJucyB0cnVlXHJcbiAgICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xyXG4gICAgcmV0dXJuIF90b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1JlZ0V4cCh2KSB7XHJcbiAgICByZXR1cm4gX3RvU3RyaW5nLmNhbGwodikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiB2YWwgaXMgYSB2YWxpZCBhcnJheSBpbmRleC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBpc1ZhbGlkQXJyYXlJbmRleCh2YWwpIHtcclxuICAgIHZhciBuID0gcGFyc2VGbG9hdChTdHJpbmcodmFsKSk7XHJcbiAgICByZXR1cm4gbiA+PSAwICYmIE1hdGguZmxvb3IobikgPT09IG4gJiYgaXNGaW5pdGUodmFsKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCBhIHZhbHVlIHRvIGEgc3RyaW5nIHRoYXQgaXMgYWN0dWFsbHkgcmVuZGVyZWQuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdG9TdHJpbmcodmFsKSB7XHJcbiAgICByZXR1cm4gdmFsID09IG51bGxcclxuICAgICAgPyAnJ1xyXG4gICAgICA6IHR5cGVvZiB2YWwgPT09ICdvYmplY3QnXHJcbiAgICAgICAgPyBKU09OLnN0cmluZ2lmeSh2YWwsIG51bGwsIDIpXHJcbiAgICAgICAgOiBTdHJpbmcodmFsKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCBhIGlucHV0IHZhbHVlIHRvIGEgbnVtYmVyIGZvciBwZXJzaXN0ZW5jZS5cclxuICAgKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgcmV0dXJuIG9yaWdpbmFsIHN0cmluZy5cclxuICAgKi9cclxuICBmdW5jdGlvbiB0b051bWJlcih2YWwpIHtcclxuICAgIHZhciBuID0gcGFyc2VGbG9hdCh2YWwpO1xyXG4gICAgcmV0dXJuIGlzTmFOKG4pID8gdmFsIDogblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIG1hcCBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEga2V5XHJcbiAgICogaXMgaW4gdGhhdCBtYXAuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWFrZU1hcChcclxuICAgIHN0cixcclxuICAgIGV4cGVjdHNMb3dlckNhc2VcclxuICApIHtcclxuICAgIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgdmFyIGxpc3QgPSBzdHIuc3BsaXQoJywnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtYXBbbGlzdFtpXV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2VcclxuICAgICAgPyBmdW5jdGlvbiAodmFsKSB7IHJldHVybiBtYXBbdmFsLnRvTG93ZXJDYXNlKCldOyB9XHJcbiAgICAgIDogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbF07IH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgdGFnIGlzIGEgYnVpbHQtaW4gdGFnLlxyXG4gICAqL1xyXG4gIHZhciBpc0J1aWx0SW5UYWcgPSBtYWtlTWFwKCdzbG90LGNvbXBvbmVudCcsIHRydWUpO1xyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIGF0dHJpYnV0ZSBpcyBhIHJlc2VydmVkIGF0dHJpYnV0ZS5cclxuICAgKi9cclxuICB2YXIgaXNSZXNlcnZlZEF0dHJpYnV0ZSA9IG1ha2VNYXAoJ2tleSxyZWYsc2xvdCxzbG90LXNjb3BlLGlzJyk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBhbiBpdGVtIGZyb20gYW4gYXJyYXlcclxuICAgKi9cclxuICBmdW5jdGlvbiByZW1vdmUoYXJyLCBpdGVtKSB7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCkge1xyXG4gICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcclxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICByZXR1cm4gYXJyLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgb2JqZWN0IGhhcyB0aGUgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcclxuICBmdW5jdGlvbiBoYXNPd24ob2JqLCBrZXkpIHtcclxuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgY2FjaGVkIHZlcnNpb24gb2YgYSBwdXJlIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhY2hlZChmbikge1xyXG4gICAgdmFyIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHJldHVybiAoZnVuY3Rpb24gY2FjaGVkRm4oc3RyKSB7XHJcbiAgICAgIHZhciBoaXQgPSBjYWNoZVtzdHJdO1xyXG4gICAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW1lbGl6ZSBhIGh5cGhlbi1kZWxpbWl0ZWQgc3RyaW5nLlxyXG4gICAqL1xyXG4gIHZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xyXG4gIHZhciBjYW1lbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgZnVuY3Rpb24gKF8sIGMpIHsgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlKCkgOiAnJzsgfSlcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FwaXRhbGl6ZSBhIHN0cmluZy5cclxuICAgKi9cclxuICB2YXIgY2FwaXRhbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXHJcbiAgfSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEh5cGhlbmF0ZSBhIGNhbWVsQ2FzZSBzdHJpbmcuXHJcbiAgICovXHJcbiAgdmFyIGh5cGhlbmF0ZVJFID0gL1xcQihbQS1aXSkvZztcclxuICB2YXIgaHlwaGVuYXRlID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZShoeXBoZW5hdGVSRSwgJy0kMScpLnRvTG93ZXJDYXNlKClcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2ltcGxlIGJpbmQgcG9seWZpbGwgZm9yIGVudmlyb25tZW50cyB0aGF0IGRvIG5vdCBzdXBwb3J0IGl0Li4uIGUuZy5cclxuICAgKiBQaGFudG9tSlMgMS54LiBUZWNobmljYWxseSB3ZSBkb24ndCBuZWVkIHRoaXMgYW55bW9yZSBzaW5jZSBuYXRpdmUgYmluZCBpc1xyXG4gICAqIG5vdyBtb3JlIHBlcmZvcm1hbnQgaW4gbW9zdCBicm93c2VycywgYnV0IHJlbW92aW5nIGl0IHdvdWxkIGJlIGJyZWFraW5nIGZvclxyXG4gICAqIGNvZGUgdGhhdCB3YXMgYWJsZSB0byBydW4gaW4gUGhhbnRvbUpTIDEueCwgc28gdGhpcyBtdXN0IGJlIGtlcHQgZm9yXHJcbiAgICogYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXHJcbiAgICovXHJcblxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgZnVuY3Rpb24gcG9seWZpbGxCaW5kKGZuLCBjdHgpIHtcclxuICAgIGZ1bmN0aW9uIGJvdW5kRm4oYSkge1xyXG4gICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgIHJldHVybiBsXHJcbiAgICAgICAgPyBsID4gMVxyXG4gICAgICAgICAgPyBmbi5hcHBseShjdHgsIGFyZ3VtZW50cylcclxuICAgICAgICAgIDogZm4uY2FsbChjdHgsIGEpXHJcbiAgICAgICAgOiBmbi5jYWxsKGN0eClcclxuICAgIH1cclxuXHJcbiAgICBib3VuZEZuLl9sZW5ndGggPSBmbi5sZW5ndGg7XHJcbiAgICByZXR1cm4gYm91bmRGblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbmF0aXZlQmluZChmbiwgY3R4KSB7XHJcbiAgICByZXR1cm4gZm4uYmluZChjdHgpXHJcbiAgfVxyXG5cclxuICB2YXIgYmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXHJcbiAgICA/IG5hdGl2ZUJpbmRcclxuICAgIDogcG9seWZpbGxCaW5kO1xyXG5cclxuICAvKipcclxuICAgKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cclxuICAgKi9cclxuICBmdW5jdGlvbiB0b0FycmF5KGxpc3QsIHN0YXJ0KSB7XHJcbiAgICBzdGFydCA9IHN0YXJ0IHx8IDA7XHJcbiAgICB2YXIgaSA9IGxpc3QubGVuZ3RoIC0gc3RhcnQ7XHJcbiAgICB2YXIgcmV0ID0gbmV3IEFycmF5KGkpO1xyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICByZXRbaV0gPSBsaXN0W2kgKyBzdGFydF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNaXggcHJvcGVydGllcyBpbnRvIHRhcmdldCBvYmplY3QuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZXh0ZW5kKHRvLCBfZnJvbSkge1xyXG4gICAgZm9yICh2YXIga2V5IGluIF9mcm9tKSB7XHJcbiAgICAgIHRvW2tleV0gPSBfZnJvbVtrZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNZXJnZSBhbiBBcnJheSBvZiBPYmplY3RzIGludG8gYSBzaW5nbGUgT2JqZWN0LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRvT2JqZWN0KGFycikge1xyXG4gICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGFycltpXSkge1xyXG4gICAgICAgIGV4dGVuZChyZXMsIGFycltpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gbm8gb3BlcmF0aW9uLlxyXG4gICAqIFN0dWJiaW5nIGFyZ3MgdG8gbWFrZSBGbG93IGhhcHB5IHdpdGhvdXQgbGVhdmluZyB1c2VsZXNzIHRyYW5zcGlsZWQgY29kZVxyXG4gICAqIHdpdGggLi4ucmVzdCAoaHR0cHM6Ly9mbG93Lm9yZy9ibG9nLzIwMTcvMDUvMDcvU3RyaWN0LUZ1bmN0aW9uLUNhbGwtQXJpdHkvKVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG5vb3AoYSwgYiwgYykgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsd2F5cyByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgdmFyIG5vID0gZnVuY3Rpb24gKGEsIGIsIGMpIHsgcmV0dXJuIGZhbHNlOyB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm4gc2FtZSB2YWx1ZVxyXG4gICAqL1xyXG4gIHZhciBpZGVudGl0eSA9IGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9O1xyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSBhIHN0YXRpYyBrZXlzIHN0cmluZyBmcm9tIGNvbXBpbGVyIG1vZHVsZXMuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2VuU3RhdGljS2V5cyhtb2R1bGVzKSB7XHJcbiAgICByZXR1cm4gbW9kdWxlcy5yZWR1Y2UoZnVuY3Rpb24gKGtleXMsIG0pIHtcclxuICAgICAgcmV0dXJuIGtleXMuY29uY2F0KG0uc3RhdGljS2V5cyB8fCBbXSlcclxuICAgIH0sIFtdKS5qb2luKCcsJylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIHR3byB2YWx1ZXMgYXJlIGxvb3NlbHkgZXF1YWwgLSB0aGF0IGlzLFxyXG4gICAqIGlmIHRoZXkgYXJlIHBsYWluIG9iamVjdHMsIGRvIHRoZXkgaGF2ZSB0aGUgc2FtZSBzaGFwZT9cclxuICAgKi9cclxuICBmdW5jdGlvbiBsb29zZUVxdWFsKGEsIGIpIHtcclxuICAgIGlmIChhID09PSBiKSB7IHJldHVybiB0cnVlIH1cclxuICAgIHZhciBpc09iamVjdEEgPSBpc09iamVjdChhKTtcclxuICAgIHZhciBpc09iamVjdEIgPSBpc09iamVjdChiKTtcclxuICAgIGlmIChpc09iamVjdEEgJiYgaXNPYmplY3RCKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGlzQXJyYXlBID0gQXJyYXkuaXNBcnJheShhKTtcclxuICAgICAgICB2YXIgaXNBcnJheUIgPSBBcnJheS5pc0FycmF5KGIpO1xyXG4gICAgICAgIGlmIChpc0FycmF5QSAmJiBpc0FycmF5Qikge1xyXG4gICAgICAgICAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KGZ1bmN0aW9uIChlLCBpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29zZUVxdWFsKGUsIGJbaV0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQXJyYXlBICYmICFpc0FycmF5Qikge1xyXG4gICAgICAgICAgdmFyIGtleXNBID0gT2JqZWN0LmtleXMoYSk7XHJcbiAgICAgICAgICB2YXIga2V5c0IgPSBPYmplY3Qua2V5cyhiKTtcclxuICAgICAgICAgIHJldHVybiBrZXlzQS5sZW5ndGggPT09IGtleXNCLmxlbmd0aCAmJiBrZXlzQS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29zZUVxdWFsKGFba2V5XSwgYltrZXldKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoIWlzT2JqZWN0QSAmJiAhaXNPYmplY3RCKSB7XHJcbiAgICAgIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsb29zZUluZGV4T2YoYXJyLCB2YWwpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChsb29zZUVxdWFsKGFycltpXSwgdmFsKSkgeyByZXR1cm4gaSB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTFcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuc3VyZSBhIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbmx5IG9uY2UuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gb25jZShmbikge1xyXG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCFjYWxsZWQpIHtcclxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xyXG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBTU1JfQVRUUiA9ICdkYXRhLXNlcnZlci1yZW5kZXJlZCc7XHJcblxyXG4gIHZhciBBU1NFVF9UWVBFUyA9IFtcclxuICAgICdjb21wb25lbnQnLFxyXG4gICAgJ2RpcmVjdGl2ZScsXHJcbiAgICAnZmlsdGVyJ1xyXG4gIF07XHJcblxyXG4gIHZhciBMSUZFQ1lDTEVfSE9PS1MgPSBbXHJcbiAgICAnYmVmb3JlQ3JlYXRlJyxcclxuICAgICdjcmVhdGVkJyxcclxuICAgICdiZWZvcmVNb3VudCcsXHJcbiAgICAnbW91bnRlZCcsXHJcbiAgICAnYmVmb3JlVXBkYXRlJyxcclxuICAgICd1cGRhdGVkJyxcclxuICAgICdiZWZvcmVEZXN0cm95JyxcclxuICAgICdkZXN0cm95ZWQnLFxyXG4gICAgJ2FjdGl2YXRlZCcsXHJcbiAgICAnZGVhY3RpdmF0ZWQnLFxyXG4gICAgJ2Vycm9yQ2FwdHVyZWQnXHJcbiAgXTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBjb25maWcgPSAoe1xyXG4gICAgLyoqXHJcbiAgICAgKiBPcHRpb24gbWVyZ2Ugc3RyYXRlZ2llcyAodXNlZCBpbiBjb3JlL3V0aWwvb3B0aW9ucylcclxuICAgICAqL1xyXG4gICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICBvcHRpb25NZXJnZVN0cmF0ZWdpZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHN1cHByZXNzIHdhcm5pbmdzLlxyXG4gICAgICovXHJcbiAgICBzaWxlbnQ6IGZhbHNlLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyBwcm9kdWN0aW9uIG1vZGUgdGlwIG1lc3NhZ2Ugb24gYm9vdD9cclxuICAgICAqL1xyXG4gICAgcHJvZHVjdGlvblRpcDogXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIGVuYWJsZSBkZXZ0b29sc1xyXG4gICAgICovXHJcbiAgICBkZXZ0b29sczogXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHJlY29yZCBwZXJmXHJcbiAgICAgKi9cclxuICAgIHBlcmZvcm1hbmNlOiBmYWxzZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVycm9yIGhhbmRsZXIgZm9yIHdhdGNoZXIgZXJyb3JzXHJcbiAgICAgKi9cclxuICAgIGVycm9ySGFuZGxlcjogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdhcm4gaGFuZGxlciBmb3Igd2F0Y2hlciB3YXJuc1xyXG4gICAgICovXHJcbiAgICB3YXJuSGFuZGxlcjogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIElnbm9yZSBjZXJ0YWluIGN1c3RvbSBlbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBpZ25vcmVkRWxlbWVudHM6IFtdLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VzdG9tIHVzZXIga2V5IGFsaWFzZXMgZm9yIHYtb25cclxuICAgICAqL1xyXG4gICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICBrZXlDb2RlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgdGFnIGlzIHJlc2VydmVkIHNvIHRoYXQgaXQgY2Fubm90IGJlIHJlZ2lzdGVyZWQgYXMgYVxyXG4gICAgICogY29tcG9uZW50LiBUaGlzIGlzIHBsYXRmb3JtLWRlcGVuZGVudCBhbmQgbWF5IGJlIG92ZXJ3cml0dGVuLlxyXG4gICAgICovXHJcbiAgICBpc1Jlc2VydmVkVGFnOiBubyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGFuIGF0dHJpYnV0ZSBpcyByZXNlcnZlZCBzbyB0aGF0IGl0IGNhbm5vdCBiZSB1c2VkIGFzIGEgY29tcG9uZW50XHJcbiAgICAgKiBwcm9wLiBUaGlzIGlzIHBsYXRmb3JtLWRlcGVuZGVudCBhbmQgbWF5IGJlIG92ZXJ3cml0dGVuLlxyXG4gICAgICovXHJcbiAgICBpc1Jlc2VydmVkQXR0cjogbm8sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIHRhZyBpcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgICAgKiBQbGF0Zm9ybS1kZXBlbmRlbnQuXHJcbiAgICAgKi9cclxuICAgIGlzVW5rbm93bkVsZW1lbnQ6IG5vLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBuYW1lc3BhY2Ugb2YgYW4gZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBnZXRUYWdOYW1lc3BhY2U6IG5vb3AsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZSB0aGUgcmVhbCB0YWcgbmFtZSBmb3IgdGhlIHNwZWNpZmljIHBsYXRmb3JtLlxyXG4gICAgICovXHJcbiAgICBwYXJzZVBsYXRmb3JtVGFnTmFtZTogaWRlbnRpdHksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgbXVzdCBiZSBib3VuZCB1c2luZyBwcm9wZXJ0eSwgZS5nLiB2YWx1ZVxyXG4gICAgICogUGxhdGZvcm0tZGVwZW5kZW50LlxyXG4gICAgICovXHJcbiAgICBtdXN0VXNlUHJvcDogbm8sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBvc2VkIGZvciBsZWdhY3kgcmVhc29uc1xyXG4gICAgICovXHJcbiAgICBfbGlmZWN5Y2xlSG9va3M6IExJRkVDWUNMRV9IT09LU1xyXG4gIH0pXHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cclxuICAgKi9cclxuICBmdW5jdGlvbiBpc1Jlc2VydmVkKHN0cikge1xyXG4gICAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMCk7XHJcbiAgICByZXR1cm4gYyA9PT0gMHgyNCB8fCBjID09PSAweDVGXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgYSBwcm9wZXJ0eS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBkZWYob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgIGVudW1lcmFibGU6ICEhZW51bWVyYWJsZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJzZSBzaW1wbGUgcGF0aC5cclxuICAgKi9cclxuICB2YXIgYmFpbFJFID0gL1teXFx3LiRdLztcclxuICBmdW5jdGlvbiBwYXJzZVBhdGgocGF0aCkge1xyXG4gICAgaWYgKGJhaWxSRS50ZXN0KHBhdGgpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLicpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICghb2JqKSB7IHJldHVybiB9XHJcbiAgICAgICAgb2JqID0gb2JqW3NlZ21lbnRzW2ldXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLy8gY2FuIHdlIHVzZSBfX3Byb3RvX18/XHJcbiAgdmFyIGhhc1Byb3RvID0gJ19fcHJvdG9fXycgaW4ge307XHJcblxyXG4gIC8vIEJyb3dzZXIgZW52aXJvbm1lbnQgc25pZmZpbmdcclxuICB2YXIgaW5Ccm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgdmFyIGluV2VleCA9IHR5cGVvZiBXWEVudmlyb25tZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhIVdYRW52aXJvbm1lbnQucGxhdGZvcm07XHJcbiAgdmFyIHdlZXhQbGF0Zm9ybSA9IGluV2VleCAmJiBXWEVudmlyb25tZW50LnBsYXRmb3JtLnRvTG93ZXJDYXNlKCk7XHJcbiAgdmFyIFVBID0gaW5Ccm93c2VyICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgdmFyIGlzSUUgPSBVQSAmJiAvbXNpZXx0cmlkZW50Ly50ZXN0KFVBKTtcclxuICB2YXIgaXNJRTkgPSBVQSAmJiBVQS5pbmRleE9mKCdtc2llIDkuMCcpID4gMDtcclxuICB2YXIgaXNFZGdlID0gVUEgJiYgVUEuaW5kZXhPZignZWRnZS8nKSA+IDA7XHJcbiAgdmFyIGlzQW5kcm9pZCA9IChVQSAmJiBVQS5pbmRleE9mKCdhbmRyb2lkJykgPiAwKSB8fCAod2VleFBsYXRmb3JtID09PSAnYW5kcm9pZCcpO1xyXG4gIHZhciBpc0lPUyA9IChVQSAmJiAvaXBob25lfGlwYWR8aXBvZHxpb3MvLnRlc3QoVUEpKSB8fCAod2VleFBsYXRmb3JtID09PSAnaW9zJyk7XHJcbiAgdmFyIGlzQ2hyb21lID0gVUEgJiYgL2Nocm9tZVxcL1xcZCsvLnRlc3QoVUEpICYmICFpc0VkZ2U7XHJcblxyXG4gIC8vIEZpcmVmb3ggaGFzIGEgXCJ3YXRjaFwiIGZ1bmN0aW9uIG9uIE9iamVjdC5wcm90b3R5cGUuLi5cclxuICB2YXIgbmF0aXZlV2F0Y2ggPSAoe30pLndhdGNoO1xyXG5cclxuICB2YXIgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XHJcbiAgaWYgKGluQnJvd3Nlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIG9wdHMgPSB7fTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9wdHMsICdwYXNzaXZlJywgKHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9pc3N1ZXMvMjg1XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0LXBhc3NpdmUnLCBudWxsLCBvcHRzKTtcclxuICAgIH0gY2F0Y2ggKGUpIHsgfVxyXG4gIH1cclxuXHJcbiAgLy8gdGhpcyBuZWVkcyB0byBiZSBsYXp5LWV2YWxlZCBiZWNhdXNlIHZ1ZSBtYXkgYmUgcmVxdWlyZWQgYmVmb3JlXHJcbiAgLy8gdnVlLXNlcnZlci1yZW5kZXJlciBjYW4gc2V0IFZVRV9FTlZcclxuICB2YXIgX2lzU2VydmVyO1xyXG4gIHZhciBpc1NlcnZlclJlbmRlcmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChfaXNTZXJ2ZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKCFpbkJyb3dzZXIgJiYgIWluV2VleCAmJiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIGRldGVjdCBwcmVzZW5jZSBvZiB2dWUtc2VydmVyLXJlbmRlcmVyIGFuZCBhdm9pZFxyXG4gICAgICAgIC8vIFdlYnBhY2sgc2hpbW1pbmcgdGhlIHByb2Nlc3NcclxuICAgICAgICBfaXNTZXJ2ZXIgPSBnbG9iYWxbJ3Byb2Nlc3MnXS5lbnYuVlVFX0VOViA9PT0gJ3NlcnZlcic7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgX2lzU2VydmVyID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBfaXNTZXJ2ZXJcclxuICB9O1xyXG5cclxuICAvLyBkZXRlY3QgZGV2dG9vbHNcclxuICB2YXIgZGV2dG9vbHMgPSBpbkJyb3dzZXIgJiYgd2luZG93Ll9fVlVFX0RFVlRPT0xTX0dMT0JBTF9IT09LX187XHJcblxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgZnVuY3Rpb24gaXNOYXRpdmUoQ3Rvcikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBDdG9yID09PSAnZnVuY3Rpb24nICYmIC9uYXRpdmUgY29kZS8udGVzdChDdG9yLnRvU3RyaW5nKCkpXHJcbiAgfVxyXG5cclxuICB2YXIgaGFzU3ltYm9sID1cclxuICAgIHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFN5bWJvbCkgJiZcclxuICAgIHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShSZWZsZWN0Lm93bktleXMpO1xyXG5cclxuICB2YXIgX1NldDtcclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi8gLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgaWYgKHR5cGVvZiBTZXQgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFNldCkpIHtcclxuICAgIC8vIHVzZSBuYXRpdmUgU2V0IHdoZW4gYXZhaWxhYmxlLlxyXG4gICAgX1NldCA9IFNldDtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYSBub24tc3RhbmRhcmQgU2V0IHBvbHlmaWxsIHRoYXQgb25seSB3b3JrcyB3aXRoIHByaW1pdGl2ZSBrZXlzLlxyXG4gICAgX1NldCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZ1bmN0aW9uIFNldCgpIHtcclxuICAgICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0W2tleV0gPT09IHRydWVcclxuICAgICAgfTtcclxuICAgICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoa2V5KSB7XHJcbiAgICAgICAgdGhpcy5zZXRba2V5XSA9IHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gU2V0O1xyXG4gICAgfSgpKTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgd2FybiA9IG5vb3A7XHJcbiAgdmFyIHRpcCA9IG5vb3A7XHJcbiAgdmFyIGdlbmVyYXRlQ29tcG9uZW50VHJhY2UgPSAobm9vcCk7IC8vIHdvcmsgYXJvdW5kIGZsb3cgY2hlY2tcclxuICB2YXIgZm9ybWF0Q29tcG9uZW50TmFtZSA9IChub29wKTtcclxuXHJcbiAge1xyXG4gICAgdmFyIGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICB2YXIgY2xhc3NpZnlSRSA9IC8oPzpefFstX10pKFxcdykvZztcclxuICAgIHZhciBjbGFzc2lmeSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgcmV0dXJuIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKGNsYXNzaWZ5UkUsIGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgLnJlcGxhY2UoL1stX10vZywgJycpO1xyXG4gICAgfTtcclxuXHJcbiAgICB3YXJuID0gZnVuY3Rpb24gKG1zZywgdm0pIHtcclxuICAgICAgdmFyIHRyYWNlID0gdm0gPyBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlKHZtKSA6ICcnO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZy53YXJuSGFuZGxlcikge1xyXG4gICAgICAgIGNvbmZpZy53YXJuSGFuZGxlci5jYWxsKG51bGwsIG1zZywgdm0sIHRyYWNlKTtcclxuICAgICAgfSBlbHNlIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCkpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKChcIltWdWUgd2Fybl06IFwiICsgbXNnICsgdHJhY2UpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aXAgPSBmdW5jdGlvbiAobXNnLCB2bSkge1xyXG4gICAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQpKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiW1Z1ZSB0aXBdOiBcIiArIG1zZyArIChcclxuICAgICAgICAgIHZtID8gZ2VuZXJhdGVDb21wb25lbnRUcmFjZSh2bSkgOiAnJ1xyXG4gICAgICAgICkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZvcm1hdENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAodm0sIGluY2x1ZGVGaWxlKSB7XHJcbiAgICAgIGlmICh2bS4kcm9vdCA9PT0gdm0pIHtcclxuICAgICAgICByZXR1cm4gJzxSb290PidcclxuICAgICAgfVxyXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiB2bSA9PT0gJ2Z1bmN0aW9uJyAmJiB2bS5jaWQgIT0gbnVsbFxyXG4gICAgICAgID8gdm0ub3B0aW9uc1xyXG4gICAgICAgIDogdm0uX2lzVnVlXHJcbiAgICAgICAgICA/IHZtLiRvcHRpb25zIHx8IHZtLmNvbnN0cnVjdG9yLm9wdGlvbnNcclxuICAgICAgICAgIDogdm0gfHwge307XHJcbiAgICAgIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IG9wdGlvbnMuX2NvbXBvbmVudFRhZztcclxuICAgICAgdmFyIGZpbGUgPSBvcHRpb25zLl9fZmlsZTtcclxuICAgICAgaWYgKCFuYW1lICYmIGZpbGUpIHtcclxuICAgICAgICB2YXIgbWF0Y2ggPSBmaWxlLm1hdGNoKC8oW14vXFxcXF0rKVxcLnZ1ZSQvKTtcclxuICAgICAgICBuYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgKG5hbWUgPyAoXCI8XCIgKyAoY2xhc3NpZnkobmFtZSkpICsgXCI+XCIpIDogXCI8QW5vbnltb3VzPlwiKSArXHJcbiAgICAgICAgKGZpbGUgJiYgaW5jbHVkZUZpbGUgIT09IGZhbHNlID8gKFwiIGF0IFwiICsgZmlsZSkgOiAnJylcclxuICAgICAgKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmVwZWF0ID0gZnVuY3Rpb24gKHN0ciwgbikge1xyXG4gICAgICB2YXIgcmVzID0gJyc7XHJcbiAgICAgIHdoaWxlIChuKSB7XHJcbiAgICAgICAgaWYgKG4gJSAyID09PSAxKSB7IHJlcyArPSBzdHI7IH1cclxuICAgICAgICBpZiAobiA+IDEpIHsgc3RyICs9IHN0cjsgfVxyXG4gICAgICAgIG4gPj49IDE7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfTtcclxuXHJcbiAgICBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlID0gZnVuY3Rpb24gKHZtKSB7XHJcbiAgICAgIGlmICh2bS5faXNWdWUgJiYgdm0uJHBhcmVudCkge1xyXG4gICAgICAgIHZhciB0cmVlID0gW107XHJcbiAgICAgICAgdmFyIGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKHZtKSB7XHJcbiAgICAgICAgICBpZiAodHJlZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXN0ID0gdHJlZVt0cmVlLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBpZiAobGFzdC5jb25zdHJ1Y3RvciA9PT0gdm0uY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UrKztcclxuICAgICAgICAgICAgICB2bSA9IHZtLiRwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UgPiAwKSB7XHJcbiAgICAgICAgICAgICAgdHJlZVt0cmVlLmxlbmd0aCAtIDFdID0gW2xhc3QsIGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZV07XHJcbiAgICAgICAgICAgICAgY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdHJlZS5wdXNoKHZtKTtcclxuICAgICAgICAgIHZtID0gdm0uJHBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICdcXG5cXG5mb3VuZCBpblxcblxcbicgKyB0cmVlXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2bSwgaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFwiXCIgKyAoaSA9PT0gMCA/ICctLS0+ICcgOiByZXBlYXQoJyAnLCA1ICsgaSAqIDIpKSArIChBcnJheS5pc0FycmF5KHZtKVxyXG4gICAgICAgICAgICAgID8gKChmb3JtYXRDb21wb25lbnROYW1lKHZtWzBdKSkgKyBcIi4uLiAoXCIgKyAodm1bMV0pICsgXCIgcmVjdXJzaXZlIGNhbGxzKVwiKVxyXG4gICAgICAgICAgICAgIDogZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuam9pbignXFxuJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKFwiXFxuXFxuKGZvdW5kIGluIFwiICsgKGZvcm1hdENvbXBvbmVudE5hbWUodm0pKSArIFwiKVwiKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG5cclxuICB2YXIgdWlkID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXHJcbiAgICogZGlyZWN0aXZlcyBzdWJzY3JpYmluZyB0byBpdC5cclxuICAgKi9cclxuICB2YXIgRGVwID0gZnVuY3Rpb24gRGVwKCkge1xyXG4gICAgdGhpcy5pZCA9IHVpZCsrO1xyXG4gICAgdGhpcy5zdWJzID0gW107XHJcbiAgfTtcclxuXHJcbiAgRGVwLnByb3RvdHlwZS5hZGRTdWIgPSBmdW5jdGlvbiBhZGRTdWIoc3ViKSB7XHJcbiAgICB0aGlzLnN1YnMucHVzaChzdWIpO1xyXG4gIH07XHJcblxyXG4gIERlcC5wcm90b3R5cGUucmVtb3ZlU3ViID0gZnVuY3Rpb24gcmVtb3ZlU3ViKHN1Yikge1xyXG4gICAgcmVtb3ZlKHRoaXMuc3Vicywgc3ViKTtcclxuICB9O1xyXG5cclxuICBEZXAucHJvdG90eXBlLmRlcGVuZCA9IGZ1bmN0aW9uIGRlcGVuZCgpIHtcclxuICAgIGlmIChEZXAudGFyZ2V0KSB7XHJcbiAgICAgIERlcC50YXJnZXQuYWRkRGVwKHRoaXMpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIERlcC5wcm90b3R5cGUubm90aWZ5ID0gZnVuY3Rpb24gbm90aWZ5KCkge1xyXG4gICAgLy8gc3RhYmlsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcclxuICAgIHZhciBzdWJzID0gdGhpcy5zdWJzLnNsaWNlKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN1YnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIHN1YnNbaV0udXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gdGhlIGN1cnJlbnQgdGFyZ2V0IHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkLlxyXG4gIC8vIHRoaXMgaXMgZ2xvYmFsbHkgdW5pcXVlIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb25seSBvbmVcclxuICAvLyB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZCBhdCBhbnkgdGltZS5cclxuICBEZXAudGFyZ2V0ID0gbnVsbDtcclxuICB2YXIgdGFyZ2V0U3RhY2sgPSBbXTtcclxuXHJcbiAgZnVuY3Rpb24gcHVzaFRhcmdldChfdGFyZ2V0KSB7XHJcbiAgICBpZiAoRGVwLnRhcmdldCkgeyB0YXJnZXRTdGFjay5wdXNoKERlcC50YXJnZXQpOyB9XHJcbiAgICBEZXAudGFyZ2V0ID0gX3RhcmdldDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBvcFRhcmdldCgpIHtcclxuICAgIERlcC50YXJnZXQgPSB0YXJnZXRTdGFjay5wb3AoKTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgVk5vZGUgPSBmdW5jdGlvbiBWTm9kZShcclxuICAgIHRhZyxcclxuICAgIGRhdGEsXHJcbiAgICBjaGlsZHJlbixcclxuICAgIHRleHQsXHJcbiAgICBlbG0sXHJcbiAgICBjb250ZXh0LFxyXG4gICAgY29tcG9uZW50T3B0aW9ucyxcclxuICAgIGFzeW5jRmFjdG9yeVxyXG4gICkge1xyXG4gICAgdGhpcy50YWcgPSB0YWc7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIHRoaXMuZWxtID0gZWxtO1xyXG4gICAgdGhpcy5ucyA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICB0aGlzLmZuQ29udGV4dCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuZm5PcHRpb25zID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5mblNjb3BlSWQgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmtleSA9IGRhdGEgJiYgZGF0YS5rZXk7XHJcbiAgICB0aGlzLmNvbXBvbmVudE9wdGlvbnMgPSBjb21wb25lbnRPcHRpb25zO1xyXG4gICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5yYXcgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNTdGF0aWMgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNSb290SW5zZXJ0ID0gdHJ1ZTtcclxuICAgIHRoaXMuaXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzQ2xvbmVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzT25jZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5hc3luY0ZhY3RvcnkgPSBhc3luY0ZhY3Rvcnk7XHJcbiAgICB0aGlzLmFzeW5jTWV0YSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuaXNBc3luY1BsYWNlaG9sZGVyID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgdmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgY2hpbGQ6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0gfTtcclxuXHJcbiAgLy8gREVQUkVDQVRFRDogYWxpYXMgZm9yIGNvbXBvbmVudEluc3RhbmNlIGZvciBiYWNrd2FyZHMgY29tcGF0LlxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLmNoaWxkLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEluc3RhbmNlXHJcbiAgfTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoVk5vZGUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMpO1xyXG5cclxuICB2YXIgY3JlYXRlRW1wdHlWTm9kZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICBpZiAodGV4dCA9PT0gdm9pZCAwKSB0ZXh0ID0gJyc7XHJcblxyXG4gICAgdmFyIG5vZGUgPSBuZXcgVk5vZGUoKTtcclxuICAgIG5vZGUudGV4dCA9IHRleHQ7XHJcbiAgICBub2RlLmlzQ29tbWVudCA9IHRydWU7XHJcbiAgICByZXR1cm4gbm9kZVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHRWTm9kZSh2YWwpIHtcclxuICAgIHJldHVybiBuZXcgVk5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgU3RyaW5nKHZhbCkpXHJcbiAgfVxyXG5cclxuICAvLyBvcHRpbWl6ZWQgc2hhbGxvdyBjbG9uZVxyXG4gIC8vIHVzZWQgZm9yIHN0YXRpYyBub2RlcyBhbmQgc2xvdCBub2RlcyBiZWNhdXNlIHRoZXkgbWF5IGJlIHJldXNlZCBhY3Jvc3NcclxuICAvLyBtdWx0aXBsZSByZW5kZXJzLCBjbG9uaW5nIHRoZW0gYXZvaWRzIGVycm9ycyB3aGVuIERPTSBtYW5pcHVsYXRpb25zIHJlbHlcclxuICAvLyBvbiB0aGVpciBlbG0gcmVmZXJlbmNlLlxyXG4gIGZ1bmN0aW9uIGNsb25lVk5vZGUodm5vZGUpIHtcclxuICAgIHZhciBjbG9uZWQgPSBuZXcgVk5vZGUoXHJcbiAgICAgIHZub2RlLnRhZyxcclxuICAgICAgdm5vZGUuZGF0YSxcclxuICAgICAgdm5vZGUuY2hpbGRyZW4sXHJcbiAgICAgIHZub2RlLnRleHQsXHJcbiAgICAgIHZub2RlLmVsbSxcclxuICAgICAgdm5vZGUuY29udGV4dCxcclxuICAgICAgdm5vZGUuY29tcG9uZW50T3B0aW9ucyxcclxuICAgICAgdm5vZGUuYXN5bmNGYWN0b3J5XHJcbiAgICApO1xyXG4gICAgY2xvbmVkLm5zID0gdm5vZGUubnM7XHJcbiAgICBjbG9uZWQuaXNTdGF0aWMgPSB2bm9kZS5pc1N0YXRpYztcclxuICAgIGNsb25lZC5rZXkgPSB2bm9kZS5rZXk7XHJcbiAgICBjbG9uZWQuaXNDb21tZW50ID0gdm5vZGUuaXNDb21tZW50O1xyXG4gICAgY2xvbmVkLmZuQ29udGV4dCA9IHZub2RlLmZuQ29udGV4dDtcclxuICAgIGNsb25lZC5mbk9wdGlvbnMgPSB2bm9kZS5mbk9wdGlvbnM7XHJcbiAgICBjbG9uZWQuZm5TY29wZUlkID0gdm5vZGUuZm5TY29wZUlkO1xyXG4gICAgY2xvbmVkLmlzQ2xvbmVkID0gdHJ1ZTtcclxuICAgIHJldHVybiBjbG9uZWRcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogbm90IHR5cGUgY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgZmxvdyBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoXHJcbiAgICogZHluYW1pY2FsbHkgYWNjZXNzaW5nIG1ldGhvZHMgb24gQXJyYXkgcHJvdG90eXBlXHJcbiAgICovXHJcblxyXG4gIHZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xyXG4gIHZhciBhcnJheU1ldGhvZHMgPSBPYmplY3QuY3JlYXRlKGFycmF5UHJvdG8pO1xyXG5cclxuICB2YXIgbWV0aG9kc1RvUGF0Y2ggPSBbXHJcbiAgICAncHVzaCcsXHJcbiAgICAncG9wJyxcclxuICAgICdzaGlmdCcsXHJcbiAgICAndW5zaGlmdCcsXHJcbiAgICAnc3BsaWNlJyxcclxuICAgICdzb3J0JyxcclxuICAgICdyZXZlcnNlJ1xyXG4gIF07XHJcblxyXG4gIC8qKlxyXG4gICAqIEludGVyY2VwdCBtdXRhdGluZyBtZXRob2RzIGFuZCBlbWl0IGV2ZW50c1xyXG4gICAqL1xyXG4gIG1ldGhvZHNUb1BhdGNoLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xyXG4gICAgLy8gY2FjaGUgb3JpZ2luYWwgbWV0aG9kXHJcbiAgICB2YXIgb3JpZ2luYWwgPSBhcnJheVByb3RvW21ldGhvZF07XHJcbiAgICBkZWYoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IoKSB7XHJcbiAgICAgIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChsZW4tLSkgYXJnc1tsZW5dID0gYXJndW1lbnRzW2xlbl07XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgIHZhciBvYiA9IHRoaXMuX19vYl9fO1xyXG4gICAgICB2YXIgaW5zZXJ0ZWQ7XHJcbiAgICAgIHN3aXRjaCAobWV0aG9kKSB7XHJcbiAgICAgICAgY2FzZSAncHVzaCc6XHJcbiAgICAgICAgY2FzZSAndW5zaGlmdCc6XHJcbiAgICAgICAgICBpbnNlcnRlZCA9IGFyZ3M7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ3NwbGljZSc6XHJcbiAgICAgICAgICBpbnNlcnRlZCA9IGFyZ3Muc2xpY2UoMik7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpbnNlcnRlZCkgeyBvYi5vYnNlcnZlQXJyYXkoaW5zZXJ0ZWQpOyB9XHJcbiAgICAgIC8vIG5vdGlmeSBjaGFuZ2VcclxuICAgICAgb2IuZGVwLm5vdGlmeSgpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpO1xyXG5cclxuICAvKipcclxuICAgKiBJbiBzb21lIGNhc2VzIHdlIG1heSB3YW50IHRvIGRpc2FibGUgb2JzZXJ2YXRpb24gaW5zaWRlIGEgY29tcG9uZW50J3NcclxuICAgKiB1cGRhdGUgY29tcHV0YXRpb24uXHJcbiAgICovXHJcbiAgdmFyIHNob3VsZE9ic2VydmUgPSB0cnVlO1xyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVPYnNlcnZpbmcodmFsdWUpIHtcclxuICAgIHNob3VsZE9ic2VydmUgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9ic2VydmVyIGNsYXNzIHRoYXQgaXMgYXR0YWNoZWQgdG8gZWFjaCBvYnNlcnZlZFxyXG4gICAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRoZSB0YXJnZXRcclxuICAgKiBvYmplY3QncyBwcm9wZXJ0eSBrZXlzIGludG8gZ2V0dGVyL3NldHRlcnMgdGhhdFxyXG4gICAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaCB1cGRhdGVzLlxyXG4gICAqL1xyXG4gIHZhciBPYnNlcnZlciA9IGZ1bmN0aW9uIE9ic2VydmVyKHZhbHVlKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLmRlcCA9IG5ldyBEZXAoKTtcclxuICAgIHRoaXMudm1Db3VudCA9IDA7XHJcbiAgICBkZWYodmFsdWUsICdfX29iX18nLCB0aGlzKTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICB2YXIgYXVnbWVudCA9IGhhc1Byb3RvXHJcbiAgICAgICAgPyBwcm90b0F1Z21lbnRcclxuICAgICAgICA6IGNvcHlBdWdtZW50O1xyXG4gICAgICBhdWdtZW50KHZhbHVlLCBhcnJheU1ldGhvZHMsIGFycmF5S2V5cyk7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2Fsayh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogV2FsayB0aHJvdWdoIGVhY2ggcHJvcGVydHkgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXHJcbiAgICogZ2V0dGVyL3NldHRlcnMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aGVuXHJcbiAgICogdmFsdWUgdHlwZSBpcyBPYmplY3QuXHJcbiAgICovXHJcbiAgT2JzZXJ2ZXIucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiB3YWxrKG9iaikge1xyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGRlZmluZVJlYWN0aXZlKG9iaiwga2V5c1tpXSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXHJcbiAgICovXHJcbiAgT2JzZXJ2ZXIucHJvdG90eXBlLm9ic2VydmVBcnJheSA9IGZ1bmN0aW9uIG9ic2VydmVBcnJheShpdGVtcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgb2JzZXJ2ZShpdGVtc1tpXSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gaGVscGVyc1xyXG5cclxuICAvKipcclxuICAgKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXHJcbiAgICogdGhlIHByb3RvdHlwZSBjaGFpbiB1c2luZyBfX3Byb3RvX19cclxuICAgKi9cclxuICBmdW5jdGlvbiBwcm90b0F1Z21lbnQodGFyZ2V0LCBzcmMsIGtleXMpIHtcclxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXHJcbiAgICB0YXJnZXQuX19wcm90b19fID0gc3JjO1xyXG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGRlZmluaW5nXHJcbiAgICogaGlkZGVuIHByb3BlcnRpZXMuXHJcbiAgICovXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICBmdW5jdGlvbiBjb3B5QXVnbWVudCh0YXJnZXQsIHNyYywga2V5cykge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcclxuICAgICAgZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBdHRlbXB0IHRvIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBmb3IgYSB2YWx1ZSxcclxuICAgKiByZXR1cm5zIHRoZSBuZXcgb2JzZXJ2ZXIgaWYgc3VjY2Vzc2Z1bGx5IG9ic2VydmVkLFxyXG4gICAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG9ic2VydmUodmFsdWUsIGFzUm9vdERhdGEpIHtcclxuICAgIGlmICghaXNPYmplY3QodmFsdWUpIHx8IHZhbHVlIGluc3RhbmNlb2YgVk5vZGUpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgb2I7XHJcbiAgICBpZiAoaGFzT3duKHZhbHVlLCAnX19vYl9fJykgJiYgdmFsdWUuX19vYl9fIGluc3RhbmNlb2YgT2JzZXJ2ZXIpIHtcclxuICAgICAgb2IgPSB2YWx1ZS5fX29iX187XHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICBzaG91bGRPYnNlcnZlICYmXHJcbiAgICAgICFpc1NlcnZlclJlbmRlcmluZygpICYmXHJcbiAgICAgIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBpc1BsYWluT2JqZWN0KHZhbHVlKSkgJiZcclxuICAgICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWx1ZSkgJiZcclxuICAgICAgIXZhbHVlLl9pc1Z1ZVxyXG4gICAgKSB7XHJcbiAgICAgIG9iID0gbmV3IE9ic2VydmVyKHZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmIChhc1Jvb3REYXRhICYmIG9iKSB7XHJcbiAgICAgIG9iLnZtQ291bnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiBvYlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIGEgcmVhY3RpdmUgcHJvcGVydHkgb24gYW4gT2JqZWN0LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlKFxyXG4gICAgb2JqLFxyXG4gICAga2V5LFxyXG4gICAgdmFsLFxyXG4gICAgY3VzdG9tU2V0dGVyLFxyXG4gICAgc2hhbGxvd1xyXG4gICkge1xyXG4gICAgdmFyIGRlcCA9IG5ldyBEZXAoKTtcclxuXHJcbiAgICB2YXIgcHJvcGVydHkgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcclxuICAgIGlmIChwcm9wZXJ0eSAmJiBwcm9wZXJ0eS5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhdGVyIGZvciBwcmUtZGVmaW5lZCBnZXR0ZXIvc2V0dGVyc1xyXG4gICAgdmFyIGdldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LmdldDtcclxuICAgIGlmICghZ2V0dGVyICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgdmFsID0gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgICB2YXIgc2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuc2V0O1xyXG5cclxuICAgIHZhciBjaGlsZE9iID0gIXNoYWxsb3cgJiYgb2JzZXJ2ZSh2YWwpO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZUdldHRlcigpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBnZXR0ZXIgPyBnZXR0ZXIuY2FsbChvYmopIDogdmFsO1xyXG4gICAgICAgIGlmIChEZXAudGFyZ2V0KSB7XHJcbiAgICAgICAgICBkZXAuZGVwZW5kKCk7XHJcbiAgICAgICAgICBpZiAoY2hpbGRPYikge1xyXG4gICAgICAgICAgICBjaGlsZE9iLmRlcC5kZXBlbmQoKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgZGVwZW5kQXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlU2V0dGVyKG5ld1ZhbCkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XHJcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlICovXHJcbiAgICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsdWUgfHwgKG5ld1ZhbCAhPT0gbmV3VmFsICYmIHZhbHVlICE9PSB2YWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjdXN0b21TZXR0ZXIpIHtcclxuICAgICAgICAgIGN1c3RvbVNldHRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2V0dGVyKSB7XHJcbiAgICAgICAgICBzZXR0ZXIuY2FsbChvYmosIG5ld1ZhbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhbCA9IG5ld1ZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hpbGRPYiA9ICFzaGFsbG93ICYmIG9ic2VydmUobmV3VmFsKTtcclxuICAgICAgICBkZXAubm90aWZ5KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGEgcHJvcGVydHkgb24gYW4gb2JqZWN0LiBBZGRzIHRoZSBuZXcgcHJvcGVydHkgYW5kXHJcbiAgICogdHJpZ2dlcnMgY2hhbmdlIG5vdGlmaWNhdGlvbiBpZiB0aGUgcHJvcGVydHkgZG9lc24ndFxyXG4gICAqIGFscmVhZHkgZXhpc3QuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2V0KHRhcmdldCwga2V5LCB2YWwpIHtcclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgICAoaXNVbmRlZih0YXJnZXQpIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpXHJcbiAgICApIHtcclxuICAgICAgd2FybigoXCJDYW5ub3Qgc2V0IHJlYWN0aXZlIHByb3BlcnR5IG9uIHVuZGVmaW5lZCwgbnVsbCwgb3IgcHJpbWl0aXZlIHZhbHVlOiBcIiArICgodGFyZ2V0KSkpKTtcclxuICAgIH1cclxuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgaXNWYWxpZEFycmF5SW5kZXgoa2V5KSkge1xyXG4gICAgICB0YXJnZXQubGVuZ3RoID0gTWF0aC5tYXgodGFyZ2V0Lmxlbmd0aCwga2V5KTtcclxuICAgICAgdGFyZ2V0LnNwbGljZShrZXksIDEsIHZhbCk7XHJcbiAgICAgIHJldHVybiB2YWxcclxuICAgIH1cclxuICAgIGlmIChrZXkgaW4gdGFyZ2V0ICYmICEoa2V5IGluIE9iamVjdC5wcm90b3R5cGUpKSB7XHJcbiAgICAgIHRhcmdldFtrZXldID0gdmFsO1xyXG4gICAgICByZXR1cm4gdmFsXHJcbiAgICB9XHJcbiAgICB2YXIgb2IgPSAodGFyZ2V0KS5fX29iX187XHJcbiAgICBpZiAodGFyZ2V0Ll9pc1Z1ZSB8fCAob2IgJiYgb2Iudm1Db3VudCkpIHtcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICAnQXZvaWQgYWRkaW5nIHJlYWN0aXZlIHByb3BlcnRpZXMgdG8gYSBWdWUgaW5zdGFuY2Ugb3IgaXRzIHJvb3QgJGRhdGEgJyArXHJcbiAgICAgICAgJ2F0IHJ1bnRpbWUgLSBkZWNsYXJlIGl0IHVwZnJvbnQgaW4gdGhlIGRhdGEgb3B0aW9uLidcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIHZhbFxyXG4gICAgfVxyXG4gICAgaWYgKCFvYikge1xyXG4gICAgICB0YXJnZXRba2V5XSA9IHZhbDtcclxuICAgICAgcmV0dXJuIHZhbFxyXG4gICAgfVxyXG4gICAgZGVmaW5lUmVhY3RpdmUob2IudmFsdWUsIGtleSwgdmFsKTtcclxuICAgIG9iLmRlcC5ub3RpZnkoKTtcclxuICAgIHJldHVybiB2YWxcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBhIHByb3BlcnR5IGFuZCB0cmlnZ2VyIGNoYW5nZSBpZiBuZWNlc3NhcnkuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZGVsKHRhcmdldCwga2V5KSB7XHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgKGlzVW5kZWYodGFyZ2V0KSB8fCBpc1ByaW1pdGl2ZSh0YXJnZXQpKVxyXG4gICAgKSB7XHJcbiAgICAgIHdhcm4oKFwiQ2Fubm90IGRlbGV0ZSByZWFjdGl2ZSBwcm9wZXJ0eSBvbiB1bmRlZmluZWQsIG51bGwsIG9yIHByaW1pdGl2ZSB2YWx1ZTogXCIgKyAoKHRhcmdldCkpKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIGlzVmFsaWRBcnJheUluZGV4KGtleSkpIHtcclxuICAgICAgdGFyZ2V0LnNwbGljZShrZXksIDEpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHZhciBvYiA9ICh0YXJnZXQpLl9fb2JfXztcclxuICAgIGlmICh0YXJnZXQuX2lzVnVlIHx8IChvYiAmJiBvYi52bUNvdW50KSkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICdBdm9pZCBkZWxldGluZyBwcm9wZXJ0aWVzIG9uIGEgVnVlIGluc3RhbmNlIG9yIGl0cyByb290ICRkYXRhICcgK1xyXG4gICAgICAgICctIGp1c3Qgc2V0IGl0IHRvIG51bGwuJ1xyXG4gICAgICApO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmICghaGFzT3duKHRhcmdldCwga2V5KSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcclxuICAgIGlmICghb2IpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBvYi5kZXAubm90aWZ5KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb2xsZWN0IGRlcGVuZGVuY2llcyBvbiBhcnJheSBlbGVtZW50cyB3aGVuIHRoZSBhcnJheSBpcyB0b3VjaGVkLCBzaW5jZVxyXG4gICAqIHdlIGNhbm5vdCBpbnRlcmNlcHQgYXJyYXkgZWxlbWVudCBhY2Nlc3MgbGlrZSBwcm9wZXJ0eSBnZXR0ZXJzLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGRlcGVuZEFycmF5KHZhbHVlKSB7XHJcbiAgICBmb3IgKHZhciBlID0gKHZvaWQgMCksIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGUgPSB2YWx1ZVtpXTtcclxuICAgICAgZSAmJiBlLl9fb2JfXyAmJiBlLl9fb2JfXy5kZXAuZGVwZW5kKCk7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XHJcbiAgICAgICAgZGVwZW5kQXJyYXkoZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXHJcbiAgICogaG93IHRvIG1lcmdlIGEgcGFyZW50IG9wdGlvbiB2YWx1ZSBhbmQgYSBjaGlsZCBvcHRpb25cclxuICAgKiB2YWx1ZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZS5cclxuICAgKi9cclxuICB2YXIgc3RyYXRzID0gY29uZmlnLm9wdGlvbk1lcmdlU3RyYXRlZ2llcztcclxuXHJcbiAgLyoqXHJcbiAgICogT3B0aW9ucyB3aXRoIHJlc3RyaWN0aW9uc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHN0cmF0cy5lbCA9IHN0cmF0cy5wcm9wc0RhdGEgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCwgdm0sIGtleSkge1xyXG4gICAgICBpZiAoIXZtKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgIFwib3B0aW9uIFxcXCJcIiArIGtleSArIFwiXFxcIiBjYW4gb25seSBiZSB1c2VkIGR1cmluZyBpbnN0YW5jZSBcIiArXHJcbiAgICAgICAgICAnY3JlYXRpb24gd2l0aCB0aGUgYG5ld2Aga2V5d29yZC4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVmYXVsdFN0cmF0KHBhcmVudCwgY2hpbGQpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIHRoYXQgcmVjdXJzaXZlbHkgbWVyZ2VzIHR3byBkYXRhIG9iamVjdHMgdG9nZXRoZXIuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWVyZ2VEYXRhKHRvLCBmcm9tKSB7XHJcbiAgICBpZiAoIWZyb20pIHsgcmV0dXJuIHRvIH1cclxuICAgIHZhciBrZXksIHRvVmFsLCBmcm9tVmFsO1xyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcm9tKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICB0b1ZhbCA9IHRvW2tleV07XHJcbiAgICAgIGZyb21WYWwgPSBmcm9tW2tleV07XHJcbiAgICAgIGlmICghaGFzT3duKHRvLCBrZXkpKSB7XHJcbiAgICAgICAgc2V0KHRvLCBrZXksIGZyb21WYWwpO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodG9WYWwpICYmIGlzUGxhaW5PYmplY3QoZnJvbVZhbCkpIHtcclxuICAgICAgICBtZXJnZURhdGEodG9WYWwsIGZyb21WYWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGFcclxuICAgKi9cclxuICBmdW5jdGlvbiBtZXJnZURhdGFPckZuKFxyXG4gICAgcGFyZW50VmFsLFxyXG4gICAgY2hpbGRWYWwsXHJcbiAgICB2bVxyXG4gICkge1xyXG4gICAgaWYgKCF2bSkge1xyXG4gICAgICAvLyBpbiBhIFZ1ZS5leHRlbmQgbWVyZ2UsIGJvdGggc2hvdWxkIGJlIGZ1bmN0aW9uc1xyXG4gICAgICBpZiAoIWNoaWxkVmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudFZhbFxyXG4gICAgICB9XHJcbiAgICAgIGlmICghcGFyZW50VmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkVmFsXHJcbiAgICAgIH1cclxuICAgICAgLy8gd2hlbiBwYXJlbnRWYWwgJiBjaGlsZFZhbCBhcmUgYm90aCBwcmVzZW50LFxyXG4gICAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcclxuICAgICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXHJcbiAgICAgIC8vIGNoZWNrIGlmIHBhcmVudFZhbCBpcyBhIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZVxyXG4gICAgICAvLyBpdCBoYXMgdG8gYmUgYSBmdW5jdGlvbiB0byBwYXNzIHByZXZpb3VzIG1lcmdlcy5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbigpIHtcclxuICAgICAgICByZXR1cm4gbWVyZ2VEYXRhKFxyXG4gICAgICAgICAgdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nID8gY2hpbGRWYWwuY2FsbCh0aGlzLCB0aGlzKSA6IGNoaWxkVmFsLFxyXG4gICAgICAgICAgdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJyA/IHBhcmVudFZhbC5jYWxsKHRoaXMsIHRoaXMpIDogcGFyZW50VmFsXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkSW5zdGFuY2VEYXRhRm4oKSB7XHJcbiAgICAgICAgLy8gaW5zdGFuY2UgbWVyZ2VcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nXHJcbiAgICAgICAgICA/IGNoaWxkVmFsLmNhbGwodm0sIHZtKVxyXG4gICAgICAgICAgOiBjaGlsZFZhbDtcclxuICAgICAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nXHJcbiAgICAgICAgICA/IHBhcmVudFZhbC5jYWxsKHZtLCB2bSlcclxuICAgICAgICAgIDogcGFyZW50VmFsO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEpIHtcclxuICAgICAgICAgIHJldHVybiBtZXJnZURhdGEoaW5zdGFuY2VEYXRhLCBkZWZhdWx0RGF0YSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdHJhdHMuZGF0YSA9IGZ1bmN0aW9uIChcclxuICAgIHBhcmVudFZhbCxcclxuICAgIGNoaWxkVmFsLFxyXG4gICAgdm1cclxuICApIHtcclxuICAgIGlmICghdm0pIHtcclxuICAgICAgaWYgKGNoaWxkVmFsICYmIHR5cGVvZiBjaGlsZFZhbCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICAgICAnVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcclxuICAgICAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xyXG4gICAgICAgICAgJ2RlZmluaXRpb25zLicsXHJcbiAgICAgICAgICB2bVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJlbnRWYWxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVyZ2VEYXRhT3JGbihwYXJlbnRWYWwsIGNoaWxkVmFsKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXJnZURhdGFPckZuKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEhvb2tzIGFuZCBwcm9wcyBhcmUgbWVyZ2VkIGFzIGFycmF5cy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBtZXJnZUhvb2soXHJcbiAgICBwYXJlbnRWYWwsXHJcbiAgICBjaGlsZFZhbFxyXG4gICkge1xyXG4gICAgcmV0dXJuIGNoaWxkVmFsXHJcbiAgICAgID8gcGFyZW50VmFsXHJcbiAgICAgICAgPyBwYXJlbnRWYWwuY29uY2F0KGNoaWxkVmFsKVxyXG4gICAgICAgIDogQXJyYXkuaXNBcnJheShjaGlsZFZhbClcclxuICAgICAgICAgID8gY2hpbGRWYWxcclxuICAgICAgICAgIDogW2NoaWxkVmFsXVxyXG4gICAgICA6IHBhcmVudFZhbFxyXG4gIH1cclxuXHJcbiAgTElGRUNZQ0xFX0hPT0tTLmZvckVhY2goZnVuY3Rpb24gKGhvb2spIHtcclxuICAgIHN0cmF0c1tob29rXSA9IG1lcmdlSG9vaztcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogQXNzZXRzXHJcbiAgICpcclxuICAgKiBXaGVuIGEgdm0gaXMgcHJlc2VudCAoaW5zdGFuY2UgY3JlYXRpb24pLCB3ZSBuZWVkIHRvIGRvXHJcbiAgICogYSB0aHJlZS13YXkgbWVyZ2UgYmV0d2VlbiBjb25zdHJ1Y3RvciBvcHRpb25zLCBpbnN0YW5jZVxyXG4gICAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1lcmdlQXNzZXRzKFxyXG4gICAgcGFyZW50VmFsLFxyXG4gICAgY2hpbGRWYWwsXHJcbiAgICB2bSxcclxuICAgIGtleVxyXG4gICkge1xyXG4gICAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUocGFyZW50VmFsIHx8IG51bGwpO1xyXG4gICAgaWYgKGNoaWxkVmFsKSB7XHJcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGFzc2VydE9iamVjdFR5cGUoa2V5LCBjaGlsZFZhbCwgdm0pO1xyXG4gICAgICByZXR1cm4gZXh0ZW5kKHJlcywgY2hpbGRWYWwpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBzdHJhdHNbdHlwZSArICdzJ10gPSBtZXJnZUFzc2V0cztcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogV2F0Y2hlcnMuXHJcbiAgICpcclxuICAgKiBXYXRjaGVycyBoYXNoZXMgc2hvdWxkIG5vdCBvdmVyd3JpdGUgb25lXHJcbiAgICogYW5vdGhlciwgc28gd2UgbWVyZ2UgdGhlbSBhcyBhcnJheXMuXHJcbiAgICovXHJcbiAgc3RyYXRzLndhdGNoID0gZnVuY3Rpb24gKFxyXG4gICAgcGFyZW50VmFsLFxyXG4gICAgY2hpbGRWYWwsXHJcbiAgICB2bSxcclxuICAgIGtleVxyXG4gICkge1xyXG4gICAgLy8gd29yayBhcm91bmQgRmlyZWZveCdzIE9iamVjdC5wcm90b3R5cGUud2F0Y2guLi5cclxuICAgIGlmIChwYXJlbnRWYWwgPT09IG5hdGl2ZVdhdGNoKSB7IHBhcmVudFZhbCA9IHVuZGVmaW5lZDsgfVxyXG4gICAgaWYgKGNoaWxkVmFsID09PSBuYXRpdmVXYXRjaCkgeyBjaGlsZFZhbCA9IHVuZGVmaW5lZDsgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIWNoaWxkVmFsKSB7IHJldHVybiBPYmplY3QuY3JlYXRlKHBhcmVudFZhbCB8fCBudWxsKSB9XHJcbiAgICB7XHJcbiAgICAgIGFzc2VydE9iamVjdFR5cGUoa2V5LCBjaGlsZFZhbCwgdm0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFwYXJlbnRWYWwpIHsgcmV0dXJuIGNoaWxkVmFsIH1cclxuICAgIHZhciByZXQgPSB7fTtcclxuICAgIGV4dGVuZChyZXQsIHBhcmVudFZhbCk7XHJcbiAgICBmb3IgKHZhciBrZXkkMSBpbiBjaGlsZFZhbCkge1xyXG4gICAgICB2YXIgcGFyZW50ID0gcmV0W2tleSQxXTtcclxuICAgICAgdmFyIGNoaWxkID0gY2hpbGRWYWxba2V5JDFdO1xyXG4gICAgICBpZiAocGFyZW50ICYmICFBcnJheS5pc0FycmF5KHBhcmVudCkpIHtcclxuICAgICAgICBwYXJlbnQgPSBbcGFyZW50XTtcclxuICAgICAgfVxyXG4gICAgICByZXRba2V5JDFdID0gcGFyZW50XHJcbiAgICAgICAgPyBwYXJlbnQuY29uY2F0KGNoaWxkKVxyXG4gICAgICAgIDogQXJyYXkuaXNBcnJheShjaGlsZCkgPyBjaGlsZCA6IFtjaGlsZF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogT3RoZXIgb2JqZWN0IGhhc2hlcy5cclxuICAgKi9cclxuICBzdHJhdHMucHJvcHMgPVxyXG4gICAgc3RyYXRzLm1ldGhvZHMgPVxyXG4gICAgc3RyYXRzLmluamVjdCA9XHJcbiAgICBzdHJhdHMuY29tcHV0ZWQgPSBmdW5jdGlvbiAoXHJcbiAgICAgIHBhcmVudFZhbCxcclxuICAgICAgY2hpbGRWYWwsXHJcbiAgICAgIHZtLFxyXG4gICAgICBrZXlcclxuICAgICkge1xyXG4gICAgICBpZiAoY2hpbGRWYWwgJiYgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICBhc3NlcnRPYmplY3RUeXBlKGtleSwgY2hpbGRWYWwsIHZtKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXBhcmVudFZhbCkgeyByZXR1cm4gY2hpbGRWYWwgfVxyXG4gICAgICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKTtcclxuICAgICAgaWYgKGNoaWxkVmFsKSB7IGV4dGVuZChyZXQsIGNoaWxkVmFsKTsgfVxyXG4gICAgICByZXR1cm4gcmV0XHJcbiAgICB9O1xyXG4gIHN0cmF0cy5wcm92aWRlID0gbWVyZ2VEYXRhT3JGbjtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVmYXVsdCBzdHJhdGVneS5cclxuICAgKi9cclxuICB2YXIgZGVmYXVsdFN0cmF0ID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcclxuICAgIHJldHVybiBjaGlsZFZhbCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gcGFyZW50VmFsXHJcbiAgICAgIDogY2hpbGRWYWxcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZSBjb21wb25lbnQgbmFtZXNcclxuICAgKi9cclxuICBmdW5jdGlvbiBjaGVja0NvbXBvbmVudHMob3B0aW9ucykge1xyXG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMuY29tcG9uZW50cykge1xyXG4gICAgICB2YWxpZGF0ZUNvbXBvbmVudE5hbWUoa2V5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lKSB7XHJcbiAgICBpZiAoIS9eW2EtekEtWl1bXFx3LV0qJC8udGVzdChuYW1lKSkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgICdJbnZhbGlkIGNvbXBvbmVudCBuYW1lOiBcIicgKyBuYW1lICsgJ1wiLiBDb21wb25lbnQgbmFtZXMgJyArXHJcbiAgICAgICAgJ2NhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgYW5kIHRoZSBoeXBoZW4sICcgK1xyXG4gICAgICAgICdhbmQgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyLidcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChpc0J1aWx0SW5UYWcobmFtZSkgfHwgY29uZmlnLmlzUmVzZXJ2ZWRUYWcobmFtZSkpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnRG8gbm90IHVzZSBidWlsdC1pbiBvciByZXNlcnZlZCBIVE1MIGVsZW1lbnRzIGFzIGNvbXBvbmVudCAnICtcclxuICAgICAgICAnaWQ6ICcgKyBuYW1lXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbnN1cmUgYWxsIHByb3BzIG9wdGlvbiBzeW50YXggYXJlIG5vcm1hbGl6ZWQgaW50byB0aGVcclxuICAgKiBPYmplY3QtYmFzZWQgZm9ybWF0LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVByb3BzKG9wdGlvbnMsIHZtKSB7XHJcbiAgICB2YXIgcHJvcHMgPSBvcHRpb25zLnByb3BzO1xyXG4gICAgaWYgKCFwcm9wcykgeyByZXR1cm4gfVxyXG4gICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgdmFyIGksIHZhbCwgbmFtZTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzKSkge1xyXG4gICAgICBpID0gcHJvcHMubGVuZ3RoO1xyXG4gICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgdmFsID0gcHJvcHNbaV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBuYW1lID0gY2FtZWxpemUodmFsKTtcclxuICAgICAgICAgIHJlc1tuYW1lXSA9IHsgdHlwZTogbnVsbCB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3YXJuKCdwcm9wcyBtdXN0IGJlIHN0cmluZ3Mgd2hlbiB1c2luZyBhcnJheSBzeW50YXguJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QocHJvcHMpKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xyXG4gICAgICAgIHZhbCA9IHByb3BzW2tleV07XHJcbiAgICAgICAgbmFtZSA9IGNhbWVsaXplKGtleSk7XHJcbiAgICAgICAgcmVzW25hbWVdID0gaXNQbGFpbk9iamVjdCh2YWwpXHJcbiAgICAgICAgICA/IHZhbFxyXG4gICAgICAgICAgOiB7IHR5cGU6IHZhbCB9O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJwcm9wc1xcXCI6IGV4cGVjdGVkIGFuIEFycmF5IG9yIGFuIE9iamVjdCwgXCIgK1xyXG4gICAgICAgIFwiYnV0IGdvdCBcIiArICh0b1Jhd1R5cGUocHJvcHMpKSArIFwiLlwiLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zLnByb3BzID0gcmVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9ybWFsaXplIGFsbCBpbmplY3Rpb25zIGludG8gT2JqZWN0LWJhc2VkIGZvcm1hdFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZUluamVjdChvcHRpb25zLCB2bSkge1xyXG4gICAgdmFyIGluamVjdCA9IG9wdGlvbnMuaW5qZWN0O1xyXG4gICAgaWYgKCFpbmplY3QpIHsgcmV0dXJuIH1cclxuICAgIHZhciBub3JtYWxpemVkID0gb3B0aW9ucy5pbmplY3QgPSB7fTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGluamVjdCkpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmplY3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBub3JtYWxpemVkW2luamVjdFtpXV0gPSB7IGZyb206IGluamVjdFtpXSB9O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QoaW5qZWN0KSkge1xyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gaW5qZWN0KSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IGluamVjdFtrZXldO1xyXG4gICAgICAgIG5vcm1hbGl6ZWRba2V5XSA9IGlzUGxhaW5PYmplY3QodmFsKVxyXG4gICAgICAgICAgPyBleHRlbmQoeyBmcm9tOiBrZXkgfSwgdmFsKVxyXG4gICAgICAgICAgOiB7IGZyb206IHZhbCB9O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJpbmplY3RcXFwiOiBleHBlY3RlZCBhbiBBcnJheSBvciBhbiBPYmplY3QsIFwiICtcclxuICAgICAgICBcImJ1dCBnb3QgXCIgKyAodG9SYXdUeXBlKGluamVjdCkpICsgXCIuXCIsXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vcm1hbGl6ZSByYXcgZnVuY3Rpb24gZGlyZWN0aXZlcyBpbnRvIG9iamVjdCBmb3JtYXQuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXplRGlyZWN0aXZlcyhvcHRpb25zKSB7XHJcbiAgICB2YXIgZGlycyA9IG9wdGlvbnMuZGlyZWN0aXZlcztcclxuICAgIGlmIChkaXJzKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBkaXJzKSB7XHJcbiAgICAgICAgdmFyIGRlZiA9IGRpcnNba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgZGlyc1trZXldID0geyBiaW5kOiBkZWYsIHVwZGF0ZTogZGVmIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhc3NlcnRPYmplY3RUeXBlKG5hbWUsIHZhbHVlLCB2bSkge1xyXG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJcIiArIG5hbWUgKyBcIlxcXCI6IGV4cGVjdGVkIGFuIE9iamVjdCwgXCIgK1xyXG4gICAgICAgIFwiYnV0IGdvdCBcIiArICh0b1Jhd1R5cGUodmFsdWUpKSArIFwiLlwiLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXHJcbiAgICogQ29yZSB1dGlsaXR5IHVzZWQgaW4gYm90aCBpbnN0YW50aWF0aW9uIGFuZCBpbmhlcml0YW5jZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBtZXJnZU9wdGlvbnMoXHJcbiAgICBwYXJlbnQsXHJcbiAgICBjaGlsZCxcclxuICAgIHZtXHJcbiAgKSB7XHJcbiAgICB7XHJcbiAgICAgIGNoZWNrQ29tcG9uZW50cyhjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBjaGlsZCA9IGNoaWxkLm9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsaXplUHJvcHMoY2hpbGQsIHZtKTtcclxuICAgIG5vcm1hbGl6ZUluamVjdChjaGlsZCwgdm0pO1xyXG4gICAgbm9ybWFsaXplRGlyZWN0aXZlcyhjaGlsZCk7XHJcbiAgICB2YXIgZXh0ZW5kc0Zyb20gPSBjaGlsZC5leHRlbmRzO1xyXG4gICAgaWYgKGV4dGVuZHNGcm9tKSB7XHJcbiAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGV4dGVuZHNGcm9tLCB2bSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2hpbGQubWl4aW5zKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGNoaWxkLm1peGluc1tpXSwgdm0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xyXG4gICAgdmFyIGtleTtcclxuICAgIGZvciAoa2V5IGluIHBhcmVudCkge1xyXG4gICAgICBtZXJnZUZpZWxkKGtleSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGtleSBpbiBjaGlsZCkge1xyXG4gICAgICBpZiAoIWhhc093bihwYXJlbnQsIGtleSkpIHtcclxuICAgICAgICBtZXJnZUZpZWxkKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG1lcmdlRmllbGQoa2V5KSB7XHJcbiAgICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdDtcclxuICAgICAgb3B0aW9uc1trZXldID0gc3RyYXQocGFyZW50W2tleV0sIGNoaWxkW2tleV0sIHZtLCBrZXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdGlvbnNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc29sdmUgYW4gYXNzZXQuXHJcbiAgICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGJlY2F1c2UgY2hpbGQgaW5zdGFuY2VzIG5lZWQgYWNjZXNzXHJcbiAgICogdG8gYXNzZXRzIGRlZmluZWQgaW4gaXRzIGFuY2VzdG9yIGNoYWluLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlc29sdmVBc3NldChcclxuICAgIG9wdGlvbnMsXHJcbiAgICB0eXBlLFxyXG4gICAgaWQsXHJcbiAgICB3YXJuTWlzc2luZ1xyXG4gICkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHZhciBhc3NldHMgPSBvcHRpb25zW3R5cGVdO1xyXG4gICAgLy8gY2hlY2sgbG9jYWwgcmVnaXN0cmF0aW9uIHZhcmlhdGlvbnMgZmlyc3RcclxuICAgIGlmIChoYXNPd24oYXNzZXRzLCBpZCkpIHsgcmV0dXJuIGFzc2V0c1tpZF0gfVxyXG4gICAgdmFyIGNhbWVsaXplZElkID0gY2FtZWxpemUoaWQpO1xyXG4gICAgaWYgKGhhc093bihhc3NldHMsIGNhbWVsaXplZElkKSkgeyByZXR1cm4gYXNzZXRzW2NhbWVsaXplZElkXSB9XHJcbiAgICB2YXIgUGFzY2FsQ2FzZUlkID0gY2FwaXRhbGl6ZShjYW1lbGl6ZWRJZCk7XHJcbiAgICBpZiAoaGFzT3duKGFzc2V0cywgUGFzY2FsQ2FzZUlkKSkgeyByZXR1cm4gYXNzZXRzW1Bhc2NhbENhc2VJZF0gfVxyXG4gICAgLy8gZmFsbGJhY2sgdG8gcHJvdG90eXBlIGNoYWluXHJcbiAgICB2YXIgcmVzID0gYXNzZXRzW2lkXSB8fCBhc3NldHNbY2FtZWxpemVkSWRdIHx8IGFzc2V0c1tQYXNjYWxDYXNlSWRdO1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm5NaXNzaW5nICYmICFyZXMpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnRmFpbGVkIHRvIHJlc29sdmUgJyArIHR5cGUuc2xpY2UoMCwgLTEpICsgJzogJyArIGlkLFxyXG4gICAgICAgIG9wdGlvbnNcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiB2YWxpZGF0ZVByb3AoXHJcbiAgICBrZXksXHJcbiAgICBwcm9wT3B0aW9ucyxcclxuICAgIHByb3BzRGF0YSxcclxuICAgIHZtXHJcbiAgKSB7XHJcbiAgICB2YXIgcHJvcCA9IHByb3BPcHRpb25zW2tleV07XHJcbiAgICB2YXIgYWJzZW50ID0gIWhhc093bihwcm9wc0RhdGEsIGtleSk7XHJcbiAgICB2YXIgdmFsdWUgPSBwcm9wc0RhdGFba2V5XTtcclxuICAgIC8vIGJvb2xlYW4gY2FzdGluZ1xyXG4gICAgdmFyIGJvb2xlYW5JbmRleCA9IGdldFR5cGVJbmRleChCb29sZWFuLCBwcm9wLnR5cGUpO1xyXG4gICAgaWYgKGJvb2xlYW5JbmRleCA+IC0xKSB7XHJcbiAgICAgIGlmIChhYnNlbnQgJiYgIWhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XHJcbiAgICAgICAgdmFsdWUgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IGh5cGhlbmF0ZShrZXkpKSB7XHJcbiAgICAgICAgLy8gb25seSBjYXN0IGVtcHR5IHN0cmluZyAvIHNhbWUgbmFtZSB0byBib29sZWFuIGlmXHJcbiAgICAgICAgLy8gYm9vbGVhbiBoYXMgaGlnaGVyIHByaW9yaXR5XHJcbiAgICAgICAgdmFyIHN0cmluZ0luZGV4ID0gZ2V0VHlwZUluZGV4KFN0cmluZywgcHJvcC50eXBlKTtcclxuICAgICAgICBpZiAoc3RyaW5nSW5kZXggPCAwIHx8IGJvb2xlYW5JbmRleCA8IHN0cmluZ0luZGV4KSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVjayBkZWZhdWx0IHZhbHVlXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB2YWx1ZSA9IGdldFByb3BEZWZhdWx0VmFsdWUodm0sIHByb3AsIGtleSk7XHJcbiAgICAgIC8vIHNpbmNlIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGEgZnJlc2ggY29weSxcclxuICAgICAgLy8gbWFrZSBzdXJlIHRvIG9ic2VydmUgaXQuXHJcbiAgICAgIHZhciBwcmV2U2hvdWxkT2JzZXJ2ZSA9IHNob3VsZE9ic2VydmU7XHJcbiAgICAgIHRvZ2dsZU9ic2VydmluZyh0cnVlKTtcclxuICAgICAgb2JzZXJ2ZSh2YWx1ZSk7XHJcbiAgICAgIHRvZ2dsZU9ic2VydmluZyhwcmV2U2hvdWxkT2JzZXJ2ZSk7XHJcbiAgICB9XHJcbiAgICB7XHJcbiAgICAgIGFzc2VydFByb3AocHJvcCwga2V5LCB2YWx1ZSwgdm0sIGFic2VudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIHByb3AuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0UHJvcERlZmF1bHRWYWx1ZSh2bSwgcHJvcCwga2V5KSB7XHJcbiAgICAvLyBubyBkZWZhdWx0LCByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICBpZiAoIWhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIHZhciBkZWYgPSBwcm9wLmRlZmF1bHQ7XHJcbiAgICAvLyB3YXJuIGFnYWluc3Qgbm9uLWZhY3RvcnkgZGVmYXVsdHMgZm9yIE9iamVjdCAmIEFycmF5XHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgaXNPYmplY3QoZGVmKSkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgICdJbnZhbGlkIGRlZmF1bHQgdmFsdWUgZm9yIHByb3AgXCInICsga2V5ICsgJ1wiOiAnICtcclxuICAgICAgICAnUHJvcHMgd2l0aCB0eXBlIE9iamVjdC9BcnJheSBtdXN0IHVzZSBhIGZhY3RvcnkgZnVuY3Rpb24gJyArXHJcbiAgICAgICAgJ3RvIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZS4nLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgcmF3IHByb3AgdmFsdWUgd2FzIGFsc28gdW5kZWZpbmVkIGZyb20gcHJldmlvdXMgcmVuZGVyLFxyXG4gICAgLy8gcmV0dXJuIHByZXZpb3VzIGRlZmF1bHQgdmFsdWUgdG8gYXZvaWQgdW5uZWNlc3Nhcnkgd2F0Y2hlciB0cmlnZ2VyXHJcbiAgICBpZiAodm0gJiYgdm0uJG9wdGlvbnMucHJvcHNEYXRhICYmXHJcbiAgICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YVtrZXldID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgdm0uX3Byb3BzW2tleV0gIT09IHVuZGVmaW5lZFxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiB2bS5fcHJvcHNba2V5XVxyXG4gICAgfVxyXG4gICAgLy8gY2FsbCBmYWN0b3J5IGZ1bmN0aW9uIGZvciBub24tRnVuY3Rpb24gdHlwZXNcclxuICAgIC8vIGEgdmFsdWUgaXMgRnVuY3Rpb24gaWYgaXRzIHByb3RvdHlwZSBpcyBmdW5jdGlvbiBldmVuIGFjcm9zcyBkaWZmZXJlbnQgZXhlY3V0aW9uIGNvbnRleHRcclxuICAgIHJldHVybiB0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nICYmIGdldFR5cGUocHJvcC50eXBlKSAhPT0gJ0Z1bmN0aW9uJ1xyXG4gICAgICA/IGRlZi5jYWxsKHZtKVxyXG4gICAgICA6IGRlZlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXNzZXJ0IHdoZXRoZXIgYSBwcm9wIGlzIHZhbGlkLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzc2VydFByb3AoXHJcbiAgICBwcm9wLFxyXG4gICAgbmFtZSxcclxuICAgIHZhbHVlLFxyXG4gICAgdm0sXHJcbiAgICBhYnNlbnRcclxuICApIHtcclxuICAgIGlmIChwcm9wLnJlcXVpcmVkICYmIGFic2VudCkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgICdNaXNzaW5nIHJlcXVpcmVkIHByb3A6IFwiJyArIG5hbWUgKyAnXCInLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlID09IG51bGwgJiYgIXByb3AucmVxdWlyZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgdHlwZSA9IHByb3AudHlwZTtcclxuICAgIHZhciB2YWxpZCA9ICF0eXBlIHx8IHR5cGUgPT09IHRydWU7XHJcbiAgICB2YXIgZXhwZWN0ZWRUeXBlcyA9IFtdO1xyXG4gICAgaWYgKHR5cGUpIHtcclxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHR5cGUpKSB7XHJcbiAgICAgICAgdHlwZSA9IFt0eXBlXTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGUubGVuZ3RoICYmICF2YWxpZDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGFzc2VydGVkVHlwZSA9IGFzc2VydFR5cGUodmFsdWUsIHR5cGVbaV0pO1xyXG4gICAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChhc3NlcnRlZFR5cGUuZXhwZWN0ZWRUeXBlIHx8ICcnKTtcclxuICAgICAgICB2YWxpZCA9IGFzc2VydGVkVHlwZS52YWxpZDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCF2YWxpZCkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiSW52YWxpZCBwcm9wOiB0eXBlIGNoZWNrIGZhaWxlZCBmb3IgcHJvcCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiLlwiICtcclxuICAgICAgICBcIiBFeHBlY3RlZCBcIiArIChleHBlY3RlZFR5cGVzLm1hcChjYXBpdGFsaXplKS5qb2luKCcsICcpKSArXHJcbiAgICAgICAgXCIsIGdvdCBcIiArICh0b1Jhd1R5cGUodmFsdWUpKSArIFwiLlwiLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdmFyIHZhbGlkYXRvciA9IHByb3AudmFsaWRhdG9yO1xyXG4gICAgaWYgKHZhbGlkYXRvcikge1xyXG4gICAgICBpZiAoIXZhbGlkYXRvcih2YWx1ZSkpIHtcclxuICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgJ0ludmFsaWQgcHJvcDogY3VzdG9tIHZhbGlkYXRvciBjaGVjayBmYWlsZWQgZm9yIHByb3AgXCInICsgbmFtZSArICdcIi4nLFxyXG4gICAgICAgICAgdm1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgc2ltcGxlQ2hlY2tSRSA9IC9eKFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbnxGdW5jdGlvbnxTeW1ib2wpJC87XHJcblxyXG4gIGZ1bmN0aW9uIGFzc2VydFR5cGUodmFsdWUsIHR5cGUpIHtcclxuICAgIHZhciB2YWxpZDtcclxuICAgIHZhciBleHBlY3RlZFR5cGUgPSBnZXRUeXBlKHR5cGUpO1xyXG4gICAgaWYgKHNpbXBsZUNoZWNrUkUudGVzdChleHBlY3RlZFR5cGUpKSB7XHJcbiAgICAgIHZhciB0ID0gdHlwZW9mIHZhbHVlO1xyXG4gICAgICB2YWxpZCA9IHQgPT09IGV4cGVjdGVkVHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAvLyBmb3IgcHJpbWl0aXZlIHdyYXBwZXIgb2JqZWN0c1xyXG4gICAgICBpZiAoIXZhbGlkICYmIHQgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdmFsaWQgPSB2YWx1ZSBpbnN0YW5jZW9mIHR5cGU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSAnT2JqZWN0Jykge1xyXG4gICAgICB2YWxpZCA9IGlzUGxhaW5PYmplY3QodmFsdWUpO1xyXG4gICAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdBcnJheScpIHtcclxuICAgICAgdmFsaWQgPSBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWQ6IHZhbGlkLFxyXG4gICAgICBleHBlY3RlZFR5cGU6IGV4cGVjdGVkVHlwZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXNlIGZ1bmN0aW9uIHN0cmluZyBuYW1lIHRvIGNoZWNrIGJ1aWx0LWluIHR5cGVzLFxyXG4gICAqIGJlY2F1c2UgYSBzaW1wbGUgZXF1YWxpdHkgY2hlY2sgd2lsbCBmYWlsIHdoZW4gcnVubmluZ1xyXG4gICAqIGFjcm9zcyBkaWZmZXJlbnQgdm1zIC8gaWZyYW1lcy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRUeXBlKGZuKSB7XHJcbiAgICB2YXIgbWF0Y2ggPSBmbiAmJiBmbi50b1N0cmluZygpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChcXHcrKS8pO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNTYW1lVHlwZShhLCBiKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShhKSA9PT0gZ2V0VHlwZShiKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VHlwZUluZGV4KHR5cGUsIGV4cGVjdGVkVHlwZXMpIHtcclxuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFR5cGVzKSkge1xyXG4gICAgICByZXR1cm4gaXNTYW1lVHlwZShleHBlY3RlZFR5cGVzLCB0eXBlKSA/IDAgOiAtMVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV4cGVjdGVkVHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgaWYgKGlzU2FtZVR5cGUoZXhwZWN0ZWRUeXBlc1tpXSwgdHlwZSkpIHtcclxuICAgICAgICByZXR1cm4gaVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTFcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnIsIHZtLCBpbmZvKSB7XHJcbiAgICBpZiAodm0pIHtcclxuICAgICAgdmFyIGN1ciA9IHZtO1xyXG4gICAgICB3aGlsZSAoKGN1ciA9IGN1ci4kcGFyZW50KSkge1xyXG4gICAgICAgIHZhciBob29rcyA9IGN1ci4kb3B0aW9ucy5lcnJvckNhcHR1cmVkO1xyXG4gICAgICAgIGlmIChob29rcykge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIHZhciBjYXB0dXJlID0gaG9va3NbaV0uY2FsbChjdXIsIGVyciwgdm0sIGluZm8pID09PSBmYWxzZTtcclxuICAgICAgICAgICAgICBpZiAoY2FwdHVyZSkgeyByZXR1cm4gfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgZ2xvYmFsSGFuZGxlRXJyb3IoZSwgY3VyLCAnZXJyb3JDYXB0dXJlZCBob29rJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGdsb2JhbEhhbmRsZUVycm9yKGVyciwgdm0sIGluZm8pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2xvYmFsSGFuZGxlRXJyb3IoZXJyLCB2bSwgaW5mbykge1xyXG4gICAgaWYgKGNvbmZpZy5lcnJvckhhbmRsZXIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY29uZmlnLmVycm9ySGFuZGxlci5jYWxsKG51bGwsIGVyciwgdm0sIGluZm8pXHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2dFcnJvcihlLCBudWxsLCAnY29uZmlnLmVycm9ySGFuZGxlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsb2dFcnJvcihlcnIsIHZtLCBpbmZvKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvZ0Vycm9yKGVyciwgdm0sIGluZm8pIHtcclxuICAgIHtcclxuICAgICAgd2FybigoXCJFcnJvciBpbiBcIiArIGluZm8gKyBcIjogXFxcIlwiICsgKGVyci50b1N0cmluZygpKSArIFwiXFxcIlwiKSwgdm0pO1xyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmICgoaW5Ccm93c2VyIHx8IGluV2VleCkgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IGVyclxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcbiAgLyogZ2xvYmFscyBNZXNzYWdlQ2hhbm5lbCAqL1xyXG5cclxuICB2YXIgY2FsbGJhY2tzID0gW107XHJcbiAgdmFyIHBlbmRpbmcgPSBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gZmx1c2hDYWxsYmFja3MoKSB7XHJcbiAgICBwZW5kaW5nID0gZmFsc2U7XHJcbiAgICB2YXIgY29waWVzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgY2FsbGJhY2tzLmxlbmd0aCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb3BpZXNbaV0oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEhlcmUgd2UgaGF2ZSBhc3luYyBkZWZlcnJpbmcgd3JhcHBlcnMgdXNpbmcgYm90aCBtaWNyb3Rhc2tzIGFuZCAobWFjcm8pIHRhc2tzLlxyXG4gIC8vIEluIDwgMi40IHdlIHVzZWQgbWljcm90YXNrcyBldmVyeXdoZXJlLCBidXQgdGhlcmUgYXJlIHNvbWUgc2NlbmFyaW9zIHdoZXJlXHJcbiAgLy8gbWljcm90YXNrcyBoYXZlIHRvbyBoaWdoIGEgcHJpb3JpdHkgYW5kIGZpcmUgaW4gYmV0d2VlbiBzdXBwb3NlZGx5XHJcbiAgLy8gc2VxdWVudGlhbCBldmVudHMgKGUuZy4gIzQ1MjEsICM2NjkwKSBvciBldmVuIGJldHdlZW4gYnViYmxpbmcgb2YgdGhlIHNhbWVcclxuICAvLyBldmVudCAoIzY1NjYpLiBIb3dldmVyLCB1c2luZyAobWFjcm8pIHRhc2tzIGV2ZXJ5d2hlcmUgYWxzbyBoYXMgc3VidGxlIHByb2JsZW1zXHJcbiAgLy8gd2hlbiBzdGF0ZSBpcyBjaGFuZ2VkIHJpZ2h0IGJlZm9yZSByZXBhaW50IChlLmcuICM2ODEzLCBvdXQtaW4gdHJhbnNpdGlvbnMpLlxyXG4gIC8vIEhlcmUgd2UgdXNlIG1pY3JvdGFzayBieSBkZWZhdWx0LCBidXQgZXhwb3NlIGEgd2F5IHRvIGZvcmNlIChtYWNybykgdGFzayB3aGVuXHJcbiAgLy8gbmVlZGVkIChlLmcuIGluIGV2ZW50IGhhbmRsZXJzIGF0dGFjaGVkIGJ5IHYtb24pLlxyXG4gIHZhciBtaWNyb1RpbWVyRnVuYztcclxuICB2YXIgbWFjcm9UaW1lckZ1bmM7XHJcbiAgdmFyIHVzZU1hY3JvVGFzayA9IGZhbHNlO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgKG1hY3JvKSB0YXNrIGRlZmVyIGltcGxlbWVudGF0aW9uLlxyXG4gIC8vIFRlY2huaWNhbGx5IHNldEltbWVkaWF0ZSBzaG91bGQgYmUgdGhlIGlkZWFsIGNob2ljZSwgYnV0IGl0J3Mgb25seSBhdmFpbGFibGVcclxuICAvLyBpbiBJRS4gVGhlIG9ubHkgcG9seWZpbGwgdGhhdCBjb25zaXN0ZW50bHkgcXVldWVzIHRoZSBjYWxsYmFjayBhZnRlciBhbGwgRE9NXHJcbiAgLy8gZXZlbnRzIHRyaWdnZXJlZCBpbiB0aGUgc2FtZSBsb29wIGlzIGJ5IHVzaW5nIE1lc3NhZ2VDaGFubmVsLlxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmICh0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShzZXRJbW1lZGlhdGUpKSB7XHJcbiAgICBtYWNyb1RpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2V0SW1tZWRpYXRlKGZsdXNoQ2FsbGJhY2tzKTtcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnICYmIChcclxuICAgIGlzTmF0aXZlKE1lc3NhZ2VDaGFubmVsKSB8fFxyXG4gICAgLy8gUGhhbnRvbUpTXHJcbiAgICBNZXNzYWdlQ2hhbm5lbC50b1N0cmluZygpID09PSAnW29iamVjdCBNZXNzYWdlQ2hhbm5lbENvbnN0cnVjdG9yXSdcclxuICApKSB7XHJcbiAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xyXG4gICAgdmFyIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xyXG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaENhbGxiYWNrcztcclxuICAgIG1hY3JvVGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKDEpO1xyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIG1hY3JvVGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZXRUaW1lb3V0KGZsdXNoQ2FsbGJhY2tzLCAwKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgbWljcm90YXNrIGRlZmVyIGltcGxlbWVudGF0aW9uLlxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0LCAkZmxvdy1kaXNhYmxlLWxpbmUgKi9cclxuICBpZiAodHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFByb21pc2UpKSB7XHJcbiAgICB2YXIgcCA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgbWljcm9UaW1lckZ1bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHAudGhlbihmbHVzaENhbGxiYWNrcyk7XHJcbiAgICAgIC8vIGluIHByb2JsZW1hdGljIFVJV2ViVmlld3MsIFByb21pc2UudGhlbiBkb2Vzbid0IGNvbXBsZXRlbHkgYnJlYWssIGJ1dFxyXG4gICAgICAvLyBpdCBjYW4gZ2V0IHN0dWNrIGluIGEgd2VpcmQgc3RhdGUgd2hlcmUgY2FsbGJhY2tzIGFyZSBwdXNoZWQgaW50byB0aGVcclxuICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJ1dCB0aGUgcXVldWUgaXNuJ3QgYmVpbmcgZmx1c2hlZCwgdW50aWwgdGhlIGJyb3dzZXJcclxuICAgICAgLy8gbmVlZHMgdG8gZG8gc29tZSBvdGhlciB3b3JrLCBlLmcuIGhhbmRsZSBhIHRpbWVyLiBUaGVyZWZvcmUgd2UgY2FuXHJcbiAgICAgIC8vIFwiZm9yY2VcIiB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGZsdXNoZWQgYnkgYWRkaW5nIGFuIGVtcHR5IHRpbWVyLlxyXG4gICAgICBpZiAoaXNJT1MpIHsgc2V0VGltZW91dChub29wKTsgfVxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gZmFsbGJhY2sgdG8gbWFjcm9cclxuICAgIG1pY3JvVGltZXJGdW5jID0gbWFjcm9UaW1lckZ1bmM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcmFwIGEgZnVuY3Rpb24gc28gdGhhdCBpZiBhbnkgY29kZSBpbnNpZGUgdHJpZ2dlcnMgc3RhdGUgY2hhbmdlLFxyXG4gICAqIHRoZSBjaGFuZ2VzIGFyZSBxdWV1ZWQgdXNpbmcgYSAobWFjcm8pIHRhc2sgaW5zdGVhZCBvZiBhIG1pY3JvdGFzay5cclxuICAgKi9cclxuICBmdW5jdGlvbiB3aXRoTWFjcm9UYXNrKGZuKSB7XHJcbiAgICByZXR1cm4gZm4uX3dpdGhUYXNrIHx8IChmbi5fd2l0aFRhc2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHVzZU1hY3JvVGFzayA9IHRydWU7XHJcbiAgICAgIHZhciByZXMgPSBmbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG4gICAgICB1c2VNYWNyb1Rhc2sgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5leHRUaWNrKGNiLCBjdHgpIHtcclxuICAgIHZhciBfcmVzb2x2ZTtcclxuICAgIGNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNiLmNhbGwoY3R4KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICBoYW5kbGVFcnJvcihlLCBjdHgsICduZXh0VGljaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChfcmVzb2x2ZSkge1xyXG4gICAgICAgIF9yZXNvbHZlKGN0eCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKCFwZW5kaW5nKSB7XHJcbiAgICAgIHBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICBpZiAodXNlTWFjcm9UYXNrKSB7XHJcbiAgICAgICAgbWFjcm9UaW1lckZ1bmMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtaWNyb1RpbWVyRnVuYygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAkZmxvdy1kaXNhYmxlLWxpbmVcclxuICAgIGlmICghY2IgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgbWFyaztcclxuICB2YXIgbWVhc3VyZTtcclxuXHJcbiAge1xyXG4gICAgdmFyIHBlcmYgPSBpbkJyb3dzZXIgJiYgd2luZG93LnBlcmZvcm1hbmNlO1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoXHJcbiAgICAgIHBlcmYgJiZcclxuICAgICAgcGVyZi5tYXJrICYmXHJcbiAgICAgIHBlcmYubWVhc3VyZSAmJlxyXG4gICAgICBwZXJmLmNsZWFyTWFya3MgJiZcclxuICAgICAgcGVyZi5jbGVhck1lYXN1cmVzXHJcbiAgICApIHtcclxuICAgICAgbWFyayA9IGZ1bmN0aW9uICh0YWcpIHsgcmV0dXJuIHBlcmYubWFyayh0YWcpOyB9O1xyXG4gICAgICBtZWFzdXJlID0gZnVuY3Rpb24gKG5hbWUsIHN0YXJ0VGFnLCBlbmRUYWcpIHtcclxuICAgICAgICBwZXJmLm1lYXN1cmUobmFtZSwgc3RhcnRUYWcsIGVuZFRhZyk7XHJcbiAgICAgICAgcGVyZi5jbGVhck1hcmtzKHN0YXJ0VGFnKTtcclxuICAgICAgICBwZXJmLmNsZWFyTWFya3MoZW5kVGFnKTtcclxuICAgICAgICBwZXJmLmNsZWFyTWVhc3VyZXMobmFtZSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGggUHJveHkgKi9cclxuXHJcbiAgdmFyIGluaXRQcm94eTtcclxuXHJcbiAge1xyXG4gICAgdmFyIGFsbG93ZWRHbG9iYWxzID0gbWFrZU1hcChcclxuICAgICAgJ0luZmluaXR5LHVuZGVmaW5lZCxOYU4saXNGaW5pdGUsaXNOYU4sJyArXHJcbiAgICAgICdwYXJzZUZsb2F0LHBhcnNlSW50LGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLGVuY29kZVVSSUNvbXBvbmVudCwnICtcclxuICAgICAgJ01hdGgsTnVtYmVyLERhdGUsQXJyYXksT2JqZWN0LEJvb2xlYW4sU3RyaW5nLFJlZ0V4cCxNYXAsU2V0LEpTT04sSW50bCwnICtcclxuICAgICAgJ3JlcXVpcmUnIC8vIGZvciBXZWJwYWNrL0Jyb3dzZXJpZnlcclxuICAgICk7XHJcblxyXG4gICAgdmFyIHdhcm5Ob25QcmVzZW50ID0gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7XHJcbiAgICAgIHdhcm4oXHJcbiAgICAgICAgXCJQcm9wZXJ0eSBvciBtZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIG5vdCBkZWZpbmVkIG9uIHRoZSBpbnN0YW5jZSBidXQgXCIgK1xyXG4gICAgICAgICdyZWZlcmVuY2VkIGR1cmluZyByZW5kZXIuIE1ha2Ugc3VyZSB0aGF0IHRoaXMgcHJvcGVydHkgaXMgcmVhY3RpdmUsICcgK1xyXG4gICAgICAgICdlaXRoZXIgaW4gdGhlIGRhdGEgb3B0aW9uLCBvciBmb3IgY2xhc3MtYmFzZWQgY29tcG9uZW50cywgYnkgJyArXHJcbiAgICAgICAgJ2luaXRpYWxpemluZyB0aGUgcHJvcGVydHkuICcgK1xyXG4gICAgICAgICdTZWU6IGh0dHBzOi8vdnVlanMub3JnL3YyL2d1aWRlL3JlYWN0aXZpdHkuaHRtbCNEZWNsYXJpbmctUmVhY3RpdmUtUHJvcGVydGllcy4nLFxyXG4gICAgICAgIHRhcmdldFxyXG4gICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgaGFzUHJveHkgPVxyXG4gICAgICB0eXBlb2YgUHJveHkgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFByb3h5KTtcclxuXHJcbiAgICBpZiAoaGFzUHJveHkpIHtcclxuICAgICAgdmFyIGlzQnVpbHRJbk1vZGlmaWVyID0gbWFrZU1hcCgnc3RvcCxwcmV2ZW50LHNlbGYsY3RybCxzaGlmdCxhbHQsbWV0YSxleGFjdCcpO1xyXG4gICAgICBjb25maWcua2V5Q29kZXMgPSBuZXcgUHJveHkoY29uZmlnLmtleUNvZGVzLCB7XHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodGFyZ2V0LCBrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAoaXNCdWlsdEluTW9kaWZpZXIoa2V5KSkge1xyXG4gICAgICAgICAgICB3YXJuKChcIkF2b2lkIG92ZXJ3cml0aW5nIGJ1aWx0LWluIG1vZGlmaWVyIGluIGNvbmZpZy5rZXlDb2RlczogLlwiICsga2V5KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNIYW5kbGVyID0ge1xyXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyh0YXJnZXQsIGtleSkge1xyXG4gICAgICAgIHZhciBoYXMgPSBrZXkgaW4gdGFyZ2V0O1xyXG4gICAgICAgIHZhciBpc0FsbG93ZWQgPSBhbGxvd2VkR2xvYmFscyhrZXkpIHx8IGtleS5jaGFyQXQoMCkgPT09ICdfJztcclxuICAgICAgICBpZiAoIWhhcyAmJiAhaXNBbGxvd2VkKSB7XHJcbiAgICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYXMgfHwgIWlzQWxsb3dlZFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBnZXRIYW5kbGVyID0ge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIGtleSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiAhKGtleSBpbiB0YXJnZXQpKSB7XHJcbiAgICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRba2V5XVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXRQcm94eSA9IGZ1bmN0aW9uIGluaXRQcm94eSh2bSkge1xyXG4gICAgICBpZiAoaGFzUHJveHkpIHtcclxuICAgICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcHJveHkgaGFuZGxlciB0byB1c2VcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHZtLiRvcHRpb25zO1xyXG4gICAgICAgIHZhciBoYW5kbGVycyA9IG9wdGlvbnMucmVuZGVyICYmIG9wdGlvbnMucmVuZGVyLl93aXRoU3RyaXBwZWRcclxuICAgICAgICAgID8gZ2V0SGFuZGxlclxyXG4gICAgICAgICAgOiBoYXNIYW5kbGVyO1xyXG4gICAgICAgIHZtLl9yZW5kZXJQcm94eSA9IG5ldyBQcm94eSh2bSwgaGFuZGxlcnMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZtLl9yZW5kZXJQcm94eSA9IHZtO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBzZWVuT2JqZWN0cyA9IG5ldyBfU2V0KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIGFuIG9iamVjdCB0byBldm9rZSBhbGwgY29udmVydGVkXHJcbiAgICogZ2V0dGVycywgc28gdGhhdCBldmVyeSBuZXN0ZWQgcHJvcGVydHkgaW5zaWRlIHRoZSBvYmplY3RcclxuICAgKiBpcyBjb2xsZWN0ZWQgYXMgYSBcImRlZXBcIiBkZXBlbmRlbmN5LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRyYXZlcnNlKHZhbCkge1xyXG4gICAgX3RyYXZlcnNlKHZhbCwgc2Vlbk9iamVjdHMpO1xyXG4gICAgc2Vlbk9iamVjdHMuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90cmF2ZXJzZSh2YWwsIHNlZW4pIHtcclxuICAgIHZhciBpLCBrZXlzO1xyXG4gICAgdmFyIGlzQSA9IEFycmF5LmlzQXJyYXkodmFsKTtcclxuICAgIGlmICgoIWlzQSAmJiAhaXNPYmplY3QodmFsKSkgfHwgT2JqZWN0LmlzRnJvemVuKHZhbCkgfHwgdmFsIGluc3RhbmNlb2YgVk5vZGUpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpZiAodmFsLl9fb2JfXykge1xyXG4gICAgICB2YXIgZGVwSWQgPSB2YWwuX19vYl9fLmRlcC5pZDtcclxuICAgICAgaWYgKHNlZW4uaGFzKGRlcElkKSkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHNlZW4uYWRkKGRlcElkKTtcclxuICAgIH1cclxuICAgIGlmIChpc0EpIHtcclxuICAgICAgaSA9IHZhbC5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtpXSwgc2Vlbik7IH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyh2YWwpO1xyXG4gICAgICBpID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtrZXlzW2ldXSwgc2Vlbik7IH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgbm9ybWFsaXplRXZlbnQgPSBjYWNoZWQoZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgIHZhciBwYXNzaXZlID0gbmFtZS5jaGFyQXQoMCkgPT09ICcmJztcclxuICAgIG5hbWUgPSBwYXNzaXZlID8gbmFtZS5zbGljZSgxKSA6IG5hbWU7XHJcbiAgICB2YXIgb25jZSQkMSA9IG5hbWUuY2hhckF0KDApID09PSAnfic7IC8vIFByZWZpeGVkIGxhc3QsIGNoZWNrZWQgZmlyc3RcclxuICAgIG5hbWUgPSBvbmNlJCQxID8gbmFtZS5zbGljZSgxKSA6IG5hbWU7XHJcbiAgICB2YXIgY2FwdHVyZSA9IG5hbWUuY2hhckF0KDApID09PSAnISc7XHJcbiAgICBuYW1lID0gY2FwdHVyZSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgb25jZTogb25jZSQkMSxcclxuICAgICAgY2FwdHVyZTogY2FwdHVyZSxcclxuICAgICAgcGFzc2l2ZTogcGFzc2l2ZVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVGbkludm9rZXIoZm5zKSB7XHJcbiAgICBmdW5jdGlvbiBpbnZva2VyKCkge1xyXG4gICAgICB2YXIgYXJndW1lbnRzJDEgPSBhcmd1bWVudHM7XHJcblxyXG4gICAgICB2YXIgZm5zID0gaW52b2tlci5mbnM7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGZucykpIHtcclxuICAgICAgICB2YXIgY2xvbmVkID0gZm5zLnNsaWNlKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbG9uZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGNsb25lZFtpXS5hcHBseShudWxsLCBhcmd1bWVudHMkMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHJldHVybiBoYW5kbGVyIHJldHVybiB2YWx1ZSBmb3Igc2luZ2xlIGhhbmRsZXJzXHJcbiAgICAgICAgcmV0dXJuIGZucy5hcHBseShudWxsLCBhcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGludm9rZXIuZm5zID0gZm5zO1xyXG4gICAgcmV0dXJuIGludm9rZXJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpc3RlbmVycyhcclxuICAgIG9uLFxyXG4gICAgb2xkT24sXHJcbiAgICBhZGQsXHJcbiAgICByZW1vdmUkJDEsXHJcbiAgICB2bVxyXG4gICkge1xyXG4gICAgdmFyIG5hbWUsIGRlZiwgY3VyLCBvbGQsIGV2ZW50O1xyXG4gICAgZm9yIChuYW1lIGluIG9uKSB7XHJcbiAgICAgIGRlZiA9IGN1ciA9IG9uW25hbWVdO1xyXG4gICAgICBvbGQgPSBvbGRPbltuYW1lXTtcclxuICAgICAgZXZlbnQgPSBub3JtYWxpemVFdmVudChuYW1lKTtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmIChpc1VuZGVmKGN1cikpIHtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICAgXCJJbnZhbGlkIGhhbmRsZXIgZm9yIGV2ZW50IFxcXCJcIiArIChldmVudC5uYW1lKSArIFwiXFxcIjogZ290IFwiICsgU3RyaW5nKGN1ciksXHJcbiAgICAgICAgICB2bVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNVbmRlZihvbGQpKSB7XHJcbiAgICAgICAgaWYgKGlzVW5kZWYoY3VyLmZucykpIHtcclxuICAgICAgICAgIGN1ciA9IG9uW25hbWVdID0gY3JlYXRlRm5JbnZva2VyKGN1cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZChldmVudC5uYW1lLCBjdXIsIGV2ZW50Lm9uY2UsIGV2ZW50LmNhcHR1cmUsIGV2ZW50LnBhc3NpdmUsIGV2ZW50LnBhcmFtcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VyICE9PSBvbGQpIHtcclxuICAgICAgICBvbGQuZm5zID0gY3VyO1xyXG4gICAgICAgIG9uW25hbWVdID0gb2xkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKG5hbWUgaW4gb2xkT24pIHtcclxuICAgICAgaWYgKGlzVW5kZWYob25bbmFtZV0pKSB7XHJcbiAgICAgICAgZXZlbnQgPSBub3JtYWxpemVFdmVudChuYW1lKTtcclxuICAgICAgICByZW1vdmUkJDEoZXZlbnQubmFtZSwgb2xkT25bbmFtZV0sIGV2ZW50LmNhcHR1cmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gbWVyZ2VWTm9kZUhvb2soZGVmLCBob29rS2V5LCBob29rKSB7XHJcbiAgICBpZiAoZGVmIGluc3RhbmNlb2YgVk5vZGUpIHtcclxuICAgICAgZGVmID0gZGVmLmRhdGEuaG9vayB8fCAoZGVmLmRhdGEuaG9vayA9IHt9KTtcclxuICAgIH1cclxuICAgIHZhciBpbnZva2VyO1xyXG4gICAgdmFyIG9sZEhvb2sgPSBkZWZbaG9va0tleV07XHJcblxyXG4gICAgZnVuY3Rpb24gd3JhcHBlZEhvb2soKSB7XHJcbiAgICAgIGhvb2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgLy8gaW1wb3J0YW50OiByZW1vdmUgbWVyZ2VkIGhvb2sgdG8gZW5zdXJlIGl0J3MgY2FsbGVkIG9ubHkgb25jZVxyXG4gICAgICAvLyBhbmQgcHJldmVudCBtZW1vcnkgbGVha1xyXG4gICAgICByZW1vdmUoaW52b2tlci5mbnMsIHdyYXBwZWRIb29rKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNVbmRlZihvbGRIb29rKSkge1xyXG4gICAgICAvLyBubyBleGlzdGluZyBob29rXHJcbiAgICAgIGludm9rZXIgPSBjcmVhdGVGbkludm9rZXIoW3dyYXBwZWRIb29rXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGlzRGVmKG9sZEhvb2suZm5zKSAmJiBpc1RydWUob2xkSG9vay5tZXJnZWQpKSB7XHJcbiAgICAgICAgLy8gYWxyZWFkeSBhIG1lcmdlZCBpbnZva2VyXHJcbiAgICAgICAgaW52b2tlciA9IG9sZEhvb2s7XHJcbiAgICAgICAgaW52b2tlci5mbnMucHVzaCh3cmFwcGVkSG9vayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gZXhpc3RpbmcgcGxhaW4gaG9va1xyXG4gICAgICAgIGludm9rZXIgPSBjcmVhdGVGbkludm9rZXIoW29sZEhvb2ssIHdyYXBwZWRIb29rXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbnZva2VyLm1lcmdlZCA9IHRydWU7XHJcbiAgICBkZWZbaG9va0tleV0gPSBpbnZva2VyO1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGV4dHJhY3RQcm9wc0Zyb21WTm9kZURhdGEoXHJcbiAgICBkYXRhLFxyXG4gICAgQ3RvcixcclxuICAgIHRhZ1xyXG4gICkge1xyXG4gICAgLy8gd2UgYXJlIG9ubHkgZXh0cmFjdGluZyByYXcgdmFsdWVzIGhlcmUuXHJcbiAgICAvLyB2YWxpZGF0aW9uIGFuZCBkZWZhdWx0IHZhbHVlcyBhcmUgaGFuZGxlZCBpbiB0aGUgY2hpbGRcclxuICAgIC8vIGNvbXBvbmVudCBpdHNlbGYuXHJcbiAgICB2YXIgcHJvcE9wdGlvbnMgPSBDdG9yLm9wdGlvbnMucHJvcHM7XHJcbiAgICBpZiAoaXNVbmRlZihwcm9wT3B0aW9ucykpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgcmVzID0ge307XHJcbiAgICB2YXIgYXR0cnMgPSBkYXRhLmF0dHJzO1xyXG4gICAgdmFyIHByb3BzID0gZGF0YS5wcm9wcztcclxuICAgIGlmIChpc0RlZihhdHRycykgfHwgaXNEZWYocHJvcHMpKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBhbHRLZXkgPSBoeXBoZW5hdGUoa2V5KTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YXIga2V5SW5Mb3dlckNhc2UgPSBrZXkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAga2V5ICE9PSBrZXlJbkxvd2VyQ2FzZSAmJlxyXG4gICAgICAgICAgICBhdHRycyAmJiBoYXNPd24oYXR0cnMsIGtleUluTG93ZXJDYXNlKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRpcChcclxuICAgICAgICAgICAgICBcIlByb3AgXFxcIlwiICsga2V5SW5Mb3dlckNhc2UgKyBcIlxcXCIgaXMgcGFzc2VkIHRvIGNvbXBvbmVudCBcIiArXHJcbiAgICAgICAgICAgICAgKGZvcm1hdENvbXBvbmVudE5hbWUodGFnIHx8IEN0b3IpKSArIFwiLCBidXQgdGhlIGRlY2xhcmVkIHByb3AgbmFtZSBpc1wiICtcclxuICAgICAgICAgICAgICBcIiBcXFwiXCIgKyBrZXkgKyBcIlxcXCIuIFwiICtcclxuICAgICAgICAgICAgICBcIk5vdGUgdGhhdCBIVE1MIGF0dHJpYnV0ZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgYW5kIGNhbWVsQ2FzZWQgXCIgK1xyXG4gICAgICAgICAgICAgIFwicHJvcHMgbmVlZCB0byB1c2UgdGhlaXIga2ViYWItY2FzZSBlcXVpdmFsZW50cyB3aGVuIHVzaW5nIGluLURPTSBcIiArXHJcbiAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZXMuIFlvdSBzaG91bGQgcHJvYmFibHkgdXNlIFxcXCJcIiArIGFsdEtleSArIFwiXFxcIiBpbnN0ZWFkIG9mIFxcXCJcIiArIGtleSArIFwiXFxcIi5cIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjaGVja1Byb3AocmVzLCBwcm9wcywga2V5LCBhbHRLZXksIHRydWUpIHx8XHJcbiAgICAgICAgICBjaGVja1Byb3AocmVzLCBhdHRycywga2V5LCBhbHRLZXksIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hlY2tQcm9wKFxyXG4gICAgcmVzLFxyXG4gICAgaGFzaCxcclxuICAgIGtleSxcclxuICAgIGFsdEtleSxcclxuICAgIHByZXNlcnZlXHJcbiAgKSB7XHJcbiAgICBpZiAoaXNEZWYoaGFzaCkpIHtcclxuICAgICAgaWYgKGhhc093bihoYXNoLCBrZXkpKSB7XHJcbiAgICAgICAgcmVzW2tleV0gPSBoYXNoW2tleV07XHJcbiAgICAgICAgaWYgKCFwcmVzZXJ2ZSkge1xyXG4gICAgICAgICAgZGVsZXRlIGhhc2hba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSBlbHNlIGlmIChoYXNPd24oaGFzaCwgYWx0S2V5KSkge1xyXG4gICAgICAgIHJlc1trZXldID0gaGFzaFthbHRLZXldO1xyXG4gICAgICAgIGlmICghcHJlc2VydmUpIHtcclxuICAgICAgICAgIGRlbGV0ZSBoYXNoW2FsdEtleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8vIFRoZSB0ZW1wbGF0ZSBjb21waWxlciBhdHRlbXB0cyB0byBtaW5pbWl6ZSB0aGUgbmVlZCBmb3Igbm9ybWFsaXphdGlvbiBieVxyXG4gIC8vIHN0YXRpY2FsbHkgYW5hbHl6aW5nIHRoZSB0ZW1wbGF0ZSBhdCBjb21waWxlIHRpbWUuXHJcbiAgLy9cclxuICAvLyBGb3IgcGxhaW4gSFRNTCBtYXJrdXAsIG5vcm1hbGl6YXRpb24gY2FuIGJlIGNvbXBsZXRlbHkgc2tpcHBlZCBiZWNhdXNlIHRoZVxyXG4gIC8vIGdlbmVyYXRlZCByZW5kZXIgZnVuY3Rpb24gaXMgZ3VhcmFudGVlZCB0byByZXR1cm4gQXJyYXk8Vk5vZGU+LiBUaGVyZSBhcmVcclxuICAvLyB0d28gY2FzZXMgd2hlcmUgZXh0cmEgbm9ybWFsaXphdGlvbiBpcyBuZWVkZWQ6XHJcblxyXG4gIC8vIDEuIFdoZW4gdGhlIGNoaWxkcmVuIGNvbnRhaW5zIGNvbXBvbmVudHMgLSBiZWNhdXNlIGEgZnVuY3Rpb25hbCBjb21wb25lbnRcclxuICAvLyBtYXkgcmV0dXJuIGFuIEFycmF5IGluc3RlYWQgb2YgYSBzaW5nbGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBqdXN0IGEgc2ltcGxlXHJcbiAgLy8gbm9ybWFsaXphdGlvbiBpcyBuZWVkZWQgLSBpZiBhbnkgY2hpbGQgaXMgYW4gQXJyYXksIHdlIGZsYXR0ZW4gdGhlIHdob2xlXHJcbiAgLy8gdGhpbmcgd2l0aCBBcnJheS5wcm90b3R5cGUuY29uY2F0LiBJdCBpcyBndWFyYW50ZWVkIHRvIGJlIG9ubHkgMS1sZXZlbCBkZWVwXHJcbiAgLy8gYmVjYXVzZSBmdW5jdGlvbmFsIGNvbXBvbmVudHMgYWxyZWFkeSBub3JtYWxpemUgdGhlaXIgb3duIGNoaWxkcmVuLlxyXG4gIGZ1bmN0aW9uIHNpbXBsZU5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuW2ldKSkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBjaGlsZHJlbilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuXHJcbiAgfVxyXG5cclxuICAvLyAyLiBXaGVuIHRoZSBjaGlsZHJlbiBjb250YWlucyBjb25zdHJ1Y3RzIHRoYXQgYWx3YXlzIGdlbmVyYXRlZCBuZXN0ZWQgQXJyYXlzLFxyXG4gIC8vIGUuZy4gPHRlbXBsYXRlPiwgPHNsb3Q+LCB2LWZvciwgb3Igd2hlbiB0aGUgY2hpbGRyZW4gaXMgcHJvdmlkZWQgYnkgdXNlclxyXG4gIC8vIHdpdGggaGFuZC13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMgLyBKU1guIEluIHN1Y2ggY2FzZXMgYSBmdWxsIG5vcm1hbGl6YXRpb25cclxuICAvLyBpcyBuZWVkZWQgdG8gY2F0ZXIgdG8gYWxsIHBvc3NpYmxlIHR5cGVzIG9mIGNoaWxkcmVuIHZhbHVlcy5cclxuICBmdW5jdGlvbiBub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbikge1xyXG4gICAgcmV0dXJuIGlzUHJpbWl0aXZlKGNoaWxkcmVuKVxyXG4gICAgICA/IFtjcmVhdGVUZXh0Vk5vZGUoY2hpbGRyZW4pXVxyXG4gICAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pXHJcbiAgICAgICAgPyBub3JtYWxpemVBcnJheUNoaWxkcmVuKGNoaWxkcmVuKVxyXG4gICAgICAgIDogdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1RleHROb2RlKG5vZGUpIHtcclxuICAgIHJldHVybiBpc0RlZihub2RlKSAmJiBpc0RlZihub2RlLnRleHQpICYmIGlzRmFsc2Uobm9kZS5pc0NvbW1lbnQpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVBcnJheUNoaWxkcmVuKGNoaWxkcmVuLCBuZXN0ZWRJbmRleCkge1xyXG4gICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgdmFyIGksIGMsIGxhc3RJbmRleCwgbGFzdDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjID0gY2hpbGRyZW5baV07XHJcbiAgICAgIGlmIChpc1VuZGVmKGMpIHx8IHR5cGVvZiBjID09PSAnYm9vbGVhbicpIHsgY29udGludWUgfVxyXG4gICAgICBsYXN0SW5kZXggPSByZXMubGVuZ3RoIC0gMTtcclxuICAgICAgbGFzdCA9IHJlc1tsYXN0SW5kZXhdO1xyXG4gICAgICAvLyAgbmVzdGVkXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGMpKSB7XHJcbiAgICAgICAgaWYgKGMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgYyA9IG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4oYywgKChuZXN0ZWRJbmRleCB8fCAnJykgKyBcIl9cIiArIGkpKTtcclxuICAgICAgICAgIC8vIG1lcmdlIGFkamFjZW50IHRleHQgbm9kZXNcclxuICAgICAgICAgIGlmIChpc1RleHROb2RlKGNbMF0pICYmIGlzVGV4dE5vZGUobGFzdCkpIHtcclxuICAgICAgICAgICAgcmVzW2xhc3RJbmRleF0gPSBjcmVhdGVUZXh0Vk5vZGUobGFzdC50ZXh0ICsgKGNbMF0pLnRleHQpO1xyXG4gICAgICAgICAgICBjLnNoaWZ0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXMucHVzaC5hcHBseShyZXMsIGMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChpc1ByaW1pdGl2ZShjKSkge1xyXG4gICAgICAgIGlmIChpc1RleHROb2RlKGxhc3QpKSB7XHJcbiAgICAgICAgICAvLyBtZXJnZSBhZGphY2VudCB0ZXh0IG5vZGVzXHJcbiAgICAgICAgICAvLyB0aGlzIGlzIG5lY2Vzc2FyeSBmb3IgU1NSIGh5ZHJhdGlvbiBiZWNhdXNlIHRleHQgbm9kZXMgYXJlXHJcbiAgICAgICAgICAvLyBlc3NlbnRpYWxseSBtZXJnZWQgd2hlbiByZW5kZXJlZCB0byBIVE1MIHN0cmluZ3NcclxuICAgICAgICAgIHJlc1tsYXN0SW5kZXhdID0gY3JlYXRlVGV4dFZOb2RlKGxhc3QudGV4dCArIGMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYyAhPT0gJycpIHtcclxuICAgICAgICAgIC8vIGNvbnZlcnQgcHJpbWl0aXZlIHRvIHZub2RlXHJcbiAgICAgICAgICByZXMucHVzaChjcmVhdGVUZXh0Vk5vZGUoYykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXNUZXh0Tm9kZShjKSAmJiBpc1RleHROb2RlKGxhc3QpKSB7XHJcbiAgICAgICAgICAvLyBtZXJnZSBhZGphY2VudCB0ZXh0IG5vZGVzXHJcbiAgICAgICAgICByZXNbbGFzdEluZGV4XSA9IGNyZWF0ZVRleHRWTm9kZShsYXN0LnRleHQgKyBjLnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBkZWZhdWx0IGtleSBmb3IgbmVzdGVkIGFycmF5IGNoaWxkcmVuIChsaWtlbHkgZ2VuZXJhdGVkIGJ5IHYtZm9yKVxyXG4gICAgICAgICAgaWYgKGlzVHJ1ZShjaGlsZHJlbi5faXNWTGlzdCkgJiZcclxuICAgICAgICAgICAgaXNEZWYoYy50YWcpICYmXHJcbiAgICAgICAgICAgIGlzVW5kZWYoYy5rZXkpICYmXHJcbiAgICAgICAgICAgIGlzRGVmKG5lc3RlZEluZGV4KSkge1xyXG4gICAgICAgICAgICBjLmtleSA9IFwiX192bGlzdFwiICsgbmVzdGVkSW5kZXggKyBcIl9cIiArIGkgKyBcIl9fXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXMucHVzaChjKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBlbnN1cmVDdG9yKGNvbXAsIGJhc2UpIHtcclxuICAgIGlmIChcclxuICAgICAgY29tcC5fX2VzTW9kdWxlIHx8XHJcbiAgICAgIChoYXNTeW1ib2wgJiYgY29tcFtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnTW9kdWxlJylcclxuICAgICkge1xyXG4gICAgICBjb21wID0gY29tcC5kZWZhdWx0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzT2JqZWN0KGNvbXApXHJcbiAgICAgID8gYmFzZS5leHRlbmQoY29tcClcclxuICAgICAgOiBjb21wXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVBc3luY1BsYWNlaG9sZGVyKFxyXG4gICAgZmFjdG9yeSxcclxuICAgIGRhdGEsXHJcbiAgICBjb250ZXh0LFxyXG4gICAgY2hpbGRyZW4sXHJcbiAgICB0YWdcclxuICApIHtcclxuICAgIHZhciBub2RlID0gY3JlYXRlRW1wdHlWTm9kZSgpO1xyXG4gICAgbm9kZS5hc3luY0ZhY3RvcnkgPSBmYWN0b3J5O1xyXG4gICAgbm9kZS5hc3luY01ldGEgPSB7IGRhdGE6IGRhdGEsIGNvbnRleHQ6IGNvbnRleHQsIGNoaWxkcmVuOiBjaGlsZHJlbiwgdGFnOiB0YWcgfTtcclxuICAgIHJldHVybiBub2RlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNvbHZlQXN5bmNDb21wb25lbnQoXHJcbiAgICBmYWN0b3J5LFxyXG4gICAgYmFzZUN0b3IsXHJcbiAgICBjb250ZXh0XHJcbiAgKSB7XHJcbiAgICBpZiAoaXNUcnVlKGZhY3RvcnkuZXJyb3IpICYmIGlzRGVmKGZhY3RvcnkuZXJyb3JDb21wKSkge1xyXG4gICAgICByZXR1cm4gZmFjdG9yeS5lcnJvckNvbXBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNEZWYoZmFjdG9yeS5yZXNvbHZlZCkpIHtcclxuICAgICAgcmV0dXJuIGZhY3RvcnkucmVzb2x2ZWRcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNUcnVlKGZhY3RvcnkubG9hZGluZykgJiYgaXNEZWYoZmFjdG9yeS5sb2FkaW5nQ29tcCkpIHtcclxuICAgICAgcmV0dXJuIGZhY3RvcnkubG9hZGluZ0NvbXBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNEZWYoZmFjdG9yeS5jb250ZXh0cykpIHtcclxuICAgICAgLy8gYWxyZWFkeSBwZW5kaW5nXHJcbiAgICAgIGZhY3RvcnkuY29udGV4dHMucHVzaChjb250ZXh0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBjb250ZXh0cyA9IGZhY3RvcnkuY29udGV4dHMgPSBbY29udGV4dF07XHJcbiAgICAgIHZhciBzeW5jID0gdHJ1ZTtcclxuXHJcbiAgICAgIHZhciBmb3JjZVJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNvbnRleHRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgY29udGV4dHNbaV0uJGZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIHJlc29sdmUgPSBvbmNlKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAvLyBjYWNoZSByZXNvbHZlZFxyXG4gICAgICAgIGZhY3RvcnkucmVzb2x2ZWQgPSBlbnN1cmVDdG9yKHJlcywgYmFzZUN0b3IpO1xyXG4gICAgICAgIC8vIGludm9rZSBjYWxsYmFja3Mgb25seSBpZiB0aGlzIGlzIG5vdCBhIHN5bmNocm9ub3VzIHJlc29sdmVcclxuICAgICAgICAvLyAoYXN5bmMgcmVzb2x2ZXMgYXJlIHNoaW1tZWQgYXMgc3luY2hyb25vdXMgZHVyaW5nIFNTUilcclxuICAgICAgICBpZiAoIXN5bmMpIHtcclxuICAgICAgICAgIGZvcmNlUmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciByZWplY3QgPSBvbmNlKGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICAgXCJGYWlsZWQgdG8gcmVzb2x2ZSBhc3luYyBjb21wb25lbnQ6IFwiICsgKFN0cmluZyhmYWN0b3J5KSkgK1xyXG4gICAgICAgICAgKHJlYXNvbiA/IChcIlxcblJlYXNvbjogXCIgKyByZWFzb24pIDogJycpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaXNEZWYoZmFjdG9yeS5lcnJvckNvbXApKSB7XHJcbiAgICAgICAgICBmYWN0b3J5LmVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgIGZvcmNlUmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciByZXMgPSBmYWN0b3J5KHJlc29sdmUsIHJlamVjdCk7XHJcblxyXG4gICAgICBpZiAoaXNPYmplY3QocmVzKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVzLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIC8vICgpID0+IFByb21pc2VcclxuICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpKSB7XHJcbiAgICAgICAgICAgIHJlcy50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZihyZXMuY29tcG9uZW50KSAmJiB0eXBlb2YgcmVzLmNvbXBvbmVudC50aGVuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICByZXMuY29tcG9uZW50LnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNEZWYocmVzLmVycm9yKSkge1xyXG4gICAgICAgICAgICBmYWN0b3J5LmVycm9yQ29tcCA9IGVuc3VyZUN0b3IocmVzLmVycm9yLCBiYXNlQ3Rvcik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzRGVmKHJlcy5sb2FkaW5nKSkge1xyXG4gICAgICAgICAgICBmYWN0b3J5LmxvYWRpbmdDb21wID0gZW5zdXJlQ3RvcihyZXMubG9hZGluZywgYmFzZUN0b3IpO1xyXG4gICAgICAgICAgICBpZiAocmVzLmRlbGF5ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgZmFjdG9yeS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpICYmIGlzVW5kZWYoZmFjdG9yeS5lcnJvcikpIHtcclxuICAgICAgICAgICAgICAgICAgZmFjdG9yeS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgZm9yY2VSZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LCByZXMuZGVsYXkgfHwgMjAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc0RlZihyZXMudGltZW91dCkpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWYoZmFjdG9yeS5yZXNvbHZlZCkpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChcclxuICAgICAgICAgICAgICAgICAgXCJ0aW1lb3V0IChcIiArIChyZXMudGltZW91dCkgKyBcIm1zKVwiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcmVzLnRpbWVvdXQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3luYyA9IGZhbHNlO1xyXG4gICAgICAvLyByZXR1cm4gaW4gY2FzZSByZXNvbHZlZCBzeW5jaHJvbm91c2x5XHJcbiAgICAgIHJldHVybiBmYWN0b3J5LmxvYWRpbmdcclxuICAgICAgICA/IGZhY3RvcnkubG9hZGluZ0NvbXBcclxuICAgICAgICA6IGZhY3RvcnkucmVzb2x2ZWRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBpc0FzeW5jUGxhY2Vob2xkZXIobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUuaXNDb21tZW50ICYmIG5vZGUuYXN5bmNGYWN0b3J5XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Rmlyc3RDb21wb25lbnRDaGlsZChjaGlsZHJlbikge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYyA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChpc0RlZihjKSAmJiAoaXNEZWYoYy5jb21wb25lbnRPcHRpb25zKSB8fCBpc0FzeW5jUGxhY2Vob2xkZXIoYykpKSB7XHJcbiAgICAgICAgICByZXR1cm4gY1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBpbml0RXZlbnRzKHZtKSB7XHJcbiAgICB2bS5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHZtLl9oYXNIb29rRXZlbnQgPSBmYWxzZTtcclxuICAgIC8vIGluaXQgcGFyZW50IGF0dGFjaGVkIGV2ZW50c1xyXG4gICAgdmFyIGxpc3RlbmVycyA9IHZtLiRvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XHJcbiAgICBpZiAobGlzdGVuZXJzKSB7XHJcbiAgICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB0YXJnZXQ7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZChldmVudCwgZm4sIG9uY2UpIHtcclxuICAgIGlmIChvbmNlKSB7XHJcbiAgICAgIHRhcmdldC4kb25jZShldmVudCwgZm4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFyZ2V0LiRvbihldmVudCwgZm4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlJDEoZXZlbnQsIGZuKSB7XHJcbiAgICB0YXJnZXQuJG9mZihldmVudCwgZm4pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50TGlzdGVuZXJzKFxyXG4gICAgdm0sXHJcbiAgICBsaXN0ZW5lcnMsXHJcbiAgICBvbGRMaXN0ZW5lcnNcclxuICApIHtcclxuICAgIHRhcmdldCA9IHZtO1xyXG4gICAgdXBkYXRlTGlzdGVuZXJzKGxpc3RlbmVycywgb2xkTGlzdGVuZXJzIHx8IHt9LCBhZGQsIHJlbW92ZSQxLCB2bSk7XHJcbiAgICB0YXJnZXQgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBldmVudHNNaXhpbihWdWUpIHtcclxuICAgIHZhciBob29rUkUgPSAvXmhvb2s6LztcclxuICAgIFZ1ZS5wcm90b3R5cGUuJG9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xyXG4gICAgICB2YXIgdGhpcyQxID0gdGhpcztcclxuXHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZXZlbnQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzJDEuJG9uKGV2ZW50W2ldLCBmbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICh2bS5fZXZlbnRzW2V2ZW50XSB8fCAodm0uX2V2ZW50c1tldmVudF0gPSBbXSkpLnB1c2goZm4pO1xyXG4gICAgICAgIC8vIG9wdGltaXplIGhvb2s6ZXZlbnQgY29zdCBieSB1c2luZyBhIGJvb2xlYW4gZmxhZyBtYXJrZWQgYXQgcmVnaXN0cmF0aW9uXHJcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBhIGhhc2ggbG9va3VwXHJcbiAgICAgICAgaWYgKGhvb2tSRS50ZXN0KGV2ZW50KSkge1xyXG4gICAgICAgICAgdm0uX2hhc0hvb2tFdmVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2bVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xyXG4gICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICBmdW5jdGlvbiBvbigpIHtcclxuICAgICAgICB2bS4kb2ZmKGV2ZW50LCBvbik7XHJcbiAgICAgICAgZm4uYXBwbHkodm0sIGFyZ3VtZW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgb24uZm4gPSBmbjtcclxuICAgICAgdm0uJG9uKGV2ZW50LCBvbik7XHJcbiAgICAgIHJldHVybiB2bVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRvZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XHJcbiAgICAgIHZhciB0aGlzJDEgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgLy8gYWxsXHJcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHJldHVybiB2bVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGFycmF5IG9mIGV2ZW50c1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGV2ZW50Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgdGhpcyQxLiRvZmYoZXZlbnRbaV0sIGZuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZtXHJcbiAgICAgIH1cclxuICAgICAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICAgICAgdmFyIGNicyA9IHZtLl9ldmVudHNbZXZlbnRdO1xyXG4gICAgICBpZiAoIWNicykge1xyXG4gICAgICAgIHJldHVybiB2bVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghZm4pIHtcclxuICAgICAgICB2bS5fZXZlbnRzW2V2ZW50XSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHZtXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgLy8gc3BlY2lmaWMgaGFuZGxlclxyXG4gICAgICAgIHZhciBjYjtcclxuICAgICAgICB2YXIgaSQxID0gY2JzLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoaSQxLS0pIHtcclxuICAgICAgICAgIGNiID0gY2JzW2kkMV07XHJcbiAgICAgICAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xyXG4gICAgICAgICAgICBjYnMuc3BsaWNlKGkkMSwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2bVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRlbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgbG93ZXJDYXNlRXZlbnQgPSBldmVudC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChsb3dlckNhc2VFdmVudCAhPT0gZXZlbnQgJiYgdm0uX2V2ZW50c1tsb3dlckNhc2VFdmVudF0pIHtcclxuICAgICAgICAgIHRpcChcclxuICAgICAgICAgICAgXCJFdmVudCBcXFwiXCIgKyBsb3dlckNhc2VFdmVudCArIFwiXFxcIiBpcyBlbWl0dGVkIGluIGNvbXBvbmVudCBcIiArXHJcbiAgICAgICAgICAgIChmb3JtYXRDb21wb25lbnROYW1lKHZtKSkgKyBcIiBidXQgdGhlIGhhbmRsZXIgaXMgcmVnaXN0ZXJlZCBmb3IgXFxcIlwiICsgZXZlbnQgKyBcIlxcXCIuIFwiICtcclxuICAgICAgICAgICAgXCJOb3RlIHRoYXQgSFRNTCBhdHRyaWJ1dGVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlIGFuZCB5b3UgY2Fubm90IHVzZSBcIiArXHJcbiAgICAgICAgICAgIFwidi1vbiB0byBsaXN0ZW4gdG8gY2FtZWxDYXNlIGV2ZW50cyB3aGVuIHVzaW5nIGluLURPTSB0ZW1wbGF0ZXMuIFwiICtcclxuICAgICAgICAgICAgXCJZb3Ugc2hvdWxkIHByb2JhYmx5IHVzZSBcXFwiXCIgKyAoaHlwaGVuYXRlKGV2ZW50KSkgKyBcIlxcXCIgaW5zdGVhZCBvZiBcXFwiXCIgKyBldmVudCArIFwiXFxcIi5cIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGNicyA9IHZtLl9ldmVudHNbZXZlbnRdO1xyXG4gICAgICBpZiAoY2JzKSB7XHJcbiAgICAgICAgY2JzID0gY2JzLmxlbmd0aCA+IDEgPyB0b0FycmF5KGNicykgOiBjYnM7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjYnNbaV0uYXBwbHkodm0sIGFyZ3MpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBoYW5kbGVFcnJvcihlLCB2bSwgKFwiZXZlbnQgaGFuZGxlciBmb3IgXFxcIlwiICsgZXZlbnQgKyBcIlxcXCJcIikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdm1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcblxyXG5cclxuICAvKipcclxuICAgKiBSdW50aW1lIGhlbHBlciBmb3IgcmVzb2x2aW5nIHJhdyBjaGlsZHJlbiBWTm9kZXMgaW50byBhIHNsb3Qgb2JqZWN0LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlc29sdmVTbG90cyhcclxuICAgIGNoaWxkcmVuLFxyXG4gICAgY29udGV4dFxyXG4gICkge1xyXG4gICAgdmFyIHNsb3RzID0ge307XHJcbiAgICBpZiAoIWNoaWxkcmVuKSB7XHJcbiAgICAgIHJldHVybiBzbG90c1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgIHZhciBkYXRhID0gY2hpbGQuZGF0YTtcclxuICAgICAgLy8gcmVtb3ZlIHNsb3QgYXR0cmlidXRlIGlmIHRoZSBub2RlIGlzIHJlc29sdmVkIGFzIGEgVnVlIHNsb3Qgbm9kZVxyXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLmF0dHJzICYmIGRhdGEuYXR0cnMuc2xvdCkge1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmF0dHJzLnNsb3Q7XHJcbiAgICAgIH1cclxuICAgICAgLy8gbmFtZWQgc2xvdHMgc2hvdWxkIG9ubHkgYmUgcmVzcGVjdGVkIGlmIHRoZSB2bm9kZSB3YXMgcmVuZGVyZWQgaW4gdGhlXHJcbiAgICAgIC8vIHNhbWUgY29udGV4dC5cclxuICAgICAgaWYgKChjaGlsZC5jb250ZXh0ID09PSBjb250ZXh0IHx8IGNoaWxkLmZuQ29udGV4dCA9PT0gY29udGV4dCkgJiZcclxuICAgICAgICBkYXRhICYmIGRhdGEuc2xvdCAhPSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIHZhciBuYW1lID0gZGF0YS5zbG90O1xyXG4gICAgICAgIHZhciBzbG90ID0gKHNsb3RzW25hbWVdIHx8IChzbG90c1tuYW1lXSA9IFtdKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICAgICAgc2xvdC5wdXNoLmFwcGx5KHNsb3QsIGNoaWxkLmNoaWxkcmVuIHx8IFtdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2xvdC5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgKHNsb3RzLmRlZmF1bHQgfHwgKHNsb3RzLmRlZmF1bHQgPSBbXSkpLnB1c2goY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBpZ25vcmUgc2xvdHMgdGhhdCBjb250YWlucyBvbmx5IHdoaXRlc3BhY2VcclxuICAgIGZvciAodmFyIG5hbWUkMSBpbiBzbG90cykge1xyXG4gICAgICBpZiAoc2xvdHNbbmFtZSQxXS5ldmVyeShpc1doaXRlc3BhY2UpKSB7XHJcbiAgICAgICAgZGVsZXRlIHNsb3RzW25hbWUkMV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzbG90c1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKG5vZGUpIHtcclxuICAgIHJldHVybiAobm9kZS5pc0NvbW1lbnQgJiYgIW5vZGUuYXN5bmNGYWN0b3J5KSB8fCBub2RlLnRleHQgPT09ICcgJ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVzb2x2ZVNjb3BlZFNsb3RzKFxyXG4gICAgZm5zLCAvLyBzZWUgZmxvdy92bm9kZVxyXG4gICAgcmVzXHJcbiAgKSB7XHJcbiAgICByZXMgPSByZXMgfHwge307XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmbnNbaV0pKSB7XHJcbiAgICAgICAgcmVzb2x2ZVNjb3BlZFNsb3RzKGZuc1tpXSwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNbZm5zW2ldLmtleV0gPSBmbnNbaV0uZm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgYWN0aXZlSW5zdGFuY2UgPSBudWxsO1xyXG4gIHZhciBpc1VwZGF0aW5nQ2hpbGRDb21wb25lbnQgPSBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdExpZmVjeWNsZSh2bSkge1xyXG4gICAgdmFyIG9wdGlvbnMgPSB2bS4kb3B0aW9ucztcclxuXHJcbiAgICAvLyBsb2NhdGUgZmlyc3Qgbm9uLWFic3RyYWN0IHBhcmVudFxyXG4gICAgdmFyIHBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xyXG4gICAgaWYgKHBhcmVudCAmJiAhb3B0aW9ucy5hYnN0cmFjdCkge1xyXG4gICAgICB3aGlsZSAocGFyZW50LiRvcHRpb25zLmFic3RyYWN0ICYmIHBhcmVudC4kcGFyZW50KSB7XHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgICAgcGFyZW50LiRjaGlsZHJlbi5wdXNoKHZtKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS4kcGFyZW50ID0gcGFyZW50O1xyXG4gICAgdm0uJHJvb3QgPSBwYXJlbnQgPyBwYXJlbnQuJHJvb3QgOiB2bTtcclxuXHJcbiAgICB2bS4kY2hpbGRyZW4gPSBbXTtcclxuICAgIHZtLiRyZWZzID0ge307XHJcblxyXG4gICAgdm0uX3dhdGNoZXIgPSBudWxsO1xyXG4gICAgdm0uX2luYWN0aXZlID0gbnVsbDtcclxuICAgIHZtLl9kaXJlY3RJbmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgdm0uX2lzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgdm0uX2lzRGVzdHJveWVkID0gZmFsc2U7XHJcbiAgICB2bS5faXNCZWluZ0Rlc3Ryb3llZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlmZWN5Y2xlTWl4aW4oVnVlKSB7XHJcbiAgICBWdWUucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAodm5vZGUsIGh5ZHJhdGluZykge1xyXG4gICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICBpZiAodm0uX2lzTW91bnRlZCkge1xyXG4gICAgICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlVXBkYXRlJyk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHByZXZFbCA9IHZtLiRlbDtcclxuICAgICAgdmFyIHByZXZWbm9kZSA9IHZtLl92bm9kZTtcclxuICAgICAgdmFyIHByZXZBY3RpdmVJbnN0YW5jZSA9IGFjdGl2ZUluc3RhbmNlO1xyXG4gICAgICBhY3RpdmVJbnN0YW5jZSA9IHZtO1xyXG4gICAgICB2bS5fdm5vZGUgPSB2bm9kZTtcclxuICAgICAgLy8gVnVlLnByb3RvdHlwZS5fX3BhdGNoX18gaXMgaW5qZWN0ZWQgaW4gZW50cnkgcG9pbnRzXHJcbiAgICAgIC8vIGJhc2VkIG9uIHRoZSByZW5kZXJpbmcgYmFja2VuZCB1c2VkLlxyXG4gICAgICBpZiAoIXByZXZWbm9kZSkge1xyXG4gICAgICAgIC8vIGluaXRpYWwgcmVuZGVyXHJcbiAgICAgICAgdm0uJGVsID0gdm0uX19wYXRjaF9fKFxyXG4gICAgICAgICAgdm0uJGVsLCB2bm9kZSwgaHlkcmF0aW5nLCBmYWxzZSAvKiByZW1vdmVPbmx5ICovLFxyXG4gICAgICAgICAgdm0uJG9wdGlvbnMuX3BhcmVudEVsbSxcclxuICAgICAgICAgIHZtLiRvcHRpb25zLl9yZWZFbG1cclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIG5vIG5lZWQgZm9yIHRoZSByZWYgbm9kZXMgYWZ0ZXIgaW5pdGlhbCBwYXRjaFxyXG4gICAgICAgIC8vIHRoaXMgcHJldmVudHMga2VlcGluZyBhIGRldGFjaGVkIERPTSB0cmVlIGluIG1lbW9yeSAoIzU4NTEpXHJcbiAgICAgICAgdm0uJG9wdGlvbnMuX3BhcmVudEVsbSA9IHZtLiRvcHRpb25zLl9yZWZFbG0gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHVwZGF0ZXNcclxuICAgICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18ocHJldlZub2RlLCB2bm9kZSk7XHJcbiAgICAgIH1cclxuICAgICAgYWN0aXZlSW5zdGFuY2UgPSBwcmV2QWN0aXZlSW5zdGFuY2U7XHJcbiAgICAgIC8vIHVwZGF0ZSBfX3Z1ZV9fIHJlZmVyZW5jZVxyXG4gICAgICBpZiAocHJldkVsKSB7XHJcbiAgICAgICAgcHJldkVsLl9fdnVlX18gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2bS4kZWwpIHtcclxuICAgICAgICB2bS4kZWwuX192dWVfXyA9IHZtO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGlmIHBhcmVudCBpcyBhbiBIT0MsIHVwZGF0ZSBpdHMgJGVsIGFzIHdlbGxcclxuICAgICAgaWYgKHZtLiR2bm9kZSAmJiB2bS4kcGFyZW50ICYmIHZtLiR2bm9kZSA9PT0gdm0uJHBhcmVudC5fdm5vZGUpIHtcclxuICAgICAgICB2bS4kcGFyZW50LiRlbCA9IHZtLiRlbDtcclxuICAgICAgfVxyXG4gICAgICAvLyB1cGRhdGVkIGhvb2sgaXMgY2FsbGVkIGJ5IHRoZSBzY2hlZHVsZXIgdG8gZW5zdXJlIHRoYXQgY2hpbGRyZW4gYXJlXHJcbiAgICAgIC8vIHVwZGF0ZWQgaW4gYSBwYXJlbnQncyB1cGRhdGVkIGhvb2suXHJcbiAgICB9O1xyXG5cclxuICAgIFZ1ZS5wcm90b3R5cGUuJGZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICBpZiAodm0uX3dhdGNoZXIpIHtcclxuICAgICAgICB2bS5fd2F0Y2hlci51cGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICBpZiAodm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICBjYWxsSG9vayh2bSwgJ2JlZm9yZURlc3Ryb3knKTtcclxuICAgICAgdm0uX2lzQmVpbmdEZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudFxyXG4gICAgICB2YXIgcGFyZW50ID0gdm0uJHBhcmVudDtcclxuICAgICAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkICYmICF2bS4kb3B0aW9ucy5hYnN0cmFjdCkge1xyXG4gICAgICAgIHJlbW92ZShwYXJlbnQuJGNoaWxkcmVuLCB2bSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gdGVhcmRvd24gd2F0Y2hlcnNcclxuICAgICAgaWYgKHZtLl93YXRjaGVyKSB7XHJcbiAgICAgICAgdm0uX3dhdGNoZXIudGVhcmRvd24oKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgaSA9IHZtLl93YXRjaGVycy5sZW5ndGg7XHJcbiAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICB2bS5fd2F0Y2hlcnNbaV0udGVhcmRvd24oKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZW1vdmUgcmVmZXJlbmNlIGZyb20gZGF0YSBvYlxyXG4gICAgICAvLyBmcm96ZW4gb2JqZWN0IG1heSBub3QgaGF2ZSBvYnNlcnZlci5cclxuICAgICAgaWYgKHZtLl9kYXRhLl9fb2JfXykge1xyXG4gICAgICAgIHZtLl9kYXRhLl9fb2JfXy52bUNvdW50LS07XHJcbiAgICAgIH1cclxuICAgICAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXHJcbiAgICAgIHZtLl9pc0Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICAgIC8vIGludm9rZSBkZXN0cm95IGhvb2tzIG9uIGN1cnJlbnQgcmVuZGVyZWQgdHJlZVxyXG4gICAgICB2bS5fX3BhdGNoX18odm0uX3Zub2RlLCBudWxsKTtcclxuICAgICAgLy8gZmlyZSBkZXN0cm95ZWQgaG9va1xyXG4gICAgICBjYWxsSG9vayh2bSwgJ2Rlc3Ryb3llZCcpO1xyXG4gICAgICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxyXG4gICAgICB2bS4kb2ZmKCk7XHJcbiAgICAgIC8vIHJlbW92ZSBfX3Z1ZV9fIHJlZmVyZW5jZVxyXG4gICAgICBpZiAodm0uJGVsKSB7XHJcbiAgICAgICAgdm0uJGVsLl9fdnVlX18gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHJlbGVhc2UgY2lyY3VsYXIgcmVmZXJlbmNlICgjNjc1OSlcclxuICAgICAgaWYgKHZtLiR2bm9kZSkge1xyXG4gICAgICAgIHZtLiR2bm9kZS5wYXJlbnQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91bnRDb21wb25lbnQoXHJcbiAgICB2bSxcclxuICAgIGVsLFxyXG4gICAgaHlkcmF0aW5nXHJcbiAgKSB7XHJcbiAgICB2bS4kZWwgPSBlbDtcclxuICAgIGlmICghdm0uJG9wdGlvbnMucmVuZGVyKSB7XHJcbiAgICAgIHZtLiRvcHRpb25zLnJlbmRlciA9IGNyZWF0ZUVtcHR5Vk5vZGU7XHJcbiAgICAgIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAoKHZtLiRvcHRpb25zLnRlbXBsYXRlICYmIHZtLiRvcHRpb25zLnRlbXBsYXRlLmNoYXJBdCgwKSAhPT0gJyMnKSB8fFxyXG4gICAgICAgICAgdm0uJG9wdGlvbnMuZWwgfHwgZWwpIHtcclxuICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICdZb3UgYXJlIHVzaW5nIHRoZSBydW50aW1lLW9ubHkgYnVpbGQgb2YgVnVlIHdoZXJlIHRoZSB0ZW1wbGF0ZSAnICtcclxuICAgICAgICAgICAgJ2NvbXBpbGVyIGlzIG5vdCBhdmFpbGFibGUuIEVpdGhlciBwcmUtY29tcGlsZSB0aGUgdGVtcGxhdGVzIGludG8gJyArXHJcbiAgICAgICAgICAgICdyZW5kZXIgZnVuY3Rpb25zLCBvciB1c2UgdGhlIGNvbXBpbGVyLWluY2x1ZGVkIGJ1aWxkLicsXHJcbiAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAnRmFpbGVkIHRvIG1vdW50IGNvbXBvbmVudDogdGVtcGxhdGUgb3IgcmVuZGVyIGZ1bmN0aW9uIG5vdCBkZWZpbmVkLicsXHJcbiAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FsbEhvb2sodm0sICdiZWZvcmVNb3VudCcpO1xyXG5cclxuICAgIHZhciB1cGRhdGVDb21wb25lbnQ7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgbWFyaykge1xyXG4gICAgICB1cGRhdGVDb21wb25lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSB2bS5fbmFtZTtcclxuICAgICAgICB2YXIgaWQgPSB2bS5fdWlkO1xyXG4gICAgICAgIHZhciBzdGFydFRhZyA9IFwidnVlLXBlcmYtc3RhcnQ6XCIgKyBpZDtcclxuICAgICAgICB2YXIgZW5kVGFnID0gXCJ2dWUtcGVyZi1lbmQ6XCIgKyBpZDtcclxuXHJcbiAgICAgICAgbWFyayhzdGFydFRhZyk7XHJcbiAgICAgICAgdmFyIHZub2RlID0gdm0uX3JlbmRlcigpO1xyXG4gICAgICAgIG1hcmsoZW5kVGFnKTtcclxuICAgICAgICBtZWFzdXJlKChcInZ1ZSBcIiArIG5hbWUgKyBcIiByZW5kZXJcIiksIHN0YXJ0VGFnLCBlbmRUYWcpO1xyXG5cclxuICAgICAgICBtYXJrKHN0YXJ0VGFnKTtcclxuICAgICAgICB2bS5fdXBkYXRlKHZub2RlLCBoeWRyYXRpbmcpO1xyXG4gICAgICAgIG1hcmsoZW5kVGFnKTtcclxuICAgICAgICBtZWFzdXJlKChcInZ1ZSBcIiArIG5hbWUgKyBcIiBwYXRjaFwiKSwgc3RhcnRUYWcsIGVuZFRhZyk7XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVDb21wb25lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0uX3VwZGF0ZSh2bS5fcmVuZGVyKCksIGh5ZHJhdGluZyk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2Ugc2V0IHRoaXMgdG8gdm0uX3dhdGNoZXIgaW5zaWRlIHRoZSB3YXRjaGVyJ3MgY29uc3RydWN0b3JcclxuICAgIC8vIHNpbmNlIHRoZSB3YXRjaGVyJ3MgaW5pdGlhbCBwYXRjaCBtYXkgY2FsbCAkZm9yY2VVcGRhdGUgKGUuZy4gaW5zaWRlIGNoaWxkXHJcbiAgICAvLyBjb21wb25lbnQncyBtb3VudGVkIGhvb2spLCB3aGljaCByZWxpZXMgb24gdm0uX3dhdGNoZXIgYmVpbmcgYWxyZWFkeSBkZWZpbmVkXHJcbiAgICBuZXcgV2F0Y2hlcih2bSwgdXBkYXRlQ29tcG9uZW50LCBub29wLCBudWxsLCB0cnVlIC8qIGlzUmVuZGVyV2F0Y2hlciAqLyk7XHJcbiAgICBoeWRyYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBtYW51YWxseSBtb3VudGVkIGluc3RhbmNlLCBjYWxsIG1vdW50ZWQgb24gc2VsZlxyXG4gICAgLy8gbW91bnRlZCBpcyBjYWxsZWQgZm9yIHJlbmRlci1jcmVhdGVkIGNoaWxkIGNvbXBvbmVudHMgaW4gaXRzIGluc2VydGVkIGhvb2tcclxuICAgIGlmICh2bS4kdm5vZGUgPT0gbnVsbCkge1xyXG4gICAgICB2bS5faXNNb3VudGVkID0gdHJ1ZTtcclxuICAgICAgY2FsbEhvb2sodm0sICdtb3VudGVkJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdm1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUNoaWxkQ29tcG9uZW50KFxyXG4gICAgdm0sXHJcbiAgICBwcm9wc0RhdGEsXHJcbiAgICBsaXN0ZW5lcnMsXHJcbiAgICBwYXJlbnRWbm9kZSxcclxuICAgIHJlbmRlckNoaWxkcmVuXHJcbiAgKSB7XHJcbiAgICB7XHJcbiAgICAgIGlzVXBkYXRpbmdDaGlsZENvbXBvbmVudCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHdoZXRoZXIgY29tcG9uZW50IGhhcyBzbG90IGNoaWxkcmVuXHJcbiAgICAvLyB3ZSBuZWVkIHRvIGRvIHRoaXMgYmVmb3JlIG92ZXJ3cml0aW5nICRvcHRpb25zLl9yZW5kZXJDaGlsZHJlblxyXG4gICAgdmFyIGhhc0NoaWxkcmVuID0gISEoXHJcbiAgICAgIHJlbmRlckNoaWxkcmVuIHx8ICAgICAgICAgICAgICAgLy8gaGFzIG5ldyBzdGF0aWMgc2xvdHNcclxuICAgICAgdm0uJG9wdGlvbnMuX3JlbmRlckNoaWxkcmVuIHx8ICAvLyBoYXMgb2xkIHN0YXRpYyBzbG90c1xyXG4gICAgICBwYXJlbnRWbm9kZS5kYXRhLnNjb3BlZFNsb3RzIHx8IC8vIGhhcyBuZXcgc2NvcGVkIHNsb3RzXHJcbiAgICAgIHZtLiRzY29wZWRTbG90cyAhPT0gZW1wdHlPYmplY3QgLy8gaGFzIG9sZCBzY29wZWQgc2xvdHNcclxuICAgICk7XHJcblxyXG4gICAgdm0uJG9wdGlvbnMuX3BhcmVudFZub2RlID0gcGFyZW50Vm5vZGU7XHJcbiAgICB2bS4kdm5vZGUgPSBwYXJlbnRWbm9kZTsgLy8gdXBkYXRlIHZtJ3MgcGxhY2Vob2xkZXIgbm9kZSB3aXRob3V0IHJlLXJlbmRlclxyXG5cclxuICAgIGlmICh2bS5fdm5vZGUpIHsgLy8gdXBkYXRlIGNoaWxkIHRyZWUncyBwYXJlbnRcclxuICAgICAgdm0uX3Zub2RlLnBhcmVudCA9IHBhcmVudFZub2RlO1xyXG4gICAgfVxyXG4gICAgdm0uJG9wdGlvbnMuX3JlbmRlckNoaWxkcmVuID0gcmVuZGVyQ2hpbGRyZW47XHJcblxyXG4gICAgLy8gdXBkYXRlICRhdHRycyBhbmQgJGxpc3RlbmVycyBoYXNoXHJcbiAgICAvLyB0aGVzZSBhcmUgYWxzbyByZWFjdGl2ZSBzbyB0aGV5IG1heSB0cmlnZ2VyIGNoaWxkIHVwZGF0ZSBpZiB0aGUgY2hpbGRcclxuICAgIC8vIHVzZWQgdGhlbSBkdXJpbmcgcmVuZGVyXHJcbiAgICB2bS4kYXR0cnMgPSBwYXJlbnRWbm9kZS5kYXRhLmF0dHJzIHx8IGVtcHR5T2JqZWN0O1xyXG4gICAgdm0uJGxpc3RlbmVycyA9IGxpc3RlbmVycyB8fCBlbXB0eU9iamVjdDtcclxuXHJcbiAgICAvLyB1cGRhdGUgcHJvcHNcclxuICAgIGlmIChwcm9wc0RhdGEgJiYgdm0uJG9wdGlvbnMucHJvcHMpIHtcclxuICAgICAgdG9nZ2xlT2JzZXJ2aW5nKGZhbHNlKTtcclxuICAgICAgdmFyIHByb3BzID0gdm0uX3Byb3BzO1xyXG4gICAgICB2YXIgcHJvcEtleXMgPSB2bS4kb3B0aW9ucy5fcHJvcEtleXMgfHwgW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcEtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIga2V5ID0gcHJvcEtleXNbaV07XHJcbiAgICAgICAgdmFyIHByb3BPcHRpb25zID0gdm0uJG9wdGlvbnMucHJvcHM7IC8vIHd0ZiBmbG93P1xyXG4gICAgICAgIHByb3BzW2tleV0gPSB2YWxpZGF0ZVByb3Aoa2V5LCBwcm9wT3B0aW9ucywgcHJvcHNEYXRhLCB2bSk7XHJcbiAgICAgIH1cclxuICAgICAgdG9nZ2xlT2JzZXJ2aW5nKHRydWUpO1xyXG4gICAgICAvLyBrZWVwIGEgY29weSBvZiByYXcgcHJvcHNEYXRhXHJcbiAgICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YSA9IHByb3BzRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgbGlzdGVuZXJzXHJcbiAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMgfHwgZW1wdHlPYmplY3Q7XHJcbiAgICB2YXIgb2xkTGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcclxuICAgIHZtLiRvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcbiAgICB1cGRhdGVDb21wb25lbnRMaXN0ZW5lcnModm0sIGxpc3RlbmVycywgb2xkTGlzdGVuZXJzKTtcclxuXHJcbiAgICAvLyByZXNvbHZlIHNsb3RzICsgZm9yY2UgdXBkYXRlIGlmIGhhcyBjaGlsZHJlblxyXG4gICAgaWYgKGhhc0NoaWxkcmVuKSB7XHJcbiAgICAgIHZtLiRzbG90cyA9IHJlc29sdmVTbG90cyhyZW5kZXJDaGlsZHJlbiwgcGFyZW50Vm5vZGUuY29udGV4dCk7XHJcbiAgICAgIHZtLiRmb3JjZVVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHtcclxuICAgICAgaXNVcGRhdGluZ0NoaWxkQ29tcG9uZW50ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0luSW5hY3RpdmVUcmVlKHZtKSB7XHJcbiAgICB3aGlsZSAodm0gJiYgKHZtID0gdm0uJHBhcmVudCkpIHtcclxuICAgICAgaWYgKHZtLl9pbmFjdGl2ZSkgeyByZXR1cm4gdHJ1ZSB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFjdGl2YXRlQ2hpbGRDb21wb25lbnQodm0sIGRpcmVjdCkge1xyXG4gICAgaWYgKGRpcmVjdCkge1xyXG4gICAgICB2bS5fZGlyZWN0SW5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgaWYgKGlzSW5JbmFjdGl2ZVRyZWUodm0pKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodm0uX2RpcmVjdEluYWN0aXZlKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaWYgKHZtLl9pbmFjdGl2ZSB8fCB2bS5faW5hY3RpdmUgPT09IG51bGwpIHtcclxuICAgICAgdm0uX2luYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bS4kY2hpbGRyZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbGxIb29rKHZtLCAnYWN0aXZhdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkZWFjdGl2YXRlQ2hpbGRDb21wb25lbnQodm0sIGRpcmVjdCkge1xyXG4gICAgaWYgKGRpcmVjdCkge1xyXG4gICAgICB2bS5fZGlyZWN0SW5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICBpZiAoaXNJbkluYWN0aXZlVHJlZSh2bSkpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCF2bS5faW5hY3RpdmUpIHtcclxuICAgICAgdm0uX2luYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS4kY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZWFjdGl2YXRlQ2hpbGRDb21wb25lbnQodm0uJGNoaWxkcmVuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICBjYWxsSG9vayh2bSwgJ2RlYWN0aXZhdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjYWxsSG9vayh2bSwgaG9vaykge1xyXG4gICAgLy8gIzc1NzMgZGlzYWJsZSBkZXAgY29sbGVjdGlvbiB3aGVuIGludm9raW5nIGxpZmVjeWNsZSBob29rc1xyXG4gICAgcHVzaFRhcmdldCgpO1xyXG4gICAgdmFyIGhhbmRsZXJzID0gdm0uJG9wdGlvbnNbaG9va107XHJcbiAgICBpZiAoaGFuZGxlcnMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaGFuZGxlcnNbaV0uY2FsbCh2bSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgaGFuZGxlRXJyb3IoZSwgdm0sIChob29rICsgXCIgaG9va1wiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodm0uX2hhc0hvb2tFdmVudCkge1xyXG4gICAgICB2bS4kZW1pdCgnaG9vazonICsgaG9vayk7XHJcbiAgICB9XHJcbiAgICBwb3BUYXJnZXQoKTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuXHJcbiAgdmFyIE1BWF9VUERBVEVfQ09VTlQgPSAxMDA7XHJcblxyXG4gIHZhciBxdWV1ZSA9IFtdO1xyXG4gIHZhciBhY3RpdmF0ZWRDaGlsZHJlbiA9IFtdO1xyXG4gIHZhciBoYXMgPSB7fTtcclxuICB2YXIgY2lyY3VsYXIgPSB7fTtcclxuICB2YXIgd2FpdGluZyA9IGZhbHNlO1xyXG4gIHZhciBmbHVzaGluZyA9IGZhbHNlO1xyXG4gIHZhciBpbmRleCA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0IHRoZSBzY2hlZHVsZXIncyBzdGF0ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiByZXNldFNjaGVkdWxlclN0YXRlKCkge1xyXG4gICAgaW5kZXggPSBxdWV1ZS5sZW5ndGggPSBhY3RpdmF0ZWRDaGlsZHJlbi5sZW5ndGggPSAwO1xyXG4gICAgaGFzID0ge307XHJcbiAgICB7XHJcbiAgICAgIGNpcmN1bGFyID0ge307XHJcbiAgICB9XHJcbiAgICB3YWl0aW5nID0gZmx1c2hpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZsdXNoIGJvdGggcXVldWVzIGFuZCBydW4gdGhlIHdhdGNoZXJzLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGZsdXNoU2NoZWR1bGVyUXVldWUoKSB7XHJcbiAgICBmbHVzaGluZyA9IHRydWU7XHJcbiAgICB2YXIgd2F0Y2hlciwgaWQ7XHJcblxyXG4gICAgLy8gU29ydCBxdWV1ZSBiZWZvcmUgZmx1c2guXHJcbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdDpcclxuICAgIC8vIDEuIENvbXBvbmVudHMgYXJlIHVwZGF0ZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGQuIChiZWNhdXNlIHBhcmVudCBpcyBhbHdheXNcclxuICAgIC8vICAgIGNyZWF0ZWQgYmVmb3JlIHRoZSBjaGlsZClcclxuICAgIC8vIDIuIEEgY29tcG9uZW50J3MgdXNlciB3YXRjaGVycyBhcmUgcnVuIGJlZm9yZSBpdHMgcmVuZGVyIHdhdGNoZXIgKGJlY2F1c2VcclxuICAgIC8vICAgIHVzZXIgd2F0Y2hlcnMgYXJlIGNyZWF0ZWQgYmVmb3JlIHRoZSByZW5kZXIgd2F0Y2hlcilcclxuICAgIC8vIDMuIElmIGEgY29tcG9uZW50IGlzIGRlc3Ryb3llZCBkdXJpbmcgYSBwYXJlbnQgY29tcG9uZW50J3Mgd2F0Y2hlciBydW4sXHJcbiAgICAvLyAgICBpdHMgd2F0Y2hlcnMgY2FuIGJlIHNraXBwZWQuXHJcbiAgICBxdWV1ZS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XHJcblxyXG4gICAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgd2F0Y2hlcnMgbWlnaHQgYmUgcHVzaGVkXHJcbiAgICAvLyBhcyB3ZSBydW4gZXhpc3Rpbmcgd2F0Y2hlcnNcclxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHF1ZXVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICB3YXRjaGVyID0gcXVldWVbaW5kZXhdO1xyXG4gICAgICBpZCA9IHdhdGNoZXIuaWQ7XHJcbiAgICAgIGhhc1tpZF0gPSBudWxsO1xyXG4gICAgICB3YXRjaGVyLnJ1bigpO1xyXG4gICAgICAvLyBpbiBkZXYgYnVpbGQsIGNoZWNrIGFuZCBzdG9wIGNpcmN1bGFyIHVwZGF0ZXMuXHJcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBoYXNbaWRdICE9IG51bGwpIHtcclxuICAgICAgICBjaXJjdWxhcltpZF0gPSAoY2lyY3VsYXJbaWRdIHx8IDApICsgMTtcclxuICAgICAgICBpZiAoY2lyY3VsYXJbaWRdID4gTUFYX1VQREFURV9DT1VOVCkge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBhbiBpbmZpbml0ZSB1cGRhdGUgbG9vcCAnICsgKFxyXG4gICAgICAgICAgICAgIHdhdGNoZXIudXNlclxyXG4gICAgICAgICAgICAgICAgPyAoXCJpbiB3YXRjaGVyIHdpdGggZXhwcmVzc2lvbiBcXFwiXCIgKyAod2F0Y2hlci5leHByZXNzaW9uKSArIFwiXFxcIlwiKVxyXG4gICAgICAgICAgICAgICAgOiBcImluIGEgY29tcG9uZW50IHJlbmRlciBmdW5jdGlvbi5cIlxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB3YXRjaGVyLnZtXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBrZWVwIGNvcGllcyBvZiBwb3N0IHF1ZXVlcyBiZWZvcmUgcmVzZXR0aW5nIHN0YXRlXHJcbiAgICB2YXIgYWN0aXZhdGVkUXVldWUgPSBhY3RpdmF0ZWRDaGlsZHJlbi5zbGljZSgpO1xyXG4gICAgdmFyIHVwZGF0ZWRRdWV1ZSA9IHF1ZXVlLnNsaWNlKCk7XHJcblxyXG4gICAgcmVzZXRTY2hlZHVsZXJTdGF0ZSgpO1xyXG5cclxuICAgIC8vIGNhbGwgY29tcG9uZW50IHVwZGF0ZWQgYW5kIGFjdGl2YXRlZCBob29rc1xyXG4gICAgY2FsbEFjdGl2YXRlZEhvb2tzKGFjdGl2YXRlZFF1ZXVlKTtcclxuICAgIGNhbGxVcGRhdGVkSG9va3ModXBkYXRlZFF1ZXVlKTtcclxuXHJcbiAgICAvLyBkZXZ0b29sIGhvb2tcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGRldnRvb2xzICYmIGNvbmZpZy5kZXZ0b29scykge1xyXG4gICAgICBkZXZ0b29scy5lbWl0KCdmbHVzaCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2FsbFVwZGF0ZWRIb29rcyhxdWV1ZSkge1xyXG4gICAgdmFyIGkgPSBxdWV1ZS5sZW5ndGg7XHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIHZhciB3YXRjaGVyID0gcXVldWVbaV07XHJcbiAgICAgIHZhciB2bSA9IHdhdGNoZXIudm07XHJcbiAgICAgIGlmICh2bS5fd2F0Y2hlciA9PT0gd2F0Y2hlciAmJiB2bS5faXNNb3VudGVkKSB7XHJcbiAgICAgICAgY2FsbEhvb2sodm0sICd1cGRhdGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFF1ZXVlIGEga2VwdC1hbGl2ZSBjb21wb25lbnQgdGhhdCB3YXMgYWN0aXZhdGVkIGR1cmluZyBwYXRjaC5cclxuICAgKiBUaGUgcXVldWUgd2lsbCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIGVudGlyZSB0cmVlIGhhcyBiZWVuIHBhdGNoZWQuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcXVldWVBY3RpdmF0ZWRDb21wb25lbnQodm0pIHtcclxuICAgIC8vIHNldHRpbmcgX2luYWN0aXZlIHRvIGZhbHNlIGhlcmUgc28gdGhhdCBhIHJlbmRlciBmdW5jdGlvbiBjYW5cclxuICAgIC8vIHJlbHkgb24gY2hlY2tpbmcgd2hldGhlciBpdCdzIGluIGFuIGluYWN0aXZlIHRyZWUgKGUuZy4gcm91dGVyLXZpZXcpXHJcbiAgICB2bS5faW5hY3RpdmUgPSBmYWxzZTtcclxuICAgIGFjdGl2YXRlZENoaWxkcmVuLnB1c2godm0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2FsbEFjdGl2YXRlZEhvb2tzKHF1ZXVlKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHF1ZXVlW2ldLl9pbmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgIGFjdGl2YXRlQ2hpbGRDb21wb25lbnQocXVldWVbaV0sIHRydWUgLyogdHJ1ZSAqLyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQdXNoIGEgd2F0Y2hlciBpbnRvIHRoZSB3YXRjaGVyIHF1ZXVlLlxyXG4gICAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xyXG4gICAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHF1ZXVlV2F0Y2hlcih3YXRjaGVyKSB7XHJcbiAgICB2YXIgaWQgPSB3YXRjaGVyLmlkO1xyXG4gICAgaWYgKGhhc1tpZF0gPT0gbnVsbCkge1xyXG4gICAgICBoYXNbaWRdID0gdHJ1ZTtcclxuICAgICAgaWYgKCFmbHVzaGluZykge1xyXG4gICAgICAgIHF1ZXVlLnB1c2god2F0Y2hlcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gaWYgYWxyZWFkeSBmbHVzaGluZywgc3BsaWNlIHRoZSB3YXRjaGVyIGJhc2VkIG9uIGl0cyBpZFxyXG4gICAgICAgIC8vIGlmIGFscmVhZHkgcGFzdCBpdHMgaWQsIGl0IHdpbGwgYmUgcnVuIG5leHQgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgdmFyIGkgPSBxdWV1ZS5sZW5ndGggLSAxO1xyXG4gICAgICAgIHdoaWxlIChpID4gaW5kZXggJiYgcXVldWVbaV0uaWQgPiB3YXRjaGVyLmlkKSB7XHJcbiAgICAgICAgICBpLS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXVlLnNwbGljZShpICsgMSwgMCwgd2F0Y2hlcik7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcXVldWUgdGhlIGZsdXNoXHJcbiAgICAgIGlmICghd2FpdGluZykge1xyXG4gICAgICAgIHdhaXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIG5leHRUaWNrKGZsdXNoU2NoZWR1bGVyUXVldWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIHVpZCQxID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXHJcbiAgICogYW5kIGZpcmVzIGNhbGxiYWNrIHdoZW4gdGhlIGV4cHJlc3Npb24gdmFsdWUgY2hhbmdlcy5cclxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGJvdGggdGhlICR3YXRjaCgpIGFwaSBhbmQgZGlyZWN0aXZlcy5cclxuICAgKi9cclxuICB2YXIgV2F0Y2hlciA9IGZ1bmN0aW9uIFdhdGNoZXIoXHJcbiAgICB2bSxcclxuICAgIGV4cE9yRm4sXHJcbiAgICBjYixcclxuICAgIG9wdGlvbnMsXHJcbiAgICBpc1JlbmRlcldhdGNoZXJcclxuICApIHtcclxuICAgIHRoaXMudm0gPSB2bTtcclxuICAgIGlmIChpc1JlbmRlcldhdGNoZXIpIHtcclxuICAgICAgdm0uX3dhdGNoZXIgPSB0aGlzO1xyXG4gICAgfVxyXG4gICAgdm0uX3dhdGNoZXJzLnB1c2godGhpcyk7XHJcbiAgICAvLyBvcHRpb25zXHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcDtcclxuICAgICAgdGhpcy51c2VyID0gISFvcHRpb25zLnVzZXI7XHJcbiAgICAgIHRoaXMubGF6eSA9ICEhb3B0aW9ucy5sYXp5O1xyXG4gICAgICB0aGlzLnN5bmMgPSAhIW9wdGlvbnMuc3luYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGVlcCA9IHRoaXMudXNlciA9IHRoaXMubGF6eSA9IHRoaXMuc3luYyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jYiA9IGNiO1xyXG4gICAgdGhpcy5pZCA9ICsrdWlkJDE7IC8vIHVpZCBmb3IgYmF0Y2hpbmdcclxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuZGlydHkgPSB0aGlzLmxhenk7IC8vIGZvciBsYXp5IHdhdGNoZXJzXHJcbiAgICB0aGlzLmRlcHMgPSBbXTtcclxuICAgIHRoaXMubmV3RGVwcyA9IFtdO1xyXG4gICAgdGhpcy5kZXBJZHMgPSBuZXcgX1NldCgpO1xyXG4gICAgdGhpcy5uZXdEZXBJZHMgPSBuZXcgX1NldCgpO1xyXG4gICAgdGhpcy5leHByZXNzaW9uID0gZXhwT3JGbi50b1N0cmluZygpO1xyXG4gICAgLy8gcGFyc2UgZXhwcmVzc2lvbiBmb3IgZ2V0dGVyXHJcbiAgICBpZiAodHlwZW9mIGV4cE9yRm4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5nZXR0ZXIgPSBleHBPckZuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nZXR0ZXIgPSBwYXJzZVBhdGgoZXhwT3JGbik7XHJcbiAgICAgIGlmICghdGhpcy5nZXR0ZXIpIHtcclxuICAgICAgICB0aGlzLmdldHRlciA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICAgXCJGYWlsZWQgd2F0Y2hpbmcgcGF0aDogXFxcIlwiICsgZXhwT3JGbiArIFwiXFxcIiBcIiArXHJcbiAgICAgICAgICAnV2F0Y2hlciBvbmx5IGFjY2VwdHMgc2ltcGxlIGRvdC1kZWxpbWl0ZWQgcGF0aHMuICcgK1xyXG4gICAgICAgICAgJ0ZvciBmdWxsIGNvbnRyb2wsIHVzZSBhIGZ1bmN0aW9uIGluc3RlYWQuJyxcclxuICAgICAgICAgIHZtXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubGF6eVxyXG4gICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICA6IHRoaXMuZ2V0KCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxyXG4gICAqL1xyXG4gIFdhdGNoZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgIHB1c2hUYXJnZXQodGhpcyk7XHJcbiAgICB2YXIgdmFsdWU7XHJcbiAgICB2YXIgdm0gPSB0aGlzLnZtO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICBoYW5kbGVFcnJvcihlLCB2bSwgKFwiZ2V0dGVyIGZvciB3YXRjaGVyIFxcXCJcIiArICh0aGlzLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBlXHJcbiAgICAgIH1cclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xyXG4gICAgICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcclxuICAgICAgaWYgKHRoaXMuZGVlcCkge1xyXG4gICAgICAgIHRyYXZlcnNlKHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgICBwb3BUYXJnZXQoKTtcclxuICAgICAgdGhpcy5jbGVhbnVwRGVwcygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cclxuICAgKi9cclxuICBXYXRjaGVyLnByb3RvdHlwZS5hZGREZXAgPSBmdW5jdGlvbiBhZGREZXAoZGVwKSB7XHJcbiAgICB2YXIgaWQgPSBkZXAuaWQ7XHJcbiAgICBpZiAoIXRoaXMubmV3RGVwSWRzLmhhcyhpZCkpIHtcclxuICAgICAgdGhpcy5uZXdEZXBJZHMuYWRkKGlkKTtcclxuICAgICAgdGhpcy5uZXdEZXBzLnB1c2goZGVwKTtcclxuICAgICAgaWYgKCF0aGlzLmRlcElkcy5oYXMoaWQpKSB7XHJcbiAgICAgICAgZGVwLmFkZFN1Yih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFuIHVwIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXHJcbiAgICovXHJcbiAgV2F0Y2hlci5wcm90b3R5cGUuY2xlYW51cERlcHMgPSBmdW5jdGlvbiBjbGVhbnVwRGVwcygpIHtcclxuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xyXG5cclxuICAgIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgdmFyIGRlcCA9IHRoaXMkMS5kZXBzW2ldO1xyXG4gICAgICBpZiAoIXRoaXMkMS5uZXdEZXBJZHMuaGFzKGRlcC5pZCkpIHtcclxuICAgICAgICBkZXAucmVtb3ZlU3ViKHRoaXMkMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciB0bXAgPSB0aGlzLmRlcElkcztcclxuICAgIHRoaXMuZGVwSWRzID0gdGhpcy5uZXdEZXBJZHM7XHJcbiAgICB0aGlzLm5ld0RlcElkcyA9IHRtcDtcclxuICAgIHRoaXMubmV3RGVwSWRzLmNsZWFyKCk7XHJcbiAgICB0bXAgPSB0aGlzLmRlcHM7XHJcbiAgICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHM7XHJcbiAgICB0aGlzLm5ld0RlcHMgPSB0bXA7XHJcbiAgICB0aGlzLm5ld0RlcHMubGVuZ3RoID0gMDtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTdWJzY3JpYmVyIGludGVyZmFjZS5cclxuICAgKiBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgZGVwZW5kZW5jeSBjaGFuZ2VzLlxyXG4gICAqL1xyXG4gIFdhdGNoZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAodGhpcy5sYXp5KSB7XHJcbiAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmMpIHtcclxuICAgICAgdGhpcy5ydW4oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHF1ZXVlV2F0Y2hlcih0aGlzKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTY2hlZHVsZXIgam9iIGludGVyZmFjZS5cclxuICAgKiBXaWxsIGJlIGNhbGxlZCBieSB0aGUgc2NoZWR1bGVyLlxyXG4gICAqL1xyXG4gIFdhdGNoZXIucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIHJ1bigpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgpO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdmFsdWUgIT09IHRoaXMudmFsdWUgfHxcclxuICAgICAgICAvLyBEZWVwIHdhdGNoZXJzIGFuZCB3YXRjaGVycyBvbiBPYmplY3QvQXJyYXlzIHNob3VsZCBmaXJlIGV2ZW5cclxuICAgICAgICAvLyB3aGVuIHRoZSB2YWx1ZSBpcyB0aGUgc2FtZSwgYmVjYXVzZSB0aGUgdmFsdWUgbWF5XHJcbiAgICAgICAgLy8gaGF2ZSBtdXRhdGVkLlxyXG4gICAgICAgIGlzT2JqZWN0KHZhbHVlKSB8fFxyXG4gICAgICAgIHRoaXMuZGVlcFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBzZXQgbmV3IHZhbHVlXHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUVycm9yKGUsIHRoaXMudm0sIChcImNhbGxiYWNrIGZvciB3YXRjaGVyIFxcXCJcIiArICh0aGlzLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXZhbHVhdGUgdGhlIHZhbHVlIG9mIHRoZSB3YXRjaGVyLlxyXG4gICAqIFRoaXMgb25seSBnZXRzIGNhbGxlZCBmb3IgbGF6eSB3YXRjaGVycy5cclxuICAgKi9cclxuICBXYXRjaGVyLnByb3RvdHlwZS5ldmFsdWF0ZSA9IGZ1bmN0aW9uIGV2YWx1YXRlKCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0KCk7XHJcbiAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVwZW5kIG9uIGFsbCBkZXBzIGNvbGxlY3RlZCBieSB0aGlzIHdhdGNoZXIuXHJcbiAgICovXHJcbiAgV2F0Y2hlci5wcm90b3R5cGUuZGVwZW5kID0gZnVuY3Rpb24gZGVwZW5kKCkge1xyXG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICB0aGlzJDEuZGVwc1tpXS5kZXBlbmQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YnNjcmliZXIgbGlzdC5cclxuICAgKi9cclxuICBXYXRjaGVyLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uIHRlYXJkb3duKCkge1xyXG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XHJcbiAgICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcclxuICAgICAgLy8gdGhpcyBpcyBhIHNvbWV3aGF0IGV4cGVuc2l2ZSBvcGVyYXRpb24gc28gd2Ugc2tpcCBpdFxyXG4gICAgICAvLyBpZiB0aGUgdm0gaXMgYmVpbmcgZGVzdHJveWVkLlxyXG4gICAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcclxuICAgICAgICByZW1vdmUodGhpcy52bS5fd2F0Y2hlcnMsIHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcclxuICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgIHRoaXMkMS5kZXBzW2ldLnJlbW92ZVN1Yih0aGlzJDEpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24gPSB7XHJcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiBub29wLFxyXG4gICAgc2V0OiBub29wXHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gcHJveHkodGFyZ2V0LCBzb3VyY2VLZXksIGtleSkge1xyXG4gICAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLmdldCA9IGZ1bmN0aW9uIHByb3h5R2V0dGVyKCkge1xyXG4gICAgICByZXR1cm4gdGhpc1tzb3VyY2VLZXldW2tleV1cclxuICAgIH07XHJcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gZnVuY3Rpb24gcHJveHlTZXR0ZXIodmFsKSB7XHJcbiAgICAgIHRoaXNbc291cmNlS2V5XVtrZXldID0gdmFsO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXRTdGF0ZSh2bSkge1xyXG4gICAgdm0uX3dhdGNoZXJzID0gW107XHJcbiAgICB2YXIgb3B0cyA9IHZtLiRvcHRpb25zO1xyXG4gICAgaWYgKG9wdHMucHJvcHMpIHsgaW5pdFByb3BzKHZtLCBvcHRzLnByb3BzKTsgfVxyXG4gICAgaWYgKG9wdHMubWV0aG9kcykgeyBpbml0TWV0aG9kcyh2bSwgb3B0cy5tZXRob2RzKTsgfVxyXG4gICAgaWYgKG9wdHMuZGF0YSkge1xyXG4gICAgICBpbml0RGF0YSh2bSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvYnNlcnZlKHZtLl9kYXRhID0ge30sIHRydWUgLyogYXNSb290RGF0YSAqLyk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0cy5jb21wdXRlZCkgeyBpbml0Q29tcHV0ZWQodm0sIG9wdHMuY29tcHV0ZWQpOyB9XHJcbiAgICBpZiAob3B0cy53YXRjaCAmJiBvcHRzLndhdGNoICE9PSBuYXRpdmVXYXRjaCkge1xyXG4gICAgICBpbml0V2F0Y2godm0sIG9wdHMud2F0Y2gpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdFByb3BzKHZtLCBwcm9wc09wdGlvbnMpIHtcclxuICAgIHZhciBwcm9wc0RhdGEgPSB2bS4kb3B0aW9ucy5wcm9wc0RhdGEgfHwge307XHJcbiAgICB2YXIgcHJvcHMgPSB2bS5fcHJvcHMgPSB7fTtcclxuICAgIC8vIGNhY2hlIHByb3Aga2V5cyBzbyB0aGF0IGZ1dHVyZSBwcm9wcyB1cGRhdGVzIGNhbiBpdGVyYXRlIHVzaW5nIEFycmF5XHJcbiAgICAvLyBpbnN0ZWFkIG9mIGR5bmFtaWMgb2JqZWN0IGtleSBlbnVtZXJhdGlvbi5cclxuICAgIHZhciBrZXlzID0gdm0uJG9wdGlvbnMuX3Byb3BLZXlzID0gW107XHJcbiAgICB2YXIgaXNSb290ID0gIXZtLiRwYXJlbnQ7XHJcbiAgICAvLyByb290IGluc3RhbmNlIHByb3BzIHNob3VsZCBiZSBjb252ZXJ0ZWRcclxuICAgIGlmICghaXNSb290KSB7XHJcbiAgICAgIHRvZ2dsZU9ic2VydmluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbG9vcCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHZhbGlkYXRlUHJvcChrZXksIHByb3BzT3B0aW9ucywgcHJvcHNEYXRhLCB2bSk7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgaHlwaGVuYXRlZEtleSA9IGh5cGhlbmF0ZShrZXkpO1xyXG4gICAgICAgIGlmIChpc1Jlc2VydmVkQXR0cmlidXRlKGh5cGhlbmF0ZWRLZXkpIHx8XHJcbiAgICAgICAgICBjb25maWcuaXNSZXNlcnZlZEF0dHIoaHlwaGVuYXRlZEtleSkpIHtcclxuICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgIChcIlxcXCJcIiArIGh5cGhlbmF0ZWRLZXkgKyBcIlxcXCIgaXMgYSByZXNlcnZlZCBhdHRyaWJ1dGUgYW5kIGNhbm5vdCBiZSB1c2VkIGFzIGNvbXBvbmVudCBwcm9wLlwiKSxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmluZVJlYWN0aXZlKHByb3BzLCBrZXksIHZhbHVlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAodm0uJHBhcmVudCAmJiAhaXNVcGRhdGluZ0NoaWxkQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgXCJBdm9pZCBtdXRhdGluZyBhIHByb3AgZGlyZWN0bHkgc2luY2UgdGhlIHZhbHVlIHdpbGwgYmUgXCIgK1xyXG4gICAgICAgICAgICAgIFwib3ZlcndyaXR0ZW4gd2hlbmV2ZXIgdGhlIHBhcmVudCBjb21wb25lbnQgcmUtcmVuZGVycy4gXCIgK1xyXG4gICAgICAgICAgICAgIFwiSW5zdGVhZCwgdXNlIGEgZGF0YSBvciBjb21wdXRlZCBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcHJvcCdzIFwiICtcclxuICAgICAgICAgICAgICBcInZhbHVlLiBQcm9wIGJlaW5nIG11dGF0ZWQ6IFxcXCJcIiArIGtleSArIFwiXFxcIlwiLFxyXG4gICAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc3RhdGljIHByb3BzIGFyZSBhbHJlYWR5IHByb3hpZWQgb24gdGhlIGNvbXBvbmVudCdzIHByb3RvdHlwZVxyXG4gICAgICAvLyBkdXJpbmcgVnVlLmV4dGVuZCgpLiBXZSBvbmx5IG5lZWQgdG8gcHJveHkgcHJvcHMgZGVmaW5lZCBhdFxyXG4gICAgICAvLyBpbnN0YW50aWF0aW9uIGhlcmUuXHJcbiAgICAgIGlmICghKGtleSBpbiB2bSkpIHtcclxuICAgICAgICBwcm94eSh2bSwgXCJfcHJvcHNcIiwga2V5KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNPcHRpb25zKSBsb29wKGtleSk7XHJcbiAgICB0b2dnbGVPYnNlcnZpbmcodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0RGF0YSh2bSkge1xyXG4gICAgdmFyIGRhdGEgPSB2bS4kb3B0aW9ucy5kYXRhO1xyXG4gICAgZGF0YSA9IHZtLl9kYXRhID0gdHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbidcclxuICAgICAgPyBnZXREYXRhKGRhdGEsIHZtKVxyXG4gICAgICA6IGRhdGEgfHwge307XHJcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoZGF0YSkpIHtcclxuICAgICAgZGF0YSA9IHt9O1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICdkYXRhIGZ1bmN0aW9ucyBzaG91bGQgcmV0dXJuIGFuIG9iamVjdDpcXG4nICtcclxuICAgICAgICAnaHR0cHM6Ly92dWVqcy5vcmcvdjIvZ3VpZGUvY29tcG9uZW50cy5odG1sI2RhdGEtTXVzdC1CZS1hLUZ1bmN0aW9uJyxcclxuICAgICAgICB2bVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcclxuICAgIHZhciBwcm9wcyA9IHZtLiRvcHRpb25zLnByb3BzO1xyXG4gICAgdmFyIG1ldGhvZHMgPSB2bS4kb3B0aW9ucy5tZXRob2RzO1xyXG4gICAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgdmFyIGtleSA9IGtleXNbaV07XHJcbiAgICAgIHtcclxuICAgICAgICBpZiAobWV0aG9kcyAmJiBoYXNPd24obWV0aG9kcywga2V5KSkge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgKFwiTWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQgYXMgYSBkYXRhIHByb3BlcnR5LlwiKSxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwcm9wcyAmJiBoYXNPd24ocHJvcHMsIGtleSkpIHtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICAgXCJUaGUgZGF0YSBwcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaXMgYWxyZWFkeSBkZWNsYXJlZCBhcyBhIHByb3AuIFwiICtcclxuICAgICAgICAgIFwiVXNlIHByb3AgZGVmYXVsdCB2YWx1ZSBpbnN0ZWFkLlwiLFxyXG4gICAgICAgICAgdm1cclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2UgaWYgKCFpc1Jlc2VydmVkKGtleSkpIHtcclxuICAgICAgICBwcm94eSh2bSwgXCJfZGF0YVwiLCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBvYnNlcnZlIGRhdGFcclxuICAgIG9ic2VydmUoZGF0YSwgdHJ1ZSAvKiBhc1Jvb3REYXRhICovKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldERhdGEoZGF0YSwgdm0pIHtcclxuICAgIC8vICM3NTczIGRpc2FibGUgZGVwIGNvbGxlY3Rpb24gd2hlbiBpbnZva2luZyBkYXRhIGdldHRlcnNcclxuICAgIHB1c2hUYXJnZXQoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBkYXRhLmNhbGwodm0sIHZtKVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBoYW5kbGVFcnJvcihlLCB2bSwgXCJkYXRhKClcIik7XHJcbiAgICAgIHJldHVybiB7fVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgcG9wVGFyZ2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgY29tcHV0ZWRXYXRjaGVyT3B0aW9ucyA9IHsgbGF6eTogdHJ1ZSB9O1xyXG5cclxuICBmdW5jdGlvbiBpbml0Q29tcHV0ZWQodm0sIGNvbXB1dGVkKSB7XHJcbiAgICAvLyAkZmxvdy1kaXNhYmxlLWxpbmVcclxuICAgIHZhciB3YXRjaGVycyA9IHZtLl9jb21wdXRlZFdhdGNoZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIC8vIGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIGp1c3QgZ2V0dGVycyBkdXJpbmcgU1NSXHJcbiAgICB2YXIgaXNTU1IgPSBpc1NlcnZlclJlbmRlcmluZygpO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xyXG4gICAgICB2YXIgdXNlckRlZiA9IGNvbXB1dGVkW2tleV07XHJcbiAgICAgIHZhciBnZXR0ZXIgPSB0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJyA/IHVzZXJEZWYgOiB1c2VyRGVmLmdldDtcclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGdldHRlciA9PSBudWxsKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgIChcIkdldHRlciBpcyBtaXNzaW5nIGZvciBjb21wdXRlZCBwcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIuXCIpLFxyXG4gICAgICAgICAgdm1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWlzU1NSKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlIGludGVybmFsIHdhdGNoZXIgZm9yIHRoZSBjb21wdXRlZCBwcm9wZXJ0eS5cclxuICAgICAgICB3YXRjaGVyc1trZXldID0gbmV3IFdhdGNoZXIoXHJcbiAgICAgICAgICB2bSxcclxuICAgICAgICAgIGdldHRlciB8fCBub29wLFxyXG4gICAgICAgICAgbm9vcCxcclxuICAgICAgICAgIGNvbXB1dGVkV2F0Y2hlck9wdGlvbnNcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjb21wb25lbnQtZGVmaW5lZCBjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSBhbHJlYWR5IGRlZmluZWQgb24gdGhlXHJcbiAgICAgIC8vIGNvbXBvbmVudCBwcm90b3R5cGUuIFdlIG9ubHkgbmVlZCB0byBkZWZpbmUgY29tcHV0ZWQgcHJvcGVydGllcyBkZWZpbmVkXHJcbiAgICAgIC8vIGF0IGluc3RhbnRpYXRpb24gaGVyZS5cclxuICAgICAgaWYgKCEoa2V5IGluIHZtKSkge1xyXG4gICAgICAgIGRlZmluZUNvbXB1dGVkKHZtLCBrZXksIHVzZXJEZWYpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChrZXkgaW4gdm0uJGRhdGEpIHtcclxuICAgICAgICAgIHdhcm4oKFwiVGhlIGNvbXB1dGVkIHByb3BlcnR5IFxcXCJcIiArIGtleSArIFwiXFxcIiBpcyBhbHJlYWR5IGRlZmluZWQgaW4gZGF0YS5cIiksIHZtKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHZtLiRvcHRpb25zLnByb3BzICYmIGtleSBpbiB2bS4kb3B0aW9ucy5wcm9wcykge1xyXG4gICAgICAgICAgd2FybigoXCJUaGUgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIHByb3AuXCIpLCB2bSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkZWZpbmVDb21wdXRlZChcclxuICAgIHRhcmdldCxcclxuICAgIGtleSxcclxuICAgIHVzZXJEZWZcclxuICApIHtcclxuICAgIHZhciBzaG91bGRDYWNoZSA9ICFpc1NlcnZlclJlbmRlcmluZygpO1xyXG4gICAgaWYgKHR5cGVvZiB1c2VyRGVmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5nZXQgPSBzaG91bGRDYWNoZVxyXG4gICAgICAgID8gY3JlYXRlQ29tcHV0ZWRHZXR0ZXIoa2V5KVxyXG4gICAgICAgIDogdXNlckRlZjtcclxuICAgICAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLnNldCA9IG5vb3A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uZ2V0ID0gdXNlckRlZi5nZXRcclxuICAgICAgICA/IHNob3VsZENhY2hlICYmIHVzZXJEZWYuY2FjaGUgIT09IGZhbHNlXHJcbiAgICAgICAgICA/IGNyZWF0ZUNvbXB1dGVkR2V0dGVyKGtleSlcclxuICAgICAgICAgIDogdXNlckRlZi5nZXRcclxuICAgICAgICA6IG5vb3A7XHJcbiAgICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5zZXQgPSB1c2VyRGVmLnNldFxyXG4gICAgICAgID8gdXNlckRlZi5zZXRcclxuICAgICAgICA6IG5vb3A7XHJcbiAgICB9XHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLnNldCA9PT0gbm9vcCkge1xyXG4gICAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAoXCJDb21wdXRlZCBwcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgd2FzIGFzc2lnbmVkIHRvIGJ1dCBpdCBoYXMgbm8gc2V0dGVyLlwiKSxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZWRHZXR0ZXIoa2V5KSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gY29tcHV0ZWRHZXR0ZXIoKSB7XHJcbiAgICAgIHZhciB3YXRjaGVyID0gdGhpcy5fY29tcHV0ZWRXYXRjaGVycyAmJiB0aGlzLl9jb21wdXRlZFdhdGNoZXJzW2tleV07XHJcbiAgICAgIGlmICh3YXRjaGVyKSB7XHJcbiAgICAgICAgaWYgKHdhdGNoZXIuZGlydHkpIHtcclxuICAgICAgICAgIHdhdGNoZXIuZXZhbHVhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKERlcC50YXJnZXQpIHtcclxuICAgICAgICAgIHdhdGNoZXIuZGVwZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB3YXRjaGVyLnZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXRNZXRob2RzKHZtLCBtZXRob2RzKSB7XHJcbiAgICB2YXIgcHJvcHMgPSB2bS4kb3B0aW9ucy5wcm9wcztcclxuICAgIGZvciAodmFyIGtleSBpbiBtZXRob2RzKSB7XHJcbiAgICAgIHtcclxuICAgICAgICBpZiAobWV0aG9kc1trZXldID09IG51bGwpIHtcclxuICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgIFwiTWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgYW4gdW5kZWZpbmVkIHZhbHVlIGluIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbi4gXCIgK1xyXG4gICAgICAgICAgICBcIkRpZCB5b3UgcmVmZXJlbmNlIHRoZSBmdW5jdGlvbiBjb3JyZWN0bHk/XCIsXHJcbiAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXkpKSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAoXCJNZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGhhcyBhbHJlYWR5IGJlZW4gZGVmaW5lZCBhcyBhIHByb3AuXCIpLFxyXG4gICAgICAgICAgICB2bVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChrZXkgaW4gdm0pICYmIGlzUmVzZXJ2ZWQoa2V5KSkge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgXCJNZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGNvbmZsaWN0cyB3aXRoIGFuIGV4aXN0aW5nIFZ1ZSBpbnN0YW5jZSBtZXRob2QuIFwiICtcclxuICAgICAgICAgICAgXCJBdm9pZCBkZWZpbmluZyBjb21wb25lbnQgbWV0aG9kcyB0aGF0IHN0YXJ0IHdpdGggXyBvciAkLlwiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB2bVtrZXldID0gbWV0aG9kc1trZXldID09IG51bGwgPyBub29wIDogYmluZChtZXRob2RzW2tleV0sIHZtKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXRXYXRjaCh2bSwgd2F0Y2gpIHtcclxuICAgIGZvciAodmFyIGtleSBpbiB3YXRjaCkge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IHdhdGNoW2tleV07XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVXYXRjaGVyKFxyXG4gICAgdm0sXHJcbiAgICBleHBPckZuLFxyXG4gICAgaGFuZGxlcixcclxuICAgIG9wdGlvbnNcclxuICApIHtcclxuICAgIGlmIChpc1BsYWluT2JqZWN0KGhhbmRsZXIpKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBoYW5kbGVyO1xyXG4gICAgICBoYW5kbGVyID0gaGFuZGxlci5oYW5kbGVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICBoYW5kbGVyID0gdm1baGFuZGxlcl07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdm0uJHdhdGNoKGV4cE9yRm4sIGhhbmRsZXIsIG9wdGlvbnMpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzdGF0ZU1peGluKFZ1ZSkge1xyXG4gICAgLy8gZmxvdyBzb21laG93IGhhcyBwcm9ibGVtcyB3aXRoIGRpcmVjdGx5IGRlY2xhcmVkIGRlZmluaXRpb24gb2JqZWN0XHJcbiAgICAvLyB3aGVuIHVzaW5nIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSwgc28gd2UgaGF2ZSB0byBwcm9jZWR1cmFsbHkgYnVpbGQgdXBcclxuICAgIC8vIHRoZSBvYmplY3QgaGVyZS5cclxuICAgIHZhciBkYXRhRGVmID0ge307XHJcbiAgICBkYXRhRGVmLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfTtcclxuICAgIHZhciBwcm9wc0RlZiA9IHt9O1xyXG4gICAgcHJvcHNEZWYuZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fcHJvcHMgfTtcclxuICAgIHtcclxuICAgICAgZGF0YURlZi5zZXQgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAnQXZvaWQgcmVwbGFjaW5nIGluc3RhbmNlIHJvb3QgJGRhdGEuICcgK1xyXG4gICAgICAgICAgJ1VzZSBuZXN0ZWQgZGF0YSBwcm9wZXJ0aWVzIGluc3RlYWQuJyxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgICBwcm9wc0RlZi5zZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2FybihcIiRwcm9wcyBpcyByZWFkb25seS5cIiwgdGhpcyk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRkYXRhJywgZGF0YURlZik7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRwcm9wcycsIHByb3BzRGVmKTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRzZXQgPSBzZXQ7XHJcbiAgICBWdWUucHJvdG90eXBlLiRkZWxldGUgPSBkZWw7XHJcblxyXG4gICAgVnVlLnByb3RvdHlwZS4kd2F0Y2ggPSBmdW5jdGlvbiAoXHJcbiAgICAgIGV4cE9yRm4sXHJcbiAgICAgIGNiLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICApIHtcclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgaWYgKGlzUGxhaW5PYmplY3QoY2IpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVdhdGNoZXIodm0sIGV4cE9yRm4sIGNiLCBvcHRpb25zKVxyXG4gICAgICB9XHJcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICBvcHRpb25zLnVzZXIgPSB0cnVlO1xyXG4gICAgICB2YXIgd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHZtLCBleHBPckZuLCBjYiwgb3B0aW9ucyk7XHJcbiAgICAgIGlmIChvcHRpb25zLmltbWVkaWF0ZSkge1xyXG4gICAgICAgIGNiLmNhbGwodm0sIHdhdGNoZXIudmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4oKSB7XHJcbiAgICAgICAgd2F0Y2hlci50ZWFyZG93bigpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGluaXRQcm92aWRlKHZtKSB7XHJcbiAgICB2YXIgcHJvdmlkZSA9IHZtLiRvcHRpb25zLnByb3ZpZGU7XHJcbiAgICBpZiAocHJvdmlkZSkge1xyXG4gICAgICB2bS5fcHJvdmlkZWQgPSB0eXBlb2YgcHJvdmlkZSA9PT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICAgID8gcHJvdmlkZS5jYWxsKHZtKVxyXG4gICAgICAgIDogcHJvdmlkZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXRJbmplY3Rpb25zKHZtKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gcmVzb2x2ZUluamVjdCh2bS4kb3B0aW9ucy5pbmplY3QsIHZtKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgdG9nZ2xlT2JzZXJ2aW5nKGZhbHNlKTtcclxuICAgICAgT2JqZWN0LmtleXMocmVzdWx0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGRlZmluZVJlYWN0aXZlKHZtLCBrZXksIHJlc3VsdFtrZXldLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgXCJBdm9pZCBtdXRhdGluZyBhbiBpbmplY3RlZCB2YWx1ZSBkaXJlY3RseSBzaW5jZSB0aGUgY2hhbmdlcyB3aWxsIGJlIFwiICtcclxuICAgICAgICAgICAgICBcIm92ZXJ3cml0dGVuIHdoZW5ldmVyIHRoZSBwcm92aWRlZCBjb21wb25lbnQgcmUtcmVuZGVycy4gXCIgK1xyXG4gICAgICAgICAgICAgIFwiaW5qZWN0aW9uIGJlaW5nIG11dGF0ZWQ6IFxcXCJcIiArIGtleSArIFwiXFxcIlwiLFxyXG4gICAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICB0b2dnbGVPYnNlcnZpbmcodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNvbHZlSW5qZWN0KGluamVjdCwgdm0pIHtcclxuICAgIGlmIChpbmplY3QpIHtcclxuICAgICAgLy8gaW5qZWN0IGlzIDphbnkgYmVjYXVzZSBmbG93IGlzIG5vdCBzbWFydCBlbm91Z2ggdG8gZmlndXJlIG91dCBjYWNoZWRcclxuICAgICAgdmFyIHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgIHZhciBrZXlzID0gaGFzU3ltYm9sXHJcbiAgICAgICAgPyBSZWZsZWN0Lm93bktleXMoaW5qZWN0KS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGluamVjdCwga2V5KS5lbnVtZXJhYmxlXHJcbiAgICAgICAgfSlcclxuICAgICAgICA6IE9iamVjdC5rZXlzKGluamVjdCk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICB2YXIgcHJvdmlkZUtleSA9IGluamVjdFtrZXldLmZyb207XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHZtO1xyXG4gICAgICAgIHdoaWxlIChzb3VyY2UpIHtcclxuICAgICAgICAgIGlmIChzb3VyY2UuX3Byb3ZpZGVkICYmIGhhc093bihzb3VyY2UuX3Byb3ZpZGVkLCBwcm92aWRlS2V5KSkge1xyXG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHNvdXJjZS5fcHJvdmlkZWRbcHJvdmlkZUtleV07XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UuJHBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzb3VyY2UpIHtcclxuICAgICAgICAgIGlmICgnZGVmYXVsdCcgaW4gaW5qZWN0W2tleV0pIHtcclxuICAgICAgICAgICAgdmFyIHByb3ZpZGVEZWZhdWx0ID0gaW5qZWN0W2tleV0uZGVmYXVsdDtcclxuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0eXBlb2YgcHJvdmlkZURlZmF1bHQgPT09ICdmdW5jdGlvbidcclxuICAgICAgICAgICAgICA/IHByb3ZpZGVEZWZhdWx0LmNhbGwodm0pXHJcbiAgICAgICAgICAgICAgOiBwcm92aWRlRGVmYXVsdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdhcm4oKFwiSW5qZWN0aW9uIFxcXCJcIiArIGtleSArIFwiXFxcIiBub3QgZm91bmRcIiksIHZtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1bnRpbWUgaGVscGVyIGZvciByZW5kZXJpbmcgdi1mb3IgbGlzdHMuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVuZGVyTGlzdChcclxuICAgIHZhbCxcclxuICAgIHJlbmRlclxyXG4gICkge1xyXG4gICAgdmFyIHJldCwgaSwgbCwga2V5cywga2V5O1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSB8fCB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXQgPSBuZXcgQXJyYXkodmFsLmxlbmd0aCk7XHJcbiAgICAgIGZvciAoaSA9IDAsIGwgPSB2YWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgcmV0W2ldID0gcmVuZGVyKHZhbFtpXSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgcmV0ID0gbmV3IEFycmF5KHZhbCk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2YWw7IGkrKykge1xyXG4gICAgICAgIHJldFtpXSA9IHJlbmRlcihpICsgMSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsKSkge1xyXG4gICAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcclxuICAgICAgcmV0ID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKTtcclxuICAgICAgZm9yIChpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICByZXRbaV0gPSByZW5kZXIodmFsW2tleV0sIGtleSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpc0RlZihyZXQpKSB7XHJcbiAgICAgIChyZXQpLl9pc1ZMaXN0ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiBSdW50aW1lIGhlbHBlciBmb3IgcmVuZGVyaW5nIDxzbG90PlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlbmRlclNsb3QoXHJcbiAgICBuYW1lLFxyXG4gICAgZmFsbGJhY2ssXHJcbiAgICBwcm9wcyxcclxuICAgIGJpbmRPYmplY3RcclxuICApIHtcclxuICAgIHZhciBzY29wZWRTbG90Rm4gPSB0aGlzLiRzY29wZWRTbG90c1tuYW1lXTtcclxuICAgIHZhciBub2RlcztcclxuICAgIGlmIChzY29wZWRTbG90Rm4pIHsgLy8gc2NvcGVkIHNsb3RcclxuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgICAgaWYgKGJpbmRPYmplY3QpIHtcclxuICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgIWlzT2JqZWN0KGJpbmRPYmplY3QpKSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAnc2xvdCB2LWJpbmQgd2l0aG91dCBhcmd1bWVudCBleHBlY3RzIGFuIE9iamVjdCcsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3BzID0gZXh0ZW5kKGV4dGVuZCh7fSwgYmluZE9iamVjdCksIHByb3BzKTtcclxuICAgICAgfVxyXG4gICAgICBub2RlcyA9IHNjb3BlZFNsb3RGbihwcm9wcykgfHwgZmFsbGJhY2s7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgc2xvdE5vZGVzID0gdGhpcy4kc2xvdHNbbmFtZV07XHJcbiAgICAgIC8vIHdhcm4gZHVwbGljYXRlIHNsb3QgdXNhZ2VcclxuICAgICAgaWYgKHNsb3ROb2Rlcykge1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBzbG90Tm9kZXMuX3JlbmRlcmVkKSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICBcIkR1cGxpY2F0ZSBwcmVzZW5jZSBvZiBzbG90IFxcXCJcIiArIG5hbWUgKyBcIlxcXCIgZm91bmQgaW4gdGhlIHNhbWUgcmVuZGVyIHRyZWUgXCIgK1xyXG4gICAgICAgICAgICBcIi0gdGhpcyB3aWxsIGxpa2VseSBjYXVzZSByZW5kZXIgZXJyb3JzLlwiLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzbG90Tm9kZXMuX3JlbmRlcmVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBub2RlcyA9IHNsb3ROb2RlcyB8fCBmYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGFyZ2V0ID0gcHJvcHMgJiYgcHJvcHMuc2xvdDtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJywgeyBzbG90OiB0YXJnZXQgfSwgbm9kZXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbm9kZXNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiBSdW50aW1lIGhlbHBlciBmb3IgcmVzb2x2aW5nIGZpbHRlcnNcclxuICAgKi9cclxuICBmdW5jdGlvbiByZXNvbHZlRmlsdGVyKGlkKSB7XHJcbiAgICByZXR1cm4gcmVzb2x2ZUFzc2V0KHRoaXMuJG9wdGlvbnMsICdmaWx0ZXJzJywgaWQsIHRydWUpIHx8IGlkZW50aXR5XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaXNLZXlOb3RNYXRjaChleHBlY3QsIGFjdHVhbCkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwZWN0KSkge1xyXG4gICAgICByZXR1cm4gZXhwZWN0LmluZGV4T2YoYWN0dWFsKSA9PT0gLTFcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBleHBlY3QgIT09IGFjdHVhbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUnVudGltZSBoZWxwZXIgZm9yIGNoZWNraW5nIGtleUNvZGVzIGZyb20gY29uZmlnLlxyXG4gICAqIGV4cG9zZWQgYXMgVnVlLnByb3RvdHlwZS5fa1xyXG4gICAqIHBhc3NpbmcgaW4gZXZlbnRLZXlOYW1lIGFzIGxhc3QgYXJndW1lbnQgc2VwYXJhdGVseSBmb3IgYmFja3dhcmRzIGNvbXBhdFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNoZWNrS2V5Q29kZXMoXHJcbiAgICBldmVudEtleUNvZGUsXHJcbiAgICBrZXksXHJcbiAgICBidWlsdEluS2V5Q29kZSxcclxuICAgIGV2ZW50S2V5TmFtZSxcclxuICAgIGJ1aWx0SW5LZXlOYW1lXHJcbiAgKSB7XHJcbiAgICB2YXIgbWFwcGVkS2V5Q29kZSA9IGNvbmZpZy5rZXlDb2Rlc1trZXldIHx8IGJ1aWx0SW5LZXlDb2RlO1xyXG4gICAgaWYgKGJ1aWx0SW5LZXlOYW1lICYmIGV2ZW50S2V5TmFtZSAmJiAhY29uZmlnLmtleUNvZGVzW2tleV0pIHtcclxuICAgICAgcmV0dXJuIGlzS2V5Tm90TWF0Y2goYnVpbHRJbktleU5hbWUsIGV2ZW50S2V5TmFtZSlcclxuICAgIH0gZWxzZSBpZiAobWFwcGVkS2V5Q29kZSkge1xyXG4gICAgICByZXR1cm4gaXNLZXlOb3RNYXRjaChtYXBwZWRLZXlDb2RlLCBldmVudEtleUNvZGUpXHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50S2V5TmFtZSkge1xyXG4gICAgICByZXR1cm4gaHlwaGVuYXRlKGV2ZW50S2V5TmFtZSkgIT09IGtleVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1bnRpbWUgaGVscGVyIGZvciBtZXJnaW5nIHYtYmluZD1cIm9iamVjdFwiIGludG8gYSBWTm9kZSdzIGRhdGEuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYmluZE9iamVjdFByb3BzKFxyXG4gICAgZGF0YSxcclxuICAgIHRhZyxcclxuICAgIHZhbHVlLFxyXG4gICAgYXNQcm9wLFxyXG4gICAgaXNTeW5jXHJcbiAgKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICAgJ3YtYmluZCB3aXRob3V0IGFyZ3VtZW50IGV4cGVjdHMgYW4gT2JqZWN0IG9yIEFycmF5IHZhbHVlJyxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB0b09iamVjdCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoYXNoO1xyXG4gICAgICAgIHZhciBsb29wID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBrZXkgPT09ICdjbGFzcycgfHxcclxuICAgICAgICAgICAga2V5ID09PSAnc3R5bGUnIHx8XHJcbiAgICAgICAgICAgIGlzUmVzZXJ2ZWRBdHRyaWJ1dGUoa2V5KVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGhhc2ggPSBkYXRhO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBkYXRhLmF0dHJzICYmIGRhdGEuYXR0cnMudHlwZTtcclxuICAgICAgICAgICAgaGFzaCA9IGFzUHJvcCB8fCBjb25maWcubXVzdFVzZVByb3AodGFnLCB0eXBlLCBrZXkpXHJcbiAgICAgICAgICAgICAgPyBkYXRhLmRvbVByb3BzIHx8IChkYXRhLmRvbVByb3BzID0ge30pXHJcbiAgICAgICAgICAgICAgOiBkYXRhLmF0dHJzIHx8IChkYXRhLmF0dHJzID0ge30pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCEoa2V5IGluIGhhc2gpKSB7XHJcbiAgICAgICAgICAgIGhhc2hba2V5XSA9IHZhbHVlW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNTeW5jKSB7XHJcbiAgICAgICAgICAgICAgdmFyIG9uID0gZGF0YS5vbiB8fCAoZGF0YS5vbiA9IHt9KTtcclxuICAgICAgICAgICAgICBvblsoXCJ1cGRhdGU6XCIgKyBrZXkpXSA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlW2tleV0gPSAkZXZlbnQ7XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkgbG9vcChrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1bnRpbWUgaGVscGVyIGZvciByZW5kZXJpbmcgc3RhdGljIHRyZWVzLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlbmRlclN0YXRpYyhcclxuICAgIGluZGV4LFxyXG4gICAgaXNJbkZvclxyXG4gICkge1xyXG4gICAgdmFyIGNhY2hlZCA9IHRoaXMuX3N0YXRpY1RyZWVzIHx8ICh0aGlzLl9zdGF0aWNUcmVlcyA9IFtdKTtcclxuICAgIHZhciB0cmVlID0gY2FjaGVkW2luZGV4XTtcclxuICAgIC8vIGlmIGhhcyBhbHJlYWR5LXJlbmRlcmVkIHN0YXRpYyB0cmVlIGFuZCBub3QgaW5zaWRlIHYtZm9yLFxyXG4gICAgLy8gd2UgY2FuIHJldXNlIHRoZSBzYW1lIHRyZWUuXHJcbiAgICBpZiAodHJlZSAmJiAhaXNJbkZvcikge1xyXG4gICAgICByZXR1cm4gdHJlZVxyXG4gICAgfVxyXG4gICAgLy8gb3RoZXJ3aXNlLCByZW5kZXIgYSBmcmVzaCB0cmVlLlxyXG4gICAgdHJlZSA9IGNhY2hlZFtpbmRleF0gPSB0aGlzLiRvcHRpb25zLnN0YXRpY1JlbmRlckZuc1tpbmRleF0uY2FsbChcclxuICAgICAgdGhpcy5fcmVuZGVyUHJveHksXHJcbiAgICAgIG51bGwsXHJcbiAgICAgIHRoaXMgLy8gZm9yIHJlbmRlciBmbnMgZ2VuZXJhdGVkIGZvciBmdW5jdGlvbmFsIGNvbXBvbmVudCB0ZW1wbGF0ZXNcclxuICAgICk7XHJcbiAgICBtYXJrU3RhdGljKHRyZWUsIChcIl9fc3RhdGljX19cIiArIGluZGV4KSwgZmFsc2UpO1xyXG4gICAgcmV0dXJuIHRyZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1bnRpbWUgaGVscGVyIGZvciB2LW9uY2UuXHJcbiAgICogRWZmZWN0aXZlbHkgaXQgbWVhbnMgbWFya2luZyB0aGUgbm9kZSBhcyBzdGF0aWMgd2l0aCBhIHVuaXF1ZSBrZXkuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWFya09uY2UoXHJcbiAgICB0cmVlLFxyXG4gICAgaW5kZXgsXHJcbiAgICBrZXlcclxuICApIHtcclxuICAgIG1hcmtTdGF0aWModHJlZSwgKFwiX19vbmNlX19cIiArIGluZGV4ICsgKGtleSA/IChcIl9cIiArIGtleSkgOiBcIlwiKSksIHRydWUpO1xyXG4gICAgcmV0dXJuIHRyZWVcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1hcmtTdGF0aWMoXHJcbiAgICB0cmVlLFxyXG4gICAga2V5LFxyXG4gICAgaXNPbmNlXHJcbiAgKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmVlKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodHJlZVtpXSAmJiB0eXBlb2YgdHJlZVtpXSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIG1hcmtTdGF0aWNOb2RlKHRyZWVbaV0sIChrZXkgKyBcIl9cIiArIGkpLCBpc09uY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWFya1N0YXRpY05vZGUodHJlZSwga2V5LCBpc09uY2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFya1N0YXRpY05vZGUobm9kZSwga2V5LCBpc09uY2UpIHtcclxuICAgIG5vZGUuaXNTdGF0aWMgPSB0cnVlO1xyXG4gICAgbm9kZS5rZXkgPSBrZXk7XHJcbiAgICBub2RlLmlzT25jZSA9IGlzT25jZTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBiaW5kT2JqZWN0TGlzdGVuZXJzKGRhdGEsIHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgaWYgKCFpc1BsYWluT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICAgICAndi1vbiB3aXRob3V0IGFyZ3VtZW50IGV4cGVjdHMgYW4gT2JqZWN0IHZhbHVlJyxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBvbiA9IGRhdGEub24gPSBkYXRhLm9uID8gZXh0ZW5kKHt9LCBkYXRhLm9uKSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgdmFyIGV4aXN0aW5nID0gb25ba2V5XTtcclxuICAgICAgICAgIHZhciBvdXJzID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgIG9uW2tleV0gPSBleGlzdGluZyA/IFtdLmNvbmNhdChleGlzdGluZywgb3VycykgOiBvdXJzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBpbnN0YWxsUmVuZGVySGVscGVycyh0YXJnZXQpIHtcclxuICAgIHRhcmdldC5fbyA9IG1hcmtPbmNlO1xyXG4gICAgdGFyZ2V0Ll9uID0gdG9OdW1iZXI7XHJcbiAgICB0YXJnZXQuX3MgPSB0b1N0cmluZztcclxuICAgIHRhcmdldC5fbCA9IHJlbmRlckxpc3Q7XHJcbiAgICB0YXJnZXQuX3QgPSByZW5kZXJTbG90O1xyXG4gICAgdGFyZ2V0Ll9xID0gbG9vc2VFcXVhbDtcclxuICAgIHRhcmdldC5faSA9IGxvb3NlSW5kZXhPZjtcclxuICAgIHRhcmdldC5fbSA9IHJlbmRlclN0YXRpYztcclxuICAgIHRhcmdldC5fZiA9IHJlc29sdmVGaWx0ZXI7XHJcbiAgICB0YXJnZXQuX2sgPSBjaGVja0tleUNvZGVzO1xyXG4gICAgdGFyZ2V0Ll9iID0gYmluZE9iamVjdFByb3BzO1xyXG4gICAgdGFyZ2V0Ll92ID0gY3JlYXRlVGV4dFZOb2RlO1xyXG4gICAgdGFyZ2V0Ll9lID0gY3JlYXRlRW1wdHlWTm9kZTtcclxuICAgIHRhcmdldC5fdSA9IHJlc29sdmVTY29wZWRTbG90cztcclxuICAgIHRhcmdldC5fZyA9IGJpbmRPYmplY3RMaXN0ZW5lcnM7XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gRnVuY3Rpb25hbFJlbmRlckNvbnRleHQoXHJcbiAgICBkYXRhLFxyXG4gICAgcHJvcHMsXHJcbiAgICBjaGlsZHJlbixcclxuICAgIHBhcmVudCxcclxuICAgIEN0b3JcclxuICApIHtcclxuICAgIHZhciBvcHRpb25zID0gQ3Rvci5vcHRpb25zO1xyXG4gICAgLy8gZW5zdXJlIHRoZSBjcmVhdGVFbGVtZW50IGZ1bmN0aW9uIGluIGZ1bmN0aW9uYWwgY29tcG9uZW50c1xyXG4gICAgLy8gZ2V0cyBhIHVuaXF1ZSBjb250ZXh0IC0gdGhpcyBpcyBuZWNlc3NhcnkgZm9yIGNvcnJlY3QgbmFtZWQgc2xvdCBjaGVja1xyXG4gICAgdmFyIGNvbnRleHRWbTtcclxuICAgIGlmIChoYXNPd24ocGFyZW50LCAnX3VpZCcpKSB7XHJcbiAgICAgIGNvbnRleHRWbSA9IE9iamVjdC5jcmVhdGUocGFyZW50KTtcclxuICAgICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICAgIGNvbnRleHRWbS5fb3JpZ2luYWwgPSBwYXJlbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB0aGUgY29udGV4dCB2bSBwYXNzZWQgaW4gaXMgYSBmdW5jdGlvbmFsIGNvbnRleHQgYXMgd2VsbC5cclxuICAgICAgLy8gaW4gdGhpcyBjYXNlIHdlIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFyZSBhYmxlIHRvIGdldCBhIGhvbGQgdG8gdGhlXHJcbiAgICAgIC8vIHJlYWwgY29udGV4dCBpbnN0YW5jZS5cclxuICAgICAgY29udGV4dFZtID0gcGFyZW50O1xyXG4gICAgICAvLyAkZmxvdy1kaXNhYmxlLWxpbmVcclxuICAgICAgcGFyZW50ID0gcGFyZW50Ll9vcmlnaW5hbDtcclxuICAgIH1cclxuICAgIHZhciBpc0NvbXBpbGVkID0gaXNUcnVlKG9wdGlvbnMuX2NvbXBpbGVkKTtcclxuICAgIHZhciBuZWVkTm9ybWFsaXphdGlvbiA9ICFpc0NvbXBpbGVkO1xyXG5cclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gZGF0YS5vbiB8fCBlbXB0eU9iamVjdDtcclxuICAgIHRoaXMuaW5qZWN0aW9ucyA9IHJlc29sdmVJbmplY3Qob3B0aW9ucy5pbmplY3QsIHBhcmVudCk7XHJcbiAgICB0aGlzLnNsb3RzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVzb2x2ZVNsb3RzKGNoaWxkcmVuLCBwYXJlbnQpOyB9O1xyXG5cclxuICAgIC8vIHN1cHBvcnQgZm9yIGNvbXBpbGVkIGZ1bmN0aW9uYWwgdGVtcGxhdGVcclxuICAgIGlmIChpc0NvbXBpbGVkKSB7XHJcbiAgICAgIC8vIGV4cG9zaW5nICRvcHRpb25zIGZvciByZW5kZXJTdGF0aWMoKVxyXG4gICAgICB0aGlzLiRvcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgLy8gcHJlLXJlc29sdmUgc2xvdHMgZm9yIHJlbmRlclNsb3QoKVxyXG4gICAgICB0aGlzLiRzbG90cyA9IHRoaXMuc2xvdHMoKTtcclxuICAgICAgdGhpcy4kc2NvcGVkU2xvdHMgPSBkYXRhLnNjb3BlZFNsb3RzIHx8IGVtcHR5T2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLl9zY29wZUlkKSB7XHJcbiAgICAgIHRoaXMuX2MgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkge1xyXG4gICAgICAgIHZhciB2bm9kZSA9IGNyZWF0ZUVsZW1lbnQoY29udGV4dFZtLCBhLCBiLCBjLCBkLCBuZWVkTm9ybWFsaXphdGlvbik7XHJcbiAgICAgICAgaWYgKHZub2RlICYmICFBcnJheS5pc0FycmF5KHZub2RlKSkge1xyXG4gICAgICAgICAgdm5vZGUuZm5TY29wZUlkID0gb3B0aW9ucy5fc2NvcGVJZDtcclxuICAgICAgICAgIHZub2RlLmZuQ29udGV4dCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZub2RlXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9jID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHsgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoY29udGV4dFZtLCBhLCBiLCBjLCBkLCBuZWVkTm9ybWFsaXphdGlvbik7IH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbnN0YWxsUmVuZGVySGVscGVycyhGdW5jdGlvbmFsUmVuZGVyQ29udGV4dC5wcm90b3R5cGUpO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVGdW5jdGlvbmFsQ29tcG9uZW50KFxyXG4gICAgQ3RvcixcclxuICAgIHByb3BzRGF0YSxcclxuICAgIGRhdGEsXHJcbiAgICBjb250ZXh0Vm0sXHJcbiAgICBjaGlsZHJlblxyXG4gICkge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBDdG9yLm9wdGlvbnM7XHJcbiAgICB2YXIgcHJvcHMgPSB7fTtcclxuICAgIHZhciBwcm9wT3B0aW9ucyA9IG9wdGlvbnMucHJvcHM7XHJcbiAgICBpZiAoaXNEZWYocHJvcE9wdGlvbnMpKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wT3B0aW9ucykge1xyXG4gICAgICAgIHByb3BzW2tleV0gPSB2YWxpZGF0ZVByb3Aoa2V5LCBwcm9wT3B0aW9ucywgcHJvcHNEYXRhIHx8IGVtcHR5T2JqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlzRGVmKGRhdGEuYXR0cnMpKSB7IG1lcmdlUHJvcHMocHJvcHMsIGRhdGEuYXR0cnMpOyB9XHJcbiAgICAgIGlmIChpc0RlZihkYXRhLnByb3BzKSkgeyBtZXJnZVByb3BzKHByb3BzLCBkYXRhLnByb3BzKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZW5kZXJDb250ZXh0ID0gbmV3IEZ1bmN0aW9uYWxSZW5kZXJDb250ZXh0KFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgY2hpbGRyZW4sXHJcbiAgICAgIGNvbnRleHRWbSxcclxuICAgICAgQ3RvclxyXG4gICAgKTtcclxuXHJcbiAgICB2YXIgdm5vZGUgPSBvcHRpb25zLnJlbmRlci5jYWxsKG51bGwsIHJlbmRlckNvbnRleHQuX2MsIHJlbmRlckNvbnRleHQpO1xyXG5cclxuICAgIGlmICh2bm9kZSBpbnN0YW5jZW9mIFZOb2RlKSB7XHJcbiAgICAgIHJldHVybiBjbG9uZUFuZE1hcmtGdW5jdGlvbmFsUmVzdWx0KHZub2RlLCBkYXRhLCByZW5kZXJDb250ZXh0LnBhcmVudCwgb3B0aW9ucylcclxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2bm9kZSkpIHtcclxuICAgICAgdmFyIHZub2RlcyA9IG5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlKSB8fCBbXTtcclxuICAgICAgdmFyIHJlcyA9IG5ldyBBcnJheSh2bm9kZXMubGVuZ3RoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICByZXNbaV0gPSBjbG9uZUFuZE1hcmtGdW5jdGlvbmFsUmVzdWx0KHZub2Rlc1tpXSwgZGF0YSwgcmVuZGVyQ29udGV4dC5wYXJlbnQsIG9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsb25lQW5kTWFya0Z1bmN0aW9uYWxSZXN1bHQodm5vZGUsIGRhdGEsIGNvbnRleHRWbSwgb3B0aW9ucykge1xyXG4gICAgLy8gIzc4MTcgY2xvbmUgbm9kZSBiZWZvcmUgc2V0dGluZyBmbkNvbnRleHQsIG90aGVyd2lzZSBpZiB0aGUgbm9kZSBpcyByZXVzZWRcclxuICAgIC8vIChlLmcuIGl0IHdhcyBmcm9tIGEgY2FjaGVkIG5vcm1hbCBzbG90KSB0aGUgZm5Db250ZXh0IGNhdXNlcyBuYW1lZCBzbG90c1xyXG4gICAgLy8gdGhhdCBzaG91bGQgbm90IGJlIG1hdGNoZWQgdG8gbWF0Y2guXHJcbiAgICB2YXIgY2xvbmUgPSBjbG9uZVZOb2RlKHZub2RlKTtcclxuICAgIGNsb25lLmZuQ29udGV4dCA9IGNvbnRleHRWbTtcclxuICAgIGNsb25lLmZuT3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICBpZiAoZGF0YS5zbG90KSB7XHJcbiAgICAgIChjbG9uZS5kYXRhIHx8IChjbG9uZS5kYXRhID0ge30pKS5zbG90ID0gZGF0YS5zbG90O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtZXJnZVByb3BzKHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xyXG4gICAgICB0b1tjYW1lbGl6ZShrZXkpXSA9IGZyb21ba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuXHJcblxyXG5cclxuICAvLyBSZWdpc3RlciB0aGUgY29tcG9uZW50IGhvb2sgdG8gd2VleCBuYXRpdmUgcmVuZGVyIGVuZ2luZS5cclxuICAvLyBUaGUgaG9vayB3aWxsIGJlIHRyaWdnZXJlZCBieSBuYXRpdmUsIG5vdCBqYXZhc2NyaXB0LlxyXG5cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCB0byB3ZWV4IG5hdGl2ZSByZW5kZXIgZW5naW5lLlxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0hhbmtzMTAxMDAvd2VleC1uYXRpdmUtZGlyZWN0aXZlL3RyZWUvbWFzdGVyL2NvbXBvbmVudFxyXG5cclxuICAvLyBsaXN0ZW5pbmcgb24gbmF0aXZlIGNhbGxiYWNrXHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLy8gaW5saW5lIGhvb2tzIHRvIGJlIGludm9rZWQgb24gY29tcG9uZW50IFZOb2RlcyBkdXJpbmcgcGF0Y2hcclxuICB2YXIgY29tcG9uZW50Vk5vZGVIb29rcyA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoXHJcbiAgICAgIHZub2RlLFxyXG4gICAgICBoeWRyYXRpbmcsXHJcbiAgICAgIHBhcmVudEVsbSxcclxuICAgICAgcmVmRWxtXHJcbiAgICApIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlICYmXHJcbiAgICAgICAgIXZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc0Rlc3Ryb3llZCAmJlxyXG4gICAgICAgIHZub2RlLmRhdGEua2VlcEFsaXZlXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIGtlcHQtYWxpdmUgY29tcG9uZW50cywgdHJlYXQgYXMgYSBwYXRjaFxyXG4gICAgICAgIHZhciBtb3VudGVkTm9kZSA9IHZub2RlOyAvLyB3b3JrIGFyb3VuZCBmbG93XHJcbiAgICAgICAgY29tcG9uZW50Vk5vZGVIb29rcy5wcmVwYXRjaChtb3VudGVkTm9kZSwgbW91bnRlZE5vZGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZShcclxuICAgICAgICAgIHZub2RlLFxyXG4gICAgICAgICAgYWN0aXZlSW5zdGFuY2UsXHJcbiAgICAgICAgICBwYXJlbnRFbG0sXHJcbiAgICAgICAgICByZWZFbG1cclxuICAgICAgICApO1xyXG4gICAgICAgIGNoaWxkLiRtb3VudChoeWRyYXRpbmcgPyB2bm9kZS5lbG0gOiB1bmRlZmluZWQsIGh5ZHJhdGluZyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcHJlcGF0Y2g6IGZ1bmN0aW9uIHByZXBhdGNoKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XHJcbiAgICAgIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gb2xkVm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgICAgIHVwZGF0ZUNoaWxkQ29tcG9uZW50KFxyXG4gICAgICAgIGNoaWxkLFxyXG4gICAgICAgIG9wdGlvbnMucHJvcHNEYXRhLCAvLyB1cGRhdGVkIHByb3BzXHJcbiAgICAgICAgb3B0aW9ucy5saXN0ZW5lcnMsIC8vIHVwZGF0ZWQgbGlzdGVuZXJzXHJcbiAgICAgICAgdm5vZGUsIC8vIG5ldyBwYXJlbnQgdm5vZGVcclxuICAgICAgICBvcHRpb25zLmNoaWxkcmVuIC8vIG5ldyBjaGlsZHJlblxyXG4gICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbnNlcnQ6IGZ1bmN0aW9uIGluc2VydCh2bm9kZSkge1xyXG4gICAgICB2YXIgY29udGV4dCA9IHZub2RlLmNvbnRleHQ7XHJcbiAgICAgIHZhciBjb21wb25lbnRJbnN0YW5jZSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlO1xyXG4gICAgICBpZiAoIWNvbXBvbmVudEluc3RhbmNlLl9pc01vdW50ZWQpIHtcclxuICAgICAgICBjb21wb25lbnRJbnN0YW5jZS5faXNNb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICBjYWxsSG9vayhjb21wb25lbnRJbnN0YW5jZSwgJ21vdW50ZWQnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcclxuICAgICAgICBpZiAoY29udGV4dC5faXNNb3VudGVkKSB7XHJcbiAgICAgICAgICAvLyB2dWUtcm91dGVyIzEyMTJcclxuICAgICAgICAgIC8vIER1cmluZyB1cGRhdGVzLCBhIGtlcHQtYWxpdmUgY29tcG9uZW50J3MgY2hpbGQgY29tcG9uZW50cyBtYXlcclxuICAgICAgICAgIC8vIGNoYW5nZSwgc28gZGlyZWN0bHkgd2Fsa2luZyB0aGUgdHJlZSBoZXJlIG1heSBjYWxsIGFjdGl2YXRlZCBob29rc1xyXG4gICAgICAgICAgLy8gb24gaW5jb3JyZWN0IGNoaWxkcmVuLiBJbnN0ZWFkIHdlIHB1c2ggdGhlbSBpbnRvIGEgcXVldWUgd2hpY2ggd2lsbFxyXG4gICAgICAgICAgLy8gYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSB3aG9sZSBwYXRjaCBwcm9jZXNzIGVuZGVkLlxyXG4gICAgICAgICAgcXVldWVBY3RpdmF0ZWRDb21wb25lbnQoY29tcG9uZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KGNvbXBvbmVudEluc3RhbmNlLCB0cnVlIC8qIGRpcmVjdCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3kodm5vZGUpIHtcclxuICAgICAgdmFyIGNvbXBvbmVudEluc3RhbmNlID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgICAgIGlmICghY29tcG9uZW50SW5zdGFuY2UuX2lzRGVzdHJveWVkKSB7XHJcbiAgICAgICAgaWYgKCF2bm9kZS5kYXRhLmtlZXBBbGl2ZSkge1xyXG4gICAgICAgICAgY29tcG9uZW50SW5zdGFuY2UuJGRlc3Ryb3koKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGVhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KGNvbXBvbmVudEluc3RhbmNlLCB0cnVlIC8qIGRpcmVjdCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGhvb2tzVG9NZXJnZSA9IE9iamVjdC5rZXlzKGNvbXBvbmVudFZOb2RlSG9va3MpO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXHJcbiAgICBDdG9yLFxyXG4gICAgZGF0YSxcclxuICAgIGNvbnRleHQsXHJcbiAgICBjaGlsZHJlbixcclxuICAgIHRhZ1xyXG4gICkge1xyXG4gICAgaWYgKGlzVW5kZWYoQ3RvcikpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJhc2VDdG9yID0gY29udGV4dC4kb3B0aW9ucy5fYmFzZTtcclxuXHJcbiAgICAvLyBwbGFpbiBvcHRpb25zIG9iamVjdDogdHVybiBpdCBpbnRvIGEgY29uc3RydWN0b3JcclxuICAgIGlmIChpc09iamVjdChDdG9yKSkge1xyXG4gICAgICBDdG9yID0gYmFzZUN0b3IuZXh0ZW5kKEN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIGF0IHRoaXMgc3RhZ2UgaXQncyBub3QgYSBjb25zdHJ1Y3RvciBvciBhbiBhc3luYyBjb21wb25lbnQgZmFjdG9yeSxcclxuICAgIC8vIHJlamVjdC5cclxuICAgIGlmICh0eXBlb2YgQ3RvciAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB7XHJcbiAgICAgICAgd2FybigoXCJJbnZhbGlkIENvbXBvbmVudCBkZWZpbml0aW9uOiBcIiArIChTdHJpbmcoQ3RvcikpKSwgY29udGV4dCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXN5bmMgY29tcG9uZW50XHJcbiAgICB2YXIgYXN5bmNGYWN0b3J5O1xyXG4gICAgaWYgKGlzVW5kZWYoQ3Rvci5jaWQpKSB7XHJcbiAgICAgIGFzeW5jRmFjdG9yeSA9IEN0b3I7XHJcbiAgICAgIEN0b3IgPSByZXNvbHZlQXN5bmNDb21wb25lbnQoYXN5bmNGYWN0b3J5LCBiYXNlQ3RvciwgY29udGV4dCk7XHJcbiAgICAgIGlmIChDdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAvLyByZXR1cm4gYSBwbGFjZWhvbGRlciBub2RlIGZvciBhc3luYyBjb21wb25lbnQsIHdoaWNoIGlzIHJlbmRlcmVkXHJcbiAgICAgICAgLy8gYXMgYSBjb21tZW50IG5vZGUgYnV0IHByZXNlcnZlcyBhbGwgdGhlIHJhdyBpbmZvcm1hdGlvbiBmb3IgdGhlIG5vZGUuXHJcbiAgICAgICAgLy8gdGhlIGluZm9ybWF0aW9uIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgc2VydmVyLXJlbmRlcmluZyBhbmQgaHlkcmF0aW9uLlxyXG4gICAgICAgIHJldHVybiBjcmVhdGVBc3luY1BsYWNlaG9sZGVyKFxyXG4gICAgICAgICAgYXN5bmNGYWN0b3J5LFxyXG4gICAgICAgICAgZGF0YSxcclxuICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICBjaGlsZHJlbixcclxuICAgICAgICAgIHRhZ1xyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG5cclxuICAgIC8vIHJlc29sdmUgY29uc3RydWN0b3Igb3B0aW9ucyBpbiBjYXNlIGdsb2JhbCBtaXhpbnMgYXJlIGFwcGxpZWQgYWZ0ZXJcclxuICAgIC8vIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBjcmVhdGlvblxyXG4gICAgcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyhDdG9yKTtcclxuXHJcbiAgICAvLyB0cmFuc2Zvcm0gY29tcG9uZW50IHYtbW9kZWwgZGF0YSBpbnRvIHByb3BzICYgZXZlbnRzXHJcbiAgICBpZiAoaXNEZWYoZGF0YS5tb2RlbCkpIHtcclxuICAgICAgdHJhbnNmb3JtTW9kZWwoQ3Rvci5vcHRpb25zLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBleHRyYWN0IHByb3BzXHJcbiAgICB2YXIgcHJvcHNEYXRhID0gZXh0cmFjdFByb3BzRnJvbVZOb2RlRGF0YShkYXRhLCBDdG9yLCB0YWcpO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uYWwgY29tcG9uZW50XHJcbiAgICBpZiAoaXNUcnVlKEN0b3Iub3B0aW9ucy5mdW5jdGlvbmFsKSkge1xyXG4gICAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb25hbENvbXBvbmVudChDdG9yLCBwcm9wc0RhdGEsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGV4dHJhY3QgbGlzdGVuZXJzLCBzaW5jZSB0aGVzZSBuZWVkcyB0byBiZSB0cmVhdGVkIGFzXHJcbiAgICAvLyBjaGlsZCBjb21wb25lbnQgbGlzdGVuZXJzIGluc3RlYWQgb2YgRE9NIGxpc3RlbmVyc1xyXG4gICAgdmFyIGxpc3RlbmVycyA9IGRhdGEub247XHJcbiAgICAvLyByZXBsYWNlIHdpdGggbGlzdGVuZXJzIHdpdGggLm5hdGl2ZSBtb2RpZmllclxyXG4gICAgLy8gc28gaXQgZ2V0cyBwcm9jZXNzZWQgZHVyaW5nIHBhcmVudCBjb21wb25lbnQgcGF0Y2guXHJcbiAgICBkYXRhLm9uID0gZGF0YS5uYXRpdmVPbjtcclxuXHJcbiAgICBpZiAoaXNUcnVlKEN0b3Iub3B0aW9ucy5hYnN0cmFjdCkpIHtcclxuICAgICAgLy8gYWJzdHJhY3QgY29tcG9uZW50cyBkbyBub3Qga2VlcCBhbnl0aGluZ1xyXG4gICAgICAvLyBvdGhlciB0aGFuIHByb3BzICYgbGlzdGVuZXJzICYgc2xvdFxyXG5cclxuICAgICAgLy8gd29yayBhcm91bmQgZmxvd1xyXG4gICAgICB2YXIgc2xvdCA9IGRhdGEuc2xvdDtcclxuICAgICAgZGF0YSA9IHt9O1xyXG4gICAgICBpZiAoc2xvdCkge1xyXG4gICAgICAgIGRhdGEuc2xvdCA9IHNsb3Q7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBpbnN0YWxsIGNvbXBvbmVudCBtYW5hZ2VtZW50IGhvb2tzIG9udG8gdGhlIHBsYWNlaG9sZGVyIG5vZGVcclxuICAgIGluc3RhbGxDb21wb25lbnRIb29rcyhkYXRhKTtcclxuXHJcbiAgICAvLyByZXR1cm4gYSBwbGFjZWhvbGRlciB2bm9kZVxyXG4gICAgdmFyIG5hbWUgPSBDdG9yLm9wdGlvbnMubmFtZSB8fCB0YWc7XHJcbiAgICB2YXIgdm5vZGUgPSBuZXcgVk5vZGUoXHJcbiAgICAgIChcInZ1ZS1jb21wb25lbnQtXCIgKyAoQ3Rvci5jaWQpICsgKG5hbWUgPyAoXCItXCIgKyBuYW1lKSA6ICcnKSksXHJcbiAgICAgIGRhdGEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHQsXHJcbiAgICAgIHsgQ3RvcjogQ3RvciwgcHJvcHNEYXRhOiBwcm9wc0RhdGEsIGxpc3RlbmVyczogbGlzdGVuZXJzLCB0YWc6IHRhZywgY2hpbGRyZW46IGNoaWxkcmVuIH0sXHJcbiAgICAgIGFzeW5jRmFjdG9yeVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBXZWV4IHNwZWNpZmljOiBpbnZva2UgcmVjeWNsZS1saXN0IG9wdGltaXplZCBAcmVuZGVyIGZ1bmN0aW9uIGZvclxyXG4gICAgLy8gZXh0cmFjdGluZyBjZWxsLXNsb3QgdGVtcGxhdGUuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vSGFua3MxMDEwMC93ZWV4LW5hdGl2ZS1kaXJlY3RpdmUvdHJlZS9tYXN0ZXIvY29tcG9uZW50XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIHJldHVybiB2bm9kZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZShcclxuICAgIHZub2RlLCAvLyB3ZSBrbm93IGl0J3MgTW91bnRlZENvbXBvbmVudFZOb2RlIGJ1dCBmbG93IGRvZXNuJ3RcclxuICAgIHBhcmVudCwgLy8gYWN0aXZlSW5zdGFuY2UgaW4gbGlmZWN5Y2xlIHN0YXRlXHJcbiAgICBwYXJlbnRFbG0sXHJcbiAgICByZWZFbG1cclxuICApIHtcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICBfaXNDb21wb25lbnQ6IHRydWUsXHJcbiAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICBfcGFyZW50Vm5vZGU6IHZub2RlLFxyXG4gICAgICBfcGFyZW50RWxtOiBwYXJlbnRFbG0gfHwgbnVsbCxcclxuICAgICAgX3JlZkVsbTogcmVmRWxtIHx8IG51bGxcclxuICAgIH07XHJcbiAgICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGUgcmVuZGVyIGZ1bmN0aW9uc1xyXG4gICAgdmFyIGlubGluZVRlbXBsYXRlID0gdm5vZGUuZGF0YS5pbmxpbmVUZW1wbGF0ZTtcclxuICAgIGlmIChpc0RlZihpbmxpbmVUZW1wbGF0ZSkpIHtcclxuICAgICAgb3B0aW9ucy5yZW5kZXIgPSBpbmxpbmVUZW1wbGF0ZS5yZW5kZXI7XHJcbiAgICAgIG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zID0gaW5saW5lVGVtcGxhdGUuc3RhdGljUmVuZGVyRm5zO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyB2bm9kZS5jb21wb25lbnRPcHRpb25zLkN0b3Iob3B0aW9ucylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluc3RhbGxDb21wb25lbnRIb29rcyhkYXRhKSB7XHJcbiAgICB2YXIgaG9va3MgPSBkYXRhLmhvb2sgfHwgKGRhdGEuaG9vayA9IHt9KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaG9va3NUb01lcmdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBrZXkgPSBob29rc1RvTWVyZ2VbaV07XHJcbiAgICAgIGhvb2tzW2tleV0gPSBjb21wb25lbnRWTm9kZUhvb2tzW2tleV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyB0cmFuc2Zvcm0gY29tcG9uZW50IHYtbW9kZWwgaW5mbyAodmFsdWUgYW5kIGNhbGxiYWNrKSBpbnRvXHJcbiAgLy8gcHJvcCBhbmQgZXZlbnQgaGFuZGxlciByZXNwZWN0aXZlbHkuXHJcbiAgZnVuY3Rpb24gdHJhbnNmb3JtTW9kZWwob3B0aW9ucywgZGF0YSkge1xyXG4gICAgdmFyIHByb3AgPSAob3B0aW9ucy5tb2RlbCAmJiBvcHRpb25zLm1vZGVsLnByb3ApIHx8ICd2YWx1ZSc7XHJcbiAgICB2YXIgZXZlbnQgPSAob3B0aW9ucy5tb2RlbCAmJiBvcHRpb25zLm1vZGVsLmV2ZW50KSB8fCAnaW5wdXQnOyAoZGF0YS5wcm9wcyB8fCAoZGF0YS5wcm9wcyA9IHt9KSlbcHJvcF0gPSBkYXRhLm1vZGVsLnZhbHVlO1xyXG4gICAgdmFyIG9uID0gZGF0YS5vbiB8fCAoZGF0YS5vbiA9IHt9KTtcclxuICAgIGlmIChpc0RlZihvbltldmVudF0pKSB7XHJcbiAgICAgIG9uW2V2ZW50XSA9IFtkYXRhLm1vZGVsLmNhbGxiYWNrXS5jb25jYXQob25bZXZlbnRdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9uW2V2ZW50XSA9IGRhdGEubW9kZWwuY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIFNJTVBMRV9OT1JNQUxJWkUgPSAxO1xyXG4gIHZhciBBTFdBWVNfTk9STUFMSVpFID0gMjtcclxuXHJcbiAgLy8gd3JhcHBlciBmdW5jdGlvbiBmb3IgcHJvdmlkaW5nIGEgbW9yZSBmbGV4aWJsZSBpbnRlcmZhY2VcclxuICAvLyB3aXRob3V0IGdldHRpbmcgeWVsbGVkIGF0IGJ5IGZsb3dcclxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KFxyXG4gICAgY29udGV4dCxcclxuICAgIHRhZyxcclxuICAgIGRhdGEsXHJcbiAgICBjaGlsZHJlbixcclxuICAgIG5vcm1hbGl6YXRpb25UeXBlLFxyXG4gICAgYWx3YXlzTm9ybWFsaXplXHJcbiAgKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSB8fCBpc1ByaW1pdGl2ZShkYXRhKSkge1xyXG4gICAgICBub3JtYWxpemF0aW9uVHlwZSA9IGNoaWxkcmVuO1xyXG4gICAgICBjaGlsZHJlbiA9IGRhdGE7XHJcbiAgICAgIGRhdGEgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNUcnVlKGFsd2F5c05vcm1hbGl6ZSkpIHtcclxuICAgICAgbm9ybWFsaXphdGlvblR5cGUgPSBBTFdBWVNfTk9STUFMSVpFO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9jcmVhdGVFbGVtZW50KGNvbnRleHQsIHRhZywgZGF0YSwgY2hpbGRyZW4sIG5vcm1hbGl6YXRpb25UeXBlKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2NyZWF0ZUVsZW1lbnQoXHJcbiAgICBjb250ZXh0LFxyXG4gICAgdGFnLFxyXG4gICAgZGF0YSxcclxuICAgIGNoaWxkcmVuLFxyXG4gICAgbm9ybWFsaXphdGlvblR5cGVcclxuICApIHtcclxuICAgIGlmIChpc0RlZihkYXRhKSAmJiBpc0RlZigoZGF0YSkuX19vYl9fKSkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgIFwiQXZvaWQgdXNpbmcgb2JzZXJ2ZWQgZGF0YSBvYmplY3QgYXMgdm5vZGUgZGF0YTogXCIgKyAoSlNPTi5zdHJpbmdpZnkoZGF0YSkpICsgXCJcXG5cIiArXHJcbiAgICAgICAgJ0Fsd2F5cyBjcmVhdGUgZnJlc2ggdm5vZGUgZGF0YSBvYmplY3RzIGluIGVhY2ggcmVuZGVyIScsXHJcbiAgICAgICAgY29udGV4dFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gY3JlYXRlRW1wdHlWTm9kZSgpXHJcbiAgICB9XHJcbiAgICAvLyBvYmplY3Qgc3ludGF4IGluIHYtYmluZFxyXG4gICAgaWYgKGlzRGVmKGRhdGEpICYmIGlzRGVmKGRhdGEuaXMpKSB7XHJcbiAgICAgIHRhZyA9IGRhdGEuaXM7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRhZykge1xyXG4gICAgICAvLyBpbiBjYXNlIG9mIGNvbXBvbmVudCA6aXMgc2V0IHRvIGZhbHN5IHZhbHVlXHJcbiAgICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcclxuICAgIH1cclxuICAgIC8vIHdhcm4gYWdhaW5zdCBub24tcHJpbWl0aXZlIGtleVxyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXHJcbiAgICAgIGlzRGVmKGRhdGEpICYmIGlzRGVmKGRhdGEua2V5KSAmJiAhaXNQcmltaXRpdmUoZGF0YS5rZXkpXHJcbiAgICApIHtcclxuICAgICAge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAnQXZvaWQgdXNpbmcgbm9uLXByaW1pdGl2ZSB2YWx1ZSBhcyBrZXksICcgK1xyXG4gICAgICAgICAgJ3VzZSBzdHJpbmcvbnVtYmVyIHZhbHVlIGluc3RlYWQuJyxcclxuICAgICAgICAgIGNvbnRleHRcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBzdXBwb3J0IHNpbmdsZSBmdW5jdGlvbiBjaGlsZHJlbiBhcyBkZWZhdWx0IHNjb3BlZCBzbG90XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiZcclxuICAgICAgdHlwZW9mIGNoaWxkcmVuWzBdID09PSAnZnVuY3Rpb24nXHJcbiAgICApIHtcclxuICAgICAgZGF0YSA9IGRhdGEgfHwge307XHJcbiAgICAgIGRhdGEuc2NvcGVkU2xvdHMgPSB7IGRlZmF1bHQ6IGNoaWxkcmVuWzBdIH07XHJcbiAgICAgIGNoaWxkcmVuLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAobm9ybWFsaXphdGlvblR5cGUgPT09IEFMV0FZU19OT1JNQUxJWkUpIHtcclxuICAgICAgY2hpbGRyZW4gPSBub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbik7XHJcbiAgICB9IGVsc2UgaWYgKG5vcm1hbGl6YXRpb25UeXBlID09PSBTSU1QTEVfTk9STUFMSVpFKSB7XHJcbiAgICAgIGNoaWxkcmVuID0gc2ltcGxlTm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gICAgdmFyIHZub2RlLCBucztcclxuICAgIGlmICh0eXBlb2YgdGFnID09PSAnc3RyaW5nJykge1xyXG4gICAgICB2YXIgQ3RvcjtcclxuICAgICAgbnMgPSAoY29udGV4dC4kdm5vZGUgJiYgY29udGV4dC4kdm5vZGUubnMpIHx8IGNvbmZpZy5nZXRUYWdOYW1lc3BhY2UodGFnKTtcclxuICAgICAgaWYgKGNvbmZpZy5pc1Jlc2VydmVkVGFnKHRhZykpIHtcclxuICAgICAgICAvLyBwbGF0Zm9ybSBidWlsdC1pbiBlbGVtZW50c1xyXG4gICAgICAgIHZub2RlID0gbmV3IFZOb2RlKFxyXG4gICAgICAgICAgY29uZmlnLnBhcnNlUGxhdGZvcm1UYWdOYW1lKHRhZyksIGRhdGEsIGNoaWxkcmVuLFxyXG4gICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHRcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzRGVmKEN0b3IgPSByZXNvbHZlQXNzZXQoY29udGV4dC4kb3B0aW9ucywgJ2NvbXBvbmVudHMnLCB0YWcpKSkge1xyXG4gICAgICAgIC8vIGNvbXBvbmVudFxyXG4gICAgICAgIHZub2RlID0gY3JlYXRlQ29tcG9uZW50KEN0b3IsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuLCB0YWcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHVua25vd24gb3IgdW5saXN0ZWQgbmFtZXNwYWNlZCBlbGVtZW50c1xyXG4gICAgICAgIC8vIGNoZWNrIGF0IHJ1bnRpbWUgYmVjYXVzZSBpdCBtYXkgZ2V0IGFzc2lnbmVkIGEgbmFtZXNwYWNlIHdoZW4gaXRzXHJcbiAgICAgICAgLy8gcGFyZW50IG5vcm1hbGl6ZXMgY2hpbGRyZW5cclxuICAgICAgICB2bm9kZSA9IG5ldyBWTm9kZShcclxuICAgICAgICAgIHRhZywgZGF0YSwgY2hpbGRyZW4sXHJcbiAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGRpcmVjdCBjb21wb25lbnQgb3B0aW9ucyAvIGNvbnN0cnVjdG9yXHJcbiAgICAgIHZub2RlID0gY3JlYXRlQ29tcG9uZW50KHRhZywgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodm5vZGUpKSB7XHJcbiAgICAgIHJldHVybiB2bm9kZVxyXG4gICAgfSBlbHNlIGlmIChpc0RlZih2bm9kZSkpIHtcclxuICAgICAgaWYgKGlzRGVmKG5zKSkgeyBhcHBseU5TKHZub2RlLCBucyk7IH1cclxuICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7IHJlZ2lzdGVyRGVlcEJpbmRpbmdzKGRhdGEpOyB9XHJcbiAgICAgIHJldHVybiB2bm9kZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGNyZWF0ZUVtcHR5Vk5vZGUoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlOUyh2bm9kZSwgbnMsIGZvcmNlKSB7XHJcbiAgICB2bm9kZS5ucyA9IG5zO1xyXG4gICAgaWYgKHZub2RlLnRhZyA9PT0gJ2ZvcmVpZ25PYmplY3QnKSB7XHJcbiAgICAgIC8vIHVzZSBkZWZhdWx0IG5hbWVzcGFjZSBpbnNpZGUgZm9yZWlnbk9iamVjdFxyXG4gICAgICBucyA9IHVuZGVmaW5lZDtcclxuICAgICAgZm9yY2UgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzRGVmKHZub2RlLmNoaWxkcmVuKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHZub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHZub2RlLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChpc0RlZihjaGlsZC50YWcpICYmIChcclxuICAgICAgICAgIGlzVW5kZWYoY2hpbGQubnMpIHx8IChpc1RydWUoZm9yY2UpICYmIGNoaWxkLnRhZyAhPT0gJ3N2ZycpKSkge1xyXG4gICAgICAgICAgYXBwbHlOUyhjaGlsZCwgbnMsIGZvcmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJlZiAjNTMxOFxyXG4gIC8vIG5lY2Vzc2FyeSB0byBlbnN1cmUgcGFyZW50IHJlLXJlbmRlciB3aGVuIGRlZXAgYmluZGluZ3MgbGlrZSA6c3R5bGUgYW5kXHJcbiAgLy8gOmNsYXNzIGFyZSB1c2VkIG9uIHNsb3Qgbm9kZXNcclxuICBmdW5jdGlvbiByZWdpc3RlckRlZXBCaW5kaW5ncyhkYXRhKSB7XHJcbiAgICBpZiAoaXNPYmplY3QoZGF0YS5zdHlsZSkpIHtcclxuICAgICAgdHJhdmVyc2UoZGF0YS5zdHlsZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNPYmplY3QoZGF0YS5jbGFzcykpIHtcclxuICAgICAgdHJhdmVyc2UoZGF0YS5jbGFzcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaW5pdFJlbmRlcih2bSkge1xyXG4gICAgdm0uX3Zub2RlID0gbnVsbDsgLy8gdGhlIHJvb3Qgb2YgdGhlIGNoaWxkIHRyZWVcclxuICAgIHZtLl9zdGF0aWNUcmVlcyA9IG51bGw7IC8vIHYtb25jZSBjYWNoZWQgdHJlZXNcclxuICAgIHZhciBvcHRpb25zID0gdm0uJG9wdGlvbnM7XHJcbiAgICB2YXIgcGFyZW50Vm5vZGUgPSB2bS4kdm5vZGUgPSBvcHRpb25zLl9wYXJlbnRWbm9kZTsgLy8gdGhlIHBsYWNlaG9sZGVyIG5vZGUgaW4gcGFyZW50IHRyZWVcclxuICAgIHZhciByZW5kZXJDb250ZXh0ID0gcGFyZW50Vm5vZGUgJiYgcGFyZW50Vm5vZGUuY29udGV4dDtcclxuICAgIHZtLiRzbG90cyA9IHJlc29sdmVTbG90cyhvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiwgcmVuZGVyQ29udGV4dCk7XHJcbiAgICB2bS4kc2NvcGVkU2xvdHMgPSBlbXB0eU9iamVjdDtcclxuICAgIC8vIGJpbmQgdGhlIGNyZWF0ZUVsZW1lbnQgZm4gdG8gdGhpcyBpbnN0YW5jZVxyXG4gICAgLy8gc28gdGhhdCB3ZSBnZXQgcHJvcGVyIHJlbmRlciBjb250ZXh0IGluc2lkZSBpdC5cclxuICAgIC8vIGFyZ3Mgb3JkZXI6IHRhZywgZGF0YSwgY2hpbGRyZW4sIG5vcm1hbGl6YXRpb25UeXBlLCBhbHdheXNOb3JtYWxpemVcclxuICAgIC8vIGludGVybmFsIHZlcnNpb24gaXMgdXNlZCBieSByZW5kZXIgZnVuY3Rpb25zIGNvbXBpbGVkIGZyb20gdGVtcGxhdGVzXHJcbiAgICB2bS5fYyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KHZtLCBhLCBiLCBjLCBkLCBmYWxzZSk7IH07XHJcbiAgICAvLyBub3JtYWxpemF0aW9uIGlzIGFsd2F5cyBhcHBsaWVkIGZvciB0aGUgcHVibGljIHZlcnNpb24sIHVzZWQgaW5cclxuICAgIC8vIHVzZXItd3JpdHRlbiByZW5kZXIgZnVuY3Rpb25zLlxyXG4gICAgdm0uJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudCh2bSwgYSwgYiwgYywgZCwgdHJ1ZSk7IH07XHJcblxyXG4gICAgLy8gJGF0dHJzICYgJGxpc3RlbmVycyBhcmUgZXhwb3NlZCBmb3IgZWFzaWVyIEhPQyBjcmVhdGlvbi5cclxuICAgIC8vIHRoZXkgbmVlZCB0byBiZSByZWFjdGl2ZSBzbyB0aGF0IEhPQ3MgdXNpbmcgdGhlbSBhcmUgYWx3YXlzIHVwZGF0ZWRcclxuICAgIHZhciBwYXJlbnREYXRhID0gcGFyZW50Vm5vZGUgJiYgcGFyZW50Vm5vZGUuZGF0YTtcclxuXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAge1xyXG4gICAgICBkZWZpbmVSZWFjdGl2ZSh2bSwgJyRhdHRycycsIHBhcmVudERhdGEgJiYgcGFyZW50RGF0YS5hdHRycyB8fCBlbXB0eU9iamVjdCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICFpc1VwZGF0aW5nQ2hpbGRDb21wb25lbnQgJiYgd2FybihcIiRhdHRycyBpcyByZWFkb25seS5cIiwgdm0pO1xyXG4gICAgICB9LCB0cnVlKTtcclxuICAgICAgZGVmaW5lUmVhY3RpdmUodm0sICckbGlzdGVuZXJzJywgb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzIHx8IGVtcHR5T2JqZWN0LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgIWlzVXBkYXRpbmdDaGlsZENvbXBvbmVudCAmJiB3YXJuKFwiJGxpc3RlbmVycyBpcyByZWFkb25seS5cIiwgdm0pO1xyXG4gICAgICB9LCB0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlck1peGluKFZ1ZSkge1xyXG4gICAgLy8gaW5zdGFsbCBydW50aW1lIGNvbnZlbmllbmNlIGhlbHBlcnNcclxuICAgIGluc3RhbGxSZW5kZXJIZWxwZXJzKFZ1ZS5wcm90b3R5cGUpO1xyXG5cclxuICAgIFZ1ZS5wcm90b3R5cGUuJG5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgIHJldHVybiBuZXh0VGljayhmbiwgdGhpcylcclxuICAgIH07XHJcblxyXG4gICAgVnVlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICB2YXIgcmVmID0gdm0uJG9wdGlvbnM7XHJcbiAgICAgIHZhciByZW5kZXIgPSByZWYucmVuZGVyO1xyXG4gICAgICB2YXIgX3BhcmVudFZub2RlID0gcmVmLl9wYXJlbnRWbm9kZTtcclxuXHJcbiAgICAgIC8vIHJlc2V0IF9yZW5kZXJlZCBmbGFnIG9uIHNsb3RzIGZvciBkdXBsaWNhdGUgc2xvdCBjaGVja1xyXG4gICAgICB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZtLiRzbG90cykge1xyXG4gICAgICAgICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICAgICAgICB2bS4kc2xvdHNba2V5XS5fcmVuZGVyZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfcGFyZW50Vm5vZGUpIHtcclxuICAgICAgICB2bS4kc2NvcGVkU2xvdHMgPSBfcGFyZW50Vm5vZGUuZGF0YS5zY29wZWRTbG90cyB8fCBlbXB0eU9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2V0IHBhcmVudCB2bm9kZS4gdGhpcyBhbGxvd3MgcmVuZGVyIGZ1bmN0aW9ucyB0byBoYXZlIGFjY2Vzc1xyXG4gICAgICAvLyB0byB0aGUgZGF0YSBvbiB0aGUgcGxhY2Vob2xkZXIgbm9kZS5cclxuICAgICAgdm0uJHZub2RlID0gX3BhcmVudFZub2RlO1xyXG4gICAgICAvLyByZW5kZXIgc2VsZlxyXG4gICAgICB2YXIgdm5vZGU7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdm5vZGUgPSByZW5kZXIuY2FsbCh2bS5fcmVuZGVyUHJveHksIHZtLiRjcmVhdGVFbGVtZW50KTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCBcInJlbmRlclwiKTtcclxuICAgICAgICAvLyByZXR1cm4gZXJyb3IgcmVuZGVyIHJlc3VsdCxcclxuICAgICAgICAvLyBvciBwcmV2aW91cyB2bm9kZSB0byBwcmV2ZW50IHJlbmRlciBlcnJvciBjYXVzaW5nIGJsYW5rIGNvbXBvbmVudFxyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKHZtLiRvcHRpb25zLnJlbmRlckVycm9yKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgdm5vZGUgPSB2bS4kb3B0aW9ucy5yZW5kZXJFcnJvci5jYWxsKHZtLl9yZW5kZXJQcm94eSwgdm0uJGNyZWF0ZUVsZW1lbnQsIGUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoZSwgdm0sIFwicmVuZGVyRXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgdm5vZGUgPSB2bS5fdm5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZub2RlID0gdm0uX3Zub2RlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gZW1wdHkgdm5vZGUgaW4gY2FzZSB0aGUgcmVuZGVyIGZ1bmN0aW9uIGVycm9yZWQgb3V0XHJcbiAgICAgIGlmICghKHZub2RlIGluc3RhbmNlb2YgVk5vZGUpKSB7XHJcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIEFycmF5LmlzQXJyYXkodm5vZGUpKSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAnTXVsdGlwbGUgcm9vdCBub2RlcyByZXR1cm5lZCBmcm9tIHJlbmRlciBmdW5jdGlvbi4gUmVuZGVyIGZ1bmN0aW9uICcgK1xyXG4gICAgICAgICAgICAnc2hvdWxkIHJldHVybiBhIHNpbmdsZSByb290IG5vZGUuJyxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZub2RlID0gY3JlYXRlRW1wdHlWTm9kZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBwYXJlbnRcclxuICAgICAgdm5vZGUucGFyZW50ID0gX3BhcmVudFZub2RlO1xyXG4gICAgICByZXR1cm4gdm5vZGVcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIHVpZCQzID0gMDtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdE1peGluKFZ1ZSkge1xyXG4gICAgVnVlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIC8vIGEgdWlkXHJcbiAgICAgIHZtLl91aWQgPSB1aWQkMysrO1xyXG5cclxuICAgICAgdmFyIHN0YXJ0VGFnLCBlbmRUYWc7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgY29uZmlnLnBlcmZvcm1hbmNlICYmIG1hcmspIHtcclxuICAgICAgICBzdGFydFRhZyA9IFwidnVlLXBlcmYtc3RhcnQ6XCIgKyAodm0uX3VpZCk7XHJcbiAgICAgICAgZW5kVGFnID0gXCJ2dWUtcGVyZi1lbmQ6XCIgKyAodm0uX3VpZCk7XHJcbiAgICAgICAgbWFyayhzdGFydFRhZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGEgZmxhZyB0byBhdm9pZCB0aGlzIGJlaW5nIG9ic2VydmVkXHJcbiAgICAgIHZtLl9pc1Z1ZSA9IHRydWU7XHJcbiAgICAgIC8vIG1lcmdlIG9wdGlvbnNcclxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5faXNDb21wb25lbnQpIHtcclxuICAgICAgICAvLyBvcHRpbWl6ZSBpbnRlcm5hbCBjb21wb25lbnQgaW5zdGFudGlhdGlvblxyXG4gICAgICAgIC8vIHNpbmNlIGR5bmFtaWMgb3B0aW9ucyBtZXJnaW5nIGlzIHByZXR0eSBzbG93LCBhbmQgbm9uZSBvZiB0aGVcclxuICAgICAgICAvLyBpbnRlcm5hbCBjb21wb25lbnQgb3B0aW9ucyBuZWVkcyBzcGVjaWFsIHRyZWF0bWVudC5cclxuICAgICAgICBpbml0SW50ZXJuYWxDb21wb25lbnQodm0sIG9wdGlvbnMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZtLiRvcHRpb25zID0gbWVyZ2VPcHRpb25zKFxyXG4gICAgICAgICAgcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyh2bS5jb25zdHJ1Y3RvciksXHJcbiAgICAgICAgICBvcHRpb25zIHx8IHt9LFxyXG4gICAgICAgICAgdm1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIHtcclxuICAgICAgICBpbml0UHJveHkodm0pO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGV4cG9zZSByZWFsIHNlbGZcclxuICAgICAgdm0uX3NlbGYgPSB2bTtcclxuICAgICAgaW5pdExpZmVjeWNsZSh2bSk7XHJcbiAgICAgIGluaXRFdmVudHModm0pO1xyXG4gICAgICBpbml0UmVuZGVyKHZtKTtcclxuICAgICAgY2FsbEhvb2sodm0sICdiZWZvcmVDcmVhdGUnKTtcclxuICAgICAgaW5pdEluamVjdGlvbnModm0pOyAvLyByZXNvbHZlIGluamVjdGlvbnMgYmVmb3JlIGRhdGEvcHJvcHNcclxuICAgICAgaW5pdFN0YXRlKHZtKTtcclxuICAgICAgaW5pdFByb3ZpZGUodm0pOyAvLyByZXNvbHZlIHByb3ZpZGUgYWZ0ZXIgZGF0YS9wcm9wc1xyXG4gICAgICBjYWxsSG9vayh2bSwgJ2NyZWF0ZWQnKTtcclxuXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgY29uZmlnLnBlcmZvcm1hbmNlICYmIG1hcmspIHtcclxuICAgICAgICB2bS5fbmFtZSA9IGZvcm1hdENvbXBvbmVudE5hbWUodm0sIGZhbHNlKTtcclxuICAgICAgICBtYXJrKGVuZFRhZyk7XHJcbiAgICAgICAgbWVhc3VyZSgoXCJ2dWUgXCIgKyAodm0uX25hbWUpICsgXCIgaW5pdFwiKSwgc3RhcnRUYWcsIGVuZFRhZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh2bS4kb3B0aW9ucy5lbCkge1xyXG4gICAgICAgIHZtLiRtb3VudCh2bS4kb3B0aW9ucy5lbCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0SW50ZXJuYWxDb21wb25lbnQodm0sIG9wdGlvbnMpIHtcclxuICAgIHZhciBvcHRzID0gdm0uJG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHZtLmNvbnN0cnVjdG9yLm9wdGlvbnMpO1xyXG4gICAgLy8gZG9pbmcgdGhpcyBiZWNhdXNlIGl0J3MgZmFzdGVyIHRoYW4gZHluYW1pYyBlbnVtZXJhdGlvbi5cclxuICAgIHZhciBwYXJlbnRWbm9kZSA9IG9wdGlvbnMuX3BhcmVudFZub2RlO1xyXG4gICAgb3B0cy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudDtcclxuICAgIG9wdHMuX3BhcmVudFZub2RlID0gcGFyZW50Vm5vZGU7XHJcbiAgICBvcHRzLl9wYXJlbnRFbG0gPSBvcHRpb25zLl9wYXJlbnRFbG07XHJcbiAgICBvcHRzLl9yZWZFbG0gPSBvcHRpb25zLl9yZWZFbG07XHJcblxyXG4gICAgdmFyIHZub2RlQ29tcG9uZW50T3B0aW9ucyA9IHBhcmVudFZub2RlLmNvbXBvbmVudE9wdGlvbnM7XHJcbiAgICBvcHRzLnByb3BzRGF0YSA9IHZub2RlQ29tcG9uZW50T3B0aW9ucy5wcm9wc0RhdGE7XHJcbiAgICBvcHRzLl9wYXJlbnRMaXN0ZW5lcnMgPSB2bm9kZUNvbXBvbmVudE9wdGlvbnMubGlzdGVuZXJzO1xyXG4gICAgb3B0cy5fcmVuZGVyQ2hpbGRyZW4gPSB2bm9kZUNvbXBvbmVudE9wdGlvbnMuY2hpbGRyZW47XHJcbiAgICBvcHRzLl9jb21wb25lbnRUYWcgPSB2bm9kZUNvbXBvbmVudE9wdGlvbnMudGFnO1xyXG5cclxuICAgIGlmIChvcHRpb25zLnJlbmRlcikge1xyXG4gICAgICBvcHRzLnJlbmRlciA9IG9wdGlvbnMucmVuZGVyO1xyXG4gICAgICBvcHRzLnN0YXRpY1JlbmRlckZucyA9IG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyhDdG9yKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IEN0b3Iub3B0aW9ucztcclxuICAgIGlmIChDdG9yLnN1cGVyKSB7XHJcbiAgICAgIHZhciBzdXBlck9wdGlvbnMgPSByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3Iuc3VwZXIpO1xyXG4gICAgICB2YXIgY2FjaGVkU3VwZXJPcHRpb25zID0gQ3Rvci5zdXBlck9wdGlvbnM7XHJcbiAgICAgIGlmIChzdXBlck9wdGlvbnMgIT09IGNhY2hlZFN1cGVyT3B0aW9ucykge1xyXG4gICAgICAgIC8vIHN1cGVyIG9wdGlvbiBjaGFuZ2VkLFxyXG4gICAgICAgIC8vIG5lZWQgdG8gcmVzb2x2ZSBuZXcgb3B0aW9ucy5cclxuICAgICAgICBDdG9yLnN1cGVyT3B0aW9ucyA9IHN1cGVyT3B0aW9ucztcclxuICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGxhdGUtbW9kaWZpZWQvYXR0YWNoZWQgb3B0aW9ucyAoIzQ5NzYpXHJcbiAgICAgICAgdmFyIG1vZGlmaWVkT3B0aW9ucyA9IHJlc29sdmVNb2RpZmllZE9wdGlvbnMoQ3Rvcik7XHJcbiAgICAgICAgLy8gdXBkYXRlIGJhc2UgZXh0ZW5kIG9wdGlvbnNcclxuICAgICAgICBpZiAobW9kaWZpZWRPcHRpb25zKSB7XHJcbiAgICAgICAgICBleHRlbmQoQ3Rvci5leHRlbmRPcHRpb25zLCBtb2RpZmllZE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcHRpb25zID0gQ3Rvci5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHN1cGVyT3B0aW9ucywgQ3Rvci5leHRlbmRPcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudHNbb3B0aW9ucy5uYW1lXSA9IEN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3B0aW9uc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVzb2x2ZU1vZGlmaWVkT3B0aW9ucyhDdG9yKSB7XHJcbiAgICB2YXIgbW9kaWZpZWQ7XHJcbiAgICB2YXIgbGF0ZXN0ID0gQ3Rvci5vcHRpb25zO1xyXG4gICAgdmFyIGV4dGVuZGVkID0gQ3Rvci5leHRlbmRPcHRpb25zO1xyXG4gICAgdmFyIHNlYWxlZCA9IEN0b3Iuc2VhbGVkT3B0aW9ucztcclxuICAgIGZvciAodmFyIGtleSBpbiBsYXRlc3QpIHtcclxuICAgICAgaWYgKGxhdGVzdFtrZXldICE9PSBzZWFsZWRba2V5XSkge1xyXG4gICAgICAgIGlmICghbW9kaWZpZWQpIHsgbW9kaWZpZWQgPSB7fTsgfVxyXG4gICAgICAgIG1vZGlmaWVkW2tleV0gPSBkZWR1cGUobGF0ZXN0W2tleV0sIGV4dGVuZGVkW2tleV0sIHNlYWxlZFtrZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vZGlmaWVkXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkZWR1cGUobGF0ZXN0LCBleHRlbmRlZCwgc2VhbGVkKSB7XHJcbiAgICAvLyBjb21wYXJlIGxhdGVzdCBhbmQgc2VhbGVkIHRvIGVuc3VyZSBsaWZlY3ljbGUgaG9va3Mgd29uJ3QgYmUgZHVwbGljYXRlZFxyXG4gICAgLy8gYmV0d2VlbiBtZXJnZXNcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGxhdGVzdCkpIHtcclxuICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICBzZWFsZWQgPSBBcnJheS5pc0FycmF5KHNlYWxlZCkgPyBzZWFsZWQgOiBbc2VhbGVkXTtcclxuICAgICAgZXh0ZW5kZWQgPSBBcnJheS5pc0FycmF5KGV4dGVuZGVkKSA/IGV4dGVuZGVkIDogW2V4dGVuZGVkXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRlc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBwdXNoIG9yaWdpbmFsIG9wdGlvbnMgYW5kIG5vdCBzZWFsZWQgb3B0aW9ucyB0byBleGNsdWRlIGR1cGxpY2F0ZWQgb3B0aW9uc1xyXG4gICAgICAgIGlmIChleHRlbmRlZC5pbmRleE9mKGxhdGVzdFtpXSkgPj0gMCB8fCBzZWFsZWQuaW5kZXhPZihsYXRlc3RbaV0pIDwgMCkge1xyXG4gICAgICAgICAgcmVzLnB1c2gobGF0ZXN0W2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGxhdGVzdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVnVlKG9wdGlvbnMpIHtcclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgICAhKHRoaXMgaW5zdGFuY2VvZiBWdWUpXHJcbiAgICApIHtcclxuICAgICAgd2FybignVnVlIGlzIGEgY29uc3RydWN0b3IgYW5kIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgYG5ld2Aga2V5d29yZCcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5faW5pdChvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIGluaXRNaXhpbihWdWUpO1xyXG4gIHN0YXRlTWl4aW4oVnVlKTtcclxuICBldmVudHNNaXhpbihWdWUpO1xyXG4gIGxpZmVjeWNsZU1peGluKFZ1ZSk7XHJcbiAgcmVuZGVyTWl4aW4oVnVlKTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGluaXRVc2UoVnVlKSB7XHJcbiAgICBWdWUudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xyXG4gICAgICB2YXIgaW5zdGFsbGVkUGx1Z2lucyA9ICh0aGlzLl9pbnN0YWxsZWRQbHVnaW5zIHx8ICh0aGlzLl9pbnN0YWxsZWRQbHVnaW5zID0gW10pKTtcclxuICAgICAgaWYgKGluc3RhbGxlZFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pID4gLTEpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcclxuICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cywgMSk7XHJcbiAgICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcclxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHBsdWdpbi5pbnN0YWxsLmFwcGx5KHBsdWdpbiwgYXJncyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBsdWdpbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgICBpbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaW5pdE1peGluJDEoVnVlKSB7XHJcbiAgICBWdWUubWl4aW4gPSBmdW5jdGlvbiAobWl4aW4pIHtcclxuICAgICAgdGhpcy5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHRoaXMub3B0aW9ucywgbWl4aW4pO1xyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBpbml0RXh0ZW5kKFZ1ZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBFYWNoIGluc3RhbmNlIGNvbnN0cnVjdG9yLCBpbmNsdWRpbmcgVnVlLCBoYXMgYSB1bmlxdWVcclxuICAgICAqIGNpZC4gVGhpcyBlbmFibGVzIHVzIHRvIGNyZWF0ZSB3cmFwcGVkIFwiY2hpbGRcclxuICAgICAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxyXG4gICAgICovXHJcbiAgICBWdWUuY2lkID0gMDtcclxuICAgIHZhciBjaWQgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xhc3MgaW5oZXJpdGFuY2VcclxuICAgICAqL1xyXG4gICAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XHJcbiAgICAgIGV4dGVuZE9wdGlvbnMgPSBleHRlbmRPcHRpb25zIHx8IHt9O1xyXG4gICAgICB2YXIgU3VwZXIgPSB0aGlzO1xyXG4gICAgICB2YXIgU3VwZXJJZCA9IFN1cGVyLmNpZDtcclxuICAgICAgdmFyIGNhY2hlZEN0b3JzID0gZXh0ZW5kT3B0aW9ucy5fQ3RvciB8fCAoZXh0ZW5kT3B0aW9ucy5fQ3RvciA9IHt9KTtcclxuICAgICAgaWYgKGNhY2hlZEN0b3JzW1N1cGVySWRdKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlZEN0b3JzW1N1cGVySWRdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBuYW1lID0gZXh0ZW5kT3B0aW9ucy5uYW1lIHx8IFN1cGVyLm9wdGlvbnMubmFtZTtcclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIG5hbWUpIHtcclxuICAgICAgICB2YWxpZGF0ZUNvbXBvbmVudE5hbWUobmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBTdWIgPSBmdW5jdGlvbiBWdWVDb21wb25lbnQob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX2luaXQob3B0aW9ucyk7XHJcbiAgICAgIH07XHJcbiAgICAgIFN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cGVyLnByb3RvdHlwZSk7XHJcbiAgICAgIFN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWI7XHJcbiAgICAgIFN1Yi5jaWQgPSBjaWQrKztcclxuICAgICAgU3ViLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXHJcbiAgICAgICAgU3VwZXIub3B0aW9ucyxcclxuICAgICAgICBleHRlbmRPcHRpb25zXHJcbiAgICAgICk7XHJcbiAgICAgIFN1Ylsnc3VwZXInXSA9IFN1cGVyO1xyXG5cclxuICAgICAgLy8gRm9yIHByb3BzIGFuZCBjb21wdXRlZCBwcm9wZXJ0aWVzLCB3ZSBkZWZpbmUgdGhlIHByb3h5IGdldHRlcnMgb25cclxuICAgICAgLy8gdGhlIFZ1ZSBpbnN0YW5jZXMgYXQgZXh0ZW5zaW9uIHRpbWUsIG9uIHRoZSBleHRlbmRlZCBwcm90b3R5cGUuIFRoaXNcclxuICAgICAgLy8gYXZvaWRzIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxscyBmb3IgZWFjaCBpbnN0YW5jZSBjcmVhdGVkLlxyXG4gICAgICBpZiAoU3ViLm9wdGlvbnMucHJvcHMpIHtcclxuICAgICAgICBpbml0UHJvcHMkMShTdWIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChTdWIub3B0aW9ucy5jb21wdXRlZCkge1xyXG4gICAgICAgIGluaXRDb21wdXRlZCQxKFN1Yik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFsbG93IGZ1cnRoZXIgZXh0ZW5zaW9uL21peGluL3BsdWdpbiB1c2FnZVxyXG4gICAgICBTdWIuZXh0ZW5kID0gU3VwZXIuZXh0ZW5kO1xyXG4gICAgICBTdWIubWl4aW4gPSBTdXBlci5taXhpbjtcclxuICAgICAgU3ViLnVzZSA9IFN1cGVyLnVzZTtcclxuXHJcbiAgICAgIC8vIGNyZWF0ZSBhc3NldCByZWdpc3RlcnMsIHNvIGV4dGVuZGVkIGNsYXNzZXNcclxuICAgICAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxyXG4gICAgICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgU3ViW3R5cGVdID0gU3VwZXJbdHlwZV07XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBlbmFibGUgcmVjdXJzaXZlIHNlbGYtbG9va3VwXHJcbiAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgU3ViLm9wdGlvbnMuY29tcG9uZW50c1tuYW1lXSA9IFN1YjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXIgb3B0aW9ucyBhdCBleHRlbnNpb24gdGltZS5cclxuICAgICAgLy8gbGF0ZXIgYXQgaW5zdGFudGlhdGlvbiB3ZSBjYW4gY2hlY2sgaWYgU3VwZXIncyBvcHRpb25zIGhhdmVcclxuICAgICAgLy8gYmVlbiB1cGRhdGVkLlxyXG4gICAgICBTdWIuc3VwZXJPcHRpb25zID0gU3VwZXIub3B0aW9ucztcclxuICAgICAgU3ViLmV4dGVuZE9wdGlvbnMgPSBleHRlbmRPcHRpb25zO1xyXG4gICAgICBTdWIuc2VhbGVkT3B0aW9ucyA9IGV4dGVuZCh7fSwgU3ViLm9wdGlvbnMpO1xyXG5cclxuICAgICAgLy8gY2FjaGUgY29uc3RydWN0b3JcclxuICAgICAgY2FjaGVkQ3RvcnNbU3VwZXJJZF0gPSBTdWI7XHJcbiAgICAgIHJldHVybiBTdWJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0UHJvcHMkMShDb21wKSB7XHJcbiAgICB2YXIgcHJvcHMgPSBDb21wLm9wdGlvbnMucHJvcHM7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcclxuICAgICAgcHJveHkoQ29tcC5wcm90b3R5cGUsIFwiX3Byb3BzXCIsIGtleSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0Q29tcHV0ZWQkMShDb21wKSB7XHJcbiAgICB2YXIgY29tcHV0ZWQgPSBDb21wLm9wdGlvbnMuY29tcHV0ZWQ7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcclxuICAgICAgZGVmaW5lQ29tcHV0ZWQoQ29tcC5wcm90b3R5cGUsIGtleSwgY29tcHV0ZWRba2V5XSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaW5pdEFzc2V0UmVnaXN0ZXJzKFZ1ZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMuXHJcbiAgICAgKi9cclxuICAgIEFTU0VUX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgVnVlW3R5cGVdID0gZnVuY3Rpb24gKFxyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGRlZmluaXRpb25cclxuICAgICAgKSB7XHJcbiAgICAgICAgaWYgKCFkZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlID09PSAnY29tcG9uZW50Jykge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZUNvbXBvbmVudE5hbWUoaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnICYmIGlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbi5uYW1lID0gZGVmaW5pdGlvbi5uYW1lIHx8IGlkO1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uID0gdGhpcy5vcHRpb25zLl9iYXNlLmV4dGVuZChkZWZpbml0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh0eXBlID09PSAnZGlyZWN0aXZlJyAmJiB0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uID0geyBiaW5kOiBkZWZpbml0aW9uLCB1cGRhdGU6IGRlZmluaXRpb24gfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVtpZF0gPSBkZWZpbml0aW9uO1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmluaXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBnZXRDb21wb25lbnROYW1lKG9wdHMpIHtcclxuICAgIHJldHVybiBvcHRzICYmIChvcHRzLkN0b3Iub3B0aW9ucy5uYW1lIHx8IG9wdHMudGFnKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWF0Y2hlcyhwYXR0ZXJuLCBuYW1lKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xyXG4gICAgICByZXR1cm4gcGF0dGVybi5pbmRleE9mKG5hbWUpID4gLTFcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiBwYXR0ZXJuLnNwbGl0KCcsJykuaW5kZXhPZihuYW1lKSA+IC0xXHJcbiAgICB9IGVsc2UgaWYgKGlzUmVnRXhwKHBhdHRlcm4pKSB7XHJcbiAgICAgIHJldHVybiBwYXR0ZXJuLnRlc3QobmFtZSlcclxuICAgIH1cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBydW5lQ2FjaGUoa2VlcEFsaXZlSW5zdGFuY2UsIGZpbHRlcikge1xyXG4gICAgdmFyIGNhY2hlID0ga2VlcEFsaXZlSW5zdGFuY2UuY2FjaGU7XHJcbiAgICB2YXIga2V5cyA9IGtlZXBBbGl2ZUluc3RhbmNlLmtleXM7XHJcbiAgICB2YXIgX3Zub2RlID0ga2VlcEFsaXZlSW5zdGFuY2UuX3Zub2RlO1xyXG4gICAgZm9yICh2YXIga2V5IGluIGNhY2hlKSB7XHJcbiAgICAgIHZhciBjYWNoZWROb2RlID0gY2FjaGVba2V5XTtcclxuICAgICAgaWYgKGNhY2hlZE5vZGUpIHtcclxuICAgICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY2FjaGVkTm9kZS5jb21wb25lbnRPcHRpb25zKTtcclxuICAgICAgICBpZiAobmFtZSAmJiAhZmlsdGVyKG5hbWUpKSB7XHJcbiAgICAgICAgICBwcnVuZUNhY2hlRW50cnkoY2FjaGUsIGtleSwga2V5cywgX3Zub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBydW5lQ2FjaGVFbnRyeShcclxuICAgIGNhY2hlLFxyXG4gICAga2V5LFxyXG4gICAga2V5cyxcclxuICAgIGN1cnJlbnRcclxuICApIHtcclxuICAgIHZhciBjYWNoZWQkJDEgPSBjYWNoZVtrZXldO1xyXG4gICAgaWYgKGNhY2hlZCQkMSAmJiAoIWN1cnJlbnQgfHwgY2FjaGVkJCQxLnRhZyAhPT0gY3VycmVudC50YWcpKSB7XHJcbiAgICAgIGNhY2hlZCQkMS5jb21wb25lbnRJbnN0YW5jZS4kZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgY2FjaGVba2V5XSA9IG51bGw7XHJcbiAgICByZW1vdmUoa2V5cywga2V5KTtcclxuICB9XHJcblxyXG4gIHZhciBwYXR0ZXJuVHlwZXMgPSBbU3RyaW5nLCBSZWdFeHAsIEFycmF5XTtcclxuXHJcbiAgdmFyIEtlZXBBbGl2ZSA9IHtcclxuICAgIG5hbWU6ICdrZWVwLWFsaXZlJyxcclxuICAgIGFic3RyYWN0OiB0cnVlLFxyXG5cclxuICAgIHByb3BzOiB7XHJcbiAgICAgIGluY2x1ZGU6IHBhdHRlcm5UeXBlcyxcclxuICAgICAgZXhjbHVkZTogcGF0dGVyblR5cGVzLFxyXG4gICAgICBtYXg6IFtTdHJpbmcsIE51bWJlcl1cclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlZDogZnVuY3Rpb24gY3JlYXRlZCgpIHtcclxuICAgICAgdGhpcy5jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgIHRoaXMua2V5cyA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICBkZXN0cm95ZWQ6IGZ1bmN0aW9uIGRlc3Ryb3llZCgpIHtcclxuICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcyQxLmNhY2hlKSB7XHJcbiAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KHRoaXMkMS5jYWNoZSwga2V5LCB0aGlzJDEua2V5cyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcclxuICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gICAgICB0aGlzLiR3YXRjaCgnaW5jbHVkZScsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICBwcnVuZUNhY2hlKHRoaXMkMSwgZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIG1hdGNoZXModmFsLCBuYW1lKTsgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiR3YXRjaCgnZXhjbHVkZScsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICBwcnVuZUNhY2hlKHRoaXMkMSwgZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuICFtYXRjaGVzKHZhbCwgbmFtZSk7IH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAgIHZhciBzbG90ID0gdGhpcy4kc2xvdHMuZGVmYXVsdDtcclxuICAgICAgdmFyIHZub2RlID0gZ2V0Rmlyc3RDb21wb25lbnRDaGlsZChzbG90KTtcclxuICAgICAgdmFyIGNvbXBvbmVudE9wdGlvbnMgPSB2bm9kZSAmJiB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xyXG4gICAgICBpZiAoY29tcG9uZW50T3B0aW9ucykge1xyXG4gICAgICAgIC8vIGNoZWNrIHBhdHRlcm5cclxuICAgICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY29tcG9uZW50T3B0aW9ucyk7XHJcbiAgICAgICAgdmFyIHJlZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGluY2x1ZGUgPSByZWYuaW5jbHVkZTtcclxuICAgICAgICB2YXIgZXhjbHVkZSA9IHJlZi5leGNsdWRlO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIC8vIG5vdCBpbmNsdWRlZFxyXG4gICAgICAgICAgKGluY2x1ZGUgJiYgKCFuYW1lIHx8ICFtYXRjaGVzKGluY2x1ZGUsIG5hbWUpKSkgfHxcclxuICAgICAgICAgIC8vIGV4Y2x1ZGVkXHJcbiAgICAgICAgICAoZXhjbHVkZSAmJiBuYW1lICYmIG1hdGNoZXMoZXhjbHVkZSwgbmFtZSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gdm5vZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZWYkMSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNhY2hlID0gcmVmJDEuY2FjaGU7XHJcbiAgICAgICAgdmFyIGtleXMgPSByZWYkMS5rZXlzO1xyXG4gICAgICAgIHZhciBrZXkgPSB2bm9kZS5rZXkgPT0gbnVsbFxyXG4gICAgICAgICAgLy8gc2FtZSBjb25zdHJ1Y3RvciBtYXkgZ2V0IHJlZ2lzdGVyZWQgYXMgZGlmZmVyZW50IGxvY2FsIGNvbXBvbmVudHNcclxuICAgICAgICAgIC8vIHNvIGNpZCBhbG9uZSBpcyBub3QgZW5vdWdoICgjMzI2OSlcclxuICAgICAgICAgID8gY29tcG9uZW50T3B0aW9ucy5DdG9yLmNpZCArIChjb21wb25lbnRPcHRpb25zLnRhZyA/IChcIjo6XCIgKyAoY29tcG9uZW50T3B0aW9ucy50YWcpKSA6ICcnKVxyXG4gICAgICAgICAgOiB2bm9kZS5rZXk7XHJcbiAgICAgICAgaWYgKGNhY2hlW2tleV0pIHtcclxuICAgICAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gY2FjaGVba2V5XS5jb21wb25lbnRJbnN0YW5jZTtcclxuICAgICAgICAgIC8vIG1ha2UgY3VycmVudCBrZXkgZnJlc2hlc3RcclxuICAgICAgICAgIHJlbW92ZShrZXlzLCBrZXkpO1xyXG4gICAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhY2hlW2tleV0gPSB2bm9kZTtcclxuICAgICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgLy8gcHJ1bmUgb2xkZXN0IGVudHJ5XHJcbiAgICAgICAgICBpZiAodGhpcy5tYXggJiYga2V5cy5sZW5ndGggPiBwYXJzZUludCh0aGlzLm1heCkpIHtcclxuICAgICAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KGNhY2hlLCBrZXlzWzBdLCBrZXlzLCB0aGlzLl92bm9kZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bm9kZS5kYXRhLmtlZXBBbGl2ZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZub2RlIHx8IChzbG90ICYmIHNsb3RbMF0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYnVpbHRJbkNvbXBvbmVudHMgPSB7XHJcbiAgICBLZWVwQWxpdmU6IEtlZXBBbGl2ZVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGluaXRHbG9iYWxBUEkoVnVlKSB7XHJcbiAgICAvLyBjb25maWdcclxuICAgIHZhciBjb25maWdEZWYgPSB7fTtcclxuICAgIGNvbmZpZ0RlZi5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb25maWc7IH07XHJcbiAgICB7XHJcbiAgICAgIGNvbmZpZ0RlZi5zZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgICdEbyBub3QgcmVwbGFjZSB0aGUgVnVlLmNvbmZpZyBvYmplY3QsIHNldCBpbmRpdmlkdWFsIGZpZWxkcyBpbnN0ZWFkLidcclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFZ1ZSwgJ2NvbmZpZycsIGNvbmZpZ0RlZik7XHJcblxyXG4gICAgLy8gZXhwb3NlZCB1dGlsIG1ldGhvZHMuXHJcbiAgICAvLyBOT1RFOiB0aGVzZSBhcmUgbm90IGNvbnNpZGVyZWQgcGFydCBvZiB0aGUgcHVibGljIEFQSSAtIGF2b2lkIHJlbHlpbmcgb25cclxuICAgIC8vIHRoZW0gdW5sZXNzIHlvdSBhcmUgYXdhcmUgb2YgdGhlIHJpc2suXHJcbiAgICBWdWUudXRpbCA9IHtcclxuICAgICAgd2Fybjogd2FybixcclxuICAgICAgZXh0ZW5kOiBleHRlbmQsXHJcbiAgICAgIG1lcmdlT3B0aW9uczogbWVyZ2VPcHRpb25zLFxyXG4gICAgICBkZWZpbmVSZWFjdGl2ZTogZGVmaW5lUmVhY3RpdmVcclxuICAgIH07XHJcblxyXG4gICAgVnVlLnNldCA9IHNldDtcclxuICAgIFZ1ZS5kZWxldGUgPSBkZWw7XHJcbiAgICBWdWUubmV4dFRpY2sgPSBuZXh0VGljaztcclxuXHJcbiAgICBWdWUub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgIFZ1ZS5vcHRpb25zW3R5cGUgKyAncyddID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgXCJiYXNlXCIgY29uc3RydWN0b3IgdG8gZXh0ZW5kIGFsbCBwbGFpbi1vYmplY3RcclxuICAgIC8vIGNvbXBvbmVudHMgd2l0aCBpbiBXZWV4J3MgbXVsdGktaW5zdGFuY2Ugc2NlbmFyaW9zLlxyXG4gICAgVnVlLm9wdGlvbnMuX2Jhc2UgPSBWdWU7XHJcblxyXG4gICAgZXh0ZW5kKFZ1ZS5vcHRpb25zLmNvbXBvbmVudHMsIGJ1aWx0SW5Db21wb25lbnRzKTtcclxuXHJcbiAgICBpbml0VXNlKFZ1ZSk7XHJcbiAgICBpbml0TWl4aW4kMShWdWUpO1xyXG4gICAgaW5pdEV4dGVuZChWdWUpO1xyXG4gICAgaW5pdEFzc2V0UmVnaXN0ZXJzKFZ1ZSk7XHJcbiAgfVxyXG5cclxuICBpbml0R2xvYmFsQVBJKFZ1ZSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUucHJvdG90eXBlLCAnJGlzU2VydmVyJywge1xyXG4gICAgZ2V0OiBpc1NlcnZlclJlbmRlcmluZ1xyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRzc3JDb250ZXh0Jywge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHJldHVybiB0aGlzLiR2bm9kZSAmJiB0aGlzLiR2bm9kZS5zc3JDb250ZXh0XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIGV4cG9zZSBGdW5jdGlvbmFsUmVuZGVyQ29udGV4dCBmb3Igc3NyIHJ1bnRpbWUgaGVscGVyIGluc3RhbGxhdGlvblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUsICdGdW5jdGlvbmFsUmVuZGVyQ29udGV4dCcsIHtcclxuICAgIHZhbHVlOiBGdW5jdGlvbmFsUmVuZGVyQ29udGV4dFxyXG4gIH0pO1xyXG5cclxuICBWdWUudmVyc2lvbiA9ICcyLjUuMTYnO1xyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLy8gdGhlc2UgYXJlIHJlc2VydmVkIGZvciB3ZWIgYmVjYXVzZSB0aGV5IGFyZSBkaXJlY3RseSBjb21waWxlZCBhd2F5XHJcbiAgLy8gZHVyaW5nIHRlbXBsYXRlIGNvbXBpbGF0aW9uXHJcbiAgdmFyIGlzUmVzZXJ2ZWRBdHRyID0gbWFrZU1hcCgnc3R5bGUsY2xhc3MnKTtcclxuXHJcbiAgLy8gYXR0cmlidXRlcyB0aGF0IHNob3VsZCBiZSB1c2luZyBwcm9wcyBmb3IgYmluZGluZ1xyXG4gIHZhciBhY2NlcHRWYWx1ZSA9IG1ha2VNYXAoJ2lucHV0LHRleHRhcmVhLG9wdGlvbixzZWxlY3QscHJvZ3Jlc3MnKTtcclxuICB2YXIgbXVzdFVzZVByb3AgPSBmdW5jdGlvbiAodGFnLCB0eXBlLCBhdHRyKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAoYXR0ciA9PT0gJ3ZhbHVlJyAmJiBhY2NlcHRWYWx1ZSh0YWcpKSAmJiB0eXBlICE9PSAnYnV0dG9uJyB8fFxyXG4gICAgICAoYXR0ciA9PT0gJ3NlbGVjdGVkJyAmJiB0YWcgPT09ICdvcHRpb24nKSB8fFxyXG4gICAgICAoYXR0ciA9PT0gJ2NoZWNrZWQnICYmIHRhZyA9PT0gJ2lucHV0JykgfHxcclxuICAgICAgKGF0dHIgPT09ICdtdXRlZCcgJiYgdGFnID09PSAndmlkZW8nKVxyXG4gICAgKVxyXG4gIH07XHJcblxyXG4gIHZhciBpc0VudW1lcmF0ZWRBdHRyID0gbWFrZU1hcCgnY29udGVudGVkaXRhYmxlLGRyYWdnYWJsZSxzcGVsbGNoZWNrJyk7XHJcblxyXG4gIHZhciBpc0Jvb2xlYW5BdHRyID0gbWFrZU1hcChcclxuICAgICdhbGxvd2Z1bGxzY3JlZW4sYXN5bmMsYXV0b2ZvY3VzLGF1dG9wbGF5LGNoZWNrZWQsY29tcGFjdCxjb250cm9scyxkZWNsYXJlLCcgK1xyXG4gICAgJ2RlZmF1bHQsZGVmYXVsdGNoZWNrZWQsZGVmYXVsdG11dGVkLGRlZmF1bHRzZWxlY3RlZCxkZWZlcixkaXNhYmxlZCwnICtcclxuICAgICdlbmFibGVkLGZvcm1ub3ZhbGlkYXRlLGhpZGRlbixpbmRldGVybWluYXRlLGluZXJ0LGlzbWFwLGl0ZW1zY29wZSxsb29wLG11bHRpcGxlLCcgK1xyXG4gICAgJ211dGVkLG5vaHJlZixub3Jlc2l6ZSxub3NoYWRlLG5vdmFsaWRhdGUsbm93cmFwLG9wZW4scGF1c2VvbmV4aXQscmVhZG9ubHksJyArXHJcbiAgICAncmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLHNlbGVjdGVkLHNvcnRhYmxlLHRyYW5zbGF0ZSwnICtcclxuICAgICd0cnVlc3BlZWQsdHlwZW11c3RtYXRjaCx2aXNpYmxlJ1xyXG4gICk7XHJcblxyXG4gIHZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xyXG5cclxuICB2YXIgaXNYbGluayA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZS5jaGFyQXQoNSkgPT09ICc6JyAmJiBuYW1lLnNsaWNlKDAsIDUpID09PSAneGxpbmsnXHJcbiAgfTtcclxuXHJcbiAgdmFyIGdldFhsaW5rUHJvcCA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICByZXR1cm4gaXNYbGluayhuYW1lKSA/IG5hbWUuc2xpY2UoNiwgbmFtZS5sZW5ndGgpIDogJydcclxuICB9O1xyXG5cclxuICB2YXIgaXNGYWxzeUF0dHJWYWx1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgIHJldHVybiB2YWwgPT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGdlbkNsYXNzRm9yVm5vZGUodm5vZGUpIHtcclxuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICAgIHZhciBwYXJlbnROb2RlID0gdm5vZGU7XHJcbiAgICB2YXIgY2hpbGROb2RlID0gdm5vZGU7XHJcbiAgICB3aGlsZSAoaXNEZWYoY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xyXG4gICAgICBjaGlsZE5vZGUgPSBjaGlsZE5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlO1xyXG4gICAgICBpZiAoY2hpbGROb2RlICYmIGNoaWxkTm9kZS5kYXRhKSB7XHJcbiAgICAgICAgZGF0YSA9IG1lcmdlQ2xhc3NEYXRhKGNoaWxkTm9kZS5kYXRhLCBkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2hpbGUgKGlzRGVmKHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudCkpIHtcclxuICAgICAgaWYgKHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5kYXRhKSB7XHJcbiAgICAgICAgZGF0YSA9IG1lcmdlQ2xhc3NEYXRhKGRhdGEsIHBhcmVudE5vZGUuZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZW5kZXJDbGFzcyhkYXRhLnN0YXRpY0NsYXNzLCBkYXRhLmNsYXNzKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWVyZ2VDbGFzc0RhdGEoY2hpbGQsIHBhcmVudCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhdGljQ2xhc3M6IGNvbmNhdChjaGlsZC5zdGF0aWNDbGFzcywgcGFyZW50LnN0YXRpY0NsYXNzKSxcclxuICAgICAgY2xhc3M6IGlzRGVmKGNoaWxkLmNsYXNzKVxyXG4gICAgICAgID8gW2NoaWxkLmNsYXNzLCBwYXJlbnQuY2xhc3NdXHJcbiAgICAgICAgOiBwYXJlbnQuY2xhc3NcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlckNsYXNzKFxyXG4gICAgc3RhdGljQ2xhc3MsXHJcbiAgICBkeW5hbWljQ2xhc3NcclxuICApIHtcclxuICAgIGlmIChpc0RlZihzdGF0aWNDbGFzcykgfHwgaXNEZWYoZHluYW1pY0NsYXNzKSkge1xyXG4gICAgICByZXR1cm4gY29uY2F0KHN0YXRpY0NsYXNzLCBzdHJpbmdpZnlDbGFzcyhkeW5hbWljQ2xhc3MpKVxyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJldHVybiAnJ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29uY2F0KGEsIGIpIHtcclxuICAgIHJldHVybiBhID8gYiA/IChhICsgJyAnICsgYikgOiBhIDogKGIgfHwgJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzdHJpbmdpZnlDbGFzcyh2YWx1ZSkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlBcnJheSh2YWx1ZSlcclxuICAgIH1cclxuICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeU9iamVjdCh2YWx1ZSlcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZVxyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJldHVybiAnJ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXkodmFsdWUpIHtcclxuICAgIHZhciByZXMgPSAnJztcclxuICAgIHZhciBzdHJpbmdpZmllZDtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGlmIChpc0RlZihzdHJpbmdpZmllZCA9IHN0cmluZ2lmeUNsYXNzKHZhbHVlW2ldKSkgJiYgc3RyaW5naWZpZWQgIT09ICcnKSB7XHJcbiAgICAgICAgaWYgKHJlcykgeyByZXMgKz0gJyAnOyB9XHJcbiAgICAgICAgcmVzICs9IHN0cmluZ2lmaWVkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzdHJpbmdpZnlPYmplY3QodmFsdWUpIHtcclxuICAgIHZhciByZXMgPSAnJztcclxuICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWVba2V5XSkge1xyXG4gICAgICAgIGlmIChyZXMpIHsgcmVzICs9ICcgJzsgfVxyXG4gICAgICAgIHJlcyArPSBrZXk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgbmFtZXNwYWNlTWFwID0ge1xyXG4gICAgc3ZnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLFxyXG4gICAgbWF0aDogJ2h0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUwnXHJcbiAgfTtcclxuXHJcbiAgdmFyIGlzSFRNTFRhZyA9IG1ha2VNYXAoXHJcbiAgICAnaHRtbCxib2R5LGJhc2UsaGVhZCxsaW5rLG1ldGEsc3R5bGUsdGl0bGUsJyArXHJcbiAgICAnYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGZvb3RlcixoZWFkZXIsaDEsaDIsaDMsaDQsaDUsaDYsaGdyb3VwLG5hdixzZWN0aW9uLCcgK1xyXG4gICAgJ2RpdixkZCxkbCxkdCxmaWdjYXB0aW9uLGZpZ3VyZSxwaWN0dXJlLGhyLGltZyxsaSxtYWluLG9sLHAscHJlLHVsLCcgK1xyXG4gICAgJ2EsYixhYmJyLGJkaSxiZG8sYnIsY2l0ZSxjb2RlLGRhdGEsZGZuLGVtLGksa2JkLG1hcmsscSxycCxydCxydGMscnVieSwnICtcclxuICAgICdzLHNhbXAsc21hbGwsc3BhbixzdHJvbmcsc3ViLHN1cCx0aW1lLHUsdmFyLHdicixhcmVhLGF1ZGlvLG1hcCx0cmFjayx2aWRlbywnICtcclxuICAgICdlbWJlZCxvYmplY3QscGFyYW0sc291cmNlLGNhbnZhcyxzY3JpcHQsbm9zY3JpcHQsZGVsLGlucywnICtcclxuICAgICdjYXB0aW9uLGNvbCxjb2xncm91cCx0YWJsZSx0aGVhZCx0Ym9keSx0ZCx0aCx0ciwnICtcclxuICAgICdidXR0b24sZGF0YWxpc3QsZmllbGRzZXQsZm9ybSxpbnB1dCxsYWJlbCxsZWdlbmQsbWV0ZXIsb3B0Z3JvdXAsb3B0aW9uLCcgK1xyXG4gICAgJ291dHB1dCxwcm9ncmVzcyxzZWxlY3QsdGV4dGFyZWEsJyArXHJcbiAgICAnZGV0YWlscyxkaWFsb2csbWVudSxtZW51aXRlbSxzdW1tYXJ5LCcgK1xyXG4gICAgJ2NvbnRlbnQsZWxlbWVudCxzaGFkb3csdGVtcGxhdGUsYmxvY2txdW90ZSxpZnJhbWUsdGZvb3QnXHJcbiAgKTtcclxuXHJcbiAgLy8gdGhpcyBtYXAgaXMgaW50ZW50aW9uYWxseSBzZWxlY3RpdmUsIG9ubHkgY292ZXJpbmcgU1ZHIGVsZW1lbnRzIHRoYXQgbWF5XHJcbiAgLy8gY29udGFpbiBjaGlsZCBlbGVtZW50cy5cclxuICB2YXIgaXNTVkcgPSBtYWtlTWFwKFxyXG4gICAgJ3N2ZyxhbmltYXRlLGNpcmNsZSxjbGlwcGF0aCxjdXJzb3IsZGVmcyxkZXNjLGVsbGlwc2UsZmlsdGVyLGZvbnQtZmFjZSwnICtcclxuICAgICdmb3JlaWduT2JqZWN0LGcsZ2x5cGgsaW1hZ2UsbGluZSxtYXJrZXIsbWFzayxtaXNzaW5nLWdseXBoLHBhdGgscGF0dGVybiwnICtcclxuICAgICdwb2x5Z29uLHBvbHlsaW5lLHJlY3Qsc3dpdGNoLHN5bWJvbCx0ZXh0LHRleHRwYXRoLHRzcGFuLHVzZSx2aWV3JyxcclxuICAgIHRydWVcclxuICApO1xyXG5cclxuICB2YXIgaXNQcmVUYWcgPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiB0YWcgPT09ICdwcmUnOyB9O1xyXG5cclxuICB2YXIgaXNSZXNlcnZlZFRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgIHJldHVybiBpc0hUTUxUYWcodGFnKSB8fCBpc1NWRyh0YWcpXHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0VGFnTmFtZXNwYWNlKHRhZykge1xyXG4gICAgaWYgKGlzU1ZHKHRhZykpIHtcclxuICAgICAgcmV0dXJuICdzdmcnXHJcbiAgICB9XHJcbiAgICAvLyBiYXNpYyBzdXBwb3J0IGZvciBNYXRoTUxcclxuICAgIC8vIG5vdGUgaXQgZG9lc24ndCBzdXBwb3J0IG90aGVyIE1hdGhNTCBlbGVtZW50cyBiZWluZyBjb21wb25lbnQgcm9vdHNcclxuICAgIGlmICh0YWcgPT09ICdtYXRoJykge1xyXG4gICAgICByZXR1cm4gJ21hdGgnXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgdW5rbm93bkVsZW1lbnRDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgZnVuY3Rpb24gaXNVbmtub3duRWxlbWVudCh0YWcpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKCFpbkJyb3dzZXIpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIGlmIChpc1Jlc2VydmVkVGFnKHRhZykpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICB0YWcgPSB0YWcudG9Mb3dlckNhc2UoKTtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiB1bmtub3duRWxlbWVudENhY2hlW3RhZ11cclxuICAgIH1cclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgIGlmICh0YWcuaW5kZXhPZignLScpID4gLTEpIHtcclxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjgyMTAzNjQvMTA3MDI0NFxyXG4gICAgICByZXR1cm4gKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSA9IChcclxuICAgICAgICBlbC5jb25zdHJ1Y3RvciA9PT0gd2luZG93LkhUTUxVbmtub3duRWxlbWVudCB8fFxyXG4gICAgICAgIGVsLmNvbnN0cnVjdG9yID09PSB3aW5kb3cuSFRNTEVsZW1lbnRcclxuICAgICAgKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAodW5rbm93bkVsZW1lbnRDYWNoZVt0YWddID0gL0hUTUxVbmtub3duRWxlbWVudC8udGVzdChlbC50b1N0cmluZygpKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpc1RleHRJbnB1dFR5cGUgPSBtYWtlTWFwKCd0ZXh0LG51bWJlcixwYXNzd29yZCxzZWFyY2gsZW1haWwsdGVsLHVybCcpO1xyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogUXVlcnkgYW4gZWxlbWVudCBzZWxlY3RvciBpZiBpdCdzIG5vdCBhbiBlbGVtZW50IGFscmVhZHkuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcXVlcnkoZWwpIHtcclxuICAgIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHZhciBzZWxlY3RlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xyXG4gICAgICBpZiAoIXNlbGVjdGVkKSB7XHJcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICAgICdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgZWxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RlZFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGVsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCQxKHRhZ05hbWUsIHZub2RlKSB7XHJcbiAgICB2YXIgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIGlmICh0YWdOYW1lICE9PSAnc2VsZWN0Jykge1xyXG4gICAgICByZXR1cm4gZWxtXHJcbiAgICB9XHJcbiAgICAvLyBmYWxzZSBvciBudWxsIHdpbGwgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgYnV0IHVuZGVmaW5lZCB3aWxsIG5vdFxyXG4gICAgaWYgKHZub2RlLmRhdGEgJiYgdm5vZGUuZGF0YS5hdHRycyAmJiB2bm9kZS5kYXRhLmF0dHJzLm11bHRpcGxlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZWxtLnNldEF0dHJpYnV0ZSgnbXVsdGlwbGUnLCAnbXVsdGlwbGUnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBlbG1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIHRhZ05hbWUpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlTWFwW25hbWVzcGFjZV0sIHRhZ05hbWUpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVUZXh0Tm9kZSh0ZXh0KSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbW1lbnQodGV4dCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQodGV4dClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluc2VydEJlZm9yZShwYXJlbnROb2RlLCBuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XHJcbiAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCByZWZlcmVuY2VOb2RlKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUsIGNoaWxkKSB7XHJcbiAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGVuZENoaWxkKG5vZGUsIGNoaWxkKSB7XHJcbiAgICBub2RlLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcmVudE5vZGUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbmV4dFNpYmxpbmcobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRhZ05hbWUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUudGFnTmFtZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VGV4dENvbnRlbnQobm9kZSwgdGV4dCkge1xyXG4gICAgbm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRTdHlsZVNjb3BlKG5vZGUsIHNjb3BlSWQpIHtcclxuICAgIG5vZGUuc2V0QXR0cmlidXRlKHNjb3BlSWQsICcnKTtcclxuICB9XHJcblxyXG5cclxuICB2YXIgbm9kZU9wcyA9IE9iamVjdC5mcmVlemUoe1xyXG4gICAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudCQxLFxyXG4gICAgY3JlYXRlRWxlbWVudE5TOiBjcmVhdGVFbGVtZW50TlMsXHJcbiAgICBjcmVhdGVUZXh0Tm9kZTogY3JlYXRlVGV4dE5vZGUsXHJcbiAgICBjcmVhdGVDb21tZW50OiBjcmVhdGVDb21tZW50LFxyXG4gICAgaW5zZXJ0QmVmb3JlOiBpbnNlcnRCZWZvcmUsXHJcbiAgICByZW1vdmVDaGlsZDogcmVtb3ZlQ2hpbGQsXHJcbiAgICBhcHBlbmRDaGlsZDogYXBwZW5kQ2hpbGQsXHJcbiAgICBwYXJlbnROb2RlOiBwYXJlbnROb2RlLFxyXG4gICAgbmV4dFNpYmxpbmc6IG5leHRTaWJsaW5nLFxyXG4gICAgdGFnTmFtZTogdGFnTmFtZSxcclxuICAgIHNldFRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudCxcclxuICAgIHNldFN0eWxlU2NvcGU6IHNldFN0eWxlU2NvcGVcclxuICB9KTtcclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciByZWYgPSB7XHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShfLCB2bm9kZSkge1xyXG4gICAgICByZWdpc3RlclJlZih2bm9kZSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgICAgIGlmIChvbGRWbm9kZS5kYXRhLnJlZiAhPT0gdm5vZGUuZGF0YS5yZWYpIHtcclxuICAgICAgICByZWdpc3RlclJlZihvbGRWbm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmVnaXN0ZXJSZWYodm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSh2bm9kZSkge1xyXG4gICAgICByZWdpc3RlclJlZih2bm9kZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWdpc3RlclJlZih2bm9kZSwgaXNSZW1vdmFsKSB7XHJcbiAgICB2YXIga2V5ID0gdm5vZGUuZGF0YS5yZWY7XHJcbiAgICBpZiAoIWlzRGVmKGtleSkpIHsgcmV0dXJuIH1cclxuXHJcbiAgICB2YXIgdm0gPSB2bm9kZS5jb250ZXh0O1xyXG4gICAgdmFyIHJlZiA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlIHx8IHZub2RlLmVsbTtcclxuICAgIHZhciByZWZzID0gdm0uJHJlZnM7XHJcbiAgICBpZiAoaXNSZW1vdmFsKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlZnNba2V5XSkpIHtcclxuICAgICAgICByZW1vdmUocmVmc1trZXldLCByZWYpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlZnNba2V5XSA9PT0gcmVmKSB7XHJcbiAgICAgICAgcmVmc1trZXldID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodm5vZGUuZGF0YS5yZWZJbkZvcikge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZWZzW2tleV0pKSB7XHJcbiAgICAgICAgICByZWZzW2tleV0gPSBbcmVmXTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlZnNba2V5XS5pbmRleE9mKHJlZikgPCAwKSB7XHJcbiAgICAgICAgICAvLyAkZmxvdy1kaXNhYmxlLWxpbmVcclxuICAgICAgICAgIHJlZnNba2V5XS5wdXNoKHJlZik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlZnNba2V5XSA9IHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmlydHVhbCBET00gcGF0Y2hpbmcgYWxnb3JpdGhtIGJhc2VkIG9uIFNuYWJiZG9tIGJ5XHJcbiAgICogU2ltb24gRnJpaXMgVmluZHVtIChAcGFsZGVwaW5kKVxyXG4gICAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxkZXBpbmQvc25hYmJkb20vYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gICAqXHJcbiAgICogbW9kaWZpZWQgYnkgRXZhbiBZb3UgKEB5eXg5OTA4MDMpXHJcbiAgICpcclxuICAgKiBOb3QgdHlwZS1jaGVja2luZyB0aGlzIGJlY2F1c2UgdGhpcyBmaWxlIGlzIHBlcmYtY3JpdGljYWwgYW5kIHRoZSBjb3N0XHJcbiAgICogb2YgbWFraW5nIGZsb3cgdW5kZXJzdGFuZCBpdCBpcyBub3Qgd29ydGggaXQuXHJcbiAgICovXHJcblxyXG4gIHZhciBlbXB0eU5vZGUgPSBuZXcgVk5vZGUoJycsIHt9LCBbXSk7XHJcblxyXG4gIHZhciBob29rcyA9IFsnY3JlYXRlJywgJ2FjdGl2YXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAnZGVzdHJveSddO1xyXG5cclxuICBmdW5jdGlvbiBzYW1lVm5vZGUoYSwgYikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgYS5rZXkgPT09IGIua2V5ICYmIChcclxuICAgICAgICAoXHJcbiAgICAgICAgICBhLnRhZyA9PT0gYi50YWcgJiZcclxuICAgICAgICAgIGEuaXNDb21tZW50ID09PSBiLmlzQ29tbWVudCAmJlxyXG4gICAgICAgICAgaXNEZWYoYS5kYXRhKSA9PT0gaXNEZWYoYi5kYXRhKSAmJlxyXG4gICAgICAgICAgc2FtZUlucHV0VHlwZShhLCBiKVxyXG4gICAgICAgICkgfHwgKFxyXG4gICAgICAgICAgaXNUcnVlKGEuaXNBc3luY1BsYWNlaG9sZGVyKSAmJlxyXG4gICAgICAgICAgYS5hc3luY0ZhY3RvcnkgPT09IGIuYXN5bmNGYWN0b3J5ICYmXHJcbiAgICAgICAgICBpc1VuZGVmKGIuYXN5bmNGYWN0b3J5LmVycm9yKVxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2FtZUlucHV0VHlwZShhLCBiKSB7XHJcbiAgICBpZiAoYS50YWcgIT09ICdpbnB1dCcpIHsgcmV0dXJuIHRydWUgfVxyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgdHlwZUEgPSBpc0RlZihpID0gYS5kYXRhKSAmJiBpc0RlZihpID0gaS5hdHRycykgJiYgaS50eXBlO1xyXG4gICAgdmFyIHR5cGVCID0gaXNEZWYoaSA9IGIuZGF0YSkgJiYgaXNEZWYoaSA9IGkuYXR0cnMpICYmIGkudHlwZTtcclxuICAgIHJldHVybiB0eXBlQSA9PT0gdHlwZUIgfHwgaXNUZXh0SW5wdXRUeXBlKHR5cGVBKSAmJiBpc1RleHRJbnB1dFR5cGUodHlwZUIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVLZXlUb09sZElkeChjaGlsZHJlbiwgYmVnaW5JZHgsIGVuZElkeCkge1xyXG4gICAgdmFyIGksIGtleTtcclxuICAgIHZhciBtYXAgPSB7fTtcclxuICAgIGZvciAoaSA9IGJlZ2luSWR4OyBpIDw9IGVuZElkeDsgKytpKSB7XHJcbiAgICAgIGtleSA9IGNoaWxkcmVuW2ldLmtleTtcclxuICAgICAgaWYgKGlzRGVmKGtleSkpIHsgbWFwW2tleV0gPSBpOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWFwXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVQYXRjaEZ1bmN0aW9uKGJhY2tlbmQpIHtcclxuICAgIHZhciBpLCBqO1xyXG4gICAgdmFyIGNicyA9IHt9O1xyXG5cclxuICAgIHZhciBtb2R1bGVzID0gYmFja2VuZC5tb2R1bGVzO1xyXG4gICAgdmFyIG5vZGVPcHMgPSBiYWNrZW5kLm5vZGVPcHM7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIGNic1tob29rc1tpXV0gPSBbXTtcclxuICAgICAgZm9yIChqID0gMDsgaiA8IG1vZHVsZXMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICBpZiAoaXNEZWYobW9kdWxlc1tqXVtob29rc1tpXV0pKSB7XHJcbiAgICAgICAgICBjYnNbaG9va3NbaV1dLnB1c2gobW9kdWxlc1tqXVtob29rc1tpXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVtcHR5Tm9kZUF0KGVsbSkge1xyXG4gICAgICByZXR1cm4gbmV3IFZOb2RlKG5vZGVPcHMudGFnTmFtZShlbG0pLnRvTG93ZXJDYXNlKCksIHt9LCBbXSwgdW5kZWZpbmVkLCBlbG0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUm1DYihjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XHJcbiAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcclxuICAgICAgICBpZiAoLS1yZW1vdmUubGlzdGVuZXJzID09PSAwKSB7XHJcbiAgICAgICAgICByZW1vdmVOb2RlKGNoaWxkRWxtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVtb3ZlLmxpc3RlbmVycyA9IGxpc3RlbmVycztcclxuICAgICAgcmV0dXJuIHJlbW92ZVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUoZWwpIHtcclxuICAgICAgdmFyIHBhcmVudCA9IG5vZGVPcHMucGFyZW50Tm9kZShlbCk7XHJcbiAgICAgIC8vIGVsZW1lbnQgbWF5IGhhdmUgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZHVlIHRvIHYtaHRtbCAvIHYtdGV4dFxyXG4gICAgICBpZiAoaXNEZWYocGFyZW50KSkge1xyXG4gICAgICAgIG5vZGVPcHMucmVtb3ZlQ2hpbGQocGFyZW50LCBlbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1Vua25vd25FbGVtZW50JCQxKHZub2RlLCBpblZQcmUpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICAhaW5WUHJlICYmXHJcbiAgICAgICAgIXZub2RlLm5zICYmXHJcbiAgICAgICAgIShcclxuICAgICAgICAgIGNvbmZpZy5pZ25vcmVkRWxlbWVudHMubGVuZ3RoICYmXHJcbiAgICAgICAgICBjb25maWcuaWdub3JlZEVsZW1lbnRzLnNvbWUoZnVuY3Rpb24gKGlnbm9yZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNSZWdFeHAoaWdub3JlKVxyXG4gICAgICAgICAgICAgID8gaWdub3JlLnRlc3Qodm5vZGUudGFnKVxyXG4gICAgICAgICAgICAgIDogaWdub3JlID09PSB2bm9kZS50YWdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKSAmJlxyXG4gICAgICAgIGNvbmZpZy5pc1Vua25vd25FbGVtZW50KHZub2RlLnRhZylcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjcmVhdGluZ0VsbUluVlByZSA9IDA7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxtKFxyXG4gICAgICB2bm9kZSxcclxuICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlLFxyXG4gICAgICBwYXJlbnRFbG0sXHJcbiAgICAgIHJlZkVsbSxcclxuICAgICAgbmVzdGVkLFxyXG4gICAgICBvd25lckFycmF5LFxyXG4gICAgICBpbmRleFxyXG4gICAgKSB7XHJcbiAgICAgIGlmIChpc0RlZih2bm9kZS5lbG0pICYmIGlzRGVmKG93bmVyQXJyYXkpKSB7XHJcbiAgICAgICAgLy8gVGhpcyB2bm9kZSB3YXMgdXNlZCBpbiBhIHByZXZpb3VzIHJlbmRlciFcclxuICAgICAgICAvLyBub3cgaXQncyB1c2VkIGFzIGEgbmV3IG5vZGUsIG92ZXJ3cml0aW5nIGl0cyBlbG0gd291bGQgY2F1c2VcclxuICAgICAgICAvLyBwb3RlbnRpYWwgcGF0Y2ggZXJyb3JzIGRvd24gdGhlIHJvYWQgd2hlbiBpdCdzIHVzZWQgYXMgYW4gaW5zZXJ0aW9uXHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIG5vZGUuIEluc3RlYWQsIHdlIGNsb25lIHRoZSBub2RlIG9uLWRlbWFuZCBiZWZvcmUgY3JlYXRpbmdcclxuICAgICAgICAvLyBhc3NvY2lhdGVkIERPTSBlbGVtZW50IGZvciBpdC5cclxuICAgICAgICB2bm9kZSA9IG93bmVyQXJyYXlbaW5kZXhdID0gY2xvbmVWTm9kZSh2bm9kZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZub2RlLmlzUm9vdEluc2VydCA9ICFuZXN0ZWQ7IC8vIGZvciB0cmFuc2l0aW9uIGVudGVyIGNoZWNrXHJcbiAgICAgIGlmIChjcmVhdGVDb21wb25lbnQodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICAgICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XHJcbiAgICAgIHZhciB0YWcgPSB2bm9kZS50YWc7XHJcbiAgICAgIGlmIChpc0RlZih0YWcpKSB7XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5wcmUpIHtcclxuICAgICAgICAgICAgY3JlYXRpbmdFbG1JblZQcmUrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc1Vua25vd25FbGVtZW50JCQxKHZub2RlLCBjcmVhdGluZ0VsbUluVlByZSkpIHtcclxuICAgICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgICAnVW5rbm93biBjdXN0b20gZWxlbWVudDogPCcgKyB0YWcgKyAnPiAtIGRpZCB5b3UgJyArXHJcbiAgICAgICAgICAgICAgJ3JlZ2lzdGVyIHRoZSBjb21wb25lbnQgY29ycmVjdGx5PyBGb3IgcmVjdXJzaXZlIGNvbXBvbmVudHMsICcgK1xyXG4gICAgICAgICAgICAgICdtYWtlIHN1cmUgdG8gcHJvdmlkZSB0aGUgXCJuYW1lXCIgb3B0aW9uLicsXHJcbiAgICAgICAgICAgICAgdm5vZGUuY29udGV4dFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm5vZGUuZWxtID0gdm5vZGUubnNcclxuICAgICAgICAgID8gbm9kZU9wcy5jcmVhdGVFbGVtZW50TlModm5vZGUubnMsIHRhZylcclxuICAgICAgICAgIDogbm9kZU9wcy5jcmVhdGVFbGVtZW50KHRhZywgdm5vZGUpO1xyXG4gICAgICAgIHNldFNjb3BlKHZub2RlKTtcclxuXHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY3JlYXRlQ2hpbGRyZW4odm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW5zZXJ0KHBhcmVudEVsbSwgdm5vZGUuZWxtLCByZWZFbG0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGRhdGEgJiYgZGF0YS5wcmUpIHtcclxuICAgICAgICAgIGNyZWF0aW5nRWxtSW5WUHJlLS07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGlzVHJ1ZSh2bm9kZS5pc0NvbW1lbnQpKSB7XHJcbiAgICAgICAgdm5vZGUuZWxtID0gbm9kZU9wcy5jcmVhdGVDb21tZW50KHZub2RlLnRleHQpO1xyXG4gICAgICAgIGluc2VydChwYXJlbnRFbG0sIHZub2RlLmVsbSwgcmVmRWxtKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2bm9kZS5lbG0gPSBub2RlT3BzLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xyXG4gICAgICAgIGluc2VydChwYXJlbnRFbG0sIHZub2RlLmVsbSwgcmVmRWxtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkge1xyXG4gICAgICB2YXIgaSA9IHZub2RlLmRhdGE7XHJcbiAgICAgIGlmIChpc0RlZihpKSkge1xyXG4gICAgICAgIHZhciBpc1JlYWN0aXZhdGVkID0gaXNEZWYodm5vZGUuY29tcG9uZW50SW5zdGFuY2UpICYmIGkua2VlcEFsaXZlO1xyXG4gICAgICAgIGlmIChpc0RlZihpID0gaS5ob29rKSAmJiBpc0RlZihpID0gaS5pbml0KSkge1xyXG4gICAgICAgICAgaSh2bm9kZSwgZmFsc2UgLyogaHlkcmF0aW5nICovLCBwYXJlbnRFbG0sIHJlZkVsbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFmdGVyIGNhbGxpbmcgdGhlIGluaXQgaG9vaywgaWYgdGhlIHZub2RlIGlzIGEgY2hpbGQgY29tcG9uZW50XHJcbiAgICAgICAgLy8gaXQgc2hvdWxkJ3ZlIGNyZWF0ZWQgYSBjaGlsZCBpbnN0YW5jZSBhbmQgbW91bnRlZCBpdC4gdGhlIGNoaWxkXHJcbiAgICAgICAgLy8gY29tcG9uZW50IGFsc28gaGFzIHNldCB0aGUgcGxhY2Vob2xkZXIgdm5vZGUncyBlbG0uXHJcbiAgICAgICAgLy8gaW4gdGhhdCBjYXNlIHdlIGNhbiBqdXN0IHJldHVybiB0aGUgZWxlbWVudCBhbmQgYmUgZG9uZS5cclxuICAgICAgICBpZiAoaXNEZWYodm5vZGUuY29tcG9uZW50SW5zdGFuY2UpKSB7XHJcbiAgICAgICAgICBpbml0Q29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgaWYgKGlzVHJ1ZShpc1JlYWN0aXZhdGVkKSkge1xyXG4gICAgICAgICAgICByZWFjdGl2YXRlQ29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdENvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICAgIGlmIChpc0RlZih2bm9kZS5kYXRhLnBlbmRpbmdJbnNlcnQpKSB7XHJcbiAgICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlLnB1c2guYXBwbHkoaW5zZXJ0ZWRWbm9kZVF1ZXVlLCB2bm9kZS5kYXRhLnBlbmRpbmdJbnNlcnQpO1xyXG4gICAgICAgIHZub2RlLmRhdGEucGVuZGluZ0luc2VydCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdm5vZGUuZWxtID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGVsO1xyXG4gICAgICBpZiAoaXNQYXRjaGFibGUodm5vZGUpKSB7XHJcbiAgICAgICAgaW52b2tlQ3JlYXRlSG9va3Modm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgc2V0U2NvcGUodm5vZGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGVtcHR5IGNvbXBvbmVudCByb290LlxyXG4gICAgICAgIC8vIHNraXAgYWxsIGVsZW1lbnQtcmVsYXRlZCBtb2R1bGVzIGV4Y2VwdCBmb3IgcmVmICgjMzQ1NSlcclxuICAgICAgICByZWdpc3RlclJlZih2bm9kZSk7XHJcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRvIGludm9rZSB0aGUgaW5zZXJ0IGhvb2tcclxuICAgICAgICBpbnNlcnRlZFZub2RlUXVldWUucHVzaCh2bm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFjdGl2YXRlQ29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtKSB7XHJcbiAgICAgIHZhciBpO1xyXG4gICAgICAvLyBoYWNrIGZvciAjNDMzOTogYSByZWFjdGl2YXRlZCBjb21wb25lbnQgd2l0aCBpbm5lciB0cmFuc2l0aW9uXHJcbiAgICAgIC8vIGRvZXMgbm90IHRyaWdnZXIgYmVjYXVzZSB0aGUgaW5uZXIgbm9kZSdzIGNyZWF0ZWQgaG9va3MgYXJlIG5vdCBjYWxsZWRcclxuICAgICAgLy8gYWdhaW4uIEl0J3Mgbm90IGlkZWFsIHRvIGludm9sdmUgbW9kdWxlLXNwZWNpZmljIGxvZ2ljIGluIGhlcmUgYnV0XHJcbiAgICAgIC8vIHRoZXJlIGRvZXNuJ3Qgc2VlbSB0byBiZSBhIGJldHRlciB3YXkgdG8gZG8gaXQuXHJcbiAgICAgIHZhciBpbm5lck5vZGUgPSB2bm9kZTtcclxuICAgICAgd2hpbGUgKGlubmVyTm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xyXG4gICAgICAgIGlubmVyTm9kZSA9IGlubmVyTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XHJcbiAgICAgICAgaWYgKGlzRGVmKGkgPSBpbm5lck5vZGUuZGF0YSkgJiYgaXNEZWYoaSA9IGkudHJhbnNpdGlvbikpIHtcclxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMuYWN0aXZhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY2JzLmFjdGl2YXRlW2ldKGVtcHR5Tm9kZSwgaW5uZXJOb2RlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKGlubmVyTm9kZSk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyB1bmxpa2UgYSBuZXdseSBjcmVhdGVkIGNvbXBvbmVudCxcclxuICAgICAgLy8gYSByZWFjdGl2YXRlZCBrZWVwLWFsaXZlIGNvbXBvbmVudCBkb2Vzbid0IGluc2VydCBpdHNlbGZcclxuICAgICAgaW5zZXJ0KHBhcmVudEVsbSwgdm5vZGUuZWxtLCByZWZFbG0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluc2VydChwYXJlbnQsIGVsbSwgcmVmJCQxKSB7XHJcbiAgICAgIGlmIChpc0RlZihwYXJlbnQpKSB7XHJcbiAgICAgICAgaWYgKGlzRGVmKHJlZiQkMSkpIHtcclxuICAgICAgICAgIGlmIChyZWYkJDEucGFyZW50Tm9kZSA9PT0gcGFyZW50KSB7XHJcbiAgICAgICAgICAgIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudCwgZWxtLCByZWYkJDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBub2RlT3BzLmFwcGVuZENoaWxkKHBhcmVudCwgZWxtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4sIGluc2VydGVkVm5vZGVRdWV1ZSkge1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaGVja0R1cGxpY2F0ZUtleXMoY2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICBjcmVhdGVFbG0oY2hpbGRyZW5baV0sIGluc2VydGVkVm5vZGVRdWV1ZSwgdm5vZGUuZWxtLCBudWxsLCB0cnVlLCBjaGlsZHJlbiwgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGlzUHJpbWl0aXZlKHZub2RlLnRleHQpKSB7XHJcbiAgICAgICAgbm9kZU9wcy5hcHBlbmRDaGlsZCh2bm9kZS5lbG0sIG5vZGVPcHMuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKHZub2RlLnRleHQpKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1BhdGNoYWJsZSh2bm9kZSkge1xyXG4gICAgICB3aGlsZSAodm5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcclxuICAgICAgICB2bm9kZSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gaXNEZWYodm5vZGUudGFnKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcclxuICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgY2JzLmNyZWF0ZS5sZW5ndGg7ICsraSQxKSB7XHJcbiAgICAgICAgY2JzLmNyZWF0ZVtpJDFdKGVtcHR5Tm9kZSwgdm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGkgPSB2bm9kZS5kYXRhLmhvb2s7IC8vIFJldXNlIHZhcmlhYmxlXHJcbiAgICAgIGlmIChpc0RlZihpKSkge1xyXG4gICAgICAgIGlmIChpc0RlZihpLmNyZWF0ZSkpIHsgaS5jcmVhdGUoZW1wdHlOb2RlLCB2bm9kZSk7IH1cclxuICAgICAgICBpZiAoaXNEZWYoaS5pbnNlcnQpKSB7IGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKHZub2RlKTsgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IHNjb3BlIGlkIGF0dHJpYnV0ZSBmb3Igc2NvcGVkIENTUy5cclxuICAgIC8vIHRoaXMgaXMgaW1wbGVtZW50ZWQgYXMgYSBzcGVjaWFsIGNhc2UgdG8gYXZvaWQgdGhlIG92ZXJoZWFkXHJcbiAgICAvLyBvZiBnb2luZyB0aHJvdWdoIHRoZSBub3JtYWwgYXR0cmlidXRlIHBhdGNoaW5nIHByb2Nlc3MuXHJcbiAgICBmdW5jdGlvbiBzZXRTY29wZSh2bm9kZSkge1xyXG4gICAgICB2YXIgaTtcclxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5mblNjb3BlSWQpKSB7XHJcbiAgICAgICAgbm9kZU9wcy5zZXRTdHlsZVNjb3BlKHZub2RlLmVsbSwgaSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGFuY2VzdG9yID0gdm5vZGU7XHJcbiAgICAgICAgd2hpbGUgKGFuY2VzdG9yKSB7XHJcbiAgICAgICAgICBpZiAoaXNEZWYoaSA9IGFuY2VzdG9yLmNvbnRleHQpICYmIGlzRGVmKGkgPSBpLiRvcHRpb25zLl9zY29wZUlkKSkge1xyXG4gICAgICAgICAgICBub2RlT3BzLnNldFN0eWxlU2NvcGUodm5vZGUuZWxtLCBpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBmb3Igc2xvdCBjb250ZW50IHRoZXkgc2hvdWxkIGFsc28gZ2V0IHRoZSBzY29wZUlkIGZyb20gdGhlIGhvc3QgaW5zdGFuY2UuXHJcbiAgICAgIGlmIChpc0RlZihpID0gYWN0aXZlSW5zdGFuY2UpICYmXHJcbiAgICAgICAgaSAhPT0gdm5vZGUuY29udGV4dCAmJlxyXG4gICAgICAgIGkgIT09IHZub2RlLmZuQ29udGV4dCAmJlxyXG4gICAgICAgIGlzRGVmKGkgPSBpLiRvcHRpb25zLl9zY29wZUlkKVxyXG4gICAgICApIHtcclxuICAgICAgICBub2RlT3BzLnNldFN0eWxlU2NvcGUodm5vZGUuZWxtLCBpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFZub2RlcyhwYXJlbnRFbG0sIHJlZkVsbSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpIHtcclxuICAgICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xyXG4gICAgICAgIGNyZWF0ZUVsbSh2bm9kZXNbc3RhcnRJZHhdLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtLCBmYWxzZSwgdm5vZGVzLCBzdGFydElkeCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnZva2VEZXN0cm95SG9vayh2bm9kZSkge1xyXG4gICAgICB2YXIgaSwgajtcclxuICAgICAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gICAgICBpZiAoaXNEZWYoZGF0YSkpIHtcclxuICAgICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuZGVzdHJveSkpIHsgaSh2bm9kZSk7IH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmRlc3Ryb3kubGVuZ3RoOyArK2kpIHsgY2JzLmRlc3Ryb3lbaV0odm5vZGUpOyB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5jaGlsZHJlbikpIHtcclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKHZub2RlLmNoaWxkcmVuW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVWbm9kZXMocGFyZW50RWxtLCB2bm9kZXMsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcclxuICAgICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xyXG4gICAgICAgIHZhciBjaCA9IHZub2Rlc1tzdGFydElkeF07XHJcbiAgICAgICAgaWYgKGlzRGVmKGNoKSkge1xyXG4gICAgICAgICAgaWYgKGlzRGVmKGNoLnRhZykpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQW5kSW52b2tlUmVtb3ZlSG9vayhjaCk7XHJcbiAgICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGNoKTtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIFRleHQgbm9kZVxyXG4gICAgICAgICAgICByZW1vdmVOb2RlKGNoLmVsbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQW5kSW52b2tlUmVtb3ZlSG9vayh2bm9kZSwgcm0pIHtcclxuICAgICAgaWYgKGlzRGVmKHJtKSB8fCBpc0RlZih2bm9kZS5kYXRhKSkge1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBjYnMucmVtb3ZlLmxlbmd0aCArIDE7XHJcbiAgICAgICAgaWYgKGlzRGVmKHJtKSkge1xyXG4gICAgICAgICAgLy8gd2UgaGF2ZSBhIHJlY3Vyc2l2ZWx5IHBhc3NlZCBkb3duIHJtIGNhbGxiYWNrXHJcbiAgICAgICAgICAvLyBpbmNyZWFzZSB0aGUgbGlzdGVuZXJzIGNvdW50XHJcbiAgICAgICAgICBybS5saXN0ZW5lcnMgKz0gbGlzdGVuZXJzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBkaXJlY3RseSByZW1vdmluZ1xyXG4gICAgICAgICAgcm0gPSBjcmVhdGVSbUNiKHZub2RlLmVsbSwgbGlzdGVuZXJzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgaW52b2tlIGhvb2tzIG9uIGNoaWxkIGNvbXBvbmVudCByb290IG5vZGVcclxuICAgICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSAmJiBpc0RlZihpID0gaS5fdm5vZGUpICYmIGlzRGVmKGkuZGF0YSkpIHtcclxuICAgICAgICAgIHJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2soaSwgcm0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnJlbW92ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgY2JzLnJlbW92ZVtpXSh2bm9kZSwgcm0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkucmVtb3ZlKSkge1xyXG4gICAgICAgICAgaSh2bm9kZSwgcm0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBybSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZW1vdmVOb2RlKHZub2RlLmVsbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihwYXJlbnRFbG0sIG9sZENoLCBuZXdDaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KSB7XHJcbiAgICAgIHZhciBvbGRTdGFydElkeCA9IDA7XHJcbiAgICAgIHZhciBuZXdTdGFydElkeCA9IDA7XHJcbiAgICAgIHZhciBvbGRFbmRJZHggPSBvbGRDaC5sZW5ndGggLSAxO1xyXG4gICAgICB2YXIgb2xkU3RhcnRWbm9kZSA9IG9sZENoWzBdO1xyXG4gICAgICB2YXIgb2xkRW5kVm5vZGUgPSBvbGRDaFtvbGRFbmRJZHhdO1xyXG4gICAgICB2YXIgbmV3RW5kSWR4ID0gbmV3Q2gubGVuZ3RoIC0gMTtcclxuICAgICAgdmFyIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFswXTtcclxuICAgICAgdmFyIG5ld0VuZFZub2RlID0gbmV3Q2hbbmV3RW5kSWR4XTtcclxuICAgICAgdmFyIG9sZEtleVRvSWR4LCBpZHhJbk9sZCwgdm5vZGVUb01vdmUsIHJlZkVsbTtcclxuXHJcbiAgICAgIC8vIHJlbW92ZU9ubHkgaXMgYSBzcGVjaWFsIGZsYWcgdXNlZCBvbmx5IGJ5IDx0cmFuc2l0aW9uLWdyb3VwPlxyXG4gICAgICAvLyB0byBlbnN1cmUgcmVtb3ZlZCBlbGVtZW50cyBzdGF5IGluIGNvcnJlY3QgcmVsYXRpdmUgcG9zaXRpb25zXHJcbiAgICAgIC8vIGR1cmluZyBsZWF2aW5nIHRyYW5zaXRpb25zXHJcbiAgICAgIHZhciBjYW5Nb3ZlID0gIXJlbW92ZU9ubHk7XHJcblxyXG4gICAgICB7XHJcbiAgICAgICAgY2hlY2tEdXBsaWNhdGVLZXlzKG5ld0NoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2hpbGUgKG9sZFN0YXJ0SWR4IDw9IG9sZEVuZElkeCAmJiBuZXdTdGFydElkeCA8PSBuZXdFbmRJZHgpIHtcclxuICAgICAgICBpZiAoaXNVbmRlZihvbGRTdGFydFZub2RlKSkge1xyXG4gICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdOyAvLyBWbm9kZSBoYXMgYmVlbiBtb3ZlZCBsZWZ0XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc1VuZGVmKG9sZEVuZFZub2RlKSkge1xyXG4gICAgICAgICAgb2xkRW5kVm5vZGUgPSBvbGRDaFstLW9sZEVuZElkeF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHtcclxuICAgICAgICAgIHBhdGNoVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTtcclxuICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7XHJcbiAgICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xyXG4gICAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7IC8vIFZub2RlIG1vdmVkIHJpZ2h0XHJcbiAgICAgICAgICBwYXRjaFZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgY2FuTW92ZSAmJiBub2RlT3BzLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtLCBub2RlT3BzLm5leHRTaWJsaW5nKG9sZEVuZFZub2RlLmVsbSkpO1xyXG4gICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xyXG4gICAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkRW5kVm5vZGUsIG5ld1N0YXJ0Vm5vZGUpKSB7IC8vIFZub2RlIG1vdmVkIGxlZnRcclxuICAgICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XHJcbiAgICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcclxuICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGlzVW5kZWYob2xkS2V5VG9JZHgpKSB7IG9sZEtleVRvSWR4ID0gY3JlYXRlS2V5VG9PbGRJZHgob2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpOyB9XHJcbiAgICAgICAgICBpZHhJbk9sZCA9IGlzRGVmKG5ld1N0YXJ0Vm5vZGUua2V5KVxyXG4gICAgICAgICAgICA/IG9sZEtleVRvSWR4W25ld1N0YXJ0Vm5vZGUua2V5XVxyXG4gICAgICAgICAgICA6IGZpbmRJZHhJbk9sZChuZXdTdGFydFZub2RlLCBvbGRDaCwgb2xkU3RhcnRJZHgsIG9sZEVuZElkeCk7XHJcbiAgICAgICAgICBpZiAoaXNVbmRlZihpZHhJbk9sZCkpIHsgLy8gTmV3IGVsZW1lbnRcclxuICAgICAgICAgICAgY3JlYXRlRWxtKG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCBvbGRTdGFydFZub2RlLmVsbSwgZmFsc2UsIG5ld0NoLCBuZXdTdGFydElkeCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bm9kZVRvTW92ZSA9IG9sZENoW2lkeEluT2xkXTtcclxuICAgICAgICAgICAgaWYgKHNhbWVWbm9kZSh2bm9kZVRvTW92ZSwgbmV3U3RhcnRWbm9kZSkpIHtcclxuICAgICAgICAgICAgICBwYXRjaFZub2RlKHZub2RlVG9Nb3ZlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgICAgIG9sZENoW2lkeEluT2xkXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgdm5vZGVUb01vdmUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gc2FtZSBrZXkgYnV0IGRpZmZlcmVudCBlbGVtZW50LiB0cmVhdCBhcyBuZXcgZWxlbWVudFxyXG4gICAgICAgICAgICAgIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgb2xkU3RhcnRWbm9kZS5lbG0sIGZhbHNlLCBuZXdDaCwgbmV3U3RhcnRJZHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChvbGRTdGFydElkeCA+IG9sZEVuZElkeCkge1xyXG4gICAgICAgIHJlZkVsbSA9IGlzVW5kZWYobmV3Q2hbbmV3RW5kSWR4ICsgMV0pID8gbnVsbCA6IG5ld0NoW25ld0VuZElkeCArIDFdLmVsbTtcclxuICAgICAgICBhZGRWbm9kZXMocGFyZW50RWxtLCByZWZFbG0sIG5ld0NoLCBuZXdTdGFydElkeCwgbmV3RW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKG5ld1N0YXJ0SWR4ID4gbmV3RW5kSWR4KSB7XHJcbiAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSwgb2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tEdXBsaWNhdGVLZXlzKGNoaWxkcmVuKSB7XHJcbiAgICAgIHZhciBzZWVuS2V5cyA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHZub2RlID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgdmFyIGtleSA9IHZub2RlLmtleTtcclxuICAgICAgICBpZiAoaXNEZWYoa2V5KSkge1xyXG4gICAgICAgICAgaWYgKHNlZW5LZXlzW2tleV0pIHtcclxuICAgICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgICAoXCJEdXBsaWNhdGUga2V5cyBkZXRlY3RlZDogJ1wiICsga2V5ICsgXCInLiBUaGlzIG1heSBjYXVzZSBhbiB1cGRhdGUgZXJyb3IuXCIpLFxyXG4gICAgICAgICAgICAgIHZub2RlLmNvbnRleHRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlZW5LZXlzW2tleV0gPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmRJZHhJbk9sZChub2RlLCBvbGRDaCwgc3RhcnQsIGVuZCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgIHZhciBjID0gb2xkQ2hbaV07XHJcbiAgICAgICAgaWYgKGlzRGVmKGMpICYmIHNhbWVWbm9kZShub2RlLCBjKSkgeyByZXR1cm4gaSB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KSB7XHJcbiAgICAgIGlmIChvbGRWbm9kZSA9PT0gdm5vZGUpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbSA9IG9sZFZub2RlLmVsbTtcclxuXHJcbiAgICAgIGlmIChpc1RydWUob2xkVm5vZGUuaXNBc3luY1BsYWNlaG9sZGVyKSkge1xyXG4gICAgICAgIGlmIChpc0RlZih2bm9kZS5hc3luY0ZhY3RvcnkucmVzb2x2ZWQpKSB7XHJcbiAgICAgICAgICBoeWRyYXRlKG9sZFZub2RlLmVsbSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZub2RlLmlzQXN5bmNQbGFjZWhvbGRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZXVzZSBlbGVtZW50IGZvciBzdGF0aWMgdHJlZXMuXHJcbiAgICAgIC8vIG5vdGUgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSB2bm9kZSBpcyBjbG9uZWQgLVxyXG4gICAgICAvLyBpZiB0aGUgbmV3IG5vZGUgaXMgbm90IGNsb25lZCBpdCBtZWFucyB0aGUgcmVuZGVyIGZ1bmN0aW9ucyBoYXZlIGJlZW5cclxuICAgICAgLy8gcmVzZXQgYnkgdGhlIGhvdC1yZWxvYWQtYXBpIGFuZCB3ZSBuZWVkIHRvIGRvIGEgcHJvcGVyIHJlLXJlbmRlci5cclxuICAgICAgaWYgKGlzVHJ1ZSh2bm9kZS5pc1N0YXRpYykgJiZcclxuICAgICAgICBpc1RydWUob2xkVm5vZGUuaXNTdGF0aWMpICYmXHJcbiAgICAgICAgdm5vZGUua2V5ID09PSBvbGRWbm9kZS5rZXkgJiZcclxuICAgICAgICAoaXNUcnVlKHZub2RlLmlzQ2xvbmVkKSB8fCBpc1RydWUodm5vZGUuaXNPbmNlKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgPSBvbGRWbm9kZS5jb21wb25lbnRJbnN0YW5jZTtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGk7XHJcbiAgICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICAgICAgaWYgKGlzRGVmKGRhdGEpICYmIGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnByZXBhdGNoKSkge1xyXG4gICAgICAgIGkob2xkVm5vZGUsIHZub2RlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG9sZENoID0gb2xkVm5vZGUuY2hpbGRyZW47XHJcbiAgICAgIHZhciBjaCA9IHZub2RlLmNoaWxkcmVuO1xyXG4gICAgICBpZiAoaXNEZWYoZGF0YSkgJiYgaXNQYXRjaGFibGUodm5vZGUpKSB7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNicy51cGRhdGUubGVuZ3RoOyArK2kpIHsgY2JzLnVwZGF0ZVtpXShvbGRWbm9kZSwgdm5vZGUpOyB9XHJcbiAgICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnVwZGF0ZSkpIHsgaShvbGRWbm9kZSwgdm5vZGUpOyB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcclxuICAgICAgICBpZiAoaXNEZWYob2xkQ2gpICYmIGlzRGVmKGNoKSkge1xyXG4gICAgICAgICAgaWYgKG9sZENoICE9PSBjaCkgeyB1cGRhdGVDaGlsZHJlbihlbG0sIG9sZENoLCBjaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KTsgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNEZWYoY2gpKSB7XHJcbiAgICAgICAgICBpZiAoaXNEZWYob2xkVm5vZGUudGV4dCkpIHsgbm9kZU9wcy5zZXRUZXh0Q29udGVudChlbG0sICcnKTsgfVxyXG4gICAgICAgICAgYWRkVm5vZGVzKGVsbSwgbnVsbCwgY2gsIDAsIGNoLmxlbmd0aCAtIDEsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRDaCkpIHtcclxuICAgICAgICAgIHJlbW92ZVZub2RlcyhlbG0sIG9sZENoLCAwLCBvbGRDaC5sZW5ndGggLSAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzRGVmKG9sZFZub2RlLnRleHQpKSB7XHJcbiAgICAgICAgICBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChvbGRWbm9kZS50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XHJcbiAgICAgICAgbm9kZU9wcy5zZXRUZXh0Q29udGVudChlbG0sIHZub2RlLnRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc0RlZihkYXRhKSkge1xyXG4gICAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5wb3N0cGF0Y2gpKSB7IGkob2xkVm5vZGUsIHZub2RlKTsgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW52b2tlSW5zZXJ0SG9vayh2bm9kZSwgcXVldWUsIGluaXRpYWwpIHtcclxuICAgICAgLy8gZGVsYXkgaW5zZXJ0IGhvb2tzIGZvciBjb21wb25lbnQgcm9vdCBub2RlcywgaW52b2tlIHRoZW0gYWZ0ZXIgdGhlXHJcbiAgICAgIC8vIGVsZW1lbnQgaXMgcmVhbGx5IGluc2VydGVkXHJcbiAgICAgIGlmIChpc1RydWUoaW5pdGlhbCkgJiYgaXNEZWYodm5vZGUucGFyZW50KSkge1xyXG4gICAgICAgIHZub2RlLnBhcmVudC5kYXRhLnBlbmRpbmdJbnNlcnQgPSBxdWV1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICBxdWV1ZVtpXS5kYXRhLmhvb2suaW5zZXJ0KHF1ZXVlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgaHlkcmF0aW9uQmFpbGVkID0gZmFsc2U7XHJcbiAgICAvLyBsaXN0IG9mIG1vZHVsZXMgdGhhdCBjYW4gc2tpcCBjcmVhdGUgaG9vayBkdXJpbmcgaHlkcmF0aW9uIGJlY2F1c2UgdGhleVxyXG4gICAgLy8gYXJlIGFscmVhZHkgcmVuZGVyZWQgb24gdGhlIGNsaWVudCBvciBoYXMgbm8gbmVlZCBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIC8vIE5vdGU6IHN0eWxlIGlzIGV4Y2x1ZGVkIGJlY2F1c2UgaXQgcmVsaWVzIG9uIGluaXRpYWwgY2xvbmUgZm9yIGZ1dHVyZVxyXG4gICAgLy8gZGVlcCB1cGRhdGVzICgjNzA2MykuXHJcbiAgICB2YXIgaXNSZW5kZXJlZE1vZHVsZSA9IG1ha2VNYXAoJ2F0dHJzLGNsYXNzLHN0YXRpY0NsYXNzLHN0YXRpY1N0eWxlLGtleScpO1xyXG5cclxuICAgIC8vIE5vdGU6IHRoaXMgaXMgYSBicm93c2VyLW9ubHkgZnVuY3Rpb24gc28gd2UgY2FuIGFzc3VtZSBlbG1zIGFyZSBET00gbm9kZXMuXHJcbiAgICBmdW5jdGlvbiBoeWRyYXRlKGVsbSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgaW5WUHJlKSB7XHJcbiAgICAgIHZhciBpO1xyXG4gICAgICB2YXIgdGFnID0gdm5vZGUudGFnO1xyXG4gICAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xyXG4gICAgICBpblZQcmUgPSBpblZQcmUgfHwgKGRhdGEgJiYgZGF0YS5wcmUpO1xyXG4gICAgICB2bm9kZS5lbG0gPSBlbG07XHJcblxyXG4gICAgICBpZiAoaXNUcnVlKHZub2RlLmlzQ29tbWVudCkgJiYgaXNEZWYodm5vZGUuYXN5bmNGYWN0b3J5KSkge1xyXG4gICAgICAgIHZub2RlLmlzQXN5bmNQbGFjZWhvbGRlciA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgICAvLyBhc3NlcnQgbm9kZSBtYXRjaFxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKCFhc3NlcnROb2RlTWF0Y2goZWxtLCB2bm9kZSwgaW5WUHJlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc0RlZihkYXRhKSkge1xyXG4gICAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5pbml0KSkgeyBpKHZub2RlLCB0cnVlIC8qIGh5ZHJhdGluZyAqLyk7IH1cclxuICAgICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xyXG4gICAgICAgICAgLy8gY2hpbGQgY29tcG9uZW50LiBpdCBzaG91bGQgaGF2ZSBoeWRyYXRlZCBpdHMgb3duIHRyZWUuXHJcbiAgICAgICAgICBpbml0Q29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzRGVmKHRhZykpIHtcclxuICAgICAgICBpZiAoaXNEZWYoY2hpbGRyZW4pKSB7XHJcbiAgICAgICAgICAvLyBlbXB0eSBlbGVtZW50LCBhbGxvdyBjbGllbnQgdG8gcGljayB1cCBhbmQgcG9wdWxhdGUgY2hpbGRyZW5cclxuICAgICAgICAgIGlmICghZWxtLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICBjcmVhdGVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4sIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB2LWh0bWwgYW5kIGRvbVByb3BzOiBpbm5lckhUTUxcclxuICAgICAgICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhKSAmJiBpc0RlZihpID0gaS5kb21Qcm9wcykgJiYgaXNEZWYoaSA9IGkuaW5uZXJIVE1MKSkge1xyXG4gICAgICAgICAgICAgIGlmIChpICE9PSBlbG0uaW5uZXJIVE1MKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAgICAgICAgICAgIWh5ZHJhdGlvbkJhaWxlZFxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgIGh5ZHJhdGlvbkJhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUGFyZW50OiAnLCBlbG0pO1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3NlcnZlciBpbm5lckhUTUw6ICcsIGkpO1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ2NsaWVudCBpbm5lckhUTUw6ICcsIGVsbS5pbm5lckhUTUwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYW5kIGNvbXBhcmUgY2hpbGRyZW4gbGlzdHNcclxuICAgICAgICAgICAgICB2YXIgY2hpbGRyZW5NYXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IGVsbS5maXJzdENoaWxkO1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGROb2RlIHx8ICFoeWRyYXRlKGNoaWxkTm9kZSwgY2hpbGRyZW5baSQxXSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBpblZQcmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNoaWxkcmVuTWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLy8gaWYgY2hpbGROb2RlIGlzIG5vdCBudWxsLCBpdCBtZWFucyB0aGUgYWN0dWFsIGNoaWxkTm9kZXMgbGlzdCBpc1xyXG4gICAgICAgICAgICAgIC8vIGxvbmdlciB0aGFuIHRoZSB2aXJ0dWFsIGNoaWxkcmVuIGxpc3QuXHJcbiAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbk1hdGNoIHx8IGNoaWxkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgICAgICAgICAgICFoeWRyYXRpb25CYWlsZWRcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICBoeWRyYXRpb25CYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1BhcmVudDogJywgZWxtKTtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNaXNtYXRjaGluZyBjaGlsZE5vZGVzIHZzLiBWTm9kZXM6ICcsIGVsbS5jaGlsZE5vZGVzLCBjaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEludm9rZSA9IGZhbHNlO1xyXG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFpc1JlbmRlcmVkTW9kdWxlKGtleSkpIHtcclxuICAgICAgICAgICAgICBmdWxsSW52b2tlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBpbnZva2VDcmVhdGVIb29rcyh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWZ1bGxJbnZva2UgJiYgZGF0YVsnY2xhc3MnXSkge1xyXG4gICAgICAgICAgICAvLyBlbnN1cmUgY29sbGVjdGluZyBkZXBzIGZvciBkZWVwIGNsYXNzIGJpbmRpbmdzIGZvciBmdXR1cmUgdXBkYXRlc1xyXG4gICAgICAgICAgICB0cmF2ZXJzZShkYXRhWydjbGFzcyddKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZWxtLmRhdGEgIT09IHZub2RlLnRleHQpIHtcclxuICAgICAgICBlbG0uZGF0YSA9IHZub2RlLnRleHQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhc3NlcnROb2RlTWF0Y2gobm9kZSwgdm5vZGUsIGluVlByZSkge1xyXG4gICAgICBpZiAoaXNEZWYodm5vZGUudGFnKSkge1xyXG4gICAgICAgIHJldHVybiB2bm9kZS50YWcuaW5kZXhPZigndnVlLWNvbXBvbmVudCcpID09PSAwIHx8IChcclxuICAgICAgICAgICFpc1Vua25vd25FbGVtZW50JCQxKHZub2RlLCBpblZQcmUpICYmXHJcbiAgICAgICAgICB2bm9kZS50YWcudG9Mb3dlckNhc2UoKSA9PT0gKG5vZGUudGFnTmFtZSAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09ICh2bm9kZS5pc0NvbW1lbnQgPyA4IDogMylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiBwYXRjaChvbGRWbm9kZSwgdm5vZGUsIGh5ZHJhdGluZywgcmVtb3ZlT25seSwgcGFyZW50RWxtLCByZWZFbG0pIHtcclxuICAgICAgaWYgKGlzVW5kZWYodm5vZGUpKSB7XHJcbiAgICAgICAgaWYgKGlzRGVmKG9sZFZub2RlKSkgeyBpbnZva2VEZXN0cm95SG9vayhvbGRWbm9kZSk7IH1cclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGlzSW5pdGlhbFBhdGNoID0gZmFsc2U7XHJcbiAgICAgIHZhciBpbnNlcnRlZFZub2RlUXVldWUgPSBbXTtcclxuXHJcbiAgICAgIGlmIChpc1VuZGVmKG9sZFZub2RlKSkge1xyXG4gICAgICAgIC8vIGVtcHR5IG1vdW50IChsaWtlbHkgYXMgY29tcG9uZW50KSwgY3JlYXRlIG5ldyByb290IGVsZW1lbnRcclxuICAgICAgICBpc0luaXRpYWxQYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaXNSZWFsRWxlbWVudCA9IGlzRGVmKG9sZFZub2RlLm5vZGVUeXBlKTtcclxuICAgICAgICBpZiAoIWlzUmVhbEVsZW1lbnQgJiYgc2FtZVZub2RlKG9sZFZub2RlLCB2bm9kZSkpIHtcclxuICAgICAgICAgIC8vIHBhdGNoIGV4aXN0aW5nIHJvb3Qgbm9kZVxyXG4gICAgICAgICAgcGF0Y2hWbm9kZShvbGRWbm9kZSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcmVtb3ZlT25seSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpc1JlYWxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vIG1vdW50aW5nIHRvIGEgcmVhbCBlbGVtZW50XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgc2VydmVyLXJlbmRlcmVkIGNvbnRlbnQgYW5kIGlmIHdlIGNhbiBwZXJmb3JtXHJcbiAgICAgICAgICAgIC8vIGEgc3VjY2Vzc2Z1bCBoeWRyYXRpb24uXHJcbiAgICAgICAgICAgIGlmIChvbGRWbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBvbGRWbm9kZS5oYXNBdHRyaWJ1dGUoU1NSX0FUVFIpKSB7XHJcbiAgICAgICAgICAgICAgb2xkVm5vZGUucmVtb3ZlQXR0cmlidXRlKFNTUl9BVFRSKTtcclxuICAgICAgICAgICAgICBoeWRyYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc1RydWUoaHlkcmF0aW5nKSkge1xyXG4gICAgICAgICAgICAgIGlmIChoeWRyYXRlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSkge1xyXG4gICAgICAgICAgICAgICAgaW52b2tlSW5zZXJ0SG9vayh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvbGRWbm9kZVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAgICAgICAnVGhlIGNsaWVudC1zaWRlIHJlbmRlcmVkIHZpcnR1YWwgRE9NIHRyZWUgaXMgbm90IG1hdGNoaW5nICcgK1xyXG4gICAgICAgICAgICAgICAgICAnc2VydmVyLXJlbmRlcmVkIGNvbnRlbnQuIFRoaXMgaXMgbGlrZWx5IGNhdXNlZCBieSBpbmNvcnJlY3QgJyArXHJcbiAgICAgICAgICAgICAgICAgICdIVE1MIG1hcmt1cCwgZm9yIGV4YW1wbGUgbmVzdGluZyBibG9jay1sZXZlbCBlbGVtZW50cyBpbnNpZGUgJyArXHJcbiAgICAgICAgICAgICAgICAgICc8cD4sIG9yIG1pc3NpbmcgPHRib2R5Pi4gQmFpbGluZyBoeWRyYXRpb24gYW5kIHBlcmZvcm1pbmcgJyArXHJcbiAgICAgICAgICAgICAgICAgICdmdWxsIGNsaWVudC1zaWRlIHJlbmRlci4nXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBlaXRoZXIgbm90IHNlcnZlci1yZW5kZXJlZCwgb3IgaHlkcmF0aW9uIGZhaWxlZC5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IG5vZGUgYW5kIHJlcGxhY2UgaXRcclxuICAgICAgICAgICAgb2xkVm5vZGUgPSBlbXB0eU5vZGVBdChvbGRWbm9kZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gcmVwbGFjaW5nIGV4aXN0aW5nIGVsZW1lbnRcclxuICAgICAgICAgIHZhciBvbGRFbG0gPSBvbGRWbm9kZS5lbG07XHJcbiAgICAgICAgICB2YXIgcGFyZW50RWxtJDEgPSBub2RlT3BzLnBhcmVudE5vZGUob2xkRWxtKTtcclxuXHJcbiAgICAgICAgICAvLyBjcmVhdGUgbmV3IG5vZGVcclxuICAgICAgICAgIGNyZWF0ZUVsbShcclxuICAgICAgICAgICAgdm5vZGUsXHJcbiAgICAgICAgICAgIGluc2VydGVkVm5vZGVRdWV1ZSxcclxuICAgICAgICAgICAgLy8gZXh0cmVtZWx5IHJhcmUgZWRnZSBjYXNlOiBkbyBub3QgaW5zZXJ0IGlmIG9sZCBlbGVtZW50IGlzIGluIGFcclxuICAgICAgICAgICAgLy8gbGVhdmluZyB0cmFuc2l0aW9uLiBPbmx5IGhhcHBlbnMgd2hlbiBjb21iaW5pbmcgdHJhbnNpdGlvbiArXHJcbiAgICAgICAgICAgIC8vIGtlZXAtYWxpdmUgKyBIT0NzLiAoIzQ1OTApXHJcbiAgICAgICAgICAgIG9sZEVsbS5fbGVhdmVDYiA/IG51bGwgOiBwYXJlbnRFbG0kMSxcclxuICAgICAgICAgICAgbm9kZU9wcy5uZXh0U2libGluZyhvbGRFbG0pXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIC8vIHVwZGF0ZSBwYXJlbnQgcGxhY2Vob2xkZXIgbm9kZSBlbGVtZW50LCByZWN1cnNpdmVseVxyXG4gICAgICAgICAgaWYgKGlzRGVmKHZub2RlLnBhcmVudCkpIHtcclxuICAgICAgICAgICAgdmFyIGFuY2VzdG9yID0gdm5vZGUucGFyZW50O1xyXG4gICAgICAgICAgICB2YXIgcGF0Y2hhYmxlID0gaXNQYXRjaGFibGUodm5vZGUpO1xyXG4gICAgICAgICAgICB3aGlsZSAoYW5jZXN0b3IpIHtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNicy5kZXN0cm95Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjYnMuZGVzdHJveVtpXShhbmNlc3Rvcik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGFuY2VzdG9yLmVsbSA9IHZub2RlLmVsbTtcclxuICAgICAgICAgICAgICBpZiAocGF0Y2hhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpJDEgPSAwOyBpJDEgPCBjYnMuY3JlYXRlLmxlbmd0aDsgKytpJDEpIHtcclxuICAgICAgICAgICAgICAgICAgY2JzLmNyZWF0ZVtpJDFdKGVtcHR5Tm9kZSwgYW5jZXN0b3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gIzY1MTNcclxuICAgICAgICAgICAgICAgIC8vIGludm9rZSBpbnNlcnQgaG9va3MgdGhhdCBtYXkgaGF2ZSBiZWVuIG1lcmdlZCBieSBjcmVhdGUgaG9va3MuXHJcbiAgICAgICAgICAgICAgICAvLyBlLmcuIGZvciBkaXJlY3RpdmVzIHRoYXQgdXNlcyB0aGUgXCJpbnNlcnRlZFwiIGhvb2suXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0ID0gYW5jZXN0b3IuZGF0YS5ob29rLmluc2VydDtcclxuICAgICAgICAgICAgICAgIGlmIChpbnNlcnQubWVyZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIHN0YXJ0IGF0IGluZGV4IDEgdG8gYXZvaWQgcmUtaW52b2tpbmcgY29tcG9uZW50IG1vdW50ZWQgaG9va1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpJDIgPSAxOyBpJDIgPCBpbnNlcnQuZm5zLmxlbmd0aDsgaSQyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQuZm5zW2kkMl0oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWdpc3RlclJlZihhbmNlc3Rvcik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gZGVzdHJveSBvbGQgbm9kZVxyXG4gICAgICAgICAgaWYgKGlzRGVmKHBhcmVudEVsbSQxKSkge1xyXG4gICAgICAgICAgICByZW1vdmVWbm9kZXMocGFyZW50RWxtJDEsIFtvbGRWbm9kZV0sIDAsIDApO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50YWcpKSB7XHJcbiAgICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKG9sZFZub2RlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGludm9rZUluc2VydEhvb2sodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgaXNJbml0aWFsUGF0Y2gpO1xyXG4gICAgICByZXR1cm4gdm5vZGUuZWxtXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIGRpcmVjdGl2ZXMgPSB7XHJcbiAgICBjcmVhdGU6IHVwZGF0ZURpcmVjdGl2ZXMsXHJcbiAgICB1cGRhdGU6IHVwZGF0ZURpcmVjdGl2ZXMsXHJcbiAgICBkZXN0cm95OiBmdW5jdGlvbiB1bmJpbmREaXJlY3RpdmVzKHZub2RlKSB7XHJcbiAgICAgIHVwZGF0ZURpcmVjdGl2ZXModm5vZGUsIGVtcHR5Tm9kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVEaXJlY3RpdmVzKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgaWYgKG9sZFZub2RlLmRhdGEuZGlyZWN0aXZlcyB8fCB2bm9kZS5kYXRhLmRpcmVjdGl2ZXMpIHtcclxuICAgICAgX3VwZGF0ZShvbGRWbm9kZSwgdm5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3VwZGF0ZShvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIHZhciBpc0NyZWF0ZSA9IG9sZFZub2RlID09PSBlbXB0eU5vZGU7XHJcbiAgICB2YXIgaXNEZXN0cm95ID0gdm5vZGUgPT09IGVtcHR5Tm9kZTtcclxuICAgIHZhciBvbGREaXJzID0gbm9ybWFsaXplRGlyZWN0aXZlcyQxKG9sZFZub2RlLmRhdGEuZGlyZWN0aXZlcywgb2xkVm5vZGUuY29udGV4dCk7XHJcbiAgICB2YXIgbmV3RGlycyA9IG5vcm1hbGl6ZURpcmVjdGl2ZXMkMSh2bm9kZS5kYXRhLmRpcmVjdGl2ZXMsIHZub2RlLmNvbnRleHQpO1xyXG5cclxuICAgIHZhciBkaXJzV2l0aEluc2VydCA9IFtdO1xyXG4gICAgdmFyIGRpcnNXaXRoUG9zdHBhdGNoID0gW107XHJcblxyXG4gICAgdmFyIGtleSwgb2xkRGlyLCBkaXI7XHJcbiAgICBmb3IgKGtleSBpbiBuZXdEaXJzKSB7XHJcbiAgICAgIG9sZERpciA9IG9sZERpcnNba2V5XTtcclxuICAgICAgZGlyID0gbmV3RGlyc1trZXldO1xyXG4gICAgICBpZiAoIW9sZERpcikge1xyXG4gICAgICAgIC8vIG5ldyBkaXJlY3RpdmUsIGJpbmRcclxuICAgICAgICBjYWxsSG9vayQxKGRpciwgJ2JpbmQnLCB2bm9kZSwgb2xkVm5vZGUpO1xyXG4gICAgICAgIGlmIChkaXIuZGVmICYmIGRpci5kZWYuaW5zZXJ0ZWQpIHtcclxuICAgICAgICAgIGRpcnNXaXRoSW5zZXJ0LnB1c2goZGlyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gZXhpc3RpbmcgZGlyZWN0aXZlLCB1cGRhdGVcclxuICAgICAgICBkaXIub2xkVmFsdWUgPSBvbGREaXIudmFsdWU7XHJcbiAgICAgICAgY2FsbEhvb2skMShkaXIsICd1cGRhdGUnLCB2bm9kZSwgb2xkVm5vZGUpO1xyXG4gICAgICAgIGlmIChkaXIuZGVmICYmIGRpci5kZWYuY29tcG9uZW50VXBkYXRlZCkge1xyXG4gICAgICAgICAgZGlyc1dpdGhQb3N0cGF0Y2gucHVzaChkaXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJzV2l0aEluc2VydC5sZW5ndGgpIHtcclxuICAgICAgdmFyIGNhbGxJbnNlcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJzV2l0aEluc2VydC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY2FsbEhvb2skMShkaXJzV2l0aEluc2VydFtpXSwgJ2luc2VydGVkJywgdm5vZGUsIG9sZFZub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIGlmIChpc0NyZWF0ZSkge1xyXG4gICAgICAgIG1lcmdlVk5vZGVIb29rKHZub2RlLCAnaW5zZXJ0JywgY2FsbEluc2VydCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbEluc2VydCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpcnNXaXRoUG9zdHBhdGNoLmxlbmd0aCkge1xyXG4gICAgICBtZXJnZVZOb2RlSG9vayh2bm9kZSwgJ3Bvc3RwYXRjaCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcnNXaXRoUG9zdHBhdGNoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjYWxsSG9vayQxKGRpcnNXaXRoUG9zdHBhdGNoW2ldLCAnY29tcG9uZW50VXBkYXRlZCcsIHZub2RlLCBvbGRWbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzQ3JlYXRlKSB7XHJcbiAgICAgIGZvciAoa2V5IGluIG9sZERpcnMpIHtcclxuICAgICAgICBpZiAoIW5ld0RpcnNba2V5XSkge1xyXG4gICAgICAgICAgLy8gbm8gbG9uZ2VyIHByZXNlbnQsIHVuYmluZFxyXG4gICAgICAgICAgY2FsbEhvb2skMShvbGREaXJzW2tleV0sICd1bmJpbmQnLCBvbGRWbm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgZW1wdHlNb2RpZmllcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVEaXJlY3RpdmVzJDEoXHJcbiAgICBkaXJzLFxyXG4gICAgdm1cclxuICApIHtcclxuICAgIHZhciByZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgaWYgKCFkaXJzKSB7XHJcbiAgICAgIC8vICRmbG93LWRpc2FibGUtbGluZVxyXG4gICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcbiAgICB2YXIgaSwgZGlyO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGRpcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZGlyID0gZGlyc1tpXTtcclxuICAgICAgaWYgKCFkaXIubW9kaWZpZXJzKSB7XHJcbiAgICAgICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICAgICAgZGlyLm1vZGlmaWVycyA9IGVtcHR5TW9kaWZpZXJzO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc1tnZXRSYXdEaXJOYW1lKGRpcildID0gZGlyO1xyXG4gICAgICBkaXIuZGVmID0gcmVzb2x2ZUFzc2V0KHZtLiRvcHRpb25zLCAnZGlyZWN0aXZlcycsIGRpci5uYW1lLCB0cnVlKTtcclxuICAgIH1cclxuICAgIC8vICRmbG93LWRpc2FibGUtbGluZVxyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UmF3RGlyTmFtZShkaXIpIHtcclxuICAgIHJldHVybiBkaXIucmF3TmFtZSB8fCAoKGRpci5uYW1lKSArIFwiLlwiICsgKE9iamVjdC5rZXlzKGRpci5tb2RpZmllcnMgfHwge30pLmpvaW4oJy4nKSkpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjYWxsSG9vayQxKGRpciwgaG9vaywgdm5vZGUsIG9sZFZub2RlLCBpc0Rlc3Ryb3kpIHtcclxuICAgIHZhciBmbiA9IGRpci5kZWYgJiYgZGlyLmRlZltob29rXTtcclxuICAgIGlmIChmbikge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGZuKHZub2RlLmVsbSwgZGlyLCB2bm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBoYW5kbGVFcnJvcihlLCB2bm9kZS5jb250ZXh0LCAoXCJkaXJlY3RpdmUgXCIgKyAoZGlyLm5hbWUpICsgXCIgXCIgKyBob29rICsgXCIgaG9va1wiKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBiYXNlTW9kdWxlcyA9IFtcclxuICAgIHJlZixcclxuICAgIGRpcmVjdGl2ZXNcclxuICBdXHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVBdHRycyhvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIHZhciBvcHRzID0gdm5vZGUuY29tcG9uZW50T3B0aW9ucztcclxuICAgIGlmIChpc0RlZihvcHRzKSAmJiBvcHRzLkN0b3Iub3B0aW9ucy5pbmhlcml0QXR0cnMgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaWYgKGlzVW5kZWYob2xkVm5vZGUuZGF0YS5hdHRycykgJiYgaXNVbmRlZih2bm9kZS5kYXRhLmF0dHJzKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHZhciBrZXksIGN1ciwgb2xkO1xyXG4gICAgdmFyIGVsbSA9IHZub2RlLmVsbTtcclxuICAgIHZhciBvbGRBdHRycyA9IG9sZFZub2RlLmRhdGEuYXR0cnMgfHwge307XHJcbiAgICB2YXIgYXR0cnMgPSB2bm9kZS5kYXRhLmF0dHJzIHx8IHt9O1xyXG4gICAgLy8gY2xvbmUgb2JzZXJ2ZWQgb2JqZWN0cywgYXMgdGhlIHVzZXIgcHJvYmFibHkgd2FudHMgdG8gbXV0YXRlIGl0XHJcbiAgICBpZiAoaXNEZWYoYXR0cnMuX19vYl9fKSkge1xyXG4gICAgICBhdHRycyA9IHZub2RlLmRhdGEuYXR0cnMgPSBleHRlbmQoe30sIGF0dHJzKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGtleSBpbiBhdHRycykge1xyXG4gICAgICBjdXIgPSBhdHRyc1trZXldO1xyXG4gICAgICBvbGQgPSBvbGRBdHRyc1trZXldO1xyXG4gICAgICBpZiAob2xkICE9PSBjdXIpIHtcclxuICAgICAgICBzZXRBdHRyKGVsbSwga2V5LCBjdXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAjNDM5MTogaW4gSUU5LCBzZXR0aW5nIHR5cGUgY2FuIHJlc2V0IHZhbHVlIGZvciBpbnB1dFt0eXBlPXJhZGlvXVxyXG4gICAgLy8gIzY2NjY6IElFL0VkZ2UgZm9yY2VzIHByb2dyZXNzIHZhbHVlIGRvd24gdG8gMSBiZWZvcmUgc2V0dGluZyBhIG1heFxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoKGlzSUUgfHwgaXNFZGdlKSAmJiBhdHRycy52YWx1ZSAhPT0gb2xkQXR0cnMudmFsdWUpIHtcclxuICAgICAgc2V0QXR0cihlbG0sICd2YWx1ZScsIGF0dHJzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGZvciAoa2V5IGluIG9sZEF0dHJzKSB7XHJcbiAgICAgIGlmIChpc1VuZGVmKGF0dHJzW2tleV0pKSB7XHJcbiAgICAgICAgaWYgKGlzWGxpbmsoa2V5KSkge1xyXG4gICAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rTlMsIGdldFhsaW5rUHJvcChrZXkpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFpc0VudW1lcmF0ZWRBdHRyKGtleSkpIHtcclxuICAgICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldEF0dHIoZWwsIGtleSwgdmFsdWUpIHtcclxuICAgIGlmIChlbC50YWdOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XHJcbiAgICAgIGJhc2VTZXRBdHRyKGVsLCBrZXksIHZhbHVlKTtcclxuICAgIH0gZWxzZSBpZiAoaXNCb29sZWFuQXR0cihrZXkpKSB7XHJcbiAgICAgIC8vIHNldCBhdHRyaWJ1dGUgZm9yIGJsYW5rIHZhbHVlXHJcbiAgICAgIC8vIGUuZy4gPG9wdGlvbiBkaXNhYmxlZD5TZWxlY3Qgb25lPC9vcHRpb24+XHJcbiAgICAgIGlmIChpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGFsbG93ZnVsbHNjcmVlbiBpcyBhIGJvb2xlYW4gYXR0cmlidXRlIGZvciA8aWZyYW1lPixcclxuICAgICAgICAvLyBidXQgRmxhc2ggZXhwZWN0cyBhIHZhbHVlIG9mIFwidHJ1ZVwiIHdoZW4gdXNlZCBvbiA8ZW1iZWQ+IHRhZ1xyXG4gICAgICAgIHZhbHVlID0ga2V5ID09PSAnYWxsb3dmdWxsc2NyZWVuJyAmJiBlbC50YWdOYW1lID09PSAnRU1CRUQnXHJcbiAgICAgICAgICA/ICd0cnVlJ1xyXG4gICAgICAgICAgOiBrZXk7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzRW51bWVyYXRlZEF0dHIoa2V5KSkge1xyXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJyA/ICdmYWxzZScgOiAndHJ1ZScpO1xyXG4gICAgfSBlbHNlIGlmIChpc1hsaW5rKGtleSkpIHtcclxuICAgICAgaWYgKGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgZ2V0WGxpbmtQcm9wKGtleSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rTlMsIGtleSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYXNlU2V0QXR0cihlbCwga2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBiYXNlU2V0QXR0cihlbCwga2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gIzcxMzg6IElFMTAgJiAxMSBmaXJlcyBpbnB1dCBldmVudCB3aGVuIHNldHRpbmcgcGxhY2Vob2xkZXIgb25cclxuICAgICAgLy8gPHRleHRhcmVhPi4uLiBibG9jayB0aGUgZmlyc3QgaW5wdXQgZXZlbnQgYW5kIHJlbW92ZSB0aGUgYmxvY2tlclxyXG4gICAgICAvLyBpbW1lZGlhdGVseS5cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmIChcclxuICAgICAgICBpc0lFICYmICFpc0lFOSAmJlxyXG4gICAgICAgIGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScgJiZcclxuICAgICAgICBrZXkgPT09ICdwbGFjZWhvbGRlcicgJiYgIWVsLl9faWVwaFxyXG4gICAgICApIHtcclxuICAgICAgICB2YXIgYmxvY2tlciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBibG9ja2VyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgYmxvY2tlcik7XHJcbiAgICAgICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICAgICAgZWwuX19pZXBoID0gdHJ1ZTsgLyogSUUgcGxhY2Vob2xkZXIgcGF0Y2hlZCAqL1xyXG4gICAgICB9XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhdHRycyA9IHtcclxuICAgIGNyZWF0ZTogdXBkYXRlQXR0cnMsXHJcbiAgICB1cGRhdGU6IHVwZGF0ZUF0dHJzXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlQ2xhc3Mob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgICB2YXIgZWwgPSB2bm9kZS5lbG07XHJcbiAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICB2YXIgb2xkRGF0YSA9IG9sZFZub2RlLmRhdGE7XHJcbiAgICBpZiAoXHJcbiAgICAgIGlzVW5kZWYoZGF0YS5zdGF0aWNDbGFzcykgJiZcclxuICAgICAgaXNVbmRlZihkYXRhLmNsYXNzKSAmJiAoXHJcbiAgICAgICAgaXNVbmRlZihvbGREYXRhKSB8fCAoXHJcbiAgICAgICAgICBpc1VuZGVmKG9sZERhdGEuc3RhdGljQ2xhc3MpICYmXHJcbiAgICAgICAgICBpc1VuZGVmKG9sZERhdGEuY2xhc3MpXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNscyA9IGdlbkNsYXNzRm9yVm5vZGUodm5vZGUpO1xyXG5cclxuICAgIC8vIGhhbmRsZSB0cmFuc2l0aW9uIGNsYXNzZXNcclxuICAgIHZhciB0cmFuc2l0aW9uQ2xhc3MgPSBlbC5fdHJhbnNpdGlvbkNsYXNzZXM7XHJcbiAgICBpZiAoaXNEZWYodHJhbnNpdGlvbkNsYXNzKSkge1xyXG4gICAgICBjbHMgPSBjb25jYXQoY2xzLCBzdHJpbmdpZnlDbGFzcyh0cmFuc2l0aW9uQ2xhc3MpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXQgdGhlIGNsYXNzXHJcbiAgICBpZiAoY2xzICE9PSBlbC5fcHJldkNsYXNzKSB7XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbHMpO1xyXG4gICAgICBlbC5fcHJldkNsYXNzID0gY2xzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGtsYXNzID0ge1xyXG4gICAgY3JlYXRlOiB1cGRhdGVDbGFzcyxcclxuICAgIHVwZGF0ZTogdXBkYXRlQ2xhc3NcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgdmFsaWREaXZpc2lvbkNoYXJSRSA9IC9bXFx3KS4rXFwtXyRcXF1dLztcclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VGaWx0ZXJzKGV4cCkge1xyXG4gICAgdmFyIGluU2luZ2xlID0gZmFsc2U7XHJcbiAgICB2YXIgaW5Eb3VibGUgPSBmYWxzZTtcclxuICAgIHZhciBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7XHJcbiAgICB2YXIgaW5SZWdleCA9IGZhbHNlO1xyXG4gICAgdmFyIGN1cmx5ID0gMDtcclxuICAgIHZhciBzcXVhcmUgPSAwO1xyXG4gICAgdmFyIHBhcmVuID0gMDtcclxuICAgIHZhciBsYXN0RmlsdGVySW5kZXggPSAwO1xyXG4gICAgdmFyIGMsIHByZXYsIGksIGV4cHJlc3Npb24sIGZpbHRlcnM7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGV4cC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBwcmV2ID0gYztcclxuICAgICAgYyA9IGV4cC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICBpZiAoaW5TaW5nbGUpIHtcclxuICAgICAgICBpZiAoYyA9PT0gMHgyNyAmJiBwcmV2ICE9PSAweDVDKSB7IGluU2luZ2xlID0gZmFsc2U7IH1cclxuICAgICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xyXG4gICAgICAgIGlmIChjID09PSAweDIyICYmIHByZXYgIT09IDB4NUMpIHsgaW5Eb3VibGUgPSBmYWxzZTsgfVxyXG4gICAgICB9IGVsc2UgaWYgKGluVGVtcGxhdGVTdHJpbmcpIHtcclxuICAgICAgICBpZiAoYyA9PT0gMHg2MCAmJiBwcmV2ICE9PSAweDVDKSB7IGluVGVtcGxhdGVTdHJpbmcgPSBmYWxzZTsgfVxyXG4gICAgICB9IGVsc2UgaWYgKGluUmVnZXgpIHtcclxuICAgICAgICBpZiAoYyA9PT0gMHgyZiAmJiBwcmV2ICE9PSAweDVDKSB7IGluUmVnZXggPSBmYWxzZTsgfVxyXG4gICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgIGMgPT09IDB4N0MgJiYgLy8gcGlwZVxyXG4gICAgICAgIGV4cC5jaGFyQ29kZUF0KGkgKyAxKSAhPT0gMHg3QyAmJlxyXG4gICAgICAgIGV4cC5jaGFyQ29kZUF0KGkgLSAxKSAhPT0gMHg3QyAmJlxyXG4gICAgICAgICFjdXJseSAmJiAhc3F1YXJlICYmICFwYXJlblxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBleHByZXNzaW9uXHJcbiAgICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMTtcclxuICAgICAgICAgIGV4cHJlc3Npb24gPSBleHAuc2xpY2UoMCwgaSkudHJpbSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwdXNoRmlsdGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgY2FzZSAweDIyOiBpbkRvdWJsZSA9IHRydWU7IGJyZWFrICAgICAgICAgLy8gXCJcclxuICAgICAgICAgIGNhc2UgMHgyNzogaW5TaW5nbGUgPSB0cnVlOyBicmVhayAgICAgICAgIC8vICdcclxuICAgICAgICAgIGNhc2UgMHg2MDogaW5UZW1wbGF0ZVN0cmluZyA9IHRydWU7IGJyZWFrIC8vIGBcclxuICAgICAgICAgIGNhc2UgMHgyODogcGFyZW4rKzsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIChcclxuICAgICAgICAgIGNhc2UgMHgyOTogcGFyZW4tLTsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIClcclxuICAgICAgICAgIGNhc2UgMHg1Qjogc3F1YXJlKys7IGJyZWFrICAgICAgICAgICAgICAgIC8vIFtcclxuICAgICAgICAgIGNhc2UgMHg1RDogc3F1YXJlLS07IGJyZWFrICAgICAgICAgICAgICAgIC8vIF1cclxuICAgICAgICAgIGNhc2UgMHg3QjogY3VybHkrKzsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgIGNhc2UgMHg3RDogY3VybHktLTsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGMgPT09IDB4MmYpIHsgLy8gL1xyXG4gICAgICAgICAgdmFyIGogPSBpIC0gMTtcclxuICAgICAgICAgIHZhciBwID0gKHZvaWQgMCk7XHJcbiAgICAgICAgICAvLyBmaW5kIGZpcnN0IG5vbi13aGl0ZXNwYWNlIHByZXYgY2hhclxyXG4gICAgICAgICAgZm9yICg7IGogPj0gMDsgai0tKSB7XHJcbiAgICAgICAgICAgIHAgPSBleHAuY2hhckF0KGopO1xyXG4gICAgICAgICAgICBpZiAocCAhPT0gJyAnKSB7IGJyZWFrIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghcCB8fCAhdmFsaWREaXZpc2lvbkNoYXJSRS50ZXN0KHApKSB7XHJcbiAgICAgICAgICAgIGluUmVnZXggPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChleHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZXhwcmVzc2lvbiA9IGV4cC5zbGljZSgwLCBpKS50cmltKCk7XHJcbiAgICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gMCkge1xyXG4gICAgICBwdXNoRmlsdGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHVzaEZpbHRlcigpIHtcclxuICAgICAgKGZpbHRlcnMgfHwgKGZpbHRlcnMgPSBbXSkpLnB1c2goZXhwLnNsaWNlKGxhc3RGaWx0ZXJJbmRleCwgaSkudHJpbSgpKTtcclxuICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpbHRlcnMpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbHRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHByZXNzaW9uID0gd3JhcEZpbHRlcihleHByZXNzaW9uLCBmaWx0ZXJzW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBleHByZXNzaW9uXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB3cmFwRmlsdGVyKGV4cCwgZmlsdGVyKSB7XHJcbiAgICB2YXIgaSA9IGZpbHRlci5pbmRleE9mKCcoJyk7XHJcbiAgICBpZiAoaSA8IDApIHtcclxuICAgICAgLy8gX2Y6IHJlc29sdmVGaWx0ZXJcclxuICAgICAgcmV0dXJuIChcIl9mKFxcXCJcIiArIGZpbHRlciArIFwiXFxcIikoXCIgKyBleHAgKyBcIilcIilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBuYW1lID0gZmlsdGVyLnNsaWNlKDAsIGkpO1xyXG4gICAgICB2YXIgYXJncyA9IGZpbHRlci5zbGljZShpICsgMSk7XHJcbiAgICAgIHJldHVybiAoXCJfZihcXFwiXCIgKyBuYW1lICsgXCJcXFwiKShcIiArIGV4cCArIChhcmdzICE9PSAnKScgPyAnLCcgKyBhcmdzIDogYXJncykpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYmFzZVdhcm4obXNnKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKChcIltWdWUgY29tcGlsZXJdOiBcIiArIG1zZykpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGx1Y2tNb2R1bGVGdW5jdGlvbihcclxuICAgIG1vZHVsZXMsXHJcbiAgICBrZXlcclxuICApIHtcclxuICAgIHJldHVybiBtb2R1bGVzXHJcbiAgICAgID8gbW9kdWxlcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1ba2V5XTsgfSkuZmlsdGVyKGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9KVxyXG4gICAgICA6IFtdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRQcm9wKGVsLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgKGVsLnByb3BzIHx8IChlbC5wcm9wcyA9IFtdKSkucHVzaCh7IG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgIGVsLnBsYWluID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRBdHRyKGVsLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgKGVsLmF0dHJzIHx8IChlbC5hdHRycyA9IFtdKSkucHVzaCh7IG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgIGVsLnBsYWluID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgYSByYXcgYXR0ciAodXNlIHRoaXMgaW4gcHJlVHJhbnNmb3JtcylcclxuICBmdW5jdGlvbiBhZGRSYXdBdHRyKGVsLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgZWwuYXR0cnNNYXBbbmFtZV0gPSB2YWx1ZTtcclxuICAgIGVsLmF0dHJzTGlzdC5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkRGlyZWN0aXZlKFxyXG4gICAgZWwsXHJcbiAgICBuYW1lLFxyXG4gICAgcmF3TmFtZSxcclxuICAgIHZhbHVlLFxyXG4gICAgYXJnLFxyXG4gICAgbW9kaWZpZXJzXHJcbiAgKSB7XHJcbiAgICAoZWwuZGlyZWN0aXZlcyB8fCAoZWwuZGlyZWN0aXZlcyA9IFtdKSkucHVzaCh7IG5hbWU6IG5hbWUsIHJhd05hbWU6IHJhd05hbWUsIHZhbHVlOiB2YWx1ZSwgYXJnOiBhcmcsIG1vZGlmaWVyczogbW9kaWZpZXJzIH0pO1xyXG4gICAgZWwucGxhaW4gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEhhbmRsZXIoXHJcbiAgICBlbCxcclxuICAgIG5hbWUsXHJcbiAgICB2YWx1ZSxcclxuICAgIG1vZGlmaWVycyxcclxuICAgIGltcG9ydGFudCxcclxuICAgIHdhcm5cclxuICApIHtcclxuICAgIG1vZGlmaWVycyA9IG1vZGlmaWVycyB8fCBlbXB0eU9iamVjdDtcclxuICAgIC8vIHdhcm4gcHJldmVudCBhbmQgcGFzc2l2ZSBtb2RpZmllclxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoXHJcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4gJiZcclxuICAgICAgbW9kaWZpZXJzLnByZXZlbnQgJiYgbW9kaWZpZXJzLnBhc3NpdmVcclxuICAgICkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgICdwYXNzaXZlIGFuZCBwcmV2ZW50IGNhblxcJ3QgYmUgdXNlZCB0b2dldGhlci4gJyArXHJcbiAgICAgICAgJ1Bhc3NpdmUgaGFuZGxlciBjYW5cXCd0IHByZXZlbnQgZGVmYXVsdCBldmVudC4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2hlY2sgY2FwdHVyZSBtb2RpZmllclxyXG4gICAgaWYgKG1vZGlmaWVycy5jYXB0dXJlKSB7XHJcbiAgICAgIGRlbGV0ZSBtb2RpZmllcnMuY2FwdHVyZTtcclxuICAgICAgbmFtZSA9ICchJyArIG5hbWU7IC8vIG1hcmsgdGhlIGV2ZW50IGFzIGNhcHR1cmVkXHJcbiAgICB9XHJcbiAgICBpZiAobW9kaWZpZXJzLm9uY2UpIHtcclxuICAgICAgZGVsZXRlIG1vZGlmaWVycy5vbmNlO1xyXG4gICAgICBuYW1lID0gJ34nICsgbmFtZTsgLy8gbWFyayB0aGUgZXZlbnQgYXMgb25jZVxyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAobW9kaWZpZXJzLnBhc3NpdmUpIHtcclxuICAgICAgZGVsZXRlIG1vZGlmaWVycy5wYXNzaXZlO1xyXG4gICAgICBuYW1lID0gJyYnICsgbmFtZTsgLy8gbWFyayB0aGUgZXZlbnQgYXMgcGFzc2l2ZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vcm1hbGl6ZSBjbGljay5yaWdodCBhbmQgY2xpY2subWlkZGxlIHNpbmNlIHRoZXkgZG9uJ3QgYWN0dWFsbHkgZmlyZVxyXG4gICAgLy8gdGhpcyBpcyB0ZWNobmljYWxseSBicm93c2VyLXNwZWNpZmljLCBidXQgYXQgbGVhc3QgZm9yIG5vdyBicm93c2VycyBhcmVcclxuICAgIC8vIHRoZSBvbmx5IHRhcmdldCBlbnZzIHRoYXQgaGF2ZSByaWdodC9taWRkbGUgY2xpY2tzLlxyXG4gICAgaWYgKG5hbWUgPT09ICdjbGljaycpIHtcclxuICAgICAgaWYgKG1vZGlmaWVycy5yaWdodCkge1xyXG4gICAgICAgIG5hbWUgPSAnY29udGV4dG1lbnUnO1xyXG4gICAgICAgIGRlbGV0ZSBtb2RpZmllcnMucmlnaHQ7XHJcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLm1pZGRsZSkge1xyXG4gICAgICAgIG5hbWUgPSAnbW91c2V1cCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZXZlbnRzO1xyXG4gICAgaWYgKG1vZGlmaWVycy5uYXRpdmUpIHtcclxuICAgICAgZGVsZXRlIG1vZGlmaWVycy5uYXRpdmU7XHJcbiAgICAgIGV2ZW50cyA9IGVsLm5hdGl2ZUV2ZW50cyB8fCAoZWwubmF0aXZlRXZlbnRzID0ge30pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRzID0gZWwuZXZlbnRzIHx8IChlbC5ldmVudHMgPSB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5ld0hhbmRsZXIgPSB7XHJcbiAgICAgIHZhbHVlOiB2YWx1ZS50cmltKClcclxuICAgIH07XHJcbiAgICBpZiAobW9kaWZpZXJzICE9PSBlbXB0eU9iamVjdCkge1xyXG4gICAgICBuZXdIYW5kbGVyLm1vZGlmaWVycyA9IG1vZGlmaWVycztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGFuZGxlcnMgPSBldmVudHNbbmFtZV07XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXJzKSkge1xyXG4gICAgICBpbXBvcnRhbnQgPyBoYW5kbGVycy51bnNoaWZ0KG5ld0hhbmRsZXIpIDogaGFuZGxlcnMucHVzaChuZXdIYW5kbGVyKTtcclxuICAgIH0gZWxzZSBpZiAoaGFuZGxlcnMpIHtcclxuICAgICAgZXZlbnRzW25hbWVdID0gaW1wb3J0YW50ID8gW25ld0hhbmRsZXIsIGhhbmRsZXJzXSA6IFtoYW5kbGVycywgbmV3SGFuZGxlcl07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudHNbbmFtZV0gPSBuZXdIYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGVsLnBsYWluID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRCaW5kaW5nQXR0cihcclxuICAgIGVsLFxyXG4gICAgbmFtZSxcclxuICAgIGdldFN0YXRpY1xyXG4gICkge1xyXG4gICAgdmFyIGR5bmFtaWNWYWx1ZSA9XHJcbiAgICAgIGdldEFuZFJlbW92ZUF0dHIoZWwsICc6JyArIG5hbWUpIHx8XHJcbiAgICAgIGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWJpbmQ6JyArIG5hbWUpO1xyXG4gICAgaWYgKGR5bmFtaWNWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBwYXJzZUZpbHRlcnMoZHluYW1pY1ZhbHVlKVxyXG4gICAgfSBlbHNlIGlmIChnZXRTdGF0aWMgIT09IGZhbHNlKSB7XHJcbiAgICAgIHZhciBzdGF0aWNWYWx1ZSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsIG5hbWUpO1xyXG4gICAgICBpZiAoc3RhdGljVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdGF0aWNWYWx1ZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbm90ZTogdGhpcyBvbmx5IHJlbW92ZXMgdGhlIGF0dHIgZnJvbSB0aGUgQXJyYXkgKGF0dHJzTGlzdCkgc28gdGhhdCBpdFxyXG4gIC8vIGRvZXNuJ3QgZ2V0IHByb2Nlc3NlZCBieSBwcm9jZXNzQXR0cnMuXHJcbiAgLy8gQnkgZGVmYXVsdCBpdCBkb2VzIE5PVCByZW1vdmUgaXQgZnJvbSB0aGUgbWFwIChhdHRyc01hcCkgYmVjYXVzZSB0aGUgbWFwIGlzXHJcbiAgLy8gbmVlZGVkIGR1cmluZyBjb2RlZ2VuLlxyXG4gIGZ1bmN0aW9uIGdldEFuZFJlbW92ZUF0dHIoXHJcbiAgICBlbCxcclxuICAgIG5hbWUsXHJcbiAgICByZW1vdmVGcm9tTWFwXHJcbiAgKSB7XHJcbiAgICB2YXIgdmFsO1xyXG4gICAgaWYgKCh2YWwgPSBlbC5hdHRyc01hcFtuYW1lXSkgIT0gbnVsbCkge1xyXG4gICAgICB2YXIgbGlzdCA9IGVsLmF0dHJzTGlzdDtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChyZW1vdmVGcm9tTWFwKSB7XHJcbiAgICAgIGRlbGV0ZSBlbC5hdHRyc01hcFtuYW1lXTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWxcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiBDcm9zcy1wbGF0Zm9ybSBjb2RlIGdlbmVyYXRpb24gZm9yIGNvbXBvbmVudCB2LW1vZGVsXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2VuQ29tcG9uZW50TW9kZWwoXHJcbiAgICBlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgbW9kaWZpZXJzXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVmID0gbW9kaWZpZXJzIHx8IHt9O1xyXG4gICAgdmFyIG51bWJlciA9IHJlZi5udW1iZXI7XHJcbiAgICB2YXIgdHJpbSA9IHJlZi50cmltO1xyXG5cclxuICAgIHZhciBiYXNlVmFsdWVFeHByZXNzaW9uID0gJyQkdic7XHJcbiAgICB2YXIgdmFsdWVFeHByZXNzaW9uID0gYmFzZVZhbHVlRXhwcmVzc2lvbjtcclxuICAgIGlmICh0cmltKSB7XHJcbiAgICAgIHZhbHVlRXhwcmVzc2lvbiA9XHJcbiAgICAgICAgXCIodHlwZW9mIFwiICsgYmFzZVZhbHVlRXhwcmVzc2lvbiArIFwiID09PSAnc3RyaW5nJ1wiICtcclxuICAgICAgICBcIj8gXCIgKyBiYXNlVmFsdWVFeHByZXNzaW9uICsgXCIudHJpbSgpXCIgK1xyXG4gICAgICAgIFwiOiBcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIilcIjtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIpIHtcclxuICAgICAgdmFsdWVFeHByZXNzaW9uID0gXCJfbihcIiArIHZhbHVlRXhwcmVzc2lvbiArIFwiKVwiO1xyXG4gICAgfVxyXG4gICAgdmFyIGFzc2lnbm1lbnQgPSBnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgdmFsdWVFeHByZXNzaW9uKTtcclxuXHJcbiAgICBlbC5tb2RlbCA9IHtcclxuICAgICAgdmFsdWU6IChcIihcIiArIHZhbHVlICsgXCIpXCIpLFxyXG4gICAgICBleHByZXNzaW9uOiAoXCJcXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSxcclxuICAgICAgY2FsbGJhY2s6IChcImZ1bmN0aW9uIChcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIikge1wiICsgYXNzaWdubWVudCArIFwifVwiKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyb3NzLXBsYXRmb3JtIGNvZGVnZW4gaGVscGVyIGZvciBnZW5lcmF0aW5nIHYtbW9kZWwgdmFsdWUgYXNzaWdubWVudCBjb2RlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdlbkFzc2lnbm1lbnRDb2RlKFxyXG4gICAgdmFsdWUsXHJcbiAgICBhc3NpZ25tZW50XHJcbiAgKSB7XHJcbiAgICB2YXIgcmVzID0gcGFyc2VNb2RlbCh2YWx1ZSk7XHJcbiAgICBpZiAocmVzLmtleSA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gKHZhbHVlICsgXCI9XCIgKyBhc3NpZ25tZW50KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcIiRzZXQoXCIgKyAocmVzLmV4cCkgKyBcIiwgXCIgKyAocmVzLmtleSkgKyBcIiwgXCIgKyBhc3NpZ25tZW50ICsgXCIpXCIpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJzZSBhIHYtbW9kZWwgZXhwcmVzc2lvbiBpbnRvIGEgYmFzZSBwYXRoIGFuZCBhIGZpbmFsIGtleSBzZWdtZW50LlxyXG4gICAqIEhhbmRsZXMgYm90aCBkb3QtcGF0aCBhbmQgcG9zc2libGUgc3F1YXJlIGJyYWNrZXRzLlxyXG4gICAqXHJcbiAgICogUG9zc2libGUgY2FzZXM6XHJcbiAgICpcclxuICAgKiAtIHRlc3RcclxuICAgKiAtIHRlc3Rba2V5XVxyXG4gICAqIC0gdGVzdFt0ZXN0MVtrZXldXVxyXG4gICAqIC0gdGVzdFtcImFcIl1ba2V5XVxyXG4gICAqIC0geHh4LnRlc3RbYVthXS50ZXN0MVtrZXldXVxyXG4gICAqIC0gdGVzdC54eHguYVtcImFzYVwiXVt0ZXN0MVtrZXldXVxyXG4gICAqXHJcbiAgICovXHJcblxyXG4gIHZhciBsZW47XHJcbiAgdmFyIHN0cjtcclxuICB2YXIgY2hyO1xyXG4gIHZhciBpbmRleCQxO1xyXG4gIHZhciBleHByZXNzaW9uUG9zO1xyXG4gIHZhciBleHByZXNzaW9uRW5kUG9zO1xyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlTW9kZWwodmFsKSB7XHJcbiAgICAvLyBGaXggaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS9wdWxsLzc3MzBcclxuICAgIC8vIGFsbG93IHYtbW9kZWw9XCJvYmoudmFsIFwiICh0cmFpbGluZyB3aGl0ZXNwYWNlKVxyXG4gICAgdmFsID0gdmFsLnRyaW0oKTtcclxuICAgIGxlbiA9IHZhbC5sZW5ndGg7XHJcblxyXG4gICAgaWYgKHZhbC5pbmRleE9mKCdbJykgPCAwIHx8IHZhbC5sYXN0SW5kZXhPZignXScpIDwgbGVuIC0gMSkge1xyXG4gICAgICBpbmRleCQxID0gdmFsLmxhc3RJbmRleE9mKCcuJyk7XHJcbiAgICAgIGlmIChpbmRleCQxID4gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZXhwOiB2YWwuc2xpY2UoMCwgaW5kZXgkMSksXHJcbiAgICAgICAgICBrZXk6ICdcIicgKyB2YWwuc2xpY2UoaW5kZXgkMSArIDEpICsgJ1wiJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZXhwOiB2YWwsXHJcbiAgICAgICAgICBrZXk6IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdHIgPSB2YWw7XHJcbiAgICBpbmRleCQxID0gZXhwcmVzc2lvblBvcyA9IGV4cHJlc3Npb25FbmRQb3MgPSAwO1xyXG5cclxuICAgIHdoaWxlICghZW9mKCkpIHtcclxuICAgICAgY2hyID0gbmV4dCgpO1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGlzU3RyaW5nU3RhcnQoY2hyKSkge1xyXG4gICAgICAgIHBhcnNlU3RyaW5nKGNocik7XHJcbiAgICAgIH0gZWxzZSBpZiAoY2hyID09PSAweDVCKSB7XHJcbiAgICAgICAgcGFyc2VCcmFja2V0KGNocik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBleHA6IHZhbC5zbGljZSgwLCBleHByZXNzaW9uUG9zKSxcclxuICAgICAga2V5OiB2YWwuc2xpY2UoZXhwcmVzc2lvblBvcyArIDEsIGV4cHJlc3Npb25FbmRQb3MpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgcmV0dXJuIHN0ci5jaGFyQ29kZUF0KCsraW5kZXgkMSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVvZigpIHtcclxuICAgIHJldHVybiBpbmRleCQxID49IGxlblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNTdHJpbmdTdGFydChjaHIpIHtcclxuICAgIHJldHVybiBjaHIgPT09IDB4MjIgfHwgY2hyID09PSAweDI3XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUJyYWNrZXQoY2hyKSB7XHJcbiAgICB2YXIgaW5CcmFja2V0ID0gMTtcclxuICAgIGV4cHJlc3Npb25Qb3MgPSBpbmRleCQxO1xyXG4gICAgd2hpbGUgKCFlb2YoKSkge1xyXG4gICAgICBjaHIgPSBuZXh0KCk7XHJcbiAgICAgIGlmIChpc1N0cmluZ1N0YXJ0KGNocikpIHtcclxuICAgICAgICBwYXJzZVN0cmluZyhjaHIpO1xyXG4gICAgICAgIGNvbnRpbnVlXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNociA9PT0gMHg1QikgeyBpbkJyYWNrZXQrKzsgfVxyXG4gICAgICBpZiAoY2hyID09PSAweDVEKSB7IGluQnJhY2tldC0tOyB9XHJcbiAgICAgIGlmIChpbkJyYWNrZXQgPT09IDApIHtcclxuICAgICAgICBleHByZXNzaW9uRW5kUG9zID0gaW5kZXgkMTtcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVN0cmluZyhjaHIpIHtcclxuICAgIHZhciBzdHJpbmdRdW90ZSA9IGNocjtcclxuICAgIHdoaWxlICghZW9mKCkpIHtcclxuICAgICAgY2hyID0gbmV4dCgpO1xyXG4gICAgICBpZiAoY2hyID09PSBzdHJpbmdRdW90ZSkge1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgd2FybiQxO1xyXG5cclxuICAvLyBpbiBzb21lIGNhc2VzLCB0aGUgZXZlbnQgdXNlZCBoYXMgdG8gYmUgZGV0ZXJtaW5lZCBhdCBydW50aW1lXHJcbiAgLy8gc28gd2UgdXNlZCBzb21lIHJlc2VydmVkIHRva2VucyBkdXJpbmcgY29tcGlsZS5cclxuICB2YXIgUkFOR0VfVE9LRU4gPSAnX19yJztcclxuICB2YXIgQ0hFQ0tCT1hfUkFESU9fVE9LRU4gPSAnX19jJztcclxuXHJcbiAgZnVuY3Rpb24gbW9kZWwoXHJcbiAgICBlbCxcclxuICAgIGRpcixcclxuICAgIF93YXJuXHJcbiAgKSB7XHJcbiAgICB3YXJuJDEgPSBfd2FybjtcclxuICAgIHZhciB2YWx1ZSA9IGRpci52YWx1ZTtcclxuICAgIHZhciBtb2RpZmllcnMgPSBkaXIubW9kaWZpZXJzO1xyXG4gICAgdmFyIHRhZyA9IGVsLnRhZztcclxuICAgIHZhciB0eXBlID0gZWwuYXR0cnNNYXAudHlwZTtcclxuXHJcbiAgICB7XHJcbiAgICAgIC8vIGlucHV0cyB3aXRoIHR5cGU9XCJmaWxlXCIgYXJlIHJlYWQgb25seSBhbmQgc2V0dGluZyB0aGUgaW5wdXQnc1xyXG4gICAgICAvLyB2YWx1ZSB3aWxsIHRocm93IGFuIGVycm9yLlxyXG4gICAgICBpZiAodGFnID09PSAnaW5wdXQnICYmIHR5cGUgPT09ICdmaWxlJykge1xyXG4gICAgICAgIHdhcm4kMShcclxuICAgICAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiIHR5cGU9XFxcImZpbGVcXFwiPjpcXG5cIiArXHJcbiAgICAgICAgICBcIkZpbGUgaW5wdXRzIGFyZSByZWFkIG9ubHkuIFVzZSBhIHYtb246Y2hhbmdlIGxpc3RlbmVyIGluc3RlYWQuXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVsLmNvbXBvbmVudCkge1xyXG4gICAgICBnZW5Db21wb25lbnRNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgICAgIC8vIGNvbXBvbmVudCB2LW1vZGVsIGRvZXNuJ3QgbmVlZCBleHRyYSBydW50aW1lXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdzZWxlY3QnKSB7XHJcbiAgICAgIGdlblNlbGVjdChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiB0eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgIGdlbkNoZWNrYm94TW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xyXG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICBnZW5SYWRpb01vZGVsKGVsLCB2YWx1ZSwgbW9kaWZpZXJzKTtcclxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnaW5wdXQnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJykge1xyXG4gICAgICBnZW5EZWZhdWx0TW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xyXG4gICAgfSBlbHNlIGlmICghY29uZmlnLmlzUmVzZXJ2ZWRUYWcodGFnKSkge1xyXG4gICAgICBnZW5Db21wb25lbnRNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgICAgIC8vIGNvbXBvbmVudCB2LW1vZGVsIGRvZXNuJ3QgbmVlZCBleHRyYSBydW50aW1lXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2FybiQxKFxyXG4gICAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPjogXCIgK1xyXG4gICAgICAgIFwidi1tb2RlbCBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgZWxlbWVudCB0eXBlLiBcIiArXHJcbiAgICAgICAgJ0lmIHlvdSBhcmUgd29ya2luZyB3aXRoIGNvbnRlbnRlZGl0YWJsZSwgaXRcXCdzIHJlY29tbWVuZGVkIHRvICcgK1xyXG4gICAgICAgICd3cmFwIGEgbGlicmFyeSBkZWRpY2F0ZWQgZm9yIHRoYXQgcHVycG9zZSBpbnNpZGUgYSBjdXN0b20gY29tcG9uZW50LidcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbnN1cmUgcnVudGltZSBkaXJlY3RpdmUgbWV0YWRhdGFcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5DaGVja2JveE1vZGVsKFxyXG4gICAgZWwsXHJcbiAgICB2YWx1ZSxcclxuICAgIG1vZGlmaWVyc1xyXG4gICkge1xyXG4gICAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xyXG4gICAgdmFyIHZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndmFsdWUnKSB8fCAnbnVsbCc7XHJcbiAgICB2YXIgdHJ1ZVZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndHJ1ZS12YWx1ZScpIHx8ICd0cnVlJztcclxuICAgIHZhciBmYWxzZVZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnZmFsc2UtdmFsdWUnKSB8fCAnZmFsc2UnO1xyXG4gICAgYWRkUHJvcChlbCwgJ2NoZWNrZWQnLFxyXG4gICAgICBcIkFycmF5LmlzQXJyYXkoXCIgKyB2YWx1ZSArIFwiKVwiICtcclxuICAgICAgXCI/X2koXCIgKyB2YWx1ZSArIFwiLFwiICsgdmFsdWVCaW5kaW5nICsgXCIpPi0xXCIgKyAoXHJcbiAgICAgICAgdHJ1ZVZhbHVlQmluZGluZyA9PT0gJ3RydWUnXHJcbiAgICAgICAgICA/IChcIjooXCIgKyB2YWx1ZSArIFwiKVwiKVxyXG4gICAgICAgICAgOiAoXCI6X3EoXCIgKyB2YWx1ZSArIFwiLFwiICsgdHJ1ZVZhbHVlQmluZGluZyArIFwiKVwiKVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gICAgYWRkSGFuZGxlcihlbCwgJ2NoYW5nZScsXHJcbiAgICAgIFwidmFyICQkYT1cIiArIHZhbHVlICsgXCIsXCIgK1xyXG4gICAgICAnJCRlbD0kZXZlbnQudGFyZ2V0LCcgK1xyXG4gICAgICBcIiQkYz0kJGVsLmNoZWNrZWQ/KFwiICsgdHJ1ZVZhbHVlQmluZGluZyArIFwiKTooXCIgKyBmYWxzZVZhbHVlQmluZGluZyArIFwiKTtcIiArXHJcbiAgICAgICdpZihBcnJheS5pc0FycmF5KCQkYSkpeycgK1xyXG4gICAgICBcInZhciAkJHY9XCIgKyAobnVtYmVyID8gJ19uKCcgKyB2YWx1ZUJpbmRpbmcgKyAnKScgOiB2YWx1ZUJpbmRpbmcpICsgXCIsXCIgK1xyXG4gICAgICAnJCRpPV9pKCQkYSwkJHYpOycgK1xyXG4gICAgICBcImlmKCQkZWwuY2hlY2tlZCl7JCRpPDAmJihcIiArIChnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgJyQkYS5jb25jYXQoWyQkdl0pJykpICsgXCIpfVwiICtcclxuICAgICAgXCJlbHNleyQkaT4tMSYmKFwiICsgKGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCAnJCRhLnNsaWNlKDAsJCRpKS5jb25jYXQoJCRhLnNsaWNlKCQkaSsxKSknKSkgKyBcIil9XCIgK1xyXG4gICAgICBcIn1lbHNle1wiICsgKGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCAnJCRjJykpICsgXCJ9XCIsXHJcbiAgICAgIG51bGwsIHRydWVcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5SYWRpb01vZGVsKFxyXG4gICAgZWwsXHJcbiAgICB2YWx1ZSxcclxuICAgIG1vZGlmaWVyc1xyXG4gICkge1xyXG4gICAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xyXG4gICAgdmFyIHZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndmFsdWUnKSB8fCAnbnVsbCc7XHJcbiAgICB2YWx1ZUJpbmRpbmcgPSBudW1iZXIgPyAoXCJfbihcIiArIHZhbHVlQmluZGluZyArIFwiKVwiKSA6IHZhbHVlQmluZGluZztcclxuICAgIGFkZFByb3AoZWwsICdjaGVja2VkJywgKFwiX3EoXCIgKyB2YWx1ZSArIFwiLFwiICsgdmFsdWVCaW5kaW5nICsgXCIpXCIpKTtcclxuICAgIGFkZEhhbmRsZXIoZWwsICdjaGFuZ2UnLCBnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgdmFsdWVCaW5kaW5nKSwgbnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5TZWxlY3QoXHJcbiAgICBlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgbW9kaWZpZXJzXHJcbiAgKSB7XHJcbiAgICB2YXIgbnVtYmVyID0gbW9kaWZpZXJzICYmIG1vZGlmaWVycy5udW1iZXI7XHJcbiAgICB2YXIgc2VsZWN0ZWRWYWwgPSBcIkFycmF5LnByb3RvdHlwZS5maWx0ZXJcIiArXHJcbiAgICAgIFwiLmNhbGwoJGV2ZW50LnRhcmdldC5vcHRpb25zLGZ1bmN0aW9uKG8pe3JldHVybiBvLnNlbGVjdGVkfSlcIiArXHJcbiAgICAgIFwiLm1hcChmdW5jdGlvbihvKXt2YXIgdmFsID0gXFxcIl92YWx1ZVxcXCIgaW4gbyA/IG8uX3ZhbHVlIDogby52YWx1ZTtcIiArXHJcbiAgICAgIFwicmV0dXJuIFwiICsgKG51bWJlciA/ICdfbih2YWwpJyA6ICd2YWwnKSArIFwifSlcIjtcclxuXHJcbiAgICB2YXIgYXNzaWdubWVudCA9ICckZXZlbnQudGFyZ2V0Lm11bHRpcGxlID8gJCRzZWxlY3RlZFZhbCA6ICQkc2VsZWN0ZWRWYWxbMF0nO1xyXG4gICAgdmFyIGNvZGUgPSBcInZhciAkJHNlbGVjdGVkVmFsID0gXCIgKyBzZWxlY3RlZFZhbCArIFwiO1wiO1xyXG4gICAgY29kZSA9IGNvZGUgKyBcIiBcIiArIChnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgYXNzaWdubWVudCkpO1xyXG4gICAgYWRkSGFuZGxlcihlbCwgJ2NoYW5nZScsIGNvZGUsIG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuRGVmYXVsdE1vZGVsKFxyXG4gICAgZWwsXHJcbiAgICB2YWx1ZSxcclxuICAgIG1vZGlmaWVyc1xyXG4gICkge1xyXG4gICAgdmFyIHR5cGUgPSBlbC5hdHRyc01hcC50eXBlO1xyXG5cclxuICAgIC8vIHdhcm4gaWYgdi1iaW5kOnZhbHVlIGNvbmZsaWN0cyB3aXRoIHYtbW9kZWxcclxuICAgIC8vIGV4Y2VwdCBmb3IgaW5wdXRzIHdpdGggdi1iaW5kOnR5cGVcclxuICAgIHtcclxuICAgICAgdmFyIHZhbHVlJDEgPSBlbC5hdHRyc01hcFsndi1iaW5kOnZhbHVlJ10gfHwgZWwuYXR0cnNNYXBbJzp2YWx1ZSddO1xyXG4gICAgICB2YXIgdHlwZUJpbmRpbmcgPSBlbC5hdHRyc01hcFsndi1iaW5kOnR5cGUnXSB8fCBlbC5hdHRyc01hcFsnOnR5cGUnXTtcclxuICAgICAgaWYgKHZhbHVlJDEgJiYgIXR5cGVCaW5kaW5nKSB7XHJcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBlbC5hdHRyc01hcFsndi1iaW5kOnZhbHVlJ10gPyAndi1iaW5kOnZhbHVlJyA6ICc6dmFsdWUnO1xyXG4gICAgICAgIHdhcm4kMShcclxuICAgICAgICAgIGJpbmRpbmcgKyBcIj1cXFwiXCIgKyB2YWx1ZSQxICsgXCJcXFwiIGNvbmZsaWN0cyB3aXRoIHYtbW9kZWwgb24gdGhlIHNhbWUgZWxlbWVudCBcIiArXHJcbiAgICAgICAgICAnYmVjYXVzZSB0aGUgbGF0dGVyIGFscmVhZHkgZXhwYW5kcyB0byBhIHZhbHVlIGJpbmRpbmcgaW50ZXJuYWxseSdcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlZiA9IG1vZGlmaWVycyB8fCB7fTtcclxuICAgIHZhciBsYXp5ID0gcmVmLmxhenk7XHJcbiAgICB2YXIgbnVtYmVyID0gcmVmLm51bWJlcjtcclxuICAgIHZhciB0cmltID0gcmVmLnRyaW07XHJcbiAgICB2YXIgbmVlZENvbXBvc2l0aW9uR3VhcmQgPSAhbGF6eSAmJiB0eXBlICE9PSAncmFuZ2UnO1xyXG4gICAgdmFyIGV2ZW50ID0gbGF6eVxyXG4gICAgICA/ICdjaGFuZ2UnXHJcbiAgICAgIDogdHlwZSA9PT0gJ3JhbmdlJ1xyXG4gICAgICAgID8gUkFOR0VfVE9LRU5cclxuICAgICAgICA6ICdpbnB1dCc7XHJcblxyXG4gICAgdmFyIHZhbHVlRXhwcmVzc2lvbiA9ICckZXZlbnQudGFyZ2V0LnZhbHVlJztcclxuICAgIGlmICh0cmltKSB7XHJcbiAgICAgIHZhbHVlRXhwcmVzc2lvbiA9IFwiJGV2ZW50LnRhcmdldC52YWx1ZS50cmltKClcIjtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIpIHtcclxuICAgICAgdmFsdWVFeHByZXNzaW9uID0gXCJfbihcIiArIHZhbHVlRXhwcmVzc2lvbiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb2RlID0gZ2VuQXNzaWdubWVudENvZGUodmFsdWUsIHZhbHVlRXhwcmVzc2lvbik7XHJcbiAgICBpZiAobmVlZENvbXBvc2l0aW9uR3VhcmQpIHtcclxuICAgICAgY29kZSA9IFwiaWYoJGV2ZW50LnRhcmdldC5jb21wb3NpbmcpcmV0dXJuO1wiICsgY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQcm9wKGVsLCAndmFsdWUnLCAoXCIoXCIgKyB2YWx1ZSArIFwiKVwiKSk7XHJcbiAgICBhZGRIYW5kbGVyKGVsLCBldmVudCwgY29kZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBpZiAodHJpbSB8fCBudW1iZXIpIHtcclxuICAgICAgYWRkSGFuZGxlcihlbCwgJ2JsdXInLCAnJGZvcmNlVXBkYXRlKCknKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyBub3JtYWxpemUgdi1tb2RlbCBldmVudCB0b2tlbnMgdGhhdCBjYW4gb25seSBiZSBkZXRlcm1pbmVkIGF0IHJ1bnRpbWUuXHJcbiAgLy8gaXQncyBpbXBvcnRhbnQgdG8gcGxhY2UgdGhlIGV2ZW50IGFzIHRoZSBmaXJzdCBpbiB0aGUgYXJyYXkgYmVjYXVzZVxyXG4gIC8vIHRoZSB3aG9sZSBwb2ludCBpcyBlbnN1cmluZyB0aGUgdi1tb2RlbCBjYWxsYmFjayBnZXRzIGNhbGxlZCBiZWZvcmVcclxuICAvLyB1c2VyLWF0dGFjaGVkIGhhbmRsZXJzLlxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZUV2ZW50cyhvbikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXNEZWYob25bUkFOR0VfVE9LRU5dKSkge1xyXG4gICAgICAvLyBJRSBpbnB1dFt0eXBlPXJhbmdlXSBvbmx5IHN1cHBvcnRzIGBjaGFuZ2VgIGV2ZW50XHJcbiAgICAgIHZhciBldmVudCA9IGlzSUUgPyAnY2hhbmdlJyA6ICdpbnB1dCc7XHJcbiAgICAgIG9uW2V2ZW50XSA9IFtdLmNvbmNhdChvbltSQU5HRV9UT0tFTl0sIG9uW2V2ZW50XSB8fCBbXSk7XHJcbiAgICAgIGRlbGV0ZSBvbltSQU5HRV9UT0tFTl07XHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIHdhcyBvcmlnaW5hbGx5IGludGVuZGVkIHRvIGZpeCAjNDUyMSBidXQgbm8gbG9uZ2VyIG5lY2Vzc2FyeVxyXG4gICAgLy8gYWZ0ZXIgMi41LiBLZWVwaW5nIGl0IGZvciBiYWNrd2FyZHMgY29tcGF0IHdpdGggZ2VuZXJhdGVkIGNvZGUgZnJvbSA8IDIuNFxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXNEZWYob25bQ0hFQ0tCT1hfUkFESU9fVE9LRU5dKSkge1xyXG4gICAgICBvbi5jaGFuZ2UgPSBbXS5jb25jYXQob25bQ0hFQ0tCT1hfUkFESU9fVE9LRU5dLCBvbi5jaGFuZ2UgfHwgW10pO1xyXG4gICAgICBkZWxldGUgb25bQ0hFQ0tCT1hfUkFESU9fVE9LRU5dO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHRhcmdldCQxO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVPbmNlSGFuZGxlcihoYW5kbGVyLCBldmVudCwgY2FwdHVyZSkge1xyXG4gICAgdmFyIF90YXJnZXQgPSB0YXJnZXQkMTsgLy8gc2F2ZSBjdXJyZW50IHRhcmdldCBlbGVtZW50IGluIGNsb3N1cmVcclxuICAgIHJldHVybiBmdW5jdGlvbiBvbmNlSGFuZGxlcigpIHtcclxuICAgICAgdmFyIHJlcyA9IGhhbmRsZXIuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcclxuICAgICAgaWYgKHJlcyAhPT0gbnVsbCkge1xyXG4gICAgICAgIHJlbW92ZSQyKGV2ZW50LCBvbmNlSGFuZGxlciwgY2FwdHVyZSwgX3RhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZCQxKFxyXG4gICAgZXZlbnQsXHJcbiAgICBoYW5kbGVyLFxyXG4gICAgb25jZSQkMSxcclxuICAgIGNhcHR1cmUsXHJcbiAgICBwYXNzaXZlXHJcbiAgKSB7XHJcbiAgICBoYW5kbGVyID0gd2l0aE1hY3JvVGFzayhoYW5kbGVyKTtcclxuICAgIGlmIChvbmNlJCQxKSB7IGhhbmRsZXIgPSBjcmVhdGVPbmNlSGFuZGxlcihoYW5kbGVyLCBldmVudCwgY2FwdHVyZSk7IH1cclxuICAgIHRhcmdldCQxLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBoYW5kbGVyLFxyXG4gICAgICBzdXBwb3J0c1Bhc3NpdmVcclxuICAgICAgICA/IHsgY2FwdHVyZTogY2FwdHVyZSwgcGFzc2l2ZTogcGFzc2l2ZSB9XHJcbiAgICAgICAgOiBjYXB0dXJlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlJDIoXHJcbiAgICBldmVudCxcclxuICAgIGhhbmRsZXIsXHJcbiAgICBjYXB0dXJlLFxyXG4gICAgX3RhcmdldFxyXG4gICkge1xyXG4gICAgKF90YXJnZXQgfHwgdGFyZ2V0JDEpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBoYW5kbGVyLl93aXRoVGFzayB8fCBoYW5kbGVyLFxyXG4gICAgICBjYXB0dXJlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlRE9NTGlzdGVuZXJzKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgaWYgKGlzVW5kZWYob2xkVm5vZGUuZGF0YS5vbikgJiYgaXNVbmRlZih2bm9kZS5kYXRhLm9uKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHZhciBvbiA9IHZub2RlLmRhdGEub24gfHwge307XHJcbiAgICB2YXIgb2xkT24gPSBvbGRWbm9kZS5kYXRhLm9uIHx8IHt9O1xyXG4gICAgdGFyZ2V0JDEgPSB2bm9kZS5lbG07XHJcbiAgICBub3JtYWxpemVFdmVudHMob24pO1xyXG4gICAgdXBkYXRlTGlzdGVuZXJzKG9uLCBvbGRPbiwgYWRkJDEsIHJlbW92ZSQyLCB2bm9kZS5jb250ZXh0KTtcclxuICAgIHRhcmdldCQxID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgdmFyIGV2ZW50cyA9IHtcclxuICAgIGNyZWF0ZTogdXBkYXRlRE9NTGlzdGVuZXJzLFxyXG4gICAgdXBkYXRlOiB1cGRhdGVET01MaXN0ZW5lcnNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVET01Qcm9wcyhvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIGlmIChpc1VuZGVmKG9sZFZub2RlLmRhdGEuZG9tUHJvcHMpICYmIGlzVW5kZWYodm5vZGUuZGF0YS5kb21Qcm9wcykpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIga2V5LCBjdXI7XHJcbiAgICB2YXIgZWxtID0gdm5vZGUuZWxtO1xyXG4gICAgdmFyIG9sZFByb3BzID0gb2xkVm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcclxuICAgIHZhciBwcm9wcyA9IHZub2RlLmRhdGEuZG9tUHJvcHMgfHwge307XHJcbiAgICAvLyBjbG9uZSBvYnNlcnZlZCBvYmplY3RzLCBhcyB0aGUgdXNlciBwcm9iYWJseSB3YW50cyB0byBtdXRhdGUgaXRcclxuICAgIGlmIChpc0RlZihwcm9wcy5fX29iX18pKSB7XHJcbiAgICAgIHByb3BzID0gdm5vZGUuZGF0YS5kb21Qcm9wcyA9IGV4dGVuZCh7fSwgcHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoa2V5IGluIG9sZFByb3BzKSB7XHJcbiAgICAgIGlmIChpc1VuZGVmKHByb3BzW2tleV0pKSB7XHJcbiAgICAgICAgZWxtW2tleV0gPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChrZXkgaW4gcHJvcHMpIHtcclxuICAgICAgY3VyID0gcHJvcHNba2V5XTtcclxuICAgICAgLy8gaWdub3JlIGNoaWxkcmVuIGlmIHRoZSBub2RlIGhhcyB0ZXh0Q29udGVudCBvciBpbm5lckhUTUwsXHJcbiAgICAgIC8vIGFzIHRoZXNlIHdpbGwgdGhyb3cgYXdheSBleGlzdGluZyBET00gbm9kZXMgYW5kIGNhdXNlIHJlbW92YWwgZXJyb3JzXHJcbiAgICAgIC8vIG9uIHN1YnNlcXVlbnQgcGF0Y2hlcyAoIzMzNjApXHJcbiAgICAgIGlmIChrZXkgPT09ICd0ZXh0Q29udGVudCcgfHwga2V5ID09PSAnaW5uZXJIVE1MJykge1xyXG4gICAgICAgIGlmICh2bm9kZS5jaGlsZHJlbikgeyB2bm9kZS5jaGlsZHJlbi5sZW5ndGggPSAwOyB9XHJcbiAgICAgICAgaWYgKGN1ciA9PT0gb2xkUHJvcHNba2V5XSkgeyBjb250aW51ZSB9XHJcbiAgICAgICAgLy8gIzY2MDEgd29yayBhcm91bmQgQ2hyb21lIHZlcnNpb24gPD0gNTUgYnVnIHdoZXJlIHNpbmdsZSB0ZXh0Tm9kZVxyXG4gICAgICAgIC8vIHJlcGxhY2VkIGJ5IGlubmVySFRNTC90ZXh0Q29udGVudCByZXRhaW5zIGl0cyBwYXJlbnROb2RlIHByb3BlcnR5XHJcbiAgICAgICAgaWYgKGVsbS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgZWxtLnJlbW92ZUNoaWxkKGVsbS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChrZXkgPT09ICd2YWx1ZScpIHtcclxuICAgICAgICAvLyBzdG9yZSB2YWx1ZSBhcyBfdmFsdWUgYXMgd2VsbCBzaW5jZVxyXG4gICAgICAgIC8vIG5vbi1zdHJpbmcgdmFsdWVzIHdpbGwgYmUgc3RyaW5naWZpZWRcclxuICAgICAgICBlbG0uX3ZhbHVlID0gY3VyO1xyXG4gICAgICAgIC8vIGF2b2lkIHJlc2V0dGluZyBjdXJzb3IgcG9zaXRpb24gd2hlbiB2YWx1ZSBpcyB0aGUgc2FtZVxyXG4gICAgICAgIHZhciBzdHJDdXIgPSBpc1VuZGVmKGN1cikgPyAnJyA6IFN0cmluZyhjdXIpO1xyXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGVWYWx1ZShlbG0sIHN0ckN1cikpIHtcclxuICAgICAgICAgIGVsbS52YWx1ZSA9IHN0ckN1cjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxtW2tleV0gPSBjdXI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIHBsYXRmb3Jtcy93ZWIvdXRpbC9hdHRycy5qcyBhY2NlcHRWYWx1ZVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gc2hvdWxkVXBkYXRlVmFsdWUoZWxtLCBjaGVja1ZhbCkge1xyXG4gICAgcmV0dXJuICghZWxtLmNvbXBvc2luZyAmJiAoXHJcbiAgICAgIGVsbS50YWdOYW1lID09PSAnT1BUSU9OJyB8fFxyXG4gICAgICBpc05vdEluRm9jdXNBbmREaXJ0eShlbG0sIGNoZWNrVmFsKSB8fFxyXG4gICAgICBpc0RpcnR5V2l0aE1vZGlmaWVycyhlbG0sIGNoZWNrVmFsKVxyXG4gICAgKSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzTm90SW5Gb2N1c0FuZERpcnR5KGVsbSwgY2hlY2tWYWwpIHtcclxuICAgIC8vIHJldHVybiB0cnVlIHdoZW4gdGV4dGJveCAoLm51bWJlciBhbmQgLnRyaW0pIGxvc2VzIGZvY3VzIGFuZCBpdHMgdmFsdWUgaXNcclxuICAgIC8vIG5vdCBlcXVhbCB0byB0aGUgdXBkYXRlZCB2YWx1ZVxyXG4gICAgdmFyIG5vdEluRm9jdXMgPSB0cnVlO1xyXG4gICAgLy8gIzYxNTdcclxuICAgIC8vIHdvcmsgYXJvdW5kIElFIGJ1ZyB3aGVuIGFjY2Vzc2luZyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluIGFuIGlmcmFtZVxyXG4gICAgdHJ5IHsgbm90SW5Gb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVsbTsgfSBjYXRjaCAoZSkgeyB9XHJcbiAgICByZXR1cm4gbm90SW5Gb2N1cyAmJiBlbG0udmFsdWUgIT09IGNoZWNrVmFsXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0RpcnR5V2l0aE1vZGlmaWVycyhlbG0sIG5ld1ZhbCkge1xyXG4gICAgdmFyIHZhbHVlID0gZWxtLnZhbHVlO1xyXG4gICAgdmFyIG1vZGlmaWVycyA9IGVsbS5fdk1vZGlmaWVyczsgLy8gaW5qZWN0ZWQgYnkgdi1tb2RlbCBydW50aW1lXHJcbiAgICBpZiAoaXNEZWYobW9kaWZpZXJzKSkge1xyXG4gICAgICBpZiAobW9kaWZpZXJzLmxhenkpIHtcclxuICAgICAgICAvLyBpbnB1dHMgd2l0aCBsYXp5IHNob3VsZCBvbmx5IGJlIHVwZGF0ZWQgd2hlbiBub3QgaW4gZm9jdXNcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICBpZiAobW9kaWZpZXJzLm51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0b051bWJlcih2YWx1ZSkgIT09IHRvTnVtYmVyKG5ld1ZhbClcclxuICAgICAgfVxyXG4gICAgICBpZiAobW9kaWZpZXJzLnRyaW0pIHtcclxuICAgICAgICByZXR1cm4gdmFsdWUudHJpbSgpICE9PSBuZXdWYWwudHJpbSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZSAhPT0gbmV3VmFsXHJcbiAgfVxyXG5cclxuICB2YXIgZG9tUHJvcHMgPSB7XHJcbiAgICBjcmVhdGU6IHVwZGF0ZURPTVByb3BzLFxyXG4gICAgdXBkYXRlOiB1cGRhdGVET01Qcm9wc1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBwYXJzZVN0eWxlVGV4dCA9IGNhY2hlZChmdW5jdGlvbiAoY3NzVGV4dCkge1xyXG4gICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgdmFyIGxpc3REZWxpbWl0ZXIgPSAvOyg/IVteKF0qXFwpKS9nO1xyXG4gICAgdmFyIHByb3BlcnR5RGVsaW1pdGVyID0gLzooLispLztcclxuICAgIGNzc1RleHQuc3BsaXQobGlzdERlbGltaXRlcikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgIHZhciB0bXAgPSBpdGVtLnNwbGl0KHByb3BlcnR5RGVsaW1pdGVyKTtcclxuICAgICAgICB0bXAubGVuZ3RoID4gMSAmJiAocmVzW3RtcFswXS50cmltKCldID0gdG1wWzFdLnRyaW0oKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH0pO1xyXG5cclxuICAvLyBtZXJnZSBzdGF0aWMgYW5kIGR5bmFtaWMgc3R5bGUgZGF0YSBvbiB0aGUgc2FtZSB2bm9kZVxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlRGF0YShkYXRhKSB7XHJcbiAgICB2YXIgc3R5bGUgPSBub3JtYWxpemVTdHlsZUJpbmRpbmcoZGF0YS5zdHlsZSk7XHJcbiAgICAvLyBzdGF0aWMgc3R5bGUgaXMgcHJlLXByb2Nlc3NlZCBpbnRvIGFuIG9iamVjdCBkdXJpbmcgY29tcGlsYXRpb25cclxuICAgIC8vIGFuZCBpcyBhbHdheXMgYSBmcmVzaCBvYmplY3QsIHNvIGl0J3Mgc2FmZSB0byBtZXJnZSBpbnRvIGl0XHJcbiAgICByZXR1cm4gZGF0YS5zdGF0aWNTdHlsZVxyXG4gICAgICA/IGV4dGVuZChkYXRhLnN0YXRpY1N0eWxlLCBzdHlsZSlcclxuICAgICAgOiBzdHlsZVxyXG4gIH1cclxuXHJcbiAgLy8gbm9ybWFsaXplIHBvc3NpYmxlIGFycmF5IC8gc3RyaW5nIHZhbHVlcyBpbnRvIE9iamVjdFxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlQmluZGluZyhiaW5kaW5nU3R5bGUpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGJpbmRpbmdTdHlsZSkpIHtcclxuICAgICAgcmV0dXJuIHRvT2JqZWN0KGJpbmRpbmdTdHlsZSlcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYmluZGluZ1N0eWxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gcGFyc2VTdHlsZVRleHQoYmluZGluZ1N0eWxlKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJpbmRpbmdTdHlsZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGFyZW50IGNvbXBvbmVudCBzdHlsZSBzaG91bGQgYmUgYWZ0ZXIgY2hpbGQnc1xyXG4gICAqIHNvIHRoYXQgcGFyZW50IGNvbXBvbmVudCdzIHN0eWxlIGNvdWxkIG92ZXJyaWRlIGl0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0U3R5bGUodm5vZGUsIGNoZWNrQ2hpbGQpIHtcclxuICAgIHZhciByZXMgPSB7fTtcclxuICAgIHZhciBzdHlsZURhdGE7XHJcblxyXG4gICAgaWYgKGNoZWNrQ2hpbGQpIHtcclxuICAgICAgdmFyIGNoaWxkTm9kZSA9IHZub2RlO1xyXG4gICAgICB3aGlsZSAoY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlKSB7XHJcbiAgICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBjaGlsZE5vZGUgJiYgY2hpbGROb2RlLmRhdGEgJiZcclxuICAgICAgICAgIChzdHlsZURhdGEgPSBub3JtYWxpemVTdHlsZURhdGEoY2hpbGROb2RlLmRhdGEpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZXh0ZW5kKHJlcywgc3R5bGVEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoKHN0eWxlRGF0YSA9IG5vcm1hbGl6ZVN0eWxlRGF0YSh2bm9kZS5kYXRhKSkpIHtcclxuICAgICAgZXh0ZW5kKHJlcywgc3R5bGVEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyZW50Tm9kZSA9IHZub2RlO1xyXG4gICAgd2hpbGUgKChwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnQpKSB7XHJcbiAgICAgIGlmIChwYXJlbnROb2RlLmRhdGEgJiYgKHN0eWxlRGF0YSA9IG5vcm1hbGl6ZVN0eWxlRGF0YShwYXJlbnROb2RlLmRhdGEpKSkge1xyXG4gICAgICAgIGV4dGVuZChyZXMsIHN0eWxlRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgY3NzVmFyUkUgPSAvXi0tLztcclxuICB2YXIgaW1wb3J0YW50UkUgPSAvXFxzKiFpbXBvcnRhbnQkLztcclxuICB2YXIgc2V0UHJvcCA9IGZ1bmN0aW9uIChlbCwgbmFtZSwgdmFsKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChjc3NWYXJSRS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbCk7XHJcbiAgICB9IGVsc2UgaWYgKGltcG9ydGFudFJFLnRlc3QodmFsKSkge1xyXG4gICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwucmVwbGFjZShpbXBvcnRhbnRSRSwgJycpLCAnaW1wb3J0YW50Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBub3JtYWxpemUobmFtZSk7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IHZhbHVlcyBhcnJheSBjcmVhdGVkIGJ5IGF1dG9wcmVmaXhlciwgZS5nLlxyXG4gICAgICAgIC8vIHtkaXNwbGF5OiBbXCItd2Via2l0LWJveFwiLCBcIi1tcy1mbGV4Ym94XCIsIFwiZmxleFwiXX1cclxuICAgICAgICAvLyBTZXQgdGhlbSBvbmUgYnkgb25lLCBhbmQgdGhlIGJyb3dzZXIgd2lsbCBvbmx5IHNldCB0aG9zZSBpdCBjYW4gcmVjb2duaXplXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgZWwuc3R5bGVbbm9ybWFsaXplZE5hbWVdID0gdmFsW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbC5zdHlsZVtub3JtYWxpemVkTmFtZV0gPSB2YWw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgdmVuZG9yTmFtZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnXTtcclxuXHJcbiAgdmFyIGVtcHR5U3R5bGU7XHJcbiAgdmFyIG5vcm1hbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgZW1wdHlTdHlsZSA9IGVtcHR5U3R5bGUgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGU7XHJcbiAgICBwcm9wID0gY2FtZWxpemUocHJvcCk7XHJcbiAgICBpZiAocHJvcCAhPT0gJ2ZpbHRlcicgJiYgKHByb3AgaW4gZW1wdHlTdHlsZSkpIHtcclxuICAgICAgcmV0dXJuIHByb3BcclxuICAgIH1cclxuICAgIHZhciBjYXBOYW1lID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZlbmRvck5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBuYW1lID0gdmVuZG9yTmFtZXNbaV0gKyBjYXBOYW1lO1xyXG4gICAgICBpZiAobmFtZSBpbiBlbXB0eVN0eWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVTdHlsZShvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICAgIHZhciBvbGREYXRhID0gb2xkVm5vZGUuZGF0YTtcclxuXHJcbiAgICBpZiAoaXNVbmRlZihkYXRhLnN0YXRpY1N0eWxlKSAmJiBpc1VuZGVmKGRhdGEuc3R5bGUpICYmXHJcbiAgICAgIGlzVW5kZWYob2xkRGF0YS5zdGF0aWNTdHlsZSkgJiYgaXNVbmRlZihvbGREYXRhLnN0eWxlKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjdXIsIG5hbWU7XHJcbiAgICB2YXIgZWwgPSB2bm9kZS5lbG07XHJcbiAgICB2YXIgb2xkU3RhdGljU3R5bGUgPSBvbGREYXRhLnN0YXRpY1N0eWxlO1xyXG4gICAgdmFyIG9sZFN0eWxlQmluZGluZyA9IG9sZERhdGEubm9ybWFsaXplZFN0eWxlIHx8IG9sZERhdGEuc3R5bGUgfHwge307XHJcblxyXG4gICAgLy8gaWYgc3RhdGljIHN0eWxlIGV4aXN0cywgc3R5bGViaW5kaW5nIGFscmVhZHkgbWVyZ2VkIGludG8gaXQgd2hlbiBkb2luZyBub3JtYWxpemVTdHlsZURhdGFcclxuICAgIHZhciBvbGRTdHlsZSA9IG9sZFN0YXRpY1N0eWxlIHx8IG9sZFN0eWxlQmluZGluZztcclxuXHJcbiAgICB2YXIgc3R5bGUgPSBub3JtYWxpemVTdHlsZUJpbmRpbmcodm5vZGUuZGF0YS5zdHlsZSkgfHwge307XHJcblxyXG4gICAgLy8gc3RvcmUgbm9ybWFsaXplZCBzdHlsZSB1bmRlciBhIGRpZmZlcmVudCBrZXkgZm9yIG5leHQgZGlmZlxyXG4gICAgLy8gbWFrZSBzdXJlIHRvIGNsb25lIGl0IGlmIGl0J3MgcmVhY3RpdmUsIHNpbmNlIHRoZSB1c2VyIGxpa2VseSB3YW50c1xyXG4gICAgLy8gdG8gbXV0YXRlIGl0LlxyXG4gICAgdm5vZGUuZGF0YS5ub3JtYWxpemVkU3R5bGUgPSBpc0RlZihzdHlsZS5fX29iX18pXHJcbiAgICAgID8gZXh0ZW5kKHt9LCBzdHlsZSlcclxuICAgICAgOiBzdHlsZTtcclxuXHJcbiAgICB2YXIgbmV3U3R5bGUgPSBnZXRTdHlsZSh2bm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgZm9yIChuYW1lIGluIG9sZFN0eWxlKSB7XHJcbiAgICAgIGlmIChpc1VuZGVmKG5ld1N0eWxlW25hbWVdKSkge1xyXG4gICAgICAgIHNldFByb3AoZWwsIG5hbWUsICcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChuYW1lIGluIG5ld1N0eWxlKSB7XHJcbiAgICAgIGN1ciA9IG5ld1N0eWxlW25hbWVdO1xyXG4gICAgICBpZiAoY3VyICE9PSBvbGRTdHlsZVtuYW1lXSkge1xyXG4gICAgICAgIC8vIGllOSBzZXR0aW5nIHRvIG51bGwgaGFzIG5vIGVmZmVjdCwgbXVzdCB1c2UgZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgc2V0UHJvcChlbCwgbmFtZSwgY3VyID09IG51bGwgPyAnJyA6IGN1cik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBzdHlsZSA9IHtcclxuICAgIGNyZWF0ZTogdXBkYXRlU3R5bGUsXHJcbiAgICB1cGRhdGU6IHVwZGF0ZVN0eWxlXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgU1ZHIHNpbmNlIGNsYXNzTGlzdCBpcyBub3Qgc3VwcG9ydGVkIG9uXHJcbiAgICogU1ZHIGVsZW1lbnRzIGluIElFXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWRkQ2xhc3MoZWwsIGNscykge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIWNscyB8fCAhKGNscyA9IGNscy50cmltKCkpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XHJcbiAgICAgIGlmIChjbHMuaW5kZXhPZignICcpID4gLTEpIHtcclxuICAgICAgICBjbHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IHJldHVybiBlbC5jbGFzc0xpc3QuYWRkKGMpOyB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNscyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBjdXIgPSBcIiBcIiArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgXCIgXCI7XHJcbiAgICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAoY3VyICsgY2xzKS50cmltKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgY2xhc3Mgd2l0aCBjb21wYXRpYmlsaXR5IGZvciBTVkcgc2luY2UgY2xhc3NMaXN0IGlzIG5vdCBzdXBwb3J0ZWQgb25cclxuICAgKiBTVkcgZWxlbWVudHMgaW4gSUVcclxuICAgKi9cclxuICBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgY2xzKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmICghY2xzIHx8ICEoY2xzID0gY2xzLnRyaW0oKSkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcclxuICAgICAgaWYgKGNscy5pbmRleE9mKCcgJykgPiAtMSkge1xyXG4gICAgICAgIGNscy5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5yZW1vdmUoYyk7IH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWVsLmNsYXNzTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBjdXIgPSBcIiBcIiArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgXCIgXCI7XHJcbiAgICAgIHZhciB0YXIgPSAnICcgKyBjbHMgKyAnICc7XHJcbiAgICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcclxuICAgICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJyk7XHJcbiAgICAgIH1cclxuICAgICAgY3VyID0gY3VyLnRyaW0oKTtcclxuICAgICAgaWYgKGN1cikge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjdXIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIHJlc29sdmVUcmFuc2l0aW9uKGRlZikge1xyXG4gICAgaWYgKCFkZWYpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHZhciByZXMgPSB7fTtcclxuICAgICAgaWYgKGRlZi5jc3MgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgZXh0ZW5kKHJlcywgYXV0b0Nzc1RyYW5zaXRpb24oZGVmLm5hbWUgfHwgJ3YnKSk7XHJcbiAgICAgIH1cclxuICAgICAgZXh0ZW5kKHJlcywgZGVmKTtcclxuICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gYXV0b0Nzc1RyYW5zaXRpb24oZGVmKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGF1dG9Dc3NUcmFuc2l0aW9uID0gY2FjaGVkKGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlbnRlckNsYXNzOiAobmFtZSArIFwiLWVudGVyXCIpLFxyXG4gICAgICBlbnRlclRvQ2xhc3M6IChuYW1lICsgXCItZW50ZXItdG9cIiksXHJcbiAgICAgIGVudGVyQWN0aXZlQ2xhc3M6IChuYW1lICsgXCItZW50ZXItYWN0aXZlXCIpLFxyXG4gICAgICBsZWF2ZUNsYXNzOiAobmFtZSArIFwiLWxlYXZlXCIpLFxyXG4gICAgICBsZWF2ZVRvQ2xhc3M6IChuYW1lICsgXCItbGVhdmUtdG9cIiksXHJcbiAgICAgIGxlYXZlQWN0aXZlQ2xhc3M6IChuYW1lICsgXCItbGVhdmUtYWN0aXZlXCIpXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZhciBoYXNUcmFuc2l0aW9uID0gaW5Ccm93c2VyICYmICFpc0lFOTtcclxuICB2YXIgVFJBTlNJVElPTiA9ICd0cmFuc2l0aW9uJztcclxuICB2YXIgQU5JTUFUSU9OID0gJ2FuaW1hdGlvbic7XHJcblxyXG4gIC8vIFRyYW5zaXRpb24gcHJvcGVydHkvZXZlbnQgc25pZmZpbmdcclxuICB2YXIgdHJhbnNpdGlvblByb3AgPSAndHJhbnNpdGlvbic7XHJcbiAgdmFyIHRyYW5zaXRpb25FbmRFdmVudCA9ICd0cmFuc2l0aW9uZW5kJztcclxuICB2YXIgYW5pbWF0aW9uUHJvcCA9ICdhbmltYXRpb24nO1xyXG4gIHZhciBhbmltYXRpb25FbmRFdmVudCA9ICdhbmltYXRpb25lbmQnO1xyXG4gIGlmIChoYXNUcmFuc2l0aW9uKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmICh3aW5kb3cub250cmFuc2l0aW9uZW5kID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkXHJcbiAgICApIHtcclxuICAgICAgdHJhbnNpdGlvblByb3AgPSAnV2Via2l0VHJhbnNpdGlvbic7XHJcbiAgICAgIHRyYW5zaXRpb25FbmRFdmVudCA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcclxuICAgIH1cclxuICAgIGlmICh3aW5kb3cub25hbmltYXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICB3aW5kb3cub253ZWJraXRhbmltYXRpb25lbmQgIT09IHVuZGVmaW5lZFxyXG4gICAgKSB7XHJcbiAgICAgIGFuaW1hdGlvblByb3AgPSAnV2Via2l0QW5pbWF0aW9uJztcclxuICAgICAgYW5pbWF0aW9uRW5kRXZlbnQgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGJpbmRpbmcgdG8gd2luZG93IGlzIG5lY2Vzc2FyeSB0byBtYWtlIGhvdCByZWxvYWQgd29yayBpbiBJRSBpbiBzdHJpY3QgbW9kZVxyXG4gIHZhciByYWYgPSBpbkJyb3dzZXJcclxuICAgID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpXHJcbiAgICAgIDogc2V0VGltZW91dFxyXG4gICAgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBmdW5jdGlvbiAoZm4pIHsgcmV0dXJuIGZuKCk7IH07XHJcblxyXG4gIGZ1bmN0aW9uIG5leHRGcmFtZShmbikge1xyXG4gICAgcmFmKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmFmKGZuKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBjbHMpIHtcclxuICAgIHZhciB0cmFuc2l0aW9uQ2xhc3NlcyA9IGVsLl90cmFuc2l0aW9uQ2xhc3NlcyB8fCAoZWwuX3RyYW5zaXRpb25DbGFzc2VzID0gW10pO1xyXG4gICAgaWYgKHRyYW5zaXRpb25DbGFzc2VzLmluZGV4T2YoY2xzKSA8IDApIHtcclxuICAgICAgdHJhbnNpdGlvbkNsYXNzZXMucHVzaChjbHMpO1xyXG4gICAgICBhZGRDbGFzcyhlbCwgY2xzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgY2xzKSB7XHJcbiAgICBpZiAoZWwuX3RyYW5zaXRpb25DbGFzc2VzKSB7XHJcbiAgICAgIHJlbW92ZShlbC5fdHJhbnNpdGlvbkNsYXNzZXMsIGNscyk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVDbGFzcyhlbCwgY2xzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHdoZW5UcmFuc2l0aW9uRW5kcyhcclxuICAgIGVsLFxyXG4gICAgZXhwZWN0ZWRUeXBlLFxyXG4gICAgY2JcclxuICApIHtcclxuICAgIHZhciByZWYgPSBnZXRUcmFuc2l0aW9uSW5mbyhlbCwgZXhwZWN0ZWRUeXBlKTtcclxuICAgIHZhciB0eXBlID0gcmVmLnR5cGU7XHJcbiAgICB2YXIgdGltZW91dCA9IHJlZi50aW1lb3V0O1xyXG4gICAgdmFyIHByb3BDb3VudCA9IHJlZi5wcm9wQ291bnQ7XHJcbiAgICBpZiAoIXR5cGUpIHsgcmV0dXJuIGNiKCkgfVxyXG4gICAgdmFyIGV2ZW50ID0gdHlwZSA9PT0gVFJBTlNJVElPTiA/IHRyYW5zaXRpb25FbmRFdmVudCA6IGFuaW1hdGlvbkVuZEV2ZW50O1xyXG4gICAgdmFyIGVuZGVkID0gMDtcclxuICAgIHZhciBlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uRW5kKTtcclxuICAgICAgY2IoKTtcclxuICAgIH07XHJcbiAgICB2YXIgb25FbmQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XHJcbiAgICAgICAgaWYgKCsrZW5kZWQgPj0gcHJvcENvdW50KSB7XHJcbiAgICAgICAgICBlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGVuZGVkIDwgcHJvcENvdW50KSB7XHJcbiAgICAgICAgZW5kKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHRpbWVvdXQgKyAxKTtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uRW5kKTtcclxuICB9XHJcblxyXG4gIHZhciB0cmFuc2Zvcm1SRSA9IC9cXGIodHJhbnNmb3JtfGFsbCkoLHwkKS87XHJcblxyXG4gIGZ1bmN0aW9uIGdldFRyYW5zaXRpb25JbmZvKGVsLCBleHBlY3RlZFR5cGUpIHtcclxuICAgIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcbiAgICB2YXIgdHJhbnNpdGlvbkRlbGF5cyA9IHN0eWxlc1t0cmFuc2l0aW9uUHJvcCArICdEZWxheSddLnNwbGl0KCcsICcpO1xyXG4gICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbnMgPSBzdHlsZXNbdHJhbnNpdGlvblByb3AgKyAnRHVyYXRpb24nXS5zcGxpdCgnLCAnKTtcclxuICAgIHZhciB0cmFuc2l0aW9uVGltZW91dCA9IGdldFRpbWVvdXQodHJhbnNpdGlvbkRlbGF5cywgdHJhbnNpdGlvbkR1cmF0aW9ucyk7XHJcbiAgICB2YXIgYW5pbWF0aW9uRGVsYXlzID0gc3R5bGVzW2FuaW1hdGlvblByb3AgKyAnRGVsYXknXS5zcGxpdCgnLCAnKTtcclxuICAgIHZhciBhbmltYXRpb25EdXJhdGlvbnMgPSBzdHlsZXNbYW5pbWF0aW9uUHJvcCArICdEdXJhdGlvbiddLnNwbGl0KCcsICcpO1xyXG4gICAgdmFyIGFuaW1hdGlvblRpbWVvdXQgPSBnZXRUaW1lb3V0KGFuaW1hdGlvbkRlbGF5cywgYW5pbWF0aW9uRHVyYXRpb25zKTtcclxuXHJcbiAgICB2YXIgdHlwZTtcclxuICAgIHZhciB0aW1lb3V0ID0gMDtcclxuICAgIHZhciBwcm9wQ291bnQgPSAwO1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoZXhwZWN0ZWRUeXBlID09PSBUUkFOU0lUSU9OKSB7XHJcbiAgICAgIGlmICh0cmFuc2l0aW9uVGltZW91dCA+IDApIHtcclxuICAgICAgICB0eXBlID0gVFJBTlNJVElPTjtcclxuICAgICAgICB0aW1lb3V0ID0gdHJhbnNpdGlvblRpbWVvdXQ7XHJcbiAgICAgICAgcHJvcENvdW50ID0gdHJhbnNpdGlvbkR1cmF0aW9ucy5sZW5ndGg7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSBBTklNQVRJT04pIHtcclxuICAgICAgaWYgKGFuaW1hdGlvblRpbWVvdXQgPiAwKSB7XHJcbiAgICAgICAgdHlwZSA9IEFOSU1BVElPTjtcclxuICAgICAgICB0aW1lb3V0ID0gYW5pbWF0aW9uVGltZW91dDtcclxuICAgICAgICBwcm9wQ291bnQgPSBhbmltYXRpb25EdXJhdGlvbnMubGVuZ3RoO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aW1lb3V0ID0gTWF0aC5tYXgodHJhbnNpdGlvblRpbWVvdXQsIGFuaW1hdGlvblRpbWVvdXQpO1xyXG4gICAgICB0eXBlID0gdGltZW91dCA+IDBcclxuICAgICAgICA/IHRyYW5zaXRpb25UaW1lb3V0ID4gYW5pbWF0aW9uVGltZW91dFxyXG4gICAgICAgICAgPyBUUkFOU0lUSU9OXHJcbiAgICAgICAgICA6IEFOSU1BVElPTlxyXG4gICAgICAgIDogbnVsbDtcclxuICAgICAgcHJvcENvdW50ID0gdHlwZVxyXG4gICAgICAgID8gdHlwZSA9PT0gVFJBTlNJVElPTlxyXG4gICAgICAgICAgPyB0cmFuc2l0aW9uRHVyYXRpb25zLmxlbmd0aFxyXG4gICAgICAgICAgOiBhbmltYXRpb25EdXJhdGlvbnMubGVuZ3RoXHJcbiAgICAgICAgOiAwO1xyXG4gICAgfVxyXG4gICAgdmFyIGhhc1RyYW5zZm9ybSA9XHJcbiAgICAgIHR5cGUgPT09IFRSQU5TSVRJT04gJiZcclxuICAgICAgdHJhbnNmb3JtUkUudGVzdChzdHlsZXNbdHJhbnNpdGlvblByb3AgKyAnUHJvcGVydHknXSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxyXG4gICAgICBwcm9wQ291bnQ6IHByb3BDb3VudCxcclxuICAgICAgaGFzVHJhbnNmb3JtOiBoYXNUcmFuc2Zvcm1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFRpbWVvdXQoZGVsYXlzLCBkdXJhdGlvbnMpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICB3aGlsZSAoZGVsYXlzLmxlbmd0aCA8IGR1cmF0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgZGVsYXlzID0gZGVsYXlzLmNvbmNhdChkZWxheXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBkdXJhdGlvbnMubWFwKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgIHJldHVybiB0b01zKGQpICsgdG9NcyhkZWxheXNbaV0pXHJcbiAgICB9KSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvTXMocykge1xyXG4gICAgcmV0dXJuIE51bWJlcihzLnNsaWNlKDAsIC0xKSkgKiAxMDAwXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZW50ZXIodm5vZGUsIHRvZ2dsZURpc3BsYXkpIHtcclxuICAgIHZhciBlbCA9IHZub2RlLmVsbTtcclxuXHJcbiAgICAvLyBjYWxsIGxlYXZlIGNhbGxiYWNrIG5vd1xyXG4gICAgaWYgKGlzRGVmKGVsLl9sZWF2ZUNiKSkge1xyXG4gICAgICBlbC5fbGVhdmVDYi5jYW5jZWxsZWQgPSB0cnVlO1xyXG4gICAgICBlbC5fbGVhdmVDYigpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkYXRhID0gcmVzb2x2ZVRyYW5zaXRpb24odm5vZGUuZGF0YS50cmFuc2l0aW9uKTtcclxuICAgIGlmIChpc1VuZGVmKGRhdGEpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGlzRGVmKGVsLl9lbnRlckNiKSB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3NzID0gZGF0YS5jc3M7XHJcbiAgICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcclxuICAgIHZhciBlbnRlckNsYXNzID0gZGF0YS5lbnRlckNsYXNzO1xyXG4gICAgdmFyIGVudGVyVG9DbGFzcyA9IGRhdGEuZW50ZXJUb0NsYXNzO1xyXG4gICAgdmFyIGVudGVyQWN0aXZlQ2xhc3MgPSBkYXRhLmVudGVyQWN0aXZlQ2xhc3M7XHJcbiAgICB2YXIgYXBwZWFyQ2xhc3MgPSBkYXRhLmFwcGVhckNsYXNzO1xyXG4gICAgdmFyIGFwcGVhclRvQ2xhc3MgPSBkYXRhLmFwcGVhclRvQ2xhc3M7XHJcbiAgICB2YXIgYXBwZWFyQWN0aXZlQ2xhc3MgPSBkYXRhLmFwcGVhckFjdGl2ZUNsYXNzO1xyXG4gICAgdmFyIGJlZm9yZUVudGVyID0gZGF0YS5iZWZvcmVFbnRlcjtcclxuICAgIHZhciBlbnRlciA9IGRhdGEuZW50ZXI7XHJcbiAgICB2YXIgYWZ0ZXJFbnRlciA9IGRhdGEuYWZ0ZXJFbnRlcjtcclxuICAgIHZhciBlbnRlckNhbmNlbGxlZCA9IGRhdGEuZW50ZXJDYW5jZWxsZWQ7XHJcbiAgICB2YXIgYmVmb3JlQXBwZWFyID0gZGF0YS5iZWZvcmVBcHBlYXI7XHJcbiAgICB2YXIgYXBwZWFyID0gZGF0YS5hcHBlYXI7XHJcbiAgICB2YXIgYWZ0ZXJBcHBlYXIgPSBkYXRhLmFmdGVyQXBwZWFyO1xyXG4gICAgdmFyIGFwcGVhckNhbmNlbGxlZCA9IGRhdGEuYXBwZWFyQ2FuY2VsbGVkO1xyXG4gICAgdmFyIGR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcclxuXHJcbiAgICAvLyBhY3RpdmVJbnN0YW5jZSB3aWxsIGFsd2F5cyBiZSB0aGUgPHRyYW5zaXRpb24+IGNvbXBvbmVudCBtYW5hZ2luZyB0aGlzXHJcbiAgICAvLyB0cmFuc2l0aW9uLiBPbmUgZWRnZSBjYXNlIHRvIGNoZWNrIGlzIHdoZW4gdGhlIDx0cmFuc2l0aW9uPiBpcyBwbGFjZWRcclxuICAgIC8vIGFzIHRoZSByb290IG5vZGUgb2YgYSBjaGlsZCBjb21wb25lbnQuIEluIHRoYXQgY2FzZSB3ZSBuZWVkIHRvIGNoZWNrXHJcbiAgICAvLyA8dHJhbnNpdGlvbj4ncyBwYXJlbnQgZm9yIGFwcGVhciBjaGVjay5cclxuICAgIHZhciBjb250ZXh0ID0gYWN0aXZlSW5zdGFuY2U7XHJcbiAgICB2YXIgdHJhbnNpdGlvbk5vZGUgPSBhY3RpdmVJbnN0YW5jZS4kdm5vZGU7XHJcbiAgICB3aGlsZSAodHJhbnNpdGlvbk5vZGUgJiYgdHJhbnNpdGlvbk5vZGUucGFyZW50KSB7XHJcbiAgICAgIHRyYW5zaXRpb25Ob2RlID0gdHJhbnNpdGlvbk5vZGUucGFyZW50O1xyXG4gICAgICBjb250ZXh0ID0gdHJhbnNpdGlvbk5vZGUuY29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNBcHBlYXIgPSAhY29udGV4dC5faXNNb3VudGVkIHx8ICF2bm9kZS5pc1Jvb3RJbnNlcnQ7XHJcblxyXG4gICAgaWYgKGlzQXBwZWFyICYmICFhcHBlYXIgJiYgYXBwZWFyICE9PSAnJykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgc3RhcnRDbGFzcyA9IGlzQXBwZWFyICYmIGFwcGVhckNsYXNzXHJcbiAgICAgID8gYXBwZWFyQ2xhc3NcclxuICAgICAgOiBlbnRlckNsYXNzO1xyXG4gICAgdmFyIGFjdGl2ZUNsYXNzID0gaXNBcHBlYXIgJiYgYXBwZWFyQWN0aXZlQ2xhc3NcclxuICAgICAgPyBhcHBlYXJBY3RpdmVDbGFzc1xyXG4gICAgICA6IGVudGVyQWN0aXZlQ2xhc3M7XHJcbiAgICB2YXIgdG9DbGFzcyA9IGlzQXBwZWFyICYmIGFwcGVhclRvQ2xhc3NcclxuICAgICAgPyBhcHBlYXJUb0NsYXNzXHJcbiAgICAgIDogZW50ZXJUb0NsYXNzO1xyXG5cclxuICAgIHZhciBiZWZvcmVFbnRlckhvb2sgPSBpc0FwcGVhclxyXG4gICAgICA/IChiZWZvcmVBcHBlYXIgfHwgYmVmb3JlRW50ZXIpXHJcbiAgICAgIDogYmVmb3JlRW50ZXI7XHJcbiAgICB2YXIgZW50ZXJIb29rID0gaXNBcHBlYXJcclxuICAgICAgPyAodHlwZW9mIGFwcGVhciA9PT0gJ2Z1bmN0aW9uJyA/IGFwcGVhciA6IGVudGVyKVxyXG4gICAgICA6IGVudGVyO1xyXG4gICAgdmFyIGFmdGVyRW50ZXJIb29rID0gaXNBcHBlYXJcclxuICAgICAgPyAoYWZ0ZXJBcHBlYXIgfHwgYWZ0ZXJFbnRlcilcclxuICAgICAgOiBhZnRlckVudGVyO1xyXG4gICAgdmFyIGVudGVyQ2FuY2VsbGVkSG9vayA9IGlzQXBwZWFyXHJcbiAgICAgID8gKGFwcGVhckNhbmNlbGxlZCB8fCBlbnRlckNhbmNlbGxlZClcclxuICAgICAgOiBlbnRlckNhbmNlbGxlZDtcclxuXHJcbiAgICB2YXIgZXhwbGljaXRFbnRlckR1cmF0aW9uID0gdG9OdW1iZXIoXHJcbiAgICAgIGlzT2JqZWN0KGR1cmF0aW9uKVxyXG4gICAgICAgID8gZHVyYXRpb24uZW50ZXJcclxuICAgICAgICA6IGR1cmF0aW9uXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBleHBsaWNpdEVudGVyRHVyYXRpb24gIT0gbnVsbCkge1xyXG4gICAgICBjaGVja0R1cmF0aW9uKGV4cGxpY2l0RW50ZXJEdXJhdGlvbiwgJ2VudGVyJywgdm5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBleHBlY3RzQ1NTID0gY3NzICE9PSBmYWxzZSAmJiAhaXNJRTk7XHJcbiAgICB2YXIgdXNlcldhbnRzQ29udHJvbCA9IGdldEhvb2tBcmd1bWVudHNMZW5ndGgoZW50ZXJIb29rKTtcclxuXHJcbiAgICB2YXIgY2IgPSBlbC5fZW50ZXJDYiA9IG9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgdG9DbGFzcyk7XHJcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBhY3RpdmVDbGFzcyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNiLmNhbmNlbGxlZCkge1xyXG4gICAgICAgIGlmIChleHBlY3RzQ1NTKSB7XHJcbiAgICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIHN0YXJ0Q2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbnRlckNhbmNlbGxlZEhvb2sgJiYgZW50ZXJDYW5jZWxsZWRIb29rKGVsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhZnRlckVudGVySG9vayAmJiBhZnRlckVudGVySG9vayhlbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWwuX2VudGVyQ2IgPSBudWxsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcclxuICAgICAgLy8gcmVtb3ZlIHBlbmRpbmcgbGVhdmUgZWxlbWVudCBvbiBlbnRlciBieSBpbmplY3RpbmcgYW4gaW5zZXJ0IGhvb2tcclxuICAgICAgbWVyZ2VWTm9kZUhvb2sodm5vZGUsICdpbnNlcnQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XHJcbiAgICAgICAgdmFyIHBlbmRpbmdOb2RlID0gcGFyZW50ICYmIHBhcmVudC5fcGVuZGluZyAmJiBwYXJlbnQuX3BlbmRpbmdbdm5vZGUua2V5XTtcclxuICAgICAgICBpZiAocGVuZGluZ05vZGUgJiZcclxuICAgICAgICAgIHBlbmRpbmdOb2RlLnRhZyA9PT0gdm5vZGUudGFnICYmXHJcbiAgICAgICAgICBwZW5kaW5nTm9kZS5lbG0uX2xlYXZlQ2JcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHBlbmRpbmdOb2RlLmVsbS5fbGVhdmVDYigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbnRlckhvb2sgJiYgZW50ZXJIb29rKGVsLCBjYik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHN0YXJ0IGVudGVyIHRyYW5zaXRpb25cclxuICAgIGJlZm9yZUVudGVySG9vayAmJiBiZWZvcmVFbnRlckhvb2soZWwpO1xyXG4gICAgaWYgKGV4cGVjdHNDU1MpIHtcclxuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBzdGFydENsYXNzKTtcclxuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBhY3RpdmVDbGFzcyk7XHJcbiAgICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBzdGFydENsYXNzKTtcclxuICAgICAgICBpZiAoIWNiLmNhbmNlbGxlZCkge1xyXG4gICAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCB0b0NsYXNzKTtcclxuICAgICAgICAgIGlmICghdXNlcldhbnRzQ29udHJvbCkge1xyXG4gICAgICAgICAgICBpZiAoaXNWYWxpZER1cmF0aW9uKGV4cGxpY2l0RW50ZXJEdXJhdGlvbikpIHtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNiLCBleHBsaWNpdEVudGVyRHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdoZW5UcmFuc2l0aW9uRW5kcyhlbCwgdHlwZSwgY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodm5vZGUuZGF0YS5zaG93KSB7XHJcbiAgICAgIHRvZ2dsZURpc3BsYXkgJiYgdG9nZ2xlRGlzcGxheSgpO1xyXG4gICAgICBlbnRlckhvb2sgJiYgZW50ZXJIb29rKGVsLCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFleHBlY3RzQ1NTICYmICF1c2VyV2FudHNDb250cm9sKSB7XHJcbiAgICAgIGNiKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsZWF2ZSh2bm9kZSwgcm0pIHtcclxuICAgIHZhciBlbCA9IHZub2RlLmVsbTtcclxuXHJcbiAgICAvLyBjYWxsIGVudGVyIGNhbGxiYWNrIG5vd1xyXG4gICAgaWYgKGlzRGVmKGVsLl9lbnRlckNiKSkge1xyXG4gICAgICBlbC5fZW50ZXJDYi5jYW5jZWxsZWQgPSB0cnVlO1xyXG4gICAgICBlbC5fZW50ZXJDYigpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkYXRhID0gcmVzb2x2ZVRyYW5zaXRpb24odm5vZGUuZGF0YS50cmFuc2l0aW9uKTtcclxuICAgIGlmIChpc1VuZGVmKGRhdGEpIHx8IGVsLm5vZGVUeXBlICE9PSAxKSB7XHJcbiAgICAgIHJldHVybiBybSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXNEZWYoZWwuX2xlYXZlQ2IpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjc3MgPSBkYXRhLmNzcztcclxuICAgIHZhciB0eXBlID0gZGF0YS50eXBlO1xyXG4gICAgdmFyIGxlYXZlQ2xhc3MgPSBkYXRhLmxlYXZlQ2xhc3M7XHJcbiAgICB2YXIgbGVhdmVUb0NsYXNzID0gZGF0YS5sZWF2ZVRvQ2xhc3M7XHJcbiAgICB2YXIgbGVhdmVBY3RpdmVDbGFzcyA9IGRhdGEubGVhdmVBY3RpdmVDbGFzcztcclxuICAgIHZhciBiZWZvcmVMZWF2ZSA9IGRhdGEuYmVmb3JlTGVhdmU7XHJcbiAgICB2YXIgbGVhdmUgPSBkYXRhLmxlYXZlO1xyXG4gICAgdmFyIGFmdGVyTGVhdmUgPSBkYXRhLmFmdGVyTGVhdmU7XHJcbiAgICB2YXIgbGVhdmVDYW5jZWxsZWQgPSBkYXRhLmxlYXZlQ2FuY2VsbGVkO1xyXG4gICAgdmFyIGRlbGF5TGVhdmUgPSBkYXRhLmRlbGF5TGVhdmU7XHJcbiAgICB2YXIgZHVyYXRpb24gPSBkYXRhLmR1cmF0aW9uO1xyXG5cclxuICAgIHZhciBleHBlY3RzQ1NTID0gY3NzICE9PSBmYWxzZSAmJiAhaXNJRTk7XHJcbiAgICB2YXIgdXNlcldhbnRzQ29udHJvbCA9IGdldEhvb2tBcmd1bWVudHNMZW5ndGgobGVhdmUpO1xyXG5cclxuICAgIHZhciBleHBsaWNpdExlYXZlRHVyYXRpb24gPSB0b051bWJlcihcclxuICAgICAgaXNPYmplY3QoZHVyYXRpb24pXHJcbiAgICAgICAgPyBkdXJhdGlvbi5sZWF2ZVxyXG4gICAgICAgIDogZHVyYXRpb25cclxuICAgICk7XHJcblxyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGlzRGVmKGV4cGxpY2l0TGVhdmVEdXJhdGlvbikpIHtcclxuICAgICAgY2hlY2tEdXJhdGlvbihleHBsaWNpdExlYXZlRHVyYXRpb24sICdsZWF2ZScsIHZub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2IgPSBlbC5fbGVhdmVDYiA9IG9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlLl9wZW5kaW5nKSB7XHJcbiAgICAgICAgZWwucGFyZW50Tm9kZS5fcGVuZGluZ1t2bm9kZS5rZXldID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVUb0NsYXNzKTtcclxuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQWN0aXZlQ2xhc3MpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjYi5jYW5jZWxsZWQpIHtcclxuICAgICAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVhdmVDYW5jZWxsZWQgJiYgbGVhdmVDYW5jZWxsZWQoZWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJtKCk7XHJcbiAgICAgICAgYWZ0ZXJMZWF2ZSAmJiBhZnRlckxlYXZlKGVsKTtcclxuICAgICAgfVxyXG4gICAgICBlbC5fbGVhdmVDYiA9IG51bGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoZGVsYXlMZWF2ZSkge1xyXG4gICAgICBkZWxheUxlYXZlKHBlcmZvcm1MZWF2ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwZXJmb3JtTGVhdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJmb3JtTGVhdmUoKSB7XHJcbiAgICAgIC8vIHRoZSBkZWxheWVkIGxlYXZlIG1heSBoYXZlIGFscmVhZHkgYmVlbiBjYW5jZWxsZWRcclxuICAgICAgaWYgKGNiLmNhbmNlbGxlZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIC8vIHJlY29yZCBsZWF2aW5nIGVsZW1lbnRcclxuICAgICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcclxuICAgICAgICAoZWwucGFyZW50Tm9kZS5fcGVuZGluZyB8fCAoZWwucGFyZW50Tm9kZS5fcGVuZGluZyA9IHt9KSlbKHZub2RlLmtleSldID0gdm5vZGU7XHJcbiAgICAgIH1cclxuICAgICAgYmVmb3JlTGVhdmUgJiYgYmVmb3JlTGVhdmUoZWwpO1xyXG4gICAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVDbGFzcyk7XHJcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUFjdGl2ZUNsYXNzKTtcclxuICAgICAgICBuZXh0RnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUNsYXNzKTtcclxuICAgICAgICAgIGlmICghY2IuY2FuY2VsbGVkKSB7XHJcbiAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVUb0NsYXNzKTtcclxuICAgICAgICAgICAgaWYgKCF1c2VyV2FudHNDb250cm9sKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGlzVmFsaWREdXJhdGlvbihleHBsaWNpdExlYXZlRHVyYXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNiLCBleHBsaWNpdExlYXZlRHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGVuVHJhbnNpdGlvbkVuZHMoZWwsIHR5cGUsIGNiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBsZWF2ZSAmJiBsZWF2ZShlbCwgY2IpO1xyXG4gICAgICBpZiAoIWV4cGVjdHNDU1MgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcclxuICAgICAgICBjYigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBvbmx5IHVzZWQgaW4gZGV2IG1vZGVcclxuICBmdW5jdGlvbiBjaGVja0R1cmF0aW9uKHZhbCwgbmFtZSwgdm5vZGUpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiPHRyYW5zaXRpb24+IGV4cGxpY2l0IFwiICsgbmFtZSArIFwiIGR1cmF0aW9uIGlzIG5vdCBhIHZhbGlkIG51bWJlciAtIFwiICtcclxuICAgICAgICBcImdvdCBcIiArIChKU09OLnN0cmluZ2lmeSh2YWwpKSArIFwiLlwiLFxyXG4gICAgICAgIHZub2RlLmNvbnRleHRcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAoaXNOYU4odmFsKSkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgIFwiPHRyYW5zaXRpb24+IGV4cGxpY2l0IFwiICsgbmFtZSArIFwiIGR1cmF0aW9uIGlzIE5hTiAtIFwiICtcclxuICAgICAgICAndGhlIGR1cmF0aW9uIGV4cHJlc3Npb24gbWlnaHQgYmUgaW5jb3JyZWN0LicsXHJcbiAgICAgICAgdm5vZGUuY29udGV4dFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNWYWxpZER1cmF0aW9uKHZhbCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmICFpc05hTih2YWwpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb3JtYWxpemUgYSB0cmFuc2l0aW9uIGhvb2sncyBhcmd1bWVudCBsZW5ndGguIFRoZSBob29rIG1heSBiZTpcclxuICAgKiAtIGEgbWVyZ2VkIGhvb2sgKGludm9rZXIpIHdpdGggdGhlIG9yaWdpbmFsIGluIC5mbnNcclxuICAgKiAtIGEgd3JhcHBlZCBjb21wb25lbnQgbWV0aG9kIChjaGVjayAuX2xlbmd0aClcclxuICAgKiAtIGEgcGxhaW4gZnVuY3Rpb24gKC5sZW5ndGgpXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aChmbikge1xyXG4gICAgaWYgKGlzVW5kZWYoZm4pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgdmFyIGludm9rZXJGbnMgPSBmbi5mbnM7XHJcbiAgICBpZiAoaXNEZWYoaW52b2tlckZucykpIHtcclxuICAgICAgLy8gaW52b2tlclxyXG4gICAgICByZXR1cm4gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aChcclxuICAgICAgICBBcnJheS5pc0FycmF5KGludm9rZXJGbnMpXHJcbiAgICAgICAgICA/IGludm9rZXJGbnNbMF1cclxuICAgICAgICAgIDogaW52b2tlckZuc1xyXG4gICAgICApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKGZuLl9sZW5ndGggfHwgZm4ubGVuZ3RoKSA+IDFcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9lbnRlcihfLCB2bm9kZSkge1xyXG4gICAgaWYgKHZub2RlLmRhdGEuc2hvdyAhPT0gdHJ1ZSkge1xyXG4gICAgICBlbnRlcih2bm9kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgdHJhbnNpdGlvbiA9IGluQnJvd3NlciA/IHtcclxuICAgIGNyZWF0ZTogX2VudGVyLFxyXG4gICAgYWN0aXZhdGU6IF9lbnRlcixcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlJCQxKHZub2RlLCBybSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICBpZiAodm5vZGUuZGF0YS5zaG93ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgbGVhdmUodm5vZGUsIHJtKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBybSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSA6IHt9XHJcblxyXG4gIHZhciBwbGF0Zm9ybU1vZHVsZXMgPSBbXHJcbiAgICBhdHRycyxcclxuICAgIGtsYXNzLFxyXG4gICAgZXZlbnRzLFxyXG4gICAgZG9tUHJvcHMsXHJcbiAgICBzdHlsZSxcclxuICAgIHRyYW5zaXRpb25cclxuICBdXHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyB0aGUgZGlyZWN0aXZlIG1vZHVsZSBzaG91bGQgYmUgYXBwbGllZCBsYXN0LCBhZnRlciBhbGxcclxuICAvLyBidWlsdC1pbiBtb2R1bGVzIGhhdmUgYmVlbiBhcHBsaWVkLlxyXG4gIHZhciBtb2R1bGVzID0gcGxhdGZvcm1Nb2R1bGVzLmNvbmNhdChiYXNlTW9kdWxlcyk7XHJcblxyXG4gIHZhciBwYXRjaCA9IGNyZWF0ZVBhdGNoRnVuY3Rpb24oeyBub2RlT3BzOiBub2RlT3BzLCBtb2R1bGVzOiBtb2R1bGVzIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBOb3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgbGlrZSBhdHRhY2hpbmdcclxuICAgKiBwcm9wZXJ0aWVzIHRvIEVsZW1lbnRzLlxyXG4gICAqL1xyXG5cclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICBpZiAoaXNJRTkpIHtcclxuICAgIC8vIGh0dHA6Ly93d3cubWF0dHM0MTEuY29tL3Bvc3QvaW50ZXJuZXQtZXhwbG9yZXItOS1vbmlucHV0L1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0aW9uY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoZWwgJiYgZWwudm1vZGVsKSB7XHJcbiAgICAgICAgdHJpZ2dlcihlbCwgJ2lucHV0Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgIGluc2VydGVkOiBmdW5jdGlvbiBpbnNlcnRlZChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XHJcbiAgICAgIGlmICh2bm9kZS50YWcgPT09ICdzZWxlY3QnKSB7XHJcbiAgICAgICAgLy8gIzY5MDNcclxuICAgICAgICBpZiAob2xkVm5vZGUuZWxtICYmICFvbGRWbm9kZS5lbG0uX3ZPcHRpb25zKSB7XHJcbiAgICAgICAgICBtZXJnZVZOb2RlSG9vayh2bm9kZSwgJ3Bvc3RwYXRjaCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlLmNvbXBvbmVudFVwZGF0ZWQoZWwsIGJpbmRpbmcsIHZub2RlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRTZWxlY3RlZChlbCwgYmluZGluZywgdm5vZGUuY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLl92T3B0aW9ucyA9IFtdLm1hcC5jYWxsKGVsLm9wdGlvbnMsIGdldFZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmICh2bm9kZS50YWcgPT09ICd0ZXh0YXJlYScgfHwgaXNUZXh0SW5wdXRUeXBlKGVsLnR5cGUpKSB7XHJcbiAgICAgICAgZWwuX3ZNb2RpZmllcnMgPSBiaW5kaW5nLm1vZGlmaWVycztcclxuICAgICAgICBpZiAoIWJpbmRpbmcubW9kaWZpZXJzLmxhenkpIHtcclxuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCBvbkNvbXBvc2l0aW9uU3RhcnQpO1xyXG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBvbkNvbXBvc2l0aW9uRW5kKTtcclxuICAgICAgICAgIC8vIFNhZmFyaSA8IDEwLjIgJiBVSVdlYlZpZXcgZG9lc24ndCBmaXJlIGNvbXBvc2l0aW9uZW5kIHdoZW5cclxuICAgICAgICAgIC8vIHN3aXRjaGluZyBmb2N1cyBiZWZvcmUgY29uZmlybWluZyBjb21wb3NpdGlvbiBjaG9pY2VcclxuICAgICAgICAgIC8vIHRoaXMgYWxzbyBmaXhlcyB0aGUgaXNzdWUgd2hlcmUgc29tZSBicm93c2VycyBlLmcuIGlPUyBDaHJvbWVcclxuICAgICAgICAgIC8vIGZpcmVzIFwiY2hhbmdlXCIgaW5zdGVhZCBvZiBcImlucHV0XCIgb24gYXV0b2NvbXBsZXRlLlxyXG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25Db21wb3NpdGlvbkVuZCk7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgIGlmIChpc0lFOSkge1xyXG4gICAgICAgICAgICBlbC52bW9kZWwgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wb25lbnRVcGRhdGVkOiBmdW5jdGlvbiBjb21wb25lbnRVcGRhdGVkKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xyXG4gICAgICBpZiAodm5vZGUudGFnID09PSAnc2VsZWN0Jykge1xyXG4gICAgICAgIHNldFNlbGVjdGVkKGVsLCBiaW5kaW5nLCB2bm9kZS5jb250ZXh0KTtcclxuICAgICAgICAvLyBpbiBjYXNlIHRoZSBvcHRpb25zIHJlbmRlcmVkIGJ5IHYtZm9yIGhhdmUgY2hhbmdlZCxcclxuICAgICAgICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHZhbHVlIGlzIG91dC1vZi1zeW5jIHdpdGggdGhlIHJlbmRlcmVkIG9wdGlvbnMuXHJcbiAgICAgICAgLy8gZGV0ZWN0IHN1Y2ggY2FzZXMgYW5kIGZpbHRlciBvdXQgdmFsdWVzIHRoYXQgbm8gbG9uZ2VyIGhhcyBhIG1hdGNoaW5nXHJcbiAgICAgICAgLy8gb3B0aW9uIGluIHRoZSBET00uXHJcbiAgICAgICAgdmFyIHByZXZPcHRpb25zID0gZWwuX3ZPcHRpb25zO1xyXG4gICAgICAgIHZhciBjdXJPcHRpb25zID0gZWwuX3ZPcHRpb25zID0gW10ubWFwLmNhbGwoZWwub3B0aW9ucywgZ2V0VmFsdWUpO1xyXG4gICAgICAgIGlmIChjdXJPcHRpb25zLnNvbWUoZnVuY3Rpb24gKG8sIGkpIHsgcmV0dXJuICFsb29zZUVxdWFsKG8sIHByZXZPcHRpb25zW2ldKTsgfSkpIHtcclxuICAgICAgICAgIC8vIHRyaWdnZXIgY2hhbmdlIGV2ZW50IGlmXHJcbiAgICAgICAgICAvLyBubyBtYXRjaGluZyBvcHRpb24gZm91bmQgZm9yIGF0IGxlYXN0IG9uZSB2YWx1ZVxyXG4gICAgICAgICAgdmFyIG5lZWRSZXNldCA9IGVsLm11bHRpcGxlXHJcbiAgICAgICAgICAgID8gYmluZGluZy52YWx1ZS5zb21lKGZ1bmN0aW9uICh2KSB7IHJldHVybiBoYXNOb01hdGNoaW5nT3B0aW9uKHYsIGN1ck9wdGlvbnMpOyB9KVxyXG4gICAgICAgICAgICA6IGJpbmRpbmcudmFsdWUgIT09IGJpbmRpbmcub2xkVmFsdWUgJiYgaGFzTm9NYXRjaGluZ09wdGlvbihiaW5kaW5nLnZhbHVlLCBjdXJPcHRpb25zKTtcclxuICAgICAgICAgIGlmIChuZWVkUmVzZXQpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcihlbCwgJ2NoYW5nZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHNldFNlbGVjdGVkKGVsLCBiaW5kaW5nLCB2bSkge1xyXG4gICAgYWN0dWFsbHlTZXRTZWxlY3RlZChlbCwgYmluZGluZywgdm0pO1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXNJRSB8fCBpc0VkZ2UpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWN0dWFsbHlTZXRTZWxlY3RlZChlbCwgYmluZGluZywgdm0pO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFjdHVhbGx5U2V0U2VsZWN0ZWQoZWwsIGJpbmRpbmcsIHZtKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xyXG4gICAgdmFyIGlzTXVsdGlwbGUgPSBlbC5tdWx0aXBsZTtcclxuICAgIGlmIChpc011bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgIFwiPHNlbGVjdCBtdWx0aXBsZSB2LW1vZGVsPVxcXCJcIiArIChiaW5kaW5nLmV4cHJlc3Npb24pICsgXCJcXFwiPiBcIiArXHJcbiAgICAgICAgXCJleHBlY3RzIGFuIEFycmF5IHZhbHVlIGZvciBpdHMgYmluZGluZywgYnV0IGdvdCBcIiArIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLnNsaWNlKDgsIC0xKSksXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgc2VsZWN0ZWQsIG9wdGlvbjtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZWwub3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgb3B0aW9uID0gZWwub3B0aW9uc1tpXTtcclxuICAgICAgaWYgKGlzTXVsdGlwbGUpIHtcclxuICAgICAgICBzZWxlY3RlZCA9IGxvb3NlSW5kZXhPZih2YWx1ZSwgZ2V0VmFsdWUob3B0aW9uKSkgPiAtMTtcclxuICAgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkICE9PSBzZWxlY3RlZCkge1xyXG4gICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChsb29zZUVxdWFsKGdldFZhbHVlKG9wdGlvbiksIHZhbHVlKSkge1xyXG4gICAgICAgICAgaWYgKGVsLnNlbGVjdGVkSW5kZXggIT09IGkpIHtcclxuICAgICAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghaXNNdWx0aXBsZSkge1xyXG4gICAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYXNOb01hdGNoaW5nT3B0aW9uKHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gb3B0aW9ucy5ldmVyeShmdW5jdGlvbiAobykgeyByZXR1cm4gIWxvb3NlRXF1YWwobywgdmFsdWUpOyB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWUob3B0aW9uKSB7XHJcbiAgICByZXR1cm4gJ192YWx1ZScgaW4gb3B0aW9uXHJcbiAgICAgID8gb3B0aW9uLl92YWx1ZVxyXG4gICAgICA6IG9wdGlvbi52YWx1ZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25Db21wb3NpdGlvblN0YXJ0KGUpIHtcclxuICAgIGUudGFyZ2V0LmNvbXBvc2luZyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkNvbXBvc2l0aW9uRW5kKGUpIHtcclxuICAgIC8vIHByZXZlbnQgdHJpZ2dlcmluZyBhbiBpbnB1dCBldmVudCBmb3Igbm8gcmVhc29uXHJcbiAgICBpZiAoIWUudGFyZ2V0LmNvbXBvc2luZykgeyByZXR1cm4gfVxyXG4gICAgZS50YXJnZXQuY29tcG9zaW5nID0gZmFsc2U7XHJcbiAgICB0cmlnZ2VyKGUudGFyZ2V0LCAnaW5wdXQnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRyaWdnZXIoZWwsIHR5cGUpIHtcclxuICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcclxuICAgIGUuaW5pdEV2ZW50KHR5cGUsIHRydWUsIHRydWUpO1xyXG4gICAgZWwuZGlzcGF0Y2hFdmVudChlKTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyByZWN1cnNpdmVseSBzZWFyY2ggZm9yIHBvc3NpYmxlIHRyYW5zaXRpb24gZGVmaW5lZCBpbnNpZGUgdGhlIGNvbXBvbmVudCByb290XHJcbiAgZnVuY3Rpb24gbG9jYXRlTm9kZSh2bm9kZSkge1xyXG4gICAgcmV0dXJuIHZub2RlLmNvbXBvbmVudEluc3RhbmNlICYmICghdm5vZGUuZGF0YSB8fCAhdm5vZGUuZGF0YS50cmFuc2l0aW9uKVxyXG4gICAgICA/IGxvY2F0ZU5vZGUodm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlKVxyXG4gICAgICA6IHZub2RlXHJcbiAgfVxyXG5cclxuICB2YXIgc2hvdyA9IHtcclxuICAgIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoZWwsIHJlZiwgdm5vZGUpIHtcclxuICAgICAgdmFyIHZhbHVlID0gcmVmLnZhbHVlO1xyXG5cclxuICAgICAgdm5vZGUgPSBsb2NhdGVOb2RlKHZub2RlKTtcclxuICAgICAgdmFyIHRyYW5zaXRpb24kJDEgPSB2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEudHJhbnNpdGlvbjtcclxuICAgICAgdmFyIG9yaWdpbmFsRGlzcGxheSA9IGVsLl9fdk9yaWdpbmFsRGlzcGxheSA9XHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnID8gJycgOiBlbC5zdHlsZS5kaXNwbGF5O1xyXG4gICAgICBpZiAodmFsdWUgJiYgdHJhbnNpdGlvbiQkMSkge1xyXG4gICAgICAgIHZub2RlLmRhdGEuc2hvdyA9IHRydWU7XHJcbiAgICAgICAgZW50ZXIodm5vZGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBvcmlnaW5hbERpc3BsYXk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gb3JpZ2luYWxEaXNwbGF5IDogJ25vbmUnO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGVsLCByZWYsIHZub2RlKSB7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHJlZi52YWx1ZTtcclxuICAgICAgdmFyIG9sZFZhbHVlID0gcmVmLm9sZFZhbHVlO1xyXG5cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmICghdmFsdWUgPT09ICFvbGRWYWx1ZSkgeyByZXR1cm4gfVxyXG4gICAgICB2bm9kZSA9IGxvY2F0ZU5vZGUodm5vZGUpO1xyXG4gICAgICB2YXIgdHJhbnNpdGlvbiQkMSA9IHZub2RlLmRhdGEgJiYgdm5vZGUuZGF0YS50cmFuc2l0aW9uO1xyXG4gICAgICBpZiAodHJhbnNpdGlvbiQkMSkge1xyXG4gICAgICAgIHZub2RlLmRhdGEuc2hvdyA9IHRydWU7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICBlbnRlcih2bm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZWwuX192T3JpZ2luYWxEaXNwbGF5O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxlYXZlKHZub2RlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gZWwuX192T3JpZ2luYWxEaXNwbGF5IDogJ25vbmUnO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKFxyXG4gICAgICBlbCxcclxuICAgICAgYmluZGluZyxcclxuICAgICAgdm5vZGUsXHJcbiAgICAgIG9sZFZub2RlLFxyXG4gICAgICBpc0Rlc3Ryb3lcclxuICAgICkge1xyXG4gICAgICBpZiAoIWlzRGVzdHJveSkge1xyXG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBlbC5fX3ZPcmlnaW5hbERpc3BsYXk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBwbGF0Zm9ybURpcmVjdGl2ZXMgPSB7XHJcbiAgICBtb2RlbDogZGlyZWN0aXZlLFxyXG4gICAgc2hvdzogc2hvd1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8vIFByb3ZpZGVzIHRyYW5zaXRpb24gc3VwcG9ydCBmb3IgYSBzaW5nbGUgZWxlbWVudC9jb21wb25lbnQuXHJcbiAgLy8gc3VwcG9ydHMgdHJhbnNpdGlvbiBtb2RlIChvdXQtaW4gLyBpbi1vdXQpXHJcblxyXG4gIHZhciB0cmFuc2l0aW9uUHJvcHMgPSB7XHJcbiAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICBhcHBlYXI6IEJvb2xlYW4sXHJcbiAgICBjc3M6IEJvb2xlYW4sXHJcbiAgICBtb2RlOiBTdHJpbmcsXHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBlbnRlckNsYXNzOiBTdHJpbmcsXHJcbiAgICBsZWF2ZUNsYXNzOiBTdHJpbmcsXHJcbiAgICBlbnRlclRvQ2xhc3M6IFN0cmluZyxcclxuICAgIGxlYXZlVG9DbGFzczogU3RyaW5nLFxyXG4gICAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxyXG4gICAgbGVhdmVBY3RpdmVDbGFzczogU3RyaW5nLFxyXG4gICAgYXBwZWFyQ2xhc3M6IFN0cmluZyxcclxuICAgIGFwcGVhckFjdGl2ZUNsYXNzOiBTdHJpbmcsXHJcbiAgICBhcHBlYXJUb0NsYXNzOiBTdHJpbmcsXHJcbiAgICBkdXJhdGlvbjogW051bWJlciwgU3RyaW5nLCBPYmplY3RdXHJcbiAgfTtcclxuXHJcbiAgLy8gaW4gY2FzZSB0aGUgY2hpbGQgaXMgYWxzbyBhbiBhYnN0cmFjdCBjb21wb25lbnQsIGUuZy4gPGtlZXAtYWxpdmU+XHJcbiAgLy8gd2Ugd2FudCB0byByZWN1cnNpdmVseSByZXRyaWV2ZSB0aGUgcmVhbCBjb21wb25lbnQgdG8gYmUgcmVuZGVyZWRcclxuICBmdW5jdGlvbiBnZXRSZWFsQ2hpbGQodm5vZGUpIHtcclxuICAgIHZhciBjb21wT3B0aW9ucyA9IHZub2RlICYmIHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XHJcbiAgICBpZiAoY29tcE9wdGlvbnMgJiYgY29tcE9wdGlvbnMuQ3Rvci5vcHRpb25zLmFic3RyYWN0KSB7XHJcbiAgICAgIHJldHVybiBnZXRSZWFsQ2hpbGQoZ2V0Rmlyc3RDb21wb25lbnRDaGlsZChjb21wT3B0aW9ucy5jaGlsZHJlbikpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdm5vZGVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV4dHJhY3RUcmFuc2l0aW9uRGF0YShjb21wKSB7XHJcbiAgICB2YXIgZGF0YSA9IHt9O1xyXG4gICAgdmFyIG9wdGlvbnMgPSBjb21wLiRvcHRpb25zO1xyXG4gICAgLy8gcHJvcHNcclxuICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zLnByb3BzRGF0YSkge1xyXG4gICAgICBkYXRhW2tleV0gPSBjb21wW2tleV07XHJcbiAgICB9XHJcbiAgICAvLyBldmVudHMuXHJcbiAgICAvLyBleHRyYWN0IGxpc3RlbmVycyBhbmQgcGFzcyB0aGVtIGRpcmVjdGx5IHRvIHRoZSB0cmFuc2l0aW9uIG1ldGhvZHNcclxuICAgIHZhciBsaXN0ZW5lcnMgPSBvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XHJcbiAgICBmb3IgKHZhciBrZXkkMSBpbiBsaXN0ZW5lcnMpIHtcclxuICAgICAgZGF0YVtjYW1lbGl6ZShrZXkkMSldID0gbGlzdGVuZXJzW2tleSQxXTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZCkge1xyXG4gICAgaWYgKC9cXGQta2VlcC1hbGl2ZSQvLnRlc3QocmF3Q2hpbGQudGFnKSkge1xyXG4gICAgICByZXR1cm4gaCgna2VlcC1hbGl2ZScsIHtcclxuICAgICAgICBwcm9wczogcmF3Q2hpbGQuY29tcG9uZW50T3B0aW9ucy5wcm9wc0RhdGFcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhc1BhcmVudFRyYW5zaXRpb24odm5vZGUpIHtcclxuICAgIHdoaWxlICgodm5vZGUgPSB2bm9kZS5wYXJlbnQpKSB7XHJcbiAgICAgIGlmICh2bm9kZS5kYXRhLnRyYW5zaXRpb24pIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1NhbWVDaGlsZChjaGlsZCwgb2xkQ2hpbGQpIHtcclxuICAgIHJldHVybiBvbGRDaGlsZC5rZXkgPT09IGNoaWxkLmtleSAmJiBvbGRDaGlsZC50YWcgPT09IGNoaWxkLnRhZ1xyXG4gIH1cclxuXHJcbiAgdmFyIFRyYW5zaXRpb24gPSB7XHJcbiAgICBuYW1lOiAndHJhbnNpdGlvbicsXHJcbiAgICBwcm9wczogdHJhbnNpdGlvblByb3BzLFxyXG4gICAgYWJzdHJhY3Q6IHRydWUsXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCkge1xyXG4gICAgICB2YXIgdGhpcyQxID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQ7XHJcbiAgICAgIGlmICghY2hpbGRyZW4pIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZmlsdGVyIG91dCB0ZXh0IG5vZGVzIChwb3NzaWJsZSB3aGl0ZXNwYWNlcylcclxuICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudGFnIHx8IGlzQXN5bmNQbGFjZWhvbGRlcihjKTsgfSk7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB3YXJuIG11bHRpcGxlIGVsZW1lbnRzXHJcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgICc8dHJhbnNpdGlvbj4gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIHNpbmdsZSBlbGVtZW50LiBVc2UgJyArXHJcbiAgICAgICAgICAnPHRyYW5zaXRpb24tZ3JvdXA+IGZvciBsaXN0cy4nLFxyXG4gICAgICAgICAgdGhpcy4kcGFyZW50XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG1vZGUgPSB0aGlzLm1vZGU7XHJcblxyXG4gICAgICAvLyB3YXJuIGludmFsaWQgbW9kZVxyXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgICBtb2RlICYmIG1vZGUgIT09ICdpbi1vdXQnICYmIG1vZGUgIT09ICdvdXQtaW4nXHJcbiAgICAgICkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAnaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJyArIG1vZGUsXHJcbiAgICAgICAgICB0aGlzLiRwYXJlbnRcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcmF3Q2hpbGQgPSBjaGlsZHJlblswXTtcclxuXHJcbiAgICAgIC8vIGlmIHRoaXMgaXMgYSBjb21wb25lbnQgcm9vdCBub2RlIGFuZCB0aGUgY29tcG9uZW50J3NcclxuICAgICAgLy8gcGFyZW50IGNvbnRhaW5lciBub2RlIGFsc28gaGFzIHRyYW5zaXRpb24sIHNraXAuXHJcbiAgICAgIGlmIChoYXNQYXJlbnRUcmFuc2l0aW9uKHRoaXMuJHZub2RlKSkge1xyXG4gICAgICAgIHJldHVybiByYXdDaGlsZFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBhcHBseSB0cmFuc2l0aW9uIGRhdGEgdG8gY2hpbGRcclxuICAgICAgLy8gdXNlIGdldFJlYWxDaGlsZCgpIHRvIGlnbm9yZSBhYnN0cmFjdCBjb21wb25lbnRzIGUuZy4ga2VlcC1hbGl2ZVxyXG4gICAgICB2YXIgY2hpbGQgPSBnZXRSZWFsQ2hpbGQocmF3Q2hpbGQpO1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKCFjaGlsZCkge1xyXG4gICAgICAgIHJldHVybiByYXdDaGlsZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fbGVhdmluZykge1xyXG4gICAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZW5zdXJlIGEga2V5IHRoYXQgaXMgdW5pcXVlIHRvIHRoZSB2bm9kZSB0eXBlIGFuZCB0byB0aGlzIHRyYW5zaXRpb25cclxuICAgICAgLy8gY29tcG9uZW50IGluc3RhbmNlLiBUaGlzIGtleSB3aWxsIGJlIHVzZWQgdG8gcmVtb3ZlIHBlbmRpbmcgbGVhdmluZyBub2Rlc1xyXG4gICAgICAvLyBkdXJpbmcgZW50ZXJpbmcuXHJcbiAgICAgIHZhciBpZCA9IFwiX190cmFuc2l0aW9uLVwiICsgKHRoaXMuX3VpZCkgKyBcIi1cIjtcclxuICAgICAgY2hpbGQua2V5ID0gY2hpbGQua2V5ID09IG51bGxcclxuICAgICAgICA/IGNoaWxkLmlzQ29tbWVudFxyXG4gICAgICAgICAgPyBpZCArICdjb21tZW50J1xyXG4gICAgICAgICAgOiBpZCArIGNoaWxkLnRhZ1xyXG4gICAgICAgIDogaXNQcmltaXRpdmUoY2hpbGQua2V5KVxyXG4gICAgICAgICAgPyAoU3RyaW5nKGNoaWxkLmtleSkuaW5kZXhPZihpZCkgPT09IDAgPyBjaGlsZC5rZXkgOiBpZCArIGNoaWxkLmtleSlcclxuICAgICAgICAgIDogY2hpbGQua2V5O1xyXG5cclxuICAgICAgdmFyIGRhdGEgPSAoY2hpbGQuZGF0YSB8fCAoY2hpbGQuZGF0YSA9IHt9KSkudHJhbnNpdGlvbiA9IGV4dHJhY3RUcmFuc2l0aW9uRGF0YSh0aGlzKTtcclxuICAgICAgdmFyIG9sZFJhd0NoaWxkID0gdGhpcy5fdm5vZGU7XHJcbiAgICAgIHZhciBvbGRDaGlsZCA9IGdldFJlYWxDaGlsZChvbGRSYXdDaGlsZCk7XHJcblxyXG4gICAgICAvLyBtYXJrIHYtc2hvd1xyXG4gICAgICAvLyBzbyB0aGF0IHRoZSB0cmFuc2l0aW9uIG1vZHVsZSBjYW4gaGFuZCBvdmVyIHRoZSBjb250cm9sIHRvIHRoZSBkaXJlY3RpdmVcclxuICAgICAgaWYgKGNoaWxkLmRhdGEuZGlyZWN0aXZlcyAmJiBjaGlsZC5kYXRhLmRpcmVjdGl2ZXMuc29tZShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5uYW1lID09PSAnc2hvdyc7IH0pKSB7XHJcbiAgICAgICAgY2hpbGQuZGF0YS5zaG93ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIG9sZENoaWxkICYmXHJcbiAgICAgICAgb2xkQ2hpbGQuZGF0YSAmJlxyXG4gICAgICAgICFpc1NhbWVDaGlsZChjaGlsZCwgb2xkQ2hpbGQpICYmXHJcbiAgICAgICAgIWlzQXN5bmNQbGFjZWhvbGRlcihvbGRDaGlsZCkgJiZcclxuICAgICAgICAvLyAjNjY4NyBjb21wb25lbnQgcm9vdCBpcyBhIGNvbW1lbnQgbm9kZVxyXG4gICAgICAgICEob2xkQ2hpbGQuY29tcG9uZW50SW5zdGFuY2UgJiYgb2xkQ2hpbGQuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlLmlzQ29tbWVudClcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gcmVwbGFjZSBvbGQgY2hpbGQgdHJhbnNpdGlvbiBkYXRhIHdpdGggZnJlc2ggb25lXHJcbiAgICAgICAgLy8gaW1wb3J0YW50IGZvciBkeW5hbWljIHRyYW5zaXRpb25zIVxyXG4gICAgICAgIHZhciBvbGREYXRhID0gb2xkQ2hpbGQuZGF0YS50cmFuc2l0aW9uID0gZXh0ZW5kKHt9LCBkYXRhKTtcclxuICAgICAgICAvLyBoYW5kbGUgdHJhbnNpdGlvbiBtb2RlXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdvdXQtaW4nKSB7XHJcbiAgICAgICAgICAvLyByZXR1cm4gcGxhY2Vob2xkZXIgbm9kZSBhbmQgcXVldWUgdXBkYXRlIHdoZW4gbGVhdmUgZmluaXNoZXNcclxuICAgICAgICAgIHRoaXMuX2xlYXZpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgbWVyZ2VWTm9kZUhvb2sob2xkRGF0YSwgJ2FmdGVyTGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMkMS5fbGVhdmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzJDEuJGZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcclxuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdpbi1vdXQnKSB7XHJcbiAgICAgICAgICBpZiAoaXNBc3luY1BsYWNlaG9sZGVyKGNoaWxkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2xkUmF3Q2hpbGRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBkZWxheWVkTGVhdmU7XHJcbiAgICAgICAgICB2YXIgcGVyZm9ybUxlYXZlID0gZnVuY3Rpb24gKCkgeyBkZWxheWVkTGVhdmUoKTsgfTtcclxuICAgICAgICAgIG1lcmdlVk5vZGVIb29rKGRhdGEsICdhZnRlckVudGVyJywgcGVyZm9ybUxlYXZlKTtcclxuICAgICAgICAgIG1lcmdlVk5vZGVIb29rKGRhdGEsICdlbnRlckNhbmNlbGxlZCcsIHBlcmZvcm1MZWF2ZSk7XHJcbiAgICAgICAgICBtZXJnZVZOb2RlSG9vayhvbGREYXRhLCAnZGVsYXlMZWF2ZScsIGZ1bmN0aW9uIChsZWF2ZSkgeyBkZWxheWVkTGVhdmUgPSBsZWF2ZTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmF3Q2hpbGRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyBQcm92aWRlcyB0cmFuc2l0aW9uIHN1cHBvcnQgZm9yIGxpc3QgaXRlbXMuXHJcbiAgLy8gc3VwcG9ydHMgbW92ZSB0cmFuc2l0aW9ucyB1c2luZyB0aGUgRkxJUCB0ZWNobmlxdWUuXHJcblxyXG4gIC8vIEJlY2F1c2UgdGhlIHZkb20ncyBjaGlsZHJlbiB1cGRhdGUgYWxnb3JpdGhtIGlzIFwidW5zdGFibGVcIiAtIGkuZS5cclxuICAvLyBpdCBkb2Vzbid0IGd1YXJhbnRlZSB0aGUgcmVsYXRpdmUgcG9zaXRpb25pbmcgb2YgcmVtb3ZlZCBlbGVtZW50cyxcclxuICAvLyB3ZSBmb3JjZSB0cmFuc2l0aW9uLWdyb3VwIHRvIHVwZGF0ZSBpdHMgY2hpbGRyZW4gaW50byB0d28gcGFzc2VzOlxyXG4gIC8vIGluIHRoZSBmaXJzdCBwYXNzLCB3ZSByZW1vdmUgYWxsIG5vZGVzIHRoYXQgbmVlZCB0byBiZSByZW1vdmVkLFxyXG4gIC8vIHRyaWdnZXJpbmcgdGhlaXIgbGVhdmluZyB0cmFuc2l0aW9uOyBpbiB0aGUgc2Vjb25kIHBhc3MsIHdlIGluc2VydC9tb3ZlXHJcbiAgLy8gaW50byB0aGUgZmluYWwgZGVzaXJlZCBzdGF0ZS4gVGhpcyB3YXkgaW4gdGhlIHNlY29uZCBwYXNzIHJlbW92ZWRcclxuICAvLyBub2RlcyB3aWxsIHJlbWFpbiB3aGVyZSB0aGV5IHNob3VsZCBiZS5cclxuXHJcbiAgdmFyIHByb3BzID0gZXh0ZW5kKHtcclxuICAgIHRhZzogU3RyaW5nLFxyXG4gICAgbW92ZUNsYXNzOiBTdHJpbmdcclxuICB9LCB0cmFuc2l0aW9uUHJvcHMpO1xyXG5cclxuICBkZWxldGUgcHJvcHMubW9kZTtcclxuXHJcbiAgdmFyIFRyYW5zaXRpb25Hcm91cCA9IHtcclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoKSB7XHJcbiAgICAgIHZhciB0YWcgPSB0aGlzLnRhZyB8fCB0aGlzLiR2bm9kZS5kYXRhLnRhZyB8fCAnc3Bhbic7XHJcbiAgICAgIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICB2YXIgcHJldkNoaWxkcmVuID0gdGhpcy5wcmV2Q2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gICAgICB2YXIgcmF3Q2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdO1xyXG4gICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgIHZhciB0cmFuc2l0aW9uRGF0YSA9IGV4dHJhY3RUcmFuc2l0aW9uRGF0YSh0aGlzKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYyA9IHJhd0NoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjLnRhZykge1xyXG4gICAgICAgICAgaWYgKGMua2V5ICE9IG51bGwgJiYgU3RyaW5nKGMua2V5KS5pbmRleE9mKCdfX3ZsaXN0JykgIT09IDApIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcclxuICAgICAgICAgICAgbWFwW2Mua2V5XSA9IGNcclxuICAgICAgICAgICAgICA7IChjLmRhdGEgfHwgKGMuZGF0YSA9IHt9KSkudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25EYXRhO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG9wdHMgPSBjLmNvbXBvbmVudE9wdGlvbnM7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gb3B0cyA/IChvcHRzLkN0b3Iub3B0aW9ucy5uYW1lIHx8IG9wdHMudGFnIHx8ICcnKSA6IGMudGFnO1xyXG4gICAgICAgICAgICB3YXJuKChcIjx0cmFuc2l0aW9uLWdyb3VwPiBjaGlsZHJlbiBtdXN0IGJlIGtleWVkOiA8XCIgKyBuYW1lICsgXCI+XCIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcmV2Q2hpbGRyZW4pIHtcclxuICAgICAgICB2YXIga2VwdCA9IFtdO1xyXG4gICAgICAgIHZhciByZW1vdmVkID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgcHJldkNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcclxuICAgICAgICAgIHZhciBjJDEgPSBwcmV2Q2hpbGRyZW5baSQxXTtcclxuICAgICAgICAgIGMkMS5kYXRhLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRGF0YTtcclxuICAgICAgICAgIGMkMS5kYXRhLnBvcyA9IGMkMS5lbG0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICBpZiAobWFwW2MkMS5rZXldKSB7XHJcbiAgICAgICAgICAgIGtlcHQucHVzaChjJDEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGMkMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2VwdCA9IGgodGFnLCBudWxsLCBrZXB0KTtcclxuICAgICAgICB0aGlzLnJlbW92ZWQgPSByZW1vdmVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaCh0YWcsIG51bGwsIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuXHJcbiAgICBiZWZvcmVVcGRhdGU6IGZ1bmN0aW9uIGJlZm9yZVVwZGF0ZSgpIHtcclxuICAgICAgLy8gZm9yY2UgcmVtb3ZpbmcgcGFzc1xyXG4gICAgICB0aGlzLl9fcGF0Y2hfXyhcclxuICAgICAgICB0aGlzLl92bm9kZSxcclxuICAgICAgICB0aGlzLmtlcHQsXHJcbiAgICAgICAgZmFsc2UsIC8vIGh5ZHJhdGluZ1xyXG4gICAgICAgIHRydWUgLy8gcmVtb3ZlT25seSAoIWltcG9ydGFudCwgYXZvaWRzIHVubmVjZXNzYXJ5IG1vdmVzKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLl92bm9kZSA9IHRoaXMua2VwdDtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlZDogZnVuY3Rpb24gdXBkYXRlZCgpIHtcclxuICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcmV2Q2hpbGRyZW47XHJcbiAgICAgIHZhciBtb3ZlQ2xhc3MgPSB0aGlzLm1vdmVDbGFzcyB8fCAoKHRoaXMubmFtZSB8fCAndicpICsgJy1tb3ZlJyk7XHJcbiAgICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoIHx8ICF0aGlzLmhhc01vdmUoY2hpbGRyZW5bMF0uZWxtLCBtb3ZlQ2xhc3MpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHdlIGRpdmlkZSB0aGUgd29yayBpbnRvIHRocmVlIGxvb3BzIHRvIGF2b2lkIG1peGluZyBET00gcmVhZHMgYW5kIHdyaXRlc1xyXG4gICAgICAvLyBpbiBlYWNoIGl0ZXJhdGlvbiAtIHdoaWNoIGhlbHBzIHByZXZlbnQgbGF5b3V0IHRocmFzaGluZy5cclxuICAgICAgY2hpbGRyZW4uZm9yRWFjaChjYWxsUGVuZGluZ0Nicyk7XHJcbiAgICAgIGNoaWxkcmVuLmZvckVhY2gocmVjb3JkUG9zaXRpb24pO1xyXG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKGFwcGx5VHJhbnNsYXRpb24pO1xyXG5cclxuICAgICAgLy8gZm9yY2UgcmVmbG93IHRvIHB1dCBldmVyeXRoaW5nIGluIHBvc2l0aW9uXHJcbiAgICAgIC8vIGFzc2lnbiB0byB0aGlzIHRvIGF2b2lkIGJlaW5nIHJlbW92ZWQgaW4gdHJlZS1zaGFraW5nXHJcbiAgICAgIC8vICRmbG93LWRpc2FibGUtbGluZVxyXG4gICAgICB0aGlzLl9yZWZsb3cgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICBpZiAoYy5kYXRhLm1vdmVkKSB7XHJcbiAgICAgICAgICB2YXIgZWwgPSBjLmVsbTtcclxuICAgICAgICAgIHZhciBzID0gZWwuc3R5bGU7XHJcbiAgICAgICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIG1vdmVDbGFzcyk7XHJcbiAgICAgICAgICBzLnRyYW5zZm9ybSA9IHMuV2Via2l0VHJhbnNmb3JtID0gcy50cmFuc2l0aW9uRHVyYXRpb24gPSAnJztcclxuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZEV2ZW50LCBlbC5fbW92ZUNiID0gZnVuY3Rpb24gY2IoZSkge1xyXG4gICAgICAgICAgICBpZiAoIWUgfHwgL3RyYW5zZm9ybSQvLnRlc3QoZS5wcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kRXZlbnQsIGNiKTtcclxuICAgICAgICAgICAgICBlbC5fbW92ZUNiID0gbnVsbDtcclxuICAgICAgICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIG1vdmVDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaGFzTW92ZTogZnVuY3Rpb24gaGFzTW92ZShlbCwgbW92ZUNsYXNzKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKCFoYXNUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKHRoaXMuX2hhc01vdmUpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLl9oYXNNb3ZlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERldGVjdCB3aGV0aGVyIGFuIGVsZW1lbnQgd2l0aCB0aGUgbW92ZSBjbGFzcyBhcHBsaWVkIGhhc1xyXG4gICAgICAgIC8vIENTUyB0cmFuc2l0aW9ucy4gU2luY2UgdGhlIGVsZW1lbnQgbWF5IGJlIGluc2lkZSBhbiBlbnRlcmluZ1xyXG4gICAgICAgIC8vIHRyYW5zaXRpb24gYXQgdGhpcyB2ZXJ5IG1vbWVudCwgd2UgbWFrZSBhIGNsb25lIG9mIGl0IGFuZCByZW1vdmVcclxuICAgICAgICAvLyBhbGwgb3RoZXIgdHJhbnNpdGlvbiBjbGFzc2VzIGFwcGxpZWQgdG8gZW5zdXJlIG9ubHkgdGhlIG1vdmUgY2xhc3NcclxuICAgICAgICAvLyBpcyBhcHBsaWVkLlxyXG4gICAgICAgIHZhciBjbG9uZSA9IGVsLmNsb25lTm9kZSgpO1xyXG4gICAgICAgIGlmIChlbC5fdHJhbnNpdGlvbkNsYXNzZXMpIHtcclxuICAgICAgICAgIGVsLl90cmFuc2l0aW9uQ2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjbHMpIHsgcmVtb3ZlQ2xhc3MoY2xvbmUsIGNscyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRDbGFzcyhjbG9uZSwgbW92ZUNsYXNzKTtcclxuICAgICAgICBjbG9uZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgICB2YXIgaW5mbyA9IGdldFRyYW5zaXRpb25JbmZvKGNsb25lKTtcclxuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZChjbG9uZSk7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9oYXNNb3ZlID0gaW5mby5oYXNUcmFuc2Zvcm0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNhbGxQZW5kaW5nQ2JzKGMpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGMuZWxtLl9tb3ZlQ2IpIHtcclxuICAgICAgYy5lbG0uX21vdmVDYigpO1xyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoYy5lbG0uX2VudGVyQ2IpIHtcclxuICAgICAgYy5lbG0uX2VudGVyQ2IoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlY29yZFBvc2l0aW9uKGMpIHtcclxuICAgIGMuZGF0YS5uZXdQb3MgPSBjLmVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGx5VHJhbnNsYXRpb24oYykge1xyXG4gICAgdmFyIG9sZFBvcyA9IGMuZGF0YS5wb3M7XHJcbiAgICB2YXIgbmV3UG9zID0gYy5kYXRhLm5ld1BvcztcclxuICAgIHZhciBkeCA9IG9sZFBvcy5sZWZ0IC0gbmV3UG9zLmxlZnQ7XHJcbiAgICB2YXIgZHkgPSBvbGRQb3MudG9wIC0gbmV3UG9zLnRvcDtcclxuICAgIGlmIChkeCB8fCBkeSkge1xyXG4gICAgICBjLmRhdGEubW92ZWQgPSB0cnVlO1xyXG4gICAgICB2YXIgcyA9IGMuZWxtLnN0eWxlO1xyXG4gICAgICBzLnRyYW5zZm9ybSA9IHMuV2Via2l0VHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyBkeCArIFwicHgsXCIgKyBkeSArIFwicHgpXCI7XHJcbiAgICAgIHMudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBzJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBwbGF0Zm9ybUNvbXBvbmVudHMgPSB7XHJcbiAgICBUcmFuc2l0aW9uOiBUcmFuc2l0aW9uLFxyXG4gICAgVHJhbnNpdGlvbkdyb3VwOiBUcmFuc2l0aW9uR3JvdXBcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyBpbnN0YWxsIHBsYXRmb3JtIHNwZWNpZmljIHV0aWxzXHJcbiAgVnVlLmNvbmZpZy5tdXN0VXNlUHJvcCA9IG11c3RVc2VQcm9wO1xyXG4gIFZ1ZS5jb25maWcuaXNSZXNlcnZlZFRhZyA9IGlzUmVzZXJ2ZWRUYWc7XHJcbiAgVnVlLmNvbmZpZy5pc1Jlc2VydmVkQXR0ciA9IGlzUmVzZXJ2ZWRBdHRyO1xyXG4gIFZ1ZS5jb25maWcuZ2V0VGFnTmFtZXNwYWNlID0gZ2V0VGFnTmFtZXNwYWNlO1xyXG4gIFZ1ZS5jb25maWcuaXNVbmtub3duRWxlbWVudCA9IGlzVW5rbm93bkVsZW1lbnQ7XHJcblxyXG4gIC8vIGluc3RhbGwgcGxhdGZvcm0gcnVudGltZSBkaXJlY3RpdmVzICYgY29tcG9uZW50c1xyXG4gIGV4dGVuZChWdWUub3B0aW9ucy5kaXJlY3RpdmVzLCBwbGF0Zm9ybURpcmVjdGl2ZXMpO1xyXG4gIGV4dGVuZChWdWUub3B0aW9ucy5jb21wb25lbnRzLCBwbGF0Zm9ybUNvbXBvbmVudHMpO1xyXG5cclxuICAvLyBpbnN0YWxsIHBsYXRmb3JtIHBhdGNoIGZ1bmN0aW9uXHJcbiAgVnVlLnByb3RvdHlwZS5fX3BhdGNoX18gPSBpbkJyb3dzZXIgPyBwYXRjaCA6IG5vb3A7XHJcblxyXG4gIC8vIHB1YmxpYyBtb3VudCBtZXRob2RcclxuICBWdWUucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uIChcclxuICAgIGVsLFxyXG4gICAgaHlkcmF0aW5nXHJcbiAgKSB7XHJcbiAgICBlbCA9IGVsICYmIGluQnJvd3NlciA/IHF1ZXJ5KGVsKSA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBtb3VudENvbXBvbmVudCh0aGlzLCBlbCwgaHlkcmF0aW5nKVxyXG4gIH07XHJcblxyXG4gIC8vIGRldnRvb2xzIGdsb2JhbCBob29rXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICBpZiAoaW5Ccm93c2VyKSB7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGNvbmZpZy5kZXZ0b29scykge1xyXG4gICAgICAgIGlmIChkZXZ0b29scykge1xyXG4gICAgICAgICAgZGV2dG9vbHMuZW1pdCgnaW5pdCcsIFZ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXHJcbiAgICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICd0ZXN0JyAmJlxyXG4gICAgICAgICAgaXNDaHJvbWVcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGVbY29uc29sZS5pbmZvID8gJ2luZm8nIDogJ2xvZyddKFxyXG4gICAgICAgICAgICAnRG93bmxvYWQgdGhlIFZ1ZSBEZXZ0b29scyBleHRlbnNpb24gZm9yIGEgYmV0dGVyIGRldmVsb3BtZW50IGV4cGVyaWVuY2U6XFxuJyArXHJcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLWRldnRvb2xzJ1xyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXHJcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAndGVzdCcgJiZcclxuICAgICAgICBjb25maWcucHJvZHVjdGlvblRpcCAhPT0gZmFsc2UgJiZcclxuICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc29sZVtjb25zb2xlLmluZm8gPyAnaW5mbycgOiAnbG9nJ10oXHJcbiAgICAgICAgICBcIllvdSBhcmUgcnVubmluZyBWdWUgaW4gZGV2ZWxvcG1lbnQgbW9kZS5cXG5cIiArXHJcbiAgICAgICAgICBcIk1ha2Ugc3VyZSB0byB0dXJuIG9uIHByb2R1Y3Rpb24gbW9kZSB3aGVuIGRlcGxveWluZyBmb3IgcHJvZHVjdGlvbi5cXG5cIiArXHJcbiAgICAgICAgICBcIlNlZSBtb3JlIHRpcHMgYXQgaHR0cHM6Ly92dWVqcy5vcmcvZ3VpZGUvZGVwbG95bWVudC5odG1sXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9LCAwKTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgZGVmYXVsdFRhZ1JFID0gL1xce1xceygoPzoufFxcbikrPylcXH1cXH0vZztcclxuICB2YXIgcmVnZXhFc2NhcGVSRSA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2c7XHJcblxyXG4gIHZhciBidWlsZFJlZ2V4ID0gY2FjaGVkKGZ1bmN0aW9uIChkZWxpbWl0ZXJzKSB7XHJcbiAgICB2YXIgb3BlbiA9IGRlbGltaXRlcnNbMF0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XHJcbiAgICB2YXIgY2xvc2UgPSBkZWxpbWl0ZXJzWzFdLnJlcGxhY2UocmVnZXhFc2NhcGVSRSwgJ1xcXFwkJicpO1xyXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAob3BlbiArICcoKD86LnxcXFxcbikrPyknICsgY2xvc2UsICdnJylcclxuICB9KTtcclxuXHJcblxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVRleHQoXHJcbiAgICB0ZXh0LFxyXG4gICAgZGVsaW1pdGVyc1xyXG4gICkge1xyXG4gICAgdmFyIHRhZ1JFID0gZGVsaW1pdGVycyA/IGJ1aWxkUmVnZXgoZGVsaW1pdGVycykgOiBkZWZhdWx0VGFnUkU7XHJcbiAgICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB2YXIgdG9rZW5zID0gW107XHJcbiAgICB2YXIgcmF3VG9rZW5zID0gW107XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gdGFnUkUubGFzdEluZGV4ID0gMDtcclxuICAgIHZhciBtYXRjaCwgaW5kZXgsIHRva2VuVmFsdWU7XHJcbiAgICB3aGlsZSAoKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkpIHtcclxuICAgICAgaW5kZXggPSBtYXRjaC5pbmRleDtcclxuICAgICAgLy8gcHVzaCB0ZXh0IHRva2VuXHJcbiAgICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xyXG4gICAgICAgIHJhd1Rva2Vucy5wdXNoKHRva2VuVmFsdWUgPSB0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpKTtcclxuICAgICAgICB0b2tlbnMucHVzaChKU09OLnN0cmluZ2lmeSh0b2tlblZhbHVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gdGFnIHRva2VuXHJcbiAgICAgIHZhciBleHAgPSBwYXJzZUZpbHRlcnMobWF0Y2hbMV0udHJpbSgpKTtcclxuICAgICAgdG9rZW5zLnB1c2goKFwiX3MoXCIgKyBleHAgKyBcIilcIikpO1xyXG4gICAgICByYXdUb2tlbnMucHVzaCh7ICdAYmluZGluZyc6IGV4cCB9KTtcclxuICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcclxuICAgICAgcmF3VG9rZW5zLnB1c2godG9rZW5WYWx1ZSA9IHRleHQuc2xpY2UobGFzdEluZGV4KSk7XHJcbiAgICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRva2VuVmFsdWUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGV4cHJlc3Npb246IHRva2Vucy5qb2luKCcrJyksXHJcbiAgICAgIHRva2VuczogcmF3VG9rZW5zXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gdHJhbnNmb3JtTm9kZShlbCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHdhcm4gPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XHJcbiAgICB2YXIgc3RhdGljQ2xhc3MgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnY2xhc3MnKTtcclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBzdGF0aWNDbGFzcykge1xyXG4gICAgICB2YXIgcmVzID0gcGFyc2VUZXh0KHN0YXRpY0NsYXNzLCBvcHRpb25zLmRlbGltaXRlcnMpO1xyXG4gICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgIFwiY2xhc3M9XFxcIlwiICsgc3RhdGljQ2xhc3MgKyBcIlxcXCI6IFwiICtcclxuICAgICAgICAgICdJbnRlcnBvbGF0aW9uIGluc2lkZSBhdHRyaWJ1dGVzIGhhcyBiZWVuIHJlbW92ZWQuICcgK1xyXG4gICAgICAgICAgJ1VzZSB2LWJpbmQgb3IgdGhlIGNvbG9uIHNob3J0aGFuZCBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgJyArXHJcbiAgICAgICAgICAnaW5zdGVhZCBvZiA8ZGl2IGNsYXNzPVwie3sgdmFsIH19XCI+LCB1c2UgPGRpdiA6Y2xhc3M9XCJ2YWxcIj4uJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzdGF0aWNDbGFzcykge1xyXG4gICAgICBlbC5zdGF0aWNDbGFzcyA9IEpTT04uc3RyaW5naWZ5KHN0YXRpY0NsYXNzKTtcclxuICAgIH1cclxuICAgIHZhciBjbGFzc0JpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ2NsYXNzJywgZmFsc2UgLyogZ2V0U3RhdGljICovKTtcclxuICAgIGlmIChjbGFzc0JpbmRpbmcpIHtcclxuICAgICAgZWwuY2xhc3NCaW5kaW5nID0gY2xhc3NCaW5kaW5nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuRGF0YShlbCkge1xyXG4gICAgdmFyIGRhdGEgPSAnJztcclxuICAgIGlmIChlbC5zdGF0aWNDbGFzcykge1xyXG4gICAgICBkYXRhICs9IFwic3RhdGljQ2xhc3M6XCIgKyAoZWwuc3RhdGljQ2xhc3MpICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuY2xhc3NCaW5kaW5nKSB7XHJcbiAgICAgIGRhdGEgKz0gXCJjbGFzczpcIiArIChlbC5jbGFzc0JpbmRpbmcpICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgdmFyIGtsYXNzJDEgPSB7XHJcbiAgICBzdGF0aWNLZXlzOiBbJ3N0YXRpY0NsYXNzJ10sXHJcbiAgICB0cmFuc2Zvcm1Ob2RlOiB0cmFuc2Zvcm1Ob2RlLFxyXG4gICAgZ2VuRGF0YTogZ2VuRGF0YVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybU5vZGUkMShlbCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHdhcm4gPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XHJcbiAgICB2YXIgc3RhdGljU3R5bGUgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnc3R5bGUnKTtcclxuICAgIGlmIChzdGF0aWNTdHlsZSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAge1xyXG4gICAgICAgIHZhciByZXMgPSBwYXJzZVRleHQoc3RhdGljU3R5bGUsIG9wdGlvbnMuZGVsaW1pdGVycyk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgXCJzdHlsZT1cXFwiXCIgKyBzdGF0aWNTdHlsZSArIFwiXFxcIjogXCIgK1xyXG4gICAgICAgICAgICAnSW50ZXJwb2xhdGlvbiBpbnNpZGUgYXR0cmlidXRlcyBoYXMgYmVlbiByZW1vdmVkLiAnICtcclxuICAgICAgICAgICAgJ1VzZSB2LWJpbmQgb3IgdGhlIGNvbG9uIHNob3J0aGFuZCBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgJyArXHJcbiAgICAgICAgICAgICdpbnN0ZWFkIG9mIDxkaXYgc3R5bGU9XCJ7eyB2YWwgfX1cIj4sIHVzZSA8ZGl2IDpzdHlsZT1cInZhbFwiPi4nXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbC5zdGF0aWNTdHlsZSA9IEpTT04uc3RyaW5naWZ5KHBhcnNlU3R5bGVUZXh0KHN0YXRpY1N0eWxlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHN0eWxlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnc3R5bGUnLCBmYWxzZSAvKiBnZXRTdGF0aWMgKi8pO1xyXG4gICAgaWYgKHN0eWxlQmluZGluZykge1xyXG4gICAgICBlbC5zdHlsZUJpbmRpbmcgPSBzdHlsZUJpbmRpbmc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5EYXRhJDEoZWwpIHtcclxuICAgIHZhciBkYXRhID0gJyc7XHJcbiAgICBpZiAoZWwuc3RhdGljU3R5bGUpIHtcclxuICAgICAgZGF0YSArPSBcInN0YXRpY1N0eWxlOlwiICsgKGVsLnN0YXRpY1N0eWxlKSArIFwiLFwiO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsLnN0eWxlQmluZGluZykge1xyXG4gICAgICBkYXRhICs9IFwic3R5bGU6KFwiICsgKGVsLnN0eWxlQmluZGluZykgKyBcIiksXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgdmFyIHN0eWxlJDEgPSB7XHJcbiAgICBzdGF0aWNLZXlzOiBbJ3N0YXRpY1N0eWxlJ10sXHJcbiAgICB0cmFuc2Zvcm1Ob2RlOiB0cmFuc2Zvcm1Ob2RlJDEsXHJcbiAgICBnZW5EYXRhOiBnZW5EYXRhJDFcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgZGVjb2RlcjtcclxuXHJcbiAgdmFyIGhlID0ge1xyXG4gICAgZGVjb2RlOiBmdW5jdGlvbiBkZWNvZGUoaHRtbCkge1xyXG4gICAgICBkZWNvZGVyID0gZGVjb2RlciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgZGVjb2Rlci5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICByZXR1cm4gZGVjb2Rlci50ZXh0Q29udGVudFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBpc1VuYXJ5VGFnID0gbWFrZU1hcChcclxuICAgICdhcmVhLGJhc2UsYnIsY29sLGVtYmVkLGZyYW1lLGhyLGltZyxpbnB1dCxpc2luZGV4LGtleWdlbiwnICtcclxuICAgICdsaW5rLG1ldGEscGFyYW0sc291cmNlLHRyYWNrLHdicidcclxuICApO1xyXG5cclxuICAvLyBFbGVtZW50cyB0aGF0IHlvdSBjYW4sIGludGVudGlvbmFsbHksIGxlYXZlIG9wZW5cclxuICAvLyAoYW5kIHdoaWNoIGNsb3NlIHRoZW1zZWx2ZXMpXHJcbiAgdmFyIGNhbkJlTGVmdE9wZW5UYWcgPSBtYWtlTWFwKFxyXG4gICAgJ2NvbGdyb3VwLGRkLGR0LGxpLG9wdGlvbnMscCx0ZCx0Zm9vdCx0aCx0aGVhZCx0cixzb3VyY2UnXHJcbiAgKTtcclxuXHJcbiAgLy8gSFRNTDUgdGFncyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmRpY2VzLmh0bWwjZWxlbWVudHMtM1xyXG4gIC8vIFBocmFzaW5nIENvbnRlbnQgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZG9tLmh0bWwjcGhyYXNpbmctY29udGVudFxyXG4gIHZhciBpc05vblBocmFzaW5nVGFnID0gbWFrZU1hcChcclxuICAgICdhZGRyZXNzLGFydGljbGUsYXNpZGUsYmFzZSxibG9ja3F1b3RlLGJvZHksY2FwdGlvbixjb2wsY29sZ3JvdXAsZGQsJyArXHJcbiAgICAnZGV0YWlscyxkaWFsb2csZGl2LGRsLGR0LGZpZWxkc2V0LGZpZ2NhcHRpb24sZmlndXJlLGZvb3Rlcixmb3JtLCcgK1xyXG4gICAgJ2gxLGgyLGgzLGg0LGg1LGg2LGhlYWQsaGVhZGVyLGhncm91cCxocixodG1sLGxlZ2VuZCxsaSxtZW51aXRlbSxtZXRhLCcgK1xyXG4gICAgJ29wdGdyb3VwLG9wdGlvbixwYXJhbSxycCxydCxzb3VyY2Usc3R5bGUsc3VtbWFyeSx0Ym9keSx0ZCx0Zm9vdCx0aCx0aGVhZCwnICtcclxuICAgICd0aXRsZSx0cix0cmFjaydcclxuICApO1xyXG5cclxuICAvKipcclxuICAgKiBOb3QgdHlwZS1jaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBpdCdzIG1vc3RseSB2ZW5kb3IgY29kZS5cclxuICAgKi9cclxuXHJcbiAgLyohXHJcbiAgICogSFRNTCBQYXJzZXIgQnkgSm9obiBSZXNpZyAoZWpvaG4ub3JnKVxyXG4gICAqIE1vZGlmaWVkIGJ5IEp1cml5IFwia2FuZ2F4XCIgWmF5dHNldlxyXG4gICAqIE9yaWdpbmFsIGNvZGUgYnkgRXJpayBBcnZpZHNzb24sIE1vemlsbGEgUHVibGljIExpY2Vuc2VcclxuICAgKiBodHRwOi8vZXJpay5lYWUubmV0L3NpbXBsZWh0bWxwYXJzZXIvc2ltcGxlaHRtbHBhcnNlci5qc1xyXG4gICAqL1xyXG5cclxuICAvLyBSZWd1bGFyIEV4cHJlc3Npb25zIGZvciBwYXJzaW5nIHRhZ3MgYW5kIGF0dHJpYnV0ZXNcclxuICB2YXIgYXR0cmlidXRlID0gL15cXHMqKFteXFxzXCInPD5cXC89XSspKD86XFxzKig9KVxccyooPzpcIihbXlwiXSopXCIrfCcoW14nXSopJyt8KFteXFxzXCInPTw+YF0rKSkpPy87XHJcbiAgLy8gY291bGQgdXNlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi8xOTk5L1JFQy14bWwtbmFtZXMtMTk5OTAxMTQvI05ULVFOYW1lXHJcbiAgLy8gYnV0IGZvciBWdWUgdGVtcGxhdGVzIHdlIGNhbiBlbmZvcmNlIGEgc2ltcGxlIGNoYXJzZXRcclxuICB2YXIgbmNuYW1lID0gJ1thLXpBLVpfXVtcXFxcd1xcXFwtXFxcXC5dKic7XHJcbiAgdmFyIHFuYW1lQ2FwdHVyZSA9IFwiKCg/OlwiICsgbmNuYW1lICsgXCJcXFxcOik/XCIgKyBuY25hbWUgKyBcIilcIjtcclxuICB2YXIgc3RhcnRUYWdPcGVuID0gbmV3IFJlZ0V4cCgoXCJePFwiICsgcW5hbWVDYXB0dXJlKSk7XHJcbiAgdmFyIHN0YXJ0VGFnQ2xvc2UgPSAvXlxccyooXFwvPyk+LztcclxuICB2YXIgZW5kVGFnID0gbmV3IFJlZ0V4cCgoXCJePFxcXFwvXCIgKyBxbmFtZUNhcHR1cmUgKyBcIltePl0qPlwiKSk7XHJcbiAgdmFyIGRvY3R5cGUgPSAvXjwhRE9DVFlQRSBbXj5dKz4vaTtcclxuICAvLyAjNzI5ODogZXNjYXBlIC0gdG8gYXZvaWQgYmVpbmcgcGFzZWQgYXMgSFRNTCBjb21tZW50IHdoZW4gaW5saW5lZCBpbiBwYWdlXHJcbiAgdmFyIGNvbW1lbnQgPSAvXjwhXFwtLS87XHJcbiAgdmFyIGNvbmRpdGlvbmFsQ29tbWVudCA9IC9ePCFcXFsvO1xyXG5cclxuICB2YXIgSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiA9IGZhbHNlO1xyXG4gICd4Jy5yZXBsYWNlKC94KC4pPy9nLCBmdW5jdGlvbiAobSwgZykge1xyXG4gICAgSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiA9IGcgPT09ICcnO1xyXG4gIH0pO1xyXG5cclxuICAvLyBTcGVjaWFsIEVsZW1lbnRzIChjYW4gY29udGFpbiBhbnl0aGluZylcclxuICB2YXIgaXNQbGFpblRleHRFbGVtZW50ID0gbWFrZU1hcCgnc2NyaXB0LHN0eWxlLHRleHRhcmVhJywgdHJ1ZSk7XHJcbiAgdmFyIHJlQ2FjaGUgPSB7fTtcclxuXHJcbiAgdmFyIGRlY29kaW5nTWFwID0ge1xyXG4gICAgJyZsdDsnOiAnPCcsXHJcbiAgICAnJmd0Oyc6ICc+JyxcclxuICAgICcmcXVvdDsnOiAnXCInLFxyXG4gICAgJyZhbXA7JzogJyYnLFxyXG4gICAgJyYjMTA7JzogJ1xcbicsXHJcbiAgICAnJiM5Oyc6ICdcXHQnXHJcbiAgfTtcclxuICB2YXIgZW5jb2RlZEF0dHIgPSAvJig/Omx0fGd0fHF1b3R8YW1wKTsvZztcclxuICB2YXIgZW5jb2RlZEF0dHJXaXRoTmV3TGluZXMgPSAvJig/Omx0fGd0fHF1b3R8YW1wfCMxMHwjOSk7L2c7XHJcblxyXG4gIC8vICM1OTkyXHJcbiAgdmFyIGlzSWdub3JlTmV3bGluZVRhZyA9IG1ha2VNYXAoJ3ByZSx0ZXh0YXJlYScsIHRydWUpO1xyXG4gIHZhciBzaG91bGRJZ25vcmVGaXJzdE5ld2xpbmUgPSBmdW5jdGlvbiAodGFnLCBodG1sKSB7IHJldHVybiB0YWcgJiYgaXNJZ25vcmVOZXdsaW5lVGFnKHRhZykgJiYgaHRtbFswXSA9PT0gJ1xcbic7IH07XHJcblxyXG4gIGZ1bmN0aW9uIGRlY29kZUF0dHIodmFsdWUsIHNob3VsZERlY29kZU5ld2xpbmVzKSB7XHJcbiAgICB2YXIgcmUgPSBzaG91bGREZWNvZGVOZXdsaW5lcyA/IGVuY29kZWRBdHRyV2l0aE5ld0xpbmVzIDogZW5jb2RlZEF0dHI7XHJcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZShyZSwgZnVuY3Rpb24gKG1hdGNoKSB7IHJldHVybiBkZWNvZGluZ01hcFttYXRjaF07IH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUhUTUwoaHRtbCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHN0YWNrID0gW107XHJcbiAgICB2YXIgZXhwZWN0SFRNTCA9IG9wdGlvbnMuZXhwZWN0SFRNTDtcclxuICAgIHZhciBpc1VuYXJ5VGFnJCQxID0gb3B0aW9ucy5pc1VuYXJ5VGFnIHx8IG5vO1xyXG4gICAgdmFyIGNhbkJlTGVmdE9wZW5UYWckJDEgPSBvcHRpb25zLmNhbkJlTGVmdE9wZW5UYWcgfHwgbm87XHJcbiAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgdmFyIGxhc3QsIGxhc3RUYWc7XHJcbiAgICB3aGlsZSAoaHRtbCkge1xyXG4gICAgICBsYXN0ID0gaHRtbDtcclxuICAgICAgLy8gTWFrZSBzdXJlIHdlJ3JlIG5vdCBpbiBhIHBsYWludGV4dCBjb250ZW50IGVsZW1lbnQgbGlrZSBzY3JpcHQvc3R5bGVcclxuICAgICAgaWYgKCFsYXN0VGFnIHx8ICFpc1BsYWluVGV4dEVsZW1lbnQobGFzdFRhZykpIHtcclxuICAgICAgICB2YXIgdGV4dEVuZCA9IGh0bWwuaW5kZXhPZignPCcpO1xyXG4gICAgICAgIGlmICh0ZXh0RW5kID09PSAwKSB7XHJcbiAgICAgICAgICAvLyBDb21tZW50OlxyXG4gICAgICAgICAgaWYgKGNvbW1lbnQudGVzdChodG1sKSkge1xyXG4gICAgICAgICAgICB2YXIgY29tbWVudEVuZCA9IGh0bWwuaW5kZXhPZignLS0+Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudEVuZCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvdWxkS2VlcENvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29tbWVudChodG1sLnN1YnN0cmluZyg0LCBjb21tZW50RW5kKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGFkdmFuY2UoY29tbWVudEVuZCArIDMpO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbmRpdGlvbmFsX2NvbW1lbnQjRG93bmxldmVsLXJldmVhbGVkX2NvbmRpdGlvbmFsX2NvbW1lbnRcclxuICAgICAgICAgIGlmIChjb25kaXRpb25hbENvbW1lbnQudGVzdChodG1sKSkge1xyXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uYWxFbmQgPSBodG1sLmluZGV4T2YoJ10+Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZGl0aW9uYWxFbmQgPj0gMCkge1xyXG4gICAgICAgICAgICAgIGFkdmFuY2UoY29uZGl0aW9uYWxFbmQgKyAyKTtcclxuICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gRG9jdHlwZTpcclxuICAgICAgICAgIHZhciBkb2N0eXBlTWF0Y2ggPSBodG1sLm1hdGNoKGRvY3R5cGUpO1xyXG4gICAgICAgICAgaWYgKGRvY3R5cGVNYXRjaCkge1xyXG4gICAgICAgICAgICBhZHZhbmNlKGRvY3R5cGVNYXRjaFswXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEVuZCB0YWc6XHJcbiAgICAgICAgICB2YXIgZW5kVGFnTWF0Y2ggPSBodG1sLm1hdGNoKGVuZFRhZyk7XHJcbiAgICAgICAgICBpZiAoZW5kVGFnTWF0Y2gpIHtcclxuICAgICAgICAgICAgdmFyIGN1ckluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZW5kVGFnTWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgcGFyc2VFbmRUYWcoZW5kVGFnTWF0Y2hbMV0sIGN1ckluZGV4LCBpbmRleCk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gU3RhcnQgdGFnOlxyXG4gICAgICAgICAgdmFyIHN0YXJ0VGFnTWF0Y2ggPSBwYXJzZVN0YXJ0VGFnKCk7XHJcbiAgICAgICAgICBpZiAoc3RhcnRUYWdNYXRjaCkge1xyXG4gICAgICAgICAgICBoYW5kbGVTdGFydFRhZyhzdGFydFRhZ01hdGNoKTtcclxuICAgICAgICAgICAgaWYgKHNob3VsZElnbm9yZUZpcnN0TmV3bGluZShsYXN0VGFnLCBodG1sKSkge1xyXG4gICAgICAgICAgICAgIGFkdmFuY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gKHZvaWQgMCksIHJlc3QgPSAodm9pZCAwKSwgbmV4dCA9ICh2b2lkIDApO1xyXG4gICAgICAgIGlmICh0ZXh0RW5kID49IDApIHtcclxuICAgICAgICAgIHJlc3QgPSBodG1sLnNsaWNlKHRleHRFbmQpO1xyXG4gICAgICAgICAgd2hpbGUgKFxyXG4gICAgICAgICAgICAhZW5kVGFnLnRlc3QocmVzdCkgJiZcclxuICAgICAgICAgICAgIXN0YXJ0VGFnT3Blbi50ZXN0KHJlc3QpICYmXHJcbiAgICAgICAgICAgICFjb21tZW50LnRlc3QocmVzdCkgJiZcclxuICAgICAgICAgICAgIWNvbmRpdGlvbmFsQ29tbWVudC50ZXN0KHJlc3QpXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gPCBpbiBwbGFpbiB0ZXh0LCBiZSBmb3JnaXZpbmcgYW5kIHRyZWF0IGl0IGFzIHRleHRcclxuICAgICAgICAgICAgbmV4dCA9IHJlc3QuaW5kZXhPZignPCcsIDEpO1xyXG4gICAgICAgICAgICBpZiAobmV4dCA8IDApIHsgYnJlYWsgfVxyXG4gICAgICAgICAgICB0ZXh0RW5kICs9IG5leHQ7XHJcbiAgICAgICAgICAgIHJlc3QgPSBodG1sLnNsaWNlKHRleHRFbmQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGV4dCA9IGh0bWwuc3Vic3RyaW5nKDAsIHRleHRFbmQpO1xyXG4gICAgICAgICAgYWR2YW5jZSh0ZXh0RW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0ZXh0RW5kIDwgMCkge1xyXG4gICAgICAgICAgdGV4dCA9IGh0bWw7XHJcbiAgICAgICAgICBodG1sID0gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5jaGFycyAmJiB0ZXh0KSB7XHJcbiAgICAgICAgICBvcHRpb25zLmNoYXJzKHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgZW5kVGFnTGVuZ3RoID0gMDtcclxuICAgICAgICB2YXIgc3RhY2tlZFRhZyA9IGxhc3RUYWcudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB2YXIgcmVTdGFja2VkVGFnID0gcmVDYWNoZVtzdGFja2VkVGFnXSB8fCAocmVDYWNoZVtzdGFja2VkVGFnXSA9IG5ldyBSZWdFeHAoJyhbXFxcXHNcXFxcU10qPykoPC8nICsgc3RhY2tlZFRhZyArICdbXj5dKj4pJywgJ2knKSk7XHJcbiAgICAgICAgdmFyIHJlc3QkMSA9IGh0bWwucmVwbGFjZShyZVN0YWNrZWRUYWcsIGZ1bmN0aW9uIChhbGwsIHRleHQsIGVuZFRhZykge1xyXG4gICAgICAgICAgZW5kVGFnTGVuZ3RoID0gZW5kVGFnLmxlbmd0aDtcclxuICAgICAgICAgIGlmICghaXNQbGFpblRleHRFbGVtZW50KHN0YWNrZWRUYWcpICYmIHN0YWNrZWRUYWcgIT09ICdub3NjcmlwdCcpIHtcclxuICAgICAgICAgICAgdGV4dCA9IHRleHRcclxuICAgICAgICAgICAgICAucmVwbGFjZSgvPCFcXC0tKFtcXHNcXFNdKj8pLS0+L2csICckMScpIC8vICM3Mjk4XHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoLzwhXFxbQ0RBVEFcXFsoW1xcc1xcU10qPyldXT4vZywgJyQxJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoc2hvdWxkSWdub3JlRmlyc3ROZXdsaW5lKHN0YWNrZWRUYWcsIHRleHQpKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnNsaWNlKDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuY2hhcnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5jaGFycyh0ZXh0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAnJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGluZGV4ICs9IGh0bWwubGVuZ3RoIC0gcmVzdCQxLmxlbmd0aDtcclxuICAgICAgICBodG1sID0gcmVzdCQxO1xyXG4gICAgICAgIHBhcnNlRW5kVGFnKHN0YWNrZWRUYWcsIGluZGV4IC0gZW5kVGFnTGVuZ3RoLCBpbmRleCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChodG1sID09PSBsYXN0KSB7XHJcbiAgICAgICAgb3B0aW9ucy5jaGFycyAmJiBvcHRpb25zLmNoYXJzKGh0bWwpO1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhc3RhY2subGVuZ3RoICYmIG9wdGlvbnMud2Fybikge1xyXG4gICAgICAgICAgb3B0aW9ucy53YXJuKChcIk1hbC1mb3JtYXR0ZWQgdGFnIGF0IGVuZCBvZiB0ZW1wbGF0ZTogXFxcIlwiICsgaHRtbCArIFwiXFxcIlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGVhbiB1cCBhbnkgcmVtYWluaW5nIHRhZ3NcclxuICAgIHBhcnNlRW5kVGFnKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWR2YW5jZShuKSB7XHJcbiAgICAgIGluZGV4ICs9IG47XHJcbiAgICAgIGh0bWwgPSBodG1sLnN1YnN0cmluZyhuKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0YXJ0VGFnKCkge1xyXG4gICAgICB2YXIgc3RhcnQgPSBodG1sLm1hdGNoKHN0YXJ0VGFnT3Blbik7XHJcbiAgICAgIGlmIChzdGFydCkge1xyXG4gICAgICAgIHZhciBtYXRjaCA9IHtcclxuICAgICAgICAgIHRhZ05hbWU6IHN0YXJ0WzFdLFxyXG4gICAgICAgICAgYXR0cnM6IFtdLFxyXG4gICAgICAgICAgc3RhcnQ6IGluZGV4XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhZHZhbmNlKHN0YXJ0WzBdLmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIGVuZCwgYXR0cjtcclxuICAgICAgICB3aGlsZSAoIShlbmQgPSBodG1sLm1hdGNoKHN0YXJ0VGFnQ2xvc2UpKSAmJiAoYXR0ciA9IGh0bWwubWF0Y2goYXR0cmlidXRlKSkpIHtcclxuICAgICAgICAgIGFkdmFuY2UoYXR0clswXS5sZW5ndGgpO1xyXG4gICAgICAgICAgbWF0Y2guYXR0cnMucHVzaChhdHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuZCkge1xyXG4gICAgICAgICAgbWF0Y2gudW5hcnlTbGFzaCA9IGVuZFsxXTtcclxuICAgICAgICAgIGFkdmFuY2UoZW5kWzBdLmxlbmd0aCk7XHJcbiAgICAgICAgICBtYXRjaC5lbmQgPSBpbmRleDtcclxuICAgICAgICAgIHJldHVybiBtYXRjaFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0VGFnKG1hdGNoKSB7XHJcbiAgICAgIHZhciB0YWdOYW1lID0gbWF0Y2gudGFnTmFtZTtcclxuICAgICAgdmFyIHVuYXJ5U2xhc2ggPSBtYXRjaC51bmFyeVNsYXNoO1xyXG5cclxuICAgICAgaWYgKGV4cGVjdEhUTUwpIHtcclxuICAgICAgICBpZiAobGFzdFRhZyA9PT0gJ3AnICYmIGlzTm9uUGhyYXNpbmdUYWcodGFnTmFtZSkpIHtcclxuICAgICAgICAgIHBhcnNlRW5kVGFnKGxhc3RUYWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FuQmVMZWZ0T3BlblRhZyQkMSh0YWdOYW1lKSAmJiBsYXN0VGFnID09PSB0YWdOYW1lKSB7XHJcbiAgICAgICAgICBwYXJzZUVuZFRhZyh0YWdOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB1bmFyeSA9IGlzVW5hcnlUYWckJDEodGFnTmFtZSkgfHwgISF1bmFyeVNsYXNoO1xyXG5cclxuICAgICAgdmFyIGwgPSBtYXRjaC5hdHRycy5sZW5ndGg7XHJcbiAgICAgIHZhciBhdHRycyA9IG5ldyBBcnJheShsKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICB2YXIgYXJncyA9IG1hdGNoLmF0dHJzW2ldO1xyXG4gICAgICAgIC8vIGhhY2tpc2ggd29yayBhcm91bmQgRkYgYnVnIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTM2OTc3OFxyXG4gICAgICAgIGlmIChJU19SRUdFWF9DQVBUVVJJTkdfQlJPS0VOICYmIGFyZ3NbMF0uaW5kZXhPZignXCJcIicpID09PSAtMSkge1xyXG4gICAgICAgICAgaWYgKGFyZ3NbM10gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzNdOyB9XHJcbiAgICAgICAgICBpZiAoYXJnc1s0XSA9PT0gJycpIHsgZGVsZXRlIGFyZ3NbNF07IH1cclxuICAgICAgICAgIGlmIChhcmdzWzVdID09PSAnJykgeyBkZWxldGUgYXJnc1s1XTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFsdWUgPSBhcmdzWzNdIHx8IGFyZ3NbNF0gfHwgYXJnc1s1XSB8fCAnJztcclxuICAgICAgICB2YXIgc2hvdWxkRGVjb2RlTmV3bGluZXMgPSB0YWdOYW1lID09PSAnYScgJiYgYXJnc1sxXSA9PT0gJ2hyZWYnXHJcbiAgICAgICAgICA/IG9wdGlvbnMuc2hvdWxkRGVjb2RlTmV3bGluZXNGb3JIcmVmXHJcbiAgICAgICAgICA6IG9wdGlvbnMuc2hvdWxkRGVjb2RlTmV3bGluZXM7XHJcbiAgICAgICAgYXR0cnNbaV0gPSB7XHJcbiAgICAgICAgICBuYW1lOiBhcmdzWzFdLFxyXG4gICAgICAgICAgdmFsdWU6IGRlY29kZUF0dHIodmFsdWUsIHNob3VsZERlY29kZU5ld2xpbmVzKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdW5hcnkpIHtcclxuICAgICAgICBzdGFjay5wdXNoKHsgdGFnOiB0YWdOYW1lLCBsb3dlckNhc2VkVGFnOiB0YWdOYW1lLnRvTG93ZXJDYXNlKCksIGF0dHJzOiBhdHRycyB9KTtcclxuICAgICAgICBsYXN0VGFnID0gdGFnTmFtZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuc3RhcnQpIHtcclxuICAgICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIGF0dHJzLCB1bmFyeSwgbWF0Y2guc3RhcnQsIG1hdGNoLmVuZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZUVuZFRhZyh0YWdOYW1lLCBzdGFydCwgZW5kKSB7XHJcbiAgICAgIHZhciBwb3MsIGxvd2VyQ2FzZWRUYWdOYW1lO1xyXG4gICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IGluZGV4OyB9XHJcbiAgICAgIGlmIChlbmQgPT0gbnVsbCkgeyBlbmQgPSBpbmRleDsgfVxyXG5cclxuICAgICAgaWYgKHRhZ05hbWUpIHtcclxuICAgICAgICBsb3dlckNhc2VkVGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRmluZCB0aGUgY2xvc2VzdCBvcGVuZWQgdGFnIG9mIHRoZSBzYW1lIHR5cGVcclxuICAgICAgaWYgKHRhZ05hbWUpIHtcclxuICAgICAgICBmb3IgKHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xyXG4gICAgICAgICAgaWYgKHN0YWNrW3Bvc10ubG93ZXJDYXNlZFRhZyA9PT0gbG93ZXJDYXNlZFRhZ05hbWUpIHtcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgbm8gdGFnIG5hbWUgaXMgcHJvdmlkZWQsIGNsZWFuIHNob3BcclxuICAgICAgICBwb3MgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9zID49IDApIHtcclxuICAgICAgICAvLyBDbG9zZSBhbGwgdGhlIG9wZW4gZWxlbWVudHMsIHVwIHRoZSBzdGFja1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFjay5sZW5ndGggLSAxOyBpID49IHBvczsgaS0tKSB7XHJcbiAgICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgICAgICAgKGkgPiBwb3MgfHwgIXRhZ05hbWUpICYmXHJcbiAgICAgICAgICAgIG9wdGlvbnMud2FyblxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMud2FybihcclxuICAgICAgICAgICAgICAoXCJ0YWcgPFwiICsgKHN0YWNrW2ldLnRhZykgKyBcIj4gaGFzIG5vIG1hdGNoaW5nIGVuZCB0YWcuXCIpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5lbmQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5lbmQoc3RhY2tbaV0udGFnLCBzdGFydCwgZW5kKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgb3BlbiBlbGVtZW50cyBmcm9tIHRoZSBzdGFja1xyXG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHBvcztcclxuICAgICAgICBsYXN0VGFnID0gcG9zICYmIHN0YWNrW3BvcyAtIDFdLnRhZztcclxuICAgICAgfSBlbHNlIGlmIChsb3dlckNhc2VkVGFnTmFtZSA9PT0gJ2JyJykge1xyXG4gICAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XHJcbiAgICAgICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIFtdLCB0cnVlLCBzdGFydCwgZW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobG93ZXJDYXNlZFRhZ05hbWUgPT09ICdwJykge1xyXG4gICAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XHJcbiAgICAgICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIFtdLCBmYWxzZSwgc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmVuZCkge1xyXG4gICAgICAgICAgb3B0aW9ucy5lbmQodGFnTmFtZSwgc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIG9uUkUgPSAvXkB8XnYtb246LztcclxuICB2YXIgZGlyUkUgPSAvXnYtfF5AfF46LztcclxuICB2YXIgZm9yQWxpYXNSRSA9IC8oW15dKj8pXFxzKyg/OmlufG9mKVxccysoW15dKikvO1xyXG4gIHZhciBmb3JJdGVyYXRvclJFID0gLywoW14sXFx9XFxdXSopKD86LChbXixcXH1cXF1dKikpPyQvO1xyXG4gIHZhciBzdHJpcFBhcmVuc1JFID0gL15cXCh8XFwpJC9nO1xyXG5cclxuICB2YXIgYXJnUkUgPSAvOiguKikkLztcclxuICB2YXIgYmluZFJFID0gL146fF52LWJpbmQ6LztcclxuICB2YXIgbW9kaWZpZXJSRSA9IC9cXC5bXi5dKy9nO1xyXG5cclxuICB2YXIgZGVjb2RlSFRNTENhY2hlZCA9IGNhY2hlZChoZS5kZWNvZGUpO1xyXG5cclxuICAvLyBjb25maWd1cmFibGUgc3RhdGVcclxuICB2YXIgd2FybiQyO1xyXG4gIHZhciBkZWxpbWl0ZXJzO1xyXG4gIHZhciB0cmFuc2Zvcm1zO1xyXG4gIHZhciBwcmVUcmFuc2Zvcm1zO1xyXG4gIHZhciBwb3N0VHJhbnNmb3JtcztcclxuICB2YXIgcGxhdGZvcm1Jc1ByZVRhZztcclxuICB2YXIgcGxhdGZvcm1NdXN0VXNlUHJvcDtcclxuICB2YXIgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2U7XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQVNURWxlbWVudChcclxuICAgIHRhZyxcclxuICAgIGF0dHJzLFxyXG4gICAgcGFyZW50XHJcbiAgKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAxLFxyXG4gICAgICB0YWc6IHRhZyxcclxuICAgICAgYXR0cnNMaXN0OiBhdHRycyxcclxuICAgICAgYXR0cnNNYXA6IG1ha2VBdHRyc01hcChhdHRycyksXHJcbiAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICBjaGlsZHJlbjogW11cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnQgSFRNTCBzdHJpbmcgdG8gQVNULlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBhcnNlKFxyXG4gICAgdGVtcGxhdGUsXHJcbiAgICBvcHRpb25zXHJcbiAgKSB7XHJcbiAgICB3YXJuJDIgPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XHJcblxyXG4gICAgcGxhdGZvcm1Jc1ByZVRhZyA9IG9wdGlvbnMuaXNQcmVUYWcgfHwgbm87XHJcbiAgICBwbGF0Zm9ybU11c3RVc2VQcm9wID0gb3B0aW9ucy5tdXN0VXNlUHJvcCB8fCBubztcclxuICAgIHBsYXRmb3JtR2V0VGFnTmFtZXNwYWNlID0gb3B0aW9ucy5nZXRUYWdOYW1lc3BhY2UgfHwgbm87XHJcblxyXG4gICAgdHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtTm9kZScpO1xyXG4gICAgcHJlVHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAncHJlVHJhbnNmb3JtTm9kZScpO1xyXG4gICAgcG9zdFRyYW5zZm9ybXMgPSBwbHVja01vZHVsZUZ1bmN0aW9uKG9wdGlvbnMubW9kdWxlcywgJ3Bvc3RUcmFuc2Zvcm1Ob2RlJyk7XHJcblxyXG4gICAgZGVsaW1pdGVycyA9IG9wdGlvbnMuZGVsaW1pdGVycztcclxuXHJcbiAgICB2YXIgc3RhY2sgPSBbXTtcclxuICAgIHZhciBwcmVzZXJ2ZVdoaXRlc3BhY2UgPSBvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZSAhPT0gZmFsc2U7XHJcbiAgICB2YXIgcm9vdDtcclxuICAgIHZhciBjdXJyZW50UGFyZW50O1xyXG4gICAgdmFyIGluVlByZSA9IGZhbHNlO1xyXG4gICAgdmFyIGluUHJlID0gZmFsc2U7XHJcbiAgICB2YXIgd2FybmVkID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gd2Fybk9uY2UobXNnKSB7XHJcbiAgICAgIGlmICghd2FybmVkKSB7XHJcbiAgICAgICAgd2FybmVkID0gdHJ1ZTtcclxuICAgICAgICB3YXJuJDIobXNnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlRWxlbWVudChlbGVtZW50KSB7XHJcbiAgICAgIC8vIGNoZWNrIHByZSBzdGF0ZVxyXG4gICAgICBpZiAoZWxlbWVudC5wcmUpIHtcclxuICAgICAgICBpblZQcmUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocGxhdGZvcm1Jc1ByZVRhZyhlbGVtZW50LnRhZykpIHtcclxuICAgICAgICBpblByZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGFwcGx5IHBvc3QtdHJhbnNmb3Jtc1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvc3RUcmFuc2Zvcm1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcG9zdFRyYW5zZm9ybXNbaV0oZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUhUTUwodGVtcGxhdGUsIHtcclxuICAgICAgd2Fybjogd2FybiQyLFxyXG4gICAgICBleHBlY3RIVE1MOiBvcHRpb25zLmV4cGVjdEhUTUwsXHJcbiAgICAgIGlzVW5hcnlUYWc6IG9wdGlvbnMuaXNVbmFyeVRhZyxcclxuICAgICAgY2FuQmVMZWZ0T3BlblRhZzogb3B0aW9ucy5jYW5CZUxlZnRPcGVuVGFnLFxyXG4gICAgICBzaG91bGREZWNvZGVOZXdsaW5lczogb3B0aW9ucy5zaG91bGREZWNvZGVOZXdsaW5lcyxcclxuICAgICAgc2hvdWxkRGVjb2RlTmV3bGluZXNGb3JIcmVmOiBvcHRpb25zLnNob3VsZERlY29kZU5ld2xpbmVzRm9ySHJlZixcclxuICAgICAgc2hvdWxkS2VlcENvbW1lbnQ6IG9wdGlvbnMuY29tbWVudHMsXHJcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCh0YWcsIGF0dHJzLCB1bmFyeSkge1xyXG4gICAgICAgIC8vIGNoZWNrIG5hbWVzcGFjZS5cclxuICAgICAgICAvLyBpbmhlcml0IHBhcmVudCBucyBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICB2YXIgbnMgPSAoY3VycmVudFBhcmVudCAmJiBjdXJyZW50UGFyZW50Lm5zKSB8fCBwbGF0Zm9ybUdldFRhZ05hbWVzcGFjZSh0YWcpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgSUUgc3ZnIGJ1Z1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChpc0lFICYmIG5zID09PSAnc3ZnJykge1xyXG4gICAgICAgICAgYXR0cnMgPSBndWFyZElFU1ZHQnVnKGF0dHJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlQVNURWxlbWVudCh0YWcsIGF0dHJzLCBjdXJyZW50UGFyZW50KTtcclxuICAgICAgICBpZiAobnMpIHtcclxuICAgICAgICAgIGVsZW1lbnQubnMgPSBucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc0ZvcmJpZGRlblRhZyhlbGVtZW50KSAmJiAhaXNTZXJ2ZXJSZW5kZXJpbmcoKSkge1xyXG4gICAgICAgICAgZWxlbWVudC5mb3JiaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybiQyKFxyXG4gICAgICAgICAgICAnVGVtcGxhdGVzIHNob3VsZCBvbmx5IGJlIHJlc3BvbnNpYmxlIGZvciBtYXBwaW5nIHRoZSBzdGF0ZSB0byB0aGUgJyArXHJcbiAgICAgICAgICAgICdVSS4gQXZvaWQgcGxhY2luZyB0YWdzIHdpdGggc2lkZS1lZmZlY3RzIGluIHlvdXIgdGVtcGxhdGVzLCBzdWNoIGFzICcgK1xyXG4gICAgICAgICAgICBcIjxcIiArIHRhZyArIFwiPlwiICsgJywgYXMgdGhleSB3aWxsIG5vdCBiZSBwYXJzZWQuJ1xyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFwcGx5IHByZS10cmFuc2Zvcm1zXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVUcmFuc2Zvcm1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBlbGVtZW50ID0gcHJlVHJhbnNmb3Jtc1tpXShlbGVtZW50LCBvcHRpb25zKSB8fCBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpblZQcmUpIHtcclxuICAgICAgICAgIHByb2Nlc3NQcmUoZWxlbWVudCk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5wcmUpIHtcclxuICAgICAgICAgICAgaW5WUHJlID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBsYXRmb3JtSXNQcmVUYWcoZWxlbWVudC50YWcpKSB7XHJcbiAgICAgICAgICBpblByZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpblZQcmUpIHtcclxuICAgICAgICAgIHByb2Nlc3NSYXdBdHRycyhlbGVtZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFlbGVtZW50LnByb2Nlc3NlZCkge1xyXG4gICAgICAgICAgLy8gc3RydWN0dXJhbCBkaXJlY3RpdmVzXHJcbiAgICAgICAgICBwcm9jZXNzRm9yKGVsZW1lbnQpO1xyXG4gICAgICAgICAgcHJvY2Vzc0lmKGVsZW1lbnQpO1xyXG4gICAgICAgICAgcHJvY2Vzc09uY2UoZWxlbWVudCk7XHJcbiAgICAgICAgICAvLyBlbGVtZW50LXNjb3BlIHN0dWZmXHJcbiAgICAgICAgICBwcm9jZXNzRWxlbWVudChlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrUm9vdENvbnN0cmFpbnRzKGVsKSB7XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlbC50YWcgPT09ICdzbG90JyB8fCBlbC50YWcgPT09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgICAgICAgICB3YXJuT25jZShcclxuICAgICAgICAgICAgICAgIFwiQ2Fubm90IHVzZSA8XCIgKyAoZWwudGFnKSArIFwiPiBhcyBjb21wb25lbnQgcm9vdCBlbGVtZW50IGJlY2F1c2UgaXQgbWF5IFwiICtcclxuICAgICAgICAgICAgICAgICdjb250YWluIG11bHRpcGxlIG5vZGVzLidcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbC5hdHRyc01hcC5oYXNPd25Qcm9wZXJ0eSgndi1mb3InKSkge1xyXG4gICAgICAgICAgICAgIHdhcm5PbmNlKFxyXG4gICAgICAgICAgICAgICAgJ0Nhbm5vdCB1c2Ugdi1mb3Igb24gc3RhdGVmdWwgY29tcG9uZW50IHJvb3QgZWxlbWVudCBiZWNhdXNlICcgK1xyXG4gICAgICAgICAgICAgICAgJ2l0IHJlbmRlcnMgbXVsdGlwbGUgZWxlbWVudHMuJ1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyZWUgbWFuYWdlbWVudFxyXG4gICAgICAgIGlmICghcm9vdCkge1xyXG4gICAgICAgICAgcm9vdCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBjaGVja1Jvb3RDb25zdHJhaW50cyhyb290KTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFzdGFjay5sZW5ndGgpIHtcclxuICAgICAgICAgIC8vIGFsbG93IHJvb3QgZWxlbWVudHMgd2l0aCB2LWlmLCB2LWVsc2UtaWYgYW5kIHYtZWxzZVxyXG4gICAgICAgICAgaWYgKHJvb3QuaWYgJiYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkpIHtcclxuICAgICAgICAgICAgY2hlY2tSb290Q29uc3RyYWludHMoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGFkZElmQ29uZGl0aW9uKHJvb3QsIHtcclxuICAgICAgICAgICAgICBleHA6IGVsZW1lbnQuZWxzZWlmLFxyXG4gICAgICAgICAgICAgIGJsb2NrOiBlbGVtZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2Fybk9uY2UoXHJcbiAgICAgICAgICAgICAgXCJDb21wb25lbnQgdGVtcGxhdGUgc2hvdWxkIGNvbnRhaW4gZXhhY3RseSBvbmUgcm9vdCBlbGVtZW50LiBcIiArXHJcbiAgICAgICAgICAgICAgXCJJZiB5b3UgYXJlIHVzaW5nIHYtaWYgb24gbXVsdGlwbGUgZWxlbWVudHMsIFwiICtcclxuICAgICAgICAgICAgICBcInVzZSB2LWVsc2UtaWYgdG8gY2hhaW4gdGhlbSBpbnN0ZWFkLlwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50UGFyZW50ICYmICFlbGVtZW50LmZvcmJpZGRlbikge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkge1xyXG4gICAgICAgICAgICBwcm9jZXNzSWZDb25kaXRpb25zKGVsZW1lbnQsIGN1cnJlbnRQYXJlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnNsb3RTY29wZSkgeyAvLyBzY29wZWQgc2xvdFxyXG4gICAgICAgICAgICBjdXJyZW50UGFyZW50LnBsYWluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gZWxlbWVudC5zbG90VGFyZ2V0IHx8ICdcImRlZmF1bHRcIic7IChjdXJyZW50UGFyZW50LnNjb3BlZFNsb3RzIHx8IChjdXJyZW50UGFyZW50LnNjb3BlZFNsb3RzID0ge30pKVtuYW1lXSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50ID0gY3VycmVudFBhcmVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF1bmFyeSkge1xyXG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBzdGFjay5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjbG9zZUVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZW5kOiBmdW5jdGlvbiBlbmQoKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciBsYXN0Tm9kZSA9IGVsZW1lbnQuY2hpbGRyZW5bZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAobGFzdE5vZGUgJiYgbGFzdE5vZGUudHlwZSA9PT0gMyAmJiBsYXN0Tm9kZS50ZXh0ID09PSAnICcgJiYgIWluUHJlKSB7XHJcbiAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwb3Agc3RhY2tcclxuICAgICAgICBzdGFjay5sZW5ndGggLT0gMTtcclxuICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICAgICAgY2xvc2VFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hhcnM6IGZ1bmN0aW9uIGNoYXJzKHRleHQpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnRQYXJlbnQpIHtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRleHQgPT09IHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgd2Fybk9uY2UoXHJcbiAgICAgICAgICAgICAgICAnQ29tcG9uZW50IHRlbXBsYXRlIHJlcXVpcmVzIGEgcm9vdCBlbGVtZW50LCByYXRoZXIgdGhhbiBqdXN0IHRleHQuJ1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHRleHQgPSB0ZXh0LnRyaW0oKSkpIHtcclxuICAgICAgICAgICAgICB3YXJuT25jZShcclxuICAgICAgICAgICAgICAgIChcInRleHQgXFxcIlwiICsgdGV4dCArIFwiXFxcIiBvdXRzaWRlIHJvb3QgZWxlbWVudCB3aWxsIGJlIGlnbm9yZWQuXCIpXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElFIHRleHRhcmVhIHBsYWNlaG9sZGVyIGJ1Z1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChpc0lFICYmXHJcbiAgICAgICAgICBjdXJyZW50UGFyZW50LnRhZyA9PT0gJ3RleHRhcmVhJyAmJlxyXG4gICAgICAgICAgY3VycmVudFBhcmVudC5hdHRyc01hcC5wbGFjZWhvbGRlciA9PT0gdGV4dFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IGN1cnJlbnRQYXJlbnQuY2hpbGRyZW47XHJcbiAgICAgICAgdGV4dCA9IGluUHJlIHx8IHRleHQudHJpbSgpXHJcbiAgICAgICAgICA/IGlzVGV4dFRhZyhjdXJyZW50UGFyZW50KSA/IHRleHQgOiBkZWNvZGVIVE1MQ2FjaGVkKHRleHQpXHJcbiAgICAgICAgICAvLyBvbmx5IHByZXNlcnZlIHdoaXRlc3BhY2UgaWYgaXRzIG5vdCByaWdodCBhZnRlciBhIHN0YXJ0aW5nIHRhZ1xyXG4gICAgICAgICAgOiBwcmVzZXJ2ZVdoaXRlc3BhY2UgJiYgY2hpbGRyZW4ubGVuZ3RoID8gJyAnIDogJyc7XHJcbiAgICAgICAgaWYgKHRleHQpIHtcclxuICAgICAgICAgIHZhciByZXM7XHJcbiAgICAgICAgICBpZiAoIWluVlByZSAmJiB0ZXh0ICE9PSAnICcgJiYgKHJlcyA9IHBhcnNlVGV4dCh0ZXh0LCBkZWxpbWl0ZXJzKSkpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgICAgdHlwZTogMixcclxuICAgICAgICAgICAgICBleHByZXNzaW9uOiByZXMuZXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICB0b2tlbnM6IHJlcy50b2tlbnMsXHJcbiAgICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGV4dCAhPT0gJyAnIHx8ICFjaGlsZHJlbi5sZW5ndGggfHwgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0udGV4dCAhPT0gJyAnKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICAgIHR5cGU6IDMsXHJcbiAgICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbW1lbnQ6IGZ1bmN0aW9uIGNvbW1lbnQodGV4dCkge1xyXG4gICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiAzLFxyXG4gICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgIGlzQ29tbWVudDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByb290XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm9jZXNzUHJlKGVsKSB7XHJcbiAgICBpZiAoZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtcHJlJykgIT0gbnVsbCkge1xyXG4gICAgICBlbC5wcmUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc1Jhd0F0dHJzKGVsKSB7XHJcbiAgICB2YXIgbCA9IGVsLmF0dHJzTGlzdC5sZW5ndGg7XHJcbiAgICBpZiAobCkge1xyXG4gICAgICB2YXIgYXR0cnMgPSBlbC5hdHRycyA9IG5ldyBBcnJheShsKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBhdHRyc1tpXSA9IHtcclxuICAgICAgICAgIG5hbWU6IGVsLmF0dHJzTGlzdFtpXS5uYW1lLFxyXG4gICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KGVsLmF0dHJzTGlzdFtpXS52YWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKCFlbC5wcmUpIHtcclxuICAgICAgLy8gbm9uIHJvb3Qgbm9kZSBpbiBwcmUgYmxvY2tzIHdpdGggbm8gYXR0cmlidXRlc1xyXG4gICAgICBlbC5wbGFpbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBwcm9jZXNzS2V5KGVsZW1lbnQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSBwbGFpbiBlbGVtZW50IGFmdGVyXHJcbiAgICAvLyByZW1vdmluZyBzdHJ1Y3R1cmFsIGF0dHJpYnV0ZXNcclxuICAgIGVsZW1lbnQucGxhaW4gPSAhZWxlbWVudC5rZXkgJiYgIWVsZW1lbnQuYXR0cnNMaXN0Lmxlbmd0aDtcclxuXHJcbiAgICBwcm9jZXNzUmVmKGVsZW1lbnQpO1xyXG4gICAgcHJvY2Vzc1Nsb3QoZWxlbWVudCk7XHJcbiAgICBwcm9jZXNzQ29tcG9uZW50KGVsZW1lbnQpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGVsZW1lbnQgPSB0cmFuc2Zvcm1zW2ldKGVsZW1lbnQsIG9wdGlvbnMpIHx8IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzQXR0cnMoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm9jZXNzS2V5KGVsKSB7XHJcbiAgICB2YXIgZXhwID0gZ2V0QmluZGluZ0F0dHIoZWwsICdrZXknKTtcclxuICAgIGlmIChleHApIHtcclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGVsLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICAgIHdhcm4kMihcIjx0ZW1wbGF0ZT4gY2Fubm90IGJlIGtleWVkLiBQbGFjZSB0aGUga2V5IG9uIHJlYWwgZWxlbWVudHMgaW5zdGVhZC5cIik7XHJcbiAgICAgIH1cclxuICAgICAgZWwua2V5ID0gZXhwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc1JlZihlbCkge1xyXG4gICAgdmFyIHJlZiA9IGdldEJpbmRpbmdBdHRyKGVsLCAncmVmJyk7XHJcbiAgICBpZiAocmVmKSB7XHJcbiAgICAgIGVsLnJlZiA9IHJlZjtcclxuICAgICAgZWwucmVmSW5Gb3IgPSBjaGVja0luRm9yKGVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb2Nlc3NGb3IoZWwpIHtcclxuICAgIHZhciBleHA7XHJcbiAgICBpZiAoKGV4cCA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWZvcicpKSkge1xyXG4gICAgICB2YXIgcmVzID0gcGFyc2VGb3IoZXhwKTtcclxuICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgIGV4dGVuZChlbCwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3YXJuJDIoXHJcbiAgICAgICAgICAoXCJJbnZhbGlkIHYtZm9yIGV4cHJlc3Npb246IFwiICsgZXhwKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VGb3IoZXhwKSB7XHJcbiAgICB2YXIgaW5NYXRjaCA9IGV4cC5tYXRjaChmb3JBbGlhc1JFKTtcclxuICAgIGlmICghaW5NYXRjaCkgeyByZXR1cm4gfVxyXG4gICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgcmVzLmZvciA9IGluTWF0Y2hbMl0udHJpbSgpO1xyXG4gICAgdmFyIGFsaWFzID0gaW5NYXRjaFsxXS50cmltKCkucmVwbGFjZShzdHJpcFBhcmVuc1JFLCAnJyk7XHJcbiAgICB2YXIgaXRlcmF0b3JNYXRjaCA9IGFsaWFzLm1hdGNoKGZvckl0ZXJhdG9yUkUpO1xyXG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcclxuICAgICAgcmVzLmFsaWFzID0gYWxpYXMucmVwbGFjZShmb3JJdGVyYXRvclJFLCAnJyk7XHJcbiAgICAgIHJlcy5pdGVyYXRvcjEgPSBpdGVyYXRvck1hdGNoWzFdLnRyaW0oKTtcclxuICAgICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcclxuICAgICAgICByZXMuaXRlcmF0b3IyID0gaXRlcmF0b3JNYXRjaFsyXS50cmltKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcy5hbGlhcyA9IGFsaWFzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc0lmKGVsKSB7XHJcbiAgICB2YXIgZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtaWYnKTtcclxuICAgIGlmIChleHApIHtcclxuICAgICAgZWwuaWYgPSBleHA7XHJcbiAgICAgIGFkZElmQ29uZGl0aW9uKGVsLCB7XHJcbiAgICAgICAgZXhwOiBleHAsXHJcbiAgICAgICAgYmxvY2s6IGVsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UnKSAhPSBudWxsKSB7XHJcbiAgICAgICAgZWwuZWxzZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGVsc2VpZiA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UtaWYnKTtcclxuICAgICAgaWYgKGVsc2VpZikge1xyXG4gICAgICAgIGVsLmVsc2VpZiA9IGVsc2VpZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc0lmQ29uZGl0aW9ucyhlbCwgcGFyZW50KSB7XHJcbiAgICB2YXIgcHJldiA9IGZpbmRQcmV2RWxlbWVudChwYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgaWYgKHByZXYgJiYgcHJldi5pZikge1xyXG4gICAgICBhZGRJZkNvbmRpdGlvbihwcmV2LCB7XHJcbiAgICAgICAgZXhwOiBlbC5lbHNlaWYsXHJcbiAgICAgICAgYmxvY2s6IGVsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2FybiQyKFxyXG4gICAgICAgIFwidi1cIiArIChlbC5lbHNlaWYgPyAoJ2Vsc2UtaWY9XCInICsgZWwuZWxzZWlmICsgJ1wiJykgOiAnZWxzZScpICsgXCIgXCIgK1xyXG4gICAgICAgIFwidXNlZCBvbiBlbGVtZW50IDxcIiArIChlbC50YWcpICsgXCI+IHdpdGhvdXQgY29ycmVzcG9uZGluZyB2LWlmLlwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaW5kUHJldkVsZW1lbnQoY2hpbGRyZW4pIHtcclxuICAgIHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICBpZiAoY2hpbGRyZW5baV0udHlwZSA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBjaGlsZHJlbltpXVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjaGlsZHJlbltpXS50ZXh0ICE9PSAnICcpIHtcclxuICAgICAgICAgIHdhcm4kMihcclxuICAgICAgICAgICAgXCJ0ZXh0IFxcXCJcIiArIChjaGlsZHJlbltpXS50ZXh0LnRyaW0oKSkgKyBcIlxcXCIgYmV0d2VlbiB2LWlmIGFuZCB2LWVsc2UoLWlmKSBcIiArXHJcbiAgICAgICAgICAgIFwid2lsbCBiZSBpZ25vcmVkLlwiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGlsZHJlbi5wb3AoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkSWZDb25kaXRpb24oZWwsIGNvbmRpdGlvbikge1xyXG4gICAgaWYgKCFlbC5pZkNvbmRpdGlvbnMpIHtcclxuICAgICAgZWwuaWZDb25kaXRpb25zID0gW107XHJcbiAgICB9XHJcbiAgICBlbC5pZkNvbmRpdGlvbnMucHVzaChjb25kaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc09uY2UoZWwpIHtcclxuICAgIHZhciBvbmNlJCQxID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3Ytb25jZScpO1xyXG4gICAgaWYgKG9uY2UkJDEgIT0gbnVsbCkge1xyXG4gICAgICBlbC5vbmNlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb2Nlc3NTbG90KGVsKSB7XHJcbiAgICBpZiAoZWwudGFnID09PSAnc2xvdCcpIHtcclxuICAgICAgZWwuc2xvdE5hbWUgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ25hbWUnKTtcclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGVsLmtleSkge1xyXG4gICAgICAgIHdhcm4kMihcclxuICAgICAgICAgIFwiYGtleWAgZG9lcyBub3Qgd29yayBvbiA8c2xvdD4gYmVjYXVzZSBzbG90cyBhcmUgYWJzdHJhY3Qgb3V0bGV0cyBcIiArXHJcbiAgICAgICAgICBcImFuZCBjYW4gcG9zc2libHkgZXhwYW5kIGludG8gbXVsdGlwbGUgZWxlbWVudHMuIFwiICtcclxuICAgICAgICAgIFwiVXNlIHRoZSBrZXkgb24gYSB3cmFwcGluZyBlbGVtZW50IGluc3RlYWQuXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgc2xvdFNjb3BlO1xyXG4gICAgICBpZiAoZWwudGFnID09PSAndGVtcGxhdGUnKSB7XHJcbiAgICAgICAgc2xvdFNjb3BlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3Njb3BlJyk7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHNsb3RTY29wZSkge1xyXG4gICAgICAgICAgd2FybiQyKFxyXG4gICAgICAgICAgICBcInRoZSBcXFwic2NvcGVcXFwiIGF0dHJpYnV0ZSBmb3Igc2NvcGVkIHNsb3RzIGhhdmUgYmVlbiBkZXByZWNhdGVkIGFuZCBcIiArXHJcbiAgICAgICAgICAgIFwicmVwbGFjZWQgYnkgXFxcInNsb3Qtc2NvcGVcXFwiIHNpbmNlIDIuNS4gVGhlIG5ldyBcXFwic2xvdC1zY29wZVxcXCIgYXR0cmlidXRlIFwiICtcclxuICAgICAgICAgICAgXCJjYW4gYWxzbyBiZSB1c2VkIG9uIHBsYWluIGVsZW1lbnRzIGluIGFkZGl0aW9uIHRvIDx0ZW1wbGF0ZT4gdG8gXCIgK1xyXG4gICAgICAgICAgICBcImRlbm90ZSBzY29wZWQgc2xvdHMuXCIsXHJcbiAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLnNsb3RTY29wZSA9IHNsb3RTY29wZSB8fCBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnc2xvdC1zY29wZScpO1xyXG4gICAgICB9IGVsc2UgaWYgKChzbG90U2NvcGUgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnc2xvdC1zY29wZScpKSkge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBlbC5hdHRyc01hcFsndi1mb3InXSkge1xyXG4gICAgICAgICAgd2FybiQyKFxyXG4gICAgICAgICAgICBcIkFtYmlndW91cyBjb21iaW5lZCB1c2FnZSBvZiBzbG90LXNjb3BlIGFuZCB2LWZvciBvbiA8XCIgKyAoZWwudGFnKSArIFwiPiBcIiArXHJcbiAgICAgICAgICAgIFwiKHYtZm9yIHRha2VzIGhpZ2hlciBwcmlvcml0eSkuIFVzZSBhIHdyYXBwZXIgPHRlbXBsYXRlPiBmb3IgdGhlIFwiICtcclxuICAgICAgICAgICAgXCJzY29wZWQgc2xvdCB0byBtYWtlIGl0IGNsZWFyZXIuXCIsXHJcbiAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLnNsb3RTY29wZSA9IHNsb3RTY29wZTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgc2xvdFRhcmdldCA9IGdldEJpbmRpbmdBdHRyKGVsLCAnc2xvdCcpO1xyXG4gICAgICBpZiAoc2xvdFRhcmdldCkge1xyXG4gICAgICAgIGVsLnNsb3RUYXJnZXQgPSBzbG90VGFyZ2V0ID09PSAnXCJcIicgPyAnXCJkZWZhdWx0XCInIDogc2xvdFRhcmdldDtcclxuICAgICAgICAvLyBwcmVzZXJ2ZSBzbG90IGFzIGFuIGF0dHJpYnV0ZSBmb3IgbmF0aXZlIHNoYWRvdyBET00gY29tcGF0XHJcbiAgICAgICAgLy8gb25seSBmb3Igbm9uLXNjb3BlZCBzbG90cy5cclxuICAgICAgICBpZiAoZWwudGFnICE9PSAndGVtcGxhdGUnICYmICFlbC5zbG90U2NvcGUpIHtcclxuICAgICAgICAgIGFkZEF0dHIoZWwsICdzbG90Jywgc2xvdFRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm9jZXNzQ29tcG9uZW50KGVsKSB7XHJcbiAgICB2YXIgYmluZGluZztcclxuICAgIGlmICgoYmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnaXMnKSkpIHtcclxuICAgICAgZWwuY29tcG9uZW50ID0gYmluZGluZztcclxuICAgIH1cclxuICAgIGlmIChnZXRBbmRSZW1vdmVBdHRyKGVsLCAnaW5saW5lLXRlbXBsYXRlJykgIT0gbnVsbCkge1xyXG4gICAgICBlbC5pbmxpbmVUZW1wbGF0ZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm9jZXNzQXR0cnMoZWwpIHtcclxuICAgIHZhciBsaXN0ID0gZWwuYXR0cnNMaXN0O1xyXG4gICAgdmFyIGksIGwsIG5hbWUsIHJhd05hbWUsIHZhbHVlLCBtb2RpZmllcnMsIGlzUHJvcDtcclxuICAgIGZvciAoaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICBuYW1lID0gcmF3TmFtZSA9IGxpc3RbaV0ubmFtZTtcclxuICAgICAgdmFsdWUgPSBsaXN0W2ldLnZhbHVlO1xyXG4gICAgICBpZiAoZGlyUkUudGVzdChuYW1lKSkge1xyXG4gICAgICAgIC8vIG1hcmsgZWxlbWVudCBhcyBkeW5hbWljXHJcbiAgICAgICAgZWwuaGFzQmluZGluZ3MgPSB0cnVlO1xyXG4gICAgICAgIC8vIG1vZGlmaWVyc1xyXG4gICAgICAgIG1vZGlmaWVycyA9IHBhcnNlTW9kaWZpZXJzKG5hbWUpO1xyXG4gICAgICAgIGlmIChtb2RpZmllcnMpIHtcclxuICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UobW9kaWZpZXJSRSwgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmluZFJFLnRlc3QobmFtZSkpIHsgLy8gdi1iaW5kXHJcbiAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKGJpbmRSRSwgJycpO1xyXG4gICAgICAgICAgdmFsdWUgPSBwYXJzZUZpbHRlcnModmFsdWUpO1xyXG4gICAgICAgICAgaXNQcm9wID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAobW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RpZmllcnMucHJvcCkge1xyXG4gICAgICAgICAgICAgIGlzUHJvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgbmFtZSA9IGNhbWVsaXplKG5hbWUpO1xyXG4gICAgICAgICAgICAgIGlmIChuYW1lID09PSAnaW5uZXJIdG1sJykgeyBuYW1lID0gJ2lubmVySFRNTCc7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobW9kaWZpZXJzLmNhbWVsKSB7XHJcbiAgICAgICAgICAgICAgbmFtZSA9IGNhbWVsaXplKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtb2RpZmllcnMuc3luYykge1xyXG4gICAgICAgICAgICAgIGFkZEhhbmRsZXIoXHJcbiAgICAgICAgICAgICAgICBlbCxcclxuICAgICAgICAgICAgICAgIChcInVwZGF0ZTpcIiArIChjYW1lbGl6ZShuYW1lKSkpLFxyXG4gICAgICAgICAgICAgICAgZ2VuQXNzaWdubWVudENvZGUodmFsdWUsIFwiJGV2ZW50XCIpXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzUHJvcCB8fCAoXHJcbiAgICAgICAgICAgICFlbC5jb21wb25lbnQgJiYgcGxhdGZvcm1NdXN0VXNlUHJvcChlbC50YWcsIGVsLmF0dHJzTWFwLnR5cGUsIG5hbWUpXHJcbiAgICAgICAgICApKSB7XHJcbiAgICAgICAgICAgIGFkZFByb3AoZWwsIG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFkZEF0dHIoZWwsIG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9uUkUudGVzdChuYW1lKSkgeyAvLyB2LW9uXHJcbiAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKG9uUkUsICcnKTtcclxuICAgICAgICAgIGFkZEhhbmRsZXIoZWwsIG5hbWUsIHZhbHVlLCBtb2RpZmllcnMsIGZhbHNlLCB3YXJuJDIpO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIG5vcm1hbCBkaXJlY3RpdmVzXHJcbiAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKGRpclJFLCAnJyk7XHJcbiAgICAgICAgICAvLyBwYXJzZSBhcmdcclxuICAgICAgICAgIHZhciBhcmdNYXRjaCA9IG5hbWUubWF0Y2goYXJnUkUpO1xyXG4gICAgICAgICAgdmFyIGFyZyA9IGFyZ01hdGNoICYmIGFyZ01hdGNoWzFdO1xyXG4gICAgICAgICAgaWYgKGFyZykge1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgwLCAtKGFyZy5sZW5ndGggKyAxKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhZGREaXJlY3RpdmUoZWwsIG5hbWUsIHJhd05hbWUsIHZhbHVlLCBhcmcsIG1vZGlmaWVycyk7XHJcbiAgICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgbmFtZSA9PT0gJ21vZGVsJykge1xyXG4gICAgICAgICAgICBjaGVja0ZvckFsaWFzTW9kZWwoZWwsIHZhbHVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gbGl0ZXJhbCBhdHRyaWJ1dGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YXIgcmVzID0gcGFyc2VUZXh0KHZhbHVlLCBkZWxpbWl0ZXJzKTtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgd2FybiQyKFxyXG4gICAgICAgICAgICAgIG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIjogXCIgK1xyXG4gICAgICAgICAgICAgICdJbnRlcnBvbGF0aW9uIGluc2lkZSBhdHRyaWJ1dGVzIGhhcyBiZWVuIHJlbW92ZWQuICcgK1xyXG4gICAgICAgICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xyXG4gICAgICAgICAgICAgICdpbnN0ZWFkIG9mIDxkaXYgaWQ9XCJ7eyB2YWwgfX1cIj4sIHVzZSA8ZGl2IDppZD1cInZhbFwiPi4nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZEF0dHIoZWwsIG5hbWUsIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgICAgICAgLy8gIzY4ODcgZmlyZWZveCBkb2Vzbid0IHVwZGF0ZSBtdXRlZCBzdGF0ZSBpZiBzZXQgdmlhIGF0dHJpYnV0ZVxyXG4gICAgICAgIC8vIGV2ZW4gaW1tZWRpYXRlbHkgYWZ0ZXIgZWxlbWVudCBjcmVhdGlvblxyXG4gICAgICAgIGlmICghZWwuY29tcG9uZW50ICYmXHJcbiAgICAgICAgICBuYW1lID09PSAnbXV0ZWQnICYmXHJcbiAgICAgICAgICBwbGF0Zm9ybU11c3RVc2VQcm9wKGVsLnRhZywgZWwuYXR0cnNNYXAudHlwZSwgbmFtZSkpIHtcclxuICAgICAgICAgIGFkZFByb3AoZWwsIG5hbWUsICd0cnVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaGVja0luRm9yKGVsKSB7XHJcbiAgICB2YXIgcGFyZW50ID0gZWw7XHJcbiAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgIGlmIChwYXJlbnQuZm9yICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlTW9kaWZpZXJzKG5hbWUpIHtcclxuICAgIHZhciBtYXRjaCA9IG5hbWUubWF0Y2gobW9kaWZpZXJSRSk7XHJcbiAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgdmFyIHJldCA9IHt9O1xyXG4gICAgICBtYXRjaC5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7IHJldFttLnNsaWNlKDEpXSA9IHRydWU7IH0pO1xyXG4gICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtYWtlQXR0cnNNYXAoYXR0cnMpIHtcclxuICAgIHZhciBtYXAgPSB7fTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgICAgIG1hcFthdHRyc1tpXS5uYW1lXSAmJiAhaXNJRSAmJiAhaXNFZGdlXHJcbiAgICAgICkge1xyXG4gICAgICAgIHdhcm4kMignZHVwbGljYXRlIGF0dHJpYnV0ZTogJyArIGF0dHJzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIG1hcFthdHRyc1tpXS5uYW1lXSA9IGF0dHJzW2ldLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hcFxyXG4gIH1cclxuXHJcbiAgLy8gZm9yIHNjcmlwdCAoZS5nLiB0eXBlPVwieC90ZW1wbGF0ZVwiKSBvciBzdHlsZSwgZG8gbm90IGRlY29kZSBjb250ZW50XHJcbiAgZnVuY3Rpb24gaXNUZXh0VGFnKGVsKSB7XHJcbiAgICByZXR1cm4gZWwudGFnID09PSAnc2NyaXB0JyB8fCBlbC50YWcgPT09ICdzdHlsZSdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzRm9yYmlkZGVuVGFnKGVsKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBlbC50YWcgPT09ICdzdHlsZScgfHxcclxuICAgICAgKGVsLnRhZyA9PT0gJ3NjcmlwdCcgJiYgKFxyXG4gICAgICAgICFlbC5hdHRyc01hcC50eXBlIHx8XHJcbiAgICAgICAgZWwuYXR0cnNNYXAudHlwZSA9PT0gJ3RleHQvamF2YXNjcmlwdCdcclxuICAgICAgKSlcclxuICAgIClcclxuICB9XHJcblxyXG4gIHZhciBpZU5TQnVnID0gL154bWxuczpOU1xcZCsvO1xyXG4gIHZhciBpZU5TUHJlZml4ID0gL15OU1xcZCs6LztcclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICBmdW5jdGlvbiBndWFyZElFU1ZHQnVnKGF0dHJzKSB7XHJcbiAgICB2YXIgcmVzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBhdHRyID0gYXR0cnNbaV07XHJcbiAgICAgIGlmICghaWVOU0J1Zy50ZXN0KGF0dHIubmFtZSkpIHtcclxuICAgICAgICBhdHRyLm5hbWUgPSBhdHRyLm5hbWUucmVwbGFjZShpZU5TUHJlZml4LCAnJyk7XHJcbiAgICAgICAgcmVzLnB1c2goYXR0cik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrRm9yQWxpYXNNb2RlbChlbCwgdmFsdWUpIHtcclxuICAgIHZhciBfZWwgPSBlbDtcclxuICAgIHdoaWxlIChfZWwpIHtcclxuICAgICAgaWYgKF9lbC5mb3IgJiYgX2VsLmFsaWFzID09PSB2YWx1ZSkge1xyXG4gICAgICAgIHdhcm4kMihcclxuICAgICAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPjogXCIgK1xyXG4gICAgICAgICAgXCJZb3UgYXJlIGJpbmRpbmcgdi1tb2RlbCBkaXJlY3RseSB0byBhIHYtZm9yIGl0ZXJhdGlvbiBhbGlhcy4gXCIgK1xyXG4gICAgICAgICAgXCJUaGlzIHdpbGwgbm90IGJlIGFibGUgdG8gbW9kaWZ5IHRoZSB2LWZvciBzb3VyY2UgYXJyYXkgYmVjYXVzZSBcIiArXHJcbiAgICAgICAgICBcIndyaXRpbmcgdG8gdGhlIGFsaWFzIGlzIGxpa2UgbW9kaWZ5aW5nIGEgZnVuY3Rpb24gbG9jYWwgdmFyaWFibGUuIFwiICtcclxuICAgICAgICAgIFwiQ29uc2lkZXIgdXNpbmcgYW4gYXJyYXkgb2Ygb2JqZWN0cyBhbmQgdXNlIHYtbW9kZWwgb24gYW4gb2JqZWN0IHByb3BlcnR5IGluc3RlYWQuXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIF9lbCA9IF9lbC5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwYW5kIGlucHV0W3YtbW9kZWxdIHdpdGggZHlhbm1pYyB0eXBlIGJpbmRpbmdzIGludG8gdi1pZi1lbHNlIGNoYWluc1xyXG4gICAqIFR1cm4gdGhpczpcclxuICAgKiAgIDxpbnB1dCB2LW1vZGVsPVwiZGF0YVt0eXBlXVwiIDp0eXBlPVwidHlwZVwiPlxyXG4gICAqIGludG8gdGhpczpcclxuICAgKiAgIDxpbnB1dCB2LWlmPVwidHlwZSA9PT0gJ2NoZWNrYm94J1wiIHR5cGU9XCJjaGVja2JveFwiIHYtbW9kZWw9XCJkYXRhW3R5cGVdXCI+XHJcbiAgICogICA8aW5wdXQgdi1lbHNlLWlmPVwidHlwZSA9PT0gJ3JhZGlvJ1wiIHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJkYXRhW3R5cGVdXCI+XHJcbiAgICogICA8aW5wdXQgdi1lbHNlIDp0eXBlPVwidHlwZVwiIHYtbW9kZWw9XCJkYXRhW3R5cGVdXCI+XHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIHByZVRyYW5zZm9ybU5vZGUoZWwsIG9wdGlvbnMpIHtcclxuICAgIGlmIChlbC50YWcgPT09ICdpbnB1dCcpIHtcclxuICAgICAgdmFyIG1hcCA9IGVsLmF0dHJzTWFwO1xyXG4gICAgICBpZiAoIW1hcFsndi1tb2RlbCddKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB0eXBlQmluZGluZztcclxuICAgICAgaWYgKG1hcFsnOnR5cGUnXSB8fCBtYXBbJ3YtYmluZDp0eXBlJ10pIHtcclxuICAgICAgICB0eXBlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndHlwZScpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbWFwLnR5cGUgJiYgIXR5cGVCaW5kaW5nICYmIG1hcFsndi1iaW5kJ10pIHtcclxuICAgICAgICB0eXBlQmluZGluZyA9IFwiKFwiICsgKG1hcFsndi1iaW5kJ10pICsgXCIpLnR5cGVcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVCaW5kaW5nKSB7XHJcbiAgICAgICAgdmFyIGlmQ29uZGl0aW9uID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtaWYnLCB0cnVlKTtcclxuICAgICAgICB2YXIgaWZDb25kaXRpb25FeHRyYSA9IGlmQ29uZGl0aW9uID8gKFwiJiYoXCIgKyBpZkNvbmRpdGlvbiArIFwiKVwiKSA6IFwiXCI7XHJcbiAgICAgICAgdmFyIGhhc0Vsc2UgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1lbHNlJywgdHJ1ZSkgIT0gbnVsbDtcclxuICAgICAgICB2YXIgZWxzZUlmQ29uZGl0aW9uID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtZWxzZS1pZicsIHRydWUpO1xyXG4gICAgICAgIC8vIDEuIGNoZWNrYm94XHJcbiAgICAgICAgdmFyIGJyYW5jaDAgPSBjbG9uZUFTVEVsZW1lbnQoZWwpO1xyXG4gICAgICAgIC8vIHByb2Nlc3MgZm9yIG9uIHRoZSBtYWluIG5vZGVcclxuICAgICAgICBwcm9jZXNzRm9yKGJyYW5jaDApO1xyXG4gICAgICAgIGFkZFJhd0F0dHIoYnJhbmNoMCwgJ3R5cGUnLCAnY2hlY2tib3gnKTtcclxuICAgICAgICBwcm9jZXNzRWxlbWVudChicmFuY2gwLCBvcHRpb25zKTtcclxuICAgICAgICBicmFuY2gwLnByb2Nlc3NlZCA9IHRydWU7IC8vIHByZXZlbnQgaXQgZnJvbSBkb3VibGUtcHJvY2Vzc2VkXHJcbiAgICAgICAgYnJhbmNoMC5pZiA9IFwiKFwiICsgdHlwZUJpbmRpbmcgKyBcIik9PT0nY2hlY2tib3gnXCIgKyBpZkNvbmRpdGlvbkV4dHJhO1xyXG4gICAgICAgIGFkZElmQ29uZGl0aW9uKGJyYW5jaDAsIHtcclxuICAgICAgICAgIGV4cDogYnJhbmNoMC5pZixcclxuICAgICAgICAgIGJsb2NrOiBicmFuY2gwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gMi4gYWRkIHJhZGlvIGVsc2UtaWYgY29uZGl0aW9uXHJcbiAgICAgICAgdmFyIGJyYW5jaDEgPSBjbG9uZUFTVEVsZW1lbnQoZWwpO1xyXG4gICAgICAgIGdldEFuZFJlbW92ZUF0dHIoYnJhbmNoMSwgJ3YtZm9yJywgdHJ1ZSk7XHJcbiAgICAgICAgYWRkUmF3QXR0cihicmFuY2gxLCAndHlwZScsICdyYWRpbycpO1xyXG4gICAgICAgIHByb2Nlc3NFbGVtZW50KGJyYW5jaDEsIG9wdGlvbnMpO1xyXG4gICAgICAgIGFkZElmQ29uZGl0aW9uKGJyYW5jaDAsIHtcclxuICAgICAgICAgIGV4cDogXCIoXCIgKyB0eXBlQmluZGluZyArIFwiKT09PSdyYWRpbydcIiArIGlmQ29uZGl0aW9uRXh0cmEsXHJcbiAgICAgICAgICBibG9jazogYnJhbmNoMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIDMuIG90aGVyXHJcbiAgICAgICAgdmFyIGJyYW5jaDIgPSBjbG9uZUFTVEVsZW1lbnQoZWwpO1xyXG4gICAgICAgIGdldEFuZFJlbW92ZUF0dHIoYnJhbmNoMiwgJ3YtZm9yJywgdHJ1ZSk7XHJcbiAgICAgICAgYWRkUmF3QXR0cihicmFuY2gyLCAnOnR5cGUnLCB0eXBlQmluZGluZyk7XHJcbiAgICAgICAgcHJvY2Vzc0VsZW1lbnQoYnJhbmNoMiwgb3B0aW9ucyk7XHJcbiAgICAgICAgYWRkSWZDb25kaXRpb24oYnJhbmNoMCwge1xyXG4gICAgICAgICAgZXhwOiBpZkNvbmRpdGlvbixcclxuICAgICAgICAgIGJsb2NrOiBicmFuY2gyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChoYXNFbHNlKSB7XHJcbiAgICAgICAgICBicmFuY2gwLmVsc2UgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxzZUlmQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgICBicmFuY2gwLmVsc2VpZiA9IGVsc2VJZkNvbmRpdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBicmFuY2gwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsb25lQVNURWxlbWVudChlbCkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZUFTVEVsZW1lbnQoZWwudGFnLCBlbC5hdHRyc0xpc3Quc2xpY2UoKSwgZWwucGFyZW50KVxyXG4gIH1cclxuXHJcbiAgdmFyIG1vZGVsJDIgPSB7XHJcbiAgICBwcmVUcmFuc2Zvcm1Ob2RlOiBwcmVUcmFuc2Zvcm1Ob2RlXHJcbiAgfVxyXG5cclxuICB2YXIgbW9kdWxlcyQxID0gW1xyXG4gICAga2xhc3MkMSxcclxuICAgIHN0eWxlJDEsXHJcbiAgICBtb2RlbCQyXHJcbiAgXVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gdGV4dChlbCwgZGlyKSB7XHJcbiAgICBpZiAoZGlyLnZhbHVlKSB7XHJcbiAgICAgIGFkZFByb3AoZWwsICd0ZXh0Q29udGVudCcsIChcIl9zKFwiICsgKGRpci52YWx1ZSkgKyBcIilcIikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGh0bWwoZWwsIGRpcikge1xyXG4gICAgaWYgKGRpci52YWx1ZSkge1xyXG4gICAgICBhZGRQcm9wKGVsLCAnaW5uZXJIVE1MJywgKFwiX3MoXCIgKyAoZGlyLnZhbHVlKSArIFwiKVwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgZGlyZWN0aXZlcyQxID0ge1xyXG4gICAgbW9kZWw6IG1vZGVsLFxyXG4gICAgdGV4dDogdGV4dCxcclxuICAgIGh0bWw6IGh0bWxcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgYmFzZU9wdGlvbnMgPSB7XHJcbiAgICBleHBlY3RIVE1MOiB0cnVlLFxyXG4gICAgbW9kdWxlczogbW9kdWxlcyQxLFxyXG4gICAgZGlyZWN0aXZlczogZGlyZWN0aXZlcyQxLFxyXG4gICAgaXNQcmVUYWc6IGlzUHJlVGFnLFxyXG4gICAgaXNVbmFyeVRhZzogaXNVbmFyeVRhZyxcclxuICAgIG11c3RVc2VQcm9wOiBtdXN0VXNlUHJvcCxcclxuICAgIGNhbkJlTGVmdE9wZW5UYWc6IGNhbkJlTGVmdE9wZW5UYWcsXHJcbiAgICBpc1Jlc2VydmVkVGFnOiBpc1Jlc2VydmVkVGFnLFxyXG4gICAgZ2V0VGFnTmFtZXNwYWNlOiBnZXRUYWdOYW1lc3BhY2UsXHJcbiAgICBzdGF0aWNLZXlzOiBnZW5TdGF0aWNLZXlzKG1vZHVsZXMkMSlcclxuICB9O1xyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIGlzU3RhdGljS2V5O1xyXG4gIHZhciBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWc7XHJcblxyXG4gIHZhciBnZW5TdGF0aWNLZXlzQ2FjaGVkID0gY2FjaGVkKGdlblN0YXRpY0tleXMkMSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdvYWwgb2YgdGhlIG9wdGltaXplcjogd2FsayB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlIEFTVCB0cmVlXHJcbiAgICogYW5kIGRldGVjdCBzdWItdHJlZXMgdGhhdCBhcmUgcHVyZWx5IHN0YXRpYywgaS5lLiBwYXJ0cyBvZlxyXG4gICAqIHRoZSBET00gdGhhdCBuZXZlciBuZWVkcyB0byBjaGFuZ2UuXHJcbiAgICpcclxuICAgKiBPbmNlIHdlIGRldGVjdCB0aGVzZSBzdWItdHJlZXMsIHdlIGNhbjpcclxuICAgKlxyXG4gICAqIDEuIEhvaXN0IHRoZW0gaW50byBjb25zdGFudHMsIHNvIHRoYXQgd2Ugbm8gbG9uZ2VyIG5lZWQgdG9cclxuICAgKiAgICBjcmVhdGUgZnJlc2ggbm9kZXMgZm9yIHRoZW0gb24gZWFjaCByZS1yZW5kZXI7XHJcbiAgICogMi4gQ29tcGxldGVseSBza2lwIHRoZW0gaW4gdGhlIHBhdGNoaW5nIHByb2Nlc3MuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gb3B0aW1pemUocm9vdCwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFyb290KSB7IHJldHVybiB9XHJcbiAgICBpc1N0YXRpY0tleSA9IGdlblN0YXRpY0tleXNDYWNoZWQob3B0aW9ucy5zdGF0aWNLZXlzIHx8ICcnKTtcclxuICAgIGlzUGxhdGZvcm1SZXNlcnZlZFRhZyA9IG9wdGlvbnMuaXNSZXNlcnZlZFRhZyB8fCBubztcclxuICAgIC8vIGZpcnN0IHBhc3M6IG1hcmsgYWxsIG5vbi1zdGF0aWMgbm9kZXMuXHJcbiAgICBtYXJrU3RhdGljJDEocm9vdCk7XHJcbiAgICAvLyBzZWNvbmQgcGFzczogbWFyayBzdGF0aWMgcm9vdHMuXHJcbiAgICBtYXJrU3RhdGljUm9vdHMocm9vdCwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuU3RhdGljS2V5cyQxKGtleXMpIHtcclxuICAgIHJldHVybiBtYWtlTWFwKFxyXG4gICAgICAndHlwZSx0YWcsYXR0cnNMaXN0LGF0dHJzTWFwLHBsYWluLHBhcmVudCxjaGlsZHJlbixhdHRycycgK1xyXG4gICAgICAoa2V5cyA/ICcsJyArIGtleXMgOiAnJylcclxuICAgIClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1hcmtTdGF0aWMkMShub2RlKSB7XHJcbiAgICBub2RlLnN0YXRpYyA9IGlzU3RhdGljKG5vZGUpO1xyXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gMSkge1xyXG4gICAgICAvLyBkbyBub3QgbWFrZSBjb21wb25lbnQgc2xvdCBjb250ZW50IHN0YXRpYy4gdGhpcyBhdm9pZHNcclxuICAgICAgLy8gMS4gY29tcG9uZW50cyBub3QgYWJsZSB0byBtdXRhdGUgc2xvdCBub2Rlc1xyXG4gICAgICAvLyAyLiBzdGF0aWMgc2xvdCBjb250ZW50IGZhaWxzIGZvciBob3QtcmVsb2FkaW5nXHJcbiAgICAgIGlmIChcclxuICAgICAgICAhaXNQbGF0Zm9ybVJlc2VydmVkVGFnKG5vZGUudGFnKSAmJlxyXG4gICAgICAgIG5vZGUudGFnICE9PSAnc2xvdCcgJiZcclxuICAgICAgICBub2RlLmF0dHJzTWFwWydpbmxpbmUtdGVtcGxhdGUnXSA9PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIG1hcmtTdGF0aWMkMShjaGlsZCk7XHJcbiAgICAgICAgaWYgKCFjaGlsZC5zdGF0aWMpIHtcclxuICAgICAgICAgIG5vZGUuc3RhdGljID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChub2RlLmlmQ29uZGl0aW9ucykge1xyXG4gICAgICAgIGZvciAodmFyIGkkMSA9IDEsIGwkMSA9IG5vZGUuaWZDb25kaXRpb25zLmxlbmd0aDsgaSQxIDwgbCQxOyBpJDErKykge1xyXG4gICAgICAgICAgdmFyIGJsb2NrID0gbm9kZS5pZkNvbmRpdGlvbnNbaSQxXS5ibG9jaztcclxuICAgICAgICAgIG1hcmtTdGF0aWMkMShibG9jayk7XHJcbiAgICAgICAgICBpZiAoIWJsb2NrLnN0YXRpYykge1xyXG4gICAgICAgICAgICBub2RlLnN0YXRpYyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFya1N0YXRpY1Jvb3RzKG5vZGUsIGlzSW5Gb3IpIHtcclxuICAgIGlmIChub2RlLnR5cGUgPT09IDEpIHtcclxuICAgICAgaWYgKG5vZGUuc3RhdGljIHx8IG5vZGUub25jZSkge1xyXG4gICAgICAgIG5vZGUuc3RhdGljSW5Gb3IgPSBpc0luRm9yO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEZvciBhIG5vZGUgdG8gcXVhbGlmeSBhcyBhIHN0YXRpYyByb290LCBpdCBzaG91bGQgaGF2ZSBjaGlsZHJlbiB0aGF0XHJcbiAgICAgIC8vIGFyZSBub3QganVzdCBzdGF0aWMgdGV4dC4gT3RoZXJ3aXNlIHRoZSBjb3N0IG9mIGhvaXN0aW5nIG91dCB3aWxsXHJcbiAgICAgIC8vIG91dHdlaWdoIHRoZSBiZW5lZml0cyBhbmQgaXQncyBiZXR0ZXIgb2ZmIHRvIGp1c3QgYWx3YXlzIHJlbmRlciBpdCBmcmVzaC5cclxuICAgICAgaWYgKG5vZGUuc3RhdGljICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoICYmICEoXHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDEgJiZcclxuICAgICAgICBub2RlLmNoaWxkcmVuWzBdLnR5cGUgPT09IDNcclxuICAgICAgKSkge1xyXG4gICAgICAgIG5vZGUuc3RhdGljUm9vdCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZS5zdGF0aWNSb290ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICBtYXJrU3RhdGljUm9vdHMobm9kZS5jaGlsZHJlbltpXSwgaXNJbkZvciB8fCAhIW5vZGUuZm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5vZGUuaWZDb25kaXRpb25zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSQxID0gMSwgbCQxID0gbm9kZS5pZkNvbmRpdGlvbnMubGVuZ3RoOyBpJDEgPCBsJDE7IGkkMSsrKSB7XHJcbiAgICAgICAgICBtYXJrU3RhdGljUm9vdHMobm9kZS5pZkNvbmRpdGlvbnNbaSQxXS5ibG9jaywgaXNJbkZvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1N0YXRpYyhub2RlKSB7XHJcbiAgICBpZiAobm9kZS50eXBlID09PSAyKSB7IC8vIGV4cHJlc3Npb25cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS50eXBlID09PSAzKSB7IC8vIHRleHRcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiAhIShub2RlLnByZSB8fCAoXHJcbiAgICAgICFub2RlLmhhc0JpbmRpbmdzICYmIC8vIG5vIGR5bmFtaWMgYmluZGluZ3NcclxuICAgICAgIW5vZGUuaWYgJiYgIW5vZGUuZm9yICYmIC8vIG5vdCB2LWlmIG9yIHYtZm9yIG9yIHYtZWxzZVxyXG4gICAgICAhaXNCdWlsdEluVGFnKG5vZGUudGFnKSAmJiAvLyBub3QgYSBidWlsdC1pblxyXG4gICAgICBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWcobm9kZS50YWcpICYmIC8vIG5vdCBhIGNvbXBvbmVudFxyXG4gICAgICAhaXNEaXJlY3RDaGlsZE9mVGVtcGxhdGVGb3Iobm9kZSkgJiZcclxuICAgICAgT2JqZWN0LmtleXMobm9kZSkuZXZlcnkoaXNTdGF0aWNLZXkpXHJcbiAgICApKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNEaXJlY3RDaGlsZE9mVGVtcGxhdGVGb3Iobm9kZSkge1xyXG4gICAgd2hpbGUgKG5vZGUucGFyZW50KSB7XHJcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudDtcclxuICAgICAgaWYgKG5vZGUudGFnICE9PSAndGVtcGxhdGUnKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5vZGUuZm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIGZuRXhwUkUgPSAvXihbXFx3JF9dK3xcXChbXildKj9cXCkpXFxzKj0+fF5mdW5jdGlvblxccypcXCgvO1xyXG4gIHZhciBzaW1wbGVQYXRoUkUgPSAvXltBLVphLXpfJF1bXFx3JF0qKD86XFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJ1teJ10qPyddfFxcW1wiW15cIl0qP1wiXXxcXFtcXGQrXXxcXFtbQS1aYS16XyRdW1xcdyRdKl0pKiQvO1xyXG5cclxuICAvLyBLZXlib2FyZEV2ZW50LmtleUNvZGUgYWxpYXNlc1xyXG4gIHZhciBrZXlDb2RlcyA9IHtcclxuICAgIGVzYzogMjcsXHJcbiAgICB0YWI6IDksXHJcbiAgICBlbnRlcjogMTMsXHJcbiAgICBzcGFjZTogMzIsXHJcbiAgICB1cDogMzgsXHJcbiAgICBsZWZ0OiAzNyxcclxuICAgIHJpZ2h0OiAzOSxcclxuICAgIGRvd246IDQwLFxyXG4gICAgJ2RlbGV0ZSc6IFs4LCA0Nl1cclxuICB9O1xyXG5cclxuICAvLyBLZXlib2FyZEV2ZW50LmtleSBhbGlhc2VzXHJcbiAgdmFyIGtleU5hbWVzID0ge1xyXG4gICAgZXNjOiAnRXNjYXBlJyxcclxuICAgIHRhYjogJ1RhYicsXHJcbiAgICBlbnRlcjogJ0VudGVyJyxcclxuICAgIHNwYWNlOiAnICcsXHJcbiAgICAvLyAjNzgwNjogSUUxMSB1c2VzIGtleSBuYW1lcyB3aXRob3V0IGBBcnJvd2AgcHJlZml4IGZvciBhcnJvdyBrZXlzLlxyXG4gICAgdXA6IFsnVXAnLCAnQXJyb3dVcCddLFxyXG4gICAgbGVmdDogWydMZWZ0JywgJ0Fycm93TGVmdCddLFxyXG4gICAgcmlnaHQ6IFsnUmlnaHQnLCAnQXJyb3dSaWdodCddLFxyXG4gICAgZG93bjogWydEb3duJywgJ0Fycm93RG93biddLFxyXG4gICAgJ2RlbGV0ZSc6IFsnQmFja3NwYWNlJywgJ0RlbGV0ZSddXHJcbiAgfTtcclxuXHJcbiAgLy8gIzQ4Njg6IG1vZGlmaWVycyB0aGF0IHByZXZlbnQgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgbGlzdGVuZXJcclxuICAvLyBuZWVkIHRvIGV4cGxpY2l0bHkgcmV0dXJuIG51bGwgc28gdGhhdCB3ZSBjYW4gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gcmVtb3ZlXHJcbiAgLy8gdGhlIGxpc3RlbmVyIGZvciAub25jZVxyXG4gIHZhciBnZW5HdWFyZCA9IGZ1bmN0aW9uIChjb25kaXRpb24pIHsgcmV0dXJuIChcImlmKFwiICsgY29uZGl0aW9uICsgXCIpcmV0dXJuIG51bGw7XCIpOyB9O1xyXG5cclxuICB2YXIgbW9kaWZpZXJDb2RlID0ge1xyXG4gICAgc3RvcDogJyRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsnLFxyXG4gICAgcHJldmVudDogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpOycsXHJcbiAgICBzZWxmOiBnZW5HdWFyZChcIiRldmVudC50YXJnZXQgIT09ICRldmVudC5jdXJyZW50VGFyZ2V0XCIpLFxyXG4gICAgY3RybDogZ2VuR3VhcmQoXCIhJGV2ZW50LmN0cmxLZXlcIiksXHJcbiAgICBzaGlmdDogZ2VuR3VhcmQoXCIhJGV2ZW50LnNoaWZ0S2V5XCIpLFxyXG4gICAgYWx0OiBnZW5HdWFyZChcIiEkZXZlbnQuYWx0S2V5XCIpLFxyXG4gICAgbWV0YTogZ2VuR3VhcmQoXCIhJGV2ZW50Lm1ldGFLZXlcIiksXHJcbiAgICBsZWZ0OiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAwXCIpLFxyXG4gICAgbWlkZGxlOiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAxXCIpLFxyXG4gICAgcmlnaHQ6IGdlbkd1YXJkKFwiJ2J1dHRvbicgaW4gJGV2ZW50ICYmICRldmVudC5idXR0b24gIT09IDJcIilcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBnZW5IYW5kbGVycyhcclxuICAgIGV2ZW50cyxcclxuICAgIGlzTmF0aXZlLFxyXG4gICAgd2FyblxyXG4gICkge1xyXG4gICAgdmFyIHJlcyA9IGlzTmF0aXZlID8gJ25hdGl2ZU9uOnsnIDogJ29uOnsnO1xyXG4gICAgZm9yICh2YXIgbmFtZSBpbiBldmVudHMpIHtcclxuICAgICAgcmVzICs9IFwiXFxcIlwiICsgbmFtZSArIFwiXFxcIjpcIiArIChnZW5IYW5kbGVyKG5hbWUsIGV2ZW50c1tuYW1lXSkpICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKSArICd9J1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuSGFuZGxlcihcclxuICAgIG5hbWUsXHJcbiAgICBoYW5kbGVyXHJcbiAgKSB7XHJcbiAgICBpZiAoIWhhbmRsZXIpIHtcclxuICAgICAgcmV0dXJuICdmdW5jdGlvbigpe30nXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcikpIHtcclxuICAgICAgcmV0dXJuIChcIltcIiArIChoYW5kbGVyLm1hcChmdW5jdGlvbiAoaGFuZGxlcikgeyByZXR1cm4gZ2VuSGFuZGxlcihuYW1lLCBoYW5kbGVyKTsgfSkuam9pbignLCcpKSArIFwiXVwiKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBpc01ldGhvZFBhdGggPSBzaW1wbGVQYXRoUkUudGVzdChoYW5kbGVyLnZhbHVlKTtcclxuICAgIHZhciBpc0Z1bmN0aW9uRXhwcmVzc2lvbiA9IGZuRXhwUkUudGVzdChoYW5kbGVyLnZhbHVlKTtcclxuXHJcbiAgICBpZiAoIWhhbmRsZXIubW9kaWZpZXJzKSB7XHJcbiAgICAgIGlmIChpc01ldGhvZFBhdGggfHwgaXNGdW5jdGlvbkV4cHJlc3Npb24pIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlci52YWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICByZXR1cm4gKFwiZnVuY3Rpb24oJGV2ZW50KXtcIiArIChoYW5kbGVyLnZhbHVlKSArIFwifVwiKSAvLyBpbmxpbmUgc3RhdGVtZW50XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgY29kZSA9ICcnO1xyXG4gICAgICB2YXIgZ2VuTW9kaWZpZXJDb2RlID0gJyc7XHJcbiAgICAgIHZhciBrZXlzID0gW107XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBoYW5kbGVyLm1vZGlmaWVycykge1xyXG4gICAgICAgIGlmIChtb2RpZmllckNvZGVba2V5XSkge1xyXG4gICAgICAgICAgZ2VuTW9kaWZpZXJDb2RlICs9IG1vZGlmaWVyQ29kZVtrZXldO1xyXG4gICAgICAgICAgLy8gbGVmdC9yaWdodFxyXG4gICAgICAgICAgaWYgKGtleUNvZGVzW2tleV0pIHtcclxuICAgICAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdleGFjdCcpIHtcclxuICAgICAgICAgIHZhciBtb2RpZmllcnMgPSAoaGFuZGxlci5tb2RpZmllcnMpO1xyXG4gICAgICAgICAgZ2VuTW9kaWZpZXJDb2RlICs9IGdlbkd1YXJkKFxyXG4gICAgICAgICAgICBbJ2N0cmwnLCAnc2hpZnQnLCAnYWx0JywgJ21ldGEnXVxyXG4gICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGtleU1vZGlmaWVyKSB7IHJldHVybiAhbW9kaWZpZXJzW2tleU1vZGlmaWVyXTsgfSlcclxuICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXlNb2RpZmllcikgeyByZXR1cm4gKFwiJGV2ZW50LlwiICsga2V5TW9kaWZpZXIgKyBcIktleVwiKTsgfSlcclxuICAgICAgICAgICAgICAuam9pbignfHwnKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChrZXlzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvZGUgKz0gZ2VuS2V5RmlsdGVyKGtleXMpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBtb2RpZmllcnMgbGlrZSBwcmV2ZW50IGFuZCBzdG9wIGdldCBleGVjdXRlZCBhZnRlciBrZXkgZmlsdGVyaW5nXHJcbiAgICAgIGlmIChnZW5Nb2RpZmllckNvZGUpIHtcclxuICAgICAgICBjb2RlICs9IGdlbk1vZGlmaWVyQ29kZTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgaGFuZGxlckNvZGUgPSBpc01ldGhvZFBhdGhcclxuICAgICAgICA/IChcInJldHVybiBcIiArIChoYW5kbGVyLnZhbHVlKSArIFwiKCRldmVudClcIilcclxuICAgICAgICA6IGlzRnVuY3Rpb25FeHByZXNzaW9uXHJcbiAgICAgICAgICA/IChcInJldHVybiAoXCIgKyAoaGFuZGxlci52YWx1ZSkgKyBcIikoJGV2ZW50KVwiKVxyXG4gICAgICAgICAgOiBoYW5kbGVyLnZhbHVlO1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgcmV0dXJuIChcImZ1bmN0aW9uKCRldmVudCl7XCIgKyBjb2RlICsgaGFuZGxlckNvZGUgKyBcIn1cIilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbktleUZpbHRlcihrZXlzKSB7XHJcbiAgICByZXR1cm4gKFwiaWYoISgnYnV0dG9uJyBpbiAkZXZlbnQpJiZcIiArIChrZXlzLm1hcChnZW5GaWx0ZXJDb2RlKS5qb2luKCcmJicpKSArIFwiKXJldHVybiBudWxsO1wiKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuRmlsdGVyQ29kZShrZXkpIHtcclxuICAgIHZhciBrZXlWYWwgPSBwYXJzZUludChrZXksIDEwKTtcclxuICAgIGlmIChrZXlWYWwpIHtcclxuICAgICAgcmV0dXJuIChcIiRldmVudC5rZXlDb2RlIT09XCIgKyBrZXlWYWwpXHJcbiAgICB9XHJcbiAgICB2YXIga2V5Q29kZSA9IGtleUNvZGVzW2tleV07XHJcbiAgICB2YXIga2V5TmFtZSA9IGtleU5hbWVzW2tleV07XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBcIl9rKCRldmVudC5rZXlDb2RlLFwiICtcclxuICAgICAgKEpTT04uc3RyaW5naWZ5KGtleSkpICsgXCIsXCIgK1xyXG4gICAgICAoSlNPTi5zdHJpbmdpZnkoa2V5Q29kZSkpICsgXCIsXCIgK1xyXG4gICAgICBcIiRldmVudC5rZXksXCIgK1xyXG4gICAgICBcIlwiICsgKEpTT04uc3RyaW5naWZ5KGtleU5hbWUpKSArXHJcbiAgICAgIFwiKVwiXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gb24oZWwsIGRpcikge1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGRpci5tb2RpZmllcnMpIHtcclxuICAgICAgd2FybihcInYtb24gd2l0aG91dCBhcmd1bWVudCBkb2VzIG5vdCBzdXBwb3J0IG1vZGlmaWVycy5cIik7XHJcbiAgICB9XHJcbiAgICBlbC53cmFwTGlzdGVuZXJzID0gZnVuY3Rpb24gKGNvZGUpIHsgcmV0dXJuIChcIl9nKFwiICsgY29kZSArIFwiLFwiICsgKGRpci52YWx1ZSkgKyBcIilcIik7IH07XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYmluZCQxKGVsLCBkaXIpIHtcclxuICAgIGVsLndyYXBEYXRhID0gZnVuY3Rpb24gKGNvZGUpIHtcclxuICAgICAgcmV0dXJuIChcIl9iKFwiICsgY29kZSArIFwiLCdcIiArIChlbC50YWcpICsgXCInLFwiICsgKGRpci52YWx1ZSkgKyBcIixcIiArIChkaXIubW9kaWZpZXJzICYmIGRpci5tb2RpZmllcnMucHJvcCA/ICd0cnVlJyA6ICdmYWxzZScpICsgKGRpci5tb2RpZmllcnMgJiYgZGlyLm1vZGlmaWVycy5zeW5jID8gJyx0cnVlJyA6ICcnKSArIFwiKVwiKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgYmFzZURpcmVjdGl2ZXMgPSB7XHJcbiAgICBvbjogb24sXHJcbiAgICBiaW5kOiBiaW5kJDEsXHJcbiAgICBjbG9hazogbm9vcFxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBDb2RlZ2VuU3RhdGUgPSBmdW5jdGlvbiBDb2RlZ2VuU3RhdGUob3B0aW9ucykge1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMud2FybiA9IG9wdGlvbnMud2FybiB8fCBiYXNlV2FybjtcclxuICAgIHRoaXMudHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtQ29kZScpO1xyXG4gICAgdGhpcy5kYXRhR2VuRm5zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICdnZW5EYXRhJyk7XHJcbiAgICB0aGlzLmRpcmVjdGl2ZXMgPSBleHRlbmQoZXh0ZW5kKHt9LCBiYXNlRGlyZWN0aXZlcyksIG9wdGlvbnMuZGlyZWN0aXZlcyk7XHJcbiAgICB2YXIgaXNSZXNlcnZlZFRhZyA9IG9wdGlvbnMuaXNSZXNlcnZlZFRhZyB8fCBubztcclxuICAgIHRoaXMubWF5YmVDb21wb25lbnQgPSBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuICFpc1Jlc2VydmVkVGFnKGVsLnRhZyk7IH07XHJcbiAgICB0aGlzLm9uY2VJZCA9IDA7XHJcbiAgICB0aGlzLnN0YXRpY1JlbmRlckZucyA9IFtdO1xyXG4gIH07XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2VuZXJhdGUoXHJcbiAgICBhc3QsXHJcbiAgICBvcHRpb25zXHJcbiAgKSB7XHJcbiAgICB2YXIgc3RhdGUgPSBuZXcgQ29kZWdlblN0YXRlKG9wdGlvbnMpO1xyXG4gICAgdmFyIGNvZGUgPSBhc3QgPyBnZW5FbGVtZW50KGFzdCwgc3RhdGUpIDogJ19jKFwiZGl2XCIpJztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlbmRlcjogKFwid2l0aCh0aGlzKXtyZXR1cm4gXCIgKyBjb2RlICsgXCJ9XCIpLFxyXG4gICAgICBzdGF0aWNSZW5kZXJGbnM6IHN0YXRlLnN0YXRpY1JlbmRlckZuc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuRWxlbWVudChlbCwgc3RhdGUpIHtcclxuICAgIGlmIChlbC5zdGF0aWNSb290ICYmICFlbC5zdGF0aWNQcm9jZXNzZWQpIHtcclxuICAgICAgcmV0dXJuIGdlblN0YXRpYyhlbCwgc3RhdGUpXHJcbiAgICB9IGVsc2UgaWYgKGVsLm9uY2UgJiYgIWVsLm9uY2VQcm9jZXNzZWQpIHtcclxuICAgICAgcmV0dXJuIGdlbk9uY2UoZWwsIHN0YXRlKVxyXG4gICAgfSBlbHNlIGlmIChlbC5mb3IgJiYgIWVsLmZvclByb2Nlc3NlZCkge1xyXG4gICAgICByZXR1cm4gZ2VuRm9yKGVsLCBzdGF0ZSlcclxuICAgIH0gZWxzZSBpZiAoZWwuaWYgJiYgIWVsLmlmUHJvY2Vzc2VkKSB7XHJcbiAgICAgIHJldHVybiBnZW5JZihlbCwgc3RhdGUpXHJcbiAgICB9IGVsc2UgaWYgKGVsLnRhZyA9PT0gJ3RlbXBsYXRlJyAmJiAhZWwuc2xvdFRhcmdldCkge1xyXG4gICAgICByZXR1cm4gZ2VuQ2hpbGRyZW4oZWwsIHN0YXRlKSB8fCAndm9pZCAwJ1xyXG4gICAgfSBlbHNlIGlmIChlbC50YWcgPT09ICdzbG90Jykge1xyXG4gICAgICByZXR1cm4gZ2VuU2xvdChlbCwgc3RhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb21wb25lbnQgb3IgZWxlbWVudFxyXG4gICAgICB2YXIgY29kZTtcclxuICAgICAgaWYgKGVsLmNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvZGUgPSBnZW5Db21wb25lbnQoZWwuY29tcG9uZW50LCBlbCwgc3RhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBkYXRhID0gZWwucGxhaW4gPyB1bmRlZmluZWQgOiBnZW5EYXRhJDIoZWwsIHN0YXRlKTtcclxuXHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gZWwuaW5saW5lVGVtcGxhdGUgPyBudWxsIDogZ2VuQ2hpbGRyZW4oZWwsIHN0YXRlLCB0cnVlKTtcclxuICAgICAgICBjb2RlID0gXCJfYygnXCIgKyAoZWwudGFnKSArIFwiJ1wiICsgKGRhdGEgPyAoXCIsXCIgKyBkYXRhKSA6ICcnKSArIChjaGlsZHJlbiA/IChcIixcIiArIGNoaWxkcmVuKSA6ICcnKSArIFwiKVwiO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIG1vZHVsZSB0cmFuc2Zvcm1zXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGUudHJhbnNmb3Jtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvZGUgPSBzdGF0ZS50cmFuc2Zvcm1zW2ldKGVsLCBjb2RlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29kZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaG9pc3Qgc3RhdGljIHN1Yi10cmVlcyBvdXRcclxuICBmdW5jdGlvbiBnZW5TdGF0aWMoZWwsIHN0YXRlKSB7XHJcbiAgICBlbC5zdGF0aWNQcm9jZXNzZWQgPSB0cnVlO1xyXG4gICAgc3RhdGUuc3RhdGljUmVuZGVyRm5zLnB1c2goKFwid2l0aCh0aGlzKXtyZXR1cm4gXCIgKyAoZ2VuRWxlbWVudChlbCwgc3RhdGUpKSArIFwifVwiKSk7XHJcbiAgICByZXR1cm4gKFwiX20oXCIgKyAoc3RhdGUuc3RhdGljUmVuZGVyRm5zLmxlbmd0aCAtIDEpICsgKGVsLnN0YXRpY0luRm9yID8gJyx0cnVlJyA6ICcnKSArIFwiKVwiKVxyXG4gIH1cclxuXHJcbiAgLy8gdi1vbmNlXHJcbiAgZnVuY3Rpb24gZ2VuT25jZShlbCwgc3RhdGUpIHtcclxuICAgIGVsLm9uY2VQcm9jZXNzZWQgPSB0cnVlO1xyXG4gICAgaWYgKGVsLmlmICYmICFlbC5pZlByb2Nlc3NlZCkge1xyXG4gICAgICByZXR1cm4gZ2VuSWYoZWwsIHN0YXRlKVxyXG4gICAgfSBlbHNlIGlmIChlbC5zdGF0aWNJbkZvcikge1xyXG4gICAgICB2YXIga2V5ID0gJyc7XHJcbiAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQ7XHJcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICBpZiAocGFyZW50LmZvcikge1xyXG4gICAgICAgICAga2V5ID0gcGFyZW50LmtleTtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFrZXkpIHtcclxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBzdGF0ZS53YXJuKFxyXG4gICAgICAgICAgXCJ2LW9uY2UgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgdi1mb3IgdGhhdCBpcyBrZXllZC4gXCJcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBnZW5FbGVtZW50KGVsLCBzdGF0ZSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gKFwiX28oXCIgKyAoZ2VuRWxlbWVudChlbCwgc3RhdGUpKSArIFwiLFwiICsgKHN0YXRlLm9uY2VJZCsrKSArIFwiLFwiICsga2V5ICsgXCIpXCIpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZ2VuU3RhdGljKGVsLCBzdGF0ZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbklmKFxyXG4gICAgZWwsXHJcbiAgICBzdGF0ZSxcclxuICAgIGFsdEdlbixcclxuICAgIGFsdEVtcHR5XHJcbiAgKSB7XHJcbiAgICBlbC5pZlByb2Nlc3NlZCA9IHRydWU7IC8vIGF2b2lkIHJlY3Vyc2lvblxyXG4gICAgcmV0dXJuIGdlbklmQ29uZGl0aW9ucyhlbC5pZkNvbmRpdGlvbnMuc2xpY2UoKSwgc3RhdGUsIGFsdEdlbiwgYWx0RW1wdHkpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5JZkNvbmRpdGlvbnMoXHJcbiAgICBjb25kaXRpb25zLFxyXG4gICAgc3RhdGUsXHJcbiAgICBhbHRHZW4sXHJcbiAgICBhbHRFbXB0eVxyXG4gICkge1xyXG4gICAgaWYgKCFjb25kaXRpb25zLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gYWx0RW1wdHkgfHwgJ19lKCknXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbmRpdGlvbiA9IGNvbmRpdGlvbnMuc2hpZnQoKTtcclxuICAgIGlmIChjb25kaXRpb24uZXhwKSB7XHJcbiAgICAgIHJldHVybiAoXCIoXCIgKyAoY29uZGl0aW9uLmV4cCkgKyBcIik/XCIgKyAoZ2VuVGVybmFyeUV4cChjb25kaXRpb24uYmxvY2spKSArIFwiOlwiICsgKGdlbklmQ29uZGl0aW9ucyhjb25kaXRpb25zLCBzdGF0ZSwgYWx0R2VuLCBhbHRFbXB0eSkpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcIlwiICsgKGdlblRlcm5hcnlFeHAoY29uZGl0aW9uLmJsb2NrKSkpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdi1pZiB3aXRoIHYtb25jZSBzaG91bGQgZ2VuZXJhdGUgY29kZSBsaWtlIChhKT9fbSgwKTpfbSgxKVxyXG4gICAgZnVuY3Rpb24gZ2VuVGVybmFyeUV4cChlbCkge1xyXG4gICAgICByZXR1cm4gYWx0R2VuXHJcbiAgICAgICAgPyBhbHRHZW4oZWwsIHN0YXRlKVxyXG4gICAgICAgIDogZWwub25jZVxyXG4gICAgICAgICAgPyBnZW5PbmNlKGVsLCBzdGF0ZSlcclxuICAgICAgICAgIDogZ2VuRWxlbWVudChlbCwgc3RhdGUpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5Gb3IoXHJcbiAgICBlbCxcclxuICAgIHN0YXRlLFxyXG4gICAgYWx0R2VuLFxyXG4gICAgYWx0SGVscGVyXHJcbiAgKSB7XHJcbiAgICB2YXIgZXhwID0gZWwuZm9yO1xyXG4gICAgdmFyIGFsaWFzID0gZWwuYWxpYXM7XHJcbiAgICB2YXIgaXRlcmF0b3IxID0gZWwuaXRlcmF0b3IxID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMSkpIDogJyc7XHJcbiAgICB2YXIgaXRlcmF0b3IyID0gZWwuaXRlcmF0b3IyID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMikpIDogJyc7XHJcblxyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXHJcbiAgICAgIHN0YXRlLm1heWJlQ29tcG9uZW50KGVsKSAmJlxyXG4gICAgICBlbC50YWcgIT09ICdzbG90JyAmJlxyXG4gICAgICBlbC50YWcgIT09ICd0ZW1wbGF0ZScgJiZcclxuICAgICAgIWVsLmtleVxyXG4gICAgKSB7XHJcbiAgICAgIHN0YXRlLndhcm4oXHJcbiAgICAgICAgXCI8XCIgKyAoZWwudGFnKSArIFwiIHYtZm9yPVxcXCJcIiArIGFsaWFzICsgXCIgaW4gXCIgKyBleHAgKyBcIlxcXCI+OiBjb21wb25lbnQgbGlzdHMgcmVuZGVyZWQgd2l0aCBcIiArXHJcbiAgICAgICAgXCJ2LWZvciBzaG91bGQgaGF2ZSBleHBsaWNpdCBrZXlzLiBcIiArXHJcbiAgICAgICAgXCJTZWUgaHR0cHM6Ly92dWVqcy5vcmcvZ3VpZGUvbGlzdC5odG1sI2tleSBmb3IgbW9yZSBpbmZvLlwiLFxyXG4gICAgICAgIHRydWUgLyogdGlwICovXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZWwuZm9yUHJvY2Vzc2VkID0gdHJ1ZTsgLy8gYXZvaWQgcmVjdXJzaW9uXHJcbiAgICByZXR1cm4gKGFsdEhlbHBlciB8fCAnX2wnKSArIFwiKChcIiArIGV4cCArIFwiKSxcIiArXHJcbiAgICAgIFwiZnVuY3Rpb24oXCIgKyBhbGlhcyArIGl0ZXJhdG9yMSArIGl0ZXJhdG9yMiArIFwiKXtcIiArXHJcbiAgICAgIFwicmV0dXJuIFwiICsgKChhbHRHZW4gfHwgZ2VuRWxlbWVudCkoZWwsIHN0YXRlKSkgK1xyXG4gICAgICAnfSknXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5EYXRhJDIoZWwsIHN0YXRlKSB7XHJcbiAgICB2YXIgZGF0YSA9ICd7JztcclxuXHJcbiAgICAvLyBkaXJlY3RpdmVzIGZpcnN0LlxyXG4gICAgLy8gZGlyZWN0aXZlcyBtYXkgbXV0YXRlIHRoZSBlbCdzIG90aGVyIHByb3BlcnRpZXMgYmVmb3JlIHRoZXkgYXJlIGdlbmVyYXRlZC5cclxuICAgIHZhciBkaXJzID0gZ2VuRGlyZWN0aXZlcyhlbCwgc3RhdGUpO1xyXG4gICAgaWYgKGRpcnMpIHsgZGF0YSArPSBkaXJzICsgJywnOyB9XHJcblxyXG4gICAgLy8ga2V5XHJcbiAgICBpZiAoZWwua2V5KSB7XHJcbiAgICAgIGRhdGEgKz0gXCJrZXk6XCIgKyAoZWwua2V5KSArIFwiLFwiO1xyXG4gICAgfVxyXG4gICAgLy8gcmVmXHJcbiAgICBpZiAoZWwucmVmKSB7XHJcbiAgICAgIGRhdGEgKz0gXCJyZWY6XCIgKyAoZWwucmVmKSArIFwiLFwiO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsLnJlZkluRm9yKSB7XHJcbiAgICAgIGRhdGEgKz0gXCJyZWZJbkZvcjp0cnVlLFwiO1xyXG4gICAgfVxyXG4gICAgLy8gcHJlXHJcbiAgICBpZiAoZWwucHJlKSB7XHJcbiAgICAgIGRhdGEgKz0gXCJwcmU6dHJ1ZSxcIjtcclxuICAgIH1cclxuICAgIC8vIHJlY29yZCBvcmlnaW5hbCB0YWcgbmFtZSBmb3IgY29tcG9uZW50cyB1c2luZyBcImlzXCIgYXR0cmlidXRlXHJcbiAgICBpZiAoZWwuY29tcG9uZW50KSB7XHJcbiAgICAgIGRhdGEgKz0gXCJ0YWc6XFxcIlwiICsgKGVsLnRhZykgKyBcIlxcXCIsXCI7XHJcbiAgICB9XHJcbiAgICAvLyBtb2R1bGUgZGF0YSBnZW5lcmF0aW9uIGZ1bmN0aW9uc1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZS5kYXRhR2VuRm5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGRhdGEgKz0gc3RhdGUuZGF0YUdlbkZuc1tpXShlbCk7XHJcbiAgICB9XHJcbiAgICAvLyBhdHRyaWJ1dGVzXHJcbiAgICBpZiAoZWwuYXR0cnMpIHtcclxuICAgICAgZGF0YSArPSBcImF0dHJzOntcIiArIChnZW5Qcm9wcyhlbC5hdHRycykpICsgXCJ9LFwiO1xyXG4gICAgfVxyXG4gICAgLy8gRE9NIHByb3BzXHJcbiAgICBpZiAoZWwucHJvcHMpIHtcclxuICAgICAgZGF0YSArPSBcImRvbVByb3BzOntcIiArIChnZW5Qcm9wcyhlbC5wcm9wcykpICsgXCJ9LFwiO1xyXG4gICAgfVxyXG4gICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgIGlmIChlbC5ldmVudHMpIHtcclxuICAgICAgZGF0YSArPSAoZ2VuSGFuZGxlcnMoZWwuZXZlbnRzLCBmYWxzZSwgc3RhdGUud2FybikpICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoZWwubmF0aXZlRXZlbnRzKSB7XHJcbiAgICAgIGRhdGEgKz0gKGdlbkhhbmRsZXJzKGVsLm5hdGl2ZUV2ZW50cywgdHJ1ZSwgc3RhdGUud2FybikpICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgICAvLyBzbG90IHRhcmdldFxyXG4gICAgLy8gb25seSBmb3Igbm9uLXNjb3BlZCBzbG90c1xyXG4gICAgaWYgKGVsLnNsb3RUYXJnZXQgJiYgIWVsLnNsb3RTY29wZSkge1xyXG4gICAgICBkYXRhICs9IFwic2xvdDpcIiArIChlbC5zbG90VGFyZ2V0KSArIFwiLFwiO1xyXG4gICAgfVxyXG4gICAgLy8gc2NvcGVkIHNsb3RzXHJcbiAgICBpZiAoZWwuc2NvcGVkU2xvdHMpIHtcclxuICAgICAgZGF0YSArPSAoZ2VuU2NvcGVkU2xvdHMoZWwuc2NvcGVkU2xvdHMsIHN0YXRlKSkgKyBcIixcIjtcclxuICAgIH1cclxuICAgIC8vIGNvbXBvbmVudCB2LW1vZGVsXHJcbiAgICBpZiAoZWwubW9kZWwpIHtcclxuICAgICAgZGF0YSArPSBcIm1vZGVsOnt2YWx1ZTpcIiArIChlbC5tb2RlbC52YWx1ZSkgKyBcIixjYWxsYmFjazpcIiArIChlbC5tb2RlbC5jYWxsYmFjaykgKyBcIixleHByZXNzaW9uOlwiICsgKGVsLm1vZGVsLmV4cHJlc3Npb24pICsgXCJ9LFwiO1xyXG4gICAgfVxyXG4gICAgLy8gaW5saW5lLXRlbXBsYXRlXHJcbiAgICBpZiAoZWwuaW5saW5lVGVtcGxhdGUpIHtcclxuICAgICAgdmFyIGlubGluZVRlbXBsYXRlID0gZ2VuSW5saW5lVGVtcGxhdGUoZWwsIHN0YXRlKTtcclxuICAgICAgaWYgKGlubGluZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgZGF0YSArPSBpbmxpbmVUZW1wbGF0ZSArIFwiLFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC8sJC8sICcnKSArICd9JztcclxuICAgIC8vIHYtYmluZCBkYXRhIHdyYXBcclxuICAgIGlmIChlbC53cmFwRGF0YSkge1xyXG4gICAgICBkYXRhID0gZWwud3JhcERhdGEoZGF0YSk7XHJcbiAgICB9XHJcbiAgICAvLyB2LW9uIGRhdGEgd3JhcFxyXG4gICAgaWYgKGVsLndyYXBMaXN0ZW5lcnMpIHtcclxuICAgICAgZGF0YSA9IGVsLndyYXBMaXN0ZW5lcnMoZGF0YSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuRGlyZWN0aXZlcyhlbCwgc3RhdGUpIHtcclxuICAgIHZhciBkaXJzID0gZWwuZGlyZWN0aXZlcztcclxuICAgIGlmICghZGlycykgeyByZXR1cm4gfVxyXG4gICAgdmFyIHJlcyA9ICdkaXJlY3RpdmVzOlsnO1xyXG4gICAgdmFyIGhhc1J1bnRpbWUgPSBmYWxzZTtcclxuICAgIHZhciBpLCBsLCBkaXIsIG5lZWRSdW50aW1lO1xyXG4gICAgZm9yIChpID0gMCwgbCA9IGRpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGRpciA9IGRpcnNbaV07XHJcbiAgICAgIG5lZWRSdW50aW1lID0gdHJ1ZTtcclxuICAgICAgdmFyIGdlbiA9IHN0YXRlLmRpcmVjdGl2ZXNbZGlyLm5hbWVdO1xyXG4gICAgICBpZiAoZ2VuKSB7XHJcbiAgICAgICAgLy8gY29tcGlsZS10aW1lIGRpcmVjdGl2ZSB0aGF0IG1hbmlwdWxhdGVzIEFTVC5cclxuICAgICAgICAvLyByZXR1cm5zIHRydWUgaWYgaXQgYWxzbyBuZWVkcyBhIHJ1bnRpbWUgY291bnRlcnBhcnQuXHJcbiAgICAgICAgbmVlZFJ1bnRpbWUgPSAhIWdlbihlbCwgZGlyLCBzdGF0ZS53YXJuKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmVlZFJ1bnRpbWUpIHtcclxuICAgICAgICBoYXNSdW50aW1lID0gdHJ1ZTtcclxuICAgICAgICByZXMgKz0gXCJ7bmFtZTpcXFwiXCIgKyAoZGlyLm5hbWUpICsgXCJcXFwiLHJhd05hbWU6XFxcIlwiICsgKGRpci5yYXdOYW1lKSArIFwiXFxcIlwiICsgKGRpci52YWx1ZSA/IChcIix2YWx1ZTooXCIgKyAoZGlyLnZhbHVlKSArIFwiKSxleHByZXNzaW9uOlwiICsgKEpTT04uc3RyaW5naWZ5KGRpci52YWx1ZSkpKSA6ICcnKSArIChkaXIuYXJnID8gKFwiLGFyZzpcXFwiXCIgKyAoZGlyLmFyZykgKyBcIlxcXCJcIikgOiAnJykgKyAoZGlyLm1vZGlmaWVycyA/IChcIixtb2RpZmllcnM6XCIgKyAoSlNPTi5zdHJpbmdpZnkoZGlyLm1vZGlmaWVycykpKSA6ICcnKSArIFwifSxcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGhhc1J1bnRpbWUpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zbGljZSgwLCAtMSkgKyAnXSdcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbklubGluZVRlbXBsYXRlKGVsLCBzdGF0ZSkge1xyXG4gICAgdmFyIGFzdCA9IGVsLmNoaWxkcmVuWzBdO1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIChcclxuICAgICAgZWwuY2hpbGRyZW4ubGVuZ3RoICE9PSAxIHx8IGFzdC50eXBlICE9PSAxXHJcbiAgICApKSB7XHJcbiAgICAgIHN0YXRlLndhcm4oJ0lubGluZS10ZW1wbGF0ZSBjb21wb25lbnRzIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBjaGlsZCBlbGVtZW50LicpO1xyXG4gICAgfVxyXG4gICAgaWYgKGFzdC50eXBlID09PSAxKSB7XHJcbiAgICAgIHZhciBpbmxpbmVSZW5kZXJGbnMgPSBnZW5lcmF0ZShhc3QsIHN0YXRlLm9wdGlvbnMpO1xyXG4gICAgICByZXR1cm4gKFwiaW5saW5lVGVtcGxhdGU6e3JlbmRlcjpmdW5jdGlvbigpe1wiICsgKGlubGluZVJlbmRlckZucy5yZW5kZXIpICsgXCJ9LHN0YXRpY1JlbmRlckZuczpbXCIgKyAoaW5saW5lUmVuZGVyRm5zLnN0YXRpY1JlbmRlckZucy5tYXAoZnVuY3Rpb24gKGNvZGUpIHsgcmV0dXJuIChcImZ1bmN0aW9uKCl7XCIgKyBjb2RlICsgXCJ9XCIpOyB9KS5qb2luKCcsJykpICsgXCJdfVwiKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuU2NvcGVkU2xvdHMoXHJcbiAgICBzbG90cyxcclxuICAgIHN0YXRlXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gKFwic2NvcGVkU2xvdHM6X3UoW1wiICsgKE9iamVjdC5rZXlzKHNsb3RzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICByZXR1cm4gZ2VuU2NvcGVkU2xvdChrZXksIHNsb3RzW2tleV0sIHN0YXRlKVxyXG4gICAgfSkuam9pbignLCcpKSArIFwiXSlcIilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlblNjb3BlZFNsb3QoXHJcbiAgICBrZXksXHJcbiAgICBlbCxcclxuICAgIHN0YXRlXHJcbiAgKSB7XHJcbiAgICBpZiAoZWwuZm9yICYmICFlbC5mb3JQcm9jZXNzZWQpIHtcclxuICAgICAgcmV0dXJuIGdlbkZvclNjb3BlZFNsb3Qoa2V5LCBlbCwgc3RhdGUpXHJcbiAgICB9XHJcbiAgICB2YXIgZm4gPSBcImZ1bmN0aW9uKFwiICsgKFN0cmluZyhlbC5zbG90U2NvcGUpKSArIFwiKXtcIiArXHJcbiAgICAgIFwicmV0dXJuIFwiICsgKGVsLnRhZyA9PT0gJ3RlbXBsYXRlJ1xyXG4gICAgICAgID8gZWwuaWZcclxuICAgICAgICAgID8gKChlbC5pZikgKyBcIj9cIiArIChnZW5DaGlsZHJlbihlbCwgc3RhdGUpIHx8ICd1bmRlZmluZWQnKSArIFwiOnVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgOiBnZW5DaGlsZHJlbihlbCwgc3RhdGUpIHx8ICd1bmRlZmluZWQnXHJcbiAgICAgICAgOiBnZW5FbGVtZW50KGVsLCBzdGF0ZSkpICsgXCJ9XCI7XHJcbiAgICByZXR1cm4gKFwie2tleTpcIiArIGtleSArIFwiLGZuOlwiICsgZm4gKyBcIn1cIilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbkZvclNjb3BlZFNsb3QoXHJcbiAgICBrZXksXHJcbiAgICBlbCxcclxuICAgIHN0YXRlXHJcbiAgKSB7XHJcbiAgICB2YXIgZXhwID0gZWwuZm9yO1xyXG4gICAgdmFyIGFsaWFzID0gZWwuYWxpYXM7XHJcbiAgICB2YXIgaXRlcmF0b3IxID0gZWwuaXRlcmF0b3IxID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMSkpIDogJyc7XHJcbiAgICB2YXIgaXRlcmF0b3IyID0gZWwuaXRlcmF0b3IyID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMikpIDogJyc7XHJcbiAgICBlbC5mb3JQcm9jZXNzZWQgPSB0cnVlOyAvLyBhdm9pZCByZWN1cnNpb25cclxuICAgIHJldHVybiBcIl9sKChcIiArIGV4cCArIFwiKSxcIiArXHJcbiAgICAgIFwiZnVuY3Rpb24oXCIgKyBhbGlhcyArIGl0ZXJhdG9yMSArIGl0ZXJhdG9yMiArIFwiKXtcIiArXHJcbiAgICAgIFwicmV0dXJuIFwiICsgKGdlblNjb3BlZFNsb3Qoa2V5LCBlbCwgc3RhdGUpKSArXHJcbiAgICAgICd9KSdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbkNoaWxkcmVuKFxyXG4gICAgZWwsXHJcbiAgICBzdGF0ZSxcclxuICAgIGNoZWNrU2tpcCxcclxuICAgIGFsdEdlbkVsZW1lbnQsXHJcbiAgICBhbHRHZW5Ob2RlXHJcbiAgKSB7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcclxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgdmFyIGVsJDEgPSBjaGlsZHJlblswXTtcclxuICAgICAgLy8gb3B0aW1pemUgc2luZ2xlIHYtZm9yXHJcbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiZcclxuICAgICAgICBlbCQxLmZvciAmJlxyXG4gICAgICAgIGVsJDEudGFnICE9PSAndGVtcGxhdGUnICYmXHJcbiAgICAgICAgZWwkMS50YWcgIT09ICdzbG90J1xyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gKGFsdEdlbkVsZW1lbnQgfHwgZ2VuRWxlbWVudCkoZWwkMSwgc3RhdGUpXHJcbiAgICAgIH1cclxuICAgICAgdmFyIG5vcm1hbGl6YXRpb25UeXBlID0gY2hlY2tTa2lwXHJcbiAgICAgICAgPyBnZXROb3JtYWxpemF0aW9uVHlwZShjaGlsZHJlbiwgc3RhdGUubWF5YmVDb21wb25lbnQpXHJcbiAgICAgICAgOiAwO1xyXG4gICAgICB2YXIgZ2VuID0gYWx0R2VuTm9kZSB8fCBnZW5Ob2RlO1xyXG4gICAgICByZXR1cm4gKFwiW1wiICsgKGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gZ2VuKGMsIHN0YXRlKTsgfSkuam9pbignLCcpKSArIFwiXVwiICsgKG5vcm1hbGl6YXRpb25UeXBlID8gKFwiLFwiICsgbm9ybWFsaXphdGlvblR5cGUpIDogJycpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZGV0ZXJtaW5lIHRoZSBub3JtYWxpemF0aW9uIG5lZWRlZCBmb3IgdGhlIGNoaWxkcmVuIGFycmF5LlxyXG4gIC8vIDA6IG5vIG5vcm1hbGl6YXRpb24gbmVlZGVkXHJcbiAgLy8gMTogc2ltcGxlIG5vcm1hbGl6YXRpb24gbmVlZGVkIChwb3NzaWJsZSAxLWxldmVsIGRlZXAgbmVzdGVkIGFycmF5KVxyXG4gIC8vIDI6IGZ1bGwgbm9ybWFsaXphdGlvbiBuZWVkZWRcclxuICBmdW5jdGlvbiBnZXROb3JtYWxpemF0aW9uVHlwZShcclxuICAgIGNoaWxkcmVuLFxyXG4gICAgbWF5YmVDb21wb25lbnRcclxuICApIHtcclxuICAgIHZhciByZXMgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWwgPSBjaGlsZHJlbltpXTtcclxuICAgICAgaWYgKGVsLnR5cGUgIT09IDEpIHtcclxuICAgICAgICBjb250aW51ZVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChuZWVkc05vcm1hbGl6YXRpb24oZWwpIHx8XHJcbiAgICAgICAgKGVsLmlmQ29uZGl0aW9ucyAmJiBlbC5pZkNvbmRpdGlvbnMuc29tZShmdW5jdGlvbiAoYykgeyByZXR1cm4gbmVlZHNOb3JtYWxpemF0aW9uKGMuYmxvY2spOyB9KSkpIHtcclxuICAgICAgICByZXMgPSAyO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1heWJlQ29tcG9uZW50KGVsKSB8fFxyXG4gICAgICAgIChlbC5pZkNvbmRpdGlvbnMgJiYgZWwuaWZDb25kaXRpb25zLnNvbWUoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIG1heWJlQ29tcG9uZW50KGMuYmxvY2spOyB9KSkpIHtcclxuICAgICAgICByZXMgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBuZWVkc05vcm1hbGl6YXRpb24oZWwpIHtcclxuICAgIHJldHVybiBlbC5mb3IgIT09IHVuZGVmaW5lZCB8fCBlbC50YWcgPT09ICd0ZW1wbGF0ZScgfHwgZWwudGFnID09PSAnc2xvdCdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbk5vZGUobm9kZSwgc3RhdGUpIHtcclxuICAgIGlmIChub2RlLnR5cGUgPT09IDEpIHtcclxuICAgICAgcmV0dXJuIGdlbkVsZW1lbnQobm9kZSwgc3RhdGUpXHJcbiAgICB9IGlmIChub2RlLnR5cGUgPT09IDMgJiYgbm9kZS5pc0NvbW1lbnQpIHtcclxuICAgICAgcmV0dXJuIGdlbkNvbW1lbnQobm9kZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBnZW5UZXh0KG5vZGUpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5UZXh0KHRleHQpIHtcclxuICAgIHJldHVybiAoXCJfdihcIiArICh0ZXh0LnR5cGUgPT09IDJcclxuICAgICAgPyB0ZXh0LmV4cHJlc3Npb24gLy8gbm8gbmVlZCBmb3IgKCkgYmVjYXVzZSBhbHJlYWR5IHdyYXBwZWQgaW4gX3MoKVxyXG4gICAgICA6IHRyYW5zZm9ybVNwZWNpYWxOZXdsaW5lcyhKU09OLnN0cmluZ2lmeSh0ZXh0LnRleHQpKSkgKyBcIilcIilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbkNvbW1lbnQoY29tbWVudCkge1xyXG4gICAgcmV0dXJuIChcIl9lKFwiICsgKEpTT04uc3RyaW5naWZ5KGNvbW1lbnQudGV4dCkpICsgXCIpXCIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5TbG90KGVsLCBzdGF0ZSkge1xyXG4gICAgdmFyIHNsb3ROYW1lID0gZWwuc2xvdE5hbWUgfHwgJ1wiZGVmYXVsdFwiJztcclxuICAgIHZhciBjaGlsZHJlbiA9IGdlbkNoaWxkcmVuKGVsLCBzdGF0ZSk7XHJcbiAgICB2YXIgcmVzID0gXCJfdChcIiArIHNsb3ROYW1lICsgKGNoaWxkcmVuID8gKFwiLFwiICsgY2hpbGRyZW4pIDogJycpO1xyXG4gICAgdmFyIGF0dHJzID0gZWwuYXR0cnMgJiYgKFwie1wiICsgKGVsLmF0dHJzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gKChjYW1lbGl6ZShhLm5hbWUpKSArIFwiOlwiICsgKGEudmFsdWUpKTsgfSkuam9pbignLCcpKSArIFwifVwiKTtcclxuICAgIHZhciBiaW5kJCQxID0gZWwuYXR0cnNNYXBbJ3YtYmluZCddO1xyXG4gICAgaWYgKChhdHRycyB8fCBiaW5kJCQxKSAmJiAhY2hpbGRyZW4pIHtcclxuICAgICAgcmVzICs9IFwiLG51bGxcIjtcclxuICAgIH1cclxuICAgIGlmIChhdHRycykge1xyXG4gICAgICByZXMgKz0gXCIsXCIgKyBhdHRycztcclxuICAgIH1cclxuICAgIGlmIChiaW5kJCQxKSB7XHJcbiAgICAgIHJlcyArPSAoYXR0cnMgPyAnJyA6ICcsbnVsbCcpICsgXCIsXCIgKyBiaW5kJCQxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcyArICcpJ1xyXG4gIH1cclxuXHJcbiAgLy8gY29tcG9uZW50TmFtZSBpcyBlbC5jb21wb25lbnQsIHRha2UgaXQgYXMgYXJndW1lbnQgdG8gc2h1biBmbG93J3MgcGVzc2ltaXN0aWMgcmVmaW5lbWVudFxyXG4gIGZ1bmN0aW9uIGdlbkNvbXBvbmVudChcclxuICAgIGNvbXBvbmVudE5hbWUsXHJcbiAgICBlbCxcclxuICAgIHN0YXRlXHJcbiAgKSB7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBlbC5pbmxpbmVUZW1wbGF0ZSA/IG51bGwgOiBnZW5DaGlsZHJlbihlbCwgc3RhdGUsIHRydWUpO1xyXG4gICAgcmV0dXJuIChcIl9jKFwiICsgY29tcG9uZW50TmFtZSArIFwiLFwiICsgKGdlbkRhdGEkMihlbCwgc3RhdGUpKSArIChjaGlsZHJlbiA/IChcIixcIiArIGNoaWxkcmVuKSA6ICcnKSArIFwiKVwiKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuUHJvcHMocHJvcHMpIHtcclxuICAgIHZhciByZXMgPSAnJztcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIHtcclxuICAgICAgICByZXMgKz0gXCJcXFwiXCIgKyAocHJvcC5uYW1lKSArIFwiXFxcIjpcIiArICh0cmFuc2Zvcm1TcGVjaWFsTmV3bGluZXMocHJvcC52YWx1ZSkpICsgXCIsXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXMuc2xpY2UoMCwgLTEpXHJcbiAgfVxyXG5cclxuICAvLyAjMzg5NSwgIzQyNjhcclxuICBmdW5jdGlvbiB0cmFuc2Zvcm1TcGVjaWFsTmV3bGluZXModGV4dCkge1xyXG4gICAgcmV0dXJuIHRleHRcclxuICAgICAgLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8vIHRoZXNlIGtleXdvcmRzIHNob3VsZCBub3QgYXBwZWFyIGluc2lkZSBleHByZXNzaW9ucywgYnV0IG9wZXJhdG9ycyBsaWtlXHJcbiAgLy8gdHlwZW9mLCBpbnN0YW5jZW9mIGFuZCBpbiBhcmUgYWxsb3dlZFxyXG4gIHZhciBwcm9oaWJpdGVkS2V5d29yZFJFID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgKFxyXG4gICAgJ2RvLGlmLGZvcixsZXQsbmV3LHRyeSx2YXIsY2FzZSxlbHNlLHdpdGgsYXdhaXQsYnJlYWssY2F0Y2gsY2xhc3MsY29uc3QsJyArXHJcbiAgICAnc3VwZXIsdGhyb3csd2hpbGUseWllbGQsZGVsZXRlLGV4cG9ydCxpbXBvcnQscmV0dXJuLHN3aXRjaCxkZWZhdWx0LCcgK1xyXG4gICAgJ2V4dGVuZHMsZmluYWxseSxjb250aW51ZSxkZWJ1Z2dlcixmdW5jdGlvbixhcmd1bWVudHMnXHJcbiAgKS5zcGxpdCgnLCcpLmpvaW4oJ1xcXFxifFxcXFxiJykgKyAnXFxcXGInKTtcclxuXHJcbiAgLy8gdGhlc2UgdW5hcnkgb3BlcmF0b3JzIHNob3VsZCBub3QgYmUgdXNlZCBhcyBwcm9wZXJ0eS9tZXRob2QgbmFtZXNcclxuICB2YXIgdW5hcnlPcGVyYXRvcnNSRSA9IG5ldyBSZWdFeHAoJ1xcXFxiJyArIChcclxuICAgICdkZWxldGUsdHlwZW9mLHZvaWQnXHJcbiAgKS5zcGxpdCgnLCcpLmpvaW4oJ1xcXFxzKlxcXFwoW15cXFxcKV0qXFxcXCl8XFxcXGInKSArICdcXFxccypcXFxcKFteXFxcXCldKlxcXFwpJyk7XHJcblxyXG4gIC8vIHN0cmlwIHN0cmluZ3MgaW4gZXhwcmVzc2lvbnNcclxuICB2YXIgc3RyaXBTdHJpbmdSRSA9IC8nKD86W14nXFxcXF18XFxcXC4pKid8XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifGAoPzpbXmBcXFxcXXxcXFxcLikqXFwkXFx7fFxcfSg/OlteYFxcXFxdfFxcXFwuKSpgfGAoPzpbXmBcXFxcXXxcXFxcLikqYC9nO1xyXG5cclxuICAvLyBkZXRlY3QgcHJvYmxlbWF0aWMgZXhwcmVzc2lvbnMgaW4gYSB0ZW1wbGF0ZVxyXG4gIGZ1bmN0aW9uIGRldGVjdEVycm9ycyhhc3QpIHtcclxuICAgIHZhciBlcnJvcnMgPSBbXTtcclxuICAgIGlmIChhc3QpIHtcclxuICAgICAgY2hlY2tOb2RlKGFzdCwgZXJyb3JzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBlcnJvcnNcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrTm9kZShub2RlLCBlcnJvcnMpIHtcclxuICAgIGlmIChub2RlLnR5cGUgPT09IDEpIHtcclxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBub2RlLmF0dHJzTWFwKSB7XHJcbiAgICAgICAgaWYgKGRpclJFLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuYXR0cnNNYXBbbmFtZV07XHJcbiAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICd2LWZvcicpIHtcclxuICAgICAgICAgICAgICBjaGVja0Zvcihub2RlLCAoXCJ2LWZvcj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvblJFLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgICBjaGVja0V2ZW50KHZhbHVlLCAobmFtZSArIFwiPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiXCIpLCBlcnJvcnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNoZWNrRXhwcmVzc2lvbih2YWx1ZSwgKG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY2hlY2tOb2RlKG5vZGUuY2hpbGRyZW5baV0sIGVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gMikge1xyXG4gICAgICBjaGVja0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCBub2RlLnRleHQsIGVycm9ycyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaGVja0V2ZW50KGV4cCwgdGV4dCwgZXJyb3JzKSB7XHJcbiAgICB2YXIgc3RpcHBlZCA9IGV4cC5yZXBsYWNlKHN0cmlwU3RyaW5nUkUsICcnKTtcclxuICAgIHZhciBrZXl3b3JkTWF0Y2ggPSBzdGlwcGVkLm1hdGNoKHVuYXJ5T3BlcmF0b3JzUkUpO1xyXG4gICAgaWYgKGtleXdvcmRNYXRjaCAmJiBzdGlwcGVkLmNoYXJBdChrZXl3b3JkTWF0Y2guaW5kZXggLSAxKSAhPT0gJyQnKSB7XHJcbiAgICAgIGVycm9ycy5wdXNoKFxyXG4gICAgICAgIFwiYXZvaWQgdXNpbmcgSmF2YVNjcmlwdCB1bmFyeSBvcGVyYXRvciBhcyBwcm9wZXJ0eSBuYW1lOiBcIiArXHJcbiAgICAgICAgXCJcXFwiXCIgKyAoa2V5d29yZE1hdGNoWzBdKSArIFwiXFxcIiBpbiBleHByZXNzaW9uIFwiICsgKHRleHQudHJpbSgpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgY2hlY2tFeHByZXNzaW9uKGV4cCwgdGV4dCwgZXJyb3JzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrRm9yKG5vZGUsIHRleHQsIGVycm9ycykge1xyXG4gICAgY2hlY2tFeHByZXNzaW9uKG5vZGUuZm9yIHx8ICcnLCB0ZXh0LCBlcnJvcnMpO1xyXG4gICAgY2hlY2tJZGVudGlmaWVyKG5vZGUuYWxpYXMsICd2LWZvciBhbGlhcycsIHRleHQsIGVycm9ycyk7XHJcbiAgICBjaGVja0lkZW50aWZpZXIobm9kZS5pdGVyYXRvcjEsICd2LWZvciBpdGVyYXRvcicsIHRleHQsIGVycm9ycyk7XHJcbiAgICBjaGVja0lkZW50aWZpZXIobm9kZS5pdGVyYXRvcjIsICd2LWZvciBpdGVyYXRvcicsIHRleHQsIGVycm9ycyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaGVja0lkZW50aWZpZXIoXHJcbiAgICBpZGVudCxcclxuICAgIHR5cGUsXHJcbiAgICB0ZXh0LFxyXG4gICAgZXJyb3JzXHJcbiAgKSB7XHJcbiAgICBpZiAodHlwZW9mIGlkZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIG5ldyBGdW5jdGlvbigoXCJ2YXIgXCIgKyBpZGVudCArIFwiPV9cIikpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgZXJyb3JzLnB1c2goKFwiaW52YWxpZCBcIiArIHR5cGUgKyBcIiBcXFwiXCIgKyBpZGVudCArIFwiXFxcIiBpbiBleHByZXNzaW9uOiBcIiArICh0ZXh0LnRyaW0oKSkpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hlY2tFeHByZXNzaW9uKGV4cCwgdGV4dCwgZXJyb3JzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBuZXcgRnVuY3Rpb24oKFwicmV0dXJuIFwiICsgZXhwKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHZhciBrZXl3b3JkTWF0Y2ggPSBleHAucmVwbGFjZShzdHJpcFN0cmluZ1JFLCAnJykubWF0Y2gocHJvaGliaXRlZEtleXdvcmRSRSk7XHJcbiAgICAgIGlmIChrZXl3b3JkTWF0Y2gpIHtcclxuICAgICAgICBlcnJvcnMucHVzaChcclxuICAgICAgICAgIFwiYXZvaWQgdXNpbmcgSmF2YVNjcmlwdCBrZXl3b3JkIGFzIHByb3BlcnR5IG5hbWU6IFwiICtcclxuICAgICAgICAgIFwiXFxcIlwiICsgKGtleXdvcmRNYXRjaFswXSkgKyBcIlxcXCJcXG4gIFJhdyBleHByZXNzaW9uOiBcIiArICh0ZXh0LnRyaW0oKSlcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKFxyXG4gICAgICAgICAgXCJpbnZhbGlkIGV4cHJlc3Npb246IFwiICsgKGUubWVzc2FnZSkgKyBcIiBpblxcblxcblwiICtcclxuICAgICAgICAgIFwiICAgIFwiICsgZXhwICsgXCJcXG5cXG5cIiArXHJcbiAgICAgICAgICBcIiAgUmF3IGV4cHJlc3Npb246IFwiICsgKHRleHQudHJpbSgpKSArIFwiXFxuXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24oY29kZSwgZXJyb3JzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGNvZGUpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgZXJyb3JzLnB1c2goeyBlcnI6IGVyciwgY29kZTogY29kZSB9KTtcclxuICAgICAgcmV0dXJuIG5vb3BcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVUb0Z1bmN0aW9uRm4oY29tcGlsZSkge1xyXG4gICAgdmFyIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gY29tcGlsZVRvRnVuY3Rpb25zKFxyXG4gICAgICB0ZW1wbGF0ZSxcclxuICAgICAgb3B0aW9ucyxcclxuICAgICAgdm1cclxuICAgICkge1xyXG4gICAgICBvcHRpb25zID0gZXh0ZW5kKHt9LCBvcHRpb25zKTtcclxuICAgICAgdmFyIHdhcm4kJDEgPSBvcHRpb25zLndhcm4gfHwgd2FybjtcclxuICAgICAgZGVsZXRlIG9wdGlvbnMud2FybjtcclxuXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICB7XHJcbiAgICAgICAgLy8gZGV0ZWN0IHBvc3NpYmxlIENTUCByZXN0cmljdGlvblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBuZXcgRnVuY3Rpb24oJ3JldHVybiAxJyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgaWYgKGUudG9TdHJpbmcoKS5tYXRjaCgvdW5zYWZlLWV2YWx8Q1NQLykpIHtcclxuICAgICAgICAgICAgd2FybiQkMShcclxuICAgICAgICAgICAgICAnSXQgc2VlbXMgeW91IGFyZSB1c2luZyB0aGUgc3RhbmRhbG9uZSBidWlsZCBvZiBWdWUuanMgaW4gYW4gJyArXHJcbiAgICAgICAgICAgICAgJ2Vudmlyb25tZW50IHdpdGggQ29udGVudCBTZWN1cml0eSBQb2xpY3kgdGhhdCBwcm9oaWJpdHMgdW5zYWZlLWV2YWwuICcgK1xyXG4gICAgICAgICAgICAgICdUaGUgdGVtcGxhdGUgY29tcGlsZXIgY2Fubm90IHdvcmsgaW4gdGhpcyBlbnZpcm9ubWVudC4gQ29uc2lkZXIgJyArXHJcbiAgICAgICAgICAgICAgJ3JlbGF4aW5nIHRoZSBwb2xpY3kgdG8gYWxsb3cgdW5zYWZlLWV2YWwgb3IgcHJlLWNvbXBpbGluZyB5b3VyICcgK1xyXG4gICAgICAgICAgICAgICd0ZW1wbGF0ZXMgaW50byByZW5kZXIgZnVuY3Rpb25zLidcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNoZWNrIGNhY2hlXHJcbiAgICAgIHZhciBrZXkgPSBvcHRpb25zLmRlbGltaXRlcnNcclxuICAgICAgICA/IFN0cmluZyhvcHRpb25zLmRlbGltaXRlcnMpICsgdGVtcGxhdGVcclxuICAgICAgICA6IHRlbXBsYXRlO1xyXG4gICAgICBpZiAoY2FjaGVba2V5XSkge1xyXG4gICAgICAgIHJldHVybiBjYWNoZVtrZXldXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbXBpbGVcclxuICAgICAgdmFyIGNvbXBpbGVkID0gY29tcGlsZSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAvLyBjaGVjayBjb21waWxhdGlvbiBlcnJvcnMvdGlwc1xyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKGNvbXBpbGVkLmVycm9ycyAmJiBjb21waWxlZC5lcnJvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3YXJuJCQxKFxyXG4gICAgICAgICAgICBcIkVycm9yIGNvbXBpbGluZyB0ZW1wbGF0ZTpcXG5cXG5cIiArIHRlbXBsYXRlICsgXCJcXG5cXG5cIiArXHJcbiAgICAgICAgICAgIGNvbXBpbGVkLmVycm9ycy5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIChcIi0gXCIgKyBlKTsgfSkuam9pbignXFxuJykgKyAnXFxuJyxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21waWxlZC50aXBzICYmIGNvbXBpbGVkLnRpcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjb21waWxlZC50aXBzLmZvckVhY2goZnVuY3Rpb24gKG1zZykgeyByZXR1cm4gdGlwKG1zZywgdm0pOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHR1cm4gY29kZSBpbnRvIGZ1bmN0aW9uc1xyXG4gICAgICB2YXIgcmVzID0ge307XHJcbiAgICAgIHZhciBmbkdlbkVycm9ycyA9IFtdO1xyXG4gICAgICByZXMucmVuZGVyID0gY3JlYXRlRnVuY3Rpb24oY29tcGlsZWQucmVuZGVyLCBmbkdlbkVycm9ycyk7XHJcbiAgICAgIHJlcy5zdGF0aWNSZW5kZXJGbnMgPSBjb21waWxlZC5zdGF0aWNSZW5kZXJGbnMubWFwKGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZ1bmN0aW9uKGNvZGUsIGZuR2VuRXJyb3JzKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGZ1bmN0aW9uIGdlbmVyYXRpb24gZXJyb3JzLlxyXG4gICAgICAvLyB0aGlzIHNob3VsZCBvbmx5IGhhcHBlbiBpZiB0aGVyZSBpcyBhIGJ1ZyBpbiB0aGUgY29tcGlsZXIgaXRzZWxmLlxyXG4gICAgICAvLyBtb3N0bHkgZm9yIGNvZGVnZW4gZGV2ZWxvcG1lbnQgdXNlXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKCghY29tcGlsZWQuZXJyb3JzIHx8ICFjb21waWxlZC5lcnJvcnMubGVuZ3RoKSAmJiBmbkdlbkVycm9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgIHdhcm4kJDEoXHJcbiAgICAgICAgICAgIFwiRmFpbGVkIHRvIGdlbmVyYXRlIHJlbmRlciBmdW5jdGlvbjpcXG5cXG5cIiArXHJcbiAgICAgICAgICAgIGZuR2VuRXJyb3JzLm1hcChmdW5jdGlvbiAocmVmKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGVyciA9IHJlZi5lcnI7XHJcbiAgICAgICAgICAgICAgdmFyIGNvZGUgPSByZWYuY29kZTtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuICgoZXJyLnRvU3RyaW5nKCkpICsgXCIgaW5cXG5cXG5cIiArIGNvZGUgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgfSkuam9pbignXFxuJyksXHJcbiAgICAgICAgICAgIHZtXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChjYWNoZVtrZXldID0gcmVzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVyQ3JlYXRvcihiYXNlQ29tcGlsZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVyKGJhc2VPcHRpb25zKSB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBpbGUoXHJcbiAgICAgICAgdGVtcGxhdGUsXHJcbiAgICAgICAgb3B0aW9uc1xyXG4gICAgICApIHtcclxuICAgICAgICB2YXIgZmluYWxPcHRpb25zID0gT2JqZWN0LmNyZWF0ZShiYXNlT3B0aW9ucyk7XHJcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIHZhciB0aXBzID0gW107XHJcbiAgICAgICAgZmluYWxPcHRpb25zLndhcm4gPSBmdW5jdGlvbiAobXNnLCB0aXApIHtcclxuICAgICAgICAgICh0aXAgPyB0aXBzIDogZXJyb3JzKS5wdXNoKG1zZyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgIC8vIG1lcmdlIGN1c3RvbSBtb2R1bGVzXHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5tb2R1bGVzKSB7XHJcbiAgICAgICAgICAgIGZpbmFsT3B0aW9ucy5tb2R1bGVzID1cclxuICAgICAgICAgICAgICAoYmFzZU9wdGlvbnMubW9kdWxlcyB8fCBbXSkuY29uY2F0KG9wdGlvbnMubW9kdWxlcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBtZXJnZSBjdXN0b20gZGlyZWN0aXZlc1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aXZlcykge1xyXG4gICAgICAgICAgICBmaW5hbE9wdGlvbnMuZGlyZWN0aXZlcyA9IGV4dGVuZChcclxuICAgICAgICAgICAgICBPYmplY3QuY3JlYXRlKGJhc2VPcHRpb25zLmRpcmVjdGl2ZXMgfHwgbnVsbCksXHJcbiAgICAgICAgICAgICAgb3B0aW9ucy5kaXJlY3RpdmVzXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBjb3B5IG90aGVyIG9wdGlvbnNcclxuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICdtb2R1bGVzJyAmJiBrZXkgIT09ICdkaXJlY3RpdmVzJykge1xyXG4gICAgICAgICAgICAgIGZpbmFsT3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29tcGlsZWQgPSBiYXNlQ29tcGlsZSh0ZW1wbGF0ZSwgZmluYWxPcHRpb25zKTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBlcnJvcnMucHVzaC5hcHBseShlcnJvcnMsIGRldGVjdEVycm9ycyhjb21waWxlZC5hc3QpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGlsZWQuZXJyb3JzID0gZXJyb3JzO1xyXG4gICAgICAgIGNvbXBpbGVkLnRpcHMgPSB0aXBzO1xyXG4gICAgICAgIHJldHVybiBjb21waWxlZFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGNvbXBpbGUsXHJcbiAgICAgICAgY29tcGlsZVRvRnVuY3Rpb25zOiBjcmVhdGVDb21waWxlVG9GdW5jdGlvbkZuKGNvbXBpbGUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvLyBgY3JlYXRlQ29tcGlsZXJDcmVhdG9yYCBhbGxvd3MgY3JlYXRpbmcgY29tcGlsZXJzIHRoYXQgdXNlIGFsdGVybmF0aXZlXHJcbiAgLy8gcGFyc2VyL29wdGltaXplci9jb2RlZ2VuLCBlLmcgdGhlIFNTUiBvcHRpbWl6aW5nIGNvbXBpbGVyLlxyXG4gIC8vIEhlcmUgd2UganVzdCBleHBvcnQgYSBkZWZhdWx0IGNvbXBpbGVyIHVzaW5nIHRoZSBkZWZhdWx0IHBhcnRzLlxyXG4gIHZhciBjcmVhdGVDb21waWxlciA9IGNyZWF0ZUNvbXBpbGVyQ3JlYXRvcihmdW5jdGlvbiBiYXNlQ29tcGlsZShcclxuICAgIHRlbXBsYXRlLFxyXG4gICAgb3B0aW9uc1xyXG4gICkge1xyXG4gICAgdmFyIGFzdCA9IHBhcnNlKHRlbXBsYXRlLnRyaW0oKSwgb3B0aW9ucyk7XHJcbiAgICBpZiAob3B0aW9ucy5vcHRpbWl6ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgb3B0aW1pemUoYXN0LCBvcHRpb25zKTtcclxuICAgIH1cclxuICAgIHZhciBjb2RlID0gZ2VuZXJhdGUoYXN0LCBvcHRpb25zKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFzdDogYXN0LFxyXG4gICAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxyXG4gICAgICBzdGF0aWNSZW5kZXJGbnM6IGNvZGUuc3RhdGljUmVuZGVyRm5zXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgcmVmJDEgPSBjcmVhdGVDb21waWxlcihiYXNlT3B0aW9ucyk7XHJcbiAgdmFyIGNvbXBpbGVUb0Z1bmN0aW9ucyA9IHJlZiQxLmNvbXBpbGVUb0Z1bmN0aW9ucztcclxuXHJcbiAgLyogICovXHJcblxyXG4gIC8vIGNoZWNrIHdoZXRoZXIgY3VycmVudCBicm93c2VyIGVuY29kZXMgYSBjaGFyIGluc2lkZSBhdHRyaWJ1dGUgdmFsdWVzXHJcbiAgdmFyIGRpdjtcclxuICBmdW5jdGlvbiBnZXRTaG91bGREZWNvZGUoaHJlZikge1xyXG4gICAgZGl2ID0gZGl2IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmlubmVySFRNTCA9IGhyZWYgPyBcIjxhIGhyZWY9XFxcIlxcblxcXCIvPlwiIDogXCI8ZGl2IGE9XFxcIlxcblxcXCIvPlwiO1xyXG4gICAgcmV0dXJuIGRpdi5pbm5lckhUTUwuaW5kZXhPZignJiMxMDsnKSA+IDBcclxuICB9XHJcblxyXG4gIC8vICMzNjYzOiBJRSBlbmNvZGVzIG5ld2xpbmVzIGluc2lkZSBhdHRyaWJ1dGUgdmFsdWVzIHdoaWxlIG90aGVyIGJyb3dzZXJzIGRvbid0XHJcbiAgdmFyIHNob3VsZERlY29kZU5ld2xpbmVzID0gaW5Ccm93c2VyID8gZ2V0U2hvdWxkRGVjb2RlKGZhbHNlKSA6IGZhbHNlO1xyXG4gIC8vICM2ODI4OiBjaHJvbWUgZW5jb2RlcyBjb250ZW50IGluIGFbaHJlZl1cclxuICB2YXIgc2hvdWxkRGVjb2RlTmV3bGluZXNGb3JIcmVmID0gaW5Ccm93c2VyID8gZ2V0U2hvdWxkRGVjb2RlKHRydWUpIDogZmFsc2U7XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICB2YXIgaWRUb1RlbXBsYXRlID0gY2FjaGVkKGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdmFyIGVsID0gcXVlcnkoaWQpO1xyXG4gICAgcmV0dXJuIGVsICYmIGVsLmlubmVySFRNTFxyXG4gIH0pO1xyXG5cclxuICB2YXIgbW91bnQgPSBWdWUucHJvdG90eXBlLiRtb3VudDtcclxuICBWdWUucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uIChcclxuICAgIGVsLFxyXG4gICAgaHlkcmF0aW5nXHJcbiAgKSB7XHJcbiAgICBlbCA9IGVsICYmIHF1ZXJ5KGVsKTtcclxuXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSB8fCBlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICAgXCJEbyBub3QgbW91bnQgVnVlIHRvIDxodG1sPiBvciA8Ym9keT4gLSBtb3VudCB0byBub3JtYWwgZWxlbWVudHMgaW5zdGVhZC5cIlxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9ucztcclxuICAgIC8vIHJlc29sdmUgdGVtcGxhdGUvZWwgYW5kIGNvbnZlcnQgdG8gcmVuZGVyIGZ1bmN0aW9uXHJcbiAgICBpZiAoIW9wdGlvbnMucmVuZGVyKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGU7XHJcbiAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBpZiAodGVtcGxhdGUuY2hhckF0KDApID09PSAnIycpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGUgPSBpZFRvVGVtcGxhdGUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmICF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgICAoXCJUZW1wbGF0ZSBlbGVtZW50IG5vdCBmb3VuZCBvciBpcyBlbXB0eTogXCIgKyAob3B0aW9ucy50ZW1wbGF0ZSkpLFxyXG4gICAgICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLmlubmVySFRNTDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB3YXJuKCdpbnZhbGlkIHRlbXBsYXRlIG9wdGlvbjonICsgdGVtcGxhdGUsIHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZWwpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IGdldE91dGVySFRNTChlbCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNvbmZpZy5wZXJmb3JtYW5jZSAmJiBtYXJrKSB7XHJcbiAgICAgICAgICBtYXJrKCdjb21waWxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVmID0gY29tcGlsZVRvRnVuY3Rpb25zKHRlbXBsYXRlLCB7XHJcbiAgICAgICAgICBzaG91bGREZWNvZGVOZXdsaW5lczogc2hvdWxkRGVjb2RlTmV3bGluZXMsXHJcbiAgICAgICAgICBzaG91bGREZWNvZGVOZXdsaW5lc0ZvckhyZWY6IHNob3VsZERlY29kZU5ld2xpbmVzRm9ySHJlZixcclxuICAgICAgICAgIGRlbGltaXRlcnM6IG9wdGlvbnMuZGVsaW1pdGVycyxcclxuICAgICAgICAgIGNvbW1lbnRzOiBvcHRpb25zLmNvbW1lbnRzXHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgdmFyIHJlbmRlciA9IHJlZi5yZW5kZXI7XHJcbiAgICAgICAgdmFyIHN0YXRpY1JlbmRlckZucyA9IHJlZi5zdGF0aWNSZW5kZXJGbnM7XHJcbiAgICAgICAgb3B0aW9ucy5yZW5kZXIgPSByZW5kZXI7XHJcbiAgICAgICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBzdGF0aWNSZW5kZXJGbnM7XHJcblxyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgbWFyaykge1xyXG4gICAgICAgICAgbWFyaygnY29tcGlsZSBlbmQnKTtcclxuICAgICAgICAgIG1lYXN1cmUoKFwidnVlIFwiICsgKHRoaXMuX25hbWUpICsgXCIgY29tcGlsZVwiKSwgJ2NvbXBpbGUnLCAnY29tcGlsZSBlbmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBtb3VudC5jYWxsKHRoaXMsIGVsLCBoeWRyYXRpbmcpXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IG91dGVySFRNTCBvZiBlbGVtZW50cywgdGFraW5nIGNhcmVcclxuICAgKiBvZiBTVkcgZWxlbWVudHMgaW4gSUUgYXMgd2VsbC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRPdXRlckhUTUwoZWwpIHtcclxuICAgIGlmIChlbC5vdXRlckhUTUwpIHtcclxuICAgICAgcmV0dXJuIGVsLm91dGVySFRNTFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgICAgcmV0dXJuIGNvbnRhaW5lci5pbm5lckhUTUxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIFZ1ZS5jb21waWxlID0gY29tcGlsZVRvRnVuY3Rpb25zO1xyXG5cclxuICByZXR1cm4gVnVlO1xyXG5cclxufSkpKTtcclxuIl19
