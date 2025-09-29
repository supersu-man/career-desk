import { app, BrowserWindow, ipcMain } from 'electron';
import { getAppUrl, getAssetUrl, resolveElectronPath } from './utility';
import axios from 'axios';
import comapnies from './companies.json';
import { scrapers } from './scrapers';

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: getAssetUrl('favicon.ico'),
    webPreferences: {
      preload: resolveElectronPath('preload.js')
    }
  });
  mainWindow.removeMenu()

  const route = getAppUrl()

  mainWindow.loadURL(route)

  mainWindow.on('closed', () => {
    mainWindow.destroy()
  });
}

function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    height: 180,
    width: 500,
    resizable: false,
    closable: false,
    alwaysOnTop: true,
    icon: getAssetUrl("favicon.ico"),
    webPreferences: {
      preload: resolveElectronPath('preload.js')
    }
  });
  updateWindow.removeMenu()

  const route = getAppUrl('update')
  updateWindow.loadURL(route)

  updateWindow.on('closed', () => {
    updateWindow.destroy()
  });

}

app.on('ready', () => {
  createWindow()
  // createUpdateWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Listen for events with ipcMain.handle

ipcMain.handle('get-companies', () => comapnies);

ipcMain.handle('fetch-jobs', async (_, companyId, options) => {
  const company = comapnies.find(c => c.id === companyId);
  if (!company) throw new Error("Company not found");

  const scraper = scrapers[company.type];
  if (!scraper) throw new Error("No scraper for this type");

  return await scraper(company, options);
});
