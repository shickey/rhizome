import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase'
import Graph from './Graph.jsx'

const firebaseConfig = {
  apiKey: "AIzaSyBaWc2sIScNik2lrUdr4DQOz1tyC_F48Ww",
  authDomain: "rhizome-18e8b.firebaseapp.com",
  databaseURL: "https://rhizome-18e8b.firebaseio.com",
  projectId: "rhizome-18e8b",
  storageBucket: "rhizome-18e8b.appspot.com",
  messagingSenderId: "614011893394"
};

const rrfConfig = {};

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer
});

const store = createStoreWithFirebase(rootReducer, {});


const App = () => (
  <Provider store={store}>
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
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
