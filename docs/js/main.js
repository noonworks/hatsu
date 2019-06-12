(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImageBack_1 = require("./Back/ImageBack");
var Theater_1 = require("./Theater");
var Options_1 = require("./Options");
var HatsuImage_1 = require("./Hatsu/HatsuImage");
var Builder_1 = require("./Hatsu/Builder");
var VideoBack_1 = require("./Back/VideoBack");
var DEFAULT_HATSU = './img/hatsu.png';
var DEFAULT_BACK = './img/sample_back.png';
var App = /** @class */ (function () {
    function App() {
        this.mr = null;
        this.options = new Options_1.Options();
        this.theater = new Theater_1.Theater('main_canvas', this.options);
        var result = document.getElementById('result_area');
        if (result !== null) {
            result.append(this.theater.canvas);
        }
    }
    App.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.setHatsu(this.options.options.hatsu);
                this.setBack(this.options.options.back);
                return [2 /*return*/];
            });
        });
    };
    App.prototype.start = function (stopAtEnd) {
        if (stopAtEnd === void 0) { stopAtEnd = false; }
        this.theater.start(stopAtEnd);
    };
    App.prototype.stop = function () {
        this.theater.stop();
        if (this.mr) {
            this.mr.stop();
            this.mr = null;
        }
    };
    App.prototype.record = function (ondataavailable, mime) {
        var _this = this;
        if (this.mr) {
            return;
        }
        this.stop();
        // media stream
        var ms = new MediaStream();
        ms.addTrack(this.theater.canvas.captureStream().getTracks()[0]);
        // audio
        var vid = null;
        for (var i = 0; i < this.theater.backs.length; i++) {
            if (this.theater.backs[i] instanceof VideoBack_1.VideoBack) {
                vid = this.theater.backs[i].videoElement;
            }
        }
        if (vid) {
            var audioContext = new AudioContext();
            var streamDestination = audioContext.createMediaStreamDestination();
            audioContext.createMediaElementSource(vid).connect(streamDestination);
            ms.addTrack(streamDestination.stream.getAudioTracks()[0]);
        }
        // media recorder
        this.mr = new MediaRecorder(ms, { mimeType: mime });
        this.mr.ondataavailable = ondataavailable;
        this.theater.onend = function () {
            if (_this.mr) {
                _this.mr.stop();
            }
        };
        // start
        this.mr.start();
        this.start(true);
    };
    App.prototype.onChangeOptionInputs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var diff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        diff = this.options.diff();
                        if (Object.keys(diff).length === 0) {
                            return [2 /*return*/];
                        }
                        this.theater.pause();
                        if (diff.size) {
                            this.theater.setCanvasSize(diff.size);
                        }
                        if (!diff.hatsu) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setHatsu(diff.hatsu)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!diff.back) return [3 /*break*/, 4];
                        if (diff.back.type === 'video') {
                            this.stop();
                        }
                        return [4 /*yield*/, this.setBack(diff.back)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.theater.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.setHatsu = function (opt) {
        return __awaiter(this, void 0, void 0, function () {
            var h, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        h = new HatsuImage_1.HatsuImage();
                        _a = opt.type;
                        switch (_a) {
                            case 'file': return [3 /*break*/, 1];
                            case 'default': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        if (!opt.file) return [3 /*break*/, 3];
                        return [4 /*yield*/, h.loadFile(opt.file)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, h.load(DEFAULT_HATSU)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        this.theater.clearHatsu();
                        Builder_1.addAllHatsus(this.theater, h);
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.setBack = function (opt) {
        return __awaiter(this, void 0, void 0, function () {
            var ib, vb, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ib = new ImageBack_1.ImageBack();
                        vb = new VideoBack_1.VideoBack();
                        _a = opt.type;
                        switch (_a) {
                            case 'image': return [3 /*break*/, 1];
                            case 'video': return [3 /*break*/, 5];
                            case 'default': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        if (!opt.file) return [3 /*break*/, 3];
                        return [4 /*yield*/, ib.loadFile(opt.file)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        if (!opt.file) return [3 /*break*/, 7];
                        return [4 /*yield*/, vb.loadFile(opt.file)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: return [2 /*return*/];
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, ib.load(DEFAULT_BACK)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        this.theater.clearBack();
                        if (opt.type === 'video') {
                            this.theater.addBack(vb);
                        }
                        else {
                            this.theater.addBack(ib);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
exports.default = App;

},{"./Back/ImageBack":2,"./Back/VideoBack":3,"./Hatsu/Builder":5,"./Hatsu/HatsuImage":7,"./Options":18,"./Theater":19}],2:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Crop_1 = require("../Crop");
var ImageBack = /** @class */ (function () {
    function ImageBack() {
        this.img = new Image();
        this._ready = false;
        this.cropInfo = __assign({}, Crop_1.CROP_INFO_DEFAULT);
    }
    ImageBack.prototype.start = function () { };
    ImageBack.prototype.pause = function () { };
    ImageBack.prototype.stop = function () { };
    Object.defineProperty(ImageBack.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageBack.prototype, "length", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    ImageBack.prototype.load = function (src) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.img.onload = function () {
                _this._ready = true;
                _this.cropInfo = Crop_1.calculateCropSize(_this.img.width, _this.img.height);
                resolve(_this.img);
            };
            _this.img.onerror = function (e) { return reject(e); };
            _this.img.src = src + '?' + (new Date()).getTime();
        });
    };
    ImageBack.prototype.loadFile = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.img.onload = function () {
                _this._ready = true;
                _this.cropInfo = Crop_1.calculateCropSize(_this.img.width, _this.img.height);
                resolve(_this.img);
            };
            _this.img.onerror = function (e) { return reject(e); };
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                if (e.target) {
                    _this.img.src = e.target.result;
                }
            };
            fileReader.onerror = function (e) { return reject(e); };
            fileReader.readAsDataURL(file);
        });
    };
    ImageBack.prototype.draw = function (theater) {
        theater.context.fillRect(0, 0, theater.width16, theater.height);
        if (!this.ready) {
            return;
        }
        var x = this.cropInfo.hasSideBar ? theater.widthBar : 0;
        var w = this.cropInfo.hasSideBar ? theater.width4 : theater.width16;
        theater.context.drawImage(this.img, this.cropInfo.x, this.cropInfo.y, this.cropInfo.w, this.cropInfo.h, x, 0, w, theater.height);
    };
    return ImageBack;
}());
exports.ImageBack = ImageBack;

},{"../Crop":4}],3:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Crop_1 = require("../Crop");
var VideoBack = /** @class */ (function () {
    function VideoBack() {
        this._ready = false;
        this.cropInfo = __assign({}, Crop_1.CROP_INFO_DEFAULT);
        this.video = document.createElement('video');
    }
    Object.defineProperty(VideoBack.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoBack.prototype, "length", {
        get: function () {
            if (this._ready) {
                return this.video.duration * 1000;
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VideoBack.prototype, "videoElement", {
        get: function () {
            return this.video;
        },
        enumerable: true,
        configurable: true
    });
    VideoBack.prototype.start = function () {
        this.video.play();
    };
    VideoBack.prototype.pause = function () {
        this.video.pause();
    };
    VideoBack.prototype.stop = function () {
        this.video.pause();
        this.video.currentTime = 0;
    };
    VideoBack.prototype.loadFile = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.video.onloadeddata = function () {
                _this._ready = true;
                _this.cropInfo = Crop_1.calculateCropSize(_this.video.videoWidth, _this.video.videoHeight);
                resolve(_this.video);
            };
            _this.video.onerror = function (e) { return reject(e); };
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                if (e.target) {
                    _this.video.src = e.target.result;
                }
            };
            fileReader.onerror = function (e) { return reject(e); };
            fileReader.readAsDataURL(file);
        });
    };
    VideoBack.prototype.draw = function (theater) {
        theater.context.fillRect(0, 0, theater.width16, theater.height);
        if (!this.ready) {
            return;
        }
        var x = this.cropInfo.hasSideBar ? theater.widthBar : 0;
        var w = this.cropInfo.hasSideBar ? theater.width4 : theater.width16;
        theater.context.drawImage(this.video, this.cropInfo.x, this.cropInfo.y, this.cropInfo.w, this.cropInfo.h, x, 0, w, theater.height);
    };
    return VideoBack;
}());
exports.VideoBack = VideoBack;

},{"../Crop":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CROP_INFO_DEFAULT = {
    hasSideBar: false,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};
var H_P_W_16_9 = 9 / 16;
var H_P_W_4_3 = 3 / 4;
function calculateCropSize(width, height) {
    var hPw = height / width;
    // crop 16 : 9 with max-height
    if (hPw < H_P_W_16_9) {
        var w = Math.floor(height * 16 / 9);
        return {
            hasSideBar: false,
            x: Math.floor((width - w) / 2),
            y: 0,
            w: w,
            h: height,
        };
    }
    // crop 4 : 3 with max-height
    if (hPw < H_P_W_4_3) {
        var w = Math.floor(height * 4 / 3);
        return {
            hasSideBar: true,
            x: Math.floor((width - w) / 2),
            y: 0,
            w: w,
            h: height,
        };
    }
    // crop 4 : 3 with max-width
    var h = Math.floor(width * 3 / 4);
    return {
        hasSideBar: true,
        x: 0,
        y: Math.floor((height - h) / 2),
        w: width,
        h: h,
    };
}
exports.calculateCropSize = calculateCropSize;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var A_1 = require("./sprites/A");
var B_1 = require("./sprites/B");
var C_1 = require("./sprites/C");
var D_1 = require("./sprites/D");
var E_1 = require("./sprites/E");
var F_1 = require("./sprites/F");
var G_1 = require("./sprites/G");
var H_1 = require("./sprites/H");
var I_1 = require("./sprites/I");
var J_1 = require("./sprites/J");
function addAllHatsus(theater, img) {
    [A_1.A, B_1.B, D_1.D, C_1.C, E_1.E, F_1.F, G_1.G, H_1.H, I_1.I, J_1.J].forEach(function (klass) {
        theater.addHatsu(new klass({ img: img }));
    });
}
exports.addAllHatsus = addAllHatsus;

},{"./sprites/A":8,"./sprites/B":9,"./sprites/C":10,"./sprites/D":11,"./sprites/E":12,"./sprites/F":13,"./sprites/G":14,"./sprites/H":15,"./sprites/I":16,"./sprites/J":17}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_ALPHA = 0.82;
exports.TO_RADIAN = Math.PI / 180;
var WHOLE_MSEC = 56270 + 1000; // J_END + 1000
var HatsuBase = /** @class */ (function () {
    function HatsuBase(opt) {
        this.img = opt.img;
    }
    HatsuBase.prototype.modular = function (msec) {
        return msec % WHOLE_MSEC;
    };
    HatsuBase.prototype.getHatsuSize = function (theater) {
        var dh = theater.width16 / 4;
        var dw = Math.floor(this.img.width * dh / this.img.height);
        return { dw: dw, dh: dh };
    };
    HatsuBase.prototype.liner = function (vStart, vEnd, length, msec) {
        return (vEnd - vStart) * msec / length + vStart;
    };
    HatsuBase.prototype.easeInOutCubicPercent = function (msec, length) {
        var t = msec / (length / 2);
        if (t < 1) {
            return 1.0 / 2.0 * t * t * t;
        }
        var t2 = t - 2;
        return 1.0 / 2.0 * (t2 * t2 * t2 + 2);
    };
    return HatsuBase;
}());
exports.HatsuBase = HatsuBase;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuImage = /** @class */ (function () {
    function HatsuImage() {
        this._img = new Image();
        this._ready = false;
    }
    Object.defineProperty(HatsuImage.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HatsuImage.prototype, "width", {
        get: function () {
            return this._img.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HatsuImage.prototype, "height", {
        get: function () {
            return this._img.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HatsuImage.prototype, "img", {
        get: function () {
            return this._img;
        },
        enumerable: true,
        configurable: true
    });
    HatsuImage.prototype.load = function (src) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._img.onload = function () {
                _this._ready = true;
                resolve(_this._img);
            };
            _this._img.onerror = function (e) { return reject(e); };
            _this._img.src = src + '?' + (new Date()).getTime();
        });
    };
    HatsuImage.prototype.loadFile = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._img.onload = function () {
                _this._ready = true;
                resolve(_this._img);
            };
            _this._img.onerror = function (e) { return reject(e); };
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                if (e.target) {
                    _this._img.src = e.target.result;
                }
            };
            fileReader.onerror = function (e) { return reject(e); };
            fileReader.readAsDataURL(file);
        });
    };
    return HatsuImage;
}());
exports.HatsuImage = HatsuImage;

},{}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.A_START = 660;
exports.A_END = 5130;
var A_LENGTH = exports.A_END - exports.A_START;
var A = /** @class */ (function (_super) {
    __extends(A, _super);
    function A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(A.prototype, "end", {
        get: function () {
            return exports.A_END;
        },
        enumerable: true,
        configurable: true
    });
    A.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.A_START;
        if (msec < 0 || msec > A_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 始点 S
        var Sx = theater.widthBar - dw;
        var Sy = Math.floor(theater.width16 / 20);
        // 終点 E
        var Ex = theater.widthBar + theater.width4;
        var Ey = theater.height - Sy - dh;
        // 座標
        var x = this.liner(Sx, Ex, A_LENGTH, msec);
        if (x > Ex || x < Sx) {
            return;
        }
        var y = this.liner(Sy, Ey, A_LENGTH, msec);
        if (y > Ey || y < Sy) {
            return;
        }
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw, dh);
        theater.context.globalAlpha = 1.0;
    };
    return A;
}(HatsuBase_1.HatsuBase));
exports.A = A;

},{"../HatsuBase":6}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.B_START = 3440;
exports.B_END = 9320;
var B_LENGTH = exports.B_END - exports.B_START;
var B = /** @class */ (function (_super) {
    __extends(B, _super);
    function B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(B.prototype, "end", {
        get: function () {
            return exports.B_END;
        },
        enumerable: true,
        configurable: true
    });
    B.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.B_START;
        if (msec < 0 || msec > B_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 頂点 P
        var Px = theater.width16;
        var Py = dh * -1.1;
        // (0, theater.height) を通る y = a(x - Px)^2 + Py
        var a = (theater.height - Py) / (Px * Px);
        // 始点 Q
        var Qy = -1 * dh;
        var b = Math.sqrt((Qy - Py) / a);
        var Qx = Math.min(b + Px, b * -1 + Px);
        // 拡大率
        var z = this.liner(1.0, 2.5, B_LENGTH, msec);
        // 座標
        var x = this.liner(Qx, 0, B_LENGTH, msec);
        if (x > theater.width4 + theater.widthBar || x < dw * z * -1) {
            return;
        }
        var y = a * (x - Px) * (x - Px) + Py;
        if (y > theater.height || y < dh * z * -1) {
            return;
        }
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * z, dh * z);
        theater.context.globalAlpha = 1.0;
    };
    return B;
}(HatsuBase_1.HatsuBase));
exports.B = B;

},{"../HatsuBase":6}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.C_START = 7750;
exports.C_END = 11870;
var C_LENGTH = exports.C_END - exports.C_START;
var C = /** @class */ (function (_super) {
    __extends(C, _super);
    function C() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(C.prototype, "end", {
        get: function () {
            return exports.C_END;
        },
        enumerable: true,
        configurable: true
    });
    C.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.C_START;
        if (msec < 0 || msec > C_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 始点 S
        var Sx = theater.widthBar + theater.width4;
        var Sy = theater.height - dh;
        // 終点 E
        var Ex = theater.widthBar - dw;
        var Ey = 0;
        // 座標
        var x = this.liner(Sx, Ex, C_LENGTH, msec);
        if (x > Sx || x < Ex) {
            return;
        }
        var y = this.liner(Sy, Ey, C_LENGTH, msec);
        if (y > Sy || y < Ey) {
            return;
        }
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw, dh);
        theater.context.globalAlpha = 1.0;
    };
    return C;
}(HatsuBase_1.HatsuBase));
exports.C = C;

},{"../HatsuBase":6}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.D_START = 10360;
exports.D_END = 15480;
var D_LENGTH = exports.D_END - exports.D_START;
var D_MAX_ZOOM = 1.63;
var D = /** @class */ (function (_super) {
    __extends(D, _super);
    function D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(D.prototype, "end", {
        get: function () {
            return exports.D_END;
        },
        enumerable: true,
        configurable: true
    });
    D.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.D_START;
        if (msec < 0 || msec > D_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 頂点 P
        var Px = (theater.width16 - dw * D_MAX_ZOOM) / 2;
        var Py = dh * 0.1;
        // 点 Q
        var Qx = theater.width4 + theater.widthBar;
        var Qy = dh * 0.95;
        // 点Qを通る y = a(x - Px)^2 + Py
        var a = (Qy - Py) / ((Qx - Px) * (Qx - Px));
        // 始点と終点
        var Sx = dw * -1;
        var Ex = theater.width4 + theater.widthBar;
        // 拡大率
        var z;
        if (msec <= D_LENGTH / 2) {
            z = this.liner(1.1, D_MAX_ZOOM, D_LENGTH / 2, msec);
        }
        else {
            z = this.liner(D_MAX_ZOOM, 1.1, D_LENGTH / 2, msec - D_LENGTH / 2);
        }
        // 座標
        var x = this.liner(Sx, Ex, D_LENGTH, msec);
        if (x > Ex || x < Sx) {
            return;
        }
        var y = a * (x - Px) * (x - Px) + Py;
        if (y > theater.height || y < dh * z * -1) {
            return;
        }
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * z, dh * z);
        theater.context.globalAlpha = 1.0;
    };
    return D;
}(HatsuBase_1.HatsuBase));
exports.D = D;

},{"../HatsuBase":6}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.E_START = 14370;
exports.E_END = 18820;
var E_LENGTH = exports.E_END - exports.E_START;
var E_ZOOM_MIN = 0.15;
var E_ZOOM_MAX = 2.6;
var E = /** @class */ (function (_super) {
    __extends(E, _super);
    function E() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(E.prototype, "end", {
        get: function () {
            return exports.E_END;
        },
        enumerable: true,
        configurable: true
    });
    E.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.E_START;
        if (msec < 0 || msec > E_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // ※方程式は發の中心点の軌跡
        // 点 P
        var Px = theater.width16;
        var Py = dh * 2 / 3;
        // 点 Q (Qx = 0)
        var Qy = theater.height - dh / 2;
        // 2点を通る y = ax + b
        var b = Qy;
        var a = (Py - b) / Px;
        // 始点S
        var Sx = theater.width16 - dw * 1.75;
        // 終点E
        var Ex = theater.widthBar - dw * E_ZOOM_MAX / 2;
        // 拡大率
        var z = this.liner(E_ZOOM_MIN, E_ZOOM_MAX, E_LENGTH, msec);
        // 座標
        var x = this.liner(Sx, Ex, E_LENGTH, msec);
        if (x > Sx || x < Ex) {
            return;
        }
        var y = a * x + b;
        if (y > theater.height || y < dh * z * -1) {
            return;
        }
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x - dw * z / 2, y - dh * z / 2, dw * z, dh * z);
        theater.context.globalAlpha = 1.0;
    };
    return E;
}(HatsuBase_1.HatsuBase));
exports.E = E;

},{"../HatsuBase":6}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.F_START = 16780;
exports.F_END = 22570;
var F_LENGTH = exports.F_END - exports.F_START;
var F_ZOOM = 1.2;
var F = /** @class */ (function (_super) {
    __extends(F, _super);
    function F() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(F.prototype, "end", {
        get: function () {
            return exports.F_END;
        },
        enumerable: true,
        configurable: true
    });
    F.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.F_START;
        if (msec < 0 || msec > F_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 始点S
        var Sx = theater.width16 * 5 / 8;
        var Sy = theater.height;
        // 終点E
        var Ex = dw * F_ZOOM / 10;
        var Ey = dh * F_ZOOM * -1;
        // 座標
        var x = this.liner(Sx, Ex, F_LENGTH, msec);
        if (x > Sx || x < Ex) {
            return;
        }
        var y = this.liner(Sy, Ey, F_LENGTH, msec);
        if (y > Sy || y < Ey) {
            return;
        }
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * F_ZOOM, dh * F_ZOOM);
        theater.context.globalAlpha = 1.0;
    };
    return F;
}(HatsuBase_1.HatsuBase));
exports.F = F;

},{"../HatsuBase":6}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.G_START = 20120;
exports.G_END = 26240;
var G_LENGTH = exports.G_END - exports.G_START;
var G_ZOOM = 1.2;
var G = /** @class */ (function (_super) {
    __extends(G, _super);
    function G() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(G.prototype, "end", {
        get: function () {
            return exports.G_END;
        },
        enumerable: true,
        configurable: true
    });
    G.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.G_START;
        if (msec < 0 || msec > G_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // ※方程式は發の中心点の軌跡
        // 点P
        var Px = theater.width16;
        var Py = theater.height / 2;
        // 点Q (Qx = 0)
        var Qy = theater.height * 17 / 27;
        // 2点Qを通る y = ax + b
        var b = Qy;
        var a = (Py - b) / Px;
        // 始点S
        var Sx = theater.width4 + theater.widthBar + dw * G_ZOOM / 2;
        var Sy = a * Sx + b;
        // 終点E
        var Ex = theater.widthBar - dw * G_ZOOM / 2;
        var Ey = a * Ex + b;
        // 座標
        var x = this.liner(Sx, Ex, G_LENGTH, msec);
        if (x > Sx || x < Ex) {
            return;
        }
        var y = this.liner(Sy, Ey, G_LENGTH, msec);
        if (y > Ey || y < Sy) {
            return;
        }
        // 回転率
        var r = this.liner(0, -180, G_LENGTH, msec);
        // 描画
        theater.context.save();
        theater.context.translate(x, y);
        theater.context.rotate(r * HatsuBase_1.TO_RADIAN);
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, dw * G_ZOOM * -0.5, dh * G_ZOOM * -0.5, dw * G_ZOOM, dh * G_ZOOM);
        theater.context.globalAlpha = 1.0;
        theater.context.restore();
    };
    return G;
}(HatsuBase_1.HatsuBase));
exports.G = G;

},{"../HatsuBase":6}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.H_START = 23770;
exports.H_END = 28920;
var H_LENGTH = exports.H_END - exports.H_START;
var H_R_HORIZON = 27720;
var H_ZOOM = 1.2;
var H = /** @class */ (function (_super) {
    __extends(H, _super);
    function H() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(H.prototype, "end", {
        get: function () {
            return exports.H_END;
        },
        enumerable: true,
        configurable: true
    });
    H.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.H_START;
        if (msec < 0 || msec > H_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // ※方程式は發の中心点の軌跡
        // 始点S
        var Sx = dh * H_ZOOM / 2;
        var Sy = dh * H_ZOOM / 2 * -1;
        // 点P
        var Px = theater.width16;
        var Py = theater.height * 7 / 9;
        // 2点Qを通る y = ax + b
        // b = -ax + y
        var a = (Py - Sy) / (Px - Sx);
        var b = -1 * a * Px + Py;
        // 終点E
        var Ex = theater.width16 + dh * H_ZOOM / 2;
        var Ey = a * Ex + b;
        // 座標
        var x = this.liner(Sx, Ex, H_LENGTH, msec);
        if (x > Ex || x < Sx) {
            return;
        }
        var y = this.liner(Sy, Ey, H_LENGTH, msec);
        if (y > Ey || y < Sy) {
            return;
        }
        // 回転率の方程式 r = c * msec
        var c = 270 / (H_R_HORIZON - exports.H_START);
        var r = c * msec;
        // 描画
        theater.context.save();
        theater.context.translate(x, y);
        theater.context.rotate(r * HatsuBase_1.TO_RADIAN);
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, dw * H_ZOOM * -0.5, dh * H_ZOOM * -0.5, dw * H_ZOOM, dh * H_ZOOM);
        theater.context.globalAlpha = 1.0;
        theater.context.restore();
    };
    return H;
}(HatsuBase_1.HatsuBase));
exports.H = H;

},{"../HatsuBase":6}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.I_START = 27380;
exports.I_END = 33100;
var I_LENGTH = exports.I_END - exports.I_START;
var I_PATH = [14, 35.0, 0, 0, 13.2, -14.7, 28.8, -9.8, 16.7, 5.2, 20.2, 45.4, 21.7, 119.0];
var I_VIEWBOX_W = 127;
var I_ZOOM_MAX = 4.48;
var I_ZOOM_MIN = 0.05;
var I = /** @class */ (function (_super) {
    __extends(I, _super);
    function I() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pathes = {};
        return _this;
    }
    Object.defineProperty(I.prototype, "end", {
        get: function () {
            return exports.I_END;
        },
        enumerable: true,
        configurable: true
    });
    I.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.I_START;
        if (msec < 0 || msec > I_LENGTH) {
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 軌道パスから座標を取得
        if (!this.pathes.hasOwnProperty(theater.width16)) {
            var np = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var pathes = I_PATH.map(function (v, idx) {
                return '' + (v * theater.width16 / I_VIEWBOX_W) + ((idx % 2 === 0) ? ',' : ' ') + ((idx === 1) ? 'c ' : '');
            });
            np.setAttribute('d', 'm ' + pathes.join(''));
            this.pathes[theater.width16] = np;
        }
        var p = this.pathes[theater.width16];
        var pathLength = p.getTotalLength();
        var point = p.getPointAtLength(pathLength - msec * pathLength / I_LENGTH);
        // 拡大率
        var ep = this.easeInOutCubicPercent(msec, I_LENGTH);
        var z = I_ZOOM_MAX - (I_ZOOM_MAX - I_ZOOM_MIN) * ep;
        // 描画
        theater.context.globalAlpha = HatsuBase_1.BASE_ALPHA;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, point.x - (dw * z / 2), point.y - (dh * z / 2), dw * z, dh * z);
        theater.context.globalAlpha = 1.0;
    };
    return I;
}(HatsuBase_1.HatsuBase));
exports.I = I;

},{"../HatsuBase":6}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HatsuBase_1 = require("../HatsuBase");
exports.J_START = 37580;
exports.J_END = 56270;
var J_LENGTH = exports.J_END - exports.J_START;
var J_ZOOM_MIN = 0.05;
var J_ZOOM_END = 44370;
var J_ZOOM_MAX = 1.26;
var J_ALPHA_MIN = 0.1;
var J_ALPHA_IN_END = 38450;
var J_ALPHA_OUT_START = 55540;
var J_ROTATE_PATH = document.createElementNS('http://www.w3.org/2000/svg', 'path');
J_ROTATE_PATH.setAttribute('d', 'M 0 76.785 C 84.712 68.367 116.849 64.897 141.276 0');
var J_ROTATE_PATH_MAX = J_ROTATE_PATH.getTotalLength();
var J_ROTATE_PATH_X_MAX = 141.276;
var J_ROTATE_PATH_Y_MAX = 76.785;
var J_ROTATE_MAX = 4680;
var J = /** @class */ (function (_super) {
    __extends(J, _super);
    function J() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotatePathPos = 0;
        return _this;
    }
    Object.defineProperty(J.prototype, "end", {
        get: function () {
            return exports.J_END;
        },
        enumerable: true,
        configurable: true
    });
    J.prototype.draw = function (theater) {
        var msec = this.modular(theater.msec) - exports.J_START;
        if (msec < 0 || msec > J_LENGTH) {
            this.rotatePathPos = 0;
            return;
        }
        var _a = this.getHatsuSize(theater), dw = _a.dw, dh = _a.dh;
        // 中心点
        var x = theater.width16 * 140 / 480;
        var y = theater.height * 165 / 270;
        // 拡大率
        var z = J_ZOOM_MAX;
        if (msec < J_ZOOM_END - exports.J_START) {
            z = this.liner(J_ZOOM_MIN, J_ZOOM_MAX, J_ZOOM_END - exports.J_START, msec);
        }
        // 透過率
        var o = HatsuBase_1.BASE_ALPHA;
        if (msec < J_ALPHA_IN_END - exports.J_START) {
            o = this.liner(J_ALPHA_MIN, HatsuBase_1.BASE_ALPHA, J_ALPHA_IN_END - exports.J_START, msec);
        }
        if (msec >= J_ALPHA_OUT_START - exports.J_START) {
            o = this.liner(HatsuBase_1.BASE_ALPHA, J_ALPHA_MIN, exports.J_END - J_ALPHA_OUT_START, msec - (J_ALPHA_OUT_START - exports.J_START));
        }
        // 回転角度 r = f(msec)
        var r = 0;
        while (this.rotatePathPos <= J_ROTATE_PATH_MAX) {
            var p = J_ROTATE_PATH.getPointAtLength(this.rotatePathPos);
            var x_msec = p.x * J_LENGTH / J_ROTATE_PATH_X_MAX;
            if (x_msec >= msec) {
                r = p.y / J_ROTATE_PATH_Y_MAX * J_ROTATE_MAX * -1;
                break;
            }
            this.rotatePathPos += 0.1;
        }
        // 描画
        theater.context.save();
        theater.context.translate(x, y);
        theater.context.rotate(r * HatsuBase_1.TO_RADIAN);
        theater.context.globalAlpha = o;
        theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, -(dw * z / 2), -(dh * z / 2), dw * z, dh * z);
        theater.context.globalAlpha = 1.0;
        theater.context.restore();
    };
    return J;
}(HatsuBase_1.HatsuBase));
exports.J = J;

},{"../HatsuBase":6}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getChecked(inputs) {
    for (var i = 0; i < inputs.length; i++) {
        var checked = inputs[i].checked;
        if (checked) {
            return inputs[i];
        }
    }
    return null;
}
function _diffOption(oldOne, newOne) {
    var ret = {};
    var oldKeys = Object.keys(oldOne);
    oldKeys.forEach(function (k) {
        if (oldOne.hasOwnProperty(k) && newOne.hasOwnProperty(k)) {
            if (typeof (oldOne[k]) === 'object' && typeof (newOne[k]) === 'object') {
                ret[k] = _diffOption(oldOne[k], newOne[k]);
            }
            else if (oldOne[k] !== newOne[k]) {
                ret[k] = newOne[k];
            }
        }
    });
    return ret;
}
function diffOption(oldOne, newOne) {
    var ret = {};
    var h = _diffOption(oldOne.hatsu, newOne.hatsu);
    if (Object.keys(h).length > 0) {
        ret.hatsu = newOne.hatsu;
    }
    var b = _diffOption(oldOne.back, newOne.back);
    if (Object.keys(b).length > 0) {
        ret.back = newOne.back;
    }
    if (oldOne.size !== newOne.size) {
        ret.size = newOne.size;
    }
    return ret;
}
var Options = /** @class */ (function () {
    function Options() {
        this._opt = this.getOptions();
    }
    Object.defineProperty(Options.prototype, "options", {
        get: function () {
            return this._opt;
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.diff = function () {
        var option = this.getOptions();
        var changed = diffOption(this._opt, option);
        this._opt = option;
        return changed;
    };
    Options.prototype.getOptions = function () {
        return {
            hatsu: this.getHatsu(),
            back: this.getBack(),
            size: this.getSize(),
        };
    };
    Options.prototype.getFile = function (id) {
        var f = document.getElementById(id);
        if (!f) {
            return null;
        }
        var fi = f;
        if (fi && fi.files && typeof (fi.files[0]) !== 'undefined') {
            return fi.files[0];
        }
        return null;
    };
    Options.prototype.getHatsu = function () {
        var hatsuInput = getChecked(document.getElementsByName('hatsu'));
        if (hatsuInput) {
            var s = hatsuInput.id.replace('hatsu_', '');
            if (s === 'file') {
                var file = this.getFile('hatsu_file_path');
                if (file) {
                    return {
                        type: 'file',
                        file: file,
                    };
                }
            }
        }
        return {
            type: 'default',
        };
    };
    Options.prototype.getBack = function () {
        var backRadio = getChecked(document.getElementsByName('back'));
        if (backRadio) {
            var s = backRadio.id.replace('back_', '');
            if (s === 'file') {
                var file = this.getFile('back_file_path');
                if (file) {
                    if (file.type.startsWith('image/')) {
                        return {
                            type: 'image',
                            file: file,
                        };
                    }
                    if (file.type.startsWith('video/')) {
                        return {
                            type: 'video',
                            file: file,
                        };
                    }
                }
            }
        }
        return {
            type: 'default',
        };
    };
    Options.prototype.getSize = function () {
        var sizeInput = getChecked(document.getElementsByName('size'));
        var size = 480;
        if (sizeInput) {
            var s = sizeInput.id.replace('size_', '');
            var i = parseInt(s, 10);
            if (!isNaN(i)) {
                size = i;
            }
        }
        return size;
    };
    return Options;
}());
exports.Options = Options;

},{}],19:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("./Timer"));
var Theater = /** @class */ (function () {
    function Theater(id, options) {
        this.onend = function () { };
        this._width16 = 480;
        this._width4 = 320;
        this._widthBar = 60;
        this._height = 270;
        this.back = [];
        this.hatsu = [];
        this._timer = new Timer_1.default();
        this._requestId = -1;
        this._maxLengthHatsu = 0;
        this._maxLengthBack = 0;
        this._length = 0;
        this.id = id;
        this.options = options;
        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('id', this.id);
        this.setCanvasSize(this.options.options.size);
        var c = this._canvas.getContext('2d');
        if (c === null) {
            throw new Error('Can not get 2d context.');
        }
        this.ctx = c;
    }
    Object.defineProperty(Theater.prototype, "width16", {
        get: function () {
            return this._width16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "width4", {
        get: function () {
            return this._width4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "widthBar", {
        get: function () {
            return this._widthBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "context", {
        get: function () {
            return this.ctx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "msec", {
        get: function () {
            return this._timer.msec();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theater.prototype, "backs", {
        get: function () {
            return this.back;
        },
        enumerable: true,
        configurable: true
    });
    Theater.prototype.addBack = function (back) {
        this.back.push(back);
        this._maxLengthBack = Math.max.apply(Math, [0].concat((this.back.map(function (b) { return b.length; }))));
        this.calculateLength();
    };
    Theater.prototype.clearBack = function () {
        this.back.length = 0;
        this._maxLengthBack = 0;
        this.calculateLength();
    };
    Theater.prototype.addHatsu = function (hatsu) {
        this.hatsu.push(hatsu);
        this._maxLengthHatsu = Math.max.apply(Math, [0].concat((this.hatsu.map(function (h) { return h.end; }))));
        this.calculateLength();
    };
    Theater.prototype.clearHatsu = function () {
        this.hatsu.length = 0;
        this._maxLengthHatsu = 0;
        this.calculateLength();
    };
    Theater.prototype.start = function (stopAtEnd) {
        var _this = this;
        if (stopAtEnd === void 0) { stopAtEnd = false; }
        if (this._timer.started && !this._timer.paused) {
            return;
        }
        this.back.forEach(function (b) { return b.start(); });
        this._timer.start();
        var loop = function () {
            if (stopAtEnd && _this.length <= _this.msec) {
                _this.onend();
                return;
            }
            _this.draw();
            _this._requestId = window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    };
    Theater.prototype.stop = function () {
        this.back.forEach(function (b) { return b.stop(); });
        this._timer.stop();
        this.onend();
        window.cancelAnimationFrame(this._requestId);
        this._requestId = -1;
    };
    Theater.prototype.pause = function () {
        if (this._timer.started && !this._timer.paused) {
            this.back.forEach(function (b) { return b.pause(); });
            this._timer.pause();
            window.cancelAnimationFrame(this._requestId);
            this._requestId = -1;
        }
    };
    Theater.prototype.setCanvasSize = function (width16) {
        this._width16 = width16;
        this._width4 = width16 * 3 / 4;
        this._widthBar = width16 / 8;
        this._height = width16 * 9 / 16;
        this._canvas.width = this._width16;
        this._canvas.height = this._height;
    };
    Theater.prototype.calculateLength = function () {
        this._length = Math.max(0, this._maxLengthBack, this._maxLengthHatsu);
    };
    Theater.prototype.draw = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this._width16, this._height);
        this.back.forEach(function (b) { return b.draw(_this); });
        this.hatsu.forEach(function (h) { return h.draw(_this); });
        this.drawSideBar();
    };
    Theater.prototype.drawSideBar = function () {
        this.ctx.fillRect(0, 0, this._widthBar, this._height);
        this.ctx.fillRect(this._widthBar + this._width4, 0, this._widthBar, this._height);
    };
    return Theater;
}());
exports.Theater = Theater;

},{"./Timer":20}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timer = /** @class */ (function () {
    function Timer() {
        this._total = 0;
        this._laps = [];
    }
    Object.defineProperty(Timer.prototype, "started", {
        get: function () {
            return this._laps.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "paused", {
        get: function () {
            return this.started && (this._laps.length % 2 === 0);
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.start = function () {
        var now = (new Date()).getTime();
        if (this.started) {
            if (this.paused) {
                // started and paused - resume pause.
                this.addLap(now);
            }
            // started and not paused - do nothing.
        }
        else {
            // not started - start.
            this._laps.push(now);
        }
    };
    Timer.prototype.stop = function () {
        this._total = 0;
        this._laps = [];
    };
    Timer.prototype.pause = function () {
        if (this.started && !this.paused) {
            this.addLap((new Date()).getTime());
        }
    };
    Timer.prototype.msec = function (dt) {
        if (this._laps.length === 0) {
            return -1;
        }
        if (this.paused) {
            return this._total;
        }
        var now = (dt || new Date()).getTime();
        return this._total + (now - this._laps[this._laps.length - 1]);
    };
    Timer.prototype.addLap = function (now) {
        var _this = this;
        this._laps.push(now);
        this._total = this._laps.map(function (l, i) {
            return (i % 2 === 0) ? 0 : l - _this._laps[i - 1];
        }).reduce(function (s, c) { return s += c; }, 0);
    };
    return Timer;
}());
exports.default = Timer;

},{}],21:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __importDefault(require("./App"));
var MIME_TYPES = [
    { mime: 'video/mpeg', ext: 'mpeg' },
    { mime: 'video/webm;codecs=H264', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
];
function getMime() {
    for (var i = 0; i < MIME_TYPES.length; i++) {
        if (MediaRecorder.isTypeSupported(MIME_TYPES[i].mime)) {
            return MIME_TYPES[i];
        }
    }
    return {
        mime: '',
        ext: '',
    };
}
function initialize() {
    return __awaiter(this, void 0, void 0, function () {
        var app, recordButton, optionInputs, restartButton, mime, canDL, dlMsg, dlLink, dlArea, dlVideo, ondataavailable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = new App_1.default();
                    return [4 /*yield*/, app.setup()];
                case 1:
                    _a.sent();
                    recordButton = document.getElementById('restart_record');
                    optionInputs = document.querySelectorAll('#options input');
                    optionInputs.forEach(function (i) { return i.addEventListener('change', function () { app.onChangeOptionInputs(); }); });
                    restartButton = document.getElementById('restart');
                    if (restartButton) {
                        restartButton.addEventListener('click', function () {
                            app.stop();
                            app.start();
                        });
                    }
                    mime = getMime();
                    canDL = mime.mime.length > 0;
                    dlMsg = document.getElementById('download_message');
                    if (canDL && dlMsg) {
                        dlMsg.innerText = '※表示された内容を録画するので、ダウンロードまで1周分待ってね（録画中は動画の音が出ません）';
                    }
                    dlLink = document.getElementById('download_link');
                    dlArea = document.getElementById('download_area');
                    dlVideo = document.createElement('video');
                    ondataavailable = function (e) {
                        var url = URL.createObjectURL(e.data);
                        dlVideo.src = url;
                        if (dlLink && dlArea) {
                            dlLink.href = url;
                            dlLink.setAttribute('download', 'hatsu.' + mime.ext);
                            dlArea.style.display = 'block';
                        }
                        if (recordButton) {
                            recordButton.innerText = '最初から再生して録画';
                            recordButton.disabled = false;
                        }
                    };
                    // record
                    if (recordButton) {
                        if (canDL) {
                            recordButton.addEventListener('click', function () {
                                recordButton.innerText = '録画中...';
                                recordButton.disabled = true;
                                app.record(ondataavailable, mime.mime);
                            });
                        }
                        else {
                            recordButton.style.display = 'none';
                        }
                    }
                    app.start();
                    return [2 /*return*/];
            }
        });
    });
}
window.addEventListener('load', initialize);

},{"./App":1}]},{},[21]);
