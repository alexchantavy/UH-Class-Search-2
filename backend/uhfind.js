// uhfindstubs.js

function UHFinder(baseUrl) {
  this.baseUrl = typeof baseUrl !== 'undefined' ?  url :
        'https://www.sis.hawaii.edu/uhdad/avail.classes?i=MAN&t=201510&s=';

  this.departments = ["ACC", "ACM", "AMST", "ANAT",
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

  // get all classes in given department, return data to a callback.
  this.fetchDeptCourses = function(dept, callback) {
    var page = require('webpage').create();
    page.open(this.baseUrl+dept, function(status) {
      var result = page.evaluate(scrapeDom);
      callback(result);
    })
  };

  // scrape dat DOM.  private helper function.
  var scrapeDom = function() {
    var rows = document.querySelectorAll('table.listOfClasses tr');
    var catalog = [];

    // Iterate through the <tr>s starting at index 2 to skip the header rows.
    for (var i = 2; i < rows.length; i++) {

      var course = {};

      // Edge case 1: skip the section-comments that take up entire rows.  
      if (rows[i].className.indexOf('section-comment-course') != -1) { i++; }

      // Edge case 2: sometimes UH class listings like to 
      // put in a special note for a class that spans 2 <td>s.
      if (rows[i].cells.length == 2) { 
        course['extraNotes'] = rows[i].cells[1].textContent;
        i++; 
      }

      course['genEdFocus'] =  ( rows[i].cells[0].textContent === " ") ? "" 
                              : rows[i].cells[0].textContent;
      course['crn']         =   rows[i].cells[1].textContent;
      course['course']      =   rows[i].cells[2].textContent;
      course['sectionNum']  =   rows[i].cells[3].textContent;
      course['title']       =   rows[i].cells[4].textContent;
      course['credits']     =   rows[i].cells[5].textContent;
      course['instructor']  =   rows[i].cells[6].textContent;
      course['seatsAvail']  =   rows[i].cells[7].textContent;

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
      console.log(JSON.stringify(course));
      catalog.push(course);
    } // </For>
    return catalog;
  }
}


module.exports = UHFinder;