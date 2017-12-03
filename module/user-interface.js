

if (window.location.pathname === "/" || window.location.pathname === "/#")
{
    $(document).ready(function()
    {
        //  KillSwitch wie von Sebastian gewünscht
        /*if( typeof(killSwitchTableau) != "undefinded" )
        {
            return;
        }*/

        createNavbarItem();
        createExportModal();
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
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="#" onclick="Export_Start()">Exportieren</a></li>');
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
        "position":             "fixed",
        "top":                  "0",
        "left":                 "0",
        "right":                "0",
        "z-index":              "1000",
        "background":           "rgba(250,250,250,0.64)"
    }); 
    
    $("#tableau-export-modal").append('<div id="tableau-export-modal-content"></div>');
    $("#tableau-export-modal-content").css(
    {
        "width":                "80%",
        "max-width":            "320px",
        "padding":              "0",
        "margin":               "0",
        "overflow":             "hidden",
        "display":              "flex",
        "flex-flow":            "column nowrap",
        "justify-content":      "center",
        "align-items":          "center",
        "background":           "rgba(250,250,250,1)",
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
    });

    $("#tableau-export-modal-content").append('<section></section>');
}
