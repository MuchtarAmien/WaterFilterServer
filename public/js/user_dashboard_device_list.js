const filterContainer = document.getElementById("filter-container");
const activeFilterContainer = document.getElementById("active-filter");
const deviceList = [];
let activeFilter = {};

function deviceOption(data, isChecked) {
    return `
    <div class="flex items-center mb-3">
        <input id="device-${data.id_perangkat}" 
            ${isChecked ? "checked" : ""} 
            type="radio" value="" name="device-radio" 
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        >
        <label for="device-${data.id_perangkat}" 
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            ${data.nama_alat}
        </label>
    </div>
    `;
}

function showUserDevice(data) {
    activeFilterContainer.textContent = data[0].nama_alat;
    activeFilter = data[0];
    for (let i = 0; i < data.length; i++) {
        const device = data[i];
        deviceList.push(device);
        const isChecked = i == 0 ? true : false;
        filterContainer.insertAdjacentHTML(
            "beforeend",
            deviceOption(device, isChecked)
        );
    }
}

generalDataLoader({ url: "/api/v1/device/user", func: showUserDevice });
