import { seedBundle } from './dsl';

/** Matter, light, time and the physical universe. */
const { C, E, bundle } = seedBundle();

C('chemistry', 'Chemistry', 'chemistry', 4, 'What things are made of, and how they change',
  `Chemistry is the science of what things are made of and how they turn into other things. It grew out of
  [alchemy](alchemy) in the seventeenth and eighteenth centuries, as Robert Boyle and then Antoine Lavoisier
  insisted on careful [measurement](measurement). Lavoisier weighed what went into a reaction and what came
  out, and showed that mass is conserved. He also sat on the commission that created the
  [metric system](metric-system), and in 1794 he was guillotined during the
  [French Revolution](french-revolution). John Dalton’s [atomic theory](atomic-theory) explained why
  elements combine in fixed proportions, and Mendeleev’s [periodic table](periodic-table) put them in order.
  Underneath it all is [energy](energy). Whether a reaction happens at all depends on energy and
  [entropy](entropy).`);
E('chemistry', 'alchemy', 'historical', 'direct', 'factual', 0.95,
  'Chemistry developed from alchemical laboratory practice; figures like Boyle and even Newton practised both, and the word itself derives from “alchemy”.');
E('chemistry', 'measurement', 'conceptual', 'strong', 'factual', 0.9,
  'Lavoisier’s precise weighing of reactants and products established conservation of mass and made quantitative measurement central to chemistry.');
E('chemistry', 'metric-system', 'historical', 'strong', 'factual', 0.88,
  'Lavoisier served on the French Academy’s commission on weights and measures and took part in the work to define the kilogram.');
E('chemistry', 'french-revolution', 'historical', 'strong', 'factual', 0.95,
  'Lavoisier, the founder of modern chemistry, was guillotined in 1794 as a former tax farmer during the Terror.');
E('chemistry', 'atomic-theory', 'conceptual', 'direct', 'factual', 0.97,
  'Dalton’s atomic theory (1803–08) explained the laws of definite and multiple proportions, giving chemistry its basic unit.');
E('chemistry', 'periodic-table', 'conceptual', 'direct', 'factual', 0.97,
  'The periodic table organises the chemical elements by atomic number and recurring chemical properties.');
E('chemistry', 'energy', 'physical', 'strong', 'factual', 0.9,
  'Chemical reactions release or absorb energy as bonds break and form; thermochemistry quantifies this.');
E('chemistry', 'entropy', 'physical', 'strong', 'factual', 0.88,
  'Whether a reaction proceeds spontaneously is governed by Gibbs free energy, which combines enthalpy and entropy.');

C('alchemy', 'Alchemy', 'chemistry', 2, 'The art of transformation',
  `Alchemy sought to transform matter, turning base metals into gold and perfecting the alchemist along the
  way. It flourished in Hellenistic Egypt, in the [Islamic world](islamic-golden-age) and in medieval and
  early modern Europe, and it developed real laboratory techniques: [distillation](distillation),
  sublimation, crystallisation. The word itself comes through Arabic, al-kīmiyā. Metals had planetary
  partners, and [silver](silver) belonged to the Moon. [Isaac Newton](newton) wrote more than a million
  words on alchemy. By the eighteenth century its practical side had become [chemistry](chemistry). Its
  dream of transmutation came true in an unexpected way: in 1901 Rutherford and Soddy found that
  [radioactive](radioactivity) elements transmute themselves.`);
E('alchemy', 'islamic-golden-age', 'historical', 'strong', 'factual', 0.85,
  'Arabic-writing scholars (the Jabirian corpus, al-Razi) systematised and extended Greek alchemy; Latin translations brought it to medieval Europe.');
E('alchemy', 'silver', 'cultural', 'direct', 'factual', 0.93,
  'Alchemy paired each of the seven known metals with a heavenly body; silver was associated with the Moon (Luna) and symbolised by a crescent.');
E('alchemy', 'newton', 'biographical', 'direct', 'factual', 0.95,
  'Newton’s surviving manuscripts contain an estimated million-plus words on alchemy; Keynes called him “the last of the magicians”.',
  ['keynes1946']);
E('alchemy', 'radioactivity', 'historical', 'strong', 'factual', 0.85,
  'Rutherford and Soddy showed in 1901–02 that radioactive decay transforms one element into another — genuine transmutation, though not the alchemists’ kind.');

C('atomic-theory', 'Atomic theory', 'chemistry', 3, 'The indivisible, divided',
  `The idea that matter is made of indivisible pieces goes back to Democritus, but as philosophy. John
  Dalton made it science between 1803 and 1808. Each element consists of identical atoms with a
  characteristic weight, and compounds form in whole-number ratios, and all of [chemistry](chemistry)
  followed. Many physicists still doubted atoms were real until [Einstein](einstein)’s 1905 analysis of
  Brownian motion, confirmed by Jean Perrin’s experiments, pinned down their size. Then atoms turned out
  to be divisible after all. [Radioactivity](radioactivity) and the electron revealed an inside, and
  explaining that inside took [quantum mechanics](quantum-mechanics). The rows of the
  [periodic table](periodic-table) turned out to trace how electrons fill quantum shells.`,
  { aliases: ['atoms', 'atom'] });
E('atomic-theory', 'einstein', 'biographical', 'strong', 'factual', 0.93,
  'Einstein’s 1905 theory of Brownian motion, confirmed experimentally by Perrin (1908), convinced most sceptics that atoms are real.');
E('atomic-theory', 'radioactivity', 'physical', 'strong', 'factual', 0.9,
  'Radioactivity showed atoms can emit particles and change identity, revealing internal structure and ending their “indivisibility”.');
E('atomic-theory', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.95,
  'The stability and structure of atoms cannot be explained classically; quantum mechanics was developed largely to explain atomic spectra and structure.');
E('atomic-theory', 'periodic-table', 'chemical', 'direct', 'factual', 0.95,
  'The periodic table orders elements by atomic number (protons per atom); its periodicity reflects atomic electron structure.');

C('periodic-table', 'Periodic table', 'chemistry', 3, 'A map with blanks left on purpose',
  `In 1869 Dmitri Mendeleev arranged the known elements by atomic weight and noticed that their chemical
  properties repeat at regular intervals. His boldest move was to leave gaps and predict elements no one
  had found. Gallium, scandium and germanium turned up by 1886, with properties close to his predictions,
  a famous case of a theory risking refutation and passing, the way [experimental science](experimental-science)
  says it should. Why the table works stayed a mystery until [quantum mechanics](quantum-mechanics)
  explained electron shells: the rows are a map of quantum numbers. [Marie Curie](curie) added two new
  entries, polonium and radium.`,
  { aliases: ['elements', 'mendeleev'] });
E('periodic-table', 'experimental-science', 'conceptual', 'strong', 'interpretive', 0.8,
  'Mendeleev’s confirmed predictions of gallium (1875), scandium (1879) and germanium (1886) are a classic example of a theory’s bold predictions being tested and borne out.');
E('periodic-table', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.95,
  'The structure of the periodic table follows from quantum mechanics: electron shells and orbitals determine chemical behaviour.');
E('periodic-table', 'curie', 'biographical', 'direct', 'factual', 0.97,
  'Marie and Pierre Curie discovered polonium and radium in 1898.');

C('silver', 'Silver', 'chemistry', 2, 'The Moon’s metal',
  `Silver conducts electricity and heat better than any other metal and reflects more light. Easy to work
  and rare enough to be precious, it was among the earliest metals used as [money](money). The first
  [coins](coins), struck in Lydia, were made of electrum, a natural alloy of gold and silver. In
  [alchemy](alchemy) silver belonged to the [Moon](moon), and its symbol was a crescent. Silver salts
  darken in light, which made [photography](photography) possible and kept it running on silver for a
  century and a half. Its chemical symbol, Ag, comes from the Latin argentum, which also gave Argentina
  its name.`);
E('silver', 'money', 'economic', 'direct', 'factual', 0.95,
  'Silver by weight served as money in Mesopotamia; silver coinage and silver standards dominated monetary history for millennia.');
E('silver', 'coins', 'economic', 'direct', 'factual', 0.95,
  'The earliest coins (Lydia, 7th century BCE) were electrum, a gold–silver alloy; silver later became the commonest coinage metal.');
E('silver', 'moon', 'cultural', 'subtle', 'factual', 0.88,
  'In alchemical and astrological tradition silver corresponded to the Moon and was written with a crescent symbol.');
E('silver', 'photography', 'chemical', 'direct', 'factual', 0.98,
  'Daguerreotypes used silver-coated plates, and film photography relied on light-sensitive silver halide crystals for ~150 years.');

C('photography', 'A photograph', 'technology', 2, 'Light that left a mark',
  `A photograph is light that left a mark. The [camera obscura](camera-obscura), a dark room with a small
  hole that projects an image, had been known for centuries. What was missing was chemistry to fix the
  image. Nicéphore Niépce made the oldest surviving camera photograph around 1826–27, and Louis Daguerre’s
  process was announced in [Paris](paris) in 1839. For 150 years photography ran on [silver](silver) salts.
  In 1896 Henri Becquerel found that uranium salts fogged photographic plates wrapped in black paper, and
  that was the discovery of [radioactivity](radioactivity). The camera also changed how people saw
  [light](light), and the first [Impressionist](impressionism) exhibition was held in a photographer’s
  studio. Governments noticed too. A photograph became the core of the [passport](passport).`,
  { wiki: 'Photography', aliases: ['photograph', 'photo', 'camera', 'photography'] });
