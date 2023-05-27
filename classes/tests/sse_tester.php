<?php

// Various links
// https://serverfault.com/questions/488767/how-do-i-enable-php-s-flush-with-nginxphp-fpm
// https://stackoverflow.com/questions/72394213/nginx-configuration-for-server-sent-event
// https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
// https://qiita.com/okumurakengo/items/cbe6b3717b95944083a1 (in Japanese)

// If '?SSE' is set, send Server-Sent Events, otherwise we'll display the page.
if ( isset( $_GET['SSE'] ) ) {

  // Set the headers for SSE.
  header( 'Cache-Control: no-cache' );
  header( 'Content-Type: text/event-stream' );
  header( 'X-Accel-Buffering: no' ); // This is useful to disable buffering in nginx through headers.

  // Push data to the browser every second.
  ob_implicit_flush( true );
	ob_end_flush();
  for ( $i = 0; $i < 3; $i++ ) {
    $data = "data: $i";
    echo $data . "\n\n";
    if (  ob_get_level() > 0 ) {
      ob_flush();
    }
    flush();
    error_log( $data );
    sleep( 1 );
  }
  echo "data: Done!\n\n";
}
else {
  ?>
  <h1>Stream / SSE</h1>
  <p>
    I build this code in order to experiment with <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">SSE</a> with PHP as it seems to be tricky to make it work. This idea is that the events below appear every one second, and not all at once.
  </p>
  <h2>Output:</h2>
  <ul id="results"></ul>
  <button onclick="window.location.reload();">Retry</button>
  <script>
    var url = window.location.href;
    var source = new EventSource(url + "?SSE=true");

    source.onmessage = function(event) {
      if (event.data == 'Done!') {
        source.close();
      }
      else {
        document.getElementById("results").innerHTML += "<li>" + event.data + "</li>";
        console.log(event);
      }
    };

    source.onerror = function(event) {
      console.error(event);
    };
  </script>
  <?php
}
