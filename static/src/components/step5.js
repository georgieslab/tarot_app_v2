const Step5 = ({ onClose }) => {
  return (
    <div className="modal-content">
      <h2 className="title">Explore the Magic</h2>
      <div className="text-container">
        <p className="cosmic-message">
          Welcome, Traveler! 🌟
        </p>
        <p className="cosmic-message">
          In this realm of infinite possibilities, you're about to embark on a journey of self-discovery, guided by the ancient wisdom of the stars, tarot, and cosmic forces—blended with the cutting-edge power of Artificial Intelligence. This app is more than just a tool—it's a mirror to your inner self, where randomness meets purpose, and intuition flows freely.
        </p>
        <h3 className="subtitle">How It Works:</h3>
        <ol className="cosmic-list">
          <li><strong>Shuffle the Deck</strong>: Each card drawn is chosen by chance but infused with deeper meaning. My AI is designed to embrace the subtle randomness of life, using patterns from countless studies to ensure each reading resonates with where you are on your path.</li>
          <li><strong>Fine-Tuned Personalization</strong>: By unlocking pro features, you'll provide us with insights into your personal world, allowing my AI to craft more nuanced and detailed readings. Think of it as co-creating your destiny—with the wisdom of the cosmos and the precision of technology working together.</li>
          <li><strong>Daily Affirmations & Cosmic Guidance</strong>: Every visit aligns you with new energy. My AI model, fine-tuned specifically for this task, adapts to shifts in the universe—from planetary alignments to your unique input—delivering personalized insights and affirmations that speak directly to you.</li>
        </ol>
        <h3 className="subtitle">My Vision:</h3>
        <p className="cosmic-message">
          I believe that life is a tapestry woven from threads of fate, chance, and choice. Powered by state-of-the-art AI technology and grounded in ancient wisdom, this app helps you understand your path, harness cosmic energies, and unlock your full potential. Every interaction is fine-tuned to you, blending the mysteries of the universe with the latest advancements in AI to guide you forward.
        </p>
        <p className="cosmic-message">
          Trust the process, embrace the unknown, and step boldly into your future. ✨
        </p>
      </div>
      <button onClick={onClose} className="close-button">
        <img src="/static/icons/close.svg" alt="Close" />
      </button>
    </div>
  );
};

window.Step5 = Step5;