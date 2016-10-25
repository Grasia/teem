'use strict';

class JoinDialogCtrl {

  constructor ($scope, $timeout, SessionSvc, swellRT, $mdDialog){
    'ngInject';

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.swellRT = swellRT;
    this.$mdDialog = $mdDialog;

    $scope.message = {
      sending: false
    };
    $scope.step = 'message';

    $scope.send = this.send;

    $scope.organizer = [{
      id: this.project.promoter,
      name: this.project.promoter.split('@')[0]
    }];


    /* SwellRT does not currently provides this info

    // Autofill user email
    SessionSvc.onLoad(() => {
      $scope.message.email = User.current().email;
    });
    */

  }

  close () {
    this.$mdDialog.hide();
  }

  send () {
    this.$scope.message.sending = true;

    this.swellRT.join(
      this.$scope.message.email,
      this.project.url(),
      this.project.title,
      this.$scope.message.text,
      this.project.promoter,
      () => {
        // We cannot pass this.onSendSuccess directly because 'this'
        // would be Window when called from SwellRT
        this.onSendSuccess();
      },
      () => {
        this.onSendError();
      }
    );
  }

  onSendSuccess () {
    this.$scope.step = 'success';
    this.$timeout();
  }

  onSendError (error) {
    console.error(error);
  }
}

/*
 * Shows the join dialog for a project
 * <div join-dialog join-dialog-model="project"></div>
 */
angular.module('Teem')
  .directive('joinDialog', function() {
    return {
      controller: [
      '$scope', '$element', '$mdDialog',
      function($scope, $element, $mdDialog) {

        $element.on('click', function() {

          if (!$scope.project.isParticipant()) {

            $mdDialog.show({
              templateUrl: 'join/dialog.html',
              controller: JoinDialogCtrl,
              controllerAs: '$ctrl',
              bindToController: true,
              locals: {
                project: $scope.project
              },
              clickOutsideToClose: true
            });
          }
        });
      }],
      scope: {
        project: '=joinDialogModel'
      }
    };
  });
