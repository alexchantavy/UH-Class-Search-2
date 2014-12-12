/*
Synchronously grabs data from the UH sites and writes it to a json file. 

IMPORTANT: don't run this script directly, meant to be called from
grab.sh.  also, this won't run from node; it'll only
work with phantomjs.

*/
//remember that phantom's `fs` is NOT node's `fs`.
var async         = require('async')
,   fs            = require('fs')
,   fetchCourses  = require('./uhfind.js');


var uhSystem = [{
  campus: 'HAW',
  departments: ['ACC', 'AJ', 'AG', 'ANTH', 'CAD', 'AEC', 'ART', 'ASAN', 'ASTR', 
    'ABRP', 'AMT', 'BIOC', 'BIOL', 'BLPR', 'BOT', 'BUS', 'BUSN', 'CARP', 'CHEM',
    'CENT', 'CULN', 'DNCE', 'DIMC', 'ECOM', 'ECED', 'ECON', 'EIMT', 'ETRO', 
    'ESOL', 'ENG', 'ESL', 'ENT', 'FAMR', 'FIRE', 'GEOG', 'GG', 'HAW', 'HWST', 
    'HIST', 'HOST', 'HD', 'HSER', 'HUM', 'ITS', 'ICS', 'IS', 'JPNS', 'LING', 
    'MWIM', 'MKT', 'MATH', 'MICR', 'NURS', 'OCN', 'PHRM', 'PHIL', 'PHYS', 'PSY',
    'QM', 'REL', 'SCI', 'SSCI', 'SOC', 'SPCO', 'SUBS', 'WS', 'ZOOL']
},
{
  campus: 'HON', 
  departments: ['ACC', 'AJ', 'AERO', 'AS', 'AG', 'AMST', 'ANTH', 'CAD', 'AEC', 
    'ART', 'ASAN', 'ASTR', 'ABRP', 'AMT', 'BIOC', 'BIOL', 'BLPR', 'MARR', 'BOT',
    'CARP', 'CHEM', 'AVIT', 'CA', 'CENT', 'CMGT', 'COSM', 'DISL', 'ECED', 
    'EALL', 'ECON', 'EIMT', 'ENG', 'ESL', 'FAMR', 'FT', 'FIRE', 'FSHN', 'GEOG',
    'GG', 'HAW', 'HWST', 'HIST', 'HUM', 'IED', 'IEDD', 'ICS', 'IS', 'JPN', 
    'JOUR', 'KLS', 'KOR', 'LING', 'MATH', 'MET', 'MICR', 'MSL', 'MUS', 'MELE',
    'OESM', 'OCN', 'PHIL', 'PHYS', 'PHYL', 'POLS', 'PSY', 'RAC', 'REL', 'SCI', 
    'SMP', 'SSCI', 'SOSE', 'SW', 'SOC', 'SPAN', 'SP', 'WELD', 'WS', 'ZOOL']
},
{
  campus: 'KAU',
  departments: ['ACC', 'AG', 'ANTH', 'CAD', 'AEC', 'ART', 'ABRP', 'AMT', 'BIOL',
    'BOT', 'BUS', 'BLAW', 'BUSN', 'CARP', 'CHEM', 'CULN', 'ECOM', 'ECON', 'ED', 
    'ELEC', 'ETRO', 'ENG', 'ELI', 'ENT', 'FENG', 'GEOG', 'HAW', 'HWST', 'HLTH', 
    'HPER', 'HIST', 'HORT', 'HOST', 'ICS', 'IS', 'JPNS', 'JOUR', 'LING', 'MGT', 
    'MARE', 'MATH', 'MEDA', 'MICR', 'MUS', 'NURS', 'OCN', 'PHIL', 'PHYS', 'PBT',
    'POLS', 'PSY', 'REL', 'SMKT', 'SCI', 'SSCI', 'SOC', 'SPAN', 'SP', 'SSM', 
    'WELD', 'ZOOL']
},
{
  campus: 'LEE',
  departments: ['ACC', 'AG', 'AMST', 'ANTH', 'ART', 'ASAN', 'ASTR', 'AMT', 
    'BIOC', 'BIOL', 'BOT', 'BUS', 'BLAW', 'BUSN', 'CHEM', 'CHN', 'CE', 'COM', 
    'CULN', 'DNCE', 'DMED', 'ECOM', 'ECON', 'ED', 'EE', 'ENG', 'ESL', 'ELI', 
    'FAMR', 'FIN', 'FSHN', 'FR', 'GEOG', 'GG', 'HAW', 'HWST', 'HLTH', 'HIT', 
    'HIST', 'HORT', 'HOST', 'HSER', 'ICS', 'IS', 'JPNS', 'KOR', 'LSK', 'LING', 
    'MGT', 'MKT', 'MATH', 'ME', 'MICR', 'MUS', 'OCN', 'PACS', 'PHIL', 'PHYS', 
    'PBT', 'POLS', 'PSY', 'QM', 'REL', 'SSCI', 'SOC', 'SPAN', 'SP', 'TAG', 
    'TVPR', 'THEA', 'TIM', 'WS', 'ZOOL']
},
{
  campus: 'HIL',
  departments: ['ACC', 'AJ', 'AGBU', 'AGEC', 'AGEN', 'AG', 'ANSC', 'ANTH', 
    'AQUA', 'ART', 'ASTR', 'BIOL', 'BUS', 'CHEM', 'CHNS', 'COM', 'CS', 'DNCE', 
    'DRAM', 'ECON', 'ED', 'KED', 'ENGR', 'ENG', 'ESL', 'ENTO', 'ENSC', 'FIL', 
    'FIN', 'FOR', 'GEOG', 'GEOL', 'HAW', 'KHAW', 'HWST', 'KHWS', 'HIST', 'HON', 
    'HORT', 'KIND', 'IS', 'JPNS', 'JPST', 'KES', 'LANG', 'LING', 'MGT', 'MARE', 
    'MKT', 'MATH', 'MSL', 'MUS', 'NRES', 'NURS', 'PHPS', 'PHPP', 'PHIL', 'PHYS',
    'PPTH', 'POLS', 'PSY', 'QBA', 'SOC', 'SOIL', 'SPAN', 'TOUR', 'CBES', 'WS']
},
{
  campus: 'MAN', 
  departments: ['ACM', 'ACC', 'AS', 'AMST', 'ANAT', 'ANSC', 'ANTH', 'ARAB', 
    'ARCH', 'ART', 'ASAN', 'ASTR', 'BIOC', 'BE', 'BIOL', 'BIOM', 'BOT', 'BUS', 
    'BLAW', 'CAM', 'CMB', 'CHAM', 'CHEM', 'CHN', 'CEE', 'COM', 'CIS', 'CSD', 
    'COMG', 'EDCS', 'DNCE', 'DH', 'DRB', 'DIS', 'EALL', 'ECON', 'EDEA', 'EDEF', 
    'EDEP', 'ETEC', 'EE', 'ENGR', 'ENG', 'ESL', 'ELI', 'ES', 'FMCH', 'FAMR', 
    'FDM', 'FIL', 'FIN', 'FSHN', 'FR', 'GEOG', 'GG', 'GERI', 'GER', 'GHPS', 
    'GRK', 'HAW', 'HWST', 'HNDI', 'HIST', 'HON', 'HRM', 'ILO', 'IP', 'IND', 
    'ITM', 'ICS', 'ITE', 'IS', 'CUL', 'ITAL', 'JPN', 'JOUR', 'KRS', 'KOR', 
    'LLEA', 'LATN', 'LAIS', 'LAW', 'LWEV', 'LWJT', 'LWLW', 'LWPA', 'LIS', 
    'LING', 'MGT', 'MAO', 'MBIO', 'MKT', 'MATH', 'ME', 'MDED', 'MEDT', 'MED', 
    'MET', 'MICR', 'MSL', 'MCB', 'MBBE', 'MUS', 'NHH', 'NREM', 'NURS', 'OBGN', 
    'ORE', 'OCN', 'PACS', 'PATH', 'PACE', 'PED', 'PERS', 'PHRM', 'PHIL', 'PHYS',
    'PHYL', 'PEPS', 'POLS', 'PORT', 'PSTY', 'PSY', 'PUBA', 'PH', 'PPC', 'RE', 
    'REL', 'RUS', 'SAM', 'SNSK', 'SLS', 'SOCS', 'SW', 'SOC', 'SPAN', 'SPED', 
    'SURG', 'TAHT', 'THAI', 'THEA', 'TONG', 'TI', 'TIM', 'TRMD', 'TPSS', 'PLAN'
    'URDU', 'VIET', 'WS', 'ZOOL']
}, 
{
  campus: 'KAP',
  departments: ['ACC', 'ASL', 'AMST', 'ANTH', 'ART', 'ASAN', 'ASTR', 'BIOC', 
    'BIOL', 'BOT', 'BUS', 'BLAW', 'CHEM', 'CHNS', 'CE', 'COM', 'CULN', 'DNCE', 
    'DEAF', 'DENT', 'EALL', 'EBUS', 'ECON', 'ED', 'EE', 'EMT', 'ESOL', 'ENG', 
    'ESL', 'ENT', 'ES', 'ESS', 'FAMR', 'FIL', 'FSHE', 'FR', 'GEOG', 'GG', 'HAW',
    'HWST', 'HLTH', 'HIST', 'HOST', 'ITS', 'ICS', 'IS', 'JPNS', 'JOUR', 'KOR', 
    'LAW', 'LING', 'MGT', 'MKT', 'MATH', 'ME', 'MEDA', 'MLT', 'MICR', 'MICT', 
    'MUS', 'NURS', 'OTA', 'OCN', 'PACS', 'PHRM', 'PHIL', 'PTA', 'PHYS', 'PHYL', 
    'POLS', 'PSY', 'RAD', 'REL', 'RESP', 'SLT', 'SOCS', 'SSCI', 'SOC', 'SPAN', 
    'SP', 'THEA', 'WS', 'ZOOL']
},
{
  campus: 'MAU',
  departments: ['ACC', 'AJ', 'AG', 'ANTH', 'CAD', 'AEC', 'ART', 'ASTR', 'ABRP', 
    'AMT', 'BIOL', 'BLPR', 'BOT', 'BUS', 'BLAW', 'BUSN', 'CARP', 'CHEM', 'COM', 
    'CASE', 'CULN', 'DENT', 'DH', 'DRAM', 'ECED', 'EALA', 'ECON', 'ELEC', 
    'ETRO', 'ENRG', 'ENG', 'FAMR', 'FT', 'FIL', 'FIN', 'FSHN', 'GIS', 'GEOG', 
    'HAW', 'HWST', 'HLTH', 'HIST', 'HOST', 'HSER', 'HUM', 'ILO', 'ICS', 'IS', 
    'JPNS', 'JOUR', 'LSK', 'LING', 'MAIN', 'MGT', 'MKT', 'MATH', 'MICR', 'MUS',
    'NURS', 'OCN', 'PACS', 'PHRM', 'PHIL', 'PHYS', 'POLS', 'PSY', 'REL', 'SCI', 
    'SOC', 'SPAN', 'SP', 'SSM', 'WELD', 'ZOOL']
},
{
  campus: 'WOA',
  departments: ['ACC', 'AS', 'ANTH', 'APSC', 'ART', 'BIOL', 'BOT', 'BUSA', 
    'CHEM', 'CENT', 'CM', 'ECED', 'ECON', 'EDUC', 'EDEF', 'ETEC', 'EDEE', 'ENG',
    'FIN', 'GEOG', 'GEOL', 'HPST', 'HAW', 'HWST', 'HIST', 'HUM', 'ISA', 'ITS', 
    'ICS', 'MGT', 'MATH', 'MET', 'MSL', 'MUS', 'OCN', 'PACS', 'PHIL', 'PHYS', 
    'POLS', 'PSY', 'PUBA', 'SAM', 'SSCI', 'SOC', 'SPED', 'SP', 'SCFS']
},
{
  campus: 'WIN',
  departments: ['ACC', 'AG', 'ANSC', 'ANTH', 'AQUA', 'ART', 'ASTR', 'BIOC', 
    'BIOL', 'BOT', 'BUS', 'CHEM', 'ECON', 'EE', 'ENG', 'FAMR', 'GEOG', 'GG', 
    'HAW', 'HWST', 'HLTH', 'HIST', 'ICS', 'IS', 'JPNS', 'JOUR', 'LING', 'MATH', 
    'MET', 'MICR', 'MUS', 'OCN', 'PACS', 'PHRM', 'PHIL', 'PHYS', 'POLS', 'PSY', 
    'REL', 'SSCI', 'SW', 'SOC', 'SPAN', 'SP', 'THEA', 'ZOOL']
}];

function getClasses(campus, dept, callback) {
  fetchCourses(campus, dept, function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);  
    }
  });
}

var results = [];

// get data from all departments one at a time.
// any value other than `1` will make phantomjs fail.
var MAX_CONCURRENT = 1;

// async library is used to keep the requests all in order. seems like we can
// only handle one at a time. 
async.eachLimit(
  uhfind.departments,
  MAX_CONCURRENT,

  // do this for each department
  function(dept, callback) {


    fetchCourses(campus, dept, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // concatenate data without producing new array
        results.push.apply(results, data);
      }
      // required for `async`
      callback();
    });

    getClasses( dept, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // concatenate data without producing new array
        results.push.apply(results, data);
      }
      callback();
    });
  }, 

  // whole job is done
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('done with ' + results.length + ' classes!');
      // 'w' is overwrite.
      fs.write('data.json', JSON.stringify(results), 'w');
      console.log('Wrote data.json!');
      phantom.exit();
    }
  }

);

