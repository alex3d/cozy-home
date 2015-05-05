// Generated by CoffeeScript 1.9.0
var CozyInstance, americano;

americano = require('americano-cozy');

module.exports = CozyInstance = americano.getModel('CozyInstance', {
  domain: String,
  locale: String,
  helpUrl: String,
  background: String
});

CozyInstance.first = function(callback) {
  return CozyInstance.request('all', function(err, instances) {
    if (err) {
      return callback(err);
    } else if (!instances || instances.length === 0) {
      return callback(null, null);
    } else {
      return callback(null, instances[0]);
    }
  });
};

CozyInstance.getLocale = function(callback) {
  return CozyInstance.first(function(err, instance) {
    return callback(err, (instance != null ? instance.locale : void 0) || null);
  });
};

CozyInstance.all = function(callback) {
  return CozyInstance.request('all', callback);
};

CozyInstance.destroyAll = function(callback) {
  return CozyInstance.requestDestroy('all', callback);
};
