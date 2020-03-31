var globalData;
var filteredData;
var filtered = false;



function generateFullExport(data) {

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

  document.getElementById("exportSpan").style.display = "block";
}




function fnExcelReport()
{

    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange;
    var j=0;

    tab = generateFullExport(globalData);

    //tab = document.getElementById('generatedTable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++)
    {
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text+"</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove to keep links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi,""); // remove to keep images in the table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        reportWindow.document.open("txt/html","replace");
        reportWindow.document.write(tab_text);
        reportWindow.document.close();
        reportWindow.focus();
        sa=reportWindow.document.execCommand("SaveAs",true,"COVID-VA-Export.xlsx");
    }
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
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


function initExportTable()
{
  var exportTable = document.createElement("exportTable");
  exportTable.classList.add('table');
  exportTable.classList.add('table-striped');
  //table.classList.add('table-dark');
  exportTable.classList.add('table-bordered');
  exportTable.classList.add('table-hover');
  exportTable.classList.add('table-responsive');
  exportTable.setAttribute("id", "generatedTable");

  return exportTable;
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
exportTable = initExportTable();

d3.json('/api/data/municipality-decision-report').then(function(data){
  globalData = data;
  //generateTable(data);
});
