document.addEventListener('DOMContentLoaded', function () {
  // ─── Lấy các phần tử DOM ────────────────────────────────────────────────────
  const textInput   = document.getElementById('textInput');
  const hexInput    = document.getElementById('hexInput');
  const clearAllBtn = document.getElementById('clearAll');
  const copyTextBtn = document.getElementById('copyText');
  const copyHexBtn  = document.getElementById('copyHex');
  const openLinkBtn = document.getElementById('openLink');

  // ─── Xóa tất cả ─────────────────────────────────────────────────────────────
  clearAllBtn.addEventListener('click', function () {
    textInput.value = '';
    hexInput.value  = '';
    setOpenLinkVisible(false);
  });

  // ─── Sao chép ────────────────────────────────────────────────────────────────
  copyTextBtn.addEventListener('click', function () {
    copyToClipboard(textInput);
    showCopyFeedback(copyTextBtn);
  });

  copyHexBtn.addEventListener('click', function () {
    copyToClipboard(hexInput);
    showCopyFeedback(copyHexBtn);
  });

  // ─── Mở liên kết ─────────────────────────────────────────────────────────────
  openLinkBtn.addEventListener('click', function () {
    const text = textInput.value.trim();
    if (text && isValidURL(text)) {
      const url = /^https?:\/\//i.test(text) ? text : 'https://' + text;
      window.open(url, '_blank');
    }
  });

  // ─── Auto-convert khi nhập ───────────────────────────────────────────────────
  textInput.addEventListener('input', function () {
    if (textInput.value) {
      hexInput.value = textToHex(textInput.value);
      checkForURL(textInput.value);
    } else {
      hexInput.value = '';
      setOpenLinkVisible(false);
    }
  });

  hexInput.addEventListener('input', function () {
    if (hexInput.value) {
      try {
        const text = hexToText(hexInput.value.trim());
        textInput.value = text;
        checkForURL(text);
      } catch {
        // Không hiển thị lỗi khi đang nhập dở
      }
    } else {
      textInput.value = '';
      setOpenLinkVisible(false);
    }
  });

  // ─── Tiện ích ────────────────────────────────────────────────────────────────

  /** Kiểm tra URL bằng URL API native của trình duyệt */
  function isValidURL(str) {
    try {
      const urlStr = /^https?:\/\//i.test(str) ? str : 'https://' + str;
      new URL(urlStr);
      // Phải có ít nhất 1 dấu chấm để là domain thật (tránh nhận diện từ đơn như "hello")
      return str.includes('.');
    } catch {
      return false;
    }
  }

  function checkForURL(text) {
    setOpenLinkVisible(isValidURL(text.trim()));
  }

  /** Ẩn/hiện nút "Mở liên kết" bằng CSS class (không dùng inline style) */
  function setOpenLinkVisible(visible) {
    openLinkBtn.classList.toggle('hidden', !visible);
  }

  function textToHex(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  }

  function hexToText(hex) {
    hex = hex.replace(/\s+/g, '');
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      throw new Error('Invalid hex string');
    }
    if (hex.length % 2 !== 0) hex = '0' + hex;

    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
      text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return text;
  }

  function copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }

  function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Đã sao chép!';
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 1500);
  }

  // ─── Khôi phục trạng thái ────────────────────────────────────────────────────
  chrome.storage.local.get(['textValue', 'hexValue'], function (result) {
    if (result.textValue) {
      textInput.value = result.textValue;
      checkForURL(result.textValue);
    }
    if (result.hexValue) hexInput.value = result.hexValue;
  });

  // ─── Lưu trạng thái khi đóng ─────────────────────────────────────────────────
  window.addEventListener('beforeunload', function () {
    chrome.storage.local.set({
      textValue: textInput.value,
      hexValue:  hexInput.value,
    });
  });
});
