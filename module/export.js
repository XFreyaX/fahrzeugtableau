
if (window.location.pathname === "/" || window.location.pathname === "/#")
{
    $(document).ready(function()
    {
        setTimeout(function()
        {
            $("#tableau-export-button").click(function()
            {
                $("#tableau-export-modal").css("display", "flex");
                $("#tableau-export-modal").animate( {opacity: "1"}, 200 );

                $("#tableau-export-modal-button").html("Start");
                $("#tableau-export-modal-button").attr("class", "btn btn-success");
                $("#tableau-export-modal-button").off();
                $("#tableau-export-modal-button").click(function()
                {
                    startExport();
                });

                initExport();
            });
        }, 5000);


    });
}

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
    13: true,   // police helicopter
    14: false,  // Bereitstellungsraum
    15: true    // Wasserrettung
};



var tableauURL = "https://tableau.eagledev.de/";

var buildingQuantity = 0;
var vehicleQuantity  = 0;

var exportState = "stopped";

var buildingExportQueue = {};
var vehicleExportQueue  = {};



function initExport()
{
    $("#tableau-export-modal-buildings-progress-value").html("collecting...");
    $("#tableau-export-modal-vehicles-progress-value").html("collecting...");
  
    buildingQuantity = 0;
    vehicleQuantity  = 0;
    
    buildingExportQueue = {};
    vehicleExportQueue  = {};

    collectBuildings();
}

function collectBuildings()
{
    exportState = "collecting";

    $('#building_list').find('.building_list_li').each(function() {

        var buildingID   = parseInt($(this).find('.building_marker_image').attr('building_id'), 10);
        var buildingName = $(this).find('.map_position_mover').html().trim();
        var buildingType = parseInt($(this).attr('building_type_id'), 10);

        // check if building should be sent
        if (allowedBuildings[buildingType] === true) {
            // add building to export-array
            buildingExportQueue[buildingID] = {
                id: buildingID,
                name: buildingName,
                buildingType: buildingType
            };

            collectVehicles(buildingID);
        }
    });

    buildingQuantity = Object.keys(buildingExportQueue).length;
    vehicleQuantity  = Object.keys(vehicleExportQueue).length;

    $("#tableau-export-modal-buildings-progress-value").html("0 / " + buildingQuantity);
    $("#tableau-export-modal-vehicles-progress-value").html("0 / " + vehicleQuantity);

    console.log(buildingExportQueue);
    console.log(vehicleExportQueue);

    exportState = "collected";
}

function collectVehicles(buildingID)
{
    $('#vehicle_building_' + buildingID).find('.building_list_vehicle_element').each(function() {

        var vehicleID     = parseInt($(this).attr('vehicle_id'), 10);
        var vehicleName   = $(this).find('.label').html().trim();
        var vehicleType   = parseInt($(this).find('[vehicle_type_id]').attr('vehicle_type_id'));
        var vehicleStatus = parseInt($(this).find('.building_list_fms').html().trim(), 10);

        // add vehicle to export-array
        vehicleExportQueue[vehicleID] = {
            id: vehicleID,
            name: vehicleName,
            type: vehicleType,
            status: vehicleStatus,
            station: buildingID
        };
    });
}




function startExport()
{
    $("#tableau-export-modal-button").html("Abbruch");
    $("#tableau-export-modal-button").attr("class", "btn btn-danger");
    $("#tableau-export-modal-button").off();
    $("#tableau-export-modal-button").click(function()
    {
        exportState = "aborted";

        $("#tableau-export-modal").animate( {opacity: "0"}, 200, function()
        {
            $("#tableau-export-modal").css("display", "none");
        });
    });

    exportState = "exporting";
    exportBuildings();
}


function exportBuildings()
{
    if( exportState == "aborted" )
        return false;

    var buildingExportList = [];

    for( i = 0; i < 5 && Object.keys(buildingExportQueue).length > 0; i++ )
    {
        var building = buildingExportQueue[Object.keys(buildingExportQueue)[0]];
        buildingExportList.push(building);
        delete buildingExportQueue[building.id];
    }

    $.ajax({
        url: tableauURL + 'lss-bridge/buildings.php',
        method: 'POST',
        data: {
            'user-id': user_id,
            'buildings': buildingExportList
        },
        success: function(Response) {
            //var Response = JSON.parse(Response);
            
            if( Response.status == "success" )
            {
                setTimeout( exportBuildings, 500 );
            }
            else
            {
                console.log(Response);
            }
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            $("#tableau_state").html('<b>Status:</b> Export Error');
        }
    });

    $("#tableau-export-modal-buildings-progress-value").html( (buildingQuantity - Object.keys(buildingExportQueue).length) + " / " + buildingQuantity);
    $("#tableau-export-modal-vehicles-progress-value").html( (vehicleQuantity - Object.keys(vehicleExportQueue).length) + " / " + vehicleQuantity);

    if( Object.keys(buildingExportQueue).length === 0 )
    {
        setTimeout( exportVehicles, 500 );
    }
}

function exportVehicles()
{
    if( exportState == "aborted" )
        return false;

    var vehicleExportList = [];

    for( i = 0; i < 10 && Object.keys(vehicleExportQueue).length > 0; i++ )
    {
        var vehicle = vehicleExportQueue[Object.keys(vehicleExportQueue)[0]];
        vehicleExportList.push(vehicle);
        delete vehicleExportQueue[vehicle.id];
    }

    $.ajax({
        url: tableauURL + 'lss-bridge/vehicles.php',
        method: 'POST',
        data: {
            'user-id': user_id,
            'vehicles': vehicleExportList
        },
        success: function(Response) {
            //var Response = JSON.parse(Response);
            
            if( Response.status == "success" )
            {
                setTimeout( exportVehicles, 500 );
            }
            else
            {
                console.log(Response);
            }
        },
        error: function(errorData) {
            // log errors
            console.log(errorData);
            $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            $("#tableau_state").html('<b>Status:</b> Export Error');
        }
    });

    $("#tableau-export-modal-buildings-progress-value").html( (buildingQuantity - Object.keys(buildingExportQueue).length) + " / " + buildingQuantity);
    $("#tableau-export-modal-vehicles-progress-value").html( (vehicleQuantity - Object.keys(vehicleExportQueue).length) + " / " + vehicleQuantity);

    if( Object.keys(vehicleExportQueue).length === 0 )
    {
        $("#tableau-export-modal-button").html("Fertig");
        $("#tableau-export-modal-button").attr("class", "btn btn-success");
        $("#tableau-export-modal-button").off();
        $("#tableau-export-modal-button").click(function()
        {
            $("#tableau-export-modal").animate( {opacity: "0"}, 200, function()
            {
                $("#tableau-export-modal").css("display", "none");
            });
        });

        exportState = "success";
    }
}
