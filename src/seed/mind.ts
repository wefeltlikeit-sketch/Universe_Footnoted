import { seedBundle } from './dsl';

/** Number, structure, and the human institutions built on them. */
const { C, E, bundle } = seedBundle();

C('mathematics', 'Mathematics', 'mathematics', 5, 'The study of structure itself',
  `Mathematics began with practical problems: counting herds, measuring fields, predicting the sky
  ([astronomy](astronomy)). It became the study of structure itself. Babylonian scribes solved quadratic
  problems on clay tablets, and Greek mathematicians invented proof, which made [geometry](geometry) the
  model of certain knowledge. The algebra of [al-Khwarizmi](al-khwarizmi), [calculus](calculus),
  [probability](probability): each began as a tool and became a world of its own. The strangest fact about
  mathematics is how often structures invented for their own sake, like [linear algebra](linear-algebra)
  or the theory of [symmetry](symmetry), turn out to describe the physical universe. The physicist Eugene
  Wigner called it “the unreasonable effectiveness of mathematics,” and nowhere is it more unreasonable
  than in [quantum mechanics](quantum-mechanics).`,
  { aliases: ['math', 'maths'] });
E('mathematics', 'geometry', 'mathematical', 'direct', 'factual', 0.98,
  'Geometry is one of the oldest branches of mathematics; Euclid’s Elements set the axiomatic model for mathematical proof.');
E('mathematics', 'al-khwarizmi', 'historical', 'strong', 'factual', 0.92,
  'Al-Khwarizmi’s treatise on al-jabr (c. 820) founded algebra as a discipline and gave it its name.');
E('mathematics', 'calculus', 'mathematical', 'direct', 'factual', 0.97,
  'Calculus, developed by Newton and Leibniz, is the mathematics of continuous change and the foundation of analysis.');
E('mathematics', 'probability', 'mathematical', 'direct', 'factual', 0.95,
  'Probability theory, axiomatised by Kolmogorov in 1933, is a branch of mathematics grounded in measure theory.');
E('mathematics', 'linear-algebra', 'mathematical', 'direct', 'factual', 0.97,
  'Linear algebra — vectors, matrices, linear maps — is a core branch of mathematics used across science and engineering.');
E('mathematics', 'symmetry', 'mathematical', 'direct', 'factual', 0.95,
  'Group theory, the mathematics of symmetry, is a central field of algebra.');
E('mathematics', 'quantum-mechanics', 'mathematical', 'strong', 'interpretive', 0.85,
  'Wigner’s 1960 essay on the “unreasonable effectiveness” of mathematics took quantum mechanics as a key example of abstract mathematics fitting nature.',
  ['wigner1960']);

C('geometry', 'Geometry', 'mathematics', 4, 'Earth measurement, then everything',
  `Geometry means “earth [measurement](measurement)” in Greek. Herodotus says Egyptian officials remeasured
  fields after the Nile’s floods. Euclid’s Elements (around 300 BCE) turned it into a chain of proofs from
  a few axioms, the model of rigorous [mathematics](mathematics) for two thousand years. Medieval master
  masons used compass-and-straightedge geometry to lay out [Gothic cathedrals](gothic-cathedral).
  Descartes’ coordinates (1637) turned shapes into equations and pointed toward
  [linear algebra](linear-algebra). In the nineteenth century, non-Euclidean geometries showed that
  Euclid’s parallel postulate was not a necessity, and Einstein later used curved geometry to describe
  [gravity](relativity). In 1872 Felix Klein redefined the whole subject: a geometry is what stays
  unchanged under a group of [symmetries](symmetry).`);
E('geometry', 'measurement', 'linguistic', 'direct', 'factual', 0.95,
  'Greek geōmetria means “earth measurement”; the discipline originated in land surveying.');
E('geometry', 'gothic-cathedral', 'mathematical', 'direct', 'factual', 0.88,
  'Medieval masons designed plans, elevations and tracery with compass-and-straightedge constructions (e.g. Villard de Honnecourt’s sketchbook).');
E('geometry', 'linear-algebra', 'mathematical', 'direct', 'factual', 0.9,
  'Analytic geometry represents points as coordinate vectors; linear transformations generalise geometric operations like rotation and projection.');
E('geometry', 'symmetry', 'mathematical', 'direct', 'factual', 0.95,
  'Klein’s Erlangen programme (1872) characterised each geometry by its group of symmetry transformations.');

C('linear-algebra', 'Linear algebra', 'mathematics', 3, 'Arrows, and what you can do to them',
  `Linear algebra is the mathematics of vectors and of the transformations that stretch, rotate and project
  them. It grew out of solving systems of equations, which Chinese mathematicians did with counting rods in
  The Nine Chapters on the Mathematical Art, compiled by the first century CE, and out of Descartes’
  coordinate [geometry](geometry). Cayley and Sylvester formalised matrices in the 1850s. In 1925
  Heisenberg built his first version of [quantum mechanics](quantum-mechanics) using arrays of numbers
  whose multiplication did not commute. Max Born recognised them as matrices. Carried to infinitely many
  dimensions, linear algebra becomes [Hilbert space](hilbert-space). Today it runs [computers](computer):
  graphics, search engines and machine learning are mostly matrix arithmetic.`);
E('linear-algebra', 'quantum-mechanics', 'mathematical', 'direct', 'factual', 0.95,
  'Heisenberg’s 1925 matrix mechanics used non-commuting arrays that Born identified as matrices; quantum observables are linear operators.');
E('linear-algebra', 'hilbert-space', 'mathematical', 'direct', 'factual', 0.97,
  'A Hilbert space is a (possibly infinite-dimensional) vector space with an inner product — linear algebra extended by analysis.');
E('linear-algebra', 'computer', 'technological', 'strong', 'factual', 0.9,
  'Computer graphics, scientific computing, search ranking (PageRank) and neural networks are built on matrix computations.');

C('hilbert-space', 'Hilbert space', 'mathematics', 2, 'Geometry with infinitely many directions',
  `A Hilbert space extends ordinary Euclidean [geometry](geometry), with its lengths, angles and right
  angles, to infinitely many dimensions. It is named for David Hilbert, whose work on integral equations
  around 1904–10 led to it. John von Neumann gave the abstract definition in the late 1920s precisely to
  put [quantum mechanics](quantum-mechanics) on rigorous footing, with [linear algebra](linear-algebra)
  as its engine. Every quantum state is a vector in such a space, and a [measurement](measurement)
  projects that vector onto one of a set of perpendicular directions. [Dirac](dirac)’s notation made the
  space easy to write. A [quantum computer](quantum-computing) is, in effect, a machine for rotating
  vectors in an enormous but finite Hilbert space.`);
