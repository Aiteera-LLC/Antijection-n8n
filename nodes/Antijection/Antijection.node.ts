import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class Antijection implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Antijection',
        name: 'antijection',
        icon: 'file:../../icons/antijection.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["context"]}}',
        description: 'Detect prompt injection attacks',
        defaults: {
            name: 'Antijection',
        },
        usableAsTool: true,
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'antijectionApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                placeholder: 'Enter the user prompt or AI input to analyze...',
                description: 'The text prompt to analyze for injection attacks (1-10,000 characters). Block prompts with risk_score = 100.',
                required: true,
                typeOptions: {
                    rows: 5,
                },
            },
            {
                displayName: 'Context',
                name: 'context',
                type: 'options',
                options: [
                    {
                        name: 'Agent (Autonomous/Tool-Using)',
                        value: 'agent',
                        description: 'Autonomous AI agents with tool access',
                    },
                    {
                        name: 'Code (Assistant/Copilot)',
                        value: 'code',
                        description: 'Code assistants and copilots',
                    },
                    {
                        name: 'E-Commerce',
                        value: 'ecommerce',
                        description: 'E-commerce assistants',
                    },
                    {
                        name: 'Education (Tutoring)',
                        value: 'education',
                        description: 'Education and tutoring systems',
                    },
                    {
                        name: 'Email',
                        value: 'email',
                        description: 'Email assistants',
                    },
                    {
                        name: 'Finance',
                        value: 'finance',
                        description: 'Financial advisors and trading bots',
                    },
                    {
                        name: 'Gaming (NPC/Companion)',
                        value: 'gaming',
                        description: 'Gaming NPCs and companions',
                    },
                    {
                        name: 'Healthcare',
                        value: 'healthcare',
                        description: 'Healthcare assistants',
                    },
                    {
                        name: 'HR (Recruitment)',
                        value: 'hr',
                        description: 'HR and recruitment assistants',
                    },
                    {
                        name: 'IoT (Smart Home)',
                        value: 'iot',
                        description: 'IoT and smart home controllers',
                    },
                    {
                        name: 'Knowledge (Enterprise)',
                        value: 'knowledge',
                        description: 'Enterprise knowledge bases',
                    },
                    {
                        name: 'Legal',
                        value: 'legal',
                        description: 'Legal document assistants',
                    },
                    {
                        name: 'Moderation (Content)',
                        value: 'moderation',
                        description: 'Content moderation systems',
                    },
                    {
                        name: 'RAG (Document Q&A)',
                        value: 'rag',
                        description: 'RAG systems and document Q&A',
                    },
                    {
                        name: 'Research',
                        value: 'research',
                        description: 'Research assistants',
                    },
                    {
                        name: 'Social Media',
                        value: 'social',
                        description: 'Social media managers',
                    },
                    {
                        name: 'SQL (Query Generator)',
                        value: 'sql',
                        description: 'SQL query generators',
                    },
                    {
                        name: 'Support (Customer Service)',
                        value: 'support',
                        description: 'Customer service chatbots',
                    },
                    {
                        name: 'Transport (Navigation)',
                        value: 'transport',
                        description: 'Transportation and navigation systems',
                    },
                    {
                        name: 'Web (Content Generator)',
                        value: 'web',
                        description: 'Web content generators',
                    },
                ],
                default: 'agent',
                description: 'The context/type of AI application being protected',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('antijectionApi');

        const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
        const apiKey = credentials.apiKey as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const prompt = this.getNodeParameter('prompt', i) as string;
                const context = this.getNodeParameter('context', i) as string;

                // Validate prompt length
                if (!prompt || prompt.trim().length === 0) {
                    throw new NodeOperationError(
                        this.getNode(),
                        'Prompt cannot be empty',
                        { itemIndex: i }
                    );
                }

                if (prompt.length > 10000) {
                    throw new NodeOperationError(
                        this.getNode(),
                        `Prompt is too long (${prompt.length} characters). Maximum allowed is 10,000 characters.`,
                        { itemIndex: i }
                    );
                }

                const payload = {
                    prompt,
                    context,
                };

                const options = {
                    method: 'POST' as const,
                    url: `${baseUrl}/v1/detect`,
                    body: payload,
                    json: true,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await this.helpers.httpRequest(options);

                returnData.push({
                    json: response,
                    pairedItem: {
                        item: i,
                    },
                });
            } catch (error) {
                // Enhanced error handling with user-friendly messages
                const e = error as {
                    message: string;
                    response?: {
                        status?: number;
                        body?: {
                            detail?: string;
                            error?: string;
                        };
                        data?: {
                            detail?: string;
                            error?: string;
                        };
                    };
                    statusCode?: number;
                };
                let errorMessage = e.message;
                let errorDetails = '';

                // Check if it's an HTTP error
                if (e.response) {
                    const statusCode = e.response.status || e.statusCode;
                    const responseBody = e.response.body || e.response.data;

                    switch (statusCode) {
                        case 401:
                            errorMessage = 'Authentication failed';
                            errorDetails = 'Invalid API key. Please check your Antijection API credentials.';
                            break;
                        case 403:
                            errorMessage = 'Access forbidden';
                            errorDetails = 'Your API key does not have permission to access this resource.';
                            break;
                        case 429:
                            errorMessage = 'Rate limit exceeded';
                            errorDetails = 'You have exceeded your API rate limit or credit quota. Please upgrade your plan or wait before retrying.';
                            break;
                        case 400:
                            errorMessage = 'Invalid request';
                            errorDetails = responseBody?.detail || responseBody?.error || 'The request was malformed. Check your input parameters.';
                            break;
                        case 500:
                        case 502:
                        case 503:
                            errorMessage = 'Antijection API error';
                            errorDetails = 'The Antijection service is temporarily unavailable. Please try again later.';
                            break;
                        default:
                            errorMessage = `HTTP ${statusCode} error`;
                            errorDetails = responseBody?.detail || responseBody?.error || e.message;
                    }
                }

                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: errorMessage,
                            details: errorDetails,
                            statusCode: e.response?.status || e.statusCode,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                    continue;
                }

                const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
                throw new NodeOperationError(this.getNode(), fullError, {
                    itemIndex: i,
                });
            }
        }

        return [returnData];
    }
}
