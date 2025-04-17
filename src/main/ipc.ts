import { ipcMain } from 'electron';
import crypto from 'node:crypto';
import { loadTasks, saveTask, Task } from './store';
import logger from './logger';
import { createQuickWindow } from './windows';
import { loadProfile, saveProfile, Profile } from './profile';
import { chooseXp } from './ai';

export function registerIpc() {
  // ---------- Task channels ----------
  ipcMain.handle('tasks:get', async () => {
    logger.debug('IPC get tasks');
    return loadTasks();
  });

  ipcMain.handle('tasks:add', async (_e, payload: { title: string }) => {
    logger.debug('IPC add task');

    const profile = await loadProfile();
    const { category, xp } = await chooseXp(payload.title, profile);

    const task: Task = {
      id: crypto.randomUUID(),
      title: payload.title,
      category,
      xp,
      createdAt: new Date().toISOString(),
    };

    await saveTask(task);
    return task;
  });

  // ---------- Profile channels ----------
  ipcMain.handle('profile:get', async () => loadProfile());
  ipcMain.handle('profile:set', async (_e, profile: Profile) => saveProfile(profile));

  // ---------- UI channels ----------
  ipcMain.handle('quick:create', async () => {
    logger.debug('IPC quick:create');
    createQuickWindow();
  });

  // ---------- Renderer‑side logging ----------
  ipcMain.on('log:renderer', (_e, level: string, message: string) => {
    logger.log({ level, message: `[renderer] ${message}` });
  });
}