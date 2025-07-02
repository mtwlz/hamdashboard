// Track critical page events
window.addEventListener('DOMContentLoaded', () => {
    console.log('►►► DOMContentLoaded fired');
});

window.addEventListener('load', () => {
    console.log('►►► Page fully loaded');
});

// Track script execution
console.log('►►► Script loaded and running');

//   .d8888. d88888b d888888b d888888b d888888b d8b   db  d888b  .d8888.      .d8888. d88888b  .o88b. d888888b d888888b  .d88b.  d8b   db
//   88'  YP 88'     `~~88~~' `~~88~~'   `88'   888o  88 88' Y8b 88'  YP      88'  YP 88'     d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88
//   `8bo.   88ooooo    88       88       88    88V8o 88 88      `8bo.        `8bo.   88ooooo 8P         88       88    88    88 88V8o 88
//     `Y8b. 88~~~~~    88       88       88    88 V8o88 88  ooo   `Y8b.        `Y8b. 88~~~~~ 8b         88       88    88    88 88 V8o88
//   db   8D 88.        88       88      .88.   88  V888 88. ~8~ db   8D      db   8D 88.     Y8b  d8    88      .88.   `8b  d8' 88  V888
//   `8888Y' Y88888P    YP       YP    Y888888P VP   V8P  Y888P  `8888Y'      `8888Y' Y88888P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P

