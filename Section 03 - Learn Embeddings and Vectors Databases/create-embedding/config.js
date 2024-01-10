import OpenAI from 'openai';

/** Ensure the OpenAI API key is available and correctly configured */
if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing or invalid.");
}

/** OpenAI config */
export default new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});