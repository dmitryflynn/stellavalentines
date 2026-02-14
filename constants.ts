
import { Step, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: Step.GAME,
    question: "What game should we play?",
    answer: ["return of the obra dinn", "obra dinn", "the return of the obra dinn"],
    hint: "It's a mystery detective game about a ship... 'Return of the _____ _____'."
  },
  {
    id: Step.DESTINATION,
    question: "Where's destination 1?",
    answer: ["marina park", "marina park kirkland", "kirkland marina park"],
    hint: "It's a beautiful waterfront park in Kirkland... starts with an 'M'."
  },
  {
    id: Step.DINING,
    question: "Where are we eating?",
    answer: ["moss bay hall", "moss bay"],
    hint: "Think of a 'Hall' located near the 'Bay' in downtown Kirkland..."
  }
];