E('photography', 'camera-obscura', 'technological', 'direct', 'factual', 0.97,
  'The photographic camera is a camera obscura with a light-sensitive surface in place of the viewing screen.');
E('photography', 'paris', 'historical', 'subtle', 'factual', 0.88,
  'The daguerreotype was announced to the French Academy of Sciences in Paris in 1839, and the French state released it “free to the world”.');
E('photography', 'radioactivity', 'historical', 'direct', 'factual', 0.97,
  'Becquerel discovered radioactivity in 1896 when uranium salts exposed photographic plates shielded from light.');
E('photography', 'light', 'physical', 'direct', 'factual', 0.97,
  'Photography records light: photons trigger chemical changes in silver halides or electrical signals in sensors.');
E('photography', 'impressionism', 'historical', 'strong', 'factual', 0.85,
  'The first Impressionist exhibition (1874) was held in the former studio of the photographer Nadar; how much photography shaped Impressionist vision is debated.');
E('photography', 'passport', 'technological', 'direct', 'factual', 0.92,
  'Photographs became standard on passports during and after WWI, tying the document to its holder’s face.');

C('camera-obscura', 'Camera obscura', 'technology', 1, 'The dark room that became the camera',
  `Latin for “dark room”: a darkened room or box with a small hole in one wall projects an upside-down
  image of the outside world onto the opposite wall. The Chinese philosopher Mozi and Aristotle both
  described the effect, and in eleventh-century Cairo Ibn al-Haytham analysed it as part of his
  [optics](optics). Astronomers used it to watch solar eclipses safely, an everyday tool of
  [astronomy](astronomy). The projected image obeys the [geometry](geometry) of central projection, the
  same geometry as linear perspective, so Renaissance artists took an interest. Put a light-sensitive
  surface where the image falls and you have [photography](photography).`);
E('camera-obscura', 'optics', 'physical', 'direct', 'factual', 0.95,
  'Ibn al-Haytham’s Book of Optics (c. 1011–21) analysed pinhole image formation as evidence that light travels in straight lines.');
E('camera-obscura', 'astronomy', 'technological', 'strong', 'factual', 0.85,
  'Pinhole projection was used from the Middle Ages to observe solar eclipses and sunspots without looking at the Sun.');
E('camera-obscura', 'geometry', 'mathematical', 'subtle', 'interpretive', 0.72,
  'A pinhole image is a central projection — the same geometry formalised in Renaissance linear perspective; artists’ use of optical aids is debated.');

C('optics', 'Optics', 'physics', 3, 'The science of seeing',
  `Optics studies how light is reflected, bent and focused. In Cairo, between about 1011 and 1021, Ibn
  al-Haytham wrote the Book of Optics. He argued that vision happens when light enters the eye, and he
  tested his ideas with experiments, including the [camera obscura](camera-obscura). It is one of the
  landmarks of [experimental science](experimental-science) and of the
  [Islamic Golden Age](islamic-golden-age). Ground lenses gave Europe spectacles in the thirteenth century,
  and then, around 1600, the telescope and the [microscope](microscope). [Galileo](galileo) turned the
  telescope on the sky. [Newton](newton) split white light with a prism and showed that colour is in the
  [light](light), not the glass.`);
E('optics', 'experimental-science', 'historical', 'strong', 'interpretive', 0.83,
  'Ibn al-Haytham insisted on testing optical claims by controlled experiment; many historians count him among the founders of experimental method.');
E('optics', 'islamic-golden-age', 'historical', 'direct', 'factual', 0.95,
  'Ibn al-Haytham (Alhazen) wrote his Book of Optics in Fatimid Cairo; its Latin translation shaped European optics for centuries.');
E('optics', 'microscope', 'technological', 'direct', 'factual', 0.97,
  'Microscopes are optical instruments; the compound microscope emerged from Dutch lens-making around 1600.');
E('optics', 'galileo', 'technological', 'strong', 'factual', 0.9,
  'Galileo built improved telescopes in 1609 after hearing of the Dutch invention, reaching about 20× magnification.');
E('optics', 'newton', 'biographical', 'direct', 'factual', 0.95,
  'Newton’s prism experiments (1660s) and his Opticks (1704) showed white light is a mixture of colours; he also built the first practical reflecting telescope.');
E('optics', 'light', 'physical', 'direct', 'factual', 0.98,
  'Optics is the branch of physics that studies the behaviour and properties of light.');

C('light', 'Light', 'physics', 4, 'Wave, particle, neither',
  `Is light a wave or a stream of particles? [Newton](newton) favoured particles. Around 1801 Thomas
  Young’s double-slit experiment showed interference, a property of waves. In the 1860s Maxwell identified
  light as electromagnetic waves. Then in 1905 Einstein brought particles back, as quanta, to explain the
  [photoelectric effect](photoelectric-effect). [Quantum mechanics](quantum-mechanics) settled the argument
  by refusing to choose. The bending and focusing of light is [optics](optics), and its speed is
  [the universe’s limit](speed-of-light). Light also has a cultural history. Medieval builders designed
  [Gothic cathedrals](gothic-cathedral) to flood their interiors with coloured light, and the
  [Impressionists](impressionism) tried to paint light itself.`,
  { aliases: ['photons', 'photon'] });
E('light', 'newton', 'biographical', 'strong', 'factual', 0.9,
  'Newton’s Opticks (1704) advanced a corpuscular (particle) theory of light alongside his experiments on colour.');
E('light', 'photoelectric-effect', 'physical', 'direct', 'factual', 0.97,
  'The photoelectric effect is the emission of electrons when light hits a material; explaining it required light quanta (photons).');
E('light', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.95,
  'Wave–particle duality of light is a foundational phenomenon of quantum mechanics; quantum electrodynamics is the quantum theory of light.');
E('light', 'speed-of-light', 'physical', 'direct', 'factual', 0.99,
  'Light in vacuum travels at c = 299,792,458 m/s, the maximum speed for any signal.');
E('light', 'gothic-cathedral', 'cultural', 'strong', 'interpretive', 0.8,
  'Gothic structure freed walls for large stained-glass windows; Abbot Suger’s writings link the new luminous interiors to a theology of divine light.');
E('light', 'impressionism', 'cultural', 'direct', 'factual', 0.9,
  'Impressionist painters made changing light and atmosphere their central subject, painting outdoors and in series.');

C('microscope', 'Microscope', 'technology', 2, 'A window onto the small',
  `Compound microscopes appeared in the Netherlands around 1600, a gift of lens-grinding [optics](optics).
  Robert Hooke’s Micrographia (1665) coined the word “cell” for the little compartments he saw in cork.
  Antonie van Leeuwenhoek’s tiny single-lens instruments, magnifying around 270 times, revealed
  [microorganisms](microorganisms). Two centuries later, better microscopes and stains made the
  [germ theory](germ-theory) visible. The detail a light microscope can show is limited by the wavelength
  of [light](light) itself. Electron microscopes see much further by using the wave nature of electrons,
  a gift of [quantum mechanics](quantum-mechanics).`);
E('microscope', 'light', 'physical', 'strong', 'factual', 0.9,
  'The diffraction limit (Abbe, 1873) ties a light microscope’s resolution to roughly half the wavelength of light.');
E('microscope', 'quantum-mechanics', 'technological', 'strong', 'factual', 0.9,
  'Electron microscopes exploit the wave nature of electrons (de Broglie wavelength), a quantum phenomenon, to resolve far smaller details.');

C('radioactivity', 'Radioactivity', 'physics', 3, 'The atom that would not sit still',
  `In 1896 Henri Becquerel found that uranium salts darkened [photographic](photography) plates wrapped in
  black paper, with no sunlight involved. [Marie Curie](curie) named the phenomenon radioactivity, and with
  Pierre Curie discovered polonium and radium. Ernest Rutherford showed that radioactive atoms turn into
  other elements, a scientific echo of [alchemy](alchemy). Decay is fundamentally random. No one can say
  when a given nucleus will break apart, only the [probability](probability), and explaining why took
  [quantum mechanics](quantum-mechanics). Yet in huge numbers the decay is steady enough to serve as a
  clock ([radiometric dating](radiometric-dating)). Per atom it released far more [energy](energy) than
  any chemical reaction, and it helps keep Earth’s interior hot enough to move
  [continents](plate-tectonics).`,
  { wiki: 'Radioactive_decay', aliases: ['radiation', 'radioactive decay'] });
E('radioactivity', 'curie', 'biographical', 'direct', 'factual', 0.99,
  'Marie Curie coined the term “radioactivity” and, with Pierre Curie, discovered polonium and radium (1898); she won Nobel Prizes in 1903 and 1911.');
E('radioactivity', 'probability', 'mathematical', 'strong', 'factual', 0.9,
  'Radioactive decay is a random process: individual decay times are unpredictable, while populations follow an exponential law with a fixed half-life.');
