import Tab = chrome.tabs.Tab;

const formatJSONBtn: Element = document.getElementById('formatJSON');

/* 判断css和js是否注入 */
let css: boolean = false;
let js: boolean = false;

/* 注入css */
function injectCSS(): Promise<void>{
  return new Promise((resolve: Function, reject: Function): void=>{
    chrome.tabs.insertCSS(null, {
      file: 'dependencies/github-gist.css'
    }, function(): void{
      css = true;
      resolve();
    });
  });
}

/* 注入js */
function injectJS(): Promise<void>{
  return new Promise((resolve: Function, reject: Function): void=>{
    chrome.tabs.executeScript(null, {
      file: 'dependencies/highlight.pack.min.js'
    }, function(): void{
      js = true;
      resolve();
    });
  });
}

/* 格式化JSON */
async function handleFormatJSONClick(event: Event): Promise<void>{
  // 加载cdn
  if(js === false) await injectJS();
  if(css === false) await injectCSS();

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs: Tab[]): void{
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FORMAT_JSON' });
  });
}

formatJSONBtn.addEventListener('click', handleFormatJSONClick, false);