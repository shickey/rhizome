import * as ActionTypes from './ActionTypes.js'

export const selectNode = id => {
  return {
    type: ActionTypes.SELECT_NODE,
    id
  }
}