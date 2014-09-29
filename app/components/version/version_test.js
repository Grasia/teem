'use strict';

describe('Pear2Pear.version module', function() {
  beforeEach(module('Pear2Pear.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
