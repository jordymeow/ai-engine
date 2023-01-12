/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/js/components/AiIcon.js":
/*!*************************************!*\
  !*** ./app/js/components/AiIcon.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;
var AI = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m391 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m331 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m271 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m211 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#5f55af"
}), /*#__PURE__*/React.createElement("path", {
  d: "m151 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#5f55af"
}), /*#__PURE__*/React.createElement("path", {
  d: "m91 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",
  fill: "#5f55af"
}), /*#__PURE__*/React.createElement("path", {
  d: "m406 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m346 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m286 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("g", {
  fill: "#5f55af"
}, /*#__PURE__*/React.createElement("path", {
  d: "m226 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m166 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m106 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 121h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 181h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 241h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 301h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 361h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m15 421h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"
})), /*#__PURE__*/React.createElement("path", {
  d: "m431 91v30h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m431 181h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m431 241h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m431 301h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m431 361h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",
  fill: "#39326c"
}), /*#__PURE__*/React.createElement("path", {
  d: "m431 421h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",
  fill: "#39326c"
})), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m446 51h-380c-8.284 0-15 6.716-15 15v380c0 8.284 6.716 15 15 15h380c8.284 0 15-6.716 15-15v-380c0-8.284-6.716-15-15-15z",
  fill: "#aed0ff"
}), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m461 446v-380c0-8.284-6.716-15-15-15h-190v410h190c8.284 0 15-6.716 15-15z",
  fill: "#7c84e8"
})), /*#__PURE__*/React.createElement("path", {
  d: "m386 111h-260c-8.284 0-15 6.716-15 15v260c0 8.284 6.716 15 15 15h260c8.284 0 15-6.716 15-15v-260c0-8.284-6.716-15-15-15z",
  fill: "#5f55af"
}), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m401 386v-260c0-8.284-6.716-15-15-15h-130v290h130c8.284 0 15-6.716 15-15z",
  fill: "#39326c"
}))), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m247.626 192.389c-.052-.138-.106-.274-.162-.411-2.744-6.671-9.175-10.978-16.387-10.978-.006 0-.012 0-.018 0-7.219.007-13.65 4.329-16.383 11.01-.046.113-.091.227-.134.341l-45.06 118.31c-2.949 7.742.937 16.408 8.679 19.356 7.742 2.95 16.408-.937 19.356-8.679l7.543-19.804h51.691l7.458 19.762c2.267 6.007 7.974 9.708 14.036 9.708 1.76 0 3.55-.312 5.294-.97 7.75-2.925 11.663-11.579 8.737-19.33zm-31.14 79.146 14.538-38.171 14.406 38.171z",
  fill: "#f9f9f9"
}), /*#__PURE__*/React.createElement("g", {
  fill: "#e2dff4"
}, /*#__PURE__*/React.createElement("path", {
  d: "m264.209 321.296c2.267 6.007 7.974 9.708 14.036 9.708 1.76 0 3.55-.312 5.294-.97 7.75-2.925 11.663-11.579 8.737-19.33l-36.276-96.126v86.956h.751z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m328.5 181c-8.284 0-15 6.716-15 15v120c0 8.284 6.716 15 15 15s15-6.716 15-15v-120c0-8.284-6.716-15-15-15z"
}))));
var Wand = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "m213.46 341.461-139.26 156.08c-16.17 18.48-44.53 19.33-61.8 2.06-17.32-17.32-16.37-45.67 2.06-61.8l156.08-139.26s13.46-2.54 29.46 13.46 13.46 29.46 13.46 29.46z",
  fill: "#0052be"
}), /*#__PURE__*/React.createElement("path", {
  d: "m213.46 341.461-139.26 156.08c-16.17 18.48-44.53 19.33-61.8 2.06l187.6-187.6c16 16 13.46 29.46 13.46 29.46z",
  fill: "#00429b"
}), /*#__PURE__*/React.createElement("path", {
  d: "m304 240.001-90.54 101.46c-14.997-14.997-27.922-27.922-42.92-42.92l101.46-90.54z",
  fill: "#00429b"
}), /*#__PURE__*/React.createElement("path", {
  d: "m304 240.001-90.54 101.46-21.46-21.46 96-96z",
  fill: "#00337a"
}), /*#__PURE__*/React.createElement("path", {
  d: "m400 279.001h-64.4l-42.47 57.87c-7.88 10.735-24.824 6.606-26.91-6.52l-11.56-73.01-73.01-11.56c-13.139-2.087-17.244-19.042-6.52-26.91l57.87-42.47v-64.4c0-12.176 13.797-19.289 23.72-12.21l50.15 35.83 70.92-19.9c11.25-3.168 21.656 7.245 18.49 18.49l-19.9 70.92 35.83 50.15c7.071 9.913-.02 23.72-12.21 23.72z",
  fill: "#ffdd54"
}), /*#__PURE__*/React.createElement("path", {
  d: "m412.21 255.281c7.071 9.913-.02 23.72-12.21 23.72h-64.4l-42.47 57.87c-7.875 10.728-24.823 6.616-26.91-6.52l-11.56-73.01 137.79-137.79c3.83 3.84 5.3 9.44 3.83 14.66l-19.9 70.92z",
  fill: "#ffb454"
}), /*#__PURE__*/React.createElement("path", {
  d: "m512 39.001c0 8.28-6.72 15-15 15h-9v9c0 8.28-6.72 15-15 15s-15-6.72-15-15v-9h-9c-8.28 0-15-6.72-15-15s6.72-15 15-15h9v-9c0-8.28 6.72-15 15-15s15 6.72 15 15v9h9c8.28 0 15 6.719 15 15z",
  fill: "#bee75e"
}), /*#__PURE__*/React.createElement("path", {
  d: "m512 39.001c0 8.28-6.72 15-15 15h-9v9c0 8.28-6.72 15-15 15s-15-6.72-15-15v-9l30-30h9c8.28 0 15 6.719 15 15z",
  fill: "#00cb75"
}), /*#__PURE__*/React.createElement("path", {
  d: "m336 41.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",
  fill: "#f6f9f9"
}), /*#__PURE__*/React.createElement("path", {
  d: "m441 224.001c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9z",
  fill: "#e2dff4"
}), /*#__PURE__*/React.createElement("path", {
  d: "m497 329.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",
  fill: "#ff4a4a"
}), /*#__PURE__*/React.createElement("path", {
  d: "m192 24.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",
  fill: "#ff8659"
}), /*#__PURE__*/React.createElement("path", {
  d: "m159.442 122.977-56-32c-7.191-4.109-16.355-1.611-20.466 5.581-4.11 7.193-1.611 16.355 5.581 20.466l56 32c7.16 4.093 16.337 1.644 20.466-5.581 4.111-7.193 1.612-16.355-5.581-20.466z",
  fill: "#f6f9f9"
}), /*#__PURE__*/React.createElement("path", {
  d: "m118.14 169.117-64 8c-8.221 1.027-14.052 8.524-13.023 16.744 1.027 8.218 8.523 14.054 16.744 13.023l64-8c8.221-1.027 14.052-8.524 13.023-16.744-1.028-8.22-8.527-14.062-16.744-13.023z",
  fill: "#acceff"
}), /*#__PURE__*/React.createElement("path", {
  d: "m389.023 352.558c-4.111-7.193-13.274-9.693-20.466-5.581-7.192 4.11-9.691 13.272-5.581 20.466l32 56c2.769 4.845 7.83 7.561 13.037 7.561 11.319 0 18.784-12.341 13.01-22.445z",
  fill: "#e2dff4"
}), /*#__PURE__*/React.createElement("path", {
  d: "m329.86 377.117c-8.222-1.031-15.717 4.804-16.744 13.023l-8 64c-1.117 8.925 5.834 16.862 14.902 16.862 7.455 0 13.917-5.553 14.865-13.142l8-64c1.029-8.219-4.802-15.716-13.023-16.743z",
  fill: "#6ba7ff"
}));
var AiIcon = function AiIcon() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$icon = _ref.icon,
    icon = _ref$icon === void 0 ? 'ai' : _ref$icon,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  var svgContent = useMemo(function () {
    switch (icon) {
      case 'ai':
        return AI;
      case 'wand':
        return Wand;
      default:
        return AI;
    }
  }, [icon]);
  return /*#__PURE__*/React.createElement("svg", {
    style: _objectSpread({
      width: 20,
      height: 20,
      marginRight: 5
    }, style),
    "enable-background": "new 0 0 512 512",
    height: "512",
    viewBox: "0 0 512 512",
    width: "512",
    xmlns: "http://www.w3.org/2000/svg"
  }, svgContent);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AiIcon);

/***/ }),

/***/ "./app/js/components/CommonStyles.js":
/*!*******************************************!*\
  !*** ./app/js/components/CommonStyles.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AiNekoHeader": () => (/* binding */ AiNekoHeader),
/* harmony export */   "StyledGallery": () => (/* binding */ StyledGallery),
/* harmony export */   "StyledTextField": () => (/* binding */ StyledTextField),
/* harmony export */   "StyledTitleWithButton": () => (/* binding */ StyledTitleWithButton)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Header.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }


var AiNekoHeader = function AiNekoHeader(_ref) {
  var _ref$title = _ref.title,
    title = _ref$title === void 0 ? "Settings" : _ref$title;
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_0__.NekoHeader, {
    title: "AI Engine | ".concat(title),
    subtitle: "By Jordy Meow"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoButton, {
    className: "header",
    icon: "",
    onClick: function onClick() {
      return location.href = 'edit.php?page=mwai_content_generator';
    }
  }, "Build Content"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoButton, {
    className: "header",
    icon: "",
    onClick: function onClick() {
      return location.href = 'edit.php?page=mwai_image_generator';
    }
  }, "Build Images"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoButton, {
    className: "header",
    icon: "",
    onClick: function onClick() {
      return location.href = 'tools.php?page=mwai_dashboard';
    }
  }, "Playground"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoButton, {
    className: "header",
    icon: "tools",
    onClick: function onClick() {
      return location.href = 'admin.php?page=mwai_settings';
    }
  }, "Settings")));
};
var StyledTitleWithButton = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: unset;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: -5px;\n\n  h2 {\n    margin: 0;\n  }\n"])));
var StyledGallery = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));\n  grid-gap: 10px;\n  margin-top: 20px;\n\n  img {\n    width: 100%;\n    height: 305px;\n  }\n\n  .empty-image {\n    width: 100%;\n    height: 305px;\n    background-color: #f5f5f5;\n  }\n"])));
var StyledTextField = (0,styled_components__WEBPACK_IMPORTED_MODULE_2__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTextArea)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\n  .neko-textarea {\n    height: 76px;\n    border: 1px solid #eaeaea !important;\n    background: #fbfbfb !important;\n    font-size: 15px !important;\n  }\n"])));


/***/ }),

/***/ "./app/js/components/ContentGenerator.js":
/*!***********************************************!*\
  !*** ./app/js/components/ContentGenerator.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CommonStyles */ "./app/js/components/CommonStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _templateObject, _templateObject2;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;


// NekoUI






