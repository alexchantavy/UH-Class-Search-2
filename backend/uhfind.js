// Visits UH ICS class availability and parses all listings to JSON using 
// phantom.js.

var page = require('webpage').create();

// Listener to display console msgs from within page.evaluate()
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

var departments = ["ACC", "ACM", "AMST", "ANAT",
        "ANSC", "ANTH", "APDM", "ARAB", "ARCH", "ART", "AS", "ASAN", "ASTR",
        "BE", "BIOC", "BIOL", "BIOM", "BLAW", "BOT", "BUS", "CAAM", "CAM",
        "CAS", "CEE", "CHAM", "CHEM", "CHN", "CIS", "CMB", "COM", "CSD",
        "CUL", "DH", "DIS", "DNCE", "DRB", "EALL", "ECON", "EDCS", "EDEA",
        "EDEF", "EDEP", "EE", "ELI", "ENG", "ENGR", "ES", "ETEC", "FAMR",
        "FIL", "FIN", "FMCH", "FR", "FSHN", "GEOG", "GER", "GERI", "GG",
        "GRK", "HAW", "HIST", "HNDI", "HON", "HRM", "HWST", "ICS", "ILO",
        "IND", "INS", "IP", "IS", "ITAL", "ITE", "ITM", "JOUR", "JPN", "KOR",
        "KRS", "LAIS", "LATN", "LAW", "LING", "LIS", "LLEA", "LLL", "LLM",
        "LWEV", "LWJT", "LWLW", "LWPA", "LWUL", "MAO", "MATH", "MBBE", "MDED",
        "ME", "MED", "MEDT", "MET", "MGT", "MICR", "MKT", "MSL", "MUS", "NHH",
        "NREM", "NURS", "OBGN", "OCN", "OEST", "ORE", "PACE", "PACS", "PATH",
        "PED", "PEPS", "PH", "PHIL", "PHRM", "PHYL", "PHYS", "PLAN", "POLS",
        "PORT", "PPC", "PPST", "PSTY", "PSY", "PUBA", "RE", "REL", "REPR",
        "RUS", "SAM", "SLS", "SNSK", "SOC", "SOCS", "SP", "SPAN", "SPED",
        "SURG", "SW", "TAHT", "THAI", "THEA", "TI", "TIM", "TONG", "TPSS",
        "TRMD", "VIET", "WS", "ZOOL"];


var getDepartmentCourses = function() {
  _fetchCourseData.call(this, 'ICS', function(data) {
    console.log(JSON.stringify(data, undefined, 2));
  });
};


var _fetchCourseData = function(dept, callback) {
  var url = 'https://www.sis.hawaii.edu/uhdad/avail.classes?i=MAN&t=201430&s=' + dept;

  // Open UH class listing 
  page.open(url, function(status) {
    if (status === 'success') {

      var result = page.evaluate(function() {

        var rows = document.querySelectorAll('table.listOfClasses tr')
        var catalog = [];

        // Iterate through the <tr>s starting at index 2 to skip the header rows.
        for (var i = 2; i < rows.length; i++) {

          var course = {};

          // Here is a weird edge case: sometimes UH class listings like to 
          // put in a special note for a class that spans 2 <td>s.
          if (rows[i].cells.length == 2) { 
            course['extraNotes'] = rows[i].cells[1].textContent;
            // Done. Advance the row counter.
            // Assert: this is not the last <tr> of the array.
            i++; 
          }
          course['genEdFocus'] = rows[i].cells[0].textContent;
          course['crn']        = rows[i].cells[1].textContent;
          course['course']     = rows[i].cells[2].textContent;
          course['sectionNum'] = rows[i].cells[3].textContent;
          course['title']      = rows[i].cells[4].textContent;
          course['credits']    = rows[i].cells[5].textContent;
          course['instructor'] = rows[i].cells[6].textContent;
          course['seatsAvail'] = rows[i].cells[7].textContent;

          course['mtgTime']    = [];        
          course['mtgTime'].push({
                                  'days'  : rows[i].cells[8].textContent, 
                                  'time'  : rows[i].cells[9].textContent,
                                  'loc'   : rows[i].cells[10].textContent,
                                  'dates' : rows[i].cells[11].textContent
                                });        
          
          // If there are additional meeting times, add them.
          // We can tell this by checking if <tr.class> changes.
          while (rows[i+1] && rows[i].className === rows[i+1].className) {
            i++;
            course['mtgTime'].push({
                                    // '7' because for some reason theres 1 less <td>
                                    // in new columns
                                    'days'  : rows[i].cells[7].textContent,
                                    'time'  : rows[i].cells[8].textContent,
                                    'loc'   : rows[i].cells[9].textContent,
                                    'dates' : rows[i].cells[10].textContent
                                  });
          }
          catalog.push(course);
        } // </For>
        return catalog;
      }); // </var result = page.evaluate()>
      callback(result);
    }
    phantom.exit();
  });
};


getDepartmentCourses();