E('hilbert-space', 'geometry', 'mathematical', 'strong', 'factual', 0.9,
  'Hilbert spaces generalise Euclidean space: they have inner products, hence lengths, angles and orthogonality, in possibly infinite dimensions.');
E('hilbert-space', 'measurement', 'mathematical', 'strong', 'factual', 0.88,
  'In the standard formalism, a measurement corresponds to projecting the state vector onto eigenspaces of an observable (the projection postulate).');
E('hilbert-space', 'quantum-computing', 'technological', 'direct', 'factual', 0.96,
  'An n-qubit quantum computer’s state is a vector in a 2ⁿ-dimensional complex Hilbert space; gates are unitary transformations of it.');

C('probability', 'Probability', 'mathematics', 5, 'The mathematics of not knowing',
  `Probability theory began at the gambling table. In 1654 Blaise Pascal and Pierre de Fermat exchanged
  letters about how to split the stakes of an unfinished game. Within decades it was pricing annuities and
  [insurance](insurance). Gauss and Laplace turned it into a theory of [measurement](measurement) error.
  Boltzmann made [thermodynamics](thermodynamics) a matter of statistics. Then
  [quantum mechanics](quantum-mechanics) made probability fundamental: Born’s rule of 1926 says the theory
  predicts only the odds of outcomes. And in 1948 probability became the foundation of
  [information theory](information-theory).`,
  { aliases: ['chance', 'statistics', 'randomness'] });
E('probability', 'information-theory', 'mathematical', 'direct', 'factual', 0.95,
  'Shannon defined information and channel capacity in terms of probability distributions over messages.');

C('number', 'A number', 'mathematics', 3, 'An abstraction so good we forgot it was one',
  `A number is an abstraction so successful that we forget it is one: the discovery that three sheep and
  three days have something in common. In Mesopotamia the earliest [writing](writing) was mostly
  bookkeeping, tallies of grain and livestock. Place-value notation with a symbol for [zero](zero),
  developed in India, reached Europe through the Arabic-speaking world, not least through
  [al-Khwarizmi](al-khwarizmi). Counting grew into [mathematics](mathematics), and measuring grew into
  [geometry](geometry). The question “what is a number?” eventually led [Alan Turing](turing) to ask what
  it means to compute one.`,
  { wiki: 'Number', aliases: ['number', 'numbers', 'counting', 'a number'] });
E('number', 'writing', 'historical', 'direct', 'factual', 0.92,
  'Proto-cuneiform tablets from Uruk are overwhelmingly administrative accounts; numerical notation is among the oldest components of writing.');
E('number', 'zero', 'mathematical', 'direct', 'factual', 0.98,
  'Zero as a number, and positional notation that uses it, transformed numerals into an efficient system for calculation.');
E('number', 'al-khwarizmi', 'historical', 'strong', 'factual', 0.9,
  'Al-Khwarizmi’s treatise on Hindu numerals (c. 825), known in Latin as Algoritmi de numero Indorum, spread positional arithmetic westward.');
E('number', 'mathematics', 'mathematical', 'direct', 'factual', 0.98,
  'Arithmetic — the study of numbers — is the oldest part of mathematics; number theory remains one of its central fields.');
E('number', 'geometry', 'mathematical', 'strong', 'factual', 0.85,
  'Measurement ties numbers to geometric magnitudes; the Greek discovery of incommensurable lengths (√2) forced new ideas about number.');
E('number', 'turing', 'mathematical', 'strong', 'factual', 0.9,
  'Turing’s 1936 paper “On Computable Numbers” defined computability by asking which real numbers a machine could write out digit by digit.',
  ['turing1936']);

C('zero', 'Zero', 'mathematics', 2, 'The number for nothing',
  `As a placeholder, zero appears in Babylonian and Maya notation. As a number you can add, subtract and
  multiply, it was defined by the Indian mathematician Brahmagupta in 628 CE. Indian place-value numerals
  reached Baghdad, where [al-Khwarizmi](al-khwarizmi) wrote about them around 825. Fibonacci’s Liber Abaci
  (1202) carried them into Europe, where merchants prized them for keeping accounts and reckoning
  [money](money). The word comes from the Arabic ṣifr, “empty,” which also gave English “cipher,” and so
  zero sits at the root of the vocabulary of [cryptography](cryptography). Every
  [computer](computer) is built out of zeros and ones.`,
  { wiki: '0', aliases: ['0', 'nothing'] });
E('zero', 'al-khwarizmi', 'historical', 'direct', 'factual', 0.95,
  'Al-Khwarizmi’s book on Indian numerals, including zero, introduced positional arithmetic to the Arabic-speaking world and, in Latin translation, to Europe.');
E('zero', 'money', 'economic', 'strong', 'factual', 0.85,
  'Fibonacci’s Liber Abaci showed merchants how Hindu–Arabic numerals simplified bookkeeping, currency conversion and interest calculations.');
E('zero', 'cryptography', 'linguistic', 'subtle', 'factual', 0.9,
  'Arabic ṣifr (“empty”) became Latin cifra — the source of both “zero” and “cipher”; “cipher” later came to mean a secret code.');
E('zero', 'computer', 'mathematical', 'strong', 'factual', 0.85,
  'Digital computers represent all data in binary, a positional numeral system using only 0 and 1.');

C('al-khwarizmi', 'al-Khwarizmi', 'person', 1, 'c. 780–c. 850 · a name that became a word, twice',
  `Muhammad ibn Musa al-Khwarizmi was a scholar of the House of Wisdom in Abbasid Baghdad, at the heart of
  the [Islamic Golden Age](islamic-golden-age). His book on calculation by completion and balancing,
  al-jabr, gave the world the word algebra and a new branch of [mathematics](mathematics). His treatise on
  Hindu numerals brought place-value arithmetic and [zero](zero) to the Arabic world and, in Latin
  translation, to Europe. The Latin form of his name, Algoritmi, became the word
  [algorithm](algorithm). He also compiled tables for [astronomy](astronomy) and a geography of the known
  world.`,
  { wiki: 'Muhammad_ibn_Musa_al-Khwarizmi', aliases: ['al khwarizmi', 'alkhwarizmi', 'khwarizmi'] });
E('al-khwarizmi', 'islamic-golden-age', 'historical', 'direct', 'factual', 0.97,
  'Al-Khwarizmi worked in Baghdad under the Abbasid caliph al-Ma’mun, associated with the House of Wisdom.');
