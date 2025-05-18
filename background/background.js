/**
 * 金句卡片生成器 - 后台服务工作线程
 * 负责处理右键菜单、消息通信等后台任务
 */

// 创建右键菜单项
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generate-quote-card",
    title: "生成金句卡片",
    contexts: ["selection"]
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate-quote-card" && info.selectionText) {
    // 向内容脚本发送消息，传递选中的文本
    chrome.tabs.sendMessage(tab.id, {
      action: "openCardGenerator",
      text: info.selectionText
    });
  }
});

// 监听来自内容脚本和弹出页面的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理从内容脚本收到的选中文本消息
  if (message.action === "selectedText") {
    // 保存选中的文本到storage
    chrome.storage.local.set({ selectedText: message.text }, () => {
      if (chrome.runtime.lastError) {
        console.error("存储选中文本时出错:", chrome.runtime.lastError);
      }
    });
  }
  
  // 处理打开弹窗的请求
  if (message.action === "openPopup") {
    // 保存选中的文本到storage
    chrome.storage.local.set({ selectedText: message.text }, () => {
      if (chrome.runtime.lastError) {
        console.error("存储选中文本时出错:", chrome.runtime.lastError);
      }
      
      // 创建一个弹出窗口来显示生成器页面
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/popup.html"),
        type: "popup",
        width: 640,
        height: 520,
        focused: true
      });
    });
  }
  
  // 处理获取选中文本的请求
  if (message.action === "getSelectedText") {
    chrome.storage.local.get(["selectedText"], (result) => {
      sendResponse({ text: result.selectedText || "" });
    });
    return true; // 异步响应需要返回true
  }
}); 