var StyledSidebar = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: white;\n  padding: 15px;\n  border-radius: 5px;\n\n  h3:first-child {\n    margin-top: 0;\n  }\n\n  label {\n    display: block;\n    margin-bottom: 5px;\n  }\n\n  label {\n    margin-top: 10px;\n  }\n\n  li {\n    margin-bottom: 10px;\n    border: 1px solid #e5e5e5;\n    padding: 10px;\n    background: #f5f5f5;\n    border-radius: 5px;\n    cursor: pointer;\n    transition: all 0.2s ease-in-out;\n  }\n\n  li.active {\n    background: #037cba;\n    color: white;\n    border-color: #037cba;\n  }\n\n  .information {\n    color: #737373;\n    margin-top: 5px;\n    font-size: 12px;\n  }\n"])));
var StyledTitleWithButton = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: unset;\n  align-items: center;\n  justify-content: space-between;\n\n  h2 {\n    margin: 0;\n  }\n"])));

// Function that returns a message with SEO recommendations based on the title
var getSeoMessage = function getSeoMessage(title) {
  var words = title.split(' ');
  var wordCount = words.length;
  var charCount = title.length;
  var seoMessage = [];
  if (!charCount) {
    return;
  } else if (wordCount < 3) {
    seoMessage.push('The title is too short. It should be at least 3 words.');
  } else if (wordCount > 8) {
    seoMessage.push('The title is too long. It should be no more than 8 words.');
  } else if (charCount < 40) {
    seoMessage.push('The title is too short. It should be at least 40 characters.');
  } else if (charCount > 70) {
    seoMessage.push('The title is too long. It should be no more than 70 characters.');
  }
  return seoMessage.join(' ');
};
var isTest = false;
var DefaultTitle = isTest ? 'Gunkanjima : An Illegal Travel to the Battleship Island' : '';
var DefaultHeadings = isTest ? "An In-Depth Look at the Illegality of Traveling to Gunkanjima\nHow Digital Technology is Uncovering the Stories of the People Who Lived There" : '';
var ContentGenerator = function ContentGenerator() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = useState(DefaultTitle),
    _useState4 = _slicedToArray(_useState3, 2),
    title = _useState4[0],
    setTitle = _useState4[1];
  var _useState5 = useState(5),
    _useState6 = _slicedToArray(_useState5, 2),
    headingsCount = _useState6[0],
    setHeadingsCount = _useState6[1];
  var _useState7 = useState(DefaultHeadings),
    _useState8 = _slicedToArray(_useState7, 2),
    headings = _useState8[0],
    setHeadings = _useState8[1];
  var _useState9 = useState(2),
    _useState10 = _slicedToArray(_useState9, 2),
    paragraphsCount = _useState10[0],
    setParagraphsCount = _useState10[1];
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    content = _useState12[0],
    setContent = _useState12[1];
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.useModels)(_app_settings__WEBPACK_IMPORTED_MODULE_2__.options),
    models = _useModels.models,
    model = _useModels.model,
    setModel = _useModels.setModel;
  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    excerpt = _useState14[0],
    setExcerpt = _useState14[1];
  var _useState15 = useState('en'),
    _useState16 = _slicedToArray(_useState15, 2),
    language = _useState16[0],
    setLanguage = _useState16[1];
  var _useState17 = useState('informative'),
    _useState18 = _slicedToArray(_useState17, 2),
    writingStyle = _useState18[0],
    setWritingStyle = _useState18[1];
  var _useState19 = useState('neutral'),
    _useState20 = _slicedToArray(_useState19, 2),
    writingTone = _useState20[0],
    setWritingTone = _useState20[1];
  var _useState21 = useState(),
    _useState22 = _slicedToArray(_useState21, 2),
    promptForHeadings = _useState22[0],
    setPromptForHeadings = _useState22[1];
  var _useState23 = useState(),
    _useState24 = _slicedToArray(_useState23, 2),
    promptForContent = _useState24[0],
    setPromptForContent = _useState24[1];
  var _useState25 = useState(),
    _useState26 = _slicedToArray(_useState25, 2),
    promptForExcerpt = _useState26[0],
    setPromptForExcerpt = _useState26[1];
  var _useState27 = useState(1),
    _useState28 = _slicedToArray(_useState27, 2),
    temperature = _useState28[0],
    setTemperature = _useState28[1];
  var _useState29 = useState(false),
    _useState30 = _slicedToArray(_useState29, 2),
    busy = _useState30[0],
    setBusy = _useState30[1];
  var _useState31 = useState(false),
    _useState32 = _slicedToArray(_useState31, 2),
    showModelParams = _useState32[0],
    setShowModelParams = _useState32[1];
  var _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    showPrompts = _useState34[0],
    setShowPrompts = _useState34[1];
  var _useState35 = useState(),
    _useState36 = _slicedToArray(_useState35, 2),
    createdPostId = _useState36[0],
    setCreatedPostId = _useState36[1];
  var titleMessage = useMemo(function () {
    return getSeoMessage(title);
  }, [title]);
  useEffect(function () {
    if (title) {
      var humanLanguage = _constants__WEBPACK_IMPORTED_MODULE_3__.Languages.find(function (l) {
        return l.value === language;
      }).label;
      setPromptForHeadings("Generate ".concat(headingsCount, " short blog headings about \"").concat(title, "\", in ").concat(humanLanguage, ". Style: ").concat(writingStyle, ". Tone: ").concat(writingTone, "."));
    }
  }, [title, headingsCount, writingStyle, writingTone, language]);
  useEffect(function () {
    if (title && headings) {
      var humanLanguage = _constants__WEBPACK_IMPORTED_MODULE_3__.Languages.find(function (l) {
        return l.value === language;
      }).label;
      var cleanHeadings = headings.split('\n').filter(function (x) {
        return x;
      });
      var _headingsCount = cleanHeadings.length;
      setPromptForContent("Write an article about \"".concat(title, "\" in ").concat(humanLanguage, ". With an introduction, and conclusion. The article has ").concat(paragraphsCount * _headingsCount + 2, " paragraphs, organized by the following headings:\n\n").concat(headings, "\n\nStyle: ").concat(writingStyle, ". Tone: ").concat(writingTone, ". Use Markdown formatting."));
    }
  }, [title, headings, writingTone, writingStyle, language, paragraphsCount]);
  useEffect(function () {
    if (title) {
      setPromptForExcerpt("Write a short, SEO-friendly excerpt for en article about \"".concat(title, "\""));
    }
  }, [title]);
  var onSubmitPrompt = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var promptToUse,
        res,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            promptToUse = _args.length > 0 && _args[0] !== undefined ? _args[0] : prompt;
            _context.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_2__.apiUrl, "/make_completions"), {
              json: {
                prompt: promptToUse,
                temperature: temperature,
                model: model
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_2__.restNonce
            });
          case 3:
            res = _context.sent;
            console.log("Completions", {
              prompt: promptToUse,
              result: res
            });
            if (!res.success) {
              _context.next = 7;
              break;
            }
            return _context.abrupt("return", res.data);
          case 7:
            setError(res.message);
            return _context.abrupt("return", null);
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onSubmitPrompt() {
      return _ref.apply(this, arguments);
    };
  }();
  var onSubmitPromptForHeadings = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var text;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            setHeadings("");
            _context2.next = 4;
            return onSubmitPrompt(promptForHeadings);
          case 4:
            text = _context2.sent;
            if (text) {
              setHeadings((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.cleanNumbering)(text));
            }
            setBusy(false);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function onSubmitPromptForHeadings() {
      return _ref2.apply(this, arguments);
    };
  }();
  var onSubmitPromptForContent = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var text;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            setBusy(true);
            setContent("");
            _context3.next = 4;
            return onSubmitPrompt(promptForContent);
          case 4:
            text = _context3.sent;
            // text = text.split('\n').filter(x => !x.match(/^(Introduction|Conclusion)(:)?$/)).join('\n');
            // text = text.replace(/\n{3,}/g, text);
            // text = text.trim();
            if (text) {
              setContent(text);
            }
            setBusy(false);
          case 7:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function onSubmitPromptForContent() {
      return _ref3.apply(this, arguments);
    };
  }();
  var onSubmitPromptForExcerpt = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var text;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            setBusy(true);
            setExcerpt("");
            _context4.next = 4;
            return onSubmitPrompt(promptForExcerpt);
          case 4:
            text = _context4.sent;
            if (text) {
              setExcerpt(text);
            }
            setBusy(false);
          case 7:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function onSubmitPromptForExcerpt() {
      return _ref4.apply(this, arguments);
    };
  }();
  var onSubmitNewPost = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var res;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            setBusy(true);
            _context5.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_2__.apiUrl, "/create_post"), {
              json: {
                title: title,
                headings: headings,
                content: content,
                excerpt: excerpt,
                language: language
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_2__.restNonce
            });
          case 3:
            res = _context5.sent;
            setBusy(false);
            if (res.success) {
              setCreatedPostId(res.postId);
            } else {
              setError(res.message);
            }
          case 6:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function onSubmitNewPost() {
      return _ref5.apply(this, arguments);
    };
  }();
  var onResetData = function onResetData() {
    setTitle('');
    setHeadings(DefaultHeadings);
    setContent('');
    setExcerpt('');
    setCreatedPostId();
  };
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoPage, {
    nekoErrors: []
  }, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.AiNekoHeader, {
    title: "Content Generator"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoContainer, {
    style: {
      borderRadius: 0,
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoTypo, {
    p: true,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, "Using the Post Generator is simple; write a Title, click on Generate Headings, then Generate Content, then (optionally) on Generate Excerpt, and Create Post."), " That's it!"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoTypo, {
    p: true,
    style: {
      marginBottom: 0
    }
  }, "As you go, you can also modify the prompts (they represent exactly what will be sent to the AI). If you find a prompt that gives you really good result, or have any other remark, idea, or request, please come and chat with me on the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/support/plugin/ai-engine/"
  }, "Support Forum"), ". Let's make this better together \uD83D\uDC95")), /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_1__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_2__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, {
    style: {
      flex: 3
    }
  }, /*#__PURE__*/React.createElement(StyledSidebar, {
    style: {
      marginBottom: 25,
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Title"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoInput, {
    value: title,
    onChange: setTitle
  }), titleMessage && /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "Advice: ", titleMessage)), /*#__PURE__*/React.createElement(StyledSidebar, {
    style: {
      paddingTop: 5,
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(StyledTitleWithButton, {
    style: {
      paddingTop: 5,
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Headings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "headingsCount",
    disabled: !title || busy,
    style: {
      marginRight: 10
    },
    value: headingsCount,
    description: "",
    onChange: setHeadingsCount
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 3,
    id: 3,
    value: 3,
    label: 3
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 5,
    id: 5,
    value: 5,
    label: 5
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 8,
    id: 8,
    value: 8,
    label: 8
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 12,
    id: 12,
    value: 12,
    label: 12
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: busy,
    onClick: onSubmitPromptForHeadings
  }, "Generate Headings"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    value: headings,
    onBlur: setHeadings
  }), /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "You can modify the content before using \"Generate Content\". Add, rewrite, remove, or reorganize the headings as you wish before going further."), /*#__PURE__*/React.createElement(StyledTitleWithButton, {
    style: {
      paddingTop: 5,
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Content"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      margin: '0 5px 0 0'
    }
  }, "# of Paragraphs per Heading: "), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "paragraphsCount",
    disabled: !title || busy,
    style: {
      marginRight: 10
    },
    value: paragraphsCount,
    description: "",
    onChange: setParagraphsCount
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 1,
    id: 1,
    value: 1,
    label: 1
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 2,
    id: 2,
    value: 2,
    label: 2
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 3,
    id: 3,
    value: 3,
    label: 3
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 4,
    id: 4,
    value: 4,
    label: 4
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 6,
    id: 6,
    value: 6,
    label: 6
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 8,
    id: 8,
    value: 8,
    label: 8
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: 10,
    id: 10,
    value: 10,
    label: 10
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: busy,
    onClick: onSubmitPromptForContent
  }, "Generate Content"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    value: content,
    onBlur: setContent
  }), /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "You can modify the content before using \"Create Post\". Markdown is supported, and will be converted to HTML when the post is created."), /*#__PURE__*/React.createElement(StyledTitleWithButton, {
    style: {
      paddingTop: 5,
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Excerpt"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: busy,
    onClick: onSubmitPromptForExcerpt
  }, "Generate Excerpt")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    value: excerpt,
    onBlur: setExcerpt
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    style: {
      marginTop: 30,
      width: '100%'
    },
    onClick: onSubmitNewPost,
    isBusy: busy,
    disabled: !content
  }, "Create Post"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, null, /*#__PURE__*/React.createElement(StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Content Params"), /*#__PURE__*/React.createElement("label", null, "Language:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "language",
    name: "language",
    disabled: busy,
    value: language,
    description: "",
    onChange: setLanguage
  }, _constants__WEBPACK_IMPORTED_MODULE_3__.Languages.map(function (lang) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
      key: lang.value,
      id: lang.value,
      value: lang.value,
      label: lang.label
    });
  })), /*#__PURE__*/React.createElement("label", null, "Writing style:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "writingStyle",
    name: "writingStyle",
    disabled: busy,
    value: writingStyle,
    description: "",
    onChange: setWritingStyle
  }, _constants__WEBPACK_IMPORTED_MODULE_3__.WritingStyles.map(function (style) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
      key: style.value,
      id: style.value,
      value: style.value,
      label: style.label
    });
  })), /*#__PURE__*/React.createElement("label", null, "Writing tone:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "writingTone",
    name: "writingTone",
    disabled: busy,
    value: writingTone,
    description: "",
    onChange: setWritingTone
  }, _constants__WEBPACK_IMPORTED_MODULE_3__.WritingTones.map(function (tone) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
      key: tone.value,
      id: tone.value,
      value: tone.value,
      label: tone.label
    });
  }))), /*#__PURE__*/React.createElement(StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Model Params"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    onClick: function onClick() {
      return setShowModelParams(!showModelParams);
    }
  }, showModelParams ? 'Hide' : 'Show')), showModelParams && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Temperature:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoInput, {
    id: "temperature",
    name: "temperature",
    value: temperature,
    type: "number",
    onChange: setTemperature,
    onBlur: setTemperature,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red'
      }
    }, "Between 0 and 1."), " Higher values means the model will take more risks.")
  }), /*#__PURE__*/React.createElement("label", null, "Model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    id: "models",
    value: model,
    scrolldown: true,
    onChange: setModel
  }, models.map(function (x) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
      value: x.id,
      label: x.name
    });
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 0
    }
  }, "More parameters will be added here later! \uD83D\uDE07"))), /*#__PURE__*/React.createElement(StyledSidebar, null, /*#__PURE__*/React.createElement(StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Prompts"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    onClick: function onClick() {
      return setShowPrompts(!showPrompts);
    }
  }, showPrompts ? 'Hide' : 'Show')), showPrompts && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "The prompts are automatically generated for you, but you can fine-tune them once everything is set."), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Generate Headings")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    disabled: busy,
    value: promptForHeadings,
    onChange: setPromptForHeadings
  }), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Generate Content")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    disabled: busy,
    value: promptForContent,
    onChange: setPromptForContent
  }), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Generate Excerpt")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTextArea, {
    disabled: !content || busy,
    value: promptForExcerpt,
    onChange: setPromptForExcerpt
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoModal, {
    isOpen: createdPostId,
    onRequestClose: function onRequestClose() {
      return setCreatedPostId();
    },
    onOkClick: function onOkClick() {
      window.open("/wp-admin/post.php?post=".concat(createdPostId, "&action=edit"), '_blank');
      onResetData();
    },
    ok: "Edit the Post",
    cancel: "Close",
    onCancelClick: onResetData,
    title: "Post Created!",
    content: /*#__PURE__*/React.createElement("p", null, "The post was created as draft.")
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoModal, {
    isOpen: error,
    onRequestClose: function onRequestClose() {
      setError();
    },
    onOkClick: function onOkClick() {
      setError();
    },
    title: "Error",
    content: /*#__PURE__*/React.createElement("p", null, error)
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentGenerator);

/***/ }),

