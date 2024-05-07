"use strict";

//Controle de l'utilisation possible du Localstorage
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0
        );
    }
}

if (storageAvailable("localStorage")) {
    console.log("local storage available")
} else {
    console.log("local storage unavailable")
}

//bouton pour clear le localstorage

const clearStorageButton = document.getElementById('deleteAll');

clearStorageButton.addEventListener('click', (event)=>{
    localStorage.clear();
    refreshList();
})


//Recupération du champs input via un click sur le bouton
const addButton = document.getElementById("addItemButton");

addButton.addEventListener("click", (event) => {

    if(document.getElementById("inputForm").value !== ""){
        const newArticle = {
            id: Math.floor(Math.random() * 10000),
            name: document.getElementById("inputForm").value,
            status: "to buy"
        }

        document.getElementById("inputForm").value = null;
        
        let itemsList = [];
        
        if (newArticle) {
            if (localStorage.getItem("itemsList")) {
        
                itemsList = JSON.parse(localStorage.getItem("itemsList"));
                itemsList.push(newArticle);
                localStorage.setItem("itemsList", JSON.stringify(itemsList));
                refreshList();
        
            } else {
                itemsList.push(newArticle);
                localStorage.setItem("itemsList", JSON.stringify(itemsList));
                refreshList();
            }
        }
    }
})




//generation de la liste
let listZone = document.getElementById("listZone");
let storage;

function showList() {

    let storage = JSON.parse(localStorage.getItem("itemsList"));

    storage.forEach((article) => {

        if (article.status !== "bought") {

            listZone.innerHTML +=
                "<li class='article' data-article='" + article.id + "'>"
                + "<span class='articleName'>" + article.name + "</span>"
                + "<span class='bought'><i class='fa-solid fa-dollar-sign'></i></span>"
                + "<span class='modify'><i class='fa-solid fa-pencil'></i></span>"
                + "<span class='delete'><i class='fa-solid fa-trash'></i></span></li>";

        } else {

            listZone.innerHTML +=
                "<li class='article' data-article='" + article.id + "'>"
                + "<span class='articleName buy'>" + article.name + "</span>"
                + "<span class='bought'><i class='fa-solid fa-dollar-sign'></i></span>"
                + "<span class='modify'><i class='fa-solid fa-pencil'></i></span>"
                + "<span class='delete'><i class='fa-solid fa-trash'></i></span></li>";

        }
    });

    //configuration du bouton d'achat
    let boughtButtons = document.querySelectorAll('.bought');

    boughtButtons.forEach((button) => {

        button.addEventListener('click', (event) => {
            let itemsList = JSON.parse(localStorage.getItem("itemsList"));
            let target = parseInt(event.target.closest('li').dataset.article);

            for (let count = 0; count < itemsList.length; count++) {
                if (itemsList[count].id === target) {

                    if(itemsList[count].status === "bought"){
                        itemsList[count].status = "to buy";
                    } else {
                        itemsList[count].status = "bought";
                    }

                    localStorage.setItem("itemsList", JSON.stringify(itemsList));
                    refreshList();

                }
            }
        })
    })

    //configuration du bouton delete
    let deleteButtons = document.querySelectorAll('.delete');

    deleteButtons.forEach((button) => {
        button.addEventListener('click', (event) => {

            if(window.confirm('Are you sure ?')){

                let target = parseInt(event.target.closest('li').dataset.article);
                console.log(target);
    
                let itemsList = JSON.parse(localStorage.getItem("itemsList"));
    
                for (let count = 0; count < itemsList.length; count++) {
                    if (itemsList[count].id === target) {
                        let newList = itemsList.filter((item) => item.id !== itemsList[count].id);
                        localStorage.setItem("itemsList", JSON.stringify(newList));
                        refreshList();
                    }
                }
            }
        });
    })

    //configuration du bouton modifier
    let modButtons = document.querySelectorAll('.modify');

    modButtons.forEach(button => {

        button.addEventListener('click', (event)=>{

            if(document.getElementById("inputForm").value !== ""){

                if(window.confirm('Are you sure ?')){

                    let target = parseInt(event.target.closest('li').dataset.article);
                    let newName = document.getElementById("inputForm").value;
                    document.getElementById("inputForm").value = null;
                    let itemsList = JSON.parse(localStorage.getItem("itemsList"));
            
                    for (let count = 0; count < itemsList.length; count++) {
                        if (itemsList[count].id === target) {
                            itemsList[count].name = newName;
                            localStorage.setItem("itemsList", JSON.stringify(itemsList));
                            refreshList();
                        }
                    }
                }  
            }
        })
    });
};


showList();

//fonction de refreshing de la liste
function refreshList() {
    listZone.innerHTML = "";
    showList();
}



