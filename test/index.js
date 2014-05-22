var koa        = require('koa');
var chai       = require('chai');
var cors       = require('../');
var superagent = require('superagent');

var app;

describe('cors()', function() {

  before(function() {
    app = koa();

    app.use(cors());

    app.use(function *(next) {
      this.body = 'Hello';
    });

    app.listen(3000);
  });

  it('should set "Access-Control-Allow-Origin" to "*"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('*');

        done();
      });
  });

  it('should set "Access-Control-Allow-Origin" to "example.org"', function(done) {
    superagent.get('http://localhost:3000')
      .set('Origin', 'example.org')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('example.org');

        done();
      });
  });

  it('should not set "Access-Control-Allow-Expose"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Expose')).to.not.exist;

        done();
      });
  });

  it('should not set "Access-Control-Allow-Max-Age"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Max-Age')).to.not.exist;

        done();
      });
  });

  it('should not set "Access-Control-Allow-Methods"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Methods')).to.equal('GET,HEAD,PUT,POST,DELETE');

        done();
      });
  });

  it('should not set "Access-Control-Allow-Credentials"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Credentials')).to.not.exist;

        done();
      });
  });

  it('should set "Access-Control-Allow-Headers" to "Accept"', function(done) {
    superagent.get('http://localhost:3000')
      .set('Access-Control-Request-Headers', 'Accept')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Headers')).to.equal('Accept');

        done();
      });
  });

  it('should set "Access-Control-Allow-Headers" to "X-Foo"', function(done) {
    superagent.get('http://localhost:3000')
      .set('Access-Control-Request-Headers', 'X-Foo')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Headers')).to.equal('X-Foo');

        done();
      });
  });

});

describe('cors(options)', function() {

});