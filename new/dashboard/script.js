// --- LOGIKA DYNAMIC ISLAND ---
const island = document.getElementById('island');
const islandContent = document.getElementById('island-content');
let islandHideTimeout = null;
let currentIslandStateKey = 'idle'; // Śledzenie bieżącego stanu
let aktywnaSekcjaId = ''; // Zmienna śledząca aktywną sekcję, używana do powrotu z hover

// Wszystkie możliwe klasy rozmiaru i zaokrąglenia dla Wyspy
const ALL_ISLAND_CLASSES = ['w-alert', 'h-alert', 'rounded-alert', 'w-music', 'h-music', 'rounded-music', 'w-small-info', 'justify-content-center', 'justify-content-between'];


/**
 * Ustawia stan Wyspy na podstawie klucza.
 * @param {string} stateKey Klucz stanu ('idle', 'music', 'call', 'section-status', 'small-info', etc.).
 * @param {object} [customState=null] Opcjonalny niestandardowy obiekt stanu.
 * @param {number} [duration=3000] Czas, po jakim stan ma wrócić do 'idle' (0 dla braku powrotu).
 */
function setIslandState(stateKey, customState = null, duration = 3000) {
    if (!island || !islandContent) return;

    // Anuluj poprzedni timeout
    if (islandHideTimeout) {
        clearTimeout(islandHideTimeout);
        islandHideTimeout = null;
    }

    const state = customState || states[stateKey];
    if (!state) {
        if (stateKey !== 'idle') {
            setIslandState('idle');
        }
        return;
    }

    // 1. Ukryj bieżącą zawartość
    islandContent.style.opacity = '0';

    // Oczekiwanie na przejście opacity, aby uniknąć migotania
    setTimeout(() => {
        // 2. Wstaw nową treść i układ
        islandContent.innerHTML = state.contentHTML;

        // 3. Zresetowanie i dodanie klas rozmiaru/zaokrąglenia
        island.classList.remove('island-default', ...ALL_ISLAND_CLASSES);
        islandContent.classList.remove('justify-content-center', 'justify-content-between');

        // Klasy są pobierane ze stanu (customState ma priorytet)
        const widthClass = customState ? customState.widthClass : states[stateKey].widthClass;
        const heightClass = customState ? customState.heightClass : states[stateKey].heightClass;
        const roundedClass = customState ? customState.roundedClass : states[stateKey].roundedClass;
        const justifyClass = customState ? customState.justifyClass : states[stateKey].justifyClass;

        island.classList.add(widthClass, heightClass, roundedClass);
        islandContent.classList.add(justifyClass);

        // Specjalne obsługa dla stanu 'idle' (domyślny styl)
        if (stateKey === 'idle') {
            island.classList.add('island-default');
        } else {
            // 4. Ujawnienie nowej treści po minimalnym opóźnieniu (50ms)
            setTimeout(() => {
                islandContent.style.opacity = '1';
            }, 50);

            // Ustaw automatyczny powrót
            if (duration > 0) {
                islandHideTimeout = setTimeout(() => {
                    setIslandState('idle');
                }, duration);
            }
        }

        currentIslandStateKey = stateKey;
    }, 200); // Czas musi być dopasowany do transition: opacity 0.2s w CSS
}


