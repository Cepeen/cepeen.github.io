---
title: DCoder
layout: page
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beaufort Autokey Cipher</title>
</head>
<body>
    <label for="message">Enter Text:</label><br>
    <textarea id="message" rows="6" cols="70"></textarea><br>
    <label for="keyword">Enter Keyword:</label>
    <input id="keyword" type="text" id="keyword"><br><br>
    <button onclick="process('encrypt')">Encrypt</button>
    <button onclick="process('decrypt')">Decrypt</button><br><br>
    <label for="output">Result:</label><br>
    <textarea id="output" rows="6" cols="70"></textarea>

         <script src="assets/js/decoder.js"></script>

</body>
</html>
