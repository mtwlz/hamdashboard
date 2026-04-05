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
                            colIndex === 2 && tableId === "dashboardTable"
                                ? parseInt(e.target.value, 10)
                                : e.target.value);

                        // ADD CONVERT TO ARRAY BUTTON FOR TITLES
                        if (tableId === "dashboardTable" && colIndex === 0 && !Array.isArray(item[colIndex])) {
                            const convertBtn = document.createElement("button");
                            convertBtn.textContent = "Convert to Array";
                            convertBtn.style.fontSize = "10px";
                            convertBtn.style.height = "18px";
                            convertBtn.onclick = () => {
                                item[colIndex] = [item[colIndex]];
                                updateTable(tableId, data, columns);
                            };
                            cell.appendChild(document.createElement("br"));
                            cell.appendChild(convertBtn);
                        }

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

// Helper to replace date placeholders
function replaceDatePlaceholders(obj) {
    const now = new Date();
    const YYYYMMDD = now.toISOString().slice(0, 10).replace(/-/g, '');
    const DATE_ISO = now.toISOString().slice(0, 10);

    if (typeof obj === 'string') {
        return obj.replace(/{{YYYYMMDD}}/g, YYYYMMDD).replace(/{{DATE_ISO}}/g, DATE_ISO);
    } else if (Array.isArray(obj)) {
        return obj.map(replaceDatePlaceholders);
    } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            obj[key] = replaceDatePlaceholders(obj[key]);
        });
        return obj;
    }
    return obj;
}

function processConfig(settings) {
    // Handle dynamic placeholders
    settings = replaceDatePlaceholders(settings);

    // Copy settings to window variables
    window.settingsSource = settings.settingsSource || "file";

    if (settings.disableSetup !== undefined) window.disableSetup = settings.disableSetup;
    if (settings.topBarCenterText) window.topBarCenterText = settings.topBarCenterText;
    if (settings.layout_cols) window.layout_cols = settings.layout_cols;
    if (settings.layout_rows) window.layout_rows = settings.layout_rows;
    if (settings.aURL) window.aURL = settings.aURL;
    if (settings.aRSS) window.aRSS = settings.aRSS;

    // Handle aIMG (supports both nested [Title, [Urls], Delay] and flat [Title, Url1, Url2...] formats)
    if (settings.aIMG) {
        window.aIMG = [];
        window.tileDelay = [];

        JSON.parse(JSON.stringify(settings.aIMG)).forEach((subArray) => {
            // subArray is [Title, [Urls], Delay]

            // Extract delay
            let delay = 30000;
            if (subArray.length >= 3) {
                delay = subArray[2];
            }
            window.tileDelay.push(delay);

            // Extract URLs and flatten
            // The main logic expects aIMG as [Title, Url1, Url2...]
            let flattened = [subArray[0]]; // Title
            if (Array.isArray(subArray[1])) {
                flattened.push(...subArray[1]);
            } else {
                flattened.push(subArray[1]);
            }
            window.aIMG.push(flattened);
        });
    } else if (settings.aImages) {
        // Fallback for old aImages (internal format)
        window.aIMG = [];
        window.tileDelay = [];

        JSON.parse(JSON.stringify(settings.aImages)).forEach((subArray) => {
            // subArray is [Title, [Urls], Delay]

            // Extract delay
            let delay = 30000;
            if (subArray.length >= 3) {
                delay = subArray[2];
            }
            window.tileDelay.push(delay);

            // Extract URLs and flatten
            let flattened = [subArray[0]]; // Title
            if (Array.isArray(subArray[1])) {
                flattened.push(...subArray[1]);
            } else {
                flattened.push(subArray[1]);
            }
            window.aIMG.push(flattened);
        });
    }

    start();
}

// ====================================================================
// BREADCRUMB NAVIGATION SYSTEM
// ====================================================================

/**
 * Parse and validate the breadcrumb parameter from the current URL
 * @returns {Array<string>} Array of config filenames in the breadcrumb trail
 */
