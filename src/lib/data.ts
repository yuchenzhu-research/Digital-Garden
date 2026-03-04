import { Document } from "@/lib/types";

export const documents: Document[] = [
    {
        id: "1",
        title: "Principia Mathematica",
        category: "Technology",
        description: "The foundational text on the laws of motion and universal gravitation.",
        imageUrl: "/archive/newton.jpg",
        year: "1687",
        author: "Isaac Newton",
        focalY: 15,
        imageScale: 1.1,
        focalPoint: "50% 20%",
        academicContext: "Newton's work replaced the indeterminate qualitative explanations of physics with a quantitative, mathematical approach. By unifying terrestrial and celestial mechanics under a single set of laws, he laid the framework for the Enlightenment's view of a predictable, 'clockwork' universe. This document is the cornerstone of classical physics.",
        tags: ["Classical Mechanics", "Calculus", "Enlightenment", "Alchemy"],
        longDescription: "Philosophiae Naturalis Principia Mathematica (Mathematical Principles of Natural Philosophy) states Newton's laws of motion, forming the foundation of classical mechanics; Newton's law of universal gravitation; and a derivation of Kepler's laws of planetary motion. It is considered one of the most important works in the history of science.",
        concepts: [
            { title: "Universal Gravitation", description: "Every point mass attracts every other point mass by a force acting along the line intersecting the two points." },
            { title: "Laws of Motion", description: "Three physical laws that, together, laid the foundation for classical mechanics." },
            { title: "Calculus", description: "The mathematical study of continuous change, developed by Newton (and Leibniz) to describe these physical laws." }
        ],
        resources: [
            { title: "Cambridge Digital Library: Newton's Papers", type: "External Link", url: "https://cudl.lib.cam.ac.uk/collections/newtonpapers" },
            { title: "The Royal Society Archive", type: "Archive Source", url: "https://royalsociety.org/collections/archives-and-manuscripts/" }
        ]
    },
    {
        id: "2",
        title: "The Vitruvian Man",
        category: "Art",
        description: "A study of the proportions of the human body, linking art and science.",
        imageUrl: "/archive/davinci.jpg",
        year: "1490",
        author: "Leonardo da Vinci",
        focalY: 20,
        imageScale: 1.2,
        focalPoint: "90% 35%",
        academicContext: "Da Vinci's illustration perfectly embodies the Renaissance concept of 'Man as the measure of all things.' Beyond its artistic merit, it reflects an early anatomical rigor and a philosophical belief in the divine symmetry of nature, bridging the gap between artistic expression and scientific observation.",
        tags: ["Polymath", "Anatomy", "Engineering", "Golden Ratio"],
        longDescription: "The Vitruvian Man (Italian: Le proporzioni del corpo umano secondo Vitruvio), is a drawing made by the Italian polymath Leonardo da Vinci in about 1490. It is accompanied by notes based on the work of the architect Vitruvius.",
        concepts: [
            { title: "Anthropometry", description: "The scientific study of the measurements and proportions of the human body." },
            { title: "Golden Ratio", description: "A mathematical ratio commonly found in nature and design, often associated with beauty and harmony." },
            { title: "Renaissance Humanism", description: "An intellectual movement that focused on human potential and achievements." }
        ],
        resources: [
            { title: "Gallerie dell'Accademia, Venice", type: "Museum Collection", url: "https://www.gallerieaccademia.it/en/study-proportions-human-body-known-vitruvian-man" },
            { title: "Leonardo's Notebooks", type: "Primary Source", url: "https://www.bl.uk/collection-items/leonardo-da-vinci-notebook" }
        ]
    },
    {
        id: "3",
        title: "Dialogue Concerning World Systems",
        category: "Philosophy",
        description: "Comparing the Copernican system with the traditional Ptolemaic system.",
        imageUrl: "/archive/galileo.jpg",
        year: "1632",
        author: "Galileo Galilei",
        focalY: 20,
        imageScale: 1.15,
        focalPoint: "50% 40%",
        academicContext: "This text famously led to Galileo's trial for heresy. It is a masterpiece of scientific persuasion, using dialogue to dismantle the Earth-centric model. It represents the historic transition from dogma-based natural philosophy to empirical, observation-led science.",
        tags: ["Observational Astronomy", "Kinematics", "Heliocentrism", "Inquisition"],
        longDescription: "Dialogue Concerning the Two Chief World Systems (Dialogo sopra i due massimi sistemi del mondo) compares the Copernican system with the traditional Ptolemaic system. It was published in Italian and dedicated to the Grand Duke of Tuscany.",
        concepts: [
            { title: "Heliocentrism", description: "The astronomical model in which the Earth and planets revolve around the Sun." },
            { title: "Relativity", description: "Galilean relativity states that the laws of motion are the same in all inertial frames." },
            { title: "Empiricism", description: "The theory that all knowledge is derived from sense-experience." }
        ],
        resources: [
            { title: "Vatican Apostolic Archive", type: "Historical Record", url: "https://www.archivioapostolicovaticano.va/" },
            { title: "Museo Galileo, Florence", type: "Museum", url: "https://www.museogalileo.it/en/" }
        ]
    },
    {
        id: "4",
        title: "Elements of Geometry",
        category: "Technology",
        description: "A mathematical treatise consisting of 13 books attributed to Euclid.",
        imageUrl: "/archive/euclid.jpg",
        year: "300 BC",
        author: "Euclid",
        focalY: 10,
        imageScale: 1.1,
        focalPoint: "50% 15%",
        academicContext: "Often cited as the most successful and influential textbook ever written. Euclid established the axiomatic method, proving complex theorems from simple, self-evident assumptions. For over two millennia, it defined the logical structure of human reason and mathematical thought.",
        tags: ["Geometry", "Axiomatic Logic", "Alexandria", "Mathematics"],
        longDescription: "Euclid's Elements is a mathematical and geometric treatise consisting of 13 books written in Alexandria, Ptolemaic Egypt, c. 300 BC. It is a collection of definitions, postulates, propositions (theorems and constructions), and mathematical proofs of the propositions.",
        concepts: [
            { title: "Axiomatic System", description: "A system of logic based on a set of axioms or postulates from which theorems are derived." },
            { title: "Euclidean Geometry", description: "The study of plane and solid figures on the basis of axioms and theorems employed by Euclid." },
            { title: "Mathematical Rigor", description: "The practice of creating and verifying mathematical proofs with strict adherence to logic." }
        ],
        resources: [
            { title: "The Euclid Project", type: "Digital Archive", url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0086" },
            { title: "Clay Mathematics Institute", type: "Research Center", url: "https://www.claymath.org/library/historical/euclid/" }
        ]
    },
    {
        id: "5",
        title: "The Republic",
        category: "Philosophy",
        description: "A Socratic dialogue concerning justice and the order of a city-state.",
        imageUrl: "/archive/plato.jpg",
        year: "375 BC",
        author: "Plato",
        focalY: 25,
        imageScale: 1.2,
        focalPoint: "50% 15%",
        academicContext: "Plato's Republic is the definitive text on political philosophy. Through the allegory of the cave and the theory of forms, it explores the nature of truth, the definition of justice, and the ideal structure of society, influencing every major political theorist in Western history.",
        tags: ["Idealism", "Dialectic", "Political Philosophy", "Athens"],
        longDescription: "The Republic (Greek: Politeia) is a Socratic dialogue, authored by Plato around 375 BC, concerning justice (dikaiosyne), the order and character of the just city-state, and the just man.",
        concepts: [
            { title: "Theory of Forms", description: "The non-physical essences of all things, of which objects and matter in the physical world are merely imitations." },
            { title: "Allegory of the Cave", description: "A presentation of the distinction between the physical world of appearances and the intellectual world of truth." },
            { title: "Philosopher King", description: "A ruler who possesses a love of knowledge, as well as intelligence, reliability, and a willingness to live a simple life." }
        ],
        resources: [
            { title: "Perseus Digital Library", type: "Text Archive", url: "http://www.perseus.tufts.edu/hopper/text?doc=Plat.+Rep.+1" },
            { title: "Stanford Encyclopedia of Philosophy", type: "Academic Resource", url: "https://plato.stanford.edu/entries/plato/" }
        ]
    },
    {
        id: "6",
        title: "De Revolutionibus",
        category: "Technology",
        description: "On the Revolutions of the Heavenly Spheres, placing the Sun at the center.",
        imageUrl: "/archive/copernicus.jpg",
        year: "1543",
        author: "Nicolaus Copernicus",
        focalY: 15,
        imageScale: 1.15,
        focalPoint: "75% 35%",
        academicContext: "Published on his deathbed, Copernicus's work initiated the 'Copernican Revolution.' By mathematically demonstrating the heliocentric model, he challenged both the religious and scientific establishment, fundamentally altering humanity's perceived place in the cosmos.",
        tags: ["Cosmology", "Paradigm Shift", "Renaissance", "Astronomy"],
        longDescription: "De revolutionibus orbium coelestium (On the Revolutions of the Heavenly Spheres) is the seminal work on the heliocentric theory of the astronomer Nicolaus Copernicus (1473–1543) of the Polish Renaissance.",
        concepts: [
            { title: "Copernican Revolution", description: "The paradigm shift from the Ptolemaic model of the heavens, which described the cosmos as having Earth stationary at the center of the universe, to the heliocentric model with the Sun at the center of the Solar System." },
            { title: "Orbital Mechanics", description: "The application of ballistics and celestial mechanics to the practical problems concerning the motion of rockets and other spacecraft." },
            { title: "Renaissance Science", description: "The period of scientific history during the Renaissance." }
        ],
        resources: [
            { title: "Copernicus Center", type: "Research Institute", url: "https://www.copernicus.eu/en" },
            { title: "NASA History", type: "Government Archive", url: "https://www.nasa.gov/history/" }
        ]
    },
];
