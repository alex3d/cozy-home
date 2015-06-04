(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("collections/application", function(exports, require, module) {
var Application, ApplicationCollection, BaseCollection, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Application = require('models/application');

client = require('../lib/client');

module.exports = ApplicationCollection = (function(_super) {
  __extends(ApplicationCollection, _super);

  function ApplicationCollection() {
    _ref = ApplicationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationCollection.prototype.model = Application;

  ApplicationCollection.prototype.url = 'api/applications/';

  ApplicationCollection.prototype.apps = [];

  ApplicationCollection.prototype.get = function(idorslug) {
    var app, out, _i, _len, _ref1;
    out = ApplicationCollection.__super__.get.call(this, idorslug);
    if (out) {
      return out;
    }
    _ref1 = this.models;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      app = _ref1[_i];
      if (idorslug === app.get('id')) {
        return app;
      }
    }
  };

  return ApplicationCollection;

})(BaseCollection);
});

;require.register("collections/background", function(exports, require, module) {
var Background, BackgroundCollection, BaseCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Background = require('models/background');

module.exports = BackgroundCollection = (function(_super) {
  __extends(BackgroundCollection, _super);

  function BackgroundCollection() {
    _ref = BackgroundCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundCollection.prototype.url = 'api/backgrounds';

  BackgroundCollection.prototype.model = Background;

  BackgroundCollection.prototype.addPredefinedBackgrounds = function() {
    return this.add([
      {
        id: 'background-none',
        predefined: true
      }, {
        id: 'background-01',
        predefined: true
      }, {
        id: 'background-02',
        predefined: true
      }, {
        id: 'background-03',
        predefined: true
      }, {
        id: 'background-04',
        predefined: true
      }, {
        id: 'background-05',
        predefined: true
      }, {
        id: 'background-06',
        predefined: true
      }, {
        id: 'background-07',
        predefined: true
      }, {
        id: 'background-08',
        predefined: true
      }
    ]);
  };

  BackgroundCollection.prototype.init = function() {
    var _this = this;
    return this.fetch({
      success: function(models) {
        var selected;
        _this.addPredefinedBackgrounds();
        selected = _this.findWhere({
          id: window.app.instance.background
        });
        if (selected == null) {
          selected = _this.at(0);
        }
        if (selected != null) {
          return selected.set({
            'selected': true
          });
        }
      },
      error: function() {}
    });
  };

  return BackgroundCollection;

})(Backbone.Collection);
});

;require.register("collections/device", function(exports, require, module) {
var BaseCollection, Device, DeviceCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Device = require('models/device');

module.exports = DeviceCollection = (function(_super) {
  __extends(DeviceCollection, _super);

  function DeviceCollection() {
    _ref = DeviceCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DeviceCollection.prototype.model = Device;

  DeviceCollection.prototype.url = 'api/devices/';

  return DeviceCollection;

})(BaseCollection);
});

;require.register("collections/notifications", function(exports, require, module) {
var BaseCollection, Notification, NotificationCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

Notification = require('models/notification');

module.exports = NotificationCollection = (function(_super) {
  __extends(NotificationCollection, _super);

  function NotificationCollection() {
    _ref = NotificationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationCollection.prototype.model = Notification;

  NotificationCollection.prototype.url = 'api/notifications';

  NotificationCollection.prototype.removeAll = function(options) {
    var success,
      _this = this;
    if (options == null) {
      options = {};
    }
    success = options.success;
    options.success = function() {
      _this.reset([]);
      return success != null ? success.apply(_this, arguments) : void 0;
    };
    return this.sync('delete', this, options);
  };

  return NotificationCollection;

})(Backbone.Collection);
});

;require.register("collections/stackApplication", function(exports, require, module) {
var ApplicationCollection, BaseCollection, StackApplication, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('lib/base_collection');

StackApplication = require('models/stack_application');

module.exports = ApplicationCollection = (function(_super) {
  __extends(ApplicationCollection, _super);

  function ApplicationCollection() {
    _ref = ApplicationCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationCollection.prototype.model = StackApplication;

  ApplicationCollection.prototype.url = 'api/applications/stack';

  return ApplicationCollection;

})(BaseCollection);
});

;require.register("helpers/client", function(exports, require, module) {
exports.request = function(type, url, data, callbacks) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
    success: callbacks.success,
    error: callbacks.error
  });
};

exports.get = function(url, callbacks) {
  return exports.request("GET", url, null, callbacks);
};

exports.post = function(url, data, callbacks) {
  return exports.request("POST", url, data, callbacks);
};

exports.put = function(url, data, callbacks) {
  return exports.request("PUT", url, data, callbacks);
};

exports.del = function(url, callbacks) {
  return exports.request("DELETE", url, null, callbacks);
};
});

;require.register("helpers/color-set", function(exports, require, module) {
module.exports = ['ead1ad', 'fbf0c2', '3cd7c3', '8FBAff', 'B4AED9', '78dc9a', '8DED2A', '8eecB9', 'bbcaA9', 'cdb19b', 'ec7e63', '8cec56', 'ffb1be', 'DD99CE', 'E26987', '8CB1FF', 'f5dd16', 'f1fab8', 'ffbe56', '6EE1C8', 'C4BEE9', '59C1ef', 'EC7E63', '8BEE8C'];
});

;require.register("helpers/locales", function(exports, require, module) {
exports.locales = {
  'en': 'English',
  'fr': 'Français'
};
});

;require.register("helpers/slugify", function(exports, require, module) {
var slugify;

module.exports = slugify = function(string) {
  var _slugify_hyphenate_re, _slugify_strip_re;
  _slugify_strip_re = /[^\w\s-]/g;
  _slugify_hyphenate_re = /[-\s]+/g;
  string = string.replace(_slugify_strip_re, '').trim().toLowerCase();
  string = string.replace(_slugify_hyphenate_re, '-');
  return string;
};
});

;require.register("helpers/timezone", function(exports, require, module) {
exports.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Vostok", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/Simferopol", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC"];
});

;require.register("initialize", function(exports, require, module) {
var Instance, MainRouter, MainView, colorSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MainRouter = require('routers/main_router');

MainView = require('views/main');

Instance = require('models/instance');

colorSet = require('../helpers/color-set');

exports.Application = (function() {
  function Application() {
    this.initialize = __bind(this.initialize, this);
    $(this.initialize);
  }

  Application.prototype.initialize = function() {
    var SocketListener, data, err, instance, locales, _ref;
    this.instance = window.cozy_instance || {};
    this.locale = ((_ref = this.instance) != null ? _ref.locale : void 0) || 'en';
    try {
      locales = require('locales/' + this.locale);
    } catch (_error) {
      err = _error;
      locales = require('locales/en');
    }
    window.app = this;
    this.polyglot = new Polyglot();
    this.polyglot.extend(locales);
    window.t = this.polyglot.t.bind(this.polyglot);
    moment.locale(this.locale);
    ColorHash.addScheme('cozy', colorSet);
    this.routers = {};
    this.mainView = new MainView();
    this.routers.main = new MainRouter();
    Backbone.history.start();
    if (!window.cozy_instance.connectedOnce) {
      this.routers.main.navigate('home/quicktour', true);
      data = {
        connectedOnce: true
      };
      instance = new Instance(window.cozy_instance);
      instance.saveData(data, function(err) {
        console.log('connectedOnce saved');
        return console.log(err);
      });
    } else if (Backbone.history.getFragment() === '') {
      this.routers.main.navigate('home', true);
    }
    SocketListener = require('lib/socket_listener');
    return SocketListener.socket.on('installerror', function(err) {
      console.log("An error occured while attempting to install app");
      return console.log(err);
    });
  };

  return Application;

})();

new exports.Application;
});

;require.register("lib/base_collection", function(exports, require, module) {
var BaseCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseCollection = (function(_super) {
  __extends(BaseCollection, _super);

  function BaseCollection() {
    _ref = BaseCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return BaseCollection;

})(Backbone.Collection);
});

;require.register("lib/base_model", function(exports, require, module) {
var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.BaseModel = (function(_super) {
  __extends(BaseModel, _super);

  function BaseModel() {
    _ref = BaseModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseModel.prototype.isNew = function() {
    return this.id === void 0;
  };

  return BaseModel;

})(Backbone.Model);
});

;require.register("lib/base_view", function(exports, require, module) {
var BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.tagName = 'section';

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {
    this.render();
    return BaseView.__super__.initialize.call(this);
  };

  BaseView.prototype.getRenderData = function() {
    if ((this.model != null) && (this.model.toJSON != null)) {
      return {
        model: this.model.toJSON()
      };
    }
  };

  BaseView.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  BaseView.prototype.beforeRender = function() {};

  BaseView.prototype.afterRender = function() {};

  BaseView.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return BaseView;

})(Backbone.View);
});

;require.register("lib/client", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  return $.ajax({
    type: type,
    url: url,
    data: data != null ? JSON.stringify(data) : null,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      if (callback != null) {
        return callback(null, data);
      }
    },
    error: function(data) {
      var _ref;
      if ((_ref = data.status) === 200 || _ref === 201 || _ref === 204 || _ref === 304) {
        if (callback != null) {
          return callback(null, data);
        }
      } else if ((data != null) && (data.msg != null) && (callback != null)) {
        return callback(new Error(data.msg));
      } else if (callback != null) {
        return callback(new Error("Server error occured"));
      }
    }
  });
};

exports.get = function(url, callbacks) {
  return exports.request("GET", url, null, callbacks);
};

exports.post = function(url, data, callbacks) {
  return exports.request("POST", url, data, callbacks);
};

exports.put = function(url, data, callbacks) {
  return exports.request("PUT", url, data, callbacks);
};

exports.del = function(url, callbacks) {
  return exports.request("DELETE", url, null, callbacks);
};
});

;require.register("lib/intentManager", function(exports, require, module) {
var IntentManager, ObjectPicker,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ObjectPicker = require('views/object-picker');

module.exports = IntentManager = (function() {
  function IntentManager() {
    this.handleIntent = __bind(this.handleIntent, this);
  }

  IntentManager.prototype.registerIframe = function(iframe, remoteOrigin) {
    var talker;
    talker = new Talker(iframe.contentWindow, remoteOrigin);
    return talker.onMessage = this.handleIntent;
  };

  IntentManager.prototype.handleIntent = function(message) {
    var intent;
    intent = message.data;
    switch (intent.type) {
      case 'goto':
        return window.app.routers.main.navigate("apps/" + intent.params, true);
      case 'pickObject':
        switch (intent.params.objectType) {
          case 'singlePhoto':
            if (intent.params.isCropped) {
              return new ObjectPicker(intent.params, function(newPhotoChosen, dataUrl) {
                return message.respond({
                  newPhotoChosen: newPhotoChosen,
                  dataUrl: dataUrl
                });
              });
            } else {
              return new ObjectPicker(intent.params, function(newPhotoChosen, dataUrl) {
                return message.respond({
                  newPhotoChosen: newPhotoChosen,
                  dataUrl: dataUrl
                });
              });
            }
        }
        break;
      case 'ping':
        return message.respond('pong');
    }
  };

  return IntentManager;

})();
});

;require.register("lib/proxyclient", function(exports, require, module) {
var request;

request = require('lib/request');

exports.get = function(url, callback) {
  return request.request('get', 'api/proxy', url, callback);
};
});

;require.register("lib/request", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  var body, fired, req;
  body = data != null ? JSON.stringify(data) : null;
  fired = false;
  req = $.ajax({
    type: type,
    url: url,
    data: body,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      fired = true;
      if (callback != null) {
        return callback(null, data);
      }
    },
    error: function(data) {
      fired = true;
      if (data != null) {
        data = JSON.parse(data.responseText);
        if ((data.msg != null) && (callback != null)) {
          return callback(new Error(data.msg, data));
        } else if ((data.error != null) && (callback != null)) {
          data.msg = data.error;
          return callback(new Error(data.msg, data));
        }
      } else if (callback != null) {
        return callback(new Error("Server error occured", data));
      }
    }
  });
  return req.always(function() {
    if (!fired) {
      return callback(new Error("Server error occured", data));
    }
  });
};

exports.get = function(url, callback) {
  return exports.request("GET", url, null, callback);
};

exports.post = function(url, data, callback) {
  return exports.request("POST", url, data, callback);
};

exports.put = function(url, data, callback) {
  return exports.request("PUT", url, data, callback);
};

exports.del = function(url, callback) {
  return exports.request("DELETE", url, null, callback);
};
});

;require.register("lib/socket_listener", function(exports, require, module) {
var Application, Device, Notification, SocketListener, application_idx, device_idx, notification_idx, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Application = require('models/application');

Notification = require('models/notification');

Device = require('models/device');

application_idx = 0;

notification_idx = 1;

device_idx = 2;

SocketListener = (function(_super) {
  __extends(SocketListener, _super);

  function SocketListener() {
    _ref = SocketListener.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SocketListener.prototype.models = {
    'notification': Notification,
    'device': Device,
    'application': Application
  };

  SocketListener.prototype.events = ['notification.create', 'notification.update', 'notification.delete', 'device.create', 'device.update', 'device.delete', 'application.create', 'application.update', 'application.delete'];

  SocketListener.prototype.onRemoteCreate = function(model) {
    if (model instanceof Application) {
      return this.collections[application_idx].add(model);
    } else if (model instanceof Notification) {
      return this.collections[notification_idx].add(model);
    } else if (model instanceof Device) {
      return this.collections[device_idx].add(model);
    }
  };

  SocketListener.prototype.onRemoteDelete = function(model) {
    if (model instanceof Application) {
      return this.collections[application_idx].remove(model);
    } else if (model instanceof Notification) {
      return this.collections[notification_idx].remove(model);
    } else if (model instanceof Device) {
      return this.collections[device_idx].remove(model);
    }
  };

  return SocketListener;

})(CozySocketListener);

module.exports = new SocketListener();
});

;require.register("lib/templates/wizard", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
// iterate steps
;(function(){
  if ('number' == typeof steps.length) {

    for (var index = 0, $$l = steps.length; index < $$l; index++) {
      var step = steps[index];

buf.push('<section');
buf.push(attrs({ 'id':("" + (step.slug) + "-wizard-tabpanel"), 'role':("tabpanel"), 'aria-labelledby':("" + (step.slug) + "-wizard-tabpanel"), 'aria-hidden':("" + (index !== 0? 'true':'false') + "") }, {"id":true,"role":true,"aria-labelledby":true,"aria-hidden":true}));
buf.push('><header><h1>');
var __val__ = t(context + '.' + step.slug + " title")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h1></header><div class="content">');
var __val__ = t(context + '.' + step.slug + " content")
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><footer>');
if ( step.choices)
{
// iterate step.choices
;(function(){
  if ('number' == typeof step.choices.length) {

    for (var label = 0, $$l = step.choices.length; label < $$l; label++) {
      var action = step.choices[label];

buf.push('<button');
buf.push(attrs({ 'id':("" + (step.slug) + "-" + (label) + ""), "class": ('action') + ' ' + ("" + (label) + "") }, {"class":true,"id":true}));
buf.push('>');
var __val__ = t(context + '.' + label, step)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
    }

  } else {
    var $$l = 0;
    for (var label in step.choices) {
      $$l++;      var action = step.choices[label];

buf.push('<button');
buf.push(attrs({ 'id':("" + (step.slug) + "-" + (label) + ""), "class": ('action') + ' ' + ("" + (label) + "") }, {"class":true,"id":true}));
buf.push('>');
var __val__ = t(context + '.' + label, step)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
    }

  }
}).call(this);

}
else if ( index === (steps.length - 1))
{
buf.push('<button class="close">');
var __val__ = t(context + '.' + "close wizard")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
}
else
{
buf.push('<button class="next">');
var __val__ = t(context + '.' + "continue to " + steps[index + 1].slug)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
}
buf.push('</footer></section>');
    }

  } else {
    var $$l = 0;
    for (var index in steps) {
      $$l++;      var step = steps[index];

buf.push('<section');
buf.push(attrs({ 'id':("" + (step.slug) + "-wizard-tabpanel"), 'role':("tabpanel"), 'aria-labelledby':("" + (step.slug) + "-wizard-tabpanel"), 'aria-hidden':("" + (index !== 0? 'true':'false') + "") }, {"id":true,"role":true,"aria-labelledby":true,"aria-hidden":true}));
buf.push('><header><h1>');
var __val__ = t(context + '.' + step.slug + " title")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h1></header><div class="content">');
var __val__ = t(context + '.' + step.slug + " content")
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><footer>');
if ( step.choices)
{
// iterate step.choices
;(function(){
  if ('number' == typeof step.choices.length) {

    for (var label = 0, $$l = step.choices.length; label < $$l; label++) {
      var action = step.choices[label];

buf.push('<button');
buf.push(attrs({ 'id':("" + (step.slug) + "-" + (label) + ""), "class": ('action') + ' ' + ("" + (label) + "") }, {"class":true,"id":true}));
buf.push('>');
var __val__ = t(context + '.' + label, step)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
    }

  } else {
    var $$l = 0;
    for (var label in step.choices) {
      $$l++;      var action = step.choices[label];

buf.push('<button');
buf.push(attrs({ 'id':("" + (step.slug) + "-" + (label) + ""), "class": ('action') + ' ' + ("" + (label) + "") }, {"class":true,"id":true}));
buf.push('>');
var __val__ = t(context + '.' + label, step)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
    }

  }
}).call(this);

}
else if ( index === (steps.length - 1))
{
buf.push('<button class="close">');
var __val__ = t(context + '.' + "close wizard")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
}
else
{
buf.push('<button class="next">');
var __val__ = t(context + '.' + "continue to " + steps[index + 1].slug)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button>');
}
buf.push('</footer></section>');
    }

  }
}).call(this);

buf.push('<footer><div class="progress adv-0"><ol>');
// iterate steps
;(function(){
  if ('number' == typeof steps.length) {

    for (var index = 0, $$l = steps.length; index < $$l; index++) {
      var step = steps[index];

buf.push('<li');
buf.push(attrs({ 'id':("" + (step.slug) + "-wizard-tab"), 'aria-selected':("" + (index === 0? 'true':'false') + ""), 'role':('tab'), 'aria-controls':('' + (step.slug) + '-wizard-tabpanel') }, {"id":true,"aria-selected":true,"role":true,"aria-controls":true}));
buf.push('>');
var __val__ = step.slug
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
    }

  } else {
    var $$l = 0;
    for (var index in steps) {
      $$l++;      var step = steps[index];

buf.push('<li');
buf.push(attrs({ 'id':("" + (step.slug) + "-wizard-tab"), 'aria-selected':("" + (index === 0? 'true':'false') + ""), 'role':('tab'), 'aria-controls':('' + (step.slug) + '-wizard-tabpanel') }, {"id":true,"aria-selected":true,"role":true,"aria-controls":true}));
buf.push('>');
var __val__ = step.slug
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
    }

  }
}).call(this);

buf.push('</ol></div></footer>');
}
return buf.join("");
};
});

require.register("lib/thumb_preloader", function(exports, require, module) {
var NUMBER_OF_PRELOAD, Photo, TIME_BEFORE_START, TIME_BETWEEN_LOADS,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Photo = require('../models/photo');

/**
 * preloads n thumbs so that the modal inits faster
*/


NUMBER_OF_PRELOAD = 100;

TIME_BEFORE_START = 500;

TIME_BETWEEN_LOADS = 80;

module.exports = (function() {
  function _Class() {
    this.imgLoaded = __bind(this.imgLoaded, this);
    this.lazyDownload = __bind(this.lazyDownload, this);
    this.getPhotoList = __bind(this.getPhotoList, this);
  }

  _Class.prototype.images = [];

  _Class.prototype.imagesId = {};

  _Class.prototype.tries = 0;

  _Class.prototype.start = function() {
    console.log('start of preload !');
    return setTimeout(this.getPhotoList, TIME_BEFORE_START);
  };

  _Class.prototype.getPhotoList = function() {
    var _this = this;
    return Photo.listFromFiles(0, NUMBER_OF_PRELOAD, function(error, res) {
      if (error) {
        console.log(error);
      }
      _this.filesList = res.files;
      _this.nextFileRkToLoad = 0;
      return window.setTimeout(_this.lazyDownload, 1000);
    });
  };

  _Class.prototype.lazyDownload = function() {
    var fileId, img;
    if (this.nextFileRkToLoad >= this.filesList.length) {
      return;
    }
    this.lastFile = this.filesList[this.nextFileRkToLoad];
    fileId = this.lastFile.id;
    this.imagesId[fileId] = true;
    img = new Image();
    img.onload = this.imgLoaded;
    img.src = "files/photo/thumbs/" + fileId + ".jpg";
    this.t0 = performance.now();
    this.images.push(img);
    return this.nextFileRkToLoad += 1;
  };

  _Class.prototype.imgLoaded = function() {
    var bandwidth, d, s;
    s = this.lastFile.size;
    d = performance.now() - this.t0;
    bandwidth = s / d;
    if (bandwidth > 100) {
      this.tries = 0;
      return window.setTimeout(this.lazyDownload, TIME_BETWEEN_LOADS);
    } else {
      if (this.tries < 10) {
        this.tries += 1;
        return window.setTimeout(this.lazyDownload, 1000);
      } else {
        window.setTimeout(this.lazyDownload, 300000);
        return this.tries = 0;
      }
    }
  };

  return _Class;

})();
});

;require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ViewCollection.prototype.views = {};

  ViewCollection.prototype.itemView = null;

  ViewCollection.prototype.itemViewOptions = function() {};

  ViewCollection.prototype.checkIfEmpty = function() {
    return this.$el.toggleClass('empty', _.size(this.views) === 0);
  };

  ViewCollection.prototype.appendView = function(view) {
    return this.$el.append(view.el);
  };

  ViewCollection.prototype.removeView = function(view) {
    return view.remove();
  };

  ViewCollection.prototype.initialize = function() {
    ViewCollection.__super__.initialize.apply(this, arguments);
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    this.listenTo(this.collection, "add", this.addItem);
    this.listenTo(this.collection, "remove", this.removeItem);
    return this.onReset(this.collection);
  };

  ViewCollection.prototype.render = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.appendView(view);
    }
    return this.checkIfEmpty(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.removeView(view);
    }
    this.views = [];
    this.checkIfEmpty(this.views);
    return newcollection.forEach(this.addItem);
  };

  ViewCollection.prototype.addItem = function(model) {
    var options, view;
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemView(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.checkIfEmpty(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.removeView(this.views[model.cid]);
    delete this.views[model.cid];
    return this.checkIfEmpty(this.views);
  };

  return ViewCollection;

})(BaseView);
});

;require.register("lib/wizard_view", function(exports, require, module) {
var BaseView, WizardView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('./base_view');

module.exports = WizardView = (function(_super) {
  __extends(WizardView, _super);

  function WizardView() {
    this.close = __bind(this.close, this);
    _ref = WizardView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  WizardView.prototype.tagName = 'dialog';

  WizardView.prototype.className = 'wizard';

  WizardView.prototype.template = require('./templates/wizard');

  WizardView.prototype.context = 'wizard';

  WizardView.prototype.bindStepsEvents = function() {
    var action, events, label, step, _i, _len, _ref1, _ref2;
    events = {
      'click .next': 'next',
      'click .close': 'close'
    };
    _ref1 = this.steps;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      step = _ref1[_i];
      if (step.choices == null) {
        continue;
      }
      _ref2 = step.choices;
      for (label in _ref2) {
        action = _ref2[label];
        events["click #" + step.slug + "-" + label] = action;
      }
    }
    return this.delegateEvents(events);
  };

  WizardView.prototype.initialize = function() {
    WizardView.__super__.initialize.apply(this, arguments);
    if (this.steps == null) {
      this.steps = [];
    }
    this.isDialogEnabled = !!this.el.showModal;
    return this.bindStepsEvents();
  };

  WizardView.prototype.dispose = function() {
    this.undelegateEvents();
    return this.remove();
  };

  WizardView.prototype.getRenderData = function() {
    return {
      context: this.context,
      steps: this.steps
    };
  };

  WizardView.prototype.show = function() {
    this.currentIndex = this.$el.find('.progress [aria-selected=true]').index();
    this.progress();
    if (this.isDialogEnabled) {
      return this.el.showModal();
    } else {
      this.el.setAttribute('open', true);
      document.addEventListener('keydown', this.close);
      return this.backdrop = $('<div/>', {
        'class': 'backdrop'
      }).insertAfter(this.$el);
    }
  };

  WizardView.prototype.close = function(event) {
    if ((event.keyCode != null) && event.keyCode !== 27) {
      return;
    }
    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    this.el.removeAttribute('open');
    document.removeEventListener('keydown', this.close);
    this.remove();
    return this.$backdrop.remove();
  };

  WizardView.prototype.next = function() {
    this.currentIndex++;
    return this.displayStep();
  };

  WizardView.prototype.displayStep = function() {
    var _ref1;
    if ((_ref1 = this.steps[this.currentIndex].beforeShow) != null) {
      _ref1.call(this);
    }
    this.$('[role=tabpanel]').not(":eq(" + this.currentIndex + ")").attr('aria-hidden', true).end().eq(this.currentIndex).attr('aria-hidden', false);
    this.$('[role=tab]').not(":eq(" + this.currentIndex + ")").attr('aria-selected', false).end().eq(this.currentIndex).attr('aria-selected', true);
    return this.progress();
  };

  WizardView.prototype.progress = function() {
    var adv;
    adv = 0 | this.currentIndex / (this.steps.length - 1) * 100;
    this.$('.progress').attr('class', "progress adv-" + adv);
    return this.$(".progress li:lt(" + this.currentIndex + ")").addClass('past');
  };

  return WizardView;

})(BaseView);
});

;require.register("locales/de", function(exports, require, module) {
module.exports = {
  "home": "Home",
  "apps": "Apps",
  "account": "Account",
  "email": "E-Mail",
  "timezone": "Zeitzone",
  "domain": "Domain",
  "no domain set": "no.domain.set",
  "locale": "Sprache",
  "change password": "Passwort ändern",
  "input your current password": "Tragen Sie Ihr aktuelles Passwort ein",
  "enter a new password": "Benutzen Sie das Feld um ein neues Passwort zu erstellen",
  "confirm new password": "Bestätigen Sie neues PassworT",
  "send changes": "Speichern",
  "manage": "Managen",
  "total": "Total",
  "memory consumption": "Arbeitsspeicher Verbrauch",
  "disk consumption": "Speicherplatz Verbrauch",
  "you have no notifications": "Sie haben keine Mitteilungen",
  "dismiss all": "Alle wegschicken",
  "add application": "App hinzufügen?",
  "install": "Installieren",
  "your app": "Deine app!",
  "community contribution": "Community Mitwirkung",
  "official application": "Offizielle App",
  "application description": "App Beschreibung",
  "downloading description": "Herunterladen Beschreibung…",
  "downloading permissions": "Herunterladen Rechte…",
  "Cancel": "Abbrechen",
  "ok": "Ok",
  "applications permissions": "App Rechte",
  "confirm": "Bestätigen",
  "installing": "Installieren",
  "remove": "Entfernen",
  "update": "Aktualisieren",
  "started": "Gestartet",
  "notifications": "Mitteilungen",
  "questions and help forum": "Fragen und Hilfe Forum",
  "sign out": "Abmelden",
  "open in a new tab": "In neuem Tab öffnen",
  "disk unit": "GB",
  "memory unit": "MB",
  "always on": "Immer eingeschaltet",
  "keep always on": "Immer eingeschaltet lassen",
  "stop this app": "Diese App stoppen",
  "update required": "Aktualisierung verfügbar",
  "application is installing": "Eine App wird bereits installiert.\nWarten Sie bis zu dessen Ende, und versuchen Sie erneut.",
  "no app message": "Zuzeit ist keine App auf Ihrem Cozy installiert.\nGehen Sie zu <a href=\"#applications\">app store</a> und installieren Sie neue Apps!",
  "welcome to app store": "Willkommen zu Ihrem Cozy App Store, installieren Sie Ihre eigene App\nvon hier und fügen Sie eine von der Liste hinzu.",
  "installed everything": "Sie haben bereits alles installiert!",
  "already similarly named app": "Sie haben bereits eine App mit gleichem Namen.",
  "your app list": "Zugriff Ihrer Apps",
  "customize your cozy": "Ihr Layout anpassen",
  "manage your apps": "Ihre Apps managen",
  "choose your apps": "Ihre Apps auswählen",
  "configure your cozy": "Ihr Cozy konfigurieren",
  "ask for assistance": "Nach Hilfe fragen",
  "logout": "Abmelden",
  "welcome to your cozy": "Willkommen zu Ihrem Cozy!",
  "you have no apps": "Sie haben kein Apps.",
  "app management": "App Management",
  "app store": "App Store",
  "configuration": "Konfiguration",
  "assistance": "Unterstützung",
  "hardware consumption": "Hardware",
  "hard drive gigabytes": "(Hard Drive)",
  "memory megabytes": "&nbsp;MB (RAM)",
  "manage your applications": "Ihre Apps managen",
  "manage your devices": "Ihre Geräte managen",
  "synchronized": "synchronisiert",
  "revoke device access": "Geräte Zugriff aufheben",
  "no application installed": "Es ist keine App installiert.",
  "your parameters": "Ihre Einstellungen",
  "alerts and password recovery email": "Ihre E-Mail Addresse wird benötigt Alarme und Passwort Recovery.",
  "public name description": "Ihr öffentlicher Name wird von Ihrem Cozy und seinen Apps genutzt um mit Ihnen zu kommunizieren.",
  "your timezone is required": "Ihre Zeitzone hilft dabei Datums korrekt anzuzeigen.",
  "domain name for urls and email": "Der Domain Name wird benutzt um URLs via E-Mail zu Ihnen und Ihren Kontakten zu senden.",
  "save": "Speichern",
  "saved": "Gespeichert",
  "Chose the language you want I use to speak with you:": "Wählen Sie die Sprache mit der sich mich nutzen möchten:",
  "french": "Französisch",
  "english": "Englisch",
  "german": "Deutsch",
  "portuguese": "Portuguisisch",
  "change password procedure": "Schritte um Ihr Passwort zu ändern",
  "current password": "Aktuelles Passwort",
  "new password": "Neues Passwort",
  "confirm your new password": "Bestägigen Sie in neues Passwort",
  "save your new password": "Speichern Sie Ihr neues Passwort",
  "do you want assistance": "Brauchen Sie etwas Hilfe?",
  "Write an email to our support team at:": "Shoot unserem Support Team eine E-Mail:",
  "Register and post on our forum: ": "Registieren Sie sich und schreiben in unserem Forum:",
  "Ask your question on Twitter: ": "Stellen Fragen auf Twitter:",
  "Chat with us on IRC:": "Chatten Sie mit uns auf IRC:",
  "Visit the project website and learn to build your app:": "Besuchen Sie die Projekt Webseite und lernen Sie Ihre eigene App zu erstellen:",
  "your own application": "Ihre eigene App",
  "installed": "Installiert",
  "updated": "aktualisiert",
  "updating": "aktualisierung läuft",
  "update all": "Alle aktualisieren",
  "update stack": "Aktualsieren",
  "refresh page": "Bitte warten, Aktualisierung benötigt einige Minuten.",
  "update stack modal title": "Aktualisieren Sie Ihren Cozy",
  "update stack modal content": "Sie sind dabei die Plattform zu aktualisieren. Ihr Cozy wird ein Paar Minuten nicht verfügbar sein. Ist das OK?",
  "update stack modal confirm": "Aktualisierung",
  "update stack success": "Ihre Applikation wurde aktualisiert, Seite wird neu aufgebaut.",
  "update stack error": "Ein Fehler ist während der Aktualisierung aufgetreten, Seite wird neu aufgebaut.",
  "applications broken": "Applikation abgestürtzt",
  "cozy platform": "Plattform",
  "reboot stack": "Neustart",
  "update error": "Ein Fehler ist während der App Aktualisierung aufgetreten",
  "error update uninstalled app": "Sie können keine App aktualisieren, die nicht installiert ist.",
  "broken": "Absturz",
  "start this app": "Diese App starten",
  "stopped": "Gestoppet",
  "retry to install": "Installation wiederholen",
  "cozy account title": "Cozy - Account",
  "cozy app store title": "Cozy - App Store",
  "cozy home title": "Cozy - Home",
  "cozy applications title": "Cozy - App Konfiguration",
  "running": "Läuft",
  "cozy help title": "Cozy - Hilfe",
  "changing locale requires reload": "Ändern Sie das Gebietsschema um die Seite neu zu laden.",
  "cancel": "Abbrechen",
  "abort": "Abbruch",
  "Once updated, this application will require the following permissions:": "Einmal aktualisiert, benötigt diese App folgende Rechte:",
  "confirm update": "Aktualisierung bestätigen",
  "confirm install": "Installation bestätigen",
  "no specific permissions needed": "Diese App benötigt keine Rechte",
  "removed": "Entfernt",
  "removing": "Entfernen",
  "required permissions": "Benötigte Rechte",
  "finish layout edition": "Speichern",
  "reset customization": "Rücksetzen",
  "use icon": "Icon verwenden",
  "change layout": "Layout verändern",
  "introduction market": "Willkommen zum Cozy App Store. Hier können Sie Ihr Cozy durch\ninstallieren neuer Apps anpassen.\nVon hier können Sie eine selbst erstellte App oder schon existierenden Apps;\nbereitgestellt durch die Cozy Cloud und deren freundlicher Entwickler Gemeinschaft, installieren.",
  "error connectivity issue": "Ein Fehler ist aufgetreten beim abrufen der Daten.<br />Bitte versuchen Sie später erneut.",
  "package.json not found": "Abruf von package.json ist nicht möglich. Prüfen Sie Ihre Repoitory URL.",
  "please wait data retrieval": "Bitte warten während die Daten abgerufen werden…",
  "revoke device confirmation message": "Dies verhindert den Zugriff des Gerätes auf Ihr Cosy. Sind Sie sicher?",
  "dashboard": "Dashboard",
  "calendars description": "Verwalten Sie Ihre Ereignisse und synchronisieren Sie diese mit Ihrem Smartphone.",
  "contacts description": "Verwalten Sie Ihre Kontakte und synchronisieren Sie diese mit Ihrem Smartphone.",
  "emails description": "Lesen, senden und sichern Sie Ihre E-Mails.",
  "files description": "Ihr Online Datei-System, synchronisiert mit Ihren Geräten.",
  "photos description": "Organisieren Sie Ihre Fotos und teilen Sie diese mit Freunden.",
  "sync description": "Das Tool ist die Vorausetzung zur Synchronisation Ihrer Kontakte und Kalender mit Ihrem Smartphone.",
  "bookmark description": "Speichern und verwalten Ihrer Lesezeichen.",
  "cozic description": "Ein Audio-Player zum hören Ihrer Musik in Ihrem Browser.",
  "databrowser description": "Durchblättern und visualisieren all Ihrer Daten (RAW Format).",
  "feeds description": "Sammeln Sie Ihre Feeds und speichern Sie favorisierten Links als Lesezeichen.",
  "kyou description": "Verbessern Sie Ihre Gesundheit und Zufriedenheit durch Bewertung Ihrer selbst.",
  "konnectors description": "Daten Import von externen Services (Twitter, Jawbone…).",
  "kresus description": "Zusätzliche Tools für Ihre private Finanz Verwaltung.",
  "nirc description": "Zugruff auf Ihre fovorisierten IRC Kanäle von Ihrem Cozy.",
  "notes description": "Organisieren und schreiben von smarten Notizen.",
  "owm description": "Wissen wie das Wetter wird, überall auf der Welt.",
  "remote storage description": "Ein entferntes Speicher Gerät, zur Speicherung Ihre nicht gehosteten Applikationen.",
  "tasky description": "Super schneller und einfacher Tag-basierter Aufgaben Verwalter.",
  "todos description": "Erstellen Sie Ihre Aufgaben, ordnen Sie diese und führen Sie diese effizient aus.",
  "term description": "Eine Terminal App für Ihr Cozy.",
  "reminder title email": "Erinnerung",
  "reminder title email expanded": "Erinnerung: %{description} - %{date} (%{calendar})",
  "reminder message expanded": "Reminder: %{description}\nStart: %{start} (%{timezone})\nEnd: %{end} (%{timezone})\nPlace: %{place}\nDetails: %{details}",
  "reminder message": "Erinnerung: %{message}",
  "warning unofficial app": "Diese App is eine aus der Gemeinschaft und wird nicht durch das Cozy Team betreut.\nUm einen Bug zu berichten; bitte das Problem beschreiben in <a href='https://forum.cozy.io'>our forum</a>.",
  "installation message failure": "%{appName}'s Installation fehlgeschlagen.",
  "update available notification": "Eine neue Version von %{appName} ist verfügbar.",
  "stack update available notification": "Eine neue Version der Plattform ist verfügbar.",
  'noapps': {
    'first steps': "Sie können <a href=\"%{wizard}\">unseren Wizard benutzen</a> um Hilfe bei der Installation und der Konfiguration Ihrer Apps zu erhalten,\noder Sie können eine <a href=\"%{quicktour}\">Quick Tour</a> unternehmen und die Cozy Eigenschaften entdecken.",
    'customize your cozy': "Sie können außerdem <a href=\"%{account}\">zu den Einstellungen gehen</a> um Ihr Cozy anzupassen,\noder <a href=\"%{appstore}\">den App Store besuchen</a> um Ihre Erste App zu installieren."
  },
  'relaunch install wizard': "Installation Wizard neu starten",
  'installwizard': {
    'welcome title': "Willkommen zu Ihrem neuen Cozy",
    'welcome content': "<p>Dieser Wizard wird Ihnen dabei helfen auf Ihrem Cozy, Apps auszuwählen, installieren und einzurichten.</p>\n<p>>Bitte beachten Sie, das Cozy im Moment im Beta Status befindet. Zögern Sie nicht <a href=\"#help\">um mit uns in Kontakt zu treten</a> wenn Probleme auftreten.</p>",
    'yes': "Aktivieren der %{slug} App",
    'no': "Nein, Danke",
    'continue to files': "Meine Apps konfigurieren",
    'files title': "Files App konfigurieren",
    'files content': "<p>Möchte Sie eine App zum Speichern Ihrer persönlichen Dateien und Ordner, sicher erreichbar von überall?</p>",
    'emails title': "Emails App konfigurieren",
    'emails content': "<p>Möchten Sie einen E-Mail Client der mit all Ihren E-Mail Providern verbunden ist, so haben Sie Zugriff auf einen einheitlichen Briefkasten erreichbar von überall?</p>",
    'contacts title': "Contacts App konfigurieren",
    'contacts content': "<p>Möchten Sie eine Kontakt App um Ihr Adressbuch zu verwalten und direkten Zugriff zu Ihren Freunden zu haben?</p>\n<p><small>Aktivieren dieser App ermöglicht auch die Verwendung der Sync App um Daten mit Ihrem Smartphone und den Computer Programmen zu synchronisieren.</small></p>",
    'calendar title': "Calendar App konfigurieren",
    'calendar content': "<p>Möchten Sie eine Kalendar App um Ihnen zu helfen Ihr Leben zu organisieren?</p>\n<p><small>Aktivieren dieser App ermöglicht auch die Verwendung der Sync App um Daten mit Ihrem Smartphone und den Computer Programmen zu synchronisieren.</small></p>",
    'photos title': "Photos App konfigurieren",
    'photos content': "<p>Möchten Sie eine App um Ihre Fotos und Albums zu speichern, und Ihnen zu helfen diese mit Freunden und Familie zu teilen?</p>\n<p><small>Pro-Tip: Wenn Sie ein Android Gerät verwenden, können Sie unsere App nutzen, um automatisch Fotos zu Ihrem Cozy hochzuladen.</small></p>",
    'thanks title': "Fertig!",
    'thanks content': "<p>Es ist so einfach! Sie haben Ihr Cozy mit den folgenden Apps personalisiert:</p>",
    'go-to-my-cozy': "Ich bin bereit mein Cozy zu benutzen",
    'show-me-a-quick-tour': "Bitte erzählen Sie mir mehr über mein Cozy"
  },
  'quicktourwizard': {
    'welcome title': "Treffen Sie Ihr Cozy!",
    'welcome content': "<p>Wilkommen zu Ihrem brand neuen Cozy.</p>\n<p>Diese kurze geführet Tour wird Ihnen die besten Eigenschaften Ihres Cozy vorstellen.</p>\n<p>>Bitte beachten Sie, das Cozy im Moment im Beta Status befindet. Zögern Sie nicht <a href=\"#help\">um mit uns in Kontakt zu treten</a> wenn Probleme auftreten.</p>",
    'continue to dashboard': "Dashboard entdecken",
    'dashboard title': "Dashboard entdecken",
    'dashboard content': "<p>Hier ist eine kleine Führung über alles was in Ihrem Cozy Home verfügbar ist. Alle Eigenschaften können vom Menü in der oberen rechten Ecke erreicht werden.</p>\n<p><img src=\"/img/home-black.png\"><strong>Home: </strong>Dies ist der Platz von dem Sie alle Ihre Apps erreichen</p>",
    'continue to apps': "Wie können Ihre Apps verwalten werden?",
    'apps title': "Apps verwalten",
    'apps content': "<p><img src=\"/img/config-apps.png\"><strong>App Verwaltung: </strong>Hier können Sie den Status Ihrer Apps verwalten: starten, stoppen, entfernen…</p>\n<p><img src=\"/img/apps.png\"><strong>App Store: </strong>Im App Store finden Sie neue Apps zur Installation auf Ihrem Cozy.</p>",
    'continue to help': "Wie Hilfe bekommen?",
    'help title': "Hilfe bekommen",
    'help content': "<p><img src=\"/img/configuration.png\"><strong>Konfiguration: </strong>Um sicher zu stellen, dass Ihr Cozy das macht, was Sie möchten, sehen Sie sich die Einstellungen an.</p>\n<p><img src=\"/img/help.png\"><strong>Hilfe: </strong>Verloren in Ihrem Cozy? Hier sind einiges Links um Ihnen weiter zu helfen.</p>",
    'continue to sync': "Sync mit Ihrem Smartphone",
    'sync title': "Get in sync",
    'sync content': "<p>Um mehr über Daten Synchronisation zu lernen, bitte schauen Sie sich die folgenden Ressourcen an:</p>\n<ul>\n    <li><a href=\"http://cozy.io/mobile/files.html\">Sync Files</a></li>\n    <li><a href=\"http://cozy.io/mobile/calendar.html\">Sync Calendar</a></li>\n    <li><a href=\"http://cozy.io/mobile/contacts.html\">Sync Contacts</a></li>\n</ul>",
    'close wizard': "Nun bin ich bereit mein Cozy zu verwenden"
  }
};
});

