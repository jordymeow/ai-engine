/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/js/blocks/ChatbotBlock.js":
/*!***************************************!*\
  !*** ./app/js/blocks/ChatbotBlock.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./app/js/blocks/common.js");

var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
  registerBlockType = _wp$blocks.registerBlockType,
  createBlock = _wp$blocks.createBlock;
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect,
  useState = _wp$element.useState;
var _wp$components = wp.components,
  Button = _wp$components.Button,
  DropZone = _wp$components.DropZone,
  PanelBody = _wp$components.PanelBody,
  RangeControl = _wp$components.RangeControl,
  CheckboxControl = _wp$components.CheckboxControl,
  TextControl = _wp$components.TextControl,
  SelectControl = _wp$components.SelectControl,
  Toolbar = _wp$components.Toolbar,
  withNotices = _wp$components.withNotices;
var _wp$blockEditor = wp.blockEditor,
  BlockControls = _wp$blockEditor.BlockControls,
  InspectorControls = _wp$blockEditor.InspectorControls;
var saveChatbot = function saveChatbot(props) {
  var _props$attributes = props.attributes,
    id = _props$attributes.id,
    fieldName = _props$attributes.fieldName,
    labelText = _props$attributes.labelText;
  console.log(props);
  return /*#__PURE__*/React.createElement(React.Fragment, null, "[mwai_chatbot]");
};
var FormFieldBlock = function FormFieldBlock(props) {
  var _props$attributes2 = props.attributes,
    id = _props$attributes2.id,
    fieldName = _props$attributes2.fieldName,
    labelText = _props$attributes2.labelText,
    setAttributes = props.setAttributes;
  var html = useMemo(function () {
    return saveChatbot(props);
  }, [props]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, html, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __('Chatbot')
  }), /*#__PURE__*/React.createElement(PanelBody, {
    title: __('Settings')
  })));
};
var createChatbotBlock = function createChatbotBlock() {
  registerBlockType('ai-engine/chatbot', {
    title: 'AI Chatbot',
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "This feature is ", /*#__PURE__*/React.createElement("b", null, "being built"), ". I will allow to create a chatbot. Coming soon!"),
    icon: _common__WEBPACK_IMPORTED_MODULE_0__.meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('chatbot')],
    attributes: {
      id: {
        type: 'string',
        "default": ''
      }
    },
    edit: FormFieldBlock,
    save: saveChatbot
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createChatbotBlock);

/***/ }),

/***/ "./app/js/blocks/FormContainerBlock.js":
/*!*********************************************!*\
  !*** ./app/js/blocks/FormContainerBlock.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./app/js/blocks/common.js");

var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect;
var _wp$components = wp.components,
  PanelBody = _wp$components.PanelBody,
  TextControl = _wp$components.TextControl;
var _wp$blockEditor = wp.blockEditor,
  InspectorControls = _wp$blockEditor.InspectorControls,
  InnerBlocks = _wp$blockEditor.InnerBlocks,
  useBlockProps = _wp$blockEditor.useBlockProps;
var saveFormField = function saveFormField(props) {
  var blockProps = useBlockProps.save();
  var id = props.attributes.id;
  return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(InnerBlocks.Content, null));
};
var FormContainerBlock = function FormContainerBlock(props) {
  var id = props.attributes.id,
    setAttributes = props.setAttributes;
  var blockProps = useBlockProps();
  useEffect(function () {
    if (!id) {
      var newId = Math.random().toString(36).substr(2, 9);
      setAttributes({
        id: 'mwai-' + newId
      });
    }
  }, [id]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_0__.AiBlockContainer, {
    title: "AI Form Container",
    type: "container"
  }, /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(InnerBlocks, null))), /*#__PURE__*/React.createElement(InspectorControls, null));
};
var createContainerBlock = function createContainerBlock() {
  registerBlockType('ai-engine/form-container', {
    title: 'AI Form Container',
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "This feature is ", /*#__PURE__*/React.createElement("b", null, "extremely beta"), ". I am enhancing it based on your feedback."),
    icon: _common__WEBPACK_IMPORTED_MODULE_0__.meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('form')],
    attributes: {
      id: {
        type: 'string',
        "default": ''
      }
    },
    edit: FormContainerBlock,
    save: saveFormField
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createContainerBlock);

/***/ }),

/***/ "./app/js/blocks/FormFieldBlock.js":
/*!*****************************************!*\
  !*** ./app/js/blocks/FormFieldBlock.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./app/js/blocks/common.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect;
var _wp$components = wp.components,
  Button = _wp$components.Button,
  PanelBody = _wp$components.PanelBody,
  TextControl = _wp$components.TextControl,
  SelectControl = _wp$components.SelectControl;
var InspectorControls = wp.blockEditor.InspectorControls;
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var saveFormField = function saveFormField(props) {
  var _props$attributes = props.attributes,
    label = _props$attributes.label,
    type = _props$attributes.type,
    name = _props$attributes.name,
    _props$attributes$opt = _props$attributes.options,
    options = _props$attributes$opt === void 0 ? [] : _props$attributes$opt;
  var encodedOptions = encodeURIComponent(JSON.stringify(options));
  return "[mwai-form-field label=\"".concat(label, "\" type=\"").concat(type, "\" name=\"").concat(name, "\" options=\"").concat(encodedOptions, "\"]");
};
var FormFieldBlock = function FormFieldBlock(props) {
  var _props$attributes2 = props.attributes,
    type = _props$attributes2.type,
    name = _props$attributes2.name,
    _props$attributes2$op = _props$attributes2.options,
    options = _props$attributes2$op === void 0 ? [] : _props$attributes2$op,
    label = _props$attributes2.label,
    setAttributes = props.setAttributes;
  useEffect(function () {
    if (label) {
      var newName = label.trim().replace(/ /g, '_').replace(/[^\w-]+/g, '').toUpperCase();
      setAttributes({
        name: newName
      });
    }
  }, [label]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_0__.AiBlockContainer, {
    title: "".concat(capitalizeFirstLetter(type), " Field"),
    type: "field"
  }, /*#__PURE__*/React.createElement("div", null, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", null, name)), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __('Field')
  }, /*#__PURE__*/React.createElement(TextControl, {
    label: "Label Text",
    value: label,
    onChange: function onChange(value) {
      return setAttributes({
        label: value
      });
    }
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: "Field Name",
    value: name,
    onChange: function onChange(value) {
      return setAttributes({
        name: value
      });
    }
  }), /*#__PURE__*/React.createElement(SelectControl, {
    label: "Field Type",
    value: type,
    onChange: function onChange(value) {
      return setAttributes({
        type: value
      });
    },
    options: [{
      label: 'Input',
      value: 'input'
    }, {
      label: 'Select',
      value: 'select'
    },
    // { label: 'Checkbox', value: 'checkbox' },
    //{ label: 'Radio', value: 'radio' },
    {
      label: 'Text Area',
      value: 'textarea'
    }]
  })), type === 'select' && /*#__PURE__*/React.createElement(PanelBody, {
    title: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", null, __('Options')), /*#__PURE__*/React.createElement(Button, {
      isPrimary: true,
      isSmall: true,
      onClick: function onClick(ev) {
        ev.preventDefault();
        var newOptions = _toConsumableArray(options);
        newOptions.push({
          label: '',
          value: ''
        });
        setAttributes({
          options: newOptions
        });
      }
    }, "Add Option"))
  }, options.map(function (option, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      style: {
        display: 'flex',
        marginBottom: -25
      }
    }, /*#__PURE__*/React.createElement(TextControl, {
      style: {
        flex: 2,
        marginBottom: 0,
        marginRight: 5
      },
      label: "Label",
      isInline: true,
      value: option.label,
      onChange: function onChange(value) {
        var newOptions = _toConsumableArray(options);
        newOptions[index].label = value;
        setAttributes({
          options: newOptions
        });
      }
    }), /*#__PURE__*/React.createElement(TextControl, {
      style: {
        flex: 1,
        marginBottom: 0
      },
      label: "Value",
      isSubtle: true,
      value: option.value,
      onChange: function onChange(value) {
        var newOptions = _toConsumableArray(options);
        newOptions[index].value = value;
        setAttributes({
          options: newOptions
        });
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 29
      }
    }, /*#__PURE__*/React.createElement(Button, {
      style: {
        flex: 1,
        marginLeft: 5
      },
      isDestructive: true,
      isSmall: true,
      onClick: function onClick() {
        var newOptions = _toConsumableArray(options);
        newOptions.splice(index, 1);
        setAttributes({
          options: newOptions
        });
      }
    }, "Remove")));
  }))));
};
var createFormFieldBlock = function createFormFieldBlock() {
  registerBlockType('ai-engine/form-field', {
    title: 'AI Form Field',
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "This feature is ", /*#__PURE__*/React.createElement("b", null, "extremely beta"), ". I am enhancing it based on your feedback."),
    icon: _common__WEBPACK_IMPORTED_MODULE_0__.meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('form')],
    attributes: {
      name: {
        type: 'string',
        "default": 'LABEL'
      },
      type: {
        type: 'string',
        "default": 'input'
      },
      options: {
        type: 'array',
        "default": []
      },
      label: {
        type: 'string',
        "default": 'Label: '
      }
    },
    edit: FormFieldBlock,
    save: saveFormField
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createFormFieldBlock);

/***/ }),

/***/ "./app/js/blocks/FormOutputBlock.js":
/*!******************************************!*\
  !*** ./app/js/blocks/FormOutputBlock.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./app/js/blocks/common.js");

var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect;
var _wp$components = wp.components,
  PanelBody = _wp$components.PanelBody,
  TextControl = _wp$components.TextControl;
var InspectorControls = wp.blockEditor.InspectorControls;
var saveFormField = function saveFormField(props) {
  var id = props.attributes.id;
  return "[mwai-form-output id=\"".concat(id, "\"]");
};
var FormOutputBlock = function FormOutputBlock(props) {
  var id = props.attributes.id,
    setAttributes = props.setAttributes;
  useEffect(function () {
    if (!id) {
      var newId = Math.random().toString(36).substr(2, 9);
      setAttributes({
        id: 'mwai-' + newId
      });
    }
  }, [id]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_0__.AiBlockContainer, {
    title: "Output",
    type: "output"
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", null, "#", id)), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __('Output')
  }, /*#__PURE__*/React.createElement(TextControl, {
    label: "ID",
    value: id,
    onChange: function onChange(value) {
      return setAttributes({
        id: value
      });
    }
  }))));
};
var createOutputBlock = function createOutputBlock() {
  registerBlockType('ai-engine/form-output', {
    title: 'AI Form Output',
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "This feature is ", /*#__PURE__*/React.createElement("b", null, "extremely beta"), ". I am enhancing it based on your feedback."),
    icon: _common__WEBPACK_IMPORTED_MODULE_0__.meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('form')],
    attributes: {
      id: {
        type: 'string',
        "default": ''
      }
    },
    edit: FormOutputBlock,
    save: saveFormField
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createOutputBlock);

/***/ }),

/***/ "./app/js/blocks/FormSubmitBlock.js":
/*!******************************************!*\
  !*** ./app/js/blocks/FormSubmitBlock.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./app/js/blocks/common.js");

var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useEffect = _wp$element.useEffect;
var _wp$components = wp.components,
  PanelBody = _wp$components.PanelBody,
  TextControl = _wp$components.TextControl,
  TextareaControl = _wp$components.TextareaControl;
var InspectorControls = wp.blockEditor.InspectorControls;
var saveFormField = function saveFormField(props) {
  var _props$attributes = props.attributes,
    id = _props$attributes.id,
    label = _props$attributes.label,
    prompt = _props$attributes.prompt,
    outputElement = _props$attributes.outputElement;
  var encodedPrompt = encodeURIComponent(prompt);
  return "[mwai-form-submit id=\"".concat(id, "\" label=\"").concat(label, "\" prompt=\"").concat(encodedPrompt, "\" output_element=\"").concat(outputElement, "\"]");
};
var FormSubmitBlock = function FormSubmitBlock(props) {
  var _props$attributes2 = props.attributes,
    id = _props$attributes2.id,
    label = _props$attributes2.label,
    prompt = _props$attributes2.prompt,
    outputElement = _props$attributes2.outputElement,
    _props$attributes2$pl = _props$attributes2.placeholders,
    placeholders = _props$attributes2$pl === void 0 ? [] : _props$attributes2$pl,
    setAttributes = props.setAttributes;
  useEffect(function () {
    // Catch all the variables between the curly braces
    var placeholders = prompt.match(/{([^}]+)}/g);
    if (placeholders) {
      setAttributes({
        placeholders: placeholders.map(function (placeholder) {
          return placeholder.replace('{', '').replace('}', '');
        })
      });
    }
  }, [prompt]);
  useEffect(function () {
    if (!id) {
      var newId = Math.random().toString(36).substr(2, 9);
      setAttributes({
        id: 'mwai-' + newId
      });
    }
  }, [id]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_0__.AiBlockContainer, {
    title: "Submit",
    type: "submit"
  }, "Input Fields: ", placeholders.join(', '), /*#__PURE__*/React.createElement("br", null), "Prompt: ", prompt, /*#__PURE__*/React.createElement("br", null), "Output Element: ", outputElement), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __('Output')
  }, /*#__PURE__*/React.createElement(TextControl, {
    label: "Label",
    value: label,
    onChange: function onChange(value) {
      return setAttributes({
        label: value
      });
    }
  }), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Prompt",
    value: prompt,
    onChange: function onChange(value) {
      return setAttributes({
        prompt: value
      });
    },
    help: "The template of your prompt. To re-use the data entered by the user, use the name of that field between curly braces. Example: 'Recommend me {MUSIC_TYPE} artists.'"
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: "Output Element",
    value: outputElement,
    onChange: function onChange(value) {
      return setAttributes({
        outputElement: value
      });
    },
    help: "The result will be written to this element. If you wish to simply display the result in an Output Block, use its ID. For instance, if its ID is mwai-666, use '#mwai-666'."
  }))));
};
var createSubmitBlock = function createSubmitBlock() {
  registerBlockType('ai-engine/form-submit', {
    title: 'AI Form Submit',
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "This feature is ", /*#__PURE__*/React.createElement("b", null, "extremely beta"), ". I am enhancing it based on your feedback."),
    icon: _common__WEBPACK_IMPORTED_MODULE_0__.meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('form')],
    attributes: {
      id: {
        type: 'string',
        "default": ''
      },
      label: {
        type: 'string',
        "default": 'Submit'
      },
      prompt: {
        type: 'string',
        "default": ''
      },
      outputElement: {
        type: 'string',
        "default": ''
      }
    },
    edit: FormSubmitBlock,
    save: saveFormField
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSubmitBlock);

/***/ }),

/***/ "./app/js/blocks/common.js":
/*!*********************************!*\
  !*** ./app/js/blocks/common.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AiBlockContainer": () => (/* binding */ AiBlockContainer),
/* harmony export */   "meowIcon": () => (/* binding */ meowIcon)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/hooks.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _styles_AiIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/AiIcon */ "./app/js/styles/AiIcon.js");
var _excluded = ["children", "type", "title"];
var _templateObject;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var meowIcon = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("rect", {
  width: "20",
  height: "20",
  fill: "white"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z",
  fill: "#2D4B6D"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z",
  fill: "#1ABC9C"
}), /*#__PURE__*/React.createElement("path", {
  d: "M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z",
  fill: "#2D4B6D"
}));



var BlockContainer = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tbackground: hsl(0deg 0% 10%);\n\tcolor: white;\n\tdisplay: flex;\n\tflex-direction: column;\n\tborder: 2px solid #39326e;\n\tfont-size: 15px;\n\tbox-sizing: content-box;\n\n\t.mwai-title-container {\n\t\tflex: inherit;\n\t\tpadding: 5px 0px 5px 10px;\n\t\tdisplay: flex;\n\t\tbackground: #39326d;\n\t\talign-items: center;\n\t\tcolor: white;\n\t}\n\n\t.mwai-block-container-content {\n\t\tflex: auto;\n\t\tpadding: 0px 10px;\n\t\tbackground: #272247;\n\n\t\t.mwai-block-container {\n\t\t\tborder: 2px solid #326d5c;\n\t\t\tmargin: 10px 0;\n\n\t\t\t.mwai-title-container {\n\t\t\t\tbackground: #326d5c;\n\t\t\t}\n\n\t\t\t.mwai-block-container-content {\n\t\t\t\tbackground: #24483e;\n\t\t\t}\n\t\t}\n\t}\n\n\t&:not(.mwai-container) {\n\n\t\t.mwai-block-container-content {\n\t\t\tpadding: 10px;\n\t\t\tdisplay: flex;\n\t\t}\n\t}\n"])));
var AiBlockContainer = function AiBlockContainer(_ref) {
  var children = _ref.children,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? "" : _ref$type,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? "" : _ref$title,
    rest = _objectWithoutProperties(_ref, _excluded);
  var classes = (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.useClasses)('mwai-block-container', 'mwai-' + type);
  return /*#__PURE__*/React.createElement(BlockContainer, _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "mwai-title-container"
  }, /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_2__["default"], {
    icon: "ai",
    style: {
      width: 20,
      height: 20
    }
  }), " ", title), /*#__PURE__*/React.createElement("div", {
    className: "mwai-block-container-content"
  }, children));
};


/***/ }),

/***/ "./app/js/blocks/index.js":
/*!********************************!*\
  !*** ./app/js/blocks/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ChatbotBlock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatbotBlock */ "./app/js/blocks/ChatbotBlock.js");
/* harmony import */ var _FormContainerBlock__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FormContainerBlock */ "./app/js/blocks/FormContainerBlock.js");
/* harmony import */ var _FormFieldBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFieldBlock */ "./app/js/blocks/FormFieldBlock.js");
/* harmony import */ var _FormOutputBlock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormOutputBlock */ "./app/js/blocks/FormOutputBlock.js");
/* harmony import */ var _FormSubmitBlock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FormSubmitBlock */ "./app/js/blocks/FormSubmitBlock.js");






// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

var initBlocks = function initBlocks() {
  (0,_FormFieldBlock__WEBPACK_IMPORTED_MODULE_0__["default"])();
  (0,_FormOutputBlock__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_ChatbotBlock__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_FormSubmitBlock__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_FormContainerBlock__WEBPACK_IMPORTED_MODULE_4__["default"])();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initBlocks);

/***/ }),

/***/ "./app/js/components/NekoColorPicker.js":
/*!**********************************************!*\
  !*** ./app/js/components/NekoColorPicker.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NekoColorPicker": () => (/* binding */ NekoColorPicker)
/* harmony export */ });
/* harmony import */ var react_colorful__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-colorful */ "./node_modules/react-colorful/dist/index.mjs");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
var _templateObject;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useRef = _wp$element.useRef,
  useCallback = _wp$element.useCallback;


var StyledColorPicker = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n\n  .swatch {\n    width: 24px;\n    height: 24px;\n    border-radius: 8px;\n    border: 3px solid #fff;\n    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);\n    cursor: pointer;\n  }\n  \n  .popover {\n    position: absolute;\n    top: -210px;\n    left: -80px;\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);\n    z-index: 9999;\n  }\n"])));
var useClickOutside = function useClickOutside(ref, handler) {
  useEffect(function () {
    var startedInside = false;
    var startedWhenMounted = false;
    var listener = function listener(event) {
      if (startedInside || !startedWhenMounted) return;
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    var validateEventStart = function validateEventStart(event) {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };
    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);
    return function () {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};
var NekoColorPicker = function NekoColorPicker(_ref) {
  var name = _ref.name,
    value = _ref.value,
    onChange = _ref.onChange;
  var popover = useRef();
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    toggle = _useState2[1];
  var _useState3 = useState(value),
    _useState4 = _slicedToArray(_useState3, 2),
    color = _useState4[0],
    setColor = _useState4[1];
  var close = useCallback(function () {
    if (color !== value) {
      onChange(color, name);
    }
    toggle(false);
  }, [color, value]);
  useClickOutside(popover, close);
  return /*#__PURE__*/React.createElement(StyledColorPicker, {
    className: "neko-color-picker"
  }, /*#__PURE__*/React.createElement("div", {
    className: "swatch",
    style: {
      backgroundColor: color
    },
    onClick: function onClick() {
      return toggle(true);
    }
  }), isOpen && /*#__PURE__*/React.createElement("div", {
    className: "popover",
    ref: popover
  }, /*#__PURE__*/React.createElement(react_colorful__WEBPACK_IMPORTED_MODULE_1__.HexColorPicker, {
    color: color,
    onChange: setColor
  })));
};


/***/ }),

/***/ "./app/js/components/Templates.js":
/*!****************************************!*\
  !*** ./app/js/components/Templates.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Switch.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Spinner.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Spacer.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/useQuery.mjs");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;

// Neko UI




// AI Engine


function generateUniqueId() {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 9);
}
var sortTemplates = function sortTemplates(templates) {
  var freshTemplates = _toConsumableArray(templates);
  freshTemplates.sort(function (a, b) {
    if (a.id === 'default') {
      return -1;
    }
    if (b.id === 'default') {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });
  return freshTemplates;
};
var retrieveTemplates = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(category) {
    var res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/templates?category=").concat(category), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
          });
        case 2:
          res = _context.sent;
          if (!(res !== null && res !== void 0 && res.templates && res.templates.length > 0)) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", sortTemplates(res.templates));
        case 5:
          if (!(category === 'imagesGenerator')) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", _constants__WEBPACK_IMPORTED_MODULE_2__.Templates_ImagesGenerator);
        case 9:
          if (!(category === 'playground')) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", _constants__WEBPACK_IMPORTED_MODULE_2__.Templates_Playground);
        case 13:
          if (!(category === 'contentGenerator')) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", _constants__WEBPACK_IMPORTED_MODULE_2__.Templates_ContentGenerator);
        case 15:
          alert("This category of templates is not supported yet.");
          return _context.abrupt("return", []);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function retrieveTemplates(_x) {
    return _ref.apply(this, arguments);
  };
}();
var useTemplates = function useTemplates() {
  var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'playground';
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    template = _useState2[0],
    setTemplate = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isEdit = _useState4[0],
    setIsEdit = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    templates = _useState6[0],
    setTemplates = _useState6[1];
  var _useQuery = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useQuery)({
      queryKey: ["templates-".concat(category)],
      queryFn: function queryFn() {
        return retrieveTemplates(category);
      }
    }),
    isLoadingTemplates = _useQuery.isLoading,
    newTemplates = _useQuery.data;
  useEffect(function () {
    if (newTemplates) {
      setTemplates(newTemplates);
      setTemplate(newTemplates[0]);
    }
  }, [newTemplates]);
  var saveTemplates = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(freshTemplates) {
      var res;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            freshTemplates = sortTemplates(freshTemplates);
            setTemplates(freshTemplates);
            _context2.next = 4;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/templates"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                category: category,
                templates: freshTemplates
              }
            });
          case 4:
            res = _context2.sent;
            return _context2.abrupt("return", res);
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function saveTemplates(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var isDifferent = useMemo(function () {
    if (!template || templates.length === 0) {
      return false;
    }
    var originalTpl = templates.find(function (x) {
      return x.id === template.id;
    });
    return Object.keys(originalTpl).some(function (key) {
      return originalTpl[key] !== template[key];
    });
  }, [template, templates]);
  var updateTemplate = function updateTemplate(tpl) {
    setTemplate(tpl);
  };
  var resetTemplate = function resetTemplate() {
    var freshTpl = templates.find(function (x) {
      return x.id === template.id;
    });
    if (freshTpl) {
      setTemplate(_objectSpread({}, freshTpl));
    }
  };
  var onSaveAsNewClick = function onSaveAsNewClick() {
    var newName = prompt('Name', "My New Template");
    if (!newName) {
      return false;
    }
    var newTpl = _objectSpread(_objectSpread({}, template), {}, {
      id: generateUniqueId(),
      name: newName
    });
    saveTemplates([].concat(_toConsumableArray(templates), [newTpl]));
    setTemplate(_objectSpread({}, newTpl));
  };
  var onSaveClick = function onSaveClick() {
    var newTemplates = templates.map(function (x) {
      if (x.id === template.id) {
        return template;
      }
      return x;
    });
    saveTemplates(newTemplates);
    setTemplate(_objectSpread({}, template));
  };
  var onRenameClick = function onRenameClick() {
    var newName = prompt('New name', template.name);
    if (!newName) {
      return;
    }
    var newTemplates = templates.map(function (x) {
      if (x.id === template.id) {
        return _objectSpread(_objectSpread({}, x), {}, {
          name: newName
        });
      }
      return x;
    });
    saveTemplates(_toConsumableArray(newTemplates));
    setTemplate(_objectSpread({}, newTemplates.find(function (x) {
      return x.id === template.id;
    })));
  };
  var onDeleteClick = function onDeleteClick() {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    var newTemplates = templates.filter(function (x) {
      return x.id !== template.id;
    });
    saveTemplates(_toConsumableArray(newTemplates));
    setTemplate(_objectSpread({}, newTemplates[0]));
  };
  var canSave = useMemo(function () {
    return isDifferent && template.id !== 'default';
  }, [template]);
  var jsxTemplates = useMemo(function () {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0
      }
    }, "Templates"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSwitch, {
      small: true,
      onLabel: "EDIT",
      offLabel: "EDIT",
      width: 60,
      onChange: setIsEdit,
      checked: isEdit
    }))), isLoadingTemplates && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginTop: 30,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoSpinner, {
      width: 20
    }))), /*#__PURE__*/React.createElement("ul", null, templates.map(function (x) {
      return /*#__PURE__*/React.createElement("li", {
        className: template.id === x.id ? 'active' + (isDifferent && isEdit ? ' modified' : '') : '',
        onClick: function onClick() {
          setTemplate(_objectSpread({}, x));
        }
      }, x.name);
    })), isDifferent && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginTop: 15
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      fullWidth: true,
      className: "secondary",
      icon: "undo",
      onClick: resetTemplate
    }, "Reset")), isEdit && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoSpacer, {
      line: true,
      height: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      disabled: template.id === 'default',
      className: "danger",
      icon: "trash",
      onClick: onDeleteClick
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      disabled: template.id === 'default',
      className: "secondary",
      icon: "pencil",
      onClick: onRenameClick
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      disabled: !canSave,
      className: "secondary",
      style: {
        flex: 6
      },
      onClick: onSaveClick
    }, "Save")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      onClick: onSaveAsNewClick,
      style: {
        flex: 6
      }
    }, "Save as New"))), !isEdit && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginTop: 15,
        lineHeight: '14px'
      }
    }, /*#__PURE__*/React.createElement("small", null, "Interested in sharing and/or looking for more templates? Join us on the ", /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      href: "https://wordpress.org/support/topic/common-use-cases-for-templates"
    }, "Templates Threads"), " in the forums.")));
  });
  return {
    template: template,
    resetTemplate: resetTemplate,
    setTemplate: updateTemplate,
    jsxTemplates: jsxTemplates,
    isEdit: isEdit
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useTemplates);

