const authURL = "http://localhost:3000/auths";
const targetURL = "http://localhost:3000/targets";
const nextTargetsURL = "http://localhost:3000/nexttargets";

$(document).ready(function () {
   
    //Auth section
    $('.auth').click(function () {
        let data = {
            apikey: $('input[name=apikey]').val(),
            secretkey: $('input[name=secretkey]').val(),

        };
        $.ajax({
            type: "POST",
            url: authURL,
            data: data,
        }).done(function (msg) {
            alert(msg);
        }).fail(function () {
            alert("Something went wrong.");
        });

    });



    $('.targetSubmit').click(function () {
        let data = {
            pair: $('input[name=pair]').val(),
            amount: $('input[name=amount]').val(),
            stop: $('input[name=stop]').val(),
            t1: $('input[name=t1]').val(),
            p1: $('input[name=p1]').val(),
            t2: $('input[name=t2]').val(),
            p2: $('input[name=p2]').val(),
            t3: $('input[name=t3]').val(),
            p3: $('input[name=p3]').val(),
            t4: $('input[name=t4]').val(),
            p4: $('input[name=p4]').val(),

        };
        $.ajax({
            type: "POST",
            url: targetURL,
            data: data,
        }).done(function (msg) {
            alert(msg);

            // start interval to check the targets 
            let refreshInterval = setInterval(function () {
                let data = {
                    pair: $('input[name=pair]').val(),
                    amount: $('input[name=amount]').val(),
                    stop: $('input[name=stop]').val(),
                    t1: $('input[name=t1]').val(),
                    p1: $('input[name=p1]').val(),
                    t2: $('input[name=t2]').val(),
                    p2: $('input[name=p2]').val(),
                    t3: $('input[name=t3]').val(),
                    p3: $('input[name=p3]').val(),
                    t4: $('input[name=t4]').val(),
                    p4: $('input[name=p4]').val(),

                };
                $.ajax({
                    type: "POST",
                    url: nextTargetsURL,
                    data: data,
                }).done(function (msg) {
                    if (msg == "Stop Acquired") {
                        clearInterval(refreshInterval);
                    };
                }).fail(function () {
                    alert("Something went wrong.");
                    clearInterval(refreshInterval);
                });

            }, 3000);

        }).fail(function (msg) {
            alert(msg);
        });

    });





});