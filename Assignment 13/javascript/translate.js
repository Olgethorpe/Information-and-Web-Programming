var APIkey = "trnsl.1.1.20181126T012536Z.c1675b5eaf1838d0.e670ebd9ba7b667e095017c48daf5fc71775d8b1"
var initFlag = false;

$(document).ready(
  init
);

/**
* Initalize website functionality
*/
function init() {
  $(".subBtn").val("Translate!");
  $(".outputText").prop("disabled", true);
  $(".inputText").val("Input text here");
  detectLanguage($(".inputText").val())
  $(".inputText").change(
    function () {
      detectLanguage($(".inputText").val())
    }
  );
  $(".subBtn").click(
    function () {
      translate()
    }
  )
}

/**
* Detect the language in the input box
*
* @param {string} text The text to detect language
*/
function detectLanguage(text) {
  $.ajax(
    {
      url: "https://translate.yandex.net/api/v1.5/tr.json/detect",
      type: "GET",
      dataType: "JSON",
      data: {
        key: APIkey,
        text: text
      },
      success: function (data) {
        getLangCode(data['lang'])
      },
      error: function (data, txtStat, err) {
        console.log(err)
        console.log(data)
      }
    }
  );
}

function getLangCode(langCode) {
  $.ajax(
    {
      url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs",
      type: "GET",
      dataType: "JSON",
      data: {
        key: APIkey,
        ui: langCode
      },
      success: function (data) {
        if (!initFlag) {
          $.each(data['langs'],
            function (index, value) {
              $(".fromLanguages").append("<option class=\"fromLanguage\" value=" + index + ">" + value + "</option>")
              $(".toLanguages").append("<option class=\"toLanguage\" value=" + index + ">" + value + "</option>")
            }
          )
          initFlag = true;
        }
        $(".fromLanguages").val(langCode).change()
      },
      error: function (data, txtStat, err) {
        console.log(err)
        console.log(data)
      }
    }
  );
}

function translate() {
  $.ajax(
    {
      url: "https://translate.yandex.net/api/v1.5/tr.json/translate",
      type: "GET",
      dataType: "JSON",
      data: {
        key: APIkey,
        text: $(".inputText").val(),
        lang: $(".fromLanguages").val() + "-" + $(".toLanguages").val()
      },
      success: function (data) {
        console.log(data)
        $(".outputText").val(data["text"][0])
      },
      error: function (data, txtStat, err) {
        console.log(err)
        console.log(data)
      }
    }
  );
}
