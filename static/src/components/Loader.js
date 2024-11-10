const Loader = ({ onLoadingComplete }) => {
  React.useEffect(() => {
    let loaderElement = null;
    let animationFrameId = null;
    let isAnimating = true;  // Add control flag

    const createParticle = () => {
      if (!loaderElement || !isAnimating) return;
      
      const particle = document.createElement('div');
      particle.classList.add('loader-particle');
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const startX = `${Math.cos(angle) * distance}vmin`;
      const startY = `${Math.sin(angle) * distance}vmin`;
      
      particle.style.setProperty('--startX', startX);
      particle.style.setProperty('--startY', startY);
      
      loaderElement.appendChild(particle);
      
      particle.addEventListener('animationend', () => {
        if (loaderElement && loaderElement.contains(particle)) {
          loaderElement.removeChild(particle);
        }
      });
    };

    const animateParticles = () => {
      if (isAnimating) {
        createParticle();
        animationFrameId = requestAnimationFrame(animateParticles);
      }
    };

    loaderElement = document.querySelector('.loader');
    if (loaderElement) {
      animateParticles();
    }

    setTimeout(() => {
      isAnimating = false;
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 6500);

    return () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
      if (loaderElement) {
        const particles = loaderElement.querySelectorAll('.loader-particle');
        particles.forEach(p => p.remove());
      }
    };
  }, [onLoadingComplete]);

  return (
    <div className="loader">
      <div className="sphere"></div>
    </div>
  );
};

window.Loader = Loader;