var article = JSON.parse(sessionStorage.getItem("selectedArticle"));

document.getElementById("detailsImage").src = article.fields.thumbnail ? article.fields.thumbnail : "img/noImage.png";
document.getElementById("detailsHeadline").innerHTML = article.webTitle;

article.fields.byline ? 
    document.getElementById("detailsAuthor").innerHTML = article.fields.byline : 
    document.getElementById("detailsAuthor").style.display = "none";

document.getElementById("detailsDate").innerHTML = 
    new Date(article.webPublicationDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    .replace(",", "");

document.getElementById("detailsContent").innerHTML = article.fields.body;

const setCategory = (newCategory) => {
    sessionStorage.setItem("activeCategory", newCategory);
}