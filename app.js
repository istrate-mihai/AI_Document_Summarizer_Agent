$( document ).ready(() => {

  $('#submit').on('click', () => {
    let content = $('#document-content').val();
    console.dir(content);

    $.ajax({
      url: "https://mihai-septimius-istrate-s-team.abacus.ai/api/executeAgent",
      type: "POST",
      data: JSON.stringify({
        arguments: null,
        keywordArguments: {
          document_content: "hi",
        }
      }),
      contentType: "application/json",
      headers: {
        "Authorization": "Bearer 59f424d5605c4976b8f8680269c5b175"
      },
      success: function(response) {
        console.log("Success:", response);
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });
});