function getCurrentBreadcrumb() {
    const urlParams = new URLSearchParams(window.location.search);
    const breadcrumbParam = urlParams.get('breadcrumb');

    if (!breadcrumbParam) return [];

    // Handle both encoded (%2B) and unencoded (+) separators
    // URLSearchParams automatically decodes %2B to +, so we can split on +
    const configs = breadcrumbParam.split('+').map(c => c.trim()).filter(c => c);

    // Validate config files (must end with .js or .json)
    const validated = configs.filter(config => {
        const valid = config.toLowerCase().endsWith('.js') || config.toLowerCase().endsWith('.json');
        if (!valid) {
            console.warn(`Breadcrumb: Skipping invalid config entry: ${config}`);
        }
        return valid;
    });

    return validated;
}

/**
 * Build a navigation URL with proper breadcrumb tracking
 * @param {string} targetConfig - The config file to navigate to
 * @returns {string} Constructed URL with breadcrumb parameter
 */
function buildNavigationUrl(targetConfig) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentConfig = urlParams.get('config') || 'config.js';

    // Get current breadcrumb trail
    let breadcrumb = getCurrentBreadcrumb();

    // Determine if current config is root
    const isCurrentRoot = (currentConfig === 'config.js' || currentConfig === 'config.json');
    const isTargetRoot = (targetConfig === 'config.js' || targetConfig === 'config.json');

    // If navigating to root, clear breadcrumb
    if (isTargetRoot) {
        return window.location.pathname + '?config=' + encodeURIComponent(targetConfig);
    }

    // Add current config to breadcrumb if not already root
    if (!isCurrentRoot) {
        // Prevent duplicate entries
        if (!breadcrumb.includes(currentConfig)) {
            breadcrumb.push(currentConfig);
        }
    } else {
        // If current is root, start fresh breadcrumb from root
        breadcrumb = [currentConfig];
    }

    // Limit breadcrumb depth to 10 items
    if (breadcrumb.length > 10) {
        breadcrumb = breadcrumb.slice(-10);
    }

    // Build URL with breadcrumb parameter
    const breadcrumbStr = breadcrumb.join('+');
    return window.location.pathname +
        '?breadcrumb=' + encodeURIComponent(breadcrumbStr) +
        '&config=' + encodeURIComponent(targetConfig);
}

/**
 * Build URL for navigating back to previous config in breadcrumb trail
 * @returns {string} URL for back navigation
 */
function buildPreviousUrl() {
    const breadcrumb = getCurrentBreadcrumb();

    if (breadcrumb.length === 0) {
        // No breadcrumb, go to default root
        return window.location.pathname + '?config=config.js';
    }

    // Get the last config from breadcrumb (the one to navigate to)
    const previousConfig = breadcrumb[breadcrumb.length - 1];

    // Remove the last item to create truncated breadcrumb
    const truncatedBreadcrumb = breadcrumb.slice(0, -1);

    if (truncatedBreadcrumb.length === 0) {
        // Going back to root, no breadcrumb needed
        return window.location.pathname + '?config=' + encodeURIComponent(previousConfig);
    }

    // Build URL with truncated breadcrumb
    const breadcrumbStr = truncatedBreadcrumb.join('+');
    return window.location.pathname +
        '?breadcrumb=' + encodeURIComponent(breadcrumbStr) +
        '&config=' + encodeURIComponent(previousConfig);
}

// ====================================================================
// END BREADCRUMB NAVIGATION SYSTEM
// ====================================================================

function ensureBackMenuItem(settings) {
    // Get current breadcrumb trail
    const breadcrumb = getCurrentBreadcrumb();

    // Only add PREVIOUS menu item if we have breadcrumb history
    if (breadcrumb.length === 0) {
        // No breadcrumb history, no PREVIOUS menu needed
        return;
    }

    // Initialize aURL if not exists
    if (!settings.aURL) {
        settings.aURL = [];
    }

    // Check if PREVIOUS menu item already exists
    const hasPrevious = settings.aURL.some(item => {
        if (!Array.isArray(item)) return false;
        const title = String(item[1] || '').toLowerCase();
        return title === 'previous' || title === 'prev';
    });

    if (hasPrevious) {
        // Already has PREVIOUS menu item, skip
        return;
    }

    // Get the previous config filename (last item in breadcrumb)
    const previousConfig = breadcrumb[breadcrumb.length - 1];

    // Add PREVIOUS menu item with color #212ff3
    // Store just the config filename, MenuOpt() will handle the navigation
    console.log(`Adding PREVIOUS menu item for breadcrumb navigation (back to: ${previousConfig})`);
    settings.aURL.unshift(["212ff3", "PREVIOUS", previousConfig, "1", "R"]);
}