E('al-khwarizmi', 'algorithm', 'linguistic', 'direct', 'factual', 0.98,
  'The word “algorithm” derives from Algoritmi, the Latinised form of al-Khwarizmi’s name.');
E('al-khwarizmi', 'astronomy', 'biographical', 'strong', 'factual', 0.9,
  'Al-Khwarizmi compiled the Zij al-Sindhind, astronomical tables later translated into Latin.');

C('algorithm', 'Algorithm', 'mathematics', 3, 'A recipe precise enough for a machine',
  `An algorithm is a finite, precise recipe for solving a problem. Euclid’s method for finding the greatest
  common divisor of two [numbers](number), from around 300 BCE, is still in use. The word comes from
  [al-Khwarizmi](al-khwarizmi). In 1936 [Alan Turing](turing), and independently Alonzo Church, made the
  idea exact and proved that some problems have no algorithm at all. Algorithms run every
  [computer](computer). Euclid’s ancient method sits inside RSA, the basis of modern
  [cryptography](cryptography). And a quantum algorithm, Shor’s, could break RSA on a large enough
  [quantum computer](quantum-computing).`);
E('algorithm', 'number', 'mathematical', 'strong', 'factual', 0.85,
  'Euclid’s algorithm for the greatest common divisor is one of the oldest algorithms and is fundamental to number theory.');
E('algorithm', 'turing', 'mathematical', 'direct', 'factual', 0.97,
  'Turing machines (1936) gave a precise definition of algorithm and showed the halting problem is undecidable.');
E('algorithm', 'computer', 'technological', 'direct', 'factual', 0.98,
  'Computer programs are implementations of algorithms.');
E('algorithm', 'cryptography', 'mathematical', 'direct', 'factual', 0.9,
  'RSA key generation uses the extended Euclidean algorithm; cryptography is largely the design and analysis of algorithms.');
E('algorithm', 'quantum-computing', 'technological', 'direct', 'factual', 0.95,
  'Shor’s algorithm (1994) factors integers in polynomial time on a quantum computer.');

C('information-theory', 'Information theory', 'mathematics', 3, 'How much can a message say?',
  `In 1948 Claude Shannon of Bell Labs published “A Mathematical Theory of Communication.” He defined
  information as a reduction in uncertainty, measured in bits, using a formula mathematically identical to
  [entropy](entropy) in physics. He proved exact limits on how much can be sent through a noisy channel.
  The theory rests on [probability](probability) and underlies every [computer](computer), every
  compressed file and every error-correcting code. During the Second World War Shannon had also worked on
  [cryptography](cryptography), and in 1943 he met [Alan Turing](turing), who was visiting Bell Labs.
  Physicists now treat [information](information) itself as fundamental.`,
  { aliases: ['shannon', 'bits'] });
E('information-theory', 'computer', 'technological', 'strong', 'factual', 0.9,
  'Information theory underpins digital data compression, error-correcting codes and communication between computers.');
E('information-theory', 'cryptography', 'historical', 'direct', 'factual', 0.9,
  'Shannon’s classified 1945 report, published as “Communication Theory of Secrecy Systems” (1949), founded mathematical cryptography.');
E('information-theory', 'turing', 'biographical', 'subtle', 'factual', 0.88,
  'Turing visited Bell Labs in early 1943 to work on secure speech systems and met Shannon there.');
E('information-theory', 'information', 'conceptual', 'direct', 'factual', 0.98,
  'Information theory gives a precise quantitative measure of information (the bit).');

C('information', 'Information', 'mathematics', 5, 'A difference that makes a difference',
  `Information is “a difference that makes a difference,” in Gregory Bateson’s phrase.
  [Information theory](information-theory) made it measurable in bits, and it turned up everywhere.
  [DNA](dna) stores it. [Language](language) and [writing](writing) carry it. [Entropy](entropy) measures
  it when it is missing. Nothing carries it faster than [light](speed-of-light). The physicist John
  Wheeler went further and suggested “it from bit,” the idea that physical reality itself arises from
  information and that [quantum mechanics](quantum-mechanics) is the clue. The idea is thrilling but
  unproven.`);
E('information', 'language', 'linguistic', 'strong', 'factual', 0.85,
  'Language transmits information; Shannon estimated the redundancy and entropy of printed English (1951).');
E('information', 'writing', 'technological', 'strong', 'factual', 0.85,
  'Writing is a technology for storing and transmitting information across time and distance.');
E('information', 'quantum-mechanics', 'conceptual', 'subtle', 'speculative', 0.5,
  'Wheeler’s “it from bit” (1989) proposed that physical reality derives from information and yes/no quantum measurements. A provocative research programme, not established physics.');

C('symmetry', 'Symmetry', 'mathematics', 5, 'A change that changes nothing',
  `A symmetry is a change that leaves something the same. Turn a snowflake by sixty degrees, or reflect a
  face in a mirror. Mathematicians describe symmetries with group theory, which Évariste Galois invented
  before dying in a duel at twenty. In 1918 [Emmy Noether](noether) proved that every continuous symmetry
  of the laws of physics comes with a conserved quantity, and so symmetry in time gives the conservation
  of [energy](energy). [Relativity](relativity) rests on symmetry, and particle physicists have predicted
  new particles from symmetry patterns. In chemistry, [Pasteur](pasteur) found that the molecules of life
  come in mirror-image pairs and that life prefers one hand. One of physics’ deepest puzzles is a
  symmetry that failed: why is [antimatter](antimatter) so rare?`);
E('symmetry', 'noether', 'mathematical', 'direct', 'factual', 0.99,
  'Noether’s theorem links each continuous symmetry of a physical system’s action to a conservation law.',
  ['noether1918']);

C('noether', 'Emmy Noether', 'person', 1, '1882–1935 · the theorem behind conservation',
  `Emmy Noether was a German mathematician. As a woman she was barred from a regular faculty post, and for
  years she lectured at Göttingen under David Hilbert’s name. Hilbert and Felix Klein asked her to help
  with a puzzle about [energy](energy) in Einstein’s general [relativity](relativity). The result, her
  1918 theorem linking [symmetries](symmetry) to conservation laws, is one of the most important in
  physics. She went on to transform abstract algebra, a whole region of
  [mathematics](mathematics). In 1933 Nazi laws expelled her from her post, one of many scientists driven
  out by political [power](power). She emigrated to Bryn Mawr College in the United States and died there
  two years later. In an obituary letter Einstein called her the most significant creative mathematical genius since the higher education of women began.`,
  { wiki: 'Emmy_Noether', aliases: ['noether'] });