// Definicja różnych stanów Wyspy
const states = {
    // A. Stan bezczynności: mała pigułka
    'idle': {
        widthClass: 'island-default',
        heightClass: 'island-default',
        roundedClass: 'rounded-full',
        justifyClass: 'justify-content-center',
        contentHTML: '',
    },
    // B. Stan odtwarzania muzyki (Przykład statycznego stanu)
    'music': {
        widthClass: 'w-music',
        heightClass: 'h-music',
        roundedClass: 'rounded-music',
        justifyClass: 'justify-content-between',
        contentHTML: `
            <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a2 2 0 002-2V3zm-2 16h-3V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v14H4V3h12v16z"/>
                </svg>
                <span class="text-xs">U2 - Where The...</span>
            </div>
            <div class="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
            </div>
        `,
    },
    // C. Stan powiadomienia (dynamiczny, przyjmuje wiadomość) - Full size
    'call': (message, iconClass = 'text-green-400', endIconHTML = '') => ({
        widthClass: 'w-alert',
        heightClass: 'h-alert',
        roundedClass: 'rounded-alert',
        justifyClass: 'justify-content-between',
        contentHTML: `
            <div class="flex items-center space-x-2 max-w-[450px] force-wrap">
                <svg class="w-4 h-4 ${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">${message}</span>
            </div>
            ${endIconHTML}
        `,
    }),
    // D. Stan do wyświetlania informacji o sekcji (dynamiczny) - Medium size
    'section-status': (sectionName) => ({
        widthClass: 'w-music',
        heightClass: 'h-music',
        roundedClass: 'rounded-music',
        justifyClass: 'justify-content-center',
        contentHTML: `
            <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.636a2 2 0 01-1.789-2.894l3.5-7zM7 9H3v5h4V9z"/>
                </svg>
                <span class="text-xs font-semibold text-white">Sekcja: ${sectionName}</span>
            </div>
        `,
    }),
    // E. Stan dla małych, szybkich informacji (Hover/Przycisk) - Small size
    'small-info': (infoText, iconHTML) => ({
        widthClass: 'w-small-info',
        heightClass: 'h-music',
        roundedClass: 'rounded-music',
        justifyClass: 'justify-content-center',
        contentHTML: `
            <div class="flex items-center space-x-2">
                ${iconHTML}
                <span class="text-xs text-white force-wrap">${infoText}</span>
            </div>
        `,
    }),
};


// --- LOGIKA BOCZNEGO MENU (HAMBURGER) ---

const triggers = document.querySelectorAll('.menu-trigger');
const sideMenu = document.getElementById('sideMenu');
const activeClass = 'active';
const openClass = 'open';

triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
        // 1. Przełącza klasę 'active' na przycisku (animacja X)
        e.currentTarget.classList.toggle(activeClass);

        // 2. Przełącza klasę 'open' na elemencie menu (wysuwanie/wsuwanie)
        sideMenu.classList.toggle(openClass);
    });
});

// Dodatkowa obsługa: zamknij menu boczne po kliknięciu linku
if (sideMenu) {
    const navLinks = sideMenu.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove(openClass);
            triggers.forEach(trigger => trigger.classList.remove(activeClass));
        });
    });
}

// --- LOGIKA MENU USTAWIEŃ (SETTINGS DROPDOWN) I MOTYWU ---

const settingsIcon = document.getElementById('settings-icon');
const settingsDropdown = document.getElementById('settings-dropdown');
const changeThemeLi = document.getElementById('change-theme-li');
const logoutLink = settingsDropdown ? settingsDropdown.querySelector('#logout-link') : null;
const dropdownActiveClass = 'active';

/**
 * Zmienia atrybut 'src' ikony ustawień w zależności od aktywnego motywu.
 * @param {boolean} isDark - Czy aktywny jest ciemny motyw.
 */
function updateSettingsIcon(isDark) {
    if (settingsIcon && settingsIcon.tagName === 'IMG') {
        settingsIcon.src = isDark ? '../icons/settings-light.png' : '../icons/settings-dark.png';
    }
}

/**
 * Zwraca HTML ikony dla motywu (słońce/księżyc).
 */
function getThemeIconHTML(isDark) {
    const iconPath = isDark ?
        'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' :
        'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';

    const colorClass = isDark ? 'text-yellow-400' : 'text-blue-400';

    return `
        <svg class="w-4 h-4 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/>
        </svg>
    `;
}

