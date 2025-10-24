const projectMap = {
    'first_login': 'first_login/index.html',
    'second': 'second/index.html',
    '4four': '4four/index.html',
    '6_generator': '6_generator/index.html',
    'menu': 'menu/index.html'
};

document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            const projectPath = projectMap[project];
            
            if (projectPath) {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    window.location.href = projectPath;
                }, 150);
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    projectCards.forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener('mousemove', (e) => {
    const aurora = document.querySelector('.aurora-layer');
    if (!aurora) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    aurora.style.transform = `translate(${mouseX * 20 - 10}px, ${mouseY * 20 - 10}px)`;
});

