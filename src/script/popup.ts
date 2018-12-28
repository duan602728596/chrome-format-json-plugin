/* 监听nick事件 */
import Tab = chrome.tabs.Tab;

interface NickRequest{
  type: string;
  nick: string;
}

let nick: string = null;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs: Tab[]): void{
  chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_NICK' }, function(response: NickRequest){
    if(response.type === 'NICK'){
      // 修改状态
      if(response.nick && nick === null){
        // 修改用户名
        nick = response.nick;
        document.getElementById('popup-login-info-username').innerText = `用户：${ response.nick }`;

        // 添加按钮
        let button: HTMLElement = document.createElement('button');
        button.classList.add('popup-login-info-button');
        button.id = 'popup-login-info-button';
        button.innerText = '一键签到';
        document.getElementById('popup-login-info').appendChild(button);
        button = null;
      }
    }
  });
});