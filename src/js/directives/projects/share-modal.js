'use strict';

angular.module('Teem')
  .directive('projectsShareModal', function() {
    return {
      controller: ['$scope', '$filter', function($scope, $filter) {
        $scope.share = {
          options: [
            {id: 'link', title: 'project.share.info.link'},
            {id: 'public', title: 'project.share.info.public'}
          ],
          config: {
            valueField: 'id',
            labelField: 'title',
            sortField: 'title',
            maxItems: 1,
            render: {
              item: function(item, escape) {
                return '<div translate>' +
                  $filter('translate')(escape(item.title)) +
                  '</div>';
              },
              option: function(item, escape) {
                return '<div translate>' +
                  $filter('translate')(escape(item.title)) +
                  '</div>';
              }
            },
            closeAfterSelect: true
          },
        };
      }],
      templateUrl: 'projects/share-modal.html'
    };
  });
