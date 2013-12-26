koa-cors
========

CORS middleware for koa

## Installation (via [npm](https://npmjs.org/package/koa-cors))

```bash
$ npm install koa-cors
```

## Usage

### Simple Usage (Enable *All* CORS Requests)

```javascript
var koa = require('koa');
var route = require('koa-route');
var cors = require('koa-cors');
var app = koa();

app.use(cors());

app.use(route.get('/', function() {
  this.body = { msg: 'Hello World!' };
}));

app.listen(3000);
```

