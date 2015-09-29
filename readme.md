# Request middleware for Redux

Works like redux promise middleware. Resolves request objects from e.g. superagent or BackboneORM models.

Usage:

  // Superagent

  import request from superagent

  dispatch({
    type: 'LOAD_SOMETHING',
    request: request.get('/something')
  }


  // BackboneORM

  import Task from './models/task'

  dispatch({
    type: 'LOAD_TASKS',
    request: Task.cursor({active: true})
  }
