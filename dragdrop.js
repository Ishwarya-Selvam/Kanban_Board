const containers = document.querySelectorAll(".container")

console.log(containers)
let draggedTicket = null

containers.forEach((container) => {
    container.addEventListener("dragstart", (e) => {
        draggedTicket = e.target
        e.target.style.opacity = "0.5"
        console.log("drag start", e.target)
    })
    container.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1"
    })
    container.addEventListener("dragover", (e) => {
        e.preventDefault()
    })
    container.addEventListener("drop",(e)=>{

        const dropContainer = e.target;
        console.log(dropContainer)

        const isPending = dropContainer.classList[0] === "pending_cont";
        console.log(isPending)

        const ticketId = draggedTicket.querySelector(".ticket_id").innerText.split("#")[1];

        const ticketObj = allTickets.find((ticket)=>{
            return ticket.id===ticketId;
        })
        // if(!isPending)
        //     ticketObj.isPending = !isPending;
        // else    
        ticketObj.isPending = isPending;

        updateLocalStorage();

        dropContainer.appendChild(draggedTicket);




     })
})