/// Serial Sample Driver
// Copyright 2010 Remote Technologies Inc.
//

System.Print("Tun3.7: Initializing TUN3.7 Sample Driver\r\n");
    

//
//  Globals
//
var g_debug = Config.Get("DebugTrace") == "true";
var g_comm = new Serial(OnCommRx, parseInt(Config.Get("SerialPort"), 10), 9600, 8, 1, "None", "None");
g_comm.AddRxFraming("StartStopChar","!6","\x1a" );






//
//  Startup Code
//
g_comm.Write("!6PWRQSTN\r");
g_comm.Write("!6HATQSTN\r");
g_comm.Write("!6HCNQSTN\r");
g_comm.Write("!6HITQSTN\r");
g_comm.Write("!6HDSQSTN\r");
g_comm.Write("!6HPRQSTN\r");
g_comm.Write("!6HTSQSTN\r");
g_comm.Write("!6PWRQSTN\r")




//
//  Internal Functions
function OnCommRx(data)

{
   if (g_debug) System.Print("Serial: OnCommRx Data ("+data+")\r\n");
   SystemVars.Write("LastSerialDataSysvar", data);
   System.Print(Util.toString(data,data.length,"HEXSTRINGUPPER"));
var strData = data;
var arrData = strData.split("!6"); // Split message at start character
arrData = arrData.filter(function(strTMsg){return strTMsg;}); // Strip all blank messages from the array

for(var strTData in arrData) { // Walk through each message
    var strTMsg = arrData[strTData];

    System.Print("(" + strTMsg.length + "):" + strTMsg);
    switch(strTMsg.substr(0,3).toUpperCase()) { // Switch ID, First 3 characters converted to Ucase to be safe
    	case "TUN" : // Tune Frequency
            System.Print("Tune: " + strTMsg.substr(3));
            SystemVars.Write("Freq",strTMsg.substr(3,4) * 100 );
			break;
        case "HAT" : // Artist
            System.Print("Artist: " + strTMsg.substr(3));
            SystemVars.Write("Artist",strTMsg.substr(3) );
            break;
        case "HTI" : // Song Title
            System.Print("Song: " + strTMsg.substr(3));
            SystemVars.Write("Song",strTMsg.substr(3) );
            break;
        case "HCN" : // Station Name
            System.Print("Station: " + strTMsg.substr(3));
            SystemVars.Write("Station",strTMsg.substr(3) );
            break;
        case "HTS" : //HD Yes Or No
            System.Print("Status: " + strTMsg.substr(3));
           SystemVars.Write("HDYN", strTMsg.substr(4,1)=="1" ? "HD" : "Not HD");
            
            SystemVars.Write("HDSubs",strTMsg.substr(8,2) );
            SystemVars.Write("HDNum",strTMsg.substr(6,1) );
            break;
      
        
    }

}
}


//
//  External Functions
//
function Scan(Up,Down)
{
	if (g_debug) System.Print("TUN3.7: Tun UP(" + Up + ")\r\n");
	if (g_debug) System.Print("TUN3.7: Tun Down(" + Down + ")\r\n");

	if (Up){
		g_comm.Write("!6" + "TUNUP" + '\r');
	
	}else{
		g_comm.Write("!6" + "TUNDOWN" + "\r");
	}

}

function PowerOnOff(On,Standby)
{
	if (g_debug) System.Print("TUN3.7: PWR ON(" + On + ")\r\n");
	if (g_debug) System.Print("TUN3.7: Standby(" + Standby + ")\r\n");


if (On){
		g_comm.Write("!6PWR01\r");
		SystemVars.Write("PWR", false);

	}else{
		g_comm.Write("!6PWR00\r");
		SystemVars.Write("PWR", true);

	}
}

function DTune(tune)
{
	if (g_debug) System.Print("TUN3.7: Direct Tune(" + tune + ")\r\n");
	
			g_comm.Write("!6TUN" + tune + "\r");

}

function HDS(HDSubs)
{
	if (g_debug) System.Print("TUN3.7: HD Sub Number(" + HDSubs + ")\r\n");
	
			g_comm.Write("!6HPR0" + HDSubs + "\r");

}














