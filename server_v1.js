import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";


dotenv.config();

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// For resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(bodyParser.json());
app.use(cors());



// API endpoint
app.use(express.static("public"));
app.post("/api/recipe", async (req, res) => {
  const { diet, cuisine, ingredients, time, servings } = req.body;

  const prompt = `
  Create a detailed recipe based on:
  - Dietary preference: ${diet}
  - Cuisine: ${cuisine}
  - Ingredients: ${ingredients.join(", ")}
  - Time available: ${time} minutes
  - Servings: ${servings}
  
  Please return:
  Title
  Tags
  Ingredients list
  Step-by-step instructions
  `;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ recipe: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Recipe generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
