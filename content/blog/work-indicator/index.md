---
title: "Work Indicator"
date: "2018-03-19"
tags: 
  - "Code"
---

I'm going to take a break from status windows for a little bit to cover my [WorkIndicator](https://github.com/ckaczor/WorkIndicator) project.

I've been working remotely for almost 14 years now and my family found it hard to tell when I was working or on the phone. It often looks the same whether I'm working or not - I'm sitting at my computer, sometimes with my headset on. At some point I came across a [blog post](https://www.hanselman.com/blog/IsDaddyOnACallABusyLightPresenceIndicatorForLyncForMyHomeOffice.aspx) by Scott Hanselman that described hooking up a status light to Lync and I was inspired to create something similar.

The first task was to find something I could use as a status light - after some research I settled on a [USB HID Green/Yellow/Red Visual Indicator](https://www.delcomproducts.com/productdetails.asp?PartNumber=907241) from Delcom. I liked that it had a stoplight design and it came with a C# sample - perfect!

My main workflow is to connect to my work system using Microsoft Remote Desktop so the easiest way to detect if I am working or not is to look for the remote desktop window. I created a class that uses SetWinEventHook to get ObjectCreate, ObjectDestroy, and ObjectNameChanged events and watch for a window with the title of my remote desktop window. If the window was found I'd set the indicator lights to yellow, otherwise I'd set them to green. Lately I've been using a VM as well so I updated the code to be able to look for multiple window titles - if any of them are detected the light is set to yellow.

Originally there was also Skype integration - I was able to use the Skype API to detect if I was on a call and if the call was muted. If I was on a muted call the right light would be on, and if I wasn't muted the red light would blink. This made it easy for the kids to tell how quiet they needed to be when coming into the room. Unfortunately Skype no longer supports this API (and I'm not using Skype anymore anyways) so I removed this code from the project.

The application also has a tray icon with a menu so I can manually set my status - for example, I can select "talking" and the red light will blink. This is my workaround until I come up with something that'll work for my current phone setup.
