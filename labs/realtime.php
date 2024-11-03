<?php
//require_once(dirname(__FILE__) . '/../../../wp-load.php');

$wpLoad = dirname(__FILE__) . 'wp-load.php';
echo $wpLoad;
require_once(dirname(__FILE__) . './wp-load.php');

// WebSocket server settings
$host = '0.0.0.0'; // Bind to all IPs (adjust as necessary)
$port = 8080;       // Port for WebSocket server (adjust as necessary)

// Create a WebSocket server socket
$server = stream_socket_server("tcp://$host:$port", $errno, $errstr);

if (!$server) {
  die("Error creating server: $errstr ($errno)\n");
}

echo "WebSocket server started at $host:$port\n";

$clients = [];

// Main loop to accept incoming WebSocket connections and handle messages
while (true) {
  // Prepare an array of streams to check for new activity
  $read = array_merge([$server], $clients);
  $write = null;
  $except = null;

  if (stream_select($read, $write, $except, null) > 0) {
    // Check for new connections
    if (in_array($server, $read)) {
      $client = stream_socket_accept($server);

      if ($client) {
        // Perform WebSocket handshake
        $request = fread($client, 1024);
        preg_match('#Sec-WebSocket-Key: (.*)\r\n#', $request, $matches);
        $key = base64_encode(pack('H*', sha1($matches[1] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
        
        $handshakeResponse = 
          "HTTP/1.1 101 Switching Protocols\r\n" .
          "Upgrade: websocket\r\n" .
          "Connection: Upgrade\r\n" .
          "Sec-WebSocket-Accept: $key\r\n\r\n";
        
        fwrite($client, $handshakeResponse);
        $clients[] = $client;

        echo "New client connected!\n";

        // Send welcome message to the client
        $site_name = get_bloginfo('name');
        $welcome_message = "Welcome to $site_name server";
        $response = encodeWebSocketData($welcome_message);
        fwrite($client, $response);
      }

      unset($read[array_search($server, $read)]);
    }

    // Handle existing client messages
    foreach ($read as $client) {
      $data = fread($client, 1024);
      
      if (!$data) {
        fclose($client);
        unset($clients[array_search($client, $clients)]);
        echo "Client disconnected.\n";
        continue;
      }

      // Decode WebSocket message
      $decodedData = decodeWebSocketData($data);
      echo "Received: $decodedData\n";

      // Echo back the message to the client
      $response = encodeWebSocketData("Echo: $decodedData");
      fwrite($client, $response);
    }
  }
}

// Function to decode WebSocket frame
function decodeWebSocketData($data) {
  $unmaskedPayload = '';
  $decodedData = unpack('H*', $data);
  $bytes = $decodedData[1];

  $mask = [
    hexdec(substr($bytes, 4, 2)),
    hexdec(substr($bytes, 6, 2)),
    hexdec(substr($bytes, 8, 2)),
    hexdec(substr($bytes, 10, 2))
  ];

  $data = substr($bytes, 12);
  for ($i = 0; $i < strlen($data); $i += 2) {
    $unmaskedPayload .= chr($mask[($i / 2) % 4] ^ hexdec(substr($data, $i, 2)));
  }

  return $unmaskedPayload;
}

// Function to encode WebSocket frame
function encodeWebSocketData($data) {
  $frame = [];
  $frame[0] = 129;
  $length = strlen($data);

  if ($length <= 125) {
    $frame[1] = $length;
  } else if ($length >= 126 && $length <= 65535) {
    $frame[1] = 126;
    $frame[2] = ($length >> 8) & 255;
    $frame[3] = $length & 255;
  }

  for ($i = 0; $i < $length; $i++) {
    $frame[] = ord($data[$i]);
  }

  return call_user_func_array('pack', array_merge(['C*'], $frame));
}
