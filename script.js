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

document.addEventListener("DOMContentLoaded", function () {
  const hexInput = document.getElementById("hexInput");
  const textInput = document.getElementById("textInput");

  hexInput.addEventListener("input", function () {
    textInput.value = convertToText(hexInput.value.trim());
  });

  textInput.addEventListener("input", function () {
    hexInput.value = convertToHex(textInput.value);
  });
});
