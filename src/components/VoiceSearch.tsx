import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const VoiceSearch = ({ onSearch }: { onSearch: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      setIsListening(false);
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      recognition.stop();
      onSearch(transcript); // Appeler la fonction de rappel avec le texte reconnu
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("Erreur de reconnaissance vocale: ", event.error);
    };
  };

  return (
    <button onClick={startListening}>
      {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
    </button>
  );
};

export default VoiceSearch;