;require.register("locales/en", function(exports, require, module) {
module.exports = {
  "home": "Home",
  "apps": "Apps",
  "account": "Account",
  "email": "Email",
  "timezone": "Time zone",
  "domain": "Domain",
  "no domain set": "no.domain.set",
  "locale": "Locale",
  "change password": "Change password",
  "input your current password": "Enter your current password:",
  "enter a new password": "Enter your new password:",
  "confirm new password": "Confirm your new password:",
  "send changes": "Save",
  "manage": "Manage",
  "total": "Total",
  "memory consumption": "Memory usage",
  "disk consumption": "Disk usage",
  "you have no notifications": "You have no notifications",
  "dismiss all": "Dismiss all",
  "add application": "Add app?",
  "install": "Install",
  "your app": "Your app!",
  "community contribution": "Community contribution",
  "official application": "Official App",
  "application description": "App Description",
  "downloading description": "Downloading description…",
  "downloading permissions": "Downloading permissions…",
  "Cancel": "Cancel",
  "ok": "Ok",
  "applications permissions": "App permissions",
  "confirm": "Confirm",
  "installing": "Installing",
  "remove": "Remove",
  "update": "Update",
  "started": "started",
  "notifications": "Notifications",
  "questions and help forum": "Questions and help forum",
  "sign out": "Sign out",
  "open in a new tab": "Open in a new tab",
  "disk unit": "GB",
  "memory unit": "MB",
  "always on": "always on",
  "keep always on": "keep always on",
  "stop this app": "Stop this app",
  "update required": "Update available",
  "navbar faq": "Frequently Asked Questions",
  "application is installing": "An app is already installing.\nWait for it to finish, then try again.",
  "no app message": "You currently have no app installed on your Cozy.\nGo to the <a href=\"#applications\">app store</a> and install new apps!",
  "welcome to app store": "Welcome to your cozy app store, install your own app from here\nor add one from the available list.",
  "installed everything": "You have already installed everything!",
  "already similarly named app": "You already have an app with a similar name.",
  "your app list": "Access your apps",
  "customize your cozy": "Customize your layout",
  "manage your apps": "Applications",
  "choose your apps": "Choose your apps",
  "configure your cozy": "Configure your cozy",
  "ask for assistance": "Ask for help",
  "logout": "Sign out",
  "navbar logout": "Sign out",
  "welcome to your cozy": "Welcome to your Cozy!",
  "you have no apps": "You have no apps.",
  "app management": "App management",
  "app store": "App store",
  "configuration": "Configuration",
  "assistance": "Assistance",
  "hardware consumption": "Hardware",
  "hard drive gigabytes": "(Hard Drive)",
  "memory megabytes": "&nbsp;MB (RAM)",
  "manage your applications": "Applications",
  "manage your devices": "Manage your devices",
  "synchronized": "synchronized",
  "revoke device access": "Revoke device",
  "no application installed": "There is no app installed.",
  "your parameters": "Your settings",
  "alerts and password recovery email": "I need your email address for notifications or password recovery:",
  "public name description": "Your public name will be used by your Cozy and its apps to mention you properly:",
  "your timezone is required": "Your time zone helps display dates properly:",
  "domain name for urls and email": "The domain name is used to build sharing URLs sent via email to yourself or your contacts:",
  "save": "save",
  "saved": "saved",
  "Chose the language you want I use to speak with you:": "Choose the language you want to see:",
  "account background selection": "Select your background for your Cozy Home:",
  "account localization": "Localization",
  "account identifiers": "Identifiers",
  "account personalization": "Personalization",
  "account password": "Change Password",
  "french": "French",
  "english": "English",
  "german": "German",
  "spanish": "Spanish",
  "portuguese": "Portuguese",
  "change password procedure": "Steps to change your password",
  "current password": "current password",
  "new password": "new password",
  "confirm your new password": "confirm your new password",
  "save your new password": "save your new password",
  "do you want assistance": "Do you need some help?",
  "Write an email to our support team at:": "Send our support team an email:",
  "Register and post on our forum: ": "Register and post to our forum:",
  "Ask your question on Twitter: ": "Ask questions on Twitter:",
  "Chat with us on IRC:": "Chat with us on IRC:",
  "Visit the project website and learn to build your app:": "Visit the project website:",
  "your own application": "your own app",
  "installed": "installed",
  "updated": "updated",
  "updating": "updating",
  "update all": "Update all",
  "show home logs": "Show Home Logs",
  "show data system logs": "Show Data System Logs",
  "show proxy logs": "Show Proxy Logs",
  "show logs": "Show Logs",
  "update stack": "Update",
  "refresh page": "Wait please, update takes several minutes.",
  "status no device": "No device registered for synchronization.",
  "update stack modal title": "Updating your Cozy",
  "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Is that OK?",
  "update stack modal confirm": "Update",
  "update stack success": "Your applications are updated, page will refresh.",
  "update stack error": "An error occured during update, page will refresh.",
  "applications broken": "Applications broken",
  "cozy platform": "Platform",
  "navbar back button title": "Back Home",
  "navbar notifications": "Notifications",
  "or:": "or:",
  "reboot stack": "Reboot",
  "update error": "An error occured while updating the app",
  "error update uninstRlled app": "You can't update an app that is not installed.",
  "notification open application": "Open application",
  "notification update stack": "Update the platform",
  "notification update application": "Update application",
  "broken": "broken",
  "start this app": "Start this app",
  "stopped": "stopped",
  "retry to install": "Retry installation",
  "cozy account title": "Cozy - Settings",
  "cozy app store title": "Cozy - Store",
  "cozy home title": "Cozy - Home",
  "cozy applications title": "Cozy - Status",
  "running": "running",
  "cozy help title": "Cozy - Help",
  "help support title": "Official Support",
  "help community title": "Community Support",
  "help documentation title": "Documentation",
  "changing locale requires reload": "Changing the locale requires to reload the page.",
  "cancel": "cancel",
  "abort": "abort",
  "Once updated, this application will require the following permissions:": "Once updated, this app will require the following permissions:",
  "confirm update": "confirm update",
  "confirm install": "confirm install",
  "no specific permissions needed": "This app doesn't require any permission",
  "removed": "removed",
  "removing": "removing",
  "required permissions": "Required permissions",
  "finish layout edition": "Save",
  "reset customization": "Reset",
  "use icon": "Use icon",
  "home section leave": "Import",
  "home section main": "Basics",
  "home section productivity": "Productivity",
  "home section data management": "Data",
  "home section personal watch": "Watch",
  "home section misc": "Misc",
  "home section platform": "Platform",
  "app status": "Status",
  "app store": "Store",
  "settings": "Settings",
  "help": "Help",
  "change layout": "Change the layout",
  "market app install": "Installing...",
  "help send message title": "Write directly to the Cozy Team",
  "help send message explanation": "To send a message to the Cozy Team, you can use the text field below. You can send us your feedback, report bugs and of course, ask for assistance!",
  "help send message action": "Send message to the Cozy Support Team",
  "send message success": "Message successfully sent!",
  "send message error": "An error occured while sending your support message. Try to send it via an email client to support@cozycloud.cc",
  "introduction market": "Welcome to the Cozy app store!\nHere, you can install\napps provided by Cozy Cloud, apps from the community or apps built by yourself!",
  "error connectivity issue": "An error occurred while retrieving the data.<br />Please try again later.",
  "package.json not found": "Unable to fetch package.json. Check your repo url.",
  "please wait data retrieval": "Please wait while the data is being retrieved…",
  "revoke device confirmation message": "This will prevent the device from accessing your Cozy. Are you sure?",
  "dashboard": "Dashboard",
  "calendars description": "Manage your events and sync them with your smartphone.",
  "contacts description": "Manage your contacts and sync them with your smartphone.",
  "emails description": "Read, send and back up your emails.",
  "files description": "Your online file-system, synced with your devices.",
  "photos description": "Organize your photos and share them with friends.",
  "sync description": "The tool required to sync your contacts and calendar with your smartphone.",
  "bookmark description": "Save and manage your bookmarks.",
  "cozic description": "An audio player to listen to your music from your browser.",
  "databrowser description": "Browse and visualize all your data (raw format).",
  "feeds description": "Aggregate your feeds and save your favorite links as bookmarks.",
  "kyou description": "Improve your health and happiness by quantifying yourself.",
  "konnectors description": "Import data from external services (Twitter, Jawbone…).",
  "kresus description": "Additional tools for your personal finance manager.",
  "nirc description": "Access to your favorite IRC channels from your Cozy.",
  "notes description": "Organize and write smart notes.",
  "owm description": "Know the weather anywhere in the world.",
  "remote storage description": "A Remote Storage appliance to store data from your Unhosted applications.",
  "tasky description": "Super fast and simple tag-based task manager.",
  "todos description": "Write your tasks, order them and complete them efficiently.",
  "term description": "A terminal app for your Cozy.",
  "ghost description": "Share your stories with the world with this app based on the Ghost Blogging Platform.",
  "leave google description": "An app to import your current data from your Google account.",
  "reminder title email": "Reminder",
  "reminder title email expanded": "Reminder: %{description} - %{date} (%{calendar})",
  "reminder message expanded": "Reminder: %{description}\nStart: %{start} (%{timezone})\nEnd: %{end} (%{timezone})\nPlace: %{place}\nDetails: %{details}",
  "reminder message": "Reminder: %{message}",
  "warning unofficial app": "This app is a community app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
  "installation message failure": "%{appName}'s installation failed.",
  "update available notification": "A new version of %{appName} is available.",
  "stack update available notification": "A new version of the platform is available.",
  "app broken title": 'Broken application',
  "app broken": 'This application is broken. Can you try install again: ',
  "reinstall broken app": "reinstall it.",
  "error git": "We can't retrieve source code.",
  "error github repo": 'Application repository seems unavailable.',
  "error github": 'Github seems unavailable. You can check its status on https://status.github.com/.',
  'error npm': "We can't installed application dependencies.",
  'error user linux': "We can't create specific linux user for this application.",
  'error start': "Application can't start. You can find more details in log application.",
  "app msg": 'If error persists, you can contact us at contact@cozycloud.cc' + 'or on IRC #cozycloud on irc.freenode.net.',
  'more details': "More details",
  'noapps': {
    'first steps': "You can <a href=\"%{wizard}\">use our wizard</a> to help with installing and configuring your apps,\nor you can take a <a href=\"%{quicktour}\">quick tour</a> and discover your Cozy features.",
    'customize your cozy': "You can also <a href=\"%{account}\">go to your settings</a> and customize your Cozy,\nor <a href=\"%{appstore}\">take a look at the App Store</a> to install your first app."
  },
  'relaunch install wizard': "Restart install wizard",
  'installwizard': {
    'welcome title': "Welcome to your new Cozy",
    'welcome content': "<p>This wizard will help you choose, install and configure apps for your Cozy.</p>\n<p>Please remember that Cozy is currently in beta. Don't hesitate to <a href=\"#help\">get in touch</a> if you run into trouble.</p>",
    'yes': "Activate the %{slug}^B app",
    'no': "No, thanks",
    'continue to files': "Configure my apps",
    'files title': "Configure Files app",
    'files content': "<p>Do you want an app to store your personal files and folders, making them accessible securely from anywhere?</p>",
    'emails title': "Configure Emails app",
    'emails content': "<p>Do you want an email client linked to all your email providers, so you can access a private, unified mailbox from anywhere?</p>",
    'contacts title': "Configure Contacts app",
    'contacts content': "<p>Do you want a contacts app to manage your address book and give you instant access to your friends?</p>\n<p><small>Enabling this app will also enable the Sync app to synchronize data with your smartphone and desktop apps.</small></p>",
    'calendar title': "Configure Calendar app",
    'calendar content': "<p>Do you want a calendar app to help you organize your life?</p>\n<p><small>Enabling this app will also enable the Sync app to synchronize data with your smartphone and desktop apps.</small></p>",
    'photos title': "Configure Photos app",
    'photos content': "<p>Do you want an app to store your photos and albums, and help you share them with your friends and family?</p>\n<p><small>Pro-tip: If you use an Android device, we have an app you can use to automatically upload photos to your Cozy.</small></p>",
    'thanks title': "Done!",
    'thanks content': "<p>It's that easy! You've just personalized your Cozy with the following apps:</p>",
    'go-to-my-cozy': "I'm ready to use my Cozy",
    'show-me-a-quick-tour': "Please tell me more about my Cozy"
  },
  'quicktourwizard': {
    'welcome title': "Welcome to your Cozy!",
    'welcome content': "<p>\nCozy is an operating system for your personal cloud. It allows\nto manage simply your distant own machine. You will be able to\ninstall applications that manage your data. Through a web browser\nyou will be able to access your data without compromising your\nprivacy.</p>\n<p>Here are the many benefits of a personal cloud with Cozy:</p>\n<ul>\n  <li>Your data stays confidential and is stored on a hardware of your own.</li>\n  <li>You will not have targeted ads anymore.</li>\n  <li>You don't need to connect on 10 different accounts to use your own tools.</li>\n  <li>No need to push the same data for each tool: the data is shared within the applications.</li>\n</ul>\n<p></p>",
    'continue to apps': "What applications are available ?",
    'apps title': "Available Applications",
    'apps content': "<p>By default Cozy proposes five applications :</p>\n<ul>\n  <li>Calendar: To manage your events</li>\n  <li>Contacts: To handle your address and phone books.</li>\n  <li>Files: To store files and share the big ones.</li>\n  <li>Emails: To centralize your mailbox online.</li>\n  <li>Photos: To create and share photo albums.</li>\n</ul>\n<p>Aside of these main applications you can discover applications\nbuilt by the community. You will find apps like a bank account\nmanager, a feed reader, a todo-list manager and many more!\nGo to the app store to discover the full list of application.\n</p>",
    'continue to sync': "How to sync my mobile?",
    'sync title': "Mobile Synchronization",
    'sync content': "<p><strong>Contacts and Calendars</strong></p>\n<p>\nYou can synchronize both contacts and calendars through the CalDAV and CardDAV protocols. Behind these exotic names, you will find two standards that allow to sync your Cozy with many contact and calendars managers. That means you can sync your Cozy with the native applications of your smartphone. Here are two tutorials that will help you achieving that:\n<ul>\n<li><a href=\"http://cozy.io/en/mobile/contacts.html\">Contacts synchronization</a></li>\n<li><a href=\"http://cozy.io/en/mobile/calendar.html\">Calendar synchronization</a></li>\n</ul>\n</p>\n<p><strong>Files and Pictures (Android)</strong></p>\n<p>\n  With Cozy you can both backup your photos and see your online file\n  on your mobile. You can cache the files you want always with you\n  and see them while your mobile is offline.\n</p>\n<p>To install the Cozy application. You can read our <a href=\"http://cozy.io/en/mobile/files.html\">tutorial</a> or go directly to the <a href=\"https://play.google.com/store/apps/details?id=io.cozy.files_client\">PlayStore</a>\n</p>",
    'continue to import': "How to import my data?",
    'import title': "Contacts and Calendars import",
    'import content': "<p>Most of the tools allow you to export your calendars to the .ical format and your contacts to the .vcard or .vcf format. Once you have the right files, you can import them into your Cozy via the import tools available in the Contacts and Calendars application.\n</p>\n<p>\nYour traditional files can be uploaded directly through the Files application UI.\n</p>\n<p>\nWe are working on an application that will allow you to fetch your data from Google easily. We expect to provide you with it soon.\n</p>\n<p>\nThis introduction to Cozy is finished. You already know everything you need to start with Cozy. We let you discover the platform and the available applications!\n</p>",
    'close wizard': "Start using my Cozy!"
  },
  "pick from files": "Choose one photo",
  "Crop the photo": "Crop the image (",
  "chooseAgain": "choose another photo",
  "modal ok": "OK",
  "modal cancel": "Cancel",
  "no image": "There is no image on your Cozy",
  "ObjPicker upload btn": "Upload a local file",
  "or": "or",
  "drop a file": "Drag & drop a file",
  "url of an image": "URL of an image on the web",
  "you have no album": "<p>Vous n'avez pas encore d'album photo  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p>\n<p>Créez en à partir de\n    <a href=\"/#applications\" target='_blank'>l'application Photo</a>\n    <br>\n    et utilisez les photo de votre téléphone via\n    <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>l'app mobile !</a></p>\n    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)"
};
});

;require.register("locales/es", function(exports, require, module) {
module.exports = {
  "home": "Inicio",
  "apps": "Aplicaciones",
  "account": "Cuenta",
  "email": "Correo electrónico",
  "timezone": "Huso horario",
  "domain": "Dominio",
  "no domain set": "no.hay.dominio.definido",
  "locale": "Idioma",
  "change password": "Cambiar la contraseña",
  "input your current password": "Esribir su contraseña actual",
  "enter a new password": "usar este campo para crear una nueva contraseña",
  "confirm new password": "confirmar la nueva contraseña",
  "send changes": "Guardar",
  "manage": "Administración",
  "total": "Total",
  "memory consumption": "Utilización memoria",
  "disk consumption": "Utilización disco",
  "you have no notifications": "No hay notificaciones",
  "dismiss all": "Ignorarlas todas",
  "add application": "¿Añadir una aplicación?",
  "install": "Instalar",
  "your app": "¡Su aplicación!",
  "community contribution": "Desarrollador independiente",
  "official application": "Aplicación oficial",
  "application description": "Descrpción de la aplicación",
  "downloading description": "Descargar la descrpción",
  "downloading permissions": "Descargar los permisos...",
  "Cancel": "Anular",
  "ok": "Ok",
  "applications permissions": "Permisos para la aplicación",
  "confirm": "Confirmar",
  "installing": "Se está instalando",
  "remove": "Suprimir",
  "update": "actualizar",
  "started": "Se esta ejecutando",
  "notifications": "Notificaciones",
  "questions and help forum": "Foro de ayuda",
  "sign out": "Salir",
  "open in a new tab": "Abrir en una nueva pestaña",
  "disk unit": "Go",
  "memory unit": "Mo",
  "always on": "Siempre se está ejecutando",
  "keep always on": "mantener siempre ejecutándose",
  "stop this app": "pare esta aplicación",
  "update required": "Actualización disponible",
  "application is installing": "Se está instalando una aplicación.\nEspere que esté instalada antes de lanzar una nueva.",
  "no app message": "¡ Usted no ha instalado ninguna aplicación en su Cozy.\nVaya a <a href=\"#applications\">app store</a> para instalar al menos una !",
  "welcome to app store": "Bienvenido(a) a App store, usted puede instalar su propia aplicación desde aquí\no añadir una que esté en la lista.",
  "installed everything": "¡Usted ya ha instalado todo!",
  "already similarly named app": "Una aplicación con nombre similar ya ha sido instalada.",
  "your app list": "Acceder a sus aplicaciones",
  "customize your cozy": "Personalizar la presentación",
  "manage your apps": "Administrar sus aplicaciones",
  "choose your apps": "Escoger sus aplicaciones",
  "configure your cozy": "Configurar su Cozy",
  "ask for assistance": "Pedir ayuda",
  "logout": "Desconexión",
  "welcome to your cozy": "Bienvenido(a) a su Cozy",
  "you have no apps": "Usted no ha instalado niguna aplicación.",
  "app management": "Gestión de las aplicaciones",
  "app store": "Apliteca",
  "configuration": "Configuración",
  "assistance": "Ayuda",
  "hardware consumption": "Material",
  "hard drive gigabytes": "(Disco duro)",
  "memory megabytes": "&nbsp;Mo (RAM)",
  "manage your applications": "Administrar sus aplicaciones",
  "manage your devices": "Administrar sus periféricos",
  "synchronized": "sincronizado",
  "revoke device access": "Revocar el acceso al periférico",
  "no application installed": "No hay aplicaciones instaladas.",
  "your parameters": "Ajustes",
  "alerts and password recovery email": "Necesito su correo electrónico  para que usted pueda recuperar la contraseña o para enviarle alertas.",
  "public name description": "Cozy y sus aplicaciones utilizarán su nombre público para comunicarse con usted.",
  "your timezone is required": "El huso horario se requiere para visualizar correctamente las fechas y horas.",
  "domain name for urls and email": "El nombre del dominio se usa para construir las Url enviadas por mail a sus contactos.",
  "save": "guardar",
  "saved": "guardado",
  "Chose the language you want I use to speak with you:": "Escoja el idioma que usted desea que yo utlice para comunicarme con usted:",
  "french": "Francés",
  "english": "Inglés",
  "german": "Alemán",
  "portuguese": "Portugués",
  "change password procedure": "Pasos a seguir para cambiar la contraseña",
  "current password": "contraseña actual",
  "new password": "nueva contraseña",
  "confirm your new password": "confirme su nueva contraseña",
  "save your new password": "guarde su nueva contraseña",
  "do you want assistance": "¿Quiere ayuda?",
  "Write an email to our support team at:": "Escriba un correo elctrónico a nuestro equipo de apoyo :",
  "Register and post on our forum: ": "Inscribase y envíe un mensaje a nuestro foro:",
  "Ask your question on Twitter: ": "Haga preguntas en Twitter:",
  "Chat with us on IRC:": "Chatee con nosotros via IRC:",
  "Visit the project website and learn to build your app:": "Visite el sitio web del Proyecto y aprenda a crear aplicaciones:",
  "your own application": "su propia aplicación",
  "installed": "instalada",
  "updated": "actualizada",
  "updating": "actualización en curso",
  "update all": "Actualizar todo",
  "update stack": "Actualizar",
  "refresh page": "Por favor, tenga paciencia, la actualización puede tomar algunos minutos.",
  "update stack modal title": "Actualización de su Cozy",
  "update stack modal content": "Usted está a punto de actualizar la plataforma. Su Cozy estará indisponible algunos instantes. ¿Está usted seguro(a)?",
  "update stack modal confirm": "Actualizar",
  "update stack success": "Sus aplicaciones están actualizadas, la página se va a recargar.",
  "update stack error": "Se produjo un error durante la actualización, la página se va a recargar",
  "applications broken": "Aplicaciones averiadas",
  "cozy platform": "Plataforma",
  "reboot stack": "Reiniciar",
  "update error": "Se produjo un error durante la actualización",
  "error update uninstalled app": "Usted no puede actualizar una aplicación que no esté instalada.",
  "broken": "averiada",
  "start this app": "iniciar esta aplicación",
  "stopped": "interrumpida",
  "retry to install": "trate de instalarla de nuevo",
  "cozy account title": "Cozy - Cuenta",
  "cozy app store title": "Cozy - Apliteca",
  "cozy home title": "Cozy - Inicio",
  "cozy applications title": "Cozy - Configuración de Aplicaciones",
  "running": "ejecutándose",
  "cozy help title": "Cozy - Ayuda",
  "changing locale requires reload": "El cambio de idioma requiere que se recargue la página.",
  "cancel": "anular",
  "abort": "interrumpir",
  "Once updated, this application will require the following permissions:": "Una vez actualizada la aplicación requerirá los siguientes permisos:",
  "confirm update": "confirmar la actualización",
  "confirm install": "confirmar la instalación",
  "no specific permissions needed": "Esta aplicacion no requiere permiso alguno",
  "removed": "suprimida",
  "removing": "en curso de supresión",
  "required permissions": "Permisos requeridos",
  "finish layout edition": "Guardar",
  "reset customization": "Reiniciar",
  "use icon": "Modo ícono",
  "change layout": "Modificar la disposición",
  "introduction market": "Bienvenido(a) a la tienda de aplicaciones Cozy.\nDesde aquí usted puede instalar una aplicación de su propia creación o escoger entre\nlas que propone Cozycloud u otros desarrolladores.",
  "error connectivity issue": "Un error se produjo durante la recuperación de los datos. <br/>Por favor, vuelva a ensayar más tarde.",
  "package.json not found": "Imposible recuperar el archivo package.json. Verifique la url de su depósito git.",
  "please wait data retrieval": "Por favor, espere que los datos se carguen...",
  "revoke device confirmation message": "Esta acción impedirá que el periférico asociado acceda a su Cozy. ¿Está usted seguro(a)?",
  "dashboard": "Tablero de Control",
  "calendars description": "Administre su agenda y sincronícela con su teléfono.",
  "contacts description": "Administre sus contactos y sincronícelos con su teléfono.",
  "emails description": "Lea, envíe y guarde sus mensajes.",
  "files description": "Su sistema de archivos en línea sincronizados con sus periféricos.",
  "photos description": "Organice sus fotos y compártalas con sus amigos.",
  "sync description": "La herramienta necesaria para sincronizar sus contactos y su agenda con su teléfono.",
  "bookmark description": "Guarde y administre sus enlaces favoritos.",
  "cozic description": "Un lector audio para escuchar su música en el navegador.",
  "databrowser description": "Visualice y navegue entre todos sus datos (formato en bruto).",
  "feeds description": "Añada sus canales RSS y guarde sus enlaces favoritos",
  "kyou description": "Mejore su salud y su humor cuantificándose usted mismo.",
  "konnectors description": "Importe datos desde servicios externos (Twitter, Jawbone...).",
  "kresus description": "Herramientas adicionales para la gestión de sus finanzas personales.",
  "nirc description": "Acceda a su canal IRC preferido desde su Cozy.",
  "notes description": "Escriba y organice notas inteligentes.",
  "owm description": "Informese del estado del tiempo en cualquier parte del mundo.",
  "remote storage description": "Una aplicacion de Almacenamiento Remoto para guardar datos de sus aplicaciones que no están en el servidor.",
  "tasky description": "Un gestor de tareas, basado en etiquetas, rápido y simple.",
  "todos description": "Escriba y ordene sus tareas de manera eficaz.",
  "term description": "Un terminal para su Cozy.",
  "reminder title email": "Recordatorio",
  "reminder title email expanded": "Recordatorio:  %{description} - %{date} (%{calendar})",
  "reminder message expanded": "Recordatorio: %{description}\nInicio: %{start} (%{timezone})\nFin: %{end} (%{timezone})\nLugar: %{place}\nDetalles: %{details}",
  "reminder message": "Recordatorio: %{message}",
  "warning unofficial app": "Esta aplicación es una aplicación comunitaria y no la mantiene el equipo Cozy.\nPara señalar un problema, le rogamos llevarlo a <a href='https://forum.cozy.io'>nuestro foro</a>.",
  "installation message failure": "Falla en la instalación de %{appName}.",
  "update available notification": "Una nueva versión de %{appName} está disponible.",
  "stack update available notification": "Una nueva versión de la Plataforma está disponible.",
  "noapps": {
    "first steps": "Usted puede <a href=\"%{wizard}\">utilizar nuestro asistente </a> para que lo ayude a instalar y a configurar sus aplicaciones,\no puede abrir <a href=\"%{quicktour}\">primeros pasos </a> para descubrir las funcionalidades de su Cozy.",
    "customize your cozy": "Puede igualmente <a href=\"%{account}\">ir a configuración </a> para personalizar su Cozy,\no <a href=\"%{appstore}\"> a la Apliteca</a> para instalar su primera aplicación."
  },
  "relaunch install wizard": "Reiniciar el asistente de instalación",
  "installwizard": {
    "welcome title": "Bienvenido(a) a su Cozy",
    "welcome content": "<p>Este asistente va a ayudarlo(a) a escoger, instalar y configurar las aplicaciones en su Cozy.</p>\n<p>No olvide que su Cozy está en fase beta. No dude en <a href=\"#help\">contactarnos</a> si encuentra dificultades en su utilización.</p>",
    "yes": "Activar la aplicación %{slug}",
    "no": "No, gracias",
    "continue to files": "Configurar mis aplicaciones",
    "files title": "Configurar la aplicación Archivos",
    "files content": "<p>¿Desea usted instalar una aplicación que le permita organizar sus archivos y carpetas personales, así como hacerlos accesibles con seguridad desde donde se encuentre?</p>",
    "emails title": "Configurar la aplicacion Emails",
    "emails content": "<p>¿Desea usted un cliente de correo electrónico enlazado con todas sus cuentas que le permita un acceso privado a una sola casilla desde donde se encuentre?",
    "contacts title": "Configurar la aplicación Contactos",
    "contacts content": "<p>¿Desea activar una aplicación que le permita administrar su libreta de direcciones y le permita dar acceso inmediato a sus amigos?</p>\n<p><small>La instalación de esta aplicación provocará igualmente la instalación de la aplicación Sincronización que le permitirá sincronizar sus datos con su teléfono y / o su ordenador.</small></p>",
    "calendar title": "Configurar la aplicación Agenda",
    "calendar content": "<p>¿Desea activar la aplicación Agenda para que le ayude a organizar sus actividades?</p>\n<p><small>La instalación de esta aplicación provocará igualmente la instalación de la aplicación Sincronización que le permitirá sincronizar sus datos con su teléfono y / o su ordenador.</small></p>",
    "photos title": "Configurar la aplicación Fotos",
    "photos content": "<p>¿Desea usted instalar una aplicación que le permita organizar sus fotos y álbumes y compartirlos con sus amigos y su familia?</p>\n<p><small>Pro-tip: Si usted utliza un periférico Android, disponemos de una aplicación que permite cargar automaticamente fotos a su Cozy.</small></p>",
    "thanks title": "¡Tarea realizada!",
    "thanks content": "<p>¡Qué fácil es! Usted acaba de configurar su Cozy al instalar las aplicaciones siguientes:</p>",
    "go-to-my-cozy": "Estoy listo(a) para utilizar mi Cozy",
    "show-me-a-quick-tour": "Infórmeme más acerca de mi Cozy"
  },
  "quicktourwizard": {
    "welcome title": "¡Conozca su Cozy!",
    "welcome content": "<p>Bienvenido(a) a su nuevo Cozy.</p>\n<p>Esta visita rápida le presentará las funcionalidades de su Cozy.</p>\n<p>No olvide que su Cozy está en fase beta. No dude en  <a href=\"#help\">consultarnos</a> si encuentra dificultades en su utilización.</p>",
    "continue to dashboard": "Descubra el Tablero de Control",
    "dashboard title": "Descubra el Tablero de Control",
    "dashboard content": "<p>Esta es una pequeña guía que describe las secciones de su Cozy. Usted puede acceder a ellas desde el menú situado en la esquina superior derecha.</p>\n<p><img src=\"/img/home-black.png\"><strong>Inicio: </strong>Este es el lugar de donde usted puede acceder a sus aplicaciones</p>",
    "continue to apps": "¿Cómo administrar sus aplicaciones?",
    "apps title": "Administre sus aplicaciones",
    "apps content": "<p><img src=\"/img/config-apps.png\"><strong>Administración de Aplicaciones: </strong>Aquí usted puede administar el estado de sus aplicaciones: lanzarlas, interrumpirlas, suprimirlas…</p>\n<p><img src=\"/img/apps.png\"><strong>Apliteca: </strong>En la Apliteca, usted encontrará nuevas aplicaciones para instalar en su Cozy.</p>",
    "continue to help": "¿Cómo obtener ayuda?",
    "help title": "Obtener ayuda",
    "help content": "<p><img src=\"/img/configuration.png\"><strong>Configuración: </strong>Para estar seguro que Cozy haga lo que usted quiere, échele una mirada a los posibles ajustes.</p>\n<p><img src=\"/img/help.png\"><strong>Ayuda: </strong>¿Perdido en su Cozy? He aquí algunos enlaces que le serán de utilidad.</p>",
    "continue to sync": "Sincronizar con su teléfono",
    "sync title": "Sincronizar",
    "sync content": "<p>Para obtener información sobre la sincronización de sus periféricos, le aconsejamos las fuentes siguientes:</p>\n<ul>\n<li><a href=\"http://cozy.io/mobile/files.html\">Sinc Archivos</a></li>\n<li><a href=\"http://cozy.io/mobile/calendar.html\">Sinc Agenda</a></li>\n<li><a href=\"http://cozy.io/mobile/contacts.html\">Sinc Contactos</a></li>\n</ul>",
    "close wizard": "Estoy listo(a) para utilizar mi Cozy"
  }
};
});

