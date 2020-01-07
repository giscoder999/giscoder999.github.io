var lat,red_band,blue_band = [];
var lon=[];
 var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

      var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
  var tiled = new ol.layer.Tile({
        visible: true,
        source: new ol.source.TileWMS({
          url: 'http://192.168.2.62:1040/geoserver/nurc/wms',
          params: {'FORMAT': 'image/png',
                   'VERSION': '1.1.1',
                   tiled: true,
                "LAYERS": 'nurc:mosaic',
                "exceptions": 'application/vnd.ogc.se_inimage',
             tilesOrigin: 6.346 + "," + 36.492
          }
        })
      });
      var source = new ol.source.Vector({wrapX: false});

      var vector = new ol.layer.Vector({
        source: source
      });

      var map = new ol.Map({
         controls: ol.control.defaults({
          attributionOptions: {
            collapsible: false
          }
        }).extend([mousePositionControl]),
        layers: [raster,tiled, vector],
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([12,42]),
          zoom: 5
        })
      });
 
map.on('singleclick', function(evt) {
         document.getElementById('info1').innerHTML = '';
document.getElementById('info2').innerHTML = '';
document.getElementById('info3').innerHTML = '';
var view = map.getView();
         var viewResolution = view.getResolution();
         var url = tiled.getSource().getGetFeatureInfoUrl(
           evt.coordinate, viewResolution, view.getProjection(),
           {'INFO_FORMAT': 'application/json'});
           if (url) {
            var parser = new ol.format.GeoJSON();
            $.ajax({
              url: url,
              dataType: 'json',
              jsonpCallback: 'parseResponse'
            }).then(function(response) {
              var result = parser.readFeatures(response);
 console.log(result)
              if (result.length) {
                var inf = [];
                for (var i = 0, ii = result.length; i < ii; ++i) {
                  inf.push(result[i].get('RED_BAND'));
  inf.push(result[i].get('BLUE_BAND'));
   inf.push(result[i].get('GREEN_BAND'));
 console.log(inf);
                }
                 document.getElementById('info1').innerHTML = inf[0];
  document.getElementById('info2').innerHTML = inf[1];
    document.getElementById('info3').innerHTML = inf[2];
              } else {
                 document.getElementById('info1').innerHTML = '&nbsp;';
                 document.getElementById('info2').innerHTML = '&nbsp;';
                  document.getElementById('info3').innerHTML = '&nbsp;';
              }
            });
          }
      });

   


      var typeSelect = document.getElementById('type');

      var draw; // global so we can remove it later
 
 var lastFeature, draw, featureType;
var removeLastFeature = function () {
    if (lastFeature) source.removeFeature(lastFeature);
};
 
      function addInteraction() {
        var value = typeSelect.value;
if (draw)
        map.removeInteraction(draw);

        if (value !== 'None' || value !=='Submit') {
          draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value
          });
 
        draw.on('drawend',  function(e) {
            lastFeature = e.feature;
        })}
if (value == 'Polygon'){
       
        draw.on('drawstart', function (e) {
            source.clear();
        });
 
          map.addInteraction(draw);

        }
      }
 

      /**
       * Handle change event.
       */
      typeSelect.onchange = function() {
 
val=typeSelect.value;
console.log(val);
 
        map.removeInteraction(draw);
        addInteraction();


if(val=='Submit'){
lat = [];
 lon=[];
var red=blue=""
console.log("printing lat lon");
console.log(lat);
console.log(lon);
console.log(red_band);
console.log(blue_band);

var i=0;
var features = vector.getSource().getFeatures();
console.log(features);

var lat_min,lat_max,lon_min,lon_max;
features.forEach(function(feature) {
var poly_points=feature.getGeometry().getCoordinates();

console.log(poly_points[0].length);
for(i=0;i<poly_points[0].length;i++){
console.log(poly_points[0][i]);
var lonlat = ol.proj.transform(poly_points[0][i], 'EPSG:900913', 'EPSG:4326');
console.log(lonlat);
lon.push(lonlat[0]);
lat.push(lonlat[1]);
}
});
console.log("print pixels");
if(lat.length>0 && lon.length>0){
console.log(lat);
lat_min_max(lat);
console.log(lon);
lon_min_max(lon);}


}};
 
 function lat_min_max(lat){
lat_min=lat_max=lat[0];
//lon_max=lat_max=lon[0];
 lat.forEach(function(lat1){
 
 if(lat_min>lat1){
 lat_min=lat1;
 }
 if(lat_max<lat1){
 lat_max=lat1;}
 });
 
 console.log(lat_min);
 console.log(lat_max);}
 

function lon_min_max(lon){
lon_min=lon_max=lon[0];
//lon_max=lat_max=lon[0];
 lon.forEach(function(lon1){
 console.log(lon1);
 if(lon_min>lon1){
 lon_min=lon1;
 }
 if(lon_max<lon1){
 lon_max=lon1;}
 });
 
 console.log(lon_min);
 console.log(lon_max);
 callWcs(lat_min,lat_max,lon_min,lon_max);
 }
