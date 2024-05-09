const electron = require('electron')

// Initialise application
electron.app.whenReady().then(function () {

    // Create a new window
    var window = new electron.BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: true, // Allow resizing
        webPreferences: {
            nativeWindowOpen: true
        }
    });

    // Specify user agent so "download iCloud for Windows" banner doesn't appear
    electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15";
        callback({
            cancel: false,
            requestHeaders: details.requestHeaders
        });
    });

    // Hide default top menu
    window.setMenu(null);

    // Make links set to open a new tab and window.open() open in the default browser instead of a new application window
    window.webContents.on("new-window", function (event, url) {
        event.preventDefault();

        if (url !== "about:blank#blocked") electron.shell.openExternal(url);
    });

    // Load the iCloud notes page
    window.loadURL("https://www.icloud.com/notes/");
});

// Quit when all windows closed
electron.app.on('window-all-closed', function () {
    electron.app.quit();
});

let isDarkMode = false;

// Function to toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? 'dark' : 'light';
    window.webContents.executeJavaScript(`document.documentElement.setAttribute('data-theme', '${theme}');`);
}

const { globalShortcut } = require('electron');

// Register global shortcut for toggling dark mode
globalShortcut.register('CommandOrControl+D', toggleDarkMode);

const { Tray, Menu } = require('electron');
const path = require('path');

let tray = null;

// Create tray icon
function createTrayIcon() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Toggle Dark Mode', click: toggleDarkMode },
        { label: 'Quit', click: () => { electron.app.quit(); } }
    ]);
    tray.setToolTip('Your App Name');
    tray.setContextMenu(contextMenu);
}

// Call createTrayIcon() when app is ready
electron.app.whenReady().then(createTrayIcon);
