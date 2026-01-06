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
- **Prompt**: The text content you want to analyze.
- **Detection Method**: Choose between `Injection Guard`, `Injection Guard Multi`, or `Safety Guard`.
- **Rule Settings**: 
    - **Enabled**: Toggle heuristic rule processing.
    - **Disabled Categories**: List specific threat categories to ignore.
    - **Blocked Keywords**: Add custom strings that should always trigger a block.

## Credentials

To use this node, you need an API Key from the Antijection dashboard.

1. Sign up/Log in at [antijection.com](https://www.antijection.com).
2. Generate an API Key in your account settings.
3. In n8n, create a new **Antijection API** credential and enter your key.

## Privacy & Terms

Your security and privacy are our top priorities. 
- **Privacy Policy**: [https://www.antijection.com/privacy](https://www.antijection.com/privacy)
- **Terms of Service**: [https://www.antijection.com/terms](https://www.antijection.com/terms)

## Resources

- [Antijection Website](https://www.antijection.com)
- [Documentation](https://www.antijection.com/docs)
- [n8n Community Forum](https://community.n8n.io/)

## Support

For questions, troubleshooting, or custom enterprise requirements, please contact us at [hello@antijection.com](mailto:hello@antijection.com).

---
Developed by **AITEERA LLC**.
