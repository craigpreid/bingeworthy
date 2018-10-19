// from data.js

// var tableData = data;


var showsURL = 'shows/data';
var tableData = showsURL;

$(function() {
    // dom is ready, call the ajax
    $.get(showsURL, function(data) {
        // now that we have shows, just build the HTML
        htmlVar = '';
        _.forEach(data, function(item) {
            htmlVar += '<tr>';
            htmlVar += '<td>' + item.title + '</td>';
            htmlVar += '<td>' + item.type + '</td>';
            htmlVar += '<td>' + item.genre + '</td>';
            htmlVar += '<td>' + item.year + '</td>';
            htmlVar += '<td>' + item.imdbRating + '</td>';
            htmlVar += '<td> - </td>';
            htmlVar += '<td> - </td>';
            htmlVar += '</tr>';
        });

        $('#shows-table').find('tbody').html(htmlVar);
    });
});


// d3.json(tableData).then(function(data){
//     var PANEL = d3.select("#shows-table");
//     PANEL.html("");
//     Object.entries(data).forEach(function([key, value]){
//       PANEL.append('span').text(`${key}: ${value}`);
//       PANEL.append('br');
//     });
//   })



// console.log(tableData);

// var targetTtable = d3.select("#shows-table");
// var targetBbody = targetTtable.select("tbody");
// // YOUR CODE HERE!
// function handleSubmit() {
//     // Prevent the page from refreshing
//     d3.event.preventDefault();
  
//     // Select the input value from the form
//     var showTitle = d3.select("#show_title").node().value;
//     console.log(showTitle);
  
//     // clear the input value
//     targetTtable.select("tbody").text("");
  
//     // Build the table with the new data
//     filterData(showTitle);
// }
// // var filters={
// //     "datetime": d3.select("#show_title").node().value,   
// //     "state": d3.select("#state").node().value,
// //     "show_type": d3.select("#shape").node().value,
// // };

// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }
// function filterData(dd) {
//     // alert(dd);
//     var checkboxes = document.querySelectorAll('input[name=show_title]:checked');
//     titles = [];
//     // for (var i = 0; i < checkboxes.length; i++) {titles.push(encodeURIComponent(checkboxes[i].value))}
//     for (var i = 0; i < checkboxes.length; i++) {titles.push(checkboxes[i].value)}
//     // console.log(titles);

//     var checkboxes = document.querySelectorAll('input[name=show_type]:checked');
//     show_type = [];
//     for (var i = 0; i < checkboxes.length; i++) {show_type.push(checkboxes[i].value)}
//     // console.log(show_type);

//     var checkboxes = document.querySelectorAll('input[name=genre]:checked');
//     genre = [];
//     for (var i = 0; i < checkboxes.length; i++) {genre.push(checkboxes[i].value)}
//     // console.log(genre);

//     var checkboxes = document.querySelectorAll('input[name=states]:checked');
//     states = [];
//     for (var i = 0; i < checkboxes.length; i++) {states.push(checkboxes[i].value)}
//     // console.log(states);
//     if(dd==""){
//         // console.log(dates);
//         dates_2 = dates;
//     }else{
//         dates_2 = [dd]
//     }

//     targetTtable.select("tbody").text("");
//     for(i=0;i<tableData.length;i++){
//         // console.log(tableData[i].datetime);
//         // if(String(tableData[i].datetime)==String(dd) && states.includes(tableData[i].state) && genre.includes(tableData[i].city) && show_type.includes(tableData[i].shape) && titles.includes(tableData[i].title)){
//         if(dates_2.includes(tableData[i].datetime) && states.includes(tableData[i].state) && genre.includes(tableData[i].city) && show_type.includes(tableData[i].shape) && titles.includes(tableData[i].title)){
//             // console.log(tableData[i]);
//             var tbodytr = targetBbody.append("tr");
//             tbodytr.append("td").text(tableData[i].datetime);
//             tbodytr.append("td").text(tableData[i].city);
//             tbodytr.append("td").text(tableData[i].state);
//             tbodytr.append("td").text(tableData[i].country);
//             tbodytr.append("td").text(tableData[i].shape);
//             tbodytr.append("td").text(tableData[i].durationMinutes);
//             tbodytr.append("td").text(tableData[i].comments);
//         }
//     }
// }
// for(i=0;i<tableData.length;i++){
//     // console.log(tableData[i]);
//     var tbodytr = targetBbody.append("tr");
//     tbodytr.append("td").text(tableData[i].datetime);
//     tbodytr.append("td").text(tableData[i].city);
//     tbodytr.append("td").text(tableData[i].state);
//     tbodytr.append("td").text(tableData[i].country);
//     tbodytr.append("td").text(tableData[i].shape);
//     tbodytr.append("td").text(tableData[i].durationMinutes);
//     tbodytr.append("td").text(tableData[i].comments);
// }
// dates = [];
// cities= [];
// countries = [];
// states = [];
// shapes = [];
// for(i=0;i<tableData.length;i++){
//     if(!dates.includes(tableData[i].datetime)){dates.push(tableData[i].datetime);}
//     if(!cities.includes(tableData[i].city)){cities.push(tableData[i].city);}
//     if(!states.includes(tableData[i].state)){states.push(tableData[i].state);}
//     if(!countries.includes(tableData[i].country)){countries.push(tableData[i].country);}
//     if(!shapes.includes(tableData[i].shape)){shapes.push(tableData[i].shape);}
// }
// // console.log(dates);
// // console.log(cities);
// // console.log(countries);
// // console.log(states);
// // console.log(shapes);
// dates.sort();
// cities.sort();
// countries.sort();
// states.sort();
// shapes.sort();

