import { useState, useEffect } from "react";

export const useImagePreloader = (
    sequencePath: string,
    frameCount: number,
    filenamePrefix: string = "ezgif-frame-"
) => {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const frameIndex = i.toString().padStart(3, "0");
            img.src = `/${sequencePath}/${filenamePrefix}${frameIndex}.jpg`;

            img.onload = () => {
                loadedCount++;
                setProgress(Math.round((loadedCount / frameCount) * 100));
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };

            img.onerror = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };

            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [sequencePath, frameCount, filenamePrefix]);

    return { images, isLoaded, progress };
};
