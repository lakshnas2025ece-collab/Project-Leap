const API = "http://localhost:8090/api";


// =========================
// PAGE NAVIGATION
// =========================

const pageTitles = {
    dashboard: "Dashboard",
    tables: "Tables",
    customers: "Customers",
    reservations: "Reservations",
    orders: "Orders",
    billing: "Billing"
};

const pageSubtitles = {
    dashboard: "Overview of your restaurant",
    tables: "Manage restaurant tables",
    customers: "Manage restaurant customers",
    reservations: "Manage table reservations",
    orders: "Manage restaurant orders",
    billing: "Generate and manage bills"
};


function showPage(pageName, clickedButton) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageName).classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    document.getElementById("page-title").textContent =
        pageTitles[pageName];

    document.getElementById("page-subtitle").textContent =
        pageSubtitles[pageName];

    if (pageName === "dashboard") {
        loadDashboard();
    }

    if (pageName === "tables") {
        loadTables();
    }

    if (pageName === "customers") {
        loadCustomers();
        loadCustomersForReservation();
    }

    if (pageName === "reservations") {
        loadReservations();
        loadCustomersForReservation();
        loadTablesForReservation();
    }

    if (pageName === "orders") {
        loadOrders();
        loadOccupiedTables();
    }

    if (pageName === "billing") {
        loadBills();
        loadOccupiedTablesForBilling();
    }
}


function openPage(pageName) {

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    const matchingButton =
        Array.from(document.querySelectorAll(".nav-item"))
            .find(button =>
                button.textContent.trim().toLowerCase()
                === pageName.toLowerCase()
            );

    showPage(pageName, matchingButton);
}


// =========================
// NOTIFICATION
// =========================

function showNotification(message, type = "success") {

    const notification =
        document.getElementById("notification");

    notification.textContent = message;

    notification.className =
        "notification show " + type;

    setTimeout(() => {
        notification.className = "notification";
    }, 3000);
}


// =========================
// API ERROR HANDLING
// =========================

async function getErrorMessage(response) {

    try {

        const data = await response.json();

        if (data.message) {
            return data.message;
        }

        return "Something went wrong.";

    } catch (error) {

        return "Unable to connect to the backend.";
    }
}


// =========================
// DASHBOARD
// =========================

async function loadDashboard() {

    await loadDashboardStats();
    await loadDashboardTables();
}


async function loadDashboardStats() {

    try {

        const tableResponse =
            await fetch(`${API}/tables`);

        const tables =
            await tableResponse.json();

        const reservationResponse =
            await fetch(`${API}/reservations`);

        const reservations =
            await reservationResponse.json();


        document.getElementById("total-tables").textContent =
            tables.length;

        document.getElementById("free-tables").textContent =
            tables.filter(table =>
                table.status &&
                table.status.toUpperCase() === "FREE"
            ).length;

        document.getElementById("occupied-tables").textContent =
            tables.filter(table =>
                table.status &&
                table.status.toUpperCase() === "OCCUPIED"
            ).length;

        document.getElementById("total-reservations").textContent =
            reservations.length;

    } catch (error) {

        console.error(error);

        showNotification(
            "Could not load dashboard data.",
            "error"
        );
    }
}


async function loadDashboardTables() {

    const container =
        document.getElementById("dashboard-tables");

    try {

        const response =
            await fetch(`${API}/tables`);

        const tables =
            await response.json();

        if (tables.length === 0) {

            container.innerHTML =
                "<p class='loading'>No tables found.</p>";

            return;
        }


        container.innerHTML = tables.map(table => {

            const status =
                table.status
                    ? table.status.toUpperCase()
                    : "UNKNOWN";

            const statusClass =
                status === "FREE"
                    ? "status-free"
                    : "status-occupied";

            return `
                <div class="table-mini">

                    <strong>
                        Table ${table.tableNumber}
                    </strong>

                    <span class="${statusClass}">
                        ${status}
                    </span>

                </div>
            `;

        }).join("");

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load tables.</p>";
    }
}


