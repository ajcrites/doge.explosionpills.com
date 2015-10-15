wow = new Mongo.Collection("wow");

if (Meteor.isClient) {
    Meteor.startup(() => {
        React.render(<Doge />, document.getElementById("wow"));
    });
}


if (Meteor.isServer) {
    wow.allow({
        insert: function (_, doc) {
            if (!doc.hasOwnProperty("text")) {
                return false;
            }
            return doc.hasOwnProperty("text")
                && doc.text.length <= 50
                && (
                    /^wow$/.test(doc.text)
                    || /^(so|(s|m)uch|too|very|many) (\w+ )*(\w+)$/.test(doc.text)
                );
        },
    });
}

Doge = React.createClass({
    mixins: [ReactMeteorData],
    getInitialState() {
        return {
            showDogeMaker: false,
        }
    },
    getMeteorData() {
        return {
            wow: wow.find({}, {sort: {dogetime: -1}, limit: 30}).fetch(),
        };
    },
    muchDoge() {
        return this.data.wow.map(wow => {
            return <Wow key={wow._id} wow={wow} />;
        });
    },
    showInput(event) {
        this.setState({
            showDogeMaker: true,
            dogeState: {
                left: event.pageX - 5,
                top: event.pageY - 5,
                color: _.sample(["red", "#00ff00", "aqua", "yellow", "fuchsia"])
            },
        });
    },
    hideInput() {
        this.setState({
            showDogeMaker: false,
        });
    },
    render() {
        let dogeMaker;
        if (this.state.showDogeMaker) {
            dogeMaker = (
                <DogeMaker style={this.state.dogeState}
                    doneFn={this.hideInput} />
            );
        }
        return (
            <div id="such-doge" onClick={this.showInput}>
                {dogeMaker}
                {this.muchDoge()}
            </div>
        );
    },
});

DogeMaker = React.createClass({
    componentDidMount() {
        React.findDOMNode(this.refs.wow).focus();
    },
    handleBlur() {
        let text = React.findDOMNode(this.refs.wow).value.trim();
        wow.insert({text, style: this.props.style, dogetime: new Date}, function (err) {
            if (err) {
                alert("wow. such error. too keywords");
            }
        });
        this.props.doneFn();
    },
    handleKeypress(event) {
        if ("Enter" === event.key) {
            React.findDOMNode(this.refs.wow).blur();
        }
    },
    render() {
        return <input className="too-text" ref="wow" style={this.props.style}
            onBlur={this.handleBlur} onKeyPress={this.handleKeypress} />
    },
});

Wow = React.createClass({
    propTypes: {
        wow: React.PropTypes.object.isRequired
    },
    render() {
        return <div className="too-text" style={this.props.wow.style}>{this.props.wow.text}</div>
    },
});
