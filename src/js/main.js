"use strict";

import Chart from 'chart.js/auto';

// Hämta in meny-knapparna
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

//eventlyssnare
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

//Toggla fram navigeringsmenyn
function toggleMenu() {
    let navMenuEl = document.getElementById("nav-menu");

    //hämtar in css för menyn
    let style = window.getComputedStyle(navMenuEl);

    //koll om navigering är synlig eller ej, ändrar display block/none
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
async function getData() {
    const url = 'https://studenter.miun.se/~mallar/dt211g/';

    const response = await fetch(url)
    const datapoints = await response.json()
    //console.log(datapoints)

    /* Kurser */

    // Filtrera ut kurser
    const filteredCourse = datapoints.filter(obj => obj.type === 'Kurs');
    // console.log('Filtrerade kurser:', filteredCourse);

    // Filtrera kurser i fallande ordning
    let sortedCourse = filteredCourse.sort((a, b) => b.applicantsTotal - a.applicantsTotal);
    // console.log('Sorterade kurser:', sortedCourse);

    // Sortera ut de 6 mest sökta kurserna
    const top6Course = sortedCourse.slice(0, 6);
    // console.log('Top 6 kurser:', top6Course)

    // Hämta namn på kurser
    courseName = top6Course.map((e) => e.name);

    //Hämta ansökningstal på kurser
    courseApplicants = top6Course.map((e) => e.applicantsTotal);


    /*Program*/

    // Filtrera ut program
    const filteredProgram = datapoints.filter(obj => obj.type === 'Program');
    // console.log('Filtrerade Program:', filteredProgram);

    // Filtrera program i fallande ordning
    let sortedProgram = filteredProgram.sort((a, b) => b.applicantsTotal - a.applicantsTotal);
    // console.log('Sorterade program:', sortedProgram);

    // Sortera ut de 5 mest sökta programmen
    const top5Program = sortedProgram.slice(0, 5);
    // console.log('Top 5 program:', top5Program)

    // Hämta programnamn
    programName = top5Program.map((e) => e.name);

    //Hämta ansökningstal för program
    programApplicants = top5Program.map((e) => e.applicantsTotal);
}


// Utskrift av stapel-diagram
async function displayBarChart() {
    await getData();

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
    });

}

displayBarChart();


// Utskrift av cirkel-diagram
async function displayPieChart() {
    await getData();

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














