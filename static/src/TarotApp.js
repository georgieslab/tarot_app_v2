const TarotApp = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [audioReady, setAudioReady] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [zodiacSign, setZodiacSign] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardImage, setCardImage] = React.useState('');
  const [interpretation, setInterpretation] = React.useState('');
  const [affirmations, setAffirmations] = React.useState([]);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [fadeIn, setFadeIn] = React.useState(false);
  const [contentVisible, setContentVisible] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const emailSaveTimeoutRef = React.useRef(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [previousStep, setPreviousStep] = React.useState(0);
  const audioRef = React.useRef(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('Talk to the Universe');
  const [error, setError] = React.useState(null);
  const [isDev, setIsDev] = React.useState(false);
  const [devPanel, setDevPanel] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  const [color, setColor] = React.useState({
    name: 'Cosmic Purple',
    value: '#A59AD1'
  });

  React.useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('dev') === 'true' || localStorage.getItem('devMode') === 'true';
    setIsDev(devMode);
    // Add this to your useEffect in TarotApp
    const directStep = urlParams.get('step');
    if (directStep && isDev) {
      jumpToStep(parseInt(directStep));
    }
    // Listen for dev mode keyboard shortcut (Ctrl + Shift + D)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsDev(prev => !prev);
        setDevPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Dev mode navigation
  const jumpToStep = (targetStep) => {
    // Set necessary state for the target step
    switch(targetStep) {
      case 3:
        // Simulate data for step 3
        setCardName("The Star");
        setCardImage("star.jpg");
        setInterpretation(`## The Star: Hope and Inspiration\nThe Star card represents hope, 
          inspiration, and renewed faith. It appears when you're ready to receive divine guidance...`);
        setAffirmations([
          "I am open to receiving universal guidance",
          "My path is illuminated by divine light",
          "I trust in the journey ahead"
        ]);
        break;
      case 2:
        // Simulate data for step 2
        setName("Developer");
        setZodiacSign("Libra");
        break;
      // Add cases for other steps as needed
    }
    setStep(targetStep);
  };

  // Dev panel component
  const DevPanel = () => (
    <div className="dev-panel">
      <div className="dev-panel-header">
        <h3>Dev Controls</h3>
        <button onClick={() => setDevPanel(false)}>×</button>
      </div>
      <div className="dev-panel-content">
        <button onClick={() => jumpToStep(0)}>Step 0</button>
        <button onClick={() => jumpToStep(1)}>Step 1</button>
        <button onClick={() => jumpToStep(2)}>Step 2</button>
        <button onClick={() => jumpToStep(3)}>Step 3</button>
        <button onClick={() => localStorage.clear()}>Clear Storage</button>
      </div>
    </div>
  );

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
    
    if (emailSaveTimeoutRef.current) {
      clearTimeout(emailSaveTimeoutRef.current);
    }

    emailSaveTimeoutRef.current = setTimeout(() => {
      saveEmailToFirestore(newEmail);
    }, 500);
  };

  const saveEmailToFirestore = async (email) => {
    if (!email) return;

    try {
      const response = await fetch('/api/save_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Failed to save email');
      }
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  React.useEffect(() => {
    audioRef.current = new Audio('/static/sound/cosmicnoise.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;


    audioRef.current.oncanplaythrough = () => {
      setAudioReady(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    document.getElementById('canvas_container').classList.add('fade-in');
    setTimeout(() => {
      setContentVisible(true);
      setFadeIn(true);
    }, 100);
  };

  const handleUserInteraction = (e) => {
    if (e.target.closest('.cosmic-msd')) {
      return;
    }
    if (audioReady && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setFadeIn(true);
      }).catch(error => console.log('Audio play was prevented:', error));
    }
  };

  const handleCardReveal = () => {
    setStep(3);
  };

  const handleTryFree = () => {
    setFadeOut(true);
    setTimeout(() => {
      setStep(1);
      setFadeOut(false);
      setFadeIn(true);
      setTimeout(() => {
        setFadeIn(false);
      }, 500);
    }, 500);
  };

  const handleSignup = async (submittedEmail) => {
    const emailToUse = email || submittedEmail;
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse }),
      });
      if (response.ok) {
        alert('Thank you for signing up!');
      } else {
        throw new Error('Failed to sign up');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing up. Please try again.');
    }
  };

  const handleSubmit = async (userData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setButtonText('Finding your star...');
    setError(null);
  
    try {
      // First, submit user data
      const userResponse = await fetch('/api/submit_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          dateOfBirth: userData.dateOfBirth,
          email: userData.email,
          gender: userData.gender,
          interests: userData.interests,
          colorName: userData.color.name,
          colorValue: userData.color.value
        })
      });
  
      if (userResponse.ok) {
        const userDataResponse = await userResponse.json();
        setZodiacSign(userDataResponse.zodiac_sign);
        
        // Construct the URL with all parameters
        const readingUrl = new URL('/api/get_tarot_reading', window.location.origin);
        readingUrl.searchParams.append('name', userData.name);
        readingUrl.searchParams.append('dateOfBirth', userData.dateOfBirth);
        readingUrl.searchParams.append('gender', userData.gender);
        readingUrl.searchParams.append('interests', userData.interests.join(','));
        readingUrl.searchParams.append('colorName', userData.color.name);
        readingUrl.searchParams.append('colorValue', userData.color.value);

        // Fetch tarot reading with all user data
        const readingResponse = await fetch(readingUrl);
        
        if (readingResponse.ok) {
          const readingData = await readingResponse.json();
          setCardName(readingData.cardName);
          setCardImage(readingData.cardImage);
          setInterpretation(readingData.interpretation);
          setAffirmations(readingData.affirmations); // Now expecting array with single affirmation
          setStep(2);
        } else {
          throw new Error('Failed to fetch tarot reading');
        }
      } else {
        throw new Error('Failed to submit user data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setButtonText('Talk to the Universe');
    }
  };

  const handleSignUpPro = () => {
    setPreviousStep(step);
    setStep(4);
    document.body.classList.add('modal-active');
    document.getElementById('modal-container').classList.add('four');
  };

  const handleExplore = () => {
    setPreviousStep(step);
    setStep(5);
    document.body.classList.add('modal-active');
    document.getElementById('modal-container').classList.add('four');
  };

  const handleClose = () => {
    document.getElementById('modal-container').classList.add('out');
    document.body.classList.remove('modal-active');
    setTimeout(() => {
      setStep(previousStep);
      document.getElementById('modal-container').classList.remove('four', 'out');
    }, 500);
  };


