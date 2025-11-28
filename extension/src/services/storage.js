const TOKEN_KEY = 'authToken';

function promisifyChrome(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      try {
        fn(...args, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
}

const getFromStorage = promisifyChrome(chrome.storage.local.get.bind(chrome.storage.local));
const setInStorage = promisifyChrome(chrome.storage.local.set.bind(chrome.storage.local));
const removeFromStorage = promisifyChrome(chrome.storage.local.remove.bind(chrome.storage.local));

export async function getAuthToken() {
  const { [TOKEN_KEY]: token } = await getFromStorage([TOKEN_KEY]);
  return token || null;
}

export async function setAuthToken(token) {
  await setInStorage({ [TOKEN_KEY]: token });
}

export async function clearAuthToken() {
  await removeFromStorage([TOKEN_KEY]);
}
