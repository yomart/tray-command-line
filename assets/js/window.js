const path = require('path');

var Window = function () {}

Window.prototype.test = function () {
  console.log('baz!');
};

Window.prototype.getWindowPosition = (window,tray) => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

Window.prototype.showWindow = (window, tray) => {
  const position = Window.prototype.getWindowPosition(window,tray);
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

Window.prototype.showEditWindow = (window) => {
  window.show()
  window.focus()
}

Window.prototype.showOrHideWindow = (window, tray) => {
	if (window.isVisible()) {
    window.hide()
		return false;
  } else {
    Window.prototype.showWindow(window, tray)
		return true;
  }
}

exports.Window = new Window();