function loadScriptConfig(url, fallback) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = async () => {
        console.log(`${url} loaded successfully (script)`);

        // CHECK FOR NEW JSONP-STYLE CONFIG
        if (window.hamdashConfig) {
            console.log("Found window.hamdashConfig (JSONP)");
            window.curSettingsSrc = `${url} (Data Object)`;
            const settings = window.hamdashConfig;

            // Ensure navigation
            ensureBackMenuItem(settings);

            processConfig(settings);
            // Clear it so it doesn't pollute subsequent loads
            window.hamdashConfig = undefined;
            return;
        }

        // wait for config to finish any async work (Legacy JS logic support)
        if (window.configReady && typeof window.configReady.then === "function") {
            try { await window.configReady; } catch (e) { console.warn("configReady rejected:", e); }
        }

        // Legacy: config.js likely set window variables directly
        window.curSettingsSrc = `${url} (Legacy JS)`;

        // We still want to ensure back menu item even for legacy JS files if possible
        // But for legacy, we have to inspect the global window.aURL
        if (window.aURL) {
            // Re-wrap in a temporary object to use our helper
            const tempSettings = { aURL: window.aURL };
            ensureBackMenuItem(tempSettings);
            window.aURL = tempSettings.aURL;
        }

        start();
    };
    script.onerror = (error) => {
        console.error(`Failed to load ${url}:`, error);
        if (fallback) {
            console.log("Attempting fallback...");
            fallback();
        } else {
            minimalConfiguration();
        }
    };
    document.head.appendChild(script);
}

async function loadJsonConfig(url, fallback) {
    const isFileProtocol = window.location.protocol === "file:";
    if (isFileProtocol) {
        console.warn(`Loading JSON config ${url} via file:// protocol might fail due to CORS.`);
    }

    try {
        const response = await fetch(url + "?_=" + Date.now());
        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }
        const settings = await response.json();
        console.log(`${url} loaded successfully`);
        window.curSettingsSrc = `${url} (JSON)`;

        ensureBackMenuItem(settings);
        processConfig(settings);
    } catch (e) {
        console.error(`Failed to load ${url}:`, e);
        if (fallback) {
            console.log("Attempting fallback from JSON load...");
            fallback(e);
        } else {
            minimalConfiguration();
        }
    }
}

async function loadConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    let configParam = urlParams.get("config");

    // Smart config parameter cleaning: handle double-encoded URLs
    if (configParam) {
        // Check for double encoding (e.g., %253D instead of %3D)
        if (configParam.includes('%25')) {
            console.warn('Detected double-encoded URL, attempting to clean...');
            try {
                configParam = decodeURIComponent(configParam);
            } catch (e) {
                console.error('Failed to decode config parameter:', e);
            }
        }

        // Extract just the filename if it contains URL parameters or encoding issues
        // This handles cases like "config.js?breadcrumb=..." being passed as the config param
        if (configParam.includes('?')) {
            const parts = configParam.split('?');
            configParam = parts[0];
            console.warn(`Config parameter contained URL params, extracted: ${configParam}`);
        }
    }

    // Case 1: user specified a file
    if (configParam) {
        const isJson = configParam.toLowerCase().endsWith(".json");
        if (isJson) {
            loadJsonConfig(configParam, () => minimalConfiguration());
        } else {
            loadScriptConfig(configParam, () => minimalConfiguration());
        }
        return;
    }

    // Case 2: Default loading chain
    // Try config.js -> config.json -> Minimal
    console.log("No config specified, attempting default chain: config.js -> config.json");

    loadScriptConfig("config.js", () => {
        console.log("config.js failed, falling back to config.json");
        loadJsonConfig("config.json", () => {
            console.log("config.json failed, falling back to minimal");
            minimalConfiguration();
        });
    });
}

