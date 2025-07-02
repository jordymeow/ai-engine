# Console.log Statements Not Wrapped in debugMode

## Summary

After analyzing the JavaScript files in the AI Engine Pro plugin, I found several console.log statements that are not wrapped in debugMode conditions. Here's a detailed list:

## Files with unwrapped console.log statements:

### 1. `/app/js/chatbot/DiscussionsContext.js`
- Lines with unwrapped console.log:
  - `console.log('[DISCUSSIONS] getStoredChatId called for botId:', botId);`
  - `console.log('[DISCUSSIONS] Found chatbot:', !!chatbot, 'localStorageKey:', chatbot?.localStorageKey);`
  - `console.log('[DISCUSSIONS] Found stored chatId:', parsedData.chatId);`
  - `console.log('[DISCUSSIONS] No data in localStorage for key:', localStorageKey);`

### 2. `/app/js/screens/Settings.js`
- Lines with unwrapped console.log:
  - `console.log('Updating', id, value);` (though marked with eslint-disable comment)
  - `console.log(err);` (in error handlers)

### 3. `/app/js/screens/Playground.js`
- Lines with unwrapped console.log:
  - `console.log("Completions", { prompt: promptToUse, result: finalRes });`

### 4. `/app/js/screens/ContentGenerator.js`
- Lines with unwrapped console.log:
  - `console.log("Topic " + offset);`

### 5. `/app/js/screens/ImageGenerator.js`
- Lines with unwrapped console.log:
  - `console.log('Image Edit Request:', { mode, endpoint, ... });`
  - `console.log('FormData contents:');`
  - `console.log(key, value);` (in FormData loop)

### 6. `/app/js/screens/ai/Environments.js`
- Lines with unwrapped console.log:
  - `console.log(err);` (in error handler, marked with eslint-disable)

### 7. `/app/js/screens/settings/DevToolsTab.js`
- Lines with unwrapped console.log:
  - `console.log(`Data for Post ID ${postId}`, content);`
  - `console.log(`Content First Word: ${firstWord}`);`
  - `console.log(`Content Last Word: ${lastWord}`);`

### 8. `/app/js/screens/finetunes/Finetunes.js`
- Lines with unwrapped console.log:
  - `console.log(err.message);` (in error handler)
  - `console.log('The CSV was loaded!', data);` (marked with eslint-disable)

### 9. `/app/js/screens/finetunes/Generator.js`
- Lines with unwrapped console.log:
  - `console.log("Issue: Content is too short! Skipped.", { content });`
  - `console.log("Result:", result);`
  - `console.log('User aborted.');`
  - `console.log("Task " + offset);`

### 10. `/app/js/screens/embeddings/ImportModal.js`
- Lines with unwrapped console.log:
  - `console.log('Calculate Diff', { currentVectors, importVectors });` (marked with eslint-disable)
  - `console.log("Matched Vector", { cleanVector, matchedVector });` (marked with eslint-disable)
  - `console.log("Embeddings Diff", { add, modify, same, total });` (marked with eslint-disable)

### 11. `/app/js/screens/chatbots/Params.js`
- Lines with unwrapped console.log:
  - `console.log("Update Params: Auto-selecting first available model for the environment.");`

### 12. `/app/js/screens/embeddings/pdfImport/AnalyzeStep.js`
- Lines with unwrapped console.log:
  - Multiple PDF import related logs (not wrapped in debugMode)
  - `console.log('[PDF Import] File selected:', file.name, 'Size:', file.size);`
  - `console.log('[PDF Import] Starting PDF parsing...');`
  - `console.log('[PDF Import] PDF loaded, pages:', pdf.numPages);`
  - `console.log('[PDF Import] Extracting text from page...`);`
  - `console.log('[PDF Import] Text extraction complete...`);`
  - `console.log('[PDF Import] Starting chunking...`);`
  - `console.log('[PDF Import] Very high density warning...`);`
  - `console.log('[PDF Import] Sending chunking request...`);`
  - `console.log('[PDF Import] Received chunks:', response.chunks.length);`

### 13. `/app/js/screens/embeddings/Embeddings.js`
- Lines with unwrapped console.log:
  - `console.log("Embedding Added", inEmbedding);` (marked with eslint-disable)
  - `console.log("Embeddings updated.", freshVector);` (marked with eslint-disable)
  - `console.log("Embeddings deleted.", { ids });` (marked with eslint-disable)
  - `console.log('The CSV for Embeddings Import was loaded.', data);` (marked with eslint-disable)
  - `console.log("Remote vectors retrieved.", { remoteVectors });` (marked with eslint-disable)
  - `console.log("Local vectors retrieved.", { vectors });` (marked with eslint-disable)
  - `console.log("Vectors to pull from Vector DB to AI Engine.", { vectorsToPull });` (marked with eslint-disable)

### 14. `/app/js/chatbot/ChatbotRealtime.js`
- Special case: Uses its own debug level system (not standard debugMode)
  - Has `CURRENT_DEBUG` levels but still outputs logs based on that level

### 15. `/app/js/components/UsageWidget.js`
- Has commented out console.log statements (good practice)

## Recommendations:

1. **High Priority** - Wrap all console.log statements that are not in error handlers with debugMode checks
2. **PDF Import Logs** - The PDF import functionality has extensive logging that should be wrapped
3. **Discussions Context** - The discussions logging should be wrapped with debugMode
4. **Error Handlers** - Consider whether error console.logs should also be wrapped (some already have eslint-disable comments)

## Pattern to follow:
```javascript
if (debugMode) {
  console.log('[COMPONENT] Message', data);
}
```