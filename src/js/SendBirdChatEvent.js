import SendBird from 'sendbird';
import { uuid4 } from './utils';
// import * as firebase from 'firebase/app';
// import 'firebase/messaging';

let instance = null;

class SendBirdChatEvent {
  constructor() {
    if (instance) {
      return instance;
    }

    this.sb = SendBird.getInstance();
    this.key = uuid4();
    this._createChannelHandler();

    this.onMessageReceived = null;
    this.onMessageUpdated = null;
    this.onMessageDeleted = null;

    this.onReadReceiptUpdated = null;
    this.onTypingStatusUpdated = null;
    instance = this;
  }

  /**
   * Channel Handler
   */
  _createChannelHandler() {
    const handler = new this.sb.ChannelHandler();
    handler.onMessageReceived = (channel, message) => {
      if (this.onMessageReceived) {
        this.onMessageReceived(channel, message);
        // Notification.requestPermission().then(permission => {
        //   if (permission === 'granted' ) {
        //   messaging
        //   .getToken()
        //   .then(currentToken => {
        //   if (currentToken) {
        //   this.sb.registerUser(currentToken, (response, error) => {
        //   if (error) console .log(error)
        //   });
        //   }
        //   })
        //   .catch(err => {
        //   console .log( 'An error occurred while retrieving token. ' , err);
        //   });
        //   } else {
        //   console .log( 'Unable to get permission to notify.' );
        //   }
        //   })
      }
    };
    handler.onMessageUpdated = (channel, message) => {
      if (this.onMessageUpdated) {
        this.onMessageUpdated(channel, message);
      }
    };
    handler.onMessageDeleted = (channel, messageId) => {
      if (this.onMessageDeleted) {
        this.onMessageDeleted(channel, messageId);
      }
    };

    handler.onReadReceiptUpdated = groupChannel => {
      if (this.onReadReceiptUpdated) {
        this.onReadReceiptUpdated(groupChannel);
      }
    };
    handler.onTypingStatusUpdated = groupChannel => {
      if (this.onTypingStatusUpdated) {
        this.onTypingStatusUpdated(groupChannel);
      }
    };
    this.sb.addChannelHandler(this.key, handler);
  }

  remove() {
    this.sb.removeChannelHandler(this.key);
  }

  static getInstance() {
    return instance;
  }
}

export { SendBirdChatEvent };
