"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const formStatus = document.getElementById("formStatus");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    if (!form) return;

    const initialsFields = [
        ["firstname", "s"],
        ["middlename", "m"],
        ["lastname", "l"]
    ];

    initialsFields.forEach(function ([inputId, outputId]) {
        const input = document.getElementById(inputId);
        const output = document.getElementById(outputId);

        if (input && output) {
            const updateInitial = function () {
                const value = input.value.trim();
                output.textContent = value ? value.charAt(0).toUpperCase() : "";
            };

            input.addEventListener("input", updateInitial);
            updateInitial();
        }
    });

    if (phone) {
        phone.maxLength = 10;
        phone.addEventListener("input", function () {
            phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
        });
    }

    function setError(id, message) {
        const field = document.getElementById(id);
        const error = document.getElementById(id + "Error");

        if (field) {
            field.setAttribute("aria-invalid", message ? "true" : "false");
        }

        if (error) {
            error.textContent = message;
        }
    }

    function validateName(value) {
        return /^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(value.trim()) ? "" : "Please enter a valid name using letters only.";
    }

    function validateStudentId(value) {
        return /^[A-Za-z0-9-]{4,15}$/.test(value.trim()) ? "" : "Student ID should contain 4 to 15 letters, numbers, or dashes.";
    }

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address.";
    }

    function validateMobile(value) {
        return /^[6-9]\d{9}$/.test(value.trim()) ? "" : "Please enter a valid 10-digit mobile number starting with 6 to 9.";
    }

    function validatePassword(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
            ? ""
            : "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
    }

    function validateSelect(value, fieldName) {
        return value ? "" : `Please select your ${fieldName}.`;
    }

    function validateGender() {
        const selected = document.querySelector('input[name="gender"]:checked');
        return selected ? "" : "Please select your gender.";
    }

    function validateTerms() {
        return document.getElementById("terms").checked ? "" : "You must accept the terms and conditions.";
    }

    const validateField = function (fieldId, validator) {
        const value = document.getElementById(fieldId)?.value ?? "";
        const message = validator(value);
        setError(fieldId, message);
        return !message;
    };

    const fieldRules = [
        ["firstname", validateName],
        ["lastname", validateName],
        ["studentId", validateStudentId],
        ["email", validateEmail],
        ["phone", validateMobile],
        ["password", validatePassword],
        ["confirmPassword", function (value) {
            return value === password.value && value !== "" ? "" : "Passwords do not match.";
        }],
        ["course", function (value) { return validateSelect(value, "course"); }],
        ["year", function (value) { return validateSelect(value, "year"); }]
    ];

    fieldRules.forEach(function ([fieldId, validator]) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener("input", function () {
            validateField(fieldId, validator);

            if (fieldId === "password" || fieldId === "confirmPassword") {
                validateField("confirmPassword", function (value) {
                    return value === password.value && value !== "" ? "" : "Passwords do not match.";
                });
            }
        });

        field.addEventListener("change", function () {
            validateField(fieldId, validator);
        });
    });

    const genderFields = document.querySelectorAll('input[name="gender"]');
    genderFields.forEach(function (radio) {
        radio.addEventListener("change", function () {
            setError("gender", validateGender());
        });
    });

    const terms = document.getElementById("terms");
    if (terms) {
        terms.addEventListener("change", function () {
            setError("terms", validateTerms());
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let isValid = true;

        fieldRules.forEach(function ([fieldId, validator]) {
            if (!validateField(fieldId, validator)) {
                isValid = false;
            }
        });

        const genderMessage = validateGender();
        setError("gender", genderMessage);
        if (genderMessage) isValid = false;

        const termsMessage = validateTerms();
        setError("terms", termsMessage);
        if (termsMessage) isValid = false;

        if (!isValid) {
            if (formStatus) {
                formStatus.textContent = "Please correct the highlighted errors before submitting.";
                formStatus.className = "form-status error";
            }
            return;
        }

        if (formStatus) {
            formStatus.textContent = "Registration successful! Your details have been submitted.";
            formStatus.className = "form-status success";
        }

        form.reset();

        initialsFields.forEach(function ([inputId, outputId]) {
            const input = document.getElementById(inputId);
            const output = document.getElementById(outputId);

            if (input && output) {
                output.textContent = "";
            }
        });

        if (phone) {
            phone.value = "";
        }
    });

    if (password && confirmPassword) {
        password.addEventListener("input", function () {
            if (confirmPassword.value) {
                setError("confirmPassword", confirmPassword.value === password.value ? "" : "Passwords do not match.");
            }
        });

        confirmPassword.addEventListener("input", function () {
            setError("confirmPassword", confirmPassword.value === password.value ? "" : "Passwords do not match.");
        });
    }
});

