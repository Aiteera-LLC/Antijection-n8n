# n8n-nodes-antijection

Antijection is a powerful AI security node for n8n that helps protect your LLM applications from prompt injections, jailbreaks, and safety violations.

[Antijection](https://www.antijection.com) provides real-time analysis and filtering for AI-generated and user-submitted content, ensuring your workflows remain secure and compliant.

## Features

- **Prompt Injection Detection**: Identify and block malicious attempts to manipulate LLM behavior.
- **Precision Models**:
    - **Injection Guard (Fast)**: Optimized for speed, ideal for English-only real-time applications.
    - **Injection Guard Multi**: Robust multilingual support for global applications.
    - **Safety Guard**: Comprehensive analysis for toxic content, PII leaks, and safety risks.
- **Customizable Heuristics**: Fine-tune protection with enabled/disabled categories and custom keyword blocking.
- **Production-Ready**: Comprehensive error handling, input validation, and user-friendly messages.

## Installation

To install this node in your n8n instance:

1. Go to **Settings > Community Nodes**.
2. Click **Install a new node**.
3. Enter `n8n-nodes-antijection`.
4. Click **Install**.

Alternatively, for manual installations in your n8n directory:

```bash
npm install n8n-nodes-antijection
```

## Operations

### Detect
Analyze a text prompt for security risks and safety issues.

**Parameters:**
- **Prompt**: The text content you want to analyze (1-10,000 characters).
- **Detection Method**: Choose between `Injection Guard`, `Injection Guard Multi`, or `Safety Guard`.
- **Rule Settings**: 
    - **Enabled**: Toggle heuristic rule processing.
    - **Disabled Categories**: Select specific threat categories to ignore (useful for coding assistants).
    - **Blocked Keywords**: Add custom strings or regex patterns that should always trigger a block (one per line).

**Response Fields:**
- **risk_score** (0-100): Risk level where 0 = safe, 100 = unsafe. **Recommended: Block prompts with risk_score ≥ 50.**
- **detection_method**: The method used for detection.
- **credits_used**: Credits consumed based on token count and method.
- **tokens_used**: Number of tokens in the prompt.
- **categories**: List of safety categories detected (SAFETY_GUARD only).
- **latency_ms**: Response time in milliseconds.

## Credentials

To use this node, you need an API Key from the Antijection dashboard.

1. Sign up/Log in at [antijection.com](https://www.antijection.com).
2. Generate an API Key in your account settings.
3. In n8n, create a new **Antijection API** credential and enter your key.

## Usage Examples

### Example 1: Basic Prompt Filtering

```
1. Trigger (e.g., Webhook)
2. Antijection Node
   - Prompt: {{$json.userInput}}
   - Detection Method: INJECTION_GUARD_MULTI
3. IF Node
   - Condition: {{$json.risk_score}} >= 50
   - True: Send "Blocked" response
   - False: Continue to LLM
```

### Example 2: Coding Assistant (Disable Code-Related Rules)

```
1. Trigger
2. Antijection Node
   - Prompt: {{$json.query}}
   - Detection Method: INJECTION_GUARD
   - Rule Settings:
     - Disabled Categories: 
       - SQL Injection
       - Command Injection
       - XSS Patterns
       - Path Traversal
3. Continue to code generation LLM
```

### Example 3: Content Moderation with Safety Guard

```
1. Trigger
2. Antijection Node
   - Prompt: {{$json.userComment}}
   - Detection Method: SAFETY_GUARD
3. IF Node
   - Condition: {{$json.risk_score}} >= 50
   - True: Flag for review ({{$json.categories}})
   - False: Publish content
```

## Available Rule Categories

When using **Disabled Categories**, you can select from:

- **Ignore Instructions** - Direct attempts to override system prompts
- **System Override** - Attempts to toggle developer/admin modes
- **Prompt Extraction** - Attempts to leak the system prompt
- **Role Hijacking** - Forcing the AI into a specific persona
- **Encoded Attacks** - Base64, Hex, or Unicode encoding tricks
- **Fuzzy Matches** - Common misspellings of attack keywords
- **Many Shot** - Overloading context with fake Q&A
- **SQL Injection** - Common SQL injection patterns
- **Command Injection** - Shell command execution attempts
- **XSS Patterns** - Script injection and XSS vectors
- **Path Traversal** - File system traversal attempts
- **Unusual Punctuation** - Abnormal clusters of special characters
- **Repetition Attacks** - Excessive or interspersed repetition
- **Emojis** - Suspicious or excessive use of emojis

## Best Practices

### Detection Method Selection

- **INJECTION_GUARD**: Use for high-volume, English-only applications (1 credit/500 tokens)
- **INJECTION_GUARD_MULTI**: Use for multilingual applications (2 credits/500 tokens)
- **SAFETY_GUARD**: Use for comprehensive content moderation (4 credits/500 tokens)

### Blocked Keywords

Use the **Blocked Keywords** field to add custom terms specific to your application:

```
internal_project_name
<special_token>
\b(secret|api_key)\b
```

Supports Python-style regex patterns for advanced matching.

## Troubleshooting

### "Authentication failed"
- **Cause**: Invalid API key
- **Solution**: Check your Antijection API credentials in n8n. Ensure you've copied the full API key.

### "Rate limit exceeded"
- **Cause**: You've exceeded your API rate limit or credit quota
- **Solution**: Upgrade your plan at [antijection.com](https://www.antijection.com) or wait before retrying.

### "Prompt is too long"
- **Cause**: Prompt exceeds 10,000 characters
- **Solution**: Truncate or split your prompt into smaller chunks.

### "Invalid request"
- **Cause**: Malformed request parameters
- **Solution**: Check that your prompt is not empty and detection method is valid.

### Credential Test Fails
- **Cause**: API key is invalid or network issues
- **Solution**: Verify your API key is active in the Antijection dashboard. Check network connectivity.

## Error Handling

The node provides detailed error messages for common issues:

- **401**: Authentication failed - check API key
- **403**: Access forbidden - verify permissions
- **429**: Rate limit exceeded - upgrade plan or wait
- **400**: Invalid request - check input parameters
- **500/502/503**: Service temporarily unavailable - retry later

Enable "Continue On Fail" in n8n to handle errors gracefully in your workflow.

## Privacy & Terms

Your security and privacy are our top priorities. 
- **Privacy Policy**: [https://www.antijection.com/privacy](https://www.antijection.com/privacy)
- **Terms of Service**: [https://www.antijection.com/terms](https://www.antijection.com/terms)

## Resources

- [Antijection Website](https://www.antijection.com)
- [API Documentation](https://www.antijection.com/docs)
- [GitHub Repository](https://github.com/Aiteera-LLC/Antijection-n8n)
- [n8n Community Forum](https://community.n8n.io/)

## Support

For questions, troubleshooting, or custom enterprise requirements, please contact us at [hello@antijection.com](mailto:hello@antijection.com).

---
Developed by **AITEERA LLC**.
