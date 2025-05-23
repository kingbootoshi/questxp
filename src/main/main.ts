import { app, globalShortcut, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { createMainWindow, createQuickWindow } from '../core/windows';
import { registerIpc } from '../core/ipc';
import { getLogger } from '../core/logger';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;

if (started) {
  app.quit();
}

app.whenReady().then(() => {
  createMainWindow();
  registerIpc();

  // Global hotkey for quick‑add modal
  globalShortcut.register('Alt+Command+K', () => createQuickWindow());
  getLogger('main').info('QuestXP ready');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});