/***/ "./app/js/components/ImageGenerator.js":
/*!*********************************************!*\
  !*** ./app/js/components/ImageGenerator.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CommonStyles */ "./app/js/components/CommonStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _templateObject;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;


// NekoUI





var ImagesCount = [3, 6, 9];
function generateFilename(prompt) {
  var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 42;
  var cleaned = prompt.replace(/[\s|,]+/g, '-');
  cleaned = cleaned.replace(/--+/g, '-');
  var words = cleaned.split("-");
  var filename = words[0];
  var i = 1;
  while (filename.length + words[i].length < maxLength && i < words.length) {
    filename += "-" + words[i];
    i++;
  }
  if (filename.length > maxLength + 1) {
    filename = filename.slice(0, maxLength + 2);
  }
  return filename;
}
var StyledInputWrapper = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-bottom: 5px;\n\n  label {\n    margin-bottom: 5px;\n    display: block;\n  }\n"])));
var isTest = true;
var DefaultTitle = isTest ? 'japan, tokyo, trees, izakaya, anime oil painting, high resolution, ghibli inspired, 4k' : '';
var ImageGenerator = function ImageGenerator() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = useState(DefaultTitle),
    _useState4 = _slicedToArray(_useState3, 2),
    prompt = _useState4[0],
    setPrompt = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    continuousMode = _useState6[0],
    setContinuousMode = _useState6[1];
  var _useState7 = useState(3),
    _useState8 = _slicedToArray(_useState7, 2),
    maxResults = _useState8[0],
    setMaxResults = _useState8[1];
  var _useState9 = useState([]),
    _useState10 = _slicedToArray(_useState9, 2),
    urls = _useState10[0],
    setUrls = _useState10[1];
  var _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedUrl = _useState12[0],
    setSelectedUrl = _useState12[1];
  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    title = _useState14[0],
    setTitle = _useState14[1];
  var _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    description = _useState16[0],
    setDescription = _useState16[1];
  var _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    caption = _useState18[0],
    setCaption = _useState18[1];
  var _useState19 = useState(''),
    _useState20 = _slicedToArray(_useState19, 2),
    alt = _useState20[0],
    setAlt = _useState20[1];
  var _useState21 = useState(''),
    _useState22 = _slicedToArray(_useState21, 2),
    filename = _useState22[0],
    setFilename = _useState22[1];
  var _useState23 = useState(false),
    _useState24 = _slicedToArray(_useState23, 2),
    busy = _useState24[0],
    setBusy = _useState24[1];
  var _useState25 = useState([]),
    _useState26 = _slicedToArray(_useState25, 2),
    createdMediaIds = _useState26[0],
    setCreatedMediaIds = _useState26[1];
  var urlIndex = useMemo(function () {
    return urls.indexOf(selectedUrl);
  }, [selectedUrl, urls]);
  useEffect(function () {
    if (selectedUrl) {
      var newFilename = generateFilename(prompt) + '.png';
      setFilename(newFilename);
      setTitle(prompt);
      setDescription(prompt);
      setCaption(prompt);
      setAlt(prompt);
    }
  }, [selectedUrl]);
  var onGoBack = function onGoBack() {
    if (urlIndex > 0) {
      setSelectedUrl(urls[urlIndex - 1]);
    }
  };
  var onGoNext = function onGoNext() {
    if (urlIndex < urls.length - 1) {
      setSelectedUrl(urls[urlIndex + 1]);
    }
  };
  var onSubmit = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setBusy(true);
            _context.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_2__.apiUrl, "/make_images"), {
              json: {
                prompt: prompt,
                maxResults: maxResults
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_2__.restNonce
            });
          case 3:
            res = _context.sent;
            setBusy(false);
            if (res.success) {
              if (continuousMode) {
                setUrls([].concat(_toConsumableArray(urls), _toConsumableArray(res.data)));
              } else {
                setUrls(res.data);
              }
            }
            setError(res.message);
            return _context.abrupt("return", null);
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onSubmit() {
      return _ref.apply(this, arguments);
    };
  }();
  var onAdd = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var res;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            _context2.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_2__.apiUrl, "/create_image"), {
              json: {
                url: selectedUrl,
                title: title,
                description: description,
                caption: caption,
                alt: alt,
                filename: filename
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_2__.restNonce
            });
          case 3:
            res = _context2.sent;
            setBusy(false);
            if (res.success) {
              setCreatedMediaIds([].concat(_toConsumableArray(createdMediaIds), [{
                id: res.attachmentId,
                url: selectedUrl
              }]));
            }
            setError(res.message);
            return _context2.abrupt("return", null);
          case 8:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function onAdd() {
      return _ref2.apply(this, arguments);
    };
  }();
  var currentCreatedMediaId = useMemo(function () {
    var found = createdMediaIds.find(function (media) {
      return media.url === selectedUrl;
    });
    return found ? found.id : null;
  }, [selectedUrl, createdMediaIds]);
  console.log({
    createdMediaIds: createdMediaIds,
    currentCreatedMediaId: currentCreatedMediaId
  });
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoPage, {
    nekoErrors: []
  }, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.AiNekoHeader, {
    title: "Image Generator"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoContainer, {
    style: {
      borderRadius: 0,
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoTypo, {
    p: true,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, "This is extremely beta!"), " The idea is that I want this to be very convenient to use, and this UI will be found later in the Post Editor directly, via a modal, and you'll be able to add new generated images easily anywhere. If you have any remark, idea, or request, please come and chat with me on the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/support/plugin/ai-engine/"
  }, "Support Forum"), ". Let's make this better together \uD83D\uDC95")), /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_8__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_2__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoColumn, {
    style: {
      flex: 3
    }
  }, selectedUrl && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoContainer, null, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTitleWithButton, {
    style: {
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Images Generator"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoButton, {
    disabled: urlIndex < 1 || busy,
    onClick: function onClick() {
      return onGoBack();
    }
  }, "<"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoButton, {
    disabled: busy,
    onClick: function onClick() {
      return setSelectedUrl();
    }
  }, "Back to results"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoButton, {
    disabled: urlIndex >= urls.length - 1 || busy,
    onClick: function onClick() {
      return onGoNext();
    }
  }, ">"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: selectedUrl,
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      marginLeft: 10,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Title:"), /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTextField, {
    value: title,
    onBlur: setTitle
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Caption:"), /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTextField, {
    value: caption,
    onBlur: setCaption
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Description:"), /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTextField, {
    value: description,
    onBlur: setDescription
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Alternative Text:"), /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTextField, {
    value: alt,
    onBlur: setAlt
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Filename:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoInput, {
    value: filename,
    onChange: setFilename
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoButton, {
    fullWidth: true,
    style: {
      marginTop: 7
    },
    isBusy: busy,
    onClick: function onClick() {
      return onAdd();
    }
  }, "Add to Media Library"), currentCreatedMediaId && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoMessageSuccess, {
    style: {
      fontSize: 13,
      padding: '10px 5px'
    }
  }, "The media has been created! You can edit it here: ", /*#__PURE__*/React.createElement("a", {
    href: "/wp-admin/post.php?post=".concat(currentCreatedMediaId, "&action=edit"),
    target: "_blank"
  }, "Edit Media #", currentCreatedMediaId), "."))))), !selectedUrl && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoContainer, null, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Generated Images"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      margin: '0 5px 0 0'
    }
  }, "# of Images: "), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoSelect, {
    scrolldown: true,
    id: "maxResults",
    name: "maxResults",
    disabled: busy,
    style: {
      marginRight: 10
    },
    value: maxResults,
    description: "",
    onChange: setMaxResults
  }, ImagesCount.map(function (count) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoOption, {
      key: count,
      id: count,
      value: count,
      label: count
    });
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoButton, {
    disabled: !prompt,
    isBusy: busy,
    onClick: onSubmit
  }, "Generate Images"))), /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledTextField, {
    value: prompt,
    onBlur: setPrompt,
    style: {
      marginTop: 20
    }
  }), urls.length > 0 && /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledGallery, null, urls.map(function (url) {
    return /*#__PURE__*/React.createElement("img", {
      src: url,
      onClick: function onClick() {
        return setSelectedUrl(url);
      }
    });
  })), !urls.length && /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledGallery, null, /*#__PURE__*/React.createElement("div", {
    "class": "empty-image"
  }), /*#__PURE__*/React.createElement("div", {
    "class": "empty-image"
  }), /*#__PURE__*/React.createElement("div", {
    "class": "empty-image"
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoColumn, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoContainer, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Settings"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoCheckbox, {
    id: "continuous_mode ",
    label: "Continuous",
    value: "1",
    checked: continuousMode,
    description: "New images will be added to the already generated images.",
    onChange: setContinuousMode
  })))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoModal, {
    isOpen: error,
    onRequestClose: function onRequestClose() {
      setError();
    },
    onOkClick: function onOkClick() {
      setError();
    },
    title: "Error",
    content: /*#__PURE__*/React.createElement("p", null, error)
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageGenerator);

