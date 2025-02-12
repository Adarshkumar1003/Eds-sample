import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

const { allCountries,abbreviation,africa,america,asia,australia,capital,continent,countries,europe,sNo} = placeholders;


// async function createTableHeader(table){
//     let tr=document.createElement("tr");
//     let sno=document.createElement("th");sno.appendChild(document.createTextNode(sNo));
//     let conuntry=document.createElement("th");conuntry.appendChild(document.createTextNode(countries));
//     let continenth=document.createElement("th");continenth.appendChild(document.createTextNode(continent));
//     let capitalh=document.createElement("th");capitalh.appendChild(document.createTextNode(capital));
//     let abbr=document.createElement("th");abbr.appendChild(document.createTextNode(abbreviation));
//     tr.append(sno);tr.append(conuntry);tr.append(capitalh);tr.append(continenth);tr.append(abbr);
//     table.append(tr);
// }
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
async function createTableRow(table,row,i){
    let tr=document.createElement("tr");
    let sno=document.createElement("td");sno.appendChild(document.createTextNode(i));
    let conuntry=document.createElement("td");conuntry.appendChild(document.createTextNode(row.Country));
    let continent=document.createElement("td");continent.appendChild(document.createTextNode(row.Continent));
    let capital=document.createElement("td");capital.appendChild(document.createTextNode(row.Capital));
    let abbr=document.createElement("td");abbr.appendChild(document.createTextNode(row.Abbreviation));
    tr.append(sno);tr.append(conuntry);tr.append(continent);tr.append(capital);tr.append(abbr);
    table.append(tr);
}

async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL).href;
    }
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON=====> {} ",json);
    
    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row,i) => {

        createTableRow(table,row,(i+1));

      
    });
    
    return table;
}    

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    console.log(countries);
    const parentDiv=document.createElement('div');
    parentDiv.classList.add('contries-block');

    if (countries) {
        parentDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parentDiv);
        
    }
    
}
