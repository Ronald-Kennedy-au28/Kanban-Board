
const addBtn = document.querySelector('.add-btn')
const delBtn = document.querySelector('.del-btn')
const taskCont = document.querySelector('.task-cont')
const textArea = document.querySelector('textarea')
const mainCont = document.querySelector('.main')
const taskColor = document.querySelectorAll('.task-color')
const allPriorityColor = document.querySelectorAll('.color')

let isTaskOpen = false;
let deleteColor = false;
let priorityColor = "red"
let uid = new ShortUniqueId();
let colors = ['red','blue','green','grey']
let ticketArr = []

if(localStorage.getItem("Kanban")){
    let localArr = JSON.parse(localStorage.getItem("Kanban"))
    for(let i=0;i<localArr.length;i++){
        let ticket = localArr[i]
        createTicket(ticket.id,ticket.text,ticket.color)
    }
}

// "Add Button Open and Close"
addBtn.addEventListener("click",()=>{
    if(isTaskOpen){
        taskCont.style.display = "none"
        // isTaskOpen = false
    }
    else{
        taskCont.style.display = "flex"
        // isTaskOpen = true
    }
    isTaskOpen = !isTaskOpen
})

// "Delete button color change"
delBtn.addEventListener("click",()=>{
    if(deleteColor){
        delBtn.style.color = "cadetblue"
    }else{
        delBtn.style.color = "red"
    }
    deleteColor = !deleteColor
})

// "Capturing event when clicked 'ENTER' in the textArea"
textArea.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){
        taskCont.style.display = "none"; // Closing "taskBox"
        isTaskOpen = !isTaskOpen;
        createTicket(undefined,textArea.value,priorityColor) // Creating ticket
        textArea.value = ""
    }
})

// Ticket and deleting it
function createTicket(ticketId,text,color){
    if(text == ""){
        alert("Task cannot be empty");
        return
    }
    let id ;
    if(ticketId){
        id = ticketId
    }else{
        id = uid.rnd()
    }
    const ticket = document.createElement('div')
    mainCont.append(ticket)
    ticket.className = "ticket";
    ticket.innerHTML = `<div class="ticket-color ${color}"></div>
                    <div class="ticket-id">#${id}</div>
                    <div class="ticket-content">${text}</div>
                    <div class="lock-unlock">
                        <i class="fa-solid fa-lock"></i>
                    </div>`   
    ticketArr.push({id:id,text:text,color:color})
    localStorage.setItem("Kanban",JSON.stringify(ticketArr))                
    // Deleting
    ticket.addEventListener("click",()=>{
        if(deleteColor){
            ticket.remove()  // removes the ticket from Main
            let index = ticketArr.findIndex((tick)=>{ // finding index to remove element
                return tick.id == id;
            })
            ticketArr.splice(index,1)
            localStorage.setItem("Kanban",JSON.stringify(ticketArr)) // updating the localStorage
        }
    })

    //
    const lockUnlock = ticket.querySelector('.fa-solid');
    const ticketContent = ticket.querySelector('.ticket-content')
    lockUnlock.addEventListener('click',(e)=>{
        if(e.target.classList.contains('fa-lock')){
            e.target.classList.remove('fa-lock');
            e.target.classList.add('fa-lock-open');
            // ticketContent.setAttribute('contenteditable',true);
            ticketContent.contentEditable = true;
            ticketContent.style.border = "3px solid honeydew";
            ticketContent.style.outlineColor = "honeydew";

        }else{
            e.target.classList.remove('fa-lock-open');
            e.target.classList.add('fa-lock');
            // ticketContent.setAttribute('contenteditable',false);
            ticketContent.contentEditable = false;
            ticketContent.style.border = "none";
            let index = ticketArr.findIndex((tick)=>{ 
                return tick.id == id;
            })
            ticketArr[index].text = ticketContent.innerText
            localStorage.setItem("Kanban",JSON.stringify(ticketArr))

        }
    })


    const ticketColor = ticket.querySelector('.ticket-color');
    ticketColor.addEventListener('click',(e)=>{
        let currentColor = ticketColor.classList[1]
        e.target.classList.remove(currentColor)
        let currentColorIndex ;
        // let currentColorIndex = colors.indexOf(currentColor)
        for(let k=0;k<colors.length;k++){
            if(currentColor == colors[k]){
                currentColorIndex = k;
                break;
            }
        }
        console.log(currentColorIndex)
        let nextColorIndex = currentColorIndex+1 == colors.length ? 0 : currentColorIndex+1
        // let nextColorIndex = (currentColorIndex+1)%colors.length
        e.target.classList.add(colors[nextColorIndex])
        let index = ticketArr.findIndex((tick)=>{ 
            return tick.id == id;
        })
        ticketArr[index].color = colors[nextColorIndex]
        localStorage.setItem("Kanban",JSON.stringify(ticketArr))
    })
    
    
}

// highlighting the color in the taskBox and saving the color
for(let i=0; i<taskColor.length;i++){ // loop for event
    taskColor[i].addEventListener("click",(e)=>{
        for(let j=0;j<taskColor.length;j++){ // loop for removing the class-highlighting color
            if(taskColor[j].classList.contains("active-border"))
                taskColor[j].classList.remove("active-border")
        }
        e.target.classList.add("active-border") // adding the color to target
        priorityColor = e.target.classList[1]   // saving the color for priority global
    })    
}


for(let i=0;i<allPriorityColor.length;i++){
    allPriorityColor[i].addEventListener("click",(e)=>{
        let selectedColor = e.target.classList[1]
        let ticketColors = document.querySelectorAll('.ticket-color')
        for(let j=0;j<ticketColors.length;j++){
            let ticket_Color = ticketColors[j].classList[1]
            if(selectedColor == ticket_Color){
                ticketColors[j].parentElement.style.display = "block"
            }else{
                ticketColors[j].parentElement.style.display = "none"
            }
        }
    })
    
    allPriorityColor[i].addEventListener("dblclick",()=>{
        const allTickets = document.querySelectorAll('.ticket')
        for(let j=0;j<allTickets.length;j++){
            allTickets[j].style.display = "block"
        }
    })
}
