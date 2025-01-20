import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/main.scss';
import { Provider } from 'react-redux';
import { store } from './Redux/Store.js';
// import FirebaseNotifaction from './components/FirebaseNotification.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <App />
      {/* <FirebaseNotifaction /> */}
    </Provider>
  </>
);
