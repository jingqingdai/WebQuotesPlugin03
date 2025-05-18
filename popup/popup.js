/**
 * 金句卡片生成器 - 弹出页面脚本
 * 实现卡片编辑器的功能逻辑
 */

// DOM元素
let cardPreview;
let quoteText;
let themeButtons;
let bgOptions;
let fontButtons;
let alignButtons;
let formatSelect;
let qualitySlider;
let qualityValue;
let exportBtn;
let toast;

// 卡片状态
let cardState = {
  theme: 'simple',
  background: 'bg1',
  font: 'font1',
  align: 'left',
  format: 'png',
  quality: 90
};

// 字体映射
const fontMap = {
  'font1': 'SourceHanSerif, serif',
  'font2': 'SourceHanSans, sans-serif',
  'font3': 'ZKGDBold, sans-serif',
  'font4': 'OPPOSans, sans-serif',
  'font5': 'AlibabaPuHuiTi, sans-serif',
  'font6': 'FZLantingHei, sans-serif'
};

/**
 * 初始化DOM元素引用
 */
function initDomElements() {
  cardPreview = document.getElementById('card-preview');
  quoteText = document.getElementById('quote-text');
  themeButtons = document.querySelectorAll('.theme-btn');
  bgOptions = document.querySelectorAll('.bg-option');
  fontButtons = document.querySelectorAll('.font-btn');
  alignButtons = document.querySelectorAll('.align-btn');
  formatSelect = document.getElementById('format-select');
  qualitySlider = document.getElementById('quality-slider');
  qualityValue = document.getElementById('quality-value');
  exportBtn = document.getElementById('export-btn');
  toast = document.getElementById('toast');
  
  // 验证元素是否都已找到
  const allElementsFound = 
    cardPreview && quoteText && themeButtons && themeButtons.length &&
    bgOptions && bgOptions.length && fontButtons && fontButtons.length &&
    alignButtons && alignButtons.length && formatSelect && qualitySlider &&
    qualityValue && exportBtn && toast;
  
  console.log('DOM元素初始化完成', {
    cardPreview, quoteText, themeButtons, bgOptions,
    fontButtons, alignButtons, formatSelect, qualitySlider,
    allElementsFound
  });
  
  return allElementsFound;
}

/**
 * 初始化页面
 */
function init() {
  console.log('初始化开始');
  
  // 确保页面已经加载
  if (document.readyState === 'loading') {
    console.log('文档仍在加载中，等待DOMContentLoaded事件');
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  
  // 初始化DOM元素引用
  const elementsInitialized = initDomElements();
  
  if (!elementsInitialized) {
    console.error('DOM元素未完全加载，1秒后重试');
    // 如果元素未找到，延迟重试
    setTimeout(init, 1000);
    return;
  }
  
  // 获取选中的文本
  chrome.storage.local.get(['selectedText'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('获取存储数据失败:', chrome.runtime.lastError);
    }
    
    if (result.selectedText) {
      quoteText.textContent = result.selectedText;
      console.log('加载选定文本:', result.selectedText);
    } else {
      // 如果没有选中文本，显示默认文本
      quoteText.textContent = '点击网页上的文字，选择您喜欢的金句内容';
      console.log('未找到选定文本，使用默认文本');
    }
    
    // 初始化卡片预览
    updateCardPreview();
  });
  
  // 绑定事件监听器
  bindEventListeners();
  
  console.log('初始化完成');
}

/**
 * 更新卡片预览
 */
