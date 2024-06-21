
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { topic } = await request.json();

  try {
   
    if (!topic || typeof topic !== 'string') {
      throw new Error('Invalid input parameters');
    }

   
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', 
      prompt: `If the input is a technical term, then generate a proper roadmap for  ${topic}. otherwise tell that its not a tech stack`,
      max_tokens: 150,
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const outline = response.choices[0].text.trim();
    return NextResponse.json({ outline });
  } catch (error) {
    console.error('Error generating course:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
