const convertToHex = (text) => {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(16))
    .join(" ");
};

const convertToText = (hex) => {
  return hex
    .split(" ")
    .map((h) => String.fromCharCode(parseInt(h, 16)))
    .join("");
};

// Context menu functionality
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertToHex",
    title: "Convert to Hex",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "convertToText",
    title: "Convert to Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToHex") {
    const hexResult = convertToHex(info.selectionText);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (result) => {
        navigator.clipboard
          .writeText(result)
          .then(() => {
            alert("Hex copied to clipboard: " + result);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy hex to clipboard.");
          });
      },
      args: [hexResult],
    });
  } else if (info.menuItemId === "convertToText") {
    const textResult = convertToText(info.selectionText);
    console.log("convertToText");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (result) => {
        console.log("result :>> ", result);
        const validURL = (str) => {
          const pattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
              "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
              "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
              "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
              "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
              "(\\#[-a-z\\d_]*)?$",
            "i"
          ); // fragment locator
          return !!pattern.test(str);
        };

        if (validURL(result)) {
          const userChoice = confirm(
            `The text is a valid URL: ${result}\nWould you like to open it in a new tab?`
          );
          if (userChoice) {
            window.open(
              /^https?:\/\//.test(result) ? result : "https://" + result,
              "_blank"
            );
          } else {
            navigator.clipboard
              .writeText(result)
              .then(() => {
                alert("URL copied to clipboard: " + result);
              })
              .catch((err) => {
                console.error("Failed to copy URL: ", err);
                alert("Failed to copy URL to clipboard.");
              });
          }
        } else {
          alert("Text: " + result);
        }
      },
      args: [textResult],
    });
  } else {
    console.log("WTF???");
  }
});
