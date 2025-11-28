# LinkFlow Extension Testing Guide

## Quick Start

### 1. Build the Extension
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension"
npm run build
```

### 2. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" button
4. Navigate to and select: `/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-frontend/extension/dist/`
5. Extension should load successfully

### 3. Note the Extension ID
- After loading, find LinkFlow in the extensions list
- Copy the extension ID (under the extension name)
- Example: `nkpakkkiokkgeblbgeibpcpockbgafpd`

### 4. Verify Backend Configuration
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-backend"
cat .env | grep CHROME_EXTENSION_IDS
```
- Should show: `CHROME_EXTENSION_IDS=nkpakkkiokkgeblbgeibpcpockbgafpd`
- If your extension ID is different, update the .env file
- Restart backend if you made changes

---

## Test Scenarios

### Test 1: Basic Functionality
**Objective:** Verify button injection and popup opening

1. Navigate to any LinkedIn profile (e.g., linkedin.com/in/williamhgates)
2. Button should appear saying "Add to LinkFlow"
3. Click the button
4. Button should show "Opening..." briefly
5. Popup should open

**Expected Result:** ✅ Button appears and popup opens without errors

**If it fails:**
- Press F12, check Console for errors
- Look for `[LinkFlow]` prefixed messages
- Check if content script loaded

---

### Test 2: Login and Session Persistence
**Objective:** Verify authentication persists across popup close/open

1. Click extension icon to open popup
2. Login with your credentials
3. Should see "Signed in as [your-email]"
4. Close popup
5. Reopen popup (click extension icon again)
6. Should still be logged in (no login form)

**Expected Result:** ✅ Session persists across popup close/open

**Debugging:**
- Right-click extension icon → "Inspect popup"
- Check Console for `[LinkFlow Popup] Initializing with stored token: Found`
- Check Application → Storage → Extension Storage for `authToken`

---

### Test 3: Extension Reload Recovery
**Objective:** Verify graceful handling of extension context invalidation

1. Navigate to LinkedIn profile
2. Click "Add to LinkFlow" button - should work
3. Go to `chrome://extensions/`
4. Find LinkFlow extension
5. Click the reload button (circular arrow icon)
6. Go back to LinkedIn profile
7. Click "Add to LinkFlow" button again

**Expected Result:** ✅ Alert appears: "LinkFlow extension was updated. Please reload this page to continue."

8. Refresh the LinkedIn page
9. Click button again - should work normally

**Debugging:**
- Check Console for `[LinkFlow] Extension context invalidated` warning

---

### Test 4: Network Error Handling
**Objective:** Verify session is not lost on network errors

1. Login to extension (if not already)
2. Turn off WiFi / disconnect from internet
3. Close and reopen popup
4. Should see error: "Failed to verify session. Check your connection."
5. Turn WiFi back on
6. Close and reopen popup
7. Should verify successfully and show logged in state

**Expected Result:** ✅ Network error doesn't log you out; session resumes when connection restored

**Debugging:**
- Check Console for distinction between "session expired" vs "network error"
- Verify token is still in storage: Application → Extension Storage → `authToken`

---

### Test 5: CORS and Origin Header
**Objective:** Verify API requests succeed with correct Origin header

1. Open popup and login
2. Open DevTools (right-click extension → Inspect popup)
3. Go to Console tab
4. Look for: `[LinkFlow API] Using extension origin: chrome-extension://[id]`
5. Note the extension ID
6. Compare with backend .env `CHROME_EXTENSION_IDS`
7. Should match

**Expected Result:** ✅ Login succeeds, no CORS errors

**If CORS error occurs:**
- Copy the extension ID from Console log
- Update backend .env: `CHROME_EXTENSION_IDS=<the-copied-id>`
- Restart backend
- Try again

---

### Test 6: Add Prospect Flow
**Objective:** Verify complete prospect creation workflow

1. Navigate to LinkedIn profile
2. Click "Add to LinkFlow" button
3. Popup opens with profile data pre-filled
4. Verify firstName, lastName, jobTitle, companyName are populated
5. Add notes if desired
6. Click "Add Prospect"
7. Should see success message
8. Profile should be saved to backend

**Expected Result:** ✅ Prospect created successfully

**Debugging:**
- Check Network tab for POST to `/api/prospects`
- Check Response status (should be 200 or 201)
- Look for `[LinkFlow API] Success` in Console

---

## Viewing Logs

### Content Script (LinkedIn Page)
```
1. Open LinkedIn profile page
2. Press F12 to open DevTools
3. Go to Console tab
4. Filter by: [LinkFlow]
```

### Popup
```
1. Right-click extension icon
2. Click "Inspect popup"
3. Console tab shows popup logs
4. Filter by: [LinkFlow Popup] or [LinkFlow API]
```

### Background Service Worker
```
1. Go to chrome://extensions/
2. Find LinkFlow extension
3. Click "Inspect views: service worker"
4. Console shows background script logs
5. Filter by: [LinkFlow Background]
```

### Backend (if running locally)
```bash
cd "/Users/matthewkramer/Documents/IronHack-HTML/Final Project/link-flow-backend"
npm run dev
# Terminal shows all request logs
# Filter by: [CORS] for CORS debugging
```

---

## Common Issues

### Issue: "Extension context invalidated"
**When:** After reloading extension
**Solution:** Refresh the LinkedIn page
**This is expected behavior** - the error handling prevents crashes

### Issue: CORS error / "Not allowed by CORS"
**Check:**
1. Extension ID in Console: `[LinkFlow API] Using extension origin:`
2. Backend .env: `CHROME_EXTENSION_IDS=`
3. Do they match?

**Fix:** Update backend .env with correct extension ID, restart backend

### Issue: Session lost
**Check:**
1. Look for 401 status in Network tab (token expired - expected)
2. Look for network timeout (connection issue - should keep session)
3. Check Console: "session expired" vs "network error"

**Fix:** 
- If 401: Re-login (token genuinely expired)
- If network: Fix connection, reopen popup

### Issue: Button doesn't appear
**Check:**
1. Are you on a LinkedIn profile page?
2. Does URL match: linkedin.com/in/[username]?
3. Check Console for errors

**Fix:**
- Refresh page
- Check content script loaded (look for `[LinkFlow]` logs)
- Verify manifest content_scripts matches LinkedIn URLs

---

## Verification Checklist

Before marking testing complete, verify:

- [ ] Extension loads without manifest errors
- [ ] Button appears on LinkedIn profile pages
- [ ] Click button opens popup
- [ ] Login works and persists
- [ ] Session survives popup close/reopen
- [ ] Extension reload shows friendly error
- [ ] Page refresh after reload fixes extension
- [ ] No CORS errors in console
- [ ] Profile data scrapes correctly
- [ ] Prospect creation succeeds
- [ ] Network error doesn't lose session
- [ ] All console logs use proper prefixes
- [ ] No uncaught exceptions
- [ ] Backend receives correct Origin header

---

## Success Criteria

All tests pass when:
1. No browser console errors
2. Session persists across popup cycles
3. Extension reload handled gracefully
4. API calls succeed (200/201 status codes)
5. CORS configured correctly
6. Logs are clear and helpful

---

## Need Help?

See detailed documentation:
- **FIXES.md** - Detailed fixes and solutions
- **CHANGES.md** - Code changes summary
- **DEBUGGING_SUMMARY.md** - High-level issue overview

All issues have been resolved with proper error handling and logging.