/***/ }),

/***/ "./app/js/constants.js":
/*!*****************************!*\
  !*** ./app/js/constants.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OpenAI_PricingPerModel": () => (/* binding */ OpenAI_PricingPerModel),
/* harmony export */   "OpenAI_models": () => (/* binding */ OpenAI_models),
/* harmony export */   "Templates_ContentGenerator": () => (/* binding */ Templates_ContentGenerator),
/* harmony export */   "Templates_ImagesGenerator": () => (/* binding */ Templates_ImagesGenerator),
/* harmony export */   "Templates_Playground": () => (/* binding */ Templates_Playground),
/* harmony export */   "WritingStyles": () => (/* binding */ WritingStyles),
/* harmony export */   "WritingTones": () => (/* binding */ WritingTones)
/* harmony export */ });
var OpenAI_models = [{
  id: 'text-davinci-003',
  name: 'text-davinci-003',
  "short": 'davinci',
  description: 'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.',
  strength: 'Complex intent, cause and effect, summarization for audience'
}, {
  id: 'text-curie-001',
  name: 'text-curie-001',
  "short": 'curie',
  description: 'Very capable, but faster and lower cost than Davinci.',
  strength: 'Language translation, complex classification, text sentiment, summarization'
}, {
  id: 'text-babbage-001',
  name: 'text-babbage-001',
  "short": 'babbage',
  description: 'Capable of straightforward tasks, very fast, and lower cost.',
  strength: 'Moderate classification, semantic search classification'
}, {
  id: 'text-ada-001',
  name: 'text-ada-001',
  "short": 'ada',
  description: 'Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.',
  strength: 'Parsing text, simple classification, address correction, keywords'
}
// {
//   id: 'code-davinci-002',
//   name: 'code-davinci-002',
//   short: 'davinci',
//   description: 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.',
// },
// {
//   id: 'code-cushman-001',
//   name: 'code-cushman-001',
//   description: 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.',
// }
];

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
var Templates_Playground = [{
  id: 'default',
  name: 'Default',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.8,
  stopSequence: '',
  maxTokens: 2048,
  prompt: ''
}, {
  id: 'article_translator',
  name: 'Text Translator',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.3,
  stopSequence: '',
  maxTokens: 2048,
  prompt: "Translate this article into French:\n\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n"
}, {
  id: 'restaurant_review',
  name: 'Restaurant Review Writer',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.8,
  stopSequence: '',
  maxTokens: 2048,
  prompt: 'Write a review for a French restaurant located in Kagurazaka, Tokyo. Looks like an old restaurant, food is traditional, chef is talkative, it is always full. Not expensive, but not fancy.\n'
}, {
  id: 'article_corrector',
  name: 'Text Corrector',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.2,
  stopSequence: '',
  maxTokens: 2048,
  prompt: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n'
}, {
  id: 'seo_assistant',
  name: 'SEO Optimizer',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.6,
  stopSequence: '',
  maxTokens: 1024,
  prompt: "For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:\n\nTitle: \nKeywords: \nExcerpt:\n\nArticle:\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town."
}, {
  id: 'wp_assistant',
  name: 'WordPress Assistant',
  mode: 'continuous',
  model: 'text-davinci-003',
  temperature: 0.8,
  stopSequence: '',
  maxTokens: 150,
  prompt: "Converse as a WordPress expert. Be helpful, friendly, concise, avoid external URLs and commercial solutions.\n\nAI: Hi! How can I help you with WP today?\n"
}, {
  id: 'casually_fine_tuned',
  name: 'Casually Fined Tuned Tester',
  mode: 'query',
  model: 'text-davinci-003',
  temperature: 0.4,
  stopSequence: '\\n\\n',
  maxTokens: 1024,
  prompt: "Hello! What's your name?\n\n###\n\n"
}];
var Templates_ImagesGenerator = [{
  id: 'default',
  name: 'Default',
  model: 'dall-e',
  maxResults: 3,
  prompt: ''
}, {
  id: 'japan',
  name: 'Ghibli Inspired',
  model: 'dall-e',
  maxResults: 3,
  prompt: 'japan, tokyo, trees, izakaya, anime oil painting, high resolution, ghibli inspired, 4k'
}, {
  id: 'steampunk',
  name: 'Steampunk Architecture',
  model: 'dall-e',
  maxResults: 3,
  prompt: 'steampunk architecture, exterior view, award-winning architectural photography from magazine, trees, theater'
}, {
  id: 'modern-illustration',
  name: 'Modern Illustration',
  model: 'dall-e',
  maxResults: 3,
  prompt: 'illustration of a cat, modern design, for the web, cute, happy, 4k, high resolution, trending in artstation'
}];
var Templates_ContentGenerator = [{
  id: 'default',
  name: 'Default',
  mode: 'single',
  topic: "",
  topics: "",
  topicsAreTitles: false,
  model: 'text-davinci-003',
  temperature: 0.8,
  maxTokens: 2048,
  sectionsCount: 2,
  paragraphsPerSection: 3,
  language: 'en',
  writingStyle: 'creative',
  writingTone: 'cheerful',
  titlePromptFormat: "Write a title for an article about \"{TOPIC}\" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.",
  sectionsPromptFormat: "Write {SECTIONS_COUNT} consecutive headings for an article about \"{TITLE}\", in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}.\n\nEach heading is between 40 and 60 characters.\n\nUse Markdown for the headings (## ).",
  contentPromptFormat: "Write an article about \"{TITLE}\" in {LANGUAGE}. The article is organized by the following headings:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per heading.\n\nUse Markdown for formatting.\n\nAdd an introduction prefixed by \"===INTRO: \", and a conclusion prefixed by \"===OUTRO: \".\n\nStyle: {WRITING_STYLE}. Tone: {WRITING_TONE}.",
  excerptPromptFormat: "Write an excerpt for an article about \"{TITLE}\" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters."
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
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./app/js/constants.js");
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
  useState = _wp$element.useState,
  useRef = _wp$element.useRef;


var OptionsCheck = function OptionsCheck(_ref) {
  var options = _ref.options;
  var openai_apikey = options.openai_apikey;
  var valid_key = openai_apikey && openai_apikey.length > 0;
  if (valid_key) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_0__.NekoMessageDanger, {
    style: {
      marginTop: 0,
      marginBottom: 25
    }
  }, "To use the features of AI Engine, you need to have an OpenAI account and create an API Key. Visit the ", /*#__PURE__*/React.createElement("a", {
    href: "https://beta.openai.com/account/api-keys",
    target: "_blank"
  }, "OpenAI"), " website."));
};
function cleanNumbering(text) {
  if (!text) {
    return text;
  }
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
  var _useState = useState(_constants__WEBPACK_IMPORTED_MODULE_1__.OpenAI_models[0].value),
    _useState2 = _slicedToArray(_useState, 2),
    model = _useState2[0],
    setModel = _useState2[1];
  var models = useMemo(function () {
    var _extraModels;
    var allModels = _constants__WEBPACK_IMPORTED_MODULE_1__.OpenAI_models;
    var extraModels = typeof (options === null || options === void 0 ? void 0 : options.extra_models) === 'string' ? options === null || options === void 0 ? void 0 : options.extra_models : "";
    var fineTunes = options !== null && options !== void 0 && options.openai_finetunes && (options === null || options === void 0 ? void 0 : options.openai_finetunes.length) > 0 ? options === null || options === void 0 ? void 0 : options.openai_finetunes.filter(function (x) {
      return x.enabled && x.model;
    }) : [];
    if (fineTunes.length) {
      allModels = [].concat(_toConsumableArray(allModels), _toConsumableArray(fineTunes.map(function (x) {
        var splitted = x.model.split(':');
        return {
          id: x.model,
          name: x.suffix,
          "short": 'fn-' + splitted[0],
          description: "Finetuned",
          finetuned: true
        };
      })));
    }
    extraModels = (_extraModels = extraModels) === null || _extraModels === void 0 ? void 0 : _extraModels.split(',').filter(function (x) {
      return x;
    });
    if (extraModels.length) {
      allModels = [].concat(_toConsumableArray(allModels), _toConsumableArray(extraModels.map(function (x) {
        return {
          id: x,
          name: x,
          description: "Extra"
        };
      })));
    }
    return allModels;
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
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/query-core/build/lib/queryClient.mjs");
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @common */ "./common/js/dashboard/Dashboard.js");
/* harmony import */ var _app_screens_Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/screens/Settings */ "./app/js/screens/Settings.js");
/* harmony import */ var _app_screens_Playground__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @app/screens/Playground */ "./app/js/screens/Playground.js");
/* harmony import */ var _modules_PostsListTools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/PostsListTools */ "./app/js/modules/PostsListTools.js");
/* harmony import */ var _screens_ContentGenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./screens/ContentGenerator */ "./app/js/screens/ContentGenerator.js");
/* harmony import */ var _screens_ImageGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./screens/ImageGenerator */ "./app/js/screens/ImageGenerator.js");
/* harmony import */ var _modules_SlotFills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/SlotFills */ "./app/js/modules/SlotFills.js");
/* harmony import */ var _blocks_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blocks/index */ "./app/js/blocks/index.js");
/* harmony import */ var _modules_WooCommerce__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/WooCommerce */ "./app/js/modules/WooCommerce.js");
var render = wp.element.render;

var queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

// Neko UI


// Components







// Gutenberg Blocks


(0,_blocks_index__WEBPACK_IMPORTED_MODULE_1__["default"])();
document.addEventListener('DOMContentLoaded', function () {
  (0,_modules_SlotFills__WEBPACK_IMPORTED_MODULE_2__["default"])();

  // Settings
  var settings = document.getElementById('mwai-admin-settings');
  if (settings) {
    render( /*#__PURE__*/React.createElement(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {
      client: queryClient
    }, /*#__PURE__*/React.createElement(_app_screens_Settings__WEBPACK_IMPORTED_MODULE_4__["default"], null)), settings);
  }

  // Content Generator
  var generator = document.getElementById('mwai-content-generator');
  if (generator) {
    render( /*#__PURE__*/React.createElement(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {
      client: queryClient
    }, /*#__PURE__*/React.createElement(_screens_ContentGenerator__WEBPACK_IMPORTED_MODULE_5__["default"], null)), generator);
  }

  // Image Generator
  var imgGen = document.getElementById('mwai-image-generator');
  if (imgGen) {
    render( /*#__PURE__*/React.createElement(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {
      client: queryClient
    }, /*#__PURE__*/React.createElement(_screens_ImageGenerator__WEBPACK_IMPORTED_MODULE_6__["default"], null)), imgGen);
  }

  // Dashboard
  var dashboard = document.getElementById('mwai-playground');
  if (dashboard) {
    render( /*#__PURE__*/React.createElement(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {
      client: queryClient
    }, /*#__PURE__*/React.createElement(_app_screens_Playground__WEBPACK_IMPORTED_MODULE_7__["default"], null)), dashboard);
  }

  // Admin Tools
  var postsListTools = document.getElementById('mwai-admin-postsList');
  if (postsListTools) {
    render( /*#__PURE__*/React.createElement(_modules_PostsListTools__WEBPACK_IMPORTED_MODULE_8__["default"], null), postsListTools);
  }

  // Admin Tools
  var wcAssistant = document.getElementById('mwai-admin-wcAssistant');
  if (wcAssistant) {
    render( /*#__PURE__*/React.createElement(_modules_WooCommerce__WEBPACK_IMPORTED_MODULE_9__["default"], null), wcAssistant);
  }

  // Common
  var meowDashboard = document.getElementById('meow-common-dashboard');
  if (meowDashboard) {
    render( /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_10__.Dashboard, null), meowDashboard);
  }
});

/***/ }),

/***/ "./app/js/modules/PostsListTools.js":
/*!******************************************!*\
  !*** ./app/js/modules/PostsListTools.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modals/GenerateTitles */ "./app/js/modules/modals/GenerateTitles.js");
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/update_post_title"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                postId: post.postId,
                title: title
              }
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

/***/ "./app/js/modules/SlotFills.js":
/*!*************************************!*\
  !*** ./app/js/modules/SlotFills.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _modals_GenerateTitles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modals/GenerateTitles */ "./app/js/modules/modals/GenerateTitles.js");
/* harmony import */ var _modals_GenerateExcerpts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modals/GenerateExcerpts */ "./app/js/modules/modals/GenerateExcerpts.js");
/* harmony import */ var _styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/AiIcon */ "./app/js/styles/AiIcon.js");
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
    icon: /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
      icon: "wand",
      style: {
        marginRight: 0
      }
    }),
    label: /*#__PURE__*/React.createElement(React.Fragment, null, " ", __('Enhance text')),
    onClick: doOnClick
  }), /*#__PURE__*/React.createElement(PluginBlockSettingsMenuItem, {
    allowedBlocks: ['core/paragraph'],
    icon: /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
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
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], null), " AI Engine"),
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
  }, /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
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
  }, /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
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

/***/ "./app/js/modules/WooCommerce.js":
/*!***************************************!*\
  !*** ./app/js/modules/WooCommerce.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/AiIcon */ "./app/js/styles/AiIcon.js");
/* harmony import */ var _modals_GenerateWcFields__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modals/GenerateWcFields */ "./app/js/modules/modals/GenerateWcFields.js");
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
var Button = wp.components.Button;

// Neko UI


// UI Engine


var WooCommerceAssistant = function WooCommerceAssistant() {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var onModalOpen = function onModalOpen() {
    setIsOpen(true);
  };
  var onModalClose = function onModalClose() {
    setIsOpen(false);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Generate the WooCommerce fields."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onModalOpen,
    style: {
      flex: 1,
      marginRight: 10
    }
  }, /*#__PURE__*/React.createElement(_styles_AiIcon__WEBPACK_IMPORTED_MODULE_0__["default"], {
    icon: "wand",
    style: {
      marginRight: 8
    }
  }), " Generate Fields")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoWrapper, null, /*#__PURE__*/React.createElement(_modals_GenerateWcFields__WEBPACK_IMPORTED_MODULE_2__["default"], {
    isOpen: isOpen,
    onClose: onModalClose
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WooCommerceAssistant);

/***/ }),

/***/ "./app/js/modules/modals/GenerateExcerpts.js":
/*!***************************************************!*\
  !*** ./app/js/modules/modals/GenerateExcerpts.js ***!
  \***************************************************/
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
/* harmony import */ var _styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../styles/ModalStyles */ "./app/js/styles/ModalStyles.js");
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_excerpts"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                postId: postId
              }
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
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Pick a new excerpt by clicking on it.", /*#__PURE__*/React.createElement(_styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.ResultsContainer, null, excerpts.map(function (x) {
        return /*#__PURE__*/React.createElement(_styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.Result, {
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

/***/ "./app/js/modules/modals/GenerateTitles.js":
/*!*************************************************!*\
  !*** ./app/js/modules/modals/GenerateTitles.js ***!
  \*************************************************/
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
/* harmony import */ var _styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../styles/ModalStyles */ "./app/js/styles/ModalStyles.js");
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_titles"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                postId: postId
              }
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
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Pick a new title by clicking on it.", /*#__PURE__*/React.createElement(_styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.ResultsContainer, null, titles.map(function (x) {
        return /*#__PURE__*/React.createElement(_styles_ModalStyles__WEBPACK_IMPORTED_MODULE_3__.Result, {
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

/***/ "./app/js/modules/modals/GenerateWcFields.js":
/*!***************************************************!*\
  !*** ./app/js/modules/modals/GenerateWcFields.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Spacer.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _styles_CommonStyles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../styles/CommonStyles */ "./app/js/styles/CommonStyles.js");
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


var promptBase = "Here is the product: {USER_ENTRY}\n\nBased on the product, write a description of this product (between 120 and 240 words), a short description (between 20-49 words), a SEO-friendly title, and tags, separated by commas. Use this format:\nDESCRIPTION: \nSHORT_DESCRIPTION: \nSEO_TITLE: \nTAGS: \n\n";
var GenerateWcFields = function GenerateWcFields(props) {
  var _props$isOpen = props.isOpen,
    isOpen = _props$isOpen === void 0 ? false : _props$isOpen,
    _props$title = props.title,
    title = _props$title === void 0 ? null : _props$title,
    _props$onClose = props.onClose,
    onClose = _props$onClose === void 0 ? {} : _props$onClose;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    desc = _useState2[0],
    setDesc = _useState2[1];
  var _useState3 = useState("Logitech MK270 Wireless Keyboard"),
    _useState4 = _slicedToArray(_useState3, 2),
    userEntry = _useState4[0],
    setUserEntry = _useState4[1];
  var _useState5 = useState(""),
    _useState6 = _slicedToArray(_useState5, 2),
    shortDesc = _useState6[0],
    setShortDesc = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    seoTitle = _useState8[0],
    setSeoTitle = _useState8[1];
  var _useState9 = useState(""),
    _useState10 = _slicedToArray(_useState9, 2),
    tags = _useState10[0],
    setTags = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    busy = _useState12[0],
    setBusy = _useState12[1];
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    error = _useState14[0],
    setError = _useState14[1];
  useEffect(function () {
    var titleField = document.getElementById('title');
    if (titleField) {
      setUserEntry(titleField.value);
    }
  }, [isOpen]);
  function extractProductInfo(text) {
    var lines = text.split("\n");
    var productInfo = {};
    lines.forEach(function (line) {
      if (line.startsWith("DESCRIPTION:")) {
        productInfo.description = line.replace("DESCRIPTION:", "").trim();
      } else if (line.startsWith("SHORT_DESCRIPTION:")) {
        productInfo.shortDescription = line.replace("SHORT_DESCRIPTION:", "").trim();
      } else if (line.startsWith("SEO_TITLE:")) {
        productInfo.seoTitle = line.replace("SEO_TITLE:", "").trim();
      } else if (line.startsWith("TAGS:")) {
        productInfo.keywords = line.replace("TAGS:", "").trim().split(", ");
      }
    });
    return productInfo;
  }
  var onGenerate = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
      var postId, prompt, res, info;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            postId = _ref.postId;
            setBusy(true);
            prompt = promptBase.replace("{USER_ENTRY}", userEntry);
            _context.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_completions"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                maxTokens: 512,
                temperature: 0.8,
                env: 'admin-tools',
                session: _app_settings__WEBPACK_IMPORTED_MODULE_1__.session,
                prompt: prompt
              }
            });
          case 5:
            res = _context.sent;
            setBusy(false);
            if (res.success) {
              info = extractProductInfo(res.data);
              console.log({
                raw: res.data,
                info: info
              });
              setDesc(info.description);
              setShortDesc(info.shortDescription);
              setSeoTitle(info.seoTitle);
              setTags(info.keywords.join(", "));
            }
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onGenerate(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var onUseTitle = function onUseTitle() {
    var titleField = document.getElementById('title');
    if (titleField) {
      titleField.value = seoTitle;
    } else {
      alert("The title cannot be written (the field could not be found).");
    }
  };
  var onUseDesc = function onUseDesc() {
    var contentField = tinyMCE.get('content');
    if (contentField) {
      contentField.setContent(desc);
    } else {
      alert("The content cannot be written (the field could not be found).");
    }
  };
  var onUseShortDesc = function onUseShortDesc() {
    var contentField = tinyMCE.get('excerpt');
    if (contentField) {
      contentField.setContent(shortDesc);
    } else {
      alert("The content cannot be written (the field could not be found).");
    }
  };
  var onUseTags = function onUseTags() {
    var tagsField = document.getElementById('new-tag-product_tag');
    if (tagsField) {
      tagsField.value = tags;
    } else {
      alert("The tags cannot be written (the field could not be found).");
    }
  };
  var writeAllCLose = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            onUseTitle();
            onUseDesc();
            onUseShortDesc();
            onUseTags();
            onClose();
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function writeAllCLose() {
      return _ref3.apply(this, arguments);
    };
  }();
  var cleanClose = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            onClose();
            setError();
            setBusy(false);
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function cleanClose() {
      return _ref4.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoModal, {
    isOpen: isOpen,
    onRequestClose: cleanClose,
    title: "WooCommerce Product Generator",
    content: /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_4__.StyledForm, null, /*#__PURE__*/React.createElement("label", null, "Define your product:"), /*#__PURE__*/React.createElement("div", {
      className: "form-row"
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoInput, {
      disabled: busy,
      name: "userEntry",
      value: userEntry,
      onChange: setUserEntry,
      style: {
        flex: 'auto'
      },
      placeholder: "What's your product?"
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      isBusy: busy,
      onClick: onGenerate,
      style: {
        marginLeft: 5
      }
    }, "Generate Fields")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoSpacer, {
      height: 30,
      line: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-row-label"
    }, /*#__PURE__*/React.createElement("label", null, "Title"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      small: true,
      disabled: !seoTitle,
      onClick: onUseTitle
    }, "Write")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoInput, {
      disabled: busy,
      rows: 4,
      value: seoTitle,
      onChange: setSeoTitle
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-row-label"
    }, /*#__PURE__*/React.createElement("label", null, "Description"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      small: true,
      disabled: !desc,
      onClick: onUseDesc
    }, "Write")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTextArea, {
      disabled: busy,
      rows: 4,
      value: desc,
      onChange: setDesc
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-row-label"
    }, /*#__PURE__*/React.createElement("label", null, "Short Description"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      small: true,
      disabled: !shortDesc,
      onClick: onUseShortDesc
    }, "Write")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTextArea, {
      disabled: busy,
      rows: 4,
      value: shortDesc,
      onChange: setShortDesc
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-row-label"
    }, /*#__PURE__*/React.createElement("label", null, "Product Tags"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      small: true,
      disabled: !tags,
      onClick: onUseTags
    }, "Write")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoInput, {
      small: true,
      disabled: busy,
      rows: 4,
      value: tags,
      onChange: setTags
    })),
    ok: "Write all fields",
    onOkClick: writeAllCLose
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GenerateWcFields);

