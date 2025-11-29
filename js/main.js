// Get all clients from localStorage
function getClients() {
    // Check for new key first
    var clients = localStorage.getItem('fitCRM_clients');
    if (clients) {
        try {
            return JSON.parse(clients);
        } catch (e) {
            console.error("Could not parse stored clients", e);
            return [];
        }
    }
    
    // Migrate from old key if it exists
    var oldClients = localStorage.getItem('fitcrm_clients');
    if (oldClients) {
        try {
            var parsed = JSON.parse(oldClients);
            // Save to new key
            localStorage.setItem('fitCRM_clients', oldClients);
            // Remove old key
            localStorage.removeItem('fitcrm_clients');
            return parsed;
        } catch (e) {
            console.error("Could not parse old clients data", e);
            return [];
        }
    }
    
    return [];
}

// Save clients to localStorage
function saveClients(clients) {
    localStorage.setItem('fitCRM_clients', JSON.stringify(clients));
}

// Get a single client by ID
function getClientById(id) {
    var clients = getClients();
    // Convert id to number for comparison
    var idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    for (var i = 0; i < clients.length; i++) {
        var clientId = typeof clients[i].id === 'string' ? parseInt(clients[i].id, 10) : clients[i].id;
        if (clientId === idNum) {
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

    form.addEventListener('submit', function (e) {
        e.preventDefault();

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
            id: Date.now(),
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
    });
}

// Client List
function initClientList() {
    var tableBody = document.querySelector('.table tbody');
    if (!tableBody) {
        // Retry after a short delay in case DOM isn't ready
        setTimeout(function() {
            initClientList();
        }, 100);
        return;
    }

    renderClientList();

    // Event delegation for table buttons and row clicks
    tableBody.addEventListener('click', function (e) {
        var target = e.target;
        var editBtn = target.closest('.edit-btn');
        var deleteBtn = target.closest('.delete-btn');
        var row = target.closest('tr[data-view]');

        // Handle Edit button
        if (editBtn) {
            e.stopPropagation();
            var clientId = editBtn.getAttribute('data-id');
            editClient(clientId);
            return;
        }

        // Handle Delete button
        if (deleteBtn) {
            e.stopPropagation();
            var clientId = deleteBtn.getAttribute('data-id');
            deleteClient(clientId);
            return;
        }

        // Handle row click to view client
        if (row && !editBtn && !deleteBtn) {
            var clientId = row.getAttribute('data-id');
            window.location.href = 'client-view.html?id=' + clientId;
        }
    });

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
    if (!tableBody) {
        return;
    }
    
    var clients = getClients();

    if (clients.length == 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No clients found. Add a new client to get started.</td></tr>';
        // Still set up events even with empty list
        setupClientListEvents();
        return;
    }

    tableBody.innerHTML = '';

    for (var i = 0; i < clients.length; i++) {
        var client = clients[i];
        var row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.setAttribute('data-id', client.id);
        row.setAttribute('data-view', 'true');

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
            '<button class="btn btn-ghost edit-btn" type="button" data-id="' + client.id + '" aria-label="Edit ' + client.fullName + '">Edit</button>' +
            '<button class="btn btn-ghost danger delete-btn" type="button" data-id="' + client.id + '" aria-label="Delete ' + client.fullName + '">Delete</button>' +
            '</td>';

        tableBody.appendChild(row);
    }

    // Add event delegation for all buttons and row clicks
    setupClientListEvents();
}

function editClient(id) {
    // Ensure id is properly formatted
    var idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    window.location.href = 'edit-client.html?id=' + idNum;
}

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
        var idNum = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
        for (var i = 0; i < clients.length; i++) {
            var currentId = typeof clients[i].id === 'string' ? parseInt(clients[i].id, 10) : clients[i].id;
            if (currentId === idNum) {
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

function deleteClient(id) {
    // Convert id to number for comparison
    var idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    var clients = getClients();
    var clientToDelete = null;
    
    // Find the client to get their name for confirmation
    for (var i = 0; i < clients.length; i++) {
        var clientId = typeof clients[i].id === 'string' ? parseInt(clients[i].id, 10) : clients[i].id;
        if (clientId === idNum) {
            clientToDelete = clients[i];
            break;
        }
    }
    
    if (!clientToDelete) {
        alert('Client not found');
        return;
    }
    
    var confirmDelete = confirm('Are you sure you want to delete client "' + clientToDelete.fullName + '"?');
    if (!confirmDelete) {
        return;
    }

    var newClients = [];

    for (var i = 0; i < clients.length; i++) {
        var clientId = typeof clients[i].id === 'string' ? parseInt(clients[i].id, 10) : clients[i].id;
        if (clientId !== idNum) {
            newClients.push(clients[i]);
        }
    }

    saveClients(newClients);
    renderClientList();
    alert('Client deleted successfully!');
}

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
    if (historyList) {
        if (client.trainingHistory && client.trainingHistory.length > 0) {
            var historyHTML = '';
            for (var i = 0; i < client.trainingHistory.length; i++) {
                historyHTML += '<li>' + client.trainingHistory[i] + '</li>';
            }
            historyList.innerHTML = historyHTML;
        } else {
            historyList.innerHTML = '<li>No training history yet</li>';
        }
    }

    // Set up Edit button
    var editClientBtn = document.getElementById('editClientBtn');
    if (editClientBtn) {
        editClientBtn.addEventListener('click', function() {
            editClient(clientId);
        });
    }

    // Get exercises
    fetchExercises(clientId);
}

function fetchExercises(clientId) {
    var exercisesList = document.getElementById('exercisesList');
    if (!exercisesList) return;
    
    exercisesList.innerHTML = '<li>Loading exercises...</li>';

    // Convert clientId to number for consistent offset calculation
    var idNum = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;

    fetch('https://wger.de/api/v2/exerciseinfo/?language=2&limit=50')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (data.results && data.results.length > 0) {
                // Filter exercises with English translations
                var exercisesWithEnglish = data.results.filter(function(exercise) {
                    if (exercise.translations && Array.isArray(exercise.translations)) {
                        return exercise.translations.some(function(t) {
                            return t.language === 2 && t.name;
                        });
                    }
                    return false;
                });

                if (exercisesWithEnglish.length === 0) {
                    exercisesList.innerHTML = '<li>No English exercises found</li>';
                    return;
                }

                // Use client ID to pick different exercises for each client
                var offset = idNum % Math.max(1, exercisesWithEnglish.length - 5);
                var selected = exercisesWithEnglish.slice(offset, offset + 5);
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
    // More robust path detection - works with Netlify and local
    var path = window.location.pathname;
    var filename = path.split('/').pop() || '';
    var href = window.location.href;

    // Check by filename first, then by path/href
    if (filename === 'new-client.html' || path.includes('new-client.html') || href.includes('new-client.html')) {
        initNewClientForm();
    } else if (filename === 'edit-client.html' || path.includes('edit-client.html') || href.includes('edit-client.html')) {
        initEditClientForm();
    } else if (filename === 'clients.html' || path.includes('clients.html') || href.includes('clients.html')) {
        initClientList();
    } else if (filename === 'client-view.html' || path.includes('client-view.html') || href.includes('client-view.html')) {
        initClientView();
    }

    // Set year in footer
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// Also run on window load as fallback for Netlify
window.addEventListener('load', function () {
    // Re-initialize if DOMContentLoaded didn't catch it
    var path = window.location.pathname;
    var filename = path.split('/').pop() || '';
    var href = window.location.href;

    if (filename === 'clients.html' || path.includes('clients.html') || href.includes('clients.html')) {
        // Re-render client list to ensure buttons work
        var tableBody = document.querySelector('.table tbody');
        if (tableBody && tableBody.children.length > 0) {
            setupClientListEvents();
        }
    }
});
