const CosmicDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const datePickerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const handleClickOutside = React.useCallback((event) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onChange(newDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select birth date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="cosmic-date-picker" ref={datePickerRef}>
      <div 
        className="cosmic-date-display"
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        <img src="/static/icons/date.svg" alt="Date" className="input-icon" />
        <span className="date-display-text">
          {formatDisplayDate(value)}
        </span>
      </div>
      <input
        ref={inputRef}
        type="date"
        value={value || ''}
        onChange={handleDateChange}
        className="cosmic-date-input"
        max={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
};

window.CosmicDatePicker = CosmicDatePicker;