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
scriptElement.src = "https://raw.githubusercontent.com/ChaosKai/fahrzeugtableau/master/tableau.dev.js";
document.body.appendChild(scriptElement);
