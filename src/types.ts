export type CallSite = {
  columnNumber: number | null;
  fileName: string | null;
  functionName: string | null;
  lineNumber: number | null;
};

export type StackTrace = {
  callSites: CallSite[];
};
