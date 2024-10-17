// Function to get a random item from Wikipedia
async function getRandomItem(category) {
    const categories = {
        animals: "Category:Animals",
        people: "Category:People",
        objects: "Category:Objects",
        weapons: "Category:Weapons",
        movies: "Category:Films",
        tvshows: "Category:Television_series"
    };
    
    // Fetch a random page from the selected category
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=random&rnlimit=1&rnnamespace=0&generator=categorymembers&gcmtitle=${categories[category]}&gcmtype=page`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        // Get the page ID of the random article
        let pageId = Object.keys(data.query.pages)[0];
        let page = data.query.pages[pageId];

        // Check if the page is not a category and display the result
        if (pageId) {
            displayResult(page.title, pageId);
        } else {
            document.getElementById('item-title').textContent = "No item found!";
            document.getElementById('item-image').src = '';
            document.getElementById('item-rarity').textContent = '';
        }
    } catch (error) {
        console.error("Error fetching random item:", error);
    }
}

// Display the result in the HTML
function displayResult(title, pageId) {
    document.getElementById('item-title').textContent = title;

    // Fetch image for the selected Wikipedia page
    fetchImage(pageId);

    // Generate rarity based on the item name
    let rarity = getRarity(title);
    document.getElementById('item-rarity').textContent = `Rarity: ${rarity}`;
}

// Fetch image for the selected Wikipedia page
async function fetchImage(pageId) {
    const imgApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&exintro&explaintext&pageids=${pageId}`;
    
    try {
        let response = await fetch(imgApiUrl);
        let data = await response.json();
        let page = data.query.pages[pageId];

        // Display the image if it exists
        if (page.thumbnail) {
            document.getElementById('item-image').src = page.thumbnail.source;
            document.getElementById('item-image').alt = page.title;
        } else {
            document.getElementById('item-image').src = '';
            document.getElementById('item-image').alt = 'No image available';
        }
        
        // Optionally, display a short extract of the article
        document.getElementById('item-extract').textContent = page.extract || "No description available.";
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

// Generate rarity based on the item name
function getRarity(itemName) {
    const rarityLevels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    let nameLength = itemName.length;

    if (nameLength < 5) {
        return rarityLevels[0]; // Common
    } else if (nameLength < 10) {
        return rarityLevels[1]; // Uncommon
    } else if (nameLength < 15) {
        return rarityLevels[2]; // Rare
    } else if (nameLength < 20) {
        return rarityLevels[3]; // Epic
    } else {
        return rarityLevels[4]; // Legendary
    }
}
