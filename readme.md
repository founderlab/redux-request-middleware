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

##### Changes:

- 0.5.0: Changed handling of null responses (again). Nulls are not an error. Append the http status code to the action when parsing the response. Add a `model` prop to the action which is null if no response is received.
- 0.4.6: responseParser always parses ids to strings by default
- 0.4.5: Behave correctly when res is null (not undefined) with no error
- 0.4.3: Fixed up error handling a bit
- 0.4.2: response_parser also adds the models as a list. Format is {models: {model_map}, models: [modelList]}
- 0.3.0: response_parser middleware added to parse json / models into an {id: {model}} format
