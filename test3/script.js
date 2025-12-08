document.addEventListener('DOMContentLoaded', (event) => {
    const rightWrapper = document.querySelector('.right-side-sections-wrapper');
    const basicDataWrapper = document.querySelector('.basic-data-wrapper');

    function adjustBasicDataHeight() {
        if (rightWrapper && basicDataWrapper) {
            const rightHeight = rightWrapper.getBoundingClientRect().height;
            const finalHeight = Math.ceil(rightHeight) + 1;
            basicDataWrapper.style.setProperty('--right-height', `${finalHeight}px`);
        }
    }

    setTimeout(adjustBasicDataHeight, 0);
    window.addEventListener('resize', adjustBasicDataHeight);

    const inputs = document.querySelectorAll('.inputField');
    const section = document.querySelector('.basic-data');
    let firstPasswordRawValue = '';

    if (inputs.length > 0 && section) {
        inputs.forEach(inputElement => {
            inputElement.addEventListener('focus', () => {
                section.style.transform = 'translateY(-15px)';
                setTimeout(adjustBasicDataHeight, 0);
            });

            inputElement.addEventListener('blur', (e) => {
                if (!inputElement.value && !inputElement.matches(':focus')) {
                    section.style.transform = 'translateY(0)';
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

    setupChecklistLogic('checklist-2', '.liked-guns-list');

    function checkPasswordStrength(password) {
        let strength = 'weak';
        if (password.length >= 6) strength = 'medium';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
        return strength;
    }

    function updatePasswordColor(inputElement, strength) {
        inputElement.classList.remove('weak', 'medium', 'strong');

        if (!inputElement.classList.contains('first-password-input') && (strength === 'medium' || strength === 'strong')) {
            inputElement.classList.add('strong');
        } else {
            inputElement.classList.add(strength);
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
                    const matchStrength = (secondPasswordInput.originalPassword === firstPasswordRawValue && firstPasswordRawValue.length > 0) ? 'strong' : 'weak';
                    updatePasswordColor(secondPasswordInput, matchStrength);
                }

            } else {
                const matchStrength = (originalPassword === firstPasswordRawValue && originalPassword.length > 0) ? 'strong' : 'weak';
                updatePasswordColor(passwordInput, matchStrength);
            }
        });
        Object.defineProperty(passwordInput, 'originalPassword', {
            get: () => originalPassword
        });

        updatePasswordColor(passwordInput, checkPasswordStrength(originalPassword));
    });
});
