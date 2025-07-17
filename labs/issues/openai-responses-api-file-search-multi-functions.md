# OpenAI Responses API + Vector Store + Multiple Function Calls

Last updated: 2025-01-16

### Issue Description
When using OpenAI's Responses API with file_search (Vector Store) enabled and multiple functions available, queries that require multiple function calls fail with the error:
```
Error: No tool output found for function call call_xxx. (invalid_request_error)
```

### Affected Configuration
- **AI Provider**: OpenAI
- **API**: Responses API (enabled in Settings → Dev Tools)
- **Context**: OpenAI Vector Store connected as embeddings environment
- **Functions**: Multiple functions enabled in chatbot
- **Query Type**: Questions that require multiple function calls (e.g., "What's the temperature outside? And at the desk?")

### Technical Details

#### Root Cause
OpenAI's API has a limitation where the `file_search` tool interferes with multiple function calls. When both are enabled:

1. **Expected behavior**: All function calls should be returned in a single API response
2. **Actual behavior**: Function calls are split across multiple API responses
3. **API requirement**: The Responses API requires all function calls and their outputs to be sent together in the correct order

#### How It Manifests
1. User asks: "What's the temperature outside? And at the desk?"
2. OpenAI returns first function call: `getOutdoorTemperature`
3. AI Engine executes it and sends the result back
4. OpenAI returns second function call: `getDeskTemperature` 
5. Error occurs because OpenAI expects both function results together

### Test Results
- ✅ Single function calls work perfectly with file_search
- ✅ Multiple function calls work without file_search
- ❌ Multiple function calls fail with file_search enabled

### Current Workaround
Users can disable Responses API in Settings → Dev Tools when they need multiple function calls with Vector Store context. The chatbot will fall back to the Chat Completions API which handles this scenario correctly.

### UI Warning
A warning has been added to the chatbot settings that appears when:
- Multiple functions are selected
- OpenAI Vector Store is connected as Context
- Model supports Responses API

Warning text: "When using Responses API with an OpenAI Vector Store connected as Context, calling multiple functions in one query (e.g., "What's X and Y?") may fail with "No tool output found" error. To avoid this, disable Responses API in Settings."

### Potential Solutions (Future)

1. **Stateful Function Collection**: Implement a mechanism to detect when functions are being split and collect all of them before executing any. This would require:
   - Detecting file_search presence in the initial query
   - Holding function execution when only one is returned
   - Making a continue request to get additional functions
   - Executing all functions together

2. **Disable file_search for Multi-Function Queries**: Detect queries that might need multiple functions and temporarily disable file_search. This requires:
   - Query analysis (language-specific, not ideal)
   - Dynamic tool configuration

3. **Wait for OpenAI Fix**: This appears to be an OpenAI API bug where file_search interferes with the normal function calling flow.

### References
- OpenAI Community Discussion: Users report that file_search causes function calls to be split across multiple responses
- Responses API Documentation: States that function_call must be immediately followed by function_call_output with matching call_ids

### Test Script
A test script is available at `test-general.js` that can reproduce the issue:
```bash
node test-general.js chatbot default "What's the temperature outside? And at the desk?"
```

This will fail when the default chatbot has Vector Store enabled but succeed when disabled.