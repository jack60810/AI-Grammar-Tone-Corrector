"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const axios_1 = require("axios");

/**
 * Check and correct grammar using OpenAI API
 * @param {Object} input - Input object containing text to check
 * @param {Object} options - Configuration options
 * @returns {Promise<null>}
 */
const processWithOpenAI = async (input, options, prompt) => {
  try {
    const baseURL = "https://api.openai.com/v1";
    const openai = axios_1.default.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${options.openai_apikey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const model = options.openai_model || "gpt-4o-mini";

    // Send request to OpenAI API
    const requestBody = {
      model: model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input.text }
      ],
      max_tokens: 20000,
      temperature: 0.3
    };

    const { data } = await openai.post("chat/completions", requestBody);

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.response?.status || error.message}`);
  }
};

/**
 * Check and correct grammar using Gemini API
 * @param {Object} input - Input object containing text to check
 * @param {Object} options - Configuration options
 * @returns {Promise<null>}
 */
const processWithGemini = async (input, options, prompt) => {
  try {
    const model = options.gemini_model || "gemini-3-pro-preview";
    const apiKey = options.gemini_apikey;

    const gemini = axios_1.default.create({
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const requestBody = {
      contents: [{
        parts: [{
          text: `${prompt}\n\n${input.text}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 20000
      }
    };

    // Use the most stable Gemini API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log(`Trying Gemini API endpoint: https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=***`);
    console.log(`Request body:`, JSON.stringify(requestBody, null, 2));

    const response = await gemini.post(endpoint, requestBody);
    const data = response.data;

    console.log(`Gemini API Response:`, JSON.stringify(data, null, 2));

    // Check for valid response structure
    if (!data) {
      throw new Error("Empty response from Gemini API");
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No candidates in Gemini API response");
    }

    const candidate = data.candidates[0];
    if (!candidate) {
      throw new Error("Invalid candidate in Gemini API response");
    }

    // Check for finish reason
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new Error(`Gemini API finished with reason: ${candidate.finishReason}`);
    }

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("No content parts in Gemini API response");
    }

    const text = candidate.content.parts[0].text;
    if (!text || typeof text !== 'string') {
      throw new Error("No valid text in Gemini API response");
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API Error: ${error.response?.status || error.message}`);
  }
};

const DEFAULT_PROMPT = "Your role is to be an English guru, an expert in authentic American English, who assists users in expressing their thoughts clearly and fluently. There is only one possible response, and it should match the format of the original text. You are not just translating words; you are delving into the essence of the user's message and reconstructing it in a way that maintains logical clarity and coherence. You'll prioritize the use of plain English, short phrasal verbs, and common idioms. It's important to craft sentences with varied lengths to create a natural rhythm and flow, making the language sound smooth and engaging. Avoid regional expressions or idioms that are too unique or restricted to specific areas. Your goal is to make American English accessible and appealing to a broad audience, helping users communicate effectively in a style that resonates with a wide range of English speakers. Avoid using hyphens when possible.";

/**
 * Get prompt for action
 * @param {string} actionName - Name of the action
 * @param {Object} options - Configuration options
 * @returns {string} The prompt to use
 */
const getPromptForAction = (actionName, options) => {
  if (options.system_prompt && options.system_prompt.trim().length > 0) {
    return options.system_prompt;
  }
  return DEFAULT_PROMPT;
};

/**
 * Main processing function
 * @param {Object} input - Input object containing text to check
 * @param {Object} options - Configuration options
 * @returns {Promise<null>}
 */
const processText = async (input, options) => {
  try {
    // Validate inputs
    if (!input?.text?.trim()) {
      popclip.showText("No text selected", { preview: false });
      return null;
    }

    // Get the prompt based on action
    const actionName = popclip.context.actionTitle;
    const prompt = getPromptForAction(actionName, options);

    // Determine which provider to use
    const defaultProvider = options.default_provider || 'Gemini';
    let useProvider = defaultProvider;

    // Check API keys and fallback logic
    if (useProvider === 'OpenAI' && !options.openai_apikey) {
      if (options.gemini_apikey) {
        useProvider = 'Gemini';
        popclip.showText("OpenAI API key not found, using Gemini instead", { preview: false });
      } else {
        popclip.showText("Please configure either OpenAI or Gemini API key", { preview: false });
        return null;
      }
    } else if (useProvider === 'Gemini' && !options.gemini_apikey) {
      if (options.openai_apikey) {
        useProvider = 'OpenAI';
        popclip.showText("Gemini API key not found, using OpenAI instead", { preview: false });
      } else {
        popclip.showText("Please configure either OpenAI or Gemini API key", { preview: false });
        return null;
      }
    }

    // Process with selected provider
    let response;
    if (useProvider === 'OpenAI') {
      response = await processWithOpenAI(input, options, prompt);
    } else {
      response = await processWithGemini(input, options, prompt);
    }

    console.log("API Response received:", response);
    console.log("Response length:", response?.length);

    // Validate response before processing
    if (!response || typeof response !== 'string' || response.trim().length === 0) {
      popclip.showText("Empty response from AI", { preview: false });
      return null;
    }

    // If holding shift, copy the response. Otherwise, paste it.
    if (popclip.modifiers.shift) {
      console.log("Copying response to clipboard");
      popclip.copyText(response);
      popclip.showText("Response copied to clipboard", { preview: false });
    } else {
      console.log("Pasting response");
      try {
        popclip.pasteText(response);
      } catch (pasteError) {
        console.error("Paste failed, falling back to copy:", pasteError);
        popclip.copyText(response);
        popclip.showText("Paste failed - response copied to clipboard instead", { preview: false });
      }
    }

    return null;
  } catch (error) {
    console.error("AI processing error:", error);

    let errorMessage = "AI processing failed";
    if (error.message.includes("401")) {
      errorMessage = "Invalid API key";
    } else if (error.message.includes("429")) {
      errorMessage = "Rate limit exceeded";
    } else if (error.message.includes("404")) {
      errorMessage = "API endpoint not found - check model name and API key";
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
      errorMessage = "Network connection failed";
    } else if (error.message) {
      errorMessage = error.message;
    }

    popclip.showText(errorMessage, { preview: false });
    return null;
  }
};

// Export the actions array
exports.actions = [
  {
    title: "Fix Grammar",
    code: processText,
  }
];