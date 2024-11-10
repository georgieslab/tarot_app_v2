// CosmicMultiSelect.js
const CosmicMultiSelect = ({ options, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const multiSelectRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (multiSelectRef.current && !multiSelectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = React.useCallback((option, e) => {
    e.stopPropagation();
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  }, [setSelectedOptions]);

  const handleLabelClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="cosmic-msd" ref={multiSelectRef}>
      <div 
        className="cosmic-msd-label" 
        onClick={handleLabelClick}
      >
        <img src="/static/icons/interests.svg" alt="Interests" className="input-icon" />
        <span className="label-text">
          {selectedOptions.length > 0 
            ? `${selectedOptions.length} Interest${selectedOptions.length > 1 ? 's' : ''} Selected` 
            : "Select Your Interests"}
        </span>
        <i 
          className={`cosmic-msd-label-icon fas fa-chevron-${isOpen ? 'up' : 'down'}`}
        ></i>
      </div>

      {isOpen && (
        <div className="cosmic-msd-options-container">
          <div className="cosmic-msd-options-grid">
            {options.map(option => (
              <div
                key={option}
                className={`cosmic-msd-option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                onClick={(e) => toggleOption(option, e)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleOption(option, e);
                  }
                }}
              >
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.CosmicMultiSelect = CosmicMultiSelect;