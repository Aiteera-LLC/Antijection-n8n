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
        subtitle: '={{$parameter["detectionMethod"]}}',
        description: 'Detect prompt injection and safety issues',
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
                placeholder: 'Input prompt to analyze',
                description: 'The text prompt to analyze for injections and safety risks',
                required: true,
                typeOptions: {
                    rows: 5,
                },
            },
            {
                displayName: 'Detection Method',
                name: 'detectionMethod',
                type: 'options',
                options: [
                    {
                        name: 'Injection Guard (Fast)',
                        value: 'INJECTION_GUARD',
                        description: 'Fast injection detection (English only)',
                    },
                    {
                        name: 'Injection Guard Multi (Multilingual)',
                        value: 'INJECTION_GUARD_MULTI',
                        description: 'Multilingual injection detection',
                    },
                    {
                        name: 'Safety Guard (Comprehensive)',
                        value: 'SAFETY_GUARD',
                        description: 'Comprehensive safety analysis',
                    },
                ],
                default: 'INJECTION_GUARD_MULTI',
                description: 'The detection model/method to use',
            },
            {
                displayName: 'Rule Settings',
                name: 'ruleSettings',
                placeholder: 'Add Rule Settings',
                type: 'collection',
                default: {},
                options: [
                    {
                        displayName: 'Enabled',
                        name: 'enabled',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to enable heuristic rules',
                    },

                    {
                        displayName: 'Disabled Categories',
                        name: 'disabledCategories',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated list of categories to disable',
                    },
                    {
                        displayName: 'Blocked Keywords',
                        name: 'blockedKeywords',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated list of keywords to block',
                    },
                ],
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
                const detectionMethod = this.getNodeParameter('detectionMethod', i) as string;
                const ruleSettings = this.getNodeParameter('ruleSettings', i) as {
                    enabled: boolean;
                    disabledCategories: string;
                    blockedKeywords: string;
                };

                const payload: {
                    prompt: string;
                    detection_method: string;
                    rule_settings?: {
                        enabled: boolean;
                        disabled_categories: string[];
                        blocked_keywords: string[];
                    };
                } = {
                    prompt,
                    detection_method: detectionMethod,
                };

                if (ruleSettings) {
                    payload.rule_settings = {
                        enabled: ruleSettings.enabled !== false, // Default true
                        disabled_categories: ruleSettings.disabledCategories
                            ? (ruleSettings.disabledCategories as string).split(',').map((s: string) => s.trim()).filter((s: string) => s)
                            : [],
                        blocked_keywords: ruleSettings.blockedKeywords
                            ? (ruleSettings.blockedKeywords as string).split(',').map((s: string) => s.trim()).filter((s: string) => s)
                            : [],
                    };
                }

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
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error, {
                    itemIndex: i,
                });
            }
        }

        return [returnData];
    }
}
