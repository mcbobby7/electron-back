const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: "",
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    var forceQuit = false;
    app.on("before-quit", function () {
      forceQuit = true;
    });
    mainWindow.on("close", function (event) {
      if (!forceQuit) {
        event.preventDefault();

        localStorage.setItem("name", "");
        localStorage.setItem("package", "");
        localStorage.setItem("canMine", "");
        localStorage.setItem("id", "");
        localStorage.setItem("token", "");
        localStorage.setItem("passkey", "");
        localStorage.setItem("routing", "");
        localStorage.setItem("isAdmin", "");
      }
    });
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
