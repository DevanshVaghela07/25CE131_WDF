(function () {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const chev = btn.querySelector('.chev');
        btn.addEventListener('click', () => toggle());
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
        function toggle() {
            const open = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!open));
            answer.classList.toggle('open', !open);
            answer.setAttribute('aria-hidden', String(open));
            chev.classList.toggle('open', !open);
            // set max-height dynamically for smooth transition (works with variable content)
            if (!open) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        }
    });
})();