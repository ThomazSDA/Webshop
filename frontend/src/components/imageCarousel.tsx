import { useEffect, useState } from "react";
import { images } from "./imageSet";
import "../styles/imageCarousel.css"
import { useNavigate } from "react-router";

interface ImageCarouselProps {
    currentImageIndex: number;
    setCurrentImageIndex: (currentImageIndex: number) => void;
}

const ImageCarousel = ({ currentImageIndex, setCurrentImageIndex}: ImageCarouselProps) => {

    const [shuffledImages, setShuffledImages] = useState(images);
    const navigate = useNavigate();
    const [paused, setPaused] = useState(false);

    const shuffleArray = <T,>(array: T[]) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        setShuffledImages(shuffleArray(images));
    }, []);

    const handlePreviousClick = () => {
        setCurrentImageIndex(
            currentImageIndex === 0 ? shuffledImages.length - 1 : currentImageIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentImageIndex((currentImageIndex + 1) % shuffledImages.length);
    };
    
    useEffect(() => {
        if (paused) return;
        const timer = setTimeout(() => {
            handleNextClick();
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentImageIndex, paused]);

    return (
        <section>
            <h2>React Image Carousel</h2>

            <div
                className="image-container"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                >
                <button className="nav-button left" onClick={handlePreviousClick}>&lt;</button>

                {shuffledImages.map((image, index) => (
                    <img
                        src={image.url}
                        alt="images"
                        className={ currentImageIndex === index ? 'block' : 'hidden'}
                        style={{ cursor: "pointer" }}
                        key={image.id}
                        onClick={() => navigate(`/products/${image.productId}`)}
                    />    
                ))}

                <button className="nav-button right" onClick={handleNextClick}>&gt;</button>
            </div>
        
        </section>
    )
}

export default ImageCarousel;