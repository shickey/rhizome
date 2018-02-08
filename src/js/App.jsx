import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase'
import selectedNode from './reducers/selection'
import Graph from './Graph.jsx'
import Sidebar from './Sidebar.jsx'

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
  firebase: firebaseReducer,
  selectedNode
});

const store = createStoreWithFirebase(rootReducer, {});


const App = () => (
  <Provider store={store}>
    <div className="app-container">
      <div className="col-left">
        <Graph />
      </div>
      <div className="col-right info">
        <Sidebar />
      </div>
    </div>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