const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          audioRef.current.muted = !isMuted;
        }).catch(error => console.log('Audio play was prevented:', error));
      } else {
        audioRef.current.muted = !isMuted;
      }
    }
  };


  const handleRestart = () => {
    setStep(1);
    setName('');
    setDateOfBirth('');
    setEmail('');
    setZodiacSign('');
    setCardName('');
    setCardImage('');
    setInterpretation('');
    setAffirmations([]);
    
    if (window.zoomBackground) {
      window.zoomBackground(0.3, 3400);
    }
  };


  const handleBackToStep0 = () => {
    setStep(0);
    setName('');
    setDateOfBirth('');
    setEmail('');
    setColor('#A59AD1');
    setError(null);
    
    if (window.zoomBackground) {
      window.zoomBackground(0.3, 1000);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
      {contentVisible && (
        <div className="parent-container" onClick={handleUserInteraction}>
          {step === 0 && (
            <div className="container container-step0">
              <Step0
                onTryFree={handleTryFree}
                onSignUpPro={handleSignUpPro}
                onExplore={handleExplore}
              />
            </div>
          )}
          {step === 1 && (
            <div className="container container-step1">
              <Step1
                name={name}
                dateOfBirth={dateOfBirth}
                email={email}
                color={color}
                setName={setName}
                setDateOfBirth={setDateOfBirth}
                setEmail={setEmail}
                setColor={setColor}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                buttonText={buttonText}
                error={error}
              />
            </div>
          )}
          {step === 2 && (
            <Step2
              name={name}
              cardImage={cardImage}
              handleCardReveal={handleCardReveal}
              zodiacSign={zodiacSign}
            />
          )}
          {step === 3 && (
            <Step3
              cardImage={cardImage}
              interpretation={interpretation}
              affirmations={affirmations}
              onSignUpPro={handleSignUpPro}
            />
          )}
          <AudioButton isMuted={isMuted} toggleMute={toggleMute} />
          {step === 3 && (
            <button onClick={handleRestart} className="restart-button">
              <img
                src="/static/icons/restart.svg"
                alt="Restart"
                className="restart-icon"
              />
            </button>
          )}
          {step === 1 && (
            <button onClick={handleBackToStep0} className="back-button">
              <img
                src="/static/icons/back.svg"
                alt="Back"
                className="back-icon"
              />
            </button>
          )}
        </div>
      )}
      <div id="modal-container">
        <div className="modal-background">
          <div className="modal">
            {step === 4 && (
              <Step4 
                onSignup={handleSignup} 
                onClose={handleClose} 
                email={email} 
                setEmail={handleEmailChange}
              />
            )}
            {step === 5 && <Step5 onSignup={handleSignup} onClose={handleClose} />}
            
          </div>
        </div>
        {isDev && devPanel && <DevPanel />}
      </div>
    </React.Fragment>
  );
};

window.TarotApp = TarotApp;