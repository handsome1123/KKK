// get product from database
async function getRoom() {
    try {
        const response = await fetch('/user/room');
        if (response.ok) {
            const data = await response.json();
            showRoom(data);
        } else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        } else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// show room table
function showRoom(data) {
    const tbody = document.querySelector('#tbody');
    let temp = '';
    data.forEach(function (room) {
        temp += `
            <div class="col-md-4">
                <div class="room-card">
                    <img src="/public/img/${room.image}" alt="Room Image" style="width:50%">
                    <div class="room-details">
                        <p style="display: inline;">Room: ${room.name}</p>
                        <a>Seating Capacity: ${room.seat}</a>
                        <br>
                        <br>
                        <p>Floor: ${room.floor}</p>
                        <button class="btn btn-primary reserve-btn" onclick="getDetails('${room.id}')">Book</button>
                    </div>
                    <div class="reserved-overlay" style="display: none;">
                        <div class="reserved-text">RESERVED</div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    tbody.innerHTML = temp;
}

// function to get room details
async function getDetails(roomId) {
    try {
        const response = await fetch(`/user/room/${roomId}`);
        if (response.ok) {
            const roomDetail = await response.json();
            showDetail(roomDetail);
        } else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        } else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// Show room detail in reservation form
function showDetail(roomDetail) {
    // Fill in the form fields with room details
    document.getElementById('roomId').value = roomDetail.id;
    document.getElementById('bookingName').value = '';
    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingTime').value = '';
    document.getElementById('agenda').value = '';
    
    // Display the reservation form popup
    document.getElementById('reservationModal').style.display = 'block';
}

// Close reservation modal
function closeModal() {
    document.getElementById('reservationModal').style.display = 'none';
}

// get and show room
getRoom();
getDetails();