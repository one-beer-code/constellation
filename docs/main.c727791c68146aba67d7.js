/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/app.ts":
/*!************************!*\
  !*** ./src/app/app.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const screen_1 = __webpack_require__(/*! ./screen */ "./src/app/screen/index.ts");
const scenes_1 = __webpack_require__(/*! ./scenes */ "./src/app/scenes/index.ts");
const control_1 = __webpack_require__(/*! ./control */ "./src/app/control/index.ts");
const constants_1 = __webpack_require__(/*! ./constants */ "./src/app/constants/index.ts");
class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.scenesOrder = [constants_1.SCENE.WELCOME, constants_1.SCENE.TEXT, constants_1.SCENE.STARS];
        this.control = new control_1.Control();
        this.screen = new screen_1.Screen(canvas);
        // set scenes
        this.scenes = new scenes_1.Scenes([
            new scenes_1.WelcomeScene(this),
            new scenes_1.StarsScene(this),
            new scenes_1.CoordinatesScene(this),
            new scenes_1.TextScene(this)
        ]);
        //set default scene
        this.scenes.switchScene(this.scenesOrder[0]);
        // init keyboard
        this.keyboard();
    }
    render() {
        let animationId;
        let timer = 0;
        const interval = 1000 / 60;
        let lastTime = 0;
        const animate = (timeStamp = 0) => {
            const deltaTime = timeStamp - lastTime || 0;
            lastTime = timeStamp;
            if (timer > interval) {
                this.screen.clearScreen();
                if (this.scenes.currentScene.update) {
                    this.scenes.currentScene.update(timeStamp);
                }
                this.scenes.currentScene.render(timeStamp);
            }
            else {
                timer += deltaTime;
            }
            animationId = requestAnimationFrame(animate.bind(this));
        };
        animate();
    }
    run() {
        this.render();
    }
    keyboard() {
        this.control.subscribe(state => {
            const isSpaceDown = state.get(control_1.KEY.SPACE);
            if (isSpaceDown) {
                const currentIndex = this.scenesOrder.indexOf(this.scenes.currentScene.type);
                const nextScene = this.scenesOrder[currentIndex + 1];
                let isNext = true;
                if (this.scenes.currentScene.type === constants_1.SCENE.STARS) {
                    if (this.scenes.currentScene.onEvent) {
                        isNext = this.scenes.currentScene.onEvent();
                    }
                }
                if (!isNext) {
                    return;
                }
                if (nextScene) {
                    this.scenes.switchScene(nextScene);
                }
                else {
                    this.scenes.switchScene(constants_1.SCENE.WELCOME);
                }
            }
        });
    }
}
exports["default"] = App;


/***/ }),

/***/ "./src/app/constants/index.ts":
/*!************************************!*\
  !*** ./src/app/constants/index.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./scene.enum */ "./src/app/constants/scene.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./star-colors */ "./src/app/constants/star-colors.ts"), exports);


/***/ }),

/***/ "./src/app/constants/scene.enum.ts":
/*!*****************************************!*\
  !*** ./src/app/constants/scene.enum.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SCENE = void 0;
var SCENE;
(function (SCENE) {
    SCENE["WELCOME"] = "welcome";
    SCENE["STARS"] = "stars";
    SCENE["COORDINATES"] = "coordinates";
    SCENE["TEXT"] = "text";
})(SCENE = exports.SCENE || (exports.SCENE = {}));


/***/ }),

/***/ "./src/app/constants/star-colors.ts":
/*!******************************************!*\
  !*** ./src/app/constants/star-colors.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.starColors = void 0;
exports.starColors = ['#ffb7b7', '#b5c6ff', '#ffffc3', '#fff'];


/***/ }),

/***/ "./src/app/control/control.ts":
/*!************************************!*\
  !*** ./src/app/control/control.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Control = void 0;
const key_enum_1 = __webpack_require__(/*! ./key.enum */ "./src/app/control/key.enum.ts");
class Control {
    constructor() {
        this.observers = [];
        this.isDown = true;
        this.keyMap = new Map([
            [key_enum_1.KEY.SPACE, 'start']
        ]);
        this.state = new Map();
        document.addEventListener('keydown', event => this.update(event, true));
        document.addEventListener('keyup', event => this.update(event, false));
    }
    update(e, state) {
        if (this.keyMap.has(e.code)) {
            e.preventDefault();
            e.stopPropagation();
            this.state.set(key_enum_1.KEY.SPACE, state);
            if (this.isDown || !state) {
                this.emitObservers();
                this.isDown = !state;
            }
        }
    }
    subscribe(cb) {
        this.observers.push(cb);
    }
    emitObservers() {
        this.observers.forEach(sub => sub(this.state));
    }
}
exports.Control = Control;


/***/ }),

/***/ "./src/app/control/index.ts":
/*!**********************************!*\
  !*** ./src/app/control/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./control */ "./src/app/control/control.ts"), exports);
__exportStar(__webpack_require__(/*! ./key.enum */ "./src/app/control/key.enum.ts"), exports);


/***/ }),

/***/ "./src/app/control/key.enum.ts":
/*!*************************************!*\
  !*** ./src/app/control/key.enum.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KEY = void 0;
var KEY;
(function (KEY) {
    KEY["SPACE"] = "Space";
})(KEY = exports.KEY || (exports.KEY = {}));


/***/ }),

/***/ "./src/app/helpers/getRandomItem.ts":
/*!******************************************!*\
  !*** ./src/app/helpers/getRandomItem.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandomItem = void 0;
const randomIntenger_1 = __webpack_require__(/*! ./randomIntenger */ "./src/app/helpers/randomIntenger.ts");
function getRandomItem(arr) {
    const index = (0, randomIntenger_1.getRandomInt)(0, arr.length - 1);
    return arr[index];
}
exports.getRandomItem = getRandomItem;


/***/ }),

/***/ "./src/app/helpers/index.ts":
/*!**********************************!*\
  !*** ./src/app/helpers/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./randomIntenger */ "./src/app/helpers/randomIntenger.ts"), exports);
__exportStar(__webpack_require__(/*! ./getRandomItem */ "./src/app/helpers/getRandomItem.ts"), exports);


/***/ }),

/***/ "./src/app/helpers/randomIntenger.ts":
/*!*******************************************!*\
  !*** ./src/app/helpers/randomIntenger.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandomInt = void 0;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;


/***/ }),

/***/ "./src/app/objects/index.ts":
/*!**********************************!*\
  !*** ./src/app/objects/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./text */ "./src/app/objects/text.ts"), exports);
__exportStar(__webpack_require__(/*! ./star */ "./src/app/objects/star.ts"), exports);
__exportStar(__webpack_require__(/*! ./line */ "./src/app/objects/line.ts"), exports);


/***/ }),

/***/ "./src/app/objects/line.ts":
/*!*********************************!*\
  !*** ./src/app/objects/line.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Line = void 0;
class Line {
    constructor(options) {
        this.color = '#fff';
        this.width = 2;
        this.isAnimate = true;
        const { from, color, width, to, animate } = options;
        this.from = [...from];
        this.to = [...to];
        if (color) {
            this.color = color;
        }
        if (width) {
            this.width = width;
        }
        if (animate) {
            this.animate = animate;
            this.to = [...from];
            this.toXY = [...to];
            this.deltas = this.setDeltas(from, to);
            this.directions = Line.setDirections(from, to);
        }
    }
    update() {
        if (this.animate && this.deltas && this.isAnimate) {
            this.to[0] = Line.setCoordinate(this.to[0], this.deltas[0], this.directions[0]);
            this.to[1] = Line.setCoordinate(this.to[1], this.deltas[1], this.directions[1]);
            this.isAnimate = !(Line.isFinish(this.to[0], this.toXY[0], this.directions[0]) && Line.isFinish(this.to[1], this.toXY[1], this.directions[1]));
        }
    }
    setDeltas(from, to) {
        const deltaX = Math.abs(from[0] - to[0]) / this.animate;
        const deltaY = Math.abs(from[1] - to[1]) / this.animate;
        return [deltaX, deltaY];
    }
    static setDirections(from, to) {
        return [
            from[0] > to[0],
            from[1] > to[1],
        ];
    }
    static setCoordinate(coordinate, delta, direction) {
        return direction ? coordinate -= delta : coordinate += delta;
    }
    static isFinish(startPoint, endPoint, direction) {
        return direction ? startPoint <= endPoint : startPoint >= endPoint;
    }
}
exports.Line = Line;


/***/ }),

/***/ "./src/app/objects/star.ts":
/*!*********************************!*\
  !*** ./src/app/objects/star.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Star = void 0;
class Star {
    constructor(options) {
        this.radius = 10;
        this.color = '#fff';
        this.id = 0;
        const { id, x, y, radius, color } = options;
        this.x = x;
        this.y = y;
        if (id) {
            this.id = id;
        }
        if (radius) {
            this.radius = radius;
        }
        if (color) {
            this.color = color;
        }
    }
}
exports.Star = Star;


/***/ }),

/***/ "./src/app/objects/text.ts":
/*!*********************************!*\
  !*** ./src/app/objects/text.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Text = void 0;
class Text {
    constructor(options) {
        this.background = undefined;
        this.animate = 0;
        this.isAnimate = false;
        this.index = 0;
        this.timeStamp = 0;
        const { size, x, color, text, y, textAlign, textBaseline, animate, background } = options;
        this.x = x;
        this.y = y;
        this.size = size || 20;
        this.color = color || '#fff';
        this.text = text;
        this.textAlign = textAlign || 'left';
        this.textBaseline = textBaseline || 'bottom';
        this.animate = animate || this.animate;
        if (background) {
            this.background = Object.assign({ color: '#000', padding: 0 }, background);
        }
        if (animate) {
            this.isAnimate = true;
            this.fullText = text;
            this.text = '';
            this.timeStamp = animate;
        }
    }
    update(time) {
        if (!this.isAnimate && !this.animate) {
            return;
        }
        const max = this.fullText.length - 1;
        if (time >= this.timeStamp) {
            if (this.fullText && this.index <= max) {
                let currentLetter = this.fullText[this.index];
                while (currentLetter === ' ') {
                    this.index++;
                    currentLetter += this.fullText[this.index];
                }
                this.text += currentLetter;
                this.index++;
                if (this.index === max) {
                    this.isAnimate = false;
                }
            }
            this.timeStamp = time + this.animate;
        }
    }
}
exports.Text = Text;


/***/ }),

