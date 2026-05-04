import type { QuizQuestion } from './miniGames';

const PTS: Record<string, number> = { easy: 10, medium: 15, hard: 20 };

export function makeQuestion(
	id: string,
	category: string,
	difficulty: string,
	question: string,
	correctAnswer: string,
	...otherAnswers: string[]
): QuizQuestion {
	return {
		id,
		category,
		difficulty,
		question,
		answers: [correctAnswer, ...otherAnswers],
		correctAnswer,
		explanation: '',
		points: PTS[difficulty] ?? 10
	};
}

export function buildQuestions(
	raw: QuizQuestion[],
	explanations: Record<string, string>
): QuizQuestion[] {
	return raw.map((r) => ({
		...r,
		explanation: explanations[r.id] ?? r.explanation
	}));
}
