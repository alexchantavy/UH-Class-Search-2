// module that is meant to be run from phantomjs and not node!

function UHFinder(baseUrl) {
  this.baseUrl = typeof baseUrl !== 'undefined' ?  baseUrl :
            'https://www.sis.hawaii.edu/uhdad/avail.classes?i=MAN&t=201530&s=';

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

  var page = require('webpage').create();

  // get all classes in given department, return data to a callback.
  this.fetchDeptCourses = function(dept, callback) {
    
    var url = this.baseUrl + dept;

    page.onResourceError = function(resourceError) {
      page.reason = resourceError.errorString;
      page.reason_url = resourceError.url;
    };

    page.open(url, function(status) {
      if (status === 'success') {
        console.log('opened ' + url);
        var result = page.evaluate(scrapeDom);
    
        callback(null, result);

      } else {
        callback(page.reason_url + " " + page.reason); 
      }

    });
  };

  // scrape dat DOM.  private helper function.
  var scrapeDom = function() {

    // return true if $test is a substring in $string
    var isSubstring = function(string, test) {
      return string.indexOf(test) > -1; 
    };

    // helper function to get start and end times from UH data
    var getTime = function(type, timeString) {
      console.log(timeString);
      if (/\d{4}-\d{4}[a|p]/.test(timeString)) {
        
        if (type === 'start') {
          return timeString.substring(0,4); 
        } 
        if (type === 'end') {
          return timeString.substring(5);
        } 

      } else if (timeString === 'TBA') {
        return 'TBA';
      } else {
        return ' ';
      }
    };

    // helper function to convert days (e.g. "TR", "MWF") to array
    // day codes include 
    // M, T, W, R, F, S, SU, or TBA
    var processDayString = function(days) {
      if (typeof days == 'string') {
        if (days == 'TBA') {
          return ['TBA'];
        }

        var daysArray = [];

        for (var i = 0, len = days.length; i < len; i++) {

          var c = days.charAt(i);
          // account for 'SU' = Sunday
          switch(c) {
            case 'U': 
              break;
            case 'S': 
              if (i < len-1 && days.charAt(i+1) == 'U') {
                daysArray.push('SU');
                break;
              }
              // else: fall through to default case.
            default:
              daysArray.push(c);
              break;
          }
        }
        return daysArray;
      }
    };

    var rows = document.querySelectorAll('table.listOfClasses tr');
    var catalog = [];

    // Iterate through the <tr>s starting at index 2 to skip the header rows.
    for (var i = 2; i < rows.length; i++) {

      var course = {};

      // Edge case 1: skip the section-comments that take up entire rows.  
      if ( ! isSubstring(rows[i].className, 'section-comment-course')) { 
        
        // Edge case 2: sometimes UH class listings like to 
        // put in a special note for a class that spans 2 <td>s.
        if (rows[i].cells.length == 2) { 
          course.extraNotes = rows[i].cells[1].textContent;
          i++; 
        }
        course.genEdFocus    =  [];
        // check for `&nbsp;` using char code 0xA0
        course.genEdFocus    =  (rows[i].cells[0].textContent == '\xA0') ? 
                                         [] : 
                                         rows[i].cells[0].textContent.split(',');
        course.crn           =   rows[i].cells[1].textContent;
        course.course        =   rows[i].cells[2].textContent;
        course.sectionNum    =   rows[i].cells[3].textContent;
        course.title         =   rows[i].cells[4].textContent;
        course.credits       =   rows[i].cells[5].textContent;
        course.instructor    =   (rows[i].cells[6].textContent == 'TBA') ? 
                                         'TBA' : 
                                         // get only last name
                                         rows[i].cells[6].textContent.substring(2);
        course.seatsAvail    =   rows[i].cells[7].textContent

        /** 
        THIS IS SUPER HACKY AND I WILL FIX IT I AM SORRY.  During Registration 
        season UH likes to remove the waitlist columns.  rather than deal with it 
        in a smart way I am simply hardcoding the column indices and commenting out
        my old code.  I will fix this eventually but honestly can't be bothered.
        **/

        // setting these to null so it doesnt mess up the mongoose.js schema.
        // fuck.
        // BEGIN OLD CODE WITHOUT WAITLIST COLUMNS 
        // course.waitListed = null;
        // course.waitAvail = null;

        // course.mtgTime       = [];       
        // course.mtgTime.push({
        //                       'days'  : processDayString(rows[i].cells[8].textContent), 
        //                       'start' : getTime('start', rows[i].cells[9].textContent),
        //                       'end'   : getTime( 'end' , rows[i].cells[9].textContent),
        //                       'loc'   : rows[i].cells[10].textContent,
        //                       'dates' : rows[i].cells[11].textContent
        //                     });        
          
        // // If there are additional meeting times, add them.
        // // We can tell this by checking if <tr.class> changes.
        // while (rows[i+1] && rows[i].className === rows[i+1].className) {
        //   i++;
        //   course.mtgTime.push({
        //                         'days'  : processDayString(rows[i].cells[7].textContent),
        //                         'start' : getTime('start', rows[i].cells[8].textContent),
        //                         'end'   : getTime( 'end' , rows[i].cells[8].textContent),
        //                         'loc'   : rows[i].cells[9].textContent,
        //                         'dates' : rows[i].cells[10].textContent
        //                       });        

        // BEGIN OLD CODE WITH WAITLIST COLUMNS FOR USE BEFORE REGISTRATION
        course.waitListed    =   rows[i].cells[8].textContent; 
        course.waitAvail     =   rows[i].cells[9].textContent;

        course.mtgTime       = [];       
        course.mtgTime.push({
                              'days'  : processDayString(rows[i].cells[10].textContent), 
                              'start' : getTime('start', rows[i].cells[11].textContent),
                              'end'   : getTime( 'end' , rows[i].cells[11].textContent),
                              'loc'   : rows[i].cells[12].textContent,
                              'dates' : rows[i].cells[13].textContent
                            });        
          
        // If there are additional meeting times, add them.
        // We can tell this by checking if <tr.class> changes.
        while (rows[i+1] && rows[i].className === rows[i+1].className) {
          i++;
          course.mtgTime.push({
                                // '9' because for some reason theres 1 less <td>
                                // in new columns
                                'days'  : processDayString(rows[i].cells[9].textContent),
                                'start' : getTime('start', rows[i].cells[10].textContent),
                                'end'   : getTime( 'end' , rows[i].cells[10].textContent),
                                'loc'   : rows[i].cells[11].textContent,
                                'dates' : rows[i].cells[12].textContent
                              });
        // END OLD CODE WITH WAITLIST COLUMNS FOR USE BEFORE REGISTRATION
        /**END HACKY CODE**/
        }
        catalog.push(course);
      }

    } // </For>
    return catalog;
  };
}


module.exports = UHFinder;