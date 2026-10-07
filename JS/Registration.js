"use strict";

document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("form");
	if (!form) return;

	const fields = [
		["firstname", "s"],
		["middlename", "m"],
		["lastname", "l"]
	];

	fields.forEach(function ([inputId, outputId]) {
		const input = document.getElementById(inputId);
		const output = document.getElementById(outputId);
		if (input && output) {
			input.addEventListener("input", function () {
				output.textContent = input.value.trim().charAt(0).toUpperCase();
			});
		}
	});

	const phone = document.getElementById("phone");
	const phoneMessage = document.getElementById("p");
	const password = document.getElementById("password");

	if (phone) {
		phone.maxLength = 10;
		phone.addEventListener("input", function () {
			phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
		});
	}

	form.addEventListener("submit", function (event) {
		if (phone && phone.value.trim() && !/^\d{10}$/.test(phone.value.trim())) {
			event.preventDefault();
			if (phoneMessage) {
				phoneMessage.textContent = " Enter a valid 10-digit contact number.";
				phoneMessage.setAttribute("role", "alert");
			}
			phone.focus();
			return;
		}

		if (phoneMessage) phoneMessage.textContent = "";

		if (password && password.value.length < 8) {
			event.preventDefault();
			password.setCustomValidity("Password must be at least 8 characters long.");
			password.reportValidity();
		}
	});

	if (password) {
		password.addEventListener("input", function () {
			password.setCustomValidity("");
		});
	}
});
