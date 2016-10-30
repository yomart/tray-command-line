const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')
const assetsDirectory = path.join(__dirname, 'assets')
const imgDirectory = path.join(assetsDirectory, 'img')
const jsDirectory = path.join(assetsDirectory, 'js')

var exec = require('child_process').exec;

var Window = require(path.join(jsDirectory,'window')).Window;

let tray = undefined
let window = undefined
let editWindow = undefined

// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
	createTray()
	createWindow()
	createEditWindow();
})

// Quit the app when the window is closed
ipcMain.on('window-all-closed', () => {
	app.quit()
})

const createTray = () => {
	tray = new Tray(path.join(imgDirectory, 'command-line-icon.png'))
	tray.on('right-click', toggleWindow)
	tray.on('double-click', toggleWindow)
	tray.on('click', function (event) {
		toggleWindow()

		// Show devtools when command clicked
		if (window.isVisible() && process.defaultApp && event.metaKey) {
			window.openDevTools({mode: 'detach'})
		}
	})
}

const createWindow = () => {
	window = new BrowserWindow({
		width: 300,
		height: 300,
		show: false,
		frame: false,
		fullscreenable: false,
		resizable: false,
		transparent: true,
		webPreferences: {
			// Prevents renderer process code from not running when window is
			// hidden
			backgroundThrottling: false
		}
	})
	window.loadURL(`file://${path.join(__dirname, 'src/home/index.html')}`)

	// Hide the window when it loses focus
	window.on('blur', () => {
		if (!window.webContents.isDevToolsOpened()) {
			window.hide()
		}
	})
}

const createEditWindow = () => {
	editWindow = new BrowserWindow({show: false, frame: false, transparent: true})
	editWindow.loadURL(`file://${path.join(__dirname, 'src/settings/edit.html')}`)
}

const toggleWindow = () => {
	var show = Window.showOrHideWindow(window, tray)
}

ipcMain.on('show-window', () => {
	Window.showWindow(window, tray)
})

ipcMain.on('show-edit-window', () => {
	Window.showEditWindow(editWindow);
})

ipcMain.on('hide-edit-window', () => {
	editWindow.hide();
})

function execute(command, callback){
	exec(command, function(error, stdout, stderr){ callback(stdout); });
};

ipcMain.on('run-command', function(event, arg) {
	execute(arg.command, function(output) {
		console.log(output);
	});
})
