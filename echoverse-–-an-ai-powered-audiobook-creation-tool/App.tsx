
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TextArea from './components/TextArea';
import Select from './components/Select';
import Button from './components/Button';
import AudioPlayer from './components/AudioPlayer';
import { TONES, LANGUAGES } from './constants';
import { Tone } from './types';
import { rewriteText } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import Slider from './components/Slider';

const App: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('The sun dipped below the horizon, painting the sky in shades of orange and purple. A gentle breeze rustled the leaves, carrying the scent of pine and damp earth. In the distance, a lone wolf howled at the rising moon.');
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.NARRATIVE);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [pitch, setPitch] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const populateVoiceList = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);
    // Auto-select the first voice for the default language if not already set
    if (voices.length > 0 && !selectedVoice) {
      const defaultLangVoices = voices.filter(voice => voice.lang.startsWith(selectedLanguage.split('-')[0]));
      if(defaultLangVoices.length > 0) {
        setSelectedVoice(defaultLangVoices[0].name);
      } else {
         setSelectedVoice(voices[0].name);
      }
    }
  }, [selectedLanguage, selectedVoice]);

  useEffect(() => {
    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  const handleRewrite = async () => {
    if (!originalText.trim()) {
      setError('Please enter some text to rewrite.');
      return;
    }
    setError(null);
    setIsRewriting(true);
    setRewrittenText('');
    try {
      const result = await rewriteText(originalText, selectedTone);
      setRewrittenText(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred while rewriting text.');
      }
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handlePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!rewrittenText.trim()) {
        setError('Please rewrite the text before generating audio.');
        return;
      }
      setError(null);
      const utterance = new SpeechSynthesisUtterance(rewrittenText);
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        let errorMessage = 'An error occurred during speech synthesis.';
        // The 'error' property on the event gives more detail.
        switch (event.error) {
          case 'synthesis-failed':
            errorMessage = 'Speech synthesis failed. Please try a different voice, language, or shorter text.';
            break;
          case 'language-unavailable':
            errorMessage = 'The selected language is not supported by your browser for speech synthesis.';
            break;
          case 'voice-unavailable':
            errorMessage = 'The selected voice is not available. Please choose another.';
            break;
          case 'interrupted':
            errorMessage = 'Audio playback was interrupted. Please try again.';
            break;
          default:
             errorMessage = `An unknown speech error occurred: ${event.error}`;
        }
        setError(errorMessage);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };
  
  const handleDownload = () => {
    if (!rewrittenText.trim()) {
      setError('Please rewrite the text first.');
      return;
    }
    setError(null);
    const blob = new Blob([rewrittenText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'echoverse_script.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredVoices = availableVoices.filter(voice => voice.lang === selectedLanguage);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
            <h2 className="text-xl font-bold text-teal-400 mb-4">1. Your Manuscript</h2>
            <TextArea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter your text here..."
              rows={10}
            />
            
            <h2 className="text-xl font-bold text-teal-400 mt-6 mb-4">2. AI Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Tone"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as Tone)}
                options={TONES}
              />
              <Select
                label="Select Language"
                value={selectedLanguage}
                onChange={(e) => {
                  const newLanguage = e.target.value;
                  setSelectedLanguage(newLanguage);
                  // Reset voice when language changes
                  const newLangVoices = availableVoices.filter(v => v.lang === newLanguage);
                  if (newLangVoices.length > 0) {
                    setSelectedVoice(newLangVoices[0].name);
                  } else {
                    setSelectedVoice('');
                  }
                }}
                options={LANGUAGES}
              />
            </div>
             <div className="mt-4">
              <Select
                label="Select Voice"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                options={filteredVoices.map(voice => ({ value: voice.name, label: `${voice.name} (${voice.lang})` }))}
                disabled={filteredVoices.length === 0}
              />
               {filteredVoices.length === 0 && availableVoices.length > 0 && (
                <p className="text-sm text-yellow-500 mt-2">No voices available for the selected language. Please choose another language or check your browser/OS voice settings.</p>
              )}
             </div>
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Slider
                    label="Voice Pitch"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    disabled={isSpeaking}
                />
                <Slider
                    label="Voice Speed"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    disabled={isSpeaking}
                />
            </div>

            <div className="mt-6">
              <Button
                onClick={handleRewrite}
                isLoading={isRewriting}
                className="w-full text-lg"
              >
                <SparklesIcon className="w-6 h-6 mr-2" />
                Rewrite with AI
              </Button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
            <h2 className="text-xl font-bold text-purple-400 mb-4">3. AI-Generated Result</h2>
             <TextArea
              value={rewrittenText}
              placeholder="Your AI-rewritten text will appear here..."
              readOnly={true}
              rows={10}
              isLoading={isRewriting}
            />
            <div className="mt-6">
                <AudioPlayer
                    isSpeaking={isSpeaking}
                    onPlayPause={handlePlayPause}
                    onDownload={handleDownload}
                    disabled={!rewrittenText || isRewriting}
                />
            </div>
             {error && (
              <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center">
                <p>{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
