import 'ol/ol.css';
import { Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';

// Countries where homosexuality is not forbidden (2019, ILGA)
const gaySafeCountries = ['Benin', 'Burkina Faso', 'Cape Verde', 'Central African Republic',
  'Congo', 'Côte d"Ivore', 'Democratic Republic of Congo', 'Djibouti', 'Equatorial Guinea',
  'Gabon', 'Guinea-Bissau', 'Lesotho', 'Madagascar', 'Mali', 'Mozambique', 'Niger', 'Rwanda',
  'Sao Tome & Principe', 'Seychelles', 'South Africa', 'Argentina', 'Bahamas', 'Belize', 'Bolivia',
  'Brazil', 'Costa Rica', 'Chile', 'Colombia', 'Cuba', 'Dominican Republic', 'Ecuador', 'El Salvador',
  'Guatemala', 'Haiti', 'Honduras', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Suriname',
  'Uruguay', 'Venezuela', 'Canada', 'United States', 'Bahrain', 'Cambodia', 'China', 'East Timor',
  'Indonesia', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kyrgyzstan', 'Laos', 'Mongolia', 'Nepal',
  'Dem. Rep. Korea', 'Philippines', 'Korea', 'Tajikistan', 'Thailand', 'Vietnam', 'Albania',
  'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herz.', 'Kosovo',
  'Bulgaria', 'Croatia', 'Cyprus', 'Czech Rep.', 'Denmark', 'Estonia', 'Finland', 'France',
  'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Macedonia',
  'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
  'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Australia', 'Fiji',
  'Marshall Islands', 'Micronesia', 'New Zealand', 'Nauru', 'Palau', 'Vanuatu', 'Greenland'
];

// Countries with ongoing armed conflicts (21/03/2020, Wikipedia)
const warCountries = [
  'Mexico', 'Turkey', 'Iraq', 'Syria', 'Somalia', 'Kenya', 'Algeria', 'Burkina Faso',
  'Chad', 'Libya', 'Mali', 'Mauritania', 'Morocco', 'Niger', 'Tunisia'
];

// How can I decide this?
// const womenViolenceCountries = [
// ];

// Countries with paradisiac beaches
const beachCountries = [
  'Australia', 'Cuba', 'Greece', 'Malaysia', 'Maldives', 'Philippines',
  'Puerto Rico', 'Seychelles', 'Spain', 'Tahiti', 'United States'
];

/**
 * Creates geometry style.
 * @function
 * @param {*} color - polygon fill color
 * @returns {OL Style}
 */
function setFillColor(color) {
  return new Style({
    fill: new Fill({
      color
    }),
    stroke: new Stroke({
      color: 'grey',
      width: 1
    }),
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'black'
      }),
      stroke: new Stroke({
        color: 'white',
        width: 3
      })
    })
  });
}

const countriesFeatures = (new GeoJSON())
  .readFeatures(countriesData);

const countriesLayer = new VectorLayer({
  source: new VectorSource({
    features: countriesFeatures
  }),
  style: setFillColor('#137913')
});

const map = new Map({
  target: 'map',
  layers: [countriesLayer],
  view: new View({
    center: [0, 12],
    zoom: 19
  })
});

/**
 * This will check ticked checkboxes and return checked values.
 * @function
 * @return checked attributes
 */
const checkDesiredAttributes = () => {
  const checkboxes = document.querySelectorAll('#options>label>input');
  let checked = [];
  checkboxes.forEach(box => {
    if (box.checked) checked.push(box.value);
  });
  return checked;
}

/**
 * Sets selected style to countries that have the desired attributes.
 * @function
 */
const setSelectedStyle = () => {
  const mapFeatures = map.getLayers().getArray()[0].getSource().getFeatures();

  mapFeatures.forEach(f => f.setStyle(setFillColor('#8b3b3b')))

  const desiredAttributes = checkDesiredAttributes();

  const selectedFeatures = mapFeatures.filter(country => {
    let selected = true;
    if ((desiredAttributes.includes('gay') &&
        !gaySafeCountries.includes(country.values_.name)) ||
      (desiredAttributes.includes('war') &&
        warCountries.includes(country.values_.name)) ||
      (desiredAttributes.includes('beach') &&
        !beachCountries.includes(country.values_.name))) {
      selected = false;
    }
    return selected;
  });

  selectedFeatures.forEach(f => f.setStyle(setFillColor('#137913')));
}

document.querySelectorAll('#options>label>input').forEach(input => {
  input.addEventListener('change', setSelectedStyle);
})

window.map = map;
