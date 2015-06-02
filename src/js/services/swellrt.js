'use strict';

/**
 * @ngdoc function
 * @name SwellRTService.service:swellRT
 * @description
 * Interface service with SwellRT API
 */
angular.module('SwellRTService',[])
  .factory('swellRT', ['$rootScope', '$q', function($rootScope, $q){

    function diff(a, b) {
      return a.filter(function(i) {return b.indexOf(i) < 0;});
    }

    var def = $q.defer();
    var session = def.promise;
    var currentWaveId = null;
    var currentModel = {model: {}};

    var ret = {
      open: openModel,
      close: closeModel,
      create: create,
      copy: {}
    };

    var apply = function (fun) {
      var p = $rootScope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $rootScope.$apply(fun);
      }
    };

    function init(){
    // TODO get server, user and pass from method
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
    }
    if ( window.SwellRT) {
      init();
    }
    window.onSwellRTReady = function () {
     init();
    };

    function openModel(waveId){
      var deferred = $q.defer();
      deferred.notify('Opening ' + waveId + ' model.');
      session.then(function(api) {
        api
          .openModel(waveId,
                     function (model) {
                       apply(function() {
                         currentWaveId = waveId;
                         currentModel.model = model;
                         simplify(model.root, ret.copy, []);
                         registerEventHandlers(model.root, ret.copy, []);
                         watchModel(model.root, ret.copy, []);
                         deferred.resolve(model);
                       });
                     },
                     function(error){
                       console.log(error);
                       apply(function() {
                         deferred.reject(error);
                         currentWaveId = null;
                         currentModel = {};
                       });
                     }
                    );
      });
      return deferred.promise;
    }

    function closeModel(waveId){
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
      });
    }

    function classSimpleName(o){
      if (typeof o.keySet === 'function'){
        return 'MapType';
      }
      if (typeof o.size === 'function'){
        return 'ListType';
      }
      if (typeof o.getValue === 'function'){
        return 'StringType';
      }
      return 'unknown';
    }

    // Creates and attach (if not attached) an object made from maps, arrays and strings
    function createAttachObject(obj, key, value) {

      // Create
      var o;
      try {
        o = obj.get(key);
      } catch (e) {
        console.log(e);
      }
      var isNew = !o;
      if (typeof value === 'string'){
        if (isNew){
          o = currentModel.model.createString(value);
        } else {
          o.setValue(value);
        }
      } else if (value instanceof Array){
        if (isNew){
          o = currentModel.model.createList();
        }
      } else if (value instanceof Object){
        if (isNew){
          o = currentModel.model.createMap();
        }
      }
      // Attach
      var className = classSimpleName(obj);
      if (className === 'ListType'){
        try{
          obj.add(o);
          }
        catch (e){
          console.log(e);
        }
      } else if (className === 'MapType'){
        try{
          obj.put(key, o);
        }
        catch (e){
          console.log(e);
        }
      }
      if (typeof value !== 'string'){
        angular.forEach(value, function(val, key){
          try{
            createAttachObject(o, key, val);
            }
          catch (e) {
            console.log(e);
          }
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
          };
        },
        function(){
          return obj;
        })(value);
    }

    /**

     */
    function registerEventHandlers(e, m, p){
 
      depthFirstFunct(
        e, m, p, 
        function(elem, mod, path){
        elem.registerEventHandler(
          SwellRT.events.ITEM_CHANGED,
          function(newStr) {
            setPathValue(mod,path,newStr);
            apply();
          },
          function(error) {
            console.log(error);
          }
        );
      },
        function(elem, mod, path){
          elem.registerEventHandler(
            SwellRT.events.ITEM_ADDED,
            function(item) {
              var par = path.reduce(function(object,key){return object[key];},mod);
              // TODO check if change currentModel.model.root by elem works
              var ext = path.reduce(function(object,key){return object.get(key);},currentModel.model.root);
              //var p = path.concat([par.length]);
              var p = (path || []).slice();
              p.push('' + (par.length || '0'));
              // TODO check for possible failure due to paralel additions
              // if it is not a item I added
              if (ext.size() > par.length){
                try{
                  simplify(item, mod, p);
                  registerEventHandlers(item, mod, p);
                  watchModel(item, mod, p);
                } catch (e) {
                  console.log(e);
                }
              }
              apply();
            });
          //TODO: check why is not needed!
          // elem.registerEventHandler(SwellRT.events.ITEM_REMOVED,
          //                        function(item) {
          // function copy(v1){
          //   className = classSimpleName(v1);
          //   var r;
          //   if (className === 'StringType'){
          //     r = v1.getValue();
          //   }
          //   if (className === 'ListType'){
          //     r = [];
          //     for (var i = 0; i < v1.size(); i++){
          //       r.push(copy(v1.get(i)));
          //     }
          //   }
          //   if (className === 'MapType'){
          //     r = {};
          //     angular.forEach(v1.keySet(), function(value, key){
          //       r[value] = copy(v1.get(value));
          //     });
          //   }
          //   return r;
          // }
          // var cp = copy(foo);
          // var par = path.reduce(function(object, key){return object[key]}, mod);
          // // TODO if cp in par, delete it
          // //
          // apply();
          // },
          // function(error) {
          //   console.log(error);
          // });
        },
        function(elem, mod, path){
          elem.registerEventHandler(
            SwellRT.events.ITEM_ADDED,
            function(item) {
              var p = (path || []).slice();
              p.push(item[0]);
              try {
                // TODO call simplify, register event handlers and watch model
                console.log('reg: map: item added');
                simplify(item[1], mod, p);
                registerEventHandlers(item[1], mod, p);
                watchModel(item[1], mod, p);
              }
              catch (e) {
                console.log(e);
              }
              apply();
            },
            function(error) {
              console.log(error);
            });
          elem.registerEventHandler(
            SwellRT.events.ITEM_REMOVED,
            function(item) {
              var p = (path || []).slice();
              delete p.reduce(function(object, key){return object[key];}, mod)[item[0]];
              apply();
            },
            function(error) {
              console.log(error);
            });
        }
      );
    }

    // visits all nodes of the model and depending on the type (string, list or map)
    // call a function of the params
    function depthFirstFunct(e, mod, path, funStr, funList, funMap){
      var className = classSimpleName(e);
      switch (className) {

        case 'StringType':

          funStr(e, mod, path);

          break;

        case 'MapType':

          var keys = e.keySet();
          funMap(e, mod, path);
          angular.forEach(keys,function(value){
            var el = e.get(value);
            var p = (path || []).slice();
            p.push(value);
            depthFirstFunct(el, mod, p, funStr, funList, funMap);
          });

          break;

        case 'ListType':
          funList(e, mod, path);
          var keyNum = e.size();
          for(var i = 0; i < keyNum; i++){
            var p = (path || []).slice();
            p.push('' + i);
            depthFirstFunct(e.get(i), mod, p, funStr, funList, funMap);
          }

          break;
      }
    }

    function watchModel(e, m, p){
      depthFirstFunct(
        e, m, p,
        function(elem, mod, path){
          $rootScope.$watch(
            function(){
              var r = path.reduce(function(object, key){return object[key];}, mod);
              return r;
            },
            function (newValue){
              if (typeof newValue === 'string'){
                // TODO check if change currentModel.model.root by e works
                path.reduce(function(object,key){return object.get(key);}, currentModel.model.root).setValue(newValue);
              }
            },
            true);
        },
        function(elem, mod, path){
          $rootScope.$watchCollection(
             function(){
               var r = path.reduce(function(object,key){return object[key];}, mod);
               return r;
             },
             function(newValue, oldValue){
               var newVals = diff(Object.keys(newValue), Object.keys(oldValue));
               angular.forEach(newVals, function(value){
                 // TODO check if change currentModel.model.root by e works
                 var m = path.reduce(function(object,k){return object.get(k);}, currentModel.model.root);
                 createAttachObject(m, ''+value, newValue[value]);
                 apply();
               });
               var deletedVars = diff(Object.keys(oldValue), Object.keys(newValue));
               angular.forEach(deletedVars, function(value){
                 elem.remove(value);
                 apply();
               });
           });          
        },
        function(elem, mod, path){
          $rootScope.$watchCollection(
            function(){
              var r = path.reduce(function(object,key){return object[key];} , mod);
              return r;
            },
            function(newValue, oldValue){
              // AngularJS introduce $$haskKey property to some objects
              var oldKeys = Object.keys(oldValue);
              oldKeys.push('$$hashKey');
              var newVals = diff(Object.keys(newValue),oldKeys);
              angular.forEach(newVals, function(value){
                // TODO check if change currentModel.model.root by elem works
                var m = path.reduce(function(object,k){return object.get(k);}, currentModel.model.root);
                createAttachObject(m, value, newValue[value]);
                apply();
              });
              var deletedVars = diff(Object.keys(oldValue), Object.keys(newValue));
              angular.forEach(deletedVars, function(value){
                elem.remove(value);
                apply();
              });
          });
        }
      );
      var className = classSimpleName(e);
      switch (className) {
        case 'StringType':
          

          break;

        case 'MapType':
          
          break;

        case 'ListType':

          break;
      }
    }

    function simplify(e, mod, path){
      var className = classSimpleName(e);
      switch (className) {

        case 'StringType':

          setPathValue(mod, path, e.getValue());

          break;

        case 'MapType':

          // TODO: only if not exists
          setPathValue(mod, path, {});
          var keys = e.keySet();
          angular.forEach(keys,function(value){
              var el = e.get(value);
              var p = (path || []).slice();
              p.push(value);
              simplify(el, mod, p);
          });

          break;

        case 'ListType':

          // TODO: only if not exists
          setPathValue(mod, path, []);

          var keyNum = e.size();
          for(var i = 0; i < keyNum; i++){
            var p = (path || []).slice();
            p.push('' + i);
            simplify(e.get(i), mod, p);
          }

          break;
      }
    }
    return ret;
  }]);
