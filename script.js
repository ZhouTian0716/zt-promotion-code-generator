function random_storeId(storeIds) {
  return storeIds[Math.floor(Math.random() * storeIds.length)];
}

function random_transactionId(transactionIds) {
  return transactionIds[Math.floor(Math.random() * transactionIds.length)];
}

// TODO: Modify this function
function generateShortCode(storeId, transactionId) {
  // Logic goes here
  var date = new Date().getTime();
  var uuid = "x".replace(/[xy]/g, function (c) {
    var appendedID = "" + storeId.toString().length + transactionId.toString().length + storeId + transactionId;
    var sar = ["0", "00", "000", "0000", "00000", "000000", "0000000"];
    var das = [1, 10, 100, 1000, 10000, 100000, 1000000];
    var l = 9 - appendedID.length - 2;
    var docketNumber = 0;
    if ((appendedID.length = 9)) {
      docketNumber = appendedID;
    }
    if (appendedID.length < 9) {
      var randomnumber = Math.floor(Math.random() * (9 - appendedID.length - das[l + 1] + 1)) + das[l + 1];
      docketNumber = "" + appendedID + (9 - appendedID.length) + randomnumber;
    }
    //return docketNumber;
    return c == "x" ? docketNumber : 0o0;
  });
  return uuid;
}

// TODO: Modify this function
function decodeShortCode(shortCode) {
  // Logic goes here
  var sLen = shortCode.substring(0, 1);
  var tLen = shortCode.substring(1, 2);
  var iLen = sLen + tLen;
  return {
    storeId: parseInt(shortCode.substring(iLen.length, parseInt(sLen, 10) + iLen.length), 10), // store id goes here,
    shopDate: new Date(), // the date the customer shopped,
    transactionId: parseInt(
      shortCode.substring(parseInt(sLen, 10) + iLen.length, iLen.length + parseInt(sLen, 10) + parseInt(tLen, 10)),
      10
    ), // transaction id goes here
  };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {
  var storeIds = [175, 42, 0, 9];
  var transactionIds = [9675, 23, 123, 7];

  storeIds.forEach(function (storeId) {
    transactionIds.forEach(function (transactionId) {
      var shortCode = generateShortCode(storeId, transactionId);
      var decodeResult = decodeShortCode(shortCode);
      $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
      AddTestResult("Length <= 9", shortCode.length <= 9);
      AddTestResult("Is String", typeof shortCode === "string");
      AddTestResult("Is Today", IsToday(decodeResult.shopDate));
      AddTestResult("StoreId", storeId === decodeResult.storeId);
      AddTestResult("TransId", transactionId === decodeResult.transactionId);
    });
  });
}

function IsToday(inputDate) {
  // Get today's date
  var todaysDate = new Date();
  // call setHours to take the time out of the comparison
  return inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0);
}

function AddTestResult(testName, testResult) {
  var div = $("#test-results").append(
    "<div class='" +
      (testResult ? "pass" : "fail") +
      "'><span class='tname'>- " +
      testName +
      "</span><span class='tresult'>" +
      testResult +
      "</span></div>"
  );
}
