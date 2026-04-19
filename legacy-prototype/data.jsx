// Shared simulation catalog data
const SIMS = [
  { id: 'pendulum', title: 'Simple Pendulum', subject: 'Physics', grade: 'Class 11', chapter: 'Oscillations', level: 'Intro', minutes: 12, concepts: ['Period', 'Gravity', 'Harmonic motion'], featured: true, new: false },
  { id: 'projectile', title: 'Projectile Motion', subject: 'Physics', grade: 'Class 11', chapter: 'Motion in a Plane', level: 'Core', minutes: 15, concepts: ['Trajectory', 'Vectors'], featured: false, new: true },
  { id: 'springs', title: 'Mass on a Spring', subject: 'Physics', grade: 'Class 11', chapter: 'Oscillations', level: 'Core', minutes: 10, concepts: ['Hookes Law', 'Oscillation'], featured: false, new: false },
  { id: 'circuit', title: 'Ohms Law Circuit', subject: 'Physics', grade: 'Class 10', chapter: 'Electricity', level: 'Intro', minutes: 9, concepts: ['Voltage', 'Resistance'], featured: false, new: false },
  { id: 'titration', title: 'Acid Base Titration', subject: 'Chemistry', grade: 'Class 11', chapter: 'Equilibrium', level: 'Core', minutes: 18, concepts: ['pH', 'Equivalence point'], featured: true, new: false },
  { id: 'gaslaw', title: 'Ideal Gas Laws', subject: 'Chemistry', grade: 'Class 11', chapter: 'States of Matter', level: 'Intro', minutes: 11, concepts: ['Pressure', 'Volume', 'Temperature'], featured: false, new: true },
  { id: 'reaction', title: 'Reaction Rates', subject: 'Chemistry', grade: 'Class 12', chapter: 'Chemical Kinetics', level: 'Advanced', minutes: 14, concepts: ['Kinetics', 'Catalysts'], featured: false, new: false },
  { id: 'punnett', title: 'Punnett Squares', subject: 'Biology', grade: 'Class 10', chapter: 'Heredity & Evolution', level: 'Intro', minutes: 8, concepts: ['Genetics', 'Inheritance'], featured: false, new: false },
  { id: 'osmosis', title: 'Osmosis & Diffusion', subject: 'Biology', grade: 'Class 11', chapter: 'Transport in Plants', level: 'Core', minutes: 12, concepts: ['Membranes', 'Gradients'], featured: true, new: false },
  { id: 'enzyme', title: 'Enzyme Kinetics', subject: 'Biology', grade: 'Class 12', chapter: 'Biomolecules', level: 'Advanced', minutes: 16, concepts: ['Catalysis', 'Substrate'], featured: false, new: true },
  { id: 'functions', title: 'Graphing Functions', subject: 'Math', grade: 'Class 10', chapter: 'Coordinate Geometry', level: 'Intro', minutes: 10, concepts: ['Linear', 'Quadratic', 'Trig'], featured: false, new: false },
  { id: 'calculus', title: 'Derivatives Visualised', subject: 'Math', grade: 'Class 12', chapter: 'Continuity & Differentiability', level: 'Advanced', minutes: 14, concepts: ['Slope', 'Tangents'], featured: true, new: false },
  { id: 'vectors', title: 'Vector Addition', subject: 'Math', grade: 'Class 11', chapter: 'Vector Algebra', level: 'Core', minutes: 9, concepts: ['Head-to-tail', 'Components'], featured: false, new: false },
];

window.SIMS = SIMS;
