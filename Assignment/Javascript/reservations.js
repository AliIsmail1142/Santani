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

//finding and setting today as min value for date
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
today = yyyy + '-' + mm + '-' + dd;
date.setAttribute("min", today);

//Current reservation
const CURRENT = {
    room: "",
    occupants: 0,
    mealType: "",
    days: 0,
    extras: "",
    price: 0.0
};

//Final reservations
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

//to calculate the loyalty points
let noOfRooms = 0;
let roomsFromFav = 0;

let first = true;

//for the case where favourite reservation is clicked first
let favFirst = true;

//for calculating updates when number of days are changed
let reservedDays = 0;
let reservedPrice = 0;

//click event for Add button
addBtn.onclick = function () {

    if (email.value == "" || totalDays.value == 0 || date.value == "" || txtoccupants.value == 0 /*|| txtroom.value == "" || txtmeal.value == ""*/ || txtname.value == "") {
        alert("Please fill the required form elements.");
    } else {

        favFirst = false;

        if (roomsFromFav == 0) {
            noOfRooms = 1;
        } else {
            noOfRooms = 0;
        }

        FINAL.totalRooms += noOfRooms + roomsFromFav;
        CURRENT.days = totalDays.value;
        totalDays.disabled = true;
        date.disabled = true;
        txtname.disabled = true;
        email.disabled = true;

        if (first) {
            FINAL.rooms += CURRENT.room;
            FINAL.occupants += parseInt(CURRENT.occupants);
            FINAL.mealTypes += CURRENT.mealType;
            FINAL.extras += CURRENT.extras;
            FINAL.price += parseInt(CURRENT.price);
            FINAL.days = CURRENT.days;
            first = false;
        } else {
            FINAL.rooms += ", " + CURRENT.room;
            FINAL.occupants += parseInt(CURRENT.occupants);
            FINAL.mealTypes += ", " + CURRENT.mealType;
            FINAL.extras += ", " + CURRENT.extras;
            FINAL.price += parseInt(CURRENT.price);
            FINAL.days = CURRENT.days;
        }

        currenReservations.innerText = "Selected booking's Price: Rs.0"

        finalReservation.innerText = "Booking Duration: " + FINAL.days + "\n" + "Rooms: " + FINAL.rooms + "\n" + "Occupants: " + FINAL.occupants + "\n" + "Meal Type: " + FINAL.mealTypes + "\n" + "Extras: " + FINAL.extras + "\n" + "Price: Rs." + FINAL.price;

        reserveFav.disabled = false;
        addBtn.disabled = true;
        txtoccupants.disabled = false;
        txtroom.disabled = false;
        txtmeal.disabled = false;
        txtextra.disabled = false;

        roomsFromFav = 0;
        txtoccupants.value = "";
    }
};

//onchange event for updating current reservation
function change() {
    CURRENT.room = txtroom.options[txtroom.selectedIndex].text;
    CURRENT.occupants = txtoccupants.value;
    CURRENT.mealType = txtmeal.options[txtmeal.selectedIndex].text;
    CURRENT.extras = txtextra.options[txtextra.selectedIndex].text;
    CURRENT.price = calculatePriceForCurrent();

    reservedPrice = calculatePriceForCurrent();
    reservedDays = totalDays.value;

    currenReservations.innerText = "Room: " + CURRENT.room + "\n" + "Occupants: " + CURRENT.occupants + "\n" + "Meal Type: " + CURRENT.mealType + "\n" + "Extras: " + CURRENT.extras + "\n" + "Price: Rs." + CURRENT.price;
    addBtn.disabled = false;
};

//calculating price in current reservation
function calculatePriceForCurrent() {
    var price = 0;
    if (txtoccupants.value != 0) {
        /*
        calculation used for price -->
        price = [RoomPrice + (MealPrice + ExtrasPrice) * Occupants] * TotalDays
        */
        price = (parseInt(txtroom.value) + (parseInt(txtmeal.value) + parseInt(txtextra.value)) * txtoccupants.value) * totalDays.value;
    }
    return price;
};

//calculation is re-done everytime the number of days are updated
function priceChange() {
    let newPrice = 0;
    let oldDays = parseInt(CURRENT.days);
    newPrice = (reservedPrice / reservedDays) * totalDays.value;
    CURRENT.price = newPrice;
    currenReservations.innerText = "Room: " + CURRENT.room + "\n" + "Occupants: " + CURRENT.occupants + "\n" + "Meal Type: " + CURRENT.mealType + "\n" + "Extras: " + CURRENT.extras + "\n" + "Price: Rs." + CURRENT.price;

}

//set max occupants to 3 per room
function checkVal() {
    if (txtoccupants.value > 3) {
        txtoccupants.value = 3
    }
};

//click event for calculating loyalty points
loyaltyBtn.onclick = function () {
    if (FINAL.totalRooms > 3) {
        FINAL.loyalty = FINAL.totalRooms * 20;
    }
    alert("You currently have " + FINAL.loyalty + " loyalty points for this reservation.")
};

//click event for Add to favourite
addToFav.onclick = function () {
    localStorage.clear();

    FINAL.name = txtname.value;
    FINAL.email = txtemail.value;

    let finalString = JSON.stringify(FINAL);
    localStorage.setItem("Reservation", finalString);
    alert("Your reservation has been saved to favourites.")

};

//click event for Reserve favourite reservation
reserveFav.onclick = function () {

    let parsedReservation = JSON.parse(localStorage.getItem("Reservation"));

    CURRENT.room = parsedReservation.rooms;
    CURRENT.occupants = parsedReservation.occupants;
    CURRENT.mealType = parsedReservation.mealTypes;
    CURRENT.extras = parsedReservation.extras;
    CURRENT.days = parsedReservation.days;

    reservedDays = parseInt(parsedReservation.days);
    reservedPrice = parseInt(parsedReservation.price);

    if (favFirst = false) {
        CURRENT.price = priceForFav();

        function priceForFav() {
            var price = 0;
            price = (parseInt(parsedReservation.price) / parseInt(parsedReservation.days)) * totalDays.value;
            return price;
        };
    } else {
        CURRENT.price = parsedReservation.price;
        totalDays.value = CURRENT.days;
    }

    txtoccupants.value = CURRENT.occupants;
    txtoccupants.disabled = true;

    roomsFromFav = parseInt(parsedReservation.totalRooms);

    currenReservations.innerText = "Room: " + CURRENT.room + "\n" + "Occupants: " + CURRENT.occupants + "\n" + "Meal Type: " + CURRENT.mealType + "\n" + "Extras: " + CURRENT.extras + "\n" + "Price: Rs." + CURRENT.price;

    txtroom.disabled = true;
    txtmeal.disabled = true;
    txtextra.disabled = true;
    reserveFav.disabled = true;
    addBtn.disabled = false;
};

function confirmation() {
    alert("Thank you for your reservation! We will send a digital receipt to the provided email address" + "\n" + "\n" + "Booking Duration: " + FINAL.days + "\n" + "Rooms: " + FINAL.rooms + "\n" + "Occupants: " + FINAL.occupants + "\n" + "Meal Type: " + FINAL.mealTypes + "\n" + "Extras: " + FINAL.extras + "\n" + "Price: Rs." + FINAL.price);

};
