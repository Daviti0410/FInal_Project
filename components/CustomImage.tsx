"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

function CustomImage() {
    const slides = [
        "https://thumbs.dreamstime.com/b/rear-view-young-family-looking-their-new-home-their-real-estate-purchase-stock-photo-rear-view-333674030.jpg?w=992",
        "https://thumbs.dreamstime.com/b/beautiful-living-room-interior-new-luxury-home-open-concept-floor-plan-shows-kitchen-dining-wall-windows-amazing-332023042.jpg?w=768",
        "https://thumbs.dreamstime.com/b/concept-housing-relocation-happy-family-mother-father-kids-roof-home-concept-housing-relocation-happy-141599827.jpg?w=768",
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative w-[980px] rounded-xl overflow-hidden">
            <div
                className="flex transition-transform  duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((image, index) => (
                    <div key={index} className="flex-none w-full h-[400px] relative">
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CustomImage;
