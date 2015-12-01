# Request middleware for Redux

Works like redux promise middleware. Resolves request objects from superagent or BackboneORM models. Can work with anything with a similar callback style api.

Usage:

    // Superagent

    import request from superagent

    dispatch({
      type: 'GET_SOMETHING',
      request: request.get('/something'),
      callback: (err) => console.log('This will be called when the request completes. Useful for navigating after a request returns (login, etc). Errors should not be handled here - an error action is sent, work with that.'),
    })


    // BackboneORM

    import Task from './models/task'

    dispatch({
      type: 'GET_TASKS',
      request: Task.cursor({active: true}),
    })

Changes:

- 0.3.0: response_parser middleware added to parse json / models into an {id: {model}} format
