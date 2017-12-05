describe('GumgaReportNgSpect', function(){
  const mox = angular.mock;

  beforeEach(function(){
    mox.module('ngGumgaReport')
  });

  beforeEach(inject(function($compile, $rootScope) {
    console.log($compile)
  }));


  it('test jasmine', () => {
    expect(true).toEqual(true);
  });

});
