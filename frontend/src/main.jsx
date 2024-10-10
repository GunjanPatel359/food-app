// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { store,persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

//  <GoogleOAuthProvider clientId='619764962057-eauvmt3i6nnjoqhb6fh0elsk6jhal94e.apps.googleusercontent.com' onScriptLoadError={()=>console.log("hi")}>
//   </GoogleOAuthProvider> 
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  {/* <React.StrictMode> */}
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  {/* </React.StrictMode>, */}
  </>
)
