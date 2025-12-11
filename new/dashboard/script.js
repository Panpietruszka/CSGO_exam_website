
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


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




const sekcje = document.querySelectorAll('.section-content');
const kontenerKropek = document.getElementById('nawigacja-kropki');
const liniaAktywna = document.getElementById('linia-aktywna');
let isScrollingByClick = false; 

const opcjeObservera = {
    root: null, 
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
        liniaAktywna.style.transition = 'top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
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


window.onload = async function () {
    
    await initializeFirebase();

    
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
};