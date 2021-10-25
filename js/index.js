var category = sessionStorage.getItem("activeCategory") ? sessionStorage.getItem("activeCategory") : "trending";

const setCategory = (newCategory) => {
    category = newCategory;
    sessionStorage.setItem("activeCategory", newCategory);
    fetchNews();
}

var viewedHistory = new Array();
if(localStorage.getItem("history")) {
    viewedHistory = JSON.parse(localStorage.getItem("history"));
}

const insertFeaturedCard = (article) => {
    const saveSelectedAndViewed = () => {
        sessionStorage.setItem("selectedArticle", JSON.stringify(article));
        viewedHistory.push({ id: article.id, date: Date.now() });
        localStorage.setItem("history", JSON.stringify(viewedHistory));
    }

    var container = document.getElementById("cardContainer");
    var card = document.createElement("div");
    card.className = "card mainCard";
    container.appendChild(card);

    var content = document.createElement("div");
    content.className = "content";
    card.appendChild(content);

    var h2 = document.createElement("h2");
    h2.innerHTML = article.webTitle.length <= 60 ? article.webTitle : article.webTitle.substring(0,60) + "...";
    h2.dataset.fullHeadline = article.webTitle;
    h2.dataset.href = "details.html";
    h2.onclick = () => {
        saveSelectedAndViewed();
        window.location.href = "details.html";
    };
    content.appendChild(h2);

    var p = document.createElement("p");
    p.innerHTML = article.fields.bodyText.substring(0,150) + "...";
    content.appendChild(p);

    var cardActions = document.createElement("div");
    cardActions.className = "cardActions";
    content.appendChild(cardActions);

    var publishedDate = document.createElement("div");
    publishedDate.className = "date";
    var articleAge = Math.floor((Date.now() - new Date(article.webPublicationDate)) / (1000 * 3600 * 24));
    if(articleAge == 0) publishedDate.innerHTML = "today";
    else if (articleAge == 1) publishedDate.innerHTML = articleAge + " day ago"
    else publishedDate.innerHTML = articleAge + " days ago"
    cardActions.appendChild(publishedDate);

    var readMoreButton = document.createElement("a");
    readMoreButton.className = "readMoreButton";
    readMoreButton.innerHTML = "Read more";
    readMoreButton.href = "details.html";
    readMoreButton.onclick = saveSelectedAndViewed;
    cardActions.appendChild(readMoreButton);

    for (var item of viewedHistory) {
        if(item.id == article.id) {
            var viewed = document.createElement("div");
            viewed.className = "viewed";
            viewed.title = "Viewed on " + 
                new Date(item.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + 
                " at " + 
                new Date(item.date).toLocaleTimeString("en-US", { hour12: false });
                readMoreButton.insertBefore(viewed, readMoreButton.firstChild);
            break;
        }
    }

    var image = document.createElement("img");
    image.src = article.fields.thumbnail ? article.fields.thumbnail : "img/noImage.png";
    image.alt = "no image avaliable";
    image.onclick = () => {
        saveSelectedAndViewed();
        window.location.href = "details.html";
    };
    card.appendChild(image);
}

const insertRegularCard = (article) => {
    const saveSelectedAndViewed = () => {
        sessionStorage.setItem("selectedArticle", JSON.stringify(article));
        viewedHistory.push({ id: article.id, date: Date.now() });
        localStorage.setItem("history", JSON.stringify(viewedHistory));
    }

    var container = document.getElementById("cardContainer");
    var card = document.createElement("div");
    card.className = "card regularCard";
    container.appendChild(card);

    var image = document.createElement("img");
    image.src = article.fields.thumbnail ? article.fields.thumbnail : "img/noImage.png";
    image.alt = "no image avaliable";
    image.onclick = () => {
        saveSelectedAndViewed();
        window.location.href = "details.html";
    };
    card.appendChild(image);

    var content = document.createElement("div");
    content.className = "content";
    card.appendChild(content);

    var h2 = document.createElement("h2");
    h2.innerHTML = article.webTitle.length <= 40 ? article.webTitle : article.webTitle.substring(0,40) + "...";
    h2.dataset.fullHeadline = article.webTitle;
    h2.onclick = () => {
        saveSelectedAndViewed();
        window.location.href = "details.html";
    };
    content.appendChild(h2);

    var p = document.createElement("p");
    p.innerHTML = article.fields.bodyText.substring(0,100) + "...";
    content.appendChild(p);

    var cardActions = document.createElement("div");
    cardActions.className = "cardActions";
    content.appendChild(cardActions);

    var publishedDate = document.createElement("div");
    publishedDate.className = "date";
    var articleAge = Math.floor((Date.now() - new Date(article.webPublicationDate)) / (1000 * 3600 * 24));
    if(articleAge == 0) publishedDate.innerHTML = "today";
    else if (articleAge == 1) publishedDate.innerHTML = articleAge + " day ago"
    else publishedDate.innerHTML = articleAge + " days ago"
    cardActions.appendChild(publishedDate);

    var readMoreButton = document.createElement("a");
    readMoreButton.className = "readMoreButton";
    readMoreButton.innerHTML = "Read more";
    readMoreButton.href = "details.html";
    readMoreButton.onclick = saveSelectedAndViewed;
    cardActions.appendChild(readMoreButton);
    
    for (var item of viewedHistory) {
        if(item.id == article.id) {
            var viewed = document.createElement("div");
            viewed.className = "viewed";
            viewed.title = "Viewed on " + 
                new Date(item.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + 
                " at " + 
                new Date(item.date).toLocaleTimeString("en-US", { hour12: false });
            readMoreButton.insertBefore(viewed, readMoreButton.firstChild);
            break;
        }
    }
}

const loaded = () => {
    document.getElementById("loader").style.display="none";
    document.getElementById("footer").style.position="relative";
}

const loading = () => {
    document.getElementById("loader").style.display="block";
    document.getElementById("footer").style.position="absolute"; 
}

async function fetchNews() {
    var apiKey = "0cc1c5bc-7fe4-47bc-80cc-f17c13be193c";
    var url = "https://content.guardianapis.com/search?q=" + category + 
    "&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=" + apiKey;
    document.getElementById("cardContainer").innerHTML = "";
    
    loading();

    const response = await fetch(url);
    const data = await response.json();
    // sessionStorage.setItem("data", JSON.stringify(data));
    var results = data.response.results;

    var latestArticle = results[0];

    for (var article of results) {
        if (article.webPublicationDate > latestArticle.webPublicationDate) {
            latestArticle = article;
        }
    }

    results.splice(results.indexOf(latestArticle), 1);
    results.unshift(latestArticle);

    loaded();
    
    insertFeaturedCard(
        data.response.results[0]
        )
    for(var i = 1; i < data.response.results.length; i++) {
        insertRegularCard(
            data.response.results[i]
        );
    }

    sessionStorage.setItem("initialState", document.getElementById("cardContainer").innerHTML);
}

fetchNews();

window.onscroll = function() {
    var scrollTopButton = document.getElementById("scrollToTopButton");
    if(document.documentElement.scrollTop >= 300) {
        scrollTopButton.style.visibility="visible";
        scrollTopButton.style.right="60px";
    }
    else {
        scrollTopButton.style.visibility="hidden";
        scrollTopButton.style.right="-150px";
    }
};

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
scrollToTop();