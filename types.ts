
export enum Step {
  GAME = 'GAME',
  DESTINATION = 'DESTINATION',
  DINING = 'DINING',
  VALENTINE = 'VALENTINE',
  SUCCESS = 'SUCCESS'
}

export interface Question {
  id: Step;
  question: string;
  answer: string[];
  hint: string;
}