// =========================
// TABLES
// =========================

async function loadTables() {

    const container =
        document.getElementById("tables-container");

    container.innerHTML =
        "<p class='loading'>Loading tables...</p>";

    try {

        const response =
            await fetch(`${API}/tables`);

        if (!response.ok) {
            throw new Error("Failed to load tables");
        }

        const tables =
            await response.json();

        if (tables.length === 0) {

            container.innerHTML =
                "<p class='loading'>No tables found.</p>";

            return;
        }


        container.innerHTML = tables.map(table => {

            const status =
                table.status
                    ? table.status.toUpperCase()
                    : "UNKNOWN";

            const isFree =
                status === "FREE";


            return `
                <div class="table-card">

                    <div class="table-card-header">

                        <span class="table-number">
                            Table ${table.tableNumber}
                        </span>

                        <span class="table-status
                            ${isFree
                                ? "free-badge"
                                : "occupied-badge"}">

                            ${status}

                        </span>

                    </div>


                    <div class="table-info">

                        <span>
                            Capacity
                        </span>

                        <strong>
                            ${table.capacity} people
                        </strong>

                    </div>


                    ${isFree
                        ? `
                            <button
                                class="primary-btn"
                                onclick="seatTable(${table.id})">

                                Seat Table

                            </button>
                        `
                        : `
                            <span class="status-occupied">
                                Currently occupied
                            </span>
                        `
                    }

                </div>
            `;

        }).join("");

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load tables.</p>";

        showNotification(
            "Unable to load tables.",
            "error"
        );
    }
}


async function seatTable(tableId) {

    try {

        const response =
            await fetch(
                `${API}/tables/${tableId}/seat`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            const message =
                await getErrorMessage(response);

            showNotification(message, "error");

            return;
        }

        showNotification(
            "Table is now occupied."
        );

        loadTables();
        loadDashboard();

    } catch (error) {

        showNotification(
            "Unable to connect to backend.",
            "error"
        );
    }
}


// =========================
// CUSTOMERS
// =========================

async function loadCustomers() {

    const container =
        document.getElementById("customers-container");

    try {

        const response =
            await fetch(`${API}/customers`);

        const customers =
            await response.json();


        if (customers.length === 0) {

            container.innerHTML =
                "<p class='loading'>No customers found.</p>";

            return;
        }


        container.innerHTML = customers.map(customer => {

            return `
                <div class="list-item">

                    <div>

                        <strong>
                            ${customer.name}
                        </strong>

                        <span>
                            ${customer.phone}
                        </span>

                    </div>

                    <div class="list-actions">

                        <button
                            class="danger-btn"
                            onclick="deleteCustomer(${customer.id})">

                            Delete

                        </button>

                    </div>

                </div>
            `;

        }).join("");

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load customers.</p>";
    }
}


document
    .getElementById("customer-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("customer-name").value;

        const phone =
            document.getElementById("customer-phone").value;


        try {

            const response =
                await fetch(
                    `${API}/customers`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            phone: phone
                        })
                    }
                );


            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                showNotification(message, "error");

                return;
            }


            document
                .getElementById("customer-form")
                .reset();


            showNotification(
                "Customer added successfully."
            );


            loadCustomers();

            loadCustomersForReservation();

        } catch (error) {

            showNotification(
                "Unable to connect to backend.",
                "error"
            );
        }

    });


async function deleteCustomer(customerId) {

    if (!confirm("Delete this customer?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/customers/${customerId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const message =
                await getErrorMessage(response);

            showNotification(message, "error");

            return;
        }


        showNotification(
            "Customer deleted."
        );

        loadCustomers();
        loadCustomersForReservation();

    } catch (error) {

        showNotification(
            "Unable to connect to backend.",
            "error"
        );
    }
}