// var targetFilters = d3.select("#filters");

// var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
// liFilter.append("label").text("Titles").attr('for',"title");
// liFilter.append("br");
// spanLi = liFilter.append("div").attr('class',"filters_div");
// for(i=0;i<titles.length;i++){
//     spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "title"+i).attr("name", "title").attr("value", titles[i]);
//     spanLi.append("label").attr('for',"title"+i).text(" " + titles[i].toUpperCase());
//     spanLi.append("br");
// }

// var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
// liFilter.append("label").text("States").attr('for',"states");
// liFilter.append("br");
// spanLi = liFilter.append("div").attr('class',"filters_div");
// for(i=0;i<states.length;i++){
//     spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "states"+i).attr("name", "states").attr("value", states[i]);
//     spanLi.append("label").attr('for',"states"+i).text(" " + states[i].toUpperCase());
//     spanLi.append("br");
// }

// var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
// liFilter.append("label").text("Genre").attr('for',"genre");
// liFilter.append("br");
// spanLi = liFilter.append("div").attr('class',"filters_div");
// for(i=0;i<genre.length;i++){
//     spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "genre"+i).attr("name", "genre").attr("value", genre[i]);
//     spanLi.append("label").attr('for',"genre"+i).text(" " + capitalizeFirstLetter(genre[i]));
//     spanLi.append("br");
// }

// var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
// liFilter.append("label").text("show_type").attr('for',"show_type").attr('onclick',"showhid('show_type_span')");
// liFilter.append("br");
// spanLi = liFilter.append("div").attr('id',"show_type_span").attr('class',"filters_div");
// for(i=0;i<show_type.length;i++){
//     spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "show_type"+i).attr("name", "show_type").attr("value", show_type[i]);
//     spanLi.append("label").attr('for',"show_type"+i).text(" " + capitalizeFirstLetter(show_type[i]));
//     spanLi.append("br");
// }

// function showhid(elem){
//     var LINE = document.getElementById(elem);
// }

// // if(obj.datetime!="" AND obj.state!="" AND obj.show_type!=""){
// //     var filterData = tableData.filter(obj => obj.datetime == filters.datetime && obj.state == filters.state && obj.shape == filters.show_type);
// // }elseif(obj.datetime!="" AND obj.state!="" AND obj.show_type==""){
// //     var filterData = tableData.filter(obj => obj.datetime == filters.datetime && obj.state == filters.state);
// // }elseif(obj.datetime!="" AND obj.state=="" AND obj.show_type!=""){
// //     var filterData = tableData.filter(obj => obj.datetime == filters.datetime && obj.shape == filters.show_type);
// // }elseif(obj.datetime!="" AND obj.state=="" AND obj.show_type==""){
// //     var filterData = tableData.filter(obj => obj.datetime == filters.datetime);
// // }elseif(obj.datetime=="" AND obj.state!="" AND obj.show_type!=""){
// //     var filterData = tableData.filter(obj => obj.state == filters.state && obj.shape == filters.show_type);
// // }elseif(obj.datetime="" AND obj.state="" AND obj.show_type=""){
// //     var Textwarning = "You need to choose a filter";
// // }
 
// d3.select("#filter-btn").on("click", handleSubmit);
// d3.selectAll("input[type=checkbox]").on("change", handleSubmit);
// // var showTitle = d3.select("#show_title").node().value;
// // console.log(showTitle);

// // // clear the input value
// // targetTtable.select("tbody").text("");

// // // Build the table with the new data
// // filterData(showTitle);
