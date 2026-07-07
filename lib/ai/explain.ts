export async function generatePlainEnglishExplanation(cwe: string, rawTitle: string) {
  // Will implement Claude API plain-English translation in Phase 4
  return {
    plainEnglish: `Explanation for ${rawTitle}: This issue allows attackers to bypass security controls.`,
    consequence: "High risk of unauthorized data access.",
  };
}
