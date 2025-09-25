export interface ProgressContext {
  sectionsCompleted: string[];
  lessons: { id: string; status: string }[];
  disableChallenges: boolean;
}
