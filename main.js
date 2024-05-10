const { app, BrowserWindow, session } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // Specify user agent so "download iCloud for Windows" banner doesn't appear
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15";
    callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    });
  });

  // Hide default top menu
  mainWindow.setMenu(null);

  // Make links set to open a new tab and window.open() open in the default browser instead of a new application window
  mainWindow.webContents.on("new-window", function (event, url) {
    event.preventDefault();
    if (url !== "about:blank#blocked") electron.shell.openExternal(url);
  });

  mainWindow.loadURL('https://www.icloud.com/notes');

  // Specify user agent to prevent "download iCloud for Windows" banner
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15";
    callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    });
  });

  // Listen for authentication-related cookies
  session.defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
    if (!removed && cookie.domain.includes('.icloud.com')) {
      // Store the authentication-related cookie
      if (cookie.name === 'X-APPLE-WEBAUTH-TOKEN') {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: app.getPath('userData'),
          args: [
            '--authToken=' + cookie.value
          ]
        });
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
