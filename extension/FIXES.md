# LinkFlow Extension Fixes - November 27, 2025

## Issues Fixed

### 1. Extension Context Invalidated Error

**Problem**: When clicking "Add to LinkFlow" button, getting error:
```
Uncaught Error: Extension context invalidated.
```

**Root Cause**: When the extension is reloaded/updated while content script is active, `chrome.runtime` becomes invalid but the old content script is still running on the page.

**Fix Applied**:
- Added `chrome.runtime?.id` check before sending messages
- Added try-catch error handling around `chrome.runtime.sendMessage()` calls
- Added user-friendly alert if extension needs page reload
- Added response callback to catch `chrome.runtime.lastError`
- Added visual feedback on button click ("Opening..." state)

**Files Modified**:
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/src/content/content.js`

**Testing**:
1. Install extension in Chrome
2. Navigate to LinkedIn profile
3. Click "Add to LinkFlow" button - should work
4. Reload extension from chrome://extensions
5. Click button again - should show alert asking to reload page
6. Reload page - button should work again

---

### 2. Session Lost When Popup Closes

**Problem**: User reported losing authentication when closing popup.

**Root Cause**: 
- Storage implementation was correct (using `chrome.storage.local`)
- Issue was that network errors during token verification were clearing the token
- Popup would clear token on ANY error, not just 401 Unauthorized

**Fix Applied**:
- Only clear token on 401 (invalid/expired token), not network errors
- Added console logging to track token lifecycle
- Differentiate between "session expired" and "network error" messages
- Keep token in storage on network failures so it can retry

**Files Modified**:
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/src/popup/Popup.jsx`

**Testing**:
1. Login via popup
2. Close popup
3. Reopen popup - should still be logged in
4. Restart Chrome - should still be logged in
5. Turn off internet, reopen popup - should show network error but keep session
6. Turn on internet, reopen popup - should verify session successfully

---

### 3. Mystery Extension ID

**Issue**: DevTools showed `chrome-extension://aacbpggdjcblgnmgjgpkpddliddineni/sidebar.html`

**Investigation Result**: 
- This ID is NOT in LinkFlow codebase
- Searched entire codebase - no matches for this ID
- Searched for "sidebar.html" - no matches
- This is likely another Chrome extension installed in the user's browser
- Actual LinkFlow extension ID: `nkpakkkiokkgeblbgeibpcpockbgafpd` (from backend .env)

**Recommendation**: 
- Check chrome://extensions in browser
- Look for other LinkedIn-related extensions
- This is not a LinkFlow issue

---

### 4. Origin Header Required in Production

**Problem**: Backend rejecting requests with "Origin header required in production"

**Root Cause**:
- Extension didn't have `.env` file configured
- `api.js` uses production URL by default
- Backend is in production mode with strict CORS
- Extension was sending Origin header, but it needs to match backend whitelist

**Fix Applied**:
- Created `.env` file with proper API URL
- Added extensive logging to `api.js` to see what Origin is being sent
- Added console logging in backend CORS middleware
- Improved error messages in both frontend and backend
- Backend now logs rejected origins to help debug

**Files Modified**:
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/.env` (created)
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/src/services/api.js`
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-backend/server.js`

**Backend Configuration**:
Backend `.env` has:
```
CHROME_EXTENSION_IDS=nkpakkkiokkgeblbgeibpcpockbgafpd
```

This whitelists the extension ID. The backend converts this to:
```
chrome-extension://nkpakkkiokkgeblbgeibpcpockbgafpd
```

**Testing**:
1. Check DevTools console for "[LinkFlow API] Using extension origin:" log
2. Verify it shows correct extension ID
3. Check backend logs for CORS rejections
4. If rejected, compare extension ID in console vs backend .env
5. Update backend CHROME_EXTENSION_IDS if extension was reinstalled (new ID)

---

## Additional Improvements

### Enhanced Logging
Added comprehensive logging throughout:
- `[LinkFlow Popup]` - Popup authentication flow
- `[LinkFlow API]` - All API requests and responses  
- `[LinkFlow Background]` - Background script messages
- `[LinkFlow]` - Content script actions

### Background Script Error Handling
Added try-catch blocks and better error responses in background message handlers.

**Files Modified**:
- `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/src/background/index.js`

---

## Building and Testing

### Development Build
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension"
npm run dev
```

### Production Build
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension"
npm run build
```

### Loading Extension
1. Open chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/dist/`

### Checking Extension ID
After loading, the extension ID is shown on the extension card at chrome://extensions/

**Important**: If you uninstall and reinstall the extension, it gets a NEW ID. You must update the backend `.env` file with the new ID:

```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-backend"
# Edit .env and update CHROME_EXTENSION_IDS=<new-id>
```

### Viewing Logs

**Content Script Logs** (LinkedIn page):
- Open LinkedIn profile page
- Press F12 to open DevTools
- Go to Console tab
- Filter by "[LinkFlow]"

**Popup Logs**:
- Right-click extension icon
- Click "Inspect popup"
- Console shows popup logs

**Background Script Logs**:
- Go to chrome://extensions/
- Find LinkFlow extension
- Click "Inspect views: service worker"
- Console shows background logs

**Backend Logs** (if running locally):
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-backend"
npm run dev
# Logs show in terminal
```

---

## Common Issues and Solutions

### Issue: Button doesn't inject on LinkedIn
**Solution**: 
1. Check console for errors
2. Verify content script loaded (should see logs)
3. Try refreshing page
4. Check if LinkedIn changed their HTML structure

### Issue: "Extension context invalidated" still appears
**Solution**:
1. This is expected after reloading extension
2. User should see friendly alert
3. Refresh the LinkedIn page
4. Extension will work again

### Issue: CORS errors persist
**Solution**:
1. Check console for "[LinkFlow API] Using extension origin:" log
2. Copy the extension ID from that log
3. Update backend .env: `CHROME_EXTENSION_IDS=<that-id>`
4. Restart backend server
5. Try request again

### Issue: Session doesn't persist
**Solution**:
1. Check DevTools → Application → Storage → Extension Storage
2. Verify `authToken` is stored
3. Check popup console for "[LinkFlow Popup] Initializing with stored token:" log
4. If token not found, login again
5. If token found but verification fails, check network tab for 401 vs network error

---

## Files Changed Summary

### Frontend Extension
1. `src/content/content.js` - Extension context error handling
2. `src/popup/Popup.jsx` - Token verification error handling  
3. `src/services/api.js` - Enhanced logging and error handling
4. `src/background/index.js` - Better error handling in message handlers
5. `.env` - Created with API URL configuration

### Backend
1. `server.js` - Enhanced CORS logging

### Documentation
1. `FIXES.md` - This file

---

## Next Steps

1. Build extension: `npm run build`
2. Load in Chrome from `dist/` folder
3. Note the extension ID from chrome://extensions
4. Verify it matches backend .env CHROME_EXTENSION_IDS
5. Test on LinkedIn profile page
6. Check all console logs to verify fixes
7. Test session persistence across popup open/close
8. Test extension reload scenario

All critical issues have been addressed with proper error handling, logging, and recovery mechanisms.
