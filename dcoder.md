---
title: DCoder
layout: page
---
<script src="\assets\js\decoder.js" type="module" defer></script>

Enter Text:


<textarea id="message"></textarea><br><br>

Enter Keyword:
<input id="keyword" type="text"><br><br>

Selected cipher: <select id="cipherSelection">
    <option value="Beaufort">Beaufort</option>
        <option value="Vigenere">Vigenere</option>
    <!-- <option value="Vigenere">Vigenere</option> -->
</select>

<button onclick="process('encrypt')">Encrypt</button>
<button onclick="process('decrypt')">Decrypt</button>
<br><br>

Result:
<textarea id="output"></textarea>


<div id="sidebar">
<p id="sidebar_text"> 


I am experimenting with custom encryption algorithms, which I will publish here.
For now, I have implemented here few of the most popular algorithms, the so-called <a href = "https://en.wikipedia.org/wiki/Beaufort_cipher">Beaufort cipher</a> and <a href = "https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher">Vigenere cipher</a>. The following versions allows you to encode the symbols of the full ASCII table.


 
 
  </p>
  <div id="toggleBtn">&#9664;</div>




<script src="assets/js/decoder.js"></script>
<script src="assets/js/sidebar.js"></script>