E('noether', 'relativity', 'historical', 'direct', 'factual', 0.95,
  'Hilbert and Klein invited Noether to Göttingen in 1915 to help with the status of energy conservation in general relativity, which led to her theorem.');
E('noether', 'mathematics', 'biographical', 'direct', 'factual', 0.95,
  'Noether was a founder of modern abstract algebra (rings, ideals, the “Noetherian” condition).');
E('noether', 'power', 'political', 'strong', 'factual', 0.9,
  'Noether was dismissed from Göttingen under the 1933 Nazi civil service law because she was Jewish.');

C('calculus', 'Calculus', 'mathematics', 3, 'The mathematics of change',
  `Calculus is the mathematics of change. Derivatives measure rates, and integrals add up the tiny
  pieces. [Newton](newton) and Leibniz invented it independently in the 1660s–80s, and their fight over who
  came first split English and Continental mathematicians for a century. Newton needed it to connect
  [gravity](gravity) to the shapes of orbits. Leibniz’s notation, dx and ∫, is the one that survived. It
  became the working language of [mathematics](mathematics) and physics, including the wave equation at
  the heart of [quantum mechanics](quantum-mechanics).`);
E('calculus', 'gravity', 'physical', 'direct', 'factual', 0.9,
  'Newton used the methods of calculus to derive orbital motion from an inverse-square gravitational force.');
E('calculus', 'quantum-mechanics', 'mathematical', 'strong', 'factual', 0.85,
  'Schrödinger’s equation is a partial differential equation — calculus is the working language of quantum dynamics.');

C('cryptography', 'Cryptography', 'mathematics', 2, 'Writing for the wrong reader to fail',
  `Cryptography is the art of writing secrets. Julius Caesar shifted letters of the alphabet. In
  ninth-century Baghdad, al-Kindi described frequency analysis, the first general method for breaking
  ciphers, a product of the [Islamic Golden Age](islamic-golden-age). In the Second World War
  [Alan Turing](turing) and colleagues at Bletchley Park broke Enigma messages with electromechanical
  machines, forerunners of the [computer](computer). Modern public-key cryptography (1976–77) depends on
  problems that are easy one way and hard the other, like multiplying two primes versus factoring their
  product ([number](number)). A large enough [quantum computer](quantum-computing) could break it. It also
  guards your [passport](passport).`,
  { aliases: ['encryption', 'cipher', 'codes'] });
E('cryptography', 'islamic-golden-age', 'historical', 'direct', 'factual', 0.95,
  'Al-Kindi’s 9th-century Manuscript on Deciphering Cryptographic Messages contains the earliest known description of frequency analysis.');
E('cryptography', 'turing', 'biographical', 'direct', 'factual', 0.98,
  'Turing led work at Bletchley Park on breaking Enigma, designing the electromechanical Bombe (1939–40).');
E('cryptography', 'computer', 'historical', 'strong', 'factual', 0.9,
  'Codebreaking drove early computing: the Bombe and the electronic Colossus (1943–44) at Bletchley Park.');
E('cryptography', 'number', 'mathematical', 'direct', 'factual', 0.95,
  'RSA’s security rests on the difficulty of factoring the product of two large primes — a problem of number theory.');
E('cryptography', 'quantum-computing', 'causal', 'direct', 'factual', 0.95,
  'Shor’s algorithm would let a large fault-tolerant quantum computer break RSA and elliptic-curve cryptography, motivating post-quantum cryptography.');

C('turing', 'Alan Turing', 'person', 2, '1912–1954 · what can be computed',
  `Alan Turing was an English mathematician. His 1936 paper “On Computable Numbers”
  ([number](number)) imagined a machine that reads and writes symbols on a tape, and proved that some
  problems cannot be solved by any [algorithm](algorithm). At Bletchley Park during the Second World War he
  led work on breaking Enigma ([cryptography](cryptography)). After the war he designed an early
  stored-program [computer](computer), and in 1950 he asked “Can machines think?” In 1952 he showed how
  uniform chemistry can spontaneously break [symmetry](symmetry) to make spots and stripes in living
  things. That same year he was prosecuted for homosexuality, a brutal exercise of state
  [power](power). He died in 1954 and was given a royal pardon in 2013.`,
  { wiki: 'Alan_Turing', aliases: ['turing'] });
E('turing', 'computer', 'biographical', 'direct', 'factual', 0.98,
  'Turing’s universal machine is the theoretical model of the stored-program computer; he designed the ACE (1945–46).');
E('turing', 'symmetry', 'mathematical', 'strong', 'factual', 0.9,
  'Turing’s 1952 paper “The Chemical Basis of Morphogenesis” showed reaction–diffusion systems can break symmetry to form patterns.');
E('turing', 'power', 'political', 'strong', 'factual', 0.95,
  'Turing was convicted of “gross indecency” in 1952 and subjected to chemical castration; he received a posthumous royal pardon in 2013.');

C('computer', 'Computer', 'technology', 3, 'A machine that follows rules about symbols',
  `A computer manipulates symbols by rules. [Turing](turing)’s abstract machine of 1936 defined what any
  computer can do. Working machines followed in the 1940s, driven partly by wartime
  [cryptography](cryptography) and ballistics. Every modern computer runs [algorithms](algorithm) on bits,
  [information](information) in Shannon’s sense, using transistors that work because of
  [quantum mechanics](quantum-mechanics). Charles Babbage’s nineteenth-century design for an Analytical
  Engine borrowed its punched cards from the Jacquard loom of the
  [Industrial Revolution](industrial-revolution). And a new kind of machine,
  [the quantum computer](quantum-computing), is trying to compute with physics itself.`,
  { aliases: ['computers', 'computing'] });
E('computer', 'information', 'conceptual', 'direct', 'factual', 0.95,
  'Computers store and transform information encoded in bits.');
E('computer', 'industrial-revolution', 'technological', 'strong', 'factual', 0.85,
  'Babbage adopted the punched cards used to program Jacquard looms (1804) for his Analytical Engine design (1837).');
E('computer', 'quantum-computing', 'technological', 'direct', 'factual', 0.95,
  'Quantum computers are a distinct model of computation using qubits; classical computers control and simulate them.');

