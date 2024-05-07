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



//Recupération du champs input via un click sur le bouton
const addButton = document.getElementById("addItemButton");

addButton.addEventListener("click", (event) => {

    let newArticle = document.getElementById("inputForm").value;
    let itemsList = [];

    if (newArticle) {
        if (localStorage.getItem("itemsList")) {

            itemsList = JSON.parse(localStorage.getItem("itemsList"));
            itemsList.push(newArticle);
            localStorage.setItem("itemsList", JSON.stringify(itemsList))
            refreshList();

        } else {
            itemsList.push(newArticle);
            localStorage.setItem("itemsList", JSON.stringify(itemsList))
            refreshList();
        }
    }
})




//generation de la liste
let listZone = document.getElementById("listZone");
let storage;

function showList() {

    let storage = JSON.parse(localStorage.getItem("itemsList"));

    storage.forEach((article) => {
        listZone.innerHTML +=
            "<li class='article' data-article='" + article + "'>"
            + "<span class='articleName'>" + article + "</span>"
            + "<span class='bought'>find it !</span>"
            + "<span class='delete'>delete</span></li>";
    });

    //configuration du bouton d'achat
    let boughtButtons = document.querySelectorAll('.bought');

    boughtButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            let target = event.target.closest('li').querySelector('.articleName');
            console.log(target);

            if (target.classList.contains('buy')) {
                target.classList.remove("buy");
            } else {
                target.classList.add("buy");
                button.classList.add("hide");
            }
        })
    })

    //configuration du bouton delete
    let deleteButtons = document.querySelectorAll('.delete');

    deleteButtons.forEach((button) => {
        button.addEventListener('click', (event) => {

            let itemToDelete = event.target.closest('li').dataset.article;

            let storage = JSON.parse(localStorage.getItem("itemsList"));

            storage.splice(storage.indexOf(itemToDelete), 1);

            localStorage.setItem("itemsList", JSON.stringify(storage));
            refreshList();
        });
    })

}

showList();

//fonction de refreshing de la liste
function refreshList() {
    listZone.innerHTML = "";
    showList();
}



