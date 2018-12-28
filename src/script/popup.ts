/* 监听nick事件 */
import Tab = chrome.tabs.Tab;

interface NickRequest{
  type: string;
  nick: string;
  cookie: string;
}

let nick: string = null;
let cookie: string = null;
let sinceId: string = null;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs: Tab[]): void{
  chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_NICK' }, function(response: NickRequest){
    if(response && response.type === 'NICK'){
      // 修改状态
      if(response.nick && nick === null){
        // 修改用户名
        nick = response.nick;
        cookie = response.cookie;
        document.getElementById('popup-login-info-username').innerText = `用户：${ response.nick }`;

        // 添加按钮
        let button: HTMLElement = document.createElement('button');
        button.classList.add('popup-login-info-button');
        button.id = 'popup-login-info-button';
        button.innerText = '一键签到';
        button.addEventListener('click', chaohuaListQiandaoClick, false);
        document.getElementById('popup-login-info').appendChild(button);
        button = null;
      }
    }
  });
});

/* 一键签到 */
function chaohuaListQiandaoClick(event: Event): void{
  chrome.runtime.sendMessage({ type: 'CHAOHUA_LIST', sinceId, cookie });
}

/* 超话列表回调 */
chrome.runtime.onMessage.addListener(function(
  request: { type: string, response: string, status: number },
  sender: object,
  sendResponse: Function
): void{
  if(request && request.type === 'CHAOHUA_LIST_CALLBACK'){
    console.log(request);
  }
});