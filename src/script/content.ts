/* 监听信息 */
chrome.runtime.onMessage.addListener(function(request: { type: string }, sender: object, sendResponse: Function): void{
  if(request && request.type === 'FORMAT_JSON'){
    formatJSON();
  }
});

/* 格式化链接 */
function formatHref(): void{
  const hljsString: NodeListOf<Element> = document.querySelectorAll('.hljs-string');

  for(const element of hljsString){
    const str: string = element.innerHTML;

    if(!/^"https?:\/\/.+"$/.test(str)) continue;

    const href = str.substr(1, str.length - 2);
    const aNode: string = `"<a class="link" href="${ href }" target="_blank" rel="noopener noreferrer">${ href }</a>"`;

    element.innerHTML = aNode;
  }
}

/* 格式化JSON */
async function formatJSON(): Promise<void>{
  try{
    const code: Element = document.getElementById('highlight-code');
    const preRawString: HTMLCollectionOf<HTMLPreElement> = document.body.getElementsByTagName('pre');

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

      window['hljs'].highlightBlock(element);

      // 查找所有的链接，并格式化链接
      formatHref();
    }
  }catch(err){
    alert('JSON格式错误！');
  }
}