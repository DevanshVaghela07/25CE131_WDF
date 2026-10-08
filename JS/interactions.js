(() => {
    "use strict";

    const preferenceKeys = {
        theme: "studenthub-theme",
        noticeDismissed: "studenthub-notice-dismissed",
        faqOpen: "studenthub-faq-open"
    };

    function readPreference(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            console.warn(`Could not read the ${key} preference.`, error);
            return null;
        }
    }

    function writePreference(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            console.warn(`Could not save the ${key} preference.`, error);
        }
    }

    const savedTheme = readPreference(preferenceKeys.theme);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : (systemPrefersDark ? "dark" : "light");
    document.body.dataset.theme = initialTheme;

    const header = document.querySelector("header");
    const navigation = header && header.querySelector("nav");
    if (header && navigation) {
        if (!navigation.id) {
            navigation.id = "site-navigation";
        }

        const menuButton = document.createElement("button");
        menuButton.className = "menu-toggle";
        menuButton.type = "button";
        menuButton.setAttribute("aria-controls", navigation.id);
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰ Menu";
        header.insertBefore(menuButton, navigation);

        menuButton.addEventListener("click", () => {
            const isOpen = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isOpen));
            navigation.classList.toggle("is-open", !isOpen);
            menuButton.textContent = isOpen ? "☰ Menu" : "✕ Close menu";
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰ Menu";
            }
        });

        const controls = document.createElement("div");
        controls.className = "site-controls";

        const themeButton = document.createElement("button");
        themeButton.className = "site-control theme-toggle";
        themeButton.type = "button";
        themeButton.setAttribute("aria-pressed", String(initialTheme === "dark"));

        function updateThemeButton(theme) {
            themeButton.textContent = theme === "dark" ? "Use light theme" : "Use dark theme";
            themeButton.setAttribute("aria-pressed", String(theme === "dark"));
        }

        updateThemeButton(initialTheme);
        themeButton.addEventListener("click", () => {
            const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
            document.body.dataset.theme = nextTheme;
            writePreference(preferenceKeys.theme, nextTheme);
            updateThemeButton(nextTheme);
        });
        controls.append(themeButton);

        const helpButton = document.createElement("button");
        helpButton.className = "site-control";
        helpButton.type = "button";
        helpButton.textContent = "Quick help";
        helpButton.setAttribute("aria-haspopup", "dialog");
        controls.append(helpButton);
        header.append(controls);

        const dialog = document.createElement("dialog");
        dialog.className = "help-dialog";
        dialog.setAttribute("aria-labelledby", "help-dialog-title");
        dialog.innerHTML = `
            <h2 id="help-dialog-title">Need help?</h2>
            <p>Find common answers or contact the StudentHub team.</p>
            <div>
                <a href="faq.html" class="help-dialog-link" style="text-decoration: none; font-family: Times New Roman;">Browse FAQs</a>
                <a href="contact.html" class="help-dialog-contact" style="text-decoration: none; font-family: Times New Roman;">Contact StudentHub support</a>
            </div>
            <button class="help-dialog-close" type="button">Close</button>
        `;
        document.body.append(dialog);
        const closeButton = dialog.querySelector(".help-dialog-close");
        helpButton.addEventListener("click", () => dialog.showModal());
        closeButton.addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        const noticeDismissed = readPreference(preferenceKeys.noticeDismissed) === "true";
        if (!noticeDismissed) {
            const notice = document.createElement("aside");
            notice.className = "site-notice";
            notice.setAttribute("aria-label", "StudentHub tip");
            notice.innerHTML = `
                <p>Need a quick answer? Visit the <a href="faq.html" style="text-decoration: none;">StudentHub FAQ</a>.</p>
                <button class="site-notice-close" type="button" aria-label="Dismiss tip">&times;</button>
            `;
            header.insertAdjacentElement("afterend", notice);
            notice.querySelector("button").addEventListener("click", () => {
                notice.remove();
                writePreference(preferenceKeys.noticeDismissed, "true");
            });
        }
    }

    const slides = Array.from(document.querySelectorAll(".slider-slide"));
    const slider = document.querySelector(".content-slider");
    if (slider && slides.length > 0) {
        const dots = Array.from(slider.querySelectorAll(".slider-dot"));
        const previousButton = slider.querySelector("[data-slide-previous]");
        const nextButton = slider.querySelector("[data-slide-next]");
        let activeSlide = 0;

        function showSlide(index) {
            activeSlide = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeSlide;
                slide.hidden = !isActive;
                slide.setAttribute("aria-hidden", String(!isActive));
                dots[slideIndex].setAttribute("aria-current", String(isActive));
            });
        }

        previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
        nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => showSlide(index));
        });
        showSlide(0);
    }

    const faqButtons = Array.from(document.querySelectorAll(".faq-question"));
    if (faqButtons.length > 0) {
        let savedOpenItems = [];
        const storedFaqItems = readPreference(preferenceKeys.faqOpen);
        if (storedFaqItems) {
            try {
                savedOpenItems = JSON.parse(storedFaqItems);
                if (!Array.isArray(savedOpenItems)) {
                    savedOpenItems = [];
                }
            } catch (error) {
                console.warn("Could not restore the saved FAQ preferences.", error);
            }
        }

        function setFaqExpanded(button, expanded) {
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            const chevron = button.querySelector(".chev");
            if (!answer) {
                return;
            }
            button.setAttribute("aria-expanded", String(expanded));
            answer.setAttribute("aria-hidden", String(!expanded));
            answer.classList.toggle("open", expanded);
            if (chevron) {
                chevron.classList.toggle("open", expanded);
            }
            answer.style.maxHeight = expanded ? `${answer.scrollHeight}px` : "0";
        }

        function saveFaqPreferences() {
            const openIds = faqButtons
                .filter((button) => button.getAttribute("aria-expanded") === "true")
                .map((button) => button.getAttribute("aria-controls"));
            writePreference(preferenceKeys.faqOpen, JSON.stringify(openIds));
        }

        faqButtons.forEach((button) => {
            const answerId = button.getAttribute("aria-controls");
            setFaqExpanded(button, savedOpenItems.includes(answerId));
            button.addEventListener("click", () => {
                const expanded = button.getAttribute("aria-expanded") === "true";
                setFaqExpanded(button, !expanded);
                saveFaqPreferences();
            });
        });

        window.addEventListener("resize", () => {
            faqButtons.forEach((button) => {
                if (button.getAttribute("aria-expanded") === "true") {
                    setFaqExpanded(button, true);
                }
            });
        });
    }
})();
