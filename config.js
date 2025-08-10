// CUT START
var disableSetup = false; // Manually set to true to disable setup page menu option
var topBarCenterText = "KR4DHF";

// Grid layout desired
var layout_cols = 4;
var layout_rows = 3;

// Menu items
// Structure is as follows: HTML Color code, Option, target URL, scaling 1=Original Size, side (optional, nothing is Left, "R" is Right)
// The values are [color code, menu text, target link, scale factor, side],
// add new lines following the structure for extra menu options. The comma at the end is important!
var aURL = [
  [
    "#2196f3",
    "Propagation Map",
    "https://muf.hb9vqq.ch/",
    1,
    "L"
  ],
  [
    "#2196f3",
    "DX CLUSTER",
    "https://dxcluster.ha8tks.hu/map/",
    1,
    "L"
  ],
  [
    "#2196f3",
    "LIGHTNING",
    "https://map.blitzortung.org/#3.87/34.07/-78.15",
    1,
    "R"
  ],
  [
    "#f41f1f",
    "WPSD",
    "http://wpsd.local/",
    1,
    "L"
  ],
  [
    "#2196f3",
    "WEATHER",
    "https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=34.07&lon=-78.15&zoom=5",
    1,
    "R"
  ],
  [
    "#2196f3",
    "WINDS",
    "https://earth.nullschool.net/#current/wind/surface/level/orthographic=-78.15,34.07,3000",
    1,
    "R"
  ],
  [
    "#000000",
    "N4GM",
    "https://www.n4gm.org/",
    1,
    "L"
  ]
];

// Feed items
// Structure is as follows: target URL
// The values are [target link]
var aRSS = [
  [
    "https://www.brunswickcountync.gov/RSSFeed.aspx?ModID=63&CID=Severe-Weather-7",
    5
  ],
  [
    "https://www.nhc.noaa.gov/xml/TWDAT.xml",
    60
  ],
  [
    "https://www.brunswickcountync.gov/RSSFeed.aspx?ModID=1&CID=Emergency-Management-15",
    60
  ]
];

// Dashboard Tiles items
// Tile Structure is Title, Source URL
// To display a website on the tiles use "iframe|" keyword before the tile URL
// [Title, Source URL],
// the comma at the end is important!
var aIMG = [
  [
    "Radar",
    "https://radar.weather.gov/ridge/standard/CONUS-LARGE_loop.gif",
    "https://radar.weather.gov/ridge/standard/SOUTHEAST_loop.gif",
    "https://radar.weather.gov/ridge/standard/KLTX_loop.gif",
    "https://radar.weather.gov/ridge/standard//base_velocity/KLTX_loop.gif"
  ],
  [
    "GOES19 CONUS",
    "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/Sandwich/GOES19-CONUS-Sandwich-625x375.gif",
    "https://cdn.star.nesdis.noaa.gov/GOES16/GLM/CONUS/EXTENT3/GOES16-CONUS-EXTENT3-625x375.gif"
  ],
  [
    "GOES19 Southeast",
    "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/se/Sandwich/GOES19-SE-Sandwich-600x600.gif",
    "https://cdn.star.nesdis.noaa.gov/GOES19/GLM/SECTOR/se/EXTENT3/GOES19-SE-EXTENT3-600x600.gif"
  ],
  [
    "GOES19 Atlantic Basin",
    "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/taw/Sandwich/GOES19-TAW-Sandwich-900x540.gif",
    "https://cdn.star.nesdis.noaa.gov/GOES19/GLM/SECTOR/taw/EXTENT3/GOES19-TAW-EXTENT3-900x540.gif"
  ],
  [
    "K4IR Scanner",
    "iframe|https://www.broadcastify.com/webPlayer/24391"
  ],
  [
    "Area Live Cams",
    "iframe|https://www.youtube.com/embed/sBtvpwKH2BE?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/R0oOOmGt7mg?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/lcANlrXCR0Q?autoplay=1&mute=1",
    "iframe|https://api.wetmet.net/widgets/stream/frame.php?ruc=217-02-01&width=400&height=300",
    "iframe|https://www.youtube.com/embed/GKOyGoRE0Tg?autoplay=1&mute=1",
    "https://g1.ipcamlive.com/player/player.php?alias=bhisunset&autoplay=1"
  ],
  [
    "Southport Cam",
    "iframe|https://www.surfchex.com/sppssl.php"
  ],
  [
    "ISS Live Feed",
    "iframe|https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1"
  ],
  [
    "KLTX Local Wx",
    "https://www.weather.gov//images/ilm/WxStory/WeatherStory1.png",
    "https://www.weather.gov//images/ilm/WxStory/WeatherStory5.png",
    "https://www.weather.gov/images/rah/statebrief/MaxT_SFC-Day1State.png"
  ],
  [
    "Ocean Stats",
    "https://wave.marineweather.net/itide/tides/png/nc_oak_island_yaupon_beach.png",
    "https://oifdweather.pythonanywhere.com/static/current_flag.png",
    "https://www.ospo.noaa.gov/data/cb/ssta/ssta.daily.current.png"
  ],
  [
    "Hurricane Outlook",
    "https://www.nhc.noaa.gov/xgtwo/two_atl_7d0.png",
    "https://www.nhc.noaa.gov/xgtwo/two_pac_7d0.png"
  ],
  [
    "Propagation Stats",
    "https://www.hamqsl.com/solarbc.php",
    "https://prop.kc2g.com/renders/current/mufd-normal-now.svg"
  ]
];

// Image rotation intervals in milliseconds per tile - If the line below is commented, tiles will be rotated every 5000 milliseconds (5s)
var tileDelay = [
  10000,
  10000,
  10000,
  10000,
  0,
  10000,
  100000,
  0,
  5000,
  5000,
  5000,
  5000
];

// CUT END
