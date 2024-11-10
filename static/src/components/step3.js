const Step3 = ({ cardImage, cardName, interpretation }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [contentVisible, setContentVisible] = React.useState(false);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const sequence = async () => {
      setIsVisible(true);
      await new Promise((r) => setTimeout(r, 1000));
      setContentVisible(true);
    };
    sequence();
  }, []);

  // 3D hover effect for card
  const handleCardMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleCardLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
  };

  return (
    <div className={`step3-container ${isVisible ? 'visible' : ''}`}>
      <div className="step3-content">
        
        {/* Left Column for Reading */}
        <div className="left-column">
          <h2 className="reading-title">YOUR READING</h2>
          <p className="interpretation-text">
            {interpretation || "Loading your reading..."}
          </p>
        </div>
        
        {/* Right Column for Tarot Card */}
        <div className="right-column card-container">
          <div
            ref={cardRef}
            className="interactive-card"
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <img
              src={`/static/images/${cardImage}`}
              alt={cardName}
              className="tarot-card-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

window.Step3 = Step3;
