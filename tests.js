'use strict';

var mocha = window.mocha;
mocha.setup('bdd');
var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('rafu', function() {
  var rafu = require('./rafu');

  it('should have frame method', function() {
    expect(rafu.frame).to.exist;
  });

  it('should have cancelFrame method', function() {
    expect(rafu.cancelFrame).to.exist;
  });

  it('should have throttle method', function() {
    expect(rafu.throttle).to.exist;
  });

  describe('frame', function() {
    it('should defer the callback', function() {
      var callback = sinon.spy();
      rafu.frame(callback);
      expect(callback.callCount).to.equal(0);
    });

    it('should run the callback', function(done) {
      rafu.frame(function() {
        expect(true).to.equal(true);
        done();
      });
    });

    it('should take less than 30ms', function(done) {
      this.timeout(30);
      rafu.frame(function() {
        done();
      });
    });

    it('should return a numeric id > 0', function() {
      var id = rafu.frame(function() {});
      expect(id).to.be.greaterThan(0);
    });
  });

  describe('cancelFrame', function() {
    it('should call the non-cancelled frame callback', function(done) {
      var callback = sinon.spy();
      var id = rafu.frame(callback);
      setTimeout(function(){
        expect(callback.callCount).to.equal(1);
        done();
      }, 100)
    });

    it('should not call the cancelled frame callback', function(done) {
      var callback = sinon.spy();
      var id = rafu.frame(callback);
      rafu.cancelFrame(id);
      setTimeout(function(){
        expect(callback.callCount).to.equal(0);
        done();
      }, 100);
    });
  });

  describe('throttle', function() {
    it('should run multiple calls only once per frame', function(done) {
      var count = 0;
      var handler = rafu.throttle(function(arg) {
        count++;
      });

      handler();
      handler();
      handler();

      rafu.frame(function() {
        expect(count).to.equal(1);
        done();
      });
    });

    it('should always use the latest arguments', function(done) {
      var latest;
      var handler = rafu.throttle(function(arg) {
        latest = arg;
      });

      handler('foo');
      handler('bar');

      rafu.frame(function() {
        expect(latest).to.equal('bar');
        done();
      });
    });

    it('should hanve cancel method attached', function() {
      var handler = rafu.throttle(function() {});
      expect(typeof handler.cancel).to.equal('function');
    });

    it('should not run when cancel is called', function(done) {
      var count = 0;
      var handler = rafu.throttle(function() {
        count++;
      });
  
      handler();
      handler();
      handler();
      handler.cancel();
  
      setTimeout(function(){
        expect(count).to.equal(0);
        done();
      }, 100);
    });
  });
});

mocha.run();
