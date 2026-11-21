// A completed checklist is informational; it never grants permission to use a ladder.
export type CheckState = 'questions' | 'stop' | 'reviewed';
export function getCheckState(answers: number[], total: number): CheckState {
 if (answers.some(answer => answer !== 0)) return 'stop';
 return answers.length >= total ? 'reviewed' : 'questions';
}
