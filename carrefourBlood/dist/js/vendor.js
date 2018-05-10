/*!
 * ScrollMagic v2.0.5 (2015-04-29)
 * The javascript library for magical scroll interactions.
 * (c) 2015 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.5
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */
/**
 * @namespace ScrollMagic
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		root.ScrollMagic = factory();
	}
}(this, function () {
	"use strict";

	var ScrollMagic = function () {
		_util.log(2, '(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use \'new ScrollMagic.Controller()\' to create a new controller instance. Use \'new ScrollMagic.Scene()\' to instance a scene.');
	};

	ScrollMagic.version = "2.0.5";

	// TODO: temporary workaround for chrome's scroll jitter bug
	window.addEventListener("mousewheel", function () {});

	// global const
	var PIN_SPACER_ATTRIBUTE = "data-scrollmagic-pin-spacer";

	/**
	 * The main class that is needed once per scroll container.
	 *
	 * @class
	 *
	 * @example
	 * // basic initialization
	 * var controller = new ScrollMagic.Controller();
	 *
	 * // passing options
	 * var controller = new ScrollMagic.Controller({container: "#myContainer", loglevel: 3});
	 *
	 * @param {object} [options] - An object containing one or more options for the controller.
	 * @param {(string|object)} [options.container=window] - A selector, DOM object that references the main container for scrolling.
	 * @param {boolean} [options.vertical=true] - Sets the scroll mode to vertical (`true`) or horizontal (`false`) scrolling.
	 * @param {object} [options.globalSceneOptions={}] - These options will be passed to every Scene that is added to the controller using the addScene method. For more information on Scene options see {@link ScrollMagic.Scene}.
	 * @param {number} [options.loglevel=2] Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 ** `0` => silent
	 ** `1` => errors
	 ** `2` => errors, warnings
	 ** `3` => errors, warnings, debuginfo
	 * @param {boolean} [options.refreshInterval=100] - Some changes don't call events by default, like changing the container size or moving a scene trigger element.  
	 This interval polls these parameters to fire the necessary events.  
	 If you don't use custom containers, trigger elements or have static layouts, where the positions of the trigger elements don't change, you can set this to 0 disable interval checking and improve performance.
	 *
	 */
	ScrollMagic.Controller = function (options) {
/*
	 * ----------------------------------------------------------------
	 * settings
	 * ----------------------------------------------------------------
	 */
		var
		NAMESPACE = 'ScrollMagic.Controller',
			SCROLL_DIRECTION_FORWARD = 'FORWARD',
			SCROLL_DIRECTION_REVERSE = 'REVERSE',
			SCROLL_DIRECTION_PAUSED = 'PAUSED',
			DEFAULT_OPTIONS = CONTROLLER_OPTIONS.defaults;

/*
	 * ----------------------------------------------------------------
	 * private vars
	 * ----------------------------------------------------------------
	 */
		var
		Controller = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_sceneObjects = [],
			_updateScenesOnNextCycle = false,
			// can be boolean (true => all scenes) or an array of scenes to be updated
			_scrollPos = 0,
			_scrollDirection = SCROLL_DIRECTION_PAUSED,
			_isDocument = true,
			_viewPortSize = 0,
			_enabled = true,
			_updateTimeout, _refreshTimeout;

/*
	 * ----------------------------------------------------------------
	 * private functions
	 * ----------------------------------------------------------------
	 */

		/**
		 * Internal constructor function of the ScrollMagic Controller
		 * @private
		 */
		var construct = function () {
			for (var key in _options) {
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			_options.container = _util.get.elements(_options.container)[0];
			// check ScrollContainer
			if (!_options.container) {
				log(1, "ERROR creating object " + NAMESPACE + ": No valid scroll container supplied");
				throw NAMESPACE + " init failed."; // cancel
			}
			_isDocument = _options.container === window || _options.container === document.body || !document.body.contains(_options.container);
			// normalize to window
			if (_isDocument) {
				_options.container = window;
			}
			// update container size immediately
			_viewPortSize = getViewportSize();
			// set event handlers
			_options.container.addEventListener("resize", onChange);
			_options.container.addEventListener("scroll", onChange);

			_options.refreshInterval = parseInt(_options.refreshInterval) || DEFAULT_OPTIONS.refreshInterval;
			scheduleRefresh();

			log(3, "added new " + NAMESPACE + " controller (v" + ScrollMagic.version + ")");
		};

		/**
		 * Schedule the next execution of the refresh function
		 * @private
		 */
		var scheduleRefresh = function () {
			if (_options.refreshInterval > 0) {
				_refreshTimeout = window.setTimeout(refresh, _options.refreshInterval);
			}
		};

		/**
		 * Default function to get scroll pos - overwriteable using `Controller.scrollPos(newFunction)`
		 * @private
		 */
		var getScrollPos = function () {
			return _options.vertical ? _util.get.scrollTop(_options.container) : _util.get.scrollLeft(_options.container);
		};

		/**
		 * Returns the current viewport Size (width vor horizontal, height for vertical)
		 * @private
		 */
		var getViewportSize = function () {
			return _options.vertical ? _util.get.height(_options.container) : _util.get.width(_options.container);
		};

		/**
		 * Default function to set scroll pos - overwriteable using `Controller.scrollTo(newFunction)`
		 * Make available publicly for pinned mousewheel workaround.
		 * @private
		 */
		var setScrollPos = this._setScrollPos = function (pos) {
			if (_options.vertical) {
				if (_isDocument) {
					window.scrollTo(_util.get.scrollLeft(), pos);
				} else {
					_options.container.scrollTop = pos;
				}
			} else {
				if (_isDocument) {
					window.scrollTo(pos, _util.get.scrollTop());
				} else {
					_options.container.scrollLeft = pos;
				}
			}
		};

		/**
		 * Handle updates in cycles instead of on scroll (performance)
		 * @private
		 */
		var updateScenes = function () {
			if (_enabled && _updateScenesOnNextCycle) {
				// determine scenes to update
				var scenesToUpdate = _util.type.Array(_updateScenesOnNextCycle) ? _updateScenesOnNextCycle : _sceneObjects.slice(0);
				// reset scenes
				_updateScenesOnNextCycle = false;
				var oldScrollPos = _scrollPos;
				// update scroll pos now instead of onChange, as it might have changed since scheduling (i.e. in-browser smooth scroll)
				_scrollPos = Controller.scrollPos();
				var deltaScroll = _scrollPos - oldScrollPos;
				if (deltaScroll !== 0) { // scroll position changed?
					_scrollDirection = (deltaScroll > 0) ? SCROLL_DIRECTION_FORWARD : SCROLL_DIRECTION_REVERSE;
				}
				// reverse order of scenes if scrolling reverse
				if (_scrollDirection === SCROLL_DIRECTION_REVERSE) {
					scenesToUpdate.reverse();
				}
				// update scenes
				scenesToUpdate.forEach(function (scene, index) {
					log(3, "updating Scene " + (index + 1) + "/" + scenesToUpdate.length + " (" + _sceneObjects.length + " total)");
					scene.update(true);
				});
				if (scenesToUpdate.length === 0 && _options.loglevel >= 3) {
					log(3, "updating 0 Scenes (nothing added to controller)");
				}
			}
		};

		/**
		 * Initializes rAF callback
		 * @private
		 */
		var debounceUpdate = function () {
			_updateTimeout = _util.rAF(updateScenes);
		};

		/**
		 * Handles Container changes
		 * @private
		 */
		var onChange = function (e) {
			log(3, "event fired causing an update:", e.type);
			if (e.type == "resize") {
				// resize
				_viewPortSize = getViewportSize();
				_scrollDirection = SCROLL_DIRECTION_PAUSED;
			}
			// schedule update
			if (_updateScenesOnNextCycle !== true) {
				_updateScenesOnNextCycle = true;
				debounceUpdate();
			}
		};

		var refresh = function () {
			if (!_isDocument) {
				// simulate resize event. Only works for viewport relevant param (performance)
				if (_viewPortSize != getViewportSize()) {
					var resizeEvent;
					try {
						resizeEvent = new Event('resize', {
							bubbles: false,
							cancelable: false
						});
					} catch (e) { // stupid IE
						resizeEvent = document.createEvent("Event");
						resizeEvent.initEvent("resize", false, false);
					}
					_options.container.dispatchEvent(resizeEvent);
				}
			}
			_sceneObjects.forEach(function (scene, index) { // refresh all scenes
				scene.refresh();
			});
			scheduleRefresh();
		};

		/**
		 * Send a debug message to the console.
		 * provided publicly with _log for plugins
		 * @private
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};
		// for scenes we have getters for each option, but for the controller we don't, so we need to make it available externally for plugins
		this._options = _options;

		/**
		 * Sort scenes in ascending order of their start offset.
		 * @private
		 *
		 * @param {array} ScenesArray - an array of ScrollMagic Scenes that should be sorted
		 * @return {array} The sorted array of Scenes.
		 */
		var sortScenes = function (ScenesArray) {
			if (ScenesArray.length <= 1) {
				return ScenesArray;
			} else {
				var scenes = ScenesArray.slice(0);
				scenes.sort(function (a, b) {
					return a.scrollOffset() > b.scrollOffset() ? 1 : -1;
				});
				return scenes;
			}
		};

		/**
		 * ----------------------------------------------------------------
		 * public functions
		 * ----------------------------------------------------------------
		 */

		/**
		 * Add one ore more scene(s) to the controller.  
		 * This is the equivalent to `Scene.addTo(controller)`.
		 * @public
		 * @example
		 * // with a previously defined scene
		 * controller.addScene(scene);
		 *
		 * // with a newly created scene.
		 * controller.addScene(new ScrollMagic.Scene({duration : 0}));
		 *
		 * // adding multiple scenes
		 * controller.addScene([scene, scene2, new ScrollMagic.Scene({duration : 0})]);
		 *
		 * @param {(ScrollMagic.Scene|array)} newScene - ScrollMagic Scene or Array of Scenes to be added to the controller.
		 * @return {Controller} Parent object for chaining.
		 */
		this.addScene = function (newScene) {
			if (_util.type.Array(newScene)) {
				newScene.forEach(function (scene, index) {
					Controller.addScene(scene);
				});
			} else if (newScene instanceof ScrollMagic.Scene) {
				if (newScene.controller() !== Controller) {
					newScene.addTo(Controller);
				} else if (_sceneObjects.indexOf(newScene) < 0) {
					// new scene
					_sceneObjects.push(newScene); // add to array
					_sceneObjects = sortScenes(_sceneObjects); // sort
					newScene.on("shift.controller_sort", function () { // resort whenever scene moves
						_sceneObjects = sortScenes(_sceneObjects);
					});
					// insert Global defaults.
					for (var key in _options.globalSceneOptions) {
						if (newScene[key]) {
							newScene[key].call(newScene, _options.globalSceneOptions[key]);
						}
					}
					log(3, "adding Scene (now " + _sceneObjects.length + " total)");
				}
			} else {
				log(1, "ERROR: invalid argument supplied for '.addScene()'");
			}
			return Controller;
		};

		/**
		 * Remove one ore more scene(s) from the controller.  
		 * This is the equivalent to `Scene.remove()`.
		 * @public
		 * @example
		 * // remove a scene from the controller
		 * controller.removeScene(scene);
		 *
		 * // remove multiple scenes from the controller
		 * controller.removeScene([scene, scene2, scene3]);
		 *
		 * @param {(ScrollMagic.Scene|array)} Scene - ScrollMagic Scene or Array of Scenes to be removed from the controller.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.removeScene = function (Scene) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.removeScene(scene);
				});
			} else {
				var index = _sceneObjects.indexOf(Scene);
				if (index > -1) {
					Scene.off("shift.controller_sort");
					_sceneObjects.splice(index, 1);
					log(3, "removing Scene (now " + _sceneObjects.length + " left)");
					Scene.remove();
				}
			}
			return Controller;
		};

		/**
		 * Update one ore more scene(s) according to the scroll position of the container.  
		 * This is the equivalent to `Scene.update()`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.  
		 * _**Note:** This method gets called constantly whenever Controller detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @public
		 * @example
		 * // update a specific scene on next cycle
		 * controller.updateScene(scene);
		 *
		 * // update a specific scene immediately
		 * controller.updateScene(scene, true);
		 *
		 * // update multiple scenes scene on next cycle
		 * controller.updateScene([scene1, scene2, scene3]);
		 *
		 * @param {ScrollMagic.Scene} Scene - ScrollMagic Scene or Array of Scenes that is/are supposed to be updated.
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle.  
		 This is useful when changing multiple properties of the scene - this way it will only be updated once all new properties are set (updateScenes).
		 * @return {Controller} Parent object for chaining.
		 */
		this.updateScene = function (Scene, immediately) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.updateScene(scene, immediately);
				});
			} else {
				if (immediately) {
					Scene.update(true);
				} else if (_updateScenesOnNextCycle !== true && Scene instanceof ScrollMagic.Scene) { // if _updateScenesOnNextCycle is true, all connected scenes are already scheduled for update
					// prep array for next update cycle
					_updateScenesOnNextCycle = _updateScenesOnNextCycle || [];
					if (_updateScenesOnNextCycle.indexOf(Scene) == -1) {
						_updateScenesOnNextCycle.push(Scene);
					}
					_updateScenesOnNextCycle = sortScenes(_updateScenesOnNextCycle); // sort
					debounceUpdate();
				}
			}
			return Controller;
		};

		/**
		 * Updates the controller params and calls updateScene on every scene, that is attached to the controller.  
		 * See `Controller.updateScene()` for more information about what this means.  
		 * In most cases you will not need this function, as it is called constantly, whenever ScrollMagic detects a state change event, like resize or scroll.  
		 * The only application for this method is when ScrollMagic fails to detect these events.  
		 * One application is with some external scroll libraries (like iScroll) that move an internal container to a negative offset instead of actually scrolling. In this case the update on the controller needs to be called whenever the child container's position changes.
		 * For this case there will also be the need to provide a custom function to calculate the correct scroll position. See `Controller.scrollPos()` for details.
		 * @public
		 * @example
		 * // update the controller on next cycle (saves performance due to elimination of redundant updates)
		 * controller.update();
		 *
		 * // update the controller immediately
		 * controller.update(true);
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance)
		 * @return {Controller} Parent object for chaining.
		 */
		this.update = function (immediately) {
			onChange({
				type: "resize"
			}); // will update size and set _updateScenesOnNextCycle to true
			if (immediately) {
				updateScenes();
			}
			return Controller;
		};

		/**
		 * Scroll to a numeric scroll offset, a DOM element, the start of a scene or provide an alternate method for scrolling.  
		 * For vertical controllers it will change the top scroll offset and for horizontal applications it will change the left offset.
		 * @public
		 *
		 * @since 1.1.0
		 * @example
		 * // scroll to an offset of 100
		 * controller.scrollTo(100);
		 *
		 * // scroll to a DOM element
		 * controller.scrollTo("#anchor");
		 *
		 * // scroll to the beginning of a scene
		 * var scene = new ScrollMagic.Scene({offset: 200});
		 * controller.scrollTo(scene);
		 *
		 * // define a new scroll position modification function (jQuery animate instead of jump)
		 * controller.scrollTo(function (newScrollPos) {
		 *	$("html, body").animate({scrollTop: newScrollPos});
		 * });
		 * controller.scrollTo(100); // call as usual, but the new function will be used instead
		 *
		 * // define a new scroll function with an additional parameter
		 * controller.scrollTo(function (newScrollPos, message) {
		 *  console.log(message);
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter to the defined custom function
		 * controller.scrollTo(100, "my message");
		 *
		 * // define a new scroll function with an additional parameter containing multiple variables
		 * controller.scrollTo(function (newScrollPos, options) {
		 *  someGlobalVar = options.a + options.b;
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter containing multiple options
		 * controller.scrollTo(100, {a: 1, b: 2});
		 *
		 * // define a new scroll function with a callback supplied as an additional parameter
		 * controller.scrollTo(function (newScrollPos, callback) {
		 *	$(this).animate({scrollTop: newScrollPos}, 400, "swing", callback);
		 * });
		 * // call as usual, but supply an extra parameter, which is used as a callback in the previously defined custom scroll function
		 * controller.scrollTo(100, function() {
		 *	console.log("scroll has finished.");
		 * });
		 *
		 * @param {mixed} scrollTarget - The supplied argument can be one of these types:
		 * 1. `number` -> The container will scroll to this new scroll offset.
		 * 2. `string` or `object` -> Can be a selector or a DOM object.  
		 *  The container will scroll to the position of this element.
		 * 3. `ScrollMagic Scene` -> The container will scroll to the start of this scene.
		 * 4. `function` -> This function will be used for future scroll position modifications.  
		 *  This provides a way for you to change the behaviour of scrolling and adding new behaviour like animation. The function receives the new scroll position as a parameter and a reference to the container element using `this`.  
		 *  It may also optionally receive an optional additional parameter (see below)  
		 *  _**NOTE:**  
		 *  All other options will still work as expected, using the new function to scroll._
		 * @param {mixed} [additionalParameter] - If a custom scroll function was defined (see above 4.), you may want to supply additional parameters to it, when calling it. You can do this using this parameter – see examples for details. Please note, that this parameter will have no effect, if you use the default scrolling function.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.scrollTo = function (scrollTarget, additionalParameter) {
			if (_util.type.Number(scrollTarget)) { // excecute
				setScrollPos.call(_options.container, scrollTarget, additionalParameter);
			} else if (scrollTarget instanceof ScrollMagic.Scene) { // scroll to scene
				if (scrollTarget.controller() === Controller) { // check if the controller is associated with this scene
					Controller.scrollTo(scrollTarget.scrollOffset(), additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", scrollTarget);
				}
			} else if (_util.type.Function(scrollTarget)) { // assign new scroll function
				setScrollPos = scrollTarget;
			} else { // scroll to element
				var elem = _util.get.elements(scrollTarget)[0];
				if (elem) {
					// if parent is pin spacer, use spacer position instead so correct start position is returned for pinned elements.
					while (elem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
						elem = elem.parentNode;
					}

					var
					param = _options.vertical ? "top" : "left",
						// which param is of interest ?
						containerOffset = _util.get.offset(_options.container),
						// container position is needed because element offset is returned in relation to document, not in relation to container.
						elementOffset = _util.get.offset(elem);

					if (!_isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
						containerOffset[param] -= Controller.scrollPos();
					}

					Controller.scrollTo(elementOffset[param] - containerOffset[param], additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", scrollTarget);
				}
			}
			return Controller;
		};

		/**
		 * **Get** the current scrollPosition or **Set** a new method to calculate it.  
		 * -> **GET**:
		 * When used as a getter this function will return the current scroll position.  
		 * To get a cached value use Controller.info("scrollPos"), which will be updated in the update cycle.  
		 * For vertical controllers it will return the top scroll offset and for horizontal applications it will return the left offset.
		 *
		 * -> **SET**:
		 * When used as a setter this method prodes a way to permanently overwrite the controller's scroll position calculation.  
		 * A typical usecase is when the scroll position is not reflected by the containers scrollTop or scrollLeft values, but for example by the inner offset of a child container.  
		 * Moving a child container inside a parent is a commonly used method for several scrolling frameworks, including iScroll.  
		 * By providing an alternate calculation function you can make sure ScrollMagic receives the correct scroll position.  
		 * Please also bear in mind that your function should return y values for vertical scrolls an x for horizontals.
		 *
		 * To change the current scroll position please use `Controller.scrollTo()`.
		 * @public
		 *
		 * @example
		 * // get the current scroll Position
		 * var scrollPos = controller.scrollPos();
		 *
		 * // set a new scroll position calculation method
		 * controller.scrollPos(function () {
		 *	return this.info("vertical") ? -mychildcontainer.y : -mychildcontainer.x
		 * });
		 *
		 * @param {function} [scrollPosMethod] - The function to be used for the scroll position calculation of the container.
		 * @returns {(number|Controller)} Current scroll position or parent object for chaining.
		 */
		this.scrollPos = function (scrollPosMethod) {
			if (!arguments.length) { // get
				return getScrollPos.call(Controller);
			} else { // set
				if (_util.type.Function(scrollPosMethod)) {
					getScrollPos = scrollPosMethod;
				} else {
					log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
				}
			}
			return Controller;
		};

		/**
		 * **Get** all infos or one in particular about the controller.
		 * @public
		 * @example
		 * // returns the current scroll position (number)
		 * var scrollPos = controller.info("scrollPos");
		 *
		 * // returns all infos as an object
		 * var infos = controller.info();
		 *
		 * @param {string} [about] - If passed only this info will be returned instead of an object containing all.  
		 Valid options are:
		 ** `"size"` => the current viewport size of the container
		 ** `"vertical"` => true if vertical scrolling, otherwise false
		 ** `"scrollPos"` => the current scroll position
		 ** `"scrollDirection"` => the last known direction of the scroll
		 ** `"container"` => the container element
		 ** `"isDocument"` => true if container element is the document.
		 * @returns {(mixed|object)} The requested info(s).
		 */
		this.info = function (about) {
			var values = {
				size: _viewPortSize,
				// contains height or width (in regard to orientation);
				vertical: _options.vertical,
				scrollPos: _scrollPos,
				scrollDirection: _scrollDirection,
				container: _options.container,
				isDocument: _isDocument
			};
			if (!arguments.length) { // get all as an object
				return values;
			} else if (values[about] !== undefined) {
				return values[about];
			} else {
				log(1, "ERROR: option \"" + about + "\" is not available");
				return;
			}
		};

		/**
		 * **Get** or **Set** the current loglevel option value.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var loglevel = controller.loglevel();
		 *
		 * // set a new value
		 * controller.loglevel(3);
		 *
		 * @param {number} [newLoglevel] - The new loglevel setting of the Controller. `[0-3]`
		 * @returns {(number|Controller)} Current loglevel or parent object for chaining.
		 */
		this.loglevel = function (newLoglevel) {
			if (!arguments.length) { // get
				return _options.loglevel;
			} else if (_options.loglevel != newLoglevel) { // set
				_options.loglevel = newLoglevel;
			}
			return Controller;
		};

		/**
		 * **Get** or **Set** the current enabled state of the controller.  
		 * This can be used to disable all Scenes connected to the controller without destroying or removing them.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var enabled = controller.enabled();
		 *
		 * // disable the controller
		 * controller.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the controller `true` or `false`.
		 * @returns {(boolean|Controller)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !! newState;
				Controller.updateScene(_sceneObjects, true);
			}
			return Controller;
		};

		/**
		 * Destroy the Controller, all Scenes and everything.
		 * @public
		 *
		 * @example
		 * // without resetting the scenes
		 * controller = controller.destroy();
		 *
		 * // with scene reset
		 * controller = controller.destroy(true);
		 *
		 * @param {boolean} [resetScenes=false] - If `true` the pins and tweens (if existent) of all scenes will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (resetScenes) {
			window.clearTimeout(_refreshTimeout);
			var i = _sceneObjects.length;
			while (i--) {
				_sceneObjects[i].destroy(resetScenes);
			}
			_options.container.removeEventListener("resize", onChange);
			_options.container.removeEventListener("scroll", onChange);
			_util.cAF(_updateTimeout);
			log(3, "destroyed " + NAMESPACE + " (reset: " + (resetScenes ? "true" : "false") + ")");
			return null;
		};

		// INIT
		construct();
		return Controller;
	};

	// store pagewide controller options
	var CONTROLLER_OPTIONS = {
		defaults: {
			container: window,
			vertical: true,
			globalSceneOptions: {},
			loglevel: 2,
			refreshInterval: 100
		}
	};
/*
 * method used to add an option to ScrollMagic Scenes.
 */
	ScrollMagic.Controller.addOption = function (name, defaultValue) {
		CONTROLLER_OPTIONS.defaults[name] = defaultValue;
	};
	// instance extension function for plugins
	ScrollMagic.Controller.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Controller = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Controller, oldClass); // copy properties
		ScrollMagic.Controller.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Controller.prototype.constructor = ScrollMagic.Controller; // restore constructor
	};


	/**
	 * A Scene defines where the controller should react and how.
	 *
	 * @class
	 *
	 * @example
	 * // create a standard scene and add it to a controller
	 * new ScrollMagic.Scene()
	 *		.addTo(controller);
	 *
	 * // create a scene with custom options and assign a handler to it.
	 * var scene = new ScrollMagic.Scene({
	 * 		duration: 100,
	 *		offset: 200,
	 *		triggerHook: "onEnter",
	 *		reverse: false
	 * });
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.  
	 Instead of setting the options for each scene individually you can also set them globally in the controller as the controllers `globalSceneOptions` option. The object accepts the same properties as the ones below.  
	 When a scene is added to the controller the options defined using the Scene constructor will be overwritten by those set in `globalSceneOptions`.
	 * @param {(number|function)} [options.duration=0] - The duration of the scene. 
	 If `0` tweens will auto-play when reaching the scene start point, pins will be pinned indefinetly starting at the start position.  
	 A function retuning the duration value is also supported. Please see `Scene.duration()` for details.
	 * @param {number} [options.offset=0] - Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.
	 * @param {(string|object)} [options.triggerElement=null] - Selector or DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).
	 * @param {(number|string)} [options.triggerHook="onCenter"] - Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.  
	 Can also be defined using a string:
	 ** `"onEnter"` => `1`
	 ** `"onCenter"` => `0.5`
	 ** `"onLeave"` => `0`
	 * @param {boolean} [options.reverse=true] - Should the scene reverse, when scrolling up?
	 * @param {number} [options.loglevel=2] - Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 ** `0` => silent
	 ** `1` => errors
	 ** `2` => errors, warnings
	 ** `3` => errors, warnings, debuginfo
	 * 
	 */
	ScrollMagic.Scene = function (options) {

/*
	 * ----------------------------------------------------------------
	 * settings
	 * ----------------------------------------------------------------
	 */

		var
		NAMESPACE = 'ScrollMagic.Scene',
			SCENE_STATE_BEFORE = 'BEFORE',
			SCENE_STATE_DURING = 'DURING',
			SCENE_STATE_AFTER = 'AFTER',
			DEFAULT_OPTIONS = SCENE_OPTIONS.defaults;

/*
	 * ----------------------------------------------------------------
	 * private vars
	 * ----------------------------------------------------------------
	 */

		var
		Scene = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_state = SCENE_STATE_BEFORE,
			_progress = 0,
			_scrollOffset = {
				start: 0,
				end: 0
			},
			// reflects the controllers's scroll position for the start and end of the scene respectively
			_triggerPos = 0,
			_enabled = true,
			_durationUpdateMethod, _controller;

		/**
		 * Internal constructor function of the ScrollMagic Scene
		 * @private
		 */
		var construct = function () {
			for (var key in _options) { // check supplied options
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			// add getters/setters for all possible options
			for (var optionName in DEFAULT_OPTIONS) {
				addSceneOption(optionName);
			}
			// validate all options
			validateOption();
		};

/*
 * ----------------------------------------------------------------
 * Event Management
 * ----------------------------------------------------------------
 */

		var _listeners = {};
		/**
		 * Scene start event.  
		 * Fires whenever the scroll position its the starting point of the scene.  
		 * It will also fire when scrolling back up going over the start position of the scene. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#start
		 *
		 * @example
		 * scene.on("start", function (event) {
		 * 	console.log("Hit start point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene end event.  
		 * Fires whenever the scroll position its the ending point of the scene.  
		 * It will also fire when scrolling back up from after the scene and going over its end position. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#end
		 *
		 * @example
		 * scene.on("end", function (event) {
		 * 	console.log("Hit end point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene enter event.  
		 * Fires whenever the scene enters the "DURING" state.  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene enters its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#enter
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 * 	console.log("Scene entered.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene - always `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene leave event.  
		 * Fires whenever the scene's state goes from "DURING" to either "BEFORE" or "AFTER".  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene leaves its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#leave
		 *
		 * @example
		 * scene.on("leave", function (event) {
		 * 	console.log("Scene left.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene update event.  
		 * Fires whenever the scene is updated (but not necessarily changes the progress).
		 *
		 * @event ScrollMagic.Scene#update
		 *
		 * @example
		 * scene.on("update", function (event) {
		 * 	console.log("Scene updated.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.startPos - The starting position of the scene (in relation to the conainer)
		 * @property {number} event.endPos - The ending position of the scene (in relation to the conainer)
		 * @property {number} event.scrollPos - The current scroll position of the container
		 */
		/**
		 * Scene progress event.  
		 * Fires whenever the progress of the scene changes.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#progress
		 *
		 * @example
		 * scene.on("progress", function (event) {
		 * 	console.log("Scene progress changed to " + event.progress);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"`, `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene change event.  
		 * Fires whenvever a property of the scene is changed.
		 *
		 * @event ScrollMagic.Scene#change
		 *
		 * @example
		 * scene.on("change", function (event) {
		 * 	console.log("Scene Property \"" + event.what + "\" changed to " + event.newval);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.what - Indicates what value has been changed
		 * @property {mixed} event.newval - The new value of the changed property
		 */
		/**
		 * Scene shift event.  
		 * Fires whenvever the start or end **scroll offset** of the scene change.
		 * This happens explicitely, when one of these values change: `offset`, `duration` or `triggerHook`.
		 * It will fire implicitly when the `triggerElement` changes, if the new element has a different position (most cases).
		 * It will also fire implicitly when the size of the container changes and the triggerHook is anything other than `onLeave`.
		 *
		 * @event ScrollMagic.Scene#shift
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("shift", function (event) {
		 * 	console.log("Scene moved, because the " + event.reason + " has changed.)");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.reason - Indicates why the scene has shifted
		 */
		/**
		 * Scene destroy event.  
		 * Fires whenvever the scene is destroyed.
		 * This can be used to tidy up custom behaviour used in events.
		 *
		 * @event ScrollMagic.Scene#destroy
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 *        // add custom action
		 *        $("#my-elem").left("200");
		 *      })
		 *      .on("destroy", function (event) {
		 *        // reset my element to start position
		 *        if (event.reset) {
		 *          $("#my-elem").left("0");
		 *        }
		 *      });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.reset - Indicates if the destroy method was called with reset `true` or `false`.
		 */
		/**
		 * Scene add event.  
		 * Fires when the scene is added to a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#add
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("add", function (event) {
		 * 	console.log('Scene was added to a new controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.controller - The controller object the scene was added to.
		 */
		/**
		 * Scene remove event.  
		 * Fires when the scene is removed from a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#remove
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("remove", function (event) {
		 * 	console.log('Scene was removed from its controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 */

		/**
		 * Add one ore more event listener.  
		 * The callback function will be fired at the respective event, and an object containing relevant data will be passed to the callback.
		 * @method ScrollMagic.Scene#on
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update progress start end enter leave", callback);
		 *
		 * @param {string} names - The name or names of the event the callback should be attached to.
		 * @param {function} callback - A function that should be executed, when the event is dispatched. An event object will be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.on = function (names, callback) {
			if (_util.type.Function(callback)) {
				names = names.trim().split(' ');
				names.forEach(function (fullname) {
					var
					nameparts = fullname.split('.'),
						eventname = nameparts[0],
						namespace = nameparts[1];
					if (eventname != "*") { // disallow wildcards
						if (!_listeners[eventname]) {
							_listeners[eventname] = [];
						}
						_listeners[eventname].push({
							namespace: namespace || '',
							callback: callback
						});
					}
				});
			} else {
				log(1, "ERROR when calling '.on()': Supplied callback for '" + names + "' is not a valid function!");
			}
			return Scene;
		};

		/**
		 * Remove one or more event listener.
		 * @method ScrollMagic.Scene#off
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update", callback);
		 * // remove listeners
		 * scene.off("change update", callback);
		 *
		 * @param {string} names - The name or names of the event that should be removed.
		 * @param {function} [callback] - A specific callback function that should be removed. If none is passed all callbacks to the event listener will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.off = function (names, callback) {
			if (!names) {
				log(1, "ERROR: Invalid event name supplied.");
				return Scene;
			}
			names = names.trim().split(' ');
			names.forEach(function (fullname, key) {
				var
				nameparts = fullname.split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1] || '',
					removeList = eventname === '*' ? Object.keys(_listeners) : [eventname];
				removeList.forEach(function (remove) {
					var
					list = _listeners[remove] || [],
						i = list.length;
					while (i--) {
						var listener = list[i];
						if (listener && (namespace === listener.namespace || namespace === '*') && (!callback || callback == listener.callback)) {
							list.splice(i, 1);
						}
					}
					if (!list.length) {
						delete _listeners[remove];
					}
				});
			});
			return Scene;
		};

		/**
		 * Trigger an event.
		 * @method ScrollMagic.Scene#trigger
		 *
		 * @example
		 * this.trigger("change");
		 *
		 * @param {string} name - The name of the event that should be triggered.
		 * @param {object} [vars] - An object containing info that should be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.trigger = function (name, vars) {
			if (name) {
				var
				nameparts = name.trim().split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1],
					listeners = _listeners[eventname];
				log(3, 'event fired:', eventname, vars ? "->" : '', vars || '');
				if (listeners) {
					listeners.forEach(function (listener, key) {
						if (!namespace || namespace === listener.namespace) {
							listener.callback.call(Scene, new ScrollMagic.Event(eventname, listener.namespace, Scene, vars));
						}
					});
				}
			} else {
				log(1, "ERROR: Invalid event name supplied.");
			}
			return Scene;
		};

		// set event listeners
		Scene.on("change.internal", function (e) {
			if (e.what !== "loglevel" && e.what !== "tweenChanges") { // no need for a scene update scene with these options...
				if (e.what === "triggerElement") {
					updateTriggerElementPosition();
				} else if (e.what === "reverse") { // the only property left that may have an impact on the current scene state. Everything else is handled by the shift event.
					Scene.update();
				}
			}
		}).on("shift.internal", function (e) {
			updateScrollOffset();
			Scene.update(); // update scene to reflect new position
		});

		/**
		 * Send a debug message to the console.
		 * @private
		 * but provided publicly with _log for plugins
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};

		/**
		 * Add the scene to a controller.  
		 * This is the equivalent to `Controller.addScene(scene)`.
		 * @method ScrollMagic.Scene#addTo
		 *
		 * @example
		 * // add a scene to a ScrollMagic Controller
		 * scene.addTo(controller);
		 *
		 * @param {ScrollMagic.Controller} controller - The controller to which the scene should be added.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.addTo = function (controller) {
			if (!(controller instanceof ScrollMagic.Controller)) {
				log(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");
			} else if (_controller != controller) {
				// new controller
				if (_controller) { // was associated to a different controller before, so remove it...
					_controller.removeScene(Scene);
				}
				_controller = controller;
				validateOption();
				updateDuration(true);
				updateTriggerElementPosition(true);
				updateScrollOffset();
				_controller.info("container").addEventListener('resize', onContainerResize);
				controller.addScene(Scene);
				Scene.trigger("add", {
					controller: _controller
				});
				log(3, "added " + NAMESPACE + " to controller");
				Scene.update();
			}
			return Scene;
		};

		/**
		 * **Get** or **Set** the current enabled state of the scene.  
		 * This can be used to disable this scene without removing or destroying it.
		 * @method ScrollMagic.Scene#enabled
		 *
		 * @example
		 * // get the current value
		 * var enabled = scene.enabled();
		 *
		 * // disable the scene
		 * scene.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the scene `true` or `false`.
		 * @returns {(boolean|Scene)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !! newState;
				Scene.update(true);
			}
			return Scene;
		};

		/**
		 * Remove the scene from the controller.  
		 * This is the equivalent to `Controller.removeScene(scene)`.
		 * The scene will not be updated anymore until you readd it to a controller.
		 * To remove the pin or the tween you need to call removeTween() or removePin() respectively.
		 * @method ScrollMagic.Scene#remove
		 * @example
		 * // remove the scene from its controller
		 * scene.remove();
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.remove = function () {
			if (_controller) {
				_controller.info("container").removeEventListener('resize', onContainerResize);
				var tmpParent = _controller;
				_controller = undefined;
				tmpParent.removeScene(Scene);
				Scene.trigger("remove");
				log(3, "removed " + NAMESPACE + " from controller");
			}
			return Scene;
		};

		/**
		 * Destroy the scene and everything.
		 * @method ScrollMagic.Scene#destroy
		 * @example
		 * // destroy the scene without resetting the pin and tween to their initial positions
		 * scene = scene.destroy();
		 *
		 * // destroy the scene and reset the pin and tween
		 * scene = scene.destroy(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the pin and tween (if existent) will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (reset) {
			Scene.trigger("destroy", {
				reset: reset
			});
			Scene.remove();
			Scene.off("*.*");
			log(3, "destroyed " + NAMESPACE + " (reset: " + (reset ? "true" : "false") + ")");
			return null;
		};


		/**
		 * Updates the Scene to reflect the current state.  
		 * This is the equivalent to `Controller.updateScene(scene, immediately)`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.
		 * This means an update doesn't necessarily result in a progress change. The `progress` event will be fired if the progress has indeed changed between this update and the last.  
		 * _**NOTE:** This method gets called constantly whenever ScrollMagic detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @method ScrollMagic.Scene#update
		 * @example
		 * // update the scene on next tick
		 * scene.update();
		 *
		 * // update the scene immediately
		 * scene.update(true);
		 *
		 * @fires Scene.update
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance).
		 * @returns {Scene} Parent object for chaining.
		 */
		this.update = function (immediately) {
			if (_controller) {
				if (immediately) {
					if (_controller.enabled() && _enabled) {
						var
						scrollPos = _controller.info("scrollPos"),
							newProgress;

						if (_options.duration > 0) {
							newProgress = (scrollPos - _scrollOffset.start) / (_scrollOffset.end - _scrollOffset.start);
						} else {
							newProgress = scrollPos >= _scrollOffset.start ? 1 : 0;
						}

						Scene.trigger("update", {
							startPos: _scrollOffset.start,
							endPos: _scrollOffset.end,
							scrollPos: scrollPos
						});

						Scene.progress(newProgress);
					} else if (_pin && _state === SCENE_STATE_DURING) {
						updatePinState(true); // unpin in position
					}
				} else {
					_controller.updateScene(Scene, false);
				}
			}
			return Scene;
		};

		/**
		 * Updates dynamic scene variables like the trigger element position or the duration.
		 * This method is automatically called in regular intervals from the controller. See {@link ScrollMagic.Controller} option `refreshInterval`.
		 * 
		 * You can call it to minimize lag, for example when you intentionally change the position of the triggerElement.
		 * If you don't it will simply be updated in the next refresh interval of the container, which is usually sufficient.
		 *
		 * @method ScrollMagic.Scene#refresh
		 * @since 1.1.0
		 * @example
		 * scene = new ScrollMagic.Scene({triggerElement: "#trigger"});
		 * 
		 * // change the position of the trigger
		 * $("#trigger").css("top", 500);
		 * // immediately let the scene know of this change
		 * scene.refresh();
		 *
		 * @fires {@link Scene.shift}, if the trigger element position or the duration changed
		 * @fires {@link Scene.change}, if the duration changed
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.refresh = function () {
			updateDuration();
			updateTriggerElementPosition();
			// update trigger element position
			return Scene;
		};

		/**
		 * **Get** or **Set** the scene's progress.  
		 * Usually it shouldn't be necessary to use this as a setter, as it is set automatically by scene.update().  
		 * The order in which the events are fired depends on the duration of the scene:
		 *  1. Scenes with `duration == 0`:  
		 *  Scenes that have no duration by definition have no ending. Thus the `end` event will never be fired.  
		 *  When the trigger position of the scene is passed the events are always fired in this order:  
		 *  `enter`, `start`, `progress` when scrolling forward  
		 *  and  
		 *  `progress`, `start`, `leave` when scrolling in reverse
		 *  2. Scenes with `duration > 0`:  
		 *  Scenes with a set duration have a defined start and end point.  
		 *  When scrolling past the start position of the scene it will fire these events in this order:  
		 *  `enter`, `start`, `progress`  
		 *  When continuing to scroll and passing the end point it will fire these events:  
		 *  `progress`, `end`, `leave`  
		 *  When reversing through the end point these events are fired:  
		 *  `enter`, `end`, `progress`  
		 *  And when continuing to scroll past the start position in reverse it will fire:  
		 *  `progress`, `start`, `leave`  
		 *  In between start and end the `progress` event will be called constantly, whenever the progress changes.
		 * 
		 * In short:  
		 * `enter` events will always trigger **before** the progress update and `leave` envents will trigger **after** the progress update.  
		 * `start` and `end` will always trigger at their respective position.
		 * 
		 * Please review the event descriptions for details on the events and the event object that is passed to the callback.
		 * 
		 * @method ScrollMagic.Scene#progress
		 * @example
		 * // get the current scene progress
		 * var progress = scene.progress();
		 *
		 * // set new scene progress
		 * scene.progress(0.3);
		 *
		 * @fires {@link Scene.enter}, when used as setter
		 * @fires {@link Scene.start}, when used as setter
		 * @fires {@link Scene.progress}, when used as setter
		 * @fires {@link Scene.end}, when used as setter
		 * @fires {@link Scene.leave}, when used as setter
		 *
		 * @param {number} [progress] - The new progress value of the scene `[0-1]`.
		 * @returns {number} `get` -  Current scene progress.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */
		this.progress = function (progress) {
			if (!arguments.length) { // get
				return _progress;
			} else { // set
				var
				doUpdate = false,
					oldState = _state,
					scrollDirection = _controller ? _controller.info("scrollDirection") : 'PAUSED',
					reverseOrForward = _options.reverse || progress >= _progress;
				if (_options.duration === 0) {
					// zero duration scenes
					doUpdate = _progress != progress;
					_progress = progress < 1 && reverseOrForward ? 0 : 1;
					_state = _progress === 0 ? SCENE_STATE_BEFORE : SCENE_STATE_DURING;
				} else {
					// scenes with start and end
					if (progress < 0 && _state !== SCENE_STATE_BEFORE && reverseOrForward) {
						// go back to initial state
						_progress = 0;
						_state = SCENE_STATE_BEFORE;
						doUpdate = true;
					} else if (progress >= 0 && progress < 1 && reverseOrForward) {
						_progress = progress;
						_state = SCENE_STATE_DURING;
						doUpdate = true;
					} else if (progress >= 1 && _state !== SCENE_STATE_AFTER) {
						_progress = 1;
						_state = SCENE_STATE_AFTER;
						doUpdate = true;
					} else if (_state === SCENE_STATE_DURING && !reverseOrForward) {
						updatePinState(); // in case we scrolled backwards mid-scene and reverse is disabled => update the pin position, so it doesn't move back as well.
					}
				}
				if (doUpdate) {
					// fire events
					var
					eventVars = {
						progress: _progress,
						state: _state,
						scrollDirection: scrollDirection
					},
						stateChanged = _state != oldState;

					var trigger = function (eventName) { // tmp helper to simplify code
						Scene.trigger(eventName, eventVars);
					};

					if (stateChanged) { // enter events
						if (oldState !== SCENE_STATE_DURING) {
							trigger("enter");
							trigger(oldState === SCENE_STATE_BEFORE ? "start" : "end");
						}
					}
					trigger("progress");
					if (stateChanged) { // leave events
						if (_state !== SCENE_STATE_DURING) {
							trigger(_state === SCENE_STATE_BEFORE ? "start" : "end");
							trigger("leave");
						}
					}
				}

				return Scene;
			}
		};


		/**
		 * Update the start and end scrollOffset of the container.
		 * The positions reflect what the controller's scroll position will be at the start and end respectively.
		 * Is called, when:
		 *   - Scene event "change" is called with: offset, triggerHook, duration 
		 *   - scroll container event "resize" is called
		 *   - the position of the triggerElement changes
		 *   - the controller changes -> addTo()
		 * @private
		 */
		var updateScrollOffset = function () {
			_scrollOffset = {
				start: _triggerPos + _options.offset
			};
			if (_controller && _options.triggerElement) {
				// take away triggerHook portion to get relative to top
				_scrollOffset.start -= _controller.info("size") * _options.triggerHook;
			}
			_scrollOffset.end = _scrollOffset.start + _options.duration;
		};

		/**
		 * Updates the duration if set to a dynamic function.
		 * This method is called when the scene is added to a controller and in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.change}, if the duration changed
		 * @fires {@link Scene.shift}, if the duration changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateDuration = function (suppressEvents) {
			// update duration
			if (_durationUpdateMethod) {
				var varname = "duration";
				if (changeOption(varname, _durationUpdateMethod.call(Scene)) && !suppressEvents) { // set
					Scene.trigger("change", {
						what: varname,
						newval: _options[varname]
					});
					Scene.trigger("shift", {
						reason: varname
					});
				}
			}
		};

		/**
		 * Updates the position of the triggerElement, if present.
		 * This method is called ...
		 *  - ... when the triggerElement is changed
		 *  - ... when the scene is added to a (new) controller
		 *  - ... in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.shift}, if the position changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateTriggerElementPosition = function (suppressEvents) {
			var
			elementPos = 0,
				telem = _options.triggerElement;
			if (_controller && telem) {
				var
				controllerInfo = _controller.info(),
					containerOffset = _util.get.offset(controllerInfo.container),
					// container position is needed because element offset is returned in relation to document, not in relation to container.
					param = controllerInfo.vertical ? "top" : "left"; // which param is of interest ?
				// if parent is spacer, use spacer position instead so correct start position is returned for pinned elements.
				while (telem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
					telem = telem.parentNode;
				}

				var elementOffset = _util.get.offset(telem);

				if (!controllerInfo.isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
					containerOffset[param] -= _controller.scrollPos();
				}

				elementPos = elementOffset[param] - containerOffset[param];
			}
			var changed = elementPos != _triggerPos;
			_triggerPos = elementPos;
			if (changed && !suppressEvents) {
				Scene.trigger("shift", {
					reason: "triggerElementPosition"
				});
			}
		};

		/**
		 * Trigger a shift event, when the container is resized and the triggerHook is > 1.
		 * @private
		 */
		var onContainerResize = function (e) {
			if (_options.triggerHook > 0) {
				Scene.trigger("shift", {
					reason: "containerResize"
				});
			}
		};

		var _validate = _util.extend(SCENE_OPTIONS.validate, {
			// validation for duration handled internally for reference to private var _durationMethod
			duration: function (val) {
				if (_util.type.String(val) && val.match(/^(\.|\d)*\d+%$/)) {
					// percentage value
					var perc = parseFloat(val) / 100;
					val = function () {
						return _controller ? _controller.info("size") * perc : 0;
					};
				}
				if (_util.type.Function(val)) {
					// function
					_durationUpdateMethod = val;
					try {
						val = parseFloat(_durationUpdateMethod());
					} catch (e) {
						val = -1; // will cause error below
					}
				}
				// val has to be float
				val = parseFloat(val);
				if (!_util.type.Number(val) || val < 0) {
					if (_durationUpdateMethod) {
						_durationUpdateMethod = undefined;
						throw ["Invalid return value of supplied function for option \"duration\":", val];
					} else {
						throw ["Invalid value for option \"duration\":", val];
					}
				}
				return val;
			}
		});

		/**
		 * Checks the validity of a specific or all options and reset to default if neccessary.
		 * @private
		 */
		var validateOption = function (check) {
			check = arguments.length ? [check] : Object.keys(_validate);
			check.forEach(function (optionName, key) {
				var value;
				if (_validate[optionName]) { // there is a validation method for this option
					try { // validate value
						value = _validate[optionName](_options[optionName]);
					} catch (e) { // validation failed -> reset to default
						value = DEFAULT_OPTIONS[optionName];
						var logMSG = _util.type.String(e) ? [e] : e;
						if (_util.type.Array(logMSG)) {
							logMSG[0] = "ERROR: " + logMSG[0];
							logMSG.unshift(1); // loglevel 1 for error msg
							log.apply(this, logMSG);
						} else {
							log(1, "ERROR: Problem executing validation callback for option '" + optionName + "':", e.message);
						}
					} finally {
						_options[optionName] = value;
					}
				}
			});
		};

		/**
		 * Helper used by the setter/getters for scene options
		 * @private
		 */
		var changeOption = function (varname, newval) {
			var
			changed = false,
				oldval = _options[varname];
			if (_options[varname] != newval) {
				_options[varname] = newval;
				validateOption(varname); // resets to default if necessary
				changed = oldval != _options[varname];
			}
			return changed;
		};

		// generate getters/setters for all options
		var addSceneOption = function (optionName) {
			if (!Scene[optionName]) {
				Scene[optionName] = function (newVal) {
					if (!arguments.length) { // get
						return _options[optionName];
					} else {
						if (optionName === "duration") { // new duration is set, so any previously set function must be unset
							_durationUpdateMethod = undefined;
						}
						if (changeOption(optionName, newVal)) { // set
							Scene.trigger("change", {
								what: optionName,
								newval: _options[optionName]
							});
							if (SCENE_OPTIONS.shifts.indexOf(optionName) > -1) {
								Scene.trigger("shift", {
									reason: optionName
								});
							}
						}
					}
					return Scene;
				};
			}
		};

		/**
		 * **Get** or **Set** the duration option value.
		 * As a setter it also accepts a function returning a numeric value.  
		 * This is particularly useful for responsive setups.
		 *
		 * The duration is updated using the supplied function every time `Scene.refresh()` is called, which happens periodically from the controller (see ScrollMagic.Controller option `refreshInterval`).  
		 * _**NOTE:** Be aware that it's an easy way to kill performance, if you supply a function that has high CPU demand.  
		 * Even for size and position calculations it is recommended to use a variable to cache the value. (see example)  
		 * This counts double if you use the same function for multiple scenes._
		 *
		 * @method ScrollMagic.Scene#duration
		 * @example
		 * // get the current duration value
		 * var duration = scene.duration();
		 *
		 * // set a new duration
		 * scene.duration(300);
		 *
		 * // use a function to automatically adjust the duration to the window height.
		 * var durationValueCache;
		 * function getDuration () {
		 *   return durationValueCache;
		 * }
		 * function updateDuration (e) {
		 *   durationValueCache = window.innerHeight;
		 * }
		 * $(window).on("resize", updateDuration); // update the duration when the window size changes
		 * $(window).triggerHandler("resize"); // set to initial value
		 * scene.duration(getDuration); // supply duration method
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|function)} [newDuration] - The new duration of the scene.
		 * @returns {number} `get` -  Current scene duration.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the offset option value.
		 * @method ScrollMagic.Scene#offset
		 * @example
		 * // get the current offset
		 * var offset = scene.offset();
		 *
		 * // set a new offset
		 * scene.offset(100);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {number} [newOffset] - The new offset of the scene.
		 * @returns {number} `get` -  Current scene offset.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerElement option value.
		 * Does **not** fire `Scene.shift`, because changing the trigger Element doesn't necessarily mean the start position changes. This will be determined in `Scene.refresh()`, which is automatically triggered.
		 * @method ScrollMagic.Scene#triggerElement
		 * @example
		 * // get the current triggerElement
		 * var triggerElement = scene.triggerElement();
		 *
		 * // set a new triggerElement using a selector
		 * scene.triggerElement("#trigger");
		 * // set a new triggerElement using a DOM object
		 * scene.triggerElement(document.getElementById("trigger"));
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {(string|object)} [newTriggerElement] - The new trigger element for the scene.
		 * @returns {(string|object)} `get` -  Current triggerElement.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerHook option value.
		 * @method ScrollMagic.Scene#triggerHook
		 * @example
		 * // get the current triggerHook value
		 * var triggerHook = scene.triggerHook();
		 *
		 * // set a new triggerHook using a string
		 * scene.triggerHook("onLeave");
		 * // set a new triggerHook using a number
		 * scene.triggerHook(0.7);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string)} [newTriggerHook] - The new triggerHook of the scene. See {@link Scene} parameter description for value options.
		 * @returns {number} `get` -  Current triggerHook (ALWAYS numerical).
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the reverse option value.
		 * @method ScrollMagic.Scene#reverse
		 * @example
		 * // get the current reverse option
		 * var reverse = scene.reverse();
		 *
		 * // set new reverse option
		 * scene.reverse(false);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {boolean} [newReverse] - The new reverse setting of the scene.
		 * @returns {boolean} `get` -  Current reverse option value.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the loglevel option value.
		 * @method ScrollMagic.Scene#loglevel
		 * @example
		 * // get the current loglevel
		 * var loglevel = scene.loglevel();
		 *
		 * // set new loglevel
		 * scene.loglevel(3);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {number} [newLoglevel] - The new loglevel setting of the scene. `[0-3]`
		 * @returns {number} `get` -  Current loglevel.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** the associated controller.
		 * @method ScrollMagic.Scene#controller
		 * @example
		 * // get the controller of a scene
		 * var controller = scene.controller();
		 *
		 * @returns {ScrollMagic.Controller} Parent controller or `undefined`
		 */
		this.controller = function () {
			return _controller;
		};

		/**
		 * **Get** the current state.
		 * @method ScrollMagic.Scene#state
		 * @example
		 * // get the current state
		 * var state = scene.state();
		 *
		 * @returns {string} `"BEFORE"`, `"DURING"` or `"AFTER"`
		 */
		this.state = function () {
			return _state;
		};

		/**
		 * **Get** the current scroll offset for the start of the scene.  
		 * Mind, that the scrollOffset is related to the size of the container, if `triggerHook` is bigger than `0` (or `"onLeave"`).  
		 * This means, that resizing the container or changing the `triggerHook` will influence the scene's start offset.
		 * @method ScrollMagic.Scene#scrollOffset
		 * @example
		 * // get the current scroll offset for the start and end of the scene.
		 * var start = scene.scrollOffset();
		 * var end = scene.scrollOffset() + scene.duration();
		 * console.log("the scene starts at", start, "and ends at", end);
		 *
		 * @returns {number} The scroll offset (of the container) at which the scene will trigger. Y value for vertical and X value for horizontal scrolls.
		 */
		this.scrollOffset = function () {
			return _scrollOffset.start;
		};

		/**
		 * **Get** the trigger position of the scene (including the value of the `offset` option).  
		 * @method ScrollMagic.Scene#triggerPosition
		 * @example
		 * // get the scene's trigger position
		 * var triggerPosition = scene.triggerPosition();
		 *
		 * @returns {number} Start position of the scene. Top position value for vertical and left position value for horizontal scrolls.
		 */
		this.triggerPosition = function () {
			var pos = _options.offset; // the offset is the basis
			if (_controller) {
				// get the trigger position
				if (_options.triggerElement) {
					// Element as trigger
					pos += _triggerPos;
				} else {
					// return the height of the triggerHook to start at the beginning
					pos += _controller.info("size") * Scene.triggerHook();
				}
			}
			return pos;
		};

		var
		_pin, _pinOptions;

		Scene.on("shift.internal", function (e) {
			var durationChanged = e.reason === "duration";
			if ((_state === SCENE_STATE_AFTER && durationChanged) || (_state === SCENE_STATE_DURING && _options.duration === 0)) {
				// if [duration changed after a scene (inside scene progress updates pin position)] or [duration is 0, we are in pin phase and some other value changed].
				updatePinState();
			}
			if (durationChanged) {
				updatePinDimensions();
			}
		}).on("progress.internal", function (e) {
			updatePinState();
		}).on("add.internal", function (e) {
			updatePinDimensions();
		}).on("destroy.internal", function (e) {
			Scene.removePin(e.reset);
		});
		/**
		 * Update the pin state.
		 * @private
		 */
		var updatePinState = function (forceUnpin) {
			if (_pin && _controller) {
				var
				containerInfo = _controller.info(),
					pinTarget = _pinOptions.spacer.firstChild; // may be pin element or another spacer, if cascading pins
				if (!forceUnpin && _state === SCENE_STATE_DURING) { // during scene or if duration is 0 and we are past the trigger
					// pinned state
					if (_util.css(pinTarget, "position") != "fixed") {
						// change state before updating pin spacer (position changes due to fixed collapsing might occur.)
						_util.css(pinTarget, {
							"position": "fixed"
						});
						// update pin spacer
						updatePinDimensions();
					}

					var
					fixedPos = _util.get.offset(_pinOptions.spacer, true),
						// get viewport position of spacer
						scrollDistance = _options.reverse || _options.duration === 0 ? containerInfo.scrollPos - _scrollOffset.start // quicker
						: Math.round(_progress * _options.duration * 10) / 10; // if no reverse and during pin the position needs to be recalculated using the progress
					// add scrollDistance
					fixedPos[containerInfo.vertical ? "top" : "left"] += scrollDistance;

					// set new values
					_util.css(_pinOptions.spacer.firstChild, {
						top: fixedPos.top,
						left: fixedPos.left
					});
				} else {
					// unpinned state
					var
					newCSS = {
						position: _pinOptions.inFlow ? "relative" : "absolute",
						top: 0,
						left: 0
					},
						change = _util.css(pinTarget, "position") != newCSS.position;

					if (!_pinOptions.pushFollowers) {
						newCSS[containerInfo.vertical ? "top" : "left"] = _options.duration * _progress;
					} else if (_options.duration > 0) { // only concerns scenes with duration
						if (_state === SCENE_STATE_AFTER && parseFloat(_util.css(_pinOptions.spacer, "padding-top")) === 0) {
							change = true; // if in after state but havent updated spacer yet (jumped past pin)
						} else if (_state === SCENE_STATE_BEFORE && parseFloat(_util.css(_pinOptions.spacer, "padding-bottom")) === 0) { // before
							change = true; // jumped past fixed state upward direction
						}
					}
					// set new values
					_util.css(pinTarget, newCSS);
					if (change) {
						// update pin spacer if state changed
						updatePinDimensions();
					}
				}
			}
		};

		/**
		 * Update the pin spacer and/or element size.
		 * The size of the spacer needs to be updated whenever the duration of the scene changes, if it is to push down following elements.
		 * @private
		 */
		var updatePinDimensions = function () {
			if (_pin && _controller && _pinOptions.inFlow) { // no spacerresize, if original position is absolute
				var
				after = (_state === SCENE_STATE_AFTER),
					before = (_state === SCENE_STATE_BEFORE),
					during = (_state === SCENE_STATE_DURING),
					vertical = _controller.info("vertical"),
					pinTarget = _pinOptions.spacer.firstChild,
					// usually the pined element but can also be another spacer (cascaded pins)
					marginCollapse = _util.isMarginCollapseType(_util.css(_pinOptions.spacer, "display")),
					css = {};

				// set new size
				// if relsize: spacer -> pin | else: pin -> spacer
				if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
					if (during) {
						_util.css(_pin, {
							"width": _util.get.width(_pinOptions.spacer)
						});
					} else {
						_util.css(_pin, {
							"width": "100%"
						});
					}
				} else {
					// minwidth is needed for cascaded pins.
					css["min-width"] = _util.get.width(vertical ? _pin : pinTarget, true, true);
					css.width = during ? css["min-width"] : "auto";
				}
				if (_pinOptions.relSize.height) {
					if (during) {
						// the only padding the spacer should ever include is the duration (if pushFollowers = true), so we need to substract that.
						_util.css(_pin, {
							"height": _util.get.height(_pinOptions.spacer) - (_pinOptions.pushFollowers ? _options.duration : 0)
						});
					} else {
						_util.css(_pin, {
							"height": "100%"
						});
					}
				} else {
					// margin is only included if it's a cascaded pin to resolve an IE9 bug
					css["min-height"] = _util.get.height(vertical ? pinTarget : _pin, true, !marginCollapse); // needed for cascading pins
					css.height = during ? css["min-height"] : "auto";
				}

				// add space for duration if pushFollowers is true
				if (_pinOptions.pushFollowers) {
					css["padding" + (vertical ? "Top" : "Left")] = _options.duration * _progress;
					css["padding" + (vertical ? "Bottom" : "Right")] = _options.duration * (1 - _progress);
				}
				_util.css(_pinOptions.spacer, css);
			}
		};

		/**
		 * Updates the Pin state (in certain scenarios)
		 * If the controller container is not the document and we are mid-pin-phase scrolling or resizing the main document can result to wrong pin positions.
		 * So this function is called on resize and scroll of the document.
		 * @private
		 */
		var updatePinInContainer = function () {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) {
				updatePinState();
			}
		};

		/**
		 * Updates the Pin spacer size state (in certain scenarios)
		 * If container is resized during pin and relatively sized the size of the pin might need to be updated...
		 * So this function is called on resize of the container.
		 * @private
		 */
		var updateRelativePinSpacer = function () {
			if (_controller && _pin && // well, duh
			_state === SCENE_STATE_DURING && // element in pinned state?
			( // is width or height relatively sized, but not in relation to body? then we need to recalc.
			((_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) && _util.get.width(window) != _util.get.width(_pinOptions.spacer.parentNode)) || (_pinOptions.relSize.height && _util.get.height(window) != _util.get.height(_pinOptions.spacer.parentNode)))) {
				updatePinDimensions();
			}
		};

		/**
		 * Is called, when the mousewhel is used while over a pinned element inside a div container.
		 * If the scene is in fixed state scroll events would be counted towards the body. This forwards the event to the scroll container.
		 * @private
		 */
		var onMousewheelOverPin = function (e) {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) { // in pin state
				e.preventDefault();
				_controller._setScrollPos(_controller.info("scrollPos") - ((e.wheelDelta || e[_controller.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30));
			}
		};

		/**
		 * Pin an element for the duration of the tween.  
		 * If the scene duration is 0 the element will only be unpinned, if the user scrolls back past the start position.  
		 * Make sure only one pin is applied to an element at the same time.
		 * An element can be pinned multiple times, but only successively.
		 * _**NOTE:** The option `pushFollowers` has no effect, when the scene duration is 0._
		 * @method ScrollMagic.Scene#setPin
		 * @example
		 * // pin element and push all following elements down by the amount of the pin duration.
		 * scene.setPin("#pin");
		 *
		 * // pin element and keeping all following elements in their place. The pinned element will move past them.
		 * scene.setPin("#pin", {pushFollowers: false});
		 *
		 * @param {(string|object)} element - A Selector targeting an element or a DOM object that is supposed to be pinned.
		 * @param {object} [settings] - settings for the pin
		 * @param {boolean} [settings.pushFollowers=true] - If `true` following elements will be "pushed" down for the duration of the pin, if `false` the pinned element will just scroll past them.  
		 Ignored, when duration is `0`.
		 * @param {string} [settings.spacerClass="scrollmagic-pin-spacer"] - Classname of the pin spacer element, which is used to replace the element.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setPin = function (element, settings) {
			var
			defaultSettings = {
				pushFollowers: true,
				spacerClass: "scrollmagic-pin-spacer"
			};
			settings = _util.extend({}, defaultSettings, settings);

			// validate Element
			element = _util.get.elements(element)[0];
			if (!element) {
				log(1, "ERROR calling method 'setPin()': Invalid pin element supplied.");
				return Scene; // cancel
			} else if (_util.css(element, "position") === "fixed") {
				log(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");
				return Scene; // cancel
			}

			if (_pin) { // preexisting pin?
				if (_pin === element) {
					// same pin we already have -> do nothing
					return Scene; // cancel
				} else {
					// kill old pin
					Scene.removePin();
				}

			}
			_pin = element;

			var
			parentDisplay = _pin.parentNode.style.display,
				boundsParams = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];

			_pin.parentNode.style.display = 'none'; // hack start to force css to return stylesheet values instead of calculated px values.
			var
			inFlow = _util.css(_pin, "position") != "absolute",
				pinCSS = _util.css(_pin, boundsParams.concat(["display"])),
				sizeCSS = _util.css(_pin, ["width", "height"]);
			_pin.parentNode.style.display = parentDisplay; // hack end.
			if (!inFlow && settings.pushFollowers) {
				log(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
				settings.pushFollowers = false;
			}
			window.setTimeout(function () { // wait until all finished, because with responsive duration it will only be set after scene is added to controller
				if (_pin && _options.duration === 0 && settings.pushFollowers) {
					log(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
				}
			}, 0);

			// create spacer and insert
			var
			spacer = _pin.parentNode.insertBefore(document.createElement('div'), _pin),
				spacerCSS = _util.extend(pinCSS, {
					position: inFlow ? "relative" : "absolute",
					boxSizing: "content-box",
					mozBoxSizing: "content-box",
					webkitBoxSizing: "content-box"
				});

			if (!inFlow) { // copy size if positioned absolutely, to work for bottom/right positioned elements.
				_util.extend(spacerCSS, _util.css(_pin, ["width", "height"]));
			}

			_util.css(spacer, spacerCSS);
			spacer.setAttribute(PIN_SPACER_ATTRIBUTE, "");
			_util.addClass(spacer, settings.spacerClass);

			// set the pin Options
			_pinOptions = {
				spacer: spacer,
				relSize: { // save if size is defined using % values. if so, handle spacer resize differently...
					width: sizeCSS.width.slice(-1) === "%",
					height: sizeCSS.height.slice(-1) === "%",
					autoFullWidth: sizeCSS.width === "auto" && inFlow && _util.isMarginCollapseType(pinCSS.display)
				},
				pushFollowers: settings.pushFollowers,
				inFlow: inFlow,
				// stores if the element takes up space in the document flow
			};

			if (!_pin.___origStyle) {
				_pin.___origStyle = {};
				var
				pinInlineCSS = _pin.style,
					copyStyles = boundsParams.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
				copyStyles.forEach(function (val) {
					_pin.___origStyle[val] = pinInlineCSS[val] || "";
				});
			}

			// if relative size, transfer it to spacer and make pin calculate it...
			if (_pinOptions.relSize.width) {
				_util.css(spacer, {
					width: sizeCSS.width
				});
			}
			if (_pinOptions.relSize.height) {
				_util.css(spacer, {
					height: sizeCSS.height
				});
			}

			// now place the pin element inside the spacer	
			spacer.appendChild(_pin);
			// and set new css
			_util.css(_pin, {
				position: inFlow ? "relative" : "absolute",
				margin: "auto",
				top: "auto",
				left: "auto",
				bottom: "auto",
				right: "auto"
			});

			if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
				_util.css(_pin, {
					boxSizing: "border-box",
					mozBoxSizing: "border-box",
					webkitBoxSizing: "border-box"
				});
			}

			// add listener to document to update pin position in case controller is not the document.
			window.addEventListener('scroll', updatePinInContainer);
			window.addEventListener('resize', updatePinInContainer);
			window.addEventListener('resize', updateRelativePinSpacer);
			// add mousewheel listener to catch scrolls over fixed elements
			_pin.addEventListener("mousewheel", onMousewheelOverPin);
			_pin.addEventListener("DOMMouseScroll", onMousewheelOverPin);

			log(3, "added pin");

			// finally update the pin to init
			updatePinState();

			return Scene;
		};

		/**
		 * Remove the pin from the scene.
		 * @method ScrollMagic.Scene#removePin
		 * @example
		 * // remove the pin from the scene without resetting it (the spacer is not removed)
		 * scene.removePin();
		 *
		 * // remove the pin from the scene and reset the pin element to its initial position (spacer is removed)
		 * scene.removePin(true);
		 *
		 * @param {boolean} [reset=false] - If `false` the spacer will not be removed and the element's position will not be reset.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removePin = function (reset) {
			if (_pin) {
				if (_state === SCENE_STATE_DURING) {
					updatePinState(true); // force unpin at position
				}
				if (reset || !_controller) { // if there's no controller no progress was made anyway...
					var pinTarget = _pinOptions.spacer.firstChild; // usually the pin element, but may be another spacer (cascaded pins)...
					if (pinTarget.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // copy margins to child spacer
						var
						style = _pinOptions.spacer.style,
							values = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
						margins = {};
						values.forEach(function (val) {
							margins[val] = style[val] || "";
						});
						_util.css(pinTarget, margins);
					}
					_pinOptions.spacer.parentNode.insertBefore(pinTarget, _pinOptions.spacer);
					_pinOptions.spacer.parentNode.removeChild(_pinOptions.spacer);
					if (!_pin.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // if it's the last pin for this element -> restore inline styles
						// TODO: only correctly set for first pin (when cascading) - how to fix?
						_util.css(_pin, _pin.___origStyle);
						delete _pin.___origStyle;
					}
				}
				window.removeEventListener('scroll', updatePinInContainer);
				window.removeEventListener('resize', updatePinInContainer);
				window.removeEventListener('resize', updateRelativePinSpacer);
				_pin.removeEventListener("mousewheel", onMousewheelOverPin);
				_pin.removeEventListener("DOMMouseScroll", onMousewheelOverPin);
				_pin = undefined;
				log(3, "removed pin (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};


		var
		_cssClasses, _cssClassElems = [];

		Scene.on("destroy.internal", function (e) {
			Scene.removeClassToggle(e.reset);
		});
		/**
		 * Define a css class modification while the scene is active.  
		 * When the scene triggers the classes will be added to the supplied element and removed, when the scene is over.
		 * If the scene duration is 0 the classes will only be removed if the user scrolls back past the start position.
		 * @method ScrollMagic.Scene#setClassToggle
		 * @example
		 * // add the class 'myclass' to the element with the id 'my-elem' for the duration of the scene
		 * scene.setClassToggle("#my-elem", "myclass");
		 *
		 * // add multiple classes to multiple elements defined by the selector '.classChange'
		 * scene.setClassToggle(".classChange", "class1 class2 class3");
		 *
		 * @param {(string|object)} element - A Selector targeting one or more elements or a DOM object that is supposed to be modified.
		 * @param {string} classes - One or more Classnames (separated by space) that should be added to the element during the scene.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setClassToggle = function (element, classes) {
			var elems = _util.get.elements(element);
			if (elems.length === 0 || !_util.type.String(classes)) {
				log(1, "ERROR calling method 'setClassToggle()': Invalid " + (elems.length === 0 ? "element" : "classes") + " supplied.");
				return Scene;
			}
			if (_cssClassElems.length > 0) {
				// remove old ones
				Scene.removeClassToggle();
			}
			_cssClasses = classes;
			_cssClassElems = elems;
			Scene.on("enter.internal_class leave.internal_class", function (e) {
				var toggle = e.type === "enter" ? _util.addClass : _util.removeClass;
				_cssClassElems.forEach(function (elem, key) {
					toggle(elem, _cssClasses);
				});
			});
			return Scene;
		};

		/**
		 * Remove the class binding from the scene.
		 * @method ScrollMagic.Scene#removeClassToggle
		 * @example
		 * // remove class binding from the scene without reset
		 * scene.removeClassToggle();
		 *
		 * // remove class binding and remove the changes it caused
		 * scene.removeClassToggle(true);
		 *
		 * @param {boolean} [reset=false] - If `false` and the classes are currently active, they will remain on the element. If `true` they will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removeClassToggle = function (reset) {
			if (reset) {
				_cssClassElems.forEach(function (elem, key) {
					_util.removeClass(elem, _cssClasses);
				});
			}
			Scene.off("start.internal_class end.internal_class");
			_cssClasses = undefined;
			_cssClassElems = [];
			return Scene;
		};

		// INIT
		construct();
		return Scene;
	};

	// store pagewide scene options
	var SCENE_OPTIONS = {
		defaults: {
			duration: 0,
			offset: 0,
			triggerElement: undefined,
			triggerHook: 0.5,
			reverse: true,
			loglevel: 2
		},
		validate: {
			offset: function (val) {
				val = parseFloat(val);
				if (!_util.type.Number(val)) {
					throw ["Invalid value for option \"offset\":", val];
				}
				return val;
			},
			triggerElement: function (val) {
				val = val || undefined;
				if (val) {
					var elem = _util.get.elements(val)[0];
					if (elem) {
						val = elem;
					} else {
						throw ["Element defined in option \"triggerElement\" was not found:", val];
					}
				}
				return val;
			},
			triggerHook: function (val) {
				var translate = {
					"onCenter": 0.5,
					"onEnter": 1,
					"onLeave": 0
				};
				if (_util.type.Number(val)) {
					val = Math.max(0, Math.min(parseFloat(val), 1)); //  make sure its betweeen 0 and 1
				} else if (val in translate) {
					val = translate[val];
				} else {
					throw ["Invalid value for option \"triggerHook\": ", val];
				}
				return val;
			},
			reverse: function (val) {
				return !!val; // force boolean
			},
			loglevel: function (val) {
				val = parseInt(val);
				if (!_util.type.Number(val) || val < 0 || val > 3) {
					throw ["Invalid value for option \"loglevel\":", val];
				}
				return val;
			}
		},
		// holder for  validation methods. duration validation is handled in 'getters-setters.js'
		shifts: ["duration", "offset", "triggerHook"],
		// list of options that trigger a `shift` event
	};
/*
 * method used to add an option to ScrollMagic Scenes.
 * TODO: DOC (private for dev)
 */
	ScrollMagic.Scene.addOption = function (name, defaultValue, validationCallback, shifts) {
		if (!(name in SCENE_OPTIONS.defaults)) {
			SCENE_OPTIONS.defaults[name] = defaultValue;
			SCENE_OPTIONS.validate[name] = validationCallback;
			if (shifts) {
				SCENE_OPTIONS.shifts.push(name);
			}
		} else {
			ScrollMagic._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + name + "', because it already exists.");
		}
	};
	// instance extension function for plugins
	// TODO: DOC (private for dev)
	ScrollMagic.Scene.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Scene = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Scene, oldClass); // copy properties
		ScrollMagic.Scene.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Scene.prototype.constructor = ScrollMagic.Scene; // restore constructor
	};


	/**
	 * TODO: DOCS (private for dev)
	 * @class
	 * @private
	 */

	ScrollMagic.Event = function (type, namespace, target, vars) {
		vars = vars || {};
		for (var key in vars) {
			this[key] = vars[key];
		}
		this.type = type;
		this.target = this.currentTarget = target;
		this.namespace = namespace || '';
		this.timeStamp = this.timestamp = Date.now();
		return this;
	};

/*
 * TODO: DOCS (private for dev)
 */

	var _util = ScrollMagic._util = (function (window) {
		var U = {},
			i;

		/**
		 * ------------------------------
		 * internal helpers
		 * ------------------------------
		 */

		// parse float and fall back to 0.
		var floatval = function (number) {
			return parseFloat(number) || 0;
		};
		// get current style IE safe (otherwise IE would return calculated values for 'auto')
		var _getComputedStyle = function (elem) {
			return elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem);
		};

		// get element dimension (width or height)
		var _dimension = function (which, elem, outer, includeMargin) {
			elem = (elem === document) ? window : elem;
			if (elem === window) {
				includeMargin = false;
			} else if (!_type.DomElement(elem)) {
				return 0;
			}
			which = which.charAt(0).toUpperCase() + which.substr(1).toLowerCase();
			var dimension = (outer ? elem['offset' + which] || elem['outer' + which] : elem['client' + which] || elem['inner' + which]) || 0;
			if (outer && includeMargin) {
				var style = _getComputedStyle(elem);
				dimension += which === 'Height' ? floatval(style.marginTop) + floatval(style.marginBottom) : floatval(style.marginLeft) + floatval(style.marginRight);
			}
			return dimension;
		};
		// converts 'margin-top' into 'marginTop'
		var _camelCase = function (str) {
			return str.replace(/^[^a-z]+([a-z])/g, '$1').replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		};

		/**
		 * ------------------------------
		 * external helpers
		 * ------------------------------
		 */

		// extend obj – same as jQuery.extend({}, objA, objB)
		U.extend = function (obj) {
			obj = obj || {};
			for (i = 1; i < arguments.length; i++) {
				if (!arguments[i]) {
					continue;
				}
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						obj[key] = arguments[i][key];
					}
				}
			}
			return obj;
		};

		// check if a css display type results in margin-collapse or not
		U.isMarginCollapseType = function (str) {
			return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(str) > -1;
		};

		// implementation of requestAnimationFrame
		// based on https://gist.github.com/paulirish/1579671
		var
		lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];
		var _requestAnimationFrame = window.requestAnimationFrame;
		var _cancelAnimationFrame = window.cancelAnimationFrame;
		// try vendor prefixes if the above doesn't work
		for (i = 0; !_requestAnimationFrame && i < vendors.length; ++i) {
			_requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			_cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
		}

		// fallbacks
		if (!_requestAnimationFrame) {
			_requestAnimationFrame = function (callback) {
				var
				currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!_cancelAnimationFrame) {
			_cancelAnimationFrame = function (id) {
				window.clearTimeout(id);
			};
		}
		U.rAF = _requestAnimationFrame.bind(window);
		U.cAF = _cancelAnimationFrame.bind(window);

		var
		loglevels = ["error", "warn", "log"],
			console = window.console || {};

		console.log = console.log ||
		function () {}; // no console log, well - do nothing then...
		// make sure methods for all levels exist.
		for (i = 0; i < loglevels.length; i++) {
			var method = loglevels[i];
			if (!console[method]) {
				console[method] = console.log; // prefer .log over nothing
			}
		}
		U.log = function (loglevel) {
			if (loglevel > loglevels.length || loglevel <= 0) loglevel = loglevels.length;
			var now = new Date(),
				time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2) + ":" + ("00" + now.getMilliseconds()).slice(-3),
				method = loglevels[loglevel - 1],
				args = Array.prototype.splice.call(arguments, 1),
				func = Function.prototype.bind.call(console[method], console);
			args.unshift(time);
			func.apply(console, args);
		};

		/**
		 * ------------------------------
		 * type testing
		 * ------------------------------
		 */

		var _type = U.type = function (v) {
			return Object.prototype.toString.call(v).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
		_type.String = function (v) {
			return _type(v) === 'string';
		};
		_type.Function = function (v) {
			return _type(v) === 'function';
		};
		_type.Array = function (v) {
			return Array.isArray(v);
		};
		_type.Number = function (v) {
			return !_type.Array(v) && (v - parseFloat(v) + 1) >= 0;
		};
		_type.DomElement = function (o) {
			return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string");
		};

		/**
		 * ------------------------------
		 * DOM Element info
		 * ------------------------------
		 */
		// always returns a list of matching DOM elements, from a selector, a DOM element or an list of elements or even an array of selectors
		var _get = U.get = {};
		_get.elements = function (selector) {
			var arr = [];
			if (_type.String(selector)) {
				try {
					selector = document.querySelectorAll(selector);
				} catch (e) { // invalid selector
					return arr;
				}
			}
			if (_type(selector) === 'nodelist' || _type.Array(selector)) {
				for (var i = 0, ref = arr.length = selector.length; i < ref; i++) { // list of elements
					var elem = selector[i];
					arr[i] = _type.DomElement(elem) ? elem : _get.elements(elem); // if not an element, try to resolve recursively
				}
			} else if (_type.DomElement(selector) || selector === document || selector === window) {
				arr = [selector]; // only the element
			}
			return arr;
		};
		// get scroll top value
		_get.scrollTop = function (elem) {
			return (elem && typeof elem.scrollTop === 'number') ? elem.scrollTop : window.pageYOffset || 0;
		};
		// get scroll left value
		_get.scrollLeft = function (elem) {
			return (elem && typeof elem.scrollLeft === 'number') ? elem.scrollLeft : window.pageXOffset || 0;
		};
		// get element height
		_get.width = function (elem, outer, includeMargin) {
			return _dimension('width', elem, outer, includeMargin);
		};
		// get element width
		_get.height = function (elem, outer, includeMargin) {
			return _dimension('height', elem, outer, includeMargin);
		};

		// get element position (optionally relative to viewport)
		_get.offset = function (elem, relativeToViewport) {
			var offset = {
				top: 0,
				left: 0
			};
			if (elem && elem.getBoundingClientRect) { // check if available
				var rect = elem.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
				if (!relativeToViewport) { // clientRect is by default relative to viewport...
					offset.top += _get.scrollTop();
					offset.left += _get.scrollLeft();
				}
			}
			return offset;
		};

		/**
		 * ------------------------------
		 * DOM Element manipulation
		 * ------------------------------
		 */

		U.addClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) elem.classList.add(classname);
				else elem.className += ' ' + classname;
			}
		};
		U.removeClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) elem.classList.remove(classname);
				else elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		};
		// if options is string -> returns css value
		// if options is array -> returns object with css value pairs
		// if options is object -> set new css values
		U.css = function (elem, options) {
			if (_type.String(options)) {
				return _getComputedStyle(elem)[_camelCase(options)];
			} else if (_type.Array(options)) {
				var
				obj = {},
					style = _getComputedStyle(elem);
				options.forEach(function (option, key) {
					obj[option] = style[_camelCase(option)];
				});
				return obj;
			} else {
				for (var option in options) {
					var val = options[option];
					if (val == parseFloat(val)) { // assume pixel for seemingly numerical values
						val += 'px';
					}
					elem.style[_camelCase(option)] = val;
				}
			}
		};

		return U;
	}(window || {}));

	ScrollMagic.Scene.prototype.addIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}

	return ScrollMagic;
}));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcm9sbE1hZ2ljLmpzIiwidnVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InZlbmRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBTY3JvbGxNYWdpYyB2Mi4wLjUgKDIwMTUtMDQtMjkpXHJcbiAqIFRoZSBqYXZhc2NyaXB0IGxpYnJhcnkgZm9yIG1hZ2ljYWwgc2Nyb2xsIGludGVyYWN0aW9ucy5cclxuICogKGMpIDIwMTUgSmFuIFBhZXBrZSAoQGphbnBhZXBrZSlcclxuICogUHJvamVjdCBXZWJzaXRlOiBodHRwOi8vc2Nyb2xsbWFnaWMuaW9cclxuICogXHJcbiAqIEB2ZXJzaW9uIDIuMC41XHJcbiAqIEBsaWNlbnNlIER1YWwgbGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2UgYW5kIEdQTC5cclxuICogQGF1dGhvciBKYW4gUGFlcGtlIC0gZS1tYWlsQGphbnBhZXBrZS5kZVxyXG4gKlxyXG4gKiBAZmlsZSBTY3JvbGxNYWdpYyBtYWluIGxpYnJhcnkuXHJcbiAqL1xyXG4vKipcclxuICogQG5hbWVzcGFjZSBTY3JvbGxNYWdpY1xyXG4gKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHQvLyBDb21tb25KU1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIEJyb3dzZXIgZ2xvYmFsXHJcblx0XHRyb290LlNjcm9sbE1hZ2ljID0gZmFjdG9yeSgpO1xyXG5cdH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdHZhciBTY3JvbGxNYWdpYyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdF91dGlsLmxvZygyLCAnKENPTVBBVElCSUxJVFkgTk9USUNFKSAtPiBBcyBvZiBTY3JvbGxNYWdpYyAyLjAuMCB5b3UgbmVlZCB0byB1c2UgXFwnbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoKVxcJyB0byBjcmVhdGUgYSBuZXcgY29udHJvbGxlciBpbnN0YW5jZS4gVXNlIFxcJ25ldyBTY3JvbGxNYWdpYy5TY2VuZSgpXFwnIHRvIGluc3RhbmNlIGEgc2NlbmUuJyk7XHJcblx0fTtcclxuXHJcblx0U2Nyb2xsTWFnaWMudmVyc2lvbiA9IFwiMi4wLjVcIjtcclxuXHJcblx0Ly8gVE9ETzogdGVtcG9yYXJ5IHdvcmthcm91bmQgZm9yIGNocm9tZSdzIHNjcm9sbCBqaXR0ZXIgYnVnXHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXdoZWVsXCIsIGZ1bmN0aW9uICgpIHt9KTtcclxuXHJcblx0Ly8gZ2xvYmFsIGNvbnN0XHJcblx0dmFyIFBJTl9TUEFDRVJfQVRUUklCVVRFID0gXCJkYXRhLXNjcm9sbG1hZ2ljLXBpbi1zcGFjZXJcIjtcclxuXHJcblx0LyoqXHJcblx0ICogVGhlIG1haW4gY2xhc3MgdGhhdCBpcyBuZWVkZWQgb25jZSBwZXIgc2Nyb2xsIGNvbnRhaW5lci5cclxuXHQgKlxyXG5cdCAqIEBjbGFzc1xyXG5cdCAqXHJcblx0ICogQGV4YW1wbGVcclxuXHQgKiAvLyBiYXNpYyBpbml0aWFsaXphdGlvblxyXG5cdCAqIHZhciBjb250cm9sbGVyID0gbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoKTtcclxuXHQgKlxyXG5cdCAqIC8vIHBhc3Npbmcgb3B0aW9uc1xyXG5cdCAqIHZhciBjb250cm9sbGVyID0gbmV3IFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIoe2NvbnRhaW5lcjogXCIjbXlDb250YWluZXJcIiwgbG9nbGV2ZWw6IDN9KTtcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgY29udGFpbmluZyBvbmUgb3IgbW9yZSBvcHRpb25zIGZvciB0aGUgY29udHJvbGxlci5cclxuXHQgKiBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KX0gW29wdGlvbnMuY29udGFpbmVyPXdpbmRvd10gLSBBIHNlbGVjdG9yLCBET00gb2JqZWN0IHRoYXQgcmVmZXJlbmNlcyB0aGUgbWFpbiBjb250YWluZXIgZm9yIHNjcm9sbGluZy5cclxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnZlcnRpY2FsPXRydWVdIC0gU2V0cyB0aGUgc2Nyb2xsIG1vZGUgdG8gdmVydGljYWwgKGB0cnVlYCkgb3IgaG9yaXpvbnRhbCAoYGZhbHNlYCkgc2Nyb2xsaW5nLlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5nbG9iYWxTY2VuZU9wdGlvbnM9e31dIC0gVGhlc2Ugb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byBldmVyeSBTY2VuZSB0aGF0IGlzIGFkZGVkIHRvIHRoZSBjb250cm9sbGVyIHVzaW5nIHRoZSBhZGRTY2VuZSBtZXRob2QuIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIFNjZW5lIG9wdGlvbnMgc2VlIHtAbGluayBTY3JvbGxNYWdpYy5TY2VuZX0uXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmxvZ2xldmVsPTJdIExvZ2xldmVsIGZvciBkZWJ1Z2dpbmcuIE5vdGUgdGhhdCBsb2dnaW5nIGlzIGRpc2FibGVkIGluIHRoZSBtaW5pZmllZCB2ZXJzaW9uIG9mIFNjcm9sbE1hZ2ljLlxyXG5cdCAqKiBgMGAgPT4gc2lsZW50XHJcblx0ICoqIGAxYCA9PiBlcnJvcnNcclxuXHQgKiogYDJgID0+IGVycm9ycywgd2FybmluZ3NcclxuXHQgKiogYDNgID0+IGVycm9ycywgd2FybmluZ3MsIGRlYnVnaW5mb1xyXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucmVmcmVzaEludGVydmFsPTEwMF0gLSBTb21lIGNoYW5nZXMgZG9uJ3QgY2FsbCBldmVudHMgYnkgZGVmYXVsdCwgbGlrZSBjaGFuZ2luZyB0aGUgY29udGFpbmVyIHNpemUgb3IgbW92aW5nIGEgc2NlbmUgdHJpZ2dlciBlbGVtZW50LiAgXHJcblx0IFRoaXMgaW50ZXJ2YWwgcG9sbHMgdGhlc2UgcGFyYW1ldGVycyB0byBmaXJlIHRoZSBuZWNlc3NhcnkgZXZlbnRzLiAgXHJcblx0IElmIHlvdSBkb24ndCB1c2UgY3VzdG9tIGNvbnRhaW5lcnMsIHRyaWdnZXIgZWxlbWVudHMgb3IgaGF2ZSBzdGF0aWMgbGF5b3V0cywgd2hlcmUgdGhlIHBvc2l0aW9ucyBvZiB0aGUgdHJpZ2dlciBlbGVtZW50cyBkb24ndCBjaGFuZ2UsIHlvdSBjYW4gc2V0IHRoaXMgdG8gMCBkaXNhYmxlIGludGVydmFsIGNoZWNraW5nIGFuZCBpbXByb3ZlIHBlcmZvcm1hbmNlLlxyXG5cdCAqXHJcblx0ICovXHJcblx0U2Nyb2xsTWFnaWMuQ29udHJvbGxlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbi8qXHJcblx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCAqIHNldHRpbmdzXHJcblx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCAqL1xyXG5cdFx0dmFyXHJcblx0XHROQU1FU1BBQ0UgPSAnU2Nyb2xsTWFnaWMuQ29udHJvbGxlcicsXHJcblx0XHRcdFNDUk9MTF9ESVJFQ1RJT05fRk9SV0FSRCA9ICdGT1JXQVJEJyxcclxuXHRcdFx0U0NST0xMX0RJUkVDVElPTl9SRVZFUlNFID0gJ1JFVkVSU0UnLFxyXG5cdFx0XHRTQ1JPTExfRElSRUNUSU9OX1BBVVNFRCA9ICdQQVVTRUQnLFxyXG5cdFx0XHRERUZBVUxUX09QVElPTlMgPSBDT05UUk9MTEVSX09QVElPTlMuZGVmYXVsdHM7XHJcblxyXG4vKlxyXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQgKiBwcml2YXRlIHZhcnNcclxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0ICovXHJcblx0XHR2YXJcclxuXHRcdENvbnRyb2xsZXIgPSB0aGlzLFxyXG5cdFx0XHRfb3B0aW9ucyA9IF91dGlsLmV4dGVuZCh7fSwgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKSxcclxuXHRcdFx0X3NjZW5lT2JqZWN0cyA9IFtdLFxyXG5cdFx0XHRfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgPSBmYWxzZSxcclxuXHRcdFx0Ly8gY2FuIGJlIGJvb2xlYW4gKHRydWUgPT4gYWxsIHNjZW5lcykgb3IgYW4gYXJyYXkgb2Ygc2NlbmVzIHRvIGJlIHVwZGF0ZWRcclxuXHRcdFx0X3Njcm9sbFBvcyA9IDAsXHJcblx0XHRcdF9zY3JvbGxEaXJlY3Rpb24gPSBTQ1JPTExfRElSRUNUSU9OX1BBVVNFRCxcclxuXHRcdFx0X2lzRG9jdW1lbnQgPSB0cnVlLFxyXG5cdFx0XHRfdmlld1BvcnRTaXplID0gMCxcclxuXHRcdFx0X2VuYWJsZWQgPSB0cnVlLFxyXG5cdFx0XHRfdXBkYXRlVGltZW91dCwgX3JlZnJlc2hUaW1lb3V0O1xyXG5cclxuLypcclxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0ICogcHJpdmF0ZSBmdW5jdGlvbnNcclxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbnRlcm5hbCBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvZiB0aGUgU2Nyb2xsTWFnaWMgQ29udHJvbGxlclxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIGNvbnN0cnVjdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIF9vcHRpb25zKSB7XHJcblx0XHRcdFx0aWYgKCFERUZBVUxUX09QVElPTlMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0bG9nKDIsIFwiV0FSTklORzogVW5rbm93biBvcHRpb24gXFxcIlwiICsga2V5ICsgXCJcXFwiXCIpO1xyXG5cdFx0XHRcdFx0ZGVsZXRlIF9vcHRpb25zW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdF9vcHRpb25zLmNvbnRhaW5lciA9IF91dGlsLmdldC5lbGVtZW50cyhfb3B0aW9ucy5jb250YWluZXIpWzBdO1xyXG5cdFx0XHQvLyBjaGVjayBTY3JvbGxDb250YWluZXJcclxuXHRcdFx0aWYgKCFfb3B0aW9ucy5jb250YWluZXIpIHtcclxuXHRcdFx0XHRsb2coMSwgXCJFUlJPUiBjcmVhdGluZyBvYmplY3QgXCIgKyBOQU1FU1BBQ0UgKyBcIjogTm8gdmFsaWQgc2Nyb2xsIGNvbnRhaW5lciBzdXBwbGllZFwiKTtcclxuXHRcdFx0XHR0aHJvdyBOQU1FU1BBQ0UgKyBcIiBpbml0IGZhaWxlZC5cIjsgLy8gY2FuY2VsXHJcblx0XHRcdH1cclxuXHRcdFx0X2lzRG9jdW1lbnQgPSBfb3B0aW9ucy5jb250YWluZXIgPT09IHdpbmRvdyB8fCBfb3B0aW9ucy5jb250YWluZXIgPT09IGRvY3VtZW50LmJvZHkgfHwgIWRvY3VtZW50LmJvZHkuY29udGFpbnMoX29wdGlvbnMuY29udGFpbmVyKTtcclxuXHRcdFx0Ly8gbm9ybWFsaXplIHRvIHdpbmRvd1xyXG5cdFx0XHRpZiAoX2lzRG9jdW1lbnQpIHtcclxuXHRcdFx0XHRfb3B0aW9ucy5jb250YWluZXIgPSB3aW5kb3c7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gdXBkYXRlIGNvbnRhaW5lciBzaXplIGltbWVkaWF0ZWx5XHJcblx0XHRcdF92aWV3UG9ydFNpemUgPSBnZXRWaWV3cG9ydFNpemUoKTtcclxuXHRcdFx0Ly8gc2V0IGV2ZW50IGhhbmRsZXJzXHJcblx0XHRcdF9vcHRpb25zLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uQ2hhbmdlKTtcclxuXHRcdFx0X29wdGlvbnMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25DaGFuZ2UpO1xyXG5cclxuXHRcdFx0X29wdGlvbnMucmVmcmVzaEludGVydmFsID0gcGFyc2VJbnQoX29wdGlvbnMucmVmcmVzaEludGVydmFsKSB8fCBERUZBVUxUX09QVElPTlMucmVmcmVzaEludGVydmFsO1xyXG5cdFx0XHRzY2hlZHVsZVJlZnJlc2goKTtcclxuXHJcblx0XHRcdGxvZygzLCBcImFkZGVkIG5ldyBcIiArIE5BTUVTUEFDRSArIFwiIGNvbnRyb2xsZXIgKHZcIiArIFNjcm9sbE1hZ2ljLnZlcnNpb24gKyBcIilcIik7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NoZWR1bGUgdGhlIG5leHQgZXhlY3V0aW9uIG9mIHRoZSByZWZyZXNoIGZ1bmN0aW9uXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHR2YXIgc2NoZWR1bGVSZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoX29wdGlvbnMucmVmcmVzaEludGVydmFsID4gMCkge1xyXG5cdFx0XHRcdF9yZWZyZXNoVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHJlZnJlc2gsIF9vcHRpb25zLnJlZnJlc2hJbnRlcnZhbCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWZhdWx0IGZ1bmN0aW9uIHRvIGdldCBzY3JvbGwgcG9zIC0gb3ZlcndyaXRlYWJsZSB1c2luZyBgQ29udHJvbGxlci5zY3JvbGxQb3MobmV3RnVuY3Rpb24pYFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIGdldFNjcm9sbFBvcyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIF9vcHRpb25zLnZlcnRpY2FsID8gX3V0aWwuZ2V0LnNjcm9sbFRvcChfb3B0aW9ucy5jb250YWluZXIpIDogX3V0aWwuZ2V0LnNjcm9sbExlZnQoX29wdGlvbnMuY29udGFpbmVyKTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHZpZXdwb3J0IFNpemUgKHdpZHRoIHZvciBob3Jpem9udGFsLCBoZWlnaHQgZm9yIHZlcnRpY2FsKVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIGdldFZpZXdwb3J0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIF9vcHRpb25zLnZlcnRpY2FsID8gX3V0aWwuZ2V0LmhlaWdodChfb3B0aW9ucy5jb250YWluZXIpIDogX3V0aWwuZ2V0LndpZHRoKF9vcHRpb25zLmNvbnRhaW5lcik7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmYXVsdCBmdW5jdGlvbiB0byBzZXQgc2Nyb2xsIHBvcyAtIG92ZXJ3cml0ZWFibGUgdXNpbmcgYENvbnRyb2xsZXIuc2Nyb2xsVG8obmV3RnVuY3Rpb24pYFxyXG5cdFx0ICogTWFrZSBhdmFpbGFibGUgcHVibGljbHkgZm9yIHBpbm5lZCBtb3VzZXdoZWVsIHdvcmthcm91bmQuXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHR2YXIgc2V0U2Nyb2xsUG9zID0gdGhpcy5fc2V0U2Nyb2xsUG9zID0gZnVuY3Rpb24gKHBvcykge1xyXG5cdFx0XHRpZiAoX29wdGlvbnMudmVydGljYWwpIHtcclxuXHRcdFx0XHRpZiAoX2lzRG9jdW1lbnQpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyhfdXRpbC5nZXQuc2Nyb2xsTGVmdCgpLCBwb3MpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5jb250YWluZXIuc2Nyb2xsVG9wID0gcG9zO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoX2lzRG9jdW1lbnQpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyhwb3MsIF91dGlsLmdldC5zY3JvbGxUb3AoKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdF9vcHRpb25zLmNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gcG9zO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEhhbmRsZSB1cGRhdGVzIGluIGN5Y2xlcyBpbnN0ZWFkIG9mIG9uIHNjcm9sbCAocGVyZm9ybWFuY2UpXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHR2YXIgdXBkYXRlU2NlbmVzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoX2VuYWJsZWQgJiYgX3VwZGF0ZVNjZW5lc09uTmV4dEN5Y2xlKSB7XHJcblx0XHRcdFx0Ly8gZGV0ZXJtaW5lIHNjZW5lcyB0byB1cGRhdGVcclxuXHRcdFx0XHR2YXIgc2NlbmVzVG9VcGRhdGUgPSBfdXRpbC50eXBlLkFycmF5KF91cGRhdGVTY2VuZXNPbk5leHRDeWNsZSkgPyBfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgOiBfc2NlbmVPYmplY3RzLnNsaWNlKDApO1xyXG5cdFx0XHRcdC8vIHJlc2V0IHNjZW5lc1xyXG5cdFx0XHRcdF91cGRhdGVTY2VuZXNPbk5leHRDeWNsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHZhciBvbGRTY3JvbGxQb3MgPSBfc2Nyb2xsUG9zO1xyXG5cdFx0XHRcdC8vIHVwZGF0ZSBzY3JvbGwgcG9zIG5vdyBpbnN0ZWFkIG9mIG9uQ2hhbmdlLCBhcyBpdCBtaWdodCBoYXZlIGNoYW5nZWQgc2luY2Ugc2NoZWR1bGluZyAoaS5lLiBpbi1icm93c2VyIHNtb290aCBzY3JvbGwpXHJcblx0XHRcdFx0X3Njcm9sbFBvcyA9IENvbnRyb2xsZXIuc2Nyb2xsUG9zKCk7XHJcblx0XHRcdFx0dmFyIGRlbHRhU2Nyb2xsID0gX3Njcm9sbFBvcyAtIG9sZFNjcm9sbFBvcztcclxuXHRcdFx0XHRpZiAoZGVsdGFTY3JvbGwgIT09IDApIHsgLy8gc2Nyb2xsIHBvc2l0aW9uIGNoYW5nZWQ/XHJcblx0XHRcdFx0XHRfc2Nyb2xsRGlyZWN0aW9uID0gKGRlbHRhU2Nyb2xsID4gMCkgPyBTQ1JPTExfRElSRUNUSU9OX0ZPUldBUkQgOiBTQ1JPTExfRElSRUNUSU9OX1JFVkVSU0U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIHJldmVyc2Ugb3JkZXIgb2Ygc2NlbmVzIGlmIHNjcm9sbGluZyByZXZlcnNlXHJcblx0XHRcdFx0aWYgKF9zY3JvbGxEaXJlY3Rpb24gPT09IFNDUk9MTF9ESVJFQ1RJT05fUkVWRVJTRSkge1xyXG5cdFx0XHRcdFx0c2NlbmVzVG9VcGRhdGUucmV2ZXJzZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyB1cGRhdGUgc2NlbmVzXHJcblx0XHRcdFx0c2NlbmVzVG9VcGRhdGUuZm9yRWFjaChmdW5jdGlvbiAoc2NlbmUsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRsb2coMywgXCJ1cGRhdGluZyBTY2VuZSBcIiArIChpbmRleCArIDEpICsgXCIvXCIgKyBzY2VuZXNUb1VwZGF0ZS5sZW5ndGggKyBcIiAoXCIgKyBfc2NlbmVPYmplY3RzLmxlbmd0aCArIFwiIHRvdGFsKVwiKTtcclxuXHRcdFx0XHRcdHNjZW5lLnVwZGF0ZSh0cnVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZiAoc2NlbmVzVG9VcGRhdGUubGVuZ3RoID09PSAwICYmIF9vcHRpb25zLmxvZ2xldmVsID49IDMpIHtcclxuXHRcdFx0XHRcdGxvZygzLCBcInVwZGF0aW5nIDAgU2NlbmVzIChub3RoaW5nIGFkZGVkIHRvIGNvbnRyb2xsZXIpXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluaXRpYWxpemVzIHJBRiBjYWxsYmFja1xyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIGRlYm91bmNlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRfdXBkYXRlVGltZW91dCA9IF91dGlsLnJBRih1cGRhdGVTY2VuZXMpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEhhbmRsZXMgQ29udGFpbmVyIGNoYW5nZXNcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciBvbkNoYW5nZSA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGxvZygzLCBcImV2ZW50IGZpcmVkIGNhdXNpbmcgYW4gdXBkYXRlOlwiLCBlLnR5cGUpO1xyXG5cdFx0XHRpZiAoZS50eXBlID09IFwicmVzaXplXCIpIHtcclxuXHRcdFx0XHQvLyByZXNpemVcclxuXHRcdFx0XHRfdmlld1BvcnRTaXplID0gZ2V0Vmlld3BvcnRTaXplKCk7XHJcblx0XHRcdFx0X3Njcm9sbERpcmVjdGlvbiA9IFNDUk9MTF9ESVJFQ1RJT05fUEFVU0VEO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHNjaGVkdWxlIHVwZGF0ZVxyXG5cdFx0XHRpZiAoX3VwZGF0ZVNjZW5lc09uTmV4dEN5Y2xlICE9PSB0cnVlKSB7XHJcblx0XHRcdFx0X3VwZGF0ZVNjZW5lc09uTmV4dEN5Y2xlID0gdHJ1ZTtcclxuXHRcdFx0XHRkZWJvdW5jZVVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoIV9pc0RvY3VtZW50KSB7XHJcblx0XHRcdFx0Ly8gc2ltdWxhdGUgcmVzaXplIGV2ZW50LiBPbmx5IHdvcmtzIGZvciB2aWV3cG9ydCByZWxldmFudCBwYXJhbSAocGVyZm9ybWFuY2UpXHJcblx0XHRcdFx0aWYgKF92aWV3UG9ydFNpemUgIT0gZ2V0Vmlld3BvcnRTaXplKCkpIHtcclxuXHRcdFx0XHRcdHZhciByZXNpemVFdmVudDtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHJlc2l6ZUV2ZW50ID0gbmV3IEV2ZW50KCdyZXNpemUnLCB7XHJcblx0XHRcdFx0XHRcdFx0YnViYmxlczogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0Y2FuY2VsYWJsZTogZmFsc2VcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7IC8vIHN0dXBpZCBJRVxyXG5cdFx0XHRcdFx0XHRyZXNpemVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XHJcblx0XHRcdFx0XHRcdHJlc2l6ZUV2ZW50LmluaXRFdmVudChcInJlc2l6ZVwiLCBmYWxzZSwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0X29wdGlvbnMuY29udGFpbmVyLmRpc3BhdGNoRXZlbnQocmVzaXplRXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRfc2NlbmVPYmplY3RzLmZvckVhY2goZnVuY3Rpb24gKHNjZW5lLCBpbmRleCkgeyAvLyByZWZyZXNoIGFsbCBzY2VuZXNcclxuXHRcdFx0XHRzY2VuZS5yZWZyZXNoKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzY2hlZHVsZVJlZnJlc2goKTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZW5kIGEgZGVidWcgbWVzc2FnZSB0byB0aGUgY29uc29sZS5cclxuXHRcdCAqIHByb3ZpZGVkIHB1YmxpY2x5IHdpdGggX2xvZyBmb3IgcGx1Z2luc1xyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gbG9nbGV2ZWwgLSBUaGUgbG9nbGV2ZWwgcmVxdWlyZWQgdG8gaW5pdGlhdGUgb3V0cHV0IGZvciB0aGUgbWVzc2FnZS5cclxuXHRcdCAqIEBwYXJhbSB7Li4ubWl4ZWR9IG91dHB1dCAtIE9uZSBvciBtb3JlIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIGNvbnNvbGUuXHJcblx0XHQgKi9cclxuXHRcdHZhciBsb2cgPSB0aGlzLl9sb2cgPSBmdW5jdGlvbiAobG9nbGV2ZWwsIG91dHB1dCkge1xyXG5cdFx0XHRpZiAoX29wdGlvbnMubG9nbGV2ZWwgPj0gbG9nbGV2ZWwpIHtcclxuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAwLCBcIihcIiArIE5BTUVTUEFDRSArIFwiKSAtPlwiKTtcclxuXHRcdFx0XHRfdXRpbC5sb2cuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0Ly8gZm9yIHNjZW5lcyB3ZSBoYXZlIGdldHRlcnMgZm9yIGVhY2ggb3B0aW9uLCBidXQgZm9yIHRoZSBjb250cm9sbGVyIHdlIGRvbid0LCBzbyB3ZSBuZWVkIHRvIG1ha2UgaXQgYXZhaWxhYmxlIGV4dGVybmFsbHkgZm9yIHBsdWdpbnNcclxuXHRcdHRoaXMuX29wdGlvbnMgPSBfb3B0aW9ucztcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNvcnQgc2NlbmVzIGluIGFzY2VuZGluZyBvcmRlciBvZiB0aGVpciBzdGFydCBvZmZzZXQuXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7YXJyYXl9IFNjZW5lc0FycmF5IC0gYW4gYXJyYXkgb2YgU2Nyb2xsTWFnaWMgU2NlbmVzIHRoYXQgc2hvdWxkIGJlIHNvcnRlZFxyXG5cdFx0ICogQHJldHVybiB7YXJyYXl9IFRoZSBzb3J0ZWQgYXJyYXkgb2YgU2NlbmVzLlxyXG5cdFx0ICovXHJcblx0XHR2YXIgc29ydFNjZW5lcyA9IGZ1bmN0aW9uIChTY2VuZXNBcnJheSkge1xyXG5cdFx0XHRpZiAoU2NlbmVzQXJyYXkubGVuZ3RoIDw9IDEpIHtcclxuXHRcdFx0XHRyZXR1cm4gU2NlbmVzQXJyYXk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHNjZW5lcyA9IFNjZW5lc0FycmF5LnNsaWNlKDApO1xyXG5cdFx0XHRcdHNjZW5lcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYS5zY3JvbGxPZmZzZXQoKSA+IGIuc2Nyb2xsT2Zmc2V0KCkgPyAxIDogLTE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHNjZW5lcztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdCAqIHB1YmxpYyBmdW5jdGlvbnNcclxuXHRcdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWRkIG9uZSBvcmUgbW9yZSBzY2VuZShzKSB0byB0aGUgY29udHJvbGxlci4gIFxyXG5cdFx0ICogVGhpcyBpcyB0aGUgZXF1aXZhbGVudCB0byBgU2NlbmUuYWRkVG8oY29udHJvbGxlcilgLlxyXG5cdFx0ICogQHB1YmxpY1xyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIHdpdGggYSBwcmV2aW91c2x5IGRlZmluZWQgc2NlbmVcclxuXHRcdCAqIGNvbnRyb2xsZXIuYWRkU2NlbmUoc2NlbmUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHdpdGggYSBuZXdseSBjcmVhdGVkIHNjZW5lLlxyXG5cdFx0ICogY29udHJvbGxlci5hZGRTY2VuZShuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe2R1cmF0aW9uIDogMH0pKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyBhZGRpbmcgbXVsdGlwbGUgc2NlbmVzXHJcblx0XHQgKiBjb250cm9sbGVyLmFkZFNjZW5lKFtzY2VuZSwgc2NlbmUyLCBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe2R1cmF0aW9uIDogMH0pXSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHsoU2Nyb2xsTWFnaWMuU2NlbmV8YXJyYXkpfSBuZXdTY2VuZSAtIFNjcm9sbE1hZ2ljIFNjZW5lIG9yIEFycmF5IG9mIFNjZW5lcyB0byBiZSBhZGRlZCB0byB0aGUgY29udHJvbGxlci5cclxuXHRcdCAqIEByZXR1cm4ge0NvbnRyb2xsZXJ9IFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLmFkZFNjZW5lID0gZnVuY3Rpb24gKG5ld1NjZW5lKSB7XHJcblx0XHRcdGlmIChfdXRpbC50eXBlLkFycmF5KG5ld1NjZW5lKSkge1xyXG5cdFx0XHRcdG5ld1NjZW5lLmZvckVhY2goZnVuY3Rpb24gKHNjZW5lLCBpbmRleCkge1xyXG5cdFx0XHRcdFx0Q29udHJvbGxlci5hZGRTY2VuZShzY2VuZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSBpZiAobmV3U2NlbmUgaW5zdGFuY2VvZiBTY3JvbGxNYWdpYy5TY2VuZSkge1xyXG5cdFx0XHRcdGlmIChuZXdTY2VuZS5jb250cm9sbGVyKCkgIT09IENvbnRyb2xsZXIpIHtcclxuXHRcdFx0XHRcdG5ld1NjZW5lLmFkZFRvKENvbnRyb2xsZXIpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoX3NjZW5lT2JqZWN0cy5pbmRleE9mKG5ld1NjZW5lKSA8IDApIHtcclxuXHRcdFx0XHRcdC8vIG5ldyBzY2VuZVxyXG5cdFx0XHRcdFx0X3NjZW5lT2JqZWN0cy5wdXNoKG5ld1NjZW5lKTsgLy8gYWRkIHRvIGFycmF5XHJcblx0XHRcdFx0XHRfc2NlbmVPYmplY3RzID0gc29ydFNjZW5lcyhfc2NlbmVPYmplY3RzKTsgLy8gc29ydFxyXG5cdFx0XHRcdFx0bmV3U2NlbmUub24oXCJzaGlmdC5jb250cm9sbGVyX3NvcnRcIiwgZnVuY3Rpb24gKCkgeyAvLyByZXNvcnQgd2hlbmV2ZXIgc2NlbmUgbW92ZXNcclxuXHRcdFx0XHRcdFx0X3NjZW5lT2JqZWN0cyA9IHNvcnRTY2VuZXMoX3NjZW5lT2JqZWN0cyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdC8vIGluc2VydCBHbG9iYWwgZGVmYXVsdHMuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gX29wdGlvbnMuZ2xvYmFsU2NlbmVPcHRpb25zKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuZXdTY2VuZVtrZXldKSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3U2NlbmVba2V5XS5jYWxsKG5ld1NjZW5lLCBfb3B0aW9ucy5nbG9iYWxTY2VuZU9wdGlvbnNba2V5XSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxvZygzLCBcImFkZGluZyBTY2VuZSAobm93IFwiICsgX3NjZW5lT2JqZWN0cy5sZW5ndGggKyBcIiB0b3RhbClcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SOiBpbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIGZvciAnLmFkZFNjZW5lKCknXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBDb250cm9sbGVyO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlbW92ZSBvbmUgb3JlIG1vcmUgc2NlbmUocykgZnJvbSB0aGUgY29udHJvbGxlci4gIFxyXG5cdFx0ICogVGhpcyBpcyB0aGUgZXF1aXZhbGVudCB0byBgU2NlbmUucmVtb3ZlKClgLlxyXG5cdFx0ICogQHB1YmxpY1xyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIHJlbW92ZSBhIHNjZW5lIGZyb20gdGhlIGNvbnRyb2xsZXJcclxuXHRcdCAqIGNvbnRyb2xsZXIucmVtb3ZlU2NlbmUoc2NlbmUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHJlbW92ZSBtdWx0aXBsZSBzY2VuZXMgZnJvbSB0aGUgY29udHJvbGxlclxyXG5cdFx0ICogY29udHJvbGxlci5yZW1vdmVTY2VuZShbc2NlbmUsIHNjZW5lMiwgc2NlbmUzXSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHsoU2Nyb2xsTWFnaWMuU2NlbmV8YXJyYXkpfSBTY2VuZSAtIFNjcm9sbE1hZ2ljIFNjZW5lIG9yIEFycmF5IG9mIFNjZW5lcyB0byBiZSByZW1vdmVkIGZyb20gdGhlIGNvbnRyb2xsZXIuXHJcblx0XHQgKiBAcmV0dXJucyB7Q29udHJvbGxlcn0gUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMucmVtb3ZlU2NlbmUgPSBmdW5jdGlvbiAoU2NlbmUpIHtcclxuXHRcdFx0aWYgKF91dGlsLnR5cGUuQXJyYXkoU2NlbmUpKSB7XHJcblx0XHRcdFx0U2NlbmUuZm9yRWFjaChmdW5jdGlvbiAoc2NlbmUsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRDb250cm9sbGVyLnJlbW92ZVNjZW5lKHNjZW5lKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgaW5kZXggPSBfc2NlbmVPYmplY3RzLmluZGV4T2YoU2NlbmUpO1xyXG5cdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0XHRTY2VuZS5vZmYoXCJzaGlmdC5jb250cm9sbGVyX3NvcnRcIik7XHJcblx0XHRcdFx0XHRfc2NlbmVPYmplY3RzLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0XHRsb2coMywgXCJyZW1vdmluZyBTY2VuZSAobm93IFwiICsgX3NjZW5lT2JqZWN0cy5sZW5ndGggKyBcIiBsZWZ0KVwiKTtcclxuXHRcdFx0XHRcdFNjZW5lLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gQ29udHJvbGxlcjtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBVcGRhdGUgb25lIG9yZSBtb3JlIHNjZW5lKHMpIGFjY29yZGluZyB0byB0aGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBjb250YWluZXIuICBcclxuXHRcdCAqIFRoaXMgaXMgdGhlIGVxdWl2YWxlbnQgdG8gYFNjZW5lLnVwZGF0ZSgpYC4gIFxyXG5cdFx0ICogVGhlIHVwZGF0ZSBtZXRob2QgY2FsY3VsYXRlcyB0aGUgc2NlbmUncyBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgdHJpZ2dlciBlbGVtZW50LCB0cmlnZ2VyIGhvb2ssIGR1cmF0aW9uIGFuZCBvZmZzZXQpIGFuZCBjaGVja3MgaXQgYWdhaW5zdCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIGNvbnRhaW5lci4gIFxyXG5cdFx0ICogSXQgdGhlbiB1cGRhdGVzIHRoZSBjdXJyZW50IHNjZW5lIHN0YXRlIGFjY29yZGluZ2x5IChvciBkb2VzIG5vdGhpbmcsIGlmIHRoZSBzdGF0ZSBpcyBhbHJlYWR5IGNvcnJlY3QpIOKAkyBQaW5zIHdpbGwgYmUgc2V0IHRvIHRoZWlyIGNvcnJlY3QgcG9zaXRpb24gYW5kIHR3ZWVucyB3aWxsIGJlIHVwZGF0ZWQgdG8gdGhlaXIgY29ycmVjdCBwcm9ncmVzcy4gIFxyXG5cdFx0ICogXyoqTm90ZToqKiBUaGlzIG1ldGhvZCBnZXRzIGNhbGxlZCBjb25zdGFudGx5IHdoZW5ldmVyIENvbnRyb2xsZXIgZGV0ZWN0cyBhIGNoYW5nZS4gVGhlIG9ubHkgYXBwbGljYXRpb24gZm9yIHlvdSBpcyBpZiB5b3UgY2hhbmdlIHNvbWV0aGluZyBvdXRzaWRlIG9mIHRoZSByZWFsbSBvZiBTY3JvbGxNYWdpYywgbGlrZSBtb3ZpbmcgdGhlIHRyaWdnZXIgb3IgY2hhbmdpbmcgdHdlZW4gcGFyYW1ldGVycy5fXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gdXBkYXRlIGEgc3BlY2lmaWMgc2NlbmUgb24gbmV4dCBjeWNsZVxyXG5cdFx0ICogY29udHJvbGxlci51cGRhdGVTY2VuZShzY2VuZSk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gdXBkYXRlIGEgc3BlY2lmaWMgc2NlbmUgaW1tZWRpYXRlbHlcclxuXHRcdCAqIGNvbnRyb2xsZXIudXBkYXRlU2NlbmUoc2NlbmUsIHRydWUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHVwZGF0ZSBtdWx0aXBsZSBzY2VuZXMgc2NlbmUgb24gbmV4dCBjeWNsZVxyXG5cdFx0ICogY29udHJvbGxlci51cGRhdGVTY2VuZShbc2NlbmUxLCBzY2VuZTIsIHNjZW5lM10pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7U2Nyb2xsTWFnaWMuU2NlbmV9IFNjZW5lIC0gU2Nyb2xsTWFnaWMgU2NlbmUgb3IgQXJyYXkgb2YgU2NlbmVzIHRoYXQgaXMvYXJlIHN1cHBvc2VkIHRvIGJlIHVwZGF0ZWQuXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbW1lZGlhdGVseT1mYWxzZV0gLSBJZiBgdHJ1ZWAgdGhlIHVwZGF0ZSB3aWxsIGJlIGluc3RhbnQsIGlmIGBmYWxzZWAgaXQgd2lsbCB3YWl0IHVudGlsIG5leHQgdXBkYXRlIGN5Y2xlLiAgXHJcblx0XHQgVGhpcyBpcyB1c2VmdWwgd2hlbiBjaGFuZ2luZyBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzY2VuZSAtIHRoaXMgd2F5IGl0IHdpbGwgb25seSBiZSB1cGRhdGVkIG9uY2UgYWxsIG5ldyBwcm9wZXJ0aWVzIGFyZSBzZXQgKHVwZGF0ZVNjZW5lcykuXHJcblx0XHQgKiBAcmV0dXJuIHtDb250cm9sbGVyfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy51cGRhdGVTY2VuZSA9IGZ1bmN0aW9uIChTY2VuZSwgaW1tZWRpYXRlbHkpIHtcclxuXHRcdFx0aWYgKF91dGlsLnR5cGUuQXJyYXkoU2NlbmUpKSB7XHJcblx0XHRcdFx0U2NlbmUuZm9yRWFjaChmdW5jdGlvbiAoc2NlbmUsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRDb250cm9sbGVyLnVwZGF0ZVNjZW5lKHNjZW5lLCBpbW1lZGlhdGVseSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKGltbWVkaWF0ZWx5KSB7XHJcblx0XHRcdFx0XHRTY2VuZS51cGRhdGUodHJ1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgIT09IHRydWUgJiYgU2NlbmUgaW5zdGFuY2VvZiBTY3JvbGxNYWdpYy5TY2VuZSkgeyAvLyBpZiBfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgaXMgdHJ1ZSwgYWxsIGNvbm5lY3RlZCBzY2VuZXMgYXJlIGFscmVhZHkgc2NoZWR1bGVkIGZvciB1cGRhdGVcclxuXHRcdFx0XHRcdC8vIHByZXAgYXJyYXkgZm9yIG5leHQgdXBkYXRlIGN5Y2xlXHJcblx0XHRcdFx0XHRfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgPSBfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgfHwgW107XHJcblx0XHRcdFx0XHRpZiAoX3VwZGF0ZVNjZW5lc09uTmV4dEN5Y2xlLmluZGV4T2YoU2NlbmUpID09IC0xKSB7XHJcblx0XHRcdFx0XHRcdF91cGRhdGVTY2VuZXNPbk5leHRDeWNsZS5wdXNoKFNjZW5lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdF91cGRhdGVTY2VuZXNPbk5leHRDeWNsZSA9IHNvcnRTY2VuZXMoX3VwZGF0ZVNjZW5lc09uTmV4dEN5Y2xlKTsgLy8gc29ydFxyXG5cdFx0XHRcdFx0ZGVib3VuY2VVcGRhdGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIENvbnRyb2xsZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyB0aGUgY29udHJvbGxlciBwYXJhbXMgYW5kIGNhbGxzIHVwZGF0ZVNjZW5lIG9uIGV2ZXJ5IHNjZW5lLCB0aGF0IGlzIGF0dGFjaGVkIHRvIHRoZSBjb250cm9sbGVyLiAgXHJcblx0XHQgKiBTZWUgYENvbnRyb2xsZXIudXBkYXRlU2NlbmUoKWAgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCB0aGlzIG1lYW5zLiAgXHJcblx0XHQgKiBJbiBtb3N0IGNhc2VzIHlvdSB3aWxsIG5vdCBuZWVkIHRoaXMgZnVuY3Rpb24sIGFzIGl0IGlzIGNhbGxlZCBjb25zdGFudGx5LCB3aGVuZXZlciBTY3JvbGxNYWdpYyBkZXRlY3RzIGEgc3RhdGUgY2hhbmdlIGV2ZW50LCBsaWtlIHJlc2l6ZSBvciBzY3JvbGwuICBcclxuXHRcdCAqIFRoZSBvbmx5IGFwcGxpY2F0aW9uIGZvciB0aGlzIG1ldGhvZCBpcyB3aGVuIFNjcm9sbE1hZ2ljIGZhaWxzIHRvIGRldGVjdCB0aGVzZSBldmVudHMuICBcclxuXHRcdCAqIE9uZSBhcHBsaWNhdGlvbiBpcyB3aXRoIHNvbWUgZXh0ZXJuYWwgc2Nyb2xsIGxpYnJhcmllcyAobGlrZSBpU2Nyb2xsKSB0aGF0IG1vdmUgYW4gaW50ZXJuYWwgY29udGFpbmVyIHRvIGEgbmVnYXRpdmUgb2Zmc2V0IGluc3RlYWQgb2YgYWN0dWFsbHkgc2Nyb2xsaW5nLiBJbiB0aGlzIGNhc2UgdGhlIHVwZGF0ZSBvbiB0aGUgY29udHJvbGxlciBuZWVkcyB0byBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIGNoaWxkIGNvbnRhaW5lcidzIHBvc2l0aW9uIGNoYW5nZXMuXHJcblx0XHQgKiBGb3IgdGhpcyBjYXNlIHRoZXJlIHdpbGwgYWxzbyBiZSB0aGUgbmVlZCB0byBwcm92aWRlIGEgY3VzdG9tIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSB0aGUgY29ycmVjdCBzY3JvbGwgcG9zaXRpb24uIFNlZSBgQ29udHJvbGxlci5zY3JvbGxQb3MoKWAgZm9yIGRldGFpbHMuXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gdXBkYXRlIHRoZSBjb250cm9sbGVyIG9uIG5leHQgY3ljbGUgKHNhdmVzIHBlcmZvcm1hbmNlIGR1ZSB0byBlbGltaW5hdGlvbiBvZiByZWR1bmRhbnQgdXBkYXRlcylcclxuXHRcdCAqIGNvbnRyb2xsZXIudXBkYXRlKCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gdXBkYXRlIHRoZSBjb250cm9sbGVyIGltbWVkaWF0ZWx5XHJcblx0XHQgKiBjb250cm9sbGVyLnVwZGF0ZSh0cnVlKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbW1lZGlhdGVseT1mYWxzZV0gLSBJZiBgdHJ1ZWAgdGhlIHVwZGF0ZSB3aWxsIGJlIGluc3RhbnQsIGlmIGBmYWxzZWAgaXQgd2lsbCB3YWl0IHVudGlsIG5leHQgdXBkYXRlIGN5Y2xlIChiZXR0ZXIgcGVyZm9ybWFuY2UpXHJcblx0XHQgKiBAcmV0dXJuIHtDb250cm9sbGVyfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoaW1tZWRpYXRlbHkpIHtcclxuXHRcdFx0b25DaGFuZ2Uoe1xyXG5cdFx0XHRcdHR5cGU6IFwicmVzaXplXCJcclxuXHRcdFx0fSk7IC8vIHdpbGwgdXBkYXRlIHNpemUgYW5kIHNldCBfdXBkYXRlU2NlbmVzT25OZXh0Q3ljbGUgdG8gdHJ1ZVxyXG5cdFx0XHRpZiAoaW1tZWRpYXRlbHkpIHtcclxuXHRcdFx0XHR1cGRhdGVTY2VuZXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gQ29udHJvbGxlcjtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTY3JvbGwgdG8gYSBudW1lcmljIHNjcm9sbCBvZmZzZXQsIGEgRE9NIGVsZW1lbnQsIHRoZSBzdGFydCBvZiBhIHNjZW5lIG9yIHByb3ZpZGUgYW4gYWx0ZXJuYXRlIG1ldGhvZCBmb3Igc2Nyb2xsaW5nLiAgXHJcblx0XHQgKiBGb3IgdmVydGljYWwgY29udHJvbGxlcnMgaXQgd2lsbCBjaGFuZ2UgdGhlIHRvcCBzY3JvbGwgb2Zmc2V0IGFuZCBmb3IgaG9yaXpvbnRhbCBhcHBsaWNhdGlvbnMgaXQgd2lsbCBjaGFuZ2UgdGhlIGxlZnQgb2Zmc2V0LlxyXG5cdFx0ICogQHB1YmxpY1xyXG5cdFx0ICpcclxuXHRcdCAqIEBzaW5jZSAxLjEuMFxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIHNjcm9sbCB0byBhbiBvZmZzZXQgb2YgMTAwXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKDEwMCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gc2Nyb2xsIHRvIGEgRE9NIGVsZW1lbnRcclxuXHRcdCAqIGNvbnRyb2xsZXIuc2Nyb2xsVG8oXCIjYW5jaG9yXCIpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNjcm9sbCB0byB0aGUgYmVnaW5uaW5nIG9mIGEgc2NlbmVcclxuXHRcdCAqIHZhciBzY2VuZSA9IG5ldyBTY3JvbGxNYWdpYy5TY2VuZSh7b2Zmc2V0OiAyMDB9KTtcclxuXHRcdCAqIGNvbnRyb2xsZXIuc2Nyb2xsVG8oc2NlbmUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIGRlZmluZSBhIG5ldyBzY3JvbGwgcG9zaXRpb24gbW9kaWZpY2F0aW9uIGZ1bmN0aW9uIChqUXVlcnkgYW5pbWF0ZSBpbnN0ZWFkIG9mIGp1bXApXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKGZ1bmN0aW9uIChuZXdTY3JvbGxQb3MpIHtcclxuXHRcdCAqXHQkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtzY3JvbGxUb3A6IG5ld1Njcm9sbFBvc30pO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKDEwMCk7IC8vIGNhbGwgYXMgdXN1YWwsIGJ1dCB0aGUgbmV3IGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBpbnN0ZWFkXHJcblx0XHQgKlxyXG5cdFx0ICogLy8gZGVmaW5lIGEgbmV3IHNjcm9sbCBmdW5jdGlvbiB3aXRoIGFuIGFkZGl0aW9uYWwgcGFyYW1ldGVyXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKGZ1bmN0aW9uIChuZXdTY3JvbGxQb3MsIG1lc3NhZ2UpIHtcclxuXHRcdCAqICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHRcdCAqXHQkKHRoaXMpLmFuaW1hdGUoe3Njcm9sbFRvcDogbmV3U2Nyb2xsUG9zfSk7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqIC8vIGNhbGwgYXMgdXN1YWwsIGJ1dCBzdXBwbHkgYW4gZXh0cmEgcGFyYW1ldGVyIHRvIHRoZSBkZWZpbmVkIGN1c3RvbSBmdW5jdGlvblxyXG5cdFx0ICogY29udHJvbGxlci5zY3JvbGxUbygxMDAsIFwibXkgbWVzc2FnZVwiKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyBkZWZpbmUgYSBuZXcgc2Nyb2xsIGZ1bmN0aW9uIHdpdGggYW4gYWRkaXRpb25hbCBwYXJhbWV0ZXIgY29udGFpbmluZyBtdWx0aXBsZSB2YXJpYWJsZXNcclxuXHRcdCAqIGNvbnRyb2xsZXIuc2Nyb2xsVG8oZnVuY3Rpb24gKG5ld1Njcm9sbFBvcywgb3B0aW9ucykge1xyXG5cdFx0ICogIHNvbWVHbG9iYWxWYXIgPSBvcHRpb25zLmEgKyBvcHRpb25zLmI7XHJcblx0XHQgKlx0JCh0aGlzKS5hbmltYXRlKHtzY3JvbGxUb3A6IG5ld1Njcm9sbFBvc30pO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKiAvLyBjYWxsIGFzIHVzdWFsLCBidXQgc3VwcGx5IGFuIGV4dHJhIHBhcmFtZXRlciBjb250YWluaW5nIG11bHRpcGxlIG9wdGlvbnNcclxuXHRcdCAqIGNvbnRyb2xsZXIuc2Nyb2xsVG8oMTAwLCB7YTogMSwgYjogMn0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIGRlZmluZSBhIG5ldyBzY3JvbGwgZnVuY3Rpb24gd2l0aCBhIGNhbGxiYWNrIHN1cHBsaWVkIGFzIGFuIGFkZGl0aW9uYWwgcGFyYW1ldGVyXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKGZ1bmN0aW9uIChuZXdTY3JvbGxQb3MsIGNhbGxiYWNrKSB7XHJcblx0XHQgKlx0JCh0aGlzKS5hbmltYXRlKHtzY3JvbGxUb3A6IG5ld1Njcm9sbFBvc30sIDQwMCwgXCJzd2luZ1wiLCBjYWxsYmFjayk7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqIC8vIGNhbGwgYXMgdXN1YWwsIGJ1dCBzdXBwbHkgYW4gZXh0cmEgcGFyYW1ldGVyLCB3aGljaCBpcyB1c2VkIGFzIGEgY2FsbGJhY2sgaW4gdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBjdXN0b20gc2Nyb2xsIGZ1bmN0aW9uXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFRvKDEwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHQgKlx0Y29uc29sZS5sb2coXCJzY3JvbGwgaGFzIGZpbmlzaGVkLlwiKTtcclxuXHRcdCAqIH0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IHNjcm9sbFRhcmdldCAtIFRoZSBzdXBwbGllZCBhcmd1bWVudCBjYW4gYmUgb25lIG9mIHRoZXNlIHR5cGVzOlxyXG5cdFx0ICogMS4gYG51bWJlcmAgLT4gVGhlIGNvbnRhaW5lciB3aWxsIHNjcm9sbCB0byB0aGlzIG5ldyBzY3JvbGwgb2Zmc2V0LlxyXG5cdFx0ICogMi4gYHN0cmluZ2Agb3IgYG9iamVjdGAgLT4gQ2FuIGJlIGEgc2VsZWN0b3Igb3IgYSBET00gb2JqZWN0LiAgXHJcblx0XHQgKiAgVGhlIGNvbnRhaW5lciB3aWxsIHNjcm9sbCB0byB0aGUgcG9zaXRpb24gb2YgdGhpcyBlbGVtZW50LlxyXG5cdFx0ICogMy4gYFNjcm9sbE1hZ2ljIFNjZW5lYCAtPiBUaGUgY29udGFpbmVyIHdpbGwgc2Nyb2xsIHRvIHRoZSBzdGFydCBvZiB0aGlzIHNjZW5lLlxyXG5cdFx0ICogNC4gYGZ1bmN0aW9uYCAtPiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBmb3IgZnV0dXJlIHNjcm9sbCBwb3NpdGlvbiBtb2RpZmljYXRpb25zLiAgXHJcblx0XHQgKiAgVGhpcyBwcm92aWRlcyBhIHdheSBmb3IgeW91IHRvIGNoYW5nZSB0aGUgYmVoYXZpb3VyIG9mIHNjcm9sbGluZyBhbmQgYWRkaW5nIG5ldyBiZWhhdmlvdXIgbGlrZSBhbmltYXRpb24uIFRoZSBmdW5jdGlvbiByZWNlaXZlcyB0aGUgbmV3IHNjcm9sbCBwb3NpdGlvbiBhcyBhIHBhcmFtZXRlciBhbmQgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IHVzaW5nIGB0aGlzYC4gIFxyXG5cdFx0ICogIEl0IG1heSBhbHNvIG9wdGlvbmFsbHkgcmVjZWl2ZSBhbiBvcHRpb25hbCBhZGRpdGlvbmFsIHBhcmFtZXRlciAoc2VlIGJlbG93KSAgXHJcblx0XHQgKiAgXyoqTk9URToqKiAgXHJcblx0XHQgKiAgQWxsIG90aGVyIG9wdGlvbnMgd2lsbCBzdGlsbCB3b3JrIGFzIGV4cGVjdGVkLCB1c2luZyB0aGUgbmV3IGZ1bmN0aW9uIHRvIHNjcm9sbC5fXHJcblx0XHQgKiBAcGFyYW0ge21peGVkfSBbYWRkaXRpb25hbFBhcmFtZXRlcl0gLSBJZiBhIGN1c3RvbSBzY3JvbGwgZnVuY3Rpb24gd2FzIGRlZmluZWQgKHNlZSBhYm92ZSA0LiksIHlvdSBtYXkgd2FudCB0byBzdXBwbHkgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIHRvIGl0LCB3aGVuIGNhbGxpbmcgaXQuIFlvdSBjYW4gZG8gdGhpcyB1c2luZyB0aGlzIHBhcmFtZXRlciDigJMgc2VlIGV4YW1wbGVzIGZvciBkZXRhaWxzLiBQbGVhc2Ugbm90ZSwgdGhhdCB0aGlzIHBhcmFtZXRlciB3aWxsIGhhdmUgbm8gZWZmZWN0LCBpZiB5b3UgdXNlIHRoZSBkZWZhdWx0IHNjcm9sbGluZyBmdW5jdGlvbi5cclxuXHRcdCAqIEByZXR1cm5zIHtDb250cm9sbGVyfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5zY3JvbGxUbyA9IGZ1bmN0aW9uIChzY3JvbGxUYXJnZXQsIGFkZGl0aW9uYWxQYXJhbWV0ZXIpIHtcclxuXHRcdFx0aWYgKF91dGlsLnR5cGUuTnVtYmVyKHNjcm9sbFRhcmdldCkpIHsgLy8gZXhjZWN1dGVcclxuXHRcdFx0XHRzZXRTY3JvbGxQb3MuY2FsbChfb3B0aW9ucy5jb250YWluZXIsIHNjcm9sbFRhcmdldCwgYWRkaXRpb25hbFBhcmFtZXRlcik7XHJcblx0XHRcdH0gZWxzZSBpZiAoc2Nyb2xsVGFyZ2V0IGluc3RhbmNlb2YgU2Nyb2xsTWFnaWMuU2NlbmUpIHsgLy8gc2Nyb2xsIHRvIHNjZW5lXHJcblx0XHRcdFx0aWYgKHNjcm9sbFRhcmdldC5jb250cm9sbGVyKCkgPT09IENvbnRyb2xsZXIpIHsgLy8gY2hlY2sgaWYgdGhlIGNvbnRyb2xsZXIgaXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc2NlbmVcclxuXHRcdFx0XHRcdENvbnRyb2xsZXIuc2Nyb2xsVG8oc2Nyb2xsVGFyZ2V0LnNjcm9sbE9mZnNldCgpLCBhZGRpdGlvbmFsUGFyYW1ldGVyKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bG9nKDIsIFwic2Nyb2xsVG8oKTogVGhlIHN1cHBsaWVkIHNjZW5lIGRvZXMgbm90IGJlbG9uZyB0byB0aGlzIGNvbnRyb2xsZXIuIFNjcm9sbCBjYW5jZWxsZWQuXCIsIHNjcm9sbFRhcmdldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKF91dGlsLnR5cGUuRnVuY3Rpb24oc2Nyb2xsVGFyZ2V0KSkgeyAvLyBhc3NpZ24gbmV3IHNjcm9sbCBmdW5jdGlvblxyXG5cdFx0XHRcdHNldFNjcm9sbFBvcyA9IHNjcm9sbFRhcmdldDtcclxuXHRcdFx0fSBlbHNlIHsgLy8gc2Nyb2xsIHRvIGVsZW1lbnRcclxuXHRcdFx0XHR2YXIgZWxlbSA9IF91dGlsLmdldC5lbGVtZW50cyhzY3JvbGxUYXJnZXQpWzBdO1xyXG5cdFx0XHRcdGlmIChlbGVtKSB7XHJcblx0XHRcdFx0XHQvLyBpZiBwYXJlbnQgaXMgcGluIHNwYWNlciwgdXNlIHNwYWNlciBwb3NpdGlvbiBpbnN0ZWFkIHNvIGNvcnJlY3Qgc3RhcnQgcG9zaXRpb24gaXMgcmV0dXJuZWQgZm9yIHBpbm5lZCBlbGVtZW50cy5cclxuXHRcdFx0XHRcdHdoaWxlIChlbGVtLnBhcmVudE5vZGUuaGFzQXR0cmlidXRlKFBJTl9TUEFDRVJfQVRUUklCVVRFKSkge1xyXG5cdFx0XHRcdFx0XHRlbGVtID0gZWxlbS5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0cGFyYW0gPSBfb3B0aW9ucy52ZXJ0aWNhbCA/IFwidG9wXCIgOiBcImxlZnRcIixcclxuXHRcdFx0XHRcdFx0Ly8gd2hpY2ggcGFyYW0gaXMgb2YgaW50ZXJlc3QgP1xyXG5cdFx0XHRcdFx0XHRjb250YWluZXJPZmZzZXQgPSBfdXRpbC5nZXQub2Zmc2V0KF9vcHRpb25zLmNvbnRhaW5lciksXHJcblx0XHRcdFx0XHRcdC8vIGNvbnRhaW5lciBwb3NpdGlvbiBpcyBuZWVkZWQgYmVjYXVzZSBlbGVtZW50IG9mZnNldCBpcyByZXR1cm5lZCBpbiByZWxhdGlvbiB0byBkb2N1bWVudCwgbm90IGluIHJlbGF0aW9uIHRvIGNvbnRhaW5lci5cclxuXHRcdFx0XHRcdFx0ZWxlbWVudE9mZnNldCA9IF91dGlsLmdldC5vZmZzZXQoZWxlbSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFfaXNEb2N1bWVudCkgeyAvLyBjb250YWluZXIgaXMgbm90IHRoZSBkb2N1bWVudCByb290LCBzbyBzdWJzdHJhY3Qgc2Nyb2xsIFBvc2l0aW9uIHRvIGdldCBjb3JyZWN0IHRyaWdnZXIgZWxlbWVudCBwb3NpdGlvbiByZWxhdGl2ZSB0byBzY3JvbGxjb250ZW50XHJcblx0XHRcdFx0XHRcdGNvbnRhaW5lck9mZnNldFtwYXJhbV0gLT0gQ29udHJvbGxlci5zY3JvbGxQb3MoKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRDb250cm9sbGVyLnNjcm9sbFRvKGVsZW1lbnRPZmZzZXRbcGFyYW1dIC0gY29udGFpbmVyT2Zmc2V0W3BhcmFtXSwgYWRkaXRpb25hbFBhcmFtZXRlcik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxvZygyLCBcInNjcm9sbFRvKCk6IFRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBpbnZhbGlkLiBTY3JvbGwgY2FuY2VsbGVkLlwiLCBzY3JvbGxUYXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gQ29udHJvbGxlcjtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAqKkdldCoqIHRoZSBjdXJyZW50IHNjcm9sbFBvc2l0aW9uIG9yICoqU2V0KiogYSBuZXcgbWV0aG9kIHRvIGNhbGN1bGF0ZSBpdC4gIFxyXG5cdFx0ICogLT4gKipHRVQqKjpcclxuXHRcdCAqIFdoZW4gdXNlZCBhcyBhIGdldHRlciB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbi4gIFxyXG5cdFx0ICogVG8gZ2V0IGEgY2FjaGVkIHZhbHVlIHVzZSBDb250cm9sbGVyLmluZm8oXCJzY3JvbGxQb3NcIiksIHdoaWNoIHdpbGwgYmUgdXBkYXRlZCBpbiB0aGUgdXBkYXRlIGN5Y2xlLiAgXHJcblx0XHQgKiBGb3IgdmVydGljYWwgY29udHJvbGxlcnMgaXQgd2lsbCByZXR1cm4gdGhlIHRvcCBzY3JvbGwgb2Zmc2V0IGFuZCBmb3IgaG9yaXpvbnRhbCBhcHBsaWNhdGlvbnMgaXQgd2lsbCByZXR1cm4gdGhlIGxlZnQgb2Zmc2V0LlxyXG5cdFx0ICpcclxuXHRcdCAqIC0+ICoqU0VUKio6XHJcblx0XHQgKiBXaGVuIHVzZWQgYXMgYSBzZXR0ZXIgdGhpcyBtZXRob2QgcHJvZGVzIGEgd2F5IHRvIHBlcm1hbmVudGx5IG92ZXJ3cml0ZSB0aGUgY29udHJvbGxlcidzIHNjcm9sbCBwb3NpdGlvbiBjYWxjdWxhdGlvbi4gIFxyXG5cdFx0ICogQSB0eXBpY2FsIHVzZWNhc2UgaXMgd2hlbiB0aGUgc2Nyb2xsIHBvc2l0aW9uIGlzIG5vdCByZWZsZWN0ZWQgYnkgdGhlIGNvbnRhaW5lcnMgc2Nyb2xsVG9wIG9yIHNjcm9sbExlZnQgdmFsdWVzLCBidXQgZm9yIGV4YW1wbGUgYnkgdGhlIGlubmVyIG9mZnNldCBvZiBhIGNoaWxkIGNvbnRhaW5lci4gIFxyXG5cdFx0ICogTW92aW5nIGEgY2hpbGQgY29udGFpbmVyIGluc2lkZSBhIHBhcmVudCBpcyBhIGNvbW1vbmx5IHVzZWQgbWV0aG9kIGZvciBzZXZlcmFsIHNjcm9sbGluZyBmcmFtZXdvcmtzLCBpbmNsdWRpbmcgaVNjcm9sbC4gIFxyXG5cdFx0ICogQnkgcHJvdmlkaW5nIGFuIGFsdGVybmF0ZSBjYWxjdWxhdGlvbiBmdW5jdGlvbiB5b3UgY2FuIG1ha2Ugc3VyZSBTY3JvbGxNYWdpYyByZWNlaXZlcyB0aGUgY29ycmVjdCBzY3JvbGwgcG9zaXRpb24uICBcclxuXHRcdCAqIFBsZWFzZSBhbHNvIGJlYXIgaW4gbWluZCB0aGF0IHlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB5IHZhbHVlcyBmb3IgdmVydGljYWwgc2Nyb2xscyBhbiB4IGZvciBob3Jpem9udGFscy5cclxuXHRcdCAqXHJcblx0XHQgKiBUbyBjaGFuZ2UgdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uIHBsZWFzZSB1c2UgYENvbnRyb2xsZXIuc2Nyb2xsVG8oKWAuXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCBzY3JvbGwgUG9zaXRpb25cclxuXHRcdCAqIHZhciBzY3JvbGxQb3MgPSBjb250cm9sbGVyLnNjcm9sbFBvcygpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNldCBhIG5ldyBzY3JvbGwgcG9zaXRpb24gY2FsY3VsYXRpb24gbWV0aG9kXHJcblx0XHQgKiBjb250cm9sbGVyLnNjcm9sbFBvcyhmdW5jdGlvbiAoKSB7XHJcblx0XHQgKlx0cmV0dXJuIHRoaXMuaW5mbyhcInZlcnRpY2FsXCIpID8gLW15Y2hpbGRjb250YWluZXIueSA6IC1teWNoaWxkY29udGFpbmVyLnhcclxuXHRcdCAqIH0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzY3JvbGxQb3NNZXRob2RdIC0gVGhlIGZ1bmN0aW9uIHRvIGJlIHVzZWQgZm9yIHRoZSBzY3JvbGwgcG9zaXRpb24gY2FsY3VsYXRpb24gb2YgdGhlIGNvbnRhaW5lci5cclxuXHRcdCAqIEByZXR1cm5zIHsobnVtYmVyfENvbnRyb2xsZXIpfSBDdXJyZW50IHNjcm9sbCBwb3NpdGlvbiBvciBwYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5zY3JvbGxQb3MgPSBmdW5jdGlvbiAoc2Nyb2xsUG9zTWV0aG9kKSB7XHJcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkgeyAvLyBnZXRcclxuXHRcdFx0XHRyZXR1cm4gZ2V0U2Nyb2xsUG9zLmNhbGwoQ29udHJvbGxlcik7XHJcblx0XHRcdH0gZWxzZSB7IC8vIHNldFxyXG5cdFx0XHRcdGlmIChfdXRpbC50eXBlLkZ1bmN0aW9uKHNjcm9sbFBvc01ldGhvZCkpIHtcclxuXHRcdFx0XHRcdGdldFNjcm9sbFBvcyA9IHNjcm9sbFBvc01ldGhvZDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bG9nKDIsIFwiUHJvdmlkZWQgdmFsdWUgZm9yIG1ldGhvZCAnc2Nyb2xsUG9zJyBpcyBub3QgYSBmdW5jdGlvbi4gVG8gY2hhbmdlIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiB1c2UgJ3Njcm9sbFRvKCknLlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIENvbnRyb2xsZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogKipHZXQqKiBhbGwgaW5mb3Mgb3Igb25lIGluIHBhcnRpY3VsYXIgYWJvdXQgdGhlIGNvbnRyb2xsZXIuXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gcmV0dXJucyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKG51bWJlcilcclxuXHRcdCAqIHZhciBzY3JvbGxQb3MgPSBjb250cm9sbGVyLmluZm8oXCJzY3JvbGxQb3NcIik7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gcmV0dXJucyBhbGwgaW5mb3MgYXMgYW4gb2JqZWN0XHJcblx0XHQgKiB2YXIgaW5mb3MgPSBjb250cm9sbGVyLmluZm8oKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gW2Fib3V0XSAtIElmIHBhc3NlZCBvbmx5IHRoaXMgaW5mbyB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2YgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsLiAgXHJcblx0XHQgVmFsaWQgb3B0aW9ucyBhcmU6XHJcblx0XHQgKiogYFwic2l6ZVwiYCA9PiB0aGUgY3VycmVudCB2aWV3cG9ydCBzaXplIG9mIHRoZSBjb250YWluZXJcclxuXHRcdCAqKiBgXCJ2ZXJ0aWNhbFwiYCA9PiB0cnVlIGlmIHZlcnRpY2FsIHNjcm9sbGluZywgb3RoZXJ3aXNlIGZhbHNlXHJcblx0XHQgKiogYFwic2Nyb2xsUG9zXCJgID0+IHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxyXG5cdFx0ICoqIGBcInNjcm9sbERpcmVjdGlvblwiYCA9PiB0aGUgbGFzdCBrbm93biBkaXJlY3Rpb24gb2YgdGhlIHNjcm9sbFxyXG5cdFx0ICoqIGBcImNvbnRhaW5lclwiYCA9PiB0aGUgY29udGFpbmVyIGVsZW1lbnRcclxuXHRcdCAqKiBgXCJpc0RvY3VtZW50XCJgID0+IHRydWUgaWYgY29udGFpbmVyIGVsZW1lbnQgaXMgdGhlIGRvY3VtZW50LlxyXG5cdFx0ICogQHJldHVybnMgeyhtaXhlZHxvYmplY3QpfSBUaGUgcmVxdWVzdGVkIGluZm8ocykuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuaW5mbyA9IGZ1bmN0aW9uIChhYm91dCkge1xyXG5cdFx0XHR2YXIgdmFsdWVzID0ge1xyXG5cdFx0XHRcdHNpemU6IF92aWV3UG9ydFNpemUsXHJcblx0XHRcdFx0Ly8gY29udGFpbnMgaGVpZ2h0IG9yIHdpZHRoIChpbiByZWdhcmQgdG8gb3JpZW50YXRpb24pO1xyXG5cdFx0XHRcdHZlcnRpY2FsOiBfb3B0aW9ucy52ZXJ0aWNhbCxcclxuXHRcdFx0XHRzY3JvbGxQb3M6IF9zY3JvbGxQb3MsXHJcblx0XHRcdFx0c2Nyb2xsRGlyZWN0aW9uOiBfc2Nyb2xsRGlyZWN0aW9uLFxyXG5cdFx0XHRcdGNvbnRhaW5lcjogX29wdGlvbnMuY29udGFpbmVyLFxyXG5cdFx0XHRcdGlzRG9jdW1lbnQ6IF9pc0RvY3VtZW50XHJcblx0XHRcdH07XHJcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkgeyAvLyBnZXQgYWxsIGFzIGFuIG9iamVjdFxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XHJcblx0XHRcdH0gZWxzZSBpZiAodmFsdWVzW2Fib3V0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlc1thYm91dF07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9nKDEsIFwiRVJST1I6IG9wdGlvbiBcXFwiXCIgKyBhYm91dCArIFwiXFxcIiBpcyBub3QgYXZhaWxhYmxlXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgY3VycmVudCBsb2dsZXZlbCBvcHRpb24gdmFsdWUuXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCB2YWx1ZVxyXG5cdFx0ICogdmFyIGxvZ2xldmVsID0gY29udHJvbGxlci5sb2dsZXZlbCgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNldCBhIG5ldyB2YWx1ZVxyXG5cdFx0ICogY29udHJvbGxlci5sb2dsZXZlbCgzKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW25ld0xvZ2xldmVsXSAtIFRoZSBuZXcgbG9nbGV2ZWwgc2V0dGluZyBvZiB0aGUgQ29udHJvbGxlci4gYFswLTNdYFxyXG5cdFx0ICogQHJldHVybnMgeyhudW1iZXJ8Q29udHJvbGxlcil9IEN1cnJlbnQgbG9nbGV2ZWwgb3IgcGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMubG9nbGV2ZWwgPSBmdW5jdGlvbiAobmV3TG9nbGV2ZWwpIHtcclxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7IC8vIGdldFxyXG5cdFx0XHRcdHJldHVybiBfb3B0aW9ucy5sb2dsZXZlbDtcclxuXHRcdFx0fSBlbHNlIGlmIChfb3B0aW9ucy5sb2dsZXZlbCAhPSBuZXdMb2dsZXZlbCkgeyAvLyBzZXRcclxuXHRcdFx0XHRfb3B0aW9ucy5sb2dsZXZlbCA9IG5ld0xvZ2xldmVsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBDb250cm9sbGVyO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgY3VycmVudCBlbmFibGVkIHN0YXRlIG9mIHRoZSBjb250cm9sbGVyLiAgXHJcblx0XHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGRpc2FibGUgYWxsIFNjZW5lcyBjb25uZWN0ZWQgdG8gdGhlIGNvbnRyb2xsZXIgd2l0aG91dCBkZXN0cm95aW5nIG9yIHJlbW92aW5nIHRoZW0uXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCB2YWx1ZVxyXG5cdFx0ICogdmFyIGVuYWJsZWQgPSBjb250cm9sbGVyLmVuYWJsZWQoKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyBkaXNhYmxlIHRoZSBjb250cm9sbGVyXHJcblx0XHQgKiBjb250cm9sbGVyLmVuYWJsZWQoZmFsc2UpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW25ld1N0YXRlXSAtIFRoZSBuZXcgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbGxlciBgdHJ1ZWAgb3IgYGZhbHNlYC5cclxuXHRcdCAqIEByZXR1cm5zIHsoYm9vbGVhbnxDb250cm9sbGVyKX0gQ3VycmVudCBlbmFibGVkIHN0YXRlIG9yIHBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbiAobmV3U3RhdGUpIHtcclxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7IC8vIGdldFxyXG5cdFx0XHRcdHJldHVybiBfZW5hYmxlZDtcclxuXHRcdFx0fSBlbHNlIGlmIChfZW5hYmxlZCAhPSBuZXdTdGF0ZSkgeyAvLyBzZXRcclxuXHRcdFx0XHRfZW5hYmxlZCA9ICEhIG5ld1N0YXRlO1xyXG5cdFx0XHRcdENvbnRyb2xsZXIudXBkYXRlU2NlbmUoX3NjZW5lT2JqZWN0cywgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIENvbnRyb2xsZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVzdHJveSB0aGUgQ29udHJvbGxlciwgYWxsIFNjZW5lcyBhbmQgZXZlcnl0aGluZy5cclxuXHRcdCAqIEBwdWJsaWNcclxuXHRcdCAqXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gd2l0aG91dCByZXNldHRpbmcgdGhlIHNjZW5lc1xyXG5cdFx0ICogY29udHJvbGxlciA9IGNvbnRyb2xsZXIuZGVzdHJveSgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHdpdGggc2NlbmUgcmVzZXRcclxuXHRcdCAqIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyLmRlc3Ryb3kodHJ1ZSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbcmVzZXRTY2VuZXM9ZmFsc2VdIC0gSWYgYHRydWVgIHRoZSBwaW5zIGFuZCB0d2VlbnMgKGlmIGV4aXN0ZW50KSBvZiBhbGwgc2NlbmVzIHdpbGwgYmUgcmVzZXQuXHJcblx0XHQgKiBAcmV0dXJucyB7bnVsbH0gTnVsbCB0byB1bnNldCBoYW5kbGVyIHZhcmlhYmxlcy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKHJlc2V0U2NlbmVzKSB7XHJcblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQoX3JlZnJlc2hUaW1lb3V0KTtcclxuXHRcdFx0dmFyIGkgPSBfc2NlbmVPYmplY3RzLmxlbmd0aDtcclxuXHRcdFx0d2hpbGUgKGktLSkge1xyXG5cdFx0XHRcdF9zY2VuZU9iamVjdHNbaV0uZGVzdHJveShyZXNldFNjZW5lcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0X29wdGlvbnMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25DaGFuZ2UpO1xyXG5cdFx0XHRfb3B0aW9ucy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvbkNoYW5nZSk7XHJcblx0XHRcdF91dGlsLmNBRihfdXBkYXRlVGltZW91dCk7XHJcblx0XHRcdGxvZygzLCBcImRlc3Ryb3llZCBcIiArIE5BTUVTUEFDRSArIFwiIChyZXNldDogXCIgKyAocmVzZXRTY2VuZXMgPyBcInRydWVcIiA6IFwiZmFsc2VcIikgKyBcIilcIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBJTklUXHJcblx0XHRjb25zdHJ1Y3QoKTtcclxuXHRcdHJldHVybiBDb250cm9sbGVyO1xyXG5cdH07XHJcblxyXG5cdC8vIHN0b3JlIHBhZ2V3aWRlIGNvbnRyb2xsZXIgb3B0aW9uc1xyXG5cdHZhciBDT05UUk9MTEVSX09QVElPTlMgPSB7XHJcblx0XHRkZWZhdWx0czoge1xyXG5cdFx0XHRjb250YWluZXI6IHdpbmRvdyxcclxuXHRcdFx0dmVydGljYWw6IHRydWUsXHJcblx0XHRcdGdsb2JhbFNjZW5lT3B0aW9uczoge30sXHJcblx0XHRcdGxvZ2xldmVsOiAyLFxyXG5cdFx0XHRyZWZyZXNoSW50ZXJ2YWw6IDEwMFxyXG5cdFx0fVxyXG5cdH07XHJcbi8qXHJcbiAqIG1ldGhvZCB1c2VkIHRvIGFkZCBhbiBvcHRpb24gdG8gU2Nyb2xsTWFnaWMgU2NlbmVzLlxyXG4gKi9cclxuXHRTY3JvbGxNYWdpYy5Db250cm9sbGVyLmFkZE9wdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBkZWZhdWx0VmFsdWUpIHtcclxuXHRcdENPTlRST0xMRVJfT1BUSU9OUy5kZWZhdWx0c1tuYW1lXSA9IGRlZmF1bHRWYWx1ZTtcclxuXHR9O1xyXG5cdC8vIGluc3RhbmNlIGV4dGVuc2lvbiBmdW5jdGlvbiBmb3IgcGx1Z2luc1xyXG5cdFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIuZXh0ZW5kID0gZnVuY3Rpb24gKGV4dGVuc2lvbikge1xyXG5cdFx0dmFyIG9sZENsYXNzID0gdGhpcztcclxuXHRcdFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG9sZENsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHRoaXMuJHN1cGVyID0gX3V0aWwuZXh0ZW5kKHt9LCB0aGlzKTsgLy8gY29weSBwYXJlbnQgc3RhdGVcclxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcblx0XHR9O1xyXG5cdFx0X3V0aWwuZXh0ZW5kKFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIsIG9sZENsYXNzKTsgLy8gY29weSBwcm9wZXJ0aWVzXHJcblx0XHRTY3JvbGxNYWdpYy5Db250cm9sbGVyLnByb3RvdHlwZSA9IG9sZENsYXNzLnByb3RvdHlwZTsgLy8gY29weSBwcm90b3R5cGVcclxuXHRcdFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2Nyb2xsTWFnaWMuQ29udHJvbGxlcjsgLy8gcmVzdG9yZSBjb25zdHJ1Y3RvclxyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBBIFNjZW5lIGRlZmluZXMgd2hlcmUgdGhlIGNvbnRyb2xsZXIgc2hvdWxkIHJlYWN0IGFuZCBob3cuXHJcblx0ICpcclxuXHQgKiBAY2xhc3NcclxuXHQgKlxyXG5cdCAqIEBleGFtcGxlXHJcblx0ICogLy8gY3JlYXRlIGEgc3RhbmRhcmQgc2NlbmUgYW5kIGFkZCBpdCB0byBhIGNvbnRyb2xsZXJcclxuXHQgKiBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoKVxyXG5cdCAqXHRcdC5hZGRUbyhjb250cm9sbGVyKTtcclxuXHQgKlxyXG5cdCAqIC8vIGNyZWF0ZSBhIHNjZW5lIHdpdGggY3VzdG9tIG9wdGlvbnMgYW5kIGFzc2lnbiBhIGhhbmRsZXIgdG8gaXQuXHJcblx0ICogdmFyIHNjZW5lID0gbmV3IFNjcm9sbE1hZ2ljLlNjZW5lKHtcclxuXHQgKiBcdFx0ZHVyYXRpb246IDEwMCxcclxuXHQgKlx0XHRvZmZzZXQ6IDIwMCxcclxuXHQgKlx0XHR0cmlnZ2VySG9vazogXCJvbkVudGVyXCIsXHJcblx0ICpcdFx0cmV2ZXJzZTogZmFsc2VcclxuXHQgKiB9KTtcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBPcHRpb25zIGZvciB0aGUgU2NlbmUuIFRoZSBvcHRpb25zIGNhbiBiZSB1cGRhdGVkIGF0IGFueSB0aW1lLiAgXHJcblx0IEluc3RlYWQgb2Ygc2V0dGluZyB0aGUgb3B0aW9ucyBmb3IgZWFjaCBzY2VuZSBpbmRpdmlkdWFsbHkgeW91IGNhbiBhbHNvIHNldCB0aGVtIGdsb2JhbGx5IGluIHRoZSBjb250cm9sbGVyIGFzIHRoZSBjb250cm9sbGVycyBgZ2xvYmFsU2NlbmVPcHRpb25zYCBvcHRpb24uIFRoZSBvYmplY3QgYWNjZXB0cyB0aGUgc2FtZSBwcm9wZXJ0aWVzIGFzIHRoZSBvbmVzIGJlbG93LiAgXHJcblx0IFdoZW4gYSBzY2VuZSBpcyBhZGRlZCB0byB0aGUgY29udHJvbGxlciB0aGUgb3B0aW9ucyBkZWZpbmVkIHVzaW5nIHRoZSBTY2VuZSBjb25zdHJ1Y3RvciB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRob3NlIHNldCBpbiBgZ2xvYmFsU2NlbmVPcHRpb25zYC5cclxuXHQgKiBAcGFyYW0geyhudW1iZXJ8ZnVuY3Rpb24pfSBbb3B0aW9ucy5kdXJhdGlvbj0wXSAtIFRoZSBkdXJhdGlvbiBvZiB0aGUgc2NlbmUuIFxyXG5cdCBJZiBgMGAgdHdlZW5zIHdpbGwgYXV0by1wbGF5IHdoZW4gcmVhY2hpbmcgdGhlIHNjZW5lIHN0YXJ0IHBvaW50LCBwaW5zIHdpbGwgYmUgcGlubmVkIGluZGVmaW5ldGx5IHN0YXJ0aW5nIGF0IHRoZSBzdGFydCBwb3NpdGlvbi4gIFxyXG5cdCBBIGZ1bmN0aW9uIHJldHVuaW5nIHRoZSBkdXJhdGlvbiB2YWx1ZSBpcyBhbHNvIHN1cHBvcnRlZC4gUGxlYXNlIHNlZSBgU2NlbmUuZHVyYXRpb24oKWAgZm9yIGRldGFpbHMuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm9mZnNldD0wXSAtIE9mZnNldCBWYWx1ZSBmb3IgdGhlIFRyaWdnZXIgUG9zaXRpb24uIElmIG5vIHRyaWdnZXJFbGVtZW50IGlzIGRlZmluZWQgdGhpcyB3aWxsIGJlIHRoZSBzY3JvbGwgZGlzdGFuY2UgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHBhZ2UsIGFmdGVyIHdoaWNoIHRoZSBzY2VuZSB3aWxsIHN0YXJ0LlxyXG5cdCAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSBbb3B0aW9ucy50cmlnZ2VyRWxlbWVudD1udWxsXSAtIFNlbGVjdG9yIG9yIERPTSBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBzdGFydCBvZiB0aGUgc2NlbmUuIElmIHVuZGVmaW5lZCB0aGUgc2NlbmUgd2lsbCBzdGFydCByaWdodCBhdCB0aGUgc3RhcnQgb2YgdGhlIHBhZ2UgKHVubGVzcyBhbiBvZmZzZXQgaXMgc2V0KS5cclxuXHQgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gW29wdGlvbnMudHJpZ2dlckhvb2s9XCJvbkNlbnRlclwiXSAtIENhbiBiZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEgZGVmaW5pbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSB0cmlnZ2VyIEhvb2sgaW4gcmVsYXRpb24gdG8gdGhlIHZpZXdwb3J0LiAgXHJcblx0IENhbiBhbHNvIGJlIGRlZmluZWQgdXNpbmcgYSBzdHJpbmc6XHJcblx0ICoqIGBcIm9uRW50ZXJcImAgPT4gYDFgXHJcblx0ICoqIGBcIm9uQ2VudGVyXCJgID0+IGAwLjVgXHJcblx0ICoqIGBcIm9uTGVhdmVcImAgPT4gYDBgXHJcblx0ICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5yZXZlcnNlPXRydWVdIC0gU2hvdWxkIHRoZSBzY2VuZSByZXZlcnNlLCB3aGVuIHNjcm9sbGluZyB1cD9cclxuXHQgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubG9nbGV2ZWw9Ml0gLSBMb2dsZXZlbCBmb3IgZGVidWdnaW5nLiBOb3RlIHRoYXQgbG9nZ2luZyBpcyBkaXNhYmxlZCBpbiB0aGUgbWluaWZpZWQgdmVyc2lvbiBvZiBTY3JvbGxNYWdpYy5cclxuXHQgKiogYDBgID0+IHNpbGVudFxyXG5cdCAqKiBgMWAgPT4gZXJyb3JzXHJcblx0ICoqIGAyYCA9PiBlcnJvcnMsIHdhcm5pbmdzXHJcblx0ICoqIGAzYCA9PiBlcnJvcnMsIHdhcm5pbmdzLCBkZWJ1Z2luZm9cclxuXHQgKiBcclxuXHQgKi9cclxuXHRTY3JvbGxNYWdpYy5TY2VuZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4vKlxyXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQgKiBzZXR0aW5nc1xyXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQgKi9cclxuXHJcblx0XHR2YXJcclxuXHRcdE5BTUVTUEFDRSA9ICdTY3JvbGxNYWdpYy5TY2VuZScsXHJcblx0XHRcdFNDRU5FX1NUQVRFX0JFRk9SRSA9ICdCRUZPUkUnLFxyXG5cdFx0XHRTQ0VORV9TVEFURV9EVVJJTkcgPSAnRFVSSU5HJyxcclxuXHRcdFx0U0NFTkVfU1RBVEVfQUZURVIgPSAnQUZURVInLFxyXG5cdFx0XHRERUZBVUxUX09QVElPTlMgPSBTQ0VORV9PUFRJT05TLmRlZmF1bHRzO1xyXG5cclxuLypcclxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0ICogcHJpdmF0ZSB2YXJzXHJcblx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCAqL1xyXG5cclxuXHRcdHZhclxyXG5cdFx0U2NlbmUgPSB0aGlzLFxyXG5cdFx0XHRfb3B0aW9ucyA9IF91dGlsLmV4dGVuZCh7fSwgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKSxcclxuXHRcdFx0X3N0YXRlID0gU0NFTkVfU1RBVEVfQkVGT1JFLFxyXG5cdFx0XHRfcHJvZ3Jlc3MgPSAwLFxyXG5cdFx0XHRfc2Nyb2xsT2Zmc2V0ID0ge1xyXG5cdFx0XHRcdHN0YXJ0OiAwLFxyXG5cdFx0XHRcdGVuZDogMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyByZWZsZWN0cyB0aGUgY29udHJvbGxlcnMncyBzY3JvbGwgcG9zaXRpb24gZm9yIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzY2VuZSByZXNwZWN0aXZlbHlcclxuXHRcdFx0X3RyaWdnZXJQb3MgPSAwLFxyXG5cdFx0XHRfZW5hYmxlZCA9IHRydWUsXHJcblx0XHRcdF9kdXJhdGlvblVwZGF0ZU1ldGhvZCwgX2NvbnRyb2xsZXI7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbnRlcm5hbCBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvZiB0aGUgU2Nyb2xsTWFnaWMgU2NlbmVcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBfb3B0aW9ucykgeyAvLyBjaGVjayBzdXBwbGllZCBvcHRpb25zXHJcblx0XHRcdFx0aWYgKCFERUZBVUxUX09QVElPTlMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0bG9nKDIsIFwiV0FSTklORzogVW5rbm93biBvcHRpb24gXFxcIlwiICsga2V5ICsgXCJcXFwiXCIpO1xyXG5cdFx0XHRcdFx0ZGVsZXRlIF9vcHRpb25zW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGFkZCBnZXR0ZXJzL3NldHRlcnMgZm9yIGFsbCBwb3NzaWJsZSBvcHRpb25zXHJcblx0XHRcdGZvciAodmFyIG9wdGlvbk5hbWUgaW4gREVGQVVMVF9PUFRJT05TKSB7XHJcblx0XHRcdFx0YWRkU2NlbmVPcHRpb24ob3B0aW9uTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gdmFsaWRhdGUgYWxsIG9wdGlvbnNcclxuXHRcdFx0dmFsaWRhdGVPcHRpb24oKTtcclxuXHRcdH07XHJcblxyXG4vKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEV2ZW50IE1hbmFnZW1lbnRcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuXHJcblx0XHR2YXIgX2xpc3RlbmVycyA9IHt9O1xyXG5cdFx0LyoqXHJcblx0XHQgKiBTY2VuZSBzdGFydCBldmVudC4gIFxyXG5cdFx0ICogRmlyZXMgd2hlbmV2ZXIgdGhlIHNjcm9sbCBwb3NpdGlvbiBpdHMgdGhlIHN0YXJ0aW5nIHBvaW50IG9mIHRoZSBzY2VuZS4gIFxyXG5cdFx0ICogSXQgd2lsbCBhbHNvIGZpcmUgd2hlbiBzY3JvbGxpbmcgYmFjayB1cCBnb2luZyBvdmVyIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgc2NlbmUuIElmIHlvdSB3YW50IHNvbWV0aGluZyB0byBoYXBwZW4gb25seSB3aGVuIHNjcm9sbGluZyBkb3duL3JpZ2h0LCB1c2UgdGhlIHNjcm9sbERpcmVjdGlvbiBwYXJhbWV0ZXIgcGFzc2VkIHRvIHRoZSBjYWxsYmFjay5cclxuXHRcdCAqXHJcblx0XHQgKiBGb3IgZGV0YWlscyBvbiB0aGlzIGV2ZW50IGFuZCB0aGUgb3JkZXIgaW4gd2hpY2ggaXQgaXMgZmlyZWQsIHBsZWFzZSByZXZpZXcgdGhlIHtAbGluayBTY2VuZS5wcm9ncmVzc30gbWV0aG9kLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNzdGFydFxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcInN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0ICogXHRjb25zb2xlLmxvZyhcIkhpdCBzdGFydCBwb2ludCBvZiBzY2VuZS5cIik7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJvcGVydHkge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgT2JqZWN0IHBhc3NlZCB0byBlYWNoIGNhbGxiYWNrXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQudHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtTY2VuZX0gZXZlbnQudGFyZ2V0IC0gVGhlIFNjZW5lIG9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGlzIGV2ZW50XHJcblx0XHQgKiBAcHJvcGVydHkge251bWJlcn0gZXZlbnQucHJvZ3Jlc3MgLSBSZWZsZWN0cyB0aGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgc2NlbmVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC5zdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzY2VuZSBgXCJCRUZPUkVcImAgb3IgYFwiRFVSSU5HXCJgXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQuc2Nyb2xsRGlyZWN0aW9uIC0gSW5kaWNhdGVzIHdoaWNoIHdheSB3ZSBhcmUgc2Nyb2xsaW5nIGBcIlBBVVNFRFwiYCwgYFwiRk9SV0FSRFwiYCBvciBgXCJSRVZFUlNFXCJgXHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgZW5kIGV2ZW50LiAgXHJcblx0XHQgKiBGaXJlcyB3aGVuZXZlciB0aGUgc2Nyb2xsIHBvc2l0aW9uIGl0cyB0aGUgZW5kaW5nIHBvaW50IG9mIHRoZSBzY2VuZS4gIFxyXG5cdFx0ICogSXQgd2lsbCBhbHNvIGZpcmUgd2hlbiBzY3JvbGxpbmcgYmFjayB1cCBmcm9tIGFmdGVyIHRoZSBzY2VuZSBhbmQgZ29pbmcgb3ZlciBpdHMgZW5kIHBvc2l0aW9uLiBJZiB5b3Ugd2FudCBzb21ldGhpbmcgdG8gaGFwcGVuIG9ubHkgd2hlbiBzY3JvbGxpbmcgZG93bi9yaWdodCwgdXNlIHRoZSBzY3JvbGxEaXJlY3Rpb24gcGFyYW1ldGVyIHBhc3NlZCB0byB0aGUgY2FsbGJhY2suXHJcblx0XHQgKlxyXG5cdFx0ICogRm9yIGRldGFpbHMgb24gdGhpcyBldmVudCBhbmQgdGhlIG9yZGVyIGluIHdoaWNoIGl0IGlzIGZpcmVkLCBwbGVhc2UgcmV2aWV3IHRoZSB7QGxpbmsgU2NlbmUucHJvZ3Jlc3N9IG1ldGhvZC5cclxuXHRcdCAqXHJcblx0XHQgKiBAZXZlbnQgU2Nyb2xsTWFnaWMuU2NlbmUjZW5kXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIHNjZW5lLm9uKFwiZW5kXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0ICogXHRjb25zb2xlLmxvZyhcIkhpdCBlbmQgcG9pbnQgb2Ygc2NlbmUuXCIpO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IE9iamVjdCBwYXNzZWQgdG8gZWFjaCBjYWxsYmFja1xyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7U2NlbmV9IGV2ZW50LnRhcmdldCAtIFRoZSBTY2VuZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhpcyBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtudW1iZXJ9IGV2ZW50LnByb2dyZXNzIC0gUmVmbGVjdHMgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIHNjZW5lXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQuc3RhdGUgLSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgc2NlbmUgYFwiRFVSSU5HXCJgIG9yIGBcIkFGVEVSXCJgXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQuc2Nyb2xsRGlyZWN0aW9uIC0gSW5kaWNhdGVzIHdoaWNoIHdheSB3ZSBhcmUgc2Nyb2xsaW5nIGBcIlBBVVNFRFwiYCwgYFwiRk9SV0FSRFwiYCBvciBgXCJSRVZFUlNFXCJgXHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgZW50ZXIgZXZlbnQuICBcclxuXHRcdCAqIEZpcmVzIHdoZW5ldmVyIHRoZSBzY2VuZSBlbnRlcnMgdGhlIFwiRFVSSU5HXCIgc3RhdGUuICBcclxuXHRcdCAqIEtlZXAgaW4gbWluZCB0aGF0IGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHRoZSBzY2VuZSBwbGF5cyBmb3J3YXJkIG9yIGJhY2t3YXJkOiBUaGlzIGV2ZW50IGFsd2F5cyBmaXJlcyB3aGVuIHRoZSBzY2VuZSBlbnRlcnMgaXRzIGFjdGl2ZSBzY3JvbGwgdGltZWZyYW1lLCByZWdhcmRsZXNzIG9mIHRoZSBzY3JvbGwtZGlyZWN0aW9uLlxyXG5cdFx0ICpcclxuXHRcdCAqIEZvciBkZXRhaWxzIG9uIHRoaXMgZXZlbnQgYW5kIHRoZSBvcmRlciBpbiB3aGljaCBpdCBpcyBmaXJlZCwgcGxlYXNlIHJldmlldyB0aGUge0BsaW5rIFNjZW5lLnByb2dyZXNzfSBtZXRob2QuXHJcblx0XHQgKlxyXG5cdFx0ICogQGV2ZW50IFNjcm9sbE1hZ2ljLlNjZW5lI2VudGVyXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIHNjZW5lLm9uKFwiZW50ZXJcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQgKiBcdGNvbnNvbGUubG9nKFwiU2NlbmUgZW50ZXJlZC5cIik7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJvcGVydHkge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgT2JqZWN0IHBhc3NlZCB0byBlYWNoIGNhbGxiYWNrXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQudHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtTY2VuZX0gZXZlbnQudGFyZ2V0IC0gVGhlIFNjZW5lIG9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGlzIGV2ZW50XHJcblx0XHQgKiBAcHJvcGVydHkge251bWJlcn0gZXZlbnQucHJvZ3Jlc3MgLSBSZWZsZWN0cyB0aGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgc2NlbmVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC5zdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzY2VuZSAtIGFsd2F5cyBgXCJEVVJJTkdcImBcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC5zY3JvbGxEaXJlY3Rpb24gLSBJbmRpY2F0ZXMgd2hpY2ggd2F5IHdlIGFyZSBzY3JvbGxpbmcgYFwiUEFVU0VEXCJgLCBgXCJGT1JXQVJEXCJgIG9yIGBcIlJFVkVSU0VcImBcclxuXHRcdCAqL1xyXG5cdFx0LyoqXHJcblx0XHQgKiBTY2VuZSBsZWF2ZSBldmVudC4gIFxyXG5cdFx0ICogRmlyZXMgd2hlbmV2ZXIgdGhlIHNjZW5lJ3Mgc3RhdGUgZ29lcyBmcm9tIFwiRFVSSU5HXCIgdG8gZWl0aGVyIFwiQkVGT1JFXCIgb3IgXCJBRlRFUlwiLiAgXHJcblx0XHQgKiBLZWVwIGluIG1pbmQgdGhhdCBpdCBkb2Vzbid0IG1hdHRlciBpZiB0aGUgc2NlbmUgcGxheXMgZm9yd2FyZCBvciBiYWNrd2FyZDogVGhpcyBldmVudCBhbHdheXMgZmlyZXMgd2hlbiB0aGUgc2NlbmUgbGVhdmVzIGl0cyBhY3RpdmUgc2Nyb2xsIHRpbWVmcmFtZSwgcmVnYXJkbGVzcyBvZiB0aGUgc2Nyb2xsLWRpcmVjdGlvbi5cclxuXHRcdCAqXHJcblx0XHQgKiBGb3IgZGV0YWlscyBvbiB0aGlzIGV2ZW50IGFuZCB0aGUgb3JkZXIgaW4gd2hpY2ggaXQgaXMgZmlyZWQsIHBsZWFzZSByZXZpZXcgdGhlIHtAbGluayBTY2VuZS5wcm9ncmVzc30gbWV0aG9kLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNsZWF2ZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcImxlYXZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0ICogXHRjb25zb2xlLmxvZyhcIlNjZW5lIGxlZnQuXCIpO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IE9iamVjdCBwYXNzZWQgdG8gZWFjaCBjYWxsYmFja1xyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7U2NlbmV9IGV2ZW50LnRhcmdldCAtIFRoZSBTY2VuZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhpcyBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtudW1iZXJ9IGV2ZW50LnByb2dyZXNzIC0gUmVmbGVjdHMgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIHNjZW5lXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQuc3RhdGUgLSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgc2NlbmUgYFwiQkVGT1JFXCJgIG9yIGBcIkFGVEVSXCJgXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQuc2Nyb2xsRGlyZWN0aW9uIC0gSW5kaWNhdGVzIHdoaWNoIHdheSB3ZSBhcmUgc2Nyb2xsaW5nIGBcIlBBVVNFRFwiYCwgYFwiRk9SV0FSRFwiYCBvciBgXCJSRVZFUlNFXCJgXHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgdXBkYXRlIGV2ZW50LiAgXHJcblx0XHQgKiBGaXJlcyB3aGVuZXZlciB0aGUgc2NlbmUgaXMgdXBkYXRlZCAoYnV0IG5vdCBuZWNlc3NhcmlseSBjaGFuZ2VzIHRoZSBwcm9ncmVzcykuXHJcblx0XHQgKlxyXG5cdFx0ICogQGV2ZW50IFNjcm9sbE1hZ2ljLlNjZW5lI3VwZGF0ZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcInVwZGF0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdCAqIFx0Y29uc29sZS5sb2coXCJTY2VuZSB1cGRhdGVkLlwiKTtcclxuXHRcdCAqIH0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBPYmplY3QgcGFzc2VkIHRvIGVhY2ggY2FsbGJhY2tcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC50eXBlIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50XHJcblx0XHQgKiBAcHJvcGVydHkge1NjZW5lfSBldmVudC50YXJnZXQgLSBUaGUgU2NlbmUgb2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoaXMgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBldmVudC5zdGFydFBvcyAtIFRoZSBzdGFydGluZyBwb3NpdGlvbiBvZiB0aGUgc2NlbmUgKGluIHJlbGF0aW9uIHRvIHRoZSBjb25haW5lcilcclxuXHRcdCAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBldmVudC5lbmRQb3MgLSBUaGUgZW5kaW5nIHBvc2l0aW9uIG9mIHRoZSBzY2VuZSAoaW4gcmVsYXRpb24gdG8gdGhlIGNvbmFpbmVyKVxyXG5cdFx0ICogQHByb3BlcnR5IHtudW1iZXJ9IGV2ZW50LnNjcm9sbFBvcyAtIFRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgY29udGFpbmVyXHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgcHJvZ3Jlc3MgZXZlbnQuICBcclxuXHRcdCAqIEZpcmVzIHdoZW5ldmVyIHRoZSBwcm9ncmVzcyBvZiB0aGUgc2NlbmUgY2hhbmdlcy5cclxuXHRcdCAqXHJcblx0XHQgKiBGb3IgZGV0YWlscyBvbiB0aGlzIGV2ZW50IGFuZCB0aGUgb3JkZXIgaW4gd2hpY2ggaXQgaXMgZmlyZWQsIHBsZWFzZSByZXZpZXcgdGhlIHtAbGluayBTY2VuZS5wcm9ncmVzc30gbWV0aG9kLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNwcm9ncmVzc1xyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcInByb2dyZXNzXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0ICogXHRjb25zb2xlLmxvZyhcIlNjZW5lIHByb2dyZXNzIGNoYW5nZWQgdG8gXCIgKyBldmVudC5wcm9ncmVzcyk7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJvcGVydHkge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgT2JqZWN0IHBhc3NlZCB0byBlYWNoIGNhbGxiYWNrXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQudHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtTY2VuZX0gZXZlbnQudGFyZ2V0IC0gVGhlIFNjZW5lIG9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGlzIGV2ZW50XHJcblx0XHQgKiBAcHJvcGVydHkge251bWJlcn0gZXZlbnQucHJvZ3Jlc3MgLSBSZWZsZWN0cyB0aGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgc2NlbmVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC5zdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzY2VuZSBgXCJCRUZPUkVcImAsIGBcIkRVUklOR1wiYCBvciBgXCJBRlRFUlwiYFxyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnNjcm9sbERpcmVjdGlvbiAtIEluZGljYXRlcyB3aGljaCB3YXkgd2UgYXJlIHNjcm9sbGluZyBgXCJQQVVTRURcImAsIGBcIkZPUldBUkRcImAgb3IgYFwiUkVWRVJTRVwiYFxyXG5cdFx0ICovXHJcblx0XHQvKipcclxuXHRcdCAqIFNjZW5lIGNoYW5nZSBldmVudC4gIFxyXG5cdFx0ICogRmlyZXMgd2hlbnZldmVyIGEgcHJvcGVydHkgb2YgdGhlIHNjZW5lIGlzIGNoYW5nZWQuXHJcblx0XHQgKlxyXG5cdFx0ICogQGV2ZW50IFNjcm9sbE1hZ2ljLlNjZW5lI2NoYW5nZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdCAqIFx0Y29uc29sZS5sb2coXCJTY2VuZSBQcm9wZXJ0eSBcXFwiXCIgKyBldmVudC53aGF0ICsgXCJcXFwiIGNoYW5nZWQgdG8gXCIgKyBldmVudC5uZXd2YWwpO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IE9iamVjdCBwYXNzZWQgdG8gZWFjaCBjYWxsYmFja1xyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7U2NlbmV9IGV2ZW50LnRhcmdldCAtIFRoZSBTY2VuZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhpcyBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LndoYXQgLSBJbmRpY2F0ZXMgd2hhdCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkXHJcblx0XHQgKiBAcHJvcGVydHkge21peGVkfSBldmVudC5uZXd2YWwgLSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBjaGFuZ2VkIHByb3BlcnR5XHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgc2hpZnQgZXZlbnQuICBcclxuXHRcdCAqIEZpcmVzIHdoZW52ZXZlciB0aGUgc3RhcnQgb3IgZW5kICoqc2Nyb2xsIG9mZnNldCoqIG9mIHRoZSBzY2VuZSBjaGFuZ2UuXHJcblx0XHQgKiBUaGlzIGhhcHBlbnMgZXhwbGljaXRlbHksIHdoZW4gb25lIG9mIHRoZXNlIHZhbHVlcyBjaGFuZ2U6IGBvZmZzZXRgLCBgZHVyYXRpb25gIG9yIGB0cmlnZ2VySG9va2AuXHJcblx0XHQgKiBJdCB3aWxsIGZpcmUgaW1wbGljaXRseSB3aGVuIHRoZSBgdHJpZ2dlckVsZW1lbnRgIGNoYW5nZXMsIGlmIHRoZSBuZXcgZWxlbWVudCBoYXMgYSBkaWZmZXJlbnQgcG9zaXRpb24gKG1vc3QgY2FzZXMpLlxyXG5cdFx0ICogSXQgd2lsbCBhbHNvIGZpcmUgaW1wbGljaXRseSB3aGVuIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIgY2hhbmdlcyBhbmQgdGhlIHRyaWdnZXJIb29rIGlzIGFueXRoaW5nIG90aGVyIHRoYW4gYG9uTGVhdmVgLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNzaGlmdFxyXG5cdFx0ICogQHNpbmNlIDEuMS4wXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIHNjZW5lLm9uKFwic2hpZnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQgKiBcdGNvbnNvbGUubG9nKFwiU2NlbmUgbW92ZWQsIGJlY2F1c2UgdGhlIFwiICsgZXZlbnQucmVhc29uICsgXCIgaGFzIGNoYW5nZWQuKVwiKTtcclxuXHRcdCAqIH0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBPYmplY3QgcGFzc2VkIHRvIGVhY2ggY2FsbGJhY2tcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC50eXBlIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50XHJcblx0XHQgKiBAcHJvcGVydHkge1NjZW5lfSBldmVudC50YXJnZXQgLSBUaGUgU2NlbmUgb2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoaXMgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBldmVudC5yZWFzb24gLSBJbmRpY2F0ZXMgd2h5IHRoZSBzY2VuZSBoYXMgc2hpZnRlZFxyXG5cdFx0ICovXHJcblx0XHQvKipcclxuXHRcdCAqIFNjZW5lIGRlc3Ryb3kgZXZlbnQuICBcclxuXHRcdCAqIEZpcmVzIHdoZW52ZXZlciB0aGUgc2NlbmUgaXMgZGVzdHJveWVkLlxyXG5cdFx0ICogVGhpcyBjYW4gYmUgdXNlZCB0byB0aWR5IHVwIGN1c3RvbSBiZWhhdmlvdXIgdXNlZCBpbiBldmVudHMuXHJcblx0XHQgKlxyXG5cdFx0ICogQGV2ZW50IFNjcm9sbE1hZ2ljLlNjZW5lI2Rlc3Ryb3lcclxuXHRcdCAqIEBzaW5jZSAxLjEuMFxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcImVudGVyXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0ICogICAgICAgIC8vIGFkZCBjdXN0b20gYWN0aW9uXHJcblx0XHQgKiAgICAgICAgJChcIiNteS1lbGVtXCIpLmxlZnQoXCIyMDBcIik7XHJcblx0XHQgKiAgICAgIH0pXHJcblx0XHQgKiAgICAgIC5vbihcImRlc3Ryb3lcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQgKiAgICAgICAgLy8gcmVzZXQgbXkgZWxlbWVudCB0byBzdGFydCBwb3NpdGlvblxyXG5cdFx0ICogICAgICAgIGlmIChldmVudC5yZXNldCkge1xyXG5cdFx0ICogICAgICAgICAgJChcIiNteS1lbGVtXCIpLmxlZnQoXCIwXCIpO1xyXG5cdFx0ICogICAgICAgIH1cclxuXHRcdCAqICAgICAgfSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IE9iamVjdCBwYXNzZWQgdG8gZWFjaCBjYWxsYmFja1xyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7U2NlbmV9IGV2ZW50LnRhcmdldCAtIFRoZSBTY2VuZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhpcyBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtib29sZWFufSBldmVudC5yZXNldCAtIEluZGljYXRlcyBpZiB0aGUgZGVzdHJveSBtZXRob2Qgd2FzIGNhbGxlZCB3aXRoIHJlc2V0IGB0cnVlYCBvciBgZmFsc2VgLlxyXG5cdFx0ICovXHJcblx0XHQvKipcclxuXHRcdCAqIFNjZW5lIGFkZCBldmVudC4gIFxyXG5cdFx0ICogRmlyZXMgd2hlbiB0aGUgc2NlbmUgaXMgYWRkZWQgdG8gYSBjb250cm9sbGVyLlxyXG5cdFx0ICogVGhpcyBpcyBtb3N0bHkgdXNlZCBieSBwbHVnaW5zIHRvIGtub3cgdGhhdCBjaGFuZ2UgbWlnaHQgYmUgZHVlLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNhZGRcclxuXHRcdCAqIEBzaW5jZSAyLjAuMFxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcImFkZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdCAqIFx0Y29uc29sZS5sb2coJ1NjZW5lIHdhcyBhZGRlZCB0byBhIG5ldyBjb250cm9sbGVyLicpO1xyXG5cdFx0ICogfSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IE9iamVjdCBwYXNzZWQgdG8gZWFjaCBjYWxsYmFja1xyXG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50LnR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7U2NlbmV9IGV2ZW50LnRhcmdldCAtIFRoZSBTY2VuZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhpcyBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtib29sZWFufSBldmVudC5jb250cm9sbGVyIC0gVGhlIGNvbnRyb2xsZXIgb2JqZWN0IHRoZSBzY2VuZSB3YXMgYWRkZWQgdG8uXHJcblx0XHQgKi9cclxuXHRcdC8qKlxyXG5cdFx0ICogU2NlbmUgcmVtb3ZlIGV2ZW50LiAgXHJcblx0XHQgKiBGaXJlcyB3aGVuIHRoZSBzY2VuZSBpcyByZW1vdmVkIGZyb20gYSBjb250cm9sbGVyLlxyXG5cdFx0ICogVGhpcyBpcyBtb3N0bHkgdXNlZCBieSBwbHVnaW5zIHRvIGtub3cgdGhhdCBjaGFuZ2UgbWlnaHQgYmUgZHVlLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBldmVudCBTY3JvbGxNYWdpYy5TY2VuZSNyZW1vdmVcclxuXHRcdCAqIEBzaW5jZSAyLjAuMFxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiBzY2VuZS5vbihcInJlbW92ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdCAqIFx0Y29uc29sZS5sb2coJ1NjZW5lIHdhcyByZW1vdmVkIGZyb20gaXRzIGNvbnRyb2xsZXIuJyk7XHJcblx0XHQgKiB9KTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJvcGVydHkge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgT2JqZWN0IHBhc3NlZCB0byBlYWNoIGNhbGxiYWNrXHJcblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnQudHlwZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG5cdFx0ICogQHByb3BlcnR5IHtTY2VuZX0gZXZlbnQudGFyZ2V0IC0gVGhlIFNjZW5lIG9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGlzIGV2ZW50XHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFkZCBvbmUgb3JlIG1vcmUgZXZlbnQgbGlzdGVuZXIuICBcclxuXHRcdCAqIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aWxsIGJlIGZpcmVkIGF0IHRoZSByZXNwZWN0aXZlIGV2ZW50LCBhbmQgYW4gb2JqZWN0IGNvbnRhaW5pbmcgcmVsZXZhbnQgZGF0YSB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2suXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI29uXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIGZ1bmN0aW9uIGNhbGxiYWNrIChldmVudCkge1xyXG5cdFx0ICogXHRcdGNvbnNvbGUubG9nKFwiRXZlbnQgZmlyZWQhIChcIiArIGV2ZW50LnR5cGUgKyBcIilcIik7XHJcblx0XHQgKiB9XHJcblx0XHQgKiAvLyBhZGQgbGlzdGVuZXJzXHJcblx0XHQgKiBzY2VuZS5vbihcImNoYW5nZSB1cGRhdGUgcHJvZ3Jlc3Mgc3RhcnQgZW5kIGVudGVyIGxlYXZlXCIsIGNhbGxiYWNrKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZXMgLSBUaGUgbmFtZSBvciBuYW1lcyBvZiB0aGUgZXZlbnQgdGhlIGNhbGxiYWNrIHNob3VsZCBiZSBhdHRhY2hlZCB0by5cclxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCwgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC4gQW4gZXZlbnQgb2JqZWN0IHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjYWxsYmFjay5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMub24gPSBmdW5jdGlvbiAobmFtZXMsIGNhbGxiYWNrKSB7XHJcblx0XHRcdGlmIChfdXRpbC50eXBlLkZ1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG5cdFx0XHRcdG5hbWVzID0gbmFtZXMudHJpbSgpLnNwbGl0KCcgJyk7XHJcblx0XHRcdFx0bmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoZnVsbG5hbWUpIHtcclxuXHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0bmFtZXBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJy4nKSxcclxuXHRcdFx0XHRcdFx0ZXZlbnRuYW1lID0gbmFtZXBhcnRzWzBdLFxyXG5cdFx0XHRcdFx0XHRuYW1lc3BhY2UgPSBuYW1lcGFydHNbMV07XHJcblx0XHRcdFx0XHRpZiAoZXZlbnRuYW1lICE9IFwiKlwiKSB7IC8vIGRpc2FsbG93IHdpbGRjYXJkc1xyXG5cdFx0XHRcdFx0XHRpZiAoIV9saXN0ZW5lcnNbZXZlbnRuYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRcdF9saXN0ZW5lcnNbZXZlbnRuYW1lXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdF9saXN0ZW5lcnNbZXZlbnRuYW1lXS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc3BhY2U6IG5hbWVzcGFjZSB8fCAnJyxcclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9nKDEsIFwiRVJST1Igd2hlbiBjYWxsaW5nICcub24oKSc6IFN1cHBsaWVkIGNhbGxiYWNrIGZvciAnXCIgKyBuYW1lcyArIFwiJyBpcyBub3QgYSB2YWxpZCBmdW5jdGlvbiFcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlbW92ZSBvbmUgb3IgbW9yZSBldmVudCBsaXN0ZW5lci5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjb2ZmXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIGZ1bmN0aW9uIGNhbGxiYWNrIChldmVudCkge1xyXG5cdFx0ICogXHRcdGNvbnNvbGUubG9nKFwiRXZlbnQgZmlyZWQhIChcIiArIGV2ZW50LnR5cGUgKyBcIilcIik7XHJcblx0XHQgKiB9XHJcblx0XHQgKiAvLyBhZGQgbGlzdGVuZXJzXHJcblx0XHQgKiBzY2VuZS5vbihcImNoYW5nZSB1cGRhdGVcIiwgY2FsbGJhY2spO1xyXG5cdFx0ICogLy8gcmVtb3ZlIGxpc3RlbmVyc1xyXG5cdFx0ICogc2NlbmUub2ZmKFwiY2hhbmdlIHVwZGF0ZVwiLCBjYWxsYmFjayk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWVzIC0gVGhlIG5hbWUgb3IgbmFtZXMgb2YgdGhlIGV2ZW50IHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQuXHJcblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIC0gQSBzcGVjaWZpYyBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSByZW1vdmVkLiBJZiBub25lIGlzIHBhc3NlZCBhbGwgY2FsbGJhY2tzIHRvIHRoZSBldmVudCBsaXN0ZW5lciB3aWxsIGJlIHJlbW92ZWQuXHJcblx0XHQgKiBAcmV0dXJucyB7U2NlbmV9IFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLm9mZiA9IGZ1bmN0aW9uIChuYW1lcywgY2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCFuYW1lcykge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SOiBJbnZhbGlkIGV2ZW50IG5hbWUgc3VwcGxpZWQuXCIpO1xyXG5cdFx0XHRcdHJldHVybiBTY2VuZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRuYW1lcyA9IG5hbWVzLnRyaW0oKS5zcGxpdCgnICcpO1xyXG5cdFx0XHRuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChmdWxsbmFtZSwga2V5KSB7XHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0bmFtZXBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJy4nKSxcclxuXHRcdFx0XHRcdGV2ZW50bmFtZSA9IG5hbWVwYXJ0c1swXSxcclxuXHRcdFx0XHRcdG5hbWVzcGFjZSA9IG5hbWVwYXJ0c1sxXSB8fCAnJyxcclxuXHRcdFx0XHRcdHJlbW92ZUxpc3QgPSBldmVudG5hbWUgPT09ICcqJyA/IE9iamVjdC5rZXlzKF9saXN0ZW5lcnMpIDogW2V2ZW50bmFtZV07XHJcblx0XHRcdFx0cmVtb3ZlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChyZW1vdmUpIHtcclxuXHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0bGlzdCA9IF9saXN0ZW5lcnNbcmVtb3ZlXSB8fCBbXSxcclxuXHRcdFx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdFx0d2hpbGUgKGktLSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbGlzdGVuZXIgPSBsaXN0W2ldO1xyXG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIgJiYgKG5hbWVzcGFjZSA9PT0gbGlzdGVuZXIubmFtZXNwYWNlIHx8IG5hbWVzcGFjZSA9PT0gJyonKSAmJiAoIWNhbGxiYWNrIHx8IGNhbGxiYWNrID09IGxpc3RlbmVyLmNhbGxiYWNrKSkge1xyXG5cdFx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWxpc3QubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBfbGlzdGVuZXJzW3JlbW92ZV07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gU2NlbmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVHJpZ2dlciBhbiBldmVudC5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjdHJpZ2dlclxyXG5cdFx0ICpcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiB0aGlzLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCBzaG91bGQgYmUgdHJpZ2dlcmVkLlxyXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IFt2YXJzXSAtIEFuIG9iamVjdCBjb250YWluaW5nIGluZm8gdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBjYWxsYmFjay5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChuYW1lLCB2YXJzKSB7XHJcblx0XHRcdGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0bmFtZXBhcnRzID0gbmFtZS50cmltKCkuc3BsaXQoJy4nKSxcclxuXHRcdFx0XHRcdGV2ZW50bmFtZSA9IG5hbWVwYXJ0c1swXSxcclxuXHRcdFx0XHRcdG5hbWVzcGFjZSA9IG5hbWVwYXJ0c1sxXSxcclxuXHRcdFx0XHRcdGxpc3RlbmVycyA9IF9saXN0ZW5lcnNbZXZlbnRuYW1lXTtcclxuXHRcdFx0XHRsb2coMywgJ2V2ZW50IGZpcmVkOicsIGV2ZW50bmFtZSwgdmFycyA/IFwiLT5cIiA6ICcnLCB2YXJzIHx8ICcnKTtcclxuXHRcdFx0XHRpZiAobGlzdGVuZXJzKSB7XHJcblx0XHRcdFx0XHRsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIsIGtleSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIW5hbWVzcGFjZSB8fCBuYW1lc3BhY2UgPT09IGxpc3RlbmVyLm5hbWVzcGFjZSkge1xyXG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmNhbGxiYWNrLmNhbGwoU2NlbmUsIG5ldyBTY3JvbGxNYWdpYy5FdmVudChldmVudG5hbWUsIGxpc3RlbmVyLm5hbWVzcGFjZSwgU2NlbmUsIHZhcnMpKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SOiBJbnZhbGlkIGV2ZW50IG5hbWUgc3VwcGxpZWQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTY2VuZTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gc2V0IGV2ZW50IGxpc3RlbmVyc1xyXG5cdFx0U2NlbmUub24oXCJjaGFuZ2UuaW50ZXJuYWxcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0aWYgKGUud2hhdCAhPT0gXCJsb2dsZXZlbFwiICYmIGUud2hhdCAhPT0gXCJ0d2VlbkNoYW5nZXNcIikgeyAvLyBubyBuZWVkIGZvciBhIHNjZW5lIHVwZGF0ZSBzY2VuZSB3aXRoIHRoZXNlIG9wdGlvbnMuLi5cclxuXHRcdFx0XHRpZiAoZS53aGF0ID09PSBcInRyaWdnZXJFbGVtZW50XCIpIHtcclxuXHRcdFx0XHRcdHVwZGF0ZVRyaWdnZXJFbGVtZW50UG9zaXRpb24oKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGUud2hhdCA9PT0gXCJyZXZlcnNlXCIpIHsgLy8gdGhlIG9ubHkgcHJvcGVydHkgbGVmdCB0aGF0IG1heSBoYXZlIGFuIGltcGFjdCBvbiB0aGUgY3VycmVudCBzY2VuZSBzdGF0ZS4gRXZlcnl0aGluZyBlbHNlIGlzIGhhbmRsZWQgYnkgdGhlIHNoaWZ0IGV2ZW50LlxyXG5cdFx0XHRcdFx0U2NlbmUudXBkYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KS5vbihcInNoaWZ0LmludGVybmFsXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdHVwZGF0ZVNjcm9sbE9mZnNldCgpO1xyXG5cdFx0XHRTY2VuZS51cGRhdGUoKTsgLy8gdXBkYXRlIHNjZW5lIHRvIHJlZmxlY3QgbmV3IHBvc2l0aW9uXHJcblx0XHR9KTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNlbmQgYSBkZWJ1ZyBtZXNzYWdlIHRvIHRoZSBjb25zb2xlLlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIGJ1dCBwcm92aWRlZCBwdWJsaWNseSB3aXRoIF9sb2cgZm9yIHBsdWdpbnNcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gbG9nbGV2ZWwgLSBUaGUgbG9nbGV2ZWwgcmVxdWlyZWQgdG8gaW5pdGlhdGUgb3V0cHV0IGZvciB0aGUgbWVzc2FnZS5cclxuXHRcdCAqIEBwYXJhbSB7Li4ubWl4ZWR9IG91dHB1dCAtIE9uZSBvciBtb3JlIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIGNvbnNvbGUuXHJcblx0XHQgKi9cclxuXHRcdHZhciBsb2cgPSB0aGlzLl9sb2cgPSBmdW5jdGlvbiAobG9nbGV2ZWwsIG91dHB1dCkge1xyXG5cdFx0XHRpZiAoX29wdGlvbnMubG9nbGV2ZWwgPj0gbG9nbGV2ZWwpIHtcclxuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAwLCBcIihcIiArIE5BTUVTUEFDRSArIFwiKSAtPlwiKTtcclxuXHRcdFx0XHRfdXRpbC5sb2cuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWRkIHRoZSBzY2VuZSB0byBhIGNvbnRyb2xsZXIuICBcclxuXHRcdCAqIFRoaXMgaXMgdGhlIGVxdWl2YWxlbnQgdG8gYENvbnRyb2xsZXIuYWRkU2NlbmUoc2NlbmUpYC5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjYWRkVG9cclxuXHRcdCAqXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gYWRkIGEgc2NlbmUgdG8gYSBTY3JvbGxNYWdpYyBDb250cm9sbGVyXHJcblx0XHQgKiBzY2VuZS5hZGRUbyhjb250cm9sbGVyKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge1Njcm9sbE1hZ2ljLkNvbnRyb2xsZXJ9IGNvbnRyb2xsZXIgLSBUaGUgY29udHJvbGxlciB0byB3aGljaCB0aGUgc2NlbmUgc2hvdWxkIGJlIGFkZGVkLlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5hZGRUbyA9IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdGlmICghKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBTY3JvbGxNYWdpYy5Db250cm9sbGVyKSkge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SOiBzdXBwbGllZCBhcmd1bWVudCBvZiAnYWRkVG8oKScgaXMgbm90IGEgdmFsaWQgU2Nyb2xsTWFnaWMgQ29udHJvbGxlclwiKTtcclxuXHRcdFx0fSBlbHNlIGlmIChfY29udHJvbGxlciAhPSBjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0Ly8gbmV3IGNvbnRyb2xsZXJcclxuXHRcdFx0XHRpZiAoX2NvbnRyb2xsZXIpIHsgLy8gd2FzIGFzc29jaWF0ZWQgdG8gYSBkaWZmZXJlbnQgY29udHJvbGxlciBiZWZvcmUsIHNvIHJlbW92ZSBpdC4uLlxyXG5cdFx0XHRcdFx0X2NvbnRyb2xsZXIucmVtb3ZlU2NlbmUoU2NlbmUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRfY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcblx0XHRcdFx0dmFsaWRhdGVPcHRpb24oKTtcclxuXHRcdFx0XHR1cGRhdGVEdXJhdGlvbih0cnVlKTtcclxuXHRcdFx0XHR1cGRhdGVUcmlnZ2VyRWxlbWVudFBvc2l0aW9uKHRydWUpO1xyXG5cdFx0XHRcdHVwZGF0ZVNjcm9sbE9mZnNldCgpO1xyXG5cdFx0XHRcdF9jb250cm9sbGVyLmluZm8oXCJjb250YWluZXJcIikuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25Db250YWluZXJSZXNpemUpO1xyXG5cdFx0XHRcdGNvbnRyb2xsZXIuYWRkU2NlbmUoU2NlbmUpO1xyXG5cdFx0XHRcdFNjZW5lLnRyaWdnZXIoXCJhZGRcIiwge1xyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogX2NvbnRyb2xsZXJcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRsb2coMywgXCJhZGRlZCBcIiArIE5BTUVTUEFDRSArIFwiIHRvIGNvbnRyb2xsZXJcIik7XHJcblx0XHRcdFx0U2NlbmUudXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgY3VycmVudCBlbmFibGVkIHN0YXRlIG9mIHRoZSBzY2VuZS4gIFxyXG5cdFx0ICogVGhpcyBjYW4gYmUgdXNlZCB0byBkaXNhYmxlIHRoaXMgc2NlbmUgd2l0aG91dCByZW1vdmluZyBvciBkZXN0cm95aW5nIGl0LlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSNlbmFibGVkXHJcblx0XHQgKlxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCB2YWx1ZVxyXG5cdFx0ICogdmFyIGVuYWJsZWQgPSBzY2VuZS5lbmFibGVkKCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gZGlzYWJsZSB0aGUgc2NlbmVcclxuXHRcdCAqIHNjZW5lLmVuYWJsZWQoZmFsc2UpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW25ld1N0YXRlXSAtIFRoZSBuZXcgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgc2NlbmUgYHRydWVgIG9yIGBmYWxzZWAuXHJcblx0XHQgKiBAcmV0dXJucyB7KGJvb2xlYW58U2NlbmUpfSBDdXJyZW50IGVuYWJsZWQgc3RhdGUgb3IgcGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xyXG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHsgLy8gZ2V0XHJcblx0XHRcdFx0cmV0dXJuIF9lbmFibGVkO1xyXG5cdFx0XHR9IGVsc2UgaWYgKF9lbmFibGVkICE9IG5ld1N0YXRlKSB7IC8vIHNldFxyXG5cdFx0XHRcdF9lbmFibGVkID0gISEgbmV3U3RhdGU7XHJcblx0XHRcdFx0U2NlbmUudXBkYXRlKHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTY2VuZTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZW1vdmUgdGhlIHNjZW5lIGZyb20gdGhlIGNvbnRyb2xsZXIuICBcclxuXHRcdCAqIFRoaXMgaXMgdGhlIGVxdWl2YWxlbnQgdG8gYENvbnRyb2xsZXIucmVtb3ZlU2NlbmUoc2NlbmUpYC5cclxuXHRcdCAqIFRoZSBzY2VuZSB3aWxsIG5vdCBiZSB1cGRhdGVkIGFueW1vcmUgdW50aWwgeW91IHJlYWRkIGl0IHRvIGEgY29udHJvbGxlci5cclxuXHRcdCAqIFRvIHJlbW92ZSB0aGUgcGluIG9yIHRoZSB0d2VlbiB5b3UgbmVlZCB0byBjYWxsIHJlbW92ZVR3ZWVuKCkgb3IgcmVtb3ZlUGluKCkgcmVzcGVjdGl2ZWx5LlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSNyZW1vdmVcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyByZW1vdmUgdGhlIHNjZW5lIGZyb20gaXRzIGNvbnRyb2xsZXJcclxuXHRcdCAqIHNjZW5lLnJlbW92ZSgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoX2NvbnRyb2xsZXIpIHtcclxuXHRcdFx0XHRfY29udHJvbGxlci5pbmZvKFwiY29udGFpbmVyXCIpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uQ29udGFpbmVyUmVzaXplKTtcclxuXHRcdFx0XHR2YXIgdG1wUGFyZW50ID0gX2NvbnRyb2xsZXI7XHJcblx0XHRcdFx0X2NvbnRyb2xsZXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0dG1wUGFyZW50LnJlbW92ZVNjZW5lKFNjZW5lKTtcclxuXHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwicmVtb3ZlXCIpO1xyXG5cdFx0XHRcdGxvZygzLCBcInJlbW92ZWQgXCIgKyBOQU1FU1BBQ0UgKyBcIiBmcm9tIGNvbnRyb2xsZXJcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlc3Ryb3kgdGhlIHNjZW5lIGFuZCBldmVyeXRoaW5nLlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSNkZXN0cm95XHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gZGVzdHJveSB0aGUgc2NlbmUgd2l0aG91dCByZXNldHRpbmcgdGhlIHBpbiBhbmQgdHdlZW4gdG8gdGhlaXIgaW5pdGlhbCBwb3NpdGlvbnNcclxuXHRcdCAqIHNjZW5lID0gc2NlbmUuZGVzdHJveSgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIGRlc3Ryb3kgdGhlIHNjZW5lIGFuZCByZXNldCB0aGUgcGluIGFuZCB0d2VlblxyXG5cdFx0ICogc2NlbmUgPSBzY2VuZS5kZXN0cm95KHRydWUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Jlc2V0PWZhbHNlXSAtIElmIGB0cnVlYCB0aGUgcGluIGFuZCB0d2VlbiAoaWYgZXhpc3RlbnQpIHdpbGwgYmUgcmVzZXQuXHJcblx0XHQgKiBAcmV0dXJucyB7bnVsbH0gTnVsbCB0byB1bnNldCBoYW5kbGVyIHZhcmlhYmxlcy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKHJlc2V0KSB7XHJcblx0XHRcdFNjZW5lLnRyaWdnZXIoXCJkZXN0cm95XCIsIHtcclxuXHRcdFx0XHRyZXNldDogcmVzZXRcclxuXHRcdFx0fSk7XHJcblx0XHRcdFNjZW5lLnJlbW92ZSgpO1xyXG5cdFx0XHRTY2VuZS5vZmYoXCIqLipcIik7XHJcblx0XHRcdGxvZygzLCBcImRlc3Ryb3llZCBcIiArIE5BTUVTUEFDRSArIFwiIChyZXNldDogXCIgKyAocmVzZXQgPyBcInRydWVcIiA6IFwiZmFsc2VcIikgKyBcIilcIik7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBVcGRhdGVzIHRoZSBTY2VuZSB0byByZWZsZWN0IHRoZSBjdXJyZW50IHN0YXRlLiAgXHJcblx0XHQgKiBUaGlzIGlzIHRoZSBlcXVpdmFsZW50IHRvIGBDb250cm9sbGVyLnVwZGF0ZVNjZW5lKHNjZW5lLCBpbW1lZGlhdGVseSlgLiAgXHJcblx0XHQgKiBUaGUgdXBkYXRlIG1ldGhvZCBjYWxjdWxhdGVzIHRoZSBzY2VuZSdzIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSB0cmlnZ2VyIGVsZW1lbnQsIHRyaWdnZXIgaG9vaywgZHVyYXRpb24gYW5kIG9mZnNldCkgYW5kIGNoZWNrcyBpdCBhZ2FpbnN0IHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgY29udGFpbmVyLiAgXHJcblx0XHQgKiBJdCB0aGVuIHVwZGF0ZXMgdGhlIGN1cnJlbnQgc2NlbmUgc3RhdGUgYWNjb3JkaW5nbHkgKG9yIGRvZXMgbm90aGluZywgaWYgdGhlIHN0YXRlIGlzIGFscmVhZHkgY29ycmVjdCkg4oCTIFBpbnMgd2lsbCBiZSBzZXQgdG8gdGhlaXIgY29ycmVjdCBwb3NpdGlvbiBhbmQgdHdlZW5zIHdpbGwgYmUgdXBkYXRlZCB0byB0aGVpciBjb3JyZWN0IHByb2dyZXNzLlxyXG5cdFx0ICogVGhpcyBtZWFucyBhbiB1cGRhdGUgZG9lc24ndCBuZWNlc3NhcmlseSByZXN1bHQgaW4gYSBwcm9ncmVzcyBjaGFuZ2UuIFRoZSBgcHJvZ3Jlc3NgIGV2ZW50IHdpbGwgYmUgZmlyZWQgaWYgdGhlIHByb2dyZXNzIGhhcyBpbmRlZWQgY2hhbmdlZCBiZXR3ZWVuIHRoaXMgdXBkYXRlIGFuZCB0aGUgbGFzdC4gIFxyXG5cdFx0ICogXyoqTk9URToqKiBUaGlzIG1ldGhvZCBnZXRzIGNhbGxlZCBjb25zdGFudGx5IHdoZW5ldmVyIFNjcm9sbE1hZ2ljIGRldGVjdHMgYSBjaGFuZ2UuIFRoZSBvbmx5IGFwcGxpY2F0aW9uIGZvciB5b3UgaXMgaWYgeW91IGNoYW5nZSBzb21ldGhpbmcgb3V0c2lkZSBvZiB0aGUgcmVhbG0gb2YgU2Nyb2xsTWFnaWMsIGxpa2UgbW92aW5nIHRoZSB0cmlnZ2VyIG9yIGNoYW5naW5nIHR3ZWVuIHBhcmFtZXRlcnMuX1xyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSN1cGRhdGVcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyB1cGRhdGUgdGhlIHNjZW5lIG9uIG5leHQgdGlja1xyXG5cdFx0ICogc2NlbmUudXBkYXRlKCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gdXBkYXRlIHRoZSBzY2VuZSBpbW1lZGlhdGVseVxyXG5cdFx0ICogc2NlbmUudXBkYXRlKHRydWUpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBmaXJlcyBTY2VuZS51cGRhdGVcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbW1lZGlhdGVseT1mYWxzZV0gLSBJZiBgdHJ1ZWAgdGhlIHVwZGF0ZSB3aWxsIGJlIGluc3RhbnQsIGlmIGBmYWxzZWAgaXQgd2lsbCB3YWl0IHVudGlsIG5leHQgdXBkYXRlIGN5Y2xlIChiZXR0ZXIgcGVyZm9ybWFuY2UpLlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoaW1tZWRpYXRlbHkpIHtcclxuXHRcdFx0aWYgKF9jb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGltbWVkaWF0ZWx5KSB7XHJcblx0XHRcdFx0XHRpZiAoX2NvbnRyb2xsZXIuZW5hYmxlZCgpICYmIF9lbmFibGVkKSB7XHJcblx0XHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0XHRzY3JvbGxQb3MgPSBfY29udHJvbGxlci5pbmZvKFwic2Nyb2xsUG9zXCIpLFxyXG5cdFx0XHRcdFx0XHRcdG5ld1Byb2dyZXNzO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKF9vcHRpb25zLmR1cmF0aW9uID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdG5ld1Byb2dyZXNzID0gKHNjcm9sbFBvcyAtIF9zY3JvbGxPZmZzZXQuc3RhcnQpIC8gKF9zY3JvbGxPZmZzZXQuZW5kIC0gX3Njcm9sbE9mZnNldC5zdGFydCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3UHJvZ3Jlc3MgPSBzY3JvbGxQb3MgPj0gX3Njcm9sbE9mZnNldC5zdGFydCA/IDEgOiAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwidXBkYXRlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRzdGFydFBvczogX3Njcm9sbE9mZnNldC5zdGFydCxcclxuXHRcdFx0XHRcdFx0XHRlbmRQb3M6IF9zY3JvbGxPZmZzZXQuZW5kLFxyXG5cdFx0XHRcdFx0XHRcdHNjcm9sbFBvczogc2Nyb2xsUG9zXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0U2NlbmUucHJvZ3Jlc3MobmV3UHJvZ3Jlc3MpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChfcGluICYmIF9zdGF0ZSA9PT0gU0NFTkVfU1RBVEVfRFVSSU5HKSB7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZVBpblN0YXRlKHRydWUpOyAvLyB1bnBpbiBpbiBwb3NpdGlvblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRfY29udHJvbGxlci51cGRhdGVTY2VuZShTY2VuZSwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gU2NlbmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyBkeW5hbWljIHNjZW5lIHZhcmlhYmxlcyBsaWtlIHRoZSB0cmlnZ2VyIGVsZW1lbnQgcG9zaXRpb24gb3IgdGhlIGR1cmF0aW9uLlxyXG5cdFx0ICogVGhpcyBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgaW4gcmVndWxhciBpbnRlcnZhbHMgZnJvbSB0aGUgY29udHJvbGxlci4gU2VlIHtAbGluayBTY3JvbGxNYWdpYy5Db250cm9sbGVyfSBvcHRpb24gYHJlZnJlc2hJbnRlcnZhbGAuXHJcblx0XHQgKiBcclxuXHRcdCAqIFlvdSBjYW4gY2FsbCBpdCB0byBtaW5pbWl6ZSBsYWcsIGZvciBleGFtcGxlIHdoZW4geW91IGludGVudGlvbmFsbHkgY2hhbmdlIHRoZSBwb3NpdGlvbiBvZiB0aGUgdHJpZ2dlckVsZW1lbnQuXHJcblx0XHQgKiBJZiB5b3UgZG9uJ3QgaXQgd2lsbCBzaW1wbHkgYmUgdXBkYXRlZCBpbiB0aGUgbmV4dCByZWZyZXNoIGludGVydmFsIG9mIHRoZSBjb250YWluZXIsIHdoaWNoIGlzIHVzdWFsbHkgc3VmZmljaWVudC5cclxuXHRcdCAqXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI3JlZnJlc2hcclxuXHRcdCAqIEBzaW5jZSAxLjEuMFxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIHNjZW5lID0gbmV3IFNjcm9sbE1hZ2ljLlNjZW5lKHt0cmlnZ2VyRWxlbWVudDogXCIjdHJpZ2dlclwifSk7XHJcblx0XHQgKiBcclxuXHRcdCAqIC8vIGNoYW5nZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRyaWdnZXJcclxuXHRcdCAqICQoXCIjdHJpZ2dlclwiKS5jc3MoXCJ0b3BcIiwgNTAwKTtcclxuXHRcdCAqIC8vIGltbWVkaWF0ZWx5IGxldCB0aGUgc2NlbmUga25vdyBvZiB0aGlzIGNoYW5nZVxyXG5cdFx0ICogc2NlbmUucmVmcmVzaCgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuc2hpZnR9LCBpZiB0aGUgdHJpZ2dlciBlbGVtZW50IHBvc2l0aW9uIG9yIHRoZSBkdXJhdGlvbiBjaGFuZ2VkXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLmNoYW5nZX0sIGlmIHRoZSBkdXJhdGlvbiBjaGFuZ2VkXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR1cGRhdGVEdXJhdGlvbigpO1xyXG5cdFx0XHR1cGRhdGVUcmlnZ2VyRWxlbWVudFBvc2l0aW9uKCk7XHJcblx0XHRcdC8vIHVwZGF0ZSB0cmlnZ2VyIGVsZW1lbnQgcG9zaXRpb25cclxuXHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgc2NlbmUncyBwcm9ncmVzcy4gIFxyXG5cdFx0ICogVXN1YWxseSBpdCBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5IHRvIHVzZSB0aGlzIGFzIGEgc2V0dGVyLCBhcyBpdCBpcyBzZXQgYXV0b21hdGljYWxseSBieSBzY2VuZS51cGRhdGUoKS4gIFxyXG5cdFx0ICogVGhlIG9yZGVyIGluIHdoaWNoIHRoZSBldmVudHMgYXJlIGZpcmVkIGRlcGVuZHMgb24gdGhlIGR1cmF0aW9uIG9mIHRoZSBzY2VuZTpcclxuXHRcdCAqICAxLiBTY2VuZXMgd2l0aCBgZHVyYXRpb24gPT0gMGA6ICBcclxuXHRcdCAqICBTY2VuZXMgdGhhdCBoYXZlIG5vIGR1cmF0aW9uIGJ5IGRlZmluaXRpb24gaGF2ZSBubyBlbmRpbmcuIFRodXMgdGhlIGBlbmRgIGV2ZW50IHdpbGwgbmV2ZXIgYmUgZmlyZWQuICBcclxuXHRcdCAqICBXaGVuIHRoZSB0cmlnZ2VyIHBvc2l0aW9uIG9mIHRoZSBzY2VuZSBpcyBwYXNzZWQgdGhlIGV2ZW50cyBhcmUgYWx3YXlzIGZpcmVkIGluIHRoaXMgb3JkZXI6ICBcclxuXHRcdCAqICBgZW50ZXJgLCBgc3RhcnRgLCBgcHJvZ3Jlc3NgIHdoZW4gc2Nyb2xsaW5nIGZvcndhcmQgIFxyXG5cdFx0ICogIGFuZCAgXHJcblx0XHQgKiAgYHByb2dyZXNzYCwgYHN0YXJ0YCwgYGxlYXZlYCB3aGVuIHNjcm9sbGluZyBpbiByZXZlcnNlXHJcblx0XHQgKiAgMi4gU2NlbmVzIHdpdGggYGR1cmF0aW9uID4gMGA6ICBcclxuXHRcdCAqICBTY2VuZXMgd2l0aCBhIHNldCBkdXJhdGlvbiBoYXZlIGEgZGVmaW5lZCBzdGFydCBhbmQgZW5kIHBvaW50LiAgXHJcblx0XHQgKiAgV2hlbiBzY3JvbGxpbmcgcGFzdCB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHNjZW5lIGl0IHdpbGwgZmlyZSB0aGVzZSBldmVudHMgaW4gdGhpcyBvcmRlcjogIFxyXG5cdFx0ICogIGBlbnRlcmAsIGBzdGFydGAsIGBwcm9ncmVzc2AgIFxyXG5cdFx0ICogIFdoZW4gY29udGludWluZyB0byBzY3JvbGwgYW5kIHBhc3NpbmcgdGhlIGVuZCBwb2ludCBpdCB3aWxsIGZpcmUgdGhlc2UgZXZlbnRzOiAgXHJcblx0XHQgKiAgYHByb2dyZXNzYCwgYGVuZGAsIGBsZWF2ZWAgIFxyXG5cdFx0ICogIFdoZW4gcmV2ZXJzaW5nIHRocm91Z2ggdGhlIGVuZCBwb2ludCB0aGVzZSBldmVudHMgYXJlIGZpcmVkOiAgXHJcblx0XHQgKiAgYGVudGVyYCwgYGVuZGAsIGBwcm9ncmVzc2AgIFxyXG5cdFx0ICogIEFuZCB3aGVuIGNvbnRpbnVpbmcgdG8gc2Nyb2xsIHBhc3QgdGhlIHN0YXJ0IHBvc2l0aW9uIGluIHJldmVyc2UgaXQgd2lsbCBmaXJlOiAgXHJcblx0XHQgKiAgYHByb2dyZXNzYCwgYHN0YXJ0YCwgYGxlYXZlYCAgXHJcblx0XHQgKiAgSW4gYmV0d2VlbiBzdGFydCBhbmQgZW5kIHRoZSBgcHJvZ3Jlc3NgIGV2ZW50IHdpbGwgYmUgY2FsbGVkIGNvbnN0YW50bHksIHdoZW5ldmVyIHRoZSBwcm9ncmVzcyBjaGFuZ2VzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBJbiBzaG9ydDogIFxyXG5cdFx0ICogYGVudGVyYCBldmVudHMgd2lsbCBhbHdheXMgdHJpZ2dlciAqKmJlZm9yZSoqIHRoZSBwcm9ncmVzcyB1cGRhdGUgYW5kIGBsZWF2ZWAgZW52ZW50cyB3aWxsIHRyaWdnZXIgKiphZnRlcioqIHRoZSBwcm9ncmVzcyB1cGRhdGUuICBcclxuXHRcdCAqIGBzdGFydGAgYW5kIGBlbmRgIHdpbGwgYWx3YXlzIHRyaWdnZXIgYXQgdGhlaXIgcmVzcGVjdGl2ZSBwb3NpdGlvbi5cclxuXHRcdCAqIFxyXG5cdFx0ICogUGxlYXNlIHJldmlldyB0aGUgZXZlbnQgZGVzY3JpcHRpb25zIGZvciBkZXRhaWxzIG9uIHRoZSBldmVudHMgYW5kIHRoZSBldmVudCBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI3Byb2dyZXNzXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gZ2V0IHRoZSBjdXJyZW50IHNjZW5lIHByb2dyZXNzXHJcblx0XHQgKiB2YXIgcHJvZ3Jlc3MgPSBzY2VuZS5wcm9ncmVzcygpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNldCBuZXcgc2NlbmUgcHJvZ3Jlc3NcclxuXHRcdCAqIHNjZW5lLnByb2dyZXNzKDAuMyk7XHJcblx0XHQgKlxyXG5cdFx0ICogQGZpcmVzIHtAbGluayBTY2VuZS5lbnRlcn0sIHdoZW4gdXNlZCBhcyBzZXR0ZXJcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuc3RhcnR9LCB3aGVuIHVzZWQgYXMgc2V0dGVyXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLnByb2dyZXNzfSwgd2hlbiB1c2VkIGFzIHNldHRlclxyXG5cdFx0ICogQGZpcmVzIHtAbGluayBTY2VuZS5lbmR9LCB3aGVuIHVzZWQgYXMgc2V0dGVyXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLmxlYXZlfSwgd2hlbiB1c2VkIGFzIHNldHRlclxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbcHJvZ3Jlc3NdIC0gVGhlIG5ldyBwcm9ncmVzcyB2YWx1ZSBvZiB0aGUgc2NlbmUgYFswLTFdYC5cclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJ9IGBnZXRgIC0gIEN1cnJlbnQgc2NlbmUgcHJvZ3Jlc3MuXHJcblx0XHQgKiBAcmV0dXJucyB7U2NlbmV9IGBzZXRgIC0gIFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XHJcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkgeyAvLyBnZXRcclxuXHRcdFx0XHRyZXR1cm4gX3Byb2dyZXNzO1xyXG5cdFx0XHR9IGVsc2UgeyAvLyBzZXRcclxuXHRcdFx0XHR2YXJcclxuXHRcdFx0XHRkb1VwZGF0ZSA9IGZhbHNlLFxyXG5cdFx0XHRcdFx0b2xkU3RhdGUgPSBfc3RhdGUsXHJcblx0XHRcdFx0XHRzY3JvbGxEaXJlY3Rpb24gPSBfY29udHJvbGxlciA/IF9jb250cm9sbGVyLmluZm8oXCJzY3JvbGxEaXJlY3Rpb25cIikgOiAnUEFVU0VEJyxcclxuXHRcdFx0XHRcdHJldmVyc2VPckZvcndhcmQgPSBfb3B0aW9ucy5yZXZlcnNlIHx8IHByb2dyZXNzID49IF9wcm9ncmVzcztcclxuXHRcdFx0XHRpZiAoX29wdGlvbnMuZHVyYXRpb24gPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIHplcm8gZHVyYXRpb24gc2NlbmVzXHJcblx0XHRcdFx0XHRkb1VwZGF0ZSA9IF9wcm9ncmVzcyAhPSBwcm9ncmVzcztcclxuXHRcdFx0XHRcdF9wcm9ncmVzcyA9IHByb2dyZXNzIDwgMSAmJiByZXZlcnNlT3JGb3J3YXJkID8gMCA6IDE7XHJcblx0XHRcdFx0XHRfc3RhdGUgPSBfcHJvZ3Jlc3MgPT09IDAgPyBTQ0VORV9TVEFURV9CRUZPUkUgOiBTQ0VORV9TVEFURV9EVVJJTkc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHNjZW5lcyB3aXRoIHN0YXJ0IGFuZCBlbmRcclxuXHRcdFx0XHRcdGlmIChwcm9ncmVzcyA8IDAgJiYgX3N0YXRlICE9PSBTQ0VORV9TVEFURV9CRUZPUkUgJiYgcmV2ZXJzZU9yRm9yd2FyZCkge1xyXG5cdFx0XHRcdFx0XHQvLyBnbyBiYWNrIHRvIGluaXRpYWwgc3RhdGVcclxuXHRcdFx0XHRcdFx0X3Byb2dyZXNzID0gMDtcclxuXHRcdFx0XHRcdFx0X3N0YXRlID0gU0NFTkVfU1RBVEVfQkVGT1JFO1xyXG5cdFx0XHRcdFx0XHRkb1VwZGF0ZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHByb2dyZXNzID49IDAgJiYgcHJvZ3Jlc3MgPCAxICYmIHJldmVyc2VPckZvcndhcmQpIHtcclxuXHRcdFx0XHRcdFx0X3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcblx0XHRcdFx0XHRcdF9zdGF0ZSA9IFNDRU5FX1NUQVRFX0RVUklORztcclxuXHRcdFx0XHRcdFx0ZG9VcGRhdGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcm9ncmVzcyA+PSAxICYmIF9zdGF0ZSAhPT0gU0NFTkVfU1RBVEVfQUZURVIpIHtcclxuXHRcdFx0XHRcdFx0X3Byb2dyZXNzID0gMTtcclxuXHRcdFx0XHRcdFx0X3N0YXRlID0gU0NFTkVfU1RBVEVfQUZURVI7XHJcblx0XHRcdFx0XHRcdGRvVXBkYXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoX3N0YXRlID09PSBTQ0VORV9TVEFURV9EVVJJTkcgJiYgIXJldmVyc2VPckZvcndhcmQpIHtcclxuXHRcdFx0XHRcdFx0dXBkYXRlUGluU3RhdGUoKTsgLy8gaW4gY2FzZSB3ZSBzY3JvbGxlZCBiYWNrd2FyZHMgbWlkLXNjZW5lIGFuZCByZXZlcnNlIGlzIGRpc2FibGVkID0+IHVwZGF0ZSB0aGUgcGluIHBvc2l0aW9uLCBzbyBpdCBkb2Vzbid0IG1vdmUgYmFjayBhcyB3ZWxsLlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZG9VcGRhdGUpIHtcclxuXHRcdFx0XHRcdC8vIGZpcmUgZXZlbnRzXHJcblx0XHRcdFx0XHR2YXJcclxuXHRcdFx0XHRcdGV2ZW50VmFycyA9IHtcclxuXHRcdFx0XHRcdFx0cHJvZ3Jlc3M6IF9wcm9ncmVzcyxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IF9zdGF0ZSxcclxuXHRcdFx0XHRcdFx0c2Nyb2xsRGlyZWN0aW9uOiBzY3JvbGxEaXJlY3Rpb25cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHN0YXRlQ2hhbmdlZCA9IF9zdGF0ZSAhPSBvbGRTdGF0ZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgdHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHsgLy8gdG1wIGhlbHBlciB0byBzaW1wbGlmeSBjb2RlXHJcblx0XHRcdFx0XHRcdFNjZW5lLnRyaWdnZXIoZXZlbnROYW1lLCBldmVudFZhcnMpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRpZiAoc3RhdGVDaGFuZ2VkKSB7IC8vIGVudGVyIGV2ZW50c1xyXG5cdFx0XHRcdFx0XHRpZiAob2xkU3RhdGUgIT09IFNDRU5FX1NUQVRFX0RVUklORykge1xyXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXIoXCJlbnRlclwiKTtcclxuXHRcdFx0XHRcdFx0XHR0cmlnZ2VyKG9sZFN0YXRlID09PSBTQ0VORV9TVEFURV9CRUZPUkUgPyBcInN0YXJ0XCIgOiBcImVuZFwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dHJpZ2dlcihcInByb2dyZXNzXCIpO1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlQ2hhbmdlZCkgeyAvLyBsZWF2ZSBldmVudHNcclxuXHRcdFx0XHRcdFx0aWYgKF9zdGF0ZSAhPT0gU0NFTkVfU1RBVEVfRFVSSU5HKSB7XHJcblx0XHRcdFx0XHRcdFx0dHJpZ2dlcihfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0JFRk9SRSA/IFwic3RhcnRcIiA6IFwiZW5kXCIpO1xyXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXIoXCJsZWF2ZVwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFVwZGF0ZSB0aGUgc3RhcnQgYW5kIGVuZCBzY3JvbGxPZmZzZXQgb2YgdGhlIGNvbnRhaW5lci5cclxuXHRcdCAqIFRoZSBwb3NpdGlvbnMgcmVmbGVjdCB3aGF0IHRoZSBjb250cm9sbGVyJ3Mgc2Nyb2xsIHBvc2l0aW9uIHdpbGwgYmUgYXQgdGhlIHN0YXJ0IGFuZCBlbmQgcmVzcGVjdGl2ZWx5LlxyXG5cdFx0ICogSXMgY2FsbGVkLCB3aGVuOlxyXG5cdFx0ICogICAtIFNjZW5lIGV2ZW50IFwiY2hhbmdlXCIgaXMgY2FsbGVkIHdpdGg6IG9mZnNldCwgdHJpZ2dlckhvb2ssIGR1cmF0aW9uIFxyXG5cdFx0ICogICAtIHNjcm9sbCBjb250YWluZXIgZXZlbnQgXCJyZXNpemVcIiBpcyBjYWxsZWRcclxuXHRcdCAqICAgLSB0aGUgcG9zaXRpb24gb2YgdGhlIHRyaWdnZXJFbGVtZW50IGNoYW5nZXNcclxuXHRcdCAqICAgLSB0aGUgY29udHJvbGxlciBjaGFuZ2VzIC0+IGFkZFRvKClcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciB1cGRhdGVTY3JvbGxPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdF9zY3JvbGxPZmZzZXQgPSB7XHJcblx0XHRcdFx0c3RhcnQ6IF90cmlnZ2VyUG9zICsgX29wdGlvbnMub2Zmc2V0XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChfY29udHJvbGxlciAmJiBfb3B0aW9ucy50cmlnZ2VyRWxlbWVudCkge1xyXG5cdFx0XHRcdC8vIHRha2UgYXdheSB0cmlnZ2VySG9vayBwb3J0aW9uIHRvIGdldCByZWxhdGl2ZSB0byB0b3BcclxuXHRcdFx0XHRfc2Nyb2xsT2Zmc2V0LnN0YXJ0IC09IF9jb250cm9sbGVyLmluZm8oXCJzaXplXCIpICogX29wdGlvbnMudHJpZ2dlckhvb2s7XHJcblx0XHRcdH1cclxuXHRcdFx0X3Njcm9sbE9mZnNldC5lbmQgPSBfc2Nyb2xsT2Zmc2V0LnN0YXJ0ICsgX29wdGlvbnMuZHVyYXRpb247XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyB0aGUgZHVyYXRpb24gaWYgc2V0IHRvIGEgZHluYW1pYyBmdW5jdGlvbi5cclxuXHRcdCAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoZSBzY2VuZSBpcyBhZGRlZCB0byBhIGNvbnRyb2xsZXIgYW5kIGluIHJlZ3VsYXIgaW50ZXJ2YWxzIGZyb20gdGhlIGNvbnRyb2xsZXIgdGhyb3VnaCBzY2VuZS5yZWZyZXNoKCkuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuY2hhbmdlfSwgaWYgdGhlIGR1cmF0aW9uIGNoYW5nZWRcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuc2hpZnR9LCBpZiB0aGUgZHVyYXRpb24gY2hhbmdlZFxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW3N1cHByZXNzRXZlbnRzPWZhbHNlXSAtIElmIHRydWUgdGhlIHNoaWZ0IGV2ZW50IHdpbGwgYmUgc3VwcHJlc3NlZC5cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciB1cGRhdGVEdXJhdGlvbiA9IGZ1bmN0aW9uIChzdXBwcmVzc0V2ZW50cykge1xyXG5cdFx0XHQvLyB1cGRhdGUgZHVyYXRpb25cclxuXHRcdFx0aWYgKF9kdXJhdGlvblVwZGF0ZU1ldGhvZCkge1xyXG5cdFx0XHRcdHZhciB2YXJuYW1lID0gXCJkdXJhdGlvblwiO1xyXG5cdFx0XHRcdGlmIChjaGFuZ2VPcHRpb24odmFybmFtZSwgX2R1cmF0aW9uVXBkYXRlTWV0aG9kLmNhbGwoU2NlbmUpKSAmJiAhc3VwcHJlc3NFdmVudHMpIHsgLy8gc2V0XHJcblx0XHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwiY2hhbmdlXCIsIHtcclxuXHRcdFx0XHRcdFx0d2hhdDogdmFybmFtZSxcclxuXHRcdFx0XHRcdFx0bmV3dmFsOiBfb3B0aW9uc1t2YXJuYW1lXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwic2hpZnRcIiwge1xyXG5cdFx0XHRcdFx0XHRyZWFzb246IHZhcm5hbWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSB0cmlnZ2VyRWxlbWVudCwgaWYgcHJlc2VudC5cclxuXHRcdCAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCAuLi5cclxuXHRcdCAqICAtIC4uLiB3aGVuIHRoZSB0cmlnZ2VyRWxlbWVudCBpcyBjaGFuZ2VkXHJcblx0XHQgKiAgLSAuLi4gd2hlbiB0aGUgc2NlbmUgaXMgYWRkZWQgdG8gYSAobmV3KSBjb250cm9sbGVyXHJcblx0XHQgKiAgLSAuLi4gaW4gcmVndWxhciBpbnRlcnZhbHMgZnJvbSB0aGUgY29udHJvbGxlciB0aHJvdWdoIHNjZW5lLnJlZnJlc2goKS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQGZpcmVzIHtAbGluayBTY2VuZS5zaGlmdH0sIGlmIHRoZSBwb3NpdGlvbiBjaGFuZ2VkXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbc3VwcHJlc3NFdmVudHM9ZmFsc2VdIC0gSWYgdHJ1ZSB0aGUgc2hpZnQgZXZlbnQgd2lsbCBiZSBzdXBwcmVzc2VkLlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHVwZGF0ZVRyaWdnZXJFbGVtZW50UG9zaXRpb24gPSBmdW5jdGlvbiAoc3VwcHJlc3NFdmVudHMpIHtcclxuXHRcdFx0dmFyXHJcblx0XHRcdGVsZW1lbnRQb3MgPSAwLFxyXG5cdFx0XHRcdHRlbGVtID0gX29wdGlvbnMudHJpZ2dlckVsZW1lbnQ7XHJcblx0XHRcdGlmIChfY29udHJvbGxlciAmJiB0ZWxlbSkge1xyXG5cdFx0XHRcdHZhclxyXG5cdFx0XHRcdGNvbnRyb2xsZXJJbmZvID0gX2NvbnRyb2xsZXIuaW5mbygpLFxyXG5cdFx0XHRcdFx0Y29udGFpbmVyT2Zmc2V0ID0gX3V0aWwuZ2V0Lm9mZnNldChjb250cm9sbGVySW5mby5jb250YWluZXIpLFxyXG5cdFx0XHRcdFx0Ly8gY29udGFpbmVyIHBvc2l0aW9uIGlzIG5lZWRlZCBiZWNhdXNlIGVsZW1lbnQgb2Zmc2V0IGlzIHJldHVybmVkIGluIHJlbGF0aW9uIHRvIGRvY3VtZW50LCBub3QgaW4gcmVsYXRpb24gdG8gY29udGFpbmVyLlxyXG5cdFx0XHRcdFx0cGFyYW0gPSBjb250cm9sbGVySW5mby52ZXJ0aWNhbCA/IFwidG9wXCIgOiBcImxlZnRcIjsgLy8gd2hpY2ggcGFyYW0gaXMgb2YgaW50ZXJlc3QgP1xyXG5cdFx0XHRcdC8vIGlmIHBhcmVudCBpcyBzcGFjZXIsIHVzZSBzcGFjZXIgcG9zaXRpb24gaW5zdGVhZCBzbyBjb3JyZWN0IHN0YXJ0IHBvc2l0aW9uIGlzIHJldHVybmVkIGZvciBwaW5uZWQgZWxlbWVudHMuXHJcblx0XHRcdFx0d2hpbGUgKHRlbGVtLnBhcmVudE5vZGUuaGFzQXR0cmlidXRlKFBJTl9TUEFDRVJfQVRUUklCVVRFKSkge1xyXG5cdFx0XHRcdFx0dGVsZW0gPSB0ZWxlbS5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGVsZW1lbnRPZmZzZXQgPSBfdXRpbC5nZXQub2Zmc2V0KHRlbGVtKTtcclxuXHJcblx0XHRcdFx0aWYgKCFjb250cm9sbGVySW5mby5pc0RvY3VtZW50KSB7IC8vIGNvbnRhaW5lciBpcyBub3QgdGhlIGRvY3VtZW50IHJvb3QsIHNvIHN1YnN0cmFjdCBzY3JvbGwgUG9zaXRpb24gdG8gZ2V0IGNvcnJlY3QgdHJpZ2dlciBlbGVtZW50IHBvc2l0aW9uIHJlbGF0aXZlIHRvIHNjcm9sbGNvbnRlbnRcclxuXHRcdFx0XHRcdGNvbnRhaW5lck9mZnNldFtwYXJhbV0gLT0gX2NvbnRyb2xsZXIuc2Nyb2xsUG9zKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbGVtZW50UG9zID0gZWxlbWVudE9mZnNldFtwYXJhbV0gLSBjb250YWluZXJPZmZzZXRbcGFyYW1dO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBjaGFuZ2VkID0gZWxlbWVudFBvcyAhPSBfdHJpZ2dlclBvcztcclxuXHRcdFx0X3RyaWdnZXJQb3MgPSBlbGVtZW50UG9zO1xyXG5cdFx0XHRpZiAoY2hhbmdlZCAmJiAhc3VwcHJlc3NFdmVudHMpIHtcclxuXHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwic2hpZnRcIiwge1xyXG5cdFx0XHRcdFx0cmVhc29uOiBcInRyaWdnZXJFbGVtZW50UG9zaXRpb25cIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVHJpZ2dlciBhIHNoaWZ0IGV2ZW50LCB3aGVuIHRoZSBjb250YWluZXIgaXMgcmVzaXplZCBhbmQgdGhlIHRyaWdnZXJIb29rIGlzID4gMS5cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciBvbkNvbnRhaW5lclJlc2l6ZSA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGlmIChfb3B0aW9ucy50cmlnZ2VySG9vayA+IDApIHtcclxuXHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwic2hpZnRcIiwge1xyXG5cdFx0XHRcdFx0cmVhc29uOiBcImNvbnRhaW5lclJlc2l6ZVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF92YWxpZGF0ZSA9IF91dGlsLmV4dGVuZChTQ0VORV9PUFRJT05TLnZhbGlkYXRlLCB7XHJcblx0XHRcdC8vIHZhbGlkYXRpb24gZm9yIGR1cmF0aW9uIGhhbmRsZWQgaW50ZXJuYWxseSBmb3IgcmVmZXJlbmNlIHRvIHByaXZhdGUgdmFyIF9kdXJhdGlvbk1ldGhvZFxyXG5cdFx0XHRkdXJhdGlvbjogZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHRcdGlmIChfdXRpbC50eXBlLlN0cmluZyh2YWwpICYmIHZhbC5tYXRjaCgvXihcXC58XFxkKSpcXGQrJSQvKSkge1xyXG5cdFx0XHRcdFx0Ly8gcGVyY2VudGFnZSB2YWx1ZVxyXG5cdFx0XHRcdFx0dmFyIHBlcmMgPSBwYXJzZUZsb2F0KHZhbCkgLyAxMDA7XHJcblx0XHRcdFx0XHR2YWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBfY29udHJvbGxlciA/IF9jb250cm9sbGVyLmluZm8oXCJzaXplXCIpICogcGVyYyA6IDA7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoX3V0aWwudHlwZS5GdW5jdGlvbih2YWwpKSB7XHJcblx0XHRcdFx0XHQvLyBmdW5jdGlvblxyXG5cdFx0XHRcdFx0X2R1cmF0aW9uVXBkYXRlTWV0aG9kID0gdmFsO1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0dmFsID0gcGFyc2VGbG9hdChfZHVyYXRpb25VcGRhdGVNZXRob2QoKSk7XHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRcdHZhbCA9IC0xOyAvLyB3aWxsIGNhdXNlIGVycm9yIGJlbG93XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIHZhbCBoYXMgdG8gYmUgZmxvYXRcclxuXHRcdFx0XHR2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XHJcblx0XHRcdFx0aWYgKCFfdXRpbC50eXBlLk51bWJlcih2YWwpIHx8IHZhbCA8IDApIHtcclxuXHRcdFx0XHRcdGlmIChfZHVyYXRpb25VcGRhdGVNZXRob2QpIHtcclxuXHRcdFx0XHRcdFx0X2R1cmF0aW9uVXBkYXRlTWV0aG9kID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBbXCJJbnZhbGlkIHJldHVybiB2YWx1ZSBvZiBzdXBwbGllZCBmdW5jdGlvbiBmb3Igb3B0aW9uIFxcXCJkdXJhdGlvblxcXCI6XCIsIHZhbF07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBbXCJJbnZhbGlkIHZhbHVlIGZvciBvcHRpb24gXFxcImR1cmF0aW9uXFxcIjpcIiwgdmFsXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDaGVja3MgdGhlIHZhbGlkaXR5IG9mIGEgc3BlY2lmaWMgb3IgYWxsIG9wdGlvbnMgYW5kIHJlc2V0IHRvIGRlZmF1bHQgaWYgbmVjY2Vzc2FyeS5cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciB2YWxpZGF0ZU9wdGlvbiA9IGZ1bmN0aW9uIChjaGVjaykge1xyXG5cdFx0XHRjaGVjayA9IGFyZ3VtZW50cy5sZW5ndGggPyBbY2hlY2tdIDogT2JqZWN0LmtleXMoX3ZhbGlkYXRlKTtcclxuXHRcdFx0Y2hlY2suZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uTmFtZSwga2V5KSB7XHJcblx0XHRcdFx0dmFyIHZhbHVlO1xyXG5cdFx0XHRcdGlmIChfdmFsaWRhdGVbb3B0aW9uTmFtZV0pIHsgLy8gdGhlcmUgaXMgYSB2YWxpZGF0aW9uIG1ldGhvZCBmb3IgdGhpcyBvcHRpb25cclxuXHRcdFx0XHRcdHRyeSB7IC8vIHZhbGlkYXRlIHZhbHVlXHJcblx0XHRcdFx0XHRcdHZhbHVlID0gX3ZhbGlkYXRlW29wdGlvbk5hbWVdKF9vcHRpb25zW29wdGlvbk5hbWVdKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHsgLy8gdmFsaWRhdGlvbiBmYWlsZWQgLT4gcmVzZXQgdG8gZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IERFRkFVTFRfT1BUSU9OU1tvcHRpb25OYW1lXTtcclxuXHRcdFx0XHRcdFx0dmFyIGxvZ01TRyA9IF91dGlsLnR5cGUuU3RyaW5nKGUpID8gW2VdIDogZTtcclxuXHRcdFx0XHRcdFx0aWYgKF91dGlsLnR5cGUuQXJyYXkobG9nTVNHKSkge1xyXG5cdFx0XHRcdFx0XHRcdGxvZ01TR1swXSA9IFwiRVJST1I6IFwiICsgbG9nTVNHWzBdO1xyXG5cdFx0XHRcdFx0XHRcdGxvZ01TRy51bnNoaWZ0KDEpOyAvLyBsb2dsZXZlbCAxIGZvciBlcnJvciBtc2dcclxuXHRcdFx0XHRcdFx0XHRsb2cuYXBwbHkodGhpcywgbG9nTVNHKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRsb2coMSwgXCJFUlJPUjogUHJvYmxlbSBleGVjdXRpbmcgdmFsaWRhdGlvbiBjYWxsYmFjayBmb3Igb3B0aW9uICdcIiArIG9wdGlvbk5hbWUgKyBcIic6XCIsIGUubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZmluYWxseSB7XHJcblx0XHRcdFx0XHRcdF9vcHRpb25zW29wdGlvbk5hbWVdID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBIZWxwZXIgdXNlZCBieSB0aGUgc2V0dGVyL2dldHRlcnMgZm9yIHNjZW5lIG9wdGlvbnNcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdHZhciBjaGFuZ2VPcHRpb24gPSBmdW5jdGlvbiAodmFybmFtZSwgbmV3dmFsKSB7XHJcblx0XHRcdHZhclxyXG5cdFx0XHRjaGFuZ2VkID0gZmFsc2UsXHJcblx0XHRcdFx0b2xkdmFsID0gX29wdGlvbnNbdmFybmFtZV07XHJcblx0XHRcdGlmIChfb3B0aW9uc1t2YXJuYW1lXSAhPSBuZXd2YWwpIHtcclxuXHRcdFx0XHRfb3B0aW9uc1t2YXJuYW1lXSA9IG5ld3ZhbDtcclxuXHRcdFx0XHR2YWxpZGF0ZU9wdGlvbih2YXJuYW1lKTsgLy8gcmVzZXRzIHRvIGRlZmF1bHQgaWYgbmVjZXNzYXJ5XHJcblx0XHRcdFx0Y2hhbmdlZCA9IG9sZHZhbCAhPSBfb3B0aW9uc1t2YXJuYW1lXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gZ2VuZXJhdGUgZ2V0dGVycy9zZXR0ZXJzIGZvciBhbGwgb3B0aW9uc1xyXG5cdFx0dmFyIGFkZFNjZW5lT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbk5hbWUpIHtcclxuXHRcdFx0aWYgKCFTY2VuZVtvcHRpb25OYW1lXSkge1xyXG5cdFx0XHRcdFNjZW5lW29wdGlvbk5hbWVdID0gZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG5cdFx0XHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7IC8vIGdldFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX29wdGlvbnNbb3B0aW9uTmFtZV07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAob3B0aW9uTmFtZSA9PT0gXCJkdXJhdGlvblwiKSB7IC8vIG5ldyBkdXJhdGlvbiBpcyBzZXQsIHNvIGFueSBwcmV2aW91c2x5IHNldCBmdW5jdGlvbiBtdXN0IGJlIHVuc2V0XHJcblx0XHRcdFx0XHRcdFx0X2R1cmF0aW9uVXBkYXRlTWV0aG9kID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2VPcHRpb24ob3B0aW9uTmFtZSwgbmV3VmFsKSkgeyAvLyBzZXRcclxuXHRcdFx0XHRcdFx0XHRTY2VuZS50cmlnZ2VyKFwiY2hhbmdlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdoYXQ6IG9wdGlvbk5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRuZXd2YWw6IF9vcHRpb25zW29wdGlvbk5hbWVdXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKFNDRU5FX09QVElPTlMuc2hpZnRzLmluZGV4T2Yob3B0aW9uTmFtZSkgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0U2NlbmUudHJpZ2dlcihcInNoaWZ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVhc29uOiBvcHRpb25OYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBTY2VuZTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogKipHZXQqKiBvciAqKlNldCoqIHRoZSBkdXJhdGlvbiBvcHRpb24gdmFsdWUuXHJcblx0XHQgKiBBcyBhIHNldHRlciBpdCBhbHNvIGFjY2VwdHMgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBudW1lcmljIHZhbHVlLiAgXHJcblx0XHQgKiBUaGlzIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHJlc3BvbnNpdmUgc2V0dXBzLlxyXG5cdFx0ICpcclxuXHRcdCAqIFRoZSBkdXJhdGlvbiBpcyB1cGRhdGVkIHVzaW5nIHRoZSBzdXBwbGllZCBmdW5jdGlvbiBldmVyeSB0aW1lIGBTY2VuZS5yZWZyZXNoKClgIGlzIGNhbGxlZCwgd2hpY2ggaGFwcGVucyBwZXJpb2RpY2FsbHkgZnJvbSB0aGUgY29udHJvbGxlciAoc2VlIFNjcm9sbE1hZ2ljLkNvbnRyb2xsZXIgb3B0aW9uIGByZWZyZXNoSW50ZXJ2YWxgKS4gIFxyXG5cdFx0ICogXyoqTk9URToqKiBCZSBhd2FyZSB0aGF0IGl0J3MgYW4gZWFzeSB3YXkgdG8ga2lsbCBwZXJmb3JtYW5jZSwgaWYgeW91IHN1cHBseSBhIGZ1bmN0aW9uIHRoYXQgaGFzIGhpZ2ggQ1BVIGRlbWFuZC4gIFxyXG5cdFx0ICogRXZlbiBmb3Igc2l6ZSBhbmQgcG9zaXRpb24gY2FsY3VsYXRpb25zIGl0IGlzIHJlY29tbWVuZGVkIHRvIHVzZSBhIHZhcmlhYmxlIHRvIGNhY2hlIHRoZSB2YWx1ZS4gKHNlZSBleGFtcGxlKSAgXHJcblx0XHQgKiBUaGlzIGNvdW50cyBkb3VibGUgaWYgeW91IHVzZSB0aGUgc2FtZSBmdW5jdGlvbiBmb3IgbXVsdGlwbGUgc2NlbmVzLl9cclxuXHRcdCAqXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI2R1cmF0aW9uXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gZ2V0IHRoZSBjdXJyZW50IGR1cmF0aW9uIHZhbHVlXHJcblx0XHQgKiB2YXIgZHVyYXRpb24gPSBzY2VuZS5kdXJhdGlvbigpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNldCBhIG5ldyBkdXJhdGlvblxyXG5cdFx0ICogc2NlbmUuZHVyYXRpb24oMzAwKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyB1c2UgYSBmdW5jdGlvbiB0byBhdXRvbWF0aWNhbGx5IGFkanVzdCB0aGUgZHVyYXRpb24gdG8gdGhlIHdpbmRvdyBoZWlnaHQuXHJcblx0XHQgKiB2YXIgZHVyYXRpb25WYWx1ZUNhY2hlO1xyXG5cdFx0ICogZnVuY3Rpb24gZ2V0RHVyYXRpb24gKCkge1xyXG5cdFx0ICogICByZXR1cm4gZHVyYXRpb25WYWx1ZUNhY2hlO1xyXG5cdFx0ICogfVxyXG5cdFx0ICogZnVuY3Rpb24gdXBkYXRlRHVyYXRpb24gKGUpIHtcclxuXHRcdCAqICAgZHVyYXRpb25WYWx1ZUNhY2hlID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cdFx0ICogfVxyXG5cdFx0ICogJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIHVwZGF0ZUR1cmF0aW9uKTsgLy8gdXBkYXRlIHRoZSBkdXJhdGlvbiB3aGVuIHRoZSB3aW5kb3cgc2l6ZSBjaGFuZ2VzXHJcblx0XHQgKiAkKHdpbmRvdykudHJpZ2dlckhhbmRsZXIoXCJyZXNpemVcIik7IC8vIHNldCB0byBpbml0aWFsIHZhbHVlXHJcblx0XHQgKiBzY2VuZS5kdXJhdGlvbihnZXREdXJhdGlvbik7IC8vIHN1cHBseSBkdXJhdGlvbiBtZXRob2RcclxuXHRcdCAqXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLmNoYW5nZX0sIHdoZW4gdXNlZCBhcyBzZXR0ZXJcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuc2hpZnR9LCB3aGVuIHVzZWQgYXMgc2V0dGVyXHJcblx0XHQgKiBAcGFyYW0geyhudW1iZXJ8ZnVuY3Rpb24pfSBbbmV3RHVyYXRpb25dIC0gVGhlIG5ldyBkdXJhdGlvbiBvZiB0aGUgc2NlbmUuXHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfSBgZ2V0YCAtICBDdXJyZW50IHNjZW5lIGR1cmF0aW9uLlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBgc2V0YCAtICBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogKipHZXQqKiBvciAqKlNldCoqIHRoZSBvZmZzZXQgb3B0aW9uIHZhbHVlLlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSNvZmZzZXRcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyBnZXQgdGhlIGN1cnJlbnQgb2Zmc2V0XHJcblx0XHQgKiB2YXIgb2Zmc2V0ID0gc2NlbmUub2Zmc2V0KCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gc2V0IGEgbmV3IG9mZnNldFxyXG5cdFx0ICogc2NlbmUub2Zmc2V0KDEwMCk7XHJcblx0XHQgKlxyXG5cdFx0ICogQGZpcmVzIHtAbGluayBTY2VuZS5jaGFuZ2V9LCB3aGVuIHVzZWQgYXMgc2V0dGVyXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLnNoaWZ0fSwgd2hlbiB1c2VkIGFzIHNldHRlclxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IFtuZXdPZmZzZXRdIC0gVGhlIG5ldyBvZmZzZXQgb2YgdGhlIHNjZW5lLlxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gYGdldGAgLSAgQ3VycmVudCBzY2VuZSBvZmZzZXQuXHJcblx0XHQgKiBAcmV0dXJucyB7U2NlbmV9IGBzZXRgIC0gIFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAqKkdldCoqIG9yICoqU2V0KiogdGhlIHRyaWdnZXJFbGVtZW50IG9wdGlvbiB2YWx1ZS5cclxuXHRcdCAqIERvZXMgKipub3QqKiBmaXJlIGBTY2VuZS5zaGlmdGAsIGJlY2F1c2UgY2hhbmdpbmcgdGhlIHRyaWdnZXIgRWxlbWVudCBkb2Vzbid0IG5lY2Vzc2FyaWx5IG1lYW4gdGhlIHN0YXJ0IHBvc2l0aW9uIGNoYW5nZXMuIFRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGluIGBTY2VuZS5yZWZyZXNoKClgLCB3aGljaCBpcyBhdXRvbWF0aWNhbGx5IHRyaWdnZXJlZC5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjdHJpZ2dlckVsZW1lbnRcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyBnZXQgdGhlIGN1cnJlbnQgdHJpZ2dlckVsZW1lbnRcclxuXHRcdCAqIHZhciB0cmlnZ2VyRWxlbWVudCA9IHNjZW5lLnRyaWdnZXJFbGVtZW50KCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gc2V0IGEgbmV3IHRyaWdnZXJFbGVtZW50IHVzaW5nIGEgc2VsZWN0b3JcclxuXHRcdCAqIHNjZW5lLnRyaWdnZXJFbGVtZW50KFwiI3RyaWdnZXJcIik7XHJcblx0XHQgKiAvLyBzZXQgYSBuZXcgdHJpZ2dlckVsZW1lbnQgdXNpbmcgYSBET00gb2JqZWN0XHJcblx0XHQgKiBzY2VuZS50cmlnZ2VyRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWdnZXJcIikpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuY2hhbmdlfSwgd2hlbiB1c2VkIGFzIHNldHRlclxyXG5cdFx0ICogQHBhcmFtIHsoc3RyaW5nfG9iamVjdCl9IFtuZXdUcmlnZ2VyRWxlbWVudF0gLSBUaGUgbmV3IHRyaWdnZXIgZWxlbWVudCBmb3IgdGhlIHNjZW5lLlxyXG5cdFx0ICogQHJldHVybnMgeyhzdHJpbmd8b2JqZWN0KX0gYGdldGAgLSAgQ3VycmVudCB0cmlnZ2VyRWxlbWVudC5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gYHNldGAgLSAgUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgdHJpZ2dlckhvb2sgb3B0aW9uIHZhbHVlLlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSN0cmlnZ2VySG9va1xyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCB0cmlnZ2VySG9vayB2YWx1ZVxyXG5cdFx0ICogdmFyIHRyaWdnZXJIb29rID0gc2NlbmUudHJpZ2dlckhvb2soKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyBzZXQgYSBuZXcgdHJpZ2dlckhvb2sgdXNpbmcgYSBzdHJpbmdcclxuXHRcdCAqIHNjZW5lLnRyaWdnZXJIb29rKFwib25MZWF2ZVwiKTtcclxuXHRcdCAqIC8vIHNldCBhIG5ldyB0cmlnZ2VySG9vayB1c2luZyBhIG51bWJlclxyXG5cdFx0ICogc2NlbmUudHJpZ2dlckhvb2soMC43KTtcclxuXHRcdCAqXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLmNoYW5nZX0sIHdoZW4gdXNlZCBhcyBzZXR0ZXJcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuc2hpZnR9LCB3aGVuIHVzZWQgYXMgc2V0dGVyXHJcblx0XHQgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gW25ld1RyaWdnZXJIb29rXSAtIFRoZSBuZXcgdHJpZ2dlckhvb2sgb2YgdGhlIHNjZW5lLiBTZWUge0BsaW5rIFNjZW5lfSBwYXJhbWV0ZXIgZGVzY3JpcHRpb24gZm9yIHZhbHVlIG9wdGlvbnMuXHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfSBgZ2V0YCAtICBDdXJyZW50IHRyaWdnZXJIb29rIChBTFdBWVMgbnVtZXJpY2FsKS5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gYHNldGAgLSAgUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgcmV2ZXJzZSBvcHRpb24gdmFsdWUuXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI3JldmVyc2VcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyBnZXQgdGhlIGN1cnJlbnQgcmV2ZXJzZSBvcHRpb25cclxuXHRcdCAqIHZhciByZXZlcnNlID0gc2NlbmUucmV2ZXJzZSgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHNldCBuZXcgcmV2ZXJzZSBvcHRpb25cclxuXHRcdCAqIHNjZW5lLnJldmVyc2UoZmFsc2UpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBmaXJlcyB7QGxpbmsgU2NlbmUuY2hhbmdlfSwgd2hlbiB1c2VkIGFzIHNldHRlclxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbbmV3UmV2ZXJzZV0gLSBUaGUgbmV3IHJldmVyc2Ugc2V0dGluZyBvZiB0aGUgc2NlbmUuXHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYGdldGAgLSAgQ3VycmVudCByZXZlcnNlIG9wdGlvbiB2YWx1ZS5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gYHNldGAgLSAgUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0Kiogb3IgKipTZXQqKiB0aGUgbG9nbGV2ZWwgb3B0aW9uIHZhbHVlLlxyXG5cdFx0ICogQG1ldGhvZCBTY3JvbGxNYWdpYy5TY2VuZSNsb2dsZXZlbFxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY3VycmVudCBsb2dsZXZlbFxyXG5cdFx0ICogdmFyIGxvZ2xldmVsID0gc2NlbmUubG9nbGV2ZWwoKTtcclxuXHRcdCAqXHJcblx0XHQgKiAvLyBzZXQgbmV3IGxvZ2xldmVsXHJcblx0XHQgKiBzY2VuZS5sb2dsZXZlbCgzKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAZmlyZXMge0BsaW5rIFNjZW5lLmNoYW5nZX0sIHdoZW4gdXNlZCBhcyBzZXR0ZXJcclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbbmV3TG9nbGV2ZWxdIC0gVGhlIG5ldyBsb2dsZXZlbCBzZXR0aW5nIG9mIHRoZSBzY2VuZS4gYFswLTNdYFxyXG5cdFx0ICogQHJldHVybnMge251bWJlcn0gYGdldGAgLSAgQ3VycmVudCBsb2dsZXZlbC5cclxuXHRcdCAqIEByZXR1cm5zIHtTY2VuZX0gYHNldGAgLSAgUGFyZW50IG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqICoqR2V0KiogdGhlIGFzc29jaWF0ZWQgY29udHJvbGxlci5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjY29udHJvbGxlclxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIGdldCB0aGUgY29udHJvbGxlciBvZiBhIHNjZW5lXHJcblx0XHQgKiB2YXIgY29udHJvbGxlciA9IHNjZW5lLmNvbnRyb2xsZXIoKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7U2Nyb2xsTWFnaWMuQ29udHJvbGxlcn0gUGFyZW50IGNvbnRyb2xsZXIgb3IgYHVuZGVmaW5lZGBcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5jb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gX2NvbnRyb2xsZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogKipHZXQqKiB0aGUgY3VycmVudCBzdGF0ZS5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjc3RhdGVcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyBnZXQgdGhlIGN1cnJlbnQgc3RhdGVcclxuXHRcdCAqIHZhciBzdGF0ZSA9IHNjZW5lLnN0YXRlKCk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gYFwiQkVGT1JFXCJgLCBgXCJEVVJJTkdcImAgb3IgYFwiQUZURVJcImBcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIF9zdGF0ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAqKkdldCoqIHRoZSBjdXJyZW50IHNjcm9sbCBvZmZzZXQgZm9yIHRoZSBzdGFydCBvZiB0aGUgc2NlbmUuICBcclxuXHRcdCAqIE1pbmQsIHRoYXQgdGhlIHNjcm9sbE9mZnNldCBpcyByZWxhdGVkIHRvIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIsIGlmIGB0cmlnZ2VySG9va2AgaXMgYmlnZ2VyIHRoYW4gYDBgIChvciBgXCJvbkxlYXZlXCJgKS4gIFxyXG5cdFx0ICogVGhpcyBtZWFucywgdGhhdCByZXNpemluZyB0aGUgY29udGFpbmVyIG9yIGNoYW5naW5nIHRoZSBgdHJpZ2dlckhvb2tgIHdpbGwgaW5mbHVlbmNlIHRoZSBzY2VuZSdzIHN0YXJ0IG9mZnNldC5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjc2Nyb2xsT2Zmc2V0XHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gZ2V0IHRoZSBjdXJyZW50IHNjcm9sbCBvZmZzZXQgZm9yIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzY2VuZS5cclxuXHRcdCAqIHZhciBzdGFydCA9IHNjZW5lLnNjcm9sbE9mZnNldCgpO1xyXG5cdFx0ICogdmFyIGVuZCA9IHNjZW5lLnNjcm9sbE9mZnNldCgpICsgc2NlbmUuZHVyYXRpb24oKTtcclxuXHRcdCAqIGNvbnNvbGUubG9nKFwidGhlIHNjZW5lIHN0YXJ0cyBhdFwiLCBzdGFydCwgXCJhbmQgZW5kcyBhdFwiLCBlbmQpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzY3JvbGwgb2Zmc2V0IChvZiB0aGUgY29udGFpbmVyKSBhdCB3aGljaCB0aGUgc2NlbmUgd2lsbCB0cmlnZ2VyLiBZIHZhbHVlIGZvciB2ZXJ0aWNhbCBhbmQgWCB2YWx1ZSBmb3IgaG9yaXpvbnRhbCBzY3JvbGxzLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnNjcm9sbE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIF9zY3JvbGxPZmZzZXQuc3RhcnQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogKipHZXQqKiB0aGUgdHJpZ2dlciBwb3NpdGlvbiBvZiB0aGUgc2NlbmUgKGluY2x1ZGluZyB0aGUgdmFsdWUgb2YgdGhlIGBvZmZzZXRgIG9wdGlvbikuICBcclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjdHJpZ2dlclBvc2l0aW9uXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gZ2V0IHRoZSBzY2VuZSdzIHRyaWdnZXIgcG9zaXRpb25cclxuXHRcdCAqIHZhciB0cmlnZ2VyUG9zaXRpb24gPSBzY2VuZS50cmlnZ2VyUG9zaXRpb24oKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfSBTdGFydCBwb3NpdGlvbiBvZiB0aGUgc2NlbmUuIFRvcCBwb3NpdGlvbiB2YWx1ZSBmb3IgdmVydGljYWwgYW5kIGxlZnQgcG9zaXRpb24gdmFsdWUgZm9yIGhvcml6b250YWwgc2Nyb2xscy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy50cmlnZ2VyUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBwb3MgPSBfb3B0aW9ucy5vZmZzZXQ7IC8vIHRoZSBvZmZzZXQgaXMgdGhlIGJhc2lzXHJcblx0XHRcdGlmIChfY29udHJvbGxlcikge1xyXG5cdFx0XHRcdC8vIGdldCB0aGUgdHJpZ2dlciBwb3NpdGlvblxyXG5cdFx0XHRcdGlmIChfb3B0aW9ucy50cmlnZ2VyRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBhcyB0cmlnZ2VyXHJcblx0XHRcdFx0XHRwb3MgKz0gX3RyaWdnZXJQb3M7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHJldHVybiB0aGUgaGVpZ2h0IG9mIHRoZSB0cmlnZ2VySG9vayB0byBzdGFydCBhdCB0aGUgYmVnaW5uaW5nXHJcblx0XHRcdFx0XHRwb3MgKz0gX2NvbnRyb2xsZXIuaW5mbyhcInNpemVcIikgKiBTY2VuZS50cmlnZ2VySG9vaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcG9zO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXJcclxuXHRcdF9waW4sIF9waW5PcHRpb25zO1xyXG5cclxuXHRcdFNjZW5lLm9uKFwic2hpZnQuaW50ZXJuYWxcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIGR1cmF0aW9uQ2hhbmdlZCA9IGUucmVhc29uID09PSBcImR1cmF0aW9uXCI7XHJcblx0XHRcdGlmICgoX3N0YXRlID09PSBTQ0VORV9TVEFURV9BRlRFUiAmJiBkdXJhdGlvbkNoYW5nZWQpIHx8IChfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0RVUklORyAmJiBfb3B0aW9ucy5kdXJhdGlvbiA9PT0gMCkpIHtcclxuXHRcdFx0XHQvLyBpZiBbZHVyYXRpb24gY2hhbmdlZCBhZnRlciBhIHNjZW5lIChpbnNpZGUgc2NlbmUgcHJvZ3Jlc3MgdXBkYXRlcyBwaW4gcG9zaXRpb24pXSBvciBbZHVyYXRpb24gaXMgMCwgd2UgYXJlIGluIHBpbiBwaGFzZSBhbmQgc29tZSBvdGhlciB2YWx1ZSBjaGFuZ2VkXS5cclxuXHRcdFx0XHR1cGRhdGVQaW5TdGF0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChkdXJhdGlvbkNoYW5nZWQpIHtcclxuXHRcdFx0XHR1cGRhdGVQaW5EaW1lbnNpb25zKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pLm9uKFwicHJvZ3Jlc3MuaW50ZXJuYWxcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dXBkYXRlUGluU3RhdGUoKTtcclxuXHRcdH0pLm9uKFwiYWRkLmludGVybmFsXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdHVwZGF0ZVBpbkRpbWVuc2lvbnMoKTtcclxuXHRcdH0pLm9uKFwiZGVzdHJveS5pbnRlcm5hbFwiLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRTY2VuZS5yZW1vdmVQaW4oZS5yZXNldCk7XHJcblx0XHR9KTtcclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlIHRoZSBwaW4gc3RhdGUuXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHR2YXIgdXBkYXRlUGluU3RhdGUgPSBmdW5jdGlvbiAoZm9yY2VVbnBpbikge1xyXG5cdFx0XHRpZiAoX3BpbiAmJiBfY29udHJvbGxlcikge1xyXG5cdFx0XHRcdHZhclxyXG5cdFx0XHRcdGNvbnRhaW5lckluZm8gPSBfY29udHJvbGxlci5pbmZvKCksXHJcblx0XHRcdFx0XHRwaW5UYXJnZXQgPSBfcGluT3B0aW9ucy5zcGFjZXIuZmlyc3RDaGlsZDsgLy8gbWF5IGJlIHBpbiBlbGVtZW50IG9yIGFub3RoZXIgc3BhY2VyLCBpZiBjYXNjYWRpbmcgcGluc1xyXG5cdFx0XHRcdGlmICghZm9yY2VVbnBpbiAmJiBfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0RVUklORykgeyAvLyBkdXJpbmcgc2NlbmUgb3IgaWYgZHVyYXRpb24gaXMgMCBhbmQgd2UgYXJlIHBhc3QgdGhlIHRyaWdnZXJcclxuXHRcdFx0XHRcdC8vIHBpbm5lZCBzdGF0ZVxyXG5cdFx0XHRcdFx0aWYgKF91dGlsLmNzcyhwaW5UYXJnZXQsIFwicG9zaXRpb25cIikgIT0gXCJmaXhlZFwiKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNoYW5nZSBzdGF0ZSBiZWZvcmUgdXBkYXRpbmcgcGluIHNwYWNlciAocG9zaXRpb24gY2hhbmdlcyBkdWUgdG8gZml4ZWQgY29sbGFwc2luZyBtaWdodCBvY2N1ci4pXHJcblx0XHRcdFx0XHRcdF91dGlsLmNzcyhwaW5UYXJnZXQsIHtcclxuXHRcdFx0XHRcdFx0XHRcInBvc2l0aW9uXCI6IFwiZml4ZWRcIlxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIHBpbiBzcGFjZXJcclxuXHRcdFx0XHRcdFx0dXBkYXRlUGluRGltZW5zaW9ucygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0Zml4ZWRQb3MgPSBfdXRpbC5nZXQub2Zmc2V0KF9waW5PcHRpb25zLnNwYWNlciwgdHJ1ZSksXHJcblx0XHRcdFx0XHRcdC8vIGdldCB2aWV3cG9ydCBwb3NpdGlvbiBvZiBzcGFjZXJcclxuXHRcdFx0XHRcdFx0c2Nyb2xsRGlzdGFuY2UgPSBfb3B0aW9ucy5yZXZlcnNlIHx8IF9vcHRpb25zLmR1cmF0aW9uID09PSAwID8gY29udGFpbmVySW5mby5zY3JvbGxQb3MgLSBfc2Nyb2xsT2Zmc2V0LnN0YXJ0IC8vIHF1aWNrZXJcclxuXHRcdFx0XHRcdFx0OiBNYXRoLnJvdW5kKF9wcm9ncmVzcyAqIF9vcHRpb25zLmR1cmF0aW9uICogMTApIC8gMTA7IC8vIGlmIG5vIHJldmVyc2UgYW5kIGR1cmluZyBwaW4gdGhlIHBvc2l0aW9uIG5lZWRzIHRvIGJlIHJlY2FsY3VsYXRlZCB1c2luZyB0aGUgcHJvZ3Jlc3NcclxuXHRcdFx0XHRcdC8vIGFkZCBzY3JvbGxEaXN0YW5jZVxyXG5cdFx0XHRcdFx0Zml4ZWRQb3NbY29udGFpbmVySW5mby52ZXJ0aWNhbCA/IFwidG9wXCIgOiBcImxlZnRcIl0gKz0gc2Nyb2xsRGlzdGFuY2U7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc2V0IG5ldyB2YWx1ZXNcclxuXHRcdFx0XHRcdF91dGlsLmNzcyhfcGluT3B0aW9ucy5zcGFjZXIuZmlyc3RDaGlsZCwge1xyXG5cdFx0XHRcdFx0XHR0b3A6IGZpeGVkUG9zLnRvcCxcclxuXHRcdFx0XHRcdFx0bGVmdDogZml4ZWRQb3MubGVmdFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHVucGlubmVkIHN0YXRlXHJcblx0XHRcdFx0XHR2YXJcclxuXHRcdFx0XHRcdG5ld0NTUyA9IHtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IF9waW5PcHRpb25zLmluRmxvdyA/IFwicmVsYXRpdmVcIiA6IFwiYWJzb2x1dGVcIixcclxuXHRcdFx0XHRcdFx0dG9wOiAwLFxyXG5cdFx0XHRcdFx0XHRsZWZ0OiAwXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRjaGFuZ2UgPSBfdXRpbC5jc3MocGluVGFyZ2V0LCBcInBvc2l0aW9uXCIpICE9IG5ld0NTUy5wb3NpdGlvbjtcclxuXHJcblx0XHRcdFx0XHRpZiAoIV9waW5PcHRpb25zLnB1c2hGb2xsb3dlcnMpIHtcclxuXHRcdFx0XHRcdFx0bmV3Q1NTW2NvbnRhaW5lckluZm8udmVydGljYWwgPyBcInRvcFwiIDogXCJsZWZ0XCJdID0gX29wdGlvbnMuZHVyYXRpb24gKiBfcHJvZ3Jlc3M7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKF9vcHRpb25zLmR1cmF0aW9uID4gMCkgeyAvLyBvbmx5IGNvbmNlcm5zIHNjZW5lcyB3aXRoIGR1cmF0aW9uXHJcblx0XHRcdFx0XHRcdGlmIChfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0FGVEVSICYmIHBhcnNlRmxvYXQoX3V0aWwuY3NzKF9waW5PcHRpb25zLnNwYWNlciwgXCJwYWRkaW5nLXRvcFwiKSkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFuZ2UgPSB0cnVlOyAvLyBpZiBpbiBhZnRlciBzdGF0ZSBidXQgaGF2ZW50IHVwZGF0ZWQgc3BhY2VyIHlldCAoanVtcGVkIHBhc3QgcGluKVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKF9zdGF0ZSA9PT0gU0NFTkVfU1RBVEVfQkVGT1JFICYmIHBhcnNlRmxvYXQoX3V0aWwuY3NzKF9waW5PcHRpb25zLnNwYWNlciwgXCJwYWRkaW5nLWJvdHRvbVwiKSkgPT09IDApIHsgLy8gYmVmb3JlXHJcblx0XHRcdFx0XHRcdFx0Y2hhbmdlID0gdHJ1ZTsgLy8ganVtcGVkIHBhc3QgZml4ZWQgc3RhdGUgdXB3YXJkIGRpcmVjdGlvblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBzZXQgbmV3IHZhbHVlc1xyXG5cdFx0XHRcdFx0X3V0aWwuY3NzKHBpblRhcmdldCwgbmV3Q1NTKTtcclxuXHRcdFx0XHRcdGlmIChjaGFuZ2UpIHtcclxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIHBpbiBzcGFjZXIgaWYgc3RhdGUgY2hhbmdlZFxyXG5cdFx0XHRcdFx0XHR1cGRhdGVQaW5EaW1lbnNpb25zKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlIHRoZSBwaW4gc3BhY2VyIGFuZC9vciBlbGVtZW50IHNpemUuXHJcblx0XHQgKiBUaGUgc2l6ZSBvZiB0aGUgc3BhY2VyIG5lZWRzIHRvIGJlIHVwZGF0ZWQgd2hlbmV2ZXIgdGhlIGR1cmF0aW9uIG9mIHRoZSBzY2VuZSBjaGFuZ2VzLCBpZiBpdCBpcyB0byBwdXNoIGRvd24gZm9sbG93aW5nIGVsZW1lbnRzLlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHVwZGF0ZVBpbkRpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmIChfcGluICYmIF9jb250cm9sbGVyICYmIF9waW5PcHRpb25zLmluRmxvdykgeyAvLyBubyBzcGFjZXJyZXNpemUsIGlmIG9yaWdpbmFsIHBvc2l0aW9uIGlzIGFic29sdXRlXHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0YWZ0ZXIgPSAoX3N0YXRlID09PSBTQ0VORV9TVEFURV9BRlRFUiksXHJcblx0XHRcdFx0XHRiZWZvcmUgPSAoX3N0YXRlID09PSBTQ0VORV9TVEFURV9CRUZPUkUpLFxyXG5cdFx0XHRcdFx0ZHVyaW5nID0gKF9zdGF0ZSA9PT0gU0NFTkVfU1RBVEVfRFVSSU5HKSxcclxuXHRcdFx0XHRcdHZlcnRpY2FsID0gX2NvbnRyb2xsZXIuaW5mbyhcInZlcnRpY2FsXCIpLFxyXG5cdFx0XHRcdFx0cGluVGFyZ2V0ID0gX3Bpbk9wdGlvbnMuc3BhY2VyLmZpcnN0Q2hpbGQsXHJcblx0XHRcdFx0XHQvLyB1c3VhbGx5IHRoZSBwaW5lZCBlbGVtZW50IGJ1dCBjYW4gYWxzbyBiZSBhbm90aGVyIHNwYWNlciAoY2FzY2FkZWQgcGlucylcclxuXHRcdFx0XHRcdG1hcmdpbkNvbGxhcHNlID0gX3V0aWwuaXNNYXJnaW5Db2xsYXBzZVR5cGUoX3V0aWwuY3NzKF9waW5PcHRpb25zLnNwYWNlciwgXCJkaXNwbGF5XCIpKSxcclxuXHRcdFx0XHRcdGNzcyA9IHt9O1xyXG5cclxuXHRcdFx0XHQvLyBzZXQgbmV3IHNpemVcclxuXHRcdFx0XHQvLyBpZiByZWxzaXplOiBzcGFjZXIgLT4gcGluIHwgZWxzZTogcGluIC0+IHNwYWNlclxyXG5cdFx0XHRcdGlmIChfcGluT3B0aW9ucy5yZWxTaXplLndpZHRoIHx8IF9waW5PcHRpb25zLnJlbFNpemUuYXV0b0Z1bGxXaWR0aCkge1xyXG5cdFx0XHRcdFx0aWYgKGR1cmluZykge1xyXG5cdFx0XHRcdFx0XHRfdXRpbC5jc3MoX3Bpbiwge1xyXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogX3V0aWwuZ2V0LndpZHRoKF9waW5PcHRpb25zLnNwYWNlcilcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdXRpbC5jc3MoX3Bpbiwge1xyXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogXCIxMDAlXCJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIG1pbndpZHRoIGlzIG5lZWRlZCBmb3IgY2FzY2FkZWQgcGlucy5cclxuXHRcdFx0XHRcdGNzc1tcIm1pbi13aWR0aFwiXSA9IF91dGlsLmdldC53aWR0aCh2ZXJ0aWNhbCA/IF9waW4gOiBwaW5UYXJnZXQsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdFx0Y3NzLndpZHRoID0gZHVyaW5nID8gY3NzW1wibWluLXdpZHRoXCJdIDogXCJhdXRvXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChfcGluT3B0aW9ucy5yZWxTaXplLmhlaWdodCkge1xyXG5cdFx0XHRcdFx0aWYgKGR1cmluZykge1xyXG5cdFx0XHRcdFx0XHQvLyB0aGUgb25seSBwYWRkaW5nIHRoZSBzcGFjZXIgc2hvdWxkIGV2ZXIgaW5jbHVkZSBpcyB0aGUgZHVyYXRpb24gKGlmIHB1c2hGb2xsb3dlcnMgPSB0cnVlKSwgc28gd2UgbmVlZCB0byBzdWJzdHJhY3QgdGhhdC5cclxuXHRcdFx0XHRcdFx0X3V0aWwuY3NzKF9waW4sIHtcclxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBfdXRpbC5nZXQuaGVpZ2h0KF9waW5PcHRpb25zLnNwYWNlcikgLSAoX3Bpbk9wdGlvbnMucHVzaEZvbGxvd2VycyA/IF9vcHRpb25zLmR1cmF0aW9uIDogMClcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdXRpbC5jc3MoX3Bpbiwge1xyXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IFwiMTAwJVwiXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBtYXJnaW4gaXMgb25seSBpbmNsdWRlZCBpZiBpdCdzIGEgY2FzY2FkZWQgcGluIHRvIHJlc29sdmUgYW4gSUU5IGJ1Z1xyXG5cdFx0XHRcdFx0Y3NzW1wibWluLWhlaWdodFwiXSA9IF91dGlsLmdldC5oZWlnaHQodmVydGljYWwgPyBwaW5UYXJnZXQgOiBfcGluLCB0cnVlLCAhbWFyZ2luQ29sbGFwc2UpOyAvLyBuZWVkZWQgZm9yIGNhc2NhZGluZyBwaW5zXHJcblx0XHRcdFx0XHRjc3MuaGVpZ2h0ID0gZHVyaW5nID8gY3NzW1wibWluLWhlaWdodFwiXSA6IFwiYXV0b1wiO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gYWRkIHNwYWNlIGZvciBkdXJhdGlvbiBpZiBwdXNoRm9sbG93ZXJzIGlzIHRydWVcclxuXHRcdFx0XHRpZiAoX3Bpbk9wdGlvbnMucHVzaEZvbGxvd2Vycykge1xyXG5cdFx0XHRcdFx0Y3NzW1wicGFkZGluZ1wiICsgKHZlcnRpY2FsID8gXCJUb3BcIiA6IFwiTGVmdFwiKV0gPSBfb3B0aW9ucy5kdXJhdGlvbiAqIF9wcm9ncmVzcztcclxuXHRcdFx0XHRcdGNzc1tcInBhZGRpbmdcIiArICh2ZXJ0aWNhbCA/IFwiQm90dG9tXCIgOiBcIlJpZ2h0XCIpXSA9IF9vcHRpb25zLmR1cmF0aW9uICogKDEgLSBfcHJvZ3Jlc3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRfdXRpbC5jc3MoX3Bpbk9wdGlvbnMuc3BhY2VyLCBjc3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyB0aGUgUGluIHN0YXRlIChpbiBjZXJ0YWluIHNjZW5hcmlvcylcclxuXHRcdCAqIElmIHRoZSBjb250cm9sbGVyIGNvbnRhaW5lciBpcyBub3QgdGhlIGRvY3VtZW50IGFuZCB3ZSBhcmUgbWlkLXBpbi1waGFzZSBzY3JvbGxpbmcgb3IgcmVzaXppbmcgdGhlIG1haW4gZG9jdW1lbnQgY2FuIHJlc3VsdCB0byB3cm9uZyBwaW4gcG9zaXRpb25zLlxyXG5cdFx0ICogU28gdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gcmVzaXplIGFuZCBzY3JvbGwgb2YgdGhlIGRvY3VtZW50LlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHVwZGF0ZVBpbkluQ29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoX2NvbnRyb2xsZXIgJiYgX3BpbiAmJiBfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0RVUklORyAmJiAhX2NvbnRyb2xsZXIuaW5mbyhcImlzRG9jdW1lbnRcIikpIHtcclxuXHRcdFx0XHR1cGRhdGVQaW5TdGF0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyB0aGUgUGluIHNwYWNlciBzaXplIHN0YXRlIChpbiBjZXJ0YWluIHNjZW5hcmlvcylcclxuXHRcdCAqIElmIGNvbnRhaW5lciBpcyByZXNpemVkIGR1cmluZyBwaW4gYW5kIHJlbGF0aXZlbHkgc2l6ZWQgdGhlIHNpemUgb2YgdGhlIHBpbiBtaWdodCBuZWVkIHRvIGJlIHVwZGF0ZWQuLi5cclxuXHRcdCAqIFNvIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHJlc2l6ZSBvZiB0aGUgY29udGFpbmVyLlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHVwZGF0ZVJlbGF0aXZlUGluU3BhY2VyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoX2NvbnRyb2xsZXIgJiYgX3BpbiAmJiAvLyB3ZWxsLCBkdWhcclxuXHRcdFx0X3N0YXRlID09PSBTQ0VORV9TVEFURV9EVVJJTkcgJiYgLy8gZWxlbWVudCBpbiBwaW5uZWQgc3RhdGU/XHJcblx0XHRcdCggLy8gaXMgd2lkdGggb3IgaGVpZ2h0IHJlbGF0aXZlbHkgc2l6ZWQsIGJ1dCBub3QgaW4gcmVsYXRpb24gdG8gYm9keT8gdGhlbiB3ZSBuZWVkIHRvIHJlY2FsYy5cclxuXHRcdFx0KChfcGluT3B0aW9ucy5yZWxTaXplLndpZHRoIHx8IF9waW5PcHRpb25zLnJlbFNpemUuYXV0b0Z1bGxXaWR0aCkgJiYgX3V0aWwuZ2V0LndpZHRoKHdpbmRvdykgIT0gX3V0aWwuZ2V0LndpZHRoKF9waW5PcHRpb25zLnNwYWNlci5wYXJlbnROb2RlKSkgfHwgKF9waW5PcHRpb25zLnJlbFNpemUuaGVpZ2h0ICYmIF91dGlsLmdldC5oZWlnaHQod2luZG93KSAhPSBfdXRpbC5nZXQuaGVpZ2h0KF9waW5PcHRpb25zLnNwYWNlci5wYXJlbnROb2RlKSkpKSB7XHJcblx0XHRcdFx0dXBkYXRlUGluRGltZW5zaW9ucygpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSXMgY2FsbGVkLCB3aGVuIHRoZSBtb3VzZXdoZWwgaXMgdXNlZCB3aGlsZSBvdmVyIGEgcGlubmVkIGVsZW1lbnQgaW5zaWRlIGEgZGl2IGNvbnRhaW5lci5cclxuXHRcdCAqIElmIHRoZSBzY2VuZSBpcyBpbiBmaXhlZCBzdGF0ZSBzY3JvbGwgZXZlbnRzIHdvdWxkIGJlIGNvdW50ZWQgdG93YXJkcyB0aGUgYm9keS4gVGhpcyBmb3J3YXJkcyB0aGUgZXZlbnQgdG8gdGhlIHNjcm9sbCBjb250YWluZXIuXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHR2YXIgb25Nb3VzZXdoZWVsT3ZlclBpbiA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGlmIChfY29udHJvbGxlciAmJiBfcGluICYmIF9zdGF0ZSA9PT0gU0NFTkVfU1RBVEVfRFVSSU5HICYmICFfY29udHJvbGxlci5pbmZvKFwiaXNEb2N1bWVudFwiKSkgeyAvLyBpbiBwaW4gc3RhdGVcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0X2NvbnRyb2xsZXIuX3NldFNjcm9sbFBvcyhfY29udHJvbGxlci5pbmZvKFwic2Nyb2xsUG9zXCIpIC0gKChlLndoZWVsRGVsdGEgfHwgZVtfY29udHJvbGxlci5pbmZvKFwidmVydGljYWxcIikgPyBcIndoZWVsRGVsdGFZXCIgOiBcIndoZWVsRGVsdGFYXCJdKSAvIDMgfHwgLWUuZGV0YWlsICogMzApKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFBpbiBhbiBlbGVtZW50IGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHR3ZWVuLiAgXHJcblx0XHQgKiBJZiB0aGUgc2NlbmUgZHVyYXRpb24gaXMgMCB0aGUgZWxlbWVudCB3aWxsIG9ubHkgYmUgdW5waW5uZWQsIGlmIHRoZSB1c2VyIHNjcm9sbHMgYmFjayBwYXN0IHRoZSBzdGFydCBwb3NpdGlvbi4gIFxyXG5cdFx0ICogTWFrZSBzdXJlIG9ubHkgb25lIHBpbiBpcyBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgYXQgdGhlIHNhbWUgdGltZS5cclxuXHRcdCAqIEFuIGVsZW1lbnQgY2FuIGJlIHBpbm5lZCBtdWx0aXBsZSB0aW1lcywgYnV0IG9ubHkgc3VjY2Vzc2l2ZWx5LlxyXG5cdFx0ICogXyoqTk9URToqKiBUaGUgb3B0aW9uIGBwdXNoRm9sbG93ZXJzYCBoYXMgbm8gZWZmZWN0LCB3aGVuIHRoZSBzY2VuZSBkdXJhdGlvbiBpcyAwLl9cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjc2V0UGluXHJcblx0XHQgKiBAZXhhbXBsZVxyXG5cdFx0ICogLy8gcGluIGVsZW1lbnQgYW5kIHB1c2ggYWxsIGZvbGxvd2luZyBlbGVtZW50cyBkb3duIGJ5IHRoZSBhbW91bnQgb2YgdGhlIHBpbiBkdXJhdGlvbi5cclxuXHRcdCAqIHNjZW5lLnNldFBpbihcIiNwaW5cIik7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gcGluIGVsZW1lbnQgYW5kIGtlZXBpbmcgYWxsIGZvbGxvd2luZyBlbGVtZW50cyBpbiB0aGVpciBwbGFjZS4gVGhlIHBpbm5lZCBlbGVtZW50IHdpbGwgbW92ZSBwYXN0IHRoZW0uXHJcblx0XHQgKiBzY2VuZS5zZXRQaW4oXCIjcGluXCIsIHtwdXNoRm9sbG93ZXJzOiBmYWxzZX0pO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSBlbGVtZW50IC0gQSBTZWxlY3RvciB0YXJnZXRpbmcgYW4gZWxlbWVudCBvciBhIERPTSBvYmplY3QgdGhhdCBpcyBzdXBwb3NlZCB0byBiZSBwaW5uZWQuXHJcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gW3NldHRpbmdzXSAtIHNldHRpbmdzIGZvciB0aGUgcGluXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtzZXR0aW5ncy5wdXNoRm9sbG93ZXJzPXRydWVdIC0gSWYgYHRydWVgIGZvbGxvd2luZyBlbGVtZW50cyB3aWxsIGJlIFwicHVzaGVkXCIgZG93biBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBwaW4sIGlmIGBmYWxzZWAgdGhlIHBpbm5lZCBlbGVtZW50IHdpbGwganVzdCBzY3JvbGwgcGFzdCB0aGVtLiAgXHJcblx0XHQgSWdub3JlZCwgd2hlbiBkdXJhdGlvbiBpcyBgMGAuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gW3NldHRpbmdzLnNwYWNlckNsYXNzPVwic2Nyb2xsbWFnaWMtcGluLXNwYWNlclwiXSAtIENsYXNzbmFtZSBvZiB0aGUgcGluIHNwYWNlciBlbGVtZW50LCB3aGljaCBpcyB1c2VkIHRvIHJlcGxhY2UgdGhlIGVsZW1lbnQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5zZXRQaW4gPSBmdW5jdGlvbiAoZWxlbWVudCwgc2V0dGluZ3MpIHtcclxuXHRcdFx0dmFyXHJcblx0XHRcdGRlZmF1bHRTZXR0aW5ncyA9IHtcclxuXHRcdFx0XHRwdXNoRm9sbG93ZXJzOiB0cnVlLFxyXG5cdFx0XHRcdHNwYWNlckNsYXNzOiBcInNjcm9sbG1hZ2ljLXBpbi1zcGFjZXJcIlxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzZXR0aW5ncyA9IF91dGlsLmV4dGVuZCh7fSwgZGVmYXVsdFNldHRpbmdzLCBzZXR0aW5ncyk7XHJcblxyXG5cdFx0XHQvLyB2YWxpZGF0ZSBFbGVtZW50XHJcblx0XHRcdGVsZW1lbnQgPSBfdXRpbC5nZXQuZWxlbWVudHMoZWxlbWVudClbMF07XHJcblx0XHRcdGlmICghZWxlbWVudCkge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SIGNhbGxpbmcgbWV0aG9kICdzZXRQaW4oKSc6IEludmFsaWQgcGluIGVsZW1lbnQgc3VwcGxpZWQuXCIpO1xyXG5cdFx0XHRcdHJldHVybiBTY2VuZTsgLy8gY2FuY2VsXHJcblx0XHRcdH0gZWxzZSBpZiAoX3V0aWwuY3NzKGVsZW1lbnQsIFwicG9zaXRpb25cIikgPT09IFwiZml4ZWRcIikge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SIGNhbGxpbmcgbWV0aG9kICdzZXRQaW4oKSc6IFBpbiBkb2VzIG5vdCB3b3JrIHdpdGggZWxlbWVudHMgdGhhdCBhcmUgcG9zaXRpb25lZCAnZml4ZWQnLlwiKTtcclxuXHRcdFx0XHRyZXR1cm4gU2NlbmU7IC8vIGNhbmNlbFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoX3BpbikgeyAvLyBwcmVleGlzdGluZyBwaW4/XHJcblx0XHRcdFx0aWYgKF9waW4gPT09IGVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdC8vIHNhbWUgcGluIHdlIGFscmVhZHkgaGF2ZSAtPiBkbyBub3RoaW5nXHJcblx0XHRcdFx0XHRyZXR1cm4gU2NlbmU7IC8vIGNhbmNlbFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBraWxsIG9sZCBwaW5cclxuXHRcdFx0XHRcdFNjZW5lLnJlbW92ZVBpbigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0X3BpbiA9IGVsZW1lbnQ7XHJcblxyXG5cdFx0XHR2YXJcclxuXHRcdFx0cGFyZW50RGlzcGxheSA9IF9waW4ucGFyZW50Tm9kZS5zdHlsZS5kaXNwbGF5LFxyXG5cdFx0XHRcdGJvdW5kc1BhcmFtcyA9IFtcInRvcFwiLCBcImxlZnRcIiwgXCJib3R0b21cIiwgXCJyaWdodFwiLCBcIm1hcmdpblwiLCBcIm1hcmdpbkxlZnRcIiwgXCJtYXJnaW5SaWdodFwiLCBcIm1hcmdpblRvcFwiLCBcIm1hcmdpbkJvdHRvbVwiXTtcclxuXHJcblx0XHRcdF9waW4ucGFyZW50Tm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyAvLyBoYWNrIHN0YXJ0IHRvIGZvcmNlIGNzcyB0byByZXR1cm4gc3R5bGVzaGVldCB2YWx1ZXMgaW5zdGVhZCBvZiBjYWxjdWxhdGVkIHB4IHZhbHVlcy5cclxuXHRcdFx0dmFyXHJcblx0XHRcdGluRmxvdyA9IF91dGlsLmNzcyhfcGluLCBcInBvc2l0aW9uXCIpICE9IFwiYWJzb2x1dGVcIixcclxuXHRcdFx0XHRwaW5DU1MgPSBfdXRpbC5jc3MoX3BpbiwgYm91bmRzUGFyYW1zLmNvbmNhdChbXCJkaXNwbGF5XCJdKSksXHJcblx0XHRcdFx0c2l6ZUNTUyA9IF91dGlsLmNzcyhfcGluLCBbXCJ3aWR0aFwiLCBcImhlaWdodFwiXSk7XHJcblx0XHRcdF9waW4ucGFyZW50Tm9kZS5zdHlsZS5kaXNwbGF5ID0gcGFyZW50RGlzcGxheTsgLy8gaGFjayBlbmQuXHJcblx0XHRcdGlmICghaW5GbG93ICYmIHNldHRpbmdzLnB1c2hGb2xsb3dlcnMpIHtcclxuXHRcdFx0XHRsb2coMiwgXCJXQVJOSU5HOiBJZiB0aGUgcGlubmVkIGVsZW1lbnQgaXMgcG9zaXRpb25lZCBhYnNvbHV0ZWx5IHB1c2hGb2xsb3dlcnMgd2lsbCBiZSBkaXNhYmxlZC5cIik7XHJcblx0XHRcdFx0c2V0dGluZ3MucHVzaEZvbGxvd2VycyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgLy8gd2FpdCB1bnRpbCBhbGwgZmluaXNoZWQsIGJlY2F1c2Ugd2l0aCByZXNwb25zaXZlIGR1cmF0aW9uIGl0IHdpbGwgb25seSBiZSBzZXQgYWZ0ZXIgc2NlbmUgaXMgYWRkZWQgdG8gY29udHJvbGxlclxyXG5cdFx0XHRcdGlmIChfcGluICYmIF9vcHRpb25zLmR1cmF0aW9uID09PSAwICYmIHNldHRpbmdzLnB1c2hGb2xsb3dlcnMpIHtcclxuXHRcdFx0XHRcdGxvZygyLCBcIldBUk5JTkc6IHB1c2hGb2xsb3dlcnMgPVwiLCB0cnVlLCBcImhhcyBubyBlZmZlY3QsIHdoZW4gc2NlbmUgZHVyYXRpb24gaXMgMC5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCAwKTtcclxuXHJcblx0XHRcdC8vIGNyZWF0ZSBzcGFjZXIgYW5kIGluc2VydFxyXG5cdFx0XHR2YXJcclxuXHRcdFx0c3BhY2VyID0gX3Bpbi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgX3BpbiksXHJcblx0XHRcdFx0c3BhY2VyQ1NTID0gX3V0aWwuZXh0ZW5kKHBpbkNTUywge1xyXG5cdFx0XHRcdFx0cG9zaXRpb246IGluRmxvdyA/IFwicmVsYXRpdmVcIiA6IFwiYWJzb2x1dGVcIixcclxuXHRcdFx0XHRcdGJveFNpemluZzogXCJjb250ZW50LWJveFwiLFxyXG5cdFx0XHRcdFx0bW96Qm94U2l6aW5nOiBcImNvbnRlbnQtYm94XCIsXHJcblx0XHRcdFx0XHR3ZWJraXRCb3hTaXppbmc6IFwiY29udGVudC1ib3hcIlxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKCFpbkZsb3cpIHsgLy8gY29weSBzaXplIGlmIHBvc2l0aW9uZWQgYWJzb2x1dGVseSwgdG8gd29yayBmb3IgYm90dG9tL3JpZ2h0IHBvc2l0aW9uZWQgZWxlbWVudHMuXHJcblx0XHRcdFx0X3V0aWwuZXh0ZW5kKHNwYWNlckNTUywgX3V0aWwuY3NzKF9waW4sIFtcIndpZHRoXCIsIFwiaGVpZ2h0XCJdKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF91dGlsLmNzcyhzcGFjZXIsIHNwYWNlckNTUyk7XHJcblx0XHRcdHNwYWNlci5zZXRBdHRyaWJ1dGUoUElOX1NQQUNFUl9BVFRSSUJVVEUsIFwiXCIpO1xyXG5cdFx0XHRfdXRpbC5hZGRDbGFzcyhzcGFjZXIsIHNldHRpbmdzLnNwYWNlckNsYXNzKTtcclxuXHJcblx0XHRcdC8vIHNldCB0aGUgcGluIE9wdGlvbnNcclxuXHRcdFx0X3Bpbk9wdGlvbnMgPSB7XHJcblx0XHRcdFx0c3BhY2VyOiBzcGFjZXIsXHJcblx0XHRcdFx0cmVsU2l6ZTogeyAvLyBzYXZlIGlmIHNpemUgaXMgZGVmaW5lZCB1c2luZyAlIHZhbHVlcy4gaWYgc28sIGhhbmRsZSBzcGFjZXIgcmVzaXplIGRpZmZlcmVudGx5Li4uXHJcblx0XHRcdFx0XHR3aWR0aDogc2l6ZUNTUy53aWR0aC5zbGljZSgtMSkgPT09IFwiJVwiLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzaXplQ1NTLmhlaWdodC5zbGljZSgtMSkgPT09IFwiJVwiLFxyXG5cdFx0XHRcdFx0YXV0b0Z1bGxXaWR0aDogc2l6ZUNTUy53aWR0aCA9PT0gXCJhdXRvXCIgJiYgaW5GbG93ICYmIF91dGlsLmlzTWFyZ2luQ29sbGFwc2VUeXBlKHBpbkNTUy5kaXNwbGF5KVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cHVzaEZvbGxvd2Vyczogc2V0dGluZ3MucHVzaEZvbGxvd2VycyxcclxuXHRcdFx0XHRpbkZsb3c6IGluRmxvdyxcclxuXHRcdFx0XHQvLyBzdG9yZXMgaWYgdGhlIGVsZW1lbnQgdGFrZXMgdXAgc3BhY2UgaW4gdGhlIGRvY3VtZW50IGZsb3dcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmICghX3Bpbi5fX19vcmlnU3R5bGUpIHtcclxuXHRcdFx0XHRfcGluLl9fX29yaWdTdHlsZSA9IHt9O1xyXG5cdFx0XHRcdHZhclxyXG5cdFx0XHRcdHBpbklubGluZUNTUyA9IF9waW4uc3R5bGUsXHJcblx0XHRcdFx0XHRjb3B5U3R5bGVzID0gYm91bmRzUGFyYW1zLmNvbmNhdChbXCJ3aWR0aFwiLCBcImhlaWdodFwiLCBcInBvc2l0aW9uXCIsIFwiYm94U2l6aW5nXCIsIFwibW96Qm94U2l6aW5nXCIsIFwid2Via2l0Qm94U2l6aW5nXCJdKTtcclxuXHRcdFx0XHRjb3B5U3R5bGVzLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHRcdFx0X3Bpbi5fX19vcmlnU3R5bGVbdmFsXSA9IHBpbklubGluZUNTU1t2YWxdIHx8IFwiXCI7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIHJlbGF0aXZlIHNpemUsIHRyYW5zZmVyIGl0IHRvIHNwYWNlciBhbmQgbWFrZSBwaW4gY2FsY3VsYXRlIGl0Li4uXHJcblx0XHRcdGlmIChfcGluT3B0aW9ucy5yZWxTaXplLndpZHRoKSB7XHJcblx0XHRcdFx0X3V0aWwuY3NzKHNwYWNlciwge1xyXG5cdFx0XHRcdFx0d2lkdGg6IHNpemVDU1Mud2lkdGhcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoX3Bpbk9wdGlvbnMucmVsU2l6ZS5oZWlnaHQpIHtcclxuXHRcdFx0XHRfdXRpbC5jc3Moc3BhY2VyLCB7XHJcblx0XHRcdFx0XHRoZWlnaHQ6IHNpemVDU1MuaGVpZ2h0XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG5vdyBwbGFjZSB0aGUgcGluIGVsZW1lbnQgaW5zaWRlIHRoZSBzcGFjZXJcdFxyXG5cdFx0XHRzcGFjZXIuYXBwZW5kQ2hpbGQoX3Bpbik7XHJcblx0XHRcdC8vIGFuZCBzZXQgbmV3IGNzc1xyXG5cdFx0XHRfdXRpbC5jc3MoX3Bpbiwge1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBpbkZsb3cgPyBcInJlbGF0aXZlXCIgOiBcImFic29sdXRlXCIsXHJcblx0XHRcdFx0bWFyZ2luOiBcImF1dG9cIixcclxuXHRcdFx0XHR0b3A6IFwiYXV0b1wiLFxyXG5cdFx0XHRcdGxlZnQ6IFwiYXV0b1wiLFxyXG5cdFx0XHRcdGJvdHRvbTogXCJhdXRvXCIsXHJcblx0XHRcdFx0cmlnaHQ6IFwiYXV0b1wiXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKF9waW5PcHRpb25zLnJlbFNpemUud2lkdGggfHwgX3Bpbk9wdGlvbnMucmVsU2l6ZS5hdXRvRnVsbFdpZHRoKSB7XHJcblx0XHRcdFx0X3V0aWwuY3NzKF9waW4sIHtcclxuXHRcdFx0XHRcdGJveFNpemluZzogXCJib3JkZXItYm94XCIsXHJcblx0XHRcdFx0XHRtb3pCb3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxyXG5cdFx0XHRcdFx0d2Via2l0Qm94U2l6aW5nOiBcImJvcmRlci1ib3hcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBhZGQgbGlzdGVuZXIgdG8gZG9jdW1lbnQgdG8gdXBkYXRlIHBpbiBwb3NpdGlvbiBpbiBjYXNlIGNvbnRyb2xsZXIgaXMgbm90IHRoZSBkb2N1bWVudC5cclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZVBpbkluQ29udGFpbmVyKTtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVBpbkluQ29udGFpbmVyKTtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVJlbGF0aXZlUGluU3BhY2VyKTtcclxuXHRcdFx0Ly8gYWRkIG1vdXNld2hlZWwgbGlzdGVuZXIgdG8gY2F0Y2ggc2Nyb2xscyBvdmVyIGZpeGVkIGVsZW1lbnRzXHJcblx0XHRcdF9waW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNld2hlZWxcIiwgb25Nb3VzZXdoZWVsT3ZlclBpbik7XHJcblx0XHRcdF9waW4uYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU1vdXNlU2Nyb2xsXCIsIG9uTW91c2V3aGVlbE92ZXJQaW4pO1xyXG5cclxuXHRcdFx0bG9nKDMsIFwiYWRkZWQgcGluXCIpO1xyXG5cclxuXHRcdFx0Ly8gZmluYWxseSB1cGRhdGUgdGhlIHBpbiB0byBpbml0XHJcblx0XHRcdHVwZGF0ZVBpblN0YXRlKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gU2NlbmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVtb3ZlIHRoZSBwaW4gZnJvbSB0aGUgc2NlbmUuXHJcblx0XHQgKiBAbWV0aG9kIFNjcm9sbE1hZ2ljLlNjZW5lI3JlbW92ZVBpblxyXG5cdFx0ICogQGV4YW1wbGVcclxuXHRcdCAqIC8vIHJlbW92ZSB0aGUgcGluIGZyb20gdGhlIHNjZW5lIHdpdGhvdXQgcmVzZXR0aW5nIGl0ICh0aGUgc3BhY2VyIGlzIG5vdCByZW1vdmVkKVxyXG5cdFx0ICogc2NlbmUucmVtb3ZlUGluKCk7XHJcblx0XHQgKlxyXG5cdFx0ICogLy8gcmVtb3ZlIHRoZSBwaW4gZnJvbSB0aGUgc2NlbmUgYW5kIHJlc2V0IHRoZSBwaW4gZWxlbWVudCB0byBpdHMgaW5pdGlhbCBwb3NpdGlvbiAoc3BhY2VyIGlzIHJlbW92ZWQpXHJcblx0XHQgKiBzY2VuZS5yZW1vdmVQaW4odHJ1ZSk7XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbcmVzZXQ9ZmFsc2VdIC0gSWYgYGZhbHNlYCB0aGUgc3BhY2VyIHdpbGwgbm90IGJlIHJlbW92ZWQgYW5kIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gd2lsbCBub3QgYmUgcmVzZXQuXHJcblx0XHQgKiBAcmV0dXJucyB7U2NlbmV9IFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnJlbW92ZVBpbiA9IGZ1bmN0aW9uIChyZXNldCkge1xyXG5cdFx0XHRpZiAoX3Bpbikge1xyXG5cdFx0XHRcdGlmIChfc3RhdGUgPT09IFNDRU5FX1NUQVRFX0RVUklORykge1xyXG5cdFx0XHRcdFx0dXBkYXRlUGluU3RhdGUodHJ1ZSk7IC8vIGZvcmNlIHVucGluIGF0IHBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXNldCB8fCAhX2NvbnRyb2xsZXIpIHsgLy8gaWYgdGhlcmUncyBubyBjb250cm9sbGVyIG5vIHByb2dyZXNzIHdhcyBtYWRlIGFueXdheS4uLlxyXG5cdFx0XHRcdFx0dmFyIHBpblRhcmdldCA9IF9waW5PcHRpb25zLnNwYWNlci5maXJzdENoaWxkOyAvLyB1c3VhbGx5IHRoZSBwaW4gZWxlbWVudCwgYnV0IG1heSBiZSBhbm90aGVyIHNwYWNlciAoY2FzY2FkZWQgcGlucykuLi5cclxuXHRcdFx0XHRcdGlmIChwaW5UYXJnZXQuaGFzQXR0cmlidXRlKFBJTl9TUEFDRVJfQVRUUklCVVRFKSkgeyAvLyBjb3B5IG1hcmdpbnMgdG8gY2hpbGQgc3BhY2VyXHJcblx0XHRcdFx0XHRcdHZhclxyXG5cdFx0XHRcdFx0XHRzdHlsZSA9IF9waW5PcHRpb25zLnNwYWNlci5zdHlsZSxcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXCJtYXJnaW5cIiwgXCJtYXJnaW5MZWZ0XCIsIFwibWFyZ2luUmlnaHRcIiwgXCJtYXJnaW5Ub3BcIiwgXCJtYXJnaW5Cb3R0b21cIl07XHJcblx0XHRcdFx0XHRcdG1hcmdpbnMgPSB7fTtcclxuXHRcdFx0XHRcdFx0dmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHRcdFx0XHRcdG1hcmdpbnNbdmFsXSA9IHN0eWxlW3ZhbF0gfHwgXCJcIjtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdF91dGlsLmNzcyhwaW5UYXJnZXQsIG1hcmdpbnMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0X3Bpbk9wdGlvbnMuc3BhY2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBpblRhcmdldCwgX3Bpbk9wdGlvbnMuc3BhY2VyKTtcclxuXHRcdFx0XHRcdF9waW5PcHRpb25zLnNwYWNlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKF9waW5PcHRpb25zLnNwYWNlcik7XHJcblx0XHRcdFx0XHRpZiAoIV9waW4ucGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoUElOX1NQQUNFUl9BVFRSSUJVVEUpKSB7IC8vIGlmIGl0J3MgdGhlIGxhc3QgcGluIGZvciB0aGlzIGVsZW1lbnQgLT4gcmVzdG9yZSBpbmxpbmUgc3R5bGVzXHJcblx0XHRcdFx0XHRcdC8vIFRPRE86IG9ubHkgY29ycmVjdGx5IHNldCBmb3IgZmlyc3QgcGluICh3aGVuIGNhc2NhZGluZykgLSBob3cgdG8gZml4P1xyXG5cdFx0XHRcdFx0XHRfdXRpbC5jc3MoX3BpbiwgX3Bpbi5fX19vcmlnU3R5bGUpO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgX3Bpbi5fX19vcmlnU3R5bGU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGVQaW5JbkNvbnRhaW5lcik7XHJcblx0XHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVBpbkluQ29udGFpbmVyKTtcclxuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlUmVsYXRpdmVQaW5TcGFjZXIpO1xyXG5cdFx0XHRcdF9waW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNld2hlZWxcIiwgb25Nb3VzZXdoZWVsT3ZlclBpbik7XHJcblx0XHRcdFx0X3Bpbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NTW91c2VTY3JvbGxcIiwgb25Nb3VzZXdoZWVsT3ZlclBpbik7XHJcblx0XHRcdFx0X3BpbiA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRsb2coMywgXCJyZW1vdmVkIHBpbiAocmVzZXQ6IFwiICsgKHJlc2V0ID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpICsgXCIpXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTY2VuZTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHZhclxyXG5cdFx0X2Nzc0NsYXNzZXMsIF9jc3NDbGFzc0VsZW1zID0gW107XHJcblxyXG5cdFx0U2NlbmUub24oXCJkZXN0cm95LmludGVybmFsXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFNjZW5lLnJlbW92ZUNsYXNzVG9nZ2xlKGUucmVzZXQpO1xyXG5cdFx0fSk7XHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZSBhIGNzcyBjbGFzcyBtb2RpZmljYXRpb24gd2hpbGUgdGhlIHNjZW5lIGlzIGFjdGl2ZS4gIFxyXG5cdFx0ICogV2hlbiB0aGUgc2NlbmUgdHJpZ2dlcnMgdGhlIGNsYXNzZXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgc3VwcGxpZWQgZWxlbWVudCBhbmQgcmVtb3ZlZCwgd2hlbiB0aGUgc2NlbmUgaXMgb3Zlci5cclxuXHRcdCAqIElmIHRoZSBzY2VuZSBkdXJhdGlvbiBpcyAwIHRoZSBjbGFzc2VzIHdpbGwgb25seSBiZSByZW1vdmVkIGlmIHRoZSB1c2VyIHNjcm9sbHMgYmFjayBwYXN0IHRoZSBzdGFydCBwb3NpdGlvbi5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjc2V0Q2xhc3NUb2dnbGVcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyBhZGQgdGhlIGNsYXNzICdteWNsYXNzJyB0byB0aGUgZWxlbWVudCB3aXRoIHRoZSBpZCAnbXktZWxlbScgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgc2NlbmVcclxuXHRcdCAqIHNjZW5lLnNldENsYXNzVG9nZ2xlKFwiI215LWVsZW1cIiwgXCJteWNsYXNzXCIpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIGFkZCBtdWx0aXBsZSBjbGFzc2VzIHRvIG11bHRpcGxlIGVsZW1lbnRzIGRlZmluZWQgYnkgdGhlIHNlbGVjdG9yICcuY2xhc3NDaGFuZ2UnXHJcblx0XHQgKiBzY2VuZS5zZXRDbGFzc1RvZ2dsZShcIi5jbGFzc0NoYW5nZVwiLCBcImNsYXNzMSBjbGFzczIgY2xhc3MzXCIpO1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSBlbGVtZW50IC0gQSBTZWxlY3RvciB0YXJnZXRpbmcgb25lIG9yIG1vcmUgZWxlbWVudHMgb3IgYSBET00gb2JqZWN0IHRoYXQgaXMgc3VwcG9zZWQgdG8gYmUgbW9kaWZpZWQuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NlcyAtIE9uZSBvciBtb3JlIENsYXNzbmFtZXMgKHNlcGFyYXRlZCBieSBzcGFjZSkgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnQgZHVyaW5nIHRoZSBzY2VuZS5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7U2NlbmV9IFBhcmVudCBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnNldENsYXNzVG9nZ2xlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzZXMpIHtcclxuXHRcdFx0dmFyIGVsZW1zID0gX3V0aWwuZ2V0LmVsZW1lbnRzKGVsZW1lbnQpO1xyXG5cdFx0XHRpZiAoZWxlbXMubGVuZ3RoID09PSAwIHx8ICFfdXRpbC50eXBlLlN0cmluZyhjbGFzc2VzKSkge1xyXG5cdFx0XHRcdGxvZygxLCBcIkVSUk9SIGNhbGxpbmcgbWV0aG9kICdzZXRDbGFzc1RvZ2dsZSgpJzogSW52YWxpZCBcIiArIChlbGVtcy5sZW5ndGggPT09IDAgPyBcImVsZW1lbnRcIiA6IFwiY2xhc3Nlc1wiKSArIFwiIHN1cHBsaWVkLlwiKTtcclxuXHRcdFx0XHRyZXR1cm4gU2NlbmU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKF9jc3NDbGFzc0VsZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHQvLyByZW1vdmUgb2xkIG9uZXNcclxuXHRcdFx0XHRTY2VuZS5yZW1vdmVDbGFzc1RvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdF9jc3NDbGFzc2VzID0gY2xhc3NlcztcclxuXHRcdFx0X2Nzc0NsYXNzRWxlbXMgPSBlbGVtcztcclxuXHRcdFx0U2NlbmUub24oXCJlbnRlci5pbnRlcm5hbF9jbGFzcyBsZWF2ZS5pbnRlcm5hbF9jbGFzc1wiLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdHZhciB0b2dnbGUgPSBlLnR5cGUgPT09IFwiZW50ZXJcIiA/IF91dGlsLmFkZENsYXNzIDogX3V0aWwucmVtb3ZlQ2xhc3M7XHJcblx0XHRcdFx0X2Nzc0NsYXNzRWxlbXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSwga2V5KSB7XHJcblx0XHRcdFx0XHR0b2dnbGUoZWxlbSwgX2Nzc0NsYXNzZXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIFNjZW5lO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlbW92ZSB0aGUgY2xhc3MgYmluZGluZyBmcm9tIHRoZSBzY2VuZS5cclxuXHRcdCAqIEBtZXRob2QgU2Nyb2xsTWFnaWMuU2NlbmUjcmVtb3ZlQ2xhc3NUb2dnbGVcclxuXHRcdCAqIEBleGFtcGxlXHJcblx0XHQgKiAvLyByZW1vdmUgY2xhc3MgYmluZGluZyBmcm9tIHRoZSBzY2VuZSB3aXRob3V0IHJlc2V0XHJcblx0XHQgKiBzY2VuZS5yZW1vdmVDbGFzc1RvZ2dsZSgpO1xyXG5cdFx0ICpcclxuXHRcdCAqIC8vIHJlbW92ZSBjbGFzcyBiaW5kaW5nIGFuZCByZW1vdmUgdGhlIGNoYW5nZXMgaXQgY2F1c2VkXHJcblx0XHQgKiBzY2VuZS5yZW1vdmVDbGFzc1RvZ2dsZSh0cnVlKTtcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXNldD1mYWxzZV0gLSBJZiBgZmFsc2VgIGFuZCB0aGUgY2xhc3NlcyBhcmUgY3VycmVudGx5IGFjdGl2ZSwgdGhleSB3aWxsIHJlbWFpbiBvbiB0aGUgZWxlbWVudC4gSWYgYHRydWVgIHRoZXkgd2lsbCBiZSByZW1vdmVkLlxyXG5cdFx0ICogQHJldHVybnMge1NjZW5lfSBQYXJlbnQgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5yZW1vdmVDbGFzc1RvZ2dsZSA9IGZ1bmN0aW9uIChyZXNldCkge1xyXG5cdFx0XHRpZiAocmVzZXQpIHtcclxuXHRcdFx0XHRfY3NzQ2xhc3NFbGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtLCBrZXkpIHtcclxuXHRcdFx0XHRcdF91dGlsLnJlbW92ZUNsYXNzKGVsZW0sIF9jc3NDbGFzc2VzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRTY2VuZS5vZmYoXCJzdGFydC5pbnRlcm5hbF9jbGFzcyBlbmQuaW50ZXJuYWxfY2xhc3NcIik7XHJcblx0XHRcdF9jc3NDbGFzc2VzID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRfY3NzQ2xhc3NFbGVtcyA9IFtdO1xyXG5cdFx0XHRyZXR1cm4gU2NlbmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIElOSVRcclxuXHRcdGNvbnN0cnVjdCgpO1xyXG5cdFx0cmV0dXJuIFNjZW5lO1xyXG5cdH07XHJcblxyXG5cdC8vIHN0b3JlIHBhZ2V3aWRlIHNjZW5lIG9wdGlvbnNcclxuXHR2YXIgU0NFTkVfT1BUSU9OUyA9IHtcclxuXHRcdGRlZmF1bHRzOiB7XHJcblx0XHRcdGR1cmF0aW9uOiAwLFxyXG5cdFx0XHRvZmZzZXQ6IDAsXHJcblx0XHRcdHRyaWdnZXJFbGVtZW50OiB1bmRlZmluZWQsXHJcblx0XHRcdHRyaWdnZXJIb29rOiAwLjUsXHJcblx0XHRcdHJldmVyc2U6IHRydWUsXHJcblx0XHRcdGxvZ2xldmVsOiAyXHJcblx0XHR9LFxyXG5cdFx0dmFsaWRhdGU6IHtcclxuXHRcdFx0b2Zmc2V0OiBmdW5jdGlvbiAodmFsKSB7XHJcblx0XHRcdFx0dmFsID0gcGFyc2VGbG9hdCh2YWwpO1xyXG5cdFx0XHRcdGlmICghX3V0aWwudHlwZS5OdW1iZXIodmFsKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgW1wiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJvZmZzZXRcXFwiOlwiLCB2YWxdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0cmlnZ2VyRWxlbWVudDogZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHRcdHZhbCA9IHZhbCB8fCB1bmRlZmluZWQ7XHJcblx0XHRcdFx0aWYgKHZhbCkge1xyXG5cdFx0XHRcdFx0dmFyIGVsZW0gPSBfdXRpbC5nZXQuZWxlbWVudHModmFsKVswXTtcclxuXHRcdFx0XHRcdGlmIChlbGVtKSB7XHJcblx0XHRcdFx0XHRcdHZhbCA9IGVsZW07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBbXCJFbGVtZW50IGRlZmluZWQgaW4gb3B0aW9uIFxcXCJ0cmlnZ2VyRWxlbWVudFxcXCIgd2FzIG5vdCBmb3VuZDpcIiwgdmFsXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHRcdFx0fSxcclxuXHRcdFx0dHJpZ2dlckhvb2s6IGZ1bmN0aW9uICh2YWwpIHtcclxuXHRcdFx0XHR2YXIgdHJhbnNsYXRlID0ge1xyXG5cdFx0XHRcdFx0XCJvbkNlbnRlclwiOiAwLjUsXHJcblx0XHRcdFx0XHRcIm9uRW50ZXJcIjogMSxcclxuXHRcdFx0XHRcdFwib25MZWF2ZVwiOiAwXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoX3V0aWwudHlwZS5OdW1iZXIodmFsKSkge1xyXG5cdFx0XHRcdFx0dmFsID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocGFyc2VGbG9hdCh2YWwpLCAxKSk7IC8vICBtYWtlIHN1cmUgaXRzIGJldHdlZWVuIDAgYW5kIDFcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHZhbCBpbiB0cmFuc2xhdGUpIHtcclxuXHRcdFx0XHRcdHZhbCA9IHRyYW5zbGF0ZVt2YWxdO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBbXCJJbnZhbGlkIHZhbHVlIGZvciBvcHRpb24gXFxcInRyaWdnZXJIb29rXFxcIjogXCIsIHZhbF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRcdH0sXHJcblx0XHRcdHJldmVyc2U6IGZ1bmN0aW9uICh2YWwpIHtcclxuXHRcdFx0XHRyZXR1cm4gISF2YWw7IC8vIGZvcmNlIGJvb2xlYW5cclxuXHRcdFx0fSxcclxuXHRcdFx0bG9nbGV2ZWw6IGZ1bmN0aW9uICh2YWwpIHtcclxuXHRcdFx0XHR2YWwgPSBwYXJzZUludCh2YWwpO1xyXG5cdFx0XHRcdGlmICghX3V0aWwudHlwZS5OdW1iZXIodmFsKSB8fCB2YWwgPCAwIHx8IHZhbCA+IDMpIHtcclxuXHRcdFx0XHRcdHRocm93IFtcIkludmFsaWQgdmFsdWUgZm9yIG9wdGlvbiBcXFwibG9nbGV2ZWxcXFwiOlwiLCB2YWxdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly8gaG9sZGVyIGZvciAgdmFsaWRhdGlvbiBtZXRob2RzLiBkdXJhdGlvbiB2YWxpZGF0aW9uIGlzIGhhbmRsZWQgaW4gJ2dldHRlcnMtc2V0dGVycy5qcydcclxuXHRcdHNoaWZ0czogW1wiZHVyYXRpb25cIiwgXCJvZmZzZXRcIiwgXCJ0cmlnZ2VySG9va1wiXSxcclxuXHRcdC8vIGxpc3Qgb2Ygb3B0aW9ucyB0aGF0IHRyaWdnZXIgYSBgc2hpZnRgIGV2ZW50XHJcblx0fTtcclxuLypcclxuICogbWV0aG9kIHVzZWQgdG8gYWRkIGFuIG9wdGlvbiB0byBTY3JvbGxNYWdpYyBTY2VuZXMuXHJcbiAqIFRPRE86IERPQyAocHJpdmF0ZSBmb3IgZGV2KVxyXG4gKi9cclxuXHRTY3JvbGxNYWdpYy5TY2VuZS5hZGRPcHRpb24gPSBmdW5jdGlvbiAobmFtZSwgZGVmYXVsdFZhbHVlLCB2YWxpZGF0aW9uQ2FsbGJhY2ssIHNoaWZ0cykge1xyXG5cdFx0aWYgKCEobmFtZSBpbiBTQ0VORV9PUFRJT05TLmRlZmF1bHRzKSkge1xyXG5cdFx0XHRTQ0VORV9PUFRJT05TLmRlZmF1bHRzW25hbWVdID0gZGVmYXVsdFZhbHVlO1xyXG5cdFx0XHRTQ0VORV9PUFRJT05TLnZhbGlkYXRlW25hbWVdID0gdmFsaWRhdGlvbkNhbGxiYWNrO1xyXG5cdFx0XHRpZiAoc2hpZnRzKSB7XHJcblx0XHRcdFx0U0NFTkVfT1BUSU9OUy5zaGlmdHMucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0U2Nyb2xsTWFnaWMuX3V0aWwubG9nKDEsIFwiW3N0YXRpY10gU2Nyb2xsTWFnaWMuU2NlbmUgLT4gQ2Fubm90IGFkZCBTY2VuZSBvcHRpb24gJ1wiICsgbmFtZSArIFwiJywgYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0cy5cIik7XHJcblx0XHR9XHJcblx0fTtcclxuXHQvLyBpbnN0YW5jZSBleHRlbnNpb24gZnVuY3Rpb24gZm9yIHBsdWdpbnNcclxuXHQvLyBUT0RPOiBET0MgKHByaXZhdGUgZm9yIGRldilcclxuXHRTY3JvbGxNYWdpYy5TY2VuZS5leHRlbmQgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uKSB7XHJcblx0XHR2YXIgb2xkQ2xhc3MgPSB0aGlzO1xyXG5cdFx0U2Nyb2xsTWFnaWMuU2NlbmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG9sZENsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHRoaXMuJHN1cGVyID0gX3V0aWwuZXh0ZW5kKHt9LCB0aGlzKTsgLy8gY29weSBwYXJlbnQgc3RhdGVcclxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcblx0XHR9O1xyXG5cdFx0X3V0aWwuZXh0ZW5kKFNjcm9sbE1hZ2ljLlNjZW5lLCBvbGRDbGFzcyk7IC8vIGNvcHkgcHJvcGVydGllc1xyXG5cdFx0U2Nyb2xsTWFnaWMuU2NlbmUucHJvdG90eXBlID0gb2xkQ2xhc3MucHJvdG90eXBlOyAvLyBjb3B5IHByb3RvdHlwZVxyXG5cdFx0U2Nyb2xsTWFnaWMuU2NlbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2Nyb2xsTWFnaWMuU2NlbmU7IC8vIHJlc3RvcmUgY29uc3RydWN0b3JcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogVE9ETzogRE9DUyAocHJpdmF0ZSBmb3IgZGV2KVxyXG5cdCAqIEBjbGFzc1xyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblxyXG5cdFNjcm9sbE1hZ2ljLkV2ZW50ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWVzcGFjZSwgdGFyZ2V0LCB2YXJzKSB7XHJcblx0XHR2YXJzID0gdmFycyB8fCB7fTtcclxuXHRcdGZvciAodmFyIGtleSBpbiB2YXJzKSB7XHJcblx0XHRcdHRoaXNba2V5XSA9IHZhcnNba2V5XTtcclxuXHRcdH1cclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLnRhcmdldCA9IHRoaXMuY3VycmVudFRhcmdldCA9IHRhcmdldDtcclxuXHRcdHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlIHx8ICcnO1xyXG5cdFx0dGhpcy50aW1lU3RhbXAgPSB0aGlzLnRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuLypcclxuICogVE9ETzogRE9DUyAocHJpdmF0ZSBmb3IgZGV2KVxyXG4gKi9cclxuXHJcblx0dmFyIF91dGlsID0gU2Nyb2xsTWFnaWMuX3V0aWwgPSAoZnVuY3Rpb24gKHdpbmRvdykge1xyXG5cdFx0dmFyIFUgPSB7fSxcclxuXHRcdFx0aTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0ICogaW50ZXJuYWwgaGVscGVyc1xyXG5cdFx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQgKi9cclxuXHJcblx0XHQvLyBwYXJzZSBmbG9hdCBhbmQgZmFsbCBiYWNrIHRvIDAuXHJcblx0XHR2YXIgZmxvYXR2YWwgPSBmdW5jdGlvbiAobnVtYmVyKSB7XHJcblx0XHRcdHJldHVybiBwYXJzZUZsb2F0KG51bWJlcikgfHwgMDtcclxuXHRcdH07XHJcblx0XHQvLyBnZXQgY3VycmVudCBzdHlsZSBJRSBzYWZlIChvdGhlcndpc2UgSUUgd291bGQgcmV0dXJuIGNhbGN1bGF0ZWQgdmFsdWVzIGZvciAnYXV0bycpXHJcblx0XHR2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbS5jdXJyZW50U3R5bGUgPyBlbGVtLmN1cnJlbnRTdHlsZSA6IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBnZXQgZWxlbWVudCBkaW1lbnNpb24gKHdpZHRoIG9yIGhlaWdodClcclxuXHRcdHZhciBfZGltZW5zaW9uID0gZnVuY3Rpb24gKHdoaWNoLCBlbGVtLCBvdXRlciwgaW5jbHVkZU1hcmdpbikge1xyXG5cdFx0XHRlbGVtID0gKGVsZW0gPT09IGRvY3VtZW50KSA/IHdpbmRvdyA6IGVsZW07XHJcblx0XHRcdGlmIChlbGVtID09PSB3aW5kb3cpIHtcclxuXHRcdFx0XHRpbmNsdWRlTWFyZ2luID0gZmFsc2U7XHJcblx0XHRcdH0gZWxzZSBpZiAoIV90eXBlLkRvbUVsZW1lbnQoZWxlbSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHR3aGljaCA9IHdoaWNoLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd2hpY2guc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdHZhciBkaW1lbnNpb24gPSAob3V0ZXIgPyBlbGVtWydvZmZzZXQnICsgd2hpY2hdIHx8IGVsZW1bJ291dGVyJyArIHdoaWNoXSA6IGVsZW1bJ2NsaWVudCcgKyB3aGljaF0gfHwgZWxlbVsnaW5uZXInICsgd2hpY2hdKSB8fCAwO1xyXG5cdFx0XHRpZiAob3V0ZXIgJiYgaW5jbHVkZU1hcmdpbikge1xyXG5cdFx0XHRcdHZhciBzdHlsZSA9IF9nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG5cdFx0XHRcdGRpbWVuc2lvbiArPSB3aGljaCA9PT0gJ0hlaWdodCcgPyBmbG9hdHZhbChzdHlsZS5tYXJnaW5Ub3ApICsgZmxvYXR2YWwoc3R5bGUubWFyZ2luQm90dG9tKSA6IGZsb2F0dmFsKHN0eWxlLm1hcmdpbkxlZnQpICsgZmxvYXR2YWwoc3R5bGUubWFyZ2luUmlnaHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkaW1lbnNpb247XHJcblx0XHR9O1xyXG5cdFx0Ly8gY29udmVydHMgJ21hcmdpbi10b3AnIGludG8gJ21hcmdpblRvcCdcclxuXHRcdHZhciBfY2FtZWxDYXNlID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL15bXmEtel0rKFthLXpdKS9nLCAnJDEnKS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbiAoZykge1xyXG5cdFx0XHRcdHJldHVybiBnWzFdLnRvVXBwZXJDYXNlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0ICogZXh0ZXJuYWwgaGVscGVyc1xyXG5cdFx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQgKi9cclxuXHJcblx0XHQvLyBleHRlbmQgb2JqIOKAkyBzYW1lIGFzIGpRdWVyeS5leHRlbmQoe30sIG9iakEsIG9iakIpXHJcblx0XHRVLmV4dGVuZCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdFx0b2JqID0gb2JqIHx8IHt9O1xyXG5cdFx0XHRmb3IgKGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKCFhcmd1bWVudHNbaV0pIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XHJcblx0XHRcdFx0XHRpZiAoYXJndW1lbnRzW2ldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0XHRcdFx0b2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gY2hlY2sgaWYgYSBjc3MgZGlzcGxheSB0eXBlIHJlc3VsdHMgaW4gbWFyZ2luLWNvbGxhcHNlIG9yIG5vdFxyXG5cdFx0VS5pc01hcmdpbkNvbGxhcHNlVHlwZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuXHRcdFx0cmV0dXJuIFtcImJsb2NrXCIsIFwiZmxleFwiLCBcImxpc3QtaXRlbVwiLCBcInRhYmxlXCIsIFwiLXdlYmtpdC1ib3hcIl0uaW5kZXhPZihzdHIpID4gLTE7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGltcGxlbWVudGF0aW9uIG9mIHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0Ly8gYmFzZWQgb24gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzFcclxuXHRcdHZhclxyXG5cdFx0bGFzdFRpbWUgPSAwLFxyXG5cdFx0XHR2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcclxuXHRcdHZhciBfcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuXHRcdHZhciBfY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblx0XHQvLyB0cnkgdmVuZG9yIHByZWZpeGVzIGlmIHRoZSBhYm92ZSBkb2Vzbid0IHdvcmtcclxuXHRcdGZvciAoaSA9IDA7ICFfcmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIGkgPCB2ZW5kb3JzLmxlbmd0aDsgKytpKSB7XHJcblx0XHRcdF9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcclxuXHRcdFx0X2NhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmYWxsYmFja3NcclxuXHRcdGlmICghX3JlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG5cdFx0XHRfcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0Y3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuXHRcdFx0XHRcdHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSksXHJcblx0XHRcdFx0XHRpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcclxuXHRcdFx0XHRcdH0sIHRpbWVUb0NhbGwpO1xyXG5cdFx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGlmICghX2NhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcblx0XHRcdF9jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG5cdFx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0VS5yQUYgPSBfcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KTtcclxuXHRcdFUuY0FGID0gX2NhbmNlbEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KTtcclxuXHJcblx0XHR2YXJcclxuXHRcdGxvZ2xldmVscyA9IFtcImVycm9yXCIsIFwid2FyblwiLCBcImxvZ1wiXSxcclxuXHRcdFx0Y29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9O1xyXG5cclxuXHRcdGNvbnNvbGUubG9nID0gY29uc29sZS5sb2cgfHxcclxuXHRcdGZ1bmN0aW9uICgpIHt9OyAvLyBubyBjb25zb2xlIGxvZywgd2VsbCAtIGRvIG5vdGhpbmcgdGhlbi4uLlxyXG5cdFx0Ly8gbWFrZSBzdXJlIG1ldGhvZHMgZm9yIGFsbCBsZXZlbHMgZXhpc3QuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbG9nbGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBtZXRob2QgPSBsb2dsZXZlbHNbaV07XHJcblx0XHRcdGlmICghY29uc29sZVttZXRob2RdKSB7XHJcblx0XHRcdFx0Y29uc29sZVttZXRob2RdID0gY29uc29sZS5sb2c7IC8vIHByZWZlciAubG9nIG92ZXIgbm90aGluZ1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRVLmxvZyA9IGZ1bmN0aW9uIChsb2dsZXZlbCkge1xyXG5cdFx0XHRpZiAobG9nbGV2ZWwgPiBsb2dsZXZlbHMubGVuZ3RoIHx8IGxvZ2xldmVsIDw9IDApIGxvZ2xldmVsID0gbG9nbGV2ZWxzLmxlbmd0aDtcclxuXHRcdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCksXHJcblx0XHRcdFx0dGltZSA9IChcIjBcIiArIG5vdy5nZXRIb3VycygpKS5zbGljZSgtMikgKyBcIjpcIiArIChcIjBcIiArIG5vdy5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKSArIFwiOlwiICsgKFwiMFwiICsgbm93LmdldFNlY29uZHMoKSkuc2xpY2UoLTIpICsgXCI6XCIgKyAoXCIwMFwiICsgbm93LmdldE1pbGxpc2Vjb25kcygpKS5zbGljZSgtMyksXHJcblx0XHRcdFx0bWV0aG9kID0gbG9nbGV2ZWxzW2xvZ2xldmVsIC0gMV0sXHJcblx0XHRcdFx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG5cdFx0XHRcdGZ1bmMgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGVbbWV0aG9kXSwgY29uc29sZSk7XHJcblx0XHRcdGFyZ3MudW5zaGlmdCh0aW1lKTtcclxuXHRcdFx0ZnVuYy5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdCAqIHR5cGUgdGVzdGluZ1xyXG5cdFx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQgKi9cclxuXHJcblx0XHR2YXIgX3R5cGUgPSBVLnR5cGUgPSBmdW5jdGlvbiAodikge1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpLnJlcGxhY2UoL15cXFtvYmplY3QgKC4rKVxcXSQvLCBcIiQxXCIpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR9O1xyXG5cdFx0X3R5cGUuU3RyaW5nID0gZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0cmV0dXJuIF90eXBlKHYpID09PSAnc3RyaW5nJztcclxuXHRcdH07XHJcblx0XHRfdHlwZS5GdW5jdGlvbiA9IGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdHJldHVybiBfdHlwZSh2KSA9PT0gJ2Z1bmN0aW9uJztcclxuXHRcdH07XHJcblx0XHRfdHlwZS5BcnJheSA9IGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KHYpO1xyXG5cdFx0fTtcclxuXHRcdF90eXBlLk51bWJlciA9IGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdHJldHVybiAhX3R5cGUuQXJyYXkodikgJiYgKHYgLSBwYXJzZUZsb2F0KHYpICsgMSkgPj0gMDtcclxuXHRcdH07XHJcblx0XHRfdHlwZS5Eb21FbGVtZW50ID0gZnVuY3Rpb24gKG8pIHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0dHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogLy9ET00yXHJcblx0XHRcdG8gJiYgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiYgbyAhPT0gbnVsbCAmJiBvLm5vZGVUeXBlID09PSAxICYmIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiKTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdCAqIERPTSBFbGVtZW50IGluZm9cclxuXHRcdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0ICovXHJcblx0XHQvLyBhbHdheXMgcmV0dXJucyBhIGxpc3Qgb2YgbWF0Y2hpbmcgRE9NIGVsZW1lbnRzLCBmcm9tIGEgc2VsZWN0b3IsIGEgRE9NIGVsZW1lbnQgb3IgYW4gbGlzdCBvZiBlbGVtZW50cyBvciBldmVuIGFuIGFycmF5IG9mIHNlbGVjdG9yc1xyXG5cdFx0dmFyIF9nZXQgPSBVLmdldCA9IHt9O1xyXG5cdFx0X2dldC5lbGVtZW50cyA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG5cdFx0XHR2YXIgYXJyID0gW107XHJcblx0XHRcdGlmIChfdHlwZS5TdHJpbmcoc2VsZWN0b3IpKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkgeyAvLyBpbnZhbGlkIHNlbGVjdG9yXHJcblx0XHRcdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoX3R5cGUoc2VsZWN0b3IpID09PSAnbm9kZWxpc3QnIHx8IF90eXBlLkFycmF5KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCByZWYgPSBhcnIubGVuZ3RoID0gc2VsZWN0b3IubGVuZ3RoOyBpIDwgcmVmOyBpKyspIHsgLy8gbGlzdCBvZiBlbGVtZW50c1xyXG5cdFx0XHRcdFx0dmFyIGVsZW0gPSBzZWxlY3RvcltpXTtcclxuXHRcdFx0XHRcdGFycltpXSA9IF90eXBlLkRvbUVsZW1lbnQoZWxlbSkgPyBlbGVtIDogX2dldC5lbGVtZW50cyhlbGVtKTsgLy8gaWYgbm90IGFuIGVsZW1lbnQsIHRyeSB0byByZXNvbHZlIHJlY3Vyc2l2ZWx5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKF90eXBlLkRvbUVsZW1lbnQoc2VsZWN0b3IpIHx8IHNlbGVjdG9yID09PSBkb2N1bWVudCB8fCBzZWxlY3RvciA9PT0gd2luZG93KSB7XHJcblx0XHRcdFx0YXJyID0gW3NlbGVjdG9yXTsgLy8gb25seSB0aGUgZWxlbWVudFxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBhcnI7XHJcblx0XHR9O1xyXG5cdFx0Ly8gZ2V0IHNjcm9sbCB0b3AgdmFsdWVcclxuXHRcdF9nZXQuc2Nyb2xsVG9wID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuXHRcdFx0cmV0dXJuIChlbGVtICYmIHR5cGVvZiBlbGVtLnNjcm9sbFRvcCA9PT0gJ251bWJlcicpID8gZWxlbS5zY3JvbGxUb3AgOiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgMDtcclxuXHRcdH07XHJcblx0XHQvLyBnZXQgc2Nyb2xsIGxlZnQgdmFsdWVcclxuXHRcdF9nZXQuc2Nyb2xsTGVmdCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdHJldHVybiAoZWxlbSAmJiB0eXBlb2YgZWxlbS5zY3JvbGxMZWZ0ID09PSAnbnVtYmVyJykgPyBlbGVtLnNjcm9sbExlZnQgOiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcclxuXHRcdH07XHJcblx0XHQvLyBnZXQgZWxlbWVudCBoZWlnaHRcclxuXHRcdF9nZXQud2lkdGggPSBmdW5jdGlvbiAoZWxlbSwgb3V0ZXIsIGluY2x1ZGVNYXJnaW4pIHtcclxuXHRcdFx0cmV0dXJuIF9kaW1lbnNpb24oJ3dpZHRoJywgZWxlbSwgb3V0ZXIsIGluY2x1ZGVNYXJnaW4pO1xyXG5cdFx0fTtcclxuXHRcdC8vIGdldCBlbGVtZW50IHdpZHRoXHJcblx0XHRfZ2V0LmhlaWdodCA9IGZ1bmN0aW9uIChlbGVtLCBvdXRlciwgaW5jbHVkZU1hcmdpbikge1xyXG5cdFx0XHRyZXR1cm4gX2RpbWVuc2lvbignaGVpZ2h0JywgZWxlbSwgb3V0ZXIsIGluY2x1ZGVNYXJnaW4pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBnZXQgZWxlbWVudCBwb3NpdGlvbiAob3B0aW9uYWxseSByZWxhdGl2ZSB0byB2aWV3cG9ydClcclxuXHRcdF9nZXQub2Zmc2V0ID0gZnVuY3Rpb24gKGVsZW0sIHJlbGF0aXZlVG9WaWV3cG9ydCkge1xyXG5cdFx0XHR2YXIgb2Zmc2V0ID0ge1xyXG5cdFx0XHRcdHRvcDogMCxcclxuXHRcdFx0XHRsZWZ0OiAwXHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChlbGVtICYmIGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IC8vIGNoZWNrIGlmIGF2YWlsYWJsZVxyXG5cdFx0XHRcdHZhciByZWN0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0XHRvZmZzZXQudG9wID0gcmVjdC50b3A7XHJcblx0XHRcdFx0b2Zmc2V0LmxlZnQgPSByZWN0LmxlZnQ7XHJcblx0XHRcdFx0aWYgKCFyZWxhdGl2ZVRvVmlld3BvcnQpIHsgLy8gY2xpZW50UmVjdCBpcyBieSBkZWZhdWx0IHJlbGF0aXZlIHRvIHZpZXdwb3J0Li4uXHJcblx0XHRcdFx0XHRvZmZzZXQudG9wICs9IF9nZXQuc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHRvZmZzZXQubGVmdCArPSBfZ2V0LnNjcm9sbExlZnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9mZnNldDtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdCAqIERPTSBFbGVtZW50IG1hbmlwdWxhdGlvblxyXG5cdFx0ICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHQgKi9cclxuXHJcblx0XHRVLmFkZENsYXNzID0gZnVuY3Rpb24gKGVsZW0sIGNsYXNzbmFtZSkge1xyXG5cdFx0XHRpZiAoY2xhc3NuYW1lKSB7XHJcblx0XHRcdFx0aWYgKGVsZW0uY2xhc3NMaXN0KSBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NuYW1lKTtcclxuXHRcdFx0XHRlbHNlIGVsZW0uY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzbmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdFUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgY2xhc3NuYW1lKSB7XHJcblx0XHRcdGlmIChjbGFzc25hbWUpIHtcclxuXHRcdFx0XHRpZiAoZWxlbS5jbGFzc0xpc3QpIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc25hbWUpO1xyXG5cdFx0XHRcdGVsc2UgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc25hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHQvLyBpZiBvcHRpb25zIGlzIHN0cmluZyAtPiByZXR1cm5zIGNzcyB2YWx1ZVxyXG5cdFx0Ly8gaWYgb3B0aW9ucyBpcyBhcnJheSAtPiByZXR1cm5zIG9iamVjdCB3aXRoIGNzcyB2YWx1ZSBwYWlyc1xyXG5cdFx0Ly8gaWYgb3B0aW9ucyBpcyBvYmplY3QgLT4gc2V0IG5ldyBjc3MgdmFsdWVzXHJcblx0XHRVLmNzcyA9IGZ1bmN0aW9uIChlbGVtLCBvcHRpb25zKSB7XHJcblx0XHRcdGlmIChfdHlwZS5TdHJpbmcob3B0aW9ucykpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldENvbXB1dGVkU3R5bGUoZWxlbSlbX2NhbWVsQ2FzZShvcHRpb25zKV07XHJcblx0XHRcdH0gZWxzZSBpZiAoX3R5cGUuQXJyYXkob3B0aW9ucykpIHtcclxuXHRcdFx0XHR2YXJcclxuXHRcdFx0XHRvYmogPSB7fSxcclxuXHRcdFx0XHRcdHN0eWxlID0gX2dldENvbXB1dGVkU3R5bGUoZWxlbSk7XHJcblx0XHRcdFx0b3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvcHRpb24sIGtleSkge1xyXG5cdFx0XHRcdFx0b2JqW29wdGlvbl0gPSBzdHlsZVtfY2FtZWxDYXNlKG9wdGlvbildO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgb3B0aW9uIGluIG9wdGlvbnMpIHtcclxuXHRcdFx0XHRcdHZhciB2YWwgPSBvcHRpb25zW29wdGlvbl07XHJcblx0XHRcdFx0XHRpZiAodmFsID09IHBhcnNlRmxvYXQodmFsKSkgeyAvLyBhc3N1bWUgcGl4ZWwgZm9yIHNlZW1pbmdseSBudW1lcmljYWwgdmFsdWVzXHJcblx0XHRcdFx0XHRcdHZhbCArPSAncHgnO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxlbS5zdHlsZVtfY2FtZWxDYXNlKG9wdGlvbildID0gdmFsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gVTtcclxuXHR9KHdpbmRvdyB8fCB7fSkpO1xyXG5cclxuXHRTY3JvbGxNYWdpYy5TY2VuZS5wcm90b3R5cGUuYWRkSW5kaWNhdG9ycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFNjcm9sbE1hZ2ljLl91dGlsLmxvZygxLCAnKFNjcm9sbE1hZ2ljLlNjZW5lKSAtPiBFUlJPUiBjYWxsaW5nIGFkZEluZGljYXRvcnMoKSBkdWUgdG8gbWlzc2luZyBQbHVnaW4gXFwnZGVidWcuYWRkSW5kaWNhdG9yc1xcJy4gUGxlYXNlIG1ha2Ugc3VyZSB0byBpbmNsdWRlIHBsdWdpbnMvZGVidWcuYWRkSW5kaWNhdG9ycy5qcycpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdFNjcm9sbE1hZ2ljLlNjZW5lLnByb3RvdHlwZS5yZW1vdmVJbmRpY2F0b3JzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0U2Nyb2xsTWFnaWMuX3V0aWwubG9nKDEsICcoU2Nyb2xsTWFnaWMuU2NlbmUpIC0+IEVSUk9SIGNhbGxpbmcgcmVtb3ZlSW5kaWNhdG9ycygpIGR1ZSB0byBtaXNzaW5nIFBsdWdpbiBcXCdkZWJ1Zy5hZGRJbmRpY2F0b3JzXFwnLiBQbGVhc2UgbWFrZSBzdXJlIHRvIGluY2x1ZGUgcGx1Z2lucy9kZWJ1Zy5hZGRJbmRpY2F0b3JzLmpzJyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0U2Nyb2xsTWFnaWMuU2NlbmUucHJvdG90eXBlLnNldFR3ZWVuID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0U2Nyb2xsTWFnaWMuX3V0aWwubG9nKDEsICcoU2Nyb2xsTWFnaWMuU2NlbmUpIC0+IEVSUk9SIGNhbGxpbmcgc2V0VHdlZW4oKSBkdWUgdG8gbWlzc2luZyBQbHVnaW4gXFwnYW5pbWF0aW9uLmdzYXBcXCcuIFBsZWFzZSBtYWtlIHN1cmUgdG8gaW5jbHVkZSBwbHVnaW5zL2FuaW1hdGlvbi5nc2FwLmpzJyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0U2Nyb2xsTWFnaWMuU2NlbmUucHJvdG90eXBlLnJlbW92ZVR3ZWVuID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0U2Nyb2xsTWFnaWMuX3V0aWwubG9nKDEsICcoU2Nyb2xsTWFnaWMuU2NlbmUpIC0+IEVSUk9SIGNhbGxpbmcgcmVtb3ZlVHdlZW4oKSBkdWUgdG8gbWlzc2luZyBQbHVnaW4gXFwnYW5pbWF0aW9uLmdzYXBcXCcuIFBsZWFzZSBtYWtlIHN1cmUgdG8gaW5jbHVkZSBwbHVnaW5zL2FuaW1hdGlvbi5nc2FwLmpzJyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0U2Nyb2xsTWFnaWMuU2NlbmUucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0U2Nyb2xsTWFnaWMuX3V0aWwubG9nKDEsICcoU2Nyb2xsTWFnaWMuU2NlbmUpIC0+IEVSUk9SIGNhbGxpbmcgc2V0VmVsb2NpdHkoKSBkdWUgdG8gbWlzc2luZyBQbHVnaW4gXFwnYW5pbWF0aW9uLnZlbG9jaXR5XFwnLiBQbGVhc2UgbWFrZSBzdXJlIHRvIGluY2x1ZGUgcGx1Z2lucy9hbmltYXRpb24udmVsb2NpdHkuanMnKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRTY3JvbGxNYWdpYy5TY2VuZS5wcm90b3R5cGUucmVtb3ZlVmVsb2NpdHkgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRTY3JvbGxNYWdpYy5fdXRpbC5sb2coMSwgJyhTY3JvbGxNYWdpYy5TY2VuZSkgLT4gRVJST1IgY2FsbGluZyByZW1vdmVWZWxvY2l0eSgpIGR1ZSB0byBtaXNzaW5nIFBsdWdpbiBcXCdhbmltYXRpb24udmVsb2NpdHlcXCcuIFBsZWFzZSBtYWtlIHN1cmUgdG8gaW5jbHVkZSBwbHVnaW5zL2FuaW1hdGlvbi52ZWxvY2l0eS5qcycpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gU2Nyb2xsTWFnaWM7XHJcbn0pKTsiLCIvKiFcclxuICogVnVlLmpzIHYyLjEuMTBcclxuICogKGMpIDIwMTQtMjAxNyBFdmFuIFlvdVxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xyXG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG4gIChnbG9iYWwuVnVlID0gZmFjdG9yeSgpKTtcclxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XHJcblxyXG4vKiAgKi9cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgdmFsdWUgdG8gYSBzdHJpbmcgdGhhdCBpcyBhY3R1YWxseSByZW5kZXJlZC5cclxuICovXHJcbmZ1bmN0aW9uIF90b1N0cmluZyAodmFsKSB7XHJcbiAgcmV0dXJuIHZhbCA9PSBudWxsXHJcbiAgICA/ICcnXHJcbiAgICA6IHR5cGVvZiB2YWwgPT09ICdvYmplY3QnXHJcbiAgICAgID8gSlNPTi5zdHJpbmdpZnkodmFsLCBudWxsLCAyKVxyXG4gICAgICA6IFN0cmluZyh2YWwpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgaW5wdXQgdmFsdWUgdG8gYSBudW1iZXIgZm9yIHBlcnNpc3RlbmNlLlxyXG4gKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgcmV0dXJuIG9yaWdpbmFsIHN0cmluZy5cclxuICovXHJcbmZ1bmN0aW9uIHRvTnVtYmVyICh2YWwpIHtcclxuICB2YXIgbiA9IHBhcnNlRmxvYXQodmFsKTtcclxuICByZXR1cm4gaXNOYU4obikgPyB2YWwgOiBuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgbWFwIGFuZCByZXR1cm4gYSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSBrZXlcclxuICogaXMgaW4gdGhhdCBtYXAuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlTWFwIChcclxuICBzdHIsXHJcbiAgZXhwZWN0c0xvd2VyQ2FzZVxyXG4pIHtcclxuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICB2YXIgbGlzdCA9IHN0ci5zcGxpdCgnLCcpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2VcclxuICAgID8gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXTsgfVxyXG4gICAgOiBmdW5jdGlvbiAodmFsKSB7IHJldHVybiBtYXBbdmFsXTsgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgYSB0YWcgaXMgYSBidWlsdC1pbiB0YWcuXHJcbiAqL1xyXG52YXIgaXNCdWlsdEluVGFnID0gbWFrZU1hcCgnc2xvdCxjb21wb25lbnQnLCB0cnVlKTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYW4gaXRlbSBmcm9tIGFuIGFycmF5XHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmUkMSAoYXJyLCBpdGVtKSB7XHJcbiAgaWYgKGFyci5sZW5ndGgpIHtcclxuICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgcmV0dXJuIGFyci5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgd2hldGhlciB0aGUgb2JqZWN0IGhhcyB0aGUgcHJvcGVydHkuXHJcbiAqL1xyXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG5mdW5jdGlvbiBoYXNPd24gKG9iaiwga2V5KSB7XHJcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBwcmltaXRpdmVcclxuICovXHJcbmZ1bmN0aW9uIGlzUHJpbWl0aXZlICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcidcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIGNhY2hlZCB2ZXJzaW9uIG9mIGEgcHVyZSBmdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGNhY2hlZCAoZm4pIHtcclxuICB2YXIgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIHJldHVybiAoZnVuY3Rpb24gY2FjaGVkRm4gKHN0cikge1xyXG4gICAgdmFyIGhpdCA9IGNhY2hlW3N0cl07XHJcbiAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSlcclxuICB9KVxyXG59XHJcblxyXG4vKipcclxuICogQ2FtZWxpemUgYSBoeXBoZW4tZGVsaW1pdGVkIHN0cmluZy5cclxuICovXHJcbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xyXG52YXIgY2FtZWxpemUgPSBjYWNoZWQoZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCBmdW5jdGlvbiAoXywgYykgeyByZXR1cm4gYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnOyB9KVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBDYXBpdGFsaXplIGEgc3RyaW5nLlxyXG4gKi9cclxudmFyIGNhcGl0YWxpemUgPSBjYWNoZWQoZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcclxufSk7XHJcblxyXG4vKipcclxuICogSHlwaGVuYXRlIGEgY2FtZWxDYXNlIHN0cmluZy5cclxuICovXHJcbnZhciBoeXBoZW5hdGVSRSA9IC8oW14tXSkoW0EtWl0pL2c7XHJcbnZhciBoeXBoZW5hdGUgPSBjYWNoZWQoZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiBzdHJcclxuICAgIC5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKVxyXG4gICAgLnJlcGxhY2UoaHlwaGVuYXRlUkUsICckMS0kMicpXHJcbiAgICAudG9Mb3dlckNhc2UoKVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTaW1wbGUgYmluZCwgZmFzdGVyIHRoYW4gbmF0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBiaW5kJDEgKGZuLCBjdHgpIHtcclxuICBmdW5jdGlvbiBib3VuZEZuIChhKSB7XHJcbiAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICByZXR1cm4gbFxyXG4gICAgICA/IGwgPiAxXHJcbiAgICAgICAgPyBmbi5hcHBseShjdHgsIGFyZ3VtZW50cylcclxuICAgICAgICA6IGZuLmNhbGwoY3R4LCBhKVxyXG4gICAgICA6IGZuLmNhbGwoY3R4KVxyXG4gIH1cclxuICAvLyByZWNvcmQgb3JpZ2luYWwgZm4gbGVuZ3RoXHJcbiAgYm91bmRGbi5fbGVuZ3RoID0gZm4ubGVuZ3RoO1xyXG4gIHJldHVybiBib3VuZEZuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cclxuICovXHJcbmZ1bmN0aW9uIHRvQXJyYXkgKGxpc3QsIHN0YXJ0KSB7XHJcbiAgc3RhcnQgPSBzdGFydCB8fCAwO1xyXG4gIHZhciBpID0gbGlzdC5sZW5ndGggLSBzdGFydDtcclxuICB2YXIgcmV0ID0gbmV3IEFycmF5KGkpO1xyXG4gIHdoaWxlIChpLS0pIHtcclxuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XTtcclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4vKipcclxuICogTWl4IHByb3BlcnRpZXMgaW50byB0YXJnZXQgb2JqZWN0LlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0ZW5kICh0bywgX2Zyb20pIHtcclxuICBmb3IgKHZhciBrZXkgaW4gX2Zyb20pIHtcclxuICAgIHRvW2tleV0gPSBfZnJvbVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gdG9cclxufVxyXG5cclxuLyoqXHJcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxyXG4gKiBPYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcyB3aGVuIHdlIGtub3cgdGhlIHZhbHVlXHJcbiAqIGlzIGEgSlNPTi1jb21wbGlhbnQgdHlwZS5cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0IChvYmopIHtcclxuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdHJpY3Qgb2JqZWN0IHR5cGUgY2hlY2suIE9ubHkgcmV0dXJucyB0cnVlXHJcbiAqIGZvciBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdHMuXHJcbiAqL1xyXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xyXG52YXIgT0JKRUNUX1NUUklORyA9ICdbb2JqZWN0IE9iamVjdF0nO1xyXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0IChvYmopIHtcclxuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBPQkpFQ1RfU1RSSU5HXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXJnZSBhbiBBcnJheSBvZiBPYmplY3RzIGludG8gYSBzaW5nbGUgT2JqZWN0LlxyXG4gKi9cclxuZnVuY3Rpb24gdG9PYmplY3QgKGFycikge1xyXG4gIHZhciByZXMgPSB7fTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFycltpXSkge1xyXG4gICAgICBleHRlbmQocmVzLCBhcnJbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVzXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQZXJmb3JtIG5vIG9wZXJhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIG5vb3AgKCkge31cclxuXHJcbi8qKlxyXG4gKiBBbHdheXMgcmV0dXJuIGZhbHNlLlxyXG4gKi9cclxudmFyIG5vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHNhbWUgdmFsdWVcclxuICovXHJcbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlIGEgc3RhdGljIGtleXMgc3RyaW5nIGZyb20gY29tcGlsZXIgbW9kdWxlcy5cclxuICovXHJcbmZ1bmN0aW9uIGdlblN0YXRpY0tleXMgKG1vZHVsZXMpIHtcclxuICByZXR1cm4gbW9kdWxlcy5yZWR1Y2UoZnVuY3Rpb24gKGtleXMsIG0pIHtcclxuICAgIHJldHVybiBrZXlzLmNvbmNhdChtLnN0YXRpY0tleXMgfHwgW10pXHJcbiAgfSwgW10pLmpvaW4oJywnKVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdHdvIHZhbHVlcyBhcmUgbG9vc2VseSBlcXVhbCAtIHRoYXQgaXMsXHJcbiAqIGlmIHRoZXkgYXJlIHBsYWluIG9iamVjdHMsIGRvIHRoZXkgaGF2ZSB0aGUgc2FtZSBzaGFwZT9cclxuICovXHJcbmZ1bmN0aW9uIGxvb3NlRXF1YWwgKGEsIGIpIHtcclxuICB2YXIgaXNPYmplY3RBID0gaXNPYmplY3QoYSk7XHJcbiAgdmFyIGlzT2JqZWN0QiA9IGlzT2JqZWN0KGIpO1xyXG4gIGlmIChpc09iamVjdEEgJiYgaXNPYmplY3RCKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpXHJcbiAgfSBlbHNlIGlmICghaXNPYmplY3RBICYmICFpc09iamVjdEIpIHtcclxuICAgIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvb3NlSW5kZXhPZiAoYXJyLCB2YWwpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGxvb3NlRXF1YWwoYXJyW2ldLCB2YWwpKSB7IHJldHVybiBpIH1cclxuICB9XHJcbiAgcmV0dXJuIC0xXHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGNvbmZpZyA9IHtcclxuICAvKipcclxuICAgKiBPcHRpb24gbWVyZ2Ugc3RyYXRlZ2llcyAodXNlZCBpbiBjb3JlL3V0aWwvb3B0aW9ucylcclxuICAgKi9cclxuICBvcHRpb25NZXJnZVN0cmF0ZWdpZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXHJcblxyXG4gIC8qKlxyXG4gICAqIFdoZXRoZXIgdG8gc3VwcHJlc3Mgd2FybmluZ3MuXHJcbiAgICovXHJcbiAgc2lsZW50OiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogV2hldGhlciB0byBlbmFibGUgZGV2dG9vbHNcclxuICAgKi9cclxuICBkZXZ0b29sczogXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicsXHJcblxyXG4gIC8qKlxyXG4gICAqIEVycm9yIGhhbmRsZXIgZm9yIHdhdGNoZXIgZXJyb3JzXHJcbiAgICovXHJcbiAgZXJyb3JIYW5kbGVyOiBudWxsLFxyXG5cclxuICAvKipcclxuICAgKiBJZ25vcmUgY2VydGFpbiBjdXN0b20gZWxlbWVudHNcclxuICAgKi9cclxuICBpZ25vcmVkRWxlbWVudHM6IFtdLFxyXG5cclxuICAvKipcclxuICAgKiBDdXN0b20gdXNlciBrZXkgYWxpYXNlcyBmb3Igdi1vblxyXG4gICAqL1xyXG4gIGtleUNvZGVzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIHRhZyBpcyByZXNlcnZlZCBzbyB0aGF0IGl0IGNhbm5vdCBiZSByZWdpc3RlcmVkIGFzIGFcclxuICAgKiBjb21wb25lbnQuIFRoaXMgaXMgcGxhdGZvcm0tZGVwZW5kZW50IGFuZCBtYXkgYmUgb3ZlcndyaXR0ZW4uXHJcbiAgICovXHJcbiAgaXNSZXNlcnZlZFRhZzogbm8sXHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgdGFnIGlzIGFuIHVua25vd24gZWxlbWVudC5cclxuICAgKiBQbGF0Zm9ybS1kZXBlbmRlbnQuXHJcbiAgICovXHJcbiAgaXNVbmtub3duRWxlbWVudDogbm8sXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgbmFtZXNwYWNlIG9mIGFuIGVsZW1lbnRcclxuICAgKi9cclxuICBnZXRUYWdOYW1lc3BhY2U6IG5vb3AsXHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIHRoZSByZWFsIHRhZyBuYW1lIGZvciB0aGUgc3BlY2lmaWMgcGxhdGZvcm0uXHJcbiAgICovXHJcbiAgcGFyc2VQbGF0Zm9ybVRhZ05hbWU6IGlkZW50aXR5LFxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgbXVzdCBiZSBib3VuZCB1c2luZyBwcm9wZXJ0eSwgZS5nLiB2YWx1ZVxyXG4gICAqIFBsYXRmb3JtLWRlcGVuZGVudC5cclxuICAgKi9cclxuICBtdXN0VXNlUHJvcDogbm8sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3Qgb2YgYXNzZXQgdHlwZXMgdGhhdCBhIGNvbXBvbmVudCBjYW4gb3duLlxyXG4gICAqL1xyXG4gIF9hc3NldFR5cGVzOiBbXHJcbiAgICAnY29tcG9uZW50JyxcclxuICAgICdkaXJlY3RpdmUnLFxyXG4gICAgJ2ZpbHRlcidcclxuICBdLFxyXG5cclxuICAvKipcclxuICAgKiBMaXN0IG9mIGxpZmVjeWNsZSBob29rcy5cclxuICAgKi9cclxuICBfbGlmZWN5Y2xlSG9va3M6IFtcclxuICAgICdiZWZvcmVDcmVhdGUnLFxyXG4gICAgJ2NyZWF0ZWQnLFxyXG4gICAgJ2JlZm9yZU1vdW50JyxcclxuICAgICdtb3VudGVkJyxcclxuICAgICdiZWZvcmVVcGRhdGUnLFxyXG4gICAgJ3VwZGF0ZWQnLFxyXG4gICAgJ2JlZm9yZURlc3Ryb3knLFxyXG4gICAgJ2Rlc3Ryb3llZCcsXHJcbiAgICAnYWN0aXZhdGVkJyxcclxuICAgICdkZWFjdGl2YXRlZCdcclxuICBdLFxyXG5cclxuICAvKipcclxuICAgKiBNYXggY2lyY3VsYXIgdXBkYXRlcyBhbGxvd2VkIGluIGEgc2NoZWR1bGVyIGZsdXNoIGN5Y2xlLlxyXG4gICAqL1xyXG4gIF9tYXhVcGRhdGVDb3VudDogMTAwXHJcbn07XHJcblxyXG4vKiAgKi9cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVzZXJ2ZWQgKHN0cikge1xyXG4gIHZhciBjID0gKHN0ciArICcnKS5jaGFyQ29kZUF0KDApO1xyXG4gIHJldHVybiBjID09PSAweDI0IHx8IGMgPT09IDB4NUZcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmluZSBhIHByb3BlcnR5LlxyXG4gKi9cclxuZnVuY3Rpb24gZGVmIChvYmosIGtleSwgdmFsLCBlbnVtZXJhYmxlKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICB2YWx1ZTogdmFsLFxyXG4gICAgZW51bWVyYWJsZTogISFlbnVtZXJhYmxlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IHRydWVcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnNlIHNpbXBsZSBwYXRoLlxyXG4gKi9cclxudmFyIGJhaWxSRSA9IC9bXlxcdy4kXS87XHJcbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xyXG4gIGlmIChiYWlsUkUudGVzdChwYXRoKSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy4nKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoIW9iaikgeyByZXR1cm4gfVxyXG4gICAgICAgIG9iaiA9IG9ialtzZWdtZW50c1tpXV07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcbi8qIGdsb2JhbHMgTXV0YXRpb25PYnNlcnZlciAqL1xyXG5cclxuLy8gY2FuIHdlIHVzZSBfX3Byb3RvX18/XHJcbnZhciBoYXNQcm90byA9ICdfX3Byb3RvX18nIGluIHt9O1xyXG5cclxuLy8gQnJvd3NlciBlbnZpcm9ubWVudCBzbmlmZmluZ1xyXG52YXIgaW5Ccm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XHJcbnZhciBVQSA9IGluQnJvd3NlciAmJiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xyXG52YXIgaXNJRSA9IFVBICYmIC9tc2llfHRyaWRlbnQvLnRlc3QoVUEpO1xyXG52YXIgaXNJRTkgPSBVQSAmJiBVQS5pbmRleE9mKCdtc2llIDkuMCcpID4gMDtcclxudmFyIGlzRWRnZSA9IFVBICYmIFVBLmluZGV4T2YoJ2VkZ2UvJykgPiAwO1xyXG52YXIgaXNBbmRyb2lkID0gVUEgJiYgVUEuaW5kZXhPZignYW5kcm9pZCcpID4gMDtcclxudmFyIGlzSU9TID0gVUEgJiYgL2lwaG9uZXxpcGFkfGlwb2R8aW9zLy50ZXN0KFVBKTtcclxuXHJcbi8vIHRoaXMgbmVlZHMgdG8gYmUgbGF6eS1ldmFsZWQgYmVjYXVzZSB2dWUgbWF5IGJlIHJlcXVpcmVkIGJlZm9yZVxyXG4vLyB2dWUtc2VydmVyLXJlbmRlcmVyIGNhbiBzZXQgVlVFX0VOVlxyXG52YXIgX2lzU2VydmVyO1xyXG52YXIgaXNTZXJ2ZXJSZW5kZXJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKF9pc1NlcnZlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmICghaW5Ccm93c2VyICYmIHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIC8vIGRldGVjdCBwcmVzZW5jZSBvZiB2dWUtc2VydmVyLXJlbmRlcmVyIGFuZCBhdm9pZFxyXG4gICAgICAvLyBXZWJwYWNrIHNoaW1taW5nIHRoZSBwcm9jZXNzXHJcbiAgICAgIF9pc1NlcnZlciA9IGdsb2JhbFsncHJvY2VzcyddLmVudi5WVUVfRU5WID09PSAnc2VydmVyJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9pc1NlcnZlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gX2lzU2VydmVyXHJcbn07XHJcblxyXG4vLyBkZXRlY3QgZGV2dG9vbHNcclxudmFyIGRldnRvb2xzID0gaW5Ccm93c2VyICYmIHdpbmRvdy5fX1ZVRV9ERVZUT09MU19HTE9CQUxfSE9PS19fO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuZnVuY3Rpb24gaXNOYXRpdmUgKEN0b3IpIHtcclxuICByZXR1cm4gL25hdGl2ZSBjb2RlLy50ZXN0KEN0b3IudG9TdHJpbmcoKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmVyIGEgdGFzayB0byBleGVjdXRlIGl0IGFzeW5jaHJvbm91c2x5LlxyXG4gKi9cclxudmFyIG5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY2FsbGJhY2tzID0gW107XHJcbiAgdmFyIHBlbmRpbmcgPSBmYWxzZTtcclxuICB2YXIgdGltZXJGdW5jO1xyXG5cclxuICBmdW5jdGlvbiBuZXh0VGlja0hhbmRsZXIgKCkge1xyXG4gICAgcGVuZGluZyA9IGZhbHNlO1xyXG4gICAgdmFyIGNvcGllcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcclxuICAgIGNhbGxiYWNrcy5sZW5ndGggPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3BpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29waWVzW2ldKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyB0aGUgbmV4dFRpY2sgYmVoYXZpb3IgbGV2ZXJhZ2VzIHRoZSBtaWNyb3Rhc2sgcXVldWUsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZFxyXG4gIC8vIHZpYSBlaXRoZXIgbmF0aXZlIFByb21pc2UudGhlbiBvciBNdXRhdGlvbk9ic2VydmVyLlxyXG4gIC8vIE11dGF0aW9uT2JzZXJ2ZXIgaGFzIHdpZGVyIHN1cHBvcnQsIGhvd2V2ZXIgaXQgaXMgc2VyaW91c2x5IGJ1Z2dlZCBpblxyXG4gIC8vIFVJV2ViVmlldyBpbiBpT1MgPj0gOS4zLjMgd2hlbiB0cmlnZ2VyZWQgaW4gdG91Y2ggZXZlbnQgaGFuZGxlcnMuIEl0XHJcbiAgLy8gY29tcGxldGVseSBzdG9wcyB3b3JraW5nIGFmdGVyIHRyaWdnZXJpbmcgYSBmZXcgdGltZXMuLi4gc28sIGlmIG5hdGl2ZVxyXG4gIC8vIFByb21pc2UgaXMgYXZhaWxhYmxlLCB3ZSB3aWxsIHVzZSBpdDpcclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICBpZiAodHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFByb21pc2UpKSB7XHJcbiAgICB2YXIgcCA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH07XHJcbiAgICB0aW1lckZ1bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHAudGhlbihuZXh0VGlja0hhbmRsZXIpLmNhdGNoKGxvZ0Vycm9yKTtcclxuICAgICAgLy8gaW4gcHJvYmxlbWF0aWMgVUlXZWJWaWV3cywgUHJvbWlzZS50aGVuIGRvZXNuJ3QgY29tcGxldGVseSBicmVhaywgYnV0XHJcbiAgICAgIC8vIGl0IGNhbiBnZXQgc3R1Y2sgaW4gYSB3ZWlyZCBzdGF0ZSB3aGVyZSBjYWxsYmFja3MgYXJlIHB1c2hlZCBpbnRvIHRoZVxyXG4gICAgICAvLyBtaWNyb3Rhc2sgcXVldWUgYnV0IHRoZSBxdWV1ZSBpc24ndCBiZWluZyBmbHVzaGVkLCB1bnRpbCB0aGUgYnJvd3NlclxyXG4gICAgICAvLyBuZWVkcyB0byBkbyBzb21lIG90aGVyIHdvcmssIGUuZy4gaGFuZGxlIGEgdGltZXIuIFRoZXJlZm9yZSB3ZSBjYW5cclxuICAgICAgLy8gXCJmb3JjZVwiIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZmx1c2hlZCBieSBhZGRpbmcgYW4gZW1wdHkgdGltZXIuXHJcbiAgICAgIGlmIChpc0lPUykgeyBzZXRUaW1lb3V0KG5vb3ApOyB9XHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnICYmIChcclxuICAgIGlzTmF0aXZlKE11dGF0aW9uT2JzZXJ2ZXIpIHx8XHJcbiAgICAvLyBQaGFudG9tSlMgYW5kIGlPUyA3LnhcclxuICAgIE11dGF0aW9uT2JzZXJ2ZXIudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgTXV0YXRpb25PYnNlcnZlckNvbnN0cnVjdG9yXSdcclxuICApKSB7XHJcbiAgICAvLyB1c2UgTXV0YXRpb25PYnNlcnZlciB3aGVyZSBuYXRpdmUgUHJvbWlzZSBpcyBub3QgYXZhaWxhYmxlLFxyXG4gICAgLy8gZS5nLiBQaGFudG9tSlMgSUUxMSwgaU9TNywgQW5kcm9pZCA0LjRcclxuICAgIHZhciBjb3VudGVyID0gMTtcclxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG5leHRUaWNrSGFuZGxlcik7XHJcbiAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShTdHJpbmcoY291bnRlcikpO1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0Tm9kZSwge1xyXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyO1xyXG4gICAgICB0ZXh0Tm9kZS5kYXRhID0gU3RyaW5nKGNvdW50ZXIpO1xyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gZmFsbGJhY2sgdG8gc2V0VGltZW91dFxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2V0VGltZW91dChuZXh0VGlja0hhbmRsZXIsIDApO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiBxdWV1ZU5leHRUaWNrIChjYiwgY3R4KSB7XHJcbiAgICB2YXIgX3Jlc29sdmU7XHJcbiAgICBjYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChjYikgeyBjYi5jYWxsKGN0eCk7IH1cclxuICAgICAgaWYgKF9yZXNvbHZlKSB7IF9yZXNvbHZlKGN0eCk7IH1cclxuICAgIH0pO1xyXG4gICAgaWYgKCFwZW5kaW5nKSB7XHJcbiAgICAgIHBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICB0aW1lckZ1bmMoKTtcclxuICAgIH1cclxuICAgIGlmICghY2IgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pKCk7XHJcblxyXG52YXIgX1NldDtcclxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbmlmICh0eXBlb2YgU2V0ICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShTZXQpKSB7XHJcbiAgLy8gdXNlIG5hdGl2ZSBTZXQgd2hlbiBhdmFpbGFibGUuXHJcbiAgX1NldCA9IFNldDtcclxufSBlbHNlIHtcclxuICAvLyBhIG5vbi1zdGFuZGFyZCBTZXQgcG9seWZpbGwgdGhhdCBvbmx5IHdvcmtzIHdpdGggcHJpbWl0aXZlIGtleXMuXHJcbiAgX1NldCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTZXQgKCkge1xyXG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICB9XHJcbiAgICBTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNldFtrZXldID09PSB0cnVlXHJcbiAgICB9O1xyXG4gICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQgKGtleSkge1xyXG4gICAgICB0aGlzLnNldFtrZXldID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICBTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xyXG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBTZXQ7XHJcbiAgfSgpKTtcclxufVxyXG5cclxudmFyIHdhcm4gPSBub29wO1xyXG52YXIgZm9ybWF0Q29tcG9uZW50TmFtZTtcclxuXHJcbntcclxuICB2YXIgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJztcclxuXHJcbiAgd2FybiA9IGZ1bmN0aW9uIChtc2csIHZtKSB7XHJcbiAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQpKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbVnVlIHdhcm5dOiBcIiArIG1zZyArIFwiIFwiICsgKFxyXG4gICAgICAgIHZtID8gZm9ybWF0TG9jYXRpb24oZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpIDogJydcclxuICAgICAgKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZm9ybWF0Q29tcG9uZW50TmFtZSA9IGZ1bmN0aW9uICh2bSkge1xyXG4gICAgaWYgKHZtLiRyb290ID09PSB2bSkge1xyXG4gICAgICByZXR1cm4gJ3Jvb3QgaW5zdGFuY2UnXHJcbiAgICB9XHJcbiAgICB2YXIgbmFtZSA9IHZtLl9pc1Z1ZVxyXG4gICAgICA/IHZtLiRvcHRpb25zLm5hbWUgfHwgdm0uJG9wdGlvbnMuX2NvbXBvbmVudFRhZ1xyXG4gICAgICA6IHZtLm5hbWU7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAobmFtZSA/IChcImNvbXBvbmVudCA8XCIgKyBuYW1lICsgXCI+XCIpIDogXCJhbm9ueW1vdXMgY29tcG9uZW50XCIpICtcclxuICAgICAgKHZtLl9pc1Z1ZSAmJiB2bS4kb3B0aW9ucy5fX2ZpbGUgPyAoXCIgYXQgXCIgKyAodm0uJG9wdGlvbnMuX19maWxlKSkgOiAnJylcclxuICAgIClcclxuICB9O1xyXG5cclxuICB2YXIgZm9ybWF0TG9jYXRpb24gPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICBpZiAoc3RyID09PSAnYW5vbnltb3VzIGNvbXBvbmVudCcpIHtcclxuICAgICAgc3RyICs9IFwiIC0gdXNlIHRoZSBcXFwibmFtZVxcXCIgb3B0aW9uIGZvciBiZXR0ZXIgZGVidWdnaW5nIG1lc3NhZ2VzLlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcIlxcbihmb3VuZCBpbiBcIiArIHN0ciArIFwiKVwiKVxyXG4gIH07XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuXHJcbnZhciB1aWQkMSA9IDA7XHJcblxyXG4vKipcclxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXHJcbiAqIGRpcmVjdGl2ZXMgc3Vic2NyaWJpbmcgdG8gaXQuXHJcbiAqL1xyXG52YXIgRGVwID0gZnVuY3Rpb24gRGVwICgpIHtcclxuICB0aGlzLmlkID0gdWlkJDErKztcclxuICB0aGlzLnN1YnMgPSBbXTtcclxufTtcclxuXHJcbkRlcC5wcm90b3R5cGUuYWRkU3ViID0gZnVuY3Rpb24gYWRkU3ViIChzdWIpIHtcclxuICB0aGlzLnN1YnMucHVzaChzdWIpO1xyXG59O1xyXG5cclxuRGVwLnByb3RvdHlwZS5yZW1vdmVTdWIgPSBmdW5jdGlvbiByZW1vdmVTdWIgKHN1Yikge1xyXG4gIHJlbW92ZSQxKHRoaXMuc3Vicywgc3ViKTtcclxufTtcclxuXHJcbkRlcC5wcm90b3R5cGUuZGVwZW5kID0gZnVuY3Rpb24gZGVwZW5kICgpIHtcclxuICBpZiAoRGVwLnRhcmdldCkge1xyXG4gICAgRGVwLnRhcmdldC5hZGREZXAodGhpcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuRGVwLnByb3RvdHlwZS5ub3RpZnkgPSBmdW5jdGlvbiBub3RpZnkgKCkge1xyXG4gIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcclxuICB2YXIgc3VicyA9IHRoaXMuc3Vicy5zbGljZSgpO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc3Vicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIHN1YnNbaV0udXBkYXRlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gdGhlIGN1cnJlbnQgdGFyZ2V0IHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkLlxyXG4vLyB0aGlzIGlzIGdsb2JhbGx5IHVuaXF1ZSBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG9ubHkgb25lXHJcbi8vIHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkIGF0IGFueSB0aW1lLlxyXG5EZXAudGFyZ2V0ID0gbnVsbDtcclxudmFyIHRhcmdldFN0YWNrID0gW107XHJcblxyXG5mdW5jdGlvbiBwdXNoVGFyZ2V0IChfdGFyZ2V0KSB7XHJcbiAgaWYgKERlcC50YXJnZXQpIHsgdGFyZ2V0U3RhY2sucHVzaChEZXAudGFyZ2V0KTsgfVxyXG4gIERlcC50YXJnZXQgPSBfdGFyZ2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3BUYXJnZXQgKCkge1xyXG4gIERlcC50YXJnZXQgPSB0YXJnZXRTdGFjay5wb3AoKTtcclxufVxyXG5cclxuLypcclxuICogbm90IHR5cGUgY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgZmxvdyBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoXHJcbiAqIGR5bmFtaWNhbGx5IGFjY2Vzc2luZyBtZXRob2RzIG9uIEFycmF5IHByb3RvdHlwZVxyXG4gKi9cclxuXHJcbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xyXG52YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmNyZWF0ZShhcnJheVByb3RvKTtbXHJcbiAgJ3B1c2gnLFxyXG4gICdwb3AnLFxyXG4gICdzaGlmdCcsXHJcbiAgJ3Vuc2hpZnQnLFxyXG4gICdzcGxpY2UnLFxyXG4gICdzb3J0JyxcclxuICAncmV2ZXJzZSdcclxuXVxyXG4uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XHJcbiAgLy8gY2FjaGUgb3JpZ2luYWwgbWV0aG9kXHJcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdO1xyXG4gIGRlZihhcnJheU1ldGhvZHMsIG1ldGhvZCwgZnVuY3Rpb24gbXV0YXRvciAoKSB7XHJcbiAgICB2YXIgYXJndW1lbnRzJDEgPSBhcmd1bWVudHM7XHJcblxyXG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XHJcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXHJcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKTtcclxuICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50cyQxW2ldO1xyXG4gICAgfVxyXG4gICAgdmFyIHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX187XHJcbiAgICB2YXIgaW5zZXJ0ZWQ7XHJcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xyXG4gICAgICBjYXNlICdwdXNoJzpcclxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3M7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5zaGlmdCc6XHJcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3NwbGljZSc6XHJcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBpZiAoaW5zZXJ0ZWQpIHsgb2Iub2JzZXJ2ZUFycmF5KGluc2VydGVkKTsgfVxyXG4gICAgLy8gbm90aWZ5IGNoYW5nZVxyXG4gICAgb2IuZGVwLm5vdGlmeSgpO1xyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG4gIH0pO1xyXG59KTtcclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGFycmF5S2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFycmF5TWV0aG9kcyk7XHJcblxyXG4vKipcclxuICogQnkgZGVmYXVsdCwgd2hlbiBhIHJlYWN0aXZlIHByb3BlcnR5IGlzIHNldCwgdGhlIG5ldyB2YWx1ZSBpc1xyXG4gKiBhbHNvIGNvbnZlcnRlZCB0byBiZWNvbWUgcmVhY3RpdmUuIEhvd2V2ZXIgd2hlbiBwYXNzaW5nIGRvd24gcHJvcHMsXHJcbiAqIHdlIGRvbid0IHdhbnQgdG8gZm9yY2UgY29udmVyc2lvbiBiZWNhdXNlIHRoZSB2YWx1ZSBtYXkgYmUgYSBuZXN0ZWQgdmFsdWVcclxuICogdW5kZXIgYSBmcm96ZW4gZGF0YSBzdHJ1Y3R1cmUuIENvbnZlcnRpbmcgaXQgd291bGQgZGVmZWF0IHRoZSBvcHRpbWl6YXRpb24uXHJcbiAqL1xyXG52YXIgb2JzZXJ2ZXJTdGF0ZSA9IHtcclxuICBzaG91bGRDb252ZXJ0OiB0cnVlLFxyXG4gIGlzU2V0dGluZ1Byb3BzOiBmYWxzZVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcclxuICogb2JqZWN0LiBPbmNlIGF0dGFjaGVkLCB0aGUgb2JzZXJ2ZXIgY29udmVydHMgdGFyZ2V0XHJcbiAqIG9iamVjdCdzIHByb3BlcnR5IGtleXMgaW50byBnZXR0ZXIvc2V0dGVycyB0aGF0XHJcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXHJcbiAqL1xyXG52YXIgT2JzZXJ2ZXIgPSBmdW5jdGlvbiBPYnNlcnZlciAodmFsdWUpIHtcclxuICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgdGhpcy5kZXAgPSBuZXcgRGVwKCk7XHJcbiAgdGhpcy52bUNvdW50ID0gMDtcclxuICBkZWYodmFsdWUsICdfX29iX18nLCB0aGlzKTtcclxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgIHZhciBhdWdtZW50ID0gaGFzUHJvdG9cclxuICAgICAgPyBwcm90b0F1Z21lbnRcclxuICAgICAgOiBjb3B5QXVnbWVudDtcclxuICAgIGF1Z21lbnQodmFsdWUsIGFycmF5TWV0aG9kcywgYXJyYXlLZXlzKTtcclxuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy53YWxrKHZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogV2FsayB0aHJvdWdoIGVhY2ggcHJvcGVydHkgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXHJcbiAqIGdldHRlci9zZXR0ZXJzLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlblxyXG4gKiB2YWx1ZSB0eXBlIGlzIE9iamVjdC5cclxuICovXHJcbk9ic2VydmVyLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gd2FsayAob2JqKSB7XHJcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgZGVmaW5lUmVhY3RpdmUkJDEob2JqLCBrZXlzW2ldLCBvYmpba2V5c1tpXV0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBPYnNlcnZlIGEgbGlzdCBvZiBBcnJheSBpdGVtcy5cclxuICovXHJcbk9ic2VydmVyLnByb3RvdHlwZS5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiBvYnNlcnZlQXJyYXkgKGl0ZW1zKSB7XHJcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIG9ic2VydmUoaXRlbXNbaV0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIGhlbHBlcnNcclxuXHJcbi8qKlxyXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXHJcbiAqIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgX19wcm90b19fXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQgKHRhcmdldCwgc3JjKSB7XHJcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cclxuICB0YXJnZXQuX19wcm90b19fID0gc3JjO1xyXG4gIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cclxufVxyXG5cclxuLyoqXHJcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBkZWZpbmluZ1xyXG4gKiBoaWRkZW4gcHJvcGVydGllcy5cclxuICovXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbmZ1bmN0aW9uIGNvcHlBdWdtZW50ICh0YXJnZXQsIHNyYywga2V5cykge1xyXG4gIGZvciAodmFyIGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xyXG4gICAgZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXR0ZW1wdCB0byBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGEgdmFsdWUsXHJcbiAqIHJldHVybnMgdGhlIG5ldyBvYnNlcnZlciBpZiBzdWNjZXNzZnVsbHkgb2JzZXJ2ZWQsXHJcbiAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxyXG4gKi9cclxuZnVuY3Rpb24gb2JzZXJ2ZSAodmFsdWUsIGFzUm9vdERhdGEpIHtcclxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHZhciBvYjtcclxuICBpZiAoaGFzT3duKHZhbHVlLCAnX19vYl9fJykgJiYgdmFsdWUuX19vYl9fIGluc3RhbmNlb2YgT2JzZXJ2ZXIpIHtcclxuICAgIG9iID0gdmFsdWUuX19vYl9fO1xyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgJiZcclxuICAgICFpc1NlcnZlclJlbmRlcmluZygpICYmXHJcbiAgICAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgaXNQbGFpbk9iamVjdCh2YWx1ZSkpICYmXHJcbiAgICBPYmplY3QuaXNFeHRlbnNpYmxlKHZhbHVlKSAmJlxyXG4gICAgIXZhbHVlLl9pc1Z1ZVxyXG4gICkge1xyXG4gICAgb2IgPSBuZXcgT2JzZXJ2ZXIodmFsdWUpO1xyXG4gIH1cclxuICBpZiAoYXNSb290RGF0YSAmJiBvYikge1xyXG4gICAgb2Iudm1Db3VudCsrO1xyXG4gIH1cclxuICByZXR1cm4gb2JcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmluZSBhIHJlYWN0aXZlIHByb3BlcnR5IG9uIGFuIE9iamVjdC5cclxuICovXHJcbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlJCQxIChcclxuICBvYmosXHJcbiAga2V5LFxyXG4gIHZhbCxcclxuICBjdXN0b21TZXR0ZXJcclxuKSB7XHJcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKTtcclxuXHJcbiAgdmFyIHByb3BlcnR5ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSk7XHJcbiAgaWYgKHByb3BlcnR5ICYmIHByb3BlcnR5LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gY2F0ZXIgZm9yIHByZS1kZWZpbmVkIGdldHRlci9zZXR0ZXJzXHJcbiAgdmFyIGdldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LmdldDtcclxuICB2YXIgc2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuc2V0O1xyXG5cclxuICB2YXIgY2hpbGRPYiA9IG9ic2VydmUodmFsKTtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyICgpIHtcclxuICAgICAgdmFyIHZhbHVlID0gZ2V0dGVyID8gZ2V0dGVyLmNhbGwob2JqKSA6IHZhbDtcclxuICAgICAgaWYgKERlcC50YXJnZXQpIHtcclxuICAgICAgICBkZXAuZGVwZW5kKCk7XHJcbiAgICAgICAgaWYgKGNoaWxkT2IpIHtcclxuICAgICAgICAgIGNoaWxkT2IuZGVwLmRlcGVuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIGRlcGVuZEFycmF5KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlciAobmV3VmFsKSB7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xyXG4gICAgICBpZiAobmV3VmFsID09PSB2YWx1ZSB8fCAobmV3VmFsICE9PSBuZXdWYWwgJiYgdmFsdWUgIT09IHZhbHVlKSkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlICovXHJcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjdXN0b21TZXR0ZXIpIHtcclxuICAgICAgICBjdXN0b21TZXR0ZXIoKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoc2V0dGVyKSB7XHJcbiAgICAgICAgc2V0dGVyLmNhbGwob2JqLCBuZXdWYWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbCA9IG5ld1ZhbDtcclxuICAgICAgfVxyXG4gICAgICBjaGlsZE9iID0gb2JzZXJ2ZShuZXdWYWwpO1xyXG4gICAgICBkZXAubm90aWZ5KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuIEFkZHMgdGhlIG5ldyBwcm9wZXJ0eSBhbmRcclxuICogdHJpZ2dlcnMgY2hhbmdlIG5vdGlmaWNhdGlvbiBpZiB0aGUgcHJvcGVydHkgZG9lc24ndFxyXG4gKiBhbHJlYWR5IGV4aXN0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0JDEgKG9iaiwga2V5LCB2YWwpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XHJcbiAgICBvYmoubGVuZ3RoID0gTWF0aC5tYXgob2JqLmxlbmd0aCwga2V5KTtcclxuICAgIG9iai5zcGxpY2Uoa2V5LCAxLCB2YWwpO1xyXG4gICAgcmV0dXJuIHZhbFxyXG4gIH1cclxuICBpZiAoaGFzT3duKG9iaiwga2V5KSkge1xyXG4gICAgb2JqW2tleV0gPSB2YWw7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdmFyIG9iID0gb2JqLl9fb2JfXztcclxuICBpZiAob2JqLl9pc1Z1ZSB8fCAob2IgJiYgb2Iudm1Db3VudCkpIHtcclxuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICdBdm9pZCBhZGRpbmcgcmVhY3RpdmUgcHJvcGVydGllcyB0byBhIFZ1ZSBpbnN0YW5jZSBvciBpdHMgcm9vdCAkZGF0YSAnICtcclxuICAgICAgJ2F0IHJ1bnRpbWUgLSBkZWNsYXJlIGl0IHVwZnJvbnQgaW4gdGhlIGRhdGEgb3B0aW9uLidcclxuICAgICk7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgaWYgKCFvYikge1xyXG4gICAgb2JqW2tleV0gPSB2YWw7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgZGVmaW5lUmVhY3RpdmUkJDEob2IudmFsdWUsIGtleSwgdmFsKTtcclxuICBvYi5kZXAubm90aWZ5KCk7XHJcbiAgcmV0dXJuIHZhbFxyXG59XHJcblxyXG4vKipcclxuICogRGVsZXRlIGEgcHJvcGVydHkgYW5kIHRyaWdnZXIgY2hhbmdlIGlmIG5lY2Vzc2FyeS5cclxuICovXHJcbmZ1bmN0aW9uIGRlbCAob2JqLCBrZXkpIHtcclxuICB2YXIgb2IgPSBvYmouX19vYl9fO1xyXG4gIGlmIChvYmouX2lzVnVlIHx8IChvYiAmJiBvYi52bUNvdW50KSkge1xyXG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgJ0F2b2lkIGRlbGV0aW5nIHByb3BlcnRpZXMgb24gYSBWdWUgaW5zdGFuY2Ugb3IgaXRzIHJvb3QgJGRhdGEgJyArXHJcbiAgICAgICctIGp1c3Qgc2V0IGl0IHRvIG51bGwuJ1xyXG4gICAgKTtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBpZiAoIWhhc093bihvYmosIGtleSkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBkZWxldGUgb2JqW2tleV07XHJcbiAgaWYgKCFvYikge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIG9iLmRlcC5ub3RpZnkoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxlY3QgZGVwZW5kZW5jaWVzIG9uIGFycmF5IGVsZW1lbnRzIHdoZW4gdGhlIGFycmF5IGlzIHRvdWNoZWQsIHNpbmNlXHJcbiAqIHdlIGNhbm5vdCBpbnRlcmNlcHQgYXJyYXkgZWxlbWVudCBhY2Nlc3MgbGlrZSBwcm9wZXJ0eSBnZXR0ZXJzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVwZW5kQXJyYXkgKHZhbHVlKSB7XHJcbiAgZm9yICh2YXIgZSA9ICh2b2lkIDApLCBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgZSA9IHZhbHVlW2ldO1xyXG4gICAgZSAmJiBlLl9fb2JfXyAmJiBlLl9fb2JfXy5kZXAuZGVwZW5kKCk7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xyXG4gICAgICBkZXBlbmRBcnJheShlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuLyoqXHJcbiAqIE9wdGlvbiBvdmVyd3JpdGluZyBzdHJhdGVnaWVzIGFyZSBmdW5jdGlvbnMgdGhhdCBoYW5kbGVcclxuICogaG93IHRvIG1lcmdlIGEgcGFyZW50IG9wdGlvbiB2YWx1ZSBhbmQgYSBjaGlsZCBvcHRpb25cclxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXHJcbiAqL1xyXG52YXIgc3RyYXRzID0gY29uZmlnLm9wdGlvbk1lcmdlU3RyYXRlZ2llcztcclxuXHJcbi8qKlxyXG4gKiBPcHRpb25zIHdpdGggcmVzdHJpY3Rpb25zXHJcbiAqL1xyXG57XHJcbiAgc3RyYXRzLmVsID0gc3RyYXRzLnByb3BzRGF0YSA9IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkLCB2bSwga2V5KSB7XHJcbiAgICBpZiAoIXZtKSB7XHJcbiAgICAgIHdhcm4oXHJcbiAgICAgICAgXCJvcHRpb24gXFxcIlwiICsga2V5ICsgXCJcXFwiIGNhbiBvbmx5IGJlIHVzZWQgZHVyaW5nIGluc3RhbmNlIFwiICtcclxuICAgICAgICAnY3JlYXRpb24gd2l0aCB0aGUgYG5ld2Aga2V5d29yZC4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmYXVsdFN0cmF0KHBhcmVudCwgY2hpbGQpXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciB0aGF0IHJlY3Vyc2l2ZWx5IG1lcmdlcyB0d28gZGF0YSBvYmplY3RzIHRvZ2V0aGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xyXG4gIGlmICghZnJvbSkgeyByZXR1cm4gdG8gfVxyXG4gIHZhciBrZXksIHRvVmFsLCBmcm9tVmFsO1xyXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJvbSk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBrZXkgPSBrZXlzW2ldO1xyXG4gICAgdG9WYWwgPSB0b1trZXldO1xyXG4gICAgZnJvbVZhbCA9IGZyb21ba2V5XTtcclxuICAgIGlmICghaGFzT3duKHRvLCBrZXkpKSB7XHJcbiAgICAgIHNldCQxKHRvLCBrZXksIGZyb21WYWwpO1xyXG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHRvVmFsKSAmJiBpc1BsYWluT2JqZWN0KGZyb21WYWwpKSB7XHJcbiAgICAgIG1lcmdlRGF0YSh0b1ZhbCwgZnJvbVZhbCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b1xyXG59XHJcblxyXG4vKipcclxuICogRGF0YVxyXG4gKi9cclxuc3RyYXRzLmRhdGEgPSBmdW5jdGlvbiAoXHJcbiAgcGFyZW50VmFsLFxyXG4gIGNoaWxkVmFsLFxyXG4gIHZtXHJcbikge1xyXG4gIGlmICghdm0pIHtcclxuICAgIC8vIGluIGEgVnVlLmV4dGVuZCBtZXJnZSwgYm90aCBzaG91bGQgYmUgZnVuY3Rpb25zXHJcbiAgICBpZiAoIWNoaWxkVmFsKSB7XHJcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICAnVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcclxuICAgICAgICAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICtcclxuICAgICAgICAnZGVmaW5pdGlvbnMuJyxcclxuICAgICAgICB2bVxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gcGFyZW50VmFsXHJcbiAgICB9XHJcbiAgICBpZiAoIXBhcmVudFZhbCkge1xyXG4gICAgICByZXR1cm4gY2hpbGRWYWxcclxuICAgIH1cclxuICAgIC8vIHdoZW4gcGFyZW50VmFsICYgY2hpbGRWYWwgYXJlIGJvdGggcHJlc2VudCxcclxuICAgIC8vIHdlIG5lZWQgdG8gcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxyXG4gICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXHJcbiAgICAvLyBjaGVjayBpZiBwYXJlbnRWYWwgaXMgYSBmdW5jdGlvbiBoZXJlIGJlY2F1c2VcclxuICAgIC8vIGl0IGhhcyB0byBiZSBhIGZ1bmN0aW9uIHRvIHBhc3MgcHJldmlvdXMgbWVyZ2VzLlxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbiAoKSB7XHJcbiAgICAgIHJldHVybiBtZXJnZURhdGEoXHJcbiAgICAgICAgY2hpbGRWYWwuY2FsbCh0aGlzKSxcclxuICAgICAgICBwYXJlbnRWYWwuY2FsbCh0aGlzKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChwYXJlbnRWYWwgfHwgY2hpbGRWYWwpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiBtZXJnZWRJbnN0YW5jZURhdGFGbiAoKSB7XHJcbiAgICAgIC8vIGluc3RhbmNlIG1lcmdlXHJcbiAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcclxuICAgICAgICA/IGNoaWxkVmFsLmNhbGwodm0pXHJcbiAgICAgICAgOiBjaGlsZFZhbDtcclxuICAgICAgdmFyIGRlZmF1bHREYXRhID0gdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICAgID8gcGFyZW50VmFsLmNhbGwodm0pXHJcbiAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgICAgIGlmIChpbnN0YW5jZURhdGEpIHtcclxuICAgICAgICByZXR1cm4gbWVyZ2VEYXRhKGluc3RhbmNlRGF0YSwgZGVmYXVsdERhdGEpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSG9va3MgYW5kIHBhcmFtIGF0dHJpYnV0ZXMgYXJlIG1lcmdlZCBhcyBhcnJheXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZUhvb2sgKFxyXG4gIHBhcmVudFZhbCxcclxuICBjaGlsZFZhbFxyXG4pIHtcclxuICByZXR1cm4gY2hpbGRWYWxcclxuICAgID8gcGFyZW50VmFsXHJcbiAgICAgID8gcGFyZW50VmFsLmNvbmNhdChjaGlsZFZhbClcclxuICAgICAgOiBBcnJheS5pc0FycmF5KGNoaWxkVmFsKVxyXG4gICAgICAgID8gY2hpbGRWYWxcclxuICAgICAgICA6IFtjaGlsZFZhbF1cclxuICAgIDogcGFyZW50VmFsXHJcbn1cclxuXHJcbmNvbmZpZy5fbGlmZWN5Y2xlSG9va3MuZm9yRWFjaChmdW5jdGlvbiAoaG9vaykge1xyXG4gIHN0cmF0c1tob29rXSA9IG1lcmdlSG9vaztcclxufSk7XHJcblxyXG4vKipcclxuICogQXNzZXRzXHJcbiAqXHJcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cclxuICogYSB0aHJlZS13YXkgbWVyZ2UgYmV0d2VlbiBjb25zdHJ1Y3RvciBvcHRpb25zLCBpbnN0YW5jZVxyXG4gKiBvcHRpb25zIGFuZCBwYXJlbnQgb3B0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlQXNzZXRzIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XHJcbiAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUocGFyZW50VmFsIHx8IG51bGwpO1xyXG4gIHJldHVybiBjaGlsZFZhbFxyXG4gICAgPyBleHRlbmQocmVzLCBjaGlsZFZhbClcclxuICAgIDogcmVzXHJcbn1cclxuXHJcbmNvbmZpZy5fYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgc3RyYXRzW3R5cGUgKyAncyddID0gbWVyZ2VBc3NldHM7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFdhdGNoZXJzLlxyXG4gKlxyXG4gKiBXYXRjaGVycyBoYXNoZXMgc2hvdWxkIG5vdCBvdmVyd3JpdGUgb25lXHJcbiAqIGFub3RoZXIsIHNvIHdlIG1lcmdlIHRoZW0gYXMgYXJyYXlzLlxyXG4gKi9cclxuc3RyYXRzLndhdGNoID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICBpZiAoIWNoaWxkVmFsKSB7IHJldHVybiBwYXJlbnRWYWwgfVxyXG4gIGlmICghcGFyZW50VmFsKSB7IHJldHVybiBjaGlsZFZhbCB9XHJcbiAgdmFyIHJldCA9IHt9O1xyXG4gIGV4dGVuZChyZXQsIHBhcmVudFZhbCk7XHJcbiAgZm9yICh2YXIga2V5IGluIGNoaWxkVmFsKSB7XHJcbiAgICB2YXIgcGFyZW50ID0gcmV0W2tleV07XHJcbiAgICB2YXIgY2hpbGQgPSBjaGlsZFZhbFtrZXldO1xyXG4gICAgaWYgKHBhcmVudCAmJiAhQXJyYXkuaXNBcnJheShwYXJlbnQpKSB7XHJcbiAgICAgIHBhcmVudCA9IFtwYXJlbnRdO1xyXG4gICAgfVxyXG4gICAgcmV0W2tleV0gPSBwYXJlbnRcclxuICAgICAgPyBwYXJlbnQuY29uY2F0KGNoaWxkKVxyXG4gICAgICA6IFtjaGlsZF07XHJcbiAgfVxyXG4gIHJldHVybiByZXRcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPdGhlciBvYmplY3QgaGFzaGVzLlxyXG4gKi9cclxuc3RyYXRzLnByb3BzID1cclxuc3RyYXRzLm1ldGhvZHMgPVxyXG5zdHJhdHMuY29tcHV0ZWQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xyXG4gIGlmICghY2hpbGRWYWwpIHsgcmV0dXJuIHBhcmVudFZhbCB9XHJcbiAgaWYgKCFwYXJlbnRWYWwpIHsgcmV0dXJuIGNoaWxkVmFsIH1cclxuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpO1xyXG4gIGV4dGVuZChyZXQsIGNoaWxkVmFsKTtcclxuICByZXR1cm4gcmV0XHJcbn07XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBzdHJhdGVneS5cclxuICovXHJcbnZhciBkZWZhdWx0U3RyYXQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xyXG4gIHJldHVybiBjaGlsZFZhbCA9PT0gdW5kZWZpbmVkXHJcbiAgICA/IHBhcmVudFZhbFxyXG4gICAgOiBjaGlsZFZhbFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIGNvbXBvbmVudCBuYW1lc1xyXG4gKi9cclxuZnVuY3Rpb24gY2hlY2tDb21wb25lbnRzIChvcHRpb25zKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMuY29tcG9uZW50cykge1xyXG4gICAgdmFyIGxvd2VyID0ga2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoaXNCdWlsdEluVGFnKGxvd2VyKSB8fCBjb25maWcuaXNSZXNlcnZlZFRhZyhsb3dlcikpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnRG8gbm90IHVzZSBidWlsdC1pbiBvciByZXNlcnZlZCBIVE1MIGVsZW1lbnRzIGFzIGNvbXBvbmVudCAnICtcclxuICAgICAgICAnaWQ6ICcgKyBrZXlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFbnN1cmUgYWxsIHByb3BzIG9wdGlvbiBzeW50YXggYXJlIG5vcm1hbGl6ZWQgaW50byB0aGVcclxuICogT2JqZWN0LWJhc2VkIGZvcm1hdC5cclxuICovXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVByb3BzIChvcHRpb25zKSB7XHJcbiAgdmFyIHByb3BzID0gb3B0aW9ucy5wcm9wcztcclxuICBpZiAoIXByb3BzKSB7IHJldHVybiB9XHJcbiAgdmFyIHJlcyA9IHt9O1xyXG4gIHZhciBpLCB2YWwsIG5hbWU7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMpKSB7XHJcbiAgICBpID0gcHJvcHMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICB2YWwgPSBwcm9wc1tpXTtcclxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbmFtZSA9IGNhbWVsaXplKHZhbCk7XHJcbiAgICAgICAgcmVzW25hbWVdID0geyB0eXBlOiBudWxsIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2FybigncHJvcHMgbXVzdCBiZSBzdHJpbmdzIHdoZW4gdXNpbmcgYXJyYXkgc3ludGF4LicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHByb3BzKSkge1xyXG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XHJcbiAgICAgIHZhbCA9IHByb3BzW2tleV07XHJcbiAgICAgIG5hbWUgPSBjYW1lbGl6ZShrZXkpO1xyXG4gICAgICByZXNbbmFtZV0gPSBpc1BsYWluT2JqZWN0KHZhbClcclxuICAgICAgICA/IHZhbFxyXG4gICAgICAgIDogeyB0eXBlOiB2YWwgfTtcclxuICAgIH1cclxuICB9XHJcbiAgb3B0aW9ucy5wcm9wcyA9IHJlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vcm1hbGl6ZSByYXcgZnVuY3Rpb24gZGlyZWN0aXZlcyBpbnRvIG9iamVjdCBmb3JtYXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEaXJlY3RpdmVzIChvcHRpb25zKSB7XHJcbiAgdmFyIGRpcnMgPSBvcHRpb25zLmRpcmVjdGl2ZXM7XHJcbiAgaWYgKGRpcnMpIHtcclxuICAgIGZvciAodmFyIGtleSBpbiBkaXJzKSB7XHJcbiAgICAgIHZhciBkZWYgPSBkaXJzW2tleV07XHJcbiAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZGlyc1trZXldID0geyBiaW5kOiBkZWYsIHVwZGF0ZTogZGVmIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXHJcbiAqIENvcmUgdXRpbGl0eSB1c2VkIGluIGJvdGggaW5zdGFudGlhdGlvbiBhbmQgaW5oZXJpdGFuY2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZU9wdGlvbnMgKFxyXG4gIHBhcmVudCxcclxuICBjaGlsZCxcclxuICB2bVxyXG4pIHtcclxuICB7XHJcbiAgICBjaGVja0NvbXBvbmVudHMoY2hpbGQpO1xyXG4gIH1cclxuICBub3JtYWxpemVQcm9wcyhjaGlsZCk7XHJcbiAgbm9ybWFsaXplRGlyZWN0aXZlcyhjaGlsZCk7XHJcbiAgdmFyIGV4dGVuZHNGcm9tID0gY2hpbGQuZXh0ZW5kcztcclxuICBpZiAoZXh0ZW5kc0Zyb20pIHtcclxuICAgIHBhcmVudCA9IHR5cGVvZiBleHRlbmRzRnJvbSA9PT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICA/IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGV4dGVuZHNGcm9tLm9wdGlvbnMsIHZtKVxyXG4gICAgICA6IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGV4dGVuZHNGcm9tLCB2bSk7XHJcbiAgfVxyXG4gIGlmIChjaGlsZC5taXhpbnMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICB2YXIgbWl4aW4gPSBjaGlsZC5taXhpbnNbaV07XHJcbiAgICAgIGlmIChtaXhpbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBWdWUkMykge1xyXG4gICAgICAgIG1peGluID0gbWl4aW4ub3B0aW9ucztcclxuICAgICAgfVxyXG4gICAgICBwYXJlbnQgPSBtZXJnZU9wdGlvbnMocGFyZW50LCBtaXhpbiwgdm0pO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgb3B0aW9ucyA9IHt9O1xyXG4gIHZhciBrZXk7XHJcbiAgZm9yIChrZXkgaW4gcGFyZW50KSB7XHJcbiAgICBtZXJnZUZpZWxkKGtleSk7XHJcbiAgfVxyXG4gIGZvciAoa2V5IGluIGNoaWxkKSB7XHJcbiAgICBpZiAoIWhhc093bihwYXJlbnQsIGtleSkpIHtcclxuICAgICAgbWVyZ2VGaWVsZChrZXkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBtZXJnZUZpZWxkIChrZXkpIHtcclxuICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdDtcclxuICAgIG9wdGlvbnNba2V5XSA9IHN0cmF0KHBhcmVudFtrZXldLCBjaGlsZFtrZXldLCB2bSwga2V5KTtcclxuICB9XHJcbiAgcmV0dXJuIG9wdGlvbnNcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlc29sdmUgYW4gYXNzZXQuXHJcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBiZWNhdXNlIGNoaWxkIGluc3RhbmNlcyBuZWVkIGFjY2Vzc1xyXG4gKiB0byBhc3NldHMgZGVmaW5lZCBpbiBpdHMgYW5jZXN0b3IgY2hhaW4uXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNvbHZlQXNzZXQgKFxyXG4gIG9wdGlvbnMsXHJcbiAgdHlwZSxcclxuICBpZCxcclxuICB3YXJuTWlzc2luZ1xyXG4pIHtcclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHZhciBhc3NldHMgPSBvcHRpb25zW3R5cGVdO1xyXG4gIC8vIGNoZWNrIGxvY2FsIHJlZ2lzdHJhdGlvbiB2YXJpYXRpb25zIGZpcnN0XHJcbiAgaWYgKGhhc093bihhc3NldHMsIGlkKSkgeyByZXR1cm4gYXNzZXRzW2lkXSB9XHJcbiAgdmFyIGNhbWVsaXplZElkID0gY2FtZWxpemUoaWQpO1xyXG4gIGlmIChoYXNPd24oYXNzZXRzLCBjYW1lbGl6ZWRJZCkpIHsgcmV0dXJuIGFzc2V0c1tjYW1lbGl6ZWRJZF0gfVxyXG4gIHZhciBQYXNjYWxDYXNlSWQgPSBjYXBpdGFsaXplKGNhbWVsaXplZElkKTtcclxuICBpZiAoaGFzT3duKGFzc2V0cywgUGFzY2FsQ2FzZUlkKSkgeyByZXR1cm4gYXNzZXRzW1Bhc2NhbENhc2VJZF0gfVxyXG4gIC8vIGZhbGxiYWNrIHRvIHByb3RvdHlwZSBjaGFpblxyXG4gIHZhciByZXMgPSBhc3NldHNbaWRdIHx8IGFzc2V0c1tjYW1lbGl6ZWRJZF0gfHwgYXNzZXRzW1Bhc2NhbENhc2VJZF07XHJcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm5NaXNzaW5nICYmICFyZXMpIHtcclxuICAgIHdhcm4oXHJcbiAgICAgICdGYWlsZWQgdG8gcmVzb2x2ZSAnICsgdHlwZS5zbGljZSgwLCAtMSkgKyAnOiAnICsgaWQsXHJcbiAgICAgIG9wdGlvbnNcclxuICAgICk7XHJcbiAgfVxyXG4gIHJldHVybiByZXNcclxufVxyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3AgKFxyXG4gIGtleSxcclxuICBwcm9wT3B0aW9ucyxcclxuICBwcm9wc0RhdGEsXHJcbiAgdm1cclxuKSB7XHJcbiAgdmFyIHByb3AgPSBwcm9wT3B0aW9uc1trZXldO1xyXG4gIHZhciBhYnNlbnQgPSAhaGFzT3duKHByb3BzRGF0YSwga2V5KTtcclxuICB2YXIgdmFsdWUgPSBwcm9wc0RhdGFba2V5XTtcclxuICAvLyBoYW5kbGUgYm9vbGVhbiBwcm9wc1xyXG4gIGlmIChpc1R5cGUoQm9vbGVhbiwgcHJvcC50eXBlKSkge1xyXG4gICAgaWYgKGFic2VudCAmJiAhaGFzT3duKHByb3AsICdkZWZhdWx0JykpIHtcclxuICAgICAgdmFsdWUgPSBmYWxzZTtcclxuICAgIH0gZWxzZSBpZiAoIWlzVHlwZShTdHJpbmcsIHByb3AudHlwZSkgJiYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gaHlwaGVuYXRlKGtleSkpKSB7XHJcbiAgICAgIHZhbHVlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gY2hlY2sgZGVmYXVsdCB2YWx1ZVxyXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YWx1ZSA9IGdldFByb3BEZWZhdWx0VmFsdWUodm0sIHByb3AsIGtleSk7XHJcbiAgICAvLyBzaW5jZSB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBhIGZyZXNoIGNvcHksXHJcbiAgICAvLyBtYWtlIHN1cmUgdG8gb2JzZXJ2ZSBpdC5cclxuICAgIHZhciBwcmV2U2hvdWxkQ29udmVydCA9IG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydDtcclxuICAgIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHRydWU7XHJcbiAgICBvYnNlcnZlKHZhbHVlKTtcclxuICAgIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHByZXZTaG91bGRDb252ZXJ0O1xyXG4gIH1cclxuICB7XHJcbiAgICBhc3NlcnRQcm9wKHByb3AsIGtleSwgdmFsdWUsIHZtLCBhYnNlbnQpO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIHByb3AuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQcm9wRGVmYXVsdFZhbHVlICh2bSwgcHJvcCwga2V5KSB7XHJcbiAgLy8gbm8gZGVmYXVsdCwgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIGlmICghaGFzT3duKHByb3AsICdkZWZhdWx0JykpIHtcclxuICAgIHJldHVybiB1bmRlZmluZWRcclxuICB9XHJcbiAgdmFyIGRlZiA9IHByb3AuZGVmYXVsdDtcclxuICAvLyB3YXJuIGFnYWluc3Qgbm9uLWZhY3RvcnkgZGVmYXVsdHMgZm9yIE9iamVjdCAmIEFycmF5XHJcbiAgaWYgKGlzT2JqZWN0KGRlZikpIHtcclxuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICdJbnZhbGlkIGRlZmF1bHQgdmFsdWUgZm9yIHByb3AgXCInICsga2V5ICsgJ1wiOiAnICtcclxuICAgICAgJ1Byb3BzIHdpdGggdHlwZSBPYmplY3QvQXJyYXkgbXVzdCB1c2UgYSBmYWN0b3J5IGZ1bmN0aW9uICcgK1xyXG4gICAgICAndG8gcmV0dXJuIHRoZSBkZWZhdWx0IHZhbHVlLicsXHJcbiAgICAgIHZtXHJcbiAgICApO1xyXG4gIH1cclxuICAvLyB0aGUgcmF3IHByb3AgdmFsdWUgd2FzIGFsc28gdW5kZWZpbmVkIGZyb20gcHJldmlvdXMgcmVuZGVyLFxyXG4gIC8vIHJldHVybiBwcmV2aW91cyBkZWZhdWx0IHZhbHVlIHRvIGF2b2lkIHVubmVjZXNzYXJ5IHdhdGNoZXIgdHJpZ2dlclxyXG4gIGlmICh2bSAmJiB2bS4kb3B0aW9ucy5wcm9wc0RhdGEgJiZcclxuICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YVtrZXldID09PSB1bmRlZmluZWQgJiZcclxuICAgIHZtW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIHZtW2tleV1cclxuICB9XHJcbiAgLy8gY2FsbCBmYWN0b3J5IGZ1bmN0aW9uIGZvciBub24tRnVuY3Rpb24gdHlwZXNcclxuICByZXR1cm4gdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wLnR5cGUgIT09IEZ1bmN0aW9uXHJcbiAgICA/IGRlZi5jYWxsKHZtKVxyXG4gICAgOiBkZWZcclxufVxyXG5cclxuLyoqXHJcbiAqIEFzc2VydCB3aGV0aGVyIGEgcHJvcCBpcyB2YWxpZC5cclxuICovXHJcbmZ1bmN0aW9uIGFzc2VydFByb3AgKFxyXG4gIHByb3AsXHJcbiAgbmFtZSxcclxuICB2YWx1ZSxcclxuICB2bSxcclxuICBhYnNlbnRcclxuKSB7XHJcbiAgaWYgKHByb3AucmVxdWlyZWQgJiYgYWJzZW50KSB7XHJcbiAgICB3YXJuKFxyXG4gICAgICAnTWlzc2luZyByZXF1aXJlZCBwcm9wOiBcIicgKyBuYW1lICsgJ1wiJyxcclxuICAgICAgdm1cclxuICAgICk7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgaWYgKHZhbHVlID09IG51bGwgJiYgIXByb3AucmVxdWlyZWQpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB2YXIgdHlwZSA9IHByb3AudHlwZTtcclxuICB2YXIgdmFsaWQgPSAhdHlwZSB8fCB0eXBlID09PSB0cnVlO1xyXG4gIHZhciBleHBlY3RlZFR5cGVzID0gW107XHJcbiAgaWYgKHR5cGUpIHtcclxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG4gICAgICB0eXBlID0gW3R5cGVdO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlLmxlbmd0aCAmJiAhdmFsaWQ7IGkrKykge1xyXG4gICAgICB2YXIgYXNzZXJ0ZWRUeXBlID0gYXNzZXJ0VHlwZSh2YWx1ZSwgdHlwZVtpXSk7XHJcbiAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChhc3NlcnRlZFR5cGUuZXhwZWN0ZWRUeXBlIHx8ICcnKTtcclxuICAgICAgdmFsaWQgPSBhc3NlcnRlZFR5cGUudmFsaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICghdmFsaWQpIHtcclxuICAgIHdhcm4oXHJcbiAgICAgICdJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJyArIG5hbWUgKyAnXCIuJyArXHJcbiAgICAgICcgRXhwZWN0ZWQgJyArIGV4cGVjdGVkVHlwZXMubWFwKGNhcGl0YWxpemUpLmpvaW4oJywgJykgK1xyXG4gICAgICAnLCBnb3QgJyArIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpICsgJy4nLFxyXG4gICAgICB2bVxyXG4gICAgKTtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB2YXIgdmFsaWRhdG9yID0gcHJvcC52YWxpZGF0b3I7XHJcbiAgaWYgKHZhbGlkYXRvcikge1xyXG4gICAgaWYgKCF2YWxpZGF0b3IodmFsdWUpKSB7XHJcbiAgICAgIHdhcm4oXHJcbiAgICAgICAgJ0ludmFsaWQgcHJvcDogY3VzdG9tIHZhbGlkYXRvciBjaGVjayBmYWlsZWQgZm9yIHByb3AgXCInICsgbmFtZSArICdcIi4nLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXNzZXJ0IHRoZSB0eXBlIG9mIGEgdmFsdWVcclxuICovXHJcbmZ1bmN0aW9uIGFzc2VydFR5cGUgKHZhbHVlLCB0eXBlKSB7XHJcbiAgdmFyIHZhbGlkO1xyXG4gIHZhciBleHBlY3RlZFR5cGUgPSBnZXRUeXBlKHR5cGUpO1xyXG4gIGlmIChleHBlY3RlZFR5cGUgPT09ICdTdHJpbmcnKSB7XHJcbiAgICB2YWxpZCA9IHR5cGVvZiB2YWx1ZSA9PT0gKGV4cGVjdGVkVHlwZSA9ICdzdHJpbmcnKTtcclxuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ051bWJlcicpIHtcclxuICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAoZXhwZWN0ZWRUeXBlID0gJ251bWJlcicpO1xyXG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSAnQm9vbGVhbicpIHtcclxuICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAoZXhwZWN0ZWRUeXBlID0gJ2Jvb2xlYW4nKTtcclxuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ0Z1bmN0aW9uJykge1xyXG4gICAgdmFsaWQgPSB0eXBlb2YgdmFsdWUgPT09IChleHBlY3RlZFR5cGUgPSAnZnVuY3Rpb24nKTtcclxuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ09iamVjdCcpIHtcclxuICAgIHZhbGlkID0gaXNQbGFpbk9iamVjdCh2YWx1ZSk7XHJcbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdBcnJheScpIHtcclxuICAgIHZhbGlkID0gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgdmFsaWQ6IHZhbGlkLFxyXG4gICAgZXhwZWN0ZWRUeXBlOiBleHBlY3RlZFR5cGVcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVc2UgZnVuY3Rpb24gc3RyaW5nIG5hbWUgdG8gY2hlY2sgYnVpbHQtaW4gdHlwZXMsXHJcbiAqIGJlY2F1c2UgYSBzaW1wbGUgZXF1YWxpdHkgY2hlY2sgd2lsbCBmYWlsIHdoZW4gcnVubmluZ1xyXG4gKiBhY3Jvc3MgZGlmZmVyZW50IHZtcyAvIGlmcmFtZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUeXBlIChmbikge1xyXG4gIHZhciBtYXRjaCA9IGZuICYmIGZuLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqZnVuY3Rpb24gKFxcdyspLyk7XHJcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVHlwZSAodHlwZSwgZm4pIHtcclxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm4pKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShmbikgPT09IGdldFR5cGUodHlwZSlcclxuICB9XHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBpZiAoZ2V0VHlwZShmbltpXSkgPT09IGdldFR5cGUodHlwZSkpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICB9XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICByZXR1cm4gZmFsc2VcclxufVxyXG5cclxuXHJcblxyXG52YXIgdXRpbCA9IE9iamVjdC5mcmVlemUoe1xyXG5cdGRlZmluZVJlYWN0aXZlOiBkZWZpbmVSZWFjdGl2ZSQkMSxcclxuXHRfdG9TdHJpbmc6IF90b1N0cmluZyxcclxuXHR0b051bWJlcjogdG9OdW1iZXIsXHJcblx0bWFrZU1hcDogbWFrZU1hcCxcclxuXHRpc0J1aWx0SW5UYWc6IGlzQnVpbHRJblRhZyxcclxuXHRyZW1vdmU6IHJlbW92ZSQxLFxyXG5cdGhhc093bjogaGFzT3duLFxyXG5cdGlzUHJpbWl0aXZlOiBpc1ByaW1pdGl2ZSxcclxuXHRjYWNoZWQ6IGNhY2hlZCxcclxuXHRjYW1lbGl6ZTogY2FtZWxpemUsXHJcblx0Y2FwaXRhbGl6ZTogY2FwaXRhbGl6ZSxcclxuXHRoeXBoZW5hdGU6IGh5cGhlbmF0ZSxcclxuXHRiaW5kOiBiaW5kJDEsXHJcblx0dG9BcnJheTogdG9BcnJheSxcclxuXHRleHRlbmQ6IGV4dGVuZCxcclxuXHRpc09iamVjdDogaXNPYmplY3QsXHJcblx0aXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcclxuXHR0b09iamVjdDogdG9PYmplY3QsXHJcblx0bm9vcDogbm9vcCxcclxuXHRubzogbm8sXHJcblx0aWRlbnRpdHk6IGlkZW50aXR5LFxyXG5cdGdlblN0YXRpY0tleXM6IGdlblN0YXRpY0tleXMsXHJcblx0bG9vc2VFcXVhbDogbG9vc2VFcXVhbCxcclxuXHRsb29zZUluZGV4T2Y6IGxvb3NlSW5kZXhPZixcclxuXHRpc1Jlc2VydmVkOiBpc1Jlc2VydmVkLFxyXG5cdGRlZjogZGVmLFxyXG5cdHBhcnNlUGF0aDogcGFyc2VQYXRoLFxyXG5cdGhhc1Byb3RvOiBoYXNQcm90byxcclxuXHRpbkJyb3dzZXI6IGluQnJvd3NlcixcclxuXHRVQTogVUEsXHJcblx0aXNJRTogaXNJRSxcclxuXHRpc0lFOTogaXNJRTksXHJcblx0aXNFZGdlOiBpc0VkZ2UsXHJcblx0aXNBbmRyb2lkOiBpc0FuZHJvaWQsXHJcblx0aXNJT1M6IGlzSU9TLFxyXG5cdGlzU2VydmVyUmVuZGVyaW5nOiBpc1NlcnZlclJlbmRlcmluZyxcclxuXHRkZXZ0b29sczogZGV2dG9vbHMsXHJcblx0bmV4dFRpY2s6IG5leHRUaWNrLFxyXG5cdGdldCBfU2V0ICgpIHsgcmV0dXJuIF9TZXQ7IH0sXHJcblx0bWVyZ2VPcHRpb25zOiBtZXJnZU9wdGlvbnMsXHJcblx0cmVzb2x2ZUFzc2V0OiByZXNvbHZlQXNzZXQsXHJcblx0Z2V0IHdhcm4gKCkgeyByZXR1cm4gd2FybjsgfSxcclxuXHRnZXQgZm9ybWF0Q29tcG9uZW50TmFtZSAoKSB7IHJldHVybiBmb3JtYXRDb21wb25lbnROYW1lOyB9LFxyXG5cdHZhbGlkYXRlUHJvcDogdmFsaWRhdGVQcm9wXHJcbn0pO1xyXG5cclxuLyogbm90IHR5cGUgY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgZmxvdyBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIFByb3h5ICovXHJcblxyXG52YXIgaW5pdFByb3h5O1xyXG5cclxue1xyXG4gIHZhciBhbGxvd2VkR2xvYmFscyA9IG1ha2VNYXAoXHJcbiAgICAnSW5maW5pdHksdW5kZWZpbmVkLE5hTixpc0Zpbml0ZSxpc05hTiwnICtcclxuICAgICdwYXJzZUZsb2F0LHBhcnNlSW50LGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLGVuY29kZVVSSUNvbXBvbmVudCwnICtcclxuICAgICdNYXRoLE51bWJlcixEYXRlLEFycmF5LE9iamVjdCxCb29sZWFuLFN0cmluZyxSZWdFeHAsTWFwLFNldCxKU09OLEludGwsJyArXHJcbiAgICAncmVxdWlyZScgLy8gZm9yIFdlYnBhY2svQnJvd3NlcmlmeVxyXG4gICk7XHJcblxyXG4gIHZhciB3YXJuTm9uUHJlc2VudCA9IGZ1bmN0aW9uICh0YXJnZXQsIGtleSkge1xyXG4gICAgd2FybihcclxuICAgICAgXCJQcm9wZXJ0eSBvciBtZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIG5vdCBkZWZpbmVkIG9uIHRoZSBpbnN0YW5jZSBidXQgXCIgK1xyXG4gICAgICBcInJlZmVyZW5jZWQgZHVyaW5nIHJlbmRlci4gTWFrZSBzdXJlIHRvIGRlY2xhcmUgcmVhY3RpdmUgZGF0YSBcIiArXHJcbiAgICAgIFwicHJvcGVydGllcyBpbiB0aGUgZGF0YSBvcHRpb24uXCIsXHJcbiAgICAgIHRhcmdldFxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICB2YXIgaGFzUHJveHkgPVxyXG4gICAgdHlwZW9mIFByb3h5ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgUHJveHkudG9TdHJpbmcoKS5tYXRjaCgvbmF0aXZlIGNvZGUvKTtcclxuXHJcbiAgaWYgKGhhc1Byb3h5KSB7XHJcbiAgICB2YXIgaXNCdWlsdEluTW9kaWZpZXIgPSBtYWtlTWFwKCdzdG9wLHByZXZlbnQsc2VsZixjdHJsLHNoaWZ0LGFsdCxtZXRhJyk7XHJcbiAgICBjb25maWcua2V5Q29kZXMgPSBuZXcgUHJveHkoY29uZmlnLmtleUNvZGVzLCB7XHJcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0ICh0YXJnZXQsIGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAoaXNCdWlsdEluTW9kaWZpZXIoa2V5KSkge1xyXG4gICAgICAgICAgd2FybigoXCJBdm9pZCBvdmVyd3JpdGluZyBidWlsdC1pbiBtb2RpZmllciBpbiBjb25maWcua2V5Q29kZXM6IC5cIiArIGtleSkpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YXIgaGFzSGFuZGxlciA9IHtcclxuICAgIGhhczogZnVuY3Rpb24gaGFzICh0YXJnZXQsIGtleSkge1xyXG4gICAgICB2YXIgaGFzID0ga2V5IGluIHRhcmdldDtcclxuICAgICAgdmFyIGlzQWxsb3dlZCA9IGFsbG93ZWRHbG9iYWxzKGtleSkgfHwga2V5LmNoYXJBdCgwKSA9PT0gJ18nO1xyXG4gICAgICBpZiAoIWhhcyAmJiAhaXNBbGxvd2VkKSB7XHJcbiAgICAgICAgd2Fybk5vblByZXNlbnQodGFyZ2V0LCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBoYXMgfHwgIWlzQWxsb3dlZFxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBnZXRIYW5kbGVyID0ge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKHRhcmdldCwga2V5KSB7XHJcbiAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiAhKGtleSBpbiB0YXJnZXQpKSB7XHJcbiAgICAgICAgd2Fybk5vblByZXNlbnQodGFyZ2V0LCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0YXJnZXRba2V5XVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGluaXRQcm94eSA9IGZ1bmN0aW9uIGluaXRQcm94eSAodm0pIHtcclxuICAgIGlmIChoYXNQcm94eSkge1xyXG4gICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcHJveHkgaGFuZGxlciB0byB1c2VcclxuICAgICAgdmFyIG9wdGlvbnMgPSB2bS4kb3B0aW9ucztcclxuICAgICAgdmFyIGhhbmRsZXJzID0gb3B0aW9ucy5yZW5kZXIgJiYgb3B0aW9ucy5yZW5kZXIuX3dpdGhTdHJpcHBlZFxyXG4gICAgICAgID8gZ2V0SGFuZGxlclxyXG4gICAgICAgIDogaGFzSGFuZGxlcjtcclxuICAgICAgdm0uX3JlbmRlclByb3h5ID0gbmV3IFByb3h5KHZtLCBoYW5kbGVycyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2bS5fcmVuZGVyUHJveHkgPSB2bTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBWTm9kZSA9IGZ1bmN0aW9uIFZOb2RlIChcclxuICB0YWcsXHJcbiAgZGF0YSxcclxuICBjaGlsZHJlbixcclxuICB0ZXh0LFxyXG4gIGVsbSxcclxuICBjb250ZXh0LFxyXG4gIGNvbXBvbmVudE9wdGlvbnNcclxuKSB7XHJcbiAgdGhpcy50YWcgPSB0YWc7XHJcbiAgdGhpcy5kYXRhID0gZGF0YTtcclxuICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICB0aGlzLmVsbSA9IGVsbTtcclxuICB0aGlzLm5zID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgdGhpcy5mdW5jdGlvbmFsQ29udGV4dCA9IHVuZGVmaW5lZDtcclxuICB0aGlzLmtleSA9IGRhdGEgJiYgZGF0YS5rZXk7XHJcbiAgdGhpcy5jb21wb25lbnRPcHRpb25zID0gY29tcG9uZW50T3B0aW9ucztcclxuICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMucmF3ID0gZmFsc2U7XHJcbiAgdGhpcy5pc1N0YXRpYyA9IGZhbHNlO1xyXG4gIHRoaXMuaXNSb290SW5zZXJ0ID0gdHJ1ZTtcclxuICB0aGlzLmlzQ29tbWVudCA9IGZhbHNlO1xyXG4gIHRoaXMuaXNDbG9uZWQgPSBmYWxzZTtcclxuICB0aGlzLmlzT25jZSA9IGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgY2hpbGQ6IHt9IH07XHJcblxyXG4vLyBERVBSRUNBVEVEOiBhbGlhcyBmb3IgY29tcG9uZW50SW5zdGFuY2UgZm9yIGJhY2t3YXJkcyBjb21wYXQuXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbnByb3RvdHlwZUFjY2Vzc29ycy5jaGlsZC5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuY29tcG9uZW50SW5zdGFuY2VcclxufTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWTm9kZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xyXG5cclxudmFyIGNyZWF0ZUVtcHR5Vk5vZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG5vZGUgPSBuZXcgVk5vZGUoKTtcclxuICBub2RlLnRleHQgPSAnJztcclxuICBub2RlLmlzQ29tbWVudCA9IHRydWU7XHJcbiAgcmV0dXJuIG5vZGVcclxufTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVRleHRWTm9kZSAodmFsKSB7XHJcbiAgcmV0dXJuIG5ldyBWTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBTdHJpbmcodmFsKSlcclxufVxyXG5cclxuLy8gb3B0aW1pemVkIHNoYWxsb3cgY2xvbmVcclxuLy8gdXNlZCBmb3Igc3RhdGljIG5vZGVzIGFuZCBzbG90IG5vZGVzIGJlY2F1c2UgdGhleSBtYXkgYmUgcmV1c2VkIGFjcm9zc1xyXG4vLyBtdWx0aXBsZSByZW5kZXJzLCBjbG9uaW5nIHRoZW0gYXZvaWRzIGVycm9ycyB3aGVuIERPTSBtYW5pcHVsYXRpb25zIHJlbHlcclxuLy8gb24gdGhlaXIgZWxtIHJlZmVyZW5jZS5cclxuZnVuY3Rpb24gY2xvbmVWTm9kZSAodm5vZGUpIHtcclxuICB2YXIgY2xvbmVkID0gbmV3IFZOb2RlKFxyXG4gICAgdm5vZGUudGFnLFxyXG4gICAgdm5vZGUuZGF0YSxcclxuICAgIHZub2RlLmNoaWxkcmVuLFxyXG4gICAgdm5vZGUudGV4dCxcclxuICAgIHZub2RlLmVsbSxcclxuICAgIHZub2RlLmNvbnRleHQsXHJcbiAgICB2bm9kZS5jb21wb25lbnRPcHRpb25zXHJcbiAgKTtcclxuICBjbG9uZWQubnMgPSB2bm9kZS5ucztcclxuICBjbG9uZWQuaXNTdGF0aWMgPSB2bm9kZS5pc1N0YXRpYztcclxuICBjbG9uZWQua2V5ID0gdm5vZGUua2V5O1xyXG4gIGNsb25lZC5pc0Nsb25lZCA9IHRydWU7XHJcbiAgcmV0dXJuIGNsb25lZFxyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9uZVZOb2RlcyAodm5vZGVzKSB7XHJcbiAgdmFyIHJlcyA9IG5ldyBBcnJheSh2bm9kZXMubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgcmVzW2ldID0gY2xvbmVWTm9kZSh2bm9kZXNbaV0pO1xyXG4gIH1cclxuICByZXR1cm4gcmVzXHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGhvb2tzID0geyBpbml0OiBpbml0LCBwcmVwYXRjaDogcHJlcGF0Y2gsIGluc2VydDogaW5zZXJ0LCBkZXN0cm95OiBkZXN0cm95JDEgfTtcclxudmFyIGhvb2tzVG9NZXJnZSA9IE9iamVjdC5rZXlzKGhvb2tzKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudCAoXHJcbiAgQ3RvcixcclxuICBkYXRhLFxyXG4gIGNvbnRleHQsXHJcbiAgY2hpbGRyZW4sXHJcbiAgdGFnXHJcbikge1xyXG4gIGlmICghQ3Rvcikge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICB2YXIgYmFzZUN0b3IgPSBjb250ZXh0LiRvcHRpb25zLl9iYXNlO1xyXG4gIGlmIChpc09iamVjdChDdG9yKSkge1xyXG4gICAgQ3RvciA9IGJhc2VDdG9yLmV4dGVuZChDdG9yKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgQ3RvciAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAge1xyXG4gICAgICB3YXJuKChcIkludmFsaWQgQ29tcG9uZW50IGRlZmluaXRpb246IFwiICsgKFN0cmluZyhDdG9yKSkpLCBjb250ZXh0KTtcclxuICAgIH1cclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gYXN5bmMgY29tcG9uZW50XHJcbiAgaWYgKCFDdG9yLmNpZCkge1xyXG4gICAgaWYgKEN0b3IucmVzb2x2ZWQpIHtcclxuICAgICAgQ3RvciA9IEN0b3IucmVzb2x2ZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBDdG9yID0gcmVzb2x2ZUFzeW5jQ29tcG9uZW50KEN0b3IsIGJhc2VDdG9yLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gaXQncyBvayB0byBxdWV1ZSB0aGlzIG9uIGV2ZXJ5IHJlbmRlciBiZWNhdXNlXHJcbiAgICAgICAgLy8gJGZvcmNlVXBkYXRlIGlzIGJ1ZmZlcmVkIGJ5IHRoZSBzY2hlZHVsZXIuXHJcbiAgICAgICAgY29udGV4dC4kZm9yY2VVcGRhdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmICghQ3Rvcikge1xyXG4gICAgICAgIC8vIHJldHVybiBub3RoaW5nIGlmIHRoaXMgaXMgaW5kZWVkIGFuIGFzeW5jIGNvbXBvbmVudFxyXG4gICAgICAgIC8vIHdhaXQgZm9yIHRoZSBjYWxsYmFjayB0byB0cmlnZ2VyIHBhcmVudCB1cGRhdGUuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJlc29sdmUgY29uc3RydWN0b3Igb3B0aW9ucyBpbiBjYXNlIGdsb2JhbCBtaXhpbnMgYXJlIGFwcGxpZWQgYWZ0ZXJcclxuICAvLyBjb21wb25lbnQgY29uc3RydWN0b3IgY3JlYXRpb25cclxuICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3IpO1xyXG5cclxuICBkYXRhID0gZGF0YSB8fCB7fTtcclxuXHJcbiAgLy8gZXh0cmFjdCBwcm9wc1xyXG4gIHZhciBwcm9wc0RhdGEgPSBleHRyYWN0UHJvcHMoZGF0YSwgQ3Rvcik7XHJcblxyXG4gIC8vIGZ1bmN0aW9uYWwgY29tcG9uZW50XHJcbiAgaWYgKEN0b3Iub3B0aW9ucy5mdW5jdGlvbmFsKSB7XHJcbiAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb25hbENvbXBvbmVudChDdG9yLCBwcm9wc0RhdGEsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuKVxyXG4gIH1cclxuXHJcbiAgLy8gZXh0cmFjdCBsaXN0ZW5lcnMsIHNpbmNlIHRoZXNlIG5lZWRzIHRvIGJlIHRyZWF0ZWQgYXNcclxuICAvLyBjaGlsZCBjb21wb25lbnQgbGlzdGVuZXJzIGluc3RlYWQgb2YgRE9NIGxpc3RlbmVyc1xyXG4gIHZhciBsaXN0ZW5lcnMgPSBkYXRhLm9uO1xyXG4gIC8vIHJlcGxhY2Ugd2l0aCBsaXN0ZW5lcnMgd2l0aCAubmF0aXZlIG1vZGlmaWVyXHJcbiAgZGF0YS5vbiA9IGRhdGEubmF0aXZlT247XHJcblxyXG4gIGlmIChDdG9yLm9wdGlvbnMuYWJzdHJhY3QpIHtcclxuICAgIC8vIGFic3RyYWN0IGNvbXBvbmVudHMgZG8gbm90IGtlZXAgYW55dGhpbmdcclxuICAgIC8vIG90aGVyIHRoYW4gcHJvcHMgJiBsaXN0ZW5lcnNcclxuICAgIGRhdGEgPSB7fTtcclxuICB9XHJcblxyXG4gIC8vIG1lcmdlIGNvbXBvbmVudCBtYW5hZ2VtZW50IGhvb2tzIG9udG8gdGhlIHBsYWNlaG9sZGVyIG5vZGVcclxuICBtZXJnZUhvb2tzKGRhdGEpO1xyXG5cclxuICAvLyByZXR1cm4gYSBwbGFjZWhvbGRlciB2bm9kZVxyXG4gIHZhciBuYW1lID0gQ3Rvci5vcHRpb25zLm5hbWUgfHwgdGFnO1xyXG4gIHZhciB2bm9kZSA9IG5ldyBWTm9kZShcclxuICAgIChcInZ1ZS1jb21wb25lbnQtXCIgKyAoQ3Rvci5jaWQpICsgKG5hbWUgPyAoXCItXCIgKyBuYW1lKSA6ICcnKSksXHJcbiAgICBkYXRhLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0LFxyXG4gICAgeyBDdG9yOiBDdG9yLCBwcm9wc0RhdGE6IHByb3BzRGF0YSwgbGlzdGVuZXJzOiBsaXN0ZW5lcnMsIHRhZzogdGFnLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxyXG4gICk7XHJcbiAgcmV0dXJuIHZub2RlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uYWxDb21wb25lbnQgKFxyXG4gIEN0b3IsXHJcbiAgcHJvcHNEYXRhLFxyXG4gIGRhdGEsXHJcbiAgY29udGV4dCxcclxuICBjaGlsZHJlblxyXG4pIHtcclxuICB2YXIgcHJvcHMgPSB7fTtcclxuICB2YXIgcHJvcE9wdGlvbnMgPSBDdG9yLm9wdGlvbnMucHJvcHM7XHJcbiAgaWYgKHByb3BPcHRpb25zKSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcE9wdGlvbnMpIHtcclxuICAgICAgcHJvcHNba2V5XSA9IHZhbGlkYXRlUHJvcChrZXksIHByb3BPcHRpb25zLCBwcm9wc0RhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBlbnN1cmUgdGhlIGNyZWF0ZUVsZW1lbnQgZnVuY3Rpb24gaW4gZnVuY3Rpb25hbCBjb21wb25lbnRzXHJcbiAgLy8gZ2V0cyBhIHVuaXF1ZSBjb250ZXh0IC0gdGhpcyBpcyBuZWNlc3NhcnkgZm9yIGNvcnJlY3QgbmFtZWQgc2xvdCBjaGVja1xyXG4gIHZhciBfY29udGV4dCA9IE9iamVjdC5jcmVhdGUoY29udGV4dCk7XHJcbiAgdmFyIGggPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudChfY29udGV4dCwgYSwgYiwgYywgZCwgdHJ1ZSk7IH07XHJcbiAgdmFyIHZub2RlID0gQ3Rvci5vcHRpb25zLnJlbmRlci5jYWxsKG51bGwsIGgsIHtcclxuICAgIHByb3BzOiBwcm9wcyxcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBwYXJlbnQ6IGNvbnRleHQsXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBzbG90czogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVzb2x2ZVNsb3RzKGNoaWxkcmVuLCBjb250ZXh0KTsgfVxyXG4gIH0pO1xyXG4gIGlmICh2bm9kZSBpbnN0YW5jZW9mIFZOb2RlKSB7XHJcbiAgICB2bm9kZS5mdW5jdGlvbmFsQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICBpZiAoZGF0YS5zbG90KSB7XHJcbiAgICAgICh2bm9kZS5kYXRhIHx8ICh2bm9kZS5kYXRhID0ge30pKS5zbG90ID0gZGF0YS5zbG90O1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdm5vZGVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZSAoXHJcbiAgdm5vZGUsIC8vIHdlIGtub3cgaXQncyBNb3VudGVkQ29tcG9uZW50Vk5vZGUgYnV0IGZsb3cgZG9lc24ndFxyXG4gIHBhcmVudCwgLy8gYWN0aXZlSW5zdGFuY2UgaW4gbGlmZWN5Y2xlIHN0YXRlXHJcbiAgcGFyZW50RWxtLFxyXG4gIHJlZkVsbVxyXG4pIHtcclxuICB2YXIgdm5vZGVDb21wb25lbnRPcHRpb25zID0gdm5vZGUuY29tcG9uZW50T3B0aW9ucztcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIF9pc0NvbXBvbmVudDogdHJ1ZSxcclxuICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgcHJvcHNEYXRhOiB2bm9kZUNvbXBvbmVudE9wdGlvbnMucHJvcHNEYXRhLFxyXG4gICAgX2NvbXBvbmVudFRhZzogdm5vZGVDb21wb25lbnRPcHRpb25zLnRhZyxcclxuICAgIF9wYXJlbnRWbm9kZTogdm5vZGUsXHJcbiAgICBfcGFyZW50TGlzdGVuZXJzOiB2bm9kZUNvbXBvbmVudE9wdGlvbnMubGlzdGVuZXJzLFxyXG4gICAgX3JlbmRlckNoaWxkcmVuOiB2bm9kZUNvbXBvbmVudE9wdGlvbnMuY2hpbGRyZW4sXHJcbiAgICBfcGFyZW50RWxtOiBwYXJlbnRFbG0gfHwgbnVsbCxcclxuICAgIF9yZWZFbG06IHJlZkVsbSB8fCBudWxsXHJcbiAgfTtcclxuICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGUgcmVuZGVyIGZ1bmN0aW9uc1xyXG4gIHZhciBpbmxpbmVUZW1wbGF0ZSA9IHZub2RlLmRhdGEuaW5saW5lVGVtcGxhdGU7XHJcbiAgaWYgKGlubGluZVRlbXBsYXRlKSB7XHJcbiAgICBvcHRpb25zLnJlbmRlciA9IGlubGluZVRlbXBsYXRlLnJlbmRlcjtcclxuICAgIG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zID0gaW5saW5lVGVtcGxhdGUuc3RhdGljUmVuZGVyRm5zO1xyXG4gIH1cclxuICByZXR1cm4gbmV3IHZub2RlQ29tcG9uZW50T3B0aW9ucy5DdG9yKG9wdGlvbnMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQgKFxyXG4gIHZub2RlLFxyXG4gIGh5ZHJhdGluZyxcclxuICBwYXJlbnRFbG0sXHJcbiAgcmVmRWxtXHJcbikge1xyXG4gIGlmICghdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgfHwgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX2lzRGVzdHJveWVkKSB7XHJcbiAgICB2YXIgY2hpbGQgPSB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSA9IGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlRm9yVm5vZGUoXHJcbiAgICAgIHZub2RlLFxyXG4gICAgICBhY3RpdmVJbnN0YW5jZSxcclxuICAgICAgcGFyZW50RWxtLFxyXG4gICAgICByZWZFbG1cclxuICAgICk7XHJcbiAgICBjaGlsZC4kbW91bnQoaHlkcmF0aW5nID8gdm5vZGUuZWxtIDogdW5kZWZpbmVkLCBoeWRyYXRpbmcpO1xyXG4gIH0gZWxzZSBpZiAodm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcclxuICAgIC8vIGtlcHQtYWxpdmUgY29tcG9uZW50cywgdHJlYXQgYXMgYSBwYXRjaFxyXG4gICAgdmFyIG1vdW50ZWROb2RlID0gdm5vZGU7IC8vIHdvcmsgYXJvdW5kIGZsb3dcclxuICAgIHByZXBhdGNoKG1vdW50ZWROb2RlLCBtb3VudGVkTm9kZSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVwYXRjaCAoXHJcbiAgb2xkVm5vZGUsXHJcbiAgdm5vZGVcclxuKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xyXG4gIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gb2xkVm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgY2hpbGQuX3VwZGF0ZUZyb21QYXJlbnQoXHJcbiAgICBvcHRpb25zLnByb3BzRGF0YSwgLy8gdXBkYXRlZCBwcm9wc1xyXG4gICAgb3B0aW9ucy5saXN0ZW5lcnMsIC8vIHVwZGF0ZWQgbGlzdGVuZXJzXHJcbiAgICB2bm9kZSwgLy8gbmV3IHBhcmVudCB2bm9kZVxyXG4gICAgb3B0aW9ucy5jaGlsZHJlbiAvLyBuZXcgY2hpbGRyZW5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnQgKHZub2RlKSB7XHJcbiAgaWYgKCF2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5faXNNb3VudGVkKSB7XHJcbiAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5faXNNb3VudGVkID0gdHJ1ZTtcclxuICAgIGNhbGxIb29rKHZub2RlLmNvbXBvbmVudEluc3RhbmNlLCAnbW91bnRlZCcpO1xyXG4gIH1cclxuICBpZiAodm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcclxuICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pbmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgY2FsbEhvb2sodm5vZGUuY29tcG9uZW50SW5zdGFuY2UsICdhY3RpdmF0ZWQnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlc3Ryb3kkMSAodm5vZGUpIHtcclxuICBpZiAoIXZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc0Rlc3Ryb3llZCkge1xyXG4gICAgaWYgKCF2bm9kZS5kYXRhLmtlZXBBbGl2ZSkge1xyXG4gICAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZS4kZGVzdHJveSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX2luYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgY2FsbEhvb2sodm5vZGUuY29tcG9uZW50SW5zdGFuY2UsICdkZWFjdGl2YXRlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZUFzeW5jQ29tcG9uZW50IChcclxuICBmYWN0b3J5LFxyXG4gIGJhc2VDdG9yLFxyXG4gIGNiXHJcbikge1xyXG4gIGlmIChmYWN0b3J5LnJlcXVlc3RlZCkge1xyXG4gICAgLy8gcG9vbCBjYWxsYmFja3NcclxuICAgIGZhY3RvcnkucGVuZGluZ0NhbGxiYWNrcy5wdXNoKGNiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZmFjdG9yeS5yZXF1ZXN0ZWQgPSB0cnVlO1xyXG4gICAgdmFyIGNicyA9IGZhY3RvcnkucGVuZGluZ0NhbGxiYWNrcyA9IFtjYl07XHJcbiAgICB2YXIgc3luYyA9IHRydWU7XHJcblxyXG4gICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgIGlmIChpc09iamVjdChyZXMpKSB7XHJcbiAgICAgICAgcmVzID0gYmFzZUN0b3IuZXh0ZW5kKHJlcyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gY2FjaGUgcmVzb2x2ZWRcclxuICAgICAgZmFjdG9yeS5yZXNvbHZlZCA9IHJlcztcclxuICAgICAgLy8gaW52b2tlIGNhbGxiYWNrcyBvbmx5IGlmIHRoaXMgaXMgbm90IGEgc3luY2hyb25vdXMgcmVzb2x2ZVxyXG4gICAgICAvLyAoYXN5bmMgcmVzb2x2ZXMgYXJlIHNoaW1tZWQgYXMgc3luY2hyb25vdXMgZHVyaW5nIFNTUilcclxuICAgICAgaWYgKCFzeW5jKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICBjYnNbaV0ocmVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHJlamVjdCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICBcIkZhaWxlZCB0byByZXNvbHZlIGFzeW5jIGNvbXBvbmVudDogXCIgKyAoU3RyaW5nKGZhY3RvcnkpKSArXHJcbiAgICAgICAgKHJlYXNvbiA/IChcIlxcblJlYXNvbjogXCIgKyByZWFzb24pIDogJycpXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZXMgPSBmYWN0b3J5KHJlc29sdmUsIHJlamVjdCk7XHJcblxyXG4gICAgLy8gaGFuZGxlIHByb21pc2VcclxuICAgIGlmIChyZXMgJiYgdHlwZW9mIHJlcy50aGVuID09PSAnZnVuY3Rpb24nICYmICFmYWN0b3J5LnJlc29sdmVkKSB7XHJcbiAgICAgIHJlcy50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3luYyA9IGZhbHNlO1xyXG4gICAgLy8gcmV0dXJuIGluIGNhc2UgcmVzb2x2ZWQgc3luY2hyb25vdXNseVxyXG4gICAgcmV0dXJuIGZhY3RvcnkucmVzb2x2ZWRcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4dHJhY3RQcm9wcyAoZGF0YSwgQ3Rvcikge1xyXG4gIC8vIHdlIGFyZSBvbmx5IGV4dHJhY3RpbmcgcmF3IHZhbHVlcyBoZXJlLlxyXG4gIC8vIHZhbGlkYXRpb24gYW5kIGRlZmF1bHQgdmFsdWVzIGFyZSBoYW5kbGVkIGluIHRoZSBjaGlsZFxyXG4gIC8vIGNvbXBvbmVudCBpdHNlbGYuXHJcbiAgdmFyIHByb3BPcHRpb25zID0gQ3Rvci5vcHRpb25zLnByb3BzO1xyXG4gIGlmICghcHJvcE9wdGlvbnMpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB2YXIgcmVzID0ge307XHJcbiAgdmFyIGF0dHJzID0gZGF0YS5hdHRycztcclxuICB2YXIgcHJvcHMgPSBkYXRhLnByb3BzO1xyXG4gIHZhciBkb21Qcm9wcyA9IGRhdGEuZG9tUHJvcHM7XHJcbiAgaWYgKGF0dHJzIHx8IHByb3BzIHx8IGRvbVByb3BzKSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcE9wdGlvbnMpIHtcclxuICAgICAgdmFyIGFsdEtleSA9IGh5cGhlbmF0ZShrZXkpO1xyXG4gICAgICBjaGVja1Byb3AocmVzLCBwcm9wcywga2V5LCBhbHRLZXksIHRydWUpIHx8XHJcbiAgICAgIGNoZWNrUHJvcChyZXMsIGF0dHJzLCBrZXksIGFsdEtleSkgfHxcclxuICAgICAgY2hlY2tQcm9wKHJlcywgZG9tUHJvcHMsIGtleSwgYWx0S2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1Byb3AgKFxyXG4gIHJlcyxcclxuICBoYXNoLFxyXG4gIGtleSxcclxuICBhbHRLZXksXHJcbiAgcHJlc2VydmVcclxuKSB7XHJcbiAgaWYgKGhhc2gpIHtcclxuICAgIGlmIChoYXNPd24oaGFzaCwga2V5KSkge1xyXG4gICAgICByZXNba2V5XSA9IGhhc2hba2V5XTtcclxuICAgICAgaWYgKCFwcmVzZXJ2ZSkge1xyXG4gICAgICAgIGRlbGV0ZSBoYXNoW2tleV07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSBpZiAoaGFzT3duKGhhc2gsIGFsdEtleSkpIHtcclxuICAgICAgcmVzW2tleV0gPSBoYXNoW2FsdEtleV07XHJcbiAgICAgIGlmICghcHJlc2VydmUpIHtcclxuICAgICAgICBkZWxldGUgaGFzaFthbHRLZXldO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZUhvb2tzIChkYXRhKSB7XHJcbiAgaWYgKCFkYXRhLmhvb2spIHtcclxuICAgIGRhdGEuaG9vayA9IHt9O1xyXG4gIH1cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzVG9NZXJnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGtleSA9IGhvb2tzVG9NZXJnZVtpXTtcclxuICAgIHZhciBmcm9tUGFyZW50ID0gZGF0YS5ob29rW2tleV07XHJcbiAgICB2YXIgb3VycyA9IGhvb2tzW2tleV07XHJcbiAgICBkYXRhLmhvb2tba2V5XSA9IGZyb21QYXJlbnQgPyBtZXJnZUhvb2skMShvdXJzLCBmcm9tUGFyZW50KSA6IG91cnM7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZUhvb2skMSAob25lLCB0d28pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcclxuICAgIG9uZShhLCBiLCBjLCBkKTtcclxuICAgIHR3byhhLCBiLCBjLCBkKTtcclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gbWVyZ2VWTm9kZUhvb2sgKGRlZiwgaG9va0tleSwgaG9vaywga2V5KSB7XHJcbiAga2V5ID0ga2V5ICsgaG9va0tleTtcclxuICB2YXIgaW5qZWN0ZWRIYXNoID0gZGVmLl9faW5qZWN0ZWQgfHwgKGRlZi5fX2luamVjdGVkID0ge30pO1xyXG4gIGlmICghaW5qZWN0ZWRIYXNoW2tleV0pIHtcclxuICAgIGluamVjdGVkSGFzaFtrZXldID0gdHJ1ZTtcclxuICAgIHZhciBvbGRIb29rID0gZGVmW2hvb2tLZXldO1xyXG4gICAgaWYgKG9sZEhvb2spIHtcclxuICAgICAgZGVmW2hvb2tLZXldID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG9sZEhvb2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICBob29rLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWZbaG9va0tleV0gPSBob29rO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgbm9ybWFsaXplRXZlbnQgPSBjYWNoZWQoZnVuY3Rpb24gKG5hbWUpIHtcclxuICB2YXIgb25jZSA9IG5hbWUuY2hhckF0KDApID09PSAnfic7IC8vIFByZWZpeGVkIGxhc3QsIGNoZWNrZWQgZmlyc3RcclxuICBuYW1lID0gb25jZSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xyXG4gIHZhciBjYXB0dXJlID0gbmFtZS5jaGFyQXQoMCkgPT09ICchJztcclxuICBuYW1lID0gY2FwdHVyZSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgb25jZTogb25jZSxcclxuICAgIGNhcHR1cmU6IGNhcHR1cmVcclxuICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlRXZlbnRIYW5kbGUgKGZuKSB7XHJcbiAgdmFyIGhhbmRsZSA9IHtcclxuICAgIGZuOiBmbixcclxuICAgIGludm9rZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xyXG5cclxuICAgICAgdmFyIGZuID0gaGFuZGxlLmZuO1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmbikpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBmbltpXS5hcHBseShudWxsLCBhcmd1bWVudHMkMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIHJldHVybiBoYW5kbGVcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGlzdGVuZXJzIChcclxuICBvbixcclxuICBvbGRPbixcclxuICBhZGQsXHJcbiAgcmVtb3ZlJCQxLFxyXG4gIHZtXHJcbikge1xyXG4gIHZhciBuYW1lLCBjdXIsIG9sZCwgZXZlbnQ7XHJcbiAgZm9yIChuYW1lIGluIG9uKSB7XHJcbiAgICBjdXIgPSBvbltuYW1lXTtcclxuICAgIG9sZCA9IG9sZE9uW25hbWVdO1xyXG4gICAgZXZlbnQgPSBub3JtYWxpemVFdmVudChuYW1lKTtcclxuICAgIGlmICghY3VyKSB7XHJcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICAgXCJJbnZhbGlkIGhhbmRsZXIgZm9yIGV2ZW50IFxcXCJcIiArIChldmVudC5uYW1lKSArIFwiXFxcIjogZ290IFwiICsgU3RyaW5nKGN1ciksXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAoIW9sZCkge1xyXG4gICAgICBpZiAoIWN1ci5pbnZva2VyKSB7XHJcbiAgICAgICAgY3VyID0gb25bbmFtZV0gPSBjcmVhdGVFdmVudEhhbmRsZShjdXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGFkZChldmVudC5uYW1lLCBjdXIuaW52b2tlciwgZXZlbnQub25jZSwgZXZlbnQuY2FwdHVyZSk7XHJcbiAgICB9IGVsc2UgaWYgKGN1ciAhPT0gb2xkKSB7XHJcbiAgICAgIG9sZC5mbiA9IGN1cjtcclxuICAgICAgb25bbmFtZV0gPSBvbGQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZvciAobmFtZSBpbiBvbGRPbikge1xyXG4gICAgaWYgKCFvbltuYW1lXSkge1xyXG4gICAgICBldmVudCA9IG5vcm1hbGl6ZUV2ZW50KG5hbWUpO1xyXG4gICAgICByZW1vdmUkJDEoZXZlbnQubmFtZSwgb2xkT25bbmFtZV0uaW52b2tlciwgZXZlbnQuY2FwdHVyZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbi8vIFRoZSB0ZW1wbGF0ZSBjb21waWxlciBhdHRlbXB0cyB0byBtaW5pbWl6ZSB0aGUgbmVlZCBmb3Igbm9ybWFsaXphdGlvbiBieVxyXG4vLyBzdGF0aWNhbGx5IGFuYWx5emluZyB0aGUgdGVtcGxhdGUgYXQgY29tcGlsZSB0aW1lLlxyXG4vL1xyXG4vLyBGb3IgcGxhaW4gSFRNTCBtYXJrdXAsIG5vcm1hbGl6YXRpb24gY2FuIGJlIGNvbXBsZXRlbHkgc2tpcHBlZCBiZWNhdXNlIHRoZVxyXG4vLyBnZW5lcmF0ZWQgcmVuZGVyIGZ1bmN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gcmV0dXJuIEFycmF5PFZOb2RlPi4gVGhlcmUgYXJlXHJcbi8vIHR3byBjYXNlcyB3aGVyZSBleHRyYSBub3JtYWxpemF0aW9uIGlzIG5lZWRlZDpcclxuXHJcbi8vIDEuIFdoZW4gdGhlIGNoaWxkcmVuIGNvbnRhaW5zIGNvbXBvbmVudHMgLSBiZWNhdXNlIGEgZnVuY3Rpb25hbCBjb21wb25lbnRcclxuLy8gbWF5IHJldHVybiBhbiBBcnJheSBpbnN0ZWFkIG9mIGEgc2luZ2xlIHJvb3QuIEluIHRoaXMgY2FzZSwganVzdCBhIHNpbXBsZVxyXG4vLyBub21yYWxpemF0aW9uIGlzIG5lZWRlZCAtIGlmIGFueSBjaGlsZCBpcyBhbiBBcnJheSwgd2UgZmxhdHRlbiB0aGUgd2hvbGVcclxuLy8gdGhpbmcgd2l0aCBBcnJheS5wcm90b3R5cGUuY29uY2F0LiBJdCBpcyBndWFyYW50ZWVkIHRvIGJlIG9ubHkgMS1sZXZlbCBkZWVwXHJcbi8vIGJlY2F1c2UgZnVuY3Rpb25hbCBjb21wb25lbnRzIGFscmVhZHkgbm9ybWFsaXplIHRoZWlyIG93biBjaGlsZHJlbi5cclxuZnVuY3Rpb24gc2ltcGxlTm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5baV0pKSB7XHJcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBjaGlsZHJlbilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNoaWxkcmVuXHJcbn1cclxuXHJcbi8vIDIuIFdoZW4gdGhlIGNoaWxkcmVuIGNvbnRhaW5zIGNvbnN0cmN1dHMgdGhhdCBhbHdheXMgZ2VuZXJhdGVkIG5lc3RlZCBBcnJheXMsXHJcbi8vIGUuZy4gPHRlbXBsYXRlPiwgPHNsb3Q+LCB2LWZvciwgb3Igd2hlbiB0aGUgY2hpbGRyZW4gaXMgcHJvdmlkZWQgYnkgdXNlclxyXG4vLyB3aXRoIGhhbmQtd3JpdHRlbiByZW5kZXIgZnVuY3Rpb25zIC8gSlNYLiBJbiBzdWNoIGNhc2VzIGEgZnVsbCBub3JtYWxpemF0aW9uXHJcbi8vIGlzIG5lZWRlZCB0byBjYXRlciB0byBhbGwgcG9zc2libGUgdHlwZXMgb2YgY2hpbGRyZW4gdmFsdWVzLlxyXG5mdW5jdGlvbiBub3JtYWxpemVDaGlsZHJlbiAoY2hpbGRyZW4pIHtcclxuICByZXR1cm4gaXNQcmltaXRpdmUoY2hpbGRyZW4pXHJcbiAgICA/IFtjcmVhdGVUZXh0Vk5vZGUoY2hpbGRyZW4pXVxyXG4gICAgOiBBcnJheS5pc0FycmF5KGNoaWxkcmVuKVxyXG4gICAgICA/IG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4oY2hpbGRyZW4pXHJcbiAgICAgIDogdW5kZWZpbmVkXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4gKGNoaWxkcmVuLCBuZXN0ZWRJbmRleCkge1xyXG4gIHZhciByZXMgPSBbXTtcclxuICB2YXIgaSwgYywgbGFzdDtcclxuICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgIGMgPSBjaGlsZHJlbltpXTtcclxuICAgIGlmIChjID09IG51bGwgfHwgdHlwZW9mIGMgPT09ICdib29sZWFuJykgeyBjb250aW51ZSB9XHJcbiAgICBsYXN0ID0gcmVzW3Jlcy5sZW5ndGggLSAxXTtcclxuICAgIC8vICBuZXN0ZWRcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGMpKSB7XHJcbiAgICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgbm9ybWFsaXplQXJyYXlDaGlsZHJlbihjLCAoKG5lc3RlZEluZGV4IHx8ICcnKSArIFwiX1wiICsgaSkpKTtcclxuICAgIH0gZWxzZSBpZiAoaXNQcmltaXRpdmUoYykpIHtcclxuICAgICAgaWYgKGxhc3QgJiYgbGFzdC50ZXh0KSB7XHJcbiAgICAgICAgbGFzdC50ZXh0ICs9IFN0cmluZyhjKTtcclxuICAgICAgfSBlbHNlIGlmIChjICE9PSAnJykge1xyXG4gICAgICAgIC8vIGNvbnZlcnQgcHJpbWl0aXZlIHRvIHZub2RlXHJcbiAgICAgICAgcmVzLnB1c2goY3JlYXRlVGV4dFZOb2RlKGMpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGMudGV4dCAmJiBsYXN0ICYmIGxhc3QudGV4dCkge1xyXG4gICAgICAgIHJlc1tyZXMubGVuZ3RoIC0gMV0gPSBjcmVhdGVUZXh0Vk5vZGUobGFzdC50ZXh0ICsgYy50ZXh0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBkZWZhdWx0IGtleSBmb3IgbmVzdGVkIGFycmF5IGNoaWxkcmVuIChsaWtlbHkgZ2VuZXJhdGVkIGJ5IHYtZm9yKVxyXG4gICAgICAgIGlmIChjLnRhZyAmJiBjLmtleSA9PSBudWxsICYmIG5lc3RlZEluZGV4ICE9IG51bGwpIHtcclxuICAgICAgICAgIGMua2V5ID0gXCJfX3ZsaXN0XCIgKyBuZXN0ZWRJbmRleCArIFwiX1wiICsgaSArIFwiX19cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnB1c2goYyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGdldEZpcnN0Q29tcG9uZW50Q2hpbGQgKGNoaWxkcmVuKSB7XHJcbiAgcmV0dXJuIGNoaWxkcmVuICYmIGNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYyAmJiBjLmNvbXBvbmVudE9wdGlvbnM7IH0pWzBdXHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIFNJTVBMRV9OT1JNQUxJWkUgPSAxO1xyXG52YXIgQUxXQVlTX05PUk1BTElaRSA9IDI7XHJcblxyXG4vLyB3cmFwcGVyIGZ1bmN0aW9uIGZvciBwcm92aWRpbmcgYSBtb3JlIGZsZXhpYmxlIGludGVyZmFjZVxyXG4vLyB3aXRob3V0IGdldHRpbmcgeWVsbGVkIGF0IGJ5IGZsb3dcclxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAoXHJcbiAgY29udGV4dCxcclxuICB0YWcsXHJcbiAgZGF0YSxcclxuICBjaGlsZHJlbixcclxuICBub3JtYWxpemF0aW9uVHlwZSxcclxuICBhbHdheXNOb3JtYWxpemVcclxuKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgfHwgaXNQcmltaXRpdmUoZGF0YSkpIHtcclxuICAgIG5vcm1hbGl6YXRpb25UeXBlID0gY2hpbGRyZW47XHJcbiAgICBjaGlsZHJlbiA9IGRhdGE7XHJcbiAgICBkYXRhID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBpZiAoYWx3YXlzTm9ybWFsaXplKSB7IG5vcm1hbGl6YXRpb25UeXBlID0gQUxXQVlTX05PUk1BTElaRTsgfVxyXG4gIHJldHVybiBfY3JlYXRlRWxlbWVudChjb250ZXh0LCB0YWcsIGRhdGEsIGNoaWxkcmVuLCBub3JtYWxpemF0aW9uVHlwZSlcclxufVxyXG5cclxuZnVuY3Rpb24gX2NyZWF0ZUVsZW1lbnQgKFxyXG4gIGNvbnRleHQsXHJcbiAgdGFnLFxyXG4gIGRhdGEsXHJcbiAgY2hpbGRyZW4sXHJcbiAgbm9ybWFsaXphdGlvblR5cGVcclxuKSB7XHJcbiAgaWYgKGRhdGEgJiYgZGF0YS5fX29iX18pIHtcclxuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgIFwiQXZvaWQgdXNpbmcgb2JzZXJ2ZWQgZGF0YSBvYmplY3QgYXMgdm5vZGUgZGF0YTogXCIgKyAoSlNPTi5zdHJpbmdpZnkoZGF0YSkpICsgXCJcXG5cIiArXHJcbiAgICAgICdBbHdheXMgY3JlYXRlIGZyZXNoIHZub2RlIGRhdGEgb2JqZWN0cyBpbiBlYWNoIHJlbmRlciEnLFxyXG4gICAgICBjb250ZXh0XHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGNyZWF0ZUVtcHR5Vk5vZGUoKVxyXG4gIH1cclxuICBpZiAoIXRhZykge1xyXG4gICAgLy8gaW4gY2FzZSBvZiBjb21wb25lbnQgOmlzIHNldCB0byBmYWxzeSB2YWx1ZVxyXG4gICAgcmV0dXJuIGNyZWF0ZUVtcHR5Vk5vZGUoKVxyXG4gIH1cclxuICAvLyBzdXBwb3J0IHNpbmdsZSBmdW5jdGlvbiBjaGlsZHJlbiBhcyBkZWZhdWx0IHNjb3BlZCBzbG90XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pICYmXHJcbiAgICAgIHR5cGVvZiBjaGlsZHJlblswXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307XHJcbiAgICBkYXRhLnNjb3BlZFNsb3RzID0geyBkZWZhdWx0OiBjaGlsZHJlblswXSB9O1xyXG4gICAgY2hpbGRyZW4ubGVuZ3RoID0gMDtcclxuICB9XHJcbiAgaWYgKG5vcm1hbGl6YXRpb25UeXBlID09PSBBTFdBWVNfTk9STUFMSVpFKSB7XHJcbiAgICBjaGlsZHJlbiA9IG5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKTtcclxuICB9IGVsc2UgaWYgKG5vcm1hbGl6YXRpb25UeXBlID09PSBTSU1QTEVfTk9STUFMSVpFKSB7XHJcbiAgICBjaGlsZHJlbiA9IHNpbXBsZU5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKTtcclxuICB9XHJcbiAgdmFyIHZub2RlLCBucztcclxuICBpZiAodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpIHtcclxuICAgIHZhciBDdG9yO1xyXG4gICAgbnMgPSBjb25maWcuZ2V0VGFnTmFtZXNwYWNlKHRhZyk7XHJcbiAgICBpZiAoY29uZmlnLmlzUmVzZXJ2ZWRUYWcodGFnKSkge1xyXG4gICAgICAvLyBwbGF0Zm9ybSBidWlsdC1pbiBlbGVtZW50c1xyXG4gICAgICB2bm9kZSA9IG5ldyBWTm9kZShcclxuICAgICAgICBjb25maWcucGFyc2VQbGF0Zm9ybVRhZ05hbWUodGFnKSwgZGF0YSwgY2hpbGRyZW4sXHJcbiAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHRcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAoKEN0b3IgPSByZXNvbHZlQXNzZXQoY29udGV4dC4kb3B0aW9ucywgJ2NvbXBvbmVudHMnLCB0YWcpKSkge1xyXG4gICAgICAvLyBjb21wb25lbnRcclxuICAgICAgdm5vZGUgPSBjcmVhdGVDb21wb25lbnQoQ3RvciwgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4sIHRhZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB1bmtub3duIG9yIHVubGlzdGVkIG5hbWVzcGFjZWQgZWxlbWVudHNcclxuICAgICAgLy8gY2hlY2sgYXQgcnVudGltZSBiZWNhdXNlIGl0IG1heSBnZXQgYXNzaWduZWQgYSBuYW1lc3BhY2Ugd2hlbiBpdHNcclxuICAgICAgLy8gcGFyZW50IG5vcm1hbGl6ZXMgY2hpbGRyZW5cclxuICAgICAgdm5vZGUgPSBuZXcgVk5vZGUoXHJcbiAgICAgICAgdGFnLCBkYXRhLCBjaGlsZHJlbixcclxuICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBkaXJlY3QgY29tcG9uZW50IG9wdGlvbnMgLyBjb25zdHJ1Y3RvclxyXG4gICAgdm5vZGUgPSBjcmVhdGVDb21wb25lbnQodGFnLCBkYXRhLCBjb250ZXh0LCBjaGlsZHJlbik7XHJcbiAgfVxyXG4gIGlmICh2bm9kZSkge1xyXG4gICAgaWYgKG5zKSB7IGFwcGx5TlModm5vZGUsIG5zKTsgfVxyXG4gICAgcmV0dXJuIHZub2RlXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5TlMgKHZub2RlLCBucykge1xyXG4gIHZub2RlLm5zID0gbnM7XHJcbiAgaWYgKHZub2RlLnRhZyA9PT0gJ2ZvcmVpZ25PYmplY3QnKSB7XHJcbiAgICAvLyB1c2UgZGVmYXVsdCBuYW1lc3BhY2UgaW5zaWRlIGZvcmVpZ25PYmplY3RcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBpZiAodm5vZGUuY2hpbGRyZW4pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIHZhciBjaGlsZCA9IHZub2RlLmNoaWxkcmVuW2ldO1xyXG4gICAgICBpZiAoY2hpbGQudGFnICYmICFjaGlsZC5ucykge1xyXG4gICAgICAgIGFwcGx5TlMoY2hpbGQsIG5zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiBpbml0UmVuZGVyICh2bSkge1xyXG4gIHZtLiR2bm9kZSA9IG51bGw7IC8vIHRoZSBwbGFjZWhvbGRlciBub2RlIGluIHBhcmVudCB0cmVlXHJcbiAgdm0uX3Zub2RlID0gbnVsbDsgLy8gdGhlIHJvb3Qgb2YgdGhlIGNoaWxkIHRyZWVcclxuICB2bS5fc3RhdGljVHJlZXMgPSBudWxsO1xyXG4gIHZhciBwYXJlbnRWbm9kZSA9IHZtLiRvcHRpb25zLl9wYXJlbnRWbm9kZTtcclxuICB2YXIgcmVuZGVyQ29udGV4dCA9IHBhcmVudFZub2RlICYmIHBhcmVudFZub2RlLmNvbnRleHQ7XHJcbiAgdm0uJHNsb3RzID0gcmVzb2x2ZVNsb3RzKHZtLiRvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiwgcmVuZGVyQ29udGV4dCk7XHJcbiAgdm0uJHNjb3BlZFNsb3RzID0ge307XHJcbiAgLy8gYmluZCB0aGUgY3JlYXRlRWxlbWVudCBmbiB0byB0aGlzIGluc3RhbmNlXHJcbiAgLy8gc28gdGhhdCB3ZSBnZXQgcHJvcGVyIHJlbmRlciBjb250ZXh0IGluc2lkZSBpdC5cclxuICAvLyBhcmdzIG9yZGVyOiB0YWcsIGRhdGEsIGNoaWxkcmVuLCBub3JtYWxpemF0aW9uVHlwZSwgYWx3YXlzTm9ybWFsaXplXHJcbiAgLy8gaW50ZXJuYWwgdmVyc2lvbiBpcyB1c2VkIGJ5IHJlbmRlciBmdW5jdGlvbnMgY29tcGlsZWQgZnJvbSB0ZW1wbGF0ZXNcclxuICB2bS5fYyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KHZtLCBhLCBiLCBjLCBkLCBmYWxzZSk7IH07XHJcbiAgLy8gbm9ybWFsaXphdGlvbiBpcyBhbHdheXMgYXBwbGllZCBmb3IgdGhlIHB1YmxpYyB2ZXJzaW9uLCB1c2VkIGluXHJcbiAgLy8gdXNlci13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMuXHJcbiAgdm0uJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudCh2bSwgYSwgYiwgYywgZCwgdHJ1ZSk7IH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck1peGluIChWdWUpIHtcclxuICBWdWUucHJvdG90eXBlLiRuZXh0VGljayA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgcmV0dXJuIG5leHRUaWNrKGZuLCB0aGlzKVxyXG4gIH07XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2YXIgcmVmID0gdm0uJG9wdGlvbnM7XHJcbiAgICB2YXIgcmVuZGVyID0gcmVmLnJlbmRlcjtcclxuICAgIHZhciBzdGF0aWNSZW5kZXJGbnMgPSByZWYuc3RhdGljUmVuZGVyRm5zO1xyXG4gICAgdmFyIF9wYXJlbnRWbm9kZSA9IHJlZi5fcGFyZW50Vm5vZGU7XHJcblxyXG4gICAgaWYgKHZtLl9pc01vdW50ZWQpIHtcclxuICAgICAgLy8gY2xvbmUgc2xvdCBub2RlcyBvbiByZS1yZW5kZXJzXHJcbiAgICAgIGZvciAodmFyIGtleSBpbiB2bS4kc2xvdHMpIHtcclxuICAgICAgICB2bS4kc2xvdHNba2V5XSA9IGNsb25lVk5vZGVzKHZtLiRzbG90c1trZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChfcGFyZW50Vm5vZGUgJiYgX3BhcmVudFZub2RlLmRhdGEuc2NvcGVkU2xvdHMpIHtcclxuICAgICAgdm0uJHNjb3BlZFNsb3RzID0gX3BhcmVudFZub2RlLmRhdGEuc2NvcGVkU2xvdHM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRpY1JlbmRlckZucyAmJiAhdm0uX3N0YXRpY1RyZWVzKSB7XHJcbiAgICAgIHZtLl9zdGF0aWNUcmVlcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IHBhcmVudCB2bm9kZS4gdGhpcyBhbGxvd3MgcmVuZGVyIGZ1bmN0aW9ucyB0byBoYXZlIGFjY2Vzc1xyXG4gICAgLy8gdG8gdGhlIGRhdGEgb24gdGhlIHBsYWNlaG9sZGVyIG5vZGUuXHJcbiAgICB2bS4kdm5vZGUgPSBfcGFyZW50Vm5vZGU7XHJcbiAgICAvLyByZW5kZXIgc2VsZlxyXG4gICAgdmFyIHZub2RlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdm5vZGUgPSByZW5kZXIuY2FsbCh2bS5fcmVuZGVyUHJveHksIHZtLiRjcmVhdGVFbGVtZW50KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKGNvbmZpZy5lcnJvckhhbmRsZXIpIHtcclxuICAgICAgICBjb25maWcuZXJyb3JIYW5kbGVyLmNhbGwobnVsbCwgZSwgdm0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdhcm4oKFwiRXJyb3Igd2hlbiByZW5kZXJpbmcgXCIgKyAoZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpICsgXCI6XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHJldHVybiBwcmV2aW91cyB2bm9kZSB0byBwcmV2ZW50IHJlbmRlciBlcnJvciBjYXVzaW5nIGJsYW5rIGNvbXBvbmVudFxyXG4gICAgICB2bm9kZSA9IHZtLl92bm9kZTtcclxuICAgIH1cclxuICAgIC8vIHJldHVybiBlbXB0eSB2bm9kZSBpbiBjYXNlIHRoZSByZW5kZXIgZnVuY3Rpb24gZXJyb3JlZCBvdXRcclxuICAgIGlmICghKHZub2RlIGluc3RhbmNlb2YgVk5vZGUpKSB7XHJcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBBcnJheS5pc0FycmF5KHZub2RlKSkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAnTXVsdGlwbGUgcm9vdCBub2RlcyByZXR1cm5lZCBmcm9tIHJlbmRlciBmdW5jdGlvbi4gUmVuZGVyIGZ1bmN0aW9uICcgK1xyXG4gICAgICAgICAgJ3Nob3VsZCByZXR1cm4gYSBzaW5nbGUgcm9vdCBub2RlLicsXHJcbiAgICAgICAgICB2bVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgdm5vZGUgPSBjcmVhdGVFbXB0eVZOb2RlKCk7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgcGFyZW50XHJcbiAgICB2bm9kZS5wYXJlbnQgPSBfcGFyZW50Vm5vZGU7XHJcbiAgICByZXR1cm4gdm5vZGVcclxuICB9O1xyXG5cclxuICAvLyB0b1N0cmluZyBmb3IgbXVzdGFjaGVzXHJcbiAgVnVlLnByb3RvdHlwZS5fcyA9IF90b1N0cmluZztcclxuICAvLyBjb252ZXJ0IHRleHQgdG8gdm5vZGVcclxuICBWdWUucHJvdG90eXBlLl92ID0gY3JlYXRlVGV4dFZOb2RlO1xyXG4gIC8vIG51bWJlciBjb252ZXJzaW9uXHJcbiAgVnVlLnByb3RvdHlwZS5fbiA9IHRvTnVtYmVyO1xyXG4gIC8vIGVtcHR5IHZub2RlXHJcbiAgVnVlLnByb3RvdHlwZS5fZSA9IGNyZWF0ZUVtcHR5Vk5vZGU7XHJcbiAgLy8gbG9vc2UgZXF1YWxcclxuICBWdWUucHJvdG90eXBlLl9xID0gbG9vc2VFcXVhbDtcclxuICAvLyBsb29zZSBpbmRleE9mXHJcbiAgVnVlLnByb3RvdHlwZS5faSA9IGxvb3NlSW5kZXhPZjtcclxuXHJcbiAgLy8gcmVuZGVyIHN0YXRpYyB0cmVlIGJ5IGluZGV4XHJcbiAgVnVlLnByb3RvdHlwZS5fbSA9IGZ1bmN0aW9uIHJlbmRlclN0YXRpYyAoXHJcbiAgICBpbmRleCxcclxuICAgIGlzSW5Gb3JcclxuICApIHtcclxuICAgIHZhciB0cmVlID0gdGhpcy5fc3RhdGljVHJlZXNbaW5kZXhdO1xyXG4gICAgLy8gaWYgaGFzIGFscmVhZHktcmVuZGVyZWQgc3RhdGljIHRyZWUgYW5kIG5vdCBpbnNpZGUgdi1mb3IsXHJcbiAgICAvLyB3ZSBjYW4gcmV1c2UgdGhlIHNhbWUgdHJlZSBieSBkb2luZyBhIHNoYWxsb3cgY2xvbmUuXHJcbiAgICBpZiAodHJlZSAmJiAhaXNJbkZvcikge1xyXG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0cmVlKVxyXG4gICAgICAgID8gY2xvbmVWTm9kZXModHJlZSlcclxuICAgICAgICA6IGNsb25lVk5vZGUodHJlZSlcclxuICAgIH1cclxuICAgIC8vIG90aGVyd2lzZSwgcmVuZGVyIGEgZnJlc2ggdHJlZS5cclxuICAgIHRyZWUgPSB0aGlzLl9zdGF0aWNUcmVlc1tpbmRleF0gPSB0aGlzLiRvcHRpb25zLnN0YXRpY1JlbmRlckZuc1tpbmRleF0uY2FsbCh0aGlzLl9yZW5kZXJQcm94eSk7XHJcbiAgICBtYXJrU3RhdGljKHRyZWUsIChcIl9fc3RhdGljX19cIiArIGluZGV4KSwgZmFsc2UpO1xyXG4gICAgcmV0dXJuIHRyZWVcclxuICB9O1xyXG5cclxuICAvLyBtYXJrIG5vZGUgYXMgc3RhdGljICh2LW9uY2UpXHJcbiAgVnVlLnByb3RvdHlwZS5fbyA9IGZ1bmN0aW9uIG1hcmtPbmNlIChcclxuICAgIHRyZWUsXHJcbiAgICBpbmRleCxcclxuICAgIGtleVxyXG4gICkge1xyXG4gICAgbWFya1N0YXRpYyh0cmVlLCAoXCJfX29uY2VfX1wiICsgaW5kZXggKyAoa2V5ID8gKFwiX1wiICsga2V5KSA6IFwiXCIpKSwgdHJ1ZSk7XHJcbiAgICByZXR1cm4gdHJlZVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIG1hcmtTdGF0aWMgKHRyZWUsIGtleSwgaXNPbmNlKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmVlKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodHJlZVtpXSAmJiB0eXBlb2YgdHJlZVtpXSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIG1hcmtTdGF0aWNOb2RlKHRyZWVbaV0sIChrZXkgKyBcIl9cIiArIGkpLCBpc09uY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWFya1N0YXRpY05vZGUodHJlZSwga2V5LCBpc09uY2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFya1N0YXRpY05vZGUgKG5vZGUsIGtleSwgaXNPbmNlKSB7XHJcbiAgICBub2RlLmlzU3RhdGljID0gdHJ1ZTtcclxuICAgIG5vZGUua2V5ID0ga2V5O1xyXG4gICAgbm9kZS5pc09uY2UgPSBpc09uY2U7XHJcbiAgfVxyXG5cclxuICAvLyBmaWx0ZXIgcmVzb2x1dGlvbiBoZWxwZXJcclxuICBWdWUucHJvdG90eXBlLl9mID0gZnVuY3Rpb24gcmVzb2x2ZUZpbHRlciAoaWQpIHtcclxuICAgIHJldHVybiByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBpZCwgdHJ1ZSkgfHwgaWRlbnRpdHlcclxuICB9O1xyXG5cclxuICAvLyByZW5kZXIgdi1mb3JcclxuICBWdWUucHJvdG90eXBlLl9sID0gZnVuY3Rpb24gcmVuZGVyTGlzdCAoXHJcbiAgICB2YWwsXHJcbiAgICByZW5kZXJcclxuICApIHtcclxuICAgIHZhciByZXQsIGksIGwsIGtleXMsIGtleTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkgfHwgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0ID0gbmV3IEFycmF5KHZhbC5sZW5ndGgpO1xyXG4gICAgICBmb3IgKGkgPSAwLCBsID0gdmFsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIHJldFtpXSA9IHJlbmRlcih2YWxbaV0sIGkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIHJldCA9IG5ldyBBcnJheSh2YWwpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdmFsOyBpKyspIHtcclxuICAgICAgICByZXRbaV0gPSByZW5kZXIoaSArIDEsIGkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcclxuICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XHJcbiAgICAgIHJldCA9IG5ldyBBcnJheShrZXlzLmxlbmd0aCk7XHJcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgcmV0W2ldID0gcmVuZGVyKHZhbFtrZXldLCBrZXksIGkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfTtcclxuXHJcbiAgLy8gcmVuZGVyU2xvdFxyXG4gIFZ1ZS5wcm90b3R5cGUuX3QgPSBmdW5jdGlvbiAoXHJcbiAgICBuYW1lLFxyXG4gICAgZmFsbGJhY2ssXHJcbiAgICBwcm9wcyxcclxuICAgIGJpbmRPYmplY3RcclxuICApIHtcclxuICAgIHZhciBzY29wZWRTbG90Rm4gPSB0aGlzLiRzY29wZWRTbG90c1tuYW1lXTtcclxuICAgIGlmIChzY29wZWRTbG90Rm4pIHsgLy8gc2NvcGVkIHNsb3RcclxuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgICAgaWYgKGJpbmRPYmplY3QpIHtcclxuICAgICAgICBleHRlbmQocHJvcHMsIGJpbmRPYmplY3QpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzY29wZWRTbG90Rm4ocHJvcHMpIHx8IGZhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgc2xvdE5vZGVzID0gdGhpcy4kc2xvdHNbbmFtZV07XHJcbiAgICAgIC8vIHdhcm4gZHVwbGljYXRlIHNsb3QgdXNhZ2VcclxuICAgICAgaWYgKHNsb3ROb2RlcyAmJiBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgIHNsb3ROb2Rlcy5fcmVuZGVyZWQgJiYgd2FybihcclxuICAgICAgICAgIFwiRHVwbGljYXRlIHByZXNlbmNlIG9mIHNsb3QgXFxcIlwiICsgbmFtZSArIFwiXFxcIiBmb3VuZCBpbiB0aGUgc2FtZSByZW5kZXIgdHJlZSBcIiArXHJcbiAgICAgICAgICBcIi0gdGhpcyB3aWxsIGxpa2VseSBjYXVzZSByZW5kZXIgZXJyb3JzLlwiLFxyXG4gICAgICAgICAgdGhpc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2xvdE5vZGVzLl9yZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNsb3ROb2RlcyB8fCBmYWxsYmFja1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIGFwcGx5IHYtYmluZCBvYmplY3RcclxuICBWdWUucHJvdG90eXBlLl9iID0gZnVuY3Rpb24gYmluZFByb3BzIChcclxuICAgIGRhdGEsXHJcbiAgICB0YWcsXHJcbiAgICB2YWx1ZSxcclxuICAgIGFzUHJvcFxyXG4gICkge1xyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICAgICd2LWJpbmQgd2l0aG91dCBhcmd1bWVudCBleHBlY3RzIGFuIE9iamVjdCBvciBBcnJheSB2YWx1ZScsXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIHZhbHVlID0gdG9PYmplY3QodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgIGlmIChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnc3R5bGUnKSB7XHJcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlW2tleV07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy50eXBlO1xyXG4gICAgICAgICAgICB2YXIgaGFzaCA9IGFzUHJvcCB8fCBjb25maWcubXVzdFVzZVByb3AodGFnLCB0eXBlLCBrZXkpXHJcbiAgICAgICAgICAgICAgPyBkYXRhLmRvbVByb3BzIHx8IChkYXRhLmRvbVByb3BzID0ge30pXHJcbiAgICAgICAgICAgICAgOiBkYXRhLmF0dHJzIHx8IChkYXRhLmF0dHJzID0ge30pO1xyXG4gICAgICAgICAgICBoYXNoW2tleV0gPSB2YWx1ZVtrZXldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9O1xyXG5cclxuICAvLyBjaGVjayB2LW9uIGtleUNvZGVzXHJcbiAgVnVlLnByb3RvdHlwZS5fayA9IGZ1bmN0aW9uIGNoZWNrS2V5Q29kZXMgKFxyXG4gICAgZXZlbnRLZXlDb2RlLFxyXG4gICAga2V5LFxyXG4gICAgYnVpbHRJbkFsaWFzXHJcbiAgKSB7XHJcbiAgICB2YXIga2V5Q29kZXMgPSBjb25maWcua2V5Q29kZXNba2V5XSB8fCBidWlsdEluQWxpYXM7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShrZXlDb2RlcykpIHtcclxuICAgICAgcmV0dXJuIGtleUNvZGVzLmluZGV4T2YoZXZlbnRLZXlDb2RlKSA9PT0gLTFcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBrZXlDb2RlcyAhPT0gZXZlbnRLZXlDb2RlXHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZVNsb3RzIChcclxuICBjaGlsZHJlbixcclxuICBjb250ZXh0XHJcbikge1xyXG4gIHZhciBzbG90cyA9IHt9O1xyXG4gIGlmICghY2hpbGRyZW4pIHtcclxuICAgIHJldHVybiBzbG90c1xyXG4gIH1cclxuICB2YXIgZGVmYXVsdFNsb3QgPSBbXTtcclxuICB2YXIgbmFtZSwgY2hpbGQ7XHJcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAvLyBuYW1lZCBzbG90cyBzaG91bGQgb25seSBiZSByZXNwZWN0ZWQgaWYgdGhlIHZub2RlIHdhcyByZW5kZXJlZCBpbiB0aGVcclxuICAgIC8vIHNhbWUgY29udGV4dC5cclxuICAgIGlmICgoY2hpbGQuY29udGV4dCA9PT0gY29udGV4dCB8fCBjaGlsZC5mdW5jdGlvbmFsQ29udGV4dCA9PT0gY29udGV4dCkgJiZcclxuICAgICAgICBjaGlsZC5kYXRhICYmIChuYW1lID0gY2hpbGQuZGF0YS5zbG90KSkge1xyXG4gICAgICB2YXIgc2xvdCA9IChzbG90c1tuYW1lXSB8fCAoc2xvdHNbbmFtZV0gPSBbXSkpO1xyXG4gICAgICBpZiAoY2hpbGQudGFnID09PSAndGVtcGxhdGUnKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoLmFwcGx5KHNsb3QsIGNoaWxkLmNoaWxkcmVuKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzbG90LnB1c2goY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWZhdWx0U2xvdC5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWdub3JlIHNpbmdsZSB3aGl0ZXNwYWNlXHJcbiAgaWYgKGRlZmF1bHRTbG90Lmxlbmd0aCAmJiAhKFxyXG4gICAgZGVmYXVsdFNsb3QubGVuZ3RoID09PSAxICYmXHJcbiAgICAoZGVmYXVsdFNsb3RbMF0udGV4dCA9PT0gJyAnIHx8IGRlZmF1bHRTbG90WzBdLmlzQ29tbWVudClcclxuICApKSB7XHJcbiAgICBzbG90cy5kZWZhdWx0ID0gZGVmYXVsdFNsb3Q7XHJcbiAgfVxyXG4gIHJldHVybiBzbG90c1xyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGluaXRFdmVudHMgKHZtKSB7XHJcbiAgdm0uX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgdm0uX2hhc0hvb2tFdmVudCA9IGZhbHNlO1xyXG4gIC8vIGluaXQgcGFyZW50IGF0dGFjaGVkIGV2ZW50c1xyXG4gIHZhciBsaXN0ZW5lcnMgPSB2bS4kb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzO1xyXG4gIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzKTtcclxuICB9XHJcbn1cclxuXHJcbnZhciB0YXJnZXQ7XHJcblxyXG5mdW5jdGlvbiBhZGQkMSAoZXZlbnQsIGZuLCBvbmNlKSB7XHJcbiAgaWYgKG9uY2UpIHtcclxuICAgIHRhcmdldC4kb25jZShldmVudCwgZm4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0YXJnZXQuJG9uKGV2ZW50LCBmbik7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmUkMiAoZXZlbnQsIGZuKSB7XHJcbiAgdGFyZ2V0LiRvZmYoZXZlbnQsIGZuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50TGlzdGVuZXJzIChcclxuICB2bSxcclxuICBsaXN0ZW5lcnMsXHJcbiAgb2xkTGlzdGVuZXJzXHJcbikge1xyXG4gIHRhcmdldCA9IHZtO1xyXG4gIHVwZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMsIG9sZExpc3RlbmVycyB8fCB7fSwgYWRkJDEsIHJlbW92ZSQyLCB2bSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2ZW50c01peGluIChWdWUpIHtcclxuICB2YXIgaG9va1JFID0gL15ob29rOi87XHJcbiAgVnVlLnByb3RvdHlwZS4kb24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzOyh2bS5fZXZlbnRzW2V2ZW50XSB8fCAodm0uX2V2ZW50c1tldmVudF0gPSBbXSkpLnB1c2goZm4pO1xyXG4gICAgLy8gb3B0aW1pemUgaG9vazpldmVudCBjb3N0IGJ5IHVzaW5nIGEgYm9vbGVhbiBmbGFnIG1hcmtlZCBhdCByZWdpc3RyYXRpb25cclxuICAgIC8vIGluc3RlYWQgb2YgYSBoYXNoIGxvb2t1cFxyXG4gICAgaWYgKGhvb2tSRS50ZXN0KGV2ZW50KSkge1xyXG4gICAgICB2bS5faGFzSG9va0V2ZW50ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiB2bVxyXG4gIH07XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuJG9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgZnVuY3Rpb24gb24gKCkge1xyXG4gICAgICB2bS4kb2ZmKGV2ZW50LCBvbik7XHJcbiAgICAgIGZuLmFwcGx5KHZtLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG4gICAgb24uZm4gPSBmbjtcclxuICAgIHZtLiRvbihldmVudCwgb24pO1xyXG4gICAgcmV0dXJuIHZtXHJcbiAgfTtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIC8vIGFsbFxyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICByZXR1cm4gdm1cclxuICAgIH1cclxuICAgIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgICB2YXIgY2JzID0gdm0uX2V2ZW50c1tldmVudF07XHJcbiAgICBpZiAoIWNicykge1xyXG4gICAgICByZXR1cm4gdm1cclxuICAgIH1cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHZtLl9ldmVudHNbZXZlbnRdID0gbnVsbDtcclxuICAgICAgcmV0dXJuIHZtXHJcbiAgICB9XHJcbiAgICAvLyBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgICB2YXIgY2I7XHJcbiAgICB2YXIgaSA9IGNicy5sZW5ndGg7XHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIGNiID0gY2JzW2ldO1xyXG4gICAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xyXG4gICAgICAgIGNicy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZtXHJcbiAgfTtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS4kZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZhciBjYnMgPSB2bS5fZXZlbnRzW2V2ZW50XTtcclxuICAgIGlmIChjYnMpIHtcclxuICAgICAgY2JzID0gY2JzLmxlbmd0aCA+IDEgPyB0b0FycmF5KGNicykgOiBjYnM7XHJcbiAgICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBjYnNbaV0uYXBwbHkodm0sIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdm1cclxuICB9O1xyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBhY3RpdmVJbnN0YW5jZSA9IG51bGw7XHJcblxyXG5mdW5jdGlvbiBpbml0TGlmZWN5Y2xlICh2bSkge1xyXG4gIHZhciBvcHRpb25zID0gdm0uJG9wdGlvbnM7XHJcblxyXG4gIC8vIGxvY2F0ZSBmaXJzdCBub24tYWJzdHJhY3QgcGFyZW50XHJcbiAgdmFyIHBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xyXG4gIGlmIChwYXJlbnQgJiYgIW9wdGlvbnMuYWJzdHJhY3QpIHtcclxuICAgIHdoaWxlIChwYXJlbnQuJG9wdGlvbnMuYWJzdHJhY3QgJiYgcGFyZW50LiRwYXJlbnQpIHtcclxuICAgICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnQ7XHJcbiAgICB9XHJcbiAgICBwYXJlbnQuJGNoaWxkcmVuLnB1c2godm0pO1xyXG4gIH1cclxuXHJcbiAgdm0uJHBhcmVudCA9IHBhcmVudDtcclxuICB2bS4kcm9vdCA9IHBhcmVudCA/IHBhcmVudC4kcm9vdCA6IHZtO1xyXG5cclxuICB2bS4kY2hpbGRyZW4gPSBbXTtcclxuICB2bS4kcmVmcyA9IHt9O1xyXG5cclxuICB2bS5fd2F0Y2hlciA9IG51bGw7XHJcbiAgdm0uX2luYWN0aXZlID0gZmFsc2U7XHJcbiAgdm0uX2lzTW91bnRlZCA9IGZhbHNlO1xyXG4gIHZtLl9pc0Rlc3Ryb3llZCA9IGZhbHNlO1xyXG4gIHZtLl9pc0JlaW5nRGVzdHJveWVkID0gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpZmVjeWNsZU1peGluIChWdWUpIHtcclxuICBWdWUucHJvdG90eXBlLl9tb3VudCA9IGZ1bmN0aW9uIChcclxuICAgIGVsLFxyXG4gICAgaHlkcmF0aW5nXHJcbiAgKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uJGVsID0gZWw7XHJcbiAgICBpZiAoIXZtLiRvcHRpb25zLnJlbmRlcikge1xyXG4gICAgICB2bS4kb3B0aW9ucy5yZW5kZXIgPSBjcmVhdGVFbXB0eVZOb2RlO1xyXG4gICAgICB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKHZtLiRvcHRpb25zLnRlbXBsYXRlICYmIHZtLiRvcHRpb25zLnRlbXBsYXRlLmNoYXJBdCgwKSAhPT0gJyMnKSB7XHJcbiAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAnWW91IGFyZSB1c2luZyB0aGUgcnVudGltZS1vbmx5IGJ1aWxkIG9mIFZ1ZSB3aGVyZSB0aGUgdGVtcGxhdGUgJyArXHJcbiAgICAgICAgICAgICdvcHRpb24gaXMgbm90IGF2YWlsYWJsZS4gRWl0aGVyIHByZS1jb21waWxlIHRoZSB0ZW1wbGF0ZXMgaW50byAnICtcclxuICAgICAgICAgICAgJ3JlbmRlciBmdW5jdGlvbnMsIG9yIHVzZSB0aGUgY29tcGlsZXItaW5jbHVkZWQgYnVpbGQuJyxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICdGYWlsZWQgdG8gbW91bnQgY29tcG9uZW50OiB0ZW1wbGF0ZSBvciByZW5kZXIgZnVuY3Rpb24gbm90IGRlZmluZWQuJyxcclxuICAgICAgICAgICAgdm1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjYWxsSG9vayh2bSwgJ2JlZm9yZU1vdW50Jyk7XHJcbiAgICB2bS5fd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHZtLCBmdW5jdGlvbiB1cGRhdGVDb21wb25lbnQgKCkge1xyXG4gICAgICB2bS5fdXBkYXRlKHZtLl9yZW5kZXIoKSwgaHlkcmF0aW5nKTtcclxuICAgIH0sIG5vb3ApO1xyXG4gICAgaHlkcmF0aW5nID0gZmFsc2U7XHJcbiAgICAvLyBtYW51YWxseSBtb3VudGVkIGluc3RhbmNlLCBjYWxsIG1vdW50ZWQgb24gc2VsZlxyXG4gICAgLy8gbW91bnRlZCBpcyBjYWxsZWQgZm9yIHJlbmRlci1jcmVhdGVkIGNoaWxkIGNvbXBvbmVudHMgaW4gaXRzIGluc2VydGVkIGhvb2tcclxuICAgIGlmICh2bS4kdm5vZGUgPT0gbnVsbCkge1xyXG4gICAgICB2bS5faXNNb3VudGVkID0gdHJ1ZTtcclxuICAgICAgY2FsbEhvb2sodm0sICdtb3VudGVkJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdm1cclxuICB9O1xyXG5cclxuICBWdWUucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAodm5vZGUsIGh5ZHJhdGluZykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIGlmICh2bS5faXNNb3VudGVkKSB7XHJcbiAgICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlVXBkYXRlJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgcHJldkVsID0gdm0uJGVsO1xyXG4gICAgdmFyIHByZXZWbm9kZSA9IHZtLl92bm9kZTtcclxuICAgIHZhciBwcmV2QWN0aXZlSW5zdGFuY2UgPSBhY3RpdmVJbnN0YW5jZTtcclxuICAgIGFjdGl2ZUluc3RhbmNlID0gdm07XHJcbiAgICB2bS5fdm5vZGUgPSB2bm9kZTtcclxuICAgIC8vIFZ1ZS5wcm90b3R5cGUuX19wYXRjaF9fIGlzIGluamVjdGVkIGluIGVudHJ5IHBvaW50c1xyXG4gICAgLy8gYmFzZWQgb24gdGhlIHJlbmRlcmluZyBiYWNrZW5kIHVzZWQuXHJcbiAgICBpZiAoIXByZXZWbm9kZSkge1xyXG4gICAgICAvLyBpbml0aWFsIHJlbmRlclxyXG4gICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18oXHJcbiAgICAgICAgdm0uJGVsLCB2bm9kZSwgaHlkcmF0aW5nLCBmYWxzZSAvKiByZW1vdmVPbmx5ICovLFxyXG4gICAgICAgIHZtLiRvcHRpb25zLl9wYXJlbnRFbG0sXHJcbiAgICAgICAgdm0uJG9wdGlvbnMuX3JlZkVsbVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gdXBkYXRlc1xyXG4gICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18ocHJldlZub2RlLCB2bm9kZSk7XHJcbiAgICB9XHJcbiAgICBhY3RpdmVJbnN0YW5jZSA9IHByZXZBY3RpdmVJbnN0YW5jZTtcclxuICAgIC8vIHVwZGF0ZSBfX3Z1ZV9fIHJlZmVyZW5jZVxyXG4gICAgaWYgKHByZXZFbCkge1xyXG4gICAgICBwcmV2RWwuX192dWVfXyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAodm0uJGVsKSB7XHJcbiAgICAgIHZtLiRlbC5fX3Z1ZV9fID0gdm07XHJcbiAgICB9XHJcbiAgICAvLyBpZiBwYXJlbnQgaXMgYW4gSE9DLCB1cGRhdGUgaXRzICRlbCBhcyB3ZWxsXHJcbiAgICBpZiAodm0uJHZub2RlICYmIHZtLiRwYXJlbnQgJiYgdm0uJHZub2RlID09PSB2bS4kcGFyZW50Ll92bm9kZSkge1xyXG4gICAgICB2bS4kcGFyZW50LiRlbCA9IHZtLiRlbDtcclxuICAgIH1cclxuICAgIC8vIHVwZGF0ZWQgaG9vayBpcyBjYWxsZWQgYnkgdGhlIHNjaGVkdWxlciB0byBlbnN1cmUgdGhhdCBjaGlsZHJlbiBhcmVcclxuICAgIC8vIHVwZGF0ZWQgaW4gYSBwYXJlbnQncyB1cGRhdGVkIGhvb2suXHJcbiAgfTtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS5fdXBkYXRlRnJvbVBhcmVudCA9IGZ1bmN0aW9uIChcclxuICAgIHByb3BzRGF0YSxcclxuICAgIGxpc3RlbmVycyxcclxuICAgIHBhcmVudFZub2RlLFxyXG4gICAgcmVuZGVyQ2hpbGRyZW5cclxuICApIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2YXIgaGFzQ2hpbGRyZW4gPSAhISh2bS4kb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4gfHwgcmVuZGVyQ2hpbGRyZW4pO1xyXG4gICAgdm0uJG9wdGlvbnMuX3BhcmVudFZub2RlID0gcGFyZW50Vm5vZGU7XHJcbiAgICB2bS4kdm5vZGUgPSBwYXJlbnRWbm9kZTsgLy8gdXBkYXRlIHZtJ3MgcGxhY2Vob2xkZXIgbm9kZSB3aXRob3V0IHJlLXJlbmRlclxyXG4gICAgaWYgKHZtLl92bm9kZSkgeyAvLyB1cGRhdGUgY2hpbGQgdHJlZSdzIHBhcmVudFxyXG4gICAgICB2bS5fdm5vZGUucGFyZW50ID0gcGFyZW50Vm5vZGU7XHJcbiAgICB9XHJcbiAgICB2bS4kb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4gPSByZW5kZXJDaGlsZHJlbjtcclxuICAgIC8vIHVwZGF0ZSBwcm9wc1xyXG4gICAgaWYgKHByb3BzRGF0YSAmJiB2bS4kb3B0aW9ucy5wcm9wcykge1xyXG4gICAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSBmYWxzZTtcclxuICAgICAge1xyXG4gICAgICAgIG9ic2VydmVyU3RhdGUuaXNTZXR0aW5nUHJvcHMgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwcm9wS2V5cyA9IHZtLiRvcHRpb25zLl9wcm9wS2V5cyB8fCBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wS2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBrZXkgPSBwcm9wS2V5c1tpXTtcclxuICAgICAgICB2bVtrZXldID0gdmFsaWRhdGVQcm9wKGtleSwgdm0uJG9wdGlvbnMucHJvcHMsIHByb3BzRGF0YSwgdm0pO1xyXG4gICAgICB9XHJcbiAgICAgIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHRydWU7XHJcbiAgICAgIHtcclxuICAgICAgICBvYnNlcnZlclN0YXRlLmlzU2V0dGluZ1Byb3BzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgdm0uJG9wdGlvbnMucHJvcHNEYXRhID0gcHJvcHNEYXRhO1xyXG4gICAgfVxyXG4gICAgLy8gdXBkYXRlIGxpc3RlbmVyc1xyXG4gICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICB2YXIgb2xkTGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcclxuICAgICAgdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycyA9IGxpc3RlbmVycztcclxuICAgICAgdXBkYXRlQ29tcG9uZW50TGlzdGVuZXJzKHZtLCBsaXN0ZW5lcnMsIG9sZExpc3RlbmVycyk7XHJcbiAgICB9XHJcbiAgICAvLyByZXNvbHZlIHNsb3RzICsgZm9yY2UgdXBkYXRlIGlmIGhhcyBjaGlsZHJlblxyXG4gICAgaWYgKGhhc0NoaWxkcmVuKSB7XHJcbiAgICAgIHZtLiRzbG90cyA9IHJlc29sdmVTbG90cyhyZW5kZXJDaGlsZHJlbiwgcGFyZW50Vm5vZGUuY29udGV4dCk7XHJcbiAgICAgIHZtLiRmb3JjZVVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuJGZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIGlmICh2bS5fd2F0Y2hlcikge1xyXG4gICAgICB2bS5fd2F0Y2hlci51cGRhdGUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBWdWUucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIGlmICh2bS5faXNCZWluZ0Rlc3Ryb3llZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlRGVzdHJveScpO1xyXG4gICAgdm0uX2lzQmVpbmdEZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgLy8gcmVtb3ZlIHNlbGYgZnJvbSBwYXJlbnRcclxuICAgIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50O1xyXG4gICAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkICYmICF2bS4kb3B0aW9ucy5hYnN0cmFjdCkge1xyXG4gICAgICByZW1vdmUkMShwYXJlbnQuJGNoaWxkcmVuLCB2bSk7XHJcbiAgICB9XHJcbiAgICAvLyB0ZWFyZG93biB3YXRjaGVyc1xyXG4gICAgaWYgKHZtLl93YXRjaGVyKSB7XHJcbiAgICAgIHZtLl93YXRjaGVyLnRlYXJkb3duKCk7XHJcbiAgICB9XHJcbiAgICB2YXIgaSA9IHZtLl93YXRjaGVycy5sZW5ndGg7XHJcbiAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgIHZtLl93YXRjaGVyc1tpXS50ZWFyZG93bigpO1xyXG4gICAgfVxyXG4gICAgLy8gcmVtb3ZlIHJlZmVyZW5jZSBmcm9tIGRhdGEgb2JcclxuICAgIC8vIGZyb3plbiBvYmplY3QgbWF5IG5vdCBoYXZlIG9ic2VydmVyLlxyXG4gICAgaWYgKHZtLl9kYXRhLl9fb2JfXykge1xyXG4gICAgICB2bS5fZGF0YS5fX29iX18udm1Db3VudC0tO1xyXG4gICAgfVxyXG4gICAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXHJcbiAgICB2bS5faXNEZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgY2FsbEhvb2sodm0sICdkZXN0cm95ZWQnKTtcclxuICAgIC8vIHR1cm4gb2ZmIGFsbCBpbnN0YW5jZSBsaXN0ZW5lcnMuXHJcbiAgICB2bS4kb2ZmKCk7XHJcbiAgICAvLyByZW1vdmUgX192dWVfXyByZWZlcmVuY2VcclxuICAgIGlmICh2bS4kZWwpIHtcclxuICAgICAgdm0uJGVsLl9fdnVlX18gPSBudWxsO1xyXG4gICAgfVxyXG4gICAgLy8gaW52b2tlIGRlc3Ryb3kgaG9va3Mgb24gY3VycmVudCByZW5kZXJlZCB0cmVlXHJcbiAgICB2bS5fX3BhdGNoX18odm0uX3Zub2RlLCBudWxsKTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxsSG9vayAodm0sIGhvb2spIHtcclxuICB2YXIgaGFuZGxlcnMgPSB2bS4kb3B0aW9uc1tob29rXTtcclxuICBpZiAoaGFuZGxlcnMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgIGhhbmRsZXJzW2ldLmNhbGwodm0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodm0uX2hhc0hvb2tFdmVudCkge1xyXG4gICAgdm0uJGVtaXQoJ2hvb2s6JyArIGhvb2spO1xyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG5cclxudmFyIHF1ZXVlID0gW107XHJcbnZhciBoYXMkMSA9IHt9O1xyXG52YXIgY2lyY3VsYXIgPSB7fTtcclxudmFyIHdhaXRpbmcgPSBmYWxzZTtcclxudmFyIGZsdXNoaW5nID0gZmFsc2U7XHJcbnZhciBpbmRleCA9IDA7XHJcblxyXG4vKipcclxuICogUmVzZXQgdGhlIHNjaGVkdWxlcidzIHN0YXRlLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVzZXRTY2hlZHVsZXJTdGF0ZSAoKSB7XHJcbiAgcXVldWUubGVuZ3RoID0gMDtcclxuICBoYXMkMSA9IHt9O1xyXG4gIHtcclxuICAgIGNpcmN1bGFyID0ge307XHJcbiAgfVxyXG4gIHdhaXRpbmcgPSBmbHVzaGluZyA9IGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogRmx1c2ggYm90aCBxdWV1ZXMgYW5kIHJ1biB0aGUgd2F0Y2hlcnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBmbHVzaFNjaGVkdWxlclF1ZXVlICgpIHtcclxuICBmbHVzaGluZyA9IHRydWU7XHJcbiAgdmFyIHdhdGNoZXIsIGlkLCB2bTtcclxuXHJcbiAgLy8gU29ydCBxdWV1ZSBiZWZvcmUgZmx1c2guXHJcbiAgLy8gVGhpcyBlbnN1cmVzIHRoYXQ6XHJcbiAgLy8gMS4gQ29tcG9uZW50cyBhcmUgdXBkYXRlZCBmcm9tIHBhcmVudCB0byBjaGlsZC4gKGJlY2F1c2UgcGFyZW50IGlzIGFsd2F5c1xyXG4gIC8vICAgIGNyZWF0ZWQgYmVmb3JlIHRoZSBjaGlsZClcclxuICAvLyAyLiBBIGNvbXBvbmVudCdzIHVzZXIgd2F0Y2hlcnMgYXJlIHJ1biBiZWZvcmUgaXRzIHJlbmRlciB3YXRjaGVyIChiZWNhdXNlXHJcbiAgLy8gICAgdXNlciB3YXRjaGVycyBhcmUgY3JlYXRlZCBiZWZvcmUgdGhlIHJlbmRlciB3YXRjaGVyKVxyXG4gIC8vIDMuIElmIGEgY29tcG9uZW50IGlzIGRlc3Ryb3llZCBkdXJpbmcgYSBwYXJlbnQgY29tcG9uZW50J3Mgd2F0Y2hlciBydW4sXHJcbiAgLy8gICAgaXRzIHdhdGNoZXJzIGNhbiBiZSBza2lwcGVkLlxyXG4gIHF1ZXVlLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcclxuXHJcbiAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgd2F0Y2hlcnMgbWlnaHQgYmUgcHVzaGVkXHJcbiAgLy8gYXMgd2UgcnVuIGV4aXN0aW5nIHdhdGNoZXJzXHJcbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgcXVldWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICB3YXRjaGVyID0gcXVldWVbaW5kZXhdO1xyXG4gICAgaWQgPSB3YXRjaGVyLmlkO1xyXG4gICAgaGFzJDFbaWRdID0gbnVsbDtcclxuICAgIHdhdGNoZXIucnVuKCk7XHJcbiAgICAvLyBpbiBkZXYgYnVpbGQsIGNoZWNrIGFuZCBzdG9wIGNpcmN1bGFyIHVwZGF0ZXMuXHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgaGFzJDFbaWRdICE9IG51bGwpIHtcclxuICAgICAgY2lyY3VsYXJbaWRdID0gKGNpcmN1bGFyW2lkXSB8fCAwKSArIDE7XHJcbiAgICAgIGlmIChjaXJjdWxhcltpZF0gPiBjb25maWcuX21heFVwZGF0ZUNvdW50KSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgJyArIChcclxuICAgICAgICAgICAgd2F0Y2hlci51c2VyXHJcbiAgICAgICAgICAgICAgPyAoXCJpbiB3YXRjaGVyIHdpdGggZXhwcmVzc2lvbiBcXFwiXCIgKyAod2F0Y2hlci5leHByZXNzaW9uKSArIFwiXFxcIlwiKVxyXG4gICAgICAgICAgICAgIDogXCJpbiBhIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb24uXCJcclxuICAgICAgICAgICksXHJcbiAgICAgICAgICB3YXRjaGVyLnZtXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsIHVwZGF0ZWQgaG9va3NcclxuICBpbmRleCA9IHF1ZXVlLmxlbmd0aDtcclxuICB3aGlsZSAoaW5kZXgtLSkge1xyXG4gICAgd2F0Y2hlciA9IHF1ZXVlW2luZGV4XTtcclxuICAgIHZtID0gd2F0Y2hlci52bTtcclxuICAgIGlmICh2bS5fd2F0Y2hlciA9PT0gd2F0Y2hlciAmJiB2bS5faXNNb3VudGVkKSB7XHJcbiAgICAgIGNhbGxIb29rKHZtLCAndXBkYXRlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZGV2dG9vbCBob29rXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKGRldnRvb2xzICYmIGNvbmZpZy5kZXZ0b29scykge1xyXG4gICAgZGV2dG9vbHMuZW1pdCgnZmx1c2gnKTtcclxuICB9XHJcblxyXG4gIHJlc2V0U2NoZWR1bGVyU3RhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFB1c2ggYSB3YXRjaGVyIGludG8gdGhlIHdhdGNoZXIgcXVldWUuXHJcbiAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xyXG4gKiBwdXNoZWQgd2hlbiB0aGUgcXVldWUgaXMgYmVpbmcgZmx1c2hlZC5cclxuICovXHJcbmZ1bmN0aW9uIHF1ZXVlV2F0Y2hlciAod2F0Y2hlcikge1xyXG4gIHZhciBpZCA9IHdhdGNoZXIuaWQ7XHJcbiAgaWYgKGhhcyQxW2lkXSA9PSBudWxsKSB7XHJcbiAgICBoYXMkMVtpZF0gPSB0cnVlO1xyXG4gICAgaWYgKCFmbHVzaGluZykge1xyXG4gICAgICBxdWV1ZS5wdXNoKHdhdGNoZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaWYgYWxyZWFkeSBmbHVzaGluZywgc3BsaWNlIHRoZSB3YXRjaGVyIGJhc2VkIG9uIGl0cyBpZFxyXG4gICAgICAvLyBpZiBhbHJlYWR5IHBhc3QgaXRzIGlkLCBpdCB3aWxsIGJlIHJ1biBuZXh0IGltbWVkaWF0ZWx5LlxyXG4gICAgICB2YXIgaSA9IHF1ZXVlLmxlbmd0aCAtIDE7XHJcbiAgICAgIHdoaWxlIChpID49IDAgJiYgcXVldWVbaV0uaWQgPiB3YXRjaGVyLmlkKSB7XHJcbiAgICAgICAgaS0tO1xyXG4gICAgICB9XHJcbiAgICAgIHF1ZXVlLnNwbGljZShNYXRoLm1heChpLCBpbmRleCkgKyAxLCAwLCB3YXRjaGVyKTtcclxuICAgIH1cclxuICAgIC8vIHF1ZXVlIHRoZSBmbHVzaFxyXG4gICAgaWYgKCF3YWl0aW5nKSB7XHJcbiAgICAgIHdhaXRpbmcgPSB0cnVlO1xyXG4gICAgICBuZXh0VGljayhmbHVzaFNjaGVkdWxlclF1ZXVlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIHVpZCQyID0gMDtcclxuXHJcbi8qKlxyXG4gKiBBIHdhdGNoZXIgcGFyc2VzIGFuIGV4cHJlc3Npb24sIGNvbGxlY3RzIGRlcGVuZGVuY2llcyxcclxuICogYW5kIGZpcmVzIGNhbGxiYWNrIHdoZW4gdGhlIGV4cHJlc3Npb24gdmFsdWUgY2hhbmdlcy5cclxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXHJcbiAqL1xyXG52YXIgV2F0Y2hlciA9IGZ1bmN0aW9uIFdhdGNoZXIgKFxyXG4gIHZtLFxyXG4gIGV4cE9yRm4sXHJcbiAgY2IsXHJcbiAgb3B0aW9uc1xyXG4pIHtcclxuICB0aGlzLnZtID0gdm07XHJcbiAgdm0uX3dhdGNoZXJzLnB1c2godGhpcyk7XHJcbiAgLy8gb3B0aW9uc1xyXG4gIGlmIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcDtcclxuICAgIHRoaXMudXNlciA9ICEhb3B0aW9ucy51c2VyO1xyXG4gICAgdGhpcy5sYXp5ID0gISFvcHRpb25zLmxhenk7XHJcbiAgICB0aGlzLnN5bmMgPSAhIW9wdGlvbnMuc3luYztcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5kZWVwID0gdGhpcy51c2VyID0gdGhpcy5sYXp5ID0gdGhpcy5zeW5jID0gZmFsc2U7XHJcbiAgfVxyXG4gIHRoaXMuY2IgPSBjYjtcclxuICB0aGlzLmlkID0gKyt1aWQkMjsgLy8gdWlkIGZvciBiYXRjaGluZ1xyXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICB0aGlzLmRpcnR5ID0gdGhpcy5sYXp5OyAvLyBmb3IgbGF6eSB3YXRjaGVyc1xyXG4gIHRoaXMuZGVwcyA9IFtdO1xyXG4gIHRoaXMubmV3RGVwcyA9IFtdO1xyXG4gIHRoaXMuZGVwSWRzID0gbmV3IF9TZXQoKTtcclxuICB0aGlzLm5ld0RlcElkcyA9IG5ldyBfU2V0KCk7XHJcbiAgdGhpcy5leHByZXNzaW9uID0gZXhwT3JGbi50b1N0cmluZygpO1xyXG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlclxyXG4gIGlmICh0eXBlb2YgZXhwT3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgdGhpcy5nZXR0ZXIgPSBleHBPckZuO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmdldHRlciA9IHBhcnNlUGF0aChleHBPckZuKTtcclxuICAgIGlmICghdGhpcy5nZXR0ZXIpIHtcclxuICAgICAgdGhpcy5nZXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcclxuICAgICAgICBcIkZhaWxlZCB3YXRjaGluZyBwYXRoOiBcXFwiXCIgKyBleHBPckZuICsgXCJcXFwiIFwiICtcclxuICAgICAgICAnV2F0Y2hlciBvbmx5IGFjY2VwdHMgc2ltcGxlIGRvdC1kZWxpbWl0ZWQgcGF0aHMuICcgK1xyXG4gICAgICAgICdGb3IgZnVsbCBjb250cm9sLCB1c2UgYSBmdW5jdGlvbiBpbnN0ZWFkLicsXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbiAgdGhpcy52YWx1ZSA9IHRoaXMubGF6eVxyXG4gICAgPyB1bmRlZmluZWRcclxuICAgIDogdGhpcy5nZXQoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFdmFsdWF0ZSB0aGUgZ2V0dGVyLCBhbmQgcmUtY29sbGVjdCBkZXBlbmRlbmNpZXMuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKCkge1xyXG4gIHB1c2hUYXJnZXQodGhpcyk7XHJcbiAgdmFyIHZhbHVlID0gdGhpcy5nZXR0ZXIuY2FsbCh0aGlzLnZtLCB0aGlzLnZtKTtcclxuICAvLyBcInRvdWNoXCIgZXZlcnkgcHJvcGVydHkgc28gdGhleSBhcmUgYWxsIHRyYWNrZWQgYXNcclxuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcclxuICBpZiAodGhpcy5kZWVwKSB7XHJcbiAgICB0cmF2ZXJzZSh2YWx1ZSk7XHJcbiAgfVxyXG4gIHBvcFRhcmdldCgpO1xyXG4gIHRoaXMuY2xlYW51cERlcHMoKTtcclxuICByZXR1cm4gdmFsdWVcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgYSBkZXBlbmRlbmN5IHRvIHRoaXMgZGlyZWN0aXZlLlxyXG4gKi9cclxuV2F0Y2hlci5wcm90b3R5cGUuYWRkRGVwID0gZnVuY3Rpb24gYWRkRGVwIChkZXApIHtcclxuICB2YXIgaWQgPSBkZXAuaWQ7XHJcbiAgaWYgKCF0aGlzLm5ld0RlcElkcy5oYXMoaWQpKSB7XHJcbiAgICB0aGlzLm5ld0RlcElkcy5hZGQoaWQpO1xyXG4gICAgdGhpcy5uZXdEZXBzLnB1c2goZGVwKTtcclxuICAgIGlmICghdGhpcy5kZXBJZHMuaGFzKGlkKSkge1xyXG4gICAgICBkZXAuYWRkU3ViKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxyXG4gKi9cclxuV2F0Y2hlci5wcm90b3R5cGUuY2xlYW51cERlcHMgPSBmdW5jdGlvbiBjbGVhbnVwRGVwcyAoKSB7XHJcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcclxuXHJcbiAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xyXG4gIHdoaWxlIChpLS0pIHtcclxuICAgIHZhciBkZXAgPSB0aGlzJDEuZGVwc1tpXTtcclxuICAgIGlmICghdGhpcyQxLm5ld0RlcElkcy5oYXMoZGVwLmlkKSkge1xyXG4gICAgICBkZXAucmVtb3ZlU3ViKHRoaXMkMSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciB0bXAgPSB0aGlzLmRlcElkcztcclxuICB0aGlzLmRlcElkcyA9IHRoaXMubmV3RGVwSWRzO1xyXG4gIHRoaXMubmV3RGVwSWRzID0gdG1wO1xyXG4gIHRoaXMubmV3RGVwSWRzLmNsZWFyKCk7XHJcbiAgdG1wID0gdGhpcy5kZXBzO1xyXG4gIHRoaXMuZGVwcyA9IHRoaXMubmV3RGVwcztcclxuICB0aGlzLm5ld0RlcHMgPSB0bXA7XHJcbiAgdGhpcy5uZXdEZXBzLmxlbmd0aCA9IDA7XHJcbn07XHJcblxyXG4vKipcclxuICogU3Vic2NyaWJlciBpbnRlcmZhY2UuXHJcbiAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBkZXBlbmRlbmN5IGNoYW5nZXMuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKCkge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgaWYgKHRoaXMubGF6eSkge1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgfSBlbHNlIGlmICh0aGlzLnN5bmMpIHtcclxuICAgIHRoaXMucnVuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHF1ZXVlV2F0Y2hlcih0aGlzKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2NoZWR1bGVyIGpvYiBpbnRlcmZhY2UuXHJcbiAqIFdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBzY2hlZHVsZXIuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiBydW4gKCkge1xyXG4gIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoKTtcclxuICAgIGlmIChcclxuICAgICAgdmFsdWUgIT09IHRoaXMudmFsdWUgfHxcclxuICAgICAgLy8gRGVlcCB3YXRjaGVycyBhbmQgd2F0Y2hlcnMgb24gT2JqZWN0L0FycmF5cyBzaG91bGQgZmlyZSBldmVuXHJcbiAgICAgIC8vIHdoZW4gdGhlIHZhbHVlIGlzIHRoZSBzYW1lLCBiZWNhdXNlIHRoZSB2YWx1ZSBtYXlcclxuICAgICAgLy8gaGF2ZSBtdXRhdGVkLlxyXG4gICAgICBpc09iamVjdCh2YWx1ZSkgfHxcclxuICAgICAgdGhpcy5kZWVwXHJcbiAgICApIHtcclxuICAgICAgLy8gc2V0IG5ldyB2YWx1ZVxyXG4gICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICAgIGlmIChjb25maWcuZXJyb3JIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5lcnJvckhhbmRsZXIuY2FsbChudWxsLCBlLCB0aGlzLnZtKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgICAgICAgICAgKFwiRXJyb3IgaW4gd2F0Y2hlciBcXFwiXCIgKyAodGhpcy5leHByZXNzaW9uKSArIFwiXFxcIlwiKSxcclxuICAgICAgICAgICAgICB0aGlzLnZtXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRocm93IGVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRXZhbHVhdGUgdGhlIHZhbHVlIG9mIHRoZSB3YXRjaGVyLlxyXG4gKiBUaGlzIG9ubHkgZ2V0cyBjYWxsZWQgZm9yIGxhenkgd2F0Y2hlcnMuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS5ldmFsdWF0ZSA9IGZ1bmN0aW9uIGV2YWx1YXRlICgpIHtcclxuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKTtcclxuICB0aGlzLmRpcnR5ID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogRGVwZW5kIG9uIGFsbCBkZXBzIGNvbGxlY3RlZCBieSB0aGlzIHdhdGNoZXIuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS5kZXBlbmQgPSBmdW5jdGlvbiBkZXBlbmQgKCkge1xyXG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICB0aGlzJDEuZGVwc1tpXS5kZXBlbmQoKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHNlbGYgZnJvbSBhbGwgZGVwZW5kZW5jaWVzJyBzdWJzY3JpYmVyIGxpc3QuXHJcbiAqL1xyXG5XYXRjaGVyLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uIHRlYXJkb3duICgpIHtcclxuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xyXG5cclxuICBpZiAodGhpcy5hY3RpdmUpIHtcclxuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcclxuICAgIC8vIHRoaXMgaXMgYSBzb21ld2hhdCBleHBlbnNpdmUgb3BlcmF0aW9uIHNvIHdlIHNraXAgaXRcclxuICAgIC8vIGlmIHRoZSB2bSBpcyBiZWluZyBkZXN0cm95ZWQuXHJcbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcclxuICAgICAgcmVtb3ZlJDEodGhpcy52bS5fd2F0Y2hlcnMsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKGktLSkge1xyXG4gICAgICB0aGlzJDEuZGVwc1tpXS5yZW1vdmVTdWIodGhpcyQxKTtcclxuICAgIH1cclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIGFuIG9iamVjdCB0byBldm9rZSBhbGwgY29udmVydGVkXHJcbiAqIGdldHRlcnMsIHNvIHRoYXQgZXZlcnkgbmVzdGVkIHByb3BlcnR5IGluc2lkZSB0aGUgb2JqZWN0XHJcbiAqIGlzIGNvbGxlY3RlZCBhcyBhIFwiZGVlcFwiIGRlcGVuZGVuY3kuXHJcbiAqL1xyXG52YXIgc2Vlbk9iamVjdHMgPSBuZXcgX1NldCgpO1xyXG5mdW5jdGlvbiB0cmF2ZXJzZSAodmFsKSB7XHJcbiAgc2Vlbk9iamVjdHMuY2xlYXIoKTtcclxuICBfdHJhdmVyc2UodmFsLCBzZWVuT2JqZWN0cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF90cmF2ZXJzZSAodmFsLCBzZWVuKSB7XHJcbiAgdmFyIGksIGtleXM7XHJcbiAgdmFyIGlzQSA9IEFycmF5LmlzQXJyYXkodmFsKTtcclxuICBpZiAoKCFpc0EgJiYgIWlzT2JqZWN0KHZhbCkpIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKHZhbCkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBpZiAodmFsLl9fb2JfXykge1xyXG4gICAgdmFyIGRlcElkID0gdmFsLl9fb2JfXy5kZXAuaWQ7XHJcbiAgICBpZiAoc2Vlbi5oYXMoZGVwSWQpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgc2Vlbi5hZGQoZGVwSWQpO1xyXG4gIH1cclxuICBpZiAoaXNBKSB7XHJcbiAgICBpID0gdmFsLmxlbmd0aDtcclxuICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtpXSwgc2Vlbik7IH1cclxuICB9IGVsc2Uge1xyXG4gICAga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XHJcbiAgICBpID0ga2V5cy5sZW5ndGg7XHJcbiAgICB3aGlsZSAoaS0tKSB7IF90cmF2ZXJzZSh2YWxba2V5c1tpXV0sIHNlZW4pOyB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGluaXRTdGF0ZSAodm0pIHtcclxuICB2bS5fd2F0Y2hlcnMgPSBbXTtcclxuICB2YXIgb3B0cyA9IHZtLiRvcHRpb25zO1xyXG4gIGlmIChvcHRzLnByb3BzKSB7IGluaXRQcm9wcyh2bSwgb3B0cy5wcm9wcyk7IH1cclxuICBpZiAob3B0cy5tZXRob2RzKSB7IGluaXRNZXRob2RzKHZtLCBvcHRzLm1ldGhvZHMpOyB9XHJcbiAgaWYgKG9wdHMuZGF0YSkge1xyXG4gICAgaW5pdERhdGEodm0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvYnNlcnZlKHZtLl9kYXRhID0ge30sIHRydWUgLyogYXNSb290RGF0YSAqLyk7XHJcbiAgfVxyXG4gIGlmIChvcHRzLmNvbXB1dGVkKSB7IGluaXRDb21wdXRlZCh2bSwgb3B0cy5jb21wdXRlZCk7IH1cclxuICBpZiAob3B0cy53YXRjaCkgeyBpbml0V2F0Y2godm0sIG9wdHMud2F0Y2gpOyB9XHJcbn1cclxuXHJcbnZhciBpc1Jlc2VydmVkUHJvcCA9IHsga2V5OiAxLCByZWY6IDEsIHNsb3Q6IDEgfTtcclxuXHJcbmZ1bmN0aW9uIGluaXRQcm9wcyAodm0sIHByb3BzKSB7XHJcbiAgdmFyIHByb3BzRGF0YSA9IHZtLiRvcHRpb25zLnByb3BzRGF0YSB8fCB7fTtcclxuICB2YXIga2V5cyA9IHZtLiRvcHRpb25zLl9wcm9wS2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcclxuICB2YXIgaXNSb290ID0gIXZtLiRwYXJlbnQ7XHJcbiAgLy8gcm9vdCBpbnN0YW5jZSBwcm9wcyBzaG91bGQgYmUgY29udmVydGVkXHJcbiAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ID0gaXNSb290O1xyXG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCBpICkge1xyXG4gICAgdmFyIGtleSA9IGtleXNbaV07XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAge1xyXG4gICAgICBpZiAoaXNSZXNlcnZlZFByb3Bba2V5XSkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAoXCJcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaXMgYSByZXNlcnZlZCBhdHRyaWJ1dGUgYW5kIGNhbm5vdCBiZSB1c2VkIGFzIGNvbXBvbmVudCBwcm9wLlwiKSxcclxuICAgICAgICAgIHZtXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICBkZWZpbmVSZWFjdGl2ZSQkMSh2bSwga2V5LCB2YWxpZGF0ZVByb3Aoa2V5LCBwcm9wcywgcHJvcHNEYXRhLCB2bSksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodm0uJHBhcmVudCAmJiAhb2JzZXJ2ZXJTdGF0ZS5pc1NldHRpbmdQcm9wcykge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgXCJBdm9pZCBtdXRhdGluZyBhIHByb3AgZGlyZWN0bHkgc2luY2UgdGhlIHZhbHVlIHdpbGwgYmUgXCIgK1xyXG4gICAgICAgICAgICBcIm92ZXJ3cml0dGVuIHdoZW5ldmVyIHRoZSBwYXJlbnQgY29tcG9uZW50IHJlLXJlbmRlcnMuIFwiICtcclxuICAgICAgICAgICAgXCJJbnN0ZWFkLCB1c2UgYSBkYXRhIG9yIGNvbXB1dGVkIHByb3BlcnR5IGJhc2VkIG9uIHRoZSBwcm9wJ3MgXCIgK1xyXG4gICAgICAgICAgICBcInZhbHVlLiBQcm9wIGJlaW5nIG11dGF0ZWQ6IFxcXCJcIiArIGtleSArIFwiXFxcIlwiLFxyXG4gICAgICAgICAgICB2bVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykgbG9vcCggaSApO1xyXG4gIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXREYXRhICh2bSkge1xyXG4gIHZhciBkYXRhID0gdm0uJG9wdGlvbnMuZGF0YTtcclxuICBkYXRhID0gdm0uX2RhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJ1xyXG4gICAgPyBkYXRhLmNhbGwodm0pXHJcbiAgICA6IGRhdGEgfHwge307XHJcbiAgaWYgKCFpc1BsYWluT2JqZWN0KGRhdGEpKSB7XHJcbiAgICBkYXRhID0ge307XHJcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAnZGF0YSBmdW5jdGlvbnMgc2hvdWxkIHJldHVybiBhbiBvYmplY3Q6XFxuJyArXHJcbiAgICAgICdodHRwczovL3Z1ZWpzLm9yZy92Mi9ndWlkZS9jb21wb25lbnRzLmh0bWwjZGF0YS1NdXN0LUJlLWEtRnVuY3Rpb24nLFxyXG4gICAgICB2bVxyXG4gICAgKTtcclxuICB9XHJcbiAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxyXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XHJcbiAgdmFyIHByb3BzID0gdm0uJG9wdGlvbnMucHJvcHM7XHJcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXlzW2ldKSkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgIFwiVGhlIGRhdGEgcHJvcGVydHkgXFxcIlwiICsgKGtleXNbaV0pICsgXCJcXFwiIGlzIGFscmVhZHkgZGVjbGFyZWQgYXMgYSBwcm9wLiBcIiArXHJcbiAgICAgICAgXCJVc2UgcHJvcCBkZWZhdWx0IHZhbHVlIGluc3RlYWQuXCIsXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHByb3h5KHZtLCBrZXlzW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gb2JzZXJ2ZSBkYXRhXHJcbiAgb2JzZXJ2ZShkYXRhLCB0cnVlIC8qIGFzUm9vdERhdGEgKi8pO1xyXG59XHJcblxyXG52YXIgY29tcHV0ZWRTaGFyZWREZWZpbml0aW9uID0ge1xyXG4gIGVudW1lcmFibGU6IHRydWUsXHJcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gIGdldDogbm9vcCxcclxuICBzZXQ6IG5vb3BcclxufTtcclxuXHJcbmZ1bmN0aW9uIGluaXRDb21wdXRlZCAodm0sIGNvbXB1dGVkKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIGNvbXB1dGVkKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBrZXkgaW4gdm0pIHtcclxuICAgICAgd2FybihcclxuICAgICAgICBcImV4aXN0aW5nIGluc3RhbmNlIHByb3BlcnR5IFxcXCJcIiArIGtleSArIFwiXFxcIiB3aWxsIGJlIFwiICtcclxuICAgICAgICBcIm92ZXJ3cml0dGVuIGJ5IGEgY29tcHV0ZWQgcHJvcGVydHkgd2l0aCB0aGUgc2FtZSBuYW1lLlwiLFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICB2YXIgdXNlckRlZiA9IGNvbXB1dGVkW2tleV07XHJcbiAgICBpZiAodHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgY29tcHV0ZWRTaGFyZWREZWZpbml0aW9uLmdldCA9IG1ha2VDb21wdXRlZEdldHRlcih1c2VyRGVmLCB2bSk7XHJcbiAgICAgIGNvbXB1dGVkU2hhcmVkRGVmaW5pdGlvbi5zZXQgPSBub29wO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29tcHV0ZWRTaGFyZWREZWZpbml0aW9uLmdldCA9IHVzZXJEZWYuZ2V0XHJcbiAgICAgICAgPyB1c2VyRGVmLmNhY2hlICE9PSBmYWxzZVxyXG4gICAgICAgICAgPyBtYWtlQ29tcHV0ZWRHZXR0ZXIodXNlckRlZi5nZXQsIHZtKVxyXG4gICAgICAgICAgOiBiaW5kJDEodXNlckRlZi5nZXQsIHZtKVxyXG4gICAgICAgIDogbm9vcDtcclxuICAgICAgY29tcHV0ZWRTaGFyZWREZWZpbml0aW9uLnNldCA9IHVzZXJEZWYuc2V0XHJcbiAgICAgICAgPyBiaW5kJDEodXNlckRlZi5zZXQsIHZtKVxyXG4gICAgICAgIDogbm9vcDtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2bSwga2V5LCBjb21wdXRlZFNoYXJlZERlZmluaXRpb24pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFrZUNvbXB1dGVkR2V0dGVyIChnZXR0ZXIsIG93bmVyKSB7XHJcbiAgdmFyIHdhdGNoZXIgPSBuZXcgV2F0Y2hlcihvd25lciwgZ2V0dGVyLCBub29wLCB7XHJcbiAgICBsYXp5OiB0cnVlXHJcbiAgfSk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXB1dGVkR2V0dGVyICgpIHtcclxuICAgIGlmICh3YXRjaGVyLmRpcnR5KSB7XHJcbiAgICAgIHdhdGNoZXIuZXZhbHVhdGUoKTtcclxuICAgIH1cclxuICAgIGlmIChEZXAudGFyZ2V0KSB7XHJcbiAgICAgIHdhdGNoZXIuZGVwZW5kKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd2F0Y2hlci52YWx1ZVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdE1ldGhvZHMgKHZtLCBtZXRob2RzKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcclxuICAgIHZtW2tleV0gPSBtZXRob2RzW2tleV0gPT0gbnVsbCA/IG5vb3AgOiBiaW5kJDEobWV0aG9kc1trZXldLCB2bSk7XHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgbWV0aG9kc1trZXldID09IG51bGwpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICBcIm1ldGhvZCBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaGFzIGFuIHVuZGVmaW5lZCB2YWx1ZSBpbiB0aGUgY29tcG9uZW50IGRlZmluaXRpb24uIFwiICtcclxuICAgICAgICBcIkRpZCB5b3UgcmVmZXJlbmNlIHRoZSBmdW5jdGlvbiBjb3JyZWN0bHk/XCIsXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRXYXRjaCAodm0sIHdhdGNoKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIHdhdGNoKSB7XHJcbiAgICB2YXIgaGFuZGxlciA9IHdhdGNoW2tleV07XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShoYW5kbGVyKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXJbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlV2F0Y2hlciAodm0sIGtleSwgaGFuZGxlcikge1xyXG4gIHZhciBvcHRpb25zO1xyXG4gIGlmIChpc1BsYWluT2JqZWN0KGhhbmRsZXIpKSB7XHJcbiAgICBvcHRpb25zID0gaGFuZGxlcjtcclxuICAgIGhhbmRsZXIgPSBoYW5kbGVyLmhhbmRsZXI7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpIHtcclxuICAgIGhhbmRsZXIgPSB2bVtoYW5kbGVyXTtcclxuICB9XHJcbiAgdm0uJHdhdGNoKGtleSwgaGFuZGxlciwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlTWl4aW4gKFZ1ZSkge1xyXG4gIC8vIGZsb3cgc29tZWhvdyBoYXMgcHJvYmxlbXMgd2l0aCBkaXJlY3RseSBkZWNsYXJlZCBkZWZpbml0aW9uIG9iamVjdFxyXG4gIC8vIHdoZW4gdXNpbmcgT2JqZWN0LmRlZmluZVByb3BlcnR5LCBzbyB3ZSBoYXZlIHRvIHByb2NlZHVyYWxseSBidWlsZCB1cFxyXG4gIC8vIHRoZSBvYmplY3QgaGVyZS5cclxuICB2YXIgZGF0YURlZiA9IHt9O1xyXG4gIGRhdGFEZWYuZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcclxuICB9O1xyXG4gIHtcclxuICAgIGRhdGFEZWYuc2V0ID0gZnVuY3Rpb24gKG5ld0RhdGEpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnQXZvaWQgcmVwbGFjaW5nIGluc3RhbmNlIHJvb3QgJGRhdGEuICcgK1xyXG4gICAgICAgICdVc2UgbmVzdGVkIGRhdGEgcHJvcGVydGllcyBpbnN0ZWFkLicsXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICApO1xyXG4gICAgfTtcclxuICB9XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFZ1ZS5wcm90b3R5cGUsICckZGF0YScsIGRhdGFEZWYpO1xyXG5cclxuICBWdWUucHJvdG90eXBlLiRzZXQgPSBzZXQkMTtcclxuICBWdWUucHJvdG90eXBlLiRkZWxldGUgPSBkZWw7XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuJHdhdGNoID0gZnVuY3Rpb24gKFxyXG4gICAgZXhwT3JGbixcclxuICAgIGNiLFxyXG4gICAgb3B0aW9uc1xyXG4gICkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgb3B0aW9ucy51c2VyID0gdHJ1ZTtcclxuICAgIHZhciB3YXRjaGVyID0gbmV3IFdhdGNoZXIodm0sIGV4cE9yRm4sIGNiLCBvcHRpb25zKTtcclxuICAgIGlmIChvcHRpb25zLmltbWVkaWF0ZSkge1xyXG4gICAgICBjYi5jYWxsKHZtLCB3YXRjaGVyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xyXG4gICAgICB3YXRjaGVyLnRlYXJkb3duKCk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJveHkgKHZtLCBrZXkpIHtcclxuICBpZiAoIWlzUmVzZXJ2ZWQoa2V5KSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZtLCBrZXksIHtcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIHByb3h5R2V0dGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdm0uX2RhdGFba2V5XVxyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcclxuICAgICAgICB2bS5fZGF0YVtrZXldID0gdmFsO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIHVpZCA9IDA7XHJcblxyXG5mdW5jdGlvbiBpbml0TWl4aW4gKFZ1ZSkge1xyXG4gIFZ1ZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIC8vIGEgdWlkXHJcbiAgICB2bS5fdWlkID0gdWlkKys7XHJcbiAgICAvLyBhIGZsYWcgdG8gYXZvaWQgdGhpcyBiZWluZyBvYnNlcnZlZFxyXG4gICAgdm0uX2lzVnVlID0gdHJ1ZTtcclxuICAgIC8vIG1lcmdlIG9wdGlvbnNcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuX2lzQ29tcG9uZW50KSB7XHJcbiAgICAgIC8vIG9wdGltaXplIGludGVybmFsIGNvbXBvbmVudCBpbnN0YW50aWF0aW9uXHJcbiAgICAgIC8vIHNpbmNlIGR5bmFtaWMgb3B0aW9ucyBtZXJnaW5nIGlzIHByZXR0eSBzbG93LCBhbmQgbm9uZSBvZiB0aGVcclxuICAgICAgLy8gaW50ZXJuYWwgY29tcG9uZW50IG9wdGlvbnMgbmVlZHMgc3BlY2lhbCB0cmVhdG1lbnQuXHJcbiAgICAgIGluaXRJbnRlcm5hbENvbXBvbmVudCh2bSwgb3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2bS4kb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcclxuICAgICAgICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKHZtLmNvbnN0cnVjdG9yKSxcclxuICAgICAgICBvcHRpb25zIHx8IHt9LFxyXG4gICAgICAgIHZtXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAge1xyXG4gICAgICBpbml0UHJveHkodm0pO1xyXG4gICAgfVxyXG4gICAgLy8gZXhwb3NlIHJlYWwgc2VsZlxyXG4gICAgdm0uX3NlbGYgPSB2bTtcclxuICAgIGluaXRMaWZlY3ljbGUodm0pO1xyXG4gICAgaW5pdEV2ZW50cyh2bSk7XHJcbiAgICBpbml0UmVuZGVyKHZtKTtcclxuICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlQ3JlYXRlJyk7XHJcbiAgICBpbml0U3RhdGUodm0pO1xyXG4gICAgY2FsbEhvb2sodm0sICdjcmVhdGVkJyk7XHJcbiAgICBpZiAodm0uJG9wdGlvbnMuZWwpIHtcclxuICAgICAgdm0uJG1vdW50KHZtLiRvcHRpb25zLmVsKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0SW50ZXJuYWxDb21wb25lbnQgKHZtLCBvcHRpb25zKSB7XHJcbiAgdmFyIG9wdHMgPSB2bS4kb3B0aW9ucyA9IE9iamVjdC5jcmVhdGUodm0uY29uc3RydWN0b3Iub3B0aW9ucyk7XHJcbiAgLy8gZG9pbmcgdGhpcyBiZWNhdXNlIGl0J3MgZmFzdGVyIHRoYW4gZHluYW1pYyBlbnVtZXJhdGlvbi5cclxuICBvcHRzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xyXG4gIG9wdHMucHJvcHNEYXRhID0gb3B0aW9ucy5wcm9wc0RhdGE7XHJcbiAgb3B0cy5fcGFyZW50Vm5vZGUgPSBvcHRpb25zLl9wYXJlbnRWbm9kZTtcclxuICBvcHRzLl9wYXJlbnRMaXN0ZW5lcnMgPSBvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XHJcbiAgb3B0cy5fcmVuZGVyQ2hpbGRyZW4gPSBvcHRpb25zLl9yZW5kZXJDaGlsZHJlbjtcclxuICBvcHRzLl9jb21wb25lbnRUYWcgPSBvcHRpb25zLl9jb21wb25lbnRUYWc7XHJcbiAgb3B0cy5fcGFyZW50RWxtID0gb3B0aW9ucy5fcGFyZW50RWxtO1xyXG4gIG9wdHMuX3JlZkVsbSA9IG9wdGlvbnMuX3JlZkVsbTtcclxuICBpZiAob3B0aW9ucy5yZW5kZXIpIHtcclxuICAgIG9wdHMucmVuZGVyID0gb3B0aW9ucy5yZW5kZXI7XHJcbiAgICBvcHRzLnN0YXRpY1JlbmRlckZucyA9IG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyAoQ3Rvcikge1xyXG4gIHZhciBvcHRpb25zID0gQ3Rvci5vcHRpb25zO1xyXG4gIGlmIChDdG9yLnN1cGVyKSB7XHJcbiAgICB2YXIgc3VwZXJPcHRpb25zID0gQ3Rvci5zdXBlci5vcHRpb25zO1xyXG4gICAgdmFyIGNhY2hlZFN1cGVyT3B0aW9ucyA9IEN0b3Iuc3VwZXJPcHRpb25zO1xyXG4gICAgdmFyIGV4dGVuZE9wdGlvbnMgPSBDdG9yLmV4dGVuZE9wdGlvbnM7XHJcbiAgICBpZiAoc3VwZXJPcHRpb25zICE9PSBjYWNoZWRTdXBlck9wdGlvbnMpIHtcclxuICAgICAgLy8gc3VwZXIgb3B0aW9uIGNoYW5nZWRcclxuICAgICAgQ3Rvci5zdXBlck9wdGlvbnMgPSBzdXBlck9wdGlvbnM7XHJcbiAgICAgIGV4dGVuZE9wdGlvbnMucmVuZGVyID0gb3B0aW9ucy5yZW5kZXI7XHJcbiAgICAgIGV4dGVuZE9wdGlvbnMuc3RhdGljUmVuZGVyRm5zID0gb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnM7XHJcbiAgICAgIGV4dGVuZE9wdGlvbnMuX3Njb3BlSWQgPSBvcHRpb25zLl9zY29wZUlkO1xyXG4gICAgICBvcHRpb25zID0gQ3Rvci5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHN1cGVyT3B0aW9ucywgZXh0ZW5kT3B0aW9ucyk7XHJcbiAgICAgIGlmIChvcHRpb25zLm5hbWUpIHtcclxuICAgICAgICBvcHRpb25zLmNvbXBvbmVudHNbb3B0aW9ucy5uYW1lXSA9IEN0b3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9wdGlvbnNcclxufVxyXG5cclxuZnVuY3Rpb24gVnVlJDMgKG9wdGlvbnMpIHtcclxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICEodGhpcyBpbnN0YW5jZW9mIFZ1ZSQzKSkge1xyXG4gICAgd2FybignVnVlIGlzIGEgY29uc3RydWN0b3IgYW5kIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgYG5ld2Aga2V5d29yZCcpO1xyXG4gIH1cclxuICB0aGlzLl9pbml0KG9wdGlvbnMpO1xyXG59XHJcblxyXG5pbml0TWl4aW4oVnVlJDMpO1xyXG5zdGF0ZU1peGluKFZ1ZSQzKTtcclxuZXZlbnRzTWl4aW4oVnVlJDMpO1xyXG5saWZlY3ljbGVNaXhpbihWdWUkMyk7XHJcbnJlbmRlck1peGluKFZ1ZSQzKTtcclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gaW5pdFVzZSAoVnVlKSB7XHJcbiAgVnVlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKHBsdWdpbi5pbnN0YWxsZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcclxuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xyXG4gICAgYXJncy51bnNoaWZ0KHRoaXMpO1xyXG4gICAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGx1Z2luLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgcGx1Z2luLmluc3RhbGxlZCA9IHRydWU7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH07XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gaW5pdE1peGluJDEgKFZ1ZSkge1xyXG4gIFZ1ZS5taXhpbiA9IGZ1bmN0aW9uIChtaXhpbikge1xyXG4gICAgdGhpcy5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHRoaXMub3B0aW9ucywgbWl4aW4pO1xyXG4gIH07XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gaW5pdEV4dGVuZCAoVnVlKSB7XHJcbiAgLyoqXHJcbiAgICogRWFjaCBpbnN0YW5jZSBjb25zdHJ1Y3RvciwgaW5jbHVkaW5nIFZ1ZSwgaGFzIGEgdW5pcXVlXHJcbiAgICogY2lkLiBUaGlzIGVuYWJsZXMgdXMgdG8gY3JlYXRlIHdyYXBwZWQgXCJjaGlsZFxyXG4gICAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxyXG4gICAqL1xyXG4gIFZ1ZS5jaWQgPSAwO1xyXG4gIHZhciBjaWQgPSAxO1xyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyBpbmhlcml0YW5jZVxyXG4gICAqL1xyXG4gIFZ1ZS5leHRlbmQgPSBmdW5jdGlvbiAoZXh0ZW5kT3B0aW9ucykge1xyXG4gICAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge307XHJcbiAgICB2YXIgU3VwZXIgPSB0aGlzO1xyXG4gICAgdmFyIFN1cGVySWQgPSBTdXBlci5jaWQ7XHJcbiAgICB2YXIgY2FjaGVkQ3RvcnMgPSBleHRlbmRPcHRpb25zLl9DdG9yIHx8IChleHRlbmRPcHRpb25zLl9DdG9yID0ge30pO1xyXG4gICAgaWYgKGNhY2hlZEN0b3JzW1N1cGVySWRdKSB7XHJcbiAgICAgIHJldHVybiBjYWNoZWRDdG9yc1tTdXBlcklkXVxyXG4gICAgfVxyXG4gICAgdmFyIG5hbWUgPSBleHRlbmRPcHRpb25zLm5hbWUgfHwgU3VwZXIub3B0aW9ucy5uYW1lO1xyXG4gICAge1xyXG4gICAgICBpZiAoIS9eW2EtekEtWl1bXFx3LV0qJC8udGVzdChuYW1lKSkge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAnSW52YWxpZCBjb21wb25lbnQgbmFtZTogXCInICsgbmFtZSArICdcIi4gQ29tcG9uZW50IG5hbWVzICcgK1xyXG4gICAgICAgICAgJ2NhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgYW5kIHRoZSBoeXBoZW4sICcgK1xyXG4gICAgICAgICAgJ2FuZCBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIuJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBTdWIgPSBmdW5jdGlvbiBWdWVDb21wb25lbnQgKG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5faW5pdChvcHRpb25zKTtcclxuICAgIH07XHJcbiAgICBTdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xyXG4gICAgU3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YjtcclxuICAgIFN1Yi5jaWQgPSBjaWQrKztcclxuICAgIFN1Yi5vcHRpb25zID0gbWVyZ2VPcHRpb25zKFxyXG4gICAgICBTdXBlci5vcHRpb25zLFxyXG4gICAgICBleHRlbmRPcHRpb25zXHJcbiAgICApO1xyXG4gICAgU3ViWydzdXBlciddID0gU3VwZXI7XHJcbiAgICAvLyBhbGxvdyBmdXJ0aGVyIGV4dGVuc2lvbi9taXhpbi9wbHVnaW4gdXNhZ2VcclxuICAgIFN1Yi5leHRlbmQgPSBTdXBlci5leHRlbmQ7XHJcbiAgICBTdWIubWl4aW4gPSBTdXBlci5taXhpbjtcclxuICAgIFN1Yi51c2UgPSBTdXBlci51c2U7XHJcbiAgICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXHJcbiAgICAvLyBjYW4gaGF2ZSB0aGVpciBwcml2YXRlIGFzc2V0cyB0b28uXHJcbiAgICBjb25maWcuX2Fzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICBTdWJbdHlwZV0gPSBTdXBlclt0eXBlXTtcclxuICAgIH0pO1xyXG4gICAgLy8gZW5hYmxlIHJlY3Vyc2l2ZSBzZWxmLWxvb2t1cFxyXG4gICAgaWYgKG5hbWUpIHtcclxuICAgICAgU3ViLm9wdGlvbnMuY29tcG9uZW50c1tuYW1lXSA9IFN1YjtcclxuICAgIH1cclxuICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHN1cGVyIG9wdGlvbnMgYXQgZXh0ZW5zaW9uIHRpbWUuXHJcbiAgICAvLyBsYXRlciBhdCBpbnN0YW50aWF0aW9uIHdlIGNhbiBjaGVjayBpZiBTdXBlcidzIG9wdGlvbnMgaGF2ZVxyXG4gICAgLy8gYmVlbiB1cGRhdGVkLlxyXG4gICAgU3ViLnN1cGVyT3B0aW9ucyA9IFN1cGVyLm9wdGlvbnM7XHJcbiAgICBTdWIuZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnM7XHJcbiAgICAvLyBjYWNoZSBjb25zdHJ1Y3RvclxyXG4gICAgY2FjaGVkQ3RvcnNbU3VwZXJJZF0gPSBTdWI7XHJcbiAgICByZXR1cm4gU3ViXHJcbiAgfTtcclxufVxyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiBpbml0QXNzZXRSZWdpc3RlcnMgKFZ1ZSkge1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcy5cclxuICAgKi9cclxuICBjb25maWcuX2Fzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgVnVlW3R5cGVdID0gZnVuY3Rpb24gKFxyXG4gICAgICBpZCxcclxuICAgICAgZGVmaW5pdGlvblxyXG4gICAgKSB7XHJcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnICYmIGNvbmZpZy5pc1Jlc2VydmVkVGFnKGlkKSkge1xyXG4gICAgICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgICAgICdEbyBub3QgdXNlIGJ1aWx0LWluIG9yIHJlc2VydmVkIEhUTUwgZWxlbWVudHMgYXMgY29tcG9uZW50ICcgK1xyXG4gICAgICAgICAgICAgICdpZDogJyArIGlkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09PSAnY29tcG9uZW50JyAmJiBpc1BsYWluT2JqZWN0KGRlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBkZWZpbml0aW9uLm5hbWUgfHwgaWQ7XHJcbiAgICAgICAgICBkZWZpbml0aW9uID0gdGhpcy5vcHRpb25zLl9iYXNlLmV4dGVuZChkZWZpbml0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdkaXJlY3RpdmUnICYmIHR5cGVvZiBkZWZpbml0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICBkZWZpbml0aW9uID0geyBiaW5kOiBkZWZpbml0aW9uLCB1cGRhdGU6IGRlZmluaXRpb24gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb247XHJcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTtcclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgcGF0dGVyblR5cGVzID0gW1N0cmluZywgUmVnRXhwXTtcclxuXHJcbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUgKG9wdHMpIHtcclxuICByZXR1cm4gb3B0cyAmJiAob3B0cy5DdG9yLm9wdGlvbnMubmFtZSB8fCBvcHRzLnRhZylcclxufVxyXG5cclxuZnVuY3Rpb24gbWF0Y2hlcyAocGF0dGVybiwgbmFtZSkge1xyXG4gIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBwYXR0ZXJuLnNwbGl0KCcsJykuaW5kZXhPZihuYW1lKSA+IC0xXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBwYXR0ZXJuLnRlc3QobmFtZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBydW5lQ2FjaGUgKGNhY2hlLCBmaWx0ZXIpIHtcclxuICBmb3IgKHZhciBrZXkgaW4gY2FjaGUpIHtcclxuICAgIHZhciBjYWNoZWROb2RlID0gY2FjaGVba2V5XTtcclxuICAgIGlmIChjYWNoZWROb2RlKSB7XHJcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjYWNoZWROb2RlLmNvbXBvbmVudE9wdGlvbnMpO1xyXG4gICAgICBpZiAobmFtZSAmJiAhZmlsdGVyKG5hbWUpKSB7XHJcbiAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KGNhY2hlZE5vZGUpO1xyXG4gICAgICAgIGNhY2hlW2tleV0gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcnVuZUNhY2hlRW50cnkgKHZub2RlKSB7XHJcbiAgaWYgKHZub2RlKSB7XHJcbiAgICBpZiAoIXZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pbmFjdGl2ZSkge1xyXG4gICAgICBjYWxsSG9vayh2bm9kZS5jb21wb25lbnRJbnN0YW5jZSwgJ2RlYWN0aXZhdGVkJyk7XHJcbiAgICB9XHJcbiAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZS4kZGVzdHJveSgpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIEtlZXBBbGl2ZSA9IHtcclxuICBuYW1lOiAna2VlcC1hbGl2ZScsXHJcbiAgYWJzdHJhY3Q6IHRydWUsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBpbmNsdWRlOiBwYXR0ZXJuVHlwZXMsXHJcbiAgICBleGNsdWRlOiBwYXR0ZXJuVHlwZXNcclxuICB9LFxyXG5cclxuICBjcmVhdGVkOiBmdW5jdGlvbiBjcmVhdGVkICgpIHtcclxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIH0sXHJcblxyXG4gIGRlc3Ryb3llZDogZnVuY3Rpb24gZGVzdHJveWVkICgpIHtcclxuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNhY2hlKSB7XHJcbiAgICAgIHBydW5lQ2FjaGVFbnRyeSh0aGlzJDEuY2FjaGVba2V5XSk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGluY2x1ZGU6IGZ1bmN0aW9uIGluY2x1ZGUgKHZhbCkge1xyXG4gICAgICBwcnVuZUNhY2hlKHRoaXMuY2FjaGUsIGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBtYXRjaGVzKHZhbCwgbmFtZSk7IH0pO1xyXG4gICAgfSxcclxuICAgIGV4Y2x1ZGU6IGZ1bmN0aW9uIGV4Y2x1ZGUgKHZhbCkge1xyXG4gICAgICBwcnVuZUNhY2hlKHRoaXMuY2FjaGUsIGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiAhbWF0Y2hlcyh2YWwsIG5hbWUpOyB9KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlciAoKSB7XHJcbiAgICB2YXIgdm5vZGUgPSBnZXRGaXJzdENvbXBvbmVudENoaWxkKHRoaXMuJHNsb3RzLmRlZmF1bHQpO1xyXG4gICAgdmFyIGNvbXBvbmVudE9wdGlvbnMgPSB2bm9kZSAmJiB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xyXG4gICAgaWYgKGNvbXBvbmVudE9wdGlvbnMpIHtcclxuICAgICAgLy8gY2hlY2sgcGF0dGVyblxyXG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY29tcG9uZW50T3B0aW9ucyk7XHJcbiAgICAgIGlmIChuYW1lICYmIChcclxuICAgICAgICAodGhpcy5pbmNsdWRlICYmICFtYXRjaGVzKHRoaXMuaW5jbHVkZSwgbmFtZSkpIHx8XHJcbiAgICAgICAgKHRoaXMuZXhjbHVkZSAmJiBtYXRjaGVzKHRoaXMuZXhjbHVkZSwgbmFtZSkpXHJcbiAgICAgICkpIHtcclxuICAgICAgICByZXR1cm4gdm5vZGVcclxuICAgICAgfVxyXG4gICAgICB2YXIga2V5ID0gdm5vZGUua2V5ID09IG51bGxcclxuICAgICAgICAvLyBzYW1lIGNvbnN0cnVjdG9yIG1heSBnZXQgcmVnaXN0ZXJlZCBhcyBkaWZmZXJlbnQgbG9jYWwgY29tcG9uZW50c1xyXG4gICAgICAgIC8vIHNvIGNpZCBhbG9uZSBpcyBub3QgZW5vdWdoICgjMzI2OSlcclxuICAgICAgICA/IGNvbXBvbmVudE9wdGlvbnMuQ3Rvci5jaWQgKyAoY29tcG9uZW50T3B0aW9ucy50YWcgPyAoXCI6OlwiICsgKGNvbXBvbmVudE9wdGlvbnMudGFnKSkgOiAnJylcclxuICAgICAgICA6IHZub2RlLmtleTtcclxuICAgICAgaWYgKHRoaXMuY2FjaGVba2V5XSkge1xyXG4gICAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gdGhpcy5jYWNoZVtrZXldLmNvbXBvbmVudEluc3RhbmNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY2FjaGVba2V5XSA9IHZub2RlO1xyXG4gICAgICB9XHJcbiAgICAgIHZub2RlLmRhdGEua2VlcEFsaXZlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiB2bm9kZVxyXG4gIH1cclxufTtcclxuXHJcbnZhciBidWlsdEluQ29tcG9uZW50cyA9IHtcclxuICBLZWVwQWxpdmU6IEtlZXBBbGl2ZVxyXG59O1xyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiBpbml0R2xvYmFsQVBJIChWdWUpIHtcclxuICAvLyBjb25maWdcclxuICB2YXIgY29uZmlnRGVmID0ge307XHJcbiAgY29uZmlnRGVmLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbmZpZzsgfTtcclxuICB7XHJcbiAgICBjb25maWdEZWYuc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB3YXJuKFxyXG4gICAgICAgICdEbyBub3QgcmVwbGFjZSB0aGUgVnVlLmNvbmZpZyBvYmplY3QsIHNldCBpbmRpdmlkdWFsIGZpZWxkcyBpbnN0ZWFkLidcclxuICAgICAgKTtcclxuICAgIH07XHJcbiAgfVxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUsICdjb25maWcnLCBjb25maWdEZWYpO1xyXG4gIFZ1ZS51dGlsID0gdXRpbDtcclxuICBWdWUuc2V0ID0gc2V0JDE7XHJcbiAgVnVlLmRlbGV0ZSA9IGRlbDtcclxuICBWdWUubmV4dFRpY2sgPSBuZXh0VGljaztcclxuXHJcbiAgVnVlLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIGNvbmZpZy5fYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICBWdWUub3B0aW9uc1t0eXBlICsgJ3MnXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHRoaXMgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgXCJiYXNlXCIgY29uc3RydWN0b3IgdG8gZXh0ZW5kIGFsbCBwbGFpbi1vYmplY3RcclxuICAvLyBjb21wb25lbnRzIHdpdGggaW4gV2VleCdzIG11bHRpLWluc3RhbmNlIHNjZW5hcmlvcy5cclxuICBWdWUub3B0aW9ucy5fYmFzZSA9IFZ1ZTtcclxuXHJcbiAgZXh0ZW5kKFZ1ZS5vcHRpb25zLmNvbXBvbmVudHMsIGJ1aWx0SW5Db21wb25lbnRzKTtcclxuXHJcbiAgaW5pdFVzZShWdWUpO1xyXG4gIGluaXRNaXhpbiQxKFZ1ZSk7XHJcbiAgaW5pdEV4dGVuZChWdWUpO1xyXG4gIGluaXRBc3NldFJlZ2lzdGVycyhWdWUpO1xyXG59XHJcblxyXG5pbml0R2xvYmFsQVBJKFZ1ZSQzKTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUkMy5wcm90b3R5cGUsICckaXNTZXJ2ZXInLCB7XHJcbiAgZ2V0OiBpc1NlcnZlclJlbmRlcmluZ1xyXG59KTtcclxuXHJcblZ1ZSQzLnZlcnNpb24gPSAnMi4xLjEwJztcclxuXHJcbi8qICAqL1xyXG5cclxuLy8gYXR0cmlidXRlcyB0aGF0IHNob3VsZCBiZSB1c2luZyBwcm9wcyBmb3IgYmluZGluZ1xyXG52YXIgYWNjZXB0VmFsdWUgPSBtYWtlTWFwKCdpbnB1dCx0ZXh0YXJlYSxvcHRpb24sc2VsZWN0Jyk7XHJcbnZhciBtdXN0VXNlUHJvcCA9IGZ1bmN0aW9uICh0YWcsIHR5cGUsIGF0dHIpIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGF0dHIgPT09ICd2YWx1ZScgJiYgYWNjZXB0VmFsdWUodGFnKSkgJiYgdHlwZSAhPT0gJ2J1dHRvbicgfHxcclxuICAgIChhdHRyID09PSAnc2VsZWN0ZWQnICYmIHRhZyA9PT0gJ29wdGlvbicpIHx8XHJcbiAgICAoYXR0ciA9PT0gJ2NoZWNrZWQnICYmIHRhZyA9PT0gJ2lucHV0JykgfHxcclxuICAgIChhdHRyID09PSAnbXV0ZWQnICYmIHRhZyA9PT0gJ3ZpZGVvJylcclxuICApXHJcbn07XHJcblxyXG52YXIgaXNFbnVtZXJhdGVkQXR0ciA9IG1ha2VNYXAoJ2NvbnRlbnRlZGl0YWJsZSxkcmFnZ2FibGUsc3BlbGxjaGVjaycpO1xyXG5cclxudmFyIGlzQm9vbGVhbkF0dHIgPSBtYWtlTWFwKFxyXG4gICdhbGxvd2Z1bGxzY3JlZW4sYXN5bmMsYXV0b2ZvY3VzLGF1dG9wbGF5LGNoZWNrZWQsY29tcGFjdCxjb250cm9scyxkZWNsYXJlLCcgK1xyXG4gICdkZWZhdWx0LGRlZmF1bHRjaGVja2VkLGRlZmF1bHRtdXRlZCxkZWZhdWx0c2VsZWN0ZWQsZGVmZXIsZGlzYWJsZWQsJyArXHJcbiAgJ2VuYWJsZWQsZm9ybW5vdmFsaWRhdGUsaGlkZGVuLGluZGV0ZXJtaW5hdGUsaW5lcnQsaXNtYXAsaXRlbXNjb3BlLGxvb3AsbXVsdGlwbGUsJyArXHJcbiAgJ211dGVkLG5vaHJlZixub3Jlc2l6ZSxub3NoYWRlLG5vdmFsaWRhdGUsbm93cmFwLG9wZW4scGF1c2VvbmV4aXQscmVhZG9ubHksJyArXHJcbiAgJ3JlcXVpcmVkLHJldmVyc2VkLHNjb3BlZCxzZWFtbGVzcyxzZWxlY3RlZCxzb3J0YWJsZSx0cmFuc2xhdGUsJyArXHJcbiAgJ3RydWVzcGVlZCx0eXBlbXVzdG1hdGNoLHZpc2libGUnXHJcbik7XHJcblxyXG52YXIgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcclxuXHJcbnZhciBpc1hsaW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICByZXR1cm4gbmFtZS5jaGFyQXQoNSkgPT09ICc6JyAmJiBuYW1lLnNsaWNlKDAsIDUpID09PSAneGxpbmsnXHJcbn07XHJcblxyXG52YXIgZ2V0WGxpbmtQcm9wID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICByZXR1cm4gaXNYbGluayhuYW1lKSA/IG5hbWUuc2xpY2UoNiwgbmFtZS5sZW5ndGgpIDogJydcclxufTtcclxuXHJcbnZhciBpc0ZhbHN5QXR0clZhbHVlID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gIHJldHVybiB2YWwgPT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlXHJcbn07XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGdlbkNsYXNzRm9yVm5vZGUgKHZub2RlKSB7XHJcbiAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gIHZhciBwYXJlbnROb2RlID0gdm5vZGU7XHJcbiAgdmFyIGNoaWxkTm9kZSA9IHZub2RlO1xyXG4gIHdoaWxlIChjaGlsZE5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcclxuICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XHJcbiAgICBpZiAoY2hpbGROb2RlLmRhdGEpIHtcclxuICAgICAgZGF0YSA9IG1lcmdlQ2xhc3NEYXRhKGNoaWxkTm9kZS5kYXRhLCBkYXRhKTtcclxuICAgIH1cclxuICB9XHJcbiAgd2hpbGUgKChwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnQpKSB7XHJcbiAgICBpZiAocGFyZW50Tm9kZS5kYXRhKSB7XHJcbiAgICAgIGRhdGEgPSBtZXJnZUNsYXNzRGF0YShkYXRhLCBwYXJlbnROb2RlLmRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZ2VuQ2xhc3NGcm9tRGF0YShkYXRhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZUNsYXNzRGF0YSAoY2hpbGQsIHBhcmVudCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0aWNDbGFzczogY29uY2F0KGNoaWxkLnN0YXRpY0NsYXNzLCBwYXJlbnQuc3RhdGljQ2xhc3MpLFxyXG4gICAgY2xhc3M6IGNoaWxkLmNsYXNzXHJcbiAgICAgID8gW2NoaWxkLmNsYXNzLCBwYXJlbnQuY2xhc3NdXHJcbiAgICAgIDogcGFyZW50LmNsYXNzXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5DbGFzc0Zyb21EYXRhIChkYXRhKSB7XHJcbiAgdmFyIGR5bmFtaWNDbGFzcyA9IGRhdGEuY2xhc3M7XHJcbiAgdmFyIHN0YXRpY0NsYXNzID0gZGF0YS5zdGF0aWNDbGFzcztcclxuICBpZiAoc3RhdGljQ2xhc3MgfHwgZHluYW1pY0NsYXNzKSB7XHJcbiAgICByZXR1cm4gY29uY2F0KHN0YXRpY0NsYXNzLCBzdHJpbmdpZnlDbGFzcyhkeW5hbWljQ2xhc3MpKVxyXG4gIH1cclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gIHJldHVybiAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb25jYXQgKGEsIGIpIHtcclxuICByZXR1cm4gYSA/IGIgPyAoYSArICcgJyArIGIpIDogYSA6IChiIHx8ICcnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlDbGFzcyAodmFsdWUpIHtcclxuICB2YXIgcmVzID0gJyc7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfVxyXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgdmFyIHN0cmluZ2lmaWVkO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgaWYgKHZhbHVlW2ldKSB7XHJcbiAgICAgICAgaWYgKChzdHJpbmdpZmllZCA9IHN0cmluZ2lmeUNsYXNzKHZhbHVlW2ldKSkpIHtcclxuICAgICAgICAgIHJlcyArPSBzdHJpbmdpZmllZCArICcgJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXMuc2xpY2UoMCwgLTEpXHJcbiAgfVxyXG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWVba2V5XSkgeyByZXMgKz0ga2V5ICsgJyAnOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKVxyXG4gIH1cclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gIHJldHVybiByZXNcclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgbmFtZXNwYWNlTWFwID0ge1xyXG4gIHN2ZzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcclxuICBtYXRoOiAnaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTCdcclxufTtcclxuXHJcbnZhciBpc0hUTUxUYWcgPSBtYWtlTWFwKFxyXG4gICdodG1sLGJvZHksYmFzZSxoZWFkLGxpbmssbWV0YSxzdHlsZSx0aXRsZSwnICtcclxuICAnYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGZvb3RlcixoZWFkZXIsaDEsaDIsaDMsaDQsaDUsaDYsaGdyb3VwLG5hdixzZWN0aW9uLCcgK1xyXG4gICdkaXYsZGQsZGwsZHQsZmlnY2FwdGlvbixmaWd1cmUsaHIsaW1nLGxpLG1haW4sb2wscCxwcmUsdWwsJyArXHJcbiAgJ2EsYixhYmJyLGJkaSxiZG8sYnIsY2l0ZSxjb2RlLGRhdGEsZGZuLGVtLGksa2JkLG1hcmsscSxycCxydCxydGMscnVieSwnICtcclxuICAncyxzYW1wLHNtYWxsLHNwYW4sc3Ryb25nLHN1YixzdXAsdGltZSx1LHZhcix3YnIsYXJlYSxhdWRpbyxtYXAsdHJhY2ssdmlkZW8sJyArXHJcbiAgJ2VtYmVkLG9iamVjdCxwYXJhbSxzb3VyY2UsY2FudmFzLHNjcmlwdCxub3NjcmlwdCxkZWwsaW5zLCcgK1xyXG4gICdjYXB0aW9uLGNvbCxjb2xncm91cCx0YWJsZSx0aGVhZCx0Ym9keSx0ZCx0aCx0ciwnICtcclxuICAnYnV0dG9uLGRhdGFsaXN0LGZpZWxkc2V0LGZvcm0saW5wdXQsbGFiZWwsbGVnZW5kLG1ldGVyLG9wdGdyb3VwLG9wdGlvbiwnICtcclxuICAnb3V0cHV0LHByb2dyZXNzLHNlbGVjdCx0ZXh0YXJlYSwnICtcclxuICAnZGV0YWlscyxkaWFsb2csbWVudSxtZW51aXRlbSxzdW1tYXJ5LCcgK1xyXG4gICdjb250ZW50LGVsZW1lbnQsc2hhZG93LHRlbXBsYXRlJ1xyXG4pO1xyXG5cclxuLy8gdGhpcyBtYXAgaXMgaW50ZW50aW9uYWxseSBzZWxlY3RpdmUsIG9ubHkgY292ZXJpbmcgU1ZHIGVsZW1lbnRzIHRoYXQgbWF5XHJcbi8vIGNvbnRhaW4gY2hpbGQgZWxlbWVudHMuXHJcbnZhciBpc1NWRyA9IG1ha2VNYXAoXHJcbiAgJ3N2ZyxhbmltYXRlLGNpcmNsZSxjbGlwcGF0aCxjdXJzb3IsZGVmcyxkZXNjLGVsbGlwc2UsZmlsdGVyLCcgK1xyXG4gICdmb250LWZhY2UsZyxnbHlwaCxpbWFnZSxsaW5lLG1hcmtlcixtYXNrLG1pc3NpbmctZ2x5cGgscGF0aCxwYXR0ZXJuLCcgK1xyXG4gICdwb2x5Z29uLHBvbHlsaW5lLHJlY3Qsc3dpdGNoLHN5bWJvbCx0ZXh0LHRleHRwYXRoLHRzcGFuLHVzZSx2aWV3JyxcclxuICB0cnVlXHJcbik7XHJcblxyXG52YXIgaXNQcmVUYWcgPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiB0YWcgPT09ICdwcmUnOyB9O1xyXG5cclxudmFyIGlzUmVzZXJ2ZWRUYWcgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgcmV0dXJuIGlzSFRNTFRhZyh0YWcpIHx8IGlzU1ZHKHRhZylcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldFRhZ05hbWVzcGFjZSAodGFnKSB7XHJcbiAgaWYgKGlzU1ZHKHRhZykpIHtcclxuICAgIHJldHVybiAnc3ZnJ1xyXG4gIH1cclxuICAvLyBiYXNpYyBzdXBwb3J0IGZvciBNYXRoTUxcclxuICAvLyBub3RlIGl0IGRvZXNuJ3Qgc3VwcG9ydCBvdGhlciBNYXRoTUwgZWxlbWVudHMgYmVpbmcgY29tcG9uZW50IHJvb3RzXHJcbiAgaWYgKHRhZyA9PT0gJ21hdGgnKSB7XHJcbiAgICByZXR1cm4gJ21hdGgnXHJcbiAgfVxyXG59XHJcblxyXG52YXIgdW5rbm93bkVsZW1lbnRDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbmZ1bmN0aW9uIGlzVW5rbm93bkVsZW1lbnQgKHRhZykge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmICghaW5Ccm93c2VyKSB7XHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuICBpZiAoaXNSZXNlcnZlZFRhZyh0YWcpKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbiAgdGFnID0gdGFnLnRvTG93ZXJDYXNlKCk7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gdW5rbm93bkVsZW1lbnRDYWNoZVt0YWddXHJcbiAgfVxyXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICBpZiAodGFnLmluZGV4T2YoJy0nKSA+IC0xKSB7XHJcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yODIxMDM2NC8xMDcwMjQ0XHJcbiAgICByZXR1cm4gKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSA9IChcclxuICAgICAgZWwuY29uc3RydWN0b3IgPT09IHdpbmRvdy5IVE1MVW5rbm93bkVsZW1lbnQgfHxcclxuICAgICAgZWwuY29uc3RydWN0b3IgPT09IHdpbmRvdy5IVE1MRWxlbWVudFxyXG4gICAgKSlcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICh1bmtub3duRWxlbWVudENhY2hlW3RhZ10gPSAvSFRNTFVua25vd25FbGVtZW50Ly50ZXN0KGVsLnRvU3RyaW5nKCkpKVxyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG4vKipcclxuICogUXVlcnkgYW4gZWxlbWVudCBzZWxlY3RvciBpZiBpdCdzIG5vdCBhbiBlbGVtZW50IGFscmVhZHkuXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWVyeSAoZWwpIHtcclxuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG4gICAgdmFyIHNlbGVjdG9yID0gZWw7XHJcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xyXG4gICAgaWYgKCFlbCkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICAgICdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgc2VsZWN0b3JcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBlbFxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQkMSAodGFnTmFtZSwgdm5vZGUpIHtcclxuICB2YXIgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuICBpZiAodGFnTmFtZSAhPT0gJ3NlbGVjdCcpIHtcclxuICAgIHJldHVybiBlbG1cclxuICB9XHJcbiAgaWYgKHZub2RlLmRhdGEgJiYgdm5vZGUuZGF0YS5hdHRycyAmJiAnbXVsdGlwbGUnIGluIHZub2RlLmRhdGEuYXR0cnMpIHtcclxuICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgJ211bHRpcGxlJyk7XHJcbiAgfVxyXG4gIHJldHVybiBlbG1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TIChuYW1lc3BhY2UsIHRhZ05hbWUpIHtcclxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZU1hcFtuYW1lc3BhY2VdLCB0YWdOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUZXh0Tm9kZSAodGV4dCkge1xyXG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb21tZW50ICh0ZXh0KSB7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQodGV4dClcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlIChwYXJlbnROb2RlLCBuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XHJcbiAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkIChub2RlLCBjaGlsZCkge1xyXG4gIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBlbmRDaGlsZCAobm9kZSwgY2hpbGQpIHtcclxuICBub2RlLmFwcGVuZENoaWxkKGNoaWxkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyZW50Tm9kZSAobm9kZSkge1xyXG4gIHJldHVybiBub2RlLnBhcmVudE5vZGVcclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dFNpYmxpbmcgKG5vZGUpIHtcclxuICByZXR1cm4gbm9kZS5uZXh0U2libGluZ1xyXG59XHJcblxyXG5mdW5jdGlvbiB0YWdOYW1lIChub2RlKSB7XHJcbiAgcmV0dXJuIG5vZGUudGFnTmFtZVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRUZXh0Q29udGVudCAobm9kZSwgdGV4dCkge1xyXG4gIG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKG5vZGUsIGtleSwgdmFsKSB7XHJcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpO1xyXG59XHJcblxyXG5cclxudmFyIG5vZGVPcHMgPSBPYmplY3QuZnJlZXplKHtcclxuXHRjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50JDEsXHJcblx0Y3JlYXRlRWxlbWVudE5TOiBjcmVhdGVFbGVtZW50TlMsXHJcblx0Y3JlYXRlVGV4dE5vZGU6IGNyZWF0ZVRleHROb2RlLFxyXG5cdGNyZWF0ZUNvbW1lbnQ6IGNyZWF0ZUNvbW1lbnQsXHJcblx0aW5zZXJ0QmVmb3JlOiBpbnNlcnRCZWZvcmUsXHJcblx0cmVtb3ZlQ2hpbGQ6IHJlbW92ZUNoaWxkLFxyXG5cdGFwcGVuZENoaWxkOiBhcHBlbmRDaGlsZCxcclxuXHRwYXJlbnROb2RlOiBwYXJlbnROb2RlLFxyXG5cdG5leHRTaWJsaW5nOiBuZXh0U2libGluZyxcclxuXHR0YWdOYW1lOiB0YWdOYW1lLFxyXG5cdHNldFRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudCxcclxuXHRzZXRBdHRyaWJ1dGU6IHNldEF0dHJpYnV0ZVxyXG59KTtcclxuXHJcbi8qICAqL1xyXG5cclxudmFyIHJlZiA9IHtcclxuICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZSAoXywgdm5vZGUpIHtcclxuICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlIChvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIGlmIChvbGRWbm9kZS5kYXRhLnJlZiAhPT0gdm5vZGUuZGF0YS5yZWYpIHtcclxuICAgICAgcmVnaXN0ZXJSZWYob2xkVm5vZGUsIHRydWUpO1xyXG4gICAgICByZWdpc3RlclJlZih2bm9kZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95ICh2bm9kZSkge1xyXG4gICAgcmVnaXN0ZXJSZWYodm5vZGUsIHRydWUpO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyUmVmICh2bm9kZSwgaXNSZW1vdmFsKSB7XHJcbiAgdmFyIGtleSA9IHZub2RlLmRhdGEucmVmO1xyXG4gIGlmICgha2V5KSB7IHJldHVybiB9XHJcblxyXG4gIHZhciB2bSA9IHZub2RlLmNvbnRleHQ7XHJcbiAgdmFyIHJlZiA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlIHx8IHZub2RlLmVsbTtcclxuICB2YXIgcmVmcyA9IHZtLiRyZWZzO1xyXG4gIGlmIChpc1JlbW92YWwpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZnNba2V5XSkpIHtcclxuICAgICAgcmVtb3ZlJDEocmVmc1trZXldLCByZWYpO1xyXG4gICAgfSBlbHNlIGlmIChyZWZzW2tleV0gPT09IHJlZikge1xyXG4gICAgICByZWZzW2tleV0gPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh2bm9kZS5kYXRhLnJlZkluRm9yKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlZnNba2V5XSkgJiYgcmVmc1trZXldLmluZGV4T2YocmVmKSA8IDApIHtcclxuICAgICAgICByZWZzW2tleV0ucHVzaChyZWYpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlZnNba2V5XSA9IFtyZWZdO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWZzW2tleV0gPSByZWY7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVmlydHVhbCBET00gcGF0Y2hpbmcgYWxnb3JpdGhtIGJhc2VkIG9uIFNuYWJiZG9tIGJ5XHJcbiAqIFNpbW9uIEZyaWlzIFZpbmR1bSAoQHBhbGRlcGluZClcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxkZXBpbmQvc25hYmJkb20vYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gKlxyXG4gKiBtb2RpZmllZCBieSBFdmFuIFlvdSAoQHl5eDk5MDgwMylcclxuICpcclxuXHJcbi8qXHJcbiAqIE5vdCB0eXBlLWNoZWNraW5nIHRoaXMgYmVjYXVzZSB0aGlzIGZpbGUgaXMgcGVyZi1jcml0aWNhbCBhbmQgdGhlIGNvc3RcclxuICogb2YgbWFraW5nIGZsb3cgdW5kZXJzdGFuZCBpdCBpcyBub3Qgd29ydGggaXQuXHJcbiAqL1xyXG5cclxudmFyIGVtcHR5Tm9kZSA9IG5ldyBWTm9kZSgnJywge30sIFtdKTtcclxuXHJcbnZhciBob29rcyQxID0gWydjcmVhdGUnLCAnYWN0aXZhdGUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdkZXN0cm95J107XHJcblxyXG5mdW5jdGlvbiBpc1VuZGVmIChzKSB7XHJcbiAgcmV0dXJuIHMgPT0gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0RlZiAocykge1xyXG4gIHJldHVybiBzICE9IG51bGxcclxufVxyXG5cclxuZnVuY3Rpb24gc2FtZVZub2RlICh2bm9kZTEsIHZub2RlMikge1xyXG4gIHJldHVybiAoXHJcbiAgICB2bm9kZTEua2V5ID09PSB2bm9kZTIua2V5ICYmXHJcbiAgICB2bm9kZTEudGFnID09PSB2bm9kZTIudGFnICYmXHJcbiAgICB2bm9kZTEuaXNDb21tZW50ID09PSB2bm9kZTIuaXNDb21tZW50ICYmXHJcbiAgICAhdm5vZGUxLmRhdGEgPT09ICF2bm9kZTIuZGF0YVxyXG4gIClcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlS2V5VG9PbGRJZHggKGNoaWxkcmVuLCBiZWdpbklkeCwgZW5kSWR4KSB7XHJcbiAgdmFyIGksIGtleTtcclxuICB2YXIgbWFwID0ge307XHJcbiAgZm9yIChpID0gYmVnaW5JZHg7IGkgPD0gZW5kSWR4OyArK2kpIHtcclxuICAgIGtleSA9IGNoaWxkcmVuW2ldLmtleTtcclxuICAgIGlmIChpc0RlZihrZXkpKSB7IG1hcFtrZXldID0gaTsgfVxyXG4gIH1cclxuICByZXR1cm4gbWFwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhdGNoRnVuY3Rpb24gKGJhY2tlbmQpIHtcclxuICB2YXIgaSwgajtcclxuICB2YXIgY2JzID0ge307XHJcblxyXG4gIHZhciBtb2R1bGVzID0gYmFja2VuZC5tb2R1bGVzO1xyXG4gIHZhciBub2RlT3BzID0gYmFja2VuZC5ub2RlT3BzO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgaG9va3MkMS5sZW5ndGg7ICsraSkge1xyXG4gICAgY2JzW2hvb2tzJDFbaV1dID0gW107XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xyXG4gICAgICBpZiAobW9kdWxlc1tqXVtob29rcyQxW2ldXSAhPT0gdW5kZWZpbmVkKSB7IGNic1tob29rcyQxW2ldXS5wdXNoKG1vZHVsZXNbal1baG9va3MkMVtpXV0pOyB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbXB0eU5vZGVBdCAoZWxtKSB7XHJcbiAgICByZXR1cm4gbmV3IFZOb2RlKG5vZGVPcHMudGFnTmFtZShlbG0pLnRvTG93ZXJDYXNlKCksIHt9LCBbXSwgdW5kZWZpbmVkLCBlbG0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVSbUNiIChjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XHJcbiAgICBmdW5jdGlvbiByZW1vdmUkJDEgKCkge1xyXG4gICAgICBpZiAoLS1yZW1vdmUkJDEubGlzdGVuZXJzID09PSAwKSB7XHJcbiAgICAgICAgcmVtb3ZlTm9kZShjaGlsZEVsbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbW92ZSQkMS5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XHJcbiAgICByZXR1cm4gcmVtb3ZlJCQxXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW1vdmVOb2RlIChlbCkge1xyXG4gICAgdmFyIHBhcmVudCA9IG5vZGVPcHMucGFyZW50Tm9kZShlbCk7XHJcbiAgICAvLyBlbGVtZW50IG1heSBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkIGR1ZSB0byB2LWh0bWwgLyB2LXRleHRcclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgbm9kZU9wcy5yZW1vdmVDaGlsZChwYXJlbnQsIGVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpblByZSA9IDA7XHJcbiAgZnVuY3Rpb24gY3JlYXRlRWxtICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSwgbmVzdGVkKSB7XHJcbiAgICB2bm9kZS5pc1Jvb3RJbnNlcnQgPSAhbmVzdGVkOyAvLyBmb3IgdHJhbnNpdGlvbiBlbnRlciBjaGVja1xyXG4gICAgaWYgKGNyZWF0ZUNvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XHJcbiAgICB2YXIgdGFnID0gdm5vZGUudGFnO1xyXG4gICAgaWYgKGlzRGVmKHRhZykpIHtcclxuICAgICAge1xyXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEucHJlKSB7XHJcbiAgICAgICAgICBpblByZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAhaW5QcmUgJiZcclxuICAgICAgICAgICF2bm9kZS5ucyAmJlxyXG4gICAgICAgICAgIShjb25maWcuaWdub3JlZEVsZW1lbnRzLmxlbmd0aCAmJiBjb25maWcuaWdub3JlZEVsZW1lbnRzLmluZGV4T2YodGFnKSA+IC0xKSAmJlxyXG4gICAgICAgICAgY29uZmlnLmlzVW5rbm93bkVsZW1lbnQodGFnKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgd2FybihcclxuICAgICAgICAgICAgJ1Vua25vd24gY3VzdG9tIGVsZW1lbnQ6IDwnICsgdGFnICsgJz4gLSBkaWQgeW91ICcgK1xyXG4gICAgICAgICAgICAncmVnaXN0ZXIgdGhlIGNvbXBvbmVudCBjb3JyZWN0bHk/IEZvciByZWN1cnNpdmUgY29tcG9uZW50cywgJyArXHJcbiAgICAgICAgICAgICdtYWtlIHN1cmUgdG8gcHJvdmlkZSB0aGUgXCJuYW1lXCIgb3B0aW9uLicsXHJcbiAgICAgICAgICAgIHZub2RlLmNvbnRleHRcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZub2RlLmVsbSA9IHZub2RlLm5zXHJcbiAgICAgICAgPyBub2RlT3BzLmNyZWF0ZUVsZW1lbnROUyh2bm9kZS5ucywgdGFnKVxyXG4gICAgICAgIDogbm9kZU9wcy5jcmVhdGVFbGVtZW50KHRhZywgdm5vZGUpO1xyXG4gICAgICBzZXRTY29wZSh2bm9kZSk7XHJcblxyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAge1xyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKHZub2RlLCBjaGlsZHJlbiwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICBpZiAoaXNEZWYoZGF0YSkpIHtcclxuICAgICAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBkYXRhICYmIGRhdGEucHJlKSB7XHJcbiAgICAgICAgaW5QcmUtLTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh2bm9kZS5pc0NvbW1lbnQpIHtcclxuICAgICAgdm5vZGUuZWxtID0gbm9kZU9wcy5jcmVhdGVDb21tZW50KHZub2RlLnRleHQpO1xyXG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2bm9kZS5lbG0gPSBub2RlT3BzLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xyXG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQgKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtKSB7XHJcbiAgICB2YXIgaSA9IHZub2RlLmRhdGE7XHJcbiAgICBpZiAoaXNEZWYoaSkpIHtcclxuICAgICAgdmFyIGlzUmVhY3RpdmF0ZWQgPSBpc0RlZih2bm9kZS5jb21wb25lbnRJbnN0YW5jZSkgJiYgaS5rZWVwQWxpdmU7XHJcbiAgICAgIGlmIChpc0RlZihpID0gaS5ob29rKSAmJiBpc0RlZihpID0gaS5pbml0KSkge1xyXG4gICAgICAgIGkodm5vZGUsIGZhbHNlIC8qIGh5ZHJhdGluZyAqLywgcGFyZW50RWxtLCByZWZFbG0pO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGFmdGVyIGNhbGxpbmcgdGhlIGluaXQgaG9vaywgaWYgdGhlIHZub2RlIGlzIGEgY2hpbGQgY29tcG9uZW50XHJcbiAgICAgIC8vIGl0IHNob3VsZCd2ZSBjcmVhdGVkIGEgY2hpbGQgaW5zdGFuY2UgYW5kIG1vdW50ZWQgaXQuIHRoZSBjaGlsZFxyXG4gICAgICAvLyBjb21wb25lbnQgYWxzbyBoYXMgc2V0IHRoZSBwbGFjZWhvbGRlciB2bm9kZSdzIGVsbS5cclxuICAgICAgLy8gaW4gdGhhdCBjYXNlIHdlIGNhbiBqdXN0IHJldHVybiB0aGUgZWxlbWVudCBhbmQgYmUgZG9uZS5cclxuICAgICAgaWYgKGlzRGVmKHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xyXG4gICAgICAgIGluaXRDb21wb25lbnQodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgaWYgKGlzUmVhY3RpdmF0ZWQpIHtcclxuICAgICAgICAgIHJlYWN0aXZhdGVDb21wb25lbnQodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0Q29tcG9uZW50ICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICBpZiAodm5vZGUuZGF0YS5wZW5kaW5nSW5zZXJ0KSB7XHJcbiAgICAgIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoLmFwcGx5KGluc2VydGVkVm5vZGVRdWV1ZSwgdm5vZGUuZGF0YS5wZW5kaW5nSW5zZXJ0KTtcclxuICAgIH1cclxuICAgIHZub2RlLmVsbSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlLiRlbDtcclxuICAgIGlmIChpc1BhdGNoYWJsZSh2bm9kZSkpIHtcclxuICAgICAgaW52b2tlQ3JlYXRlSG9va3Modm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgIHNldFNjb3BlKHZub2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGVtcHR5IGNvbXBvbmVudCByb290LlxyXG4gICAgICAvLyBza2lwIGFsbCBlbGVtZW50LXJlbGF0ZWQgbW9kdWxlcyBleGNlcHQgZm9yIHJlZiAoIzM0NTUpXHJcbiAgICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcclxuICAgICAgLy8gbWFrZSBzdXJlIHRvIGludm9rZSB0aGUgaW5zZXJ0IGhvb2tcclxuICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlLnB1c2godm5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVhY3RpdmF0ZUNvbXBvbmVudCAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pIHtcclxuICAgIHZhciBpO1xyXG4gICAgLy8gaGFjayBmb3IgIzQzMzk6IGEgcmVhY3RpdmF0ZWQgY29tcG9uZW50IHdpdGggaW5uZXIgdHJhbnNpdGlvblxyXG4gICAgLy8gZG9lcyBub3QgdHJpZ2dlciBiZWNhdXNlIHRoZSBpbm5lciBub2RlJ3MgY3JlYXRlZCBob29rcyBhcmUgbm90IGNhbGxlZFxyXG4gICAgLy8gYWdhaW4uIEl0J3Mgbm90IGlkZWFsIHRvIGludm9sdmUgbW9kdWxlLXNwZWNpZmljIGxvZ2ljIGluIGhlcmUgYnV0XHJcbiAgICAvLyB0aGVyZSBkb2Vzbid0IHNlZW0gdG8gYmUgYSBiZXR0ZXIgd2F5IHRvIGRvIGl0LlxyXG4gICAgdmFyIGlubmVyTm9kZSA9IHZub2RlO1xyXG4gICAgd2hpbGUgKGlubmVyTm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xyXG4gICAgICBpbm5lck5vZGUgPSBpbm5lck5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlO1xyXG4gICAgICBpZiAoaXNEZWYoaSA9IGlubmVyTm9kZS5kYXRhKSAmJiBpc0RlZihpID0gaS50cmFuc2l0aW9uKSkge1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMuYWN0aXZhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgIGNicy5hY3RpdmF0ZVtpXShlbXB0eU5vZGUsIGlubmVyTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKGlubmVyTm9kZSk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gdW5saWtlIGEgbmV3bHkgY3JlYXRlZCBjb21wb25lbnQsXHJcbiAgICAvLyBhIHJlYWN0aXZhdGVkIGtlZXAtYWxpdmUgY29tcG9uZW50IGRvZXNuJ3QgaW5zZXJ0IGl0c2VsZlxyXG4gICAgaW5zZXJ0KHBhcmVudEVsbSwgdm5vZGUuZWxtLCByZWZFbG0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5zZXJ0IChwYXJlbnQsIGVsbSwgcmVmKSB7XHJcbiAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgIGlmIChyZWYpIHtcclxuICAgICAgICBub2RlT3BzLmluc2VydEJlZm9yZShwYXJlbnQsIGVsbSwgcmVmKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBub2RlT3BzLmFwcGVuZENoaWxkKHBhcmVudCwgZWxtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ2hpbGRyZW4gKHZub2RlLCBjaGlsZHJlbiwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGNyZWF0ZUVsbShjaGlsZHJlbltpXSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCB2bm9kZS5lbG0sIG51bGwsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzUHJpbWl0aXZlKHZub2RlLnRleHQpKSB7XHJcbiAgICAgIG5vZGVPcHMuYXBwZW5kQ2hpbGQodm5vZGUuZWxtLCBub2RlT3BzLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzUGF0Y2hhYmxlICh2bm9kZSkge1xyXG4gICAgd2hpbGUgKHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSB7XHJcbiAgICAgIHZub2RlID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzRGVmKHZub2RlLnRhZylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGludm9rZUNyZWF0ZUhvb2tzICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICBmb3IgKHZhciBpJDEgPSAwOyBpJDEgPCBjYnMuY3JlYXRlLmxlbmd0aDsgKytpJDEpIHtcclxuICAgICAgY2JzLmNyZWF0ZVtpJDFdKGVtcHR5Tm9kZSwgdm5vZGUpO1xyXG4gICAgfVxyXG4gICAgaSA9IHZub2RlLmRhdGEuaG9vazsgLy8gUmV1c2UgdmFyaWFibGVcclxuICAgIGlmIChpc0RlZihpKSkge1xyXG4gICAgICBpZiAoaS5jcmVhdGUpIHsgaS5jcmVhdGUoZW1wdHlOb2RlLCB2bm9kZSk7IH1cclxuICAgICAgaWYgKGkuaW5zZXJ0KSB7IGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKHZub2RlKTsgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gc2V0IHNjb3BlIGlkIGF0dHJpYnV0ZSBmb3Igc2NvcGVkIENTUy5cclxuICAvLyB0aGlzIGlzIGltcGxlbWVudGVkIGFzIGEgc3BlY2lhbCBjYXNlIHRvIGF2b2lkIHRoZSBvdmVyaGVhZFxyXG4gIC8vIG9mIGdvaW5nIHRocm91Z2ggdGhlIG5vcm1hbCBhdHRyaWJ1dGUgcGF0Y2hpbmcgcHJvY2Vzcy5cclxuICBmdW5jdGlvbiBzZXRTY29wZSAodm5vZGUpIHtcclxuICAgIHZhciBpO1xyXG4gICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5jb250ZXh0KSAmJiBpc0RlZihpID0gaS4kb3B0aW9ucy5fc2NvcGVJZCkpIHtcclxuICAgICAgbm9kZU9wcy5zZXRBdHRyaWJ1dGUodm5vZGUuZWxtLCBpLCAnJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNEZWYoaSA9IGFjdGl2ZUluc3RhbmNlKSAmJlxyXG4gICAgICAgIGkgIT09IHZub2RlLmNvbnRleHQgJiZcclxuICAgICAgICBpc0RlZihpID0gaS4kb3B0aW9ucy5fc2NvcGVJZCkpIHtcclxuICAgICAgbm9kZU9wcy5zZXRBdHRyaWJ1dGUodm5vZGUuZWxtLCBpLCAnJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRWbm9kZXMgKHBhcmVudEVsbSwgcmVmRWxtLCB2bm9kZXMsIHN0YXJ0SWR4LCBlbmRJZHgsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xyXG4gICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xyXG4gICAgICBjcmVhdGVFbG0odm5vZGVzW3N0YXJ0SWR4XSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbnZva2VEZXN0cm95SG9vayAodm5vZGUpIHtcclxuICAgIHZhciBpLCBqO1xyXG4gICAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XHJcbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5kZXN0cm95KSkgeyBpKHZub2RlKTsgfVxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmRlc3Ryb3kubGVuZ3RoOyArK2kpIHsgY2JzLmRlc3Ryb3lbaV0odm5vZGUpOyB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNoaWxkcmVuKSkge1xyXG4gICAgICBmb3IgKGogPSAwOyBqIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2opIHtcclxuICAgICAgICBpbnZva2VEZXN0cm95SG9vayh2bm9kZS5jaGlsZHJlbltqXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyAocGFyZW50RWxtLCB2bm9kZXMsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcclxuICAgIGZvciAoOyBzdGFydElkeCA8PSBlbmRJZHg7ICsrc3RhcnRJZHgpIHtcclxuICAgICAgdmFyIGNoID0gdm5vZGVzW3N0YXJ0SWR4XTtcclxuICAgICAgaWYgKGlzRGVmKGNoKSkge1xyXG4gICAgICAgIGlmIChpc0RlZihjaC50YWcpKSB7XHJcbiAgICAgICAgICByZW1vdmVBbmRJbnZva2VSZW1vdmVIb29rKGNoKTtcclxuICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGNoKTtcclxuICAgICAgICB9IGVsc2UgeyAvLyBUZXh0IG5vZGVcclxuICAgICAgICAgIHJlbW92ZU5vZGUoY2guZWxtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2sgKHZub2RlLCBybSkge1xyXG4gICAgaWYgKHJtIHx8IGlzRGVmKHZub2RlLmRhdGEpKSB7XHJcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBjYnMucmVtb3ZlLmxlbmd0aCArIDE7XHJcbiAgICAgIGlmICghcm0pIHtcclxuICAgICAgICAvLyBkaXJlY3RseSByZW1vdmluZ1xyXG4gICAgICAgIHJtID0gY3JlYXRlUm1DYih2bm9kZS5lbG0sIGxpc3RlbmVycyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gd2UgaGF2ZSBhIHJlY3Vyc2l2ZWx5IHBhc3NlZCBkb3duIHJtIGNhbGxiYWNrXHJcbiAgICAgICAgLy8gaW5jcmVhc2UgdGhlIGxpc3RlbmVycyBjb3VudFxyXG4gICAgICAgIHJtLmxpc3RlbmVycyArPSBsaXN0ZW5lcnM7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmVjdXJzaXZlbHkgaW52b2tlIGhvb2tzIG9uIGNoaWxkIGNvbXBvbmVudCByb290IG5vZGVcclxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSkgJiYgaXNEZWYoaSA9IGkuX3Zub2RlKSAmJiBpc0RlZihpLmRhdGEpKSB7XHJcbiAgICAgICAgcmVtb3ZlQW5kSW52b2tlUmVtb3ZlSG9vayhpLCBybSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5yZW1vdmUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjYnMucmVtb3ZlW2ldKHZub2RlLCBybSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5kYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnJlbW92ZSkpIHtcclxuICAgICAgICBpKHZub2RlLCBybSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm0oKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVtb3ZlTm9kZSh2bm9kZS5lbG0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4gKHBhcmVudEVsbSwgb2xkQ2gsIG5ld0NoLCBpbnNlcnRlZFZub2RlUXVldWUsIHJlbW92ZU9ubHkpIHtcclxuICAgIHZhciBvbGRTdGFydElkeCA9IDA7XHJcbiAgICB2YXIgbmV3U3RhcnRJZHggPSAwO1xyXG4gICAgdmFyIG9sZEVuZElkeCA9IG9sZENoLmxlbmd0aCAtIDE7XHJcbiAgICB2YXIgb2xkU3RhcnRWbm9kZSA9IG9sZENoWzBdO1xyXG4gICAgdmFyIG9sZEVuZFZub2RlID0gb2xkQ2hbb2xkRW5kSWR4XTtcclxuICAgIHZhciBuZXdFbmRJZHggPSBuZXdDaC5sZW5ndGggLSAxO1xyXG4gICAgdmFyIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFswXTtcclxuICAgIHZhciBuZXdFbmRWbm9kZSA9IG5ld0NoW25ld0VuZElkeF07XHJcbiAgICB2YXIgb2xkS2V5VG9JZHgsIGlkeEluT2xkLCBlbG1Ub01vdmUsIHJlZkVsbTtcclxuXHJcbiAgICAvLyByZW1vdmVPbmx5IGlzIGEgc3BlY2lhbCBmbGFnIHVzZWQgb25seSBieSA8dHJhbnNpdGlvbi1ncm91cD5cclxuICAgIC8vIHRvIGVuc3VyZSByZW1vdmVkIGVsZW1lbnRzIHN0YXkgaW4gY29ycmVjdCByZWxhdGl2ZSBwb3NpdGlvbnNcclxuICAgIC8vIGR1cmluZyBsZWF2aW5nIHRyYW5zaXRpb25zXHJcbiAgICB2YXIgY2FuTW92ZSA9ICFyZW1vdmVPbmx5O1xyXG5cclxuICAgIHdoaWxlIChvbGRTdGFydElkeCA8PSBvbGRFbmRJZHggJiYgbmV3U3RhcnRJZHggPD0gbmV3RW5kSWR4KSB7XHJcbiAgICAgIGlmIChpc1VuZGVmKG9sZFN0YXJ0Vm5vZGUpKSB7XHJcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdOyAvLyBWbm9kZSBoYXMgYmVlbiBtb3ZlZCBsZWZ0XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNVbmRlZihvbGRFbmRWbm9kZSkpIHtcclxuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcclxuICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHtcclxuICAgICAgICBwYXRjaFZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xyXG4gICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcclxuICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkRW5kVm5vZGUsIG5ld0VuZFZub2RlKSkge1xyXG4gICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xyXG4gICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hbLS1uZXdFbmRJZHhdO1xyXG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgcmlnaHRcclxuICAgICAgICBwYXRjaFZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgIGNhbk1vdmUgJiYgbm9kZU9wcy5pbnNlcnRCZWZvcmUocGFyZW50RWxtLCBvbGRTdGFydFZub2RlLmVsbSwgbm9kZU9wcy5uZXh0U2libGluZyhvbGRFbmRWbm9kZS5lbG0pKTtcclxuICAgICAgICBvbGRTdGFydFZub2RlID0gb2xkQ2hbKytvbGRTdGFydElkeF07XHJcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XHJcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlKSkgeyAvLyBWbm9kZSBtb3ZlZCBsZWZ0XHJcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XHJcbiAgICAgICAgb2xkRW5kVm5vZGUgPSBvbGRDaFstLW9sZEVuZElkeF07XHJcbiAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1VuZGVmKG9sZEtleVRvSWR4KSkgeyBvbGRLZXlUb0lkeCA9IGNyZWF0ZUtleVRvT2xkSWR4KG9sZENoLCBvbGRTdGFydElkeCwgb2xkRW5kSWR4KTsgfVxyXG4gICAgICAgIGlkeEluT2xkID0gaXNEZWYobmV3U3RhcnRWbm9kZS5rZXkpID8gb2xkS2V5VG9JZHhbbmV3U3RhcnRWbm9kZS5rZXldIDogbnVsbDtcclxuICAgICAgICBpZiAoaXNVbmRlZihpZHhJbk9sZCkpIHsgLy8gTmV3IGVsZW1lbnRcclxuICAgICAgICAgIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgb2xkU3RhcnRWbm9kZS5lbG0pO1xyXG4gICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlbG1Ub01vdmUgPSBvbGRDaFtpZHhJbk9sZF07XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhZWxtVG9Nb3ZlKSB7XHJcbiAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgJ0l0IHNlZW1zIHRoZXJlIGFyZSBkdXBsaWNhdGUga2V5cyB0aGF0IGlzIGNhdXNpbmcgYW4gdXBkYXRlIGVycm9yLiAnICtcclxuICAgICAgICAgICAgICAnTWFrZSBzdXJlIGVhY2ggdi1mb3IgaXRlbSBoYXMgYSB1bmlxdWUga2V5LidcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzYW1lVm5vZGUoZWxtVG9Nb3ZlLCBuZXdTdGFydFZub2RlKSkge1xyXG4gICAgICAgICAgICBwYXRjaFZub2RlKGVsbVRvTW92ZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgb2xkQ2hbaWR4SW5PbGRdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgbmV3U3RhcnRWbm9kZS5lbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc2FtZSBrZXkgYnV0IGRpZmZlcmVudCBlbGVtZW50LiB0cmVhdCBhcyBuZXcgZWxlbWVudFxyXG4gICAgICAgICAgICBjcmVhdGVFbG0obmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG9sZFN0YXJ0SWR4ID4gb2xkRW5kSWR4KSB7XHJcbiAgICAgIHJlZkVsbSA9IGlzVW5kZWYobmV3Q2hbbmV3RW5kSWR4ICsgMV0pID8gbnVsbCA6IG5ld0NoW25ld0VuZElkeCArIDFdLmVsbTtcclxuICAgICAgYWRkVm5vZGVzKHBhcmVudEVsbSwgcmVmRWxtLCBuZXdDaCwgbmV3U3RhcnRJZHgsIG5ld0VuZElkeCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgIH0gZWxzZSBpZiAobmV3U3RhcnRJZHggPiBuZXdFbmRJZHgpIHtcclxuICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSwgb2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGF0Y2hWbm9kZSAob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHJlbW92ZU9ubHkpIHtcclxuICAgIGlmIChvbGRWbm9kZSA9PT0gdm5vZGUpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvLyByZXVzZSBlbGVtZW50IGZvciBzdGF0aWMgdHJlZXMuXHJcbiAgICAvLyBub3RlIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgdm5vZGUgaXMgY2xvbmVkIC1cclxuICAgIC8vIGlmIHRoZSBuZXcgbm9kZSBpcyBub3QgY2xvbmVkIGl0IG1lYW5zIHRoZSByZW5kZXIgZnVuY3Rpb25zIGhhdmUgYmVlblxyXG4gICAgLy8gcmVzZXQgYnkgdGhlIGhvdC1yZWxvYWQtYXBpIGFuZCB3ZSBuZWVkIHRvIGRvIGEgcHJvcGVyIHJlLXJlbmRlci5cclxuICAgIGlmICh2bm9kZS5pc1N0YXRpYyAmJlxyXG4gICAgICAgIG9sZFZub2RlLmlzU3RhdGljICYmXHJcbiAgICAgICAgdm5vZGUua2V5ID09PSBvbGRWbm9kZS5rZXkgJiZcclxuICAgICAgICAodm5vZGUuaXNDbG9uZWQgfHwgdm5vZGUuaXNPbmNlKSkge1xyXG4gICAgICB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XHJcbiAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gb2xkVm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICB2YXIgaGFzRGF0YSA9IGlzRGVmKGRhdGEpO1xyXG4gICAgaWYgKGhhc0RhdGEgJiYgaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkucHJlcGF0Y2gpKSB7XHJcbiAgICAgIGkob2xkVm5vZGUsIHZub2RlKTtcclxuICAgIH1cclxuICAgIHZhciBlbG0gPSB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XHJcbiAgICB2YXIgb2xkQ2ggPSBvbGRWbm9kZS5jaGlsZHJlbjtcclxuICAgIHZhciBjaCA9IHZub2RlLmNoaWxkcmVuO1xyXG4gICAgaWYgKGhhc0RhdGEgJiYgaXNQYXRjaGFibGUodm5vZGUpKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMudXBkYXRlLmxlbmd0aDsgKytpKSB7IGNicy51cGRhdGVbaV0ob2xkVm5vZGUsIHZub2RlKTsgfVxyXG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkudXBkYXRlKSkgeyBpKG9sZFZub2RlLCB2bm9kZSk7IH1cclxuICAgIH1cclxuICAgIGlmIChpc1VuZGVmKHZub2RlLnRleHQpKSB7XHJcbiAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XHJcbiAgICAgICAgaWYgKG9sZENoICE9PSBjaCkgeyB1cGRhdGVDaGlsZHJlbihlbG0sIG9sZENoLCBjaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KTsgfVxyXG4gICAgICB9IGVsc2UgaWYgKGlzRGVmKGNoKSkge1xyXG4gICAgICAgIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkgeyBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpOyB9XHJcbiAgICAgICAgYWRkVm5vZGVzKGVsbSwgbnVsbCwgY2gsIDAsIGNoLmxlbmd0aCAtIDEsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNEZWYob2xkQ2gpKSB7XHJcbiAgICAgICAgcmVtb3ZlVm5vZGVzKGVsbSwgb2xkQ2gsIDAsIG9sZENoLmxlbmd0aCAtIDEpO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzRGVmKG9sZFZub2RlLnRleHQpKSB7XHJcbiAgICAgICAgbm9kZU9wcy5zZXRUZXh0Q29udGVudChlbG0sICcnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChvbGRWbm9kZS50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XHJcbiAgICAgIG5vZGVPcHMuc2V0VGV4dENvbnRlbnQoZWxtLCB2bm9kZS50ZXh0KTtcclxuICAgIH1cclxuICAgIGlmIChoYXNEYXRhKSB7XHJcbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5wb3N0cGF0Y2gpKSB7IGkob2xkVm5vZGUsIHZub2RlKTsgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW52b2tlSW5zZXJ0SG9vayAodm5vZGUsIHF1ZXVlLCBpbml0aWFsKSB7XHJcbiAgICAvLyBkZWxheSBpbnNlcnQgaG9va3MgZm9yIGNvbXBvbmVudCByb290IG5vZGVzLCBpbnZva2UgdGhlbSBhZnRlciB0aGVcclxuICAgIC8vIGVsZW1lbnQgaXMgcmVhbGx5IGluc2VydGVkXHJcbiAgICBpZiAoaW5pdGlhbCAmJiB2bm9kZS5wYXJlbnQpIHtcclxuICAgICAgdm5vZGUucGFyZW50LmRhdGEucGVuZGluZ0luc2VydCA9IHF1ZXVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIHF1ZXVlW2ldLmRhdGEuaG9vay5pbnNlcnQocXVldWVbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYmFpbGVkID0gZmFsc2U7XHJcbiAgLy8gbGlzdCBvZiBtb2R1bGVzIHRoYXQgY2FuIHNraXAgY3JlYXRlIGhvb2sgZHVyaW5nIGh5ZHJhdGlvbiBiZWNhdXNlIHRoZXlcclxuICAvLyBhcmUgYWxyZWFkeSByZW5kZXJlZCBvbiB0aGUgY2xpZW50IG9yIGhhcyBubyBuZWVkIGZvciBpbml0aWFsaXphdGlvblxyXG4gIHZhciBpc1JlbmRlcmVkTW9kdWxlID0gbWFrZU1hcCgnYXR0cnMsc3R5bGUsY2xhc3Msc3RhdGljQ2xhc3Msc3RhdGljU3R5bGUsa2V5Jyk7XHJcblxyXG4gIC8vIE5vdGU6IHRoaXMgaXMgYSBicm93c2VyLW9ubHkgZnVuY3Rpb24gc28gd2UgY2FuIGFzc3VtZSBlbG1zIGFyZSBET00gbm9kZXMuXHJcbiAgZnVuY3Rpb24gaHlkcmF0ZSAoZWxtLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICB7XHJcbiAgICAgIGlmICghYXNzZXJ0Tm9kZU1hdGNoKGVsbSwgdm5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZub2RlLmVsbSA9IGVsbTtcclxuICAgIHZhciB0YWcgPSB2bm9kZS50YWc7XHJcbiAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcclxuICAgIGlmIChpc0RlZihkYXRhKSkge1xyXG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuaW5pdCkpIHsgaSh2bm9kZSwgdHJ1ZSAvKiBoeWRyYXRpbmcgKi8pOyB9XHJcbiAgICAgIGlmIChpc0RlZihpID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UpKSB7XHJcbiAgICAgICAgLy8gY2hpbGQgY29tcG9uZW50LiBpdCBzaG91bGQgaGF2ZSBoeWRyYXRlZCBpdHMgb3duIHRyZWUuXHJcbiAgICAgICAgaW5pdENvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNEZWYodGFnKSkge1xyXG4gICAgICBpZiAoaXNEZWYoY2hpbGRyZW4pKSB7XHJcbiAgICAgICAgLy8gZW1wdHkgZWxlbWVudCwgYWxsb3cgY2xpZW50IHRvIHBpY2sgdXAgYW5kIHBvcHVsYXRlIGNoaWxkcmVuXHJcbiAgICAgICAgaWYgKCFlbG0uaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgICBjcmVhdGVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4sIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBjaGlsZHJlbk1hdGNoID0gdHJ1ZTtcclxuICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBlbG0uZmlyc3RDaGlsZDtcclxuICAgICAgICAgIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZE5vZGUgfHwgIWh5ZHJhdGUoY2hpbGROb2RlLCBjaGlsZHJlbltpJDFdLCBpbnNlcnRlZFZub2RlUXVldWUpKSB7XHJcbiAgICAgICAgICAgICAgY2hpbGRyZW5NYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gaWYgY2hpbGROb2RlIGlzIG5vdCBudWxsLCBpdCBtZWFucyB0aGUgYWN0dWFsIGNoaWxkTm9kZXMgbGlzdCBpc1xyXG4gICAgICAgICAgLy8gbG9uZ2VyIHRoYW4gdGhlIHZpcnR1YWwgY2hpbGRyZW4gbGlzdC5cclxuICAgICAgICAgIGlmICghY2hpbGRyZW5NYXRjaCB8fCBjaGlsZE5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAgICAgICAgICFiYWlsZWQpIHtcclxuICAgICAgICAgICAgICBiYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignUGFyZW50OiAnLCBlbG0pO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignTWlzbWF0Y2hpbmcgY2hpbGROb2RlcyB2cy4gVk5vZGVzOiAnLCBlbG0uY2hpbGROb2RlcywgY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNEZWYoZGF0YSkpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgaWYgKCFpc1JlbmRlcmVkTW9kdWxlKGtleSkpIHtcclxuICAgICAgICAgICAgaW52b2tlQ3JlYXRlSG9va3Modm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGVsbS5kYXRhICE9PSB2bm9kZS50ZXh0KSB7XHJcbiAgICAgIGVsbS5kYXRhID0gdm5vZGUudGV4dDtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhc3NlcnROb2RlTWF0Y2ggKG5vZGUsIHZub2RlKSB7XHJcbiAgICBpZiAodm5vZGUudGFnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdm5vZGUudGFnLmluZGV4T2YoJ3Z1ZS1jb21wb25lbnQnKSA9PT0gMCB8fFxyXG4gICAgICAgIHZub2RlLnRhZy50b0xvd2VyQ2FzZSgpID09PSAobm9kZS50YWdOYW1lICYmIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gKHZub2RlLmlzQ29tbWVudCA/IDggOiAzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhdGNoIChvbGRWbm9kZSwgdm5vZGUsIGh5ZHJhdGluZywgcmVtb3ZlT25seSwgcGFyZW50RWxtLCByZWZFbG0pIHtcclxuICAgIGlmICghdm5vZGUpIHtcclxuICAgICAgaWYgKG9sZFZub2RlKSB7IGludm9rZURlc3Ryb3lIb29rKG9sZFZub2RlKTsgfVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgaXNJbml0aWFsUGF0Y2ggPSBmYWxzZTtcclxuICAgIHZhciBpbnNlcnRlZFZub2RlUXVldWUgPSBbXTtcclxuXHJcbiAgICBpZiAoIW9sZFZub2RlKSB7XHJcbiAgICAgIC8vIGVtcHR5IG1vdW50IChsaWtlbHkgYXMgY29tcG9uZW50KSwgY3JlYXRlIG5ldyByb290IGVsZW1lbnRcclxuICAgICAgaXNJbml0aWFsUGF0Y2ggPSB0cnVlO1xyXG4gICAgICBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGlzUmVhbEVsZW1lbnQgPSBpc0RlZihvbGRWbm9kZS5ub2RlVHlwZSk7XHJcbiAgICAgIGlmICghaXNSZWFsRWxlbWVudCAmJiBzYW1lVm5vZGUob2xkVm5vZGUsIHZub2RlKSkge1xyXG4gICAgICAgIC8vIHBhdGNoIGV4aXN0aW5nIHJvb3Qgbm9kZVxyXG4gICAgICAgIHBhdGNoVm5vZGUob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHJlbW92ZU9ubHkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1JlYWxFbGVtZW50KSB7XHJcbiAgICAgICAgICAvLyBtb3VudGluZyB0byBhIHJlYWwgZWxlbWVudFxyXG4gICAgICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBzZXJ2ZXItcmVuZGVyZWQgY29udGVudCBhbmQgaWYgd2UgY2FuIHBlcmZvcm1cclxuICAgICAgICAgIC8vIGEgc3VjY2Vzc2Z1bCBoeWRyYXRpb24uXHJcbiAgICAgICAgICBpZiAob2xkVm5vZGUubm9kZVR5cGUgPT09IDEgJiYgb2xkVm5vZGUuaGFzQXR0cmlidXRlKCdzZXJ2ZXItcmVuZGVyZWQnKSkge1xyXG4gICAgICAgICAgICBvbGRWbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3NlcnZlci1yZW5kZXJlZCcpO1xyXG4gICAgICAgICAgICBoeWRyYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGh5ZHJhdGluZykge1xyXG4gICAgICAgICAgICBpZiAoaHlkcmF0ZShvbGRWbm9kZSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkpIHtcclxuICAgICAgICAgICAgICBpbnZva2VJbnNlcnRIb29rKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBvbGRWbm9kZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgICAnVGhlIGNsaWVudC1zaWRlIHJlbmRlcmVkIHZpcnR1YWwgRE9NIHRyZWUgaXMgbm90IG1hdGNoaW5nICcgK1xyXG4gICAgICAgICAgICAgICAgJ3NlcnZlci1yZW5kZXJlZCBjb250ZW50LiBUaGlzIGlzIGxpa2VseSBjYXVzZWQgYnkgaW5jb3JyZWN0ICcgK1xyXG4gICAgICAgICAgICAgICAgJ0hUTUwgbWFya3VwLCBmb3IgZXhhbXBsZSBuZXN0aW5nIGJsb2NrLWxldmVsIGVsZW1lbnRzIGluc2lkZSAnICtcclxuICAgICAgICAgICAgICAgICc8cD4sIG9yIG1pc3NpbmcgPHRib2R5Pi4gQmFpbGluZyBoeWRyYXRpb24gYW5kIHBlcmZvcm1pbmcgJyArXHJcbiAgICAgICAgICAgICAgICAnZnVsbCBjbGllbnQtc2lkZSByZW5kZXIuJ1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGVpdGhlciBub3Qgc2VydmVyLXJlbmRlcmVkLCBvciBoeWRyYXRpb24gZmFpbGVkLlxyXG4gICAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IG5vZGUgYW5kIHJlcGxhY2UgaXRcclxuICAgICAgICAgIG9sZFZub2RlID0gZW1wdHlOb2RlQXQob2xkVm5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXBsYWNpbmcgZXhpc3RpbmcgZWxlbWVudFxyXG4gICAgICAgIHZhciBvbGRFbG0gPSBvbGRWbm9kZS5lbG07XHJcbiAgICAgICAgdmFyIHBhcmVudEVsbSQxID0gbm9kZU9wcy5wYXJlbnROb2RlKG9sZEVsbSk7XHJcbiAgICAgICAgY3JlYXRlRWxtKFxyXG4gICAgICAgICAgdm5vZGUsXHJcbiAgICAgICAgICBpbnNlcnRlZFZub2RlUXVldWUsXHJcbiAgICAgICAgICAvLyBleHRyZW1lbHkgcmFyZSBlZGdlIGNhc2U6IGRvIG5vdCBpbnNlcnQgaWYgb2xkIGVsZW1lbnQgaXMgaW4gYVxyXG4gICAgICAgICAgLy8gbGVhdmluZyB0cmFuc2l0aW9uLiBPbmx5IGhhcHBlbnMgd2hlbiBjb21iaW5pbmcgdHJhbnNpdGlvbiArXHJcbiAgICAgICAgICAvLyBrZWVwLWFsaXZlICsgSE9Dcy4gKCM0NTkwKVxyXG4gICAgICAgICAgb2xkRWxtLl9sZWF2ZUNiID8gbnVsbCA6IHBhcmVudEVsbSQxLFxyXG4gICAgICAgICAgbm9kZU9wcy5uZXh0U2libGluZyhvbGRFbG0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHZub2RlLnBhcmVudCkge1xyXG4gICAgICAgICAgLy8gY29tcG9uZW50IHJvb3QgZWxlbWVudCByZXBsYWNlZC5cclxuICAgICAgICAgIC8vIHVwZGF0ZSBwYXJlbnQgcGxhY2Vob2xkZXIgbm9kZSBlbGVtZW50LCByZWN1cnNpdmVseVxyXG4gICAgICAgICAgdmFyIGFuY2VzdG9yID0gdm5vZGUucGFyZW50O1xyXG4gICAgICAgICAgd2hpbGUgKGFuY2VzdG9yKSB7XHJcbiAgICAgICAgICAgIGFuY2VzdG9yLmVsbSA9IHZub2RlLmVsbTtcclxuICAgICAgICAgICAgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNQYXRjaGFibGUodm5vZGUpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2JzLmNyZWF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgIGNicy5jcmVhdGVbaV0oZW1wdHlOb2RlLCB2bm9kZS5wYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyZW50RWxtJDEgIT09IG51bGwpIHtcclxuICAgICAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0kMSwgW29sZFZub2RlXSwgMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50YWcpKSB7XHJcbiAgICAgICAgICBpbnZva2VEZXN0cm95SG9vayhvbGRWbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW52b2tlSW5zZXJ0SG9vayh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBpc0luaXRpYWxQYXRjaCk7XHJcbiAgICByZXR1cm4gdm5vZGUuZWxtXHJcbiAgfVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBkaXJlY3RpdmVzID0ge1xyXG4gIGNyZWF0ZTogdXBkYXRlRGlyZWN0aXZlcyxcclxuICB1cGRhdGU6IHVwZGF0ZURpcmVjdGl2ZXMsXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gdW5iaW5kRGlyZWN0aXZlcyAodm5vZGUpIHtcclxuICAgIHVwZGF0ZURpcmVjdGl2ZXModm5vZGUsIGVtcHR5Tm9kZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlRGlyZWN0aXZlcyAob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgaWYgKG9sZFZub2RlLmRhdGEuZGlyZWN0aXZlcyB8fCB2bm9kZS5kYXRhLmRpcmVjdGl2ZXMpIHtcclxuICAgIF91cGRhdGUob2xkVm5vZGUsIHZub2RlKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF91cGRhdGUgKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gIHZhciBpc0NyZWF0ZSA9IG9sZFZub2RlID09PSBlbXB0eU5vZGU7XHJcbiAgdmFyIGlzRGVzdHJveSA9IHZub2RlID09PSBlbXB0eU5vZGU7XHJcbiAgdmFyIG9sZERpcnMgPSBub3JtYWxpemVEaXJlY3RpdmVzJDEob2xkVm5vZGUuZGF0YS5kaXJlY3RpdmVzLCBvbGRWbm9kZS5jb250ZXh0KTtcclxuICB2YXIgbmV3RGlycyA9IG5vcm1hbGl6ZURpcmVjdGl2ZXMkMSh2bm9kZS5kYXRhLmRpcmVjdGl2ZXMsIHZub2RlLmNvbnRleHQpO1xyXG5cclxuICB2YXIgZGlyc1dpdGhJbnNlcnQgPSBbXTtcclxuICB2YXIgZGlyc1dpdGhQb3N0cGF0Y2ggPSBbXTtcclxuXHJcbiAgdmFyIGtleSwgb2xkRGlyLCBkaXI7XHJcbiAgZm9yIChrZXkgaW4gbmV3RGlycykge1xyXG4gICAgb2xkRGlyID0gb2xkRGlyc1trZXldO1xyXG4gICAgZGlyID0gbmV3RGlyc1trZXldO1xyXG4gICAgaWYgKCFvbGREaXIpIHtcclxuICAgICAgLy8gbmV3IGRpcmVjdGl2ZSwgYmluZFxyXG4gICAgICBjYWxsSG9vayQxKGRpciwgJ2JpbmQnLCB2bm9kZSwgb2xkVm5vZGUpO1xyXG4gICAgICBpZiAoZGlyLmRlZiAmJiBkaXIuZGVmLmluc2VydGVkKSB7XHJcbiAgICAgICAgZGlyc1dpdGhJbnNlcnQucHVzaChkaXIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBleGlzdGluZyBkaXJlY3RpdmUsIHVwZGF0ZVxyXG4gICAgICBkaXIub2xkVmFsdWUgPSBvbGREaXIudmFsdWU7XHJcbiAgICAgIGNhbGxIb29rJDEoZGlyLCAndXBkYXRlJywgdm5vZGUsIG9sZFZub2RlKTtcclxuICAgICAgaWYgKGRpci5kZWYgJiYgZGlyLmRlZi5jb21wb25lbnRVcGRhdGVkKSB7XHJcbiAgICAgICAgZGlyc1dpdGhQb3N0cGF0Y2gucHVzaChkaXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoZGlyc1dpdGhJbnNlcnQubGVuZ3RoKSB7XHJcbiAgICB2YXIgY2FsbEluc2VydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJzV2l0aEluc2VydC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNhbGxIb29rJDEoZGlyc1dpdGhJbnNlcnRbaV0sICdpbnNlcnRlZCcsIHZub2RlLCBvbGRWbm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBpZiAoaXNDcmVhdGUpIHtcclxuICAgICAgbWVyZ2VWTm9kZUhvb2sodm5vZGUuZGF0YS5ob29rIHx8ICh2bm9kZS5kYXRhLmhvb2sgPSB7fSksICdpbnNlcnQnLCBjYWxsSW5zZXJ0LCAnZGlyLWluc2VydCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbEluc2VydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGRpcnNXaXRoUG9zdHBhdGNoLmxlbmd0aCkge1xyXG4gICAgbWVyZ2VWTm9kZUhvb2sodm5vZGUuZGF0YS5ob29rIHx8ICh2bm9kZS5kYXRhLmhvb2sgPSB7fSksICdwb3N0cGF0Y2gnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyc1dpdGhQb3N0cGF0Y2gubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjYWxsSG9vayQxKGRpcnNXaXRoUG9zdHBhdGNoW2ldLCAnY29tcG9uZW50VXBkYXRlZCcsIHZub2RlLCBvbGRWbm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH0sICdkaXItcG9zdHBhdGNoJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzQ3JlYXRlKSB7XHJcbiAgICBmb3IgKGtleSBpbiBvbGREaXJzKSB7XHJcbiAgICAgIGlmICghbmV3RGlyc1trZXldKSB7XHJcbiAgICAgICAgLy8gbm8gbG9uZ2VyIHByZXNlbnQsIHVuYmluZFxyXG4gICAgICAgIGNhbGxIb29rJDEob2xkRGlyc1trZXldLCAndW5iaW5kJywgb2xkVm5vZGUsIG9sZFZub2RlLCBpc0Rlc3Ryb3kpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG52YXIgZW1wdHlNb2RpZmllcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG5cclxuZnVuY3Rpb24gbm9ybWFsaXplRGlyZWN0aXZlcyQxIChcclxuICBkaXJzLFxyXG4gIHZtXHJcbikge1xyXG4gIHZhciByZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIGlmICghZGlycykge1xyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxuICB2YXIgaSwgZGlyO1xyXG4gIGZvciAoaSA9IDA7IGkgPCBkaXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBkaXIgPSBkaXJzW2ldO1xyXG4gICAgaWYgKCFkaXIubW9kaWZpZXJzKSB7XHJcbiAgICAgIGRpci5tb2RpZmllcnMgPSBlbXB0eU1vZGlmaWVycztcclxuICAgIH1cclxuICAgIHJlc1tnZXRSYXdEaXJOYW1lKGRpcildID0gZGlyO1xyXG4gICAgZGlyLmRlZiA9IHJlc29sdmVBc3NldCh2bS4kb3B0aW9ucywgJ2RpcmVjdGl2ZXMnLCBkaXIubmFtZSwgdHJ1ZSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXNcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmF3RGlyTmFtZSAoZGlyKSB7XHJcbiAgcmV0dXJuIGRpci5yYXdOYW1lIHx8ICgoZGlyLm5hbWUpICsgXCIuXCIgKyAoT2JqZWN0LmtleXMoZGlyLm1vZGlmaWVycyB8fCB7fSkuam9pbignLicpKSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsbEhvb2skMSAoZGlyLCBob29rLCB2bm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSkge1xyXG4gIHZhciBmbiA9IGRpci5kZWYgJiYgZGlyLmRlZltob29rXTtcclxuICBpZiAoZm4pIHtcclxuICAgIGZuKHZub2RlLmVsbSwgZGlyLCB2bm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgYmFzZU1vZHVsZXMgPSBbXHJcbiAgcmVmLFxyXG4gIGRpcmVjdGl2ZXNcclxuXTtcclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlQXR0cnMgKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gIGlmICghb2xkVm5vZGUuZGF0YS5hdHRycyAmJiAhdm5vZGUuZGF0YS5hdHRycykge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHZhciBrZXksIGN1ciwgb2xkO1xyXG4gIHZhciBlbG0gPSB2bm9kZS5lbG07XHJcbiAgdmFyIG9sZEF0dHJzID0gb2xkVm5vZGUuZGF0YS5hdHRycyB8fCB7fTtcclxuICB2YXIgYXR0cnMgPSB2bm9kZS5kYXRhLmF0dHJzIHx8IHt9O1xyXG4gIC8vIGNsb25lIG9ic2VydmVkIG9iamVjdHMsIGFzIHRoZSB1c2VyIHByb2JhYmx5IHdhbnRzIHRvIG11dGF0ZSBpdFxyXG4gIGlmIChhdHRycy5fX29iX18pIHtcclxuICAgIGF0dHJzID0gdm5vZGUuZGF0YS5hdHRycyA9IGV4dGVuZCh7fSwgYXR0cnMpO1xyXG4gIH1cclxuXHJcbiAgZm9yIChrZXkgaW4gYXR0cnMpIHtcclxuICAgIGN1ciA9IGF0dHJzW2tleV07XHJcbiAgICBvbGQgPSBvbGRBdHRyc1trZXldO1xyXG4gICAgaWYgKG9sZCAhPT0gY3VyKSB7XHJcbiAgICAgIHNldEF0dHIoZWxtLCBrZXksIGN1cik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vICM0MzkxOiBpbiBJRTksIHNldHRpbmcgdHlwZSBjYW4gcmVzZXQgdmFsdWUgZm9yIGlucHV0W3R5cGU9cmFkaW9dXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKGlzSUU5ICYmIGF0dHJzLnZhbHVlICE9PSBvbGRBdHRycy52YWx1ZSkge1xyXG4gICAgc2V0QXR0cihlbG0sICd2YWx1ZScsIGF0dHJzLnZhbHVlKTtcclxuICB9XHJcbiAgZm9yIChrZXkgaW4gb2xkQXR0cnMpIHtcclxuICAgIGlmIChhdHRyc1trZXldID09IG51bGwpIHtcclxuICAgICAgaWYgKGlzWGxpbmsoa2V5KSkge1xyXG4gICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua05TLCBnZXRYbGlua1Byb3Aoa2V5KSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWlzRW51bWVyYXRlZEF0dHIoa2V5KSkge1xyXG4gICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0QXR0ciAoZWwsIGtleSwgdmFsdWUpIHtcclxuICBpZiAoaXNCb29sZWFuQXR0cihrZXkpKSB7XHJcbiAgICAvLyBzZXQgYXR0cmlidXRlIGZvciBibGFuayB2YWx1ZVxyXG4gICAgLy8gZS5nLiA8b3B0aW9uIGRpc2FibGVkPlNlbGVjdCBvbmU8L29wdGlvbj5cclxuICAgIGlmIChpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSkge1xyXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIGtleSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChpc0VudW1lcmF0ZWRBdHRyKGtleSkpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpIHx8IHZhbHVlID09PSAnZmFsc2UnID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XHJcbiAgfSBlbHNlIGlmIChpc1hsaW5rKGtleSkpIHtcclxuICAgIGlmIChpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSkge1xyXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua05TLCBnZXRYbGlua1Byb3Aoa2V5KSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpKSB7XHJcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxudmFyIGF0dHJzID0ge1xyXG4gIGNyZWF0ZTogdXBkYXRlQXR0cnMsXHJcbiAgdXBkYXRlOiB1cGRhdGVBdHRyc1xyXG59O1xyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDbGFzcyAob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgdmFyIGVsID0gdm5vZGUuZWxtO1xyXG4gIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICB2YXIgb2xkRGF0YSA9IG9sZFZub2RlLmRhdGE7XHJcbiAgaWYgKCFkYXRhLnN0YXRpY0NsYXNzICYmICFkYXRhLmNsYXNzICYmXHJcbiAgICAgICghb2xkRGF0YSB8fCAoIW9sZERhdGEuc3RhdGljQ2xhc3MgJiYgIW9sZERhdGEuY2xhc3MpKSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICB2YXIgY2xzID0gZ2VuQ2xhc3NGb3JWbm9kZSh2bm9kZSk7XHJcblxyXG4gIC8vIGhhbmRsZSB0cmFuc2l0aW9uIGNsYXNzZXNcclxuICB2YXIgdHJhbnNpdGlvbkNsYXNzID0gZWwuX3RyYW5zaXRpb25DbGFzc2VzO1xyXG4gIGlmICh0cmFuc2l0aW9uQ2xhc3MpIHtcclxuICAgIGNscyA9IGNvbmNhdChjbHMsIHN0cmluZ2lmeUNsYXNzKHRyYW5zaXRpb25DbGFzcykpO1xyXG4gIH1cclxuXHJcbiAgLy8gc2V0IHRoZSBjbGFzc1xyXG4gIGlmIChjbHMgIT09IGVsLl9wcmV2Q2xhc3MpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbHMpO1xyXG4gICAgZWwuX3ByZXZDbGFzcyA9IGNscztcclxuICB9XHJcbn1cclxuXHJcbnZhciBrbGFzcyA9IHtcclxuICBjcmVhdGU6IHVwZGF0ZUNsYXNzLFxyXG4gIHVwZGF0ZTogdXBkYXRlQ2xhc3NcclxufTtcclxuXHJcbi8qICAqL1xyXG5cclxudmFyIHRhcmdldCQxO1xyXG5cclxuZnVuY3Rpb24gYWRkJDIgKFxyXG4gIGV2ZW50LFxyXG4gIGhhbmRsZXIsXHJcbiAgb25jZSxcclxuICBjYXB0dXJlXHJcbikge1xyXG4gIGlmIChvbmNlKSB7XHJcbiAgICB2YXIgb2xkSGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICB2YXIgX3RhcmdldCA9IHRhcmdldCQxOyAvLyBzYXZlIGN1cnJlbnQgdGFyZ2V0IGVsZW1lbnQgaW4gY2xvc3VyZVxyXG4gICAgaGFuZGxlciA9IGZ1bmN0aW9uIChldikge1xyXG4gICAgICByZW1vdmUkMyhldmVudCwgaGFuZGxlciwgY2FwdHVyZSwgX3RhcmdldCk7XHJcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcclxuICAgICAgICA/IG9sZEhhbmRsZXIoZXYpXHJcbiAgICAgICAgOiBvbGRIYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH1cclxuICB0YXJnZXQkMS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlJDMgKFxyXG4gIGV2ZW50LFxyXG4gIGhhbmRsZXIsXHJcbiAgY2FwdHVyZSxcclxuICBfdGFyZ2V0XHJcbikge1xyXG4gIChfdGFyZ2V0IHx8IHRhcmdldCQxKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlRE9NTGlzdGVuZXJzIChvbGRWbm9kZSwgdm5vZGUpIHtcclxuICBpZiAoIW9sZFZub2RlLmRhdGEub24gJiYgIXZub2RlLmRhdGEub24pIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB2YXIgb24gPSB2bm9kZS5kYXRhLm9uIHx8IHt9O1xyXG4gIHZhciBvbGRPbiA9IG9sZFZub2RlLmRhdGEub24gfHwge307XHJcbiAgdGFyZ2V0JDEgPSB2bm9kZS5lbG07XHJcbiAgdXBkYXRlTGlzdGVuZXJzKG9uLCBvbGRPbiwgYWRkJDIsIHJlbW92ZSQzLCB2bm9kZS5jb250ZXh0KTtcclxufVxyXG5cclxudmFyIGV2ZW50cyA9IHtcclxuICBjcmVhdGU6IHVwZGF0ZURPTUxpc3RlbmVycyxcclxuICB1cGRhdGU6IHVwZGF0ZURPTUxpc3RlbmVyc1xyXG59O1xyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVET01Qcm9wcyAob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgaWYgKCFvbGRWbm9kZS5kYXRhLmRvbVByb3BzICYmICF2bm9kZS5kYXRhLmRvbVByb3BzKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdmFyIGtleSwgY3VyO1xyXG4gIHZhciBlbG0gPSB2bm9kZS5lbG07XHJcbiAgdmFyIG9sZFByb3BzID0gb2xkVm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcclxuICB2YXIgcHJvcHMgPSB2bm9kZS5kYXRhLmRvbVByb3BzIHx8IHt9O1xyXG4gIC8vIGNsb25lIG9ic2VydmVkIG9iamVjdHMsIGFzIHRoZSB1c2VyIHByb2JhYmx5IHdhbnRzIHRvIG11dGF0ZSBpdFxyXG4gIGlmIChwcm9wcy5fX29iX18pIHtcclxuICAgIHByb3BzID0gdm5vZGUuZGF0YS5kb21Qcm9wcyA9IGV4dGVuZCh7fSwgcHJvcHMpO1xyXG4gIH1cclxuXHJcbiAgZm9yIChrZXkgaW4gb2xkUHJvcHMpIHtcclxuICAgIGlmIChwcm9wc1trZXldID09IG51bGwpIHtcclxuICAgICAgZWxtW2tleV0gPSAnJztcclxuICAgIH1cclxuICB9XHJcbiAgZm9yIChrZXkgaW4gcHJvcHMpIHtcclxuICAgIGN1ciA9IHByb3BzW2tleV07XHJcbiAgICAvLyBpZ25vcmUgY2hpbGRyZW4gaWYgdGhlIG5vZGUgaGFzIHRleHRDb250ZW50IG9yIGlubmVySFRNTCxcclxuICAgIC8vIGFzIHRoZXNlIHdpbGwgdGhyb3cgYXdheSBleGlzdGluZyBET00gbm9kZXMgYW5kIGNhdXNlIHJlbW92YWwgZXJyb3JzXHJcbiAgICAvLyBvbiBzdWJzZXF1ZW50IHBhdGNoZXMgKCMzMzYwKVxyXG4gICAgaWYgKGtleSA9PT0gJ3RleHRDb250ZW50JyB8fCBrZXkgPT09ICdpbm5lckhUTUwnKSB7XHJcbiAgICAgIGlmICh2bm9kZS5jaGlsZHJlbikgeyB2bm9kZS5jaGlsZHJlbi5sZW5ndGggPSAwOyB9XHJcbiAgICAgIGlmIChjdXIgPT09IG9sZFByb3BzW2tleV0pIHsgY29udGludWUgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChrZXkgPT09ICd2YWx1ZScpIHtcclxuICAgICAgLy8gc3RvcmUgdmFsdWUgYXMgX3ZhbHVlIGFzIHdlbGwgc2luY2VcclxuICAgICAgLy8gbm9uLXN0cmluZyB2YWx1ZXMgd2lsbCBiZSBzdHJpbmdpZmllZFxyXG4gICAgICBlbG0uX3ZhbHVlID0gY3VyO1xyXG4gICAgICAvLyBhdm9pZCByZXNldHRpbmcgY3Vyc29yIHBvc2l0aW9uIHdoZW4gdmFsdWUgaXMgdGhlIHNhbWVcclxuICAgICAgdmFyIHN0ckN1ciA9IGN1ciA9PSBudWxsID8gJycgOiBTdHJpbmcoY3VyKTtcclxuICAgICAgaWYgKHNob3VsZFVwZGF0ZVZhbHVlKGVsbSwgdm5vZGUsIHN0ckN1cikpIHtcclxuICAgICAgICBlbG0udmFsdWUgPSBzdHJDdXI7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsbVtrZXldID0gY3VyO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gY2hlY2sgcGxhdGZvcm1zL3dlYi91dGlsL2F0dHJzLmpzIGFjY2VwdFZhbHVlXHJcblxyXG5cclxuZnVuY3Rpb24gc2hvdWxkVXBkYXRlVmFsdWUgKFxyXG4gIGVsbSxcclxuICB2bm9kZSxcclxuICBjaGVja1ZhbFxyXG4pIHtcclxuICByZXR1cm4gKCFlbG0uY29tcG9zaW5nICYmIChcclxuICAgIHZub2RlLnRhZyA9PT0gJ29wdGlvbicgfHxcclxuICAgIGlzRGlydHkoZWxtLCBjaGVja1ZhbCkgfHxcclxuICAgIGlzSW5wdXRDaGFuZ2VkKHZub2RlLCBjaGVja1ZhbClcclxuICApKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0RpcnR5IChlbG0sIGNoZWNrVmFsKSB7XHJcbiAgLy8gcmV0dXJuIHRydWUgd2hlbiB0ZXh0Ym94ICgubnVtYmVyIGFuZCAudHJpbSkgbG9zZXMgZm9jdXMgYW5kIGl0cyB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdGhlIHVwZGF0ZWQgdmFsdWVcclxuICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZWxtICYmIGVsbS52YWx1ZSAhPT0gY2hlY2tWYWxcclxufVxyXG5cclxuZnVuY3Rpb24gaXNJbnB1dENoYW5nZWQgKHZub2RlLCBuZXdWYWwpIHtcclxuICB2YXIgdmFsdWUgPSB2bm9kZS5lbG0udmFsdWU7XHJcbiAgdmFyIG1vZGlmaWVycyA9IHZub2RlLmVsbS5fdk1vZGlmaWVyczsgLy8gaW5qZWN0ZWQgYnkgdi1tb2RlbCBydW50aW1lXHJcbiAgaWYgKChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLm51bWJlcikgfHwgdm5vZGUuZWxtLnR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gdG9OdW1iZXIodmFsdWUpICE9PSB0b051bWJlcihuZXdWYWwpXHJcbiAgfVxyXG4gIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLnRyaW0pIHtcclxuICAgIHJldHVybiB2YWx1ZS50cmltKCkgIT09IG5ld1ZhbC50cmltKClcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlICE9PSBuZXdWYWxcclxufVxyXG5cclxudmFyIGRvbVByb3BzID0ge1xyXG4gIGNyZWF0ZTogdXBkYXRlRE9NUHJvcHMsXHJcbiAgdXBkYXRlOiB1cGRhdGVET01Qcm9wc1xyXG59O1xyXG5cclxuLyogICovXHJcblxyXG52YXIgcGFyc2VTdHlsZVRleHQgPSBjYWNoZWQoZnVuY3Rpb24gKGNzc1RleHQpIHtcclxuICB2YXIgcmVzID0ge307XHJcbiAgdmFyIGxpc3REZWxpbWl0ZXIgPSAvOyg/IVteKF0qXFwpKS9nO1xyXG4gIHZhciBwcm9wZXJ0eURlbGltaXRlciA9IC86KC4rKS87XHJcbiAgY3NzVGV4dC5zcGxpdChsaXN0RGVsaW1pdGVyKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICBpZiAoaXRlbSkge1xyXG4gICAgICB2YXIgdG1wID0gaXRlbS5zcGxpdChwcm9wZXJ0eURlbGltaXRlcik7XHJcbiAgICAgIHRtcC5sZW5ndGggPiAxICYmIChyZXNbdG1wWzBdLnRyaW0oKV0gPSB0bXBbMV0udHJpbSgpKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcmVzXHJcbn0pO1xyXG5cclxuLy8gbWVyZ2Ugc3RhdGljIGFuZCBkeW5hbWljIHN0eWxlIGRhdGEgb24gdGhlIHNhbWUgdm5vZGVcclxuZnVuY3Rpb24gbm9ybWFsaXplU3R5bGVEYXRhIChkYXRhKSB7XHJcbiAgdmFyIHN0eWxlID0gbm9ybWFsaXplU3R5bGVCaW5kaW5nKGRhdGEuc3R5bGUpO1xyXG4gIC8vIHN0YXRpYyBzdHlsZSBpcyBwcmUtcHJvY2Vzc2VkIGludG8gYW4gb2JqZWN0IGR1cmluZyBjb21waWxhdGlvblxyXG4gIC8vIGFuZCBpcyBhbHdheXMgYSBmcmVzaCBvYmplY3QsIHNvIGl0J3Mgc2FmZSB0byBtZXJnZSBpbnRvIGl0XHJcbiAgcmV0dXJuIGRhdGEuc3RhdGljU3R5bGVcclxuICAgID8gZXh0ZW5kKGRhdGEuc3RhdGljU3R5bGUsIHN0eWxlKVxyXG4gICAgOiBzdHlsZVxyXG59XHJcblxyXG4vLyBub3JtYWxpemUgcG9zc2libGUgYXJyYXkgLyBzdHJpbmcgdmFsdWVzIGludG8gT2JqZWN0XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlQmluZGluZyAoYmluZGluZ1N0eWxlKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoYmluZGluZ1N0eWxlKSkge1xyXG4gICAgcmV0dXJuIHRvT2JqZWN0KGJpbmRpbmdTdHlsZSlcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBiaW5kaW5nU3R5bGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gcGFyc2VTdHlsZVRleHQoYmluZGluZ1N0eWxlKVxyXG4gIH1cclxuICByZXR1cm4gYmluZGluZ1N0eWxlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBwYXJlbnQgY29tcG9uZW50IHN0eWxlIHNob3VsZCBiZSBhZnRlciBjaGlsZCdzXHJcbiAqIHNvIHRoYXQgcGFyZW50IGNvbXBvbmVudCdzIHN0eWxlIGNvdWxkIG92ZXJyaWRlIGl0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdHlsZSAodm5vZGUsIGNoZWNrQ2hpbGQpIHtcclxuICB2YXIgcmVzID0ge307XHJcbiAgdmFyIHN0eWxlRGF0YTtcclxuXHJcbiAgaWYgKGNoZWNrQ2hpbGQpIHtcclxuICAgIHZhciBjaGlsZE5vZGUgPSB2bm9kZTtcclxuICAgIHdoaWxlIChjaGlsZE5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcclxuICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZTtcclxuICAgICAgaWYgKGNoaWxkTm9kZS5kYXRhICYmIChzdHlsZURhdGEgPSBub3JtYWxpemVTdHlsZURhdGEoY2hpbGROb2RlLmRhdGEpKSkge1xyXG4gICAgICAgIGV4dGVuZChyZXMsIHN0eWxlRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICgoc3R5bGVEYXRhID0gbm9ybWFsaXplU3R5bGVEYXRhKHZub2RlLmRhdGEpKSkge1xyXG4gICAgZXh0ZW5kKHJlcywgc3R5bGVEYXRhKTtcclxuICB9XHJcblxyXG4gIHZhciBwYXJlbnROb2RlID0gdm5vZGU7XHJcbiAgd2hpbGUgKChwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnQpKSB7XHJcbiAgICBpZiAocGFyZW50Tm9kZS5kYXRhICYmIChzdHlsZURhdGEgPSBub3JtYWxpemVTdHlsZURhdGEocGFyZW50Tm9kZS5kYXRhKSkpIHtcclxuICAgICAgZXh0ZW5kKHJlcywgc3R5bGVEYXRhKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBjc3NWYXJSRSA9IC9eLS0vO1xyXG52YXIgaW1wb3J0YW50UkUgPSAvXFxzKiFpbXBvcnRhbnQkLztcclxudmFyIHNldFByb3AgPSBmdW5jdGlvbiAoZWwsIG5hbWUsIHZhbCkge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmIChjc3NWYXJSRS50ZXN0KG5hbWUpKSB7XHJcbiAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwpO1xyXG4gIH0gZWxzZSBpZiAoaW1wb3J0YW50UkUudGVzdCh2YWwpKSB7XHJcbiAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwucmVwbGFjZShpbXBvcnRhbnRSRSwgJycpLCAnaW1wb3J0YW50Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGVsLnN0eWxlW25vcm1hbGl6ZShuYW1lKV0gPSB2YWw7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHByZWZpeGVzID0gWydXZWJraXQnLCAnTW96JywgJ21zJ107XHJcblxyXG52YXIgdGVzdEVsO1xyXG52YXIgbm9ybWFsaXplID0gY2FjaGVkKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgdGVzdEVsID0gdGVzdEVsIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHByb3AgPSBjYW1lbGl6ZShwcm9wKTtcclxuICBpZiAocHJvcCAhPT0gJ2ZpbHRlcicgJiYgKHByb3AgaW4gdGVzdEVsLnN0eWxlKSkge1xyXG4gICAgcmV0dXJuIHByb3BcclxuICB9XHJcbiAgdmFyIHVwcGVyID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHByZWZpeGVkID0gcHJlZml4ZXNbaV0gKyB1cHBlcjtcclxuICAgIGlmIChwcmVmaXhlZCBpbiB0ZXN0RWwuc3R5bGUpIHtcclxuICAgICAgcmV0dXJuIHByZWZpeGVkXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChvbGRWbm9kZSwgdm5vZGUpIHtcclxuICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgdmFyIG9sZERhdGEgPSBvbGRWbm9kZS5kYXRhO1xyXG5cclxuICBpZiAoIWRhdGEuc3RhdGljU3R5bGUgJiYgIWRhdGEuc3R5bGUgJiZcclxuICAgICAgIW9sZERhdGEuc3RhdGljU3R5bGUgJiYgIW9sZERhdGEuc3R5bGUpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgdmFyIGN1ciwgbmFtZTtcclxuICB2YXIgZWwgPSB2bm9kZS5lbG07XHJcbiAgdmFyIG9sZFN0YXRpY1N0eWxlID0gb2xkVm5vZGUuZGF0YS5zdGF0aWNTdHlsZTtcclxuICB2YXIgb2xkU3R5bGVCaW5kaW5nID0gb2xkVm5vZGUuZGF0YS5zdHlsZSB8fCB7fTtcclxuXHJcbiAgLy8gaWYgc3RhdGljIHN0eWxlIGV4aXN0cywgc3R5bGViaW5kaW5nIGFscmVhZHkgbWVyZ2VkIGludG8gaXQgd2hlbiBkb2luZyBub3JtYWxpemVTdHlsZURhdGFcclxuICB2YXIgb2xkU3R5bGUgPSBvbGRTdGF0aWNTdHlsZSB8fCBvbGRTdHlsZUJpbmRpbmc7XHJcblxyXG4gIHZhciBzdHlsZSA9IG5vcm1hbGl6ZVN0eWxlQmluZGluZyh2bm9kZS5kYXRhLnN0eWxlKSB8fCB7fTtcclxuXHJcbiAgdm5vZGUuZGF0YS5zdHlsZSA9IHN0eWxlLl9fb2JfXyA/IGV4dGVuZCh7fSwgc3R5bGUpIDogc3R5bGU7XHJcblxyXG4gIHZhciBuZXdTdHlsZSA9IGdldFN0eWxlKHZub2RlLCB0cnVlKTtcclxuXHJcbiAgZm9yIChuYW1lIGluIG9sZFN0eWxlKSB7XHJcbiAgICBpZiAobmV3U3R5bGVbbmFtZV0gPT0gbnVsbCkge1xyXG4gICAgICBzZXRQcm9wKGVsLCBuYW1lLCAnJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZvciAobmFtZSBpbiBuZXdTdHlsZSkge1xyXG4gICAgY3VyID0gbmV3U3R5bGVbbmFtZV07XHJcbiAgICBpZiAoY3VyICE9PSBvbGRTdHlsZVtuYW1lXSkge1xyXG4gICAgICAvLyBpZTkgc2V0dGluZyB0byBudWxsIGhhcyBubyBlZmZlY3QsIG11c3QgdXNlIGVtcHR5IHN0cmluZ1xyXG4gICAgICBzZXRQcm9wKGVsLCBuYW1lLCBjdXIgPT0gbnVsbCA/ICcnIDogY3VyKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnZhciBzdHlsZSA9IHtcclxuICBjcmVhdGU6IHVwZGF0ZVN0eWxlLFxyXG4gIHVwZGF0ZTogdXBkYXRlU3R5bGVcclxufTtcclxuXHJcbi8qICAqL1xyXG5cclxuLyoqXHJcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIFNWRyBzaW5jZSBjbGFzc0xpc3QgaXMgbm90IHN1cHBvcnRlZCBvblxyXG4gKiBTVkcgZWxlbWVudHMgaW4gSUVcclxuICovXHJcbmZ1bmN0aW9uIGFkZENsYXNzIChlbCwgY2xzKSB7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKCFjbHMgfHwgIWNscy50cmltKCkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICBpZiAoZWwuY2xhc3NMaXN0KSB7XHJcbiAgICBpZiAoY2xzLmluZGV4T2YoJyAnKSA+IC0xKSB7XHJcbiAgICAgIGNscy5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5hZGQoYyk7IH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgY3VyID0gJyAnICsgZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpICsgJyAnO1xyXG4gICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAoY3VyICsgY2xzKS50cmltKCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIFNWRyBzaW5jZSBjbGFzc0xpc3QgaXMgbm90IHN1cHBvcnRlZCBvblxyXG4gKiBTVkcgZWxlbWVudHMgaW4gSUVcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzIChlbCwgY2xzKSB7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKCFjbHMgfHwgIWNscy50cmltKCkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICBpZiAoZWwuY2xhc3NMaXN0KSB7XHJcbiAgICBpZiAoY2xzLmluZGV4T2YoJyAnKSA+IC0xKSB7XHJcbiAgICAgIGNscy5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5yZW1vdmUoYyk7IH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgY3VyID0gJyAnICsgZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpICsgJyAnO1xyXG4gICAgdmFyIHRhciA9ICcgJyArIGNscyArICcgJztcclxuICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcclxuICAgICAgY3VyID0gY3VyLnJlcGxhY2UodGFyLCAnICcpO1xyXG4gICAgfVxyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGN1ci50cmltKCkpO1xyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgaGFzVHJhbnNpdGlvbiA9IGluQnJvd3NlciAmJiAhaXNJRTk7XHJcbnZhciBUUkFOU0lUSU9OID0gJ3RyYW5zaXRpb24nO1xyXG52YXIgQU5JTUFUSU9OID0gJ2FuaW1hdGlvbic7XHJcblxyXG4vLyBUcmFuc2l0aW9uIHByb3BlcnR5L2V2ZW50IHNuaWZmaW5nXHJcbnZhciB0cmFuc2l0aW9uUHJvcCA9ICd0cmFuc2l0aW9uJztcclxudmFyIHRyYW5zaXRpb25FbmRFdmVudCA9ICd0cmFuc2l0aW9uZW5kJztcclxudmFyIGFuaW1hdGlvblByb3AgPSAnYW5pbWF0aW9uJztcclxudmFyIGFuaW1hdGlvbkVuZEV2ZW50ID0gJ2FuaW1hdGlvbmVuZCc7XHJcbmlmIChoYXNUcmFuc2l0aW9uKSB7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKHdpbmRvdy5vbnRyYW5zaXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0cmFuc2l0aW9uUHJvcCA9ICdXZWJraXRUcmFuc2l0aW9uJztcclxuICAgIHRyYW5zaXRpb25FbmRFdmVudCA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcclxuICB9XHJcbiAgaWYgKHdpbmRvdy5vbmFuaW1hdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICB3aW5kb3cub253ZWJraXRhbmltYXRpb25lbmQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgYW5pbWF0aW9uUHJvcCA9ICdXZWJraXRBbmltYXRpb24nO1xyXG4gICAgYW5pbWF0aW9uRW5kRXZlbnQgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcclxuICB9XHJcbn1cclxuXHJcbi8vIGJpbmRpbmcgdG8gd2luZG93IGlzIG5lY2Vzc2FyeSB0byBtYWtlIGhvdCByZWxvYWQgd29yayBpbiBJRSBpbiBzdHJpY3QgbW9kZVxyXG52YXIgcmFmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpXHJcbiAgOiBzZXRUaW1lb3V0O1xyXG5cclxuZnVuY3Rpb24gbmV4dEZyYW1lIChmbikge1xyXG4gIHJhZihmdW5jdGlvbiAoKSB7XHJcbiAgICByYWYoZm4pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUcmFuc2l0aW9uQ2xhc3MgKGVsLCBjbHMpIHtcclxuICAoZWwuX3RyYW5zaXRpb25DbGFzc2VzIHx8IChlbC5fdHJhbnNpdGlvbkNsYXNzZXMgPSBbXSkpLnB1c2goY2xzKTtcclxuICBhZGRDbGFzcyhlbCwgY2xzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkNsYXNzIChlbCwgY2xzKSB7XHJcbiAgaWYgKGVsLl90cmFuc2l0aW9uQ2xhc3Nlcykge1xyXG4gICAgcmVtb3ZlJDEoZWwuX3RyYW5zaXRpb25DbGFzc2VzLCBjbHMpO1xyXG4gIH1cclxuICByZW1vdmVDbGFzcyhlbCwgY2xzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd2hlblRyYW5zaXRpb25FbmRzIChcclxuICBlbCxcclxuICBleHBlY3RlZFR5cGUsXHJcbiAgY2JcclxuKSB7XHJcbiAgdmFyIHJlZiA9IGdldFRyYW5zaXRpb25JbmZvKGVsLCBleHBlY3RlZFR5cGUpO1xyXG4gIHZhciB0eXBlID0gcmVmLnR5cGU7XHJcbiAgdmFyIHRpbWVvdXQgPSByZWYudGltZW91dDtcclxuICB2YXIgcHJvcENvdW50ID0gcmVmLnByb3BDb3VudDtcclxuICBpZiAoIXR5cGUpIHsgcmV0dXJuIGNiKCkgfVxyXG4gIHZhciBldmVudCA9IHR5cGUgPT09IFRSQU5TSVRJT04gPyB0cmFuc2l0aW9uRW5kRXZlbnQgOiBhbmltYXRpb25FbmRFdmVudDtcclxuICB2YXIgZW5kZWQgPSAwO1xyXG4gIHZhciBlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XHJcbiAgICBjYigpO1xyXG4gIH07XHJcbiAgdmFyIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcclxuICAgICAgaWYgKCsrZW5kZWQgPj0gcHJvcENvdW50KSB7XHJcbiAgICAgICAgZW5kKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKGVuZGVkIDwgcHJvcENvdW50KSB7XHJcbiAgICAgIGVuZCgpO1xyXG4gICAgfVxyXG4gIH0sIHRpbWVvdXQgKyAxKTtcclxuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XHJcbn1cclxuXHJcbnZhciB0cmFuc2Zvcm1SRSA9IC9cXGIodHJhbnNmb3JtfGFsbCkoLHwkKS87XHJcblxyXG5mdW5jdGlvbiBnZXRUcmFuc2l0aW9uSW5mbyAoZWwsIGV4cGVjdGVkVHlwZSkge1xyXG4gIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcbiAgdmFyIHRyYW5zaXRpb25lRGVsYXlzID0gc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ0RlbGF5J10uc3BsaXQoJywgJyk7XHJcbiAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbnMgPSBzdHlsZXNbdHJhbnNpdGlvblByb3AgKyAnRHVyYXRpb24nXS5zcGxpdCgnLCAnKTtcclxuICB2YXIgdHJhbnNpdGlvblRpbWVvdXQgPSBnZXRUaW1lb3V0KHRyYW5zaXRpb25lRGVsYXlzLCB0cmFuc2l0aW9uRHVyYXRpb25zKTtcclxuICB2YXIgYW5pbWF0aW9uRGVsYXlzID0gc3R5bGVzW2FuaW1hdGlvblByb3AgKyAnRGVsYXknXS5zcGxpdCgnLCAnKTtcclxuICB2YXIgYW5pbWF0aW9uRHVyYXRpb25zID0gc3R5bGVzW2FuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXS5zcGxpdCgnLCAnKTtcclxuICB2YXIgYW5pbWF0aW9uVGltZW91dCA9IGdldFRpbWVvdXQoYW5pbWF0aW9uRGVsYXlzLCBhbmltYXRpb25EdXJhdGlvbnMpO1xyXG5cclxuICB2YXIgdHlwZTtcclxuICB2YXIgdGltZW91dCA9IDA7XHJcbiAgdmFyIHByb3BDb3VudCA9IDA7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKGV4cGVjdGVkVHlwZSA9PT0gVFJBTlNJVElPTikge1xyXG4gICAgaWYgKHRyYW5zaXRpb25UaW1lb3V0ID4gMCkge1xyXG4gICAgICB0eXBlID0gVFJBTlNJVElPTjtcclxuICAgICAgdGltZW91dCA9IHRyYW5zaXRpb25UaW1lb3V0O1xyXG4gICAgICBwcm9wQ291bnQgPSB0cmFuc2l0aW9uRHVyYXRpb25zLmxlbmd0aDtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gQU5JTUFUSU9OKSB7XHJcbiAgICBpZiAoYW5pbWF0aW9uVGltZW91dCA+IDApIHtcclxuICAgICAgdHlwZSA9IEFOSU1BVElPTjtcclxuICAgICAgdGltZW91dCA9IGFuaW1hdGlvblRpbWVvdXQ7XHJcbiAgICAgIHByb3BDb3VudCA9IGFuaW1hdGlvbkR1cmF0aW9ucy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRpbWVvdXQgPSBNYXRoLm1heCh0cmFuc2l0aW9uVGltZW91dCwgYW5pbWF0aW9uVGltZW91dCk7XHJcbiAgICB0eXBlID0gdGltZW91dCA+IDBcclxuICAgICAgPyB0cmFuc2l0aW9uVGltZW91dCA+IGFuaW1hdGlvblRpbWVvdXRcclxuICAgICAgICA/IFRSQU5TSVRJT05cclxuICAgICAgICA6IEFOSU1BVElPTlxyXG4gICAgICA6IG51bGw7XHJcbiAgICBwcm9wQ291bnQgPSB0eXBlXHJcbiAgICAgID8gdHlwZSA9PT0gVFJBTlNJVElPTlxyXG4gICAgICAgID8gdHJhbnNpdGlvbkR1cmF0aW9ucy5sZW5ndGhcclxuICAgICAgICA6IGFuaW1hdGlvbkR1cmF0aW9ucy5sZW5ndGhcclxuICAgICAgOiAwO1xyXG4gIH1cclxuICB2YXIgaGFzVHJhbnNmb3JtID1cclxuICAgIHR5cGUgPT09IFRSQU5TSVRJT04gJiZcclxuICAgIHRyYW5zZm9ybVJFLnRlc3Qoc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ1Byb3BlcnR5J10pO1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiB0eXBlLFxyXG4gICAgdGltZW91dDogdGltZW91dCxcclxuICAgIHByb3BDb3VudDogcHJvcENvdW50LFxyXG4gICAgaGFzVHJhbnNmb3JtOiBoYXNUcmFuc2Zvcm1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRpbWVvdXQgKGRlbGF5cywgZHVyYXRpb25zKSB7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICB3aGlsZSAoZGVsYXlzLmxlbmd0aCA8IGR1cmF0aW9ucy5sZW5ndGgpIHtcclxuICAgIGRlbGF5cyA9IGRlbGF5cy5jb25jYXQoZGVsYXlzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBkdXJhdGlvbnMubWFwKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICByZXR1cm4gdG9NcyhkKSArIHRvTXMoZGVsYXlzW2ldKVxyXG4gIH0pKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b01zIChzKSB7XHJcbiAgcmV0dXJuIE51bWJlcihzLnNsaWNlKDAsIC0xKSkgKiAxMDAwXHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gZW50ZXIgKHZub2RlLCB0b2dnbGVEaXNwbGF5KSB7XHJcbiAgdmFyIGVsID0gdm5vZGUuZWxtO1xyXG5cclxuICAvLyBjYWxsIGxlYXZlIGNhbGxiYWNrIG5vd1xyXG4gIGlmIChlbC5fbGVhdmVDYikge1xyXG4gICAgZWwuX2xlYXZlQ2IuY2FuY2VsbGVkID0gdHJ1ZTtcclxuICAgIGVsLl9sZWF2ZUNiKCk7XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YSA9IHJlc29sdmVUcmFuc2l0aW9uKHZub2RlLmRhdGEudHJhbnNpdGlvbik7XHJcbiAgaWYgKCFkYXRhKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmIChlbC5fZW50ZXJDYiB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICB2YXIgY3NzID0gZGF0YS5jc3M7XHJcbiAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XHJcbiAgdmFyIGVudGVyQ2xhc3MgPSBkYXRhLmVudGVyQ2xhc3M7XHJcbiAgdmFyIGVudGVyVG9DbGFzcyA9IGRhdGEuZW50ZXJUb0NsYXNzO1xyXG4gIHZhciBlbnRlckFjdGl2ZUNsYXNzID0gZGF0YS5lbnRlckFjdGl2ZUNsYXNzO1xyXG4gIHZhciBhcHBlYXJDbGFzcyA9IGRhdGEuYXBwZWFyQ2xhc3M7XHJcbiAgdmFyIGFwcGVhclRvQ2xhc3MgPSBkYXRhLmFwcGVhclRvQ2xhc3M7XHJcbiAgdmFyIGFwcGVhckFjdGl2ZUNsYXNzID0gZGF0YS5hcHBlYXJBY3RpdmVDbGFzcztcclxuICB2YXIgYmVmb3JlRW50ZXIgPSBkYXRhLmJlZm9yZUVudGVyO1xyXG4gIHZhciBlbnRlciA9IGRhdGEuZW50ZXI7XHJcbiAgdmFyIGFmdGVyRW50ZXIgPSBkYXRhLmFmdGVyRW50ZXI7XHJcbiAgdmFyIGVudGVyQ2FuY2VsbGVkID0gZGF0YS5lbnRlckNhbmNlbGxlZDtcclxuICB2YXIgYmVmb3JlQXBwZWFyID0gZGF0YS5iZWZvcmVBcHBlYXI7XHJcbiAgdmFyIGFwcGVhciA9IGRhdGEuYXBwZWFyO1xyXG4gIHZhciBhZnRlckFwcGVhciA9IGRhdGEuYWZ0ZXJBcHBlYXI7XHJcbiAgdmFyIGFwcGVhckNhbmNlbGxlZCA9IGRhdGEuYXBwZWFyQ2FuY2VsbGVkO1xyXG5cclxuICAvLyBhY3RpdmVJbnN0YW5jZSB3aWxsIGFsd2F5cyBiZSB0aGUgPHRyYW5zaXRpb24+IGNvbXBvbmVudCBtYW5hZ2luZyB0aGlzXHJcbiAgLy8gdHJhbnNpdGlvbi4gT25lIGVkZ2UgY2FzZSB0byBjaGVjayBpcyB3aGVuIHRoZSA8dHJhbnNpdGlvbj4gaXMgcGxhY2VkXHJcbiAgLy8gYXMgdGhlIHJvb3Qgbm9kZSBvZiBhIGNoaWxkIGNvbXBvbmVudC4gSW4gdGhhdCBjYXNlIHdlIG5lZWQgdG8gY2hlY2tcclxuICAvLyA8dHJhbnNpdGlvbj4ncyBwYXJlbnQgZm9yIGFwcGVhciBjaGVjay5cclxuICB2YXIgY29udGV4dCA9IGFjdGl2ZUluc3RhbmNlO1xyXG4gIHZhciB0cmFuc2l0aW9uTm9kZSA9IGFjdGl2ZUluc3RhbmNlLiR2bm9kZTtcclxuICB3aGlsZSAodHJhbnNpdGlvbk5vZGUgJiYgdHJhbnNpdGlvbk5vZGUucGFyZW50KSB7XHJcbiAgICB0cmFuc2l0aW9uTm9kZSA9IHRyYW5zaXRpb25Ob2RlLnBhcmVudDtcclxuICAgIGNvbnRleHQgPSB0cmFuc2l0aW9uTm9kZS5jb250ZXh0O1xyXG4gIH1cclxuXHJcbiAgdmFyIGlzQXBwZWFyID0gIWNvbnRleHQuX2lzTW91bnRlZCB8fCAhdm5vZGUuaXNSb290SW5zZXJ0O1xyXG5cclxuICBpZiAoaXNBcHBlYXIgJiYgIWFwcGVhciAmJiBhcHBlYXIgIT09ICcnKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIHZhciBzdGFydENsYXNzID0gaXNBcHBlYXIgPyBhcHBlYXJDbGFzcyA6IGVudGVyQ2xhc3M7XHJcbiAgdmFyIGFjdGl2ZUNsYXNzID0gaXNBcHBlYXIgPyBhcHBlYXJBY3RpdmVDbGFzcyA6IGVudGVyQWN0aXZlQ2xhc3M7XHJcbiAgdmFyIHRvQ2xhc3MgPSBpc0FwcGVhciA/IGFwcGVhclRvQ2xhc3MgOiBlbnRlclRvQ2xhc3M7XHJcbiAgdmFyIGJlZm9yZUVudGVySG9vayA9IGlzQXBwZWFyID8gKGJlZm9yZUFwcGVhciB8fCBiZWZvcmVFbnRlcikgOiBiZWZvcmVFbnRlcjtcclxuICB2YXIgZW50ZXJIb29rID0gaXNBcHBlYXIgPyAodHlwZW9mIGFwcGVhciA9PT0gJ2Z1bmN0aW9uJyA/IGFwcGVhciA6IGVudGVyKSA6IGVudGVyO1xyXG4gIHZhciBhZnRlckVudGVySG9vayA9IGlzQXBwZWFyID8gKGFmdGVyQXBwZWFyIHx8IGFmdGVyRW50ZXIpIDogYWZ0ZXJFbnRlcjtcclxuICB2YXIgZW50ZXJDYW5jZWxsZWRIb29rID0gaXNBcHBlYXIgPyAoYXBwZWFyQ2FuY2VsbGVkIHx8IGVudGVyQ2FuY2VsbGVkKSA6IGVudGVyQ2FuY2VsbGVkO1xyXG5cclxuICB2YXIgZXhwZWN0c0NTUyA9IGNzcyAhPT0gZmFsc2UgJiYgIWlzSUU5O1xyXG4gIHZhciB1c2VyV2FudHNDb250cm9sID1cclxuICAgIGVudGVySG9vayAmJlxyXG4gICAgLy8gZW50ZXJIb29rIG1heSBiZSBhIGJvdW5kIG1ldGhvZCB3aGljaCBleHBvc2VzXHJcbiAgICAvLyB0aGUgbGVuZ3RoIG9mIG9yaWdpbmFsIGZuIGFzIF9sZW5ndGhcclxuICAgIChlbnRlckhvb2suX2xlbmd0aCB8fCBlbnRlckhvb2subGVuZ3RoKSA+IDE7XHJcblxyXG4gIHZhciBjYiA9IGVsLl9lbnRlckNiID0gb25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIHRvQ2xhc3MpO1xyXG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGFjdGl2ZUNsYXNzKTtcclxuICAgIH1cclxuICAgIGlmIChjYi5jYW5jZWxsZWQpIHtcclxuICAgICAgaWYgKGV4cGVjdHNDU1MpIHtcclxuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIHN0YXJ0Q2xhc3MpO1xyXG4gICAgICB9XHJcbiAgICAgIGVudGVyQ2FuY2VsbGVkSG9vayAmJiBlbnRlckNhbmNlbGxlZEhvb2soZWwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWZ0ZXJFbnRlckhvb2sgJiYgYWZ0ZXJFbnRlckhvb2soZWwpO1xyXG4gICAgfVxyXG4gICAgZWwuX2VudGVyQ2IgPSBudWxsO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIXZub2RlLmRhdGEuc2hvdykge1xyXG4gICAgLy8gcmVtb3ZlIHBlbmRpbmcgbGVhdmUgZWxlbWVudCBvbiBlbnRlciBieSBpbmplY3RpbmcgYW4gaW5zZXJ0IGhvb2tcclxuICAgIG1lcmdlVk5vZGVIb29rKHZub2RlLmRhdGEuaG9vayB8fCAodm5vZGUuZGF0YS5ob29rID0ge30pLCAnaW5zZXJ0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcclxuICAgICAgdmFyIHBlbmRpbmdOb2RlID0gcGFyZW50ICYmIHBhcmVudC5fcGVuZGluZyAmJiBwYXJlbnQuX3BlbmRpbmdbdm5vZGUua2V5XTtcclxuICAgICAgaWYgKHBlbmRpbmdOb2RlICYmXHJcbiAgICAgICAgICBwZW5kaW5nTm9kZS50YWcgPT09IHZub2RlLnRhZyAmJlxyXG4gICAgICAgICAgcGVuZGluZ05vZGUuZWxtLl9sZWF2ZUNiKSB7XHJcbiAgICAgICAgcGVuZGluZ05vZGUuZWxtLl9sZWF2ZUNiKCk7XHJcbiAgICAgIH1cclxuICAgICAgZW50ZXJIb29rICYmIGVudGVySG9vayhlbCwgY2IpO1xyXG4gICAgfSwgJ3RyYW5zaXRpb24taW5zZXJ0Jyk7XHJcbiAgfVxyXG5cclxuICAvLyBzdGFydCBlbnRlciB0cmFuc2l0aW9uXHJcbiAgYmVmb3JlRW50ZXJIb29rICYmIGJlZm9yZUVudGVySG9vayhlbCk7XHJcbiAgaWYgKGV4cGVjdHNDU1MpIHtcclxuICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgc3RhcnRDbGFzcyk7XHJcbiAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGFjdGl2ZUNsYXNzKTtcclxuICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgdG9DbGFzcyk7XHJcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgc3RhcnRDbGFzcyk7XHJcbiAgICAgIGlmICghY2IuY2FuY2VsbGVkICYmICF1c2VyV2FudHNDb250cm9sKSB7XHJcbiAgICAgICAgd2hlblRyYW5zaXRpb25FbmRzKGVsLCB0eXBlLCBjYik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZub2RlLmRhdGEuc2hvdykge1xyXG4gICAgdG9nZ2xlRGlzcGxheSAmJiB0b2dnbGVEaXNwbGF5KCk7XHJcbiAgICBlbnRlckhvb2sgJiYgZW50ZXJIb29rKGVsLCBjYik7XHJcbiAgfVxyXG5cclxuICBpZiAoIWV4cGVjdHNDU1MgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcclxuICAgIGNiKCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZWF2ZSAodm5vZGUsIHJtKSB7XHJcbiAgdmFyIGVsID0gdm5vZGUuZWxtO1xyXG5cclxuICAvLyBjYWxsIGVudGVyIGNhbGxiYWNrIG5vd1xyXG4gIGlmIChlbC5fZW50ZXJDYikge1xyXG4gICAgZWwuX2VudGVyQ2IuY2FuY2VsbGVkID0gdHJ1ZTtcclxuICAgIGVsLl9lbnRlckNiKCk7XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YSA9IHJlc29sdmVUcmFuc2l0aW9uKHZub2RlLmRhdGEudHJhbnNpdGlvbik7XHJcbiAgaWYgKCFkYXRhKSB7XHJcbiAgICByZXR1cm4gcm0oKVxyXG4gIH1cclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKGVsLl9sZWF2ZUNiIHx8IGVsLm5vZGVUeXBlICE9PSAxKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIHZhciBjc3MgPSBkYXRhLmNzcztcclxuICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcclxuICB2YXIgbGVhdmVDbGFzcyA9IGRhdGEubGVhdmVDbGFzcztcclxuICB2YXIgbGVhdmVUb0NsYXNzID0gZGF0YS5sZWF2ZVRvQ2xhc3M7XHJcbiAgdmFyIGxlYXZlQWN0aXZlQ2xhc3MgPSBkYXRhLmxlYXZlQWN0aXZlQ2xhc3M7XHJcbiAgdmFyIGJlZm9yZUxlYXZlID0gZGF0YS5iZWZvcmVMZWF2ZTtcclxuICB2YXIgbGVhdmUgPSBkYXRhLmxlYXZlO1xyXG4gIHZhciBhZnRlckxlYXZlID0gZGF0YS5hZnRlckxlYXZlO1xyXG4gIHZhciBsZWF2ZUNhbmNlbGxlZCA9IGRhdGEubGVhdmVDYW5jZWxsZWQ7XHJcbiAgdmFyIGRlbGF5TGVhdmUgPSBkYXRhLmRlbGF5TGVhdmU7XHJcblxyXG4gIHZhciBleHBlY3RzQ1NTID0gY3NzICE9PSBmYWxzZSAmJiAhaXNJRTk7XHJcbiAgdmFyIHVzZXJXYW50c0NvbnRyb2wgPVxyXG4gICAgbGVhdmUgJiZcclxuICAgIC8vIGxlYXZlIGhvb2sgbWF5IGJlIGEgYm91bmQgbWV0aG9kIHdoaWNoIGV4cG9zZXNcclxuICAgIC8vIHRoZSBsZW5ndGggb2Ygb3JpZ2luYWwgZm4gYXMgX2xlbmd0aFxyXG4gICAgKGxlYXZlLl9sZW5ndGggfHwgbGVhdmUubGVuZ3RoKSA+IDE7XHJcblxyXG4gIHZhciBjYiA9IGVsLl9sZWF2ZUNiID0gb25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlLl9wZW5kaW5nKSB7XHJcbiAgICAgIGVsLnBhcmVudE5vZGUuX3BlbmRpbmdbdm5vZGUua2V5XSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAoZXhwZWN0c0NTUykge1xyXG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlVG9DbGFzcyk7XHJcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVBY3RpdmVDbGFzcyk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2IuY2FuY2VsbGVkKSB7XHJcbiAgICAgIGlmIChleHBlY3RzQ1NTKSB7XHJcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUNsYXNzKTtcclxuICAgICAgfVxyXG4gICAgICBsZWF2ZUNhbmNlbGxlZCAmJiBsZWF2ZUNhbmNlbGxlZChlbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBybSgpO1xyXG4gICAgICBhZnRlckxlYXZlICYmIGFmdGVyTGVhdmUoZWwpO1xyXG4gICAgfVxyXG4gICAgZWwuX2xlYXZlQ2IgPSBudWxsO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoZGVsYXlMZWF2ZSkge1xyXG4gICAgZGVsYXlMZWF2ZShwZXJmb3JtTGVhdmUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwZXJmb3JtTGVhdmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MZWF2ZSAoKSB7XHJcbiAgICAvLyB0aGUgZGVsYXllZCBsZWF2ZSBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXHJcbiAgICBpZiAoY2IuY2FuY2VsbGVkKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy8gcmVjb3JkIGxlYXZpbmcgZWxlbWVudFxyXG4gICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcclxuICAgICAgKGVsLnBhcmVudE5vZGUuX3BlbmRpbmcgfHwgKGVsLnBhcmVudE5vZGUuX3BlbmRpbmcgPSB7fSkpW3Zub2RlLmtleV0gPSB2bm9kZTtcclxuICAgIH1cclxuICAgIGJlZm9yZUxlYXZlICYmIGJlZm9yZUxlYXZlKGVsKTtcclxuICAgIGlmIChleHBlY3RzQ1NTKSB7XHJcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVDbGFzcyk7XHJcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVBY3RpdmVDbGFzcyk7XHJcbiAgICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZVRvQ2xhc3MpO1xyXG4gICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFjYi5jYW5jZWxsZWQgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcclxuICAgICAgICAgIHdoZW5UcmFuc2l0aW9uRW5kcyhlbCwgdHlwZSwgY2IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsZWF2ZSAmJiBsZWF2ZShlbCwgY2IpO1xyXG4gICAgaWYgKCFleHBlY3RzQ1NTICYmICF1c2VyV2FudHNDb250cm9sKSB7XHJcbiAgICAgIGNiKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlVHJhbnNpdGlvbiAoZGVmJCQxKSB7XHJcbiAgaWYgKCFkZWYkJDEpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmICh0eXBlb2YgZGVmJCQxID09PSAnb2JqZWN0Jykge1xyXG4gICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgaWYgKGRlZiQkMS5jc3MgIT09IGZhbHNlKSB7XHJcbiAgICAgIGV4dGVuZChyZXMsIGF1dG9Dc3NUcmFuc2l0aW9uKGRlZiQkMS5uYW1lIHx8ICd2JykpO1xyXG4gICAgfVxyXG4gICAgZXh0ZW5kKHJlcywgZGVmJCQxKTtcclxuICAgIHJldHVybiByZXNcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWYkJDEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gYXV0b0Nzc1RyYW5zaXRpb24oZGVmJCQxKVxyXG4gIH1cclxufVxyXG5cclxudmFyIGF1dG9Dc3NUcmFuc2l0aW9uID0gY2FjaGVkKGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudGVyQ2xhc3M6IChuYW1lICsgXCItZW50ZXJcIiksXHJcbiAgICBsZWF2ZUNsYXNzOiAobmFtZSArIFwiLWxlYXZlXCIpLFxyXG4gICAgYXBwZWFyQ2xhc3M6IChuYW1lICsgXCItZW50ZXJcIiksXHJcbiAgICBlbnRlclRvQ2xhc3M6IChuYW1lICsgXCItZW50ZXItdG9cIiksXHJcbiAgICBsZWF2ZVRvQ2xhc3M6IChuYW1lICsgXCItbGVhdmUtdG9cIiksXHJcbiAgICBhcHBlYXJUb0NsYXNzOiAobmFtZSArIFwiLWVudGVyLXRvXCIpLFxyXG4gICAgZW50ZXJBY3RpdmVDbGFzczogKG5hbWUgKyBcIi1lbnRlci1hY3RpdmVcIiksXHJcbiAgICBsZWF2ZUFjdGl2ZUNsYXNzOiAobmFtZSArIFwiLWxlYXZlLWFjdGl2ZVwiKSxcclxuICAgIGFwcGVhckFjdGl2ZUNsYXNzOiAobmFtZSArIFwiLWVudGVyLWFjdGl2ZVwiKVxyXG4gIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBvbmNlIChmbikge1xyXG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFjYWxsZWQpIHtcclxuICAgICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgICAgZm4oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9lbnRlciAoXywgdm5vZGUpIHtcclxuICBpZiAoIXZub2RlLmRhdGEuc2hvdykge1xyXG4gICAgZW50ZXIodm5vZGUpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIHRyYW5zaXRpb24gPSBpbkJyb3dzZXIgPyB7XHJcbiAgY3JlYXRlOiBfZW50ZXIsXHJcbiAgYWN0aXZhdGU6IF9lbnRlcixcclxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSAodm5vZGUsIHJtKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcclxuICAgICAgbGVhdmUodm5vZGUsIHJtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJtKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IDoge307XHJcblxyXG52YXIgcGxhdGZvcm1Nb2R1bGVzID0gW1xyXG4gIGF0dHJzLFxyXG4gIGtsYXNzLFxyXG4gIGV2ZW50cyxcclxuICBkb21Qcm9wcyxcclxuICBzdHlsZSxcclxuICB0cmFuc2l0aW9uXHJcbl07XHJcblxyXG4vKiAgKi9cclxuXHJcbi8vIHRoZSBkaXJlY3RpdmUgbW9kdWxlIHNob3VsZCBiZSBhcHBsaWVkIGxhc3QsIGFmdGVyIGFsbFxyXG4vLyBidWlsdC1pbiBtb2R1bGVzIGhhdmUgYmVlbiBhcHBsaWVkLlxyXG52YXIgbW9kdWxlcyA9IHBsYXRmb3JtTW9kdWxlcy5jb25jYXQoYmFzZU1vZHVsZXMpO1xyXG5cclxudmFyIHBhdGNoJDEgPSBjcmVhdGVQYXRjaEZ1bmN0aW9uKHsgbm9kZU9wczogbm9kZU9wcywgbW9kdWxlczogbW9kdWxlcyB9KTtcclxuXHJcbi8qKlxyXG4gKiBOb3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgbGlrZSBhdHRhY2hpbmdcclxuICogcHJvcGVydGllcyB0byBFbGVtZW50cy5cclxuICovXHJcblxyXG52YXIgbW9kZWxhYmxlVGFnUkUgPSAvXmlucHV0fHNlbGVjdHx0ZXh0YXJlYXx2dWUtY29tcG9uZW50LVswLTldKygtWzAtOWEtekEtWl8tXSopPyQvO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbmlmIChpc0lFOSkge1xyXG4gIC8vIGh0dHA6Ly93d3cubWF0dHM0MTEuY29tL3Bvc3QvaW50ZXJuZXQtZXhwbG9yZXItOS1vbmlucHV0L1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdGlvbmNoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICBpZiAoZWwgJiYgZWwudm1vZGVsKSB7XHJcbiAgICAgIHRyaWdnZXIoZWwsICdpbnB1dCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG52YXIgbW9kZWwgPSB7XHJcbiAgaW5zZXJ0ZWQ6IGZ1bmN0aW9uIGluc2VydGVkIChlbCwgYmluZGluZywgdm5vZGUpIHtcclxuICAgIHtcclxuICAgICAgaWYgKCFtb2RlbGFibGVUYWdSRS50ZXN0KHZub2RlLnRhZykpIHtcclxuICAgICAgICB3YXJuKFxyXG4gICAgICAgICAgXCJ2LW1vZGVsIGlzIG5vdCBzdXBwb3J0ZWQgb24gZWxlbWVudCB0eXBlOiA8XCIgKyAodm5vZGUudGFnKSArIFwiPi4gXCIgK1xyXG4gICAgICAgICAgJ0lmIHlvdSBhcmUgd29ya2luZyB3aXRoIGNvbnRlbnRlZGl0YWJsZSwgaXRcXCdzIHJlY29tbWVuZGVkIHRvICcgK1xyXG4gICAgICAgICAgJ3dyYXAgYSBsaWJyYXJ5IGRlZGljYXRlZCBmb3IgdGhhdCBwdXJwb3NlIGluc2lkZSBhIGN1c3RvbSBjb21wb25lbnQuJyxcclxuICAgICAgICAgIHZub2RlLmNvbnRleHRcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodm5vZGUudGFnID09PSAnc2VsZWN0Jykge1xyXG4gICAgICB2YXIgY2IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWQoZWwsIGJpbmRpbmcsIHZub2RlLmNvbnRleHQpO1xyXG4gICAgICB9O1xyXG4gICAgICBjYigpO1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGlzSUUgfHwgaXNFZGdlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChjYiwgMCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodm5vZGUudGFnID09PSAndGV4dGFyZWEnIHx8IGVsLnR5cGUgPT09ICd0ZXh0Jykge1xyXG4gICAgICBlbC5fdk1vZGlmaWVycyA9IGJpbmRpbmcubW9kaWZpZXJzO1xyXG4gICAgICBpZiAoIWJpbmRpbmcubW9kaWZpZXJzLmxhenkpIHtcclxuICAgICAgICBpZiAoIWlzQW5kcm9pZCkge1xyXG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIG9uQ29tcG9zaXRpb25TdGFydCk7XHJcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIG9uQ29tcG9zaXRpb25FbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAoaXNJRTkpIHtcclxuICAgICAgICAgIGVsLnZtb2RlbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wb25lbnRVcGRhdGVkOiBmdW5jdGlvbiBjb21wb25lbnRVcGRhdGVkIChlbCwgYmluZGluZywgdm5vZGUpIHtcclxuICAgIGlmICh2bm9kZS50YWcgPT09ICdzZWxlY3QnKSB7XHJcbiAgICAgIHNldFNlbGVjdGVkKGVsLCBiaW5kaW5nLCB2bm9kZS5jb250ZXh0KTtcclxuICAgICAgLy8gaW4gY2FzZSB0aGUgb3B0aW9ucyByZW5kZXJlZCBieSB2LWZvciBoYXZlIGNoYW5nZWQsXHJcbiAgICAgIC8vIGl0J3MgcG9zc2libGUgdGhhdCB0aGUgdmFsdWUgaXMgb3V0LW9mLXN5bmMgd2l0aCB0aGUgcmVuZGVyZWQgb3B0aW9ucy5cclxuICAgICAgLy8gZGV0ZWN0IHN1Y2ggY2FzZXMgYW5kIGZpbHRlciBvdXQgdmFsdWVzIHRoYXQgbm8gbG9uZ2VyIGhhcyBhIG1hdGNoaW5nXHJcbiAgICAgIC8vIG9wdGlvbiBpbiB0aGUgRE9NLlxyXG4gICAgICB2YXIgbmVlZFJlc2V0ID0gZWwubXVsdGlwbGVcclxuICAgICAgICA/IGJpbmRpbmcudmFsdWUuc29tZShmdW5jdGlvbiAodikgeyByZXR1cm4gaGFzTm9NYXRjaGluZ09wdGlvbih2LCBlbC5vcHRpb25zKTsgfSlcclxuICAgICAgICA6IGJpbmRpbmcudmFsdWUgIT09IGJpbmRpbmcub2xkVmFsdWUgJiYgaGFzTm9NYXRjaGluZ09wdGlvbihiaW5kaW5nLnZhbHVlLCBlbC5vcHRpb25zKTtcclxuICAgICAgaWYgKG5lZWRSZXNldCkge1xyXG4gICAgICAgIHRyaWdnZXIoZWwsICdjaGFuZ2UnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHNldFNlbGVjdGVkIChlbCwgYmluZGluZywgdm0pIHtcclxuICB2YXIgdmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xyXG4gIHZhciBpc011bHRpcGxlID0gZWwubXVsdGlwbGU7XHJcbiAgaWYgKGlzTXVsdGlwbGUgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxyXG4gICAgICBcIjxzZWxlY3QgbXVsdGlwbGUgdi1tb2RlbD1cXFwiXCIgKyAoYmluZGluZy5leHByZXNzaW9uKSArIFwiXFxcIj4gXCIgK1xyXG4gICAgICBcImV4cGVjdHMgYW4gQXJyYXkgdmFsdWUgZm9yIGl0cyBiaW5kaW5nLCBidXQgZ290IFwiICsgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpKSxcclxuICAgICAgdm1cclxuICAgICk7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdmFyIHNlbGVjdGVkLCBvcHRpb247XHJcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBlbC5vcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgb3B0aW9uID0gZWwub3B0aW9uc1tpXTtcclxuICAgIGlmIChpc011bHRpcGxlKSB7XHJcbiAgICAgIHNlbGVjdGVkID0gbG9vc2VJbmRleE9mKHZhbHVlLCBnZXRWYWx1ZShvcHRpb24pKSA+IC0xO1xyXG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkICE9PSBzZWxlY3RlZCkge1xyXG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobG9vc2VFcXVhbChnZXRWYWx1ZShvcHRpb24pLCB2YWx1ZSkpIHtcclxuICAgICAgICBpZiAoZWwuc2VsZWN0ZWRJbmRleCAhPT0gaSkge1xyXG4gICAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICghaXNNdWx0aXBsZSkge1xyXG4gICAgZWwuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFzTm9NYXRjaGluZ09wdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcclxuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBpZiAobG9vc2VFcXVhbChnZXRWYWx1ZShvcHRpb25zW2ldKSwgdmFsdWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZSAob3B0aW9uKSB7XHJcbiAgcmV0dXJuICdfdmFsdWUnIGluIG9wdGlvblxyXG4gICAgPyBvcHRpb24uX3ZhbHVlXHJcbiAgICA6IG9wdGlvbi52YWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uU3RhcnQgKGUpIHtcclxuICBlLnRhcmdldC5jb21wb3NpbmcgPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uRW5kIChlKSB7XHJcbiAgZS50YXJnZXQuY29tcG9zaW5nID0gZmFsc2U7XHJcbiAgdHJpZ2dlcihlLnRhcmdldCwgJ2lucHV0Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyaWdnZXIgKGVsLCB0eXBlKSB7XHJcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xyXG4gIGUuaW5pdEV2ZW50KHR5cGUsIHRydWUsIHRydWUpO1xyXG4gIGVsLmRpc3BhdGNoRXZlbnQoZSk7XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuLy8gcmVjdXJzaXZlbHkgc2VhcmNoIGZvciBwb3NzaWJsZSB0cmFuc2l0aW9uIGRlZmluZWQgaW5zaWRlIHRoZSBjb21wb25lbnQgcm9vdFxyXG5mdW5jdGlvbiBsb2NhdGVOb2RlICh2bm9kZSkge1xyXG4gIHJldHVybiB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSAmJiAoIXZub2RlLmRhdGEgfHwgIXZub2RlLmRhdGEudHJhbnNpdGlvbilcclxuICAgID8gbG9jYXRlTm9kZSh2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGUpXHJcbiAgICA6IHZub2RlXHJcbn1cclxuXHJcbnZhciBzaG93ID0ge1xyXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQgKGVsLCByZWYsIHZub2RlKSB7XHJcbiAgICB2YXIgdmFsdWUgPSByZWYudmFsdWU7XHJcblxyXG4gICAgdm5vZGUgPSBsb2NhdGVOb2RlKHZub2RlKTtcclxuICAgIHZhciB0cmFuc2l0aW9uID0gdm5vZGUuZGF0YSAmJiB2bm9kZS5kYXRhLnRyYW5zaXRpb247XHJcbiAgICB2YXIgb3JpZ2luYWxEaXNwbGF5ID0gZWwuX192T3JpZ2luYWxEaXNwbGF5ID1cclxuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnID8gJycgOiBlbC5zdHlsZS5kaXNwbGF5O1xyXG4gICAgaWYgKHZhbHVlICYmIHRyYW5zaXRpb24gJiYgIWlzSUU5KSB7XHJcbiAgICAgIHZub2RlLmRhdGEuc2hvdyA9IHRydWU7XHJcbiAgICAgIGVudGVyKHZub2RlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG9yaWdpbmFsRGlzcGxheTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyBvcmlnaW5hbERpc3BsYXkgOiAnbm9uZSc7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUgKGVsLCByZWYsIHZub2RlKSB7XHJcbiAgICB2YXIgdmFsdWUgPSByZWYudmFsdWU7XHJcbiAgICB2YXIgb2xkVmFsdWUgPSByZWYub2xkVmFsdWU7XHJcblxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAodmFsdWUgPT09IG9sZFZhbHVlKSB7IHJldHVybiB9XHJcbiAgICB2bm9kZSA9IGxvY2F0ZU5vZGUodm5vZGUpO1xyXG4gICAgdmFyIHRyYW5zaXRpb24gPSB2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEudHJhbnNpdGlvbjtcclxuICAgIGlmICh0cmFuc2l0aW9uICYmICFpc0lFOSkge1xyXG4gICAgICB2bm9kZS5kYXRhLnNob3cgPSB0cnVlO1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICBlbnRlcih2bm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGVsLl9fdk9yaWdpbmFsRGlzcGxheTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZWF2ZSh2bm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gZWwuX192T3JpZ2luYWxEaXNwbGF5IDogJ25vbmUnO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kIChcclxuICAgIGVsLFxyXG4gICAgYmluZGluZyxcclxuICAgIHZub2RlLFxyXG4gICAgb2xkVm5vZGUsXHJcbiAgICBpc0Rlc3Ryb3lcclxuICApIHtcclxuICAgIGlmICghaXNEZXN0cm95KSB7XHJcbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBlbC5fX3ZPcmlnaW5hbERpc3BsYXk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHBsYXRmb3JtRGlyZWN0aXZlcyA9IHtcclxuICBtb2RlbDogbW9kZWwsXHJcbiAgc2hvdzogc2hvd1xyXG59O1xyXG5cclxuLyogICovXHJcblxyXG4vLyBQcm92aWRlcyB0cmFuc2l0aW9uIHN1cHBvcnQgZm9yIGEgc2luZ2xlIGVsZW1lbnQvY29tcG9uZW50LlxyXG4vLyBzdXBwb3J0cyB0cmFuc2l0aW9uIG1vZGUgKG91dC1pbiAvIGluLW91dClcclxuXHJcbnZhciB0cmFuc2l0aW9uUHJvcHMgPSB7XHJcbiAgbmFtZTogU3RyaW5nLFxyXG4gIGFwcGVhcjogQm9vbGVhbixcclxuICBjc3M6IEJvb2xlYW4sXHJcbiAgbW9kZTogU3RyaW5nLFxyXG4gIHR5cGU6IFN0cmluZyxcclxuICBlbnRlckNsYXNzOiBTdHJpbmcsXHJcbiAgbGVhdmVDbGFzczogU3RyaW5nLFxyXG4gIGVudGVyVG9DbGFzczogU3RyaW5nLFxyXG4gIGxlYXZlVG9DbGFzczogU3RyaW5nLFxyXG4gIGVudGVyQWN0aXZlQ2xhc3M6IFN0cmluZyxcclxuICBsZWF2ZUFjdGl2ZUNsYXNzOiBTdHJpbmcsXHJcbiAgYXBwZWFyQ2xhc3M6IFN0cmluZyxcclxuICBhcHBlYXJBY3RpdmVDbGFzczogU3RyaW5nLFxyXG4gIGFwcGVhclRvQ2xhc3M6IFN0cmluZ1xyXG59O1xyXG5cclxuLy8gaW4gY2FzZSB0aGUgY2hpbGQgaXMgYWxzbyBhbiBhYnN0cmFjdCBjb21wb25lbnQsIGUuZy4gPGtlZXAtYWxpdmU+XHJcbi8vIHdlIHdhbnQgdG8gcmVjdXJzaXZlbHkgcmV0cmlldmUgdGhlIHJlYWwgY29tcG9uZW50IHRvIGJlIHJlbmRlcmVkXHJcbmZ1bmN0aW9uIGdldFJlYWxDaGlsZCAodm5vZGUpIHtcclxuICB2YXIgY29tcE9wdGlvbnMgPSB2bm9kZSAmJiB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xyXG4gIGlmIChjb21wT3B0aW9ucyAmJiBjb21wT3B0aW9ucy5DdG9yLm9wdGlvbnMuYWJzdHJhY3QpIHtcclxuICAgIHJldHVybiBnZXRSZWFsQ2hpbGQoZ2V0Rmlyc3RDb21wb25lbnRDaGlsZChjb21wT3B0aW9ucy5jaGlsZHJlbikpXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB2bm9kZVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZXh0cmFjdFRyYW5zaXRpb25EYXRhIChjb21wKSB7XHJcbiAgdmFyIGRhdGEgPSB7fTtcclxuICB2YXIgb3B0aW9ucyA9IGNvbXAuJG9wdGlvbnM7XHJcbiAgLy8gcHJvcHNcclxuICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucy5wcm9wc0RhdGEpIHtcclxuICAgIGRhdGFba2V5XSA9IGNvbXBba2V5XTtcclxuICB9XHJcbiAgLy8gZXZlbnRzLlxyXG4gIC8vIGV4dHJhY3QgbGlzdGVuZXJzIGFuZCBwYXNzIHRoZW0gZGlyZWN0bHkgdG8gdGhlIHRyYW5zaXRpb24gbWV0aG9kc1xyXG4gIHZhciBsaXN0ZW5lcnMgPSBvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XHJcbiAgZm9yICh2YXIga2V5JDEgaW4gbGlzdGVuZXJzKSB7XHJcbiAgICBkYXRhW2NhbWVsaXplKGtleSQxKV0gPSBsaXN0ZW5lcnNba2V5JDFdLmZuO1xyXG4gIH1cclxuICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGFjZWhvbGRlciAoaCwgcmF3Q2hpbGQpIHtcclxuICByZXR1cm4gL1xcZC1rZWVwLWFsaXZlJC8udGVzdChyYXdDaGlsZC50YWcpXHJcbiAgICA/IGgoJ2tlZXAtYWxpdmUnKVxyXG4gICAgOiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhc1BhcmVudFRyYW5zaXRpb24gKHZub2RlKSB7XHJcbiAgd2hpbGUgKCh2bm9kZSA9IHZub2RlLnBhcmVudCkpIHtcclxuICAgIGlmICh2bm9kZS5kYXRhLnRyYW5zaXRpb24pIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU2FtZUNoaWxkIChjaGlsZCwgb2xkQ2hpbGQpIHtcclxuICByZXR1cm4gb2xkQ2hpbGQua2V5ID09PSBjaGlsZC5rZXkgJiYgb2xkQ2hpbGQudGFnID09PSBjaGlsZC50YWdcclxufVxyXG5cclxudmFyIFRyYW5zaXRpb24gPSB7XHJcbiAgbmFtZTogJ3RyYW5zaXRpb24nLFxyXG4gIHByb3BzOiB0cmFuc2l0aW9uUHJvcHMsXHJcbiAgYWJzdHJhY3Q6IHRydWUsXHJcblxyXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyIChoKSB7XHJcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcclxuXHJcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0O1xyXG4gICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBmaWx0ZXIgb3V0IHRleHQgbm9kZXMgKHBvc3NpYmxlIHdoaXRlc3BhY2VzKVxyXG4gICAgY2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudGFnOyB9KTtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2FybiBtdWx0aXBsZSBlbGVtZW50c1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnPHRyYW5zaXRpb24+IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBzaW5nbGUgZWxlbWVudC4gVXNlICcgK1xyXG4gICAgICAgICc8dHJhbnNpdGlvbi1ncm91cD4gZm9yIGxpc3RzLicsXHJcbiAgICAgICAgdGhpcy4kcGFyZW50XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1vZGUgPSB0aGlzLm1vZGU7XHJcblxyXG4gICAgLy8gd2FybiBpbnZhbGlkIG1vZGVcclxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgICAgIG1vZGUgJiYgbW9kZSAhPT0gJ2luLW91dCcgJiYgbW9kZSAhPT0gJ291dC1pbicpIHtcclxuICAgICAgd2FybihcclxuICAgICAgICAnaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJyArIG1vZGUsXHJcbiAgICAgICAgdGhpcy4kcGFyZW50XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJhd0NoaWxkID0gY2hpbGRyZW5bMF07XHJcblxyXG4gICAgLy8gaWYgdGhpcyBpcyBhIGNvbXBvbmVudCByb290IG5vZGUgYW5kIHRoZSBjb21wb25lbnQnc1xyXG4gICAgLy8gcGFyZW50IGNvbnRhaW5lciBub2RlIGFsc28gaGFzIHRyYW5zaXRpb24sIHNraXAuXHJcbiAgICBpZiAoaGFzUGFyZW50VHJhbnNpdGlvbih0aGlzLiR2bm9kZSkpIHtcclxuICAgICAgcmV0dXJuIHJhd0NoaWxkXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXBwbHkgdHJhbnNpdGlvbiBkYXRhIHRvIGNoaWxkXHJcbiAgICAvLyB1c2UgZ2V0UmVhbENoaWxkKCkgdG8gaWdub3JlIGFic3RyYWN0IGNvbXBvbmVudHMgZS5nLiBrZWVwLWFsaXZlXHJcbiAgICB2YXIgY2hpbGQgPSBnZXRSZWFsQ2hpbGQocmF3Q2hpbGQpO1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIWNoaWxkKSB7XHJcbiAgICAgIHJldHVybiByYXdDaGlsZFxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9sZWF2aW5nKSB7XHJcbiAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbnN1cmUgYSBrZXkgdGhhdCBpcyB1bmlxdWUgdG8gdGhlIHZub2RlIHR5cGUgYW5kIHRvIHRoaXMgdHJhbnNpdGlvblxyXG4gICAgLy8gY29tcG9uZW50IGluc3RhbmNlLiBUaGlzIGtleSB3aWxsIGJlIHVzZWQgdG8gcmVtb3ZlIHBlbmRpbmcgbGVhdmluZyBub2Rlc1xyXG4gICAgLy8gZHVyaW5nIGVudGVyaW5nLlxyXG4gICAgdmFyIGlkID0gXCJfX3RyYW5zaXRpb24tXCIgKyAodGhpcy5fdWlkKSArIFwiLVwiO1xyXG4gICAgdmFyIGtleSA9IGNoaWxkLmtleSA9IGNoaWxkLmtleSA9PSBudWxsXHJcbiAgICAgID8gaWQgKyBjaGlsZC50YWdcclxuICAgICAgOiBpc1ByaW1pdGl2ZShjaGlsZC5rZXkpXHJcbiAgICAgICAgPyAoU3RyaW5nKGNoaWxkLmtleSkuaW5kZXhPZihpZCkgPT09IDAgPyBjaGlsZC5rZXkgOiBpZCArIGNoaWxkLmtleSlcclxuICAgICAgICA6IGNoaWxkLmtleTtcclxuICAgIHZhciBkYXRhID0gKGNoaWxkLmRhdGEgfHwgKGNoaWxkLmRhdGEgPSB7fSkpLnRyYW5zaXRpb24gPSBleHRyYWN0VHJhbnNpdGlvbkRhdGEodGhpcyk7XHJcbiAgICB2YXIgb2xkUmF3Q2hpbGQgPSB0aGlzLl92bm9kZTtcclxuICAgIHZhciBvbGRDaGlsZCA9IGdldFJlYWxDaGlsZChvbGRSYXdDaGlsZCk7XHJcblxyXG4gICAgLy8gbWFyayB2LXNob3dcclxuICAgIC8vIHNvIHRoYXQgdGhlIHRyYW5zaXRpb24gbW9kdWxlIGNhbiBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gdGhlIGRpcmVjdGl2ZVxyXG4gICAgaWYgKGNoaWxkLmRhdGEuZGlyZWN0aXZlcyAmJiBjaGlsZC5kYXRhLmRpcmVjdGl2ZXMuc29tZShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5uYW1lID09PSAnc2hvdyc7IH0pKSB7XHJcbiAgICAgIGNoaWxkLmRhdGEuc2hvdyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9sZENoaWxkICYmIG9sZENoaWxkLmRhdGEgJiYgIWlzU2FtZUNoaWxkKGNoaWxkLCBvbGRDaGlsZCkpIHtcclxuICAgICAgLy8gcmVwbGFjZSBvbGQgY2hpbGQgdHJhbnNpdGlvbiBkYXRhIHdpdGggZnJlc2ggb25lXHJcbiAgICAgIC8vIGltcG9ydGFudCBmb3IgZHluYW1pYyB0cmFuc2l0aW9ucyFcclxuICAgICAgdmFyIG9sZERhdGEgPSBvbGRDaGlsZCAmJiAob2xkQ2hpbGQuZGF0YS50cmFuc2l0aW9uID0gZXh0ZW5kKHt9LCBkYXRhKSk7XHJcbiAgICAgIC8vIGhhbmRsZSB0cmFuc2l0aW9uIG1vZGVcclxuICAgICAgaWYgKG1vZGUgPT09ICdvdXQtaW4nKSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHBsYWNlaG9sZGVyIG5vZGUgYW5kIHF1ZXVlIHVwZGF0ZSB3aGVuIGxlYXZlIGZpbmlzaGVzXHJcbiAgICAgICAgdGhpcy5fbGVhdmluZyA9IHRydWU7XHJcbiAgICAgICAgbWVyZ2VWTm9kZUhvb2sob2xkRGF0YSwgJ2FmdGVyTGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGlzJDEuX2xlYXZpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMkMS4kZm9yY2VVcGRhdGUoKTtcclxuICAgICAgICB9LCBrZXkpO1xyXG4gICAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcclxuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnaW4tb3V0Jykge1xyXG4gICAgICAgIHZhciBkZWxheWVkTGVhdmU7XHJcbiAgICAgICAgdmFyIHBlcmZvcm1MZWF2ZSA9IGZ1bmN0aW9uICgpIHsgZGVsYXllZExlYXZlKCk7IH07XHJcbiAgICAgICAgbWVyZ2VWTm9kZUhvb2soZGF0YSwgJ2FmdGVyRW50ZXInLCBwZXJmb3JtTGVhdmUsIGtleSk7XHJcbiAgICAgICAgbWVyZ2VWTm9kZUhvb2soZGF0YSwgJ2VudGVyQ2FuY2VsbGVkJywgcGVyZm9ybUxlYXZlLCBrZXkpO1xyXG4gICAgICAgIG1lcmdlVk5vZGVIb29rKG9sZERhdGEsICdkZWxheUxlYXZlJywgZnVuY3Rpb24gKGxlYXZlKSB7XHJcbiAgICAgICAgICBkZWxheWVkTGVhdmUgPSBsZWF2ZTtcclxuICAgICAgICB9LCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJhd0NoaWxkXHJcbiAgfVxyXG59O1xyXG5cclxuLyogICovXHJcblxyXG4vLyBQcm92aWRlcyB0cmFuc2l0aW9uIHN1cHBvcnQgZm9yIGxpc3QgaXRlbXMuXHJcbi8vIHN1cHBvcnRzIG1vdmUgdHJhbnNpdGlvbnMgdXNpbmcgdGhlIEZMSVAgdGVjaG5pcXVlLlxyXG5cclxuLy8gQmVjYXVzZSB0aGUgdmRvbSdzIGNoaWxkcmVuIHVwZGF0ZSBhbGdvcml0aG0gaXMgXCJ1bnN0YWJsZVwiIC0gaS5lLlxyXG4vLyBpdCBkb2Vzbid0IGd1YXJhbnRlZSB0aGUgcmVsYXRpdmUgcG9zaXRpb25pbmcgb2YgcmVtb3ZlZCBlbGVtZW50cyxcclxuLy8gd2UgZm9yY2UgdHJhbnNpdGlvbi1ncm91cCB0byB1cGRhdGUgaXRzIGNoaWxkcmVuIGludG8gdHdvIHBhc3NlczpcclxuLy8gaW4gdGhlIGZpcnN0IHBhc3MsIHdlIHJlbW92ZSBhbGwgbm9kZXMgdGhhdCBuZWVkIHRvIGJlIHJlbW92ZWQsXHJcbi8vIHRyaWdnZXJpbmcgdGhlaXIgbGVhdmluZyB0cmFuc2l0aW9uOyBpbiB0aGUgc2Vjb25kIHBhc3MsIHdlIGluc2VydC9tb3ZlXHJcbi8vIGludG8gdGhlIGZpbmFsIGRpc2lyZWQgc3RhdGUuIFRoaXMgd2F5IGluIHRoZSBzZWNvbmQgcGFzcyByZW1vdmVkXHJcbi8vIG5vZGVzIHdpbGwgcmVtYWluIHdoZXJlIHRoZXkgc2hvdWxkIGJlLlxyXG5cclxudmFyIHByb3BzID0gZXh0ZW5kKHtcclxuICB0YWc6IFN0cmluZyxcclxuICBtb3ZlQ2xhc3M6IFN0cmluZ1xyXG59LCB0cmFuc2l0aW9uUHJvcHMpO1xyXG5cclxuZGVsZXRlIHByb3BzLm1vZGU7XHJcblxyXG52YXIgVHJhbnNpdGlvbkdyb3VwID0ge1xyXG4gIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKGgpIHtcclxuICAgIHZhciB0YWcgPSB0aGlzLnRhZyB8fCB0aGlzLiR2bm9kZS5kYXRhLnRhZyB8fCAnc3Bhbic7XHJcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHZhciBwcmV2Q2hpbGRyZW4gPSB0aGlzLnByZXZDaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XHJcbiAgICB2YXIgcmF3Q2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdO1xyXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgdmFyIHRyYW5zaXRpb25EYXRhID0gZXh0cmFjdFRyYW5zaXRpb25EYXRhKHRoaXMpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSByYXdDaGlsZHJlbltpXTtcclxuICAgICAgaWYgKGMudGFnKSB7XHJcbiAgICAgICAgaWYgKGMua2V5ICE9IG51bGwgJiYgU3RyaW5nKGMua2V5KS5pbmRleE9mKCdfX3ZsaXN0JykgIT09IDApIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goYyk7XHJcbiAgICAgICAgICBtYXBbYy5rZXldID0gY1xyXG4gICAgICAgICAgOyhjLmRhdGEgfHwgKGMuZGF0YSA9IHt9KSkudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25EYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgb3B0cyA9IGMuY29tcG9uZW50T3B0aW9ucztcclxuICAgICAgICAgIHZhciBuYW1lID0gb3B0c1xyXG4gICAgICAgICAgICA/IChvcHRzLkN0b3Iub3B0aW9ucy5uYW1lIHx8IG9wdHMudGFnKVxyXG4gICAgICAgICAgICA6IGMudGFnO1xyXG4gICAgICAgICAgd2FybigoXCI8dHJhbnNpdGlvbi1ncm91cD4gY2hpbGRyZW4gbXVzdCBiZSBrZXllZDogPFwiICsgbmFtZSArIFwiPlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHByZXZDaGlsZHJlbikge1xyXG4gICAgICB2YXIga2VwdCA9IFtdO1xyXG4gICAgICB2YXIgcmVtb3ZlZCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpJDEgPSAwOyBpJDEgPCBwcmV2Q2hpbGRyZW4ubGVuZ3RoOyBpJDErKykge1xyXG4gICAgICAgIHZhciBjJDEgPSBwcmV2Q2hpbGRyZW5baSQxXTtcclxuICAgICAgICBjJDEuZGF0YS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkRhdGE7XHJcbiAgICAgICAgYyQxLmRhdGEucG9zID0gYyQxLmVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAobWFwW2MkMS5rZXldKSB7XHJcbiAgICAgICAgICBrZXB0LnB1c2goYyQxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVtb3ZlZC5wdXNoKGMkMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMua2VwdCA9IGgodGFnLCBudWxsLCBrZXB0KTtcclxuICAgICAgdGhpcy5yZW1vdmVkID0gcmVtb3ZlZDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaCh0YWcsIG51bGwsIGNoaWxkcmVuKVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gYmVmb3JlVXBkYXRlICgpIHtcclxuICAgIC8vIGZvcmNlIHJlbW92aW5nIHBhc3NcclxuICAgIHRoaXMuX19wYXRjaF9fKFxyXG4gICAgICB0aGlzLl92bm9kZSxcclxuICAgICAgdGhpcy5rZXB0LFxyXG4gICAgICBmYWxzZSwgLy8gaHlkcmF0aW5nXHJcbiAgICAgIHRydWUgLy8gcmVtb3ZlT25seSAoIWltcG9ydGFudCwgYXZvaWRzIHVubmVjZXNzYXJ5IG1vdmVzKVxyXG4gICAgKTtcclxuICAgIHRoaXMuX3Zub2RlID0gdGhpcy5rZXB0O1xyXG4gIH0sXHJcblxyXG4gIHVwZGF0ZWQ6IGZ1bmN0aW9uIHVwZGF0ZWQgKCkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcmV2Q2hpbGRyZW47XHJcbiAgICB2YXIgbW92ZUNsYXNzID0gdGhpcy5tb3ZlQ2xhc3MgfHwgKCh0aGlzLm5hbWUgfHwgJ3YnKSArICctbW92ZScpO1xyXG4gICAgaWYgKCFjaGlsZHJlbi5sZW5ndGggfHwgIXRoaXMuaGFzTW92ZShjaGlsZHJlblswXS5lbG0sIG1vdmVDbGFzcykpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2UgZGl2aWRlIHRoZSB3b3JrIGludG8gdGhyZWUgbG9vcHMgdG8gYXZvaWQgbWl4aW5nIERPTSByZWFkcyBhbmQgd3JpdGVzXHJcbiAgICAvLyBpbiBlYWNoIGl0ZXJhdGlvbiAtIHdoaWNoIGhlbHBzIHByZXZlbnQgbGF5b3V0IHRocmFzaGluZy5cclxuICAgIGNoaWxkcmVuLmZvckVhY2goY2FsbFBlbmRpbmdDYnMpO1xyXG4gICAgY2hpbGRyZW4uZm9yRWFjaChyZWNvcmRQb3NpdGlvbik7XHJcbiAgICBjaGlsZHJlbi5mb3JFYWNoKGFwcGx5VHJhbnNsYXRpb24pO1xyXG5cclxuICAgIC8vIGZvcmNlIHJlZmxvdyB0byBwdXQgZXZlcnl0aGluZyBpbiBwb3NpdGlvblxyXG4gICAgdmFyIGYgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodDsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG5cclxuICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcclxuICAgICAgaWYgKGMuZGF0YS5tb3ZlZCkge1xyXG4gICAgICAgIHZhciBlbCA9IGMuZWxtO1xyXG4gICAgICAgIHZhciBzID0gZWwuc3R5bGU7XHJcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xyXG4gICAgICAgIHMudHJhbnNmb3JtID0gcy5XZWJraXRUcmFuc2Zvcm0gPSBzLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcnO1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZEV2ZW50LCBlbC5fbW92ZUNiID0gZnVuY3Rpb24gY2IgKGUpIHtcclxuICAgICAgICAgIGlmICghZSB8fCAvdHJhbnNmb3JtJC8udGVzdChlLnByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kRXZlbnQsIGNiKTtcclxuICAgICAgICAgICAgZWwuX21vdmVDYiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbW92ZUNsYXNzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaGFzTW92ZTogZnVuY3Rpb24gaGFzTW92ZSAoZWwsIG1vdmVDbGFzcykge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKCFoYXNUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuX2hhc01vdmUgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNNb3ZlXHJcbiAgICAgIH1cclxuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xyXG4gICAgICB2YXIgaW5mbyA9IGdldFRyYW5zaXRpb25JbmZvKGVsKTtcclxuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xyXG4gICAgICByZXR1cm4gKHRoaXMuX2hhc01vdmUgPSBpbmZvLmhhc1RyYW5zZm9ybSlcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBjYWxsUGVuZGluZ0NicyAoYykge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmIChjLmVsbS5fbW92ZUNiKSB7XHJcbiAgICBjLmVsbS5fbW92ZUNiKCk7XHJcbiAgfVxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmIChjLmVsbS5fZW50ZXJDYikge1xyXG4gICAgYy5lbG0uX2VudGVyQ2IoKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlY29yZFBvc2l0aW9uIChjKSB7XHJcbiAgYy5kYXRhLm5ld1BvcyA9IGMuZWxtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRyYW5zbGF0aW9uIChjKSB7XHJcbiAgdmFyIG9sZFBvcyA9IGMuZGF0YS5wb3M7XHJcbiAgdmFyIG5ld1BvcyA9IGMuZGF0YS5uZXdQb3M7XHJcbiAgdmFyIGR4ID0gb2xkUG9zLmxlZnQgLSBuZXdQb3MubGVmdDtcclxuICB2YXIgZHkgPSBvbGRQb3MudG9wIC0gbmV3UG9zLnRvcDtcclxuICBpZiAoZHggfHwgZHkpIHtcclxuICAgIGMuZGF0YS5tb3ZlZCA9IHRydWU7XHJcbiAgICB2YXIgcyA9IGMuZWxtLnN0eWxlO1xyXG4gICAgcy50cmFuc2Zvcm0gPSBzLldlYmtpdFRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiICsgZHggKyBcInB4LFwiICsgZHkgKyBcInB4KVwiO1xyXG4gICAgcy50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xyXG4gIH1cclxufVxyXG5cclxudmFyIHBsYXRmb3JtQ29tcG9uZW50cyA9IHtcclxuICBUcmFuc2l0aW9uOiBUcmFuc2l0aW9uLFxyXG4gIFRyYW5zaXRpb25Hcm91cDogVHJhbnNpdGlvbkdyb3VwXHJcbn07XHJcblxyXG4vKiAgKi9cclxuXHJcbi8vIGluc3RhbGwgcGxhdGZvcm0gc3BlY2lmaWMgdXRpbHNcclxuVnVlJDMuY29uZmlnLmlzVW5rbm93bkVsZW1lbnQgPSBpc1Vua25vd25FbGVtZW50O1xyXG5WdWUkMy5jb25maWcuaXNSZXNlcnZlZFRhZyA9IGlzUmVzZXJ2ZWRUYWc7XHJcblZ1ZSQzLmNvbmZpZy5nZXRUYWdOYW1lc3BhY2UgPSBnZXRUYWdOYW1lc3BhY2U7XHJcblZ1ZSQzLmNvbmZpZy5tdXN0VXNlUHJvcCA9IG11c3RVc2VQcm9wO1xyXG5cclxuLy8gaW5zdGFsbCBwbGF0Zm9ybSBydW50aW1lIGRpcmVjdGl2ZXMgJiBjb21wb25lbnRzXHJcbmV4dGVuZChWdWUkMy5vcHRpb25zLmRpcmVjdGl2ZXMsIHBsYXRmb3JtRGlyZWN0aXZlcyk7XHJcbmV4dGVuZChWdWUkMy5vcHRpb25zLmNvbXBvbmVudHMsIHBsYXRmb3JtQ29tcG9uZW50cyk7XHJcblxyXG4vLyBpbnN0YWxsIHBsYXRmb3JtIHBhdGNoIGZ1bmN0aW9uXHJcblZ1ZSQzLnByb3RvdHlwZS5fX3BhdGNoX18gPSBpbkJyb3dzZXIgPyBwYXRjaCQxIDogbm9vcDtcclxuXHJcbi8vIHdyYXAgbW91bnRcclxuVnVlJDMucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uIChcclxuICBlbCxcclxuICBoeWRyYXRpbmdcclxuKSB7XHJcbiAgZWwgPSBlbCAmJiBpbkJyb3dzZXIgPyBxdWVyeShlbCkgOiB1bmRlZmluZWQ7XHJcbiAgcmV0dXJuIHRoaXMuX21vdW50KGVsLCBoeWRyYXRpbmcpXHJcbn07XHJcblxyXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgIGluQnJvd3NlciAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBjb25zb2xlW2NvbnNvbGUuaW5mbyA/ICdpbmZvJyA6ICdsb2cnXShcclxuICAgIFwiWW91IGFyZSBydW5uaW5nIFZ1ZSBpbiBkZXZlbG9wbWVudCBtb2RlLlxcblwiICtcclxuICAgIFwiTWFrZSBzdXJlIHRvIHR1cm4gb24gcHJvZHVjdGlvbiBtb2RlIHdoZW4gZGVwbG95aW5nIGZvciBwcm9kdWN0aW9uLlxcblwiICtcclxuICAgIFwiU2VlIG1vcmUgdGlwcyBhdCBodHRwczovL3Z1ZWpzLm9yZy9ndWlkZS9kZXBsb3ltZW50Lmh0bWxcIlxyXG4gICk7XHJcbn1cclxuXHJcbi8vIGRldnRvb2xzIGdsb2JhbCBob29rXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gIGlmIChjb25maWcuZGV2dG9vbHMpIHtcclxuICAgIGlmIChkZXZ0b29scykge1xyXG4gICAgICBkZXZ0b29scy5lbWl0KCdpbml0JywgVnVlJDMpO1xyXG4gICAgfSBlbHNlIGlmIChcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgaW5Ccm93c2VyICYmICFpc0VkZ2UgJiYgL0Nocm9tZVxcL1xcZCsvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpXHJcbiAgICApIHtcclxuICAgICAgY29uc29sZVtjb25zb2xlLmluZm8gPyAnaW5mbycgOiAnbG9nJ10oXHJcbiAgICAgICAgJ0Rvd25sb2FkIHRoZSBWdWUgRGV2dG9vbHMgZXh0ZW5zaW9uIGZvciBhIGJldHRlciBkZXZlbG9wbWVudCBleHBlcmllbmNlOlxcbicgK1xyXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLWRldnRvb2xzJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufSwgMCk7XHJcblxyXG4vKiAgKi9cclxuXHJcbi8vIGNoZWNrIHdoZXRoZXIgY3VycmVudCBicm93c2VyIGVuY29kZXMgYSBjaGFyIGluc2lkZSBhdHRyaWJ1dGUgdmFsdWVzXHJcbmZ1bmN0aW9uIHNob3VsZERlY29kZSAoY29udGVudCwgZW5jb2RlZCkge1xyXG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBkaXYuaW5uZXJIVE1MID0gXCI8ZGl2IGE9XFxcIlwiICsgY29udGVudCArIFwiXFxcIj5cIjtcclxuICByZXR1cm4gZGl2LmlubmVySFRNTC5pbmRleE9mKGVuY29kZWQpID4gMFxyXG59XHJcblxyXG4vLyAjMzY2M1xyXG4vLyBJRSBlbmNvZGVzIG5ld2xpbmVzIGluc2lkZSBhdHRyaWJ1dGUgdmFsdWVzIHdoaWxlIG90aGVyIGJyb3dzZXJzIGRvbid0XHJcbnZhciBzaG91bGREZWNvZGVOZXdsaW5lcyA9IGluQnJvd3NlciA/IHNob3VsZERlY29kZSgnXFxuJywgJyYjMTA7JykgOiBmYWxzZTtcclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGRlY29kZXI7XHJcblxyXG5mdW5jdGlvbiBkZWNvZGUgKGh0bWwpIHtcclxuICBkZWNvZGVyID0gZGVjb2RlciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBkZWNvZGVyLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgcmV0dXJuIGRlY29kZXIudGV4dENvbnRlbnRcclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgaXNVbmFyeVRhZyA9IG1ha2VNYXAoXHJcbiAgJ2FyZWEsYmFzZSxicixjb2wsZW1iZWQsZnJhbWUsaHIsaW1nLGlucHV0LGlzaW5kZXgsa2V5Z2VuLCcgK1xyXG4gICdsaW5rLG1ldGEscGFyYW0sc291cmNlLHRyYWNrLHdicicsXHJcbiAgdHJ1ZVxyXG4pO1xyXG5cclxuLy8gRWxlbWVudHMgdGhhdCB5b3UgY2FuLCBpbnRlbnRpb25hbGx5LCBsZWF2ZSBvcGVuXHJcbi8vIChhbmQgd2hpY2ggY2xvc2UgdGhlbXNlbHZlcylcclxudmFyIGNhbkJlTGVmdE9wZW5UYWcgPSBtYWtlTWFwKFxyXG4gICdjb2xncm91cCxkZCxkdCxsaSxvcHRpb25zLHAsdGQsdGZvb3QsdGgsdGhlYWQsdHIsc291cmNlJyxcclxuICB0cnVlXHJcbik7XHJcblxyXG4vLyBIVE1MNSB0YWdzIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbCNlbGVtZW50cy0zXHJcbi8vIFBocmFzaW5nIENvbnRlbnQgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZG9tLmh0bWwjcGhyYXNpbmctY29udGVudFxyXG52YXIgaXNOb25QaHJhc2luZ1RhZyA9IG1ha2VNYXAoXHJcbiAgJ2FkZHJlc3MsYXJ0aWNsZSxhc2lkZSxiYXNlLGJsb2NrcXVvdGUsYm9keSxjYXB0aW9uLGNvbCxjb2xncm91cCxkZCwnICtcclxuICAnZGV0YWlscyxkaWFsb2csZGl2LGRsLGR0LGZpZWxkc2V0LGZpZ2NhcHRpb24sZmlndXJlLGZvb3Rlcixmb3JtLCcgK1xyXG4gICdoMSxoMixoMyxoNCxoNSxoNixoZWFkLGhlYWRlcixoZ3JvdXAsaHIsaHRtbCxsZWdlbmQsbGksbWVudWl0ZW0sbWV0YSwnICtcclxuICAnb3B0Z3JvdXAsb3B0aW9uLHBhcmFtLHJwLHJ0LHNvdXJjZSxzdHlsZSxzdW1tYXJ5LHRib2R5LHRkLHRmb290LHRoLHRoZWFkLCcgK1xyXG4gICd0aXRsZSx0cix0cmFjaycsXHJcbiAgdHJ1ZVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5vdCB0eXBlLWNoZWNraW5nIHRoaXMgZmlsZSBiZWNhdXNlIGl0J3MgbW9zdGx5IHZlbmRvciBjb2RlLlxyXG4gKi9cclxuXHJcbi8qIVxyXG4gKiBIVE1MIFBhcnNlciBCeSBKb2huIFJlc2lnIChlam9obi5vcmcpXHJcbiAqIE1vZGlmaWVkIGJ5IEp1cml5IFwia2FuZ2F4XCIgWmF5dHNldlxyXG4gKiBPcmlnaW5hbCBjb2RlIGJ5IEVyaWsgQXJ2aWRzc29uLCBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlXHJcbiAqIGh0dHA6Ly9lcmlrLmVhZS5uZXQvc2ltcGxlaHRtbHBhcnNlci9zaW1wbGVodG1scGFyc2VyLmpzXHJcbiAqL1xyXG5cclxuLy8gUmVndWxhciBFeHByZXNzaW9ucyBmb3IgcGFyc2luZyB0YWdzIGFuZCBhdHRyaWJ1dGVzXHJcbnZhciBzaW5nbGVBdHRySWRlbnRpZmllciA9IC8oW15cXHNcIic8Pi89XSspLztcclxudmFyIHNpbmdsZUF0dHJBc3NpZ24gPSAvKD86PSkvO1xyXG52YXIgc2luZ2xlQXR0clZhbHVlcyA9IFtcclxuICAvLyBhdHRyIHZhbHVlIGRvdWJsZSBxdW90ZXNcclxuICAvXCIoW15cIl0qKVwiKy8uc291cmNlLFxyXG4gIC8vIGF0dHIgdmFsdWUsIHNpbmdsZSBxdW90ZXNcclxuICAvJyhbXiddKiknKy8uc291cmNlLFxyXG4gIC8vIGF0dHIgdmFsdWUsIG5vIHF1b3Rlc1xyXG4gIC8oW15cXHNcIic9PD5gXSspLy5zb3VyY2VcclxuXTtcclxudmFyIGF0dHJpYnV0ZSA9IG5ldyBSZWdFeHAoXHJcbiAgJ15cXFxccyonICsgc2luZ2xlQXR0cklkZW50aWZpZXIuc291cmNlICtcclxuICAnKD86XFxcXHMqKCcgKyBzaW5nbGVBdHRyQXNzaWduLnNvdXJjZSArICcpJyArXHJcbiAgJ1xcXFxzKig/OicgKyBzaW5nbGVBdHRyVmFsdWVzLmpvaW4oJ3wnKSArICcpKT8nXHJcbik7XHJcblxyXG4vLyBjb3VsZCB1c2UgaHR0cHM6Ly93d3cudzMub3JnL1RSLzE5OTkvUkVDLXhtbC1uYW1lcy0xOTk5MDExNC8jTlQtUU5hbWVcclxuLy8gYnV0IGZvciBWdWUgdGVtcGxhdGVzIHdlIGNhbiBlbmZvcmNlIGEgc2ltcGxlIGNoYXJzZXRcclxudmFyIG5jbmFtZSA9ICdbYS16QS1aX11bXFxcXHdcXFxcLVxcXFwuXSonO1xyXG52YXIgcW5hbWVDYXB0dXJlID0gJygoPzonICsgbmNuYW1lICsgJ1xcXFw6KT8nICsgbmNuYW1lICsgJyknO1xyXG52YXIgc3RhcnRUYWdPcGVuID0gbmV3IFJlZ0V4cCgnXjwnICsgcW5hbWVDYXB0dXJlKTtcclxudmFyIHN0YXJ0VGFnQ2xvc2UgPSAvXlxccyooXFwvPyk+LztcclxudmFyIGVuZFRhZyA9IG5ldyBSZWdFeHAoJ148XFxcXC8nICsgcW5hbWVDYXB0dXJlICsgJ1tePl0qPicpO1xyXG52YXIgZG9jdHlwZSA9IC9ePCFET0NUWVBFIFtePl0rPi9pO1xyXG52YXIgY29tbWVudCA9IC9ePCEtLS87XHJcbnZhciBjb25kaXRpb25hbENvbW1lbnQgPSAvXjwhXFxbLztcclxuXHJcbnZhciBJU19SRUdFWF9DQVBUVVJJTkdfQlJPS0VOID0gZmFsc2U7XHJcbid4Jy5yZXBsYWNlKC94KC4pPy9nLCBmdW5jdGlvbiAobSwgZykge1xyXG4gIElTX1JFR0VYX0NBUFRVUklOR19CUk9LRU4gPSBnID09PSAnJztcclxufSk7XHJcblxyXG4vLyBTcGVjaWFsIEVsZW1lbnRzIChjYW4gY29udGFpbiBhbnl0aGluZylcclxudmFyIGlzU2NyaXB0T3JTdHlsZSA9IG1ha2VNYXAoJ3NjcmlwdCxzdHlsZScsIHRydWUpO1xyXG52YXIgcmVDYWNoZSA9IHt9O1xyXG5cclxudmFyIGx0UkUgPSAvJmx0Oy9nO1xyXG52YXIgZ3RSRSA9IC8mZ3Q7L2c7XHJcbnZhciBubFJFID0gLyYjMTA7L2c7XHJcbnZhciBhbXBSRSA9IC8mYW1wOy9nO1xyXG52YXIgcXVvdGVSRSA9IC8mcXVvdDsvZztcclxuXHJcbmZ1bmN0aW9uIGRlY29kZUF0dHIgKHZhbHVlLCBzaG91bGREZWNvZGVOZXdsaW5lcykge1xyXG4gIGlmIChzaG91bGREZWNvZGVOZXdsaW5lcykge1xyXG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKG5sUkUsICdcXG4nKTtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlXHJcbiAgICAucmVwbGFjZShsdFJFLCAnPCcpXHJcbiAgICAucmVwbGFjZShndFJFLCAnPicpXHJcbiAgICAucmVwbGFjZShhbXBSRSwgJyYnKVxyXG4gICAgLnJlcGxhY2UocXVvdGVSRSwgJ1wiJylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VIVE1MIChodG1sLCBvcHRpb25zKSB7XHJcbiAgdmFyIHN0YWNrID0gW107XHJcbiAgdmFyIGV4cGVjdEhUTUwgPSBvcHRpb25zLmV4cGVjdEhUTUw7XHJcbiAgdmFyIGlzVW5hcnlUYWckJDEgPSBvcHRpb25zLmlzVW5hcnlUYWcgfHwgbm87XHJcbiAgdmFyIGluZGV4ID0gMDtcclxuICB2YXIgbGFzdCwgbGFzdFRhZztcclxuICB3aGlsZSAoaHRtbCkge1xyXG4gICAgbGFzdCA9IGh0bWw7XHJcbiAgICAvLyBNYWtlIHN1cmUgd2UncmUgbm90IGluIGEgc2NyaXB0IG9yIHN0eWxlIGVsZW1lbnRcclxuICAgIGlmICghbGFzdFRhZyB8fCAhaXNTY3JpcHRPclN0eWxlKGxhc3RUYWcpKSB7XHJcbiAgICAgIHZhciB0ZXh0RW5kID0gaHRtbC5pbmRleE9mKCc8Jyk7XHJcbiAgICAgIGlmICh0ZXh0RW5kID09PSAwKSB7XHJcbiAgICAgICAgLy8gQ29tbWVudDpcclxuICAgICAgICBpZiAoY29tbWVudC50ZXN0KGh0bWwpKSB7XHJcbiAgICAgICAgICB2YXIgY29tbWVudEVuZCA9IGh0bWwuaW5kZXhPZignLS0+Jyk7XHJcblxyXG4gICAgICAgICAgaWYgKGNvbW1lbnRFbmQgPj0gMCkge1xyXG4gICAgICAgICAgICBhZHZhbmNlKGNvbW1lbnRFbmQgKyAzKTtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29uZGl0aW9uYWxfY29tbWVudCNEb3dubGV2ZWwtcmV2ZWFsZWRfY29uZGl0aW9uYWxfY29tbWVudFxyXG4gICAgICAgIGlmIChjb25kaXRpb25hbENvbW1lbnQudGVzdChodG1sKSkge1xyXG4gICAgICAgICAgdmFyIGNvbmRpdGlvbmFsRW5kID0gaHRtbC5pbmRleE9mKCddPicpO1xyXG5cclxuICAgICAgICAgIGlmIChjb25kaXRpb25hbEVuZCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoY29uZGl0aW9uYWxFbmQgKyAyKTtcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERvY3R5cGU6XHJcbiAgICAgICAgdmFyIGRvY3R5cGVNYXRjaCA9IGh0bWwubWF0Y2goZG9jdHlwZSk7XHJcbiAgICAgICAgaWYgKGRvY3R5cGVNYXRjaCkge1xyXG4gICAgICAgICAgYWR2YW5jZShkb2N0eXBlTWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFbmQgdGFnOlxyXG4gICAgICAgIHZhciBlbmRUYWdNYXRjaCA9IGh0bWwubWF0Y2goZW5kVGFnKTtcclxuICAgICAgICBpZiAoZW5kVGFnTWF0Y2gpIHtcclxuICAgICAgICAgIHZhciBjdXJJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgYWR2YW5jZShlbmRUYWdNYXRjaFswXS5sZW5ndGgpO1xyXG4gICAgICAgICAgcGFyc2VFbmRUYWcoZW5kVGFnTWF0Y2hbMV0sIGN1ckluZGV4LCBpbmRleCk7XHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3RhcnQgdGFnOlxyXG4gICAgICAgIHZhciBzdGFydFRhZ01hdGNoID0gcGFyc2VTdGFydFRhZygpO1xyXG4gICAgICAgIGlmIChzdGFydFRhZ01hdGNoKSB7XHJcbiAgICAgICAgICBoYW5kbGVTdGFydFRhZyhzdGFydFRhZ01hdGNoKTtcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdGV4dCA9ICh2b2lkIDApLCByZXN0JDEgPSAodm9pZCAwKSwgbmV4dCA9ICh2b2lkIDApO1xyXG4gICAgICBpZiAodGV4dEVuZCA+IDApIHtcclxuICAgICAgICByZXN0JDEgPSBodG1sLnNsaWNlKHRleHRFbmQpO1xyXG4gICAgICAgIHdoaWxlIChcclxuICAgICAgICAgICFlbmRUYWcudGVzdChyZXN0JDEpICYmXHJcbiAgICAgICAgICAhc3RhcnRUYWdPcGVuLnRlc3QocmVzdCQxKSAmJlxyXG4gICAgICAgICAgIWNvbW1lbnQudGVzdChyZXN0JDEpICYmXHJcbiAgICAgICAgICAhY29uZGl0aW9uYWxDb21tZW50LnRlc3QocmVzdCQxKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgLy8gPCBpbiBwbGFpbiB0ZXh0LCBiZSBmb3JnaXZpbmcgYW5kIHRyZWF0IGl0IGFzIHRleHRcclxuICAgICAgICAgIG5leHQgPSByZXN0JDEuaW5kZXhPZignPCcsIDEpO1xyXG4gICAgICAgICAgaWYgKG5leHQgPCAwKSB7IGJyZWFrIH1cclxuICAgICAgICAgIHRleHRFbmQgKz0gbmV4dDtcclxuICAgICAgICAgIHJlc3QkMSA9IGh0bWwuc2xpY2UodGV4dEVuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHQgPSBodG1sLnN1YnN0cmluZygwLCB0ZXh0RW5kKTtcclxuICAgICAgICBhZHZhbmNlKHRleHRFbmQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGV4dEVuZCA8IDApIHtcclxuICAgICAgICB0ZXh0ID0gaHRtbDtcclxuICAgICAgICBodG1sID0gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmNoYXJzICYmIHRleHQpIHtcclxuICAgICAgICBvcHRpb25zLmNoYXJzKHRleHQpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgc3RhY2tlZFRhZyA9IGxhc3RUYWcudG9Mb3dlckNhc2UoKTtcclxuICAgICAgdmFyIHJlU3RhY2tlZFRhZyA9IHJlQ2FjaGVbc3RhY2tlZFRhZ10gfHwgKHJlQ2FjaGVbc3RhY2tlZFRhZ10gPSBuZXcgUmVnRXhwKCcoW1xcXFxzXFxcXFNdKj8pKDwvJyArIHN0YWNrZWRUYWcgKyAnW14+XSo+KScsICdpJykpO1xyXG4gICAgICB2YXIgZW5kVGFnTGVuZ3RoID0gMDtcclxuICAgICAgdmFyIHJlc3QgPSBodG1sLnJlcGxhY2UocmVTdGFja2VkVGFnLCBmdW5jdGlvbiAoYWxsLCB0ZXh0LCBlbmRUYWcpIHtcclxuICAgICAgICBlbmRUYWdMZW5ndGggPSBlbmRUYWcubGVuZ3RoO1xyXG4gICAgICAgIGlmIChzdGFja2VkVGFnICE9PSAnc2NyaXB0JyAmJiBzdGFja2VkVGFnICE9PSAnc3R5bGUnICYmIHN0YWNrZWRUYWcgIT09ICdub3NjcmlwdCcpIHtcclxuICAgICAgICAgIHRleHQgPSB0ZXh0XHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC88IS0tKFtcXHNcXFNdKj8pLS0+L2csICckMScpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC88IVxcW0NEQVRBXFxbKFtcXHNcXFNdKj8pXV0+L2csICckMScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5jaGFycykge1xyXG4gICAgICAgICAgb3B0aW9ucy5jaGFycyh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICcnXHJcbiAgICAgIH0pO1xyXG4gICAgICBpbmRleCArPSBodG1sLmxlbmd0aCAtIHJlc3QubGVuZ3RoO1xyXG4gICAgICBodG1sID0gcmVzdDtcclxuICAgICAgcGFyc2VFbmRUYWcoc3RhY2tlZFRhZywgaW5kZXggLSBlbmRUYWdMZW5ndGgsIGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHRtbCA9PT0gbGFzdCAmJiBvcHRpb25zLmNoYXJzKSB7XHJcbiAgICAgIG9wdGlvbnMuY2hhcnMoaHRtbCk7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBDbGVhbiB1cCBhbnkgcmVtYWluaW5nIHRhZ3NcclxuICBwYXJzZUVuZFRhZygpO1xyXG5cclxuICBmdW5jdGlvbiBhZHZhbmNlIChuKSB7XHJcbiAgICBpbmRleCArPSBuO1xyXG4gICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKG4pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VTdGFydFRhZyAoKSB7XHJcbiAgICB2YXIgc3RhcnQgPSBodG1sLm1hdGNoKHN0YXJ0VGFnT3Blbik7XHJcbiAgICBpZiAoc3RhcnQpIHtcclxuICAgICAgdmFyIG1hdGNoID0ge1xyXG4gICAgICAgIHRhZ05hbWU6IHN0YXJ0WzFdLFxyXG4gICAgICAgIGF0dHJzOiBbXSxcclxuICAgICAgICBzdGFydDogaW5kZXhcclxuICAgICAgfTtcclxuICAgICAgYWR2YW5jZShzdGFydFswXS5sZW5ndGgpO1xyXG4gICAgICB2YXIgZW5kLCBhdHRyO1xyXG4gICAgICB3aGlsZSAoIShlbmQgPSBodG1sLm1hdGNoKHN0YXJ0VGFnQ2xvc2UpKSAmJiAoYXR0ciA9IGh0bWwubWF0Y2goYXR0cmlidXRlKSkpIHtcclxuICAgICAgICBhZHZhbmNlKGF0dHJbMF0ubGVuZ3RoKTtcclxuICAgICAgICBtYXRjaC5hdHRycy5wdXNoKGF0dHIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlbmQpIHtcclxuICAgICAgICBtYXRjaC51bmFyeVNsYXNoID0gZW5kWzFdO1xyXG4gICAgICAgIGFkdmFuY2UoZW5kWzBdLmxlbmd0aCk7XHJcbiAgICAgICAgbWF0Y2guZW5kID0gaW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0VGFnIChtYXRjaCkge1xyXG4gICAgdmFyIHRhZ05hbWUgPSBtYXRjaC50YWdOYW1lO1xyXG4gICAgdmFyIHVuYXJ5U2xhc2ggPSBtYXRjaC51bmFyeVNsYXNoO1xyXG5cclxuICAgIGlmIChleHBlY3RIVE1MKSB7XHJcbiAgICAgIGlmIChsYXN0VGFnID09PSAncCcgJiYgaXNOb25QaHJhc2luZ1RhZyh0YWdOYW1lKSkge1xyXG4gICAgICAgIHBhcnNlRW5kVGFnKGxhc3RUYWcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjYW5CZUxlZnRPcGVuVGFnKHRhZ05hbWUpICYmIGxhc3RUYWcgPT09IHRhZ05hbWUpIHtcclxuICAgICAgICBwYXJzZUVuZFRhZyh0YWdOYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB1bmFyeSA9IGlzVW5hcnlUYWckJDEodGFnTmFtZSkgfHwgdGFnTmFtZSA9PT0gJ2h0bWwnICYmIGxhc3RUYWcgPT09ICdoZWFkJyB8fCAhIXVuYXJ5U2xhc2g7XHJcblxyXG4gICAgdmFyIGwgPSBtYXRjaC5hdHRycy5sZW5ndGg7XHJcbiAgICB2YXIgYXR0cnMgPSBuZXcgQXJyYXkobCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICB2YXIgYXJncyA9IG1hdGNoLmF0dHJzW2ldO1xyXG4gICAgICAvLyBoYWNraXNoIHdvcmsgYXJvdW5kIEZGIGJ1ZyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjk3NzhcclxuICAgICAgaWYgKElTX1JFR0VYX0NBUFRVUklOR19CUk9LRU4gJiYgYXJnc1swXS5pbmRleE9mKCdcIlwiJykgPT09IC0xKSB7XHJcbiAgICAgICAgaWYgKGFyZ3NbM10gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzNdOyB9XHJcbiAgICAgICAgaWYgKGFyZ3NbNF0gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzRdOyB9XHJcbiAgICAgICAgaWYgKGFyZ3NbNV0gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzVdOyB9XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHZhbHVlID0gYXJnc1szXSB8fCBhcmdzWzRdIHx8IGFyZ3NbNV0gfHwgJyc7XHJcbiAgICAgIGF0dHJzW2ldID0ge1xyXG4gICAgICAgIG5hbWU6IGFyZ3NbMV0sXHJcbiAgICAgICAgdmFsdWU6IGRlY29kZUF0dHIoXHJcbiAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgIG9wdGlvbnMuc2hvdWxkRGVjb2RlTmV3bGluZXNcclxuICAgICAgICApXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF1bmFyeSkge1xyXG4gICAgICBzdGFjay5wdXNoKHsgdGFnOiB0YWdOYW1lLCBsb3dlckNhc2VkVGFnOiB0YWdOYW1lLnRvTG93ZXJDYXNlKCksIGF0dHJzOiBhdHRycyB9KTtcclxuICAgICAgbGFzdFRhZyA9IHRhZ05hbWU7XHJcbiAgICAgIHVuYXJ5U2xhc2ggPSAnJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5zdGFydCkge1xyXG4gICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIGF0dHJzLCB1bmFyeSwgbWF0Y2guc3RhcnQsIG1hdGNoLmVuZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUVuZFRhZyAodGFnTmFtZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIHBvcywgbG93ZXJDYXNlZFRhZ05hbWU7XHJcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IGluZGV4OyB9XHJcbiAgICBpZiAoZW5kID09IG51bGwpIHsgZW5kID0gaW5kZXg7IH1cclxuXHJcbiAgICBpZiAodGFnTmFtZSkge1xyXG4gICAgICBsb3dlckNhc2VkVGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxyXG4gICAgaWYgKHRhZ05hbWUpIHtcclxuICAgICAgZm9yIChwb3MgPSBzdGFjay5sZW5ndGggLSAxOyBwb3MgPj0gMDsgcG9zLS0pIHtcclxuICAgICAgICBpZiAoc3RhY2tbcG9zXS5sb3dlckNhc2VkVGFnID09PSBsb3dlckNhc2VkVGFnTmFtZSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIElmIG5vIHRhZyBuYW1lIGlzIHByb3ZpZGVkLCBjbGVhbiBzaG9wXHJcbiAgICAgIHBvcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBvcyA+PSAwKSB7XHJcbiAgICAgIC8vIENsb3NlIGFsbCB0aGUgb3BlbiBlbGVtZW50cywgdXAgdGhlIHN0YWNrXHJcbiAgICAgIGZvciAodmFyIGkgPSBzdGFjay5sZW5ndGggLSAxOyBpID49IHBvczsgaS0tKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kKSB7XHJcbiAgICAgICAgICBvcHRpb25zLmVuZChzdGFja1tpXS50YWcsIHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRoZSBvcGVuIGVsZW1lbnRzIGZyb20gdGhlIHN0YWNrXHJcbiAgICAgIHN0YWNrLmxlbmd0aCA9IHBvcztcclxuICAgICAgbGFzdFRhZyA9IHBvcyAmJiBzdGFja1twb3MgLSAxXS50YWc7XHJcbiAgICB9IGVsc2UgaWYgKGxvd2VyQ2FzZWRUYWdOYW1lID09PSAnYnInKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XHJcbiAgICAgICAgb3B0aW9ucy5zdGFydCh0YWdOYW1lLCBbXSwgdHJ1ZSwgc3RhcnQsIGVuZCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobG93ZXJDYXNlZFRhZ05hbWUgPT09ICdwJykge1xyXG4gICAgICBpZiAob3B0aW9ucy5zdGFydCkge1xyXG4gICAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgW10sIGZhbHNlLCBzdGFydCwgZW5kKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAob3B0aW9ucy5lbmQpIHtcclxuICAgICAgICBvcHRpb25zLmVuZCh0YWdOYW1lLCBzdGFydCwgZW5kKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiBwYXJzZUZpbHRlcnMgKGV4cCkge1xyXG4gIHZhciBpblNpbmdsZSA9IGZhbHNlO1xyXG4gIHZhciBpbkRvdWJsZSA9IGZhbHNlO1xyXG4gIHZhciBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7XHJcbiAgdmFyIGluUmVnZXggPSBmYWxzZTtcclxuICB2YXIgY3VybHkgPSAwO1xyXG4gIHZhciBzcXVhcmUgPSAwO1xyXG4gIHZhciBwYXJlbiA9IDA7XHJcbiAgdmFyIGxhc3RGaWx0ZXJJbmRleCA9IDA7XHJcbiAgdmFyIGMsIHByZXYsIGksIGV4cHJlc3Npb24sIGZpbHRlcnM7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBleHAubGVuZ3RoOyBpKyspIHtcclxuICAgIHByZXYgPSBjO1xyXG4gICAgYyA9IGV4cC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgaWYgKGluU2luZ2xlKSB7XHJcbiAgICAgIGlmIChjID09PSAweDI3ICYmIHByZXYgIT09IDB4NUMpIHsgaW5TaW5nbGUgPSBmYWxzZTsgfVxyXG4gICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xyXG4gICAgICBpZiAoYyA9PT0gMHgyMiAmJiBwcmV2ICE9PSAweDVDKSB7IGluRG91YmxlID0gZmFsc2U7IH1cclxuICAgIH0gZWxzZSBpZiAoaW5UZW1wbGF0ZVN0cmluZykge1xyXG4gICAgICBpZiAoYyA9PT0gMHg2MCAmJiBwcmV2ICE9PSAweDVDKSB7IGluVGVtcGxhdGVTdHJpbmcgPSBmYWxzZTsgfVxyXG4gICAgfSBlbHNlIGlmIChpblJlZ2V4KSB7XHJcbiAgICAgIGlmIChjID09PSAweDJmICYmIHByZXYgIT09IDB4NUMpIHsgaW5SZWdleCA9IGZhbHNlOyB9XHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICBjID09PSAweDdDICYmIC8vIHBpcGVcclxuICAgICAgZXhwLmNoYXJDb2RlQXQoaSArIDEpICE9PSAweDdDICYmXHJcbiAgICAgIGV4cC5jaGFyQ29kZUF0KGkgLSAxKSAhPT0gMHg3QyAmJlxyXG4gICAgICAhY3VybHkgJiYgIXNxdWFyZSAmJiAhcGFyZW5cclxuICAgICkge1xyXG4gICAgICBpZiAoZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgZmlsdGVyLCBlbmQgb2YgZXhwcmVzc2lvblxyXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxO1xyXG4gICAgICAgIGV4cHJlc3Npb24gPSBleHAuc2xpY2UoMCwgaSkudHJpbSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHB1c2hGaWx0ZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3dpdGNoIChjKSB7XHJcbiAgICAgICAgY2FzZSAweDIyOiBpbkRvdWJsZSA9IHRydWU7IGJyZWFrICAgICAgICAgLy8gXCJcclxuICAgICAgICBjYXNlIDB4Mjc6IGluU2luZ2xlID0gdHJ1ZTsgYnJlYWsgICAgICAgICAvLyAnXHJcbiAgICAgICAgY2FzZSAweDYwOiBpblRlbXBsYXRlU3RyaW5nID0gdHJ1ZTsgYnJlYWsgLy8gYFxyXG4gICAgICAgIGNhc2UgMHgyODogcGFyZW4rKzsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIChcclxuICAgICAgICBjYXNlIDB4Mjk6IHBhcmVuLS07IGJyZWFrICAgICAgICAgICAgICAgICAvLyApXHJcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgICAgICAgICAgLy8gW1xyXG4gICAgICAgIGNhc2UgMHg1RDogc3F1YXJlLS07IGJyZWFrICAgICAgICAgICAgICAgIC8vIF1cclxuICAgICAgICBjYXNlIDB4N0I6IGN1cmx5Kys7IGJyZWFrICAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChjID09PSAweDJmKSB7IC8vIC9cclxuICAgICAgICB2YXIgaiA9IGkgLSAxO1xyXG4gICAgICAgIHZhciBwID0gKHZvaWQgMCk7XHJcbiAgICAgICAgLy8gZmluZCBmaXJzdCBub24td2hpdGVzcGFjZSBwcmV2IGNoYXJcclxuICAgICAgICBmb3IgKDsgaiA+PSAwOyBqLS0pIHtcclxuICAgICAgICAgIHAgPSBleHAuY2hhckF0KGopO1xyXG4gICAgICAgICAgaWYgKHAgIT09ICcgJykgeyBicmVhayB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcCB8fCAhL1tcXHckXS8udGVzdChwKSkge1xyXG4gICAgICAgICAgaW5SZWdleCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBleHByZXNzaW9uID0gZXhwLnNsaWNlKDAsIGkpLnRyaW0oKTtcclxuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gMCkge1xyXG4gICAgcHVzaEZpbHRlcigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHVzaEZpbHRlciAoKSB7XHJcbiAgICAoZmlsdGVycyB8fCAoZmlsdGVycyA9IFtdKSkucHVzaChleHAuc2xpY2UobGFzdEZpbHRlckluZGV4LCBpKS50cmltKCkpO1xyXG4gICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDE7XHJcbiAgfVxyXG5cclxuICBpZiAoZmlsdGVycykge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbHRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZXhwcmVzc2lvbiA9IHdyYXBGaWx0ZXIoZXhwcmVzc2lvbiwgZmlsdGVyc1tpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXhwcmVzc2lvblxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwRmlsdGVyIChleHAsIGZpbHRlcikge1xyXG4gIHZhciBpID0gZmlsdGVyLmluZGV4T2YoJygnKTtcclxuICBpZiAoaSA8IDApIHtcclxuICAgIC8vIF9mOiByZXNvbHZlRmlsdGVyXHJcbiAgICByZXR1cm4gKFwiX2YoXFxcIlwiICsgZmlsdGVyICsgXCJcXFwiKShcIiArIGV4cCArIFwiKVwiKVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgbmFtZSA9IGZpbHRlci5zbGljZSgwLCBpKTtcclxuICAgIHZhciBhcmdzID0gZmlsdGVyLnNsaWNlKGkgKyAxKTtcclxuICAgIHJldHVybiAoXCJfZihcXFwiXCIgKyBuYW1lICsgXCJcXFwiKShcIiArIGV4cCArIFwiLFwiICsgYXJncylcclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGRlZmF1bHRUYWdSRSA9IC9cXHtcXHsoKD86LnxcXG4pKz8pXFx9XFx9L2c7XHJcbnZhciByZWdleEVzY2FwZVJFID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZztcclxuXHJcbnZhciBidWlsZFJlZ2V4ID0gY2FjaGVkKGZ1bmN0aW9uIChkZWxpbWl0ZXJzKSB7XHJcbiAgdmFyIG9wZW4gPSBkZWxpbWl0ZXJzWzBdLnJlcGxhY2UocmVnZXhFc2NhcGVSRSwgJ1xcXFwkJicpO1xyXG4gIHZhciBjbG9zZSA9IGRlbGltaXRlcnNbMV0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XHJcbiAgcmV0dXJuIG5ldyBSZWdFeHAob3BlbiArICcoKD86LnxcXFxcbikrPyknICsgY2xvc2UsICdnJylcclxufSk7XHJcblxyXG5mdW5jdGlvbiBwYXJzZVRleHQgKFxyXG4gIHRleHQsXHJcbiAgZGVsaW1pdGVyc1xyXG4pIHtcclxuICB2YXIgdGFnUkUgPSBkZWxpbWl0ZXJzID8gYnVpbGRSZWdleChkZWxpbWl0ZXJzKSA6IGRlZmF1bHRUYWdSRTtcclxuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB2YXIgdG9rZW5zID0gW107XHJcbiAgdmFyIGxhc3RJbmRleCA9IHRhZ1JFLmxhc3RJbmRleCA9IDA7XHJcbiAgdmFyIG1hdGNoLCBpbmRleDtcclxuICB3aGlsZSAoKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkpIHtcclxuICAgIGluZGV4ID0gbWF0Y2guaW5kZXg7XHJcbiAgICAvLyBwdXNoIHRleHQgdG9rZW5cclxuICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xyXG4gICAgICB0b2tlbnMucHVzaChKU09OLnN0cmluZ2lmeSh0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpKSk7XHJcbiAgICB9XHJcbiAgICAvLyB0YWcgdG9rZW5cclxuICAgIHZhciBleHAgPSBwYXJzZUZpbHRlcnMobWF0Y2hbMV0udHJpbSgpKTtcclxuICAgIHRva2Vucy5wdXNoKChcIl9zKFwiICsgZXhwICsgXCIpXCIpKTtcclxuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xyXG4gIH1cclxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcclxuICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRleHQuc2xpY2UobGFzdEluZGV4KSkpO1xyXG4gIH1cclxuICByZXR1cm4gdG9rZW5zLmpvaW4oJysnKVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGJhc2VXYXJuIChtc2cpIHtcclxuICBjb25zb2xlLmVycm9yKChcIltWdWUgcGFyc2VyXTogXCIgKyBtc2cpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGx1Y2tNb2R1bGVGdW5jdGlvbiAoXHJcbiAgbW9kdWxlcyxcclxuICBrZXlcclxuKSB7XHJcbiAgcmV0dXJuIG1vZHVsZXNcclxuICAgID8gbW9kdWxlcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1ba2V5XTsgfSkuZmlsdGVyKGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9KVxyXG4gICAgOiBbXVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQcm9wIChlbCwgbmFtZSwgdmFsdWUpIHtcclxuICAoZWwucHJvcHMgfHwgKGVsLnByb3BzID0gW10pKS5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRBdHRyIChlbCwgbmFtZSwgdmFsdWUpIHtcclxuICAoZWwuYXR0cnMgfHwgKGVsLmF0dHJzID0gW10pKS5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGREaXJlY3RpdmUgKFxyXG4gIGVsLFxyXG4gIG5hbWUsXHJcbiAgcmF3TmFtZSxcclxuICB2YWx1ZSxcclxuICBhcmcsXHJcbiAgbW9kaWZpZXJzXHJcbikge1xyXG4gIChlbC5kaXJlY3RpdmVzIHx8IChlbC5kaXJlY3RpdmVzID0gW10pKS5wdXNoKHsgbmFtZTogbmFtZSwgcmF3TmFtZTogcmF3TmFtZSwgdmFsdWU6IHZhbHVlLCBhcmc6IGFyZywgbW9kaWZpZXJzOiBtb2RpZmllcnMgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhhbmRsZXIgKFxyXG4gIGVsLFxyXG4gIG5hbWUsXHJcbiAgdmFsdWUsXHJcbiAgbW9kaWZpZXJzLFxyXG4gIGltcG9ydGFudFxyXG4pIHtcclxuICAvLyBjaGVjayBjYXB0dXJlIG1vZGlmaWVyXHJcbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMuY2FwdHVyZSkge1xyXG4gICAgZGVsZXRlIG1vZGlmaWVycy5jYXB0dXJlO1xyXG4gICAgbmFtZSA9ICchJyArIG5hbWU7IC8vIG1hcmsgdGhlIGV2ZW50IGFzIGNhcHR1cmVkXHJcbiAgfVxyXG4gIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLm9uY2UpIHtcclxuICAgIGRlbGV0ZSBtb2RpZmllcnMub25jZTtcclxuICAgIG5hbWUgPSAnficgKyBuYW1lOyAvLyBtYXJrIHRoZSBldmVudCBhcyBvbmNlXHJcbiAgfVxyXG4gIHZhciBldmVudHM7XHJcbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMubmF0aXZlKSB7XHJcbiAgICBkZWxldGUgbW9kaWZpZXJzLm5hdGl2ZTtcclxuICAgIGV2ZW50cyA9IGVsLm5hdGl2ZUV2ZW50cyB8fCAoZWwubmF0aXZlRXZlbnRzID0ge30pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBldmVudHMgPSBlbC5ldmVudHMgfHwgKGVsLmV2ZW50cyA9IHt9KTtcclxuICB9XHJcbiAgdmFyIG5ld0hhbmRsZXIgPSB7IHZhbHVlOiB2YWx1ZSwgbW9kaWZpZXJzOiBtb2RpZmllcnMgfTtcclxuICB2YXIgaGFuZGxlcnMgPSBldmVudHNbbmFtZV07XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcnMpKSB7XHJcbiAgICBpbXBvcnRhbnQgPyBoYW5kbGVycy51bnNoaWZ0KG5ld0hhbmRsZXIpIDogaGFuZGxlcnMucHVzaChuZXdIYW5kbGVyKTtcclxuICB9IGVsc2UgaWYgKGhhbmRsZXJzKSB7XHJcbiAgICBldmVudHNbbmFtZV0gPSBpbXBvcnRhbnQgPyBbbmV3SGFuZGxlciwgaGFuZGxlcnNdIDogW2hhbmRsZXJzLCBuZXdIYW5kbGVyXTtcclxuICB9IGVsc2Uge1xyXG4gICAgZXZlbnRzW25hbWVdID0gbmV3SGFuZGxlcjtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEJpbmRpbmdBdHRyIChcclxuICBlbCxcclxuICBuYW1lLFxyXG4gIGdldFN0YXRpY1xyXG4pIHtcclxuICB2YXIgZHluYW1pY1ZhbHVlID1cclxuICAgIGdldEFuZFJlbW92ZUF0dHIoZWwsICc6JyArIG5hbWUpIHx8XHJcbiAgICBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1iaW5kOicgKyBuYW1lKTtcclxuICBpZiAoZHluYW1pY1ZhbHVlICE9IG51bGwpIHtcclxuICAgIHJldHVybiBwYXJzZUZpbHRlcnMoZHluYW1pY1ZhbHVlKVxyXG4gIH0gZWxzZSBpZiAoZ2V0U3RhdGljICE9PSBmYWxzZSkge1xyXG4gICAgdmFyIHN0YXRpY1ZhbHVlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgbmFtZSk7XHJcbiAgICBpZiAoc3RhdGljVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RhdGljVmFsdWUpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbmRSZW1vdmVBdHRyIChlbCwgbmFtZSkge1xyXG4gIHZhciB2YWw7XHJcbiAgaWYgKCh2YWwgPSBlbC5hdHRyc01hcFtuYW1lXSkgIT0gbnVsbCkge1xyXG4gICAgdmFyIGxpc3QgPSBlbC5hdHRyc0xpc3Q7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWxcclxufVxyXG5cclxudmFyIGxlbjtcclxudmFyIHN0cjtcclxudmFyIGNocjtcclxudmFyIGluZGV4JDE7XHJcbnZhciBleHByZXNzaW9uUG9zO1xyXG52YXIgZXhwcmVzc2lvbkVuZFBvcztcclxuXHJcbi8qKlxyXG4gKiBwYXJzZSBkaXJlY3RpdmUgbW9kZWwgdG8gZG8gdGhlIGFycmF5IHVwZGF0ZSB0cmFuc2Zvcm0uIGFbaWR4XSA9IHZhbCA9PiAkJGEuc3BsaWNlKCQkaWR4LCAxLCB2YWwpXHJcbiAqXHJcbiAqIGZvciBsb29wIHBvc3NpYmxlIGNhc2VzOlxyXG4gKlxyXG4gKiAtIHRlc3RcclxuICogLSB0ZXN0W2lkeF1cclxuICogLSB0ZXN0W3Rlc3QxW2lkeF1dXHJcbiAqIC0gdGVzdFtcImFcIl1baWR4XVxyXG4gKiAtIHh4eC50ZXN0W2FbYV0udGVzdDFbaWR4XV1cclxuICogLSB0ZXN0Lnh4eC5hW1wiYXNhXCJdW3Rlc3QxW2lkeF1dXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gcGFyc2VNb2RlbCAodmFsKSB7XHJcbiAgc3RyID0gdmFsO1xyXG4gIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgaW5kZXgkMSA9IGV4cHJlc3Npb25Qb3MgPSBleHByZXNzaW9uRW5kUG9zID0gMDtcclxuXHJcbiAgaWYgKHZhbC5pbmRleE9mKCdbJykgPCAwIHx8IHZhbC5sYXN0SW5kZXhPZignXScpIDwgbGVuIC0gMSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXhwOiB2YWwsXHJcbiAgICAgIGlkeDogbnVsbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd2hpbGUgKCFlb2YoKSkge1xyXG4gICAgY2hyID0gbmV4dCgpO1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXNTdHJpbmdTdGFydChjaHIpKSB7XHJcbiAgICAgIHBhcnNlU3RyaW5nKGNocik7XHJcbiAgICB9IGVsc2UgaWYgKGNociA9PT0gMHg1Qikge1xyXG4gICAgICBwYXJzZUJyYWNrZXQoY2hyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBleHA6IHZhbC5zdWJzdHJpbmcoMCwgZXhwcmVzc2lvblBvcyksXHJcbiAgICBpZHg6IHZhbC5zdWJzdHJpbmcoZXhwcmVzc2lvblBvcyArIDEsIGV4cHJlc3Npb25FbmRQb3MpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0ICgpIHtcclxuICByZXR1cm4gc3RyLmNoYXJDb2RlQXQoKytpbmRleCQxKVxyXG59XHJcblxyXG5mdW5jdGlvbiBlb2YgKCkge1xyXG4gIHJldHVybiBpbmRleCQxID49IGxlblxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N0cmluZ1N0YXJ0IChjaHIpIHtcclxuICByZXR1cm4gY2hyID09PSAweDIyIHx8IGNociA9PT0gMHgyN1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUJyYWNrZXQgKGNocikge1xyXG4gIHZhciBpbkJyYWNrZXQgPSAxO1xyXG4gIGV4cHJlc3Npb25Qb3MgPSBpbmRleCQxO1xyXG4gIHdoaWxlICghZW9mKCkpIHtcclxuICAgIGNociA9IG5leHQoKTtcclxuICAgIGlmIChpc1N0cmluZ1N0YXJ0KGNocikpIHtcclxuICAgICAgcGFyc2VTdHJpbmcoY2hyKTtcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuICAgIGlmIChjaHIgPT09IDB4NUIpIHsgaW5CcmFja2V0Kys7IH1cclxuICAgIGlmIChjaHIgPT09IDB4NUQpIHsgaW5CcmFja2V0LS07IH1cclxuICAgIGlmIChpbkJyYWNrZXQgPT09IDApIHtcclxuICAgICAgZXhwcmVzc2lvbkVuZFBvcyA9IGluZGV4JDE7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVN0cmluZyAoY2hyKSB7XHJcbiAgdmFyIHN0cmluZ1F1b3RlID0gY2hyO1xyXG4gIHdoaWxlICghZW9mKCkpIHtcclxuICAgIGNociA9IG5leHQoKTtcclxuICAgIGlmIChjaHIgPT09IHN0cmluZ1F1b3RlKSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBkaXJSRSA9IC9edi18XkB8XjovO1xyXG52YXIgZm9yQWxpYXNSRSA9IC8oLio/KVxccysoPzppbnxvZilcXHMrKC4qKS87XHJcbnZhciBmb3JJdGVyYXRvclJFID0gL1xcKChcXHtbXn1dKlxcfXxbXixdKiksKFteLF0qKSg/OiwoW14sXSopKT9cXCkvO1xyXG52YXIgYmluZFJFID0gL146fF52LWJpbmQ6LztcclxudmFyIG9uUkUgPSAvXkB8XnYtb246LztcclxudmFyIGFyZ1JFID0gLzooLiopJC87XHJcbnZhciBtb2RpZmllclJFID0gL1xcLlteLl0rL2c7XHJcblxyXG52YXIgZGVjb2RlSFRNTENhY2hlZCA9IGNhY2hlZChkZWNvZGUpO1xyXG5cclxuLy8gY29uZmlndXJhYmxlIHN0YXRlXHJcbnZhciB3YXJuJDE7XHJcbnZhciBwbGF0Zm9ybUdldFRhZ05hbWVzcGFjZTtcclxudmFyIHBsYXRmb3JtTXVzdFVzZVByb3A7XHJcbnZhciBwbGF0Zm9ybUlzUHJlVGFnO1xyXG52YXIgcHJlVHJhbnNmb3JtcztcclxudmFyIHRyYW5zZm9ybXM7XHJcbnZhciBwb3N0VHJhbnNmb3JtcztcclxudmFyIGRlbGltaXRlcnM7XHJcblxyXG4vKipcclxuICogQ29udmVydCBIVE1MIHN0cmluZyB0byBBU1QuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZSAoXHJcbiAgdGVtcGxhdGUsXHJcbiAgb3B0aW9uc1xyXG4pIHtcclxuICB3YXJuJDEgPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XHJcbiAgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2UgPSBvcHRpb25zLmdldFRhZ05hbWVzcGFjZSB8fCBubztcclxuICBwbGF0Zm9ybU11c3RVc2VQcm9wID0gb3B0aW9ucy5tdXN0VXNlUHJvcCB8fCBubztcclxuICBwbGF0Zm9ybUlzUHJlVGFnID0gb3B0aW9ucy5pc1ByZVRhZyB8fCBubztcclxuICBwcmVUcmFuc2Zvcm1zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICdwcmVUcmFuc2Zvcm1Ob2RlJyk7XHJcbiAgdHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtTm9kZScpO1xyXG4gIHBvc3RUcmFuc2Zvcm1zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICdwb3N0VHJhbnNmb3JtTm9kZScpO1xyXG4gIGRlbGltaXRlcnMgPSBvcHRpb25zLmRlbGltaXRlcnM7XHJcbiAgdmFyIHN0YWNrID0gW107XHJcbiAgdmFyIHByZXNlcnZlV2hpdGVzcGFjZSA9IG9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlICE9PSBmYWxzZTtcclxuICB2YXIgcm9vdDtcclxuICB2YXIgY3VycmVudFBhcmVudDtcclxuICB2YXIgaW5WUHJlID0gZmFsc2U7XHJcbiAgdmFyIGluUHJlID0gZmFsc2U7XHJcbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xyXG4gIHBhcnNlSFRNTCh0ZW1wbGF0ZSwge1xyXG4gICAgZXhwZWN0SFRNTDogb3B0aW9ucy5leHBlY3RIVE1MLFxyXG4gICAgaXNVbmFyeVRhZzogb3B0aW9ucy5pc1VuYXJ5VGFnLFxyXG4gICAgc2hvdWxkRGVjb2RlTmV3bGluZXM6IG9wdGlvbnMuc2hvdWxkRGVjb2RlTmV3bGluZXMsXHJcbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQgKHRhZywgYXR0cnMsIHVuYXJ5KSB7XHJcbiAgICAgIC8vIGNoZWNrIG5hbWVzcGFjZS5cclxuICAgICAgLy8gaW5oZXJpdCBwYXJlbnQgbnMgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgIHZhciBucyA9IChjdXJyZW50UGFyZW50ICYmIGN1cnJlbnRQYXJlbnQubnMpIHx8IHBsYXRmb3JtR2V0VGFnTmFtZXNwYWNlKHRhZyk7XHJcblxyXG4gICAgICAvLyBoYW5kbGUgSUUgc3ZnIGJ1Z1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGlzSUUgJiYgbnMgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgYXR0cnMgPSBndWFyZElFU1ZHQnVnKGF0dHJzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVsZW1lbnQgPSB7XHJcbiAgICAgICAgdHlwZTogMSxcclxuICAgICAgICB0YWc6IHRhZyxcclxuICAgICAgICBhdHRyc0xpc3Q6IGF0dHJzLFxyXG4gICAgICAgIGF0dHJzTWFwOiBtYWtlQXR0cnNNYXAoYXR0cnMpLFxyXG4gICAgICAgIHBhcmVudDogY3VycmVudFBhcmVudCxcclxuICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgfTtcclxuICAgICAgaWYgKG5zKSB7XHJcbiAgICAgICAgZWxlbWVudC5ucyA9IG5zO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNGb3JiaWRkZW5UYWcoZWxlbWVudCkgJiYgIWlzU2VydmVyUmVuZGVyaW5nKCkpIHtcclxuICAgICAgICBlbGVtZW50LmZvcmJpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybiQxKFxyXG4gICAgICAgICAgJ1RlbXBsYXRlcyBzaG91bGQgb25seSBiZSByZXNwb25zaWJsZSBmb3IgbWFwcGluZyB0aGUgc3RhdGUgdG8gdGhlICcgK1xyXG4gICAgICAgICAgJ1VJLiBBdm9pZCBwbGFjaW5nIHRhZ3Mgd2l0aCBzaWRlLWVmZmVjdHMgaW4geW91ciB0ZW1wbGF0ZXMsIHN1Y2ggYXMgJyArXHJcbiAgICAgICAgICBcIjxcIiArIHRhZyArIFwiPlwiICsgJywgYXMgdGhleSB3aWxsIG5vdCBiZSBwYXJzZWQuJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFwcGx5IHByZS10cmFuc2Zvcm1zXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlVHJhbnNmb3Jtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHByZVRyYW5zZm9ybXNbaV0oZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghaW5WUHJlKSB7XHJcbiAgICAgICAgcHJvY2Vzc1ByZShlbGVtZW50KTtcclxuICAgICAgICBpZiAoZWxlbWVudC5wcmUpIHtcclxuICAgICAgICAgIGluVlByZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwbGF0Zm9ybUlzUHJlVGFnKGVsZW1lbnQudGFnKSkge1xyXG4gICAgICAgIGluUHJlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW5WUHJlKSB7XHJcbiAgICAgICAgcHJvY2Vzc1Jhd0F0dHJzKGVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb2Nlc3NGb3IoZWxlbWVudCk7XHJcbiAgICAgICAgcHJvY2Vzc0lmKGVsZW1lbnQpO1xyXG4gICAgICAgIHByb2Nlc3NPbmNlKGVsZW1lbnQpO1xyXG4gICAgICAgIHByb2Nlc3NLZXkoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIC8vIGRldGVybWluZSB3aGV0aGVyIHRoaXMgaXMgYSBwbGFpbiBlbGVtZW50IGFmdGVyXHJcbiAgICAgICAgLy8gcmVtb3Zpbmcgc3RydWN0dXJhbCBhdHRyaWJ1dGVzXHJcbiAgICAgICAgZWxlbWVudC5wbGFpbiA9ICFlbGVtZW50LmtleSAmJiAhYXR0cnMubGVuZ3RoO1xyXG5cclxuICAgICAgICBwcm9jZXNzUmVmKGVsZW1lbnQpO1xyXG4gICAgICAgIHByb2Nlc3NTbG90KGVsZW1lbnQpO1xyXG4gICAgICAgIHByb2Nlc3NDb21wb25lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdHJhbnNmb3Jtcy5sZW5ndGg7IGkkMSsrKSB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm1zW2kkMV0oZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NBdHRycyhlbGVtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tSb290Q29uc3RyYWludHMgKGVsKSB7XHJcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmICF3YXJuZWQpIHtcclxuICAgICAgICAgIGlmIChlbC50YWcgPT09ICdzbG90JyB8fCBlbC50YWcgPT09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgICAgICAgd2FybmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgd2FybiQxKFxyXG4gICAgICAgICAgICAgIFwiQ2Fubm90IHVzZSA8XCIgKyAoZWwudGFnKSArIFwiPiBhcyBjb21wb25lbnQgcm9vdCBlbGVtZW50IGJlY2F1c2UgaXQgbWF5IFwiICtcclxuICAgICAgICAgICAgICAnY29udGFpbiBtdWx0aXBsZSBub2RlczpcXG4nICsgdGVtcGxhdGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChlbC5hdHRyc01hcC5oYXNPd25Qcm9wZXJ0eSgndi1mb3InKSkge1xyXG4gICAgICAgICAgICB3YXJuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB3YXJuJDEoXHJcbiAgICAgICAgICAgICAgJ0Nhbm5vdCB1c2Ugdi1mb3Igb24gc3RhdGVmdWwgY29tcG9uZW50IHJvb3QgZWxlbWVudCBiZWNhdXNlICcgK1xyXG4gICAgICAgICAgICAgICdpdCByZW5kZXJzIG11bHRpcGxlIGVsZW1lbnRzOlxcbicgKyB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdHJlZSBtYW5hZ2VtZW50XHJcbiAgICAgIGlmICghcm9vdCkge1xyXG4gICAgICAgIHJvb3QgPSBlbGVtZW50O1xyXG4gICAgICAgIGNoZWNrUm9vdENvbnN0cmFpbnRzKHJvb3QpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzdGFjay5sZW5ndGgpIHtcclxuICAgICAgICAvLyBhbGxvdyByb290IGVsZW1lbnRzIHdpdGggdi1pZiwgdi1lbHNlLWlmIGFuZCB2LWVsc2VcclxuICAgICAgICBpZiAocm9vdC5pZiAmJiAoZWxlbWVudC5lbHNlaWYgfHwgZWxlbWVudC5lbHNlKSkge1xyXG4gICAgICAgICAgY2hlY2tSb290Q29uc3RyYWludHMoZWxlbWVudCk7XHJcbiAgICAgICAgICBhZGRJZkNvbmRpdGlvbihyb290LCB7XHJcbiAgICAgICAgICAgIGV4cDogZWxlbWVudC5lbHNlaWYsXHJcbiAgICAgICAgICAgIGJsb2NrOiBlbGVtZW50XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmICF3YXJuZWQpIHtcclxuICAgICAgICAgIHdhcm5lZCA9IHRydWU7XHJcbiAgICAgICAgICB3YXJuJDEoXHJcbiAgICAgICAgICAgIFwiQ29tcG9uZW50IHRlbXBsYXRlIHNob3VsZCBjb250YWluIGV4YWN0bHkgb25lIHJvb3QgZWxlbWVudDpcIiArXHJcbiAgICAgICAgICAgIFwiXFxuXFxuXCIgKyB0ZW1wbGF0ZSArIFwiXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICBcIklmIHlvdSBhcmUgdXNpbmcgdi1pZiBvbiBtdWx0aXBsZSBlbGVtZW50cywgXCIgK1xyXG4gICAgICAgICAgICBcInVzZSB2LWVsc2UtaWYgdG8gY2hhaW4gdGhlbSBpbnN0ZWFkLlwiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VycmVudFBhcmVudCAmJiAhZWxlbWVudC5mb3JiaWRkZW4pIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5lbHNlaWYgfHwgZWxlbWVudC5lbHNlKSB7XHJcbiAgICAgICAgICBwcm9jZXNzSWZDb25kaXRpb25zKGVsZW1lbnQsIGN1cnJlbnRQYXJlbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5zbG90U2NvcGUpIHsgLy8gc2NvcGVkIHNsb3RcclxuICAgICAgICAgIGN1cnJlbnRQYXJlbnQucGxhaW4gPSBmYWxzZTtcclxuICAgICAgICAgIHZhciBuYW1lID0gZWxlbWVudC5zbG90VGFyZ2V0IHx8ICdkZWZhdWx0JzsoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyB8fCAoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyA9IHt9KSlbbmFtZV0gPSBlbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICBlbGVtZW50LnBhcmVudCA9IGN1cnJlbnRQYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghdW5hcnkpIHtcclxuICAgICAgICBjdXJyZW50UGFyZW50ID0gZWxlbWVudDtcclxuICAgICAgICBzdGFjay5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGFwcGx5IHBvc3QtdHJhbnNmb3Jtc1xyXG4gICAgICBmb3IgKHZhciBpJDIgPSAwOyBpJDIgPCBwb3N0VHJhbnNmb3Jtcy5sZW5ndGg7IGkkMisrKSB7XHJcbiAgICAgICAgcG9zdFRyYW5zZm9ybXNbaSQyXShlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlbmQ6IGZ1bmN0aW9uIGVuZCAoKSB7XHJcbiAgICAgIC8vIHJlbW92ZSB0cmFpbGluZyB3aGl0ZXNwYWNlXHJcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICAgIHZhciBsYXN0Tm9kZSA9IGVsZW1lbnQuY2hpbGRyZW5bZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggLSAxXTtcclxuICAgICAgaWYgKGxhc3ROb2RlICYmIGxhc3ROb2RlLnR5cGUgPT09IDMgJiYgbGFzdE5vZGUudGV4dCA9PT0gJyAnKSB7XHJcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbi5wb3AoKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBwb3Agc3RhY2tcclxuICAgICAgc3RhY2subGVuZ3RoIC09IDE7XHJcbiAgICAgIGN1cnJlbnRQYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcclxuICAgICAgLy8gY2hlY2sgcHJlIHN0YXRlXHJcbiAgICAgIGlmIChlbGVtZW50LnByZSkge1xyXG4gICAgICAgIGluVlByZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwbGF0Zm9ybUlzUHJlVGFnKGVsZW1lbnQudGFnKSkge1xyXG4gICAgICAgIGluUHJlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2hhcnM6IGZ1bmN0aW9uIGNoYXJzICh0ZXh0KSB7XHJcbiAgICAgIGlmICghY3VycmVudFBhcmVudCkge1xyXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhd2FybmVkICYmIHRleHQgPT09IHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICB3YXJuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgd2FybiQxKFxyXG4gICAgICAgICAgICAnQ29tcG9uZW50IHRlbXBsYXRlIHJlcXVpcmVzIGEgcm9vdCBlbGVtZW50LCByYXRoZXIgdGhhbiBqdXN0IHRleHQ6XFxuXFxuJyArIHRlbXBsYXRlXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICAvLyBJRSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBidWdcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmIChpc0lFICYmXHJcbiAgICAgICAgICBjdXJyZW50UGFyZW50LnRhZyA9PT0gJ3RleHRhcmVhJyAmJlxyXG4gICAgICAgICAgY3VycmVudFBhcmVudC5hdHRyc01hcC5wbGFjZWhvbGRlciA9PT0gdGV4dCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IGN1cnJlbnRQYXJlbnQuY2hpbGRyZW47XHJcbiAgICAgIHRleHQgPSBpblByZSB8fCB0ZXh0LnRyaW0oKVxyXG4gICAgICAgID8gZGVjb2RlSFRNTENhY2hlZCh0ZXh0KVxyXG4gICAgICAgIC8vIG9ubHkgcHJlc2VydmUgd2hpdGVzcGFjZSBpZiBpdHMgbm90IHJpZ2h0IGFmdGVyIGEgc3RhcnRpbmcgdGFnXHJcbiAgICAgICAgOiBwcmVzZXJ2ZVdoaXRlc3BhY2UgJiYgY2hpbGRyZW4ubGVuZ3RoID8gJyAnIDogJyc7XHJcbiAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgdmFyIGV4cHJlc3Npb247XHJcbiAgICAgICAgaWYgKCFpblZQcmUgJiYgdGV4dCAhPT0gJyAnICYmIChleHByZXNzaW9uID0gcGFyc2VUZXh0KHRleHQsIGRlbGltaXRlcnMpKSkge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IDIsXHJcbiAgICAgICAgICAgIGV4cHJlc3Npb246IGV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGV4dCAhPT0gJyAnIHx8IGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdLnRleHQgIT09ICcgJykge1xyXG4gICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogMyxcclxuICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJvb3RcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1ByZSAoZWwpIHtcclxuICBpZiAoZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtcHJlJykgIT0gbnVsbCkge1xyXG4gICAgZWwucHJlID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NSYXdBdHRycyAoZWwpIHtcclxuICB2YXIgbCA9IGVsLmF0dHJzTGlzdC5sZW5ndGg7XHJcbiAgaWYgKGwpIHtcclxuICAgIHZhciBhdHRycyA9IGVsLmF0dHJzID0gbmV3IEFycmF5KGwpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgYXR0cnNbaV0gPSB7XHJcbiAgICAgICAgbmFtZTogZWwuYXR0cnNMaXN0W2ldLm5hbWUsXHJcbiAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KGVsLmF0dHJzTGlzdFtpXS52YWx1ZSlcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKCFlbC5wcmUpIHtcclxuICAgIC8vIG5vbiByb290IG5vZGUgaW4gcHJlIGJsb2NrcyB3aXRoIG5vIGF0dHJpYnV0ZXNcclxuICAgIGVsLnBsYWluID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NLZXkgKGVsKSB7XHJcbiAgdmFyIGV4cCA9IGdldEJpbmRpbmdBdHRyKGVsLCAna2V5Jyk7XHJcbiAgaWYgKGV4cCkge1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGVsLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICB3YXJuJDEoXCI8dGVtcGxhdGU+IGNhbm5vdCBiZSBrZXllZC4gUGxhY2UgdGhlIGtleSBvbiByZWFsIGVsZW1lbnRzIGluc3RlYWQuXCIpO1xyXG4gICAgfVxyXG4gICAgZWwua2V5ID0gZXhwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1JlZiAoZWwpIHtcclxuICB2YXIgcmVmID0gZ2V0QmluZGluZ0F0dHIoZWwsICdyZWYnKTtcclxuICBpZiAocmVmKSB7XHJcbiAgICBlbC5yZWYgPSByZWY7XHJcbiAgICBlbC5yZWZJbkZvciA9IGNoZWNrSW5Gb3IoZWwpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0ZvciAoZWwpIHtcclxuICB2YXIgZXhwO1xyXG4gIGlmICgoZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtZm9yJykpKSB7XHJcbiAgICB2YXIgaW5NYXRjaCA9IGV4cC5tYXRjaChmb3JBbGlhc1JFKTtcclxuICAgIGlmICghaW5NYXRjaCkge1xyXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuJDEoXHJcbiAgICAgICAgKFwiSW52YWxpZCB2LWZvciBleHByZXNzaW9uOiBcIiArIGV4cClcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBlbC5mb3IgPSBpbk1hdGNoWzJdLnRyaW0oKTtcclxuICAgIHZhciBhbGlhcyA9IGluTWF0Y2hbMV0udHJpbSgpO1xyXG4gICAgdmFyIGl0ZXJhdG9yTWF0Y2ggPSBhbGlhcy5tYXRjaChmb3JJdGVyYXRvclJFKTtcclxuICAgIGlmIChpdGVyYXRvck1hdGNoKSB7XHJcbiAgICAgIGVsLmFsaWFzID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XHJcbiAgICAgIGVsLml0ZXJhdG9yMSA9IGl0ZXJhdG9yTWF0Y2hbMl0udHJpbSgpO1xyXG4gICAgICBpZiAoaXRlcmF0b3JNYXRjaFszXSkge1xyXG4gICAgICAgIGVsLml0ZXJhdG9yMiA9IGl0ZXJhdG9yTWF0Y2hbM10udHJpbSgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbC5hbGlhcyA9IGFsaWFzO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0lmIChlbCkge1xyXG4gIHZhciBleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1pZicpO1xyXG4gIGlmIChleHApIHtcclxuICAgIGVsLmlmID0gZXhwO1xyXG4gICAgYWRkSWZDb25kaXRpb24oZWwsIHtcclxuICAgICAgZXhwOiBleHAsXHJcbiAgICAgIGJsb2NrOiBlbFxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1lbHNlJykgIT0gbnVsbCkge1xyXG4gICAgICBlbC5lbHNlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHZhciBlbHNlaWYgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1lbHNlLWlmJyk7XHJcbiAgICBpZiAoZWxzZWlmKSB7XHJcbiAgICAgIGVsLmVsc2VpZiA9IGVsc2VpZjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NJZkNvbmRpdGlvbnMgKGVsLCBwYXJlbnQpIHtcclxuICB2YXIgcHJldiA9IGZpbmRQcmV2RWxlbWVudChwYXJlbnQuY2hpbGRyZW4pO1xyXG4gIGlmIChwcmV2ICYmIHByZXYuaWYpIHtcclxuICAgIGFkZElmQ29uZGl0aW9uKHByZXYsIHtcclxuICAgICAgZXhwOiBlbC5lbHNlaWYsXHJcbiAgICAgIGJsb2NrOiBlbFxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdhcm4kMShcclxuICAgICAgXCJ2LVwiICsgKGVsLmVsc2VpZiA/ICgnZWxzZS1pZj1cIicgKyBlbC5lbHNlaWYgKyAnXCInKSA6ICdlbHNlJykgKyBcIiBcIiArXHJcbiAgICAgIFwidXNlZCBvbiBlbGVtZW50IDxcIiArIChlbC50YWcpICsgXCI+IHdpdGhvdXQgY29ycmVzcG9uZGluZyB2LWlmLlwiXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFByZXZFbGVtZW50IChjaGlsZHJlbikge1xyXG4gIHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoO1xyXG4gIHdoaWxlIChpLS0pIHtcclxuICAgIGlmIChjaGlsZHJlbltpXS50eXBlID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBjaGlsZHJlbltpXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuW2ldLnRleHQgIT09ICcgJykge1xyXG4gICAgICAgIHdhcm4kMShcclxuICAgICAgICAgIFwidGV4dCBcXFwiXCIgKyAoY2hpbGRyZW5baV0udGV4dC50cmltKCkpICsgXCJcXFwiIGJldHdlZW4gdi1pZiBhbmQgdi1lbHNlKC1pZikgXCIgK1xyXG4gICAgICAgICAgXCJ3aWxsIGJlIGlnbm9yZWQuXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIGNoaWxkcmVuLnBvcCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSWZDb25kaXRpb24gKGVsLCBjb25kaXRpb24pIHtcclxuICBpZiAoIWVsLmlmQ29uZGl0aW9ucykge1xyXG4gICAgZWwuaWZDb25kaXRpb25zID0gW107XHJcbiAgfVxyXG4gIGVsLmlmQ29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NPbmNlIChlbCkge1xyXG4gIHZhciBvbmNlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3Ytb25jZScpO1xyXG4gIGlmIChvbmNlICE9IG51bGwpIHtcclxuICAgIGVsLm9uY2UgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1Nsb3QgKGVsKSB7XHJcbiAgaWYgKGVsLnRhZyA9PT0gJ3Nsb3QnKSB7XHJcbiAgICBlbC5zbG90TmFtZSA9IGdldEJpbmRpbmdBdHRyKGVsLCAnbmFtZScpO1xyXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGVsLmtleSkge1xyXG4gICAgICB3YXJuJDEoXHJcbiAgICAgICAgXCJga2V5YCBkb2VzIG5vdCB3b3JrIG9uIDxzbG90PiBiZWNhdXNlIHNsb3RzIGFyZSBhYnN0cmFjdCBvdXRsZXRzIFwiICtcclxuICAgICAgICBcImFuZCBjYW4gcG9zc2libHkgZXhwYW5kIGludG8gbXVsdGlwbGUgZWxlbWVudHMuIFwiICtcclxuICAgICAgICBcIlVzZSB0aGUga2V5IG9uIGEgd3JhcHBpbmcgZWxlbWVudCBpbnN0ZWFkLlwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBzbG90VGFyZ2V0ID0gZ2V0QmluZGluZ0F0dHIoZWwsICdzbG90Jyk7XHJcbiAgICBpZiAoc2xvdFRhcmdldCkge1xyXG4gICAgICBlbC5zbG90VGFyZ2V0ID0gc2xvdFRhcmdldCA9PT0gJ1wiXCInID8gJ1wiZGVmYXVsdFwiJyA6IHNsb3RUYXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZiAoZWwudGFnID09PSAndGVtcGxhdGUnKSB7XHJcbiAgICAgIGVsLnNsb3RTY29wZSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICdzY29wZScpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0NvbXBvbmVudCAoZWwpIHtcclxuICB2YXIgYmluZGluZztcclxuICBpZiAoKGJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ2lzJykpKSB7XHJcbiAgICBlbC5jb21wb25lbnQgPSBiaW5kaW5nO1xyXG4gIH1cclxuICBpZiAoZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ2lubGluZS10ZW1wbGF0ZScpICE9IG51bGwpIHtcclxuICAgIGVsLmlubGluZVRlbXBsYXRlID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NBdHRycyAoZWwpIHtcclxuICB2YXIgbGlzdCA9IGVsLmF0dHJzTGlzdDtcclxuICB2YXIgaSwgbCwgbmFtZSwgcmF3TmFtZSwgdmFsdWUsIGFyZywgbW9kaWZpZXJzLCBpc1Byb3A7XHJcbiAgZm9yIChpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBuYW1lID0gcmF3TmFtZSA9IGxpc3RbaV0ubmFtZTtcclxuICAgIHZhbHVlID0gbGlzdFtpXS52YWx1ZTtcclxuICAgIGlmIChkaXJSRS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgIC8vIG1hcmsgZWxlbWVudCBhcyBkeW5hbWljXHJcbiAgICAgIGVsLmhhc0JpbmRpbmdzID0gdHJ1ZTtcclxuICAgICAgLy8gbW9kaWZpZXJzXHJcbiAgICAgIG1vZGlmaWVycyA9IHBhcnNlTW9kaWZpZXJzKG5hbWUpO1xyXG4gICAgICBpZiAobW9kaWZpZXJzKSB7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShtb2RpZmllclJFLCAnJyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGJpbmRSRS50ZXN0KG5hbWUpKSB7IC8vIHYtYmluZFxyXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoYmluZFJFLCAnJyk7XHJcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZpbHRlcnModmFsdWUpO1xyXG4gICAgICAgIGlzUHJvcCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtb2RpZmllcnMpIHtcclxuICAgICAgICAgIGlmIChtb2RpZmllcnMucHJvcCkge1xyXG4gICAgICAgICAgICBpc1Byb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICBuYW1lID0gY2FtZWxpemUobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaW5uZXJIdG1sJykgeyBuYW1lID0gJ2lubmVySFRNTCc7IH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChtb2RpZmllcnMuY2FtZWwpIHtcclxuICAgICAgICAgICAgbmFtZSA9IGNhbWVsaXplKG5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNQcm9wIHx8IHBsYXRmb3JtTXVzdFVzZVByb3AoZWwudGFnLCBlbC5hdHRyc01hcC50eXBlLCBuYW1lKSkge1xyXG4gICAgICAgICAgYWRkUHJvcChlbCwgbmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZGRBdHRyKGVsLCBuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKG9uUkUudGVzdChuYW1lKSkgeyAvLyB2LW9uXHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShvblJFLCAnJyk7XHJcbiAgICAgICAgYWRkSGFuZGxlcihlbCwgbmFtZSwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgICAgIH0gZWxzZSB7IC8vIG5vcm1hbCBkaXJlY3RpdmVzXHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShkaXJSRSwgJycpO1xyXG4gICAgICAgIC8vIHBhcnNlIGFyZ1xyXG4gICAgICAgIHZhciBhcmdNYXRjaCA9IG5hbWUubWF0Y2goYXJnUkUpO1xyXG4gICAgICAgIGlmIChhcmdNYXRjaCAmJiAoYXJnID0gYXJnTWF0Y2hbMV0pKSB7XHJcbiAgICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgwLCAtKGFyZy5sZW5ndGggKyAxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZERpcmVjdGl2ZShlbCwgbmFtZSwgcmF3TmFtZSwgdmFsdWUsIGFyZywgbW9kaWZpZXJzKTtcclxuICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgbmFtZSA9PT0gJ21vZGVsJykge1xyXG4gICAgICAgICAgY2hlY2tGb3JBbGlhc01vZGVsKGVsLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBsaXRlcmFsIGF0dHJpYnV0ZVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBwYXJzZVRleHQodmFsdWUsIGRlbGltaXRlcnMpO1xyXG4gICAgICAgIGlmIChleHByZXNzaW9uKSB7XHJcbiAgICAgICAgICB3YXJuJDEoXHJcbiAgICAgICAgICAgIG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIjogXCIgK1xyXG4gICAgICAgICAgICAnSW50ZXJwb2xhdGlvbiBpbnNpZGUgYXR0cmlidXRlcyBoYXMgYmVlbiByZW1vdmVkLiAnICtcclxuICAgICAgICAgICAgJ1VzZSB2LWJpbmQgb3IgdGhlIGNvbG9uIHNob3J0aGFuZCBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgJyArXHJcbiAgICAgICAgICAgICdpbnN0ZWFkIG9mIDxkaXYgaWQ9XCJ7eyB2YWwgfX1cIj4sIHVzZSA8ZGl2IDppZD1cInZhbFwiPi4nXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBhZGRBdHRyKGVsLCBuYW1lLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tJbkZvciAoZWwpIHtcclxuICB2YXIgcGFyZW50ID0gZWw7XHJcbiAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgaWYgKHBhcmVudC5mb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTW9kaWZpZXJzIChuYW1lKSB7XHJcbiAgdmFyIG1hdGNoID0gbmFtZS5tYXRjaChtb2RpZmllclJFKTtcclxuICBpZiAobWF0Y2gpIHtcclxuICAgIHZhciByZXQgPSB7fTtcclxuICAgIG1hdGNoLmZvckVhY2goZnVuY3Rpb24gKG0pIHsgcmV0W20uc2xpY2UoMSldID0gdHJ1ZTsgfSk7XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlQXR0cnNNYXAgKGF0dHJzKSB7XHJcbiAgdmFyIG1hcCA9IHt9O1xyXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgbWFwW2F0dHJzW2ldLm5hbWVdICYmICFpc0lFKSB7XHJcbiAgICAgIHdhcm4kMSgnZHVwbGljYXRlIGF0dHJpYnV0ZTogJyArIGF0dHJzW2ldLm5hbWUpO1xyXG4gICAgfVxyXG4gICAgbWFwW2F0dHJzW2ldLm5hbWVdID0gYXR0cnNbaV0udmFsdWU7XHJcbiAgfVxyXG4gIHJldHVybiBtYXBcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGb3JiaWRkZW5UYWcgKGVsKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIGVsLnRhZyA9PT0gJ3N0eWxlJyB8fFxyXG4gICAgKGVsLnRhZyA9PT0gJ3NjcmlwdCcgJiYgKFxyXG4gICAgICAhZWwuYXR0cnNNYXAudHlwZSB8fFxyXG4gICAgICBlbC5hdHRyc01hcC50eXBlID09PSAndGV4dC9qYXZhc2NyaXB0J1xyXG4gICAgKSlcclxuICApXHJcbn1cclxuXHJcbnZhciBpZU5TQnVnID0gL154bWxuczpOU1xcZCsvO1xyXG52YXIgaWVOU1ByZWZpeCA9IC9eTlNcXGQrOi87XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG5mdW5jdGlvbiBndWFyZElFU1ZHQnVnIChhdHRycykge1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG4gICAgaWYgKCFpZU5TQnVnLnRlc3QoYXR0ci5uYW1lKSkge1xyXG4gICAgICBhdHRyLm5hbWUgPSBhdHRyLm5hbWUucmVwbGFjZShpZU5TUHJlZml4LCAnJyk7XHJcbiAgICAgIHJlcy5wdXNoKGF0dHIpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrRm9yQWxpYXNNb2RlbCAoZWwsIHZhbHVlKSB7XHJcbiAgdmFyIF9lbCA9IGVsO1xyXG4gIHdoaWxlIChfZWwpIHtcclxuICAgIGlmIChfZWwuZm9yICYmIF9lbC5hbGlhcyA9PT0gdmFsdWUpIHtcclxuICAgICAgd2FybiQxKFxyXG4gICAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPjogXCIgK1xyXG4gICAgICAgIFwiWW91IGFyZSBiaW5kaW5nIHYtbW9kZWwgZGlyZWN0bHkgdG8gYSB2LWZvciBpdGVyYXRpb24gYWxpYXMuIFwiICtcclxuICAgICAgICBcIlRoaXMgd2lsbCBub3QgYmUgYWJsZSB0byBtb2RpZnkgdGhlIHYtZm9yIHNvdXJjZSBhcnJheSBiZWNhdXNlIFwiICtcclxuICAgICAgICBcIndyaXRpbmcgdG8gdGhlIGFsaWFzIGlzIGxpa2UgbW9kaWZ5aW5nIGEgZnVuY3Rpb24gbG9jYWwgdmFyaWFibGUuIFwiICtcclxuICAgICAgICBcIkNvbnNpZGVyIHVzaW5nIGFuIGFycmF5IG9mIG9iamVjdHMgYW5kIHVzZSB2LW1vZGVsIG9uIGFuIG9iamVjdCBwcm9wZXJ0eSBpbnN0ZWFkLlwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBfZWwgPSBfZWwucGFyZW50O1xyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgaXNTdGF0aWNLZXk7XHJcbnZhciBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWc7XHJcblxyXG52YXIgZ2VuU3RhdGljS2V5c0NhY2hlZCA9IGNhY2hlZChnZW5TdGF0aWNLZXlzJDEpO1xyXG5cclxuLyoqXHJcbiAqIEdvYWwgb2YgdGhlIG9wdGltaXplcjogd2FsayB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlIEFTVCB0cmVlXHJcbiAqIGFuZCBkZXRlY3Qgc3ViLXRyZWVzIHRoYXQgYXJlIHB1cmVseSBzdGF0aWMsIGkuZS4gcGFydHMgb2ZcclxuICogdGhlIERPTSB0aGF0IG5ldmVyIG5lZWRzIHRvIGNoYW5nZS5cclxuICpcclxuICogT25jZSB3ZSBkZXRlY3QgdGhlc2Ugc3ViLXRyZWVzLCB3ZSBjYW46XHJcbiAqXHJcbiAqIDEuIEhvaXN0IHRoZW0gaW50byBjb25zdGFudHMsIHNvIHRoYXQgd2Ugbm8gbG9uZ2VyIG5lZWQgdG9cclxuICogICAgY3JlYXRlIGZyZXNoIG5vZGVzIGZvciB0aGVtIG9uIGVhY2ggcmUtcmVuZGVyO1xyXG4gKiAyLiBDb21wbGV0ZWx5IHNraXAgdGhlbSBpbiB0aGUgcGF0Y2hpbmcgcHJvY2Vzcy5cclxuICovXHJcbmZ1bmN0aW9uIG9wdGltaXplIChyb290LCBvcHRpb25zKSB7XHJcbiAgaWYgKCFyb290KSB7IHJldHVybiB9XHJcbiAgaXNTdGF0aWNLZXkgPSBnZW5TdGF0aWNLZXlzQ2FjaGVkKG9wdGlvbnMuc3RhdGljS2V5cyB8fCAnJyk7XHJcbiAgaXNQbGF0Zm9ybVJlc2VydmVkVGFnID0gb3B0aW9ucy5pc1Jlc2VydmVkVGFnIHx8IG5vO1xyXG4gIC8vIGZpcnN0IHBhc3M6IG1hcmsgYWxsIG5vbi1zdGF0aWMgbm9kZXMuXHJcbiAgbWFya1N0YXRpYyhyb290KTtcclxuICAvLyBzZWNvbmQgcGFzczogbWFyayBzdGF0aWMgcm9vdHMuXHJcbiAgbWFya1N0YXRpY1Jvb3RzKHJvb3QsIGZhbHNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuU3RhdGljS2V5cyQxIChrZXlzKSB7XHJcbiAgcmV0dXJuIG1ha2VNYXAoXHJcbiAgICAndHlwZSx0YWcsYXR0cnNMaXN0LGF0dHJzTWFwLHBsYWluLHBhcmVudCxjaGlsZHJlbixhdHRycycgK1xyXG4gICAgKGtleXMgPyAnLCcgKyBrZXlzIDogJycpXHJcbiAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXJrU3RhdGljIChub2RlKSB7XHJcbiAgbm9kZS5zdGF0aWMgPSBpc1N0YXRpYyhub2RlKTtcclxuICBpZiAobm9kZS50eXBlID09PSAxKSB7XHJcbiAgICAvLyBkbyBub3QgbWFrZSBjb21wb25lbnQgc2xvdCBjb250ZW50IHN0YXRpYy4gdGhpcyBhdm9pZHNcclxuICAgIC8vIDEuIGNvbXBvbmVudHMgbm90IGFibGUgdG8gbXV0YXRlIHNsb3Qgbm9kZXNcclxuICAgIC8vIDIuIHN0YXRpYyBzbG90IGNvbnRlbnQgZmFpbHMgZm9yIGhvdC1yZWxvYWRpbmdcclxuICAgIGlmIChcclxuICAgICAgIWlzUGxhdGZvcm1SZXNlcnZlZFRhZyhub2RlLnRhZykgJiZcclxuICAgICAgbm9kZS50YWcgIT09ICdzbG90JyAmJlxyXG4gICAgICBub2RlLmF0dHJzTWFwWydpbmxpbmUtdGVtcGxhdGUnXSA9PSBudWxsXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XHJcbiAgICAgIG1hcmtTdGF0aWMoY2hpbGQpO1xyXG4gICAgICBpZiAoIWNoaWxkLnN0YXRpYykge1xyXG4gICAgICAgIG5vZGUuc3RhdGljID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcmtTdGF0aWNSb290cyAobm9kZSwgaXNJbkZvcikge1xyXG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcclxuICAgIGlmIChub2RlLnN0YXRpYyB8fCBub2RlLm9uY2UpIHtcclxuICAgICAgbm9kZS5zdGF0aWNJbkZvciA9IGlzSW5Gb3I7XHJcbiAgICB9XHJcbiAgICAvLyBGb3IgYSBub2RlIHRvIHF1YWxpZnkgYXMgYSBzdGF0aWMgcm9vdCwgaXQgc2hvdWxkIGhhdmUgY2hpbGRyZW4gdGhhdFxyXG4gICAgLy8gYXJlIG5vdCBqdXN0IHN0YXRpYyB0ZXh0LiBPdGhlcndpc2UgdGhlIGNvc3Qgb2YgaG9pc3Rpbmcgb3V0IHdpbGxcclxuICAgIC8vIG91dHdlaWdoIHRoZSBiZW5lZml0cyBhbmQgaXQncyBiZXR0ZXIgb2ZmIHRvIGp1c3QgYWx3YXlzIHJlbmRlciBpdCBmcmVzaC5cclxuICAgIGlmIChub2RlLnN0YXRpYyAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCAmJiAhKFxyXG4gICAgICBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJlxyXG4gICAgICBub2RlLmNoaWxkcmVuWzBdLnR5cGUgPT09IDNcclxuICAgICkpIHtcclxuICAgICAgbm9kZS5zdGF0aWNSb290ID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlLnN0YXRpY1Jvb3QgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBtYXJrU3RhdGljUm9vdHMobm9kZS5jaGlsZHJlbltpXSwgaXNJbkZvciB8fCAhIW5vZGUuZm9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUuaWZDb25kaXRpb25zKSB7XHJcbiAgICAgIHdhbGtUaHJvdWdoQ29uZGl0aW9uc0Jsb2Nrcyhub2RlLmlmQ29uZGl0aW9ucywgaXNJbkZvcik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3YWxrVGhyb3VnaENvbmRpdGlvbnNCbG9ja3MgKGNvbmRpdGlvbkJsb2NrcywgaXNJbkZvcikge1xyXG4gIGZvciAodmFyIGkgPSAxLCBsZW4gPSBjb25kaXRpb25CbG9ja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIG1hcmtTdGF0aWNSb290cyhjb25kaXRpb25CbG9ja3NbaV0uYmxvY2ssIGlzSW5Gb3IpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdGF0aWMgKG5vZGUpIHtcclxuICBpZiAobm9kZS50eXBlID09PSAyKSB7IC8vIGV4cHJlc3Npb25cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuICBpZiAobm9kZS50eXBlID09PSAzKSB7IC8vIHRleHRcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG4gIHJldHVybiAhIShub2RlLnByZSB8fCAoXHJcbiAgICAhbm9kZS5oYXNCaW5kaW5ncyAmJiAvLyBubyBkeW5hbWljIGJpbmRpbmdzXHJcbiAgICAhbm9kZS5pZiAmJiAhbm9kZS5mb3IgJiYgLy8gbm90IHYtaWYgb3Igdi1mb3Igb3Igdi1lbHNlXHJcbiAgICAhaXNCdWlsdEluVGFnKG5vZGUudGFnKSAmJiAvLyBub3QgYSBidWlsdC1pblxyXG4gICAgaXNQbGF0Zm9ybVJlc2VydmVkVGFnKG5vZGUudGFnKSAmJiAvLyBub3QgYSBjb21wb25lbnRcclxuICAgICFpc0RpcmVjdENoaWxkT2ZUZW1wbGF0ZUZvcihub2RlKSAmJlxyXG4gICAgT2JqZWN0LmtleXMobm9kZSkuZXZlcnkoaXNTdGF0aWNLZXkpXHJcbiAgKSlcclxufVxyXG5cclxuZnVuY3Rpb24gaXNEaXJlY3RDaGlsZE9mVGVtcGxhdGVGb3IgKG5vZGUpIHtcclxuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcclxuICAgIG5vZGUgPSBub2RlLnBhcmVudDtcclxuICAgIGlmIChub2RlLnRhZyAhPT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGlmIChub2RlLmZvcikge1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2VcclxufVxyXG5cclxuLyogICovXHJcblxyXG52YXIgZm5FeHBSRSA9IC9eXFxzKihbXFx3JF9dK3xcXChbXildKj9cXCkpXFxzKj0+fF5mdW5jdGlvblxccypcXCgvO1xyXG52YXIgc2ltcGxlUGF0aFJFID0gL15cXHMqW0EtWmEtel8kXVtcXHckXSooPzpcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFsnLio/J118XFxbXCIuKj9cIl18XFxbXFxkK118XFxbW0EtWmEtel8kXVtcXHckXSpdKSpcXHMqJC87XHJcblxyXG4vLyBrZXlDb2RlIGFsaWFzZXNcclxudmFyIGtleUNvZGVzID0ge1xyXG4gIGVzYzogMjcsXHJcbiAgdGFiOiA5LFxyXG4gIGVudGVyOiAxMyxcclxuICBzcGFjZTogMzIsXHJcbiAgdXA6IDM4LFxyXG4gIGxlZnQ6IDM3LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICAnZGVsZXRlJzogWzgsIDQ2XVxyXG59O1xyXG5cclxudmFyIG1vZGlmaWVyQ29kZSA9IHtcclxuICBzdG9wOiAnJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOycsXHJcbiAgcHJldmVudDogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpOycsXHJcbiAgc2VsZjogJ2lmKCRldmVudC50YXJnZXQgIT09ICRldmVudC5jdXJyZW50VGFyZ2V0KXJldHVybjsnLFxyXG4gIGN0cmw6ICdpZighJGV2ZW50LmN0cmxLZXkpcmV0dXJuOycsXHJcbiAgc2hpZnQ6ICdpZighJGV2ZW50LnNoaWZ0S2V5KXJldHVybjsnLFxyXG4gIGFsdDogJ2lmKCEkZXZlbnQuYWx0S2V5KXJldHVybjsnLFxyXG4gIG1ldGE6ICdpZighJGV2ZW50Lm1ldGFLZXkpcmV0dXJuOydcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdlbkhhbmRsZXJzIChldmVudHMsIG5hdGl2ZSkge1xyXG4gIHZhciByZXMgPSBuYXRpdmUgPyAnbmF0aXZlT246eycgOiAnb246eyc7XHJcbiAgZm9yICh2YXIgbmFtZSBpbiBldmVudHMpIHtcclxuICAgIHJlcyArPSBcIlxcXCJcIiArIG5hbWUgKyBcIlxcXCI6XCIgKyAoZ2VuSGFuZGxlcihuYW1lLCBldmVudHNbbmFtZV0pKSArIFwiLFwiO1xyXG4gIH1cclxuICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKSArICd9J1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5IYW5kbGVyIChcclxuICBuYW1lLFxyXG4gIGhhbmRsZXJcclxuKSB7XHJcbiAgaWYgKCFoYW5kbGVyKSB7XHJcbiAgICByZXR1cm4gJ2Z1bmN0aW9uKCl7fSdcclxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcikpIHtcclxuICAgIHJldHVybiAoXCJbXCIgKyAoaGFuZGxlci5tYXAoZnVuY3Rpb24gKGhhbmRsZXIpIHsgcmV0dXJuIGdlbkhhbmRsZXIobmFtZSwgaGFuZGxlcik7IH0pLmpvaW4oJywnKSkgKyBcIl1cIilcclxuICB9IGVsc2UgaWYgKCFoYW5kbGVyLm1vZGlmaWVycykge1xyXG4gICAgcmV0dXJuIGZuRXhwUkUudGVzdChoYW5kbGVyLnZhbHVlKSB8fCBzaW1wbGVQYXRoUkUudGVzdChoYW5kbGVyLnZhbHVlKVxyXG4gICAgICA/IGhhbmRsZXIudmFsdWVcclxuICAgICAgOiAoXCJmdW5jdGlvbigkZXZlbnQpe1wiICsgKGhhbmRsZXIudmFsdWUpICsgXCJ9XCIpXHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBjb2RlID0gJyc7XHJcbiAgICB2YXIga2V5cyA9IFtdO1xyXG4gICAgZm9yICh2YXIga2V5IGluIGhhbmRsZXIubW9kaWZpZXJzKSB7XHJcbiAgICAgIGlmIChtb2RpZmllckNvZGVba2V5XSkge1xyXG4gICAgICAgIGNvZGUgKz0gbW9kaWZpZXJDb2RlW2tleV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChrZXlzLmxlbmd0aCkge1xyXG4gICAgICBjb2RlID0gZ2VuS2V5RmlsdGVyKGtleXMpICsgY29kZTtcclxuICAgIH1cclxuICAgIHZhciBoYW5kbGVyQ29kZSA9IHNpbXBsZVBhdGhSRS50ZXN0KGhhbmRsZXIudmFsdWUpXHJcbiAgICAgID8gaGFuZGxlci52YWx1ZSArICcoJGV2ZW50KSdcclxuICAgICAgOiBoYW5kbGVyLnZhbHVlO1xyXG4gICAgcmV0dXJuICdmdW5jdGlvbigkZXZlbnQpeycgKyBjb2RlICsgaGFuZGxlckNvZGUgKyAnfSdcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbktleUZpbHRlciAoa2V5cykge1xyXG4gIHJldHVybiAoXCJpZihcIiArIChrZXlzLm1hcChnZW5GaWx0ZXJDb2RlKS5qb2luKCcmJicpKSArIFwiKXJldHVybjtcIilcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRmlsdGVyQ29kZSAoa2V5KSB7XHJcbiAgdmFyIGtleVZhbCA9IHBhcnNlSW50KGtleSwgMTApO1xyXG4gIGlmIChrZXlWYWwpIHtcclxuICAgIHJldHVybiAoXCIkZXZlbnQua2V5Q29kZSE9PVwiICsga2V5VmFsKVxyXG4gIH1cclxuICB2YXIgYWxpYXMgPSBrZXlDb2Rlc1trZXldO1xyXG4gIHJldHVybiAoXCJfaygkZXZlbnQua2V5Q29kZSxcIiArIChKU09OLnN0cmluZ2lmeShrZXkpKSArIChhbGlhcyA/ICcsJyArIEpTT04uc3RyaW5naWZ5KGFsaWFzKSA6ICcnKSArIFwiKVwiKVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGJpbmQkMiAoZWwsIGRpcikge1xyXG4gIGVsLndyYXBEYXRhID0gZnVuY3Rpb24gKGNvZGUpIHtcclxuICAgIHJldHVybiAoXCJfYihcIiArIGNvZGUgKyBcIiwnXCIgKyAoZWwudGFnKSArIFwiJyxcIiArIChkaXIudmFsdWUpICsgKGRpci5tb2RpZmllcnMgJiYgZGlyLm1vZGlmaWVycy5wcm9wID8gJyx0cnVlJyA6ICcnKSArIFwiKVwiKVxyXG4gIH07XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGJhc2VEaXJlY3RpdmVzID0ge1xyXG4gIGJpbmQ6IGJpbmQkMixcclxuICBjbG9hazogbm9vcFxyXG59O1xyXG5cclxuLyogICovXHJcblxyXG4vLyBjb25maWd1cmFibGUgc3RhdGVcclxudmFyIHdhcm4kMjtcclxudmFyIHRyYW5zZm9ybXMkMTtcclxudmFyIGRhdGFHZW5GbnM7XHJcbnZhciBwbGF0Zm9ybURpcmVjdGl2ZXMkMTtcclxudmFyIGlzUGxhdGZvcm1SZXNlcnZlZFRhZyQxO1xyXG52YXIgc3RhdGljUmVuZGVyRm5zO1xyXG52YXIgb25jZUNvdW50O1xyXG52YXIgY3VycmVudE9wdGlvbnM7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZSAoXHJcbiAgYXN0LFxyXG4gIG9wdGlvbnNcclxuKSB7XHJcbiAgLy8gc2F2ZSBwcmV2aW91cyBzdGF0aWNSZW5kZXJGbnMgc28gZ2VuZXJhdGUgY2FsbHMgY2FuIGJlIG5lc3RlZFxyXG4gIHZhciBwcmV2U3RhdGljUmVuZGVyRm5zID0gc3RhdGljUmVuZGVyRm5zO1xyXG4gIHZhciBjdXJyZW50U3RhdGljUmVuZGVyRm5zID0gc3RhdGljUmVuZGVyRm5zID0gW107XHJcbiAgdmFyIHByZXZPbmNlQ291bnQgPSBvbmNlQ291bnQ7XHJcbiAgb25jZUNvdW50ID0gMDtcclxuICBjdXJyZW50T3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgd2FybiQyID0gb3B0aW9ucy53YXJuIHx8IGJhc2VXYXJuO1xyXG4gIHRyYW5zZm9ybXMkMSA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtQ29kZScpO1xyXG4gIGRhdGFHZW5GbnMgPSBwbHVja01vZHVsZUZ1bmN0aW9uKG9wdGlvbnMubW9kdWxlcywgJ2dlbkRhdGEnKTtcclxuICBwbGF0Zm9ybURpcmVjdGl2ZXMkMSA9IG9wdGlvbnMuZGlyZWN0aXZlcyB8fCB7fTtcclxuICBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWckMSA9IG9wdGlvbnMuaXNSZXNlcnZlZFRhZyB8fCBubztcclxuICB2YXIgY29kZSA9IGFzdCA/IGdlbkVsZW1lbnQoYXN0KSA6ICdfYyhcImRpdlwiKSc7XHJcbiAgc3RhdGljUmVuZGVyRm5zID0gcHJldlN0YXRpY1JlbmRlckZucztcclxuICBvbmNlQ291bnQgPSBwcmV2T25jZUNvdW50O1xyXG4gIHJldHVybiB7XHJcbiAgICByZW5kZXI6IChcIndpdGgodGhpcyl7cmV0dXJuIFwiICsgY29kZSArIFwifVwiKSxcclxuICAgIHN0YXRpY1JlbmRlckZuczogY3VycmVudFN0YXRpY1JlbmRlckZuc1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRWxlbWVudCAoZWwpIHtcclxuICBpZiAoZWwuc3RhdGljUm9vdCAmJiAhZWwuc3RhdGljUHJvY2Vzc2VkKSB7XHJcbiAgICByZXR1cm4gZ2VuU3RhdGljKGVsKVxyXG4gIH0gZWxzZSBpZiAoZWwub25jZSAmJiAhZWwub25jZVByb2Nlc3NlZCkge1xyXG4gICAgcmV0dXJuIGdlbk9uY2UoZWwpXHJcbiAgfSBlbHNlIGlmIChlbC5mb3IgJiYgIWVsLmZvclByb2Nlc3NlZCkge1xyXG4gICAgcmV0dXJuIGdlbkZvcihlbClcclxuICB9IGVsc2UgaWYgKGVsLmlmICYmICFlbC5pZlByb2Nlc3NlZCkge1xyXG4gICAgcmV0dXJuIGdlbklmKGVsKVxyXG4gIH0gZWxzZSBpZiAoZWwudGFnID09PSAndGVtcGxhdGUnICYmICFlbC5zbG90VGFyZ2V0KSB7XHJcbiAgICByZXR1cm4gZ2VuQ2hpbGRyZW4oZWwpIHx8ICd2b2lkIDAnXHJcbiAgfSBlbHNlIGlmIChlbC50YWcgPT09ICdzbG90Jykge1xyXG4gICAgcmV0dXJuIGdlblNsb3QoZWwpXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGNvbXBvbmVudCBvciBlbGVtZW50XHJcbiAgICB2YXIgY29kZTtcclxuICAgIGlmIChlbC5jb21wb25lbnQpIHtcclxuICAgICAgY29kZSA9IGdlbkNvbXBvbmVudChlbC5jb21wb25lbnQsIGVsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBkYXRhID0gZWwucGxhaW4gPyB1bmRlZmluZWQgOiBnZW5EYXRhKGVsKTtcclxuXHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IGVsLmlubGluZVRlbXBsYXRlID8gbnVsbCA6IGdlbkNoaWxkcmVuKGVsLCB0cnVlKTtcclxuICAgICAgY29kZSA9IFwiX2MoJ1wiICsgKGVsLnRhZykgKyBcIidcIiArIChkYXRhID8gKFwiLFwiICsgZGF0YSkgOiAnJykgKyAoY2hpbGRyZW4gPyAoXCIsXCIgKyBjaGlsZHJlbikgOiAnJykgKyBcIilcIjtcclxuICAgIH1cclxuICAgIC8vIG1vZHVsZSB0cmFuc2Zvcm1zXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYW5zZm9ybXMkMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb2RlID0gdHJhbnNmb3JtcyQxW2ldKGVsLCBjb2RlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb2RlXHJcbiAgfVxyXG59XHJcblxyXG4vLyBob2lzdCBzdGF0aWMgc3ViLXRyZWVzIG91dFxyXG5mdW5jdGlvbiBnZW5TdGF0aWMgKGVsKSB7XHJcbiAgZWwuc3RhdGljUHJvY2Vzc2VkID0gdHJ1ZTtcclxuICBzdGF0aWNSZW5kZXJGbnMucHVzaCgoXCJ3aXRoKHRoaXMpe3JldHVybiBcIiArIChnZW5FbGVtZW50KGVsKSkgKyBcIn1cIikpO1xyXG4gIHJldHVybiAoXCJfbShcIiArIChzdGF0aWNSZW5kZXJGbnMubGVuZ3RoIC0gMSkgKyAoZWwuc3RhdGljSW5Gb3IgPyAnLHRydWUnIDogJycpICsgXCIpXCIpXHJcbn1cclxuXHJcbi8vIHYtb25jZVxyXG5mdW5jdGlvbiBnZW5PbmNlIChlbCkge1xyXG4gIGVsLm9uY2VQcm9jZXNzZWQgPSB0cnVlO1xyXG4gIGlmIChlbC5pZiAmJiAhZWwuaWZQcm9jZXNzZWQpIHtcclxuICAgIHJldHVybiBnZW5JZihlbClcclxuICB9IGVsc2UgaWYgKGVsLnN0YXRpY0luRm9yKSB7XHJcbiAgICB2YXIga2V5ID0gJyc7XHJcbiAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50O1xyXG4gICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICBpZiAocGFyZW50LmZvcikge1xyXG4gICAgICAgIGtleSA9IHBhcmVudC5rZXk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgfVxyXG4gICAgaWYgKCFrZXkpIHtcclxuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybiQyKFxyXG4gICAgICAgIFwidi1vbmNlIGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIHYtZm9yIHRoYXQgaXMga2V5ZWQuIFwiXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBnZW5FbGVtZW50KGVsKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcIl9vKFwiICsgKGdlbkVsZW1lbnQoZWwpKSArIFwiLFwiICsgKG9uY2VDb3VudCsrKSArIChrZXkgPyAoXCIsXCIgKyBrZXkpIDogXCJcIikgKyBcIilcIilcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGdlblN0YXRpYyhlbClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbklmIChlbCkge1xyXG4gIGVsLmlmUHJvY2Vzc2VkID0gdHJ1ZTsgLy8gYXZvaWQgcmVjdXJzaW9uXHJcbiAgcmV0dXJuIGdlbklmQ29uZGl0aW9ucyhlbC5pZkNvbmRpdGlvbnMuc2xpY2UoKSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuSWZDb25kaXRpb25zIChjb25kaXRpb25zKSB7XHJcbiAgaWYgKCFjb25kaXRpb25zLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuICdfZSgpJ1xyXG4gIH1cclxuXHJcbiAgdmFyIGNvbmRpdGlvbiA9IGNvbmRpdGlvbnMuc2hpZnQoKTtcclxuICBpZiAoY29uZGl0aW9uLmV4cCkge1xyXG4gICAgcmV0dXJuIChcIihcIiArIChjb25kaXRpb24uZXhwKSArIFwiKT9cIiArIChnZW5UZXJuYXJ5RXhwKGNvbmRpdGlvbi5ibG9jaykpICsgXCI6XCIgKyAoZ2VuSWZDb25kaXRpb25zKGNvbmRpdGlvbnMpKSlcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIChcIlwiICsgKGdlblRlcm5hcnlFeHAoY29uZGl0aW9uLmJsb2NrKSkpXHJcbiAgfVxyXG5cclxuICAvLyB2LWlmIHdpdGggdi1vbmNlIHNob3VsZCBnZW5lcmF0ZSBjb2RlIGxpa2UgKGEpP19tKDApOl9tKDEpXHJcbiAgZnVuY3Rpb24gZ2VuVGVybmFyeUV4cCAoZWwpIHtcclxuICAgIHJldHVybiBlbC5vbmNlID8gZ2VuT25jZShlbCkgOiBnZW5FbGVtZW50KGVsKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRm9yIChlbCkge1xyXG4gIHZhciBleHAgPSBlbC5mb3I7XHJcbiAgdmFyIGFsaWFzID0gZWwuYWxpYXM7XHJcbiAgdmFyIGl0ZXJhdG9yMSA9IGVsLml0ZXJhdG9yMSA/IChcIixcIiArIChlbC5pdGVyYXRvcjEpKSA6ICcnO1xyXG4gIHZhciBpdGVyYXRvcjIgPSBlbC5pdGVyYXRvcjIgPyAoXCIsXCIgKyAoZWwuaXRlcmF0b3IyKSkgOiAnJztcclxuICBlbC5mb3JQcm9jZXNzZWQgPSB0cnVlOyAvLyBhdm9pZCByZWN1cnNpb25cclxuICByZXR1cm4gXCJfbCgoXCIgKyBleHAgKyBcIiksXCIgK1xyXG4gICAgXCJmdW5jdGlvbihcIiArIGFsaWFzICsgaXRlcmF0b3IxICsgaXRlcmF0b3IyICsgXCIpe1wiICtcclxuICAgICAgXCJyZXR1cm4gXCIgKyAoZ2VuRWxlbWVudChlbCkpICtcclxuICAgICd9KSdcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRGF0YSAoZWwpIHtcclxuICB2YXIgZGF0YSA9ICd7JztcclxuXHJcbiAgLy8gZGlyZWN0aXZlcyBmaXJzdC5cclxuICAvLyBkaXJlY3RpdmVzIG1heSBtdXRhdGUgdGhlIGVsJ3Mgb3RoZXIgcHJvcGVydGllcyBiZWZvcmUgdGhleSBhcmUgZ2VuZXJhdGVkLlxyXG4gIHZhciBkaXJzID0gZ2VuRGlyZWN0aXZlcyhlbCk7XHJcbiAgaWYgKGRpcnMpIHsgZGF0YSArPSBkaXJzICsgJywnOyB9XHJcblxyXG4gIC8vIGtleVxyXG4gIGlmIChlbC5rZXkpIHtcclxuICAgIGRhdGEgKz0gXCJrZXk6XCIgKyAoZWwua2V5KSArIFwiLFwiO1xyXG4gIH1cclxuICAvLyByZWZcclxuICBpZiAoZWwucmVmKSB7XHJcbiAgICBkYXRhICs9IFwicmVmOlwiICsgKGVsLnJlZikgKyBcIixcIjtcclxuICB9XHJcbiAgaWYgKGVsLnJlZkluRm9yKSB7XHJcbiAgICBkYXRhICs9IFwicmVmSW5Gb3I6dHJ1ZSxcIjtcclxuICB9XHJcbiAgLy8gcHJlXHJcbiAgaWYgKGVsLnByZSkge1xyXG4gICAgZGF0YSArPSBcInByZTp0cnVlLFwiO1xyXG4gIH1cclxuICAvLyByZWNvcmQgb3JpZ2luYWwgdGFnIG5hbWUgZm9yIGNvbXBvbmVudHMgdXNpbmcgXCJpc1wiIGF0dHJpYnV0ZVxyXG4gIGlmIChlbC5jb21wb25lbnQpIHtcclxuICAgIGRhdGEgKz0gXCJ0YWc6XFxcIlwiICsgKGVsLnRhZykgKyBcIlxcXCIsXCI7XHJcbiAgfVxyXG4gIC8vIG1vZHVsZSBkYXRhIGdlbmVyYXRpb24gZnVuY3Rpb25zXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhR2VuRm5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBkYXRhICs9IGRhdGFHZW5GbnNbaV0oZWwpO1xyXG4gIH1cclxuICAvLyBhdHRyaWJ1dGVzXHJcbiAgaWYgKGVsLmF0dHJzKSB7XHJcbiAgICBkYXRhICs9IFwiYXR0cnM6e1wiICsgKGdlblByb3BzKGVsLmF0dHJzKSkgKyBcIn0sXCI7XHJcbiAgfVxyXG4gIC8vIERPTSBwcm9wc1xyXG4gIGlmIChlbC5wcm9wcykge1xyXG4gICAgZGF0YSArPSBcImRvbVByb3BzOntcIiArIChnZW5Qcm9wcyhlbC5wcm9wcykpICsgXCJ9LFwiO1xyXG4gIH1cclxuICAvLyBldmVudCBoYW5kbGVyc1xyXG4gIGlmIChlbC5ldmVudHMpIHtcclxuICAgIGRhdGEgKz0gKGdlbkhhbmRsZXJzKGVsLmV2ZW50cykpICsgXCIsXCI7XHJcbiAgfVxyXG4gIGlmIChlbC5uYXRpdmVFdmVudHMpIHtcclxuICAgIGRhdGEgKz0gKGdlbkhhbmRsZXJzKGVsLm5hdGl2ZUV2ZW50cywgdHJ1ZSkpICsgXCIsXCI7XHJcbiAgfVxyXG4gIC8vIHNsb3QgdGFyZ2V0XHJcbiAgaWYgKGVsLnNsb3RUYXJnZXQpIHtcclxuICAgIGRhdGEgKz0gXCJzbG90OlwiICsgKGVsLnNsb3RUYXJnZXQpICsgXCIsXCI7XHJcbiAgfVxyXG4gIC8vIHNjb3BlZCBzbG90c1xyXG4gIGlmIChlbC5zY29wZWRTbG90cykge1xyXG4gICAgZGF0YSArPSAoZ2VuU2NvcGVkU2xvdHMoZWwuc2NvcGVkU2xvdHMpKSArIFwiLFwiO1xyXG4gIH1cclxuICAvLyBpbmxpbmUtdGVtcGxhdGVcclxuICBpZiAoZWwuaW5saW5lVGVtcGxhdGUpIHtcclxuICAgIHZhciBpbmxpbmVUZW1wbGF0ZSA9IGdlbklubGluZVRlbXBsYXRlKGVsKTtcclxuICAgIGlmIChpbmxpbmVUZW1wbGF0ZSkge1xyXG4gICAgICBkYXRhICs9IGlubGluZVRlbXBsYXRlICsgXCIsXCI7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRhdGEgPSBkYXRhLnJlcGxhY2UoLywkLywgJycpICsgJ30nO1xyXG4gIC8vIHYtYmluZCBkYXRhIHdyYXBcclxuICBpZiAoZWwud3JhcERhdGEpIHtcclxuICAgIGRhdGEgPSBlbC53cmFwRGF0YShkYXRhKTtcclxuICB9XHJcbiAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRGlyZWN0aXZlcyAoZWwpIHtcclxuICB2YXIgZGlycyA9IGVsLmRpcmVjdGl2ZXM7XHJcbiAgaWYgKCFkaXJzKSB7IHJldHVybiB9XHJcbiAgdmFyIHJlcyA9ICdkaXJlY3RpdmVzOlsnO1xyXG4gIHZhciBoYXNSdW50aW1lID0gZmFsc2U7XHJcbiAgdmFyIGksIGwsIGRpciwgbmVlZFJ1bnRpbWU7XHJcbiAgZm9yIChpID0gMCwgbCA9IGRpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBkaXIgPSBkaXJzW2ldO1xyXG4gICAgbmVlZFJ1bnRpbWUgPSB0cnVlO1xyXG4gICAgdmFyIGdlbiA9IHBsYXRmb3JtRGlyZWN0aXZlcyQxW2Rpci5uYW1lXSB8fCBiYXNlRGlyZWN0aXZlc1tkaXIubmFtZV07XHJcbiAgICBpZiAoZ2VuKSB7XHJcbiAgICAgIC8vIGNvbXBpbGUtdGltZSBkaXJlY3RpdmUgdGhhdCBtYW5pcHVsYXRlcyBBU1QuXHJcbiAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBpdCBhbHNvIG5lZWRzIGEgcnVudGltZSBjb3VudGVycGFydC5cclxuICAgICAgbmVlZFJ1bnRpbWUgPSAhIWdlbihlbCwgZGlyLCB3YXJuJDIpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5lZWRSdW50aW1lKSB7XHJcbiAgICAgIGhhc1J1bnRpbWUgPSB0cnVlO1xyXG4gICAgICByZXMgKz0gXCJ7bmFtZTpcXFwiXCIgKyAoZGlyLm5hbWUpICsgXCJcXFwiLHJhd05hbWU6XFxcIlwiICsgKGRpci5yYXdOYW1lKSArIFwiXFxcIlwiICsgKGRpci52YWx1ZSA/IChcIix2YWx1ZTooXCIgKyAoZGlyLnZhbHVlKSArIFwiKSxleHByZXNzaW9uOlwiICsgKEpTT04uc3RyaW5naWZ5KGRpci52YWx1ZSkpKSA6ICcnKSArIChkaXIuYXJnID8gKFwiLGFyZzpcXFwiXCIgKyAoZGlyLmFyZykgKyBcIlxcXCJcIikgOiAnJykgKyAoZGlyLm1vZGlmaWVycyA/IChcIixtb2RpZmllcnM6XCIgKyAoSlNPTi5zdHJpbmdpZnkoZGlyLm1vZGlmaWVycykpKSA6ICcnKSArIFwifSxcIjtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGhhc1J1bnRpbWUpIHtcclxuICAgIHJldHVybiByZXMuc2xpY2UoMCwgLTEpICsgJ10nXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5JbmxpbmVUZW1wbGF0ZSAoZWwpIHtcclxuICB2YXIgYXN0ID0gZWwuY2hpbGRyZW5bMF07XHJcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIChcclxuICAgIGVsLmNoaWxkcmVuLmxlbmd0aCA+IDEgfHwgYXN0LnR5cGUgIT09IDFcclxuICApKSB7XHJcbiAgICB3YXJuJDIoJ0lubGluZS10ZW1wbGF0ZSBjb21wb25lbnRzIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBjaGlsZCBlbGVtZW50LicpO1xyXG4gIH1cclxuICBpZiAoYXN0LnR5cGUgPT09IDEpIHtcclxuICAgIHZhciBpbmxpbmVSZW5kZXJGbnMgPSBnZW5lcmF0ZShhc3QsIGN1cnJlbnRPcHRpb25zKTtcclxuICAgIHJldHVybiAoXCJpbmxpbmVUZW1wbGF0ZTp7cmVuZGVyOmZ1bmN0aW9uKCl7XCIgKyAoaW5saW5lUmVuZGVyRm5zLnJlbmRlcikgKyBcIn0sc3RhdGljUmVuZGVyRm5zOltcIiArIChpbmxpbmVSZW5kZXJGbnMuc3RhdGljUmVuZGVyRm5zLm1hcChmdW5jdGlvbiAoY29kZSkgeyByZXR1cm4gKFwiZnVuY3Rpb24oKXtcIiArIGNvZGUgKyBcIn1cIik7IH0pLmpvaW4oJywnKSkgKyBcIl19XCIpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5TY29wZWRTbG90cyAoc2xvdHMpIHtcclxuICByZXR1cm4gKFwic2NvcGVkU2xvdHM6e1wiICsgKE9iamVjdC5rZXlzKHNsb3RzKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gZ2VuU2NvcGVkU2xvdChrZXksIHNsb3RzW2tleV0pOyB9KS5qb2luKCcsJykpICsgXCJ9XCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblNjb3BlZFNsb3QgKGtleSwgZWwpIHtcclxuICByZXR1cm4ga2V5ICsgXCI6ZnVuY3Rpb24oXCIgKyAoU3RyaW5nKGVsLmF0dHJzTWFwLnNjb3BlKSkgKyBcIil7XCIgK1xyXG4gICAgXCJyZXR1cm4gXCIgKyAoZWwudGFnID09PSAndGVtcGxhdGUnXHJcbiAgICAgID8gZ2VuQ2hpbGRyZW4oZWwpIHx8ICd2b2lkIDAnXHJcbiAgICAgIDogZ2VuRWxlbWVudChlbCkpICsgXCJ9XCJcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuQ2hpbGRyZW4gKGVsLCBjaGVja1NraXApIHtcclxuICB2YXIgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcclxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICB2YXIgZWwkMSA9IGNoaWxkcmVuWzBdO1xyXG4gICAgLy8gb3B0aW1pemUgc2luZ2xlIHYtZm9yXHJcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmXHJcbiAgICAgICAgZWwkMS5mb3IgJiZcclxuICAgICAgICBlbCQxLnRhZyAhPT0gJ3RlbXBsYXRlJyAmJlxyXG4gICAgICAgIGVsJDEudGFnICE9PSAnc2xvdCcpIHtcclxuICAgICAgcmV0dXJuIGdlbkVsZW1lbnQoZWwkMSlcclxuICAgIH1cclxuICAgIHZhciBub3JtYWxpemF0aW9uVHlwZSA9IGdldE5vcm1hbGl6YXRpb25UeXBlKGNoaWxkcmVuKTtcclxuICAgIHJldHVybiAoXCJbXCIgKyAoY2hpbGRyZW4ubWFwKGdlbk5vZGUpLmpvaW4oJywnKSkgKyBcIl1cIiArIChjaGVja1NraXBcclxuICAgICAgICA/IG5vcm1hbGl6YXRpb25UeXBlID8gKFwiLFwiICsgbm9ybWFsaXphdGlvblR5cGUpIDogJydcclxuICAgICAgICA6ICcnKSlcclxuICB9XHJcbn1cclxuXHJcbi8vIGRldGVybWluZSB0aGUgbm9ybWFsaXphdGlvbiBuZWVkZWQgZm9yIHRoZSBjaGlsZHJlbiBhcnJheS5cclxuLy8gMDogbm8gbm9ybWFsaXphdGlvbiBuZWVkZWRcclxuLy8gMTogc2ltcGxlIG5vcm1hbGl6YXRpb24gbmVlZGVkIChwb3NzaWJsZSAxLWxldmVsIGRlZXAgbmVzdGVkIGFycmF5KVxyXG4vLyAyOiBmdWxsIG5vcm1hbGl6YXRpb24gbmVlZGVkXHJcbmZ1bmN0aW9uIGdldE5vcm1hbGl6YXRpb25UeXBlIChjaGlsZHJlbikge1xyXG4gIHZhciByZXMgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgaWYgKGVsLnR5cGUgIT09IDEpIHtcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuICAgIGlmIChuZWVkc05vcm1hbGl6YXRpb24oZWwpIHx8XHJcbiAgICAgICAgKGVsLmlmQ29uZGl0aW9ucyAmJiBlbC5pZkNvbmRpdGlvbnMuc29tZShmdW5jdGlvbiAoYykgeyByZXR1cm4gbmVlZHNOb3JtYWxpemF0aW9uKGMuYmxvY2spOyB9KSkpIHtcclxuICAgICAgcmVzID0gMjtcclxuICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIGlmIChtYXliZUNvbXBvbmVudChlbCkgfHxcclxuICAgICAgICAoZWwuaWZDb25kaXRpb25zICYmIGVsLmlmQ29uZGl0aW9ucy5zb21lKGZ1bmN0aW9uIChjKSB7IHJldHVybiBtYXliZUNvbXBvbmVudChjLmJsb2NrKTsgfSkpKSB7XHJcbiAgICAgIHJlcyA9IDE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZXNcclxufVxyXG5cclxuZnVuY3Rpb24gbmVlZHNOb3JtYWxpemF0aW9uIChlbCkge1xyXG4gIHJldHVybiBlbC5mb3IgIT09IHVuZGVmaW5lZCB8fCBlbC50YWcgPT09ICd0ZW1wbGF0ZScgfHwgZWwudGFnID09PSAnc2xvdCdcclxufVxyXG5cclxuZnVuY3Rpb24gbWF5YmVDb21wb25lbnQgKGVsKSB7XHJcbiAgcmV0dXJuICFpc1BsYXRmb3JtUmVzZXJ2ZWRUYWckMShlbC50YWcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbk5vZGUgKG5vZGUpIHtcclxuICBpZiAobm9kZS50eXBlID09PSAxKSB7XHJcbiAgICByZXR1cm4gZ2VuRWxlbWVudChub2RlKVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZ2VuVGV4dChub2RlKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuVGV4dCAodGV4dCkge1xyXG4gIHJldHVybiAoXCJfdihcIiArICh0ZXh0LnR5cGUgPT09IDJcclxuICAgID8gdGV4dC5leHByZXNzaW9uIC8vIG5vIG5lZWQgZm9yICgpIGJlY2F1c2UgYWxyZWFkeSB3cmFwcGVkIGluIF9zKClcclxuICAgIDogdHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzKEpTT04uc3RyaW5naWZ5KHRleHQudGV4dCkpKSArIFwiKVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5TbG90IChlbCkge1xyXG4gIHZhciBzbG90TmFtZSA9IGVsLnNsb3ROYW1lIHx8ICdcImRlZmF1bHRcIic7XHJcbiAgdmFyIGNoaWxkcmVuID0gZ2VuQ2hpbGRyZW4oZWwpO1xyXG4gIHZhciByZXMgPSBcIl90KFwiICsgc2xvdE5hbWUgKyAoY2hpbGRyZW4gPyAoXCIsXCIgKyBjaGlsZHJlbikgOiAnJyk7XHJcbiAgdmFyIGF0dHJzID0gZWwuYXR0cnMgJiYgKFwie1wiICsgKGVsLmF0dHJzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gKChjYW1lbGl6ZShhLm5hbWUpKSArIFwiOlwiICsgKGEudmFsdWUpKTsgfSkuam9pbignLCcpKSArIFwifVwiKTtcclxuICB2YXIgYmluZCQkMSA9IGVsLmF0dHJzTWFwWyd2LWJpbmQnXTtcclxuICBpZiAoKGF0dHJzIHx8IGJpbmQkJDEpICYmICFjaGlsZHJlbikge1xyXG4gICAgcmVzICs9IFwiLG51bGxcIjtcclxuICB9XHJcbiAgaWYgKGF0dHJzKSB7XHJcbiAgICByZXMgKz0gXCIsXCIgKyBhdHRycztcclxuICB9XHJcbiAgaWYgKGJpbmQkJDEpIHtcclxuICAgIHJlcyArPSAoYXR0cnMgPyAnJyA6ICcsbnVsbCcpICsgXCIsXCIgKyBiaW5kJCQxO1xyXG4gIH1cclxuICByZXR1cm4gcmVzICsgJyknXHJcbn1cclxuXHJcbi8vIGNvbXBvbmVudE5hbWUgaXMgZWwuY29tcG9uZW50LCB0YWtlIGl0IGFzIGFyZ3VtZW50IHRvIHNodW4gZmxvdydzIHBlc3NpbWlzdGljIHJlZmluZW1lbnRcclxuZnVuY3Rpb24gZ2VuQ29tcG9uZW50IChjb21wb25lbnROYW1lLCBlbCkge1xyXG4gIHZhciBjaGlsZHJlbiA9IGVsLmlubGluZVRlbXBsYXRlID8gbnVsbCA6IGdlbkNoaWxkcmVuKGVsLCB0cnVlKTtcclxuICByZXR1cm4gKFwiX2MoXCIgKyBjb21wb25lbnROYW1lICsgXCIsXCIgKyAoZ2VuRGF0YShlbCkpICsgKGNoaWxkcmVuID8gKFwiLFwiICsgY2hpbGRyZW4pIDogJycpICsgXCIpXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblByb3BzIChwcm9wcykge1xyXG4gIHZhciByZXMgPSAnJztcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xyXG4gICAgcmVzICs9IFwiXFxcIlwiICsgKHByb3AubmFtZSkgKyBcIlxcXCI6XCIgKyAodHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzKHByb3AudmFsdWUpKSArIFwiLFwiO1xyXG4gIH1cclxuICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKVxyXG59XHJcblxyXG4vLyAjMzg5NSwgIzQyNjhcclxuZnVuY3Rpb24gdHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzICh0ZXh0KSB7XHJcbiAgcmV0dXJuIHRleHRcclxuICAgIC5yZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKVxyXG4gICAgLnJlcGxhY2UoL1xcdTIwMjkvZywgJ1xcXFx1MjAyOScpXHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuLyoqXHJcbiAqIENvbXBpbGUgYSB0ZW1wbGF0ZS5cclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGUkMSAoXHJcbiAgdGVtcGxhdGUsXHJcbiAgb3B0aW9uc1xyXG4pIHtcclxuICB2YXIgYXN0ID0gcGFyc2UodGVtcGxhdGUudHJpbSgpLCBvcHRpb25zKTtcclxuICBvcHRpbWl6ZShhc3QsIG9wdGlvbnMpO1xyXG4gIHZhciBjb2RlID0gZ2VuZXJhdGUoYXN0LCBvcHRpb25zKTtcclxuICByZXR1cm4ge1xyXG4gICAgYXN0OiBhc3QsXHJcbiAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxyXG4gICAgc3RhdGljUmVuZGVyRm5zOiBjb2RlLnN0YXRpY1JlbmRlckZuc1xyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG4vLyBvcGVyYXRvcnMgbGlrZSB0eXBlb2YsIGluc3RhbmNlb2YgYW5kIGluIGFyZSBhbGxvd2VkXHJcbnZhciBwcm9oaWJpdGVkS2V5d29yZFJFID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgKFxyXG4gICdkbyxpZixmb3IsbGV0LG5ldyx0cnksdmFyLGNhc2UsZWxzZSx3aXRoLGF3YWl0LGJyZWFrLGNhdGNoLGNsYXNzLGNvbnN0LCcgK1xyXG4gICdzdXBlcix0aHJvdyx3aGlsZSx5aWVsZCxkZWxldGUsZXhwb3J0LGltcG9ydCxyZXR1cm4sc3dpdGNoLGRlZmF1bHQsJyArXHJcbiAgJ2V4dGVuZHMsZmluYWxseSxjb250aW51ZSxkZWJ1Z2dlcixmdW5jdGlvbixhcmd1bWVudHMnXHJcbikuc3BsaXQoJywnKS5qb2luKCdcXFxcYnxcXFxcYicpICsgJ1xcXFxiJyk7XHJcbi8vIGNoZWNrIHZhbGlkIGlkZW50aWZpZXIgZm9yIHYtZm9yXHJcbnZhciBpZGVudFJFID0gL1tBLVphLXpfJF1bXFx3JF0qLztcclxuLy8gc3RyaXAgc3RyaW5ncyBpbiBleHByZXNzaW9uc1xyXG52YXIgc3RyaXBTdHJpbmdSRSA9IC8nKD86W14nXFxcXF18XFxcXC4pKid8XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifGAoPzpbXmBcXFxcXXxcXFxcLikqXFwkXFx7fFxcfSg/OlteYFxcXFxdfFxcXFwuKSpgfGAoPzpbXmBcXFxcXXxcXFxcLikqYC9nO1xyXG5cclxuLy8gZGV0ZWN0IHByb2JsZW1hdGljIGV4cHJlc3Npb25zIGluIGEgdGVtcGxhdGVcclxuZnVuY3Rpb24gZGV0ZWN0RXJyb3JzIChhc3QpIHtcclxuICB2YXIgZXJyb3JzID0gW107XHJcbiAgaWYgKGFzdCkge1xyXG4gICAgY2hlY2tOb2RlKGFzdCwgZXJyb3JzKTtcclxuICB9XHJcbiAgcmV0dXJuIGVycm9yc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja05vZGUgKG5vZGUsIGVycm9ycykge1xyXG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcclxuICAgIGZvciAodmFyIG5hbWUgaW4gbm9kZS5hdHRyc01hcCkge1xyXG4gICAgICBpZiAoZGlyUkUudGVzdChuYW1lKSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuYXR0cnNNYXBbbmFtZV07XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ3YtZm9yJykge1xyXG4gICAgICAgICAgICBjaGVja0Zvcihub2RlLCAoXCJ2LWZvcj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoZWNrRXhwcmVzc2lvbih2YWx1ZSwgKG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNoZWNrTm9kZShub2RlLmNoaWxkcmVuW2ldLCBlcnJvcnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT09IDIpIHtcclxuICAgIGNoZWNrRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIG5vZGUudGV4dCwgZXJyb3JzKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrRm9yIChub2RlLCB0ZXh0LCBlcnJvcnMpIHtcclxuICBjaGVja0V4cHJlc3Npb24obm9kZS5mb3IgfHwgJycsIHRleHQsIGVycm9ycyk7XHJcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuYWxpYXMsICd2LWZvciBhbGlhcycsIHRleHQsIGVycm9ycyk7XHJcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuaXRlcmF0b3IxLCAndi1mb3IgaXRlcmF0b3InLCB0ZXh0LCBlcnJvcnMpO1xyXG4gIGNoZWNrSWRlbnRpZmllcihub2RlLml0ZXJhdG9yMiwgJ3YtZm9yIGl0ZXJhdG9yJywgdGV4dCwgZXJyb3JzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tJZGVudGlmaWVyIChpZGVudCwgdHlwZSwgdGV4dCwgZXJyb3JzKSB7XHJcbiAgaWYgKHR5cGVvZiBpZGVudCA9PT0gJ3N0cmluZycgJiYgIWlkZW50UkUudGVzdChpZGVudCkpIHtcclxuICAgIGVycm9ycy5wdXNoKChcIi0gaW52YWxpZCBcIiArIHR5cGUgKyBcIiBcXFwiXCIgKyBpZGVudCArIFwiXFxcIiBpbiBleHByZXNzaW9uOiBcIiArIHRleHQpKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrRXhwcmVzc2lvbiAoZXhwLCB0ZXh0LCBlcnJvcnMpIHtcclxuICB0cnkge1xyXG4gICAgbmV3IEZ1bmN0aW9uKChcInJldHVybiBcIiArIGV4cCkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHZhciBrZXl3b3JkTWF0Y2ggPSBleHAucmVwbGFjZShzdHJpcFN0cmluZ1JFLCAnJykubWF0Y2gocHJvaGliaXRlZEtleXdvcmRSRSk7XHJcbiAgICBpZiAoa2V5d29yZE1hdGNoKSB7XHJcbiAgICAgIGVycm9ycy5wdXNoKFxyXG4gICAgICAgIFwiLSBhdm9pZCB1c2luZyBKYXZhU2NyaXB0IGtleXdvcmQgYXMgcHJvcGVydHkgbmFtZTogXCIgK1xyXG4gICAgICAgIFwiXFxcIlwiICsgKGtleXdvcmRNYXRjaFswXSkgKyBcIlxcXCIgaW4gZXhwcmVzc2lvbiBcIiArIHRleHRcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVycm9ycy5wdXNoKChcIi0gaW52YWxpZCBleHByZXNzaW9uOiBcIiArIHRleHQpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gdHJhbnNmb3JtTm9kZSAoZWwsIG9wdGlvbnMpIHtcclxuICB2YXIgd2FybiA9IG9wdGlvbnMud2FybiB8fCBiYXNlV2FybjtcclxuICB2YXIgc3RhdGljQ2xhc3MgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnY2xhc3MnKTtcclxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgc3RhdGljQ2xhc3MpIHtcclxuICAgIHZhciBleHByZXNzaW9uID0gcGFyc2VUZXh0KHN0YXRpY0NsYXNzLCBvcHRpb25zLmRlbGltaXRlcnMpO1xyXG4gICAgaWYgKGV4cHJlc3Npb24pIHtcclxuICAgICAgd2FybihcclxuICAgICAgICBcImNsYXNzPVxcXCJcIiArIHN0YXRpY0NsYXNzICsgXCJcXFwiOiBcIiArXHJcbiAgICAgICAgJ0ludGVycG9sYXRpb24gaW5zaWRlIGF0dHJpYnV0ZXMgaGFzIGJlZW4gcmVtb3ZlZC4gJyArXHJcbiAgICAgICAgJ1VzZSB2LWJpbmQgb3IgdGhlIGNvbG9uIHNob3J0aGFuZCBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgJyArXHJcbiAgICAgICAgJ2luc3RlYWQgb2YgPGRpdiBjbGFzcz1cInt7IHZhbCB9fVwiPiwgdXNlIDxkaXYgOmNsYXNzPVwidmFsXCI+LidcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHN0YXRpY0NsYXNzKSB7XHJcbiAgICBlbC5zdGF0aWNDbGFzcyA9IEpTT04uc3RyaW5naWZ5KHN0YXRpY0NsYXNzKTtcclxuICB9XHJcbiAgdmFyIGNsYXNzQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnY2xhc3MnLCBmYWxzZSAvKiBnZXRTdGF0aWMgKi8pO1xyXG4gIGlmIChjbGFzc0JpbmRpbmcpIHtcclxuICAgIGVsLmNsYXNzQmluZGluZyA9IGNsYXNzQmluZGluZztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbkRhdGEkMSAoZWwpIHtcclxuICB2YXIgZGF0YSA9ICcnO1xyXG4gIGlmIChlbC5zdGF0aWNDbGFzcykge1xyXG4gICAgZGF0YSArPSBcInN0YXRpY0NsYXNzOlwiICsgKGVsLnN0YXRpY0NsYXNzKSArIFwiLFwiO1xyXG4gIH1cclxuICBpZiAoZWwuY2xhc3NCaW5kaW5nKSB7XHJcbiAgICBkYXRhICs9IFwiY2xhc3M6XCIgKyAoZWwuY2xhc3NCaW5kaW5nKSArIFwiLFwiO1xyXG4gIH1cclxuICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG52YXIga2xhc3MkMSA9IHtcclxuICBzdGF0aWNLZXlzOiBbJ3N0YXRpY0NsYXNzJ10sXHJcbiAgdHJhbnNmb3JtTm9kZTogdHJhbnNmb3JtTm9kZSxcclxuICBnZW5EYXRhOiBnZW5EYXRhJDFcclxufTtcclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gdHJhbnNmb3JtTm9kZSQxIChlbCwgb3B0aW9ucykge1xyXG4gIHZhciB3YXJuID0gb3B0aW9ucy53YXJuIHx8IGJhc2VXYXJuO1xyXG4gIHZhciBzdGF0aWNTdHlsZSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICdzdHlsZScpO1xyXG4gIGlmIChzdGF0aWNTdHlsZSkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICB7XHJcbiAgICAgIHZhciBleHByZXNzaW9uID0gcGFyc2VUZXh0KHN0YXRpY1N0eWxlLCBvcHRpb25zLmRlbGltaXRlcnMpO1xyXG4gICAgICBpZiAoZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHdhcm4oXHJcbiAgICAgICAgICBcInN0eWxlPVxcXCJcIiArIHN0YXRpY1N0eWxlICsgXCJcXFwiOiBcIiArXHJcbiAgICAgICAgICAnSW50ZXJwb2xhdGlvbiBpbnNpZGUgYXR0cmlidXRlcyBoYXMgYmVlbiByZW1vdmVkLiAnICtcclxuICAgICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xyXG4gICAgICAgICAgJ2luc3RlYWQgb2YgPGRpdiBzdHlsZT1cInt7IHZhbCB9fVwiPiwgdXNlIDxkaXYgOnN0eWxlPVwidmFsXCI+LidcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbC5zdGF0aWNTdHlsZSA9IEpTT04uc3RyaW5naWZ5KHBhcnNlU3R5bGVUZXh0KHN0YXRpY1N0eWxlKSk7XHJcbiAgfVxyXG5cclxuICB2YXIgc3R5bGVCaW5kaW5nID0gZ2V0QmluZGluZ0F0dHIoZWwsICdzdHlsZScsIGZhbHNlIC8qIGdldFN0YXRpYyAqLyk7XHJcbiAgaWYgKHN0eWxlQmluZGluZykge1xyXG4gICAgZWwuc3R5bGVCaW5kaW5nID0gc3R5bGVCaW5kaW5nO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRGF0YSQyIChlbCkge1xyXG4gIHZhciBkYXRhID0gJyc7XHJcbiAgaWYgKGVsLnN0YXRpY1N0eWxlKSB7XHJcbiAgICBkYXRhICs9IFwic3RhdGljU3R5bGU6XCIgKyAoZWwuc3RhdGljU3R5bGUpICsgXCIsXCI7XHJcbiAgfVxyXG4gIGlmIChlbC5zdHlsZUJpbmRpbmcpIHtcclxuICAgIGRhdGEgKz0gXCJzdHlsZTooXCIgKyAoZWwuc3R5bGVCaW5kaW5nKSArIFwiKSxcIjtcclxuICB9XHJcbiAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxudmFyIHN0eWxlJDEgPSB7XHJcbiAgc3RhdGljS2V5czogWydzdGF0aWNTdHlsZSddLFxyXG4gIHRyYW5zZm9ybU5vZGU6IHRyYW5zZm9ybU5vZGUkMSxcclxuICBnZW5EYXRhOiBnZW5EYXRhJDJcclxufTtcclxuXHJcbnZhciBtb2R1bGVzJDEgPSBbXHJcbiAga2xhc3MkMSxcclxuICBzdHlsZSQxXHJcbl07XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciB3YXJuJDM7XHJcblxyXG5mdW5jdGlvbiBtb2RlbCQxIChcclxuICBlbCxcclxuICBkaXIsXHJcbiAgX3dhcm5cclxuKSB7XHJcbiAgd2FybiQzID0gX3dhcm47XHJcbiAgdmFyIHZhbHVlID0gZGlyLnZhbHVlO1xyXG4gIHZhciBtb2RpZmllcnMgPSBkaXIubW9kaWZpZXJzO1xyXG4gIHZhciB0YWcgPSBlbC50YWc7XHJcbiAgdmFyIHR5cGUgPSBlbC5hdHRyc01hcC50eXBlO1xyXG4gIHtcclxuICAgIHZhciBkeW5hbWljVHlwZSA9IGVsLmF0dHJzTWFwWyd2LWJpbmQ6dHlwZSddIHx8IGVsLmF0dHJzTWFwWyc6dHlwZSddO1xyXG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiBkeW5hbWljVHlwZSkge1xyXG4gICAgICB3YXJuJDMoXHJcbiAgICAgICAgXCI8aW5wdXQgOnR5cGU9XFxcIlwiICsgZHluYW1pY1R5cGUgKyBcIlxcXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj46XFxuXCIgK1xyXG4gICAgICAgIFwidi1tb2RlbCBkb2VzIG5vdCBzdXBwb3J0IGR5bmFtaWMgaW5wdXQgdHlwZXMuIFVzZSB2LWlmIGJyYW5jaGVzIGluc3RlYWQuXCJcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHRhZyA9PT0gJ3NlbGVjdCcpIHtcclxuICAgIGdlblNlbGVjdChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgZ2VuQ2hlY2tib3hNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgZ2VuUmFkaW9Nb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGdlbkRlZmF1bHRNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XHJcbiAgfVxyXG4gIC8vIGVuc3VyZSBydW50aW1lIGRpcmVjdGl2ZSBtZXRhZGF0YVxyXG4gIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbkNoZWNrYm94TW9kZWwgKFxyXG4gIGVsLFxyXG4gIHZhbHVlLFxyXG4gIG1vZGlmaWVyc1xyXG4pIHtcclxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgIGVsLmF0dHJzTWFwLmNoZWNrZWQgIT0gbnVsbCkge1xyXG4gICAgd2FybiQzKFxyXG4gICAgICBcIjxcIiArIChlbC50YWcpICsgXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIiBjaGVja2VkPjpcXG5cIiArXHJcbiAgICAgIFwiaW5saW5lIGNoZWNrZWQgYXR0cmlidXRlcyB3aWxsIGJlIGlnbm9yZWQgd2hlbiB1c2luZyB2LW1vZGVsLiBcIiArXHJcbiAgICAgICdEZWNsYXJlIGluaXRpYWwgdmFsdWVzIGluIHRoZSBjb21wb25lbnRcXCdzIGRhdGEgb3B0aW9uIGluc3RlYWQuJ1xyXG4gICAgKTtcclxuICB9XHJcbiAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xyXG4gIHZhciB2YWx1ZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3ZhbHVlJykgfHwgJ251bGwnO1xyXG4gIHZhciB0cnVlVmFsdWVCaW5kaW5nID0gZ2V0QmluZGluZ0F0dHIoZWwsICd0cnVlLXZhbHVlJykgfHwgJ3RydWUnO1xyXG4gIHZhciBmYWxzZVZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnZmFsc2UtdmFsdWUnKSB8fCAnZmFsc2UnO1xyXG4gIGFkZFByb3AoZWwsICdjaGVja2VkJyxcclxuICAgIFwiQXJyYXkuaXNBcnJheShcIiArIHZhbHVlICsgXCIpXCIgK1xyXG4gICAgICBcIj9faShcIiArIHZhbHVlICsgXCIsXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIik+LTFcIiArIChcclxuICAgICAgICB0cnVlVmFsdWVCaW5kaW5nID09PSAndHJ1ZSdcclxuICAgICAgICAgID8gKFwiOihcIiArIHZhbHVlICsgXCIpXCIpXHJcbiAgICAgICAgICA6IChcIjpfcShcIiArIHZhbHVlICsgXCIsXCIgKyB0cnVlVmFsdWVCaW5kaW5nICsgXCIpXCIpXHJcbiAgICAgIClcclxuICApO1xyXG4gIGFkZEhhbmRsZXIoZWwsICdjbGljaycsXHJcbiAgICBcInZhciAkJGE9XCIgKyB2YWx1ZSArIFwiLFwiICtcclxuICAgICAgICAnJCRlbD0kZXZlbnQudGFyZ2V0LCcgK1xyXG4gICAgICAgIFwiJCRjPSQkZWwuY2hlY2tlZD8oXCIgKyB0cnVlVmFsdWVCaW5kaW5nICsgXCIpOihcIiArIGZhbHNlVmFsdWVCaW5kaW5nICsgXCIpO1wiICtcclxuICAgICdpZihBcnJheS5pc0FycmF5KCQkYSkpeycgK1xyXG4gICAgICBcInZhciAkJHY9XCIgKyAobnVtYmVyID8gJ19uKCcgKyB2YWx1ZUJpbmRpbmcgKyAnKScgOiB2YWx1ZUJpbmRpbmcpICsgXCIsXCIgK1xyXG4gICAgICAgICAgJyQkaT1faSgkJGEsJCR2KTsnICtcclxuICAgICAgXCJpZigkJGMpeyQkaTwwJiYoXCIgKyB2YWx1ZSArIFwiPSQkYS5jb25jYXQoJCR2KSl9XCIgK1xyXG4gICAgICBcImVsc2V7JCRpPi0xJiYoXCIgKyB2YWx1ZSArIFwiPSQkYS5zbGljZSgwLCQkaSkuY29uY2F0KCQkYS5zbGljZSgkJGkrMSkpKX1cIiArXHJcbiAgICBcIn1lbHNle1wiICsgdmFsdWUgKyBcIj0kJGN9XCIsXHJcbiAgICBudWxsLCB0cnVlXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFkaW9Nb2RlbCAoXHJcbiAgICBlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgbW9kaWZpZXJzXHJcbikge1xyXG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxyXG4gICAgZWwuYXR0cnNNYXAuY2hlY2tlZCAhPSBudWxsKSB7XHJcbiAgICB3YXJuJDMoXHJcbiAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiIGNoZWNrZWQ+OlxcblwiICtcclxuICAgICAgXCJpbmxpbmUgY2hlY2tlZCBhdHRyaWJ1dGVzIHdpbGwgYmUgaWdub3JlZCB3aGVuIHVzaW5nIHYtbW9kZWwuIFwiICtcclxuICAgICAgJ0RlY2xhcmUgaW5pdGlhbCB2YWx1ZXMgaW4gdGhlIGNvbXBvbmVudFxcJ3MgZGF0YSBvcHRpb24gaW5zdGVhZC4nXHJcbiAgICApO1xyXG4gIH1cclxuICB2YXIgbnVtYmVyID0gbW9kaWZpZXJzICYmIG1vZGlmaWVycy5udW1iZXI7XHJcbiAgdmFyIHZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndmFsdWUnKSB8fCAnbnVsbCc7XHJcbiAgdmFsdWVCaW5kaW5nID0gbnVtYmVyID8gKFwiX24oXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIilcIikgOiB2YWx1ZUJpbmRpbmc7XHJcbiAgYWRkUHJvcChlbCwgJ2NoZWNrZWQnLCAoXCJfcShcIiArIHZhbHVlICsgXCIsXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIilcIikpO1xyXG4gIGFkZEhhbmRsZXIoZWwsICdjbGljaycsIGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCB2YWx1ZUJpbmRpbmcpLCBudWxsLCB0cnVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuRGVmYXVsdE1vZGVsIChcclxuICBlbCxcclxuICB2YWx1ZSxcclxuICBtb2RpZmllcnNcclxuKSB7XHJcbiAge1xyXG4gICAgaWYgKGVsLnRhZyA9PT0gJ2lucHV0JyAmJiBlbC5hdHRyc01hcC52YWx1ZSkge1xyXG4gICAgICB3YXJuJDMoXHJcbiAgICAgICAgXCI8XCIgKyAoZWwudGFnKSArIFwiIHYtbW9kZWw9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCIgdmFsdWU9XFxcIlwiICsgKGVsLmF0dHJzTWFwLnZhbHVlKSArIFwiXFxcIj46XFxuXCIgK1xyXG4gICAgICAgICdpbmxpbmUgdmFsdWUgYXR0cmlidXRlcyB3aWxsIGJlIGlnbm9yZWQgd2hlbiB1c2luZyB2LW1vZGVsLiAnICtcclxuICAgICAgICAnRGVjbGFyZSBpbml0aWFsIHZhbHVlcyBpbiB0aGUgY29tcG9uZW50XFwncyBkYXRhIG9wdGlvbiBpbnN0ZWFkLidcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChlbC50YWcgPT09ICd0ZXh0YXJlYScgJiYgZWwuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgIHdhcm4kMyhcclxuICAgICAgICBcIjx0ZXh0YXJlYSB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPjpcXG5cIiArXHJcbiAgICAgICAgJ2lubGluZSBjb250ZW50IGluc2lkZSA8dGV4dGFyZWE+IHdpbGwgYmUgaWdub3JlZCB3aGVuIHVzaW5nIHYtbW9kZWwuICcgK1xyXG4gICAgICAgICdEZWNsYXJlIGluaXRpYWwgdmFsdWVzIGluIHRoZSBjb21wb25lbnRcXCdzIGRhdGEgb3B0aW9uIGluc3RlYWQuJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHR5cGUgPSBlbC5hdHRyc01hcC50eXBlO1xyXG4gIHZhciByZWYgPSBtb2RpZmllcnMgfHwge307XHJcbiAgdmFyIGxhenkgPSByZWYubGF6eTtcclxuICB2YXIgbnVtYmVyID0gcmVmLm51bWJlcjtcclxuICB2YXIgdHJpbSA9IHJlZi50cmltO1xyXG4gIHZhciBldmVudCA9IGxhenkgfHwgKGlzSUUgJiYgdHlwZSA9PT0gJ3JhbmdlJykgPyAnY2hhbmdlJyA6ICdpbnB1dCc7XHJcbiAgdmFyIG5lZWRDb21wb3NpdGlvbkd1YXJkID0gIWxhenkgJiYgdHlwZSAhPT0gJ3JhbmdlJztcclxuICB2YXIgaXNOYXRpdmUgPSBlbC50YWcgPT09ICdpbnB1dCcgfHwgZWwudGFnID09PSAndGV4dGFyZWEnO1xyXG5cclxuICB2YXIgdmFsdWVFeHByZXNzaW9uID0gaXNOYXRpdmVcclxuICAgID8gKFwiJGV2ZW50LnRhcmdldC52YWx1ZVwiICsgKHRyaW0gPyAnLnRyaW0oKScgOiAnJykpXHJcbiAgICA6IHRyaW0gPyBcIih0eXBlb2YgJGV2ZW50ID09PSAnc3RyaW5nJyA/ICRldmVudC50cmltKCkgOiAkZXZlbnQpXCIgOiBcIiRldmVudFwiO1xyXG4gIHZhbHVlRXhwcmVzc2lvbiA9IG51bWJlciB8fCB0eXBlID09PSAnbnVtYmVyJ1xyXG4gICAgPyAoXCJfbihcIiArIHZhbHVlRXhwcmVzc2lvbiArIFwiKVwiKVxyXG4gICAgOiB2YWx1ZUV4cHJlc3Npb247XHJcblxyXG4gIHZhciBjb2RlID0gZ2VuQXNzaWdubWVudENvZGUodmFsdWUsIHZhbHVlRXhwcmVzc2lvbik7XHJcbiAgaWYgKGlzTmF0aXZlICYmIG5lZWRDb21wb3NpdGlvbkd1YXJkKSB7XHJcbiAgICBjb2RlID0gXCJpZigkZXZlbnQudGFyZ2V0LmNvbXBvc2luZylyZXR1cm47XCIgKyBjb2RlO1xyXG4gIH1cclxuXHJcbiAgLy8gaW5wdXRzIHdpdGggdHlwZT1cImZpbGVcIiBhcmUgcmVhZCBvbmx5IGFuZCBzZXR0aW5nIHRoZSBpbnB1dCdzXHJcbiAgLy8gdmFsdWUgd2lsbCB0aHJvdyBhbiBlcnJvci5cclxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcclxuICAgICAgdHlwZSA9PT0gJ2ZpbGUnKSB7XHJcbiAgICB3YXJuJDMoXHJcbiAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiIHR5cGU9XFxcImZpbGVcXFwiPjpcXG5cIiArXHJcbiAgICAgIFwiRmlsZSBpbnB1dHMgYXJlIHJlYWQgb25seS4gVXNlIGEgdi1vbjpjaGFuZ2UgbGlzdGVuZXIgaW5zdGVhZC5cIlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFkZFByb3AoZWwsICd2YWx1ZScsIGlzTmF0aXZlID8gKFwiX3MoXCIgKyB2YWx1ZSArIFwiKVwiKSA6IChcIihcIiArIHZhbHVlICsgXCIpXCIpKTtcclxuICBhZGRIYW5kbGVyKGVsLCBldmVudCwgY29kZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgaWYgKHRyaW0gfHwgbnVtYmVyIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICBhZGRIYW5kbGVyKGVsLCAnYmx1cicsICckZm9yY2VVcGRhdGUoKScpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuU2VsZWN0IChcclxuICAgIGVsLFxyXG4gICAgdmFsdWUsXHJcbiAgICBtb2RpZmllcnNcclxuKSB7XHJcbiAge1xyXG4gICAgZWwuY2hpbGRyZW4uc29tZShjaGVja09wdGlvbldhcm5pbmcpO1xyXG4gIH1cclxuXHJcbiAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xyXG4gIHZhciBhc3NpZ25tZW50ID0gXCJBcnJheS5wcm90b3R5cGUuZmlsdGVyXCIgK1xyXG4gICAgXCIuY2FsbCgkZXZlbnQudGFyZ2V0Lm9wdGlvbnMsZnVuY3Rpb24obyl7cmV0dXJuIG8uc2VsZWN0ZWR9KVwiICtcclxuICAgIFwiLm1hcChmdW5jdGlvbihvKXt2YXIgdmFsID0gXFxcIl92YWx1ZVxcXCIgaW4gbyA/IG8uX3ZhbHVlIDogby52YWx1ZTtcIiArXHJcbiAgICBcInJldHVybiBcIiArIChudW1iZXIgPyAnX24odmFsKScgOiAndmFsJykgKyBcIn0pXCIgK1xyXG4gICAgKGVsLmF0dHJzTWFwLm11bHRpcGxlID09IG51bGwgPyAnWzBdJyA6ICcnKTtcclxuXHJcbiAgdmFyIGNvZGUgPSBnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgYXNzaWdubWVudCk7XHJcbiAgYWRkSGFuZGxlcihlbCwgJ2NoYW5nZScsIGNvZGUsIG51bGwsIHRydWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja09wdGlvbldhcm5pbmcgKG9wdGlvbikge1xyXG4gIGlmIChvcHRpb24udHlwZSA9PT0gMSAmJlxyXG4gICAgb3B0aW9uLnRhZyA9PT0gJ29wdGlvbicgJiZcclxuICAgIG9wdGlvbi5hdHRyc01hcC5zZWxlY3RlZCAhPSBudWxsKSB7XHJcbiAgICB3YXJuJDMoXHJcbiAgICAgIFwiPHNlbGVjdCB2LW1vZGVsPVxcXCJcIiArIChvcHRpb24ucGFyZW50LmF0dHJzTWFwWyd2LW1vZGVsJ10pICsgXCJcXFwiPjpcXG5cIiArXHJcbiAgICAgICdpbmxpbmUgc2VsZWN0ZWQgYXR0cmlidXRlcyBvbiA8b3B0aW9uPiB3aWxsIGJlIGlnbm9yZWQgd2hlbiB1c2luZyB2LW1vZGVsLiAnICtcclxuICAgICAgJ0RlY2xhcmUgaW5pdGlhbCB2YWx1ZXMgaW4gdGhlIGNvbXBvbmVudFxcJ3MgZGF0YSBvcHRpb24gaW5zdGVhZC4nXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbkFzc2lnbm1lbnRDb2RlICh2YWx1ZSwgYXNzaWdubWVudCkge1xyXG4gIHZhciBtb2RlbFJzID0gcGFyc2VNb2RlbCh2YWx1ZSk7XHJcbiAgaWYgKG1vZGVsUnMuaWR4ID09PSBudWxsKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICsgXCI9XCIgKyBhc3NpZ25tZW50KVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gXCJ2YXIgJCRleHAgPSBcIiArIChtb2RlbFJzLmV4cCkgKyBcIiwgJCRpZHggPSBcIiArIChtb2RlbFJzLmlkeCkgKyBcIjtcIiArXHJcbiAgICAgIFwiaWYgKCFBcnJheS5pc0FycmF5KCQkZXhwKSl7XCIgK1xyXG4gICAgICAgIHZhbHVlICsgXCI9XCIgKyBhc3NpZ25tZW50ICsgXCJ9XCIgK1xyXG4gICAgICBcImVsc2V7JCRleHAuc3BsaWNlKCQkaWR4LCAxLCBcIiArIGFzc2lnbm1lbnQgKyBcIil9XCJcclxuICB9XHJcbn1cclxuXHJcbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gdGV4dCAoZWwsIGRpcikge1xyXG4gIGlmIChkaXIudmFsdWUpIHtcclxuICAgIGFkZFByb3AoZWwsICd0ZXh0Q29udGVudCcsIChcIl9zKFwiICsgKGRpci52YWx1ZSkgKyBcIilcIikpO1xyXG4gIH1cclxufVxyXG5cclxuLyogICovXHJcblxyXG5mdW5jdGlvbiBodG1sIChlbCwgZGlyKSB7XHJcbiAgaWYgKGRpci52YWx1ZSkge1xyXG4gICAgYWRkUHJvcChlbCwgJ2lubmVySFRNTCcsIChcIl9zKFwiICsgKGRpci52YWx1ZSkgKyBcIilcIikpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGRpcmVjdGl2ZXMkMSA9IHtcclxuICBtb2RlbDogbW9kZWwkMSxcclxuICB0ZXh0OiB0ZXh0LFxyXG4gIGh0bWw6IGh0bWxcclxufTtcclxuXHJcbi8qICAqL1xyXG5cclxudmFyIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuXHJcbnZhciBiYXNlT3B0aW9ucyA9IHtcclxuICBleHBlY3RIVE1MOiB0cnVlLFxyXG4gIG1vZHVsZXM6IG1vZHVsZXMkMSxcclxuICBzdGF0aWNLZXlzOiBnZW5TdGF0aWNLZXlzKG1vZHVsZXMkMSksXHJcbiAgZGlyZWN0aXZlczogZGlyZWN0aXZlcyQxLFxyXG4gIGlzUmVzZXJ2ZWRUYWc6IGlzUmVzZXJ2ZWRUYWcsXHJcbiAgaXNVbmFyeVRhZzogaXNVbmFyeVRhZyxcclxuICBtdXN0VXNlUHJvcDogbXVzdFVzZVByb3AsXHJcbiAgZ2V0VGFnTmFtZXNwYWNlOiBnZXRUYWdOYW1lc3BhY2UsXHJcbiAgaXNQcmVUYWc6IGlzUHJlVGFnXHJcbn07XHJcblxyXG5mdW5jdGlvbiBjb21waWxlJCQxIChcclxuICB0ZW1wbGF0ZSxcclxuICBvcHRpb25zXHJcbikge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zXHJcbiAgICA/IGV4dGVuZChleHRlbmQoe30sIGJhc2VPcHRpb25zKSwgb3B0aW9ucylcclxuICAgIDogYmFzZU9wdGlvbnM7XHJcbiAgcmV0dXJuIGNvbXBpbGUkMSh0ZW1wbGF0ZSwgb3B0aW9ucylcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGlsZVRvRnVuY3Rpb25zIChcclxuICB0ZW1wbGF0ZSxcclxuICBvcHRpb25zLFxyXG4gIHZtXHJcbikge1xyXG4gIHZhciBfd2FybiA9IChvcHRpb25zICYmIG9wdGlvbnMud2FybikgfHwgd2FybjtcclxuICAvLyBkZXRlY3QgcG9zc2libGUgQ1NQIHJlc3RyaWN0aW9uXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gMScpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBpZiAoZS50b1N0cmluZygpLm1hdGNoKC91bnNhZmUtZXZhbHxDU1AvKSkge1xyXG4gICAgICAgIF93YXJuKFxyXG4gICAgICAgICAgJ0l0IHNlZW1zIHlvdSBhcmUgdXNpbmcgdGhlIHN0YW5kYWxvbmUgYnVpbGQgb2YgVnVlLmpzIGluIGFuICcgK1xyXG4gICAgICAgICAgJ2Vudmlyb25tZW50IHdpdGggQ29udGVudCBTZWN1cml0eSBQb2xpY3kgdGhhdCBwcm9oaWJpdHMgdW5zYWZlLWV2YWwuICcgK1xyXG4gICAgICAgICAgJ1RoZSB0ZW1wbGF0ZSBjb21waWxlciBjYW5ub3Qgd29yayBpbiB0aGlzIGVudmlyb25tZW50LiBDb25zaWRlciAnICtcclxuICAgICAgICAgICdyZWxheGluZyB0aGUgcG9saWN5IHRvIGFsbG93IHVuc2FmZS1ldmFsIG9yIHByZS1jb21waWxpbmcgeW91ciAnICtcclxuICAgICAgICAgICd0ZW1wbGF0ZXMgaW50byByZW5kZXIgZnVuY3Rpb25zLidcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciBrZXkgPSBvcHRpb25zICYmIG9wdGlvbnMuZGVsaW1pdGVyc1xyXG4gICAgPyBTdHJpbmcob3B0aW9ucy5kZWxpbWl0ZXJzKSArIHRlbXBsYXRlXHJcbiAgICA6IHRlbXBsYXRlO1xyXG4gIGlmIChjYWNoZVtrZXldKSB7XHJcbiAgICByZXR1cm4gY2FjaGVba2V5XVxyXG4gIH1cclxuICB2YXIgcmVzID0ge307XHJcbiAgdmFyIGNvbXBpbGVkID0gY29tcGlsZSQkMSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XHJcbiAgcmVzLnJlbmRlciA9IG1ha2VGdW5jdGlvbihjb21waWxlZC5yZW5kZXIpO1xyXG4gIHZhciBsID0gY29tcGlsZWQuc3RhdGljUmVuZGVyRm5zLmxlbmd0aDtcclxuICByZXMuc3RhdGljUmVuZGVyRm5zID0gbmV3IEFycmF5KGwpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcbiAgICByZXMuc3RhdGljUmVuZGVyRm5zW2ldID0gbWFrZUZ1bmN0aW9uKGNvbXBpbGVkLnN0YXRpY1JlbmRlckZuc1tpXSk7XHJcbiAgfVxyXG4gIHtcclxuICAgIGlmIChyZXMucmVuZGVyID09PSBub29wIHx8IHJlcy5zdGF0aWNSZW5kZXJGbnMuc29tZShmdW5jdGlvbiAoZm4pIHsgcmV0dXJuIGZuID09PSBub29wOyB9KSkge1xyXG4gICAgICBfd2FybihcclxuICAgICAgICBcImZhaWxlZCB0byBjb21waWxlIHRlbXBsYXRlOlxcblxcblwiICsgdGVtcGxhdGUgKyBcIlxcblxcblwiICtcclxuICAgICAgICBkZXRlY3RFcnJvcnMoY29tcGlsZWQuYXN0KS5qb2luKCdcXG4nKSArXHJcbiAgICAgICAgJ1xcblxcbicsXHJcbiAgICAgICAgdm1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChjYWNoZVtrZXldID0gcmVzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlRnVuY3Rpb24gKGNvZGUpIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihjb2RlKVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJldHVybiBub29wXHJcbiAgfVxyXG59XHJcblxyXG4vKiAgKi9cclxuXHJcbnZhciBpZFRvVGVtcGxhdGUgPSBjYWNoZWQoZnVuY3Rpb24gKGlkKSB7XHJcbiAgdmFyIGVsID0gcXVlcnkoaWQpO1xyXG4gIHJldHVybiBlbCAmJiBlbC5pbm5lckhUTUxcclxufSk7XHJcblxyXG52YXIgbW91bnQgPSBWdWUkMy5wcm90b3R5cGUuJG1vdW50O1xyXG5WdWUkMy5wcm90b3R5cGUuJG1vdW50ID0gZnVuY3Rpb24gKFxyXG4gIGVsLFxyXG4gIGh5ZHJhdGluZ1xyXG4pIHtcclxuICBlbCA9IGVsICYmIHF1ZXJ5KGVsKTtcclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXHJcbiAgICAgIFwiRG8gbm90IG1vdW50IFZ1ZSB0byA8aHRtbD4gb3IgPGJvZHk+IC0gbW91bnQgdG8gbm9ybWFsIGVsZW1lbnRzIGluc3RlYWQuXCJcclxuICAgICk7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zO1xyXG4gIC8vIHJlc29sdmUgdGVtcGxhdGUvZWwgYW5kIGNvbnZlcnQgdG8gcmVuZGVyIGZ1bmN0aW9uXHJcbiAgaWYgKCFvcHRpb25zLnJlbmRlcikge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcclxuICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jaGFyQXQoMCkgPT09ICcjJykge1xyXG4gICAgICAgICAgdGVtcGxhdGUgPSBpZFRvVGVtcGxhdGUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHdhcm4oXHJcbiAgICAgICAgICAgICAgKFwiVGVtcGxhdGUgZWxlbWVudCBub3QgZm91bmQgb3IgaXMgZW1wdHk6IFwiICsgKG9wdGlvbnMudGVtcGxhdGUpKSxcclxuICAgICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgd2FybignaW52YWxpZCB0ZW1wbGF0ZSBvcHRpb246JyArIHRlbXBsYXRlLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbCkge1xyXG4gICAgICB0ZW1wbGF0ZSA9IGdldE91dGVySFRNTChlbCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgdmFyIHJlZiA9IGNvbXBpbGVUb0Z1bmN0aW9ucyh0ZW1wbGF0ZSwge1xyXG4gICAgICAgIHdhcm46IHdhcm4sXHJcbiAgICAgICAgc2hvdWxkRGVjb2RlTmV3bGluZXM6IHNob3VsZERlY29kZU5ld2xpbmVzLFxyXG4gICAgICAgIGRlbGltaXRlcnM6IG9wdGlvbnMuZGVsaW1pdGVyc1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgICAgdmFyIHJlbmRlciA9IHJlZi5yZW5kZXI7XHJcbiAgICAgIHZhciBzdGF0aWNSZW5kZXJGbnMgPSByZWYuc3RhdGljUmVuZGVyRm5zO1xyXG4gICAgICBvcHRpb25zLnJlbmRlciA9IHJlbmRlcjtcclxuICAgICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBzdGF0aWNSZW5kZXJGbnM7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBtb3VudC5jYWxsKHRoaXMsIGVsLCBoeWRyYXRpbmcpXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IG91dGVySFRNTCBvZiBlbGVtZW50cywgdGFraW5nIGNhcmVcclxuICogb2YgU1ZHIGVsZW1lbnRzIGluIElFIGFzIHdlbGwuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPdXRlckhUTUwgKGVsKSB7XHJcbiAgaWYgKGVsLm91dGVySFRNTCkge1xyXG4gICAgcmV0dXJuIGVsLm91dGVySFRNTFxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgIHJldHVybiBjb250YWluZXIuaW5uZXJIVE1MXHJcbiAgfVxyXG59XHJcblxyXG5WdWUkMy5jb21waWxlID0gY29tcGlsZVRvRnVuY3Rpb25zO1xyXG5cclxucmV0dXJuIFZ1ZSQzO1xyXG5cclxufSkpKTtcclxuIl19
