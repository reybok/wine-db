# wine-db

Implementation of a RESTful API for managing wines
using [Node.js](http://nodejs.org/), [restify](http://restify.com/) and [mongoDB](https://www.mongodb.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone https://github.com/reybok/wine-db.git # or clone your own fork
$ cd wine-db
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Heroku

Make sure you have the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ heroku create
$ git push heroku master
$ heroku open
```

## Documentation

### GET /wines/

Returns a list of wine object which are stored in the database.
Optional search parameters which filter the result:
- year
- name
- type
- country

Example response:

```
HTTP/1.1 200 OK
[{
  id: 1,
  name: 'Pinot noir',
  year: 2011,
  country: 'France',
  type: 'red',
  description: 'Sensual and understated'
}, {
  id: 2,
  name: 'Zinfandel',year: 1990,
  country: 'Croatia',
  type: 'red',
  description: 'Thick and jammy'
}]
```

### POST /wines/

Creates a new wine database entry.
The response is the created wine object.

Example response:

```
HTTP/1.1 200 OK
{
  id: 3,
  name: 'Cabernet sauvignon',
  year: 2013,
  country: 'France',
  type: 'red',
  description: 'The Sean Connery of red wines'
}
```

*name*, *year*, *country* and *type* are mandatory and are validated.
Valid values for type are 'red', 'white' and 'rose'.
If the request is invalid, an error response is sent.

Example Error response:

```
HTTP/1.1 400 Error
{
  error: 'VALIDATION_ERROR',
  validation: {
    country: 'MISSING',
    year: 'INVALID'
  }
}
```

### PUT /wines/:id

Update the wine with the given id.
Response is the updated wine.

Example response:

```
HTTP/1.1 200 OK
{
  id: 3,name: 'Cabernet sauvignon',
  year: 2013,
  country: 'France',
  type: 'red',
  description: 'Similar to merlot'
}
```

Error response:

```
HTTP/1.1 400 Invalid Object
{
  error: 'UNKNOWN_OBJECT'
}
```

### GET /wines/:id

Retrieves a wine by id.

Example response:

```
HTTP/1.1 200 OK
{
  id: 3,
  name: 'Cabernet sauvignon',
  year: 2013,
  country: 'France',
  type: 'red',
  description: 'Similar to merlot'
}
```

Error response:

```
HTTP/1.1 400 Invalid Object
{
  error: 'UNKNOWN_OBJECT'
}
```

### DELETE /wines/:id

Delete a wine by id.

Example response:

```
HTTP/1.1 200 OK
{
  success: true
}
```

Error response:

```
HTTP/1.1 400 Invalid Object
{
  error: 'UNKNOWN_OBJECT'
}
```