E('radioactivity', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.95,
  'Gamow (and independently Gurney and Condon) explained alpha decay in 1928 as quantum tunnelling through the nuclear barrier.');
E('radioactivity', 'radiometric-dating', 'physical', 'direct', 'factual', 0.98,
  'Radiometric dating uses the known half-lives of radioactive isotopes to measure the ages of rocks and organic remains.');
E('radioactivity', 'energy', 'physical', 'strong', 'factual', 0.9,
  'Radioactive decay converts mass into energy (E = mc²), releasing roughly a million times more energy per atom than chemical reactions.');
E('radioactivity', 'plate-tectonics', 'physical', 'strong', 'factual', 0.82,
  'Radioactive decay of uranium, thorium and potassium supplies a large share (around half) of Earth’s internal heat, which drives mantle convection.',
  ['kamland2011']);

C('curie', 'Marie Curie', 'person', 1, '1867–1934 · two Nobel Prizes, two sciences',
  `Marie Skłodowska Curie was born in Warsaw, where women could not attend university, and went to study
  in [Paris](paris). Following Becquerel, she coined the word [radioactivity](radioactivity) and showed
  that it is a property of atoms themselves, an early clue that atoms have an inner structure
  ([atomic theory](atomic-theory)). With Pierre Curie she discovered polonium, named for her occupied
  homeland, and radium, two new squares on the [periodic table](periodic-table). She was the first woman
  to win a Nobel Prize (physics, 1903) and the first person to win two (the second, in 1911, for
  [chemistry](chemistry)). During [the First World War](world-war-i) she organised mobile X-ray units,
  the “petites Curies,” and drove them to the front herself.`,
  { wiki: 'Marie_Curie', aliases: ['madame curie', 'marie sklodowska curie'] });
E('curie', 'paris', 'biographical', 'direct', 'factual', 0.95,
  'Curie studied at the Sorbonne and did her research in Paris, where she became the University of Paris’s first female professor.');
E('curie', 'atomic-theory', 'biographical', 'strong', 'factual', 0.88,
  'Curie argued radioactivity was an atomic property independent of chemical state — evidence that atoms have internal processes.');
E('curie', 'chemistry', 'biographical', 'direct', 'factual', 0.95,
  'Curie won the 1911 Nobel Prize in Chemistry for discovering radium and polonium and isolating radium.');
E('curie', 'world-war-i', 'biographical', 'strong', 'factual', 0.93,
  'During WWI Curie developed mobile radiography units (“petites Curies”) and trained operators to X-ray wounded soldiers near the front.');

C('quantum-mechanics', 'Quantum mechanics', 'physics', 5, 'The rules underneath the rules',
  `Quantum mechanics is the physics of the very small and the most precisely tested theory in science. It
  began in 1900, when Max Planck, trying to explain the colour of glowing hot objects, assumed that
  [energy](energy) comes in discrete lumps, or quanta. [Einstein](einstein) applied the idea to
  [light](light) to explain the [photoelectric effect](photoelectric-effect). Between 1925 and 1927
  Heisenberg, Schrödinger, Born and [Dirac](dirac) built the full theory. Its predictions are
  [probabilities](probability), its states are vectors in a [Hilbert space](hilbert-space), and some
  pairs of quantities cannot both be sharp ([uncertainty](uncertainty-principle)). Particles can be
  [entangled](entanglement), and what counts as a [measurement](measurement) is still argued over. It
  also explains chemistry, and it makes transistors, and so every [computer](computer), possible.`,
  { aliases: ['quantum physics', 'quantum theory', 'quantum'] });
E('quantum-mechanics', 'energy', 'physical', 'direct', 'factual', 0.95,
  'Quantum theory began with Planck’s 1900 hypothesis that energy is exchanged in discrete quanta (E = hν).');
E('quantum-mechanics', 'einstein', 'biographical', 'strong', 'factual', 0.95,
  'Einstein’s 1905 light-quantum hypothesis was a founding step of quantum theory, though he later rejected its probabilistic interpretation.');
E('quantum-mechanics', 'photoelectric-effect', 'physical', 'direct', 'factual', 0.97,
  'Einstein’s explanation of the photoelectric effect using light quanta was key early evidence for quantum theory.');
E('quantum-mechanics', 'dirac', 'biographical', 'direct', 'factual', 0.98,
  'Dirac developed transformation theory, quantum electrodynamics foundations and the relativistic electron equation; his textbook (1930) shaped the field.');
E('quantum-mechanics', 'probability', 'mathematical', 'direct', 'factual', 0.97,
  'Born’s rule (1926): quantum mechanics predicts only the probabilities of measurement outcomes.');
E('quantum-mechanics', 'hilbert-space', 'mathematical', 'direct', 'factual', 0.98,
  'Quantum states are vectors in a Hilbert space; von Neumann’s 1932 formulation made this the theory’s mathematical foundation.');
E('quantum-mechanics', 'uncertainty-principle', 'physical', 'direct', 'factual', 0.99,
  'The uncertainty principle (Heisenberg, 1927) is a core consequence of quantum mechanics.');
E('quantum-mechanics', 'entanglement', 'physical', 'direct', 'factual', 0.99,
  'Entanglement — correlations between parts of a system that cannot be described separately — is a distinctively quantum phenomenon.');
E('quantum-mechanics', 'measurement', 'controversial', 'direct', 'interpretive', 0.85,
  'The “measurement problem” — why measurements yield definite outcomes — remains contested, with rival interpretations (Copenhagen, many-worlds, pilot-wave…).');
E('quantum-mechanics', 'computer', 'technological', 'strong', 'factual', 0.9,
  'Transistors and semiconductors, the basis of all modern computers, depend on the quantum theory of electrons in solids.');

C('bells-theorem', 'Bell’s theorem', 'physics', 1, 'Where philosophy became an experiment',
  `In 1964 John Stewart Bell, a physicist from Belfast working at CERN, proved that no theory in which
  particles carry pre-set local properties can reproduce every prediction of
  [quantum mechanics](quantum-mechanics). The theorem turned an old argument between [Einstein](einstein)
  and Bohr into something testable. Measure the correlations between [entangled](entanglement) particles,
  and a statistical inequality, a matter of [probability](probability), tells you whether nature can be
  “locally real.” Experiments by John Clauser, Alain Aspect and Anton Zeilinger, honoured with the 2022
  Nobel Prize, found the inequality violated. Either influences are non-local, or properties do not exist
  before they are [measured](measurement), and physicists still argue over which. Bell tests now certify
  quantum [cryptography](cryptography).`,
  { wiki: "Bell's_theorem", aliases: ['bell theorem', 'bells theorem', 'bell inequality'] });
E('bells-theorem', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.98,
  'Bell’s theorem proves quantum mechanics’ predictions cannot be reproduced by any local hidden-variable theory.',
  ['bell1964']);
E('bells-theorem', 'einstein', 'historical', 'direct', 'factual', 0.95,
  'Bell’s work responded to the 1935 Einstein–Podolsky–Rosen paper arguing quantum mechanics was incomplete.');
E('bells-theorem', 'entanglement', 'physical', 'direct', 'factual', 0.99,
  'Bell tests measure correlations between entangled particles; their violation of Bell inequalities demonstrates entanglement’s non-classical character.',
  ['nobel2022']);
E('bells-theorem', 'probability', 'mathematical', 'strong', 'factual', 0.9,
  'Bell inequalities are bounds on statistical correlations; testing them is a matter of estimating probabilities from many trials.');
E('bells-theorem', 'measurement', 'controversial', 'strong', 'interpretive', 0.78,
  'What Bell violations imply — non-locality, or the absence of pre-existing measurement outcomes — depends on one’s interpretation of quantum mechanics.');
E('bells-theorem', 'cryptography', 'technological', 'strong', 'factual', 0.88,
  'Ekert’s 1991 quantum key distribution protocol uses Bell-inequality violation to detect eavesdropping; device-independent cryptography builds on it.');

C('entanglement', 'Entanglement', 'physics', 2, 'Two things with one description',
  `When two particles are entangled, their shared quantum state cannot be split into two separate states.
  Measure one, and the result is correlated with the other’s, however far apart they are. The correlations
  are too strong for any pre-arranged plan, which is exactly what [Bell’s theorem](bells-theorem) shows.
  Schrödinger coined the term in 1935, and Einstein called the effect “spooky action at a distance.”
  Entanglement cannot send a message faster than [light](speed-of-light), but it can do other things.
  It is the resource that [quantum computing](quantum-computing) draws on, and physicists now measure it
  as a form of [information](information).`,
  { wiki: 'Quantum_entanglement', aliases: ['quantum entanglement', 'spooky action at a distance'] });
E('entanglement', 'speed-of-light', 'physical', 'strong', 'factual', 0.9,
  'The no-signalling theorem: entanglement correlations cannot be used to transmit information faster than light, preserving relativity.');
E('entanglement', 'quantum-computing', 'technological', 'direct', 'factual', 0.95,
  'Entanglement between qubits is essential to the speed-ups of quantum algorithms.');