;require.register("locales/fr", function(exports, require, module) {
module.exports = {
  "home": "Bureau",
  "apps": "Apps",
  "account": "Réglages",
  "email": "Email",
  "timezone": "Fuseau horaire",
  "domain": "Nom de domaine",
  "no domain set": "pas.de.domaine.défini",
  "locale": "Langue",
  "change password": "Changer de mot de passe",
  "input your current password": "Par sécurité, veuillez saisir votre mot de passe actuel :",
  "current password": "Mot de passe actuel",
  "confirm new password": "Confirmer le nouveau mot de passe",
  "send changes": "Enregistrer",
  "manage": "Gestion",
  "total": "Total",
  "memory consumption": "Utilisation mémoire",
  "disk consumption": "Utilisation disque",
  "you have no notifications": "Vous n'avez aucune notification",
  "dismiss all": "Tout effacer",
  "add application": "Ajouter l'application ?",
  "install": "Installer",
  "your app": "Votre application !",
  "community contribution": "Développeur indépendant",
  "official application": "Application officielle",
  "application description": "Description de l'application",
  "downloading description": "Téléchargement de la description…",
  "downloading permissions": "Téléchargement des permissions…",
  "Cancel": "Annuler",
  "ok": "Ok",
  "applications permissions": "Permissions de l'application",
  "confirm": "Confirmer",
  "installing": "Installation en cours",
  "remove": "Enlever",
  "update": "Mettre à jour",
  "started": "démarrée",
  "notifications": "Notifications",
  "questions and help forum": "Forum d'aide",
  "sign out": "Sortir",
  "open in a new tab": "Ouvrir dans un onglet",
  "disk unit": "Go",
  "memory unit": "Mo",
  "always on": "toujours démarrée",
  "keep always on": "garder toujours démarrée",
  "stop this app": "arrêter cette application",
  "update required": "Mise à jour disponible",
  "application is installing": "Une application est en cours d'installation.\nAttendez la fin de celle-ci avant d'en lancer une nouvelle.",
  "no app message": "Vous n'avez aucune application installée. Allez sur\nl'<a href=\"#applications\">app store</a> pour en installer au moins une !",
  "welcome to app store": "Bienvenue sur l'app store, vous pouvez installer votre propre application\nou ajouter une application existante dans la liste",
  "installed everything": "Vous avez déjà tout installé !",
  "already similarly named app": "Une application qui porte un nom similaire est déjà installée.",
  "your app list": "Accédez à vos apps",
  "customize your cozy": "Personnalisez la mise en page",
  "manage your apps": "Gérez vos apps",
  "choose your apps": "Choisissez vos apps",
  "configure your cozy": "Configurez votre cozy",
  "ask for assistance": "Demandez de l'aide",
  "logout": "déconnexion",
  "welcome to your cozy": "Bienvenue sur votre Cozy !",
  "you have no apps": "Vous n'avez aucune application installée.",
  "app management": "Gestion des applications",
  "app store": "App Store",
  "configuration": "Configuration",
  "assistance": "Aide",
  "hardware consumption": "Matériel",
  "hard drive gigabytes": "(Disque Dur)",
  "memory megabytes": "&nbsp;Mo (RAM)",
  "manage your applications": "Applications",
  "manage your devices": "Mobiles et tablettes",
  "status no device": "Aucun appareil enregistré pour synchronisation.",
  "revoke device access": "Révoquer l'appareil",
  "synchronized": "synchronisé",
  "no application installed": "Il n'y a pas d'applications installées.",
  "save": "sauver",
  "saved": "sauvé",
  "market app install": "Installation…",
  "your parameters": "Vos paramètres",
  "alerts and password recovery email": "J'ai besoin de votre email pour la récupération de mot de passe ou\npour vous envoyer des informations :",
  "public name description": "Votre nom sera utilisé par votre Cozy et ses applications pour communiquer avec vous et vos contacts :",
  "your timezone is required": "Votre fuseau horaire est nécessaire pour vous afficher les dates correctement :",
  "domain name for urls and email": "Le nom de domaine est utilisé pour construire les URL de partage\nenvoyées par mail à vos contacts :",
  "Chose the language you want I use to speak with you:": "Choisissez la langue que vous souhaitez pour votre Cozy :",
  "french": "Français",
  "english": "Anglais",
  "german": "Allemand",
  "portuguese": "Portugais",
  "change password procedure": "Procédure de changement de mot de passe",
  "enter a new password": "Votre nouveau mot de passe :",
  "new password": "Nouveau mot de passe",
  "confirm your new password": "Confirmez votre nouveau mot de passe :",
  "save your new password": "Sauvegarder votre nouveau mot de passe",
  "do you want assistance": "Est-ce que vous cherchez de l'aide ?",
  "Write an email to our support team at:": "Ecrivez un email à notre équipe support :",
  "Register and post on our forum: ": "Postez un message sur notre forum :",
  "Ask your question on Twitter: ": "Posez votre question sur Twitter :",
  "Chat with us on IRC:": "Discutez avec nous sur IRC :",
  "Visit the project website and learn to build your app:": "Visitez le site du projet et trouvez les guides pour synchroniser vos périphériques.",
  "your own application": "votre propre application",
  "broken": "cassée",
  "installed": "installée",
  "updated": "mis à jour réussie",
  "updating": "m.à.j en cours",
  "update all": "Mettre tout à jour",
  "update stack": "Mettre à jour",
  "show home logs": "Voir les logs de la Home",
  "show data system logs": "Voir les logs du Data System",
  "show proxy logs": "Voir les logs du Proxy",
  "show logs": "Voir les logs",
  "refresh page": "Veuillez patienter, la mise à jour peut prendre quelques minutes.",
  "update stack modal title": "Mise à jour de votre Cozy",
  "update stack modal content": "Vous êtes sur le point de mettre à jour la plateforme. Votre Cozy sera indisponible quelques instants. Voulez-vous vraiment continuer ?",
  "update stack modal confirm": "Mettre à jour",
  "update stack success": "Vos applications ont bien été mises à jour, la page va se rafraichir.",
  "update stack error": "Une erreur s'est produite pendant la mise à jour, la page va se rafraichir.",
  "applications broken": "Applications cassées",
  "reboot stack": "Redémarrer",
  "cozy platform": "Plateforme",
  "update error": "Une erreur est survenue pendant la mise à jour",
  "error update uninstalled app": "Vous ne pouvez pas mettre à jour une application non installée.",
  "start this app": "Démarrer cette application",
  "stopped": "stoppée",
  "retry to install": "Nouvel essai d'installation",
  "cozy account title": "Cozy - Paramètres",
  "cozy app store title": "Cozy - App Store",
  "cozy home title": "Cozy - Bureau",
  "cozy applications title": "Cozy - États",
  "running": "démarrée",
  "cozy help title": "Cozy - Aide",
  "changing locale requires reload": "Le changement de langue nécessite le rechargement de la page.",
  "cancel": "annuler",
  "abort": "interrompre",
  "Once updated, this application will require the following permissions:": "Une fois mise à jour l'application demandera les permissions suivantes :",
  "confirm update": "confirmez la mise à jour",
  "confirm install": "confirmez l'installation'",
  "no specific permissions needed": "Cette application n'a pas besoin d'informations spécifiques.",
  "removed": "supprimée",
  "removing": "en cours de suppression",
  "required permissions": "Permissions requises",
  "finish layout edition": "Enregistrer",
  "reset customization": "Remise à zéro",
  "use icon": "Mode icône",
  "change layout": "Modifier la disposition",
  "home section leave": "Service d'import",
  "home section main": "Applications principales",
  "home section productivity": "Applications de productivité",
  "home section data management": "Applications de données",
  "home section personal watch": "Applications de veille",
  "home section misc": "Divers",
  "home section platform": "Plateforme",
  "navbar back button title": "Retour bureau",
  "navbar logout": "Déconnexion",
  "navbar notifications": "Notifications",
  "or:": "ou:",
  "app status": "Etats",
  "app store": "App Store",
  "settings": "Paramètres",
  "help": "Aide",
  "account identifiers": "Identifiants",
  "account localization": "Régionalisation",
  "spanish": "espagnol",
  "account personalization": "Personalisation",
  "account background selection": "Choisissez votre fond d'écran pour votre bureau Cozy :",
  "account password": "Changement de mot de passe",
  "help support title": "Support officiel",
  "help community title": "Support via la communauté",
  "help documentation title": "Documentation",
  "help send message title": "Ecrire directement à l'équipe Cozy",
  "help send message explanation": "Pour envoyer un message à l'équipe Cozy, vous pouvez utilisier le champ texte en dessous. Vous pouvez également nous envoyer des retours, rapporter des bugs et bien sûr demander de l'assistance !",
  "help send message action": "Send message to the Cozy Support Team",
  "send message success": "Message successfully sent!",
  "help send message action": "Envoyer un message à l'équipe support de Cozy",
  "send message success": "Message envoyé avec succès !",
  "send message error": "Une erreur est survenue lors de l'envoi du message. Essayez d'envoyer ce message à directement avec un client mail en écrivant à support@cozycloud.cc.",
  "introduction market": "Bienvenue sur le marché d'applications Cozy. Vous pouvez ajouter des applications proposées par Cozy Cloud, d'autres développeurs ou même votre propre application !",
  "error connectivity issue": "Une erreur s'est produite lors de la récupération des données.<br />Merci de réessayer ultérieurement.",
  "package.json not found": "Impossible de récupérer le fichier package.json. Vérifiez l'url de votre dépôt git.",
  "please wait data retrieval": "Merci de bien vouloir patienter pendant la récupération des données…",
  "revoke device confirmation message": "Cette action empêchera l'appareil associé d'accéder à votre Cozy. Voulez-vous vraiment continuer ?",
  "dashboard": "Tableau de bord",
  "calendars description": "Gérez vos événements et synchronisez-les avec votre mobile.",
  "contacts description": "Gérez vos contacts et synchronisez-les avec votre mobile.",
  "emails description": "Lisez, envoyez et sauvegardez vos emails.",
  "files description": "Gérez vos fichiers en ligne et synchronisez-les avec votre mobile.",
  "photos description": "Créez un album photo depuis vos fichiers et partagez-le.",
  "sync description": "Cette application est nécessaire pour synchroniser vos contacts et vos événements.",
  "bookmark description": "Sauvegardez et gérez vos liens favoris.",
  "cozic description": "Un lecteur audio pour votre musique dans votre navigateur.",
  "databrowser description": "Naviguez dans vos données dans un format brut.",
  "feeds description": "Agrégez vos flux RSS et sauvegardez vos liens dans vos favoris.",
  "kyou description": "Améliorez  votre humeur et votre santé en vous quantifiant.",
  "konnectors description": "Importation de données depuis des services externes (Twitter, Jawbone…).",
  "kresus description": "Des outils supplémentaires pour gérer vos comptes.",
  "nirc description": "Accédez à votre canal IRC préféré depuis votre Cozy.",
  "notes description": "Écrivez et organisez des notes intelligentes.",
  "owm description": "Soyez au courant du temps qu'il fait partout dans le monde !",
  "remote storage description": "Un module Remote Storage pour vos applications Unhosted.",
  "tasky description": "Un gestionnaire de tâches, basé sur les tags, rapide et simple.",
  "todos description": "Écrivez et ordonnez vos tâches efficacement.",
  "term description": "Un terminal pour votre Cozy.",
  "ghost description": "Partagez vos histoires avec le monde entier avec la plateforme de blog Ghost.",
  "leave google description": "Une application pour importer vos données de votre compte Google.",
  "reminder title email": "[Cozy-Calendar] Rappel",
  "reminder title email expanded": "Rappel: %{description} - %{date} (%{calendar})",
  "reminder message expanded": "Rappel: %{description}\nDébut: %{start} (%{timezone})\nFin: %{end} (%{timezone})\nLieu: %{place}\nDetails: %{details}",
  "reminder message": "Rappel : %{message}",
  "warning unofficial app": "Cette application est une application communautaire et n'est pas maintenue par l'équipe Cozy.\nPour signaler un problème, merci de le rapporter sur <a href='https://forum.cozy.io'>notre forum</a>.",
  "installation message failure": "Échec de l'installation de %{appName}.",
  "notification open application": "Ouvrir l'application",
  "notification update stack": "Mettre à jour la plateforme",
  "notification update application": "Mettre à jour l'application",
  "update available notification": "Une nouvelle version de %{appName} est disponible.",
  "stack update available notification": "Une nouvelle version de la plateforme est disponible.",
  "app broken title": 'Application cassée',
  "app broken": 'Cette application est cassée. Vous pouvez essayer de la réinstaller: ',
  "reinstall broken app": "réinstallation.",
  "error git": "Nous n'arrivons pas à récuperer le code source.",
  "error github repo": "Le dépot de l'application ne semble pas disponible.",
  "error github": 'Github semble indisponible. Vous pouvez vérifier son status sur https://status.github.com/.',
  'error npm': "L'installation des dépendances a échouée.",
  'error user linux': "La création de l'utilisateur pour cette application a échouée.",
  'error start': "L'application ne peut pas démarrée. Vous pouvez trouver plus d'information dans les logs de l'application.",
  "app msg": "Si l'erreur persiste, vous pouvez nous contacter par mail à contact@@cozycloud.cc\nou sur IRC #cozycloud sur irc.freenode.net.",
  'more details': "Plus de détails",
  'noapps': {
    'first steps': "Vous pouvez <a href=\"%{wizard}\">utiliser l'assistant</a> pour vous aider à installer et configurer vos applications,\nou vous pouvez ouvrir <a href=\"%{quicktour}\">les \"premiers pas\"</a> pour découvrir les fonctionnalités de votre Cozy.",
    'customize your cozy': "Vous pouvez également <a href=\"%{account}\">aller dans les réglages</a> pour personnaliser votre Cozy\nou <a href=\"%{appstore}\">vous rendre dans l'App Store</a> pour installer votre première application."
  },
  'relaunch install wizard': "Relancer l'assistant d'embarquement",
  'installwizard': {
    'welcome title': "Bienvenue dans votre Cozy",
    'welcome content': "<p>Cet assistant va vous aider à choisir, installer et configurer vos applications dans votre Cozy.</p>\n<p>N'oubliez pas que Cozy est en phase bêta, n'hésitez pas à <a href=\"#help\">nous contacter</a> si vous rencontrez des difficultés dans votre utilisation.</p>",
    'yes': "Activer l'application %{slug}",
    'no': "Non, merci",
    'continue to files': "Configurer mes applications",
    'files title': "Configurer l'application Files",
    'files content': "<p>Souhaitez-vous utiliser l'application fichiers qui vous permet de stocker fichiers et dossiers et d'avoir accès à tous vos documents, n'importe où ?</p>",
    'emails title': "Configurer l'application Emails",
    'emails content': "<p>Souhaitez-vous activer le webmail qui vous permet de connecter vos différentes boîtes mail dans une messagerie unifiée ?</p>",
    'contacts title': "Configurer l'application Contacts",
    'contacts content': "<p>Souhaitez-vous activer l'application Contacts qui vous permet de gérer votre carnet d'adresses ?</p>\n<p><small>L'installation de cette application provoquera également l'installation de l'application sync qui vous permet de synchroniser vos données avec votre smartphone et / ou votre ordinateur.</small></p>",
    'calendar title': "Configurer l'application Calendar",
    'calendar content': "<p>Souhaitez-vous activer l'application Calendar qui vous permet de gérer votre agenda ?</p>\n<p><small>L'installation de cette application provoquera également l'installation de l'application sync qui vous permet de synchroniser vos données avec votre smartphone et / ou votre ordinateur.</small></p>",
    'photos title': "Configurer l'application Photos",
    'photos content': "<p>Souhaitez-vous installer l'application photos qui vous permet de stocker vos images et albums et de les partager avec vos proches ?</p>\n<p><small>Si vous utilisez un smartphone Android, vous pouvez installer notre application sur votre smartphone pour télécharger vos photos directement depuis votre téléphone.</small></p>",
    'thanks title': "Et voilà !",
    'thanks content': "<p>Félicitations ! Vous venez de configurer votre Cozy en y installant les applications suivantes :</p>",
    'go-to-my-cozy': "Je suis prêt à utiliser mon Cozy",
    'show-me-a-quick-tour': "Dites m'en plus sur les fonctionnalités de mon Cozy"
  },
  'quicktourwizard': {
    'welcome title': "Bienvenue sur votre Cozy !",
    'welcome content': "<p>Cozy est le système d'exploitation de votre cloud personnel. Il permet de gérer simplement votre propre machine à distance. Vous pourrez installer des applications qui vous permettront d'exploiter les données que vous stockez. Grâce à un navigateur web, vous pourrez accéder à vos outils depuis n'importe où sans pour autant compromettre votre vie privée. </p>\n<p>Voici les avantages d'avoir son propre cloud :</p>\n<ul>\n  <li>Votre confidentialité est respectée, vos données sont stockées sur une machine qui vous appartient.</li>\n  <li>Vous ne recevez plus de publicité ciblée.</li>\n  <li>Vous n'avez plus à vous connecter à 10 comptes différents pour utiliser vos propres outils.</li>\n  <li>Plus besoin de rentrer les même informations dans chaque outil : les données sont partagées par les applications.</li>\n</ul>\n<p></p>",
    'continue to apps': "Quelles sont les applications disponibles ?",
    'apps title': "Les applications disponibles",
    'apps content': "<p>Par défaut Cozy propose cinq applications :</p>\n<ul>\n  <li>Calendar : Pour gérer vos événements importants</li>\n  <li>Contacts : Votre carnet d'adresses et de téléphones.</li>\n  <li>Files : Pour stocker vos fichiers importants et partager des fichiers volumineux.</li>\n  <li>Emails : Pour centraliser vos boites mail en ligne.</li>\n  <li>Photos : Pour créer et partager des albums photos.</li>\n</ul>\n<p>De plus, vous pourrez découvrir les applications réalisées\npar la communauté. Vous trouverez des applications comme un gestionnaire de compte bancaire, un lecteur de flux RSS, un gestionnaire de todo-liste et bien d'autres encore ! Rendez-vous dans l'app store pour découvrir le catalogue.\n</p>",
    'continue to help': "Comment trouver de l'aide ?",
    'help title': "Obtenir de l'aide",
    'help content': "<p><img src=\"/img/configuration.png\"><strong>Configuration : </strong>Pour fonctionner correctement, Cozy nécessite différents paramètres. Choisissez-les dans cette section.</p>\n<p><img src=\"/img/help.png\"><strong>Aide: </strong>Vous trouverez ici toutes les ressources dont vous avez besoin.</p>",
    'continue to sync': "Comment synchroniser votre mobile ?",
    'sync title': "Synchronisation du mobile",
    'sync content': "<p><strong>Contacts et Agendas</strong></p>\n<p>\nVous pouvez synchroniser vos contacts et agendas à travers les protocoles\nCalDAV et CardDAV. Sous ces noms exotiques se cachent deux standards qui permettent de synchroniser votre Cozy avec la plupart des logiciels de gestion de contacts\net d'agendas disponibles. Cela permet également de synchroniser\nun smartphone Android ou iOS avec votre Cozy. Pour configurer votre téléphone\nnous vous invitons à consulter nos deux didacticiels :\n<ul>\n<li><a href=\"http://cozy.io/fr/mobile/contacts.html\">Comment synchroniser ses contacts</a></li>\n<li><a href=\"http://cozy.io/fr/mobile/calendar.html\">Comment synchroniser ses agendas</a></li>\n</ul>\n</p>\n<p><strong>Fichiers et Photos (Android seulement)</strong></p>\n<p>\n  Avec Cozy vous pouvez sauvegarder automatiquement vos photos dans votre Cozy. Inversement vous pouvez consulter les fichiers de votre Cozy depuis votre mobile et les sauvegarder pour y accéder même quand votre connexion est interrompue.\n</p>\n<p>Pour installer l'application Cozy pour Android. Vous pouvez lire notre <a href=\"http://cozy.io/fr/mobile/files.html\">tutoriel</a> ou récupérer notre application sur le <a href=\"https://play.google.com/store/apps/details?id=io.cozy.files_client\">PlayStore</a>\n</p>",
    'continue to import': "Comment importer mes données ?",
    'import title': "Import des données de contacts et agendas",
    'import content': "<p>\nPour importer vos données vous pouvez utiliser les format ICAL, ou\nCardDAV. La plupart des outils proposent une exportation à ce format.\nEnsuite, vous trouverez des outils d'importation. dans les applications\nContacts et Calendar.\n</p>\n<p>\nQuant à vos fichiers classiques, ils peuvent être uploadés directement depuis l'interface de l'application Files.\n</p>\n<p>\nNous mettrons également bientôt à disposition une application vous permettant de récupérer toutes vos données Google très facilement dans votre Cozy.\n</p>\n<p>\nVoilà, maintenant l'introduction à Cozy est terminée. Vous savez déjà\ntout ce qu'il faut pour démarrer. Nous vous laissons découvrir\nles applications disponibles.\n</p>",
    'close wizard': "Démarrer avec mon Cozy !"
  },
  "pick from files": "Choisir une photo",
  "Crop the photo": "Recadrez l'image (",
  "chooseAgain": "changer de photo",
  "modal ok": "OK",
  "modal cancel": "Annuler",
  "no image": "Il n'y a pas d'image sur votre Cozy",
  "ObjPicker upload btn": "Sélectionnez un fichier local",
  "or": "ou",
  "drop a file": "Glissez et déposez un fichier",
  "url of an image": "URL d'une image sur le web",
  "you have no album": "<p>You have no photo album yet<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-(</p>\n<p>Create some with the\n    <a href=\"/#applications\" target='_blank'>Photo application</a>\n    <br>\n    and use photo from your phone with the\n    <a href='https://play.google.com/store/apps/details?id=io.cozy.files_client&hl=en' target='_blank'>mobile app !</a></p>\n    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:-)"
};
});

;require.register("locales/pt", function(exports, require, module) {
module.exports = {
  "home": "Inicio",
  "apps": "Aplicações",
  "account": "Conta",
  "email": "Email",
  "timezone": "Fuso Horário",
  "domain": "Dominio",
  "no domain set": "nenhum.dominio.configurado",
  "locale": "Locale",
  "change password": "Mudar Password",
  "input your current password": "coloque a sua password actual",
  "enter a new password": "preencha este campo para colocar a sua nova password",
  "confirm new password": "confirme a sua nova password",
  "send changes": "Gravar Mudanças",
  "manage": "Gerir",
  "total": "Total",
  "memory consumption": "Consumo de Memória",
  "disk consumption": "Consumo de Disco",
  "you have no notifications": "Não tem notificações",
  "dismiss all": "Dispensar Tudo",
  "add application": "adicionar aplicação ?",
  "install": "Instalar",
  "your app": "a tua aplicação!",
  "community contribution": "contribuição da comunidade",
  "official application": "aplicação oficial",
  "application description": "Descrição da Aplicação",
  "downloading description": "A fazer download da descrição…",
  "downloading permissions": "A fazer download das permissões…",
  "Cancel": "Cancelar",
  "ok": "Ok",
  "applications permissions": "Permissões da Aplicação",
  "confirm": "Confirmar",
  "installing": "A instalar",
  "remove": "remover",
  "update": "actualizar",
  "started": "inicidada",
  "notifications": "Notificações",
  "questions and help forum": "Perguntas e fórum de ajuda",
  "sign out": "Sair",
  "open in a new tab": "Abrir numa nova janela",
  "disk unit": "GB",
  "memory unit": "MB",
  "always on": "sempre ligada",
  "keep always on": "manter sempre ligada",
  "stop this app": "parar esta aplicação",
  "update required": "Atualização disponível",
  "application is installing": "Uma aplicação já está a ser instalada.\nPor favor espere que acabe a instalçaõ e tente de novo.",
  "no app message": "Não tem aplicações instaladas no seu Cozy.\nVá á <a href=\"#applications\">loja</a> para instalar algumas!",
  "welcome to app store": "Bem vindo á loja de aplicações, instale a sua aplicação\nou escolha uma da lista.",
  "installed everything": "Já instalou tudo!",
  "already similarly named app": "Já existe uma aplicação com um nome igual.",
  "your app list": "Acceso ás tua aplicações",
  "customize your cozy": "Muda o teu layout",
  "manage your apps": "Gere a tua aplicação",
  "choose your apps": "Escolhe as tuas aplicações",
  "configure your cozy": "Configura o teu Cozy",
  "ask for assistance": "Pede assistência",
  "logout": "sair",
  "welcome to your cozy": "Ben vindo ao teu Cozy!",
  "you have no apps": "Não tens aplicações instaladas",
  "app management": "Gestão de aplicações",
  "app store": "Loja de aplicações",
  "configuration": "Configuração",
  "assistance": "Assistência",
  "hardware consumption": "Hardware",
  "hard drive gigabytes": "(Disco Rigido)",
  "memory megabytes": "&nbsp;MB (RAM)",
  "manage your applications": "Gere as tuas aplicações",
  "manage your devices": "Gere os teus dispositivos",
  "synchronized": "sincronizado",
  "revoke device access": "Revoke device access",
  "no application installed": "Não há aplicações instaladas.",
  "your parameters": "Os seus parâmetros",
  "alerts and password recovery email": "Necessito do seu email para enviar alertas ou email de recuperação de password.",
  "public name description": "O nome público será utilizado para o Cozy e as aplicações comunicarem consigo.",
  "your timezone is required": "O fuso horário é necessário para mostrar as datas correctamente.",
  "domain name for urls and email": "O dominio é usado para construir links para enviar para si ou para os seus contactos.",
  "save": "guardar",
  "saved": "saved",
  "Chose the language you want I use to speak with you:": "Escolha a lingua que quer que fale:",
  "french": "Francês",
  "english": "Inglês",
  "portuguese": "Português",
  "change password procedure": "Mudar procedimento de password",
  "current password": "password actual",
  "new password": "password nova",
  "confirm your new password": "confirme a sua nova pasword",
  "save your new password": "grave a sua nova password",
  "do you want assistance": "Procura ajuda ?",
  "Write an email to our support team at:": "Escreve um e-mail á equipa de suporte:",
  "Register and post on our forum: ": "Regista-te no nosso fórum:",
  "Ask your question on Twitter: ": "Pergunta-nos no Twitter:",
  "Chat with us on IRC:": "Chat with us on IRC:",
  "Visit the project website and learn to build your app:": "Visita o site do projecto para aprenderes a fazer a tua aplicação:",
  "your own application": "a tua aplicação",
  "installed": "instalada",
  "updated": "actualizada",
  "updating": "a actualizar",
  "update all": "Actualizar todos",
  "update stack": "Actualizar",
  "refresh page": "Wait please, update take in several minutes.",
  "update stack modal title": "Update of your Cozy",
  "update stack modal content": "You are about to update the platform. Your Cozy will be unavailable a few minutes. Are you sure?",
  "update stack modal confirm": "Actualizar",
  "update stack success": "Your applications are updated, page will refresh.",
  "update stack error": "An error occured during update, page will refresh.",
  "update error": "Ocurreu um erro durante a actualização da aplicação",
  "applications broken": "Applications broken",
  "broken": "quebrado",
  "start this app": "iniciar esta aplicação",
  "stopped": "parada",
  "retry to install": "repita para instalar",
  "cozy account title": "Cozy - Conta",
  "cozy app store title": "Cozy - Loja",
  "cozy home title": "Cozy - Inicio",
  "cozy applications title": "Cozy - Configurações de aplicações",
  "running": "a correr",
  "cozy help title": "Cozy - Ajuda",
  "changing locale requires reload": "Mudar o locale requer que faça refresh á página.",
  "cancel": "cancelar",
  "abort": "abortar",
  "Once updated, this application will require the following permissions:": "Depois de actualizada a aplicação irá requerer as seguintes permissões:",
  "confirm update": "confirmar actualização",
  "no specific permissions needed": "Esta aplicação necssita de permissões especificas",
  "removed": "removido",
  "required permissions": "Permissões necessárias:",
  "finish layout edition": "Guardar",
  "reset customization": "Repo",
  "use icon": "Usar icon",
  "change layout": "Mudar o layout",
  "introduction market": "Bem vindo á loja de aplicações do Cozy. Este é o sitio onde podes personalizar o teu Cozy\nao adicionar aplicações.\nApartir dai podes instalar a aplicação que construiste ou escolher entre\naplicações criadas pela Cozy Cloud e outros programadores.",
  "error connectivity issue": "Ocurreu um erro ao receber os teus dados.<br />Por favor tenta de novo.",
  "please wait data retrieval": "Por favor aguarda enquanto os teus dados são recebidos…",
  "revoke device confirmation message": "This will prevent the related device to access your Cozy. Are you sure?",
  "reminder title email": "[Cozy-Calendar] Reminder",
  "reminder message": "Reminder: %{message}",
  "warning unofficial app": "This app is a communautary app and isn't maintained by the Cozy team.\nTo report a bug, please file an issue in <a href='https://forum.cozy.io'>our forum</a>.",
  "installation message failure": "%{appName}'s installation failed.",
  "update available notification": "A new version of %{appName} is available.",
  'noapps': {
    'first steps': "You can <a href=\"%{wizard}\">use our wizard</a> to help you to install and configure your apps,\nor you can take a <a href=\"%{quicktour}\">quick tour</a> to discover your Cozy features.",
    'customize your cozy': "You can also <a href=\"%{account}\">go to your settings</a> to customize your Cozy\nor <a href=\"%{appstore}\">take a look at the App Store</a> to install your first app."
  },
  'relaunch install wizard': "Relaunch install wizard",
  'installwizard': {
    'welcome title': "Welcome to your new Cozy",
    'welcome content': "<p>This wizard will help you to choose, install and configure your apps in your Cozy.</p>\n<p>Please remember that Cozy is actually in a beta version, so don't hesitate to <a href=\"#help\">keep in touch with us</a> if you expect some issues.</p>",
    'yes': "Activate this %{slug} app",
    'no': "No, thanks",
    'continue to files': "Configure my apps",
    'files title': "Configure Files app",
    'files content': "<p>Do you want a files application that stores for you files and folder, so your documents are available anywhere?</p>",
    'emails title': "Configure Emails app",
    'emails content': "<p>Do you want a webmail that can connects to your email(s) provider(s), so you can access a private, unified mailbox everywhere?</p>",
    'contacts title': "Configure Contacts app",
    'contacts content': "<p>Do you want a contacts application that will manage your addressbook to keep instant access to your friends?</p>\n<p><small>Enabling this app will also enable the sync app that will provides to you a synchronization channel with your smartphone and desktop apps.</small></p>",
    'calendar title': "Configure Calendar app",
    'calendar content': "<p>Do you want a calendar application that will tracks your upcoming events?</p>\n<p><small>Enabling this app will also enable the sync app that will provides to you a synchronization channel with your smartphone and desktop apps.</small></p>",
    'photos title': "Configure Photos app",
    'photos content': "<p>Do you want a photos app that stores your pictures in albums and allows you to share them with others?</p>\n<p><small>Tip: if you use an Android smartphone, you can use our app to upload your photos to the app directly from you phone.</small></p>",
    'thanks title': "It's done!",
    'thanks content': "<p>That's all! You've just configured your cozy with the following apps:</p>",
    'go-to-my-cozy': "I'm ready to use my Cozy",
    'show-me-a-quick-tour': "Please tell me more about my Cozy"
  },
  'quicktourwizard': {
    'welcome title': "Meet your Cozy!",
    'welcome content': "<p>Welcome to your brand new Cozy</p>\n<p>This quick steps tour will presents to you some features about your Cozy.</p>\n<p>Please remember that Cozy is actually in a beta version, so don't hesitate to <a href=\"#help\">keep in touch with us</a> if you expect some issues.</p>",
    'continue to dashboard': "Discover the Dashboard",
    'dashboard title': "Discover the Dashboard",
    'dashboard content': "<p>Here is a little guide about all section available in your Cozy Home. All of them can be reached from the menu located on the top right corner.</p>\n<p><img src=\"/img/home-black.png\"><strong>Home: </strong>It is the place from where you can reach your applications</p>",
    'continue to apps': "How to manage your apps?",
    'apps title': "Manage your apps",
    'apps content': "<p><img src=\"/img/config-apps.png\"><strong>App management: </strong>There you can manage the state of your applications: start it, stop it, remove it…</p>\n<p><img src=\"/img/apps.png\"><strong>App store: </strong>In the app store, you will find new applications to install on your Cozy.</p>",
    'continue to help': "How to get assistance?",
    'help title': "Get help",
    'help content': "<p><img src=\"/img/configuration.png\"><strong>Configuration: </strong>To work properly your Cozy requires several parameters. Set them in this section.</p>\n<p><img src=\"/img/help.png\"><strong>Assistance: </strong>You will find here some links to assistance resources.</p>",
    'continue to sync': "Sync with your smartphone",
    'sync title': "Get in Sync",
    'sync content': "<p>To get more information about syncing, you can take a look at the following resources:</p>\n<ul>\n    <li><a href=\"http://cozy.io/mobile/files.html\">Sync Fichiers</a></li>\n    <li><a href=\"http://cozy.io/mobile/calendar.html\">Sync Calendrier</a></li>\n    <li><a href=\"http://cozy.io/mobile/contacts.html\">Sync Contacts</a></li>\n</ul>",
    'close wizard': "Now I'm ready to use my Cozy"
  }
};
});

;require.register("models/application", function(exports, require, module) {
var Application, client, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    this.uninstall = __bind(this.uninstall, this);
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.idAttribute = 'slug';

  Application.prototype.url = function() {
    var base;
    base = "/api/applications/";
    if (this.get('id')) {
      return "" + base + "byid/" + (this.get('id'));
    }
    return base;
  };

  Application.prototype.isIconSvg = function() {
    var iconType;
    iconType = this.get('iconType');
    return (iconType != null) && iconType === 'svg';
  };

  Application.prototype.isRunning = function() {
    return this.get('state') === 'installed';
  };

  Application.prototype.isBroken = function() {
    return this.get('state') === 'broken';
  };

  Application.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        return _this.set(data.app);
      };
    }
    this.trigger('request', this, null, callbacks);
    callbacks.success = function(data) {
      if (presuccess) {
        presuccess(data);
      }
      _this.trigger('sync', _this, null, callbacks);
      if (success) {
        return success(data);
      }
    };
    return callbacks.error = function(jqXHR) {
      if (preerror) {
        preerror(jqXHR);
      }
      _this.trigger('error', _this, jqXHR, {});
      if (error) {
        return error(jqXHR);
      }
    };
  };

  Application.prototype.install = function(callbacks) {
    var params;
    this.prepareCallbacks(callbacks);
    params = this.attributes;
    delete params.id;
    return client.post('/api/applications/install', params, callbacks);
  };

  Application.prototype.uninstall = function(callbacks) {
    var _this = this;
    this.prepareCallbacks(callbacks, function() {
      return _this.trigger('destroy', _this, _this.collection, {});
    });
    return client.del("/api/applications/" + this.id + "/uninstall", callbacks);
  };

  Application.prototype.updateApp = function(callbacks) {
    var _this = this;
    if (this.get('state') !== 'broken') {
      this.prepareCallbacks(callbacks);
      return client.put("/api/applications/" + this.id + "/update", {}, callbacks);
    } else {
      return client.del("/api/applications/" + this.id + "/uninstall", {
        success: function() {
          return _this.install(callbacks);
        },
        error: callbacks.error
      });
    }
  };

  Application.prototype.start = function(callbacks) {
    if (this.isRunning()) {
      return null;
    }
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/" + this.id + "/start", {}, callbacks);
  };

  Application.prototype.stop = function(callbacks) {
    if (!this.isRunning()) {
      return null;
    }
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/" + this.id + "/stop", {}, callbacks);
  };

  Application.prototype.getPermissions = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getPermissions", this.toJSON(), callbacks);
  };

  Application.prototype.getDescription = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getDescription", this.toJSON(), callbacks);
  };

  Application.prototype.getMetaData = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("/api/applications/getMetaData", this.toJSON(), callbacks);
  };

  Application.prototype.getSection = function() {
    var name, section;
    section = 'misc';
    name = this.get('slug');
    if (name === 'leave-google') {
      section = 'leave';
    } else if (name === 'calendar' || name === 'contacts' || name === 'emails' || name === 'files' || name === 'photos') {
      section = 'main';
    } else if (name === 'blog' || name === 'feeds' || name === 'bookmarks') {
      section = 'watch';
    } else if (name === 'kresus' || name === 'konnectors' || name === 'kyou' || name === 'databrowser') {
      section = 'data';
    } else if (name === 'todos' || name === 'notes' || name === 'tasky') {
      section = 'productivity';
    } else if (name === 'sync') {
      section = 'platform';
    }
    return section;
  };

  Application.prototype.updateAll = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.put("/api/applications/update/all", {}, callbacks);
  };

  return Application;

})(Backbone.Model);
});

;require.register("models/background", function(exports, require, module) {
var Background, BaseModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Background = (function(_super) {
  __extends(Background, _super);

  function Background() {
    _ref = Background.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Background.prototype.urlRoot = '/api/backgrounds/';

  Background.prototype.getSrc = function() {
    var id;
    id = this.get('id');
    if (id.indexOf('background') > -1) {
      id = id.replace('-', '_');
      return "/img/backgrounds/" + id + ".jpg";
    } else {
      return "/api/backgrounds/" + id + "/picture.jpg";
    }
  };

  Background.prototype.getThumbSrc = function() {
    var id;
    id = this.get('id');
    if (id.indexOf('background') > -1) {
      id = id.replace('-', '_');
      return "/img/backgrounds/" + id + "_th.png";
    } else {
      return "/api/backgrounds/" + id + "/thumb.jpg";
    }
  };

  return Background;

})(BaseModel);
});

;require.register("models/device", function(exports, require, module) {
var BaseModel, Device, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Device = (function(_super) {
  __extends(Device, _super);

  function Device() {
    _ref = Device.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Device.prototype.urlRoot = 'api/devices/';

  return Device;

})(Backbone.Model);
});

;require.register("models/instance", function(exports, require, module) {
var Instance, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

module.exports = Instance = (function(_super) {
  __extends(Instance, _super);

  function Instance() {
    _ref = Instance.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Instance.prototype.saveData = function(data, callback) {
    this.set(data);
    return request.post("api/instance", data, callback);
  };

  return Instance;

})(Backbone.Model);
});

;require.register("models/notification", function(exports, require, module) {
var BaseModel, Notification, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

module.exports = Notification = (function(_super) {
  __extends(Notification, _super);

  function Notification() {
    _ref = Notification.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Notification.prototype.urlRoot = 'api/notifications';

  return Notification;

})(BaseModel);
});

;require.register("models/photo", function(exports, require, module) {
var Photo, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require('../lib/client');

module.exports = Photo = (function(_super) {
  __extends(Photo, _super);

  function Photo() {
    _ref = Photo.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Photo.prototype.defaults = function() {
    return {
      thumbsrc: 'img/loading.gif',
      src: '',
      orientation: 1
    };
  };

  Photo.prototype.url = function() {
    return Photo.__super__.url.apply(this, arguments) + app.urlKey;
  };

  Photo.prototype.parse = function(attrs) {
    if (!attrs.id) {
      return attrs;
    } else {
      return _.extend(attrs, {
        thumbsrc: ("photos/thumbs/" + attrs.id + ".jpg") + app.urlKey,
        src: ("photos/" + attrs.id + ".jpg") + app.urlKey,
        orientation: attrs.orientation
      });
    }
  };

  Photo.prototype.getPrevSrc = function() {
    return "photos/" + (this.get('id')) + ".jpg";
  };

  return Photo;

})(Backbone.Model);

Photo.getMonthdistribution = function(callback) {
  return client.get("files/photo/monthdistribution", callback);
};

Photo.listFromFiles = function(skip, limit, callback) {
  return client.get("files/photo/range/" + skip + "/" + limit, callback);
};

Photo.makeFromFile = function(fileid, attr, callback) {
  return client.post("files/" + fileid + "/toPhoto", attr, callback);
};
});

;require.register("models/stack_application", function(exports, require, module) {
var StackApplication, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

module.exports = StackApplication = (function(_super) {
  __extends(StackApplication, _super);

  function StackApplication() {
    _ref = StackApplication.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  StackApplication.prototype.idAttribute = 'name';

  StackApplication.prototype.url = function() {
    var base;
    base = "/api/applications/stack";
    if (this.get('id')) {
      return "" + base + "byid/" + (this.get('id'));
    }
    return base;
  };

  StackApplication.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        return _this.set(data.app);
      };
    }
    this.trigger('request', this, null, callbacks);
    callbacks.success = function(data) {
      if (presuccess) {
        presuccess(data);
      }
      _this.trigger('sync', _this, null, callbacks);
      if (success) {
        return success(data);
      }
    };
    return callbacks.error = function(jqXHR) {
      if (preerror) {
        preerror(jqXHR);
      }
      _this.trigger('error', _this, jqXHR, {});
      if (error) {
        return error(jqXHR);
      }
    };
  };

  StackApplication.prototype.waitReboot = function(step, total_step, callbacks) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    return client.get("api/applications/stack", {
      success: function() {
        if (step === total_step) {
          if (success) {
            return success('ok');
          }
        } else {
          if (step === 1) {
            step += step;
          }
          return setTimeout(function() {
            return _this.waitReboot(step, total_step, callbacks);
          }, 500);
        }
      },
      error: function() {
        return setTimeout(function() {
          if (step === 0 || step === 2) {
            step = step + 1;
          }
          return _this.waitReboot(step, total_step, callbacks);
        }, 500);
      }
    });
  };

  StackApplication.prototype.updateStack = function(callbacks) {
    var _this = this;
    return client.put("/api/applications/update/stack", {}, {
      sucess: function() {
        return _this.waitReboot(0, 2, callbacks);
      },
      error: function() {
        return _this.waitReboot(0, 2, callbacks);
      }
    });
  };

  StackApplication.prototype.rebootStack = function(callbacks) {
    var _this = this;
    return client.put("/api/applications/reboot/stack", {}, {
      sucess: function() {
        return _this.waitReboot(0, 1, callbacks);
      },
      error: function() {
        return _this.waitReboot(0, 1, callbacks);
      }
    });
  };

  return StackApplication;

})(Backbone.Model);
});

;require.register("models/user", function(exports, require, module) {
var BaseModel, User, client,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('lib/base_model').BaseModel;

client = require('helpers/client');

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User(email, password) {
    this.email = email;
    this.password = password;
    User.__super__.constructor.call(this);
  }

  User.prototype.logout = function(callbacks) {
    return client.get("logout/", callbacks);
  };

  return User;

})(BaseModel);
});

