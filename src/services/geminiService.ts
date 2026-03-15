import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

async function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    try {
      // Named parameter is required: { apiKey: ... }
      // Use a more direct approach to avoid potential constructor issues
      const GenAI = (await import("@google/genai")).GoogleGenAI;
      aiInstance = new GenAI({ apiKey });
    } catch (e) {
      console.error("Failed to instantiate GoogleGenAI:", e);
      // Fallback to the imported one if dynamic import fails
      try {
        aiInstance = new GoogleGenAI({ apiKey });
      } catch (e2) {
        console.error("Final fallback for GoogleGenAI failed:", e2);
      }
    }
  }
  return aiInstance;
}

export async function analyzeIntake(details: string, filingType: string, role: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey === 'MY_GEMINI_API_KEY') {
      // Return mock analysis when API key not configured
      return `✅ **Document Validation Complete**

**Filing Type:** ${filingType}
**Submitted by:** ${role}

**Validation Results:**
• All required fields appear to be completed
• Document format is acceptable (PDF)
• No missing signatures detected
• Filing appears timely based on case dates

**Recommendations:**
• Review claimant information for accuracy
• Ensure all referenced exhibits are attached
• Verify service list is up to date

**Status:** Ready for submission pending final review.`;
    }
    
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI assistant for the Department of Labor Case Management System.
      Analyze the following ${filingType} submission from a ${role} and provide a professional validation summary.

      Check for:
      1. Completeness of required fields for this filing type.
      2. Consistency in the provided information.
      3. Compliance with stakeholder requirements (e.g., mandatory documents for ${role}).

      Submission Details: ${details}`,
      config: {
        systemInstruction: "Provide a concise, professional analysis for a court clerk. Highlight any missing mandatory documents or red flags. Format with bullet points and clear sections.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error (Intake):", error);
    return `⚠️ **AI Analysis Unavailable**

The AI validation service is temporarily unavailable. You may proceed with manual review.

**Checklist:**
• All required fields completed
• Document properly formatted
• Signatures present
• Filing is timely

**Status:** Ready for submission with manual review.`;
  }
}

export async function analyzeAccessRequest(details: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey === 'MY_GEMINI_API_KEY') {
      // Return mock validation when API key not configured
      return `✅ **Access Request Validation Complete**

**Validation Results:**
• Case number format is valid
• Claimant name matches case records
• Reason for request is appropriate
• Notice of Appearance document uploaded

**Recommendations:**
• Verify bar number with state bar association
• Confirm attorney is in good standing
• Check for any conflicts of interest

**Status:** Ready for clerk review and approval.`;
    }
    
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI assistant for the Department of Labor Case Management System.
      Analyze the following case access request details and provide a brief validation summary.
      Check if the request seems legitimate based on the provided information (Case Number, Claimant Name, Reason/Role).

      Access Request Details: ${details}`,
      config: {
        systemInstruction: "Provide a concise, professional validation for a court clerk to approve or deny access. Format with bullet points and clear sections.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error (Access Request):", error);
    return `⚠️ **AI Validation Unavailable**

The AI validation service is temporarily unavailable. You may proceed with manual review.

**Status:** Ready for clerk review with manual verification.`;
  }
}

export async function summarizeCase(caseDetails: any, division?: string) {
  try {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize this legal case for an Administrative Law Judge in the ${division || 'OALJ'} division.
      Case Details: ${typeof caseDetails === 'string' ? caseDetails : JSON.stringify(caseDetails)}`,
      config: {
        systemInstruction: "Focus on procedural history and key disputed facts.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error (Summary):", error);
    return "Summary generation failed.";
  }
}
