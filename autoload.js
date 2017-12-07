
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
            //scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/user-interface.js";
            scriptElement.src = "https://tableau.eagledev.de/lss-bridge/user-interface.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Building- & Vehicle Export
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            //scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/export.js";
            scriptElement.src = "https://tableau.eagledev.de/lss-bridge/export.js";
            document.body.appendChild(scriptElement);

//          -
//          -           Vehicle Updater
//          -

            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            //scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/update.js";
            scriptElement.src = "https://tableau.eagledev.de/lss-bridge/update.js";
            document.body.appendChild(scriptElement);
            
        }
