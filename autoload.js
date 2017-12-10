
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Fahrzeugtableau - Autoloader
//  -
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

//      -
//      -           Seppels Kill-Switch
//      -

        if( typeof killSwitchTableau !== "undefined" )
        {
            console.log("Fahrzeugtableau durch Sebastian gesperrt!");
        }
        else
        {
            var TableauUrl = "https://tableau.eagledev.de/";
            
//          -
//          -           Google Font
//          -

            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.href = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700";
            document.body.appendChild(styleElement);
//          -
//          -           UI-Creator
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = TableauUrl + "userscript/interface.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Building- & Vehicle Export
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = TableauUrl + "userscript/export.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Vehicle Updater
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = TableauUrl + "userscript/update.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Load Style
//          -

            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.type = "text/css";
            styleElement.media = "screen";
            styleElement.href = TableauUrl + "userscript/interface.css";
            document.body.appendChild(styleElement);
            
        }
