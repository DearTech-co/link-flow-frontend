import { isLinkedInProfilePage, extractProfileId, buildLinkedInUrl } from '../utils/linkedinDetector.js';

const INJECT_BUTTON_ID = 'linkflow-add-button';
let lastUrl = window.location.href;
let observer = null;
let injectRetries = 0;
const MAX_INJECT_RETRIES = 20;
let isUpdatingButton = false; // Prevent recursive button updates
let lastScrapeTime = 0;
const SCRAPE_DEBOUNCE_MS = 1000; // Prevent scraping more than once per second

const debounce = (fn, wait = 200) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

const hasProfileData = (profile) => Boolean(
  profile &&
  profile.linkedinUrl &&
  (profile.firstName || profile.lastName || profile.jobTitle || profile.companyName)
);

const NAME_SELECTORS = [
  'h1.text-heading-xlarge',
  '[data-view-name="profile-top-card"] h1',
  '[data-view-name="profile-top-card"] p[class*="_7341beb6"]',
  '[data-anonymize="person-name"]',
  'p[class*="_7341beb6"]',
  'h1'
];

const DEGREE_SELECTORS = [
  'p[class*="_20c780ba"]',
  'span[aria-label*="degree" i]',
  '[data-anonymize="member-degree"]',
  'span.text-body-small'
];

function getTextFromSelectors(selectors = []) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  return '';
}

function getLatestCompany() {
  const companyNodes = Array.from(document.querySelectorAll(
    '[data-view-name="profile-positions"] p[class*="_20c780ba"],' +
    'section[id*="experience"] p[class*="_20c780ba"],' +
    'p[class*="_20c780ba"]'
  ));

  const companyText = companyNodes
    .map((el) => el?.textContent?.trim())
    .filter(Boolean);

  const selected = companyText.find((txt) => txt.includes('·') && !/\d/.test(txt))
    || companyText.find((txt) => !/\d/.test(txt))
    || companyText[0]
    || getTextFromSelectors(['button[aria-label*="current company" i]']);

  if (!selected) return '';

  return selected.includes('·') ? selected.split('·')[0].trim() : selected;
}

function scrapeProfile() {
  console.log('[LinkFlow TRACE] ========== scrapeProfile() CALLED ==========');
  console.log('[LinkFlow TRACE] Call stack:');
  console.trace();
  console.log('[LinkFlow TRACE] lastScrapeTime:', lastScrapeTime, 'elapsed:', Date.now() - lastScrapeTime, 'ms');

  const fullName = getTextFromSelectors([
    'h1.text-heading-xlarge',
    '[data-view-name="profile-top-card"] h1',
    '[data-view-name="profile-top-card"] p[class*="_7341beb6"]',
    'p[class*="_7341beb6"]',
    '[data-view-name="profile-top-card"] p',
    'main h1'
  ]);

  const headline = getTextFromSelectors([
    '.text-body-medium.break-words',
    '[data-view-name="profile-top-card"] .text-body-medium',
    '[data-view-name="profile-top-card"] p[class*="_7af7ea9c"]',
    'p[class*="_7af7ea9c"]',
    '[data-view-name="profile-top-card"] p:nth-of-type(2)'
  ]);

  const companyName = getLatestCompany();

  const profileId = extractProfileId(window.location.href);
  const linkedinUrl = buildLinkedInUrl(profileId) || window.location.href;

  const nameParts = fullName.split(' ').filter(Boolean);
  const firstName = nameParts.shift() || '';
  const lastName = nameParts.join(' ');

  console.log('[LinkFlow Content] Scraped profile:', {
    fullName,
    headline,
    companyName,
    linkedinUrl,
    firstName,
    lastName
  });

  return {
    linkedinUrl,
    firstName,
    lastName,
    jobTitle: headline,
    companyName
  };
}