/**
 * Przełącza motyw jasny/ciemny i zapisuje preferencje w Local Storage.
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    updateSettingsIcon(isDark);

    const themeText = isDark ? 'Zmień na Jasny' : 'Zmień na Ciemny';
    if (changeThemeLi) {
        changeThemeLi.querySelector('a').textContent = themeText;
        monitorIslandInfo(changeThemeLi.querySelector('a'), 'Zmiana motywu', getThemeIconHTML(isDark));
    }

    // LOGIKA DYNAMIC ISLAND
    const islandMessage = isDark ? 'Aktywowano ciemny motyw' : 'Aktywowano jasny motyw';
    const themeIcon = getThemeIconHTML(isDark);

    setIslandState('small-info', states['small-info'](islandMessage, themeIcon), 2500);

    document.dispatchEvent(new Event('theme-changed'));
}

/**
 * Ładuje preferowany motyw przy starcie.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let shouldBeDark = (savedTheme === 'dark') || (savedTheme === null && prefersDark);

    if (shouldBeDark) {
        document.body.classList.add('dark-theme');
    }

    const isDark = document.body.classList.contains('dark-theme');

    updateSettingsIcon(isDark);

    const themeText = isDark ? 'Zmień na Jasny' : 'Zmień na Ciemny';
    if (changeThemeLi) {
        changeThemeLi.querySelector('a').textContent = themeText;
    }
}

if (settingsIcon && settingsDropdown) {
    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle(dropdownActiveClass);
    });

    document.addEventListener('click', (e) => {
        if (!settingsDropdown.contains(e.target) && e.target !== settingsIcon) {
            settingsDropdown.classList.remove(dropdownActiveClass);
        }
    });

    if (changeThemeLi) {
        changeThemeLi.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
            settingsDropdown.classList.remove(dropdownActiveClass);
        });
    }

    // Obsługa kliknięcia "Wyloguj"
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault(); // Zatrzymujemy domyślną akcję linku

            // Definicja ikony wylogowania
            const logoutIconHTML = `
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
            `;

            // LOGIKA DYNAMIC ISLAND: Komunikat po kliknięciu
            setIslandState('small-info', states['small-info']('Trwa wylogowywanie... 🏃', logoutIconHTML), 2000);

            // === POPRAWKA LOGIKI WYLOGOWANIA ===
            setTimeout(() => {
                // Pobieramy ścieżkę z atrybutu href linku
                const logoutUrl = logoutLink.href;

                // Faktyczne przekierowanie do skryptu PHP, który niszczy sesję
                window.location.href = logoutUrl;

                // Ustawienia nie są już potrzebne, bo nastąpi przekierowanie
                settingsDropdown.classList.remove(dropdownActiveClass);
            }, 500);
            // ===================================
        });
    }
}


// --- LOGIKA NAWIGACJI KROPKOWEJ I SCROLLA ---

const sekcje = document.querySelectorAll('.section-content');
const kontenerKropek = document.getElementById('nawigacja-kropki');
const liniaAktywna = document.getElementById('linia-aktywna');
let isScrollingByClick = false;

const opcjeObservera = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.5, 1.0]
};

let ostatniaAktywnaKropka = null;

/**
 * Funkcja do przewijania do danej sekcji po kliknięciu kropki
 * @param {string} id - ID sekcji docelowej (np. 'sekcja-1')
 */
function przewinDoSekcji(id) {
    const sekcja = document.getElementById(id);
    if (sekcja) {

        aktualizujKropki(id);

        isScrollingByClick = true;

        sekcja.scrollIntoView({ behavior: 'smooth' });


        let scrollTimeout;
        const scrollStopHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrollingByClick = false;
                window.removeEventListener('scroll', scrollStopHandler);

            }, 150);
        };
        window.addEventListener('scroll', scrollStopHandler);
    }
}

/**
 * Aktualizuje klasę 'aktywna' dla kropek ORAZ animuje linię łączącą
 * @param {string} id - ID aktywnej sekcji
 */
function aktualizujKropki(id) {

    if (aktywnaSekcjaId === id) return;

    const nowaAktywnaKropka = document.querySelector(`.kropka[data-sekcja="${id}"]`);


    document.querySelectorAll('.kropka').forEach(kropka => {
        kropka.classList.remove('aktywna');
    });

    if (nowaAktywnaKropka) {
        nowaAktywnaKropka.classList.add('aktywna');

        // LOGIKA DYNAMIC ISLAND (Status sekcji)
        const sekcjaElement = document.getElementById(id);
        const sectionName = sekcjaElement ? sekcjaElement.dataset.nazwa || sekcjaElement.id : 'Nieznana sekcja';

        // Wyświetlaj status sekcji tylko, jeśli nie ma aktywnego powiadomienia lub hovera
        if (currentIslandStateKey === 'idle' || currentIslandStateKey === 'section-status') {
            setIslandState('section-status', states['section-status'](sectionName), 1500); // Krótkie powiadomienie
        }

        if (ostatniaAktywnaKropka) {
            animujLinieLaczaca(ostatniaAktywnaKropka, nowaAktywnaKropka);
        } else {
            ustawLinieNaStarcie(nowaAktywnaKropka);
        }

        ostatniaAktywnaKropka = nowaAktywnaKropka;
        aktywnaSekcjaId = id;
    }
}