/***/ }),

/***/ "./app/js/screens/ContentGenerator.js":
/*!********************************************!*\
  !*** ./app/js/screens/ContentGenerator.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/hooks.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Spacer.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Links.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Progress.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/CommonStyles */ "./app/js/styles/CommonStyles.js");
/* harmony import */ var _styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../styles/StyledSidebar */ "./app/js/styles/StyledSidebar.js");
/* harmony import */ var _components_Templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Templates */ "./app/js/components/Templates.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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








var languagesObject = (_app_settings__WEBPACK_IMPORTED_MODULE_0__.options === null || _app_settings__WEBPACK_IMPORTED_MODULE_0__.options === void 0 ? void 0 : _app_settings__WEBPACK_IMPORTED_MODULE_0__.options.languages) || [];
var languages = Object.keys(languagesObject).map(function (key) {
  return {
    value: key,
    label: languagesObject[key]
  };
});

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
var ContentGenerator = function ContentGenerator() {
  var _template$mode, _template$topic, _template$topics, _template$model, _template$sectionsCou, _template$paragraphsC, _template$language, _template$writingStyl, _template$writingTone, _template$titlePrompt, _template$sectionsPro, _template$contentProm, _template$excerptProm, _template$temperature, _template$maxTokens, _template$topicsAreTi;
  // Generated Content
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    title = _useState2[0],
    setTitle = _useState2[1];
  var _useState3 = useState(""),
    _useState4 = _slicedToArray(_useState3, 2),
    sections = _useState4[0],
    setSections = _useState4[1];
  var _useState5 = useState(""),
    _useState6 = _slicedToArray(_useState5, 2),
    content = _useState6[0],
    setContent = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    excerpt = _useState8[0],
    setExcerpt = _useState8[1];

  // System
  var _useTemplates = (0,_components_Templates__WEBPACK_IMPORTED_MODULE_1__["default"])('contentGenerator'),
    template = _useTemplates.template,
    setTemplate = _useTemplates.setTemplate,
    resetTemplate = _useTemplates.resetTemplate,
    jsxTemplates = _useTemplates.jsxTemplates;
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.useModels)(_app_settings__WEBPACK_IMPORTED_MODULE_0__.options),
    models = _useModels.models;
  var bulkTasks = (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.useNekoTasks)();
  var _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    busy = _useState10[0],
    setBusy = _useState10[1];
  var isBusy = bulkTasks.busy || busy;
  var _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    error = _useState12[0],
    setError = _useState12[1];
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    showModelParams = _useState14[0],
    setShowModelParams = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    showPrompts = _useState16[0],
    setShowPrompts = _useState16[1];
  var _useState17 = useState(),
    _useState18 = _slicedToArray(_useState17, 2),
    createdPostId = _useState18[0],
    setCreatedPostId = _useState18[1];
  var _useState19 = useState('post'),
    _useState20 = _slicedToArray(_useState19, 2),
    postType = _useState20[0],
    setPostType = _useState20[1];
  var _useState21 = useState([]),
    _useState22 = _slicedToArray(_useState21, 2),
    topicsArray = _useState22[0],
    setTopicsArray = _useState22[1];
  var _useState23 = useState([]),
    _useState24 = _slicedToArray(_useState23, 2),
    createdPosts = _useState24[0],
    setCreatedPosts = _useState24[1];
  var _useState25 = useState({}),
    _useState26 = _slicedToArray(_useState25, 2),
    runTimes = _useState26[0],
    setRunTimes = _useState26[1];
  var titleMessage = useMemo(function () {
    return getSeoMessage(title);
  }, [title]);

  // Template Properties
  var mode = (_template$mode = template === null || template === void 0 ? void 0 : template.mode) !== null && _template$mode !== void 0 ? _template$mode : 'single';
  var topic = (_template$topic = template === null || template === void 0 ? void 0 : template.topic) !== null && _template$topic !== void 0 ? _template$topic : "";
  var topics = (_template$topics = template === null || template === void 0 ? void 0 : template.topics) !== null && _template$topics !== void 0 ? _template$topics : "";
  var model = (_template$model = template === null || template === void 0 ? void 0 : template.model) !== null && _template$model !== void 0 ? _template$model : "text-davinci-003";
  var sectionsCount = (_template$sectionsCou = template === null || template === void 0 ? void 0 : template.sectionsCount) !== null && _template$sectionsCou !== void 0 ? _template$sectionsCou : 2;
  var paragraphsCount = (_template$paragraphsC = template === null || template === void 0 ? void 0 : template.paragraphsCount) !== null && _template$paragraphsC !== void 0 ? _template$paragraphsC : 3;
  var language = (_template$language = template === null || template === void 0 ? void 0 : template.language) !== null && _template$language !== void 0 ? _template$language : "en";
  var writingStyle = (_template$writingStyl = template === null || template === void 0 ? void 0 : template.writingStyle) !== null && _template$writingStyl !== void 0 ? _template$writingStyl : "creative";
  var writingTone = (_template$writingTone = template === null || template === void 0 ? void 0 : template.writingTone) !== null && _template$writingTone !== void 0 ? _template$writingTone : "cheerful";
  var titlePromptFormat = (_template$titlePrompt = template === null || template === void 0 ? void 0 : template.titlePromptFormat) !== null && _template$titlePrompt !== void 0 ? _template$titlePrompt : "";
  var sectionsPromptFormat = (_template$sectionsPro = template === null || template === void 0 ? void 0 : template.sectionsPromptFormat) !== null && _template$sectionsPro !== void 0 ? _template$sectionsPro : "";
  var contentPromptFormat = (_template$contentProm = template === null || template === void 0 ? void 0 : template.contentPromptFormat) !== null && _template$contentProm !== void 0 ? _template$contentProm : "";
  var excerptPromptFormat = (_template$excerptProm = template === null || template === void 0 ? void 0 : template.excerptPromptFormat) !== null && _template$excerptProm !== void 0 ? _template$excerptProm : "";
  var temperature = (_template$temperature = template === null || template === void 0 ? void 0 : template.temperature) !== null && _template$temperature !== void 0 ? _template$temperature : 0.6;
  var maxTokens = (_template$maxTokens = template === null || template === void 0 ? void 0 : template.maxTokens) !== null && _template$maxTokens !== void 0 ? _template$maxTokens : 2048;
  var topicsAreTitles = (_template$topicsAreTi = template === null || template === void 0 ? void 0 : template.topicsAreTitles) !== null && _template$topicsAreTi !== void 0 ? _template$topicsAreTi : false;
  var humanLanguage = useMemo(function () {
    return languages.find(function (l) {
      return l.value === language;
    }).label;
  });
  var setTemplateProperty = function setTemplateProperty(value, property) {
    setTemplate(_objectSpread(_objectSpread({}, template), {}, _defineProperty({}, property, value)));
  };
  useEffect(function () {
    var freshTopicsArray = topics.split('\n').map(function (x) {
      return x.trim();
    }).filter(function (x) {
      return !!x;
    });
    setTopicsArray(freshTopicsArray);
  }, [topics]);
  useEffect(function () {
    setTitle('');
    setSections('');
    setContent('');
    setExcerpt('');
    setCreatedPostId();
  }, [template]);
  var finalizePrompt = function finalizePrompt(prompt) {
    return prompt.replace('{LANGUAGE}', humanLanguage).replace('{WRITING_STYLE}', writingStyle).replace('{WRITING_TONE}', writingTone).replace('{PARAGRAPHS_PER_SECTION}', paragraphsCount).replace('{SECTIONS_COUNT}', sectionsCount);
  };

  // This allows to check if the placeholders are used in the prompts, and if so,
  // to show the corresponding form inputs
  var formInputs = useMemo(function () {
    var lookFor = function lookFor(str, arr) {
      return !!arr.find(function (item) {
        return item.includes(str);
      });
    };
    var arr = [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat];
    return {
      language: lookFor('{LANGUAGE}', arr),
      writingStyle: lookFor('{WRITING_STYLE}', arr),
      writingTone: lookFor('{WRITING_TONE}', arr),
      sectionsCount: lookFor('{SECTIONS_COUNT}', arr),
      paragraphsCount: lookFor('{PARAGRAPHS_PER_SECTION}', arr)
    };
  }, [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat, sectionsCount, paragraphsCount]);
  var onSubmitPrompt = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var promptToUse,
        maxTokens,
        isBulk,
        res,
        data,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            promptToUse = _args.length > 0 && _args[0] !== undefined ? _args[0] : prompt;
            maxTokens = _args.length > 1 && _args[1] !== undefined ? _args[1] : 2048;
            isBulk = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            _context.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.apiUrl, "/make_completions"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce,
              json: {
                env: 'admin-tools',
                session: _app_settings__WEBPACK_IMPORTED_MODULE_0__.session,
                prompt: promptToUse,
                temperature: temperature,
                maxTokens: maxTokens,
                model: model
              }
            });
          case 5:
            res = _context.sent;
            if (res.success) {
              _context.next = 11;
              break;
            }
            if (!isBulk) {
              _context.next = 9;
              break;
            }
            throw new Error(res.message);
          case 9:
            setError(res.message);
            return _context.abrupt("return", null);
          case 11:
            data = res.data.trim();
            if (data.startsWith('"') && data.endsWith('"')) {
              data = data.substring(1, data.length - 1);
            }
            return _context.abrupt("return", data);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onSubmitPrompt() {
      return _ref.apply(this, arguments);
    };
  }();
  var submitSectionsPrompt = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var inTitle,
        isBulk,
        prompt,
        freshSections,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            inTitle = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : title;
            isBulk = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            if (inTitle) {
              _context2.next = 5;
              break;
            }
            alert("Title is missing!");
            return _context2.abrupt("return");
          case 5:
            setBusy(true);
            setSections("");
            prompt = finalizePrompt(sectionsPromptFormat.replace('{TITLE}', inTitle));
            _context2.next = 10;
            return onSubmitPrompt(prompt, 512, isBulk);
          case 10:
            freshSections = _context2.sent;
            freshSections = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.cleanNumbering)(freshSections);
            console.log("Sections:", {
              prompt: prompt,
              sections: freshSections
            });
            if (freshSections) {
              setSections(freshSections);
            }
            setBusy(false);
            return _context2.abrupt("return", freshSections);
          case 16:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function submitSectionsPrompt() {
      return _ref2.apply(this, arguments);
    };
  }();
  var submitContentPrompt = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var inTitle,
        inSections,
        isBulk,
        prompt,
        freshContent,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            inTitle = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : title;
            inSections = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : sections;
            isBulk = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
            if (inTitle) {
              _context3.next = 6;
              break;
            }
            alert("Title is missing!");
            return _context3.abrupt("return");
          case 6:
            if (inSections) {
              _context3.next = 9;
              break;
            }
            alert("Sections are missing!");
            return _context3.abrupt("return");
          case 9:
            setBusy(true);
            setContent("");
            prompt = finalizePrompt(contentPromptFormat.replace('{TITLE}', inTitle).replace('{SECTIONS}', inSections));
            _context3.next = 14;
            return onSubmitPrompt(prompt, 2048, isBulk);
          case 14:
            freshContent = _context3.sent;
            if (freshContent) {
              freshContent = freshContent.replace(/^===INTRO:\n/, '');
              freshContent = freshContent.replace(/^===INTRO: \n/, '');
              freshContent = freshContent.replace(/===INTRO: /, '');
              freshContent = freshContent.replace(/===OUTRO:\n/, '');
              freshContent = freshContent.replace(/===OUTRO: \n/, '');
              freshContent = freshContent.replace(/===OUTRO: /, '');
              setContent(freshContent);
            }
            console.log("Content:", {
              prompt: prompt,
              content: freshContent
            });
            setBusy(false);
            return _context3.abrupt("return", freshContent);
          case 19:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function submitContentPrompt() {
      return _ref3.apply(this, arguments);
    };
  }();
  var onSubmitPromptForExcerpt = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var inTitle,
        isBulk,
        prompt,
        freshExcerpt,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            inTitle = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : title;
            isBulk = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
            if (inTitle) {
              _context4.next = 5;
              break;
            }
            alert("Title is missing!");
            return _context4.abrupt("return");
          case 5:
            setBusy(true);
            setExcerpt("");
            prompt = finalizePrompt(excerptPromptFormat.replace('{TITLE}', inTitle));
            _context4.next = 10;
            return onSubmitPrompt(prompt, 256, isBulk);
          case 10:
            freshExcerpt = _context4.sent;
            if (freshExcerpt) {
              setExcerpt(freshExcerpt);
            }
            console.log("Excerpt:", {
              prompt: prompt,
              excerpt: freshExcerpt
            });
            setBusy(false);
            return _context4.abrupt("return", freshExcerpt);
          case 15:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function onSubmitPromptForExcerpt() {
      return _ref4.apply(this, arguments);
    };
  }();
  var onGenerateAllClick = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var inTopic,
        isBulk,
        freshTitle,
        _prompt,
        _freshTitle,
        freshSections,
        freshContent,
        freshExcerpt,
        _args5 = arguments;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            inTopic = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : topic;
            isBulk = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : false;
            setBusy(true);
            setRunTimes(function () {
              return _objectSpread(_objectSpread({}, runTimes), {}, {
                all: new Date()
              });
            });
            _context5.prev = 4;
            freshTitle = inTopic;
            if (topicsAreTitles) {
              _context5.next = 12;
              break;
            }
            _prompt = finalizePrompt(titlePromptFormat.replace('{TOPIC}', inTopic));
            _context5.next = 10;
            return onSubmitPrompt(_prompt, 64, isBulk);
          case 10:
            _freshTitle = _context5.sent;
            console.log("Title:", {
              prompt: _prompt,
              title: _freshTitle
            });
          case 12:
            freshSections = null;
            freshContent = null;
            freshExcerpt = null;
            setBusy(false);
            if (!freshTitle) {
              _context5.next = 40;
              break;
            }
            setTitle(freshTitle);
            setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                sections: new Date()
              });
            });
            _context5.next = 21;
            return submitSectionsPrompt(freshTitle, isBulk);
          case 21:
            freshSections = _context5.sent;
            _context5.next = 24;
            return setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                sections: null
              });
            });
          case 24:
            if (!freshSections) {
              _context5.next = 40;
              break;
            }
            _context5.next = 27;
            return setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                content: new Date()
              });
            });
          case 27:
            _context5.next = 29;
            return submitContentPrompt(freshTitle, freshSections, isBulk);
          case 29:
            freshContent = _context5.sent;
            _context5.next = 32;
            return setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                content: null
              });
            });
          case 32:
            if (!freshContent) {
              _context5.next = 40;
              break;
            }
            _context5.next = 35;
            return setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                excerpt: new Date()
              });
            });
          case 35:
            _context5.next = 37;
            return onSubmitPromptForExcerpt(freshTitle, isBulk);
          case 37:
            freshExcerpt = _context5.sent;
            _context5.next = 40;
            return setRunTimes(function (x) {
              return _objectSpread(_objectSpread({}, x), {}, {
                excerpt: null
              });
            });
          case 40:
            return _context5.abrupt("return", {
              title: freshTitle,
              heads: freshSections,
              content: freshContent,
              excerpt: freshExcerpt
            });
          case 43:
            _context5.prev = 43;
            _context5.t0 = _context5["catch"](4);
            setBusy(false);
            setRunTimes({});
            throw _context5.t0;
          case 48:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[4, 43]]);
    }));
    return function onGenerateAllClick() {
      return _ref5.apply(this, arguments);
    };
  }();
  var onSubmitNewPost = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var inTitle,
        inContent,
        inExcerpt,
        isBulk,
        res,
        _args6 = arguments;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            inTitle = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : title;
            inContent = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : content;
            inExcerpt = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : excerpt;
            isBulk = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : false;
            setBusy(true);
            _context6.next = 7;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.apiUrl, "/create_post"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce,
              json: {
                title: inTitle,
                content: inContent,
                excerpt: inExcerpt
              }
            });
          case 7:
            res = _context6.sent;
            setBusy(false);
            if (res.success) {
              _context6.next = 12;
              break;
            }
            setError(res.message);
            return _context6.abrupt("return", null);
          case 12:
            if (!isBulk) {
              setCreatedPostId(res.postId);
            }
            return _context6.abrupt("return", res.postId);
          case 14:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function onSubmitNewPost() {
      return _ref6.apply(this, arguments);
    };
  }();
  var onBulkStart = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var tasks;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            setCreatedPosts([]);
            tasks = topicsArray.map(function (topic, offset) {
              return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
                var _yield$onGenerateAllC, _title, _content, _excerpt, postId;
                return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      console.log("Topic " + offset);
                      _context7.prev = 1;
                      _context7.next = 4;
                      return onGenerateAllClick(topic, true);
                    case 4:
                      _yield$onGenerateAllC = _context7.sent;
                      _title = _yield$onGenerateAllC.title;
                      _content = _yield$onGenerateAllC.content;
                      _excerpt = _yield$onGenerateAllC.excerpt;
                      if (!(_title && _content && _excerpt)) {
                        _context7.next = 15;
                        break;
                      }
                      _context7.next = 11;
                      return onSubmitNewPost(_title, _content, _excerpt, true);
                    case 11:
                      postId = _context7.sent;
                      setCreatedPosts(function (x) {
                        return [].concat(_toConsumableArray(x), [{
                          postId: postId,
                          topic: topic,
                          title: _title,
                          content: _content,
                          excerpt: _excerpt
                        }]);
                      });
                      _context7.next = 16;
                      break;
                    case 15:
                      console.warn("Could not generate the post for: " + topic);
                    case 16:
                      _context7.next = 21;
                      break;
                    case 18:
                      _context7.prev = 18;
                      _context7.t0 = _context7["catch"](1);
                      if (!confirm("An error was caught (" + _context7.t0.message + "). Should we continue?")) {
                        bulkTasks.stop();
                        bulkTasks.reset();
                        setBusy(false);
                      }
                    case 21:
                      return _context7.abrupt("return", {
                        success: true
                      });
                    case 22:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7, null, [[1, 18]]);
              }));
            });
            _context8.next = 4;
            return bulkTasks.start(tasks);
          case 4:
            bulkTasks.reset();
          case 5:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function onBulkStart() {
      return _ref7.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoPage, {
    nekoErrors: []
  }, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.AiNekoHeader, {
    title: "Content Generator"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_2__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_0__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTypo, {
    p: true,
    style: {
      marginTop: 0,
      marginBottom: 0
    }
  }, "Write a ", /*#__PURE__*/React.createElement("b", null, "Topic"), " (followed by a few keywords or details if necessary), and click ", /*#__PURE__*/React.createElement("b", null, "Generate All"), ". That's it! You can also write a Title, Generate Sections, Content, and Excerpt separately to perfect the results, or better, adapt the ", /*#__PURE__*/React.createElement("b", null, "Prompts"), " to personalize the results. Click on ", /*#__PURE__*/React.createElement("b", null, "Create Post"), " button when you're happy with the result. Ready for the next level? Try ", /*#__PURE__*/React.createElement("b", null, "Bulk Generate"), "! Join us on the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/support/plugin/ai-engine/"
  }, "Support Forums"), " \uD83D\uDE0A!")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Topic"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    id: "topic",
    name: "topic",
    disabled: isBusy || mode === 'bulk',
    rows: 5,
    value: topic,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, null), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    fullWidth: true,
    disabled: !topic || mode === 'bulk',
    isBusy: isBusy,
    startTime: runTimes === null || runTimes === void 0 ? void 0 : runTimes.all,
    onClick: function onClick() {
      return onGenerateAllClick();
    }
  }, "Generate All")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 50
  }), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, jsxTemplates)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, {
    style: {
      flex: 3
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoQuickLinks, {
    id: "mode",
    name: "mode",
    value: mode,
    disabled: isBusy,
    onChange: setTemplateProperty
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoLink, {
    title: "Single Generate",
    value: "single"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoLink, {
    title: "Bulk Generate",
    value: "bulk",
    count: topicsArray.length
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 40
  }), mode === 'bulk' && /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, null, /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0,
      marginBottom: 20
    }
  }, "Write or paste your topics below. Each line will be used as a topic. The same ", /*#__PURE__*/React.createElement("b", null, "Params"), " and ", /*#__PURE__*/React.createElement("b", null, "Prompts"), " will be used as with the ", /*#__PURE__*/React.createElement("b", null, "Single Generate"), ", so make sure you get satisfying results with it first. This ", /*#__PURE__*/React.createElement("b", null, "takes time"), ", so relax and enjoy some coffee \u2615\uFE0F and tea \uD83C\uDF75 :)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: isBusy || !topicsArray.length,
    onClick: onBulkStart
  }, "Generate"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10
    }
  }, topicsArray.length), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    id: "postType",
    scrolldown: true,
    disabled: isBusy,
    name: "postType",
    style: {
      width: 100,
      marginLeft: 10
    },
    onChange: setPostType,
    value: postType
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 'post',
    id: 'post',
    value: 'post',
    label: "Posts"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 'page',
    id: 'page',
    value: 'page',
    label: "Pages"
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_15__.NekoProgress, {
    busy: bulkTasks.busy,
    style: {
      marginLeft: 10,
      flex: 'auto'
    },
    value: bulkTasks.value,
    max: bulkTasks.max,
    onStopClick: bulkTasks.stop
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 40
  }), /*#__PURE__*/React.createElement("h3", null, "Topics"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    id: "topics",
    name: "topics",
    rows: 10,
    value: topics,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_16__.NekoCheckbox, {
    id: "topicsAreTitles",
    name: "topicsAreTitles",
    label: "Use Topics as Titles",
    value: "1",
    checked: topicsAreTitles,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement("h3", null, "Generated Posts"), !createdPosts.length && /*#__PURE__*/React.createElement("i", null, "Nothing yet."), createdPosts.length > 0 && /*#__PURE__*/React.createElement("ul", null, createdPosts.map(function (x) {
    return /*#__PURE__*/React.createElement("li", null, x.title, " ", /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      href: "/?p=".concat(x.postId)
    }, "View"), " or ", /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      href: "/wp-admin/post.php?post=".concat(x.postId, "&action=edit")
    }, "Edit"));
  }))), mode === 'single' && /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Title"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_17__.NekoInput, {
    disabled: isBusy,
    value: title,
    onChange: setTitle
  }), titleMessage && /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "Advice: ", titleMessage), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Sections"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, formInputs.sectionsCount && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    style: {
      margin: '0 5px 0 0'
    }
  }, "# of Sections: "), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    scrolldown: true,
    id: "sectionsCount",
    name: "sectionsCount",
    disabled: isBusy,
    style: {
      marginRight: 10
    },
    value: sectionsCount,
    description: "",
    onChange: setTemplateProperty
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 2,
    id: 2,
    value: 2,
    label: 2
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 3,
    id: 3,
    value: 3,
    label: 3
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 4,
    id: 4,
    value: 4,
    label: 4
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 6,
    id: 6,
    value: 6,
    label: 6
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 8,
    id: 8,
    value: 8,
    label: 8
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 10,
    id: 10,
    value: 10,
    label: 10
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 12,
    id: 12,
    value: 12,
    label: 12
  }))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: isBusy,
    startTime: runTimes === null || runTimes === void 0 ? void 0 : runTimes.sections,
    onClick: function onClick() {
      return submitSectionsPrompt();
    }
  }, "Generate Sections"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    rows: 4,
    value: sections,
    onBlur: setSections
  }), /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "Add, rewrite, remove, or reorganize those sections as you wish before (re)clicking on \"Generate Content\". Markdown format is recommended."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Content"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, formInputs.paragraphsCount && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    style: {
      margin: '0 5px 0 0'
    }
  }, "# of Paragraphs per Section: "), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    scrolldown: true,
    id: "paragraphsCount",
    name: "paragraphsCount",
    disabled: isBusy,
    style: {
      marginRight: 10
    },
    value: paragraphsCount,
    description: "",
    onChange: setTemplateProperty
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 1,
    id: 1,
    value: 1,
    label: 1
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 2,
    id: 2,
    value: 2,
    label: 2
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 3,
    id: 3,
    value: 3,
    label: 3
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 4,
    id: 4,
    value: 4,
    label: 4
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 6,
    id: 6,
    value: 6,
    label: 6
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 8,
    id: 8,
    value: 8,
    label: 8
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
    key: 10,
    id: 10,
    value: 10,
    label: 10
  }))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: isBusy,
    startTime: runTimes === null || runTimes === void 0 ? void 0 : runTimes.content,
    onClick: function onClick() {
      return submitContentPrompt();
    }
  }, "Generate Content"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    rows: 12,
    value: content,
    onBlur: setContent
  }), /*#__PURE__*/React.createElement("div", {
    className: "information"
  }, "You can modify the content before using \"Create Post\". Markdown is supported, and will be converted to HTML when the post is created."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Excerpt"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    disabled: !title,
    isBusy: isBusy,
    startTime: runTimes === null || runTimes === void 0 ? void 0 : runTimes.excerpt,
    onClick: function onClick() {
      return onSubmitPromptForExcerpt();
    }
  }, "Generate Excerpt")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    value: excerpt,
    onBlur: setExcerpt,
    rows: 3
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    fullWidth: true,
    style: {
      height: 60
    },
    onClick: function onClick() {
      return onSubmitNewPost();
    },
    isBusy: isBusy,
    disabled: !title || !content
  }, "Create Post"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoColumn, null, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Content Params"), !formInputs.language && !formInputs.writingStyle && !formInputs.writingTone && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      lineHeight: '14px'
    }
  }, "Input fields are displayed for certain placeholders used in prompts, such as ", "{", "LANGUAGE", "}", " or ", "{", "WRITING_TONE", "}", "."), formInputs.language && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Language:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    scrolldown: true,
    id: "language",
    name: "language",
    disabled: isBusy,
    value: language,
    description: "",
    onChange: setTemplateProperty
  }, languages.map(function (lang) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
      key: lang.value,
      id: lang.value,
      value: lang.value,
      label: lang.label
    });
  }))), formInputs.writingStyle && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Writing style:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    scrolldown: true,
    id: "writingStyle",
    name: "writingStyle",
    disabled: isBusy,
    value: writingStyle,
    description: "",
    onChange: setTemplateProperty
  }, _constants__WEBPACK_IMPORTED_MODULE_18__.WritingStyles.map(function (style) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
      key: style.value,
      id: style.value,
      value: style.value,
      label: style.label
    });
  }))), formInputs.writingTone && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Writing tone:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    scrolldown: true,
    id: "writingTone",
    name: "writingTone",
    disabled: isBusy,
    value: writingTone,
    description: "",
    onChange: setTemplateProperty
  }, _constants__WEBPACK_IMPORTED_MODULE_18__.WritingTones.map(function (tone) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
      key: tone.value,
      id: tone.value,
      value: tone.value,
      label: tone.label
    });
  })))), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, {
    style: {
      marginTop: 25,
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Model Params"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    onClick: function onClick() {
      return setShowModelParams(!showModelParams);
    }
  }, showModelParams ? 'Hide' : 'Show')), showModelParams && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
    id: "model",
    name: "model ",
    value: model,
    scrolldown: true,
    onChange: setTemplateProperty
  }, models.map(function (x) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
      value: x.id,
      label: x.name
    });
  })), /*#__PURE__*/React.createElement("label", null, "Temperature:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_17__.NekoInput, {
    id: "temperature",
    name: "temperature",
    value: temperature,
    type: "number",
    onChange: setTemplateProperty,
    onBlur: setTemplateProperty,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red'
      }
    }, "Between 0 and 1."), " Higher values means the model will take more risks.")
  }), /*#__PURE__*/React.createElement("label", null, "Max Tokens:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_17__.NekoInput, {
    id: "maxTokens",
    name: "maxTokens",
    value: maxTokens,
    type: "number",
    onChange: setTemplateProperty,
    onBlur: setTemplateProperty,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: maxTokens >= 1 && maxTokens <= 4096 ? 'inherit' : 'red'
      }
    }, "Between 1 and 2048."), " Higher values means the model will generate more content.")
  }))), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, null, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_6__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Prompts"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoButton, {
    onClick: function onClick() {
      return setShowPrompts(!showPrompts);
    }
  }, showPrompts ? 'Hide' : 'Show')), showPrompts && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '14px'
    }
  }, "Prompts represent the exact request sent to the AI. The variables between curly braces will be replaced by the content of the corresponding field. Prompts are saved in your templates."), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Title")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    id: "titlePromptFormat",
    name: "titlePromptFormat",
    value: titlePromptFormat,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Sections")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    id: "sectionsPromptFormat",
    name: "sectionsPromptFormat",
    value: sectionsPromptFormat,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Content")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    id: "contentPromptFormat",
    name: "contentPromptFormat",
    value: contentPromptFormat,
    onChange: setTemplateProperty
  }), /*#__PURE__*/React.createElement("label", null, "Prompt for ", /*#__PURE__*/React.createElement("b", null, "Excerpt")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTextArea, {
    disabled: isBusy,
    id: "excerptPromptFormat",
    name: "excerptPromptFormat",
    value: excerptPromptFormat,
    onChange: setTemplateProperty
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoModal, {
    isOpen: createdPostId,
    onRequestClose: function onRequestClose() {
      return setCreatedPostId();
    },
    onOkClick: function onOkClick() {
      window.open("/wp-admin/post.php?post=".concat(createdPostId, "&action=edit"), '_blank');
      resetTemplate();
    },
    ok: "Edit the Post",
    cancel: "Close",
    onCancelClick: function onCancelClick() {
      return resetTemplate();
    },
    title: "Post Created!",
    content: /*#__PURE__*/React.createElement("p", null, "The post was created as draft.")
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoModal, {
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

/***/ "./app/js/screens/FineTuning.js":
/*!**************************************!*\
  !*** ./app/js/screens/FineTuning.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs");
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/useQuery.mjs");
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! papaparse */ "./node_modules/papaparse/papaparse.min.js");
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(papaparse__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/common/NekoTheme.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Icon.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Switch.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Links.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/table/Table.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/UploadDropArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Paging.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Spacer.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _FineTuning_DatasetBuilder__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./FineTuning/DatasetBuilder */ "./app/js/screens/FineTuning/DatasetBuilder.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useMemo = _wp$element.useMemo,
  useRef = _wp$element.useRef,
  useEffect = _wp$element.useEffect;



// NekoUI





var builderColumns = [{
  accessor: 'row',
  title: "#",
  width: 15,
  verticalAlign: 'top'
}, {
  accessor: 'validPrompt',
  title: "",
  width: 15,
  verticalAlign: 'top'
}, {
  accessor: 'prompt',
  title: 'Prompt',
  width: '42%',
  verticalAlign: 'top'
}, {
  accessor: 'validCompletion',
  title: "",
  width: 15,
  verticalAlign: 'top'
}, {
  accessor: 'completion',
  title: 'Completion',
  width: '42%',
  verticalAlign: 'top'
}, {
  accessor: 'actions',
  title: '',
  width: 55,
  align: 'center'
}];
var fileColumns = [{
  accessor: 'status',
  title: 'Status',
  sortable: true
}, {
  accessor: 'id',
  title: 'ID'
}, {
  accessor: 'filename',
  title: 'File'
}, {
  accessor: 'purpose',
  title: 'Purpose'
}, {
  accessor: 'filesize',
  title: 'Size',
  sortable: true
}, {
  accessor: 'createdOn',
  title: 'Date',
  sortable: true
}, {
  accessor: 'actions',
  title: ''
}];
var fineTuneColumns = [{
  accessor: 'status',
  title: 'Status',
  sortable: true
}, {
  accessor: 'id',
  title: 'ID'
}, {
  accessor: 'suffix',
  title: 'Suffix'
}, {
  accessor: 'model',
  title: 'Model'
}, {
  accessor: 'base_model',
  title: 'Based On'
}, {
  accessor: 'createdOn',
  title: 'Date',
  sortable: true
}, {
  accessor: 'actions',
  title: ''
}];
var defaultPromptEnding = "\n\n###\n\n";
var defaultCompletionEnding = "\n\n";

// Status can be: pending, succeeded, failed, or cancelled
var StatusIcon = function StatusIcon(_ref) {
  var status = _ref.status,
    _ref$includeText = _ref.includeText,
    includeText = _ref$includeText === void 0 ? false : _ref$includeText;
  var orange = _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].orange;
  var green = _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].green;
  var red = _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].red;

  // Let's set the right icon and color based on the status
  var icon = null;
  switch (status) {
    case 'pending':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "replay",
        spinning: true,
        width: 24,
        color: orange
      });
      break;
    case 'running':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "replay",
        spinning: true,
        width: 24,
        color: orange
      });
      break;
    case 'succeeded':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "check-circle",
        width: 24,
        color: green
      });
      break;
    case 'processed':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "check-circle",
        width: 24,
        color: green
      });
      break;
    case 'failed':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "close",
        width: 24,
        color: red
      });
      break;
    case 'cancelled':
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "close",
        width: 24,
        color: orange
      });
      break;
    default:
      icon = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoIcon, {
        title: status,
        icon: "alert",
        width: 24,
        color: orange
      });
      break;
  }
  if (includeText) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, icon, /*#__PURE__*/React.createElement("span", {
      style: {
        textTransform: 'uppercase',
        fontSize: 10,
        marginLeft: 5
      }
    }, status));
  }
  return icon;
};
var retrieveFiles = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _res$files;
    var res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_files"), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce
          });
        case 2:
          res = _context.sent;
          return _context.abrupt("return", res === null || res === void 0 ? void 0 : (_res$files = res.files) === null || _res$files === void 0 ? void 0 : _res$files.data);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function retrieveFiles() {
    return _ref2.apply(this, arguments);
  };
}();
var retrieveFineTunes = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _res$finetunes;
    var res;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_finetunes"), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce
          });
        case 2:
          res = _context2.sent;
          return _context2.abrupt("return", res === null || res === void 0 ? void 0 : (_res$finetunes = res.finetunes) === null || _res$finetunes === void 0 ? void 0 : _res$finetunes.data);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function retrieveFineTunes() {
    return _ref3.apply(this, arguments);
  };
}();
var EditableText = function EditableText(_ref4) {
  var children = _ref4.children,
    data = _ref4.data,
    _ref4$onChange = _ref4.onChange,
    onChange = _ref4$onChange === void 0 ? function () {} : _ref4$onChange;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isEdit = _useState2[0],
    setIsEdit = _useState2[1];
  var onSave = function onSave(value) {
    setIsEdit(false);
    if (value !== data) {
      onChange(value);
    }
  };
  var onKeyPress = function onKeyPress(e) {
    if (e.key === 'Escape') {
      onSave(data);
    }
  };
  if (isEdit) {
    return /*#__PURE__*/React.createElement("div", {
      onKeyUp: onKeyPress,
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoTextArea, {
      onBlurForce: true,
      autoFocus: true,
      fullHeight: true,
      rows: 3,
      style: {
        height: '100%'
      },
      onEnter: onSave,
      onBlur: onSave,
      value: data
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
      onClick: onSave,
      fullWidth: true,
      style: {
        marginTop: 5,
        height: 35
      }
    }, "Save"));
  }
  return /*#__PURE__*/React.createElement("pre", {
    style: {
      width: '100%',
      height: '100%',
      whiteSpace: 'break-spaces',
      margin: 0,
      padding: 0,
      fontSize: 13,
      fontFamily: 'inherit'
    },
    onClick: function onClick() {
      return setIsEdit(true);
    }
  }, children);
};
var FineTuning = function FineTuning(_ref5) {
  var _fineTuneRows$length, _fileRows$length, _builderData$length;
  var options = _ref5.options,
    updateOption = _ref5.updateOption;
  var queryClient = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_7__.useQueryClient)();
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    fileForFineTune = _useState4[0],
    setFileForFineTune = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    busyAction = _useState6[0],
    setBusyAction = _useState6[1];
  var _useState7 = useState('finetunes'),
    _useState8 = _slicedToArray(_useState7, 2),
    section = _useState8[0],
    setSection = _useState8[1];
  var _useState9 = useState('editor'),
    _useState10 = _slicedToArray(_useState9, 2),
    dataSection = _useState10[0],
    setDataSection = _useState10[1];
  var _useState11 = useState(true),
    _useState12 = _slicedToArray(_useState11, 2),
    isModeTrain = _useState12[0],
    setIsModeTrain = _useState12[1];
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_8__.useModels)(options),
    models = _useModels.models,
    model = _useModels.model,
    setModel = _useModels.setModel;
  var _useState13 = useState('meow'),
    _useState14 = _slicedToArray(_useState13, 2),
    suffix = _useState14[0],
    setSuffix = _useState14[1];
  var _useQuery = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_9__.useQuery)({
      queryKey: ['datasets'],
      queryFn: retrieveFiles
    }),
    isBusyFiles = _useQuery.isLoading,
    errFiles = _useQuery.error,
    dataFiles = _useQuery.data;
  var _useQuery2 = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_9__.useQuery)({
      queryKey: ['finetunes'],
      queryFn: retrieveFineTunes
    }),
    isBusyFineTunes = _useQuery2.isLoading,
    errFineTunes = _useQuery2.error,
    dataFineTunes = _useQuery2.data;
  var deletedFineTunes = (options === null || options === void 0 ? void 0 : options.openai_finetunes_deleted) || [];

  // For the builder
  var rowsPerPage = 10;
  var _useState15 = useState(true),
    _useState16 = _slicedToArray(_useState15, 2),
    hasStorageBackup = _useState16[0],
    setHasStorageBackup = _useState16[1];
  var _useState17 = useState(1),
    _useState18 = _slicedToArray(_useState17, 2),
    currentPage = _useState18[0],
    setCurrentPage = _useState18[1];
  var _useState19 = useState([]),
    _useState20 = _slicedToArray(_useState19, 2),
    builderData = _useState20[0],
    setBuilderData = _useState20[1];
  var _useState21 = useState(''),
    _useState22 = _slicedToArray(_useState21, 2),
    filename = _useState22[0],
    setFilename = _useState22[1];
  var totalRows = useMemo(function () {
    return builderData.length;
  }, [builderData]);
  var onDeleteRow = function onDeleteRow(line) {
    var newData = builderData.filter(function (x, i) {
      return i !== line - 1;
    });
    setBuilderData(newData);
    if (newData.length === 0) {
      updateLocalStorage([]);
    }
  };
  var refreshFiles = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return queryClient.invalidateQueries('datasets');
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function refreshFiles() {
      return _ref6.apply(this, arguments);
    };
  }();
  var onRefreshFiles = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            setBusyAction(true);
            _context4.next = 3;
            return refreshFiles();
          case 3:
            setBusyAction(false);
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function onRefreshFiles() {
      return _ref7.apply(this, arguments);
    };
  }();
  var onStartFineTune = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var currentFile, currentSuffix, rawModel, isFineTuned, res;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            currentFile = fileForFineTune;
            currentSuffix = suffix;
            rawModel = models.find(function (x) {
              return x.id === model;
            });
            setBusyAction(true);
            isFineTuned = rawModel["short"].startsWith('fn-');
            _context5.next = 7;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_files_finetune"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce,
              json: {
                fileId: currentFile,
                model: isFineTuned ? rawModel.id : rawModel["short"],
                suffix: currentSuffix
              }
            });
          case 7:
            res = _context5.sent;
            if (!res.success) {
              _context5.next = 16;
              break;
            }
            _context5.next = 11;
            return refreshFineTunes();
          case 11:
            alert("Fine-tuning started! Check its progress in the 'Models' section. Depending on your dataset size, it may take a while (from a few minutes to days).");
            setSection('finetunes');
            setFileForFineTune();
            _context5.next = 17;
            break;
          case 16:
            alert(res.message);
          case 17:
            setBusyAction(false);
          case 18:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function onStartFineTune() {
      return _ref8.apply(this, arguments);
    };
  }();
  var refreshFineTunes = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return queryClient.invalidateQueries('finetunes');
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function refreshFineTunes() {
      return _ref9.apply(this, arguments);
    };
  }();
  var onRefreshFineTunes = /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            setBusyAction(true);
            _context7.next = 3;
            return refreshFineTunes();
          case 3:
            setBusyAction(false);
          case 4:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function onRefreshFineTunes() {
      return _ref10.apply(this, arguments);
    };
  }();
  var resetFilename = function resetFilename() {
    var now = new Date();
    var prefix = now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    prefix = prefix.replace(/\//g, '.');
    prefix += '-' + now.getHours().toString().padStart(2, '0') + '.' + now.getMinutes().toString().padStart(2, '0');
    setFilename("MEOW-".concat(prefix, ".jsonl"));
  };
  var onResetBuilder = function onResetBuilder() {
    var askForConfirmation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (askForConfirmation && !confirm('This will delete all the rows in the builder. Are you sure?')) {
      return;
    }
    setBuilderData([]);
    updateLocalStorage([]);
  };
  var onUpdateDataRow = function onUpdateDataRow(line, value) {
    var isCompletion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var newData = builderData.map(function (x, i) {
      if (i === line - 1) {
        if (isCompletion) {
          return _objectSpread(_objectSpread({}, x), {}, {
            completion: value
          });
        }
        return _objectSpread(_objectSpread({}, x), {}, {
          prompt: value
        });
      }
      return x;
    });
    setBuilderData(newData);
  };

  // Load the builder data from local storage
  useEffect(function () {
    if (!builderData || builderData.length === 0) {
      var data = localStorage.getItem('mwai_builder_data');
      if (data) {
        setBuilderData(JSON.parse(data));
      }
    }
  }, []);
  var updateLocalStorage = function updateLocalStorage(data) {
    resetFilename();
    try {
      if (!data) {
        localStorage.removeItem('mwai_builder_data');
      } else {
        localStorage.setItem('mwai_builder_data', JSON.stringify(data));
      }
      setHasStorageBackup(true);
    } catch (err) {
      localStorage.removeItem('mwai_builder_data');
      setHasStorageBackup(false);
    }
  };

  // Save the builder data to local storage
  useEffect(function () {
    if (builderData && builderData.length > 0) {
      updateLocalStorage(builderData);
    }
  }, [builderData]);
  var builderRows = useMemo(function () {
    var line = (currentPage - 1) * rowsPerPage;
    var chunkOfBuilderData = builderData === null || builderData === void 0 ? void 0 : builderData.slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage);
    return chunkOfBuilderData === null || chunkOfBuilderData === void 0 ? void 0 : chunkOfBuilderData.map(function (x) {
      var _x$prompt, _x$completion;
      var currentLine = ++line;
      var isValidPrompt = x === null || x === void 0 ? void 0 : (_x$prompt = x.prompt) === null || _x$prompt === void 0 ? void 0 : _x$prompt.toString().endsWith(defaultPromptEnding);
      var isValidCompletion = x === null || x === void 0 ? void 0 : (_x$completion = x.completion) === null || _x$completion === void 0 ? void 0 : _x$completion.toString().endsWith(defaultCompletionEnding);
      return {
        row: currentLine,
        validPrompt: isValidPrompt ? '✅' : '❌',
        prompt: /*#__PURE__*/React.createElement(EditableText, {
          data: x.prompt,
          onChange: function onChange(value) {
            return onUpdateDataRow(currentLine, value);
          }
        }, isValidPrompt ? x.prompt.substring(0, x.prompt.length - defaultPromptEnding.length) : x.prompt),
        validCompletion: isValidCompletion ? '✅' : '❌',
        completion: /*#__PURE__*/React.createElement(EditableText, {
          data: x.completion,
          onChange: function onChange(value) {
            return onUpdateDataRow(currentLine, value, true);
          }
        }, isValidCompletion ? x.completion.substring(0, x.completion.length - defaultCompletionEnding.length) : x.completion),
        actions: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
          rounded: true,
          icon: "trash",
          onClick: function onClick() {
            return onDeleteRow(currentLine);
          }
        })
      };
    });
  }, [builderData, currentPage, rowsPerPage]);
  var deleteFile = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(fileId) {
      var res;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            setBusyAction(true);
            _context8.prev = 1;
            _context8.next = 4;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_files"), {
              method: 'DELETE',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce,
              json: {
                fileId: fileId
              }
            });
          case 4:
            res = _context8.sent;
            if (!res.success) {
              _context8.next = 10;
              break;
            }
            _context8.next = 8;
            return refreshFiles();
          case 8:
            _context8.next = 11;
            break;
          case 10:
            alert(res.message);
          case 11:
            _context8.next = 17;
            break;
          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](1);
            console.log(_context8.t0);
            alert("Error! Check your console.");
          case 17:
            setBusyAction(false);
          case 18:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[1, 13]]);
    }));
    return function deleteFile(_x2) {
      return _ref11.apply(this, arguments);
    };
  }();
  var deleteFineTune = /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(modelId) {
      var res;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            if (confirm('You are going to delete this fine-tune. Are you sure?\n\nPlease note that it will take a while before it is actually deleted. This might be a temporary issue of OpenAI.')) {
              _context9.next = 2;
              break;
            }
            return _context9.abrupt("return");
          case 2:
            setBusyAction(true);
            _context9.prev = 3;
            _context9.next = 6;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_finetunes"), {
              method: 'DELETE',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce,
              json: {
                modelId: modelId
              }
            });
          case 6:
            res = _context9.sent;
            if (!res.success) {
              _context9.next = 14;
              break;
            }
            _context9.next = 10;
            return updateOption([].concat(_toConsumableArray(deletedFineTunes), [modelId]), 'openai_finetunes_deleted');
          case 10:
            _context9.next = 12;
            return refreshFineTunes();
          case 12:
            _context9.next = 23;
            break;
          case 14:
            if (!(res.message.indexOf('does not exist') > -1)) {
              _context9.next = 22;
              break;
            }
            alert("This fine-tune was already deleted. It will be removed from the list.");
            _context9.next = 18;
            return updateOption([].concat(_toConsumableArray(deletedFineTunes), [modelId]), 'openai_finetunes_deleted');
          case 18:
            _context9.next = 20;
            return refreshFineTunes();
          case 20:
            _context9.next = 23;
            break;
          case 22:
            alert(res.message);
          case 23:
            _context9.next = 29;
            break;
          case 25:
            _context9.prev = 25;
            _context9.t0 = _context9["catch"](3);
            console.log(_context9.t0);
            alert("Error! Check your console.");
          case 29:
            setBusyAction(false);
          case 30:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[3, 25]]);
    }));
    return function deleteFineTune(_x3) {
      return _ref12.apply(this, arguments);
    };
  }();
  var downloadFile = /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(fileId, filename) {
      var res, blob, url, link;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            setBusyAction(true);
            _context10.prev = 1;
            console.log({
              fileId: fileId,
              filename: filename
            });
            _context10.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_files_download"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce,
              json: {
                fileId: fileId
              }
            });
          case 5:
            res = _context10.sent;
            if (res.success) {
              console.log(res);
              blob = new Blob([res.data], {
                type: 'text/plain'
              });
              url = window.URL.createObjectURL(blob);
              link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', "".concat(filename));
              document.body.appendChild(link);
              link.click();
              link.remove();
            } else {
              alert(res.message);
            }
            _context10.next = 13;
            break;
          case 9:
            _context10.prev = 9;
            _context10.t0 = _context10["catch"](1);
            console.log(_context10.t0);
            alert("Error! Check your console.");
          case 13:
            setBusyAction(false);
          case 14:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[1, 9]]);
    }));
    return function downloadFile(_x4, _x5) {
      return _ref13.apply(this, arguments);
    };
  }();
  var fileRows = useMemo(function () {
    // Sort the dataFiles by created_at
    return dataFiles === null || dataFiles === void 0 ? void 0 : dataFiles.sort(function (a, b) {
      return b.created_at - a.created_at;
    }).map(function (x) {
      var currentId = x.id;
      var currentFilename = x.filename;
      var createdOn = new Date(x.created_at * 1000);
      var forFineTune = x.purpose === 'fine-tune';
      return {
        status: /*#__PURE__*/React.createElement(StatusIcon, {
          status: x.status,
          includeText: true
        }),
        id: currentId,
        filename: currentFilename,
        purpose: x.purpose,
        filesize: (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.formatBytes)(x.bytes),
        createdOn: createdOn.toLocaleDateString() + ' ' + createdOn.toLocaleTimeString(),
        actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
          disabled: !forFineTune,
          icon: "wand",
          onClick: function onClick() {
            return setFileForFineTune(currentId);
          }
        }, "Train Model"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
          rounded: true,
          icon: "arrow-down",
          onClick: function onClick() {
            return downloadFile(currentId, currentFilename);
          }
        }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
          className: "danger",
          rounded: true,
          icon: "trash",
          onClick: function onClick() {
            return deleteFile(currentId);
          }
        }))
      };
    });
  }, [dataFiles]);
  var fineTuneRows = useMemo(function () {
    if (!dataFineTunes) {
      return [];
    }
    return dataFineTunes.sort(function (a, b) {
      return b.created_at - a.created_at;
    }).map(function (x) {
      var currentModel = x.fine_tuned_model;
      var createdOn = new Date(x.created_at * 1000);
      return {
        status: /*#__PURE__*/React.createElement(StatusIcon, {
          status: x.status,
          includeText: true
        }),
        id: x.id,
        suffix: x.suffix,
        model: x.fine_tuned_model,
        base_model: x.model,
        createdOn: createdOn.toLocaleDateString() + ' ' + createdOn.toLocaleTimeString(),
        actions: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
          className: "danger",
          rounded: true,
          icon: "trash",
          onClick: function onClick() {
            return deleteFineTune(currentModel);
          }
        })
      };
    });
  }, [dataFineTunes]);
  var busy = isBusyFiles || busyAction;
  var exportAsCSV = function exportAsCSV() {
    var csv = papaparse__WEBPACK_IMPORTED_MODULE_0___default().unparse(builderData);
    var blob = new Blob([csv], {
      type: 'text/csv'
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    var date = new Date();
    // Create a filename based on the current date with the time

    var filename = "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate(), "-WP.csv");
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  var onUploadDataSet = /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var data, res;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            setBusyAction(true);
            _context11.prev = 1;
            data = builderData.map(function (x) {
              var json = JSON.stringify(x);
              return json;
            }).join("\n");
            console.log(data);
            _context11.next = 6;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_3__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_4__.apiUrl, "/openai_files"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_4__.restNonce,
              json: {
                filename: filename,
                data: data
              }
            });
          case 6:
            res = _context11.sent;
            _context11.next = 9;
            return refreshFiles();
          case 9:
            if (res.success) {
              onResetBuilder(false);
              alert("Uploaded successfully! You can now train a model based on this dataset.");
              setSection('files');
              setIsModeTrain(true);
            } else {
              alert(res.message);
            }
            _context11.next = 16;
            break;
          case 12:
            _context11.prev = 12;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0);
            alert("Error! Check your console.");
          case 16:
            setBusyAction(false);
          case 17:
          case "end":
            return _context11.stop();
        }
      }, _callee11, null, [[1, 12]]);
    }));
    return function onUploadDataSet() {
      return _ref14.apply(this, arguments);
    };
  }();
  var modelNamePreview = useMemo(function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // getMonth returns a 0-based value
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var rawModel = models.find(function (x) {
      return x.id === model;
    });
    return "".concat(rawModel === null || rawModel === void 0 ? void 0 : rawModel["short"], ":ft-your-org:").concat(suffix, "-").concat(year, "-").concat(month < 10 ? '0' + month : month, "-").concat(day < 10 ? '0' + day : day, "-").concat(hours < 10 ? '0' + hours : hours, "-").concat(minutes < 10 ? '0' + minutes : minutes, "-").concat(seconds < 10 ? '0' + seconds : seconds);
  }, [suffix, model]);
  var onSelectFiles = /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(files) {
      var _loop, i, _ret;
      return _regeneratorRuntime().wrap(function _callee13$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var file, reader, isJson, isJsonl, isCsv;
              return _regeneratorRuntime().wrap(function _loop$(_context13) {
                while (1) switch (_context13.prev = _context13.next) {
                  case 0:
                    file = files[i];
                    reader = new FileReader();
                    isJson = file.name.endsWith('.json');
                    isJsonl = file.name.endsWith('.jsonl');
                    isCsv = file.name.endsWith('.csv');
                    if (!(!isJson && !isJsonl && !isCsv)) {
                      _context13.next = 9;
                      break;
                    }
                    alert("This only supports JSON, JSONL, and CSV files.");
                    console.log(file);
                    return _context13.abrupt("return", "continue");
                  case 9:
                    reader.onload = /*#__PURE__*/function () {
                      var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(e) {
                        var fileContent, data, lines, resParse, formattedData, cleanData, hadEmptyLines, findEmpty;
                        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
                          while (1) switch (_context12.prev = _context12.next) {
                            case 0:
                              fileContent = e.target.result;
                              data = [];
                              if (isJson) {
                                data = JSON.parse(fileContent);
                              } else if (isJsonl) {
                                lines = fileContent.split('\n');
                                data = lines.map(function (x) {
                                  x = x.trim();
                                  try {
                                    return JSON.parse(x);
                                  } catch (e) {
                                    console.log(e, x);
                                    return null;
                                  }
                                });
                              } else if (isCsv) {
                                resParse = papaparse__WEBPACK_IMPORTED_MODULE_0___default().parse(fileContent, {
                                  header: true,
                                  skipEmptyLines: true
                                });
                                data = resParse.data;
                                console.log('The CSV was loaded.', data);
                              }
                              formattedData = data.map(function (x) {
                                var values = Object.keys(x).reduce(function (acc, key) {
                                  acc[key.toLowerCase()] = x[key];
                                  return acc;
                                }, {});
                                var promptColumns = ['prompt', 'question', 'q'];
                                var completionColumns = ['completion', 'answer', 'a'];
                                var promptKey = promptColumns.find(function (x) {
                                  return values[x];
                                });
                                var completionKey = completionColumns.find(function (x) {
                                  return values[x];
                                });
                                return {
                                  prompt: values[promptKey],
                                  completion: values[completionKey]
                                };
                              });
                              cleanData = formattedData.filter(function (x) {
                                return x.prompt && x.completion;
                              });
                              hadEmptyLines = formattedData.length !== cleanData.length; //console.log({ formattedData, cleanData });
                              if (hadEmptyLines) {
                                alert("Some are were empty. Make sure the CSV has a header row and that the columns are named 'prompt' and 'completion'. For debugging, an empty line was logged to the console.");
                                findEmpty = formattedData.find(function (x) {
                                  return !x.prompt || !x.completion;
                                });
                                console.log('Empty line: ', findEmpty);
                              }
                              setBuilderData(cleanData);
                            case 8:
                            case "end":
                              return _context12.stop();
                          }
                        }, _callee12);
                      }));
                      return function (_x7) {
                        return _ref16.apply(this, arguments);
                      };
                    }();
                    reader.readAsText(file);
                  case 11:
                  case "end":
                    return _context13.stop();
                }
              }, _loop);
            });
            i = 0;
          case 2:
            if (!(i < files.length)) {
              _context14.next = 10;
              break;
            }
            return _context14.delegateYield(_loop(), "t0", 4);
          case 4:
            _ret = _context14.t0;
            if (!(_ret === "continue")) {
              _context14.next = 7;
              break;
            }
            return _context14.abrupt("continue", 7);
          case 7:
            i++;
            _context14.next = 2;
            break;
          case 10:
          case "end":
            return _context14.stop();
        }
      }, _callee13);
    }));
    return function onSelectFiles(_x6) {
      return _ref15.apply(this, arguments);
    };
  }();
  var addRow = function addRow() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Text...\n\n###\n\n';
    var completion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Text...\n\n';
    console.log(prompt, completion);
    setBuilderData([].concat(_toConsumableArray(builderData), [{
      prompt: prompt,
      completion: completion
    }]));
  };
  var onFormatWithDefaults = function onFormatWithDefaults() {
    var newBuilderData = builderData.map(function (x) {
      var prompt = x.prompt;
      var completion = x.completion;
      if (!prompt.endsWith(defaultPromptEnding)) {
        prompt += defaultPromptEnding;
      }
      if (!completion.endsWith(defaultCompletionEnding)) {
        completion += defaultCompletionEnding;
      }
      return {
        prompt: prompt,
        completion: completion
      };
    });
    setBuilderData(newBuilderData);
  };
  var ref = useRef(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoContainer, {
    style: {
      margin: 10
    },
    contentStyle: {
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: 15
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoSwitch, {
    onLabel: "Model Finetune",
    offLabel: "Dataset Builder",
    width: 145,
    onBackgroundColor: _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].purple,
    offBackgroundColor: _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].green,
    onChange: setIsModeTrain,
    checked: isModeTrain
  })), isModeTrain && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoQuickLinks, {
    value: section,
    busy: busy,
    onChange: function onChange(value) {
      setSection(value);
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoLink, {
    title: "Models",
    value: "finetunes",
    count: (_fineTuneRows$length = fineTuneRows === null || fineTuneRows === void 0 ? void 0 : fineTuneRows.length) !== null && _fineTuneRows$length !== void 0 ? _fineTuneRows$length : null
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoLink, {
    title: "Datasets",
    value: "files",
    count: (_fileRows$length = fileRows === null || fileRows === void 0 ? void 0 : fileRows.length) !== null && _fileRows$length !== void 0 ? _fileRows$length : null
  })), isModeTrain && section === 'finetunes' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: busyAction,
    onClick: onRefreshFineTunes,
    className: "primary"
  }, "Refresh Models")), isModeTrain && section === 'files' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: busyAction,
    onClick: onRefreshFiles,
    className: "primary"
  }, "Refresh Datasets")), !isModeTrain && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoQuickLinks, {
    value: dataSection,
    onChange: function onChange(value) {
      setDataSection(value);
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoLink, {
    title: "Entries Editor",
    value: "editor",
    count: (_builderData$length = builderData === null || builderData === void 0 ? void 0 : builderData.length) !== null && _builderData$length !== void 0 ? _builderData$length : null
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoLink, {
    title: "Entries Generator",
    value: "generator"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      marginRight: 10
    }
  }, "Filename:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoInput, {
    disabled: !totalRows || busyAction,
    value: totalRows ? filename : '',
    onChange: setFilename,
    style: {
      width: 210,
      marginRight: 5
    }
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: !totalRows || busyAction,
    icon: "upload",
    onClick: onUploadDataSet,
    className: "primary"
  }, "Upload to OpenAI"))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoContainer, {
    style: {
      margin: 10
    }
  }, isModeTrain && section === 'finetunes' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "The AI models you have fine-tuned. To create more, visit ", /*#__PURE__*/React.createElement("b", null, "Datasets"), "."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoTable, {
    alternateRowColor: true,
    busy: busy,
    data: fineTuneRows,
    columns: fineTuneColumns,
    emptyMessage: /*#__PURE__*/React.createElement(React.Fragment, null, "You do not have any fine-tuned jobs yet.")
  })), isModeTrain && section === 'files' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "The datasets you have uploaded to OpenAI. To create a new dataset, switch from ", /*#__PURE__*/React.createElement("b", null, "Model Finetuner"), " to ", /*#__PURE__*/React.createElement("b", null, "Dataset Builder"), ". To train a new model, click on the ", /*#__PURE__*/React.createElement("i", null, "magic wand"), "."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoTable, {
    alternateRowColor: true,
    busy: busy,
    data: fileRows,
    columns: fileColumns,
    emptyMessage: /*#__PURE__*/React.createElement(React.Fragment, null, "You do not have any dataset files yet.")
  })), !isModeTrain && dataSection === 'generator' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_FineTuning_DatasetBuilder__WEBPACK_IMPORTED_MODULE_15__["default"], {
    setBuilderData: setBuilderData
  })), !isModeTrain && dataSection === 'editor' && /*#__PURE__*/React.createElement(React.Fragment, null, !hasStorageBackup && /*#__PURE__*/React.createElement("p", {
    style: {
      color: _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].red
    }
  }, "Caution: The data is too large to be saved in your browser's local storage."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    icon: "plus",
    onClick: function onClick() {
      return addRow();
    }
  }, "Add Entry"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: !totalRows,
    className: "secondary",
    onClick: onFormatWithDefaults
  }, "Format with Defaults"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_16__.NekoUploadDropArea, {
    ref: ref,
    onSelectFiles: onSelectFiles,
    accept: '',
    style: {
      paddingLeft: 5
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    className: "secondary",
    onClick: function onClick() {
      return ref.current.click();
    }
  }, "Import File")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: !totalRows,
    className: "secondary",
    style: {
      marginLeft: 5
    },
    onClick: exportAsCSV
  }, "Export as CSV"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoButton, {
    disabled: !totalRows,
    onClick: onResetBuilder,
    className: "danger"
  }, "Reset Entries"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'auto'
    }
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_17__.NekoPaging, {
    currentPage: currentPage,
    limit: rowsPerPage,
    total: totalRows,
    onCurrentPageChanged: setCurrentPage,
    onClick: setCurrentPage
  }))), !isModeTrain && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoTable, {
    alternateRowColor: true,
    busy: busyAction,
    data: builderRows,
    columns: builderColumns,
    emptyMessage: /*#__PURE__*/React.createElement(React.Fragment, null, "You can import a file, or create manually each entry by clicking ", /*#__PURE__*/React.createElement("b", null, "Add Entry"), ".")
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
    height: 20
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'end'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_17__.NekoPaging, {
    currentPage: currentPage,
    limit: rowsPerPage,
    total: totalRows,
    onCurrentPageChanged: setCurrentPage,
    onClick: setCurrentPage
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
    height: 40,
    line: true,
    style: {
      marginBottom: 0
    }
  }), dataSection === 'generator' && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoMessageDanger, {
    style: {
      marginTop: 0,
      marginBottom: 25
    }
  }, "Use this feature with caution. The AI will generate questions and answers for each of your post based on the given prompt, and they will be added to your dataset. Keep in mind that this process may be ", /*#__PURE__*/React.createElement("u", null, "extremely slow"), " and require a ", /*#__PURE__*/React.createElement("u", null, "significant number of API calls"), ", resulting in a costs (the tokens count is displayed next to the progress bar). Also, please note that for now, for some reason, the model doesn't seem to provide as many questions as we ask (contrary to ChatGPT)."), dataSection === 'editor' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "You can create your dataset by importing a file (two columns, in the CSV, JSON or JSONL format) or manually by clicking ", /*#__PURE__*/React.createElement("b", null, "Add Entry"), ". To avoid losing your work, this data is kept in your browser's local storage. ", /*#__PURE__*/React.createElement("b", null, "This is actually complex, so learn how to write datasets by studying ", /*#__PURE__*/React.createElement("a", {
    href: "https://beta.openai.com/docs/guides/fine-tuning/conditional-generation",
    target: "_blank"
  }, "case studies"), ". Please also check my ", /*#__PURE__*/React.createElement("a", {
    href: "https://meowapps.com/wordpress-chatbot-finetuned-model-ai/",
    target: "_blank"
  }, "simplified tutorial"), "."), " Is your dataset ready? Modify the filename to your liking and click ", /*#__PURE__*/React.createElement("b", null, "Upload to OpenAI"), " \uD83D\uDE0E Some extra notes for you:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\u2022 The prompt and the completion should both end with their own special endings. By default, it is ", /*#__PURE__*/React.createElement("b", null, "\\n\\n===\\n\\n"), " for the prompt, and ", /*#__PURE__*/React.createElement("b", null, "\\n\\n"), " for the completion. The icon \u2705 will be shown next to the prompt and/or completion when this format has been validated, and the ending will be hidden for clarity. I refer to this format (and models trained on it) by the term of ", /*#__PURE__*/React.createElement("b", null, "Casually Fine Tuned"), "."), /*#__PURE__*/React.createElement("li", null, "\u2022 ", /*#__PURE__*/React.createElement("b", null, "\\n"), " is a line break. You can add line breaks by using ", /*#__PURE__*/React.createElement("b", null, "SHIFT+ENTER"), " while editing."), /*#__PURE__*/React.createElement("li", null, " \u2022 The ", /*#__PURE__*/React.createElement("b", null, "Format with Defaults"), " button will add the ", /*#__PURE__*/React.createElement("i", null, "Casually Fine Tuned"), " endings format to the prompt and completion, if they are missing."), /*#__PURE__*/React.createElement("li", null, "\u2022 If you need the chatbot to work with a ", /*#__PURE__*/React.createElement("b", null, "Casually Fined Tuned"), " model, you can add ", /*#__PURE__*/React.createElement("i", null, "casually_fine_tuned=\"true\""), "  in the shortcode.")))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_20__.NekoModal, {
    isOpen: fileForFineTune,
    title: "Train a new model",
    onOkClick: onStartFineTune,
    onRequestClose: function onRequestClose() {
      return setFileForFineTune();
    },
    onCancelClick: function onCancelClick() {
      return setFileForFineTune();
    },
    ok: "Start",
    disabled: busyAction,
    content: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Exciting! \uD83C\uDFB5 You are about to create your own new model, based on your dataset. You simply need to select a base model, and optionally, to modify the ", /*#__PURE__*/React.createElement("a", {
      href: "https://beta.openai.com/docs/guides/fine-tuning/hyperparameters",
      target: "_blank"
    }, "hyperparameters"), ". Before starting the process, make sure that:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\u2705 The dataset is well-defined."), /*#__PURE__*/React.createElement("li", null, "\u2705 You understand ", /*#__PURE__*/React.createElement("a", {
      href: "https://openai.com/api/pricing/#faq-fine-tuning-pricing-calculation",
      target: "_blank"
    }, "OpenAI pricing"), " about fine-tuning.")), /*#__PURE__*/React.createElement("label", null, "Base model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
      height: 5
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_21__.NekoSelect, {
      id: "models",
      value: model,
      scrolldown: true,
      onChange: setModel
    }, models.map(function (x) {
      return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_21__.NekoOption, {
        value: x.id,
        label: x.name
      });
    })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
      height: 5
    }), /*#__PURE__*/React.createElement("small", null, "For now, the hyperparameters can't be modified - they are set automatically by OpenAI."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
      height: 10
    }), /*#__PURE__*/React.createElement("label", null, "Suffix (for new model name):"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
      height: 5
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoInput, {
      value: suffix,
      onChange: setSuffix
    }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_18__.NekoSpacer, {
      height: 5
    }), /*#__PURE__*/React.createElement("small", null, "The name of the new model name will be decided by OpenAI. You can customize it a bit with this ", /*#__PURE__*/React.createElement("a", {
      href: "https://beta.openai.com/docs/api-reference/fine-tunes/list#fine-tunes/create-suffix",
      target: "_blank"
    }, "prefix"), ". Preview: ", /*#__PURE__*/React.createElement("b", null, modelNamePreview), "."))
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FineTuning);

