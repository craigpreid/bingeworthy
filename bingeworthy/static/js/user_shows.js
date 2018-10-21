// from data.js

// var tableData = data;


var showsURL = 'shows/data/mine';
var tableData = showsURL;

$(function() {
    // dom is ready, call the ajax
    $('.lds-css').show();
    $.get(showsURL, function(data) {
        // now that we have shows, just build the HTML
        htmlVar = '';
        _.forEach(data, function(item) {
            htmlVar += '<tr>';
            htmlVar += '<td><img style="width:50px" src="' + item.movie.poster + '"></td>;'
            htmlVar += '<td>' + item.movie.title + '</td>';
            htmlVar += '<td>' + item.movie.type + '</td>';
            htmlVar += '<td>' + item.movie.genre + '</td>';
            htmlVar += '<td>' + item.movie.year + '</td>';
            htmlVar += '<td>' + item.movie.imdb_rating + '</td>';
            htmlVar += '<td>' + (item.user.bingeworthy=='true'? 'Yes': 'No') + '</td>';
            htmlVar += '<td>' + item.user.rating + '</td>';
            htmlVar += '</tr>';
        });

        $('#shows-table').find('tbody').html(htmlVar);
        $('.lds-css').hide();
    });
});

// This populates the table same as jQuery above
// d3.json(tableData).then(function(data){
//     var PANEL = d3.select("#shows-table");
//     PANEL.html("");
//     Object.entries(data).forEach(function([key, value]){
//       PANEL.append('span').text(`${key}: ${value}`);
//       PANEL.append('br');
//     });
//   })



