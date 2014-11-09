'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the Pear2Pear
 */

window.onWaveJSReady = function () {
  window.WaveJS.startSession(
    'https://wave.p2pvalue.eu',
    window.configTimelineTests.user,
    window.configTimelineTests.pass);
};

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/timeline', {
        templateUrl: 'views/timeline/show.html',
        controller: 'TimelineCtrl'
      })
      .when('/timeline/control', {
        templateUrl: 'views/timeline/show.html',
        controller: 'TimelineCtrl'
      })
      .when('/timeline/waveid', {
        templateUrl: 'views/timeline/waveid.html',
        controller: 'TimelineCtrl'
      });
  }])
  .filter('reverse', function () {
    return function (items) {
      return (items) ? items.slice().reverse(): [];
    };
  })
  .controller('TimelineCtrl', ['$scope', '$location', function ($scope, $location) {
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    $scope.init = function () {
      // following if avoids concurrency control error in wave
      if (window.WaveJS.listModel) {
        window.WaveJS.close(
          window.configTimelineTests.waveId);
      }

      window.WaveJS.openListModel(
        window.configTimelineTests.waveId,
        function (listModel) {
          window.WaveJS.listModel = listModel;
          window.WaveJS.listModel.list.registerEventHandler(
            'ITEM_ADDED', function (item) {
              var index = window.WaveJS.listModel.list.values.indexOf(item);
              $scope.timeline[index] = JSON.parse(item);
              apply();
            });
          window.WaveJS.listModel.list.registerEventHandler(
            'ITEM_REMOVED', function (item) {
              var index = window.WaveJS.listModel.list.values.indexOf(item);
              $scope.timeline.splice(index, 1);
              apply();
            });
          $scope.timeline = [];
          for (var i = 0; i < listModel.list.values.length; i++) {
            $scope.timeline[i] = JSON.parse(listModel.list.values[i]);
          }
          apply();

        }, function (error) {
          window.alert('Error accessing the collaborative list ' + error);
        });
    };

    if (typeof window.WaveJS !== 'undefined') {
      $scope.init();
    }
    else {
      window.onWaveJSReady = function () {
        window.WaveJS.startSession(
          'https://wave.p2pvalue.eu',
          window.configTimelineTests.user,
          window.configTimelineTests.pass,
          function () {
            $scope.init();
          },
          function (error) {
            window.alert('error: ' + error);
          });
      };
    }
    var nombre;
    var machaca1;
    var machaca2;
    var proyectoQuiso;
    var tarea;
    var proyectoDuda;
    $scope.hipothesis = [
      {
        fun : function () {
          nombre = prompt('Nombre del entrevistado');
          machaca1 = prompt('Nombre de persona activa en comunidad');
          proyectoQuiso = prompt('Proyecto en el que quiso y no pudo');
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': machaca1 + ' ha creado el proyecto ' + proyectoQuiso
          }));
        }
      },
      {
        fun : function () {
          var tarea = prompt('Tarea del proyecto en el que quiso y no pudo');

          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoQuiso
          }));
        }
      },
      {      fun : function () {
          proyectoDuda = prompt('Proyecto en el que dudó si participar');

          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': machaca1 + ' ha creado el proyecto ' + proyectoDuda
          }));
        }
      },
      {
        fun : function () {
          tarea = prompt('Tarea del proyecto en el que dudó si participar');

          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoDuda
          }));
        }
      },
      {
        fun: function () {
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'pencil',
            'heading': proyectoDuda + ': En marcha!',
            'body': machaca1 + ' ha cambiado el estado del proyecto'
          }));
        }
      },
      {
        fun: function () {
          machaca2 = prompt('Nombre de otra persona activa en el proyecto');
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea'
          }));
        }
      },
      {
        fun: function () {
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea'
          }));
        }
      },
      {
        fun: function () {
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayudame ' + nombre + ' a: ' + tarea,
            'body': machaca2 + ' te ha pedido colaboración en la tarea'
          }));
        }
      },
      {
        fun: function () {
          window.WaveJS.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': 'Únete a : ' + proyectoDuda,
            'body': machaca2 + ' te ha invitado a participar en el proyecto'
          }));
        }
      }
    ];


    $scope.testIndex = 0;
    $scope.next = function () {
      if ($scope.testIndex < $scope.hipothesis.length) {
        ($scope.hipothesis[$scope.testIndex].fun)();
        $scope.testIndex++;
      }
    };
    $scope.clear = function () {
      var wjsList = window.WaveJS.listModel.list;
      for (var i = wjsList.values.length; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.newWaveId = function () {
      window.alert(window.WaveJS.createListModel());
    };

  }]);

