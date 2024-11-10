const Step1 = ({ name, dateOfBirth, email, color, setName, setDateOfBirth, setEmail, setColor, handleSubmit, isSubmitting, buttonText, error }) => {
  const [gender, setGender] = React.useState('');
  const [selectedInterests, setSelectedInterests] = React.useState([]);
  const [isVisible, setIsVisible] = React.useState(false);
  
  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { 
      name, 
      dateOfBirth, 
      email, 
      gender, 
      interests: selectedInterests, 
      colorName: color.name,  // Send the color name
      colorValue: color.value // Send the color value if needed
    };
    handleSubmit(userData);
  };

  const interests = [
    "Astrology", "Tarot Reading", "Numerology", "Meditation", "Yoga",
    "Crystal Healing", "Energy Work", "Palmistry", "Dream Interpretation",
    "Spiritual Growth", "Mindfulness", "Horoscopes", "Cosmic Events",
    "Mythology", "Ancient Civilizations", "Psychic Abilities",
    "Chakra Balancing", "Reiki", "Aura Reading", "Feng Shui"
  ];

  React.useEffect(() => {
    if (window.zoomBackground) {
      window.zoomBackground(0.3, 3400);
    }
    setTimeout(() => setIsVisible(true), 2000);
  }, []);

  const handleDateChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  return (
    <div className={`step1-container ${isVisible ? 'visible' : ''}`}>
      <div className="step-indicator">
        <div className="step active">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>
      <h1 className="title cosmic-gradient cosmic-text">Hello Traveler!</h1>
      <h2 className="cosmic-subtitle">Describe Your Existence</h2>
      <form onSubmit={onSubmit}>
        <div className="input-container">
          <img src="/static/icons/name.svg" alt="Name" className="input-icon" />
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="input"
          />
        </div>
        <div className="input-container">
          <img src="/static/icons/date.svg" alt="Date of Birth" className="input-icon" />
          <input 
            type="text" 
            value={dateOfBirth}
            onChange={handleDateChange}
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = 'text';
            }}
            placeholder="Your birth date"
            required
            className="input date-input"
          />
        </div>
        <div className="input-container">
          <img src="/static/icons/email.svg" alt="Email" className="input-icon" />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="input"
          />
        </div>
        <div className="input-container" onClick={(e) => e.stopPropagation()}>
          <ColorPicker color={color} setColor={setColor} />
        </div>
        <div className="input-container">
          <img src="/static/icons/gender.svg" alt="Gender" className="input-icon" />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="gender-select"
          >
            <option value="">Select your identity</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="input-container" onClick={(e) => e.stopPropagation()}>
          <CosmicMultiSelect
            options={interests}
            selectedOptions={selectedInterests}
            setSelectedOptions={setSelectedInterests}
          />
        </div>
        
        <window.CosmicButton 
          onClick={onSubmit}
          disabled={isSubmitting}
          isAnimating={isSubmitting}
        >
          {buttonText}
        </window.CosmicButton>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

window.Step1 = Step1;