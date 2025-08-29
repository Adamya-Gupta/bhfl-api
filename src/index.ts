import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();


app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (c.req.method === "OPTIONS") {
    return new Response(null, { status: 204 })
  }

  await next();
});


function processData(data: string[]) {
  const result = {
    is_success: true,
    user_id: "adamya_gupta_26032002", 
    email: "adamyagupta2022@vitbhopal.ac.in",        
    roll_number: "22BCE10277",       
    odd_numbers: [] as string[],
    even_numbers: [] as string[],
    alphabets: [] as string[],
    special_characters: [] as string[],
    sum: "0",
    concat_string: "",
  };

  let numSum = 0;
  let alphabetChars: string[] = [];

  try {
    for (const item of data) {
      const str = String(item);

      if (/^\d+$/.test(str)) {
        // Number
        const num = parseInt(str, 10);
        numSum += num;
        (num % 2 === 0 ? result.even_numbers : result.odd_numbers).push(str);
      } else if (/^[a-zA-Z]+$/.test(str)) {
        // Alphabets
        result.alphabets.push(str.toUpperCase());
        alphabetChars.push(...str.toLowerCase());
      } else {
        // Special characters
        result.special_characters.push(str);
      }
    }

    result.sum = numSum.toString();

    if (alphabetChars.length > 0) {
      alphabetChars.reverse();
      result.concat_string = alphabetChars
        .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
        .join("");
    }

    return result;
  } catch {
    return {
      is_success: false,
      user_id: "adamya_gupta_26032002", 
      email: "adamyagupta2022@vitbhopal.ac.in",        
      roll_number: "22BCE10277",    
      error: "Processing failed",
    };
  }
}

// POST endpoint
app.post("/bfhl", async (c) => {
  try {
    const body = await c.req.json();

    if (!body || !Array.isArray(body.data)) {
      return c.json(
        {
          is_success: false,
          user_id: "adamya_gupta_26032002", 
          email: "adamyagupta2022@vitbhopal.ac.in",        
          roll_number: "22BCE10277",    
          error: "Invalid input. 'data' should be an array.",
        },
        400
      );
    }

    return c.json(processData(body.data), 200);
  } catch {
    return c.json(
      {
        is_success: false,
        user_id: "john_doe_17091999",
        email: "john@xyz.com",
        roll_number: "ABCD123",
        error: "Internal server error",
      },
      500
    );
  }
});


export const GET = handle(app);
export const POST = handle(app);
