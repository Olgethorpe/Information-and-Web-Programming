function requestData(url, callbacks) {
  $.ajax(
    {
      url: url,
      type: "GET",
      dataType: "JSON",
      error: function(data, txtStat, err) {
        console.log(data);
        console.log(txtStat);
        console.log(err);
      },
      success: function(data) {
        $(callbacks).each(function(key, val) { val(data); } );
      }
    }
  )
}
