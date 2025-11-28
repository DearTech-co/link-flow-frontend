import { isLinkedInProfilePage, extractProfileId, buildLinkedInUrl } from '../utils/linkedinDetector.js';

const INJECT_BUTTON_ID = 'linkflow-add-button';
let lastUrl = window.location.href;
let observer = null;

function scrapeProfile() {
  const fullName = document.querySelector('h1.text-heading-xlarge')?.textContent?.trim() || '';
  const headline = document.querySelector('.text-body-medium.break-words')?.textContent?.trim()
    || document.querySelector('.text-body-medium')?.textContent?.trim()
    || '';

  // Try to derive company from button aria-label
  const companyButton = Array.from(document.querySelectorAll('button[aria-label]'))
    .find((btn) => (btn.getAttribute('aria-label') || '').toLowerCase().includes('current company'));
  const companyName = companyButton?.textContent?.trim() || '';

  const profileId = extractProfileId(window.location.href);
  const linkedinUrl = buildLinkedInUrl(profileId) || window.location.href;

  const [firstName = '', ...rest] = fullName.split(' ').filter(Boolean);
  const lastName = rest.join(' ');

  return {
    linkedinUrl,
    firstName,
    lastName,
    jobTitle: headline,
    companyName
  };
}

function cacheProfile() {
  const profile = scrapeProfile();

  // Check if extension context is still valid before sending message
  if (!chrome.runtime?.id) {
    console.warn('[LinkFlow] Extension context invalidated. Please reload the page.');
    return;
  }

  try {
    chrome.runtime.sendMessage({ type: 'CACHE_PROFILE', profile }, (response) => {
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
      sendResponse({ profile: scrapeProfile() });
      return true;
    }
    return false;
  });
}

function buildButton() {
  const button = document.createElement('button');
  button.id = INJECT_BUTTON_ID;
  button.type = 'button';
  button.textContent = 'Add to LinkFlow';
  button.className = 'linkflow-button';
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Check if extension context is valid
    if (!chrome.runtime?.id) {
      alert('LinkFlow extension was updated. Please reload this page to continue.');
      return;
    }

    try {
      cacheProfile();

      // Provide visual feedback
      const originalText = button.textContent;
      button.textContent = 'Opening...';
      button.disabled = true;

      // Reset button after a short delay
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    } catch (err) {
      console.error('[LinkFlow] Button click error:', err);
      button.textContent = 'Error - Try Again';
      setTimeout(() => {
        button.textContent = 'Add to LinkFlow';
      }, 2000);
    }
  });
  return button;
}

function injectButton() {
  if (document.getElementById(INJECT_BUTTON_ID)) return;

  const target = document.querySelector('[data-view-name="profile-top-card"]') ||
    document.querySelector('main');

  if (!target) return;

  const button = buildButton();
  target.prepend(button);
}

function observeNavigation() {
  const title = document.querySelector('head > title');
  if (!title) return;

  const debounce = (fn, wait = 150) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  };

  const onChange = debounce(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl && isLinkedInProfilePage(currentUrl)) {
      lastUrl = currentUrl;
      injectButton();
      cacheProfile();
    }
  });

  observer = new MutationObserver(onChange);
  observer.observe(title, { childList: true });
}

function init() {
  if (!isLinkedInProfilePage(window.location.href)) return;
  injectButton();
  cacheProfile();
  handleMessages();
  observeNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
