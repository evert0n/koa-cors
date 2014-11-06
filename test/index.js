var koa        = require('koa');
var http       = require('http');
var chai       = require('chai');
var cors       = require('../');
var superagent = require('superagent');
var Promise    = require('bluebird');

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

describe('cors({ origin: [function]})', function() {
  var originWhiteList = ["localhost", "otherhost.com"];

  function testOriginAsFunction() {
    it('should not set any "Access-Control-Allow-*" header', function(done) {
      superagent.get('http://localhost:3000')
      .set('Origin', 'example.com')
        .end(function(response) {
          chai.expect(response.get('Access-Control-Allow-Origin')).to.not.exist;
          chai.expect(response.get('Access-Control-Allow-Methods')).to.not.exist;

          done();
        });
    });

    it('should set "Access-Control-Allow-Origin" to "otherhost.com"', function(done) {
      superagent.get('http://localhost:3000')
      .set('Origin', 'otherhost.com')
        .end(function(response) {
          chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('otherhost.com');

          done();
        });
    });

    it('should set "Access-Control-Allow-Origin" to "localhost"', function(done) {
      superagent.get('http://localhost:3000')
      .set('Origin', 'localhost')
        .end(function(response) {
          chai.expect(response.get('Access-Control-Allow-Origin')).to.equal('localhost');

          done();
        });
    });
  }

  describe('synchronous', function() {

    beforeEach(function() {
      var originFunction = function(req) {
        var origin = req.header.origin;
        if (originWhiteList.indexOf(origin) !== -1) {
          return origin;
        }
        return false;
      }

      setupServer({ origin: originFunction });
    });

    testOriginAsFunction();

  });

  describe('asynchronous', function() {

    beforeEach(function() {
      var originFunction = function(req) {
        return new Promise(function(resolve) {
          setTimeout(function() {
            var origin = req.header.origin;
            if (originWhiteList.indexOf(origin) !== -1) {
              resolve(origin);
            } else {
              resolve(false);
            }
          }, 20);
        });
      };

      setupServer({ origin: originFunction });
    });

    testOriginAsFunction();

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