E('entanglement', 'information', 'conceptual', 'strong', 'factual', 0.85,
  'Quantum information theory quantifies entanglement (e.g. entanglement entropy) and treats it as a resource for teleportation and cryptography.');

C('antimatter', 'Antimatter', 'physics', 1, 'Predicted by an equation, found in the sky',
  `In 1928 [Paul Dirac](dirac) wrote an equation for the electron that combined
  [quantum mechanics](quantum-mechanics) with special [relativity](relativity). It had solutions with
  negative energy, and Dirac came to interpret them as a new particle, the anti-electron. In 1932 Carl
  Anderson found it in cosmic-ray tracks and called it the positron. When matter and antimatter meet they
  annihilate into pure [energy](energy). The laws of physics treat the two almost
  [symmetrically](symmetry), so why the universe is made almost entirely of matter is one of physics’ great
  open questions. Hospitals use positrons every day, in PET scans.`);
E('antimatter', 'dirac', 'biographical', 'direct', 'factual', 0.99,
  'Dirac’s relativistic electron equation (1928) led him to predict the anti-electron (1931), discovered by Anderson in 1932.');
E('antimatter', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.95,
  'Antiparticles are a necessary consequence of combining quantum mechanics with special relativity (quantum field theory).');
E('antimatter', 'relativity', 'physical', 'direct', 'factual', 0.95,
  'The Dirac equation’s negative-energy solutions, interpreted as antiparticles, arise from making quantum mechanics consistent with special relativity.');
E('antimatter', 'energy', 'physical', 'direct', 'factual', 0.95,
  'Matter–antimatter annihilation converts rest mass entirely into energy (typically gamma rays), per E = mc².');
E('antimatter', 'symmetry', 'physical', 'strong', 'factual', 0.9,
  'Matter and antimatter are related by charge-conjugation symmetry; small CP-symmetry violations are studied as a clue to why matter dominates.');

C('dirac', 'Paul Dirac', 'person', 1, '1902–1984 · beauty as a guide to truth',
  `Paul Dirac, an English physicist with a Swiss father, trained first as an electrical engineer and then
  turned to mathematics. In 1928 his equation for the electron predicted [antimatter](antimatter), and in
  1933 he shared the Nobel Prize with Schrödinger for his work on [quantum mechanics](quantum-mechanics).
  He invented the bra–ket notation physicists still use to write vectors in
  [Hilbert space](hilbert-space). He held the Lucasian chair of mathematics at Cambridge, the chair once
  held by [Isaac Newton](newton). Dirac believed that physical laws should have mathematical beauty. He
  was also famously silent, and colleagues joked about a unit called the “dirac,” one word per hour.`,
  { wiki: 'Paul_Dirac', aliases: ['dirac'] });
E('dirac', 'hilbert-space', 'mathematical', 'direct', 'factual', 0.95,
  'Dirac’s bra–ket notation (1939) is the standard notation for vectors and operators on Hilbert space in quantum mechanics.');
E('dirac', 'newton', 'biographical', 'strong', 'factual', 0.95,
  'Dirac was Lucasian Professor of Mathematics at Cambridge (1932–69), the chair Newton held from 1669.');

C('einstein', 'Albert Einstein', 'person', 2, '1879–1955 · the patent clerk',
  `In 1905, while working as a patent examiner in Bern, Albert Einstein published papers on the
  [photoelectric effect](photoelectric-effect), which later won him the Nobel Prize; on Brownian motion,
  which settled the reality of [atoms](atomic-theory); and on special [relativity](relativity), from which
  E = mc² followed, uniting mass and [energy](energy). The historian Peter Galison has argued that the
  patent office’s steady flow of inventions for synchronising [clocks](clock) was part of the background.
  Einstein helped found [quantum mechanics](quantum-mechanics) and then resisted its randomness. His
  objections in 1935 led, three decades later, to [Bell’s theorem](bells-theorem).`,
  { wiki: 'Albert_Einstein', aliases: ['einstein'] });
E('einstein', 'photoelectric-effect', 'biographical', 'direct', 'factual', 0.99,
  'Einstein’s 1905 explanation of the photoelectric effect won him the 1921 Nobel Prize in Physics.');
E('einstein', 'relativity', 'biographical', 'direct', 'factual', 0.99,
  'Einstein formulated special relativity (1905) and general relativity (1915).');
E('einstein', 'energy', 'physical', 'direct', 'factual', 0.95,
  'Einstein’s 1905 paper “Does the inertia of a body depend upon its energy content?” derived mass–energy equivalence, E = mc².');
E('einstein', 'clock', 'biographical', 'subtle', 'interpretive', 0.6,
  'Galison argues that clock-synchronisation technology, which passed through the Bern patent office, formed a practical context for Einstein’s analysis of simultaneity. Historians debate how much weight to give it.',
  ['galison2003']);

C('relativity', 'Relativity', 'physics', 4, 'Your time is not my time',
  `Einstein’s special relativity (1905) starts from two principles. The laws of physics are the same for
  every observer moving steadily, and the [speed of light](speed-of-light) is the same for all of them. The
  consequences are that moving clocks run slow and moving lengths shrink, and absolute [time](time) is
  gone. Mass turns out to be a form of [energy](energy). General relativity (1915) recast
  [gravity](gravity) as the curvature of spacetime, which is to say as [geometry](geometry), non-Euclidean
  geometry. Both theories are tested every day. The clocks on [GPS](gps) satellites would drift by about
  38 microseconds a day without relativistic corrections. And the whole theory rests on
  [symmetry](symmetry).`,
  { wiki: 'Theory_of_relativity', aliases: ['general relativity', 'special relativity', 'spacetime'] });
E('relativity', 'speed-of-light', 'physical', 'direct', 'factual', 0.99,
  'The constancy of the speed of light for all inertial observers is a postulate of special relativity.');
E('relativity', 'time', 'physical', 'direct', 'factual', 0.98,
  'Relativity makes elapsed time depend on motion and gravitational potential (time dilation), abolishing absolute time.');
E('relativity', 'energy', 'physical', 'direct', 'factual', 0.95,
  'Special relativity implies mass–energy equivalence (E = mc²).');
E('relativity', 'gravity', 'physical', 'direct', 'factual', 0.98,
  'General relativity describes gravity as the curvature of spacetime produced by mass and energy.');
E('relativity', 'geometry', 'mathematical', 'direct', 'factual', 0.95,
  'General relativity uses Riemannian (non-Euclidean) geometry; spacetime curvature is a geometric property.');
E('relativity', 'gps', 'technological', 'direct', 'factual', 0.97,
  'GPS satellite clocks gain ~38 μs/day relative to ground clocks (general minus special relativistic effects) and are corrected accordingly.',
  ['ashby2003']);
E('relativity', 'symmetry', 'mathematical', 'strong', 'factual', 0.9,
  'Special relativity is built on Lorentz symmetry — the invariance of physical laws under Lorentz transformations.');

C('speed-of-light', 'Speed of light', 'physics', 3, '299,792,458 metres per second, exactly',
  `Light travels at 299,792,458 metres per second in a vacuum, and that number is exact, because since 1983
  the metre has been defined by it ([metric system](metric-system)). In 1676 Ole Rømer first showed that
  light’s speed is finite, by noticing that eclipses of Jupiter’s moon Io ran early or late depending on
  Earth’s distance from Jupiter, a discovery of [astronomy](astronomy). Maxwell showed that
  [light](light) is an electromagnetic wave whose speed follows from electric and magnetic constants.
  That the speed is the same for every observer is the foundation of [relativity](relativity). It also
  caps how fast any [information](information) can travel. We measure the distance to the
  [Moon](moon) by timing laser pulses that bounce back from it.`,
  { aliases: ['c', 'lightspeed'] });
E('speed-of-light', 'metric-system', 'technological', 'direct', 'factual', 0.99,
  'Since 1983 the metre is defined as the distance light travels in vacuum in 1/299,792,458 of a second.');
E('speed-of-light', 'astronomy', 'historical', 'strong', 'factual', 0.95,
  'Ole Rømer inferred the finite speed of light in 1676 from timing irregularities in eclipses of Io.');
E('speed-of-light', 'information', 'physical', 'strong', 'factual', 0.85,
  'In relativity no signal — no information — can propagate faster than light in vacuum.');
E('speed-of-light', 'moon', 'technological', 'strong', 'factual', 0.9,
  'Lunar laser ranging times light pulses reflected from retroreflectors left by Apollo and Lunokhod missions, measuring the distance to the Moon to centimetres.');

C('photoelectric-effect', 'Photoelectric effect', 'physics', 1, 'The experiment that broke the wave',
  `Shine light on a metal and it can knock electrons loose, but only if the light’s frequency is high
  enough, however bright it is. A classical wave could not explain that. In 1905
  [Einstein](einstein) proposed that [light](light) arrives in quanta whose energy depends on frequency.
  Robert Millikan set out to refute the equation and instead confirmed it, a small parable of
  [experimental science](experimental-science). It helped launch [quantum mechanics](quantum-mechanics).
  It is also how solar panels, and the sensor in every digital camera, turn light into electricity. The
  descendants of [silver-based photography](photography) run on it.`);