function updateCardPreview() {
  if (!cardPreview || !quoteText) {
    console.error('卡片预览元素未找到');
    return;
  }
  
  console.log('更新卡片预览', cardState);
  
  // 设置主题
  cardPreview.setAttribute('data-theme', cardState.theme);
  
  // 设置背景
  let bgColor = 'white';
  switch(cardState.background) {
    case 'bg1': bgColor = 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'; break;
    case 'bg2': bgColor = 'linear-gradient(135deg, #e0c3fc, #8ec5fc)'; break;
    case 'bg3': bgColor = 'linear-gradient(135deg, #ffecd2, #fcb69f)'; break;
    case 'bg4': bgColor = 'linear-gradient(135deg, #a1c4fd, #c2e9fb)'; break;
    case 'bg5': bgColor = 'linear-gradient(135deg, #fdfcfb, #e2d1c3)'; break;
    case 'bg6': bgColor = 'linear-gradient(135deg, #09203f, #537895)'; break;
  }
  cardPreview.style.background = bgColor;
  
  // 保存背景类型为属性
  cardPreview.setAttribute('data-bg', cardState.background);
  
  // 设置字体
  quoteText.style.fontFamily = fontMap[cardState.font] || 'sans-serif';
  
  // 设置文本对齐方式
  quoteText.style.textAlign = cardState.align;
  
  // 根据主题和背景设置文字样式
  if (cardState.background === 'bg6') {
    // 深色背景使用白色文字
    quoteText.style.color = 'white';
  } else {
    // 根据主题调整颜色
    switch(cardState.theme) {
      case 'simple': quoteText.style.color = '#333333'; break;
      case 'retro': quoteText.style.color = '#5a4a2f'; break;
      case 'modern': quoteText.style.color = '#292929'; break;
      default: quoteText.style.color = '#333333';
    }
  }
  
  // 应用特定主题的文字样式
  switch(cardState.theme) {
    case 'simple':
      quoteText.style.fontWeight = 'normal';
      quoteText.style.letterSpacing = 'normal';
      break;
    case 'retro':
      quoteText.style.fontWeight = 'normal';
      break;
    case 'modern':
      quoteText.style.fontWeight = '500';
      quoteText.style.letterSpacing = '0.5px';
      break;
  }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
  console.log('绑定事件监听');
  
  if (!themeButtons || !bgOptions || !fontButtons || !alignButtons) {
    console.error('找不到按钮元素');
    return;
  }
  
  // 主题按钮点击事件
  themeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('点击主题按钮', e.target.dataset.theme);
      
      // 移除其他按钮的active类
      themeButtons.forEach(btn => btn.classList.remove('active'));
      // 给当前按钮添加active类
      button.classList.add('active');
      // 更新卡片状态
      cardState.theme = button.getAttribute('data-theme');
      // 更新卡片预览
      updateCardPreview();
    });
  });
  
  // 背景选项点击事件
  bgOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      console.log('点击背景选项', option.getAttribute('data-bg'));
      
      bgOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      cardState.background = option.getAttribute('data-bg');
      updateCardPreview();
    });
  });
  
  // 字体按钮点击事件
  fontButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('点击字体按钮', button.getAttribute('data-font'));
      
      fontButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      cardState.font = button.getAttribute('data-font');
      updateCardPreview();
    });
  });
  
  // 对齐按钮点击事件
  alignButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('点击对齐按钮', button.getAttribute('data-align'));
      
      alignButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      cardState.align = button.getAttribute('data-align');
      updateCardPreview();
    });
  });
  
  // 导出格式选择事件
  if (formatSelect) {
    formatSelect.addEventListener('change', () => {
      cardState.format = formatSelect.value;
      console.log('选择导出格式', cardState.format);
    });
  }
  
  // 质量滑块变化事件
  if (qualitySlider && qualityValue) {
    qualitySlider.addEventListener('input', () => {
      cardState.quality = qualitySlider.value;
      qualityValue.textContent = `${qualitySlider.value}%`;
      console.log('调整质量', cardState.quality);
    });
  }
  
  // 导出按钮点击事件
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      console.log('点击导出按钮');
      exportCard();
    });
  }
}

/**
 * 内置简化版html2canvas功能
 * 这是一个轻量级实现，用于生成卡片截图
 */
