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
                document.querySelector(".gitfolio"));
        });
    }
});

var CardGrid = React.createClass({
    render: function(){
        var getCard = function(repo, index){
            return <RepoCard repo={repo} size={sizesArray[index]} key={index}/>;
        }
        return (
            <div className="demo-blog mdl-layout mdl-js-layout has-drawer is-upgraded">
              <main className="mdl-layout__content">
                <div className="demo-blog__posts mdl-grid">
                    {this.props.repos.map(getCard)}
                </div>
              </main>
              <div className="mdl-layout__obfuscator"></div>
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
        React.render( <CardGrid repos={globalRepos} scrollToRepo={this.props.repo}/>, document.querySelector(".gitfolio"));
    },
    componentDidMount: function() {
        this.getDOMNode().scrollIntoView();
    }
});

    
var AtomAnimation = React.createClass({
    render: function(){
        return (
            <div className="atom">
                <div className="atom-ring">
                    <img src="/img/spin.png"/>
                </div>
                <div className="atom-ring">
                    <img src="/img/spin.png"/>
                </div>
            </div>
        );
    }
});
var Hello = React.createClass({
    render: function(){
        return (
            <div className="flexContainer">
                    <AtomAnimation />
                    <p> </p>
                    <p> <a href="#" onClick={this.showGitFolio}> Check out my projects</a>  </p>
                    <div className="gitfolio"></div>
            </div>
        );
    },
    showGitFolio: function(){
        getRepos("atommarvel", function(repos){
            globalRepos = repos;
            createSizesArray(repos.length);
            React.render( <CardGrid repos={repos}/>, document.querySelector(".gitfolio"));
        });
    }
});



React.render( <Hello/>, document.querySelector(".page-content"));
