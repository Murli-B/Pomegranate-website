import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 212;
const currentFrame = (index) =>
  `/fruit/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

function App() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Preload images
    const preloadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          // Draw first image as soon as it loads
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
          }
        }
      };
      preloadedImages.push(img);
    }
    setImages(preloadedImages);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const handleScroll = () => {
      const html = document.documentElement;
      const scrollTop = html.scrollTop;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (images[frameIndex] && images[frameIndex].complete) {
          context.drawImage(images[frameIndex], 0, 0);
        }
      }

      // Update active section based on scroll
      const sections = ['home', 'benefits', 'recipes', 'how-to-eat'];
      const sectionHeight = maxScrollTop / sections.length;
      const currentIndex = Math.min(
        sections.length - 1,
        Math.floor(scrollTop / sectionHeight)
      );
      setActiveSection(sections[currentIndex]);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">RubyJewel</div>
        <div className="nav-links">
          {['home', 'benefits', 'recipes', 'how-to-eat'].map((item) => (
            <button
              key={item}
              className={`nav-btn ${activeSection === item ? 'active' : ''}`}
              onClick={() => scrollTo(item)}
            >
              {item.replace(/-/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      <div className="scroll-container">
        <canvas ref={canvasRef} id="pomegranate-anim"></canvas>
      </div>

      <div className="content">
        <div className="text-section" id="home">
          <h1>The Pomegranate</h1>
          <p>Nature's ruby jewel. Discover the magic inside.</p>
        </div>
        
        <div className="text-section" id="benefits">
          <h1>Incredible Benefits</h1>
          <p>A powerhouse of nutrients for your body and mind.</p>
          <div className="card-container">
            <div className="glass-card">
              <h3>Heart Health</h3>
              <p>Lowers blood pressure and protects arteries.</p>
            </div>
            <div className="glass-card">
              <h3>Antioxidants</h3>
              <p>Contains 3x more antioxidants than green tea.</p>
            </div>
            <div className="glass-card">
              <h3>Memory</h3>
              <p>Improves cognitive function and memory retention.</p>
            </div>
          </div>
        </div>

        <div className="text-section" id="recipes">
          <h1>Culinary Magic</h1>
          <p>Elevate your dishes with a burst of flavor and color.</p>
          <div className="card-container">
            <div className="glass-card">
              <h3>Ruby Red Salad</h3>
              <p>Mix arils with spinach, feta, and walnuts.</p>
            </div>
            <div className="glass-card">
              <h3>Fresh Juice</h3>
              <p>Cold-pressed for a refreshing morning start.</p>
            </div>
            <div className="glass-card">
              <h3>Molasses Glaze</h3>
              <p>Perfect sweet & sour reduction for roasted meats.</p>
            </div>
          </div>
        </div>

        <div className="text-section" id="how-to-eat">
          <h1>How to Eat</h1>
          <p>No mess, just pure enjoyment.</p>
          <ol className="steps-list">
            <li><strong>Score:</strong> Cut a shallow circle around the crown.</li>
            <li><strong>Pop:</strong> Remove the crown and score along the natural ridges.</li>
            <li><strong>Submerge:</strong> Open it in a bowl of water—arils sink, pith floats!</li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default App;
