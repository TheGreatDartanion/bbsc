var globalData;
var filteredData;
var filtered = false;

function generateTable(data) {

  var col = [];
  for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
          if (col.indexOf(key) === -1) {
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

  document.getElementById("service_list").value = '(All)';

  opt = document.getElementById("municipality_list").value;

  //console.log(opt);

  function filterData(globalData) {
    return globalData["Locality Name"] == opt;
  }

  filteredData = globalData.filter(filterData);

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

  filtered = true;

}


function filterDataFunctionService() {

  document.getElementById("municipality_list").value = '(All)';

  opt = document.getElementById("service_list").value;

  console.log(opt);

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
  table.classList.add('table-bordered');
  table.classList.add('table-hover');
  table.classList.add('table-responsive');
  table.setAttribute("id", "generatedTable");

  return table;
}

d3.json('muncipalities.json').then(function(data){
  var select = document.getElementById("municipality_list");
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

d3.json('service_list.json').then(function(data){
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

table = initTable();

d3.json('municipality-decision-report.json').then(function(data){
  globalData = data;
  generateTable(data);
});