/**
 * Animuje linię, tworząc płynne przejście między kropkami.
 */
function animujLinieLaczaca(startKropka, endKropka) {
    const kontenerRect = kontenerKropek.getBoundingClientRect();


    const startY = startKropka.getBoundingClientRect().top - kontenerRect.top + (startKropka.offsetHeight / 2);
    const endY = endKropka.getBoundingClientRect().top - kontenerRect.top + (endKropka.offsetHeight / 2);

    const height = Math.abs(startY - endY);
    const kropkaHeight = endKropka.offsetHeight;


    if (endY > startY) {

        liniaAktywna.style.height = `${height + kropkaHeight}px`;
        liniaAktywna.style.top = `${startY - kropkaHeight / 2}px`;


        setTimeout(() => {
            liniaAktywna.style.height = `${kropkaHeight}px`;
            liniaAktywna.style.top = `${endY - kropkaHeight / 2}px`;
        }, 100);

    } else {

        liniaAktywna.style.height = `${height + kropkaHeight}px`;
        liniaAktywna.style.top = `${endY - kropkaHeight / 2}px`;

        setTimeout(() => {
            liniaAktywna.style.height = `${kropkaHeight}px`;
            liniaAktywna.style.top = `${endY - kropkaHeight / 2}px`;
        }, 100);
    }
}

/**
 * Ustawia linię aktywną na pozycji pierwszej aktywnej kropki bez animacji.
 */
function ustawLinieNaStarcie(aktywnaKropka) {

    liniaAktywna.style.transition = 'none';

    const kontenerTop = kontenerKropek.getBoundingClientRect().top;
    const y = aktywnaKropka.getBoundingClientRect().top - kontenerTop + (aktywnaKropka.offsetHeight / 2);

    liniaAktywna.style.top = `${y - aktywnaKropka.offsetHeight / 2}px`;
    liniaAktywna.style.height = `${aktywnaKropka.offsetHeight}px`;


    setTimeout(() => {
        liniaAktywna.style.transition = 'top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background-color 0.5s ease';
    }, 50);
}

/**
 * Callback dla IntersectionObserver
 */
const observerCallback = (entries) => {
    if (isScrollingByClick) return;


    const intersectingEntries = entries.filter(entry => entry.isIntersecting);

    if (intersectingEntries.length === 0) {
        return;
    }


    let closestEntry = null;
    let minTop = Infinity;


    intersectingEntries.forEach(entry => {
        const rect = entry.target.getBoundingClientRect();


        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (rect.top < minTop) {
                minTop = rect.top;
                closestEntry = entry;
            }
        }
    });

    if (closestEntry) {
        aktualizujKropki(closestEntry.target.id);
    }
};


/**
 * Generuje kropki nawigacyjne na podstawie istniejących sekcji
 */
function generujKropki() {
    sekcje.forEach((sekcja, index) => {
        const kropka = document.createElement('div');
        kropka.classList.add('kropka');
        kropka.setAttribute('data-sekcja', sekcja.id);
        kropka.setAttribute('title', sekcja.dataset.nazwa || `Sekcja ${index + 1}`);


        kropka.addEventListener('click', () => {
            przewinDoSekcji(sekcja.id);
        });

        kontenerKropek.appendChild(kropka);
    });

    if (sekcje.length > 0) {
        aktualizujKropki(sekcje[0].id);
    }
}


// --- LOGIKA MONITOROWANIA HOVER I FOCUS DLA DYNAMIC ISLAND ---

/**
 * Obsługuje zdarzenia najazdu/skupienia i wyświetla informacje w Dynamic Island.
 * @param {HTMLElement} element Element do monitorowania.
 * @param {string} info Wiadomość do wyświetlenia.
 * @param {string} iconHTML HTML ikony do wyświetlenia.
 */
