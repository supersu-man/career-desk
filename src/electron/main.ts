import { app } from 'electron';
import { setupIpcHandlers } from './ipc-handlers';
import { setupAutoUpdater } from './updater';
import { WindowManager } from './window-manager';
import { FileStorage } from './storage';

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

const storage = new FileStorage();

setupAutoUpdater();
setupIpcHandlers(storage);

app.on('ready', () => {
  WindowManager.createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (WindowManager.getMainWindow() === null) {
    WindowManager.createMainWindow();
  }
});
