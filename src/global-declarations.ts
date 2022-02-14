import { LangRoutes } from './main';
import { SettingsDialog } from './settings-dialog';
import '@material/mwc-snackbar'
import './strokes-dialog'
import { StrokesDialog } from './strokes-dialog';
import { QuickSearch } from './quick-search';
import { DataManager } from './DataManager';
import './DataManager'
import './tag-dialog'
import { TagDialog } from './tag-dialog';
import './tag-element'

declare global {
  interface Window {
    app: LangRoutes;
    settingsDialog: SettingsDialog;
    toast: (message: string, timeoutMs?: number) => void;
    strokesDialog: StrokesDialog;
    quickSearch: QuickSearch;
    dataManager: DataManager;
    tagDialog: TagDialog;
  }
}