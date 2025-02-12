import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

const { allCountries,abbreviation,africa,america,asia,australia,capital,continent,countries,europe,sNo} = placeholders;


async function createTableHeader(table){
    let tr=document.createElement("tr");
    let sno=document.createElement("th");sno.appendChild(document.createTextNode(sNo));
    let conuntry=document.createElement("th");conuntry.appendChild(document.createTextNode(countries));
    let continenth=document.createElement("th");continenth.appendChild(document.createTextNode(continent));
    let capitalh=document.createElement("th");capitalh.appendChild(document.createTextNode(capital));
    let abbr=document.createElement("th");abbr.appendChild(document.createTextNode(abbreviation));
    tr.append(sno);tr.append(conuntry);tr.append(capitalh);tr.append(continenth);tr.append(abbr);
    table.append(tr);
}
async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
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
export default async function decorate(city) {
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    const dropdown=document.getElementById('region');
      dropdown.addEventListener('change', () => {
        let url=countries.href;
        if(dropdown.value!='all'){
            url=countries.href+"?sheet="+dropdown.value;
        }
        const tableE=parientDiv.querySelector(":scope > table");
        let promise = Promise.resolve(createTable(url,dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
      });
  }