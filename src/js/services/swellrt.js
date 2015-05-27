'use strict';

/**
 * @ngdoc function
 * @name SwellRTService.service:swellRT
 * @description
 * Interface service with SwellRT API
 */
angular.module('SwellRTService',[])
  .factory('swellRT', ['$rootScope', '$q', function($rootScope, $q){

    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    var def = $q.defer();
    var session = def.promise;
    var currentWaveId = null;
    var currentModel = {model: {}};

    var ret = {
      open: open,
      close: close,
      create: create,
      model: currentModel,
      m2: currentModel.model,
      copy: {}
    }
    
    var apply = function (fun) {
      var p = $rootScope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $rootScope.$apply(fun);
      }
    };

    window.onSwellRTReady = function () {
      window.SwellRT.startSession(
        window.swellrtConfig.server,
        window.swellrtConfig.user,
        window.swellrtConfig.pass,
        function () {
          apply(function() {
            def.resolve(window.SwellRT);
          });
        },
        function () {
           def.reject('Error conecting to wavejs server: Try again later');
         });
    };

    function open(waveId){
      var deferred = $q.defer();
      deferred.notify('Opening ' + waveId + ' model.');
      session.then(function(api) {
        api
          .openModel(waveId, 
                     function (model) {
                       apply(function() {
                         deferred.resolve(model);
                         currentWaveId = waveId;
                         currentModel.model = model;
                         ret.model = model.root;
                         ret.mod = model;
                         simplify(model.root, ret.copy, []);
                       })}, 
                     function(error){
                       alert(error);
                       apply(function() {
                         deferred.reject(error);
                         currentWaveId = null;
                         currentModel = {};
                       });
                     }
                    )
      });
      return deferred.promise;
    }

    function close(waveId){
      session.then(function(api) {
        api.closeModel(waveId);
        currentWaveId = null;
      });
    }

    function create(){
      session.then(function(api) {
        var deferred = $q.defer();
        api.createModel(
          function(modelId) {
            apply(function() {
              deferred.resolve(modelId);
            });
            currentWaveId = modelId;
          },
          function(error) {
            apply(function() {
              deferred.reject(error);
              });
          });
        return deferred.promise;
      })
    }

    // Creates and attach an object made from maps, arrays and strings
    function createAttachObject(obj, key, value) {

      // Create
      var o;
      if (typeof value === 'string'){
        o = currentModel.model.createString(value);
      } else if (value instanceof Array){
        o = currentModel.model.createList();
      } else if (value instanceof Object){
        o = currentModel.model.createMap();
      }
      // Attach
      var className = obj._delegate.___clazz$.simpleName;
      var pathKey;
      console.log(obj);
      if (className === 'ListType'){
        pathKey = '' + obj.size();
        obj.add(o);
      } else if (className === 'MapType'){
        pathKey = key;
        obj.put(pathKey, o);
      }
      if (typeof value !== 'string'){
        angular.forEach(value, function(val, key){
          console.log(val);
          console.log(key);
          createAttachObject(o, key, val);
        });
      }
    }

    function setPathValue(obj, path, value){
      return path.reduce(
        function(object,key){
          return function(v){
            if (v) {
              object()[key] = v; 
            }
            return object()[key];
          }},
        function(){return ret.copy})(value);
    }

    function simplify(e, mod, path){
      var className = e._delegate.___clazz$.simpleName;
      var b = path.reduce(function(object, key){return object[key]}, mod);
      switch (className) {

        case 'StringType':

          var b = path.reduce(function(object, key){return object[key]}, mod);
          e.registerEventHandler(SwellRT.events.ITEM_CHANGED,
                                 function(newStr, oldStr) {
                                   setPathValue(ret.copy,path,newStr)
                                   apply();
                                 },
                                 function(error) {
                                   alert(error);
                                 }
          );
          $rootScope.$watch(
            function(){
              var r = path.reduce(function(object, key){return object[key];}, mod);
              return r;
            },
            function (newValue){
              if (typeof newValue === 'string'){
                path.reduce(function(object,key){return object.get(key)}, ret.model).setValue(newValue);
              } else {
                // TODO change string for map or string
              }
            },
            true);
          setPathValue(mod, path, e.getValue());
          break;

        case 'MapType':
          var b = path.reduce(function(object, key){return object[key]}, mod);
          b = {};
          setPathValue(mod, path, {});
          e.registerEventHandler(SwellRT.events.ITEM_ADDED,
                                 function(foo) {
                                   console.log(foo);
                                   var p = (path || []).concat([foo[0]]);
                                   console.log("foooo: " + p);
                                   simplify(foo[1], mod, p);
                                   apply();
                                 },
                                 function(error) {
                                   alert(error);
                                 });
          e.registerEventHandler(SwellRT.events.ITEM_REMOVED,
                                 function(foo) {
                                   console.log(foo);
                                   var p = (path || []).concat([foo[0]]);
                                   delete path.reduce(function(object, key){return object[key]}, mod)[foo[0]];
                                   apply();
                                 },
                                 function(error) {
                                   alert(error);
                                 });
          keys = e.keySet();
          angular.forEach(keys,function(value, key){
            var el = e.get(value);
            console.log(el);
            simplify(el, mod, path.concat([value]));
          });
          $rootScope.$watchCollection(
            function(){
              // TODO change ret.copy by mod?
              var r = path.reduce(function(object,key){return object[key];} ,ret.copy);
              return r;
            },
            function(newValue, oldValue){
              var newVals = Object.keys(newValue).diff(Object.keys(oldValue));
              angular.forEach(newVals, function(value, key){
                var m = path.reduce(function(object,k){return object.get(k)}, ret.model);
                createAttachObject(m, value, newValue[value]);
                apply();
              });
              var deletedVars = Object.keys(oldValue).diff(Object.keys(newValue));
              angular.forEach(deletedVars, function(value, key){
                e.remove(value);
                apply();
              });
          });
          break;

        case 'ListType':

          var b = path.reduce(function(object, key){return object[key]}, mod);
          b = [];
          setPathValue(mod, path, []);
          var keyNum = e.size();
          for(var i = 0; i < keyNum; i++){
            simplify(e.get(i), mod, path.concat([i]));
          };
          break;
      }
    }
    return ret;
  }]);
