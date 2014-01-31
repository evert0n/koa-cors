/**
 * CORS middleware
 *
 * @param {Object} [settings]
 * @return {Function}
 * @api public
 */
module.exports = function(settings) {

  var defaults = {
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE'
  };

  settings = settings || defaults;

  return function* cors(next) {

    yield next;

    var options = {
      origin:      settings.origin,
      methods:     settings.methods,
      credentials: settings.credentials,
      headers:     settings.headers,
      maxAge:      settings.maxAge
    };

    if (typeof options === 'function') {
      options = options(this.request);
    }

    if (typeof options.origin === 'function') {
      options.origin = options.origin(this.request);
    }

    /**
     * Access Control Allow Origin
     */
    if (options.origin === false) {
      return;
    } else if (options.origin === true) {
      options.origin = this.header.origin || '*';
    } else if (!options.origin) {
      options.origin = '*';
    }
    this.set('Access-Control-Allow-Origin', options.origin);

    /**
     * Access Control Allow Methods
     */
    if (options.methods.join) {
      options.methods = options.methods.join(',');
    }
    this.set('Access-Control-Allow-Methods', options.methods);

    /**
     * Access Control Allow Credentials
     */
    if (options.credentials === true) {
      this.set('Access-Control-Allow-Credentials', 'true');
    }

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
     * Access Control Allow Max Age
     */
    options.maxAge = options.maxAge && options.maxAge.toString();
    if (options.maxAge && options.maxAge.length) {
      this.set('Access-Control-Allow-Max-Age', options.maxAge);
    }

    /**
     * Returns
     */
    if (this.method === 'OPTIONS') {
      this.status = 204;
    }

  }

};