function getColumnHeaderTitle(tableId, columnNumber) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with id ${tableId} not found.`);
        return null;
    }

    const headers = table.querySelectorAll("thead th");
    if (columnNumber < 0 || columnNumber >= headers.length) {
        console.error(`Invalid column number ${columnNumber}.`);
        return null;
    }

    return headers[columnNumber].textContent;
}

document.addEventListener("DOMContentLoaded", () => {
    // Default Values
    const defaults = {
        settingsSource: "localStorage",
        topBarCenterText: "CALLSIGN - Locator",
        layout_cols: 4,
        layout_rows: 3,
        aURL: [["2196F3", "Photos", "https://picsum.photos/", 1, "L"]],
        aImages: [
            ["Tile 1", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 2", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 3", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 4", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 5", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 6", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 7", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 8", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 9", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 10", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 11", ["https://picsum.photos/seed/picsum/200/300"], 30000],
            ["Tile 12", ["https://picsum.photos/seed/picsum/200/300"], 30000],
        ],
        aRSS: [
            ["https://www.amsat.org/feed/", 60],           // Example RSS feed
            ["https://daily.hamweekly.com/atom.xml", 60], // Example Atom feed
        ],
    };

    // Load from LocalStorage or Defaults
    settings = JSON.parse(localStorage.getItem("hamdash_config")) || {
        ...defaults,
    };

    if (settings.settingsSource) {
        document.querySelector(
            `input[name="settingsSource"][value="${settings.settingsSource}"]`
        ).checked = true;
    }

    // Utility to Update Dashboard Items to Match Layout
    adjustDashboardItems = () => {
        const totalItems = settings.layout_cols * settings.layout_rows;
        const currentItems = settings.aImages.length;

        if (currentItems < totalItems) {
            // Add new placeholders if there are fewer items than needed
            for (let i = currentItems; i < totalItems; i++) {
                settings.aImages.push(["", [""], 5000]); // Default title, image array, and rotation interval
            }
        } else if (currentItems > totalItems) {
            // Remove excess items
            settings.aImages.splice(totalItems);
        }

        updateTable("dashboardTable", settings.aImages, [
            "Tile Title",
            "Tile URLs",
            "URL Rotation Interval (ms)",
        ]);
    };

    updateMenuTable = () => {
        updateTable("menuTable", settings.aURL, [
            "Color",
            "Text",
            "URL",
            "Scale",
            "Side",
        ]);
    };

    updateFeedTable = () => {
        updateTable("feedTable", settings.aRSS, [
            "Feed URL",
            "Refresh Interval (minutes)",
        ]);
    };

    // Utility to Update Tables
    const updateTable = (tableId, data, columns) => {
        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = "";
        data.forEach((item, index) => {
            const row = document.createElement("tr");
            columns.forEach((col, colIndex) => {
                const cell = document.createElement("td");
                if (tableId == "menuTable" && colIndex == 0) {                        // Color column for Menu options
                    const colorInput = document.createElement("input");
                    colorInput.type = "color";
                    colorInput.value = "#" + item[colIndex].replace("#", "");
                    colorInput.onchange = (e) => (item[colIndex] = e.target.value);
                    cell.appendChild(colorInput);
                } else {
                    if (Array.isArray(item[colIndex])) {
                        // Handle array of image URLs
                        const container = document.createElement("div");
                        item[colIndex].forEach((url, urlIndex) => {
                            const textarea = document.createElement("input");
                            textarea.type =
                                getColumnHeaderTitle(tableId, colIndex) === ""
                                    ? "number"
                                    : "text";
                            textarea.value = url;
                            textarea.onchange = (e) =>
                                (item[colIndex][urlIndex] = e.target.value);
                            container.appendChild(textarea);
                            const removeBtn = document.createElement("button");
                            removeBtn.textContent = "Remove URL";
                            removeBtn.onclick = () => {
                                item[colIndex].splice(urlIndex, 1);
                                updateTable(tableId, data, columns);
                            };
                            container.appendChild(document.createElement("br"));
                            container.appendChild(removeBtn);
                            container.appendChild(document.createElement("br"));
                        });
                        const addBtn = document.createElement("button");
                        addBtn.textContent = "Add URL";
                        addBtn.onclick = () => {
                            item[colIndex].push("");
                            updateTable(tableId, data, columns);
                        };
                        container.appendChild(addBtn);
                        cell.appendChild(container);
                    } else {
                        const input = document.createElement("input");
                        switch (getColumnHeaderTitle(tableId, colIndex)) {
                            case "Scale":
                                input.type = "number";
                                break;
                            case "URL Rotation Interval (ms)":
                                input.type = "number";
                                break;
                            default:
                                input.type = "text";
                        }
                        input.value = item[colIndex];
                        input.onchange = (e) =>
                        (item[colIndex] =
                            colIndex === 2
                                ? parseInt(e.target.value, 10)
                                : e.target.value);
                        cell.appendChild(input);
                    }
                }
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
                data.splice(index, 1);
                updateTable(tableId, data, columns);
                adjustDashboardItems();
            };
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });
    };

    // Load Initial Data
    document.getElementById("CenterText").value = settings.topBarCenterText;
    document.getElementById("layout_cols").value = settings.layout_cols;
    document.getElementById("layout_rows").value = settings.layout_rows;
    updateMenuTable();
    updateFeedTable();
    adjustDashboardItems(); // Ensure dashboard items match layout on load

    // Save Configuration
    document.getElementById("saveConfig").onclick = () => {
        settings.settingsSource = document.querySelector(
            'input[name="settingsSource"]:checked'
        ).value;
        settings.topBarCenterText =
            document.getElementById("CenterText").value;
        settings.layout_cols = parseInt(
            document.getElementById("layout_cols").value,
            10
        );
        settings.layout_rows = parseInt(
            document.getElementById("layout_rows").value,
            10
        );

        // Update aURL from the table
        const menuTableRows = document.querySelectorAll("#menuTable tbody tr");
        settings.aURL = Array.from(menuTableRows).map(row => {
            const cells = row.querySelectorAll("td");
            return [
                cells[0].querySelector("input").value,
                cells[1].querySelector("input").value,
                cells[2].querySelector("input").value,
                parseInt(cells[3].querySelector("input").value, 10),
                cells[4].querySelector("input").value
            ];
        });

        // Update aRSS from the table
        const feedTableRows = document.querySelectorAll("#feedTable tbody tr");
        settings.aRSS = Array.from(feedTableRows).map(row => {
            const cells = row.querySelectorAll("td");
            return [
                cells[0].querySelector("input").value,              // Feed URL
                parseInt(cells[1].querySelector("input").value, 10) // Refresh Interval
            ];
        });

        localStorage.setItem("hamdash_config", JSON.stringify(settings));
        alert("Settings saved!");
        updateInputs();
        updateMenuTable();
        updateFeedTable();
        adjustDashboardItems();
    };

    // Reset to Defaults
    document.getElementById("resetConfig").onclick = () => {
        localStorage.setItem("hamdash_config", JSON.stringify(defaults));
        alert("Settings reset to defaults!");
        settings = defaults;
        updateInputs();
        updateMenuTable();
        updateFeedTable();
        adjustDashboardItems();
    };

    // Delete Configuration from local storage
    document.getElementById("deleteConfig").onclick = () => {
        window.localStorage.removeItem('hamdash_config');
        alert("Deleted local storage settings!");
        // settings = defaults;
        updateInputs();
        updateMenuTable();
        updateFeedTable();
        adjustDashboardItems();
    };

    // Backup Configuration
    document.getElementById("backupConfig").onclick = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(settings));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
            "download",
            "hamdash_config_backup.json"
        );
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Restore Configuration
    document.getElementById("restoreConfig").onclick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                settings = JSON.parse(e.target.result);
                alert("\nSettings restored from backup!\n\nRemember to Save Settings to Local Storage, Backup, or Export\n\nif you want to make changes permanent.");
                updateInputs();
                updateMenuTable();
                updateFeedTable();
                adjustDashboardItems();
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Import config.js
    document.getElementById("importConfig").onclick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".js";
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // Wrap the content in an IIFE to avoid polluting the global scope
                const configScript = `(function() {
                ${e.target.result}
                return {
                  topBarCenterText,
                  layout_cols,
                  layout_rows,
                  aURL,
                  aIMG,
                  aRSS,
                  tileDelay
                };
              })()`;

                // Evaluate the IIFE and get the variables
                const config = eval(configScript);

                // Filter out sub-arrays from aURL containing "BACK" or "Refresh"
                const filteredAURL = config.aURL.filter(
                    (item) =>
                        !item.some(
                            (subItem) =>
                                typeof subItem === "string" &&
                                (subItem.includes("BACK") ||
                                    subItem.includes("Back") ||
                                    subItem.includes("Refresh") ||
                                    subItem.includes("Sources") ||
                                    subItem.includes("Update") ||
                                    subItem.includes("Help"))
                        )
                );

                // Create a JSON structure from the variables
                const configJSON = {
                    topBarCenterText: config.topBarCenterText,
                    layout_cols: config.layout_cols,
                    layout_rows: config.layout_rows,
                    aURL: filteredAURL,
                    aImages: config.aIMG.map((item, index) => {
                        // Arrange all items from second to last in a sub-array
                        const [first, ...rest] = item;
                        return [first, rest, config.tileDelay[index]];
                    }),
                    aRSS: config.aRSS,
                    settingsSource: "localStorage",
                };
                settings = configJSON;
                alert("\nSettings imported from config.js!\n\nRemember to Save Settings to Local Storage, Backup, or Export\n\nif you want to make changes permanent.");
                updateInputs();
                updateMenuTable();
                updateFeedTable();
                adjustDashboardItems();
            };
            reader.readAsText(file);
        };
        input.click();
    };

    document.getElementById("exportConfig").onclick = () => {
        const configJSContent = `// CUT START
