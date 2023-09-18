import { Command, CommandContext } from './types';
import OpenAI from "openai";

const OPENAI_API_KEY = '';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function transcribeAudio(data: Blob) {
    const result = await openai.audio.transcriptions.create({
        file: new File([data], 'input.webm'),
        model: 'whisper-1'
    });

    console.log('translated', result.text);
    return result.text
}

export async function executePrompt(prompt: string, commands: Command[]): Promise<ExecutionResult> {
    const started = Date.now();
    const extractionResult = await extractCommandFromPrompt(prompt, commands);

    const command = commands.find(c => c.name === extractionResult.command);
    if (!command) {
        throw new Error("Unknown command");
    }

    const context: CommandContext = {
        inputs: extractionResult.inputs
    };

    const output = await command.action(context);
    
    return {
        inputs: context.inputs,
        action: extractionResult.command,
        result: output,
        duration: Date.now() - started
    }
}

async function extractCommandFromPrompt(prompt: string, commands: Command[]): Promise<ExtractionResult> {
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        functions: commands.map((command) => ({
            name: command.name,
            description: command.description,
            parameters: {
                type: 'object',
                properties: command.inputs.reduce((memo, input) => ({
                    ...memo,
                    [input.name]: {
                        type: input.type,
                        description: input.description
                    }
                }), {})
            }
        })),
        function_call: 'auto',
        model: "gpt-3.5-turbo",
    });

    const message = response['choices'][0]['message'];

    if (message.function_call) {
        return {
            command: message.function_call.name,
            inputs: JSON.parse(message.function_call.arguments)
        };
    }

    throw new Error('Could not detect command');
}

interface ExtractionResult {
    command: string;
    inputs: Record<string, any>;
}

interface ExecutionResult {
    action: string;
    inputs: Record<string, any>;
    result: any;
    duration: number;
}