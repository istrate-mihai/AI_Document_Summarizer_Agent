let isEnterTextPanelVisible  = true;
let isUploadFilePanelVisible = false;

function setupResponseDisplay(display) {
  $('#response').css('display', display);
  $('#result-title').css('display', display);
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

function sendRequest(content, fetchUrl) {

  let jResponse = $('#response');
  let spinner   = $('#spinner');

  if (content.trim() === '') {
    jResponse.html('Empty content, please provide a text.');
    setupResponseDisplay('inline-block');
    spinner.css('display', 'none');
    return;
  }

  console.log(fetchUrl + '/execute');
  const fetchPromise = fetch(fetchUrl + '/execute', {
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
    setupResponseDisplay('inline-block');
    $('#response').css('display', 'inline-block');
  })
  .catch(error => {
    if (typeof error != 'undefined') {
      spinner.css('display', 'none');
      console.error('Error: ', error);
    }
  });
};

$(document).ready(() => { 
  // Initialize pdf.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  let fetchUrl = $('#api_url').data('url');

  $('#sendRequest').on('click', event => {
    event.preventDefault();
      
    let jResponse = $('#response');
    let spinner   = $('#spinner');

    jResponse.html('');
    spinner.css('display', 'block');
    setupResponseDisplay('none');

    let content = '';

    if (isEnterTextPanelVisible) {
      content = $('#document-content').val();
      content = escapeHTML(content);
      sendRequest(content, fetchUrl);
    }

    // Process uploaded file content
    if (isUploadFilePanelVisible) {
      let file = $('#formFile')[0].files[0];

      if (file) {
        let reader = new FileReader();

        reader.onload = function(e) {
          if (file.type === 'application/pdf') {
            // Convert file to ArrayBuffer
            const arrayBuffer = e.target.result;

            // Load PDF document using pdf.js
            pdfjsLib.getDocument(arrayBuffer).promise.then(function(pdf) {
              // Get all pages text
              let pagesText = '';

              // Loop through each page
              for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(function(page) {
                  return page.getTextContent();
                }).then(function(textContent) {
                  // Extract text from the page
                  const pageText = textContent.items.map(item => item.str).join(' ');
                  pagesText += pageText + '\n';
                  
                  // If this is the last page, log the complete text
                  if (pageNum === pdf.numPages) {
                    content = pagesText;
                  }
                  sendRequest(content, fetchUrl);
                });
              }
            }).catch(function(error) {
              console.error("Error loading PDF:", error);
            });
          }

          if (file.type === 'text/plain') {
            content = e.target.result;
            sendRequest(content, fetchUrl);
          };
        }

        reader.onerror = function(e) {
          alert('Error reading file');
        }

        if (file.type === 'application/pdf') {
          reader.readAsArrayBuffer(file);
        }

        if (file.type === 'text/plain') {
          reader.readAsText(file);
        }
      }
      else {
        alert('Please select a file.');
      }
    }
  });

  // Get all tab buttons and panels
  let tabButtonList = $('.tab-btn');
  let tabPanelList  = $('.tab-panel');

  // Add click event listener to each button
  tabButtonList.each((index, tabButton) => {
    let jTabButton = $(tabButton);
    jTabButton.on('click', () => {
      // Remove active class from all buttons and panels
      tabButtonList.each((index, btn) => $(btn).removeClass('active'));
      tabPanelList.each((index, panel) => $(panel).removeClass('active'));

      // Add active class to clicked button
      jTabButton.addClass('active');

      // Show corresponding panel
      let tabId = jTabButton.data('tab');
      $('.tab-panel[data-tab="' + tabId + '"]').addClass('active');

      isEnterTextPanelVisible  = !isEnterTextPanelVisible;
      isUploadFilePanelVisible = !isUploadFilePanelVisible;
    });
  });

  $('.clear-result').on('click', function() {
    setupResponseDisplay('none');
  });
});
