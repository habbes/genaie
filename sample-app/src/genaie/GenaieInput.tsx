import { useState } from 'react';
import { TranscriptionInput } from './AudioInput';
import { Command } from './types';
import { executePrompt } from './engine';

export interface GenaieProps {
    commands: Command[]
};

export function GenaieInput(props: GenaieProps) {
    const [prompt, setPrompt] = useState<string>();

    const handlePrompt = async () => {
        if (!prompt) {
            return;
        }

        const result = await executePrompt(prompt, props.commands);
        console.log('result', result);
    };

    const handleTranscribe = async(text: string) => {
        setPrompt(text);
        const result = await executePrompt(text, props.commands);
        console.log('result', result);
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="What do you want to do?"
                    onChange={e => setPrompt(e.target.value)}
                />
                <button type="button"  onClick={handlePrompt}>Go!</button>
            </div>
            <div>
                <TranscriptionInput onTranscribe={handleTranscribe} onError={e => alert(e)} />
            </div>
            <div>
                {prompt}
            </div>
        </div>
    )
}