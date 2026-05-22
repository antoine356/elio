export const MARIE_PIERRE_PROFILE = {
  identity: {
    prenom: "Marie-Pierre",
    nom: "Riou",
    age: 58,
    ville: "Gentilly",
    adresse: "11 rue du Moulin de la Roche, Gentilly (RDC, ~80m², deux terrasses nord et sud)",
    profession: "Directrice d'école primaire (école Buffalo, Gentilly)",
    situationFamiliale: "Vit seule depuis 11 ans"
  },

  famille: {
    fils: [
      {
        prenom: "Antoine",
        note: "A créé Elio pour elle. Attentionné, proche."
      },
      {
        prenom: "Hugo",
        age: 26,
        note: "Vit à Roscoff dans la maison familiale. Travaille en restauration. Compagne : Axelle. Préparent une saison estivale aux Saisies."
      }
    ],
    mere: {
      prenom: "Nicole",
      ville: "Gonesse",
      note: "Marie-Pierre lui rend visite un week-end sur deux. Jouent au Rummikub ensemble. Relation proche mais ambivalente, Nicole est généreuse mais colérique et nerveuse."
    },
    frere: {
      prenom: "Ronan",
      age: 54,
      ville: "Saint-Avé, Morbihan",
      conjoint: "Samia",
      enfants: [
        { prenom: "Jihane", age: 25, note: "Études de médecine à Paris" },
        { prenom: "Louna", age: 22, note: "Contrôleuse aérienne, habite Athis-Mons" },
        { prenom: "Sami", age: 18, note: "DUT data science en Bretagne" }
      ]
    },
    perePaternel: {
      prenom: "Pierre",
      note: "Décédé. Maison familiale à Roscoff."
    }
  },

  amies: [
    { prenom: "Véro", note: "Amie proche, part en montagne avec elle chaque été. A une fille, Armelle." },
    { prenom: "Christelle", note: "Amie proche, randonnées estivales." },
    { prenom: "Sophie", note: "Amie proche, remise d'un cancer. Vit près de Dinard avec Laurent. Ont adopté Héloïse il y a 3 ans." },
    { prenom: "Aurélia", note: "Amie du groupe, part parfois en montagne." },
    { prenom: "Mélanie", note: "Amie, a un cocker noir nommé Watson." }
  ],

  animaux: [
    { prenom: "Gary", espece: "chat", note: "Frère de Mina, ~3 ans. Plutôt solitaire mais câlin parfois. Sort." },
    { prenom: "Mina", espece: "chat", note: "Soeur de Gary, ~3 ans. Très câline. Sort." },
    { note: "Jessie, cocker anglais golden, morte en 2022 à 8 ans d'un cancer. Très aimée." }
  ],

  sante: {
    note: "Surveille sa tension, sujette à l'hypertension. Mère diabétique. Sensibilité aux antécédents familiaux. Ne jamais aborder directement ces sujets, informer subtilement les suggestions."
  },

  rythme: {
    leverSemaine: "Entre 7h et 8h",
    finTravail: "Après 19h",
    energieSoir: "Souvent fatiguée le soir",
    weekend: "Footing, repos, lecture, violon, parfois expos ou sorties avec amies"
  },

  passions: {
    footing: "3 fois par semaine, plutôt le soir. Objectif maintien de forme.",
    violon: "3ème année avec prof particulière. En avait fait petite, reprise il y a 2-3 ans. Sa mère Nicole lui en a offert un récemment.",
    lecture: "Occasionnelle par manque de temps ou d'énergie. Aime les librairies et les conseils de libraires. Goûts : romans, polars, thrillers, classiques.",
    randonnee: "Chaque été dans les Alpes avec Véro, Christelle, Sophie, Aurélia. Cet été : Pyrénées.",
    cinema: "Aime le cinéma. Comédies françaises, thrillers. Regarde aussi ce qui passe à la télé ou en VOD.",
    musique: "Utilise Spotify, pas d'artistes fétiches, ouverte à découvrir genres et playlists.",
    cuisine: "Simple au quotidien. Réduit la consommation de viande. Aime faire des gâteaux quand elle reçoit, notamment au chocolat. Courses à l'Intermarché en face de chez elle.",
    voyages: "Roscoff, Saint-Avé, montagne l'été. Ouverte à de nouvelles destinations."
  },

  personnalite: {
    traits: "Introvertie. Garde ses émotions pour elle. Manque de confiance en elle. Aime profondément ses fils. Sensible sans le montrer. Femme de routine et de liens forts.",
    rapportTech: "Google Pixel 9A (offert par Antoine et Hugo). À l'aise sur l'essentiel, pas passionnée de tech.",
    ouverture: "Ouverte aux découvertes si proposées avec douceur et pertinence."
  },

  travail: {
    note: "Situation difficile à l'école Buffalo. Mauvaise ambiance avec collègues, plusieurs réunions avec l'inspectrice. Résultat d'un possible changement d'école attendu début juin. S'entend bien avec Patrick (gardien) et Marie (cantine). Ne jamais aborder ce sujet directement."
  },

  aEviter: [
    "Mentionner la vie sentimentale passée ou l'absence de compagnon",
    "Évoquer l'abandon ou la solitude directement",
    "Aborder la santé de façon alarmiste",
    "Mentionner la situation professionnelle sauf si elle en parle"
  ]
}
