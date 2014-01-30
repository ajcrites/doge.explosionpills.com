wow = new Meteor.Collection("wow");

if (Meteor.isClient) {
    var much_colors = ["red", "#00ff00", "aqua", "yellow", "fuchsia"];

    Template["such-doge"].doge = function () {
        return wow.find({}, {fields: {_id: 0}});
    };

    Template["such-doge"].much_doge = function () {
        setTimeout(function () {
            $("<div>", this).appendTo("#such-doge");
        }.bind(this), 10);
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
                css: css
            })
                .appendTo("#such-doge")
                .trigger("focus")
                .on("blur", function () {
                    $(this).replaceWith(function () {
                        var div = {
                            css: css,
                            text: this.value
                        };

                        wow.insert(div);
                        return $("<div>", div);
                    });
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