/***/ }),

/***/ "./app/js/screens/FineTuning/DatasetBuilder.js":
/*!*****************************************************!*\
  !*** ./app/js/screens/FineTuning/DatasetBuilder.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/useQuery.mjs");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Progress.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/hooks.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// React & Vendor Libs
var useState = wp.element.useState;


// NekoUI



var retrieveIncidents = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(postType) {
    var _res$count, _res$count2;
    var res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/count_posts?postType=").concat(postType), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
          });
        case 2:
          res = _context.sent;
          return _context.abrupt("return", res !== null && res !== void 0 && (_res$count = res.count) !== null && _res$count !== void 0 && _res$count.publish ? parseInt(res === null || res === void 0 ? void 0 : (_res$count2 = res.count) === null || _res$count2 === void 0 ? void 0 : _res$count2.publish) : null);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function retrieveIncidents(_x) {
    return _ref.apply(this, arguments);
  };
}();
var retrievePostContent = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(postType) {
    var offset,
      postId,
      res,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          offset = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
          postId = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 0;
          _context2.next = 4;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/post_content?postType=").concat(postType, "&offset=").concat(offset, "&postId=").concat(postId), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
          });
        case 4:
          res = _context2.sent;
          return _context2.abrupt("return", res);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function retrievePostContent(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var DatasetBuilder = function DatasetBuilder(_ref3) {
  var setBuilderData = _ref3.setBuilderData;
  var bulkTasks = (0,_neko_ui__WEBPACK_IMPORTED_MODULE_2__.useNekoTasks)();
  var _useState = useState('post'),
    _useState2 = _slicedToArray(_useState, 2),
    postType = _useState2[0],
    setPostType = _useState2[1];
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    totalTokens = _useState4[0],
    setTotalTokens = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    quickBusy = _useState6[0],
    setQuickBusy = _useState6[1];
  var _useState7 = useState("Generate 30 questions and answers from this text. Question use a neutral tone. Answers use the same tone as the text."),
    _useState8 = _slicedToArray(_useState7, 2),
    generatePrompt = _useState8[0],
    setGeneratePrompt = _useState8[1];
  var _useState9 = useState("\n\nUse this format:\n\nQ: \nA: \n\nArticle:\n\n{CONTENT}"),
    _useState10 = _slicedToArray(_useState9, 2),
    suffixPrompt = _useState10[0],
    setSuffixPrompt = _useState10[1];
  var _useQuery = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useQuery)({
      queryKey: ['postsCount-' + postType],
      queryFn: function queryFn() {
        return retrieveIncidents(postType);
      }
    }),
    isLoadingCount = _useQuery.isLoading,
    postsCount = _useQuery.data;
  var isBusy = quickBusy || bulkTasks.busy || isLoadingCount;
  var onStopClick = function onStopClick() {
    bulkTasks.stop();
  };
  var onErrorSkipClick = function onErrorSkipClick() {
    bulkTasks.resume();
  };
  var onErrorRetryClick = function onErrorRetryClick() {
    bulkTasks.retry();
  };
  var onErrorAlwaysSkipClick = function onErrorAlwaysSkipClick() {
    bulkTasks.setAlwaysSkip();
    bulkTasks.resume();
  };
  var createEntriesFromRaw = function createEntriesFromRaw(rawData) {
    if (!rawData) {
      return [];
    }
    var arr = rawData.split("\n").filter(function (line) {
      return line.trim() !== "";
    });
    var entries = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].startsWith("Q:")) {
        entries.push({
          prompt: arr[i].slice(2).trim()
        });
      } else if (arr[i].startsWith("A:")) {
        entries[entries.length - 1].completion = arr[i].slice(2).trim();
      }
    }
    return entries;
  };
  var runProcess = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var suffix,
        postId,
        signal,
        finalPrompt,
        resContent,
        error,
        rawData,
        content,
        tokens,
        resGenerate,
        _resGenerate$usage,
        entries,
        result,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            suffix = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 0;
            postId = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : undefined;
            signal = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
            finalPrompt = generatePrompt + suffixPrompt;
            _context3.next = 6;
            return retrievePostContent(postType, suffix, postId ? postId : undefined);
          case 6:
            resContent = _context3.sent;
            error = null;
            rawData = null;
            content = resContent === null || resContent === void 0 ? void 0 : resContent.content;
            tokens = 0;
            if (resContent.success) {
              _context3.next = 16;
              break;
            }
            alert(resContent.message);
            error = resContent.message;
            _context3.next = 26;
            break;
          case 16:
            if (!(content.length < 64)) {
              _context3.next = 20;
              break;
            }
            console.log("Issue: Content is too short! Skipped.", {
              content: content
            });
            _context3.next = 26;
            break;
          case 20:
            finalPrompt = finalPrompt.replace('{CONTENT}', content);
            _context3.next = 23;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/make_completions"), {
              method: 'POST',
              json: {
                env: 'admin-dataset',
                session: _app_settings__WEBPACK_IMPORTED_MODULE_1__.session,
                prompt: finalPrompt,
                temperature: 0.8,
                model: 'text-davinci-003',
                maxTokens: 1024,
                stop: ''
              },
              signal: signal,
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
            });
          case 23:
            resGenerate = _context3.sent;
            rawData = resGenerate === null || resGenerate === void 0 ? void 0 : resGenerate.data;
            if (!resGenerate.success) {
              alert(resGenerate.message);
              error = resGenerate.message;
            } else {
              if (resGenerate !== null && resGenerate !== void 0 && (_resGenerate$usage = resGenerate.usage) !== null && _resGenerate$usage !== void 0 && _resGenerate$usage.total_tokens) {
                tokens = resGenerate.usage.total_tokens;
                setTotalTokens(function (totalTokens) {
                  return totalTokens + resGenerate.usage.total_tokens;
                });
              }
            }
          case 26:
            entries = createEntriesFromRaw(rawData);
            result = {
              content: content,
              prompt: finalPrompt,
              rawData: rawData,
              entries: entries,
              error: error,
              tokens: tokens
            };
            console.log("Result:", result);
            return _context3.abrupt("return", result);
          case 30:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function runProcess() {
      return _ref4.apply(this, arguments);
    };
  }();
  var onRunClick = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var offsets, tasks;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            setTotalTokens(0);
            offsets = Array.from(Array(postsCount).keys());
            tasks = offsets.map(function (offset) {
              return /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(signal) {
                  var result;
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        console.log("Task " + offset);
                        _context4.next = 3;
                        return runProcess(offset, null, signal);
                      case 3:
                        result = _context4.sent;
                        //let result = { entries: [ { prompt: offset, completion: offset } ] }
                        if (result.entries) {
                          setBuilderData(function (builderData) {
                            return [].concat(_toConsumableArray(builderData), _toConsumableArray(result.entries));
                          });
                        }
                        return _context4.abrupt("return", {
                          success: true
                        });
                      case 6:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x3) {
                  return _ref6.apply(this, arguments);
                };
              }();
            });
            _context5.next = 5;
            return bulkTasks.start(tasks);
          case 5:
            setQuickBusy(false);
            alert("All done!");
            bulkTasks.reset();
          case 8:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function onRunClick() {
      return _ref5.apply(this, arguments);
    };
  }();
  var onQuickTestClick = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var postId, result, confirmAdd;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            setTotalTokens(0);
            postId = prompt("Enter the ID of a post (leave blank to use the very first one).");
            if (!(postId === null)) {
              _context6.next = 4;
              break;
            }
            return _context6.abrupt("return");
          case 4:
            setQuickBusy(true);
            _context6.next = 7;
            return runProcess(0, postId);
          case 7:
            result = _context6.sent;
            setQuickBusy(false);
            if (!result.entries.length) {
              alert("No entries were generated. Check the console for more information.");
            } else {
              confirmAdd = confirm("Got ".concat(result.entries.length, " entries! Do you want to add them to your data? If not, they will be displayed in your console."));
              if (confirmAdd) {
                setBuilderData(function (builderData) {
                  return [].concat(_toConsumableArray(builderData), _toConsumableArray(result.entries));
                });
              }
            }
          case 10:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function onQuickTestClick() {
      return _ref7.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoButton, {
    disabled: isBusy,
    onClick: onQuickTestClick
  }, "Single Generate (Test)"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoButton, {
    disabled: isBusy,
    onClick: function onClick() {
      return onRunClick();
    }
  }, "Run Bulk Generate"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10
    }
  }, "Based on ", isLoadingCount && '...', !isLoadingCount && postsCount), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoSelect, {
    id: "postType",
    scrolldown: true,
    disabled: isBusy,
    name: "postType",
    style: {
      width: 100,
      marginLeft: 10
    },
    onChange: setPostType,
    value: postType
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoOption, {
    key: 'post',
    id: 'post',
    value: 'post',
    label: "Posts"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoOption, {
    key: 'page',
    id: 'page',
    value: 'page',
    label: "Pages"
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoProgress, {
    busy: bulkTasks.busy,
    style: {
      marginLeft: 10,
      flex: 'auto'
    },
    value: bulkTasks.value,
    max: bulkTasks.max,
    onStopClick: bulkTasks.stop
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10
    }
  }, "Tokens: ", totalTokens)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoTextArea, {
    id: "generatePrompt",
    name: "generatePrompt",
    rows: 2,
    style: {
      marginTop: 15
    },
    value: generatePrompt,
    onBlur: setGeneratePrompt,
    disabled: isBusy
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DatasetBuilder);

/***/ }),