function monitorIslandInfo(element, info, iconHTML) {
    let returnState = 'idle';
    let returnCustomState = null;

    element.addEventListener('mouseenter', () => {

        // Zapisz stan Wyspy przed nadpisaniem
        if (currentIslandStateKey === 'section-status') {
            const sekcjaElement = document.getElementById(aktywnaSekcjaId);
            const sectionName = sekcjaElement ? sekcjaElement.dataset.nazwa || sekcjaElement.id : 'Nieznana sekcja';
            returnState = 'section-status';
            returnCustomState = states['section-status'](sectionName);
        } else {
            returnState = currentIslandStateKey;
            returnCustomState = null;
        }

        // Jeśli jest stan aktywnego powiadomienia (music/call), nie nadpisuj
        if (returnState === 'music' || returnState === 'call') return;

        // NADPISZ stanem małej informacji o hooverze (duration = 0)
        setIslandState('small-info', states['small-info'](info, iconHTML), 0);
    });

    element.addEventListener('mouseleave', () => {

        // Przywróć poprzedni stan (idle, lub sekcja), jeśli nie było aktywnego powiadomienia
        if (returnState !== 'music' && returnState !== 'call') {
            if (returnState === 'section-status') {
                setIslandState('section-status', returnCustomState, 0); // Wróć do sekcji, bez auto-idle
            } else {
                setIslandState('idle');
            }
        }
    });
}

/**
 * Uruchamia monitorowanie dla wszystkich kluczowych elementów interaktywnych.
 */
function startMonitoringInteractiveElements() {
    // Ikona kursora (dla wszystkich interaktywnych elementów)
    const cursorIconHTML = `
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3-3-3m0 0l3-3 3 3m-3 3V3"/>
        </svg>
    `;

    // Ikona Wylogowania
    const logoutIconHTML = `
        <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
    `;

    // 1. Linki nawigacji głównej (Desktop)
    document.querySelectorAll('.main-nav.desktop-nav a').forEach(link => {
        monitorIslandInfo(link, `Przejdź do: ${link.textContent.trim()}`, cursorIconHTML);
    });

    // 2. Przyciski CTA
    document.querySelectorAll('.cta-button, .primary-cta-button').forEach(button => {
        const text = button.textContent.trim().replace(/\s\s+/g, ' ');
        monitorIslandInfo(button, `Akcja: ${text}`, cursorIconHTML);
    });

    // 3. Linki w menu bocznym
    if (sideMenu) {
        sideMenu.querySelectorAll('.main-nav a').forEach(link => {
            monitorIslandInfo(link, `Menu: Przejdź do ${link.textContent.trim()}`, cursorIconHTML);
        });
    }

    // 4. Elementy w dropdownie ustawień
    if (settingsDropdown) {
        // Zmień Motyw
        const themeLink = changeThemeLi.querySelector('a');
        monitorIslandInfo(themeLink, 'Zmiana motywu', getThemeIconHTML(document.body.classList.contains('dark-theme')));

        // Wyloguj
        if (logoutLink) {
            monitorIslandInfo(logoutLink, 'Wylogowanie', logoutIconHTML);
        }
    }
}


// NOWA LOGIKA: Status połączenia internetowego
window.addEventListener('online', () => {
    setIslandState('call', states.call('Jesteś online! 🌐', 'text-green-500', ''), 2000);
});

window.addEventListener('offline', () => {
    setIslandState('call', states.call('Brak połączenia z Internetem ⚠️', 'text-red-500', ''), 5000);
});


window.onload = async function () {

    loadTheme();
    setIslandState('idle'); // Ustaw stan początkowy Wyspy

    // Inicjalizacja monitorowania elementów interaktywnych
    startMonitoringInteractiveElements();

    if (kontenerKropek && sekcje.length > 0) {
        generujKropki();


        const observer = new IntersectionObserver(observerCallback, opcjeObservera);
        sekcje.forEach(sekcja => {
            observer.observe(sekcja);
        });


        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            if (!isScrollingByClick) {
                scrollTimer = setTimeout(() => {

                    const tempEntries = Array.from(sekcje).map(sekcja => ({
                        target: sekcja,
                        isIntersecting: sekcja.getBoundingClientRect().top < window.innerHeight && sekcja.getBoundingClientRect().bottom > 0,
                        boundingClientRect: sekcja.getBoundingClientRect(),
                        intersectionRatio: (Math.min(window.innerHeight, sekcja.getBoundingClientRect().bottom) - Math.max(0, sekcja.getBoundingClientRect().top)) / window.innerHeight
                    }));
                    observerCallback(tempEntries);
                }, 50);
            }
        });


        window.addEventListener('resize', () => {
            const aktywnaKropka = document.querySelector('.kropka.aktywna');
            if (aktywnaKropka) {
                ustawLinieNaStarcie(aktywnaKropka);
            }
        });
    }
};