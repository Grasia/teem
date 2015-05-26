'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:Pear
 * @description
 * # Pear service
 * Provides controllers with a data model for pear to pear app
 * It serves as an abstraction between Pear data and backend (SwellRT)
 */

angular.module('Pear2Pear')
  .factory('pear', function() {
    var projectsDb = [
      {
        id: '1',
        title : 'Street Art project',
        chat: [
          {
            text: 'Conoces a Banksy?',
            standpoint: 'mine'
          },
          {
            text: 'Buah, ese es un refor',
            standpoint: 'their'
          },
          {
            text: 'Pero qué dices?',
            standpoint: 'mine'
          },
          {
            text: 'Pinta demasiadas flores',
            standpoint: 'their'
          }
        ],
        pad: 'El arte urbano se basa en la apropriación de los espacios como forma de comunicación'
      },
      {
        id: '2',
        title : 'Feminist film festival',
        chat: [
          {
            text: 'Cómo mola el festival',
            standpoint: 'mine'
          },
          {
            text: 'Vamos a partir la pana',
            standpoint: 'their'
          },
          {
            text: 'A qué hora empieza?',
            standpoint: 'mine'
          },
          {
            text: 'A la que se reza',
            standpoint: 'their'
          }
        ],
        pad: 'Queremos visibilizar las mujeres en la música'
      }
    ];

    var projects = {
      all: function() {
        return projectsDb;
      },
      find: function(id) {
        return projectsDb[0];
      }
    };
    return {
      projects: projects
    };
  });
