// WordPress dependencies
import domReady from '@wordpress/dom-ready';

const tzmRevealBlockControls = {
    init: function() {
        if ( 'IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: "0px",
                threshold: 0
            }

            var els = document.querySelectorAll('[class*="tzm-reveal"]');
            var io = new IntersectionObserver( this.ioCallback, options );

            console.log('Block Reveal els:', els);
            
            // Start observing an element
            els.forEach(item => {
                io.observe( item );
            });

        // If IntersectionObserver not supported
        } else if ( els ) {
            console.warn('Your browser does not support IntersectionObserver.');
            els.forEach(item => {
                item.classList.add("visible");
            });
        }
        
    },

    ioCallback: function(entries, observer) {
        entries.forEach(function(entry) {
            var item = entry.target;
            
            // Element is in viewport
            if ( entry.isIntersecting ) {
                item.classList.add("visible");
            }
            // Element is not in viewport
            else if (!item.classList.contains('tzm-reveal__permanent')) {
                item.classList.remove("visible");
            }
        });
    },
};

domReady( function () {
    tzmRevealBlockControls.init();
} );