/***/ "./app/js/screens/ImageGenerator.js":
/*!******************************************!*\
  !*** ./app/js/screens/ImageGenerator.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/CommonStyles */ "./app/js/styles/CommonStyles.js");
/* harmony import */ var _styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../styles/StyledSidebar */ "./app/js/styles/StyledSidebar.js");
/* harmony import */ var _components_Templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Templates */ "./app/js/components/Templates.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _templateObject;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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







var ImagesCount = [1, 2, 3, 6, 9];
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
  var _useTemplates = (0,_components_Templates__WEBPACK_IMPORTED_MODULE_1__["default"])('imagesGenerator'),
    template = _useTemplates.template,
    setTemplate = _useTemplates.setTemplate,
    jsxTemplates = _useTemplates.jsxTemplates;
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    continuousMode = _useState4[0],
    setContinuousMode = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    busy = _useState6[0],
    setBusy = _useState6[1];

  // Results
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    urls = _useState8[0],
    setUrls = _useState8[1];
  var _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    selectedUrl = _useState10[0],
    setSelectedUrl = _useState10[1];
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    title = _useState12[0],
    setTitle = _useState12[1];
  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    description = _useState14[0],
    setDescription = _useState14[1];
  var _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    caption = _useState16[0],
    setCaption = _useState16[1];
  var _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    alt = _useState18[0],
    setAlt = _useState18[1];
  var _useState19 = useState(''),
    _useState20 = _slicedToArray(_useState19, 2),
    filename = _useState20[0],
    setFilename = _useState20[1];
  var _useState21 = useState([]),
    _useState22 = _slicedToArray(_useState21, 2),
    createdMediaIds = _useState22[0],
    setCreatedMediaIds = _useState22[1];
  var urlIndex = useMemo(function () {
    return urls.indexOf(selectedUrl);
  }, [selectedUrl, urls]);

  // Variables
  var prompt = template === null || template === void 0 ? void 0 : template.prompt;
  var maxResults = template === null || template === void 0 ? void 0 : template.maxResults;
  var setPrompt = function setPrompt(value) {
    setTemplate(_objectSpread(_objectSpread({}, template), {}, {
      prompt: value
    }));
  };
  var setMaxResults = function setMaxResults(value) {
    setTemplate(_objectSpread(_objectSpread({}, template), {}, {
      maxResults: value
    }));
  };
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_2__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_3__.apiUrl, "/make_images"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_3__.restNonce,
              json: {
                env: 'admin-tools',
                session: _app_settings__WEBPACK_IMPORTED_MODULE_3__.session,
                prompt: prompt,
                maxResults: maxResults
              }
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_2__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_3__.apiUrl, "/create_image"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_3__.restNonce,
              json: {
                url: selectedUrl,
                title: title,
                description: description,
                caption: caption,
                alt: alt,
                filename: filename
              }
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

  // Download the file (selected URL) with the given filename
  var onDownload = function onDownload() {
    var link = document.createElement('a');
    link.href = selectedUrl;
    link.target = '_blank';
    link.download = filename;
    link.click();
  };
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
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoPage, {
    nekoErrors: []
  }, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.AiNekoHeader, {
    title: "Image Generator"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_7__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_3__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTypo, {
    p: true,
    style: {
      marginTop: 0,
      marginBottom: 0
    }
  }, "This will also be available in the Post Editor soon. If you have any idea or request, please join us on the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://wordpress.org/support/plugin/ai-engine/"
  }, "Support Forum"), "! \uD83C\uDFB5")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoColumn, null, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_9__.StyledSidebar, {
    style: {
      marginBottom: 25
    }
  }, jsxTemplates)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoColumn, {
    style: {
      flex: 3
    }
  }, selectedUrl && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoContainer, null, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTitleWithButton, {
    style: {
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Images Generator"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
    disabled: urlIndex < 1 || busy,
    onClick: function onClick() {
      return onGoBack();
    }
  }, "<"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
    disabled: busy,
    onClick: function onClick() {
      return setSelectedUrl();
    }
  }, "Back to results"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
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
  }, /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Title:"), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTextField, {
    value: title,
    onBlur: setTitle
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Caption:"), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTextField, {
    value: caption,
    onBlur: setCaption
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Description:"), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTextField, {
    value: description,
    onBlur: setDescription
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Alternative Text:"), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTextField, {
    value: alt,
    onBlur: setAlt
  })), /*#__PURE__*/React.createElement(StyledInputWrapper, null, /*#__PURE__*/React.createElement("label", null, "Filename:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoInput, {
    value: filename,
    onChange: setFilename
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
    fullWidth: true,
    style: {
      marginTop: 7
    },
    isBusy: busy,
    onClick: function onClick() {
      return onAdd();
    }
  }, "Add to Media Library"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
    fullWidth: true,
    style: {
      marginLeft: 0,
      marginTop: 7
    },
    isBusy: busy,
    onClick: function onClick() {
      return onDownload();
    }
  }, "Download"), currentCreatedMediaId && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoMessageSuccess, {
    style: {
      fontSize: 13,
      padding: '10px 5px'
    }
  }, "The media has been created! You can edit it here: ", /*#__PURE__*/React.createElement("a", {
    href: "/wp-admin/post.php?post=".concat(currentCreatedMediaId, "&action=edit"),
    target: "_blank"
  }, "Edit Media #", currentCreatedMediaId), "."))))), !selectedUrl && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoContainer, null, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTitleWithButton, null, /*#__PURE__*/React.createElement("h2", null, "Generated Images"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      margin: '0 5px 0 0'
    }
  }, "# of Images: "), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoSelect, {
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
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoOption, {
      key: count,
      id: count,
      value: count,
      label: count
    });
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoButton, {
    disabled: !prompt,
    isBusy: busy,
    onClick: onSubmit
  }, "Generate Images"))), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledTextField, {
    value: prompt,
    onChange: setPrompt,
    style: {
      marginTop: 20
    }
  }), /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_5__.StyledGallery, null, urls.map(function (url) {
    return /*#__PURE__*/React.createElement("img", {
      src: url,
      onClick: function onClick() {
        return setSelectedUrl(url);
      }
    });
  }), _toConsumableArray(Array(Math.max(3 - urls.length, 0)).keys()).map(function (x) {
    return /*#__PURE__*/React.createElement("div", {
      "class": "empty-image"
    });
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoColumn, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoContainer, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, "Settings"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_15__.NekoCheckbox, {
    id: "continuous_mode ",
    label: "Continuous",
    value: "1",
    checked: continuousMode,
    description: "New images will be added to the already generated images.",
    onChange: setContinuousMode
  })))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_16__.NekoModal, {
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

/***/ "./app/js/screens/Playground.js":
/*!**************************************!*\
  !*** ./app/js/screens/Playground.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./app/js/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _styles_CommonStyles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/CommonStyles */ "./app/js/styles/CommonStyles.js");
