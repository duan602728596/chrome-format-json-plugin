declare var hljs: {
  highlightBlock: Function
};

/* 监听信息 */
chrome.runtime.onMessage.addListener(function(request: { type: string }, sender: object, sendResponse: Function): void{
  if(request && request.type === 'FORMAT_JSON'){
    formatJSON();
  }
});

/* 注入css */
function injectCSS(): Promise<void>{
  const style: string = 'https://cdn.bootcss.com/highlight.js/7.3/styles/github.min.css';

  return new Promise((resolve: Function, reject: Function): void=>{
    let element: HTMLLinkElement = document.createElement('link');

    element.id = 'highlight-css';
    element.rel = 'stylesheet';
    element.href = style;

    element.addEventListener('load', function(event: Event): void{
      console.log('Load css.');
      resolve();
    }, false);

    document.head.appendChild(element);
    element = null;
  });
}

/* 注入js */
function injectJS(): Promise<void>{
  const script: string = 'https://cdn.bootcss.com/highlight.js/9.13.1/highlight.min.js';

  return new Promise((resolve: Function, reject: Function): void=>{
    let element: HTMLScriptElement = document.createElement('script');

    element.id = 'highlight-js';
    element.src = script;

    element.addEventListener('load', function(event: Event): void{
      console.log('Load js.');
      resolve();
    }, false);

    document.body.appendChild(element);
    element = null;
  });
}

/* 格式化JSON */
async function formatJSON(): Promise<void>{
  const css: Element = document.getElementById('highlight-css');
  const js: Element = document.getElementById('highlight-js');
  const code: Element = document.getElementById('highlight-code');
  const preRawString: HTMLCollectionOf<HTMLPreElement> = document.body.getElementsByTagName('pre');

  // 加载cdn
  if(!css) await injectCSS();
  if(!js) await injectJS();

  if(preRawString.length > 0){
    const jsonStr: string = preRawString[0].innerHTML;
    let element: Element = code;

    if(!code){
      element = document.createElement('pre');
      element.id = 'highlight-code';
      element.className = 'json';
      element.innerHTML = JSON.stringify(JSON.parse(jsonStr), null, 2);

      document.body.appendChild(element);
      element = null;
    }

    element = document.getElementById('highlight-code');
    preRawString[0].style.display = 'none';

    setTimeout((): void => window['hljs'].highlightBlock(element), 3000);
  }
}