// Open OS file picker and reload page with the selected filename as ?config=<filename>
function openConfigFileDialog() {
    let input = document.getElementById('configFileInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = '.js,text/javascript,.json,application/json';
        input.id = 'configFileInput';
        input.style.display = 'none';
        input.addEventListener('change', (ev) => {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;
            const filename = file.name;
            // Use buildNavigationUrl to maintain breadcrumb chain
            const newUrl = buildNavigationUrl(filename);
            window.location.href = newUrl;
        });
        document.body.appendChild(input);
    }
    input.click();
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
            window.settingsSource = parsedSettings.settingsSource;

            if (settingsSource === 'localStorage') {
                console.log('Loading settings from localStorage');
                window.curSettingsSrc = "Browser Local Storage";
                processConfig(parsedSettings);
            } else {
                console.log('Settings found in localStorage but loading from file');
                loadConfig();
            }
        } else {
            console.log('No settings found in localStorage');
            loadConfig();
        }
    } catch (error) {
        console.error('Failed to load configuration:', error);
        loadConfig();
    }
}

var help = "Double click on an image to expand to full screen.\n";
help += "Double click again to close full screen view.\n";
help += "Right click on an image to display the next one.\n";
help += "Images rotates every 30 seconds automatically by default.\n";

const currentVersion = "v2026.01.30";

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
    return src.includes("iframe|") || src.includes("iframedark|");
}

function isDarkFrame(src) {
    return src.includes("iframedark|");
}

function isDark(src) {
    return src.includes("dark|");
}

