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
    },

    // data is sent like thisd
    exampleData      = {
        userId: 4156156,
        stations: [
            {
                id: '1234',
                name: 'Testname 1',
                stationType: 0,
                cars: [
                    {
                        id: '4321',
                        carType: 15,
                        name: 'Testauto 1',
                        status: 2
                    },
                    {
                        id: '4322',
                        carType: 10,
                        name: 'Testauto 2',
                        status: 5
                    }
                ]
            },
            {
                id: '1235',
                name: 'Testname 2',
                stationType: 8,
                cars: [
                    {
                        id: '4323',
                        carType: 15,
                        name: 'Testauto 3',
                        status: 2
                    },
                    {
                        id: '4324',
                        carType: 17,
                        name: 'Testauto 4',
                        status: 5
                    }
                ]
            }
        ]
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

//
//                  Neue Export Funktion 22.12.2016
//

// Hier werden die verbleibenden, noch zu exportierenden Gebäude gespeichert
var BuildingQueue = [];

function queueBuildings()
{
    $('#building_list').find('.building_list_li').each(function() {
        // check if building should be sent
        if (allowedBuildings[$(this).attr('building_type_id')] === true) {
            // add station information to a temporary array
            BuildingQueue.push($(this));
        }
    });
        
    console.log(BuildingQueue);
        
    exportBuidlings();
}

function exportBuidlings()
{
    for (var i = 0; i < BuildingQueue.length; i++)
    {
        $("#tableau_glyph").attr("class", "glyphicon glyphicon-upload");
        
        var BuildingElement = BuildingQueue[i];
        var Building = {
                id: parseInt($(BuildingElement).find('.building_marker_image').attr('building_id'), 10),
                name: $(BuildingElement).find('.map_position_mover').html().trim(),
                buildingType: parseInt($(BuildingElement).attr('building_type_id'), 10),
                vehicles: getCarsByStation(BuildingElement)
        };
            
        $.ajax({
            url: 'https://tableau.fbmf.de/ajax/import.php',
            method: 'POST',
            data: {
                'building': Building
            },
            success: function(resultData) {
                // log success
                console.log("All stations have been transmitted");
                    console.log(Building);
                $("#tableau_glyph").attr("class", "glyphicon glyphicon-ok");
            },
            error: function(errorData) {
                // log errors
                console.log(errorData);
                $("#tableau_glyph").attr("class", "glyphicon glyphicon-remove");
            }
        });
    }
}

// only apply when the index page is open
if (window.location.pathname === "/" || window.location.pathname === "/#") {
    $(document).ready(function() {
        // execute function
        sendData({
            userId: user_id,
            stations: getStations()
        });
        // create interval to send all the data
        window.setInterval(function() {
            sendData({
                userId: user_id,
                stations: getStations()
            });
        }, 5000);
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
        $('#tableau_dropdown').find(".dropdown-menu").append('<li role="presentation"><a href="#" onclick="queueBuildings()">Exportieren</a></li>');
}
