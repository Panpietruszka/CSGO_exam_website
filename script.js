// Importy Firebase (wymagane przez środowisko, nawet jeśli nie używamy db)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Zmienne globalne z kontekstu Canvas
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const authToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db;
let auth;

/**
 * Inicjalizuje Firebase (wymagane boilerplate)
 */
async function initializeFirebase() {
    if (Object.keys(firebaseConfig).length === 0) {
        console.warn("Konfiguracja Firebase niedostępna. Pomijanie inicjalizacji.");
        return;
    }

    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Obowiązkowe logowanie
        if (authToken) {
            await signInWithCustomToken(auth, authToken);
            console.log("Zalogowano z tokenem.");
        } else {
            await signInAnonymously(auth);
            console.log("Zalogowano anonimowo.");
        }

    } catch (error) {
        console.error("Błąd inicjalizacji Firebase:", error);
    }
}

// --- Logika Animacji Scrollowania ---

// Zmieniono selektor, aby łapał tylko sekcje, które mają być częścią nawigacji kropkowej
const sekcje = document.querySelectorAll('.sekcja-content');
const kontenerKropek = document.getElementById('nawigacja-kropki');
const liniaAktywna = document.getElementById('linia-aktywna');
let isScrollingByClick = false; // Nowa flaga do blokowania obserwatora podczas kliknięcia

const opcjeObservera = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: [0, 0.5, 1.0]
};

let aktywnaSekcjaId = '';
let ostatniaAktywnaKropka = null;

/**
 * Funkcja do przewijania do danej sekcji po kliknięciu kropki
 * @param {string} id - ID sekcji docelowej (np. 'sekcja-1')
 */
function przewinDoSekcji(id) {
    const sekcja = document.getElementById(id);
    if (sekcja) {
        // 1. Natychmiastowa aktualizacja wizualna KROPEK i LINI
        aktualizujKropki(id);

        isScrollingByClick = true; // Zablokuj obserwatora, aby nie przeszkadzał w animacji scrolla

        sekcja.scrollIntoView({ behavior: 'smooth' });

        // 2. Nasłuchiwanie na koniec smooth scrolla (w celu ODblokowania obserwatora)
        let scrollTimeout;
        const scrollStopHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrollingByClick = false; // Odblokuj obserwatora
                window.removeEventListener('scroll', scrollStopHandler);
                // Po odblokowaniu, IntersectionObserver zajmie się dalszą synchronizacją
            }, 150); // Krótki czas (150ms) na detekcję zatrzymania scrolla
        };
        window.addEventListener('scroll', scrollStopHandler);
    }
}

/**
 * Aktualizuje klasę 'aktywna' dla kropek ORAZ animuje linię łączącą
 * @param {string} id - ID aktywnej sekcji
 */
function aktualizujKropki(id) {
    // Kontynuuj tylko jeśli faktycznie zmieniamy sekcję
    if (aktywnaSekcjaId === id) return;

    const nowaAktywnaKropka = document.querySelector(`.kropka[data-sekcja="${id}"]`);

    // 1. Zmiana aktywnej kropki (usuwanie i dodawanie klasy)
    document.querySelectorAll('.kropka').forEach(kropka => {
        kropka.classList.remove('aktywna');
    });

    if (nowaAktywnaKropka) {
        nowaAktywnaKropka.classList.add('aktywna');

        // 2. Animacja linii łączącej
        if (ostatniaAktywnaKropka) {
            animujLinieLaczaca(ostatniaAktywnaKropka, nowaAktywnaKropka);
        } else {
            // Inicjalizacja linii na starcie
            ustawLinieNaStarcie(nowaAktywnaKropka);
        }

        // 3. Aktualizacja stanów
        ostatniaAktywnaKropka = nowaAktywnaKropka;
        aktywnaSekcjaId = id;
    }
}

/**
 * Animuje linię, tworząc płynne przejście między kropkami.
 */
