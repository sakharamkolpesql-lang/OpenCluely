/**
 * AI Provider Registry
 *
 * Defines all supported LLM providers. Gemini uses its own SDK; all others
 * use the OpenAI-compatible chat completions API format (Groq, OpenRouter,
 * OpenAI, etc.) so they share a single request path.
 */

const PROVIDERS = {
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    apiKeyEnv: 'GEMINI_API_KEY',
    apiKeyUrl: 'https://aistudio.google.com/apikey',
    apiKeyLabel: 'Gemini API Key',
    defaultModel: 'gemini-2.5-flash',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (fast, free tier)' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (higher quality)' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (legacy)' },
    ],
    apiType: 'gemini',
    supportsImages: true,
  },

  groq: {
    id: 'groq',
    label: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    apiKeyUrl: 'https://console.groq.com/keys',
    apiKeyLabel: 'Groq API Key',
    defaultModel: 'llama-3.3-70b-versatile',
    baseURL: 'https://api.groq.com/openai/v1',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (fastest)' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' },
      { id: 'qwen-2.5-coder-32b', label: 'Qwen 2.5 Coder 32B' },
    ],
    apiType: 'openai',
    supportsImages: false,
  },

  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    apiKeyUrl: 'https://openrouter.ai/keys',
    apiKeyLabel: 'OpenRouter API Key',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    baseURL: 'https://openrouter.ai/api/v1',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
      { id: 'openai/gpt-4o', label: 'GPT-4o' },
      { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (free)' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
    ],
    apiType: 'openai',
    supportsImages: true,
  },

  openai: {
    id: 'openai',
    label: 'OpenAI',
    apiKeyEnv: 'OPENAI_API_KEY',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    apiKeyLabel: 'OpenAI API Key',
    defaultModel: 'gpt-4o-mini',
    baseURL: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, affordable)' },
      { id: 'gpt-4o', label: 'GPT-4o (highest quality)' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { id: 'o3-mini', label: 'o3 Mini (reasoning)' },
    ],
    apiType: 'openai',
    supportsImages: true,
  },
};

/**
 * Get a provider definition by id.
 * @param {string} id
 * @returns {object|null}
 */
function getProvider(id) {
  return PROVIDERS[id] || null;
}

/**
 * Get the active provider id from env, defaulting to gemini.
 * @returns {string}
 */
function getActiveProviderId() {
  const id = (process.env.LLM_PROVIDER || 'gemini').trim().toLowerCase();
  return PROVIDERS[id] ? id : 'gemini';
}

/**
 * Get the active model for a provider, falling back to the provider default.
 * @param {string} providerId
 * @returns {string}
 */
function getActiveModel(providerId) {
  const provider = getProvider(providerId);
  if (!provider) return 'gemini-2.5-flash';
  const envKey = `${provider.apiKeyEnv.replace('_API_KEY', '_MODEL')}`;
  const model = process.env[envKey];
  if (model && model.trim()) return model.trim();
  return provider.defaultModel;
}

/**
 * Get the API key for a provider from env.
 * @param {string} providerId
 * @returns {string}
 */
function getApiKey(providerId) {
  const provider = getProvider(providerId);
  if (!provider) return '';
  return process.env[provider.apiKeyEnv] || '';
}

/**
 * List all providers as an array (for UI dropdowns).
 * @returns {Array<{id, label, apiKeyUrl, apiKeyLabel, models}>}
 */
function listProviders() {
  return Object.values(PROVIDERS).map((p) => ({
    id: p.id,
    label: p.label,
    apiKeyUrl: p.apiKeyUrl,
    apiKeyLabel: p.apiKeyLabel,
    models: p.models,
    supportsImages: p.supportsImages,
  }));
}

module.exports = {
  PROVIDERS,
  getProvider,
  getActiveProviderId,
  getActiveModel,
  getApiKey,
  listProviders,
};
