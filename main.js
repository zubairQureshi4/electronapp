const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
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
      ]);

      contextMenu.popup();
    });

    mainWindow.loadURL("https://ecom.infinixaccountants.co.uk/frontend/login.php?secret=$2b$10$h9ARk0qJsRe0okcSB3HkMuKJNxCu08xQQBDFSCdPr/x6L5sHKmzHy");

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