C('quantum-computing', 'Quantum computing', 'technology', 2, 'Computing with the physics itself',
  `A quantum computer stores information in qubits, which can be in superpositions of 0 and 1. Qubits can
  be [entangled](entanglement), so n of them are described by a vector in a
  [Hilbert space](hilbert-space) of 2ⁿ dimensions. Richard Feynman suggested in 1981 that simulating
  nature might require such a machine. In 1994 Peter Shor found a quantum [algorithm](algorithm) that
  factors large numbers efficiently, which would break much of today’s [cryptography](cryptography).
  Building one is hard. Qubits lose their quantum behaviour when their surroundings effectively
  [measure](measurement) them, and holding off that loss of coherence is the central engineering battle.`,
  { aliases: ['quantum computer', 'qubits', 'qubit'] });
E('quantum-computing', 'measurement', 'physical', 'strong', 'factual', 0.85,
  'Decoherence — the environment effectively measuring a qubit — destroys superposition; quantum error correction exists to counter it.');

C('islamic-golden-age', 'Islamic Golden Age', 'history', 2, 'Translation, then invention',
  `From roughly the eighth to the thirteenth centuries, scholars writing in Arabic and Persian across the
  Abbasid caliphate and beyond translated Greek, Persian and Indian works and then went far beyond them.
  In Baghdad [al-Khwarizmi](al-khwarizmi) wrote on algebra. In Cairo Ibn al-Haytham transformed
  [optics](optics). Al-Kindi founded cryptanalysis ([cryptography](cryptography)). Astronomers built
  observatories and instruments ([astronomy](astronomy)), and chemists refined
  [distillation](distillation) and the laboratory arts inherited from [alchemy](alchemy). Much of this
  reached Europe through translations made in Spain and Sicily, and it fed the rise of
  [experimental science](experimental-science).`,
  { aliases: ['house of wisdom', 'medieval islamic science', 'islamic science'] });
E('islamic-golden-age', 'experimental-science', 'historical', 'strong', 'interpretive', 0.8,
  'Latin translations of Arabic science (optics, astronomy, medicine, mathematics) were major inputs to medieval and Renaissance European science.');

C('french-revolution', 'French Revolution', 'history', 3, 'Reason with a blade',
  `The Revolution of 1789 overthrew France’s absolute monarchy, declared the rights of man and rebuilt the
  country’s institutions from the ground up, in the faith in reason that came from the
  [Enlightenment](enlightenment). It created the [metric system](metric-system) and a decimal
  [calendar](calendar). It executed the king in 1793, and the chemist Lavoisier the following year, a loss
  to [chemistry](chemistry). It forged the modern [nation-state](nation-state): citizens instead of
  subjects, a mass national army, sovereignty belonging to the nation. It remade the idea of political
  [power](power), and its stage was [Paris](paris).`);
E('french-revolution', 'enlightenment', 'historical', 'direct', 'factual', 0.93,
  'Revolutionary ideals — rights, popular sovereignty, rational reform — drew heavily on Enlightenment writers such as Rousseau and Montesquieu.');
E('french-revolution', 'calendar', 'historical', 'direct', 'factual', 0.97,
  'The French Republican Calendar (1793–1805) used 10-day weeks (décades) and renamed months after seasons.');
E('french-revolution', 'nation-state', 'historical', 'direct', 'factual', 0.9,
  'The Revolution asserted national sovereignty and introduced mass conscription (levée en masse, 1793), foundational features of the modern nation-state.');
E('french-revolution', 'power', 'political', 'strong', 'factual', 0.9,
  'The Revolution replaced divine-right monarchy with the principle that sovereignty resides in the nation.');
E('french-revolution', 'paris', 'geographical', 'direct', 'factual', 0.97,
  'The storming of the Bastille, the Terror and most revolutionary government took place in Paris.');

C('enlightenment', 'Enlightenment', 'history', 3, 'Dare to know',
  `The Enlightenment was an eighteenth-century movement that put reason, evidence and criticism above
  tradition and authority. Its hero was [Newton](newton), whose laws seemed to show that nature is orderly
  and knowable, and Voltaire and Émilie du Châtelet brought Newton to France. Diderot and d’Alembert’s
  Encyclopédie, a triumph of the [printing press](printing-press), tried to gather all knowledge. Pierre
  Bayle’s Dictionary, largely made of [footnotes](footnote), was one of its founding texts of scepticism.
  It argued its case in salons and [coffeehouses](coffeehouses), prized
  [experiment](experimental-science), and its ideas about rights and [power](power) fed revolutions. Its
  blind spots have been argued over ever since.`,
  { wiki: 'Age_of_Enlightenment', aliases: ['age of enlightenment', 'age of reason'] });
E('enlightenment', 'printing-press', 'technological', 'strong', 'factual', 0.85,
  'The Encyclopédie (1751–72) and the explosion of books, pamphlets and periodicals made the Enlightenment a print culture.');
E('enlightenment', 'footnote', 'cultural', 'subtle', 'interpretive', 0.72,
  'Anthony Grafton’s history of the footnote places Pierre Bayle’s note-laden Historical and Critical Dictionary (1697) at the root of Enlightenment critical scholarship.',
  ['grafton1997']);
E('enlightenment', 'experimental-science', 'conceptual', 'strong', 'factual', 0.85,
  'Enlightenment thinkers promoted empirical, experimental inquiry — following Bacon, Newton and Locke — as the model for all knowledge.');
E('enlightenment', 'power', 'political', 'strong', 'factual', 0.85,
  'Locke, Montesquieu and Rousseau developed theories of natural rights, separation of powers and popular sovereignty.');

C('nation-state', 'Nation-state', 'politics', 3, 'An imagined community with borders',
  `A nation-state is a state whose legitimacy rests on the claim that it embodies a nation, a people with a
  shared identity. Historians usually date the modern form to the [French Revolution](french-revolution)
  and the nineteenth century. Benedict Anderson called nations “imagined communities,” held together by
  the [printing press](printing-press), by national newspapers and by standardised
  [languages](language). Nation-states issue [money](money) and [passports](passport), and they fight
  [world wars](world-war-i). Max Weber defined the state by its monopoly on the legitimate use of force,
  the sharpest form of [power](power).`,
  { wiki: 'Nation_state', aliases: ['nation state', 'nation', 'nationalism', 'state'] });
E('nation-state', 'printing-press', 'cultural', 'strong', 'interpretive', 0.8,
  'Benedict Anderson argued print capitalism — newspapers and novels in vernacular languages — let people imagine themselves as a nation.',
  ['anderson1983']);
E('nation-state', 'language', 'cultural', 'strong', 'factual', 0.85,
  'Nation-building often involved standardising a national language through schooling and administration (e.g. French in 19th-century France).');
