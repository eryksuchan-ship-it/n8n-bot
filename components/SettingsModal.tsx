import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Globe, Copy, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  useProxy: boolean;
  onSave: (url: string, useProxy: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUrl, useProxy, onSave }) => {
  const [url, setUrl] = useState(currentUrl);
  const [proxyEnabled, setProxyEnabled] = useState(useProxy);
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(currentUrl);
    setProxyEnabled(useProxy);
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, [currentUrl, useProxy, isOpen]);

  const handleCopyOrigin = () => {
    navigator.clipboard.writeText(origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url, proxyEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* URL Section */}
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-2">
              n8n Webhook URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
            />
          </div>

          {/* CORS Configuration Helper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server-Side CORS Config
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">
                To disable the proxy, paste this URL into "Allowed Origins" in your n8n Chat Trigger node:
              </p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-600 font-mono flex items-center overflow-x-auto whitespace-nowrap">
                  {origin}
                </code>
                <button 
                  onClick={handleCopyOrigin}
                  className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-600"
                  title="Copy Origin URL"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Proxy Section */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="proxy-toggle" className="text-sm font-semibold text-gray-800 cursor-pointer">
                    Enable CORS Proxy
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="proxy-toggle" 
                      className="sr-only peer"
                      checked={proxyEnabled}
                      onChange={(e) => setProxyEnabled(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-emerald-700/80 leading-relaxed">
                  Turn this <b>ON</b> if you get "Failed to fetch" errors and cannot configure CORS on n8n.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