// map.addLayer(tiled);


function httpGet(WCSURL)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", WCSURL, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function callWcs(lat_min,lat_max,lon_min,lon_max){
var red_band,blue_band = [];
var lon=[];
var red=blue=""
console.log("hi");
var WCSURL="http://192.168.2.62:1040/geoserver/ows?service=WCS&version=2.0.0&request=GetCoverage&coverageId=nurc__mosaic&subset=Lat("+lat_min+","+lat_max+")&subset=Long("+lon_min+","+lon_max+")&RangeSubset=RED_BAND&format=text/plain"
red=httpGet(WCSURL);
console.log(red);
WCSURL="http://192.168.2.62:1040/geoserver/ows?service=WCS&version=2.0.0&request=GetCoverage&coverageId=nurc__mosaic&subset=Lat("+lat_min+","+lat_max+")&subset=Long("+lon_min+","+lon_max+")&RangeSubset=BLUE_BAND&format=text/plain"
//a= a.split('\n');
var green=httpGet(WCSURL);
WCSURL="http://192.168.2.62:1040/geoserver/ows?service=WCS&version=2.0.0&request=GetCoverage&coverageId=nurc__mosaic&subset=Lat("+lat_min+","+lat_max+")&subset=Long("+lon_min+","+lon_max+")&RangeSubset=GREEN_BAND&format=text/plain"
var blue=httpGet(WCSURL);
red=red.split("\n");
red_band=red.splice(6,red.length-1);
console.log(red_band);
red_band=red_band.join('\n');
console.log(red_band);
red_band=red_band.replace( /\n/g, " " ).split( " " ).map(Number);
console.log("red");
console.log(red_band);

blue=blue.split("\n");
blue_band=blue.splice(6,blue.length);
blue_band=blue_band.join('\n');
blue_band=blue_band.replace( /\n/g, " " ).split( " " ).map(Number);
console.log(blue_band.pop());
red_band.pop()
r_mean=mean(red_band);

b_mean=mean(blue_band);
//g_mean=mean(green_band);
document.getElementById('r_mean').innerHTML = r_mean;
//document.getElementById('g_mean').innerHTML = g_mean;
document.getElementById('b_mean').innerHTML = b_mean;
draw_chart(red_band,blue_band);


}



// Go through this array and get coordinates of their geometry.

      addInteraction();
 
 
 function draw_chart(red_band,blue_band)
 {
var limit = 50000;
var y = 0;    
var data = [];
var data2 = [];
var dataSeries = { type: "line" };
var dataSeries2 = { type: "line" };
var dataPoints = [];
var dataPoints2 = [];
for (var i = 0; i < red_band.length; i += 1) {
y =red_band[i];
dataPoints.push({
x: i+1,
y: y
});
}

for (var i = 0; i < blue_band.length; i += 1) {
y =blue_band[i];
dataPoints2.push({
x: i+1,
y: y
});
}
dataSeries.dataPoints = dataPoints;
dataSeries2.dataPoints = dataPoints2;
data.push(dataSeries);
data2.push(dataSeries2)
var chart = new CanvasJS.Chart("chartContainer", {
theme:"light2",
animationEnabled: true,
title:{
text: "Pixel values visualization chart for selected Area"
},
axisY :{
includeZero: false,
title: "Pixel values",
suffix: ""
},
toolTip: {
shared: "true"
},
legend:{
cursor:"pointer",
itemclick : toggleDataSeries
},
data: [

{
type: "spline",
showInLegend: true,
yValueFormatString: "##.00",
name: "Red Band",
dataPoints: dataPoints

},
{
type: "spline",
showInLegend: true,
yValueFormatString: "##.00",
name: "Blue Band",
dataPoints: dataPoints2
}]
});
chart.render();

function toggleDataSeries(e) {
if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
e.dataSeries.visible = false;
} else {
e.dataSeries.visible = true;
}
chart.render();
}

}


function mean(band_values) {
    var total = 0, i;
    for (i = 0; i < band_values.length; i += 1) {
        total += band_values[i];
    }
    return total / band_values.length;
}
  google.charts.load('current', {'packages':['corechart', 'bar']});
    google.charts.setOnLoadCallback(tcinfo);

function tcinfo() {

var fruitsdata = google.visualization.arrayToDataTable([
        ['Name', 'Value'],
        ['Mean',16],
['Min',35000],
['Max',78],

      ]);


var view = new google.visualization.DataView(fruitsdata);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       ]);

       var fruitsoptions = {
          title: 'AOI statistics',
          chartArea: {width: '50%'},
          legend: {position: 'bottom'},
       hAxis: {
          minValue: 0,
          ticks: []
        }

       };

      var chart = new google.visualization.BarChart(document.getElementById('chart_fruits'));
      chart.draw(view, fruitsoptions);
}