var disableSetup = false; // Manually set to true to disable setup page menu option
var topBarCenterText = "${settings.topBarCenterText}";

// Grid layout desired
var layout_cols = ${settings.layout_cols};
var layout_rows = ${settings.layout_rows};

// Menu items
// Structure is as follows: HTML Color code, Option, target URL, scaling 1=Original Size, side (optional, nothing is Left, "R" is Right)
// The values are [color code, menu text, target link, scale factor, side],
// add new lines following the structure for extra menu options. The comma at the end is important!
var aURL = ${JSON.stringify(settings.aURL, null, 2)};

// Feed items
// Structure is as follows: target URL
// The values are [target link]
var aRSS = ${JSON.stringify(settings.aRSS, null, 2)};

// Dashboard Tiles items
// Tile Structure is Title, Source URL
// To display a website on the tiles use "iframe|" keyword before the tile URL
// [Title, Source URL],
// the comma at the end is important!
var aIMG = ${JSON.stringify(settings.aImages.map(item => [item[0], ...item[1].flat()]), null, 2)};

// Image rotation intervals in milliseconds per tile - If the line below is commented, tiles will be rotated every 5000 milliseconds (5s)
var tileDelay = ${JSON.stringify(settings.aImages.map(item => item[2]), null, 2)};

// CUT END`;

        const dataStr = "data:text/javascript;charset=utf-8," + encodeURIComponent(configJSContent);
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "config.js");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Add New Menu Item
    document.getElementById("addMenuItem").onclick = () => {
        settings.aURL.push(["", "", "", "", ""]);
        updateMenuTable();
    };

    // Add New Feed Item
    document.getElementById("addFeedItem").onclick = () => {
        settings.aRSS.push([""]);
        updateFeedTable();
    };

    // Update Dashboard Items When Layout Changes
    document
        .getElementById("layout_cols")
        .addEventListener("change", () => {
            settings.layout_cols = parseInt(
                document.getElementById("layout_cols").value,
                10
            );
            adjustDashboardItems();
        });

    document
        .getElementById("layout_rows")
        .addEventListener("change", () => {
            settings.layout_rows = parseInt(
                document.getElementById("layout_rows").value,
                10
            );
            adjustDashboardItems();
        });

    function updateInputs() {
        if (settings.settingsSource) {
            document.querySelector(
                `input[name="settingsSource"][value="${settings.settingsSource}"]`
            ).checked = true;
        }
        document.getElementById("CenterText").value = settings.topBarCenterText;
        document.getElementById("layout_cols").value = settings.layout_cols;
        document.getElementById("layout_rows").value = settings.layout_rows;
    }

    // Function to update the variable and the display text
    function updateValue() {
        topBarCenterText = document.getElementById('CenterText').value;
        layout_cols = document.getElementById('layout_cols').value;
        layout_rows = document.getElementById('layout_rows').value;
        document.getElementById('topBarCenter').textContent = topBarCenterText;
        document.getElementById('layout_cols').textContent = layout_cols;
        document.getElementById('layout_rows').textContent = layout_rows;
    }
    // Add an onblur event listener to the input field
    document.getElementById('CenterText').onblur = updateValue;
    document.getElementById('layout_cols').onblur = updateValue;
    document.getElementById('layout_rows').onblur = updateValue;

}); // End of DOMContentLoaded here
// End Settings Section

// db    db d888888b d888888b db      d888888b d888888b db    db      .d8888. d88888b  .o88b. d888888b d888888b  .d88b.  d8b   db
// 88    88 `~~88~~'   `88'   88        `88'   `~~88~~' `8b  d8'      88'  YP 88'     d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88
// 88    88    88       88    88         88       88     `8bd8'       `8bo.   88ooooo 8P         88       88    88    88 88V8o 88
// 88    88    88       88    88         88       88       88           `Y8b. 88~~~~~ 8b         88       88    88    88 88 V8o88
// 88b  d88    88      .88.   88booo.   .88.      88       88         db   8D 88.     Y8b  d8    88      .88.   `8b  d8' 88  V888
// ~Y8888P'    YP    Y888888P Y88888P Y888888P    YP       YP         `8888Y' Y88888P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P

