const Step0 = ({ onTryFree, onSignUpPro, onExplore }) => {
  return (
    <div className="step0-container">
      <h1 className="title">Hello Traveler!</h1>
      <div className="options-container">
        <button onClick={onTryFree} className="cosmic-glassy-button2">
          Free Galactic Trial
        </button>
        
        <button onClick={onSignUpPro} className="cosmic-glassy-button2">
          Sign Up
        </button>
        
        <button onClick={onExplore} className="cosmic-glassy-button2">
          Behind the Magic ✨
        </button>
      </div>
    </div>
  );
};

window.Step0 = Step0;