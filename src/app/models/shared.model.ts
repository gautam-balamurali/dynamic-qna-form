export interface QuestionModel {
  type: string;
  question: string;
  options: AnswerOptionModel[];
  answer: string;
  required: boolean;
}

export interface AnswerOptionModel {
  value: string;
  checked: boolean;
  otherValue: string;
}
