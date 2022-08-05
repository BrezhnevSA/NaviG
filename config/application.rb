require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module NaviBack
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.encoding = "utf-8"
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    Rails.configuration.ldap_other_user = 'user@ldap.com'
    Rails.configuration.ldap_other_pass = 'pass'
    # DS ready id meta
    Rails.configuration.ds_ready_id = 9
    Rails.configuration.contract_id = 3
    Rails.configuration.square_id   = 4
    Rails.configuration.parking_place_id = 15
    Rails.configuration.object_state_id = 16
    Rails.configuration.notactive_desk_id = 17
    Rails.configuration.employee_sd_id = 18
    Rails.configuration.company_id = 21

    Rails.configuration.desknum_id = 10
    Rails.configuration.tymbnum_id = 11
    Rails.configuration.docstation_id = 12
    Rails.configuration.monitor1_id = 13
    Rails.configuration.monitor2_id = 14

    Rails.configuration.test_city_id = 6
    Rails.configuration.test_office_id = 9
    Rails.configuration.test_building_id = 16
    Rails.configuration.test_floor_id = 58
    Rails.configuration.test_employee_id = 9999998

    Rails.configuration.chatbot_employee_id = 9999999

    Rails.configuration.project_locations = Array[ {
        "id": "4fe4aa73-c57f-4077-8620-e1ac44af3e12",
        "name": "Whole Sale_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1208
        ]
      },
      {
        "id": "0c739643-d422-41be-b0b6-656e0610d66e",
        "name": "Future Diagnostics_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4ab22288-82bc-487b-adba-b40448f51db0",
        "name": "AuToBBE",
        "structureName": nil,
        "heads": [
          525
        ],
        "employees": [
          222
        ]
      },
      {
        "id": "560d8128-f8d1-4c26-a6c0-3e55333a394d",
        "name": "AMS@ITP",
        "structureName": nil,
        "heads": [
          93
        ],
        "employees": [
          2507
        ]
      },
      {
        "id": "b522b7c7-3618-4bd6-a630-5adc79556006",
        "name": "S&FOut_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "eaf9d6a7-0656-47ef-a170-0109c05cccae",
        "name": "ECB",
        "structureName": nil,
        "heads": [
          1715
        ],
        "employees": [
          1837,
          2930,
          3314,
          2271,
          3672,
          3172,
          2083,
          3312,
          1129,
          1109,
          3291,
          3509,
          3674
        ]
      },
      {
        "id": "b60a7bbd-957b-4de5-a073-3bf70e996795",
        "name": "Z_No Hub_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4c556989-2387-4145-a0d1-0a83afcc6788",
        "name": "MAD/ PersDispo_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5036513e-e939-4bea-8127-acfd10b6fd36",
        "name": "Voice_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d96b8cf5-e17d-401e-a9de-8d63be0a1c4a",
        "name": "KolloDB_DSOps_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1989
        ]
      },
      {
        "id": "2f447ae9-2ed8-4813-9528-47f2c81a7f7c",
        "name": "CIM HUB_FacN_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "17812196-9ca9-4931-88f3-d728193619b2",
        "name": "CIAM_Test_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b1198ef4-cc30-455a-8842-1f4c2240b539",
        "name": "RMK IMS_STest",
        "structureName": nil,
        "heads": [
          416
        ],
        "employees": [
          831,
          710
        ]
      },
      {
        "id": "bfdffd71-fc49-4876-b7f7-4256377989c1",
        "name": "ARND_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1940
        ]
      },
      {
        "id": "414c8e05-9915-4519-b431-a7d83f1b7f26",
        "name": "One.ERP_TI",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          521
        ]
      },
      {
        "id": "ca16b12e-3735-4ae3-bc6b-bc9939df9295",
        "name": "ASF Customer APIs_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f73bf200-f56d-4440-921f-8f8cd3844315",
        "name": "BAnst",
        "structureName": nil,
        "heads": [
          257
        ],
        "employees": [
          3394
        ]
      },
      {
        "id": "46f30207-7e7d-4a4d-9c47-6afdcb225280",
        "name": "eCare_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "bdda590b-a049-4077-8086-d511f54e0c0d",
        "name": "UiS VW_2020",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          2694,
          3549,
          3219,
          3183,
          3417,
          2955,
          3445,
          1994
        ]
      },
      {
        "id": "f7846e97-d66b-4ee3-ba01-6728aac0d868",
        "name": "FragMagenta_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          803
        ]
      },
      {
        "id": "397f8ed6-51e5-4588-8ac5-bae06817f7e0",
        "name": "IoT DIH",
        "structureName": nil,
        "heads": [
          3529
        ],
        "employees": [
          430,
          3350,
          3357,
          2909,
          1321,
          1717,
          2901,
          3418
        ]
      },
      {
        "id": "57c302ab-baed-4c03-b155-64f4659fafbc",
        "name": "GFNW _Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          1185,
          958,
          2753,
          2929,
          1619,
          1330,
          840,
          2802
        ]
      },
      {
        "id": "0feca91e-eec4-403d-acf0-0e3d22eaaacc",
        "name": "RMK FSS_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "07674473-6e6a-4db5-8731-d9283c9ef54b",
        "name": "ASF Customer APIs_BOP_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "936a0d31-5a70-4248-9034-afddd4a425d4",
        "name": "Gigabit_MU",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": []
      },
      {
        "id": "a06dbd88-289a-488d-85e5-29ad9bb1e221",
        "name": "Oreo",
        "structureName": nil,
        "heads": [],
        "employees": [
          3309,
          27,
          3332
        ]
      },
      {
        "id": "24fc7cb2-900d-489c-af11-5eaadcc94ef6",
        "name": "AC Centric_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9646858a-bd5d-4755-9584-0858ccaeae92",
        "name": "Robotics_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          132
        ]
      },
      {
        "id": "b70b50fa-b22d-4a3d-96d9-b27fefa799d3",
        "name": "DigiBSS_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          674
        ]
      },
      {
        "id": "9f328696-d2d3-4d63-b7d0-a9e23621b604",
        "name": "CA-EM _Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          2343
        ]
      },
      {
        "id": "7f633ffe-16ef-4fa5-ae35-723904ab1c6e",
        "name": "DigiBSS_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2054
        ]
      },
      {
        "id": "c6bdfa55-9a83-4f86-be6a-09cba5cf2368",
        "name": "PSL International_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          86
        ]
      },
      {
        "id": "7733037a-f865-46f0-8000-46ab6ebc4af4",
        "name": "CybDef & IntSec_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "41962049-c48b-4d94-94ba-4158b6d63c4a",
        "name": "BMW Autonomous Driving",
        "structureName": nil,
        "heads": [
          2013
        ],
        "employees": [
          3074,
          2537,
          495,
          1173,
          3134,
          3326,
          2901,
          2743,
          2452,
          3418,
          3396
        ]
      },
      {
        "id": "4e89e15a-3b58-4a62-9d88-14f13a58c687",
        "name": "TVPP_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a122d676-62a6-46a9-8ef4-266d4a818ec0",
        "name": "eCare_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1364,
          3251,
          2600
        ]
      },
      {
        "id": "7a286b51-f0d2-40f3-aaf4-a79e1fe56a07",
        "name": "Whole Sale_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1553,
          1573,
          3025
        ]
      },
      {
        "id": "f6fb5dc0-5393-4c9b-896c-6f66c4f3deba",
        "name": "Magenta Business_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ab400761-6271-400d-9b6f-95422bcf6cdb",
        "name": "Gigabit_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          3038,
          1957,
          3203,
          2274,
          3318,
          2095
        ]
      },
      {
        "id": "82030eef-7a0e-47ba-b41f-acd8c8417af9",
        "name": "TAFEL2000_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a6e38c2b-54a5-40f6-9fed-476c3c07f074",
        "name": "Voice_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b176e9fc-24d1-49ef-99cd-46a46bd2d434",
        "name": "DQM",
        "structureName": nil,
        "heads": [
          2669
        ],
        "employees": [
          2755,
          1836,
          1103,
          175,
          3079,
          3159,
          3482,
          3553,
          3351
        ]
      },
      {
        "id": "3aa7e511-aea7-4405-8d00-8f4e6640ca79",
        "name": "OneApp_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2169
        ]
      },
      {
        "id": "2ecc706a-8a01-4252-8af0-37b9dc6d04d6",
        "name": "Fiber CoOp_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4e249687-25cc-4a9d-8018-935387196095",
        "name": "MaVi_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1325,
          2109,
          2300,
          284,
          1624,
          1668,
          2449,
          1079,
          935,
          221
        ]
      },
      {
        "id": "fd3350c9-15bd-47e2-a3ff-0766f9775363",
        "name": "MaVi_FacM_Service",
        "structureName": nil,
        "heads": [],
        "employees": [
          2954
        ]
      },
      {
        "id": "df592151-53dc-4f02-842a-c520290633ac",
        "name": "T-Navi",
        "structureName": nil,
        "heads": [],
        "employees": [
          1236
        ]
      },
      {
        "id": "009ccb4b-a9d0-41f7-b42b-1d369d66f0a0",
        "name": "PMO Internal_SSC AD2",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          2839,
          3037,
          3515
        ]
      },
      {
        "id": "711537dd-8be1-4341-b25e-4124ba49a5d5",
        "name": "InnoLab_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "21956be3-8d93-41a8-8093-377c329d8b08",
        "name": "ADN ERP",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          369
        ]
      },
      {
        "id": "58a3b360-4543-4d92-926a-9cb782abad13",
        "name": "Megaplan_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "57792cb1-ea93-434b-8359-d4d5055c8ab0",
        "name": "MFP_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2733
        ]
      },
      {
        "id": "520a85f5-d7ad-48c7-9dc4-149931f338ed",
        "name": "Whole Sale (GP)",
        "structureName": nil,
        "heads": [],
        "employees": [
          2951
        ]
      },
      {
        "id": "fc7c6bf8-8f38-47ec-b029-b86e23999098",
        "name": "T-Map_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1930
        ]
      },
      {
        "id": "ae156be0-fb43-4a37-a799-606aa75a414a",
        "name": "CCP_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2050
        ]
      },
      {
        "id": "730ec077-04bc-4019-bfa5-c979541828d9",
        "name": "Network for Future_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1981
        ]
      },
      {
        "id": "10a570d9-5b98-45f7-8c79-1d0d255cba47",
        "name": "Test Automation_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2526
        ]
      },
      {
        "id": "f2c517fd-e6fc-45e2-9892-c08ac7e5f555",
        "name": "WMS TK_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          119,
          645
        ]
      },
      {
        "id": "6aeb22ec-c76b-4929-811b-0b0cb113fb0b",
        "name": "Robotics_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          680
        ]
      },
      {
        "id": "6524a3b6-9167-4feb-bbfc-008c07c04f87",
        "name": "GSO BF_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1903
        ]
      },
      {
        "id": "9d949ccf-6576-4019-81f1-38e9ce639ed9",
        "name": "AC Centric_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "08d5f78f-a090-4e25-b7c5-31c1d264727e",
        "name": "mShop_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          423,
          1405,
          1472,
          203
        ]
      },
      {
        "id": "5c455303-9ace-4994-a033-dc967dc21e54",
        "name": "ASF Product APIs_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          3168
        ]
      },
      {
        "id": "010961cf-98fa-4a85-8513-820ca9f9201e",
        "name": "AD_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "99e9b780-839c-4196-ba99-4c810b86714e",
        "name": "eCare_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1021,
          170,
          3638,
          183,
          3603,
          174,
          3547,
          3448,
          2043,
          3637
        ]
      },
      {
        "id": "bbc9ebd7-4eb1-4145-85fd-24bd85b83d3c",
        "name": "T-Vacation_support",
        "structureName": nil,
        "heads": [
          93
        ],
        "employees": [
          973,
          568,
          2326
        ]
      },
      {
        "id": "0995869b-f195-4264-89b9-d475b5eb47aa",
        "name": "Voice_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          952
        ]
      },
      {
        "id": "8d0d11cf-b46d-4ca1-b391-d2dcd84fd919",
        "name": "Mavi_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          423,
          1405,
          1472
        ]
      },
      {
        "id": "a3c2a177-8374-42b9-8868-e67671f3dc09",
        "name": "TAFEL2000_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ca37c0b8-cd9d-4c88-be38-78ea320dd2a3",
        "name": "NCA_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5fe12032-c8ec-4f5b-86ea-edaf91661b53",
        "name": "VRE_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2155
        ]
      },
      {
        "id": "bec7236e-88c4-4c4e-88ee-416c11b88006",
        "name": "TSA",
        "structureName": nil,
        "heads": [
          188
        ],
        "employees": []
      },
      {
        "id": "99f2e250-fde0-42d6-9708-0c92c50e714b",
        "name": "Consumer IoT Support",
        "structureName": nil,
        "heads": [
          657
        ],
        "employees": [
          2320,
          3294,
          3288,
          2396,
          92,
          2316
        ]
      },
      {
        "id": "18bbd749-4f36-4b17-a913-8d8eee51eb07",
        "name": "DT Sec Go",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": [
          2509,
          2540
        ]
      },
      {
        "id": "419c5478-2fe2-4ad2-91da-549a5de95340",
        "name": "VW_gPMO",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          3169
        ]
      },
      {
        "id": "ebaf6662-e3d6-4fef-b220-c730c47aec85",
        "name": "Future Diagnostics_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "78d6e668-461d-4c1c-80ab-05e893781943",
        "name": "Fiber CoOp_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2f80561e-cbe3-4756-b706-103299d1c060",
        "name": "E2E Assurance_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          396
        ]
      },
      {
        "id": "0246030b-2f1d-41d9-ae67-c3f427f8c0ce",
        "name": "CAPRI_2019_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2886
        ]
      },
      {
        "id": "0a968460-2ec1-4795-b485-c1f81de15ad6",
        "name": "KolloDB_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          467
        ]
      },
      {
        "id": "6dd3c466-fdbf-4f5d-9802-8249c9994d47",
        "name": "ASF Customer APIs_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          3626
        ]
      },
      {
        "id": "e2588a5a-ced4-4608-89b1-1da66b78c191",
        "name": "Robotics_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2998,
          3046,
          2861,
          2991,
          1980,
          3513,
          1474,
          2892,
          2335,
          2693,
          1914,
          282
        ]
      },
      {
        "id": "cae10615-346d-4d47-a896-604535f80b42",
        "name": "Magenta Business_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2145
        ]
      },
      {
        "id": "5ff28d7e-91af-48b0-b949-eb96f922a444",
        "name": "SIMPLE_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          42
        ]
      },
      {
        "id": "b4d49820-be3f-49dc-a2f6-1a7dc7fe2fed",
        "name": "eCare_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          231
        ]
      },
      {
        "id": "03694350-7bd6-424b-9943-c1a9efce220c",
        "name": "Digital Sales (SnA)_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "df69f988-f1a4-4f01-ac6a-f1b75c2abf18",
        "name": "OS & Readiness_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f6e14007-238c-42a4-ba61-edf281d597ad",
        "name": "Retail Sales_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d5555b99-a034-43c3-8af8-a8964458e8e3",
        "name": "NEW_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9d714eae-b708-43af-b99f-91388914bea6",
        "name": "B2B Digital TouchP_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "03728117-cb36-4eb0-97fb-ec68f6c69085",
        "name": "New Normal",
        "structureName": nil,
        "heads": [],
        "employees": [
          2615
        ]
      },
      {
        "id": "d10546d0-6957-4a9e-9fc7-1b16373e995e",
        "name": "PK2_FacS",
        "structureName": nil,
        "heads": [
          144
        ],
        "employees": []
      },
      {
        "id": "70538d9f-54a6-404a-984a-e78f898e0cea",
        "name": "AD_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1990,
          2188,
          1451,
          1605,
          1522,
          1552
        ]
      },
      {
        "id": "4083b589-c8d6-4d69-888c-8585cc258763",
        "name": "MaVi_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2189,
          3446,
          3421,
          3682,
          3471,
          1279,
          2018,
          3643,
          3470,
          0,
          1354
        ]
      },
      {
        "id": "08f7db41-ea2d-4fda-9959-970e5da74d66",
        "name": "RAN Infrastructure_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2554,
          3611,
          3353
        ]
      },
      {
        "id": "79922196-1d48-40a2-a899-538b364da17a",
        "name": "Retail Sales_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "3d68b166-6e60-424e-8381-5c21ad504fbb",
        "name": "Access4Magenta_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7ea004f0-fcd6-456e-b760-d52b65c5c588",
        "name": "SKS WMS & Support_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3011,
          479
        ]
      },
      {
        "id": "24678eb1-2b33-4c92-bfe3-61f54608576c",
        "name": "CC Channels_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "71a13afc-faf5-4e2f-8525-e3ce9357584e",
        "name": "mbWERK",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          139
        ]
      },
      {
        "id": "b2d7a31f-f45f-4303-a14e-5901d31e141e",
        "name": "Wholesale Breitband_ITest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "154e4efb-984f-4fe9-bfe7-bc467e3d8173",
        "name": "Lead2Order_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "34df2f0c-9ffd-452d-9aed-ea44147cbf86",
        "name": "CybDef & IntSec_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a69aee67-4c67-4d04-af0b-d1cabed9cbf7",
        "name": "Fiber CoOp_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2806,
          3052,
          1435,
          2783,
          3119,
          3205,
          2849,
          3697,
          0
        ]
      },
      {
        "id": "9683ee6a-3342-4771-9a3b-7b8aad60b29a",
        "name": "TVPP_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d38d0d3f-7e0f-405e-b2e7-de259383f0a6",
        "name": "BSS Factory",
        "structureName": nil,
        "heads": [],
        "employees": [
          2252,
          615,
          2981,
          2360,
          2570,
          1064,
          2019,
          463,
          3094,
          414,
          376,
          629,
          1810,
          3007,
          2961,
          2521,
          2318,
          3166,
          239,
          150,
          1827,
          3112,
          1856,
          2439,
          2515,
          3008,
          1051,
          2603,
          3116,
          1230,
          3568,
          2240,
          2435,
          3047,
          1244,
          2984,
          2614,
          942,
          3563,
          3455,
          3128,
          675,
          2948,
          2928,
          2544,
          3087,
          3067,
          433,
          2907,
          2004,
          2355,
          724,
          2516,
          2119
        ]
      },
      {
        "id": "8711489c-1e5c-4469-bf4d-ca5bf2e8c92f",
        "name": "CybDef & IntSec_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          71,
          1846,
          1170,
          2017
        ]
      },
      {
        "id": "2b983cab-4d4d-4f95-9748-8ebd2df7cf57",
        "name": "SMK FF Einzeltest_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1044
        ]
      },
      {
        "id": "b9377d02-fb81-471f-81a2-00e80b75a4d7",
        "name": "B2B Digital TouchP_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "84e8c1b6-f330-4b72-a6d3-29a59f9b6618",
        "name": "MFP_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a20a4056-869e-40b5-958a-d47b2e6c74df",
        "name": "B2B Digital Off&Ord_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1a354d0a-1118-48a7-92d5-343b67ac2734",
        "name": "SMILE_JAVA_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          0
        ]
      },
      {
        "id": "c4cd9695-c395-4b2c-ad07-6a3d818a2221",
        "name": "Fieldservice_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "656bc34d-e1de-4c6a-9bb0-f38058e72529",
        "name": "TVPP_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1323,
          1802,
          176
        ]
      },
      {
        "id": "60ac2cff-2b74-4d37-9e32-a61845540c49",
        "name": "SKS WMS & Support_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          681
        ]
      },
      {
        "id": "54975964-e666-456c-a326-ff605a310e71",
        "name": "NCA_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1d4551a5-4c24-4ad6-bad1-533e1832af40",
        "name": "DS & ContentMngmt_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0e6fb36e-fb43-48ac-803b-0ccdb5bf5c21",
        "name": "ASF Product APIs_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          3123
        ]
      },
      {
        "id": "e882378b-ce84-4741-b140-9f1f385f604c",
        "name": "GigaBit",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5dad691e-be4e-4441-8eab-049f8a8312aa",
        "name": "NGSSM SMS ASS_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          225,
          1291,
          1621,
          1597
        ]
      },
      {
        "id": "99404790-34e1-4271-8f7d-b5e63619880b",
        "name": "SMK FF Einzeltest_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2720,
          2726,
          3129,
          1544,
          1538,
          99,
          771,
          1168,
          350,
          1387,
          530,
          2267,
          748,
          109,
          1216,
          941,
          2906
        ]
      },
      {
        "id": "4628e092-16d8-4081-b222-fd0519411ff4",
        "name": "ORAN",
        "structureName": nil,
        "heads": [
          525
        ],
        "employees": [
          3559
        ]
      },
      {
        "id": "e34754a4-e083-49ef-be17-8423e039a22a",
        "name": "Q-Cells",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          469,
          181,
          3220,
          139,
          915,
          3196,
          663,
          263
        ]
      },
      {
        "id": "45500750-5221-4bce-b90b-6fef1165c726",
        "name": "SSO_Hub_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "723d0b3b-7712-4e63-a700-3cf2dd38feb5",
        "name": "CI/CD_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          649
        ]
      },
      {
        "id": "d4465fd3-0e21-40a6-a2ba-84727e85042e",
        "name": "Z_No Hub_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b497362e-c742-471a-8936-a8b11ba008ee",
        "name": "TAFEL2000_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          298
        ]
      },
      {
        "id": "d8764550-7f60-49e5-87a9-17e780afe3ba",
        "name": "ASF Product APIs_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a983cb93-be45-4a17-b98f-87fcd914bc73",
        "name": "Whole Sale_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3187,
          3062,
          3558,
          1838,
          2833,
          3060
        ]
      },
      {
        "id": "e7b8a28d-766e-4bb8-8594-6b1dabab291d",
        "name": "ASF Product APIs_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d11c3440-fbc9-432e-8189-ea5529aa8c06",
        "name": "ASF Customer APIs_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "84ed07c2-fd80-4109-8713-a845b0971a4b",
        "name": "Future Diagnostics_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2ea0369c-05fe-4611-a945-fedf09856ace",
        "name": "ASF Customer APIs_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2736,
          1741,
          2381,
          2166,
          3647,
          2082
        ]
      },
      {
        "id": "a14ab145-7675-44b5-8307-a9e2b86aff43",
        "name": "B2B Digital TouchP_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          279,
          314,
          1999,
          1301,
          402,
          505,
          1084,
          400,
          304,
          0
        ]
      },
      {
        "id": "34b9a2bb-76ba-4b80-a59d-a119d87834c4",
        "name": "CIM HUB_BOP_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2520
        ]
      },
      {
        "id": "f9ec7542-4bfe-467d-9522-db17c1c59272",
        "name": "Simunye_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          3178
        ]
      },
      {
        "id": "40355e08-c75c-4f64-817d-fec080e5f217",
        "name": "Gigabit_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          958,
          2078,
          2366,
          375,
          1405,
          1834,
          1187,
          2218,
          780,
          1330,
          2450,
          2964,
          1773,
          2093,
          8
        ]
      },
      {
        "id": "8baa4c83-7306-41e4-82ad-21703fddbc33",
        "name": "B2B Digital TouchP_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a5d963e5-2cba-4ae8-8a4c-4e21933c4452",
        "name": "FSL",
        "structureName": nil,
        "heads": [
          2533,
          2669,
          3627
        ],
        "employees": [
          3609,
          3486,
          1733,
          3543,
          3017,
          3516,
          3452,
          3657,
          3349,
          3514,
          3662
        ]
      },
      {
        "id": "9ddb6b5e-a995-4824-86cf-5f7d5eb19969",
        "name": "ECC",
        "structureName": nil,
        "heads": [],
        "employees": [
          3567,
          3556
        ]
      },
      {
        "id": "0d35e9c1-0e6a-464d-998b-14faf05d95f1",
        "name": "ODL_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          2836
        ]
      },
      {
        "id": "cd941909-e5dd-4c1c-9cf3-ee6f3bb67388",
        "name": "FlexProd_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3631,
          3579
        ]
      },
      {
        "id": "43e78c25-d87c-445f-b14c-74e6d7f0c64e",
        "name": "CA-SM_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          2192
        ]
      },
      {
        "id": "ae15aea8-127b-410d-9c1c-10c243ebad9f",
        "name": "WMS Technik_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          3667,
          889,
          59,
          168,
          447,
          1816,
          1867,
          137,
          246,
          785,
          1060,
          3569,
          1085,
          3523,
          62,
          1513,
          2242,
          146,
          70,
          3162,
          1735
        ]
      },
      {
        "id": "22b8210a-d5f1-4e5d-9168-e3258dba54d3",
        "name": "AutoBBE(non DTIT)",
        "structureName": nil,
        "heads": [],
        "employees": [
          678,
          3376,
          1858,
          1534,
          258,
          1821
        ]
      },
      {
        "id": "11387588-747f-4e13-8005-e1a61f007dd7",
        "name": "RAN Infrastructure_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "773a77fc-72da-4ac7-a6cb-971781a7d802",
        "name": "B2B Voice & Partner Products Provisioning",
        "structureName": nil,
        "heads": [],
        "employees": [
          2473,
          1705,
          1953,
          1600,
          352
        ]
      },
      {
        "id": "aeaf59c4-ff18-4987-aa12-b8ae47f48c60",
        "name": "GK-Portale_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          2500,
          1904,
          3023,
          251
        ]
      },
      {
        "id": "d07dc4d2-282e-4218-9e48-8555707d5be7",
        "name": "Retail Sales_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f0c5a978-13a3-440c-ad37-9cee7c90c853",
        "name": "DigiBSS_FacM_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2054
        ]
      },
      {
        "id": "522b374d-5165-4546-821e-403bf3f57d96",
        "name": "GFNW_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          541
        ]
      },
      {
        "id": "6f8ac7fb-8020-446d-8f97-908d449689df",
        "name": "CybDef & IntSec_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2131
        ]
      },
      {
        "id": "54550ce6-c78a-43ef-9ee0-b026c846c14b",
        "name": "Neva_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2455
        ]
      },
      {
        "id": "fed84725-91e7-4cc3-8244-533fc3ffc90d",
        "name": "SMILE_JAVA_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2113
        ]
      },
      {
        "id": "e6c04747-1ea0-4b71-aee7-2d5641755ccc",
        "name": "S2P_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a358a299-6430-4a61-87df-3220642ede41",
        "name": "KonKal_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2877,
          1898,
          1275,
          1289
        ]
      },
      {
        "id": "83007f29-6766-4131-876d-4c88307e7957",
        "name": "Real Estate Mngmt_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8f716060-12c6-47cb-ae52-a1af5cfce485",
        "name": "Gigabit_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1448,
          1308
        ]
      },
      {
        "id": "06196455-0709-41b2-bffc-4ff7bcc0758f",
        "name": "NT Common Testing",
        "structureName": nil,
        "heads": [
          1317
        ],
        "employees": [
          3565,
          3544,
          3147,
          3621,
          3339,
          3595,
          3121,
          1629,
          3479,
          2448,
          3139,
          1630,
          3465,
          3113,
          3592,
          3528,
          1662,
          2209,
          1926,
          2369,
          3073,
          3527
        ]
      },
      {
        "id": "f73449d3-1d91-4c3d-95c3-13e4303c5690",
        "name": "eCare_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2304
        ]
      },
      {
        "id": "6dde1e6e-a356-4586-a2d2-965f70ae4284",
        "name": "KonKal_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1955,
          1775,
          3461,
          268,
          1620
        ]
      },
      {
        "id": "5dde150b-3f0c-4a63-8cc3-23d5bf3e31f9",
        "name": "E2E Assurance_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          698,
          1102,
          302,
          2303,
          1954,
          1698,
          233,
          665
        ]
      },
      {
        "id": "49966afe-76ae-41ee-954f-25a9b5bf4342",
        "name": "POM_FacN_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1934
        ]
      },
      {
        "id": "d6fceae0-dad4-4164-b7c5-b3d9f9edc094",
        "name": "OFI RE-FX_FIN&SCM_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          735,
          1686
        ]
      },
      {
        "id": "4d98036f-c85e-4095-9a56-4b3811491a88",
        "name": "VRE_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          606,
          1304,
          1702
        ]
      },
      {
        "id": "83046393-8d4d-4e9f-b672-4d660ab563ae",
        "name": "RLP",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          3206,
          2459
        ]
      },
      {
        "id": "19116e15-ac54-4ef8-b823-bbf17f3d5468",
        "name": "Network Transform_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3678
        ]
      },
      {
        "id": "3cafd2c0-80e2-46fc-9d3b-d0e68f599715",
        "name": "SP Test_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "eed0f368-e431-4bff-a9ab-ff814d277ef5",
        "name": "Audi KSL",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          3239,
          901,
          139
        ]
      },
      {
        "id": "525376b4-3c94-419f-9f26-9b41b39f049d",
        "name": "Phantom_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2f06e3a9-deae-45b7-af1d-c4499d175e75",
        "name": "Access4Magenta_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f83294c2-e2c3-4076-bf0b-7ecef31f0e36",
        "name": "S&FOut_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "47c7de18-c8d3-4e23-9fd5-b83939af8e20",
        "name": "B2B Digital Off&Ord_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "83d4d8ac-6b65-40c4-b4a0-aa4e1ed6bc84",
        "name": "PMW_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e622baae-115d-4961-b4e6-40d30c6e4fe5",
        "name": "Whole Sale_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          2951,
          1259
        ]
      },
      {
        "id": "e6bd34a1-14b1-4438-86fb-5301d53b715f",
        "name": "TVPP Support_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          194,
          1802
        ]
      },
      {
        "id": "a7766dcf-77bd-4dca-aa0e-b6394c87c1e9",
        "name": "Access4Magenta_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1981f863-825c-46ab-bbef-6440988f4ea7",
        "name": "Perfas+(non DTIT)",
        "structureName": nil,
        "heads": [],
        "employees": [
          1970,
          1303,
          3230,
          3688,
          3319,
          3130
        ]
      },
      {
        "id": "884cb216-fd89-49d6-bf77-01085b4f449b",
        "name": "Agile Academy_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d04bcfa8-a9ef-49a3-9dd5-d3d8813596e8",
        "name": "Toolkonsolidierung_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "3699db88-7ff3-431a-95a1-c0e49581ba2c",
        "name": "T-Map_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1910
        ]
      },
      {
        "id": "eef5df24-d11a-4806-b6cf-194c60d2571b",
        "name": "Access4Magenta_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ed3ee329-97af-4e6a-831a-747fb2ada704",
        "name": "Jump Start",
        "structureName": nil,
        "heads": [
          656
        ],
        "employees": [
          3564,
          3189,
          3317,
          3431
        ]
      },
      {
        "id": "a144382a-67d4-48ba-aea0-9ad8bbc9f594",
        "name": "Access4You_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2333,
          743,
          3680,
          1911,
          820,
          2639,
          1752,
          696,
          1333,
          3685,
          854,
          1133
        ]
      },
      {
        "id": "6394647f-ba6c-490b-bf80-e803582a8b07",
        "name": "T-Map_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          371
        ]
      },
      {
        "id": "40286eda-af4f-432f-be1e-5faa0719cafe",
        "name": "Retail Sales_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "754d2104-5657-45ec-b249-02ef6eae7764",
        "name": "OS & Readiness_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1a8a67ca-05e5-4ed4-9c4f-a56b20d399f7",
        "name": "CIM HUB_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7f20cf19-5d9a-461f-9fab-9e19349fcd3b",
        "name": "ASF Product APIs_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4235b1ac-5b7b-4748-a339-b34224e3435d",
        "name": "Robotics & A&AI_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "3734f8f5-26f9-4f21-bbfa-a7e8d5c1a076",
        "name": "CCoE_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1804
        ]
      },
      {
        "id": "4651d457-5e25-49d4-8039-ef32930b621e",
        "name": "RMK AT_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9cc62e4c-4838-4d53-a624-4ff983255135",
        "name": "AD_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          599
        ]
      },
      {
        "id": "fb1f7dca-8e40-42f8-ba94-b98e3702b1b9",
        "name": "CA-SM_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3684
        ]
      },
      {
        "id": "65267f70-bc29-45dd-afe7-0c9473a8c5e4",
        "name": "KonKal_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b0dc5bce-70fc-44bb-b978-83c7cc3bc1a0",
        "name": "UCARS",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          3212,
          1913,
          3307,
          357,
          3422,
          3492,
          3197,
          425,
          3215,
          3042,
          3548,
          2587,
          3354
        ]
      },
      {
        "id": "d56db8b2-00b7-484f-8812-388719099e12",
        "name": "Test Automation_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "71d07683-28a4-4bd0-97f7-d848c633b356",
        "name": "Fieldservice_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7770485e-4cbb-4cea-aa1a-7ef53348ec04",
        "name": "TAFEL2000_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          125
        ]
      },
      {
        "id": "33448c8f-1d9b-4dbd-845b-0b598d74e919",
        "name": "TComPr_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          67,
          247
        ]
      },
      {
        "id": "aa120a2c-a585-4565-9ff6-c02afefaa01b",
        "name": "SKS WMS & Support_P&S_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "43e7a542-86e9-458a-b137-44f2ca395bb2",
        "name": "Sec,Risk,Compl_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2016,
          1027
        ]
      },
      {
        "id": "bc7929d1-65fb-4d1a-82cf-3cedd6affa1f",
        "name": "Core Finance_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ef4e959a-d134-4b01-b245-a5026d874ca0",
        "name": "PUT (NTO Hub)_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1407,
          373,
          0,
          826
        ]
      },
      {
        "id": "be3f49a2-42aa-48c0-8744-20569df7a719",
        "name": "BEP_DSOps_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1896
        ]
      },
      {
        "id": "eb306553-c5d3-4b3a-ae66-ed442d429f6f",
        "name": "PUT (NTO Hub)_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e896c974-d87d-4296-b111-7f005a597406",
        "name": "Black Belts",
        "structureName": nil,
        "heads": [],
        "employees": [
          2097,
          3390,
          3456,
          913,
          3389,
          2007,
          3494
        ]
      },
      {
        "id": "d8834b66-7840-4b16-9374-f54aac07bf04",
        "name": "ServiceNow Solution Business",
        "structureName": nil,
        "heads": [],
        "employees": [
          1254
        ]
      },
      {
        "id": "3f2fb5ca-98f2-4bda-aeac-5de2965b5dc4",
        "name": "NGSSM SMS ASS_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2729,
          2585,
          3003,
          2357,
          2583,
          3002,
          2359
        ]
      },
      {
        "id": "a620baf2-9085-4dff-80bd-0dc61f10a6c1",
        "name": "B2B Digital TouchP_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ae053dab-843d-415c-8d06-58a4b46d2c8d",
        "name": "CI/CD_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          3475,
          1200,
          3133,
          2675,
          694,
          3655,
          2788,
          2241,
          2741,
          41,
          3401,
          3644
        ]
      },
      {
        "id": "7c0ea2e2-c42a-4451-bb22-ba2fbd588a96",
        "name": "Core Finance_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "69dd79b3-dc31-40f8-8c58-a47635bebeef",
        "name": "PUT (NTO Hub)_SWEBE_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8f1c8f75-cd0c-4555-aa7d-7251e291313a",
        "name": "MAD/ PersDispo_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "647b777f-2faf-49b5-a19d-43028d9b1bbd",
        "name": "EETS@BAG_2019",
        "structureName": nil,
        "heads": [
          2013
        ],
        "employees": [
          26,
          3299,
          3398,
          1476,
          372,
          2457,
          60,
          1388,
          1555,
          1264
        ]
      },
      {
        "id": "0948d4e8-7df6-4a14-b8cf-00a4e090f236",
        "name": "IP2",
        "structureName": nil,
        "heads": [],
        "employees": [
          2173,
          910,
          3359,
          3019,
          3045,
          3242
        ]
      },
      {
        "id": "ca130a3a-9129-4c71-a9fb-e8b06ec454c6",
        "name": "Gigabit_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2899,
          2957,
          1811,
          2610,
          1886,
          3066,
          1841,
          679,
          2612
        ]
      },
      {
        "id": "ce574915-ae21-4b7c-b6c1-f60beabfa9a3",
        "name": "OneApp_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          199,
          3107,
          203
        ]
      },
      {
        "id": "eebe70ac-71d1-4e49-b648-d9bcf1109087",
        "name": "Medina",
        "structureName": nil,
        "heads": [
          2669
        ],
        "employees": [
          656,
          843,
          386,
          728,
          3511
        ]
      },
      {
        "id": "3a5de162-b522-4ca7-8da7-9cbab24a7048",
        "name": "KolloDB_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1531
        ]
      },
      {
        "id": "4d2874f2-32ca-484a-b753-0ac2774170f4",
        "name": "Retail Sales_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "60869593-4337-4e35-b734-dd380136e9b4",
        "name": "Access4You_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0d5026b1-f910-4fea-ad3c-fa197e95a187",
        "name": "WMS TK_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2801
        ]
      },
      {
        "id": "a38dc153-5202-4543-a3c8-b5ac623f472f",
        "name": "CybDef & IntSec_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          991
        ]
      },
      {
        "id": "0b02e04b-5a25-4618-97c5-0741aef03da2",
        "name": "REM/GSUS_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "703373f9-ec9f-49a6-8983-a3fcb9dbc05a",
        "name": "DeTeFleet_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          1457,
          348
        ]
      },
      {
        "id": "53e2ffa5-6a7c-4bc9-b799-6d21c122408f",
        "name": "T-NAP_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3443,
          1672
        ]
      },
      {
        "id": "48e6271d-d79c-41c1-952b-42a6d2f73911",
        "name": "TARDIS_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2222
        ]
      },
      {
        "id": "3b5c1f71-d21e-472e-b910-74209636c3b1",
        "name": "eCare_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1922
        ]
      },
      {
        "id": "229418ec-72fb-4223-bd53-c309900b1642",
        "name": "FM-IP (NCA Hub)_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1785,
          1673
        ]
      },
      {
        "id": "ec0cad01-be10-462f-9613-c7d45921a7dd",
        "name": "Z_No Hub_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "58482fc6-23b3-4783-9a66-f617e69a3002",
        "name": "Phoenix_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1725,
          1704,
          1909,
          1998
        ]
      },
      {
        "id": "09fdd68f-ea6e-472c-87f5-ecfa808a24e7",
        "name": "T-Map_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1507,
          1326,
          3658
        ]
      },
      {
        "id": "38eda886-f56e-4c07-9c8f-540469416d3e",
        "name": "Fieldservice_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9c047559-8b5a-41a8-be1b-1c621b6cd893",
        "name": "BLSTKP 43_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          151,
          2989,
          110,
          506
        ]
      },
      {
        "id": "cdec964a-e9b3-4b30-ace0-2b4262e555c9",
        "name": "Dummy Project 1",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2dfb8e35-41d1-4101-8c49-516769b809fd",
        "name": "NN_project",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fbb46d8f-9aa5-419b-8fa5-2f2bc2769043",
        "name": "Retail Sales_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9b2dfa8f-7fa6-49c7-9754-068c298619b7",
        "name": "WMS TI _STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ee6f4e54-b79a-4c4b-86de-57011e7969b0",
        "name": "FTTH Factory_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d398fd6a-2322-493f-b2eb-06ad2de12fdb",
        "name": "Vamosa",
        "structureName": nil,
        "heads": [
          1271
        ],
        "employees": [
          3255
        ]
      },
      {
        "id": "5d4b352e-6666-4d4d-aa98-5d056410286b",
        "name": "Real Estate Mngmt_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "25dc1582-aed1-49e2-ba6a-ed2380ac1244",
        "name": "ASF Product APIs_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1463
        ]
      },
      {
        "id": "f00b1007-aeee-4815-b3d5-de7d92d74c79",
        "name": "Phoenix_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3536,
          3478,
          1572,
          1726,
          2553,
          3020,
          1935,
          1637,
          3423,
          3098,
          2167,
          384
        ]
      },
      {
        "id": "e500f127-30b6-4979-af8f-58869e8190de",
        "name": "ER Integration_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f336c393-2c98-4434-8e44-8bd8f3b41e3b",
        "name": "Digital Sales (SnA)_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "957f9616-1eba-4cc5-851f-712535b6a2e7",
        "name": "AM@BSO Portale_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          846
        ]
      },
      {
        "id": "018d5581-8187-4169-86c9-79351e5dd57d",
        "name": "TARDIS_FacM_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          577
        ]
      },
      {
        "id": "0341577c-be5a-43cc-b19f-e4288587c1e1",
        "name": "NDI_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2979
        ]
      },
      {
        "id": "6a3eca5d-ec5e-4c41-b82a-0e8d46cec74d",
        "name": "Z_No Hub_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fe712794-9a4a-4718-be10-75394d1393ad",
        "name": "CA-SM_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          2214
        ]
      },
      {
        "id": "53ea172c-a117-415d-9699-08df1aea3608",
        "name": "SBB ZPS",
        "structureName": nil,
        "heads": [
          778
        ],
        "employees": [
          429,
          1056,
          544,
          1003,
          1900,
          1995,
          3614,
          1039,
          377,
          437,
          2039,
          2484,
          3510,
          3234,
          1167,
          2024,
          987,
          321,
          3508,
          2996,
          3302,
          622,
          844,
          1749,
          2250,
          2785,
          3541,
          2298,
          3092,
          1497,
          893,
          979,
          2201,
          2136,
          360,
          428,
          1348,
          1437,
          2249,
          3305,
          1986,
          3342,
          437,
          1409,
          1255,
          346,
          1441,
          186,
          3481,
          3429,
          1545,
          2328,
          305,
          1713,
          1697,
          625,
          3247,
          1852,
          2978,
          509,
          2479,
          365,
          2739
        ]
      },
      {
        "id": "065333f1-a169-4669-91e0-b936ed1ef567",
        "name": "SEAL [Service On]_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          343,
          647,
          1879,
          1659,
          162,
          3012,
          2535,
          944
        ]
      },
      {
        "id": "7bf9d03e-4ec2-429a-9295-e34f79bf8974",
        "name": "Future Diagnostics_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1bc2d3f7-230f-460f-9233-99654c314e5f",
        "name": "AD_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2630,
          2470,
          870,
          3519,
          3628,
          9,
          3576,
          3095,
          2225,
          3428,
          1719,
          1498,
          1991
        ]
      },
      {
        "id": "e3f02e82-0ac2-4b7e-a93c-8ade7a4483b4",
        "name": "KonKal_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          977
        ]
      },
      {
        "id": "76e626c1-d79a-4988-a890-0e546bce1b55",
        "name": "Roth and Pertners",
        "structureName": nil,
        "heads": [],
        "employees": [
          555
        ]
      },
      {
        "id": "35803649-daf6-43f8-aa32-35f1a6b73574",
        "name": "OneApp_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3571,
          1107,
          2035,
          1884
        ]
      },
      {
        "id": "27795615-c2ac-4867-a535-46756ed55129",
        "name": "T-Plan Teams",
        "structureName": nil,
        "heads": [
          2059
        ],
        "employees": [
          2630,
          2944,
          3095
        ]
      },
      {
        "id": "c0e7f93d-5bd9-48e8-af24-32b75e53b9ac",
        "name": "BSS Factory AMM (3)",
        "structureName": nil,
        "heads": [
          103
        ],
        "employees": [
          568,
          3279,
          2682,
          232,
          2015,
          2696,
          2670,
          2475
        ]
      },
      {
        "id": "111de6b8-9ced-4836-9764-593aa6ebc24d",
        "name": "TARDIS_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1691
        ]
      },
      {
        "id": "0869e4fd-5640-494b-b4c5-a3d45c214d0e",
        "name": "ALMV_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          444,
          2723,
          2451
        ]
      },
      {
        "id": "165808d5-7016-49a3-a380-824af6b76b19",
        "name": "TCom PR",
        "structureName": nil,
        "heads": [],
        "employees": [
          93,
          247,
          67
        ]
      },
      {
        "id": "998555cf-dacd-4080-8b5b-8929eb85ccd5",
        "name": "AC Centric_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7db7dc0f-9880-4e08-aa74-c3a668a27f47",
        "name": "RMK AT_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1fe44c1d-15c8-409d-b879-3cf2f7c0f197",
        "name": "ASF Product APIs_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          451
        ]
      },
      {
        "id": "d31844b5-8914-482b-8fd0-7b6dc12a9509",
        "name": "GFNW_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          3043,
          2724,
          3495,
          3208,
          3071,
          601,
          3410
        ]
      },
      {
        "id": "9b4cd9b5-e6a0-458d-b7b2-995b8dae606e",
        "name": "Phantom_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7b694f1e-9b8e-4411-92fb-b9c0d46b022e",
        "name": "ITCS",
        "structureName": nil,
        "heads": [
          3561
        ],
        "employees": [
          3622,
          3487,
          3665,
          3449,
          2993,
          3192,
          3141,
          3352,
          2193,
          3171,
          2000,
          3573,
          3054,
          3413,
          3435,
          3015
        ]
      },
      {
        "id": "e37aef16-415e-43b1-b63c-fd79c813f79a",
        "name": "Access4You_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1349,
          1989
        ]
      },
      {
        "id": "98c1c370-48a7-4461-8d08-19ce522adac9",
        "name": "SKS WMS & Support_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          84,
          729,
          1074,
          1880,
          907,
          1579,
          253,
          1442,
          2985,
          1864,
          2664,
          147,
          1210
        ]
      },
      {
        "id": "dac09ce1-c4c3-4e80-aa8b-b048f7518f61",
        "name": "MMS Test",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          992,
          236,
          2276
        ]
      },
      {
        "id": "2b6a67b7-c1af-4f92-b287-1a01b0d7aa8c",
        "name": "MaVi_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          714,
          2601,
          2632,
          2058,
          2122
        ]
      },
      {
        "id": "bfc4d191-c377-465c-b169-30e30af57f70",
        "name": "MaVi_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          733
        ]
      },
      {
        "id": "2b663fae-9a69-4f78-8ae6-9d71c1cde3e0",
        "name": "TSI Order to Cash",
        "structureName": nil,
        "heads": [],
        "employees": [
          1254
        ]
      },
      {
        "id": "2a740cc5-a659-4bf4-97cf-581183735286",
        "name": "PSL International_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ab559401-2450-4ee6-aff3-574d4ef606f4",
        "name": "eCare_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "dddc5385-d3e5-442a-b7e2-2a7ac8a4506b",
        "name": "SeCe-IT_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1568,
          1122
        ]
      },
      {
        "id": "e84a3385-b61a-450d-8c41-a54ebc43c879",
        "name": "eCare&TVPP PT_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c5179c05-c331-4a7d-9f34-acb0091038ea",
        "name": "TAFEL2000_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1093,
          297
        ]
      },
      {
        "id": "b8a36d01-5106-4629-9d8d-4fc4227cba99",
        "name": "Fiber CoOp_STest_Service_NoVAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1524,
          668
        ]
      },
      {
        "id": "e8441869-d069-4955-b070-c83b950ba416",
        "name": "WMS Technik_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3648,
          3677,
          997,
          2158
        ]
      },
      {
        "id": "9e87bff2-aa3b-4141-8cd4-c8fe90249676",
        "name": "Fiber CoOp_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2728
        ]
      },
      {
        "id": "32df501a-6a9f-47b3-92f8-288a757bee3a",
        "name": "BEAR_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2aec678a-b6ac-4813-af80-ca7439ae30e3",
        "name": "Access4You_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2308,
          2705,
          1146
        ]
      },
      {
        "id": "50d4aff6-0bf9-4b5a-8cae-90043d9cc234",
        "name": "DiVers",
        "structureName": nil,
        "heads": [
          656
        ],
        "employees": [
          3327,
          3387,
          2264,
          3374,
          3477
        ]
      },
      {
        "id": "bcef8835-3859-4c49-9218-1088888a8db9",
        "name": "WOM_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4a7ff29a-716d-4f05-a098-b15b7b406860",
        "name": "CI/CD_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2273
        ]
      },
      {
        "id": "a97aeaf3-5b5d-4f99-a4e6-5fdfc1ea887d",
        "name": "Retail Sales_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "783712c2-6f7f-4ebe-8773-4c3f305b8296",
        "name": "VAR Support",
        "structureName": nil,
        "heads": [
          436
        ],
        "employees": [
          469,
          181,
          3239,
          915,
          3150,
          320,
          3220,
          3196,
          159,
          3218,
          563,
          3224,
          2494,
          663
        ]
      },
      {
        "id": "d92333c1-a081-4491-9a58-0f236224cd57",
        "name": "AC Centric_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9a8cb79e-0b3b-48d7-bb98-7267405c68da",
        "name": "Test Automation_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4f62e881-08e9-4d79-9f63-f4e0db26089f",
        "name": "SIMPLE_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1137,
          238,
          1180
        ]
      },
      {
        "id": "6e7f9cb0-819a-417e-b6e0-1fc12bd32567",
        "name": "Retail Sales_ITest_Service_No VAT.",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "70f582c3-6bc8-4ad3-86a3-81ef2070480d",
        "name": "CRM FN_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "51fd6316-b54e-48df-a3b8-7ac604d772ec",
        "name": "OTN",
        "structureName": nil,
        "heads": [
          3651
        ],
        "employees": [
          1028,
          3244,
          3451,
          3384,
          3466,
          3249
        ]
      },
      {
        "id": "b78971d6-083b-416f-a40b-bc62c470dd89",
        "name": "B2B Digital Off&Ord_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "181b0dc3-8df4-43c2-b012-c939feffc1d9",
        "name": "MMS Mobile",
        "structureName": nil,
        "heads": [
          2013
        ],
        "employees": [
          3472,
          2172,
          2969,
          2492,
          2878,
          3233
        ]
      },
      {
        "id": "5284c319-fd65-49b8-ade3-d54f6d057528",
        "name": "Real Estate Mngmt_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1daccf54-f2b6-4fd3-9f01-89aad8decb50",
        "name": "SF & Legacy_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "df98ebc3-3ce3-4403-8066-60fa6433b55a",
        "name": "CA-EM (NCA Hub)_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          79
        ]
      },
      {
        "id": "a29b1f98-a4bf-4bb0-b746-6f7e79970812",
        "name": "IC-P_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2314,
          954
        ]
      },
      {
        "id": "7f1efef6-e6b2-4001-a180-fae8b4aa4730",
        "name": "MDP",
        "structureName": nil,
        "heads": [
          3529
        ],
        "employees": [
          3526,
          2067,
          2661,
          3257,
          2924,
          3397,
          3370,
          3293,
          3369,
          3356,
          1716,
          2855,
          2522,
          1306,
          845,
          1997,
          2713,
          3134,
          3262,
          2725,
          766,
          2698,
          3338,
          905,
          2722
        ]
      },
      {
        "id": "35f0d5c1-38e8-4e95-9fae-9755b301ae64",
        "name": "NCA_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "12f09a78-0a84-4c91-aae1-63b8b0ec3701",
        "name": "DigiSig IoT",
        "structureName": nil,
        "heads": [
          358
        ],
        "employees": []
      },
      {
        "id": "93a2fb1a-3ef0-4ade-aa39-f14d845af877",
        "name": "Global AD SSC",
        "structureName": nil,
        "heads": [],
        "employees": [
          3661,
          2396,
          2638,
          2386,
          657
        ]
      },
      {
        "id": "c0016d38-5282-4705-8589-18c418b1e6b2",
        "name": "Phantom_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "34d5d3d1-0223-4536-9e62-9005083c28d0",
        "name": "ER Integration_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "211d6014-b475-46f2-b7d6-9553d12b9040",
        "name": "ECM Type Master",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          2591,
          2137,
          1791,
          535,
          3525,
          2963,
          2321,
          3254,
          2613,
          2363,
          2631,
          2407
        ]
      },
      {
        "id": "47eec8ab-8a84-4fc7-8b8d-3b536b24dcd7",
        "name": "E2E Common Testing_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "55e8f5b7-47ca-4be0-ba40-c76c8a68bf3c",
        "name": "SKS WMS & Support_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          1143,
          1427
        ]
      },
      {
        "id": "9ead361a-cda1-40a0-9e8d-1586cd0219d3",
        "name": "GK-Portale_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2285,
          538,
          1928,
          658,
          1766,
          470,
          662,
          1664
        ]
      },
      {
        "id": "b0baf49a-fdee-4d1d-8a4c-6697aa0cc68d",
        "name": "MMCR",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          816,
          2841,
          2459,
          3575
        ]
      },
      {
        "id": "6ff3c629-db9a-4b84-ae1c-3ab5b753e10a",
        "name": "VRE_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1256
        ]
      },
      {
        "id": "c15e9e6e-1824-487e-bcfd-bb0216a7d37a",
        "name": "FSFactory_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          37,
          50
        ]
      },
      {
        "id": "bd05b7b8-a36e-40e1-8b6f-744f187068c7",
        "name": "X-ProMT_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8007c37e-489d-4569-a2f0-3ebb68160784",
        "name": "Fiber CoOp_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3670,
          3524
        ]
      },
      {
        "id": "cd528ee6-f92e-4777-bc38-d5556df455f4",
        "name": "SKS ES_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          1372
        ]
      },
      {
        "id": "cd2ec4c5-6a39-4a10-b4ca-93b55224b64b",
        "name": "mShop_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5188a552-249c-4452-91b9-064e21f0717c",
        "name": "RMK AT_FacS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1245
        ]
      },
      {
        "id": "dbc81fdc-6477-4e5c-a8ef-6e3cd01e0922",
        "name": "PUT (NTO Hub)_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ae68b91f-84a9-4f26-b2c2-68c0dea30cf0",
        "name": "Telecom Rent",
        "structureName": nil,
        "heads": [],
        "employees": [
          1406
        ]
      },
      {
        "id": "88c988ec-5fe3-4b01-b2ac-69a333333750",
        "name": "FM-IP (NCA Hub)_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          672
        ]
      },
      {
        "id": "f640f720-d37e-486e-a147-d6e85b320fbb",
        "name": "GIS FNI_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1963
        ]
      },
      {
        "id": "c0bdc78a-93b1-4d0e-90a6-45ea998bd709",
        "name": "Simunye support_TI part",
        "structureName": nil,
        "heads": [
          159
        ],
        "employees": [
          116,
          3220,
          3224,
          320,
          3218,
          436,
          3196,
          263
        ]
      },
      {
        "id": "fdea8274-65cf-4124-b6a5-69a0bcd433cb",
        "name": "Travel portal support_TI part",
        "structureName": nil,
        "heads": [
          93
        ],
        "employees": [
          2507
        ]
      },
      {
        "id": "159d0698-f256-471f-892a-a8fbefef9ae3",
        "name": "Network Transform_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2972
        ]
      },
      {
        "id": "2d757c17-6157-474d-9ea1-97765fec2021",
        "name": "HeliOSS_FacN_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2679
        ]
      },
      {
        "id": "ac4359fd-dfcc-428d-952d-c990d7dc393b",
        "name": "BI-TS (FICO DWH)_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1184,
          917,
          2089,
          1186
        ]
      },
      {
        "id": "eb357096-2cc2-43cd-9c8e-e1947ac8e248",
        "name": "SMILE_JAVA__Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          345
        ]
      },
      {
        "id": "568b7e7c-e82c-4f82-a20f-2ff0e4d8bfb2",
        "name": "SMK FF Einzeltest_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          112,
          1045,
          883
        ]
      },
      {
        "id": "49e12ea9-5a03-4c0a-a979-9b8440e80b5c",
        "name": "MAD/ PersDispo_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7d60ac22-ce2b-4b94-8be2-93ba115e57fa",
        "name": "NCA_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4dbddf59-553e-4e88-bd51-6c300203b618",
        "name": "BISS KDM_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          416
        ]
      },
      {
        "id": "21ac41b4-abcb-4747-81bb-ea47e81e8bc4",
        "name": "Miracle",
        "structureName": nil,
        "heads": [],
        "employees": [
          939,
          2007
        ]
      },
      {
        "id": "48a8d460-9cfa-42db-a247-2fb978a8bd07",
        "name": "mShop_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "794f7d18-f1c2-4b9e-98a5-1e8d04a84f5e",
        "name": "FTTH Factory_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          528,
          1250,
          2261,
          526
        ]
      },
      {
        "id": "aa1ad61d-481e-4aac-a478-8ef9070a8c57",
        "name": "GFNW_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7d179c4d-5634-476b-993f-f5148c8b9d9f",
        "name": "FM PDH/SDH_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1531
        ]
      },
      {
        "id": "2fdf03c5-d031-4e70-9695-8ec5ce949402",
        "name": "CTO Office",
        "structureName": nil,
        "heads": [],
        "employees": [
          1708,
          0
        ]
      },
      {
        "id": "14295218-8f60-4f49-b2db-56dc716f078c",
        "name": "Future Diagnostics_ITest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e410d8d8-4e8a-468d-a4d5-a0fc433312c2",
        "name": "CA-SM_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1648,
          1371
        ]
      },
      {
        "id": "9ec9dd5f-0ce5-4bad-b49e-4c218c9b8af9",
        "name": "Digital Sales (SnA)_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "963271b4-4b27-42ac-b011-658b4dc160ae",
        "name": "FlexProd CM_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2653,
          1030,
          1477,
          2405,
          651,
          3586
        ]
      },
      {
        "id": "814ece9b-1536-40ce-85db-dcab39388a1d",
        "name": "WOM_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "458a65bb-a32b-4538-b3a1-def09c35ee63",
        "name": "MDO",
        "structureName": nil,
        "heads": [],
        "employees": [
          3426,
          3467,
          3416,
          3402,
          3393
        ]
      },
      {
        "id": "17857b54-c88a-40bb-bb88-5107e24450fe",
        "name": "FlexProd_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fc5c3243-ac6c-4524-9904-1a75b3078c23",
        "name": "B2B Digital TouchP_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          3669,
          3028
        ]
      },
      {
        "id": "bba27e53-629d-421d-ae7f-6ad75025915d",
        "name": "DS & ContentMngmt_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "94775db2-2aa8-437f-a98a-feeb1eb39088",
        "name": "CRM FN_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "522ae884-f6b9-4f65-bc75-4bb2921f64df",
        "name": "AD_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          450,
          21
        ]
      },
      {
        "id": "d8498455-ecfa-4ea2-9336-7fc20c29fe29",
        "name": "Gigabit_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1530,
          922,
          2176,
          3379,
          1932,
          2034,
          1161,
          1897,
          1891,
          963,
          1047,
          1585,
          1803,
          2229,
          882,
          1887,
          1375,
          3099,
          3137,
          1299
        ]
      },
      {
        "id": "e022e1d7-7d61-4a9e-8dcb-fb013390ecfe",
        "name": "Gigabit_FacM_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          711
        ]
      },
      {
        "id": "1cd5b2b8-c8ea-4444-9af5-ae63c6a0e03d",
        "name": "TASI",
        "structureName": nil,
        "heads": [
          3601
        ],
        "employees": [
          2587,
          3214
        ]
      },
      {
        "id": "00931ae2-291e-4af9-9d32-d2452ed317c1",
        "name": "Access4Magenta_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9c388269-8348-4bd3-9f14-f482165ade8a",
        "name": "SAVE-T and DRM_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "68c3396b-7481-4823-8828-52c26f66b8db",
        "name": "Sputnik_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          112,
          1045
        ]
      },
      {
        "id": "fc6fa9e6-4166-4f4a-a5a7-d208128d977a",
        "name": "SMK FF Einzeltest_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b6db3a23-145e-48da-856d-90672b8914e4",
        "name": "B2B Digital L&O_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e623da2a-595a-4324-93e9-2913f779434f",
        "name": "RMK FSS_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c9210daf-0d02-454b-a710-00fdbb2cb6fd",
        "name": "eCare_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          10
        ]
      },
      {
        "id": "97571ca8-a083-496f-8716-e2b5c8bd0fb2",
        "name": "Real Estate Mngmt_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6960af2d-17e7-4c00-8fc0-8db810e95ae5",
        "name": "NN_SWE_Data",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "bfe7f138-ebfd-4dd9-a712-a5bea286653a",
        "name": "DS & ContentMngmt_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1ce994a2-95a5-4e5e-a957-cd79d7a7cb42",
        "name": "PBM Network_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "407f0b0a-9ef6-43da-b51b-bc77edce7e18",
        "name": "NDI_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          903
        ]
      },
      {
        "id": "b0be4609-29e8-4d69-bb03-ea3fbda42cc2",
        "name": "SAVE-T and DRM_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "879d8721-c5ac-4a0c-a582-79b2aaffedc1",
        "name": "SIMPLE_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2758
        ]
      },
      {
        "id": "fe6b117d-d50d-4877-8809-2c4527e262cf",
        "name": "SMK FF Einzeltest_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2976,
          2206
        ]
      },
      {
        "id": "40a1286d-f0bf-48c8-9a5e-04de94a2d842",
        "name": "Megaplan_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "232af9ad-679b-4980-8052-2b5387dd225a",
        "name": "mShop_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "17eddd42-5216-43db-8179-8492bc1d1318",
        "name": "CI/CD_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1587,
          2917,
          2890,
          634,
          2660
        ]
      },
      {
        "id": "8bdb8f88-77ba-432b-a375-31dab0062217",
        "name": "E2E Transparenz_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5e46e77b-ef31-42cc-a91d-2f1f9537a8ff",
        "name": "Fiber CoOp_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          616,
          3056,
          2790
        ]
      },
      {
        "id": "892b29f0-2faf-4ef8-bc0e-f637df9a09af",
        "name": "FlexProd_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1685
        ]
      },
      {
        "id": "fff72fce-788f-458a-9dfd-128612a90170",
        "name": "Gigabit_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          337,
          2288,
          1380,
          769,
          2371,
          3433,
          1327,
          770,
          2804,
          1956,
          1959
        ]
      },
      {
        "id": "f438533b-2aab-4e2f-9e3e-7fce706bcde9",
        "name": "Business Assistant gPMO",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          3653
        ]
      },
      {
        "id": "f158a284-61a8-453b-a18e-34e70e886837",
        "name": "SF & Legacy_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b462b8bc-237f-4be3-a288-9345025a160b",
        "name": "CA-Integration_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          49
        ]
      },
      {
        "id": "544a7b1a-2aa0-4cb4-a4ae-a378137fb7d6",
        "name": "GFNW_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3149,
          3583,
          2898,
          2968,
          2680,
          3153,
          2884,
          2852,
          2857,
          2748,
          2862,
          2997,
          2856
        ]
      },
      {
        "id": "0d9b8f9f-b98d-4f58-9edd-4b1378071ead",
        "name": "CI/CD_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "56407d97-4203-43ae-91e7-0cb3e0f777fc",
        "name": "RMK IMS_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          416
        ]
      },
      {
        "id": "e17103ea-178e-48c8-9c80-c3a24db2a7c8",
        "name": "ER Integration_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5d9581e8-e633-4832-a305-bfa207caed23",
        "name": "PBM Network_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2fd9679f-87c4-4071-9c18-96d0c2fc4056",
        "name": "DS & ContentMngmt_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "cf75736a-957a-4eea-9c26-bdec9b06cb1d",
        "name": "FOMM@CSBI_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1096
        ]
      },
      {
        "id": "5333541e-4a34-4682-9647-335beeaa0f30",
        "name": "GFNW_ITest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1859b244-300e-4d25-9d9a-51f95a5ff891",
        "name": "CF HUB_STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "f6dd6168-86a3-47fd-a769-6472d70cf3ce",
        "name": "Fiber CoOp_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "35e49a90-17fe-43ea-8d8b-736b5169afca",
        "name": "OpDiNG [ASS]_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "bff6cd8c-3034-4617-ad16-39554a6801f2",
        "name": "ASF Customer APIs_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          223
        ]
      },
      {
        "id": "05bc6f32-6b6e-4c63-9ede-aef4c98bca4d",
        "name": "CIAM_Test_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "63e43b31-b418-4d98-bbe7-284e55278e11",
        "name": "Convergenz Canvas",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1b8c15d9-8ae5-4117-9bc3-ce2cbd92af25",
        "name": "MMKC_STes",
        "structureName": nil,
        "heads": [],
        "employees": [
          2191,
          1445,
          2306,
          2965,
          118
        ]
      },
      {
        "id": "06146da2-c861-48d4-bf10-54e897013055",
        "name": "IBIS",
        "structureName": nil,
        "heads": [
          270
        ],
        "employees": []
      },
      {
        "id": "785e435a-16c4-4c4a-b5e6-10170220474d",
        "name": "AM@BSO Portale_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1418
        ]
      },
      {
        "id": "6f022ea1-d271-4bee-9acc-3ab410fc2a03",
        "name": "B2B_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b93105e2-4be8-4965-8aa8-fccf0fc4a698",
        "name": "CI/CD_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4f4d0006-99ae-4b55-8e29-3009913ca43b",
        "name": "REM/GSUS_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4f51d34f-7276-479f-8ed2-b184e106514a",
        "name": "BPM-W_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1033,
          1731
        ]
      },
      {
        "id": "3326180d-f7be-4dc0-8302-a528d7bc5d12",
        "name": "WiNA (NCA Hub)_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2116
        ]
      },
      {
        "id": "b949ad1c-0525-451f-b25b-d7abf3e56cb3",
        "name": "WMS TI _BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a6228982-ea69-457d-87c1-ddab90eae13e",
        "name": "WMS TI _SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "20b06792-8c88-40d1-b03c-0fc81be15dc6",
        "name": "OS & Readiness_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          85
        ]
      },
      {
        "id": "7ecb15e4-014d-46b7-ae9d-cb5168dfcad2",
        "name": "S2P_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2311
        ]
      },
      {
        "id": "5556e15f-3f43-4d77-abca-37f53e6f0491",
        "name": "PIM Overlay_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          993,
          2616
        ]
      },
      {
        "id": "3c3be007-df1d-4b92-afa0-21ecfd2864bb",
        "name": "E2E Magenta Integr_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1626,
          3174,
          1294,
          1996,
          2508,
          1179,
          2943,
          962,
          3505,
          2870,
          581,
          3221,
          3157,
          1889,
          3091,
          1761,
          2873,
          3577,
          2130,
          1570,
          3179,
          700,
          3114,
          2141,
          1431,
          574,
          3202,
          1317,
          2305,
          3201,
          1267,
          0
        ]
      },
      {
        "id": "8a2b2de2-e183-4d17-b37d-f0c8253c47e7",
        "name": "Telecom Search_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1406
        ]
      },
      {
        "id": "fdc3c2d5-e862-4ea3-8240-fa5efd43ac9c",
        "name": "Sign_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          176
        ]
      },
      {
        "id": "e719c860-4252-4487-9dc5-a78d212c1d65",
        "name": "AD_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          782
        ]
      },
      {
        "id": "e35a70b8-123e-467a-ad76-31e4a32ce36c",
        "name": "Network Transform_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "41cee68e-4212-464a-993e-21d820a46298",
        "name": "K-Best_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d9000b41-2859-428c-ac6e-fc9fcdd7ae8a",
        "name": "Access4You_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          644
        ]
      },
      {
        "id": "fbfd5fcb-65e2-4c1c-9270-467001f9613e",
        "name": "CF HUB",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "64c7dd69-484a-41f6-86ef-c99a1c8c2d3c",
        "name": "Test Automation_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1407,
          1577
        ]
      },
      {
        "id": "309dccba-79ab-441a-8734-fd575f6c7e97",
        "name": "WOM_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "79a9cd5f-c13a-4ac1-9407-d3afe57e2fcf",
        "name": "B2B Digital TouchP_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ffc7b135-b877-4c7d-a63e-93554956bbf4",
        "name": "David&Doris_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8cd4a50b-d688-49f7-841e-62cd3a1e67e2",
        "name": "TVPP Support_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1514
        ]
      },
      {
        "id": "2a9d1c85-1522-4329-9a9c-78c87d9ed70e",
        "name": "ASF Customer APIs_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1873
        ]
      },
      {
        "id": "99859059-88d6-4b3a-bf12-7745e9314f27",
        "name": "BISS KDM_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1587,
          117
        ]
      },
      {
        "id": "2e2bede4-3e6c-445a-9fe6-652749467538",
        "name": "Resource Mngmt MU part",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          2786
        ]
      },
      {
        "id": "7c878441-6c64-46d3-9f09-38a774a90b95",
        "name": "Collab DevOps_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7806598e-2901-4dcf-9957-aa7759a440cc",
        "name": "SKS ES_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d97fe120-edad-4df1-919f-dc2fbd5cd35e",
        "name": "WMS Technik_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          166
        ]
      },
      {
        "id": "69d8c431-296d-489a-9160-d3e6b85f5b30",
        "name": "NCA_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "83a812ba-0271-48c6-9a9a-9834434efc70",
        "name": "E2E Envir. Op S&S_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          75,
          2197
        ]
      },
      {
        "id": "08c90917-5baa-4461-aa6b-8eb80a0392a1",
        "name": "M2M IoT",
        "structureName": nil,
        "heads": [
          358,
          373
        ],
        "employees": [
          873
        ]
      },
      {
        "id": "04e46214-fb24-4e5a-aa70-317e129ad618",
        "name": "Strive translations",
        "structureName": nil,
        "heads": [],
        "employees": [
          3169
        ]
      },
      {
        "id": "8e0626d7-5ab2-4203-8d7e-5fdbf3445f9b",
        "name": "OS & Readiness_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          299,
          3209,
          702,
          510,
          2815,
          1765,
          712,
          2021,
          2811,
          2020,
          2871,
          1421
        ]
      },
      {
        "id": "830df801-e42f-4879-aa21-07ce502a17de",
        "name": "SMILE_JAVA_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          39,
          351,
          671,
          3483,
          3061,
          571,
          3652
        ]
      },
      {
        "id": "78ef66f3-3418-4c14-bd60-34d3a77acc36",
        "name": "eCare_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2301,
          753,
          727,
          2654
        ]
      },
      {
        "id": "0ec7b9aa-a21b-447b-bda5-6a975a2bc12c",
        "name": "BI-TS (FICO DWH)_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          1225,
          1518
        ]
      },
      {
        "id": "890f4e39-9356-493f-a812-5b56967f123e",
        "name": "IT@Motion_FacN",
        "structureName": nil,
        "heads": [
          393
        ],
        "employees": []
      },
      {
        "id": "5f5140bd-a637-40a9-b9e1-d1f48ac5f5e5",
        "name": "OneApp_DSOps_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3566,
          3538
        ]
      },
      {
        "id": "38362aae-ee12-4f7b-a970-737fb5858ff0",
        "name": "GFNW_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1531
        ]
      },
      {
        "id": "05726444-7486-43d1-90fb-790b7edc7ef1",
        "name": "Fieldservice_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9433b128-2210-42d9-b22e-ae7aebfe94a1",
        "name": "MaVi_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1689,
          1309
        ]
      },
      {
        "id": "63a85a02-ce59-4095-baf6-7e865811f2f6",
        "name": "TIMB_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2208,
          264,
          274,
          2,
          64
        ]
      },
      {
        "id": "b3a2c48a-a4cb-4d06-980c-4d52967240ac",
        "name": "Ocean (Big Data)_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b59ee499-5bb2-411f-9f55-9a7ae11510ce",
        "name": "T-Map_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "68f083ed-238c-4001-89d1-af79139234af",
        "name": "TVPP_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1781,
          1190
        ]
      },
      {
        "id": "63be0430-890c-4d48-b5f4-a94e5c34563e",
        "name": "FlexProd ASP CM_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          1598,
          394
        ]
      },
      {
        "id": "9004d938-d5a2-4eeb-befd-1c9e2b6b5d50",
        "name": "DH SDx_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "bbb85d19-bd29-4cc3-a563-5401249c1ef7",
        "name": "BPM-W_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          489,
          385
        ]
      },
      {
        "id": "d7da889f-2016-4e00-a17f-2bc31f946c55",
        "name": "TIMB_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2be94c49-ea3e-4a1a-a8a8-b629caa241b1",
        "name": "KVWS_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2893,
          2843,
          2842
        ]
      },
      {
        "id": "7327ba16-3a7a-4913-b385-59965885e675",
        "name": "BPM-W_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          493,
          534
        ]
      },
      {
        "id": "e61f5128-6157-4888-a654-97719e7482e6",
        "name": "No Project_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          3182,
          1556,
          2810,
          1150,
          3469,
          3286,
          3235,
          2530,
          3656,
          961,
          923,
          3253,
          3275,
          2935,
          2416,
          3238,
          925
        ]
      },
      {
        "id": "e48f2c37-1fad-4b1f-a0db-b4134b293325",
        "name": "Sputnik_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2771,
          1344,
          1452,
          924,
          2085,
          631
        ]
      },
      {
        "id": "84934b26-4e91-41b1-ab3a-a68970d7f6e2",
        "name": "CA-EM _ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          763,
          3081,
          1115,
          1554,
          1340,
          1366,
          240
        ]
      },
      {
        "id": "f1d94153-9073-4f0e-bdef-7404da2bf63b",
        "name": "B2B Digital Off&Ord_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "38750ace-f515-4b91-91ea-662355a44872",
        "name": "Dummy Project",
        "structureName": nil,
        "heads": [],
        "employees": [
          0
        ]
      },
      {
        "id": "f9953e64-8b34-4420-bf73-0d4f5af40945",
        "name": "OneErp Procure_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c29e0ffd-0604-42ba-b540-679a8f154f66",
        "name": "CRM-T_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2002,
          2952,
          2174
        ]
      },
      {
        "id": "19999ea7-edd1-4ffa-a16e-e65e1bdc4de4",
        "name": "Gigabit_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1ae57169-7c38-4e47-ba0f-1c5caf9eada5",
        "name": "Collab DevOps_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c67c6835-913d-4454-a90c-443c217f4809",
        "name": "RAN Disaggregation",
        "structureName": nil,
        "heads": [],
        "employees": [
          1496,
          3584,
          3399,
          3654
        ]
      },
      {
        "id": "94cbf362-153f-494a-a4a5-cd8be4f780c1",
        "name": "RMK FSS_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "67d04001-8951-44e7-b347-529cafe6a392",
        "name": "CybDef & IntSec_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          891,
          2132
        ]
      },
      {
        "id": "16aefe45-02ed-40d5-b47c-b192669b5ad1",
        "name": "Yazaki",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": [
          913
        ]
      },
      {
        "id": "e75929bc-b81e-41ef-af05-d174187487be",
        "name": "HR",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1de0bd6d-7675-4bbe-a3aa-817d165d53ce",
        "name": "REM/GSUS_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0be2af43-159a-42ff-92ea-6d97fe484313",
        "name": "Lead2Order_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "47ee2b16-8bff-4937-aa27-308550875dd3",
        "name": "NDI_FacS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "cd6a6f83-a3a6-4fc7-8c4f-5894fc2bddb9",
        "name": "CIAM_Test_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d1672dfb-19a8-40e1-921a-1dd051416dbd",
        "name": "Magenta Cosmos_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2831
        ]
      },
      {
        "id": "e3b16f93-9001-4be8-bdb5-c156b4e2642b",
        "name": "WorkOrderManag (WOM)_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e16dbe90-4073-4bf9-b555-fe9f6cbc272a",
        "name": "Wholesale Breitband_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ae25fbd2-115a-4389-af96-9e1de91baecd",
        "name": "Magenta Cosmos_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2982
        ]
      },
      {
        "id": "60c2adec-5f0d-458c-a2df-b7f38784fbca",
        "name": "CIM HUB_FacS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2795
        ]
      },
      {
        "id": "da2df341-3a56-4b7a-a6f8-942b543dc658",
        "name": "CybDef & IntSec_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          695,
          442,
          466,
          1212,
          1865,
          1462,
          1920
        ]
      },
      {
        "id": "6a565fe5-2f47-45e2-9838-a72c4f3aa0e6",
        "name": "CIM HUB_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2809
        ]
      },
      {
        "id": "f37b993d-8098-4f52-b0b7-27309263ebfa",
        "name": "Retail Sales_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7e2d85d3-9b46-4503-b355-752e28af5d78",
        "name": "CI/CD_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2859
        ]
      },
      {
        "id": "94bf7c8f-6f20-4c57-946d-ffe31130a6e6",
        "name": "GFNW _STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7c65bff1-5d65-4363-8fde-b3029f781dc9",
        "name": "CA-EM _SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2390,
          834,
          2170
        ]
      },
      {
        "id": "d57c1c30-848a-4310-9d60-a29a55117e13",
        "name": "T-NAP_SWEFE_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3391,
          3404,
          3457
        ]
      },
      {
        "id": "dc663090-d824-4e10-8eb7-3dc92ab353e2",
        "name": "B2B Digital L&O_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "da54ec8c-8bd5-49e9-8c31-872db7da1546",
        "name": "CIM HUB_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2546
        ]
      },
      {
        "id": "468041d3-0e54-48c5-9623-95b8f9f6c2d6",
        "name": "FlexProd_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1703,
          1939,
          1108,
          3001,
          1454,
          750,
          2994,
          1058,
          2123,
          636,
          1128,
          1213,
          4,
          2057,
          990,
          830,
          2844,
          421,
          1695,
          1292,
          473,
          1798,
          1382,
          301
        ]
      },
      {
        "id": "5b9e1c89-6319-42f4-bca2-132ba17624da",
        "name": "FTTH Factory_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          929
        ]
      },
      {
        "id": "bd4e744a-c9d7-42fa-9cda-6379ca2b066a",
        "name": "SKS WMS & Support_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          94,
          148,
          63,
          72
        ]
      },
      {
        "id": "13e84b36-1ce8-48da-95cb-0fd2393511bf",
        "name": "AutoBBE_Perfas+_freelance_MU",
        "structureName": nil,
        "heads": [],
        "employees": [
          2368,
          222
        ]
      },
      {
        "id": "7ff570fe-ee75-48cc-9320-d01fc42dfa43",
        "name": "Collab DevOps_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "92c6664f-14ff-4339-9aff-373b80f83590",
        "name": "CRM FN_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e9273892-f34b-4274-ada6-a05b85fcdefb",
        "name": "TMF Open APIs_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2575,
          2990
        ]
      },
      {
        "id": "5076c61b-943b-424d-9ce1-2c7a71f18b80",
        "name": "AC Centric_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c752affb-9a2d-4725-97a8-cb2212b59e46",
        "name": "DH SDx_FacS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          219,
          1078
        ]
      },
      {
        "id": "323a53cc-dd6c-4c62-ae59-a5014ea69e9f",
        "name": "EDIS",
        "structureName": nil,
        "heads": [
          3601
        ],
        "employees": [
          720,
          3214,
          2265,
          120
        ]
      },
      {
        "id": "4666eb5b-f96e-47bb-a5f5-1e15e63480ff",
        "name": "WFM T_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "32ff11cd-57eb-4c29-9813-9ce9f4a4de6f",
        "name": "M2M (RBP)",
        "structureName": nil,
        "heads": [],
        "employees": [
          2797,
          1415,
          3283,
          347,
          2700,
          2175,
          335,
          130,
          860,
          1430,
          3229,
          1188,
          336,
          1227,
          3388,
          1298,
          1753,
          332,
          1318
        ]
      },
      {
        "id": "0d45b6cd-16a0-4cbf-8100-5c2946a2cc20",
        "name": "GFNW_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          337,
          673,
          2934,
          3337,
          1328
        ]
      },
      {
        "id": "5e2aa4a7-fa14-48d4-87e0-a9b1c387b12f",
        "name": "Net4F_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6d845aa6-25aa-48cd-9b61-43405c97ea95",
        "name": "SP Test_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2074
        ]
      },
      {
        "id": "ce7d1288-b423-484a-8be7-74e6fc6bed0b",
        "name": "CF HUB_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c220a064-8982-4f8a-bf0f-1ba1ea61805a",
        "name": "Access4Magenta_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c1497a0d-87e2-47b4-96df-b807bfd74c1d",
        "name": "X-ProMT_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          569,
          1607
        ]
      },
      {
        "id": "b3462443-c724-4ae0-aa5c-2aba128e4f7c",
        "name": "GeoHub_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1374,
          2289,
          3530
        ]
      },
      {
        "id": "c252deb0-ce7d-4ec9-b80a-4980b1233afb",
        "name": "mShop_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1ef6446d-8703-4c88-ab0b-6e0604f0923a",
        "name": "LC",
        "structureName": nil,
        "heads": [],
        "employees": [
          1796,
          33,
          66,
          18,
          191,
          507,
          2420,
          337,
          1937
        ]
      },
      {
        "id": "8f7ba9a4-1b44-441b-bd18-4f83ca9815fb",
        "name": "IT4Tel-IT_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ab782731-f424-43d0-9d8d-9337a2e81967",
        "name": "IT Service Automation",
        "structureName": nil,
        "heads": [
          270
        ],
        "employees": [
          2323,
          2163,
          2161,
          3289,
          2606,
          2296,
          3498,
          2102,
          2848,
          3420,
          3010,
          955,
          2798
        ]
      },
      {
        "id": "f4485eec-a787-4f20-a3a6-db38c36875bd",
        "name": "DeTeFleet_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1f43e7e7-153b-4f30-9125-9eee0db980b4",
        "name": "GK-Portale_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          3227
        ]
      },
      {
        "id": "6a9c6a09-d8b7-49ba-a403-a763aa4f8a77",
        "name": "GP Internal",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": []
      },
      {
        "id": "e159ab12-a916-451f-8ec5-511213452c24",
        "name": "Lead2Order_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "89469792-b40c-4c01-ad4d-9aa417d18d87",
        "name": "T-Kickbox_TI_ITest_Service_NO VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          402
        ]
      },
      {
        "id": "569db2a0-4fdb-4903-90f3-9d2bba51550e",
        "name": "T-Map_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1131
        ]
      },
      {
        "id": "13fe1d84-ef7d-4e98-a806-4e46de758145",
        "name": "HeliOSS_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          666
        ]
      },
      {
        "id": "aeec56e7-f6bd-4020-b8e9-7dfd4c4776be",
        "name": "ASF Product APIs_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a1b1111b-36d9-47a8-8686-d43ce1fecd08",
        "name": "gASD (Auto MI)",
        "structureName": nil,
        "heads": [],
        "employees": [
          2506,
          2365,
          2519,
          2942,
          2891,
          2507,
          1676,
          2559,
          53,
          3450,
          852,
          3540,
          3041,
          93,
          2568,
          3170,
          930,
          2326,
          3542,
          2372,
          568,
          926,
          927,
          3269,
          2970,
          973,
          3009,
          2446,
          475,
          1960,
          3240,
          1615,
          3292,
          3382,
          2345,
          1936,
          1142
        ]
      },
      {
        "id": "08d04b30-f0e6-4a53-b7cb-f511d0f366ab",
        "name": "WiNA (NCA Hub)_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1356
        ]
      },
      {
        "id": "35cd1980-5bd9-4a7a-91dc-aaa992ca47ba",
        "name": "MMKC_DSOps_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3531,
          2478
        ]
      },
      {
        "id": "29c6b1d3-afcb-46d0-b77c-877ebe00aa3d",
        "name": "MARS",
        "structureName": nil,
        "heads": [
          272
        ],
        "employees": [
          3239,
          3663,
          181,
          3218,
          3675
        ]
      },
      {
        "id": "0934d077-1d27-4e09-9032-157dc1164623",
        "name": "WOM_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1248,
          768,
          723,
          806,
          869,
          2712,
          1969,
          2801,
          1335,
          1610,
          842,
          1290,
          1001,
          3554,
          1813,
          1499,
          1217
        ]
      },
      {
        "id": "e349f9d3-c529-48bd-97b8-b0812fea4702",
        "name": "CybDef & IntSec_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1896,
          441
        ]
      },
      {
        "id": "88de3962-c646-45cc-b199-026876f1154f",
        "name": "DS & ContentMngmt_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          199
        ]
      },
      {
        "id": "d3ebc79c-c85c-4097-89d8-218e2af372c4",
        "name": "CIM HUB_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2026
        ]
      },
      {
        "id": "b4898b45-d05c-4a62-8753-011b9d481c22",
        "name": "Robotics & A&AI_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "3ba63ae4-cd1f-4bf3-af4a-2fd89fe7f06a",
        "name": "KVWS_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2200
        ]
      },
      {
        "id": "0271f56e-05e9-4a5c-baf1-d6f29dd4173a",
        "name": "Administrative Support",
        "structureName": nil,
        "heads": [
          53
        ],
        "employees": [
          2970,
          2891,
          3269,
          3292
        ]
      },
      {
        "id": "54e017f0-c93b-40e0-895f-9a461ba6a6c6",
        "name": "TARDIS_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2912
        ]
      },
      {
        "id": "0a1624e2-17ca-4428-a4f6-6c21b914b758",
        "name": "T-NAP_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3395,
          3415
        ]
      },
      {
        "id": "e9ea62e7-2179-415c-bf6f-a6b105909629",
        "name": "OpDiNG [ASS]_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2895,
          2154
        ]
      },
      {
        "id": "e1853286-e68f-483a-953f-627c0cf63e36",
        "name": "DOM_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6ee42ee5-6cf1-4eb4-ba3e-7b62d879ce2c",
        "name": "eCaSS_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1006
        ]
      },
      {
        "id": "8db32fec-8871-4906-b2d0-9bff1ead111e",
        "name": "MAD/ PersDispo_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          374,
          1670
        ]
      },
      {
        "id": "5acd5167-48a5-41bd-a379-c5835c451e82",
        "name": "SF & Legacy_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7d4899b2-96a7-4afc-a099-0e64b0516885",
        "name": "ProALM",
        "structureName": nil,
        "heads": [],
        "employees": [
          3372
        ]
      },
      {
        "id": "bb31108e-6d0f-414f-a233-c4ed0b304158",
        "name": "Robotics_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "324616fd-fe73-453f-b367-f5b7f9ec1b4b",
        "name": "GeoHub_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          2307
        ]
      },
      {
        "id": "a9783e3a-edde-4b3a-a32f-d851c5d02c1c",
        "name": "SMBB",
        "structureName": nil,
        "heads": [
          87
        ],
        "employees": [
          128,
          904
        ]
      },
      {
        "id": "45251dbb-a316-415c-a490-9b6db0214754",
        "name": "Whole Sale_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          3161
        ]
      },
      {
        "id": "30d90ff1-a6ef-4306-aaf3-7d08691931ea",
        "name": "Gigabit_Rent_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "073ac89f-fe72-401f-84bf-fc82ac66d58e",
        "name": "Sputnik_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fc644f7c-ab56-46e6-a35e-f7e617c720c2",
        "name": "Phoenix_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1456
        ]
      },
      {
        "id": "9f45b745-978e-4adc-9121-e6cee65b215c",
        "name": "BEAR_ITest_Service_No VAT.",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ae280543-f7c9-4630-a749-0422d09199b5",
        "name": "SKS ES_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          2487,
          57
        ]
      },
      {
        "id": "f451003a-e6f3-4e10-bf00-662ce433f59e",
        "name": "POM_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3320,
          398,
          3316,
          3300
        ]
      },
      {
        "id": "f96ae717-aa72-4204-97a5-03f0ea51a1e9",
        "name": "IT4Tel-IT_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "cff8f40c-09c3-4c93-8e40-0a5863cfe19a",
        "name": "BL CRM_SWEBE_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "14186d6d-7a18-4bd7-8e70-beeb0ddd3f2d",
        "name": "Megaplan_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0c2cd435-9a17-41d8-8eca-739505c72c4d",
        "name": "SMILE_JAVA_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          250,
          405,
          1589
        ]
      },
      {
        "id": "9024d880-59db-426f-af77-1e2401825896",
        "name": "MMS",
        "structureName": nil,
        "heads": [
          2013
        ],
        "employees": [
          2566,
          3366,
          3405,
          3136,
          3365,
          1790,
          2703,
          3588,
          1002,
          3453,
          2211,
          2889,
          3593,
          2152,
          2709,
          3335,
          1690
        ]
      },
      {
        "id": "a8f4cdb6-932b-4bfa-b302-47a4b76f35e5",
        "name": "WMS Technik_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          40,
          459
        ]
      },
      {
        "id": "e48afd39-11de-43b4-87fd-774b52e8873c",
        "name": "PSL International_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "44e15ecc-4d29-42a7-a11c-39911de02acb",
        "name": "OS & Readiness_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e8676134-dd9c-45a9-91b6-c9b3d77323b7",
        "name": "SKS WMS & Support_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          55,
          1847,
          1502,
          2217,
          2524,
          1611,
          98,
          364,
          1501
        ]
      },
      {
        "id": "02c49064-2eaf-438d-b208-66ac80bbffdd",
        "name": "CI Automated_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "40a6d269-0047-45da-8aa6-297c670fda4e",
        "name": "Retail Sales_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e7e05df9-0441-41c2-9708-abac7c54d657",
        "name": "mShop_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4122bb6d-6906-4d51-93ed-41f7d9bec8e6",
        "name": "Cargodian",
        "structureName": nil,
        "heads": [
          1715
        ],
        "employees": [
          709,
          38
        ]
      },
      {
        "id": "5a69f6f7-cae1-40dc-8e18-9a0d3cafb44d",
        "name": "CA-SM_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1320,
          1324,
          812,
          576
        ]
      },
      {
        "id": "89a500df-eaa3-48fa-8434-114fd230d3d9",
        "name": "Stab & FadeOut C09_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6a68a11e-92bc-4521-9a42-43a468e37043",
        "name": "BI-Framework_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e56ddb8a-15fc-4a85-aaa2-0693b6aeb27d",
        "name": "Simunye support_MU part",
        "structureName": nil,
        "heads": [
          159
        ],
        "employees": [
          116,
          3196,
          3218,
          3224,
          320,
          3220,
          263
        ]
      },
      {
        "id": "75ce6141-1aa7-45c5-9dcb-de7a4df236b1",
        "name": "AI_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1245
        ]
      },
      {
        "id": "f89d7a00-a466-4ffc-b535-bc02165e8795",
        "name": "Future Diagnostics_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "207735e3-52d1-469d-9b39-30208f1a6ab3",
        "name": "BLSTKP 43_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          772,
          2860,
          2037,
          1148,
          2756,
          1869
        ]
      },
      {
        "id": "5cae6b84-b14f-43d8-878c-5084ec68aed3",
        "name": "WMS Technik_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          161,
          1742,
          392,
          847,
          604,
          3076,
          1469,
          48,
          1687,
          228,
          126,
          248,
          56,
          1874,
          1471,
          102,
          2708,
          173,
          96
        ]
      },
      {
        "id": "154a6813-86f3-4650-a467-03447f615040",
        "name": "Z_No Hub_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d3bb56f6-2a8f-42a3-b334-27dbd09ce51c",
        "name": "KolloDB_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2056
        ]
      },
      {
        "id": "8dad6920-42c7-40f8-a81d-27ca4a374da9",
        "name": "SBS",
        "structureName": nil,
        "heads": [
          87
        ],
        "employees": [
          562,
          2696
        ]
      },
      {
        "id": "e18e3cc8-84d8-4fe9-a639-4bb3ead451ce",
        "name": "MaVi_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1938
        ]
      },
      {
        "id": "9ee9a636-998f-4fae-bed1-63eba46ac968",
        "name": "BMW BeSy Next",
        "structureName": nil,
        "heads": [
          3493,
          2013
        ],
        "employees": [
          557,
          646,
          3295,
          1269,
          518,
          555,
          3512,
          3050,
          1771,
          3600,
          2576,
          807,
          3348,
          1676,
          266,
          814,
          2399,
          983,
          217,
          2315,
          3480,
          3594,
          2602,
          3476,
          2505,
          2734,
          1164,
          3105
        ]
      },
      {
        "id": "bb33fde3-e7a1-4fe5-beae-a324a85a6832",
        "name": "MMS FC",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": [
          2839
        ]
      },
      {
        "id": "8b1ba112-a55f-450f-ac64-b5585ee5701a",
        "name": "Source2Pay_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          894
        ]
      },
      {
        "id": "04f55eb2-7f04-487b-84e1-fc4922a1e1bf",
        "name": "CybDef & IntSec_OPSN infr",
        "structureName": nil,
        "heads": [],
        "employees": [
          1655,
          717
        ]
      },
      {
        "id": "b2398c14-335d-4f2e-a589-7f9a65f2c830",
        "name": "ER Integration_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "41b0b245-d3d7-4960-a5c1-50144dcecb1d",
        "name": "WMS TK_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2156,
          1369,
          876,
          1015
        ]
      },
      {
        "id": "dbd5e70c-a3bc-48df-80bb-12ef9c8daf0b",
        "name": "CRM-T_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ff35ea84-84eb-405c-8fe4-17d035ee6141",
        "name": "Quality Manager",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          3581
        ]
      },
      {
        "id": "a0476676-2aa1-4d92-910d-54c2abce4d26",
        "name": "ER Integration_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "114e79f5-1f83-4276-8a93-4134ac09c5d3",
        "name": "WMS Technik_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          3148
        ]
      },
      {
        "id": "e63bcc16-e04a-4a00-8ce6-e464ef606afb",
        "name": "FM PDH/SDH_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b34ae961-cd8c-4d9d-b20f-f9811ca03efe",
        "name": "BUT Test",
        "structureName": nil,
        "heads": [
          3454
        ],
        "employees": [
          3577
        ]
      },
      {
        "id": "4e88cb89-1fe2-4954-99ca-bd9490f45188",
        "name": "eCare_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1656,
          3044
        ]
      },
      {
        "id": "1ce34095-0a99-4cf6-be87-17b0914b710e",
        "name": "GK-Portale_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1165,
          3602,
          2988,
          965,
          1253,
          1861,
          28,
          1860,
          2577,
          3204,
          1968,
          2313,
          764,
          1736,
          2184,
          1205,
          1192,
          3048,
          1979,
          1652,
          3546
        ]
      },
      {
        "id": "f696f73b-0061-4beb-ab7c-4b8994d3b43a",
        "name": "SEAL [Service On]_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e015de43-6b50-45f0-9bdb-2d5bfb37d0b2",
        "name": "RMK AT_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1949,
          2768,
          1300,
          529,
          575,
          2100,
          1024,
          1408,
          512
        ]
      },
      {
        "id": "30089672-c4a3-4ae5-bc4b-addd2d9d79d7",
        "name": "ProRail",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": [
          913
        ]
      },
      {
        "id": "8545d4e0-5eee-46eb-9927-66c98394f2e4",
        "name": "Net4F_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e47cbcb0-c216-4c9f-95b1-0fa336f62211",
        "name": "RAN Infrastructure_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1709,
          0
        ]
      },
      {
        "id": "46174fa2-9b92-4171-8223-bdf62c557c40",
        "name": "NGSSM SMS ASS_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          124,
          1548
        ]
      },
      {
        "id": "6e14d88a-acbd-4bfd-8021-58f7ff5b81ea",
        "name": "CIM HUB_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2166
        ]
      },
      {
        "id": "7786863c-239a-4ec8-8df6-336b2cfbb706",
        "name": "SKS WMS & Support_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          353,
          850
        ]
      },
      {
        "id": "7bdff864-6ade-4d78-b73d-e026fb51ded4",
        "name": "Magenta Telekom",
        "structureName": nil,
        "heads": [
          188
        ],
        "employees": [
          628,
          901,
          116,
          328,
          309,
          181,
          736,
          3150,
          320,
          341,
          560,
          159,
          3224,
          3239,
          663
        ]
      },
      {
        "id": "2f12ca6e-b9ce-49cb-aa1d-dde6c6b6a1ae",
        "name": "Access4Magenta_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0b619a6b-8b93-469f-b5e0-e217d745d777",
        "name": "Test Automation_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1402,
          1159,
          1365,
          413,
          701,
          880
        ]
      },
      {
        "id": "a1a95236-9526-461a-9f66-6a9191fc5902",
        "name": "VW Competence Centre",
        "structureName": nil,
        "heads": [
          525,
          3454
        ],
        "employees": [
          2765,
          3632,
          3408,
          2547,
          2569,
          3329
        ]
      },
      {
        "id": "4f131c03-692f-4bae-b34c-f50273acfa81",
        "name": "OSC onMetal",
        "structureName": nil,
        "heads": [
          1393
        ],
        "employees": [
          288,
          3154,
          3296,
          3163,
          3093,
          1723,
          3146,
          3620,
          3345
        ]
      },
      {
        "id": "c17a0a60-0750-4642-8b5a-c4bb2b3ec063",
        "name": "SAVE-T and DRM_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ba06e662-57e0-42eb-8f80-e74546cbd073",
        "name": "SKS ES_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2781,
          2780,
          1406,
          2027,
          1639,
          141
        ]
      },
      {
        "id": "90ff9910-e7f2-486f-b342-dd04762f3935",
        "name": "Test Automation_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          621,
          1916,
          2025,
          1976,
          273
        ]
      },
      {
        "id": "c64c4980-53fd-4008-8f67-3a23a7d69497",
        "name": "MMKC_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3102,
          2945,
          3138
        ]
      },
      {
        "id": "94cf49dd-5489-46c6-8120-47b374da3dba",
        "name": "NCA_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9520315e-3659-43df-8948-b40181d911bc",
        "name": "NormMaster",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          234,
          2552,
          2033,
          3690,
          2692
        ]
      },
      {
        "id": "fde1abb0-5c65-4234-b531-c1da34c50191",
        "name": "DH Com & Brand_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2704
        ]
      },
      {
        "id": "8969fbde-a0f5-4451-89e1-4e154ae57fcb",
        "name": "xAMS",
        "structureName": nil,
        "heads": [
          159
        ],
        "employees": [
          3691,
          1843,
          3698,
          181,
          1376,
          263,
          3459,
          121,
          1982,
          3220,
          1730,
          3696,
          3261,
          140,
          3272,
          1099,
          2494,
          160
        ]
      },
      {
        "id": "94650547-6c9a-4ed4-8ffc-76038458b3d9",
        "name": "PUT (NTO Hub)_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4d011ab1-56c4-4a2e-bfa4-111f0b84c095",
        "name": "M2M_TI",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          2152
        ]
      },
      {
        "id": "daa8d27b-6251-4b61-9f23-eb36457f0f1a",
        "name": "FM PDH/SDH_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2142
        ]
      },
      {
        "id": "614202f1-04c9-49d2-95a3-6918330a55e4",
        "name": "Fieldservice_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e4c155d2-78bb-414f-bb63-d959d734ec15",
        "name": "OneApp_STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          2525,
          2609,
          1975
        ]
      },
      {
        "id": "a56d9c24-f2e8-4f51-98aa-214689ab95be",
        "name": "NCA_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ee8377ea-3508-408e-87c7-24f9c3fc3a97",
        "name": "FlexProd_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "cb0303ef-3c04-4efa-b765-2f6ca04ec3f0",
        "name": "GK-Portale_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1631,
          1404
        ]
      },
      {
        "id": "3fd215cd-138f-4939-9d45-8e3d8e6e732b",
        "name": "FM PDH/SDH_DSOps_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1989
        ]
      },
      {
        "id": "ccbea057-d7ea-4174-8e2d-54eb70e51258",
        "name": "B2B Digital TouchP_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          331,
          2784
        ]
      },
      {
        "id": "1eed3e14-44c7-4830-91f7-6bbce24a8663",
        "name": "Robotics & A&AI_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "619d65e7-79e2-4458-8a0e-bc2a26c7866b",
        "name": "LimaWorkPlace_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1107,
          50
        ]
      },
      {
        "id": "244607d7-effc-443b-8421-cdd9408f601f",
        "name": "TAFEL2000_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          89,
          938
        ]
      },
      {
        "id": "9f9a7000-1e09-4bf2-831a-b3deff14af24",
        "name": "WMS TK_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          129,
          2437,
          2744,
          476,
          2980,
          1220,
          2153,
          3164,
          2671,
          805,
          1061,
          2561,
          2548,
          2823,
          237,
          877
        ]
      },
      {
        "id": "f3bd09f7-5162-4d7b-a962-d1ba3e0ced9d",
        "name": "RAN Infrastructure_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0c64b882-3eef-4d3f-ac9f-c2460e5af3e8",
        "name": "GK-Portale_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          1945,
          978
        ]
      },
      {
        "id": "089e51f5-0046-4de2-96ee-968d2dff284c",
        "name": "SKS ES_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2543
        ]
      },
      {
        "id": "56e538c7-83fc-4b60-9426-10e9e862db09",
        "name": "AI_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          2464,
          2637,
          2489,
          2651,
          2462,
          2196
        ]
      },
      {
        "id": "b986d334-7be3-4f92-a7b8-d636820ea2da",
        "name": "BPM Support_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a5b4936d-b009-4213-90c5-e02f99754ce3",
        "name": "Neva_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2332,
          3115,
          143,
          2677,
          3175
        ]
      },
      {
        "id": "fa6dcbfb-f42e-46ff-9024-4e5de075016f",
        "name": "eCare&TVPP PT_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          762,
          609,
          212,
          2902,
          325,
          2351,
          2079,
          35,
          0
        ]
      },
      {
        "id": "b328a7e0-9530-42d2-bf29-61ec976b0b95",
        "name": "PSA",
        "structureName": nil,
        "heads": [
          113
        ],
        "employees": [
          3411,
          640,
          591,
          3340,
          613,
          1633,
          1124,
          283
        ]
      },
      {
        "id": "c605681c-fa7c-4140-b160-6fda03530574",
        "name": "B2B Digital TouchP_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e1b67b09-7288-4195-bbe0-2f3cec9c6017",
        "name": "Gigabit_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2096,
          2237,
          1965,
          2438,
          241,
          3051,
          1912,
          1710,
          2650,
          964
        ]
      },
      {
        "id": "eec321fa-b89d-4fe7-8684-0e09cda16dbb",
        "name": "AC Centric_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8a89dda6-fd42-4621-8f5d-f49684929f70",
        "name": "TAFEL2000_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2273,
          3322
        ]
      },
      {
        "id": "00add1e0-b54e-462a-a804-dfb2de0f1390",
        "name": "Agile Coach Pool",
        "structureName": nil,
        "heads": [],
        "employees": [
          848,
          3414,
          1751
        ]
      },
      {
        "id": "b061e684-fbf9-4dfc-97ff-d07fa6aaf624",
        "name": "5G Campus Edge",
        "structureName": nil,
        "heads": [
          657
        ],
        "employees": [
          3355
        ]
      },
      {
        "id": "1f3fc608-f562-40d2-b1e7-03d5421bf665",
        "name": "Magenta Cosmos_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b2c2cf2d-109d-4235-b3a9-c4870f34a0db",
        "name": "BEAR_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2454
        ]
      },
      {
        "id": "77d61c76-878a-4c6c-b40c-75362b42543d",
        "name": "CRM-T_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1683,
          2975
        ]
      },
      {
        "id": "9f7158be-9497-4244-bfaa-ca32ddb24120",
        "name": "SMK FF Einzeltest_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "41e55781-c742-4b65-80d4-7b0e385a484b",
        "name": "PMO Internal_non DT IT",
        "structureName": nil,
        "heads": [],
        "employees": [
          3598,
          1806
        ]
      },
      {
        "id": "6e58d4b1-6d38-4f1a-b010-213e5b186e3c",
        "name": "ASF Customer APIs_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          199,
          167,
          524
        ]
      },
      {
        "id": "a8300625-e503-4b05-a1bf-6d6b2c7442ae",
        "name": "TBB Test",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          884,
          430,
          982
        ]
      },
      {
        "id": "c9aff274-67d4-4972-bc45-c6af76c32365",
        "name": "DS & ContentMngmt_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c65aee2c-0708-47b1-b9b0-c7346a0ab2cd",
        "name": "T-Plan Rent ECM",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          3310
        ]
      },
      {
        "id": "ed5670ae-9a18-4d27-984f-5b11f16f61f3",
        "name": "Sputnik_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1377,
          1391
        ]
      },
      {
        "id": "820b6dd7-2c72-44a6-a8a1-948809d330fb",
        "name": "Neva_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          3403
        ]
      },
      {
        "id": "5d0aede0-9c28-4e4c-a9db-00130ab0c17a",
        "name": "RBA_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          632
        ]
      },
      {
        "id": "f4f79cb2-038d-4f73-adaa-e98fb86c0062",
        "name": "TIMB_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          97,
          14,
          879,
          1792
        ]
      },
      {
        "id": "bbe484ea-3518-4e40-bd80-f154c7f81eb1",
        "name": "Digital Sales (SnA)_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "37330f75-c18a-4f35-ad4b-8ac2947872ed",
        "name": "T-Map_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          2049
        ]
      },
      {
        "id": "8404691f-875e-47b6-9e02-85443d35249d",
        "name": "DS & ContentMngmt_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fb10557f-9f7a-4b6b-b36b-628827095bef",
        "name": "HotSpot",
        "structureName": nil,
        "heads": [],
        "employees": [
          3687,
          3198
        ]
      },
      {
        "id": "f2258fab-ca98-42b4-b630-b91333f12d3d",
        "name": "Miles Plus_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          117,
          61
        ]
      },
      {
        "id": "b5ac1cc9-a855-4c65-8989-5d6a84cb1b3d",
        "name": "Indoor Navigation_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "659f35ba-38f6-4769-93f0-ea39d202a79a",
        "name": "CPOM_FacS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          612
        ]
      },
      {
        "id": "cea29cec-8b37-4940-9ac5-4357ad46ac05",
        "name": "SDS Test",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          884,
          1358,
          3368,
          3585
        ]
      },
      {
        "id": "f16680b4-b10e-4f64-98d5-f0e9f92647fb",
        "name": "Indoor Navigation_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1a6a578b-f71f-47c7-965a-2e6151b6e32b",
        "name": "Indoor Navigation_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "51d4399a-9bf3-4427-aa15-82111ef8b8ca",
        "name": "PBM Network_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          809
        ]
      },
      {
        "id": "a2cfc646-5ef1-43c4-b591-46fb4987cd7e",
        "name": "Engie",
        "structureName": nil,
        "heads": [
          663,
          436
        ],
        "employees": [
          159,
          309,
          2494,
          369
        ]
      },
      {
        "id": "b74b7ad7-f48a-4249-86ff-2fe7fa34bab6",
        "name": "SF & Legacy_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "049224c2-f794-4873-80e4-df798fec2a50",
        "name": "Aviation",
        "structureName": nil,
        "heads": [
          270
        ],
        "employees": [
          2589,
          2557,
          659,
          2512,
          732,
          2914,
          1100,
          422,
          3252
        ]
      },
      {
        "id": "fc7409a5-2cbe-4dc1-bf8d-5518baba9f71",
        "name": "TSA Healthcare",
        "structureName": nil,
        "heads": [
          3537
        ],
        "employees": [
          1376,
          1730,
          521
        ]
      },
      {
        "id": "08e3155b-cd65-4096-b84d-6df623d32c95",
        "name": "ARND_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          3126
        ]
      },
      {
        "id": "bc570bff-fdb9-4ca1-b93b-5e6f3e770e65",
        "name": "BLSTKP 43_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2863,
          788
        ]
      },
      {
        "id": "67c492fe-e662-4270-aefb-460fe0fedc3f",
        "name": "CA-SM_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1197,
          1152,
          3344,
          1596,
          1966,
          1207
        ]
      },
      {
        "id": "dcf8b80c-69c6-4a38-ae78-b0071abd5374",
        "name": "Fiber CoOp_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d8538ab6-ce8a-4b77-8bd0-049f7ce9f99e",
        "name": "Hydra _BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1191
        ]
      },
      {
        "id": "fd40f7ce-7a46-4878-8eb5-62d3b7198787",
        "name": "Access4You_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          296
        ]
      },
      {
        "id": "6c8bc831-a3d0-4c52-a45e-939cf70e2fc3",
        "name": "AppFramework",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          2319
        ]
      },
      {
        "id": "17d306ff-b490-4b8f-9a10-7a34d19276ba",
        "name": "IHUB",
        "structureName": nil,
        "heads": [
          2143
        ],
        "employees": [
          2427,
          3049,
          3004
        ]
      },
      {
        "id": "16aceadb-5643-4682-a910-8c3d1c6d4854",
        "name": "NCA_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b281004c-7d42-4aa4-b166-afa4b3b65374",
        "name": "E2E Ind Market_ITest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "805b5bab-e36f-4d89-b8e3-994ef0e7f666",
        "name": "T-Vacation MU",
        "structureName": nil,
        "heads": [],
        "employees": [
          2326
        ]
      },
      {
        "id": "8b53acd0-3a44-4b6c-80c8-2bbb4c5be950",
        "name": "CIM HUB_STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1089,
          2837
        ]
      },
      {
        "id": "ca89375c-595e-437e-9a05-b91cd4f6e471",
        "name": "WiNA_Arch_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1546
        ]
      },
      {
        "id": "2b33ad0d-eb51-4dee-adab-cd85c1db55f4",
        "name": "Phantom_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1e1a4957-4cbb-4121-95e9-1fd961b2859c",
        "name": "KolloDB_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0cb89ef9-9985-4e7d-8ce0-a340a9f2e69c",
        "name": "T-NAP_BOP_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1481
        ]
      },
      {
        "id": "0e3031ec-3e4c-485e-8185-07abad4c8aae",
        "name": "Access4Magenta_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "010807cb-0d98-48a4-9f9b-27dc489bc3bb",
        "name": "TVPP Support_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2220
        ]
      },
      {
        "id": "f18117d8-2b15-494a-abf7-4e3cdc784b7f",
        "name": "PBM Network_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2379
        ]
      },
      {
        "id": "9f22844c-9724-494c-82d6-5f10e37e29fa",
        "name": "DTSec",
        "structureName": nil,
        "heads": [
          525
        ],
        "employees": [
          2368,
          3520,
          2334,
          3140
        ]
      },
      {
        "id": "4ec45f45-9890-45dc-92c0-26c25dd8d26d",
        "name": "ARND_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e4362020-3d6c-49b9-804c-cc95f690809c",
        "name": "AM@BSO  MS_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          1797
        ]
      },
      {
        "id": "36816ba1-be4d-49de-9b4c-b8940687819d",
        "name": "RAN Infrastructure_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "88b1ca45-8c02-44e5-8765-18535bb698a9",
        "name": "AC Centric_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ad0b39fc-95f7-4766-b197-34d80e801ccc",
        "name": "TVPP_ITest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7fa0e639-f06e-4560-99ad-f3e624fe6dc8",
        "name": "REM/GSUS_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7ec0643c-4903-48db-9fe5-35fe15a2ce8f",
        "name": "Wholesale Breitband_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d4efa05e-a8ac-43fb-a497-c669506185a1",
        "name": "PSL International_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1370,
          1153,
          214,
          3276,
          3039,
          2380,
          2931,
          200,
          420,
          1367,
          1347,
          969,
          1714,
          107,
          1338,
          3488,
          182,
          111,
          797,
          1082,
          2103,
          1878,
          734,
          261,
          73,
          3473,
          29,
          178
        ]
      },
      {
        "id": "40714bb0-7c19-449c-b17e-e89a30a38680",
        "name": "Retail Sales_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "97f18250-eae7-4e02-9d83-1d95d13f8acf",
        "name": "NGSSM SMS ASS_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "16befacb-65e4-4bd9-a46d-7ba5636e3e72",
        "name": "Magento",
        "structureName": nil,
        "heads": [
          222
        ],
        "employees": [
          2509,
          2540
        ]
      },
      {
        "id": "7b95fb61-59be-411d-9e68-93f165a586b8",
        "name": "AFAB_2020",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          807,
          2224,
          3151,
          495,
          3195,
          3236,
          230,
          3265,
          2263,
          3681
        ]
      },
      {
        "id": "440965e2-cb4b-44d6-accf-16efc5f6cec2",
        "name": "SEAL [Service On]_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c054bcca-7217-4cf2-8d4a-5331c54761d7",
        "name": "Fiber CoOp_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "86034ec6-1ef6-47fd-a5f3-a7f56cdcce46",
        "name": "Magenta Business_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ce42daef-e52d-4f8a-a48d-1fbbe084b779",
        "name": "Z_No Hub_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "61673537-e246-4173-9bdf-f92a59f529bc",
        "name": "Access4You_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1425
        ]
      },
      {
        "id": "22de32fd-e16a-4ddb-8329-c33d5d086073",
        "name": "Sputnik_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "902dcab0-82ae-496b-9760-761f4d5b5cbd",
        "name": "SMK FF Einzeltest_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          1151
        ]
      },
      {
        "id": "40b7b342-ab2f-4c99-9277-7fbc402b2f12",
        "name": "NGSSM SMS ASS_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          1121,
          1390
        ]
      },
      {
        "id": "d3fdf831-a307-4dd6-a3b4-aad0daf4d9ba",
        "name": "Travel portal support_MU part",
        "structureName": nil,
        "heads": [
          93
        ],
        "employees": [
          2507
        ]
      },
      {
        "id": "dc8bb01b-f5db-4566-996a-8f25fb58a3fd",
        "name": "Classic Services",
        "structureName": nil,
        "heads": [
          436
        ],
        "employees": [
          181
        ]
      },
      {
        "id": "7ccede3b-9c14-4ed2-9ae4-c22ef771154a",
        "name": "Future Diagnostics_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "7e2b3cd6-2c2c-4e77-97b7-57f31b6854c9",
        "name": "TSI Order to Cash_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6bab2384-78da-45dc-9e22-92633696b9bd",
        "name": "OS & Readiness_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0e856632-96ee-4ac7-af16-06b943c7ead9",
        "name": "MaVi_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2717,
          2234,
          2183,
          1433,
          914
        ]
      },
      {
        "id": "c29d2be9-d13a-4764-bc67-e6489e28bb2b",
        "name": "CA-EM _BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2142
        ]
      },
      {
        "id": "1b95c2af-c356-415e-a5d8-041537abfee1",
        "name": "SW Factory",
        "structureName": nil,
        "heads": [],
        "employees": [
          220,
          2615,
          2786,
          208,
          732,
          270,
          289,
          2638,
          87,
          659
        ]
      },
      {
        "id": "9b665d51-a4ae-4fbb-b57f-657349e172b9",
        "name": "NGSSM SMS ASS_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c4db17a9-d82c-4e26-8a5f-84f3ce51cddf",
        "name": "TCC STP Development",
        "structureName": nil,
        "heads": [
          270
        ],
        "employees": [
          3460,
          3646,
          3375,
          3447
        ]
      },
      {
        "id": "93799647-652d-40d1-b222-715cda9f6f4d",
        "name": "Core Finance_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "71f580c7-31c3-49ad-be6d-bd032f27a0af",
        "name": "PMO Internal_DT IT related",
        "structureName": nil,
        "heads": [],
        "employees": [
          2231,
          1111,
          2155,
          2142,
          2526,
          3186,
          2636,
          819,
          2758,
          2727,
          2215,
          1229,
          1517,
          2746,
          2216,
          2056,
          660,
          3227
        ]
      },
      {
        "id": "db097188-2d1b-4ebe-a541-cfc98dd3550f",
        "name": "IM EN P&A_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c65ca98e-b0c9-4a70-898e-4c527c71d2da",
        "name": "Z_No Hub_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b57bce69-45f5-4cdd-9f74-6bd771a0fd08",
        "name": "GeoHub_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "89bc8730-2f2c-4204-a610-f2257fc33909",
        "name": "RMK AT_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "878611f6-efa7-4e1e-896a-5bfba3a650a4",
        "name": "Telecom Search",
        "structureName": nil,
        "heads": [
          525
        ],
        "employees": [
          3587,
          1574
        ]
      },
      {
        "id": "ab4da279-1b36-476b-a27a-01ba3d6ad50a",
        "name": "WOM_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0a65a866-9451-41b5-8729-6cc56a5c8fe1",
        "name": "SKS WMS & Support_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          1566
        ]
      },
      {
        "id": "6659c7c5-35be-4ad7-b60f-029cfa9855cf",
        "name": "Access4Magenta_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5f3f6b59-aa17-444e-9c83-ec43ea5ae458",
        "name": "ASF Product APIs_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2845,
          3599,
          3689,
          3118,
          2853,
          3464,
          2881
        ]
      },
      {
        "id": "3bd87162-3adc-49eb-a6e9-bcbdc0b8e715",
        "name": "Phoenix_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2760
        ]
      },
      {
        "id": "43e6d839-5ab6-43bc-97f4-2986d91ed0a6",
        "name": "CV Framework & Appliance",
        "structureName": nil,
        "heads": [],
        "employees": [
          100,
          1395,
          3136,
          2172,
          3623,
          3386
        ]
      },
      {
        "id": "31fbc0c0-d3d9-468e-b702-c24b0edcb91e",
        "name": "E2E Magenta Integr_BOP_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "e4f0627a-00ed-4884-8eab-b91607df83b8",
        "name": "NCA_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "340407a4-8842-4c84-be57-7f18343cdd79",
        "name": "IoT Platforms",
        "structureName": nil,
        "heads": [
          2699
        ],
        "employees": [
          3177,
          3273,
          3035,
          2910,
          3336,
          2257,
          2071,
          3271
        ]
      },
      {
        "id": "118f35b8-f319-412b-a0ba-a2ec0eaf1432",
        "name": "FM-IP (NCA Hub)_FacN_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          699
        ]
      },
      {
        "id": "a9c23062-7113-4c95-8dcf-c3baa7977d81",
        "name": "PMO Internal_SSC gPMO",
        "structureName": nil,
        "heads": [
          2007,
          222
        ],
        "employees": [
          2839,
          3069,
          3055,
          3507
        ]
      },
      {
        "id": "9fef199c-c3df-496f-a4d1-bd4292e04ef1",
        "name": "RMK AT_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4a46357d-f669-416c-9a7c-9288fd9959e5",
        "name": "WMS Technik_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a02c4753-609d-4fa9-8e8d-afb86a2aedaa",
        "name": "VIZneo",
        "structureName": nil,
        "heads": [
          270
        ],
        "employees": [
          3331,
          3241,
          3582,
          1924
        ]
      },
      {
        "id": "c1964964-567f-4e11-8646-f2187feedf3f",
        "name": "GIS FNI_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3635,
          864,
          851,
          614,
          3634,
          527,
          3290
        ]
      },
      {
        "id": "b29d0285-0a38-49ba-a1b7-2554c9447b68",
        "name": "SSO_Hub_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c7c82361-a47d-4c30-9e19-6e45ba48a6d3",
        "name": "TTL Test",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          3192,
          3573,
          3413,
          3419
        ]
      },
      {
        "id": "e3016b40-f909-4812-a868-f5edd7844778",
        "name": "Fieldservice_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "79fdc4a3-034b-441a-82e6-82059e7961de",
        "name": "JEDI",
        "structureName": nil,
        "heads": [
          257
        ],
        "employees": [
          128
        ]
      },
      {
        "id": "6ec14d70-eb3e-4534-9659-850672579962",
        "name": "Gigabit_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2749,
          2678,
          2378,
          3364,
          601,
          3666,
          2393,
          908,
          3142,
          2356,
          2919,
          3034,
          2497,
          1825,
          1095,
          3278,
          2581,
          3246,
          3022,
          2107,
          3497,
          975,
          994
        ]
      },
      {
        "id": "fb710c2f-601a-4b61-b841-d05037f35e34",
        "name": "SMB",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          3213,
          2264,
          3064
        ]
      },
      {
        "id": "bc8fc8de-e8cb-4e69-9b40-b3249b220167",
        "name": "ASF Product APIs_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "91c7156b-30c0-4e2c-9c28-fb7d4ec695f6",
        "name": "M2M (freelance)",
        "structureName": nil,
        "heads": [],
        "employees": [
          873,
          2152
        ]
      },
      {
        "id": "bb3aa681-37fd-4b31-aff9-0266cf987acf",
        "name": "GUI for Mainframes",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          555,
          3173
        ]
      },
      {
        "id": "7c58efbf-3822-4c19-aee1-7748d0edb18d",
        "name": "Gigabit_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2727,
          1293
        ]
      },
      {
        "id": "f5425d28-aa4e-45e3-b6aa-d20d69d6e43b",
        "name": "Retail Sales_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6a03f6aa-c365-425d-9718-6aa7fe1a5ac2",
        "name": "T-Plan GP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "52729712-ac51-41d9-8105-42308ed2f726",
        "name": "CA-SM_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6e8c4950-33ae-40cd-8e74-8a2f802f8a0a",
        "name": "Phantom_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "3f42ab99-5a2a-4dc4-b217-c736eae73956",
        "name": "MAD/ PersDispo_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c0827009-9113-466c-807c-da3b74a15ecc",
        "name": "WMS Technik_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          374,
          25,
          1670
        ]
      },
      {
        "id": "7be30c2f-04a2-42e5-88dd-3b2a24a6a783",
        "name": "AM@BSO Portale_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          2269,
          3143,
          1988,
          1707
        ]
      },
      {
        "id": "27ef59b3-80a1-4ebd-8c17-ba0e414bf6a2",
        "name": "ECM Image Master ",
        "structureName": nil,
        "heads": [
          180
        ],
        "employees": [
          158,
          2244,
          3334,
          692,
          313,
          3385,
          2936,
          2429,
          1793,
          641,
          2036,
          2164,
          2407,
          1036,
          498,
          535,
          1199,
          3518,
          2725,
          1950,
          547,
          3217,
          406,
          252,
          1175,
          1789,
          3222,
          3260,
          1484,
          1723,
          934,
          2631,
          865,
          3521,
          2932
        ]
      },
      {
        "id": "3998df09-5ed9-4de4-8f95-724a8b939582",
        "name": "OSC SaaS",
        "structureName": nil,
        "heads": [
          1393
        ],
        "employees": [
          2643,
          3545,
          2277,
          3361
        ]
      },
      {
        "id": "c81e4d5b-a2e5-4dc1-8566-8954577ca930",
        "name": "MaVi _STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1076,
          324,
          2383,
          639,
          2190,
          1622,
          317,
          2474
        ]
      },
      {
        "id": "71dc6a7a-99b2-4aa5-91a3-7aced34c60e9",
        "name": "S&FOut_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "fd7eb648-fab6-489e-843c-bc2cf07b8d4a",
        "name": "DPDHL",
        "structureName": nil,
        "heads": [
          2280
        ],
        "employees": [
          2278
        ]
      },
      {
        "id": "b28acd64-2824-4a7b-91c8-48b486e1a013",
        "name": "mShop_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8a754092-0325-488d-9e9d-6ec8ee1e100e",
        "name": "Agile Coach",
        "structureName": nil,
        "heads": [],
        "employees": [
          342
        ]
      },
      {
        "id": "04a0498e-1418-4634-b2ca-0037cde07f81",
        "name": "Indoor Navigation_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "05e46fc8-9745-486e-aea2-39204dd0b0bd",
        "name": "AC Centric_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8a9a5d45-7be0-46de-9bd4-0241694ff1e1",
        "name": "Phoenix_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3442,
          2110
        ]
      },
      {
        "id": "97167ba0-36b3-4921-ace0-1cdd72893ad3",
        "name": "SKS WMS & Support_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2655,
          1384,
          1515
        ]
      },
      {
        "id": "0e2908c4-cf06-45fa-a35a-62dc298dff43",
        "name": "CA-SM_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "99a99b5a-51c0-4d30-8f29-3d5310cfafed",
        "name": "CIAM_Test_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "80aaec34-dc73-42eb-a48e-a9a9b66400ed",
        "name": "SP Test_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2180,
          1488
        ]
      },
      {
        "id": "1c9044a1-3be1-42b9-857b-c453b44ea786",
        "name": "CCP_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1594,
          1593
        ]
      },
      {
        "id": "f8436ad7-ceaf-4ab4-a510-c8cbd627c053",
        "name": "Wholesale Breitband_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "dad97484-44c8-4eb8-be38-47333149a0a8",
        "name": "PMO Internal_SSC AD3",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          2839,
          3069,
          3055,
          3507
        ]
      },
      {
        "id": "b85795bd-a2b8-4a0d-8afb-83f479af6cef",
        "name": "CRM FN_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ad71d143-07e7-476f-bd1f-69cbaa65c68c",
        "name": "Shell Encryption",
        "structureName": nil,
        "heads": [
          2007
        ],
        "employees": [
          2615
        ]
      },
      {
        "id": "dbf48ae8-b6eb-4c50-90e7-e7468667925c",
        "name": "OS & Readiness_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "97d53042-b9da-4581-a339-b8a39f1a4615",
        "name": "Daimler FC (MIF)",
        "structureName": nil,
        "heads": [
          3601
        ],
        "employees": [
          361,
          128,
          2696,
          3434,
          871,
          570
        ]
      },
      {
        "id": "6a6a1908-c048-40c2-b001-2765c6a9ca3d",
        "name": "Gigabit_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2579,
          787,
          1132,
          2066,
          3065,
          1720,
          2091,
          3000,
          3190,
          502,
          3216,
          2268,
          3343,
          2959,
          2588,
          2510,
          2382,
          3125,
          2663,
          2817,
          3033,
          2392,
          3083,
          3070,
          689,
          1892,
          1201,
          3210,
          1521,
          3185,
          3108,
          2467,
          3311,
          2927,
          2121,
          3490,
          815,
          2312,
          1160,
          315,
          3144,
          2977,
          2593
        ]
      },
      {
        "id": "4313514e-aa4e-48aa-8212-43ea51f5e5d5",
        "name": "Kibana",
        "structureName": nil,
        "heads": [],
        "employees": [
          3315
        ]
      },
      {
        "id": "cc696ba9-a105-4823-b40f-4c640b546093",
        "name": "WorkforceManagement_BOP_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          278
        ]
      },
      {
        "id": "cc8ac7a7-9951-42ed-a772-81e269600843",
        "name": "Net4F_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8ead89ca-cd97-4504-bada-04e5e39d6003",
        "name": "B2B Digital Off&Ord_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c8c19da8-a9af-4686-8770-e97677357817",
        "name": "GIS FNI_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          1575
        ]
      },
      {
        "id": "1ffe4ce2-10f9-4a0d-994b-6c3ea0d3ab6e",
        "name": "REM/GSUS_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          443
        ]
      },
      {
        "id": "ae26c0d7-38df-4319-a6d0-5263e0341814",
        "name": "IC-P_TI",
        "structureName": nil,
        "heads": [
          159
        ],
        "employees": [
          160
        ]
      },
      {
        "id": "2da267f5-3df6-4f1d-af1f-dc49cc971cbe",
        "name": "SSO_Hub_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c9ad65a0-34b7-4ce5-aca5-3445eb6dcdfe",
        "name": "Wholesale Breitband_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "4b6c075b-5d70-4e7d-89fa-804c2e9881d3",
        "name": "ASF Customer APIs_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3683
        ]
      },
      {
        "id": "1ba14100-f4b7-412b-837e-0a4905162be3",
        "name": "HeliOSS_BA_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "737968e6-eb4f-4546-8540-bda7a2422739",
        "name": "BEAR_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "908e69d7-262c-496e-b562-62bc378d8e8d",
        "name": "Wholesale Breitband_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2666
        ]
      },
      {
        "id": "7e69de8a-7aca-49af-b64f-75281288e19c",
        "name": "Real Estate Mngmt_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8fbead89-c57b-4876-aafb-94e4dd7cc8bf",
        "name": "OS & Readiness_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "83bc2335-eca7-49ab-8f5e-578228fa1b95",
        "name": "Z_No Hub_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5071fe9d-e829-41ad-9c25-5e47265b9973",
        "name": "Retail Sales_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "61680e16-d5f2-442b-87fe-f170fde3f152",
        "name": "Digital Sales (SnA)_BOP",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "26aa6b40-32fc-4992-b6f0-38173ec5580c",
        "name": "SMK FSS_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "317b55ba-049c-44f9-88c0-c4851e8fca40",
        "name": "B2B Digital TouchP_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "51150c47-c35d-4780-a2ae-c1fd0aae9a94",
        "name": "FTTH Factory_ITest",
        "structureName": nil,
        "heads": [],
        "employees": [
          1353
        ]
      },
      {
        "id": "2b4d6a65-4687-4def-8533-847a894ee727",
        "name": "TVPP_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          2049,
          486
        ]
      },
      {
        "id": "eff845aa-1028-460c-88ec-d4587a1f160b",
        "name": "OMS IP_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "43a57b18-f090-408e-babb-b068c5fd9a6f",
        "name": "Megaplan ST",
        "structureName": nil,
        "heads": [
          525
        ],
        "employees": [
          2070,
          3237,
          2292
        ]
      },
      {
        "id": "88854ca0-ab95-4c31-ad75-7dd7009fdfda",
        "name": "Phoenix_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2397,
          1339,
          998,
          419
        ]
      },
      {
        "id": "1e108175-3ed2-40bd-bee8-68e9eddcc013",
        "name": "CI/CD_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          916,
          199,
          1187,
          1094,
          1718
        ]
      },
      {
        "id": "c60d6407-0e47-484d-ae9b-6a7ec3507a03",
        "name": "CIAM_Test_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "a2c205c2-20b1-44cb-9c0d-e05101db375e",
        "name": "IoT Hub",
        "structureName": nil,
        "heads": [
          2699
        ],
        "employees": [
          1734,
          1907,
          3360,
          2816,
          1535,
          2207,
          3596,
          946,
          626,
          709,
          2750,
          2699,
          395,
          2949,
          3371,
          2808,
          2986,
          2595,
          1313,
          3636
        ]
      },
      {
        "id": "cc7284b1-6512-4358-bdc6-abf847405e9f",
        "name": "GeoHub_FacM",
        "structureName": nil,
        "heads": [],
        "employees": [
          1870
        ]
      },
      {
        "id": "b728f7fd-cc7d-4489-9cc6-de85b72f2c24",
        "name": "Fieldservice_P&S",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ce9b2ff9-4de3-461e-aa3a-2a8694f8e301",
        "name": "WMS TI _DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "ec9d93e8-3c59-4ec2-949f-b020f7b06380",
        "name": "Net4F_BOP",
        "structureName": nil,
        "heads": [],
        "employees": [
          3145
        ]
      },
      {
        "id": "27cadb10-c7c7-44fd-ba0a-8ec3b21505ee",
        "name": "TVPP Support_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": [
          3110
        ]
      },
      {
        "id": "dcbba935-a091-4731-b98e-b5192fb6f6b9",
        "name": "MaVi_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2fa720de-8eea-43a1-8ca9-3a7764d67b82",
        "name": "WMS TI _BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6dcf7988-afc6-4801-bd6c-dee61b9a5ea6",
        "name": "BMW Logistics",
        "structureName": nil,
        "heads": [
          2013
        ],
        "employees": [
          2493,
          3328,
          572,
          2657,
          3096,
          2501,
          3506
        ]
      },
      {
        "id": "7e95ade1-afa3-4497-92dc-e90865d0613d",
        "name": "Network Transform_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          3270,
          3645,
          1644,
          3298,
          3570,
          817,
          1236,
          439
        ]
      },
      {
        "id": "2eb664a7-d589-4ac2-bc7f-f804983bf898",
        "name": "TELSAD-CI/CD",
        "structureName": nil,
        "heads": [],
        "employees": [
          2742,
          868
        ]
      },
      {
        "id": "2d87d300-89fa-46ab-85d5-0a6f114ea14a",
        "name": "BPM Support_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c7be9e64-a698-403a-a7dc-5f20024defc3",
        "name": "Access4You_BA",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6e7d211a-43c4-4c65-987c-cc8909f4b978",
        "name": "ONE B2B IT Modern_FacM",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "eb6b5d8c-bded-49b0-87de-a19ad6a85da9",
        "name": "Unger Kabel",
        "structureName": nil,
        "heads": [
          272
        ],
        "employees": [
          736,
          328,
          309,
          3150
        ]
      },
      {
        "id": "f0e26387-00c2-4f5a-bfd5-a488d4c88ada",
        "name": "WorkforceManagement_SWEFS_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "bc9602b7-a317-4b8b-bdef-825fde85dd6c",
        "name": "mShop_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "d5d68d1e-c106-468c-86f2-0ba4b0754336",
        "name": "Coop",
        "structureName": nil,
        "heads": [
          663
        ],
        "employees": [
          736
        ]
      },
      {
        "id": "efd683a9-23af-4a8a-90bb-910747b252d4",
        "name": "DH SDx_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          66
        ]
      },
      {
        "id": "8a6cf94a-b06d-4b63-9a44-fc5012b9d843",
        "name": "SIMPLE_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2752,
          2344,
          584,
          3080
        ]
      },
      {
        "id": "420aaed2-e7b7-4ab1-9286-572f05c33336",
        "name": "WMS TI _SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "6867d93d-b022-4373-b515-b1e08924c5fc",
        "name": "AD_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2415,
          1397
        ]
      },
      {
        "id": "03694707-f30b-419d-923d-80b27ecc95be",
        "name": "RMK FSS_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "b917fbab-42b7-4127-bee9-28773d464510",
        "name": "Test Automation_STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": [
          1582
        ]
      },
      {
        "id": "27b8b60c-679a-43fc-b54b-ebf05bb318f5",
        "name": "TVPP_Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          348,
          242
        ]
      },
      {
        "id": "ff78b968-d25a-48fd-ae3e-7846c06967d6",
        "name": "Robotics & A&AI_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "44541d3a-9cef-4fa5-b433-f6c854612c67",
        "name": "eCare_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          2465,
          2134,
          1490
        ]
      },
      {
        "id": "41166331-89dc-41d3-a76a-8d64e2b588a3",
        "name": "Strive gPMO",
        "structureName": nil,
        "heads": [
          2003
        ],
        "employees": [
          2244,
          939,
          2386,
          3462,
          3264,
          1396,
          3226,
          3341,
          2523,
          2638,
          3266,
          3484
        ]
      },
      {
        "id": "cfbb8bf4-ccb6-4173-9678-f57fdf221341",
        "name": "SKS ES_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1172
        ]
      },
      {
        "id": "f281cba2-3e51-4ec6-aafd-af52af38f80c",
        "name": "FM PDH/SDH_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          467
        ]
      },
      {
        "id": "ec31853f-840e-4234-8138-c4ff765d287d",
        "name": "OTC Delivery",
        "structureName": nil,
        "heads": [
          1271
        ],
        "employees": [
          3383,
          2751,
          2706,
          2789,
          1654,
          2711,
          432,
          3075,
          912,
          2640,
          2605,
          2294,
          824,
          2716,
          3030,
          3474,
          1268,
          1357
        ]
      },
      {
        "id": "af6a06e9-851f-473e-b28e-5484f66bee18",
        "name": "CI/CD_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2946
        ]
      },
      {
        "id": "8d618178-094b-4a42-beb0-77d25921dc4b",
        "name": "MMKC_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3686,
          3619,
          1645,
          690,
          2757,
          1646,
          2203
        ]
      },
      {
        "id": "36605bb2-1208-46aa-addc-322d70c79bb2",
        "name": "Retail Sales_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0a16b5ac-4259-4f10-90a2-50d98cd7f292",
        "name": "MIC Dev",
        "structureName": nil,
        "heads": [
          2669
        ],
        "employees": [
          307,
          2656,
          2496,
          2596,
          3308,
          1706,
          2596,
          912,
          291,
          1219,
          1795,
          3458,
          3560,
          1633
        ]
      },
      {
        "id": "7d428a7d-4aa2-4497-bf98-ab8aa761ba73",
        "name": "DKS ProSt_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          881
        ]
      },
      {
        "id": "5832a410-3f8f-4917-b894-5f924679eff3",
        "name": "Net4F_FacN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "8b184692-fde3-4eba-bbac-c2fc136b4d8b",
        "name": "TARDIS_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          2077,
          2317,
          2045,
          3504,
          1635,
          2864,
          661,
          2443,
          1643
        ]
      },
      {
        "id": "23b0843f-27d1-4e75-bc4a-69511910be39",
        "name": "OneErp Procure_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          3122
        ]
      },
      {
        "id": "0579d480-b0cc-4198-907e-9b3784b1e9d0",
        "name": "S&FOut_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "163f9e82-9d6d-494e-a6a3-8947a8d83ad1",
        "name": "SKS ES_FacN",
        "structureName": nil,
        "heads": [],
        "employees": [
          24
        ]
      },
      {
        "id": "213a54b1-99be-483f-aab7-8ae584e4fb26",
        "name": "E2E Magenta Integr_STest_Service_No VAT",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "9c03f59f-80aa-4492-a476-3ddfc964e605",
        "name": "CIM HUB_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1069,
          1772,
          1817,
          2828,
          2796,
          3499,
          1368,
          3077,
          3256,
          1642,
          2787,
          1776,
          1724,
          2460,
          2791,
          2266
        ]
      },
      {
        "id": "7b7583df-d451-49a2-9303-626770a90aea",
        "name": "MMKC_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          479,
          2971,
          586
        ]
      },
      {
        "id": "70de1efd-f2e9-4e8c-9091-e66b5e42de40",
        "name": "CIAM_Test_STest",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "5a6f2f20-c132-4763-b3d4-d041da08c82f",
        "name": "CA-Integration_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          597
        ]
      },
      {
        "id": "b549715f-bbe4-41a1-9819-d3ea4f4dd89a",
        "name": "PBM Network_FIN&SCM",
        "structureName": nil,
        "heads": [],
        "employees": [
          2495,
          30,
          795,
          256,
          271,
          1612,
          2905,
          460,
          1062,
          832,
          449,
          945,
          885,
          1699,
          448,
          2866,
          316,
          1359,
          1038,
          1419,
          1675,
          465,
          1009,
          383,
          340,
          1429,
          367,
          1693,
          1424,
          1059,
          1948,
          796,
          566,
          1464,
          1117
        ]
      },
      {
        "id": "f06816a7-7c4e-45f2-a892-4239c8879d51",
        "name": "Accelerator Projects (BMA)",
        "structureName": nil,
        "heads": [
          2699
        ],
        "employees": [
          2608,
          2674,
          1602,
          3177,
          395
        ]
      },
      {
        "id": "84e167e1-3461-42ff-b26a-98d74962fe16",
        "name": "Integration Layer",
        "structureName": nil,
        "heads": [
          257
        ],
        "employees": [
          2144,
          1491,
          1204,
          1401,
          1417,
          2194,
          1283,
          153,
          1812
        ]
      },
      {
        "id": "23d33727-7c79-4640-99ac-aaa086a0f730",
        "name": "CCoE_Hub_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2a3e4598-6f96-4c1a-aa06-076ca4433e4b",
        "name": "OneApp_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2582,
          2358,
          1880,
          2517,
          897,
          1946
        ]
      },
      {
        "id": "d9ff1bcd-a44c-4de6-9d6c-52a81c89bd2a",
        "name": "CRM-T_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          1721
        ]
      },
      {
        "id": "de9feb66-4ed6-4c29-a597-a15c372f9e6c",
        "name": "WMS TI _Arch",
        "structureName": nil,
        "heads": [],
        "employees": [
          25
        ]
      },
      {
        "id": "5dc79d18-0078-443e-89e0-69368ce96e40",
        "name": "eCare_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": [
          415,
          83
        ]
      },
      {
        "id": "e47947b9-4010-4639-b9d7-123362572271",
        "name": "MIC Test",
        "structureName": nil,
        "heads": [
          289
        ],
        "employees": [
          3024,
          1358,
          1144,
          2939
        ]
      },
      {
        "id": "c7c773ab-ddc8-4bed-953a-dee8a6eee139",
        "name": "P&L Mngmt_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "47b5573f-ae68-4b98-9cde-896fb1a7eb25",
        "name": "SIMPLE_SWE D",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "1489557c-fb39-4f2c-9eac-eee69253e74f",
        "name": "Future Diagnostics_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "c5b3c18b-36f3-4187-a76c-4e6002efd616",
        "name": "Z_No Hub_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "91a84abd-186f-4de1-9fa9-894be22de3e7",
        "name": "PQA",
        "structureName": nil,
        "heads": [
          88
        ],
        "employees": [
          3211
        ]
      },
      {
        "id": "06488eaa-a8e3-464c-9508-545cf59af094",
        "name": "KolloDB_FacS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "16ecdb88-91d2-4acb-9ad1-dadd6364393a",
        "name": "NCA_Arch",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "0ef86850-7ae4-4bb3-a984-b5af4f971e63",
        "name": "DeTeFleet_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          193,
          490
        ]
      },
      {
        "id": "d38eecd3-3e35-4187-8b6f-771a939ee45d",
        "name": "T-Map LLS_SWEFE",
        "structureName": nil,
        "heads": [],
        "employees": [
          1326
        ]
      },
      {
        "id": "11d4d288-f609-4c6e-adfd-a9cf705c20ec",
        "name": "FTTH Factory_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          637
        ]
      },
      {
        "id": "8d6435e6-eb1e-4c3f-b2ed-2f76b49dda83",
        "name": "Network Transform_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          2812,
          3624,
          799,
          326
        ]
      },
      {
        "id": "c3782a61-b2de-42ed-8161-ec47dd5a27c2",
        "name": "Phoenix_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          3552,
          890,
          2441
        ]
      },
      {
        "id": "924c6613-2502-49bf-a7b7-5290e696d48e",
        "name": "PMO Internal_PU SAP",
        "structureName": nil,
        "heads": [],
        "employees": [
          3055
        ]
      },
      {
        "id": "8a53ae4d-f815-45db-87ff-0555c7522b7f",
        "name": "RMK AT_BA",
        "structureName": nil,
        "heads": [],
        "employees": [
          82
        ]
      },
      {
        "id": "7e9f0513-1094-42bf-9d71-afdd78e31450",
        "name": "Deal Factory",
        "structureName": nil,
        "heads": [],
        "employees": [
          3661,
          222,
          3408
        ]
      },
      {
        "id": "c5d1a466-72e7-4c9b-bfc8-00f684af3c85",
        "name": "DS & ContentMngmt_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "93fbc9c5-48c3-494b-b866-ddd4886caed6",
        "name": "T.Vision",
        "structureName": nil,
        "heads": [
          286
        ],
        "employees": [
          2048,
          1921,
          2291,
          1262,
          3282,
          2329,
          3321,
          3193,
          3500,
          943,
          3274,
          3639,
          285,
          2339,
          1947,
          2766,
          2062,
          3681
        ]
      },
      {
        "id": "3c8d50f0-cd2c-4543-8344-07b6fddf6cd9",
        "name": "NIMS",
        "structureName": nil,
        "heads": [],
        "employees": [
          3160,
          3018
        ]
      },
      {
        "id": "fc71e833-4665-4360-a2b1-1a7c863e8009",
        "name": "OpDiNG [ASS]_SWEFS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2038,
          3184,
          540,
          235,
          664
        ]
      },
      {
        "id": "cfde8c94-c7d5-48d4-9fd1-9276e8f5db8d",
        "name": "Neva_FacS",
        "structureName": nil,
        "heads": [],
        "employees": [
          2563
        ]
      },
      {
        "id": "3e4523fd-cdc1-484d-a401-c996cbe75d96",
        "name": "TechMig_STest",
        "structureName": nil,
        "heads": [],
        "employees": [
          892
        ]
      },
      {
        "id": "08099df1-0c6a-4247-b6c7-61196c5273ac",
        "name": "TIMB_DSOps",
        "structureName": nil,
        "heads": [],
        "employees": [
          7,
          774,
          786
        ]
      },
      {
        "id": "2803af9d-7c5f-4af7-828a-ee95cc052d56",
        "name": "S&FOut_OPSN",
        "structureName": nil,
        "heads": [],
        "employees": []
      },
      {
        "id": "2b9cda1f-b3ad-4b47-93cc-af204047d6e9",
        "name": "HeliOSS_SWEBE",
        "structureName": nil,
        "heads": [],
        "employees": [
          3522,
          2937,
          655,
          2897
        ]
      },
      {
        "id": "f02c9a54-95d6-487a-a6ec-0f298581ba4e",
        "name": "Gigabit_ITest",
        "structureName": nil,
        "heads": [
          389
        ],
        "employees": [
          1933,
          1242,
          2061,
          3059,
          1435,
          1026,
          1756,
          1809,
          1297,
          3132,
          172,
          800,
          3693,
          3373,
          596,
          3539,
          1134,
          1403,
          802,
          2219,
          1532,
          23,
          3101,
          3485,
          356,
          1470,
          3036,
          984,
          485,
          1215,
          2075,
          0
        ]
      }
    ]
  end
end
