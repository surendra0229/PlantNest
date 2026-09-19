import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/api';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  User
} from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [micSupported, setMicSupported] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '🌿 Hello! I am **PlantNest Assistant**, your official nursery expert.\n\nAsk me about available plants, prices in ₹, stock, care guides, shipping details, or track your orders!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestedPrompts = [
    'Indoor plants under ₹500',
    'How do I care for Snake Plant?',
    'Where is my order?',
    'What is your shipping policy?'
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setQuery(currentTranscript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          if (currentTranscript.trim()) {
            handleSend(currentTranscript.trim(), true);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setMicSupported(false);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isListening, loading]);

  // Read chatbot response text aloud using Text-to-Speech
  const speakResponse = (text) => {
    if (!('speechSynthesis' in window) || !autoSpeak) return;

    window.speechSynthesis.cancel();

    // Clean formatting symbols for natural vocal playback
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/•/g, '')
      .replace(/🌿|📦|🛡️|🚚|📞|💳|✨|🪴/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleMic = () => {
    if (!micSupported) {
      alert('Speech recognition is not supported in this browser. Please try Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        setQuery('');
        recognitionRef.current?.start();
      } catch (e) {
        console.error('Failed to start mic:', e);
      }
    }
  };

  const handleSend = async (textToSend, isVoiceInput = false) => {
    const messageText = textToSend || query;
    if (!messageText.trim() || loading) return;

    stopSpeaking();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const data = await chatbotService.query(messageText);
      const botAnswerText = data.answer || "Sorry, I don't have data about that. I can only help with information available on the PlantNest website.";

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botAnswerText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeak || isVoiceInput) {
        speakResponse(botAnswerText);
      }
    } catch (err) {
      console.error('PlantNest Chatbot API error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, I don't have data about that. I can only help with information available on the PlantNest website.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Format bold text (**bold**) and clean lines
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className="min-h-[1.2em]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-extrabold text-emerald-700 dark:text-emerald-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 sm:p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
          title="Ask PlantNest Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-900 animate-ping" />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs whitespace-nowrap group-hover:ml-3 text-xs font-bold transition-all duration-300">
            Ask Nursery Assistant
          </span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-scale-in transition-colors duration-200">
          
          {/* Header */}
          <div className="bg-emerald-700 dark:bg-slate-800 border-b border-emerald-800 dark:border-slate-700 p-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
                <img src="/logo.png" alt="PlantNest" className="w-full h-full object-contain" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-emerald-900" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                  PlantNest Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[10px] text-emerald-200 dark:text-emerald-400 font-bold">Strict RAG Grounded Knowledge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Output Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  autoSpeak ? 'text-amber-300 bg-emerald-800 dark:bg-slate-700' : 'text-white/60 hover:text-white'
                }`}
                title={autoSpeak ? 'Voice output enabled (Click to mute)' : 'Voice output muted (Click to enable)'}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening) recognitionRef.current?.stop();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-emerald-800 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Listening / Speaking Live State Banners */}
          {isListening && (
            <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-extrabold flex items-center justify-between shadow-inner animate-pulse">
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 animate-spin text-slate-950" />
                Listening to your voice... Speak your question now.
              </span>
              <button
                type="button"
                onClick={toggleMic}
                className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-md hover:bg-slate-800 font-bold"
              >
                Done
              </button>
            </div>
          )}

          {isSpeaking && (
            <div className="bg-emerald-800 text-emerald-100 px-4 py-1.5 text-[11px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                Reading answer aloud...
              </span>
              <button
                type="button"
                onClick={stopSpeaking}
                className="text-[10px] text-amber-300 hover:underline font-extrabold"
              >
                Stop Speech
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-slate-800 border border-emerald-300 dark:border-slate-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 dark:bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-black/5 dark:border-white/5">
                    <span
                      className={`text-[9px] ${
                        msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.time}
                    </span>
                    {msg.sender === 'bot' && (
                      <button
                        type="button"
                        onClick={() => speakResponse(msg.text)}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-max shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-[11px]">Searching PlantNest knowledge base...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading || isListening}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form with Voice Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              disabled={loading}
              className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse shadow-md'
                  : micSupported
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950/80 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title={isListening ? 'Stop listening' : micSupported ? 'Speak question (Voice Input)' : 'Microphone not supported'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to voice...' : 'Ask about plants, prices in ₹, stock...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading || isListening}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition cursor-pointer shadow-md shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
