// allowed buildings (true) are sent to the php script, denied buildings (false) are not
var allowedBuildings = {
        0: true,    // firestation
        1: false,   // fireschool
        2: true,    // medical station
        3: false,   // medical school
        4: false,   // hospital
        5: true,    // medial helicopter
        6: true,    // police station
        8: false,   // police school
        9: true,    // THW
        10: false,  // THW school
        11: true,   // BePo
        12: true,   // SEG 
        13: true,    // police helicopter
        14: false,   // Bereitstellungsraum
        15: true     // Wasserrettung
    };

// returns the cars of the given station as a JSON Array
function getCarsByStation(stationElement) {
    var tempCarData = [];
    // iterate through all cars of the given station
    $(stationElement).find('.building_list_vehicles').find('li').each(function() {
        // add car information to a temporary array
        tempCarData.push({
            id: parseInt($(this).attr('vehicle_id'), 10),
            carType: parseInt($(this).find('[vehicle_type_id]').attr('vehicle_type_id')),
            name: $(this).find('[vehicle_type_id]').html().trim(),
            status: parseInt($(this).find('.building_list_fms').html().trim(), 10)
        });
    });
    // return the temporary array
    return tempCarData;
}

// returns all stations
function getStations() {
    var tempStationData = [];
    // iterate through all buildings
    $('#building_list').find('.building_list_li').each(function() {
        // check if building should be sent
        if (allowedBuildings[$(this).attr('building_type_id')] === true) {
            var stationId = parseInt($(this).find('.building_marker_image').attr('building_id'), 10);
            // add station information to a temporary array
            tempStationData.push({
                id: stationId,
                name: $(this).find('.map_position_mover').html().trim(),
                buildingType: parseInt($(this).attr('building_type_id'), 10),
                cars: getCarsByStation($(this))
            });
        }
    });
    // return the temporary array
    return tempStationData;
}