function cacheProfile(force = false) {
  const now = Date.now();
  const elapsed = now - lastScrapeTime;

  console.log('[LinkFlow TRACE] ========== cacheProfile() CALLED ==========');
  console.log('[LinkFlow TRACE] force:', force, '| elapsed since last scrape:', elapsed, 'ms | debounce threshold:', SCRAPE_DEBOUNCE_MS, 'ms');
  console.log('[LinkFlow TRACE] Call stack:');
  console.trace();

  // Prevent scraping too frequently
  if (!force && elapsed < SCRAPE_DEBOUNCE_MS) {
    console.log('[LinkFlow] Skipping scrape - too soon since last scrape (elapsed:', elapsed, 'ms < threshold:', SCRAPE_DEBOUNCE_MS, 'ms)');
    return;
  }

  console.log('[LinkFlow TRACE] PROCEEDING WITH SCRAPE (passed debounce check)');
  const profile = scrapeProfile();
  lastScrapeTime = now;

  // Avoid overwriting cache with empty scrapes unless forced
  if (!hasProfileData(profile) && !force) {
    return;
  }

  // Check if extension context is still valid before sending message
  if (!chrome.runtime?.id) {
    console.warn('[LinkFlow] Extension context invalidated. Please reload the page.');
    return;
  }

  try {
    chrome.runtime.sendMessage({ type: 'CACHE_PROFILE', profile: { ...profile, url: window.location.href } }, (response) => {
      // Check for errors in the response
      if (chrome.runtime.lastError) {
        console.error('[LinkFlow] Error caching profile:', chrome.runtime.lastError.message);
        // If extension was reloaded, show user-friendly message
        if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
          console.warn('[LinkFlow] Extension was reloaded. Please refresh this page.');
        }
      }
    });
  } catch (err) {
    console.error('[LinkFlow] Failed to send message:', err);
  }
}

function handleMessages() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'REQUEST_PROFILE_DATA') {
      console.log('[LinkFlow TRACE] Received REQUEST_PROFILE_DATA message');

      // CRITICAL: Respect debounce for ALL scrape requests
      const now = Date.now();
      const elapsed = now - lastScrapeTime;

      if (elapsed < SCRAPE_DEBOUNCE_MS) {
        console.log('[LinkFlow] REQUEST_PROFILE_DATA denied - respecting debounce (elapsed:', elapsed, 'ms < threshold:', SCRAPE_DEBOUNCE_MS, 'ms)');
        sendResponse({ profile: null, error: 'DEBOUNCE_ACTIVE' });
        return true;
      }

      console.log('[LinkFlow TRACE] Debounce check passed, proceeding with scrape');
      const profile = scrapeProfile();
      lastScrapeTime = now;
      sendResponse({ profile });
      return true;
    }

    if (message?.type === 'PROSPECT_ADDED' || message?.type === 'PROSPECT_UPDATED') {
      // Update button state when prospect is added or updated
      console.log('[LinkFlow Content] Prospect changed, updating button state');
      updateButtonState();
      return false;
    }

    if (message?.type === 'REFRESH_BUTTON_STATE') {
      updateButtonState();
      return false;
    }

    return false;
  });
}

function setButtonState(button, state) {
  if (!button) return;

  // Remove all state classes
  button.classList.remove('linkflow-button-loading', 'linkflow-button-added', 'linkflow-button-error');

  switch (state) {
    case 'loading':
      button.textContent = 'Checking...';
      button.disabled = true;
      button.classList.add('linkflow-button-loading');
      break;
    case 'added':
      button.textContent = 'Already Added';
      button.disabled = false; // Allow re-opening to edit
      button.classList.add('linkflow-button-added');
      break;
    case 'error':
      button.textContent = 'Error - Try Again';
      button.disabled = false;
      button.classList.add('linkflow-button-error');
      break;
    case 'opening':
      button.textContent = 'Opening...';
      button.disabled = true;
      break;
    default: // 'default'
      button.textContent = 'Add to LinkFlow';
      button.disabled = false;
      button.className = 'linkflow-button';
  }
}

