// We may keep this somewhere else, but for now it's here.
const secret = "v&6HVd^A%83hsfDpE!XIcq_yje#Wxgw2oSB4($l?P9Z7On0i+@5MTbkGaLF)RUKQY1zJrCN*utm";

// helper function to DECODE
function getNumberFromCode(code) {
  let number = 0;
  for (let i = 0; i < code.length; i++) {
    number = number * secret.length + secret.indexOf(code.charAt(i));
  }
  return number;
}

// helper function to ENCODE
function getCodeFromNumber(number, length) {
  let code = "";
  while (number > 0) {
    const remainder = number % secret.length;
    code = secret.charAt(remainder) + code;
    number = Math.floor(number / secret.length);
  }

  // in case the code is not long enough, pad it with the first character
  while (code.length < length) {
    code = secret.charAt(0) + code;
  }
  return code;
}

// ENCODE LOGICS HERER
function generateShortCode(storeId, customerId) {
  // we may want to add some validation for storeId and customerId
  const storeCode = getCodeFromNumber(storeId, 2); // 2 char for storeId, 75^2 should be ok for [1,200]
  const customerCode = getCodeFromNumber(customerId, 3); // 2 char for storeId, 75^3 should be ok for [1,10000]

  const timestamp = Math.floor(new Date().getTime() / 1000); // 获取当前时间戳

  // try to get the meaningful timestamp range smaller, 1687930042 here can be changed to any other number
  const partsToStore = timestamp - 1687930042;

  const timestampCode = getCodeFromNumber(partsToStore, 4); // 用4个字符存储映射后的时间戳

  let result = storeCode + timestampCode + customerCode;

  if (result.length > 9) {
    throw new Error("Generated random string exceeds the maximum length of 9 secret.");
  }

  while (result.length < 9) {
    let randomIndex = Math.floor(Math.random() * secret.length);
    result += secret.charAt(randomIndex);
  }

  return result;
}

// DECODE LOGICS HERER
function decodeShortCode(shortCode) {
  const storeCode = shortCode.substr(0, 2);
  const timestampCode = shortCode.substr(2, 4);
  const customerCode = shortCode.substr(6, 3);

  const storeId = getNumberFromCode(storeCode);
  const customerId = getNumberFromCode(customerCode);
  const timestampPrefix = getNumberFromCode(timestampCode) + 1687930042; // reverse the timestamp

  return {
    storeId: storeId,
    transactionId: customerId,
    shopDate: new Date(timestampPrefix * 1000),
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
