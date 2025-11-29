// Get all clients from localStorage
function getClients() {
    var clients = localStorage.getItem('fitcrm_clients');
    if (clients) {
        return JSON.parse(clients);
    } else {
        return [];
    }
}

// Save clients to localStorage
function saveClients(clients) {
    localStorage.setItem('fitcrm_clients', JSON.stringify(clients));
}

// Get a single client by ID
function getClientById(id) {
    var clients = getClients();
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id == id) {
            return clients[i];
        }
    }
    return null;
}

// New Client Form
function initNewClientForm() {
    var form = document.querySelector('.form-grid');
    if (!form) {
        return;
    }

    // Handle form submission
    var handleSubmit = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        var fullName = document.getElementById('fullName').value;
        var age = document.getElementById('age').value;
        var gender = document.getElementById('gender').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var goal = document.getElementById('goal').value;
        var startDate = document.getElementById('startDate').value;

        // Check if name is filled
        if (!fullName) {
            alert('Please enter a full name');
            return;
        }

        // Check age
        if (!age || age < 16 || age > 100) {
            alert('Please enter a valid age (16-100)');
            return;
        }

        // Check gender
        if (!gender) {
            alert('Please select a gender');
            return;
        }

        // Check email
        if (!email) {
            alert('Please enter an email address');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check phone
        if (!phone) {
            alert('Please enter a phone number');
            return;
        }
        if (!validatePhone(phone)) {
            alert('Please enter a valid phone number (numbers, spaces, dashes, parentheses only)');
            return;
        }

        // Create new client
        var client = {
            id: Date.now().toString(),
            fullName: fullName,
            age: age,
            gender: gender,
            email: email,
            phone: phone,
            goal: goal,
            startDate: startDate,
            trainingHistory: []
        };

        // Save to localStorage
        var clients = getClients();
        clients.push(client);
        saveClients(clients);

        alert('Client added successfully!');
        form.reset();
        window.location.href = 'clients.html';
    };

    // Attach to form submit
    form.addEventListener('submit', handleSubmit);
    
    // Also attach to button click as backup
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }
}

// Client List
function initClientList() {
    var tableBody = document.querySelector('.table tbody');
    if (!tableBody) {
        return;
    }

    renderClientList();

    // Search
    var searchInput = document.getElementById('searchName');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            var query = e.target.value.toLowerCase();
            var rows = tableBody.querySelectorAll('tr');

            for (var i = 0; i < rows.length; i++) {
                var name = rows[i].cells[0].textContent.toLowerCase();
                if (name.includes(query)) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        });
    }
}

function renderClientList() {
    var tableBody = document.querySelector('.table tbody');
    var clients = getClients();

    if (clients.length == 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No clients found. Add a new client to get started.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';

    for (var i = 0; i < clients.length; i++) {
        var client = clients[i];
        var row = document.createElement('tr');
        row.style.cursor = 'pointer';

        var emailText = client.email || '-';
        var phoneText = client.phone || '-';
        var goalText = client.goal || '-';
        var dateText = client.startDate || '-';

        row.innerHTML = '<td>' + client.fullName + '</td>' +
            '<td>' + emailText + '</td>' +
            '<td>' + phoneText + '</td>' +
            '<td>' + goalText + '</td>' +
            '<td>' + dateText + '</td>' +
            '<td class="actions">' +
            '<button class="btn btn-ghost" onclick="editClient(\'' + client.id + '\'); event.stopPropagation();">Edit</button>' +
            '<button class="btn btn-ghost danger" onclick="deleteClient(\'' + client.id + '\'); event.stopPropagation();">Delete</button>' +
            '</td>';

        // Add click event to view client 
        (function(clientId) {
            row.addEventListener('click', function (e) {
                if (e.target.tagName === 'BUTTON') return;
                window.location.href = 'client-view.html?id=' + clientId;
            });
        })(client.id);

        tableBody.appendChild(row);
    }
}

window.editClient = function(id) {
    window.location.href = 'edit-client.html?id=' + id;
};

// Edit Client Form
function initEditClientForm() {
    var urlParams = new URLSearchParams(window.location.search);
    var clientId = urlParams.get('id');

    if (!clientId) {
        alert('No client ID provided');
        window.location.href = 'clients.html';
        return;
    }

    var client = getClientById(clientId);
    if (!client) {
        alert('Client not found');
        window.location.href = 'clients.html';
        return;
    }

    // Fill form with client data
    document.getElementById('fullName').value = client.fullName || '';
    document.getElementById('age').value = client.age || '';
    document.getElementById('gender').value = client.gender || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('phone').value = client.phone || '';
    document.getElementById('goal').value = client.goal || '';
    document.getElementById('startDate').value = client.startDate || '';

    // Handle save
    var form = document.getElementById('editClientForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var fullName = document.getElementById('fullName').value;
        var age = document.getElementById('age').value;
        var gender = document.getElementById('gender').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var goal = document.getElementById('goal').value;
        var startDate = document.getElementById('startDate').value;

        // Check name
        if (!fullName) {
            alert('Please enter a full name');
            return;
        }

        // Check age
        if (!age || age < 16 || age > 120) {
            alert('Please enter a valid age (16-120)');
            return;
        }

        // Check gender
        if (!gender) {
            alert('Please select a gender');
            return;
        }

        // Check email
        if (!email) {
            alert('Please enter an email address');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check phone
        if (!phone) {
            alert('Please enter a phone number');
            return;
        }
        if (!validatePhone(phone)) {
            alert('Please enter a valid phone number (numbers, spaces, dashes, parentheses only)');
            return;
        }

        // Update client
        var clients = getClients();
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == clientId) {
                clients[i].fullName = fullName;
                clients[i].age = age;
                clients[i].gender = gender;
                clients[i].email = email;
                clients[i].phone = phone;
                clients[i].goal = goal;
                clients[i].startDate = startDate;
                break;
            }
        }

        saveClients(clients);
        alert('Client updated successfully!');
        window.location.href = 'clients.html';
    });
}

