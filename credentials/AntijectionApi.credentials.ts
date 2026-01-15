import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class AntijectionApi implements ICredentialType {
	name = 'antijectionApi';
	displayName = 'Antijection API';
	documentationUrl = 'https://antijection.com/docs';
	icon: Icon = 'file:../icons/antijection.svg';
	testedBy = [
		'antijection',
	];
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$self.baseUrl}}',
			url: '/v1/detect',
			method: 'POST',
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
			body: {
				prompt: 'health check',
				context: 'agent',
			},
		},
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.antijection.com',
		},
	];
}