function isInvert(src) {
    return src.includes("invert|");
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

    // If the menu title or URL is a config filename (e.g. "satellite.js" or "traffic.json"), reload with breadcrumb tracking
    const title = String(aURL[num][1] || "");
    const link = String(aURL[num][2] || "");
    const menuText = title;

    // Special handling for PREVIOUS button - use buildPreviousUrl() to truncate breadcrumb
    if (menuText.toUpperCase() === "PREVIOUS" || menuText.toUpperCase() === "PREV") {
        const previousUrl = buildPreviousUrl();
        window.location.href = previousUrl;
        return;
    }

    // Check if this is a config file navigation (.js or .json)
    const isConfigFile = title.toLowerCase().endsWith(".js") ||
        title.toLowerCase().endsWith(".json") ||
        link.toLowerCase().endsWith(".js") ||
        link.toLowerCase().endsWith(".json");

    if (isConfigFile) {
        // Prefer the explicit URL if it contains the filename, otherwise use the title
        const filename = (link.toLowerCase().endsWith(".js") || link.toLowerCase().endsWith(".json")) ? link : title;

        // Use buildNavigationUrl for breadcrumb-aware navigation
        const newUrl = buildNavigationUrl(filename);
        window.location.href = newUrl;
        return;
    }


    if (menuText.toLowerCase() == "refresh") {
        location.reload();
        setRot();
    } else if (menuText.toLowerCase() == "load cfg") {
        // open file picker and reload page with ?config=<filename>
        openConfigFileDialog();
        return;
    } else if (menuText.toLowerCase() == "help") {
        alert(help);
    } else if (menuText.toLowerCase() == "setup") {
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
    } else if (menuText.toLowerCase() == "sources") {
        document.getElementById("array1").innerHTML =
            "<br>" + formatArray(aURL) + "<br><br>";
        document.getElementById("array2").innerHTML =
            "<br>" + formatArray(aIMG) + "<br><br>";
        document.getElementById("array3").innerHTML =
            "<br>" + formatArray(aRSS) + "<br><br>";
        document.getElementById("array4").innerHTML =
            `<br>Copyright (c) 2026 Pablo Sabbag, VA3HDL | Open Source License: MIT<br>
            <br>Dashboard codebase version: ${currentVersion}<br><br>`;
        document.getElementById("overlay").style.display = "block";
    } else if (menuText.toLowerCase() == "update") {
        window
            .open("https://github.com/VA3HDL/hamdashboard/releases/", "_blank")
            .focus();
    } else if (menuText.toLowerCase() == "back") {
        document.getElementById("FullScreen").src = "about:blank";
        document.getElementById("iFrameContainer").style.zIndex = -2;
        document.getElementById("iFrameContainer").style.backgroundColor = "black";
        document.getElementById("FullScreen").style.display = "none";
        document.getElementById("settingsPage").style.display = "none";
        setRot();
    } else {
        document.getElementById("iFrameContainer").style.zIndex = 1;
        document.getElementById("FullScreen").style.display = "block";
        var src = aURL[num][2];
        if (isDark(src)) {
            document.getElementById("FullScreen").style.filter = "invert(1) hue-rotate(180deg)";
            src = src.replace("dark|", "");
        } else {
            document.getElementById("FullScreen").style.filter = "none";
        }
        document.getElementById("FullScreen").src = src;
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
        document.getElementById("imgZoom").style.zIndex = -2;
    } else {
        // Stop refreshes
        window.stop();
        rotStop();
        //
        largeShow = 1;

        // Extract index more robustly (handles ClickOverlayN or ImageN)
        const idMatch = targetElement.id.match(/\d+/);
        if (!idMatch) {
            console.warn("Could not find index for zoom", targetElement.id);
            return;
        }
        largeIdx = +idMatch[0];

        const zoomContainer = document.getElementById("imgZoom");
        const largeImg = document.getElementById("ImageLarge");

        zoomContainer.style.zIndex = 3;

        // Find the source from the actual tile image
        const sourceImg = document.getElementById("Image" + largeIdx);
        if (sourceImg) {
            // WHEELZOOM COMPATIBILITY: 
            // If wheelzoom is active, sourceImg.src is a transparent placeholder.
            // The real image is in style.backgroundImage
            let realSrc = sourceImg.src;
            if (sourceImg.style.backgroundImage) {
                realSrc = sourceImg.style.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
            }

            largeImg.src = realSrc;
        }
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
    imgRot(i);
}

function imgRot(i) {
    if (aIMG[i].length > 2) {
        ++aIdx[i];
        if (aIdx[i] > aIMG[i].length - 1) {
            aIdx[i] = 1;
        }
    }

    // ROTATING TITLE LOGIC
    const titleDiv = document.getElementById("Title" + i);
    if (titleDiv && Array.isArray(aIMG[i][0])) {
        titleDiv.innerHTML = aIMG[i][0][aIdx[i] - 1] || "";
    }

    // Conditional overlay visibility (Lock/Unlock based on content type)
    const currentItem = aIMG[i][aIdx[i]];
    const overlay = document.getElementById('ClickOverlay' + i);
    if (overlay) {
        if (isVideo(currentItem) || isFrame(currentItem)) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }

    // console.log("aIdx", aIdx);
    // console.log("i", i, "aIdx[i]", aIdx[i], "aIMG[i][aIdx[i]]", aIMG[i][aIdx[i]]);
    vid = document.getElementById("Video" + i);
    img = document.getElementById("Image" + i);
    ifr = document.getElementById("iFrame" + i);

    const isImg = !isVideo(aIMG[i][aIdx[i]]) && !isFrame(aIMG[i][aIdx[i]]);
    const url = getImgURL(aIMG[i][aIdx[i]]);

    if (isVideo(aIMG[i][aIdx[i]])) {
        // Is video
        vid.src = url;
        vid.classList.remove("hidden");
        // Hide others
        img.classList.add("hidden");
        ifr.classList.add("hidden");
    } else if (isFrame(aIMG[i][aIdx[i]])) {
        // Is iFrame
        var src = aIMG[i][aIdx[i]];
        var newSrc = [];
        if (isDarkFrame(src)) {
            newSrc = src.split("iframedark|");
            ifr.style.filter = "invert(1) hue-rotate(180deg)";
        } else {
            newSrc = src.split("iframe|");
            ifr.style.filter = "none";
        }
        ifr.classList.remove("hidden");
        // Handle optional scale parameter: prefix|URL|SCALE
        var content = newSrc[1];
        var contentParts = content.split("|");
        ifr.src = contentParts[0];
        if (contentParts[1]) {
            ifr.style.transform = "scale(" + contentParts[1] + ")";
        }
        ifr.style.zIndex = 0;
        // Hide others
        vid.classList.add("hidden");
        img.classList.add("hidden");
    } else {
        // Is image
        var src = aIMG[i][aIdx[i]];
        if (isInvert(src)) {
            img.style.filter = "invert(1)";
            src = src.replace("invert|", "");
        } else {
            img.style.filter = "none";
        }
        img.src = getImgURL(src);
        img.classList.remove("hidden");
        // Hide others
        vid.classList.add("hidden");
        ifr.classList.add("hidden");
    }

    // FULL SCREEN ROTATION SUPPORT
    if (largeShow == 1 && i == largeIdx) {
        const largeImg = document.getElementById("ImageLarge");
        if (largeImg) {
            if (isImg) {
                largeImg.src = url;
            } else {
                // If we rotate into a non-image content, close the zoom view
                larger();
            }
        }
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

// .......##.......##....########...######...######.
// ......##.......##.....##.....##.##....##.##....##
// .....##.......##......##.....##.##.......##......
// ....##.......##.......########...######...######.
// ...##.......##........##...##.........##.......##
// ..##.......##.........##....##..##....##.##....##
// .##.......##..........##.....##..######...######.

// Store interval IDs to prevent duplicates
let rssIntervals = [];
let activeFetches = new Map(); // Track active fetch promises per feed URL
// Track proxy success/failure rates per feed
let proxyHealth = {};

// Function to fetch and display the RSS feed
function fetchAndDisplayRss() {
    // Clear any existing intervals first
    rssIntervals.forEach(intervalId => clearInterval(intervalId));
    rssIntervals = [];

    // List of CORS proxies to try (in order of preference)
    const corsProxies = [
        {
            name: 'allorigins',
            url: (feedUrl) => `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`
        },
        {
            name: 'corsproxy',
            url: (feedUrl) => `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`
        },
        {
            name: 'codetabs',
            url: (feedUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
        },
        {
            name: 'thingproxy',
            url: (feedUrl) => `https://thingproxy.freeboard.io/fetch/${feedUrl}`
        }
    ];

    const rssTickerContent = document.getElementById("rss-ticker-content");
    if (!rssTickerContent) {
        console.error("RSS ticker content element not found");
        return;
    }

    const feedContents = new Array(aRSS.length).fill("");
    let loadedFeeds = 0;

    console.log("Fetching RSS feeds...");

    aRSS.forEach(([rssUrl, interval], index) => {
        const fetchFeed = async (retryCount = 0, maxRetries = 1) => {
            // Prevent multiple simultaneous fetches of the same feed
            if (activeFetches.has(rssUrl)) {
                console.log(`⏸️ Fetch already in progress for ${rssUrl}, skipping...`);
                return;
            }

            console.log(`📡 Fetching feed: ${rssUrl}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);

            // Initialize proxy health tracking for this feed if needed
            if (!proxyHealth[rssUrl]) {
                proxyHealth[rssUrl] = {};
                corsProxies.forEach(proxy => {
                    proxyHealth[rssUrl][proxy.name] = { successes: 0, failures: 0 };
                });
            }

            // Sort proxies by success rate for this specific feed
            const sortedProxies = [...corsProxies].sort((a, b) => {
                const healthA = proxyHealth[rssUrl][a.name];
                const healthB = proxyHealth[rssUrl][b.name];
                const rateA = healthA.successes / (healthA.successes + healthA.failures + 1);
                const rateB = healthB.successes / (healthB.successes + healthB.failures + 1);
                return rateB - rateA;
            });

            // Create the fetch promise and store it
            const fetchPromise = (async () => {
                try {
                    // Try all proxies in parallel (race to success)
                    const proxyPromises = sortedProxies.map(async (proxy) => {
                        const proxyUrl = proxy.url(rssUrl);

                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

                            const response = await fetch(proxyUrl, {
                                signal: controller.signal,
                                cache: 'no-cache',
                                headers: {
                                    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml'
                                }
                            });
                            clearTimeout(timeoutId);

                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}`);
                            }

                            const data = await response.text();

                            // Check if we actually got XML (not an HTML error page)
                            const trimmedData = data.trim();
                            if (!trimmedData.startsWith('<?xml') &&
                                !trimmedData.startsWith('<rss') &&
                                !trimmedData.startsWith('<feed') &&
                                !trimmedData.includes('<rss') &&
                                !trimmedData.includes('<feed')) {
                                throw new Error('Response is not XML');
                            }

                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(data, "text/xml");

                            // Check for XML parsing errors
                            const parserError = xmlDoc.querySelector('parsererror');
                            if (parserError) {
                                throw new Error('XML parsing error');
                            }

                            // Automatically detect whether the feed uses "item" or "entry" tags
                            let itmTag = "item"; // Default to RSS
                            if (xmlDoc.querySelector("entry")) {
                                itmTag = "entry"; // Switch to Atom if "entry" is found
                            }

                            const feedTitle = xmlDoc.querySelector("channel > title, feed > title")?.textContent || "Unknown Feed";
                            const lastUpdated = xmlDoc.querySelector("channel > lastBuildDate, feed > updated")?.textContent || "Unknown Time";

                            const items = xmlDoc.querySelectorAll(itmTag);

                            if (items.length === 0) {
                                throw new Error('No items found in feed');
                            }

                            // Success! Update proxy health
                            proxyHealth[rssUrl][proxy.name].successes++;

                            console.log(`✅ Loaded ${items.length} items from ${rssUrl} (${proxy.name})`);

                            let feedText = `<span style="font-size: 0.9em; color: #aaa;"> ${feedTitle} - Last Updated: ${lastUpdated} </span> - `;

                            items.forEach((item) => {
                                const title = item.querySelector("title")?.textContent || "No title";

                                // Handle both <link href="..."> and <link>...</link>
                                const linkElement = item.querySelector("link");
                                let link = "";
                                if (linkElement) {
                                    if (linkElement.getAttribute("href")) {
                                        link = linkElement.getAttribute("href");
                                    } else {
                                        link = linkElement.textContent.trim();
                                    }
                                }

                                feedText += `<a href="${link}" target="_blank" style="margin-right: 50px;">${title}</a>`;
                            });

                            // Return the successful result
                            return { index, feedText, proxy: proxy.name };

                        } catch (error) {
                            // Update proxy health on failure
                            proxyHealth[rssUrl][proxy.name].failures++;
                            // Only log significant errors
                            if (!error.message.includes('aborted') && !error.message.includes('Failed to fetch')) {
                                console.warn(`❌ ${proxy.name} failed for ${rssUrl}: ${error.message}`);
                            }
                            throw error; // Re-throw to be caught by Promise.any
                        }
                    });

                    // Wait for the first successful proxy (race condition)
                    const result = await Promise.any(proxyPromises);

                    // Update the content for this feed (only once!)
                    feedContents[index] = result.feedText;
                    loadedFeeds++;

                    // Combine all feeds and update the ticker content
                    const displayContent = feedContents.filter(f => f).join("") ||
                        `<span style="color: #aaa;">Loading feeds... (${loadedFeeds}/${aRSS.length})</span>`;
                    rssTickerContent.innerHTML = displayContent;

                    // Update the ticker speed
                    updateTickerSpeed();

                    return result;

                } catch (error) {
                    // All proxies failed
                    console.error(`🚫 All proxies failed for ${rssUrl}`);

                    // Try retry if we haven't exceeded max retries
                    if (retryCount < maxRetries) {
                        const retryDelay = (retryCount + 1) * 3000; // 3s, 6s
                        console.log(`⏳ Retrying ${rssUrl} in ${retryDelay / 1000} seconds...`);

                        // Remove from active fetches before retry
                        activeFetches.delete(rssUrl);

                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        return fetchFeed(retryCount + 1, maxRetries);
                    } else {
                        // Final failure
                        console.error(`💀 Giving up on ${rssUrl} after ${maxRetries + 1} attempts`);
                        const domain = rssUrl.split('/')[2];
                        feedContents[index] = `<span style="color: #f88; margin-right: 50px;">⚠️ ${domain} unavailable</span>`;
                        rssTickerContent.innerHTML = feedContents.filter(f => f).join("") ||
                            '<span style="color: #f88;">Some feeds failed to load. Check console for details.</span>';
                        throw error;
                    }
                } finally {
                    // Always remove from active fetches when done (success or failure)
                    activeFetches.delete(rssUrl);
                }
            })();

            // Store the active fetch promise
            activeFetches.set(rssUrl, fetchPromise);

            // Wait for it to complete
            return fetchPromise;
        };

        // Fetch the feed immediately
        fetchFeed().catch(err => {
            console.error(`Failed to initialize feed ${rssUrl}:`, err);
        });

        // Set up periodic refresh based on the interval (in minutes)
        if (interval && interval > 0) {
            const intervalId = setInterval(() => {
                fetchFeed().catch(err => {
                    console.error(`Failed to refresh feed ${rssUrl}:`, err);
                });
            }, interval * 60 * 1000);
            rssIntervals.push(intervalId);
        }
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
    var parentDivL = document.getElementById("myMenuL");
    var parentDivR = document.getElementById("myMenuR");

    // Preppend the Load Cfg option to the right side menu
    if (typeof disableLdCfg === "undefined" || !disableLdCfg) {
        aURL.unshift(
            ["FF0000", "Load Cfg", "", "1", "R"]
        )
    }

    // Preppend the default options to the menu
    aURL.unshift(
        ["add10d", "BACK", "", "1", "L"],
        ["0dd1a7", "Help", "", "1", "L"],
        ["add10d", "BACK", "", "1", "R"],
        ["ff9100", "Refresh", "?_=" + Date.now()],
    );

    // Append the Setup and Sources option to the right side menu
    if (typeof disableSetup === "undefined" || !disableSetup) {
        aURL.push(
            ["ff9100", "Setup", "", "1", "R"]
        )
    }

    aURL.push(
        ["0dd1a7", "Sources", "", "1", "R"]
    );

    // Append the Update option to the right side menu if needed
    if (bUpdate) {
        aURL.push(["FF0000", "Update", "", "1", "R"]);
    }

    // Append the new div to the parent div
    aURL.forEach(function (innerArray, index) {

        const title = String(innerArray[1] || '').trim();
        const link = String(innerArray[2] || '').trim();
        const titleLower = title.toLowerCase();
        const linkLower = link.toLowerCase();
        const coreNames = ['back', 'refresh', 'load cfg', 'help', 'setup', 'sources', 'update'];

        // Create a new div element
        var newDiv = document.createElement("div");
        var color = innerArray[0].replace("#", "");

        let type = 'user';
        if (coreNames.includes(titleLower))
            type = 'core';
        else if (titleLower.includes('.js') || linkLower.includes('.js'))
            type = 'config';

        newDiv.innerHTML = `<a href="#" class="menu-link menu-${type}" style="background-color:#${color};" onclick="MenuOpt(${index})">${innerArray[1]}</a>`;

        if (innerArray[4] == "R") {
            // Set some properties for the new div
            newDiv.id = "mySidenavR";
            newDiv.className = "sidenavR";
            parentDivR.appendChild(newDiv);
        } else {
            // Set some properties for the new div
            newDiv.id = "mySidenavL";
            newDiv.className = "sidenav";
            parentDivL.appendChild(newDiv);
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

        // CLICK OVERLAY (Fix for missing right-click on video/iframe)
        var clickOverlay = document.createElement("div");
        clickOverlay.className = "click-overlay";
        clickOverlay.id = `ClickOverlay${index}`;
        clickOverlay.oncontextmenu = rotate;

        // Initial visibility
        const initialItem = innerArray[1];
        if (isVideo(initialItem) || isFrame(initialItem)) {
            clickOverlay.style.display = 'block';
        } else {
            clickOverlay.style.display = 'none';
        }

        clickOverlay.ondblclick = function (event) {
            const currentItem = aIMG[index][aIdx[index]];
            if (isVideo(currentItem) || isFrame(currentItem)) {
                // If it's a video or iframe, UNLOCK it instead of zooming
                console.log(`Unlocking tile ${index} for interaction`);
                this.style.display = 'none';
            } else {
                // If it's an image, trigger the standard zoom
                larger(event);
            }
        };
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
            var src = innerArray[1];
            var newSrc = [];
            if (isDarkFrame(src)) {
                newSrc = src.split("iframedark|");
                newFrame.style.filter = "invert(1) hue-rotate(180deg)";
            } else {
                newSrc = src.split("iframe|");
                newFrame.style.filter = "none";
            }
            var content = newSrc[1];
            var contentParts = content.split("|");
            newFrame.src = contentParts[0];
            if (contentParts[1]) {
                newFrame.style.transform = "scale(" + contentParts[1] + ")";
            }
            newFrame.style.zIndex = 0;
        } else {
            // Is an image
            newImg.classList.remove("hidden");
            var src = innerArray[1];
            if (isInvert(src)) {
                newImg.style.filter = "invert(1)";
                src = src.replace("invert|", "");
            } else {
                newImg.style.filter = "none";
            }
            newImg.src = getImgURL(src);
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
        newDiv.appendChild(clickOverlay);
        parentDiv.appendChild(newDiv);

        // Create a new div element for img title
        var newTtl = document.createElement("div");
        newTtl.className = "image-title";
        newTtl.id = `Title${index}`;

        let initialTitle = "";
        if (Array.isArray(innerArray[0])) {
            initialTitle = innerArray[0][0] || "";
        } else {
            initialTitle = innerArray[0];
        }

        if (initialTitle.length > 0 || Array.isArray(innerArray[0])) {
            newTtl.innerHTML = initialTitle;
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