'use strict';

class JoinModalCtrl {

  constructor ($scope, SessionSvc, swellRT){
    'ngInject';

    this.$scope = $scope;
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

/*
    this.swellRT.join(
      this.$scope.message.email.split('@')[0],
      this.project.url(),
      this.project.title,
      this.$scope.message.text,
      this.$scope.message.email,
      this.onSendSuccess,
      this.onSendError
    );
    */
    this.onSendSuccess ();
  }

  onSendSuccess () {
    this.$scope.step = 'success';
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
