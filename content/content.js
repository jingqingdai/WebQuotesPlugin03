/**
 * 金句卡片生成器 - 内容脚本
 * 负责处理网页上的文本选择和显示浮动按钮
 */

// 创建浮动按钮元素
const createFloatingButton = () => {
  const button = document.createElement('div');
  button.id = 'quote-card-button';
  button.title = '生成金句卡片';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 8H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 16H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  button.style.display = 'none';
  document.body.appendChild(button);
  return button;
};

// 处理文本选择事件
let floatingButton = null;
let lastSelectedText = '';

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  // 如果没有选中文本或者点击在浮动按钮上，则不处理
  if (!selectedText || (floatingButton && floatingButton.contains(event.target))) {
    if (floatingButton) {
      floatingButton.style.display = 'none';
    }
    return;
  }

  lastSelectedText = selectedText;
  
  // 创建或显示浮动按钮
  if (!floatingButton) {
    floatingButton = createFloatingButton();
    floatingButton.addEventListener('click', handleButtonClick);
  }
  
  // 获取选择区域的位置信息
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // 设置浮动按钮位置
  floatingButton.style.position = 'absolute';
  floatingButton.style.left = `${rect.right + window.scrollX}px`;
  floatingButton.style.top = `${rect.top + window.scrollY - 30}px`;
  floatingButton.style.display = 'flex';
  floatingButton.style.alignItems = 'center';
  floatingButton.style.justifyContent = 'center';
  floatingButton.style.width = '30px';
  floatingButton.style.height = '30px';
  floatingButton.style.borderRadius = '50%';
  floatingButton.style.backgroundColor = '#4285f4';
  floatingButton.style.color = 'white';
  floatingButton.style.cursor = 'pointer';
  floatingButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  floatingButton.style.zIndex = '9999';
});

// 处理浮动按钮点击事件
const handleButtonClick = () => {
  if (lastSelectedText) {
    // 向后台脚本发送选中的文本，并请求打开弹窗
    chrome.runtime.sendMessage({
      action: 'openPopup',
      text: lastSelectedText
    });
  }
};

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openCardGenerator' && message.text) {
    // 当用户点击右键菜单时，向后台发送打开弹窗的消息
    chrome.runtime.sendMessage({
      action: 'openPopup',
      text: message.text
    });
  }
}); 