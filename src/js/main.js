"use strict";

import Chart from "chart.js/auto";

// Hämta in meny-knapparna
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

// Eventlyssnare
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

// Toggla fram navigeringsmenyn
function toggleMenu() {
    let navMenuEl = document.getElementById("nav-menu");

    // Hämta in css för menyn
    let style = window.getComputedStyle(navMenuEl);

    // Koll om navigering är synlig eller ej, ändrar display block/none
    if (style.display === "none") {
        navMenuEl.style.display = "block";
    } else {
        navMenuEl.style.display = "none";
    }
}

/* Diagram*/

// Variabler
let courseName = [];
let courseApplicants = [];
let programName = [];
let programApplicants = [];

// Hämta JSON-data
async function getData1() {
    const url = 'https://studenter.miun.se/~mallar/dt211g/';

    const response = await fetch(url)
    const datapoints = await response.json()

    /* Kurser */

    // Filtrera ut kurser
    const filteredCourse = datapoints.filter(obj => obj.type === 'Kurs');

    // Filtrera kurser i fallande ordning
    let sortedCourse = filteredCourse.sort((a, b) => b.applicantsTotal - a.applicantsTotal);

    // Sortera ut de 6 mest sökta kurserna
    const top6Course = sortedCourse.slice(0, 6);

    // Hämta namn på kurser
    courseName = top6Course.map((e) => e.name);

    // Hämta ansökningstal på kurser
    courseApplicants = top6Course.map((e) => e.applicantsTotal);

}

    // Hämta JSON-data
    async function getData2() {
    const url = 'https://studenter.miun.se/~mallar/dt211g/';

    const response = await fetch(url)
    const datapoints = await response.json()

    /*Program*/

    // Filtrera ut program
    const filteredProgram = datapoints.filter(obj => obj.type === 'Program');

    // Filtrera program i fallande ordning
    let sortedProgram = filteredProgram.sort((a, b) => b.applicantsTotal - a.applicantsTotal);

    // Sortera ut de 5 mest sökta programmen
    const top5Program = sortedProgram.slice(0, 5);

    // Hämta programnamn
    programName = top5Program.map((e) => e.name);

    // Hämta ansökningstal för program
    programApplicants = top5Program.map((e) => e.applicantsTotal);
}


// Utskrift av stapel-diagram
async function displayBarChart() {
    await getData1();

    const barChartEl = document.getElementById('barChart');

    new Chart(barChartEl, {
        type: 'bar',
        data: {
            labels: courseName,
            datasets: [{
                label: 'Antal sökande HT2023',
                data: courseApplicants,
                borderWidth: 1
            }]
        },

        options: {
            indexAxis: "y"
        }
    });
}

displayBarChart();


// Utskrift av cirkel-diagram
async function displayPieChart() {
    await getData2();

    const barChartEl = document.getElementById('pieChart');
    new Chart(barChartEl, {
        type: 'pie',
        data: {
            labels: programName,
            datasets: [{
                label: 'Antal sökande HT2023',
                data: programApplicants,
                borderWidth: 1
            }]
        },
    });

}

displayPieChart();


/* Karta */
document.addEventListener('DOMContentLoaded', () => {

    let searchInput = document.getElementById('searchInput');
    let searchBtn = document.getElementById('searchBtn');
    let map = L.map('map').setView([59.32, 18.05], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker;

    async function searchLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const coordinates = [lat, lon];
                map.setView(coordinates, 15);

                if (marker) {
                    marker.setLatLng(coordinates);

                } else {
                    marker = L.marker(coordinates).addTo(map);
                }

            } else {
                alert('Platsen kunde inte hittas...');
            }

        } catch (error) {
            console.error('Något gick fel...', error);
        }
    }

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.trim() !== "") {
            searchLocation(query);
        } else {
            alert('Skriv in en plats i sökrutan...');
        }
    });
});















