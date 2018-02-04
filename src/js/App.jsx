import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph.jsx';

const App = () => {

  return(
    <div className="app-container">
      <div className="col-left">
        <Graph />
      </div>
      <div className="col-right info">
        <h1>Rhizome</h1>
        <div className="node-editor hidden">
          <form>
            <div className="form-group">
              <label htmlFor="node-edit-title">Title:</label>
              <input type="text" id="node-edit-title" name="node-edit-title" />
            </div>
            <div className="form-group">
              <label htmlFor="node-edit-content">Content:</label>
              <textarea id="node-edit-content" name="node-edit-content"></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

}

ReactDOM.render(<App />, document.getElementById('root'));
