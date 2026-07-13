import { useState } from "react";
import LandingPage from "./LandingPage/LandingPage";
import ChatApp from "./ChatApp/ChatApp";
import './transition.css';

export default function App() {
  const [showChat, setShowChat] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnter = () => {
    setIsAnimating(true);
    setShowChat(true);
    setTimeout(() => setIsAnimating(false), 240);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setShowChat(false);
    setTimeout(() => setIsAnimating(false), 240);
  };

  return (
    <div className={`view-transition ${isAnimating ? 'view-transition--active' : ''}`}>
      {showChat
        ? <ChatApp onBack={handleBack} />
        : <LandingPage onEnter={handleEnter} />}
    </div>
  );
}