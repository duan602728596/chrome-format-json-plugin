import Tab = chrome.tabs.Tab;

const formatJSONBtn: Element = document.getElementById('formatJSON');

/* 判断css和js是否注入 */
let isInject: boolean = false;

/* 注入css */
function injectCSS(file: string): Promise<void>{
  return new Promise((resolve: Function, reject: Function): void=>{
    chrome.tabs.insertCSS(null, { file }, function(): void{
      resolve();
    });
  });
}

/* 注入js */
function injectJS(file: string): Promise<void>{
  return new Promise((resolve: Function, reject: Function): void=>{
    chrome.tabs.executeScript(null, { file }, function(): void{
      resolve();
    });
  });
}

/* 格式化JSON */
async function handleFormatJSONClick(event: Event): Promise<void>{
  // 加载cdn
  if(isInject === false){
    await Promise.all([
      injectCSS('dependencies/github-gist.css'),
      injectCSS('style/page.css'),
      injectJS('dependencies/highlight.pack.min.js'),
    ]);

    isInject = true;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs: Tab[]): void{
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'FORMAT_JSON'
    });
  });
}

formatJSONBtn.addEventListener('click', handleFormatJSONClick, false);