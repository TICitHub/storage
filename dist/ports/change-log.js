'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v5');

var _v2 = _interopRequireDefault(_v);

var _arraySort = require('array-sort');

var _arraySort2 = _interopRequireDefault(_arraySort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChangeLog = function () {
  function ChangeLog(adapter) {
    _classCallCheck(this, ChangeLog);

    this.adapter = adapter;
    this.listener = function () {};
  }

  _createClass(ChangeLog, [{
    key: 'onChange',
    value: function onChange(func) {
      this.listener = func;
    }
  }, {
    key: 'reconstruct',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(topic) {
        var log;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.adapter.read(topic);

              case 2:
                log = _context.sent;

                log = (0, _arraySort2.default)(log, 'version');

                return _context.abrupt('return', log);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function reconstruct(_x) {
        return _ref.apply(this, arguments);
      }

      return reconstruct;
    }()
  }, {
    key: 'register',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(topic, document) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.adapter.write(topic, document);

              case 2:
                this.listener(_extends({}, document, { type: topic }));

                return _context2.abrupt('return', document);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function register(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return register;
    }()
  }]);

  return ChangeLog;
}();

exports.default = ChangeLog;