function minimalConfiguration() {
    // Default settings
    window.disableSetup = false;
    window.curSettingsSrc = "None";
    window.topBarCenterText = "Use 'Setup' to configure your Ham Radio Dashboard";
    window.layout_cols = 0;
    window.layout_rows = 0;
    window.aURL = [];
    window.aIMG = [];
    window.aRSS = [];
    window.tileDelay = [];
    start();
}

async function checkIfFileExists(url) {
    try {
        const response = await fetch(url, {
            method: "HEAD",
            mode: "no-cors",
        });
        return response.ok;
    } catch (error) {
        console.error("Error checking file:", error);
        return false;
    }
}

async function loadScriptIfExists(url) {
    const exists = await checkIfFileExists(url);
    if (exists) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    } else {
        console.log("File does not exist");
        // Try to recover
        minimalConfiguration();
        return Promise.reject("File does not exist");
    }
}

async function loadConfig() {
    const isFileProtocol = window.location.protocol === 'file:';
    if (isFileProtocol) {
        // console.warn('Running from file system, some features may not work due to browser security restrictions.');
        // Directly load the script without checking if it exists
        const script = document.createElement('script');
        script.src = 'config.js';
        script.onload = () => {
            console.log('config.js loaded successfully');
            window.curSettingsSrc = "config.js from file system";
            start();
        };
        script.onerror = (error) => {
            console.error('Failed to load config.js:', error);
            // Try to recover
            minimalConfiguration();
        };
        document.head.appendChild(script);
    } else {
        await loadScriptIfExists('config.js');
        console.log('config.js loaded successfully');
        window.curSettingsSrc = "config.js from server";
        start();
    }
}

async function main() {
    try {
        // Check if settings exist in localStorage
        const settings = localStorage.getItem('hamdash_config');
        if (settings) {
            // console.log('Settings found in localStorage:', settings);
            console.log('Settings found in localStorage');
            // Parse the settings JSON string
            const parsedSettings = JSON.parse(settings);
            // Copy settings to separate variables
            window.settingsSource = parsedSettings.settingsSource;
            if (settingsSource === 'localStorage') {
                console.log('Loading settings from localStorage');
                window.disableSetup = parsedSettings.disableSetup;
                window.topBarCenterText = parsedSettings.topBarCenterText;
                window.layout_cols = parsedSettings.layout_cols;
                window.layout_rows = parsedSettings.layout_rows;
                window.aURL = parsedSettings.aURL;
                window.aRSS = parsedSettings.aRSS;
                window.aIMG = parsedSettings.aImages;
                // New array to hold the last elements for tileDelay
                window.tileDelay = [];
                // Iterate over the original array of arrays to extract tileDelay
                aIMG.forEach(subArray => {
                    // Remove the last element from the sub-array and add it to the new array
                    const lastElement = subArray.pop();
                    tileDelay.push(lastElement);
                });

                // Iterate over the original array of arrays to flatten the sub-arrays
                aIMG.forEach(subArray => {
                    // Replace the second element with its contents separated by commas and surrounded by quotes
                    if (Array.isArray(subArray[1])) {
                        subArray[1] = subArray[1].map(element => `${element}`).join(',');
                    }
                    const newElements = subArray[1].split(',');
                    // Replace the second element with the new elements
                    subArray.splice(1, 1, ...newElements);
                });
                window.curSettingsSrc = "Browser Local Storage";
                start();
            } else {
                console.log('Settings found in localStorage but loading from config.js file');
                // Load the settings from config.js file
                loadConfig();
            }
        } else {
            console.log('No settings found in localStorage');
            // Load the settings from config.js file
            loadConfig();
        }
    } catch (error) {
        console.error('Failed to load configuration:', error);
    }
}

var help = "Double click on an image to expand to full screen.\n";
help += "Double click again to close full screen view.\n";
help += "Right click on an image to display the next one.\n";
help += "Images rotates every 30 seconds automatically by default.\n";

const currentVersion = "v2025.04.02";

async function getLatestVersion() {
    try {
        const response = await fetch(
            "https://api.github.com/repos/VA3HDL/hamdashboard/releases/latest"
        );
        const data = await response.json();
        return data.tag_name;
    } catch (error) {
        console.error("Error fetching the latest version:", error);
        return currentVersion; // Fallback to the current version if there's an error
    }
}

function isNewVersionAvailable(currentVersion, latestVersion) {
    return currentVersion !== latestVersion;
}

bUpdate = false;
async function checkForUpdates() {
    const latestVersion = await getLatestVersion();
    if (isNewVersionAvailable(currentVersion, latestVersion)) {
        bUpdate = true;
    }
}

const videoExtensions = [".mp4", ".webm", ".ogg", ".ogv"];