E('photoelectric-effect', 'experimental-science', 'conceptual', 'subtle', 'factual', 0.8,
  'Millikan, sceptical of Einstein’s light quanta, spent a decade testing the photoelectric equation and ended up confirming it (1914–16).');
E('photoelectric-effect', 'photography', 'technological', 'strong', 'factual', 0.85,
  'Digital image sensors (CCD and CMOS) convert light to charge via the (internal) photoelectric effect.');

C('uncertainty-principle', 'Uncertainty principle', 'physics', 1, 'The limit that is not about clumsiness',
  `Werner Heisenberg’s principle of 1927 says that certain pairs of properties, such as position and
  momentum, cannot both be sharply defined at once. It is not just a matter of clumsy instruments and
  careless [measurement](measurement). It follows from the wave nature of matter in
  [quantum mechanics](quantum-mechanics), and mathematically from the fact that the operators involved
  do not commute, a fact of [linear algebra](linear-algebra). The same mathematics shows up far from
  physics: a signal cannot be both very short in time and very pure in frequency, a trade-off engineers
  meet in [information theory](information-theory).`,
  { aliases: ['heisenberg uncertainty', 'heisenberg'] });
E('uncertainty-principle', 'measurement', 'conceptual', 'direct', 'interpretive', 0.85,
  'Heisenberg first illustrated it with measurement disturbance (the gamma-ray microscope), but the modern view is that the limit is intrinsic to quantum states, not only to measurement.');
E('uncertainty-principle', 'linear-algebra', 'mathematical', 'direct', 'factual', 0.9,
  'The Robertson uncertainty relation follows from the commutator of Hermitian operators — linear algebra on Hilbert space.');
E('uncertainty-principle', 'information-theory', 'analogical', 'strong', 'analogical', 0.78,
  'The Gabor limit in signal processing — a signal cannot be sharply localised in both time and frequency — is the same Fourier mathematics applied to waves of a different kind.');

C('energy', 'Energy', 'physics', 5, 'What is conserved',
  `Energy is the capacity to do work, and the most useful fact about it is that it is conserved. It changes
  form but never appears from nothing or disappears. The conservation law was put together in the 1840s by
  Mayer, Joule, Helmholtz and others, drawing on [steam engines](steam-engine), physiology and electricity,
  and became the first law of [thermodynamics](thermodynamics). In 1918 [Emmy Noether](noether) showed why
  it holds: energy is conserved because the laws of physics are the same at every moment, a
  [symmetry](symmetry) in [time](time). Einstein’s E = mc² revealed mass itself as energy. Life runs on
  it, and so did the [Industrial Revolution](industrial-revolution).`);
E('energy', 'steam-engine', 'historical', 'strong', 'factual', 0.88,
  'Measuring the work obtainable from heat in engines (Carnot, Joule) was central to formulating energy conservation.');
E('energy', 'thermodynamics', 'physical', 'direct', 'factual', 0.99,
  'The first law of thermodynamics is the conservation of energy, including heat.');
E('energy', 'noether', 'mathematical', 'direct', 'factual', 0.98,
  'Noether’s theorem (1918) derives energy conservation from time-translation symmetry.',
  ['noether1918']);
E('energy', 'symmetry', 'mathematical', 'direct', 'factual', 0.97,
  'By Noether’s theorem, each continuous symmetry of physical laws corresponds to a conserved quantity; time-translation symmetry gives energy.');
E('energy', 'time', 'physical', 'strong', 'factual', 0.93,
  'Energy is the conserved quantity associated with time; in quantum mechanics energy and time are also conjugate variables.');
E('energy', 'industrial-revolution', 'economic', 'strong', 'factual', 0.9,
  'The Industrial Revolution was an energy revolution: coal-fired steam multiplied the mechanical energy available to economies.');

C('thermodynamics', 'Thermodynamics', 'physics', 3, 'The science born from engines',
  `Thermodynamics is the science of heat, work and [energy](energy). Its first law says energy is
  conserved. Its second says the [entropy](entropy) of an isolated system never decreases, which is why
  heat flows from hot to cold and no engine can be perfectly efficient. It was born from the
  [steam engine](steam-engine), when Sadi Carnot asked in 1824 how much work heat can produce, and it was
  given its mature form in the 1850s by Clausius, Kelvin and others. Ludwig Boltzmann then explained it
  statistically: the second law is at bottom a matter of [probability](probability).`);
E('thermodynamics', 'entropy', 'physical', 'direct', 'factual', 0.99,
  'The second law of thermodynamics states that the entropy of an isolated system does not decrease.');
E('thermodynamics', 'steam-engine', 'historical', 'direct', 'factual', 0.97,
  'Sadi Carnot’s Reflections on the Motive Power of Fire (1824), analysing steam-engine efficiency, founded thermodynamics.');
E('thermodynamics', 'probability', 'mathematical', 'strong', 'factual', 0.9,
  'Statistical mechanics (Boltzmann, Gibbs) derives thermodynamic laws from the probabilities of microscopic states.');

C('entropy', 'Entropy', 'physics', 4, 'How much we do not know',
  `Entropy measures how many microscopic arrangements fit what we can see, which is to say how much we don’t
  know. Rudolf Clausius coined the word in 1865, from the Greek for “transformation.” The second law of
  [thermodynamics](thermodynamics) says it tends to grow, and that may be why [time](time) has a direction.
  Boltzmann’s formula S = k log W, carved on his tombstone in Vienna, ties it to
  [probability](probability). In 1948 Claude Shannon found the same mathematical form measuring
  uncertainty in messages, and on John von Neumann’s advice, the story goes, he called it entropy
  ([information theory](information-theory)). The link is more than a pun. Rolf Landauer showed in 1961
  that erasing a bit must release a minimum amount of heat. [Information](information) is physical.`);
E('entropy', 'time', 'physical', 'direct', 'interpretive', 0.85,
  'The thermodynamic arrow of time — the past had lower entropy — is the standard account of time’s direction, though its ultimate origin (low-entropy early universe) is debated.');
E('entropy', 'probability', 'mathematical', 'direct', 'factual', 0.95,
  'Boltzmann’s S = k log W defines entropy by the number of microstates; Gibbs entropy is a functional of a probability distribution.');
E('entropy', 'information-theory', 'mathematical', 'direct', 'factual', 0.95,
  'Shannon entropy H = −Σ p log p has the same form as Gibbs entropy and measures average information per symbol.',
  ['shannon1948']);
E('entropy', 'information', 'physical', 'direct', 'factual', 0.88,
  'Landauer’s principle (1961): erasing one bit dissipates at least kT ln 2 of heat, linking information to thermodynamic entropy; confirmed experimentally in 2012.');

C('steam-engine', 'Steam engine', 'technology', 2, 'Fire that pushes',
  `Thomas Newcomen’s engine of 1712 pumped water out of mines. James Watt’s separate condenser, patented
  in 1769, made steam engines far more efficient, and they came to drive the
  [Industrial Revolution](industrial-revolution): mills, ships and [railways](railways). Trying to
  understand their efficiency led Sadi Carnot, in 1824, to ask how much work heat can do, and that
  question founded [thermodynamics](thermodynamics). It is often said that science owes more to the
  steam engine than the steam engine owes to science. The steam engine also taught physics what
  [energy](energy) is.`);
E('steam-engine', 'industrial-revolution', 'technological', 'direct', 'factual', 0.97,
  'Steam engines powered factories, mines, locomotives and ships, becoming the emblematic technology of the Industrial Revolution.');
E('steam-engine', 'railways', 'technological', 'direct', 'factual', 0.97,
  'Steam locomotives powered the first public railways (Stockton & Darlington 1825; Liverpool & Manchester 1830).');

C('gravity', 'Gravity', 'physics', 4, 'The weakest force, the largest reach',
  `Gravity is the weakest of the fundamental forces and the one that shapes the universe on the largest
  scales. [Galileo](galileo) found that, air resistance aside, all bodies fall at the same rate.
  [Newton](newton) described gravity as a force between masses that weakens with the square of the
  distance, the same force for falling apples and orbiting moons. The [Moon](moon)’s pull raises the
  [tides](tides). In 1915 [Einstein](relativity) recast gravity as the curvature of spacetime, and it slows
  clocks. Fitting gravity together with [quantum mechanics](quantum-mechanics) is the greatest unsolved
  problem in fundamental physics.`,
  { aliases: ['gravitation'] });
E('gravity', 'galileo', 'physical', 'direct', 'factual', 0.92,
  'Galileo’s experiments with inclined planes established that falling bodies accelerate uniformly, independent of their mass (neglecting air resistance).');
E('gravity', 'newton', 'physical', 'direct', 'factual', 0.99,
  'Newton’s law of universal gravitation (Principia, 1687) explained terrestrial and celestial motion with one inverse-square force.');
E('gravity', 'moon', 'physical', 'direct', 'factual', 0.98,
  'Gravity holds the Moon in orbit; Newton tested his law by comparing the Moon’s orbital acceleration to falling bodies on Earth.');
E('gravity', 'tides', 'physical', 'direct', 'factual', 0.98,
  'Tides are produced by differences in the Moon’s and Sun’s gravitational pull across Earth.');