function createScreenshot(element, options) {
  options = options || {};
  
  return new Promise((resolve, reject) => {
    try {
      console.log('开始创建截图，元素主题:', element.getAttribute('data-theme'));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 获取元素样式
      const computedStyle = window.getComputedStyle(element);
      
      // 设置canvas尺寸
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const scale = options.scale || 2;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      // 缩放context以获得更高清晰度
      ctx.scale(scale, scale);
      
      // 处理主题样式 - 获取当前主题
      const theme = element.getAttribute('data-theme') || 'simple';
      console.log('当前主题:', theme);
      
      // 处理不同背景类型
      const backgroundType = element.getAttribute('data-bg') || 
                            Array.from(document.querySelectorAll('.bg-option.active')).map(el => el.getAttribute('data-bg'))[0] || 
                            'bg1';
      console.log('当前背景类型:', backgroundType);
      
      // 绘制背景
      let bgColor;
      switch(backgroundType) {
        case 'bg1': bgColor = drawGradient(ctx, width, height, ['#f5f7fa', '#c3cfe2']); break;
        case 'bg2': bgColor = drawGradient(ctx, width, height, ['#e0c3fc', '#8ec5fc']); break;
        case 'bg3': bgColor = drawGradient(ctx, width, height, ['#ffecd2', '#fcb69f']); break;
        case 'bg4': bgColor = drawGradient(ctx, width, height, ['#a1c4fd', '#c2e9fb']); break;
        case 'bg5': bgColor = drawGradient(ctx, width, height, ['#fdfcfb', '#e2d1c3']); break;
        case 'bg6': bgColor = drawGradient(ctx, width, height, ['#09203f', '#537895']); break;
        default: ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
      }
      
      // 根据主题应用额外的样式
      applyThemeStyle(ctx, theme, width, height);
      
      // 查找并绘制文本内容
      const textElement = element.querySelector('#quote-text');
      if (textElement) {
        const textStyle = window.getComputedStyle(textElement);
        
        // 设置字体样式
        const fontSize = textStyle.fontSize || '16px';
        const fontFamily = textStyle.fontFamily || 'sans-serif';
        const fontWeight = textStyle.fontWeight || 'normal';
        
        ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        
        // 根据背景决定文字颜色
        const textColor = getTextColorForBackground(backgroundType, theme);
        ctx.fillStyle = textColor;
        ctx.textAlign = textStyle.textAlign || 'left';
        
        // 分割文本成多行
        const textContent = textElement.textContent || '';
        const lines = breakTextIntoLines(ctx, textContent, width - 40);
        
        // 绘制文本行
        let y = 60; // 起始y位置
        
        for (const line of lines) {
          // 根据对齐方式决定x坐标
          let x = 20; // 默认左对齐
          if (textStyle.textAlign === 'center') {
            x = width / 2;
          } else if (textStyle.textAlign === 'right') {
            x = width - 20;
          }
          
          ctx.fillText(line, x, y);
          y += parseInt(textStyle.lineHeight, 10) || 30;
        }
      }
      
      console.log('截图创建成功');
      resolve(canvas);
    } catch (error) {
      console.error('创建截图失败', error);
      reject(error);
    }
  });
}

/**
 * 绘制渐变背景
 */
function drawGradient(ctx, width, height, colors) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return gradient;
}

/**
 * 根据主题应用额外样式
 */
function applyThemeStyle(ctx, theme, width, height) {
  switch(theme) {
    case 'simple':
      // 简约风格 - 不添加额外装饰
      break;
    case 'retro':
      // 复古风格 - 添加复古边框
      ctx.strokeStyle = '#e8dec1';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, width - 8, height - 8);
      // 给背景添加一点米黄色调
      ctx.fillStyle = 'rgba(249, 245, 233, 0.2)';
      ctx.fillRect(0, 0, width, height);
      break;
    case 'modern':
      // 现代风格 - 添加简洁的黑色边框和阴影效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(5, 5, width, height);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);
      break;
  }
}

/**
 * 根据背景类型和主题获取适合的文字颜色
 */
function getTextColorForBackground(bgType, theme) {
  // 深色背景使用浅色文字，浅色背景使用深色文字
  if (bgType === 'bg6') {
    return '#ffffff'; // 白色文字用于深色背景
  }
  
  // 根据主题调整颜色
  switch(theme) {
    case 'simple': return '#333333'; // 简约风格使用深灰色
    case 'retro': return '#5a4a2f';  // 复古风格使用棕褐色
    case 'modern': return '#292929'; // 现代风格使用近黑色
    default: return '#333333';
  }
}

/**
 * 将文本分割成多行，确保每行不超过最大宽度
 */