/***/ "./src/app/scenes/coordinates/coordinates.scene.ts":
/*!*********************************************************!*\
  !*** ./src/app/scenes/coordinates/coordinates.scene.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoordinatesScene = void 0;
const constants_1 = __webpack_require__(/*! ../../constants */ "./src/app/constants/index.ts");
const objects_1 = __webpack_require__(/*! ../../objects */ "./src/app/objects/index.ts");
const aim_1 = __webpack_require__(/*! ./objects/aim */ "./src/app/scenes/coordinates/objects/aim.ts");
class CoordinatesScene {
    constructor(game) {
        this.game = game;
        this.type = constants_1.SCENE.COORDINATES;
        this.gridParams = [50, 50];
        this.lineWidth = 5;
        this.color = '#1a2546';
        this.points = [];
        this.grid = this.createGrid();
        this.aim = new aim_1.Aim(this.game.screen);
        this.game.screen.canvas.addEventListener('mousemove', this.updateCursor.bind(this));
        this.game.screen.canvas.addEventListener('click', this.addPoint.bind(this));
    }
    render(time) {
        // draw grid
        this.grid.forEach(lines => {
            lines.forEach(line => {
                this.game.screen.drawLine(line.line);
                this.game.screen.drawText(line.text);
            });
        });
        //draw aim
        this.aim.draw();
        //draw points
        this.points.forEach(point => {
            this.game.screen.drawText(point.text);
            this.game.screen.drawStar(point.point);
        });
    }
    update(time) {
    }
    init() {
    }
    createGrid() {
        const xAmount = this.game.screen.width / this.gridParams[0];
        const yAmount = this.game.screen.height / this.gridParams[1];
        let xGrid = [];
        let yGrid = [];
        for (let i = 0, x = xAmount; i < x; i++) {
            let delta = i * this.gridParams[0];
            yGrid.push({
                text: new objects_1.Text({ x: delta, y: 0, text: `${i * this.gridParams[0]}`, textAlign: "left", textBaseline: "top", size: 15 }),
                line: new objects_1.Line({
                    from: [delta, 0],
                    to: [delta, this.game.screen.height],
                    color: this.color
                })
            });
        }
        for (let i = 0, x = yAmount; i < x; i++) {
            let delta = i * this.gridParams[1];
            xGrid.push({
                text: new objects_1.Text({ x: 0, y: delta, text: `${delta}`, textBaseline: "top", size: 15 }),
                line: new objects_1.Line({
                    from: [0, delta],
                    to: [this.game.screen.width, delta],
                    color: this.color
                })
            });
        }
        return [xGrid, yGrid];
    }
    updateCursor(e) {
        this.aim.update(e.x - e.target.offsetLeft, e.y - e.target.offsetTop);
    }
    addPoint(e) {
        let [x, y] = [e.x - e.target.offsetLeft, e.y - e.target.offsetTop];
        this.points.push({
            text: new objects_1.Text({ x, y, text: `${x} - ${y}` }),
            point: new objects_1.Star({ x, y })
        });
    }
    roundCoordinates(c) {
        return (Math.round(c / 10)) * 10;
    }
}
exports.CoordinatesScene = CoordinatesScene;


/***/ }),

/***/ "./src/app/scenes/coordinates/objects/aim.ts":
/*!***************************************************!*\
  !*** ./src/app/scenes/coordinates/objects/aim.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Aim = void 0;
const objects_1 = __webpack_require__(/*! ../../../objects */ "./src/app/objects/index.ts");
class Aim {
    constructor(screen) {
        this.screen = screen;
        this.color = 'green';
        const { width, height } = screen;
        this.x = new objects_1.Line({
            from: [0, 0],
            to: [width, 0],
            color: this.color
        });
        this.y = new objects_1.Line({
            from: [0, 0],
            to: [0, height],
            color: this.color
        });
    }
    draw() {
        this.screen.drawLine(this.x);
        this.screen.drawLine(this.y);
    }
    update(x, y) {
        this.x.from[1] = y;
        this.x.to[1] = y;
        this.y.from[0] = x;
        this.y.to[0] = x;
    }
}
exports.Aim = Aim;


/***/ }),

/***/ "./src/app/scenes/index.ts":
/*!*********************************!*\
  !*** ./src/app/scenes/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./scenes */ "./src/app/scenes/scenes.ts"), exports);
__exportStar(__webpack_require__(/*! ./welcome/welcome.scene */ "./src/app/scenes/welcome/welcome.scene.ts"), exports);
__exportStar(__webpack_require__(/*! ./stars/stars.scene */ "./src/app/scenes/stars/stars.scene.ts"), exports);
__exportStar(__webpack_require__(/*! ./coordinates/coordinates.scene */ "./src/app/scenes/coordinates/coordinates.scene.ts"), exports);
__exportStar(__webpack_require__(/*! ./text/text.scene */ "./src/app/scenes/text/text.scene.ts"), exports);


/***/ }),

/***/ "./src/app/scenes/scenes.ts":
/*!**********************************!*\
  !*** ./src/app/scenes/scenes.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scenes = void 0;
class Scenes {
    constructor(scenes) {
        this.scenes = new Map();
        // add scenes
        scenes.forEach(scene => this.addScene(scene));
    }
    addScene(scene) {
        this.scenes.set(scene.type, scene);
    }
    switchScene(type) {
        const scene = this.scenes.get(type);
        if (scene) {
            if (scene.reset) {
                scene.reset();
            }
            scene.init();
            this.currentScene = scene;
        }
        else {
            throw new Error(`The scene "${type}" not found.`);
        }
    }
}
exports.Scenes = Scenes;


/***/ }),

/***/ "./src/app/scenes/stars/stars.scene.ts":
/*!*********************************************!*\
  !*** ./src/app/scenes/stars/stars.scene.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StarsScene = void 0;
const constants_1 = __webpack_require__(/*! ../../constants */ "./src/app/constants/index.ts");
const objects_1 = __webpack_require__(/*! ../../objects */ "./src/app/objects/index.ts");
const helpers_1 = __webpack_require__(/*! ../../helpers */ "./src/app/helpers/index.ts");
const constellation = __importStar(__webpack_require__(/*! ../../../constellations/my.json */ "./src/constellations/my.json"));
const heart = __importStar(__webpack_require__(/*! ../../../constellations/heart.json */ "./src/constellations/heart.json"));
class StarsScene {
    constructor(game) {
        this.game = game;
        this.type = constants_1.SCENE.STARS;
        this.messages = [
            'Видишь? Тут то самое созвездие. То, что даёт силы и тепло.',
            'Внимательней.',
            'Олька...',
            'Ладно, вот она',
        ];
        this.isDrawText = false;
        this.isDrawHeart = false;
        this.stars = [];
        this.messagesArr = [];
        this.animationStep = 1;
    }
    render(time) {
        // draw stars
        this.stars.forEach(star => {
            if (star.isShow) {
                this.game.screen.drawStar(star);
            }
        });
        // draw text
        if (this.isDrawText) {
            this.constellation.lines.forEach(line => this.game.screen.drawLine(line));
        }
        this.constellation.stars.forEach(star => this.game.screen.drawStar(star));
        // draw heart
        if (this.isDrawHeart) {
            this.heart.lines.forEach(line => this.game.screen.drawLine(line));
        }
        this.heart.stars.forEach(star => this.game.screen.drawStar(star));
        // draw hint
        this.game.screen.drawText(this.nextText);
        //draw message
        this.messagesArr.forEach(text => {
            if (text.isShow) {
                this.game.screen.drawText(text);
            }
        });
    }
    update(time) {
        if (this.isDrawText) {
            this.constellation.lines.forEach(line => line.update());
        }
        if (this.isDrawHeart) {
            this.heart.lines.forEach(line => line.update());
        }
        // update text
        this.messagesArr.forEach(text => {
            if (text.isShow) {
                text.update(time);
            }
            ;
        });
    }
    init() {
        this.stars = this.createStars(200);
        this.constellation = this.parseConstellation(constellation[0]);
        this.heart = this.parseConstellation(heart[0]);
        this.nextText = new objects_1.Text({
            x: 10,
            y: this.game.screen.height - 10,
            text: 'Press space to continue',
            color: 'rgba(141,192,255,.6)',
            background: {
                padding: 10
            }
        });
        this.messagesArr = this.messages.map((text, i) => {
            const textItem = new objects_1.Text({
                x: 10,
                y: i * 40 + 10,
                text,
                textBaseline: "top",
                animate: 50,
                background: {
                    padding: 10
                }
            });
            textItem.isShow = false;
            return textItem;
        });
        this.isDrawHeart = false;
        this.isDrawText = false;
        this.animationStep = 1;
        this.setShowFlag(this.messagesArr, this.animationStep);
        this.showStar(this.stars);
    }
    onEvent() {
        let isNextScene = false;
        if (this.animationStep === this.messages.length + 1) {
            isNextScene = true;
        }
        if (this.animationStep < this.messages.length) {
            this.animationStep++;
            this.setShowFlag(this.messagesArr, this.animationStep);
        }
        if (this.animationStep === this.messages.length) {
            this.animationStep++;
            setTimeout(() => {
                this.isDrawHeart = true;
            }, 2000);
            setTimeout(() => {
                this.isDrawText = true;
            }, 1000);
        }
        return isNextScene;
    }
    setShowFlag(arr, index) {
        (new Array(index).fill('')).forEach((_, i) => {
            arr[i].isShow = true;
        });
    }
    createStars(amount) {
        const stars = [];
        for (let i = 0, x = amount; i < x; i++) {
            const star = new objects_1.Star({
                id: i,
                radius: (0, helpers_1.getRandomInt)(5, 10),
                x: (0, helpers_1.getRandomInt)(10, this.game.screen.width),
                y: (0, helpers_1.getRandomInt)(10, this.game.screen.height),
                color: (0, helpers_1.getRandomItem)(constants_1.starColors),
            });
            star.isShow = false;
            stars.push(star);
        }
        return stars;
    }
    parseConstellation(constellation) {
        const lines = [];
        const stars = [];
        constellation.stars.forEach((star) => {
            if (star.connect && star.connect.length) {
                star.connect.forEach((connectId) => {
                    const toStar = constellation.stars.find((star) => star.id === connectId);
                    lines.push(new objects_1.Line({ from: star.coordinates, to: toStar.coordinates, animate: 120 }));
                });
            }
            const newStar = new objects_1.Star({
                x: star.coordinates[0],
                y: star.coordinates[1],
                radius: 8,
            });
            stars.push(newStar);
        });
        return { stars, lines };
    }
    showStar(stars) {
        let max = stars.length - 1;
        show(0);
        function show(index) {
            if (index <= max) {
                setTimeout(() => {
                    stars[index].isShow = true;
                    index++;
                    show(index);
                }, 50);
            }
        }
    }
}
exports.StarsScene = StarsScene;


/***/ }),