/***/ }),

/***/ "./app/js/components/Playground.js":
/*!*****************************************!*\
  !*** ./app/js/components/Playground.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CommonStyles */ "./app/js/components/CommonStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _templateObject, _templateObject2, _templateObject3;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;


// NekoUI






var templates = [{
  id: 'none',
  name: 'None',
  mode: 'query',
  description: ''
}, {
  id: 'wp_assistant',
  name: 'WordPress Assistant',
  mode: 'chat',
  description: "Converse as a WordPress expert. Be helpful, friendly, concise, avoid external URLs and commercial solutions.\n\n      AI: Hi! How can I help you with WP today?"
}, {
  id: 'article_translator',
  name: 'Article Translator',
  mode: 'query',
  description: "Translate this article into French:\n\n      Uchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n\n"
}, {
  id: 'article_writer',
  name: 'Article Writer',
  mode: 'query',
  description: 'Write an article about what to do in Paris, in summer, with a few recommendations of restaurants and cafes.\n\n'
}, {
  id: 'bulk_articles_writer',
  name: 'Bulk Articles Writer',
  mode: 'query',
  description: "Write titles (TITLE: ) and very short paragraphs (CONTENT: ) for each following topic. Keywords for each topic will be added between parenthesis.\n\n      - When to travel to France (seasons, food, ambiance, celebrations)\n      - Why one should visit the French countryside (beach, forest, mountain, food, people)\n      - Story of a night at Mont Saint-Michel (hotel, ambiance, sea, light)\n      - Differences between South West and South East of France (people, food, beach, ambiance)\n"
}, {
  id: 'article_corrector',
  name: 'Article Corrector',
  mode: 'query',
  description: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n'
}, {
  id: 'seo_assistant',
  name: 'SEO Assistant',
  mode: 'query',
  description: "For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:\n\n      Title: \n      Keywords: \n      Excerpt: \n      \n      Uchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n    "
}];
var StyledTextArea = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].textarea(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: block;\n  height: 460px;\n  width: 100%;\n  margin-bottom: 10px;\n  background: #333d4e;\n  border-radius: 5px;\n  border: none;\n  color: #d1d5dc;\n  font-size: 14px;\n  font-family: monospace;\n  padding: 20px;\n"])));
var StyledSidebar = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  background: white;\n  padding: 15px;\n  border-radius: 5px;\n\n  h3:first-child {\n    margin-top: 0;\n  }\n\n  label {\n    display: block;\n    margin-bottom: 5px;\n  }\n\n  label {\n    margin-top: 10px;\n  }\n\n  li {\n    margin-bottom: 10px;\n    border: 1px solid #e5e5e5;\n    padding: 10px;\n    background: #f5f5f5;\n    border-radius: 5px;\n    cursor: pointer;\n    transition: all 0.2s ease-in-out;\n  }\n\n  li.active {\n    background: #037cba;\n    color: white;\n    border-color: #037cba;\n  }\n"])));
var StyledNekoInput = (0,styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoInput)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  flex: auto !important;\n\n  input {\n    height: 50px !important;\n    font-size: 14px !important;\n    font-family: monospace !important;\n    padding: 20px 20px 20px 45px !important;\n    border-color: #333d4e !important;\n    background: #333d4e !important;\n    color: white !important;\n  }\n"])));
var Dashboard = function Dashboard() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    prompt = _useState4[0],
    setPrompt = _useState4[1];
  var _useState5 = useState('chat'),
    _useState6 = _slicedToArray(_useState5, 2),
    mode = _useState6[0],
    setMode = _useState6[1];
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    entry = _useState8[0],
    setEntry = _useState8[1];
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.useModels)(_app_settings__WEBPACK_IMPORTED_MODULE_3__.options),
    models = _useModels.models,
    model = _useModels.model,
    setModel = _useModels.setModel;
  var _useState9 = useState(1),
    _useState10 = _slicedToArray(_useState9, 2),
    temperature = _useState10[0],
    setTemperature = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    busy = _useState12[0],
    setBusy = _useState12[1];
  var _useState13 = useState({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    sessionUsage = _useState14[0],
    setSessionUsage = _useState14[1];
  var _useState15 = useState({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    lastUsage = _useState16[0],
    setLastUsage = _useState16[1];
  var _useState17 = useState(templates[1]),
    _useState18 = _slicedToArray(_useState17, 2),
    template = _useState18[0],
    setTemplate = _useState18[1];
  var onValidateEntry = function onValidateEntry() {
    var newPrompt = prompt + "\nHuman: " + entry;
    setPrompt(newPrompt);
    setEntry("");
    onSubmitPrompt(newPrompt);
  };
  useEffect(function () {
    var desc = template.description;
    var lines = desc.split('\n').map(function (line) {
      return line.trim();
    });
    lines = lines.join('\n');
    setPrompt(lines);
    setMode(template.mode);
  }, [template]);
  var onResetUsage = function onResetUsage() {
    setSessionUsage({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    });
    setLastUsage({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    });
  };
  var onSubmitPrompt = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var promptToUse,
        res,
        newSessionUsage,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            promptToUse = _args.length > 0 && _args[0] !== undefined ? _args[0] : prompt;
            console.log('onSubmitPrompt', {
              promptToUse: promptToUse
            });
            setBusy(true);
            _context.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_3__.apiUrl, "/make_completions"), {
              json: {
                prompt: promptToUse,
                temperature: temperature,
                model: model
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_3__.restNonce
            });
          case 5:
            res = _context.sent;
            console.log("Completions", {
              prompt: promptToUse,
              result: res
            });
            if (res.success) {
              setPrompt(promptToUse + '\n' + res.data);
              setLastUsage(res.usage);
              newSessionUsage = {
                prompt_tokens: sessionUsage.prompt_tokens + res.usage.prompt_tokens,
                completion_tokens: sessionUsage.completion_tokens + res.usage.completion_tokens,
                total_tokens: sessionUsage.total_tokens + res.usage.total_tokens
              };
              setSessionUsage(newSessionUsage);
            } else {
              setError(res.message);
            }
            setBusy(false);
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onSubmitPrompt() {
      return _ref.apply(this, arguments);
    };
  }();
  var _useMemo = useMemo(function () {
      var sessionPrice = 0;
      var lastRequestPrice = 0;
      var modelPrice = _constants__WEBPACK_IMPORTED_MODULE_5__.OpenAI_PricingPerModel.find(function (x) {
        return model && model.includes(x.model);
      });
      if (modelPrice) {
        sessionPrice = (sessionUsage.total_tokens / 1000 * modelPrice.price).toFixed(4);
        lastRequestPrice = (lastUsage.total_tokens / 1000 * modelPrice.price).toFixed(4);
      }
      return {
        sessionPrice: sessionPrice,
        lastRequestPrice: lastRequestPrice
      };
    }, [sessionUsage, lastUsage]),
    sessionPrice = _useMemo.sessionPrice,
    lastRequestPrice = _useMemo.lastRequestPrice;
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoPage, {
    nekoErrors: []
  }, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_7__.AiNekoHeader, {
    title: "Playground"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoWrapper, null, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_2__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_3__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoContainer, {
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTypo, {
    p: true
  }, "Welcome to the AI Playground! Here, you can play with different AI models and ask the UI to perform various tasks for you. You can ask it to write, rewrite, or translate an article, categorize words or elements into groups, write an email, etc. ", /*#__PURE__*/React.createElement("b", null, "Let me know if there are any new features you would like to see!"), " Have fun \uD83E\uDD73"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, null, /*#__PURE__*/React.createElement(StyledSidebar, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 0
    }
  }, "Templates"), /*#__PURE__*/React.createElement("ul", null, templates.map(function (x) {
    return /*#__PURE__*/React.createElement("li", {
      className: template.id === x.id ? 'active' : '',
      onClick: function onClick() {
        setTemplate(x);
      }
    }, x.name);
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 0
    }
  }, "Mode"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    scrolldown: true,
    id: "mode",
    name: "mode",
    disabled:  true || 0,
    value: mode,
    description: "",
    onChange: setMode
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: "chat",
    id: "chat",
    value: "chat",
    label: "Chat"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
    key: "query",
    id: "query",
    value: "query",
    label: "Query"
  })))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, {
    style: {
      flex: 3
    }
  }, /*#__PURE__*/React.createElement(StyledTextArea, {
    onChange: function onChange(e) {
      setPrompt(e.target.value);
    },
    value: prompt
  }), mode === 'chat' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "class": "dashicons dashicons-format-chat",
    style: {
      position: 'absolute',
      color: 'white',
      zIndex: 200,
      fontSize: 28,
      marginTop: 12,
      marginLeft: 10
    }
  }), /*#__PURE__*/React.createElement(StyledNekoInput, {
    id: "entry",
    value: entry,
    onChange: setEntry,
    onEnter: onValidateEntry,
    disabled: busy
  })), mode !== 'chat' && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    onClick: function onClick() {
      onSubmitPrompt();
    },
    disabled: busy,
    style: {
      height: 50,
      fontSize: 18,
      width: '100%'
    }
  }, "Submit")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, null, /*#__PURE__*/React.createElement(StyledSidebar, null, /*#__PURE__*/React.createElement("h3", null, "Settings"), /*#__PURE__*/React.createElement("label", null, "Model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSelect, {
    id: "models",
    value: model,
    scrolldown: true,
    onChange: setModel
  }, models.map(function (x) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoOption, {
      value: x.id,
      label: x.name
    });
  })), /*#__PURE__*/React.createElement("label", null, "Temperature:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoInput, {
    id: "temperature",
    name: "temperature",
    value: temperature,
    type: "number",
    onChange: setTemperature,
    onBlur: setTemperature,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red'
      }
    }, "Between 0 and 1."), " Higher values means the model will take more risks.")
  })), /*#__PURE__*/React.createElement(StyledSidebar, {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Usage"), /*#__PURE__*/React.createElement("p", null, "Keeps track of the current usage of the AI."), /*#__PURE__*/React.createElement("h4", null, "Session"), /*#__PURE__*/React.createElement("div", null, "Tokens: ", sessionUsage.total_tokens), /*#__PURE__*/React.createElement("div", null, "Price: $", sessionPrice), /*#__PURE__*/React.createElement("h4", null, "Last Request"), /*#__PURE__*/React.createElement("div", null, "Tokens: ", lastUsage.total_tokens), /*#__PURE__*/React.createElement("div", null, "Price: $", lastRequestPrice), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    style: {
      marginTop: 10,
      width: '100%'
    },
    onClick: onResetUsage
  }, "Reset Usage")))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoModal, {
    isOpen: error,
    onRequestClose: function onRequestClose() {
      setError();
    },
    onOkClick: function onOkClick() {
      setError();
    },
    title: "Error",
    content: /*#__PURE__*/React.createElement("p", null, error)
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dashboard);

/***/ }),

/***/ "./app/js/components/PostsListTools.js":
/*!*********************************************!*\
  !*** ./app/js/components/PostsListTools.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modals/GenerateTitles */ "./app/js/components/modals/GenerateTitles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;

// NekoUI



// AI Engine


