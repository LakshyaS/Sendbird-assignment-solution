import styles from '../../scss/user-list.scss';
import { createDivEl, errorAlert, appendToFirst } from '../utils';
import { List } from './List';
import { Spinner } from './Spinner';
import { SendBirdAction } from '../SendBirdAction';
import { UserItem } from './UserItem';
import { body as targetEl } from '../const';
import { Chat } from '../Chat';
import { ChatLeftMenu } from '../ChatLeftMenu';
import { LeftListItem } from './LeftListItem';

let instance = null;
//let custfilter = 'c1';
let custType = ''; // customName will change the value which is visible in user list while creating user list

class UserList extends List {
  constructor() {
    super('User List');
    if (instance) {
      return instance;
    }

    this.scrollEventHandler = this._getUserList;
    this.closeEventHandler = this._close;
    this.createBtn = this._addCreateBtn();
    this.selectedUserIds = [];
    instance = this;
  }

  _addCreateBtn() {
    const createBtn = createDivEl({ className: styles['button-create'], content: 'CREATE' });
    const oldCreateBtn = this.buttonRootElement.getElementsByClassName(styles['button-create'])[0];
    if (oldCreateBtn) {
      this.buttonRootElement.removeChild(oldCreateBtn);
    }
    appendToFirst(this.buttonRootElement, createBtn);
    return createBtn;
  }

  _createChannel() {
    // this.selectedUserIds.forEach(e=>{e="rani "+e;alert(e)});
    // const myusers = this.selectedUserIds.map((id)=> "swaty "+id);
    // alert(myusers);
    //alert("I am "+this.selectedUserIds);
    // for(var e in this.selectedUserIds)
    //   alert(e);
   // alert("hey");
    SendBirdAction.getInstance()
      .createGroupChannel(this.selectedUserIds)
      .then(channel => {
        Chat.getInstance().render(channel.url, false);
        const handler = () => {
          Chat.getInstance().render(channel.url, false);
          ChatLeftMenu.getInstance().activeChannelItem(channel.url);
        };
        const item = new LeftListItem({ channel, handler });

      //  if(item.channel.channelType === 'group' && item.channel.customType === custfilter){
      //    alert(item.channel.custType);
        ChatLeftMenu.getInstance().addGroupChannelItem(item.element, true);
        ChatLeftMenu.getInstance().activeChannelItem(channel.url);
      // }
        Spinner.remove();
        this.close();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _inviteChannel() {
    const channelUrl = Chat.getInstance().channel.url;
    SendBirdAction.getInstance()
      .inviteGroupChannel(channelUrl, this.selectedUserIds)
      .then(() => {
        Spinner.remove();
        this.close();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _updateCreateType(isInvite) {
    this.createBtn = this._addCreateBtn();
    this.createBtn.innerHTML = isInvite ? 'INVITE' : 'CREATE';
    this.createBtn.addEventListener('click', () => {
      Spinner.start(this.element);
      if (isInvite) {
        this._inviteChannel();
      } else {
        this._createChannel();
      }
    });
  }

  _getUserList(isInit = false) {
    //alert("inside _getUserList"); // mychange
    Spinner.start(this.element);
    const sendbirdAction = SendBirdAction.getInstance();
    const listContent = this.getContentElement();
    sendbirdAction
      .getUserList(isInit)
      .then(userList => {
        userList.forEach(user => {
          if (!sendbirdAction.isCurrentUser(user)) {
           // user = "c1 "+user; 
           //alert(JSON.stringify(user));  // mychange
           user.nickname = custType+user.nickname; // this is changing the user list for channels
            const handler = () => {
              this._toggleUserId(item.userId);  // toggle happens when you click on any item in the list
            };
            //user = "c1 "+user; // mychange
            const item = new UserItem({ user, handler });
            listContent.appendChild(item.element);
          }
        });
        Spinner.remove();
      })
      .catch(error => {
        errorAlert(error.message);
      });
  }

  _toggleUserId(userId) { // toggle happens when you click on any item in the list
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
  }

  _close() {
    this.selectedUserIds = [];
  }

  render(isInvite = false) {
    if (!targetEl.querySelector(`.${this.getRootClassName()}`)) {
      this._updateCreateType(isInvite);
      targetEl.appendChild(this.element);
      this._getUserList(true);
    }
  }

  static getInstance() {
    return new UserList();
  }
}

export { UserList };
