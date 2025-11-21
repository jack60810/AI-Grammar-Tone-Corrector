# AI Grammar & Tone Corrector for PopClip

A powerful PopClip extension that provides AI-powered grammar correction and tone adjustment using both OpenAI ChatGPT and Google Gemini APIs.

## ✨ Features

- **🤖 Dual AI Providers**: Support for both OpenAI ChatGPT and Google Gemini
- **✨ Single Click Correction**: Instantly fix grammar and improve tone with a single "Fix Grammar" action
- **🧠 "English Guru" Persona**: Uses a sophisticated system prompt to ensure authentic, clear, and natural English
- **🔄 Smart Fallback**: Automatically switches between providers if one is unavailable
- **⌨️ Shift Key Support**: Hold Shift to copy result instead of pasting
- **⚙️ Customizable**: Configure the system prompt to match your specific needs
- **🎯 Multiple Models**: Support for the latest AI models including Gemini 3.0 Pro and GPT-4o

## 🚀 Quick Start

### Prerequisites
- macOS 10.15 or later
- [PopClip](https://pilotmoon.com/popclip/) application
- Internet connection
- Valid API keys (OpenAI and/or Gemini)

### Installation

1. **Check PopClip Permissions**
   - Open **System Preferences** > **Security & Privacy** > **Privacy**
   - Select **Accessibility** on the left
   - Ensure **PopClip** is checked on the right
   - If not, click **+** to add PopClip

2. **Install Extension**
   - **Double-click** `AI-Grammar-Tone-Corrector.popclipext` folder
   - PopClip will ask to install the extension
   - Click **Install**

3. **Configure API Keys**
   - Open PopClip preferences
   - Find "AI Grammar & Tone Corrector"
   - Enter your OpenAI and/or Gemini API keys
   - Choose your preferred AI provider and models

4. **Use the Extension**
   - Select any text in any macOS application
   - Click **Fix Grammar** in the PopClip menu
   - Hold **Shift (⇧)** while clicking to copy the result instead of pasting

## 🔑 API Key Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy and paste in PopClip settings

### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy and paste in PopClip settings

## ⚙️ Configuration Options

### API Configuration
- **OpenAI API Key**: Your OpenAI API key (starts with sk-)
- **Gemini API Key**: Your Google Gemini API key
- **Default AI Provider**: Choose OpenAI or Gemini as default

### Model Selection
- **OpenAI Models**: gpt-4o-mini, gpt-4o, gpt-4-turbo, gpt-3.5-turbo
- **Gemini Models**: gemini-3-pro-preview, gemini-2.5-pro, gemini-2.5-flash

### Custom Prompts
- **System Prompt**: Customize the system prompt to define the AI's persona and instructions. Leave empty to use the default "English Guru" prompt.

## 🔄 Smart Provider Selection

The extension intelligently manages AI provider selection:

- **Primary**: Uses your default provider if API key is available
- **Fallback**: Automatically switches to the other provider if primary is unavailable
- **Single Provider**: Works with just one API key configured
- **Error Handling**: Clear error messages for configuration issues

## 📁 Project Structure

```
AI-Grammar-Tone-Corrector.popclipext/
├── Config.json                          # Extension configuration
├── ai-grammar-tone-corrector.js         # Main JavaScript implementation
├── icon.svg                             # Extension icon
└── spell-check.svg                      # Alternative icon
```

## 🛠️ Technical Details

- **Architecture**: Based on proven PopClip extension patterns
- **Max Tokens**: 20,000 tokens for comprehensive text processing
- **Timeout**: 30-second timeout for API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Network**: Requires network access for API calls

## 🆘 Troubleshooting

### Common Issues

1. **Extension not appearing in PopClip**
   - Check PopClip accessibility permissions
   - Restart PopClip
   - Ensure PopClip version 4069 or later

2. **API errors**
   - Verify API keys are correct
   - Check internet connection
   - Ensure API keys have sufficient credits

3. **Text not being replaced**
   - Try holding Shift while clicking to copy to clipboard
   - Check PopClip permissions
   - Restart PopClip

### Debug Information

The extension includes comprehensive logging. Check PopClip's console output for detailed error information.

## 📄 License

This project is open source. Please check the license file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## ⚠️ Security Note

- API keys are stored locally in PopClip's configuration
- No API keys are transmitted to any third-party services except the respective AI providers
- All API calls are made directly to OpenAI and Google servers

## 🔗 Links

- [PopClip](https://pilotmoon.com/popclip/)
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://makersuite.google.com/)