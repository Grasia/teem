'use strict';

class JoinModalCtrl {

  constructor ($scope, $timeout, SessionSvc, swellRT){
    'ngInject';

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.swellRT = swellRT;

    $scope.message = {
      sending: false
    };
    $scope.step = 'message';


    /* SwellRT does not currently provides this info

    // Autofill user email
    SessionSvc.onLoad(() => {
      $scope.message.email = User.current().email;
    });
    */

  }

  send () {
    this.$scope.message.sending = true;

    this.swellRT.join(
      this.$scope.message.email,
      this.project.url({campaign: 'joinEmail'}),
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


angular.module('Teem').
  component('joinModal', {
    controller: JoinModalCtrl,
    bindings: {
      project: '<'
    },
    templateUrl: 'join-modal.html'
  });
