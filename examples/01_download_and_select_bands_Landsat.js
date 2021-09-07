// Extract by extension and select bands from LANDSAT 8
var raw = ee.Image('LANDSAT/LC08/C01/T1/LC08_007068_20200127');

var region = ee.Geometry.Rectangle([-77.1, -12, -77, -11.9]);

var landsat = raw.select(['B4','B3','B2']).clip(region);

Map.centerObject(landsat, 11);
Map.addLayer(landsat, {min:6000, max:12000}, 'Landsat RGB');

Export.image.toDrive({
  image: landsat,
  description: 'Landsat_RGB',
  scale: 30,
  region: region
})