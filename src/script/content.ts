/* 监听信息 */
chrome.runtime.onMessage.addListener(function(request: { type: string }, sender: object, sendResponse: Function): void{
  if(request && request.type === 'FORMAT_JSON'){
    formatJSON();
  }
});

/* 格式化JSON */
async function formatJSON(): Promise<void>{
  const code: Element = document.getElementById('highlight-code');
  const preRawString: HTMLCollectionOf<HTMLPreElement> = document.body.getElementsByTagName('pre');

  if(preRawString.length > 0){
    const jsonStr: string = preRawString[0].innerHTML;
    let element: Element = code;

    if(!code){
      element = document.createElement('pre');
      element.id = 'highlight-code';
      element.className = 'json';

      try{
        element.innerHTML = JSON.stringify(JSON.parse(jsonStr), null, 2);
      }catch(err){}

      document.body.appendChild(element);
      element = null;
    }

    element = document.getElementById('highlight-code');
    preRawString[0].style.display = 'none';

    window['hljs'].highlightBlock(element);
  }
}