// =========================
// RESERVATIONS
// =========================

async function loadCustomersForReservation() {

    const select =
        document.getElementById(
            "reservation-customer"
        );

    try {

        const response =
            await fetch(`${API}/customers`);

        const customers =
            await response.json();


        select.innerHTML =
            `<option value="">Select customer</option>`;


        customers.forEach(customer => {

            select.innerHTML += `
                <option value="${customer.id}">
                    ${customer.name} - ${customer.phone}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);
    }
}


async function loadTablesForReservation() {

    const select =
        document.getElementById(
            "reservation-table"
        );

    try {

        const response =
            await fetch(`${API}/tables`);

        const tables =
            await response.json();


        select.innerHTML =
            `<option value="">Select table</option>`;


        tables.forEach(table => {

            select.innerHTML += `
                <option value="${table.id}">
                    Table ${table.tableNumber}
                    - Capacity ${table.capacity}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);
    }
}


async function loadReservations() {

    const container =
        document.getElementById(
            "reservations-container"
        );


    try {

        const response =
            await fetch(`${API}/reservations`);

        const reservations =
            await response.json();


        if (reservations.length === 0) {

            container.innerHTML =
                "<p class='loading'>No reservations found.</p>";

            return;
        }


        container.innerHTML =
            reservations.map(reservation => {

                const customerName =
                    reservation.customer
                        ? reservation.customer.name
                        : "Unknown";

                const tableNumber =
                    reservation.table
                        ? reservation.table.tableNumber
                        : "-";


                return `
                    <div class="list-item">

                        <div>

                            <strong>
                                ${customerName}
                            </strong>

                            <span>
                                Table ${tableNumber}
                                |
                                ${reservation.reservationDate}
                                |
                                ${reservation.startTime}
                                - ${reservation.endTime}
                            </span>

                        </div>


                        <div>

                            <span class="status-confirmed">
                                ${reservation.status}
                            </span>

                        </div>

                    </div>
                `;

            }).join("");

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load reservations.</p>";
    }
}


document
    .getElementById("reservation-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const customerId =
            Number(
                document.getElementById(
                    "reservation-customer"
                ).value
            );


        const tableId =
            Number(
                document.getElementById(
                    "reservation-table"
                ).value
            );


        const date =
            document.getElementById(
                "reservation-date"
            ).value;


        const startTime =
            document.getElementById(
                "reservation-start"
            ).value;


        const endTime =
            document.getElementById(
                "reservation-end"
            ).value;


        const partySize =
            Number(
                document.getElementById(
                    "party-size"
                ).value
            );


        try {

            const response =
                await fetch(
                    `${API}/reservations`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            reservationDate: date,

                            startTime: startTime,

                            endTime: endTime,

                            partySize: partySize,

                            status: "CONFIRMED",

                            table: {
                                id: tableId
                            },

                            customer: {
                                id: customerId
                            }

                        })
                    }
                );


            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                showNotification(
                    message,
                    "error"
                );

                return;
            }


            document
                .getElementById(
                    "reservation-form"
                )
                .reset();


            showNotification(
                "Reservation created successfully."
            );


            loadReservations();

        } catch (error) {

            showNotification(
                "Unable to connect to backend.",
                "error"
            );
        }

    });


// =========================
// ORDERS
// =========================

async function loadOccupiedTables() {

    const select =
        document.getElementById(
            "order-table"
        );


    try {

        const response =
            await fetch(`${API}/tables`);

        const tables =
            await response.json();


        select.innerHTML =
            `<option value="">
                Select occupied table
            </option>`;


        tables
            .filter(table =>
                table.status &&
                table.status.toUpperCase()
                    === "OCCUPIED"
            )
            .forEach(table => {

                select.innerHTML += `
                    <option value="${table.id}">
                        Table ${table.tableNumber}
                    </option>
                `;

            });

    } catch (error) {

        console.error(error);
    }
}