E('gravity', 'quantum-mechanics', 'physical', 'strong', 'factual', 0.9,
  'There is no accepted theory of quantum gravity; reconciling general relativity with quantum mechanics is a central open problem.');

C('newton', 'Isaac Newton', 'person', 3, '1642–1727 · the last of the magicians',
  `Isaac Newton’s Principia (1687) brought falling apples and orbiting moons under one law of
  [gravity](gravity), explained the [tides](tides), and set the pattern for mathematical physics. He
  co-invented [calculus](calculus), showed that white [light](light) is a mixture of colours, and built a
  reflecting telescope, work that belongs to [optics](optics). He also spent decades on
  [alchemy](alchemy) and biblical chronology. John Maynard Keynes, who bought his papers, called him “the
  last of the magicians.” From 1696 he ran the Royal Mint, and his valuation of gold helped put Britain on
  a gold standard, a chapter in the history of [money](money). The
  [Enlightenment](enlightenment) made him its hero. His chair at Cambridge later passed to
  [Paul Dirac](dirac).`,
  { wiki: 'Isaac_Newton', aliases: ['newton', 'isaac newton'] });
E('newton', 'tides', 'physical', 'direct', 'factual', 0.95,
  'Newton’s Principia gave the first physical explanation of tides as the result of lunar and solar gravitation.');
E('newton', 'calculus', 'controversial', 'direct', 'factual', 0.95,
  'Newton developed his “method of fluxions” in the 1660s; Leibniz independently published calculus in 1684, and their priority dispute became one of science’s bitterest.');
E('newton', 'money', 'biographical', 'direct', 'factual', 0.93,
  'As Warden (1696) and Master (1699–1727) of the Royal Mint, Newton oversaw the Great Recoinage; his 1717 valuation of the guinea put Britain on a de facto gold standard.');
E('newton', 'enlightenment', 'cultural', 'direct', 'factual', 0.95,
  'Enlightenment thinkers from Voltaire to Diderot held up Newton’s physics as the model of reason revealing nature’s laws.');

C('moon', 'The Moon', 'astronomy', 2, 'Our first clock, our nearest world',
  `Earth’s Moon is unusually large compared with its planet. The leading explanation is a collision about
  4.5 billion years ago between the young Earth and a body the size of Mars, and it is supported by how
  closely lunar rocks match Earth’s in chemistry ([geology](geology)). The Moon’s [gravity](gravity)
  raises the [tides](tides). Its phases gave people their first [calendars](calendar), and the words
  “month” and “moon” share a root. In 1609 [Galileo](galileo) turned a telescope on it and saw mountains
  and craters, a blow to the old idea of perfect heavenly spheres.`,
  { aliases: ['moon', 'the moon', 'luna'] });
E('moon', 'geology', 'physical', 'strong', 'interpretive', 0.8,
  'The giant-impact hypothesis — the leading theory of the Moon’s origin — rests heavily on isotopic similarities between lunar and terrestrial rocks returned by Apollo.');
E('moon', 'tides', 'physical', 'direct', 'factual', 0.99,
  'The Moon is the main cause of Earth’s ocean tides.');
E('moon', 'calendar', 'linguistic', 'direct', 'factual', 0.95,
  'The lunar cycle (~29.5 days) underlies the month in many calendars; English “month” derives from the same root as “moon”.');
E('moon', 'galileo', 'biographical', 'direct', 'factual', 0.95,
  'Galileo’s Sidereus Nuncius (1610) described mountains and craters on the Moon, challenging the idea of perfect celestial bodies.');

C('tides', 'Tides', 'earth', 1, 'The ocean breathing with the Moon',
  `Tides are the ocean’s response to the pull of the Moon, and to a lesser degree the Sun, on a turning
  Earth. [Newton](newton) explained them in the Principia as a consequence of universal
  [gravity](gravity). Tidal friction slowly brakes Earth’s spin, so days are getting longer and the Moon
  drifts about 3.8 centimetres farther away every year, a lengthening of [time](time) itself. At
  Mont-Saint-Michel in [Normandy](normandy) the sea can rise and fall by more than fourteen metres.`,
  { wiki: 'Tide', aliases: ['tide'] });
E('tides', 'time', 'physical', 'strong', 'factual', 0.85,
  'Tidal friction transfers angular momentum from Earth’s spin to the Moon’s orbit, lengthening the day by roughly 2 ms per century.');
E('tides', 'normandy', 'geographical', 'subtle', 'factual', 0.9,
  'The Bay of Mont-Saint-Michel in Normandy has some of the largest tidal ranges in Europe, over 14 m at spring tides.');

C('astronomy', 'Astronomy', 'astronomy', 4, 'The oldest science',
  `Astronomy is the oldest natural science. Babylonian astronomers recorded the sky for centuries and
  learned to predict lunar eclipses using arithmetic, a triumph of early [mathematics](mathematics). Greek
  astronomers built geometric models, and astronomers of the [Islamic Golden Age](islamic-golden-age)
  refined them with better instruments. [Galileo](galileo)’s telescope and Kepler’s ellipses led to
  [Newton](newton)’s universal [gravity](gravity). Astronomy has always been about [time](time) as well.
  The day, the month and the year are astronomical, and until 1967 the second itself was defined by
  Earth’s motion, before [atomic clocks](atomic-clock) took over. Starlight split by a prism showed what
  stars are made of, which made astronomy a science of [light](light).`);
E('astronomy', 'mathematics', 'historical', 'direct', 'factual', 0.95,
  'Babylonian mathematical astronomy used arithmetic schemes to predict planetary and lunar phenomena; astronomy drove trigonometry and much later mathematics.');
E('astronomy', 'islamic-golden-age', 'historical', 'strong', 'factual', 0.9,
  'Observatories at Maragha and Samarkand and astronomers such as al-Battani and al-Tusi refined planetary models and instruments.');
E('astronomy', 'galileo', 'biographical', 'direct', 'factual', 0.97,
  'Galileo’s telescopic discoveries (1609–10) — Jupiter’s moons, Venus’s phases — supported heliocentrism.');
E('astronomy', 'newton', 'biographical', 'direct', 'factual', 0.95,
  'Newton’s gravitation explained Kepler’s laws of planetary motion, unifying celestial and terrestrial mechanics.');
E('astronomy', 'gravity', 'physical', 'direct', 'factual', 0.95,
  'Gravity governs orbits, stars and galaxies; celestial mechanics is gravitational physics.');
E('astronomy', 'time', 'conceptual', 'direct', 'factual', 0.9,
  'Days, months and years are astronomical cycles; timekeeping was an astronomical task for millennia.');
E('astronomy', 'atomic-clock', 'historical', 'strong', 'factual', 0.88,
  'The SI second was defined astronomically (as a fraction of the 1900 tropical year) until 1967, when the caesium atomic definition replaced it.');
E('astronomy', 'light', 'physical', 'direct', 'factual', 0.9,
  'Almost everything we know about stars comes from analysing their light; spectroscopy revealed their chemical composition.');

C('geology', 'Geology', 'earth', 3, 'Reading history in rock',
  `Geology reads Earth’s history in its rocks. In the late eighteenth century James Hutton looked at
  tilted layers at Siccar Point in Scotland and argued that ordinary slow processes, given enough time,
  could build and wear down mountains. He had opened up [deep time](deep-time). Charles Lyell’s
  Principles of Geology carried the idea to [Darwin](darwin). The discovery of
  [radioactivity](radioactivity) gave geology a clock, [radiometric dating](radiometric-dating). And the
  great unifying idea of twentieth-century geology was [plate tectonics](plate-tectonics).`);
E('geology', 'deep-time', 'conceptual', 'direct', 'factual', 0.97,
  'Hutton’s uniformitarian geology (1788) implied an Earth of immense age, the founding insight of deep time.');
E('geology', 'radioactivity', 'physical', 'strong', 'factual', 0.88,
  'Radioactivity both heats Earth’s interior (resolving Kelvin’s age paradox) and provides isotopic clocks for dating rocks.');
E('geology', 'radiometric-dating', 'technological', 'direct', 'factual', 0.97,
  'Radiometric dating is geology’s principal method for assigning absolute ages to rocks.');
E('geology', 'plate-tectonics', 'conceptual', 'direct', 'factual', 0.98,
  'Plate tectonics is the unifying theory of modern geology, explaining mountains, earthquakes, volcanoes and ocean basins.');

C('plate-tectonics', 'Plate tectonics', 'earth', 2, 'Continents that wander',
  `Earth’s outer shell is broken into plates that move a few centimetres a year, about as fast as
  fingernails grow. In 1912 Alfred Wegener proposed continental drift, pointing to how the coasts of
  Africa and South America fit together and how fossils match across oceans. He had no mechanism and was
  widely dismissed. In the 1950s and 1960s, maps of magnetic stripes on the sea floor revealed seafloor
  spreading, and geology changed its mind, a case study in how [experimental science](experimental-science)
  is supposed to work. The engine is heat from Earth’s interior, much of it from
  [radioactivity](radioactivity). Moving plates split and join populations, shaping where species live and
  how they [evolve](evolution). Today [GPS](gps) watches continents move in real time.`);
