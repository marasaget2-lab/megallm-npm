
const extensionName = "fawn-tracker";
// Use a relative path from the script execution context if possible,
// but ST extensions usually reside in public/scripts/extensions/<name>/
// We can try to detect the path, but standardizing on the folder name is common.
const extensionFolderPath = `scripts/extensions/${extensionName}/`;

let isDrawerOpen = false;

async function loadHtml() {
    try {
        const response = await fetch(`${extensionFolderPath}tracker.html`);
        if (!response.ok) {
            console.warn(`Fawn Tracker: Failed to load HTML from ${extensionFolderPath}tracker.html`);
            return null;
        }
        const html = await response.text();
        return html;
    } catch (error) {
        console.error("Fawn Tracker: Error loading HTML", error);
        return null;
    }
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

// Helper to safely set text with icon
function setStatWithIcon(selector, iconClass, text) {
    const el = $(selector);
    el.empty();
    el.append(`<i class="${iconClass}"></i> `);
    el.append(document.createTextNode(text));
}

// Function to parse chat content and update the UI
function updateTrackerFromText(text) {
    if (!text) return;

    // 1. Info Block parsing
    // Example: C1: Серафина|user-md|черный сарафан|присутствует
    const c1Match = text.match(/C1:\s*([^|]+)\|([^|]+)\|([^|]+)\|([^\n]+)/);
    if (c1Match) {
        $("#fawn-info-block .character-card:nth-child(1) .fawn-name").text(c1Match[1].trim());
        setStatWithIcon("#fawn-info-block .character-card:nth-child(1) .fawn-stat:nth-child(1)", "fa-solid fa-user-md", c1Match[2].trim());
        setStatWithIcon("#fawn-info-block .character-card:nth-child(1) .fawn-stat:nth-child(2)", "fa-solid fa-shirt", c1Match[3].trim());
        $("#fawn-info-block .character-card:nth-child(1) .fawn-stat:nth-child(3)").text(c1Match[4].trim());
    }

    const c2Match = text.match(/C2:\s*([^|]+)\|([^|]+)\|([^|]+)\|([^\n]+)/);
    if (c2Match) {
        $("#fawn-info-block .character-card:nth-child(2) .fawn-name").text(c2Match[1].trim());
        setStatWithIcon("#fawn-info-block .character-card:nth-child(2) .fawn-stat:nth-child(1)", "fa-solid fa-user", c2Match[2].trim());
        setStatWithIcon("#fawn-info-block .character-card:nth-child(2) .fawn-stat:nth-child(2)", "fa-solid fa-bandage", c2Match[3].trim());
        $("#fawn-info-block .character-card:nth-child(2) .fawn-stat:nth-child(3)").text(c2Match[4].trim());
    }

    // weather: sun|солнечно
    const weatherMatch = text.match(/weather:\s*([^|]+)\|([^\n]+)/);
    if (weatherMatch) {
        $(".fawn-environment .env-item:nth-child(1) span").text(`${weatherMatch[1].trim()} | ${weatherMatch[2].trim()}`);
    }
    // time
    const timeMatch = text.match(/time:\s*([^\n]+)/);
    if (timeMatch) {
        $(".fawn-environment .env-item:nth-child(2) span").text(timeMatch[1].trim());
    }
    // date
    const dateMatch = text.match(/date:\s*([^\n]+)/);
    if (dateMatch) {
        $(".fawn-environment .env-item:nth-child(3) span").text(dateMatch[1].trim());
    }
    // season
    const seasonMatch = text.match(/season:\s*([^|]+)\|([^\n]+)/);
    if (seasonMatch) {
        $(".fawn-environment .env-item:nth-child(4) span").text(`${seasonMatch[1].trim()} | ${seasonMatch[2].trim()}`);
    }

    // thought: ...
    const thoughtMatch = text.match(/thought:\s*([^\n]+)/);
    if (thoughtMatch) {
        $("#fawn-info-block .fawn-thought-box .text").text(thoughtMatch[1].trim());
    }

    // 2. Matrix parsing
    // R1: Name|Value|Tag|Status
    const r1Match = text.match(/R1:\s*([^|]+)\|([^|]+)\|([^|]+)\|([^\n]+)/);
    if (r1Match) {
        const relEl = $(".fawn-relationship").first();
        relEl.find(".rel-name").text(r1Match[1].trim());
        relEl.find(".rel-val").text(r1Match[2].trim());
        relEl.find(".rel-bar").css("width", r1Match[2].trim());
        relEl.find(".rel-tag").text(r1Match[3].trim());
        relEl.find(".rel-status").text(r1Match[4].trim());
    }

    // Feelings F1-F4
    for (let i = 1; i <= 4; i++) {
        const fMatch = text.match(new RegExp(`F${i}:\\s*([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^\\n]+)`));
        if (fMatch) {
            const fEl = $(`.feelings-list .feeling-item:nth-child(${i})`);
            fEl.find(".f-name").text(fMatch[1].trim());
            fEl.find(".f-icon").text(fMatch[2].trim()); // Icon is usually emoji, safe to text()
            // Color is style, careful. We assume hex codes from prompt.
            const color = fMatch[3].trim();
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                fEl.find(".f-icon").css("color", color);
                fEl.find(".f-bar").css("background-color", color);
            }
            fEl.find(".f-val").text(fMatch[4].trim());
            fEl.find(".f-bar").css("width", fMatch[4].trim() + "%");
            fEl.find(".f-trend").text(fMatch[5].trim());
        }
    }

    // Target stats
    const targetNameMatch = text.match(/имя:\s*([^\n]+)/);
    if (targetNameMatch) $(".fawn-target-profile .name").text(targetNameMatch[1].trim());

    const targetDaysMatch = text.match(/дни:\s*([^\n]+)/);
    if (targetDaysMatch) $(".fawn-target-profile .days").text(`дни: ${targetDaysMatch[1].trim()}`);

    const targetStatusMatch = text.match(/статус:\s*([^\n]+)/);
    if (targetStatusMatch) $(".fawn-target-profile .role").text(targetStatusMatch[1].trim());

    const targetAvatarMatch = text.match(/аватар:\s*([^\n]+)/);
    if (targetAvatarMatch) $(".fawn-target-profile .avatar").text(targetAvatarMatch[1].trim());


    // прогресс: 5%
    const progressMatch = text.match(/прогресс:\s*(\d+%)/);
    if (progressMatch) {
        $(".matrix-stats-row .stat-pill:nth-child(1) b").text(progressMatch[1]);
    }

    // тренд: стабильный
    const trendMatch = text.match(/тренд:\s*([^\n]+)/);
    if (trendMatch) {
        $(".matrix-stats-row .stat-pill:nth-child(2) b").text(trendMatch[1].trim());
    }

    // slowburn: 1%
    const slowburnMatch = text.match(/slowburn:\s*(\d+%)/);
    if (slowburnMatch) {
        $(".matrix-stats-row .stat-pill:nth-child(3) b").text(slowburnMatch[1]);
    }

    // мысль: ... (Matrix thought)
    const matrixThoughtMatch = text.match(/мысль:\s*([^\n]+)/);
    if (matrixThoughtMatch) {
        $("#fawn-matrix .matrix-thought .text").text(matrixThoughtMatch[1].trim());
    }

    // Mission M1
    const m1Match = text.match(/M1:\s*([^|]+)\|([^\n]+)/);
    if (m1Match) {
        const mEl = $(".missions-list .mission-item").first();
        mEl.find(".m-icon").text(m1Match[1].trim());
        mEl.find(".m-name").text(m1Match[2].trim());
    }

    // Stats S1, S2
    const s1Match = text.match(/S1:\s*([^|]+)\|([^|]+)\|([^\n]+)/);
    if (s1Match) {
        const sEl = $(".locked-stats .locked-item:nth-child(1)");
        sEl.find(".l-name").text(s1Match[1].trim());
        sEl.find(".l-val").text(s1Match[2].trim());
        sEl.find(".l-status").text(s1Match[3].trim());
    }
    const s2Match = text.match(/S2:\s*([^|]+)\|([^|]+)\|([^\n]+)/);
    if (s2Match) {
        const sEl = $(".locked-stats .locked-item:nth-child(2)");
        sEl.find(".l-name").text(s2Match[1].trim());
        sEl.find(".l-val").text(s2Match[2].trim());
        sEl.find(".l-status").text(s2Match[3].trim());
    }


    // 3. Whisper parsing
    // Статус: ...
    const whisperStatusMatch = text.match(/Статус:\s*([^\n]+)/);
    if (whisperStatusMatch) {
        $("#fawn-whisper .whisper-block:nth-child(1) .w-text").text(whisperStatusMatch[1].trim());
    }

    // Настроение: ...
    const moodMatch = text.match(/Настроение:\s*([^\n]+)/);
    if (moodMatch) {
        $("#fawn-whisper .whisper-block:nth-child(2) .w-text").text(moodMatch[1].trim());
    }

    // Мысли: ...
    const whisperThoughtsMatch = text.match(/Мысли:\s*([^\n]+)/);
    if (whisperThoughtsMatch) {
        $("#fawn-whisper .whisper-block:nth-child(3) .w-text").text(whisperThoughtsMatch[1].trim());
    }

    // Совет: ...
    const adviceMatch = text.match(/Совет:\s*([^\n]+)/);
    if (adviceMatch) {
        $("#fawn-whisper .whisper-block:nth-child(4) .w-text").text(adviceMatch[1].trim());
    }

    console.log("Fawn Tracker: Updated UI from text content.");
}