E('nation-state', 'money', 'economic', 'direct', 'factual', 0.9,
  'Modern states issue national currencies through central banks and treat monetary sovereignty as a core power.');
E('nation-state', 'passport', 'historical', 'direct', 'factual', 0.95,
  'Passports are issued by states to certify nationality; they embody the state’s claim to identify and control the movement of its people.',
  ['torpey2000']);
E('nation-state', 'world-war-i', 'historical', 'strong', 'factual', 0.9,
  'WWI was fought by mass-mobilised nation-states; its peace settlements created new nation-states from collapsed empires.');
E('nation-state', 'power', 'political', 'direct', 'factual', 0.95,
  'Weber defined the state as the community that successfully claims a monopoly on the legitimate use of physical force within a territory.');

C('world-war-i', 'First World War', 'history', 2, 'The industrial war',
  `Between 1914 and 1918 an industrialised war killed around nine million soldiers and millions of
  civilians. It was a war of the [Industrial Revolution](industrial-revolution): machine guns, artillery,
  mobilisation by [railway](railways), and poison gas made by industrial [chemistry](chemistry). It
  destroyed four empires and multiplied [nation-states](nation-state) across Europe. Border controls
  brought in for wartime security never went away, and they became the modern [passport](passport)
  system. French soldiers found [Camembert](camembert) in their rations. Penicillin did not exist yet,
  and a young doctor named [Alexander Fleming](fleming) watched infected wounds kill.`,
  { wiki: 'World_War_I', aliases: ['ww1', 'wwi', 'first world war', 'great war', 'world war i'] });
E('world-war-i', 'industrial-revolution', 'historical', 'direct', 'factual', 0.9,
  'WWI’s scale and lethality came from industrial mass production of weapons, shells and supplies.');
E('world-war-i', 'railways', 'historical', 'strong', 'factual', 0.9,
  'Mobilisation plans in 1914 were built around railway timetables; railways moved millions of troops to the fronts.');
E('world-war-i', 'chemistry', 'historical', 'strong', 'factual', 0.9,
  'Chemical weapons such as chlorine (first used at scale in 1915, under Fritz Haber’s direction) and mustard gas were products of industrial chemistry.');
E('world-war-i', 'passport', 'historical', 'direct', 'factual', 0.93,
  'Wartime passport requirements introduced in 1914–15 were retained afterward; the 1920 League of Nations conference standardised passports.',
  ['torpey2000']);

C('industrial-revolution', 'Industrial Revolution', 'history', 3, 'When growth began',
  `Starting in Britain around 1760, production moved from hand tools and water wheels to machines,
  factories and coal-fired [steam](steam-engine). Output per person began to rise steadily, a break with
  thousands of years of slow growth. It remade [cities](cities), turned [energy](energy) from muscle into
  fossil fuel, and gave Britain unprecedented [power](power). It also began the large-scale burning of
  ancient carbon. [Railways](railways) became its arteries.`);
E('industrial-revolution', 'cities', 'historical', 'direct', 'factual', 0.95,
  'Industrialisation drove rapid urbanisation; Manchester and other factory towns grew explosively in the early 19th century.');
E('industrial-revolution', 'power', 'political', 'strong', 'interpretive', 0.8,
  'Industrial capacity underpinned 19th-century British economic and imperial dominance; historians debate how much empire in turn fuelled industry.');
E('industrial-revolution', 'railways', 'technological', 'direct', 'factual', 0.95,
  'Railways, born of steam technology and iron, became the Industrial Revolution’s transport backbone from the 1830s.');

C('railways', 'Railways', 'technology', 2, 'Machines that shrank a country',
  `The first public steam railway, the Stockton and Darlington, opened in 1825. The Liverpool and
  Manchester of 1830 was the first intercity line worked entirely by [steam engines](steam-engine).
  Railways shrank distance and time. Fresh milk, fish and soft cheeses like [Camembert](camembert) reached
  [cities](cities) in hours. They forced towns to agree on the time, which gave us [time zones](time-zones).
  They were the backbone of the [industrial economy](industrial-revolution), and they helped bind regions
  into [nations](nation-state).`,
  { wiki: 'Rail_transport', aliases: ['railway', 'railroad', 'trains', 'train'] });
E('railways', 'cities', 'economic', 'strong', 'factual', 0.85,
  'Railways supplied growing cities with perishable food, fuel and commuters, reshaping urban economies and suburbs.');
E('railways', 'nation-state', 'historical', 'strong', 'interpretive', 0.75,
  'Historians credit national rail networks with integrating markets and regions in 19th-century nation-building (e.g. Germany, Italy, the US).');

C('gothic-cathedral', 'Gothic cathedrals', 'art', 2, 'Stone arranged to hold light',
  `Gothic architecture began around 1140 at the abbey church of Saint-Denis, just north of
  [Paris](paris), rebuilt by Abbot Suger, who wanted a church flooded with [light](light), light he
  understood as divine. Pointed arches, ribbed vaults and flying buttresses carried the weight of stone
  outside the walls, freeing them for stained glass. Master masons had no modern theory of structures.
  They worked with practical [geometry](geometry), compass-and-rule methods handed down in their lodges.
  Cathedrals took generations to build and were the civic projects of rich [cities](cities). Stone from
  [Normandy](normandy) crossed to England for Canterbury. Centuries later Claude Monet painted Rouen
  Cathedral more than thirty times, at every hour, and it became a subject of
  [Impressionism](impressionism).`,
  { wiki: 'Gothic_architecture', aliases: ['gothic cathedral', 'cathedral', 'cathedrals', 'gothic architecture'] });
E('gothic-cathedral', 'paris', 'historical', 'direct', 'factual', 0.95,
  'Gothic architecture originated at the Abbey of Saint-Denis near Paris (choir consecrated 1144); Notre-Dame de Paris followed from 1163.');
E('gothic-cathedral', 'cities', 'economic', 'strong', 'factual', 0.85,
  'Cathedral construction was financed by bishops, chapters and urban wealth; cathedrals were symbols of civic pride in growing medieval towns.');
E('gothic-cathedral', 'impressionism', 'cultural', 'direct', 'factual', 0.95,
  'Monet’s Rouen Cathedral series (1892–94) comprises more than thirty views of the façade in different light.');