function breakTextIntoLines(ctx, text, maxWidth) {
  // 处理中文文本 - 按字符分割
  const characters = text.split('');
  const lines = [];
  let currentLine = '';
  
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  
  // 添加最后一行
  if (currentLine !== '') {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * 导出卡片为图片
 */
function exportCard() {
  console.log('开始导出卡片');
  
  // 显示正在导出的提示
  showToast('正在生成图片，请稍候...');
  
  try {
    // 获取要导出的元素
    const element = document.getElementById('card-preview');
    if (!element) {
      console.error('找不到卡片预览元素');
      showToast('导出失败：找不到卡片预览元素');
      return;
    }
    
    console.log('准备导出元素:', element);
    console.log('当前卡片状态:', cardState);
    
    // 创建一个克隆的卡片，以避免样式问题
    const clone = element.cloneNode(true);
    
    // 确保保存当前的主题和背景设置
    clone.setAttribute('data-theme', cardState.theme);
    clone.setAttribute('data-bg', cardState.background);
    
    // 设置位置
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);
    
    // 确保克隆的元素样式完全复制
    const styles = window.getComputedStyle(element);
    const quoteTextStyles = window.getComputedStyle(element.querySelector('#quote-text'));
    
    // 应用计算样式到克隆元素
    clone.style.width = styles.width;
    clone.style.height = styles.height;
    
    // 设置背景 - 使用cardState中的背景设置
    let bgColor = 'white';
    switch(cardState.background) {
      case 'bg1': bgColor = 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'; break;
      case 'bg2': bgColor = 'linear-gradient(135deg, #e0c3fc, #8ec5fc)'; break;
      case 'bg3': bgColor = 'linear-gradient(135deg, #ffecd2, #fcb69f)'; break;
      case 'bg4': bgColor = 'linear-gradient(135deg, #a1c4fd, #c2e9fb)'; break;
      case 'bg5': bgColor = 'linear-gradient(135deg, #fdfcfb, #e2d1c3)'; break;
      case 'bg6': bgColor = 'linear-gradient(135deg, #09203f, #537895)'; break;
    }
    clone.style.background = bgColor;
    
    // 根据主题设置边框和阴影
    switch(cardState.theme) {
      case 'simple':
        clone.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        clone.style.borderRadius = '4px';
        clone.style.border = 'none';
        break;
      case 'retro':
        clone.style.border = '8px solid #e8dec1';
        clone.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        clone.style.borderRadius = '0';
        break;
      case 'modern':
        clone.style.border = '1px solid #444';
        clone.style.boxShadow = '5px 5px 0 rgba(0, 0, 0, 0.1)';
        clone.style.borderRadius = '0';
        break;
    }
    
    clone.style.padding = styles.padding;
    
    // 应用文本样式
    const cloneText = clone.querySelector('#quote-text');
    if (cloneText) {
      cloneText.style.fontFamily = quoteTextStyles.fontFamily;
      cloneText.style.fontSize = quoteTextStyles.fontSize;
      cloneText.style.textAlign = quoteTextStyles.textAlign;
      cloneText.style.lineHeight = quoteTextStyles.lineHeight;
      
      // 根据主题和背景设置文字颜色
      if (cardState.background === 'bg6') {
        cloneText.style.color = 'white';
      } else {
        switch(cardState.theme) {
          case 'simple': cloneText.style.color = '#333333'; break;
          case 'retro': cloneText.style.color = '#5a4a2f'; break;
          case 'modern': cloneText.style.color = '#292929'; break;
        }
      }
      
      // 应用特定主题的文字样式
      switch(cardState.theme) {
        case 'simple':
          cloneText.style.fontWeight = 'normal';
          cloneText.style.letterSpacing = 'normal';
          break;
        case 'retro':
          cloneText.style.fontWeight = 'normal';
          break;
        case 'modern':
          cloneText.style.fontWeight = '500';
          cloneText.style.letterSpacing = '0.5px';
          break;
      }
    }
    
    // 设置导出选项
    const options = {
      scale: 2 // 提高导出图片质量
    };
    
    // 使用内置的截图功能创建Canvas
    createScreenshot(clone, options).then(canvas => {
      // 在处理完成后移除克隆元素
      document.body.removeChild(clone);
      
      console.log('截图生成完成');
      
      // 根据所选格式导出图片
      let imageType = 'image/png';
      let fileExtension = 'png';
      
      switch(cardState.format) {
        case 'jpg':
          imageType = 'image/jpeg';
          fileExtension = 'jpg';
          break;
        case 'webp':
          imageType = 'image/webp';
          fileExtension = 'webp';
          break;
      }
      
      // 设置图片质量
      const quality = cardState.quality / 100;
      
      try {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = canvas.toDataURL(imageType, quality);
        link.download = `金句卡片_${new Date().getTime()}.${fileExtension}`;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 显示提示
        showToast('卡片已成功导出');
      } catch (err) {
        console.error('生成数据URL失败', err);
        showToast('导出过程中出错，请重试');
      }
    }).catch(err => {
      // 移除克隆元素
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
      
      console.error('截图生成失败', err);
      showToast('导出失败，请重试');
    });
  } catch (err) {
    console.error('导出过程中发生异常', err);
    showToast('导出功能发生错误，请稍后重试');
  }
}

/**
 * 显示提示
 */
function showToast(message) {
  if (!toast) {
    console.error('找不到toast元素');
    return;
  }
  
  if (message) {
    toast.textContent = message;
  }
  
  toast.classList.add('show');
  
  // 3秒后隐藏提示
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 页面加载完成后立即初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM加载完成，开始初始化');
  
  // 直接初始化，不等待html2canvas
  init();
}); 