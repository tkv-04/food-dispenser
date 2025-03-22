import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1dH986iJZA8n53ri-9I9nf0UtMB3WvI0",
    authDomain: "smart-pet-feeder-ce71a.firebaseapp.com",
    databaseURL: "https://smart-pet-feeder-ce71a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-pet-feeder-ce71a",
    storageBucket: "smart-pet-feeder-ce71a.firebasestorage.app",
    messagingSenderId: "510125894495",
    appId: "1:510125894495:web:56869f6c6b40a6aae2a4ea"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database for use in other files
export const database = getDatabase(app); 