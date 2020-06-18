//import "./firebase-messaging-sw.js";
import SendBird from 'sendbird';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
//import { firebaseConfig } from "./firebaseConfig";
import {
  APP_ID as appId
} from './const';

//const appId = 'YOUR_APP_ID';
//const sb = new SendBird({appId});
const sb = new SendBird({appId: appId});
const userId = sb.User.userId//"YOUR_USER";
const vapidKey = 'BJA20b_g90vg3Wwd-2EfbL2U7Dzm24rmhMt4hU38GXaf5aCgWeqR80cAp308_zDn3GC05EMFU-cNVILJ0E6da5I';
const nickname = sb.User.nickname;

//const sb = new SendBird({appId});
//console.log(sb)

var firebaseConfig = {
  apiKey: "AIzaSyDJ-nN6O3-WRi0Ut8anBG0eq3glHxQdKoE",
  authDomain: "sendchat-a07bd.firebaseapp.com",
  databaseURL: "https://sendchat-a07bd.firebaseio.com",
  projectId: "sendchat-a07bd",
  storageBucket: "sendchat-a07bd.appspot.com",
  messagingSenderId: "243498732350",
  appId: "1:243498732350:web:08fd50d6c088c906b33a6f",
  measurementId: "G-XVXZY0J47M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .then(function(response) {
    console.log('success!');
  }, function(error) {
    console.log('Failed!');
  })
}

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(vapidKey) 
  console.log("Messaging:", messaging);

  firebase.messaging().onMessage(notification => {
    alert('Notification received!', notification);
  });
 