'use strict';

describe('FetchProject', function() {

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

  var urlCommunityId = 'bG9jYWwubmV0L3MrQXkwYW15MFlfYkM',
      urlProjectId = 'MTIz',
      projectId = '123',
      FetchProject,
      ProjectsSvc,
      $controller,
      $route,
      $location,
      $timeout,
      swellRT;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$route_, _$location_, _ProjectsSvc_, _$timeout_, _swellRT_) {
    $controller = _$controller_;
    $route = _$route_;
    $location = _$location_;
    ProjectsSvc = _ProjectsSvc_;
    $timeout = _$timeout_;
    swellRT = _swellRT_;

    spyOn(swellRT, 'proxy').and.callFake(function(model, ProxyClass) {
      if (ProxyClass) {
        return new ProxyClass();
      } else {
        return {};
      }
    });
  }));

  describe('when there is a localId and communityId', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          localId: '12345',
          communityId: urlCommunityId
        }
      };

      // Auto Start Session
      spyOn(swellRT, 'resumeSession').and.callFake(function(success) {
        success({});
      });

      spyOn(ProjectsSvc, 'all').and.callThrough();
      spyOn(ProjectsSvc, 'create').and.callThrough();
    });

    describe('when there was not a project', function() {
      beforeEach(function() {

        spyOn(swellRT, 'query').and.callFake(function(query, cb) {
          cb({ result: [] });
        });

        spyOn(swellRT, 'createModel').and.callFake(function(cb) {
          cb(new SwellRTModel({ id: projectId }));

          return projectId;
        });
      });

      it('should create a new one and redirect to it', function() {

        FetchProject = $controller('FetchProject', {
          $route: $route
        });

        // We need to trigger ProjectsSvc promise resolution
        $timeout.flush();

        expect(ProjectsSvc.all).toHaveBeenCalled();
        expect(ProjectsSvc.create).toHaveBeenCalled();

        expect($location.path()).toBe('/teems/' + urlProjectId);
      });
    });

    describe('when there was a project', function() {
      beforeEach(function() {
        spyOn(swellRT, 'query').and.callFake(function(query, cb) {
          cb({ result: [ { root: { id: '123' }}]});
        });
      });

      it('should fetch it and redirect to it', function() {
        FetchProject = $controller('FetchProject', {
          $route: $route
        });

        // We need to trigger ProjectsSvc promise resolution
        $timeout.flush();

        expect(ProjectsSvc.all).toHaveBeenCalled();
        expect(ProjectsSvc.create).not.toHaveBeenCalled();

        expect($location.path()).toBe('/teems/' + urlProjectId);
      });
    });
  });
});
