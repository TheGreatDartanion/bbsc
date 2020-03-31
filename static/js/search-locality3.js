var globalData;
var exportTable;
var filteredData;
var filtered = false;

function generateTable(data) {


  locality_type = data[0][`Locality Type`];
  locality_name = data[0][`Locality Name`];
  population = data[0][`Population`];
  source = data[0][`Source`];

  document.getElementById('locality_name').innerHTML = locality_name;
  document.getElementById('locality_type_and_population').innerHTML = `${locality_type} with an estimated population of ${population}` ;
  document.getElementById('source').innerHTML = `Source: ${source}`;

  console.log(locality_type);

  /*
  service_category = data.map(function(d){
    console.log(d[`Service Category`]);
  });
  service = data.map(function(d){
    console.log(d[`Service`]);
  });
  locality_decision = data.map(function(d){
    console.log(d[`Locality Decision`]);
  });
  data.forEach(function(d){
  });
  */

  var col = [];
  for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
          if (col.indexOf(key) === -1) {
              if(key == 'Service Category' || key == 'Service' || key == 'Locality Decision')
              col.push(key);
          }
      }
  }

  var tr = table.insertRow(-1);

  // Create table headers
  for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");

      th.innerHTML = col[i];
      tr.appendChild(th);
  }

  // Add table rows
    for (var i = 0; i < data.length; i++) {
      tr = table.insertRow(-1);

      for (var j = 0; j < col.length; j++) {

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = data[i][col[j]];
      }
  }

  // Add the data to the table container
  var divContainer = document.getElementById("dataTable");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}


function filterDataFunction() {

  //document.getElementById("service_list").value = '(All)';

  opt = document.getElementById("municipality_list").value;

  //console.log(opt);

  function filterData(globalData) {
    return globalData["Locality Name"] == opt;
  }

  filteredData = globalData.filter(filterData);

  table = document.getElementById("generatedTable");
  if(table != null){
    table.remove();
  }


  table = initTable();

  if(opt != '(All)')
  {
    generateTable(filteredData);
  }
  else
  {
    generateTable(globalData);
  }

  filtered = true;

  document.getElementById('select_msg').innerHTML = 'Select a locality: ';
}


function filterDataFunctionService() {

  document.getElementById("municipality_list").value = '(All)';

  opt = document.getElementById("service_list").value;

  //console.log(opt);

  function filterData(data) {
    return data["Service"] == opt;
  }

  filteredData = globalData.filter(filterData);

/*
  if(filtered)
  {
    filteredData = filteredData.filter(filterData);
    console.log(filteredData);
  }
  else
  {
    filteredData = globalData.filter(filterData);
    console.log('not filtered');
  }
*/

  document.getElementById("generatedTable").remove();
  table = initTable();


  if(opt != '(All)')
  {
    generateTable(filteredData);
  }
  else
  {
    generateTable(globalData);
  }


}


function initTable()
{
  var table = document.createElement("table");
  table.classList.add('table');
  table.classList.add('table-striped');
  //table.classList.add('table-dark');
  table.classList.add('table-bordered');
  table.classList.add('table-hover');
  table.classList.add('table-responsive');
  table.setAttribute("id", "generatedTable");

  return table;
}


d3.json('/api/data/municipalities').then(function(data){
  var select = document.getElementById("municipality_list");
  var options = data;

  // ALl Option
  /*
  var el = document.createElement("option");
  el.textContent = '(All)';
  el.value = '(All)';
  select.appendChild(el);
  */

  options.forEach(function(i){
    var opt = i;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  });

  document.getElementById("municipality_list").value='';

});

/*
d3.json('/api/data/service_list').then(function(data){
  var select = document.getElementById("service_list");
  var options = data;
  // ALl Option
  var el = document.createElement("option");
  el.textContent = '(All)';
  el.value = '(All)';
  select.appendChild(el);
  options.forEach(function(i){
    var opt = i;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  });
});
*/

table = initTable();

d3.json('/api/data/municipality-decision-report').then(function(data){
  globalData = data;
  //generateTable(data);
});


/***************
        Excel Functionality
***************/

function initExportTable()
{
  console.log("3: initExportTable");

  exportTable = document.createElement("table");

  console.log("3a");
  console.log(exportTable);

  exportTable.classList.add('table');
  exportTable.classList.add('table-striped');
  //table.classList.add('table-dark');
  exportTable.classList.add('table-bordered');
  exportTable.classList.add('table-hover');
  exportTable.classList.add('table-responsive');
  exportTable.setAttribute("id", "exportTable");

  console.log("3b");
  console.log(exportTable);

  // Add the data to the table container
  console.log("4a");
  var divExportContainer = document.getElementById("dataExportTable");
  console.log(divExportContainer);
  divExportContainer.innerHTML = "";
  divExportContainer.appendChild(exportTable);
  console.log(divExportContainer);


  return exportTable;
}



function generateFullExport(data) {

  console.log("2. generateFullExport");
  console.log("2a");

  exportTable = initExportTable();

  console.log("2b");

  exportTable = document.getElementById("exportTable");

  console.log(exportTable);

  var col = [];
  for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
          if (col.indexOf(key) === -1) {
              //if(key == 'Service Category' || key == 'Service' || key == 'Locality Decision')
              col.push(key);
          }
      }
  }

  var tr = exportTable.insertRow(-1);

  // Create table headers
  for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");

      th.innerHTML = col[i];
      tr.appendChild(th);
  }

  // Add table rows
    for (var i = 0; i < data.length; i++) {
      tr = exportTable.insertRow(-1);

      for (var j = 0; j < col.length; j++) {

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = data[i][col[j]];
      }
  }

  return exportTable;
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}


function exportTableToCSV(filename) {
    var csv = [];

    tbl = generateFullExport(globalData);
    //var tbl = document.getElementById("exportTable");
    console.log(tbl);

    var rows = tbl.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push("\"" + cols[j].innerText + "\"");

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}
