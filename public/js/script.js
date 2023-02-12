async function detailsButton(v) {
  try {
    const detailsResponse = await fetch("http://86.59.230.107:3000/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: $(v).attr("data-id"),
      }),
    });
    const responseJson = await detailsResponse.json();
    placeDetails(responseJson);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("showDetails async done");
  }
}

function placeDetails(v) {
  // Format datetime
  const startDate = new Date(v[0].kezdete);
  const startDateFormatted = new Date(startDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .substring(0, 16)
    .replace("T", " ");

  const endDate = new Date(v[0].vege);
  const endDateFormatted = new Date(endDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .substring(0, 16)
    .replace("T", " ");

  var imgFile = v[0].file_url;
  if (!imgFile) {
    imgFile = "no_img.jpg";
  }

  $("#details-div").empty().append(`
    <div class="container-fluid mx-auto">
      <hr class="w-75">
      <h3>Esemény részletei:</h3>
    </div>
    <div class="container-fluid mx-auto text-center row">
        <div class="col-12 col-sm-6 p-2">
            <div class="form-group">
                <label for="cim">Cím</label>
                <input type="text" class="form-control" id="cim" value="${v[0].cim}">
            </div>
            <div class="form-group">
                <label for="text-area">Részletek:</label>
                <textarea class="form-control" id="reszletek" rows="3">${v[0].reszletek}</textarea>
            </div>
            <div class="mx-auto row" id="date-picker">
                <div class="form-group text-center mx-auto col-sm-6 col-12">
                    <label for="date-to">Kezdete&nbsp;</label><br>
                    <input type="datetime-local" id="date-tol" value="${startDateFormatted}">
                </div>
                <div class="form-group text-center mx-auto col-sm-6 col-12">
                    <label for="date-to">Vége&nbsp;</label><br>
                    <input type="datetime-local" id="date-ig" value="${endDateFormatted}">
                </div>
            </div>
            <button class="btn mt-3 btn-outline-primary btn-lg" id="details-save" data-details="${v[0].id}">Mentés</button>
        </div>
        <div class="col-12 col-sm-6 row">
            <p class="mx-auto">Kép:</p>
            <div class="container-fluid">
              <img class="img-fluid col-12" style="height:auto;max-width: 270px;" src="img/${imgFile}" data-img="${v[0].id}" id="img-${v[0].id}">
            </div>
            <div class="container-fluid d-flex justify-content-center">
              <button type="button" class="btn  btn-outline-warning col-4 m-1 btn-sm " data-img="${v[0].id}" id="btnfile">Csere</button>
              <div class="wrapper">
                  <input type="file" id="uplodfile"/>
                  </div>
              <button type="button" class="btn btn-outline-danger col-4 m-1 btn-sm" data-img="${v[0].id}" id="btndelete">Törlés</button>
            </div>
         </div>
    </div>    
    `);
}

async function deleteButton(v) {
  try {
    const detailsResponse = await fetch("http://86.59.230.107:3000/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: $(v).attr("data-id"),
      }),
    });
    const responseJson = await detailsResponse.json();
    placeDetails(responseJson);
  } catch (error) {
    console.error(error);
  } finally {
    window.location.reload()
  }
}

$(document).delegate("#new-event", "click", async function () {
  $("#details-div").empty().append(`
    <div class="container-fluid mx-auto">
      <hr class="w-75">
      <h3>Esemény részletei:</h3>
    </div>
    <div class="container-fluid mx-auto text-center row">
        <div class="col-12 col-sm-6 p-2">
            <div class="form-group">
                <label for="cim">Cím</label>
                <input type="text" class="form-control" id="cim">
            </div>
            <div class="form-group">
                <label for="text-area">Részletek:</label>
                <textarea class="form-control" id="reszletek" rows="3"></textarea>
            </div>
            <div class="mx-auto row" id="date-picker">
                <div class="form-group text-center mx-auto col-sm-6 col-12">
                    <label for="date-to">Kezdete&nbsp;</label><br>
                    <input type="datetime-local" id="date-tol">
                </div>
                <div class="form-group text-center mx-auto col-sm-6 col-12">
                    <label for="date-to">Vége&nbsp;</label><br>
                    <input type="datetime-local" id="date-ig">
                </div>
            </div>
            <button class="btn mt-3 btn-outline-primary btn-lg" id="new-event-save">Mentés</button>
        </div>
        <div class="col-12 col-sm-6 row">
            <p class="mx-auto">Kép:</p>
            <div class="container-fluid">
              <img class="img-fluid col-12" style="height:auto;max-width: 270px;" src="img/no_img.jpg" id="img-upload">
            </div>
            <div class="container-fluid d-flex justify-content-center">
              <button type="button" class="btn  btn-outline-warning col-4 m-1 btn-sm" id="btnfile">Csere</button>
              <div class="wrapper">
                  <input type="file" id="uplodfile"/>
                  </div>
              <button type="button" class="btn btn-outline-danger col-4 m-1 btn-sm" id="btndelete">Törlés</button>
            </div>
         </div>
    </div>    
    `);

})

