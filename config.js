const disableSetup = false;
const disableLdCfg = false;
var topBarCenterText = "KR4DHF";

// Grid layout desired
var layout_cols = 4;
var layout_rows = 3;

// Menu items
// Structure is as follows HTML Color code, Option, target URL, scaling 1=Original Size, side (optional, nothing is Left, "R" is Right)
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
  ]
];

// Dashboard items
// Structure is Title, Image Source URL
// [Title, Image Source URL],
// the comma at the end is important!
// You can't add more items because there are only 12 placeholders on the dashboard
// but you can replace the titles and the images with anything you want.
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
    "https://cdn.star.nesdis.noaa.gov/GOES19/GLM/SECTOR/taw/EXTENT3/GOES19-TAW-EXTENT3-900x540.gif",
    "https://tropic.ssec.wisc.edu/real-time/atlantic/images/irng8.GIF",
    "https://tropic.ssec.wisc.edu/real-time/mtpw2/webAnims/tpw_nrl_colors/natl/mimictpw_natl_latest.gif"
  ],
  [
    "Traffic Cams",
    "https://eapps.ncdot.gov/services/traffic-prod/v1/cameras/images?filename=I140_US17BUS_W2.jpg",
    "https://eapps.ncdot.gov/services/traffic-prod/v1/cameras/images?filename=Wilimington_01.JPG"
  ],
  [
    "Area Live Cams",
    "iframe|https://www.youtube.com/embed/sBtvpwKH2BE?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/Dizx0Z2eDv8?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/lcANlrXCR0Q?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/itXoEFJZtD0?autoplay=1&mute=1",
    "iframe|https://www.youtube.com/embed/GKOyGoRE0Tg?autoplay=1&mute=1"
  ],
  [
    "Southport Cam",
    "iframe|https://www.surfchex.com/sppssl.php"
  ],
  [
    "ISS Live Feed",
    // "iframe|https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1"
    "iframe|https://www.youtube.com/embed/zPH5KtjJFaQ?autoplay=1&mute=1"
  ],
  [
    "KLTX Local Wx",
    "https://www.weather.gov//images/ilm/WxStory/WeatherStory1.png",
    "https://www.weather.gov//images/ilm/WxStory/WeatherStory5.png",
    "https://www.weather.gov/images/rah/statebrief/MaxT_SFC-Day1State.png",
    "https://www.weather.gov/wwamap/png/ilm.png"
  ],
  [
    "Ocean Stats",
    "https://wave.marineweather.net/itide/tides/png/nc_oak_island_yaupon_beach.png",
    "https://oifdweather.pythonanywhere.com/static/current_flag.png",
    "https://graphical.weather.gov/GraphicalNDFD.php?width=515&timezone=EDT&sector=ILM&element=t&n=1",
    "https://graphical.weather.gov/GraphicalNDFD.php?width=515&timezone=EDT&sector=ILM&element=wwa&n=1"
    // "https://www.ospo.noaa.gov/data/cb/ssta/ssta.daily.current.png"
  ],
  [
    "Hurricane Outlook",
    "https://www.nhc.noaa.gov/xgtwo/two_atl_7d0.png",
    "https://www.nhc.noaa.gov/xgtwo/two_pac_7d0.png"
  ],
  [
    "Fire Weather",
    "https://www.weather.gov/images/ilm/ghwo/FireWeatherDay1.jpg",
    "https://www.spc.noaa.gov/products/fire_wx/day1otlk_fire.png",
    "https://droughtmonitor.unl.edu/data/png/current/current_wfoilm_trd.png"
  ]
];

// Image rotation intervals in milliseconds per tile - If the line below is commented, tiles will be rotated every 5000 milliseconds (5s)
var tileDelay = [
  10000,  10000,  10000,  10000,
  5000,   10000,  100000, 0,
  5000,   5000,   5000,   10000
];

// RSS feed items
// Structure is [feed URL, refresh interval in minutes]
var aRSS = [
  // [
  //   "https://www.brunswickcountync.gov/RSSFeed.aspx?ModID=63&CID=Severe-Weather-7",
  //   5
  // ],
  [
    "https://www.nhc.noaa.gov/xml/TWDAT.xml",
    60
  ],
  // [
  //   "https://www.brunswickcountync.gov/RSSFeed.aspx?ModID=1&CID=Emergency-Management-15",
  //   60
  // ],
  [
    "https://www.brunswickcountync.gov/RSSFeed.aspx?ModID=1&CID=Fire-Marshals-Office-14",
    60
  ]
];