C('impressionism', 'Impressionism', 'art', 1, 'Painting the light, not the thing',
  `Impressionism was a movement of painters in France in the 1860s–80s: Monet, Renoir, Pissarro, Morisot,
  Degas and others. It was named, mockingly, after Monet’s Impression, Sunrise (1872), painted in the
  harbour of Le Havre in [Normandy](normandy). They painted outdoors and fast, to catch fleeting
  [light](light) and weather. Ready-made paint in portable tin tubes, together with new synthetic pigments
  from [chemistry](chemistry), made that possible. Their first group exhibition, in 1874, was held in the
  former studio of the photographer Nadar ([photography](photography)). Monet’s series of haystacks,
  poplars and [cathedrals](gothic-cathedral) are experiments in [time](time), the same subject painted
  again and again as the hours changed.`);
E('impressionism', 'chemistry', 'technological', 'strong', 'factual', 0.85,
  'The collapsible metal paint tube (1841) and new synthetic pigments (e.g. cobalt blue, synthetic ultramarine) enabled plein-air painting.');
E('impressionism', 'time', 'cultural', 'subtle', 'interpretive', 0.7,
  'Monet’s series paintings depict one motif at different hours and seasons, making the passage of time their subject.');

C('paris', 'Paris', 'geography', 2, 'An island in a river, then a capital of ideas',
  `Paris grew where the Île de la Cité made the Seine easy to cross, and it takes its name from the
  Parisii, a Gallic tribe. It was the stage of the [French Revolution](french-revolution) and the
  birthplace of the [metric system](metric-system), whose metre came from a survey of the meridian through
  Paris. Gothic architecture was born just north of it ([Saint-Denis](gothic-cathedral)). Here Daguerre
  announced [photography](photography), Foucault’s [pendulum](pendulum) swung in the Panthéon, and the
  [Curies](curie) discovered radium. Haussmann rebuilt it into the model of the modern
  [city](cities).`,
  { aliases: ['paris france'] });

C('printing-press', 'Printing press', 'technology', 3, 'The machine that fixed the page',
  `Around 1440–50 in Mainz, Johannes Gutenberg combined movable metal type, oil-based ink and a screw
  press, and his Bible appeared around 1455. Printing had older roots in China and Korea. Within fifty
  years, presses in hundreds of European towns had turned out millions of books, multiplying
  [writing](writing) as nothing had before. Print standardised texts and let scientists build on one
  another’s exact results, which helped [experimental science](experimental-science) become cumulative.
  Once every copy had the same page numbers, scholars could cite them precisely, with indexes, references
  and the [footnote](footnote). The historian Benedict Anderson argued that print made
  [nations](nation-state) imaginable. It fuelled the [Enlightenment](enlightenment).`,
  { aliases: ['gutenberg', 'printing', 'movable type'] });
E('printing-press', 'writing', 'technological', 'direct', 'factual', 0.95,
  'The printing press mechanised the reproduction of written texts, vastly increasing their number and uniformity.');
E('printing-press', 'experimental-science', 'historical', 'strong', 'interpretive', 0.8,
  'Elizabeth Eisenstein argued print’s fixity and wide dissemination of accurate data and diagrams was essential to the Scientific Revolution.');
E('printing-press', 'footnote', 'technological', 'direct', 'interpretive', 0.8,
  'Identical pagination across printed copies made precise citation practical, enabling the scholarly apparatus of references and footnotes.');

C('footnote', 'The footnote', 'language', 1, 'You are here',
  `The footnote is a small machine for honesty. It lets a text show where its claims come from, and argue
  with itself at the bottom of the page. Historians trace the scholarly footnote to the seventeenth and
  eighteenth centuries. Pierre Bayle’s Dictionary was a vast structure of notes upon notes, at the root of
  the [Enlightenment](enlightenment), and Edward Gibbon made footnotes an art of wit. They depended on the
  fixed page numbers of the [printing press](printing-press). A footnote is a door out of a text into
  everything else, a quiet extension of [writing](writing) itself. Which is to say, this is where you are.`,
  { wiki: 'Note_(typography)', aliases: ['footnotes', 'footnote', 'marginalia'] });
E('footnote', 'writing', 'cultural', 'strong', 'factual', 0.88,
  'Notes, glosses and marginalia are part of the long history of textual apparatus in written scholarship.');

C('language', 'Language', 'language', 5, 'The oldest technology',
  `Every human society has language, and every child learns it without being taught. About 7,000 languages
  are spoken today. They change constantly and branch into families. French and English both descend, by
  different routes, from Proto-Indo-European, and historical linguists reconstruct lost ancestors much as
  biologists reconstruct lineages ([evolution](evolution)). English itself was reshaped by the conquerors
  from [Normandy](normandy). [Writing](writing) is a recent technology for recording language, only about
  5,000 years old. Language carries [information](information). Standardised national languages were a
  project of the [nation-state](nation-state).`,
  { aliases: ['languages', 'linguistics', 'words'] });
E('language', 'writing', 'linguistic', 'direct', 'factual', 0.97,
  'Writing systems are visual representations of spoken (or signed) language.');

C('writing', 'Writing', 'language', 4, 'Memory outside the body',
  `Writing was invented independently at least three or four times: in Mesopotamia around 3200 BCE, and in
  Egypt, China and Mesoamerica. In Mesopotamia it grew out of accounting, as temple and palace
  administrators in [cities](cities) like Uruk tallied grain and livestock. [Numbers](number) came before
  literature. Writing stretched memory beyond a single lifetime. It made possible law codes,
  [mathematics](mathematics) and centuries-long records of the sky ([astronomy](astronomy)). The
  [printing press](printing-press) multiplied it, and the [footnote](footnote) disciplined it. At bottom
  it is a technology for [language](language).`,
  { aliases: ['script', 'cuneiform', 'alphabet'] });
E('writing', 'mathematics', 'historical', 'strong', 'factual', 0.9,
  'Mesopotamian scribes’ clay tablets record sophisticated mathematics (e.g. Plimpton 322); written notation made complex calculation transmissible.');
E('writing', 'astronomy', 'historical', 'strong', 'factual', 0.9,
  'Babylonian Astronomical Diaries record observations from c. 650 BCE onward — centuries of data only writing could preserve.');

C('money', 'Money', 'economics', 5, 'A belief everyone agrees to share',
  `Money is a shared belief that does three jobs: a medium of exchange, a unit of account and a store of
  value. Mesopotamian temples kept accounts in barley and in [silver](silver) by weight long before there
  were [coins](coins), and money and [writing](writing) grew up together as record-keeping. Paper money
  began in Song-dynasty China. Money made [insurance](insurance) and stock markets possible. From 1696
  [Isaac Newton](newton) ran England’s Royal Mint. Money is a form of [power](power) that states guard
  jealously, and today most of it is simply [information](information) in a ledger.`,
  { aliases: ['currency', 'cash', 'finance'] });
