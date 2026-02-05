const extensionName = "fawn-tracker";
const extensionFolderPath = `scripts/extensions/${extensionName}/`;

let isDrawerOpen = false;

async function loadHtml() {
    try {
        const response = await fetch(`${extensionFolderPath}tracker.html`);
        if (!response.ok) throw new Error("Failed to load tracker HTML");
        const html = await response.text();
        return html;
    } catch (error) {
        console.error("Fawn Tracker: Error loading HTML", error);
        return null;
    }
}

async function loadCss() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = `${extensionFolderPath}style.css`;
    document.head.appendChild(link);
}

function toggleDrawer() {
    const drawer = $("#fawn-tracker-container");
    if (!drawer.length) return;

    if (isDrawerOpen) {
        drawer.slideUp(200);
        isDrawerOpen = false;
    } else {
        drawer.slideDown(200);
        isDrawerOpen = true;
    }
}

async function init() {
    console.log("Fawn Tracker: Initializing...");

    // Load CSS
    loadCss();

    // Load HTML content
    const htmlContent = await loadHtml();
    if (!htmlContent) return;

    // Create a container for the drawer if it doesn't exist
    // We typically attach to the 'body' or a specific extension container in ST
    // For a drawer-like experience, we can append to body and position absolute/fixed
    if ($("#fawn-tracker-container").length === 0) {
        $("body").append(htmlContent);
    }

    // Set initial styling for hidden state
    const drawer = $("#fawn-tracker-container");
    drawer.hide();
    drawer.css({
        "position": "fixed",
        "top": "0",
        "right": "0",
        "height": "100%",
        "width": "350px", // adjust as needed
        "z-index": "2000",
        "box-shadow": "-2px 0 5px rgba(0,0,0,0.5)"
    });

    // Add toggle button to the top bar (or extension menu)
    // Standard ST extensions often add a button to the #extensions_menu or create a new icon in the top bar
    const toggleButton = $(`
        <div id="fawn-tracker-toggle" class="menu_button" title="Fawn Tracker">
            <i class="fa-solid fa-leaf"></i>
        </div>
    `);

    // Try to append to the top menu bar (right side)
    const rightNav = $("#rm_extensions_block");
    if (rightNav.length) {
        rightNav.append(toggleButton);
    } else {
        // Fallback: append to body as a floating button
        toggleButton.css({
            "position": "fixed",
            "top": "10px",
            "right": "100px", // distinct from other buttons
            "z-index": "2001",
            "cursor": "pointer",
            "padding": "10px",
            "background": "#25262b",
            "border-radius": "50%",
            "width": "40px",
            "height": "40px",
            "display": "flex",
            "align-items": "center",
            "justify-content": "center",
            "box-shadow": "0 2px 5px rgba(0,0,0,0.3)"
        });
        $("body").append(toggleButton);
    }

    // Event Listeners
    toggleButton.on("click", toggleDrawer);
    $("#fawn-close").on("click", toggleDrawer);

    console.log("Fawn Tracker: Ready.");
}

// Silly Tavern typically uses jQuery's ready or just executes the script
jQuery(async () => {
    await init();
});
