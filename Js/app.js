const url = "http://localhost:3301/events";

// Function to capture data from form once this has been charged on DOM
function initAddEvent(){
    const form = document.getElementById('eventForm');

    if(!form){
        console.warn("It hasn't found any form of 'Event' on DOM.")
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const id = document.getElementById('id').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const capacity = document.getElementById('capacity').value; 
        

        const data = {
            id: String(id),
            name: name,
            description: description,
            date: date,
            capacity: parseInt(capacity),

        };

        try{
            const resultado = await addEvent(data);
            console.log('Event registered:', resultado);
            form.reset();
            await getEvents();
        }catch(error){
            console.info('Error to create: ', error);
        }
    });
}

// GET method
async function getEvents(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        const tableResults = document.querySelector("#showEventsTable tbody");

        if(Array.isArray(result)){
            let html = '';
            result.forEach(event_obj => {
                html += `
                <tr>
                    <td>${event_obj.id}</td>
                    <td>${event_obj.name}</td>
                    <td>${event_obj.description}</td>
                    <td>${event_obj.date}</td>
                    <td>${event_obj.capacity}</td>
                    
                    <td>
                        <button class="btn edit-btn" data-id="${event_obj.id}">Edit</button><button class="btn delete-btn" data-id="${event_obj.id}">Delete</button>
                    </td>
                </tr>
                `;
            });
            
            tableResults.innerHTML = html;
        } else{
            throw new Error('The response of server is not a valid array.');
        }


    } catch (error) {
        console.info('Error to get data: ', error);
    }
};

getEvents();


// POST method
async function addEvent(student){
 // We call this function to validate before to receive data
    if(!validateEvent(student)){
        console.log("Invalid event, wont be sended to server.");
        return; // exit the application if the data is incorrect
    }

    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        };

        const result = await response.json();
        alert("Event created successfully !");
        console.log("Sucessfully added.");
        return result;
    }catch(error){
        console.log("It was presented an error.", error)
        throw error;
    }

}
// function to validate before to receive data
function validateEvent(eventA){
    if(!eventA.id || !eventA.name || !eventA.description || typeof eventA.capacity !== "number" || !eventA.date){
        console.log("It was presented a failure.");
        return false;
    }
    return true;
}


// PUT method
async function updateEvents(eventToUpdate){
    try{
        const response = await fetch(`${url}/${eventToUpdate.id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(eventToUpdate)
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("Event updated: ", result);
        alert("Event updated successfully.");
        

    } catch(error){
        console.log("Error to update.");
    }
}


// Delete method
async function deleteStudents(id){

    try{
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        alert("Event deleted successfully. ");

    } catch(error){
        throw new Error('Error to delete: ', error);
    }

}




document.addEventListener('click', async function (event) {
    if(event.target.classList.contains('delete-btn')){
        const id = event.target.getAttribute('data-id');

        if(confirm(` Are you sure of deleting event with ID number: ${id}?`)){
            try{
                await deleteStudents(id);
                await getEvents();   // Refresh the table
            } catch (err) {
                console.log('Error deleting event: ', err);
            }
        }

    }


    if(event.target.classList.contains('edit-btn')){
        const id = event.target.getAttribute('data-id');
        const container = document.getElementById('content');

        try{
            const response = await fetch(`${url}/${id}`);
            const data = await response.json();
            
            container.innerHTML = `
                <form id="edit-form"><h4>Edit Booking:</h4><label>Name:</label><input type="text" value=${data.name} placeholder="${data.name}"></input><label>Description:</label><input type="text" value=${data.description} placeholder="${data.description}"></input><label>Date:</label><input type="date" value=${data.date} placeholder="${data.date}"></input><label>Capacity:</label><input type="number" value=${data.capacity} placeholder="${data.capacity}"></input><button type="submit">Save Edits</button></form>
            `
            
            const form = document.getElementById('edit-form');

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const childrens = form.childNodes;
                
                const newStudent = {
                    id,
                    name: childrens[2].value,
                    description: childrens[4].value,
                    date: childrens[6].value,
                    capacity: childrens[8].value,
                    
                }

                updateEvents(newStudent)
                .then(res => window.location.reload())
                .then(err => console.error(err))
            })

        } catch(err){

        }

    }



})