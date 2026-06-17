import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Check, AlertTriangle, ExternalLink, Download,
  ChevronLeft, ImageOff, PackageSearch, Eraser,
  ShoppingCart, Plus, Minus, Trash2, Printer, Save, FolderOpen, ClipboardCheck, Mail, Lock, Unlock,
  Upload, FileSpreadsheet, PackagePlus, PackageMinus, RefreshCw
} from "lucide-react";

// PRE-ENRICHED INVENTORY WITH ZERO RUNTIME API COSTS
// To bypass hotlink blocking and guarantee 100% reliable image loading:
// Place your product images in your project's public folder (e.g., public/images/163-52434-U.jpg)
// and set "imageUrl": "/images/163-52434-U.jpg"
const INVENTORY = [
  {
    "storage": "3W",
    "category": "Diagnostics",
    "code": "163-52434-U",
    "desc": "OTOSCOPE EAR SPECULA DISP 850 EACH",
    "unit": "PK",
    "stock": "4",
    "productName": "Welch Allyn Disposable Ear Specula (850/pk)",
    "manufacturer": "Welch Allyn",
    "suggestedStatus": "match",
    "imageUrl": "/images/163-52434-u.jpg" // Update with a local path or verified image link
  },
  {
    "storage": "3W",
    "category": "Diagnostics",
    "code": "163-05031-105\\517SDML",
    "desc": "PROBE COVER FOR WELCH ALLYN SURE-TEMP THERMOMETER",
    "unit": "EA",
    "stock": "2",
    "productName": "Welch Allyn SureTemp Plus Probe Covers",
    "manufacturer": "Welch Allyn",
    "suggestedStatus": "match",
    "imageUrl": "/images/163-05031-105-517sdml.jpg"
  },
  {
    "storage": "3W",
    "category": "General Supplies",
    "code": "211-803",
    "desc": "APPLICATOR COTTON TIP 3\" NON-STERILE",
    "unit": "BG",
    "stock": "if needed",
    "productName": "3-Inch Non-Sterile Cotton Tipped Applicators",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-803.jpg"
  },
  {
    "storage": "3W",
    "category": "General Supplies",
    "code": "211-806",
    "desc": "APPLICATOR COTTON TIP 6\" NON-STERILE",
    "unit": "BG",
    "stock": "if needed",
    "productName": "6-Inch Non-Sterile Cotton Tipped Applicators",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://kinemedics.com/wp-content/uploads/2023/09/cotton-tip6.png",
    "imageFallback": "/images/211-806.png"
  },
  {
    "storage": "3W",
    "category": "General Supplies",
    "code": "211-807",
    "desc": "APPLICATOR COTTON TIP 6\" STERILE",
    "unit": "PK",
    "stock": "if needed",
    "productName": "6-Inch Sterile Cotton Tipped Applicators",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-807.jpg"
  },
  {
    "storage": "3W",
    "category": "General Supplies",
    "code": "NONPC1001",
    "desc": "SILENT KNIGHT PILL CRUSHER POUCHES",
    "unit": "PK",
    "stock": "3",
    "productName": "Silent Knight Pill Crusher Pouches (1000/pk)",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/nonpc1001.jpg"
  },
  {
    "storage": "3W",
    "category": "General Supplies",
    "code": "211-40003",
    "desc": "TONGUE DEPRESSOR JUNIOR",
    "unit": "BX",
    "stock": "1",
    "productName": "Junior Tongue Depressors",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-40003.jpg"
  },
  {
    "storage": "3W",
    "category": "IV",
    "code": "533-JB1322P",
    "desc": "NORMAL SALINE 0.9% SODIUM CHLORIDE 250ML BAG FOR INJECTION USP",
    "unit": "EA",
    "stock": "2",
    "productName": "0.9% Sodium Chloride Injection USP 250mL Bag",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jb1322p.jpg"
  },
  {
    "storage": "3W",
    "category": "IV",
    "code": "533-JB1323",
    "desc": "NORMAL SALINE 0.9% SODIUM CHLORIDE 500ML BAG FOR INJECTION USP",
    "unit": "EA",
    "stock": "2",
    "productName": "0.9% Sodium Chloride Injection USP 500mL Bag",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jb1323.jpg"
  },
  {
    "storage": "3W",
    "category": "IV",
    "code": "533-JB0063",
    "desc": "DEXTROSE 5% 500ML BAG FOR INJECTION USP",
    "unit": "EA",
    "stock": "if needed",
    "productName": "5% Dextrose Injection USP 500mL Bag",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jb0063.jpg"
  },
  {
    "storage": "3W",
    "category": "IV",
    "code": "308-383319",
    "desc": "BD SAF-T-INTIMA IV CATHETER WITH WINGS 24G X 3/4\" Y-ADAPTER",
    "unit": "EA",
    "stock": "3",
    "productName": "BD Saf-T-Intima IV Catheter 24G x 0.75\"",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-383319.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "E22-C1000",
    "desc": "CLAVE NEEDLELESS IV CONNECTOR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Clave Needleless Connector",
    "manufacturer": "ICU Medical",
    "suggestedStatus": "match",
    "imageUrl": "/images/e22-c1000.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "425T142",
    "desc": "Gripper plus non-coring safety needle",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Gripper Plus Non-Coring Safety Needle",
    "manufacturer": "Smiths Medical",
    "suggestedStatus": "match",
    "imageUrl": "/images/425t142.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-329505",
    "desc": "INSULIN PEN NEEDLE BD AUTOSHIELD 30GX5MM",
    "unit": "BX",
    "stock": "2",
    "productName": "BD AutoShield Duo Pen Needle 30G x 5mm",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-329505.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "MPHSFTY28",
    "desc": "SAFETY BLOOD LANCET PUSH BUTTON TYPE MICRO FLOW 28G X 1.6MM DEPTH LIGHTBLUE BOX/200 EACH",
    "unit": "BX",
    "stock": "2",
    "productName": "Safety Blood Lancet Micro Flow 28G",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/mphsfty28.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "533-2C8401",
    "desc": "IV SOLUTION SET W/CLEARLINK LUER INJECT SITE & MALE LUER LOCK ADAPTER AND ROLLER CLAMP 76\" LENGTH 10 DROP",
    "unit": "EA",
    "stock": "3",
    "productName": "ClearLink IV Solution Set 76\" 10 Drop",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-2c8401.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "533-1C8109",
    "desc": "IV SOLUTION SET W/NO INJECT SITE & MALE LUER LOCK ADAPTER AND ROLLER CLAMP 101\"LENGTH 10 DROP",
    "unit": "EA",
    "stock": "if needed",
    "productName": "IV Solution Set No Injection Site 101\"",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-1c8109.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-305764",
    "desc": "NEEDLE ONLY BD SAFETY 21GX1TW",
    "unit": "EA",
    "stock": "20",
    "productName": "BD SafetyGlide Shielding Needle 21G x 1\"",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-305764.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-305762",
    "desc": "NEEDLE ONLY BD SAFETY 23GX1\"",
    "unit": "EA",
    "stock": "20",
    "productName": "BD SafetyGlide Shielding Needle 23G x 1\"",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-305762.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "SYR110022F",
    "desc": "NEEDLE ONLY BLUNT FILL 18GX1.5\" STERILE W/FILTER CASE/1000 EACH",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Blunt Fill Needle 18G x 1.5\" with Filter",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/syr110022f.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-305787",
    "desc": "NEEDLE WITH BD LUER-LOK SYRINGE",
    "unit": "EA",
    "stock": "0",
    "productName": "BD SafetyGlide Needle with Luer-Lok Syringe",
    "manufacturer": "BD",
    "suggestedStatus": "unsure",
    "imageUrl": "/images/308-305787.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "SN2510",
    "desc": "Sol-care safety needel 25GX1\"",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Sol-Care Safety Needle 25G x 1\"",
    "manufacturer": "Sol-Millennium",
    "suggestedStatus": "match",
    "imageUrl": "/images/sn2510.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "280-SG3-2325",
    "desc": "SURGUARD-3 SAFETY NEEDLE ONLY 23GX1\"",
    "unit": "EA",
    "stock": "0",
    "productName": "SurGuard3 Safety Needle 23G x 1\"",
    "manufacturer": "Terumo",
    "suggestedStatus": "match",
    "imageUrl": "/images/280-sg3-2325.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-305930",
    "desc": "SYRING INSULIN 1CC 29G X 1/2",
    "unit": "EA",
    "stock": "20",
    "productName": "BD Insulin Syringe 1mL 29G x 0.5\"",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-305930.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-305060",
    "desc": "SYRINGE 3CC WITH 18GX1.5\" BLUNT FILL NEEDLE LUER LOCK",
    "unit": "EA",
    "stock": "10",
    "productName": "BD 3mL Syringe with 18G Blunt Fill Needle",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-305060.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "SYR101010LD",
    "desc": "SYRINGE ONLY 1ML LUER LOCK LATEX-FREE STERILE",
    "unit": "EA",
    "stock": "0",
    "productName": "1mL Luer Lock Syringe Only Sterile",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": ""
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "SYR103010",
    "desc": "SYRINGE ONLY 3ML LUER LOCK LATEX-FREE STERILE",
    "unit": "EA",
    "stock": "0",
    "productName": "3mL Luer Lock Syringe Only Sterile",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "https://www.henryschein.com/Products/1310968_US_front_01_600x600.jpg",
    "imageFallback": "/images/syr103010.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-302995",
    "desc": "SYRINGE ONLY BD 10ML LUER LOCK",
    "unit": "EA",
    "stock": "5",
    "productName": "BD 10mL Luer Lock Syringe Only",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-302995.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "308-309654",
    "desc": "SYRINGE ONLY BD 60ML SLIP TIP",
    "unit": "EA",
    "stock": "if needed",
    "productName": "BD 60mL Slip Tip Syringe Only",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-309654.jpg"
  },
  {
    "storage": "3W",
    "category": "Needle, Syringes",
    "code": "DYND20325",
    "desc": "IRRIGATION SYRINGE, PISTON STYLE, 60ML GRADUATED IN OZ AND ML, INDVWRAPPED, STERILE CASE/50 EACH",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Piston Style 60mL Irrigation Syringe",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd20325.jpg"
  },
  {
    "storage": "3W",
    "category": "Nutrition",
    "code": "320-ENFIT9000NS",
    "desc": "ENFIT QUICK SWITCH Y-ADAPT VALVE FOR ENTERAL FEED",
    "unit": "EA",
    "stock": "if needed",
    "productName": "ENFit Quick Switch Y-Adapter Valve",
    "manufacturer": "Vygon",
    "suggestedStatus": "match",
    "imageUrl": "/images/320-enfit9000ns.jpg"
  },
  {
    "storage": "3W",
    "category": "Nutrition",
    "code": "NON66160",
    "desc": "ENFIT SYRINGE W/ ENFIT CONNECTION STERILE 60ML",
    "unit": "EA",
    "stock": "if needed",
    "productName": "ENFit Sterile Syringe 60mL",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/non66160.jpg"
  },
  {
    "storage": "3W",
    "category": "Nutrition",
    "code": "ZBSPFF",
    "desc": "Kangaroo OMNI\u2122 Feeding Set with Flush Bag and ENPlus Spike 1000ML",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Kangaroo OMNI Enteral Feeding Set 1000mL",
    "manufacturer": "Cardinal Health",
    "suggestedStatus": "match",
    "imageUrl": "/images/zbspff.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "200-69C",
    "desc": "NORMAL SALINE SODIUM CHLORIDE 0.9% 15ML UNIT DOSE STERILE FORRESPIRATORY THERAPY ONLY CASE/144 EACH",
    "unit": "PK",
    "stock": "if needed",
    "productName": "Addipak 0.9% Normal Saline Solution 15mL",
    "manufacturer": "Hudson RCI",
    "suggestedStatus": "match",
    "imageUrl": "/images/200-69c.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "DYND50216",
    "desc": "NON-CONDUCTIVE CONNECTING TUBING 6''",
    "unit": "EA",
    "stock": "5",
    "productName": "Non-Conductive Connecting Suction Tubing 6ft",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd50216.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "HCS4600B",
    "desc": "O2 face Mask",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Medium Concentration Oxygen Face Mask",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/hcs4600b.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "HCS4514",
    "desc": "O2 Nasal Cannula",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Adult Oxygen Nasal Cannula",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/hcs4514.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "320-HCS4507",
    "desc": "O2 TUBING CRUSH RESISTANT W/STD CONNECTOR 7''(2.1M)",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Crush Resistant Oxygen Tubing 7ft",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/320-hcs4507.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "DYND40922A",
    "desc": "WHISTLE TIP SUCTION CATHETER 14FR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Whistle Tip Suction Catheter 14Fr",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd40922a.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "DYND41903",
    "desc": "WHISTLE TIP SUCTION CATHETER 16FR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Whistle Tip Suction Catheter 16Fr",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd41903.jpg"
  },
  {
    "storage": "3W",
    "category": "Respiratory",
    "code": "DYND50130",
    "desc": "YANKAUER NON-VENTED",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Yankauer Suction Handle Non-Vented",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd50130.jpg"
  },
  {
    "storage": "3W",
    "category": "SYRINGE",
    "code": "211-MM-05507",
    "desc": "ALCOHOL PREP MEDIUM",
    "unit": "BX",
    "stock": "2",
    "productName": "Medium Isopropyl Alcohol Prep Pads",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-mm-05507.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "533-JF7624",
    "desc": "Sterile Water for Irrigation 1000ml",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Sterile Water for Irrigation 1000mL Pour Bottle",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jf7624.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "533-JF7623",
    "desc": "Sterile Water for Irrigation 500ML",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Sterile Water for Irrigation 500mL Pour Bottle",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jf7623.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "533-JF7633P",
    "desc": "Sodium Chloride 0.9% Sol for Irrigation",
    "unit": "EA",
    "stock": "if needed",
    "productName": "0.9% Sodium Chloride Irrigation Solution 1000mL",
    "manufacturer": "Baxter",
    "suggestedStatus": "match",
    "imageUrl": "/images/533-jf7633p.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "211-136",
    "desc": "SYRINGE IRRIGATION TRAY W/60 CC PISTON",
    "unit": "EA",
    "stock": "2",
    "productName": "Piston Syringe Irrigation Tray 60cc",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-136.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11500",
    "desc": "CATHETER FOLEY 2-WAY 100% SILICONE 10CC 12FR STERILE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "2-Way 100% Silicone Foley Catheter 12Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11500.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11501",
    "desc": "CATHETER FOLEY 2-WAY 100% SILICONE 10CC 14FR STERILE",
    "unit": "EA",
    "stock": "2",
    "productName": "2-Way 100% Silicone Foley Catheter 14Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11501.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11502",
    "desc": "CATHETER FOLEY 2-WAY 100% SILICONE 10CC 16FR STERILE",
    "unit": "EA",
    "stock": "2",
    "productName": "2-Way 100% Silicone Foley Catheter 16Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11502.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11752",
    "desc": "CATHETER FOLEY SILICONE COATED 2-WAY 10CC 12FR",
    "unit": "EA",
    "stock": "5",
    "productName": "Silicone-Coated 2-Way Foley Catheter 12Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11752.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11754",
    "desc": "CATHETER FOLEY SILICONE COATED 2-WAY 10CC 14FR",
    "unit": "EA",
    "stock": "5",
    "productName": "Silicone-Coated 2-Way Foley Catheter 14Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11754.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND11756",
    "desc": "CATHETER FOLEY SILICONE COATED 2-WAY 10CC 16FR",
    "unit": "EA",
    "stock": "5",
    "productName": "Silicone-Coated 2-Way Foley Catheter 16Fr 10cc",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd11756.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND16900",
    "desc": "CATHETER LEG STRAP W/VELCRO CLOSURE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Foley Catheter Leg Strap with Velcro Closure",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd16900.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND13512",
    "desc": "CATHETER RED RUBBER 12FR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Red Rubber Intermittent Catheter 12Fr",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd13512.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND13514",
    "desc": "CATHETER RED RUBBER 14FR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Red Rubber Intermittent Catheter 14Fr",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd13514.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND13516",
    "desc": "CATHETER RED RUBBER 16FR",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Red Rubber Intermittent Catheter 16Fr",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd13516.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "211-UR880",
    "desc": "CATHETER TRAY WITH 10CC PRE-FILLED SYRINGE LATEX-FREE STERILE",
    "unit": "EA",
    "stock": "20",
    "productName": "Foley Catheter Insertion Tray (No Catheter)",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-ur880.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND12588",
    "desc": "FABRIC BACK LEG BAG LRG,",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Urinary Leg Bag with Fabric Back, Large",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd12588.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND12550",
    "desc": "LEG BAG EXTENSION TUBE 18\" EACH",
    "unit": "EA",
    "stock": "0",
    "productName": "Vinyl Leg Bag Extension Tubing 18\"",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd12550.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "MDS032273Z",
    "desc": "LUBRICATING JELLY 2.7GM PK STERILE",
    "unit": "EA",
    "stock": "30",
    "productName": "Sterile Lubricating Jelly Foil Packets 2.7g",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/mds032273z.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "5110",
    "desc": "Male EXTERNAL CATHETER, Freedom 23MM",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Coloplast Freedom Male External Catheter 23mm",
    "manufacturer": "Coloplast",
    "suggestedStatus": "match",
    "imageUrl": "/images/5110.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "687-97525\\\nDYND12303",
    "desc": "Male EXTERNAL CATHETER, HOLLISTER 25MM SMALL",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Hollister InView Male External Catheter 25mm",
    "manufacturer": "Hollister",
    "suggestedStatus": "match",
    "imageUrl": "https://www.aplus-medicalsupply.com/media/products/97529.jpg",
    "imageFallback": "/images/687-97525-dynd12303.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "687-9208",
    "desc": "Male EXTERNAL CATHETER, HOLLISTER 32MM MEDIUM",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Hollister InView Male External Catheter 32mm",
    "manufacturer": "Hollister",
    "suggestedStatus": "match",
    "imageUrl": "/images/687-9208.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND12302",
    "desc": "Male EXTERNAL CATHETER, EXO-CATH MEDIUM 30mm",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Medline Exo-Cath External Male Catheter 30mm",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd12302.jpg"
  },
  {
    "storage": "3W",
    "category": "Urology",
    "code": "DYND15207",
    "desc": "URINARY DRAINAGE BAG 2000 ML,",
    "unit": "BG",
    "stock": "30",
    "productName": "Urinary Drainage Bag 2000mL",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynd15207.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "MDS087002LF",
    "desc": "BANDAGE ELASTIC TENSOR 2\"X5YDS LATEX",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Elastic Tensor Bandage Latex Free 2\" x 5yd",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/mds087002lf.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "MDS087004LF",
    "desc": "BANDAGE ELASTIC TENSOR 4\"X5YDS LATEX",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Elastic Tensor Bandage Latex Free 4\" x 5yd",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/mds087004lf.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "NON25650",
    "desc": "BANDAGE FABRIC 3/4\"X3\"",
    "unit": "BX",
    "stock": "if needed",
    "productName": "Curad Fabric Adhesive Bandages 0.75\" x 3\"",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/non25650.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "PRM254192",
    "desc": "CONFORM STRETCH BANDAGE 2\" X 4.1YRD NON-STERILE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Conform Stretch Gauze Bandage Non-Sterile 2\"",
    "manufacturer": "Primary Medical",
    "suggestedStatus": "match",
    "imageUrl": "/images/prm254192.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "PRM254193",
    "desc": "CONFORM STRETCH BANDAGE 3\" X 4.1YRD NON-STERILE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Conform Stretch Gauze Bandage Non-Sterile 3\"",
    "manufacturer": "Primary Medical",
    "suggestedStatus": "match",
    "imageUrl": "/images/prm254193.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-S134CA-50",
    "desc": "CONFORM STRETCH GAUZE BANDAGE 2\"*4.1 STERILE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Sterile Conform Stretch Gauze Bandage 2\"",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-s134ca-50.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "173-677401",
    "desc": "DRESSING MESORB 10CM X 20CM",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Mesorb Highly Absorbent Exudate Dressing 10x20cm",
    "manufacturer": "Mölnlycke",
    "suggestedStatus": "match",
    "imageUrl": "/images/173-677401.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-D101108",
    "desc": "DRESSING TRAY W/FORCEPS",
    "unit": "EA",
    "stock": "10",
    "productName": "Sterile Wound Dressing Tray with Plastic Forceps",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-d101108.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-052110",
    "desc": "GAUZE SPONGE 8 PLY NON-STERILE 10CMX10CM PKG",
    "unit": "EA",
    "stock": "1",
    "productName": "Non-Sterile 8-Ply Woven Gauze Sponges 10x10cm",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-052110.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-052112\\211-052113",
    "desc": "GAUZE SPONGE 8 PLY NON-STERILE 5CMX5CM",
    "unit": "EA",
    "stock": "2",
    "productName": "Non-Sterile 8-Ply Woven Gauze Sponges 5x5cm",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-052112-211-052113.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-052114",
    "desc": "GAUZE SPONGE 8 PLY NON-STERILE 7.5CMX7.5CM",
    "unit": "EA",
    "stock": "1",
    "productName": "Non-Sterile 8-Ply Woven Gauze Sponges 7.5x7.5cm",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-052114.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "NON21424",
    "desc": "GAUZE SPONGE NW 12 PLY STERILE 10.1CMX10.1CM",
    "unit": "EA",
    "stock": "0",
    "productName": "Sterile 12-Ply Non-Woven Gauze Sponges 10x10cm",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/non21424.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-A4440",
    "desc": "GAUZE SPONGE NW 4 PLY STERILE 10CMX10CM",
    "unit": "EA",
    "stock": "1",
    "productName": "Sterile 4-Ply Non-Woven Gauze Sponges 10x10cm",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-a4440.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-A2240",
    "desc": "GAUZE SPONGE NWB 4 PLY STERILE 5CMX5CM",
    "unit": "EA",
    "stock": "1",
    "productName": "Sterile 4-Ply Non-Woven Gauze Sponges 5x5cm",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-a2240.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "127-7646007",
    "desc": "LEUKOPLAST FABRIC BANDAGE 2.2CM X 7.2CM",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Leukoplast Fabric Adhesive Bandages 2.2x7.2cm",
    "manufacturer": "BSN Medical",
    "suggestedStatus": "match",
    "imageUrl": "/images/127-7646007.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-2863",
    "desc": "MEDIPORE HSOFT CLOTH TAPE PERF 7.5CM*9.1M",
    "unit": "EA",
    "stock": "if needed",
    "productName": "3M Medipore H Soft Cloth Tape 7.5cm x 9.1m",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-2863.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-2864",
    "desc": "TAPE SOFT CLOTH ON LINER 10CMx10CM",
    "unit": "EA",
    "stock": "4",
    "productName": "3M Medipore Soft Cloth Tape on Liner 10x10cm",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-2864.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "NON25700",
    "desc": "NON-ADHERENT CURAD TYPE PAD 2\"X3\"",
    "unit": "EA",
    "stock": "1",
    "productName": "Curad Non-Adherent Dressing Pads 2\" x 3\"",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/non25700.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "NON25720",
    "desc": "NON-ADHERENT TELFA TYPE PAD 8\"X3\"",
    "unit": "EA",
    "stock": "0",
    "productName": "Telfa Type Non-Adherent Dressing Pads 3\" x 8\"",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/non25720.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "211-018-600",
    "desc": "Plastic Bandage Strip, Latex Free 3/4''x3''",
    "unit": "EA",
    "stock": "1",
    "productName": "Plastic Adhesive Bandage Strips 0.75\" x 3\"",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/211-018-600.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-16004",
    "desc": "TEGADERM ROLL TRANSPARENT FILM NON-STERILE 10CMX10M ROLL, CASE/4 ROLL",
    "unit": "EA",
    "stock": "1",
    "productName": "3M Tegaderm Transparent Film Roll 10cm x 10m",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-16004.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1530-1",
    "desc": "MICROPORE PAPER TAPE 1\" X 10 YARD WHITE",
    "unit": "roll",
    "stock": "4",
    "productName": "3M Micropore Paper Surgical Tape White 1\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1530-1.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1530-2",
    "desc": "MICROPORE PAPER TAPE 2\" X 10 YARD WHITE",
    "unit": "roll",
    "stock": "4",
    "productName": "3M Micropore Paper Surgical Tape White 2\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1530-2.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1530-0",
    "desc": "MICROPORE PAPER TAPE 1/2\"X10YD WHITE",
    "unit": "roll",
    "stock": "4",
    "productName": "3M Micropore Paper Surgical Tape White 0.5\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1530-0.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1533-0",
    "desc": "Tan surgical tape 0.5in x 10YD box/24 yard",
    "unit": "roll",
    "stock": "if needed",
    "productName": "3M Micropore Surgical Tape Tan 0.5\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1533-0.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1527-0",
    "desc": "TRANSPORE SURGICAL TAPE 1/2\" X 10YARD CLEAR",
    "unit": "roll",
    "stock": "4",
    "productName": "3M Transpore Clear Surgical Tape 0.5\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1527-0.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1527-1",
    "desc": "TRANSPORE SURGICAL TAPE 1\" X 10 YARD CLEA",
    "unit": "roll",
    "stock": "4",
    "productName": "3M Transpore Clear Surgical Tape 1\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1527-1.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "355-1527-2",
    "desc": "TRANSPORE SURGICAL TAPE 2\" X 10 YARD CLEAR",
    "unit": "roll",
    "stock": "if needed",
    "productName": "3M Transpore Clear Surgical Tape 2\"",
    "manufacturer": "3M",
    "suggestedStatus": "match",
    "imageUrl": "/images/355-1527-2.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "601-T168000",
    "desc": "NORMAL SALINE SODIUM CHLORIDE 0.9% FOR WOUND IRRIGATION WITH DUAL FLOW CAP 100ML SQUEEZE BOTTLE STERILE",
    "unit": "EA",
    "stock": "if needed",
    "productName": "0.9% Sodium Chloride Wound Irrigation Squeeze Bottle 100mL",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/601-t168000.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "EMZ111240",
    "desc": "0.9% sodium chloride injection 10ml flush syringe",
    "unit": "EA",
    "stock": "if needed",
    "productName": "0.9% Sodium Chloride 10mL Pre-filled Flush Syringe",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/emz111240.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "308-306573",
    "desc": "POSIFLUSH SP 3ML NORMAL SALINE FLUSH SYRINGE STERILE PATHWAY",
    "unit": "EA",
    "stock": "if needed",
    "productName": "BD PosiFlush SF Saline Syringe 3mL",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/308-306573.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "200-69C",
    "desc": "ADDIPAK NORMAL SALINE SODIUM CHLORIDE 0.9% 15ML UNIT DOSE STERILE CASE/144 EACH",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Addipak 0.9% Normal Saline 15mL Unit Dose",
    "manufacturer": "Hudson RCI",
    "suggestedStatus": "match",
    "imageUrl": "/images/200-69c.jpg"
  },
  {
    "storage": "3W",
    "category": "Wound care",
    "code": "DYNJ03000",
    "desc": "LACERATION TRAY STANDARD,",
    "unit": "EA",
    "stock": "if needed",
    "productName": "Standard Sterile Laceration Tray Kit",
    "manufacturer": "Medline",
    "suggestedStatus": "match",
    "imageUrl": "/images/dynj03000.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "41FK14",
    "desc": "Covid Ag (rapid test kit)",
    "unit": "EA",
    "stock": "",
    "productName": "Panbio COVID-19 Antigen Rapid Test Device",
    "manufacturer": "Abbott",
    "suggestedStatus": "match",
    "imageUrl": "/images/41fk14.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "390036",
    "desc": "Enteric outbreak kit (green & white containers)",
    "unit": "EA",
    "stock": "",
    "productName": "Enteric Outbreak Sample Collection Collection Kit",
    "manufacturer": "Public Health",
    "suggestedStatus": "match",
    "imageUrl": "/images/390036.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "365017",
    "desc": "LAB BD Vacutainer UA Preservative Tube (yellow small tube)",
    "unit": "EA",
    "stock": "",
    "productName": "BD Vacutainer Plus Urine Preservative Tube 4.0mL",
    "manufacturer": "BD",
    "suggestedStatus": "match",
    "imageUrl": "/images/365017.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "DIS028",
    "desc": "LAB BIOHAZARD BAG W/ Pouch 6''x9''X2mil",
    "unit": "pk",
    "stock": "",
    "productName": "Biohazard Specimen Transport Bags 6\"x9\"",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/dis028.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "GW-1237NP",
    "desc": "LAB Nasopharyngeal Swab 6''x2.5mm Sterile",
    "unit": "pk",
    "stock": "",
    "productName": "Sterile Nasopharyngeal Collection Swabs 6-Inch",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/gw-1237np.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "03008-11",
    "desc": "LAB ST RPLEX   Container 90ML  (Orange Lid )",
    "unit": "EA",
    "stock": "",
    "productName": "Sterile Specimen Container with Orange Screw Cap 90mL",
    "manufacturer": "Starplex",
    "suggestedStatus": "match",
    "imageUrl": "/images/03008-11.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "3C0-47N",
    "desc": "LAB UTM Transport & Preservation Medium For Virak Molecular Diagnostic Testing (PCR)",
    "unit": "EA",
    "stock": "",
    "productName": "Universal Transport Medium (UTM) for Viruses",
    "manufacturer": "Copan",
    "suggestedStatus": "match",
    "imageUrl": "https://www.copanusa.com/wp-content/uploads/2024/01/3C061N-1-1.png",
    "imageFallback": "/images/3c0-47n.png"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "BOTT-EPT",
    "desc": "Stool collection device c/s (FECAL SWAB)",
    "unit": "EA",
    "stock": "",
    "productName": "FecalSwab Stool Collection and Transport System",
    "manufacturer": "Copan",
    "suggestedStatus": "match",
    "imageUrl": "/images/bott-ept.jpg"
  },
  {
    "storage": "3W",
    "category": "Lab",
    "code": "M40/SWAB-CLEA-AMI01",
    "desc": "swab clear amiles (general culture), in foil paper bag",
    "unit": "EA",
    "stock": "",
    "productName": "M40 Transystem Amies Clear Gel Transport Swab",
    "manufacturer": "Copan",
    "suggestedStatus": "match",
    "imageUrl": "/images/m40-swab-clea-ami01.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6528-1011-2",
    "desc": "Acetaminophen 500 mg Tab  (Tylenol) APOTEX",
    "unit": "EA",
    "stock": "",
    "productName": "Apotex Acetaminophen Extra Strength 500mg Tablets",
    "manufacturer": "Apotex",
    "suggestedStatus": "match",
    "imageUrl": "https://petmedsdirect.ca/cdn/shop/files/4060_0-L.jpg?v=1764640112",
    "imageFallback": "/images/6528-1011-2.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6528-1010-2",
    "desc": "Acetaminophen 325 mg Tab  (Tylenol) TEVA",
    "unit": "EA",
    "stock": "",
    "productName": "Teva Acetaminophen Regular Strength 325mg Tablets",
    "manufacturer": "Teva",
    "suggestedStatus": "match",
    "imageUrl": "https://i.ibb.co/vCVf1tnR/image-3.png",
    "imageFallback": "/images/6528-1010-2.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1717-2",
    "desc": "Analgesic Rub, Muscle & Joint Pain Relief Heat Cream, Extra Strength 100g",
    "unit": "EA",
    "stock": "",
    "productName": "Extra Strength Muscle & Joint Analgesic Heat Cream 100g",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1717-2.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6554-1503-0",
    "desc": "Aluminum Hydroxide 64 mg/mL O/L, 425mL, Alugel",
    "unit": "EA",
    "stock": "",
    "productName": "Alugel Aluminum Hydroxide Antacid Suspension 425mL",
    "manufacturer": "Odan",
    "suggestedStatus": "match",
    "imageUrl": "/images/6554-1503-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6554-1505-0",
    "desc": "Magnesium Hydroxide 80 mg/mL O/L, 500mL, milk magnesia",
    "unit": "EA",
    "stock": "",
    "productName": "Milk of Magnesia Laxative/Antacid Oral Suspension 500mL",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://beyondrx.ca/cdn/shop/files/AtlasMilkofMagnesia_500mL_-ProductLabelinEnglish-min.jpg?v=1698171752",
    "imageFallback": "/images/6554-1505-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6554-1509-0",
    "desc": "Aluminum Hydroxide & Magnesium Hydroxide & Dimethylpolysiloxane 40 mg & 40 mg & 5 mg/mL O/L 350ml (Almagel)",
    "unit": "EA",
    "stock": "",
    "productName": "Almagel Antacid/Antiflatulent Suspension 350mL",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://static.wixstatic.com/media/7974df_1ecf87d623c645f59ade0f3f761d355e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    "imageFallback": "/images/6554-1509-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6501-1006-0",
    "desc": "Cypropheptadine HCl 4 mg Tab JAMP",
    "unit": "EA",
    "stock": "",
    "productName": "Jamp Cyproheptadine HCl Antihistamine 4mg Tablets",
    "manufacturer": "Jamp Pharma",
    "suggestedStatus": "match",
    "imageUrl": "/images/6501-1006-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6501-1008-2",
    "desc": "Chlorpheniramine Maleate 4 mg Tab TEVA",
    "unit": "EA",
    "stock": "",
    "productName": "Teva Chlorpheniramine Maleate 4mg Allergy Tablets",
    "manufacturer": "Teva",
    "suggestedStatus": "match",
    "imageUrl": "/images/6501-1008-2.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6557-1001-1",
    "desc": "Dimenhydrinate 50 mg Tab",
    "unit": "EA",
    "stock": "",
    "productName": "Dimenhydrinate 50mg Motion Sickness Tablets",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://petmedsdirect.ca/cdn/shop/files/121739_0-L.jpg?v=1764640114&width=1000",
    "imageFallback": "/images/6557-1001-1.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1401-0",
    "desc": "bisacodyl odan 5mg Tablet",
    "unit": "EA",
    "stock": "",
    "productName": "Odan Bisacodyl Laxative 5mg Tablets",
    "manufacturer": "Odan",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1401-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1401-0-SUP",
    "desc": "bisacodyl 10 mg Sup DULCOLAX",
    "unit": "EA",
    "stock": "",
    "productName": "Dulcolax Bisacodyl 10mg Laxative Suppositories",
    "manufacturer": "Dulcolax",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1401-0-sup.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1402-0",
    "desc": "Colace Glycerin Suppositories, 24supporitories",
    "unit": "EA",
    "stock": "",
    "productName": "Colace Glycerin Suppositories Adult 24-pk",
    "manufacturer": "Colace",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1402-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1901-3",
    "desc": "Enema Sodium Biphosphate & Sodium Phosphate 160 mg & 60 mg/mL Fleet Enema",
    "unit": "EA",
    "stock": "",
    "productName": "Fleet Enema Mineral Oil/Saline Laxative",
    "manufacturer": "Fleet",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1901-3.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1004-1",
    "desc": "Sennosides A and B 8.6 mg Tab 1000 tablets",
    "unit": "EA",
    "stock": "",
    "productName": "Sennosides Laxative Tablets 8.6mg (1000/btl)",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://i.ibb.co/hR6d646X/20260611-103230.jpg",
    "imageFallback": "/images/6556-1004-1.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1004-1-100",
    "desc": "Sennosides A and B 8.6 mg Tab 100 tablets",
    "unit": "EA",
    "stock": "",
    "productName": "Sennosides Laxative Tablets 8.6mg (100/btl)",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1004-1-100.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1605-0",
    "desc": "Meta Fibre Psyllium Mucilloid Oral Pd Mucillium",
    "unit": "EA",
    "stock": "",
    "productName": "Mucillium Psyllium Fiber Powder",
    "manufacturer": "Odan",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1605-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1104-0",
    "desc": "Taro-Docusate Sodium 100 mg Cap Soflax 1000 tablets",
    "unit": "EA",
    "stock": "",
    "productName": "Soflax Docusate Sodium Stool Softener 100mg",
    "manufacturer": "Taro",
    "suggestedStatus": "match",
    "imageUrl": "/images/6556-1104-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6556-1503-0",
    "desc": "Cascara Sagrada O/L, 500ml",
    "unit": "EA",
    "stock": "",
    "productName": "Cascara Sagrada Fluid Extract Laxative 500mL",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://static.wixstatic.com/media/7974df_49c877253a114c1b8b5ded028eb74288~mv2.jpg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/7974df_49c877253a114c1b8b5ded028eb74288~mv2.jpg",
    "imageFallback": "/images/6556-1503-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6544-1504-1",
    "desc": "Guaifenesin 20 mg/mL O/L  250ML (Orange bottle)",
    "unit": "EA",
    "stock": "",
    "productName": "Guaifenesin Expectorant Cough Syrup 250mL",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6544-1504-1.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6544-1508-1",
    "desc": "Bronchophan forte DM 15mg/5ml, dextromethorphan hydrobromide syrup TEVA 250ML",
    "unit": "EA",
    "stock": "",
    "productName": "Bronchophan Forte DM Cough Syrup 250mL",
    "manufacturer": "Teva",
    "suggestedStatus": "match",
    "imageUrl": "/images/6544-1508-1.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1715-0",
    "desc": "Life brand Calamine Lotion 250ml",
    "unit": "EA",
    "stock": "",
    "productName": "Life Brand Anti-Pruritic Calamine Lotion 250mL",
    "manufacturer": "Life Brand",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1715-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1730-0",
    "desc": "Silicone 20% Cream Barrier Cream",
    "unit": "EA",
    "stock": "",
    "productName": "Silicone 20% Protective Skin Barrier Cream",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1730-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-0502-0",
    "desc": "Alcohol 70%",
    "unit": "EA",
    "stock": "",
    "productName": "70% Isopropyl Rubbing Alcohol Antiseptic",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://digital.loblaws.ca/PCX/21427021_EA/en/1/21427021_en_front_800.png",
    "imageFallback": "/images/6572-0502-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1713-1",
    "desc": "White Petroleum Ointment vaseline jelly",
    "unit": "EA",
    "stock": "",
    "productName": "White Petrolatum Skin Protectant Ointment Jelly",
    "manufacturer": "Vaseline",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1713-1.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1710-2",
    "desc": "Zinc Oxide 15% Ointment",
    "unit": "EA",
    "stock": "",
    "productName": "Zinc Oxide 15% Barrier Ointment Cream",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1710-2.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6537-1102-0",
    "desc": "Potassium Chloride 600 mg LA Cap (8 mEq)",
    "unit": "EA",
    "stock": "",
    "productName": "Potassium Chloride Long Acting Capsules 600mg",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://m.media-amazon.com/images/I/41edG2BKxuL.jpg",
    "imageFallback": "/images/6537-1102-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6537-1004-0",
    "desc": "Potassium Chloride 600 mg LA Tab (8 mEq)",
    "unit": "EA",
    "stock": "",
    "productName": "Potassium Chloride Long Acting Tablets 600mg",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "/images/6537-1004-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6537-1505-0",
    "desc": "Potassium Chloride 20 mEq/15mL, oral solution 500ML  ODAN",
    "unit": "EA",
    "stock": "",
    "productName": "Potassium Chloride Oral Solution 20 mEq/15mL",
    "manufacturer": "Odan",
    "suggestedStatus": "match",
    "imageUrl": "/images/6537-1505-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6572-1752-0",
    "desc": "ANNSOL Zinc Sulphate 0.5% Ointment Anuzine Oint.",
    "unit": "EA",
    "stock": "",
    "productName": "Anuzine Zinc Sulphate 0.5% Hemorrhoidal Ointment",
    "manufacturer": "Annsol",
    "suggestedStatus": "match",
    "imageUrl": "/images/6572-1752-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6552-1803-0",
    "desc": "Eyedrop Methylcellulose 0.5% Oph Sol",
    "unit": "EA",
    "stock": "",
    "productName": "Methylcellulose 0.5% Artificial Tears Lubricating Eyedrops",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://beyondrx.ca/cdn/shop/files/AlconIsoptoTears0.5_15mL_-ProductLabel-min_7d710229-de22-4796-b0b7-f4c4d60a23b3.jpg?v=1696605556",
    "imageFallback": "/images/6552-1803-0.jpg"
  },
  {
    "storage": "7W Record RM",
    "category": "Medication",
    "code": "6552-1804-0",
    "desc": "Eyedrop Methylcellulose 1% Oph Sol",
    "unit": "EA",
    "stock": "",
    "productName": "Methylcellulose 1% Artificial Tears Lubricating Eyedrops",
    "manufacturer": "Unknown",
    "suggestedStatus": "match",
    "imageUrl": "https://store.whitecrossdispensary.com/cdn/shop/files/40201-alcon.png?v=1734014777&width=645",
    "imageFallback": "/images/6552-1804-0.png"
  },
  {
    "storage": "7W Record RM",
    "code": "DEX4-GLUC",
    "category": "Wound care",
    "desc": "DEX4 fast acting glucose 4g 10 tablets",
    "unit": "EA",
    "stock": "",
    "productName": "Dex4 Fast Acting Glucose Tablets Berry 4g",
    "manufacturer": "Dex4",
    "suggestedStatus": "match",
    "imageUrl": "https://cdn-tp2.mozu.com/28945-m4/cms/files/L1153600.jpg",
    "imageFallback": "/images/dex4-gluc.jpg"
  }
];

