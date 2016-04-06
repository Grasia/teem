'use strict';

describe('CommunitiesSvc', function() {

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

  var CommunitiesSvc,
      $timeout,
      communities,
      result = {
        community: [],
        project: []
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_CommunitiesSvc_, _$timeout_) {
    CommunitiesSvc =  _CommunitiesSvc_;
    $timeout = _$timeout_;
  }));

  describe('when there are communities', function() {
    beforeEach(function () {
      result.community = [
        {
          '_id' : { '$oid' : '56e7f73fe4b0e80027a7102f'},
          'wave_id' : 'local.net/s+h6cjjUaMWeA',
          'wavelet_id' : 'local.net/swl+root',
          'participants' : [ 'pepe@local.net' , '@local.net'],
          'root' : {
            'id' : 'local.net/s+h6cjjUaMWeA',
            'projects' : [ ] ,
            '_urlId' : 'bG9jYWwubmV0L3MraDZjampVYU1XZUE' ,
            'description' : 'Lorem ipsum y esas cosas' ,
            'name' : 'Testing Community',
            'type' : 'community',
            'participants' : [ 'pepe@local.net']
          }
        }
      ];
    });

    describe('and there are not projects', function() {
      beforeEach(function () {
        spyOn(SwellRT, 'query').and.callFake(function(query, cb) {
          var type = query._aggregate[0].$match['root.type'];

          cb({ result: result[type] });
        });
      });

      describe('all', function () {
        it('should return communities',function(){
          var community;

          CommunitiesSvc.all().then(function(cs) { communities = cs; });

          // We need to trigger ProjectsSvc promise resolution
          $timeout.flush();

          expect(communities.length).toBe(result.community.length);

          community = communities[0];

          expect(community.type).toBe('community');
          expect(community.name).toBe(result.community[0].root.name);
        });

        it('should return communities and project count',function(){
          var community;

          CommunitiesSvc.all({ projectCount: true}).then(function(cs) { communities = cs; });

          // We need to trigger ProjectsSvc promise resolution
          $timeout.flush();

          expect(communities.length).toBe(result.community.length);

          community = communities[0];

          expect(community.type).toBe('community');
          expect(community.name).toBe(result.community[0].root.name);

        });
      });
    });
  });
});
