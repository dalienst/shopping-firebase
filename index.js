import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase configuration
const appSettings = {
    databaseURL: "https://shopping-list-852e3-default-rtdb.firebaseio.com/",
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


// DOM manipulation
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Adding data to the database
addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value

    push(shoppingListInDB, inputValue)

    clearInputFieldEl()
})

// fetching the data from the database
onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {
        let items = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < items.length; i++) {
            let itemList = items[i]

            appendItemList(itemList)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }

})

// Other functions
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
function clearInputFieldEl() {
    inputFieldEl.value = ""
}
// function appendItemList(itemValue) {
//     shoppingListEl.innerHTML += `<li>
//     ${itemValue}
//     <span><button>&#9747</button></span>
//     </li>`
// }
function appendItemList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    let spanEl = document.createElement("span")
    let btnEl = document.createElement("button")

    newEl.textContent = itemValue
    btnEl.textContent = "X"

    // Deleting an item
    btnEl.addEventListener("click", function () {
        let exactLocationInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationInDB)
    })
    spanEl.append(btnEl)
    newEl.append(spanEl)

    shoppingListEl.append(newEl)
}