const css = `
:root{
  --bg:#EBEFF0; --surface:#ffffff; --ink:#14242B; --soft:#5C6E75; --faint:#90A0A5;
  --line:#DCE4E6; --line2:#EAEFF0;
  --teal:#0E6E73; --teal-d:#0A565A; --teal-soft:#E1EFEF;
  --green:#137A47; --green-soft:#E4F2EA;
  --amber:#A65A06; --amber-soft:#F8EBD9;
  --red:#B23A3A; --red-soft:#F6E3E3;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0;padding:0;overflow:hidden}
.wrap{font-family:var(--sans);color:var(--ink);background:var(--bg);height:100%;display:flex;flex-direction:column;overflow:hidden;-webkit-font-smoothing:antialiased}
button{font-family:inherit;cursor:pointer}
input,select,textarea{font-family:inherit}

/* top bar */
.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 18px;background:var(--surface);border-bottom:1px solid var(--line);flex-shrink:0}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.logo{width:38px;height:38px;border-radius:9px;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.title{font-size:16px;font-weight:700;letter-spacing:-.01em;line-height:1.1}
.sub{font-size:12px;color:var(--soft);margin-top:1px}
.topright{display:flex;align-items:center;gap:14px;flex-shrink:0}
.progress{text-align:right;font-size:12px;color:var(--soft)}
.progress b{color:var(--ink);font-variant-numeric:tabular-nums}
.meter{width:130px;height:6px;border-radius:99px;background:var(--line);margin-top:5px;overflow:hidden}
.meter span{display:block;height:100%;background:var(--teal);border-radius:99px;transition:width .35s ease}
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:13px;font-weight:600;padding:8px 12px;transition:background .12s,border-color .12s}
.btn:hover{background:#F4F7F7}
.btn.primary{background:var(--teal);border-color:var(--teal);color:#fff}
.btn.primary:hover{background:var(--teal-d)}
.btn.green{background:var(--green);border-color:var(--green);color:#fff}
.btn.green:hover{filter:brightness(.95)}
.btn.danger{background:var(--surface);border-color:var(--red);color:var(--red)}
.btn.danger:hover{background:var(--red-soft)}
.btn:disabled{opacity:.5;cursor:not-allowed}

/* body */
.body{flex:1;display:flex;min-height:0;position:relative}
.list{width:392px;flex-shrink:0;border-right:1px solid var(--line);background:var(--surface);display:flex;flex-direction:column;min-height:0}
.tools{padding:14px 14px 10px;border-bottom:1px solid var(--line2);flex-shrink:0}
.searchwrap{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:9px;padding:9px 11px;background:var(--surface)}
.searchwrap:focus-within{border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.searchwrap input{border:none;outline:none;font-size:14px;width:100%;background:transparent;color:var(--ink)}
.searchwrap svg{color:var(--faint);flex-shrink:0}
.filters{display:flex;gap:8px;margin-top:10px}
.filters select{flex:1;border:1px solid var(--line);border-radius:8px;padding:7px 9px;font-size:12.5px;color:var(--ink);background:var(--surface)}
.filters select:focus{outline:none;border-color:var(--teal)}
.count{font-size:11.5px;color:var(--faint);margin-top:9px;letter-spacing:.02em;text-transform:uppercase;font-weight:600}

.rows{flex:1;overflow:auto}
.itemrow{display:flex;align-items:flex-start;gap:11px;width:100%;text-align:left;background:none;border:none;border-bottom:1px solid var(--line2);padding:12px 14px;transition:background .1s}
.itemrow:hover{background:#F5F8F8}
.itemrow.active{background:var(--teal-soft)}
.itemrow.active .code{color:var(--teal-d)}
.dot{width:9px;height:9px;border-radius:99px;margin-top:5px;flex-shrink:0;border:1px solid rgba(0,0,0,.06)}
.rowmain{min-width:0;flex:1}
.code{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink);letter-spacing:-.01em;word-break:break-all}
.desc{font-size:13px;color:var(--soft);margin-top:2px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.chip{display:inline-block;font-size:10.5px;font-weight:600;color:var(--soft);background:var(--line2);border-radius:5px;padding:2px 6px;white-space:nowrap;margin-top:5px}

.empty-list{padding:36px 20px;text-align:center;color:var(--faint);font-size:13px}

/* detail */
.detail{flex:1;overflow:auto;min-height:0}
.detail-inner{max-width:680px;margin:0 auto;padding:24px 26px 60px}
.placeholder{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--faint);text-align:center;padding:40px;gap:14px}
.placeholder .ring{width:64px;height:64px;border-radius:16px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--teal)}
.back{display:none;align-items:center;gap:5px;background:none;border:none;color:var(--teal-d);font-size:13px;font-weight:600;padding:14px 14px 0}

.dethead{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
.codebig{font-family:var(--mono);font-size:22px;font-weight:700;letter-spacing:-.02em;color:var(--ink);word-break:break-all;line-height:1.15}
.tags{display:flex;flex-wrap:wrap;gap:7px}
.tag{font-size:11.5px;font-weight:600;color:var(--soft);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:3px 8px}

.field{margin-bottom:18px}
.flabel{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin-bottom:6px}
.descbig{font-size:17px;font-weight:600;line-height:1.4;color:var(--ink)}

/* verdict banner */
.verdict{display:flex;gap:12px;align-items:flex-start;border-radius:12px;padding:14px 15px;margin-bottom:18px;border:1px solid}
.verdict .vicon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.verdict .vtitle{font-size:14px;font-weight:700;line-height:1.2}
.verdict .vsub{font-size:13px;line-height:1.45;margin-top:3px}
.verdict .vtag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:3px}
.v-neutral{background:var(--surface);border-color:var(--line)} .v-neutral .vicon{background:var(--line2);color:var(--soft)} .v-neutral .vsub{color:var(--soft)}
.v-green{background:var(--green-soft);border-color:#BFE0CC} .v-green .vicon{background:var(--green);color:#fff} .v-green .vtitle{color:var(--green)} .v-green .vsub{color:#2C5B40}
.v-amber{background:var(--amber-soft);border-color:#EDD3AE} .v-amber .vicon{background:var(--amber);color:#fff} .v-amber .vtitle{color:var(--amber)} .v-amber .vsub{color:#7A4A14}
.v-red{background:var(--red-soft);border-color:#E7C2C2} .v-red .vicon{background:var(--red);color:#fff} .v-red .vtitle{color:var(--red)} .v-red .vsub{color:#7E3030}

/* lookup panel */
.lookup{border:1px solid var(--line);border-radius:12px;background:var(--surface);overflow:hidden;margin-bottom:18px}
.lookup-head{padding:13px 15px;border-bottom:1px solid var(--line2);display:flex;align-items:center;justify-content:space-between;gap:10px}
.lookup-head .lh-t{font-size:13px;font-weight:700}
.lookup-body{padding:15px}

.resolve{display:flex;flex-direction:column;gap:3px;margin-bottom:13px}
.resolve .rl{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--faint)}
.resolve .rv{font-size:15px;font-weight:600;color:var(--ink);line-height:1.35}
.resolve .rm{font-size:12px;color:var(--faint)}

.imgbox{border:1px solid var(--line);border-radius:10px;background:#FAFCFC;min-height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px}
.imgbox img{max-width:100%;max-height:320px;display:block;animation:fade .4s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.noimg{display:flex;flex-direction:column;align-items:center;gap:9px;color:var(--faint);font-size:12.5px;padding:28px;text-align:center}

.linkrow{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:13px}
.linklike{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--teal-d);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:7px 10px;background:var(--surface)}
.linklike:hover{background:#F4F7F7}

.urlrow{display:flex;gap:8px;align-items:center}
.urlrow input{flex:1;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:12.5px;color:var(--ink);min-width:0}
.urlrow input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.hint{font-size:11.5px;color:var(--faint);margin-top:7px}

/* decision */
.decide{border-top:1px solid var(--line2);padding-top:18px}
.decide-row{display:flex;gap:10px;flex-wrap:wrap}
.flagpanel{margin-top:14px;border:1px solid var(--line);border-radius:11px;padding:14px;background:#FBFCFC}
.flagpanel label{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--faint);display:block;margin-bottom:6px}
.flagpanel select,.flagpanel textarea{width:100%;border:1px solid var(--line);border-radius:8px;padding:9px 10px;font-size:13px;color:var(--ink);background:var(--surface)}
.flagpanel select:focus,.flagpanel textarea:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.flagpanel textarea{margin-top:12px;resize:vertical;min-height:64px;line-height:1.4}
.flagpanel .fp-actions{display:flex;gap:9px;margin-top:13px}
.savedline{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--soft);margin-top:13px}

@media (max-width:860px){
  .list{width:100%}
  .detail{position:absolute;inset:0;background:var(--bg);display:none}
  .wrap.detail-open .list{display:none}
  .wrap.detail-open .detail{display:block}
  .back{display:inline-flex}
  .sub{display:none}
}
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
}

/* ---- mode toggle ---- */
.modetoggle{display:inline-flex;background:var(--line2);border-radius:9px;padding:3px;gap:3px}
.modetoggle button{border:none;background:transparent;color:var(--soft);font-size:13px;font-weight:600;padding:6px 14px;border-radius:7px}
.modetoggle button.on{background:var(--surface);color:var(--teal-d);box-shadow:0 1px 2px rgba(0,0,0,.08)}

/* ---- order mode ---- */
.orderbody{flex:1;display:flex;min-height:0}
.ordermain{flex:1;display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--line);background:var(--surface)}
.cartside{width:392px;flex-shrink:0;background:var(--surface);display:flex;flex-direction:column;min-height:0}
.orow{display:flex;align-items:center;gap:11px;width:100%;text-align:left;border-bottom:1px solid var(--line2);padding:11px 14px}
.orow:hover{background:#F5F8F8}
.orow.incart{background:var(--teal-soft)}
.orow .rowmain{min-width:0;flex:1}
.qctrl{display:flex;align-items:center;gap:4px;flex-shrink:0}
.qbtn{width:28px;height:28px;border-radius:7px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1}
.qbtn:hover{background:#F4F7F7}
.qnum{width:46px;text-align:center;border:1px solid var(--line);border-radius:7px;padding:5px 4px;font-size:13px;font-variant-numeric:tabular-nums}
.qnum:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.addbtn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--teal);background:var(--surface);color:var(--teal-d);font-size:12.5px;font-weight:600;border-radius:8px;padding:6px 11px;flex-shrink:0}
.addbtn:hover{background:var(--teal-soft)}

.cart-head{padding:14px;border-bottom:1px solid var(--line);flex-shrink:0}
.cart-head .ch-t{font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px}
.cart-head .ch-s{font-size:12px;color:var(--soft);margin-top:2px}
.orderfields{padding:12px 14px;border-bottom:1px solid var(--line2);display:flex;flex-direction:column;gap:9px;flex-shrink:0}
.orderfields label{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--faint);display:block;margin-bottom:4px}
.orderfields select,.orderfields input{width:100%;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--ink);background:var(--surface)}
.orderfields select:focus,.orderfields input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.orderfields .field-err select,.orderfields .field-err input{border-color:#D9534F}
.orderfields .field-msg{font-size:11px;color:#B33;margin-top:4px}
.cartlist{flex:1;overflow:auto;min-height:0}
.cartitem{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-bottom:1px solid var(--line2)}
.cartitem .ci-main{min-width:0;flex:1}
.cartitem .ci-code{font-family:var(--mono);font-size:12px;font-weight:600}
.cartitem .ci-desc{font-size:12px;color:var(--soft);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cart-empty{padding:36px 20px;text-align:center;color:var(--faint);font-size:13px}
.cart-foot{border-top:1px solid var(--line);padding:14px;flex-shrink:0;background:var(--surface)}
.cart-actions{display:flex;flex-direction:column;gap:9px}
.cart-actions .row2{display:flex;gap:9px}
.cart-actions .row2 .btn{flex:1;justify-content:center}
.savemsg{font-size:12.5px;line-height:1.4;margin-top:11px;padding:10px 12px;border-radius:9px;border:1px solid}
.savemsg.ok{background:var(--green-soft);border-color:#BFE0CC;color:#2C5B40}
.savemsg.info{background:var(--teal-soft);border-color:#BcdEde;color:var(--teal-d)}
.savemsg.err{background:var(--red-soft);border-color:#E7C2C2;color:#7E3030}
.subnote{font-size:11.5px;color:var(--faint);margin-top:8px}
.miniflag{font-size:10.5px;font-weight:700;color:var(--teal-d);background:var(--teal-soft);border-radius:5px;padding:2px 6px;margin-left:6px}
.adminbody{padding:24px;overflow:auto;display:flex;flex-direction:column;align-items:center;gap:18px}
.adminpanel{width:100%;max-width:1280px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:22px 26px;box-shadow:0 1px 2px rgba(20,36,43,.04)}
.adminpanel h2{font-size:16px;margin:0 0 6px;display:flex;align-items:center;gap:8px;letter-spacing:-.01em}
.adminpanel h2 svg{color:var(--teal);flex-shrink:0}
.adminpanel h3{font-size:14px;margin:0 0 10px}
.adminpanel .sub{font-size:13px;color:var(--soft);margin-bottom:0;line-height:1.55;max-width:760px}
.admin-savebar{display:flex;align-items:center;gap:12px;margin:14px 0 0;flex-wrap:wrap}
.admin-savebar .savemsg{margin:0}
.admin-main{display:flex;gap:24px;align-items:flex-start;margin-top:16px}
.admin-table-col{flex:1;min-width:0}
.admin-side-col{width:300px;flex-shrink:0}
.admin-search{margin-bottom:10px}
.admintable{border:1px solid var(--line);border-radius:10px;overflow:hidden}
.admintable-head,.admintable-row{display:grid;grid-template-columns:1.2fr 3fr 0.8fr 0.8fr 0.9fr;gap:10px;align-items:center;padding:8px 12px}
.admintable-head{background:var(--line2);font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--faint)}
.admintable-body{max-height:calc(100vh - 380px);overflow:auto}
.admintable-row{border-top:1px solid var(--line2);font-size:12.5px}
.admintable-row.hidden-row{opacity:.45}
.atc-code{font-family:var(--mono);font-weight:600}
.atc-desc{color:var(--soft)}
.atc-stock{width:100%;border:1px solid var(--line);border-radius:6px;padding:5px 7px;font-size:12.5px}
.admin-newitem{display:grid;grid-template-columns:1fr;gap:8px}
.admin-newitem input{border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13px}
.admin-newitem button{justify-content:center}

/* Monthly inventory upload */
.baseline-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap}
.baseline-badge{flex-shrink:0;background:var(--teal-soft);border:1px solid var(--teal-soft);border-radius:10px;padding:9px 14px;text-align:right;min-width:230px}
.baseline-badge-label{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--teal-d)}
.baseline-badge-file{display:block;font-size:13px;font-weight:600;color:var(--ink);margin-top:3px;word-break:break-all}
.baseline-badge-meta{display:block;font-size:11px;color:var(--soft);margin-top:3px}
.upload-drop{display:inline-flex;align-items:center;gap:10px;border:1.5px dashed var(--teal);border-radius:10px;padding:13px 20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--teal-d);background:var(--teal-soft);transition:border-color .12s,background .12s}
.upload-drop:hover{background:#D9EDED}
.upload-drop input[type=file]{display:none}
.upload-drop.disabled{opacity:.5;cursor:not-allowed}
.diff-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}
.diff-stat{border:1px solid var(--line);border-radius:10px;overflow:hidden;border-top:3px solid var(--line)}
.diff-stat summary,.diff-stat .diff-stat-row{list-style:none;cursor:pointer;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.diff-stat .diff-stat-row{cursor:default;opacity:.6}
.diff-stat summary::-webkit-details-marker{display:none}
.diff-stat-text .num{font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.02em;line-height:1.1}
.diff-stat-text .label{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--faint)}
.diff-stat summary svg,.diff-stat .diff-stat-row svg{color:var(--faint);flex-shrink:0}
.diff-stat.added{border-top-color:var(--green)}
.diff-stat.added .num{color:var(--green)}
.diff-stat.added summary svg,.diff-stat.added .diff-stat-row svg{color:var(--green)}
.diff-stat.removed{border-top-color:var(--red)}
.diff-stat.removed .num{color:var(--red)}
.diff-stat.removed summary svg,.diff-stat.removed .diff-stat-row svg{color:var(--red)}
.diff-stat.changed{border-top-color:var(--amber)}
.diff-stat.changed .num{color:var(--amber)}
.diff-stat.changed summary svg,.diff-stat.changed .diff-stat-row svg{color:var(--amber)}
.diff-stat ul{margin:0;padding:0 14px 10px;list-style:none;max-height:220px;overflow:auto;border-top:1px solid var(--line2)}
.diff-stat li{padding:7px 0;font-size:12.5px;border-bottom:1px solid var(--line2);display:flex;justify-content:space-between;gap:10px}
.diff-stat li:last-child{border-bottom:none}
.diff-stat .item-code{font-family:var(--mono);font-weight:600;flex-shrink:0;color:var(--ink)}
.diff-stat .item-desc{color:var(--soft);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.diff-stat .item-change{font-family:var(--mono);font-size:11.5px;color:var(--ink);white-space:nowrap;flex-shrink:0}

@media (max-width:960px){
  .admin-main{flex-direction:column}
  .admin-side-col{width:100%}
  .admintable-body{max-height:400px}
  .diff-stats{grid-template-columns:1fr}
  .baseline-head{flex-direction:column}
  .baseline-badge{text-align:left;min-width:0;width:100%}
}

@media (max-width:860px){
  .orderbody{flex-direction:column}
  .ordermain{border-right:none;border-bottom:1px solid var(--line)}
  .cartside{width:100%}
}
`;