document
    .getElementById("order-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const tableId =
            Number(
                document.getElementById(
                    "order-table"
                ).value
            );


        try {

            const response =
                await fetch(
                    `${API}/orders`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            table: {
                                id: tableId
                            }
                        })
                    }
                );


            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                showNotification(
                    message,
                    "error"
                );

                return;
            }


            const order =
                await response.json();


            document.getElementById(
                "item-order-id"
            ).value = order.id;


            document.getElementById(
                "new-order-result"
            ).innerHTML = `
                <div class="bill-card"
                     style="margin-top:15px;">

                    <h3>
                        Order Created
                    </h3>

                    <p>
                        Order ID:
                        <strong>${order.id}</strong>
                    </p>

                    <p>
                        Status:
                        <strong>${order.status}</strong>
                    </p>

                </div>
            `;


            showNotification(
                `Order ${order.id} created successfully.`
            );


            document
                .getElementById(
                    "order-form"
                )
                .reset();


            loadOrders();

        } catch (error) {

            showNotification(
                "Unable to connect to backend.",
                "error"
            );
        }

    });


document
    .getElementById("order-item-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const orderId =
            Number(
                document.getElementById(
                    "item-order-id"
                ).value
            );


        const itemName =
            document.getElementById(
                "item-name"
            ).value;


        const quantity =
            Number(
                document.getElementById(
                    "item-quantity"
                ).value
            );


        const price =
            Number(
                document.getElementById(
                    "item-price"
                ).value
            );


        try {

            const response =
                await fetch(
                    `${API}/order-items`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            itemName: itemName,

                            quantity: quantity,

                            price: price,

                            order: {
                                id: orderId
                            }

                        })
                    }
                );


            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                showNotification(
                    message,
                    "error"
                );

                return;
            }


            document
                .getElementById(
                    "item-name"
                ).value = "";

            document
                .getElementById(
                    "item-quantity"
                ).value = 1;

            document
                .getElementById(
                    "item-price"
                ).value = "";


            showNotification(
                "Order item added successfully."
            );


            loadOrders();

        } catch (error) {

            showNotification(
                "Unable to connect to backend.",
                "error"
            );
        }

    });


async function loadOrders() {

    const container =
        document.getElementById(
            "orders-container"
        );


    try {

        const response =
            await fetch(`${API}/orders`);

        const orders =
            await response.json();


        if (orders.length === 0) {

            container.innerHTML =
                "<p class='loading'>No orders found.</p>";

            return;
        }


        container.innerHTML = `

            <div class="order-row order-header">

                <span>ID</span>
                <span>Table</span>
                <span>Time</span>
                <span>Status</span>
                <span>Items</span>

            </div>

            ${
                orders.map(order => {

                    const tableNumber =
                        order.table
                            ? order.table.tableNumber
                            : "-";

                    return `

                        <div class="order-row">

                            <strong>
                                #${order.id}
                            </strong>

                            <span>
                                Table ${tableNumber}
                            </span>

                            <span>
                                ${formatDateTime(
                                    order.orderTime
                                )}
                            </span>

                            <span class="${
                                order.status === "OPEN"
                                    ? "status-open"
                                    : "status-closed"
                            }">

                                ${order.status}

                            </span>

                            <button
                                class="secondary-btn"
                                onclick="
                                    viewOrderItems(
                                        ${order.id}
                                    )
                                ">

                                View

                            </button>

                        </div>

                    `;

                }).join("")
            }

        `;

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load orders.</p>";
    }
}


