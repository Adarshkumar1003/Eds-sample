// import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

// const placeholders = await fetchPlaceholders(getMetadata("locale"));

// // const { 
// //     allCountries = "All Countries", 
// //     abbreviation = "Abbreviation", 
// //     capital = "Capital", 
// //     continent = "Continent", 
// //     countries = "Countries", 
// //     sNo = "S. No" 
// // } = placeholders;

// const rowsPerPage = 20;  
// let currentPage = 1;
// let totalPages = 1;
// let jsonData = []; 

// async function createTableHeader(table) {
//     let tr = document.createElement("tr");

//     let sno = document.createElement("th"); sno.textContent = sNo;
//     let country = document.createElement("th"); country.textContent = countries;
//     let continentH = document.createElement("th"); continentH.textContent = continent;
//     let capitalH = document.createElement("th"); capitalH.textContent = capital;
//     let abbr = document.createElement("th"); abbr.textContent = abbreviation;

//     tr.append(sno, country, continentH, capitalH, abbr);
//     table.appendChild(tr);
// }

// async function createTableRows(table, page) {
//     table.innerHTML = ""; 

//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = Math.min(startIndex + rowsPerPage, jsonData.length);

//     for (let i = startIndex; i < endIndex; i++) {
//         let row = jsonData[i];
//         let tr = document.createElement("tr");

//         let sno = document.createElement("td"); sno.textContent = i + 1;
//         let country = document.createElement("td"); country.textContent = row.Country || "N/A";
//         let continent = document.createElement("td"); continent.textContent = row.Continent || "N/A";
//         let capital = document.createElement("td"); capital.textContent = row.Capital || "N/A";
//         let abbr = document.createElement("td"); abbr.textContent = row.Abbreviation || row.abbr || "N/A";

//         tr.append(sno, country, continent, capital, abbr);
//         table.appendChild(tr);
//     }
// }

// function createPaginationControls(parentDiv, table) {
//     const paginationDiv = document.createElement("div");
//     paginationDiv.classList.add("pagination-controls");

//     const prevButton = document.createElement("button");
//     prevButton.textContent = "Previous";
//     prevButton.disabled = currentPage === 1;
//     prevButton.addEventListener("click", () => {
//         if (currentPage > 1) {
//             currentPage--;
//             updateTable(table);
//         }
//     });

//     const nextButton = document.createElement("button");
//     nextButton.textContent = "Next";
//     nextButton.disabled = currentPage >= totalPages;
//     nextButton.addEventListener("click", () => {
//         if (currentPage < totalPages) {
//             currentPage++;
//             updateTable(table);
//         }
//     });

//     paginationDiv.append(prevButton, nextButton);
//     parentDiv.appendChild(paginationDiv);
// }

// async function updateTable(table) {
//     await createTableRows(table, currentPage);
//     document.querySelector(".pagination-controls button:first-child").disabled = currentPage === 1;
//     document.querySelector(".pagination-controls button:last-child").disabled = currentPage >= totalPages;
// }

// async function createTable(jsonURL) {
//     const resp = await fetch(jsonURL);
//     const json = await resp.json();
//     jsonData = json.data; 

//     totalPages = Math.ceil(jsonData.length / rowsPerPage);

//     const table = document.createElement('table');
//     createTableHeader(table);
//     await createTableRows(table, currentPage);

//     return table;
// }

// export default async function decorate(block) {
//     const countries = block.querySelector('a[href$=".json"]');
//     if (!countries || !countries.href) {
//         console.error("No JSON file found for table rendering.");
//         return;
//     }

//     const parentDiv = document.createElement('div');
//     parentDiv.classList.add('countries-block');

//     const table = await createTable(countries.href);
//     parentDiv.appendChild(table);

//     createPaginationControls(parentDiv, table);
//     countries.replaceWith(parentDiv);
// }

import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata("locale"));

let currentPage = 1;
let totalPages = 1;
let jsonData = [];

// Function to create table headers dynamically
async function createTableHeader(table) {
    let tr = document.createElement("tr");

    const headers = ["sNo", "countries", "continent", "capital", "abbreviation"];
    headers.forEach(headerKey => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(placeholders[headerKey] || headerKey)); 
        tr.appendChild(th);
    });

    table.appendChild(tr);
}

// Function to create a table row dynamically
async function createTableRow(table, row, i) {
    let tr = document.createElement("tr");

    let columns = ["sNo", "Country", "Continent", "Capital", "Abbreviation"];
    columns.forEach((col, index) => {
        let td = document.createElement("td");
        if (index === 0) {
            td.appendChild(document.createTextNode(i)); // Serial number
        } else {
            td.appendChild(document.createTextNode(row[col] || "-")); // Data from JSON
        }
        tr.appendChild(td);
    });

    table.appendChild(tr);
}

// Function to create and display the table
async function createTable({ jsonURL, offset, limit }) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous table

    // Fetch JSON data if not already loaded
    if (jsonData.length === 0) {
        const resp = await fetch(jsonURL);
        const json = await resp.json();
        jsonData = json.data;
        totalPages = Math.ceil(jsonData.length / limit);
    }

    const table = document.createElement('table');
    createTableHeader(table);

    // Apply offset and limit for pagination
    jsonData.slice(offset, offset + limit).forEach((row, i) => {
        createTableRow(table, row, offset + i + 1);
    });

    tableContainer.appendChild(table);
    updatePaginationControls(jsonURL, limit);
}

// Function to handle pagination navigation
function changePage(newPage, jsonURL, limit) {
    if (newPage < 1 || newPage > totalPages) return;

    currentPage = newPage;
    createTable({ jsonURL, offset: (currentPage - 1) * limit, limit });
}

// Function to update pagination controls dynamically
function updatePaginationControls(jsonURL, limit) {
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    let prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = (currentPage === 1);
    prevButton.onclick = () => changePage(currentPage - 1, jsonURL, limit);

    let pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    let nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = (currentPage === totalPages);
    nextButton.onclick = () => changePage(currentPage + 1, jsonURL, limit);

    paginationContainer.append(prevButton, pageInfo, nextButton);
}

// Function to decorate the block dynamically
export default async function decorate(block) {
    const countriesLink = block.querySelector('a[href$=".json"]');

    if (countriesLink) {
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'tableContainer';

        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationControls';

        block.appendChild(tableContainer);
        block.appendChild(paginationContainer);

        createTable({ jsonURL: countriesLink.href, offset: 0, limit: 20 });
        countriesLink.remove(); // Remove the original JSON link
    }
}

