import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

const Sidebar = ({selectedNode, nodes}) => {
  if (selectedNode.id === undefined || !nodes) {
    return null;
  }
  return (
    <div className="node-editor">
      <form>
        <div className="form-group">
          <label htmlFor="node-edit-title">Title:</label>
          <input type="text" id="node-edit-title" name="node-edit-title" value={ nodes[selectedNode.id].title } />
        </div>
        <div className="form-group">
          <label htmlFor="node-edit-content">Content:</label>
          <textarea id="node-edit-content" name="node-edit-content">{ nodes[selectedNode.id].content }</textarea>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    selectedNode: state.selectedNode,
    nodes: state.firebase.data.nodes
  }
}

export default compose(
  firebaseConnect([
    'nodes'
  ]),
  connect(mapStateToProps)
)(Sidebar);
