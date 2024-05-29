const filterContainer = document.getElementById("filter-container");
const activeFilterContainer = document.getElementById("active-filter");
const deviceList = [];
let activeFilter = {};

function handleDeviceChange(src) {
    const kodeUnik = src.value;
    // Cari Kode Unik Di Device List Untuk Mendapatkan Nama
    for (let i = 0; i < deviceList.length; i++) {
        const device = deviceList[i];
        if (device.kode_unik === kodeUnik) {
            activeFilterContainer.textContent = device.nama_alat;
            activeFilter = device;

            // Send Event To Refresh UI
            let event = new CustomEvent("userChangeDevice", {
                detail: {
                    data: activeFilter,
                },
            });
            document.dispatchEvent(event);
        }
    }
}

function deviceOption(data, isChecked) {
    return `
    <div class="flex items-center mb-3 cursor-pointer">
        <input id="device-${data.kode_unik}" 
            ${isChecked ? "checked" : ""} 
            value="${data.kode_unik}"
            type="radio" 
            name="device-radio" 
            onchange="handleDeviceChange(this);"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        >
        <label for="device-${data.kode_unik}" 
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
            ${data.nama_alat}
        </label>
    </div>
    `;
}

function showUserDevice(data) {
    activeFilterContainer.textContent = data[0].nama_alat;
    activeFilter = data[0];
    // Send Event To Render Data
    let event = new CustomEvent("userChangeDevice", {
        detail: {
            data: data[0],
        },
    });
    document.dispatchEvent(event);

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

// Ketika pengguna mencari mengunakan form maka liat data di variabel deviceList, dan tampilkan hasil pencariannya

generalDataLoader({ url: "/api/v1/device/user", func: showUserDevice });
