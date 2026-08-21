/** Body sent to POST StudentAssignment/run */
export interface RunCodeRequest {
  sourceCode: string;
  languageId: number;
  stdin: string | null;
}

/** Body sent to POST StudentAssignment/submit */
export interface SubmitCodeRequest {
  assignmentId: number;
  sourceCode: string;
  languageId: number;
  stdin: string | null;
}

export interface RunResult {
  status: string;
  output: string;
  error?: string | null;
  time: number;
  memory: number;
}

export interface SubmitResult {
  isAccepted: boolean;
  passedTestCases: number;
  totalTestCases: number;
  output: string;
  error?: string | null;
  score: number;
  time: number;
  memory: number;
}