/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/app.js":
/*!***************************!*\
  !*** ./src/client/app.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// const Web3 = require('web3');\n// const TruffleContract = require(\"truffle-contract\");\n\nApp = {\n    web3Provider: null,\n    contracts: {},\n    account: '0x0',\n    accounts: null,\n    tokensAvailable: 1000000,\n\n    init: function() {\n        console.log(\"App initialized...\")\n        return App.initWeb3();\n    },\n\n    initWeb3: function() {\n        if(typeof web3 !== 'undefined') {\n            App.web3Provider = web3.currentProvider;\n            web3 = new Web3(web3.currentProvider);\n        } else {\n            App.web3Provider = new Web3Providers.HttpProvider('http://localhost:7547');\n            web3 = new Web3(App.web3Provider);\n        }\n        return App.initContracts();\n    },\n\n    initContracts: function() {\n        $.getJSON(\"ArgetherToken.json\", function(argetherToken) {\n            App.contracts.ArgetherToken = TruffleContract(argetherToken);\n            App.contracts.ArgetherToken.setProvider(App.web3Provider);\n            App.contracts.ArgetherToken.deployed().then(function(argetherToken) {\n                console.log(\"ArgetherToken address: \", argetherToken.address);\n            });\n            App.listenForEvents();\n            return App.render();\n        });\n    },\n\n    listenForEvents: function() {\n        App.contracts.ArgetherToken.deployed().then(function(instance) {\n            instance.Transfer({}, {\n                fromBlock: 0,\n                toBlock: 'latest',\n            }).watch(function(error, event) {\n                console.log(\"event triggered\", event);\n                App.render();\n            })\n        })\n    },\n\n    render: function() {\n        // load account data\n        web3.eth.getCoinbase(function(error, account) {\n            if(error === null) {\n                App.account = account;\n                console.log(\"Admin account: \" + account);\n            } else {\n                console.log(\"Error: getCoinbase()\");\n            }\n        })\n\n        web3.eth.getAccounts((err, acc) => { \n            if(err === null){\n                App.accounts = acc;\n                console.log(\"Accounts: \" + acc);\n            } else {\n                console.log(\"Error fetching accounts\");\n            }\n        })\n\n        App.contracts.ArgetherToken.deployed().then(function(instance) {\n            argetherToken = instance;\n            return argetherToken.totalSupply();\n        }).then(function(supply) {\n            console.log(\"token supply: \", supply);\n            $('#output').html(supply.toNumber());\n            $('#output').show();\n        });\n\n        const button = document.getElementById('transfer');\n        button.addEventListener('click', function(e) {\n            console.log('button was clicked');\n        });\n\n    }\n}\n\n$(function() {\n    $(window).load(function() {\n        App.init();\n    })\n});\n\n//# sourceURL=webpack:///./src/client/app.js?");

/***/ })

/******/ });