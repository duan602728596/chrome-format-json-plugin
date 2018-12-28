import Cookie = chrome.cookies.Cookie;
import Details = chrome.cookies.Details;

/* 获取超话列表 */
function requestSuperTopicList(cookie: string, sinceId: string): Promise<any>{
  let url: string = 'https://m.weibo.cn/api/container/getIndex?containerid=100803_-_page_my_follow_super';
  if(sinceId) url += `&since_id=${ encodeURIComponent(sinceId) }`;

  return new Promise(((resolve: Function, reject: Function): void=>{
    chrome.cookies.remove({
      url: 'https://m.weibo.cn/',
      name: 'CHAOHUA_LIST'
    }, function(details: Details): void{
      chrome.cookies.set({
        url: 'https://m.weibo.cn/',
        name: 'CHAOHUA_LIST',
        value: encodeURIComponent(cookie)
      }, function(cookie2: Cookie): void{
        const xhr: XMLHttpRequest = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', function(event: Event): void{
          if(xhr.readyState === 4){
            resolve({
              response: xhr.response,
              status: xhr.status
            });
          }
        });

        xhr.open('GET', url, true);
        xhr.send('');
      });
    });
  }));
}

chrome.runtime.onMessage.addListener(async function(
  request: { type: string, cookie: string, sinceId: string },
  sender: object,
  sendResponse: Function
): Promise<void>{
  if(request && request.type === 'CHAOHUA_LIST'){
    const res: object = await requestSuperTopicList(request.cookie, request.sinceId);

    chrome.runtime.sendMessage({ type: 'CHAOHUA_LIST_CALLBACK', ...res });
  }
});