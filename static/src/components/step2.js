const Step2 = ({ name, cardImage, handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCard, setShowCard] = React.useState(false);
  const [instructionText, setInstructionText] = React.useState('');
  const [personalMessage, setPersonalMessage] = React.useState('');

  React.useEffect(() => {
    if (window.zoomBackground) {
      window.zoomBackground(1.3, 2000);
    }

    // Progressive reveal
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setShowInstruction(true), 600);
    setTimeout(() => setShowCard(true), 1100);

    // Set personal message based on zodiac sign
    if (window.getPersonalMessage && zodiacSign) {
      setPersonalMessage(window.getPersonalMessage(zodiacSign));
    }
  }, [zodiacSign]);

  const handleCardClick = () => {
    if (!isSpinning && !isRevealed) {
      setIsSpinning(true);
      setInstructionText('The universe is preparing to reveal your cosmic truth...');

      setTimeout(() => {
        setIsSpinning(false); // Stop spinning
        setIsRevealed(true);  // Mark as revealed
        setInstructionText('Click the card to reveal your cosmic message!'); // Prompt user to click the card

      }, 10000); // Adjust timing for the spin duration
    } else if (isRevealed) {
      handleCardReveal();  // Trigger card reveal (message reveal)
    }
  };

  return (
    <div className={`step-container step2-container ${isVisible ? 'visible' : ''}`}>
      <div className="step-indicator">
        <div className="step">1</div>
        <div className="step active">2</div>
        <div className="step">3</div>
      </div>
      <div className="step-content">
        {/* Title and Personal Message */}
        <h1 className="title cosmic-gradient cosmic-text">Hey {name}!</h1>
        {/* Instructions */}
        {showInstruction && (
          <p className="card-instruction">
            {instructionText || `The stars have chosen random card, ${name}. Click on the Card to reveal what's behind`}
          </p>
        )}

        {/* Card Container */}
        {showCard && (
          <div
            className="card-container"
            onClick={handleCardClick}
            tabIndex="0"
            role="button"
            aria-label="Click to reveal your tarot card"
          >
            <div className={`card ${isSpinning ? 'spinning' : ''} ${isRevealed ? 'revealed' : ''}`}>
              <div className="card-face card-back">
                <div className="card-design"></div>
              </div>
              <div
                className="card-face card-front"
                style={{
                  backgroundImage: `url('/static/images/${cardImage}')`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.Step2 = Step2;