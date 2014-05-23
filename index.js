/**
 * CORS middleware
 *
 * @param {Object} [settings]
 * @return {Function}
 * @api public
 */
module.exports = function(settings) {

  var defaults = {
    origin: function(req) {
      return req.header.origin || '*';
    },
    methods: 'GET,HEAD,PUT,POST,DELETE'
  };

  return function* cors(next) {

    /**
     * Set options
     *
     * @type {Object}
     */
    var options = settings || defaults;

    /**
     * Access Control Allow Origin
     */
    if (options.origin === false) return;

    var origin;
    if (typeof options.origin === 'string') {
      origin = options.origin;
    } else {
      origin = defaults.origin(this.request);
    }
    this.set('Access-Control-Allow-Origin', origin);

    /**
     * Access Control Expose Headers
     */
    if (options.expose) {
      if (options.expose.join) {
        options.expose = options.expose.join(',');
      }
      if (options.expose.length) {
        this.set('Access-Control-Expose-Headers', options.expose);
      }
    }

    /**
     * Access Control Max Age
     */
    options.maxAge = options.maxAge && options.maxAge.toString();
    if (options.maxAge && options.maxAge.length) {
      this.set('Access-Control-Max-Age', options.maxAge);
    }

    /**
     * Access Control Allow Credentials
     */
    if (options.credentials === true) {
      this.set('Access-Control-Allow-Credentials', 'true');
    }

    /**
     * Access Control Allow Methods
     */
    if (typeof options.methods === 'undefined') {
      options.methods = defaults.methods;
    } else if (options.methods.join) {
      options.methods = options.methods.join(',');
    }
    this.set('Access-Control-Allow-Methods', options.methods);

    /**
     * Access Control Allow Headers
     */
    if (!options.headers) {
      options.headers = this.header['access-control-request-headers'];
    } else if (options.headers.join) {
      options.headers = options.headers.join(',');
    }
    if (options.headers && options.headers.length) {
      this.set('Access-Control-Allow-Headers', options.headers);
    }

    /**
     * Returns
     */
    if (this.method === 'OPTIONS') {
      this.status = 204;
    } else {
      yield next;
    }

  }

};