function isVideo(src) {
    return videoExtensions.some((ext) => src.includes(ext));
}

function getVideoType(src) {
    if (src.includes(".mp4")) return "video/mp4";
    if (src.includes(".webm")) return "video/webm";
    if (src.includes(".ogg") || src.includes(".ogv")) return "video/ogg";
    return "";
}

function isFrame(src) {
    return src.includes("iframe|");
}

function oldformatArray(arr) {
    return arr.join("<br>");
}

function formatArray(arr) {
    return arr
        .map((innerArray) =>
            innerArray
                .map((item) => (typeof item === "string" ? `"${item}"` : item))
                .join(", ")
        )
        .join("<br>");
}

function setRot() {
    if (typeof tileDelay === "undefined") {
        // If no individual tile rotation is defined then default is 30s or 30000ms
        aInt[0] = setInterval(() => slide(), 30000);
    } else {
        tileDelay.forEach(function (tile, i) {
            if (tile > 0) {
                aInt[i] = setInterval(() => slide(i), tile);
            }
        });
    }
}

function rotStop() {
    if (typeof tileDelay === "undefined") {
        clearTimeout(aInt[0]);
    } else {
        tileDelay.forEach(function (tile, i) {
            clearTimeout(aInt[i]);
        });
    }
}

// This function shows the embedded websites
function MenuOpt(num) {
    window.stop();
    rotStop();
    if (aURL[num][1].toLowerCase() == "refresh") {
        location.reload();
        setRot();
    } else if (aURL[num][1].toLowerCase() == "help") {
        alert(help);
    } else if (aURL[num][1].toLowerCase() == "setup") {
        // Configure visualization
        document.getElementById("FullScreen").style.display = "none";
        document.getElementById("fixedSection").style.display = "block";
        document.getElementById("settingsPage").style.display = "block";
        document.getElementById("iFrameContainer").style.zIndex = 1;
        document.getElementById("iFrameContainer").style.backgroundColor = "black";
        if (curSettingsSrc === "local") {
            document.querySelector(`input[name="settingsSource"][value="localStorage"]`).checked = true;
        } else if (curSettingsSrc.includes("config.js")) {
            document.querySelector(`input[name="settingsSource"][value="file"]`).checked = true;
        }
        window.settings.topBarCenterText = topBarCenterText;
        window.settings.layout_cols = window.layout_cols;
        window.settings.layout_rows = window.layout_rows;
        document.getElementById("CenterText").value = window.settings.topBarCenterText;
        document.getElementById("layout_cols").value = window.settings.layout_cols;
        document.getElementById("layout_rows").value = window.settings.layout_rows;
        filteredAURL = aURL.filter(
            (item) =>
                !item.some(
                    (subItem) =>
                        typeof subItem === "string" &&
                        (subItem.includes("BACK") ||
                            subItem.includes("Back") ||
                            subItem.includes("Refresh") ||
                            subItem.includes("Setup") ||
                            subItem.includes("Sources") ||
                            subItem.includes("Update") ||
                            subItem.includes("Help"))
                )
        );
        window.settings.aURL = filteredAURL;
        window.settings.aImages = aIMG.map((item, index) => {
            const [first, ...rest] = item;
            return [first, rest, tileDelay[index]];
        });
        window.settings.aRSS = aRSS;
        // Update the visualization on the Setup page
        updateMenuTable();
        updateFeedTable();
        adjustDashboardItems();
    } else if (aURL[num][1].toLowerCase() == "sources") {
        document.getElementById("array1").innerHTML =
            "<br>" + formatArray(aURL) + "<br><br>";
        document.getElementById("array2").innerHTML =
            "<br>" + formatArray(aIMG) + "<br><br>";
        document.getElementById("array3").innerHTML =
            "<br>" + formatArray(aRSS) + "<br><br>";
        document.getElementById("array4").innerHTML =
            `<br>Copyright (c) 2025 Pablo Sabbag, VA3HDL | Open Source License: MIT<br>
            <br>Dashboard codebase version: ${currentVersion}<br><br>`;
        document.getElementById("overlay").style.display = "block";
    } else if (aURL[num][1].toLowerCase() == "update") {
        window
            .open("https://github.com/VA3HDL/hamdashboard/releases/", "_blank")
            .focus();
    } else if (aURL[num][1].toLowerCase() == "back") {
        document.getElementById("FullScreen").src = "about:blank";
        document.getElementById("iFrameContainer").style.zIndex = -2;
        document.getElementById("iFrameContainer").style.backgroundColor = "black";
        document.getElementById("FullScreen").style.display = "none";
        document.getElementById("settingsPage").style.display = "none";
        setRot();
    } else {
        document.getElementById("iFrameContainer").style.zIndex = 1;
        document.getElementById("FullScreen").style.display = "block";
        document.getElementById("FullScreen").src = aURL[num][2];
        document.getElementById("FullScreen").style.transform = "scale(" + aURL[num][3] + ")";
    }
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}

