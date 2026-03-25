import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Robustly extracts and parses JSON from a string that may contain 
 * markdown blocks or trailing/leading garbage text.
 */
export function extractJSON<T>(text: string): T {
  // 1. Clean common markdown artifacts
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // 2. Find the first '{' and last '}'
    const startIndex = cleaned.indexOf("{");
    const endIndex = cleaned.lastIndexOf("}");
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON object found in response");
    }
    
    const candidate = cleaned.substring(startIndex, endIndex + 1);
    
    try {
      return JSON.parse(candidate);
    } catch (innerErr: any) {
      // 3. Last ditch effort: try to find the first complete object 
      // by balanced brace matching if trailing chars are the issue
      let braceCount = 0;
      let foundStart = false;
      
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "{") {
          braceCount++;
          foundStart = true;
        } else if (cleaned[i] === "}") {
          braceCount--;
        }
        
        if (foundStart && braceCount === 0) {
          try {
            return JSON.parse(cleaned.substring(0, i + 1));
          } catch (e) {
            // continue searching if this wasn't a valid root object
          }
        }
      }
      
      throw new Error(`JSON Parse Error: ${innerErr.message}`);
    }
  }
}
