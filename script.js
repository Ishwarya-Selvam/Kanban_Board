const addBtn = document.querySelector(".add-btn")
const addTask = document.querySelector(".model-container")
const priorityColorContainer = document.querySelector(".priority_color_container")
const priorityColorArray = document.querySelectorAll(".priority_color")
const textArea = document.querySelector("textarea")
const pendingContainer = document.querySelector(".pending_container")
const finishedContainer = document.querySelector(".finished_container")
const toolboxPriorityContainer = document.querySelector(".toolbox-priority")
const deleteBtn = document.querySelector(".delete-btn")
let colorList = ['pink', 'blue', 'violet', 'green'] 
let allTickets = localStorage.getItem("localTicket")||[]
let isFromLocalStorage = false

if(typeof allTickets === "string"){
    allTickets = JSON.parse(allTickets)
    populateUI()
}

function populateUI(){
    isFromLocalStorage = true
    allTickets.forEach((ticket) => {
        const {color, content, id, isPending} = ticket
        createNewTicket(color, content, id, isPending)
    })
    isFromLocalStorage = false
}

addBtn.addEventListener("click", () => {
    addTask.style.display = "flex"
})

priorityColorContainer.addEventListener("click", (e) => {
    if(e.target == e.currentTarget)
        return
    priorityColorArray.forEach((color) => {
        color.classList.remove('active')
    })

    e.target.classList.add("active")
})

addTask.addEventListener("keypress", (e) => {
    if(e.key != 'Enter')
        return

    const activeColorElement = priorityColorContainer.querySelector(".active")
    const cColor = activeColorElement.classList[1]
    const content = textArea.value
    const { randomUUID } = new ShortUniqueId({ length: 10 });
    const id = randomUUID()

    console.log(cColor)
    console.log(textArea.value)
    console.log(id)

    textArea.value = " "
    addTask.style.display = 'none'

    createNewTicket(cColor, content, id, true)
})

toolboxPriorityContainer.addEventListener("click", (e) => {
    if(e.target === e.currentTarget)
        return

    const selectedColorElement = e.target
    const selectedColor = selectedColorElement.classList[1]

    const ticketContainer = document.querySelectorAll(".ticket_container")

    for(let i=0; i<ticketContainer.length; i++){
        const ticketColor = ticketContainer[i].querySelector(".ticket_color")
        const cTicketColor = ticketColor.classList[1]
        if(cTicketColor !== selectedColor)
            ticketContainer[i].style.display = 'none'
        else
            ticketContainer[i].style.display = 'block'
    }  
})

toolboxPriorityContainer.addEventListener("dblclick", (e) => {
    if(e.target === e.currentTarget)
        return

    const ticketContainer = document.querySelectorAll(".ticket_container")
    for(let i=0; i<ticketContainer.length; i++){
        ticketContainer[i].style.display = 'block'
    }  

})

deleteBtn.addEventListener("click", (e) => {
    e.target.classList.toggle("red")
})
{/* <div class="ticket_container">
        <div class="ticket_color pink"></div>
        <div class="ticket_id">id</div>
        <div class="ticket_area">Planning outing</div>
        <div class="lock_unlock">
            <i class="fa fa-lock"></i>
        </div>
    </div> */}

function createNewTicket(color, content, id, isPending){
    const tContainer = document.createElement("div")
    tContainer.setAttribute("class", "ticket_container")
    tContainer.setAttribute("draggable", true)
    tContainer.innerHTML = `
    <div class="ticket_color ${color}"></div>
    <div class="ticket_id">#${id}</div>
    <div class="ticket_area">${content}</div>
    <div class="lock_unlock">
        <i class="fa fa-lock"></i>
    </div>`

    if(isPending){
        pendingContainer.appendChild(tContainer)
    }
    else{
        finishedContainer.appendChild(tContainer)
    }
    
    if(!isFromLocalStorage){
        let ticketObj = {
            id,
            color,
            content,
            isPending
        }
    
        allTickets.push(ticketObj)
        updateLocalStorage()
    }
    
    const colorArea = tContainer.querySelector(".ticket_color")
    colorArea.addEventListener("click", toggleColor)

    const textArea = tContainer.querySelector(".ticket_area")
    const lockArea = tContainer.querySelector(".lock_unlock")
    lockArea.addEventListener("click", (e) => lockUnlock(e, textArea))

    tContainer.addEventListener("click", handleContainerClick)
}

function toggleColor(e){
    let curentColor = e.target.classList[1]
    let cindex = colorList.indexOf(curentColor)
    let nxtind = (cindex+1)%colorList.length

    e.target.classList.remove(curentColor)
    e.target.classList.add(colorList[nxtind])
}

function lockUnlock(e, textArea){
    const isLocked = e.target.classList.contains("fa-lock")

    if(isLocked){
        e.target.classList.remove("fa-lock")
        e.target.classList.add("fa-unlock")
        textArea.setAttribute("contenteditable",true)

    }
    else{
        e.target.classList.remove("fa-unlock")
        e.target.classList.add("fa-lock")
    }
}

function handleContainerClick(e){
    const isDeleteMode = deleteBtn.children[0].classList.contains("red")

    if(!isDeleteMode)
        return

    e.currentTarget.remove()
}

function updateLocalStorage(){
    localStorage.setItem("localTicket", JSON.stringify(allTickets))
}