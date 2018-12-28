/* 获取用户昵称 */
function getNickName(text: string): string{
  if(/var \$CONFIG = {};/.test(text)){
    const textArr: string[] = text.split(/\n/g);
    let nickName: string = null;

    for(const item of textArr){
      if(/\$CONFIG\['nick'\]/.test(item)){
        nickName = item;
        break;
      }
    }

    if(nickName){
      nickName = nickName.split('=')[1]
        .replace(/^'/, '')
        .replace(/';\s*$/, '');
    }

    return nickName;
  }else{
    return null;
  }
}

/* 发送登陆状态（用户名) */
chrome.runtime.onMessage.addListener(
  function(request: { type: string }, sender: object, sendResponse: Function): void{
    if(request.type === 'GET_NICK'){
      /* 获取nick */
      const head: HTMLHeadElement = document.head;
      const script: HTMLCollectionOf<HTMLScriptElement> = head.getElementsByTagName('script');
      let nick: string = null;

      for(let i: number = script.length - 1; i >= 0; i--){
        const text: string = script[i].innerText;

        nick = getNickName(text);
        if(nick) break;
      }

      sendResponse({
        type: 'NICK',
        nick
      });
    }
  }
);