function buildButton() {
  const button = document.createElement('button');
  button.id = INJECT_BUTTON_ID;
  button.type = 'button';
  button.textContent = 'Add to LinkFlow';
  button.className = 'linkflow-button';

  button.addEventListener('click', async (e) => {
    e.preventDefault();

    // Check if extension context is valid
    if (!chrome.runtime?.id) {
      alert('LinkFlow extension was updated. Please reload this page to continue.');
      return;
    }

    try {
      // Profile is already cached on page load and navigation, no need to cache again
      setButtonState(button, 'opening');

      // Reset button after popup opens
      setTimeout(() => {
        // Check if button still exists and hasn't been updated
        if (button && button.textContent === 'Opening...') {
          updateButtonState();
        }
      }, 1500);
    } catch (err) {
      console.error('[LinkFlow] Button click error:', err);
      setButtonState(button, 'error');
      setTimeout(() => {
        updateButtonState();
      }, 2000);
    }
  });

  return button;
}

async function updateButtonState() {
  const button = document.getElementById(INJECT_BUTTON_ID);
  if (!button) return;

  // Prevent recursive updates that could trigger the observer
  if (isUpdatingButton) {
    console.log('[LinkFlow] Skipping button update - already in progress');
    return;
  }

  isUpdatingButton = true;

  try {
    // Use cached profile from background script instead of scraping again
    const cachedData = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_ACTIVE_PROFILE' }, (response) => {
        resolve(response?.profileData?.profile || null);
      });
    });

    const linkedinUrl = cachedData?.linkedinUrl || window.location.href;

    if (!linkedinUrl.includes('linkedin.com/in/')) {
      setButtonState(button, 'default');
      isUpdatingButton = false;
      return;
    }

    // Get auth token from storage
    const { authToken } = await chrome.storage.local.get(['authToken']);

    if (!authToken) {
      setButtonState(button, 'default');
      isUpdatingButton = false;
      return;
    }

    setButtonState(button, 'loading');

    // Check if prospect exists via background script (avoids CORS)
    chrome.runtime.sendMessage(
      {
        type: 'CHECK_PROSPECT',
        linkedinUrl: linkedinUrl,
        authToken
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('[LinkFlow] Error checking prospect:', chrome.runtime.lastError.message);
          setButtonState(button, 'default');
          isUpdatingButton = false;
          return;
        }

        if (response?.success && response.exists) {
          setButtonState(button, 'added');
        } else {
          setButtonState(button, 'default');
        }
        isUpdatingButton = false;
      }
    );
  } catch (err) {
    console.error('[LinkFlow] Error checking prospect state:', err);
    setButtonState(button, 'default');
    isUpdatingButton = false;
  }
}

function getProfileTopCard() {
  return document.querySelector('[data-view-name="profile-top-card"]') ||
    document.querySelector('[data-view-name="profile-top-card-default"]') ||
    document.querySelector('main');
}

function getFirstMatch(root, selectors) {
  if (!root) return null;
  for (const selector of selectors) {
    const el = root.querySelector(selector);
    if (el) return el;
  }
  return null;
}

