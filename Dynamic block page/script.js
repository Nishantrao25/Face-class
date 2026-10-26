const postsContainer = document.getElementById("postsContainer");
const statusMessage = document.getElementById("status-message");
const searchInput = document.getElementById("searchInput");
const reloadButton = document.getElementById("reloadButton");

let allPosts = [];

function resetStatus() {
    statusMessage.classList.remove("error");
    statusMessage.textContent = "Loading posts...";
}

async function loadPosts() {
    if (!statusMessage || !postsContainer || !reloadButton) {
        throw new Error("Page elements are missing.");
    }

    resetStatus();
    reloadButton.disabled = true;

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        allPosts = await response.json();
        displayPosts(allPosts);
        statusMessage.textContent = `Loaded ${allPosts.length} posts successfully.`;
    } catch (error) {
        postsContainer.innerHTML = "";
        statusMessage.textContent = "Error loading posts. Please try again.";
        statusMessage.classList.add("error");
    } finally {
        reloadButton.disabled = false;
    }
}

function displayPosts(posts) {
    postsContainer.innerHTML = "";

    if (posts.length === 0) {
        statusMessage.textContent = "No posts found.";
        return;
    }

    posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "post-card";

        const number = document.createElement("div");
        number.className = "post-number";
        number.textContent = `Post #${post.id}`;

        const title = document.createElement("h2");
        title.textContent = post.title;

        const body = document.createElement("p");
        body.textContent = post.body;

        card.append(number, title, body);
        postsContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase().trim();

    const filteredPosts = allPosts.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    );

    displayPosts(filteredPosts);

    if (query === "") {
        statusMessage.textContent = `Loaded ${allPosts.length} posts successfully.`;
        return;
    }

    if (filteredPosts.length > 0) {
        statusMessage.textContent = `Showing ${filteredPosts.length} posts.`;
    } else {
        statusMessage.textContent = "No posts found.";
    }
});

reloadButton.addEventListener("click", loadPosts);
loadPosts();