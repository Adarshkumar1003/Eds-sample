import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

const { allCountries, abbreviation, africa, america, asia, australia, capital, continent, countries, europe, sNo } = placeholders;

async function createTableHeader(table) {
    let tr = document.createElement("tr");
    let sno = document.createElement("th"); sno.textContent = sNo;
    let country = document.createElement("th"); country.textContent = countries;
    let continenth = document.createElement("th"); continenth.textContent = continent;
    let capitalh = document.createElement("th"); capitalh.textContent = capital;
    let abbr = document.createElement("th"); abbr.textContent = abbreviation;

    tr.append(sno, country, continenth, capitalh, abbr);
    table.appendChild(tr);
}

async function createTableRow(table, row, i) {
    let tr = document.createElement("tr");
    let sno = document.createElement("td"); sno.textContent = i;
    let country = document.createElement("td"); country.textContent = row.Country;
    let continent = document.createElement("td"); continent.textContent = row.Continent;
    let capital = document.createElement("td"); capital.textContent = row.Capital;
    let abbr = document.createElement("td"); abbr.textContent = row.Abbreviation;

    tr.append(sno, country, continent, capital, abbr);
    table.appendChild(tr);
}

async function createTable(jsonURL, val) {
    let pathname = val ? jsonURL : new URL(jsonURL).href;

    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON Data=====>", json);

    const table = document.createElement('table');
    await createTableHeader(table);
    
    json.data.forEach((row, i) => {
        createTableRow(table, row, i + 1);
    });

    return table;
}

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');

    if (!countries || !countries.href) {
        console.error("No JSON file found for table rendering.");
        return;
    }

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('countries-block');

    parentDiv.append(await createTable(countries.href, null));
    countries.replaceWith(parentDiv);
}