/***/ "./src/app/scenes/text/text.scene.ts":
/*!*******************************************!*\
  !*** ./src/app/scenes/text/text.scene.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextScene = void 0;
const constants_1 = __webpack_require__(/*! ../../constants */ "./src/app/constants/index.ts");
const objects_1 = __webpack_require__(/*! ../../objects */ "./src/app/objects/index.ts");
const helpers_1 = __webpack_require__(/*! ../../helpers */ "./src/app/helpers/index.ts");
class TextScene {
    constructor(game) {
        this.game = game;
        this.type = constants_1.SCENE.TEXT;
        this.text = [];
        this.textRows = [
            '"Если Вселенная бесконечна действительно" ©NoizeMc',
            'Вселенная бесконечная. Звёзд не счесть. Звёзды, планеты, галактики.',
            'Представим, что Земля - это наша вселенная, а звёзды - это люди.',
            'Каждый сияет по-своему, начиная с карликов и заканчивая гигантами.',
            'Каждый уникален. У каждого своя история. И каждый когда-то вспыхнул и когда-то погаснет.',
            'Среди этих звёзд, я нашёл целое созвездие.',
            'Стоит только присмотреться и можно увидеть те звёздочки, которые меня вдохновляют.',
            'То созвездие, ради которой готов не всё.',
        ];
        this.stars = [];
        this.init();
    }
    render(time) {
        this.stars.forEach(star => this.game.screen.drawStar(star));
        this.text.forEach(text => this.game.screen.drawText(text));
        // draw hint
        this.game.screen.drawText(this.nextText);
    }
    update(time) {
        this.text.forEach(text => text.update(time));
    }
    init() {
        this.text = this.textRows.map((text, i) => {
            return new objects_1.Text({
                x: 20,
                y: i * 50 + 20,
                size: 30,
                animate: (0, helpers_1.getRandomInt)(1, 4) * 10,
                textBaseline: "top",
                text,
                background: {
                    color: '#000',
                    padding: 10
                }
            });
        });
        this.nextText = new objects_1.Text({
            x: 10,
            y: this.game.screen.height - 10,
            text: 'Press space to continue',
            color: 'rgba(141,192,255,.6)',
            background: {
                padding: 10
            }
        });
        this.stars = this.createStars(200);
    }
    createStars(amount) {
        const stars = [];
        for (let i = 0, x = amount; i < x; i++) {
            stars.push(new objects_1.Star({
                id: i,
                radius: (0, helpers_1.getRandomInt)(5, 10),
                x: (0, helpers_1.getRandomInt)(10, this.game.screen.width),
                y: (0, helpers_1.getRandomInt)(10, this.game.screen.height),
                color: (0, helpers_1.getRandomItem)(constants_1.starColors),
            }));
        }
        return stars;
    }
}
exports.TextScene = TextScene;


/***/ }),

/***/ "./src/app/scenes/welcome/welcome.scene.ts":
/*!*************************************************!*\
  !*** ./src/app/scenes/welcome/welcome.scene.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WelcomeScene = void 0;
const constants_1 = __webpack_require__(/*! ../../constants */ "./src/app/constants/index.ts");
const objects_1 = __webpack_require__(/*! ../../objects */ "./src/app/objects/index.ts");
class WelcomeScene {
    constructor(game) {
        this.game = game;
        this.type = constants_1.SCENE.WELCOME;
        this.init();
    }
    render(time) {
        this.game.screen.drawText(this.welcomeText);
    }
    update(time) {
        this.welcomeText.update(time);
    }
    init() {
        this.welcomeText = new objects_1.Text({
            text: 'PRESS SPACE TO START',
            color: '#7fddff',
            size: 50,
            x: 10,
            y: 10,
            textBaseline: 'top',
            animate: 50
        });
    }
}
exports.WelcomeScene = WelcomeScene;


/***/ }),

/***/ "./src/app/screen/index.ts":
/*!*********************************!*\
  !*** ./src/app/screen/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./screen */ "./src/app/screen/screen.ts"), exports);


/***/ }),

/***/ "./src/app/screen/screen.ts":
/*!**********************************!*\
  !*** ./src/app/screen/screen.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Screen = void 0;
class Screen {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }
    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawText(textObj) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.font = `${textObj.size}px sans-serif`;
        this.ctx.fillStyle = textObj.color;
        this.ctx.textBaseline = textObj.textBaseline;
        this.ctx.textAlign = textObj.textAlign;
        // draw background
        if (textObj.background) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = textObj.background.color;
            this.ctx.fillRect(textObj.x - textObj.background.padding, textObj.textBaseline === 'top' ? textObj.y - textObj.background.padding : textObj.y - textObj.size - textObj.background.padding, this.ctx.measureText(textObj.text).width + textObj.background.padding * 2, textObj.size + textObj.background.padding * 2);
            this.ctx.closePath();
            this.ctx.restore();
        }
        this.ctx.fillText(textObj.text, textObj.x, textObj.y);
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawStar(star) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = star.color;
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawLine(line) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = line.color;
        this.ctx.lineWidth = line.width;
        this.ctx.moveTo(line.from[0], line.from[1]);
        this.ctx.lineTo(line.to[0], line.to[1]);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
exports.Screen = Screen;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const app_1 = __importDefault(__webpack_require__(/*! ./app/app */ "./src/app/app.ts"));
const canvas = document.getElementById('canvas');
if (canvas) {
    const app = new app_1.default(canvas);
    app.run();
}


/***/ }),

/***/ "./src/constellations/heart.json":
/*!***************************************!*\
  !*** ./src/constellations/heart.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"stars":[{"id":1,"coordinates":[1850,750],"connect":[2,8]},{"id":2,"coordinates":[1750,500],"connect":[3]},{"id":3,"coordinates":[1651,485],"connect":[4]},{"id":4,"coordinates":[1605,537],"connect":[]},{"id":5,"coordinates":[1687,637],"connect":[4]},{"id":6,"coordinates":[1560,648],"connect":[5]},{"id":7,"coordinates":[1532,715],"connect":[6]},{"id":8,"coordinates":[1630,775],"connect":[7]}]}]');

/***/ }),

