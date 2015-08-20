globalRepos = [];
sizesArray = [];
var baseURL = "http://api.github.com/users/";
var rawURL = "https://raw.githubusercontent.com/";

function getRepos(username, callback){
    var reqURL = baseURL+username+"/repos?sort=pushed";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", reqURL, true);
    xhr.onreadystatechange = function () {
        if (4 !== xhr.readyState || 200 !== xhr.status) {
            return;
        }
        callback(JSON.parse(xhr.responseText));
    };
    xhr.send();
}

function getRawURL(repo, file){
    return rawURL+repo.full_name+"/master/"+file;
}

function getReadme(repo, callback){
    var reqURL = getRawURL(repo, "README.md");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", reqURL, true);
    xhr.onreadystatechange = function () {
        if (4 !== xhr.readyState || 200 !== xhr.status) {
            return;
        }
        callback(xhr.responseText);
    };
    xhr.send();
}

function createSizesArray(count){
    for(var i = 0; i < count; i++){
        var rand = Math.random();
        var size = 6;
        if(rand < .33){
            size = 4;
        } else if(rand < .66){
            size = 5;
        }
        sizesArray.push(size);
    }
}