var PostsListTools = function PostsListTools() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    post = _useState2[0],
    setPost = _useState2[1];
  useEffect(function () {
    document.querySelectorAll('.mwai-link-title').forEach(function (item) {
      var postId = item.getAttribute('data-id');
      var postTitle = item.getAttribute('data-title');
      item.addEventListener('click', function () {
        setPost({
          postId: postId,
          postTitle: postTitle
        });
      }, false);
    });
  }, []);
  var onTitleClick = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(title) {
      var res, tr, rowTitle, hiddenTitle;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/update_post_title"), {
              json: {
                postId: post.postId,
                title: title
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 2:
            res = _context.sent;
            if (res.success) {
              _context.next = 7;
              break;
            }
            throw new Error(res.message);
          case 7:
            setPost();
            // Look for the element tr[id="post-123"] and update the title
            tr = document.querySelector("tr[id=\"post-".concat(post.postId, "\"]"));
            if (tr) {
              rowTitle = tr.querySelector('.row-title');
              if (rowTitle) {
                rowTitle.innerHTML = title;
              }
            }
            // Also update the element .hidden .post_title
            hiddenTitle = tr.querySelector(".hidden .post_title");
            if (hiddenTitle) {
              hiddenTitle.innerHTML = title;
            }
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onTitleClick(_x2) {
      return _ref.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoWrapper, null, /*#__PURE__*/React.createElement(_modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_3__["default"], {
    post: post,
    onTitleClick: onTitleClick,
    onClose: function onClose() {
      setPost();
    }
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PostsListTools);

/***/ }),

/***/ "./app/js/components/Settings.js":
/*!***************************************!*\
  !*** ./app/js/components/Settings.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Settings.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/CheckboxGroup.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/tabs/Tabs.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Block.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CommonStyles */ "./app/js/components/CommonStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var useState = wp.element.useState;

// NekoUI






var isImageModel = function isImageModel(model) {
  return model === "dall-e";
};
var Settings = function Settings() {
  var _useState = useState(_app_settings__WEBPACK_IMPORTED_MODULE_0__.options),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setOptions = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busyAction = _useState4[0],
    setBusyAction = _useState4[1];
  var busy = busyAction;
  var module_titles = options === null || options === void 0 ? void 0 : options.module_titles;
  var module_excerpts = options === null || options === void 0 ? void 0 : options.module_excerpts;
  var module_blocks = options === null || options === void 0 ? void 0 : options.module_blocks;
  var shortcode_chat = options === null || options === void 0 ? void 0 : options.shortcode_chat;
  var shortcode_chat_style = options === null || options === void 0 ? void 0 : options.shortcode_chat_style;
  var shortcode_chat_formatting = options === null || options === void 0 ? void 0 : options.shortcode_chat_formatting;
  var openai_apikey = options !== null && options !== void 0 && options.openai_apikey ? options === null || options === void 0 ? void 0 : options.openai_apikey : '';
  var openai_usage = options === null || options === void 0 ? void 0 : options.openai_usage;
  var extra_models = options === null || options === void 0 ? void 0 : options.extra_models;
  var updateOption = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(value, id) {
      var newOptions, response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            newOptions = _objectSpread(_objectSpread({}, options), {}, _defineProperty({}, id, value));
            setBusyAction(true);
            _context.prev = 2;
            _context.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.apiUrl, "/update_option"), {
              json: {
                options: newOptions
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce
            });
          case 5:
            response = _context.sent;
            if (response.success) {
              setOptions(response.options);
            }
            _context.next = 12;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            if (_context.t0.message) {
              alert(_context.t0.message);
            }
          case 12:
            _context.prev = 12;
            setBusyAction(false);
            return _context.finish(12);
          case 15:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 9, 12, 15]]);
    }));
    return function updateOption(_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  /**
   * Settings
   */

  var jsxAiFeatures = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Assistants"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "module_titles",
    label: "Titles",
    value: "1",
    checked: module_titles,
    description: "Create a choice of titles based on your content.",
    onChange: updateOption
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "module_excerpts",
    label: "Excerpt",
    value: "1",
    checked: module_excerpts,
    description: "Create a choice of excerpts based on your content.",
    onChange: updateOption
  })));
  var jsxAiBlocks = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Blocks"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "module_blocks",
    label: "Enable (Coming soon)",
    disabled: true,
    value: "1",
    checked: module_blocks,
    description: "Add Gutenberg AI Blocks in the editor. They will allow you to easily create content with AI.",
    onChange: updateOption
  })));
  var jsxShortcodes = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Shortcodes"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "shortcode_chat",
    label: "Chatbot",
    value: "1",
    checked: shortcode_chat,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Create a chatbot similar to ChatGPT with a shortcode:", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "[mwai_chat context=\"Converse as if you were Michael Jackson, talking from the afterlife.\" ai_name=\"Michael: \" user_name=\"You: \" start_sentence=\"Hi, my friend.\"]", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "You can also add temperature (between 0 and 1, default is 0.8) and a model (default is text-davinci-003, but you can try text-babbage-001 and the others)."),
    onChange: updateOption
  })));
  var jsxShortcodeStyle = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Styles"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "shortcode_chat_style",
    label: "Enable",
    value: "1",
    checked: shortcode_chat_style,
    description: "The chatbot will look like a bit similar to ChatGPT.",
    onChange: updateOption
  })));
  var jsxShortcodeFormatting = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Formatting"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoCheckbox, {
    id: "shortcode_chat_formatting",
    label: "Enable",
    value: "1",
    checked: shortcode_chat_formatting,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Convert the reply from the AI into HTML.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Markdown is supported, so it is highly recommended to add 'Use Markdown.' in your context.")),
    onChange: updateOption
  })));
  var jsxExtraModels = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Extra Models"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoInput, {
    id: "extra_models",
    name: "extra_models",
    value: extra_models,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "You can enter additional models you would like to use (separated by a comma), including your fine-tuned models. This option is beta and will be modified/enhanced later."),
    onBlur: updateOption
  }));
  var jsxOpenAiApiKey = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "API Key"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoInput, {
    id: "openai_apikey",
    name: "openai_apikey",
    value: openai_apikey,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "You can get your API Keys in your ", /*#__PURE__*/React.createElement("a", {
      href: "https://beta.openai.com/account/api-keys",
      target: "_blank"
    }, "OpenAI Account"), "."),
    onBlur: updateOption
  }));
  var jsxOpenAiUsage = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSettings, {
    title: "Usage"
  }, !Object.keys(openai_usage).length && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoTypo, {
    p: true
  }, "N/A"), openai_usage && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", {
    style: {
      marginTop: 2
    }
  }, Object.keys(openai_usage).map(function (month, index) {
    var monthUsage = openai_usage[month];
    return /*#__PURE__*/React.createElement("li", {
      key: index
    }, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDDD3\uFE0F ", month), /*#__PURE__*/React.createElement("ul", null, Object.keys(monthUsage).map(function (model, index) {
      var modelUsage = monthUsage[model];
      var price = null;
      var modelPrice = _constants__WEBPACK_IMPORTED_MODULE_7__.OpenAI_PricingPerModel.find(function (x) {
        return model.includes(x.model);
      });
      if (modelPrice) {
        if (isImageModel(model)) {
          price = (modelUsage.images * modelPrice.price).toFixed(2);
        } else {
          price = (modelUsage.total_tokens / 1000 * modelPrice.price).toFixed(2);
        }
      }
      return /*#__PURE__*/React.createElement("li", {
        key: index,
        style: {
          marginTop: 10,
          marginLeft: 10
        }
      }, isImageModel(model) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "\u2022 Model: ", model), /*#__PURE__*/React.createElement("ul", {
        style: {
          marginTop: 5,
          marginLeft: 5
        }
      }, /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCB0 Images:\xA0", /*#__PURE__*/React.createElement("b", null, modelUsage.images), " ", price && /*#__PURE__*/React.createElement(React.Fragment, null, " = ", /*#__PURE__*/React.createElement("b", null, price, "$"))))), !isImageModel(model) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "\u2022 Model: ", model), /*#__PURE__*/React.createElement("ul", {
        style: {
          marginTop: 5,
          marginLeft: 5
        }
      }, /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCB0 Tokens:\xA0", /*#__PURE__*/React.createElement("b", null, modelUsage.total_tokens), " ", price && /*#__PURE__*/React.createElement(React.Fragment, null, " = ", /*#__PURE__*/React.createElement("b", null, price, "$"))))));
    })));
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#A0A0A0'
    }
  }, "This is only given as an indication. For the exact amounts, please check your ", /*#__PURE__*/React.createElement("a", {
    href: "https://beta.openai.com/account/usage",
    target: "_blank"
  }, "Usage at OpenAI"), "."));
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoPage, null, /*#__PURE__*/React.createElement(_CommonStyles__WEBPACK_IMPORTED_MODULE_9__.AiNekoHeader, null), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoWrapper, null, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_11__.OptionsCheck, {
    options: options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoContainer, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoTypo, {
    p: true
  }, "Boost your WordPress with AI! Currently, it only proposes titles and excerpts for your posts, and keep track of your OpenAI usage statistics. There is also a Playground which allows you to have a discussion with the AI, or ask it to complete some tasks. Little by little, and through your feedback, many tools will be added to AI Engine, and an API will be available so that other plugins can use it.")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTabs, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "Settings"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Modules",
    className: "primary"
  }, jsxAiFeatures, jsxAiBlocks, jsxShortcodes, jsxExtraModels)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Open AI",
    className: "primary"
  }, jsxOpenAiApiKey, jsxOpenAiUsage)))), shortcode_chat && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "Chatbot"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Chatbot",
    className: "primary"
  }, jsxShortcodeStyle, jsxShortcodeFormatting))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Settings);

/***/ }),

/***/ "./app/js/components/SlotFills.js":
/*!****************************************!*\
  !*** ./app/js/components/SlotFills.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modals/GenerateTitles */ "./app/js/components/modals/GenerateTitles.js");
/* harmony import */ var _modals_GenerateExcerpts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modals/GenerateExcerpts */ "./app/js/components/modals/GenerateExcerpts.js");
/* harmony import */ var _AiIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AiIcon */ "./app/js/components/AiIcon.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;
var __ = wp.i18n.__;
var registerPlugin = wp.plugins.registerPlugin;
var Button = wp.components.Button;
var _wp$editPost = wp.editPost,
  PluginDocumentSettingPanel = _wp$editPost.PluginDocumentSettingPanel,
  PluginBlockSettingsMenuItem = _wp$editPost.PluginBlockSettingsMenuItem;

// NekoUI


// UI Engine




// SlotFills Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/

// Plugin Block Settings Menu Item Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-block-settings-menu-item/

var doOnClick = function doOnClick() {
  alert("Coming soon! Let me know your feedback and ideas, I will make this awesome for you.");
};

// Paragraph Block: Menu

var MWAI_ParagraphBlock_Menu_Generate = function MWAI_ParagraphBlock_Menu_Generate() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PluginBlockSettingsMenuItem, {
    allowedBlocks: ['core/paragraph'],
    icon: /*#__PURE__*/React.createElement(_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
      icon: "wand",
      style: {
        marginRight: 0
      }
    }),
    label: /*#__PURE__*/React.createElement(React.Fragment, null, " ", __('Enhance text')),
    onClick: doOnClick
  }), /*#__PURE__*/React.createElement(PluginBlockSettingsMenuItem, {
    allowedBlocks: ['core/paragraph'],
    icon: /*#__PURE__*/React.createElement(_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
      icon: "wand",
      style: {
        marginRight: 0
      }
    }),
    label: /*#__PURE__*/React.createElement(React.Fragment, null, " ", __('Translate text')),
    onClick: doOnClick
  }));
};
registerPlugin('ai-engine-menu-paragraph-generate', {
  render: MWAI_ParagraphBlock_Menu_Generate
});

// Document Settings: Panel

