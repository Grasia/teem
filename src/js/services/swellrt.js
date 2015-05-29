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
      model: currentModel,
      m2: currentModel.model,
      copy: {}
    };

    var apply = function (fun) {
      var p = $rootScope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $rootScope.$apply(fun);
      }
    };
    function init(){
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
                         ret.model = model.root;
                         ret.mod = model;
                         simplify(model.root, ret.copy, []);
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

    // Creates and attach (if not attached) an object made from maps, arrays and strings
    function createAttachObject(obj, key, value) {

      // Create
      var o;
      try {
        o = obj.get(key);
      } catch (e) {
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
      var className = obj.getDelegate().___clazz$.simpleName;
      if (className === 'ListType'){
        try{
          obj.add(o);
          }
        catch (e){
        }
      } else if (className === 'MapType'){
        try{
          obj.put(key, o);
        }
        catch (e){
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

    function simplify(e, mod, path){
      var className = e.getDelegate().___clazz$.simpleName;
      switch (className) {

        case 'StringType':

          e.registerEventHandler(SwellRT.events.ITEM_CHANGED,
                                 function(newStr) {
                                   setPathValue(ret.copy,path,newStr);
                                   apply();
                                 },
                                 function(error) {
                                   console.log(error);
                                 }
          );
          $rootScope.$watch(
            function(){
              var r = path.reduce(function(object, key){return object[key];}, mod);
              return r;
            },
            function (newValue){
              if (typeof newValue === 'string'){
                path.reduce(function(object,key){return object.get(key);}, ret.model).setValue(newValue);
              }
            },
            true);
          setPathValue(mod, path, e.getValue());
          break;

        case 'MapType':

          setPathValue(mod, path, {});
          e.registerEventHandler(SwellRT.events.ITEM_ADDED,
                                 function(item) {
                                   var p = (path || []).slice();
                                   p.push(item[0]);
                                   try {
                                     simplify(item[1], mod, p);
                                   }
                                   catch (e) {
                                     console.log(e);
                                   }
                                   apply();
                                 },
                                 function(error) {
                                   console.log(error);
                                 });
          e.registerEventHandler(SwellRT.events.ITEM_REMOVED,
                                 function(item) {
                                   var p = (path || []).slice();
                                   delete p.reduce(function(object, key){return object[key];}, mod)[item[0]];
                                   apply();
                                 },
                                 function(error) {
                                   console.log(error);
                                 });
          var keys = e.keySet();
          angular.forEach(keys,function(value){
              var el = e.get(value);
              var p = (path || []).slice();
              p.push(value);
              simplify(el, mod, p);
          });
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
                var m = path.reduce(function(object,k){return object.get(k);}, ret.model);
                createAttachObject(m, value, newValue[value]);
                apply();
              });
              var deletedVars = diff(Object.keys(oldValue), Object.keys(newValue));
              angular.forEach(deletedVars, function(value){
                e.remove(value);
                apply();
              });
          });
          break;

        case 'ListType':

          setPathValue(mod, path, []);
          e.registerEventHandler(SwellRT.events.ITEM_ADDED,
                                  function(item) {
                                    var par = path.reduce(function(object,key){return object[key];},mod);
                                    var ext = path.reduce(function(object,key){return object.get(key);},ret.model);
                                    //var p = path.concat([par.length]);
                                    var p = (path || []).slice();
                                    p.push('' + (par.length || '0'));
                                    // TODO check for possible failure due to paralel additions
                                    // if it is not a item I added
                                    if (ext.size() > par.length){
                                      try{
                                        simplify(item, mod, p);
                                      } catch (e) {
                                        console.log(e);
                                      }
                                    }
                                    apply();
                                  });
        //TODO: check why is not needed!
        // e.registerEventHandler(SwellRT.events.ITEM_REMOVED,
        //                        function(item) {
                                   // function copy(v1){
                                   //   className = v1.getDelegate().___clazz$.simpleName;
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

          var keyNum = e.size();
          for(var i = 0; i < keyNum; i++){
            var p = (path || []).slice();
            p.push('' + i);
            simplify(e.get(i), mod, p);
          }

           $rootScope.$watchCollection(
             function(){
               // TODO change ret.copy by mod?
               var r = path.reduce(function(object,key){return object[key];} ,ret.copy);
               return r;
             },
             function(newValue, oldValue){
               var newVals = diff(Object.keys(newValue), Object.keys(oldValue));
               angular.forEach(newVals, function(value){
                 var m = path.reduce(function(object,k){return object.get(k);}, ret.model);
                 createAttachObject(m, ''+value, newValue[value]);
                 apply();
               });
               var deletedVars = diff(Object.keys(oldValue), Object.keys(newValue));
               angular.forEach(deletedVars, function(value){
                 e.remove(value);
                 apply();
               });
           });

          break;
      }
    }
    return ret;
  }]);