E('money', 'coins', 'economic', 'direct', 'factual', 0.95,
  'Coins are standardised pieces of metal money, first minted in Lydia in the 7th century BCE.');
E('money', 'writing', 'historical', 'strong', 'factual', 0.85,
  'Mesopotamian accounting in silver and barley units on clay tablets shows money as a unit of account emerging alongside writing.');
E('money', 'power', 'political', 'direct', 'factual', 0.9,
  'Issuing currency, taxing and borrowing are central powers of states; control of money confers political power.');
E('money', 'information', 'economic', 'strong', 'factual', 0.85,
  'Most money today exists as digital bank-ledger entries rather than physical cash.');

C('coins', 'Coins', 'economics', 1, 'A promise stamped in metal',
  `The first coins were struck in Lydia, in western Anatolia, in the seventh century BCE, from electrum, a
  natural alloy of gold and [silver](silver). A stamped image guaranteed weight and purity, so a coin was a
  promise made by [power](power) in the form of [money](money). Clipping and counterfeiting coins were
  serious crimes. As Warden of the Mint, [Isaac Newton](newton) personally hunted counterfeiters and saw
  the most notorious of them hanged. Testing coins for purity, called assaying, was one of the roots of
  quantitative [chemistry](chemistry).`,
  { wiki: 'Coin', aliases: ['coin', 'coinage'] });
E('coins', 'power', 'political', 'strong', 'factual', 0.85,
  'Coins bore the marks of rulers and cities, whose authority guaranteed their weight and fineness.');
E('coins', 'newton', 'biographical', 'strong', 'factual', 0.95,
  'As Warden of the Royal Mint, Newton investigated and prosecuted counterfeiters, including William Chaloner, executed in 1699.');
E('coins', 'chemistry', 'technological', 'subtle', 'interpretive', 0.72,
  'Assaying precious-metal coinage developed careful quantitative techniques (cupellation, precise weighing) that fed into analytical chemistry.');

C('power', 'Power', 'politics', 5, 'The capacity to make others act',
  `Power is the capacity to make things happen. In physics it is [energy](energy) per unit of time. In
  human affairs it is the capacity to shape what others do. The farming surplus of the
  [Neolithic Revolution](neolithic-revolution) supported rulers, soldiers and priests. States have always
  tried to fix standard [measures](measurement), issue [money](money) and control movement with documents
  like the [passport](passport). Max Weber defined the [state](nation-state) by its monopoly on
  legitimate force. Knowledge and power are tangled too: Francis Bacon wrote that knowledge itself is
  power, and [Galileo](galileo) found out the other side of that.`,
  { wiki: 'Power_(social_and_political)', aliases: ['political power', 'authority'] });
E('power', 'energy', 'analogical', 'subtle', 'analogical', 0.6,
  'Physical power (energy per unit time) and social power share a word and a metaphor — capacity to produce effects — but not a mechanism.');
E('power', 'passport', 'historical', 'strong', 'interpretive', 0.8,
  'John Torpey describes passports as the state’s “monopolisation of the legitimate means of movement”, extending Weber’s idea of state power.',
  ['torpey2000']);

C('experimental-science', 'Experimental science', 'philosophy', 4, 'Asking nature, not authority',
  `Experimental science rests on the idea that you learn about nature by deliberately interfering with it,
  under controlled conditions, and recording what happens, instead of relying only on reasoning or on
  authority. Ibn al-Haytham tested claims about light by experiment ([optics](optics)). Francis Bacon made
  experiment a programme in 1620, and [Galileo](galileo) rolled balls down ramps and timed them. Its engine
  is [measurement](measurement), its currency is published, repeatable results, and the
  [printing press](printing-press) made both possible. From [Pasteur](pasteur)’s flasks to the
  [germ theory](germ-theory), its modern form includes controlled trials and statistics, which is to say
  [probability](probability).`,
  { wiki: 'Scientific_method', aliases: ['scientific method', 'experiment', 'science', 'empiricism'] });
E('experimental-science', 'probability', 'mathematical', 'strong', 'factual', 0.85,
  'Modern experimental design and inference (randomised trials, significance testing — Fisher, 1920s–30s) are built on probability theory.');

C('calendar', 'Calendar', 'history', 2, 'Reconciling cycles that do not divide',
  `A calendar reconciles cycles that don’t divide evenly into each other: the day, the lunar month of about
  29.5 days, and the solar year of about 365.24 days. Keeping track of them drove early
  [astronomy](astronomy) and [mathematics](mathematics). Julius Caesar’s calendar added a leap day every
  four years. By 1582 it had drifted ten days, and Pope Gregory XIII dropped them. The
  [French Revolution](french-revolution) tried to abolish the week altogether. The Islamic calendar still
  follows the [Moon](moon) alone. Every calendar is a negotiation with [time](time).`,
  { aliases: ['calendars', 'gregorian calendar'] });
E('calendar', 'astronomy', 'historical', 'direct', 'factual', 0.95,
  'Calendars are built on astronomical cycles; maintaining them required systematic observation of the Sun and Moon.');
E('calendar', 'mathematics', 'mathematical', 'strong', 'factual', 0.85,
  'Reconciling incommensurable cycles (e.g. the 19-year Metonic cycle, Easter computus) is a classic problem of arithmetic.');
E('calendar', 'time', 'conceptual', 'direct', 'factual', 0.9,
  'Calendars organise time into days, months and years for social and religious life.');

C('passport', 'A passport', 'history', 1, 'Permission to exist elsewhere',
  `Documents promising safe passage are ancient. The passport as a routine requirement is modern. Before
  1914 much of Europe could be crossed without one, but [the First World War](world-war-i) brought passport
  controls for security, and they stayed. In 1920 a League of Nations conference agreed on a standard
  booklet. The passport made the [nation-state](nation-state)’s claim on its people portable, and it
  needed a way to tie a document to a face: the [photograph](photography). In 1922 the League created the
  Nansen passport for stateless refugees, an admission that without papers a person had almost no
  standing before [power](power). Today’s passports carry a chip whose data is signed with
  [cryptography](cryptography).`,
  { wiki: 'Passport', aliases: ['passport', 'passports', 'visa', 'a passport'] });
E('passport', 'cryptography', 'technological', 'direct', 'factual', 0.95,
  'Biometric e-passports (ICAO 9303) store data on a chip digitally signed with public-key cryptography to prevent forgery.');

export default bundle();
