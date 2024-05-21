---
title: Wakey! Wakey!
---

Wakey! Wakey! is a simple wake on lan client created with futter in Dart language. The core of the application was developed in one evening (a single button that sends a magic packet to the selected host machine). The app I was using for this purpose lost this functionality, so I decided, to create my own solution. Now, it is a functional phone app for everyone. Standard features have been added, such as input forms that allow you to enter the necessary data (IP and MAC address) and hostname. The app uses shared preferences to store the provided data as objects. For this purpose, the data is converted to strings using JSON. This solution is sufficient for this purpose. I also implemented formatting of the input data to prevent user confusion. To do this, I used simple regular expressions to check the correctness of the format (32 and 48-bit numbers) and forced the user, to enter the full length of the strings. If any of the conditions, are not met, an error message will appear. The default port is rigidly set to 9. 

The application has a scheduler. You can set the time when the magic packet is sent. Unfortunately, at this point, this feature does not work in the background (with the screen off).

**[Here is GitHub repository](http://github.com/Cepeen/wakey-wakey)**
