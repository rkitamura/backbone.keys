/*
Backbone.keys.js 0.2.0

(c) 2012 Raymond Julin, Keyteq AS
Backbone.keys may be freely distributed under the MIT license.
*/
(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["underscore", "backbone", "jquery"], factory);
  } else {
    return factory(_, Backbone, $);
  }
})(function(_, Backbone, $) {
  var BackboneKeysMap, getKeyCode, oldDelegateEvents, oldUndelegateEvents;

  oldDelegateEvents = Backbone.View.prototype.delegateEvents;
  oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;
  getKeyCode = function(key) {
    if (key.length === 1) {
      return key.toUpperCase().charCodeAt(0);
    } else {
      return BackboneKeysMap[key];
    }
  };
  BackboneKeysMap = {
    backspace: 8,
    tab: 9,
    enter: 13,
    space: 32,
    shift: 16,
    ctrl: 17,
    alt: 18,
    meta: 91,
    caps_lock: 20,
    esc: 27,
    num_lock: 144,
    page_up: 33,
    page_down: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    "delete": 46,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123
  };
  _.each({
    options: "alt",
    "return": "enter"
  }, function(real, alias) {
    return BackboneKeysMap[alias] = BackboneKeysMap[real];
  });
  Backbone.View = Backbone.View.extend({
    bindKeysOn: "keydown",
    bindKeysScoped: false,
    bindTo: null,
    _keyEventBindings: null,
    delegateEvents: function() {
      oldDelegateEvents.apply(this, arguments);
      return this.delegateKeys();
    },
    undelegateEvents: function() {
      this.undelegateKeys();
      return oldUndelegateEvents.apply(this, arguments);
    },
    delegateKeys: function(keys) {
      this.undelegateKeys();
      if (!this.bindTo) {
        this.bindTo = (this.bindKeysScoped || typeof $ === "undefined" ? this.$el : $(document));
      }
      this.bindTo.on(this.bindKeysOn + ".delegateKeys" + this.cid, _.bind(this.triggerKey, this));
      keys = keys || this.keys;
      if (keys) {
        return _.each(keys, (function(method, key) {
          return this.keyOn(key, method);
        }), this);
      }
    },
    undelegateKeys: function() {
      this._keyEventBindings = {};
      if (this.bindTo) {
        return this.bindTo.off(this.bindKeysOn + ".delegateKeys" + this.cid);
      }
    },
    keyName: function(keyCode) {
      var keyName;

      keyName = void 0;
      for (keyName in BackboneKeysMap) {
        if (BackboneKeysMap[keyName] === keyCode) {
          return keyName;
        }
      }
      return String.fromCharCode(keyCode);
    },
    triggerKey: function(e) {
      var key;

      key = void 0;
      if (_.isObject(e)) {
        key = e.which;
      } else if (_.isString(e)) {
        key = getKeyCode(e);
      } else {
        if (_.isNumber(e)) {
          key = e;
        }
      }
      return _(this._keyEventBindings[key]).each(function(listener) {
        var trigger;

        trigger = true;
        if (listener.modifiers) {
          trigger = _(listener.modifiers).all(function(modifier) {
            return e[modifier + "Key"] === true;
          });
        }
        if (trigger) {
          return listener.method(e, listener.key);
        }
      });
    },
    keyOn: function(key, method) {
      var components, keyCode, l;

      key = key.split(" ");
      if (key.length > 1) {
        l = key.length;
        while (l--) {
          this.keyOn(key[l], method);
        }
        return;
      } else {
        key = key.pop().toLowerCase();
      }
      components = key.split("+");
      key = components.shift();
      keyCode = getKeyCode(key);
      if (!this._keyEventBindings.hasOwnProperty(keyCode)) {
        this._keyEventBindings[keyCode] = [];
      }
      if (!_.isFunction(method)) {
        method = this[method];
      }
      this._keyEventBindings[keyCode].push({
        key: key,
        modifiers: components || false,
        method: _.bind(method, this)
      });
      return this;
    },
    keyOff: function(key, method) {
      var keyCode;

      method = method || false;
      if (key === null) {
        this._keyEventBindings = {};
        return this;
      }
      keyCode = getKeyCode(key);
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (!method) {
        this._keyEventBindings[keyCode] = [];
        return this;
      }
      this._keyEventBindings[keyCode] = _.filter(this._keyEventBindings[keyCode], function(data, index) {
        return data.method === method;
      });
      return this;
    }
  });
  return Backbone;
});
