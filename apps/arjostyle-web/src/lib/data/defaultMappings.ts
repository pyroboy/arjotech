import type { BodyPartMappings } from '$types/mapping';

export const defaultBodyPartMappings: BodyPartMappings = {
  "Head & Face": {
    "Full Face": {
      position: [0, 0.23, 0.06],
      scale: 0.16,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.8,
      placementSizeLimits: { min: 4, max: 16, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: "Extremely sensitive, many nerve endings, thin skin over bones." }
    },
    Forehead: {
      position: [0, 0.28, 0.1],
      scale: 0.08,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.5,
      placementSizeLimits: { min: 1, max: 6, multiplier: 1.4 },
      placementPainInfo: { level: 8, reason: "Directly over skull bone with thin skin." }
    },
    Temple: {
      position: [-0.08, 0.265, 0.09],
      scale: 0.05,
      cameraAzimuth: -0.7853981633974483,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.4,
      placementSizeLimits: { min: 0.5, max: 4, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: "Very thin skin, close to temporal artery and bone." }
    },
    Cheek: {
      position: [-0.075, 0.21, 0.105],
      scale: 0.06,
      cameraAzimuth: -0.5235987755982988,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.45,
      placementSizeLimits: { min: 0.5, max: 4, multiplier: 1.3 },
      placementPainInfo: { level: 7, reason: "Close to cheekbones." }
    },
    "Under Eye": {
      position: [-0.04, 0.245, 0.11],
      scale: 0.035,
      cameraAzimuth: -0.3,
      cameraPolar: 1.45,
      cameraDistance: 0.4,
      placementSizeLimits: { min: 0.5, max: 2, multiplier: 1.6 },
      placementPainInfo: { level: 9, reason: "Extremely thin, delicate skin with many nerve endings." }
    },
    "Ear / Behind Ear": {
      position: [-0.1, 0.22, 0.03],
      scale: 0.05,
      cameraAzimuth: -1.5707963267948966,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.4,
      placementSizeLimits: { min: 0.5, max: 3, multiplier: 1.3 },
      placementPainInfo: { level: 7, reason: "Thin skin, cartilage nearby." }
    },
    Chin: {
      position: [0, 0.155, 0.105],
      scale: 0.05,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.4,
      placementSizeLimits: { min: 0.5, max: 3, multiplier: 1.3 },
      placementPainInfo: { level: 7, reason: "Thin skin over chin bone." }
    },
    "Crown / Scalp": {
      position: [0, 0.37, 0],
      scale: 0.1,
      cameraAzimuth: 0,
      cameraPolar: 0.3,
      cameraDistance: 0.6,
      placementSizeLimits: { min: 1, max: 8, multiplier: 1.5 },
      placementPainInfo: { level: 8, reason: "Thin skin directly over skull." }
    }
  },
  Neck: {
    "Front Neck": {
      position: [0, 0.09, 0.06],
      scale: 0.07,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.6,
      placementSizeLimits: { min: 1, max: 6, multiplier: 1.4 },
      placementPainInfo: { level: 7, reason: "Sensitive throat area, close to trachea and arteries." }
    },
    "Side Neck": {
      position: [-0.055, 0.1, 0.04],
      scale: 0.065,
      cameraAzimuth: -0.7853981633974483,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.55,
      placementSizeLimits: { min: 1, max: 6, multiplier: 1.3 },
      placementPainInfo: { level: 7, reason: "Can be sensitive near major vessels." }
    },
    "Back Neck": {
      position: [0, 0.11, -0.05],
      scale: 0.08,
      cameraAzimuth: 3.141592653589793,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.6,
      placementSizeLimits: { min: 1, max: 6, multiplier: 1.2 },
      placementPainInfo: { level: 6, reason: "Spine area can be sensitive." }
    },
  },
  "Upper Torso": {
    Chest: {
      position: [0, -0.17, 0.12],
      scale: 0.2,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.2,
      placementSizeLimits: { min: 3, max: 20, multiplier: 1.1 },
      placementPainInfo: { level: 6, reason: "Can be sensitive near sternum/collarbone." }
    },
    Collarbone: {
      position: [0, -0.07, 0.1],
      scale: 0.1,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.8,
      placementSizeLimits: { min: 2, max: 12, multiplier: 1.2 },
      placementPainInfo: { level: 7, reason: "Thin skin directly over the clavicle bone." }
    },
    Sternum: {
      position: [0, -0.21, 0.12],
      scale: 0.08,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.8,
      placementSizeLimits: { min: 1, max: 8, multiplier: 1.3 },
      placementPainInfo: { level: 8, reason: "Thin skin directly over the breastbone." }
    },
    "Rib / Side Torso": {
      position: [-0.19, -0.34, 0.05],
      scale: 0.12,
      cameraAzimuth: -0.7853981633974483,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 3, max: 16, multiplier: 1.4 },
      placementPainInfo: { level: 8, reason: "Thin skin directly over ribs, breathing movement." }
    },
    "Upper Back": {
      position: [0, -0.17, -0.13],
      scale: 0.22,
      cameraAzimuth: 3.141592653589793,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.3,
      placementSizeLimits: { min: 3, max: 25, multiplier: 1.1 },
      placementPainInfo: { level: 5, reason: "Generally less sensitive, more muscle/fat cushion." }
    },
    "Shoulder Top": {
      position: [-0.18, -0.1, -0.02],
      scale: 0.1,
      cameraAzimuth: -0.9,
      cameraPolar: 0.8,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 2, max: 10, multiplier: 1.2 },
      placementPainInfo: { level: 6, reason: "Mix of muscle and bone, moderate sensitivity." }
    },
    Spine: {
      position: [0, -0.3, -0.14],
      scale: 0.15,
      cameraAzimuth: 3.141592653589793,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.1,
      placementSizeLimits: { min: 2, max: 20, multiplier: 1.3 },
      placementPainInfo: { level: 8, reason: "Directly over vertebrae, thin skin, nerve-rich area." }
    },
    "Shoulder Blade": {
      position: [-0.16, -0.23, -0.11],
      scale: 0.1,
      cameraAzimuth: 2.356194490192345,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.0,
      placementSizeLimits: { min: 3, max: 15, multiplier: 1.1 },
      placementPainInfo: { level: 5, reason: "Mostly muscle, bony edges can be sensitive." }
    },
    "Armpit / Underarm": {
      position: [-0.21, -0.26, 0.04],
      scale: 0.06,
      cameraAzimuth: -1.5707963267948966,
      cameraPolar: 1.2,
      cameraDistance: 0.7,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.7 },
      placementPainInfo: { level: 9, reason: "Extremely sensitive lymph node area, thin skin, high friction." }
    }
  },
  "Lower Torso": {
    "Upper Abdomen": {
      position: [0, -0.56, 0.13],
      scale: 0.14,
      cameraAzimuth: 0,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.1,
      placementSizeLimits: { min: 3, max: 16, multiplier: 1.2 },
      placementPainInfo: { level: 7, reason: "Can be sensitive, skin stretches." }
    },
    "Lower Abdomen": {
      position: [0, -0.784996281765264, 0.1],
      scale: 0.10999999999999999,
      cameraAzimuth: -0.014916108971557608,
      cameraPolar: 1.5315974741733347,
      cameraDistance: 1.399999999999991,
      placementSizeLimits: { min: 3, max: 16, multiplier: 1.2 },
      placementPainInfo: { level: 5, reason: "Often less sensitive than upper abdomen." }
    },
    "Lower Back": {
      position: [0, -0.7193502064261352, -0.15],
      scale: 0.28904505474780107,
      cameraAzimuth: 3.141592653589793,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 1.4,
      placementSizeLimits: { min: 3, max: 16, multiplier: 1.2 },
      placementPainInfo: { level: 6, reason: "Pain varies, can be sensitive near spine/hips." }
    },
    "Hip Front": {
      position: [-0.13930097186963092, -0.841407800600046, 0.06],
      scale: 0.09000000000000001,
      cameraAzimuth: -0.47414622671252465,
      cameraPolar: 1.4129268150149907,
      cameraDistance: 0.7297045148771955,
      placementSizeLimits: { min: 2, max: 8, multiplier: 1.2 },
      placementPainInfo: { level: 7, reason: "Often close to the hip bone." }
    },
    "Hip Side": {
      position: [-0.1721240095391953, -0.8342308382696104, -0.02],
      scale: 0.06000000000000002,
      cameraAzimuth: -0.48905537615796796,
      cameraPolar: 1.6113022138682365,
      cameraDistance: 1.022038041600536,
      placementSizeLimits: { min: 2, max: 8, multiplier: 1.3 },
      placementPainInfo: { level: 8, reason: "Directly over hip bone often." }
    },
    Tailbone: {
      position: [0, -0.8203343932711049, -0.1],
      scale: 0.07,
      cameraAzimuth: 2.7732206516140376,
      cameraPolar: 1.150019926301074,
      cameraDistance: 0.799999999999992,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.6 },
      placementPainInfo: { level: 9, reason: "Directly over bone, very sensitive." }
    },
    Buttock: {
      position: [0.10591034977946424, -0.9408657298184429, -0.15999999999999998],
      scale: 0.14999999999999997,
      cameraAzimuth: 2.7206187580163386,
      cameraPolar: 1.3752776151519825,
      cameraDistance: 0.9999999999999994,
      placementSizeLimits: { min: 4, max: 15, multiplier: 1.1 },
      placementPainInfo: { level: 6, reason: "Mostly fatty tissue, pain varies." }
    }
  },
  Arms: {
    Bicep: {
      position: [-0.29, -0.47, 0.05],
      scale: 0.1,
      cameraAzimuth: -0.5235987755982988,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
      placementPainInfo: { level: 4 }
    },
    Tricep: {
      position: [-0.29, -0.47, -0.08],
      scale: 0.1,
      cameraAzimuth: -2.356194490192345,
      cameraPolar: 1.5707963267948966,
      cameraDistance: 0.9,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.0 },
      placementPainInfo: { level: 4 }
    },
    Deltoid: {
      position: [-0.2434161602174525, -0.3911198297304921, -0.07930097186963092],
      scale: 0.15000000000000002,
      cameraAzimuth: -0.8867816565273788,
      cameraPolar: 1.3622430566983357,
      cameraDistance: 1.696023584812653,
      placementSizeLimits: { min: 3, max: 10, multiplier: 1.1 },
      placementPainInfo: { level: 4 }
    },
    "Quarter Sleeve": {
      position: [-0.3090622355565813, -0.48958894273918485, -0.030066415365284538],
      scale: 0.1217788547837013,
      cameraAzimuth: -0.2473938163988431,
      cameraPolar: 1.361856931984547,
      cameraDistance: 1.999999999999995,
      placementSizeLimits: { min: 4, max: 12, multiplier: 1.2 },
      placementPainInfo: { level: 4, reason: "Mostly deltoid/outer bicep area." }
    },
    "Half Sleeve": {
      position: [-0.325, -0.44, -0.01],
      scale: 0.21345359899479446,
      cameraAzimuth: -0.44846661794400705,
      cameraPolar: 1.1437360096844063,
      cameraDistance: 1.298040874939098,
      placementSizeLimits: { min: 50, max: 100, multiplier: 1.3 },
      placementPainInfo: { level: 4, reason: "Mainly covers lower pain areas like bicep/deltoid." }
    },
    Elbow: {
      position: [-0.4111198297304921, -0.646527168756571, -0.08],
      scale: 0.07,
      cameraAzimuth: -2.277012484095214,
      cameraPolar: 1.3684717809265368,
      cameraDistance: 1.8604597516229464,
      placementSizeLimits: { min: 2, max: 6, multiplier: 1.4 },
      placementPainInfo: { level: 8, reason: "Directly over bone, thin skin, folds often." }
    },
    "Elbow Ditch": {
      position: [-0.38, -0.64, 0.0027566223042798654],
      scale: 0.06,
      cameraAzimuth: -0.38085799124988856,
      cameraPolar: 1.3579144225873843,
      cameraDistance: 1.0041118942853549,
      placementSizeLimits: { min: 1, max: 4, multiplier: 1.7 },
      placementPainInfo: { level: 9, reason: "Very sensitive skin, nerve endings, folds." }
    },
    "Back Forearm": {
      position: [-0.3, -0.55, -0.15],
      scale: 0.14,
      cameraAzimuth: -2.2952498901343423,
      cameraPolar: 1.5471168308962344,
      cameraDistance: 2.069927717943239,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.1 },
      placementPainInfo: { level: 4 }
    },
    "Inner Forearm": {
      position: [-0.287, -0.593, -0.019],
      scale: 0.1153455394004667,
      cameraAzimuth: 0.6,
      cameraPolar: 1.7,
      cameraDistance: 1,
      placementSizeLimits: { min: 2, max: 10, multiplier: 1 },
      placementPainInfo: { level: 4 }
    },
    "Outer Forearm": {
      position: [-0.473, -0.736, 0],
      scale: 0.16,
      cameraAzimuth: -0.5932904597143365,
      cameraPolar: 1.2704732958447933,
      cameraDistance: 1.7575634023129976,
      placementSizeLimits: { min: 2, max: 12, multiplier: 1 },
      placementPainInfo: { level: 3 }
    },
    Wrist: {
      position: [-0.493, -0.805, 0.023],
      scale: 0.1,
      cameraAzimuth: -0.7172345434609471,
      cameraPolar: 1.0902484975441875,
      cameraDistance: 1.817663090363773,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.2 },
      placementPainInfo: { level: 7, reason: "Thin skin, close to bones and tendons." }
    },
    "Wrist Crease": {
      position: [-0.4567659050696209, -0.82, 0.01],
      scale: 0.05744570095135523,
      cameraAzimuth: 0.5237259692553915,
      cameraPolar: 1.5181557220688222,
      cameraDistance: 0.7999999999999995,
      placementSizeLimits: { min: 0.5, max: 3, multiplier: 1.6 },
      placementPainInfo: { level: 8, reason: "Very thin skin, high movement area." }
    },
    "Full Sleeve": {
      position: [-0.41, -0.59, -0.06288945303484894],
      scale: 0.1893286663076647,
      cameraAzimuth: -0.6818199308042318,
      cameraPolar: 1.193389824788707,
      cameraDistance: 1.494979100956484,
      placementSizeLimits: { min: 100, max: 200, multiplier: 1.5 },
      placementPainInfo: { level: 6, reason: "Covers varying pain levels (elbow/ditch high, bicep/forearm moderate)." }
    }
  },
  Hands: {
    "Hand Top": {
      position: [-0.5535430646320368, -0.8716126471291419, 0.025663520450404355],
      scale: 0.056292953123397264,
      cameraAzimuth: -0.49613000219910264,
      cameraPolar: 1.2897009973892481,
      cameraDistance: 0.5999999999999996,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.6 },
      placementPainInfo: { level: 8, reason: "Thin skin, many bones and nerve endings." }
    },
    Knuckles: {
      position: [-0.5814384925317158, -0.8755948502684068, 0.027587239265938413],
      scale: 0.03,
      cameraAzimuth: -0.7610039972410667,
      cameraPolar: 1.0760223873043793,
      cameraDistance: 0.5,
      placementSizeLimits: { min: 0.5, max: 2.5, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: "Directly over bone, thin skin, high movement." }
    },
    Fingers: {
      position: [-0.5798030567237666, -0.9299999999999999, 0.04],
      scale: 0.04,
      cameraAzimuth: -0.3692321451910787,
      cameraPolar: 1.2265819744461894,
      cameraDistance: 0.5,
      placementSizeLimits: { min: 0.5, max: 2, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: "Very thin skin, bones, many nerve endings, high usage." }
    },
    "Finger Side": {
      position: [-0.5541552979792799, -0.9208657298184428, 0.0674387116627346],
      scale: 0.03,
      cameraAzimuth: -0.28729621722360443,
      cameraPolar: 1.558968756743131,
      cameraDistance: 0.5999999999999994,
      placementSizeLimits: { min: 0.5, max: 1.5, multiplier: 1.9 },
      placementPainInfo: { level: 9, reason: "Thin skin, constant friction." }
    },
    Palm: {
      position: [-0.55, -0.88, -0.02],
      scale: 0.06,
      cameraAzimuth: 0.8,
      cameraPolar: 1.4,
      cameraDistance: 0.55,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: "Extremely sensitive, many nerve endings, ink fades faster due to skin renewal." }
    },
    Thumb: {
      position: [-0.5177433582931585, -0.9044537901323213, 0.09102677197661262],
      scale: 0.04,
      cameraAzimuth: -0.2533109285056402,
      cameraPolar: 1.231004555861638,
      cameraDistance: 0.653749999999962,
      placementSizeLimits: { min: 0.5, max: 2.5, multiplier: 1.7 },
      placementPainInfo: { level: 8, reason: "Bony, thin skin, nerve endings." }
    }
  },
  Legs: {
    "Thigh Front": {
      position: [-0.12026874551236011, -1.1542209457380246, 0.018202892604369542],
      scale: 0.10866960713919377,
      cameraAzimuth: -0.0037025856689594044,
      cameraPolar: 1.552359329305573,
      cameraDistance: 1.484210526315787,
      placementSizeLimits: { min: 4, max: 20, multiplier: 1 },
      placementPainInfo: { level: 4 }
    },
    "Outer Thigh": {
      position: [-0.20232844394296823, -1.121397066365781, -0.07103292645399506],
      scale: 0.13545286696071393,
      cameraAzimuth: -0.4314972867631766,
      cameraPolar: 1.5528106624602576,
      cameraDistance: 1.5000000000000002,
      placementSizeLimits: { min: 4, max: 20, multiplier: 1 },
      placementPainInfo: { level: 3, reason: "Generally low pain." }
    },
    Hamstring: {
      position: [-0.12026874551236011, -1.1542209457380246, -0.15309262488460362],
      scale: 0.1483198276746333,
      cameraAzimuth: 3.0296837204387863,
      cameraPolar: 1.5165289297620894,
      cameraDistance: 1.6000000000000008,
      placementSizeLimits: { min: 4, max: 18, multiplier: 1.1 },
      placementPainInfo: { level: 5, reason: "Large muscle group, can be sensitive." }
    },
    "Inner Thigh": {
      position: [-0.054620986767873525, -1.170632885424146, -0.07103292645399506],
      scale: 0.13062775669299415,
      cameraAzimuth: 0.6274486197883806,
      cameraPolar: 1.6313787584349257,
      cameraDistance: 1.399999999999996,
      placementSizeLimits: { min: 3, max: 12, multiplier: 1.4 },
      placementPainInfo: { level: 7, reason: "Sensitive skin, high friction area." }
    },
    "Upper Inner Thigh": {
      position: [-0.10900717102324765, -0.996127943788147, 0.052559975475656225],
      scale: 0.09202687455123602,
      cameraAzimuth: -0.084692039054511,
      cameraPolar: 1.3381441325843992,
      cameraDistance: 0.8000000000000083,
      placementSizeLimits: { min: 2, max: 8, multiplier: 1.6 },
      placementPainInfo: { level: 8, reason: "Very sensitive skin, high friction." }
    },
    "Knee Cap": {
      position: [-0.15668068519848208, -1.416811980715971, -0.03820904708175199],
      scale: 0.10167709508667554,
      cameraAzimuth: 0.07215642789051159,
      cameraPolar: 1.4269378924205895,
      cameraDistance: 1.299999999999998,
      placementSizeLimits: { min: 2, max: 8, multiplier: 1.4 },
      placementPainInfo: { level: 8, reason: "Directly over bone, tendons, skin folds." }
    },
    "Knee Ditch": {
      position: [-0.1366806851984821, -1.3675761616576059, -0.12026874551236011],
      scale: 0.09524361472971586,
      cameraAzimuth: -3.021535403452228,
      cameraPolar: 1.2406291335167108,
      cameraDistance: 1.2999999999999456,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: "Very sensitive, thin skin, folds, nerves." }
    },
    Shin: {
      position: [-0.18591650425684714, -1.6301671966355524, -0.07103292645399506],
      scale: 0.10363524464047594,
      cameraAzimuth: -0.04633275486073978,
      cameraPolar: 1.5315672058025458,
      cameraDistance: 1.5,
      placementSizeLimits: { min: 3, max: 14, multiplier: 1.3 },
      placementPainInfo: { level: 7, reason: "Thin skin directly over the tibia bone." }
    },
    Calf: {
      position: [-0.18591650425684714, -1.548107498204944, -0.16],
      scale: 0.10999999999999999,
      cameraAzimuth: -2.7274517525882462,
      cameraPolar: 1.3045399142128415,
      cameraDistance: 1.499999999999998,
      placementSizeLimits: { min: 3, max: 14, multiplier: 1.1 },
      placementPainInfo: { level: 5 }
    },
    "Full Leg": {
      position: [-0.16686392511468492, -1.2759880559661791, -0.07003730466502205],
      scale: 0.3229326084726638,
      cameraAzimuth: -0.1556394524153168,
      cameraPolar: 1.4196110842094658,
      cameraDistance: 1.4999999999999876,
      placementSizeLimits: { min: 100, max: 200, multiplier: 1.6 },
      placementPainInfo: { level: 6, reason: "Covers high and low pain areas." }
    },
    "Half Leg": {
      position: [-0.17891735941350964, -1.614332281118673, -0.12193596722181364],
      scale: 0.16209559954867164,
      cameraAzimuth: -0.34694268506456594,
      cameraPolar: 1.471313194809976,
      cameraDistance: 1.499999999999915,
      placementSizeLimits: { min: 50, max: 100, multiplier: 1.4 },
      placementPainInfo: { level: 6, reason: "Covers shin (high pain) and calf (moderate)." }
    }
  },
  "Feet & Ankles": {
    "Ankle Front": {
      position: [-0.16591650425684715, -1.803522412555134, -0.08744486614011704],
      scale: 0.07,
      cameraAzimuth: -0.7696187064121561,
      cameraPolar: 1.2602138204618807,
      cameraDistance: 0.9999999999999701,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.3 },
      placementPainInfo: { level: 8, reason: "Thin skin, close to bones and tendons." }
    },
    "Inner Ankle": {
      position: [-0.15309262488460362, -1.8106985331828906, -0.11309262488460363],
      scale: 0.05,
      cameraAzimuth: 0.7205573362187079,
      cameraPolar: 1.1369261824499055,
      cameraDistance: 0.9999999999999765,
      placementSizeLimits: { min: 1, max: 3, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: "Directly over ankle bone, thin skin." }
    },
    "Outer Ankle": {
      position: [-0.19840714716208957, -1.8339402949991341, -0.1213052376597757],
      scale: 0.060000000000000005,
      cameraAzimuth: -0.992777271266516,
      cameraPolar: 1.1330356830298198,
      cameraDistance: 1.0000000000000058,
      placementSizeLimits: { min: 1, max: 3, multiplier: 1.5 },
      placementPainInfo: { level: 9, reason: "Directly over ankle bone, thin skin." }
    },
    "Foot Top": {
      position: [-0.18437706614165025, -1.853408659336856, -0.03314215737179746],
      scale: 0.05,
      cameraAzimuth: -0.10525600053294015,
      cameraPolar: 1.0249216027083723,
      cameraDistance: 0.6000000000000036,
      placementSizeLimits: { min: 1, max: 6, multiplier: 1.6 },
      placementPainInfo: { level: 8, reason: "Thin skin, many bones and tendons." }
    },
    "Foot Side": {
      position: [-0.20823473372119025, -1.8774276781849915, -0.05895458531701246],
      scale: 0.07,
      cameraAzimuth: -0.4901127400063154,
      cameraPolar: 1.1676965003470179,
      cameraDistance: 0.6000000000000034,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.5 },
      placementPainInfo: { level: 7, reason: "Can be bony, thin skin." }
    },
    "Foot Arch": {
      position: [-0.13309262488460363, -1.8799343522412555, -0.051032926453995056],
      scale: 0.060000000000000005,
      cameraAzimuth: 1.3485632233360163,
      cameraPolar: 1.3241717326337286,
      cameraDistance: 0.5361460560920751,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.6 },
      placementPainInfo: { level: 8, reason: "Sensitive skin, can tickle/hurt intensely." }
    },
    Heel: {
      position: [-0.16950456457072516, -1.8327582316134987, -0.14],
      scale: 0.062376654015796486,
      cameraAzimuth: -2.2610322489552677,
      cameraPolar: 1.3019623200034927,
      cameraDistance: 0.7887755029471025,
      placementSizeLimits: { min: 1, max: 5, multiplier: 1.2 },
      placementPainInfo: { level: 6, reason: "Thicker skin, but can be sensitive." }
    },
    Toes: {
      position: [-0.16950456457072516, -1.8927582316134988, 0.0674387116627346],
      scale: 0.04,
      cameraAzimuth: -0.25820746460012706,
      cameraPolar: 1.2792663070114167,
      cameraDistance: 0.7831753899985433,
      placementSizeLimits: { min: 0.5, max: 1.5, multiplier: 1.8 },
      placementPainInfo: { level: 9, reason: "Very thin skin, bones, many nerve endings." }
    }
  },
};
