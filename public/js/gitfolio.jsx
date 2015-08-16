globalRepos = [];
sizesArray = [];
var baseURL = "http://api.github.com/users/";
var rawURL = "https://raw.githubusercontent.com/";

function getRepos(username, callback){
    var reqURL = baseURL+username+"/repos";
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


var RepoCard = React.createClass({
    render: function(){
        var self = this;
        var getCardClasses = function(){
            var classString = "mdl-card mdl-cell mdl-cell--{size}-col";
            return classString.replace("{size}",self.props.size);
        }
        previewImg = {
            backgroundImage: "url(" + "'https://raw.githubusercontent.com/"+this.props.repo.full_name+"/master/preview.png')"
        };
        return (
            <div className={getCardClasses()}>
                <div className="mdl-card__media mdl-color-text--grey-50" data-repo-id={this.props.repo.id} style={previewImg}>
                    <div style={{background: "rgba(0, 0, 0, 0.2)", width: "100%"}}>
                        <h3 style={{paddingBottom: "24px", paddingLeft: "24px"}}> {this.props.repo.name} </h3>
                    </div>
                </div>
                <div className="mdl-color-text--grey-600 mdl-card__supporting-text">
                    {this.props.repo.description}
                </div>
                <div className="mdl-card__actions mdl-card--border">
                    <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.showReadme}>
                        View README
                    </a>
                </div>
            </div>
        );
    },
    showReadme: function(){
        var self = this;
        getReadme(this.props.repo, function(md){
            React.render((
                <div className="demo-blog__posts mdl-grid">
                    <MdViewer md={md} repo={self.props.repo}/>
                </div>),
                document.querySelector(".mdl-layout__content"));
        });
    }
});

var CardGrid = React.createClass({
    render: function(){
        var getCard = function(repo, index){
            return <RepoCard repo={repo} size={sizesArray[index]} key={index}/>;
        }
        return (
            <div className="demo-blog__posts mdl-grid">
                {this.props.repos.map(getCard)}
            </div>
        );
    },
    componentDidMount: function() {
        if(this.props.scrollToRepo){
            var cardToView = document.querySelector('[data-repo-id="'+this.props.scrollToRepo.id+'"');
            cardToView.scrollIntoView();
        }
    },

});

var MdViewer = React.createClass({
    render: function(){
        var self = this;
        function createMarkup() { return {__html: marked(self.props.md)}; };
        //TODO: absolutely positioned, pretty, close UI
        return (
            <div className="mdl-card mdl-cell mdl-cell--12-col" style={{background: "white"}}>
                <div style={{padding: "24px"}}>
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style={{float: "right"}} onClick={this.exit}> Close </button>
                    <div dangerouslySetInnerHTML={createMarkup()} />
                </div>
            </div>
        );
    },
    exit: function(){
        React.render( <CardGrid repos={globalRepos} scrollToRepo={this.props.repo}/>, document.querySelector(".mdl-layout__content"));
    },
    componentDidMount: function() {
        this.getDOMNode().scrollIntoView();
    }
});

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

getRepos("atommarvel", function(repos){
    globalRepos = repos;
    createSizesArray(repos.length);
    React.render( <CardGrid repos={repos}/>, document.querySelector(".mdl-layout__content"));
    console.log(repos);
});