function animujLinieLaczaca(startKropka, endKropka) {
    const kontenerRect = kontenerKropek.getBoundingClientRect();

    // Obliczenie pozycji Y środka kropki względem kontenera nawigacyjnego
    const startY = startKropka.getBoundingClientRect().top - kontenerRect.top + (startKropka.offsetHeight / 2);
    const endY = endKropka.getBoundingClientRect().top - kontenerRect.top + (endKropka.offsetHeight / 2);

    const height = Math.abs(startY - endY);
    const kropkaHeight = endKropka.offsetHeight;

    // Sprawdzanie kierunku scrollowania/kliknięcia
    if (endY > startY) {
        // Ruch w dół: linia rozciąga się w dół, a następnie kurczy do pozycji nowej kropki
        liniaAktywna.style.height = `${height + kropkaHeight}px`;
        liniaAktywna.style.top = `${startY - kropkaHeight / 2}px`;

        // Używamy setTimeout, aby wymusić ponowne obliczenie i drugą fazę animacji
        setTimeout(() => {
            liniaAktywna.style.height = `${kropkaHeight}px`;
            liniaAktywna.style.top = `${endY - kropkaHeight / 2}px`;
        }, 100);

    } else {
        // Ruch w górę: linia rozciąga się w górę, a następnie kurczy do pozycji nowej kropki
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
    // Wymuszamy brak animacji na starcie
    liniaAktywna.style.transition = 'none';

    const kontenerTop = kontenerKropek.getBoundingClientRect().top;
    const y = aktywnaKropka.getBoundingClientRect().top - kontenerTop + (aktywnaKropka.offsetHeight / 2);

    liniaAktywna.style.top = `${y - aktywnaKropka.offsetHeight / 2}px`;
    liniaAktywna.style.height = `${aktywnaKropka.offsetHeight}px`;

    // Włączenie animacji z powrotem po krótkiej chwili
    setTimeout(() => {
        liniaAktywna.style.transition = 'top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }, 50);
}

/**
 * Callback dla IntersectionObserver
 */
const observerCallback = (entries) => {
    if (isScrollingByClick) return;

    // Filtrujemy tylko sekcje, które są w widoku (przecinają viewport)
    const intersectingEntries = entries.filter(entry => entry.isIntersecting);

    if (intersectingEntries.length === 0) {
        return;
    }

    // Znajdujemy sekcję, która jest najbliżej górnej krawędzi viewportu (lub ją przekroczyła)
    let closestEntry = null;
    let minTop = Infinity;

    // Sprawdzamy wszystkie aktywnie przecinające sekcje
    intersectingEntries.forEach(entry => {
        const rect = entry.target.getBoundingClientRect();

        // Warunek: sekcja jest aktywna, jeśli jej górna krawędź jest w widoku lub lekko poza nim (do góry)
        // i jest najbliżej 0 (góry viewportu).
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

        // Obsługa kliknięcia kropki
        kropka.addEventListener('click', () => {
            przewinDoSekcji(sekcja.id);
        });

        kontenerKropek.appendChild(kropka);
    });
    // Ustawienie pierwszej kropki jako aktywnej na starcie
    if (sekcje.length > 0) {
        aktualizujKropki(sekcje[0].id);
    }
}

// Inicjalizacja po załadowaniu okna
window.onload = async function () {
    // 1. Inicjalizacja Firebase (wymagana)
    await initializeFirebase();

    // 2. Generowanie kropek
    generujKropki();

    // 3. Ustawienie obserwatora
    const observer = new IntersectionObserver(observerCallback, opcjeObservera);
    sekcje.forEach(sekcja => {
        observer.observe(sekcja);
    });

    // 4. Dodatkowe wywołanie aktualizacji przy każdym scrollu, aby wzmocnić działanie (tylko w trybie ręcznego scrolla)
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        if (!isScrollingByClick) {
            scrollTimer = setTimeout(() => {
                // Ręczne wywołanie dla precyzji, gdy scroll jest wolniejszy
                const tempEntries = Array.from(sekcje).map(sekcja => ({
                    target: sekcja,
                    isIntersecting: sekcja.getBoundingClientRect().top < window.innerHeight && sekcja.getBoundingClientRect().bottom > 0,
                    boundingClientRect: sekcja.getBoundingClientRect(),
                    intersectionRatio: (Math.min(window.innerHeight, sekcja.getBoundingClientRect().bottom) - Math.max(0, sekcja.getBoundingClientRect().top)) / window.innerHeight
                }));
                observerCallback(tempEntries);
            }, 50); // Czekamy chwilę, aby uniknąć spamowania w trakcie szybkiego scrolla
        }
    });

    // 5. Ponowne ustawienie obserwatora i linii po zmianie rozmiaru okna
    window.addEventListener('resize', () => {
        const aktywnaKropka = document.querySelector('.kropka.aktywna');
        if (aktywnaKropka) {
            ustawLinieNaStarcie(aktywnaKropka);
        }
    });
};
