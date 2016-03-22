'use strict';

describe('NotificationSvc', function() {

  // load the controller's module
  // We need to override the async translateProvider
  // http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
  beforeEach(module('Teem', function ($provide, $translateProvider) {
    $provide.factory('customLoader', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('customLoader');
  }));

  var $rootScope,
      NotificationSvc;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ( _$rootScope_, _NotificationSvc_) {
    $rootScope = _$rootScope_;
    window.cordova = true;
    NotificationSvc =  _NotificationSvc_;
  }));

  afterEach(function(){
    window.cordova = undefined;
  });

  describe('when a loggin event is received', function() {
    beforeEach(function() {

      spyOn(PushNotification, 'init').and.callFake(function(){
        return {
          on: function() {}
        };
      });

      $rootScope.$broadcast('teem.login');
      $rootScope.$digest();
    });

    it('should register to notifications',function(){
      expect(PushNotification.init).toHaveBeenCalled();
    });
  });
});
