import { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazyImage = ({
	src,
	alt,
	width = '100%',
	height = 'auto',
	quality = 'medium',
	style = {},
	onClick,
	...props
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const [imageSrc, setImageSrc] = useState('');
	const imgRef = useRef(null);
	const observerRef = useRef(null);

	useEffect(() => {
		// Create intersection observer for lazy loading
		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					// Stop observing once image is in view
					observerRef.current.unobserve(entry.target);
				}
			},
			{
				rootMargin: '50px', // Start loading 50px before image comes into view
				threshold: 0.1,
			}
		);

		if (imgRef.current) {
			observerRef.current.observe(imgRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (isInView && src) {
			// Generate appropriate image size based on quality prop
			let optimizedSrc = src;

			if (src.includes('/uploads/')) {
				const basePath = src.split('/uploads/')[0];
				const filename = src.split('/uploads/')[1];

				// Map quality to size directories
				const sizeMap = {
					thumbnail: '150',
					small: '300',
					medium: '800',
					large: '1200',
					original: '',
				};

				const size = sizeMap[quality] || '800';
				if (size) {
					// Check if filename already has size suffix
					if (
						filename.includes('-150') ||
						filename.includes('-300') ||
						filename.includes('-800') ||
						filename.includes('-1200')
					) {
						// Replace existing size with new size
						const baseName = filename.replace(/-\d+\.(jpg|jpeg|png|gif)$/, '');
						optimizedSrc = `${basePath}/uploads/${size}/${baseName}-${size}.jpg`;
					} else {
						// Add size suffix
						const baseName = filename.replace(/\.(jpg|jpeg|png|gif)$/, '');
						optimizedSrc = `${basePath}/uploads/${size}/${baseName}-${size}.jpg`;
					}
				}
			}

			setImageSrc(optimizedSrc);
		}
	}, [isInView, src, quality]);

	const handleLoad = () => {
		setIsLoaded(true);
	};

	const handleError = () => {
		// Fallback to original image if optimized version fails
		setImageSrc(src);
		setIsLoaded(true);
	};

	return (
		<Box
			ref={imgRef}
			sx={{
				position: 'relative',
				width,
				height,
				overflow: 'hidden',
				...style,
			}}
		>
			{!isLoaded && (
				<Skeleton
					variant='rectangular'
					width='100%'
					height='100%'
					animation='wave'
				/>
			)}

			{isInView && (
				<img
					src={imageSrc}
					alt={alt}
					onLoad={handleLoad}
					onError={handleError}
					onClick={onClick}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						opacity: isLoaded ? 1 : 0,
						transition: 'opacity 0.3s ease',
						cursor: onClick ? 'pointer' : 'default',
						...style,
					}}
					{...props}
				/>
			)}
		</Box>
	);
};

export default LazyImage;
