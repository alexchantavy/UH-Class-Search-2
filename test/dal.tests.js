// test.js

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    dal = require('../backend/db-access');
chai.use(require('chai-things'));

describe('Data Access Layer', function() {

  it('should grab all courses from the db', function(done) {
    this.timeout(10000);
    dal.getAllCourses(function(err, docs) {
      expect(err).to.equal(null);
      expect(docs).to.be.an('array');
      expect(docs[0].course).to.be.a('string');
      expect(docs[0].crn).to.be.a('number');
      expect(docs[0].genEdFocus).to.be.an('array');
      expect(docs[0].instructor).to.be.a('string');
      expect(docs[0].mtgTime).to.be.an('array');
      expect(docs[0].mtgTime.length).to.not.equal(0);
      expect(docs[0].mtgTime[0].dates).to.be.a('string');
      expect(docs[0].mtgTime[0].days).to.be.a('string');
      expect(docs[0].mtgTime[0].loc).to.be.a('string');
      expect(docs[0].mtgTime[0].start).to.be.a('string');
      expect(docs[0].mtgTime[0].end).to.be.a('string');
      expect(docs[0].seatsAvail).to.be.a('number');
      expect(docs[0].waitListed).to.be.a('number');
      expect(docs[0].waitAvail).to.be.a('number');
      expect(docs[0].sectionNum).to.be.a('number');
      expect(docs[0].title).to.be.a('string');
      done();
    });
  });

  it('should return classes based on specified filters', function(done) {
    this.timeout(10000);

    var oneFilter = function(next) {
      var opts = {
        course: 'ICS'
      };
      dal.get(opts, function(err, res) {
        for (var i = 0, len = res.length; i < len; i++) {
          expect(res[i].course).to.match(/^ICS/);
        }
        if (next && typeof(next) == 'function') next();
      });
    };

    var multipleFilters = function(next) {
      var opts = {
        course: 'MATH',
        genEdFocus: 'WI',
        genEdFocus: 'O'
      };
      dal.get(opts, function(err, res) {
        for (var i = 0, len = res.length; i < len; i++) {
          expect(res[i].course).to.match(/^MATH/);
          expect(res[i].genEdFocus).to.match(/WI/);
          expect(res[i].genEdFocus).to.match(/OC/);
        }
        if (next && typeof(next) == 'function') next();        
      })
    };

    var runAllTests = function() {
      oneFilter( multipleFilters( done ) );
    };

    runAllTests();
  });
});