var MWAI_DocumentSettings = function MWAI_DocumentSettings() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    postForTitle = _useState2[0],
    setPostForTitle = _useState2[1];
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    postForExcerpt = _useState4[0],
    setPostForExcerpt = _useState4[1];
  var onTitlesModalOpen = function onTitlesModalOpen() {
    var _wp$data$select = wp.data.select("core/editor"),
      getCurrentPost = _wp$data$select.getCurrentPost;
    var _getCurrentPost = getCurrentPost(),
      id = _getCurrentPost.id,
      title = _getCurrentPost.title,
      excerpt = _getCurrentPost.excerpt;
    setPostForTitle({
      postId: id,
      postTitle: title
    });
  };
  var onExcerptsModalOpen = function onExcerptsModalOpen() {
    var _wp$data$select2 = wp.data.select("core/editor"),
      getCurrentPost = _wp$data$select2.getCurrentPost;
    var _getCurrentPost2 = getCurrentPost(),
      id = _getCurrentPost2.id,
      title = _getCurrentPost2.title,
      excerpt = _getCurrentPost2.excerpt;
    setPostForExcerpt({
      postId: id,
      postTitle: title
    });
  };
  var onTitleClick = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(title) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            wp.data.dispatch('core/editor').editPost({
              title: title
            });
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onTitleClick(_x2) {
      return _ref.apply(this, arguments);
    };
  }();
  var onExcerptClick = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(excerpt) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            wp.data.dispatch('core/editor').editPost({
              excerpt: excerpt
            });
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function onExcerptClick(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(PluginDocumentSettingPanel, {
    name: "mwai-document-settings",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], null), " AI Engine"),
    className: "mwai-document-settings"
  }, /*#__PURE__*/React.createElement("p", null, "Generate:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onTitlesModalOpen,
    style: {
      flex: 1,
      marginRight: 10
    }
  }, /*#__PURE__*/React.createElement(_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
    icon: "wand",
    style: {
      marginRight: 8
    }
  }), " Titles"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onExcerptsModalOpen,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
    icon: "wand",
    style: {
      marginRight: 8
    }
  }), " Excerpts")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoWrapper, null, /*#__PURE__*/React.createElement(_modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_2__["default"], {
    post: postForTitle,
    onTitleClick: onTitleClick,
    onClose: setPostForTitle
  }), /*#__PURE__*/React.createElement(_modals_GenerateExcerpts__WEBPACK_IMPORTED_MODULE_3__["default"], {
    post: postForExcerpt,
    onExcerptClick: onExcerptClick,
    onClose: setPostForExcerpt
  })));
};
var setUISlotFill = function setUISlotFill() {
  registerPlugin('ai-engine-document-settings', {
    render: MWAI_DocumentSettings
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setUISlotFill);

/***/ }),

/***/ "./app/js/components/modals/GenerateExcerpts.js":
/*!******************************************************!*\
  !*** ./app/js/components/modals/GenerateExcerpts.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Spinner.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _ModalStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModalStyles */ "./app/js/components/modals/ModalStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;

// NekoUI



// AI Engine


var GenerateExcerptsModal = function GenerateExcerptsModal(props) {
  var post = props.post,
    _props$onExcerptClick = props.onExcerptClick,
    onExcerptClick = _props$onExcerptClick === void 0 ? {} : _props$onExcerptClick,
    _props$onClose = props.onClose,
    onClose = _props$onClose === void 0 ? {} : _props$onClose;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    excerpts = _useState2[0],
    setExcerpts = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busy = _useState4[0],
    setBusy = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  useEffect(function () {
    if (post) {
      fetchExcerpts(post);
    }
  }, [post]);
  var fetchExcerpts = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
      var postId, res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            postId = _ref.postId;
            setBusy(true);
            _context.next = 4;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_excerpts"), {
              json: {
                postId: postId
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 4:
            res = _context.sent;
            if (res.success) {
              setExcerpts(res.data);
            }
            setBusy(false);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function fetchExcerpts(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var _onClick = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(title) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            _context2.prev = 1;
            _context2.next = 4;
            return onExcerptClick(title);
          case 4:
            cleanClose();
            _context2.next = 10;
            break;
          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](1);
            setError(_context2.t0.message);
          case 10:
            setBusy(false);
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 7]]);
    }));
    return function onClick(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
  var cleanClose = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            onClose();
            setExcerpts([]);
            setError();
            setBusy(false);
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function cleanClose() {
      return _ref4.apply(this, arguments);
    };
  }();
  var content = useMemo(function () {
    if (busy) {
      return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSpinner, {
        type: "circle",
        size: "10%"
      });
    } else if (error) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Error: ", error);
    } else if ((excerpts === null || excerpts === void 0 ? void 0 : excerpts.length) > 0) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Pick a new excerpt by clicking on it.", /*#__PURE__*/React.createElement(_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.ResultsContainer, null, excerpts.map(function (x) {
        return /*#__PURE__*/React.createElement(_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.Result, {
          key: x,
          onClick: function onClick() {
            _onClick(x);
          }
        }, x);
      })));
    } else {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Nothing to display.");
    }
  }, [busy, excerpts, error]);
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoModal, {
    isOpen: post,
    onRequestClose: cleanClose,
    title: "New excerpt for \"".concat(post === null || post === void 0 ? void 0 : post.postTitle, "\""),
    content: content,
    ok: "Close",
    onOkClick: cleanClose
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GenerateExcerptsModal);

/***/ }),

/***/ "./app/js/components/modals/GenerateTitles.js":
/*!****************************************************!*\
  !*** ./app/js/components/modals/GenerateTitles.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Spinner.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _ModalStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModalStyles */ "./app/js/components/modals/ModalStyles.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;

// NekoUI



// AI Engine


var GenerateTitlesModal = function GenerateTitlesModal(props) {
  var post = props.post,
    _props$onTitleClick = props.onTitleClick,
    onTitleClick = _props$onTitleClick === void 0 ? {} : _props$onTitleClick,
    _props$onClose = props.onClose,
    onClose = _props$onClose === void 0 ? {} : _props$onClose;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    titles = _useState2[0],
    setTitles = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busy = _useState4[0],
    setBusy = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  useEffect(function () {
    if (post) {
      fetchTitles(post);
    }
  }, [post]);
  var fetchTitles = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
      var postId, postTitle, res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            postId = _ref.postId, postTitle = _ref.postTitle;
            setBusy(true);
            _context.next = 4;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.postFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_titles"), {
              json: {
                postId: postId
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 4:
            res = _context.sent;
            if (res.success) {
              setTitles(res.data);
            }
            setBusy(false);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function fetchTitles(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var _onClick = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(title) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            _context2.prev = 1;
            _context2.next = 4;
            return onTitleClick(title);
          case 4:
            cleanClose();
            _context2.next = 10;
            break;
          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](1);
            setError(_context2.t0.message);
          case 10:
            setBusy(false);
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 7]]);
    }));
    return function onClick(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
  var cleanClose = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            onClose();
            setTitles([]);
            setError();
            setBusy(false);
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function cleanClose() {
      return _ref4.apply(this, arguments);
    };
  }();
  var content = useMemo(function () {
    if (busy) {
      return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoSpinner, {
        type: "circle",
        size: "10%"
      });
    } else if (error) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Error: ", error);
    } else if ((titles === null || titles === void 0 ? void 0 : titles.length) > 0) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Pick a new title by clicking on it.", /*#__PURE__*/React.createElement(_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.ResultsContainer, null, titles.map(function (x) {
        return /*#__PURE__*/React.createElement(_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.Result, {
          key: x,
          onClick: function onClick() {
            _onClick(x);
          }
        }, x);
      })));
    } else {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Nothing to display.");
    }
  }, [busy, titles, error]);
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoModal, {
    isOpen: post,
    onRequestClose: cleanClose,
    title: "New title for \"".concat(post === null || post === void 0 ? void 0 : post.postTitle, "\""),
    content: content,
    ok: "Close",
    onOkClick: cleanClose
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GenerateTitlesModal);

/***/ }),

/***/ "./app/js/components/modals/ModalStyles.js":
/*!*************************************************!*\
  !*** ./app/js/components/modals/ModalStyles.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Result": () => (/* binding */ Result),
/* harmony export */   "ResultsContainer": () => (/* binding */ ResultsContainer)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
var _templateObject, _templateObject2;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ResultsContainer = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-bottom: 5px;\n"])));
var Result = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-top: 15px;\n  padding: 15px;\n  font-size: 14px;\n  cursor: pointer;\n  border-radius: 15px;\n  background: #dbf2ff;\n  line-height: 120%;\n\n  &:hover {\n    background: #037cba;\n    color: white;\n  }\n"])));


/***/ }),

/***/ "./app/js/constants.js":
/*!*****************************!*\
  !*** ./app/js/constants.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Languages": () => (/* binding */ Languages),
/* harmony export */   "OpenAI_PricingPerModel": () => (/* binding */ OpenAI_PricingPerModel),
/* harmony export */   "OpenAI_models": () => (/* binding */ OpenAI_models),
/* harmony export */   "WritingStyles": () => (/* binding */ WritingStyles),
/* harmony export */   "WritingTones": () => (/* binding */ WritingTones)
/* harmony export */ });
var OpenAI_models = [{
  id: 'text-davinci-003',
  name: 'text-davinci-003',
  description: 'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.',
  strength: 'Complex intent, cause and effect, summarization for audience'
}, {
  id: 'text-curie-001',
  name: 'text-curie-001',
  description: 'Very capable, but faster and lower cost than Davinci.',
  strength: 'Language translation, complex classification, text sentiment, summarization'
}, {
  id: 'text-babbage-001',
  name: 'text-babbage-001',
  description: 'Capable of straightforward tasks, very fast, and lower cost.',
  strength: 'Moderate classification, semantic search classification'
}, {
  id: 'text-ada-001',
  name: 'text-ada-001',
  description: 'Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.',
  strength: 'Parsing text, simple classification, address correction, keywords'
}, {
  id: 'code-davinci-002',
  name: 'code-davinci-002',
  description: 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.'
}
// {
//   id: 'code-cushman-001',
//   name: 'code-cushman-001',
//   description: 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.',
// }
];

var Languages = [{
  value: 'en',
  label: 'English'
}, {
  value: 'es',
  label: 'Spanish'
}, {
  value: 'fr',
  label: 'French'
}, {
  value: 'de',
  label: 'German'
}, {
  value: 'it',
  label: 'Italian'
}, {
  value: 'pt',
  label: 'Portuguese'
}, {
  value: 'ru',
  label: 'Russian'
}, {
  value: 'ja',
  label: 'Japanese'
}, {
  value: 'zh',
  label: 'Chinese'
}];
var OpenAI_PricingPerModel = [{
  model: 'davinci',
  price: 0.02
}, {
  model: 'curie',
  price: 0.002
}, {
  model: 'babbage',
  price: 0.0005
}, {
  model: 'ada',
  price: 0.0004
}, {
  model: 'dall-e',
  price: 0.02
}];
var WritingStyles = [{
  value: 'informative',
  label: 'Informative'
}, {
  value: 'descriptive',
  label: 'Descriptive'
}, {
  value: 'creative',
  label: 'Creative'
}, {
  value: 'narrative',
  label: 'Narrative'
}, {
  value: 'persuasive',
  label: 'Persuasive'
}, {
  value: 'reflective',
  label: 'Reflective'
}, {
  value: 'argumentative',
  label: 'Argumentative'
}, {
  value: 'analytical',
  label: 'Analytical'
}, {
  value: 'evaluative',
  label: 'Evaluative'
}, {
  value: 'journalistic',
  label: 'Journalistic'
}, {
  value: 'technical',
  label: 'Technical'
}];
var WritingTones = [{
  value: 'neutral',
  label: 'Neutral'
}, {
  value: 'formal',
  label: 'Formal'
}, {
  value: 'assertive',
  label: 'Assertive'
}, {
  value: 'cheerful',
  label: 'Cheerful'
}, {
  value: 'humorous',
  label: 'Humorous'
}, {
  value: 'informal',
  label: 'Informal'
}, {
  value: 'inspirational',
  label: 'Inspirational'
}, {
  value: 'professional',
  label: 'Professional'
}, {
  value: 'confvalueent',
  label: 'Confvalueent'
}, {
  value: 'emotional',
  label: 'Emotional'
}, {
  value: 'persuasive',
  label: 'Persuasive'
}, {
  value: 'supportive',
  label: 'Supportive'
}, {
  value: 'sarcastic',
  label: 'Sarcastic'
}, {
  value: 'condescending',
  label: 'Condescending'
}, {
  value: 'skeptical',
  label: 'Skeptical'
}, {
  value: 'narrative',
  label: 'Narrative'
}, {
  value: 'journalistic',
  label: 'Journalistic'
}];


