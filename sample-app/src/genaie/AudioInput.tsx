import { useState, useEffect } from 'react';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
// const speechSdk = require('microsoft-cognitiveservices-speech-sdk');

interface Props {
    onData: (data: Blob) => unknown;
}

export function AudioInput(props: Props) {
    const [error, setError] = useState<string>()
    const [recorder, setRecorder] = useState<MediaRecorder|null>();
    const [recording, setRecording] = useState(false);

    const text = recording ? 'Stop' : 'Record';

    useEffect(() => {
        if ((!navigator.mediaDevices) || !(navigator.mediaDevices.getUserMedia)) {
            setError('Not supported')
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const _recorder = new MediaRecorder(stream);
                _recorder.addEventListener('dataavailable', (e) => {
                    console.log('data available', e);
                    props.onData(e.data);
                })

                _recorder.addEventListener('stop', (e) => {
                    setRecording(false);
                });

                _recorder.addEventListener('error', (e) => {
                    console.log('error', e);
                });

                setRecorder(_recorder);
            })
            .catch((e) => {
                setError(e);
            });
    }, [error, recorder]);

    const handleClick = () => {
        if (!recorder) {
            return;
        }

        console.log('recorder state', recorder.state);

        if (recording) {
            recorder.stop();
            setRecording(false);
        }
        else {
            recorder.start(1500);
            setRecording(true);
        }
    }

    return (
        <button type="button" onClick={handleClick}>{text}</button>
    );
}


export interface TranscriptionProps {
    onTranscribe: (text: string) => unknown;
    onError: (message: string) => unknown;
}

const KEY = '';
const region = 'eastus';

const speechConfig = speechSdk.SpeechConfig.fromSubscription(KEY, region);
speechConfig.speechRecognitionLanguage = 'en-US';

const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);

export function TranscriptionInput(props: TranscriptionProps) {
    // const [recognizer, setRecognizer] = useState<speechSdk.SpeechRecognizer>();
    const [isTranscribing, setIsTranscribing] = useState(false);

    const buttonText = isTranscribing ? '...' : 'Speak';

    // useEffect(() => {
    //     const speechConfig = speechSdk.SpeechConfig.fromSubscription(KEY, region);
    //     speechConfig.speechRecognitionLanguage = 'en-US';

    //     const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
    //     const _recognizer = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);
    //     setRecognizer(_recognizer);
    // }, [recognizer]);

    const handleClick = async () => {
        if (!recognizer) return;
        setIsTranscribing(true);

        recognizer.recognizeOnceAsync(result => {
            if (result.reason === ResultReason.RecognizedSpeech) {
                console.log(`RECOGNIZED: Text=${result.text}`);
                props.onTranscribe(result.text);
            } else {
                props.onError('ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.');
            }

            setIsTranscribing(false);
        });

    };
    


    return (
        <button type="button" onClick={handleClick}>{buttonText}</button>
    )
}