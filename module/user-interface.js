// ==UserScript==
// @name        Fahrzeugtableau DEV
// @namespace   Leitstellenspiel
// @description Export der Wachen & Fahrzeuge aus dem LSS zum Fahrzeugtableau
// @downloadURL https://github.com/ChaosKai/fahrzeugtableau/raw/master/user.js
// @include     http*://www.leitstellenspiel.de/*
// @version     dev
// @author      Eagle, ChaosKai93, lost
// @grant       none
// ==/UserScript==

if (window.location.pathname === "/" || window.location.pathname === "/#")
{
    $(document).ready(function()
    {
        createNavbarItem();
        createExportModal();
        
        console.log("Fahrzeugtableau UI geladen");
    });
}


function createNavbarItem()
{
    $('#news_li').before('<li id="tableau_dropdown" class="dropdown"></li>');
    $('#tableau_dropdown').append('<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="tableau_glyph" class="glyphicon glyphicon-ok" style="margin-right: 8px; color: #FFFFFF"></span>Tableau</a>');
    $('#tableau_dropdown').append('<ul class="dropdown-menu" role="menu"></ul>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a id="tableau_state"><b>Status:</b> Bereit</a></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation" class="divider"></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="http://tableau.eagledev.de/login.php?u=' + user_id + '" target="_blank">Öffnen</a></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="#" id="tableau-export-button">Exportieren</a></li>');
}


function createExportModal()
{
    $("body").append('<div id="tableau-export-modal"></div>');
    $("#tableau-export-modal").css(
    {
        "width":                "100%",
        "height":               "100%",
        "padding":              "0",
        "margin":               "0",
        "display":              "none",
        "flex-flow":            "column nowrap",
        "justify-content":      "center",
        "align-items":          "center",
        "position":             "fixed",
        "top":                  "0",
        "left":                 "0",
        "right":                "0",
        "z-index":              "1000",
        "opacity":              "0",
        "background":           "rgba(250,250,250,0.78)"
    });

    $("#tableau-export-modal").append('<div id="tableau-export-modal-content"></div>');
    $("#tableau-export-modal-content").css(
    {
        "width":                "80%",
        "max-width":            "480px",
        "padding":              "0",
        "margin":               "0",
        "overflow":             "hidden",
        "display":              "flex",
        "flex-flow":            "column nowrap",
        "justify-content":      "center",
        "align-items":          "center",
        "background":           "rgba(250,250,250,1)",
        "box-shadow":           "0px 0px 3px 0px rgba(0,0,0,0.32)",
        "border-radius":        "4px"
    });

    $("#tableau-export-modal-content").append('<header>Gebäude- und Fahrzeugexport</header>');
    $("#tableau-export-modal-content").find("header").css(
    {
        "width":                "100%",
        "padding":              "16px 32px",
        "margin":               "0",
        "display":              "flex",
        "justify-content":      "flex-start",
        "align-items":          "center",
        "font-size":            "2rem",
        "font-weight":          "300",
        "border-bottom":        "1px solid #c2c2c2"
    });

    $("#tableau-export-modal-content").append('<section id="tableau-export-modal-buildings"></section>');
    $("#tableau-export-modal-buildings").css(
    {
        "width":                "calc(100% - 96px)",
        "padding":              "16px 32px",
        "margin":               "24px 48px 6px 48px",
        "display":              "flex",
        "flex-flow":            "row nowrap",
        "justify-content":      "flex-start",
        "align-items":          "center",
        "font-size":            "2rem",
        "font-weight":          "300",
        "background":           "#f5f5f5",
        "border":               "1px solid #c2c2c2",
        "border-radius":        "4px"
    });

    $("#tableau-export-modal-content").append('<section id="tableau-export-modal-vehicles"></section>');
    $("#tableau-export-modal-vehicles").css(
    {
        "width":                "calc(100% - 96px)",
        "padding":              "16px 32px",
        "margin":               "6px 48px 24px 48px",
        "display":              "flex",
        "flex-flow":            "row nowrap",
        "justify-content":      "flex-start",
        "align-items":          "center",
        "font-size":            "24px",
        "font-weight":          "300",
        "background":           "#f5f5f5",
        "border":               "1px solid #c2c2c2",
        "border-radius":        "4px"
    });

    $("#tableau-export-modal-buildings").append('<i class="tableau-export-modal-progress-glyph fa fa-hospital-o"></i>');
    $("#tableau-export-modal-vehicles").append('<i class="tableau-export-modal-progress-glyph fa fa-ambulance"></i>');

    $(".tableau-export-modal-progress-glyph").each(function()
    {
        $(this).css(
        {
            "width":                "24px",
            "margin-right":         "6px",
            "font-size":            "18px"
        });
    });

    $("#tableau-export-modal-buildings").append('<div class="tableau-export-modal-progress-name">Gebäude</div>');
    $("#tableau-export-modal-vehicles").append('<div class="tableau-export-modal-progress-name">Fahrzeuge</div>');

    $(".tableau-export-modal-progress-name").each(function()
    {
        $(this).css(
        {
            "width":                "calc(100% - 30px - 100px)",
            "padding":              "6px 16px",
            "font-size":            "16px"
        });
    });

    $("#tableau-export-modal-buildings").append('<div id="tableau-export-modal-buildings-progress-value" class="tableau-export-modal-progress-value">10 / 60</div>');
    $("#tableau-export-modal-vehicles").append('<div id="tableau-export-modal-vehicles-progress-value" class="tableau-export-modal-progress-value">50 / 2000</div>');

    $(".tableau-export-modal-progress-value").each(function()
    {
        $(this).css(
        {
            "width":                "100px",
            "padding":              "6px 0px",
            "display":              "flex",
            "flex-flow":            "row nowrap",
            "justify-content":      "flex-end",
            "align-items":          "center",
            "font-size":            "12px"
        });
    });
}