;require.register("routers/main_router", function(exports, require, module) {
var MainRouter, ObjectPickerCroper, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectPickerCroper = require('../views/object-picker');

module.exports = MainRouter = (function(_super) {
  __extends(MainRouter, _super);

  function MainRouter() {
    _ref = MainRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MainRouter.prototype.routes = {
    "home": "applicationList",
    "customize": "applicationListEdit",
    "applications": "market",
    "config-applications": "configApplications",
    "account": "account",
    "help": "help",
    "home/install": "installWizard",
    "home/quicktour": "quickTourWizard",
    "logout": "logout",
    "update/:slug": "updateApp",
    "update-stack": "updateStack",
    "apps/:slug": "application",
    "apps/:slug/*hash": "application",
    "*path": "applicationList",
    '*notFound': 'applicationList'
  };

  MainRouter.prototype.initialize = function() {
    var _this = this;
    return window.addEventListener('message', function(event) {
      var intent, intentType;
      if (event.origin !== window.location.origin) {
        return false;
      }
      intent = event.data;
      switch (intent.action) {
        case 'goto':
          return _this.navigate("apps/" + intent.params, true);
        case void 0:
          intentType = 'application/x-talkerjs-v1+json';
          if (JSON.parse(intent).type !== intentType) {
            return console.log("Weird intent, cannot handle it.", intent);
          }
          break;
        default:
          return console.log("Weird intent, cannot handle it.", intent);
      }
    });
  };

  MainRouter.prototype.applicationList = function() {
    return app.mainView.displayApplicationsList();
  };

  MainRouter.prototype.configApplications = function() {
    return app.mainView.displayConfigApplications();
  };

  MainRouter.prototype.updateApp = function(slug) {
    return app.mainView.displayUpdateApplication(slug);
  };

  MainRouter.prototype.updateStack = function() {
    return app.mainView.displayUpdateStack();
  };

  MainRouter.prototype.help = function() {
    return app.mainView.displayHelp();
  };

  MainRouter.prototype.market = function() {
    return app.mainView.displayMarket();
  };

  MainRouter.prototype.account = function() {
    return app.mainView.displayAccount();
  };

  MainRouter.prototype.application = function(slug, hash) {
    return app.mainView.displayApplication(slug, hash);
  };

  MainRouter.prototype.installWizard = function() {
    return app.mainView.displayInstallWizard();
  };

  MainRouter.prototype.quickTourWizard = function() {
    return app.mainView.displayQuickTourWizard();
  };

  MainRouter.prototype.logout = function() {
    return app.mainView.logout();
  };

  return MainRouter;

})(Backbone.Router);
});

;require.register("templates/account", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="account-form" class="lightgrey pa2"><div class="line"><div class="mod left w50 pa2"><h4>');
var __val__ = t('account personalization')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><p><p>');
var __val__ = t('account background selection')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><div class="background-list line mb1"></div><button id="background-add-button" class="btn w100">');
var __val__ = t('account background add')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div class="mod left w50 pa2"><h4>');
var __val__ = t('account identifiers')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="input"><p>');
var __val__ = t('alerts and password recovery email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><input id="account-email-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div class="input"><p>');
var __val__ = t('public name description')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><input id="account-public-name-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div class="input"><p>');
var __val__ = t('domain name for urls and email')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p><input id="account-domain-field"/><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><h4>');
var __val__ = t('account localization')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="input"><p>');
var __val__ = t('your timezone is required')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><select id="account-timezone-field"></select><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><div class="input"><p>');
var __val__ = t('Chose the language you want I use to speak with you:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><select id="account-locale-field"><option value="fr">');
var __val__ = t('french')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="en">');
var __val__ = t('english')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="de">');
var __val__ = t('german')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option><option value="es">');
var __val__ = t('spanish')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option></select><button class="btn">');
var __val__ = t('save')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div><h4>');
var __val__ = t('account password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="change-password-form"><p><label>');
var __val__ = t('input your current password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password0-field'), 'type':("password"), 'placeholder':("" + (t('current password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><label>');
var __val__ = t('enter a new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password1-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><label>');
var __val__ = t('confirm new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</label></p><input');
buf.push(attrs({ 'id':('account-password2-field'), 'type':("password"), 'placeholder':("" + (t('new password')) + "") }, {"type":true,"placeholder":true}));
buf.push('/><p><button id="account-form-button" class="btn">');
var __val__ = t('save your new password')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><p class="loading-indicator">&nbsp;</p><div id="account-info" class="alert main-alert alert-success hide"><div id="account-info-text"></div></div><div id="account-error" class="alert alert-error main-alert hide"><div id="account-form-error-text"></div></div></p></div></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/album_thumb", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="albumLabel"><img class="cover"/><div class="label"></div></div>');
}
return buf.join("");
};
});

require.register("templates/application_iframe", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<iframe');
buf.push(attrs({ 'src':("apps/" + (id) + "/" + (hash) + ""), 'id':("" + (id) + "-frame") }, {"src":true,"id":true}));
buf.push('></iframe>');
}
return buf.join("");
};
});

require.register("templates/background_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/background_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<button class="delete-background-button btn right ma1"><i class="fa fa-trash"></i></button><img');
buf.push(attrs({ 'src':("" + (model.src) + ""), "class": ('w100') + ' ' + ('left') }, {"src":true}));
buf.push('/>');
}
return buf.join("");
};
});

require.register("templates/config_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><div class="left mod w75"><div class="line"><strong>' + escape((interp = app.displayName) == null ? '' : interp) + '</strong>');
if ( app.version)
{
buf.push('<span>&nbsp;-&nbsp; ' + escape((interp = app.version) == null ? '' : interp) + '</span>');
}
buf.push('<span>&nbsp;-&nbsp;</span>');
if ( app.state === 'installed')
{
buf.push('<span class="state-label">');
var __val__ = t('running')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
else
{
buf.push('<span class="state-label">' + escape((interp = app.state) == null ? '' : interp) + '</span>');
}
buf.push('</div><div class="line">');
if ( app.needsUpdate)
{
buf.push('<span class="to-update-label">');
var __val__ = t('update required')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
buf.push('</div><div class="line"><div class="comments">');
if ( app.comment === 'official application')
{
buf.push('<img');
buf.push(attrs({ 'src':("img/happycloud-black.svg"), 'alt':("" + (t(app.comment)) + ""), 'width':("20") }, {"src":true,"alt":true,"width":true}));
buf.push('/>');
}
buf.push('<a');
buf.push(attrs({ 'href':("" + (app.website) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = app.website
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div></div></div><div class="buttons left mod w25"><div><button class="btn update-app"><i class="fa fa-refresh mr1"></i> <span class="label">');
var __val__ = t('update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div><div><button class="btn remove-app"><i class="fa fa-trash mr1"></i> <span class="label">');
var __val__ = t('remove')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div><div><button class="btn btn-large start-stop-btn"><i class="fa fa-power-off mr1"></i> <span class="label">');
var __val__ = t('stop this app')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div><div><a');
buf.push(attrs({ 'href':("/logs/" + (app.slug) + ""), 'target':("_blank"), "class": ('btn') + ' ' + ('btn-large') }, {"href":true,"target":true}));
buf.push('><i class="fa fa-cog mr1"></i> <span class="label">');
var __val__ = t('show logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/config_application_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/config_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger apps--><div class="md-overlay"></div><div class="txt-center"><div class="line platform-section"><div class="mod left w50"><h4>');
var __val__ = t('hardware consumption')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="line"><div class="disk-space mt2 left w50 mod"><div class="line"><img src="img/hard-drive.png"/></div><div class="line"><span class="amount">0</span> / <span class="total">0</span> ' + escape((interp = t('hard drive gigabytes')) == null ? '' : interp) + '</div></div><div class="memory-free mt2 left w50 mod"><div class="line"><img src="img/ram.png"/></div><div class="line"><span class="amount">0</span> / <span class="total">0</span> ' + escape((interp = t('memory megabytes')) == null ? '' : interp) + '</div></div></div><h4>');
var __val__ = t('cozy platform')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="stack-app mt2 line"><div class="mod w75 left"><div class="line"><span class="app">Data System: </span><span class="data-system">--</span></div><div class="line"><span class="app">Proxy: </span><span class="proxy">--</span></div><div class="line"><span class="app">Home: </span><span class="home">--</span></div><div class="line"><span class="app">Controller: </span><span class="controller">--</span></div><div class="line"><span class="refresh">');
var __val__ = t('refresh page')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div></div><div class="mod buttons w25 right"><button class="btn update-stack"><i class="fa fa-refresh mr1"></i><span>');
var __val__ = t('update stack')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><button class="btn update-all"><i class="fa fa-refresh mr1"></i><span>');
var __val__ = t('update all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><button class="btn reboot-stack"><i class="fa fa-power-off mr1"></i><span>');
var __val__ = t('reboot stack')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><a href="/logs/home" target="_blank" class="btn btn-large"><i class="fa fa-cog mr1"></i> <span>');
var __val__ = t('show home logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="/logs/data-system" target="_blank" class="btn btn-large"><i class="fa fa-cog mr1"></i> <span>');
var __val__ = t('show data system logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><a href="/logs/proxy" target="_blank" class="btn btn-large"><i class="fa fa-cog mr1"></i> <span>');
var __val__ = t('show proxy logs')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div></div><h4 class="title-device h4 mb3">');
var __val__ = t('manage your devices')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4></div><div class="mod left w50"><h4 class="title-app h4 mb3">');
var __val__ = t('manage your applications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/config_device", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="clearfix"><div class="mod"><strong>' + escape((interp = device.login) == null ? '' : interp) + '</strong></div><div class="buttons right"><button class="remove-device btn"><i class="fa fa-trash mr1"></i> <span class="label">');
var __val__ = t('revoke device access')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button></div></div>');
}
return buf.join("");
};
});

require.register("templates/config_device_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("templates/error_modal", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">');
var __val__ = t('app broken title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h3></div></div><div class="md-body"><strong>' + escape((interp = t('app broken')) == null ? '' : interp) + '</strong><a href="#config-applications">' + escape((interp =  t('reinstall broken app')) == null ? '' : interp) + '</a><br/><span>' + escape((interp = t('app msg')) == null ? '' : interp) + '</span><br/><br/><span>' + escape((interp = errortype) == null ? '' : interp) + '</span><br/><br/><button id="more" class="btn">');
var __val__ = t('more details')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><br/><br/><p class="details">');
var __val__ = details
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><div class="md-footer clearfix"><button id="ok" class="btn right">');
var __val__ = t('ok')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("templates/help", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line lightgrey help-section"><div class="mod w50 left pa2"><img src="img/contribute.jpg"/><h4>');
var __val__ = t('help community title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="line"><p class="help-text">');
var __val__ = t('Register and post on our forum: ') + " "
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="https://forum.cozy.io">forum.cozy.io</a></P><p class="help-text">');
var __val__ = t('Chat with us on IRC:') + " "
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="https://webchat.freenode.net/?channels=cozycloud">#cozycloud (irc.freenode.net)</a></P><p class="help-text">');
var __val__ = t('help wiki title') + " "
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="https://github.com/cozy-setup/wiki">github.com/cozy-setup/wiki</a></P></div></div><div class="mod w50 left pa2"><div class="txtcenter"><a href="http://cozy.io" target="_blank"><img src="img/logo-brand.png" class="w350"/></a></div><h4>');
var __val__ = t('help support title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><p class="help-text mt2">');
var __val__ = t('help send message explanation')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><textarea id="send-message-textarea" class="w100 h400"></textarea><button id="send-message-button" class="btn w100">');
var __val__ = t('help send message action')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><div id="send-message-error" class="alert main-alert alert-error w100">');
var __val__ = t('send message error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div id="send-message-success" class="alert main-alert alert-success w100">');
var __val__ = t('send message success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><br/><br/><div class="line"><p class="help-text mt2">');
var __val__ = t('Write an email to our support team at:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="mailto:support@cozycloud.cc">support@cozycloud.cc</a></P><p class="help-text">');
var __val__ = t('Ask your question on Twitter: ') + " "
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="https://twitter.com/mycozycloud">@mycozycloud</a></P></div><h4>');
var __val__ = t('help documentation title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div class="line"><p class="help-text">');
var __val__ = t('Visit the project website and learn to build your app:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><P class="help-text"><a href="https://cozy.io">cozy.io</a></P><p class="help-text">');
var __val__ = t('or:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="help-text"><a href="/home/quicktour" class="wizard">');
var __val__ = t('relaunch install wizard')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></p></div></div><div class="clearfix"></div></div>');
}
return buf.join("");
};
});

require.register("templates/help_url", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><p class="help-text mt2">');
var __val__ = t('The first place to find help is:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="help-text"><a');
buf.push(attrs({ 'href':("" + (helpUrl) + "") }, {"href":true}));
buf.push('>' + escape((interp = helpUrl) == null ? '' : interp) + '</a></p></div>');
}
return buf.join("");
};
});

require.register("templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="no-app-message" class="w600"><div id="start-title" class="darkbg clearfix"><a href="http://cozy.io"><img src="img/happycloud.png" class="logo"/></a><p class="biggest">');
var __val__ = t('welcome to your cozy')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><p class="bigger">');
var __val__ = t('you have no apps')
buf.push(null == __val__ ? "" : __val__);
buf.push('</p><p class="bigger">');
var __val__ = t('noapps.first steps', {wizard:'#home/install', quicktour: '#home/quicktour'})
buf.push(null == __val__ ? "" : __val__);
buf.push('</p><p class="bigger">');
var __val__ = t('noapps.customize your cozy', {account: '#account', appstore: '#applications'})
buf.push(null == __val__ ? "" : __val__);
buf.push('</p></div><div id="app-list"><section id="apps-leave" class="line"><h2>');
var __val__ = t('home section leave')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-main" class="line"><h2>');
var __val__ = t('home section main')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-productivity" class="line"><h2>');
var __val__ = t('home section productivity')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-data" class="line"><h2>');
var __val__ = t('home section data management')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-watch" class="line"><h2>');
var __val__ = t('home section personal watch')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-misc" class="line"><h2>');
var __val__ = t('home section misc')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2></section><section id="apps-platform" class="line show"><h2>');
var __val__ = t('home section platform')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2><div class="application mod w20 left platform-app"><div class="application-inner"><a href="#applications"><img src="img/apps/store.svg" class="icon"/><p class="app-title">');
var __val__ = t('app store')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w20 left platform-app"><div class="application-inner"><a href="#config-applications"><img src="img/apps/state.svg" class="icon svg"/><p class="app-title">');
var __val__ = t('app status')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w20 left platform-app"><div href="#account" class="application-inner"><a href="#account"><img src="img/apps/settings.svg" class="icon svg"/><p class="app-title">');
var __val__ = t('settings')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div><div class="application mod w20 left platform-app"><div href="#help" class="application-inner"><a href="#help"><img src="img/apps/help.svg" class="icon svg"/><p class="app-title">');
var __val__ = t('help')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div></div></section></div>');
}
return buf.join("");
};
});

require.register("templates/home_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="application-inner"><div class="vertical-aligner"><img src="" class="icon"/><img src="/img/spinner.svg" class="spinner"/><p class="app-title">' + escape((interp = app.displayName) == null ? '' : interp) + '</p></div></div>');
}
return buf.join("");
};
});

require.register("templates/layout", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<header id="header" class="navbar"></header><div id="notifications" class="right-menu"><ul id="notifications-list"><li id="no-notif-msg">');
var __val__ = t('you have no notifications')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li></ul></div><div id="notifications-buttons" class="right-menu"><button id="dismiss-all" class="btn"><i class="fa fa-trash mr1"></i><span>');
var __val__ = t('dismiss all')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></button><a id="logout-button" href="#logout" class="btn"><i class="fa fa-sign-out mr1"></i><span>');
var __val__ = t('navbar logout')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a></div><div class="home-body"><div id="app-frames"></div><div id="content"><!-- Preload spinners and hover icons--><img src="/img/spinner.svg" class="hidden"/><img src="/img/spinner-white.svg" class="hidden"/><img src="/img/notification-orange.png" class="hidden"/><div id="home-content"></div></div></div>');
}
return buf.join("");
};
});

require.register("templates/long_list_image", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="viewPort"><div class="thumbs"></div></div><div class="index"></div>');
}
return buf.join("");
};
});

require.register("templates/market", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="platform-section"><p class="mt2">' + escape((interp = t('introduction market')) == null ? '' : interp) + '</p><div id="app-market-list"><div id="market-applications-list" class="clearfix"><div id="no-app-message">');
var __val__ = t('installed everything')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div></div><div class="mt2 mb2"><div id="your-app" class="clearfix"><div class="text"><p>');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('&nbsp;<a href="http://cozy.io/hack/getting-started/" target="_blank">');
var __val__ = t('your own application')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></p><p><input type="text" id="app-git-field" placeholder="https://github.com/username/repository.git@branch" class="span3"/><button class="btn app-install-button">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p><div class="error alert-error"></div><div class="info alert"></div></div></div></div></div><div class="md-overlay"></div>');
}
return buf.join("");
};
});

require.register("templates/market_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="right"><a');
buf.push(attrs({ 'href':("" + (app.git) + "") }, {"href":true}));
buf.push('><img src="img/git.png" class="img-btn"/></a>');
if ( app.website !== undefined)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (app.website) + "") }, {"href":true}));
buf.push('><img src="img/link.png" class="img-btn"/></a>');
}
buf.push('</div><div class="app-img left">');
if ( app.svgSpriteSlug)
{
buf.push('<img');
buf.push(attrs({ "class": (app.svgSpriteSlug) }, {"class":true}));
buf.push('/>');
}
else
{
buf.push('<img');
buf.push(attrs({ 'src':("" + (app.icon) + "") }, {"src":true}));
buf.push('/>');
}
buf.push('<span class="installing-label">');
var __val__ = t("market app install")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div><div class="app-text"><h3>' + escape((interp = app.displayName) == null ? '' : interp) + '</h3><span class="comment">');
var __val__ = t(app.comment)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><p class="par2">');
var __val__ = t(app.description)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div>');
}
return buf.join("");
};
});

require.register("templates/menu_application", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a');
buf.push(attrs({ 'href':("#apps/" + (model.slug) + "/") }, {"href":true}));
buf.push('>' + escape((interp = model.displayName) == null ? '' : interp) + '</a>');
}
return buf.join("");
};
});

require.register("templates/menu_applications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a id="menu-applications-toggle"><span id="current-application"></span></a><div id="menu-applications"><div id="home-btn" class="menu-application"></div></div><div class="clickcatcher"></div>');
}
return buf.join("");
};
});

require.register("templates/navbar", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="navbar clearfix"><div id="notifications-container" class="right"></div><a');
buf.push(attrs({ 'href':("#home"), 'title':("" + (t('navbar back button title')) + ""), "class": ('back-button') + ' ' + ('left') }, {"href":true,"title":true}));
buf.push('><img src="img/back.png"/><span>');
var __val__ = t("navbar back button title")
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><div id="menu-applications-container"></div></div>');
}
return buf.join("");
};
});

require.register("templates/navbar_app_btn", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<li class="app-button"><a');
buf.push(attrs({ 'id':("" + (app.slug) + ""), 'href':("#apps/" + (app.slug) + "") }, {"id":true,"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/apps/" + (app.slug) + "/favicon.ico") }, {"src":true}));
buf.push('/></a></li>');
}
return buf.join("");
};
});

require.register("templates/notification", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a class="dismiss">&times;</a><div class="notification-text">' + escape((interp = model.text) == null ? '' : interp) + '</div><div class="notification-date">' + escape((interp = model.date) == null ? '' : interp) + '</div>');
if ( model.actionText !== undefined && model.actionText !== null)
{
buf.push('<a class="doaction btn">');
var __val__ = t(model.actionText)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
}
return buf.join("");
};
});

require.register("templates/notifications", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<a');
buf.push(attrs({ 'id':('notifications-toggle'), 'title':("" + (t('navbar notifications')) + "") }, {"title":true}));
buf.push('><span class="backcolor"></span><span id="notifications-counter"></span></a><div id="clickcatcher"></div>');
}
return buf.join("");
};
});

require.register("templates/object-picker-photoURL", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="bloc-container"><div class="img-container"><div class="url-preview"></div></div><input');
buf.push(attrs({ 'placeholder':("" + (t('url of an image')) + ""), 'value':(""), "class": ('modal-url-input') }, {"placeholder":true,"value":true}));
buf.push('/></div>');
}
return buf.join("");
};
});

require.register("templates/object-picker-upload", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="photoUpload-btn"><button class="btn">' + escape((interp = t('ObjPicker upload btn')) == null ? '' : interp) + '</button></div><div class="photoUpload-or"><div>' + escape((interp = t('or')) == null ? '' : interp) + '</div></div><div class="modal-file-drop-zone"><p>' + escape((interp = t('drop a file')) == null ? '' : interp) + '</p><div></div></div><input type="file" style="display:none" class="uploader"/>');
}
return buf.join("");
};
});

require.register("templates/object-picker", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<img id="img-result" style="position:fixed"/><!-- never displayed, just for downloading.--><div class="objectPickerCont"><nav class="fp-nav-tabs"><div class="tabMarginTop"></div><div role="tablist" aria-controls="objectPickerCont"></div><div class="tabMarginBottom"></div></nav></div><div class="croperCont"><div class="frame-to-crop"><div id="img-to-crop"></div></div><div class="chooseAgain"><span>' + escape((interp = t('Crop the photo')) == null ? '' : interp) + '</span><a>' + escape((interp = t('chooseAgain')) == null ? '' : interp) + '</a>)</div><div id="frame-preview"><img id="img-preview"/></div></div>');
}
return buf.join("");
};
});

require.register("templates/popover_description", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">' + escape((interp = model.displayName) == null ? '' : interp) + '</h3></div>');
if ( (model.comment !== 'official application'))
{
buf.push('<div class="line noncozy-warning"><i class="fa fa-info-circle"></i><span>');
var __val__ = t('warning unofficial app')
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div>');
}
buf.push('</div><div class="md-body"></div><div class="md-footer clearfix"><button id="confirmbtn" class="btn right">');
var __val__ = t('install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="cancelbtn" class="btn light-btn right">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("templates/popover_permissions", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-header mt2">');
var __val__ = t('Once updated, this application will require the following permissions:')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div class="md-body"><div>&nbsp;</div></div><div class="md-footer mt2">');
if ( model.state === 'broken')
{
buf.push('<a id="confirmbtn" class="btn right">');
var __val__ = t('confirm install')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
else
{
buf.push('<a id="confirmbtn" class="btn right">');
var __val__ = t('confirm update')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
}
buf.push('<a id="cancelbtn" class="btn light-btn right">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></div>');
}
return buf.join("");
};
});

require.register("templates/tutorial", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!--.section-title.darkbg.bigger help--><line class="w800 lightgrey"><h4 class="help-text darkbg pa2">');
var __val__ = t('tutorial title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h4><div id="tuto-files" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question files')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="files-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="files-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-emails" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question emails')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="emails-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="emails-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-calendar" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question calendar')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="calendar-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="calendar-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-contacts" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question contacts')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="contacts-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="contacts-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="tuto-photos" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial question photos')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="center"><button id="photos-no" class="btn">');
var __val__ = t('tutorial no')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="photos-yes" class="btn">');
var __val__ = t('tutorial yes')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></p></div><div id="end-screen" class="line pa2 question"><p class="help-text mt2">');
var __val__ = t('tutorial final headline')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><ul><li><a href="http://cozy.io/mobile/files.html">');
var __val__ = t('tutorial doc files link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li><li><a href="http://cozy.io/mobile/contacts.html">');
var __val__ = t('tutorial doc contacts link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li><li><a href="http://cozy.io/mobile/calendar.html">');
var __val__ = t('tutorial doc calendar link')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li></ul><p class="center"><a href="#home" class="btn">');
var __val__ = t('tutorial final button')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></p></div></line>');
}
return buf.join("");
};
});

require.register("templates/update_stack_modal", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="md-content"><div class="md-header clearfix"><div class="line"><h3 class="left">');
var __val__ = t('update stack modal title')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h3></div></div><div class="md-body"><p class="step1">');
var __val__ = t('update stack modal content')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="step2">');
var __val__ = t('refresh page')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="success">');
var __val__ = t('update stack success')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="error">');
var __val__ = t('update stack error')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></div><div class="md-footer clearfix"><button id="confirmbtn" class="btn right">');
var __val__ = t('update stack modal confirm')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="ok" class="btn right">');
var __val__ = t('ok')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button><button id="cancelbtn" class="btn light-btn right">');
var __val__ = t('cancel')
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</button></div></div>');
}
return buf.join("");
};
});

require.register("views/account", function(exports, require, module) {
var Background, BackgroundList, BaseView, Instance, ObjectPicker, locales, request, timezones, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

Background = require('../models/background');

timezones = require('helpers/timezone').timezones;

locales = require('helpers/locales').locales;

request = require('lib/request');

BackgroundList = require('views/background_list');

Instance = require('models/instance');

ObjectPicker = require('./object-picker');

module.exports = exports.AccountView = (function(_super) {
  __extends(AccountView, _super);

  function AccountView() {
    this.onBackgroundChanged = __bind(this.onBackgroundChanged, this);
    this.displayErrors = __bind(this.displayErrors, this);
    this.onNewPasswordSubmit = __bind(this.onNewPasswordSubmit, this);
    _ref = AccountView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AccountView.prototype.id = 'account-view';

  AccountView.prototype.template = require('templates/account');

  AccountView.prototype.events = {
    'click #background-add-button': 'onAddBackgroundClicked'
  };

  AccountView.prototype.afterRender = function() {
    var timezone, _i, _len,
      _this = this;
    this.emailField = this.$('#account-email-field');
    this.publicNameField = this.$('#account-public-name-field');
    this.timezoneField = this.$('#account-timezone-field');
    this.domainField = this.$('#account-domain-field');
    this.localeField = this.$('#account-locale-field');
    this.infoAlert = this.$('#account-info');
    this.infoAlert.hide();
    this.errorAlert = this.$('#account-error');
    this.errorAlert.hide();
    this.changePasswordForm = this.$('#change-password-form');
    this.accountSubmitButton = this.$('#account-form-button');
    this.accountSubmitButton.click(function(event) {
      event.preventDefault();
      return _this.onNewPasswordSubmit();
    });
    for (_i = 0, _len = timezones.length; _i < _len; _i++) {
      timezone = timezones[_i];
      this.timezoneField.append("<option value=\"" + timezone + "\">" + timezone + "</option>");
    }
    this.backgroundList = new BackgroundList({
      el: this.$('.background-list')
    });
    this.backgroundList.collection.on('change', this.onBackgroundChanged);
    this.backgroundAddButton = this.$('#background-add-button');
    return this.fetchData();
  };

  AccountView.prototype.onNewPasswordSubmit = function(event) {
    var form,
      _this = this;
    form = {
      password0: this.password0Field.val(),
      password1: this.password1Field.val(),
      password2: this.password2Field.val()
    };
    this.infoAlert.hide();
    this.errorAlert.hide();
    this.accountSubmitButton.spin(true);
    return request.post('api/user', form, function(err, data) {
      if (err) {
        _this.password0Field.val(null);
        _this.password1Field.val(null);
        _this.password2Field.val(null);
        if (data != null) {
          _this.displayErrors(data.msg);
        } else {
          _this.displayErrors(err.message);
        }
      } else {
        if (data.success) {
          _this.infoAlert.html(data.msg);
          _this.infoAlert.show();
          _this.password0Field.val(null);
          _this.password1Field.val(null);
          _this.password2Field.val(null);
        } else {
          _this.displayErrors(data.msg);
        }
      }
      return _this.accountSubmitButton.spin(false);
    });
  };

  AccountView.prototype.displayErrors = function(msgs) {
    var errorString, msg, _i, _len;
    errorString = "";
    if (typeof msgs === 'string') {
      msgs = msgs.split(',');
    }
    for (_i = 0, _len = msgs.length; _i < _len; _i++) {
      msg = msgs[_i];
      errorString += "" + msg + "<br />";
    }
    this.errorAlert.html(errorString);
    return this.errorAlert.show();
  };

  AccountView.prototype.getSaveFunction = function(fieldName, fieldWidget, path) {
    var saveButton, saveFunction;
    saveButton = fieldWidget.parent().find('.btn');
    saveFunction = function() {
      var data;
      saveButton.spin(true);
      data = {};
      data[fieldName] = fieldWidget.val();
      return request.post("api/" + path, data, function(err) {
        saveButton.spin(false);
        if (err) {
          saveButton.addClass('red');
          return saveButton.html('error');
        } else {
          saveButton.addClass('green');
          saveButton.html(t('saved'));
          if (fieldName === 'locale') {
            alert(t('changing locale requires reload'));
            window.location.reload();
          }
          return setTimeout(function() {
            if (fieldName === 'locale') {
              return window.location.reload();
            }
          }, 1000);
        }
      });
    };
    saveButton.click(saveFunction);
    return saveFunction;
  };

  AccountView.prototype.fetchData = function() {
    var domain, instance, locale, saveDomain, saveEmail, saveLocale, savePublicName, saveTimezone, userData,
      _this = this;
    userData = window.cozy_user || {};
    this.emailField.val(userData.email);
    this.publicNameField.val(userData.public_name);
    this.timezoneField.val(userData.timezone);
    saveEmail = this.getSaveFunction('email', this.emailField, 'user');
    this.emailField.on('keyup', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return saveEmail();
      }
    });
    savePublicName = this.getSaveFunction('public_name', this.publicNameField, 'user');
    this.publicNameField.on('keyup', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return savePublicName();
      }
    });
    saveTimezone = this.getSaveFunction('timezone', this.timezoneField, 'user');
    this.timezoneField.change(saveTimezone);
    instance = window.cozy_instance || {};
    this.instance = new Instance(instance);
    domain = (instance != null ? instance.domain : void 0) || t('no domain set');
    locale = (instance != null ? instance.locale : void 0) || 'en';
    saveDomain = this.getSaveFunction('domain', this.domainField, 'instance');
    this.domainField.on('keyup', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return saveDomain();
      }
    });
    this.domainField.val(domain);
    saveLocale = this.getSaveFunction('locale', this.localeField, 'instance');
    this.localeField.change(saveLocale);
    this.localeField.val(locale);
    this.password0Field = this.$('#account-password0-field');
    this.password1Field = this.$('#account-password1-field');
    this.password2Field = this.$('#account-password2-field');
    this.password0Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.password1Field.focus();
      }
    });
    this.password1Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.password2Field.focus();
      }
    });
    return this.password2Field.keyup(function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        return _this.onNewPasswordSubmit();
      }
    });
  };

  AccountView.prototype.onAddBackgroundClicked = function() {
    var params,
      _this = this;
    params = {
      type: 'singlePhoto'
    };
    return new ObjectPicker(params, function(newPhotoChosen, dataUrl) {
      var array, binary, blob, form, i, _i, _ref1;
      _this.backgroundAddButton.spin(true);
      if (dataUrl != null) {
        binary = atob(dataUrl.split(',')[1]);
        array = [];
        for (i = _i = 0, _ref1 = binary.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          array.push(binary.charCodeAt(i));
        }
        blob = new Blob([new Uint8Array(array)], {
          type: 'image/jpeg'
        });
        form = new FormData();
        form.append('picture', blob);
        return $.ajax({
          type: "POST",
          url: "/api/backgrounds",
          data: form,
          contentType: false,
          processData: false,
          success: function(data) {
            var background;
            background = new Background(data);
            return _this.backgroundList.collection.add(background);
          },
          error: function(data) {
            return alert(t('account background added error'));
          },
          complete: function() {
            return _this.backgroundAddButton.spin(false);
          }
        });
      }
    });
  };

  AccountView.prototype.onBackgroundChanged = function(model) {
    var data;
    data = {
      background: model.get('id')
    };
    return this.instance.saveData(data, function(err) {
      if (err) {
        return alert(t('account background saved error'));
      } else {
        return Backbone.Mediator.pub('backgroundChanged', data.background);
      }
    });
  };

  return AccountView;

})(BaseView);
});

