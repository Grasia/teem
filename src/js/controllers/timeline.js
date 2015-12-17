'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/timeline', {
        templateUrl: 'timeline/show.html',
        controller: 'TimelineCtrl'
      })
      .when('/timeline/control', {
        templateUrl: 'timeline/show.html',
        controller: 'TimelineCtrl'
      })
      .when('/timeline/waveid', {
        templateUrl: 'timeline/waveid.html',
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
      if (window.SwellRT.listModel) {
        window.SwellRT.closeModel(
          window.swellrtConfig.waveId);
      }

      window.SwellRT.openListModel(
        window.swellrtConfig.waveId,
        function (listModel) {
          window.SwellRT.listModel = listModel;
          window.SwellRT.listModel.list.registerEventHandler(
            'ITEM_ADDED', function (item) {
              var index = window.SwellRT.listModel.list.values.indexOf(item);
              $scope.timeline[index] = JSON.parse(item);
              apply();
            });
          window.SwellRT.listModel.list.registerEventHandler(
            'ITEM_REMOVED', function (item) {
              var index = window.SwellRT.listModel.list.values.indexOf(item);
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

    // TODO: this should be set by the method above
    $scope.community = {
      name: 'UCM P2Pvalue'
    };

    $scope.init();

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
          $scope.community.name = prompt('Nombre de la comunidad');
          machaca1 = prompt('Nombre de persona activa en comunidad');
          proyectoQuiso = prompt('Proyecto en el que quiso y no pudo');
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': machaca1 + ' ha creado el proyecto ' + proyectoQuiso,
            'entity': {
              'type': 'project',
              'projectId': '1'
            }
          }));
        }
      },
      {
        fun : function () {
          var tarea = prompt('Tarea del proyecto en el que quiso y no pudo');

          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoQuiso,
            'entity': {
              'type': 'task',
              'projectId': '1',
              'taskId': '1'
            }
          }));
        }
      },
      {      fun : function () {
          proyectoDuda = prompt('Proyecto en el que dudó si participar');

          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': machaca1 + ' ha creado el proyecto ' + proyectoDuda,
            'entity': {
              'type': 'project',
              'projectId': '1'
            }
          }));
        }
      },
      {
        fun : function () {
          tarea = prompt('Tarea del proyecto en el que dudó si participar');

          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoDuda,
            'entity': {
              'type': 'task',
              'projectId': '1',
              'taskId': '1'
            }
          }));
        }
      },
      {
        fun: function () {
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'pencil',
            'heading': proyectoDuda + ': En marcha!',
            'body': machaca1 + ' ha cambiado el estado del proyecto',
            'entity': {
              'type': 'project',
              'projectId': '1'
            }
          }));
        }
      },
      {
        fun: function () {
          machaca2 = prompt('Nombre de otra persona activa en el proyecto');
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea',
            'entity': {
              'type': 'task',
              'projectId': '1',
              'taskId': '1'
            }
          }));
        }
      },
      {
        fun: function () {
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea',
            'entity': {
              'type': 'task',
              'projectId': '1',
              'taskId': '1'
            }

          }));
        }
      },
      {
        fun: function () {
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'life-ring',
            'heading': 'Ayudame ' + nombre + ' a: ' + tarea,
            'body': machaca2 + ' te ha pedido colaboración en la tarea',
            'entity': {
              'type': 'task',
              'projectId': '1',
              'taskId': '1'
            }

          }));
        }
      },
      {
        fun: function () {
          window.SwellRT.listModel.list.add(JSON.stringify({
            'icon': 'lightbulb-o',
            'heading': 'Únete a : ' + proyectoDuda,
            'body': machaca2 + ' te ha invitado a participar en el proyecto',
            'entity': {
              'type': 'project',
              'projectId': '1'
            }

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
      var wjsList = window.SwellRT.listModel.list;
      for (var i = wjsList.values.length; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.custom = function () {
      var title = prompt('Timeline event TITLE');
      var text = prompt('Timeline event TEXT');
      var icon = prompt('Timeline event icon (magic, lightbulb-o, pencil, life-ring, heart-o, ...)');
      window.SwellRT.listModel.list.add(JSON.stringify({
        'icon': icon,
        'heading': title,
        'body': text
      }));
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.newWaveId = function () {
      window.alert(window.SwellRT.createListModel());
    };

    $scope.timelineLink = function (entity) {
      switch (entity.type) {
      case 'task':
        $location.path('projects/' + entity.projectId + '/tasks/' + entity.taskId);
        break;
      case 'project':
        $location.path('projects/' + entity.projectId + '/tasks/');
        break;
      }
    };
  }]);
