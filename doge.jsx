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
    getMeteorData() {
        return {
            wow: wow.find({}, {sort: {dogetime: -1}, limit: 30}),
        };
    },
    muchDoge() {
        return this.data.wow.map(wow => {
            return <Wow key={wow._id} wow={wow} />;
        });
    },
    render() {
        return (
            <div id="such-doge">
                {this.muchDoge()}
            </div>
        );
    },
});

Wow = React.createClass({
    propTypes: {
        wow: React.PropTypes.object.isRequired
    },
    render() {
        return <div class="too-text" style={this.props.wow.style}>{this.props.wow.text}</div>
    },
});
