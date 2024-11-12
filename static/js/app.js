function setupResponseDisplay(visibility) {
  $('#response').css('visibility', visibility);
  $('#result-title').css('visibility', visibility);
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return escape[match];
  });
}

$(document).ready(() => {
  $('#sendRequest').on('click', event => {
    event.preventDefault();
  
    let content   = $('#document-content').val();
    content       = escapeHTML(content);
    let jResponse = $('#response');
    let spinner   = $('#spinner');

    spinner.css('display', 'block');
    jResponse.html('');
    setupResponseDisplay();
    setupResponseDisplay('hidden');

    if (content.trim() === '') {
      jResponse.html('Empty content, please provide a text.');
      setupResponseDisplay('visible');
      spinner.css('display', 'none');
      return;
    }

    const fetchPromise = fetch('http://127.0.0.1:5000/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        document_content: content,
      }),
    });

    fetchPromise
    .then(response => response.json())
    .then(data => {
      jResponse.html(JSON.stringify(data.segments[0].segment, null, 2).replace(/\\/g, ''));
      spinner.css('display', 'none');
      setupResponseDisplay('visible');
    })
    .catch(error => {
      spinner.css('display', 'none');
      console.error('Error: ', error);
    });
  });
});
