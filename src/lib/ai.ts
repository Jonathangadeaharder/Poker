type AIProvider = 'ollama' | 'openrouter' | 'groq' | 'mini';

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

function getProvider(): AIProvider {
	return (import.meta.env.VITE_AI_PROVIDER as AIProvider) || 'ollama';
}

function getBaseUrl(): string {
	const provider = getProvider();
	if (provider === 'ollama') {
		return import.meta.env.VITE_LOCAL_AI_BASE_URL || 'http://localhost:11434/v1';
	}
	return import.meta.env.VITE_PROD_AI_BASE_URL || 'http://localhost:11434/v1';
}

function getModel(): string {
	switch (getProvider()) {
		case 'ollama':
			return import.meta.env.VITE_LOCAL_AI_MODEL || 'llama3.2';
		case 'mini':
			return import.meta.env.VITE_PROD_AI_MODEL || 'qwen2.5:0.5b';
		case 'openrouter':
			return import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini';
		case 'groq':
			return import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
	}
}

function getAuthHeaders(): Record<string, string> {
	const provider = getProvider();
	if (provider === 'openrouter') {
		return {
			Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
			'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : ''
		};
	}
	if (provider === 'groq') {
		return {
			Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ''}`
		};
	}
	return {};
}

async function callAI(messages: AIMessage[]): Promise<string> {
	const baseUrl = getBaseUrl();
	const model = getModel();

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
		})
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`AI chat failed: ${res.status} ${text}`);
	}

	const data = await res.json();
	return data.choices?.[0]?.message?.content || '';
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
