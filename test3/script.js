document.addEventListener('DOMContentLoaded', (event) => {
    const inputs = document.querySelectorAll('.inputField');
    const section = document.querySelector('.basic-data');
    // Globalna zmienna do przechowywania jawnego hasła z pierwszego inputa
    let firstPasswordRawValue = '';

    if (inputs.length > 0 && section) {
        inputs.forEach(inputElement => {
            inputElement.addEventListener('focus', () => {
                section.style.transform = 'translateY(-15px)';
            });

            inputElement.addEventListener('blur', (e) => {
                if (!inputElement.value && !inputElement.matches(':focus')) {
                    section.style.transform = 'translateY(0)';
                }
            });
        });
    } else {
        console.error("Brak elementów inputField lub basic-data.");
    }

    // FUNKCJA OCENY SIŁY HASŁA (Dla pierwszego inputa)
    function checkPasswordStrength(password) {
        let strength = 'weak';
        if (password.length >= 6) strength = 'medium';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
        return strength;
    }

    // FUNKCJA AKTUALIZACJI KOLORU (Dostosowana do obu inputów)
    function updatePasswordColor(inputElement, strength) {
        inputElement.classList.remove('weak', 'medium', 'strong');
        // Jeśli to drugi input, używamy tylko weak/strong (czerwony/zielony)
        if (!inputElement.classList.contains('first-password-input') && (strength === 'medium' || strength === 'strong')) {
            inputElement.classList.add('strong'); // Zgodne hasło (zielony)
        } else {
            inputElement.classList.add(strength); // Dla pierwszego inputa (weak/medium/strong)
        }
    }

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

        // --- FUNKCJE ANIMACJI (Bez zmian) ---
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
                passwordInput.classList.add('masked'); // Dodajemy klasę CSS masked po zakończeniu animacji
            } else {
                unmaskPasswordAnimated(passwordInput.value, originalPassword, passwordInput);
                passwordInput.classList.remove('masked'); // Usuwamy klasę CSS masked po zakończeniu animacji
            }
        });

        // LISTENER DLA ZDARZEŃ INPUT (PISANIE / BACKSPACE / DELETE)
        passwordInput.addEventListener('input', function (event) {
            const inputElement = this;
            const currentCursorPosition = inputElement.selectionStart;

            // Logika synchronizacji originalPassword
            if (!toggleCheckbox.checked) {
                originalPassword = inputElement.value;
                if (isFirstPasswordInput) firstPasswordRawValue = inputElement.value; // AKTUALIZUJEMY GLOBALNĄ ZMIENNĄ
            }
            else {
                const currentValue = inputElement.value; const currentLength = currentValue.length; const originalLength = originalPassword.length;
                if (currentLength > originalLength) { const newChar = currentValue.charAt(currentCursorPosition - 1); originalPassword = originalPassword.slice(0, currentCursorPosition - 1) + newChar + originalPassword.slice(currentCursorPosition - 1); }
                else if (currentLength < originalLength) { originalPassword = originalPassword.slice(0, currentCursorPosition) + originalPassword.slice(currentCursorPosition + (originalLength - currentLength)); }
                inputElement.value = maskChar.repeat(originalPassword.length);

                if (isFirstPasswordInput) firstPasswordRawValue = originalPassword; // AKTUALIZUJEMY GLOBALNĄ ZMIENNĄ
            }
            inputElement.selectionStart = inputElement.selectionEnd = currentCursorPosition;

            // Logika kolorowania:
            if (isFirstPasswordInput) {
                const strength = checkPasswordStrength(originalPassword);
                updatePasswordColor(passwordInput, strength);

                // Aktualizujemy też kolor drugiego inputa, odwołując się do GLOBALNEJ zmiennej
                const secondPasswordInput = document.querySelector('.inputField-Password:not(.first-password-input)');
                if (secondPasswordInput) {
                    // TUTAJ UŻYWAMY firstPasswordRawValue do porównania z JAWNĄ wartością drugiego inputa (originalPassword dla drugiego kontenera)
                    const matchStrength = (secondPasswordInput.originalPassword === firstPasswordRawValue && firstPasswordRawValue.length > 0) ? 'strong' : 'weak';
                    updatePasswordColor(secondPasswordInput, matchStrength);
                }

            } else {
                // Drugi input: Sprawdzamy zgodność z pierwszym, używając GLOBALNEJ zmiennej
                const matchStrength = (originalPassword === firstPasswordRawValue && originalPassword.length > 0) ? 'strong' : 'weak';
                updatePasswordColor(passwordInput, matchStrength);
            }
        });

        // Musimy udostępnić originalPassword drugiemu inputowi przez właściwość DOM
        Object.defineProperty(passwordInput, 'originalPassword', {
            get: () => originalPassword
        });

        // Ustawiamy domyślny kolor przy ładowaniu strony
        updatePasswordColor(passwordInput, checkPasswordStrength(originalPassword));
    });
});
