// ─── Hàm chuyển đổi ──────────────────────────────────────────────────────────

/**
 * Chuyển văn bản sang chuỗi hex liền (không dấu cách).
 * VD: "hello" -> "68656c6c6f"
 */
const convertToHex = (text) => {
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
};

/**
 * Chuyển chuỗi hex sang văn bản.
 * Hỗ trợ cả chuỗi liền (68656c6c6f) lẫn cách nhau (68 65 6c 6c 6f).
 */
const convertToText = (hex) => {
  // Loại bỏ mọi khoảng trắng để xử lý chuỗi hex liền
  hex = hex.replace(/\s+/g, '');

  if (hex.length === 0) return '';

  // Nếu độ dài lẻ, thêm '0' vào đầu
  if (hex.length % 2 !== 0) hex = '0' + hex;

  let text = '';
  for (let i = 0; i < hex.length; i += 2) {
    text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return text;
};

/**
 * Kiểm tra xem chuỗi có phải URL hợp lệ không.
 * Dùng URL API native thay vì Regex phức tạp.
 */
const isValidURL = (str) => {
  try {
    // Thêm protocol nếu thiếu để URL() không throw
    const urlStr = /^https?:\/\//i.test(str) ? str : 'https://' + str;
    new URL(urlStr);
    // Đảm bảo chuỗi gốc có ít nhất 1 dấu chấm (là domain, không phải chỉ là từ đơn)
    return str.includes('.');
  } catch {
    return false;
  }
};

// ─── Context Menu ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'convertToHex',
    title: 'Convert to Hex',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'convertToText',
    title: 'Convert to Text',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'convertToHex') {
    const hexResult = convertToHex(info.selectionText);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (result) => {
        navigator.clipboard
          .writeText(result)
          .then(() => showToast(`Hex đã sao chép: ${result}`))
          .catch(() => showToast('Không thể sao chép vào clipboard.', true));

        function showToast(message, isError = false) {
          const toast = document.createElement('div');
          toast.textContent = message;
          Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '2147483647',
            padding: '10px 18px',
            borderRadius: '8px',
            background: isError ? '#c0392b' : '#2d2d2d',
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            maxWidth: '380px',
            wordBreak: 'break-all',
          });
          document.body.appendChild(toast);
          requestAnimationFrame(() => { toast.style.opacity = '1'; });
          setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
          }, 3000);
        }
      },
      args: [hexResult],
    });

  } else if (info.menuItemId === 'convertToText') {
    // Validate hex input trước khi convert
    const cleanHex = info.selectionText.replace(/\s+/g, '');
    if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const toast = document.createElement('div');
          toast.textContent = 'Chuỗi được chọn không phải là Hex hợp lệ.';
          Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '2147483647',
            padding: '10px 18px', borderRadius: '8px', background: '#c0392b',
            color: '#fff', fontSize: '14px', fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', opacity: '0',
            transition: 'opacity 0.3s ease',
          });
          document.body.appendChild(toast);
          requestAnimationFrame(() => { toast.style.opacity = '1'; });
          setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
        },
      });
      return;
    }

    const textResult = convertToText(info.selectionText);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (result) => {
        function isValidURL(str) {
          try {
            const urlStr = /^https?:\/\//i.test(str) ? str : 'https://' + str;
            new URL(urlStr);
            return str.includes('.');
          } catch { return false; }
        }

        function showToast(message, isError = false) {
          const toast = document.createElement('div');
          toast.textContent = message;
          Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '2147483647',
            padding: '10px 18px', borderRadius: '8px',
            background: isError ? '#c0392b' : '#2d2d2d', color: '#fff',
            fontSize: '14px', fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', opacity: '0',
            transition: 'opacity 0.3s ease', maxWidth: '380px', wordBreak: 'break-all',
          });
          document.body.appendChild(toast);
          requestAnimationFrame(() => { toast.style.opacity = '1'; });
          setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
        }

        if (isValidURL(result)) {
          const url = /^https?:\/\//i.test(result) ? result : 'https://' + result;
          // Hiện thông báo với link
          const toast = document.createElement('div');
          Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '2147483647',
            padding: '12px 18px', borderRadius: '10px', background: '#1a1a2e',
            color: '#fff', fontSize: '14px', fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)', opacity: '0',
            transition: 'opacity 0.3s ease', maxWidth: '400px', lineHeight: '1.6',
          });
          toast.innerHTML = `<div style="margin-bottom:8px;color:#a0c4ff;">🔗 URL phát hiện:</div>
            <div style="word-break:break-all;margin-bottom:10px;font-size:13px;">${result}</div>
            <div style="display:flex;gap:8px;">
              <button id="hsc-open" style="flex:1;padding:6px 10px;border:none;border-radius:6px;background:#4285f4;color:#fff;cursor:pointer;font-size:13px;">Mở tab mới</button>
              <button id="hsc-copy" style="flex:1;padding:6px 10px;border:none;border-radius:6px;background:#34a853;color:#fff;cursor:pointer;font-size:13px;">Sao chép</button>
              <button id="hsc-close" style="padding:6px 10px;border:none;border-radius:6px;background:#555;color:#fff;cursor:pointer;font-size:13px;">✕</button>
            </div>`;
          document.body.appendChild(toast);
          requestAnimationFrame(() => { toast.style.opacity = '1'; });

          const dismiss = () => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); };
          toast.querySelector('#hsc-open').onclick = () => { window.open(url, '_blank'); dismiss(); };
          toast.querySelector('#hsc-copy').onclick = () => { navigator.clipboard.writeText(result); dismiss(); };
          toast.querySelector('#hsc-close').onclick = dismiss;
        } else {
          navigator.clipboard
            .writeText(result)
            .then(() => showToast(`Đã sao chép: ${result}`))
            .catch(() => showToast(result));
        }
      },
      args: [textResult],
    });
  }
});

// ─── Mở Side Panel khi click icon ────────────────────────────────────────────

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});
