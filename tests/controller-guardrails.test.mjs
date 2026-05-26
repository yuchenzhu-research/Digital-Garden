import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const read = (...segments) =>
  fs.readFileSync(path.join(rootDir, ...segments), 'utf8');

test('homepage shell stays wired through useHomePageController and feature sections', () => {
  const page = read('src', 'app', 'page.tsx');

  assert.match(page, /useHomePageController/);
  assert.match(page, /FeaturedArchiveSection/);
  assert.match(page, /PersonalCollectionSection/);
  assert.match(page, /ArchiveBrowserSection/);
  assert.match(page, /HomeFooter/);
  assert.doesNotMatch(page, /@\/services\//);
  assert.doesNotMatch(page, /hasMobileDraft/);
  assert.doesNotMatch(page, /entryToDocument/);

});

test('EntryEditor shell stays layered through hooks and editor sections', () => {
  const entryEditor = read('src', 'components', 'features', 'EntryEditor.tsx');

  assert.match(entryEditor, /useEntryEditorFormState/);
  assert.match(entryEditor, /useEntryEditorDraftBridge/);
  assert.match(entryEditor, /EntryEditorImageStage/);
  assert.match(entryEditor, /EntryEditorHero/);
  assert.match(entryEditor, /EntryEditorSidebar/);
  assert.match(entryEditor, /EntryEditorBody/);
  assert.match(entryEditor, /EntryEditorActions/);
  assert.doesNotMatch(entryEditor, /const AutoResizeTextarea =/);
  assert.doesNotMatch(entryEditor, /saveMobileDraft|getMobileDraft|clearMobileDraft/);
});

test('settings and data UI components rely on controller hooks instead of storage orchestration', () => {
  const settingsPanel = read('src', 'components', 'features', 'SettingsPanel.tsx');
  const dataManagement = read('src', 'components', 'ui', 'DataManagement.tsx');

  assert.match(settingsPanel, /useSettingsPanelController/);
  assert.doesNotMatch(settingsPanel, /getWebFS/);
  assert.doesNotMatch(settingsPanel, /requestDirectoryAccess/);
  assert.doesNotMatch(settingsPanel, /window\.location\.reload/);
  assert.doesNotMatch(settingsPanel, /useMobileDevice/);
  assert.doesNotMatch(settingsPanel, /isTauri\(/);

  assert.match(dataManagement, /useDataManagementController/);
  assert.doesNotMatch(dataManagement, /exportToFile/);
  assert.doesNotMatch(dataManagement, /importFromFile/);
  assert.doesNotMatch(dataManagement, /getStorageLocation/);
  assert.doesNotMatch(dataManagement, /getStorageModeInfo/);
  assert.doesNotMatch(dataManagement, /getUserEntryCount/);
});

test('controller hooks continue to own the extracted orchestration branches', () => {
  const homeController = read('src', 'hooks', 'useHomePageController.ts');
  const draftBridge = read('src', 'hooks', 'useEntryEditorDraftBridge.ts');
  const settingsController = read('src', 'hooks', 'useSettingsPanelController.ts');
  const dataController = read('src', 'hooks', 'useDataManagementController.ts');

  assert.match(homeController, /getEntries/);
  assert.match(homeController, /deleteEntry/);
  assert.match(homeController, /hasMobileDraft/);
  assert.match(homeController, /document\.body\.style\.overflow/);

  assert.match(draftBridge, /saveMobileDraft/);
  assert.match(draftBridge, /entryService\.saveDraft/);
  assert.match(draftBridge, /window\.setTimeout/);
  assert.match(draftBridge, /1500/);

  assert.match(settingsController, /getWebFS/);
  assert.match(settingsController, /requestDirectoryAccess/);
  assert.match(settingsController, /window\.location\.reload/);

  assert.match(dataController, /statusTimeoutRef/);
  assert.match(dataController, /exportToFile/);
  assert.match(dataController, /importFromFile/);
  assert.match(dataController, /getStorageLocation/);
  assert.match(dataController, /getUserEntryCount/);
});