//console.log(tableData);
//
//var targetTtable = d3.select("#shows-table");
//var targetBbody = targetTtable.select("tbody");
//
//function handleSubmit() {
//    // Prevent the page from refreshing
//    d3.event.preventDefault();
//
//    // Select the input value from the form
//    var showTitle = d3.select("#show_title").node().value;
//    console.log(showTitle);
//
//    // clear the input value
//    targetTtable.select("tbody").text("");
//
//    // Build the table with the new data
//    filterData(showTitle);
//}
//// var filters={
////     "title": d3.select("#show_title").node().value,
////     "genre": d3.select("#genre").node().value,
////     "show_type": d3.select("#imdbRating").node().value,
//// };
//
//function capitalizeFirstLetter(string) {
//    return string.charAt(0).toUpperCase() + string.slice(1);
//}
//function filterData(dd) {
//    // alert(dd);
//    var checkboxes = document.querySelectorAll('input[name=show_title]:checked');
//    titles = [];
//    // for (var i = 0; i < checkboxes.length; i++) {titles.push(encodeURIComponent(checkboxes[i].value))}
//    for (var i = 0; i < checkboxes.length; i++) {titles.push(checkboxes[i].value)}
//    // console.log(titles);
//
//    var checkboxes = document.querySelectorAll('input[name=show_type]:checked');
//    show_type = [];
//    for (var i = 0; i < checkboxes.length; i++) {show_type.push(checkboxes[i].value)}
//    // console.log(show_type);
//
//    var checkboxes = document.querySelectorAll('input[name=genre]:checked');
//    genre = [];
//    for (var i = 0; i < checkboxes.length; i++) {genre.push(checkboxes[i].value)}
//    // console.log(genre);
//
//    if(dd==""){
//        // console.log(titles);
//        titles_2 = titles;
//    }else{
//        titles_2 = [dd]
//    }
//
//    targetTtable.select("tbody").text("");
//    for(i=0;i<tableData.length;i++){
//        // console.log(tableData[i].title);
//        // if(String(tableData[i].title)==String(dd) && genres.includes(tableData[i].genre) && genre.includes(tableData[i].type) && show_type.includes(tableData[i].imdbRating) && titles.includes(tableData[i].title)){
//        if(titles_2.includes(tableData[i].title) && genres.includes(tableData[i].genre) && genre.includes(tableData[i].type) && show_type.includes(tableData[i].imdbRating) && titles.includes(tableData[i].title)){
//            // console.log(tableData[i]);
//            var tbodytr = targetBbody.append("tr");
//            tbodytr.append("td").text(tableData[i].title);
//            tbodytr.append("td").text(tableData[i].type);
//            tbodytr.append("td").text(tableData[i].genre);
//            tbodytr.append("td").text(tableData[i].year);
//            tbodytr.append("td").text(tableData[i].imdbRating);
//
//        }
//    }
//}
//for(i=0;i<tableData.length;i++){
//    // console.log(tableData[i]);
//    var tbodytr = targetBbody.append("tr");
//    tbodytr.append("td").text(tableData[i].title);
//    tbodytr.append("td").text(tableData[i].type);
//    tbodytr.append("td").text(tableData[i].genre);
//    tbodytr.append("td").text(tableData[i].year);
//    tbodytr.append("td").text(tableData[i].imdbRating);
//
//}
//titles = [];
//types= [];
//years = [];
//genres = [];
//imdbRatings = [];
//for(i=0;i<tableData.length;i++){
//    if(!titles.includes(tableData[i].title)){titles.push(tableData[i].title);}
//    if(!types.includes(tableData[i].type)){types.push(tableData[i].type);}
//    if(!genres.includes(tableData[i].genre)){genres.push(tableData[i].genre);}
//    if(!years.includes(tableData[i].year)){years.push(tableData[i].year);}
//    if(!imdbRatings.includes(tableData[i].imdbRating)){imdbRatings.push(tableData[i].imdbRating);}
//}
//// console.log(titles);
//// console.log(types);
//// console.log(years);
//// console.log(genres);
//// console.log(imdbRatings);
//titles.sort();
//types.sort();
//years.sort();
//genres.sort();
//imdbRatings.sort();
//
//var targetFilters = d3.select("#filters");
//
//var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
//liFilter.append("label").text("Titles").attr('for',"title");
//liFilter.append("br");
//spanLi = liFilter.append("div").attr('class',"filters_div");
//for(i=0;i<titles.length;i++){
//    spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "title"+i).attr("name", "title").attr("value", titles[i]);
//    spanLi.append("label").attr('for',"title"+i).text(" " + titles[i].toUpperCase());
//    spanLi.append("br");
//}
//
//var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
//liFilter.append("label").text("genres").attr('for',"genres");
//liFilter.append("br");
//spanLi = liFilter.append("div").attr('class',"filters_div");
//for(i=0;i<genres.length;i++){
//    spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "genres"+i).attr("name", "genres").attr("value", genres[i]);
//    spanLi.append("label").attr('for',"genres"+i).text(" " + genres[i].toUpperCase());
//    spanLi.append("br");
//}
//
//var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
//liFilter.append("label").text("Genre").attr('for',"genre");
//liFilter.append("br");
//spanLi = liFilter.append("div").attr('class',"filters_div");
//for(i=0;i<genres.length;i++){
//    spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "genre"+i).attr("name", "genre").attr("value", genre[i]);
//    spanLi.append("label").attr('for',"genre"+i).text(" " + capitalizeFirstLetter(genres[i]));
//    spanLi.append("br");
//}
//
//var liFilter = targetFilters.append("li").attr("class","filter list-group-item");
//liFilter.append("label").text("show_type").attr('for',"show_type").attr('onclick',"showhid('show_type_span')");
//liFilter.append("br");
//spanLi = liFilter.append("div").attr('id',"show_type_span").attr('class',"filters_div");
//for(i=0;i<types.length;i++){
//    spanLi.append("input").attr("checked", true).attr("show_type", "checkbox").attr("id", "show_type"+i).attr("name", "show_type").attr("value", show_type[i]);
//    spanLi.append("label").attr('for',"show_type"+i).text(" " + capitalizeFirstLetter(types[i]));
//    spanLi.append("br");
//}
//
//function showhid(elem){
//    var LINE = document.getElementById(elem);
//}
//
//// if(obj.title!="" AND obj.genre!="" AND obj.show_type!=""){
////     var filterData = tableData.filter(obj => obj.title == filters.title && obj.genre == filters.genre && obj.imdbRating == filters.show_type);
//// }elseif(obj.title!="" AND obj.genre!="" AND obj.show_type==""){
////     var filterData = tableData.filter(obj => obj.title == filters.title && obj.genre == filters.genre);
//// }elseif(obj.title!="" AND obj.genre=="" AND obj.show_type!=""){
////     var filterData = tableData.filter(obj => obj.title == filters.title && obj.imdbRating == filters.show_type);
//// }elseif(obj.title!="" AND obj.genre=="" AND obj.show_type==""){
////     var filterData = tableData.filter(obj => obj.title == filters.title);
//// }elseif(obj.title=="" AND obj.genre!="" AND obj.show_type!=""){
////     var filterData = tableData.filter(obj => obj.genre == filters.genre && obj.imdbRating == filters.show_type);
//// }elseif(obj.title="" AND obj.genre="" AND obj.show_type=""){
////     var Textwarning = "You need to choose a filter";
//// }
//
//d3.select("#filter-btn").on("click", handleSubmit);
//d3.selectAll("input[type=checkbox]").on("change", handleSubmit);
//// var showTitle = d3.select("#show_title").node().value;
//// console.log(showTitle);
//
//// // clear the input value
//// targetTtable.select("tbody").text("");
//
//// // Build the table with the new data
//// filterData(showTitle);
