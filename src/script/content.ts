/* 格式化JSON */
function formatJSON(): void {
  try {
    const code: HTMLElement | null = document.getElementById('highlight-code');
    const preRawString: HTMLCollectionOf<HTMLPreElement> = document.body.getElementsByTagName('pre');

    if (preRawString.length > 0) {
      const jsonStr: string = preRawString[0].innerHTML;
      let element: HTMLElement | null = code;

      if (!code) {
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
    }
  } catch (err) {
    alert('JSON格式错误！');
  }
}

/* 格式化链接 */
function formatHref(): void {
  const hljsString: NodeListOf<HTMLElement> = document.querySelectorAll('.hljs-string');

  for (const element of hljsString) {
    const str: string = element.innerHTML;

    if (!/^"https?:\/\/.+"$/.test(str)) continue;

    const href: string = str.substr(1, str.length - 2);
    const aNode: string = `"<a class="link" href="${ href }" target="_blank" rel="noopener noreferrer">${ href }</a>"`;

    element.innerHTML = aNode;
  }
}

/* 返回顶部 */
function goToTop(): void {
  const goToTopBtn: HTMLButtonElement = document.createElement('button');

  goToTopBtn.className = 'go-to-top';
  goToTopBtn.type = 'button';
  goToTopBtn.title = '返回顶部';
  goToTopBtn.setAttribute('aria-label', '返回顶部');
  goToTopBtn.innerHTML = `<svg class="go-to-top-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2097" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30"><defs><style type="text/css"></style></defs><path d="M887.328477 617.152318 533.951458 267.007553c-0.512619-0.512619-1.216181-0.672598-1.759763-1.152533-0.127295-0.127295-0.159978-0.319957-0.287273-0.447252-12.576374-12.416396-32.831716-12.352748-45.280796 0.192662L136.511544 618.944765c-12.447359 12.576374-12.352748 32.800753 0.192662 45.248112 6.239161 6.175514 14.399785 9.280473 22.527725 9.280473 8.224271 0 16.479505-3.168606 22.720387-9.471415L509.792985 333.185325l332.480043 329.407768c6.239161 6.175514 14.368821 9.280473 22.527725 9.280473 8.255235 0 16.479505-3.168606 22.720387-9.471415C899.968499 649.85674 899.872168 629.599677 887.328477 617.152318z" p-id="2098" fill="#1296db"></path></svg>`;

  // 返回顶部函数
  function handleGoTopTopClick(event: Event): void {
    window.scroll(0, 0);
  }

  goToTopBtn.addEventListener('click', handleGoTopTopClick, false);

  document.body.appendChild(goToTopBtn);
}

/* 监听信息 */
chrome.runtime.onMessage.addListener(function(request: { type: string }, sender: object, sendResponse: Function): void {
  if (request && request.type === 'FORMAT_JSON') {
    // 格式化json
    formatJSON();
    // 查找所有的链接，并格式化链接
    formatHref();
    // 插入返回顶部
    goToTop();
  }
});