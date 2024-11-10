const Step4 = ({ onSignup, onClose, email, setEmail }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-content">
      <h2 className="title">Unlock Your Full Potential</h2>
      <div className="text-container">
        <p className="cosmic-message">
          Unlock Your Full Potential with the Pro Experience! 🌟
          I'm excited that you're considering joining the exclusive pro experience. By signing up now, you'll be the first to explore deeply personalized features, crafted to resonate with your unique personality.
        </p>
        <p className="cosmic-message">
          ✨ What Will Make the Pro Experience Special?
          I'll collect a few personal details like your lucky number, favorite color, and other preferences to train the AI model and tailor its guidance just for you. It's all about creating a cosmic connection between your personality and the readings you receive.
        </p>
        <p className="cosmic-message">
          🔒 Your Privacy Matters!
          I value your privacy above all else. Rest assured, any information you provide will remain strictly private and secure. None of your personal details will ever be shared—my focus is solely on crafting the best possible experience for you.
        </p>
        <p className="cosmic-message">
          📬 Sign Up for Early Access:
          No pressure—just add yourself to the waiting list, and I'll keep you updated. As a thank-you for your patience, you'll receive an exclusive discount when the pro features launch!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="cosmic-form">
        <div className="input-container">
          <img src="/static/icons/email.svg" alt="Email" className="input-icon" />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="input"
            disabled={isSubmitted}
          />
        </div>
        <button 
          type="submit" 
          className={`cosmic-glassy-button2 ${isSubmitted ? 'submitted' : ''}`}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Thanks for Joining! ✨' : 'Join the Cosmic Journey'}
        </button>
      </form>
      <button onClick={onClose} className="close-button">
        <img src="/static/icons/close.svg" alt="Close" />
      </button>
    </div>
  );
};

window.Step4 = Step4;