function findNameRowContainer(profileTopCard) {
  const nameElement = getFirstMatch(profileTopCard || document, NAME_SELECTORS);
  if (!nameElement) {
    console.log('[LinkFlow] No name element found');
    return null;
  }

  console.log('[LinkFlow] Name element found:', nameElement);

  const degreeElement = getFirstMatch(profileTopCard || document, DEGREE_SELECTORS);
  console.log('[LinkFlow] Degree element:', degreeElement);

  // Try the known row container from provided markup
  const explicitRow = nameElement.closest('div._0aab64e7.a8dec933.b622d91b._3c1b6a38._4b543b69._32dac75d');
  if (explicitRow && (!degreeElement || explicitRow.contains(degreeElement))) {
    console.log('[LinkFlow] Found explicit row container');
    return explicitRow;
  }

  // Strategy 1: Find parent that is a flex container and contains both name and degree
  let container = null;
  if (degreeElement) {
    let current = nameElement;
    while (current && current !== (profileTopCard || document.body)) {
      const parent = current.parentElement;
      if (parent && parent.contains(nameElement) && parent.contains(degreeElement)) {
        const styles = window.getComputedStyle(parent);
        if (styles.display === 'flex' || styles.display === 'inline-flex') {
          container = parent;
          console.log('[LinkFlow] Found flex container with name and degree:', container);
          break;
        }
      }
      current = parent;
    }
  }

  // Strategy 2: Find the closest parent that is a flex container with multiple children
  if (!container) {
    let current = nameElement.parentElement;
    while (current && current !== (profileTopCard || document.body)) {
      const styles = window.getComputedStyle(current);
      const hasMultipleChildren = current.children && current.children.length > 1;

      if ((styles.display === 'flex' || styles.display === 'inline-flex') && hasMultipleChildren) {
        container = current;
        console.log('[LinkFlow] Found flex container parent:', container);
        break;
      }
      current = current.parentElement;
    }
  }

  // Strategy 3: Fallback to any ancestor with multiple children
  if (!container) {
    let current = nameElement.parentElement;
    while (current && current !== (profileTopCard || document.body)) {
      const hasMultipleChildren = current.children && current.children.length > 1;
      if (hasMultipleChildren) {
        container = current;
        console.log('[LinkFlow] Found fallback container:', container);
        break;
      }
      current = current.parentElement;
    }
  }

  return container;
}

function injectButton() {
  console.log('[LinkFlow TRACE] ========== injectButton() CALLED ==========');

  if (document.getElementById(INJECT_BUTTON_ID)) {
    // Button already exists, just update its state
    console.log('[LinkFlow TRACE] Button already exists, updating state only');
    updateButtonState();
    return;
  }

  const nameRow = findNameRowContainer();
  const profileTopCard = getProfileTopCard();
  const target = nameRow || profileTopCard;

  if (!target) {
    if (injectRetries < MAX_INJECT_RETRIES) {
      injectRetries += 1;
      console.log('[LinkFlow TRACE] Target not found, retry', injectRetries, 'of', MAX_INJECT_RETRIES);
      setTimeout(injectButton, 250);
    }
    return;
  }

  injectRetries = 0;

  const button = buildButton();

  if (nameRow) {
    // Append to the name row (flex container)
    console.log('[LinkFlow] Injecting button into name row');
    target.append(button);
  } else {
    // Fallback: Create a wrapper div to position the button correctly
    console.log('[LinkFlow] Using fallback injection into profileTopCard');
    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = `
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 8px 0;
      margin-top: 8px;
    `;
    buttonWrapper.appendChild(button);

    // Insert after the first child of profileTopCard (usually the name area)
    if (target.firstChild) {
      target.insertBefore(buttonWrapper, target.firstChild.nextSibling);
    } else {
      target.prepend(buttonWrapper);
    }
  }

  // Check button state after injection
  console.log('[LinkFlow TRACE] Button injected, scheduling updateButtonState() in 100ms');
  setTimeout(() => updateButtonState(), 100);
}

function handleNavigation() {
  const currentUrl = window.location.href;

  // Only proceed if URL changed
  if (currentUrl === lastUrl) {
    return; // Silent return - polling checks this constantly
  }

  console.log('[LinkFlow TRACE] ========== handleNavigation() CALLED ==========');
  console.log('[LinkFlow TRACE] URL changed from', lastUrl, 'to', currentUrl);

  console.log('[LinkFlow] Navigation detected:', currentUrl);

  if (isLinkedInProfilePage(currentUrl)) {
    lastUrl = currentUrl;
    console.log('[LinkFlow] Profile page detected, injecting button');

    // Remove old button if it exists
    const oldButton = document.getElementById(INJECT_BUTTON_ID);
    if (oldButton) {
      oldButton.remove();
    }

    // Disconnect old profile details observer
    if (detailsObserver) {
      detailsObserver.disconnect();
      detailsObserver = null;
    }

    // Reset retry counter for new page
    injectRetries = 0;

    console.log('[LinkFlow TRACE] About to call injectButton() and cacheProfile() for navigation');
    // Inject button and cache profile
    injectButton();
    cacheProfile();

    // observeProfileDetails(); // DISABLED - not needed
  } else {
    lastUrl = currentUrl;
    // Not a profile page, remove button if it exists
    const oldButton = document.getElementById(INJECT_BUTTON_ID);
    if (oldButton) {
      oldButton.remove();
    }

    // Disconnect profile details observer
    if (detailsObserver) {
      detailsObserver.disconnect();
      detailsObserver = null;
    }
  }
}