/***/ }),

/***/ "./app/js/helpers.js":
/*!***************************!*\
  !*** ./app/js/helpers.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OptionsCheck": () => (/* binding */ OptionsCheck),
/* harmony export */   "cleanNumbering": () => (/* binding */ cleanNumbering),
/* harmony export */   "useModels": () => (/* binding */ useModels)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./app/js/constants.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect,
  useState = _wp$element.useState;


var OptionsCheck = function OptionsCheck(_ref) {
  var options = _ref.options;
  var openai_apikey = options.openai_apikey;
  var valid_key = openai_apikey && openai_apikey.length > 0;
  if (valid_key) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_0__.NekoColumn, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoMessageDanger, null, "To use the features of AI Engine, you need to have an OpenAI account and create an API Key. Visit the ", /*#__PURE__*/React.createElement("a", {
    href: "https://beta.openai.com/account/api-keys",
    target: "_blank"
  }, "OpenAI"), " website."));
};
function cleanNumbering(text) {
  var lines = text.split('\n');
  var cleanedLines = lines.map(function (line) {
    line = line.replace(/^\d+\.\s/, '');
    if (line.startsWith('"')) {
      line = line.slice(1);
      if (line.endsWith('"')) {
        line = line.slice(0, -1);
      }
    }
    return line;
  });
  return cleanedLines.join('\n');
}
var useModels = function useModels(options) {
  var _useState = useState(_constants__WEBPACK_IMPORTED_MODULE_2__.OpenAI_models[0].value),
    _useState2 = _slicedToArray(_useState, 2),
    model = _useState2[0],
    setModel = _useState2[1];
  var models = useMemo(function () {
    var _extraModels;
    var extraModels = typeof (options === null || options === void 0 ? void 0 : options.extra_models) === 'string' ? options === null || options === void 0 ? void 0 : options.extra_models : "";
    extraModels = (_extraModels = extraModels) === null || _extraModels === void 0 ? void 0 : _extraModels.split(',').filter(function (x) {
      return x;
    });
    if (extraModels.length) {
      return [].concat(_toConsumableArray(_constants__WEBPACK_IMPORTED_MODULE_2__.OpenAI_models), _toConsumableArray(extraModels.map(function (x) {
        return {
          id: x,
          name: x,
          description: "Extra"
        };
      })));
    }
    return _constants__WEBPACK_IMPORTED_MODULE_2__.OpenAI_models;
  }, [options]);
  useEffect(function () {
    var defaultModel = models.find(function (x) {
      return x.name.includes('davinci');
    });
    if (defaultModel) {
      setModel(defaultModel.name);
    }
  }, [models]);
  return {
    model: model,
    models: models,
    setModel: setModel
  };
};


/***/ }),

/***/ "./app/js/index.js":
/*!*************************!*\
  !*** ./app/js/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @common */ "./common/js/dashboard/Dashboard.js");
/* harmony import */ var _app_components_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/components/Settings */ "./app/js/components/Settings.js");
/* harmony import */ var _app_components_Playground__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/components/Playground */ "./app/js/components/Playground.js");
/* harmony import */ var _components_PostsListTools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/PostsListTools */ "./app/js/components/PostsListTools.js");
/* harmony import */ var _components_ContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/ContentGenerator */ "./app/js/components/ContentGenerator.js");
/* harmony import */ var _components_ImageGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ImageGenerator */ "./app/js/components/ImageGenerator.js");
/* harmony import */ var _components_SlotFills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/SlotFills */ "./app/js/components/SlotFills.js");
var render = wp.element.render;

// Neko UI


// Components






document.addEventListener('DOMContentLoaded', function (event) {
  (0,_components_SlotFills__WEBPACK_IMPORTED_MODULE_0__["default"])();

  // Settings
  var settings = document.getElementById('mwai-admin-settings');
  if (settings) {
    render( /*#__PURE__*/React.createElement(_app_components_Settings__WEBPACK_IMPORTED_MODULE_1__["default"], null), settings);
  }

  // Content Generator
  var generator = document.getElementById('mwai-content-generator');
  if (generator) {
    render( /*#__PURE__*/React.createElement(_components_ContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"], null), generator);
  }

  // Image Generator
  var imgGen = document.getElementById('mwai-image-generator');
  if (imgGen) {
    render( /*#__PURE__*/React.createElement(_components_ImageGenerator__WEBPACK_IMPORTED_MODULE_3__["default"], null), imgGen);
  }

  // Dashboard
  var dashboard = document.getElementById('mwai-playground');
  if (dashboard) {
    render( /*#__PURE__*/React.createElement(_app_components_Playground__WEBPACK_IMPORTED_MODULE_4__["default"], null), dashboard);
  }

  // Admin Tools
  var postsListTools = document.getElementById('mwai-admin-postsList');
  if (postsListTools) {
    render( /*#__PURE__*/React.createElement(_components_PostsListTools__WEBPACK_IMPORTED_MODULE_5__["default"], null), postsListTools);
  }

  // Common
  var meowDashboard = document.getElementById('meow-common-dashboard');
  if (meowDashboard) {
    render( /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_6__.Dashboard, null), meowDashboard);
  }
});

/***/ }),

/***/ "./app/js/settings.js":
/*!****************************!*\
  !*** ./app/js/settings.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "apiUrl": () => (/* binding */ apiUrl),
/* harmony export */   "domain": () => (/* binding */ domain),
/* harmony export */   "isPro": () => (/* binding */ isPro),
/* harmony export */   "isRegistered": () => (/* binding */ isRegistered),
/* harmony export */   "options": () => (/* binding */ options),
/* harmony export */   "pluginUrl": () => (/* binding */ pluginUrl),
/* harmony export */   "prefix": () => (/* binding */ prefix),
/* harmony export */   "restNonce": () => (/* binding */ restNonce),
/* harmony export */   "restUrl": () => (/* binding */ restUrl)
/* harmony export */ });
var prefix = mwai_meow_plugin.prefix;
var domain = mwai_meow_plugin.domain;
var restUrl = mwai_meow_plugin.rest_url.replace(/\/+$/, "");
var apiUrl = mwai_meow_plugin.api_url.replace(/\/+$/, "");
var pluginUrl = mwai_meow_plugin.plugin_url.replace(/\/+$/, "");
var isPro = mwai_meow_plugin.is_pro === '1';
var isRegistered = isPro && mwai_meow_plugin.is_registered === '1';
var restNonce = mwai_meow_plugin.rest_nonce;
var options = mwai_meow_plugin.options;


/***/ }),

/***/ "./common/js/dashboard/Dashboard.js":
/*!******************************************!*\
  !*** ./common/js/dashboard/Dashboard.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dashboard": () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swr */ "./node_modules/swr/core/dist/index.mjs");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Settings.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/CheckboxGroup.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Header.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/tabs/Tabs.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Block.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _SpeedTester__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SpeedTester */ "./common/js/dashboard/SpeedTester.js");
/* harmony import */ var _Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dashboard.styled */ "./common/js/dashboard/Dashboard.styled.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect;


// NekoUI






