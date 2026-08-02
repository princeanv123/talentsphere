let metrics = {
  totalCalls: 0,
  totalPromptChars: 0,
  totalEstimatedInputTokens: 0,
  totalResponseChars: 0,
  totalFailures: 0,
};

const startCall = (prompt) => {
  metrics.totalCalls++;

  metrics.totalPromptChars += prompt.length;

  const estimatedTokens = Math.ceil(prompt.length / 4);

  metrics.totalEstimatedInputTokens += estimatedTokens;

  return {
    estimatedTokens,
    startTime: Date.now(),
  };
};

const endCall = (context, responseText = "") => {
  const responseTime = Date.now() - context.startTime;

  metrics.totalResponseChars += responseText.length;

  console.log("\n========== GEMINI CALL ==========");
  console.log("Prompt Characters :", context.promptLength || "N/A");
  console.log("Estimated Tokens  :", context.estimatedTokens);
  console.log("Response Characters:", responseText.length);
  console.log("Response Time     :", responseTime + " ms");
  console.log("=================================\n");
};

const failCall = () => {
  metrics.totalFailures++;
};

const printSummary = () => {
  console.log("\n========== GEMINI SUMMARY ==========");
  console.log("Total Calls:", metrics.totalCalls);
  console.log("Prompt Characters:", metrics.totalPromptChars);
  console.log(
    "Estimated Input Tokens:",
    metrics.totalEstimatedInputTokens
  );
  console.log("Response Characters:", metrics.totalResponseChars);
  console.log("Failures:", metrics.totalFailures);
  console.log("====================================\n");
};

const resetMetrics = () => {
  metrics = {
    totalCalls: 0,
    totalPromptChars: 0,
    totalEstimatedInputTokens: 0,
    totalResponseChars: 0,
    totalFailures: 0,
  };
};

module.exports = {
  startCall,
  endCall,
  failCall,
  printSummary,
  resetMetrics,
};