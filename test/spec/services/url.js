'use strict';

describe('Url', function() {

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

  var Url,
      base64,
      Test,
      instance,
      id = 'test',
      pathPrefix = '/testing/';


  beforeEach(inject(function (_Url_, _base64_) {
    Url =  _Url_;
    base64 = _base64_;

    class Test_ extends aggregation(Object, Url) {
      constructor () {
        super();

        this.id = id;
      }

      get pathPrefix () { return pathPrefix; }
    }

    Test = Test_;
  }));

  describe('when used in a class', function () {
    beforeEach(function() {
      instance = new Test();
    });

    it('should return urlId', function () {
      expect(instance.urlId).toBe(base64.urlencode(id));
    });

    it('should return path', function () {
      expect(instance.path()).toBe(pathPrefix + base64.urlencode(id));
    });

    it('should return url', function () {
      expect(instance.url()).
      toMatch(new RegExp('http://localhost:\\d+' + pathPrefix + base64.urlencode(id)));
    });
  });

  describe('static methods', function () {
    it('urlId should encode', function () {
      expect(Url.encode()).toBe('');

      expect(Url.encode(id)).toBe(base64.urlencode(id));
    });

    it('decodeUrlId should deencode', function () {
      expect(Url.decode()).toBe('');

      expect(Url.decode(base64.urlencode(id))).toBe(id);
    });
  });
});
