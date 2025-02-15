/**
 * External Dependencies
 */
import clsx from 'clsx';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';


const BlockListBlockWithIO = ({ 
    BlockListBlock, 
    revealClasses, 
    revealStyles, 
    ...props 
}) => {

    const {
        attributes,
        className,
        isSelected
    } = props;

    const { revealControls } = attributes;

    // Create a local state to track visibility
    const [isInView, setIsInView] = useState(false);
    const [isPermanentVisible, setIsPermanentVisible] = useState(false);

    // Create a ref to attach to the block's DOM element
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!revealControls?.effect) return;

        // Setup intersection observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (revealControls.permanent) setIsPermanentVisible(true);
                    } else {
                        setIsInView(false);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (wrapperRef.current) observer.observe(wrapperRef.current);

        // Cleanup observer on unmount
        return () => {
            if (wrapperRef.current) observer.unobserve(wrapperRef.current);
            observer.disconnect();
        };
    }, [revealControls?.permanent]);

    if (isInView || (revealControls?.['permanent'] && isPermanentVisible)) {
        revealClasses.push('is-visible');
    }

    return (
        <div className="tzm-block-reveal-wrapper_io-preview" ref={wrapperRef}>
            <BlockListBlock
                {...props}
                className={clsx(className, revealClasses)}
                wrapperProps={{ ...props.wrapperProps, style: revealStyles }}
            />
        </div>
    );
};

export default BlockListBlockWithIO;