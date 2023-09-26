export type StackFrame = {
  arguments: readonly string[];
  columnNumber: number | null;
  fileName: string | null;
  functionName: string | null;
  lineNumber: number | null;
};

export type StackTrace = StackFrame[];