// This function shows the larger images when double click to enlarge
function larger(event) {
    var targetElement = event.target || event.srcElement;
    if (largeShow == 1) {
        // Start refreshes
        setRot();
        //
        largeShow = 0;
        document.getElementById("imgZoom").style.display = "none";
        document.getElementById("imgZoom").style.zIndex = -2;
    } else {
        // Stop refreshes
        window.stop();
        rotStop();
        //
        largeShow = 1;
        largeIdx = +targetElement.id.match(/\d+/)[0];
        document.getElementById("imgZoom").style.display = "block";
        document.getElementById("imgZoom").style.zIndex = 3;
        document.getElementById("ImageLarge").src =
            targetElement.style.backgroundImage
                .replace(/^url\(["']?/, "")
                .replace(/["']?\)$/, "");
    }
}

// Image cache prevention
// Check if the image URL already include parameters, then avoid the random timestamp
function getImgURL(url) {
    return url.includes("?") ? url : url + "?_=" + Date.now();
}

// Manually rotate images
function rotate(event) {
    event.preventDefault();
    var targetElement = event.target || event.srcElement;
    if (largeShow == 1) {
        i = largeIdx;
    } else {
        i = +targetElement.id.match(/\d+/)[0];
    }
    if (aIMG[i].length > 2) {
        ++aIdx[i];
        if (aIdx[i] > aIMG[i].length - 1) {
            aIdx[i] = 1;
        }
        if (isVideo(aIMG[i][aIdx[i]])) {
            // Is video, event is not attached to videos for now, do nothing
        } else if (isFrame(aIMG[i][aIdx[i]])) {
            // Is iFrame, event is not attached to iFrames for now, do nothing
        } else {
            // Is image
            document.getElementById(targetElement.id).src = getImgURL(
                aIMG[i][aIdx[i]]
            );
        }
    }
}

function imgRot(i) {
    if (aIMG[i].length > 2) {
        ++aIdx[i];
        if (aIdx[i] > aIMG[i].length - 1) {
            aIdx[i] = 1;
        }
    }
    // console.log("aIdx", aIdx);
    // console.log("i", i, "aIdx[i]", aIdx[i], "aIMG[i][aIdx[i]]", aIMG[i][aIdx[i]]);
    vid = document.getElementById("Video" + i);
    img = document.getElementById("Image" + i);
    ifr = document.getElementById("iFrame" + i);
    if (isVideo(aIMG[i][aIdx[i]])) {
        // Is video
        vid.src = getImgURL(aIMG[i][aIdx[i]]);
        vid.classList.remove("hidden");
        // Hide others
        img.classList.add("hidden");
        ifr.classList.add("hidden");
    } else if (isFrame(aIMG[i][aIdx[i]])) {
        // Is iFrame
        newSrc = aIMG[i][aIdx[i]].split("|");
        ifr.classList.remove("hidden");
        ifr.src = newSrc[1];
        if (newSrc[2]) ifr.style.transform = "scale(" + newSrc[2] + ")";
        ifr.style.zIndex = 0;
        // Hide others
        vid.classList.add("hidden");
        img.classList.add("hidden");
    } else {
        // Is image
        img.src = getImgURL(aIMG[i][aIdx[i]]);
        img.classList.remove("hidden");
        // Hide others
        vid.classList.add("hidden");
        ifr.classList.add("hidden");
    }
}

// Automatically rotate images
function slide(i) {
    // check all tiles or one tile
    if (typeof i === "undefined") {
        // get the locations with multiple images
        aIMG.forEach(function (innerArray, i) {
            imgRot(i);
        });
    } else {
        // Only one tile as per timeout call
        imgRot(i);
    }
}

function updateTickerSpeed() {
    const rssTickerContent = document.querySelector(".rss-ticker-content");
    if (rssTickerContent) {
        // Calculate the width of the content and the container
        const contentWidth = rssTickerContent.scrollWidth;
        const containerWidth = rssTickerContent.parentElement.offsetWidth;

        // Define a base speed (e.g., 180px per second)
        const baseSpeed = 180; // pixels per second

        // Calculate the duration based on the content width
        const duration = (contentWidth + containerWidth) / baseSpeed;

        // Update the CSS variable for the animation duration
        rssTickerContent.style.setProperty("--ticker-duration", `${duration}s`);
        // console.log(`Updated ticker speed: ${duration}s`);
    }
}

// Function to fetch and display the RSS feed
function fetchAndDisplayRss() {
    const proxyUrl = "https://corsproxy.io/";
    const rssTickerContent = document.getElementById("rss-ticker-content");

    // Array to store the content of each feed
    const feedContents = new Array(aRSS.length).fill("");

    console.log("Fetching RSS feeds...");
    aRSS.forEach(([rssUrl, interval], index) => {
        const fetchFeed = () => {
            console.log(`Fetching feed: ${rssUrl}`);
            fetch(proxyUrl + "?url=" + encodeURIComponent(rssUrl))
                .then((response) => response.text())
                .then((data) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "text/xml");

                    // Automatically detect whether the feed uses "item" or "entry" tags
                    let itmTag = "item"; // Default to RSS
                    if (xmlDoc.querySelector("entry")) {
                        itmTag = "entry"; // Switch to Atom if "entry" is found
                    }

                    const feedTitle = xmlDoc.querySelector("channel > title, feed > title")?.textContent || "Unknown Feed";
                    const lastUpdated = xmlDoc.querySelector("channel > lastBuildDate, feed > updated")?.textContent || "Unknown Time";

                    const items = xmlDoc.querySelectorAll(itmTag);
                    console.log(`Found ${items.length} items in feed: ${rssUrl}`);

                    let feedText = `<span style="font-size: 0.9em; color: #aaa;"> ${feedTitle} - Last Updated: ${lastUpdated} </span> - `;

                    items.forEach((item) => {
                        const title = item.querySelector("title").textContent;

                        // Handle both <link href="..."> and <link>...</link>
                        const linkElement = item.querySelector("link");
                        let link = "";
                        if (linkElement) {
                            if (linkElement.getAttribute("href")) {
                                // If <link href="...">
                                link = linkElement.getAttribute("href");
                            } else {
                                // If <link>...</link>
                                link = linkElement.textContent;
                            }
                        }

                        // console.log("title:", title);
                        // console.log("link:", link);
                        feedText += `<a href="${link}" target="_blank" style="margin-right: 50px;">${title}</a>`;
                    });

                    // Update the content for this feed in the array
                    feedContents[index] = feedText;

                    // Combine all feeds and update the ticker content
                    rssTickerContent.innerHTML = feedContents.join("") || "Failed to load RSS feeds.";

                    // Update the ticker speed
                    updateTickerSpeed();
                })
                .catch((error) => {
                    console.error(`Error fetching RSS feed from ${rssUrl}:`, error);
                });
        };

        // Fetch the feed immediately
        fetchFeed();

        // Set up periodic refresh based on the interval (in minutes)
        setInterval(fetchFeed, interval * 60 * 1000);
    });
}

// .d8888. d888888b  .d8b.  d8888b. d888888b
// 88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~'
// `8bo.      88    88ooo88 88oobY'    88
//   `Y8b.    88    88~~~88 88`8b      88
// db   8D    88    88   88 88 `88.    88
// `8888Y'    YP    YP   YP 88   YD    YP

function start() {
    // Configurable grid layout logic. Defaults to standard 4 columns by 3 rows if values are missing in config.js file.
    var layout_cols = typeof window.layout_cols === "undefined" ? 4 : window.layout_cols;
    var layout_rows = typeof window.layout_rows === "undefined" ? 3 : window.layout_rows;
    var layout_grid = "auto ".repeat(layout_cols);
    var layout_width = 99.6 / layout_cols + "vw";
    var layout_height = 93 / layout_rows + "vh";
    var iTiles = layout_cols * layout_rows;
    document.documentElement.style.setProperty(
        "--main-layout",
        layout_grid
    );
    document.documentElement.style.setProperty(
        "--main-width",
        layout_width
    );
    document.documentElement.style.setProperty(
        "--main-height",
        layout_height
    );

    document.getElementById("currentSettingsSource").innerHTML = curSettingsSrc;

    // Default variables initialization
    window.largeShow = 0;
    window.aIdx = [];
    window.aInt = [];
    for (var i = 1; i <= iTiles; i++) {
        aIdx.push(1);
        aInt.push(null);
    }
    if (!(aIMG.length == tileDelay.length && aIMG.length == iTiles)) {
        var msg = "\nError detected on config.js file!\n\n";
        msg += "The number of tile sources (" + aIMG.length + " in aIMG) and\n";
        msg += "the tile delay (" + tileDelay.length + " in tileDelay) arrays should match\n";
        msg += "the number of items each one contains and\n";
        msg += "the number of tiles used on the layout specified (" + iTiles + ").";
        alert(msg);
    }

    // Get the parent div for Menu container
    var parentDiv = document.getElementById("myMenu");
    var parentDivR = document.getElementById("myMenuR");

    // Preppend the default options to the menu
    aURL.unshift(
        ["add10d", "BACK", "", "1", "L"],
        ["add10d", "BACK", "", "1", "R"],
        ["ff9100", "Refresh", "?_=" + Date.now(), "1"],
        ["0dd1a7", "Help", "#", "1", "L"]
    );

    // Append the Setup and Sources option to the right side menu
    if (typeof disableSetup === "undefined" || !disableSetup) {
        aURL.push(
            ["ff9100", "Setup", "#", "1", "R"]
        )
    }

    aURL.push(
        ["0dd1a7", "Sources", "#", "1", "R"]
    );

    // Append the Update option to the right side menu if needed
    if (bUpdate) {
        aURL.push(["FF0000", "Update", "#", "1", "R"]);
    }

    // Append the new div to the parent div
    aURL.forEach(function (innerArray, index) {
        // Create a new div element
        var newDiv = document.createElement("div");
        var color = innerArray[0].replace("#", "");
        newDiv.innerHTML = `<a href="#" style="background-color:#${color};" onclick="MenuOpt(${index})">${innerArray[1]}</a>`;
        if (innerArray[4] == "R") {
            // Set some properties for the new div
            newDiv.id = "mySidenavR";
            newDiv.className = "sidenavR";
            parentDivR.appendChild(newDiv);
        } else {
            // Set some properties for the new div
            newDiv.id = "mySidenav";
            newDiv.className = "sidenav";
            parentDiv.appendChild(newDiv);
        }
    });

    // Get the parent div for Dashboard container
    var parentDiv = document.getElementById("dash");

    // Append the new div to the parent div
    aIMG.forEach(function (innerArray, index) {
        // Create a new div element
        var newDiv = document.createElement("div");
        newDiv.className = "image-container";
        newDiv.id = `box${index}`;

        // Add video placeholder containers
        const video = document.createElement("video");
        video.id = `Video${index}`;
        video.classList.add("media", "hidden");
        video.controls = true;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        const source = document.createElement("source");

        // Create a new img element
        var newImg = document.createElement("img");
        newImg.id = `Image${index}`;
        newImg.classList.add("hidden");
        newImg.oncontextmenu = rotate;
        newImg.ondblclick = larger;

        // append newIframes iFrameNN
        var newFrame = document.createElement("iframe");
        newFrame.className = "iframe-tile";
        newFrame.id = `iFrame${index}`;
        newFrame.classList.add("hidden");
        var newSrc = " ";

        if (isVideo(innerArray[1])) {
            // Is a video
            video.classList.remove("hidden");
            source.src = innerArray[1];
            source.type = getVideoType(innerArray[1]);
            video.appendChild(source);
        } else if (isFrame(innerArray[1])) {
            // Is iFrame
            newFrame.classList.remove("hidden");
            newSrc = innerArray[1].split("|");
            newFrame.src = newSrc[1];
            if (newSrc[2]) newFrame.style.transform = "scale(" + newSrc[2] + ")";
            newFrame.style.zIndex = 0;
        } else {
            // Is an image
            newImg.classList.remove("hidden");
            newImg.src = getImgURL(innerArray[1]);
            newImg.onerror = function () {
                text = "Failed to load image";
                console.log(text, this.src);
                if (this.src.includes("?")) {
                    // Retry without passing variables first to see if fixes the error
                    console.log("Trying without caching prevention");
                    newImg.src = this.src.split("?")[0];
                } else {
                    el = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="330">
                  <g>
                    <text style="font-size:34px; line-height:1.25; white-space:pre; fill:#ffaa00; fill-opacity:1; stroke:#ffaa00; stroke-opacity:1;">
                      <tspan x="100" y="150">${text}</tspan>
                      </text>
                      </g>
                      </svg>`;
                    newImg.src = "data:image/svg+xml;base64," + window.btoa(el);
                }
            };
        }

        // append newDivs boxNN
        newDiv.appendChild(video);
        newDiv.appendChild(newImg);
        newDiv.appendChild(newFrame);
        parentDiv.appendChild(newDiv);

        // Create a new div element for img title if not empty
        if (innerArray[0].length > 0) {
            var newTtl = document.createElement("div");
            newTtl.className = "image-title";
            newTtl.innerHTML = innerArray[0];
            newDiv.appendChild(newTtl);
        }
    });

    // assign wheelzoom functionality to all 12 images
    wheelzoom(document.querySelectorAll("img"));

    window.addEventListener("resize", function () {
        "use strict";
        window.location.reload();
    });

    if (typeof aRSS !== "undefined" && aRSS.length > 0) {
        // Dynamically create the RSS ticker div
        const rssTicker = document.createElement("div");
        rssTicker.id = "rss-ticker";
        rssTicker.className = "rss-ticker";

        const rssTickerContent = document.createElement("div");
        rssTickerContent.id = "rss-ticker-content";
        rssTickerContent.className = "rss-ticker-content";

        rssTicker.appendChild(rssTickerContent);
        document.body.appendChild(rssTicker); // Add the ticker to the body

        // Call the function to fetch and display RSS feeds
        fetchAndDisplayRss();

        // Add event listeners for pause and resume functionality
        rssTickerContent.addEventListener("mouseenter", () => {
            rssTickerContent.style.animationPlayState = "paused";
        });

        rssTickerContent.addEventListener("mouseleave", () => {
            rssTickerContent.style.animationPlayState = "running";
        });
    }

    setRot();
}

// This function update the time on the top bar
function updateTopBar() {
    const now = new Date();
    const localDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const localTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    });

    const utcDate = now.toISOString().slice(0, 10);
    const utcTime = now.toISOString().slice(11, 19) + " UTC";

    const topBarLeft = document.getElementById("topBarLeft");
    topBarLeft.textContent = `${localDate} - ${localTime}`;
    const topBarCenter = document.getElementById("topBarCenter");
    topBarCenter.textContent = topBarCenterText;
    const topBarRight = document.getElementById("topBarRight");
    topBarRight.textContent = `${utcDate} ${utcTime}`;
}

// Update every second
setInterval(updateTopBar, 1000);

// Run the check when the application starts
checkForUpdates();