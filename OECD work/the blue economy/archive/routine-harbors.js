// harbor activity 
var data=[
{name:"Shanghai",country:"China",lat:31.22222,lon:121.45806,tons:505715,unit:"Metric Tons",teu:25002000},
{name:"Singapore",country:"Singapore",lat:1.28967,lon:103.85007,tons:472300,unit:"Freight Tons",teu:25866600},
{name:"Rotterdam",country:"Netherlands",lat:51.9225,lon:4.47917,tons:386957,unit:"Metric Tons",teu:9743290},
{name:"Tianjin",country:"China",lat:39.14222,lon:117.17667,tons:381110,unit:"Metric Tons",teu:8700000},
{name:"Ningbo",country:"China",lat:29.87819,lon:121.54945,tons:371540,unit:"Metric Tons",teu:10502800},
{name:"Guangzhou",country:"China",lat:23.11667,lon:113.25,tons:364000,unit:"Metric Tons",teu:11190000},
{name:"Qingdao",country:"China",lat:36.09861,lon:120.37194,tons:274304,unit:"Metric Tons",teu:10280000},
{name:"Qinhuangdao",country:"China",lat:39.93167,lon:119.58833,tons:243850,unit:"Metric Tons",teu:0},
{name:"Hong Kong",country:"China",lat:22.28552,lon:114.15769,tons:242967,unit:"Metric Tons",teu:21040096},
{name:"Busan",country:"South Korea",lat:35.10278,lon:129.04028,tons:226182,unit:"Revenue Tons",teu:11954861},
{name:"Dalian",country:"China",lat:38.91222,lon:121.60222,tons:204000,unit:"Metric Tons",teu:4552000},
{name:"South Louisiana",country:"United States",lat:30.06659,lon:-90.48008,tons:192853,unit:"Metric Tons",teu:0},
{name:"Houston",country:"United States",lat:29.76328,lon:-95.36327,tons:191729,unit:"Metric Tons",teu:1797198},
{name:"Shenzhen",country:"China",lat:22.54554,lon:114.0683,tons:187045,unit:"Metric Tons",teu:18250100},
{name:"Port Hedland",country:"Australia",lat:-20.31,lon:118.601,tons:178625,unit:"Metric Tons",teu:0},
{name:"Kwangyang",country:"South Korea",lat:34.97528,lon:127.58917,tons:176546,unit:"Revenue Tons",teu:1810438},
{name:"Ulsan",country:"South Korea",lat:35.53722,lon:129.31667,tons:170314,unit:"Revenue Tons",teu:0},
{name:"Nagoya",country:"Japan",lat:35.18147,lon:136.90641,tons:165101,unit:"Freight Tons",teu:2112738},
{name:"Antwerp",country:"Belgium",lat:51.21989,lon:4.40346,tons:157807,unit:"Metric Tons",teu:7309639},
{name:"Chiba",country:"Japan",lat:35.60472,lon:140.12333,tons:144904,unit:"Metric Tons",teu:0},
{name:"Port Kelang",country:"Malaysia",lat:3,lon:101.4,tons:137615,unit:"Metric Tons",teu:7309779},
{name:"Kaohsiung",country:"Taiwan",lat:22.61626,lon:120.31333,tons:133570,unit:"Metric Tons",teu:8581273},
{name:"New York/New Jersey",country:"United States",lat:40.71427,lon:-74.00597,tons:131262,unit:"Metric Tons",teu:4561528},
{name:"Incheon",country:"South Korea",lat:37.45361,lon:126.73167,tons:122128,unit:"Revenue Tons",teu:1559425},
{name:"Yokohama",country:"Japan",lat:35.44778,lon:139.6425,tons:115529,unit:"Freight Tons",teu:2555000},
{name:"Xiamen",country:"China",lat:24.47979,lon:118.08187,tons:110963,unit:"Metric Tons",teu:4680355},
{name:"Hamburg",country:"Germany",lat:53.55,lon:10,tons:110381,unit:"Metric Tons",teu:7007704},
{name:"Yantian",country:"China",lat:22.5741666666667,lon:114.100555555556,tons:107563,unit:"Metric Tons",teu:0},
{name:"Itaqui",country:"Brazil",lat:-29.12528,lon:-56.55306,tons:105026,unit:"Metric Tons",teu:0},
{name:"Newcastle",country:"Australia",lat:-32.92715,lon:151.77647,tons:103027,unit:"Metric Tons",teu:0},
{name:"Port Metro Vancouver",country:"Canada",lat:49.24966,lon:-123.11934,tons:101888,unit:"Metric Tons",teu:2152468},
{name:"Hay Point",country:"Australia",lat:-21.283333,lon:149.3,tons:99475,unit:"Metric Tons",teu:0},
{name:"Tanjung Pelepas",country:"Malaysia",lat:1.366347,lon:103.548367,tons:90447,unit:"Metric Tons",teu:5835085},
{name:"Amsterdam Ports",country:"Netherlands",lat:52.37403,lon:4.88969,tons:86678,unit:"Metric Tons",teu:0},
{name:"Novorossisk",country:"Russia",lat:44.72439,lon:37.76752,tons:86519,unit:"Metric Tons",teu:0},
{name:"Sepetiba",country:"Brazil",lat:-22.983333,lon:-43.7,tons:86420,unit:"Metric Tons",teu:0},
{name:"Kitakyushu",country:"Japan",lat:33.83333,lon:130.83333,tons:84941,unit:"Freight Tons",teu:0},
{name:"Tubarâo",country:"Brazil",lat:-28.466667,lon:-49.006944,tons:83835,unit:"Metric Tons",teu:0},
{name:"Santos",country:"Brazil",lat:-23.96083,lon:-46.33361,tons:83194,unit:"Metric Tons",teu:2255862},
{name:"Marseilles",country:"France",lat:43.29695,lon:5.38107,tons:83194,unit:"Metric Tons",teu:876757},
{name:"Osaka",country:"Japan",lat:34.69374,lon:135.50218,tons:80944,unit:"Freight Tons",teu:1843067},
{name:"Primorsk",country:"Russia",lat:60.70763,lon:28.75283,tons:79138,unit:"Metric Tons",teu:0},
{name:"Richards Bay",country:"South Africa",lat:-28.78301,lon:32.03768,tons:77631,unit:"Metric Tons",teu:0},
{name:"Kobe",country:"Japan",lat:34.6913,lon:135.183,tons:77027,unit:"Freight Tons",teu:2247024},
{name:"Le Havre",country:"France",lat:49.4938,lon:0.10767,tons:73768,unit:"Metric Tons",teu:2240714},
{name:"Tokyo",country:"Japan",lat:35.6895,lon:139.69171,tons:72259,unit:"Freight Tons",teu:3810769},
{name:"Algeciras - La Linea",country:"Spain",lat:36.13326,lon:-5.45051,tons:69911,unit:"Metric Tons",teu:3043268},
{name:"Long Beach",country:"United States",lat:33.76696,lon:-118.18923,tons:65772,unit:"Metric Tons",teu:5067597},
{name:"Daesan",country:"South Korea",lat:36.783333,lon:126.45,tons:64716,unit:"Revenue Tons",teu:0},
{name:"Bandar Abbas",country:"Iran",lat:27.186389,lon:56.277222,tons:64454,unit:"Metric Tons",teu:2206476},
{name:"Bremen/Bremerhaven",country:"Germany",lat:53.07516,lon:8.80777,tons:63106,unit:"Metric Tons",teu:4578642},
{name:"Corpus Christi",country:"United States",lat:27.80058,lon:-97.39638,tons:61907,unit:"Metric Tons",teu:0},
{name:"New Orleans, LA",country:"United States",lat:29.95465,lon:-90.07507,tons:61804,unit:"Metric Tons",teu:0},
{name:"Beaumont",country:"United States",lat:30.08605,lon:-94.10185,tons:61431,unit:"Metric Tons",teu:0},
{name:"Chennai",country:"India",lat:13.104224,lon:80.29727,tons:61057,unit:"Metric Tons",teu:1216438},
{name:"Jawaharlal Nehru (Nhava Sheva)",country:"India",lat:18.95,lon:72.95,tons:60746,unit:"Metric Tons",teu:4061343},
{name:"Pohang",country:"South Korea",lat:36.032222,lon:129.365,tons:58687,unit:"Revenue Tons",teu:0},
{name:"Valencia",country:"Spain",lat:39.46975,lon:-0.37739,tons:57502,unit:"Metric Tons",teu:3653890},
{name:"Paradip",country:"India",lat:20.32,lon:86.62,tons:57011,unit:"Metric Tons",teu:0},
{name:"Saldanha Bay",country:"South Africa",lat:-33.016667,lon:17.95,tons:56476,unit:"Metric Tons",teu:0},
{name:"Bergen",country:"Norway",lat:60.39299,lon:5.32415,tons:56138,unit:"Metric Tons",teu:0},
{name:"Grimsby and Immingham",country:"United Kingdom",lat:53.5595,lon:-0.068,tons:54708,unit:"Metric Tons",teu:0},
{name:"Mumbai",country:"India",lat:19.07283,lon:72.88261,tons:54540,unit:"Metric Tons",teu:0},
{name:"Huntington",country:"United States",lat:38.41925,lon:-82.44515,tons:53680,unit:"Metric Tons",teu:0},
{name:"Los Angeles",country:"United States",lat:33.729186,lon:-118.262015,tons:52986,unit:"Metric Tons",teu:6748994},
{name:"Hampton Roads",country:"United States",lat:36.966667,lon:-76.366667,tons:52952,unit:"Metric Tons",teu:1745228},
{name:"Taichung",country:"Taiwan",lat:24.1469,lon:120.6839,tons:52747,unit:"Metric Tons",teu:1193943},
{name:"Cayo Arcas",country:"Mexico",lat:19.85,lon:-90.53333,tons:51818,unit:"Metric Tons",teu:0},
{name:"St. Petersburg",country:"Russia",lat:59.89444,lon:30.26417,tons:50406,unit:"Metric Tons",teu:1341850},
{name:"São Sebastião",country:"Brazil",lat:-23.4536,lon:-45.2436,tons:50155,unit:"Metric Tons",teu:0},
{name:"Mormugao",country:"India",lat:15.4,lon:73.8,tons:48847,unit:"Metric Tons",teu:0},
{name:"Philadelphia",country:"United States",lat:39.95234,lon:-75.16379,tons:48763,unit:"Metric Tons",teu:0},
{name:"Texas City",country:"United States",lat:29.38384,lon:-94.9027,tons:47748,unit:"Metric Tons",teu:0},
{name:"Lake Charles",country:"United States",lat:30.21309,lon:-93.2044,tons:47403,unit:"Metric Tons",teu:0},
{name:"Mobile",country:"United States",lat:30.69436,lon:-88.04305,tons:47373,unit:"Metric Tons",teu:0},
{name:"Greater Baton Rouge",country:"United States",lat:30.45075,lon:-91.15455,tons:47100,unit:"Metric Tons",teu:0},
{name:"Laem Chabang",country:"Thailand",lat:13.083333,lon:100.883333,tons:47072,unit:"Metric Tons",teu:4537833},
{name:"Genoa",country:"Italy",lat:44.40667,lon:8.93333,tons:46563,unit:"Metric Tons",teu:1533627},
{name:"Calcutta",country:"India",lat:22.56972,lon:88.36972,tons:46295,unit:"Metric Tons",teu:0},
{name:"Plaquemines",country:"United States",lat:29.852222,lon:-89.998333,tons:46149,unit:"Metric Tons",teu:0},
{name:"Alexandria and El-Dekheila",country:"Egypt",lat:31.21564,lon:29.95527,tons:45465,unit:"Metric Tons",teu:0},
{name:"London",country:"United Kingdom",lat:51.5,lon:0.05,tons:45442,unit:"Metric Tons",teu:0},
{name:"Dunkerque",country:"France",lat:51.05,lon:2.36667,tons:45023,unit:"Metric Tons",teu:0},
{name:"Zeebrugge",country:"Belgium",lat:51.333333,lon:3.2,tons:44866,unit:"Metric Tons",teu:2328198},
{name:"Trieste",country:"Italy",lat:45.64861,lon:13.78,tons:44393,unit:"Metric Tons",teu:0},
{name:"Colombo",country:"Sri Lanka",lat:-25.29167,lon:-49.22417,tons:43799,unit:"Metric Tons",teu:3464297},
{name:"Manila",country:"Philippines",lat:14.6042,lon:120.9822,tons:43780,unit:"Metric Tons",teu:2815004},
{name:"Jubail",country:"Saudi Arabia",lat:27,lon:49.666667,tons:43089,unit:"Metric Tons",teu:0},
{name:"Constantza",country:"Romania",lat:44.18333,lon:28.65,tons:42014,unit:"Metric Tons",teu:607483},
{name:"Barcelona",country:"Spain",lat:41.38879,lon:2.15899,tons:41781,unit:"Metric Tons",teu:1800214},
{name:"Tanjung Priok",country:"Indonesia",lat:-6.133333,lon:106.9,tons:41546,unit:"Metric Tons",teu:3800000},
{name:"San Lorenz-San Martin",country:"Argentina",lat:-32.741,lon:-60.745,tons:41477,unit:"Metric Tons",teu:0},
{name:"Jeddah",country:"Saudi Arabia",lat:21.51694,lon:39.21917,tons:40934,unit:"Metric Tons",teu:3091312},
{name:"Calais",country:"France",lat:50.9581,lon:1.85205,tons:40785,unit:"Metric Tons",teu:0},
{name:"Milford Haven",country:"United Kingdom",lat:51.71418,lon:-5.04274,tons:39292,unit:"Metric Tons",teu:0},
{name:"Tees and Hartlepool",country:"United Kingdom",lat:54.69,lon:-1.21,tons:39163,unit:"Metric Tons",teu:0},
{name:"Gothenburg",country:"Sweden",lat:57.70716,lon:11.96679,tons:38934,unit:"Metric Tons",teu:817616},
{name:"Izmit (Kocaeli)",country:"Turkey",lat:40.76694,lon:29.91694,tons:38769,unit:"Metric Tons",teu:0},
{name:"Karachi",country:"Pakistan",lat:24.9056,lon:67.0822,tons:38732,unit:"Metric Tons",teu:1307000},
{name:"Durban",country:"South Africa",lat:-29.8579,lon:31.0292,tons:37419,unit:"Metric Tons",teu:2523105},
{name:"Southampton",country:"United Kingdom",lat:50.90395,lon:-1.40428,tons:37227,unit:"Metric Tons",teu:1400000},
{name:"Forth Ports",country:"United Kingdom",lat:56.026785,lon:-3.180542,tons:36690,unit:"Metric Tons",teu:0},
{name:"New Mangalore",country:"India",lat:12.91723,lon:74.85603,tons:35528,unit:"Metric Tons",teu:0},
{name:"Angra dos Reis",country:"Brazil",lat:-23.00667,lon:-44.31806,tons:35491,unit:"Metric Tons",teu:0},
{name:"Gioia Tauro",country:"Italy",lat:38.42397,lon:15.899,tons:34394,unit:"Metric Tons",teu:2857438},
{name:"Wilhelmshaven",country:"Germany",lat:53.51667,lon:8.13333,tons:33577,unit:"Metric Tons",teu:0},
{name:"Pascagoula, MS",country:"United States",lat:30.36576,lon:-88.55613,tons:33219,unit:"Metric Tons",teu:0},
{name:"Ho Chi Minh",country:"Viet Nam",lat:10.75,lon:106.66667,tons:33000,unit:"Metric Tons",teu:3563246},
{name:"Yanbu",country:"Saudi Arabia",lat:24.08228,lon:38.065567,tons:32987,unit:"Metric Tons",teu:0},
{name:"Bandar Khomeini",country:"Iran",lat:30.435556,lon:49.105556,tons:32704,unit:"Metric Tons",teu:0},
{name:"Brisbane",country:"Australia",lat:-27.46794,lon:153.02809,tons:32119,unit:"Metric Tons",teu:918998},
{name:"Tampa",country:"United States",lat:27.94752,lon:-82.45843,tons:31650,unit:"Metric Tons",teu:0},
{name:"Bilbao",country:"Spain",lat:43.26271,lon:-2.92528,tons:31604,unit:"Metric Tons",teu:0},
{name:"Tallinn",country:"Estonia",lat:59.43696,lon:24.75353,tons:31597,unit:"Metric Tons",teu:0},
{name:"Tarragona",country:"Spain",lat:41.11667,lon:1.25,tons:31310,unit:"Metric Tons",teu:0},
{name:"Valdez",country:"United States",lat:61.130833,lon:-146.348333,tons:31274,unit:"Metric Tons",teu:0},
{name:"Port Kembla",country:"Australia",lat:-34.466667,lon:150.9,tons:31045,unit:"Revenue Tons",teu:0},
{name:"Port Arthur",country:"United States",lat:29.89883,lon:-93.92878,tons:30667,unit:"Metric Tons",teu:0},
{name:"Paranaguá",country:"Brazil",lat:-25.52,lon:-48.508889,tons:30630,unit:"Metric Tons",teu:630597},
{name:"Chittagong",country:"Bangladesh",lat:22.33306,lon:91.83639,tons:30483,unit:"metric tons",teu:1161470},
{name:"Melbourne",country:"Australia",lat:-37.814,lon:144.96332,tons:30480,unit:"Metric Tons",teu:2236633},
{name:"Liverpool/Mersey-side",country:"United Kingdom",lat:-33.9,lon:150.93333,tons:29936,unit:"Metric Tons",teu:588053},
{name:"Pittsburgh",country:"United States",lat:40.44062,lon:-79.99589,tons:29839,unit:"Metric Tons",teu:0},
{name:"Nantes St. Nazaire",country:"France",lat:47.21725,lon:-1.55336,tons:29752,unit:"Metric Tons",teu:0},
{name:"Riga",country:"Latvia",lat:56.946,lon:24.10589,tons:29724,unit:"Metric Tons",teu:0},
{name:"Dubai Ports",country:"United Arab Emirates",lat:1.28967,lon:103.85007,tons:0,unit:"",teu:11124082},
{name:"Port Kelang",country:"Malasyia",lat:3,lon:101.4,tons:0,unit:"",teu:7309779},
{name:"Tanjung Pelepas",country:"Malasyia",lat:1.366347,lon:103.548367,tons:0,unit:"",teu:5835085},
{name:"Mina Raysut (Salalah)",country:"Oman",lat:16.948056,lon:54.008889,tons:0,unit:"",teu:3493459},
{name:"Port Said",country:"Egypt",lat:31.25654,lon:32.28412,tons:0,unit:"",teu:3300951},
{name:"Felixstowe",country:"United Kingdom",lat:51.954171,lon:1.310158,tons:0,unit:"",teu:3100000},
{name:"Lianyungang",country:"China",lat:34.6,lon:119.166667,tons:0,unit:"",teu:3020800},
{name:"Khor Fakkan",country:"United Arab Emirates",lat:25.333333,lon:56.35,tons:0,unit:"",teu:2750285},
{name:"Yingkou",country:"China",lat:40.666667,lon:122.233333,tons:0,unit:"",teu:2537000},
{name:"Savannah",country:"United States",lat:32.08354,lon:-81.09983,tons:0,unit:"",teu:2356511},
{name:"Marsaxlokk",country:"Malta",lat:35.841667,lon:14.544722,tons:0,unit:"",teu:2260000},
{name:"Oakland",country:"United States",lat:37.795533,lon:-122.284603,tons:0,unit:"",teu:2045211},
{name:"Balboa",country:"Panama",lat:8.95,lon:-79.566667,tons:0,unit:"",teu:2011778},
{name:"Sydney Ports",country:"Australia",lat:-33.856111,lon:151.1925,tons:0,unit:"",teu:1927507},
{name:"Ambarli",country:"Turkey",lat:40.969044,lon:28.67481,tons:0,unit:"",teu:1836030},
{name:"Kingston",country:"Jamaica",lat:17.979345,lon:-76.83442,tons:0,unit:"",teu:1692811},
{name:"San Juan",country:"United States",lat:18.45,lon:-66.066667,tons:0,unit:"",teu:1673745},
{name:"Seattle",country:"United States",lat:47.60621,lon:-122.33207,tons:0,unit:"",teu:1584596},
{name:"Keelung",country:"Taiwan",lat:25.133333,lon:121.733333,tons:0,unit:"",teu:1577824},
{name:"Tacoma",country:"United States",lat:47.270494,lon:-122.411728,tons:0,unit:"",teu:1545853},
{name:"Taicang",country:"China",lat:31.447778,lon:121.093889,tons:0,unit:"",teu:1510000},
{name:"Buenos Aires (Including Exolgen)",country:"Argentina",lat:-34.61315,lon:-58.37723,tons:0,unit:"",teu:1412462},
{name:"Manzanillo",country:"Panama",lat:9.361958,lon:-79.882089,tons:0,unit:"",teu:1406030},
{name:"Montreal",country:"Canada",lat:45.505204,lon:-73.548918,tons:0,unit:"",teu:1247690},
{name:"Dammam",country:"Saudi Arabia",lat:26.499458,lon:50.197821,tons:0,unit:"",teu:1227392},
{name:"Bangkok",country:"Thailand",lat:13.75398,lon:100.50144,tons:0,unit:"",teu:1222048},
{name:"Tangier",country:"Morocco",lat:35.76727,lon:-5.79975,tons:0,unit:"",teu:1222000},
{name:"Damietta",country:"Egypt",lat:31.41648,lon:31.81332,tons:0,unit:"",teu:1213187},
{name:"Charleston",country:"United States",lat:32.83548,lon:-79.890175,tons:0,unit:"",teu:1181353},
{name:"Nanjing",country:"China",lat:32.06167,lon:118.77778,tons:0,unit:"",teu:1160300},
{name:"Cartagena (incluye SPRC, El Bosque, Contecar)",country:"Colombia",lat:10.377064,lon:-75.509076,tons:0,unit:"",teu:1141873},
{name:"Haifa",country:"Israel",lat:32.81556,lon:34.98917,tons:0,unit:"",teu:1140000},
{name:"Manzanillo",country:"Mexico",lat:19.05011,lon:-104.31879,tons:0,unit:"",teu:1110350},
{name:"Callao",country:"Peru",lat:-12.06667,lon:-77.15,tons:0,unit:"",teu:1089837},
{name:"Honolulu",country:"United States",lat:21.30694,lon:-157.85833,tons:0,unit:"",teu:1049420},
{name:"La Spezia",country:"Italy",lat:44.11054,lon:9.84339,tons:0,unit:"",teu:1046063},
{name:"Las Palmas",country:"Spain",lat:28.137697,lon:-15.415106,tons:0,unit:"",teu:1007207},
{name:"Beirut",country:"Lebanon",lat:33.88894,lon:35.49442,tons:0,unit:"",teu:994601},
{name:"Penang",country:"Malaysia",lat:5.419426,lon:100.361331,tons:0,unit:"",teu:958476},
{name:"Ashdod",country:"Israel",lat:31.81667,lon:34.65,tons:0,unit:"",teu:893000},
{name:"Guayaquil",country:"Ecuador",lat:-2.16667,lon:-79.9,tons:0,unit:"",teu:884100},
{name:"Johor",country:"Malaysia",lat:1.366347,lon:103.548367,tons:0,unit:"",teu:844856},
{name:"Mersin",country:"Turkey",lat:36.802962,lon:34.647446,tons:0,unit:"",teu:843917},
{name:"Auckland",country:"New Zealand",lat:-36.86667,lon:174.76667,tons:0,unit:"",teu:843590},
{name:"Izmir",country:"Turkey",lat:38.41273,lon:27.13838,tons:0,unit:"",teu:821591},
{name:"Miami",country:"United States",lat:25.774542,lon:-80.167751,tons:0,unit:"",teu:807069},
{name:"Port Everglades",country:"United States",lat:26.095137,lon:-80.121789,tons:0,unit:"",teu:796160},
{name:"Puerto Cabello",country:"Venezuela",lat:10.468906,lon:-68.002796,tons:0,unit:"",teu:791813},
{name:"Cape Town",country:"South Africa",lat:-33.92584,lon:18.42322,tons:0,unit:"",teu:766127},
{name:"Casablanca",country:"Morocco",lat:33.59278,lon:-7.61916,tons:0,unit:"",teu:760883},
{name:"Jacksonville",country:"United States",lat:30.389535,lon:-81.540098,tons:0,unit:"",teu:754352},
{name:"Bin Qasim",country:"Pakistan",lat:24.924444,lon:66.973611,tons:0,unit:"",teu:751056},
{name:"Limón-Moin",country:"Costa Rica",lat:9.990427,lon:-83.02233,tons:0,unit:"",teu:748029},
{name:"Taranto",country:"Italy",lat:40.47611,lon:17.22972,tons:0,unit:"",teu:741428},
{name:"Shuwaikh",country:"Kuwait",lat:29.35,lon:47.95,tons:0,unit:"",teu:732560},
{name:"San Antonio",country:"Chile",lat:-33.59333,lon:-71.62167,tons:0,unit:"",teu:729033},
{name:"Hakata",country:"Japan",lat:33.591389,lon:130.414722,tons:0,unit:"",teu:722826},
{name:"Valparaiso",country:"Chile",lat:-33.032197,lon:-71.627641,tons:0,unit:"",teu:677432},
{name:"Piraeus",country:"Greece",lat:37.948902,lon:23.638737,tons:0,unit:"",teu:667135},
{name:"Rio Grande",country:"Brazil",lat:-32.040995,lon:-52.075496,tons:0,unit:"",teu:629586},
{name:"Mombasa",country:"Kenya",lat:-4.044659,lon:39.627889,tons:0,unit:"",teu:618816},
{name:"Abidjan",country:"Ivory Coast",lat:5.271756,lon:-4.013057,tons:0,unit:"",teu:610585},
{name:"Itajai/Navagantes",country:"Brazil",lat:-26.89687,lon:-48.663168,tons:0,unit:"",teu:593359},
{name:"Leghorn",country:"Italy",lat:43.555406,lon:10.298824,tons:0,unit:"",teu:592050},
{name:"Montevideo",country:"Uruguay",lat:-34.902193,lon:-56.208673,tons:0,unit:"",teu:588410}];



