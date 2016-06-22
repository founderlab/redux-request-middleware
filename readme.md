# Request middleware for Redux

Works like redux promise middleware. Resolves request objects from superagent or BackboneORM models. Can work with anything with a similar callback style api.

##### Usage:

```javascript
// Superagent
import request from superagent

dispatch({
  type: 'GET_SOMETHING',
  request: request.get('/something'),
  callback: err => console.log('This will be called when the request completes. Useful for navigating after a request returns (login, etc). Errors should not be handled here - an error action is sent, work with that.'),
})


// BackboneORM
import Task from './models/task'

dispatch({
  type: 'GET_TASKS',
  request: Task.cursor({active: true}),
})


// Callback
import Task from './models/task'

dispatch({
  type: 'GET_TASKS',
  request: callback => loadSomeThingsManually(callback),
})
```


requestModifierMiddleware
-------------------------

Appends a user id to any superagent request or BackboneORM cursor function it finds on an action.

It's designed to work alongside redux-request-middleware which will perform the request and dispatch the relevant (sub)-actions.

It must be included *before* redux-request-middleware when combining middleware, otherwise the requests will be sent before it has a chance to alter the query.


- options:
  --------
    getValue(store):              A function that takes a store and returns a value object to append to the request. You need to supply this.

    getRequest(action):           Return a request from an action, defaults to returning action.request

    setValue(request, value):     A function that appends `value` to the request somehow. By default it's this:

      ```javascript
      export function setValue(request, value) {
        if (_.isObject(request._cursor)) {
          _.merge(request._cursor, value)
        }
        if (_.isFunction(request.query)) {
          request.query(value)
        }
        return request
      }
      ```


- Usage
  ----- 

  This example creates middleware that adds a $user_id param with the current user's id to requests

  ```javascript
  const requestModifierMiddleware = createRequestModifierMiddleware({
    getValue: store => {
      const {auth} = store.getState()
      const value = {}
      if (auth.get('user')) value.$user_id = auth.get('user').get('id')
      return value
    },
  })
  ```

  i.e. if you have a user with id `1234`, all modified requests will now look like `/api/some_model/?$user_id=1234`
