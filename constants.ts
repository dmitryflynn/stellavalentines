
import { Step, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: Step.DESTINATION,
    question: "Where's destination 1?",
    answer: ["carillon point kirkland", "carillon point", "kirkland carillon point"],
    hint: "It's a beautiful spot on the water in Kirkland... starts with a 'C'."
  },
  {
    id: Step.DINING,
    question: "Where are we eating?",
    answer: ["moss bay hall", "moss bay"],
    hint: "Think of a 'Hall' located near the 'Bay' in downtown Kirkland..."
  }
];
