import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { getAppUrl, getAssetUrl, resolveElectronPath } from './utility';
import comapnies from './companies.json';
import { scrapers } from './scrapers';
import { FileStorage } from './storage';

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1200,
    icon: getAssetUrl('favicon.ico'),
    webPreferences: {
      preload: resolveElectronPath('preload.js')
    }
  });
  mainWindow.removeMenu()

  const route = getAppUrl('jobs')

  mainWindow.loadURL(route)
  // mainWindow.webContents.openDevTools()

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

const storage = new FileStorage()
ipcMain.handle('get-companies', () => comapnies);

ipcMain.handle('get-countries', (_, companyId) => {
  const company = comapnies.find(c => c.id === companyId);
  if (!company) throw new Error("Company not found");
  if (!company.countries) return []
  return company.countries
})

ipcMain.handle('fetch-jobs', async (_, companyId, options) => {
  const company = comapnies.find(c => c.id === companyId);
  if (!company) throw new Error("Company not found");

  const scraper = scrapers[company.type];
  if (!scraper) throw new Error("No scraper for this type");

  const jobs = await scraper(company, options);
  const savedUrls = new Set(storage.getSavedJobs().map(j => j.url));
  const appliedUrls = new Set(storage.getAppliedJobs().map(j => j.url));
  return jobs.map(job => ({
    ...job,
    saved: savedUrls.has(job.url),
    applied: appliedUrls.has(job.url)
  }));
});

ipcMain.on('open-url', (event, url) => {
  const newWin = new BrowserWindow({
    height: 600,
    width: 1200,
    icon: getAssetUrl('favicon.ico')
  });
  newWin.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  newWin.removeMenu()
  newWin.loadURL(url)
  // newWin.webContents.openDevTools()
  newWin.on('closed', () => {
    newWin.destroy()
  });
});

ipcMain.on('open-url-browser', (event, url: string) => {
  shell.openExternal(url)
})

ipcMain.handle('get-saved-jobs', (event) => {
  return storage.getSavedJobs()
});

ipcMain.handle('toggle-job', (event, company, type) => {
  return storage.toggleJob(company, type)
});

ipcMain.handle('get-applied-jobs', (event) => {
  return storage.getAppliedJobs()
});
