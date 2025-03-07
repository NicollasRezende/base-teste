/**
 * Living Stone Hotel - Scripts principais
 * 
 * Este arquivo contém os scripts essenciais para o funcionamento
 * da interface do site do Living Stone Hotel.
 * 
 * Funcionalidades incluídas:
 * - Menu mobile responsivo
 * - Animações de navegação
 * - Efeitos de rolagem
 * - Destaque de links ativos
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // ======================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const body = document.body;
    const header = document.querySelector('.header-main');
    const sections = document.querySelectorAll('section[id]');
    
    // ======================================================
    // CRIAÇÃO DO OVERLAY PARA O MENU MOBILE
    // ======================================================
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    // ======================================================
    // CONTROLE DO MENU MOBILE
    // ======================================================
    
    /**
     * Manipula o clique no botão hamburger
     * - Alterna classes ativas
     * - Bloqueia rolagem do body quando menu está aberto
     * - Anima os itens do menu com delay incremental
     */
    hamburger.addEventListener('click', function() {
        // Alterna classes ativas
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        
        // Anima os itens do menu individualmente com delay
        if (navLinks.classList.contains('active')) {
            // Resetar animações
            navItems.forEach(item => {
                item.classList.remove('visible');
                // Força um reflow para resetar a animação
                void item.offsetWidth;
            });
            
            // Adicionar animações com delay sequencial
            navItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100 * index);
            });
        }
    });
    
    /**
     * Fecha o menu mobile ao clicar em um item de navegação
     */
    navItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });
    
    /**
     * Fecha o menu mobile ao clicar no overlay de fundo
     */
    overlay.addEventListener('click', closeMenu);
    
    /**
     * Função para fechar o menu mobile
     * - Remove classes ativas
     * - Permite rolagem do body novamente
     */
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
    
    // ======================================================
    // EFEITOS DE ROLAGEM
    // ======================================================
    
    /**
     * Adiciona classe 'scrolled' ao header quando a página é rolada
     * para aplicar estilo compacto
     */
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    /**
     * Destaca o link de navegação correspondente à seção atual
     * baseado na posição de rolagem da página
     */
    function highlightNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            // Ajustar offset para melhor detecção da seção atual
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Verificar se a posição de rolagem está dentro da seção atual
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover classe 'active' de todos os links de navegação
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adicionar classe 'active' ao link correspondente à seção atual
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Executar verificação de links ativos durante a rolagem
    window.addEventListener('scroll', highlightNavLink);
    
    // ======================================================
    // EFEITO DE ESCONDER/MOSTRAR O HEADER DURANTE ROLAGEM
    // ======================================================
    
    let lastScrollTop = 0; // Guarda a última posição de rolagem
    
    /**
     * Controla a visibilidade do header durante a rolagem
     * - Esconde ao rolar para baixo
     * - Mostra ao rolar para cima
     */
    function handleNavVisibility() {
        const currentScrollTop = window.scrollY;
        
        // Não aplicar o efeito quando o menu mobile está aberto
        if (navLinks.classList.contains('active')) return;
        
        // Aplicar efeito apenas após rolar uma certa distância
        if (currentScrollTop > 200) {
            if (currentScrollTop > lastScrollTop) {
                // Rolando para baixo - esconder o header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Rolando para cima - mostrar o header
                header.style.transform = 'translateY(0)';
            }
        } else {
            // Próximo ao topo - sempre mostrar o header
            header.style.transform = 'translateY(0)';
        }
        
        // Atualizar posição de rolagem para próxima verificação
        lastScrollTop = currentScrollTop;
    }
    
    // Executar verificação de visibilidade do header durante a rolagem
    window.addEventListener('scroll', handleNavVisibility);
});