tzmRevealBlockControls = {
    init: function() {

        if ( 'IntersectionObserver' in window ) {
            const options = {
                root: null,
                rootMargin: "0px",
                threshold: 0
            }
        
            var els = this.els;
            var io = new IntersectionObserver( this.ioCallback, options );
            
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

    els: document.querySelectorAll('[class*="tzm-reveal"]'),

    ioCallback: function(entries, observer) {
        entries.forEach(function(entry) {
            var item = entry.target;
            
            // Element is in viewport
            if ( entry.isIntersecting ) {
                item.classList.add("visible");

                // Remove IO from items with 'reveal-once'
                if (item.classList.contains('tzm-reveal-once')) {
                    io.unobserve(item);
                }
            }
            // Element is not in viewport
            else if (!item.classList.contains('tzm-reveal-once')) {
                item.classList.remove("visible");
            }
        });
    },
};

tzmRevealBlockControls.init();