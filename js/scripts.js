// Initialize AOS
AOS.init({
	duration: 1000,
	once: true,
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
	mobileMenu.classList.toggle("hidden");
});

// Navbar transparency
const navbar = document.getElementById("navbar");
const navLinks = navbar.querySelectorAll(".nav-link");
const logo = navbar.querySelector("img");
const bookButton = navbar.querySelector('a[href="#contact"]');

function updateNavbar() {
	if (window.scrollY > 2200) {
		navbar.classList.remove("bg-transparent");
		navbar.classList.add("bg-white", "shadow-md");
		navLinks.forEach((link) => {
			link.classList.remove("text-white", "hover:text-gray-300");
			link.classList.add("text-gray-800", "hover:text-gray-600");
		});
		bookButton.classList.remove("bg-white", "text-gray-800");
		bookButton.classList.add("bg-gray-800", "text-white");
	} else {
		navbar.classList.add("bg-transparent");
		navbar.classList.remove("bg-white", "shadow-md");
		navLinks.forEach((link) => {
			link.classList.add("text-white", "hover:text-gray-300");
			link.classList.remove("text-gray-800", "hover:text-gray-600");
		});
		bookButton.classList.add("bg-white", "text-gray-800");
		bookButton.classList.remove("bg-gray-800", "text-white");
	}
}

// Initial call to set correct state on page load
updateNavbar();

// Update navbar on scroll
window.addEventListener("scroll", updateNavbar);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		document.querySelector(this.getAttribute("href")).scrollIntoView({
			behavior: "smooth",
		});
	});
});

// Get references to the elements
const pickupDatetime = document.getElementById("pickup-datetime");
const formattedDatetime = document.getElementById("formatted-datetime");

// Function to format the date and time
function formatDateTime(dateTime) {
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	return new Date(dateTime).toLocaleString("en-US", options);
}

// Event listener for datetime input
pickupDatetime.addEventListener("change", function () {
	if (this.value) {
		formattedDatetime.textContent = formatDateTime(this.value);
	} else {
		formattedDatetime.textContent = "";
	}
});

// Set min date to today
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
pickupDatetime.min = today.toISOString().slice(0, 16);

// Set initial value to current date and time
pickupDatetime.value = today.toISOString().slice(0, 16);
formattedDatetime.textContent = formatDateTime(today);

// Contact form submission
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// Collect form data
	const formData = new FormData(contactForm);
	const formDataObject = Object.fromEntries(formData.entries());

	// Format message for WhatsApp
	const whatsappMessage = `
New Booking Request:
Pickup Date and Time: ${formatDateTime(formDataObject["pickup-datetime"])}
Full Name: ${formDataObject["full-name"]}
Email: ${formDataObject["email"]}
Phone: ${formDataObject["phone"]}
Message: ${formDataObject["message"]}
  `.trim();

	// Encode the message for WhatsApp URL
	const encodedMessage = encodeURIComponent(whatsappMessage);

	// Replace 'YOUR_WHATSAPP_NUMBER' with the actual WhatsApp number
	const whatsappUrl = `https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`;

	// Open WhatsApp in a new tab
	window.open(whatsappUrl, "_blank");

	// Reset the form
	contactForm.reset();

	// Reset the formatted date display
	formattedDatetime.textContent = "";

	// Show a success message
	alert("Thank you for your message. We will contact you soon!");
});

// Infinite scrolling marquee for testimonials
const marqueeContent = document.querySelector(".marquee-content");
const marqueeItems = document.querySelectorAll(".marquee-item");

// Clone the marquee items and append them to create a seamless loop
marqueeItems.forEach((item) => {
	const clone = item.cloneNode(true);
	marqueeContent.appendChild(clone);
});

// Pause animation on hover
marqueeContent.addEventListener("mouseenter", () => {
	marqueeContent.style.animationPlayState = "paused";
});

marqueeContent.addEventListener("mouseleave", () => {
	marqueeContent.style.animationPlayState = "running";
});

// Responsive marquee
function updateMarqueeWidth() {
	const marqueeWidth =
		marqueeItems.length * (marqueeItems[0].offsetWidth + 32); // 32px for margin
	marqueeContent.style.width = `${marqueeWidth}px`;
}

window.addEventListener("resize", updateMarqueeWidth);
updateMarqueeWidth(); // Initial call

// Gallery hover effect
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
	item.addEventListener("mouseenter", () => {
		item.querySelector("img").style.transform = "scale(1.1)";
		item.querySelector("div").style.opacity = "1";
	});

	item.addEventListener("mouseleave", () => {
		item.querySelector("img").style.transform = "scale(1)";
		item.querySelector("div").style.opacity = "0";
	});
});

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
	gsap.timeline({
		scrollTrigger: {
			trigger: ".wrapper",
			start: "top top",
			end: "+=150%",
			pin: true,
			scrub: true,
			// markers: true,
		},
	})
		.to(".image-container > img", {
			scale: 2,
			z: 390,
			transformOrigin: "center center",
			ease: "power1.inOut",
		})
		.to(
			".section.hero",
			{
				scale: 1.1,
				transformOrigin: "center center",
				ease: "power1.inOut",
			},
			"<"
		);
});

// Weather widget functionality
const weatherInfo = document.getElementById("weather-info");

