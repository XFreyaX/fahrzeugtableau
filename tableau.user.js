// ==UserScript==
// @name        Fahrzeugtableau
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     dev
// @author      Eagle, ChaosKai93, lost
// @grant       none
// ==/UserScript==

var scriptElement = document.createElement("script");
scriptElement.type = "text/javascript";
scriptElement.src = "https://github.com/ChaosKai/fahrzeugtableau/blob/master/tableau.dev.js";
document.body.appendChild(scriptElement);
