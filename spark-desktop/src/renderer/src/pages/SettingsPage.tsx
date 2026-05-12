import React, { useState, useEffect } from "react";
import { ICON } from "../components/icons";
import { useToast } from "../components/ToastContext";

export function SettingsPage() {
  const { showToast } = useToast();
  
  // Settings state
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Load saved settings from local storage
    setProvider(localStorage.getItem("spark_provider") || "openai-completions");
    setApiKey(localStorage.getItem("spark_api_key") || "");
    setModel(localStorage.getItem("spark_model") || "");
    setBaseUrl(localStorage.getItem("spark_base_url") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("spark_provider", provider);
    localStorage.setItem("spark_api_key", apiKey);
    localStorage.setItem("spark_model", model);
    localStorage.setItem("spark_base_url", baseUrl);
    showToast("Settings saved successfully!", "info");
  };

  return (
    <main className="main">
      <div className="main-inner">
        <div className="badge">
          <span dangerouslySetInnerHTML={{ __html: ICON.settings }} />
          Configuration
        </div>
        <h1 className="headline">API Settings</h1>
        <p className="subtitle">
          Configure your LLM provider and API keys directly in the app. 
          These keys will be saved locally on your computer.
        </p>

        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Provider</label>
            <select 
              className="form-input form-select"
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="openai-completions">OpenAI Completions</option>
              <option value="openai-responses">OpenAI Responses (O1/O3)</option>
              <option value="anthropic-messages">Anthropic Messages</option>
              <option value="google-generative-ai">Google Generative AI</option>
              <option value="ollama">Ollama (Local)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">API Key</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="sk-..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. gpt-4o" 
              value={model} 
              onChange={(e) => setModel(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Base URL (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. https://api.openai.com/v1" 
              value={baseUrl} 
              onChange={(e) => setBaseUrl(e.target.value)} 
            />
          </div>

          <button className="analyze-btn" onClick={handleSave} style={{ position: 'relative', marginTop: '20px', left: 0, bottom: 0 }}>
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
}
