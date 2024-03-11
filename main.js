const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
var macaddress = require('macaddress');

async function getMac() {
  return new Promise((resolve, reject) => {
    macaddress.one((err, mac) => {
      if (err) {
        reject(err); // Reject the promise if an error occurs
      } else {
        resolve(mac); // Resolve the promise with the MAC address
      }
    });
  });
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "/logo.ico"),
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration for security
      contextIsolation: true, // Use context isolation for security
      enableRemoteModule: false, // Disable remote module for security
      devTools: false,
    },
  });
  try {
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.control || (input.alt && input.type === "keyDown")) {
        app.exit();
      }
    });
    mainWindow.webContents.on("context-menu", (e, params) => {
      const contextMenu = Menu.buildFromTemplate([
        { label: "Cut", role: "cut" },
        { label: "Copy", role: "copy" },
        { label: "Paste", role: "paste" },
        { label: "Select All", role: "selectAll" },
        { type: "separator" },
        {
          label: "Back",
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          },
          // This will enable the Back option only if there is a history to go back to
          enabled: mainWindow.webContents.canGoBack(),
        },
      ]);

      contextMenu.popup();
    });
    let mac = await getMac()
    mainWindow.loadURL("https://demo.educationverse.org/frontend/login.php?secret=833f3921ff7ac4f60c9b5bdf7096c5828f5138361a0a8b2096bbc6e0009901b1&mac="+mac);

    mainWindow.setContentProtection("enable");
  } catch (error) {
    console.log(error);
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