/* harmony import */ var _styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../styles/StyledSidebar */ "./app/js/styles/StyledSidebar.js");
/* harmony import */ var _components_Templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Templates */ "./app/js/components/Templates.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _templateObject;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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



// AI Engine






var StyledTextArea = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].textarea(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: block;\n  height: 360px;\n  width: 100%;\n  margin-bottom: 10px;\n  background: #333d4e;\n  border-radius: 5px;\n  border: none;\n  color: white;\n  font-size: 13px;\n  font-family: monospace;\n  padding: 10px;\n"])));
var Dashboard = function Dashboard() {
  var _template$prompt, _template$model, _template$mode, _template$temperature, _template$stopSequenc, _template$maxTokens;
  var _useTemplates = (0,_components_Templates__WEBPACK_IMPORTED_MODULE_1__["default"])('playground'),
    template = _useTemplates.template,
    setTemplate = _useTemplates.setTemplate,
    resetTemplate = _useTemplates.resetTemplate,
    jsxTemplates = _useTemplates.jsxTemplates;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    completion = _useState2[0],
    setCompletion = _useState2[1];
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.useModels)(_app_settings__WEBPACK_IMPORTED_MODULE_3__.options),
    models = _useModels.models;
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busy = _useState4[0],
    setBusy = _useState4[1];
  var _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    continuousEntry = _useState6[0],
    setContinuousEntry = _useState6[1];
  var _useState7 = useState({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    sessionUsage = _useState8[0],
    setSessionUsage = _useState8[1];
  var _useState9 = useState({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }),
    _useState10 = _slicedToArray(_useState9, 2),
    lastUsage = _useState10[0],
    setLastUsage = _useState10[1];
  var _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    startTime = _useState12[0],
    setStartTime = _useState12[1];
  var _useState13 = useState(),
    _useState14 = _slicedToArray(_useState13, 2),
    error = _useState14[0],
    setError = _useState14[1];

  // Template Variables
  var prompt = (_template$prompt = template === null || template === void 0 ? void 0 : template.prompt) !== null && _template$prompt !== void 0 ? _template$prompt : "";
  var model = (_template$model = template === null || template === void 0 ? void 0 : template.model) !== null && _template$model !== void 0 ? _template$model : "text-davinci-003";
  var mode = (_template$mode = template === null || template === void 0 ? void 0 : template.mode) !== null && _template$mode !== void 0 ? _template$mode : "query";
  var temperature = (_template$temperature = template === null || template === void 0 ? void 0 : template.temperature) !== null && _template$temperature !== void 0 ? _template$temperature : 1;
  var stopSequence = (_template$stopSequenc = template === null || template === void 0 ? void 0 : template.stopSequence) !== null && _template$stopSequenc !== void 0 ? _template$stopSequenc : "";
  var maxTokens = (_template$maxTokens = template === null || template === void 0 ? void 0 : template.maxTokens) !== null && _template$maxTokens !== void 0 ? _template$maxTokens : 2048;
  var setTemplateProperty = function setTemplateProperty(value, property) {
    setTemplate(_objectSpread(_objectSpread({}, template), {}, _defineProperty({}, property, value)));
  };
  var setPrompt = function setPrompt(prompt) {
    setTemplate(_objectSpread(_objectSpread({}, template), {}, {
      prompt: prompt
    }));
  };
  var onPushContinuousEntry = function onPushContinuousEntry() {
    var newPrompt = prompt + "Human: " + continuousEntry;
    setPrompt(newPrompt);
    setContinuousEntry("");
    onSubmitPrompt(newPrompt);
  };
  useEffect(function () {
    if (template) {
      setCompletion("");
    }
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
        stop,
        res,
        newSessionUsage,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            promptToUse = _args.length > 0 && _args[0] !== undefined ? _args[0] : prompt;
            setBusy(true);
            setStartTime(new Date());
            stop = stopSequence.replace(/\\n/g, '\n');
            _context.next = 6;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_3__.apiUrl, "/make_completions"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_3__.restNonce,
              json: {
                env: 'playground',
                session: _app_settings__WEBPACK_IMPORTED_MODULE_3__.session,
                prompt: promptToUse,
                temperature: temperature,
                model: model,
                maxTokens: maxTokens,
                stop: stop
              }
            });
          case 6:
            res = _context.sent;
            console.log("Completions", {
              prompt: promptToUse,
              result: res
            });
            if (res.success) {
              if (mode === 'continuous') {
                setPrompt(promptToUse + '\n' + res.data + '\n');
              } else {
                setCompletion(res.data);
              }
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
            setStartTime();
            setBusy(false);
          case 11:
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
  }, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_7__.AiNekoHeader, {
    title: "Playground"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_2__.OptionsCheck, {
    options: _app_settings__WEBPACK_IMPORTED_MODULE_3__.options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoContainer, {
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_10__.NekoTypo, {
    p: true
  }, "Welcome to the AI Playground! Here, you can play with different AI models and ask the UI to perform various tasks for you. You can ask it to write, rewrite, or translate an article, categorize words or elements into groups, write an email, etc. ", /*#__PURE__*/React.createElement("b", null, "Let me know if there are any new features you would like to see!"), " Have fun \uD83E\uDD73"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, null, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, null, jsxTemplates), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 0
    }
  }, "Mode"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoSelect, {
    scrolldown: true,
    id: "mode",
    name: "mode",
    disabled:  true || 0,
    value: mode,
    description: "",
    onChange: setTemplateProperty
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoOption, {
    key: "query",
    id: "query",
    value: "query",
    label: "Query"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoOption, {
    key: "continuous",
    id: "continuous",
    value: "continuous",
    label: "Continuous"
  })))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, {
    style: {
      flex: 3
    }
  }, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, null, mode !== 'continuous' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    style: {
      marginTop: 0,
      marginBottom: 10
    }
  }, "Query / Prompt:"), /*#__PURE__*/React.createElement(StyledTextArea, {
    style: {
      marginBottom: 10,
      height: 160
    },
    rows: 8,
    onChange: function onChange(e) {
      setPrompt(e.target.value);
    },
    value: prompt
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      marginTop: 0,
      marginBottom: 10
    }
  }, "Answer:"), /*#__PURE__*/React.createElement(StyledTextArea, {
    style: {
      marginBottom: 10,
      height: 300
    },
    value: completion
  })), mode === 'continuous' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StyledTextArea, {
    onChange: function onChange(e) {
      setPrompt(e.target.value);
    },
    value: prompt
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "class": "dashicons dashicons-format-continuous",
    style: {
      position: 'absolute',
      color: 'white',
      zIndex: 200,
      fontSize: 28,
      marginTop: 12,
      marginLeft: 10
    }
  }), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledNekoInput, {
    id: "continuousEntry",
    value: continuousEntry,
    onChange: setContinuousEntry,
    onEnter: onPushContinuousEntry,
    disabled: busy
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoColumn, null, mode === 'query' && /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoButton, {
    fullWidth: true,
    onClick: function onClick() {
      onSubmitPrompt();
    },
    isBusy: busy,
    startTime: startTime,
    style: {
      height: 50,
      fontSize: 14,
      flex: 4
    }
  }, "Submit")), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, null, /*#__PURE__*/React.createElement("h3", null, "Settings"), /*#__PURE__*/React.createElement("label", null, "Model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoSelect, {
    id: "model",
    value: model,
    scrolldown: true,
    onChange: setTemplateProperty
  }, models.map(function (x) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoOption, {
      value: x.id,
      label: x.name
    });
  })), /*#__PURE__*/React.createElement("label", null, "Temperature:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoInput, {
    id: "temperature",
    name: "temperature",
    value: temperature,
    type: "number",
    onChange: function onChange(value) {
      return setTemplateProperty(parseFloat(value), 'temperature');
    },
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red'
      }
    }, "Between 0 and 1. Higher values means the model will take more risks."))
  }), /*#__PURE__*/React.createElement("label", null, "Max Tokens:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoInput, {
    id: "maxTokens",
    name: "maxTokens",
    value: maxTokens,
    type: "number",
    onChange: function onChange(value) {
      return setTemplateProperty(parseInt(value), 'maxTokens');
    },
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "The maximum number of tokens to generate. The model will stop generating once it hits this limit."))
  }), /*#__PURE__*/React.createElement("label", null, "Stop Sequence:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoInput, {
    id: "stopSequence",
    name: "stopSequence",
    value: stopSequence,
    type: "text",
    onChange: setTemplateProperty,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "The sequence of tokens that will cause the model to stop generating text. You absolutely need this with fine-tuned models."))
  })), /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_11__.StyledSidebar, {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Usage"), /*#__PURE__*/React.createElement("p", null, "Keeps track of the current usage of the AI."), /*#__PURE__*/React.createElement("h4", null, "Session"), /*#__PURE__*/React.createElement("div", null, "Tokens: ", sessionUsage.total_tokens), /*#__PURE__*/React.createElement("div", null, "Price: $", sessionPrice), /*#__PURE__*/React.createElement("h4", null, "Last Request"), /*#__PURE__*/React.createElement("div", null, "Tokens: ", lastUsage.total_tokens), /*#__PURE__*/React.createElement("div", null, "Price: $", lastRequestPrice), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoButton, {
    style: {
      marginTop: 10,
      width: '100%'
    },
    onClick: onResetUsage
  }, "Reset Usage")))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_15__.NekoModal, {
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

/***/ "./app/js/screens/Settings.js":
/*!************************************!*\
  !*** ./app/js/screens/Settings.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Settings.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/CheckboxGroup.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Checkbox.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Page.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Wrapper.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Container.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/tabs/Tabs.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Block.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Spacer.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Select.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ "./node_modules/@tanstack/react-query/build/lib/useQuery.mjs");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @common */ "./common/js/components/LicenseBlock.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
/* harmony import */ var _styles_CommonStyles__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../styles/CommonStyles */ "./app/js/styles/CommonStyles.js");
/* harmony import */ var _FineTuning__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./FineTuning */ "./app/js/screens/FineTuning.js");
/* harmony import */ var _Settings_OpenAIStatus__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./Settings/OpenAIStatus */ "./app/js/screens/Settings/OpenAIStatus.js");
/* harmony import */ var _styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../styles/StyledSidebar */ "./app/js/styles/StyledSidebar.js");
/* harmony import */ var _components_NekoColorPicker__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../components/NekoColorPicker */ "./app/js/components/NekoColorPicker.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// React & Vendor Libs
var _wp$element = wp.element,
  useMemo = _wp$element.useMemo,
  useState = _wp$element.useState;

