
var async = require('async');
var UHFind = require('./uhfind.js');
var uhfind = new UHFind();


function getClasses(dept, callback) {
  //grab and scrape data from UH course picker 
  
  uhfind.fetchDeptCourses(dept, function(err, result) {
    if (!err)
      callback(null, result);
    else 
      callback(err);
  });
}

// grab all the classes in series!   
// because i'm not smart enough to do async foreach or promises or es6 in phantomjs!!!
async.series([

  function(callback) {
    getClasses('ACC', callback);
  },
  function(callback) {
     getClasses('ACM', callback);
  },
  function(callback) {
     getClasses('AMST', callback);
  },
  function(callback) {
     getClasses('ANAT', callback);
  },
  function(callback) {
     getClasses('ANSC', callback);
  },
  function(callback) {
     getClasses('ANTH', callback);
  },
  function(callback) {
     getClasses('APDM', callback);
  },
  function(callback) {
     getClasses('ARAB', callback);
  },
  function(callback) {
     getClasses('ARCH', callback);
  },
  function(callback) {
     getClasses('ART', callback);
  },
  function(callback) {
     getClasses('AS', callback);
  },
  function(callback) {
     getClasses('ASAN', callback);
  },
  function(callback) {
     getClasses('ASTR', callback);
  },
  function(callback) {
     getClasses('BE', callback);
  },
  function(callback) {
     getClasses('BIOC', callback);
  },
  function(callback) {
     getClasses('BIOL', callback);
  },
  function(callback) {
     getClasses('BIOM', callback);
  },
  function(callback) {
     getClasses('BLAW', callback);
  },
  function(callback) {
     getClasses('BOT', callback);
  },
  function(callback) {
     getClasses('BUS', callback);
  },
  function(callback) {
     getClasses('CAAM', callback);
  },
  function(callback) {
     getClasses('CAM', callback);
  },
  function(callback) {
     getClasses('CAS', callback);
  },
  function(callback) {
     getClasses('CEE', callback);
  },
  function(callback) {
     getClasses('CHAM', callback);
  },
  function(callback) {
     getClasses('CHEM', callback);
  },
  function(callback) {
     getClasses('CHN', callback);
  },
  function(callback) {
     getClasses('CIS', callback);
  },
  function(callback) {
     getClasses('CMB', callback);
  },
  function(callback) {
     getClasses('COM', callback);
  },
  function(callback) {
     getClasses('CSD', callback);
  },
  function(callback) {
     getClasses('CUL', callback);
  },
  function(callback) {
     getClasses('DH', callback);
  },
  function(callback) {
     getClasses('DIS', callback);
  },
  function(callback) {
     getClasses('DNCE', callback);
  },
  function(callback) {
     getClasses('DRB', callback);
   },
  function(callback) {
     getClasses('EALL', callback);
   },
  function(callback) {
     getClasses('ECON', callback);
   },
  function(callback) {
     getClasses('EDCS', callback);
   },
  function(callback) {
     getClasses('EDEA', callback);
   },
  function(callback) {
     getClasses('EDEF', callback);
   },
  function(callback) {
     getClasses('EDEP', callback);
   },
  function(callback) {
     getClasses('EE', callback);
   },
  function(callback) {
     getClasses('ELI', callback);
   },
  function(callback) {
     getClasses('ENG', callback);
   },
  function(callback) {
     getClasses('ENGR', callback);
   },
  function(callback) {
     getClasses('ES', callback);
   },
  function(callback) {
     getClasses('ETEC', callback);
   },
  function(callback) {
     getClasses('FAMR', callback);
   },
  function(callback) {
     getClasses('FIL', callback);
   },
  function(callback) {
     getClasses('FIN', callback);
   },
  function(callback) {
     getClasses('FMCH', callback);
   },
  function(callback) {
     getClasses('FR', callback);
   },
  function(callback) {
     getClasses('FSHN', callback);
   },
  function(callback) {
     getClasses('GEOG', callback);
   },
  function(callback) {
     getClasses('GER', callback);
   },
  function(callback) {
     getClasses('GERI', callback);
   },
  function(callback) {
     getClasses('GG', callback);
   },
  function(callback) {
     getClasses('GRK', callback);
   },
  function(callback) {
     getClasses('HAW', callback);
   },
  function(callback) {
     getClasses('HIST', callback);
   },
  function(callback) {
     getClasses('HNDI', callback);
   },
  function(callback) {
     getClasses('HON', callback);
   },
  function(callback) {
     getClasses('HRM', callback);
   },
  function(callback) {
     getClasses('HWST', callback);
   },
  function(callback) {
     getClasses('ICS', callback);
   },
  function(callback) {
     getClasses('ILO', callback);
   },
  function(callback) {
     getClasses('IND', callback);
   },
  function(callback) {
     getClasses('INS', callback);
   },
  function(callback) {
     getClasses('IP', callback);
   },
  function(callback) {
     getClasses('IS', callback);
   },
  function(callback) {
     getClasses('ITAL', callback);
   },
  function(callback) {
     getClasses('ITE', callback);
   },
  function(callback) {
     getClasses('ITM', callback);
   },
  function(callback) {
     getClasses('JOUR', callback);
   },
  function(callback) {
     getClasses('JPN', callback);
   },
  function(callback) {
     getClasses('KOR', callback);
   },
  function(callback) {
     getClasses('KRS', callback);
   },
  function(callback) {
     getClasses('LAIS', callback);
   },
  function(callback) {
     getClasses('LATN', callback);
   },
  function(callback) {
     getClasses('LAW', callback);
   },
  function(callback) {
     getClasses('LING', callback);
   },
  function(callback) {
     getClasses('LIS', callback);
   },
  function(callback) {
     getClasses('LLEA', callback);
   },
  function(callback) {
     getClasses('LLL', callback);
   },
  function(callback) {
     getClasses('LLM', callback);
   },
  function(callback) {
     getClasses('LWEV', callback);
   },
  function(callback) {
     getClasses('LWJT', callback);
   },
  function(callback) {
     getClasses('LWLW', callback);
   },
  function(callback) {
     getClasses('LWPA', callback);
   },
  function(callback) {
     getClasses('LWUL', callback);
   },
  function(callback) {
     getClasses('MAO', callback);
   },
  function(callback) {
     getClasses('MATH', callback);
   },
  function(callback) {
     getClasses('MBBE', callback);
   },
  function(callback) {
     getClasses('MDED', callback);
   },
  function(callback) {
     getClasses('ME', callback);
   },
  function(callback) {
     getClasses('MED', callback);
   },
  function(callback) {
     getClasses('MEDT', callback);
   },
  function(callback) {
     getClasses('MET', callback);
   },
  function(callback) {
     getClasses('MGT', callback);
   },
  function(callback) {
     getClasses('MICR', callback);
   },
  function(callback) {
     getClasses('MKT', callback);
   },
  function(callback) {
     getClasses('MSL', callback);
   },
  function(callback) {
     getClasses('MUS', callback);
   },
  function(callback) {
     getClasses('NHH', callback);
   },
  function(callback) {
     getClasses('NREM', callback);
   },
  function(callback) {
     getClasses('NURS', callback);
   },
  function(callback) {
     getClasses('OBGN', callback);
   },
  function(callback) {
     getClasses('OCN', callback);
   },
  function(callback) {
     getClasses('OEST', callback);
   },
  function(callback) {
     getClasses('ORE', callback);
   },
  function(callback) {
     getClasses('PACE', callback);
   },
  function(callback) {
     getClasses('PACS', callback);
   },
  function(callback) {
     getClasses('PATH', callback);
   },
  function(callback) {
     getClasses('PED', callback);
   },
  function(callback) {
     getClasses('PEPS', callback);
   },
  function(callback) {
     getClasses('PH', callback);
   },
  function(callback) {
     getClasses('PHIL', callback);
   },
  function(callback) {
     getClasses('PHRM', callback);
   },
  function(callback) {
     getClasses('PHYL', callback);
   },
  function(callback) {
     getClasses('PHYS', callback);
   },
  function(callback) {
     getClasses('PLAN', callback);
   },
  function(callback) {
     getClasses('POLS', callback);
   },
  function(callback) {
     getClasses('PORT', callback);
   },
  function(callback) {
     getClasses('PPC', callback);
   },
  function(callback) {
     getClasses('PPST', callback);
   },
  function(callback) {
     getClasses('PSTY', callback);
   },
  function(callback) {
     getClasses('PSY', callback);
   },
  function(callback) {
     getClasses('PUBA', callback);
   },
  function(callback) {
     getClasses('RE', callback);
   },
  function(callback) {
     getClasses('REL', callback);
   },
  function(callback) {
     getClasses('REPR', callback);
   },
  function(callback) {
     getClasses('RUS', callback);
   },
  function(callback) {
     getClasses('SAM', callback);
   },
  function(callback) {
     getClasses('SLS', callback);
   },
  function(callback) {
     getClasses('SNSK', callback);
   },
  function(callback) {
     getClasses('SOC', callback);
   },
  function(callback) {
     getClasses('SOCS', callback);
   },
  function(callback) {
     getClasses('SP', callback);
   },
  function(callback) {
     getClasses('SPAN', callback);
   },
  function(callback) {
     getClasses('SPED', callback);
   },
  function(callback) {
     getClasses('SURG', callback);
   },
  function(callback) {
     getClasses('SW', callback);
   },
  function(callback) {
     getClasses('TAHT', callback);
   },
  function(callback) {
     getClasses('THAI', callback);
   },
  function(callback) {
     getClasses('THEA', callback);
   },
  function(callback) {
     getClasses('TI', callback);
   },
  function(callback) {
     getClasses('TIM', callback);
   },
  function(callback) {
     getClasses('TONG', callback);
   },
  function(callback) {
     getClasses('TPSS', callback);
   },
  function(callback) {
     getClasses('TRMD', callback);
   },
  function(callback) {
     getClasses('VIET', callback);
   },
  function(callback) {
     getClasses('WS', callback);
   },
  function(callback) {
     getClasses('ZOOL', callback);
   }

],


// End!!!!
function(err, results){
    // results has alllllllll the classes
    if (!err) {
      console.log(JSON.stringify(results, undefined, 2));
    }
    else {
      console.log(err);
    }
    phantom.exit();
});