if (!_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl || !_app_settings__WEBPACK_IMPORTED_MODULE_1__.restUrl || !_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl) {
  console.error("[@common/dashboard] apiUrl, restUrl and pluginUrl are mandatory.");
}
var CommonApiUrl = "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.restUrl, "/meow-common/v1");
var jsxTextStory = /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.TabText, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
  p: true
}, "Meow Apps is a suite of plugins for photography, imaging, optimization, and SEO, run by ", /*#__PURE__*/React.createElement("a", {
  target: "_blank",
  href: "https://offbeatjapan.org"
}, "Jordy Meow"), ", a photographer and developer in Japan. The goal is to improve and speed up your website. Learn more at ", /*#__PURE__*/React.createElement("a", {
  href: "http://meowapps.com",
  target: "_blank"
}, "Meow Apps"), "."));
var jsxTextPerformance = /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.TabText, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
  p: true
}, "\u2B50\uFE0F The ", /*#__PURE__*/React.createElement("b", null, "Empty Request Time"), " helps you analyzing the raw performance of your install by giving you the average time it takes to run an empty request to your server. You can try to disable some plugins then start this again to see how it modifies the results. Keep it absolutely under 2,000 ms! That said, I recommend it to keep it below 500ms."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
  p: true
}, "\u2B50\uFE0F ", /*#__PURE__*/React.createElement("b", null, "File Operation Time"), " creates a temporary size of 10MB every time."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
  p: true
}, "\u2B50\uFE0F ", /*#__PURE__*/React.createElement("b", null, "SQL Request Time"), " counts the number of posts. Those two should be very fast, and almost the same as the ", /*#__PURE__*/React.createElement("b", null, "Empty Request Time"), "."));
var jsxTextRecommendations = /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.TabText, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
  p: true
}, "Keep your WordPress install simple and efficient by using only necessary plugins and a reliable hosting service. Avoid trying to self-host unless you have professional experience. Follow best practices and stay up-to-date with the latest recommendations on the Meow Apps website.", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uD83D\uDC9C ", /*#__PURE__*/React.createElement("a", {
  href: "https://meowapps.com/tutorial-improve-seo-wordpress/",
  target: "_blank"
}, "SEO Checklist & Optimization")), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDC9C ", /*#__PURE__*/React.createElement("a", {
  href: "https://meowapps.com/tutorial-faster-wordpress-optimize/",
  target: "_blank"
}, "Optimize your WordPress Speed")), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDC9C ", /*#__PURE__*/React.createElement("a", {
  href: "https://meowapps.com/tutorial-optimize-images-wordpress/",
  target: "_blank"
}, "Optimize Images (CDN, and so on)")), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDC9C ", /*#__PURE__*/React.createElement("a", {
  href: "https://meowapps.com/tutorial-hosting-service-wordpress/",
  target: "_blank"
}, "The Best Hosting Services for WordPress")))));
var swrAllSettingsKey = ["".concat(CommonApiUrl, "/all_settings/"), {
  headers: {
    'X-WP-Nonce': _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
  }
}];
var Dashboard = function Dashboard() {
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    fatalError = _useState2[0],
    setFatalError = _useState2[1];
  var _useSWR = (0,swr__WEBPACK_IMPORTED_MODULE_0__["default"])(swrAllSettingsKey, _neko_ui__WEBPACK_IMPORTED_MODULE_4__.jsonFetcher),
    swrSettings = _useSWR.data,
    mutateSwrSettings = _useSWR.mutate,
    swrError = _useSWR.error;
  var settings = swrSettings === null || swrSettings === void 0 ? void 0 : swrSettings.data;
  var hide_meowapps = settings === null || settings === void 0 ? void 0 : settings.meowapps_hide_meowapps;
  var force_sslverify = settings === null || settings === void 0 ? void 0 : settings.force_sslverify;
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busy = _useState4[0],
    setBusy = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    phpErrorLogs = _useState6[0],
    setPhpErrorLogs = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    phpInfo = _useState8[0],
    setPhpInfo = _useState8[1];

  // Handle SWR errors
  useEffect(function () {
    if (swrError && !fatalError) {
      setFatalError(true);
      console.error('Error from UseSWR', swrError.message);
    }
  }, [swrError]);
  useEffect(function () {
    var info = document.getElementById('meow-common-phpinfo');
    setPhpInfo(info.innerHTML);
  }, []);
  var updateOption = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(value, id) {
      var newSettingsData, res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            newSettingsData = _objectSpread({}, swrSettings.data);
            newSettingsData[id] = value;
            mutateSwrSettings(_objectSpread(_objectSpread({}, swrSettings), {}, {
              data: newSettingsData
            }), false);
            setBusy(true);
            _context.next = 6;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.postFetch)("".concat(CommonApiUrl, "/update_option"), {
              json: {
                name: id,
                value: value
              },
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 6:
            res = _context.sent;
            setBusy(false);
            if (!res.success) {
              alert(res.message);
            }
            mutateSwrSettings();
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function updateOption(_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
  var loadErrorLogs = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var res, fresh;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            _context2.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.postFetch)("".concat(CommonApiUrl, "/error_logs"), {
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 3:
            res = _context2.sent;
            fresh = res && res.data ? res.data : [];
            setPhpErrorLogs(fresh.reverse());
            setBusy(false);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function loadErrorLogs() {
      return _ref2.apply(this, arguments);
    };
  }();
  var jsxHideMeowApps = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoSettings, {
    title: "Main Menu"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoCheckbox, {
    id: "meowapps_hide_meowapps",
    label: "Hide (Not Recommended)",
    description: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
      p: true
    }, "This will hide the Meow Apps Menu (on the left side) and everything it contains. You can re-enable it through though an option that will be added in Settings \u2192 General."),
    value: "1",
    disabled: busy,
    checked: hide_meowapps,
    onChange: updateOption
  })));
  var jsxForceSSLVerify = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoSettings, {
    title: "SSL Verify"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoCheckbox, {
    id: "force_sslverify",
    label: "Force (Not Recommended)",
    description: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
      p: true
    }, "This will enforce the usage of SSL when checking the license or updating the plugin."),
    value: "1",
    disabled: busy,
    checked: force_sslverify,
    onChange: updateOption
  })));
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoPage, {
    showRestError: fatalError
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoHeader, {
    title: "The Dashboard"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTabs, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTab, {
    title: "Meow Apps"
  }, jsxTextStory, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Media Cleaner",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/media-cleaner.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/media-cleaner/"
  }, "Media Cleaner")), /*#__PURE__*/React.createElement("p", null, "Remove the useless media entries and files."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Database Cleaner",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/database-cleaner.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/database-cleaner/"
  }, "Database Cleaner")), /*#__PURE__*/React.createElement("p", null, "Clean your database and make it faster."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Media File Renamer",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/media-file-renamer.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/media-file-renamer/"
  }, "Media File Renamer")), /*#__PURE__*/React.createElement("p", null, "Rename your filenames for a better SEO."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Social Engine",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/social-engine.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/social-engine/"
  }, "Social Engine")), /*#__PURE__*/React.createElement("p", null, "Share your articles and photos on the SNS."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Meow Analytics",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/meow-analytics.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/meow-analytics/"
  }, "Meow Analytics")), /*#__PURE__*/React.createElement("p", null, "Google Analytics for your website.")))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Photo Engine",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/wplr-sync.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/wplr-sync/"
  }, "Photo Engine")), /*#__PURE__*/React.createElement("p", null, "Organize your photos in folders and collections.", /*#__PURE__*/React.createElement("br", null), "Synchronize with Lightroom."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Meow Gallery",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/meow-gallery.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/meow-gallery/"
  }, "Meow Gallery")), /*#__PURE__*/React.createElement("p", null, "Fast and beautiful gallery with many layouts."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Meow Lightbox",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/meow-lightbox.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/meow-lightbox/"
  }, "Meow Lightbox")), /*#__PURE__*/React.createElement("p", null, "Sleek and performant lightbox with EXIF support."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Perfect Images (Retina)",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/wp-retina-2x.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/wp-retina-2x/"
  }, "Perfect Images")), /*#__PURE__*/React.createElement("p", null, "Optimize your thumbnails, retina, replace images, etc."))), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginBlock, {
    title: "Contact Form Block",
    className: "primary"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPluginImage, {
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/common/img/contact-form-block.png")
  }), /*#__PURE__*/React.createElement("div", {
    className: "plugin-desc"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/plugins/contact-form-block/"
  }, "Contact Form Block")), /*#__PURE__*/React.createElement("p", null, "Simple and straightforward contact form, in one block.")))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTab, {
    title: "Performance"
  }, jsxTextPerformance, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(_SpeedTester__WEBPACK_IMPORTED_MODULE_12__.SpeedTester, {
    title: "Empty Request Time",
    request: "empty_request",
    max: 2500
  }), /*#__PURE__*/React.createElement(_SpeedTester__WEBPACK_IMPORTED_MODULE_12__.SpeedTester, {
    title: "File Operation Time",
    request: "file_operation",
    max: 2600
  }), /*#__PURE__*/React.createElement(_SpeedTester__WEBPACK_IMPORTED_MODULE_12__.SpeedTester, {
    title: "SQL Request Time",
    request: "sql_request",
    max: 2800
  })), jsxTextRecommendations), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTab, {
    title: "PHP Info"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPhpInfo, {
    dangerouslySetInnerHTML: {
      __html: phpInfo
    }
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTab, {
    title: "PHP Error Logs"
  }, /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.TabText, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoButton, {
    style: {
      marginBottom: 10
    },
    color: '#ccb027',
    onClick: loadErrorLogs
  }, "Load PHP Error Logs"), /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.StyledPhpErrorLogs, null, phpErrorLogs.map(function (x) {
    return /*#__PURE__*/React.createElement("li", {
      "class": "log-".concat(x.type)
    }, /*#__PURE__*/React.createElement("span", {
      "class": "log-type"
    }, x.type), /*#__PURE__*/React.createElement("span", {
      "class": "log-date"
    }, x.date), /*#__PURE__*/React.createElement("span", {
      "class": "log-content"
    }, x.content));
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
    p: true
  }, "If nothing appears after loading, it might be that your hosting service does not allow you to access the PHP error logs directly from here. Please contact them directly."))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoTab, {
    title: "Settings"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    title: "Settings",
    className: "primary"
  }, jsxHideMeowApps, jsxForceSSLVerify))))));
};


/***/ }),

/***/ "./common/js/dashboard/Dashboard.styled.js":
/*!*************************************************!*\
  !*** ./common/js/dashboard/Dashboard.styled.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyledPhpErrorLogs": () => (/* binding */ StyledPhpErrorLogs),
/* harmony export */   "StyledPhpInfo": () => (/* binding */ StyledPhpInfo),
/* harmony export */   "StyledPluginBlock": () => (/* binding */ StyledPluginBlock),
/* harmony export */   "StyledPluginImage": () => (/* binding */ StyledPluginImage),
/* harmony export */   "TabText": () => (/* binding */ TabText)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Block.js");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// React & Vendor Libs


// NekoUI

var TabText = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: white;\n  padding: 15px;\n  margin-bottom: -15px;\n\n  a {\n    color: #7dedff;\n    text-decoration: none;\n  }\n\n  p {\n    font-size: 15px;\n  }\n"])));
var StyledPluginBlock = (0,styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoBlock)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\n  .nui-block-title {\n    display: none;\n  }\n\n  .plugin-desc {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    margin-left: 20px;\n\n  }\n\n  .nui-block-content {\n    display: flex;\n    padding: 10px;\n    item-align: center;\n\n    h2 {\n      color: #055082;\n      font-size: 18px;\n      margin: 0;\n\n      a {\n        text-decoration: none;\n      }\n    }\n\n    p {\n      margin: 0px;\n      font-size: 15px;\n    }\n  }\n"])));
var StyledPluginImage = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].img(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: 85px;\n  height: 85px;\n  padding-right: 10px;\n"])));
var StyledPhpInfo = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\n  margin: 15px;\n\n  .center {\n    background: white;\n    border-radius: 10px;\n    padding: 10px;\n    max-width: 100%\n    overflow: none;\n\n    h2 {\n      font-size: 26px;\n    }\n\n    table {\n      width: 100%;\n\n      tr td:first-child {\n        width: 220px;\n        font-weight: bold;\n        color: #1e7cba;\n      }\n\n      * {\n        overflow-wrap: anywhere;\n      }\n    }\n  }\n\n  hr {\n    border-color: #1e7cba;\n  }\n"])));
var StyledPhpErrorLogs = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].ul(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  margin-top: 10px;\n  background: rgb(0, 72, 88);\n  padding: 10px;\n  color: rgb(58, 212, 58);\n  max-height: 600px;\n  min-height: 200px;\n  display: block;\n  font-family: monospace;\n  font-size: 12px;\n  white-space: pre;\n  overflow-x: auto;\n  width: calc(100vw - 276px);\n\n  .log-date {\n    color: white;\n    margin-left: 8px;\n  }\n\n  .log-type {\n    background: #0000004d;\n    padding: 2px 5px;\n    border-radius: 8px;\n    text-transform: uppercase;\n  }\n\n  .log-content {\n    display: block;\n  }\n\n  .log-warning .log-type {\n    background: #ccb028;\n    color: white;\n  }\n\n  .log-fatal .log-type {\n    background: #cc2828;\n    color: white;\n  }\n"])));


/***/ }),

/***/ "./common/js/dashboard/SpeedTester.js":
/*!********************************************!*\
  !*** ./common/js/dashboard/SpeedTester.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedTester": () => (/* binding */ SpeedTester)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Gauge.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dashboard.styled */ "./common/js/dashboard/Dashboard.styled.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect;

// NekoUI



// From Main Plugin


// Common

var CommonApiUrl = "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.restUrl, "/meow-common/v1");
var SpeedTester = function SpeedTester(_ref) {
  var request = _ref.request,
    title = _ref.title,
    max = _ref.max;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    runRequests = _useState2[0],
    setRunRequests = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    results = _useState4[0],
    setResults = _useState4[1];
  var resultsTotal = results.length > 0 ? results.reduce(function (a, b) {
    return a + b;
  }) : 0;
  var resultsAverage = results.length > 0 ? Math.ceil(resultsTotal / results.length) : 0;
  var isInitializing = !results.length && runRequests;
  useEffect(function () {
    if (!runRequests) {
      return;
    }
    setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var start, end, time;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            start = new Date().getTime();
            _context.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.postFetch)("".concat(CommonApiUrl, "/").concat(request), {
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce
            });
          case 3:
            end = new Date().getTime();
            time = end - start;
            setResults(function (x) {
              return [].concat(_toConsumableArray(x), [time]);
            });
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })), 1000);
  }, [results]);
  var toggleRequestsProcess = function toggleRequestsProcess() {
    if (!runRequests) {
      setResults([]);
    }
    setRunRequests(!runRequests);
  };
  return /*#__PURE__*/React.createElement(_Dashboard_styled__WEBPACK_IMPORTED_MODULE_2__.TabText, {
    style: {
      width: 200,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTypo, {
    h2: true,
    style: {
      color: 'white'
    }
  }, title), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoGauge, {
    size: 200,
    value: isInitializing ? max : resultsAverage,
    max: max
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, isInitializing ? 'START' : resultsAverage + ' ms'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, isInitializing ? 'YOUR ENGINE' : results.length + ' requests')), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoButton, {
    style: {
      width: '100%',
      marginTop: 10
    },
    color: runRequests ? '#cc3627' : '#ccb027',
    onClick: toggleRequestsProcess
  }, runRequests ? 'Stop' : 'Start'));
};


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["wpJsonMwai"] = self["wpJsonMwai"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./app/js/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map