E('plate-tectonics', 'experimental-science', 'conceptual', 'subtle', 'interpretive', 0.72,
  'The move from rejecting continental drift to accepting plate tectonics once seafloor-spreading evidence arrived is a standard case study of theory change in science.');
E('plate-tectonics', 'evolution', 'biological', 'strong', 'factual', 0.85,
  'Continental drift explains many patterns in biogeography — e.g. related fossils and lineages on now-separated continents — and drove speciation by isolation.');
E('plate-tectonics', 'gps', 'technological', 'direct', 'factual', 0.95,
  'High-precision GPS networks measure plate motions of millimetres to centimetres per year directly.');
E('plate-tectonics', 'deep-time', 'conceptual', 'strong', 'factual', 0.9,
  'Plate motions of centimetres per year only build oceans and mountain ranges over tens to hundreds of millions of years.');

C('deep-time', 'Deep time', 'earth', 2, 'Time too large to feel',
  `Deep time is the realisation that Earth is billions of years old, not thousands. James Hutton found in
  the rocks “no vestige of a beginning, no prospect of an end,” the founding insight of
  [geology](geology). [Darwin](darwin) needed vast stretches of time for [evolution](evolution) to work.
  In 1956 Clair Patterson used [radiometric dating](radiometric-dating) of meteorites to fix Earth’s age at
  about 4.5 billion years. The white [chalk](chalk) of Normandy took millions of years to settle. The
  writer John McPhee gave the idea its name in 1981. It is [time](time) on a scale human intuition was
  never built for.`);
E('deep-time', 'radiometric-dating', 'technological', 'direct', 'factual', 0.97,
  'Patterson’s 1956 lead-isotope dating of meteorites gave Earth’s age as ~4.55 billion years, still the accepted figure.',
  ['patterson1956']);
E('deep-time', 'time', 'conceptual', 'strong', 'factual', 0.9,
  'Deep time is the geological timescale — billions of years — dwarfing historical time.');

C('radiometric-dating', 'Radiometric dating', 'earth', 1, 'Clocks inside stones',
  `Radioactive isotopes decay at steady average rates, their half-lives, whatever the heat or chemistry
  around them. Measure the ratio of parent to daughter isotopes in a rock or a bone and you get its age
  ([radioactivity](radioactivity)). Rutherford suggested the idea in 1905, and Bertram Boltwood dated rocks
  by uranium and lead in 1907. Willard Libby’s radiocarbon method (1949) dates organic remains up to about
  50,000 years old. It is how we know the age of the pottery residues that record early
  [cheese](cheese)-making and the spread of the [Neolithic Revolution](neolithic-revolution). The method
  rests on [probability](probability): each atom’s decay is random, but vast numbers of atoms keep
  perfect time.`);
E('radiometric-dating', 'cheese', 'historical', 'subtle', 'factual', 0.78,
  'Radiocarbon dating of the Kujawy pottery sieves places the earliest chemical evidence of cheesemaking in the 6th millennium BCE.',
  ['salque2013']);
E('radiometric-dating', 'neolithic-revolution', 'historical', 'strong', 'factual', 0.9,
  'Radiocarbon dates of seeds, bones and hearths map the timing and spread of early farming.');
E('radiometric-dating', 'probability', 'mathematical', 'strong', 'factual', 0.9,
  'Radiometric ages rely on the statistical law of radioactive decay; ages are reported with probabilistic uncertainties.');

C('galileo', 'Galileo Galilei', 'person', 2, '1564–1642 · the book of nature',
  `Galileo held that the book of nature is written in the language of [mathematics](mathematics). He
  studied motion with balls rolling down ramps and with swinging [pendulums](pendulum), timing what he
  saw, and that practice made him a founder of [experimental science](experimental-science). In 1609–10
  his telescope showed mountains on the [Moon](moon) and moons circling Jupiter, and he became an
  advocate for Copernicus. In 1633 the Roman Inquisition condemned him and confined him to house arrest,
  the emblematic clash between science and [power](power). His work on inertia and falling bodies fed
  directly into [Newton](newton)’s laws. Newton was born in the year Galileo died.`,
  { wiki: 'Galileo_Galilei', aliases: ['galileo'] });
E('galileo', 'mathematics', 'conceptual', 'strong', 'factual', 0.9,
  'In The Assayer (1623) Galileo wrote that the book of nature is written in the language of mathematics.');
E('galileo', 'pendulum', 'biographical', 'direct', 'interpretive', 0.78,
  'Galileo studied pendulum isochronism; the story of the swinging cathedral lamp in Pisa comes from his biographer Viviani and may be embellished.');
E('galileo', 'experimental-science', 'conceptual', 'direct', 'factual', 0.95,
  'Galileo’s combination of controlled experiments, measurement and mathematics makes him a central figure of the Scientific Revolution.');
E('galileo', 'power', 'historical', 'strong', 'factual', 0.88,
  'The Inquisition’s 1633 trial and condemnation of Galileo for defending heliocentrism is the archetypal confrontation between scientific claims and institutional authority. Its interpretation is contested.');
E('galileo', 'newton', 'historical', 'direct', 'factual', 0.92,
  'Galileo’s principle of inertia and laws of falling bodies became foundations of Newton’s mechanics.');

C('pendulum', 'Pendulum', 'physics', 1, 'The swing that kept time',
  `According to his student Viviani, [Galileo](galileo) watched a lamp swinging in Pisa cathedral and
  noticed that each swing took the same time, wide or narrow. That is nearly true for small swings. The
  period depends on the pendulum’s length and on [gravity](gravity), not on its weight. In 1656 Christiaan
  Huygens built the first pendulum [clock](clock), and clocks went from losing minutes a day to losing
  seconds. Pendulum clocks ran slow near the equator, evidence that Earth bulges there, as
  [Newton](newton) had argued. In 1851 Léon Foucault hung a pendulum in the Panthéon in [Paris](paris) to
  show the Earth turning beneath it. The makers of the [metric system](metric-system) even considered
  defining the metre as the length of a pendulum that beats once a second.`);
E('pendulum', 'gravity', 'physical', 'direct', 'factual', 0.98,
  'A pendulum’s period is T ≈ 2π√(L/g); pendulums were long the standard instrument for measuring local gravity.');
E('pendulum', 'clock', 'technological', 'direct', 'factual', 0.97,
  'Huygens’ pendulum clock (1656) improved timekeeping accuracy from ~15 minutes to ~15 seconds a day.');
E('pendulum', 'newton', 'physical', 'strong', 'factual', 0.85,
  'Richer’s 1672 observation that a pendulum clock ran slow at Cayenne was used by Newton as evidence for Earth’s equatorial bulge.');
E('pendulum', 'paris', 'historical', 'direct', 'factual', 0.95,
  'Foucault demonstrated Earth’s rotation with a 67 m pendulum in the Panthéon, Paris, in 1851.');
E('pendulum', 'metric-system', 'historical', 'strong', 'factual', 0.88,
  'A seconds pendulum was proposed as the basis of the metre in 1790–91 but rejected, partly because gravity varies with latitude.');

C('clock', 'A clock', 'technology', 2, 'A counter attached to something that repeats',
  `A clock is a counter attached to something that repeats, a machine for measuring [time](time). For
  millennia that meant the Sun, dripping water or burning incense. Mechanical clocks appeared in European
  towers and [monasteries](monasteries) in the late thirteenth century. In 1656 Huygens built the first
  [pendulum](pendulum) clock, and accuracy leapt from minutes to seconds a day. Accurate clocks that could
  go to sea solved the problem of [longitude](longitude). [Railways](railways) forced towns to
  synchronise their clocks, and [time zones](time-zones) followed. Today [atomic clocks](atomic-clock)
  define the second itself, and [relativity](relativity) tells us that no two clocks tick alike.`,
  { aliases: ['clock', 'clocks', 'watch', 'a clock'] });
E('clock', 'time', 'conceptual', 'direct', 'factual', 0.99,
  'Clocks are instruments for measuring time; operationally, physics defines time by what clocks measure.');
E('clock', 'longitude', 'technological', 'direct', 'factual', 0.95,
  'Finding longitude at sea requires knowing the time at a reference meridian; Harrison’s marine chronometers made this practical in the 1760s.');
E('clock', 'railways', 'historical', 'strong', 'factual', 0.9,
  'Railway timetables required synchronised clocks, leading British railways to adopt “railway time” (Greenwich time) from 1847.');
E('clock', 'time-zones', 'technological', 'strong', 'factual', 0.9,
  'Standard time zones replaced local solar time so that clocks across regions would agree to the hour.');
E('clock', 'atomic-clock', 'technological', 'direct', 'factual', 0.97,
  'Atomic clocks, which count atomic transitions, are the most accurate clocks and define the SI second.');
E('clock', 'relativity', 'physical', 'strong', 'factual', 0.95,
  'Relativity predicts, and precise clocks confirm, that clocks tick at different rates depending on motion and gravitational potential.',
  ['chou2010']);

