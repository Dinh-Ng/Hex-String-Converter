document.addEventListener('DOMContentLoaded', function() {
  // Lấy các phần tử DOM
  const textInput = document.getElementById('textInput');
  const hexInput = document.getElementById('hexInput');
  const clearAllBtn = document.getElementById('clearAll');
  const copyTextBtn = document.getElementById('copyText');
  const copyHexBtn = document.getElementById('copyHex');

  // Tạo nút mở link
  const openLinkBtn = document.createElement('button');
  openLinkBtn.id = 'openLink';
  openLinkBtn.textContent = 'Mở liên kết';
  openLinkBtn.style.display = 'none';
  openLinkBtn.style.backgroundColor = '#db4437';
  openLinkBtn.style.marginLeft = '10px';

  // Thêm nút vào DOM
  const textSectionTitle = document.querySelector('.section-title');
  textSectionTitle.appendChild(openLinkBtn);

  // Xóa tất cả nội dung
  clearAllBtn.addEventListener('click', function() {
    textInput.value = '';
    hexInput.value = '';
    openLinkBtn.style.display = 'none';
  });

  // Sao chép văn bản
  copyTextBtn.addEventListener('click', function() {
    copyToClipboard(textInput);
    showCopyFeedback(copyTextBtn);
  });

  // Sao chép mã hex
  copyHexBtn.addEventListener('click', function() {
    copyToClipboard(hexInput);
    showCopyFeedback(copyHexBtn);
  });

  // Mở liên kết
  openLinkBtn.addEventListener('click', function() {
    const text = textInput.value.trim();
    if (text && isValidURL(text)) {
      const url = /^https?:\/\//i.test(text) ? text : 'https://' + text;
      window.open(url, '_blank');
    }
  });

  // Tự động chuyển đổi khi nhập liệu
  textInput.addEventListener('input', function() {
    if (textInput.value) {
      const hex = textToHex(textInput.value);
      hexInput.value = hex;

      // Kiểm tra nếu có URL
      checkForURL(textInput.value);
    } else {
      hexInput.value = '';
      openLinkBtn.style.display = 'none';
    }
  });

  hexInput.addEventListener('input', function() {
    if (hexInput.value) {
      try {
        const text = hexToText(hexInput.value.trim());
        textInput.value = text;

        // Kiểm tra nếu có URL
        checkForURL(text);
      } catch (e) {
        // Không hiển thị lỗi khi đang nhập liệu
      }
    } else {
      textInput.value = '';
      openLinkBtn.style.display = 'none';
    }
  });

  // Hàm kiểm tra URL
  function checkForURL(text) {
    if (isValidURL(text.trim())) {
      openLinkBtn.style.display = 'inline-block';
    } else {
      openLinkBtn.style.display = 'none';
    }
  }

  // Hàm kiểm tra URL hợp lệ
  function isValidURL(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  // Hàm chuyển đổi văn bản sang hex
  function textToHex(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const hexValue = charCode.toString(16);
      hex += hexValue.padStart(2, '0');
    }
    return hex;
  }

  // Hàm chuyển đổi hex sang văn bản
  function hexToText(hex) {
    // Loại bỏ khoảng trắng và kiểm tra tính hợp lệ
    hex = hex.replace(/\s+/g, '');
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      throw new Error('Invalid hex string');
    }

    // Đảm bảo độ dài chuỗi hex là chẵn
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }

    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      text += String.fromCharCode(charCode);
    }
    return text;
  }

  // Hàm sao chép vào clipboard
  function copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

  // Hiển thị phản hồi khi sao chép
  function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Đã sao chép!';
    button.style.backgroundColor = '#28a745';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 1500);
  }

  // Khôi phục trạng thái từ lần sử dụng trước
  chrome.storage.local.get(['textValue', 'hexValue'], function(result) {
    if (result.textValue) {
      textInput.value = result.textValue;
      checkForURL(result.textValue);
    }
    if (result.hexValue) hexInput.value = result.hexValue;
  });

  // Lưu trạng thái khi đóng sidepanel
  window.addEventListener('beforeunload', function() {
    chrome.storage.local.set({
      textValue: textInput.value,
      hexValue: hexInput.value
    });
  });
});
