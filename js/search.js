var search = document.getElementById("search");
var firstLoad = true;

const findArticle = () => {
    var cardContainer = document.getElementById("cardContainer");
    var searchWord = search.value;
    articles = [].slice.call(cardContainer.childNodes);

    var searchResults = articles.filter(article => {
        var headlines = [...article.getElementsByTagName("h2")];
        var headline = headlines[0].dataset.fullHeadline;
        if(headline.toLowerCase().includes(searchWord.toLowerCase()) || 
            headline.toLowerCase().includes(changeLayout(searchWord.toLowerCase())) ||
            stringInAlphabeticalOrder(headline.toLowerCase()).includes(wordInAlphabeticalOrder(searchWord.toLowerCase()))) {
            return article;
        }
    });

    if(!searchResults.length) {
        alert("No exact matches found");
        return;
    }
    for (article of articles) {
        if(!searchResults.includes(article)) {
            cardContainer.removeChild(article);
        }
    }
}

search.onkeydown = (e) => {
    if(e.key === "Enter") {
        findArticle();
    }
    else if(e.key === "Escape") {
        e.preventDefault();
        clearButton.classList.add("hide");
        document.getElementById("cardContainer").innerHTML = sessionStorage.getItem("initialState");
    }
    else if(e.key === "Backspace" && search.value.length == 1) {
        document.getElementById("cardContainer").innerHTML = sessionStorage.getItem("initialState");
        clearButton.classList.add("hide");
    } 
}

var clearButton = document.getElementById("clearButton");
clearButton.onclick = () => {
    search.value="";
    clearButton.classList.add("hide");
    document.getElementById("cardContainer").innerHTML = sessionStorage.getItem("initialState");
}

search.oninput = () => {
    if(search.value!="") {
        clearButton.classList.remove("hide");
    }
}

document.getElementById("searchButton").onclick=findArticle;

const changeLayout = (text) => {
    var ru = [
        "й","ц","у","к","е","н","г","ш","щ","з","х","ъ",
        "ф","ы","в","а","п","р","о","л","д","ж","э",
        "я","ч","с","м","и","т","ь","б","ю"
    ];
    var en = [
        "q","w","e","r","t","y","u","i","o","p","\\[","\\]",
        "a","s","d","f","g","h","j","k","l",";","'",
        "z","x","c","v","b","n","m",",","\\."
    ];

    if(ru.some(letter => text.includes(letter))){
        for (var i = 0; i < ru.length; i++) {
            var reg = new RegExp(ru[i], 'mig');
            text = text.replace(reg, function (a) {
                return a == a.toLowerCase() ? en[i] : en[i].toUpperCase();
            });
        }
    }
    else if(en.some(letter => text.includes(letter))){
        for (var i = 0; i < en.length; i++) {
            var reg = new RegExp(en[i], 'mig');
            text = text.replace(reg, function (a) {
                return a == a.toLowerCase() ? ru[i] : ru[i].toUpperCase();
            });
        }
    }
    return text;
}

const wordInAlphabeticalOrder = (word) => {
    word = word.split("").sort().join("");
    return word;
}

const stringInAlphabeticalOrder = (string) => {
    var newString = "";
    string.split(" ").forEach(word => {
        newString+=wordInAlphabeticalOrder(word) + " ";
    });
    
    return newString;
}