// Function to fetch weather data
async function fetchWeather() {
	const latitude = 41.3275; // Latitude for Tirana
	const longitude = 19.8187; // Longitude for Tirana
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=Europe/Tirane&forecast_days=16`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		return data.daily;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		return null;
	}
}

// Function to get weather description and icon based on WMO weather code
function getWeatherInfo(code) {
	const weatherInfo = {
		0: { description: "Clear sky", icon: "fa-sun" },
		1: { description: "Mainly clear", icon: "fa-sun" },
		2: { description: "Partly cloudy", icon: "fa-cloud-sun" },
		3: { description: "Overcast", icon: "fa-cloud" },
		45: { description: "Fog", icon: "fa-smog" },
		48: { description: "Depositing rime fog", icon: "fa-smog" },
		51: { description: "Light drizzle", icon: "fa-cloud-rain" },
		53: { description: "Moderate drizzle", icon: "fa-cloud-rain" },
		55: { description: "Dense drizzle", icon: "fa-cloud-showers-heavy" },
		61: { description: "Slight rain", icon: "fa-cloud-rain" },
		63: { description: "Moderate rain", icon: "fa-cloud-showers-heavy" },
		65: { description: "Heavy rain", icon: "fa-cloud-showers-heavy" },
		71: { description: "Slight snow fall", icon: "fa-snowflake" },
		73: { description: "Moderate snow fall", icon: "fa-snowflake" },
		75: { description: "Heavy snow fall", icon: "fa-snowflake" },
		80: { description: "Slight rain showers", icon: "fa-cloud-sun-rain" },
		81: { description: "Moderate rain showers", icon: "fa-cloud-sun-rain" },
		82: {
			description: "Violent rain showers",
			icon: "fa-cloud-showers-heavy",
		},
		95: { description: "Thunderstorm", icon: "fa-bolt" },
		96: {
			description: "Thunderstorm with slight hail",
			icon: "fa-cloud-bolt",
		},
		99: {
			description: "Thunderstorm with heavy hail",
			icon: "fa-cloud-bolt",
		},
	};
	return weatherInfo[code] || { description: "Unknown", icon: "fa-question" };
}

// Function to update weather information
function updateWeatherInfo(forecast, startDate) {
	if (forecast) {
		const startIndex = forecast.time.findIndex((date) => date >= startDate);
		if (startIndex === -1) {
			weatherInfo.innerHTML =
				'<p class="text-center">Weather forecast not available for the selected date</p>';
			return;
		}

		let forecastHtml =
			'<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">';

		for (
			let i = startIndex;
			i < startIndex + 7 && i < forecast.time.length;
			i++
		) {
			const date = new Date(forecast.time[i]);
			const weatherCode = forecast.weathercode[i];
			const { description, icon } = getWeatherInfo(weatherCode);
			const maxTemp = forecast.temperature_2m_max[i];
			const minTemp = forecast.temperature_2m_min[i];
			const precipitation = forecast.precipitation_sum[i];
			const uvIndex = forecast.uv_index_max[i];
			const sunrise = new Date(forecast.sunrise[i]).toLocaleTimeString(
				"en-US",
				{ hour: "2-digit", minute: "2-digit" }
			);
			const sunset = new Date(forecast.sunset[i]).toLocaleTimeString(
				"en-US",
				{ hour: "2-digit", minute: "2-digit" }
			);

			forecastHtml += `
                <div class="bg-white p-4 rounded-lg shadow-inner">
                    <div class="flex justify-between items-center mb-2">
                        <p class="text-sm font-bold">${date.toLocaleDateString(
							"en-US",
							{ weekday: "short", month: "short", day: "numeric" }
						)}</p>
                        <i class="fas ${icon} text-2xl text-yellow-400"></i>
                    </div>
                    <p class="text-xs mb-2">${description}</p>
                    <div class="flex justify-between mb-2 text-xs">
                        <span><i class="fas fa-arrow-up text-red-400 mr-1"></i>${maxTemp.toFixed(
							1
						)}°C</span>
                        <span><i class="fas fa-arrow-down text-blue-400 mr-1"></i>${minTemp.toFixed(
							1
						)}°C</span>
                    </div>
                    <p class="text-xs mb-1"><i class="fas fa-tint text-blue-300 mr-1"></i>Rain: ${precipitation.toFixed(
						1
					)}mm</p>
                    <p class="text-xs mb-1"><i class="fas fa-sun text-orange-400 mr-1"></i>UV: ${uvIndex.toFixed(
						1
					)}</p>
                    <p class="text-xs"><i class="fas fa-sun text-yellow-500 mr-1"></i><i class="fas fa-arrow-up text-yellow-500 mr-1"></i>${sunrise}</p>
                    <p class="text-xs"><i class="fas fa-sun text-blue-400 mr-1"></i><i class="fas fa-arrow-down text-blue-400 mr-1"></i>${sunset}</p>
                </div>
            `;
		}

		forecastHtml += "</div>";
		weatherInfo.innerHTML = forecastHtml;
	} else {
		weatherInfo.innerHTML =
			'<p class="text-center">Weather information not available</p>';
	}
}

// Function to update weather based on selected date
async function updateWeatherFromSelectedDate() {
	const selectedDate = new Date(pickupDatetime.value);
	const startDate = selectedDate.toISOString().split("T")[0];
	const forecast = await fetchWeather();
	updateWeatherInfo(forecast, startDate);
}

// Event listener for datetime input
pickupDatetime.addEventListener("change", updateWeatherFromSelectedDate);

// Initial weather update
(async function () {
	const today = new Date();
	const startDate = today.toISOString().split("T")[0];
	const forecast = await fetchWeather();
	updateWeatherInfo(forecast, startDate);
})();