function observeNavigation() {
  console.log('[LinkFlow TRACE] Setting up navigation observers');

  // Method 1: Intercept History API (pushState/replaceState)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    handleNavigation();
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    handleNavigation();
  };

  // Method 2: Listen to popstate event (back/forward buttons)
  window.addEventListener('popstate', handleNavigation);

  // Method 3: Poll for URL changes (fallback for edge cases)
  // LinkedIn's SPA might use other navigation methods
  setInterval(() => {
    handleNavigation();
  }, 500);

  // Method 4: Title observer (keep as additional safety net)
  const title = document.querySelector('head > title');
  if (title) {
    const onChange = debounce(() => {
      handleNavigation();
    }, 100);

    observer = new MutationObserver(onChange);
    observer.observe(title, { childList: true, subtree: true });
  }
}

let detailsObserver = null;

function observeProfileDetails() {
  console.log('[LinkFlow TRACE] ========== observeProfileDetails() CALLED ==========');
  const target = getProfileTopCard();
  if (!target) {
    console.log('[LinkFlow TRACE] No profile top card found, cannot observe');
    return;
  }

  const recache = debounce((mutations) => {
    console.log('[LinkFlow TRACE] Profile details mutation detected, mutations count:', mutations.length);
    const button = document.getElementById(INJECT_BUTTON_ID);
    if (!button) {
      console.log('[LinkFlow TRACE] No button found during mutation, skipping recache');
      return;
    }

    // Check if any mutation involved our button - if so, ignore to prevent loop
    for (const mutation of mutations) {
      if (mutation.target === button || mutation.target.id === INJECT_BUTTON_ID) {
        console.log('[LinkFlow TRACE] Mutation involved button itself, skipping recache');
        return; // Button changed, don't recache
      }
      // Check if button is in the added/removed nodes
      const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
      for (const node of nodes) {
        if (node === button || node.id === INJECT_BUTTON_ID) {
          console.log('[LinkFlow TRACE] Button was added/removed in mutation, skipping recache');
          return; // Button changed, don't recache
        }
      }
    }

    // Only recache if LinkedIn's profile data changed significantly
    // Respect debounce to prevent rapid scraping
    console.log('[LinkFlow TRACE] About to call cacheProfile() from observer (force=false)');
    cacheProfile(); // Remove force=true to respect 1-second debounce
  }, 500); // Increased debounce to reduce unnecessary scrapes

  if (detailsObserver) {
    detailsObserver.disconnect();
  }

  console.log('[LinkFlow TRACE] Starting MutationObserver on profile top card');
  detailsObserver = new MutationObserver(recache);
  detailsObserver.observe(target, { childList: true, subtree: true });
}

function init() {
  console.log('[LinkFlow TRACE] ========== init() CALLED ==========');
  console.log('[LinkFlow] Initializing content script');

  // Set up message handlers (only once)
  handleMessages();

  // Set up navigation observers (only once)
  observeNavigation();

  // If we're on a profile page, inject button and cache profile
  if (isLinkedInProfilePage(window.location.href)) {
    console.log('[LinkFlow] Initial page is a profile page');
    console.log('[LinkFlow TRACE] About to call injectButton() and cacheProfile() from init()');
    injectButton();
    cacheProfile(); // Single scrape on init
    // observeProfileDetails(); // DISABLED - not needed, we scrape on init and navigation only
  }
}

if (document.readyState === 'loading') {
  console.log('[LinkFlow TRACE] Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('[LinkFlow TRACE] Document already loaded, calling init() immediately');
  init();
}
