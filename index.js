const pinboardInput = document.getElementById("pinboard-input")
const fromInput = document.getElementById("from-input")
const toInput = document.getElementById("to-input")
const publishBtn = document.getElementById("publish-btn")
let msgList = document.getElementById("msg-list")


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://public-message-pinboard-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messageListInDB = ref(database, "messageList")
const fromListInDB = ref(database, "fromList")
const toListInDB = ref(database, "toList")

publishBtn.addEventListener("click", function() {
    // let newMsg = `To ${toInput.value} <br> ${pinboardInput.value} <br> From ${fromInput.value}`
    let msgInput = pinboardInput.value
    let fromPerson = fromInput.value
    let toPerson = toInput.value

    push(messageListInDB, msgInput)
    push(fromListInDB, fromPerson)
    push(toListInDB, toPerson)
    
    clearInputFields()
})

onValue(messageListInDB, function(snapshotMsg) {
    onValue(fromListInDB, function(snapshotFrom) {
        onValue(toListInDB, function(snapshotTo) {
            if (snapshotMsg.exists()) {
                let messagesArray = Object.entries(snapshotMsg.val())
                let fromArray = Object.entries(snapshotFrom.val())
                let toArray = Object.entries(snapshotTo.val())

                clearMsgListEl()

                for (let i = 0; i < messagesArray.length; i++) {
                    let x = messagesArray.length - 1 - i
                    let messageItem = messagesArray[x]
                    let fromItem = fromArray[x]
                    let toItem = toArray[x]

                    appendItemToMessageList(messageItem, fromItem, toItem)
                }
            } else {
                msgList.innerHTML = "No messages here... yet"
            }
        })
    })
})


function clearMsgListEl() {
    msgList.innerHTML = ""
}



function clearInputFields() {
    pinboardInput.value = ""
    fromInput.value = ""
    toInput.value = ""
}

console.log("NOW?")

function appendItemToMessageList(messageStored, fromStored, toStored) {
    let messageID = messageStored[0]
    let messageValue = messageStored[1]

    let fromID = fromStored[0]
    // if (fromStored[1] === "") {}
    let fromValue = fromStored[1]

    let toID = toStored[0]
    let toValue = toStored[1]

    let newEl = document.createElement("li")
    if (fromValue === "" && toValue === "" && messageValue === "") {
        newEl.innerHTML = `<p class='message-element'>There's nothing here 😕<p>`
    } else if (fromValue === "" && toValue === "") {
        newEl.innerHTML = `<p class='message-element'>${messageValue}<p>`
    } else if (fromValue === "") {
        newEl.innerHTML = `<p class='to-element'>To ${toValue}</p> <p class='message-element'>${messageValue}<p>`
    } else if (toValue === "") {
        newEl.innerHTML = `<p class='message-element'>${messageValue}<p> <p class='from-element'>From ${fromValue}</p>`
    } else {
        newEl.innerHTML = `<p class='to-element'>To ${toValue}</p> <p class='message-element'>${messageValue}<p> <p class='from-element'>From ${fromValue}</p>`
    }
    msgList.append(newEl)


    newEl.addEventListener("dblclick", function() {
        let exactLocationOfMessageInDB = ref(database, `messageList/${messageID}`)
        let exactLocationOfFromInDB = ref(database, `fromList/${fromID}`)
        let exactLocationOfToInDB = ref(database, `toList/${toID}`)

        remove(exactLocationOfMessageInDB)
        remove(exactLocationOfFromInDB)
        remove(exactLocationOfToInDB)
    })


}