function gImages(it) {
  const q = ((it.code || "") + " " + (it.desc || "")).trim();
  return "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q);
}

// Image overrides are saved in the browser's localStorage so they persist
// "forever" on this computer with no database/server required. Each override is
// keyed by the item's position in INVENTORY (stable because INVENTORY is static).
const IMG_OVERRIDE_KEY = "supply-match-image-overrides-v1";

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(IMG_OVERRIDE_KEY)) || {};
  } catch {
    return {};
  }
}

// Normalizes a product code for matching across sources that format the same
// code slightly differently (e.g. "163-05031-105\517SDML" vs "163-05031-105/517sdml").
function normCode(s) {
  return (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Stable key used to store/retrieve image overrides for any item. Prefers the
// product code; falls back to the description so codeless items can still have
// admin-set images without colliding with each other.
function itemImgKey(item) {
  const byCode = normCode((item || {}).code || "");
  return byCode || ("desc_" + normCode((item || {}).desc || ""));
}

const MANIFEST_URL = "/images/MANIFEST.json";

// ---- Order / cart system ----
// Wings that can place an order (each has its own shared computer + Excel tab).
// "All Items-RPN" is the master reference tab and is intentionally not orderable.
const WINGS = ["7W", "7E", "6W", "6E", "5W", "5E", "3W", "3E", "2W", "2E"];

// INVENTORY[0..139] line up 1:1 with the template's data rows 6..145 on every
// wing tab (verified). Admin-added items (index >= INVENTORY.length) have no
// template row and are appended after the last row.
const TEMPLATE_FIRST_ROW = 6;
// The static template only has pre-built rows for this many items. If a
// monthly baseline upload has more (or fewer) items, the ones beyond this
// capacity are appended after the template's last row, same as admin-added
// items — see buildOrderFile.
const TEMPLATE_ROW_CAPACITY = INVENTORY.length;
const TEMPLATE_PATH = "/order-template.xlsx";

const ORDER_WING_KEY = "supply-order-wing";
const ORDER_NAME_KEY = "supply-order-nurse";
const cartKey = (wing) => "supply-order-cart-" + wing;
const submittedKey = (wing) => "supply-order-submitted-" + wing;

// Tracks which baseline upload this device's carts were last synced against,
// so a brand-new monthly inventory can wipe every wing's cart (old line-item
// indices may point at completely different items afterwards).
const BASELINE_STAMP_KEY = "supply-baseline-stamp";

// Admin mode is a soft gate on the UI only — the real protection is that
// /api/inventory's POST endpoint checks this same passcode server-side.
const ADMIN_PASSCODE = "Sthaa123!";
const ADMIN_SESSION_KEY = "supply-admin-session";

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function sanitizeFilePart(s) {
  return (s || "").replace(/[\\/:*?"<>|]/g, "-").trim();
}

// Persist the picked OneDrive folder handle across sessions via IndexedDB
// (FileSystemDirectoryHandle can't be JSON-serialized into localStorage).
function idbHandle(action, value) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("supply-order-fs", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("handles");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("handles", action === "get" ? "readonly" : "readwrite");
      const store = tx.objectStore("handles");
      const req = action === "get" ? store.get("orderDir") : store.put(value, "orderDir");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    };
  });
}

export default function SupplyMatch() {
  const [query, setQuery] = useState("");
  const [storageF, setStorageF] = useState("All");
  const [catF, setCatF] = useState("All");
  const [selIdx, setSelIdx] = useState(null);
  const [manualUrls, setManualUrls] = useState(loadOverrides); // validated, persisted overrides
  const [draftUrl, setDraftUrl] = useState("");                // what's currently typed in the box
  const [urlStatus, setUrlStatus] = useState("idle");          // idle | checking | saved | error
  const [imgIdx, setImgIdx] = useState(0);                     // which image candidate is showing (for auto-fallback)
  const [adminImgDraft, setAdminImgDraft] = useState("");      // admin permanent image URL input
  const [adminImgStatus, setAdminImgStatus] = useState("idle"); // idle | checking | saved | error | saving

  // ---- Admin mode state ----
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_PASSCODE);

  function handleAdminClick() {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminPasscode("");
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      if (mode === "admin") setMode("verify");
      return;
    }
    const code = window.prompt("Enter admin passcode:");
    if (code === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setAdminPasscode(code);
      sessionStorage.setItem(ADMIN_SESSION_KEY, code);
    } else if (code !== null) {
      window.alert("Incorrect passcode.");
    }
  }

  // ---- Order mode state ----
  const [mode, setMode] = useState("verify"); // "verify" | "order" | "admin"
  const [wing, setWing] = useState(() => loadJSON(ORDER_WING_KEY, ""));
  const [nurseName, setNurseName] = useState(() => loadJSON(ORDER_NAME_KEY, ""));
  const [cart, setCart] = useState(() => loadJSON(cartKey(loadJSON(ORDER_WING_KEY, "")), {})); // { invIdx: qty }
  const [lastSubmitted, setLastSubmitted] = useState(() => loadJSON(submittedKey(loadJSON(ORDER_WING_KEY, "")), null));
  const [orderQuery, setOrderQuery] = useState("");
  const [orderCatF, setOrderCatF] = useState("All");
  const [saveStatus, setSaveStatus] = useState(""); // "", "working", "saved", "downloaded", "error"
  const [saveMsg, setSaveMsg] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false); // true once the nurse tries to save/print with missing fields
  const [cartResetNotice, setCartResetNotice] = useState(false); // true right after a new monthly baseline wiped this wing's cart

  // Inventory overrides synced from the admin (via /api/inventory): stock counts
  // keyed by INVENTORY array index (so item order/template-row mapping never
  // shifts), a list of hidden indices (soft "remove"), and admin-added items
  // (appended after INVENTORY, same as the existing app-only extra items).
  const [overrides, setOverrides] = useState({ stock: {}, hidden: [], added: [], images: {}, baseline: null, baselineDate: null, baselineLabel: null });
  const [overridesLoaded, setOverridesLoaded] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) || "");
  const refreshOverrides = () =>
    fetch("/api/inventory", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { stock: {}, hidden: [], added: [], images: {}, baseline: null, baselineDate: null, baselineLabel: null }))
      .then((data) => {
        setOverrides({
          stock: data.stock || {},
          hidden: data.hidden || [],
          added: data.added || [],
          images: data.images || {},
          baseline: Array.isArray(data.baseline) ? data.baseline : null,
          baselineDate: data.baselineDate || null,
          baselineLabel: data.baselineLabel || null,
        });
        setOverridesLoaded(true);
      })
      .catch(() => {});
  useEffect(() => { refreshOverrides(); }, []);

  // Built-in product photos in public/images, keyed by normalized product code,
  // used as a fallback for items whose imageUrl/imageFallback are blank (e.g.
  // baseline-uploaded items that don't carry curated fields).
  const [manifestMap, setManifestMap] = useState({});
  useEffect(() => {
    fetch(MANIFEST_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const map = {};
        (Array.isArray(list) ? list : []).forEach((entry) => {
          const key = normCode(entry.code);
          if (key && !map[key]) map[key] = entry.imageUrl;
        });
        setManifestMap(map);
      })
      .catch(() => {});
  }, []);

  // The baseline (from a monthly inventory upload) replaces the hardcoded
  // INVENTORY entirely when present. Everything downstream — stock overrides,
  // hidden indices, admin-added items, order-export row mapping — is indexed
  // against whichever of these is currently in effect.
  const baseInventory = (overrides.baseline && overrides.baseline.length) ? overrides.baseline : INVENTORY;
  const baseLen = baseInventory.length;
  const templateLastIndex = Math.min(baseLen, TEMPLATE_ROW_CAPACITY) - 1;

  const hiddenSet = useMemo(() => new Set(overrides.hidden || []), [overrides.hidden]);
  const inv = useMemo(() => {
    const base = baseInventory.map((it, i) => (overrides.stock[i] != null ? { ...it, stock: overrides.stock[i] } : it));
    return [...base, ...(overrides.added || [])];
  }, [overrides, baseInventory]);

  // ---- Admin panel draft state (local edits, pushed to /api/inventory on Save) ----
  const [adminQuery, setAdminQuery] = useState("");
  const [adminStockEdits, setAdminStockEdits] = useState({});
  const [adminHidden, setAdminHidden] = useState(new Set());
  const [adminAdded, setAdminAdded] = useState([]);
  const [adminSaveStatus, setAdminSaveStatus] = useState("");
  const [adminSaveMsg, setAdminSaveMsg] = useState("");
  const emptyNewItem = { storage: "", category: "", code: "", desc: "", unit: "", stock: "", productName: "", manufacturer: "", imageUrl: "" };
  const [adminNewItem, setAdminNewItem] = useState(emptyNewItem);

  // ---- Monthly inventory baseline upload (admin) ----
  const [baselinePreview, setBaselinePreview] = useState(null); // { merged, added, removed, changed, fileName }
  const [baselineStatus, setBaselineStatus] = useState(""); // "" | "parsing" | "ready" | "saving" | "saved" | "error"
  const [baselineMsg, setBaselineMsg] = useState("");

  // Sync drafts from the server whenever overrides (re)load — also runs right
  // after a successful save, which is a no-op since drafts already match.
  useEffect(() => {
    setAdminStockEdits(overrides.stock);
    setAdminHidden(new Set(overrides.hidden));
    setAdminAdded(overrides.added);
    if (selIdx !== null) {
      const fresh = (overrides.images || {})[itemImgKey(inv[selIdx])] || "";
      setAdminImgDraft(fresh);
      setAdminImgStatus(fresh ? "saved" : "idle");
    }
  }, [overrides]); // eslint-disable-line react-hooks/exhaustive-deps

  const adminInv = useMemo(() => {
    const base = baseInventory.map((it, i) => (adminStockEdits[i] != null ? { ...it, stock: adminStockEdits[i] } : it));
    return [...base, ...adminAdded];
  }, [adminStockEdits, adminAdded, baseInventory]);

  const adminFiltered = useMemo(() => {
    const q = adminQuery.trim().toLowerCase();
    return adminInv.map((it, idx) => [idx, it]).filter(([, it]) => {
      if (!q) return true;
      return (it.code || "").toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q);
    });
  }, [adminInv, adminQuery]);

  function setAdminStock(idx, value) {
    setAdminStockEdits((p) => ({ ...p, [idx]: value }));
  }

  function toggleAdminHidden(idx) {
    setAdminHidden((p) => {
      const n = new Set(p);
      if (n.has(idx)) n.delete(idx);
      else n.add(idx);
      return n;
    });
  }

  function addNewItem() {
    if (!adminNewItem.code.trim() || !adminNewItem.desc.trim()) {
      window.alert("Code and description are required.");
      return;
    }
    setAdminAdded((p) => [...p, { ...adminNewItem }]);
    setAdminNewItem(emptyNewItem);
  }

  function removeAddedItem(addedIdx) {
    setAdminAdded((p) => p.filter((_, i) => i !== addedIdx));
  }

  async function saveAdminChanges() {
    setAdminSaveStatus("working");
    setAdminSaveMsg("Saving…");
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: adminPasscode,
          stock: adminStockEdits,
          hidden: Array.from(adminHidden),
          added: adminAdded,
          images: overrides.images,
          baseline: overrides.baseline,
          baselineDate: overrides.baselineDate,
          baselineLabel: overrides.baselineLabel,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Server error");
      }
      await refreshOverrides();
      setAdminSaveStatus("saved");
      setAdminSaveMsg("Saved. Other kiosks will see this the next time they reload the app.");
    } catch (err) {
      setAdminSaveStatus("error");
      setAdminSaveMsg("Couldn't save: " + (err && err.message ? err.message : err));
    }
  }

  // Read a cell's value as a trimmed string, unwrapping Excel rich-text runs.
  function cellText(row, col) {
    let v = row.getCell(col).value;
    if (v && typeof v === "object" && Array.isArray(v.richText)) {
      v = v.richText.map((t) => t.text).join("");
    }
    if (v == null) return "";
    return String(v).trim();
  }

  const baselineKey = (it) =>
    it.code ? "code:" + it.code.trim().toLowerCase() : "desc:" + (it.desc || "").trim().toLowerCase();

  // Parse a monthly inventory spreadsheet (same layout as the order forms:
  // Storage / Category / Code / Descriptions / Unit / Stock level starting at
  // row 6) and diff it against the current inventory so the admin can review
  // new items, removed items, and stock changes before replacing everything.
  async function handleBaselineFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setBaselinePreview(null);
    setBaselineStatus("parsing");
    setBaselineMsg("Reading file…");

    try {
      let ExcelJS;
      try {
        ExcelJS = (await import("exceljs")).default;
      } catch {
        throw new Error("The app was updated since this page loaded. Please refresh the page and try again.");
      }
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await file.arrayBuffer());
      const ws = wb.worksheets[0];
      if (!ws) throw new Error("No worksheet found in the file.");

      const rows = [];
      for (let r = TEMPLATE_FIRST_ROW; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        const code = cellText(row, 3);
        const desc = cellText(row, 4);
        if (!code && !desc) continue;
        rows.push({
          storage: cellText(row, 1),
          category: cellText(row, 2),
          code,
          desc,
          unit: cellText(row, 5),
          stock: cellText(row, 6),
        });
      }
      if (!rows.length) {
        throw new Error("No item rows found (expected data starting at row " + TEMPLATE_FIRST_ROW + ").");
      }

      // Auto-assign stable synthetic codes to rows that have no code so that
      // image overrides and curated fields survive future re-uploads. Sequential
      // within this upload so the same items (same sheet position) get the same
      // NOCODE number on re-upload. Duplicate descriptions within the upload share
      // one code. The admin is warned and should fix the source Excel.
      let autoCoded = 0;
      const autoCodeSeen = new Map();
      rows.forEach((row) => {
        if (!row.code) {
          const seen = autoCodeSeen.get(row.desc);
          if (seen) {
            row.code = seen;
          } else {
            autoCoded++;
            const auto = "NOCODE-" + String(autoCoded).padStart(4, "0");
            row.code = auto;
            autoCodeSeen.set(row.desc, auto);
          }
        }
      });

      // Carry over curated fields (images, product name, manufacturer) from
      // the current inventory for items that still match by code.
      const lookup = new Map();
      inv.forEach((it) => lookup.set(baselineKey(it), it));

      const merged = rows.map((row) => {
        const existing = lookup.get(baselineKey(row));
        const out = {
          storage: row.storage || (existing && existing.storage) || "",
          category: row.category || (existing && existing.category) || "",
          code: row.code,
          desc: row.desc,
          unit: row.unit || (existing && existing.unit) || "",
          stock: row.stock,
          productName: (existing && existing.productName) || "",
          manufacturer: (existing && existing.manufacturer) || "",
          suggestedStatus: (existing && existing.suggestedStatus) || "match",
        };
        if (existing && existing.imageUrl) out.imageUrl = existing.imageUrl;
        if (existing && existing.imageFallback) out.imageFallback = existing.imageFallback;
        return out;
      });

      const mergedKeys = new Set(merged.map(baselineKey));
      const added = merged.filter((m) => !lookup.has(baselineKey(m)));
      const removed = inv.filter((it) => !mergedKeys.has(baselineKey(it)));
      const changed = merged
        .map((m) => ({ m, existing: lookup.get(baselineKey(m)) }))
        .filter(({ existing, m }) => existing && String(existing.stock ?? "").trim() !== String(m.stock ?? "").trim())
        .map(({ m, existing }) => ({ code: m.code, desc: m.desc, from: existing.stock, to: m.stock }));

      setBaselinePreview({ merged, added, removed, changed, autoCoded, fileName: file.name });
      setBaselineStatus("ready");
      setBaselineMsg(
        rows.length + " items parsed — " + added.length + " new, " + removed.length + " removed, " +
        changed.length + " stock change" + (changed.length === 1 ? "" : "s") +
        (autoCoded ? " · " + autoCoded + " item" + (autoCoded === 1 ? "" : "s") + " had no code (auto-assigned NOCODE-XXXX)" : "") + "."
      );
    } catch (err) {
      setBaselineStatus("error");
      setBaselineMsg("Couldn't read file: " + (err && err.message ? err.message : err));
    }
  }

  async function confirmBaselineUpload() {
    if (!baselinePreview) return;
    setBaselineStatus("saving");
    setBaselineMsg("Saving…");
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: adminPasscode,
          stock: {},
          hidden: [],
          added: [],
          baseline: baselinePreview.merged,
          baselineDate: new Date().toISOString(),
          baselineLabel: baselinePreview.fileName,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Server error");
      }
      await refreshOverrides();
      setBaselinePreview(null);
      setBaselineStatus("saved");
      setBaselineMsg("Inventory replaced. Other kiosks will see this the next time they reload the app.");
    } catch (err) {
      setBaselineStatus("error");
      setBaselineMsg("Couldn't save: " + (err && err.message ? err.message : err));
    }
  }

  function cancelBaselineUpload() {
    setBaselinePreview(null);
    setBaselineStatus("");
    setBaselineMsg("");
  }

  const storages = useMemo(
    () => ["All", ...Array.from(new Set(inv.map((i) => i.storage).filter(Boolean)))],
    [inv]
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(inv.map((i) => i.category).filter(Boolean)))],
    [inv]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inv.map((it, idx) => [idx, it]).filter(([idx, it]) => {
      if (hiddenSet.has(idx)) return false;
      if (storageF !== "All" && it.storage !== storageF) return false;
      if (catF !== "All" && it.category !== catF) return false;
      if (q && !((it.code || "").toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [query, storageF, catF, inv, hiddenSet]);

  // ---- Order-mode derived data ----
  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([idx, qty]) => ({ idx: Number(idx), qty: Number(qty), it: inv[Number(idx)] }))
        .filter((l) => l.it && l.qty > 0)
        .sort((a, b) => a.idx - b.idx),
    [cart, inv]
  );
  const cartTotalUnits = useMemo(() => cartLines.reduce((s, l) => s + l.qty, 0), [cartLines]);
  const orderCategories = useMemo(
    () => ["All", ...Array.from(new Set(inv.map((i) => i.category).filter(Boolean)))],
    [inv]
  );
  const orderFiltered = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return inv.map((it, idx) => [idx, it]).filter(([idx, it]) => {
      if (hiddenSet.has(idx)) return false;
      if (orderCatF !== "All" && it.category !== orderCatF) return false;
      if (q && !((it.code || "").toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [orderQuery, orderCatF, inv, hiddenSet]);

  // Persist overrides to localStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(IMG_OVERRIDE_KEY, JSON.stringify(manualUrls));
    } catch {
      /* storage full or unavailable — overrides simply won't persist */
    }
  }, [manualUrls]);

  // Restart at the first image candidate when the item or its override changes.
  useEffect(() => { setImgIdx(0); }, [selIdx, manualUrls[selIdx], overrides.images, manifestMap]);

  // Validate the typed URL and only commit it as an override once it actually
  // loads as an image. A broken link never replaces the working built-in image.
  const checkSeq = useRef(0);
  useEffect(() => {
    if (selIdx === null) return;
    const url = draftUrl.trim();

    // Cleared box -> remove any saved override, fall back to the hardcoded image.
    if (!url) {
      setUrlStatus("idle");
      setManualUrls((p) => {
        if (!(selIdx in p)) return p;
        const n = { ...p };
        delete n[selIdx];
        return n;
      });
      return;
    }

    // Already the saved override for this item — nothing to re-check.
    if (manualUrls[selIdx] === url) {
      setUrlStatus("saved");
      return;
    }

    setUrlStatus("checking");
    const seq = ++checkSeq.current;
    const handle = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        if (seq !== checkSeq.current) return;
        setManualUrls((p) => ({ ...p, [selIdx]: url }));
        setUrlStatus("saved");
      };
      img.onerror = () => {
        if (seq !== checkSeq.current) return;
        setUrlStatus("error");
      };
      img.src = url;
    }, 500); // debounce so we don't probe on every keystroke

    return () => clearTimeout(handle);
  }, [draftUrl, selIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist wing + nurse name; reload that wing's cart when the wing changes.
  useEffect(() => {
    try { localStorage.setItem(ORDER_WING_KEY, JSON.stringify(wing)); } catch {}
    setCart(loadJSON(cartKey(wing), {}));
    setLastSubmitted(loadJSON(submittedKey(wing), null));
    setSaveStatus("");
    setSaveMsg("");
    setCartResetNotice(false);
  }, [wing]);

  useEffect(() => {
    try { localStorage.setItem(ORDER_NAME_KEY, JSON.stringify(nurseName)); } catch {}
  }, [nurseName]);

  // Persist the active wing's cart on every change.
  useEffect(() => {
    try { localStorage.setItem(cartKey(wing), JSON.stringify(cart)); } catch {}
  }, [cart, wing]);

  // Keep local carts in sync with the shared inventory whenever overrides
  // (re)load:
  // - A brand-new monthly baseline upload changes overrides.baselineDate —
  //   old cart line-item indices may now point at completely different
  //   items, so every wing's cart on this device is wiped.
  // - Otherwise (e.g. the admin just hid or deleted one item), only drop
  //   cart lines that point at items that are now hidden or no longer exist
  //   — everything else in the cart is left untouched.
  useEffect(() => {
    if (!overridesLoaded) return;
    const stamp = overrides.baselineDate || "";
    const prevStamp = localStorage.getItem(BASELINE_STAMP_KEY);
    if (prevStamp !== null && prevStamp !== stamp) {
      WINGS.forEach((w) => {
        try { localStorage.removeItem(cartKey(w)); } catch {}
      });
      setCart((c) => {
        if (Object.keys(c).length) setCartResetNotice(true);
        return {};
      });
    } else {
      const pruneCart = (c) => {
        let changed = false;
        const next = {};
        Object.entries(c).forEach(([k, v]) => {
          const idx = Number(k);
          if (idx >= inv.length || hiddenSet.has(idx)) {
            changed = true;
            return;
          }
          next[k] = v;
        });
        return changed ? next : c;
      };
      setCart(pruneCart);
      WINGS.forEach((w) => {
        if (w === wing) return; // current wing handled via setCart above
        const stored = loadJSON(cartKey(w), {});
        const pruned = pruneCart(stored);
        if (pruned !== stored) {
          try { localStorage.setItem(cartKey(w), JSON.stringify(pruned)); } catch {}
        }
      });
    }
    try { localStorage.setItem(BASELINE_STAMP_KEY, stamp); } catch {}
  }, [overridesLoaded, overrides, inv.length, hiddenSet]); // eslint-disable-line react-hooks/exhaustive-deps

  function addToCart(idx) {
    setCart((c) => ({ ...c, [idx]: (Number(c[idx]) || 0) + 1 }));
  }
  function setCartQty(idx, qty) {
    const n = Math.max(0, Math.floor(Number(qty) || 0));
    setCart((c) => {
      const next = { ...c };
      if (n <= 0) delete next[idx];
      else next[idx] = n;
      return next;
    });
  }
  function removeFromCart(idx) {
    setCart((c) => {
      const next = { ...c };
      delete next[idx];
      return next;
    });
  }
  function clearCart() {
    if (cartLines.length && !window.confirm("Remove all items from this wing's order?")) return;
    setCart({});
    setSaveStatus("");
    setSaveMsg("");
  }

  // Wing and nurse name are required before generating/saving/printing an order.
  // Returns true if both are filled; otherwise flags the fields and shows an error.
  function ensureOrderFieldsFilled() {
    if (wing && nurseName.trim()) return true;
    setShowFieldErrors(true);
    setSaveStatus("error");
    setSaveMsg("Please select a wing and enter your name before continuing.");
    return false;
  }

  // Build the filled .xlsx from the template, writing quantities into the chosen
  // wing's "To order" (column H). Returns { blob, filename }.
  async function buildOrderFile() {
    let ExcelJS;
    try {
      ExcelJS = (await import("exceljs")).default;
    } catch (err) {
      // A new version of the app was deployed since this page was loaded, so the
      // browser is trying to fetch a JS chunk that no longer exists. Reloading
      // picks up the current build.
      throw new Error("The app was updated since this page loaded. Please refresh the page and try again.");
    }
    const wb = new ExcelJS.Workbook();
    const buf = await (await fetch(TEMPLATE_PATH)).arrayBuffer();
    await wb.xlsx.load(buf);
    const ws = wb.getWorksheet(wing);
    if (!ws) throw new Error("Wing tab '" + wing + "' not found in template.");

    Object.entries(cart).forEach(([idxStr, qty]) => {
      const idx = Number(idxStr);
      const q = Number(qty);
      if (!q || idx > templateLastIndex) return;
      ws.getCell("H" + (idx + TEMPLATE_FIRST_ROW)).value = q;
    });

    // Admin-hidden items still have a pre-printed row in the template — remove
    // the whole row (bottom-up so earlier row numbers stay valid) so discontinued
    // items don't leave gaps on the generated order form.
    Array.from(hiddenSet)
      .filter((idx) => idx <= templateLastIndex)
      .sort((a, b) => b - a)
      .forEach((idx) => ws.spliceRows(idx + TEMPLATE_FIRST_ROW, 1));

    // Items beyond the template's row capacity have no pre-built template
    // row — this includes admin-added items and, after a monthly baseline
    // upload, any baseline items past TEMPLATE_ROW_CAPACITY. Always show them
    // (like every other item), appended right after the last row with actual
    // content. (Templates can have a trailing blank-but-styled row, which
    // would otherwise leave a gap before the appended rows.)
    const addedItems = inv.slice(baseLen);
    if (addedItems.length) {
      let lastContentRow = ws.actualRowCount;
      while (lastContentRow >= TEMPLATE_FIRST_ROW) {
        let hasContent = false;
        ws.getRow(lastContentRow).eachCell({ includeEmpty: false }, () => {
          hasContent = true;
        });
        if (hasContent) break;
        lastContentRow--;
      }
      const styleRow = ws.getRow(lastContentRow);
      const styles = [];
      for (let c = 1; c <= 9; c++) styles.push(styleRow.getCell(c).style);
      addedItems.forEach((it, i) => {
        const idx = baseLen + i;
        const q = Number(cart[idx]) || "";
        const row = ws.getRow(lastContentRow + 1 + i);
        row.values = [it.storage, it.category, it.code, it.desc, it.unit, it.stock, "", q, ""];
        for (let c = 1; c <= 9; c++) row.getCell(c).style = styles[c - 1];
        row.commit();
      });
    }

    // Keep only this wing's tab so the file isn't the whole 11-sheet workbook.
    wb.worksheets.slice().forEach((s) => {
      if (s.name !== wing) wb.removeWorksheet(s.id);
    });

    // Stamp who ordered + when into the print footer (doesn't disturb any cells).
    ws.headerFooter.oddFooter =
      "&LOrdered by: " + (nurseName || "—") + "&RGenerated " + new Date().toLocaleString();

    const out = await wb.xlsx.writeBuffer();
    const blob = new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const date = new Date().toISOString().slice(0, 10);
    const who = sanitizeFilePart(nurseName);
    const filename = sanitizeFilePart(wing) + " order " + date + (who ? " - " + who : "") + ".xlsx";
    return { blob, filename };
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function recordSubmitted() {
    const snap = {
      at: new Date().toISOString(),
      by: nurseName || "",
      lines: cartLines.map((l) => ({ code: l.it.code, qty: l.qty })),
    };
    setLastSubmitted(snap);
    try { localStorage.setItem(submittedKey(wing), JSON.stringify(snap)); } catch {}
  }

  // Generate + try to auto-save into the picked OneDrive folder; fall back to a
  // normal download if the File System Access API is unavailable or denied.
  async function generateAndSave() {
    if (!cartLines.length) {
      setSaveStatus("error");
      setSaveMsg("Add at least one item before saving.");
      return;
    }
    if (!ensureOrderFieldsFilled()) return;
    setSaveStatus("working");
    setSaveMsg("Building the order sheet…");
    try {
      const { blob, filename } = await buildOrderFile();

      if (window.showDirectoryPicker) {
        try {
          let dir = await idbHandle("get");
          const opts = { mode: "readwrite" };
          if (dir && (await dir.queryPermission(opts)) !== "granted") {
            if ((await dir.requestPermission(opts)) !== "granted") dir = null;
          }
          if (!dir) {
            dir = await window.showDirectoryPicker({ id: "supply-order-dir", mode: "readwrite" });
            await idbHandle("put", dir);
          }
          const fh = await dir.getFileHandle(filename, { create: true });
          const w = await fh.createWritable();
          await w.write(blob);
          await w.close();
          recordSubmitted();
          setSaveStatus("saved");
          setSaveMsg('Saved "' + filename + '" to the shared folder "' + dir.name + '".');
          return;
        } catch (err) {
          if (err && err.name === "AbortError") {
            setSaveStatus("");
            setSaveMsg("Folder selection cancelled — nothing saved yet.");
            return;
          }
          // fall through to download
        }
      }

      downloadBlob(blob, filename);
      recordSubmitted();
      setSaveStatus("downloaded");
      setSaveMsg('Downloaded "' + filename + '". Save it into the shared OneDrive order folder.');
    } catch (err) {
      setSaveStatus("error");
      setSaveMsg("Couldn't build the order sheet: " + (err && err.message ? err.message : err));
    }
  }

  async function downloadOnly() {
    if (!cartLines.length) {
      setSaveStatus("error");
      setSaveMsg("Add at least one item first.");
      return;
    }
    if (!ensureOrderFieldsFilled()) return;
    setSaveStatus("working");
    setSaveMsg("Building the order sheet…");
    try {
      const { blob, filename } = await buildOrderFile();
      downloadBlob(blob, filename);
      recordSubmitted();
      setSaveStatus("downloaded");
      setSaveMsg('Downloaded "' + filename + '".');
    } catch (err) {
      setSaveStatus("error");
      setSaveMsg("Couldn't build the order sheet: " + (err && err.message ? err.message : err));
    }
  }

  // Email the order to the admin (with the .xlsx attached) via the /api/send-order
  // serverless function, in case the nurse forgets to save it into the shared folder.
  async function sendToAdmin() {
    if (!cartLines.length) {
      setSaveStatus("error");
      setSaveMsg("Add at least one item before sending.");
      return;
    }
    if (!ensureOrderFieldsFilled()) return;
    setSaveStatus("working");
    setSaveMsg("Sending order to admin…");
    try {
      const { blob, filename } = await buildOrderFile();
      const buf = await blob.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const fileBase64 = btoa(binary);

      const items = cartLines
        .map((l) => (l.it.code || "—") + "  x" + l.qty + "  - " + l.it.desc)
        .join("\n");

      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wing,
          nurseName,
          date: new Date().toLocaleDateString(),
          itemCount: cartLines.length,
          items,
          filename,
          fileBase64,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Server error");
      }
      recordSubmitted();
      setSaveStatus("saved");
      setSaveMsg("Order emailed to admin.");
    } catch (err) {
      setSaveStatus("error");
      setSaveMsg("Couldn't send the order: " + (err && err.message ? err.message : err));
    }
  }

  // Print a clean order summary (HTML) — reliable across browsers, instant.
  function printOrder() {
    if (!cartLines.length) {
      setSaveStatus("error");
      setSaveMsg("Add at least one item before printing.");
      return;
    }
    if (!ensureOrderFieldsFilled()) return;
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
    const rows = cartLines
      .map(
        (l) =>
          "<tr><td>" + esc(l.it.code) + "</td><td>" + esc(l.it.desc) +
          "</td><td>" + esc(l.it.unit) + "</td><td class='q'>" + esc(l.qty) + "</td></tr>"
      )
      .join("");
    const html =
      "<!doctype html><html><head><meta charset='utf-8'><title>" + esc(wing) + " Order</title>" +
      "<style>body{font-family:Arial,Helvetica,sans-serif;color:#14242b;padding:24px}" +
      "h1{font-size:18px;margin:0 0 2px}.meta{font-size:12px;color:#5c6e75;margin-bottom:14px}" +
      "table{border-collapse:collapse;width:100%}th,td{border:1px solid #c8d2d4;padding:6px 8px;font-size:12px;text-align:left}" +
      "th{background:#e1efef}.q{text-align:center;font-weight:700;width:64px}@media print{button{display:none}}</style></head><body>" +
      "<h1>Unit " + esc(wing) + " — Supply Order</h1>" +
      "<div class='meta'>Ordered by: " + esc(nurseName || "—") + " &nbsp;·&nbsp; " + esc(new Date().toLocaleString()) +
      " &nbsp;·&nbsp; " + cartLines.length + " item(s)</div>" +
      "<table><thead><tr><th>Code</th><th>Description</th><th>Unit</th><th>To order</th></tr></thead><tbody>" +
      rows + "</tbody></table></body></html>";
    const w = window.open("", "_blank");
    if (!w) {
      setSaveStatus("error");
      setSaveMsg("Pop-up blocked — allow pop-ups to print, or use Download instead.");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  const item = selIdx === null ? null : inv[selIdx];

  function selectItem(idx) {
    setSelIdx(idx);
    setImgIdx(0);
    setDraftUrl(manualUrls[idx] || "");
    setUrlStatus(manualUrls[idx] ? "saved" : "idle");
    const existing = idx !== null ? ((overrides.images || {})[itemImgKey(inv[idx])] || "") : "";
    setAdminImgDraft(existing);
    setAdminImgStatus(existing ? "saved" : "idle");
  }

  const adminImgCheckSeq = useRef(0);
  async function saveAdminImage(url) {
    if (selIdx === null) return;
    const key = itemImgKey(inv[selIdx]);
    setAdminImgStatus("saving");
    const updatedImages = { ...(overrides.images || {}), [key]: url || undefined };
    if (!url) delete updatedImages[key];
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: adminPasscode,
          stock: overrides.stock,
          hidden: overrides.hidden,
          added: overrides.added,
          images: updatedImages,
          baseline: overrides.baseline,
          baselineDate: overrides.baselineDate,
          baselineLabel: overrides.baselineLabel,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Server error");
      await refreshOverrides();
      setAdminImgStatus("saved");
    } catch {
      setAdminImgStatus("error");
    }
  }

  // Validate admin image URL then persist to server.
  useEffect(() => {
    if (selIdx === null || !isAdmin) return;
    const url = adminImgDraft.trim();
    const key = itemImgKey(inv[selIdx]);
    const current = (overrides.images || {})[key] || "";

    if (!url) {
      if (current) saveAdminImage("");
      else setAdminImgStatus("idle");
      return;
    }
    if (current === url) {
      setAdminImgStatus("saved");
      return;
    }
    setAdminImgStatus("checking");
    const seq = ++adminImgCheckSeq.current;
    const handle = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        if (seq !== adminImgCheckSeq.current) return;
        saveAdminImage(url);
      };
      img.onerror = () => {
        if (seq !== adminImgCheckSeq.current) return;
        setAdminImgStatus("error");
      };
      img.src = url;
    }, 600);
    return () => clearTimeout(handle);
  }, [adminImgDraft, selIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function exportCsv() {
    const cell = (x) => '"' + (x == null ? "" : String(x)).replace(/"/g, '""') + '"';
    const headers = [
      "Storage", "Category", "Code", "Description", "Unit", "Stock",
      "Product", "Manufacturer", "Image URL",
    ];
    const lines = inv.map((it, i) => {
      const imgUrl = manualUrls[i] || (overrides.images || {})[itemImgKey(it)] || it.imageUrl || it.imageFallback || manifestMap[normCode(it.code || "")] || "";
      return [
        it.storage, it.category, it.code, it.desc, it.unit, it.stock,
        it.productName || "", it.manufacturer || "", imgUrl,
      ].map(cell).join(",");
    });
    const csv = [headers.map(cell).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supply-items.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Ordered image candidates: a per-computer override (if any), then the
  // admin-set permanent override, then the curated remote URL / local backup,
  // then a fallback match against public/images by product code. The <img>
  // walks this list on load errors.
  const adminImageOverride = item ? (overrides.images || {})[itemImgKey(item)] : null;
  const imgCandidates = item
    ? [manualUrls[selIdx], adminImageOverride, item.imageUrl, item.imageFallback, manifestMap[normCode(item.code || "")]]
        .filter(Boolean)
        .filter((u, i, a) => a.indexOf(u) === i)
    : [];
  const displayImg = imgCandidates[imgIdx] || "";

  return (
    <div className={"wrap" + (selIdx !== null ? " detail-open" : "")}>
      <style>{css}</style>

      <header className="topbar">
        <div className="brand">
          <div className="logo"><PackageSearch size={20} /></div>
          <div>
            <div className="title">Supply Match</div>
            <div className="sub">
              {mode === "verify" ? "Browse items, check the picture, and manage product images"
                : mode === "admin" ? "Admin — manage stock and inventory"
                : "Build this wing's order, then save or print it"}
            </div>
          </div>
        </div>
        <div className="topright">
          <div className="modetoggle">
            <button className={mode === "verify" ? "on" : ""} onClick={() => setMode("verify")}>Items</button>
            <button className={mode === "order" ? "on" : ""} onClick={() => setMode("order")}>Order</button>
            {isAdmin && (
              <button className={mode === "admin" ? "on" : ""} onClick={() => setMode("admin")}>Admin</button>
            )}
          </div>
          {mode === "verify" ? (
            <button className="btn" onClick={exportCsv}><Download size={15} /> Export</button>
          ) : mode === "order" ? (
            <div className="progress">
              <div>Unit <b>{wing || "—"}</b> · <b>{cartLines.length}</b> item{cartLines.length === 1 ? "" : "s"}</div>
              <div style={{ marginTop: 2 }}>{cartTotalUnits} unit{cartTotalUnits === 1 ? "" : "s"} to order</div>
            </div>
          ) : null}
          <button className="btn" title={isAdmin ? "Exit admin mode" : "Admin login"} onClick={handleAdminClick}>
            {isAdmin ? <Unlock size={15} /> : <Lock size={15} />} {isAdmin ? "Exit admin" : "Admin"}
          </button>
        </div>
      </header>

      {mode === "verify" && (
      <div className="body">
        {/* LIST */}
        <section className="list">
          <div className="tools">
            <div className="searchwrap">
              <Search size={17} />
              <input
                placeholder="Search code or description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="filters">
              <select value={storageF} onChange={(e) => setStorageF(e.target.value)}>
                {storages.map((s) => <option key={s} value={s}>{s === "All" ? "All locations" : s}</option>)}
              </select>
              <select value={catF} onChange={(e) => setCatF(e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>)}
              </select>
            </div>
            <div className="count">{filtered.length} item{filtered.length === 1 ? "" : "s"}</div>
          </div>
          <div className="rows">
            {filtered.map(([idx, it]) => {
              return (
                <button
                  key={idx}
                  className={"itemrow" + (idx === selIdx ? " active" : "")}
                  onClick={() => selectItem(idx)}
                >
                  <span className="rowmain">
                    <span className="code">{it.code || "— no code —"}</span>
                    <span className="desc">{it.desc}</span>
                    <span className="chip">{it.category || "Uncategorized"}</span>
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty-list">No items match your search. Try a different code or word.</div>
            )}
          </div>
        </section>

        {/* DETAIL */}
        <section className="detail">
          {item === null ? (
            <div className="placeholder">
              <div className="ring"><PackageSearch size={28} /></div>
              <div>Pick an item on the left to view its details and image.</div>
            </div>
          ) : (
            <>
              <button className="back" onClick={() => setSelIdx(null)}><ChevronLeft size={17} /> All items</button>
              <div className="detail-inner">
                <div className="dethead">
                  <div className="codebig">{item.code || "— no code —"}</div>
                  <div className="tags">
                    <span className="tag">{item.storage}</span>
                    <span className="tag">{item.category || "Uncategorized"}</span>
                    <span className="tag">Unit {item.unit || "—"}</span>
                    <span className="tag">Stock {item.stock || "—"}</span>
                  </div>
                </div>

                <div className="field">
                  <div className="flabel">Description on file</div>
                  <div className="descbig">{item.desc}</div>
                </div>

                {/* Reference Panel */}
                <div className="lookup">
                  <div className="lookup-head">
                    <div className="lh-t">Reference &amp; image</div>
                  </div>
                  <div className="lookup-body">
                    <div className="resolve">
                      <span className="rl">Product</span>
                      <span className="rv">{item.productName || item.desc || "Unidentified"}</span>
                      {item.manufacturer && item.manufacturer !== "unknown" && (
                        <span className="rm">Brand / Manufacturer: {item.manufacturer}</span>
                      )}
                    </div>

                    <div className="imgbox">
                      {displayImg ? (
                        <img
                          key={displayImg}
                          src={displayImg}
                          alt={item.productName || item.desc}
                          onError={() => setImgIdx((i) => i + 1)}
                        />
                      ) : (
                        <div className="noimg">
                          <ImageOff size={26} />
                          <div>No image yet. Add a direct image URL below or search via Google.</div>
                        </div>
                      )}
                    </div>

                    <div className="linkrow">
                      <a className="linklike" href={gImages(item)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open Google Images</a>
                    </div>

                    <div className="urlrow">
                      <input
                        placeholder="Paste a direct image URL to save / override it locally"
                        value={draftUrl}
                        onChange={(e) => setDraftUrl(e.target.value)}
                      />
                      {draftUrl.trim() && manualUrls[selIdx] && (
                        <button
                          className="btn"
                          title="Remove override and restore the built-in image"
                          onClick={() => setDraftUrl("")}
                        >
                          <Eraser size={14} /> Reset
                        </button>
                      )}
                    </div>
                    {urlStatus === "checking" && (
                      <div className="hint" style={{ color: "var(--soft)" }}>Checking that the image loads…</div>
                    )}
                    {urlStatus === "saved" && draftUrl.trim() && (
                      <div className="hint" style={{ color: "var(--green)", fontWeight: 600 }}>
                        <Check size={13} style={{ verticalAlign: "-2px" }} /> Saved — this image will stay, even after you refresh or reopen.
                      </div>
                    )}
                    {urlStatus === "error" && (
                      <div className="hint" style={{ color: "var(--red)", fontWeight: 600 }}>
                        <AlertTriangle size={13} style={{ verticalAlign: "-2px" }} /> That URL didn't load as an image — the current picture was kept. Try a direct link ending in .jpg/.png.
                      </div>
                    )}
                    {urlStatus === "idle" && (
                      <div className="hint">Paste a direct image URL. It's only saved once it successfully loads, so a bad link never replaces a working picture. Saved on this computer.</div>
                    )}

                    {isAdmin && (
                      <div style={{ marginTop: 18, borderTop: "1px solid var(--line2)", paddingTop: 14 }}>
                        <div className="flabel" style={{ marginBottom: 8 }}>Permanent image (admin · all devices)</div>
                        <div className="urlrow">
                          <input
                            placeholder="Paste a permanent image URL to save for all kiosks"
                            value={adminImgDraft}
                            onChange={(e) => { setAdminImgDraft(e.target.value); setAdminImgStatus("idle"); }}
                          />
                          {adminImgDraft.trim() && (overrides.images || {})[itemImgKey(item)] && (
                            <button className="btn" title="Remove permanent image override" onClick={() => setAdminImgDraft("")}>
                              <Eraser size={14} /> Reset
                            </button>
                          )}
                          {!item.code && (
                            <div className="hint" style={{ color: "var(--amber)" }}>This item has no product code — image is keyed by description.</div>
                          )}
                        </div>
                        {adminImgStatus === "checking" && (
                          <div className="hint" style={{ color: "var(--soft)" }}>Checking that the image loads…</div>
                        )}
                        {adminImgStatus === "saving" && (
                          <div className="hint" style={{ color: "var(--soft)" }}>Saving for all kiosks…</div>
                        )}
                        {adminImgStatus === "saved" && adminImgDraft.trim() && (
                          <div className="hint" style={{ color: "var(--green)", fontWeight: 600 }}>
                            <Check size={13} style={{ verticalAlign: "-2px" }} /> Saved permanently — visible on all kiosks after reload.
                          </div>
                        )}
                        {adminImgStatus === "error" && (
                          <div className="hint" style={{ color: "var(--red)", fontWeight: 600 }}>
                            <AlertTriangle size={13} style={{ verticalAlign: "-2px" }} /> That URL didn't load as an image — try a direct link ending in .jpg/.png.
                          </div>
                        )}
                        {(adminImgStatus === "idle" || (!adminImgDraft.trim() && adminImgStatus !== "saved")) && (
                          <div className="hint">Paste a permanent image URL. Once saved, it overrides the built-in image for this item on every device. Requires admin login.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      )}

      {mode === "order" && (
      <div className="orderbody">
        {/* ITEM PICKER */}
        <section className="ordermain">
          <div className="tools">
            <div className="searchwrap">
              <Search size={17} />
              <input
                placeholder="Search code or description to add"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
              />
            </div>
            <div className="filters">
              <select value={orderCatF} onChange={(e) => setOrderCatF(e.target.value)}>
                {orderCategories.map((c) => <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>)}
              </select>
            </div>
            <div className="count">{orderFiltered.length} item{orderFiltered.length === 1 ? "" : "s"}</div>
          </div>
          <div className="rows">
            {orderFiltered.map(([idx, it]) => {
              const qty = Number(cart[idx]) || 0;
              return (
                <div key={idx} className={"orow" + (qty > 0 ? " incart" : "")}>
                  <span className="rowmain">
                    <span className="code">{it.code || "— no code —"}{qty > 0 && <span className="miniflag">In order ×{qty}</span>}</span>
                    <span className="desc">{it.desc}</span>
                  </span>
                  {qty > 0 ? (
                    <div className="qctrl">
                      <button className="qbtn" title="Less" onClick={() => setCartQty(idx, qty - 1)}><Minus size={15} /></button>
                      <input
                        className="qnum"
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => setCartQty(idx, e.target.value)}
                      />
                      <button className="qbtn" title="More" onClick={() => setCartQty(idx, qty + 1)}><Plus size={15} /></button>
                    </div>
                  ) : (
                    <button className="addbtn" onClick={() => addToCart(idx)}><Plus size={14} /> Add</button>
                  )}
                </div>
              );
            })}
            {orderFiltered.length === 0 && (
              <div className="empty-list">No items match your search.</div>
            )}
          </div>
        </section>

        {/* CART */}
        <aside className="cartside">
          <div className="cart-head">
            <div className="ch-t"><ShoppingCart size={17} /> This wing's order</div>
            <div className="ch-s">Items are saved on this computer as you go — close and come back, they'll still be here.</div>
            {cartResetNotice && (
              <div className="savemsg info" style={{ marginTop: 10 }}>
                <AlertTriangle size={13} style={{ verticalAlign: "-2px" }} />{" "}
                The inventory was updated this month, so this wing's order was cleared. Please re-add the items you need.
              </div>
            )}
          </div>

          <div className="orderfields">
            <div className={showFieldErrors && !wing ? "field-err" : ""}>
              <label>Wing / Unit *</label>
              <select value={wing} onChange={(e) => { setWing(e.target.value); setShowFieldErrors(false); }}>
                <option value="" disabled hidden>Select wing…</option>
                {WINGS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {showFieldErrors && !wing && <div className="field-msg">Please select a wing.</div>}
            </div>
            <div className={showFieldErrors && !nurseName.trim() ? "field-err" : ""}>
              <label>Ordered by *</label>
              <input
                placeholder="Your name"
                value={nurseName}
                onChange={(e) => { setNurseName(e.target.value); setShowFieldErrors(false); }}
              />
              {showFieldErrors && !nurseName.trim() && <div className="field-msg">Please enter your name.</div>}
            </div>
          </div>

          <div className="cartlist">
            {cartLines.length === 0 ? (
              <div className="cart-empty">No items yet. Use <b>Add</b> on the left to build {wing || "this wing"}'s order.</div>
            ) : (
              cartLines.map((l) => (
                <div key={l.idx} className="cartitem">
                  <div className="ci-main">
                    <div className="ci-code">{l.it.code || "— no code —"}</div>
                    <div className="ci-desc">{l.it.desc}</div>
                  </div>
                  <div className="qctrl">
                    <button className="qbtn" onClick={() => setCartQty(l.idx, l.qty - 1)}><Minus size={14} /></button>
                    <input
                      className="qnum"
                      type="number"
                      min="0"
                      value={l.qty}
                      onChange={(e) => setCartQty(l.idx, e.target.value)}
                    />
                    <button className="qbtn" onClick={() => setCartQty(l.idx, l.qty + 1)}><Plus size={14} /></button>
                    <button className="qbtn" title="Remove" onClick={() => removeFromCart(l.idx)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-foot">
            <div className="cart-actions">
              <button className="btn primary" disabled={!cartLines.length || saveStatus === "working"} onClick={generateAndSave}>
                <Save size={15} /> Generate &amp; save to folder
              </button>
              <button className="btn" disabled={!cartLines.length || saveStatus === "working"} onClick={sendToAdmin}>
                <Mail size={15} /> Send to admin
              </button>
              <div className="row2">
                <button className="btn" disabled={!cartLines.length || saveStatus === "working"} onClick={downloadOnly}>
                  <Download size={15} /> Download
                </button>
                <button className="btn" disabled={!cartLines.length} onClick={printOrder}>
                  <Printer size={15} /> Print
                </button>
                <button className="btn danger" disabled={!cartLines.length} onClick={clearCart}>
                  <Trash2 size={15} /> Clear
                </button>
              </div>
            </div>

            {saveMsg && (
              <div className={"savemsg " + (saveStatus === "saved" ? "ok" : saveStatus === "error" ? "err" : "info")}>
                {saveStatus === "saved" && <Check size={13} style={{ verticalAlign: "-2px" }} />}{" "}
                {saveMsg}
              </div>
            )}
            {lastSubmitted && (
              <div className="subnote">
                <ClipboardCheck size={12} style={{ verticalAlign: "-2px" }} /> Last saved for {wing}: {new Date(lastSubmitted.at).toLocaleString()}
                {lastSubmitted.by ? " by " + lastSubmitted.by : ""} ({lastSubmitted.lines.length} item{lastSubmitted.lines.length === 1 ? "" : "s"}).
              </div>
            )}
            <div className="subnote">
              <FolderOpen size={12} style={{ verticalAlign: "-2px" }} /> First save asks you to pick the shared OneDrive order folder once; after that it saves there automatically. The file matches your printed form exactly.
            </div>
          </div>
        </aside>
      </div>
      )}

      {mode === "admin" && (
      <div className="body adminbody">
        <section className="adminpanel">
          <div className="baseline-head">
            <div>
              <h2><FileSpreadsheet size={18} /> Monthly inventory upload</h2>
              <p className="sub">
                At the start of each month, upload the updated inventory spreadsheet (same layout as the order forms — Storage, Category, Code, Descriptions, Unit, Stock level starting at row {TEMPLATE_FIRST_ROW}). It becomes the new baseline for every wing: new items, removed items, and stock-count changes are detected automatically. Existing product photos and details are kept for items that still match by code.
              </p>
            </div>
            {overrides.baselineLabel && (
              <div className="baseline-badge">
                <span className="baseline-badge-label">Current baseline</span>
                <span className="baseline-badge-file">{overrides.baselineLabel}</span>
                <span className="baseline-badge-meta">
                  {baseLen} item{baseLen === 1 ? "" : "s"}
                  {overrides.baselineDate ? " · uploaded " + new Date(overrides.baselineDate).toLocaleString() : ""}
                </span>
              </div>
            )}
          </div>

          <div className="admin-savebar">
            <label className={"upload-drop" + (baselineStatus === "parsing" || baselineStatus === "saving" ? " disabled" : "")}>
              <Upload size={16} />
              {baselineStatus === "parsing" ? "Reading…" : baselineStatus === "saving" ? "Saving…" : "Choose spreadsheet…"}
              <input
                type="file"
                accept=".xlsx"
                disabled={baselineStatus === "parsing" || baselineStatus === "saving"}
                onChange={handleBaselineFile}
              />
            </label>
            {baselineMsg && (
              <div className={"savemsg " + (baselineStatus === "saved" ? "ok" : baselineStatus === "error" ? "err" : "info")}>
                {baselineStatus === "saved" && <Check size={13} style={{ verticalAlign: "-2px" }} />}{" "}
                {baselineMsg}
              </div>
            )}
          </div>

          {baselinePreview && (
            <>
              <div className="diff-stats">
                {baselinePreview.added.length > 0 ? (
                  <details className="diff-stat added">
                    <summary>
                      <div className="diff-stat-text">
                        <span className="num">{baselinePreview.added.length}</span>
                        <span className="label">New items</span>
                      </div>
                      <PackagePlus size={18} />
                    </summary>
                    <ul>
                      {baselinePreview.added.map((it, i) => (
                        <li key={i}>
                          <span className="item-code">{it.code || "— no code —"}</span>
                          <span className="item-desc">{it.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <div className="diff-stat added">
                    <div className="diff-stat-row">
                      <div className="diff-stat-text">
                        <span className="num">0</span>
                        <span className="label">New items</span>
                      </div>
                      <PackagePlus size={18} />
                    </div>
                  </div>
                )}
                {baselinePreview.removed.length > 0 ? (
                  <details className="diff-stat removed">
                    <summary>
                      <div className="diff-stat-text">
                        <span className="num">{baselinePreview.removed.length}</span>
                        <span className="label">Removed items</span>
                      </div>
                      <PackageMinus size={18} />
                    </summary>
                    <ul>
                      {baselinePreview.removed.map((it, i) => (
                        <li key={i}>
                          <span className="item-code">{it.code || "— no code —"}</span>
                          <span className="item-desc">{it.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <div className="diff-stat removed">
                    <div className="diff-stat-row">
                      <div className="diff-stat-text">
                        <span className="num">0</span>
                        <span className="label">Removed items</span>
                      </div>
                      <PackageMinus size={18} />
                    </div>
                  </div>
                )}
                {baselinePreview.changed.length > 0 ? (
                  <details className="diff-stat changed">
                    <summary>
                      <div className="diff-stat-text">
                        <span className="num">{baselinePreview.changed.length}</span>
                        <span className="label">Stock changes</span>
                      </div>
                      <RefreshCw size={18} />
                    </summary>
                    <ul>
                      {baselinePreview.changed.map((c, i) => (
                        <li key={i}>
                          <span className="item-code">{c.code || "— no code —"}</span>
                          <span className="item-change">{String(c.from ?? "") || "—"} → {String(c.to ?? "") || "—"}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <div className="diff-stat changed">
                    <div className="diff-stat-row">
                      <div className="diff-stat-text">
                        <span className="num">0</span>
                        <span className="label">Stock changes</span>
                      </div>
                      <RefreshCw size={18} />
                    </div>
                  </div>
                )}
              </div>

              {baselinePreview.autoCoded > 0 && (
                <div className="savemsg info" style={{ marginTop: 10 }}>
                  <AlertTriangle size={13} style={{ verticalAlign: "-2px" }} />{" "}
                  {baselinePreview.autoCoded} item{baselinePreview.autoCoded === 1 ? "" : "s"} in this file had no product code — synthetic codes (NOCODE-0001, etc.) were auto-assigned so images and overrides stay attached permanently. Please add real codes in the source spreadsheet before next month's upload.
                </div>
              )}
              <div className="admin-savebar">
                <button className="btn primary" disabled={baselineStatus === "saving"} onClick={confirmBaselineUpload}>
                  <Check size={15} /> Replace inventory with this file
                </button>
                <button className="btn" disabled={baselineStatus === "saving"} onClick={cancelBaselineUpload}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </section>

        <section className="adminpanel">
          <h2><PackageSearch size={18} /> Inventory</h2>
          <p className="sub">
            Edit stock counts, hide discontinued items, or add new ones. Changes only take effect for everyone after you click <b>Save changes</b> — every kiosk picks them up on its next reload.
          </p>

          <div className="admin-savebar">
            <button className="btn primary" disabled={adminSaveStatus === "working"} onClick={saveAdminChanges}>
              <Save size={15} /> Save changes
            </button>
            {adminSaveMsg && (
              <div className={"savemsg " + (adminSaveStatus === "saved" ? "ok" : adminSaveStatus === "error" ? "err" : "info")}>
                {adminSaveStatus === "saved" && <Check size={13} style={{ verticalAlign: "-2px" }} />}{" "}
                {adminSaveMsg}
              </div>
            )}
          </div>

          <div className="admin-main">
            <div className="admin-table-col">
              <div className="searchwrap admin-search">
                <Search size={17} />
                <input
                  placeholder="Search code or description"
                  value={adminQuery}
                  onChange={(e) => setAdminQuery(e.target.value)}
                />
              </div>

              <div className="admintable">
                <div className="admintable-head">
                  <div>Code</div>
                  <div>Description</div>
                  <div>Storage</div>
                  <div>Stock</div>
                  <div></div>
                </div>
                <div className="admintable-body">
                  {adminFiltered.map(([idx, it]) => (
                    <div key={idx} className={"admintable-row" + (adminHidden.has(idx) ? " hidden-row" : "")}>
                      <div className="atc-code">{it.code || "— no code —"}</div>
                      <div className="atc-desc">{it.desc}</div>
                      <div className="atc-storage">{it.storage}</div>
                      <div>
                        <input
                          className="atc-stock"
                          value={adminStockEdits[idx] != null ? adminStockEdits[idx] : (it.stock || "")}
                          onChange={(e) => setAdminStock(idx, e.target.value)}
                        />
                      </div>
                      <div>
                        {idx < baseLen ? (
                          <button className="btn" onClick={() => toggleAdminHidden(idx)}>
                            {adminHidden.has(idx) ? "Unhide" : "Hide"}
                          </button>
                        ) : (
                          <button className="btn danger" onClick={() => removeAddedItem(idx - baseLen)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-side-col">
              <h3>Add a new item</h3>
              <div className="admin-newitem">
                <input placeholder="Code" value={adminNewItem.code} onChange={(e) => setAdminNewItem((p) => ({ ...p, code: e.target.value }))} />
                <input placeholder="Description" value={adminNewItem.desc} onChange={(e) => setAdminNewItem((p) => ({ ...p, desc: e.target.value }))} />
                <input placeholder="Storage (e.g. 7W)" value={adminNewItem.storage} onChange={(e) => setAdminNewItem((p) => ({ ...p, storage: e.target.value }))} />
                <input placeholder="Category" value={adminNewItem.category} onChange={(e) => setAdminNewItem((p) => ({ ...p, category: e.target.value }))} />
                <input placeholder="Unit (e.g. EA)" value={adminNewItem.unit} onChange={(e) => setAdminNewItem((p) => ({ ...p, unit: e.target.value }))} />
                <input placeholder="Stock" value={adminNewItem.stock} onChange={(e) => setAdminNewItem((p) => ({ ...p, stock: e.target.value }))} />
                <input placeholder="Product name" value={adminNewItem.productName} onChange={(e) => setAdminNewItem((p) => ({ ...p, productName: e.target.value }))} />
                <input placeholder="Manufacturer" value={adminNewItem.manufacturer} onChange={(e) => setAdminNewItem((p) => ({ ...p, manufacturer: e.target.value }))} />
                <input placeholder="Image URL (optional)" value={adminNewItem.imageUrl} onChange={(e) => setAdminNewItem((p) => ({ ...p, imageUrl: e.target.value }))} />
                <button className="btn" onClick={addNewItem}><Plus size={15} /> Add item</button>
              </div>
            </div>
          </div>
        </section>
      </div>
      )}
    </div>
  );
}