var color = d3.scale.linear()
	.domain([-1,0, 50])//d3.max(data)])
	.range(["#eee","#ECFAFE", "#066E88"]); 
	//.range(["#eee","#eee", "#B84C49"]); 
var height=500,width=960;

var project = d3.geo.mercator().scale(1000);

var path = d3.geo.path().projection(project);

var zoom = d3.behavior.zoom()
    .translate(project.translate())
    .scale(project.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", move);


var svg = d3.select("#chart").append("svg")
	.attr("width", 960 + 100)
	.attr("height", 500 + 100)
	.append("g")
	.attr("transform", "translate(50,50)")
	.call(zoom);



var 
idToNode = {},
links = [],
nodes = data.map(function(d,i) {
	var xy = project([d.lon,d.lat]);
	return idToNode[d.id] = {
		index:i,
		x: xy[0],
		y: xy[1],
		gravity: {x: xy[0], y: xy[1]},
		r: Math.sqrt(d.tons/1500),
		value: d.teu,
		ton:d.tons,
		teu:d.teu,
		name:d.name,
		unit:d.unit!=""?("("+d.unit+")"):""
	};
});



var states=svg.append("g").attr("id", "states");

  states
    .selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
      .attr("stroke", "none")
      .attr("fill", "#eee")
      .attr("fill-opacity", .7)
    //.append("svg:title")
    //	  .text(function(d) { return d.properties.name; });


var circles=svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill", "steelblue")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d.r; })
	.style("opacity",.5)	
.append("title")
	.text(function(d) {return d.name+": "+d3.format(",")(d.ton)+" "+d.unit+" <br>"+(d.teu?d.teu+"TEUs":"");})


function move() {
  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.max(-s / 2, Math.min(width + s / 2, t[0]));
  t[1] = Math.max(-s / 2, Math.min(height + s / 2, t[1]));
  zoom.translate(t);
  project.translate(t).scale(s);
  states.attr("d", path);
} 

		

d3.select("#tons").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#tons").classed("active",1);
	
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){r=Math.sqrt(d.ton/1500);return r;}).style("fill","steelblue");

	d3.select("#legend").html("Thousands of tons");
	
	
});
d3.select("#container").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#container").classed("active",1);
	
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return Math.sqrt(d.teu/50000);}).style("fill","red");

	d3.select("#legend").html("TEUs - twenty-foot equivalent units");
	
	
});

$('circle').tipsy({html: true, gravity: 's'});