C('longitude', 'Longitude', 'geography', 1, 'A problem of time disguised as a problem of space',
  `Latitude is easy: measure the height of the Sun or the Pole Star. Longitude is hard, because Earth turns
  fifteen degrees an hour, so finding your longitude at sea means knowing the [time](time) back at a
  reference port. After shipwrecks like the Scilly disaster of 1707, Britain’s Longitude Act of 1714
  offered a prize of up to £20,000. Astronomers proposed using the [Moon](moon)’s position among the stars
  as a clock in the sky. A carpenter-turned-clockmaker, John Harrison, answered with the marine chronometer
  instead. The prime meridian at Greenwich, agreed in 1884, became the anchor for world
  [time zones](time-zones). Today [GPS](gps) solves the problem with atomic clocks in orbit.`);
E('longitude', 'time', 'conceptual', 'direct', 'factual', 0.95,
  'Each hour of time difference from a reference meridian equals 15° of longitude, so longitude determination reduces to timekeeping.');
E('longitude', 'moon', 'physical', 'strong', 'factual', 0.88,
  'The “lunar distance” method used the Moon’s position relative to stars as a celestial clock; the Nautical Almanac (1767) made it usable at sea.');
E('longitude', 'time-zones', 'historical', 'strong', 'factual', 0.9,
  'The 1884 International Meridian Conference adopted Greenwich as the prime meridian, the reference for world time zones.');
E('longitude', 'gps', 'technological', 'direct', 'factual', 0.95,
  'GPS determines position, including longitude, from timing signals broadcast by satellites carrying atomic clocks.');

C('time', 'Time', 'physics', 5, 'What clocks measure',
  `Time is what clocks measure. That is less circular than it sounds, because most of what physics can say
  about time is really about how [clocks](clock) behave. For [Newton](newton), time was absolute and flowed
  the same everywhere. [Relativity](relativity) made it personal: clocks that move, or sit deeper in
  gravity, run slow. Why the past differs from the future seems to be tied to the growth of
  [entropy](entropy). Human time comes in layers: [calendars](calendar), [time zones](time-zones), and the
  [deep time](deep-time) of rocks. Since 1967 the second has been defined by
  [caesium atoms](atomic-clock).`);
E('time', 'newton', 'conceptual', 'strong', 'factual', 0.9,
  'Newton’s Principia posited “absolute, true, and mathematical time” flowing uniformly, independent of anything external.');
E('time', 'time-zones', 'conceptual', 'strong', 'factual', 0.88,
  'Time zones are a social convention layered on physical time, dividing the globe into regions sharing a standard clock time.');
E('time', 'atomic-clock', 'technological', 'direct', 'factual', 0.98,
  'Since 1967 the SI second has been defined as 9,192,631,770 periods of the caesium-133 hyperfine transition.');

C('time-zones', 'Time zones', 'technology', 1, 'The day of two noons',
  `Until the mid-nineteenth century every town kept its own local time, set by the Sun. [Railways](railways)
  made the confusion impossible to ignore, with timetables listing dozens of local times. British railways
  adopted Greenwich time from 1847. North American railroads introduced standard time zones on 18 November
  1883, remembered as “the day of two noons.” A year later the International Meridian Conference chose
  Greenwich as the prime meridian ([longitude](longitude)). Time zones are political as well as practical.
  China, which spans about five geographical zones, uses one, and every
  [nation-state](nation-state) chooses its own clocks.`,
  { wiki: 'Time_zone', aliases: ['time zone', 'standard time'] });
E('time-zones', 'railways', 'historical', 'direct', 'factual', 0.98,
  'Railway companies introduced standard time — in Britain from 1847, in North America on 18 November 1883 — to make timetables workable.');
E('time-zones', 'nation-state', 'political', 'strong', 'factual', 0.88,
  'Governments legislate their time zones and daylight saving; China’s single national time zone is a political choice.');

C('atomic-clock', 'Atomic clock', 'technology', 1, 'Counting the heartbeat of caesium',
  `An atomic clock counts the vibrations of light absorbed or given off by atoms as they jump between
  energy levels. Those jumps are fixed by [quantum mechanics](quantum-mechanics) and identical in every
  atom of an element. Since 1967 the second has been defined as 9,192,631,770 cycles of the radiation from
  caesium-133, the foundation of the modern [metric system](metric-system). The best optical clocks would
  lose less than a second over the age of the universe. They are sensitive enough to detect
  [relativity](relativity)’s time dilation when one is lifted a few centimetres higher than another.
  [GPS](gps) satellites carry them.`);
E('atomic-clock', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.97,
  'Atomic clocks use quantised energy transitions of atoms, whose frequencies are identical for all atoms of an isotope.');
E('atomic-clock', 'metric-system', 'technological', 'direct', 'factual', 0.95,
  'The SI second, and through it the metre, is defined via the caesium-133 hyperfine transition frequency.');
E('atomic-clock', 'relativity', 'physical', 'strong', 'factual', 0.95,
  'Optical atomic clocks have measured gravitational time dilation over height differences of about 33 cm (2010) and less since.',
  ['chou2010']);
E('atomic-clock', 'gps', 'technological', 'direct', 'factual', 0.98,
  'Each GPS satellite carries atomic clocks; positioning depends on their nanosecond-level timing.');

C('gps', 'GPS', 'technology', 1, 'Position is time',
  `Each satellite in the Global Positioning System broadcasts the time from its on-board
  [atomic clocks](atomic-clock). A receiver works out where it is from the tiny differences in when those
  signals arrive, travelling at the [speed of light](speed-of-light). An error of one nanosecond is about
  thirty centimetres. Clocks in orbit run fast compared with clocks on the ground, by about 38
  microseconds a day once both parts of [relativity](relativity) are counted. Without corrections,
  positions would drift by kilometres every day. GPS also measures continents drifting
  ([plate tectonics](plate-tectonics)), solved [longitude](longitude) for everyone, and timestamps the
  trades of the financial system, a quiet infrastructure of [money](money).`,
  { wiki: 'Global_Positioning_System', aliases: ['global positioning system', 'satnav'] });
E('gps', 'speed-of-light', 'technological', 'direct', 'factual', 0.97,
  'GPS converts signal travel times to distances using the speed of light; 1 ns of timing error ≈ 30 cm of range error.');
E('gps', 'money', 'economic', 'subtle', 'factual', 0.78,
  'Financial exchanges and networks commonly use GPS-disciplined clocks to timestamp transactions precisely.');

C('measurement', 'Measurement', 'physics', 5, 'Comparing with a standard',
  `To measure is to compare with a standard, and every measurement comes with an uncertainty. Standard
  measures were an early instrument of [power](power): rulers enforced weights in markets and for taxes.
  The [metric system](metric-system) tried to make them universal, “for all times, for all peoples.”
  Measurement is the engine of [experimental science](experimental-science). Handling measurement error
  gave rise to much of [probability](probability) and statistics, since Gauss’s bell curve was first a
  theory of errors in astronomical observations. In [quantum mechanics](quantum-mechanics) measurement
  becomes deeply strange: outcomes are only probabilities, and measuring seems to change what is
  measured.`);
E('measurement', 'power', 'political', 'strong', 'factual', 0.85,
  'Control of weights and measures was a royal prerogative; Magna Carta (1215) demanded standard measures of wine, ale and corn throughout the realm.');
E('measurement', 'metric-system', 'technological', 'direct', 'factual', 0.98,
  'The metric system (now SI) is the international framework of standard units of measurement.');
E('measurement', 'experimental-science', 'conceptual', 'direct', 'factual', 0.95,
  'Quantitative measurement is how experiments test theories; precision measurements have repeatedly overturned or confirmed physical laws.');
E('measurement', 'probability', 'mathematical', 'strong', 'factual', 0.9,
  'Gauss and Laplace developed the normal distribution and least squares to handle errors in astronomical and geodetic measurements.');

C('metric-system', 'Metric system', 'technology', 2, 'For all times, for all peoples',
  `In 1791, in the rationalising spirit of the [French Revolution](french-revolution), the French Academy
  of Sciences proposed a new unit of length: one ten-millionth of the distance from the North Pole to the
  equator, measured along the meridian through [Paris](paris). Delambre and Méchain spent seven years
  surveying from Dunkirk to Barcelona. The system was decimal and meant to belong to everyone, “for all
  times, for all peoples.” Today its units rest on constants of nature. The metre is defined by the
  [speed of light](speed-of-light) (1983), the second by caesium, and since 2019 the kilogram by Planck’s
  constant, a quantity from [quantum mechanics](quantum-mechanics). It is the grammar of modern
  [measurement](measurement).`,
  { aliases: ['metre', 'meter', 'si units', 'kilogram'] });
E('metric-system', 'french-revolution', 'historical', 'direct', 'factual', 0.98,
  'The metric system was created by the French revolutionary government in the 1790s as a rational, universal replacement for local units.',
  ['alder2002']);
E('metric-system', 'paris', 'geographical', 'direct', 'factual', 0.95,
  'The metre was based on the Dunkirk–Barcelona survey of the Paris meridian; the international standards bureau (BIPM) sits at Sèvres near Paris.');
E('metric-system', 'quantum-mechanics', 'physical', 'direct', 'factual', 0.9,
  'Since 2019 the kilogram is defined by fixing Planck’s constant h, the fundamental constant of quantum mechanics.');

export default bundle();
