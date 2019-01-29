import Tab = chrome.tabs.Tab;

const formatJSONBtn: Element = document.getElementById('formatJSON');
const resetBtn: Element = document.getElementById('resetBtn');

/* 格式化JSON */
function handleFormatJSONClick(event: Event): void{
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs: Tab[]): void{
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FORMAT_JSON' });
  });

}

formatJSONBtn.addEventListener('click', handleFormatJSONClick, false);