window.deleteClient = function(id) {
    var confirmDelete = confirm('Are you sure you want to delete this client?');
    if (!confirmDelete) {
        return;
    }

    var clients = getClients();
    var newClients = [];

    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id != id) {
            newClients.push(clients[i]);
        }
    }

    saveClients(newClients);
    renderClientList();
    alert('Client deleted successfully!');
};

// Client Detail View
function initClientView() {
    var urlParams = new URLSearchParams(window.location.search);
    var clientId = urlParams.get('id');

    if (!clientId) {
        alert('No client ID provided');
        window.location.href = 'clients.html';
        return;
    }

    var client = getClientById(clientId);
    if (!client) {
        alert('Client not found');
        window.location.href = 'clients.html';
        return;
    }

    // Show client info
    document.getElementById('clientName').textContent = client.fullName;
    document.getElementById('clientEmail').textContent = client.email || 'N/A';
    document.getElementById('clientPhone').textContent = client.phone || 'N/A';
    document.getElementById('clientGoal').textContent = client.goal || 'N/A';
    document.getElementById('clientStartDate').textContent = client.startDate || 'N/A';

    // Show training history
    var historyList = document.getElementById('trainingHistory');
    if (client.trainingHistory && client.trainingHistory.length > 0) {
        var historyHTML = '';
        for (var i = 0; i < client.trainingHistory.length; i++) {
            historyHTML += '<li>' + client.trainingHistory[i] + '</li>';
        }
        historyList.innerHTML = historyHTML;
    } else {
        historyList.innerHTML = '<li>No training history yet</li>';
    }

    // Get exercises
    fetchExercises(clientId);
}

function fetchExercises(clientId) {
    var exercisesList = document.getElementById('exercisesList');
    exercisesList.innerHTML = '<li>Loading exercises...</li>';

    fetch('https://wger.de/api/v2/exerciseinfo/?limit=50')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.results && data.results.length > 0) {
                // Use client ID to pick different exercises for each client
                var offset = parseInt(clientId) % (data.results.length - 5);
                var selected = data.results.slice(offset, offset + 5);
                var html = '';

                for (var i = 0; i < selected.length; i++) {
                    var exercise = selected[i];
                    var name = 'Unknown Exercise';
                    var description = 'No description available';

                    // Find English translation
                    if (exercise.translations) {
                        for (var j = 0; j < exercise.translations.length; j++) {
                            // English language code is 2
                            if (exercise.translations[j].language == 2) {
                                if (exercise.translations[j].name) {
                                    name = exercise.translations[j].name;
                                }
                                if (exercise.translations[j].description) {
                                    description = stripHtml(exercise.translations[j].description);
                                }
                                break;
                            }
                        }
                    }

                    html += '<li><strong>' + name + '</strong>: ' + description + '</li>';
                }

                exercisesList.innerHTML = html;
            } else {
                exercisesList.innerHTML = '<li>No exercises found</li>';
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            exercisesList.innerHTML = '<li>Error loading exercises. Please try again later.</li>';
        });
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    var re = /^[0-9\(\)\-\s\+]+$/;
    return re.test(phone);
}

function stripHtml(html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

// Start when page loads
document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || window.location.href.split('/').pop();

    // More reliable path detection
    if (filename === 'new-client.html' || path.includes('new-client.html') || window.location.href.includes('new-client.html')) {
        initNewClientForm();
    } else if (filename === 'edit-client.html' || path.includes('edit-client.html') || window.location.href.includes('edit-client.html')) {
        initEditClientForm();
    } else if (filename === 'clients.html' || path.includes('clients.html') || window.location.href.includes('clients.html')) {
        initClientList();
    } else if (filename === 'client-view.html' || path.includes('client-view.html') || window.location.href.includes('client-view.html')) {
        initClientView();
    }

    // Set year in footer
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
