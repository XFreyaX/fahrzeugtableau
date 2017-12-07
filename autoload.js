
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
//          -
//          -           UI-Creator
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://tableau.eagledev.de/userscript/interface.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Building- & Vehicle Export
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://tableau.eagledev.de/userscript/export.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Vehicle Updater
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://tableau.eagledev.de/userscript/update.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Load Style
//          -

            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.src = "https://tableau.eagledev.de/userscript/interface.css";
            document.body.appendChild(styleElement);
            
        }
