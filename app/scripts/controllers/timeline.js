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

  .controller('TimelineCtrl', ['$scope', function($scope) {
    $scope.timeline = [
      {
        'icon': 'magic',
        'heading': 'Buy some drinks',
        'body': 'New task for project Sabado verde'
      }
    ];

    var proyectoQuiso;
    var tarea;
    var proyectoDuda;
    $scope.hipothesis = [
      {
        fun : function() {
          proyectoQuiso = prompt('Proyecto en el que quiso y no pudo');
          
          $scope.timeline.unshift({
            'icon': 'lightbulb-o',
            'heading': 'Fulanito ha creado el proyecto ' + proyectoQuiso
          });
        }
      },
      {
        fun : function() {
          var tarea = prompt('Tarea del proyecto en el que quiso y no pude');
          
          $scope.timeline.unshift({
            'icon': 'magic',
            'heading': tarea,
            'body': 'Fulanito ha creado una tarea en el proyecto ' + proyectoQuiso
          });
        }
      },
      {      fun : function() {
          proyectoDuda = prompt('Proyecto en el que dudó si participar');
          
          $scope.timeline.unshift({
            'icon': 'lightbulb-o',
            'heading': 'Fulanito ha creado el proyecto ' + proyectoDuda
          });
        }
      },
      {
        fun : function() {
         var tarea = prompt('Tarea del proyecto en el que dudó si participar');
          
          $scope.timeline.unshift({
            'icon': 'magic',
            'heading': tarea,
            'body': 'Fulanito ha creado una tarea en el proyecto ' + proyectoDuda
          });
        }
      },
      {
        fun2: function () {          
          $scope.timeline.unshift({
            'icon': 'pencil',
            'heading': proyectoDuda + ': En marcha!',
            'body': 'Fulanito ha cambiado el estado del proyecto'
          });
        }
      }
    ];
      
    $scope.testIndex = 0;
    $scope.start = function() {
      if ($scope.testIndex < $scope.hipothesis.length) {
        ($scope.hipothesis[$scope.testIndex].fun)();
        $scope.testIndex++;
      }
    };
    
  }]);
