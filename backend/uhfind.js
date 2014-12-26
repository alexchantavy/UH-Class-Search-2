// this module is meant to be run from phantomjs and not node!


/*
 fetchCourses

  // get all classes in given department, return data to a callback.
 Scrapes the UH catalog webpage of the given campus and the given department and
 if successful returns data to a callback.

 @param campus The 3 character code used by UH's catalog url to identify a
 campus, e.g. 'MAN' = UH Manoa, 'KAP' = Kapiolani Community College, etc.

 @param dept The 2-4 character code used by UH's catalog url to identify a
 department, e.g. 'ICS' = Computer Science, 'MATH' = Math... etc.

 @param callback(error, data):  A callback function that handles error from this
 function or processes results of the query.
*/
function fetchCourses( campus, dept, callback ) {

  if ( campus != 'HON' && campus != 'KAU' && campus != 'LEE' &&
       campus != 'HIL' && campus != 'MAN' && campus != 'KAP' &&
       campus != 'MAU' && campus != 'WOA' && campus != 'WIN' &&
       campus != 'HAW' ) {
      callback('campus field ' + campus + ' is invalid');
   }

  if ( typeof callback != 'function' ) {
    callback('callback argument is not a function');
  }

  var page = require('webpage').create();


  var url = 'https://www.sis.hawaii.edu/uhdad/avail.classes?i=' + campus + '&t=201530&s=' + dept;

  page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
  };

  page.open(url, function(status) {
    if (status === 'success') {
      console.log('opened ' + url);
      var includeWaitListColumns = true;
      var result = page.evaluate( scrapeDom
                                , includeWaitListColumns
                                , campus );

      callback(null, result);

    } else {
      callback(page.reason_url + " " + page.reason); 
    }

  });

  // scrape dat DOM.  private helper function.
  var scrapeDom = function( includeWaitListColumns, campus ) {

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
    var row_len = rows.length;
    for (var i = 2; i < row_len; i++) {
      console.log(i);
      var course = {};
      course.campus = campus;
      // Edge case 1: skip the section-comments that take up entire rows.  
      if ( ! isSubstring(rows[i].className, 'section-comment-course') &&
             rows[i].cells.length != 1 ) { 
        
        // Edge case 2: sometimes UH class listings like to 
        // put in a special note for a class that spans 1 or 2 <td>s.
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

        // setting these to null so it doesnt mess up the mongoose.js schema.
        // fuck.
        if ( !includeWaitListColumns) {
          // BEGIN CODE WITHOUT WAITLIST COLUMNS 
          course.waitListed = null;
          course.waitAvail = null;

          course.mtgTime       = [];       
          course.mtgTime.push({
                                'days'  : processDayString(rows[i].cells[8].textContent), 
                                'start' : getTime('start', rows[i].cells[9].textContent),
                                'end'   : getTime( 'end' , rows[i].cells[9].textContent),
                                'loc'   : rows[i].cells[10].textContent,
                                'dates' : rows[i].cells[11].textContent
                              });        
            
          // If there are additional meeting times, add them.
          // We can tell this by checking if <tr.class> changes.
          while (rows[i+1] && rows[i].className === rows[i+1].className) {
            i++;
            course.mtgTime.push({
                                  'days'  : processDayString(rows[i].cells[7].textContent),
                                  'start' : getTime('start', rows[i].cells[8].textContent),
                                  'end'   : getTime( 'end' , rows[i].cells[8].textContent),
                                  'loc'   : rows[i].cells[9].textContent,
                                  'dates' : rows[i].cells[10].textContent
                                });    
          }    
        } else {
          // BEGIN CODE WITH WAITLIST COLUMNS 

          // Edgecase 3: the CCs have an extra column called 'Curr Enrolled',
          // but UHM doesn't have this column.
          var offset = (campus == 'MAN')? 7 : 8;
          course.seatsAvail    =   rows[i].cells[offset].textContent;
          course.waitListed    =   rows[i].cells[offset+1].textContent; 
          course.waitAvail     =   rows[i].cells[offset+2].textContent;

          course.mtgTime       = [];       
          course.mtgTime.push({
                                'days'  : processDayString(rows[i].cells[offset+3].textContent), 
                                'start' : getTime('start', rows[i].cells[offset+4].textContent),
                                'end'   : getTime( 'end' , rows[i].cells[offset+4].textContent),
                                'loc'   : rows[i].cells[offset+5].textContent,
                                'dates' : rows[i].cells[offset+6].textContent
                              });        
           

          // If there are additional meeting times, add them.
          // We can tell this by checking if <tr.class> changes.
          var hasAdditionalMeetingTimes = function(_campus) {
            if (_campus == 'MAN') {
              return rows[i+1] && rows[i].className === rows[i+1].className;
            } else {
              return rows[i+1] && 
                     rows[i].className === rows[i+1].className &&
                     rows[i].cells.count == rows[i+1].cells.count-1;
            }  
          };

          while ( hasAdditionalMeetingTimes(campus) ) {
            i++;
            course.mtgTime.push({
                                  // offset is down by 1 because for some reason theres 1 less <td>
                                  // in new columns
                                  'days'  : processDayString(rows[i].cells[offset+2].textContent),
                                  'start' : getTime('start', rows[i].cells[offset+3].textContent),
                                  'end'   : getTime( 'end' , rows[i].cells[offset+3].textContent),
                                  'loc'   : rows[i].cells[offset+4].textContent,
                                  'dates' : rows[i].cells[offset+5].textContent
                                });
          // END CODE WITH WAITLIST COLUMNS
          }
        }
        catalog.push(course);
      }

    } // </For>
    return catalog;
  };
}


module.exports = fetchCourses;