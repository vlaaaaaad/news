var search = document.getElementById("search");
var initialText = document.getElementById("detailsContainer").innerHTML;

const findMatches = () => {
    var text = document.getElementById("detailsContainer").innerHTML;
    match = search.value;
    var matchesCount = 0;
    if(match == "" || match == " " || match.length <= 3) {
        alert("Incorrect search. Try Again.");
        return;
    }
    text = text.replace(new RegExp(match, "gi"), replace = (match) => {
        matchesCount++;
        return '<span class="highlight">' + match + '</span>'
    });
    document.getElementById("detailsContainer").innerHTML = text;
    if(matchesCount==0) {
         alert("No exact matches found");
    }
    else {
         alert(matchesCount + " matches found")
    }
}

search.onkeydown = (e) => {
    if(e.key === "Enter") {
        findMatches();
    }
    else if(e.key === "Escape") {
        e.preventDefault();
        search.value="";
        document.getElementById("detailsContainer").innerHTML = initialText;
    }
    else if(e.key === "Backspace" && search.value.length == 1) {
        document.getElementById("detailsContainer").innerHTML = initialText;
        clearButton.classList.add("hide");
    }
}

var clearButton = document.getElementById("clearButton");
clearButton.onclick = () => {
    search.value="";
    clearButton.classList.add("hide");
    document.getElementById("detailsContainer").innerHTML = initialText;
}

search.oninput = () => {
    if(search.value!="") {
        clearButton.classList.remove("hide");
    }
    document.getElementById("detailsContainer").innerHTML = initialText;
}

document.getElementById("searchButton").onclick=findMatches;