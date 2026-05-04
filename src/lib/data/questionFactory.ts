import type { QuizQuestion } from './miniGames';

const PTS: Record<string, number> = { easy: 10, medium: 15, hard: 20 };

type QuestionTuple = [string, string, string, string, string, ...string[]];

export function fromTuples(tuples: QuestionTuple[]): QuizQuestion[] {
	return tuples.map(([id, category, difficulty, question, correct, ...rest]) => ({
		id,
		category,
		difficulty,
		question,
		answers: [correct, ...rest],
		correctAnswer: correct,
		explanation: '',
		points: PTS[difficulty] ?? 10
	}));
}

export function withExplanations(
	questions: QuizQuestion[],
	explanations: Record<string, string>
): QuizQuestion[] {
	return questions.map((q) => ({
		...q,
		explanation: explanations[q.id] ?? q.explanation
	}));
}
