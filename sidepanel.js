document.addEventListener('DOMContentLoaded', function() {
  // Lấy các phần tử DOM
  const textInput = document.getElementById('textInput');
  const hexInput = document.getElementById('hexInput');
  const clearAllBtn = document.getElementById('clearAll');
  const copyTextBtn = document.getElementById('copyText');
  const copyHexBtn = document.getElementById('copyHex');

  // Xóa tất cả nội dung
  clearAllBtn.addEventListener('click', function() {
    textInput.value = '';
    hexInput.value = '';
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

  // Tự động chuyển đổi khi nhập liệu
  textInput.addEventListener('input', function() {
    if (textInput.value) {
      const hex = textToHex(textInput.value);
      hexInput.value = hex;
    } else {
      hexInput.value = '';
    }
  });

  hexInput.addEventListener('input', function() {
    if (hexInput.value) {
      try {
        const text = hexToText(hexInput.value.trim());
        textInput.value = text;
      } catch (e) {
        // Không hiển thị lỗi khi đang nhập liệu
      }
    } else {
      textInput.value = '';
    }
  });

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
    if (result.textValue) textInput.value = result.textValue;
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
