console.log("SmartSlot Dashboard Loaded");


/* BOOK RESOURCE BUTTON */

const bookButton = document.querySelector(".primary-btn");

bookButton.addEventListener("click", function () {

    alert("Opening Resource Booking...");

});


/* QUICK ACTIONS */

const quickCards = document.querySelectorAll(".quick-card");

quickCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const title = card.querySelector("strong").innerText;

        alert(title + " selected!");

    });

});
/* RESOURCE SEARCH */

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const resourceCards =
    document.querySelectorAll(".resource-card");


function filterResources() {

    const searchText =
        searchInput.value.toLowerCase();

    const category =
        categoryFilter.value;


    resourceCards.forEach(function(card) {

        const name =
            card.dataset.name.toLowerCase();

        const cardCategory =
            card.dataset.category;


        const matchesSearch =
            name.includes(searchText);

        const matchesCategory =
            category === "all" ||
            category === cardCategory;


        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterResources
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterResources
    );

}
/* SMARTSLOT BOOKING SYSTEM */


/* Get booking form */

const bookingForm =
    document.getElementById("bookingForm");


/* Get URL resource */

const urlParams =
    new URLSearchParams(window.location.search);

const selectedResource =
    urlParams.get("resource");


/* Automatically select resource */

const resourceSelect =
    document.getElementById("resource");

if (resourceSelect && selectedResource) {

    resourceSelect.value =
        selectedResource;

}


/* Booking submission */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const resource =
                document.getElementById("resource").value;

            const date =
                document.getElementById("bookingDate").value;

            const start =
                document.getElementById("startTime").value;

            const end =
                document.getElementById("endTime").value;

            const purpose =
                document.getElementById("purpose").value;


            /* Validate time */

            if (start >= end) {

                showBookingMessage(
                    "End time must be after start time.",
                    false
                );

                return;

            }


            /* Get existing bookings */

            const bookings =
                JSON.parse(
                    localStorage.getItem("smartslotBookings")
                ) || [];


            /* Check conflict */

            const conflict =
                bookings.some(function(booking) {

                    if (
                        booking.resource !== resource ||
                        booking.date !== date
                    ) {

                        return false;

                    }


                    return (
                        start < booking.end &&
                        end > booking.start
                    );

                });


            /* CONFLICT FOUND */

            if (conflict) {

                showBookingMessage(
                    "❌ Booking Conflict! This resource is already booked during the selected time.",
                    false
                );

                return;

            }


            /* CREATE BOOKING */

            const newBooking = {

                id:
                    "BK" +
                    Date.now(),

                resource:
                    resource,

                date:
                    date,

                start:
                    start,

                end:
                    end,

                purpose:
                    purpose,

                status:
                    "Confirmed"

            };


            bookings.push(newBooking);


            /* Save booking */

            localStorage.setItem(
                "smartslotBookings",
                JSON.stringify(bookings)
            );


            /* SUCCESS */

            showBookingMessage(
                "✅ Booking confirmed successfully!",
                true
            );


            bookingForm.reset();

        }
    );

}


/* Message function */

function showBookingMessage(
    message,
    success
) {

    const messageBox =
        document.getElementById(
            "bookingMessage"
        );


    if (!messageBox) return;


    messageBox.className =
        success
        ? "success-message"
        : "error-message";


    messageBox.innerText =
        message;

}