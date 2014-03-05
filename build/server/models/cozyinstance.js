// Generated by CoffeeScript 1.7.1
var CozyInstance, americano;

americano = require('americano-cozy');

module.exports = CozyInstance = americano.getModel('CozyInstance', {
  domain: String,
  locale: String,
  helpUrl: String
});

CozyInstance.all = function(callback) {
  return CozyInstance.request('all', callback);
};

CozyInstance.destroyAll = function(callback) {
  return CozyInstance.requestDestroy('all', callback);
};