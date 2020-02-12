import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAn-cxzt9OZoC0ONfiUelBypTSUFPMjUmQ",
  authDomain: "movie-list-e50d2.firebaseapp.com",
  databaseURL: "https://movie-list-e50d2.firebaseio.com",
  projectId: "movie-list-e50d2",
  storageBucket: "movie-list-e50d2.appspot.com",
  messagingSenderId: "225621617361",
  appId: "1:225621617361:web:7063994609f95473c7b3f0",
  measurementId: "G-WT81K0DKPG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export const firestore = firebase.firestore();

export default firebase;