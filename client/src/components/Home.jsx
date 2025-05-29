import React, { useState, useEffect } from 'react'

function Home() {
  const slides = [
    {
      src: '/assets/image1.png',
      alt: 'Draft Your Dream Team',
      caption: 'Pick the best players from top leagues and showcase your football knowledge.',
    },
    {
      src: '/assets/image2.jpg',
      alt: 'Compete with Friends',
      caption: 'Join private leagues, challenge your rivals, and fight for the top spot.',
    },
    {
      src: '/assets/image3.jpg',
      alt: 'Track Your Progress',
      caption: 'Follow live matches, track real-time stats, and climb the global leaderboard.',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [slides.length])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    )
  }

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Main carousel container with increased width */}
      <div
        style={{
          width: '95%',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              display: index === currentIndex ? 'block' : 'none',
              textAlign: 'center',
              position: 'relative',
              width: '100%',
              height: '650px', // fixed height for all slides
              overflow: 'hidden', // crop any overflow
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // crops the image from below if needed
              }}
            />
            {/* Caption overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '10px 20px',
                borderRadius: '5px',
              }}
            >
              <h5 style={{ margin: 0 }}>{slide.alt}</h5>
              <p style={{ margin: 0 }}>{slide.caption}</p>
            </div>
          </div>
        ))}

        {/* Previous button (outside the picture, on the left) */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            top: '50%',
            left: '-60px',
            transform: 'translateY(-50%)',
            backgroundColor: '#6c757d',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            opacity: 0.8,
          }}
        >
          &#10094;
        </button>

        {/* Next button (outside the picture, on the right) */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-60px',
            transform: 'translateY(-50%)',
            backgroundColor: '#6c757d',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            opacity: 0.8,
          }}
        >
          &#10095;
        </button>
      </div>
    </div>
  )
}

export default Home
