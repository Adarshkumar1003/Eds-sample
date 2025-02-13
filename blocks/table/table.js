import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata("locale"));

const { 
    allCountries = "All Countries", 
    abbreviation = "Abbreviation", 
    capital = "Capital", 
    continent = "Continent", 
    countries = "Countries", 
    sNo = "S. No" 
} = placeholders;

const rowsPerPage = 20;  
let currentPage = 1;
let totalPages = 1;
let jsonData = []; 

/**
 * Creates the table header
 */
function createTableHeader(table) {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    let sno = document.createElement("th"); sno.textContent = sNo;
    let country = document.createElement("th"); country.textContent = countries;
    let continentH = document.createElement("th"); continentH.textContent = continent;
    let capitalH = document.createElement("th"); capitalH.textContent = capital;
    let abbr = document.createElement("th"); abbr.textContent = abbreviation;

    tr.append(sno, country, continentH, capitalH, abbr);
    thead.appendChild(tr);
    table.appendChild(thead);
}

/**
 * Creates the table rows dynamically without removing the headers
 */
async function createTableRows(table, page) {
    let tbody = table.querySelector("tbody") || document.createElement("tbody");
    tbody.innerHTML = "";  // Clears only table body, keeping headers intact

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, jsonData.length);

    for (let i = startIndex; i < endIndex; i++) {
        let row = jsonData[i];
        let tr = document.createElement("tr");

        let sno = document.createElement("td"); sno.textContent = i + 1;
        let country = document.createElement("td"); country.textContent = row.Country || "N/A";
        let continent = document.createElement("td"); continent.textContent = row.Continent || "N/A";
        let capital = document.createElement("td"); capital.textContent = row.Capital || "N/A";
        let abbr = document.createElement("td"); abbr.textContent = row.Abbreviation || row.abbr || "N/A";

        tr.append(sno, country, continent, capital, abbr);
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
}

/**
 * Creates pagination controls
 */
function createPaginationControls(parentDiv, table) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination-controls");

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable(table);
        }
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage >= totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable(table);
        }
    });

    paginationDiv.append(prevButton, nextButton);
    parentDiv.appendChild(paginationDiv);
}

/**
 * Updates the table with new data while keeping headers intact
 */
async function updateTable(table) {
    await createTableRows(table, currentPage);
    document.querySelector(".pagination-controls button:first-child").disabled = currentPage === 1;
    document.querySelector(".pagination-controls button:last-child").disabled = currentPage >= totalPages;
}

/**
 * Fetches JSON data and creates the table
 */
async function createTable(jsonURL) {
    const resp = await fetch(jsonURL);
    const json = await resp.json();
    jsonData = json.data; 

    totalPages = Math.ceil(jsonData.length / rowsPerPage);

    const table = document.createElement('table');
    createTableHeader(table); // Ensures the header is created
    await createTableRows(table, currentPage);

    return table;
}

/**
 * Main function that initializes the table inside the block
 */
export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    if (!countries || !countries.href) {
        console.error("No JSON file found for table rendering.");
        return;
    }

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('countries-block');

    const table = await createTable(countries.href);
    parentDiv.appendChild(table);

    createPaginationControls(parentDiv, table);
    countries.replaceWith(parentDiv);
}
