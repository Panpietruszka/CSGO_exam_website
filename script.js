const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    const animatedElements = document.querySelectorAll('.section-padding, .data-table, .hero-content');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in'); 
        scrollObserver.observe(el);
    });

});
