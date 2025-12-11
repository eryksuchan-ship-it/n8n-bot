import { WebhookResponse } from '../types';

// Helper to generate a UUID for the session
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getSessionId = (): string => {
  const STORAGE_KEY = 'n8n_chat_session_id';
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

// Internal fetch wrapper that handles the actual network request
const fetchWithProxyStrategy = async (url: string, body: any, useProxy: boolean): Promise<any> => {
  // Add a timestamp to the target URL to prevent aggressive caching by proxies or browsers
  // This ensures we always hit the server for a fresh response
  const cacheBuster = `_t=${Date.now()}`;
  const targetUrlWithCacheBuster = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;

  // Ordered list of proxies to try.
  // 1. corsproxy.io: Very reliable, specifically built for this.
  // 2. thingproxy: Good backup.
  const PROXIES = [
    (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
    (target: string) => `https://thingproxy.freeboard.io/fetch/${target}`,
  ];

  // Common Fetch Options
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    // Important: 'omit' prevents sending cookies/auth headers which can trigger stricter CORS on some servers
    credentials: 'omit', 
    referrerPolicy: 'no-referrer', 
  };

  // If proxy is disabled, just try direct
  if (!useProxy) {
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`Direct connection error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (e: any) {
      // If direct fails with TypeError (fetch failed), it's likely CORS.
      if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
         throw new Error('Direct connection failed (CORS blocked). Please enable Proxy in settings.');
      }
      throw e;
    }
  }

  // If proxy is enabled, try each one in sequence
  let lastError: any;

  for (const formatProxyUrl of PROXIES) {
    try {
      // We use the URL with cache buster for the target
      const proxyUrl = formatProxyUrl(targetUrlWithCacheBuster);
      console.log(`Attempting proxy: ${proxyUrl}`); 
      
      const response = await fetch(proxyUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`Proxy status ${response.status}: ${response.statusText}`);
      }

      // Try to parse JSON, but handle if it's text (common with proxy errors)
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('Proxy returned non-JSON:', text);
        throw new Error('Received invalid response from server.');
      }

    } catch (error) {
      console.warn('Proxy attempt failed:', error);
      lastError = error;
      // Continue to next proxy in list
    }
  }

  throw lastError || new Error('All proxy attempts failed. Check your internet connection or the Webhook URL.');
};

export const sendMessageToWebhook = async (url: string, message: string, useProxy: boolean = false): Promise<string> => {
  if (!url) {
    throw new Error('Webhook URL is not configured.');
  }

  const sessionId = getSessionId();
  
  const payload = {
    action: 'sendMessage',
    chatInput: message,
    text: message, // Sending both common field names to be safe
    sessionId: sessionId
  };

  try {
    const rawData = await fetchWithProxyStrategy(url, payload, useProxy);
    
    // n8n often returns an array of items, we take the first one
    const data: WebhookResponse = Array.isArray(rawData) ? rawData[0] : rawData;

    // Look for common response fields from n8n Agent/Chain nodes
    return data.output || data.text || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    let errorMessage = error.message || 'Failed to connect to the chatbot service.';
    
    if (errorMessage.includes('Failed to fetch')) {
      errorMessage = 'Connection failed. Access to the n8n server was blocked (CORS). Verify the "Proxy" setting is enabled.';
    }
    
    throw new Error(errorMessage);
  }
};