// sends the given data via POST request to the tableau
function sendData(data) {
    $("#tableau_glyph").attr("class", "glyphicon glyphicon-refresh");
    $.ajax({
        url: 'https://tableau.fbmf.de/input.php',
        method: 'POST',
        data: {
            'stationData': data
        },
        success: function(resultData) {
            // log success
            console.log("All stations have been transmitted");
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-ok");
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
        }
    });
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//
//                  Neue UPDATE Funktion 24.12.2016
//
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// Hier werden die sichbaren Fahrzeuge gespeichert
var UpdateQueue = [];
var UpdateState = "idle";

//
//                  ##### Export Manager #####
//

function UpdateVehicles()
{
    // prioritize ExportAll
    if(ExportState != "idle")
    {
        UpdateState = "idle";
        return;
    }
    
    switch(UpdateState)
    {
        case "start":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Sichtbare Fahrzeuge abrufen...');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-download");

            // set new state
            UpdateState = "fetching";

            // call function
            Update_GetVisibleVehicles();
            break;
            
        case "fetched":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Fahrzeugdaten sammeln...');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-search");

            // set new state
            UpdateState = "collecting";

            // call function
            Update_CollectVehicles();
            break;
            
        case "collected":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Fahrzeuge senden...');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-upload");

            // call function
            Update_SendVehicles();
            
            break;
            
        case "sent":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Fahrzeuge gesendet');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-ok");

            // set new state
            UpdateState = "idle";
            break;
            
        default:
            UpdateState = "idle";
    }
}

//
//                  Update starten
//

function Update_Start()
{
    if(UpdateState == "idle")
       UpdateState = "start";
}

//
//                  Sichtbare Fahrzeuge vom Tableau abrufen
//

function Update_GetVisibleVehicles()
{
    //  reset queue
    UpdateQueue = [];
    
    //  get visible vehicles
    $.ajax({
        url: 'https://tableau.fbmf.de/ajax/export.php',
        method: 'POST',
        data: {
            'user_id': user_id,
            'action': 'get_visible_vehicles'
        },
        success: function(resultData) {
            // 
            UpdateQueue = JSON.parse(resultData);
            // log success
            console.log("get " + UpdateQueue.vehicles.length + " visible vehicles");
            // trigger update manager
            UpdateState = "fetched";
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            $("#tableau_state").html('<b>Status:</b> Error');
            // trigger update manager
            UpdateState = "error";
        }
    });
}

function Update_CollectVehicles()
{
    //  get visible vehicles
    for (var i = 0; i < UpdateQueue.vehicles.length; i++)
    {
        var Vehicle = $("#vehicle_list_" + UpdateQueue.vehicles[i].id);
        UpdateQueue.vehicles[i].status = parseInt($(Vehicle).find('.building_list_fms').html().trim(), 10);
    }
    
    UpdateState = "collected";
}

function Update_SendVehicles()
{
    $.ajax({
        url: 'https://tableau.fbmf.de/ajax/import.php',
        method: 'POST',
        data: {
            'user_id': user_id,
            'action': 'update_vehicles',
            'vehicles': UpdateQueue.vehicles
        },
        success: function(resultData) {
            // log success
            console.log("sent " + UpdateQueue.vehicles.length + " vehicles with update");
            // trigger update manager
            UpdateState = "sent";
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            $("#tableau_state").html('<b>Status:</b> Update Error');
        },
        complete: function() {
            // Warteschlange leeren
            UpdateQueue = [];
        }
    });
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//
//                  Neue EXPORT Funktion 22.12.2016
//
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// Hier werden die verbleibenden, noch zu exportierenden Gebäude gespeichert
var ExportQueue = [];
var ExportState = "idle";

//
//                  ##### Export Manager #####
//

function ExportAll()
{
    switch(ExportState)
    {
        case "start":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Sammeln...');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-search");

            // collect buildings
            Export_CollectBuildings();

            // set new state
            ExportState = "collected";
            //setTimeout(ExportAll(), 250);
            break;
    
        case "collected":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Senden...');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-upload");

            // send buildings
            Export_SendBuildings();

            // set new state
            ExportState = "sending";
            //setTimeout(ExportAll(), 250);
            break;
    
        case "sending":
            if (ExportQueue.length === 0)
                ExportState = "sent";
            break;
    
        case "sent":
            // set user feedback
            $("#tableau_state").html('<b>Status:</b> Gesendet');
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-ok");

            // set new state
            ExportState = "idle";
            break;
            
        default:
            ExportState = "idle";
    }
}

//
//                  Export starten
//

function Export_Start()
{
    ExportState = "start";
}

//
//                  Gebäude aus dem Spiel importieren
//

function Export_CollectBuildings()
{
    // collect buildings
    $('#building_list').find('.building_list_li').each(function() {
        // check if building should be sent
        if (allowedBuildings[$(this).attr('building_type_id')] === true) {
            // add station information to a temporary array
            ExportQueue.push($(this));
        }
    });
}

//
//                  Gebäude an Tableau senden
//

function Export_SendBuildings()
{
    var BuildingElement = ExportQueue[0];
    var Building = {
            id: parseInt($(BuildingElement).find('.building_marker_image').attr('building_id'), 10),
            name: $(BuildingElement).find('.map_position_mover').html().trim(),
            type: parseInt($(BuildingElement).attr('building_type_id'), 10)
    };
    
    $.ajax({
        url: 'https://tableau.fbmf.de/ajax/import.php',
        method: 'POST',
        data: {
            //'building_id': parseInt($(BuildingElement).find('.building_marker_image').attr('building_id'), 10),
            //'building_name': $(BuildingElement).find('.map_position_mover').html().trim(),
            //'building_type': parseInt($(BuildingElement).attr('building_type_id'), 10),
            //'vehicles': getCarsByStation(BuildingElement)
            'user_id': user_id,
            'action': 'export_buildings',
            'building': Building,
            'vehicles': getCarsByStation(BuildingElement)
        },
        success: function(resultData) {
            // log success
            console.log("sent building " + Building.id);
            // Aus Warteschlange entfernen
            ExportQueue.shift();
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            $("#tableau_state").html('<b>Status:</b> Export Error');
        },
        complete: function() {
            // continue in queue
            if(ExportQueue.length > 0)
                setTimeout(Export_SendBuildings(), 250);
        }
    });
}

// only apply when the index page is open
if (window.location.pathname === "/" || window.location.pathname === "/#") {
    $(document).ready(function() {
        // execute function
        //sendData({
        //    userId: user_id,
        //    stations: getStations()
        //});
        
        //ExportAll();
            setInterval(ExportAll, 500);
            setInterval(UpdateVehicles, 500);
            setInterval(Update_Start, 2000);
        
        // create interval to send all the data
        //window.setInterval(function() {
        //    sendData({
        //        userId: user_id,
        //        stations: getStations()
        //    });
        //}, 5000);
    });

    //
    //                  Neues Dropdown-Menü 22.12.2016
    //
    
    $('#news_li').before('<li id="tableau_dropdown" class="dropdown"></li>');
    $('#tableau_dropdown').append('<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="tableau_glyph" class="glyphicon glyphicon-ok" style="margin-right: 8px; color: #FFFFFF"></span>Tableau</a>');
    $('#tableau_dropdown').append('<ul class="dropdown-menu" role="menu"></ul>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a id="tableau_state"><b>Status:</b> Bereit</a></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation" class="divider"></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="http://tableau.fbmf.de/login.php?u=' + user_id + '" target="_blank">Öffnen</a></li>');
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="#" onclick="Export_Start()">Exportieren</a></li>');
}