;require.register("views/background_list", function(exports, require, module) {
var BackgroundCollection, BackgroundList, BackgroundListItem, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

BackgroundListItem = require('views/background_list_item');

BackgroundCollection = require('collections/background');

module.exports = BackgroundList = (function(_super) {
  __extends(BackgroundList, _super);

  function BackgroundList() {
    _ref = BackgroundList.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundList.prototype.itemView = BackgroundListItem;

  BackgroundList.prototype.template = require('templates/background_list');

  BackgroundList.prototype.collection = new BackgroundCollection;

  BackgroundList.prototype.events = {};

  BackgroundList.prototype.afterRender = function() {
    var _this = this;
    this.collection.init();
    return this.collection.on('change', function(changedModel) {
      return _this.collection.map(function(model) {
        if (changedModel.cid !== model.cid) {
          model.set({
            'selected': false
          }, {
            silent: true
          });
          return _this.views[model.cid].$el.removeClass('selected');
        }
      });
    });
  };

  return BackgroundList;

})(ViewCollection);
});

;require.register("views/background_list_item", function(exports, require, module) {
var BackgroundListItem, BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = BackgroundListItem = (function(_super) {
  __extends(BackgroundListItem, _super);

  function BackgroundListItem() {
    _ref = BackgroundListItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BackgroundListItem.prototype.className = "mod w33 left background-button";

  BackgroundListItem.prototype.tagName = "div";

  BackgroundListItem.prototype.template = require('templates/background_list_item');

  BackgroundListItem.prototype.events = {
    'click .delete-background-button': 'onDeleteClicked',
    'click': 'onClicked'
  };

  BackgroundListItem.prototype.getRenderData = function() {
    return {
      model: {
        src: this.model.getThumbSrc()
      }
    };
  };

  BackgroundListItem.prototype.afterRender = function() {
    var _this = this;
    this.deleteButton = this.$('.background-delete');
    if (this.model.get('predefined')) {
      this.deleteButton.hide();
    }
    return this.model.on('change', function() {
      if (_this.model.get('selected')) {
        return _this.$el.addClass('selected');
      }
    });
  };

  BackgroundListItem.prototype.onClicked = function() {
    return this.model.set('selected', true);
  };

  BackgroundListItem.prototype.onDeleteClicked = function() {
    this.deleteButton.spin(true);
    return this.model.destroy();
  };

  return BackgroundListItem;

})(BaseView);
});

;require.register("views/config_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, PopoverDescriptionView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

PopoverDescriptionView = require('views/popover_description');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.className = "line config-application clearfix";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/config_application');

  ApplicationRow.prototype.getRenderData = function() {
    var gitName;
    gitName = this.model.get('git');
    if (gitName != null) {
      gitName = gitName.slice(0, -4);
    }
    return {
      app: _.extend({}, this.model.attributes, {
        website: this.model.get('website') || gitName
      })
    };
  };

  ApplicationRow.prototype.events = {
    "click .remove-app": "onRemoveClicked",
    "click .update-app": "onUpdateClicked",
    "click .start-stop-btn": "onStartStopClicked",
    "click .app-stoppable": "onStoppableClicked"
  };

  /* Constructor*/


  function ApplicationRow(options) {
    this.remove = __bind(this.remove, this);
    this.onStartStopClicked = __bind(this.onStartStopClicked, this);
    this.onUpdateClicked = __bind(this.onUpdateClicked, this);
    this.onRemoveClicked = __bind(this.onRemoveClicked, this);
    this.onStoppableClicked = __bind(this.onStoppableClicked, this);
    this.onAppChanged = __bind(this.onAppChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.id = "app-btn-" + options.model.id;
    ApplicationRow.__super__.constructor.apply(this, arguments);
  }

  ApplicationRow.prototype.initialize = function() {
    return this.listenTo(this.model, 'change:version', this.render);
  };

  ApplicationRow.prototype.afterRender = function() {
    this.updateButton = new ColorButton(this.$(".update-app"));
    this.removeButton = new ColorButton(this.$(".remove-app"));
    this.startStopBtn = new ColorButton(this.$(".start-stop-btn"));
    this.stateLabel = this.$('.state-label');
    this.updateIcon = this.$('.update-notification-icon');
    this.appStoppable = this.$(".app-stoppable");
    this.listenTo(this.model, 'change', this.onAppChanged);
    return this.onAppChanged(this.model);
  };

  /* Listener*/


  ApplicationRow.prototype.onAppChanged = function(app) {
    var bool;
    switch (this.model.get('state')) {
      case 'broken':
        this.stateLabel.show().text(t('broken'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('retry to install'));
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.hide();
        break;
      case 'installed':
        this.stateLabel.show().text(t('started'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('update'));
        this.appStoppable.show();
        this.appStoppable.next().show();
        this.startStopBtn.displayGrey(t('stop this app'));
        break;
      case 'installing':
        this.stateLabel.show().text(t('installing'));
        this.removeButton.displayGrey(t('abort'));
        this.updateButton.hide();
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.hide();
        break;
      case 'stopped':
        this.stateLabel.show().text(t('stopped'));
        this.removeButton.displayGrey(t('remove'));
        this.updateButton.displayGrey(t('update'));
        this.appStoppable.hide();
        this.appStoppable.next().hide();
        this.startStopBtn.displayGrey(t('start this app'));
    }
    this.updateIcon.toggle(this.model.get('needsUpdate'));
    this.$(".update-app").toggle(!this.model.get('needsUpdate'));
    bool = this.model.get('isStoppable');
    return this.$('.app-stoppable').attr('checked', bool);
  };

  ApplicationRow.prototype.onStoppableClicked = function(event) {
    var bool,
      _this = this;
    bool = !this.model.get('isStoppable');
    return this.model.save({
      isStoppable: bool
    }, {
      success: function() {
        return _this.$('.app-stoppable').attr('checked', bool);
      },
      error: function() {
        return _this.$('.app-stoppable').attr('checked', !bool);
      }
    });
  };

  ApplicationRow.prototype.onRemoveClicked = function(event) {
    var _this = this;
    event.preventDefault();
    this.removeButton.spin(true);
    this.stateLabel.html(t('removing'));
    return this.model.uninstall({
      success: function() {
        _this.remove();
        return Backbone.Mediator.pub('app-state-changed', true);
      },
      error: function() {
        _this.removeButton.displayRed(t("retry to install"));
        return Backbone.Mediator.pub('app-state-changed', true);
      }
    });
  };

  ApplicationRow.prototype.onUpdateClicked = function(event) {
    event.preventDefault();
    return this.openPopover();
  };

  ApplicationRow.prototype.openPopover = function() {
    var _this = this;
    if (this.popover != null) {
      this.popover.hide();
    }
    this.popover = new PopoverDescriptionView({
      model: this.model,
      label: t('update'),
      confirm: function(application) {
        $('#no-app-message').hide();
        _this.popover.hide();
        _this.popover.remove();
        return _this.updateApp();
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.popover.remove();
      }
    });
    $("#config-applications-view").append(this.popover.$el);
    return this.popover.show();
  };

  ApplicationRow.prototype.onStartStopClicked = function(event) {
    var _this = this;
    event.preventDefault();
    this.startStopBtn.spin(true);
    if (this.model.isRunning()) {
      return this.model.stop({
        success: function() {
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          return Backbone.Mediator.pub('app-state-changed', true);
        },
        error: function() {
          return _this.startStopBtn.spin(false);
        }
      });
    } else {
      return this.model.start({
        success: function() {
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('started'));
          return Backbone.Mediator.pub('app-state-changed', true);
        },
        error: function() {
          var errormsg, msg;
          _this.startStopBtn.spin(false);
          _this.stateLabel.html(t('stopped'));
          Backbone.Mediator.pub('app-state-changed', true);
          msg = 'This app cannot start.';
          errormsg = _this.model.get('errormsg');
          if (errormsg) {
            msg += " Error was : " + errormsg;
          }
          return alert(msg);
        }
      });
    }
  };

  ApplicationRow.prototype.remove = function() {
    var _this = this;
    if (this.model.get('state') !== 'installed') {
      return ApplicationRow.__super__.remove.apply(this, arguments);
    }
    this.removeButton.spin(false);
    this.removeButton.displayGreen(t("removed"));
    return setTimeout(function() {
      return _this.$el.fadeOut(function() {
        return ApplicationRow.__super__.remove.apply(_this, arguments);
      });
    }, 1000);
  };

  ApplicationRow.prototype.updateApp = function() {
    var _this = this;
    Backbone.Mediator.pub('app-state-changed', true);
    this.updateButton.spin(true);
    if (this.model.get('state') !== 'broken') {
      this.stateLabel.html(t('updating'));
    } else {
      this.stateLabel.html(t("installing"));
    }
    return this.model.updateApp({
      success: function() {
        _this.updateButton.spin(false);
        if (_this.model.get('state') === 'installed') {
          _this.updateButton.displayGreen(t("updated"));
          _this.stateLabel.html(t('started'));
          Backbone.Mediator.pub('app-state-changed', true);
        }
        if (_this.model.get('state') === 'stopped') {
          _this.updateButton.displayGreen(t("updated"));
          _this.stateLabel.html(t('stopped'));
          return Backbone.Mediator.pub('app-state-changed', true);
        }
      },
      error: function(jqXHR) {
        _this.updateButton.spin(false);
        alert(t('update error'));
        _this.stateLabel.html(t('broken'));
        _this.updateButton.displayRed(t("update failed"));
        return Backbone.Mediator.pub('app-state-changed', true);
      }
    });
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/config_application_list", function(exports, require, module) {
var ApplicationRow, ApplicationsList, ApplicationsListView, PopoverDescriptionView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

ApplicationRow = require('views/config_application');

PopoverDescriptionView = require('views/popover_description');

ApplicationsList = require('../collections/application');

module.exports = ApplicationsListView = (function(_super) {
  __extends(ApplicationsListView, _super);

  ApplicationsListView.prototype.id = 'config-application-list';

  ApplicationsListView.prototype.tagName = 'div';

  ApplicationsListView.prototype.template = require('templates/config_application_list');

  ApplicationsListView.prototype.itemView = require('views/config_application');

  ApplicationsListView.prototype.itemViewOptions = function(model) {
    var app, comment;
    app = this.market.get(model.get('slug'));
    comment = app != null ? app.get('comment') : 'community contribution';
    return model.set('comment', comment);
  };

  function ApplicationsListView(apps, market) {
    this.afterRender = __bind(this.afterRender, this);
    this.apps = apps;
    this.market = market;
    ApplicationsListView.__super__.constructor.call(this, {
      collection: this.apps
    });
  }

  ApplicationsListView.prototype.afterRender = function() {
    return this.appList = this.$("#app-list");
  };

  ApplicationsListView.prototype.appendView = function(view) {
    var index, previous, sortedViews, views;
    if (this.$el.is(':empty')) {
      return this.$el.append(view.el);
    } else {
      views = _.values(this.views);
      sortedViews = _.sortBy(views, function(view) {
        var _ref;
        if ((view != null ? (_ref = view.model) != null ? _ref.get('displayName') : void 0 : void 0) != null) {
          return view.model.get('displayName').toLowerCase();
        } else {
          return 'unknown';
        }
      });
      index = _.indexOf(sortedViews, view) - 1;
      if (index >= 0) {
        previous = this.$el.find(".config-application:eq(" + index + ")");
        return view.$el.insertAfter(previous);
      }
    }
  };

  ApplicationsListView.prototype.openUpdatePopover = function(slug) {
    var appToUpdateView, cids, i, view;
    appToUpdateView = null;
    cids = Object.keys(this.views);
    i = 0;
    while ((cids[i] != null) && (appToUpdateView == null)) {
      view = this.views[cids[i]];
      if (view.model.get('slug') === slug) {
        appToUpdateView = view;
      }
      i++;
    }
    if (appToUpdateView != null) {
      return appToUpdateView.openPopover();
    } else {
      return alert(t('error update uninstalled app'));
    }
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/config_applications", function(exports, require, module) {
var Application, AppsCollection, BaseView, ColorButton, ConfigApplicationList, ConfigApplicationsView, ConfigDeviceList, StackApplication, UpdateStackModal, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

Application = require('models/application');

StackApplication = require('models/stack_application');

ConfigApplicationList = require('./config_application_list');

ConfigDeviceList = require('./config_device_list');

UpdateStackModal = require('./update_stack_modal');

AppsCollection = require('../collections/application');

module.exports = ConfigApplicationsView = (function(_super) {
  __extends(ConfigApplicationsView, _super);

  ConfigApplicationsView.prototype.id = 'config-applications-view';

  ConfigApplicationsView.prototype.template = require('templates/config_applications');

  ConfigApplicationsView.prototype.subscriptions = {
    'app-state-changed': 'onAppStateChanged'
  };

  ConfigApplicationsView.prototype.events = {
    "click .update-all": "onUpdateClicked",
    "click .update-stack": "onUpdateStackClicked",
    "click .reboot-stack": "onRebootStackClicked"
  };

  function ConfigApplicationsView(apps, devices, stackApps, market) {
    this.apps = apps;
    this.devices = devices;
    this.stackApps = stackApps;
    this.market = market;
    this.fetch = __bind(this.fetch, this);
    this.displayDevices = __bind(this.displayDevices, this);
    this.displayStackVersion = __bind(this.displayStackVersion, this);
    this.listenTo(this.devices, 'reset', this.displayDevices);
    this.listenTo(this.stackApps, 'reset', this.displayStackVersion);
    ConfigApplicationsView.__super__.constructor.call(this);
  }

  ConfigApplicationsView.prototype.afterRender = function() {
    this.spanRefresh = this.$('.refresh');
    this.spanRefresh.hide();
    this.memoryFree = this.$('.memory-free');
    this.diskSpace = this.$('.disk-space');
    this.updateBtn = new ColorButton(this.$('.update-all'));
    this.updateStackBtn = new ColorButton(this.$('.update-stack'));
    this.rebootStackBtn = new ColorButton(this.$('.reboot-stack'));
    this.fetch();
    this.applicationList = new ConfigApplicationList(this.apps, this.market);
    this.deviceList = new ConfigDeviceList(this.devices);
    this.$el.find('.title-app').after(this.applicationList.$el);
    this.applications = new Application();
    this.stackApps.fetch({
      reset: true
    });
    return this.displayDevices();
  };

  ConfigApplicationsView.prototype.openUpdatePopover = function(slug) {
    return this.applicationList.openUpdatePopover(slug);
  };

  ConfigApplicationsView.prototype.displayStackVersion = function() {
    var app, currentVersion, lastVersion, newVersion, _i, _len, _ref, _results;
    _ref = this.stackApps.models;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      app = _ref[_i];
      this.$("." + (app.get('name'))).html(app.get('version'));
      currentVersion = app.get('version').split('.');
      lastVersion = app.get('lastVersion') || '0.0.0';
      newVersion = lastVersion.split('.');
      if (parseInt(currentVersion[2]) < parseInt(newVersion[2])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        this.$("." + (app.get('name'))).css('color', "Orange");
      }
      if (parseInt(currentVersion[1]) < parseInt(newVersion[1])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        this.$("." + (app.get('name'))).css('color', "OrangeRed");
      }
      if (parseInt(currentVersion[0]) < parseInt(newVersion[0])) {
        this.$("." + (app.get('name'))).css('font-weight', "bold");
        _results.push(this.$("." + (app.get('name'))).css('color', "Red"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ConfigApplicationsView.prototype.displayDevices = function() {
    if (!(this.devices.length === 0)) {
      return this.$el.find('.title-device').after(this.deviceList.$el);
    } else {
      return this.$el.find('.title-device').after("<p>" + (t('status no device')) + "</p>");
    }
  };

  ConfigApplicationsView.prototype.fetch = function() {
    var _this = this;
    this.$('.amount').html("--");
    this.$('.total').html("--");
    return request.get('api/sys-data', function(err, data) {
      if (err) {
        return alert(t('Server error occured, infos cannot be displayed.'));
      } else {
        _this.displayMemory(data.freeMem, data.totalMem);
        return _this.displayDiskSpace(data.usedDiskSpace, data.totalDiskSpace, data.unit);
      }
    });
  };

  ConfigApplicationsView.prototype.displayMemory = function(amount, total) {
    this.memoryFree.find('.amount').html(Math.floor((total - amount) / 1000));
    return this.memoryFree.find('.total').html(Math.floor(total / 1000));
  };

  ConfigApplicationsView.prototype.displayDiskSpace = function(amount, total, unit) {
    this.diskSpace.find('.amount').html(amount);
    return this.diskSpace.find('.total').html("" + total + " " + (unit || 'G'));
  };

  ConfigApplicationsView.prototype.onAppStateChanged = function() {
    return setTimeout(this.fetch, 10000);
  };

  ConfigApplicationsView.prototype.popoverManagement = function(action) {
    var _this = this;
    if (this.popover != null) {
      this.popover.hide();
    }
    this.popover = new UpdateStackModal({
      confirm: function(application) {
        return action({
          success: function() {
            return _this.popover.onSuccess();
          },
          error: function(err) {
            return _this.popover.onError(err.responseText);
          }
        });
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.popover.remove();
      },
      end: function(success) {
        if (success) {
          return location.reload();
        }
      }
    });
    $("#config-applications-view").append(this.popover.$el);
    return this.popover.show();
  };

  ConfigApplicationsView.prototype.onUpdateClicked = function() {
    var action,
      _this = this;
    action = function(cb) {
      var error, success, _ref;
      _ref = cb || {}, success = _ref.success, error = _ref.error;
      return _this.applications.updateAll({
        success: function() {
          return _this.stackApplications.updateStack(cb);
        },
        error: function(err) {
          return _this.stackApplications.updateStack({
            success: function() {
              if (error) {
                return error(err);
              } else {
                return success("ok");
              }
            },
            error: function(stack_err) {
              err.stack = stack_err;
              if (error) {
                return error(err);
              }
            }
          });
        }
      });
    };
    return this.popoverManagement(action);
  };

  ConfigApplicationsView.prototype.onUpdateStackClicked = function() {
    var action,
      _this = this;
    action = function(cb) {
      return _this.stackApplications.updateStack(cb);
    };
    return this.popoverManagement(action);
  };

  ConfigApplicationsView.prototype.onRebootStackClicked = function() {
    this.rebootStackBtn.spin(true);
    this.spanRefresh.show();
    return this.stackApplications.rebootStack(function() {
      return location.reload();
    });
  };

  return ConfigApplicationsView;

})(BaseView);
});

;require.register("views/config_device", function(exports, require, module) {
var BaseView, DeviceRow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = DeviceRow = (function(_super) {
  __extends(DeviceRow, _super);

  DeviceRow.prototype.className = "line config-device clearfix";

  DeviceRow.prototype.tagName = "div";

  DeviceRow.prototype.template = require('templates/config_device');

  DeviceRow.prototype.events = {
    'click .remove-device': 'onRemoveClicked'
  };

  DeviceRow.prototype.getRenderData = function() {
    return {
      device: this.model.attributes
    };
  };

  function DeviceRow(options) {
    this.model = options.model;
    this.id = "device-btn-" + options.model.id;
    DeviceRow.__super__.constructor.apply(this, arguments);
  }

  DeviceRow.prototype.onRemoveClicked = function(event) {
    var _this = this;
    if (window.confirm(t('revoke device confirmation message'))) {
      $(event.currentTarget).spin(true);
      return $.ajax("/api/devices/" + (this.model.get('id')), {
        type: "DELETE",
        success: function() {
          return _this.$el.fadeOut(function() {
            _this.model.destroy();
            return _this.destroy();
          });
        },
        error: function() {
          _this.$('.remove-device').html(t('revoke device access'));
          return console.log("error while revoking the device access");
        }
      });
    }
  };

  return DeviceRow;

})(BaseView);
});

;require.register("views/config_device_list", function(exports, require, module) {
var DeviceRow, DevicesListView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

DeviceRow = require('views/config_device');

module.exports = DevicesListView = (function(_super) {
  __extends(DevicesListView, _super);

  DevicesListView.prototype.id = 'config-device-list';

  DevicesListView.prototype.tagName = 'div';

  DevicesListView.prototype.template = require('templates/config_device_list');

  DevicesListView.prototype.itemView = require('views/config_device');

  function DevicesListView(devices) {
    this.afterRender = __bind(this.afterRender, this);
    this.devices = devices;
    DevicesListView.__super__.constructor.call(this, {
      collection: devices
    });
  }

  DevicesListView.prototype.afterRender = function() {
    return this.deviceList = this.$("#device-list");
  };

  return DevicesListView;

})(ViewCollection);
});

;require.register("views/error_modal", function(exports, require, module) {
var BaseView, UpdateStackModal, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = UpdateStackModal = (function(_super) {
  __extends(UpdateStackModal, _super);

  function UpdateStackModal() {
    this.onKeyStroke = __bind(this.onKeyStroke, this);
    _ref = UpdateStackModal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UpdateStackModal.prototype.id = 'market-popover-description-view';

  UpdateStackModal.prototype.className = 'modal md-modal md-effect-1';

  UpdateStackModal.prototype.tagName = 'div';

  UpdateStackModal.prototype.template = require('templates/error_modal');

  UpdateStackModal.prototype.events = {
    'click #more': 'onMore',
    'click #ok': 'onClose'
  };

  UpdateStackModal.prototype.initialize = function(options) {
    this.errortype = options.errortype;
    this.details = options.details;
    UpdateStackModal.__super__.initialize.apply(this, arguments);
    return $('body').keyup(this.onKeyStroke);
  };

  UpdateStackModal.prototype.getRenderData = function() {
    return {
      errortype: this.errortype,
      details: this.details
    };
  };

  UpdateStackModal.prototype.afterRender = function() {
    var _this = this;
    this.overlay = $('.md-overlay');
    this.overlay.click(function() {
      return _this.hide();
    });
    this.$('.details').hide();
    return this.body = this.$(".md-body");
  };

  UpdateStackModal.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  UpdateStackModal.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    $('#home-content').addClass('md-open');
    return setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
  };

  UpdateStackModal.prototype.hide = function() {
    var _this = this;
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    return $('#home-content').removeClass('md-open');
  };

  UpdateStackModal.prototype.onClose = function() {
    return this.hide();
  };

  UpdateStackModal.prototype.onKeyStroke = function(e) {
    var _ref1;
    e.stopPropagation();
    if ((_ref1 = e.which) === 13 || _ref1 === 27) {
      return this.onClose();
    }
  };

  UpdateStackModal.prototype.onMore = function() {
    if (this.$('.details').css('display') === 'none') {
      return this.$('.details').show();
    } else {
      return this.$('.details').hide();
    }
  };

  return UpdateStackModal;

})(BaseView);
});

;require.register("views/help", function(exports, require, module) {
var BaseView, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

module.exports = exports.HelpView = (function(_super) {
  __extends(HelpView, _super);

  function HelpView() {
    this.onSendMessageClicked = __bind(this.onSendMessageClicked, this);
    _ref = HelpView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HelpView.prototype.id = 'help-view';

  HelpView.prototype.template = require('templates/help');

  HelpView.prototype.events = {
    'click .wizard': 'displayWizard',
    'click #send-message-button': 'onSendMessageClicked'
  };

  HelpView.prototype.afterRender = function() {
    this.sendMessageButton = this.$('#send-message-button');
    this.sendMessageInput = this.$('#send-message-textarea');
    this.alertMessageError = this.$('#send-message-error');
    this.alertMessageSuccess = this.$('#send-message-success');
    return this.configureHelpUrl();
  };

  HelpView.prototype.configureHelpUrl = function() {
    var helpUrl, template, _ref1;
    helpUrl = (_ref1 = window.app.instance) != null ? _ref1.helpUrl : void 0;
    if (helpUrl != null) {
      template = require('templates/help_url');
      return $(this.$el.find('.line')[1]).prepend(template({
        helpUrl: helpUrl
      }));
    }
  };

  HelpView.prototype.displayWizard = function(event) {
    var dest;
    event.preventDefault();
    dest = event.target.getAttribute('href');
    return window.app.routers.main.navigate(dest, {
      trigger: true
    });
  };

  HelpView.prototype.onSendMessageClicked = function() {
    var messageText,
      _this = this;
    this.alertMessageError.hide();
    this.alertMessageSuccess.hide();
    messageText = this.sendMessageInput.val();
    if (messageText.length > 0) {
      this.sendMessageButton.spin(true);
      return request.post("help/message", {
        messageText: messageText
      }, function(err) {
        _this.sendMessageButton.spin(false);
        if (err) {
          return _this.alertMessageError.show();
        } else {
          return _this.alertMessageSuccess.show();
        }
      });
    }
  };

  return HelpView;

})(BaseView);
});

;require.register("views/home", function(exports, require, module) {
var ApplicationsListView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

module.exports = ApplicationsListView = (function(_super) {
  __extends(ApplicationsListView, _super);

  ApplicationsListView.prototype.id = 'applications-view';

  ApplicationsListView.prototype.template = require('templates/home');

  ApplicationsListView.prototype.itemView = require('views/home_application');

  /* Constructor*/


  function ApplicationsListView(apps, market) {
    this.onAppRemoved = __bind(this.onAppRemoved, this);
    this.afterRender = __bind(this.afterRender, this);
    this.initialize = __bind(this.initialize, this);
    var _this = this;
    this.apps = apps;
    this.market = market;
    this.state = 'view';
    this.isLoading = true;
    this.itemViewOptions = function() {
      return {
        market: _this.market
      };
    };
    ApplicationsListView.__super__.constructor.call(this, {
      collection: apps
    });
  }

  ApplicationsListView.prototype.initialize = function() {
    var _this = this;
    this.listenTo(this.collection, 'request', function() {
      return _this.isLoading = true;
    });
    this.listenTo(this.collection, 'reset', function() {
      return _this.isLoading = false;
    });
    this.collection.on('remove', this.onAppRemoved);
    return ApplicationsListView.__super__.initialize.apply(this, arguments);
  };

  ApplicationsListView.prototype.afterRender = function() {
    var _this = this;
    this.$("#no-app-message").hide();
    $(".menu-btn a").click(function(event) {
      $(".menu-btn").removeClass('active');
      return $(event.target).closest('.menu-btn').addClass('active');
    });
    return ApplicationsListView.__super__.afterRender.apply(this, arguments);
  };

  ApplicationsListView.prototype.checkIfEmpty = function() {
    var noapps;
    noapps = this.apps.size() === 0 && !this.isLoading;
    this.$("#no-app-message").toggle(noapps);
    if (noapps) {
      return window.app.routers.main.navigate('home/install', {
        trigger: true
      });
    }
  };

  ApplicationsListView.prototype.appendView = function(view) {
    var section, sectionName;
    sectionName = view.model.getSection();
    section = this.$("section#apps-" + sectionName);
    section.append(view.$el);
    section.addClass('show');
    return section.show();
  };

  ApplicationsListView.prototype.onAppRemoved = function(model) {
    var section, sectionName;
    sectionName = model.getSection();
    section = this.$("section#apps-" + sectionName);
    if (section.children().length === 2) {
      return section.hide();
    }
  };

  return ApplicationsListView;

})(ViewCollection);
});

;require.register("views/home_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, Modal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

Modal = require('./error_modal');

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.className = "application w20 mod left";

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.template = require('templates/home_application');

  ApplicationRow.prototype.getRenderData = function() {
    return {
      app: this.model.attributes
    };
  };

  ApplicationRow.prototype.events = {
    "mouseup .application-inner": "onAppClicked",
    "mouseover .application-inner": "onMouseOver",
    "mouseout .application-inner": "onMouseOut"
  };

  /* Constructor*/


  ApplicationRow.prototype.onMouseOver = function() {
    return this.background.css('background-color', '#FF9D3B');
  };

  ApplicationRow.prototype.onMouseOut = function() {
    return this.background.css('background-color', this.color || 'transparent');
  };

  function ApplicationRow(options) {
    this.showSpinner = __bind(this.showSpinner, this);
    this.launchApp = __bind(this.launchApp, this);
    this.onAppClicked = __bind(this.onAppClicked, this);
    this.onAppChanged = __bind(this.onAppChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.id = "app-btn-" + options.model.id;
    this.enabled = true;
    ApplicationRow.__super__.constructor.apply(this, arguments);
    this.inMarket = options.market.findWhere({
      slug: this.model.get('slug')
    });
  }

  ApplicationRow.prototype.afterRender = function() {
    this.icon = this.$('img.icon');
    this.stateLabel = this.$('.state-label');
    this.title = this.$('.app-title');
    this.background = this.$('img');
    this.listenTo(this.model, 'change', this.onAppChanged);
    this.onAppChanged(this.model);
    if (this.model.isIconSvg()) {
      this.setBackgroundColor();
      return this.icon.addClass('svg');
    }
  };

  /* Listener*/


  ApplicationRow.prototype.onAppChanged = function(app) {
    var extension;
    switch (this.model.get('state')) {
      case 'broken':
        this.hideSpinner();
        this.icon.show();
        this.icon.attr('src', "img/broken.png");
        return this.stateLabel.show().text(t('broken'));
      case 'installed':
        this.hideSpinner();
        if (this.model.isIconSvg()) {
          this.setBackgroundColor();
          extension = 'svg';
          this.icon.addClass('svg');
        } else {
          extension = 'png';
          this.icon.removeClass('svg');
        }
        this.icon.attr('src', "api/applications/" + app.id + "." + extension);
        this.icon.hide();
        this.icon.show();
        this.icon.removeClass('stopped');
        return this.stateLabel.hide();
      case 'installing':
        this.icon.hide();
        this.showSpinner();
        this.stateLabel.show().text('installing');
        return this.setBackgroundColor();
      case 'stopped':
        if (this.model.isIconSvg()) {
          extension = 'svg';
          this.icon.addClass('svg');
        } else {
          extension = 'png';
          this.icon.removeClass('svg');
        }
        this.icon.attr('src', "api/applications/" + app.id + "." + extension);
        this.icon.addClass('stopped');
        this.hideSpinner();
        this.icon.show();
        return this.stateLabel.hide();
    }
  };

  ApplicationRow.prototype.onAppClicked = function(event) {
    var errorcode, errormsg, errortype, modal,
      _this = this;
    event.preventDefault();
    if (!this.enabled) {
      return null;
    }
    switch (this.model.get('state')) {
      case 'broken':
        errortype = '';
        if (this.model.get('errorcode') != null) {
          errorcode = this.model.get('errorcode');
          switch (errorcode[0]) {
            case '1':
              msg += '\n' + t('error user linux');
              break;
            case '2':
              errortype = t('error git');
              switch (errorcode[1]) {
                case '0':
                  errortype += '\n' + t('error github repo');
                  break;
                case '1':
                  errortype += '\n' + t('error github');
              }
              break;
            case '3':
              errortype = t('error npm');
              break;
            case '4':
              errortype = t('error start');
          }
        }
        errormsg = this.model.get('errormsg');
        modal = new Modal({
          title: 'Broken application',
          errortype: errortype,
          details: errormsg
        });
        $("#" + this.id).append(modal.$el);
        return modal.show();
      case 'installed':
        return this.launchApp(event);
      case 'installing':
        return alert(t('this app is being installed. Wait a little'));
      case 'stopped':
        this.icon.hide();
        this.showSpinner();
        return this.model.start({
          success: function() {
            _this.launchApp(event);
            _this.hideSpinner();
            return _this.icon.show();
          },
          error: function() {
            var msg;
            _this.hideSpinner();
            _this.icon.show();
            msg = 'This app cannot start.';
            errormsg = _this.model.get('errormsg');
            if (errormsg) {
              msg += " Error was : " + errormsg;
            }
            return alert(msg);
          }
        });
    }
  };

  /* Functions*/


  ApplicationRow.prototype.launchApp = function(e) {
    if (e.which === 2 || e.ctrlKey || e.metaKey || $(window).width() <= 640) {
      return window.open("apps/" + this.model.id + "/", "_blank");
    } else if (e.which === 1) {
      return window.app.routers.main.navigate("apps/" + this.model.id + "/", true);
    }
  };

  ApplicationRow.prototype.setBackgroundColor = function() {
    var color, hashColor, slug, _ref;
    slug = this.model.get('slug');
    color = this.model.get('color');
    if (color == null) {
      hashColor = ColorHash.getColor(slug, 'cozy');
      color = ((_ref = this.inMarket) != null ? _ref.get('color') : void 0) || hashColor;
    }
    this.color = color;
    return this.background.css('background-color', color);
  };

  ApplicationRow.prototype.showSpinner = function() {
    return this.$('.spinner').show();
  };

  ApplicationRow.prototype.hideSpinner = function() {
    return this.$('.spinner').hide();
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/install_wizard", function(exports, require, module) {
var InstallWizardView, WizardView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

WizardView = require('lib/wizard_view');

module.exports = InstallWizardView = (function(_super) {
  __extends(InstallWizardView, _super);

  function InstallWizardView() {
    _ref = InstallWizardView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  InstallWizardView.prototype.context = 'installwizard';

  InstallWizardView.prototype.initialize = function(options) {
    var slug, _i, _len, _ref1;
    if (options.market != null) {
      this.marketView = options.market;
    }
    this.steps = [];
    this.installedApps = [];
    this.steps.push({
      slug: 'welcome'
    });
    _ref1 = ['files', 'emails', 'contacts', 'calendar', 'photos'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      slug = _ref1[_i];
      this.steps.push({
        slug: slug,
        choices: {
          'no': 'next',
          'yes': _.partial(this.validStep, slug)
        }
      });
    }
    this.steps.push({
      slug: 'thanks',
      beforeShow: this.resumeInstalls,
      choices: {
        'go-to-my-cozy': 'close',
        'show-me-a-quick-tour': _.partial(this.close, 'home/quicktour')
      }
    });
    return InstallWizardView.__super__.initialize.apply(this, arguments);
  };

  InstallWizardView.prototype.close = function(url) {
    InstallWizardView.__super__.close.apply(this, arguments);
    if (typeof url !== 'string') {
      url = 'home';
    }
    return window.app.routers.main.navigate(url, {
      trigger: true
    });
  };

  InstallWizardView.prototype.installApp = function(app) {
    var application;
    application = this.marketView.marketApps.findWhere({
      slug: app
    });
    if (application == null) {
      return;
    }
    this.marketView.runInstallation(application, false);
    this.installedApps.push(app);
    if ((app === 'calendar' || app === 'contacts') && __indexOf.call(this.installedApps, 'sync') < 0) {
      return this.installApp('sync');
    }
  };

  InstallWizardView.prototype.validStep = function(app) {
    this.installApp(app);
    return this.next();
  };

  InstallWizardView.prototype.resumeInstalls = function() {
    var $appsList, app, _i, _len, _ref1;
    $appsList = $('<ul/>');
    _ref1 = this.installedApps;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      app = _ref1[_i];
      $('<li/>', {
        text: app
      }).appendTo($appsList);
    }
    return this.$("section:last .content").append($appsList);
  };

  return InstallWizardView;

})(WizardView);
});

;require.register("views/long-list-images", function(exports, require, module) {
var CELL_PADDING, COEF_SECURITY, LongList, MAX_SPEED, MONTH_HEADER_HEIGHT, MONTH_LABEL_TOP, Photo, THROTTLE, THUMB_DIM_UNIT, THUMB_HEIGHT,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Photo = require('../models/photo');

THROTTLE = 450;

MAX_SPEED = 1.5 * THROTTLE / 1000;

COEF_SECURITY = 3;

THUMB_DIM_UNIT = 'em';

MONTH_HEADER_HEIGHT = 2.5;

CELL_PADDING = 0.6;

THUMB_HEIGHT = 10;

MONTH_LABEL_TOP = 0.8;

module.exports = LongList = (function() {
  function LongList(externalViewPort$, modal) {
    var _this = this;
    this.externalViewPort$ = externalViewPort$;
    this.modal = modal;
    this._moveViewportToBottomOfThumb$ = __bind(this._moveViewportToBottomOfThumb$, this);
    this._unselectAll = __bind(this._unselectAll, this);
    this._dblclickHandler = __bind(this._dblclickHandler, this);
    this._clickHandler = __bind(this._clickHandler, this);
    this.getSelectedFile = __bind(this.getSelectedFile, this);
    this.state = {
      selected: {}
    };
    this.viewPort$ = document.createElement('div');
    this.viewPort$.classList.add('viewport');
    this.externalViewPort$.appendChild(this.viewPort$);
    this.thumbs$ = document.createElement('div');
    this.thumbs$.classList.add('thumbs');
    this.viewPort$.appendChild(this.thumbs$);
    this.index$ = document.createElement('div');
    this.index$.classList.add('long-list-index');
    this.externalViewPort$.appendChild(this.index$);
    this.viewPort$.style.position = 'relative';
    this.index$.style.position = 'absolute';
    this.index$.style.top = 0;
    this.index$.style.bottom = 0;
    this.index$.style.right = this.getScrollBarWidth() + 'px';
    this._lastSelectedCol = null;
    this.isInited = this.isPhotoArrayLoaded = false;
    Photo.getMonthdistribution(function(error, res) {
      _this.isPhotoArrayLoaded = true;
      _this.months = res;
      _this._DOM_controlerInit();
      return true;
    });
  }

  LongList.prototype.setInitialDimensions = function(width, heigth) {
    this.initialWidth = width;
    this.initialHeight = heigth;
    return this._resizeHandler();
  };

  LongList.prototype.getSelectedFile = function() {
    var k, thumb$, _ref;
    _ref = this.state.selected;
    for (k in _ref) {
      thumb$ = _ref[k];
      if (thumb$) {
        return thumb$.file;
      }
    }
    return null;
  };

  LongList.prototype.keyHandler = function(e) {
    console.log('LongList.keyHandler', e.which);
    switch (e.which) {
      case 39:
        e.stopPropagation();
        e.preventDefault();
        this._selectNextThumb();
        break;
      case 37:
        e.stopPropagation();
        e.preventDefault();
        this._selectPreviousThumb();
        break;
      case 38:
        e.stopPropagation();
        e.preventDefault();
        this._selectThumbUp();
        break;
      case 40:
        e.stopPropagation();
        e.preventDefault();
        this._selectThumbDown();
        break;
      case 36:
        e.stopPropagation();
        e.preventDefault();
        this._selectStartLineThumb();
        break;
      case 35:
        e.stopPropagation();
        e.preventDefault();
        this._selectEndLineThumb();
        break;
      case 34:
        e.stopPropagation();
        e.preventDefault();
        this._selectPageDownThumb();
        break;
      case 33:
        e.stopPropagation();
        e.preventDefault();
        this._selectPageUpThumb();
        break;
      default:
        return false;
    }
  };

  /**
   * Must be called when the goemetry of the parent of the long list changes.
  */


  LongList.prototype.resizeHandler = function() {};

  /**
   * This is the main procedure. Its scope contains all the functions used to
   * update the buffer and the shared variables between those functions. This
   * approach has been chosen for performance reasons (acces to scope
   * variables faster than to nested properties of objects). It's not an
   * obvious choice.
   * Called only when both LongList.init() has been called and that we also
   * got from the server the month distribution (Photo.getMonthdistribution)
   *
   * @return {[type]} [description]
  */


  LongList.prototype._DOM_controlerInit = function() {
    var buffer, bufferAlreadyAdapted, cellPadding, colWidth, currentIndexRkSelected, emToPixels, getElementFontSize, indexHeight, indexVisible, isDefaultToSelect, lastOnScroll_Y, lazyHideIndex, marginLeft, monthHeaderHeight, monthLabelTop, monthTopPadding, months, nRowsInSafeZoneMargin, nThumbsInSafeZone, nThumbsPerRow, previousWidth, remToPixels, rowHeight, safeZone, thumbHeight, thumbWidth, thumbs$Height, viewPortHeight, _SZ_bottomCase, _SZ_initEndPoint, _SZ_initStartPoint, _SZ_setMarginAtStart, _adaptBuffer, _adaptIndex, _computeSafeZone, _createThumbsBottom, _getBufferNextFirst, _getBufferNextLast, _getDimInPixels, _getStaticDimensions, _indexClickHandler, _indexMouseEnter, _indexMouseLeave, _initBuffer, _insertMonthLabel, _moveBufferToBottom, _moveBufferToTop, _rePositionThumbs, _resizeHandler, _scrollHandler, _selectCurrentIndex, _updateThumb,
      _this = this;
    months = this.months;
    buffer = null;
    previousWidth = null;
    bufferAlreadyAdapted = false;
    cellPadding = null;
    monthHeaderHeight = null;
    monthTopPadding = null;
    marginLeft = null;
    thumbWidth = null;
    thumbHeight = null;
    colWidth = null;
    rowHeight = null;
    nThumbsPerRow = null;
    nRowsInSafeZoneMargin = null;
    nThumbsInSafeZone = null;
    viewPortHeight = null;
    indexHeight = null;
    indexVisible = null;
    currentIndexRkSelected = 0;
    thumbs$Height = null;
    monthLabelTop = null;
    lastOnScroll_Y = null;
    safeZone = {
      firstRk: null,
      firstMonthRk: null,
      firstInMonthRow: null,
      firstCol: null,
      firstVisibleRk: null,
      firstY: null,
      lastRk: null,
      endCol: null,
      endMonthRk: null,
      endY: null,
      firstThumbToUpdate: null,
      firstThumbRkToUpdate: null
    };
    isDefaultToSelect = true;
    _scrollHandler = function(e) {
      if (_this.noScrollScheduled) {
        lastOnScroll_Y = _this.viewPort$.scrollTop;
        setTimeout(_adaptBuffer, THROTTLE);
        _this.noScrollScheduled = false;
      }
      if (_this.noIndexScrollScheduled) {
        setTimeout(_adaptIndex, 250);
        _this.noIndexScrollScheduled = false;
      }
      if (!indexVisible) {
        _this.index$.classList.add('visible');
        return indexVisible = true;
      }
    };
    this._scrollHandler = _scrollHandler;
    getElementFontSize = function(context) {
      return parseFloat(getComputedStyle(context || document.documentElement).fontSize);
    };
    remToPixels = function(value) {
      return emToPixels(value);
    };
    emToPixels = function(value, context) {
      return Math.round(value * getElementFontSize(context));
    };
    _getDimInPixels = function(value) {
      switch (THUMB_DIM_UNIT) {
        case 'px':
          return value;
        case 'em':
          return emToPixels(value, _this.viewPort$);
        case 'rem':
          return remToPixels(value);
      }
    };
    /**
     * called once for all during _DOM_controlerInit
     * computes the static parameters of the geometry
    */

    _getStaticDimensions = function() {
      thumbHeight = _getDimInPixels(THUMB_HEIGHT);
      cellPadding = _getDimInPixels(CELL_PADDING);
      _this.thumbHeight = thumbHeight;
      thumbWidth = thumbHeight;
      colWidth = thumbWidth + cellPadding;
      rowHeight = thumbHeight + cellPadding;
      monthHeaderHeight = _getDimInPixels(MONTH_HEADER_HEIGHT);
      monthTopPadding = monthHeaderHeight + cellPadding;
      monthLabelTop = _getDimInPixels(MONTH_LABEL_TOP);
      return _this.monthLabelTop = monthLabelTop;
    };
    /**
     * Compute all the geometry after a resize or when the list in inserted
     * in the DOM.
     * _adaptBuffer will be executed at the end if
     *     1- the distribution array of photo has not been received.
     *     2- the geometry could not be computed (for instance if the widht
     *     of the list is null when the list is not visible)
    */

    _resizeHandler = function() {
      var MONTH_LABEL_HEIGHT, VP_width, c, d, h, label$, minMonthHeight, minMonthNphotos, minimumIndexHeight, month, nPhotos, nPhotosInMonth, nRowsInViewPort, nThumbsInSZ_Margin, nThumbsInViewPort, nextY, rk, txt, y, _i, _j, _len, _len1, _ref, _ref1;
      if (!_this.isPhotoArrayLoaded) {
        return;
      }
      viewPortHeight = _this.viewPort$.clientHeight;
      VP_width = _this.viewPort$.clientWidth;
      if (VP_width <= 0 || viewPortHeight <= 0) {
        if (_this.initialWidth && _this.initialHeight) {
          VP_width = _this.initialWidth;
          viewPortHeight = _this.initialHeight;
        } else {
          return false;
        }
      }
      if (VP_width === previousWidth) {
        _adaptBuffer();
        return;
      }
      previousWidth = VP_width;
      nThumbsPerRow = Math.floor((VP_width - cellPadding) / colWidth);
      _this.nThumbsPerRow = nThumbsPerRow;
      marginLeft = cellPadding + Math.round((VP_width - nThumbsPerRow * colWidth - cellPadding) / 2);
      nRowsInViewPort = Math.ceil(viewPortHeight / rowHeight);
      nRowsInSafeZoneMargin = Math.round(COEF_SECURITY * nRowsInViewPort);
      nThumbsInSZ_Margin = nRowsInSafeZoneMargin * nThumbsPerRow;
      nThumbsInViewPort = nRowsInViewPort * nThumbsPerRow;
      nThumbsInSafeZone = nThumbsInSZ_Margin * 2 + nThumbsInViewPort;
      nextY = 0;
      nPhotos = 0;
      minMonthHeight = Infinity;
      minMonthNphotos = Infinity;
      _ref = _this.months;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        nPhotosInMonth = month.nPhotos;
        month.nRows = Math.ceil(nPhotosInMonth / nThumbsPerRow);
        month.height = monthTopPadding + month.nRows * rowHeight;
        month.y = nextY;
        month.yBottom = nextY + month.height;
        month.firstRk = nPhotos;
        month.lastRk = nPhotos + nPhotosInMonth - 1;
        month.lastThumbCol = (nPhotosInMonth - 1) % nThumbsPerRow;
        month.date = moment(month.month, 'YYYYMM');
        nextY += month.height;
        nPhotos += nPhotosInMonth;
        minMonthHeight = Math.min(minMonthHeight, month.height);
        minMonthNphotos = Math.min(minMonthNphotos, month.nPhotos);
      }
      _this.nPhotos = nPhotos;
      thumbs$Height = nextY;
      _this.thumbs$.style.setProperty('height', thumbs$Height + 'px');
      MONTH_LABEL_HEIGHT = 27;
      minimumIndexHeight = _this.months.length * MONTH_LABEL_HEIGHT;
      if (minimumIndexHeight * 1.3 <= viewPortHeight) {
        indexHeight = viewPortHeight;
      } else {
        indexHeight = 1.5 * minimumIndexHeight;
      }
      y = 0;
      c = indexHeight - _this.months.length * MONTH_LABEL_HEIGHT;
      d = nPhotos - minMonthNphotos * _this.months.length;
      _ref1 = _this.months;
      for (rk = _j = 0, _len1 = _ref1.length; _j < _len1; rk = ++_j) {
        month = _ref1[rk];
        txt = month.date.format('MMM YYYY');
        h = c * (month.nPhotos - minMonthNphotos);
        h = h / d;
        h += MONTH_LABEL_HEIGHT;
        y += h;
        label$ = $("<div style='height:" + h + "px; right:0px'>" + txt + "</div>")[0];
        label$.dataset.monthRk = rk;
        _this.index$.appendChild(label$);
      }
      if (bufferAlreadyAdapted) {
        _rePositionThumbs();
      }
      bufferAlreadyAdapted = true;
      return _adaptBuffer();
    };
    this.resizeHandler = _resizeHandler;
    _initBuffer = function() {
      var thumb, thumb$;
      thumb$ = document.createElement('img');
      thumb$.setAttribute('class', 'long-list-thumb');
      thumb$.style.height = thumbHeight + 'px';
      thumb$.style.width = thumbHeight + 'px';
      _this.thumbs$.appendChild(thumb$);
      thumb = {
        prev: null,
        next: null,
        el: thumb$,
        rank: null,
        id: null
      };
      thumb.prev = thumb;
      thumb.next = thumb;
      buffer = {
        first: thumb,
        firstRk: -1,
        last: thumb,
        lastRk: -1,
        nThumbs: 1,
        nextLastRk: null,
        nextLastCol: null,
        nextLastY: null,
        nextLastMonthRk: null,
        nextFirstCol: null,
        nextFirstMonthRk: null,
        nextFirstRk: null,
        nextFirstY: null
      };
      return _this.buffer = buffer;
    };
    /**
     * called by onscroll (throttled), adapt the position of the index (top)
     * according to the new scroll position
    */

    _adaptIndex = function() {
      var C, C_bis, H, td_a, td_b, vph, y;
      y = _this.viewPort$.scrollTop;
      H = thumbs$Height;
      vph = viewPortHeight;
      C = (H - vph) / (indexHeight - vph);
      td_a = Math.round((vph * C - vph) / 2);
      td_b = H - td_a - vph;
      C_bis = (indexHeight - vph) / (td_b - td_a);
      if (td_b < td_a) {
        td_a = Math.round((H - vph) / 2);
        td_b = td_a;
      }
      if (td_a < y && y < td_b) {
        _this.index$.style.top = -Math.round(C_bis * (y - td_a)) + 'px';
        return;
      }
      if (y < td_a) {
        _this.index$.style.top = 0;
      }
      if (td_b < y) {
        return _this.index$.style.top = -(indexHeight - vph) + 'px';
      }
    };
    /**
     * modify the apperence of the index label corresponding of the first
     * month displayed in the viewPort
    */

    _selectCurrentIndex = function(monthRk) {
      _this.index$.children[currentIndexRkSelected].classList.remove('current');
      _this.index$.children[monthRk].classList.add('current');
      return currentIndexRkSelected = monthRk;
    };
    /**
     * will hide the index 2s after its last call
    */

    lazyHideIndex = _.debounce(function() {
      _this.index$.classList.remove('visible');
      return indexVisible = false;
    }, 2000);
    /**
     * Adapt the buffer when the viewport has moved
     * Launched at init and by _scrollHandler
     * Steps :
    */

    _adaptBuffer = function() {
      var bufr, nAvailable, nToCreate, nToFind, nToMove, previous_firstThumbToUpdate, speed, targetCol, targetMonthRk, targetRk, targetY, _ref, _ref1;
      _this.noScrollScheduled = true;
      _this.noIndexScrollScheduled = true;
      lazyHideIndex();
      speed = Math.abs(_this.viewPort$.scrollTop - lastOnScroll_Y) / viewPortHeight;
      if (speed > MAX_SPEED) {
        _scrollHandler();
        return;
      }
      bufr = buffer;
      safeZone.firstRk = null;
      safeZone.firstMonthRk = null;
      safeZone.firstInMonthRow = null;
      safeZone.firstCol = null;
      safeZone.firstVisibleRk = null;
      safeZone.firstY = null;
      safeZone.lastRk = null;
      safeZone.endCol = null;
      safeZone.endMonthRk = null;
      safeZone.endY = null;
      previous_firstThumbToUpdate = safeZone.firstThumbToUpdate;
      safeZone.firstThumbToUpdate = null;
      safeZone.firstThumbRkToUpdate = null;
      _computeSafeZone();
      if (safeZone.lastRk > bufr.lastRk) {
        nToFind = Math.min(safeZone.lastRk - bufr.lastRk, nThumbsInSafeZone);
        nAvailable = safeZone.firstRk - bufr.firstRk;
        if (nAvailable < 0) {
          nAvailable = 0;
        }
        if (nAvailable > bufr.nThumbs) {
          nAvailable = bufr.nThumbs;
        }
        nToCreate = Math.max(nToFind - nAvailable, 0);
        nToMove = nToFind - nToCreate;
        if (safeZone.firstRk <= bufr.lastRk) {
          _getBufferNextLast();
          targetRk = bufr.nextLastRk;
          targetMonthRk = bufr.nextLastMonthRk;
          targetCol = bufr.nextLastCol;
          targetY = bufr.nextLastY;
        } else {
          targetRk = safeZone.firstRk;
          targetMonthRk = safeZone.firstMonthRk;
          targetCol = safeZone.firstCol;
          targetY = safeZone.firstY;
        }
        if (nToFind > 0) {
          Photo.listFromFiles(targetRk, nToFind, function(error, res) {
            if (error) {
              console.log(error);
            }
            return _updateThumb(res.files, res.firstRank);
          });
        }
        if (nToCreate > 0) {
          _ref = _createThumbsBottom(nToCreate, targetRk, targetCol, targetY, targetMonthRk), targetY = _ref[0], targetCol = _ref[1], targetMonthRk = _ref[2];
          targetRk += nToCreate;
        }
        if (nToMove > 0) {
          _moveBufferToBottom(nToMove, targetRk, targetCol, targetY, targetMonthRk);
        }
      } else if (safeZone.firstRk < bufr.firstRk) {
        nToFind = Math.min(bufr.firstRk - safeZone.firstRk, nThumbsInSafeZone);
        nAvailable = bufr.lastRk - safeZone.lastRk;
        if (nAvailable < 0) {
          nAvailable = 0;
        }
        if (nAvailable > bufr.nThumbs) {
          nAvailable = bufr.nThumbs;
        }
        nToCreate = Math.max(nToFind - nAvailable, 0);
        nToMove = nToFind - nToCreate;
        if (safeZone.lastRk >= bufr.firstRk) {
          _getBufferNextFirst();
          targetRk = bufr.nextFirstRk;
          targetMonthRk = bufr.nextFirstMonthRk;
          targetCol = bufr.nextFirstCol;
          targetY = bufr.nextFirstY;
        } else {
          targetRk = safeZone.lastRk;
          targetCol = safeZone.endCol;
          targetMonthRk = safeZone.endMonthRk;
          targetY = safeZone.endY;
        }
        if (nToFind > 0) {
          Photo.listFromFiles(targetRk - nToFind + 1, nToFind, function(error, res) {
            if (error) {
              console.log(error);
            }
            return _updateThumb(res.files, res.firstRank);
          });
        }
        if (nToCreate > 0) {
          throw new Error('It should not be used in the\
                        current implementation');
          _ref1 = _createThumbsTop(nToCreate, targetRk, targetCol, targetY, targetMonthRk), targetY = _ref1[0], targetCol = _ref1[1], targetMonthRk = _ref1[2];
          targetRk += nToCreate;
        }
        if (nToMove > 0) {
          _moveBufferToTop(nToMove, targetRk, targetCol, targetY, targetMonthRk);
        }
      }
      if (nToFind == null) {
        return safeZone.firstThumbToUpdate = previous_firstThumbToUpdate;
      }
    };
    _rePositionThumbs = function() {
      var bufr, col, deltaTop, firstVisibleThumb, lastLast, localRk, month, monthRk, rk, row, rowY, scrollTop, startRk, style, thumb, thumb$, _i, _ref;
      console.log("== _rePositionThumbs");
      bufr = buffer;
      thumb = bufr.first;
      thumb$ = thumb.el;
      monthRk = thumb.monthRk;
      scrollTop = _this.viewPort$.scrollTop;
      month = months[monthRk];
      startRk = thumb.rank;
      localRk = startRk - monthRk;
      row = Math.floor(localRk / nThumbsPerRow);
      rowY = month.y + monthTopPadding + row * rowHeight;
      col = localRk % nThumbsPerRow;
      firstVisibleThumb = null;
      lastLast = bufr.last;
      for (rk = _i = 0, _ref = buffer.nThumbs - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        if (!firstVisibleThumb && parseInt(thumb.el.style.top) > scrollTop) {
          firstVisibleThumb = {
            top: parseInt(thumb.el.style.top),
            el: thumb.el
          };
        }
        style = thumb.el.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
        thumb = thumb.prev;
      }
      if (firstVisibleThumb) {
        deltaTop = firstVisibleThumb.top - parseInt(firstVisibleThumb.el.style.top);
        return _this.viewPort$.scrollTop -= deltaTop;
      }
    };
    /**
     * Called when we get from the server the ids of the thumbs that have
     * been created or moved
     * @param  {Array} files     [{id},..,{id}] in chronological order
     * @param  {Integer} fstFileRk The rank of the first file of files
    */

    _updateThumb = function(files, fstFileRk) {
      var bufr, file, fileId, file_i, first, firstThumbRkToUpdate, firstThumbToUpdate, last, lstFileRk, th, thumb, thumb$, _i, _j, _ref, _ref1, _ref2;
      lstFileRk = fstFileRk + files.length - 1;
      bufr = buffer;
      thumb = bufr.first;
      firstThumbToUpdate = safeZone.firstThumbToUpdate;
      firstThumbRkToUpdate = firstThumbToUpdate.rank;
      last = bufr.last;
      first = bufr.first;
      if (firstThumbRkToUpdate < fstFileRk) {
        th = firstThumbToUpdate.prev;
        while (true) {
          if (th === bufr.first) {
            return;
          }
          if (th.rank === fstFileRk) {
            firstThumbToUpdate = th;
            firstThumbRkToUpdate = th.rank;
            break;
          }
          th = th.prev;
        }
      }
      if (lstFileRk < firstThumbRkToUpdate) {
        th = firstThumbToUpdate.next;
        while (true) {
          if (th === bufr.last) {
            return;
          }
          if (th.rank === lstFileRk) {
            firstThumbToUpdate = th;
            firstThumbRkToUpdate = th.rank;
            break;
          }
          th = th.next;
        }
      }
      thumb = firstThumbToUpdate;
      for (file_i = _i = _ref = firstThumbRkToUpdate - fstFileRk, _ref1 = files.length - 1; _i <= _ref1; file_i = _i += 1) {
        file = files[file_i];
        fileId = file.id;
        thumb$ = thumb.el;
        thumb$.file = file;
        thumb$.src = "files/photo/thumbs/" + fileId + ".jpg";
        thumb$.dataset.id = fileId;
        thumb.id = fileId;
        thumb = thumb.prev;
        if (_this.state.selected[fileId]) {
          thumb$.classList.add('selectedThumb');
          _this.state.selected[fileId] = thumb$;
        } else {
          thumb$.classList.remove('selectedThumb');
        }
      }
      thumb = firstThumbToUpdate.next;
      for (file_i = _j = _ref2 = firstThumbRkToUpdate - fstFileRk - 1; _j >= 0; file_i = _j += -1) {
        file = files[file_i];
        fileId = file.id;
        thumb$ = thumb.el;
        thumb$.file = file;
        thumb$.src = "files/photo/thumbs/" + fileId + ".jpg";
        thumb$.dataset.id = fileId;
        thumb.id = fileId;
        thumb = thumb.next;
        if (_this.state.selected[fileId]) {
          thumb$.classList.add('selectedThumb');
          _this.state.selected[fileId] = thumb$;
        } else {
          thumb$.classList.remove('selectedThumb');
        }
      }
      if (isDefaultToSelect) {
        _this._toggleOnThumb$(bufr.first.el);
        return isDefaultToSelect = false;
      }
    };
    _getBufferNextFirst = function() {
      var bufr, inMonthRow, initMonthRk, localRk, month, monthRk, nextFirstRk, _i;
      bufr = buffer;
      nextFirstRk = bufr.firstRk - 1;
      if (nextFirstRk === -1) {
        return;
      }
      bufr.nextFirstRk = nextFirstRk;
      initMonthRk = safeZone.endMonthRk;
      for (monthRk = _i = initMonthRk; _i >= 0; monthRk = _i += -1) {
        month = months[monthRk];
        if (month.firstRk <= nextFirstRk) {
          break;
        }
      }
      bufr.nextFirstMonthRk = monthRk;
      localRk = nextFirstRk - month.firstRk;
      inMonthRow = Math.floor(localRk / nThumbsPerRow);
      bufr.nextFirstY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return bufr.nextFirstCol = localRk % nThumbsPerRow;
    };
    _getBufferNextLast = function() {
      var bufr, inMonthRow, initMonthRk, localRk, month, monthRk, nextLastRk, _i, _ref;
      bufr = buffer;
      nextLastRk = bufr.lastRk + 1;
      if (nextLastRk === _this.nPhotos) {
        return;
      }
      bufr.nextLastRk = nextLastRk;
      initMonthRk = safeZone.firstMonthRk;
      for (monthRk = _i = initMonthRk, _ref = months.length - 1; _i <= _ref; monthRk = _i += 1) {
        month = months[monthRk];
        if (nextLastRk <= month.lastRk) {
          break;
        }
      }
      bufr.nextLastMonthRk = monthRk;
      localRk = nextLastRk - month.firstRk;
      inMonthRow = Math.floor(localRk / nThumbsPerRow);
      bufr.nextLastY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return bufr.nextLastCol = localRk % nThumbsPerRow;
    };
    /**
     * after a scroll throttle, will compute the safe zone
    */

    _computeSafeZone = function() {
      var hasReachedLastPhoto;
      _SZ_initStartPoint();
      _SZ_setMarginAtStart();
      hasReachedLastPhoto = _SZ_initEndPoint();
      if (hasReachedLastPhoto) {
        return _SZ_bottomCase();
      }
    };
    _SZ_initStartPoint = function() {
      var SZ, Y, inMonthRow, month, monthRk, _i, _len, _ref;
      SZ = safeZone;
      Y = _this.viewPort$.scrollTop;
      _ref = _this.months;
      for (monthRk = _i = 0, _len = _ref.length; _i < _len; monthRk = ++_i) {
        month = _ref[monthRk];
        if (month.yBottom > Y) {
          break;
        }
      }
      inMonthRow = Math.floor((Y - month.y - monthTopPadding) / rowHeight);
      if (inMonthRow < 0) {
        inMonthRow = 0;
      }
      SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
      SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
      SZ.firstMonthRk = monthRk;
      SZ.firstCol = 0;
      SZ.firstThumbToUpdate = null;
      SZ.firstInMonthRow = inMonthRow;
      SZ.firstVisibleRk = SZ.firstRk;
      return _selectCurrentIndex(monthRk);
    };
    _SZ_setMarginAtStart = function() {
      var SZ, inMonthRow, j, month, rowsSeen, _i, _ref;
      SZ = safeZone;
      inMonthRow = SZ.firstInMonthRow - nRowsInSafeZoneMargin;
      if (inMonthRow >= 0) {
        month = _this.months[SZ.firstMonthRk];
        SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
        SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
        SZ.firstInMonthRow = inMonthRow;
        return;
      } else {
        rowsSeen = SZ.firstInMonthRow;
        for (j = _i = _ref = SZ.firstMonthRk - 1; _i >= 0; j = _i += -1) {
          month = _this.months[j];
          if (rowsSeen + month.nRows >= nRowsInSafeZoneMargin) {
            inMonthRow = month.nRows - nRowsInSafeZoneMargin + rowsSeen;
            SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow;
            SZ.firstY = month.y + monthTopPadding + inMonthRow * rowHeight;
            SZ.firstInMonthRow = inMonthRow;
            SZ.firstMonthRk = j;
            return;
          } else {
            rowsSeen += month.nRows;
          }
        }
      }
      SZ.firstRk = 0;
      SZ.firstMonthRk = 0;
      SZ.firstInMonthRow = 0;
      SZ.firstCol = 0;
      return SZ.firstY = monthTopPadding;
    };
    /**
     * Finds the end point of the safeZone.
     * Returns true if the safeZone end pointer should be after the last
     * thumb
    */

    _SZ_initEndPoint = function() {
      var SZ, inMonthRk, inMonthRow, lastRk, month, monthRk, _i, _ref, _ref1;
      SZ = safeZone;
      lastRk = SZ.firstRk + nThumbsInSafeZone - 1;
      if (lastRk >= _this.nPhotos) {
        lastRk = _this.nPhotos - 1;
        safeZone.lastRk = lastRk;
        return true;
      }
      for (monthRk = _i = _ref = SZ.firstMonthRk, _ref1 = months.length - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; monthRk = _ref <= _ref1 ? ++_i : --_i) {
        month = months[monthRk];
        if (lastRk <= month.lastRk) {
          break;
        }
      }
      inMonthRk = lastRk - month.firstRk;
      inMonthRow = Math.floor(inMonthRk / nThumbsPerRow);
      safeZone.lastRk = lastRk;
      safeZone.endMonthRk = monthRk;
      safeZone.endCol = inMonthRk % nThumbsPerRow;
      safeZone.endY = month.y + monthTopPadding + inMonthRow * rowHeight;
      return false;
    };
    _SZ_bottomCase = function() {
      var SZ, inMonthRk, inMonthRow, month, monthRk, rk, thumbsSeen, thumbsTarget, _i;
      SZ = safeZone;
      months = _this.months;
      monthRk = months.length - 1;
      thumbsSeen = 0;
      thumbsTarget = nThumbsInSafeZone;
      for (monthRk = _i = monthRk; _i >= 0; monthRk = _i += -1) {
        month = months[monthRk];
        thumbsSeen += month.nPhotos;
        if (thumbsSeen >= thumbsTarget) {
          break;
        }
      }
      if (thumbsSeen < thumbsTarget) {
        SZ.firstMonthRk = 0;
        SZ.firstInMonthRow = 0;
        SZ.firstRk = 0;
        return SZ.firstY = month.y + cellPadding + monthHeaderHeight;
      } else {
        rk = _this.nPhotos - thumbsTarget;
        inMonthRk = rk - month.firstRk;
        inMonthRow = Math.floor(inMonthRk / nThumbsPerRow);
        SZ.firstMonthRk = monthRk;
        SZ.firstInMonthRow = inMonthRow;
        SZ.firstCol = inMonthRk % nThumbsPerRow;
        SZ.firstRk = rk;
        return SZ.firstY = month.y + cellPadding + monthHeaderHeight + inMonthRow * rowHeight;
      }
    };
    _createThumbsBottom = function(nToCreate, startRk, startCol, startY, monthRk) {
      var bufr, col, lastLast, localRk, month, rk, rowY, style, thumb, thumb$, _i, _ref;
      bufr = buffer;
      rowY = startY;
      col = startCol;
      month = _this.months[monthRk];
      localRk = startRk - month.firstRk;
      lastLast = bufr.last;
      for (rk = _i = startRk, _ref = startRk + nToCreate - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        thumb$ = document.createElement('img');
        thumb$.dataset.rank = rk;
        thumb$.setAttribute('class', 'long-list-thumb');
        thumb = {
          next: bufr.last,
          prev: bufr.first,
          el: thumb$,
          rank: rk,
          monthRk: monthRk,
          id: null
        };
        if (rk === safeZone.firstVisibleRk) {
          safeZone.firstThumbToUpdate = thumb;
        }
        bufr.first.next = thumb;
        bufr.last.prev = thumb;
        bufr.last = thumb;
        style = thumb$.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        style.height = thumbHeight + 'px';
        style.width = thumbHeight + 'px';
        _this.thumbs$.appendChild(thumb$);
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = _this.months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
      }
      bufr.lastRk = rk - 1;
      bufr.nThumbs += nToCreate;
      if (safeZone.firstThumbToUpdate === null) {
        safeZone.firstThumbToUpdate = lastLast.prev;
      }
      bufr.nextLastRk = rk;
      bufr.nextLastCol = col;
      bufr.nextLastY = rowY;
      bufr.nextLastMonthRk = monthRk;
      return [rowY, col, monthRk];
    };
    _moveBufferToBottom = function(nToMove, startRk, startCol, startY, monthRk) {
      var col, localRk, month, monthRk_initial, rk, rowY, style, thumb, thumb$, _i, _ref;
      monthRk_initial = monthRk;
      rowY = startY;
      col = startCol;
      month = _this.months[monthRk];
      localRk = startRk - month.firstRk;
      if (safeZone.firstThumbToUpdate === null) {
        safeZone.firstThumbToUpdate = buffer.first;
      }
      for (rk = _i = startRk, _ref = startRk + nToMove - 1; _i <= _ref; rk = _i += 1) {
        if (localRk === 0) {
          _insertMonthLabel(month);
        }
        thumb = buffer.first;
        thumb$ = thumb.el;
        thumb$.dataset.rank = rk;
        thumb.rank = rk;
        thumb.monthRk = monthRk;
        thumb$.src = '';
        thumb$.dataset.id = '';
        style = thumb$.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        if (rk === safeZone.firstVisibleRk) {
          safeZone.firstThumbToUpdate = thumb;
        }
        buffer.last = buffer.first;
        buffer.first = buffer.first.prev;
        buffer.firstRk = buffer.first.rank;
        buffer.last.rank = rk;
        localRk += 1;
        if (localRk === month.nPhotos) {
          monthRk += 1;
          month = _this.months[monthRk];
          localRk = 0;
          col = 0;
          rowY += rowHeight + monthTopPadding;
        } else {
          col += 1;
          if (col === nThumbsPerRow) {
            rowY += rowHeight;
            col = 0;
          }
        }
      }
      buffer.lastRk = rk - 1;
      buffer.firstRk = buffer.first.rank;
      buffer.nextLastRk = rk;
      buffer.nextLastCol = col;
      buffer.nextLastY = rowY;
      return buffer.nextLastMonthRk = monthRk;
    };
    _moveBufferToTop = function(nToMove, startRk, startCol, startY, monthRk) {
      var col, localRk, month, rk, rowY, style, thumb, thumb$, _i, _ref;
      rowY = startY;
      col = startCol;
      month = _this.months[monthRk];
      localRk = startRk - month.firstRk;
      if (safeZone.firstThumbToUpdate === null) {
        safeZone.firstThumbToUpdate = buffer.last;
      }
      for (rk = _i = startRk, _ref = startRk - nToMove + 1; _i >= _ref; rk = _i += -1) {
        thumb = buffer.last;
        thumb$ = thumb.el;
        thumb$.dataset.rank = rk;
        thumb.rank = rk;
        thumb.monthRk = monthRk;
        thumb$.src = '';
        thumb$.dataset.id = '';
        style = thumb$.style;
        style.top = rowY + 'px';
        style.left = (marginLeft + col * colWidth) + 'px';
        if (rk === safeZone.firstVisibleRk) {
          safeZone.firstThumbToUpdate = thumb;
        }
        buffer.first = buffer.last;
        buffer.last = buffer.last.next;
        buffer.lastRk = buffer.last.rank;
        buffer.first.rank = rk;
        localRk -= 1;
        if (localRk === -1) {
          if (rk === 0) {
            rk = -1;
            break;
          }
          _insertMonthLabel(month);
          monthRk -= 1;
          month = _this.months[monthRk];
          localRk = month.nPhotos - 1;
          col = month.lastThumbCol;
          rowY -= cellPadding + monthHeaderHeight + rowHeight;
        } else {
          col -= 1;
          if (col === -1) {
            rowY -= rowHeight;
            col = nThumbsPerRow - 1;
          }
        }
      }
      buffer.firstRk = rk + 1;
      return buffer.lastRk = buffer.last.rank;
    };
    _insertMonthLabel = function(month) {
      var label$;
      if (month.label$) {
        label$ = month.label$;
      } else {
        label$ = document.createElement('div');
        label$.classList.add('long-list-month-label');
        _this.thumbs$.appendChild(label$);
        month.label$ = label$;
      }
      label$.textContent = month.date.format('MMMM YYYY');
      label$.style.top = (month.y + monthLabelTop) + 'px';
      return label$.style.left = Math.round(marginLeft / 2) + 'px';
    };
    _indexClickHandler = function(e) {
      var monthRk;
      monthRk = e.target.dataset.monthRk;
      if (monthRk) {
        _this.viewPort$.scrollTop = _this.months[monthRk].y;
        return _adaptIndex();
      }
    };
    _indexMouseEnter = function() {
      _this.index$.classList.add('hardVisible');
      return indexVisible = false;
    };
    _indexMouseLeave = function() {
      _this.index$.classList.add('visible');
      _this.index$.classList.remove('hardVisible');
      return lazyHideIndex();
    };
    _getStaticDimensions();
    _initBuffer();
    _resizeHandler();
    isDefaultToSelect = true;
    this.thumbs$.addEventListener('click', this._clickHandler);
    this.thumbs$.addEventListener('dblclick', this._dblclickHandler);
    this.viewPort$.addEventListener('scroll', _scrollHandler);
    this.index$.addEventListener('click', _indexClickHandler);
    this.index$.addEventListener('mouseenter', _indexMouseEnter);
    return this.index$.addEventListener('mouseleave', _indexMouseLeave);
  };

  LongList.prototype._clickHandler = function(e) {
    var th, thBottomY, thTopY, viewPortBottomY, viewPortTopY;
    th = e.target;
    if (!th.classList.contains('long-list-thumb')) {
      return;
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    viewPortTopY = this.viewPort$.scrollTop;
    viewPortBottomY = viewPortTopY + this.viewPort$.clientHeight;
    thTopY = this._coordonate.top(th);
    thBottomY = thTopY + this.thumbHeight;
    if (viewPortBottomY < thBottomY) {
      th.scrollIntoView(false);
    }
    if (thTopY < viewPortTopY) {
      return th.scrollIntoView(true);
    }
  };

  LongList.prototype._dblclickHandler = function(e) {
    var th;
    th = e.target;
    if (!th.classList.contains('long-list-thumb')) {
      return null;
    }
    this._toggleOnThumb$(th);
    this._lastSelectedCol = this._coordonate.left(th);
    return this.modal.onYes();
  };

  /**
   * toogles on a thumb.
   * Returns null if the thumb is already selected or if there is no image id
   * associated yet
  */


  LongList.prototype._toggleOnThumb$ = function(thumb$) {
    if (thumb$.dataset.id === '') {
      return null;
    }
    if (this.state.selected[thumb$.dataset.id]) {
      return null;
    }
    this._unselectAll();
    thumb$.classList.add('selectedThumb');
    return this.state.selected[thumb$.dataset.id] = thumb$;
  };

  LongList.prototype._unselectAll = function() {
    var id, thumb$, _ref, _results;
    _ref = this.state.selected;
    _results = [];
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        thumb$.classList.remove('selectedThumb');
        _results.push(this.state.selected[id] = false);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  LongList.prototype._getSelectedThumb$ = function() {
    var id, thumb$, _ref;
    _ref = this.state.selected;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        return thumb$;
      }
    }
    return null;
  };

  LongList.prototype._selectNextThumb = function() {
    var id, nextThumb$, thumb$, _ref;
    _ref = this.state.selected;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        break;
      }
    }
    nextThumb$ = this._getNextThumb$(thumb$);
    if (nextThumb$ === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(nextThumb$);
    if (!this._toggleOnThumb$(nextThumb$)) {
      return null;
    }
    return this._moveViewportToBottomOfThumb$(nextThumb$);
  };

  LongList.prototype._selectPreviousThumb = function() {
    var prevThumb$, thumb$;
    thumb$ = this._getSelectedThumb$();
    prevThumb$ = this._getPreviousThumb$(thumb$);
    if (prevThumb$ === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(prevThumb$);
    if (!this._toggleOnThumb$(prevThumb$)) {
      return null;
    }
    return this._moveViewportToTopOfThumb$(prevThumb$);
  };

  LongList.prototype._selectThumbUp = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return null;
    }
    if (thumb$.dataset.rank === '0') {
      return null;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getPreviousThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.left !== left) {
      if (th.dataset.rank === '0') {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToTopOfThumb$(th);
        return th;
      }
      if (th.style.top !== top) {
        if (this._coordonate.left(th) <= left) {
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToTopOfThumb$(th);
          return th;
        }
      }
      th = this._getPreviousThumb$(th);
      if (th === null) {
        return null;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToTopOfThumb$(th);
    return th;
  };

  LongList.prototype._selectThumbDown = function() {
    var hasAlreadyChangedOfRow, left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return null;
    }
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return null;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getNextThumb$(thumb$);
    if (th === null) {
      return null;
    }
    hasAlreadyChangedOfRow = false;
    while (this._coordonate.left(th) !== left) {
      if (this._coordonate.rank(th) === this.nPhotos - 1) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return th;
      }
      if (th.style.top !== top) {
        if (hasAlreadyChangedOfRow) {
          th = this._getPreviousThumb$(th);
          if (th === null) {
            return null;
          }
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToBottomOfThumb$(th);
          return th;
        }
        hasAlreadyChangedOfRow = true;
        top = th.style.top;
        if (this._coordonate.left(th) >= left) {
          if (!this._toggleOnThumb$(th)) {
            return null;
          }
          this._moveViewportToBottomOfThumb$(th);
          return th;
        }
      }
      th = this._getNextThumb$(th);
      if (th === null) {
        return null;
      }
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
    return th;
  };

  LongList.prototype._selectEndLineThumb = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getNextThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.top === top) {
      if (this._coordonate.rank(th) === this.nPhotos - 1) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return;
      }
      th = this._getNextThumb$(th);
      if (th === null) {
        return null;
      }
    }
    th = this._getPreviousThumb$(th);
    if (th === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
  };

  LongList.prototype._selectStartLineThumb = function() {
    var left, th, thumb$, top;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    if (Number(thumb$.dataset.rank) === 0) {
      return;
    }
    if (this._lastSelectedCol === null) {
      left = this._coordonate.left(thumb$);
    } else {
      left = this._lastSelectedCol;
    }
    top = thumb$.style.top;
    th = this._getPreviousThumb$(thumb$);
    if (th === null) {
      return null;
    }
    while (th.style.top === top) {
      if (this._coordonate.rank(th) === 0) {
        this._lastSelectedCol = this._coordonate.left(th);
        if (!this._toggleOnThumb$(th)) {
          return null;
        }
        this._moveViewportToBottomOfThumb$(th);
        return;
      }
      th = this._getPreviousThumb$(th);
    }
    th = this._getNextThumb$(th);
    if (th === null) {
      return null;
    }
    this._lastSelectedCol = this._coordonate.left(th);
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    this._moveViewportToBottomOfThumb$(th);
  };

  LongList.prototype._coordonate = {
    top: function(thumb$) {
      return Number(thumb$.style.top.slice(0, -2));
    },
    left: function(thumb$) {
      return Number(thumb$.style.left.slice(0, -2));
    },
    rank: function(thumb$) {
      return Number(thumb$.dataset.rank);
    }
  };

  LongList.prototype._selectPageDownThumb = function() {
    var th, thBottomY, thTopY, thumb$, viewPortBottomY;
    viewPortBottomY = this.viewPort$.scrollTop + this.viewPort$.clientHeight;
    thumb$ = this._getSelectedThumb$();
    if (thumb$ === null) {
      return;
    }
    th = thumb$;
    thTopY = this._coordonate.top(th);
    thBottomY = thTopY + this.thumbHeight;
    while (thBottomY <= viewPortBottomY) {
      th = this._selectThumbDown();
      if (th === null) {
        return;
      }
      thTopY = this._coordonate.top(th);
      thBottomY = thTopY + this.thumbHeight;
    }
    th.scrollIntoView(true);
    return this._moveViewportToTopOfThumb$(th);
  };

  LongList.prototype._selectPageUpThumb = function() {
    var th, thTopY, thumb$, viewPortTopY;
    viewPortTopY = this.viewPort$.scrollTop;
    thumb$ = this._getSelectedThumb$();
    th = thumb$;
    thTopY = this._coordonate.top(th);
    while (thTopY >= viewPortTopY) {
      th = this._selectThumbUp();
      if (th === null) {
        return;
      }
      thTopY = this._coordonate.top(th);
    }
    return th.scrollIntoView(false);
  };

  LongList.prototype._moveViewportToBottomOfThumb$ = function(thumb$) {
    var thumb$Bottom, thumb$Top, viewPortBottomY;
    thumb$Top = this._coordonate.top(thumb$);
    thumb$Bottom = thumb$Top + this.thumbHeight;
    viewPortBottomY = this.viewPort$.scrollTop + this.viewPort$.clientHeight;
    if (viewPortBottomY < thumb$Bottom) {
      thumb$.scrollIntoView(false);
      return this._scrollHandler();
    }
  };

  /**
   * will move the viewport so that the top of the given thumb is at the top
   * of the viewport, but only if the top of the thumb is above the viewport
   * @param  {element} thumb$ # the thumb
  */


  LongList.prototype._moveViewportToTopOfThumb$ = function(thumb$) {
    var inMonthRow, month, monthRk, thumb$Top, thumbRk, viewPortTop, _i, _len, _ref;
    thumb$Top = this._coordonate.top(thumb$);
    viewPortTop = this.viewPort$.scrollTop;
    thumbRk = parseInt(thumb$.dataset.rank);
    _ref = this.months;
    for (monthRk = _i = 0, _len = _ref.length; _i < _len; monthRk = ++_i) {
      month = _ref[monthRk];
      if (thumbRk <= month.lastRk) {
        break;
      }
    }
    inMonthRow = Math.floor((thumbRk - month.firstRk) / this.nThumbsPerRow);
    if (inMonthRow === 0) {
      if (month.y + this.monthLabelTop < this.viewPort$.scrollTop) {
        this.viewPort$.scrollTop = month.y + this.monthLabelTop;
        return this._scrollHandler();
      }
    } else {
      if (thumb$Top < viewPortTop) {
        thumb$.scrollIntoView(true);
        this._scrollHandler();
      }
    }
  };

  /**
   * @param  {Element} thumb$ # the element corresponding to the thumb
   * @return {null}        # return null if on first thumb
   * @return {Element}     # the previous element thumb or null if on first
   *                         thumb of first of the buffer
  */


  LongList.prototype._getPreviousThumb$ = function(thumb$) {
    var th;
    if (thumb$.dataset.rank === '0') {
      return null;
    }
    if (thumb$ === this.buffer.first.el) {
      return null;
    }
    th = thumb$.previousElementSibling;
    if (th === null) {
      th = thumb$.parentNode.lastElementChild;
      if (th === thumb$) {
        return null;
      }
    }
    while (th.nodeName === 'DIV') {
      th = th.previousElementSibling;
      if (th === null) {
        th = thumb$.parentNode.lastElementChild;
        if (th === thumb$) {
          return null;
        }
      }
    }
    return th;
  };

  /**
   *
   * @param  {Element} thumb$ # the start thumb element
   * @return {Element|null}   # returns an element or null if on the last
   *                            thumb or the last of the buffer
  */


  LongList.prototype._getNextThumb$ = function(thumb$) {
    var th;
    if (this._coordonate.rank(thumb$) === this.nPhotos - 1) {
      return null;
    }
    if (thumb$ === this.buffer.last.el) {
      return null;
    }
    th = thumb$.nextElementSibling;
    if (th === null) {
      th = thumb$.parentNode.firstElementChild;
      if (th === thumb$) {
        return null;
      }
    }
    while (th.nodeName === 'DIV') {
      th = th.nextElementSibling;
      if (th === null) {
        th = thumb$.parentNode.firstElementChild;
        if (th === thumb$) {
          return null;
        }
      }
    }
    return th;
  };

  LongList.prototype.getScrollBarWidth = function() {
    var inner, outer, w1, w2;
    inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
    outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    w2 = inner.offsetWidth;
    if (w1 === w2) {
      w2 = outer.clientWidth;
    }
    document.body.removeChild(outer);
    return w1 - w2;
  };

  return LongList;

})();
});

;require.register("views/main", function(exports, require, module) {
var AccountView, AppCollection, ApplicationsListView, BaseView, ConfigApplicationsView, DeviceCollection, HelpView, HomeView, IntentManager, MarketView, NavbarView, NotificationCollection, SocketListener, StackAppCollection, ThumbPreloader, User, appIframeTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BaseView = require('lib/base_view');

appIframeTemplate = require('templates/application_iframe');

AppCollection = require('collections/application');

StackAppCollection = require('collections/stackApplication');

NotificationCollection = require('collections/notifications');

DeviceCollection = require('collections/device');

NavbarView = require('views/navbar');

AccountView = require('views/account');

HelpView = require('views/help');

ConfigApplicationsView = require('views/config_applications');

MarketView = require('views/market');

ApplicationsListView = require('views/home');

SocketListener = require('lib/socket_listener');

User = require('models/user');

IntentManager = require('lib/intentManager');

ThumbPreloader = require('lib/thumb_preloader');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  HomeView.prototype.el = 'body';

  HomeView.prototype.template = require('templates/layout');

  HomeView.prototype.subscriptions = {
    'backgroundChanged': 'changeBackground'
  };

  HomeView.prototype.wizards = ['quicktour'];

  function HomeView() {
    this.resetLayoutSizes = __bind(this.resetLayoutSizes, this);
    this.onAppHashChanged = __bind(this.onAppHashChanged, this);
    this.displayUpdateApplication = __bind(this.displayUpdateApplication, this);
    this.displayConfigApplications = __bind(this.displayConfigApplications, this);
    this.displayHelp = __bind(this.displayHelp, this);
    this.displayAccount = __bind(this.displayAccount, this);
    this.displayMarket = __bind(this.displayMarket, this);
    this.displayApplicationsListEdit = __bind(this.displayApplicationsListEdit, this);
    this.displayApplicationsList = __bind(this.displayApplicationsList, this);
    this.displayView = __bind(this.displayView, this);
    this.logout = __bind(this.logout, this);
    this.afterRender = __bind(this.afterRender, this);
    this.apps = new AppCollection(window.applications);
    this.stackApps = new StackAppCollection(window.stack_applications);
    this.devices = new DeviceCollection(window.devices);
    this.market = new AppCollection(window.market_applications);
    this.notifications = new NotificationCollection();
    this.intentManager = new IntentManager();
    SocketListener.watch(this.apps);
    SocketListener.watch(this.notifications);
    SocketListener.watch(this.devices);
    HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.afterRender = function() {
    this.navbar = new NavbarView(this.apps, this.notifications);
    this.applicationListView = new ApplicationsListView(this.apps, this.market);
    this.configApplications = new ConfigApplicationsView(this.apps, this.devices, this.stackApps, this.market);
    this.accountView = new AccountView();
    this.helpView = new HelpView();
    this.marketView = new MarketView(this.apps, this.market);
    this.frames = this.$('#app-frames');
    this.content = this.$('#content');
    this.changeBackground(window.app.instance.background);
    this.backButton = this.$('.back-button');
    this.backButton.hide();
    $(window).resize(this.resetLayoutSizes);
    return this.resetLayoutSizes();
  };

  /* Functions*/


  HomeView.prototype.changeBackground = function(background) {
    var name, val;
    if (background == null) {
      background = 'background_07';
    }
    if (background === void 0 || background === null) {
      this.content.css('background_07.jpg', 'none');
    }
    if (background === 'background-none') {
      return this.content.css('background-image', 'none');
    } else {
      if (background.indexOf('background') > -1) {
        name = background.replace('-', '_');
        val = "url('/img/backgrounds/" + name + ".jpg')";
      } else {
        val = "url('/api/backgrounds/" + background + "/picture.jpg')";
      }
      return this.content.css('background-image', val);
    }
  };

  HomeView.prototype.logout = function(event) {
    var user,
      _this = this;
    user = new User();
    return user.logout({
      success: function(data) {
        return window.location = window.location.origin + '/login/';
      },
      error: function() {
        return alert('Server error occured, logout failed.');
      }
    });
  };

  HomeView.prototype.displayView = function(view, title) {
    var displayView,
      _this = this;
    if (title != null) {
      title = title.substring(6);
    } else {
      if (title == null) {
        title = t('home');
      }
    }
    window.document.title = title;
    $('#current-application').html(title);
    if (view === this.applicationListView) {
      this.backButton.hide();
    } else {
      this.backButton.show();
    }
    displayView = function() {
      _this.frames.hide();
      view.$el.hide();
      _this.content.show();
      $('#home-content').append(view.$el);
      view.$el.show();
      _this.currentView = view;
      _this.resetLayoutSizes();
      return _this.content.scrollTop(0);
    };
    if (this.currentView != null) {
      if (view === this.currentView) {
        this.frames.hide();
        this.content.show();
        this.resetLayoutSizes();
        return;
      }
      this.currentView.$el.hide();
      this.currentView.$el.detach();
      return displayView();
    } else {
      return displayView();
    }
  };

  HomeView.prototype.displayApplicationsList = function(wizard) {
    var WView, options, wiz, wview, _i, _len, _ref;
    if (wizard == null) {
      wizard = null;
    }
    this.displayView(this.applicationListView);
    window.document.title = t("cozy home title");
    _ref = this.wizards;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      wiz = _ref[_i];
      wview = "" + wiz + "WizardView";
      if ((this[wview] != null) && wizard !== wiz) {
        this[wview].dispose();
      }
    }
    if ((wizard != null) && __indexOf.call(this.wizards, wizard) >= 0) {
      wview = "" + wizard + "WizardView";
      WView = require("views/" + wizard + "_wizard");
      if (wizard === 'install') {
        options = {
          market: this.marketView
        };
      }
      this[wview] = new WView(options);
      this.$el.append(this[wview].render().$el);
      return this[wview].show();
    }
  };

  HomeView.prototype.displayApplicationsListEdit = function() {
    return this.displayView(this.applicationListView, t("cozy home title"));
  };

  HomeView.prototype.displayMarket = function() {
    return this.displayView(this.marketView, t("cozy app store title"));
  };

  HomeView.prototype.displayAccount = function() {
    return this.displayView(this.accountView, t('cozy account title'));
  };

  HomeView.prototype.displayHelp = function() {
    return this.displayView(this.helpView, t("cozy help title"));
  };

  HomeView.prototype.displayInstallWizard = function() {
    return this.displayApplicationsList('install');
  };

  HomeView.prototype.displayQuickTourWizard = function() {
    return this.displayApplicationsList('quicktour');
  };

  HomeView.prototype.displayConfigApplications = function() {
    return this.displayView(this.configApplications, t("cozy applications title"));
  };

  HomeView.prototype.displayUpdateApplication = function(slug) {
    var action, method, timeout;
    this.displayView(this.configApplications, t("cozy applications title"));
    window.app.routers.main.navigate('config-applications', false);
    method = this.configApplications.openUpdatePopover;
    action = method.bind(this.configApplications, slug);
    timeout = null;
    if (this.apps.length === 0) {
      this.listenToOnce(this.apps, 'reset', function() {
        clearTimeout(timeout);
        return action();
      });
      return timeout = setTimeout(action, 1500);
    } else {
      return setTimeout(action, 500);
    }
  };

  HomeView.prototype.displayUpdateStack = function() {
    var _this = this;
    this.displayView(this.configApplications);
    window.document.title = t("cozy applications title");
    window.app.routers.main.navigate('config-applications', false);
    return setTimeout(function() {
      return _this.configApplications.onUpdateStackClicked();
    }, 500);
  };

  HomeView.prototype.displayApplication = function(slug, hash) {
    var frame, onLoad,
      _this = this;
    if (this.apps.length === 0) {
      this.apps.once('reset', function() {
        return _this.displayApplication(slug, hash);
      });
      return null;
    }
    this.$("#app-btn-" + slug + " .spinner").toggle();
    this.$("#app-btn-" + slug + " .icon").toggle();
    frame = this.$("#" + slug + "-frame");
    onLoad = function() {
      var name;
      _this.$("#app-btn-" + slug + " .spinner").toggle();
      _this.$("#app-btn-" + slug + " .icon").toggle();
      _this.frames.show();
      _this.content.hide();
      _this.backButton.show();
      _this.$('#app-frames').find('iframe').hide();
      frame.show();
      _this.selectedApp = slug;
      name = _this.apps.get(slug).get('name');
      if (name == null) {
        name = '';
      }
      window.document.title = "Cozy - " + name;
      $("#current-application").html(name);
      return _this.resetLayoutSizes();
    };
    if (frame.length === 0) {
      frame = this.createApplicationIframe(slug, hash);
      return frame.on('load', onLoad);
    } else if (hash) {
      frame.prop('contentWindow').location.hash = hash;
      return onLoad();
    } else {
      return onLoad();
    }
  };

  HomeView.prototype.createApplicationIframe = function(slug, hash) {
    var iframe, iframe$, iframeHTML,
      _this = this;
    if (hash == null) {
      hash = "";
    }
    if ((hash != null ? hash.length : void 0) > 0) {
      hash = "#" + hash;
    }
    iframeHTML = appIframeTemplate({
      id: slug,
      hash: hash
    });
    iframe = this.frames.append(iframeHTML)[0].lastChild;
    iframe$ = $(iframe);
    iframe$.prop('contentWindow').addEventListener('hashchange', function() {
      var location, newhash;
      location = iframe$.prop('contentWindow').location;
      newhash = location.hash.replace('#', '');
      return _this.onAppHashChanged(slug, newhash);
    });
    this.resetLayoutSizes();
    this.intentManager.registerIframe(iframe, '*');
    return iframe$;
  };

  HomeView.prototype.onAppHashChanged = function(slug, newhash) {
    if (slug === this.selectedApp) {
      if (typeof app !== "undefined" && app !== null) {
        app.routers.main.navigate("/apps/" + slug + "/" + newhash, false);
      }
    }
    return this.resetLayoutSizes();
  };

  /* Configuration*/


  HomeView.prototype.resetLayoutSizes = function() {
    this.frames.height($(window).height() - 36);
    if ($(window).width() > 640) {
      return this.content.height($(window).height() - 36);
    } else {
      return this.content.height($(window).height());
    }
  };

  return HomeView;

})(BaseView);
});

;require.register("views/market", function(exports, require, module) {
var AppCollection, Application, ApplicationRow, BaseView, ColorButton, MarketView, PopoverDescriptionView, REPOREGEX, slugify,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

PopoverDescriptionView = require('views/popover_description');

ApplicationRow = require('views/market_application');

ColorButton = require('widgets/install_button');

AppCollection = require('collections/application');

Application = require('models/application');

slugify = require('helpers/slugify');

REPOREGEX = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})(:[0-9]{1,5})?([\/\w\.-]*)*(?:\.git)?(@[\da-zA-Z\/-]+)?$/;

module.exports = MarketView = (function(_super) {
  __extends(MarketView, _super);

  MarketView.prototype.id = 'market-view';

  MarketView.prototype.template = require('templates/market');

  MarketView.prototype.tagName = 'div';

  MarketView.prototype.events = {
    'keyup #app-git-field': 'onEnterPressed',
    "click #your-app .app-install-button": "onInstallClicked"
  };

  /* Constructor*/


  function MarketView(installedApps, marketApps) {
    this.resetForm = __bind(this.resetForm, this);
    this.hideError = __bind(this.hideError, this);
    this.displayError = __bind(this.displayError, this);
    this.displayInfo = __bind(this.displayInfo, this);
    this.runInstallation = __bind(this.runInstallation, this);
    this.hideApplication = __bind(this.hideApplication, this);
    this.onInstallClicked = __bind(this.onInstallClicked, this);
    this.onEnterPressed = __bind(this.onEnterPressed, this);
    this.addApplication = __bind(this.addApplication, this);
    this.onAppListsChanged = __bind(this.onAppListsChanged, this);
    this.afterRender = __bind(this.afterRender, this);
    this.marketApps = marketApps;
    this.installedApps = installedApps;
    MarketView.__super__.constructor.call(this);
  }

  MarketView.prototype.afterRender = function() {
    this.appList = this.$('#market-applications-list');
    this.appGitField = this.$("#app-git-field");
    this.installInfo = this.$("#add-app-modal .loading-indicator");
    this.infoAlert = this.$("#your-app .info");
    this.infoAlert.hide();
    this.errorAlert = this.$("#your-app .error");
    this.errorAlert.hide();
    this.noAppMessage = this.$('#no-app-message');
    this.installAppButton = new ColorButton(this.$("#add-app-submit"));
    this.onAppListsChanged();
    this.listenTo(this.installedApps, 'reset', this.onAppListsChanged);
    this.listenTo(this.installedApps, 'change', this.onAppListsChanged);
    this.listenTo(this.installedApps, 'remove', this.onAppListsChanged);
    return this.listenTo(this.marketApps, 'reset', this.onAppListsChanged);
  };

  MarketView.prototype.onAppListsChanged = function() {
    var installedApps, installeds,
      _this = this;
    installedApps = new AppCollection(this.installedApps.filter(function(app) {
      var _ref;
      return (_ref = app.get('state')) === 'installed' || _ref === 'stopped' || _ref === 'broken';
    }));
    installeds = installedApps.pluck('slug');
    this.marketApps.each(function(app) {
      var slug;
      slug = app.get('slug');
      if (installeds.indexOf(slug) === -1) {
        if (_this.$("#market-app-" + (app.get('slug'))).length === 0) {
          return _this.addApplication(app);
        }
      } else {
        return _this.$("#market-app-" + (app.get('slug'))).remove();
      }
    });
    if (this.$('.cozy-app').length === 0) {
      return this.noAppMessage.show();
    }
  };

  MarketView.prototype.addApplication = function(application) {
    var appButton, row;
    row = new ApplicationRow(application, this);
    this.noAppMessage.hide();
    this.appList.append(row.el);
    appButton = this.$(row.el);
    return appButton.hide().fadeIn();
  };

  MarketView.prototype.onEnterPressed = function(event) {
    var _ref, _ref1;
    if (event.which === 13 && !((_ref = this.popover) != null ? _ref.$el.is(':visible') : void 0)) {
      return this.onInstallClicked(event);
    } else if (event.which === 13) {
      return (_ref1 = this.popover) != null ? _ref1.confirmCallback() : void 0;
    }
  };

  MarketView.prototype.onInstallClicked = function(event) {
    var data;
    data = {
      git: this.$("#app-git-field").val()
    };
    this.parsedGit(data);
    return event.preventDefault();
  };

  MarketView.prototype.parsedGit = function(app) {
    var application, data, icon, parsed;
    parsed = this.parseGitUrl(app.git);
    if (parsed.error) {
      return this.displayError(parsed.msg);
    } else {
      this.hideError();
      application = new Application(parsed);
      if (this.marketApps._byId[application.id]) {
        icon = this.marketApps._byId[application.id].get('icon');
        application.set('icon', icon);
      }
      data = {
        app: application
      };
      return this.showDescription(data);
    }
  };

  MarketView.prototype.showDescription = function(appWidget) {
    var _this = this;
    this.popover = new PopoverDescriptionView({
      model: appWidget.app,
      confirm: function(application) {
        $('#no-app-message').hide();
        _this.popover.hide();
        _this.appList.show();
        if (appWidget.$el) {
          _this.waitApplication(appWidget, true);
          appWidget.$el.addClass('install');
          return _this.runInstallation(appWidget.app, function() {
            return console.log('application installed', appWidget.app);
          }, function() {
            return _this.waitApplication(appWidget, false);
          });
        } else {
          appWidget.app;
          return _this.runInstallation(appWidget.app);
        }
      },
      cancel: function(application) {
        _this.popover.hide();
        return _this.appList.show();
      }
    });
    this.$el.append(this.popover.$el);
    this.popover.show();
    if ($(window).width() <= 640) {
      return this.appList.hide();
    }
  };

  MarketView.prototype.waitApplication = function(appWidget, toggle) {
    if (toggle == null) {
      toggle = true;
    }
    if (toggle) {
      appWidget.installInProgress = true;
      return appWidget.$('.app-img img').attr('src', '/img/spinner.svg');
    } else {
      appWidget.installInProgress = false;
      appWidget.$('.app-img img').attr('src', '');
      return appWidget.$el.removeClass('install');
    }
  };

  MarketView.prototype.hideApplication = function(appWidget, callback) {
    var _this = this;
    if (appWidget.$el != null) {
      return appWidget.$el.fadeOut(function() {
        return setTimeout(function() {
          if (typeof callback === 'function') {
            return callback();
          }
        }, 600);
      });
    } else {
      return callback();
    }
  };

  MarketView.prototype.runInstallation = function(application, shouldRedirect, errCallback) {
    var cb,
      _this = this;
    if (shouldRedirect == null) {
      shouldRedirect = true;
    }
    this.hideError();
    if (typeof shouldRedirect === 'function') {
      cb = shouldRedirect;
    }
    return application.install({
      ignoreMySocketNotification: true,
      success: function(data) {
        if (((data != null ? data.state : void 0) === "broken") || !data.success) {
          alert(data.message);
        } else {
          _this.resetForm();
        }
        if (cb) {
          return cb();
        } else if (shouldRedirect) {
          return typeof app !== "undefined" && app !== null ? app.routers.main.navigate('home', true) : void 0;
        }
      },
      error: function(jqXHR) {
        alert(t(JSON.parse(jqXHR.responseText).message));
        if (typeof errCallback === 'function') {
          return errCallback();
        }
      }
    });
  };

  MarketView.prototype.parseGitUrl = function(url) {
    var branch, domain, error, git, name, out, parsed, parts, path, port, proto, slug;
    url = url.trim();
    url = url.replace('git@github.com:', 'https://github.com/');
    url = url.replace('git://', 'https://');
    parsed = REPOREGEX.exec(url);
    if (parsed == null) {
      error = {
        error: true,
        msg: t("Git url should be of form https://.../my-repo.git")
      };
      return error;
    }
    git = parsed[0], proto = parsed[1], domain = parsed[2], port = parsed[3], path = parsed[4], branch = parsed[5];
    path = path.replace('.git', '');
    parts = path.split("/");
    name = parts[parts.length - 1];
    name = name.replace(/-|_/g, " ");
    name = name.replace('cozy ', '');
    slug = slugify(name);
    if (port == null) {
      port = "";
    }
    git = proto + domain + port + path + '.git';
    if (branch != null) {
      branch = branch.substring(1);
    }
    out = {
      git: git,
      name: name,
      slug: slug
    };
    if (branch != null) {
      out.branch = branch;
    }
    return out;
  };

  MarketView.prototype.displayInfo = function(msg) {
    this.errorAlert.hide();
    this.infoAlert.html(msg);
    return this.infoAlert.show();
  };

  MarketView.prototype.displayError = function(msg) {
    this.infoAlert.hide();
    this.errorAlert.html(msg);
    return this.errorAlert.show();
  };

  MarketView.prototype.hideError = function() {
    return this.errorAlert.hide();
  };

  MarketView.prototype.resetForm = function() {
    return this.appGitField.val('');
  };

  return MarketView;

})(BaseView);
});

;require.register("views/market_application", function(exports, require, module) {
var ApplicationRow, BaseView, ColorButton, REGEXP_SPRITED_SVG,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

ColorButton = require('widgets/install_button');

REGEXP_SPRITED_SVG = /img\/apps\/(.*)\.svg/;

module.exports = ApplicationRow = (function(_super) {
  __extends(ApplicationRow, _super);

  ApplicationRow.prototype.tagName = "div";

  ApplicationRow.prototype.className = "cozy-app";

  ApplicationRow.prototype.template = require('templates/market_application');

  ApplicationRow.prototype.events = {
    "click .btn": "onInstallClicked",
    "click": "onInstallClicked"
  };

  ApplicationRow.prototype.getRenderData = function() {
    var all, app, match, slug;
    app = this.app.toJSON();
    if (match = app.icon.match(REGEXP_SPRITED_SVG)) {
      all = match[0], slug = match[1];
      app = _.extend({}, app, {
        svgSpriteSlug: 'svg-' + slug
      });
    }
    return {
      app: app
    };
  };

  function ApplicationRow(app, marketView) {
    this.app = app;
    this.marketView = marketView;
    this.onInstallClicked = __bind(this.onInstallClicked, this);
    this.afterRender = __bind(this.afterRender, this);
    ApplicationRow.__super__.constructor.call(this);
    this.mouseOut = true;
    this.installInProgress = false;
  }

  ApplicationRow.prototype.afterRender = function() {
    var color, iconNode, slug;
    this.$el.attr('id', "market-app-" + (this.app.get('slug')));
    this.installButton = new ColorButton(this.$("#add-" + this.app.id + "-install"));
    if (this.app.get('comment') === 'official application') {
      this.$el.addClass('official');
    }
    slug = this.app.get('slug');
    color = this.app.get('color');
    if (this.app.get('icon').indexOf('.svg') !== -1) {
      if (color == null) {
        color = ColorHash.getColor(slug, 'cozy');
      }
      iconNode = this.$('.app-img img');
      iconNode.addClass('svg');
      return iconNode.css('background-color', color);
    }
  };

  ApplicationRow.prototype.onInstallClicked = function() {
    if (this.installInProgress) {
      return;
    }
    return this.marketView.showDescription(this, this.installButton);
  };

  return ApplicationRow;

})(BaseView);
});

;require.register("views/menu_application", function(exports, require, module) {
var ApplicationView, BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ApplicationView = (function(_super) {
  __extends(ApplicationView, _super);

  function ApplicationView() {
    _ref = ApplicationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationView.prototype.tagName = 'div';

  ApplicationView.prototype.className = 'menu-application clearfix';

  ApplicationView.prototype.template = require('templates/menu_application');

  return ApplicationView;

})(BaseView);
});

;require.register("views/menu_applications", function(exports, require, module) {
var AppsMenu, ViewCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

module.exports = AppsMenu = (function(_super) {
  __extends(AppsMenu, _super);

  AppsMenu.prototype.el = '#menu-applications-container';

  AppsMenu.prototype.itemView = require('views/menu_application');

  AppsMenu.prototype.template = require('templates/menu_applications');

  function AppsMenu(collection) {
    this.collection = collection;
    AppsMenu.__super__.constructor.apply(this, arguments);
  }

  AppsMenu.prototype.appendView = function(view) {};

  return AppsMenu;

})(ViewCollection);
});

;require.register("views/modal", function(exports, require, module) {
var Modal, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    this.onKeyStroke = __bind(this.onKeyStroke, this);
    _ref = Modal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Modal.prototype.id = 'modal-dialog';

  Modal.prototype.className = 'modalCY fade';

  Modal.prototype.attributes = {
    'data-backdrop': "static",
    'data-keyboard': "false"
  };

  Modal.prototype.initialize = function(options) {
    var _this = this;
    if (this.title == null) {
      this.title = options.title;
    }
    if (this.content == null) {
      this.content = options.content;
    }
    if (this.yes == null) {
      this.yes = options.yes || 'ok';
    }
    if (this.no == null) {
      this.no = options.no || 'cancel';
    }
    if (this.cb == null) {
      this.cb = options.cb || function() {};
    }
    this.render();
    if (options.cssSpaceName != null) {
      this.el.classList.add(options.cssSpaceName);
    }
    this.saving = false;
    this.el.tabIndex = 0;
    this.el.focus();
    this.$('button.close').click(function(event) {
      event.stopPropagation();
      return _this.onNo();
    });
    return this.$el.on('keyup', this.onKeyStroke);
  };

  Modal.prototype.events = function() {
    return {
      "click #modal-dialog-no": 'onNo',
      "click #modal-dialog-yes": 'onYes',
      'click': 'onClickAnywhere'
    };
  };

  Modal.prototype.onNo = function() {
    this.close();
    return this.cb(false);
  };

  Modal.prototype.onYes = function() {
    this.close();
    return this.cb(true);
  };

  Modal.prototype.close = function() {
    var _this = this;
    if (this.closing) {
      return;
    }
    this.closing = true;
    this.backdrop.parentElement.removeChild(this.backdrop);
    this.el.classList.remove('in');
    this.el.classList.add('out');
    return setTimeout((function() {
      return _this.remove();
    }), 500);
  };

  Modal.prototype.onKeyStroke = function(e) {
    e.stopPropagation();
    if (e.which === 27) {
      this.onNo();
      return false;
    }
  };

  Modal.prototype.remove = function() {
    this.$el.off('keyup', this.onKeyStroke);
    return Modal.__super__.remove.apply(this, arguments);
  };

  Modal.prototype.render = function() {
    var body, close, foot, head, title, yesBtn;
    close = $('<button class="close" type="button" data-dismiss="modal">×</button>');
    title = $('<p>').text(this.title);
    head = $('<div class="modalCY-header">').append(close, title);
    body = $('<div class="modalCY-body"></div>').append(this.renderContent());
    yesBtn = $('<button id="modal-dialog-yes" class="btn btn-cozy">').text(this.yes);
    foot = $('<div class="modalCY-footer">').append(yesBtn);
    if (this.no) {
      foot.prepend($('<button id="modal-dialog-no" class="btn btn-link">').text(this.no));
    }
    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('modalCY-backdrop');
    $("body").append(this.backdrop);
    $("body").append(this.$el.append(head, body, foot));
    window.getComputedStyle(this.el).opacity;
    window.getComputedStyle(this.el).top;
    return this.$el.addClass('in');
  };

  Modal.prototype.renderContent = function() {
    return this.content;
  };

  Modal.prototype.onClickAnywhere = function(event) {
    if (event.target.id === this.id) {
      return this.onNo();
    }
  };

  return Modal;

})(Backbone.View);

Modal.alert = function(title, content, cb) {
  return new Modal({
    title: title,
    content: content,
    yes: 'ok',
    no: null,
    cb: cb
  });
};

Modal.confirm = function(title, content, yesMsg, noMsg, cb) {
  return new Modal({
    title: title,
    content: content,
    yes: yesMsg,
    no: noMsg,
    cb: cb
  });
};

Modal.error = function(text, cb) {
  return new Modal({
    title: t('modal error'),
    content: text,
    yes: t('modal ok'),
    no: false,
    cb: cb
  });
};

module.exports = Modal;
});

;require.register("views/navbar", function(exports, require, module) {
var AppsMenu, BaseView, NavbarView, NotificationsView, appButtonTemplate,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

appButtonTemplate = require("templates/navbar_app_btn");

NotificationsView = require('./notifications_view');

AppsMenu = require('./menu_applications');

module.exports = NavbarView = (function(_super) {
  __extends(NavbarView, _super);

  NavbarView.prototype.el = '.navbar';

  NavbarView.prototype.template = require('templates/navbar');

  function NavbarView(apps, notifications) {
    this.afterRender = __bind(this.afterRender, this);
    this.apps = apps;
    this.notifications = notifications;
    NavbarView.__super__.constructor.call(this);
  }

  NavbarView.prototype.afterRender = function() {
    this.notifications = new NotificationsView({
      collection: this.notifications
    });
    return this.appMenu = new AppsMenu(this.apps);
  };

  return NavbarView;

})(BaseView);
});

;require.register("views/notification_view", function(exports, require, module) {
var BaseView, NotificationView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = NotificationView = (function(_super) {
  __extends(NotificationView, _super);

  function NotificationView() {
    _ref = NotificationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationView.prototype.tagName = 'li';

  NotificationView.prototype.className = 'notification clearfix';

  NotificationView.prototype.template = require('templates/notification');

  NotificationView.prototype.events = {
    "click .doaction": "onActionClicked",
    "click .dismiss": "onDismissClicked"
  };

  NotificationView.prototype.getRenderData = function() {
    return {
      model: _.extend(this.model.attributes, {
        actionText: this.actionText || null,
        date: moment(parseInt(this.model.get('publishDate'))).fromNow()
      })
    };
  };

  NotificationView.prototype.initialize = function() {
    var action;
    this.listenTo(this.model, 'change', this.render);
    action = this.model.get('resource');
    if (action != null) {
      if ((action.app != null) && action.app !== 'home') {
        return this.actionText = 'notification open application';
      } else if (action.url != null) {
        if (action.url.indexOf('update-stack') >= 0) {
          return this.actionText = 'notification update stack';
        } else if (action.url.indexOf('update') >= 0) {
          return this.actionText = 'notification update application';
        }
      }
    }
  };

  NotificationView.prototype.onActionClicked = function() {
    var action, url;
    action = this.model.get('resource');
    if (action == null) {
      action = {
        app: home
      };
    }
    if (typeof action === 'string') {
      url = action;
    } else if (action.app != null) {
      url = action.app === 'home' ? "/" : "/apps/" + action.app + "/";
      url += action.url || '';
      url = url.replace('//', '/');
    } else {
      url = null;
    }
    if (url) {
      return window.app.routers.main.navigate(url, true);
    }
  };

  NotificationView.prototype.onDismissClicked = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    if (event != null) {
      event.stopPropagation();
    }
    return this.model.destroy();
  };

  return NotificationView;

})(BaseView);
});

;require.register("views/notifications_view", function(exports, require, module) {
var Notification, NotificationsView, SocketListener, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

SocketListener = require('lib/socket_listener');

Notification = require('models/notification');

SocketListener = require('../lib/socket_listener');

module.exports = NotificationsView = (function(_super) {
  __extends(NotificationsView, _super);

  function NotificationsView() {
    this.dismissAll = __bind(this.dismissAll, this);
    this.hideNotifList = __bind(this.hideNotifList, this);
    this.showNotifList = __bind(this.showNotifList, this);
    this.windowClicked = __bind(this.windowClicked, this);
    this.checkIfEmpty = __bind(this.checkIfEmpty, this);
    this.remove = __bind(this.remove, this);
    this.afterRender = __bind(this.afterRender, this);
    _ref = NotificationsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NotificationsView.prototype.el = '#notifications-container';

  NotificationsView.prototype.itemView = require('views/notification_view');

  NotificationsView.prototype.template = require('templates/notifications');

  NotificationsView.prototype.events = {
    "click #notifications-toggle": "showNotifList",
    "click #clickcatcher": "hideNotifList"
  };

  NotificationsView.prototype.initialize = function() {
    NotificationsView.__super__.initialize.apply(this, arguments);
    return this.initializing = true;
  };

  NotificationsView.prototype.appendView = function(view) {
    if (this.notifList == null) {
      this.notifList = $('#notifications-list');
    }
    this.notifList.prepend(view.el);
    if (!this.initializing) {
      return this.sound.play();
    }
  };

  NotificationsView.prototype.afterRender = function() {
    this.counter = this.$('#notifications-counter');
    this.counter.html('10');
    this.clickcatcher = this.$('#clickcatcher');
    this.clickcatcher.hide();
    this.noNotifMsg = $('#no-notif-msg');
    this.notifList = $('#notifications-list');
    this.hideNotifList();
    this.sound = $('#notification-sound')[0];
    this.dismissButton = $("#dismiss-all");
    this.dismissButton.click(this.dismissAll);
    NotificationsView.__super__.afterRender.apply(this, arguments);
    this.initializing = false;
    return this.collection.fetch();
  };

  NotificationsView.prototype.remove = function() {
    return NotificationsView.__super__.remove.apply(this, arguments);
  };

  NotificationsView.prototype.checkIfEmpty = function() {
    var imgPath, newCount;
    newCount = this.collection.length;
    this.noNotifMsg.toggle(newCount === 0);
    if (newCount === 0) {
      this.counter.html("");
      this.counter.hide();
      imgPath = 'img/notification-white.png';
      this.$('#notifications-toggle img').attr('src', imgPath);
      return this.$('#notifications-toggle').removeClass('highlight');
    } else {
      this.counter.html(newCount);
      return this.counter.show();
    }
  };

  NotificationsView.prototype.windowClicked = function() {
    if ((typeof event !== "undefined" && event !== null) && this.$el.has($(event.target)).length === 0) {
      return this.hideNotifList();
    }
  };

  NotificationsView.prototype.showNotifList = function() {
    if ($('.right-menu').is(':visible')) {
      return this.hideNotifList();
    } else {
      $('.right-menu').show();
      this.clickcatcher.show();
      return this.$('#notifications-toggle').addClass('highlight');
    }
  };

  NotificationsView.prototype.hideNotifList = function(event) {
    $('.right-menu').hide();
    this.clickcatcher.hide();
    return this.$('#notifications-toggle').removeClass('highlight');
  };

  NotificationsView.prototype.dismissAll = function() {
    var _this = this;
    this.dismissButton.spin(true);
    return this.collection.removeAll({
      success: function() {
        return _this.dismissButton.spin(false);
      },
      error: function() {
        return _this.dismissButton.spin(false);
      }
    });
  };

  return NotificationsView;

})(ViewCollection);
});

;require.register("views/object-picker-album", function(exports, require, module) {
var BaseView, ObjectPickerAlbum, Photo, client,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Photo = require('../models/photo');

BaseView = require('lib/base_view');

client = require('../lib/client');

module.exports = ObjectPickerAlbum = (function(_super) {
  __extends(ObjectPickerAlbum, _super);

  ObjectPickerAlbum.prototype.tagName = "section";

  function ObjectPickerAlbum(modal) {
    this._updateThumbs = __bind(this._updateThumbs, this);
    this._getAlbumPhotos = __bind(this._getAlbumPhotos, this);
    this._initAlbum = __bind(this._initAlbum, this);
    this._unselectAll = __bind(this._unselectAll, this);
    this._toggleOnThumb$ = __bind(this._toggleOnThumb$, this);
    this._clickHandler = __bind(this._clickHandler, this);
    this._dblclickHandler = __bind(this._dblclickHandler, this);
    this.modal = modal;
    ObjectPickerAlbum.__super__.constructor.call(this);
  }

  ObjectPickerAlbum.prototype.initialize = function() {
    this.name = 'albumPicker';
    this.tabLabel = 'album';
    this.tab = $("<div>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    this.albums$ = $('<div class="albums"></div>')[0];
    this.thumbs$ = $('<div class="thumbs"><img></img></div>')[0];
    this.panel.appendChild(this.albums$);
    this.panel.appendChild(this.thumbs$);
    this._getAlbums();
    this.selectedThumbs = {};
    this.thumbs$.addEventListener('click', this._clickHandler);
    return this.thumbs$.addEventListener('dblclick', this._dblclickHandler);
  };

  ObjectPickerAlbum.prototype.getObject = function() {
    var id, photo, res, thumb$, _ref;
    _ref = this.selectedThumbs;
    for (id in _ref) {
      thumb$ = _ref[id];
      if (thumb$) {
        break;
      }
    }
    photo = thumb$.photo;
    res = {
      id: photo.id,
      docType: 'photo',
      name: photo.title,
      urlToFetch: "photos/raws/" + photo.id + ".jpg"
    };
    return res;
  };

  ObjectPickerAlbum.prototype.setFocusIfExpected = function() {
    return false;
  };

  ObjectPickerAlbum.prototype.keyHandler = function(e) {};

  ObjectPickerAlbum.prototype.resizeHandler = function() {
    var colWidth, margin, thumbStyle, width;
    thumbStyle = window.getComputedStyle(this.thumbs$.children[0]);
    colWidth = parseInt(thumbStyle.width) + parseInt(thumbStyle.marginLeft) + parseInt(thumbStyle.marginRight) + 2;
    width = this.thumbs$.clientWidth;
    margin = Math.floor((width % colWidth) / 2);
    return this.thumbs$.style.paddingLeft = margin + 'px';
  };

  ObjectPickerAlbum.prototype._dblclickHandler = function(e) {
    var thumb$;
    console.log('dblClick', e.target);
    thumb$ = e.target;
    if (!this._toggleOnThumb$(thumb$)) {
      return;
    }
    return this.modal.onYes();
  };

  ObjectPickerAlbum.prototype._clickHandler = function(e) {
    var th;
    console.log('click', e.target);
    th = e.target;
    if (th.nodeName !== 'IMG') {
      return;
    }
    if (!this._toggleOnThumb$(th)) {
      return null;
    }
    return th.classList.add('selected');
  };

  ObjectPickerAlbum.prototype._toggleOnThumb$ = function(thumb$) {
    if (thumb$.classList.contains('selected')) {
      return true;
    }
    if (thumb$.nodeName !== 'IMG') {
      return false;
    }
    this._unselectAll();
    thumb$.classList.add('selected');
    this.selectedThumbs[thumb$.dataset.id] = thumb$;
    return true;
  };

  ObjectPickerAlbum.prototype._unselectAll = function() {
    var id, thumb$, _ref, _results;
    _ref = this.selectedThumbs;
    _results = [];
    for (id in _ref) {
      thumb$ = _ref[id];
      if (typeof thumb$ === 'object') {
        thumb$.classList.remove('selected');
        _results.push(this.selectedThumbs[id] = false);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ObjectPickerAlbum.prototype._getAlbums = function() {
    var _this = this;
    return client.get("albums/?", function(err, res) {
      var album, albumLabel$, n, _i, _len;
      if (err) {
        console.log(err);
        return;
      }
      if (res.length === 0) {
        _this.panel.removeChild(_this.albums$);
        _this.panel.removeChild(_this.thumbs$);
        _this.panel.classList.add('noAlbum');
        $(_this.panel).append("<div></div><div class='noAlbumDisclaimer'>" + (t('you have no album')) + "</div><div></div>");
        return;
      }
      n = 0;
      for (_i = 0, _len = res.length; _i < _len; _i++) {
        album = res[_i];
        albumLabel$ = _this._initAlbum(album);
        if (n === 0) {
          _this.previousSelectedAlbum$ = albumLabel$;
          albumLabel$.classList.add('selectedAlbum');
          _this._getAlbumPhotos(album.id);
        }
        n += 1;
      }
      return _this.resizeHandler();
    });
  };

  ObjectPickerAlbum.prototype._initAlbum = function(album) {
    var cover, el, label,
      _this = this;
    el = $(require('../templates/album_thumb')())[0];
    cover = el.querySelector('.cover');
    label = el.querySelector('.label');
    cover.src = "photos/thumbs/" + album.coverPicture + ".jpg";
    label.textContent = album.title;
    this.albums$.appendChild(el);
    el.addEventListener('click', function(event) {
      _this.previousSelectedAlbum$.classList.remove('selectedAlbum');
      el.classList.add('selectedAlbum');
      _this.previousSelectedAlbum$ = el;
      return _this._getAlbumPhotos(album.id);
    });
    return el;
  };

  ObjectPickerAlbum.prototype._getAlbumPhotos = function(albumId) {
    var _this = this;
    return client.get("albums/" + albumId, function(err, res) {
      if (err) {
        return;
      }
      _this._updateThumbs(res);
      return _this._toggleOnThumb$(_this.thumbs$.children[0]);
    });
  };

  ObjectPickerAlbum.prototype._updateThumbs = function(res) {
    var nPhoto, photoId, photoRank, photos, thumb, _i, _j, _len, _ref, _ref1, _results;
    photos = res.photos;
    nPhoto = photos.length;
    photoRank = 0;
    _ref = this.thumbs$.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      thumb = _ref[_i];
      if (photoRank >= nPhoto) {
        thumb.classList.add("hide");
        thumb.src = '';
        thumb.dataset.id = '';
        thumb.photo = null;
      } else {
        thumb.classList.remove("hide");
        thumb.dataset.id = photoId = photos[photoRank].id;
        thumb.src = "photos/thumbs/" + photoId + ".jpg";
        thumb.photo = photos[photoRank];
      }
      photoRank += 1;
    }
    _results = [];
    for (photoRank = _j = photoRank, _ref1 = nPhoto - 1; _j <= _ref1; photoRank = _j += 1) {
      thumb = document.createElement('img');
      thumb.src = "photos/thumbs/" + photos[photoRank].id + ".jpg";
      thumb.photo = photos[photoRank];
      _results.push(this.thumbs$.appendChild(thumb));
    }
    return _results;
  };

  return ObjectPickerAlbum;

})(BaseView);
});

;require.register("views/object-picker-image", function(exports, require, module) {
var BaseView, LongList, ObjectPickerImage, Photo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Photo = require('../models/photo');

LongList = require('views/long-list-images');

BaseView = require('lib/base_view');

module.exports = ObjectPickerImage = (function(_super) {
  __extends(ObjectPickerImage, _super);

  ObjectPickerImage.prototype.tagName = "section";

  function ObjectPickerImage(modal) {
    this.modal = modal;
    ObjectPickerImage.__super__.constructor.call(this);
  }

  ObjectPickerImage.prototype.initialize = function() {
    this.name = 'thumbPicker';
    this.tabLabel = 'image';
    this.tab = $("<div>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    return this.longList = new LongList(this.panel, this.modal);
  };

  ObjectPickerImage.prototype.getObject = function() {
    var file;
    file = this.longList.getSelectedFile();
    if (file) {
      return {
        id: file.id,
        docType: 'file',
        name: file.name
      };
    }
    return false;
  };

  ObjectPickerImage.prototype.setFocusIfExpected = function() {
    return false;
  };

  ObjectPickerImage.prototype.setInitialDimensions = function(width, heigth) {
    return this.longList.setInitialDimensions(width, heigth);
  };

  ObjectPickerImage.prototype.keyHandler = function(e) {
    this.longList.keyHandler(e);
  };

  ObjectPickerImage.prototype.resizeHandler = function() {
    return this.longList.resizeHandler();
  };

  return ObjectPickerImage;

})(BaseView);
});

;require.register("views/object-picker-photoURL", function(exports, require, module) {
var BaseView, ObjectPickerPhotoURL, proxyclient, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

proxyclient = require('lib/proxyclient');

BaseView = require('lib/base_view');

module.exports = ObjectPickerPhotoURL = (function(_super) {
  __extends(ObjectPickerPhotoURL, _super);

  function ObjectPickerPhotoURL() {
    _ref = ObjectPickerPhotoURL.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ObjectPickerPhotoURL.prototype.template = require('../templates/object-picker-photoURL');

  ObjectPickerPhotoURL.prototype.tagName = 'section';

  ObjectPickerPhotoURL.prototype.initialize = function() {
    this.render();
    this.name = 'urlPhotoUpload';
    this.tabLabel = 'url';
    this.tab = $("<div>" + this.tabLabel + "</div>")[0];
    this.panel = this.el;
    this.img = this.panel.querySelector('.url-preview');
    this.blocContainer = this.panel.querySelector('.bloc-container');
    this.url = void 0;
    this.input = this.panel.querySelector('.modal-url-input');
    return this._setupInput();
  };

  ObjectPickerPhotoURL.prototype.getObject = function() {
    if (this.url) {
      return {
        urlToFetch: this.url
      };
    } else {
      return false;
    }
  };

  ObjectPickerPhotoURL.prototype.setFocusIfExpected = function() {
    this.input.focus();
    this.input.select();
    return true;
  };

  ObjectPickerPhotoURL.prototype.keyHandler = function(e) {
    return false;
  };

  /**
   * manages the url typed in the input and update image
  */


  ObjectPickerPhotoURL.prototype._setupInput = function() {
    var img, imgTmp, preloadImage, urlRegexp,
      _this = this;
    img = this.img;
    urlRegexp = /\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i;
    imgTmp = new Image();
    imgTmp.onerror = function() {
      img.style.backgroundImage = "";
      return this.url = void 0;
    };
    imgTmp.onload = function() {
      img.style.maxWidth = imgTmp.naturalWidth + 'px';
      img.style.maxHeight = imgTmp.naturalHeight + 'px';
      img.parentElement.style.display = 'flex';
      img.style.backgroundImage = 'url(' + imgTmp.src + ')';
      _this.url = imgTmp.src;
      return _this.blocContainer.style.height = (imgTmp.naturalHeight + 40) + 'px';
    };
    preloadImage = function(src) {
      return imgTmp.src = src;
    };
    return this.input.addEventListener('input', function(e) {
      var newurl, url;
      newurl = e.target.value;
      if (urlRegexp.test(newurl)) {
        url = 'api/proxy/?url=' + encodeURIComponent(newurl);
        return preloadImage(url);
      } else {
        img.style.backgroundImage = "";
        return this.url = void 0;
      }
    }, false);
  };

  return ObjectPickerPhotoURL;

})(BaseView);
});

;require.register("views/object-picker-upload", function(exports, require, module) {
var BaseView, ObjectPickerUpload,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ObjectPickerUpload = (function(_super) {
  __extends(ObjectPickerUpload, _super);

  ObjectPickerUpload.prototype.template = require('../templates/object-picker-upload');

  ObjectPickerUpload.prototype.tagName = "section";

  function ObjectPickerUpload(objectPicker) {
    this._handleFile = __bind(this._handleFile, this);
    this._handleUploaderChange = __bind(this._handleUploaderChange, this);
    this._changePhotoFromUpload = __bind(this._changePhotoFromUpload, this);
    this.keyHandler = __bind(this.keyHandler, this);
    ObjectPickerUpload.__super__.constructor.call(this);
    this.objectPicker = objectPicker;
  }

  ObjectPickerUpload.prototype.initialize = function() {
    var btn;
    this.render();
    this.name = 'photoUpload';
    this.tabLabel = 'upload';
    this.tab = this._createTab();
    this.panel = this.el;
    this._bindFileDropZone();
    btn = this.panel.querySelector('.photoUpload-btn');
    btn.addEventListener('click', this._changePhotoFromUpload);
    this.btn = btn;
    this.uploader = this.panel.querySelector('.uploader');
    return this.uploader.addEventListener('change', this._handleUploaderChange);
  };

  ObjectPickerUpload.prototype.getObject = function() {
    return {
      dataUrl: this.dataUrl
    };
  };

  ObjectPickerUpload.prototype.setFocusIfExpected = function() {
    this.btn.focus();
    return true;
  };

  ObjectPickerUpload.prototype.keyHandler = function(e) {
    return false;
  };

  ObjectPickerUpload.prototype._createTab = function() {
    return $("<div>" + this.tabLabel + "</div>")[0];
  };

  ObjectPickerUpload.prototype._bindFileDropZone = function() {
    var dragenter, dragover, drop, dropbox, hasEnteredText,
      _this = this;
    dropbox = this.panel.querySelector(".modal-file-drop-zone>div");
    hasEnteredText = false;
    dropbox.addEventListener("dragenter", function(e) {
      e.stopPropagation();
      e.preventDefault();
      return dropbox.classList.add('dragging');
    }, false);
    dropbox.addEventListener("dragleave", function(e) {
      e.stopPropagation();
      e.preventDefault();
      return dropbox.classList.remove('dragging');
    }, false);
    dragenter = function(e) {
      e.stopPropagation();
      return e.preventDefault();
    };
    drop = function(e) {
      var dt, files;
      e.stopPropagation();
      e.preventDefault();
      dt = e.dataTransfer;
      files = dt.files;
      return _this._handleFile(files[0]);
    };
    dragover = dragenter;
    dropbox.addEventListener("dragover", dragover, false);
    return dropbox.addEventListener("drop", drop, false);
  };

  ObjectPickerUpload.prototype._changePhotoFromUpload = function() {
    this.uploadPopupOpened = true;
    return this.uploader.click();
  };

  ObjectPickerUpload.prototype._handleUploaderChange = function() {
    var file;
    file = this.uploader.files[0];
    return this._handleFile(file);
  };

  ObjectPickerUpload.prototype._handleFile = function(file) {
    var img, reader,
      _this = this;
    if (!file.type.match(/image\/.*/)) {
      return alert(t('This is not an image'));
    }
    reader = new FileReader();
    img = new Image();
    reader.readAsDataURL(file);
    return reader.onloadend = function() {
      _this.dataUrl = reader.result;
      return _this.objectPicker.onYes();
    };
  };

  return ObjectPickerUpload;

})(BaseView);
});

;require.register("views/object-picker", function(exports, require, module) {
var CHOOSE_AGAIN_MARGIN, MARGIN_BETWEEN_IMG_AND_CROPED, Modal, ObjectPickerAlbum, ObjectPickerImage, ObjectPickerPhotoURL, ObjectPickerUpload, PhotoPickerCroper, THUMB_HEIGHT, THUMB_WIDTH, tabControler, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Modal = require('../views/modal');

template = require('../templates/object-picker');

ObjectPickerPhotoURL = require('./object-picker-photoURL');

ObjectPickerUpload = require('./object-picker-upload');

ObjectPickerImage = require('./object-picker-image');

ObjectPickerAlbum = require('./object-picker-album');

tabControler = require('views/tab-controler');

MARGIN_BETWEEN_IMG_AND_CROPED = 30;

THUMB_WIDTH = 100;

THUMB_HEIGHT = 100;

CHOOSE_AGAIN_MARGIN = 17;

module.exports = PhotoPickerCroper = (function(_super) {
  __extends(PhotoPickerCroper, _super);

  function PhotoPickerCroper() {
    this._updateCropedPreview = __bind(this._updateCropedPreview, this);
    this._onImgToCropLoaded = __bind(this._onImgToCropLoaded, this);
    this._showCropingTool = __bind(this._showCropingTool, this);
    this._onImgResultLoaded = __bind(this._onImgResultLoaded, this);
    this.resizeHandler = __bind(this.resizeHandler, this);
    _ref = PhotoPickerCroper.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PhotoPickerCroper.prototype.events = function() {
    return _.extend(PhotoPickerCroper.__super__.events.apply(this, arguments), {
      'click    a.next': 'displayMore',
      'click    a.prev': 'displayPrevPage',
      'click    .chooseAgain': '_chooseAgain'
    });
  };

  PhotoPickerCroper.prototype.initialize = function(params, cb) {
    var body, previewTops;
    this.id = 'object-picker';
    this.title = t('pick from files');
    this.config = {
      cssSpaceName: "object-picker",
      singleSelection: true,
      numPerPage: 50,
      yes: t('modal ok'),
      no: t('modal cancel'),
      cb: cb,
      target_h: 100,
      target_w: 100
    };
    this.params = params;
    this.state = {
      currentStep: 'objectPicker',
      img_naturalW: 0,
      img_naturalH: 0
    };
    PhotoPickerCroper.__super__.initialize.call(this, this.config);
    body = this.el.querySelector('.modalCY-body');
    body.innerHTML = template();
    this.body = body;
    this.objectPickerCont = body.querySelector('.objectPickerCont');
    this.tablist = body.querySelector('[role=tablist]');
    this.imgResult = body.querySelector('#img-result');
    this.cropper$ = this.el.querySelector('.croperCont');
    this.framePreview = this.cropper$.querySelector('#frame-preview');
    this.frameToCrop = this.cropper$.querySelector('.frame-to-crop');
    this.imgToCrop = this.cropper$.querySelector('#img-to-crop');
    this.imgPreview = this.cropper$.querySelector('#img-preview');
    this.chooseAgain = this.cropper$.querySelector('.chooseAgain');
    this.panelsControlers = {};
    this.imagePanel = new ObjectPickerImage(this);
    tabControler.addTab(this.objectPickerCont, this.tablist, this.imagePanel);
    this.panelsControlers[this.imagePanel.name] = this.imagePanel;
    this.albumPanel = new ObjectPickerAlbum(this);
    tabControler.addTab(this.objectPickerCont, this.tablist, this.albumPanel);
    this.panelsControlers[this.albumPanel.name] = this.albumPanel;
    this.photoURLpanel = new ObjectPickerPhotoURL();
    tabControler.addTab(this.objectPickerCont, this.tablist, this.photoURLpanel);
    this.panelsControlers[this.photoURLpanel.name] = this.photoURLpanel;
    this.uploadPanel = new ObjectPickerUpload(this);
    tabControler.addTab(this.objectPickerCont, this.tablist, this.uploadPanel);
    this.panelsControlers[this.uploadPanel.name] = this.uploadPanel;
    tabControler.initializeTabs(body);
    this._listenTabsSelection();
    this._selectDefaultTab(this.imagePanel.name);
    this.imgToCrop.addEventListener('load', this._onImgToCropLoaded, false);
    this.cropper$.style.visibility = 'hidden';
    this.framePreview.style.width = THUMB_WIDTH + 'px';
    this.framePreview.style.height = THUMB_HEIGHT + 'px';
    previewTops = this.cropper$.clientHeight - this.chooseAgain.offsetHeight - CHOOSE_AGAIN_MARGIN - THUMB_HEIGHT;
    this.framePreview.style.top = Math.round(previewTops / 2) + 'px';
    this.framePreview.style.right = 0;
    this.imgResult.addEventListener('load', this._onImgResultLoaded, false);
    window.addEventListener('resize', this.resizeHandler);
    return true;
  };

  PhotoPickerCroper.prototype.onYes = function() {
    var dimension, obj, url;
    obj = this.state.activePanel.getObject();
    if (!this.params.isCropped) {
      this._sendResult(obj);
      return;
    }
    if (this.state.currentStep === 'objectPicker') {
      url = this._getUrlForCropping(obj);
      if (url) {
        return this._showCropingTool(url);
      }
    } else {
      dimension = this._getCroppedDimensions();
      this.cb(true, this._getResultDataURL(this.imgPreview, dimension));
      return this.close();
    }
  };

  PhotoPickerCroper.prototype.resizeHandler = function(event) {
    if (this.state.activePanel.resizeHandler) {
      return this.state.activePanel.resizeHandler();
    }
  };

  PhotoPickerCroper.prototype._sendResult = function(obj) {
    if (obj.dataUrl) {
      this.cb(true, obj.dataUrl);
      this.close();
      return;
    }
    if (obj.urlToFetch) {
      this.imgResult.src = obj.urlToFetch;
      return;
    }
    if ((obj.docType != null) && obj.docType === 'file' && (obj.id != null)) {
      if (obj.id) {
        this.imgResult.src = "files/photo/" + obj.id + ".jpg";
      }
    }
  };

  PhotoPickerCroper.prototype._getUrlForCropping = function(obj) {
    if (obj.urlToFetch) {
      return obj.urlToFetch;
    }
    if (obj.dataUrl) {
      return obj.dataUrl;
    }
    if ((obj.docType != null) && obj.docType === 'file' && (obj.id != null)) {
      return "files/photo/screens/" + obj.id + ".jpg";
    }
  };

  PhotoPickerCroper.prototype._onImgResultLoaded = function(e) {
    this.cb(true, this._getResultDataURL(this.imgResult, null));
    return this.close();
  };

  /**
   * returns the coordonates of the region to cropp into the original image
   * (imgPreview)
   * @return {Object} #
   *   # sx      : x of the top left corner
   *   # sy      : y of the top left corner
   *   # sWidth  : widht of the region to crop
   *   # sHeight : height of the region to crop
  */


  PhotoPickerCroper.prototype._getCroppedDimensions = function() {
    var d, r, s;
    s = this.imgPreview.style;
    r = this.state.img_naturalW / this.imgPreview.width;
    d = {
      sx: Math.round(-parseInt(s.marginLeft) * r),
      sy: Math.round(-parseInt(s.marginTop) * r),
      sWidth: Math.round(this.config.target_h * r),
      sHeight: Math.round(this.config.target_w * r)
    };
    if (d.sx < 0) {
      d.sx = 0;
    }
    if (d.sy < 0) {
      d.sy = 0;
    }
    if (d.sx + d.sWidth > this.imgPreview.naturalWidth) {
      d.sWidth = this.imgPreview.naturalWidth - d.sx;
    }
    if (d.sy + d.sHeight > this.imgPreview.naturalHeight) {
      d.sHeight = this.imgPreview.naturalHeight - d.sy;
    }
    return d;
  };

  PhotoPickerCroper.prototype._getResultDataURL = function(img, dimensions) {
    var IMAGE_DIMENSION, canvas, ctx, d, dataUrl;
    IMAGE_DIMENSION = 600;
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    if (dimensions) {
      canvas.height = canvas.width = IMAGE_DIMENSION;
      d = dimensions;
      ctx.drawImage(img, d.sx, d.sy, d.sWidth, d.sHeight, 0, 0, IMAGE_DIMENSION, IMAGE_DIMENSION);
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
    return dataUrl = canvas.toDataURL('image/jpeg');
  };

  PhotoPickerCroper.prototype.onKeyStroke = function(e) {
    if (e.which === 13) {
      e.stopPropagation();
      this.onYes();
      return;
    }
    if (e.which === 27) {
      e.stopPropagation();
      if (this.state.currentStep === 'croper') {
        this._chooseAgain();
      } else {
        this.onNo();
      }
      return;
    }
    return this.state.activePanel.keyHandler(e);
  };

  PhotoPickerCroper.prototype._showCropingTool = function(url) {
    this.state.currentStep = 'croper';
    this.currentPhotoScroll = this.body.scrollTop;
    this.objectPickerCont.style.visibility = 'hidden';
    this.cropper$.style.visibility = '';
    this._imgToCropTemp = new Image();
    this._imgToCropTemp.id = 'img-to-crop';
    this._imgToCropTemp.addEventListener('load', this._onImgToCropLoaded, false);
    this._imgToCropTemp.src = url;
    return this.imgPreview.src = url;
  };

  /**
   * triggered when the image to crop is loaded, will compute the geometry
   * and initialize jCrop
  */


  PhotoPickerCroper.prototype._onImgToCropLoaded = function() {
    var cropTop, frame_H, frame_W, img_h, img_w, margin, natural_h, natural_w, options, selection_w, t, x, y;
    natural_h = this._imgToCropTemp.naturalHeight;
    natural_w = this._imgToCropTemp.naturalWidth;
    frame_H = this.cropper$.clientHeight - this.chooseAgain.offsetHeight - CHOOSE_AGAIN_MARGIN;
    frame_W = this.cropper$.clientWidth - MARGIN_BETWEEN_IMG_AND_CROPED - THUMB_WIDTH;
    if (frame_H < natural_h || frame_W < natural_w) {
      if (frame_H / frame_W > natural_h / natural_w) {
        img_w = Math.round(frame_W);
        img_h = Math.round(frame_W * natural_h / natural_w);
      } else {
        img_h = Math.round(frame_H);
        img_w = Math.round(frame_H * natural_w / natural_h);
      }
      this._imgToCropTemp.style.width = img_w + 'px';
      this._imgToCropTemp.style.height = img_h + 'px';
    } else {
      img_w = natural_w;
      img_h = natural_h;
    }
    this.frameToCrop.style.width = img_w + 'px';
    this.frameToCrop.style.height = img_h + 'px';
    this.img_w = img_w;
    this.img_h = img_h;
    this.state.img_naturalW = natural_w;
    this.state.img_naturalH = natural_h;
    this.imgToCrop.parentElement.appendChild(this._imgToCropTemp);
    this.imgToCrop.parentElement.removeChild(this.imgToCrop);
    this.imgToCrop = this._imgToCropTemp;
    margin = Math.round((frame_W - img_w) / 2);
    this.frameToCrop.style.left = margin + 'px';
    cropTop = Math.round((frame_H - img_h) / 2);
    this.frameToCrop.style.top = cropTop + 'px';
    this.framePreview.style.right = margin + 'px';
    this.chooseAgain.style.top = cropTop + img_h + CHOOSE_AGAIN_MARGIN + 'px';
    this.chooseAgain.style.left = margin + 'px';
    selection_w = Math.round(Math.min(this.img_h, this.img_w) * 1);
    x = Math.round((this.img_w - selection_w) / 2);
    y = Math.round((this.img_h - selection_w) / 2);
    options = {
      onChange: this._updateCropedPreview,
      onSelect: this._updateCropedPreview,
      aspectRatio: 1,
      setSelect: [x, y, x + selection_w, y + selection_w]
    };
    t = this;
    this.imgToCrop.offsetHeight;
    $(this.imgToCrop).Jcrop(options, function() {
      return t.jcrop_api = this;
    });
    return t.jcrop_api.focus();
  };

  PhotoPickerCroper.prototype._updateCropedPreview = function(coords) {
    var prev_h, prev_w, prev_x, prev_y, s;
    prev_w = this.img_w / coords.w * this.config.target_w;
    prev_h = this.img_h / coords.h * this.config.target_h;
    prev_x = this.config.target_w / coords.w * coords.x;
    prev_y = this.config.target_h / coords.h * coords.y;
    s = this.imgPreview.style;
    s.width = Math.round(prev_w) + 'px';
    s.height = Math.round(prev_h) + 'px';
    s.marginLeft = '-' + Math.round(prev_x) + 'px';
    s.marginTop = '-' + Math.round(prev_y) + 'px';
    return true;
  };

  PhotoPickerCroper.prototype._chooseAgain = function() {
    this.state.currentStep = 'objectPicker';
    this.jcrop_api.destroy();
    this.imgToCrop.removeAttribute('style');
    this.imgToCrop.src = '';
    this.objectPickerCont.style.visibility = '';
    this.cropper$.style.visibility = 'hidden';
    this.body.scrollTop = this.currentPhotoScroll;
    return this._setFocus();
  };

  PhotoPickerCroper.prototype._setFocus = function() {
    if (!this.state.activePanel.setFocusIfExpected) {
      return;
    }
    if (!this.state.activePanel.setFocusIfExpected()) {
      return this.el.focus();
    }
  };

  PhotoPickerCroper.prototype._listenTabsSelection = function() {
    var _this = this;
    return this.objectPickerCont.addEventListener('panelSelect', function(event) {
      console.log('event panelSelect');
      return _this._activatePanel(event.target.classList[0]);
    });
  };

  PhotoPickerCroper.prototype._selectDefaultTab = function(panelClassName) {
    return this.tablist.querySelector("[aria-controls=" + panelClassName + "]").click();
  };

  PhotoPickerCroper.prototype._activatePanel = function(panelClassName) {
    this.state.activePanel = this.panelsControlers[panelClassName];
    if (this.state.activePanel.resizeHandler) {
      this.state.activePanel.resizeHandler();
    }
    return this._setFocus();
  };

  return PhotoPickerCroper;

})(Modal);
});

;require.register("views/popover_description", function(exports, require, module) {
var BaseView, PopoverDescriptionView, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

module.exports = PopoverDescriptionView = (function(_super) {
  __extends(PopoverDescriptionView, _super);

  function PopoverDescriptionView() {
    this.onConfirmClicked = __bind(this.onConfirmClicked, this);
    this.onCancelClicked = __bind(this.onCancelClicked, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.renderDescription = __bind(this.renderDescription, this);
    _ref = PopoverDescriptionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PopoverDescriptionView.prototype.id = 'market-popover-description-view';

  PopoverDescriptionView.prototype.className = 'modal md-modal md-effect-1';

  PopoverDescriptionView.prototype.tagName = 'div';

  PopoverDescriptionView.prototype.template = require('templates/popover_description');

  PopoverDescriptionView.prototype.events = {
    'click #cancelbtn': 'onCancelClicked',
    'click #confirmbtn': 'onConfirmClicked'
  };

  PopoverDescriptionView.prototype.initialize = function(options) {
    PopoverDescriptionView.__super__.initialize.apply(this, arguments);
    this.confirmCallback = options.confirm;
    this.cancelCallback = options.cancel;
    this.label = options.label != null ? options.label : t('install');
    return this.$("#confirmbtn").html(this.label);
  };

  PopoverDescriptionView.prototype.afterRender = function() {
    var _this = this;
    this.model.set("description", "");
    this.body = this.$(".md-body");
    this.header = this.$(".md-header h3");
    this.header.html(this.model.get('displayName'));
    this.body.addClass('loading');
    this.body.html(t('please wait data retrieval') + '<div class="spinner-container" />');
    this.body.find('.spinner-container').spin(true);
    this.model.getMetaData({
      success: function() {
        _this.body.removeClass('loading');
        return _this.renderDescription();
      },
      error: function(error) {
        _this.body.removeClass('loading');
        _this.body.addClass('error');
        if (error.responseText.indexOf('Not Found') !== -1) {
          return _this.body.html(t('package.json not found'));
        } else {
          return _this.body.html(t('error connectivity issue'));
        }
      }
    });
    this.overlay = $('.md-overlay');
    return this.overlay.click(function() {
      return _this.hide();
    });
  };

  PopoverDescriptionView.prototype.renderDescription = function() {
    var description, docType, permission, permissionsDiv, _ref1;
    this.body.html("");
    description = this.model.get("description");
    this.header.parent().append("<p class=\"line left\"> " + description + " </p>");
    if (Object.keys(this.model.get("permissions")).length === 0) {
      permissionsDiv = $("<div class='permissionsLine'>\n    <h4>" + (t('no specific permissions needed')) + " </h4>\n</div>");
      this.body.append(permissionsDiv);
    } else {
      this.body.append("<h4>" + (t('required permissions')) + "</h4>");
      _ref1 = this.model.get("permissions");
      for (docType in _ref1) {
        permission = _ref1[docType];
        permissionsDiv = $("<div class='permissionsLine'> <strong> " + docType + " </strong> <p> " + permission.description + " </p> </div>");
        this.body.append(permissionsDiv);
      }
    }
    this.handleContentHeight();
    return this.body.slideDown();
  };

  PopoverDescriptionView.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  PopoverDescriptionView.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
    return document.addEventListener('keydown', this.onCancelClicked);
  };

  PopoverDescriptionView.prototype.hide = function() {
    var _this = this;
    this.body.getNiceScroll().hide();
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    $('#home-content').removeClass('md-open');
    return document.removeEventListener('keydown', this.onCancelClicked);
  };

  PopoverDescriptionView.prototype.onCancelClicked = function(event) {
    if ((event.keyCode != null) && event.keyCode !== 27) {
      return;
    }
    this.hide();
    return this.cancelCallback(this.model);
  };

  PopoverDescriptionView.prototype.onConfirmClicked = function() {
    return this.confirmCallback(this.model);
  };

  return PopoverDescriptionView;

})(BaseView);
});

;require.register("views/quicktour_wizard", function(exports, require, module) {
var QuicktourWizardView, WizardView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WizardView = require('lib/wizard_view');

module.exports = QuicktourWizardView = (function(_super) {
  __extends(QuicktourWizardView, _super);

  function QuicktourWizardView() {
    _ref = QuicktourWizardView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  QuicktourWizardView.prototype.context = 'quicktourwizard';

  QuicktourWizardView.prototype.initialize = function() {
    this.steps = [
      {
        slug: 'welcome'
      }, {
        slug: 'apps'
      }, {
        slug: 'sync'
      }, {
        slug: 'import'
      }
    ];
    return QuicktourWizardView.__super__.initialize.apply(this, arguments);
  };

  QuicktourWizardView.prototype.close = function() {
    QuicktourWizardView.__super__.close.apply(this, arguments);
    return window.app.routers.main.navigate('home');
  };

  return QuicktourWizardView;

})(WizardView);
});

;require.register("views/tab-controler", function(exports, require, module) {
var tabControler;

module.exports = tabControler = {
  initializeTabs: function(element) {
    var tablists;
    tablists = element.querySelectorAll('[role=tablist]');
    return Array.prototype.forEach.call(tablists, function(tablist) {
      var panelList,
        _this = this;
      panelList = tablist.getAttribute('aria-controls');
      panelList = document.querySelector("." + panelList);
      return tablist.addEventListener('click', function(event) {
        var pan, panel, panelName, panelSelectEvt, tab, _i, _j, _len, _len1, _ref, _ref1, _results;
        if (event.target.getAttribute('role') !== 'tab') {
          return;
        }
        panelName = event.target.getAttribute('aria-controls');
        panel = panelList.querySelector("." + panelName);
        _ref = panelList.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pan = _ref[_i];
          if (pan.getAttribute('role') !== 'tabpanel') {
            continue;
          }
          if (pan !== panel) {
            pan.setAttribute('aria-hidden', true);
          }
        }
        panel.setAttribute('aria-hidden', false);
        panelSelectEvt = new Event('panelSelect', {
          bubbles: true,
          cancelable: false
        });
        panel.dispatchEvent(panelSelectEvt);
        _ref1 = tablist.querySelectorAll('[role=tab]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tab = _ref1[_j];
          if (tab === event.target) {
            _results.push(event.target.setAttribute('aria-selected', true));
          } else {
            _results.push(tab.setAttribute('aria-selected', false));
          }
        }
        return _results;
      });
    });
  },
  addTab: function(panelsContainer, tabsContainer, params) {
    var panel, tab;
    tab = params.tab;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', params.name);
    tab.setAttribute('aria-selected', false);
    tabsContainer.appendChild(tab);
    panel = params.panel;
    panel.classList.add(params.name);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', true);
    panel.setAttribute('aria-selected', true);
    return panelsContainer.appendChild(panel);
  }
};
});

;require.register("views/update_stack_modal", function(exports, require, module) {
var ApplicationCollection, BaseView, UpdateStackModal, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

ApplicationCollection = require('../collections/application');

module.exports = UpdateStackModal = (function(_super) {
  __extends(UpdateStackModal, _super);

  function UpdateStackModal() {
    _ref = UpdateStackModal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UpdateStackModal.prototype.id = 'market-popover-description-view';

  UpdateStackModal.prototype.className = 'modal md-modal md-effect-1';

  UpdateStackModal.prototype.tagName = 'div';

  UpdateStackModal.prototype.template = require('templates/update_stack_modal');

  UpdateStackModal.prototype.events = {
    'click #cancelbtn': 'onCancelClicked',
    'click #confirmbtn': 'onConfirmClicked',
    'click #ok': 'onClose'
  };

  UpdateStackModal.prototype.initialize = function(options) {
    UpdateStackModal.__super__.initialize.apply(this, arguments);
    this.confirmCallback = options.confirm;
    this.cancelCallback = options.cancel;
    return this.endCallback = options.end;
  };

  UpdateStackModal.prototype.afterRender = function() {
    var _this = this;
    this.overlay = $('.md-overlay');
    this.overlay.click(function() {
      return _this.hide();
    });
    this.$('.step2').hide();
    this.$('.success').hide();
    this.$('.error').hide();
    this.$('#ok').hide();
    return this.body = this.$(".md-body");
  };

  UpdateStackModal.prototype.handleContentHeight = function() {
    var _this = this;
    this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    return $(window).on('resize', function() {
      return _this.body.css('max-height', "" + ($(window).height() / 2) + "px");
    });
  };

  UpdateStackModal.prototype.show = function() {
    var _this = this;
    this.$el.addClass('md-show');
    this.overlay.addClass('md-show');
    $('#home-content').addClass('md-open');
    return setTimeout(function() {
      return _this.$('.md-content').addClass('md-show');
    }, 300);
  };

  UpdateStackModal.prototype.hide = function() {
    var _this = this;
    $('.md-content').fadeOut(function() {
      _this.overlay.removeClass('md-show');
      _this.$el.removeClass('md-show');
      return _this.remove();
    });
    return $('#home-content').removeClass('md-open');
  };

  UpdateStackModal.prototype.onSuccess = function() {
    this.$('.step2').hide();
    this.$('.success').show();
    this.$('#ok').show();
    return this.$('#confirmbtn').hide();
  };

  UpdateStackModal.prototype.onError = function(err) {
    var app, appError, _i, _len, _ref1, _results;
    this.$('.step2').hide();
    this.$('.error').show();
    this.$('#ok').show();
    this.$('#confirmbtn').hide();
    this.endCallback(false);
    err = JSON.parse(err);
    if (Object.keys(err.message).length > 0) {
      appError = $("<div class='app-broken'>\n    <h5> " + (t('applications broken')) + ": </h5>\n</div>");
      this.body.append(appError);
      _ref1 = Object.keys(err.message);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        app = _ref1[_i];
        appError = $("<div class='app-broken'>\n    " + app + "\n</div>");
        _results.push(this.body.append(appError));
      }
      return _results;
    }
  };

  UpdateStackModal.prototype.onClose = function() {
    this.hide();
    return this.endCallback(true);
  };

  UpdateStackModal.prototype.onCancelClicked = function() {
    this.hide();
    return this.cancelCallback();
  };

  UpdateStackModal.prototype.onConfirmClicked = function() {
    this.confirmCallback();
    this.$('.step1').hide();
    this.$('.step2').show();
    this.$('#confirmbtn').spin(true);
    return this.$('#cancelbtn').hide();
  };

  return UpdateStackModal;

})(BaseView);
});

;require.register("widgets/install_button", function(exports, require, module) {
var ColorButton;

module.exports = ColorButton = (function() {
  function ColorButton(button) {
    this.button = button;
    this.label = this.button.find('.label' || this.button);
  }

  ColorButton.prototype.displayGrey = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayOrange = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-red");
    this.button.removeClass("btn-green");
    return this.button.addClass("btn-orange");
  };

  ColorButton.prototype.displayGreen = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.addClass("btn-green");
    this.button.removeClass("btn-red");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.displayRed = function(text) {
    this.button.show();
    this.label.html(text);
    this.button.removeClass("btn-green");
    this.button.addClass("btn-red");
    return this.button.removeClass("btn-orange");
  };

  ColorButton.prototype.hide = function() {
    return this.button.hide();
  };

  ColorButton.prototype.show = function() {
    return this.button.show();
  };

  ColorButton.prototype.isGreen = function() {
    return this.button.hasClass("btn-green");
  };

  ColorButton.prototype.spin = function(toggle) {
    return this.button.spin(toggle);
  };

  ColorButton.prototype.isHidden = function() {
    return !this.button.is(":visible");
  };

  return ColorButton;

})();
});

;
//# sourceMappingURL=app.js.map