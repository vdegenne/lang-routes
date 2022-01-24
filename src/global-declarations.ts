import { LangRoutes } from './main';
import { SettingsDialog } from './settings-dialog';
import '@material/mwc-snackbar'
import './strokes-dialog'
import { StrokesDialog } from './strokes-dialog';

declare global {
  interface Window {
    app: LangRoutes;
    settingsDialog: SettingsDialog;
    toast: (message: string, timeoutMs?: number) => void;
    strokesDialog: StrokesDialog;
  }
}