// NekoUI











var chatIcons = ['chat-robot-1.svg', 'chat-robot-2.svg', 'chat-robot-3.svg', 'chat-robot-4.svg', 'chat-robot-5.svg', 'chat-robot-6.svg', 'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg', 'chat-traditional-1.svg', 'chat-traditional-2.svg', 'chat-traditional-3.svg'];
var retrieveIncidents = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var res, incidents;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/openai_incidents"), {
            nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce
          });
        case 2:
          res = _context.sent;
          if (!(res !== null && res !== void 0 && res.incidents)) {
            _context.next = 6;
            break;
          }
          incidents = res.incidents.map(function (x) {
            var timestamp = x.date;
            timestamp = new Date(timestamp * 1000);
            var date = timestamp.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            return _objectSpread(_objectSpread({}, x), {}, {
              date: date
            });
          });
          return _context.abrupt("return", incidents);
        case 6:
          return _context.abrupt("return", null);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function retrieveIncidents() {
    return _ref.apply(this, arguments);
  };
}();
var Settings = function Settings() {
  var _shortcodeStyles$spac, _shortcodeStyles$font, _shortcodeStyles$bord, _shortcodeStyles$font2, _shortcodeStyles$font3, _shortcodeStyles$back, _shortcodeStyles$back2, _shortcodeStyles$back3, _shortcodeStyles$back4, _shortcodeStyles$head, _shortcodeStyles$head2;
  var _useState = useState(_app_settings__WEBPACK_IMPORTED_MODULE_1__.options),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setOptions = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    busyAction = _useState4[0],
    setBusyAction = _useState4[1];
  var _useModels = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.useModels)(options),
    models = _useModels.models;
  var shortcodeDefaultParams = options === null || options === void 0 ? void 0 : options.shortcode_chat_default_params;
  var shortcodeParams = options === null || options === void 0 ? void 0 : options.shortcode_chat_params;
  var shortcodeStyles = options === null || options === void 0 ? void 0 : options.shortcode_chat_styles;
  var shortcodeParamsOverride = options === null || options === void 0 ? void 0 : options.shortcode_chat_params_override;
  var shortcodeChatInject = options === null || options === void 0 ? void 0 : options.shortcode_chat_inject;
  var module_titles = options === null || options === void 0 ? void 0 : options.module_titles;
  var module_excerpts = options === null || options === void 0 ? void 0 : options.module_excerpts;
  var module_woocommerce = options === null || options === void 0 ? void 0 : options.module_woocommerce;
  var module_forms = options === null || options === void 0 ? void 0 : options.module_forms;
  var module_blocks = options === null || options === void 0 ? void 0 : options.module_blocks;
  var module_statistics = options === null || options === void 0 ? void 0 : options.module_statistics;
  var shortcode_chat = options === null || options === void 0 ? void 0 : options.shortcode_chat;
  var shortcode_chat_formatting = options === null || options === void 0 ? void 0 : options.shortcode_chat_formatting;
  var openai_apikey = options !== null && options !== void 0 && options.openai_apikey ? options === null || options === void 0 ? void 0 : options.openai_apikey : '';
  var openai_usage = options === null || options === void 0 ? void 0 : options.openai_usage;
  var shortcode_chat_syntax_highlighting = options === null || options === void 0 ? void 0 : options.shortcode_chat_syntax_highlighting;
  var extra_models = options === null || options === void 0 ? void 0 : options.extra_models;
  var isChat = shortcodeParams.mode === 'chat';
  var isImagesChat = shortcodeParams.mode === 'images';
  var _useQuery = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useQuery)({
      queryKey: ['openAI_status'],
      queryFn: retrieveIncidents
    }),
    isLoadingIncidents = _useQuery.isLoading,
    incidents = _useQuery.data;
  var icon = shortcodeStyles !== null && shortcodeStyles !== void 0 && shortcodeStyles.icon ? shortcodeStyles.icon : 'chat-color-green.svg';

  // Variables
  var accidentsPastDay = incidents === null || incidents === void 0 ? void 0 : incidents.filter(function (x) {
    var incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length;
  var busy = busyAction;
  var shortcodeParamsDiff = useMemo(function () {
    var diff = {};
    if (shortcodeParamsOverride) {
      return diff;
    }
    for (var key in shortcodeDefaultParams) {
      if (shortcodeDefaultParams[key] !== shortcodeParams[key]) {
        diff[key] = shortcodeParams[key];
      }
    }
    if (isChat) {
      delete diff.mode;
      delete diff.max_results;
    }
    if (isImagesChat) {
      delete diff.context;
      delete diff.content_aware;
      delete diff.casually_fine_tuned;
      delete diff.model;
      delete diff.max_tokens;
      delete diff.temperature;
    }
    return diff;
  }, [shortcodeParamsOverride, shortcodeDefaultParams, shortcodeParams]);
  var builtShortcode = useMemo(function () {
    var params = [];
    for (var key in shortcodeParamsDiff) {
      if (shortcodeParams[key] === undefined) {
        continue;
      }
      params.push("".concat(key, "=\"").concat(shortcodeParams[key], "\""));
    }
    var joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? " ".concat(joinedParams) : '') + ']';
  }, [shortcodeParamsDiff]);
  var updateOption = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(value, id) {
      var newOptions, response;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            newOptions = _objectSpread(_objectSpread({}, options), {}, _defineProperty({}, id, value));
            setBusyAction(true);
            _context2.prev = 2;
            _context2.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_0__.nekoFetch)("".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.apiUrl, "/update_option"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                options: newOptions
              }
            });
          case 5:
            response = _context2.sent;
            if (response.success) {
              setOptions(response.options);
            }
            _context2.next = 12;
            break;
          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            if (_context2.t0.message) {
              alert(_context2.t0.message);
            }
          case 12:
            _context2.prev = 12;
            setBusyAction(false);
            return _context2.finish(12);
          case 15:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[2, 9, 12, 15]]);
    }));
    return function updateOption(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();
  var updateShortcodeParams = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(value, id) {
      var newParams;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            newParams = _objectSpread(_objectSpread({}, shortcodeParams), {}, _defineProperty({}, id, value));
            _context3.next = 3;
            return updateOption(newParams, 'shortcode_chat_params');
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function updateShortcodeParams(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();
  var onResetShortcodeParams = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
          case 2:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function onResetShortcodeParams() {
      return _ref4.apply(this, arguments);
    };
  }();
  var updateShortcodeColors = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(value, id) {
      var newColors;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!value) {
              _context5.next = 4;
              break;
            }
            newColors = _objectSpread(_objectSpread({}, shortcodeStyles), {}, _defineProperty({}, id, value));
            _context5.next = 4;
            return updateOption(newColors, 'shortcode_chat_styles');
          case 4:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function updateShortcodeColors(_x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }();
  var onResetShortcodeStyles = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return updateOption({}, 'shortcode_chat_styles');
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function onResetShortcodeStyles() {
      return _ref6.apply(this, arguments);
    };
  }();

  /**
   * Settings
   */

  var jsxAiFeatures = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Assistants"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "module_titles",
    label: "Titles Suggestions",
    value: "1",
    checked: module_titles,
    description: "Suggest a few titles based on your content.",
    onChange: updateOption
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "module_excerpts",
    label: "Excerpt Suggestions",
    value: "1",
    checked: module_excerpts,
    description: "Suggest a few excerpts based on your content.",
    onChange: updateOption
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "module_woocommerce",
    label: "WooCommerce Product Generator",
    value: "1",
    checked: module_woocommerce,
    description: "Write all the WooCommerce fields for a given product.",
    onChange: updateOption
  })));
  var jsxForms = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Forms", /*#__PURE__*/React.createElement("small", {
      style: {
        position: 'relative',
        top: -3,
        fontSize: 8
      }
    }, " BETA"))
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "module_forms",
    label: "Enable",
    value: "1",
    checked: module_forms,
    requirePro: true,
    isPro: _app_settings__WEBPACK_IMPORTED_MODULE_1__.isRegistered,
    description: "Create AI Forms. Based on fields, users will be given answers or suggestions. Works with shortcodes and Gutenberg blocks.",
    onChange: updateOption
  }));
  var jsxStatistics = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Statistics", /*#__PURE__*/React.createElement("small", {
      style: {
        position: 'relative',
        top: -3,
        fontSize: 8
      }
    }, " BETA"))
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "module_statistics",
    label: "Enable",
    value: "1",
    checked: module_statistics,
    requirePro: true,
    isPro: _app_settings__WEBPACK_IMPORTED_MODULE_1__.isRegistered,
    description: "Track interactions with the AI based on the user, session, type, price, etc. This allows to set limits, and more!",
    onChange: updateOption
  }));
  var jsxAiBlocks = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Gutenberg Blocks"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    label: "Enable",
    disabled: true,
    value: "1",
    checked: module_blocks,
    description: "Additional blocks. Let me know your ideas!",
    onChange: updateOption
  })));
  var jsxChatbot = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Chatbot"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "shortcode_chat",
    label: "Enable",
    value: "1",
    checked: shortcode_chat,
    description: "A chatbot that can be similar to ChatGPT. But it has many features! Check the Chatbot tab.",
    onChange: updateOption
  })));
  var jsxShortcodeFormatting = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Formatting"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "shortcode_chat_formatting",
    label: "Enable",
    value: "1",
    checked: shortcode_chat_formatting,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Convert the reply from the AI into HTML. ", /*#__PURE__*/React.createElement("b", null, "Markdown is supported, so it is highly recommended to add 'Use Markdown.' in your context.")),
    onChange: updateOption
  })));
  var jsxShortcodeSyntaxHighlighting = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Code"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoCheckboxGroup, {
    max: "1"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "shortcode_chat_syntax_highlighting",
    label: "Use Syntax Highlighting",
    value: "1",
    checked: shortcode_chat_syntax_highlighting,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Add syntax coloring to the code written by the chatbot."),
    onChange: updateOption
  })));
  var jsxExtraModels = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "Extra Models"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "extra_models",
    name: "extra_models",
    value: extra_models,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "You can enter additional models you would like to use (separated by a comma). Note that your fine-tuned models are already available."),
    onBlur: updateOption
  }));
  var jsxOpenAiApiKey = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoSettings, {
    title: "API Key"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "openai_apikey",
    name: "openai_apikey",
    value: openai_apikey,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "You can get your API Keys in your ", /*#__PURE__*/React.createElement("a", {
      href: "https://beta.openai.com/account/api-keys",
      target: "_blank"
    }, "OpenAI Account"), "."),
    onBlur: updateOption
  }));
  var jsxUsage = useMemo(function () {
    var usageData = {};
    try {
      Object.keys(openai_usage).forEach(function (month) {
        var monthUsage = openai_usage[month];
        if (!usageData[month]) usageData[month] = {
          totalPrice: 0,
          data: []
        };
        Object.keys(monthUsage).forEach(function (model) {
          var modelUsage = monthUsage[model];
          var price = 0;
          var realModel = models.find(function (x) {
            return x.id === model;
          });
          if (model === 'dall-e') {
            var defaultOption = '1024x1024';
            var _modelPrice = _app_settings__WEBPACK_IMPORTED_MODULE_1__.pricing.find(function (x) {
              return x.model === 'dall-e';
            });
            var modelOptionPrice = _modelPrice.options.find(function (x) {
              return x.option === defaultOption;
            });
            var _price = modelUsage.images * modelOptionPrice.price;
            usageData[month].totalPrice += _price;
            usageData[month].data.push({
              name: 'dall-e',
              isImage: true,
              usage: modelUsage.images,
              price: _price
            });
            return;
          }
          if (!realModel) {
            console.warn("Monthly Usage was detected for a removed model (".concat(model, ")."));
            return;
          }
          var modelPrice = _app_settings__WEBPACK_IMPORTED_MODULE_1__.pricing.find(function (x) {
            return x.model === realModel["short"];
          });
          if (modelPrice) {
            price = modelUsage.total_tokens / 1000 * modelPrice.price;
            usageData[month].totalPrice += price;
            var name = realModel ? realModel.name : model;
            usageData[month].data.push({
              name: name,
              isImage: false,
              usage: modelUsage.total_tokens,
              price: price
            });
          } else {
            console.log("Cannot find price for model ".concat(model, "."));
          }
        });
      });
      Object.keys(usageData).forEach(function (month) {
        usageData[month].data.sort(function (a, b) {
          return b.price - a.price;
        });
      });
    } catch (e) {
      console.log(e);
    }
    return /*#__PURE__*/React.createElement("ul", {
      style: {
        marginTop: 2
      }
    }, Object.keys(usageData).map(function (month, index) {
      return /*#__PURE__*/React.createElement("li", {
        key: index
      }, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDDD3\uFE0F ", month, " (", usageData[month].totalPrice.toFixed(2), "$)"), /*#__PURE__*/React.createElement("ul", null, usageData[month].data.map(function (data, index) {
        return /*#__PURE__*/React.createElement("li", {
          key: index,
          style: {
            marginTop: 5,
            marginLeft: 18
          }
        }, /*#__PURE__*/React.createElement("strong", null, "\u2022 ", data.name), data.isImage && ": ".concat(data.usage, " images"), !data.isImage && ": ".concat(data.usage, " tokens"), data.price > 0 && " (".concat(data.price.toFixed(2), "$)"));
      })));
    }));
  }, [openai_usage, models]);
  var jsxOpenAiUsage = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Usage"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -10,
      marginBottom: 10,
      fontSize: 12
    }
  }, "For the exact amounts, please check your ", /*#__PURE__*/React.createElement("a", {
    href: "https://beta.openai.com/account/usage",
    target: "_blank"
  }, "OpenAI account"), ". If you would like to have better control on the amounts, add conditions or set limits to the usage of the AI, consider ", /*#__PURE__*/React.createElement("a", {
    href: "https://meowapps.com/ai-engine/",
    target: "_blank"
  }, "AI Engine Pro"), "."), !Object.keys(openai_usage).length && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTypo, {
    p: true
  }, "N/A"), openai_usage && /*#__PURE__*/React.createElement(React.Fragment, null, jsxUsage));
  return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_9__.NekoPage, null, /*#__PURE__*/React.createElement(_styles_CommonStyles__WEBPACK_IMPORTED_MODULE_10__.AiNekoHeader, null), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoColumn, {
    full: true
  }, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_2__.OptionsCheck, {
    options: options
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_12__.NekoContainer, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTypo, {
    p: true
  }, "Boost your WordPress with AI! Don't forget to visit the ", /*#__PURE__*/React.createElement("a", {
    href: "https://meowapps.com/ai-engine/",
    target: "_blank"
  }, "AI Engine website"), " for more information. Have fun! \uD83C\uDFB5")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTabs, {
    keepTabOnReload: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "Settings"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Modules",
    className: "primary"
  }, /*#__PURE__*/React.createElement("p", null, "To avoid cluttering the UI or impacting your WordPress performance, those features are only enabled if selected. However, the Content Generator, Image Generator and AI Playground are always available."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_15__.NekoSpacer, {
    height: 50
  }), jsxChatbot, jsxAiFeatures, jsxForms, jsxStatistics, jsxAiBlocks), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Advanced",
    className: "primary"
  }, jsxExtraModels)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Open AI",
    className: "primary"
  }, jsxOpenAiApiKey, jsxOpenAiUsage)))), shortcode_chat && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "Chatbot"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoWrapper, null, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    className: "primary"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoTypo, {
    p: true
  }, /*#__PURE__*/React.createElement("p", null, "If you only need one chatbot, set your parameters in the Chatbot Builder, and click on ", /*#__PURE__*/React.createElement("b", null, "Set as Default Parameters"), ". You can then use the shortcode ", /*#__PURE__*/React.createElement("b", null, "[mwai_chat]"), " anywhere on your website. You can also add the chatbot everywhere automatically by using ", /*#__PURE__*/React.createElement("b", null, "Inject Default Chatbot"), "."), /*#__PURE__*/React.createElement("p", null, "You can have multiple chatbots on your website (or same page), each with different parameters. Setting an ID will memorize the conversation in the browser, Content Aware will make the content of your page available to the context (", /*#__PURE__*/React.createElement("a", {
    href: "https://meowapps.com/ai-engine/tutorial/#content-aware-bot",
    target: "_blank"
  }, "read this"), "), and removing the AI Name and User Name will switch to avatars (similar to ChatGPT). Enjoy! \uD83D\uDE0E"))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Features",
    className: "primary"
  }, jsxShortcodeFormatting, jsxShortcodeSyntaxHighlighting), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Styles",
    className: "primary",
    action: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_16__.NekoButton, {
      className: "danger",
      onClick: onResetShortcodeStyles
    }, "Reset Styles")
  }, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_17__.StyledBuilderForm, null, /*#__PURE__*/React.createElement("p", null, "Keep in mind that you can also style the chatbot (or aspecific chatbot, if you use many) by injecting CSS. Have a look ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://meowapps.com/ai-engine/tutorial/#apply-custom-style-to-the-chatbot"
  }, "here"), ". Header Buttons are the ones used to close or resize the Popup Window. For more, check the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: "https://meowapps.com/ai-engine/faq"
  }, "FAQ"), "."), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Spacing:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "spacing",
    name: "spacing",
    value: (_shortcodeStyles$spac = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.spacing) !== null && _shortcodeStyles$spac !== void 0 ? _shortcodeStyles$spac : '15px',
    onBlur: updateShortcodeColors
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Font Size:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "fontSize",
    name: "fontSize",
    value: (_shortcodeStyles$font = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.fontSize) !== null && _shortcodeStyles$font !== void 0 ? _shortcodeStyles$font : '15px',
    onBlur: updateShortcodeColors
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Border Radius:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "borderRadius",
    name: "borderRadius",
    value: (_shortcodeStyles$bord = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.borderRadius) !== null && _shortcodeStyles$bord !== void 0 ? _shortcodeStyles$bord : '10px',
    onBlur: updateShortcodeColors
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Font Color:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "fontColor",
    name: "fontColor",
    value: (_shortcodeStyles$font2 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.fontColor) !== null && _shortcodeStyles$font2 !== void 0 ? _shortcodeStyles$font2 : '#FFFFFF',
    onBlur: updateShortcodeColors
  }), /*#__PURE__*/React.createElement(_components_NekoColorPicker__WEBPACK_IMPORTED_MODULE_18__.NekoColorPicker, {
    id: "fontColor",
    name: "fontColor",
    value: (_shortcodeStyles$font3 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.fontColor) !== null && _shortcodeStyles$font3 !== void 0 ? _shortcodeStyles$font3 : '#FFFFFF',
    onChange: updateShortcodeColors
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Back Primary Color:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "backgroundPrimaryColor",
    name: "backgroundPrimaryColor",
    value: (_shortcodeStyles$back = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.backgroundPrimaryColor) !== null && _shortcodeStyles$back !== void 0 ? _shortcodeStyles$back : '#454654',
    onBlur: updateShortcodeColors
  }), /*#__PURE__*/React.createElement(_components_NekoColorPicker__WEBPACK_IMPORTED_MODULE_18__.NekoColorPicker, {
    id: "backgroundPrimaryColor",
    name: "backgroundPrimaryColor",
    value: (_shortcodeStyles$back2 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.backgroundPrimaryColor) !== null && _shortcodeStyles$back2 !== void 0 ? _shortcodeStyles$back2 : '#454654',
    onChange: updateShortcodeColors
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Back Secondary Color:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "backgroundSecondaryColor",
    name: "backgroundSecondaryColor",
    value: (_shortcodeStyles$back3 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.backgroundSecondaryColor) !== null && _shortcodeStyles$back3 !== void 0 ? _shortcodeStyles$back3 : '#343541',
    onBlur: updateShortcodeColors
  }), /*#__PURE__*/React.createElement(_components_NekoColorPicker__WEBPACK_IMPORTED_MODULE_18__.NekoColorPicker, {
    id: "backgroundSecondaryColor",
    name: "backgroundSecondaryColor",
    value: (_shortcodeStyles$back4 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.backgroundSecondaryColor) !== null && _shortcodeStyles$back4 !== void 0 ? _shortcodeStyles$back4 : '#343541',
    onChange: updateShortcodeColors
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Header Buttons Color:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "headerButtonsColor",
    name: "headerButtonsColor",
    value: (_shortcodeStyles$head = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.headerButtonsColor) !== null && _shortcodeStyles$head !== void 0 ? _shortcodeStyles$head : '#FFFFFF',
    onBlur: updateShortcodeColors
  }), /*#__PURE__*/React.createElement(_components_NekoColorPicker__WEBPACK_IMPORTED_MODULE_18__.NekoColorPicker, {
    id: "headerButtonsColor",
    name: "headerButtonsColor",
    value: (_shortcodeStyles$head2 = shortcodeStyles === null || shortcodeStyles === void 0 ? void 0 : shortcodeStyles.headerButtonsColor) !== null && _shortcodeStyles$head2 !== void 0 ? _shortcodeStyles$head2 : '#FFFFFF',
    onChange: updateShortcodeColors
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 'auto'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Icon for Popup Window Chatbot:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, chatIcons.map(function (x) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
      style: {
        marginRight: 5,
        cursor: 'pointer'
      },
      width: 28,
      height: 28,
      src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/images/").concat(x),
      onClick: function onClick() {
        updateShortcodeColors(x, 'icon');
      }
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      width: 48,
      display: 'flex',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("img", {
    style: {
      marginRight: 0
    },
    width: 64,
    height: 64,
    src: "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_1__.pluginUrl, "/images/").concat(icon)
  })))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_11__.NekoColumn, {
    minimal: true
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_14__.NekoBlock, {
    busy: busy,
    title: "Chatbot Builder",
    className: "primary",
    action: /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_16__.NekoButton, {
      className: "danger",
      onClick: onResetShortcodeParams
    }, "Reset Parameters")
  }, /*#__PURE__*/React.createElement(_styles_StyledSidebar__WEBPACK_IMPORTED_MODULE_17__.StyledBuilderForm, null, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      height: shortcodeParams.mode === 'chat' ? 76 : 'inherit'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Mode:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoSelect, {
    scrolldown: true,
    id: "mode",
    name: "mode",
    value: shortcodeParams.mode,
    onChange: updateShortcodeParams
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoOption, {
    value: "chat",
    label: "Chat"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoOption, {
    value: "images",
    label: "Images"
  }))), isChat && /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 5
    }
  }, /*#__PURE__*/React.createElement("label", null, "Context:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_20__.NekoTextArea, {
    id: "context",
    name: "context",
    rows: 2,
    value: shortcodeParams.context,
    onBlur: updateShortcodeParams
  })), isImagesChat && /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 5
    }
  }, /*#__PURE__*/React.createElement("label", null, "Max Results (= Number of Images):"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "max_results",
    name: "max_results",
    type: "number",
    value: shortcodeParams.max_results,
    onBlur: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "AI Name:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "ai_name",
    name: "ai_name",
    value: shortcodeParams.ai_name,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 4
    }
  }, /*#__PURE__*/React.createElement("label", null, "Start Sentence:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "start_sentence",
    name: "start_sentence",
    value: shortcodeParams.start_sentence,
    onBlur: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "User Name:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "user_name",
    name: "user_name",
    value: shortcodeParams.user_name,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement("label", null, "Placeholder:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "text_input_placeholder",
    name: "text_input_placeholder",
    value: shortcodeParams.text_input_placeholder,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Send:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "text_send",
    name: "text_send",
    value: shortcodeParams.text_send,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Clear:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "text_clear",
    name: "text_clear",
    value: shortcodeParams.text_clear,
    onBlur: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Style:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoSelect, {
    scrolldown: true,
    id: "style",
    name: "style",
    value: shortcodeParams.style,
    description: "",
    onChange: updateShortcodeParams
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoOption, {
    value: "none",
    label: "None"
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoOption, {
    value: "chatgpt",
    label: "ChatGPT"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Popup Window:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "window",
    label: "Yes",
    checked: shortcodeParams.window,
    value: "1",
    onChange: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Full Screen:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "fullscreen",
    label: "Yes",
    checked: shortcodeParams.fullscreen,
    value: "1",
    onChange: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, "ID:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "id",
    name: "id",
    type: "text",
    value: shortcodeParams.id,
    onBlur: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "System Name:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "sys_name",
    name: "sys_name",
    value: shortcodeParams.sys_name,
    onBlur: updateShortcodeParams
  })), isChat && /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Content Aware:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "content_aware",
    label: "Yes",
    requirePro: true,
    isPro: _app_settings__WEBPACK_IMPORTED_MODULE_1__.isRegistered,
    checked: shortcodeParams.content_aware,
    value: "1",
    onChange: updateShortcodeParams
  }))), isChat && /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement("label", null, "Model:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoSelect, {
    scrolldown: true,
    id: "model",
    name: "model",
    value: shortcodeParams.model,
    description: "",
    onChange: updateShortcodeParams
  }, models.map(function (x) {
    return /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_19__.NekoOption, {
      value: x.id,
      label: x.name
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Max Tokens:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "max_tokens",
    name: "max_tokens",
    type: "number",
    min: "10",
    max: "2048",
    value: shortcodeParams.max_tokens,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col"
  }, /*#__PURE__*/React.createElement("label", null, "Temperature:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoInput, {
    id: "temperature",
    name: "temperature",
    type: "number",
    step: "0.1",
    min: "0",
    max: "1",
    value: shortcodeParams.temperature,
    onBlur: updateShortcodeParams
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-builder-col",
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement("label", null, "Casually Fine Tuned:"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "casually_fine_tuned",
    label: "Yes",
    checked: shortcodeParams.casually_fine_tuned,
    value: "1",
    onChange: updateShortcodeParams
  }))), /*#__PURE__*/React.createElement("pre", null, builtShortcode)), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "shortcode_chat_params_override",
    label: "Set as Default Parameters",
    disabled: Object.keys(shortcodeParamsDiff).length < 1 && !shortcodeParamsOverride,
    value: "1",
    checked: shortcodeParamsOverride,
    description: "The parameters set above will be used by default. If you are using 'Popup Window' and many chatbots on the same page, be careful, as they will probably appear on top of each other.",
    onChange: updateOption
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoCheckbox, {
    id: "shortcode_chat_inject",
    label: "Inject Default Chatbot in Website",
    value: "1",
    checked: shortcodeChatInject,
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Inject the default chatbot automatically on your website. It will be available on every page."), shortcodeParams.window ? '' : /*#__PURE__*/React.createElement("span", null, " It's highly recommended to enable 'Window (Popup Mode)'")),
    onChange: updateOption
  }))))), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "Fine Tuning: Train your AI"
  }, /*#__PURE__*/React.createElement(_FineTuning__WEBPACK_IMPORTED_MODULE_21__["default"], {
    options: options,
    updateOption: updateOption
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    key: "openai-status",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "OpenAI Status", accidentsPastDay > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "\xA0\u26A0\uFE0F") : "")
  }, /*#__PURE__*/React.createElement(_Settings_OpenAIStatus__WEBPACK_IMPORTED_MODULE_22__["default"], {
    incidents: incidents,
    isLoading: isLoadingIncidents
  })), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_13__.NekoTab, {
    title: "License"
  }, /*#__PURE__*/React.createElement(_common__WEBPACK_IMPORTED_MODULE_23__.LicenseBlock, {
    domain: _app_settings__WEBPACK_IMPORTED_MODULE_1__.domain,
    prefix: _app_settings__WEBPACK_IMPORTED_MODULE_1__.prefix,
    isPro: _app_settings__WEBPACK_IMPORTED_MODULE_1__.isPro,
    isRegistered: _app_settings__WEBPACK_IMPORTED_MODULE_1__.isRegistered
  }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Settings);

