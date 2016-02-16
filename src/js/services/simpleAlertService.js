// based on Maxim Shoustin's stackoverflow response http://stackoverflow.com/a/25104878
'use strict';

angular.module('Teem')
  .factory('SimpleAlertSvc', [ '$modal',
    function($modal) {

      var ModalInstanceCtrl = function ($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.close = function(){
          $modalInstance.close($scope.data);
        };
      };

      var alert = function (text, mode){

        var data = {
          textAlert: text,
          mode: mode
        };

        $modal.open({
          templateUrl: 'simple-alert-modal.html',
          controller: ModalInstanceCtrl,
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          size: 'lg',
          resolve: {
            data: function () {
              return data;
            }
          }
        });
      };

      return {
        alert: alert
      };
    }]);
