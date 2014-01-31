wow = new Meteor.Collection("wow");

if (Meteor.isClient) {
    var much_colors = ["red", "#00ff00", "aqua", "yellow", "fuchsia"];

    Template["such-doge"].doge = function () {
        return wow.find({}, {sort: {dogetime: -1}, limit: 30});
    };

    Template["such-doge"].much_doge = function () {
        return $("<div>", this)[0].outerHTML;
    };

    Template["such-doge"].events({
        "click": function (evt) {
            var css = {
                "position": "absolute",
                "left": evt.pageX - 5,
                "top": evt.pageY - 5,
                "color": much_colors[Math.floor(Math.random() * much_colors.length)]
            };

            $("<input>", {
                css: css,
                maxlength: 50
            })
                .appendTo("#such-doge")
                .trigger("focus")
                .on("blur", function () {
                    if (this.value.length) {
                        var div = {
                            css: css,
                            text: this.value,
                            dogetime: new Date
                        };

                        wow.insert(div, function (err) {
                            if (err) {
                                alert("wow.  such error.  too keywords");
                            }
                        });
                    }

                    $(this).remove();
                })
                .on("keypress", function (evt) {
                    if (evt.keyCode == 13) {
                        $(this).trigger("blur");
                    }
                });
            ;
        }
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