/***/ }),

/***/ "./app/js/screens/Settings/OpenAIStatus.js":
/*!*************************************************!*\
  !*** ./app/js/screens/Settings/OpenAIStatus.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/common/NekoTheme.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// React & Vendor Libs
var _wp$element = wp.element,
  useState = _wp$element.useState,
  useEffect = _wp$element.useEffect,
  useMemo = _wp$element.useMemo;


// NekoUI

var StyledIncidents = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  color: white;\n  width: 100%;\n  margin-top: -20px;\n\n  h3 {\n    color: white;\n  }\n\n  .description {\n    background: white;\n    color: black;\n    padding: 8px 10px;\n    border-radius: 5px;\n\n    p {\n      small {\n        color: ", ";\n        font-size: 13px;\n      }\n    }\n\n    p:first-child {\n      margin-top: 0;\n    }\n\n    p:last-child {\n      margin-bottom: 0;\n    }\n  }\n"])), _neko_ui__WEBPACK_IMPORTED_MODULE_1__["default"].orange);
function getPSTLocalTimeDifference() {
  var now = new Date();
  var pst = new Date(now.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles'
  }));
  var offset = (now - pst) / 3600000;
  return offset.toFixed(0);
}
var OpenAIStatus = function OpenAIStatus(_ref) {
  var incidents = _ref.incidents,
    isLoading = _ref.isLoading;
  var timeDiff = getPSTLocalTimeDifference();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0px 10px 10px 10px"
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoTypo, {
    p: true,
    style: {
      color: 'white'
    }
  }, "Only the incidents which occured ", /*#__PURE__*/React.createElement("b", null, "less than a week ago"), " are displayed here. For your information, the time difference between the PST time used by OpenAI and your local time is ", timeDiff, " hours."), /*#__PURE__*/React.createElement(StyledIncidents, null, isLoading && /*#__PURE__*/React.createElement("div", null, "Loading..."), incidents && incidents.map(function (incident) {
    return /*#__PURE__*/React.createElement("div", {
      key: incident.guid
    }, /*#__PURE__*/React.createElement("h3", null, "\u26A0\uFE0F ", incident.date, ": ", incident.title), /*#__PURE__*/React.createElement("div", {
      className: "description",
      dangerouslySetInnerHTML: {
        __html: incident.description
      }
    }));
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OpenAIStatus);

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
/* harmony export */   "pricing": () => (/* binding */ pricing),
/* harmony export */   "restNonce": () => (/* binding */ restNonce),
/* harmony export */   "restUrl": () => (/* binding */ restUrl),
/* harmony export */   "session": () => (/* binding */ session)
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
var session = mwai_meow_plugin.session;
var pricing = mwai_meow_plugin.pricing;


/***/ }),

/***/ "./app/js/styles/AiIcon.js":
/*!*********************************!*\
  !*** ./app/js/styles/AiIcon.js ***!
  \*********************************/
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

/***/ "./app/js/styles/CommonStyles.js":
/*!***************************************!*\
  !*** ./app/js/styles/CommonStyles.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AiButton": () => (/* binding */ AiButton),
/* harmony export */   "AiNekoHeader": () => (/* binding */ AiNekoHeader),
/* harmony export */   "StyledForm": () => (/* binding */ StyledForm),
/* harmony export */   "StyledGallery": () => (/* binding */ StyledGallery),
/* harmony export */   "StyledTextField": () => (/* binding */ StyledTextField),
/* harmony export */   "StyledTitleWithButton": () => (/* binding */ StyledTitleWithButton)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Header.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/TextArea.js");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
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
var AiButton = (0,styled_components__WEBPACK_IMPORTED_MODULE_2__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoButton)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n"])));
var StyledTitleWithButton = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: unset;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 0 2px 0;\n\n  h2 {\n    margin: 7px 0 0 0;\n    padding: 0;\n  }\n"])));
var StyledGallery = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));\n  grid-template-rows: repeat(auto-fit, minmax(30%, 1fr));\n  grid-gap: 10px;\n  margin-top: 20px;\n\n  img, div {\n    width: 100%;\n    cursor: pointer;\n  }\n  .empty-image {\n    width: 100%;\n    padding-bottom: 100%;\n    background-color: #f5f5f5;\n  }\n"])));
var StyledTextField = (0,styled_components__WEBPACK_IMPORTED_MODULE_2__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoTextArea)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\n  .neko-textarea {\n    height: 76px;\n    border: 1px solid #eaeaea !important;\n    background: #fbfbfb !important;\n    font-size: 15px !important;\n  }\n"])));
var StyledForm = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n\n  label {\n    margin-bottom: 5px;\n    display: block;\n  }\n\n  .nui-button {\n    margin-bottom: 5px;\n  }\n\n  .neko-textarea {\n    border: 1px solid #eaeaea !important;\n    background: #fbfbfb !important;\n    margin-bottom: 5px;\n  }\n\n  .neko-input {\n    border: 1px solid #eaeaea !important;\n    background: #fbfbfb !important;\n    margin-bottom: 5px;\n  }\n\n  .form-row {\n    display: flex;\n    .nui-button, .neko-textarea, .neko-input {\n      margin: 0;\n    }\n  }\n\n  .form-row-label {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  }\n"])));


/***/ }),

/***/ "./app/js/styles/ModalStyles.js":
/*!**************************************!*\
  !*** ./app/js/styles/ModalStyles.js ***!
  \**************************************/
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

/***/ "./app/js/styles/StyledSidebar.js":
/*!****************************************!*\
  !*** ./app/js/styles/StyledSidebar.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyledBuilderForm": () => (/* binding */ StyledBuilderForm),
/* harmony export */   "StyledNekoInput": () => (/* binding */ StyledNekoInput),
/* harmony export */   "StyledSidebar": () => (/* binding */ StyledSidebar)
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }


var StyledSidebar = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: white;\n  padding: 15px;\n  border-radius: 5px;\n\n  h2 {\n    margin-bottom: 8px;\n  }\n  \n  h3:first-child {\n    margin-top: 0;\n  }\n\n  label {\n    display: block;\n    margin-bottom: 5px;\n  }\n\n  label {\n    margin-top: 10px;\n  }\n\n  ul {\n    margin: 20px 0 0 0;\n  }\n\n  li {\n    margin-bottom: 5px;\n    border: 1px solid #e5e5e5;\n    padding: 8px;\n    background: #f5f5f5;\n    border-radius: 5px;\n    cursor: pointer;\n    position: relative;\n\n    &:last-child {\n      margin-bottom: 0;\n    }\n\n    &:hover {\n      background: #e5e5e5;\n    }\n\n    &.active {\n      background: #007cba;\n      color: white;\n      border-color: #007cba;\n\n      &.modified {\n        background: #ff8c00;\n        border-color: #ff8c00;\n      }\n    }\n  }\n\n  .information {\n    color: #a3a3a3;\n    margin-top: 5px;\n    font-size: 12px;\n    line-height: 100%;\n  }\n"])));
var StyledNekoInput = (0,styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_neko_ui__WEBPACK_IMPORTED_MODULE_1__.NekoInput)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex: auto !important;\n\n  input {\n    height: 50px !important;\n    font-size: 13px !important;\n    font-family: monospace !important;\n    padding: 20px !important;\n    border-color: #333d4e !important;\n    background: #333d4e !important;\n    color: white !important;\n  }\n"])));
var StyledBuilderForm = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n\n  label {\n    margin-bottom: 3px;\n  }\n\n  .mwai-builder-row {\n    margin-top: 10px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n\n    .neko-color-picker {\n      margin-left: 5px;\n    }\n  }\n\n  .mwai-builder-col {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    margin-right: 5px;\n  }\n\n  .mwai-builder-col:last-child {\n    margin-right: 0;\n  }\n\n  pre {\n    white-space: pre-wrap;\n    background: #d4f0ff;\n    color: #037cba;\n    padding: 10px;\n    font-size: 13px;\n    font-weight: bold;\n    margin: 20px 0;\n  }\n\n  .neko-spacer {\n    margin-bottom: 0 !important;\n  }\n\n  .neko-input {\n    border: 1.5px solid #eaeaea !important;\n    background: #fbfbfb !important;\n  }\n\n  .nui-select-option {\n    border: 1.5px solid #eaeaea !important;\n    background: #fbfbfb !important;\n  }\n\n\n"])));


/***/ }),

/***/ "./common/js/components/LicenseBlock.js":
/*!**********************************************!*\
  !*** ./common/js/components/LicenseBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LicenseBlock": () => (/* binding */ LicenseBlock)
/* harmony export */ });
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Block.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/container/Settings.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/form/Input.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Message.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/misc/Typography.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/button/Button.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/modal/Modal.js");
/* harmony import */ var _neko_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @neko-ui */ "../neko-ui/src/helpers.js");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/settings */ "./app/js/settings.js");
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
  useEffect = _wp$element.useEffect;

// NekoUI



// From Main Plugin

var CommonApiUrl = "".concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.restUrl, "/meow-licenser/").concat(_app_settings__WEBPACK_IMPORTED_MODULE_0__.prefix, "/v1");
var LicenseBlock = function LicenseBlock() {
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    busy = _useState2[0],
    setBusy = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    meowMode = _useState4[0],
    setMeowMode = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    currentModal = _useState6[0],
    setCurrentModal = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    license = _useState8[0],
    setLicense = _useState8[1];
  var _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    serialKey = _useState10[0],
    setSerialKey = _useState10[1];
  var isOverridenLicense = _app_settings__WEBPACK_IMPORTED_MODULE_0__.isRegistered && (!license || license.license !== 'valid');
  var checkLicense = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (_app_settings__WEBPACK_IMPORTED_MODULE_0__.isPro) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            setBusy(true);
            _context.next = 5;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.nekoFetch)("".concat(CommonApiUrl, "/get_license"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce
            });
          case 5:
            res = _context.sent;
            setLicense(res.data);
            if (res.data.key) {
              setSerialKey(res.data.key);
            }
            setBusy(false);
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function checkLicense() {
      return _ref.apply(this, arguments);
    };
  }();
  var removeLicense = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var res;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setBusy(true);
            _context2.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.nekoFetch)("".concat(CommonApiUrl, "/set_license"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce,
              json: {
                serialKey: null
              }
            });
          case 3:
            res = _context2.sent;
            if (res.success) {
              setSerialKey('');
              setLicense(null);
              setCurrentModal('licenseRemoved');
            }
            setBusy(false);
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function removeLicense() {
      return _ref2.apply(this, arguments);
    };
  }();
  var forceLicense = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var res;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            setBusy(true);
            _context3.next = 3;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.nekoFetch)("".concat(CommonApiUrl, "/set_license"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce,
              json: {
                serialKey: serialKey,
                override: true
              }
            });
          case 3:
            res = _context3.sent;
            if (res.success) {
              setLicense(res.data);
              if (res.data && !res.data.issue) {
                setCurrentModal('licenseAdded');
              }
            }
            setBusy(false);
          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function forceLicense() {
      return _ref3.apply(this, arguments);
    };
  }();
  var validateLicense = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var res;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(serialKey === 'MEOW_OVERRIDE')) {
              _context4.next = 5;
              break;
            }
            setMeowMode(true);
            setLicense(null);
            setSerialKey("");
            return _context4.abrupt("return");
          case 5:
            setBusy(true);
            _context4.next = 8;
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.nekoFetch)("".concat(CommonApiUrl, "/set_license"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_0__.restNonce,
              json: {
                serialKey: serialKey
              }
            });
          case 8:
            res = _context4.sent;
            if (res.success) {
              setLicense(res.data);
              if (res.data && !res.data.issue) {
                setCurrentModal('licenseAdded');
              }
            }
            setBusy(false);
          case 11:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function validateLicense() {
      return _ref4.apply(this, arguments);
    };
  }();
  useEffect(function () {
    checkLicense();
  }, []);
  var licenseTextStatus = isOverridenLicense ? 'Forced License' : _app_settings__WEBPACK_IMPORTED_MODULE_0__.isRegistered ? 'Enabled' : 'Disabled';
  var success = isOverridenLicense || license && license.license === 'valid';
  var message = 'Your license is active. Thanks a lot for your support :)';
  if (isOverridenLicense && license && license.check_url) {
    message = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, message), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, "This license was enabled manually. To check your license status, please click ", /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      href: license.check_url + '&cache=' + Math.random() * 642000
    }, "here"), "."));
  }
  if (!success) {
    if (!license) {
      message = 'Unknown error :(';
    } else if (license.issue === 'no_activations_left') {
      message = /*#__PURE__*/React.createElement("span", null, "There are no activations left for this license. You can visit your account at the ", /*#__PURE__*/React.createElement("a", {
        target: "_blank",
        rel: "noreferrer",
        href: "https://meowapps.com"
      }, "Meow Apps Store"), ", unregister a site, and click on ", /*#__PURE__*/React.createElement("i", null, "Retry to validate"), ".");
    } else if (license.issue === 'expired') {
      message = /*#__PURE__*/React.createElement("span", null, "Your license has expired. You can get another license or renew the current one by visiting your account at the ", /*#__PURE__*/React.createElement("a", {
        target: "_blank",
        rel: "noreferrer",
        href: "https://meowapps.com"
      }, "Meow Apps Store"), ".");
    } else if (license.issue === 'missing') {
      message = 'This license does not exist.';
    } else if (license.issue === 'disabled') {
      message = 'This license has been disabled.';
    } else if (license.issue === 'item_name_mismatch') {
      message = 'This license seems to be for a different plugin... isn\'t it? :)';
    } else if (license.issue === 'forced') {
      message = 'ABC';
    } else {
      message = /*#__PURE__*/React.createElement("span", null, "There is an unknown error related to the system or this serial key. Really sorry about this! Make sure your security plugins and systems are off temporarily. If you are still experiencing an issue, please ", /*#__PURE__*/React.createElement("a", {
        target: "_blank",
        rel: "noreferrer",
        href: "https://meowapps.com/contact/"
      }, "contact us"), ".");
      console.error({
        license: license
      });
    }
  }
  var jsxNonPro = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoBlock, {
    title: "Pro Version (Not Installed)",
    className: "primary"
  }, "You will find more information about the Pro Version ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://meowapps.com"
  }, "here"), ". If you actually bought the Pro Version already, please remove the current plugin and download the Pro Version from your account at the ", /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://meowapps.com/"
  }, "Meow Apps Store"), ".");
  var jsxProVersion = /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_2__.NekoBlock, {
    title: "Pro Version (".concat(licenseTextStatus, ")"),
    busy: busy,
    className: "primary"
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoSettings, {
    title: "Serial Key",
    style: {
      fontWeight: 'bold'
    }
  }, /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_4__.NekoInput, {
    id: "mfrh_pro_serial",
    name: "mfrh_pro_serial",
    disabled: busy,
    value: serialKey,
    onChange: function onChange(txt) {
      return setSerialKey(txt);
    },
    placeholder: ""
  })), license && !success && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoMessageDanger, null, message), license && success && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_5__.NekoMessageSuccess, null, message), !license && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_6__.NekoTypo, {
    p: true
  }, "Insert your serial key above. If you don't have one yet, you can get one ", /*#__PURE__*/React.createElement("a", {
    href: "https://meowapps.com"
  }, "here"), ". If there was an error during the validation, try the ", /*#__PURE__*/React.createElement("i", null, "Retry"), " to ", /*#__PURE__*/React.createElement("i", null, "validate"), " button."), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_3__.NekoSettings, {
    contentAlign: "right"
  }, license && !success && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoButton, {
    className: "secondary",
    disabled: busy || !serialKey,
    onClick: validateLicense
  }, "Retry to validate"), license && license.key === serialKey && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoButton, {
    className: "secondary",
    disabled: busy || !serialKey,
    onClick: removeLicense
  }, "Remove License"), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoButton, {
    disabled: busy || !serialKey || license && license.key === serialKey,
    onClick: validateLicense
  }, "Validate License"), meowMode && !success && /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_7__.NekoButton, {
    disabled: busy || !serialKey || license && license.key === serialKey,
    onClick: forceLicense,
    className: "danger"
  }, "Force License")), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoModal, {
    isOpen: currentModal === 'licenseAdded',
    title: "Thank you :)",
    content: "The Pro features have been enabled. This page should be now reloaded.",
    ok: "Reload",
    onOkClick: function onOkClick() {
      return location.reload();
    }
  }), /*#__PURE__*/React.createElement(_neko_ui__WEBPACK_IMPORTED_MODULE_8__.NekoModal, {
    isOpen: currentModal === 'licenseRemoved',
    title: "Goodbye :(",
    content: "The Pro features have been disabled. This page should be now reloaded.",
    ok: "Reload",
    onOkClick: function onOkClick() {
      return location.reload();
    }
  }));
  return _app_settings__WEBPACK_IMPORTED_MODULE_0__.isPro ? jsxProVersion : jsxNonPro;
};


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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.nekoFetch)("".concat(CommonApiUrl, "/update_option"), {
              method: 'POST',
              nonce: _app_settings__WEBPACK_IMPORTED_MODULE_1__.restNonce,
              json: {
                name: id,
                value: value
              }
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_4__.nekoFetch)("".concat(CommonApiUrl, "/error_logs"), {
              method: 'POST',
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
            return (0,_neko_ui__WEBPACK_IMPORTED_MODULE_1__.nekoFetch)("".concat(CommonApiUrl, "/").concat(request), {
              method: 'POST',
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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