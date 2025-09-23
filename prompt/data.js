export const promptCases = [
  {
    id: 1,
    title: "Illustration to Figure",
    author: "@ZHO_ZHO_ZHO",
    source: "https://x.com/ZHO_ZHO_ZHO/status/1958539464994959715",
    inputRequirement: "Upload a reference illustration you want turned into a figure.",
    prompt: "turn this photo into a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible",
    images: {
      inputs: ["./assets/case1/input0.jpg"],
      outputs: ["./assets/case1/output0.jpg"]
    }
  },
  {
    id: 2,
    title: "Generate Ground View from Map Arrow",
    author: "@tokumin",
    source: "https://x.com/tokumin/status/1960583251460022626",
    inputRequirement: "Upload a Google Maps screenshot that includes a red arrow.",
    prompt: "draw what the red arrow sees / draw the real world view from the red circle in the direction of the arrow.",
    images: {
      inputs: [
        "./assets/case2/input.jpg",
        "./assets/case2/input2.jpg",
        "./assets/case2/input3.jpg"
      ],
      outputs: [
        "./assets/case2/output.jpg",
        "./assets/case2/output2.jpg",
        "./assets/case2/output3.jpg"
      ]
    }
  },
  {
    id: 3,
    title: "Real World AR Information",
    author: "@bilawalsidhu",
    source: "https://x.com/bilawalsidhu/status/1960529167742853378",
    inputRequirement: "Upload a reference photo that contains the point of interest you want annotated.",
    prompt: "you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.",
    note: "Replace [point of interest] with the landmark or subject you want called out.",
    images: {
      inputs: [],
      outputs: ["./assets/case3/output.jpg"]
    }
  },
  {
    id: 4,
    title: "Extract 3D Buildings / Make Isometric Models",
    author: "@Zieeett",
    source: "https://x.com/Zieeett/status/1960420874806247762",
    inputRequirement: "Upload a photo of the object or structure you want isolated.",
    prompt: "Make Image Daytime and Isometric [Building Only]",
    note: "Swap [Building Only] for other focus objects like vehicles or people.",
    images: {
      inputs: [
        "./assets/case4/input.jpg",
        "./assets/case4/input2.jpg"
      ],
      outputs: [
        "./assets/case4/output.jpg",
        "./assets/case4/output2.jpg"
      ]
    }
  },
  {
    id: 5,
    title: "Photos of Yourself in Different Eras",
    author: "@AmirMushich",
    source: "https://x.com/AmirMushich/status/1960810850224091439",
    inputRequirement: "Upload a portrait photo of the person you want to restyle.",
    prompt: "Change the characer's style to [1970]'s classical [male] style\n\nAdd [long curly] hair, \n[long mustache], \nchange the background to the iconic [californian summer landscape]\n\nDon't change the character's face",
    note: "Swap the bracketed details for your own era, gender, and styling cues.",
    images: {
      inputs: ["./assets/case5/input.jpg"],
      outputs: ["./assets/case5/output.jpg"]
    }
  },
  {
    id: 6,
    title: "Multi-Reference Image Generation",
    author: "@MrDavids1",
    source: "https://x.com/MrDavids1/status/1960783672665128970",
    inputRequirement: "Upload several reference images covering the outfit, props, and companions you want included.",
    prompt: "A model is posing and leaning against a pink bmw. She is wearing the following items, the scene is against a light grey background. The green alien is a keychain and it's attached to the pink handbag. The model also has a pink parrot on her shoulder. There is a pug sitting next to her wearing a pink collar and gold headphones.",
    note: "Detailed descriptions plus multiple reference photos help Nano Banana keep everything consistent.",
    images: {
      inputs: ["./assets/case6/input.jpg"],
      outputs: ["./assets/case6/output.jpg"]
    }
  }
];
