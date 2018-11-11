const authURL = "http://localhost:8080/auths";
const targetURL = "http://localhost:8080/targets";
const nextTargetsURL = "http://localhost:8080/nexttargets";



$(document).ready(function() {

  const removeRowStop = (pair) => {
    $(".records table tr").each(function(index) {
      if($(this).children("td").eq(0).text() == pair){
        $(this).remove();
     }
    })
  };

  const getAPI = (data, url, removeRowStop) => {
    $.ajax({
      type: "GET",
      url: url,
      data: data
    })
      .done(function(msg) {
        if(msg.includes("Stop Acquired")){
          alert(msg);
          let pairStop = msg.split("Acquired ");
          pairStop = pairStop[1];
          removeRowStop(pairStop);
      }else{
          alert(msg)
      };
      })
      .fail(function(msg) {
        alert("Something went wrong." + msg);
      });
  };
  
 
  $('#closeall').click(function(){
    //still to done
  })

  //Auth section
  $(".auth").click(function() {
    let data = {
      apikey: $("input[name=apikey]").val(),
      secretkey: $("input[name=secretkey]").val()
    };
    getAPI(data, authURL);
  });

  $(".targetSubmit").click(function() {
    let data = {
      apikey: $("input[name=apikey]").val(),
      secretkey: $("input[name=secretkey]").val(),
      pair: $("input[name=pair]").val(),
      amount: $("input[name=amount]").val(),
      stop: $("input[name=stop]").val(),
      t1: $("input[name=t1]").val(),
      p1: $("input[name=p1]").val(),
      t2: $("input[name=t2]").val(),
      p2: $("input[name=p2]").val(),
      t3: $("input[name=t3]").val(),
      p3: $("input[name=p3]").val(),
      t4: $("input[name=t4]").val(),
      p4: $("input[name=p4]").val()
    };

    $(".records table tr")
      .last()
      .html(
        `<td>${data.pair}</td>
           <td>${data.amount}</td>
           <td>${data.stop}
             <i></i>
           </td>
           <td>${data.t1}
             <i></i>
           </td>
           <td>${data.p1}</td>

           <td>${data.t2}
             <i></i>
           </td>
           <td>${data.p2}</td>

           <td>${data.t3}
             <i></i>
           </td>
           <td>${data.p3}</td>

           <td>${data.t4}
             <i></i>
           </td>
           <td>${data.p4}</td>
           `
      );

      getAPI(data, targetURL);

    $(".records table").append("<tr></tr>");

    // start interval to check the targets
    let refreshInterval = setInterval(function() {
      $(".records table tr").each(function(index) {
        if (
          $(this)
            .children("td")
            .eq(0)
            .text() != ""
        ) {
          let data = {
            apikey: $("input[name=apikey]").val(),
            secretkey: $("input[name=secretkey]").val(),
            pair: $(this)
              .children("td")
              .eq(0)
              .text(),
            amount: $(this)
              .children("td")
              .eq(1)
              .text(),
            stop: $(this)
              .children("td")
              .eq(2)
              .text(),
            t1: $(this)
              .children("td")
              .eq(3)
              .text(),
            p1: $(this)
              .children("td")
              .eq(4)
              .text(),
            t2: $(this)
              .children("td")
              .eq(5)
              .text(),
            p2: $(this)
              .children("td")
              .eq(6)
              .text(),
            t3: $(this)
              .children("td")
              .eq(7)
              .text(),
            p3: $(this)
              .children("td")
              .eq(8)
              .text(),
            t4: $(this)
              .children("td")
              .eq(9)
              .text(),
            p4: $(this)
              .children("td")
              .eq(10)
              .text()
          };

          getAPI(data, nextTargetsURL,removeRowStop); 
          
        }
      });
    }, 10000);
  });
});
