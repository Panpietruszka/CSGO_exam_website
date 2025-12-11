document.addEventListener('DOMContentLoaded', (event) => {
    const textarea = document.getElementById('about-user');
    const additionalInfoSection = document.querySelector('.additional-info');
    const tellAboutSection = document.querySelector('.tell-about-yourself-section');

    // --- GŁÓWNA LOGIKA SYNCHRONIZACJI KOLUMN BAZOWYCH (Twój kod) ---
    const rightWrapper = document.querySelector('.right-side-sections-wrapper');
    const basicDataWrapper = document.querySelector('.basic-data-wrapper');
    const basicDataSection = document.querySelector('.basic-data'); // Dodane dla łatwiejszego dostępu

    function adjustBasicDataHeight() {
        if (rightWrapper && basicDataWrapper) {
            const rightHeight = rightWrapper.getBoundingClientRect().height;
            const finalHeight = Math.ceil(rightHeight) + 1;
            basicDataWrapper.style.setProperty('--right-height', `${finalHeight}px`);
        }
    }

    // --- FUNKCJE DLA DYNAMICZNEGO ŚLEDZENIA RESIZE'U (NOWA LOGIKA) ---

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

    // --- INTEGRACJA ZDARZEŃ W DÓLNYM RZĘDZIE ---
    if (textarea && additionalInfoSection && tellAboutSection) {
        textarea.addEventListener('mousedown', startTextareaResize);

        window.addEventListener('load', onTextareaResize);
        window.addEventListener('resize', onTextareaResize);
        textarea.addEventListener('input', onTextareaResize);
    }
    // ---------------------------------------------

    // --- START INICJALIZACJI GŁÓWNEGO UKŁADU ---
    setTimeout(adjustBasicDataHeight, 0);
    window.addEventListener('resize', adjustBasicDataHeight);

    const inputs = document.querySelectorAll('.inputField');

    // Zmienna do przechowywania surowej wartości pierwszego hasła
    let firstPasswordRawValue = '';

    if (inputs.length > 0 && basicDataSection) {
        inputs.forEach(inputElement => {
            inputElement.addEventListener('focus', () => {
                basicDataSection.style.transform = 'translateY(-15px)';
                setTimeout(adjustBasicDataHeight, 0);
            });

            inputElement.addEventListener('blur', (e) => {
                if (!inputElement.value && !inputElement.matches(':focus')) {
                    basicDataSection.style.transform = 'translateY(0)';
                    setTimeout(adjustBasicDataHeight, 0);
                }
            });
        });
    } else {
        console.error("Brak elementów inputField lub basic-data.");
    }

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
            input.addEventListener('change', checkPersonalDataStatus);
        });
        checkPersonalDataStatus();
    }

    textarea.addEventListener('input', () => {
        if (textarea.value.trim().length > 0) {
            tellAboutSection.classList.add('is-textarea-active');
        } else {
            tellAboutSection.classList.remove('is-textarea-active');
        }
    });

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
            input.addEventListener('change', checkNewsletterStatus);
        });
        checkNewsletterStatus();
    } else {
        console.error("Brak elementu newselletr-data-wrapper.");
    }

    function setupChecklistLogic(containerId, checkboxSelector) {
        const checklistContainer = document.getElementById(containerId);

        if (!checklistContainer) {
            console.error(`Brak elementu o ID: ${containerId}`);
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
            input.addEventListener('change', checkLikedStatus);
        });

        checkLikedStatus();
    }

    setupChecklistLogic('checklist', '.liked-guns-list');

    setupChecklistLogic('additional-info', '.liked-guns-list');

    function checkPasswordStrength(password) {
        let strength = 'weak';
        // Minimalna długość 6
        if (password.length >= 6) strength = 'medium';
        // Długość min. 8 ORAZ Duża litera ORAZ Cyfra
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
        return strength;
    }

    function updatePasswordColor(inputElement, strength) {
        inputElement.classList.remove('weak', 'medium', 'strong');

        // Logic for repeat password field: if it's not the first one, 
        // it only gets 'strong' if it matches and is not empty.
        if (!inputElement.classList.contains('first-password-input') && (strength === 'medium' || strength === 'strong')) {
            // W przypadku pola "Repeat Password" klasa 'strong' oznacza zgodność
            inputElement.classList.add('strong');
        } else if (inputElement.classList.contains('first-password-input')) {
            // W przypadku pola "Password" klasa odzwierciedla faktyczną siłę
            inputElement.classList.add(strength);
        } else {
            // Dla "Repeat Password" niezgodnego/pustego
            inputElement.classList.add('weak');
        }
    }

    // --- FUNKCJA WALIDACJI CAŁEGO BLOKU .basic-data (NOWA LOGIKA) ---
    function validateBasicData() {
        if (!basicDataSection) return;

        // 1. Elementy
        const usernameInput = document.querySelector('.basic-data .inputField[name="user"]'); // Zakładam name="user"
        const firstPasswordInput = document.querySelector('.inputField-Password.first-password-input');
        const repeatPasswordInput = document.querySelector('.inputField-Password:not(.first-password-input)');

        if (!usernameInput || !firstPasswordInput || !repeatPasswordInput) {
            return;
        }

        // Pobranie surowych haseł
        const firstPassword = firstPasswordInput.originalPassword || '';
        const repeatPassword = repeatPasswordInput.originalPassword || '';

        // 2. Walidacja Nazwy Użytkownika (musi być wypełnione i mieć min. 3 znaki)
        const isUsernameFilled = usernameInput.value.trim().length >= 3;

        // 3. Walidacja Siły Hasła (musi być 'strong')
        const isPasswordStrong = checkPasswordStrength(firstPassword) === 'strong';

        // 4. Walidacja Powtórzenia Hasła (muszą się zgadzać i hasło nie może być puste)
        const doPasswordsMatch = (firstPassword.length > 0) && (firstPassword === repeatPassword);

        // 5. Ostateczna decyzja i dodanie/usunięcie klasy
        const isBasicDataValid = isUsernameFilled && isPasswordStrong && doPasswordsMatch;

        if (isBasicDataValid) {
            basicDataSection.classList.add('is-valid');
        } else {
            basicDataSection.classList.remove('is-valid');
        }
    }
    // ----------------------------------------------------------------

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

        // Wczytanie początkowej wartości, jeśli istnieje
        originalPassword = passwordInput.value;
        if (isFirstPasswordInput) firstPasswordRawValue = originalPassword;

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
                        currentDisplay = currentDisplay.substring(0, i) + originalText[i] + currentDisplay.substring(i + 1);
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
            } else {
                unmaskPasswordAnimated(passwordInput.value, originalPassword, passwordInput);
                passwordInput.classList.remove('masked');
            }
            validateBasicData(); // Walidacja po zmianie widoczności
        });

        passwordInput.addEventListener('input', function (event) {
            const inputElement = this;
            const currentCursorPosition = inputElement.selectionStart;

            if (!toggleCheckbox.checked) {
                originalPassword = inputElement.value;
                if (isFirstPasswordInput) firstPasswordRawValue = inputElement.value;
            }
            else {
                const currentValue = inputElement.value; const currentLength = currentValue.length; const originalLength = originalPassword.length;
                if (currentLength > originalLength) { const newChar = currentValue.charAt(currentCursorPosition - 1); originalPassword = originalPassword.slice(0, currentCursorPosition - 1) + newChar + originalPassword.slice(currentCursorPosition - 1); }
                else if (currentLength < originalLength) { originalPassword = originalPassword.slice(0, currentCursorPosition) + originalPassword.slice(currentCursorPosition + (originalLength - currentLength)); }
                inputElement.value = maskChar.repeat(originalPassword.length);

                if (isFirstPasswordInput) firstPasswordRawValue = originalPassword;
            }
            inputElement.selectionStart = inputElement.selectionEnd = currentCursorPosition;

            if (isFirstPasswordInput) {
                const strength = checkPasswordStrength(originalPassword);
                updatePasswordColor(passwordInput, strength);

                const secondPasswordInput = document.querySelector('.inputField-Password:not(.first-password-input)');
                if (secondPasswordInput) {
                    // Update repeat password color based on match
                    const matchStrength = (secondPasswordInput.originalPassword === firstPasswordRawValue && firstPasswordRawValue.length > 0) ? 'strong' : 'weak';
                    updatePasswordColor(secondPasswordInput, matchStrength);
                }

            } else {
                const matchStrength = (originalPassword === firstPasswordRawValue && originalPassword.length > 0) ? 'strong' : 'weak';
                updatePasswordColor(passwordInput, matchStrength);
            }

            validateBasicData(); // Walidacja po wprowadzeniu danych
        });

        // Umożliwienie dostępu do surowej wartości z innych elementów/funkcji
        Object.defineProperty(passwordInput, 'originalPassword', {
            get: () => originalPassword
        });

        updatePasswordColor(passwordInput, checkPasswordStrength(originalPassword));
    });

    // --- INTEGRACJA WALIDACJI DANYCH PODSTAWOWYCH Z INNYMI POLAMI ---

    // Znajdź wszystkie inputy w sekcji basic-data, które powinny wyzwalać walidację
    const validationInputs = document.querySelectorAll('.basic-data .inputField');

    if (validationInputs.length > 0) {
        validationInputs.forEach(inputElement => {
            // Nasłuchiwanie na 'input' (zmiana wartości) i 'blur' (wyjście z pola)
            if (!inputElement.classList.contains('inputField-Password')) {
                inputElement.addEventListener('input', validateBasicData);
                inputElement.addEventListener('blur', validateBasicData);
            }
        });
    }

    validateBasicData();

});
