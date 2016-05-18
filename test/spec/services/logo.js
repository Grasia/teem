'use strict';

describe('Logo', function() {

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

  var Logo,
      Test,
      instance,
      id = '0', // Returns 0 in charCodeAt(0) % LogoColors
      color = 'aubergine', // first color
      type = 'test',
      imageUrl = 'https://test.com/image';


  beforeEach(inject(function (_Logo_) {
    Logo =  _Logo_;

    class Test_ extends aggregation(Object, Logo) {
      constructor (img) {
        super();

        this.id = id;
        this.type = type;
        this.image = img;
      }
    }

    Test = Test_;
  }));

  describe('without image', function () {
    beforeEach(function() {
      instance = new Test();
    });

    it('should return defaultLogo', function () {
      expect(instance.defaultLogo()).toBe('/images/' + type + '_' + color + '.svg');
    });

    it('should return defaultLogoUrl', function () {
      expect(instance.defaultLogoUrl()).toMatch(new RegExp('http://localhost:\\d+/images/' + type + '_' + color + '.svg'));
    });

    it('should return logo', function () {
      expect(instance.logo()).toBe('/images/' + type + '_' + color + '.svg');
    });

    it('should return logoUrl', function () {
      expect(instance.logoUrl()).toMatch(new RegExp('http://localhost:\\d+/images/' + type + '_' + color + '.svg'));
    });
  });

  describe('with image', function () {
    beforeEach(function() {
      instance = new Test({ url: imageUrl });
    });

    it('should return defaultLogo', function () {
      expect(instance.defaultLogo()).toBe('/images/' + type + '_' + color + '.svg');
    });

    it('should return defaultLogoUrl', function () {
      expect(instance.defaultLogoUrl()).toMatch(new RegExp('http://localhost:\\d+/images/' + type + '_' + color + '.svg'));
    });

    it('should return logo', function () {
      expect(instance.logo()).toBe(imageUrl);
    });

    it('should return logoUrl', function () {
      expect(instance.logoUrl()).toBe(imageUrl);
    });
  });
});
