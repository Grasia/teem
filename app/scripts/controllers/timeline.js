'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/timeline', {
        templateUrl: 'views/timeline/show.html',
        controller:'TimelineCtrl'
      });
  }])

  .controller('TimelineCtrl', ['$scope', function ($scope) {
    $scope.timeline = [];
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
          proyectoQuiso = prompt('Proyecto en el que quiso y no pudo');
          $scope.timeline.unshift({
            'icon': 'lightbulb-o',
            'heading': 'Fulanito ha creado el proyecto ' + proyectoQuiso
          });
        }
      },
      {
        fun : function () {
          machaca1 = prompt('Nombre de persona activa en comunidad'); 
          var tarea = prompt('Tarea del proyecto en el que quiso y no pude');

          $scope.timeline.unshift({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoQuiso
          });
        }
      },
      {      fun : function () {
          proyectoDuda = prompt('Proyecto en el que dudó si participar');

          $scope.timeline.unshift({
            'icon': 'lightbulb-o',
            'heading': machaca1 + ' ha creado el proyecto ' + proyectoDuda
          });
        }
      },
      {
        fun : function () {
         var tarea = prompt('Tarea del proyecto en el que dudó si participar');

          $scope.timeline.unshift({
            'icon': 'magic',
            'heading': tarea,
            'body': machaca1 + ' ha creado una tarea en el proyecto ' + proyectoDuda
          });
        }
      },
      {
        fun: function () {
          $scope.timeline.unshift({
            'icon': 'pencil',
            'heading': proyectoDuda + ': En marcha!',
            'body': machaca1 + ' ha cambiado el estado del proyecto'
          });
        }
      },
      {
        fun: function () {
          machaca2 = prompt('Nombre de otra persona activa en el proyecto');
          $scope.timeline.unshift({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea'
          });
        }
      },
      {
        fun: function () {
          $scope.timeline.unshift({
            'icon': 'life-ring',
            'heading': 'Ayuda a: ' + tarea,
            'body': machaca2 + ' ha pedido colaboración en la tarea'
          });
        }
      },
      {
        fun: function () {
          $scope.timeline.unshift({
            'icon': 'life-ring',
            'heading': 'Ayudame ' + nombre + ' a: ' + tarea,
            'body': machaca2 + ' te ha pedido colaboración en la tarea'
          });
        }
      },
      {
        fun: function () {
          $scope.timeline.unshift({
            'icon': 'lightbulb-o',
            'heading': 'Únete a : ' + proyectoDuda,
            'body': machaca2 + ' te ha invitado a participar en el proyecto'
          });
        }
      }
    ];

    $scope.testIndex = 0;
    $scope.start = function () {
      if ($scope.testIndex < $scope.hipothesis.length) {
        ($scope.hipothesis[$scope.testIndex].fun)();
        $scope.testIndex++;
      }
    };

  }]);
