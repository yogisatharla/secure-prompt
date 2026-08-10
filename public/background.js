// Chrome Extension Background Service Worker
// Enables opening the side panel when clicking the extension icon in the toolbar
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Side panel behavior setup error:', error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('Secure Prompt Side Panel Extension installed successfully.');
});
