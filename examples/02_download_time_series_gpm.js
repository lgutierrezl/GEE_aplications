// 1. Define point
var point = ee.Geometry.Point(-79.71,-4.64);
Map.centerObject(point, 9);

// 2. Select time period
var start = new Date('2017-01-01');
var end = new Date('2017-01-31');

// 3. GPM collection
var dataset = ee.ImageCollection('NASA/GPM_L3/IMERG_V06');
var gpm_sel = dataset.filterBounds(point)
                    .filterDate(start, end)
                    .select('precipitationCal');
var pcp_mes = gpm_sel.sum();

// 4. Visualization
var palette = [
  '000096','0064ff', '00b4ff', '33db80', '9beb4a',
  'ffeb00', 'ffb300', 'ff6400', 'eb1e00', 'af0000'
];
var precipitationVis = {min: 0.0, max: 1000.0, palette: palette, opacity : 0.5};
Map.addLayer(pcp_mes, precipitationVis, 'Precipitation mensual');
Map.addLayer(point, {palette: '#000000'}, 'Punto');

// 5. Create time series
var time_serie = gpm_sel.map(function(image){
  var gpm_fecha = image.date().format('YYYY-MM-dd HH:mm');
  var gpm_pcp = image.clip(point).reduceRegion({
        reducer: ee.Reducer.mean(), 
        scale: 30 
        }).get('precipitationCal');
  return ee.Feature(null, {fecha: gpm_fecha, pcp:gpm_pcp});    
});

// 6. Export CSV
Export.table.toDrive({
  collection: time_serie,
  selectors: 'fecha, pcp',
  description: 'gpm_pcp_point2',
  folder: 'GEE',
  fileFormat: 'CSV'
});