async function init() {
    console.log("Fawn Tracker: Initializing...");

    // Wait for jQuery if it's not ready yet (though ST usually has it)
    if (typeof jQuery === 'undefined') {
        console.error("Fawn Tracker: jQuery not found!");
        return;
    }

    // Load HTML content
    const htmlContent = await loadHtml();
    if (!htmlContent) {
        console.error("Fawn Tracker: Could not load HTML content.");
        return;
    }

    // Create a container for the drawer if it doesn't exist
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

    // Add toggle button
    // Try to append to the specific extensions block in ST's UI if it exists
    const extensionMenu = $("#rm_extensions_block");
    const toggleButton = $(`
        <div id="fawn-tracker-toggle" class="menu_button" title="Fawn Tracker">
            <i class="fa-solid fa-leaf"></i>
            <span>Fawn Tracker</span>
        </div>
    `);

    if (extensionMenu.length) {
        extensionMenu.append(toggleButton);
    } else {
        // Fallback: floating button
        toggleButton.find('span').hide(); // Hide text for floating button
        toggleButton.css({
            "position": "fixed",
            "top": "10px",
            "right": "80px",
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
    // Use 'off' first to prevent duplicate listeners if re-initialized
    $(document).off('click', '#fawn-tracker-toggle').on('click', '#fawn-tracker-toggle', toggleDrawer);
    $(document).off('click', '#fawn-close').on('click', '#fawn-close', toggleDrawer);

    // Silly Tavern Event Listener for new messages
    // We try to hook into the event system if available
    if (typeof eventSource !== 'undefined' && typeof event_types !== 'undefined') {
        eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
            console.log("Fawn Tracker: Message received, parsing...");
            if (data && data.mes) {
                updateTrackerFromText(data.mes);
            }
        });

        // Also try to update from the last message on load
        try {
            const context = SillyTavern.getContext();
            if (context && context.chat && context.chat.length > 0) {
                const lastMessage = context.chat[context.chat.length - 1];
                if (lastMessage && lastMessage.mes) {
                    updateTrackerFromText(lastMessage.mes);
                }
            }
        } catch (e) {
            console.log("Fawn Tracker: Context not ready yet");
        }

        console.log("Fawn Tracker: Hooked into MESSAGE_RECEIVED");
    } else {
        console.warn("Fawn Tracker: eventSource not found. Automatic updates disabled.");
    }

    console.log("Fawn Tracker: Ready.");
}

// Ensure we run after everything is loaded
$(document).ready(async () => {
    await init();
});
