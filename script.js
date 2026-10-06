// Elementos do DOM
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Array de seções para navegação
const sectionIds = Array.from(sections).map(section => section.id);
let currentSectionIndex = 0;

// Atualizar barra de progresso
function updateProgressBar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
}

// Atualizar link ativo na navegação
function updateActiveLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Atualizar índice atual
    currentSectionIndex = sectionIds.indexOf(currentSection);
}

// Navegação suave
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botão anterior
prevBtn.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Botão próximo
nextBtn.addEventListener('click', () => {
    if (currentSectionIndex < sectionIds.length - 1) {
        currentSectionIndex++;
        const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Modo tela cheia
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Erro ao entrar em tela cheia:', err);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        document.body.classList.add('presentation-mode');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            document.body.classList.remove('presentation-mode');
        }
    }
});

// Detectar saída de tela cheia
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        document.body.classList.remove('presentation-mode');
    }
});

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    // Seta para baixo ou PageDown
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSectionIndex < sectionIds.length - 1) {
            currentSectionIndex++;
            const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Seta para cima ou PageUp
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Tecla Home - vai para o início
    if (e.key === 'Home') {
        e.preventDefault();
        currentSectionIndex = 0;
        const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Tecla End - vai para o final
    if (e.key === 'End') {
        e.preventDefault();
        currentSectionIndex = sectionIds.length - 1;
        const targetSection = document.getElementById(sectionIds[currentSectionIndex]);
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Tecla F - tela cheia
    if (e.key === 'f' || e.key === 'F') {
        fullscreenBtn.click();
    }
});

// Event listeners para scroll
window.addEventListener('scroll', () => {
    updateProgressBar();
    updateActiveLink();
    updateNavigationButtons();
});

// Atualizar estado dos botões de navegação
function updateNavigationButtons() {
    // Desabilitar botão anterior se estiver na primeira seção
    if (currentSectionIndex === 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    // Desabilitar botão próximo se estiver na última seção
    if (currentSectionIndex === sectionIds.length - 1) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Animações ao rolar
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos que devem animar
const animatedElements = document.querySelectorAll(
    '.intro-card, .feature-card, .extraction-step, .advantage-card, ' +
    '.disadvantage-card, .producer-item, .brazil-card, .env-card, ' +
    '.source-item, .stat-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animar barras de comparação
const comparisonBars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fillBar 1.5s ease forwards';
        }
    });
}, { threshold: 0.5 });

comparisonBars.forEach(bar => {
    barObserver.observe(bar);
});

// Animar barras de produtores
const producerBars = document.querySelectorAll('.producer-fill');
const producerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        }
    });
}, { threshold: 0.5 });

producerBars.forEach(bar => {
    producerObserver.observe(bar);
});

// Contador animado para números
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observar números para animar
const statNumbers = document.querySelectorAll('.stat-number');
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const text = entry.target.textContent;
            const number = parseFloat(text.replace(/[^\d.]/g, ''));
            
            if (!isNaN(number)) {
                let current = 0;
                const duration = 2000;
                const increment = number / (duration / 16);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        entry.target.textContent = text;
                        clearInterval(timer);
                    } else {
                        if (text.includes('.')) {
                            entry.target.textContent = text.replace(/[\d.]+/, current.toFixed(1));
                        } else {
                            entry.target.textContent = text.replace(/\d+/, Math.floor(current));
                        }
                    }
                }, 16);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => {
    numberObserver.observe(num);
});

// Smooth scroll para botão "COMEÇAR APRESENTAÇÃO"
const heroBtn = document.querySelector('.hero-btn');
if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = heroBtn.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Efeito parallax no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Indicador de scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Ocultar navbar ao rolar para baixo, mostrar ao rolar para cima
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Rolando para baixo
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Rolando para cima
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}, false);

// Hover nos cards com efeito 3D
const cards = document.querySelectorAll('.feature-card, .advantage-card, .disadvantage-card, .brazil-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar();
    updateActiveLink();
    updateNavigationButtons();
    
    // Adicionar classe de carregamento concluído
    document.body.classList.add('loaded');
    
    console.log('Site sobre Gás Natural carregado com sucesso!');
    console.log('Navegação: Use as setas do teclado, PageUp/PageDown, ou os botões na tela');
    console.log('Tela cheia: Pressione F ou clique no botão no canto superior direito');
});

// Prevenir zoom acidental em apresentação
document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

// Avisar quando sair do site
window.addEventListener('beforeunload', (e) => {
    if (currentSectionIndex > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
