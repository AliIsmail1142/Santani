//input fields
const txtname = document.getElementById("name");
const txtemail = document.getElementById("email");
const txtoccupants = document.getElementById("totalOccupants");
const txtroom = document.querySelector("#room-selection");
const txtmeal = document.querySelector("#meal-selection");
const txtextra = document.querySelector("#extra-selection");
const totalDays = document.getElementById("days");
const date = document.getElementById("date");
const email = document.getElementById("email");

//output areas
const currenReservations = document.getElementById("currentReservation");
const finalReservation = document.getElementById("finalReservations");

//buttons
const addBtn = document.getElementById("add");
const confirmBtn = document.getElementById("confirm");
const loyaltyBtn = document.getElementById("loyalty");
const addToFav = document.getElementById("addFav");
const reserveFav = document.getElementById("resFav");

const CURRENT = {
    room: "",
    occupants: 0,
    mealType: "",
    days: 0,
    extras: "",
    price: 0.0
};

const FINAL = {
    name: "",
    email: "",
    rooms: "",
    totalRooms: 0,
    occupants: 0,
    mealTypes: "",
    days: 0,
    extras: "",
    price: 0.0,
    loyalty: 0
};

let noOfRooms = 0; //to calculate the loyalty points
let roomsFromFav = 0;

let first = true;
addBtn.onclick = function() {

    if(email.value == "" || totalDays.value == 0 || date.value == "" || txtoccupants.value == 0 || txtroom.value == "" || txtmeal.value =="" || txtname.value == ""){
        alert("Please fill the required form elements.")
    }else{

    if(roomsFromFav == 0){
        noOfRooms = 1;
    }else{
        noOfRooms = 0;
    }
    
    FINAL.totalRooms += noOfRooms + roomsFromFav;
    
    totalDays.disabled = true;
    date.disabled = true;
    txtname.disabled = true;
    email.disabled = true;

    if(first) {
        FINAL.rooms += CURRENT.room;
        FINAL.occupants += parseInt(CURRENT.occupants);
        FINAL.mealTypes += CURRENT.mealType;
        FINAL.extras += CURRENT.extras;
        FINAL.price += parseInt(CURRENT.price);
        FINAL.days = CURRENT.days;
        first=false;
    } else {
        FINAL.rooms += ", " + CURRENT.room;
        FINAL.occupants += parseInt(CURRENT.occupants);
        FINAL.mealTypes += ", " + CURRENT.mealType;
        FINAL.extras += ", " + CURRENT.extras;
        FINAL.price += parseInt(CURRENT.price);
        FINAL.days = CURRENT.days;
    }
    

    // CURRENT.room = "";
    // CURRENT.occupants = 0;
    // CURRENT.mealType = "";
    // CURRENT.extras = "";
    // CURRENT.price = 0.0;

    currenReservations.innerText = "Selected booking's Price: Rs.0"

    finalReservation.innerText = "Booking Duration: " + FINAL.days + "\n" + "Rooms: " + FINAL.rooms + "\n" + "Occupants: " + FINAL.occupants + "\n" + "Meal Type: " + FINAL.mealTypes + "\n" + "Extras: " + FINAL.extras + "\n" + "Price: Rs." + FINAL.price;
    roomsFromFav = 0;
    reserveFav.disabled = false;
}
};

function change() {
    CURRENT.room = txtroom.options[txtroom.selectedIndex].text; 
    CURRENT.occupants = txtoccupants.value;
    CURRENT.mealType = txtmeal.options[txtmeal.selectedIndex].text;
    CURRENT.extras = txtextra.options[txtextra.selectedIndex].text;
    CURRENT.days = totalDays.value
    CURRENT.price = calculatePriceForCurrent();

    currenReservations.innerText = "Room: " + CURRENT.room + "\n" + "Occupants: " + CURRENT.occupants + "\n" + "Meal Type: " + CURRENT.mealType + "\n" + "Extras: " + CURRENT.extras + "\n" + "Price: Rs." + CURRENT.price;
};

function checkVal() {
    if(txtoccupants.value > 3){
        txtoccupants.value = 3
    }
}

function calculatePriceForCurrent() {
    var price = 0;
    if(txtoccupants.value != 0){
        //price = [RoomPrice + (MealPrice + ExtrasPrice) * Occupants] * TotalDays
        price = (parseInt(txtroom.value) + (parseInt(txtmeal.value) + parseInt(txtextra.value)) * txtoccupants.value) * totalDays.value;
    }
    return price;
};

loyaltyBtn.onclick = function() {
    if(FINAL.totalRooms > 3){
        FINAL.loyalty = FINAL.totalRooms * 20;
    }
    alert("You currently have " + FINAL.loyalty + " loyalty points for this reservation.")
};

addToFav.onclick = function() {
    localStorage.clear();

    FINAL.name = txtname.value;
    FINAL.email = txtemail.value;

    let finalString = JSON.stringify(FINAL);
    localStorage.setItem("Reservation",finalString);
    alert("Your reservation has been saved to favourites.")

};

reserveFav.onclick = function() {
    let parsedReservation = JSON.parse(localStorage.getItem("Reservation"));

    CURRENT.room = parsedReservation.rooms; 
    CURRENT.occupants = parsedReservation.occupants;
    CURRENT.mealType = parsedReservation.mealTypes;
    CURRENT.extras = parsedReservation.extras;
    CURRENT.days = parsedReservation.days;
    CURRENT.price = parsedReservation.price;

    roomsFromFav = parseInt(parsedReservation.totalRooms);

    currenReservations.innerText = "Room: " + CURRENT.room + "\n" + "Occupants: " + CURRENT.occupants + "\n" + "Meal Type: " + CURRENT.mealType + "\n" + "Extras: " + CURRENT.extras + "\n" + "Price: Rs." + CURRENT.price;
    reserveFav.disabled = true;

}
