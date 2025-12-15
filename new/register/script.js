document.addEventListener('DOMContentLoaded', (event) => {

    // === DEKLARACJA STAŁYCH I ELEMENTÓW DOM ===

    const mainContainer = document.querySelector('main');
    const loginWrapper = document.getElementById('login-form-wrapper');
    const signupWrapper = document.getElementById('signup-form-wrapper');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    const formTitle = document.getElementById('form-title');

    const settingsIcon = document.getElementById('settings-icon');
    const settingsDropdown = document.getElementById('settings-dropdown');

    const changeThemeLi = document.getElementById('change-theme-li');
    const dropdownActiveClass = 'active';

    const textarea = document.getElementById('about-user');
    const additionalInfoSection = document.querySelector('.additional-info');
    const tellAboutSection = document.querySelector('.tell-about-yourself-section');

    const rightWrapper = document.querySelector('.right-side-sections-wrapper');
    const basicDataWrapper = document.querySelector('.basic-data-wrapper');
    const basicDataSection = document.querySelector('.signup-form-main .basic-data');

    // Pobranie referencji do formularzy
    const signupForm = document.querySelector('.signup-form-main');
    const loginForm = document.querySelector('.login-form-main');

    // Ujednolicony przycisk dla rejestracji (założenie: submit-form)
    const submitButton = document.getElementById('submit-form');
    // DEDYKOWANY przycisk dla logowania (założenie: submit-login)
    const submitLoginButton = document.getElementById('submit-login');


    let firstPasswordRawValue = '';
    let isModeNotificationActive = false; // FLAGA: Kontroluje, czy powiadomienie o trybie jest obecnie aktywne

    // =========================================================================
    // === LOGIKA DYNAMICZNEJ WYSPY (NOTIFICATION SYSTEM) ===
    // =========================================================================

    const island = document.getElementById('island');
    const islandContent = document.getElementById('island-content');
    let hideTimeout = null;

    const states = {
        'idle': {
            widthClass: 'w-100px',
            heightClass: 'h-30px',
            roundedClass: 'rounded-full-css',
            contentHTML: '',
            justifyClass: 'justify-center-content',
            duration: 0,
        },
        'error': (message) => ({
            widthClass: 'w-500px',
            heightClass: 'h-40px',
            roundedClass: 'rounded-3xl-css',
            justifyClass: 'justify-between-content',
            duration: 4000,
            contentHTML: `
                <div class="flex items-center space-x-2 max-w-450px force-wrap">
                    <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-xs">${message}</span>
                </div>
                <div class="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
            `,
        }),
        'success': (message) => ({
            widthClass: 'w-500px',
            heightClass: 'h-40px',
            roundedClass: 'rounded-3xl-css',
            justifyClass: 'justify-between-content',
            duration: 3500,
            contentHTML: `
                <div class="flex items-center space-x-2 max-w-450px force-wrap">
                    <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 00-2 0v2a1 1 0 002 0V9zm3 0a1 1 0 00-2 0v2a1 1 0 002 0V9z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs">${message}</span>
                </div>
                <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            `
        }),
        'call': (message) => ({
            widthClass: 'w-500px',
            heightClass: 'h-40px',
            roundedClass: 'rounded-3xl-css',
            justifyClass: 'justify-between-content',
            duration: 5000,
            contentHTML: `
                <div class="flex items-center space-x-2 max-w-450px force-wrap">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12V7h2v5H9zm0 3v2h2v-2H9z" />
                    </svg>
                    <span class="text-xs">${message}</span>
                </div>
                <div class="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            `
        }),
        'music': {
            widthClass: 'w-192px',
            heightClass: 'h-40px',
            roundedClass: 'rounded-3xl-css',
            justifyClass: 'justify-between-content',
            duration: 5000,
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
            `
        },
    };

    function showNotification(type, message = '') {
        if (!island || !islandContent) return;

        const stateFunction = states[type];
        const state = typeof stateFunction === 'function' ? stateFunction(message) : stateFunction;

        if (!state) return;

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        isModeNotificationActive = (type === 'call' && (message.includes('Tryb logowania') || message.includes('Tryb rejestracji')));

        islandContent.style.opacity = '0';

        islandContent.innerHTML = state.contentHTML;

        // 1. Usuwanie starych klas wymiarów i wyrównania
        const allSizeClasses = [
            'w-100px', 'h-30px', 'rounded-full-css',
            'w-500px', 'h-40px', 'rounded-3xl-css',
            'w-192px'
        ];
        const allJustifyClasses = ['justify-center-content', 'justify-between-content'];

        island.classList.remove(...allSizeClasses);
        islandContent.classList.remove(...allJustifyClasses);

        // 2. Dodanie klas dla nowego stanu
        island.classList.add(state.widthClass, state.heightClass, state.roundedClass);
        if (state.justifyClass) {
            islandContent.classList.add(state.justifyClass);
        }

        // 3. Płynne pokazanie zawartości
        setTimeout(() => {
            islandContent.style.opacity = '1';
        }, 150);

        // 4. Ustawienie automatycznego ukrywania
        if (state.duration > 0) {
            hideTimeout = setTimeout(() => {
                isModeNotificationActive = false;
                showNotification('idle');
            }, state.duration);
        }
    }

    // =========================================================================
    // === KONIEC LOGIKI DYNAMICZNEJ WYSPY ===
    // =========================================================================

    // *************************************************************************
    // === OGÓLNA OBSŁUGA ZDARZEŃ (THEME, PRZEŁĄCZANIE, FOCUS) ===
    // *************************************************************************

    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (island && island.contains(target)) {
            return;
        }
        if (target.matches('input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea')) {
            return;
        }
        if (target === switchToLoginBtn || target === switchToSignupBtn || target.closest('.switch-button')) {
            return;
        }
        if (isModeNotificationActive) {
            return;
        }

        showNotification('idle');

        if (settingsDropdown && settingsDropdown.classList.contains(dropdownActiveClass)) {
            settingsDropdown.classList.remove(dropdownActiveClass);
        }
    });

    function adjustBasicDataHeight() {
        if (!rightWrapper || !basicDataWrapper || !signupWrapper) {
            return;
        }

        if (signupWrapper.style.display !== 'none') {
            const rightHeight = rightWrapper.getBoundingClientRect().height;
            const finalHeight = Math.ceil(rightHeight) + 1;
            basicDataWrapper.style.setProperty('--right-height', `${finalHeight}px`);
        } else {
            basicDataWrapper.style.setProperty('--right-height', 'auto');
        }
    }

    function onTextareaResize(event) {
        if (additionalInfoSection) {
            additionalInfoSection.style.height = 'auto';
            requestAnimationFrame(adjustBasicDataHeight);
        }
    }

    function stopTextareaResize(event) {
        document.removeEventListener('mousemove', onTextareaResize);
        document.removeEventListener('mouseup', stopTextareaResize);
        if (additionalInfoSection) {
            additionalInfoSection.style.height = 'auto';
        }
        requestAnimationFrame(adjustBasicDataHeight);
    }
    function startTextareaResize(event) {
        if (event.buttons !== 1) return;

        document.addEventListener('mousemove', onTextareaResize);
        document.addEventListener('mouseup', stopTextareaResize);
    }


    function updateSettingsIcon(isLight) {
        if (settingsIcon && settingsIcon.tagName === 'IMG') {
            settingsIcon.src = isLight ? '../icons/settings-dark.png' : '../icons/settings-light.png';
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateSettingsIcon(isLight);

        const themeText = isLight ? 'Zmień na Ciemny' : 'Zmień na Jasny';
        if (changeThemeLi) {
            const link = changeThemeLi.querySelector('a');
            if (link) link.textContent = themeText;
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        let shouldBeLight = (savedTheme === 'light') || (savedTheme === null && prefersLight);

        if (shouldBeLight) {
            document.body.classList.add('light-theme');
        }

        const isLight = document.body.classList.contains('light-theme');

        updateSettingsIcon(isLight);

        const themeText = isLight ? 'Zmień na Ciemny' : 'Zmień na Jasny';
        if (changeThemeLi) {
            const link = changeThemeLi.querySelector('a');
            if (link) link.textContent = themeText;
        }
    }


    function switchFormMode(mode) {
        if (!loginWrapper || !signupWrapper || !mainContainer || !formTitle) {
            console.error("Brak elementów kontenerów lub tytułu formularzy.");
            return;
        }

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        const message = (mode === 'login')
            ? 'Przełączono: Tryb logowania.'
            : 'Przełączono: Tryb rejestracji.';

        if (mode === 'login') {
            loginWrapper.style.display = 'block';
            signupWrapper.style.display = 'none';

            mainContainer.classList.add('mode-login');
            mainContainer.classList.remove('mode-signup');
            formTitle.innerText = 'Login';

            showNotification('call', message);

        } else if (mode === 'signup') {
            loginWrapper.style.display = 'none';
            signupWrapper.style.display = 'block';

            mainContainer.classList.remove('mode-login');
            mainContainer.classList.add('mode-signup');
            formTitle.innerText = 'Register new user';

            showNotification('call', message);

            setTimeout(adjustBasicDataHeight, 50);
        }

        setTimeout(validateBasicData, 100);
    }


    function checkPasswordStrength(password) {
        let strength = 'weak';
        if (password.length >= 6) strength = 'medium';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
        return strength;
    }

    function updatePasswordColor(inputElement, strength) {
        const isLoginMode = mainContainer && mainContainer.classList.contains('mode-login');
        inputElement.classList.remove('weak', 'medium', 'strong');

        if (isLoginMode) {
            return;
        }

        if (!inputElement.classList.contains('first-password-input')) {
            // Powtarzane hasło
            if (strength === 'strong') {
                inputElement.classList.add('strong');
            } else {
                inputElement.classList.add('weak');
            }

        } else {
            // Pierwsze hasło
            inputElement.classList.add(strength);

            // Wyświetlanie komunikatu o sile hasła
            if (mainContainer && !mainContainer.classList.contains('mode-login') && inputElement === document.activeElement && !isModeNotificationActive) {
                let msg = '';
                if (strength === 'weak' && inputElement.value.length > 0) msg = 'Hasło jest słabe. Użyj min. 8 znaków, dużej litery i cyfry.';
                else if (strength === 'medium') msg = 'Hasło jest średnie. Dodaj więcej znaków i symboli, aby było silne.';
                else if (strength === 'strong') msg = 'Hasło jest silne! Dobra robota.';

                if (msg.length > 0) {
                    showNotification('call', msg);
                }
            }
        }
    }

    function validateBasicData() {
        const isLoginMode = mainContainer && mainContainer.classList.contains('mode-login');

        if (!basicDataSection) {
            return;
        }

        if (isLoginMode || signupWrapper.style.display === 'none') {
            basicDataSection.classList.remove('is-valid');
            return;
        }

        if (isModeNotificationActive) {
            return;
        }

        // Używamy name="user" jako selektora, zakładamy, że to pole nazwy użytkownika
        const usernameInput = document.querySelector('.basic-data .inputField[name="user"]');
        const firstPasswordInput = document.querySelector('.inputField-Password.first-password-input');
        const repeatPasswordInput = document.querySelector('.inputField-Password:not(.first-password-input)');

        if (!usernameInput || !firstPasswordInput || !repeatPasswordInput) {
            return;
        }

        const firstPassword = firstPasswordInput.originalPassword || '';
        const repeatPassword = repeatPasswordInput.originalPassword || '';
        const isUsernameFilled = usernameInput.value.trim().length >= 3;
        const passwordStrength = checkPasswordStrength(firstPassword);
        const isPasswordStrong = passwordStrength === 'strong';
        const doPasswordsMatch = (firstPassword.length > 0) && (firstPassword === repeatPassword);

        // Dodatkowe powiadomienia o błędach weryfikacji
        if (repeatPasswordInput === document.activeElement && firstPassword.length > 0 && repeatPassword.length > 0 && !doPasswordsMatch) {
            showNotification('error', 'Powtórzone hasło nie pasuje do pierwszego.');
        } else if (usernameInput === document.activeElement && usernameInput.value.length > 0 && usernameInput.value.trim().length < 3) {
            showNotification('error', 'Nazwa użytkownika musi mieć co najmniej 3 znaki.');
        } else if (usernameInput === document.activeElement && usernameInput.value.length === 0) {
            showNotification('call', 'Podaj nazwę użytkownika.');
        }


        const isBasicDataValid = isUsernameFilled && isPasswordStrong && doPasswordsMatch;
        if (isBasicDataValid) {
            basicDataSection.classList.add('is-valid');
            if (usernameInput === document.activeElement || firstPasswordInput === document.activeElement || repeatPasswordInput === document.activeElement) {
                showNotification('success', 'Podstawowe dane są poprawne. Możesz przejść dalej!');
            }
        } else {
            basicDataSection.classList.remove('is-valid');
        }
    }


    function setupChecklistLogic(containerId, checkboxSelector) {
        const checklistContainer = document.getElementById(containerId);
        if (!checklistContainer) {
            return;
        }
        const likedCheckboxes = checklistContainer.querySelectorAll(checkboxSelector);

        function checkLikedStatus() {
            const isAnyLikedCheckboxChecked = Array.from(likedCheckboxes).some(input => input.checked);
            if (isAnyLikedCheckboxChecked) {
                checklistContainer.classList.add('is-checklist-active');
            } else {
                checklistContainer.classList.remove('is-checklist-active');
            }
            if (typeof adjustBasicDataHeight === 'function') {
                setTimeout(adjustBasicDataHeight, 0);
            }
        }

        likedCheckboxes.forEach(input => {
            input.addEventListener('change', (e) => {
                checkLikedStatus();

                const label = e.target.value.trim();

                const state = e.target.checked ? 'Wybrano' : 'Odznaczono';
                showNotification('call', `${state}: ${label}`);
            });
        });

        checkLikedStatus();
    }


    if (textarea && additionalInfoSection && tellAboutSection) {
        textarea.addEventListener('mousedown', startTextareaResize);
        window.addEventListener('load', onTextareaResize);
        window.addEventListener('resize', onTextareaResize);
        textarea.addEventListener('input', onTextareaResize);
    }

    const inputs = document.querySelectorAll('.inputField');
    if (inputs.length > 0 && basicDataSection) {
        inputs.forEach(inputElement => {
            inputElement.addEventListener('focus', () => {
                const label = inputElement.nextElementSibling ? inputElement.nextElementSibling.textContent.trim() : 'Pole wejściowe';
                if (!inputElement.classList.contains('inputField-Password') && !isModeNotificationActive) {
                    showNotification('call', `Aktywne pole: ${label}.`);
                }

                if (signupWrapper && signupWrapper.style.display !== 'none' && basicDataSection) {
                    basicDataSection.style.transform = 'translateY(-15px)';
                    setTimeout(adjustBasicDataHeight, 0);
                }
                validateBasicData();
            });
            inputElement.addEventListener('blur', (e) => {
                showNotification('idle');
                if (signupWrapper && signupWrapper.style.display !== 'none' && basicDataSection) {
                    if (!inputElement.value && !inputElement.matches(':focus')) {
                        basicDataSection.style.transform = 'translateY(0)';
                        setTimeout(adjustBasicDataHeight, 0);
                    }
                }
                validateBasicData();
            });
        });
    }

    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchFormMode('login');
        });
    }
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchFormMode('signup');
        });
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
                showNotification('call', 'Zmieniono motyw.');
            });
        }
    }

    // Obsługa sekcji danych osobowych (Radio Buttons)
    const personalDataSection = document.querySelector('.personal-data');
    if (personalDataSection) {
        const radioInputs = personalDataSection.querySelectorAll('input[type="radio"]');
        function checkPersonalDataStatus() {
            const isAnyRadioChecked = Array.from(radioInputs).some(input => input.checked);
            if (isAnyRadioChecked) {
                personalDataSection.classList.add('is-radio-active');
            } else {
                personalDataSection.classList.remove('is-radio-active');
            }
            setTimeout(adjustBasicDataHeight, 0);
        }
        radioInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                checkPersonalDataStatus();
                showNotification('success', `Wybrano: ${e.target.closest('.radio-button').querySelector('.radio-label').textContent.trim()}.`);
            });
        });
        checkPersonalDataStatus();
    }

    // Obsługa Textarea
    if (textarea && tellAboutSection) {
        textarea.addEventListener('input', () => {
            if (textarea.value.trim().length > 0) {
                tellAboutSection.classList.add('is-textarea-active');
            } else {
                tellAboutSection.classList.remove('is-textarea-active');
            }
            if (textarea === document.activeElement && !isModeNotificationActive) {
                showNotification('call', `Wprowadzanie tekstu (obecnie ${textarea.value.length} znaków).`);
            }
        });
        textarea.addEventListener('focus', () => {
            showNotification('call', `Aktywne pole: Opowiedz o sobie.`);
        });
        textarea.addEventListener('blur', () => {
            showNotification('idle');
        });
    }

    // Obsługa sekcji Newsletter
    const newsletterWrapper = document.querySelector('.newselletr-data-wrapper');
    if (newsletterWrapper) {
        const checkboxInputs = newsletterWrapper.querySelectorAll('input[type="checkbox"]');
        function checkNewsletterStatus() {
            const isAnyCheckboxChecked = Array.from(checkboxInputs).some(input => input.checked);
            if (isAnyCheckboxChecked) {
                newsletterWrapper.classList.add('is-checkbox-active');
            } else {
                newsletterWrapper.classList.remove('is-checkbox-active');
            }
            setTimeout(adjustBasicDataHeight, 0);
        }
        checkboxInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                checkNewsletterStatus();
                const container = e.target.closest('.container');
                const label = container ? container.textContent.replace(/\s\s+/g, ' ').trim() : 'Nieznana Etykieta';
                const state = e.target.checked ? 'Aktywowano' : 'Dezaktywowano';
                showNotification('call', `${state}: ${label}`);
            });
        });
        checkNewsletterStatus();
    }

    setupChecklistLogic('checklist', '.liked-guns-list');
    setupChecklistLogic('additional-info', '.liked-guns-list');

    // Obsługa Hasła (Logika ukrywania/pokazywania i siły hasła)
    const passwordContainers = document.querySelectorAll('.password-container');
    const maskChar = '•';
    const animationDelay = 30;

    passwordContainers.forEach(container => {
        const passwordInput = container.querySelector('.inputField-Password');
        const toggleCheckbox = container.querySelector('.toggleCheckbox');
        const toggleLabel = container.querySelector('.toggle-password');

        if (!passwordInput || !toggleCheckbox || !toggleLabel) return;

        let originalPassword = '';
        const isFirstPasswordInput = passwordInput.classList.contains('first-password-input');

        passwordInput.originalPassword = originalPassword;

        function maskPasswordAnimated(currentText, inputEl) {
            let masked = '';
            for (let i = 0; i < currentText.length; i++) {
                setTimeout(() => {
                    if (toggleCheckbox.checked) {
                        masked += maskChar;
                        inputEl.value = masked;
                    }
                }, i * animationDelay);
            }
        }

        function unmaskPasswordAnimated(maskedText, originalText, inputEl) {
            for (let i = maskedText.length - 1; i >= 0; i--) {
                setTimeout(() => {
                    if (!toggleCheckbox.checked) {
                        let currentDisplay = inputEl.value;
                        if (originalText.length > 0) {
                            currentDisplay = currentDisplay.substring(0, i) + originalText[i] + currentDisplay.substring(i + 1);
                        } else {
                            currentDisplay = originalText;
                        }
                        inputEl.value = currentDisplay;
                    }
                }, (maskedText.length - 1 - i) * animationDelay);
            }
        }

        toggleLabel.addEventListener('mousedown', (e) => { e.preventDefault(); });
        toggleCheckbox.addEventListener('change', function () {
            const isChecked = this.checked;
            if (isChecked) {
                maskPasswordAnimated(originalPassword, passwordInput);
                passwordInput.classList.add('masked');
                showNotification('call', 'Hasło ukryte (zmaskowane).');
            } else {
                unmaskPasswordAnimated(passwordInput.value, originalPassword, passwordInput);
                passwordInput.classList.remove('masked');
                showNotification('call', 'Hasło widoczne.');
            }
            validateBasicData();
        });

        passwordInput.addEventListener('input', function (event) {
            const inputElement = this;
            const currentCursorPosition = inputElement.selectionStart;

            if (!toggleCheckbox.checked) {
                originalPassword = inputElement.value;
                if (isFirstPasswordInput) firstPasswordRawValue = inputElement.value;
            }
            else {
                const currentValue = inputElement.value;
                const currentLength = currentValue.length;
                const originalLength = originalPassword.length;
                const diff = currentLength - originalLength;

                if (diff > 0) {
                    const newChar = currentValue.charAt(currentCursorPosition - diff);
                    originalPassword = originalPassword.slice(0, currentCursorPosition - diff) + newChar + originalPassword.slice(currentCursorPosition - diff);
                }
                else if (diff < 0) {
                    originalPassword = originalPassword.slice(0, currentCursorPosition) + originalPassword.slice(currentCursorPosition - diff);
                }

                inputElement.value = maskChar.repeat(originalPassword.length);
                if (isFirstPasswordInput) firstPasswordRawValue = originalPassword;
            }

            inputElement.selectionStart = inputElement.selectionEnd = currentCursorPosition;
            inputElement.originalPassword = originalPassword;

            const isLoginMode = mainContainer && mainContainer.classList.contains('mode-login');
            if (!isLoginMode) {
                if (isFirstPasswordInput) {
                    const strength = checkPasswordStrength(originalPassword);
                    updatePasswordColor(passwordInput, strength);
                    const secondPasswordInput = document.querySelector('.inputField-Password:not(.first-password-input)');
                    if (secondPasswordInput) {
                        const matchStrength = (secondPasswordInput.originalPassword === firstPasswordRawValue && firstPasswordRawValue.length > 0) ? 'strong' : 'weak';
                        updatePasswordColor(secondPasswordInput, matchStrength);
                    }
                } else {
                    const matchStrength = (originalPassword === firstPasswordRawValue && originalPassword.length > 0) ? 'strong' : 'weak';
                    updatePasswordColor(passwordInput, matchStrength);
                    if (passwordInput === document.activeElement && originalPassword.length > 0 && !isModeNotificationActive) {
                        if (matchStrength === 'weak') {
                            showNotification('error', 'Powtórzone hasło nie pasuje.');
                        } else {
                            showNotification('success', 'Hasła pasują do siebie.');
                        }
                    }
                }
            } else {
                updatePasswordColor(passwordInput, '');
            }
            validateBasicData();
        });

        // Definicja `originalPassword` jako właściwości dla łatwego dostępu
        Object.defineProperty(passwordInput, 'originalPassword', {
            get: () => originalPassword
        });

        updatePasswordColor(passwordInput, checkPasswordStrength(originalPassword));
    });

    const validationInputs = document.querySelectorAll('.basic-data .inputField');

    if (validationInputs.length > 0) {
        validationInputs.forEach(inputElement => {
            if (!inputElement.classList.contains('inputField-Password')) {
                inputElement.addEventListener('input', validateBasicData);
                inputElement.addEventListener('blur', validateBasicData);
            }
        });
    }

    // *********************************************************************************
    // === INICJALIZACJA ===
    // *********************************************************************************

    // Inicjalizacja domyślnego trybu
    switchFormMode('signup');
    validateBasicData();
    loadTheme();
    setTimeout(adjustBasicDataHeight, 0);
    window.addEventListener('resize', adjustBasicDataHeight);

    // Inicjalizacja Dynamic Island
    if (island) {
        setTimeout(() => {
            if (!isModeNotificationActive) {
                showNotification('idle');
            }
        }, 300);
    }
});