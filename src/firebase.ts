import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Only required for web firebase, since react-native-firebase supports ios and android only.
export const fbConfig = {
  apiKey: 'AIzaSyDkt8cA-JbTUYpm_ouo3yYSYWLEWfwcVt4',
  authDomain: 'waha-ai-timestamper-4265a.firebaseapp.com',
  projectId: 'waha-ai-timestamper-4265a',
  storageBucket: 'waha-ai-timestamper-4265a.appspot.com',
  messagingSenderId: '1053430310787',
  appId: '1:1053430310787:web:f0c2e42f7eeecab1e838b6',
  measurementId: 'G-57Y7HPH6VF',
};

export const fbApp = initializeApp(fbConfig);
export const fbAuth = getAuth(fbApp);
export const fbStorage = getStorage(fbApp);
export const fbDb = initializeFirestore(fbApp, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
});
