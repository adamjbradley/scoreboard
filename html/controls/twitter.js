
$sb(function() {
  var sbTwitter = $sb("Viewers.Twitter");
  $("button.Login").click(function() { sbTwitter.$sb("Start").$sbSet(window.location.href); }).button();
  $("button.Logout").click(function() { sbTwitter.$sb("Stop").$sbSet("true"); }).button();
  $("p.DirectTweet button.Tweet").click(function() {
    sbTwitter.$sb("Tweet").$sbSet($("p.DirectTweet input:text.Tweet").val());
    $("p.DirectTweet input:text.Tweet").val("").focus();
  }).button();
  $("p.DirectTweet input:text.Tweet").keydown(function(event) {
    if (event.which == 13) // Pressed Enter
      $("p.DirectTweet button.Tweet").click();
  });
  sbTwitter.$sb("ScreenName").$sbElement("p.LogInStatus span.ScreenName");
  sbTwitter.$sb("Authorized").$sbBindAndRun("content", function(event, value) {
    $("button.Login").button("option", "disabled", isTrue(value));
    $("button.Logout").button("option", "disabled", !isTrue(value));
    $("p.DirectTweet button.Tweet").button("option", "disabled", !isTrue(value));
    $("p.DirectTweet input:text.Tweet").prop("disabled", !isTrue(value));
    $("p.LogInStatus").toggleClass("LoggedIn", isTrue(value));
  });
  sbTwitter.$sb("Error").$sbElement("p.Error a.Error");
  sbTwitter.$sb("Error").$sbBindAndRun("content", function(event, value) {
    $("p.Error").toggleClass("Show", !!value);
  });
  sbTwitter.$sb("Status").$sbBindAndRun("content", function(event, value) {
    if (value)
      $("<a>").html(value).append("<br>").prependTo("p.StatusUpdates");
  });
  $("p.AddConditionalTweet button.Add").click(function() {
    var condition = $("p.AddConditionalTweet input:text.Condition").val();
    var tweet = $("p.AddConditionalTweet input:text.Tweet").val();
    var updateE = _crgScoreBoard.toNewElement(sbTwitter.$sb("ConditionalTweet"));
    _crgScoreBoard.createScoreBoardElement(updateE, "Condition", null, condition);
    _crgScoreBoard.createScoreBoardElement(updateE, "Tweet", null, tweet);
    _crgScoreBoard.updateServer(updateE);
    $("p.AddConditionalTweet input:text").val("").filter(".Condition").focus();
  });
  $("p.AddConditionalTweet input:text.Tweet").keydown(function(event) {
    if (event.which == 13) // Pressed Enter
      $("p.AddConditionalTweet button.Add").click();
  });
  sbTwitter.$sbBindAddRemoveEach("ConditionalTweet", function(event, node) {
    var tr = $("table#ConditionalTweets>tbody>tr.ConditionalTweet.Template").clone(true)
      .removeClass("Template").attr("data-UUID", node.$sbId)
      .appendTo("table#ConditionalTweets>tbody");
    node.$sb("Condition").$sbElement(tr.find("span.Condition"));
    node.$sb("Tweet").$sbElement(tr.find("span.Tweet"));
    tr.find("button.Remove").click(function() { node.$sbRemove(); });
  }, function(event, node) {
    $("table#ConditionalTweets tr.ConditionalTweet[data-UUID='"+node.$sbId+"']").remove();
  });
  $("div.ShowFormatSpecifiersDialog").dialog({
    title: "Conditional Tweet rules help",
    modal: true,
    width: 750,
    height: 550,
    autoOpen: false,
    buttons: { Close: function() { $(this).dialog("close"); } }
  });
  $("button.Help").click(function() {
    $("div.ShowFormatSpecifiersDialog").dialog("open");
  });

  if (_windowFunctions.hasParam("denied")) {
    sbTwitter.$sb("Denied").$sbSet("true");
    window.location.replace("http://"+window.location.host+window.location.pathname);
  }
  var oauth_verifier = _windowFunctions.getParam("oauth_verifier");
  if (oauth_verifier) {
    sbTwitter.$sb("SetOAuthVerifier").$sbSet(oauth_verifier);
    window.location.replace("http://"+window.location.host+window.location.pathname);
  } else {
    sbTwitter.$sb("AuthorizationURL").$sbBindAndRun("content", function(event, value) {
      if (value) {
        $sb(this).$sbSet("");
        window.location.assign(value);
      }
    });
  }
});
