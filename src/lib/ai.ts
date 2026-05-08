import { env } from '$env/dynamic/private';

type AIProvider = 'ollama' | 'mini' | 'openrouter' | 'groq';

interface AIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface HandInfo {
	holeCards: string;
	position: string;
	stackSize: string;
	action?: string;
	board?: string;
	opponentAction?: string;
	gameType?: 'cash' | 'mtt' | 'sng';
	tableSize?: string;
}

interface ChatCompletionResponse {
	choices?: {
		message?: {
			content?: string;
		};
	}[];
}

const VALID_PROVIDERS: AIProvider[] = ['ollama', 'mini', 'openrouter', 'groq'];
const AI_REQUEST_TIMEOUT_MS = 30000;

function getProvider(): AIProvider {
	const provider = (env.AI_PROVIDER || 'ollama') as AIProvider;
	if (!VALID_PROVIDERS.includes(provider)) {
		console.warn(`Invalid AI_PROVIDER "${env.AI_PROVIDER}", falling back to "ollama"`);
		return 'ollama';
	}
	return provider;
}

function getBaseUrl(): string {
	const provider = getProvider();
	switch (provider) {
		case 'ollama':
		case 'mini':
			return env.LOCAL_AI_BASE_URL || 'http://localhost:11434/v1';
		case 'openrouter':
			return 'https://openrouter.ai/api/v1';
		case 'groq':
			return 'https://api.groq.com/openai/v1';
		default:
			return env.LOCAL_AI_BASE_URL || 'http://localhost:11434/v1';
	}
}

function getModel(): string {
	const provider = getProvider();
	switch (provider) {
		case 'ollama':
			return env.OLLAMA_MODEL || 'llama3.2';
		case 'mini':
			return env.MINI_MODEL || 'phi3:mini';
		case 'openrouter':
			return env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
		case 'groq':
			return env.GROQ_MODEL || 'llama-3.1-8b-instant';
		default:
			return 'llama3.2';
	}
}

function getAuthHeaders(): Record<string, string> {
	const provider = getProvider();
	if (provider === 'openrouter') {
		return {
			Authorization: `Bearer ${env.OPENROUTER_API_KEY || ''}`,
			'HTTP-Referer': ''
		};
	}
	if (provider === 'groq') {
		return {
			Authorization: `Bearer ${env.GROQ_API_KEY || ''}`
		};
	}
	return {};
}

async function callAI(messages: AIMessage[]): Promise<string> {
	const baseUrl = getBaseUrl();
	const model = getModel();
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

	try {
		const res = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...getAuthHeaders()
			},
			body: JSON.stringify({
				model,
				messages,
				temperature: 0.7
			}),
			signal: controller.signal
		});

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`AI chat failed: ${res.status} ${text}`);
		}

		const data: ChatCompletionResponse = await res.json();
		const content = data.choices?.[0]?.message?.content;
		if (typeof content !== 'string') {
			throw new Error('Invalid AI response: missing message content');
		}
		return content;
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('AI request timed out after 30 seconds');
		}
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function generate(prompt: string): Promise<string> {
	return chat([{ role: 'user', content: prompt }]);
}

export async function chat(messages: AIMessage[]): Promise<string> {
	return callAI(messages);
}

export async function analyzeHand(hand: HandInfo): Promise<string> {
	const prompt = buildHandAnalysisPrompt(hand);
	return generate(prompt);
}

function buildHandAnalysisPrompt(hand: HandInfo): string {
	const parts: string[] = [
		'You are an expert poker coach. Analyze this hand and provide strategic advice.',
		'',
		`Game: ${hand.gameType || 'NLHE'}`,
		`Hole cards: ${hand.holeCards}`,
		`Position: ${hand.position}`,
		`Stack: ${hand.stackSize}`,
		`Table: ${hand.tableSize || '6-max'}`
	];

	if (hand.action) parts.push(`Action so far: ${hand.action}`);
	if (hand.board) parts.push(`Board: ${hand.board}`);
	if (hand.opponentAction) parts.push(`Opponent: ${hand.opponentAction}`);

	parts.push('');
	parts.push(
		'Give: 1) Recommended action, 2) Reasoning based on ranges/position/stack depth, 3) Key concept to apply. Keep it concise (2-3 sentences).'
	);

	return parts.join('\n');
}