$(document).delegate("#new-event-save", "click", async function () {
  var cim = $('#cim').val()
  var reszletek = $('#reszletek').val()
  var kezdete = $('#date-tol').val()
  var vege = $('#date-ig').val()
  var file_url = document.getElementById("img-upload").src;
  console.log(file_url)
  file_url = file_url.slice(26);

  try {
    await saveDetails(cim,reszletek,kezdete,vege, file_url);
  } catch (error) {
    console.log(error);
  } finally {
    window.location.reload()
  }

  function saveDetails(cim,reszletek,kezdete,vege, file_url) {
    return new Promise((resolve, reject) => {
      var settings = {
        url: "http://86.59.230.107:3000/insert",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          cim: cim,
          reszletek:reszletek,
          kezdete: kezdete,
          vege: vege,
          file_url: file_url
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        resolve(response);
      });
    });
  }

});

$(document).delegate("#details-save", "click", async function () {
  var id = $("#details-save").attr("data-details")
  var cim = $('#cim').val()
  var reszletek = $('#reszletek').val()
  var kezdete = $('#date-tol').val()
  var vege = $('#date-ig').val()
  var file_url = document.getElementById("img-" + id).src;
  console.log(file_url)

  file_url = file_url.slice(26);


  try {
    await updateDetails(id,cim,reszletek,kezdete,vege, file_url);
  } catch (error) {
    console.log(error);
  } finally {
    window.location.reload()
  }


  function updateDetails(id,cim,reszletek,kezdete,vege, file_url) {
    return new Promise((resolve, reject) => {
      var settings = {
        url: "http://86.59.230.107:3000/updatedetails",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          id: id,
          cim: cim,
          reszletek:reszletek,
          kezdete: kezdete,
          vege: vege,
          file_url: file_url
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        resolve(response);
      });
    });
  }

})

$(document).delegate("#btndelete", "click", async function () {
  var id = $("#btndelete").attr("data-img");
  try {
    await deleteImgInDb("", id);
    $("#img-" + id).attr("src", "img/no_img.jpg");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Image deleted!");
  }

  function deleteImgInDb(filename, id) {
    return new Promise((resolve, reject) => {
      var settings = {
        url: "http://86.59.230.107:3000/update",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          file_url: filename,
          id: id,
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        resolve(response);
      });
    });
  }
});

// Csere button
$(document).delegate("#btnfile", "click", function () {
  var id = $("#btnfile").attr("data-img");
  $("#uplodfile").click();
  $("#uplodfile").change(async function () {
    try {
      var formData = new FormData();
      formData.append("avatar", $("#uplodfile")[0].files[0]);
      var filename = $("#uplodfile")[0].files[0].name;
      await filePosting(formData);
      if(id){
        await updateDb(filename, id);
        updateImg(filename, id);
      }else{
        $("#img-upload").attr("src", "img/" + filename);
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Image uploaded!");
    }

    function filePosting(v) {
      return new Promise((resolve) => {
        $.ajax({
          url: "http://86.59.230.107:3001/upload",
          data: formData,
          type: "POST",
          processData: false,
          contentType: false,
          success: function (response) {
            console.log(response);
            resolve(response);
          },
        });
      });
    }

    function updateDb(filename, id) {
      return new Promise((resolve, reject) => {
        var settings = {
          url: "http://86.59.230.107:3000/update",
          method: "POST",
          timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            file_url: filename,
            id: id,
          }),
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          resolve(response);
        });
      });
    }

    function updateImg(filename, id) {
      $("#img-" + id).attr("src", "img/" + filename);
    }
  });
});
