// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.resize(500, 500);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = async (msg: { type: string; colors: string }) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-colors") {
    // This plugin creates rectangles on the screen.
    const purifiedArray = purifyUserInput(msg.colors);
    const nodes: SceneNode[] = [];
    for (let i = 0; i < purifiedArray.length; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      const rgbValue = hexToRGB(purifiedArray[i]);
      rect.fills = [{ type: "SOLID", color: rgbValue }];
      rect.cornerRadius = 8;
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.group(nodes, figma.currentPage);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.closePlugin();

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at th  e bottom of the screen.
  }
  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

function purifyUserInput(colors: string) {
  const purifiedColors = colors
    .split(/[\s,]+/)
    .map((color) => color.trim())
    .filter(Boolean);

  return purifiedColors;
}

function hexToRGB(hex: string) {
  let hexString = hex.replace("#", "");
  hexString = duplicateHexNumber(hexString);
  const r = parseInt(hexString.substring(0, 2), 16) / 255;
  const g = parseInt(hexString.substring(2, 4), 16) / 255;
  const b = parseInt(hexString.substring(4), 16) / 255;
  return { r, g, b };
}

function duplicateHexNumber(hex: string) {
  if (hex.length === 3) {
    return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return hex;
}
