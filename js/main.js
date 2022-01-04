    let detailResult;
    let counter = 1;
// closure will run as soon as the page loads
(function () {
    
    const listContent = document.querySelector("#listContent");
    const detailContent = document.querySelector("#detailContent");
    const selectSort = document.querySelector("#selectSort");
    const inputFilter = document.querySelector("#inputFilter");
    const spriteContent = document.querySelector("#spriteContent");
    const nextButton = document.querySelector("#nextButton");
    const prevButton = document.querySelector("#prevButton");
    const logoButton = document.querySelector("#logoButton");
    const listPosition = document.querySelector("#listPosition");
    const commentBox = document.querySelector("#commentBox");

    let result; // result wird deklariert ohne Wert
    let filteredResult;
    let pokeUrl;
        
    // async closure so we can take advantage of the await syntax
    (async function() {
        const url = "https://pokeapi.co/api/v2/pokemon"; // Achtung: API Struktur Objekt vor Array {} = vor results[{},{},...] {"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=20&limit=20","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},
        result = await fetchData(url); // erhält result aus API
        console.log(result);
        console.log(counter);
        sortAndFilter();
    })();

    listContent.addEventListener("click", function(event) {
        if (event.target.tagName !== "BUTTON") {
            return;
        }

        const url = event.target.dataset.index;
        // console.log(pokeUrl);  
        
        (async function() {
            detailResult = await fetchDetail(url);
            // console.log(detailResult);
            
            detailContent.innerHTML = createDetails(detailResult);
            spriteContent.innerHTML = createSprites(detailResult);
        })();
    });

    selectSort.addEventListener("change", function(event) {
        sortAndFilter();
    });

    inputFilter.addEventListener("input", function() {
        sortAndFilter();
    });

    nextButton.addEventListener("click", async function(event) {
        if(counter===1099) {
            console.log("sorry, no more monsters above");
            commentBox.style.display = "inline";
            commentBox.innerHTML="sorry, no more monsters above 1118";
            return;
        }
        commentBox.style.display = "none";
        commentBox.innerHTML="";
        pokeUrl = result.next;
        console.log(pokeUrl);
        result = await fetchMore(pokeUrl);
        console.log("nextButton clicked");
        // console.log(result);
        counter += result.results.length;
        console.log(counter);
        listPosition.innerHTML=`${counter} - ${counter+19}`;
        sortAndFilter(result);
    })

    prevButton.addEventListener("click", async function(event) {
        if(counter===1) {
            console.log("sorry, no more monsters below");
            commentBox.style.display = "inline";
            commentBox.innerHTML="sorry, no more monsters below 0";
            return;
        }
        commentBox.style.display = "none";
        commentBox.innerHTML="";
        pokeUrl = result.previous;
        console.log(pokeUrl);
        result = await fetchMore(pokeUrl);
        console.log("prevButton clicked");
        // console.log(result);
        counter -= result.results.length;
        console.log(counter);
        listPosition.innerHTML=`${counter} - ${counter+19}`;
        sortAndFilter(result);
    })

    logoButton.addEventListener("click", function(event) {

        inputFilter.value = "";
        selectSort.value = "Name ASC";  
        location.reload();
    })

    function sortAndFilter() {
        console.log(result.results); // result von fetchData ist JSON-Datenpaket. result.results ist das Array of objects
        const searchTerm = inputFilter.value;
        filteredResult = filterByName(result.results, searchTerm); // Die einzige relevante Änderung für listContent ist hier. 
        
        if (selectSort.value === "nameAsc") {
            filteredResult = sortByNameASC(filteredResult);
            
        } else if (selectSort.value === "nameDesc") {
            filteredResult = sortByNameDESC(filteredResult);

        } else if (selectSort.value === "userAsc") {
            filteredResult = sortByUserASC(filteredResult);
            
        } else if (selectSort.value === "userDesc") {
            filteredResult = sortByUserDESC(filteredResult);
        }  

        listContent.innerHTML = createList(filteredResult);
    }
    
})();

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const result = await response.json();

        return result;
    } catch (error) {
        console.log(error);
    }
}

async function fetchDetail(url) {
    try {
        const response = await fetch(url);
        const result = await response.json();

        return result;
    } catch (error) {
        console.log(error);
    }
}

async function fetchMore(url) {
    console.log("script called me - fetchMore");
    
    try {
        const response = await fetch(url);
        const result = await response.json();

        return result;
    } catch (error) {
        console.log(error);
    }
}

function createList(data) {
    let list = "<table><tr><th>Name</th><td>    </td><th>   details</th></tr>";
    for (let i = 0; i < data.length; i++) {
        list += "<tr>";
        list += `<td>${data[i].name}</td>`;
        list += `<td>   </td>`;
        list += `<td><button class = "button1" data-index="${data[i].url}">   infos</button></td>`;
        list += "</tr>";
    }
    list += "</table>";
    return list;
}

function createDetails(data) {
    
    let list = `<ul class ="a">`;
    // console.log(`base experience: ${userData.base_experience}`);
    // console.log(`ability: ${userData.abilities[1].ability.name}`);
    // console.log(`moves: ${userData.moves.length}`);
    list += `<li><h2>name: ${detailResult.name}</li>`;
    list += `<li>base experience: ${detailResult.base_experience}</li>`;
    list += `<li>ability: ${detailResult.abilities[1].ability.name}</li>`;
    list += `<li>moves: ${detailResult.moves.length}</li>`;
    list += `</ul>`;
    list += `<br>
    
    <img width="320" src="${detailResult.sprites.other.dream_world.front_default}">`;
    return list;
}

function createSprites(data) {

    let sprites =`<img width="150" src="${detailResult.sprites.back_default}">
    <img width="150" src="${detailResult.sprites.back_shiny}">
    <img width="150" src="${detailResult.sprites.front_default}">
    <img width="150" src="${detailResult.sprites.front_shiny}">`;
    return sprites;
}

function sortByNameASC(dataArray) {
    const copyOfDataArray = [...dataArray];
    copyOfDataArray.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
    return copyOfDataArray;
}

function sortByNameDESC(dataArray) {
    const copyOfDataArray = [...dataArray];
    copyOfDataArray.sort(function(a, b) {
        return b.name.localeCompare(a.name);
    });
    return copyOfDataArray;
}

function sortByUserASC(dataArray) {
    const copyOfDataArray = [...dataArray];
    copyOfDataArray.sort(function(a, b) {
        return a.username.localeCompare(b.username);
    });
    return copyOfDataArray;
}

function sortByUserDESC(dataArray) {
    const copyOfDataArray = [...dataArray];
    copyOfDataArray.sort(function(a, b) {
        return b.username.localeCompare(a.username);
    });
    return copyOfDataArray;
}

function filterByName(dataArray, searchTerm) {
    const filteredResult = dataArray.filter(function(element) {
        return element.name.includes(searchTerm);
    });
    return filteredResult;
}
// it's working. Allthough it could be much smaller :)