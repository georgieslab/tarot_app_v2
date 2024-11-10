// ColorPicker.js
const ColorPicker = ({ color, setColor }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pickerRef = React.useRef(null);

  const colors = [
    { name: 'Cosmic Purple', value: '#A59AD1' },
    { name: 'Mystic Blue', value: '#87CEEB' },
    { name: 'Celestial Pink', value: '#FFB6C1' },
    { name: 'Astral Gold', value: '#FFD700' },
    { name: 'Ethereal Green', value: '#98FB98' },
    { name: 'Spiritual Orange', value: '#FFA07A' },
    { name: 'Divine Violet', value: '#DDA0DD' },
    { name: 'Cosmic Teal', value: '#40E0D0' },
    { name: 'Luna Silver', value: '#C0C0C0' },
    { name: 'Mars Red', value: '#CD5C5C' },
    { name: 'Neptune Blue', value: '#4169E1' },
    { name: 'Venus Rose', value: '#FF69B4' },
    { name: 'Jupiter Bronze', value: '#CD853F' },
    { name: 'Saturn Lavender', value: '#E6E6FA' },
    { name: 'Mercury Gray', value: '#778899' },
    { name: 'Pluto Indigo', value: '#4B0082' }
  ];

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorSelect = (newColor) => {
    setColor(newColor);
    setIsOpen(false);
  };

  return (
    <div className="color-picker-container" ref={pickerRef}>
      <div 
        className="cosmic-msd-label" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/static/icons/color.svg" alt="Color" className="input-icon" />
        <span className="label-text" style={{ color: color.value }}>{color.name}</span>
      </div>

      {isOpen && (
        <div className="cosmic-msd-options-container">
          <div className="color-swatches">
            {colors.map((colorOption) => (
              <div
                key={colorOption.name}
                className={`color-swatch ${colorOption.name === color.name ? 'selected' : ''}`}
                style={{ backgroundColor: colorOption.value }}
                onClick={() => handleColorSelect(colorOption)}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.ColorPicker = ColorPicker;