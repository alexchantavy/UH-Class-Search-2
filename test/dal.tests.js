// test.js

var chai = require('chai'),
  expect = chai.expect,
  dal = require('../backend/db-access');


describe('Data Access Layer', function() {

  describe('getAllCourses()', function() {
    it('should grab all courses from the db', function(done) {

      dal.getAllCourses(function(err, docs) {
        expect(err).to.equal(null);
        expect(docs).to.be.an('array');
        expect(docs[0].course).to.be.a('string');
        expect(docs[0].crn).to.be.a('number');
        expect(docs[0].genEdFocus).to.be.a('string');
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
  });

});