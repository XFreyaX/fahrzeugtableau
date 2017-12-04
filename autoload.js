
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
            return false;
        }

//      -
//      -           UI-Creator
//      -

        var scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/user-interface.js";
        document.body.appendChild(scriptElement);

//      -
//      -           Building- & Vehicle Export
//      -

        var scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/export.js";
        document.body.appendChild(scriptElement);

//      -
//      -           Vehicle Updater
//      -

        var scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = "https://rawgit.com/ChaosKai/fahrzeugtableau/master/module/update.js";
        document.body.appendChild(scriptElement);
