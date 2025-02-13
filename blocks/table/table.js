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

/**
 * Creates the table header
 */
async function createTableHeader(table) {
    let tr = document.createElement("tr");

    let sno = document.createElement("th"); sno.textContent = sNo;
    let country = document.createElement("th"); country.textContent = countries;
    let continentH = document.createElement("th"); continentH.textContent = continent;
    let capitalH = document.createElement("th"); capitalH.textContent = capital;
    let abbr = document.createElement("th"); abbr.textContent = abbreviation;

    tr.append(sno, country, continentH, capitalH, abbr);
    table.appendChild(tr);
}

/**
 * Creates the table rows dynamically
 */
async function createTableRows(table, jsonData) {
    table.innerHTML = ""; // Clear existing table content

    jsonData.forEach((row, index) => {
        let tr = document.createElement("tr");

        let sno = document.createElement("td"); sno.textContent = (currentPage - 1) * rowsPerPage + index + 1;
        let country = document.createElement("td"); country.textContent = row.Country || "N/A";
        let continent = document.createElement("td"); continent.textContent = row.Continent || "N/A";
        let capital = document.createElement("td"); capital.textContent = row.Capital || "N/A";
        let abbr = document.createElement("td"); abbr.textContent = row.Abbreviation || row.abbr || "N/A";

        tr.append(sno, country, continent, capital, abbr);
        table.appendChild(tr);
    });
}

/**
 * Creates pagination controls
 */
function createPaginationControls(parentDiv, table, jsonURL) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination-controls");

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            const offset = (currentPage - 1) * rowsPerPage;
            const newTable = await createTable(jsonURL, offset, rowsPerPage);
            parentDiv.replaceChild(newTable, table);
        }
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage >= totalPages;
    nextButton.addEventListener("click", async () => {
        if (currentPage < totalPages) {
            currentPage++;
            const offset = (currentPage - 1) * rowsPerPage;
            const newTable = await createTable(jsonURL, offset, rowsPerPage);
            parentDiv.replaceChild(newTable, table);
        }
    });

    paginationDiv.append(prevButton, nextButton);
    parentDiv.appendChild(paginationDiv);
}

/**
 * Fetches data from API using offset and limit
 */
async function createTable(jsonURL, offset = 0, limit = 20) {
    const urlWithParams = `${jsonURL}?offset=${offset}&limit=${limit}`;
    const resp = await fetch(urlWithParams);
    const json = await resp.json();
    
    if (!json.data || !json.totalRecords) {
        console.error("Invalid API response format.");
        return document.createElement("div");
    }

    totalPages = Math.ceil(json.totalRecords / limit); // Ensure pagination is correct

    const table = document.createElement('table');
    createTableHeader(table);
    await createTableRows(table, json.data);

    return table;
}

/**
 * Decorates the block by rendering the table and pagination
 */
export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    if (!countries || !countries.href) {
        console.error("No JSON file found for table rendering.");
        return;
    }

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('countries-block');

    const table = await createTable(countries.href, 0, rowsPerPage);
    parentDiv.appendChild(table);

    createPaginationControls(parentDiv, table, countries.href);
    countries.replaceWith(parentDiv);
}
