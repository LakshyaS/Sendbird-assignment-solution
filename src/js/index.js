import { isEmpty, setCookie, getCookie } from './utils';
import { USER_ID, KEY_ENTER } from './const';
import * as firebase from 'firebase/app' ;
import 'firebase/messaging' ;
import SendBird from 'sendbird';
import { SendBirdAction } from './SendBirdAction';
import { uuid4 } from './utils';
import {
  APP_ID as app_Id
} from './const';

 const sb = new SendBird({appId: app_Id});
const userIdEl = document.querySelector('#user_id');
const nicknameEl = document.querySelector('#user_nickname');
const buttonEl = document.querySelector('#login-button');

// var firebaseConfig = {
//   apiKey: "AIzaSyDJ-nN6O3-WRi0Ut8anBG0eq3glHxQdKoE" ,
//   authDomain: "sendchat.firebaseapp.com" ,
//   databaseURL: "https://sendchat.firebaseio.com" ,
//   projectId: "sendchat-a07bd" ,
//   storageBucket: "sendchat.appspot.com" ,
//   messagingSenderId: "243498732350" ,
//   appId: "1:243498732350:web:08fd50d6c088c906b33a6f"
//   };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();
// messaging.usePublicVapidKey(
// 'BJA20b_g90vg3Wwd-2EfbL2U7Dzm24rmhMt4hU38GXaf5aCgWeqR80cAp308_zDn3GC05EMFU-cNVILJ0E6da5I'
// );

// sb.connect(userIdEl.value, nicknameEl.value, (user, error) => {
// 	Notification.requestPermission().then(permission => {
// 		if (permission === 'granted' ) {
// 			messaging.getToken().then(currentToken => {
// 				if (currentToken) {
// 					sb.registerGCMPushTokenForCurrentUser(currentToken, (response, error) => {
// 						if (error) 
// 							console .log(error)
// 					});
// 				}
// 			}).catch(err => {
// 				console .log( 'An error occurred while retrieving token. ' , err);
// 			});
// 		} else {
// 		console .log( 'Unable to get permission to notify.' );
// 		}
// 	})
// });

// messaging.onTokenRefresh(() => {
//   messaging.getToken().then(refreshedToken => {
//     SendBirdAction.getInstance().registerGCMPushTokenForCurrentUser(refreshedToken)
//     .then(response => console .log( 'Successfully registered token with SendBird.' , response))
//   .catch(error => console .log( 'Could not register token with SendBird.' , error));
//   }).catch(err => {
//     console .log( 'Unable to retrieve refreshed token ' , err);
//   });
// });

// //const sb = new SendBird({appId: APP_ID});
// const ChannelHandler = new sb.ChannelHandler();
// ChannelHandler.onMessageReceived = function (channel, message) {
  
//   //this.onMessageReceived(channel, message);
// // Consider calling the Notification service from here.
// };
// //const handler = new this.sb.ChannelHandler();
// sb.addChannelHandler(uuid4(), ChannelHandler);

document.addEventListener('DOMContentLoaded', () => {
  const cookieUserId = getCookie(USER_ID);
  if (cookieUserId) {
    userIdEl.value = cookieUserId;
  }
});

nicknameEl.addEventListener('keydown', e => {
  if (e.which === KEY_ENTER) {
    login();
  }
});

buttonEl.addEventListener('click', () => {
  login();
});

const login = () => {
  const userId = userIdEl.value.trim();
  const nickname = nicknameEl.value.trim();
  if (isEmpty(nickname)) {
    alert('Please enter user nickname');
    return;
  }
  userIdEl.value = '';
  nicknameEl.value = '';
  setCookie(USER_ID, userId);
  window.location.href = `chat.html?userid=${encodeURIComponent(userId)}&nickname=${encodeURIComponent(nickname)}`;
};