/***/ "./src/constellations/my.json":
/*!************************************!*\
  !*** ./src/constellations/my.json ***!
  \************************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"stars":[{"id":1,"coordinates":[150,150],"connect":[2]},{"id":2,"coordinates":[180,370]},{"id":3,"coordinates":[310,130],"connect":[4]},{"id":4,"coordinates":[300,350],"connect":[5]},{"id":5,"coordinates":[450,330]},{"id":6,"coordinates":[550,150],"connect":[7]},{"id":7,"coordinates":[520,370],"connect":[9]},{"id":8,"coordinates":[700,150],"connect":[6]},{"id":9,"coordinates":[700,350],"connect":[8]},{"id":10,"coordinates":[800,70]},{"id":11,"coordinates":[900,350],"connect":[10,12]},{"id":12,"coordinates":[1000,150]},{"id":13,"coordinates":[1080,110],"connect":[]},{"id":14,"coordinates":[1100,250],"connect":[17,13,15]},{"id":15,"coordinates":[1100,380],"connect":[]},{"id":16,"coordinates":[1250,150],"connect":[13]},{"id":17,"coordinates":[1250,220],"connect":[]},{"id":18,"coordinates":[1250,350],"connect":[15]},{"id":19,"coordinates":[400,450],"connect":[21]},{"id":20,"coordinates":[550,450],"connect":[21]},{"id":21,"coordinates":[480,500],"connect":[]},{"id":22,"coordinates":[400,650],"connect":[21]},{"id":23,"coordinates":[650,450],"connect":[24,25]},{"id":24,"coordinates":[670,600],"connect":[26]},{"id":25,"coordinates":[800,420],"connect":[]},{"id":26,"coordinates":[780,630],"connect":[25]},{"id":27,"coordinates":[880,450],"connect":[28]},{"id":28,"coordinates":[900,650],"connect":[29]},{"id":29,"coordinates":[1030,630],"connect":[]},{"id":30,"coordinates":[1070,470],"connect":[29]}]}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckIsQ0FBQztDQUNGO0FBbkVELHdCQW1FQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFRCx3RkFBNEI7QUFFNUIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQXNCLENBQUM7QUFDdEUsSUFBRyxNQUFNLEVBQUU7SUFDVCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDTkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9hcHAudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL2NvbnN0YW50cy9pbmRleC50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvY29uc3RhbnRzL3NjZW5lLmVudW0udHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL2NvbnN0YW50cy9zdGFyLWNvbG9ycy50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvY29udHJvbC9jb250cm9sLnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9jb250cm9sL2luZGV4LnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9jb250cm9sL2tleS5lbnVtLnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9oZWxwZXJzL2dldFJhbmRvbUl0ZW0udHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL2hlbHBlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL2hlbHBlcnMvcmFuZG9tSW50ZW5nZXIudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL29iamVjdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL29iamVjdHMvbGluZS50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvb2JqZWN0cy9zdGFyLnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9vYmplY3RzL3RleHQudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL3NjZW5lcy9jb29yZGluYXRlcy9jb29yZGluYXRlcy5zY2VuZS50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvc2NlbmVzL2Nvb3JkaW5hdGVzL29iamVjdHMvYWltLnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9zY2VuZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL3NjZW5lcy9zY2VuZXMudHMiLCJ3ZWJwYWNrOi8vc3RhcnMvLi9zcmMvYXBwL3NjZW5lcy9zdGFycy9zdGFycy5zY2VuZS50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvc2NlbmVzL3RleHQvdGV4dC5zY2VuZS50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvc2NlbmVzL3dlbGNvbWUvd2VsY29tZS5zY2VuZS50cyIsIndlYnBhY2s6Ly9zdGFycy8uL3NyYy9hcHAvc2NyZWVuL2luZGV4LnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2FwcC9zY3JlZW4vc2NyZWVuLnRzIiwid2VicGFjazovL3N0YXJzLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3N0YXJzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N0YXJzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc3RhcnMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3N0YXJzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NjcmVlbn0gZnJvbSBcIi4vc2NyZWVuXCI7XG5pbXBvcnQge0Nvb3JkaW5hdGVzU2NlbmUsIFNjZW5lcywgU3RhcnNTY2VuZSwgVGV4dFNjZW5lLCBXZWxjb21lU2NlbmV9IGZyb20gXCIuL3NjZW5lc1wiO1xuaW1wb3J0IHtHYW1lfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7Q29udHJvbCwgS0VZfSBmcm9tIFwiLi9jb250cm9sXCI7XG5pbXBvcnQge1NDRU5FfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIGltcGxlbWVudHMgR2FtZSB7XG4gIHNjcmVlbjogU2NyZWVuO1xuICBzY2VuZXM6IFNjZW5lcztcbiAgY29udHJvbDogQ29udHJvbDtcbiAgc2NlbmVzT3JkZXI6IFNDRU5FW10gPSBbU0NFTkUuV0VMQ09NRSwgU0NFTkUuVEVYVCwgU0NFTkUuU1RBUlNdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuICApIHtcbiAgICB0aGlzLmNvbnRyb2wgPSBuZXcgQ29udHJvbCgpO1xuICAgIHRoaXMuc2NyZWVuID0gbmV3IFNjcmVlbihjYW52YXMpO1xuXG4gICAgLy8gc2V0IHNjZW5lc1xuICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lcyhbXG4gICAgICBuZXcgV2VsY29tZVNjZW5lKHRoaXMpLFxuICAgICAgbmV3IFN0YXJzU2NlbmUodGhpcyksXG4gICAgICBuZXcgQ29vcmRpbmF0ZXNTY2VuZSh0aGlzKSxcbiAgICAgIG5ldyBUZXh0U2NlbmUodGhpcylcbiAgICBdKTtcblxuICAgIC8vc2V0IGRlZmF1bHQgc2NlbmVcbiAgICB0aGlzLnNjZW5lcy5zd2l0Y2hTY2VuZSh0aGlzLnNjZW5lc09yZGVyWzBdKTtcblxuICAgIC8vIGluaXQga2V5Ym9hcmRcbiAgICB0aGlzLmtleWJvYXJkKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICBsZXQgYW5pbWF0aW9uSWQ6IG51bWJlcjtcbiAgICBsZXQgdGltZXIgPSAwO1xuICAgIGNvbnN0IGludGVydmFsID0gMTAwMC82MDtcbiAgICBsZXQgbGFzdFRpbWUgPSAwO1xuXG4gICAgY29uc3QgYW5pbWF0ZSA9ICh0aW1lU3RhbXA6IG51bWJlciA9IDApID0+IHtcbiAgICAgICAgY29uc3QgZGVsdGFUaW1lID0gdGltZVN0YW1wIC0gbGFzdFRpbWUgfHwgMDtcbiAgICAgICAgbGFzdFRpbWUgPSB0aW1lU3RhbXA7XG5cbiAgICAgICAgaWYodGltZXIgPiBpbnRlcnZhbCkge1xuICAgICAgICAgIHRoaXMuc2NyZWVuLmNsZWFyU2NyZWVuKCk7XG4gICAgICAgICAgaWYodGhpcy5zY2VuZXMuY3VycmVudFNjZW5lLnVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZXMuY3VycmVudFNjZW5lLnVwZGF0ZSh0aW1lU3RhbXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNjZW5lcy5jdXJyZW50U2NlbmUucmVuZGVyKHRpbWVTdGFtcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGltZXIgKz0gZGVsdGFUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgYW5pbWF0ZSgpO1xuICB9XG4gIHJ1bigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG4gIGtleWJvYXJkKCkge1xuICAgIHRoaXMuY29udHJvbC5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgY29uc3QgaXNTcGFjZURvd24gPSBzdGF0ZS5nZXQoS0VZLlNQQUNFKTtcbiAgICAgIGlmKGlzU3BhY2VEb3duKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuc2NlbmVzT3JkZXIuaW5kZXhPZih0aGlzLnNjZW5lcy5jdXJyZW50U2NlbmUudHlwZSk7XG4gICAgICAgIGNvbnN0IG5leHRTY2VuZSA9IHRoaXMuc2NlbmVzT3JkZXJbY3VycmVudEluZGV4ICsgMV07XG4gICAgICAgIGxldCBpc05leHQgPSB0cnVlO1xuXG4gICAgICAgIGlmKHRoaXMuc2NlbmVzLmN1cnJlbnRTY2VuZS50eXBlID09PSBTQ0VORS5TVEFSUykge1xuICAgICAgICAgIGlmKHRoaXMuc2NlbmVzLmN1cnJlbnRTY2VuZS5vbkV2ZW50KSB7XG4gICAgICAgICAgICBpc05leHQgPSB0aGlzLnNjZW5lcy5jdXJyZW50U2NlbmUub25FdmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFpc05leHQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZihuZXh0U2NlbmUpIHtcbiAgICAgICAgICB0aGlzLnNjZW5lcy5zd2l0Y2hTY2VuZShuZXh0U2NlbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2NlbmVzLnN3aXRjaFNjZW5lKFNDRU5FLldFTENPTUUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0iLCJleHBvcnQgKiBmcm9tICcuL3NjZW5lLmVudW0nO1xuZXhwb3J0ICogZnJvbSAnLi9zdGFyLWNvbG9ycyc7IiwiZXhwb3J0IGVudW0gU0NFTkUge1xuICBXRUxDT01FID0gJ3dlbGNvbWUnLFxuICBTVEFSUyA9ICdzdGFycycsXG4gIENPT1JESU5BVEVTID0gJ2Nvb3JkaW5hdGVzJyxcbiAgVEVYVCA9ICd0ZXh0J1xufSIsImV4cG9ydCBjb25zdCBzdGFyQ29sb3JzID0gWycjZmZiN2I3JywgJyNiNWM2ZmYnLCAnI2ZmZmZjMycsICcjZmZmJ107IiwiaW1wb3J0IHtLRVl9IGZyb20gJy4va2V5LmVudW0nO1xuXG50eXBlIGNvbnRyb2xTdGF0ZSA9IE1hcDxLRVksIGJvb2xlYW4+O1xudHlwZSBjYWxsQmFjayA9IChkYXRhOiBjb250cm9sU3RhdGUpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBDb250cm9sIHtcbiAgb2JzZXJ2ZXJzOiBjYWxsQmFja1tdID0gW107XG4gIGlzRG93biA9IHRydWU7XG4gIGtleU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFtcbiAgICBbS0VZLlNQQUNFLCAnc3RhcnQnXVxuICBdKTtcbiAgc3RhdGU6IGNvbnRyb2xTdGF0ZSA9IG5ldyBNYXA8S0VZLCBib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB0aGlzLnVwZGF0ZShldmVudCwgdHJ1ZSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZXZlbnQgPT4gdGhpcy51cGRhdGUoZXZlbnQsIGZhbHNlKSk7XG4gIH1cblxuICB1cGRhdGUoZTogS2V5Ym9hcmRFdmVudCwgc3RhdGU6IGJvb2xlYW4pIHtcbiAgICBpZih0aGlzLmtleU1hcC5oYXMoZS5jb2RlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgdGhpcy5zdGF0ZS5zZXQoS0VZLlNQQUNFLCBzdGF0ZSk7XG5cbiAgICAgIGlmKHRoaXMuaXNEb3duIHx8ICFzdGF0ZSkge1xuICAgICAgICB0aGlzLmVtaXRPYnNlcnZlcnMoKTtcbiAgICAgICAgdGhpcy5pc0Rvd24gPSAhc3RhdGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlKGNiOiBjYWxsQmFjaykge1xuICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goY2IpO1xuICB9XG5cbiAgZW1pdE9ic2VydmVycygpIHtcbiAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKHN1YiA9PiBzdWIodGhpcy5zdGF0ZSkpO1xuICB9XG59IiwiZXhwb3J0ICogZnJvbSAnLi9jb250cm9sJztcbmV4cG9ydCAqIGZyb20gJy4va2V5LmVudW0nOyIsImV4cG9ydCBlbnVtIEtFWSB7XG4gIFNQQUNFID0gJ1NwYWNlJ1xufSIsImltcG9ydCB7Z2V0UmFuZG9tSW50fSBmcm9tIFwiLi9yYW5kb21JbnRlbmdlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSXRlbTxUPihhcnI6IFRbXSk6IFQge1xuICBjb25zdCBpbmRleCA9IGdldFJhbmRvbUludCgwLCBhcnIubGVuZ3RoIC0xKTtcbiAgcmV0dXJuIGFycltpbmRleF07XG59IiwiZXhwb3J0ICogZnJvbSAnLi9yYW5kb21JbnRlbmdlcic7XG5leHBvcnQgKiBmcm9tICcuL2dldFJhbmRvbUl0ZW0nOyIsImV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XG4gIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufSIsImV4cG9ydCAqIGZyb20gJy4vdGV4dCc7XG5leHBvcnQgKiBmcm9tICcuL3N0YXInO1xuZXhwb3J0ICogZnJvbSAnLi9saW5lJzsiLCJ0eXBlIENvb3JkaW5hdGVzID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGNsYXNzIExpbmUge1xuICBjb2xvciA9ICcjZmZmJztcbiAgd2lkdGggPSAyO1xuICBhbmltYXRlPzogbnVtYmVyO1xuICBmcm9tOiBDb29yZGluYXRlcztcbiAgdG86IENvb3JkaW5hdGVzO1xuICBwcml2YXRlIHRvWFk/OiBDb29yZGluYXRlcztcbiAgcHJpdmF0ZSBkZWx0YXM/OiBDb29yZGluYXRlcztcbiAgcHJpdmF0ZSBkaXJlY3Rpb25zPzogW2Jvb2xlYW4sIGJvb2xlYW5dO1xuICBwcml2YXRlIGlzQW5pbWF0ZSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb3B0aW9uczoge1xuICAgICAgZnJvbTogQ29vcmRpbmF0ZXMsXG4gICAgICB0bzogQ29vcmRpbmF0ZXMsXG4gICAgICB3aWR0aD86IG51bWJlcixcbiAgICAgIGNvbG9yPzogc3RyaW5nLFxuICAgICAgYW5pbWF0ZT86IG51bWJlclxuICAgIH1cbiAgKSB7XG4gICAgY29uc3Qge2Zyb20sIGNvbG9yLCB3aWR0aCwgdG8sIGFuaW1hdGV9ID0gb3B0aW9ucztcbiAgICB0aGlzLmZyb20gPSBbLi4uZnJvbV07XG4gICAgdGhpcy50byA9IFsuLi50b107XG4gICAgaWYoY29sb3IpIHtcbiAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG4gICAgaWYod2lkdGgpIHtcbiAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB9XG4gICAgaWYoYW5pbWF0ZSkge1xuICAgICAgdGhpcy5hbmltYXRlID0gYW5pbWF0ZTtcbiAgICAgIHRoaXMudG8gPSBbLi4uZnJvbV07XG4gICAgICB0aGlzLnRvWFkgPSBbLi4udG9dO1xuICAgICAgdGhpcy5kZWx0YXMgPSB0aGlzLnNldERlbHRhcyhmcm9tLCB0byk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnMgPSBMaW5lLnNldERpcmVjdGlvbnMoZnJvbSwgdG8pO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBpZih0aGlzLmFuaW1hdGUgJiYgdGhpcy5kZWx0YXMgJiYgdGhpcy5pc0FuaW1hdGUpIHtcbiAgICAgIHRoaXMudG9bMF0gPSBMaW5lLnNldENvb3JkaW5hdGUodGhpcy50b1swXSwgdGhpcy5kZWx0YXMhWzBdLCB0aGlzLmRpcmVjdGlvbnMhWzBdKTtcbiAgICAgIHRoaXMudG9bMV0gPSBMaW5lLnNldENvb3JkaW5hdGUodGhpcy50b1sxXSwgdGhpcy5kZWx0YXMhWzFdLCB0aGlzLmRpcmVjdGlvbnMhWzFdKTtcblxuICAgICAgdGhpcy5pc0FuaW1hdGUgPSAhKExpbmUuaXNGaW5pc2godGhpcy50b1swXSwgdGhpcy50b1hZIVswXSwgdGhpcy5kaXJlY3Rpb25zIVswXSkgJiYgTGluZS5pc0ZpbmlzaCh0aGlzLnRvWzFdLCB0aGlzLnRvWFkhWzFdLCB0aGlzLmRpcmVjdGlvbnMhWzFdKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREZWx0YXMoZnJvbTogQ29vcmRpbmF0ZXMsIHRvOiBDb29yZGluYXRlcyk6IENvb3JkaW5hdGVzIHtcbiAgICBjb25zdCBkZWx0YVggPSBNYXRoLmFicyhmcm9tWzBdIC0gdG9bMF0pIC8gdGhpcy5hbmltYXRlITtcbiAgICBjb25zdCBkZWx0YVkgPSBNYXRoLmFicyhmcm9tWzFdIC0gdG9bMV0pIC8gdGhpcy5hbmltYXRlITtcblxuICAgIHJldHVybiBbZGVsdGFYLCBkZWx0YVldO1xuICB9XG4gIHByaXZhdGUgc3RhdGljIHNldERpcmVjdGlvbnMoZnJvbTogQ29vcmRpbmF0ZXMsIHRvOiBDb29yZGluYXRlcyk6IFtib29sZWFuLCBib29sZWFuXXtcbiAgICByZXR1cm4gW1xuICAgICAgZnJvbVswXSA+IHRvWzBdLFxuICAgICAgZnJvbVsxXSA+IHRvWzFdLFxuICAgIF1cbiAgfVxuICBwcml2YXRlIHN0YXRpYyBzZXRDb29yZGluYXRlKGNvb3JkaW5hdGU6IG51bWJlciwgZGVsdGE6IG51bWJlciwgZGlyZWN0aW9uOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGRpcmVjdGlvbiA/IGNvb3JkaW5hdGUgLT0gZGVsdGEgOiBjb29yZGluYXRlICs9IGRlbHRhO1xuICB9XG4gIHByaXZhdGUgc3RhdGljIGlzRmluaXNoKHN0YXJ0UG9pbnQ6IG51bWJlciwgZW5kUG9pbnQ6IG51bWJlciwgZGlyZWN0aW9uOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGRpcmVjdGlvbiA/IHN0YXJ0UG9pbnQgPD0gZW5kUG9pbnQgOiBzdGFydFBvaW50ID49IGVuZFBvaW50O1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIFN0YXIge1xuICBwdWJsaWMgcmFkaXVzID0gMTA7XG4gIHB1YmxpYyBjb2xvciA9ICcjZmZmJztcbiAgaWQ6IG51bWJlciA9IDA7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIGlkPzogbnVtYmVyLFxuICAgICAgeDogbnVtYmVyLFxuICAgICAgeTogbnVtYmVyLFxuICAgICAgcmFkaXVzPzogbnVtYmVyLFxuICAgICAgY29sb3I/OiBzdHJpbmdcbiAgICB9XG4gICkge1xuICAgIGNvbnN0IHtpZCwgeCwgeSwgcmFkaXVzLCBjb2xvcn0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgaWYoaWQpIHtcbiAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9XG4gICAgaWYocmFkaXVzKSB7XG4gICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB9XG4gICAgaWYoY29sb3IpIHtcbiAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG4gIH1cbn0iLCJpbnRlcmZhY2UgQmFja2dyb3VuZCB7XG4gIGNvbG9yOiBzdHJpbmcsXG4gIHBhZGRpbmc6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFRleHQge1xuICBzaXplOiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB0ZXh0OiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7XG4gIHRleHRBbGlnbjogQ2FudmFzVGV4dEFsaWduO1xuICB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZTtcbiAgYmFja2dyb3VuZDogQmFja2dyb3VuZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgYW5pbWF0ZTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBpc0FuaW1hdGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBmdWxsVGV4dD86IHN0cmluZztcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XG4gIHByaXZhdGUgdGltZVN0YW1wID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvcHRpb25zOiB7XG4gICAgICB4OiBudW1iZXIsXG4gICAgICB5OiBudW1iZXIsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICBzaXplPzogbnVtYmVyLFxuICAgICAgY29sb3I/OiBzdHJpbmcsXG4gICAgICB0ZXh0QWxpZ24/OiBDYW52YXNUZXh0QWxpZ25cbiAgICAgIHRleHRCYXNlbGluZT86IENhbnZhc1RleHRCYXNlbGluZVxuICAgICAgYW5pbWF0ZT86IG51bWJlcixcbiAgICAgIGJhY2tncm91bmQ/OiBQYXJ0aWFsPEJhY2tncm91bmQ+XG4gICAgfVxuICApIHtcbiAgICBjb25zdCB7c2l6ZSwgeCwgY29sb3IsIHRleHQsIHksIHRleHRBbGlnbiwgdGV4dEJhc2VsaW5lLCBhbmltYXRlLCBiYWNrZ3JvdW5kfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5zaXplID0gc2l6ZSB8fCAyMDtcbiAgICB0aGlzLmNvbG9yID0gY29sb3IgfHwgJyNmZmYnO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy50ZXh0QWxpZ24gPSB0ZXh0QWxpZ24gfHwgJ2xlZnQnO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gdGV4dEJhc2VsaW5lIHx8ICdib3R0b20nO1xuICAgIHRoaXMuYW5pbWF0ZSA9IGFuaW1hdGUgfHwgdGhpcy5hbmltYXRlO1xuXG4gICAgaWYoYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kID0ge1xuICAgICAgICBjb2xvcjogJyMwMDAnLFxuICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAuLi5iYWNrZ3JvdW5kXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChhbmltYXRlKSB7XG4gICAgICB0aGlzLmlzQW5pbWF0ZSA9IHRydWU7XG4gICAgICB0aGlzLmZ1bGxUZXh0ID0gdGV4dDtcbiAgICAgIHRoaXMudGV4dCA9ICcnO1xuICAgICAgdGhpcy50aW1lU3RhbXAgPSBhbmltYXRlO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSh0aW1lOiBudW1iZXIpIHtcbiAgICBpZighdGhpcy5pc0FuaW1hdGUgJiYgIXRoaXMuYW5pbWF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1heCA9IHRoaXMuZnVsbFRleHQhLmxlbmd0aCAtIDE7XG4gICAgaWYodGltZSA+PSB0aGlzLnRpbWVTdGFtcCkge1xuICAgICAgaWYodGhpcy5mdWxsVGV4dCAmJiB0aGlzLmluZGV4IDw9IG1heCkge1xuICAgICAgICBsZXQgY3VycmVudExldHRlciA9IHRoaXMuZnVsbFRleHQhW3RoaXMuaW5kZXhdO1xuICAgICAgICB3aGlsZSAoY3VycmVudExldHRlciA9PT0gJyAnKSB7XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgIGN1cnJlbnRMZXR0ZXIgKz0gdGhpcy5mdWxsVGV4dCFbdGhpcy5pbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0ICs9IGN1cnJlbnRMZXR0ZXI7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgaWYodGhpcy5pbmRleCA9PT0gbWF4KSB7XG4gICAgICAgICAgdGhpcy5pc0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy50aW1lU3RhbXAgPSB0aW1lICsgdGhpcy5hbmltYXRlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtHYW1lLCBTY2VuZX0gZnJvbSBcIi4uLy4uL21vZGVsc1wiO1xuaW1wb3J0IHtTQ0VORX0gZnJvbSBcIi4uLy4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHtMaW5lLCBTdGFyLCBUZXh0fSBmcm9tIFwiLi4vLi4vb2JqZWN0c1wiO1xuaW1wb3J0IHtBaW19IGZyb20gXCIuL29iamVjdHMvYWltXCI7XG5cbnR5cGUgR3JpZCA9IFt7dGV4dDogVGV4dCwgbGluZTogTGluZX1bXSwge3RleHQ6IFRleHQsIGxpbmU6IExpbmV9W11dO1xuXG5leHBvcnQgY2xhc3MgQ29vcmRpbmF0ZXNTY2VuZSBpbXBsZW1lbnRzIFNjZW5le1xuICB0eXBlID0gU0NFTkUuQ09PUkRJTkFURVM7XG4gIGdyaWRQYXJhbXM6IFtudW1iZXIsIG51bWJlcl0gPSBbNTAsIDUwXTtcbiAgbGluZVdpZHRoID0gNTtcbiAgY29sb3IgPSAnIzFhMjU0Nic7XG4gIGdyaWQ6IEdyaWQ7XG4gIGFpbTogQWltO1xuICBwb2ludHM6IHt0ZXh0OiBUZXh0LCBwb2ludDogU3Rhcn1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZ2FtZTogR2FtZVxuICApIHtcbiAgICB0aGlzLmdyaWQgPSB0aGlzLmNyZWF0ZUdyaWQoKTtcblxuICAgIHRoaXMuYWltID0gbmV3IEFpbSh0aGlzLmdhbWUuc2NyZWVuKTtcbiAgICB0aGlzLmdhbWUuc2NyZWVuLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnVwZGF0ZUN1cnNvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmdhbWUuc2NyZWVuLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYWRkUG9pbnQuYmluZCh0aGlzKSk7XG4gIH1cblxuICByZW5kZXIodGltZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gZHJhdyBncmlkXG4gICAgdGhpcy5ncmlkLmZvckVhY2gobGluZXMgPT4ge1xuICAgICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgICAgdGhpcy5nYW1lLnNjcmVlbi5kcmF3TGluZShsaW5lLmxpbmUpO1xuICAgICAgICB0aGlzLmdhbWUuc2NyZWVuLmRyYXdUZXh0KGxpbmUudGV4dCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vZHJhdyBhaW1cbiAgICB0aGlzLmFpbS5kcmF3KCk7XG5cbiAgICAvL2RyYXcgcG9pbnRzXG4gICAgdGhpcy5wb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICB0aGlzLmdhbWUuc2NyZWVuLmRyYXdUZXh0KHBvaW50LnRleHQpO1xuICAgICAgdGhpcy5nYW1lLnNjcmVlbi5kcmF3U3Rhcihwb2ludC5wb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUodGltZTogbnVtYmVyKSB7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgfVxuXG4gIGNyZWF0ZUdyaWQoKTogR3JpZCB7XG4gICAgY29uc3QgeEFtb3VudCA9IHRoaXMuZ2FtZS5zY3JlZW4ud2lkdGggLyB0aGlzLmdyaWRQYXJhbXNbMF07XG4gICAgY29uc3QgeUFtb3VudCA9IHRoaXMuZ2FtZS5zY3JlZW4uaGVpZ2h0IC8gdGhpcy5ncmlkUGFyYW1zWzFdO1xuICAgIGxldCB4R3JpZCA9IFtdO1xuICAgIGxldCB5R3JpZCA9IFtdO1xuXG4gICAgZm9yKGxldCBpID0gMCwgeCA9IHhBbW91bnQ7ICBpIDwgeDsgaSsrKSB7XG4gICAgICBsZXQgZGVsdGEgPSBpICogdGhpcy5ncmlkUGFyYW1zWzBdO1xuICAgICAgeUdyaWQucHVzaCh7XG4gICAgICAgIHRleHQ6IG5ldyBUZXh0KHt4OiBkZWx0YSwgeTogMCwgdGV4dDogYCR7aSAqIHRoaXMuZ3JpZFBhcmFtc1swXX1gLCB0ZXh0QWxpZ246IFwibGVmdFwiLCB0ZXh0QmFzZWxpbmU6IFwidG9wXCIsIHNpemU6IDE1fSksXG4gICAgICAgIGxpbmU6IG5ldyBMaW5lKHtcbiAgICAgICAgICBmcm9tOiBbIGRlbHRhLCAwXSxcbiAgICAgICAgICB0bzogWyBkZWx0YSwgdGhpcy5nYW1lLnNjcmVlbi5oZWlnaHRdLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgZm9yKGxldCBpID0gMCwgeCA9IHlBbW91bnQ7ICBpIDwgeDsgaSsrKSB7XG4gICAgICBsZXQgZGVsdGEgPSBpICogdGhpcy5ncmlkUGFyYW1zWzFdO1xuICAgICAgeEdyaWQucHVzaCh7XG4gICAgICAgIHRleHQ6IG5ldyBUZXh0KHt4OiAwLCB5OiBkZWx0YSwgdGV4dDogYCR7ZGVsdGF9YCwgdGV4dEJhc2VsaW5lOiBcInRvcFwiLCBzaXplOiAxNX0pLFxuICAgICAgICBsaW5lOiBuZXcgTGluZSh7XG4gICAgICAgICAgZnJvbTogWzAsIGRlbHRhXSxcbiAgICAgICAgICB0bzogW3RoaXMuZ2FtZS5zY3JlZW4ud2lkdGgsIGRlbHRhXSxcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvclxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbeEdyaWQsIHlHcmlkXTtcbiAgfVxuXG4gIHVwZGF0ZUN1cnNvcihlOiBhbnkpIHtcbiAgICB0aGlzLmFpbS51cGRhdGUoZS54IC0gZS50YXJnZXQub2Zmc2V0TGVmdCwgZS55IC0gZS50YXJnZXQub2Zmc2V0VG9wKTtcbiAgfVxuXG4gIGFkZFBvaW50KGU6IGFueSkge1xuICAgIGxldCBbeCwgeV0gPSBbZS54IC0gZS50YXJnZXQub2Zmc2V0TGVmdCwgZS55IC0gZS50YXJnZXQub2Zmc2V0VG9wXTtcbiAgICB0aGlzLnBvaW50cy5wdXNoKHtcbiAgICAgIHRleHQ6IG5ldyBUZXh0KHt4LCB5LCB0ZXh0OiBgJHt4fSAtICR7eX1gfSksXG4gICAgICBwb2ludDogbmV3IFN0YXIoe3gsIHl9KVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByb3VuZENvb3JkaW5hdGVzKGM6IG51bWJlcik6IG51bWJlcntcbiAgICByZXR1cm4gKE1hdGgucm91bmQoYyAvIDEwKSkgKiAxMDtcbiAgfVxufSIsImltcG9ydCB7TGluZX0gZnJvbSBcIi4uLy4uLy4uL29iamVjdHNcIjtcbmltcG9ydCB7U2NyZWVufSBmcm9tIFwiLi4vLi4vLi4vc2NyZWVuXCI7XG5cbmV4cG9ydCBjbGFzcyBBaW0ge1xuICB4OiBMaW5lO1xuICB5OiBMaW5lO1xuICBjb2xvciA9ICdncmVlbic7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzY3JlZW46IFNjcmVlblxuICApIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBzY3JlZW47XG4gICAgdGhpcy54ID0gbmV3IExpbmUoe1xuICAgICAgZnJvbTogWzAsIDBdLFxuICAgICAgdG86IFsgd2lkdGgsIDBdLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3JcbiAgICB9KTtcbiAgICB0aGlzLnkgPSBuZXcgTGluZSh7XG4gICAgICBmcm9tOiBbMCwgMF0sXG4gICAgICB0bzogWyAwLCBoZWlnaHRdLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3JcbiAgICB9KVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICB0aGlzLnNjcmVlbi5kcmF3TGluZSh0aGlzLngpO1xuICAgIHRoaXMuc2NyZWVuLmRyYXdMaW5lKHRoaXMueSk7XG4gIH1cbiAgdXBkYXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54LmZyb21bMV0gPSB5O1xuICAgIHRoaXMueC50b1sxXSA9IHk7XG4gICAgdGhpcy55LmZyb21bMF0gPSB4O1xuICAgIHRoaXMueS50b1swXSA9IHg7XG4gIH1cbn0iLCJleHBvcnQgKiBmcm9tICcuL3NjZW5lcyc7XG5leHBvcnQgKiBmcm9tICcuL3dlbGNvbWUvd2VsY29tZS5zY2VuZSc7XG5leHBvcnQgKiBmcm9tICcuL3N0YXJzL3N0YXJzLnNjZW5lJztcbmV4cG9ydCAqIGZyb20gJy4vY29vcmRpbmF0ZXMvY29vcmRpbmF0ZXMuc2NlbmUnO1xuZXhwb3J0ICogZnJvbSAnLi90ZXh0L3RleHQuc2NlbmUnOyIsImltcG9ydCB7U0NFTkV9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge1NjZW5lfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVzIHtcbiAgY3VycmVudFNjZW5lITogU2NlbmU7XG4gIHNjZW5lczogTWFwPFNDRU5FLCBTY2VuZT4gPSBuZXcgTWFwKCk7XG5cbiAgY29uc3RydWN0b3Ioc2NlbmVzOiBBcnJheTxTY2VuZT4pIHtcbiAgICAvLyBhZGQgc2NlbmVzXG4gICAgc2NlbmVzLmZvckVhY2goc2NlbmUgPT4gdGhpcy5hZGRTY2VuZShzY2VuZSkpO1xuICB9XG5cbiAgYWRkU2NlbmUoc2NlbmU6IFNjZW5lKSB7XG4gICAgdGhpcy5zY2VuZXMuc2V0KHNjZW5lLnR5cGUsIHNjZW5lKTtcbiAgfVxuXG4gIHN3aXRjaFNjZW5lKHR5cGU6IFNDRU5FKSB7XG4gICAgY29uc3Qgc2NlbmUgPSB0aGlzLnNjZW5lcy5nZXQodHlwZSk7XG4gICAgaWYoc2NlbmUpIHtcbiAgICAgIGlmKHNjZW5lLnJlc2V0KSB7XG4gICAgICAgIHNjZW5lLnJlc2V0KCk7XG4gICAgICB9XG4gICAgICBzY2VuZS5pbml0KCk7XG4gICAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzY2VuZSBcIiR7dHlwZX1cIiBub3QgZm91bmQuYCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtHYW1lLCBTY2VuZX0gZnJvbSBcIi4uLy4uL21vZGVsc1wiO1xuaW1wb3J0IHtTQ0VORSwgc3RhckNvbG9yc30gZnJvbSBcIi4uLy4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHtTdGFyLCBMaW5lLCBUZXh0fSBmcm9tIFwiLi4vLi4vb2JqZWN0c1wiO1xuaW1wb3J0IHtnZXRSYW5kb21JbnQsIGdldFJhbmRvbUl0ZW19IGZyb20gXCIuLi8uLi9oZWxwZXJzXCI7XG5pbXBvcnQgKiBhcyBjb25zdGVsbGF0aW9uIGZyb20gXCIuLi8uLi8uLi9jb25zdGVsbGF0aW9ucy9teS5qc29uXCI7XG5pbXBvcnQgKiBhcyBoZWFydCBmcm9tIFwiLi4vLi4vLi4vY29uc3RlbGxhdGlvbnMvaGVhcnQuanNvblwiO1xuXG5pbnRlcmZhY2UgU3RhclRleHQgZXh0ZW5kcyBUZXh0IHtcbiAgaXNTaG93PzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEhpZGRlblN0YXIgZXh0ZW5kcyBTdGFyIHtcbiAgaXNTaG93PzogYm9vbGVhbjtcbn1cblxudHlwZSBDb25zdGVsbGF0aW9uID0ge3N0YXJzOiBTdGFyW10sIGxpbmVzOiBMaW5lW119O1xuXG5leHBvcnQgY2xhc3MgU3RhcnNTY2VuZSBpbXBsZW1lbnRzIFNjZW5lIHtcbiAgdHlwZSA9IFNDRU5FLlNUQVJTO1xuICBjb25zdGVsbGF0aW9uITogQ29uc3RlbGxhdGlvbjtcbiAgaGVhcnQhOiBDb25zdGVsbGF0aW9uO1xuICBuZXh0VGV4dCE6IFRleHQ7XG4gIG1lc3NhZ2VzOiBzdHJpbmdbXSA9IFtcbiAgICAn0JLQuNC00LjRiNGMPyDQotGD0YIg0YLQviDRgdCw0LzQvtC1INGB0L7Qt9Cy0LXQt9C00LjQtS4g0KLQviwg0YfRgtC+INC00LDRkdGCINGB0LjQu9GLINC4INGC0LXQv9C70L4uJyxcbiAgICAn0JLQvdC40LzQsNGC0LXQu9GM0L3QtdC5LicsXG4gICAgJ9Ce0LvRjNC60LAuLi4nLFxuICAgICfQm9Cw0LTQvdC+LCDQstC+0YIg0L7QvdCwJyxcbiAgXTtcblxuICBwcml2YXRlIGlzRHJhd1RleHQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpc0RyYXdIZWFydCA9IGZhbHNlO1xuICBwcml2YXRlIHN0YXJzOiBIaWRkZW5TdGFyW10gPSBbXTtcbiAgcHJpdmF0ZSBtZXNzYWdlc0FycjogU3RhclRleHRbXSA9IFtdO1xuICBwcml2YXRlIGFuaW1hdGlvblN0ZXAgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZ2FtZTogR2FtZVxuICApIHtcblxuICB9XG5cbiAgcmVuZGVyKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGRyYXcgc3RhcnNcbiAgICB0aGlzLnN0YXJzLmZvckVhY2goc3RhciA9PiB7XG4gICAgICBpZihzdGFyLmlzU2hvdykge1xuICAgICAgICB0aGlzLmdhbWUuc2NyZWVuLmRyYXdTdGFyKHN0YXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZHJhdyB0ZXh0XG4gICAgaWYodGhpcy5pc0RyYXdUZXh0KSB7XG4gICAgICB0aGlzLmNvbnN0ZWxsYXRpb24ubGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuZ2FtZS5zY3JlZW4uZHJhd0xpbmUobGluZSkpO1xuICAgIH1cbiAgICB0aGlzLmNvbnN0ZWxsYXRpb24uc3RhcnMuZm9yRWFjaChzdGFyID0+IHRoaXMuZ2FtZS5zY3JlZW4uZHJhd1N0YXIoc3RhcikpO1xuXG4gICAgLy8gZHJhdyBoZWFydFxuICAgIGlmKHRoaXMuaXNEcmF3SGVhcnQpIHtcbiAgICAgIHRoaXMuaGVhcnQubGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuZ2FtZS5zY3JlZW4uZHJhd0xpbmUobGluZSkpO1xuICAgIH1cbiAgICB0aGlzLmhlYXJ0LnN0YXJzLmZvckVhY2goc3RhciA9PiB0aGlzLmdhbWUuc2NyZWVuLmRyYXdTdGFyKHN0YXIpKTtcblxuICAgIC8vIGRyYXcgaGludFxuICAgIHRoaXMuZ2FtZS5zY3JlZW4uZHJhd1RleHQodGhpcy5uZXh0VGV4dCk7XG5cbiAgICAvL2RyYXcgbWVzc2FnZVxuICAgIHRoaXMubWVzc2FnZXNBcnIuZm9yRWFjaCh0ZXh0ID0+IHtcbiAgICAgIGlmKHRleHQuaXNTaG93KSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zY3JlZW4uZHJhd1RleHQodGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUodGltZTogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pc0RyYXdUZXh0KSB7XG4gICAgICB0aGlzLmNvbnN0ZWxsYXRpb24ubGluZXMuZm9yRWFjaChsaW5lID0+IGxpbmUudXBkYXRlKCkpO1xuICAgIH1cbiAgICBpZih0aGlzLmlzRHJhd0hlYXJ0KSB7XG4gICAgICB0aGlzLmhlYXJ0LmxpbmVzLmZvckVhY2gobGluZSA9PiBsaW5lLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGV4dFxuICAgIHRoaXMubWVzc2FnZXNBcnIuZm9yRWFjaCh0ZXh0ID0+IHtcbiAgICAgIGlmKHRleHQuaXNTaG93KXtcbiAgICAgICAgdGV4dC51cGRhdGUodGltZSlcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc3RhcnMgPSB0aGlzLmNyZWF0ZVN0YXJzKDIwMCk7XG4gICAgdGhpcy5jb25zdGVsbGF0aW9uID0gdGhpcy5wYXJzZUNvbnN0ZWxsYXRpb24oY29uc3RlbGxhdGlvblswXSk7XG4gICAgdGhpcy5oZWFydCA9IHRoaXMucGFyc2VDb25zdGVsbGF0aW9uKGhlYXJ0WzBdKTtcbiAgICB0aGlzLm5leHRUZXh0ID0gbmV3IFRleHQoe1xuICAgICAgeDogMTAsXG4gICAgICB5OiB0aGlzLmdhbWUuc2NyZWVuLmhlaWdodCAtIDEwLFxuICAgICAgdGV4dDogJ1ByZXNzIHNwYWNlIHRvIGNvbnRpbnVlJyxcbiAgICAgIGNvbG9yOiAncmdiYSgxNDEsMTkyLDI1NSwuNiknLFxuICAgICAgYmFja2dyb3VuZDoge1xuICAgICAgICBwYWRkaW5nOiAxMFxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMubWVzc2FnZXNBcnIgPSB0aGlzLm1lc3NhZ2VzLm1hcCgodGV4dDogc3RyaW5nLCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHRleHRJdGVtOiBTdGFyVGV4dCA9IG5ldyBUZXh0KHtcbiAgICAgICAgeDogMTAsXG4gICAgICAgIHk6IGkgKiA0MCArIDEwLFxuICAgICAgICB0ZXh0LFxuICAgICAgICB0ZXh0QmFzZWxpbmU6IFwidG9wXCIsXG4gICAgICAgIGFuaW1hdGU6IDUwLFxuICAgICAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICAgICAgcGFkZGluZzogMTBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0ZXh0SXRlbS5pc1Nob3cgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0ZXh0SXRlbTtcbiAgICB9KTtcblxuICAgIHRoaXMuaXNEcmF3SGVhcnQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRHJhd1RleHQgPSBmYWxzZTtcbiAgICB0aGlzLmFuaW1hdGlvblN0ZXAgPSAxO1xuICAgIHRoaXMuc2V0U2hvd0ZsYWcodGhpcy5tZXNzYWdlc0FyciwgdGhpcy5hbmltYXRpb25TdGVwKTtcbiAgICB0aGlzLnNob3dTdGFyKHRoaXMuc3RhcnMpO1xuICB9XG5cbiAgb25FdmVudCgpOiBib29sZWFuIHtcbiAgICBsZXQgaXNOZXh0U2NlbmUgPSBmYWxzZTtcblxuICAgIGlmKHRoaXMuYW5pbWF0aW9uU3RlcCA9PT0gdGhpcy5tZXNzYWdlcy5sZW5ndGggKyAxKSB7XG4gICAgICBpc05leHRTY2VuZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYodGhpcy5hbmltYXRpb25TdGVwIDwgdGhpcy5tZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuYW5pbWF0aW9uU3RlcCsrO1xuICAgICAgdGhpcy5zZXRTaG93RmxhZyh0aGlzLm1lc3NhZ2VzQXJyLCB0aGlzLmFuaW1hdGlvblN0ZXApO1xuICAgIH1cbiAgICBpZih0aGlzLmFuaW1hdGlvblN0ZXAgPT09IHRoaXMubWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmFuaW1hdGlvblN0ZXArKztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzRHJhd0hlYXJ0ID0gdHJ1ZTtcbiAgICAgIH0sIDIwMDApO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNEcmF3VGV4dCA9IHRydWU7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNOZXh0U2NlbmU7XG4gIH1cblxuICBwcml2YXRlIHNldFNob3dGbGFnKGFycjogU3RhclRleHRbXSwgaW5kZXg6IG51bWJlcikge1xuICAgIChuZXcgQXJyYXkoaW5kZXgpLmZpbGwoJycpKS5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICBhcnJbaV0uaXNTaG93ID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3RhcnMoYW1vdW50OiBudW1iZXIpOiBIaWRkZW5TdGFyW10ge1xuICAgIGNvbnN0IHN0YXJzOiBIaWRkZW5TdGFyW10gPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwLCB4ID0gYW1vdW50OyBpIDwgeDsgaSsrKSB7XG4gICAgICBjb25zdCBzdGFyOiBIaWRkZW5TdGFyID0gbmV3IFN0YXIoe1xuICAgICAgICBpZDogaSxcbiAgICAgICAgcmFkaXVzOiBnZXRSYW5kb21JbnQoNSwgMTApLFxuICAgICAgICB4OiBnZXRSYW5kb21JbnQoMTAsIHRoaXMuZ2FtZS5zY3JlZW4ud2lkdGgpLFxuICAgICAgICB5OiBnZXRSYW5kb21JbnQoMTAsIHRoaXMuZ2FtZS5zY3JlZW4uaGVpZ2h0KSxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUl0ZW0oc3RhckNvbG9ycyksXG4gICAgICB9KTtcbiAgICAgIHN0YXIuaXNTaG93ID0gZmFsc2U7XG4gICAgICBzdGFycy5wdXNoKHN0YXIpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhcnM7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQ29uc3RlbGxhdGlvbihjb25zdGVsbGF0aW9uOiBhbnkpOiB7c3RhcnM6IFN0YXJbXSwgbGluZXM6IExpbmVbXX0ge1xuICAgIGNvbnN0IGxpbmVzOiBMaW5lW10gPSBbXTtcbiAgICBjb25zdCBzdGFyczogU3RhcltdID0gW107XG5cbiAgICBjb25zdGVsbGF0aW9uLnN0YXJzLmZvckVhY2goKHN0YXI6IGFueSkgPT4ge1xuICAgICAgaWYoc3Rhci5jb25uZWN0ICYmIHN0YXIuY29ubmVjdC5sZW5ndGgpIHtcbiAgICAgICAgc3Rhci5jb25uZWN0LmZvckVhY2goKGNvbm5lY3RJZDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgdG9TdGFyID0gY29uc3RlbGxhdGlvbi5zdGFycy5maW5kKChzdGFyOiBhbnkpID0+IHN0YXIuaWQgPT09IGNvbm5lY3RJZCk7XG4gICAgICAgICAgbGluZXMucHVzaChuZXcgTGluZSh7ZnJvbTogc3Rhci5jb29yZGluYXRlcywgdG86IHRvU3Rhci5jb29yZGluYXRlcywgYW5pbWF0ZTogMTIwfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5ld1N0YXIgPSBuZXcgU3Rhcih7XG4gICAgICAgIHg6IHN0YXIuY29vcmRpbmF0ZXNbMF0sXG4gICAgICAgIHk6IHN0YXIuY29vcmRpbmF0ZXNbMV0sXG4gICAgICAgIHJhZGl1czogOCxcbiAgICAgIH0pO1xuICAgICAgc3RhcnMucHVzaChuZXdTdGFyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7c3RhcnMsIGxpbmVzfTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd1N0YXIoc3RhcnM6IEhpZGRlblN0YXJbXSkge1xuICAgIGxldCBtYXggPSBzdGFycy5sZW5ndGggLSAxO1xuICAgIHNob3coMCk7XG4gICAgZnVuY3Rpb24gc2hvdyhpbmRleDogbnVtYmVyKSB7XG4gICAgICBpZihpbmRleCA8PSBtYXgpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgc3RhcnNbaW5kZXhdLmlzU2hvdyA9IHRydWU7XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICBzaG93KGluZGV4KTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59IiwiaW1wb3J0IHtHYW1lLCBTY2VuZX0gZnJvbSBcIi4uLy4uL21vZGVsc1wiO1xuaW1wb3J0IHtTQ0VORSwgc3RhckNvbG9yc30gZnJvbSBcIi4uLy4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHtTdGFyLCBUZXh0fSBmcm9tIFwiLi4vLi4vb2JqZWN0c1wiO1xuaW1wb3J0IHtnZXRSYW5kb21JbnQsIGdldFJhbmRvbUl0ZW19IGZyb20gXCIuLi8uLi9oZWxwZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXh0U2NlbmUgaW1wbGVtZW50cyBTY2VuZXtcbiAgdHlwZSA9IFNDRU5FLlRFWFRcbiAgdGV4dDogVGV4dFtdID0gW107XG4gIHRleHRSb3dzOiBzdHJpbmdbXSA9IFtcbiAgICAnXCLQldGB0LvQuCDQktGB0LXQu9C10L3QvdCw0Y8g0LHQtdGB0LrQvtC90LXRh9C90LAg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L5cIiDCqU5vaXplTWMnLFxuICAgICfQktGB0LXQu9C10L3QvdCw0Y8g0LHQtdGB0LrQvtC90LXRh9C90LDRjy4g0JfQstGR0LfQtCDQvdC1INGB0YfQtdGB0YLRjC4g0JfQstGR0LfQtNGLLCDQv9C70LDQvdC10YLRiywg0LPQsNC70LDQutGC0LjQutC4LicsXG4gICAgJ9Cf0YDQtdC00YHRgtCw0LLQuNC8LCDRh9GC0L4g0JfQtdC80LvRjyAtINGN0YLQviDQvdCw0YjQsCDQstGB0LXQu9C10L3QvdCw0Y8sINCwINC30LLRkdC30LTRiyAtINGN0YLQviDQu9GO0LTQuC4nLFxuICAgICfQmtCw0LbQtNGL0Lkg0YHQuNGP0LXRgiDQv9C+LdGB0LLQvtC10LzRgywg0L3QsNGH0LjQvdCw0Y8g0YEg0LrQsNGA0LvQuNC60L7QsiDQuCDQt9Cw0LrQsNC90YfQuNCy0LDRjyDQs9C40LPQsNC90YLQsNC80LguJyxcbiAgICAn0JrQsNC20LTRi9C5INGD0L3QuNC60LDQu9C10L0uINCjINC60LDQttC00L7Qs9C+INGB0LLQvtGPINC40YHRgtC+0YDQuNGPLiDQmCDQutCw0LbQtNGL0Lkg0LrQvtCz0LTQsC3RgtC+INCy0YHQv9GL0YXQvdGD0Lsg0Lgg0LrQvtCz0LTQsC3RgtC+INC/0L7Qs9Cw0YHQvdC10YIuJyxcbiAgICAn0KHRgNC10LTQuCDRjdGC0LjRhSDQt9Cy0ZHQt9C0LCDRjyDQvdCw0YjRkdC7INGG0LXQu9C+0LUg0YHQvtC30LLQtdC30LTQuNC1LicsXG4gICAgJ9Ch0YLQvtC40YIg0YLQvtC70YzQutC+INC/0YDQuNGB0LzQvtGC0YDQtdGC0YzRgdGPINC4INC80L7QttC90L4g0YPQstC40LTQtdGC0Ywg0YLQtSDQt9Cy0ZHQt9C00L7Rh9C60LgsINC60L7RgtC+0YDRi9C1INC80LXQvdGPINCy0LTQvtGF0L3QvtCy0LvRj9GO0YIuJyxcbiAgICAn0KLQviDRgdC+0LfQstC10LfQtNC40LUsINGA0LDQtNC4INC60L7RgtC+0YDQvtC5INCz0L7RgtC+0LIg0L3QtSDQstGB0ZEuJyxcbiAgXTtcbiAgbmV4dFRleHQhOiBUZXh0O1xuICBzdGFyczogU3RhcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBnYW1lOiBHYW1lXG4gICkge1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcmVuZGVyKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc3RhcnMuZm9yRWFjaChzdGFyID0+IHRoaXMuZ2FtZS5zY3JlZW4uZHJhd1N0YXIoc3RhcikpO1xuICAgIHRoaXMudGV4dC5mb3JFYWNoKHRleHQgPT4gdGhpcy5nYW1lLnNjcmVlbi5kcmF3VGV4dCh0ZXh0KSk7XG4gICAgLy8gZHJhdyBoaW50XG4gICAgdGhpcy5nYW1lLnNjcmVlbi5kcmF3VGV4dCh0aGlzLm5leHRUZXh0KTtcbiAgfVxuXG4gIHVwZGF0ZSh0aW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnRleHQuZm9yRWFjaCh0ZXh0ID0+IHRleHQudXBkYXRlKHRpbWUpKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0Um93cy5tYXAoKHRleHQ6IHN0cmluZywgaTogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFRleHQoe1xuICAgICAgICB4OiAyMCxcbiAgICAgICAgeTogaSAqIDUwICsgMjAsXG4gICAgICAgIHNpemU6IDMwLFxuICAgICAgICBhbmltYXRlOiBnZXRSYW5kb21JbnQoMSwgNCkgKiAxMCxcbiAgICAgICAgdGV4dEJhc2VsaW5lOiBcInRvcFwiLFxuICAgICAgICB0ZXh0LFxuICAgICAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICAgICAgY29sb3I6ICcjMDAwJyxcbiAgICAgICAgICBwYWRkaW5nOiAxMFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pO1xuICAgIHRoaXMubmV4dFRleHQgPSBuZXcgVGV4dCh7XG4gICAgICB4OiAxMCxcbiAgICAgIHk6IHRoaXMuZ2FtZS5zY3JlZW4uaGVpZ2h0IC0gMTAsXG4gICAgICB0ZXh0OiAnUHJlc3Mgc3BhY2UgdG8gY29udGludWUnLFxuICAgICAgY29sb3I6ICdyZ2JhKDE0MSwxOTIsMjU1LC42KScsXG4gICAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICAgIHBhZGRpbmc6IDEwXG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5zdGFycyA9IHRoaXMuY3JlYXRlU3RhcnMoMjAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3RhcnMoYW1vdW50OiBudW1iZXIpOiBTdGFyW10ge1xuICAgIGNvbnN0IHN0YXJzOiBTdGFyW10gPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwLCB4ID0gYW1vdW50OyBpIDwgeDsgaSsrKSB7XG4gICAgICBzdGFycy5wdXNoKG5ldyBTdGFyKHtcbiAgICAgICAgaWQ6IGksXG4gICAgICAgIHJhZGl1czogZ2V0UmFuZG9tSW50KDUsIDEwKSxcbiAgICAgICAgeDogZ2V0UmFuZG9tSW50KDEwLCB0aGlzLmdhbWUuc2NyZWVuLndpZHRoKSxcbiAgICAgICAgeTogZ2V0UmFuZG9tSW50KDEwLCB0aGlzLmdhbWUuc2NyZWVuLmhlaWdodCksXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21JdGVtKHN0YXJDb2xvcnMpLFxuICAgICAgfSkpXG4gICAgfVxuICAgIHJldHVybiBzdGFycztcbiAgfVxufSIsImltcG9ydCB7R2FtZSwgU2NlbmV9IGZyb20gJy4uLy4uL21vZGVscyc7XG5pbXBvcnQge1NDRU5FfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHtUZXh0fSBmcm9tICcuLi8uLi9vYmplY3RzJztcblxuZXhwb3J0IGNsYXNzIFdlbGNvbWVTY2VuZSBpbXBsZW1lbnRzIFNjZW5lIHtcbiAgdHlwZSA9IFNDRU5FLldFTENPTUVcbiAgd2VsY29tZVRleHQhOiBUZXh0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZ2FtZTogR2FtZVxuICApIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHJlbmRlcih0aW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdhbWUuc2NyZWVuLmRyYXdUZXh0KHRoaXMud2VsY29tZVRleHQpO1xuICB9XG5cbiAgdXBkYXRlKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMud2VsY29tZVRleHQudXBkYXRlKHRpbWUpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLndlbGNvbWVUZXh0ID0gbmV3IFRleHQoe1xuICAgICAgdGV4dDogJ1BSRVNTIFNQQUNFIFRPIFNUQVJUJyxcbiAgICAgIGNvbG9yOiAnIzdmZGRmZicsXG4gICAgICBzaXplOiA1MCxcbiAgICAgIHg6IDEwLFxuICAgICAgeTogMTAsXG4gICAgICB0ZXh0QmFzZWxpbmU6ICd0b3AnLFxuICAgICAgYW5pbWF0ZTogNTBcbiAgICB9KTtcbiAgfVxufSIsImV4cG9ydCAqIGZyb20gJy4vc2NyZWVuJzsiLCJpbXBvcnQge1RleHR9IGZyb20gJy4uL29iamVjdHMvdGV4dCc7XG5pbXBvcnQge1N0YXIsIExpbmV9IGZyb20gXCIuLi9vYmplY3RzXCI7XG5cbmV4cG9ydCBjbGFzcyBTY3JlZW4ge1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcbiAgKSB7XG4gICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgdGhpcy53aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gIH1cblxuICBjbGVhclNjcmVlbigpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG5cbiAgZHJhd1RleHQodGV4dE9iajogVGV4dCkge1xuICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5mb250ID0gYCR7dGV4dE9iai5zaXplfXB4IHNhbnMtc2VyaWZgO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRleHRPYmouY29sb3I7XG4gICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gdGV4dE9iai50ZXh0QmFzZWxpbmU7XG4gICAgdGhpcy5jdHgudGV4dEFsaWduID0gdGV4dE9iai50ZXh0QWxpZ247XG5cbiAgICAvLyBkcmF3IGJhY2tncm91bmRcbiAgICBpZih0ZXh0T2JqLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGV4dE9iai5iYWNrZ3JvdW5kLmNvbG9yO1xuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoXG4gICAgICAgIHRleHRPYmoueCAtIHRleHRPYmouYmFja2dyb3VuZC5wYWRkaW5nLFxuICAgICAgICB0ZXh0T2JqLnRleHRCYXNlbGluZSA9PT0gJ3RvcCcgPyB0ZXh0T2JqLnkgLSB0ZXh0T2JqLmJhY2tncm91bmQucGFkZGluZyA6IHRleHRPYmoueSAtIHRleHRPYmouc2l6ZSAtIHRleHRPYmouYmFja2dyb3VuZC5wYWRkaW5nLFxuICAgICAgICB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZXh0T2JqLnRleHQpLndpZHRoICsgdGV4dE9iai5iYWNrZ3JvdW5kLnBhZGRpbmcgKiAyLFxuICAgICAgICB0ZXh0T2JqLnNpemUgKyB0ZXh0T2JqLmJhY2tncm91bmQucGFkZGluZyAqIDJcbiAgICAgICk7XG4gICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmN0eC5maWxsVGV4dCh0ZXh0T2JqLnRleHQsIHRleHRPYmoueCwgdGV4dE9iai55KTtcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBkcmF3U3RhcihzdGFyOiBTdGFyKSB7XG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHN0YXIuY29sb3I7XG4gICAgdGhpcy5jdHguYXJjKHN0YXIueCwgc3Rhci55LCBzdGFyLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBkcmF3TGluZShsaW5lOiBMaW5lKSB7XG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gbGluZS5jb2xvcjtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lLndpZHRoO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyhsaW5lLmZyb21bMF0sIGxpbmUuZnJvbVsxXSk7XG4gICAgdGhpcy5jdHgubGluZVRvKGxpbmUudG9bMF0sIGxpbmUudG9bMV0pO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gIH1cbn0iLCJpbXBvcnQgQXBwIGZyb20gJy4vYXBwL2FwcCc7XG5cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbmlmKGNhbnZhcykge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKGNhbnZhcyk7XG4gIGFwcC5ydW4oKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==