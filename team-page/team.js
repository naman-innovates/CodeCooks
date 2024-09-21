document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const wrapper = document.querySelector('.wrapper');
    const title = document.querySelector('.title h4');
    const cards = document.querySelectorAll('.card');
    const authLinks = document.querySelector('.auth-links');

    let sidebarOpen = false;
    let transitionTimeout;

    function expandSidebar() {
        sidebarOpen = true;
        clearTimeout(transitionTimeout);
        sidebar.classList.add('expanded');
        wrapper.style.marginLeft = '250px';
        title.style.fontSize = '40px';
        cards.forEach(card => {
            card.style.width = '250px';
            card.style.height = '350px';
        });
    }

    function collapseSidebar() {
        sidebarOpen = false;
        transitionTimeout = setTimeout(() => {
            if (!sidebarOpen) {
                sidebar.classList.remove('expanded');
                wrapper.style.marginLeft = '80px';
                title.style.fontSize = '50px';
                cards.forEach(card => {
                    card.style.width = '300px';
                    card.style.height = '400px';
                });
            }
        }, 300);
    }

    sidebar.addEventListener('mouseenter', expandSidebar);
    sidebar.addEventListener('mouseleave', collapseSidebar);

    // Prevent sidebar from closing when hovering over auth links
    authLinks.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        expandSidebar();
    });

    // Add click event listeners to auth links
    const loginLink = document.querySelector('.auth-link[href="../login/login.html"]');
    const signupLink = document.querySelector('.auth-link[href="../signup/signup.html"]');

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(loginLink.href, '_blank');
    });

    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(signupLink.href, '_blank');
    });
});