async function viewOrderItems(orderId) {

    try {

        const response =
            await fetch(
                `${API}/order-items/order/${orderId}`
            );


        if (!response.ok) {

            showNotification(
                "Unable to load order items.",
                "error"
            );

            return;
        }


        const items =
            await response.json();


        if (items.length === 0) {

            alert(
                `Order ${orderId} has no items.`
            );

            return;
        }


        let message =
            `Order ${orderId}\n\n`;


        let total = 0;


        items.forEach(item => {

            const subtotal =
                item.quantity * item.price;

            total += subtotal;


            message +=
                `${item.itemName} - ` +
                `${item.quantity} × ₹${item.price}` +
                ` = ₹${subtotal}\n`;

        });


        message +=
            `\nTotal: ₹${total}`;


        alert(message);

    } catch (error) {

        showNotification(
            "Unable to load order items.",
            "error"
        );
    }
}


// =========================
// BILLING
// =========================

async function loadOccupiedTablesForBilling() {

    const select =
        document.getElementById(
            "billing-table"
        );


    try {

        const response =
            await fetch(`${API}/tables`);

        const tables =
            await response.json();


        select.innerHTML =
            `<option value="">
                Select table
            </option>`;


        tables
            .filter(table =>
                table.status &&
                table.status.toUpperCase()
                    === "OCCUPIED"
            )
            .forEach(table => {

                select.innerHTML += `
                    <option value="${table.id}">
                        Table ${table.tableNumber}
                    </option>
                `;

            });

    } catch (error) {

        console.error(error);
    }
}


async function generateBill() {

    const tableId =
        document.getElementById(
            "billing-table"
        ).value;


    if (!tableId) {

        showNotification(
            "Please select a table.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/bills/table/${tableId}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            const message =
                await getErrorMessage(response);

            showNotification(
                message,
                "error"
            );

            return;
        }


        const bill =
            await response.json();


        document.getElementById(
            "bill-result"
        ).innerHTML = `

            <div class="bill-card">

                <h3>
                    Bill Generated Successfully
                </h3>

                <p>
                    Bill ID:
                    <strong>${bill.id}</strong>
                </p>

                <p>
                    Table:
                    <strong>
                        ${bill.table.tableNumber}
                    </strong>
                </p>

                <p>
                    Status:
                    <strong>
                        ${bill.status}
                    </strong>
                </p>

                <div class="bill-total">
                    ₹${bill.totalAmount.toFixed(2)}
                </div>

            </div>

        `;


        showNotification(
            "Bill generated successfully."
        );


        loadBills();

        loadOccupiedTablesForBilling();

        loadDashboard();

    } catch (error) {

        showNotification(
            "Unable to connect to backend.",
            "error"
        );
    }
}


async function loadBills() {

    const container =
        document.getElementById(
            "bills-container"
        );


    try {

        const response =
            await fetch(`${API}/bills`);

        const bills =
            await response.json();


        if (bills.length === 0) {

            container.innerHTML =
                "<p class='loading'>No bills found.</p>";

            return;
        }


        container.innerHTML =
            bills.map(bill => {

                return `

                    <div class="list-item">

                        <div>

                            <strong>
                                Bill #${bill.id}
                            </strong>

                            <span>
                                Table
                                ${bill.table
                                    ? bill.table.tableNumber
                                    : "-"}
                                |
                                ${formatDateTime(
                                    bill.billTime
                                )}
                            </span>

                        </div>


                        <div>

                            <strong>
                                ₹${bill.totalAmount.toFixed(2)}
                            </strong>

                            <span class="status-paid">
                                ${bill.status}
                            </span>

                        </div>

                    </div>

                `;

            }).join("");

    } catch (error) {

        container.innerHTML =
            "<p class='loading'>Unable to load bills.</p>";
    }
}


// =========================
// DATE / TIME
// =========================

function formatDateTime(value) {

    if (!value) {
        return "-";
    }

    return value
        .replace("T", " ")
        .substring(0, 16);
}


// =========================
// INITIAL LOAD
// =========================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

        loadCustomers();

        loadReservations();

        loadTables();

        loadOrders();

        loadBills();

        loadCustomersForReservation();

        loadTablesForReservation();

        loadOccupiedTables();

        loadOccupiedTablesForBilling();

    }
);