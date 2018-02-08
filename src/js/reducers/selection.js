import * as ActionTypes from '../actions/ActionTypes'

const selectedNode = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_NODE:
      return {
        id: action.id
      }
    default:
      return state
  }
}

export default selectedNode
