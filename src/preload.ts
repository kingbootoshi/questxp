import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  addTask: (title: string) => ipcRenderer.invoke('tasks:add', { title }),
  getTasks: () => ipcRenderer.invoke('tasks:get'),
  getProfile: () => ipcRenderer.invoke('profile:get'),
  setProfile: (profile: any) => ipcRenderer.invoke('profile:set', profile),
  openQuick: () => ipcRenderer.invoke('quick:create'),
  log: (level: string, msg: string) => ipcRenderer.send('log:renderer', level, msg),
});