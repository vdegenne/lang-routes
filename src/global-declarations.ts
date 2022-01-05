import { LangRoutes } from './main';
import { SettingsDialog } from './settings-dialog';

declare global {
  interface Window {
    app: LangRoutes;
    settingsDialog: SettingsDialog;
  }
}