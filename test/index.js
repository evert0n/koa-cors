var koa        = require('koa');
var http       = require('http');
var chai       = require('chai');
var cors       = require('../');
var superagent = require('superagent');

var app, server;

describe('cors()', function() {

  beforeEach(function() {
    setupServer();
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

  it('should update "Access-Control-Allow-Origin" for each request', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('*');

        superagent.get('http://localhost:3000')
          .set('Origin', 'localhost')
          .end(function(response) {
            chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('localhost');

            done();
          });
      });
  });

  it('should not set "Access-Control-Expose-Headers"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Expose-Headers')).to.not.exist;

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

describe('cors({ origin: true })', function() {

  beforeEach(function() {
    setupServer({ origin: true });
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

});

describe('cors({ origin: false })', function() {

  beforeEach(function() {
    setupServer({ origin: false });
  });

  it('should not set any "Access-Control-Allow-*" header', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.not.exist;
        chai.expect(response.get('Access-Control-Allow-Methods')).to.not.exist;

        done();
      });
  });

});

describe('cors({ origin: function })', function() {

  beforeEach(function() {
    setupServer({ origin: function (req) {
      if (req.header.origin) return 'foo';
      return 'bar';
    }});
  });

  it('should set "Access-Control-Allow-Origin" to "bar"', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.not.equal('*');
        chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('bar');

        done();
      });
  });

  it('should set "Access-Control-Allow-Origin" to "foo"', function(done) {
    superagent.get('http://localhost:3000')
      .set('Origin', 'example.org')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Allow-Origin')).to.not.equal('example.org');
        chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('foo');

        done();
      });
  });

});

describe('cors({ expose: "Acccept,Authorization" })', function() {

  beforeEach(function() {
    setupServer({ expose: 'Accept,Authorization' });
  });

  it('should set "Access-Control-Expose-Headers" header', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Expose-Headers'))
          .to.equal('Accept,Authorization');

        done();
      });
  });

});

describe('cors({ expose: ["Acccept", "Authorization"] })', function() {

  beforeEach(function() {
    setupServer({ expose: ['Accept', 'Authorization'] });
  });

  it('should set "Access-Control-Expose-Headers" header', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Expose-Headers'))
          .to.equal('Accept,Authorization');

        done();
      });
  });

});

describe('cors({ maxAge: 60 * 24 })', function() {

  beforeEach(function() {
    setupServer({ maxAge: 60 * 24 });
  });

  it('should set "Access-Control-Max-Age" header', function(done) {
    superagent.get('http://localhost:3000')
      .end(function(response) {
        chai.expect(response.get('Access-Control-Max-Age')).to.equal('1440');

        done();
      });
  });

});

afterEach(function() {
  server.close();
});

function setupServer(options) {
  app = koa();

  app.use(cors(options));

  app.use(function *(next) {
    this.body = 'Hello';
  });

  server = http.createServer(app.callback()).listen(3000);
}
